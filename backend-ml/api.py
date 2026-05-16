"""FastAPI service exposing /predict for the Next.js frontend."""

from __future__ import annotations

import logging
import os
import time
from contextlib import asynccontextmanager
from dataclasses import asdict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict import ModelNotTrainedError, get_model

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s %(message)s")
log = logging.getLogger("ml-api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    model = get_model()
    try:
        model.load()
        log.info("Model loaded successfully")
    except ModelNotTrainedError as e:
        log.warning("Model not trained yet: %s", e)
    yield


app = FastAPI(
    title="Fake News Detector ML API",
    version="1.0.0",
    description="TF-IDF + Logistic Regression classifier for news articles.",
    lifespan=lifespan,
)

origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=20_000)


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: dict
    insights: list[str]
    elapsed_ms: float


@app.get("/")
def root():
    model = get_model()
    return {
        "service": "fake-news-detector-ml",
        "status": "ready" if model.is_loaded else "model_not_loaded",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    model = get_model()
    return {"status": "ok", "model_loaded": model.is_loaded}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    model = get_model()
    if not model.is_loaded:
        try:
            model.load()
        except ModelNotTrainedError as e:
            raise HTTPException(status_code=503, detail=str(e))

    started = time.perf_counter()
    try:
        result = model.predict(req.text)
    except Exception as e:
        log.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
    payload = asdict(result)
    payload["elapsed_ms"] = elapsed_ms
    return payload


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=os.getenv("RELOAD", "false").lower() == "true",
    )

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

# Pre-download NLTK stopwords so first request is fast
RUN python -c "import nltk; nltk.download('stopwords', quiet=True)"

COPY . .

# Train on the seed dataset at build time so the image ships ready-to-serve.
# Replace data/seed.csv with the Kaggle dataset before building for production.
RUN python train.py || echo "[warn] Initial training skipped — train at runtime."

EXPOSE 8000

# Shell form so $PORT (set by Render) is expanded at runtime; defaults to 8000 locally.
CMD uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}

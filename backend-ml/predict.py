"""Single-text prediction helpers, importable by api.py."""

from __future__ import annotations

from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Optional

import joblib
import numpy as np

from preprocessing import clean_text, quick_features

ROOT = Path(__file__).parent
MODEL_DIR = ROOT / "model"


class ModelNotTrainedError(RuntimeError):
    pass


@dataclass
class Prediction:
    prediction: str          # "REAL" | "FAKE"
    confidence: float        # 0..100
    probabilities: dict      # {"real": 0..1, "fake": 0..1}
    insights: List[str]


class FakeNewsModel:
    def __init__(self, model_dir: Path = MODEL_DIR):
        self._dir = model_dir
        self._vectorizer = None
        self._clf = None

    def load(self) -> None:
        v_path = self._dir / "vectorizer.pkl"
        m_path = self._dir / "model.pkl"
        if not v_path.exists() or not m_path.exists():
            raise ModelNotTrainedError(
                f"Model artifacts not found in {self._dir}. "
                "Run `python train.py` first."
            )
        self._vectorizer = joblib.load(v_path)
        self._clf = joblib.load(m_path)

    @property
    def is_loaded(self) -> bool:
        return self._vectorizer is not None and self._clf is not None

    def predict(self, text: str) -> Prediction:
        if not self.is_loaded:
            self.load()

        cleaned = clean_text(text)
        if not cleaned:
            return Prediction(
                prediction="FAKE",
                confidence=50.0,
                probabilities={"real": 0.5, "fake": 0.5},
                insights=["Input contained no analyzable tokens after cleaning."],
            )

        vec = self._vectorizer.transform([cleaned])
        probs = self._clf.predict_proba(vec)[0]
        # class 0 = FAKE, class 1 = REAL (set in train.py)
        # but be defensive in case labels are different
        classes = list(self._clf.classes_)
        idx_real = classes.index(1) if 1 in classes else None
        idx_fake = classes.index(0) if 0 in classes else None

        if idx_real is None or idx_fake is None:
            # Fallback: assume binary, use first as fake / second as real
            p_fake, p_real = float(probs[0]), float(probs[-1])
        else:
            p_real = float(probs[idx_real])
            p_fake = float(probs[idx_fake])

        label = "REAL" if p_real >= p_fake else "FAKE"
        confidence = max(p_real, p_fake) * 100.0

        return Prediction(
            prediction=label,
            confidence=round(confidence, 2),
            probabilities={
                "real": round(p_real, 4),
                "fake": round(p_fake, 4),
            },
            insights=_build_insights(text, label, confidence),
        )


def _build_insights(text: str, label: str, conf: float) -> List[str]:
    feats = quick_features(text)
    out: List[str] = []

    if conf >= 90:
        out.append(f"Model is highly confident this article is {label.lower()}.")
    elif conf >= 70:
        out.append(f"Moderate confidence — leaning {label.lower()}.")
    else:
        out.append("Low confidence — consider manual verification.")

    if feats["shouting_words"] >= 5:
        out.append(
            f"Detected {feats['shouting_words']} all-caps words — common in sensational headlines."
        )
    if feats["exclamation_count"] >= 5:
        out.append(
            f"{feats['exclamation_count']} exclamation marks present — emotional tone."
        )
    if feats["word_count"] < 20:
        out.append("Very short input — accuracy improves with longer articles.")

    return out


# Module-level singleton for the FastAPI app
_model_instance: Optional[FakeNewsModel] = None


def get_model() -> FakeNewsModel:
    global _model_instance
    if _model_instance is None:
        _model_instance = FakeNewsModel()
    return _model_instance


if __name__ == "__main__":
    import sys
    sample = " ".join(sys.argv[1:]) or (
        "BREAKING: Scientists discover new species of bioluminescent fish in "
        "Mariana Trench, expanding our understanding of deep-sea ecosystems."
    )
    m = get_model()
    m.load()
    result = m.predict(sample)
    import json
    print(json.dumps(asdict(result), indent=2))

"""Train the TF-IDF + LogisticRegression fake-news classifier.

Behavior:
  1. If `data/Fake.csv` and `data/True.csv` exist (Kaggle layout), use them.
  2. Otherwise fall back to `data/seed.csv` (bundled tiny demo dataset).
  3. Save vectorizer.pkl and model.pkl into ./model/.

Run:
    python train.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split

from preprocessing import clean_corpus

ROOT = Path(__file__).parent
DATA_DIR = ROOT / "data"
MODEL_DIR = ROOT / "model"
MODEL_DIR.mkdir(exist_ok=True)


def load_dataset() -> pd.DataFrame:
    fake_path = DATA_DIR / "Fake.csv"
    true_path = DATA_DIR / "True.csv"
    seed_path = DATA_DIR / "seed.csv"

    if fake_path.exists() and true_path.exists():
        print(f"[data] Using Kaggle dataset: {fake_path.name} + {true_path.name}")
        fake = pd.read_csv(fake_path)
        true = pd.read_csv(true_path)
        fake["label"] = 0  # 0 = FAKE
        true["label"] = 1  # 1 = REAL
        df = pd.concat([fake, true], ignore_index=True)
        text_cols = [c for c in ("title", "text") if c in df.columns]
        if not text_cols:
            raise RuntimeError("Kaggle CSVs missing 'title'/'text' columns")
        df["combined"] = df[text_cols].fillna("").agg(" ".join, axis=1)
        return df[["combined", "label"]].rename(columns={"combined": "text"})

    if seed_path.exists():
        print(f"[data] Using bundled seed dataset: {seed_path.name}")
        return pd.read_csv(seed_path)

    raise FileNotFoundError(
        "No dataset found. Place Kaggle Fake.csv + True.csv in ./data/ "
        "or keep the bundled seed.csv."
    )


def main() -> int:
    df = load_dataset()
    df = df.dropna(subset=["text", "label"]).copy()
    df["label"] = df["label"].astype(int)

    print(f"[data] Records: {len(df):,}  "
          f"REAL: {(df.label == 1).sum():,}  FAKE: {(df.label == 0).sum():,}")

    print("[preprocess] Cleaning corpus…")
    cleaned = clean_corpus(df["text"].astype(str).tolist())

    test_size = 0.2 if len(df) >= 50 else 0.25
    X_train, X_test, y_train, y_test = train_test_split(
        cleaned, df["label"].values, test_size=test_size, random_state=42,
        stratify=df["label"].values if df["label"].nunique() > 1 else None,
    )

    print("[vectorize] Fitting TF-IDF…")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=50_000,
        min_df=1,
        max_df=0.9,
        sublinear_tf=True,
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    print("[train] Logistic regression…")
    model = LogisticRegression(C=4.0, max_iter=1000, solver="liblinear")
    model.fit(X_train_vec, y_train)

    preds = model.predict(X_test_vec)
    acc = accuracy_score(y_test, preds)
    print(f"\n[eval] Accuracy: {acc:.4f}")
    print("[eval] Classification report:")
    print(classification_report(y_test, preds, target_names=["FAKE", "REAL"]))
    print("[eval] Confusion matrix:")
    print(confusion_matrix(y_test, preds))

    joblib.dump(vectorizer, MODEL_DIR / "vectorizer.pkl")
    joblib.dump(model, MODEL_DIR / "model.pkl")
    print(f"\n[saved] {MODEL_DIR / 'vectorizer.pkl'}")
    print(f"[saved] {MODEL_DIR / 'model.pkl'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

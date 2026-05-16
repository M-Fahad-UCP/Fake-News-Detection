"""Text preprocessing for the fake-news classifier.

Mirrors the pipeline described in the kapilsinghnegi reference repo:
lowercase -> strip non-alpha -> tokenize -> remove stopwords -> stem.
"""

from __future__ import annotations

import re
from typing import Iterable, List

import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer


def _ensure_nltk():
    for pkg in ("stopwords",):
        try:
            nltk.data.find(f"corpora/{pkg}")
        except LookupError:
            nltk.download(pkg, quiet=True)


_ensure_nltk()

_STEMMER = PorterStemmer()
_STOPWORDS = set(stopwords.words("english"))
_NON_ALPHA = re.compile(r"[^a-zA-Z]")
_WHITESPACE = re.compile(r"\s+")


def clean_text(text: str) -> str:
    """Apply the standard preprocessing pipeline to a single string."""
    if not text:
        return ""

    text = _NON_ALPHA.sub(" ", text)
    text = text.lower()
    text = _WHITESPACE.sub(" ", text).strip()

    tokens = [
        _STEMMER.stem(tok)
        for tok in text.split()
        if tok and tok not in _STOPWORDS and len(tok) > 1
    ]
    return " ".join(tokens)


def clean_corpus(texts: Iterable[str]) -> List[str]:
    return [clean_text(t) for t in texts]


def quick_features(raw_text: str) -> dict:
    """Lightweight sniff-test signals returned alongside the prediction."""
    raw = raw_text or ""
    word_count = len(raw.split())
    upper_words = sum(1 for w in raw.split() if w.isupper() and len(w) > 1)
    exclaim = raw.count("!")
    question = raw.count("?")
    return {
        "word_count": word_count,
        "shouting_words": upper_words,
        "exclamation_count": exclaim,
        "question_count": question,
    }

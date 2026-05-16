"""Download the full Kaggle fake/real news dataset.

Requires the Kaggle API (`pip install kaggle`) and a Kaggle API token at
~/.kaggle/kaggle.json. Get one from https://www.kaggle.com/settings.

Usage:
    python download_dataset.py
"""

from __future__ import annotations

import os
import sys
import zipfile
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
DATASET = "clmentbisaillon/fake-and-real-news-dataset"


def main() -> int:
    DATA_DIR.mkdir(exist_ok=True)
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
    except ImportError:
        print("[error] Kaggle package not installed.")
        print("        Run: pip install kaggle")
        return 1

    try:
        api = KaggleApi()
        api.authenticate()
    except Exception as e:
        print(f"[error] Kaggle authentication failed: {e}")
        print("        Place your kaggle.json in ~/.kaggle/ (chmod 600).")
        return 1

    print(f"[download] Pulling {DATASET}…")
    api.dataset_download_files(DATASET, path=str(DATA_DIR), unzip=True)
    print(f"[done] Files extracted to {DATA_DIR}")
    print(f"       Now run: python train.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())

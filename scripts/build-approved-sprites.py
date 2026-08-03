#!/usr/bin/env python3
"""Rebuild all five locked character sets from their tracked masters."""

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = ("ido", "inbal", "inat", "ivri", "idan")


def main() -> None:
    for character in CHARACTERS:
        subprocess.run(
            [sys.executable, str(ROOT / "scripts" / f"build-{character}-sprites.py")],
            cwd=ROOT,
            check=True,
        )


if __name__ == "__main__":
    main()

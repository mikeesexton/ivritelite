#!/usr/bin/env python3
"""Rebuild the three user-approved character sets without touching legacy sets."""

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = ("ido", "inat", "inbal")


def main() -> None:
    for character in CHARACTERS:
        subprocess.run(
            [sys.executable, str(ROOT / "scripts" / f"build-{character}-sprites.py")],
            cwd=ROOT,
            check=True,
        )


if __name__ == "__main__":
    main()

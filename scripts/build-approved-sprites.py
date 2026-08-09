#!/usr/bin/env python3
"""Rebuild all five locked character sets from transparent masters."""

import argparse
from concurrent.futures import ThreadPoolExecutor
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = ("ido", "inbal", "inat", "ivri", "idan")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source-root",
        type=Path,
        default=ROOT / "assets" / "sprite-masters",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=ROOT / "assets",
    )
    args = parser.parse_args()
    def build(character: str) -> None:
        subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts" / f"build-{character}-sprites.py"),
                "--source-dir",
                str(args.source_root / character),
                "--output-dir",
                str(args.output_root / character),
            ],
            cwd=ROOT,
            check=True,
        )

    with ThreadPoolExecutor(max_workers=len(CHARACTERS)) as executor:
        list(executor.map(build, CHARACTERS))


if __name__ == "__main__":
    main()

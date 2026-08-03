#!/usr/bin/env python3
"""Build the locked 512px Inbal reactions from tracked transparent masters."""

import argparse
from pathlib import Path

from PIL import Image

from sprite_png import save_rgba_png


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "inbal"
SOURCE_DIR = ROOT / "assets" / "sprite-masters" / "inbal"
SOURCE_SIZE = 1254
CANVAS_SIZE = 512

REACTIONS = (
    "neutral",
    "nervous-laugh",
    "celebrating",
    "struggling",
    "mission-complete",
    "frustrated",
)


def build_reaction(name: str, output_dir: Path = ASSET_DIR) -> Path:
    source_path = SOURCE_DIR / f"{name}-transparent.png"
    source = Image.open(source_path).convert("RGBA")
    if source.size != (SOURCE_SIZE, SOURCE_SIZE):
        raise RuntimeError(f"{source_path.name} must be {SOURCE_SIZE}×{SOURCE_SIZE}.")
    if not source.getchannel("A").getbbox():
        raise RuntimeError(f"{source_path.name} has no visible pixels.")

    sprite = source.resize(
        (CANVAS_SIZE, CANVAS_SIZE),
        Image.Resampling.NEAREST,
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{name}.png"
    save_rgba_png(sprite, output_path)
    return output_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=ASSET_DIR)
    args = parser.parse_args()
    for reaction in REACTIONS:
        build_reaction(reaction, args.output_dir)


if __name__ == "__main__":
    main()

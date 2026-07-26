#!/usr/bin/env python3
"""Build consistent 512px Inbal reaction sprites from transparent source art."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "inbal"
SOURCE_DIR = ASSET_DIR / "source"
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


def build_reaction(name: str) -> None:
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
    sprite.save(ASSET_DIR / f"{name}.png", optimize=True)


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for reaction in REACTIONS:
        build_reaction(reaction)


if __name__ == "__main__":
    main()

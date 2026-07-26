#!/usr/bin/env python3
"""Build consistent 512px Ido reaction sprites from regenerated source art."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "ido"
SOURCE_DIR = ASSET_DIR / "source"
CANVAS_SIZE = 512

REACTIONS = (
    "neutral",
    "frustrated",
    "celebrating",
    "struggling",
    "mission-complete",
    "surprised-unused",
)


def build_reaction(name: str) -> None:
    source_path = SOURCE_DIR / f"{name}-regenerated-transparent.png"
    source = Image.open(source_path).convert("RGBA")
    if source.size != (1254, 1254):
        raise RuntimeError(f"{source_path.name} must be 1254×1254.")
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

#!/usr/bin/env python3
"""Build consistent 512px Idan reaction sprites from transparent source art."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "idan"
SOURCE_DIR = ASSET_DIR / "source"
SOURCE_SIZE = 1254
LOGICAL_SIZE = 128
PALETTE_COLORS = 96
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

    alpha = source.getchannel("A").point(
        lambda value: 0 if value < 32 else (255 if value > 223 else value)
    )
    source.putalpha(alpha)
    logical_sprite = source.resize(
        (LOGICAL_SIZE, LOGICAL_SIZE),
        Image.Resampling.NEAREST,
    )
    logical_sprite = logical_sprite.quantize(
        colors=PALETTE_COLORS,
        method=Image.Quantize.FASTOCTREE,
    ).convert("RGBA")
    sprite = logical_sprite.resize(
        (CANVAS_SIZE, CANVAS_SIZE),
        Image.Resampling.NEAREST,
    )
    corners = ((0, 0), (CANVAS_SIZE - 1, 0), (0, CANVAS_SIZE - 1),
               (CANVAS_SIZE - 1, CANVAS_SIZE - 1))
    if any(sprite.getpixel(point)[3] != 0 for point in corners):
        raise RuntimeError(f"{name} must have four transparent corners.")
    pixels = sprite.load()
    if any(
        pixels[x, y][3] and
        pixels[x, y][0] > 180 and
        pixels[x, y][2] > 180 and
        pixels[x, y][1] < 100
        for y in range(CANVAS_SIZE)
        for x in range(CANVAS_SIZE)
    ):
        raise RuntimeError(f"{name} contains visible chroma-key pixels.")

    output_path = ASSET_DIR / f"{name}.png"
    sprite.save(output_path, optimize=True)
    if output_path.stat().st_size >= 256 * 1024:
        raise RuntimeError(f"{name} exceeds the 256 KiB production budget.")


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for reaction in REACTIONS:
        build_reaction(reaction)


if __name__ == "__main__":
    main()

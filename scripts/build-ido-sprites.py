#!/usr/bin/env python3
"""Build the locked 512px Ido reactions from tracked transparent masters."""

import argparse
from pathlib import Path

from PIL import Image

from sprite_png import save_rgba_png


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "ido"
SOURCE_DIR = ROOT / "assets" / "sprite-masters" / "ido"
SOURCE_SIZE = 1254
CANVAS_SIZE = 512
LOGO_SCALE = 3
LOGO_COLOR = (246, 245, 222, 255)

REACTIONS = (
    "neutral",
    "nervous-laugh",
    "celebrating",
    "struggling",
    "mission-complete",
    "frustrated",
)

LOGO_BITMAP = (
    "#######....#######....###......#######",
    "#######....#######...#####.....#######",
    "#######....#######...#####.....#######",
    "#######....#######....####.....#######",
    "##...##........##.......##.....##...##",
    "##...##........##.......##.....##...##",
    "##...##........##.......##....###...##",
    "##...##........##.......##....###...##",
    "##...##........##.......##....###...##",
    "##...##........##.......##....###...##",
    "##..###.......###......###....###...##",
    "##..###.......###......##.....###...##",
    "##..###.......###......##.....###..###",
    "##...##.......###.....###.....###..###",
    "##...##.......###.....###.....###..###",
    "##...##.......###.....###.....###..###",
    "##...##........##.....###.....###..##.",
    "##...##........##.....###.....###..##.",
    "##...##........##.....##......##...##.",
    ".#....##.......##....###......##...##.",
    ".#....##.......##....###......##...#..",
    ".#....##.......##....###......##......",
    "......##.......##....##.......##......",
    ".......#........#....##.......##......",
    "................#....##........#......",
    ".....................##...............",
)

# Coordinates are pose-specific top-left positions on the final 512px canvas.
LOGO_PLACEMENTS = {
    "neutral": (197, 408),
    "nervous-laugh": (209, 408),
    "celebrating": (204, 408),
    "struggling": (195, 408),
    "mission-complete": (198, 407),
    "frustrated": (200, 408),
}


def build_logo() -> Image.Image:
    width = len(LOGO_BITMAP[0])
    height = len(LOGO_BITMAP)
    logo = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    pixels = logo.load()
    for y, row in enumerate(LOGO_BITMAP):
        if len(row) != width:
            raise RuntimeError("All Ido logo bitmap rows must have equal width.")
        for x, cell in enumerate(row):
            if cell == "#":
                pixels[x, y] = LOGO_COLOR
    return logo.resize(
        (width * LOGO_SCALE, height * LOGO_SCALE),
        Image.Resampling.NEAREST,
    )


LOGO = build_logo()


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
    sprite.alpha_composite(LOGO, LOGO_PLACEMENTS[name])
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

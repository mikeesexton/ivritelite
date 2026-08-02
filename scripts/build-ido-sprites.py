#!/usr/bin/env python3
"""Build consistent 512px Ido reaction sprites from transparent source art."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "ido"
SOURCE_DIR = ASSET_DIR / "source"
SOURCE_SIZE = 1254
LOGICAL_SIZE = 128
PALETTE_COLORS = 96
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
    "neutral": (198, 393),
    "nervous-laugh": (226, 393),
    "celebrating": (243, 405),
    "struggling": (211, 365),
    "mission-complete": (208, 393),
    "frustrated": (204, 397),
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
    sprite.alpha_composite(LOGO, LOGO_PLACEMENTS[name])
    sprite.save(ASSET_DIR / f"{name}.png", optimize=True)


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for reaction in REACTIONS:
        build_reaction(reaction)


if __name__ == "__main__":
    main()

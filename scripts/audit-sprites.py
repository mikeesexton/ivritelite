#!/usr/bin/env python3
"""Audit and reproducibly rebuild the locked character sprite assets."""

import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "assets" / "sprite-lock.json"
CHARACTERS = ("ido", "inbal", "ivri", "inat", "idan")
APPROVED_CHARACTERS = ("ido", "inat", "inbal")
REACTIONS = (
    "neutral",
    "nervous-laugh",
    "celebrating",
    "struggling",
    "mission-complete",
    "frustrated",
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image_record(path: Path, expected_size: tuple[int, int]) -> dict:
    with Image.open(path) as image:
        if image.mode != "RGBA":
            raise RuntimeError(f"{path.relative_to(ROOT)} must be RGBA, got {image.mode}")
        if image.size != expected_size:
            raise RuntimeError(
                f"{path.relative_to(ROOT)} must be {expected_size}, got {image.size}"
            )
        rgba = image.copy()

    alpha = rgba.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError(f"{path.relative_to(ROOT)} has no visible pixels")

    pixels = list(rgba.get_flattened_data())
    magenta = sum(
        1
        for red, green, blue, alpha_value in pixels
        if alpha_value and red >= 240 and blue >= 240 and green <= 40
    )
    partial_alpha = sum(1 for *_, alpha_value in pixels if alpha_value not in (0, 255))
    corners = [
        rgba.getpixel((0, 0))[3],
        rgba.getpixel((rgba.width - 1, 0))[3],
        rgba.getpixel((0, rgba.height - 1))[3],
        rgba.getpixel((rgba.width - 1, rgba.height - 1))[3],
    ]

    record = {
        "sha256": sha256(path),
        "width": rgba.width,
        "height": rgba.height,
        "mode": rgba.mode,
        "fileBytes": path.stat().st_size,
        "visibleBbox": list(bbox),
        "cornerAlpha": corners,
        "partialAlphaPixels": partial_alpha,
        "visibleMagentaPixels": magenta,
        "uniqueRgba": len(set(pixels)),
    }
    if expected_size == (512, 512):
        raw = rgba.tobytes()
        for logical_size in (256, 128):
            round_trip = rgba.resize(
                (logical_size, logical_size), Image.Resampling.NEAREST
            ).resize((512, 512), Image.Resampling.NEAREST)
            record[f"equals{logical_size}RoundTrip"] = round_trip.tobytes() == raw
    return record


def collect_lock() -> dict:
    production = {}
    for character in CHARACTERS:
        for reaction in REACTIONS:
            relative = Path("assets") / character / f"{reaction}.png"
            production[str(relative)] = image_record(ROOT / relative, (512, 512))

    masters = {}
    for character in APPROVED_CHARACTERS:
        for reaction in REACTIONS:
            relative = (
                Path("assets")
                / "sprite-masters"
                / character
                / f"{reaction}-transparent.png"
            )
            masters[str(relative)] = image_record(ROOT / relative, (1254, 1254))

    return {
        "version": 1,
        "policy": "Exact hashes lock every production sprite and approved master. Metrics document the approved pixels; changing any value requires an explicit lock update.",
        "approvedExceptions": {
            "ido": "User-approved density is 18,946–22,118 colors; nervous-laugh reaches the bottom-right corner.",
            "inat": "User-approved density is 38,982–42,488 colors; four deterministic lossless files exceed 256 KiB.",
            "inbal": "User-approved tight hair framing begins above row 12 and long-hair files exceed 256 KiB.",
            "idan": "Frozen legacy 128px/96-color build; not regenerated in this approved set.",
        },
        "production": production,
        "masters": masters,
    }


def validate_builder_structure() -> None:
    forbidden = ("LOGICAL_SIZE", "PALETTE_COLORS", ".quantize(", "BILINEAR", "BICUBIC")
    for character in APPROVED_CHARACTERS:
        path = ROOT / "scripts" / f"build-{character}-sprites.py"
        source = path.read_text()
        for token in forbidden:
            if token in source:
                raise RuntimeError(f"{path.name} contains forbidden token {token!r}")
        required = (
            '"sprite-masters"',
            'f"{name}-transparent.png"',
            "Image.Resampling.NEAREST",
            "(CANVAS_SIZE, CANVAS_SIZE)",
            "save_rgba_png",
        )
        for token in required:
            if token not in source:
                raise RuntimeError(f"{path.name} is missing required token {token!r}")


def validate_locked_metrics(actual: dict, locked: dict) -> None:
    if actual != locked:
        for section in ("production", "masters"):
            for path, actual_record in actual.get(section, {}).items():
                if locked.get(section, {}).get(path) != actual_record:
                    raise RuntimeError(f"locked sprite drift: {path}")
        raise RuntimeError("sprite lock metadata drift")

    for path, record in actual["production"].items():
        if record["visibleMagentaPixels"]:
            raise RuntimeError(f"{path} contains visible magenta-key pixels")
        character = Path(path).parts[1]
        if character in APPROVED_CHARACTERS and (
            record["equals256RoundTrip"] or record["equals128RoundTrip"]
        ):
            raise RuntimeError(f"{path} reproduces through a prohibited logical-size round trip")
        if record["fileBytes"] >= 384 * 1024:
            raise RuntimeError(f"{path} exceeds the approved 384 KiB absolute ceiling")

    for path, record in actual["masters"].items():
        if record["visibleMagentaPixels"]:
            raise RuntimeError(f"{path} contains visible magenta-key pixels")
        if record["partialAlphaPixels"]:
            raise RuntimeError(f"{path} contains partial-alpha matte pixels")


def validate_rebuilds() -> None:
    with tempfile.TemporaryDirectory(prefix="ulpango-sprite-audit-") as temp:
        temp_root = Path(temp)
        for pass_name in ("first", "second"):
            for character in APPROVED_CHARACTERS:
                output_dir = temp_root / pass_name / character
                subprocess.run(
                    [
                        sys.executable,
                        str(ROOT / "scripts" / f"build-{character}-sprites.py"),
                        "--output-dir",
                        str(output_dir),
                    ],
                    cwd=ROOT,
                    check=True,
                )

        for character in APPROVED_CHARACTERS:
            for reaction in REACTIONS:
                production = ROOT / "assets" / character / f"{reaction}.png"
                first = temp_root / "first" / character / f"{reaction}.png"
                second = temp_root / "second" / character / f"{reaction}.png"
                hashes = {sha256(production), sha256(first), sha256(second)}
                if len(hashes) != 1:
                    raise RuntimeError(
                        f"non-deterministic direct build: {character}/{reaction}.png"
                    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--write-lock",
        action="store_true",
        help="Replace the hash/metric lock after explicit artwork approval.",
    )
    args = parser.parse_args()

    validate_builder_structure()
    actual = collect_lock()
    if args.write_lock:
        LOCK_PATH.write_text(json.dumps(actual, indent=2, sort_keys=True) + "\n")
        print(f"Wrote {LOCK_PATH.relative_to(ROOT)}")
    else:
        locked = json.loads(LOCK_PATH.read_text())
        validate_locked_metrics(actual, locked)
    validate_rebuilds()
    print("Sprite audit passed: 30 production files, 18 tracked masters, 18 direct deterministic rebuilds.")


if __name__ == "__main__":
    main()

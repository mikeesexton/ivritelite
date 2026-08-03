#!/usr/bin/env python3
"""Audit and reproducibly rebuild the locked character sprite assets."""

import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "assets" / "sprite-lock.json"
CHARACTERS = ("ido", "inbal", "ivri", "inat", "idan")
APPROVED_CHARACTERS = CHARACTERS
MEASUREMENT_COLORS = (32, 64)
MEASUREMENT_SIZES = (96, 128, 192, 256)
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


def measurement_labels(rgba: Image.Image, colors: int) -> tuple[Image.Image, list[bool]]:
    rgba_pixels = list(rgba.get_flattened_data())
    visible = [alpha > 0 for *_, alpha in rgba_pixels]
    visible_rgb = [pixel[:3] for pixel, is_visible in zip(rgba_pixels, visible) if is_visible]
    sample = Image.new("RGB", (len(visible_rgb), 1))
    sample.putdata(visible_rgb)
    adaptive = sample.quantize(
        colors=colors,
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.NONE,
    )
    adaptive_palette = adaptive.getpalette()
    entries = [adaptive_palette[index * 3 : index * 3 + 3] for index in range(colors)]
    fixed_palette = Image.new("P", (1, 1))
    fixed_palette.putpalette(sum(entries + [entries[-1]] * (256 - colors), []))
    labels = rgba.convert("RGB").quantize(
        palette=fixed_palette,
        dither=Image.Dither.NONE,
    )
    return labels, visible


def round_trip_survival(labels: Image.Image, visible: list[bool], size: int) -> float:
    rebuilt = labels.resize((size, size), Image.Resampling.NEAREST).resize(
        (512, 512), Image.Resampling.NEAREST
    )
    original_values = list(labels.get_flattened_data())
    rebuilt_values = list(rebuilt.get_flattened_data())
    kept = sum(
        1
        for is_visible, original, restored in zip(visible, original_values, rebuilt_values)
        if is_visible and original == restored
    )
    return kept / sum(visible)


def cluster_signature(labels: Image.Image, visible: list[bool]) -> tuple[int, float]:
    width, height = labels.size
    values = list(labels.get_flattened_data())
    seen = bytearray(width * height)
    areas = []
    differing = 0
    neighbor_pairs = 0

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if not visible[index]:
                continue
            if x + 1 < width and visible[index + 1]:
                neighbor_pairs += 1
                differing += values[index] != values[index + 1]
            if y + 1 < height and visible[index + width]:
                neighbor_pairs += 1
                differing += values[index] != values[index + width]
            if seen[index]:
                continue

            label = values[index]
            seen[index] = 1
            queue = deque([index])
            area = 0
            while queue:
                current = queue.popleft()
                area += 1
                cx = current % width
                cy = current // width
                neighbors = (
                    current - 1 if cx else -1,
                    current + 1 if cx + 1 < width else -1,
                    current - width if cy else -1,
                    current + width if cy + 1 < height else -1,
                )
                for neighbor in neighbors:
                    if (
                        neighbor >= 0
                        and visible[neighbor]
                        and not seen[neighbor]
                        and values[neighbor] == label
                    ):
                        seen[neighbor] = 1
                        queue.append(neighbor)
            areas.append(area)

    half_visible_area = sum(areas) / 2
    cumulative_area = 0
    pixel_weighted_median = 0
    for area in sorted(areas):
        cumulative_area += area
        if cumulative_area >= half_visible_area:
            pixel_weighted_median = area
            break
    return pixel_weighted_median, differing / neighbor_pairs


def spatial_signature(rgba: Image.Image) -> dict:
    signature = {}
    for colors in MEASUREMENT_COLORS:
        labels, visible = measurement_labels(rgba, colors)
        cluster_area, boundary_rate = cluster_signature(labels, visible)
        signature[str(colors)] = {
            "roundTripSurvival": {
                str(size): round(round_trip_survival(labels, visible, size), 6)
                for size in MEASUREMENT_SIZES
            },
            "pixelWeightedMedianClusterArea": cluster_area,
            "adjacentBoundaryRate": round(boundary_rate, 6),
        }
    return signature


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
        record["spatialSignature"] = spatial_signature(rgba)
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
    for character in CHARACTERS:
        for reaction in REACTIONS:
            relative = (
                Path("assets")
                / "sprite-masters"
                / character
                / f"{reaction}-transparent.png"
            )
            masters[str(relative)] = image_record(ROOT / relative, (1254, 1254))

    spatial_gate = {}
    for reaction in REACTIONS:
        ido_record = production[f"assets/ido/{reaction}.png"]
        inbal_record = production[f"assets/inbal/{reaction}.png"]
        for character in CHARACTERS:
            path = f"assets/{character}/{reaction}.png"
            spatial_gate[path] = evaluate_spatial_gate(
                production[path], ido_record, inbal_record
            )

    return {
        "version": 2,
        "policy": "Exact hashes lock all 30 production sprites and all 30 transparent masters. Spatial signatures use only visible pixels and are informational acceptance records; changing any pixel or metric requires explicit artwork approval and an intentional lock update.",
        "approvedExceptions": {
            "ido": "Frozen byte-for-byte; deterministic shirt mark remains the sole post-export density exception.",
            "inbal": "Frozen byte-for-byte and sole visual style/grain authority.",
            "inat": "User approved the complete fresh-redraw set after native 512px cross-cast review, including recorded spatial-band deviations.",
            "ivri": "User approved the complete fresh-redraw set after native 512px cross-cast review, including recorded spatial-band deviations.",
            "idan": "User approved the complete fresh-redraw set after native 512px cross-cast review, including recorded spatial-band deviations and the stern nervous-laugh filename exception.",
        },
        "production": production,
        "masters": masters,
        "spatialGate": spatial_gate,
    }


def evaluate_spatial_gate(candidate: dict, ido: dict, inbal: dict) -> dict:
    failures = []
    for colors in MEASUREMENT_COLORS:
        key = str(colors)
        candidate_signature = candidate["spatialSignature"][key]
        ido_signature = ido["spatialSignature"][key]
        inbal_signature = inbal["spatialSignature"][key]
        for size in MEASUREMENT_SIZES:
            size_key = str(size)
            lower = min(
                ido_signature["roundTripSurvival"][size_key],
                inbal_signature["roundTripSurvival"][size_key],
            ) - 0.03
            upper = max(
                ido_signature["roundTripSurvival"][size_key],
                inbal_signature["roundTripSurvival"][size_key],
            ) + 0.03
            value = candidate_signature["roundTripSurvival"][size_key]
            if not lower <= value <= upper:
                failures.append(
                    f"{colors} colors/{size}px survival {value:.6f} outside {lower:.6f}..{upper:.6f}"
                )

        smaller_area = min(
            ido_signature["pixelWeightedMedianClusterArea"],
            inbal_signature["pixelWeightedMedianClusterArea"],
        )
        larger_area = max(
            ido_signature["pixelWeightedMedianClusterArea"],
            inbal_signature["pixelWeightedMedianClusterArea"],
        )
        lower_area = smaller_area * 0.75
        upper_area = larger_area * 1.25
        area = candidate_signature["pixelWeightedMedianClusterArea"]
        if not lower_area <= area <= upper_area:
            failures.append(
                f"{colors} colors cluster area {area} outside {lower_area:.2f}..{upper_area:.2f}"
            )

        lower_boundary = min(
            ido_signature["adjacentBoundaryRate"],
            inbal_signature["adjacentBoundaryRate"],
        ) - 0.03
        upper_boundary = max(
            ido_signature["adjacentBoundaryRate"],
            inbal_signature["adjacentBoundaryRate"],
        ) + 0.03
        boundary = candidate_signature["adjacentBoundaryRate"]
        if not lower_boundary <= boundary <= upper_boundary:
            failures.append(
                f"{colors} colors boundary {boundary:.6f} outside {lower_boundary:.6f}..{upper_boundary:.6f}"
            )

    return {"passesProvisionalBand": not failures, "approvedFailures": failures}


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
        if record["equals256RoundTrip"] or record["equals128RoundTrip"]:
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
    print("Sprite audit passed: 30 production files, 30 tracked masters, 30 direct deterministic rebuilds.")


if __name__ == "__main__":
    main()

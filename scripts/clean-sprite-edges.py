#!/usr/bin/env python3
"""Build and optionally apply hard-alpha, magenta-free sprite candidates."""

import argparse
import json
import shutil
import subprocess
import sys
from dataclasses import asdict
from pathlib import Path

from PIL import Image

from sprite_edges import clean_magenta_edges, count_magenta_edge_pixels, is_magenta_spill


ROOT = Path(__file__).resolve().parents[1]
CHARACTERS = ("ido", "inbal", "ivri", "inat", "idan")
REACTIONS = (
    "neutral",
    "nervous-laugh",
    "celebrating",
    "struggling",
    "mission-complete",
    "frustrated",
)


def _validate_output_root(output_root: Path) -> None:
    resolved = output_root.resolve()
    tracked_assets = (ROOT / "assets").resolve()
    try:
        resolved.relative_to(tracked_assets)
    except ValueError:
        return
    raise RuntimeError("Candidate output must stay outside the tracked assets directory.")


def _validate_candidate(
    path: Path,
    size: tuple[int, int],
    reference_path: Path,
) -> None:
    with Image.open(path) as image:
        rgba = image.convert("RGBA")
    with Image.open(reference_path) as image:
        reference = image.convert("RGBA")
    if rgba.mode != "RGBA" or rgba.size != size:
        raise RuntimeError(f"Unexpected candidate format: {path}")
    if any(alpha not in (0, 255) for alpha in rgba.getchannel("A").get_flattened_data()):
        raise RuntimeError(f"Candidate has partial alpha: {path}")
    corners = (
        (0, 0),
        (rgba.width - 1, 0),
        (0, rgba.height - 1),
        (rgba.width - 1, rgba.height - 1),
    )
    for corner in corners:
        candidate_pixel = rgba.getpixel(corner)
        reference_pixel = reference.getpixel(corner)
        if candidate_pixel[3] > reference_pixel[3]:
            raise RuntimeError(f"Candidate added visible corner alpha: {path}")
        if candidate_pixel[3] < reference_pixel[3] and not is_magenta_spill(
            *reference_pixel
        ):
            raise RuntimeError(f"Candidate removed a non-magenta corner: {path}")
    if count_magenta_edge_pixels(rgba):
        raise RuntimeError(f"Candidate retains magenta edge spill: {path}")


def _build_contact_sheet(production_root: Path, background: tuple[int, int, int, int]) -> Image.Image:
    sheet = Image.new(
        "RGBA",
        (len(REACTIONS) * 512, len(CHARACTERS) * 512),
        background,
    )
    for row, character in enumerate(CHARACTERS):
        for column, reaction in enumerate(REACTIONS):
            with Image.open(production_root / character / f"{reaction}.png") as image:
                sheet.alpha_composite(image.convert("RGBA"), (column * 512, row * 512))
    return sheet.convert("RGB")


def _build_candidates(output_root: Path) -> list[dict]:
    candidate_assets = output_root / "assets"
    candidate_masters = candidate_assets / "sprite-masters"
    records = []
    for character in CHARACTERS:
        for reaction in REACTIONS:
            source = (
                ROOT
                / "assets"
                / "sprite-masters"
                / character
                / f"{reaction}-transparent.png"
            )
            with Image.open(source) as image:
                cleaned, stats = clean_magenta_edges(image)
            destination = (
                candidate_masters / character / f"{reaction}-transparent.png"
            )
            destination.parent.mkdir(parents=True, exist_ok=True)
            cleaned.save(
                destination,
                format="PNG",
                optimize=False,
                compress_level=9,
            )
            _validate_candidate(destination, (1254, 1254), source)
            records.append(
                {
                    "character": character,
                    "reaction": reaction,
                    **asdict(stats),
                }
            )

    subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts" / "build-approved-sprites.py"),
            "--source-root",
            str(candidate_masters),
            "--output-root",
            str(candidate_assets),
        ],
        cwd=ROOT,
        check=True,
    )
    for character in CHARACTERS:
        for reaction in REACTIONS:
            _validate_candidate(
                candidate_assets / character / f"{reaction}.png",
                (512, 512),
                ROOT / "assets" / character / f"{reaction}.png",
            )

    review_root = output_root / "review"
    review_root.mkdir(parents=True, exist_ok=True)
    _build_contact_sheet(candidate_assets, (0, 0, 0, 255)).save(
        review_root / "contact-sheet-black.png"
    )
    _build_contact_sheet(candidate_assets, (255, 255, 255, 255)).save(
        review_root / "contact-sheet-white.png"
    )
    report = {
        "characters": list(CHARACTERS),
        "reactions": list(REACTIONS),
        "masters": records,
        "summary": {
            "masterCount": len(records),
            "productionCount": len(CHARACTERS) * len(REACTIONS),
            "removedPixels": sum(record["removed_pixels"] for record in records),
            "maxRemovalRatio": max(record["removal_ratio"] for record in records),
            "maxRuntimeBboxShift": max(
                record["max_runtime_bbox_shift"] for record in records
            ),
            "visibleMagentaEdgePixels": 0,
        },
    }
    (output_root / "report.json").write_text(
        json.dumps(report, indent=2) + "\n",
        encoding="utf-8",
    )
    return records


def _apply_candidates(output_root: Path) -> None:
    candidate_masters = output_root / "assets" / "sprite-masters"
    for character in CHARACTERS:
        for reaction in REACTIONS:
            filename = f"{reaction}-transparent.png"
            shutil.copyfile(
                candidate_masters / character / filename,
                ROOT / "assets" / "sprite-masters" / character / filename,
            )
    subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build-approved-sprites.py")],
        cwd=ROOT,
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-root",
        type=Path,
        default=ROOT / "tmp" / "sprite-edge-cleanup",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Promote validated candidate masters and rebuild tracked production sprites.",
    )
    args = parser.parse_args()
    _validate_output_root(args.output_root)
    records = _build_candidates(args.output_root)
    if args.apply:
        _apply_candidates(args.output_root)
    print(
        f"Validated {len(records)} cleaned masters and {len(records)} production sprites "
        f"under {args.output_root}"
    )
    if args.apply:
        print("Applied cleaned masters and rebuilt tracked production sprites.")


if __name__ == "__main__":
    main()

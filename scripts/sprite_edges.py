"""Deterministic detection and removal of exterior magenta sprite spill."""

from dataclasses import dataclass

from PIL import Image


RED_BLUE_MIN = 110
GREEN_MAX = 50
MAGENTA_DOMINANCE_MIN = 75
RED_BLUE_DELTA_MAX = 96
MAX_REMOVAL_RATIO = 0.004
MAX_RUNTIME_BBOX_SHIFT = 2


@dataclass(frozen=True)
class CleanupStats:
    visible_before: int
    removed_pixels: int
    removal_ratio: float
    master_bbox_before: tuple[int, int, int, int]
    master_bbox_after: tuple[int, int, int, int]
    runtime_bbox_before: tuple[int, int, int, int]
    runtime_bbox_after: tuple[int, int, int, int]
    max_runtime_bbox_shift: int


def is_magenta_spill(red: int, green: int, blue: int, alpha: int) -> bool:
    return (
        alpha > 0
        and red >= RED_BLUE_MIN
        and blue >= RED_BLUE_MIN
        and green <= GREEN_MAX
        and min(red, blue) - green >= MAGENTA_DOMINANCE_MIN
        and abs(red - blue) <= RED_BLUE_DELTA_MAX
    )


def _has_transparency_within(
    pixels,
    width: int,
    height: int,
    x: int,
    y: int,
    radius: int,
) -> bool:
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            if dx == 0 and dy == 0:
                continue
            neighbor_x = x + dx
            neighbor_y = y + dy
            if (
                neighbor_x < 0
                or neighbor_y < 0
                or neighbor_x >= width
                or neighbor_y >= height
                or pixels[neighbor_x, neighbor_y][3] == 0
            ):
                return True
    return False


def count_magenta_edge_pixels(image: Image.Image) -> int:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    return sum(
        1
        for y in range(height)
        for x in range(width)
        if is_magenta_spill(*pixels[x, y])
        and _has_transparency_within(pixels, width, height, x, y, 1)
    )


def _visible_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise RuntimeError("Sprite has no visible pixels.")
    return bbox


def _assert_binary_alpha(image: Image.Image) -> None:
    if any(alpha not in (0, 255) for alpha in image.getchannel("A").get_flattened_data()):
        raise RuntimeError("Sprite cleanup requires binary alpha input.")


def clean_magenta_edges(image: Image.Image) -> tuple[Image.Image, CleanupStats]:
    rgba = image.convert("RGBA")
    _assert_binary_alpha(rgba)
    pixels = rgba.load()
    width, height = rgba.size
    visible_before = sum(
        alpha > 0 for alpha in rgba.getchannel("A").get_flattened_data()
    )
    master_bbox_before = _visible_bbox(rgba)
    runtime_before = rgba.resize((512, 512), Image.Resampling.NEAREST)
    runtime_bbox_before = _visible_bbox(runtime_before)
    removed_pixels = 0

    while True:
        removable = []
        for y in range(height):
            for x in range(width):
                if is_magenta_spill(*pixels[x, y]) and _has_transparency_within(
                    pixels, width, height, x, y, 2
                ):
                    removable.append((x, y))
        if not removable:
            break
        for x, y in removable:
            pixels[x, y] = (0, 0, 0, 0)
        removed_pixels += len(removable)

    removal_ratio = removed_pixels / visible_before
    if removal_ratio > MAX_REMOVAL_RATIO:
        raise RuntimeError(
            f"Cleanup would remove {removal_ratio:.3%} of visible pixels; "
            f"the limit is {MAX_REMOVAL_RATIO:.1%}."
        )
    if count_magenta_edge_pixels(rgba):
        raise RuntimeError("Magenta edge spill remains after cleanup.")

    master_bbox_after = _visible_bbox(rgba)
    runtime_after = rgba.resize((512, 512), Image.Resampling.NEAREST)
    runtime_bbox_after = _visible_bbox(runtime_after)
    max_runtime_bbox_shift = max(
        abs(after - before)
        for before, after in zip(runtime_bbox_before, runtime_bbox_after)
    )
    if max_runtime_bbox_shift > MAX_RUNTIME_BBOX_SHIFT:
        raise RuntimeError(
            f"Cleanup shifts the 512px visible bounds by {max_runtime_bbox_shift}px; "
            f"the limit is {MAX_RUNTIME_BBOX_SHIFT}px."
        )

    return rgba, CleanupStats(
        visible_before=visible_before,
        removed_pixels=removed_pixels,
        removal_ratio=removal_ratio,
        master_bbox_before=master_bbox_before,
        master_bbox_after=master_bbox_after,
        runtime_bbox_before=runtime_bbox_before,
        runtime_bbox_after=runtime_bbox_after,
        max_runtime_bbox_shift=max_runtime_bbox_shift,
    )

"""Small deterministic RGBA PNG writer used by the locked sprite builders."""

import binascii
import struct
import zlib
from pathlib import Path

from PIL import Image


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def _chunk(kind: bytes, payload: bytes) -> bytes:
    return (
        struct.pack(">I", len(payload))
        + kind
        + payload
        + struct.pack(">I", binascii.crc32(kind + payload) & 0xFFFFFFFF)
    )


def _paeth(left: int, up: int, upper_left: int) -> int:
    estimate = left + up - upper_left
    left_distance = abs(estimate - left)
    up_distance = abs(estimate - up)
    upper_left_distance = abs(estimate - upper_left)
    if left_distance <= up_distance and left_distance <= upper_left_distance:
        return left
    if up_distance <= upper_left_distance:
        return up
    return upper_left


def _filter_row(row: bytes, previous: bytes, bytes_per_pixel: int = 4) -> bytes:
    candidates = []
    for filter_type in range(5):
        filtered = bytearray(len(row))
        for index, value in enumerate(row):
            left = row[index - bytes_per_pixel] if index >= bytes_per_pixel else 0
            up = previous[index] if previous else 0
            upper_left = (
                previous[index - bytes_per_pixel]
                if previous and index >= bytes_per_pixel
                else 0
            )
            if filter_type == 0:
                predictor = 0
            elif filter_type == 1:
                predictor = left
            elif filter_type == 2:
                predictor = up
            elif filter_type == 3:
                predictor = (left + up) // 2
            else:
                predictor = _paeth(left, up, upper_left)
            filtered[index] = (value - predictor) & 0xFF
        score = sum(min(value, 256 - value) for value in filtered)
        candidates.append((score, filter_type, bytes(filtered)))
    _, filter_type, filtered = min(candidates)
    return bytes((filter_type,)) + filtered


def save_rgba_png(image: Image.Image, path: Path) -> None:
    """Write a metadata-free PNG with deterministic filters and compression."""
    if image.mode != "RGBA":
        raise RuntimeError("The sprite PNG writer accepts RGBA images only.")
    width, height = image.size
    pixels = image.tobytes()
    stride = width * 4
    rows = []
    previous = b""
    for y in range(height):
        row = pixels[y * stride : (y + 1) * stride]
        rows.append(_filter_row(row, previous))
        previous = row
    compressed = zlib.compress(b"".join(rows), level=9)
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    path.write_bytes(
        PNG_SIGNATURE
        + _chunk(b"IHDR", ihdr)
        + _chunk(b"IDAT", compressed)
        + _chunk(b"IEND", b"")
    )

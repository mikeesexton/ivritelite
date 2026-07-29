# Character sprite standard

Every character has exactly the same six production reactions:

- `neutral.png`
- `nervous-laugh.png`
- `celebrating.png`
- `struggling.png`
- `mission-complete.png`
- `frustrated.png`

Production files are transparent 512×512 RGBA PNGs. Each reaction is generated
and reviewed as one independent square image. Do not generate sprite sheets,
multi-expression grids, contact sheets, or crops derived from them.

Each character's local `source/` directory contains exactly two 1254×1254 files
per reaction:

- `<reaction>-chroma.png`
- `<reaction>-transparent.png`

The character-specific builder resizes each transparent master independently
with nearest-neighbor sampling. Source filenames, reaction order, canvas size,
and runtime filenames stay identical across Ido, Inbal, Ivri, and Inat.

Ido's shared shirt mark is a builder-owned logical-pixel bitmap rather than
generated lettering. It is nearest-neighbor scaled and placed with per-reaction
coordinates after the 512×512 resize. Do not apply one normalized logo anchor
across poses with different torso centers or neckline heights.

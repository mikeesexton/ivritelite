# Locked character sprite standard

The production cast has exactly six transparent RGBA reactions per character,
all on a 512×512 canvas:

- `neutral.png`
- `nervous-laugh.png`
- `celebrating.png`
- `struggling.png`
- `mission-complete.png`
- `frustrated.png`

The app loads only `assets/<character>/<reaction>.png`. It never loads a
master, chroma image, prompt, preview, contact sheet, or rejected candidate.

## Frozen authority

Ivri alone is the visual authority for pixel medium, contour treatment,
multi-tone cel shading, mature anatomy, scale, framing, and final detail
density. Do not average Ivri with another character. A character's own approved
neutral controls identity and wardrobe; its approved equivalent reaction
controls only pose semantics. Never copy Ivri's face, body, hair, clothing, or
colors.

Ido, Inat, and Inbal were independently redrawn and approved as complete sets
on 2026-08-03. Their exact generation prompts and reference order are frozen in
`docs/sprite-prompts/`. Their 18 approved transparent masters are tracked at
`assets/sprite-masters/<character>/<reaction>-transparent.png`.

No future edit is routine maintenance. Replacing a locked sprite requires an
explicit request to replace the character set, independent generation calls,
native-size and live-size review, user approval, and an intentional
`sprites:audit --write-lock` update.

## Direct export contract

For Ido, Inat, and Inbal, each production image is exactly one direct
nearest-neighbor resize from its 1254×1254 RGBA master to 512×512 RGBA. There
is no 128px or 256px logical canvas, palette quantization, posterization, blur,
sharpening, or intermediate enlargement. A 128px or 256px nearest-neighbor
round trip must not reproduce an approved production image.

Ido's deterministic shirt mark is the sole post-export exception. The builder
composites the existing 38×26 bitmap at 3× scale after the direct resize, using
the six audited positions in `docs/sprite-prompts/ido-logo-placements.json`.
The generated shirt must stay blank.

Idan remains a frozen legacy exception on the earlier 128px/96-color builder;
the user accepted him without requesting another regeneration. Ivri's direct
builder and assets remain unchanged.

## Immutable generation rules

Generate one independent square reaction per call. Never generate sheets,
grids, collages, or crops from a sheet. Start with the common prompt recorded
in the character's prompt file, then append exactly one reaction block. The
reference hierarchy is:

1. Approved neutral master — identity and wardrobe only.
2. Approved outgoing equivalent master — gesture and emotion only.
3. Ivri equivalent source master — source-art style, shading, scale, framing.
4. Ivri equivalent 512px production image — final pixel density.

Draw native high-density pixel art with crisp square steps, near-black outer
contours, controlled one-to-three-pixel internal detail, clustered highlights,
and multi-tone cel shading. Use mature chest-up proportions. Keep the face,
hair, identity accessories, and essential gesture legible. Use a perfectly flat
`#FF00FF` background and never use that color in the subject. No gradients,
airbrushing, vector-smooth curves, glossy 3D rendering, dithering noise,
hair-thin lines, watermark, text, scenery, glow, or debris.

Reject identity drift, reaction ambiguity, clipped essential features, visible
chroma, matte fringe, stray opaque pixels, and any attempt to rescue the art by
resizing or palette manipulation. The prompt files contain the hardcoded
identity and reaction wording that must be reasserted in full.

## Approved metrics and exceptions

The exact approved hashes and measured metrics are in
`assets/sprite-lock.json`; they are the objective acceptance record. The user
approved the visible sets with these deliberate exceptions to the earlier
provisional numeric gates:

- Ido: 18,946–22,118 unique RGBA values; `nervous-laugh` reaches the
  bottom-right corner.
- Inat: 38,982–42,488 unique RGBA values; four files exceed 256 KiB under the
  fixed deterministic lossless encoder.
- Inbal: 27,010–29,134 unique RGBA values; her approved long hair starts above
  row 12 and makes every lossless PNG larger than 256 KiB.

These are not invitations for approximate future replacements. Exact hashes
freeze the accepted files, and the universal absolute ceiling is 384 KiB.

## Deterministic commands

Run with a Python environment that provides Pillow:

```sh
npm run sprites:build
npm run sprites:audit
npm test
```

`sprites:audit` validates all 30 production hashes, all 18 tracked master
hashes, dimensions, RGBA mode, alpha, chroma, density metrics, framing metrics,
file sizes, anti-round-trip behavior, direct-builder structure, and two clean
rebuilds of all 18 approved outputs. Normal tests also verify every locked hash,
so accidental drift fails without requiring Pillow in the JavaScript test
environment.

The three approved builders use `scripts/sprite_png.py` to choose PNG filters
and compression deterministically. This preserves the exact approved pixels
while avoiding version-dependent byte changes from Pillow's optimizer.

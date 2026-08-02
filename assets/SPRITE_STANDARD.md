# Character sprite and icon standard

Use this contract for every new character, including Idan. Existing
characters should move toward it when their art is next revised, but do not
redraw a locked identity merely to correct a small legacy difference.

## Production set

Every character has exactly the same six production reactions:

- `neutral.png`
- `nervous-laugh.png`
- `celebrating.png`
- `struggling.png`
- `mission-complete.png`
- `frustrated.png`

Production files are transparent 512×512 RGBA PNGs. Use the exact lowercase
filenames above in `assets/<character-id>/`; the app and tests depend on them.
Each reaction is generated and reviewed as one independent square image. Do not
generate sprite sheets, multi-expression grids, contact sheets, or crops
derived from them.

## Visual language

- Pixel art must read as deliberately coarse at normal UI size: hard square
  pixel steps, clustered highlights and shadows, and no hair-thin smooth lines.
- Use a limited cel-shaded palette with strong near-black outlines. Avoid
  airbrushed gradients, glossy 3D rendering, soft focus, texture noise, and
  antialiased/vector-looking edges.
- Use mature human proportions and a chest-up or upper-torso crop. Do not use
  chibi, doll-like, oversized-head, or mascot proportions.
- Keep the neutral pose centered and unclipped, with the top of the hair roughly
  3–7% below the canvas top and the torso meeting the bottom edge. Across the
  six poses, keep perceived head size, eye line, and torso scale stable. A broad
  gesture may approach an edge, but the face, hand gesture, and identity-defining
  accessories must remain legible.
- Lock the character before generating reactions: face shape, apparent age,
  skin tone, hair shape and color, outfit, eyewear, jewelry, and other signature
  details must remain the same in all six files.
- Match reaction semantics across the cast: neutral is calm; nervous-laugh is a
  mild miss; celebrating is an energetic success; struggling is an intense
  difficulty reaction; mission-complete is a warm success; frustrated is a
  distinct negative alternate. Pose and expression should both carry the state.
  A documented character-specific reaction may alter the emotional delivery
  without changing the filename or runtime meaning. Idan's wrong-answer pose is
  stern and disciplined rather than embarrassed; it must stay calm, not angry.
- Keep the background fully transparent. Do not include scenery, a floor,
  cast shadows, glow, text, watermarks, or stray opaque pixels.

## Resolution and export

- Keep a high-resolution transparent master for each reaction. High-resolution
  masters are local sources only and must never be referenced by HTML or CSS.
  Because the browser never requests them, retaining them does not affect
  GitHub Pages load time.
- Author new art at the same coarse detail density as the approved cast. When a
  master is visibly finer, re-render it with simplified linework and shapes;
  resizing alone is not a substitute for matching the visual language.
- Normalize approved art through a 128×128 logical canvas, limit it to a
  96-color RGBA palette, then enlarge it to 512×512 with nearest-neighbor
  sampling. Never use bilinear, bicubic, or smoothing resampling for the final
  enlargement.
- Save optimized RGBA PNGs. A production sprite should normally stay below
  256 KiB; treat a larger file as a prompt to inspect detail density and stray
  alpha/color noise, not as permission to reduce the 512×512 canvas.
- Review at both 100% pixel scale and at the app's smallest rendered size. At
  100%, compare pixel grain, outline weight, and edge quality with Ido, Inbal,
  and Ivri. In the app, compare perceived size and expression readability.

## Source and builder contract

Each character's local `source/` directory contains exactly two 1254×1254 files
per reaction:

- `<reaction>-chroma.png`
- `<reaction>-transparent.png`

The character-specific builder resizes each transparent master independently
with nearest-neighbor sampling. Source filenames, reaction order, canvas size,
and runtime filenames stay identical across characters. Encode the 128-pixel
logical normalization and palette limit in the character builder so a rebuild
cannot silently restore a higher-detail mismatch.

Ido's shared shirt mark is a builder-owned logical-pixel bitmap rather than
generated lettering. It is nearest-neighbor scaled and placed with per-reaction
coordinates after the 512×512 resize. Do not apply one normalized logo anchor
across poses with different torso centers or neckline heights.

## Pre-merge checklist

1. Confirm the exact six production filenames and no extras.
2. Confirm 512×512 RGBA output, transparent corners, and no visible matte fringe.
3. Compare a six-pose contact sheet with the approved cast for pixel grain,
   outline weight, palette, apparent age, proportions, scale, and cropping.
4. Toggle reactions in the smallest supported app viewport and confirm the
   character does not appear to jump, sharpen, blur, or change identity.
5. Confirm every production PNG is below 256 KiB and no `source/` file is
   referenced by runtime markup or CSS.
6. Rebuild twice from the masters and verify that the output is reproducible.

## Known legacy discrepancies (2026-08-02 audit)

- Inat's original masters contained finer illustration detail than the first
  three characters. Her six production poses were re-rendered with simplified
  shapes and the shared coarse pixel language, then normalized through the
  128-pixel/96-color pipeline. The superseded masters remain locally archived
  and are not a style reference for future characters.
- Ivri is slightly finer and more shaded than Ido and Inbal, though still inside
  the current acceptable range. Use the midpoint between Ivri and Inbal for new
  art rather than increasing detail further.
- Ido's six poses were re-rendered after the initial audit. He remains the
  cast's broadest and most athletic character, but his shoulders and arms are
  moderately narrower and his head scale, saturation, framing, and side
  breathing room now follow the shared standard. His superseded masters remain
  locally archived and are not a style reference for future characters.
- Idan's six sprites were created at the approved coarse detail density and
  normalized through the same 128-pixel/96-color pipeline. His supplied photo
  informed only the olive uniform direction; the face is an original, looser
  adaptation. The `nervous-laugh` slot intentionally uses a calm stern pose.
- Inbal reads slightly smaller and narrower in-frame than the others. Her six
  poses are internally consistent, so no rescale is warranted without a redraw.
- The broad celebrating/mission gestures for Ivri and Inat approach or
  touch a canvas edge. This is acceptable for expressive poses, but neutral and
  face-defining features should retain breathing room.
- Ido's shirt mark is the only character-specific post-generation overlay. It is
  intentional and documented above; new typography or symbols must be built as
  logical-pixel artwork, never trusted to generated lettering.

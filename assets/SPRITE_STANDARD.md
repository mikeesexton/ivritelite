# Locked character sprite standard

The final five-character set was visually approved on 2026-08-03. Ido and
Inbal are frozen byte-for-byte. Inat, Ivri, and Idan were freshly redrawn as 18
independent images and approved beside the frozen references at native 512px.
Inbal is the sole visual style and effective-grain authority. Ido is the second
spatial measurement control, never a generation-style reference.

All 30 transparent masters are tracked at
`assets/sprite-masters/<character>/<reaction>-transparent.png`. All 30
production sprites are tracked at `assets/<character>/<reaction>.png`. Exact
hashes, dimensions, alpha statistics, framing boxes, file sizes, spatial
signatures, and the user-approved provisional-band deviations are locked in
`assets/sprite-lock.json`.

No sprite edit is routine maintenance. A deliberate replacement requires an
explicit request, independent generation calls, the full visual review, and an
intentional `npm run sprites:audit -- --write-lock` update.

## Magenta edge cleanup

The tracked masters use hard binary alpha. If a generated magenta background
leaves a visible exterior fringe, build non-destructive candidates with:

```sh
npm run sprites:clean-edges
```

The command writes cleaned masters, exact 512px production builds, a JSON
report, and native-resolution black/white contact sheets under
`tmp/sprite-edge-cleanup/`. It removes only edge-connected pixels matching the
locked magenta-spill predicate; it never recolors, feathers, smooths, or adds
partial alpha. After visual approval, promote the same validated candidates
with `npm run sprites:clean-edges -- --apply`, update the lock intentionally,
and advance the shared browser cache key.

## Direct export contract

Every builder performs exactly one 1254×1254 RGBA to 512×512 RGBA
nearest-neighbor resize and writes the result through `scripts/sprite_png.py`.
There is no logical 128px or 256px canvas, palette reduction, posterization,
blur, sharpening, smoothing, or intermediate enlargement.

Ido's deterministic shirt mark is the sole post-export exception. His builder
composites the existing 38×26 bitmap at 3× scale after the direct resize using
the frozen reaction-specific coordinates in
`docs/sprite-prompts/ido-logo-placements.json`. Generated Ido art must leave
the shirt front blank.

## Effective-resolution detector

Effective resolution means the spatial size and arrangement of visible color
clusters—not file dimensions and not the number of unique RGBA values. The
audit applies this deterministic measurement to every 512px production file:

1. Treat only pixels with alpha greater than zero as subject pixels.
2. Build independent 32-color and 64-color median-cut palettes from those
   visible RGB pixels only, without dithering.
3. At logical sizes 96, 128, 192, and 256, resize the measurement labels down
   and back to 512 using nearest-neighbor sampling.
4. Record the fraction of visible labels that survive unchanged.
5. Record the pixel-weighted median area of four-connected equal-label
   clusters and the adjacent visible-pixel boundary rate.
6. Reject exact reproduction through either a 128px or 256px round trip.

The provisional band for each reaction is the corresponding Ido/Inbal range
plus or minus 0.03 at each survival size. Cluster area runs from 75% of the
smaller reference through 125% of the larger; boundary rate uses the reference
range plus or minus 0.03. Unique RGBA count is informational only.

The approved 2026-08-03 set contains visible-review exceptions to some
provisional bands. Those exceptions are listed verbatim in the lock and are
now protected by exact hashes and exact spatial signatures. They are not new
tolerances and cannot justify a future approximate replacement.

## Immutable generation rules

The executable prompt, reference order, identity blocks, reaction blocks, and
rejection rules are frozen in
`docs/sprite-prompts/final-inbal-grain-standard.md`.

Generate exactly one independent image per call. Never generate a sheet, grid,
collage, or crop from a sheet. Use a perfectly flat `#FF00FF` background. A
failed drawing is rejected; resizing, pixelation, palette reduction, or other
processing may never rescue it. Normal rectangular pixel clusters are required
pixel-art geometry. What is prohibited is a repeated 2×2/4×4 macro-pixel
lattice or coarse enlarged tiles across facial and clothing features.

## Deterministic commands

Run with a Python environment that provides Pillow:

```sh
npm run sprites:build
npm run sprites:audit
npm test
```

`sprites:build` rebuilds all 30 production files. `sprites:audit` validates all
60 locked PNGs, the visible-only multiscale spatial signatures, dimensions,
RGBA mode, alpha, strict chroma, edge-connected magenta spill, framing, file
ceiling, anti-round-trip behavior,
builder structure, and two clean deterministic rebuilds of every production
sprite. Normal tests also verify every locked hash.

## Browser cache contract

Every runtime sprite URL and the stylesheet URL in `index.html` carry the same
release cache key. Any approved sprite replacement must advance both keys in
the same commit. This forces GitHub Pages clients to request the new stylesheet
and then the new sprite URLs instead of reusing an older cached image.

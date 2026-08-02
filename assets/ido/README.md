# Ido reaction assets

All runtime sprites use a transparent 512×512 canvas so changing reactions
does not move or resize the companion. Ido's approved masters are reduced to a
128×128 logical canvas, simplified to a 96-color RGBA palette, and then
nearest-neighbor enlarged to 512×512.

| File | Runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

The six poses were re-rendered as independent square images using Ido's
original identity and gestures plus Inbal, Ivri, and the corrected Inat as
style references. His youthful face, dark tousled hair, black sleeveless shirt,
and athletic identity remain locked, while his shoulders and arms are about
10–15% narrower and his head, eye line, saturation, and framing now match the
shared cast. Each pose has a 1254×1254 chroma-key source and transparent master
in `source/`, named `<reaction>-chroma.png` and
`<reaction>-transparent.png`. The superseded high-detail masters are preserved
under the ignored local `source/high-detail-original/` archive. No source file
is referenced by the site, so the archive adds no GitHub Pages load cost.

The shirt front stays blank in every generated master. The exact mark is
encoded as a 38×26 logical-pixel bitmap in `scripts/build-ido-sprites.py`,
nearest-neighbor scaled to 114×78, and composited at a pose-specific chest
position after each production resize. This keeps generated lettering out of
the asset pipeline and preserves the same crisp mark across all six torsos.

Rebuild the six runtime PNGs with:

```sh
python3 scripts/build-ido-sprites.py
```

# Inat reaction assets

All runtime sprites use the same transparent 512×512 canvas and coarse
pixel-art treatment as Ido, Inbal, and Ivri. Inat's approved masters are reduced
to a 128×128 logical canvas, simplified to a 96-color RGBA palette, and then
nearest-neighbor enlarged to 512×512. This keeps her displayed pixel grain
visible at the app's 108–136px placements instead of being smoothed away.

| File | Intended runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

Inat is a distinguished professor in her 50s with a mature angular face,
shoulder-length swept-back honey-blonde hair, dark tortoiseshell rectangular
glasses, and a tailored mustard-yellow pantsuit over a cream blouse. The small
gold brooch, adult facial lines, and restrained expressions are locked design
details. She should remain authoritative and warm rather than cute, doll-like,
or glossy.

The six reactions were re-rendered individually from the locked neutral design,
using Ido, Inbal, and Ivri as style references, on flat chroma-key backgrounds
and converted to transparent 1254×1254 masters in the local `source/`
directory. The superseded high-detail masters are preserved under
`source/high-detail-original/`. No source file is referenced by the site, so
retaining either set has no effect on GitHub Pages load time.

The production style contract is visibly chunky logical pixels, a limited
cel-shaded palette, strong near-black outlines, mature proportions, chest-up
framing, simplified hair and garment shapes, crisp hard pixel steps, and no
smooth high-resolution illustration detail.

Rebuild the runtime sprites with:

```sh
python scripts/build-inat-sprites.py
```

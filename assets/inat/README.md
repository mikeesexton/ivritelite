# Inat reaction assets

All runtime sprites use the same transparent 512×512 canvas and coarse
pixel-art treatment as Ido, Inbal, and Ivri.

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

The six reactions were generated individually from the locked neutral design on
a flat magenta chroma-key background and converted to transparent 1254×1254
masters in `source/`. The production prompt used the existing character set as
the style contract: visibly chunky logical pixels, a limited cel-shaded palette,
strong near-black outlines, mature proportions, chest-up framing, crisp hard
pixel steps, and no antialiasing or smooth high-resolution rendering.

Rebuild the runtime sprites with:

```sh
python scripts/build-inat-sprites.py
```

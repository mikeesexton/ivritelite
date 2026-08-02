# Idan reaction assets

Idan uses the same transparent 512×512 canvas and coarse pixel-art treatment
as the rest of the cast. His approved masters are reduced to a 128×128 logical
canvas, limited to a 96-color RGBA palette, and nearest-neighbor enlarged to
512×512 so the pixel grain remains consistent at the app's 108–136px sizes.

| File | Intended runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three wrong answers; stern and disciplined, not embarrassed |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

Idan is an original character in his early 40s with a broad rectangular face,
short side-combed dark-brown hair, hazel-brown eyes, and a tidy squared beard.
His olive field shirt and simplified olive tactical vest are loosely informed
by the supplied uniform reference. The character does not reproduce the
reference subject's likeness, and no sprite may include a weapon, ammunition,
holster, sling, radio, insignia, flag, text, or logo.

His visual voice is composed and disciplined. The `nervous-laugh` filename is
retained for the shared runtime contract, but its art is deliberately stern:
level gaze, slightly lowered horizontal brows, a straight closed mouth, and
squared posture. It must never be replaced with the cast's usual embarrassment,
laughter, blushing, shame, or an angry overreaction.

The six reactions were generated individually from the locked neutral design,
using Ido, Inbal, Ivri, and Inat as style references. Flat chroma backgrounds
were removed locally and the transparent 1254×1254 masters remain in the
ignored `source/` directory. Runtime code references only the small production
PNGs, so retaining the masters does not affect GitHub Pages loading.

Rebuild the runtime sprites with:

```sh
python scripts/build-idan-sprites.py
```

# Ivri reaction assets

All runtime sprites use the same transparent 512×512 canvas and coarse
pixel-art treatment as Ido and Inbal. Ivri wears a light-blue open-collar shirt
and navy tailored jacket, with short dark-brown hair and trimmed stubble.

| File | Intended runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

The six poses were generated individually from a locked neutral design on a
flat magenta chroma-key background and converted to transparent 1254×1254
masters in `source/`. Their art is authored at the same visibly coarse logical
pixel resolution, simplified proportions, limited cel-shaded palette, and
heavy-outline treatment as Ido and Inbal, then nearest-neighbor resized to the
512×512 runtime canvas. The intentionally unused surprised pose is omitted.

Rebuild the runtime sprites with:

```sh
python scripts/build-ivri-sprites.py
```

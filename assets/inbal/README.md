# Inbal reaction assets

All runtime sprites use the same transparent 512×512 canvas and the same coarse
pixel-art treatment as Ido, so changing reactions does not move, resize, or
visually sharpen the companion.

| File | Intended runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

The six final reactions are generated individually on a flat blue chroma-key
background, converted to transparent 1254×1254 masters in `source/`, and then
normalized to 512×512 runtime PNGs. The intentionally unused surprised pose from
Ido's set is omitted.

Inbal's locked design is long dark-brown hair, a muted purple shirt, moss-green
cardigan, silver hoop earrings, and a small crescent pendant.

Rebuild the runtime sprites with:

```sh
python scripts/build-inbal-sprites.py
```

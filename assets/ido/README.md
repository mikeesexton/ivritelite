# Ido reaction assets

All runtime sprites use a transparent 512×512 canvas so changing reactions does not move or resize the companion.

| File | Runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Preserved alternate negative reaction; currently unused |
| `surprised-unused.png` | Preserved original top-center pose; intentionally unused |

Each regenerated pose has a chroma-key source and a transparent source in `source/`.
The six sheet-derived reactions were rebuilt individually so their shirts and
silhouettes are natural rather than repaired with a shared mask. The approved
`nervous-laugh.png` is intentionally excluded from the builder and remains
unchanged.

Rebuild the six regenerated runtime PNGs with:

```sh
python3 scripts/build-ido-sprites.py
```

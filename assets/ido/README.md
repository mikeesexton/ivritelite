# Ido reaction assets

All runtime sprites use a transparent 512×512 canvas so changing reactions does not move or resize the companion.

| File | Runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

The six poses were generated as six independent square images. Each has a
1254×1254 chroma-key source and transparent master in `source/`, named
`<reaction>-chroma.png` and `<reaction>-transparent.png`. Sprite sheets, grids,
and grid-derived crops are not production sources. The attached shirt mark is
encoded as a 38×26 logical-pixel bitmap in `scripts/build-ido-sprites.py`,
nearest-neighbor scaled to 114×78, and composited at a pose-specific chest
position after each source is resized. This keeps the mark crisp and visibly
pixelated without forcing one placement across six different torsos.

Rebuild the six runtime PNGs with:

```sh
python3 scripts/build-ido-sprites.py
```

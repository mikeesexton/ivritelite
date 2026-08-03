# Inbal reaction assets

All runtime sprites use the same transparent 512×512 canvas. Each is one direct
nearest-neighbor export from its tracked 1254×1254 RGBA master in
`assets/sprite-masters/inbal/`; there is no logical-canvas or palette pass.

| File | Intended runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

The six final reactions were independently generated on flat magenta chroma-key
backgrounds and approved as a set. Ivri alone is the style and density
authority. Exact prompts are stored in `docs/sprite-prompts/inbal.md`.

Inbal's locked design is long wavy dark-brown hair, warm medium-tan skin, a dark
plum top, olive cardigan, small silver earring, and silver chain with a vertical
rectangular pendant.

Rebuild the runtime sprites with:

```sh
python scripts/build-inbal-sprites.py
python scripts/audit-sprites.py
```

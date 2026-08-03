# Ido reaction assets

All runtime sprites use a transparent 512×512 canvas. Each is one direct
nearest-neighbor export from its tracked 1254×1254 RGBA master in
`assets/sprite-masters/ido/`; there is no logical-canvas or palette pass.

| File | Runtime use |
| --- | --- |
| `neutral.png` | Picker, greeting, activity intro, and neutral gameplay |
| `nervous-laugh.png` | One to three consecutive wrong answers |
| `celebrating.png` | Four or more correct answers and recovery after a miss |
| `struggling.png` | Four or more wrong answers |
| `mission-complete.png` | Final mission results |
| `frustrated.png` | Alternate negative reaction |

The six independently generated poses lock Ido's youthful modeled face, larger
adult eyes, dark tousled hair, black sleeveless shirt, and athletic build. Ivri
alone is the style and density authority. Exact prompts are stored in
`docs/sprite-prompts/ido.md`.

The shirt front stays blank in every generated master. The exact mark is
encoded as a 38×26 logical-pixel bitmap in `scripts/build-ido-sprites.py`,
nearest-neighbor scaled to 114×78, and composited at a pose-specific chest
position after each production resize. This keeps generated lettering out of
the asset pipeline and preserves the same crisp mark across all six torsos.

Rebuild and verify with a Pillow-enabled Python environment:

```sh
python scripts/build-ido-sprites.py
python scripts/audit-sprites.py
```

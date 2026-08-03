# Inat reaction assets

All runtime sprites use the same transparent 512×512 canvas. Each is one direct
nearest-neighbor export from its tracked 1254×1254 RGBA master in
`assets/sprite-masters/inat/`; there is no logical-canvas or palette pass.

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

The six reactions were generated independently from the approved neutral. Ivri
alone is the style and density authority. Exact prompts are stored in
`docs/sprite-prompts/inat.md`.

Rebuild the runtime sprites with:

```sh
python scripts/build-inat-sprites.py
python scripts/audit-sprites.py
```

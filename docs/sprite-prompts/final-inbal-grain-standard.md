# Final Inbal-grain character regeneration instructions

These are the permanent hardcoded instructions for the locked character cast.
Do not average them with an older prompt document.

## Reference order

For a neutral, provide exactly these references in this order:

1. Target character's current approved neutral master: identity and wardrobe only.
2. `assets/sprite-masters/inbal/neutral-transparent.png`: sole drawing-style,
   contour, shading, anatomy, framing, and apparent-scale authority.
3. `assets/inbal/neutral.png`: sole effective pixel-grain authority.

For a non-neutral reaction, provide exactly these references in this order:

1. Target character's approved neutral master: absolute identity authority.
2. Target character's approved outgoing equivalent reaction: gesture and
   emotional meaning only.
3. Inbal's corresponding 1254px master: sole style, shading, anatomy, framing,
   and apparent-scale authority.
4. Inbal's corresponding 512px production sprite: sole effective-grain authority.

Never use Ido as a generation-style reference. He is a spatial measurement
control only. Never copy Inbal's identity, clothing, coloring, or anatomy.

## Verbatim common prompt

> Create one new, independent, square character-reaction portrait. This is a
> fresh redraw, not a resize, filter, collage, trace, crop from a sheet, or
> modification of reference pixels. Preserve the target character from the
> identity reference exactly while matching only Inbal's drawing style,
> effective pixel-art grain, outline treatment, shading complexity, mature
> proportions, framing, and scale.
>
> Draw native fine-grain pixel art capable of meaningful one-pixel changes in
> the final 512×512 image. Use crisp square pixels, normal rectangular pixel
> clusters, fine irregular one-pixel and two-pixel stair steps, variable
> near-black outer contours, compact internal detail, clustered highlights,
> and modeled multi-tone cel shading. Do not use a 128×128 or 256×256 logical
> grid. Do not simulate pixel art by enlarging low-resolution artwork. Reject
> repeated 2×2 or 4×4 macro-pixel lattices and coarse tile-like blocks across
> the face, eyes, hair, hands, or clothing. Do not use painterly gradients,
> airbrushing, vector-smooth curves, glossy 3D rendering, dithering noise,
> hair-thin anti-aliased illustration lines, or excessive micro-detail.
>
> Use mature chest-up human proportions. Match Inbal's apparent head size,
> eye-line height, torso scale, and tight square framing. Keep the hair and face
> fully visible, bring the torso naturally through the bottom edge, and keep
> identity-defining accessories legible. A reaction gesture may approach an
> edge, but the face and essential gesture must not be clipped.
>
> Render the subject against a perfectly flat, uniform #FF00FF chroma-key
> background. No gradient, shadow, floor, glow, reflection, texture, scenery,
> watermark, caption, border, debris, extra object, or extra character. Do not
> use #FF00FF anywhere in the subject.
>
> The identity reference controls identity only. The outgoing reaction controls
> reaction semantics only. Inbal controls style and effective grain only. Do
> not blend their faces, hair, body, clothing, colors, or accessories.

## Identity blocks

- **Ido:** youthful adult man; warm medium skin; narrow mature clean-shaven
  face; larger expressive adult dark eyes; tousled dark navy-black hair;
  moderately broad athletic shoulders and muscular arms; charcoal-black
  sleeveless athletic shirt with modeled fabric planes. Keep the generated
  shirt completely blank. No generated lettering, logo, mark, symbol, or
  pseudo-text. A black fingerless glove is allowed only where the reaction
  already requires it. The deterministic builder adds the exact shirt mark.
- **Inbal:** mature woman; narrow oval face; warm medium-tan skin; dark-brown
  eyes; very long thick wavy dark-brown hair with warm highlights and a deep
  side part; small silver earring; silver chain and vertical rectangular
  pendant; olive textured open cardigan; dark plum scoop-neck top. Intelligent,
  warm, and composed; never cute, childlike, glossy, or anime-like.
- **Inat:** distinguished professor in her 50s; mature angular face with
  restrained adult lines; shoulder-length swept-back honey-blonde hair; dark
  tortoiseshell rectangular glasses; mustard-yellow tailored blazer; cream
  blouse; small gold brooch; restrained earrings. Authoritative and warm,
  never cute, doll-like, youthful, glamorous, or glossy.
- **Ivri:** adult man; mature rectangular-to-angular face; short tousled
  dark-brown hair; blue eyes; neatly trimmed dark stubble and short beard; warm
  medium skin; light-blue open-collar shirt; navy tailored jacket. Preserve his
  exact approved facial structure, hairline, beard silhouette, coloring, and
  confident warmth. No resemblance to a real person.
- **Idan:** original early-40s man; broad rectangular mature face; short
  side-combed dark-brown hair; hazel-brown eyes; tidy squared beard; warm medium
  skin; composed posture; olive field shirt and simplified olive tactical vest.
  No weapon, ammunition, holster, sling, radio, insignia, rank, flag, text,
  logo, badge, unit marking, or resemblance to a real person.

## Reaction blocks

- `neutral`: calm direct gaze, closed relaxed mouth, neutral shoulders, no gesture.
- `nervous-laugh`: mild self-conscious miss with one hand behind the neck and a
  restrained awkward smile. **Idan exception:** level direct gaze, slightly
  lowered nearly horizontal brows, straight closed mouth, squared posture; no
  laugh, smile, embarrassment, shame, blush, anger, or gesture.
- `celebrating`: energetic success, genuine open smile, one compact raised
  fist, gesture fully legible. No thumbs-up or second raised fist.
- `struggling`: unmistakable intense difficulty; tightened shoulders,
  compressed or clenched mouth, visibly strained expression. Do not make this
  thoughtful, skeptical, mildly concerned, or identical to frustrated.
- `mission-complete`: warm confident success, one compact thumbs-up, composed
  approving smile; clearly calmer than celebrating. No raised fist.
- `frustrated`: contained negative alternate with narrowed or closed eyes and a
  tense mouth; clearly frustrated but not furious, violent, or identical to
  struggling. No gesture.

## Controlled process

1. Stage all outputs outside production directories.
2. Generate neutrals independently and approve them together beside Ido and
   Inbal at native 512px and live UI sizes.
3. Freeze approved neutrals as identity authority.
4. Generate each remaining reaction in its own call with the exact reference order.
5. Remove only the flat chroma background. For hard-edged pixel art, use hard
   alpha with no soft matte, feathering, blur, sharpening, palette reduction,
   or despill that changes subject pixels.
6. Permit at most one targeted correction per rejected asset and reassert the
   complete common, identity, and reaction blocks.
7. Never resize, pixelate, posterize, quantize, or filter art to rescue a mismatch.
8. Install nothing until the complete set is visually approved.
9. Track every approved 1254px master, rebuild directly to 512px, advance the
   stylesheet and sprite cache keys, write the lock intentionally, and run the
   complete verification suite.

## Acceptance and lock

Every master is exactly 1254×1254 RGBA; every production file is exactly
512×512 RGBA. Four corners are transparent, visible chroma is zero, identity
and reaction semantics remain stable, and neither a 128px nor 256px
nearest-neighbor round trip may reproduce production pixels exactly.

The visible-only spatial detector and provisional Ido/Inbal bands are specified
in `assets/SPRITE_STANDARD.md` and implemented in `scripts/audit-sprites.py`.
Unique RGBA values never pass or fail art. Final same-artist judgment requires
native-size visual comparison on dark and light backgrounds. Once approved,
exact file hashes and exact spatial signatures supersede provisional bands and
freeze the accepted files in `assets/sprite-lock.json`.

# Ido approved-set generation prompts

Built-in image generator; one independent call per reaction.

## Reference order for every reaction

1. Approved neutral identity anchor: `assets/sprite-masters/ido/neutral-transparent.png`
2. Approved Ido reaction: `assets/sprite-masters/ido/<reaction>-transparent.png`
3. Ivri source-style reaction: `assets/ivri/source/<reaction>-transparent.png`
4. Ivri production-density reaction: `assets/ivri/<reaction>.png`

## Common prompt

> Use case: identity-preserve
> Asset type: one square game character reaction sprite
>
> Create one new independent square pixel-art portrait. This is a fresh redraw, not a resize, filter, collage, trace, or modification of reference pixels.
>
> REFERENCE ORDER AND AUTHORITY
> Image 1 is the newly approved larger-eyed Ido neutral anchor and is the absolute authority for identity: preserve this exact clean-shaven youthful adult man, face shape, larger expressive adult eyes, eye color, warm medium skin, gentle modeled facial color planes, tousled dark navy-black hair silhouette, athletic build, black sleeveless shirt, proportions, and overall character design.
> Image 2 is Ido's outgoing equivalent reaction and controls gesture and emotional meaning only. Do not copy its older flatter face rendering, coarse density, anatomy, proportions, or expression styling.
> Image 3 is Ivri's equivalent source master and is the sole authority for pixel-art medium, mature anatomical rendering, outline treatment, multi-tone cel shading, framing, and scale.
> Image 4 is Ivri's equivalent 512px production sprite and is the sole authority for final pixel density. Do not copy Ivri's identity, beard, hair, clothing, coloring, or anatomy.
>
> IDENTITY LOCK
> Ido is a youthful adult man with warm medium skin; a narrow mature clean-shaven face; the same larger expressive adult eyes as Image 1; tousled dark navy-black hair; dark eyes; moderately broad athletic shoulders and muscular arms; and a charcoal-black sleeveless athletic shirt with modeled fabric planes. His face must keep the same coordinated light, midtone, and shadow clusters across cheeks, brow ridge, eyelids, nose, lips, jaw, chin, ears, and neck as the approved neutral. Keep the generated shirt front completely blank. No generated lettering, logo, chest mark, symbol, or pseudo-text. A black fingerless glove is allowed only if the outgoing reaction shows it. Do not add facial hair or redesign him.
>
> PIXEL ART AND DENSITY
> Match Ivri's native high-density pixel-art medium: crisp square stair-steps, strong near-black outer contours, controlled one-to-three-pixel internal detail, clustered highlights, and multi-tone cel shading. Draw natively with meaningful one-pixel changes at final 512x512 resolution and enough controlled tonal variation to match Ivri's production density. Do not use a 128x128 or 256x256 logical grid. Do not enlarge coarse low-resolution art. No painterly gradients, airbrushing, vector-smooth curves, glossy 3D rendering, dithering noise, hair-thin illustration lines, random texture, or excessive micro-detail.
>
> COMPOSITION
> Use mature chest-up human proportions. Match the approved neutral's apparent head size and identity while following Ivri's equivalent reaction for eye-line height, torso scale, and tight square framing. Keep hair and face fully visible, bring the torso naturally through the bottom edge, and keep the essential gesture fully legible without clipping. Exactly one Ido and one reaction.
>
> BACKGROUND
> Render against a perfectly flat uniform #FF00FF chroma-key background. No gradient, shadow, floor, glow, reflection, texture, scenery, watermark, caption, border, extra object, or debris. Do not use #FF00FF anywhere in the subject.

## Reaction suffixes

### nervous-laugh

> REACTION
> Mild self-conscious miss: one hand behind the neck and a restrained awkward closed-mouth or barely open smile. Preserve Ido's identity and larger-eye proportions while making the expression clearly sheepish, not joyful. Keep the face visible. No shame, blush, panic, or exaggerated comedy.

### celebrating

> REACTION
> Energetic success: genuine open smile and one compact raised fist, with the fist fully legible and unclipped. This is the most energetic positive pose. Preserve Ido's approved larger eyes without making them circular, gigantic, glossy, or surprised. A black fingerless glove is allowed on the raised fist because the outgoing reaction contains it.

### struggling

> REACTION
> Unmistakable intense difficulty: tightened shoulders, compressed or clenched mouth, visibly strained brow and eyes, physical effort. Do not make him merely thoughtful, skeptical, mildly concerned, furious, or identical to frustrated. No hand gesture is required; preserve the outgoing pose semantics.

### mission-complete

> REACTION
> Warm confident success: one compact thumbs-up and a composed approving smile, clearly calmer than celebrating. Keep the thumb and hand fully legible and unclipped. Preserve the same approved larger-eyed Ido identity. A black fingerless glove is allowed on the thumbs-up hand because the outgoing reaction contains it.

### frustrated

> REACTION
> Contained negative alternate: narrowed or closed eyes and a tense closed mouth, clearly frustrated but not furious, violent, shouting, or identical to struggling. Shoulders may tense slightly, but the pose must remain distinct from intense physical difficulty.

## Rejected correction

The sole nervous-laugh framing correction was rejected because it shrank Ido far below the locked apparent scale. Rejected chroma staging was deliberately removed after approval; it is not a generation reference.

## Deterministic logo placement

The generated shirt remains blank. The existing 114×78 deterministic bitmap is composited after the direct 512px export using the audited coordinates in `ido-logo-placements.json`. Each coordinate centers the mark on that reaction's measured visible dark-shirt front panel; no outgoing legacy placement is reused.

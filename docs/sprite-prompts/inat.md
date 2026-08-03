# Inat approved-set generation prompts

Built-in image generator; one independent call per reaction.

## Reference order for every reaction

1. Approved corrected neutral identity anchor: `assets/sprite-masters/inat/neutral-transparent.png`
2. Approved Inat reaction: `assets/sprite-masters/inat/<reaction>-transparent.png`
3. Ivri source-style reaction: `assets/ivri/source/<reaction>-transparent.png`
4. Ivri production-density reaction: `assets/ivri/<reaction>.png`

## Common prompt

> Use case: identity-preserve
> Asset type: one square game character reaction sprite
>
> Create one new independent square pixel-art portrait. This is a fresh redraw, not a resize, filter, collage, trace, or modification of reference pixels.
>
> REFERENCE ORDER AND AUTHORITY
> Image 1 is the approved corrected Inat neutral anchor and is the absolute identity authority. Preserve this exact distinguished professor: the same mature angular face, apparent age in her 50s, restrained adult facial lines, dark tortoiseshell rectangular glasses, swept-back shoulder-length honey-blonde hair silhouette and colors, warm skin tone, mustard-yellow tailored blazer, cream blouse, small gold brooch, proportions, and character design.
> Image 2 is Inat's outgoing equivalent reaction and controls gesture and emotional meaning only. Do not copy its older finer/smoother rendering, identity drift, proportions, or density.
> Image 3 is Ivri's equivalent source master and is the sole authority for pixel-art medium, outline treatment, multi-tone cel shading, mature anatomical construction, framing, and scale.
> Image 4 is Ivri's equivalent 512px production sprite and is the sole authority for final pixel density. Do not copy Ivri's identity, beard, hair, clothing, coloring, or anatomy.
>
> IDENTITY LOCK
> Inat is a distinguished professor in her 50s with a mature angular face and restrained adult facial lines; shoulder-length swept-back honey-blonde hair; dark tortoiseshell rectangular glasses; a mustard-yellow tailored blazer; a cream blouse; and a small gold brooch on the blazer. Preserve the approved neutral's exact face, eye shape behind the lenses, nose, mouth, jawline, skin shading, hair volume, glasses geometry, wardrobe colors, lapel construction, and brooch design. She is authoritative and warm, never cute, doll-like, youthful, glamorous, glossy, coquettish, or anime-like. Never remove, round, resize, recolor, or redesign her glasses. Never omit or move the brooch. No jewelry beyond the approved earrings and brooch. No text, logo, watermark, or extra accessory.
>
> PIXEL ART AND DENSITY
> Match Ivri's native pixel-art medium: crisp square stair-steps, strong near-black outer contours, controlled one-to-three-pixel internal detail, clustered highlights, and multi-tone cel shading. Draw natively with meaningful one-pixel changes at final 512x512 resolution. Keep controlled shading on the face, hair, glasses, blazer, blouse, and brooch without returning to the outgoing art's excessive fine/smooth micro-detail. Do not use a 128x128 or 256x256 logical grid. Do not enlarge coarse low-resolution art. No painterly gradients, airbrushing, vector-smooth curves, glossy 3D rendering, dithering noise, hair-thin illustration lines, random texture, or excessive micro-detail.
>
> COMPOSITION
> Use mature chest-up human proportions. Match the approved neutral's apparent head size and identity while following Ivri's equivalent reaction for eye-line height, torso scale, and tight square framing. Keep all hair, face, glasses, and brooch fully visible. Bring the torso naturally through the bottom edge. Keep the essential gesture fully legible without clipping. Exactly one Inat and one reaction.
>
> BACKGROUND
> Render against a perfectly flat uniform #FF00FF chroma-key background. No gradient, shadow, floor, glow, reflection, texture, scenery, watermark, caption, border, extra object, or debris. Do not use #FF00FF anywhere in the subject.

## Reaction suffixes

### nervous-laugh

> REACTION
> Mild self-conscious miss: one hand behind the neck and a restrained awkward smile. The expression is sheepish but still dignified and adult. Keep the hand, glasses, face, hair, brooch, and essential gesture fully legible. No shame, blush, panic, exaggerated comedy, youthfulness, or coquettish pose.

### celebrating

> REACTION
> Energetic success: a genuine open smile and one compact raised fist, fully legible and unclipped. This is the energetic positive pose. Keep her mature authority, glasses, hair, tailoring, and brooch intact. No girlish squeal, jumping, glamour pose, giant anime eyes, or exaggerated open-mouth distortion.

### struggling

> REACTION
> Unmistakable intense difficulty: tightened shoulders, compressed or clenched mouth, visibly strained brow and eyes behind the glasses, and clear physical or mental effort. Do not make this merely thoughtful, skeptical, mildly concerned, furious, or identical to frustrated. Preserve the glasses alignment and mature face.

### mission-complete

> REACTION
> Warm confident success: one compact thumbs-up and a composed approving smile, clearly calmer than celebrating. Keep the thumb, hand, glasses, brooch, and face fully legible and unclipped. The expression is professionally pleased, not cute, flirtatious, or exuberant.

### frustrated

> REACTION
> Contained negative alternate: narrowed or closed eyes behind the glasses and a tense closed mouth, clearly frustrated but not furious, violent, shouting, or identical to struggling. Keep the glasses seated naturally and fully visible; do not hide the face or remove the brooch.

# Inbal approved-set generation prompts

Built-in image generator; one independent call per reaction.

## Reference order for every reaction

1. Approved corrected neutral anchor: `assets/sprite-masters/inbal/neutral-transparent.png`
2. Approved Inbal reaction: `assets/sprite-masters/inbal/<reaction>-transparent.png`
3. Ivri source-style reaction: `assets/ivri/source/<reaction>-transparent.png`
4. Ivri production-density reaction: `assets/ivri/<reaction>.png`

## Common prompt

> Use case: identity-preserve
> Asset type: one square game character reaction sprite
>
> Create one new independent square pixel-art portrait. This is a fresh redraw, not a resize, filter, collage, trace, or modification of reference pixels.
>
> Image 1 is the newly approved Inbal neutral and is the absolute identity authority. Preserve her exact mature narrow oval face, warm medium-tan skin, dark brown eyes, natural brows, very long thick wavy dark-brown hair with warm highlights and a deep side part, small silver earring, silver chain and vertical rectangular pendant, olive textured open cardigan, dark plum scoop-neck top, proportions, colors, and design.
>
> Image 2 controls gesture and emotional meaning only. Do not copy its coarse low-resolution grid, flat face, oversized anime-like eyes, small scale, or old proportions. Image 3 controls Ivri's pixel-art medium, mature anatomy, outlines, multi-tone cel shading, and reaction framing. Image 4 controls final pixel density. Never copy Ivri's identity, beard, hair, clothing, colors, or anatomy.
>
> Preserve the approved neutral's exact face, natural-sized eyes, skin shading, hair volume and silhouette, earring, necklace, pendant, wardrobe colors, cardigan texture, neckline, and adult proportions. The jewelry is identity-defining and must remain present and legible. Keep her warm, intelligent, composed, and adult; never cute, childlike, doll-like, glamorous, glossy, coquettish, anime-like, or photorealistic. No glasses, glamour makeup, extra jewelry, text, logos, symbols, or accessories.
>
> Match Ivri's native high-density pixel art: crisp square stair-steps, strong near-black contours, controlled one-to-three-pixel detail, clustered highlights, multi-tone cel shading, and meaningful one-pixel changes at final 512x512. No 128px/256px logical grid, coarse enlargement, painterly gradient, airbrush, vector smoothing, glossy 3D, dithering noise, hair-thin lines, random texture, or excessive micro-detail.
>
> Use mature chest-up proportions matching the approved neutral's head size, eye line, torso scale, and long-hair silhouette while following Ivri's equivalent gesture framing. Keep hair, face, earring, necklace, pendant, neckline, cardigan, and essential gesture visible; bring torso and hair through the bottom; keep all four corners background.
>
> Use a perfectly flat uniform #FF00FF background. No gradient, shadow, floor, glow, reflection, texture, scenery, watermark, caption, border, extra object, or debris. Do not use #FF00FF in Inbal.

## Reaction suffixes

- `nervous-laugh`: Mild self-conscious miss; one hand behind the neck; restrained awkward adult smile; no shame, blush, panic, exaggerated comedy, or coquettish pose.
- `celebrating`: Energetic success; genuine open smile; one compact raised fist; no childish squeal, jumping, glamour pose, giant anime eyes, or distorted mouth.
- `struggling`: Unmistakable intense difficulty; tightened shoulders, compressed or clenched mouth, visibly strained brow and eyes; not thoughtful, skeptical, mildly concerned, furious, or identical to frustrated.
- `mission-complete`: Warm confident success; compact thumbs-up; composed approving smile; calmer than celebrating; not cute, flirtatious, or exuberant.
- `frustrated`: Contained negative alternate; narrowed or closed eyes and tense closed mouth; frustrated but not furious, violent, shouting, or identical to struggling.

# IvritElite character gameplay strategy

Status: live working document. Update this file as character content, visual design, and gameplay integration decisions change.

## Product model

Each day the learner chooses a Tel Aviv character. The choice changes the day's emphasis and voice without locking the learner out of the rest of the course.

- Standard character mix: 65% primary material, 20% shared or overlapping material, 15% adaptive review.
- Itamar mix: primarily the learner's weakest material across the entire course, with no protected comfort zone.
- Character assignment is a lens, not an exclusive taxonomy. A word or sentence may belong to multiple characters.
- Keep the initial cast at five. Ido's practical-life coverage closes the largest remaining gap without adding a sixth character.

## Cast and routing

### Ido

Chill · connected · streetwise

Owns contemporary speech: slang, colloquial Hebrew, LGBTQ+ language, nightlife, texting, youth culture, olim language, and practical Tel Aviv life.

- Greeting: “אהלן, new friend. Today we're learning how people actually talk—and how they actually live.”
- Four correct: “Okayyy, four straight. עכשיו זה זורם.”
- Four wrong: “רגע, no stress. Slow down and listen for how it sounds.”
- Complete: “סבבה, we're done. You did great—see you tomorrow, נשמה.”

### Ivri

Precise · ambitious · strategic

Owns systems and institutions: business, startups, bureaucracy, law, formal logic, finance, security, military terminology, and defense technology.

- Greeting: “בוקר טוב. Today we're making the language precise enough for a contract, a briefing, or a government form.”
- Four correct: “Four clean answers. מדויק—keep moving.”
- Four wrong: “The logic is slipping. Slow down, identify the rule, and answer exactly.”
- Complete: “Good work. The brief is complete—see you tomorrow.”

### Inbal

Intuitive · uncanny · creative

Owns religion, folk practice, magic, spirituality, the supernatural, ritual, ex-religious life, and the material culture surrounding those subjects.

- Greeting: “היי. We have a bowl to inscribe and a few mysteries to untangle.”
- Four correct: “Four in a row. The signs are unusually clear today.”
- Four wrong: “Something is clouding the message. Breathe, look again, and try more carefully.”
- Complete: “Beautiful work. The ritual is complete—thank you, and I'll see you tomorrow.”

### Inat

Incisive · cultured · defiant

Owns literature, music, visual art, history, cultural memory, political language, activism, occupation, policing, social justice, and left-wing analysis.

- Greeting: “שלום. Bring a sharp pencil—we're reading the text and the power behind it.”
- Four correct: “Four strong answers. That's an argument with evidence—keep going.”
- Four wrong: “Not convincing yet. Return to the text, question the premise, and try again.”
- Complete: “Excellent work. The notes are solid—thank you, and see you tomorrow.”

### Itamar

Exacting · relentless · unsentimental

Owns no subject area. He selects weak, missed, or overdue material from every pool and drills it aggressively.

- Greeting: “Listen carefully. We are working on what you avoid, not what you enjoy.”
- Four correct: “Four correct. Acceptable. Do it again.”
- Four wrong: “Four failures. Focus, correct the weakness, and stop guessing.”
- Complete: “Mission complete. You improved. Report back tomorrow.”

## Ivri/Inat boundary

The split is coherent if it is based on perspective rather than topic.

- Ivri asks how an institution, system, technology, law, or security apparatus functions.
- Inat asks who holds power, whose experience is omitted, how culture remembers an event, and how policy affects people.
- Shared current-events items should carry both routes when both readings are useful. Examples include the Supreme Court, military service, policing, elections, budgets, protests, and the occupation.
- Security hardware, defense-tech operations, formal military language, and bureaucratic process lean Ivri. Human-rights framing, protest language, historical narrative, police brutality, and occupation vocabulary lean Inat.

## Abbreviation and acronym split

Abbreviations need explicit multi-owner routing; forcing every abbreviation into one character would produce arbitrary results.

- Ido: messaging shorthand, internet language, nightlife, youth, and colloquial abbreviations.
- Ivri: government bodies, military and security terms, defense technology, legal procedure, finance, business, and bureaucracy.
- Inbal: religious texts, religious institutions, ritual references, and traditional formulae.
- Inat: political parties and movements, rights organizations, activist groups, cultural institutions, media, and historical abbreviations.
- Itamar: adaptive review of all abbreviation groups, weighted toward errors.
- Unclear or genuinely cross-cutting items should route to two or more characters.

## Implemented content ledger

### Ido baseline

The existing colloquial tranche includes the newer LGBTQ+ and camp slang material, related sentences, and the verbs `להרוס` and `ללרלר`. Preserve it as the current Ido content baseline.

### Inbal expansion

- Vocabulary: 30 cards in `religion_magic_spirituality`.
- Sentences: 16 entries, `inbal_01` through `inbal_16`.
- Conjugation verbs: `לברך` and `להתפלל`, with stored present, past, and future forms.
- Coverage includes incantation bowls, Aramaic inscriptions, amulets, the evil eye, dream interpretation, dybbuks, prayer, mikveh, ex-religious identity, ritual practice, and careful distinctions between folklore and factual claims.

### Inat expansion

- Vocabulary: 30 cards in `literature_arts_cultural_history`.
- Sentences: 24 entries, `inat_01` through `inat_24`.
- Conjugation verbs: `לפרש` and `למחות`, with stored present, past, and future forms.
- Coverage includes short public-domain cultural texts, close reading, narrators, archives, oral history, protest music, satire, theater, visual art, censorship, labor action, civil disobedience, policing, collective memory, and counter-narratives.

No dedicated first-pass additions are currently required for Binyanim, Prepositions, or the abbreviation game. Those modes can use multi-owner routing when the character layer is implemented.

## Visual-production handoff

Visual work is a separate project from the content expansion.

- Direction: editorial 2D cutout illustrations, actor-inspired but original rather than portraits or direct copies.
- Delivery: transparent individual assets, not a traditional sprite sheet.
- Production order: complete one character at a time. Establish and approve one neutral anchor before generating expressions or poses.
- Initial state target per approved character: neutral, greeting, listening, success, concern, and completion. Micro-motion can be added after the static set is consistent.
- Store each character as a self-contained asset package with its own metadata/manifest. Do not weave character art into gameplay while designs are incomplete.
- Ido is the first planned visual character, but work is paused. Do not generate or edit Ido until all reference pictures have been supplied and reviewed together.
- The single supplied Ido screenshot is reference material only; it is not an edit target and is not sufficient by itself to begin the final character package.
- After most or all five packages are approved, integrate the character picker, greeting, compact gameplay avatar, streak feedback, concern feedback, and completion state through one generic character interface.

## Next decisions

1. Review all Ido reference images together and write an identity/style brief.
2. Produce one Ido anchor concept for approval; do not produce the full state set first.
3. Lock the asset dimensions, crop, palette behavior, naming, and manifest format from the approved anchor.
4. Repeat the same approval sequence character by character.
5. Implement gameplay routing and visuals only after the asset contract is proven and most character packages exist.

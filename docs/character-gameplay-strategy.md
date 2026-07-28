# IvritElite character gameplay strategy

Status: live working document. Update this file as character content, visual design, and gameplay integration decisions change.

## Product model

Each day the learner chooses a Tel Aviv character. The choice changes the day's emphasis and voice without locking the learner out of the rest of the course.

- Standard character mix: 65% primary material, 20% shared or overlapping material, 15% adaptive review.
- Itamar mix: primarily the learner's weakest material across the entire course, with no protected comfort zone.
- Character assignment is a lens, not an exclusive taxonomy. A word or sentence may belong to multiple characters.
- Routing works on existing item fields, never on a `character` tag in the content files. Keep a word on its true topic shelf and reach it through `route.vocabWords`; never move it between vocabulary categories, because vocabulary ids embed a positional index and re-shelving orphans learner progress.
- A conjugation route may name a whole verb or a single sense. `route.verbIds` accepts either an entry id (`character-verb-lehaklit`, which matches every sense) or a full deck id (`character-verb-liklot--sense-2`, which matches one). Use the sense form when one paradigm carries meanings that belong to different characters. `npm run report:characters` counts the conjugation deck rather than the seed entries so per-sense routes are visible.
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

Incisive · cultured · defiant. A distinguished professor; her card framing is
"politics, history." Law was cut from the blurb for length — she still owns the
legal-studies pools below, and her `perfect` line still offers law school.

Owns literature, music, visual art, history, cultural memory, political language, activism, occupation, policing, social justice, and left-wing analysis.

As implemented she also owns the legal-studies pools (`legal_civic`,
`law_legal_systems_expanded`) and the academic/analytical `formal` sentence
register. That extends the boundary below: law-as-a-discipline — courts, rights,
evidence, precedent — is hers, while Ivri keeps regulatory and contractual law as
business process. Ivri retains the `professional` sentence register.

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

### Ido baseline and verb expansion

The existing colloquial tranche includes the newer LGBTQ+ and camp slang material and its related sentences. Preserve it as the current Ido content baseline.

- Vocabulary: the six routed `social_cultural`, `culture_identity_expanded`, `dating_relationships`, `relationships_dating_expanded`, `conversation_glue`, and `media_digital_life_expanded` categories.
- Sentences: the `colloquial` category plus the `whatsapp` style.
- Conjugation verbs: 20 route entries, split four ways. Baseline — `להרוס` and `ללרלר`. Authored for him — `לרקוד`, `לבלות`, `לחפור`, `לזרום`, `לפרגן`, `להתחרפן`, `להתמזמז`, `להתלבט`, `לגנוח`. Routed from the shared pool — `לצאת`, `להיפגש`, `להתקשר`, `לשלוח`, `להזמין`, `לצחוק`, `להתלבש`, `להתרגש`. One sense of a shared paradigm — `לקלוט--sense-1`.
- The routed eight are his by **register**, not by topic: going out, making plans, texting, laughing, getting dressed to leave the house. They stay unowned by anyone else and simply weigh more during his missions. `לשיר` was considered and rejected on exactly this test — singing is not streetwise, and it is now Inbal's for sung prayer.
- Five of the authored verbs are slang whose paradigms are template-derived rather than dictionary-attested; each discloses that in its `notes`.
- `לגנוח` is a dictionary pa'al of ג-נ-ח, not slang; only its register is his.

### Inbal expansion

- Vocabulary: 30 cards in `religion_magic_spirituality`, plus routed words that sit in other categories.
- Sentences: 70 entries, `inbal_01` through `inbal_70`. The `inbal_51`–`inbal_70` batch deliberately targets two gaps — colloquial register (she had 1 colloquial row against 27 everyday) and Hebrew length, since the handwriting mode only draws sentences of 6–34 Hebrew letters. All 20 sit in 23–33 letters, taking her handwriting-eligible share from 37/50 to 57/70.
- Conjugation verbs: 16 in total. Authored for her — `לברך`, `להתפלל`, `להאמין`, `לצום`, `לקדש`, `לטבול`, `לקלל`, `לנחש`, `להשביע`, `להתגייר`, with stored present, past, and future forms. Routed from the shared pool — `להיעלם`, `להיוולד`, `להיראות`, `להירדם`, `להתעורר`, `לשיר`: birth, disappearance, appearance, sleep, and liturgy are hers by subject rather than register.
- Coverage includes incantation bowls, Aramaic inscriptions, amulets, the evil eye, dream interpretation, dybbuks, prayer, mikveh, ex-religious identity, ritual practice, and careful distinctions between folklore and factual claims.

### Ivri expansion

- Vocabulary: the six routed `work_business`, `technology_ai`, `finance_investing`,
  `technology_ai_expanded`, `business_finance_expanded`, and
  `communication_mastery_expanded` categories — 176 cards.
- Sentences: the `professional` register.
- Conjugation verbs: 23 route entries. `לעבוד`, `לתכנן`, `לנתח`, `לקנות`, `למכור`,
  `להחליט`, `לעדכן`, `לאשר`, plus a process tranche from the shared pool —
  `לתקן`, `להשתמש`, `לבטל`, `לצרף`, `לברר`, `להסכים`, `להספיק`, `להבהיר`, `להזהיר`,
  `להחזיר`, `לשלם`, `לבדוק` — the verbs a form, a contract, or a deadline runs on.
  Authored for him and shared with Inat: `להגיש` and `להקליט`. One sense of a shared
  paradigm: `לקלוט--sense-2` (reception and input).
- Device and OS vocabulary is still a gap. His three technology categories are
  AI, startup, and discourse heavy; the only device-UI words in the lexicon
  (`הגדרות`, `לגלול`, `להחליק`, `להקיש`) sit in `media_digital_life_expanded`,
  which is Ido's. A dedicated device-settings category routed to Ivri is the
  clean shape when that lands.

### Inat expansion

- Vocabulary: 30 cards in `literature_arts_cultural_history`, plus the routed
  `politics_society_expanded`, `legal_civic`, and `law_legal_systems_expanded`
  categories — 232 cards in total.
- Sentences: 24 entries, `inat_01` through `inat_24`, plus the `formal` register.
- Conjugation verbs: 22 route entries. `לפרש` and `למחות`, with stored present, past,
  and future forms, plus `לדון`, `להוכיח`, `להשפיע`, `לשחרר`, `לספר`, `ללמד`, and a
  reading-and-memory tranche — `לכתוב`, `לקרוא`, `לזכור`, `לשכוח`, `להשתתף`, `לשנות`,
  `לשאול`, `לענות`, `להסביר`, `להבין` — from the shared pool. Shared with Ivri:
  `להגיש` and `להקליט`. Single senses of shared paradigms: `לקלוט--sense-3`
  (קליטת עלייה as policy and history) and `לבקר--sense-2` (to criticize; the visit
  sense stays unowned).
- Abbreviations: shares the `Civics, Law & Work` bucket with Ivri. The bucket mixes
  his corporate and regulatory acronyms with her parties, courts, and rights bodies,
  and the routing table has no finer grain than a bucket, so multi-owner routing is
  the correct answer rather than an arbitrary cut.
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

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

## Balance after the practical-life routing

Routing the orphaned shelves raised three characters and left the fourth where she was,
so the measured spread widened rather than closed:

| | before routing | after routing | after Inbal's tranche |
|---|---|---|---|
| Ido | 444 | 656 | 672 |
| Inbal | 284 | 284 | 349 |
| Ivri | 418 | 577 | 577 |
| Inat | 458 | 524 | 524 |
| spread | 1.6x | 2.3x | 1.9x |

Routing alone widened the spread, and that was expected rather than a regression. Nothing
was taken from Inbal, and none of the routed shelves are plausibly hers — she owns
religion, folk practice, and ritual, and the orphans were home, food, bureaucracy,
science, and philosophy. Evenness can only come from authoring her material, not from
redistributing someone else's.

**Parity is not the goal.** Do not author filler to make the numbers match, and do not
"fix" the spread by routing `health`, `pharmacy_personal_care`, or the emotional shelves
to Inbal. That scores well immediately and is the wrong answer: a learner drilling
prescriptions and blood tests under her lens makes no sense. A character should own as
much as its subject genuinely contains.

The long-term goal is **comprehensive coverage of each character's own domain**, measured
against what that domain actually holds rather than against the other characters. The
spread is a symptom worth watching, not a target to hit — 1.9x with four coherent,
well-covered characters beats 1.0x reached by padding.

## Implemented content ledger

### Ido baseline and verb expansion

The existing colloquial tranche includes the newer LGBTQ+ and camp slang material and its related sentences. Preserve it as the current Ido content baseline.

- Vocabulary: the six routed `social_cultural`, `culture_identity_expanded`, `dating_relationships`, `relationships_dating_expanded`, `conversation_glue`, and `media_digital_life_expanded` categories, plus the practical-life shelves added later — `home_everyday_life`, `groceries_food`, and `everyday_survival_expanded` — for 401 cards. This document always assigned him practical Tel Aviv life, but the route table did not carry it until then. `cooking_utensils` and `cooking_verbs` stay shared: they are technique rather than street life.
- Sentences: the `colloquial` category plus the `whatsapp` style. The `everyday` register is deliberately **not** his. Adding its 142 unrouted rows would put him at 56% of the whole sentence bank and blur the colloquial identity that distinguishes him.
- Conjugation verbs: 30 route entries. The domestic tranche — `לבשל`, `לנקות`, `להדליק`,
  `לכבות`, `לסדר`, `להתקלח`, `לגור`, `לטייל`, `לשבת`, `לקום` — arrived with the
  practical-life vocabulary: the verbs an apartment runs on. `לישון` was left unowned
  because Inbal already holds sleep through `להירדם` and `להתעורר`.
- The original 20, split four ways. Baseline — `להרוס` and `ללרלר`. Authored for him — `לרקוד`, `לבלות`, `לחפור`, `לזרום`, `לפרגן`, `להתחרפן`, `להתמזמז`, `להתלבט`, `לגנוח`. Routed from the shared pool — `לצאת`, `להיפגש`, `להתקשר`, `לשלוח`, `להזמין`, `לצחוק`, `להתלבש`, `להתרגש`. One sense of a shared paradigm — `לקלוט--sense-1`.
- The routed eight are his by **register**, not by topic: going out, making plans, texting, laughing, getting dressed to leave the house. They stay unowned by anyone else and simply weigh more during his missions. `לשיר` was considered and rejected on exactly this test — singing is not streetwise, and it is now Inbal's for sung prayer.
- Five of the authored verbs are slang whose paradigms are template-derived rather than dictionary-attested; each discloses that in its `notes`.
- `לגנוח` is a dictionary pa'al of ג-נ-ח, not slang; only its register is his.

### Inbal expansion

- Vocabulary: 138 cards in `religion_magic_spirituality`, plus routed words that sit
  in other categories. The last 30 cover vows and oaths, mourning and memorial, the
  liturgical rite, divination, and the folk-protection vocabulary her colloquial
  sentences use.
- Sentences: 95 entries, `inbal_01` through `inbal_95`. The `inbal_51`–`inbal_70` batch deliberately targets two gaps — colloquial register (she had 1 colloquial row against 27 everyday) and Hebrew length, since the handwriting mode only draws sentences of 6–34 Hebrew letters. All 20 sit in 23–33 letters, taking her handwriting-eligible share from 37/50 to 57/70.
  The `inbal_71`–`inbal_95` batch targets colloquial register again: she sat at 11
  colloquial rows against 33 everyday, so 16 of the 25 are colloquial and 8 are level 1,
  a tier she had none of. All 25 fall in 22–29 Hebrew letters, well inside the
  handwriting filter. Those 16 colloquial rows are deliberately multi-owner — Ido owns
  the `colloquial` category, and a sentence about the evil eye is his register and her
  subject at the same time.
- Conjugation verbs: 24 in total. Authored for her — `לברך`, `להתפלל`, `להאמין`, `לצום`, `לקדש`, `לטבול`, `לקלל`, `לנחש`, `להשביע`, `להתגייר`, with stored present, past, and future forms. Routed from the shared pool — `להיעלם`, `להיוולד`, `להיראות`, `להירדם`, `להתעורר`, `לשיר`: birth, disappearance, appearance, sleep, and liturgy are hers by subject rather than register.
- Coverage includes incantation bowls, Aramaic inscriptions, amulets, the evil eye, dream interpretation, dybbuks, prayer, mikveh, ex-religious identity, ritual practice, and careful distinctions between folklore and factual claims.

### Ivri expansion

- Vocabulary: the six routed `work_business`, `technology_ai`, `finance_investing`,
  `technology_ai_expanded`, `business_finance_expanded`, and
  `communication_mastery_expanded` categories, plus `bureaucracy`,
  `scientific_analytical`, and `science_research_expanded` — 336 cards. Bureaucracy is
  named in his blurb above and was simply never routed; the two science shelves follow
  the abbreviation split, which already gives him the `Ideas, Science & Tech` bucket.
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
  categories, plus the abstract/philosophical shelves her academic register reads from —
  `abstract_philosophy`, `philosophy_intellectual_expanded`,
  `high_level_discourse_expanded`, and `abstract_concepts_expanded` — plus `תחרותי` and
  `ספורים` reached individually through `vocabWords` — 300 cards in total. Both of those sit on someone else's shelf
  (`work_business` and the unrouted `core_advanced`) and were deliberately not
  re-shelved.
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

### Lexical-focus rows

A small shared tranche exists for words introduced in the vocabulary or
conjugation decks that also need context: `colloquial_152`–`156`,
`professional_85`–`88`, `formal_78`–`79`, `everyday_139`, and `inat_25`. It
covers `בלי חרטות`, `לקלוט` in both its colloquial and technical senses,
`להגיש`, `להקליט`, `תחרותי` in the masculine and feminine, and `ספורים`/`ספורות`.

Use plain `<bank>_<number>` ids for rows like these, not slugged ids. The
compact-token policy in `tests/sentence-bank-data.test.js` only matches
`^(colloquial|everyday|professional|formal)_\d+$` and `^(inbal|inat)_\d+$`, so a
slugged id such as `colloquial_charatot_01` silently opts out of the chip review.
The older `colloquial_vodge_01`-style rows predate that policy and are not
authoring precedent. Register any new tranche in the alignment test's id lists as
well, since those checks are opt-in per range.

Two adjective/quantifier pairs deliberately teach agreement across two rows,
because a vocabulary card can only ever show one form: `תחרותי` (professional_88)
against `תחרותיות` (formal_78), and `ספורים` (everyday_139) against `ספורות`
(formal_79).

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

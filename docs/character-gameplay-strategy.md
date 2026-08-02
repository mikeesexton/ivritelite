# IvritElite character gameplay strategy

Status: live working document. Update this file as character content, visual design, and gameplay integration decisions change.

## Product model

Each day the learner chooses a Tel Aviv character. The choice changes the day's emphasis and voice without locking the learner out of the rest of the course.

- Standard character mix: 65% primary material, 20% shared or overlapping material, 15% adaptive review.
- Idan mix: security, safety, and military material in two tiers, plus the learner's weak points. He weighs content like everyone else, so the 65% boost is uniform across his owned set and each mode's weak/missed/overdue ordering still decides what he drills inside it. He has no protected comfort zone because his shelf is small and hard, not because he is exempt from routing.
- Character assignment is a lens, not an exclusive taxonomy. A word or sentence may belong to multiple characters.
- Routing works on existing item fields, never on a `character` tag in the content files. Keep a word on its true topic shelf and reach it through `route.vocabWords`; never move it between vocabulary categories, because vocabulary ids embed a positional index and re-shelving orphans learner progress.
- A conjugation route may name a whole verb or a single sense. `route.verbIds` accepts either an entry id (`character-verb-lehaklit`, which matches every sense) or a full deck id (`character-verb-liklot--sense-2`, which matches one). Use the sense form when one paradigm carries meanings that belong to different characters. `npm run report:characters` counts the conjugation deck rather than the seed entries so per-sense routes are visible.
- Keep the initial cast at five. Ido's practical-life coverage closes the largest remaining gap without adding a sixth character.
- `civil_defense_safety` is the one vocabulary category routed to the **entire cast** by policy. Everyday security is something a resident needs regardless of whose day it is, so it is not a balance bug when it lifts every character's vocabulary count in `npm run report:characters`. The same rule covers six home-front acronyms (`CIVIL_DEFENSE_ABBR_IDS`).
- Abbreviations can also be routed by id. `route.abbrIds` grants one and `route.abbrExcludeIds` withholds one; an exclusion is checked first, so it beats a bucket grant. This exists because the four buckets are too coarse to lift the military register out of Ivri's and Inat's shelves.

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

Owns systems and institutions: business, startups, bureaucracy, law, formal logic, finance, and defense technology as an industry. Military and operational terminology moved to Idan; Ivri keeps the procurement, regulatory, and engineering framing of defense, not the uniformed register.

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

### Idan

Composed · disciplined · unsentimental

Owns security, safety, and the military, in two deliberately separate tiers:

- **Tier 1 — everyday security a civilian needs during wartime.** `civil_defense_safety` (70 cards): sirens, protected spaces, Home Front Command instructions, alerts, first aid, evacuation, fire safety, and general public safety. Six home-front acronyms belong here too. **This tier is routed to every character**, so a learner who never picks Idan still drills it.
- **Tier 2 — advanced military terminology.** `military_operational` (70 cards): ranks, units, service and reserve life, orders, operations, terrain, logistics, and reporting. Twenty-six military acronyms are his alone, withheld from Ivri and Inat by `abbrExcludeIds`.

He also carries 24 `idan_` sentences split across both tiers, and 28 shared-pool verbs routed by register — the verbs an instruction, a warning, or a report runs on.

Tier 2 is terminology, not tactics: ranks, procedures, and reporting language, never anything operationally instructional. The sprite standard already bars weapons from his art, and the same restraint governs the word lists.

- Greeting: “Short briefing, then we work. Words that save lives first, the rest afterwards.”
- Four correct: “Four on target. That's what readiness looks like.”
- Four wrong: “We stop guessing. A breath, focus, and back to procedure.”
- Complete: “Mission complete. Short debrief, and tomorrow we return to what's still open.”

## Ivri/Inat boundary

The split is coherent if it is based on perspective rather than topic.

- Ivri asks how an institution, system, technology, law, or security apparatus functions.
- Inat asks who holds power, whose experience is omitted, how culture remembers an event, and how policy affects people.
- Shared current-events items should carry both routes when both readings are useful. Examples include the Supreme Court, military service, policing, elections, budgets, protests, and the occupation.
- Security hardware, defense-tech procurement, and bureaucratic process lean Ivri. Human-rights framing, protest language, historical narrative, police brutality, and occupation vocabulary lean Inat. Formal military language is no longer Ivri's — it is Idan's, and the operational/home-front reading of an item is his even when the institutional reading is Ivri's.

## Abbreviation and acronym split

Abbreviations need explicit multi-owner routing; forcing every abbreviation into one character would produce arbitrary results.

- Ido: messaging shorthand, internet language, nightlife, youth, and colloquial abbreviations.
- Ivri: government bodies, defense technology as an industry, legal procedure, finance, business, and bureaucracy. The uniformed military acronyms in his two buckets are excluded and belong to Idan.
- Inbal: religious texts, religious institutions, ritual references, and traditional formulae.
- Inat: political parties and movements, rights organizations, activist groups, cultural institutions, media, and historical abbreviations.
- Idan: the military register exclusively (צה״ל, רמטכ״ל, אמ״ן, שב״כ, ranks, corps, and דו״צ), plus the six home-front acronyms he shares with the whole cast (פקע״ר, מד״א, ממ״ד, ממ״ק, ממ״מ, כב״א). Police command (המפכ״ל, מג״ב) is granted to him without an exclusion, because policing stays Inat's.
- Unclear or genuinely cross-cutting items should route to two or more characters.

## Balance after the practical-life routing

Routing the orphaned shelves raised three characters and left the fourth where she was,
so the measured spread widened rather than closed:

| | before routing | after routing | after Inbal's first tranche | current |
|---|---|---|---|---|
| Ido | 444 | 656 | 672 | 776 |
| Inbal | 284 | 284 | 349 | 544 |
| Ivri | 418 | 577 | 577 | 740 |
| Inat | 458 | 524 | 524 | 613 |
| Idan | — | — | — | 252 |
| spread | 1.6x | 2.3x | 1.9x | 3.1x |

The current column includes Idan, who is new and deliberately narrow, and the 70 cast-wide
`civil_defense_safety` cards that lift every character equally. Without Idan the spread is
1.4x. Routing alone widened the spread, and that was expected rather than a regression. Nothing
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

## Depth standard

"Fleshed out" is two gates, and a character has to pass both. Neither is a parity target: a
character may exceed a floor by 3x without that being a problem.

**Gate 1 — per-mode floors.** Measured on *own-domain* counts, so the 70 cast-wide
`civil_defense_safety` cards cannot flatter anyone. Subtract them from the vocabulary figure
`npm run report:characters` prints.

| pool | floor | Ido | Inbal | Ivri | Inat | Idan |
|---|---|---|---|---|---|---|
| vocabulary (own-domain) | **250** | 402 | 265 | 421 | 302 | **94** |
| sentences | **90** | 202 | 96 | 113 | 132 | **24** |
| abbreviations | **30** | 68 | 87 | 113 | 85 | 34 |
| verbs | **20** | 34 | 26 | 23 | 24 | 30 |

Idan currently fails vocabulary and sentences. He is the newest character and has no sentence
register of his own; Inbal solved the identical problem by authoring 95 prefix rows. His
vocabulary floor may warrant lowering rather than filling — his domain may not hold 156 more
cards without drifting from terminology into tactics, and that is a content judgement to make
with the words in hand.

**Gate 2 — domain checklist.** Gate 1 alone is not enough: it would have passed Ivri on 341
cards while every one of his technology cards was abstract AI register and none named an object
a person touches. Each character needs the clusters their subject actually contains, marked
covered or open.

- **Ido** — slang, nightlife, dating, texting, olim language, practical apartment life,
  groceries, social media and gesture register. No open clusters.
- **Inbal** — Kabbalah and mysticism ✓, folk magic and the supernatural ✓, ritual objects ✓,
  liturgy ✓, holidays and calendar ✓, prayer services ✓, kashrut ✓, lifecycle rites ✓,
  denominations and institutions ✓, synagogue interior ✓, religious roles ✓, ex-religious life ✓,
  other faiths ✓. *Open:* nothing structural. Her first shelf remains weighted toward the
  uncanny half of her brief; the second shelf carries the lived half.
- **Ivri** — work and management ✓, bureaucracy ✓, finance ✓, law-adjacent process ✓,
  scientific and research register ✓, AI and startup register ✓, consumer devices and OS ✓.
  *Open:* nothing structural. Defense stays with him as an industry, not as a uniformed
  register — that is Idan's.
- **Inat** — politics and society ✓, law and courts ✓, literature and arts ✓, cultural memory ✓,
  activism and protest ✓, academic and abstract register ✓, policing and occupation ✓.
  No open clusters.
- **Idan** — civil defense and home front ✓, public safety ✓, military structure and ranks ✓,
  service and reserve life ✓, operations and reporting ✓. *Open:* sentence coverage, and
  vocabulary depth pending the floor judgement above.

### Conjugation+, Prepositions, and Binyanim stay character-neutral

This supersedes the earlier note that those modes "can use multi-owner routing when the
character layer is implemented." The character layer now exists, and the answer is no:

- All 81 idioms in `hebrew-idioms.js` are colloquial interpersonal expressions — "to break
  someone's heart", "to get on someone's nerves", "to dump someone". Routing them would hand
  roughly 70 of 81 to Ido and turn Conjugation+ into his mode. That is the redistribute-to-score
  move this section already forbids.
- `preposition-data.js` and `verb-game-data.js` carry no topic field of any kind. Binyanim and
  prepositions are structural grammar; a root's seven binyanim are not a subject.

All five characters already have distinct intro dialogue for the three modes, so they stay
voiced without content routing. Revisit only if a non-colloquial idiom tranche is ever authored.

## Implemented content ledger

### Ido baseline and verb expansion

The existing colloquial tranche includes the newer LGBTQ+ and camp slang material and its related sentences. Preserve it as the current Ido content baseline.

- Vocabulary: the six routed `social_cultural`, `culture_identity_expanded`, `dating_relationships`, `relationships_dating_expanded`, `conversation_glue`, and `media_digital_life_expanded` categories, plus the practical-life shelves added later — `home_everyday_life`, `groceries_food`, and `everyday_survival_expanded` — for 402 cards. This document always assigned him practical Tel Aviv life, but the route table did not carry it until then. `cooking_utensils` and `cooking_verbs` stay shared: they are technique rather than street life.
- Sentences: the `colloquial` category plus the `whatsapp` style. The `everyday` register is deliberately **not** his. Adding its 148 unrouted rows would put him at 56% of the whole sentence bank and blur the colloquial identity that distinguishes him.
- Conjugation verbs: 30 route entries. The domestic tranche — `לבשל`, `לנקות`, `להדליק`,
  `לכבות`, `לסדר`, `להתקלח`, `לגור`, `לטייל`, `לשבת`, `לקום` — arrived with the
  practical-life vocabulary: the verbs an apartment runs on. `לישון` was left unowned
  because Inbal already holds sleep through `להירדם` and `להתעורר`.
- The original 20, split four ways. Baseline — `להרוס` and `ללרלר`. Authored for him — `לרקוד`, `לבלות`, `לחפור`, `לזרום`, `לפרגן`, `להתחרפן`, `להתמזמז`, `להתלבט`, `לגנוח`. Routed from the shared pool — `לצאת`, `להיפגש`, `להתקשר`, `לשלוח`, `להזמין`, `לצחוק`, `להתלבש`, `להתרגש`. One sense of a shared paradigm — `לקלוט--sense-1`.
- The routed eight are his by **register**, not by topic: going out, making plans, texting, laughing, getting dressed to leave the house. They stay unowned by anyone else and simply weigh more during his missions. `לשיר` was considered and rejected on exactly this test — singing is not streetwise, and it is now Inbal's for sung prayer.
- Five of the authored verbs are slang whose paradigms are template-derived rather than dictionary-attested; each discloses that in its `notes`.
- `לגנוח` is a dictionary pa'al of ג-נ-ח, not slang; only its register is his.

### Inbal expansion

- Vocabulary: 138 cards in `religion_magic_spirituality`, plus 111 in
  `religious_life_practice`, plus routed words that sit in other categories. The last 30
  of the first shelf cover vows and oaths, mourning and memorial, the liturgical rite,
  divination, and the folk-protection vocabulary her colloquial sentences use.
- The second shelf exists because the first one is lopsided, not thin. Roughly 53% of those
  138 cards are Lurianic and Hasidic mysticism plus folk magic — all ten sefirot, צמצום,
  קליפה, דיבוק, גולם, קערת השבעה — while the lived half of her brief had **five clusters at
  literal zero**: holidays by name, prayer services, synagogue interior, and other faiths, with
  kashrut and denominations at one card each. A learner drilling her deck met קליפה and צמצום
  before פסח or רב. Her own sentences had already outrun the cards: פורים and חתונה each appear
  about ten times in the sentence bank with no vocabulary card behind them.
- `religious_life_practice` covers holidays and the calendar, prayer services, kashrut,
  lifecycle rites, denominations and institutions, the synagogue interior, religious roles,
  the modern ex-religious terms she was missing (יוצא/יוצאת בשאלה), and other faiths — כנסייה,
  מסגד, נוצרי, מוסלמי, דרוזי, רמדאן. Her blurb says she owns *religion*, not only Judaism, and
  in Israel those are everyday words. It is a second category rather than an append because
  `religion_magic_spirituality` is pinned at 138 cards by a test, and because the practice and
  mysticism halves are worth weighting separately.
- Sentences: 96 entries, `inbal_01` through `inbal_96`. The `inbal_51`–`inbal_70` batch deliberately targets two gaps — colloquial register (she had 1 colloquial row against 27 everyday) and Hebrew length, since the handwriting mode only draws sentences of 6–34 Hebrew letters. All 20 sit in 23–33 letters, taking her handwriting-eligible share from 37/50 to 57/70.
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
  `scientific_analytical`, and `science_research_expanded` — 341 cards. Bureaucracy is
  named in his blurb above and was simply never routed; the two science shelves follow
  the abbreviation split, which already gives him the `Ideas, Science & Tech` bucket.
- Sentences: the `professional` register.
- Conjugation verbs: 23 route entries. `לעבוד`, `לתכנן`, `לנתח`, `לקנות`, `למכור`,
  `להחליט`, `לעדכן`, `לאשר`, plus a process tranche from the shared pool —
  `לתקן`, `להשתמש`, `לבטל`, `לצרף`, `לברר`, `להסכים`, `להספיק`, `להבהיר`, `להזהיר`,
  `להחזיר`, `לשלם`, `לבדוק` — the verbs a form, a contract, or a deadline runs on.
  Authored for him and shared with Inat: `להגיש` and `להקליט`. One sense of a shared
  paradigm: `לקלוט--sense-2` (reception and input).
- Device and OS vocabulary was a gap and is now `devices_os_apps`, 75 cards routed to him.
  His three technology shelves were 100% abstract AI, startup, infosec, and VC register — not
  one card named a physical object a person touches — while the sentence bank was already using
  האפליקציה, הסיסמה, הסוללה, המטען, קובץ מצורף, and המסך.
- The new shelf covers hardware, files and file actions, accounts and access, connectivity and
  OS settings, mail, and failure states. The split against Ido is that **Ido uses the phone and
  Ivri administers the machine**: Ido keeps the social, consumption, and gesture layer in
  `media_digital_life_expanded` — memes, influencers, לגלול, להחליק, להקיש. Five genuinely dual
  words — `הגדרות`, `עדכון`, `באג`, `סוללה`, `אחסון` — stay on Ido's shelves and are reached for
  Ivri through `route.vocabWords`, never re-shelved.
- Authoring it required dodging four homographs that already exist in another sense: `תיק` is a
  paper case-file rather than a digital קובץ, `עותק` is a photocopy rather than a clipboard copy,
  `רשות` is abstract permission rather than הרשאות, and `מתאם` is a statistical correlation.
  `סוללה` and `אחסון` were already Ido's, so the shelf uses `מטען` and `אחסון בענן`.

### Inat expansion

- Vocabulary: 30 cards in `literature_arts_cultural_history`, plus the routed
  `politics_society_expanded`, `legal_civic`, and `law_legal_systems_expanded`
  categories, plus the abstract/philosophical shelves her academic register reads from —
  `abstract_philosophy`, `philosophy_intellectual_expanded`,
  `high_level_discourse_expanded`, and `abstract_concepts_expanded` — plus `תחרותי` and
  `ספורים` reached individually through `vocabWords` — 302 cards in total. Both of those sit on someone else's shelf
  (`work_business` and the unrouted `core_advanced`) and were deliberately not
  re-shelved.
- Sentences: 25 entries, `inat_01` through `inat_25`, plus the `formal` register.
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

Binyanim, Prepositions, and Conjugation+ stay character-neutral by decision — see the Depth standard section above for the evidence.

## Visual production

All five characters are built and integrated, so this section is now a record rather than a plan.

- Each character has the six production reactions in `assets/<id>/` — `neutral`,
  `nervous-laugh`, `celebrating`, `struggling`, `mission-complete`, `frustrated` — as
  transparent 512x512 RGBA PNGs under 256 KiB.
- The binding contract is `assets/SPRITE_STANDARD.md`: coarse pixel art normalized through a
  128-pixel logical canvas and a 96-color palette, then enlarged with nearest-neighbor sampling.
  Read it before touching any character art.
- High-resolution masters live in each character's git-ignored `source/` directory and are never
  referenced by HTML or CSS, so retaining them costs nothing at load time.
- Runtime wiring is one generic interface: `styles.css` holds six
  `.character-sprite[data-character][data-reaction]` rules per character, and `app/character.js`
  sets those attributes. Adding a character needs no new rendering code.
- Idan's `nervous-laugh` slot is the one documented semantic exception: the filename is retained
  for the shared runtime contract, but the art is deliberately stern rather than embarrassed.
- Still unimplemented: per-character accent colors. `docs/product-roadmap.md` item A3 specifies
  a `--char-accent` layer keyed on `data-character`, with Ido magenta, Inbal violet, Ivri
  steel-cyan, Inat deep crimson, and Idan slate-grey.

## Next decisions

1. Author Idan's sentence tranche — he fails the sentence floor at 24 rows, and he is the only
   character with neither a register of his own nor a large prefix tranche. Target ~90, following
   the `inbal_` precedent, and keep rows inside the 6-34 Hebrew-letter handwriting window.
2. Decide Idan's vocabulary floor: author toward 250 own-domain cards, or document a lower floor
   for a deliberately narrow domain. Judge with candidate words in hand.
3. Consider a verb pass. Verbs are the thinnest pool app-wide — 48.2% of the 247-item conjugation
   deck is unrouted and no character exceeds 34. Every character clears the floor of 20, so this
   is not urgent, but it is the largest structural deficit left.
4. Leave the health cluster shared. `health`, `pharmacy_personal_care`, and `health_body_expanded`
   are 135 unowned cards and the largest coherent unowned domain, but the balance policy above
   forbids routing them to Inbal, the cast is capped at five, and no other character plausibly
   owns them. Recorded here so it is not rediscovered as a bug.

# IvritElite character gameplay strategy

Status: live working document. Update this file as character content, visual design, and gameplay integration decisions change.

## Product model

Each day the learner chooses a Tel Aviv character. The choice changes the day's emphasis and voice without locking the learner out of the rest of the course.

- Standard character mix: 65% primary material, 20% shared or overlapping material, 15% adaptive review. The shared tier draws from the un-fenced pool — see "Content withholding" below.
- Idan mix: security, safety, and military material in two tiers, plus the learner's weak points. He weighs content like everyone else, so the 65% boost is uniform across his owned set and each mode's weak/missed/overdue ordering still decides what he drills inside it. He has no protected comfort zone because his shelf is small and hard, not because he is exempt from routing.
- Character assignment is a lens, not an exclusive taxonomy. A word or sentence may belong to multiple characters.
- Routing works on existing item fields, never on a `character` tag in the content files. Keep a word on its true topic shelf and reach it through `route.vocabWords`; never move it between vocabulary categories, because vocabulary ids embed a positional index and re-shelving orphans learner progress.
- A conjugation route may name a whole verb or a single sense. `route.verbIds` accepts either an entry id (`character-verb-lehaklit`, which matches every sense) or a full deck id (`character-verb-liklot--sense-2`, which matches one). Use the sense form when one paradigm carries meanings that belong to different characters. `npm run report:characters` counts the conjugation deck rather than the seed entries so per-sense routes are visible.
- Keep the initial cast at five. Ido's practical-life coverage closes the largest remaining gap without adding a sixth character.
- `civil_defense_safety` is the one vocabulary category routed to the **entire cast** by policy. Everyday security is something a resident needs regardless of whose day it is, so it is not a balance bug when it lifts every character's vocabulary count in `npm run report:characters`. The same rule covers six home-front acronyms (`CIVIL_DEFENSE_ABBR_IDS`).
- Abbreviations can also be routed by id. `route.abbrIds` grants one and `route.abbrExcludeIds` withholds one; an exclusion is checked first, so it beats a bucket grant. This exists because the four buckets are too coarse to lift the military register out of Ivri's and Inat's shelves.
- **Routing has two layers: a boost and a fence.** Ownership decides weight, as above. A second, narrower rule decides *audience*: content strongly coded to one character is withheld from the rest as new material, so it stops arriving as neutral filler in someone else's mission. See "Content withholding".

## Content withholding

Before this layer existed, routing was additive only. All 90 `idan_` sentences carry
`category: "everyday"`, so they were *unowned* by the other four characters rather than
*withheld* from them: sirens, shrapnel, a call-up order and pressing on a wound all
surfaced during Ido's and Inbal's missions. A political tranche authored into other
characters' register banks leaked the same way, and Ido and Inbal drew צה״ל because
`abbrExcludeIds` had only ever been applied to the two bucket holders.

`characterData.getItemAudience(kind, item)` answers who may be shown an item the learner
has not met yet. `null` means everyone, which is the ordinary case. Precedence, mirroring
the convention that an explicit list is checked before a derived one:

1. `SHARED_ITEM_IDS[kind]` un-fences a named row outright.
2. An explicit `route.<kind>Reserve*` field is decisive — it beats a co-owner's grant,
   which is the only way to fence a strongly coded row that sits on someone else's shelf.
   The fields are `sentenceReserveIds`, `vocabReserveCategories`, `vocabReserveWords`,
   `abbrReserveIds` and `verbReserveIds`. Reserving also **grants**: a reserved row nobody
   owns would be fenced from everybody.
3. Otherwise a character-specific signal — today only `sentenceIdPrefixes` — fences to
   *every* character that owns the row by any signal. The union rather than the prefix
   holder alone is what preserves the deliberate multi-owner cases: Inbal's colloquial rows
   stay available to Ido with no hand-authored exception.

What deliberately does **not** fence: `sentenceCategories`, `sentenceStyles`,
`vocabCategories`, `vocabWords`, `abbrBuckets` and `verbIds`. Those carry register, topic
and grammar, which every character needs. Two measurements decided this. A blanket rule
over the four sentence registers would leave each character with only its own bank plus the
148 unrouted `everyday_` rows. A blanket rule over vocabulary categories would fence 1511
of 2108 cards — 72% — because nearly every topic shelf has exactly one owner, so Idan would
never meet `groceries_food` or `dating_relationships`. The named reserve lists fence 341
cards, 16%, which is precisely the sensitive material.

Two policies follow from this rather than needing carve-outs:

- **`civil_defense_safety` is not reserved.** A single card carries no scenario — `אזעקה` as
  a word is something any resident needs — and the everyday security tier is course policy.
  Fencing happens at sentence level, where the register and the scenario actually land.
- **Review ignores reservation.** Withholding applies to new material only, defined as a
  progress record with `attempts > 0` (`data.hasWordProgress`,
  `sentenceBank.hasSentenceProgress`). Once a learner has met an item it stays eligible under
  any character and its Leitner interval is preserved. The in-session second-chance queue in
  `buildSentenceBankReviewQuestion` is unfiltered for the same reason.

`abbrExcludeIds` is **not** subsumed by this layer and must stay. It is the *input* to rule 3:
`MILITARY_ABBR_IDS` is fenceable only because the exclusions reduce it to a single owner.
Delete the exclusions and the military register becomes three-owner and shared again.
`POLICE_COMMAND_ABBR_IDS` is deliberately not reserved — the doc splits policing by
perspective, and המפכ״ל and מג״ב are civic institutions rather than the uniformed register.

Implementation notes for whoever extends this:

- The fence is a **hard pool filter**, never a weight of zero. `app/utils.js` treats a
  zero-weight list as unweighted: `weightedRandomWord` falls back to a uniform pick over
  everything when the total weight is zero, and `pickWeightedSubset` re-draws until it has
  its count. It is applied **before** each mode's due/fresh split, because an unmet item
  counts as due.
- `filterWithheldContent` never returns an empty array — a mode with nothing to draw is a
  worse failure than one leaked row.
- Reservation data cannot live on the content row. `prepareSentenceBankDeck` whitelists the
  fields it copies, so a new field on a sentence would be silently dropped before the picker
  ever saw it — and a `character` tag in a content file is forbidden regardless.
- A new prefixed row is fenced automatically. A strongly coded row authored into a shared
  register bank needs a reserve entry or it leaks. A mild row inside a fenced tranche is
  opted back out through `SHARED_ITEM_IDS`.
- Adding a sixth character instantly un-fences anything they co-own. That is the intended
  lever, not a bug.
- `npm run report:characters` prints a `reserved` footer row and a second
  "Draw pool after withholding" table. The depth-standard floors below are still measured on
  **ownership**, which the fence does not change; the second table is the instrument for
  watching a character being starved. One consequence to read carefully: Ivri still *owns*
  the eleven `professional_` political rows by register while Inat reserves them, so his
  ownership column reads eleven higher than what he can actually draw — 138 owned against
  127 drawable.

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

He also carries 115 `idan_` sentences across both tiers, and 28 shared-pool verbs routed by register — the verbs an instruction, a warning, or a report runs on.

His material is the main thing the withholding layer fences. All 115 sentences are reserved
by prefix except the 43 in `CAST_WIDE_SENTENCE_IDS`: the ordinary civilian-safety register
any resident narrates, with nothing alarming in it — where the fire extinguisher is, the
shelter being in the yard rather than the building, the crosswalk, the lifeguard, the
municipal water outage, the bag check at the mall, checking the safe room monthly. Anything
naming an azaka, an injury, a burn, smoke, an interception or army service stays his alone.

`idan_91`–`110` were authored specifically to carry that cast-wide half, because the shelf
had sentence support from 21 rows for 70 cards and **49 of the 70 had none at all**. Each of
the twenty is anchored on a card that had none — הוראות בטיחות, מפגע בטיחותי, חדר מדרגות,
מרתף, קו חירום, הודעה לציבור, רדיו נייד, גלאי עשן, כיבוי אש, חסימת כביש, בדיקת זהות, מגלה
מתכות, מלאי חירום, חדר מוגן, מרחק בטוח, מוכנות לחירום, הגנה אזרחית, קו תמיכה, מיגונית,
תרגיל התגוננות. Six are questions and two are conditionals: the first 90 rows contained not
one question mark, so a learner never practised the most useful safety utterance a resident
makes. `idan_111`–`115` stay his, on the alarming tier and still terminology rather than
tactics — זמן התרעה, הפוגה, כוחות ההצלה, פרמדיק, מפונה.

The dividing line is lexical, not grammatical, and that is what makes the register
teachable: `idan_28` ("during a siren we do not use the elevator") has the same impersonal
grammar as the shared `idan_40` and is fenced on the single word אזעקה. Shared rows describe
infrastructure **statically** — where a thing is, not what happened at it — so the noun is
allowed and the scenario is not. `idan_26` and `idan_58` were later un-fenced on that test:
helping a neighbour downstairs and the shelter key being with the building committee carry
no alarming word at all.
`military_operational` and `emergency_response` are reserved; `civil_defense_safety` is not.
The hard-security and trauma subset of his `vocabWords` is reserved — פיגוע, כיבוש, שירות
מילואים, חובש, שבר — while אבטחה, בטיחות, אזהרה, הנחיות, נוהל, עזרה ראשונה and אמבולנס stay
shared as ordinary vocabulary. Three verbs are reserved, the violent paradigms only:
`להרוג`, `לחסל`, `לפוצץ`. The rest of his verb route is shared-pool register no character
should be denied.

- **A third shelf — `emergency_response` (67 cards):** professional first-responder and police register. Pre-hospital and trauma care (החייאה, מיון נפגעים, דימום, כווייה), fire and rescue (כבאי, מכבי אש, חילוץ מגובה, טיהור), and police procedure (מעצר, חקירה, צו חיפוש, זירת פשע, ניידת). This is the working register of the people doing the job, distinct from the civilian tier 1 above. He also reaches the trauma cards on the unrouted `health` shelf — חובש, חדר מיון, תחבושת, שבר, נקע — through `route.vocabWords` rather than re-shelving them.

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
- **Policing splits the same way.** Inat keeps the critical reading — brutality, oversight, administrative detention, the occupation — and Idan owns the procedure a member of the public actually meets: מעצר, חקירה, צו חיפוש, זירת פשע, ניידת, אזיקים, שחרור בערבות. Her policing cards were never procedural, so nothing moved from her shelf; his `emergency_response` category is new material. This is the same perspective split the two bullets above already use, and the dual-routing rule sanctions it.

## Abbreviation and acronym split

Abbreviations need explicit multi-owner routing; forcing every abbreviation into one character would produce arbitrary results.

- Ido: messaging shorthand, internet language, nightlife, youth, and colloquial abbreviations.
- Ivri: government bodies, defense technology as an industry, legal procedure, finance, business, and bureaucracy. The uniformed military acronyms in his two buckets are excluded and belong to Idan.
- Inbal: religious texts, religious institutions, ritual references, and traditional formulae.
- Inat: political parties and movements, rights organizations, activist groups, cultural institutions, media, and historical abbreviations.
- Idan: the military register exclusively (צה״ל, רמטכ״ל, אמ״ן, שב״כ, ranks, corps, and דו״צ), plus the six home-front acronyms he shares with the whole cast (פקע״ר, מד״א, ממ״ד, ממ״ק, ממ״מ, כב״א). Police command (המפכ״ל, מג״ב) is granted to him without an exclusion, because the two readings of policing are split rather than assigned — see below.
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
| Idan | — | — | — | 413 |
| spread | 1.6x | 2.3x | 1.9x | 1.9x |

The current column includes the 70 cast-wide `civil_defense_safety` cards that lift every
character equally. Idan closed most of the gap by authoring his own material rather than by
redistribution, which is what the policy below asks for. Routing alone widened the spread, and that was expected rather than a regression. Nothing
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

**Gate 1 — per-mode floors**, measured on the **routed** pool — the set the picker actually
draws from, exactly as `npm run report:characters` prints it.

| pool | floor | Ido | Inbal | Ivri | Inat | Idan |
|---|---|---|---|---|---|---|
| vocabulary | **250** | 472 | 335 | 491 | 372 | 259 |
| sentences | **90** | 235 | 107 | 188 | 187 | 126 |
| abbreviations | **30** | 68 | 87 | 113 | 85 | 34 |
| verbs | **20** | 34 | 26 | 23 | 24 | 30 |

All five characters now clear all four floors.

Read the sentence row against the fence, not only against the floor. Ivri owns 188 and can
draw 177 of those owned rows, because Inat reserves eleven `professional_` rows that are still
his by register. Idan owns 126 and can draw all of them; 49 of those are also cast-wide, so the other four
reach them too. The second table in `npm run report:characters` is the authority on what a
character may actually be served.

The vocabulary floor is derived, not chosen. A vocabulary session serves
`WORD_MATCH_SESSION_SIZE = 20` words and the owned share is `TARGET_OWNED_SHARE = 0.65`, so
about 13 of them come from the character's own pool. 250 cards is therefore roughly 19 sessions
before the pool starts cycling — about three weeks of daily play. Measured today: Ido 36
sessions, Ivri 38, Inat 29, Inbal 26, Idan 20.

An earlier version of this section set the floor at 250 *own-domain* cards, meaning the routed
total minus the 70 cast-wide `civil_defense_safety` cards. That was a fitted number — it was
chosen so Inbal passed after her tranche — and the subtraction made it partly unreachable:
growing the shared tier cannot raise anyone's own-domain figure, and Idan would have needed ~156
more cards when his honest headroom was ~130 before drifting from terminology into tactics.
Repetition is what a learner feels, and repetition is a function of the routed pool, so that is
what the floor measures.

Own-domain is still worth reporting, because it is the fair way to compare *identity* rather
than pool size: Ido 402, Ivri 421, Inat 302, Inbal 265, Idan 189. Gate 2 is what actually proves
a domain is covered.

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
  service and reserve life ✓, operations and reporting ✓, adjutancy and base life ✓,
  pre-hospital and trauma care ✓, fire and rescue ✓, police procedure ✓. No open clusters. He
  owns three shelves: `civil_defense_safety` (cast-wide), `military_operational`, and
  `emergency_response`.

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
- Sentences: the `colloquial` category plus the `whatsapp` style — 235 owned in total after
  the shared relationship expansion. The `everyday` register is deliberately **not** his.
  Adding it would blur the colloquial identity that distinguishes him.
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
- Sentences: the `professional` register — 188 rows, of which he can draw 177. `professional_98`–`122`
  were authored against the clusters his bank had at or near zero, after an audit found 47 of
  his 97 rows were internal meeting-and-email choreography: contracts as objects (5 rows —
  **zero** rows had contained `חוזה`, `הסכם` or `סעיף`), regulation and compliance (4),
  formal logic (4 — the register his own `fourWrong` line lives in), bureaucracy beyond the
  tender (4), defence as an industry (3 — **zero** before, and the doc reserves that framing
  for him), employment terms (2), capital structure (2), and the meeting record (1 — no row
  had contained `פרוטוקול`). The tranche is deliberately short, 16–25 Hebrew letters against
  a bank median of 34, and deliberately weighted 8/10/7 by difficulty because he had two
  level-1 rows in 97. Handwriting eligibility went 53/97 to 78/122.
  `professional_123`–`152` later extended his technology register, and
  `professional_153`–`172` complete the AI and machine-learning shelves described below.
- The defence rows stay procurement and engineering framing — a technical spec, an approved
  supplier, an export licence, a milestone. They must never reach for the fenced military
  vocabulary: that boundary is the whole point of the Ivri/Inat/Idan split. The compliance
  rows stay commercial for the same reason — "the auditor checked the report" is his, while
  "the monitoring team verified reports of settler violence" is Inat's and is reserved.
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
- Sentences: 30 entries, `inat_01` through `inat_30`, plus the `formal` register, plus the
  46-row political tranche named in `route.sentenceReserveIds` — 187 owned in total. That
  tranche (`SENTENCE_EXPANSION_POLITICS` and its neighbours) was authored into the
  `colloquial`, `everyday`, `professional` and `formal` banks before the withholding layer
  existed, which put occupation terminology, settler violence, an assassination row and a
  named living politician into Ido's and Ivri's draws. Reserving the rows makes them hers and
  fences them at once. The `formal_` members are already hers by register and are listed so
  the fence is stated rather than inferred.
- The list started at 34 ids and missed twelve charged rows, which kept circulating cast-wide
  for one release: `professional_76`, `78`, `79`, `colloquial_141`, `143`, `149`, `150`,
  `everyday_125`, `135`, `136`, `formal_76` and `77`. The lesson is that a tranche has to be
  triaged row by row rather than by contiguous id range — the first pass took
  `professional_74`–`84` as a block and silently skipped three of its members.
- Six rows from the same tranche stay shared **on purpose** and should not be swept in later:
  `colloquial_145`, `146`, `everyday_132`, `133`, `134` and `professional_73`. Those are
  LGBTQ+ community life, cost-of-living gripes, civic literacy, and a municipal housing plan —
  everyday register, and the housing plan is good Ivri bureaucracy material.
- Her literature, law and philosophy shelves are **not** reserved: they are distinctive
  rather than sensitive. Only `politics_society_expanded` is. The same policy keeps the
  non-partisan `formal_88`–`107` tranche cast-wide even though its formal register makes
  Inat its owner.
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
`^(colloquial|everyday|professional|formal)_\d+$` and `^(inbal|inat|idan)_\d+$`, so a
slugged id such as `colloquial_charatot_01` silently opts out of the chip review.
The older `colloquial_vodge_01`-style rows predate that policy and are not
authoring precedent. Register any new tranche in the alignment test's id lists as
well, since those checks are opt-in per range.

Two adjective/quantifier pairs deliberately teach agreement across two rows,
because a vocabulary card can only ever show one form: `תחרותי` (professional_88)
against `תחרותיות` (formal_78), and `ספורים` (everyday_139) against `ספורות`
(formal_79).

### Shared kitchen-action expansion

`everyday_218`–`241` address the largest measured context gap rather than adding
another topic shelf. Before the tranche, `cooking_verbs` had exact sentence support
for 3 of 72 cards (4.2%) and `cooking_utensils` for 12 of 75 (16.0%). The twenty-four
rows cover high-utility preparation, mixing, baking, measuring, seasoning, and heat
methods and pair them with existing tools and ingredients. All are unowned,
unreserved, and 6–34 Hebrew letters long, so they remain shared across the cast and
eligible for Handwriting.

Afterward, conservative exact support is 28/72 cooking verbs (38.9%), 29/75 utensils
(38.7%), and 32/79 groceries (40.5%); the extra verb beyond the twenty-four planned
anchors is the existing `לגרד קליפה` zest card supported by the grating row. The
ambiguous `לחלוט` cards for poaching and blanching remain deliberately untouched until
each sense can receive its own reviewed context. The sentence pool is 929, with 231
unrouted rows. Drawable sentence pools are Ido 691, Inbal 770, Ivri 679, Inat 759, and
Idan 746; character-owned and reserved counts do not change.

### Shared home-care expansion

`everyday_242`–`265` follow the same coverage-led policy for the largest remaining
practical gap. Before the tranche, `home_everyday_life` had exact sentence support
for 15 of 106 cards (14.2%). The twenty-four rows cover furniture and storage,
rooms and entry spaces, locks and window hardware, basic tool recognition, water
damage, drains, cleaning, and laundry. Electrical rows teach recognition and
checking vocabulary without presenting repair instructions; their notes direct
live-panel work to a qualified technician.

All rows are unowned and unreserved, use the reviewed append-only builder, and
stay within the 6–34 Hebrew-letter Handwriting window. Three locative sentences
include their neutral Hebrew reorderings. The tranche directly contextualizes 61
home cards and produces a net shelf gain of 59: exact support rises to 74/106
(69.8%). App-wide conservative exact support rises from 757 to 819 cards, while
unsupported cards fall from 1,435 to 1,373. The sentence pool is 953, with 255
unrouted rows. Drawable sentence pools are Ido 715, Inbal 794, Ivri 703, Inat 783,
and Idan 770; character-owned and reserved counts remain unchanged.

### Non-partisan Inat formal expansion

`formal_88`–`107` add twenty academic-register rows without extending Inat's
political fence. They cover literary interpretation, metaphor and allusion,
cultural memory and diaspora identity, ethics and conscience, consciousness,
deductive logic, normative claims, and existential questions. All use the
reviewed append-only builder, stay within the 6–34 Hebrew-letter Handwriting
window, and use a 4/10/6 level 1/2/3 mix. Their neutral Hebrew orders were
reviewed as fixed; plausible permutations would change focus rather than supply
equivalent neutral orders.

The tranche raises conservative exact support from 819 to 859 cards and lowers
unsupported cards from 1,373 to 1,333. The four target shelves move from 1/14 to
12/14 (`philosophy_intellectual_expanded`), 3/18 to 10/18
(`culture_identity_expanded`), 17/35 to 28/35
(`literature_arts_cultural_history`), and 4/20 to 13/20
(`abstract_philosophy`). The sentence pool is 973, with 255 unrouted and 266
reserved rows. Inat's owned count rises from 167 to 187, while leaving the rows
unreserved lifts every drawable pool by twenty: Ido 735, Inbal 814, Ivri 723,
Inat 803, and Idan 790.

### Shared dating and relationship expansion

`colloquial_176`–`195` address the two weakest remaining vocabulary shelves:
`dating_relationships` began at 2/24 exact-supported cards (8.3%), and
`relationships_dating_expanded` at 2/15 (13.3%). The twenty rows cover chemistry,
commitment and exclusivity, long-distance relationships, boundaries and emotional
openness, situationships, changing interest, breakups and reconciliation, shared
values, co-parenting, and extended family. The language stays inclusive and
non-prescriptive: no partner gender is assumed, emotional difficulty is not treated
as pathology, and red-flag language is framed as a possibility rather than an
automatic diagnosis.

All rows use the reviewed append-only builder, fit the 6–34 Hebrew-letter
Handwriting window, and use a 6/10/4 level 1/2/3 mix. Four rows include neutral
Hebrew reorderings for fronted conditions, relationship context, post-breakup time,
and reconciliation time. The post-breakup row also accepts the full masculine/feminine
experiencer-and-partner combinations in both time positions. Exact support reaches
24/24 and 15/15 on the two target
shelves. App-wide support rises from 859 to 897 cards; the 35 intended relationship
cards also yield three conservative incidental matches. The sentence pool is 993,
with 255 unrouted and 266 reserved rows. Ido's colloquial-register ownership rises
from 215 to 235, while leaving the rows unreserved raises every drawable pool by
twenty: Ido 755, Inbal 834, Ivri 743, Inat 823, and Idan 810.

### Ivri AI and machine-learning expansion

`professional_153`–`172` add twenty professional-register rows for the unsupported
cards in `technology_ai` and `technology_ai_expanded`. They teach AI terminology through
compact relationships between concepts: algorithms and training data, neural networks and
layers, inference and reasoning, deployment and scalability, open-source licensing,
autonomous systems and agents, model collapse, prompts and context windows, benchmark-based
fine-tuning, guardrails and open weights, learning paradigms, hallucination, vector storage,
cybersecurity, robotics, product roadmaps, software releases, venture capital, and runway.

All rows use the reviewed append-only builder, fit the 6–34 Hebrew-letter Handwriting
window at 17–32 letters, and use a 4/10/6 level 1/2/3 mix. Eighteen orders are fixed;
`professional_161` and `professional_166` also accept the reviewed benchmark-fronting
orders. Exact support reaches 21/21 and 18/18 on the two target shelves. App-wide support
rises from 897 to 934 cards, while unsupported cards fall from 1,295 to 1,258. The 34
intended AI cards produce three new conservative incidental matches: `מפת דרכים`, `הון`,
and `מסלול`.

The sentence pool is 1,013, with 255 unrouted and 266 reserved rows. Ivri's
professional-register ownership rises from 168 to 188. Because the rows remain unreserved,
every companion can draw them: total drawable pools rise to Ido 775, Inbal 854, Ivri 763,
Inat 843, and Idan 830.

### Shared Hebrew grammar and meta-language expansion

`everyday_266`–`279` complete the two language-learning shelves without assigning
them to a character. The fourteen rows cover literal and figurative meaning,
participles, infinitives and imperatives, grammatical gender and singular forms,
construct state and possessive suffixes, the direct-object marker, linguistic
terminology, word formation, verbal and nominal patterns, weak roots, register,
syntax, pragmatics, and Aramaic influence.

All rows use the reviewed append-only builder, fit the 6–34 Hebrew-letter
Handwriting window at 17–34 letters, and use a 4/7/3 level 1/2/3 mix. Eight rows
have fixed order. Six accept reviewed coordination or context-placement variants;
the coordination variants also preserve the correct וְ/וּ pointing after terms
are reordered.

Exact support reaches 19/19 for `meta_language` and 16/16 for
`advanced_grammar_meta_expanded`. App-wide support rises from 934 to 959 cards,
while unsupported cards fall from 1,258 to 1,233. The 24 intended grammar cards
also produce one conservative incidental match, `השפעה`, through the Aramaic-
influence row.

The sentence pool is 1,027, with 269 unrouted and 266 reserved rows. The tranche
is unowned and unreserved, so character-owned counts do not change and every
drawable pool rises by fourteen: Ido 789, Inbal 868, Ivri 777, Inat 857, and
Idan 844.

### Inat legal and civic expansion

`formal_108`–`125` complete the two legal-study shelves through concise examples
of constitutional law, jurisdiction and due process, liability and negligence,
precedent, subpoenas and injunctions, legislation, civil claims and damages,
criminal outcomes, prosecution, plea bargains, evidence, immigration status,
property deeds, corporate bylaws, compliance, and contract liability. The rows
teach terminology and relationships rather than case-specific legal advice.

All eighteen rows use the reviewed append-only builder, fit the Handwriting
window at 20–29 Hebrew letters, and use a 4/9/5 level 1/2/3 mix. Sixteen orders
are fixed; `formal_120` accepts the case context in final position and
`formal_121` accepts its cross-examination context first or last. Exact
support reaches 18/18 for `legal_civic` and 16/16 for
`law_legal_systems_expanded`. App-wide exact support rises from 959 to 994 cards,
while unsupported cards fall from 1,233 to 1,198. The 29 intended legal cards
also produce six conservative incidental matches: evidence, prevention,
compliance, summons, immigration, and interrogation.

The sentence pool is 1,045, with 269 unrouted and 266 reserved rows. Inat's
formal-register ownership rises from 187 to 205. The rows remain unreserved and
drawable by every companion, lifting drawable pools to Ido 807, Inbal 886, Ivri
795, Inat 875, and Idan 862.

### Ivri finance and business expansion

`professional_173`–`196` add twenty-four finance and business rows covering
portfolios and asset allocation, volatility and liquidity, bonds and yields,
inflation and exchange rates, hedging and diversification, capital gains and
tax deductions, stocks and dividends, pensions and insurance, loans and credit,
balance sheets and margins, valuation, mergers and acquisitions, boards and
shareholders, macro- and microeconomics, and financial leverage. Eight rows
also deepen already-supported concepts such as cash flow, due diligence,
mortgages, savings, and revenue forecasts.

All rows use the reviewed append-only builder, fit the Handwriting window at
17–34 Hebrew letters, and use a 6/12/6 level 1/2/3 mix. Twenty-one orders are
fixed. Three accept reviewed neutral alternatives: bond-market context first or
last, and either ordering of the hedging/diversification and pension/insurance
coordinations. The rows are vocabulary contexts, not investment, tax, credit,
or insurance advice.

Exact support reaches 17/17 for `finance_investing` and 20/20 for
`business_finance_expanded`. App-wide exact support rises from 994 to 1,031
cards, while unsupported cards fall from 1,198 to 1,161. The 30 intended cards
produce seven conservative incidental matches in `work_business` and
`bureaucracy`: profit, merger, acquisition, valuation, board of directors,
shareholder, and tax.

The sentence pool is 1,069, with 269 unrouted and 266 reserved rows. Ivri's
professional-register ownership rises from 188 to 212. Because the rows remain
unreserved, every companion can draw them: Ido 831, Inbal 910, Ivri 819, Inat
899, and Idan 886.

Binyanim, Prepositions, and Conjugation+ stay character-neutral by decision — see the Depth standard section above for the evidence.

## Visual production

All five characters are built and integrated, so this section is now a record rather than a plan.

- Each character has the six production reactions in `assets/<id>/` — `neutral`,
  `nervous-laugh`, `celebrating`, `struggling`, `mission-complete`, `frustrated` — as
  transparent 512x512 RGBA PNGs.
- The binding contract is `assets/SPRITE_STANDARD.md`: every tracked 1254x1254 RGBA master is
  exported directly to 512x512 with nearest-neighbor sampling and deterministic PNG encoding.
  Logical-canvas reduction and palette quantization are forbidden.
- All 30 high-resolution transparent masters are tracked in `assets/sprite-masters/`. Neither
  masters nor staging files are referenced by HTML or CSS.
- Runtime wiring is one generic interface: `styles.css` holds six
  `.character-sprite[data-character][data-reaction]` rules per character, and `app/character.js`
  sets those attributes. Adding a character needs no new rendering code.
- Idan's `nervous-laugh` slot is the one documented semantic exception: the filename is retained
  for the shared runtime contract, but the art is deliberately stern rather than embarrassed.
- Still unimplemented: per-character accent colors. `docs/product-roadmap.md` item A3 specifies
  a `--char-accent` layer keyed on `data-character`, with Ido magenta, Inbal violet, Ivri
  steel-cyan, Inat deep crimson, and Idan slate-grey.

## Next decisions

0. **Authoring priority after the fence.** Withholding shrank the shared tier for everyone, so
   the content work below was driven by that rather than by the ownership report. Items 1–4
   are **done**.
   1. ~~A shareable civil-defense tranche for Idan.~~ **Done** — `idan_91`–`115`. Twenty are
      cast-wide, taking the allow-list from 21 to 43 and giving the shelf real sentence support;
      five stay his. His bank went 90 → 115.
   2. ~~A `professional` tranche for Ivri.~~ **Done** — `professional_98`–`122`. His bank went
      113 → 138 owned, 127 drawable.
   3. ~~**Neutral `everyday_` rows, ~40.**~~ **Done** — `everyday_150`–`189`. The forty
      coverage-led rows use ordinary cooking, personal-care, health, planning, emotional and
      language-learning contexts. They are unowned and unreserved, taking the unrouted sentence
      tier from 139 to 179 and lifting every drawable pool equally: Ido 631, Inbal 704, Ivri 619,
      Inat 699 and Idan 680. Character-owned counts and the 254 fenced sentences are unchanged.
   4. ~~**A non-partisan tranche for Inat, ~20 rows.**~~ **Done** — `formal_88`–`107`.
      The twenty rows cover literature, cultural memory and identity, ethics, consciousness,
      and logic. Formal-register ownership raises Inat from 167 to 187 owned sentences, while
      leaving the rows unreserved makes all twenty drawable by every companion.
   5. Inbal needs nothing: 96 rows across two well-covered shelves.
   6. ~~**Shared kitchen-action context, ~24 rows.**~~ **Done** — `everyday_218`–`241`.
      The tranche raises cooking-verb support from 4.2% to 38.9% while remaining unowned,
      unreserved, and available to every companion.
   7. ~~**Shared home-care context, ~24 rows.**~~ **Done** — `everyday_242`–`265`.
      The tranche raises `home_everyday_life` support from 15/106 to 74/106 while remaining
      unowned, unreserved, and available to every companion.
   8. ~~**Shared dating and relationship context, ~20 rows.**~~ **Done** —
      `colloquial_176`–`195`. Both relationship shelves reach full exact support. Ido owns
      the colloquial register, but every row remains unreserved and available to the cast.
   9. ~~**Ivri AI and machine-learning context, ~20 rows.**~~ **Done** —
      `professional_153`–`172`. Both technology shelves reach full exact support. Ivri owns
      the professional register, but every row remains unreserved and available to the cast.
   10. ~~**Shared Hebrew grammar and meta-language context, ~14 rows.**~~ **Done** —
      `everyday_266`–`279`. Both language-learning shelves reach full exact support. The
      rows remain unowned, unreserved, and available to every companion.
   11. ~~**Inat legal and civic context, ~18 rows.**~~ **Done** — `formal_108`–`125`.
      Both legal shelves reach full exact support. Inat owns the formal register,
      but all eighteen rows remain unreserved and available to every companion.
   12. ~~**Ivri finance and business context, ~24 rows.**~~ **Done** —
      `professional_173`–`196`. Both finance shelves reach full exact support.
      Ivri owns the professional register, but all twenty-four rows remain
      unreserved and available to every companion.
1. Consider a verb pass. Verbs are the thinnest pool app-wide — 48.2% of the 247-item conjugation
   deck is unrouted and no character exceeds 34. Every character clears the floor of 20, so this
   is not urgent, but it is the largest structural deficit left.
2. Leave the health cluster shared. `health`, `pharmacy_personal_care`, and `health_body_expanded`
   are 122 unowned cards and the largest coherent unowned domain, but the balance policy above
   forbids routing them to Inbal, the cast is capped at five, and no other character plausibly
   owns them. Idan reaches only the trauma subset, through `vocabWords`. Recorded here so it is
   not rediscovered as a bug.
3. Every character now clears every floor in the depth standard, so there is no outstanding
   coverage debt. The next content work should be driven by what a learner is missing, not by
   the report.

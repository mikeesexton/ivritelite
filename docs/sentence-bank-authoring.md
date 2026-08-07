# Sentence-bank authoring standard

Sentence chips test translation units, not memorized clauses. This standard
applies to target chips, distractors, and alternate answers in both language
directions.

For which character a new row reaches, and when a strongly coded row has to be
fenced off from the rest of the cast, see the "Content withholding" section of
`docs/character-gameplay-strategy.md`. A row authored into a shared register bank
is reachable by every character unless it is named in a reserve list.

## Core rule: one compact meaning per chip

Default to one meaning-bearing lexical item per chip on both sides. English
articles, auxiliaries, pronouns, infinitive `to`, and valency-bound particles
may stay with the one item they realize (`depend on`, `to vote`). Attached
Hebrew clitics (`ו־`, `ב־`, `כ־`, `ל־`, `מ־`, `ש־`, `ה־`) remain attached to
their orthographic word.

Independent links normally stand alone when Hebrew and English both express
them separately. This especially includes temporal links (`before` ↔ `לפני`),
relational links that join two nouns (`of` ↔ `של` or a construct boundary),
and discourse connectors. Do not use a preposition as permission to bundle a
second action or noun into the same chip.

Hebrew and English boundaries should represent comparable semantic units. New
rows should normally have the same number of target chips in each language.
This is not a demand for literal word-for-word translation: Hebrew morphology
and word order often package grammar differently. It is a check that neither
side asks the learner to recall an extra independent idea.

Use a multiword chip only for one of these reasons:

- an established lexical term, such as `יוקר המחיה` ↔ `cost of living` or
  `אלימות משטרתית` ↔ `police brutality`;
- a fixed expression, such as `אין מצב` ↔ `no way`;
- a proper or institutional name, such as `בית המשפט העליון` ↔
  `the Supreme Court`;
- an irreducible grammatical construction or a natural multiword English
  realization of one Hebrew item.

Do not combine words merely to reduce the tile count. A chip is too broad if a
learner must remember a second noun, modifier, complement, action, or clause in
order to translate it.

Ordinary adjective-plus-noun combinations are not automatically terms. Split
`a cheaper` · `apartment` and `a simple` · `explanation`; keep `polling station`
or `civil marriage` together because each is an established lexical term. If
termhood is debatable, split the chip.

## Boundary examples

Bad:

- English: `before publishing the data`
- Hebrew: `לפני פרסום הנתונים`

Better:

- English: `before` · `publishing` · `the data`
- Hebrew: `לפני` · `פרסום` · `הנתונים`

Bad:

- English: `of the police-brutality allegations`
- Hebrew: `הטענות לאלימות משטרתית`

Better:

- English: `allegations` · `of` · `police brutality`
- Hebrew: `טענות` · `בדבר` · `אלימות משטרתית`

Good multiword units include `civil marriage`, `the Green Line`, `אחוז
החסימה`, and `עולה בקנה אחד`. Their components form the term or construction
being taught rather than two unrelated recall tasks.

## Natural English and specialist terms

The full English sentence must be legible, idiomatic standalone English. Avoid
calques that are technically literal but opaque to a learner. For example,
planning-law `הופקדה` should be paraphrased by its communicative effect in the
sentence; the literal specialist sense can be explained in `notes` rather than
shown as “the plan was deposited.”

Keep register consistent with the category. Colloquial rows should not use
formal constructions such as “one should clarify” or conspicuously British
wording in an otherwise American-English set.

## Distractors and alternates

- Distractors follow the same one-unit rule as targets and should approximately
  shape-match the kind of chip they replace.
- A distractor must not silently add a subject, verb, complement, or modifier
  that its counterpart lacks.
- Check agreement and inflection inside every distractor; decoys may be false in
  meaning, but they must still be well-formed language.
- Alternate-answer token lists must use the same granularity as the primary
  answer and retain their existing token-count requirement.

## Word-order alternates (required)

Review natural Hebrew word order while constructing each new or revised row,
not only after a learner reports a rejected answer. Before the row is complete,
check whether the same English prompt has more than one neutral, idiomatic
Hebrew order using the authored chips. Pay particular attention to:

- temporal, locative, frequency, and aspectual adverbials in initial, medial,
  and final position;
- negation combined with words such as `כבר` and `עדיין`;
- subordinate clauses that can naturally precede or follow the main clause;
- predicate, subject, or object placement when the alternative remains neutral;
  and
- sentences that have three or more independently common placements, rather
  than stopping after the first alternate is found.

Author every clearly neutral equivalent under `hebrewAlternates`, with fully
pointed text and token pairs. Do not enumerate every grammatically possible
permutation. Exclude orders that introduce contrastive focus, correction,
scope ambiguity, a different register, or a meaning not cued by the English.
When the prompt also permits multiple speaker genders, review the full
word-order × gender combination so every intended answer is buildable.

Do this review before finalizing distractors. A wording alternate that adds a
new token needs that token, with matching niqqud, in the distractor bank. A
pure reordering reuses the primary tiles and needs no new distractor.

For append-only rows after `APPEND_ONLY_REVIEWED_SENTENCES_START`, use
`buildReviewedSentence` and make the review outcome explicit:

- `wordOrderDecision: "fixed"` means the review found no other neutral order;
- `wordOrderDecision: "alternates"` requires at least one reordered answer in
  `hebrewOrderAlternates`; and
- each `hebrewOrderAlternates` item supplies the plain sentence, pointed
  sentence, and a complete zero-based permutation of the primary Hebrew token
  pairs.

Do not add new rows above the marker. The builder rejects a missing or
contradictory decision, validates every permutation, and derives the alternate
plain/pointed token arrays from the primary tokens so they cannot drift.

## Authoring and review checklist

For every changed row:

1. Read both full sentences aloud for naturalness and faithful meaning.
2. Enumerate the clearly neutral Hebrew word orders, including a third order
   when an adverbial has three independently common placements; author them as
   pointed alternates and reject merely possible but focus-shifting orders.
3. Compare the target arrays in order and make their counts match by default.
4. Ask of every chip: “Could a learner translate this without also recalling a
   second independent idea?”
5. Review every distractor in the same way and check gender, number,
   prepositions, and omitted or invented words.
6. Keep technical literal detail and contested terminology framing in `notes`.
7. Run `node --test tests/sentence-bank-data.test.js`, then `npm test`.

## Automated policy

`tests/sentence-bank-data.test.js` applies the compact-token policy to the
political expansion and all later append-only IDs (`colloquial_140+`,
`everyday_125+`, `professional_73+`, and `formal_64+`). It checks bilingual
target-count parity, hard surface-size limits, known rejected Hebrew and English
chunks, and a conservative English content-word heuristic.

The English heuristic permits one meaning-bearing word by default. A chip with
two or more must be either:

- in `COMPACT_ENGLISH_MULTIWORD_UNITS`, the reviewed reusable glossary of
  terms, names, and fixed expressions; or
- in `COMPACT_ENGLISH_CONTEXT_EXCEPTIONS`, keyed to one exact entry, bank, and
  token for an irreducible grammatical mismatch.

Adding a glossary item is a content decision, not a way to make a failing test
green. Split the chip first unless the whole expression is independently worth
learning as vocabulary. Both registries are checked for stale entries.

The same test file treats the append-only review marker as a ratchet: all rows
from the first reviewed sentence onward must expose a fixed-vs-alternates
decision, and the source below the marker may not call the legacy builder.
Every accepted order from a completed audit is also listed in
`WORD_ORDER_AUDIT_ALTERNATE_TEXTS`, which prevents a later edit from silently
dropping a reviewed answer.

Automation cannot reliably infer Hebrew morphology, contested termhood, or
whether two individually short chips are the best translation counterparts.
The Hebrew hard limit, target-count parity, and rejected-pattern checks are
backstops; the sentence-by-sentence checklist above remains mandatory. In
particular, a passing test does not authorize a three-word Hebrew phrase merely
because it fits the surface limit.

Older rows predate this policy and are not automatically migrated. Existing
tests named around “compacted” or “phrase” chips preserve historical behavior;
they are not examples to copy when authoring new content.

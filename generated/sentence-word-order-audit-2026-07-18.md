# Hebrew sentence word-order acceptance audit

- Date: 2026-07-18
- Scope: all 450 current sentence-bank entries
- Original audit mode: report only
- Scan recall: conservative, high-confidence first tranche

Implementation update: Priority 1 was approved and implemented on 2026-07-18.
The 19 approved sentences gained 25 reviewed variants: the 19 listed orders
plus six conservative third placements. Priority 2 remains review-only.

## Executive summary

The reported root cause is correct: sentence answers are graded against ordered token arrays, with only (a) authored alternatives and (b) one narrow adjacent-swap exception. There is no general Hebrew word-order model.

The current-data counts are newer than the notes used to start this audit:

- 450 sentence entries.
- 115 sentences have at least one Hebrew alternate.
- 130 Hebrew alternate variants in total.
- 72 variants across 65 sentences are pure same-token reorderings. The other 58 variants are gender or wording variants, including some variants that also change order.
- 385 sentences have no authored, same-token reordering.
- Only 10 sentences contain a standalone token from the global flexible-modifier set; 9 of those have no authored reordering. The automatic exception therefore has very narrow coverage.

The initial review queue contained 28 suggestions. At audit time, every suggestion:

- is rejected by the current primary/alternate/flexible-swap logic;
- reuses exactly the primary Hebrew token multiset and token count;
- can be rendered by the current sentence-frame mechanism; and
- still requires a Hebrew-language reviewer, pointed text, and normal alternate-data validation before authoring.

This is deliberately not a claim that these are the only valid reorderings in the bank. It is a short first tranche intended to turn discovery into review.

## Acceptance path and exact limits

1. `sentence-bank-data.js` exposes raw snake-case data through `IvriQuestSentenceBank.getSentenceBank()` (`sentence-bank-data.js:11812-11818`). Expanded rows convert camel-case authoring input into `hebrew_alternates` records containing `text`, `text_niqqud`, `tokens`, and `tokens_niqqud` (`sentence-bank-data.js:8-51`).
2. `prepareSentenceBankDeck()` normalizes each row to runtime camel-case fields. `sanitizeAnswerVariants()` trims tokens, drops empty/invalid variants, requires every alternate to have the same token count as the primary answer, and deduplicates alternate token arrays (`app/sentence-bank.js:43-67`, `1103-1165`). An alternate with a different chip count is silently excluded from grading.
3. `buildQuestionFromPair()` uses the primary tokens as `targetTokens`. Alternate-only lexical tokens are not automatically added to the bank (`app/sentence-bank.js:944-996`). `getAlternateRequiredDistractors()` only protects such tokens from distractor capping if they are already present in the sentence's distractor list (`app/sentence-bank.js:911-941`). Pure reorderings need no new tiles.
4. On submission, `applySentenceBankAnswer()` obtains the placed token sequence and calls `findMatchingAcceptedAnswerVariant()` (`app/sentence-bank.js:1927-1944`).
5. `getAcceptedAnswerVariants()` selects candidates by direction (`app/sentence-bank.js:1011-1027`):
   - `en2he`: primary Hebrew plus `hebrewAlternates`;
   - `he2en`: primary English plus `englishAlternates`;
   - `listen`: primary Hebrew only; authored Hebrew alternates are deliberately excluded.
6. Each candidate is compared by `isEquivalentSentenceTokenOrder()` (`app/sentence-bank.js:436-461`). Acceptance requires either:
   - the exact same trimmed token strings in the exact same order; or
   - exactly two mismatches at adjacent indexes, with the two tokens cross-swapped, where either expected token is one of `די`, `לגמרי`, `ממש`, or `מאוד`.

Consequences of those rules:

- No normalization of synonyms, inflection, omitted pronouns, token splitting/merging, or clause structure occurs during answer comparison.
- A movable word that crosses two positions is rejected. Two independent valid swaps are rejected. A clause moved from the beginning to the end is rejected unless authored.
- The one-swap exception is applied separately to the primary and every authored alternate, so each accepted variant also gains its own adjacent flexible-modifier permutations.
- `listen` excludes authored alternates, but it still calls the same tolerant comparator. A spoken sentence containing a standalone flexible-modifier token can therefore accept one adjacent swap. The test name “shema requires the exact spoken word order” is exact only for sentences without one of those four tokens.
- `he2en` also calls the comparator, but the four Hebrew strings normally do not appear in English token arrays, so English grading is effectively exact-order plus authored English alternates.

## Priority 1: implemented

These common, semantically stable placements were approved and are now authored
as accepted alternatives. The six extra third placements are recorded after the
table.

| ID | Movable element | Current Hebrew | Suggested alternate order |
|---|---|---|---|
| `colloquial_26` | `כבר` before/after the progressive verb | לקחתי מספר ואני כבר מחכה שעה בתור. | לקחתי מספר ואני מחכה כבר שעה בתור. |
| `professional_06` | `כרגע` clause-final/fronted | אנחנו עובדים על זה כרגע, נעדכן כשיהיו תוצאות. | כרגע אנחנו עובדים על זה, נעדכן כשיהיו תוצאות. |
| `professional_09` | temporal phrase clause-final/fronted | נשלח גרסה מעודכנת בהמשך היום, אחרי שנבצע תיקונים. | בהמשך היום נשלח גרסה מעודכנת, אחרי שנבצע תיקונים. |
| `professional_13` | `מחר בבוקר` clause-final/fronted | בוא נסגור את הפרטים בשיחה קצרה מחר בבוקר. | מחר בבוקר בוא נסגור את הפרטים בשיחה קצרה. |
| `professional_19` | `בהמשך` after/before the verb | הישיבה נדחתה, אעדכן אותך בהמשך לגבי מועד חדש. | הישיבה נדחתה, בהמשך אעדכן אותך לגבי מועד חדש. |
| `formal_15` | `עדיין` before/after the predicate | ההסכם עדיין קיים למרות השינויים. | ההסכם קיים עדיין למרות השינויים. |
| `formal_17` | `עדיין לא` / `לא ... עדיין` | קיום חיים מחוץ לכדור הארץ עדיין לא הוכח. | קיום חיים מחוץ לכדור הארץ לא הוכח עדיין. |
| `formal_27` | `עדיין` before/inside the predicate | השפעת הגורם הזה על התוצאה עדיין שנויה במחלוקת. | השפעת הגורם הזה על התוצאה שנויה עדיין במחלוקת. |
| `professional_46` | `עדיין לא` / `לא ... עדיין` | התקציב לרבעון הבא עדיין לא אושר. | התקציב לרבעון הבא לא אושר עדיין. |
| `professional_51` | `היום` after the object/after the verb | אם לא נקבל אישור היום, נדחה את הפרסום לשבוע הבא. | אם לא נקבל היום אישור, נדחה את הפרסום לשבוע הבא. |
| `professional_57` | `השנה` clause-final/fronted | לפי הדוח, המחירים עלו בעשרה אחוזים השנה. | לפי הדוח, השנה המחירים עלו בעשרה אחוזים. |
| `formal_51` | `בקרוב` clause-final/preverbal | על פי הפרסומים, ההסכם ייחתם בקרוב. | על פי הפרסומים, בקרוב ייחתם ההסכם. |
| `formal_59` | `מיד` clause-final/preverbal | אם יאושר התקציב, הפרויקט יצא לדרך מיד. | אם יאושר התקציב, הפרויקט מיד יצא לדרך. |
| `everyday_105` | `כבר` after/before the progressive verb | אנחנו מחכים כבר כמעט חצי שעה. | אנחנו כבר מחכים כמעט חצי שעה. |
| `colloquial_96` | `כבר` before/after the copula | עד שהגענו, האוכל כבר היה קר. | עד שהגענו, האוכל היה כבר קר. |
| `colloquial_104` | `פתאום` clause-initial/postverbal | פתאום נפל לי האסימון: הם חזרו להיות זוג. | נפל לי פתאום האסימון: הם חזרו להיות זוג. |
| `colloquial_108` | duration phrase clause-final/fronted | יש וי כחול כבר יומיים והוא לא עונה. | כבר יומיים יש וי כחול והוא לא עונה. |
| `colloquial_133` | `החודש` clause-final/fronted | לא נכנסים לים החודש, זאת עונת המדוזות. | החודש לא נכנסים לים, זאת עונת המדוזות. |
| `everyday_138` | `בכל יום` clause-final/fronted | היא מדברת שתי שפות בעבודה בכל יום. | בכל יום היא מדברת שתי שפות בעבודה. |

Additional conservative third placements implemented:

- `professional_06`: `אנחנו כרגע עובדים על זה, נעדכן כשיהיו תוצאות.`
- `professional_51`: `אם היום לא נקבל אישור, נדחה את הפרסום לשבוע הבא.`
- `professional_57`: `לפי הדוח, המחירים השנה עלו בעשרה אחוזים.`
- `everyday_105`: `אנחנו מחכים כמעט חצי שעה כבר.`
- `colloquial_96`: `עד שהגענו, האוכל היה קר כבר.`
- `colloquial_133`: `לא נכנסים החודש לים, זאת עונת המדוזות.`

## Priority 2: review after the first tranche

These are plausible and common, but fronting or clause movement changes information structure a little more. They should receive closer human review before authoring.

| ID | Movable element | Current Hebrew | Suggested alternate order | Review note |
|---|---|---|---|---|
| `colloquial_12` | locative `כאן` | אפשר לפתוח את החלון? חם כאן מאוד. | אפשר לפתוח את החלון? כאן חם מאוד. | Natural locative fronting; emphasis moves slightly to “here.” |
| `everyday_13` | locative `פה` | אין חניה פה, בוא נחפש קצת יותר רחוק. | פה אין חניה, בוא נחפש קצת יותר רחוק. | Common colloquial order. |
| `colloquial_23` | locative `שם` | האוכל שם היה חבל על הזמן, חייבים לחזור. | שם האוכל היה חבל על הזמן, חייבים לחזור. | Natural topic-setting order. |
| `everyday_31` | `מחר בבוקר` clause-final/fronted | אצטרך לקום מוקדם מחר בבוקר. | מחר בבוקר אצטרך לקום מוקדם. | Straightforward temporal fronting. |
| `everyday_72` | `מחר בבוקר` medial/fronted | הטכנאי יגיע מחר בבוקר לתקן את המקרר. | מחר בבוקר הטכנאי יגיע לתקן את המקרר. | Straightforward temporal fronting. |
| `everyday_83` | `היום` clause-final/fronted | חם מאוד היום, קחי כובע ובקבוק מים. | היום חם מאוד, קחי כובע ובקבוק מים. | Not covered by the adjacent `מאוד` rule because `היום` moves two positions. |
| `everyday_91` | `אחר כך` clause-final/fronted | אין לי קליטה כאן, אחזור אליך אחר כך. | אין לי קליטה כאן, אחר כך אחזור אליך. | Natural sequencing; clause emphasis shifts mildly. |
| `professional_69` | locative `במשרד` postnominal/fronted | יש שלושה כלבים במשרד ורק מנהלת אחת. | במשרד יש שלושה כלבים ורק מנהלת אחת. | Natural scene-setting order. |
| `colloquial_148` | temporal subordinate clause front/back | כל פעם שביבי עולה לשידור, הקבוצה המשפחתית מתפוצצת מהודעות. | הקבוצה המשפחתית מתפוצצת מהודעות כל פעם שביבי עולה לשידור. | Same condition, different information flow. |

## Deliberately deferred cases

No fronted-object candidate cleared the conservative first-tranche threshold. Hebrew object topicalization can be grammatical while adding contrast or correction that the neutral English prompt does not express. Examples to review only if recall is widened:

- `professional_18`: `את הדוח תוכל לשלוח לי עד סוף היום?` — grammatical topicalization, but it highlights “the report.”
- `professional_71`: `את כולם המנכ"ל רוצה במשרד, אבל הצוות מתעקש על היברידי.` — grammatical only with a strongly contrastive discourse reading.
- `colloquial_74`: `את הסטורי שהיא העלתה אתמול ראית?` — possible colloquial echo-question order, but much more marked than the English prompt.

Other candidates held back because the move can change scope/focus or is not a pure token reordering:

- `colloquial_07`: fronting `עכשיו` can change “Are you serious right now?” into a contrastive “Now you are serious?” reading.
- `colloquial_18`: `מחר ב-8` / `ב-8 מחר` is plausible, but the terse fragment deserves a native-speaker style check.
- `everyday_68`: `כמה עולה היום קילו עגבניות?` is plausible but less neutral than the current order.
- `everyday_96`: two independent temporal phrases create several combinations; authoring just one can produce inconsistent coverage.
- `formal_48`: a natural fronted rewrite would change `שנערך` to `נערך`, so this is not merely a reorder and would require a new tile/distractor plus closer editorial review.

## Recommendation on automatic tolerance

Do not expand the global flexible-modifier list with `מזמן`, `כבר`, `עדיין`, temporal adverbs, locatives, or objects. Do not generalize the current adjacent swap into arbitrary movement.

Reasons:

1. A global token property is too coarse. Whether a swap is valid depends on the neighboring phrase, scope, focus, and clause boundary.
2. The current rule already demonstrates over-acceptance because it permits either adjacent neighbor without a syntax check. For example:
   - `formal_41` can accept orders corresponding to `די אין בראיות...` or `אין בראיות די הקיימות...`, neither of which is a safe equivalent of `אין די בראיות הקיימות...`.
   - `colloquial_24` can accept `היה על ממש הפנים` by moving `ממש` across `על`.
   - `colloquial_42` can turn `לא לגמרי מסכים` into `לגמרי לא מסכים`, which is grammatical but semantically stronger.
3. Broader movement still would not solve chip-count changes, inflection changes, or rewrites such as `שנערך` to `נערך`.
4. The generic comparator is direction-agnostic, so any expansion also widens Shema/listen acceptance unless a direction guard is added.

Conservative long-term options, in order of safety:

1. Keep grading declarative: author reviewed `hebrewAlternates` per sentence.
2. Automate discovery only: rerun a static auditor that ranks likely movable adverbials and emits proposed same-token orders for review.
3. If grading automation is later desired, use per-sentence reviewed permutations or reviewed token-neighbor rules, restricted to `en2he`; do not infer equivalence from a global word list alone.

## Authoring checklist for approved rows

For each approved suggestion:

1. Add exact `text`, `textNiqqud`, and `tokenPairs` under `hebrewAlternates` (or the equivalent normalized fields for legacy literals).
2. Preserve the primary token count and sentence-frame alignment.
3. If wording changes introduce any token not in the primary answer, put that token and its niqqud in the Hebrew distractors so the answer remains buildable and survives the tile cap.
4. Review combinations explicitly when a sentence also has gender variants; `colloquial_85` is the reference for order × gender coverage.
5. Keep authored alternates out of Shema/listen, and separately decide whether the generic flexible-swap tolerance should remain active there.
6. Run the structural sentence-bank tests and the full `npm test` suite after authoring.

## Verification performed for this report

- Loaded all 450 entries from `IvriQuestSentenceBank.getSentenceBank()`.
- Classified pure reorderings by equal token multiset plus different token sequence.
- Scanned temporal/locative markers, negation-plus-adverb patterns, clause adverbials, and likely topicalization sites.
- Manually narrowed the output to a conservative first tranche.
- At initial scan time, programmatically confirmed that all 28 proposed orders were rejected, preserved the exact primary token multiset/count, and fit their proposed sentence text in sequence.
- After approval, confirmed that all 25 Priority 1 variants are authored, pointed, buildable from the primary tiles, and covered by a structural regression test.
- Ran `npm test`: 254 passed, 0 failed.

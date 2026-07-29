# Hebrew sentence word-order acceptance audit

- Date: 2026-07-29
- Scope: all 608 current sentence-bank entries
- Policy: accept only explicitly reviewed sentence variants

## Current inventory

- 168 sentences have at least one Hebrew alternate.
- 200 Hebrew alternate variants are authored in total.
- 139 variants across 118 sentences are pure same-token reorderings.
- 490 sentences have no authored same-token reordering.
- No exact duplicate Hebrew or English sentences were found.

The sentence builder no longer exposes or applies a global flexible-modifier
swap. Hebrew alternatives are accepted only when the sentence data supplies a
complete plain, pointed, and token-aligned variant. Shema continues to require
the exact spoken order.

## Orders added in this review

| ID | Primary Hebrew | Added neutral order |
|---|---|---|
| `everyday_31` | אצטרך לקום מוקדם מחר בבוקר. | מחר בבוקר אצטרך לקום מוקדם. |
| `everyday_72` | הטכנאי יגיע מחר בבוקר לתקן את המקרר. | מחר בבוקר הטכנאי יגיע לתקן את המקרר. |
| `everyday_83` | חם מאוד היום, קחי כובע ובקבוק מים. | היום חם מאוד, קחי כובע ובקבוק מים. |
| `everyday_91` | אין לי קליטה כאן, אחזור אליך אחר כך. | אין לי קליטה כאן, אחר כך אחזור אליך. |
| `professional_69` | יש שלושה כלבים במשרד ורק מנהלת אחת. | במשרד יש שלושה כלבים ורק מנהלת אחת. |
| `inbal_87` | הרב פירש את החלום שלי אחרת לגמרי. | הרב פירש את החלום שלי לגמרי אחרת. |

Each added order is a pure permutation of the primary Hebrew chips and includes
matching pointed text. `inbal_87` is now explicitly marked `alternates`; the
five legacy rows use their existing `hebrew_alternates` representation.

## Deliberately excluded

- `colloquial_12`, `everyday_13`, and `colloquial_23`: locative fronting adds
  topic or contrastive focus beyond the neutral English prompt.
- `colloquial_148`: moving the conditional clause changes information
  structure enough to require a separate editorial decision.
- Fronted objects remain excluded because they ordinarily add contrast or
  correction that the English prompt does not express.

No general temporal, locative, modifier, or clause-movement rule should be
introduced. Future discovery can be automated, but every accepted order should
remain sentence-specific and reviewed.

## Verification contract

- `tests/sentence-bank-data.test.js` pins every order listed above.
- Alternate text, niqqud, token counts, and token multisets must remain aligned.
- The sentence-bank count stays at 608 and exact Hebrew/English duplicates stay
  at zero.
- Structural verification: `node --test tests/sentence-bank-data.test.js`.


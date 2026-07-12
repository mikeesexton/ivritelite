# Translation Match Vocabulary Expansion Plan

Date: 2026-07-12

Status: Implemented in full on 2026-07-12. Translation Match now includes all four 36-card batches (144 additions), with 1,354 base lexicon entries and 1,300 playable base cards. The final implementation uses compact card glosses and passes the single-line audit at 320px and 375px with pointed and unpointed Hebrew.

## Current-state audit

- `vocab-data.js` contains 1,210 base lexicon entries across 35 categories.
- 1,156 base entries are eligible for Translation Match; 54 remain available only to supporting features such as sentence hints.
- `sentence-bank-data.js` contains 328 sentences: 106 everyday, 97 colloquial, 65 professional, and 60 formal.
- Difficulty is balanced at 86 level-1, 160 level-2, and 82 level-3 sentences.
- The vocabulary is strong in specialized domains, but the sentence bank repeatedly uses high-frequency discourse, modal, workplace, and colloquial language that is not independently practiced in Translation Match.

The clearest exact-form gaps are `אפשר` (16 sentence-token occurrences across three registers), `יותר` (15 across all four), `משהו` (9), `שעה` (8), `לדחות` (5 across all four), `זמן` (5), `עדיין` (5), `קצת` (5), `לקבל` (5), `בסוף` (4), `לגמרי` (4), `שוב` (4), `בדיוק` (3), and `תמיד` (3). Not all should become cards: isolated basics such as `שעה`, `זמן`, and common infinitives already covered by the conjugation game would conflict with the established decision to keep Translation Match above beginner level. The recommended payload therefore favors reusable adverbs, discourse frames, advanced verbs, standalone professional concepts, and idiomatic chunks.

## Recommended scope

Add 144 Translation Match cards in four independently shippable batches of 36. Append rows to existing categories rather than inserting them, so existing position-based word IDs and learner progress remain stable.

The English labels in the tables below describe the intended sense; they are not automatically final card copy. Before implementation, each label must be reduced to the shortest unambiguous gloss that passes the mobile card-fit gate below. Nuance belongs in the choice of example sentences, not in a long slash-separated card label.

### Batch 1 — Conversation and sentence glue (36)

Route primarily to `conversation_glue`, with modal adjectives in `core_advanced`.

| English | Hebrew |
|---|---|
| still / yet | עדיין |
| actually / specifically / contrary to expectation | דווקא |
| at all / generally | בכלל |
| completely / totally | לגמרי |
| simply / just | פשוט |
| exactly | בדיוק |
| approximately / about | בערך |
| almost | כמעט |
| too much / too many | יותר מדי |
| not enough | לא מספיק |
| from time to time | מדי פעם |
| in any case | בכל מקרה |
| in advance | מראש |
| usually | בדרך כלל |
| for now | לעת עתה |
| so far / until now | עד עכשיו |
| at the same time | באותו זמן |
| for the first time | בפעם הראשונה |
| next time | בפעם הבאה |
| while / in the course of | תוך כדי |
| finally | סוף סוף |
| the moment that / as soon as | ברגע ש־ |
| until / by the time | עד ש־ |
| as long as | כל עוד |
| worthwhile / advisable | כדאי |
| capable / able | מסוגל |
| supposed to | אמור |
| it seems to me / I think | נראה לי |
| sounds good | נשמע טוב |
| no chance | אין סיכוי |
| no way | אין מצב |
| no big deal | לא נורא |
| no problem | אין בעיה |
| unclear / not clear | לא ברור |
| never | אף פעם |
| immediately | מיד |

### Batch 2 — High-utility advanced verbs (36)

Route by use: workplace verbs to `work_business`, analytical verbs to `scientific_analytical`, and general-purpose verbs to `core_advanced`. These are not currently Translation Match cards. Do not re-add verbs explicitly hidden as conjugation-first, including `להחליט`, `להמשיך`, and `להוכיח`.

| English | Hebrew |
|---|---|
| to postpone / reject | לדחות |
| to update | לעדכן |
| to check / examine | לבדוק |
| to schedule / determine | לקבוע |
| to agree | להסכים |
| to give up / waive | לוותר |
| to manage in time / be enough | להספיק |
| to approve / confirm | לאשר |
| to cancel | לבטל |
| to attach / join | לצרף |
| to remind / mention | להזכיר |
| to recommend | להמליץ |
| to find out / clarify | לברר |
| to turn out / become clear | להתברר |
| to turn out / prove to be | להסתבר |
| to compare | להשוות |
| to consider / weigh | לשקול |
| to cope / deal with | להתמודד |
| to avoid | להימנע |
| to affect / influence | להשפיע |
| to lead / result in | להוביל |
| to assess / estimate / appreciate | להעריך |
| to require / demand | לדרוש |
| to enable / allow | לאפשר |
| to address / refer to | להתייחס |
| to assume / place | להניח |
| to indicate / vote | להצביע |
| to note / mention | לציין |
| to implement | ליישם |
| to improve | לשפר |
| to summarize / agree upon | לסכם |
| to coordinate / schedule | לתאם |
| to commit / undertake | להתחייב |
| to clarify | להבהיר |
| to delay / hold up | לעכב |
| to report | לדווח |

### Batch 3 — Professional and analytical bridge words (36)

Route to `work_business`, `scientific_analytical`, `abstract_concepts_expanded`, and `high_level_discourse_expanded`. These favor useful standalone forms where the current lexicon often has only a compound.

| English | Hebrew |
|---|---|
| meeting / session | ישיבה |
| team | צוות |
| report | דוח |
| research | מחקר |
| claim / assertion | טענה |
| context | הקשר |
| limitation | מגבלה |
| impact / influence | השפעה |
| gap | פער |
| target / goal | יעד |
| goal / purpose | מטרה |
| delay | עיכוב |
| priorities | סדר עדיפויות |
| decision-making | קבלת החלטות |
| feasibility | היתכנות |
| viability / worthwhileness | כדאיות |
| determination | נחישות |
| perseverance | התמדה |
| governability | משילות |
| preparedness | היערכות |
| oversight / supervision | פיקוח |
| scope / extent | היקף |
| standard | תקן |
| indicator / measure | מדד |
| estimate | אומדן |
| evaluation / assessment | הערכה |
| review / overview | סקירה |
| summary | סיכום |
| insight | תובנה |
| data reliability | מהימנות |
| validity / force | תוקף |
| data collection | איסוף נתונים |
| sampling error | טעות דגימה |
| frequency | שכיחות |
| variance / variability | שונות |
| control / monitoring | בקרה |

### Batch 4 — Israeli colloquial and practical chunks (36)

Route primarily to `conversation_glue`, `social_cultural`, and `home_everyday_life`. Treat each as a single match card; the value is the chunk, not the literal meanings of its parts.

| English | Hebrew |
|---|---|
| what's going on? | מה נסגר? |
| I don't have the energy | אין לי כוח |
| I feel like / I want | בא לי |
| I don't feel like | לא בא לי |
| okay / cool | סבבה |
| let's go / come on | יאללה |
| come on, seriously | נו באמת |
| honestly / straight up | דוגרי |
| bottom line / in practice | בתכלס |
| terrible / lousy | על הפנים |
| no way | אין מצב |
| awkward / unpleasant | לא נעים |
| what a shame / too bad | חבל |
| no big deal / easy | בקטנה |
| actually / for real | אשכרה |
| thing / situation / bit | קטע |
| to pay attention | לשים לב |
| to take into account | לקחת בחשבון |
| to meet / comply with | לעמוד ב־ |
| to rely on / trust | לסמוך על |
| to get along / manage with | להסתדר עם |
| to be in touch | להיות בקשר |
| to get back to | לחזור אל־ |
| to arrive on time | להגיע בזמן |
| to be late for | לאחר ל־ |
| to make an appointment | לקבוע תור |
| to send a message | לשלוח הודעה |
| to sort things out | לעשות סדר |
| to set out / get underway | לצאת לדרך |
| to get out of it / move past it | לצאת מזה |
| to get it over with | לגמור עם זה |
| to go along with | לזרום עם |
| to manage alone | להסתדר לבד |
| to take one's time | לקחת את הזמן |
| to give it time | לתת לזה זמן |
| to make an impression | לעשות רושם |

## Implementation sequence

1. Add a reusable audit test before content changes. It should load both base vocabulary and verb-seed vocabulary, reject duplicate IDs, report conflicting duplicate Hebrew/English glosses, require niqqud for every new card, and snapshot all pre-expansion IDs.
2. Implement Batch 1 and Batch 4 first. They have the strongest direct payoff against the 328 existing sentences and immediately connect Translation Match to the everyday and colloquial material.
3. Implement Batch 2 next, but preserve the conjugation-first exclusion list. When an infinitive already exists in `hebrew-verbs.js`, use its authoritative lemma/niqqud rather than independently spelling it in `vocab-data.js`.
4. Implement Batch 3 last and perform a gloss-collision review. Words such as `תוקף`, `הערכה`, `מדד`, and `בקרה` need concise disambiguated English labels.
5. Ship one batch per commit/PR. For each batch, update the `vocab-data.js` build marker and the `index.html` cache-buster, then run the focused vocabulary tests and full suite.

## Guardrails

- Append only. Current base IDs contain the row index, so inserting or reordering rows would change IDs and orphan saved learner progress.
- Do not add isolated beginner words merely because they recur in sentences. Keep `שעה`, `זמן`, simple food nouns, and common conjugation-first verbs out unless the product direction changes.
- Prefer one teachable sense per card. Use disambiguated glosses where Hebrew is polysemous; avoid broad slash lists that make matching unfair.
- Avoid separate singular/plural cards unless the plural is lexicalized. Existing `ממצא` should cover ordinary `ממצאים`, for example.
- Use the same maqaf/preposition convention already used by the data (`ב־`, `ל־`, `אל־`) and verify that the visible form and pointed form strip to the same Hebrew text.
- Keep transliterations selective. The project previously removed low-value transliterations, so new cards should teach productive Hebrew rather than English words in Hebrew letters.
- Keep every Translation Match card to one rendered line in both languages. The existing 40-character filter and `match-card-long` font reduction are not sufficient acceptance criteria because actual width depends on glyphs, niqqud, device width, and the paired-column layout.
- Treat a compound or idiomatic chunk as too long if either its Hebrew or its final English gloss wraps at a supported mobile viewport. Shorten the gloss, choose a more compact natural chunk, or exclude the card; do not rely on shrinking the font further or allowing a taller two-line card.

## Mobile card-fit gate

For every proposed compound and every English label longer than a short word, render a real Translation Match board at 320px and 375px viewport widths. Check English UI and Hebrew UI, with niqqud both on and off. A card passes only when its text occupies one line, has no clipping or horizontal overflow, and preserves the same card height as its row partner. Include the longest Hebrew and longest English additions together in the stress-test board rather than relying on random selection.

Add a focused browser assertion that measures the rendered card text/line box, plus a deterministic fixture containing the longest candidates. Keep a manual screenshot check because character counts cannot reliably predict Hebrew and pointed-Hebrew width.

## Acceptance criteria per batch

- 36 intended cards are returned by `getBaseVocabulary()` and are Translation Match eligible.
- All existing vocabulary IDs are unchanged.
- No unintended Hebrew or English duplicate is introduced across base and verb-seed vocabulary.
- Every new entry has reviewed niqqud and a compact, distinguishable English gloss.
- Every English and Hebrew card label remains on one rendered line at 320px and 375px, including with niqqud enabled; no new card depends on the two-line wrapping currently permitted by `.match-card`.
- `node --test tests/vocab-data.test.js` passes.
- `npm test` passes.
- A browser smoke test confirms the new cards render in both directions, speak the pointed Hebrew, fit the match grid, and appear correctly in the mistake summary.

## Recommended first release

Start with Batches 1 and 4 (72 cards). They address the largest mismatch revealed by the sentence scan: the app teaches sophisticated domain nouns but under-practices the small discourse and idiomatic chunks that make the existing 328 sentences sound natural. Batches 2 and 3 can then add professional depth without diluting that immediate payoff.

# IvritElite project rules

**This file is the single source of truth for how agents work in this repo.**

`CLAUDE.md` (Claude Code) and `AGENTS.md` (ChatGPT Codex) both point here and are
kept byte-identical below their title line by `tests/agent-docs-parity.test.js`.
Add a rule **here**, not to one agent's file — that is how the rules diverged
before, and it cost real bugs: Codex was authoring sentence-bank content without
ever being told the Hebrew pointing convention or the cache-busting requirement.

---

## Task Log (required)

`task-log.md` is a shared log maintained by all AI agents (Claude Code and ChatGPT Codex).

**At the end of every task session, add a new entry to `task-log.md`** using the Entry Format block at the top of that file. **Newest first**: insert directly below that block, above the most recent entry — never append at the end of the file. An entry must include:

- Date and time
- Short title summarizing the task
- What was requested
- Files changed (with a brief description of what changed in each)
- Behavior changed (observable differences to the running app, or "None")
- Tests run (exact commands and pass/fail outcome)
- Risks / regressions to check

Do not skip the log entry even for small or documentation-only tasks.

## General editing approach

- Make changes conservatively. Avoid large structural refactors unless explicitly asked.
- Read a file before editing it.
- Do not add features, error handling, or abstractions beyond what is directly requested.
- Do not add comments or docstrings to code you did not write.
- Run `npm test` before and after non-trivial code changes and record the result in the log.

## Cache-busting (required before push — do not skip)

`index.html` loads every `.js`/`.css` file with a `?v=YYYYMMDD<letter>` query string (e.g. `hebrew-verbs.js?v=20260704a`). GitHub Pages and browsers cache by full URL, so **a change won't go live until its `?v=` string is bumped**, even after the code is merged.

- For **every** `.js` or `.css` file you edit, bump that file's `?v=` in `index.html` in the same commit. Data files (`hebrew-verbs.js`, `vocab-data.js`, etc.) count too — they're easy to forget because they're not in `app/`.
- Use today's date plus a letter (`20260704a`, then `b` for a second push the same day).
- Before pushing, verify: every path in your diff that is `.js`/`.css` has a matching `?v=` bump in `index.html`.

This rule has been violated in practice. `app/lesson.js` was gutted from ~639 lines
to 42 on 2026-06-20 without a bump and shipped under a 2026-03-15 cache key until
2026-08-17. Because every module export uses the `x = x || function` idempotency
guard, a stale cached module silently **wins** over the current one — the failure
is invisible rather than loud.

## Hebrew pointing convention (data files)

Hebrew words are stored as `[plain, pointed]` pairs, e.g. `["קיבלתי", "קִבַּלְתִּי"]`. The two columns use **different spellings of the same word**, and this is deliberate:

- **Plain column — *ktiv male* (full spelling).** No vowel marks, so ו and י are inserted as vowel hints. This is everyday written Hebrew: `קיבלתי`.
- **Pointed column — *ktiv chaser* (defective spelling).** The marks carry the vowels, so the helper ו / י is **dropped**: `קִבַּלְתִּי`.

**Mark each vowel once, never twice.** Keeping the helper letter *and* adding the mark (`קִיבַּלְתִּי`) double-marks the vowel and is what these tranches keep drifting into. Corollary: the pointed form must never contain a letter that is absent from the plain form.

Exceptions — these look like violations but are correct, so do not "fix" them:

- **Consonantal ו is real and stays.** `צוות` → `צֶוֶת`, `ועדה` → `וַעֲדָה`, `תוכנית` → `תָּכְנִית`. The plain `וו` legitimately collapses to one pointed `ו`.
- **/f/ loanwords take no dagesh:** `פָלָאפֶל`, `פִינַנְסִי`, `פִילוֹסוֹפִית`, `פְרָאיֶיר`, `פְלִרְטוּט`. Word-initial בג״דכפ״ת takes a dagesh only where the sound is /p/, /t/, /k/.
- **After the prefix וּ, בג״דכפ״ת goes soft** in the assembled sentence but keeps its dagesh as a standalone token — compare `וּפֶנְסְיָה` in `hebrewNiqqud` with `פֶּנְסְיָה` in `hebrewTokenPairs` (`professional_183`).

Two mark placements are outright impossible and should never appear: a prefix with shva attached to a consonant that also carries shva (write `בִּמְגָרֶדֶת`, not `בְּמְגָרֶדֶת`), and a dagesh in a letter following a mater lectionis yod.

Note: `sentence-bank-data.js` has ~186 legacy words that predate this rule and are pointed inconsistently. Leave them; the rule applies to new and edited content.

## Sentence-bank authoring (required)

Before adding or rechunking sentence-bank content, read
[`docs/sentence-bank-authoring.md`](sentence-bank-authoring.md).

- A chip tests one compact translation unit, not a convenient stretch of sentence.
- Default to roughly one lexical item per chip on both sides. Hebrew and English
  target-chip counts should match in newly authored rows unless an exact,
  documented exception is unavoidable.
- Keep established terms, fixed expressions, proper names, and irreducible
  grammatical constructions together; otherwise split independent nouns,
  modifiers, complements, actions, and clauses.
- Treat a failing compact-chip test as an authoring prompt: split first. Add a
  reusable glossary unit or exact grammar exception only when the expression
  meets the documented exception rule.
- Apply the same granularity rule to distractors and alternate answers.
- Learner-facing English must be natural standalone English. Put literal or
  specialist terminology in `notes` instead of exposing an opaque calque.
- Before completing any new or revised sentence, review neutral Hebrew word
  orders during construction and author every clearly idiomatic equivalent as
  a pointed alternate. Check initial, medial, and final adverbial placement,
  negation, and movable clauses; do not stop at two orders when a third is
  independently common. Exclude merely grammatical orders that change focus,
  scope, register, or meaning, and review word-order × gender combinations.
- Every sentence appended after `APPEND_ONLY_REVIEWED_SENTENCES_START` must use
  `buildReviewedSentence`, set `wordOrderDecision` to `fixed` or `alternates`,
  and use `hebrewOrderAlternates` for every accepted reordering. Never add a
  new sentence above the marker to evade this requirement. The data loader and
  sentence-bank tests intentionally fail if this review path is bypassed or if
  the decision disagrees with the authored alternates.

Some older sentence tests preserve historical phrase-chip choices. Those are
legacy snapshots, not authoring precedent; the linked guide is authoritative for
new or revised rows.

## Content routing (required)

No content file may carry a `character` field. `prepareSentenceBankDeck` whitelists
the fields it copies, so a new field on a row is silently dropped before the picker
ever sees it, and `docs/character-gameplay-strategy.md` forbids it outright. Ownership
is declared in the route table in `app/character-data.js`, one indirection away from
the content.

"Give this to Ivri" therefore means three different edits depending on the content type:

| Content | Signal | What "give this to X" means |
|---|---|---|
| **Vocabulary** | `route.vocabCategories` (a whole topic shelf) or `route.vocabWords` (exact plain-Hebrew string) | put the card on a shelf X owns, **or** name the word in X's `vocabWords`, which reaches a card without re-shelving it |
| **Sentences** | `sentenceCategories`, `sentenceStyles`, `sentenceIdPrefixes`, `sentenceReserveIds` | author the row into the right **register bank** — see below |
| **Verbs** (Conjugation) | `route.verbIds`, an explicit id list | add the verb id to X's `verbIds`. The only direct per-character mapping. |
| **Conjugation+, Prepositions, Binyanim** | none — deliberately character-neutral | not routable; do not try |

**Sentence banks are registers, not people.** `colloquial` → Ido, `professional` → Ivri,
`formal` → Inat, and `everyday` is deliberately unowned so the whole cast draws it. Inbal,
Inat and Idan additionally own private id-prefixed banks (`inbal_`, `inat_`, `idan_`); Ido
and Ivri have none, so a row is "Ido's" only by being `colloquial` or `whatsapp` style. A
request for "three sentences coded to different characters" is satisfied by one `formal_`,
one `professional_` and one `everyday_` row — the same thing, expressed as register.

**Ownership grants weight; only the `*Reserve*` fields fence.** Ownership boosts an item so
that roughly `TARGET_OWNED_SHARE` (0.65) of a draw lands in the active character's pool. A
strongly coded row authored into a shared register bank still reaches the entire cast unless
it is named in `sentenceReserveIds`, `vocabReserveCategories`, `vocabReserveWords`,
`abbrReserveIds` or `verbReserveIds`. A row carrying an `inbal_`/`inat_`/`idan_` prefix is
fenced automatically. **The fence does not expire after review:** previously attempted reserved
content waits for its owning character or free play, while active questions and same-session
second chances finish normally.

Two traps, both of which have already cost real bugs:

- **Never move a vocabulary card between categories, and never change a card's `en`.**
  Vocabulary ids embed a positional index (`social_cultural-0NN-secular`), so inserting or
  re-shelving a row renumbers every card below it and orphans learner progress. `ownsItem`
  matches vocabulary on `he` rather than `id` for exactly this reason, and
  `tests/vocab-data.test.js` diffs every id against `tests/fixtures/vocab-id-baseline.json`.
  Append at a category **tail**, and reach an off-shelf word through `route.vocabWords`.
  Retiring a card means `availability: { translationQuiz: false }`, never deletion.
- **An unrouted shelf belongs to nobody, and is reached through the shared topic tier.**
  Since the topic picker landed, all 42 vocabulary categories are named by a topic — a
  character's own or the shared everyday tier — so an unrouted shelf is still nobody's
  identity but is now something a learner can deliberately ask for. What it is *not* is
  ambient: for vocabulary the learner's selection is the whole pool, so an unselected shelf
  is filtered out rather than quietly filling the remainder. Before that, ten of the 42
  vocabulary categories have no owner, `core_advanced` among them. That is how `חוסל` — a
  finite passive form sitting on `core_advanced` — reached an Ido mission on 2026-08-19:
  nothing said it should not. Before adding a card, check whether its shelf actually has the
  owner you intend.

`npm run report:characters` prints owned counts plus a second "draw pool after withholding"
table. Run it after any routing change: it is the only way to see that ownership landed where
you meant and that no character was starved.

## Gameplay viewport floor (required)

- Gameplay UI changes must keep all active, answer, and feedback states usable without vertical scrolling or footer overlap at 360×640 CSS pixels.
- Keep action toolbars on one row with touch targets at least 44px high where the mode calls for a compact toolbar.
- When space is tight, compact redundant whitespace, gaps, and flexible media/canvas areas before reducing Hebrew display text or touch-target size.
- Preserve safe vertical centering: center gameplay when it fits, but keep the top reachable for content that genuinely exceeds the viewport.
- Run the rendered layout regression in `tests/gameplay-layout.test.js` after gameplay layout changes.

## Character sprite visual review (required)

- Inspect the final composited runtime sprite, not only its source master or an
  isolated overlay, before accepting any character-art change.
- Review the sprite at native 512px and at the app's actual companion size.
  File hashes, deterministic rebuilding, alpha checks, and pixel measurements
  do not establish visually correct composition.
- For pose-specific overlays such as Ido's shirt logo, confirm placement against
  the current body and clothing before refreshing the sprite lock. Never reuse
  coordinates from another reaction or an earlier body image without visual
  confirmation.
- Keep an explicit regression assertion for an approved pose-specific overlay
  placement so a later rebuild cannot silently restore a rejected position.

## Character artwork approval and cost control (required)

- Assistant visual review is not user approval. Do not describe character art
  as approved unless the user has explicitly approved that exact final image.
- Approval is scoped to what the user saw. If a logo, mask, crop, transparency
  treatment, resize, or other overlay is added afterward, the resulting final
  composite is unapproved until the user sees and approves it.
- Before refreshing the sprite lock, committing, pushing, or merging subjective
  character artwork, show the exact final runtime composite at native 512px and
  actual companion size and wait for explicit approval. An instruction to add
  an unseen overlay and publish does not waive this final-composite checkpoint.
- Make at most one image-generation call before showing the result. Do not spend
  another generation call on revisions unless the user explicitly requests it
  after seeing the previous output.
- When the user rejects an artwork or says to stop, stop that approach. Do not
  promote the rejected image, reuse its pixels, or generate another variant in
  the same turn unless the user explicitly reverses that instruction.
- Do not invent or tighten aesthetic pixel metrics to force a subjective result.
  Add hashes, coordinates, or geometry regressions only after the user approves
  the final composite; those checks preserve approval but cannot create it.
- If the available image tool cannot reliably satisfy identity, anatomy, or
  pixel-style constraints, say so before further generation spending and offer
  a deterministic edit or human-art workflow instead of continuing by trial.

## Project structure

- `index.html` — app entry point (no build step; open directly or via local HTTP server). Loads every module/data file as a `<script defer>`.
- `app.js` — bootstrap glue: wires the `app/` modules together onto the shared runtime.
- `app/` — application logic split into modules. Core: `bootstrap-runtime.js`, `bootstrap-data.js` (i18n strings), `constants.js`, `utils.js`, `hebrew.js`, `i18n.js`, `storage.js`/`persistence.js`, `session.js`, `data.js`, `content-sources.js`, `controller.js`, `ui.js`, `audio.js`, `speech.js`. Character and mission layer: `character.js`, `character-data.js`. Game modes: `word-match.js`, `verb-match.js`, `match-engine.js`, `sentence-bank.js`, `binyan-board.js`, `adv-conj.js`, `prepositions.js`, `handwriting.js`/`handwriting-core.js`, `abbreviation.js`.
- `styles.css` — all styling
- Data files: `vocab-data.js` (vocabulary), `hebrew-verbs.js` (verb conjugations), `abbreviation-data.js` (abbreviations), `sentence-bank-data.js` (sentences), `verb-game-data.js` (binyan game), `hebrew-idioms.js` (idioms), `preposition-data.js` (prepositions), `handwriting-data.js` (letterforms)
- `tests/` — Node built-in test suite (`npm test`)
- `docs/` — `project-rules.md` (this file), `product-roadmap.md`, `character-gameplay-strategy.md`, `sentence-bank-authoring.md`
- `task-log.md` — shared AI task log (Claude Code + Codex)

## CI

- `.github/workflows/test.yml` runs `npm test` on every pull request.
- `.github/workflows/deploy-pages.yml` runs the same suite as a `test` job that
  the `deploy` job depends on, so a red suite cannot reach production.
- Both guard against silent test-discovery failure by asserting at least 400
  tests ran.

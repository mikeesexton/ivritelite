# Codex Agent — Project Instructions

## Task Log (required)

`task-log.md` is a shared log maintained by all AI agents (Claude Code and ChatGPT Codex).

**At the end of every task session, append a new entry to `task-log.md`** using the format defined at the top of that file. An entry must include:

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

## Gameplay viewport floor (required)

- Gameplay UI changes must keep all active, answer, and feedback states usable without vertical scrolling or footer overlap at 360×640 CSS pixels.
- Keep action toolbars on one row with touch targets at least 44px high where the mode calls for a compact toolbar.
- When space is tight, compact redundant whitespace, gaps, and flexible media/canvas areas before reducing Hebrew display text or touch-target size.
- Preserve safe vertical centering: center gameplay when it fits, but keep the top reachable for content that genuinely exceeds the viewport.
- Run the rendered layout regression in `tests/gameplay-layout.test.js` after gameplay layout changes.

## Sentence-bank authoring (required)

Before adding or rechunking sentence-bank content, read
[`docs/sentence-bank-authoring.md`](docs/sentence-bank-authoring.md).

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

## Project structure

- `index.html` — app entry point (no build step; open directly or via local HTTP server). Loads every module/data file as a `<script defer>`.
- `app.js` — bootstrap glue: wires the `app/` modules together onto the shared runtime.
- `app/` — application logic split into modules. Core: `bootstrap-runtime.js`, `bootstrap-data.js` (i18n strings), `constants.js`, `utils.js`, `hebrew.js`, `i18n.js`, `storage.js`/`persistence.js`, `session.js`, `data.js`, `content-sources.js`, `controller.js`, `ui.js`, `audio.js`, `speech.js`. Game modes: `word-match.js`, `verb-match.js`, `match-engine.js`, `sentence-bank.js`, `binyan-board.js`, `adv-conj.js`, `abbreviation.js`.
- `styles.css` — all styling
- Data files: `vocab-data.js` (vocabulary), `hebrew-verbs.js` (verb conjugations), `abbreviation-data.js` (abbreviations), `sentence-bank-data.js` (sentences), `verb-game-data.js` (binyan game), `hebrew-idioms.js` (idioms)
- `tests/` — Node built-in test suite (`npm test`)
- `task-log.md` — shared AI task log (Claude Code + Codex)

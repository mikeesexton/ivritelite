# Claude Code — Project Instructions

## Start here

**[`docs/project-rules.md`](docs/project-rules.md) is the single source of truth
for this repo.** Read it before your first edit of a session.

Add or change a rule *there*, never in this file alone. `CLAUDE.md` and `AGENTS.md`
are kept byte-identical below their title line by `tests/agent-docs-parity.test.js`.
The two files drifting apart is what allowed sentence-bank content to be authored
for months without the Hebrew pointing rule, and code to be pushed without a
cache-bust.

## Non-negotiables

The rules most often violated in practice. Full text, and the rest of the rules,
in [`docs/project-rules.md`](docs/project-rules.md).

1. **Task log.** Append an entry to `task-log.md` at the end of *every* session,
   including documentation-only ones.
2. **Cache-busting.** Every `.js`/`.css` file you edit needs its `?v=` bumped in
   `index.html` in the same commit — data files included. A change does not go
   live without it, and because exports use `x = x || function`, a stale cached
   module silently *wins* over the new one.
3. **Hebrew pointing.** Plain column is *ktiv male*, pointed column is *ktiv
   chaser*. Mark each vowel once: never keep the helper ו/י **and** add the mark.
   The pointed form must never contain a letter absent from the plain form.
4. **Conservative edits.** No refactors, features, abstractions, or comments
   beyond what was asked. Read a file before editing it.
5. **Run `npm test`** before and after non-trivial changes and record the result
   in the log.

## Before specific kinds of work

| If you are touching… | Read first |
|---|---|
| sentence-bank content | `docs/project-rules.md` → Sentence-bank authoring, then `docs/sentence-bank-authoring.md` |
| any gameplay surface | `docs/project-rules.md` → Gameplay viewport floor (360×640, no vertical scroll) |
| character art or sprites | `docs/project-rules.md` → Character sprite visual review, and artwork approval |
| any data file | `docs/project-rules.md` → Hebrew pointing convention |
| routing content to a character | `docs/project-rules.md` → Content routing (a shelf, a register bank, or `verbIds` — never a `character` field) |
| product direction | `docs/product-roadmap.md`, `docs/character-gameplay-strategy.md` |

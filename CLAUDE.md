# Claude Code — Project Instructions

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

## Cache-busting (required before push — do not skip)

`index.html` loads every `.js`/`.css` file with a `?v=YYYYMMDD<letter>` query string (e.g. `hebrew-verbs.js?v=20260704a`). GitHub Pages and browsers cache by full URL, so **a change won't go live until its `?v=` string is bumped**, even after the code is merged.

- For **every** `.js` or `.css` file you edit, bump that file's `?v=` in `index.html` in the same commit. Data files (`hebrew-verbs.js`, `vocab-data.js`, etc.) count too — they're easy to forget because they're not in `app/`.
- Use today's date plus a letter (`20260704a`, then `b` for a second push the same day).
- Before pushing, verify: every path in your diff that is `.js`/`.css` has a matching `?v=` bump in `index.html`.

## Project structure

- `index.html` — app entry point (no build step; open directly or via local HTTP server). Loads every module/data file as a `<script defer>`.
- `app.js` — bootstrap glue: wires the `app/` modules together onto the shared runtime.
- `app/` — application logic split into modules. Core: `bootstrap-runtime.js`, `bootstrap-data.js` (i18n strings), `constants.js`, `utils.js`, `hebrew.js`, `i18n.js`, `storage.js`/`persistence.js`, `session.js`, `data.js`, `content-sources.js`, `controller.js`, `ui.js`, `audio.js`, `speech.js`. Game modes: `word-match.js`, `verb-match.js`, `match-engine.js`, `sentence-bank.js`, `binyan-board.js`, `adv-conj.js`, `abbreviation.js`.
- `styles.css` — all styling
- Data files: `vocab-data.js` (vocabulary), `hebrew-verbs.js` (verb conjugations), `abbreviation-data.js` (abbreviations), `sentence-bank-data.js` (sentences), `verb-game-data.js` (binyan game), `hebrew-idioms.js` (idioms)
- `tests/` — Node built-in test suite (`npm test`)
- `task-log.md` — shared AI task log (Claude Code + Codex)

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

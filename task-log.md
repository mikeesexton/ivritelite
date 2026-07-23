# Ulpango Task Log

This file is the shared development log for the Ulpango Hebrew language-learning app.
It is maintained by all AI agents working on this project (Claude Code and ChatGPT Codex).
Every agent must append an entry here at the end of every task session, no matter how small.
Each entry records what was requested, what changed, what was tested, and what to watch for.

---

### 2026-07-20 EDT — Add Tel Aviv gay-slang terms across sentences, conjugation, and translation

**Requested:** Follow-up to the וודג' batch — add more authentic Tel Aviv gay-slang terms not already in the app. User selected (with per-term instructions): פאלש, אוחצ'ה, הורס (×2 sentences, + Conjugation + Translation Match), דוב (×2 sentences, explicitly NOT Translation Match), קוקיצה, מלרלר (+ Conjugation), פאטוץ'.

**Research:** Terms and glosses drawn from Hebrew LGBTQ slang lexicons (Wikipedia סלנג להט"בי, Ruvik Rosenthal, Mako gay dictionary): פאלש = fake/phony (Yiddish falsch); אוחצ'ה = camp "girl!/queen" (Arabic "sister"); הורס = "killing it" (lit. "destroys"); דוב = "bear"; קוקיצה = "twink" (from "cookie"); מלרלר = to chatter/gossip nonstop. Skipped explicit/crude terms (בור, חור, קרוזינג, שטריך). להרוס conjugation verified against Pealim (pealim.com/dict/477-laharos); מלרלר derived from the regular quadriliteral-piel template (לעדכן/לתכנן).

**Files changed:**
- `sentence-bank-data.js` — added 9 `buildExpandedSentence(...)` entries to `SENTENCE_EXPANSION_REQUESTED` (`colloquial_falsh_01`, `colloquial_ochtcha_01`, `colloquial_hores_01/02`, `colloquial_dov_01/02`, `colloquial_kukitza_01`, `colloquial_melarler_01`, `colloquial_patutch_01`), full niqqud/tokens/distractors/notes. (`__build` already `20260720a` from the וודג' batch, same day.)
- `hebrew-verbs.js` — added 2 curated verbs to the `buildRequestedVerbEntries` batch: `advanced-verb-laharos` (להרוס, paal, irregular pe-guttural, "to destroy") and `advanced-verb-lelarler` (ללרלר, piel quadriliteral ל-ר-ל-ר, regular, "to chatter nonstop"), each with authoritative present/past/future (21 forms). Bumped `__build` → `20260720a`.
- `vocab-data.js` — appended one Translation Match card at the end of `conversation_glue` (id `conversation_glue-097-killing-it-destroys-slang`): `["killing it", "הורס", "הוֹרֵס", { idEnglish, translationQuizDistractors }]`. Gloss kept single/slash-free and globally unique to satisfy uniqueness guardrails. Bumped `__build` → `20260720a`.
- `index.html` — cache-busted `hebrew-verbs.js` and `vocab-data.js` → `?v=20260720a` (sentence-bank already bumped).
- `tests/sentence-bank-data.test.js` — count guardrails: total 453→462, colloquial 154→163.
- `tests/hebrew-verbs.test.js` — seed verb count 136→138.
- `tests/vocab-data.test.js` — vocabulary length 1511→1512, translationQuiz-available 1457→1458.

**Behavior changed:** 9 new slang sentences appear in Sentences, Shema, and Handwriting (letter counts 18–31, all within the 6–34 gate; apostrophes in אוחצ'ה/פאטוץ' skipped in handwriting). להרוס and ללרלר are now conjugatable in the Conjugation game (21 forms each, authoritative). הורס ("killing it") is now a Translation Match card. דוב was deliberately kept out of Translation Match (sentences only).

**Tests run:** `npm test` — 264 pass, 0 fail (after updating the count guardrails above; one nuance-audit test also required adding "already" to the מלרלר English to surface the כבר nuance). Browser verification on the dev server: builds all `20260720a`; sentence bank 462 (9 new), vocab 1512 (הורס card present), conjugation deck seedCount 138 with להרוס and ללרלר each exposing 21 authoritative pointed forms; Handwriting renders a דוב sentence correctly; no console errors.

**Risks / regressions to check:** (1) Shema TTS pronunciation of slang loanwords (פאלש, אוחצ'ה, קוקיצה, מלרלר, פאטוץ') — verify by ear on the deployed site. (2) Adult slang appropriateness for the audience. (3) מלרלר is a slang/reduplicated verb; its conjugation follows the regular quadriliteral-piel pattern but is not dictionary-attested — confirm the forms read naturally to a native speaker. (4) הורס appears both as a Translation Match card ("killing it") and as a conjugatable verb להרוս ("to destroy"); the surface forms differ, but confirm this dual presence is desired.

### 2026-07-20 EDT — Add three וודג' slang sentences

**Requested:** Add three fun, authentic-sounding practice sentences using the LGBTQ+ Hebrew slang term וודג' so it appears in the Sentences, Shema (listening), and Handwriting modes. Confirm the meaning/gloss (deferred to Claude), and assess whether the handwriting game could trace the geresh (apostrophe) in ג'.

**Research:** וודג' / ودج' is gay slang for "face / looks," borrowed from Arabic *wajh* (وجه, "face"). Confirmed via Ruvik Rosenthal's LGBTQ lexicon ("וֶודג'. פנים. בעקבות ערבית") and the Mako gay-slang glossary. Masculine noun, used campily to admire or shade someone's looks. (One machine gloss said "behind" — an error; etymology and every dedicated glossary say *face*.) Spelling chosen with the user: double-vav וודג' with a plain ASCII apostrophe (matches the app's existing convention for ג'/צ' words). Geresh tracing deliberately skipped per user.

**Files changed:**
- `sentence-bank-data.js` — appended three `buildExpandedSentence(...)` entries to `SENTENCE_EXPANSION_REQUESTED` (`colloquial_vodge_01/02/03`, category `colloquial`, difficulty 2), each with full niqqud, token pairs, distractors, and a slang note. Bumped internal `__build` to `20260720a`.
- `index.html` — cache-busted `sentence-bank-data.js?v=20260718c` → `?v=20260720a`.
- `tests/sentence-bank-data.test.js` — updated the two intentional count guardrails for the three new colloquial entries: total 450→453 (and the matching id-uniqueness / notes-present assertions) and category `colloquial` 151→154.

**Behavior changed:** Three new וודג' sentences are now in the sentence bank. They appear automatically in Sentences and Shema (same deck), and in Handwriting (letter counts 15/25/27, within the 6–34 gate). In handwriting the ASCII apostrophe renders inline but is not traceable (no stroke data) and is skipped cleanly, so ו‑ו‑ד‑ג of הוודג' are traced.

**Tests run:** Baseline `npm test` — 264 pass, 0 fail. After adding entries, two count-guardrail tests failed as expected (453 vs 450; colloquial 154 vs 151); updated those expectations. Final `npm test` — 264 pass, 0 fail. Browser verification on the local dev server: build stamp `20260720a`, 453 sentences, all three entries loaded; Sentences mode renders working token-build questions; Handwriting round for "יש לו וודג' של דוגמן" renders correctly and traces 25 letters (apostrophe skipped, `letterformId: null`); no console errors.

**Risks / regressions to check:** Shema TTS *pronunciation quality* of the loanword וודג' was not verifiable programmatically — confirm by ear on the deployed site that the listening audio pronounces it acceptably (Hebrew TTS on slang loanwords is a known soft spot). Content is adult slang; confirm it's appropriate for the app's audience. If the single-vav spelling ودג' is ever preferred, it would need to be changed in all three entries.

### 2026-07-19 00:05 EDT — Publish handwriting results and iPhone feedback fixes

**Requested:** Commit and deploy the completed handwriting results, Conjugation exclusion, and iPhone feedback fixes.

**Files changed:**
- `task-log.md` — records publication. The deployed feature commit contains `app/ui.js`, `hebrew-verbs.js`, `index.html`, `styles.css`, the three related regression files, and the preceding task-log entries.

**Behavior changed:** The three-column handwriting results, Conjugation exclusion for להתקיים, and stable short-screen handwriting canvas are now published on GitHub `main` through pull request #42 and deployed to GitHub Pages.

**Tests run:** Pre-push `npm test` — 263 pass, 0 fail. `git diff --cached --check` — pass. GitHub reported PR #42 clean and mergeable; squash merge commit `692be890c0bfaea67ad274564ba538e8f215a483` was created successfully. Pages workflow run `29672763169` completed successfully. Live-site verification confirmed `styles.css?v=20260718m`, `hebrew-verbs.js?v=20260718a`, and `app/ui.js?v=20260718g`; the served stylesheet contains the three-column letter grid and no longer contains the feedback-dependent handwriting shrink selector.

**Risks / regressions to check:** Recheck the handwriting feedback transition on the original physical iPhone/Safari device after refreshing past the old cached stylesheet. No publication blockers remain.

### 2026-07-19 00:01 EDT — Stabilize handwriting canvas during feedback

**Requested:** Diagnose the iPhone Safari recording in which the handwriting box shrank after an answer was processed, determine whether GitHub Pages was serving an earlier branch, and fix the jump if appropriate.

**Files changed:**
- `styles.css` — removed the short-screen `:has(.feedback-tray:not(.hidden))` rule that changed the canvas from `39svh` to `29svh` only while feedback was visible; the existing stable short-screen canvas size remains.
- `tests/gameplay-layout.test.js` — captures the rendered canvas dimensions before and during visible error feedback at 360×640, asserts they remain identical, and retains the existing no-scroll and toolbar checks.
- `index.html` — cache-busts the updated stylesheet to `20260718m`.
- `task-log.md` — records the diagnosis and fix.

**Behavior changed:** On short iPhone/Safari viewports, processing a handwriting answer no longer shrinks and then re-expands the drawing box. Feedback still appears normally, and the complete feedback state remains usable without gameplay scrolling at the 360×640 viewport floor. Other modes and larger viewports are unchanged.

**Tests run:** Baseline from the immediately preceding completed change: `npm test` — 263 pass, 0 fail. First rendered check after removing the rule completed all geometry assertions but hit the intermittent Chrome profile cleanup race (`ENOTEMPTY`); immediate `node --test tests/gameplay-layout.test.js` rerun — 1 pass, 0 fail. After adding the stable-size regression, rendered check — 1 pass, 0 fail. Full `npm test` — 263 pass, 0 fail. Final rendered check with an explicit visible-feedback precondition — 1 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** The deterministic rule seen in the recording is removed and the exact short-screen state is rendered in Chrome, but physical iOS Safari was not available in the local test environment; recheck once deployed. Very unusually long localized feedback remains the main short-screen stress case, though the current Hebrew retry feedback fits the no-scroll regression.

### 2026-07-18 23:50 EDT — Remove להתקיים from Conjugation

**Requested:** Remove להתקיים from the Conjugation game.

**Files changed:**
- `hebrew-verbs.js` — added the stable `advanced-verb-lehitkayem` source ID to a Conjugation-only exclusion set, applied that gate before study-item expansion, and bumped the data build marker. The curated source forms and general availability remain intact.
- `tests/hebrew-verbs.test.js` — replaced the old expectation that להתקיים appears in the Conjugation deck with a regression proving the source record/forms remain available while no matching Conjugation study item is produced.
- `index.html` — cache-busts the updated Hebrew verb data module.
- `task-log.md` — records this follow-up.

**Behavior changed:** Conjugation no longer asks any להתקיים / “to take place” forms. Translation Match, sentence content, and the separate Binyanim ק־י־ם material are unchanged.

**Tests run:** Baseline `npm test` — 262 pass, 0 fail. First focused `node --test tests/hebrew-verbs.test.js` — 31 pass, 1 fail; it exposed that authoritative forms bypass the generic blocked-mode check. After moving the exclusion to the stable-ID study-item gate, focused rerun — 32 pass, 0 fail. Full live-data audit — 157 Conjugation study items and zero להתקיים matches. Final `npm test` — 263 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** The exclusion is deliberately keyed to the stable verb source ID, so future renaming of that ID must update the set and its test. The actual app vocabulary was included in the live-data audit to confirm no migrated duplicate reintroduces the verb.

### 2026-07-18 23:47 EDT — Three-column handwriting letter results

**Requested:** At the end of the handwriting game, display the per-letter mistake and correct-answer results in three columns instead of one, without making longer result types unsafe.

**Files changed:**
- `app/ui.js` — applies a handwriting-only `results-mistakes--letter-grid` modifier to the combined per-letter results container; other game summaries retain their existing layouts.
- `styles.css` — defines the handwriting results as three equal, shrink-safe columns and keeps section headings/empty notes spanning the full grid width.
- `tests/app-progress.test.js` — adds a summary-rendering regression proving handwriting receives the letter-grid modifier and retains every result row.
- `tests/gameplay-layout.test.js` — renders a representative handwriting summary at 360×640 and verifies three computed columns, no horizontal overflow, usable row widths, and full-width section headings.
- `index.html` — cache-busts the updated stylesheet and UI module.
- `task-log.md` — records this task.

**Behavior changed:** Handwriting results now show mistake and correct-answer letter cards in three columns at every supported width, including narrow mobile. Results for translation, abbreviation, sentences, conjugation, and other games are unchanged.

**Tests run:** Baseline `npm test` — 261 pass, 0 fail. Focused `node --test tests/app-progress.test.js` — 124 pass, 0 fail. First standalone `node --test tests/gameplay-layout.test.js` run completed the layout assertions but failed during the pre-existing Chrome profile cleanup race (`ENOTEMPTY`); immediate rerun — 1 pass, 0 fail. Final `npm test` — 262 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** Three columns intentionally remain fixed for handwriting even on 360px screens because letter names are short; the rendered check measured at least 85px per card with no overflow. If letter result rows later gain longer explanatory content, revisit the handwriting-only column rule rather than changing other summaries.

### 2026-07-18 14:21 EDT — Implement Priority 1 Hebrew word-order alternates and future authoring rule

**Requested:** Implement the audit's approved Priority 1 Hebrew reorderings; accept sentence-final `כבר` in `colloquial_96`; conservatively add other clearly neutral third orders; and make word-order review a required part of constructing future sentence-bank rows.

**Files changed:**
- `sentence-bank-data.js` — added 25 fully pointed, same-tile Hebrew alternate variants across the 19 approved Priority 1 sentences. This includes all 19 audited suggestions plus six conservative third placements in `professional_06`, `professional_51`, `professional_57`, `everyday_105`, `colloquial_96`, and `colloquial_133`; bumped the sentence-bank build marker to `20260718c`.
- `tests/sentence-bank-data.test.js` — added an exact regression registry and test covering all 25 approved variants, including pointed/plain alignment, token-count and token-multiset parity, and sentence-frame buildability.
- `docs/sentence-bank-authoring.md` — made construction-time word-order review mandatory, with specific checks for adverbials, negation, movable clauses, third placements, focus/scope exclusions, distractor implications, and word-order × gender combinations.
- `AGENTS.md` — surfaced the same mandatory word-order rule in the repository instructions every future agent reads before sentence authoring.
- `index.html` — cache-busted `sentence-bank-data.js` to `?v=20260718c`.
- `generated/sentence-word-order-audit-2026-07-18.md` — marked Priority 1 implemented, recorded the six third placements, and refreshed coverage counts.
- `task-log.md` — recorded this implementation.

**Behavior changed:** English-to-Hebrew Sentence Builder now accepts the 25 newly authored neutral orders. In particular, `colloquial_96` accepts all three reviewed placements: `האוכל כבר היה קר`, `האוכל היה כבר קר`, and `האוכל היה קר כבר`. Shema/listen continues to exclude authored alternates. No scoring or general comparator logic changed.

**Tests run:** Baseline `npm test` — 254 pass, 0 fail. Focused `node --test tests/sentence-bank-data.test.js` after data changes — 28 pass, then 29 pass after adding the new regression. Final `npm test` — 255 pass, 0 fail. Runtime audit — 450 entries, 115 sentences with Hebrew alternates, 130 Hebrew variants total, including 72 pure reorder variants across 65 sentences. `git diff --check` — pass.

**Risks / regressions to check:** The six extra orders were intentionally limited to neutral, common placements; more marked topicalization, scope-changing orders, and merely grammatical permutations remain rejected. Future authors still need human Hebrew judgment—the mandatory checklist prevents omission but cannot automate equivalence. No general flexible-modifier expansion was made, so its existing neighbor-blind and Shema behavior is unchanged.

### 2026-07-18 13:39 EDT — Hebrew sentence word-order acceptance audit

**Requested:** Verify the current sentence-translation acceptance path and Claude's notes, scan all 450 sentence-bank rows for legitimate Hebrew reorderings that are currently false-rejected, produce a conservative prioritized human-review list, and recommend whether to broaden automatic word-order tolerance. Report only; do not change gameplay or sentence content and do not bulk-author alternates.

**Files changed:**
- `generated/sentence-word-order-audit-2026-07-18.md` — added the read-only audit report: current coverage counts, exact grading-path map, 28 token-compatible proposed reorderings in two priority tiers, deliberately deferred focus-sensitive cases, risks in the current flexible-modifier rule, and a conservative authoring recommendation.
- `task-log.md` — recorded this report-only session as required by the repository instructions.

**Behavior changed:** None. No gameplay, sentence-bank data, tests, styles, cache versions, or runtime files changed.

**Tests run:** `npm test` — 254 pass, 0 fail. Programmatic audit — loaded 450 runtime entries; confirmed 96 sentences / 105 Hebrew variants with any Hebrew alternate, 47 pure reorder variants across 46 sentences, and all 28 report suggestions currently rejected while preserving the primary token multiset, token count, and sentence-frame order. `git diff --check` — pass.

**Risks / regressions to check:** The 28 suggestions are unpointed review proposals, not approved content; each still needs human Hebrew review and pointed alternate authoring. The scan intentionally favors precision over recall, so additional valid scope- or focus-sensitive orders remain outside this first tranche. The audit also found that the global adjacent-swap tolerance is neighbor-agnostic and applies in Shema/listen; broadening it would increase over-acceptance risk.

### 2026-07-18 — Sentences round 6: speaker/prompt overlap fix + מזמן word-order acceptance

**Requested:** (1) The Sentences speaker button still overlapped the prompt text (the flush-right Hebrew first line ran under the top-right speaker). (2) User flagged that the sentence "מזמן לא התראינו, מת לראות אותך!" should accept the equally-idiomatic order "לא התראינו מזמן, …" (temporal adverb מזמן may sit before or after the verb phrase) — their valid answer was marked wrong.

**Change:**
- `styles.css` — `.lesson-shell.mode-sentence-bank .prompt-card.has-prompt-control .prompt-content-row` gained `margin-top: 0.85rem`, pushing the sentence text below the absolutely-positioned speaker (emoji centered + speaker inset stay in the top "header" band; text starts beneath). Scoped to `has-prompt-control` (Shema/`listen` returns a null speech payload so it never gets that class, and its `prompt-card--audio` content-row is separately collapsed) so only speaker-bearing prompts get the clearance.
- `sentence-bank-data.js` — `colloquial_85` gained two `hebrewAlternates`: "לא התראינו מזמן, מת לראות אותך!" (masc.) and its "מתה" feminine form, so all four order×gender combinations are accepted. Uses the existing alternate machinery (`getAcceptedAnswerVariants` + `isEquivalentSentenceTokenOrder`); no new tokens/distractors needed since the alternate reuses the same six target tokens (plus מתה, already a required distractor).
- `index.html` — cache busts: `styles.css` `?v=20260718a→b`, `sentence-bank-data.js` `?v=20260717a→b`.
- `tests/app-progress.test.js` — added "sentence builder accepts an alternate Hebrew word order for en2he questions": builds the reordered order and asserts it scores correct (complements the existing shema test that *rejects* written alternates in listen mode). The existing structural test (`tests/sentence-bank-data.test.js:744`) already validates the new alternates' niqqud/frame/length.

**Files changed:** `styles.css`, `sentence-bank-data.js`, `index.html`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** Sentences prompt: the speaker no longer overlaps the first line (text clears it by ~4px mobile / ~9px desktop, measured). The מזמן sentence now accepts both word orders in both genders. No other gameplay/content changes.

**Tests run:** `npm test`: 254 pass, 0 fail (was 253 + 1 new). Live on :3251 `?v=20260718b`: measured speaker-bottom vs text-top at 375px (42.6 vs 46.6, clears) and 1280px (45.5 vs 54.6, clears); confirmed the loaded `colloquial_85` now exposes the primary + 3 alternates; zero console errors.

**Risks / regressions to check:** (1) The 0.85rem top clearance is a fixed value tuned to the current speaker size (~2.1–2.28rem); if the speaker button size changes, re-check the clearance. (2) **Structural:** automatic word-order tolerance is still only a single adjacent swap of one of four intensifier tokens (די/לגמרי/ממש/מאוד); every other valid reordering (like מזמן) must be hand-authored as `hebrew_alternates` — see the discussion note below; broad coverage remains a manual, per-sentence effort.

### 2026-07-18 — In-game polish round 5: results-screen topbar/centering, Sentences prompt alignment, Shema box

**Requested:** (1) End-of-game results screens should follow the gameplay pattern — the game's name replaces "IvritElite" in the top banner, drop the "X Complete" header, and center "Nice job!" + the accuracy ring; apply to every game. (2) Sentences: Hebrew prompt sentences must be uniformly right-aligned and English left-aligned (a Hebrew prompt was rendering left / inconsistently); center the prompt emoji; give the speaker button breathing room instead of jamming it into the corner (like the Prepositions speaker). (3) Shema: remove the box around the emoji hint. Standing rule kept: authored content emoji untouched.

**Change:**
- `app/ui.js` — `renderShellChrome`: added a results branch so the topbar shows the plain game name during results too. Since `summary` stores no plain name, added a `SUMMARY_GAME_NAME_KEYS` map (`summary.game` → `game.*Name` i18n key) covering all 11 mode strings; title precedence is now gameplay `#modeTitle` → results `translate(game.*Name)` → `app.name` fallback.
- `styles.css` — **Results:** `.results-head` and `.results-praise` and `.results-performance` reverted from round-3 `start` to `center` (justify-items/text-align); `#resultsTitle { display: none }` drops the redundant "X Complete" header (the topbar carries the name; "Nice job!" stays). Ring geometry untouched; metrics/mistakes left as-is. **Sentences alignment (root cause: the prompt-text block shrank to `max-width:36ch` and hugged the flex `flex-start`, so short Hebrew sat left even though its text was RTL):** kept the readability cap and the pinned `text-align:start` / `justify-content:flex-start`; fixed *block position* with physical auto-margins — `.mode-sentence-bank .prompt-text.hebrew { margin-left:auto; margin-right:0 }` (block → right) and `...prompt-text.english-prompt { margin-left:0; margin-right:auto }` (block → left). Physical `margin:auto` is direction-independent so it's correct in EN and HE UI. **Emoji:** `.mode-sentence-bank .prompt-root-emoji { margin-inline:auto }` centers it (Sentences + Shema). **Speaker:** `.mode-sentence-bank .prompt-speech-btn` changed from flush (`top:0;right:0;inset-inline-end:0`) to `top:0.5rem; right:auto; inset-inline-end:0.5rem` (breathing room), and the reserved speaker gutter (`.has-prompt-control .prompt-content-row` padding-right) reduced to match padding-left at all three breakpoints (2.72→0.16rem, 2.04→0.04rem, 1.9→0.02rem) so right-aligned Hebrew reads flush. **Shema box:** `.lesson-shell.mode-sentence-bank .prompt-card.prompt-card--audio { border:0; background:none }` strips the box for the audio (listen) variant only.
- `index.html` — cache busts: `styles.css`, `app/ui.js` `?v=20260717d → 20260718a`.
- `tests/app-progress.test.js` — updated the three pinned `has-prompt-control … padding-right` assertions (2.72/2.04/1.9rem → 0.16/0.04/0.02rem); added a results-branch assertion that `#shellTopTitle` shows the plain game name ("Sentences" for `summary.game="sentenceBank"`). The pinned max-width / text-align / justify-content rules are unchanged (the auto-margin fix only adds rules).

**Files changed:** `app/ui.js`, `styles.css`, `index.html`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** Results screen now shows the game name in the top banner (no "X Complete" line) with a centered "Nice job!" and centered ring; metrics/mistakes unchanged. Sentences prompt: Hebrew always right-aligned, English always left-aligned, uniformly; emoji centered; speaker inset with breathing room and the sentence no longer indented from the reading edge. Shema emoji hint no longer sits in a box. No gameplay/scoring/data/persistence changes; drag/audio/match intact.

**Tests run:** `npm test` before: 253 pass. After code + updated/added assertions: 253 pass, 0 fail. Live check on :3251, `?v=20260718a`, zero console errors, night + paper themes: measured the sentence prompt block position — short Hebrew hugs right (gapRight ~0.6px), short English hugs left (gapLeft ~0.6px), uniform; emoji centered; speaker inset ~9px (was 0); results view shows centered praise+ring with `#resultsTitle` computed `display:none` and the topbar carrying the game name (also unit-asserted); Shema emoji box gone in both themes.

**Risks / regressions to check:** (1) Results topbar depends on the `summary.game → game.*Name` map; an unmapped/blank `summary.game` falls back to "IvritElite". (2) Sentences alignment relies on `.hebrew`/`.english-prompt` being present on `#promptText` (set by `renderPromptText`) plus physical auto-margins; the readability `max-width:36ch` cap is retained. (3) The speaker gutter reservation was removed — if a future longer speaker/control overlaps the first text line at very short viewports, restore a small padding-right. (4) `#resultsTitle` is display:none but still populated in JS (harmless); screen readers now rely on the topbar name + "Nice job!".

### 2026-07-18 — In-game polish round 4: game title in the topbar, per-game prompt alignment + tip cleanup

**Requested:** Refine the round-3 in-game screens: (1) during gameplay the game's name should replace "IvritElite" in the top banner, for every game (user chose to keep the ע logo); (2) re-center most in-game prompts (round 3 over-applied start-alignment) — Conjugation, Conjugation+, Prepositions, Binyanim, Shema controls + emoji, Handwriting buttons; (3) the Sentences prompt should sit in a distinct box, right-aligned for Hebrew prompts / left for English, separate from the answer space; (4) remove clutter: the idle "Match the pairs" prompt and the "select the Hebrew…" hint from Vocabulary/Abbreviation, and the "drag answer blocks…" tip from Sentences/Shema — leaving all functionality intact. Standing rule kept: authored content emoji untouched.

**Change:**
- `app/ui.js` — (A) `renderShellChrome`: during gameplay (`gameplayActive`) `#shellTopTitle` now shows the current game name (reused from `#modeTitle`, already set by `renderSessionHeader` before this runs; falls back to `app.name`); outside gameplay it stays "IvritElite". (B) `updateLessonShellModeState`: re-hide `#lessonTitleRow` (the mode-title line above the progress bar) during gameplay via the `hidden` class — reverts the round-3 un-hide, since the name now lives in the topbar; also added a new `mode-word-match` class (on `.lesson-shell` + `.prompt-card`, keyed off `isWordMatchMode()`) to distinguish Vocabulary/Abbreviation-match from Conjugation, which otherwise share `.mode-verb-match`.
- `app/sentence-bank.js` — removed the block that created/appended the `.sentence-drag-tip` (`renderSentenceBankBoard` serves both Sentences and Shema, so the tip is gone from both).
- `styles.css` — **Topbar-adjacent:** none (JS-driven). **Word-match cleanup:** `.prompt-card.mode-word-match { display: none }` hides the whole idle prompt card (removes "Match the pairs" + the speech hint; no speech button is used in match modes, so nothing functional lost). **Center reverts:** base `.prompt-text`, `.prompt-text.hebrew`, and `.prompt-content-row` back to `center`/`center` (round-3 had `start`/`flex-start`) — this re-centers Conjugation+, Prepositions, and the Binyanim Hebrew prompt (שמר); `.mode-verb-match .prompt-text` + `.prompt-content-row` back to center (Conjugation); `.mode-verb-match .prompt-hint-note { display:none }` (Conjugation tip). **Prepositions:** `.prompt-card:not(.mode-sentence-bank) .prompt-label { text-align:center }` centers the English hint while Sentences' "BUILD THE HEBREW" stays start. **Sentences box:** `.lesson-shell.mode-sentence-bank .prompt-card` restored to a bordered card (`border:1px var(--line); border-radius:var(--radius); background:var(--prompt-bg); padding:0.7rem 0.8rem`), deleted the light-theme transparent override; directional alignment (`start` + `.hebrew`/`.english-prompt` direction) unchanged. **Shema:** `.shema-controls` back to `justify-content:center`; new `.prompt-card--audio .prompt-root-emoji { margin-inline:auto }` centers the audio-prompt emoji. **Handwriting:** `.handwriting-toolbar` → `center`, `.handwriting-stage` → `align-items:center`, `.prompt-text.handwriting-prompt` → `align-items:center`.
- `index.html` — cache busts: `styles.css`, `app/ui.js` `?v=20260717c → 20260717d`; `app/sentence-bank.js` `?v=20260705a → 20260717d`.
- `tests/app-progress.test.js` — re-pinned: gameplay test now asserts `#shellTopTitle` equals `#modeTitle` (game name, ≠ "IvritElite") during gameplay and `#lessonTitleRow` `hidden` = true (outside gameplay stays "IvritElite"); sentence-builder test asserts no `.sentence-drag-tip` is rendered (via `querySelectorAll(...).length === 0`, since the fake DOM's `querySelector` never returns null); base-layout test re-pinned to the new sentence prompt-card padding/border/background.

**Files changed:** `app/ui.js`, `app/sentence-bank.js`, `styles.css`, `index.html`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** During any game the top banner reads that game's name (ע logo kept) and the separate title line above the progress bar is hidden. Vocabulary/Abbreviation no longer show the "Match the pairs" box or the speech hint. Conjugation, Conjugation+, Prepositions, Binyanim, Shema (emoji + 🔊/🐢 controls), and Handwriting (Undo/Clear/Skip/Check) are centered. Sentences shows a distinct bordered prompt box, English left / Hebrew right, separate from the answer area. The "drag answer blocks…" tip is gone from Sentences and Shema. No gameplay, scoring, data, or persistence changes; drag/match/audio all intact.

**Tests run:** `npm test` before: 253 pass. After code + 4 re-pinned assertions: 253 pass, 0 fail. Live check served on :3251, `?v=20260717d`, zero console errors: at 375px in night + paper themes, drove Sentences, Vocabulary, Conjugation, Prepositions, Binyanim, Shema, and Handwriting — each shows the game name in the topbar, the described alignment, and the removed tips; light-theme Sentences box renders with border/bg from tokens.

**Risks / regressions to check:** (1) `mode-word-match` is a new shell/prompt-card class — any future CSS on `.mode-verb-match .prompt-card` should note that word-match cards are `display:none`. (2) The topbar now mirrors `#modeTitle` during gameplay; if a mode leaves `#modeTitle` empty the title falls back to "IvritElite". (3) Base prompt alignment is centered again — Sentences (and its answer rows/meta/word-bank, unchanged from round 3) is the lone start-aligned/directional exception; a future game added as `mode-standard` will inherit centered prompts. (4) Abbreviation-match and Conjugation+ were verified by shared-rule inference (they use the same word-match-hide and mode-standard-center paths as Vocabulary and Prepositions, both directly verified), not driven individually. (5) Results/Review/Settings alignment from round 3 is untouched.

### 2026-07-17 — Editorial redesign round 3: in-game screens made compact, sharp, and edge-aligned

**Requested:** Execute the approved "Hebrew Editorial" in-game redesign (plan from Fable). The home/settings/dialog chrome was already rethemed in round 2; the in-game screens still had the old DNA (oversized centered prompts, 15–18px radii, centered meta). Goal: compact density, sharp edges (radius scale down), and left/right (start/end) alignment instead of centering — matching the workshop mockups. Two standing rules honored: authored content emoji untouched (sentence-bank emoji, binyan root emoji, category emoji); conservative edits only.

**Change:**
- `styles.css` — **Sharp radius scale:** `--radius 10px→6px`; `.choice-btn` 18px→4px (cascades to `.match-card` and adv-conj/prepositions/abbreviation choices), `.sentence-token` 8px→4px, results/mistake/verb-mistake/review-stat/domain-card/wordbank tiles all →6px. Deleted the tablet/mobile media-query radius re-declarations for `.prompt-card` (18/17px), `.choice-btn` (16/15px), `.match-card` (15px) so the sharp base wins; changed the two media-query `.sentence-token` radii (8px, 11px) to 4px (spec tests pin these). **Edge alignment (logical `start`/`flex-start`, never hardcoded left/right — mirrors automatically for Hebrew content and Hebrew UI):** prompt card + label + hint + content-row + prompt-text (base and the verb-match / sentence-bank mode overrides), prompt-root-emoji (dropped auto-centering), sentence answer lines (EN+HE) + token bank + meta + drag-tip + shema-controls, results head/praise/performance/metric, review-section-title (+ deleted its RTL center duplicate), collapsible-toggle (left-aligns Settings/Review card titles), handwriting prompt/stage/toolbar. **Compact:** `.prompt-text` font clamp lowered, `.prompt-content-row` min-height reduced, prompt-card padding trimmed, `.choice-btn` 62→52px, `.match-card` 72→60px, `.next-btn` 62→54px (dropped the now-`none` `--next-shadow`), lesson-shell padding/gap trimmed, `.results-praise` shrunk to a compact start-aligned Frank Ruhl Libre 700 line (was giant centered Assistant 800). **Compact game header:** deleted `body[data-gameplay-active="true"] #lessonTitleRow { display:none }` and restyled `#modeTitle` to Frank Ruhl Libre 700 / 1.05rem (deleted its tablet+mobile size overrides) so a quiet serif mode title sits above the progress bar during play. **Binyan-board regression fix:** `.binyan-root-tile` reuses `.game-tile`, which round 2 converted to a TOC row with a `::before` Hebrew counter letter + `::after` arrow + border-bottom/transparent bg — the root picker was showing stray gold letters/arrows. Added `.binyan-root-tile::before,::after { content:none }` and gave the tile its own card look (border, 6px radius, `--card-bg`).
- `app/ui.js` — `updateLessonShellModeState`: removed the block that toggled the `hidden` class + `aria-hidden` on `#lessonTitleRow` during gameplay (and the now-unused `lessonTitleRow` local). The mode title is shown during play again.
- `index.html` — cache busts: `styles.css` and `app/ui.js` `?v=20260717b → 20260717c`.
- `tests/app-progress.test.js` — re-pinned 6 assertions to the NEW spec (not deleted): sentence-builder prompt/answer/meta test renamed to "edge-aligned" with its six center→start/flex-start asserts flipped; mobile + short-mobile sentence-token radius regexes 8px/11px→4px; review/settings collapsible-header test renamed "start-aligned" with collapsible-toggle + review-section-title center→start; gameplay-pill test now asserts `#lessonTitleRow` is NOT hidden during gameplay (was hidden).

**Files changed:** `styles.css`, `app/ui.js`, `index.html`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** In-game screens are denser with sharp 4/6px corners and edge alignment (English left, Hebrew right; mirrors in Hebrew UI). A compact serif mode title now shows above the progress bar during play (previously hidden). Binyan root picker renders as clean cards (no stray counter letters/arrows). Results screen has a compact start-aligned header/praise and sharp metric tiles; the accuracy ring is unchanged. No gameplay, data, scoring, or persistence changes.

**Tests run:** `npm test` before: 253 pass. After code + 6 re-pinned assertions: 253 pass, 0 fail. Live check served on :3251 (another chat held :3242), `?v=20260717c`, zero console errors on load and through a full session: verified at 375px mobile AND desktop, in night (default) and paper (light) themes — Vocabulary match (compact serif title above bar, sharp cards, prompt start-aligned; computed `text-align:start` / row `justify-content:flex-start` confirmed), Sentences (English prompt left, Hebrew answer slots + word bank right, 4px tokens, tips left-aligned), Binyanim root tiles (no stray letters/arrows, card look, authored content emoji intact), and Results (compact serif "Nice job!" start-aligned, sharp 6px metric tiles, ring intact — rendered via representative markup injected into the real `#resultsView`/`.results-*` DOM, since reaching results needs a full drag-based playthrough).

**Risks / regressions to check:** (1) Alignment/radius spec tests were re-pinned to the new design — any future test still asserting the old centered/large-radius values will conflict; assert `start`/`flex-start`/4px/6px. (2) `.binyan-root-tile` now opts out of the `.game-tile` row pseudo-elements (`content:none`) and reapplies a card border/bg — any future reuse of `.game-tile` for a non-row card needs the same opt-out. (3) Handwriting stage/toolbar/prompt were switched to `align-items/justify-content: flex-start` (canvas is `width:100%` so unaffected; toolbar + Hebrew line now left-align) — eyeball on a real device. (4) Results screen was verified via injected representative markup, not a live finished round; the CSS is what changed, but a real end-of-round pass on device is still worth a look. (5) `#modeTitle` is now a quiet 1.05rem serif; if any mode sets a very long title it wraps under the topbar row — spot-checked, looked fine.

### 2026-07-17 — Editorial redesign round 2: grouped settings with real controls, sentence-drag fix, gameplay dead-space fix, vocab gloss

**Requested:** From user review of the implemented redesign: (1) improve the awkward "to manage in time" gloss for להספיק; (2) un-bold the bold Hebrew game titles on the homepage (and suggest a more legible menu font to consider); (3) implement the "deeper" in-screen rework from the mockups (settings were still state-in-label pill buttons); (4) **bug:** in Chrome mobile emulation the Sentences game no longer let you drag tiles to particular slots, and the tile changed font mid-drag.

**Change:**
- `vocab-data.js` — להספיק gloss "to manage in time" → "to have time (to)".
- `styles.css` — `.game-tile-title` weight 700→500 (Frank Ruhl bold Hebrew was hard to read). **Sentence drag fixes:** `touch-action: none` on `.sentence-token` and `.sentence-slot` — root cause of the mobile-emulation drag failure was Chrome claiming the touch gesture for scrolling during the pre-activation window (the JS only calls `preventDefault` after an 8px activation threshold), after which drop targeting via `elementFromPoint` never resolves; with touch-action the browser never starts a scroll from a tile. Ghost font mismatch fixed: tokens/slots carry `.choice-btn.hebrew` (now serif), so `.sentence-drag-ghost.hebrew` gets matching Frank Ruhl 500 and the base ghost gets weight 600. **Dead space:** `body[data-gameplay-active="true"] #homeView.active { margin-block: 0 }` — game screens top-align instead of floating vertically centered (also reduces the scrollable overflow that fed the drag bug). New settings CSS: `.settings-groups`/`.settings-eyebrow`/`.settings-row(-icon/-label)`/`.settings-switch` (aria-pressed-driven knob)/`.settings-seg(-opt)` with pure-CSS active states keyed off `body[data-ui-lang]` and `body[data-theme]`; RTL-aware. `.section-head h2` and `.collapsible-toggle` recolored brand→ink; "Choose Your Lesson" left-aligned (right in Hebrew UI).
- `index.html` — settings panel rebuilt into four groups (Language & content / Audio / Appearance / More): rows with leading stroke icons, `data-i18n` label spans, trailing switch or EN|עב / Dark|Light segment, feedback link with chevron, destructive reset row. All ids preserved (controller listeners untouched). Cache busts: `vocab-data.js`, `app/bootstrap-data.js`, `app/i18n.js` → `?v=20260717b`.
- `app/ui.js` — renderNiqqud/Sound/Speech/ThemeToggle no longer overwrite `textContent` (which would destroy row structure); they set `aria-label`/`aria-pressed` (nikud gained aria-pressed) and disabled state only.
- `app/i18n.js` — applyLanguage sets langToggle `aria-label` only (was textContent).
- `app/bootstrap-data.js` — new keys en+he: `settings.groupLanguage/groupAudio/groupAppearance/groupMore`, `controls.darkModeShort/lightModeShort`.
- `tests/app-progress.test.js` — home-lessons-card header spec updated to left-aligned (+ he right-aligned assertion).

**Files changed:** `vocab-data.js`, `styles.css`, `index.html`, `app/ui.js`, `app/i18n.js`, `app/bootstrap-data.js`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** Settings page shows grouped rows with live toggle switches and segmented indicators (state no longer embedded in button labels; screen readers get it via aria-label/aria-pressed). Game screens start at the top of the viewport during play. Sentence tiles: touching a tile can no longer scroll the page (drag always wins); drag ghost matches tile typography. להספיק shows "to have time (to)".

**Tests run:** `npm test`: 253 pass, 0 fail (1 visual-spec test updated for the left-aligned header). Live on :3242 at 375px: synthetic TouchEvent drags verified into empty slots, middle blanks, and insert-before-occupied (fresh-node queries — earlier stale-node reads gave false negatives); computed `touch-action: none` on tiles; ghost computed font = Frank Ruhl 500 mid-drag; lesson top gap 69px (was centered); settings groups/switches/segments verified in EN+HE (segments track `data-ui-lang`/`data-theme` correctly, full RTL mirroring).

**Risks / regressions to check:** (1) `touch-action: none` means a swipe starting on a sentence tile no longer scrolls the page — on very long word banks users must scroll from whitespace; watch for complaints. (2) Toggle state is now visual (switch) + aria; any future test asserting toggle button text will fail — assert aria-pressed instead. (3) The welcome modal and reset-confirm flows untouched. (4) Menu font: titles now Frank Ruhl 500 — David Libre offered to the user as a more legible alternative for a future round. (5) On-device (real iPhone/iPad) drag re-test still recommended.

**Requested:** Implement the approved "Hebrew Editorial" visual direction from the design workshop (see the two mockup entries below): paper edition as the light theme, night edition (lamplight/leather, gilt accent) as the dark default; home screen as a table of contents indexed by Hebrew letters; chrome emoji replaced with inline SVG while authored content emoji stay untouched; dialog-hierarchy and settings-hierarchy fixes.

**Change:**
- `styles.css` — token overhaul: `:root` = night (`--paper #16130D`, `--ink #EAE3D3`, `--brand #C9A54D` gilt, hairlines `#363023`), `body[data-theme="light"]` = paper (`#FAF8F3`, ink `#1D1B16`, indigo `--brand #2C3F77`, gold marginalia `--gold #A8842C`); new `--brand-ink` token for text-on-accent (fixes previously illegible dark-on-indigo active chips). All gradient surface tokens flattened to solid colors; ambient drift blobs, backdrop blurs, text/icon glows, fire-gradient progress bar (now flat `--brand` fill, streak tiers = brightness steps), and per-tile hover colors removed. Old hardcoded gold/blue rgba values migrated wholesale (`244,196,48→201,165,77`, `0,56,184→44,63,119`). Radius scale: `--radius 18px→10px`, buttons 14→8px. Typography: h2/dialog headings + game-tile titles → Frank Ruhl Libre 700; Hebrew content (`.prompt-text.hebrew`, `.choice-btn.hebrew`, `.match-card.hebrew`, intro bubbles) → Frank Ruhl Libre; Heebo dropped entirely. Home lesson grid + in-lesson game picker converted to hairline list rows with CSS-counter Hebrew enumerators (`counter(lesson, hebrew)` — renumbers automatically when the speech-gated Shema tile is hidden) and direction-aware arrows. Settings list → single bordered list, left-aligned rows (RTL-aware), destructive rows in `--error`; light-theme-specific override blocks deleted wherever tokens now cover both themes.
- `index.html` — removed the 9 home-tile emoji spans and the game-picker PNG icon spans; ⏱️/🔥 stat pill and both 🏠 buttons → inline stroke SVGs; leave-game dialog buttons swapped (Keep Playing = `accent`, Lose Progress = `quiet danger-quiet`); Heebo removed from the Google Fonts link; cache busts `styles.css?v=20260717b`, `app/ui.js?v=20260717b`.
- `app/ui.js` — `HOME_BUTTON_ICON` SVG const (renderHomeButton now sets innerHTML, was 🏠 textContent); game-mode analytics cards use Hebrew letters (ב ד ה ז ח) with a `letter` flag styled via `.domain-letter` (was 🧩🏃✂️🔗🌳); score line rendered as `✓ n` / `✗ n` spans (`.score-good`/`.score-bad`, was ✅/❌ emoji); trouble-list note ❌→✗. Content emoji untouched: sentence-bank `emoji` fields, binyan-board root emoji (`promptRootEmoji`), category/domain emoji in bootstrap-data, Shema 🔊/🐢 button labels.
- `tests/app-progress.test.js` — updated the 5 visual-spec tests to pin the new design: analytics glyph/score assertions (letters + span structure — the fake DOM's `textContent` doesn't aggregate children), mobile sentence-token radius 12→8px, progress-bar spec rewritten (flat `var(--brand)` fill, no `::after`, tier-4 brightness), RTL fill assertion no longer expects the 270deg fire gradient.

**Files changed:** `styles.css`, `index.html`, `app/ui.js`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** Entire app is rethemed in both themes (dark remains the default). Home and in-lesson picker are letter-indexed lists instead of tile grids (same buttons/ids — no logic changes). Leave-game dialog: primary styling now on "Keep Playing". Analytics mode cards show Hebrew letters and tinted ✓/✗ counts. No gameplay, data, or persistence changes.

**Tests run:** `npm test` before: 253 pass. After ui/test updates: 253 pass, 0 fail. Live check on :3242 (`?v=20260717b`): no console errors; verified night home/match/dialog/settings and paper home/settings at desktop width, paper home at 375px (no horizontal overflow; `document.scrollWidth` = 375). A headless-Chrome capture suggested the welcome dialog overflows at 390px but this did not reproduce in a real browser (no wide elements found) — treated as a headless artifact.

**Risks / regressions to check:** (1) Analytics letters are the canonical order counting Shema (ד=Conjugation); if Shema is hidden on a speech-less browser the home TOC renumbers (ג=Conjugation) and won't match analytics letters — cosmetic, edge-case. (2) The in-lesson game picker letters restart at א and don't match home letters (different subset) — acceptable as its own index, revisit if confusing. (3) `assets/icon-*.png` tiles and the Heebo font are now unused (assets still in repo). (4) Sentence-builder and binyan-board screens were rethemed via tokens but only spot-checked — worth an iPad pass, especially selected/drag states (now indigo/gilt instead of sky-blue) and the handwriting canvas. (5) On-device check of the welcome dialog at narrow widths given the headless anomaly. (6) Users' stored theme prefs persist; new visitors get night by default as before.

**Requested:** From review of the three-direction workshop mockup: (1) **Hebrew Editorial is the chosen direction**, pending a look at its dark mode before implementation; (2) brainstorm a tenth game (TOC layout suggests א–י) — ideas only, and **no tenth row may appear in the UI until the game is designed**; (3) the proposed nikud SVG icon looked janky — redraw the alef; (4) use the existing `assets/logo-dark.png` ע tile in night mode, don't invent a new dark-mode mark; (5) drop the "Index" eyebrow on the editorial home screen.

**Change (mockup only, outside the repo):** Extended the scratchpad workshop mockup (`ivritelite-redesign-workshop.html`, served at `http://localhost:8901/…`): the Hebrew Editorial tab now shows **Paper edition** (light) and **Night edition** (dark) rows of all four screens. Night token set = lamplight/leather inverse of paper: bg `#16130D`, surfaces `#1E1A12`/`#282216`, parchment ink `#EAE3D3`, hairlines `#363023`, gold `#C9A54D` promoted from marginalia to working accent (`--t-accent-ink #211A06`), good `#8FAE72`, bad `#C97B6B`. Night topbar uses the real downscaled `assets/logo-dark.png` as a data URI. Removed the "Index" eyebrow from the editorial home (both editions); no tenth TOC row anywhere. Redrew the `#i-nikud` symbol as a symmetric alef (diagonal `M5.5 4.5L18.5 18.5`, two mirrored arms meeting the diagonal, filled hiriq dot at `12,21.5`) — verified legible at 17px and 24px.

**Tenth-game candidates discussed (nothing built):** Numbers & gender agreement (מספרים); Shorashim/roots (hebrew-idioms.js already annotates root+binyan on all 39 idioms — seed data); register switch formal↔colloquial (sentence-bank style/category tags as seed); Mishkalim noun patterns; dictation/הכתבה (speech.js reuse). Gematria noted as easter-egg material, not a lesson.

**Files changed:** `task-log.md` only (in-repo). Mockup file changed in session scratchpad.

**Behavior changed:** None.

**Tests run:** None — no app code changed. Verified via headless-Chrome full-page captures + crops (night frames, logo tile, nikud icon at both sizes).

**Risks / regressions to check:** None for the app. Phase B (real implementation of Hebrew Editorial paper+night in `styles.css` etc.) is approved-direction-pending-final-mockup-review; the night token values above are the spec to carry over.

---

### 2026-07-17 — Visual redesign workshop: three design-direction mockups (no app changes)

**Requested:** The app has the recognizable "vibecoded" aesthetic (gradient blobs, emoji-as-icons, uniform nested pill cards, centered text, afterthought light mode). User asked for a professional-looking redesign, chose to workshop directions via mockups before touching the app, and set one firm rule: **content emoji stay** — every sentence's authored `emoji` field in `sentence-bank-data.js` (added freely by Claude and Codex) must never be restyled or converged; only interface-chrome emoji (lesson tiles, 🏠/⏱️/🔥, optionally ✅/❌) are candidates for replacement, and the user wants to see proposed SVG icons before approving.

**Change (all outside the repo — no app code touched):**
- Built a self-contained comparison mockup, `ivritelite-redesign-workshop.html`, in the session scratchpad (`/private/tmp/claude-501/-Users-mikesexton-Documents-Ulpango/df8a1513-b78c-4d0c-809b-c3dcc0dd7b4b/scratchpad/`), served at `http://localhost:8901/ivritelite-redesign-workshop.html`. Four tabs: three full design directions × four real screens each (Home, Match, Sentences, Settings) with real app content (actual lesson names, live vocab pairs, sentence `colloquial_01` with its authored 📵), plus a 20-glyph hand-inlined SVG stroke-icon proposal on its own tab. Directions: **01 Refined Dark & Gold** (evolutionary: flat navy elevation steps, gold demoted to reward moments), **02 Clean Edtech Light** (light-first, Israeli-flag blue `#0038B8` accent), **03 Hebrew Editorial** (Frank Ruhl Libre-led, paper surfaces, home screen as a table of contents indexed א·ב·ג). All use only fonts the app already loads. Each direction also demos fixes for current execution misses: settings as grouped rows with real toggles/segments, destructive dialog action no longer styled primary, no dead space above game boards, feedback-glyph A/B (SVG check vs keep-✅) for the user to choose.
- `.claude/launch.json` (gitignored) — added a `redesign-workshop` python3 http.server config on port 8901 serving the scratchpad.

**Files changed:** `.claude/launch.json` (gitignored), `task-log.md`. Nothing else in the repo.

**Behavior changed:** None (mockups only).

**Tests run:** None — no app code changed. Mockup verified by headless-Chrome full-page captures of all four tabs (fonts, RTL token rows, SVG icons, and per-direction theming all render correctly).

**Risks / regressions to check:** None for the app. For the eventual implementation (Phase B, after the user picks a direction): plan is a token-level retheme of `styles.css` plus chrome-emoji→inline-SVG swaps in `index.html`/`app/ui.js`, with the content-emoji rule above as a standing constraint; will require `?v=` bumps and the usual test/log cycle. The scratchpad mockup is session-temporary — copy it out if it should survive.

---

### 2026-07-17 — Sentence word-order alternates, TTS kamatz-katan/loanword pronunciation fixes, strip preposition info from Conjugation prompts

**Requested:** Five flags from iPad play: (1) accept בדיוק in either position for "The class starts at exactly eight thirty"; (2) fix TTS mispronunciations "fark" (בפארק) and "ve-khal" (וכל) and audit sentence pronunciation overall; (3) improve the stilted "due to the light rail works" English (user decided: keep "works", explain the signage register in the notes); (4) accept "Findings should not be generalized from this sample…" as an alternate English order; (5) stop showing preposition-government info like "(את־ ל־)" in conjugation drills.

**Change:**
- `sentence-bank-data.js` — (1) new `addReorderedHebrewAlternate("everyday_85", …, [0,1,4,2,3])` accepting השיעור מתחיל בדיוק בשמונה וחצי. (2) `colloquial_130`: fixed missing dagesh in the loanword — בְּפַארְק → בְּפַּארְק in both the sentence niqqud and the token pair (the TTS was correctly reading the stored "f"). (3) `formal_63` notes now explain that "works" is signage English (roadworks register). (4) `buildExpandedSentence` gained an `englishAlternates` param emitting `english_alternates` (loader already supported the field; zero entries used it); `formal_32` got the alternate English order.
- `app/speech.js` — new `speech.applyTtsRespellings(text)` applied inside `buildHebrewSpeechText` to every text source (overrides, niqqud, plain). Speech-only; display niqqud unchanged. Input is NFC-normalized (data files store marks in typed order, dagesh-before-vowel; NFC canonicalizes). Rules: standalone כָּל/כָל with optional prefixes → cholam (וְכָל→וְכֹל); תָּכְנִ→תּוֹכְנִ; word-initial אָזְנ→אוֹזְנ; kamatz before a chataf-kamatz syllable → cholam (צָהֳרַיִם→צֹהֳרַיִם).
- `app/verb-match.js` — new private `stripUsagePattern(word)` (exact-suffix removal using the word's own `usagePattern` field); applied in `renderVerbMatchPrompt` and `getVerbMatchPromptSpeechPayload`, so the Conjugation prompt shows "to invite | לְהַזְמִין" and TTS no longer speaks "את־ ל־". Vocab and other games untouched (`verbFormDeck` has no other prompt consumers; adv-conj has its own qualifier stripping).
- `index.html` — `?v=20260717a` bumps for `sentence-bank-data.js`, `app/speech.js`, `app/verb-match.js`.
- `tests/app-speech.test.js` — 2 new tests: respell rules (positives incl. both mark orders via NFC; negatives כַּלְכָּלָה, מִיכָל, הֵיכָל, plain text) and `buildHebrewSpeechText` applying rules to niqqud + override paths.
- `tests/sentence-bank-data.test.js` — 3 new tests: everyday_85 alternate present/aligned, formal_32 english_alternates matches token multiset, colloquial_130 park dagesh in sentence + token niqqud.

**Pronunciation audit result:** scripted scan of all pointed words (7,190 distinct) across the six data files for word-initial soft ב/כ/פ, prefix+soft-letter loanword smells, and kamatz-katan stems. Only genuine data defect: בְּפַארְק (fixed). Legit soft-פ loanwords left alone: פְרָאיֶיר, פִיזְיוֹתֶּרַפְּיָה, פִיצֶ'ר, פָלָאפֶל. לִפְנֵי כֵן without dagesh is correct (bound-phrase "lifnei khen", like אף על פי כן). Engine-side kamatz-katan traps (כל ~49×, תָּכְנִית 7×, אָזְנַיִם, צָהֳרַיִם 3×) all covered by the four respell rules. Judgment call left as-is: פָלַסְטִינִית ("falastinit") — both /f/ and /p/ pronunciations are current in Israeli speech; flag if you want פּ.

**Files changed:** `sentence-bank-data.js`, `app/speech.js`, `app/verb-match.js`, `index.html`, `tests/app-speech.test.js`, `tests/sentence-bank-data.test.js`, `task-log.md`.

**Behavior changed:** everyday_85 (en→he) and formal_32 (he→en) accept both word orders. All Hebrew TTS app-wide (sentences, vocab, verbs, abbreviations) speaks kol/tokhnit/oznayim/tsohorayim correctly and says "park" with /p/. Conjugation (Verb Match) prompt and its audio drop the "(את־ ל־)"-style usage patterns. formal_63 notes explain the "works" register; its answer tokens are unchanged.

**Tests run:** `npm test` before: 248 pass, 0 fail. After: 253 pass, 0 fail. Live check on :3000 under `?v=20260717a`: no console errors; prepared deck has the everyday_85 alternate and formal_32 english alternate; `buildHebrewSpeechText` on colloquial_130 returns בְּפַּארְק + וְכֹל; forced the להזמין prompt in Verb Match — renders "to invite | לְהַזְמִין", speech payload "לְהַזְמִין".

**Risks / regressions to check:** (1) The כל respell rule is boundary-anchored with a prefix whitelist — a future word like מְכָל ("container", currently absent from all data) would be respelled wrongly; extend the negative tests if added. (2) Respellings also apply to `speechOverride*` strings (abbreviations) — desirable for kamatz-katan but means overrides aren't byte-exact anymore. (3) `english_alternates` now flows through `buildExpandedSentence` for literal-format entries nothing changed. (4) TTS output on-device still needs an ear check on iPad (Safari he-IL voice) for the four rule families.

---

### 2026-07-13 — Rename Translation→Vocabulary, review tracking note, sentence word-order fix, disambiguate Conjugation+ "you" prompts

**Requested:** Four changes from screenshots: (1) rename the "Translation" game to "Vocabulary"; (2) add a short note on the Review page saying IvritElite tracks performance to optimize improvement; (3) accept both word orders for the internet/password sentence (כאן before or after אינטרנט); (4) fix ambiguous "you" prompts in Conjugation+ where the bare "you" left a differently-gendered/numbered distractor also correct, and scan for other ambiguous prompts.

**Change:**
- `app/bootstrap-data.js` — renamed the user-facing "Translation" game name/titles to "Vocabulary" in both `en` and `he`: `game.translationName`, `session.mixedTitle`/`secondChanceTitle`/`start`/`restart`, `status.start`/`startAnother`, `results.lessonTitle`, `perf.summary`, and the `masteredOnly` title/body. Hebrew "תרגום" (as the game name) → "אוצר מילים"; the two Hebrew mastered strings rephrased naturally. Mechanic-descriptive uses left intact (`translationNote` "Match Hebrew words…", `sentenceBankNote`/`sentenceBankStart` "…translations…", the `translationCorrect/Wrong…` feedback). Added new i18n key `review.trackingNote` (en + he).
- `index.html` — added `<p class="small-note review-tracking-note" data-i18n="review.trackingNote">` at the top of `#reviewOverviewPanel`. Cache-bust bumps: `bootstrap-data.js` `20260705a→20260713a`, `sentence-bank-data.js` `20260712c→20260713a`, `adv-conj.js` `20260713a→20260713b`.
- `sentence-bank-data.js` — `everyday_94` ("יש כאן אינטרנט? מה הסיסמה?") gained a `hebrewAlternates` entry accepting the equally valid order "יש אינטרנט כאן? מה הסיסמה?" (with niqud + token pairs).
- `app/adv-conj.js` — rewrote `getAdvConjSubjectEnglishLabel`. The old check dropped the gender/number qualifier when another same-label subject shared the *identical* verb form, which is exactly when a differently-inflected distractor (e.g. עולות for f.pl.) made the bare "you" ambiguous. New logic keeps the qualifier whenever any same-label subject conjugates to a *different* verb form, collapsing to the bare label only when all same-label subjects share one form.

**Scan result (task 4):** The "you" ambiguity was specific to Conjugation+ (adv-conj). Verb Match (`hebrew-verbs.js` present tense) deliberately labels present forms as he/she/they and never offers 2nd-person present, so no bare-"you" ambiguity. Prepositions (`preposition-data.js`) uses qualified object labels ("you (m.sg.)", "you (f.sg.)", "you (pl.)") with a single "you (pl.)" entry, and the subject person isn't varied. No other changes needed.

**Files changed:** `app/bootstrap-data.js`, `index.html`, `sentence-bank-data.js`, `app/adv-conj.js`, `.claude/launch.json` (added a `ulpango-dev-3242` config for this session's preview since 3000/3100 were occupied by other chats), `task-log.md`.

**Behavior changed:** Home/session/results/settings UI now say "Vocabulary" instead of "Translation" (en + he). The Review → Overview tab shows a one-line note about performance tracking. The internet/password sentence now accepts either word order. Conjugation+ en→he prompts with a 2nd-person subject now always show the gender/number (e.g. "you (m.sg.) climb on our nerves"), removing the case where a distractor was also a valid answer.

**Tests run:** `npm test` after: 240 pass, 0 fail (240 before too). Live check on a local `serve` (:3242): home + Review render correctly, no console errors; `buildAdvConjEnglishSentence` for the nerves idiom returns "you (m.sg.) climb on our nerves" / "you (f.sg.) climb on our nerves"; prepared `everyday_94` now has primary "יש כאן אינטרנט…" plus alternate "יש אינטרנט כאן…".

**Risks / regressions to check:** (1) Conjugation+ present-tense "you" prompts are now slightly longer (always carry the qualifier) — intended. (2) Other idioms where 2nd-person forms share spelling now generate two distinct prompts (m.sg. and f.sg.) instead of one collapsed "you"; both are valid. (3) The Hebrew game-name rename (אוצר מילים) affects any place that displayed "תרגום" as a title — verify no layout overflow in the Hebrew UI. (4) Only `everyday_94` got the alternate order; other sentences with flexible adverb placement are unchanged.

---

### 2026-07-13 — Adaptive (weakness-weighted) selection for Conjugation, Binyanim, Conjugation+, and Prepositions

**Requested:** Skew content selection in all game modes toward items the user struggles with and away from mastered items. Vocab/abbreviation/sentence modes already do this via Leitner + weighted selection; Verb Match, Binyan Board, Advanced Conjugation, and Prepositions picked purely at random. User-approved plan: close the gap with per-item stats stores and weighted sampling, always-on (no toggle), reusing the `pickBestWord` weighting factors.

**Change:**
- `app/constants.js` — three new `STORAGE_KEYS`: `advConjItemStats` (`ivriquest-adv-conj-item-stats-v1`), `prepositionsItemStats` (`ivriquest-prepositions-item-stats-v1`), `binyanBoardItemStats` (`ivriquest-binyan-item-stats-v1`). Records are flat maps `{ [itemKey]: {attempts, correct, misses, lastSeen} }` — no Leitner scheduling, since these modes pick a session subset up front.
- `app/utils.js` — three shared helpers: `normalizeAdaptiveRecord` (spread-defaults normalizer, clamps and derives misses), `getAdaptiveWeight` (newBoost 1.45 for unseen, weaknessBoost up to ×1.85, missBoost up to ×2.5, strengthDamp ×0.45 at ≥6 attempts & ≥90% accuracy, recencyDamp ×0.6 within 10 min, jitter 0.7–1.5), `pickWeightedSubset` (weighted sampling without replacement over `utils.weightedRandomWord`, resolved at call time so test stubs intercept).
- `app/verb-match.js` — new `pickVerbMatchQueue(deck, count)` replaces the random `shuffle().slice(0, 1)` in `startVerbMatch`. Weights read the EXISTING per-verb conjugation stats in `state.progress` (`conjugationAttempts/Correct/Streak`, `lastConjugationSeen`), with streakDamp down to ×0.2 near `CONJUGATION_MASTER_STREAK` and ×0.35 for mastered words. Handles both `entry.id` and `entry.word.id` deck shapes. No recording changes (hooks already existed).
- `app/binyan-board.js` — `getBinyanItemStats`/`updateBinyanItemStats` (keyed by `root.id`); `selectBinyanRoundRoots` now weight-samples the 6 round roots (falls back to shuffle if utils helpers missing); recording hook in `applyBinyanBoardAnswer` next to the aggregate writer.
- `app/adv-conj.js` — `getAdvConjItemStats`/`updateAdvConjItemStats` (keyed by `idiomId`); `pickAdvConjQuestions` replaces shuffle+slice in `startAdvConj` (weight computed once per idiom); recording hook in `applyAdvConjAnswer`. Review-phase answers count, same as the aggregate writer.
- `app/prepositions.js` — `getPrepositionsItemStats`/`updatePrepositionsItemStats` (keyed `${triggerId}:${objectKey}`, the existing session mistakeKey); `pickPrepositionsQuestions` replaces shuffle+slice in `startPrepositions` (deck-build shuffle kept — it also randomizes distractors); recording hook in `applyPrepositionsAnswer`.
- `index.html` — `?v=20260713a` bumps for all six edited files: `app/constants.js`, `app/utils.js`, `app/adv-conj.js`, `app/prepositions.js`, `app/verb-match.js`, `app/binyan-board.js`.
- `tests/adaptive-picker.test.js` (new) — 4 pure vm-load tests over `app/utils.js` with seeded `Math.random`/`Date.now`: normalizer defaults/clamping/miss derivation; weight ordering (new > strong-clean, missy > clean, recency and strength damps exact); `pickWeightedSubset` without-replacement ordering, count ≥ pool, all-zero weights fallback.
- `tests/app-progress.test.js` — binyan analytics test extended with `rootId` + per-root record assertions; prepositions analytics test extended with `objectKey` + per-item record assertions; 3 new harness tests: verb match picks the weak verb over a streaky/strong one (captured weights + queue contents), adv-conj weights weak idioms higher and records per-idiom results through `applyAdvConjAnswer`, prepositions weights weak trigger-object pairs higher.

**Files changed:** `app/constants.js`, `app/utils.js`, `app/verb-match.js`, `app/binyan-board.js`, `app/adv-conj.js`, `app/prepositions.js`, `index.html`, `tests/adaptive-picker.test.js`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** Conjugation (Verb Match), Binyanim, Conjugation+, and Prepositions now bias session content toward items the learner has missed or answers poorly, and away from items answered strongly (≥90% over ≥6 attempts) or seen in the last 10 minutes; unseen items keep a 1.45× boost so new content isn't starved. Selection remains randomized (jitter), so nothing is ever excluded. Vocab/abbreviation/sentence modes unchanged. Three new localStorage keys begin accumulating per-item history.

**Tests run:** `npm test` before: 233 pass, 0 fail. After: 240 pass, 0 fail. Live check on :3000 under `?v=20260713a`: all new helpers present on `IvriQuestApp`, Prepositions session starts through the weighted picker, answering writes `ivriquest-prepositions-item-stats-v1` (`prep-enjoy:3ms → {attempts:1, correct:1, misses:0}`) alongside the aggregate key; 2000-round in-page sample shows the weak item picked ~90% vs a strong item; `pickVerbMatchQueue` returns a valid entry from the real verb deck; no console errors.

**Risks / regressions to check:** (1) Idioms that generate more deck combos still get proportionally more selection chances in Conjugation+ (same bias as the old uniform slice — weighting is per idiom, not per combo). (2) Weight tuning constants are duplicated from `pickBestWord` by design; if translation weighting is retuned later, consider whether `getAdaptiveWeight` should follow. (3) The three new stores grow one record per distinct item answered (bounded by content size — dozens to a few hundred keys); no eviction implemented. (4) Verb Match weighting is only as good as the existing conjugation stats; verbs never played still rely on the newBoost path.

---

### 2026-07-12 — Sentence bank ROUND4: 70 Tel Aviv slang/culture sentences (328 → 398)

**Requested:** A big new sentence-bank batch featuring Israeli slang and Tel Aviv culture/institutions — hip, gossipy, real-world vibe. User-approved plan: ~70 sentences split ~60% colloquial / ~25% everyday / ~10% professional (startup culture) / ~5% formal (ironic municipal).

**Change:**
- `sentence-bank-data.js`
  - Appended `SENTENCE_EXPANSION_ROUND4` (70 `buildExpandedSentence` entries) after the ROUND3 push: `colloquial_98–139` (42), `everyday_107–124` (18), `professional_66–72` (7), `formal_61–63` (3). Difficulty mix 15/37/18 (L1/L2/L3); 9 `style:"whatsapp"` clipped messages; 10 entries with feminine/masculine `hebrewAlternates` gender swaps (colloquial_106/114/115/117/122/124/127/131/137/138).
  - Themes: nightlife & dating gossip (סלקטור, הבריז, חי בסרט, נפל האסימון, סטוץ, אפטר), WhatsApp group drama (וי כחול, פדיחה, voice notes, muted building group), reality-TV/celeb gossip (הודח, ספוילר, סלב, משפיענית, פרסומת סמויה), social media (קרינג' ברמות, פומו, הייפ, לייקים, רילס), Israeli character (קומבינה, פרוטקציה, פראייר, לפרגן, חרטא, אשכרה, יש מצב, סוף הדרך, מהממת), TLV geography/transit (רכבת קלה, קורקינט, דיזנגוף, פלורנטין, פארק הירקון, תחנת השלום, שוק הכרמל, חוף גורדון, הטיילת), beach/matkot/מדוזות, café & food (הפוך על סויה, קופיקס, לנגב חומוס, ברנץ', בורקס, טבעוני, שקשוקה), apartment hunting (דמי תיווך, ועד בית, בעל הבית, יד שנייה, 30-person viewings), startup register (אקזיט, גייס סבב, אופן ספייס, דדליין/ספרינט, מנכ"ל, באג/פיצ'ר, office dog), ironic municipal notices (עיריית ת"א scooter warning, מתרחצים beach request, אי הנוחות light-rail apology). Derogatory/vulgar slang (ארס/פרחה etc.) deliberately excluded; all slang checked as fresh (not featured in the existing 328).
  - Bumped `__build` `20260712b` → `20260712c`.
- `tests/sentence-bank-data.test.js` — master count test 328 → 398 (name + 3 assertions); `categoryCounts` → `{colloquial:139, everyday:124, professional:72, formal:63}`; new `ROUND4_ENTRY_IDS` (`sentenceIdRange` ×4); new round4 difficulty-mix block (`70`, `{1:15, 2:37, 3:18}`); alignment loop extended with `...ROUND4_ENTRY_IDS`; `PHRASE_COMPACTED_ENTRY_IDS` extended with the four round-4 ranges; 10 ids appended to `EXPANSION_GENDER_ALTERNATE_IDS`.
- `index.html` — `sentence-bank-data.js?v=` bumped `20260712b` → `20260712c`.

**Files changed:** `sentence-bank-data.js`, `tests/sentence-bank-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Sentences/Shema deck grows 328 → 398 sentences; the new items enter the unseen-first selection pool immediately.

**Tests run:** `npm test` before: 233 pass, 0 fail. After: 233 pass, 0 fail (the alignment/frame/nuance/distractor tests now validate all 70 new entries; also verified with a standalone replica validator: 0 problems). Live check on :3000 under `?v=20260712c`: `IvriQuestSentenceBank.__build === "20260712c"`, 398 entries with correct per-category counts, Sentences mode starts and renders a tiled question, no console errors.

**Risks / regressions to check:** (1) Hand-pointed niqqud on 70 new sentences + distractors + alternates — spot-check loanword pointings (סְפּוֹיְלֶר, קוֹרְקִינֵט, הַהַייפּ, בָּאוֹפֶן סְפֵּייס) and the classical-vs-male pairs (plain אליי/עכשיו ↔ pointed אֵלַי/עַכְשָׁו, matching bank convention). (2) Slang register is intentionally colloquial (e.g. סטוץ 'fling' in colloquial_105) — flag if too racy for the app's audience. (3) המנכ"ל/הסמנכ"ל tokens contain an embedded `"` (escaped in JS) — verified frame-building works, but check UI rendering of the quote character in tiles.

**Requested:** Batch 5 (final item) of the content-expansion plan: ~6–8 new Conjugation+ idioms, diversifying beyond the "drive-someone-crazy" annoyance family.

**Change:**
- `hebrew-idioms.js` — appended 8 entries to the `raw` array (full present/past/future conjugations keyed msg/fsg/mpl/fpl, literal_sg/pl/past/future templates with {s}/{o}/{p}):
  - **direct (2):** `sider` סידר אותי "screw someone over" (deception), `marach` מרח אותי "string someone along" (evasion).
  - **l_dative (6):** `asiyat_yom` עשה לי את היום "make someone's day" (joy), `haramat_moral` הרים לי את המורל "lift someone's spirits" (encouragement), `harisat_matzav_ruach` הרס לי את מצב הרוח "ruin someone's mood", `gnivat_hatzaga` גנב לי את ההצגה "steal someone's thunder" (rivalry), `drichat_yabalot` דרך לי על היבלות "touch a sore spot" (על-object, not את), `tsvitat_lev` צבט לי בלב "tug at the heartstrings" (ב-object, empathy).
  - Verified against near-neighbors: `merihat_atzabim` uses למרוט (pluck), not my למרוח (marach); `gnivat_lev`/`chimum_lev` use different verbs than my lev/hatzaga entries — no collisions.
- `index.html` — `hebrew-idioms.js?v=` bumped `20260711a` → `20260712a`.

**Files changed:** `hebrew-idioms.js`, `index.html`, `task-log.md`.

**Behavior changed:** Conjugation+ deck grows from 31 to 39 idioms (5 direct, 30 l_dative, 2 possessive_suffix), broadening the emotional range beyond annoyance.

**Tests run:** `npm test` 228 pass (no dedicated idiom-data test exists; the file loads and normalizes cleanly). Live check on :3100 under `?v=20260712a`: 39 idioms loaded; deck generation sampled all 8 new ids — direct forms assemble as verb+object (מסדר אותו, מורח אותי), l_dative as verb+ל+fixed including the non-את cases (דורך לי על היבלות, צובט לי בלב); no console errors.

**Risks / regressions to check:** (1) Idiom conjugations are unpointed and hand-authored with no schema test — spot-check the future forms (יהרוס, יגנוב, ידרוך, יצבוט) and the ל"ה עשה past עשתה. (2) This completes the full content-expansion plan (prepositions, sentences ×70, binyanim ×8 roots, verbs ×40, idioms ×8).

---

### 2026-07-12 — Conjugation game 4b/4c: 8 pi'el + 9 hif'il + 3 pa'al verbs (104 → 124 lemmas)

**Requested:** Completion of Batch 4 of the content-expansion plan — the pi'el/hif'il and weak-root pa'al remainder of the ~40-verb addition, finishing the batch at +40 verbs total (84 → 124).

**Change:**
- `hebrew-verbs.js`
  - Appended 20 fully curated `createVerbEntry` blocks (full hand-pointed present/past/future/imperative):
    - **Pi'el (8):** ללמד (teach), לנסות (try, ל"ה), לנקות (clean, ל"ה), לשנות (change, ל"ה), לבשל (cook), לסדר (arrange), לטייל (travel, ע"י), לבקר (visit).
    - **Hif'il (9):** להסביר (explain), להדליק (turn on), להפסיק (stop), להקשיב (listen), להכניס (put in), להחזיר (give back, ח guttural segol past), להצליח (succeed, ל"ח furtive patach), להכיר (know a person, פ"נ נ→dagesh), להוריד (take down/download, פ"י → holam).
    - **Pa'al weak roots (3):** לצחוק (laugh — o-infinitive/a-future guttural, יִצְחַק), לטוס (fly, ע"ו hollow), לגעת (touch — doubly weak פ"נ + ל-guttural, נוֹגֵעַ/יִגַּע/גַּע).
  - Added `["stop", "stopped"]` to `ENGLISH_PAST_IRREGULARS` (else להפסיק rendered "I stoped"). All other regular glosses (try→tried, change→changed, arrange→arranged, put in→put in) are handled by the existing e$/y→ied rules + irregular map.
  - Bumped `__build` `20260712a` → `20260712b`.
- `index.html` — `hebrew-verbs.js?v=` bumped `20260712a` → `20260712b`.

**Files changed:** `hebrew-verbs.js`, `index.html`, `task-log.md`.

**Behavior changed:** Conjugation deck grows 104 → 124 lemmas (138 study items). Batch 4 complete; final binyan mix ≈ pa'al 54 / pi'el 23 / hif'il 20 / hitpa'el 16 / nif'al 11 (pa'al drops from 61% to ~44%).

**Tests run:** `npm test` before and after: 228 pass, 0 fail. Live check on :3100 under `?v=20260712b`: all 20 lemmas in the deck, English derivation verified for the map-sensitive cases (I stopped=הִפְסַקְתִּי, I tried=נִסִּיתִי, he tries=מְנַסֶּה, I flew=טַסְתִּי, I knew=הִכַּרְתִּי, I took down=הוֹרַדְתִּי), full לגעת paradigm renders all doubly-weak forms correctly, לצחוק future is the a-type יִצְחַק; every form pointed; no console errors.

**Risks / regressions to check:** (1) Hand-pointed niqqud — highest-risk spots: לצחוק's a-future (יִצְחַק vs the tempting *יִצְחֹק), הִצְלַחַתְּ (2fs furtive patach), לגעת's assimilated futures (יִגַּע/תִּגְּעִי), the ל"ה pi'el 3fs (נִסְּתָה/שִׁנְּתָה). Read-aloud spot-check recommended. (2) Two "to know" cards now coexist (לדעת factual, להכיר acquaintance) — intentional pairing, different Hebrew, no dedup collision. (3) Batch 5 (Conjugation+ idioms) is the only remaining plan item.

---

### 2026-07-12 — Conjugation game 4a: 12 hitpa'el + 8 nif'al verbs (84 → 104 lemmas)

**Requested:** Batch 4 (session 4a) of the approved content-expansion plan: the hitpa'el/nif'al rebalancing payload of the ~40-verb addition. Hitpa'el goes 4 → 16, nif'al 3 → 11.

**Change:**
- `hebrew-verbs.js`
  - Appended 20 fully curated `createVerbEntry` blocks (full present/past/future tables, hand-pointed; imperatives included except where archaic):
    - **Hitpa'el (12):** להתלבש, להסתכל (metathesis), להסתדר (metathesis), להתרגל, להתרגש, להתעורר (hollow → hitpolel), להתקלח (ל"ח furtive patach), להתאמן, להתקדם, להתנהג (ה guttural chataf), להצטער (emphatic metathesis ט), להשתתף (metathesis).
    - **Nif'al (8):** להיזהר, להירדם (ר → tsere prefix), להיגמר (pairs with לגמור; נגמר לי), להיפרד, להישבר, להיראות (ל"ה; נראה לי; imperative omitted), להיעלם (פ' guttural: נֶעְלָם/יֵעָלֵם), להיוולד (פ"י: נוֹלַד/יִוָּלֵד; imperative omitted).
  - Added `["wake", "woke"]` to `ENGLISH_PAST_IRREGULARS` (להתעורר otherwise rendered "he waked up").
  - Bumped `__build` `20260711b` → `20260712a`.
- `index.html` — `hebrew-verbs.js?v=` bumped `20260711d` → `20260712a`.

**Files changed:** `hebrew-verbs.js`, `index.html`, `task-log.md`.

**Behavior changed:** Conjugation deck grows from 84 to 104 lemmas; hitpa'el/nif'al now meaningfully represented (paal falls from 61% to ~49% of lemmas).

**Tests run:** `npm test` before and after: 228 pass, 0 fail (niqqud-presence invariant, imperative-slot completeness, and label derivation all validated). Live check on :3100 under `?v=20260712a`: all 20 new lemmas in the deck (118 study items), "I woke up = הִתְעוֹרַרְתִּי" labels correctly, להיראות exposes zero imperative slots, every form pointed; no console errors.

**Risks / regressions to check:** (1) Hand-pointed tables — highest-risk spots: נֶעְלָם/נֶעֶלְמָה (pe-guttural alternations), הִתְקַלַּחַתְּ (2fs with furtive patach), נִרְאֲתָה (ל"ה 3fs), אֶוָּלֵד/יִוָּלֵד. Read-aloud spot-check recommended. (2) התאמנו appears as both past-1pl and past-3pl in plain spelling (niqqud differs) — precedented by תכננו. (3) Sessions 4b (piel+hifil, 17 verbs) and 4c (paal weak roots, 3) remain.

---

### 2026-07-12 — Binyanim board: 8 new roots (27 → 35, 130 → 169 playable forms)

**Requested:** Batch 3 of the approved content-expansion plan: ~8 new roots for the binyanim game, chosen for binyan-contrast showcase value.

**Change:**
- `verb-game-data.js`
  - Appended 8 fully hand-authored roots (39 playable forms): **ח־ש־ב** (6 slots — think/be considered/calculate/be calculated/deem important/be considerate), **ס־פ־ר** (5 — counted/told/got a haircut, reuses the sibilant-metathesis teaching point), **ד־ב־ר** (4 — no paal!; נדברנו, מדובר, הדביר), **ק־ש־ר** (5 — tied → phoned), **ע־ב־ד** (5 — pe-guttural, reuses the פ"ע hataf teaching point on הֶעֱבִיד), **ז־כ־ר** (4 — remembered/suddenly recalled/reminded/was mentioned), **י־ד־ע** (5 — pe-yod: נוֹדַע/הוֹדִיעַ/הוּדַע/הִתְוַדַּע), **פ־ק־ד** (5 — the classic meaning-spread demo: visited upon/was absent/commanded/deposited/was deposited).
  - Rare/formal forms flagged (`register`, `distractor_eligible: false` on קֻשַּׁר, נֶעֱבַד, הוּדַע). Zero new teaching-point strings — both used points are byte-identical to existing `TEACHING_POINT_KEYS` entries, so no i18n changes.
- `tests/verb-game-data.test.js` — root count 27 → 35; playable-form upper bound 145 → 200 (now 169).
- `index.html` — `verb-game-data.js?v=` bumped `20260621a` → `20260712a` (this string was already stale — the 2026-06-28 edit never bumped it).

**Files changed:** `verb-game-data.js`, `tests/verb-game-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Binyanim board root pool grows 27 → 35; sessions still draw 6 roots, so variety between sessions increases. Stale cache-bust fixed, so users will finally fetch the current file.

**Tests run:** `npm test` before and after: 228 pass, 0 fail (suite validates per-form required fields, same-plain niqqud/gloss distinctness, sibling gloss collisions, question generation, and en+he teaching-point resolution for all roots). Live check on :3100 under `?v=20260712a`: 35 roots / 169 playable forms loaded, all 8 new ids present, a new root appeared in a sampled 6-root board deck; no console errors.

**Risks / regressions to check:** (1) Niqqud/gloss accuracy on the rarer forms — spot-check נֶעֱבַד, הוּדַע, הִתְוַדַּע, פִּקֵּד vs פָּקַד. (2) ס-פ-ר hitpael reuses the metathesis teaching string whose example cites הסתדר (s-d-r) — same phenomenon, different root example; acceptable but worth a glance in-game. (3) The form-count cap is now 200; next root batch has ~31 forms of headroom.

---

### 2026-07-12 — Sentence Bank round 3, tranche 2: 36 new sentences (292 → 328, round 3 complete)

**Requested:** Completion of Batch 2 of the content-expansion plan — the opinions & news, narrative-sequencing, and conditionals/numbers portions of round 3.

**Change:**
- `sentence-bank-data.js`
  - Extended `SENTENCE_EXPANSION_ROUND3` with 36 entries: **professional_55–65** (11 — לדעתי + clause comparative, מצד אחד/מצד שני, רוב + collective agreement, indirect speech with retained future (הודיעה ש…יקוצץ), שאלה אם, להסיק מסקנות, polite disagreement רואה את זה אחרת), **formal_49–60** (12 — impersonal passives הוחלט/שודר/פורסם כי/ייחתם/ייבחן/תיסגר, אין + infinitive prohibition, אלמלא counterfactual, real conditional with pu'al passive + יצא לדרך, ככל ש…כך, סיכון/סיכוי trap), **everyday_100–106** (7 — קודם/ואחר כך, בזמן ש, כש + קלטתי ש, clock time תשע ורבע, מאתיים חמישים שקל, כבר + duration, ordinal הפעם השלישית), **colloquial_92–97** (6 — future-in-past אמר שיגיע, embedded WH, ברגע ש, עמד ל, עד ש + כבר, dropped-pronoun לא יודע).
  - 3 more gender alternates (professional_56, everyday_106, colloquial_97) → 13 total in round 3.
  - Round-3 final difficulty mix {1:14, 2:38, 3:18} — exactly the plan target; tranche 2 carried all 18 level-3 entries.
  - Bumped `__build` to `20260712b`.
- `tests/sentence-bank-data.test.js` — master assertions 292 → 328; category counts (everyday 106, colloquial 97, professional 65, formal 60); `ROUND3_ENTRY_IDS` extended to all four categories; difficulty assertion now {1:14, 2:38, 3:18} over 70; `PHRASE_COMPACTED_ENTRY_IDS` round-3 ranges extended; 3 ids added to the gender-alternate list.
- `index.html` — `sentence-bank-data.js?v=` bumped `20260712a` → `20260712b`.

**Files changed:** `sentence-bank-data.js`, `tests/sentence-bank-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Sentences/Shema decks grow 292 → 328; round 3 (70 sentences) is complete across all four categories.

**Tests run:** `npm test` after tranche 2: 228 pass, 0 fail (first run — includes the יצא לדרך nuance guardrail on formal_59). Live check on :3100 under `?v=20260712b`: 328 entries, `__build 20260712b`, category totals match, formal_59 renders pointed.

**Risks / regressions to check:** (1) Tranche-2 niqqud is hand-authored and passive-heavy — spot-check יְקֻצַּץ (professional_63), יֵחָתֵם (formal_51), אִלְמָלֵא (formal_58), הָעִתּוֹנָאִית (professional_61). (2) 18 new level-3 entries get the ×1.56 difficulty boost in Leitner weighting and will surface prominently.

---

### 2026-07-12 — Sentence Bank round 3, tranche 1: 34 new sentences (258 → 292)

**Requested:** Batch 2 of the approved multi-game content-expansion plan: ~70 new sentences themed tech & social media, opinions & news, and social plans & banter. This session lands tranche 1 (34); tranche 2 (~36: opinions/news for professional/formal plus narrative-sequencing and conditionals/numbers gap-fillers) is next.

**Change:**
- `sentence-bank-data.js`
  - Added `SENTENCE_EXPANSION_ROUND3` (34 entries via `buildExpandedSentence`): **everyday_87–99** (13 — battery/reception/password/app-crash/online-order tech, hosting, rescheduling with משהו צץ לי, purpose-ש in שאדע), **colloquial_74–91** (18 — סטורי/חסם/ויראלי/גלילה social media, two `style:"whatsapp"` entries (78, 90), על האש hosting, אין מצב, זה עליי, מת ל…, עובד עליי banter), **professional_52–54** (3 — Zoom link, system-down + כבר, attached-file email).
  - 10 feminine gender alternates (everyday_88/89/90/92/96, colloquial_77/84/85/89/91) with swap tokens seeded in distractor pools.
  - Grammar targets: dative-experiencer (נגמרה לי, צץ לי), future-as-imperative (תשלח/תנמיך/תוציא/תביא/תשמרו/תאשר), reciprocal hitpa'el (התראינו, להיפגש), reflexive עצמך, hitpa'el software reflexives (התעדכן), dual (יומיים), purpose-ש + future.
  - Bumped `__build` to `20260712a`.
- `tests/sentence-bank-data.test.js` — master assertions 258 → 292; category counts (everyday 99, colloquial 91, professional 54, formal 48); new `ROUND3_ENTRY_IDS` + difficulty-mix assertion ({1:10, 2:24}); round-3 ids added to the expansion alignment iteration, `PHRASE_COMPACTED_ENTRY_IDS`, and the gender-alternate assertion list.
- `index.html` — `sentence-bank-data.js?v=` bumped `20260711e` → `20260712a`.

**Files changed:** `sentence-bank-data.js`, `tests/sentence-bank-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Sentences/Shema decks grow 258 → 292 in both directions; two new WhatsApp-style prompts; new tech/social-plans vocabulary domain.

**Tests run:** `npm test` before (228 pass) and after (228 pass, first run — all frame/distractor/niqqud/gender invariants green). Live check on dev server :3100 under `?v=20260712a`: `getSentenceBank().length === 292`, `__build 20260712a`, round-3 count 34, whatsapp styling on colloquial_78/90, sample entry renders pointed with its feminine alternate; no console errors.

**Risks / regressions to check:** (1) Round-3 niqqud is hand-authored — spot-check הֶעֶלְתָה (colloquial_74), אֶחֱזֹר (everyday_91), שֶׁסִּיַּמְתָּ (colloquial_83) and TTS on the two WhatsApp entries. (2) Round-3 difficulty mix is interim ({1:10, 2:24}); tranche 2 will update it when formal/professional level-3 entries land. (3) New-item Leitner boost will surface many round-3 sentences at once.

---

### 2026-07-12 — Prepositions game: 5 new paradigms + 34 new triggers (66 → 100)

**Requested:** Batch 1 of the approved multi-game content-expansion plan ("plan a large addition of verbs… also plan additions to the prepositions and binyanim games"): add ~4 new inflected preposition paradigms plus ~30 new triggers.

**Change:**
- `preposition-data.js`
  - Added 5 inflection paradigms (full 8-object tables, hand-authored niqqud): **bishvil** בשביל "for", **biglal** בגלל "because of" (kamatz→patach before the heavy suffix: בִּגְלַלְכֶם), **lifnei** לפני "before" (plural-type suffixes: לְפָנַי / לִפְנֵיכֶם alternation), **acharei** אחרי "after" (plural-type, chataf-patach under ח), **mul** מול "opposite". Plain spellings follow house ktiv male style (double-yud 1sg/2fs: לפניי/לפנייך).
  - Added 34 triggers (66 → 100): rebalanced underused preps (el 4→7, im 6→10, etsel 2→4, kmo 2→4, neged 2→4, leyad 2→3), gave every new paradigm 2 triggers, promoted **et** את from distractor-only to 4 real triggers (פוגש/מכיר/מזמין/אוהב), and widened type variety (7 new expression-type, 1 adjective-type). All verb triggers use present-tense m.sg. forms so every one of the 8 object persons reads naturally. Deliberate same-verb/different-prep contrasts: עומד (ליד↔מול), חושב (על↔כמו) — the English hint disambiguates.
  - Updated the stale `et` comment ("used mainly as a distractor base" → "also serves as a distractor base").
- `index.html` — bumped `preposition-data.js?v=` `20260629a` → `20260712a`.

**Files changed:** `preposition-data.js`, `index.html`, `task-log.md`.

**Behavior changed:** Prepositions deck question space grows from 66×8 to 100×8 combinations; new paradigms appear both as answers and as distractors for existing questions.

**Tests run:** `npm test` before (228 pass) and after (228 pass — the preposition data tests iterate every paradigm×object and every trigger, so all new content is validated for distinct niqqud, unique ids, {o} slots, and 4-option question generation). Live check on dev server :3100: 16 paradigms / 100 triggers loaded under `?v=20260712a`; sampled generated questions for all 6 newly-triggerable preps (bishvil/biglal/lifnei/acharei/mul/et) render correct answers and sane distractors; no console errors.

**Risks / regressions to check:** (1) Paradigm niqqud is hand-authored — spot-check בִּגְלַלְכֶם, לִפְנֵיכֶם/לְפָנַי, and אַחֲרַיִךְ against a reference. (2) New paradigms enter the distractor pool for existing questions, slightly changing distractor mix. (3) Same-verb contrast triggers (עומד, חושב, גר was not reused) rely on the English hint for disambiguation — verify hint visibility on mobile.

---

### 2026-07-11 — Sentence Bank round 2: 71 new sentences (187 → 258)

**Requested:** "Plan another round of strong additions to the sentences game" — the 71 sentences authored in the earlier planning session (never implemented; the bank was still at 187). User approved implementing all 71 and committing all pending work on one branch with topical commits.

**Change:**
- `sentence-bank-data.js`
  - Extended `buildExpandedSentence` with an optional `style` parameter (previously hardcoded `style: null`) so expansion entries can be WhatsApp-styled.
  - Added `SENTENCE_EXPANSION_ROUND2` (71 entries, pushed after the existing expansion): **everyday_62–86** (25 — health/pharmacy, groceries/cooking, home/family, bureaucracy/ארנונה, directions/weather/time), **colloquial_54–73** (20 — dating slang incl. ghosting/דגל אדום/יצא לך, banter with תכלס/באסה/לחפור, three `style:"whatsapp"` entries 69–71), **professional_38–51** (14 — invoices, negotiation/משא ומתן, bottleneck, feminine manager/speaker forms, a real conditional), **formal_37–48** (12 — passives נערך/נצפתה/אוששה/תיבחן, ככל ש...כך, comparatives, עשוי vs עלול).
  - Grammar coverage targeted at prior gaps: ~20 feminine-subject/addressee sentences with gender-swap distractors, plural subjects, past narrative, true future, comparatives, numbers/time-telling, של-chains. 4 entries carry `hebrew_alternates` (masculine variants for everyday_62/67/81, word-order for everyday_84); alternate-only tokens (תקצוץ, תרד, ותפנה, צריך) are seeded in the distractor pools so alternates stay buildable.
  - Bumped `__build` to `20260711e`.
- `tests/sentence-bank-data.test.js` — master assertions 187 → 258; added `ROUND2_ENTRY_IDS`; category-count expectations updated (everyday 86, colloquial 73, professional 51, formal 48) plus a round-2 difficulty-mix assertion ({1:15, 2:39, 3:17}); the expansion alignment test now also iterates round-2 ids (niqqud parity, frame matching, English lexical coverage, distractor counts/dupes/target-reuse, alternate lengths); all 71 new ids added to `PHRASE_COMPACTED_ENTRY_IDS`.
- `index.html` — `sentence-bank-data.js?v=` bumped `20260711c` → `20260711e`.
- Also committed all previously pending work as topical commits on branch `sentence-bank-round-2` (Codex's 62 sentences; 19 conjugation verbs; 9 idioms + 33 vocab words; cache-busts/task-log).

**Files changed:** `sentence-bank-data.js`, `tests/sentence-bank-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Sentences/Shema decks grow from 187 to 258 sentences across both directions; three new WhatsApp-style prompts; new feminine/plural/past/future grammar coverage.

**Tests run:** `npm test` before (228 pass) and after (228 pass — one category-count test updated for the new totals). Live check on dev server :3100: `getSentenceBank().length === 258`, build `20260711e`, round-2 sample renders with full niqqud, Sentences round plays, no console errors. Programmatic sweep: zero banned near-synonym distractor pairs (איך/כיצד, אך/אבל, but/however, accurate/correct) anywhere in the bank.

**Risks / regressions to check:** (1) Round-2 niqqud is hand-authored — TTS (Shema mode) should be spot-checked on a few new sentences (e.g. formal_46 אֻשְּׁשָׁה, colloquial_61 בָּאסָה). (2) The `style` param on `buildExpandedSentence` defaults to null — existing expansion entries unaffected. (3) New-item Leitner boost will surface many round-2 sentences at once for existing players.

---

### 2026-07-11 — Conjugation game: add 10 high-frequency verbs (74 → 84 lemmas)

**Requested:** "Pick some more verbs to add to the conjugation game. You decide." Chosen to fill gaps between the conjugation deck and the verbs the Sentence Bank already drills constantly, while broadening binyan/gizra variety.

**Change:**
- `hebrew-verbs.js` — appended 10 fully curated `createVerbEntry` blocks at the end of `buildStarterVerbEntries()` (all `conjugation_mode: "curated"`, `review_status: "approved"`, full present/past/future/imperative with 1:1 plain+niqqud):
  - Regular pa'al: **לשלוח** (to send), **לשכוח** (to forget) — ל-guttural patach futures like לפתוח; **לעזור** (to help, ל־) — פ-guttural like לעבוד; **לבדוק** (to check) — o-future like לסגור.
  - Irregular pa'al: **לנסוע** (to travel) — פ"נ, nun assimilates (אסע/ייסע, imperative סע); **לרדת** (to go down / to get off) — פ"י tzere future (אֵרֵד, imperative רד); **לעלות** (to go up / to cost) — ל"ה like לעשות.
  - Hif'il: **להזמין** (to order / to invite), **להחליט** (to decide, past הֶחְלִיט with guttural segol).
  - Pi'el ל"ה: **לחכות** (to wait for, ל־).
  - Also added `["cost", "cost"]` to the irregular English past map — the לעלות "to cost" sense otherwise rendered "he costed" (now "he cost (past)", with the ambiguity annotation applied automatically).
- `index.html` — bumped `hebrew-verbs.js?v=` `20260711b` → `20260711d`.

**Behavior changed:** Conjugation and Conjugation+ decks grow from 88 to 98 study items (10 lemmas, 3 of them dual-sense). Each new verb exposes 24 learner-facing forms with niqqud.

**Tests run:** `npm test` before (228 pass, includes Codex's pending sentence-bank expansion) and after (228 pass). Live verification on dev server :3100 via browser JS: all 10 lemmas present in `getSeedVerbEntries()` (84 total) and in `buildVerbConjugationDeck` with `formSource: "authoritative"`, 0 forms missing `valuePlain`/`valueNiqqud`; irregular English labels correct (he went up / he got off / he forgot / he cost (past)); Conjugation game plays with no console errors.

**Risks / regressions to check:** (1) During verification I fixed one authoring bug: a usage pattern set on only one sense of לרדת was promoted entry-wide by `deriveSharedUsagePattern`, mislabeling "to go down" as taking מ־/ב־ — both senses now use `null` (mirrors לצאת). Watch other dual-sense verbs for the same trap. (2) לעלות past 3ms עלה = present ms עולה distinction relies on niqqud; the "(past)" annotation already guards the cost sense's colliding English labels. (3) Deck weighting may surface many new verbs at once for existing players (fresh Leitner state).

---

### 2026-07-11 (correction) — Sentence Bank: reassign the three fixes to the sentences actually intended

**Requested:** Correction to the prior entry — I had swapped which sentence needed which fix. Intended mapping: `everyday_08` needs the Hebrew word order קרוב או רחוק מכאן accepted (in addition to קרוב מכאן או רחוק); `formal_05` needs its English tokens "significant variation", "between the groups", and "it must be explained" broken down; `formal_16` (גם placement) was already correct. Keeping the extra everyday_08 English token split from the prior entry was explicitly fine.

**Change:**
- `sentence-bank-data.js`
  - `everyday_08` — added a `hebrew_alternates` entry accepting "זה קרוב או רחוק מכאן? אני לא מכיר את האזור." (מכאן moved to the end). Kept the prior English token split (near / here / far / from here). Same 10-token multiset reordered — no new bank tiles.
  - `formal_05` — broke the English tokens down from `["There is", "significant variation", "between the groups", "and", "it must be explained"]` to `["There is", "significant", "variation", "between", "the groups", "and", "it must be", "explained"]` (5 → 8 chips, now aligning 1:1-ish with the 8 Hebrew tokens). Removed the `hebrew_alternates` (fronted-PP) block I had wrongly added here in the prior entry and reverted its notes line.
  - `formal_16` — unchanged (its גם word-order alternate from the prior entry was correct).
- `tests/sentence-bank-data.test.js` — updated the `formal_05` CHUNKING_AUDIT entry: requiredTokens now the new fine chips, forbiddenTokens now the old fat chips.

**Files changed:** `sentence-bank-data.js`, `tests/sentence-bank-data.test.js`, `task-log.md`. (`index.html` cache-bust for `sentence-bank-data.js` was already at `?v=20260711a` from the prior entry — unpushed, so no new bump.)

**Behavior changed:** everyday_08 now accepts either קרוב מכאן או רחוק or קרוב או רחוק מכאן when building Hebrew; formal_05's English answer is assembled from 8 finer chips instead of 5. formal_16 unchanged from the prior entry.

**Tests run:** `npm test` — 223/223 pass. Live-engine verification (dev server on 3100): everyday_08 exposes 1 alternate, both orders accepted, a scrambled order rejected; formal_05 has 8 fine tokens that tile the English string cleanly, no fat chunks remain, and the stray alternate is gone; no console errors.

**Risks / regressions to check:** (1) formal_05's "and" chip still maps to the ו prefix of the single Hebrew token ויש, so the second-clause alignment is ~3-to-3 rather than strict 1:1 — expected. (2) everyday_08 still carries one more English locational chip ("from here") than Hebrew has words, unchanged from the prior entry.

---

### 2026-07-11 — Sentence Bank: word-order alternates for two sentences + finer English tokens for one

**NOTE: this entry mis-assigned two of the three fixes (everyday_08 and formal_05 were swapped). Superseded by the correction entry above.**

**Requested:** From three in-app screenshots: two Sentence Bank sentences need to accept a different (valid) word ordering, and one needs its English answer tokens broken down so they correspond more closely to individual Hebrew words.

**Change:**
- `sentence-bank-data.js`
  - `everyday_08` ("Is it near here or far from here? I don't know the area.") — token breakdown: split the fat English chips `"near here"` → `"near"` + `"here"` and `"far from here"` → `"far"` + `"from here"`, so the spatial-clause chips align to individual Hebrew words (קרוב/מכאן/רחוק). English tokens went 9 → 11. The `english`/`hebrew` strings and all Hebrew tokens are unchanged; the new chips still tile the English string cleanly (verified against the `buildSentenceFrame` data test).
  - `formal_16` ("הפתרון הזה בר קיימא גם בטווח הארוך.") — added a `hebrew_alternates` entry accepting `גם` before `בר קיימא` ("הפתרון הזה גם בר קיימא בטווח הארוך."). The engine only auto-allows adjacent swaps for a small flexible-modifier set (די/לגמרי/ממש/מאוד); `גם` isn't one, so an explicit alternate was required. Same 6-token multiset reordered — no new bank tiles needed.
  - `formal_05` ("קיימת שונות משמעותית בין הקבוצות, ויש להסביר אותה.") — added a `hebrew_alternates` entry accepting the fronted prepositional phrase ("בין הקבוצות קיימת שונות משמעותית, ויש להסביר אותה."), a natural academic-Hebrew ordering. This is the en2he (build-Hebrew) direction; the he2en English answer stays fixed (English SVO offers no natural reorder here). Same 8-token multiset reordered.
  - Both new alternates include `text_niqqud`/`tokens_niqqud` for house-style consistency (the engine's `sanitizeAnswerVariants` only consumes `text`/`tokens`).
- `index.html` — cache-bust bump `sentence-bank-data.js?v=20260704b` → `?v=20260711a`.
- `tests/sentence-bank-data.test.js` — updated the everyday_08 assertions to the new 11-token list and changed the `includes("near here")` check to `includes("from here")`.

**Files changed:** `sentence-bank-data.js`, `index.html`, `tests/sentence-bank-data.test.js`, `task-log.md`.

**Behavior changed:** In Sentence Bank, formal_16 now accepts `גם` in either position and formal_05 accepts the fronted `בין הקבוצות` order (both en2he); everyday_08's English answer is now assembled from finer chips (near / here / far / from here) instead of the two fat "near here" / "far from here" phrases. Primary displayed answers are unchanged.

**Tests run:** `npm test` — 223/223 pass (before and after). Live-engine verification via the running dev server (port 3100): `prepareSentenceBankDeck` exposes each new alternate's exact token array (so the engine's equality-based `isEquivalentSentenceTokenOrder` accepts them — end-to-end alternate acceptance is already covered by the existing sentence-builder unit test); a deliberately wrong formal_16 order is still rejected; everyday_08 exposes the 11 fine tokens with no fat chunks; no console errors.

**Risks / regressions to check:** (1) formal_05's alternate is the Hebrew (en2he) fronted-PP order — I inferred word-order flexibility is a Hebrew-side phenomenon since the English order is essentially fixed; if the intended flexibility was on a different phrase or the he2en side, adjust. (2) formal_16's `גם`-before-`בר קיימא` shifts nuance slightly ("also sustainable" vs "sustainable even in the long term"); accepted per the request. (3) everyday_08's `"from here"` chip has no distinct Hebrew counterpart (Hebrew uses מכאן once), so English still carries one more locational chip than Hebrew — unavoidable given the English phrasing, and it improves per-word alignment vs. the old fat chunks.

---

### 2026-07-11 — Curriculum content expansion: nif'al/hif'il/hitpa'el verbs, 9 new idioms, 31 vocab words

**Requested:** Assess the current IvritElite curriculum and decide independently where to add new content within the existing games.

**Assessment findings:** (1) The Verb Match conjugation deck (~64 verbs) had a severe binyan imbalance — 53 pa'al, 21 pi'el, 7 hif'il, 3 hitpa'el, and zero nif'al — and was missing top-frequency everyday verbs (להגיע, להתחיל, להרגיש, להיכנס, להישאר…). (2) Conjugation+ (Advanced Conjugation) had the smallest pool in the app: 22 idioms, only 2 at level 3. (3) Four vocab categories were far thinner than the rest: scientific_analytical 8, finance_investing 9, legal_civic 10, abstract_philosophy 13 (vs. 70–120 for the large categories). Sentence Bank (125), Binyan Board (27 roots), and Abbreviations (208) were judged healthy and left untouched.

**Change:**
- `hebrew-verbs.js` — added 8 fully curated verb entries (each with complete present/past/future/imperative forms, plain + niqqud, `conjugation_mode: "curated"`, `availability { translationQuiz: false, sentenceHints: true }` matching the existing common-verb pattern): nif'al להיכנס (to enter), להישאר (to stay/remain), להיפגש (to meet up, עם); hif'il להגיע (to arrive, ל־), להתחיל (to start/begin), להמשיך (to continue), להרגיש (to feel); hitpa'el להתקשר (to call, ל־). These are the deck's first nif'al verbs. Deck grows 76 → 84 study items.
- `hebrew-idioms.js` — added 9 idioms for Conjugation+, all using the proven `l_dative` + `fixed_object` template shape: לבלבל/לשטוף למישהו את המוח, להוציא למישהו את הנשמה, לעלות למישהו על העצבים, לסובב למישהו את הראש, לשים למישהו רגל, לחמם למישהו את הלב (level 2); למרוט למישהו את העצבים, להוציא למישהו את הרוח מהמפרשים (level 3). Pool grows 22 → 31 idioms (deck cards 2042).
- `vocab-data.js` — added 31 words to the four thin categories (all dupe-checked against the full RAW map): scientific_analytical +8 (ניסוי, מדידה, ממצא, נתונים, מדגם, מובהקות, מסקנה, דיוק), finance_investing +8 (בורסה, מניה, דיבידנד, תשואה, חיסכון, פנסיה, הלוואה, שער חליפין), legal_civic +8 (תביעה, פסק דין, עדות, נאשם, פרקליטות, חקיקה, הרשעה, זיכוי), abstract_philosophy +7 (מהות, משמעות, מציאות, אמונה, היגיון, תפיסת עולם, מצפון). Base vocabulary grows to 1,208 words.
- `index.html` — cache-bust bumps to `?v=20260711a` for the three edited data files (`vocab-data.js`, `hebrew-verbs.js`, `hebrew-idioms.js`).
- `.claude/launch.json` — added an `ulpango-dev-3100` config (port 3100) so this session could run its own preview server alongside another session's server on 3000. No app impact.

**Files changed:** `hebrew-verbs.js`, `hebrew-idioms.js`, `vocab-data.js`, `index.html`, `.claude/launch.json`, `task-log.md`.

**Behavior changed:** Verb Match now includes 8 more high-frequency verbs, including the first nif'al entries; Conjugation+ has 9 more idioms (7 level-2, 2 level-3); Word Match/translation-quiz pools for the four thin categories roughly double. New verbs are excluded from the translation quiz but available for sentence hints, matching existing common verbs.

**Tests run:** `npm test` — 223/223 pass before and after. Node spot-checks: all 8 new verbs resolve as `authoritative` with 24 forms each and niqqud on every form; idiom deck builds 2042 cards; sample render "עולה לי על העצבים" correct. Browser-verified on a dev server (port 3100): no console errors; `HEBREW_IDIOMS.length === 31`; conjugation deck contains להיכנס/להישאר/להתקשר/להרגיש; `getBaseVocabulary()` returns 1,208 words with all new entries present (category counts 16/17/18/20).

**Risks / regressions to check:** (1) Niqqud on the ~200 new hand-authored verb forms was written from standard paradigms — tests enforce presence, not correctness; worth a native-speaker skim, especially the nif'al future forms and hitpa'el past (הִתְקַשַּׁרְתִּי pattern). (2) New idioms reuse existing templates only (`l_dative` with `fixed_object`), so no new rendering paths; the שם/שמה present-vs-past homographs in simat_regel are handled by the game's existing ambiguity skip. (3) TTS pronunciation of the new niqqud-less plain forms (e.g. תיכנסי) relies on the same speech path as existing nif'al-free content — spot-check audio in Verb Match. (4) The added launch config is dev-tooling only.

---

### 2026-07-11 — Remove the Word Bank tab and Weakest Letters section from the Review page

**Requested:** In IvritElite, get rid of the "Word Bank" tab on the Review page as well as the "Weakest Letters" section.

**Change:**
- `index.html` — removed the `data-review-tab="wordbank"` tab button, the entire `#reviewWordBankPanel` panel (search/filters/count/list/empty), and the "Weakest Letters" `<section>` (`#weakestLettersList`/`#weakestLettersEmpty`) from the Trouble Spots panel. Bumped cache-bust `?v=` to `20260711a` for the three edited modules: `bootstrap-runtime.js`, `ui.js`, `controller.js`.
- `app/ui.js` — `renderReviewState()` no longer toggles/renders the word-bank panel (dropped the `wordbank` tab branch and the `reviewWordBankPanel` hidden toggle). Removed the Weakest Letters rendering block from `renderTroubleSpots()`. Deleted the now-unused `renderWordBankFilters()` and `renderWordBankList()` functions.
- `app/controller.js` — removed the three word-bank event listeners (`wordBankSearch` input, `wordBankFilters` click, `wordBankList` master-toggle click).
- `app/bootstrap-runtime.js` — removed the dead element refs (`reviewWordBankPanel`, `weakestLettersList`, `weakestLettersEmpty`, `wordBankSearch/Filters/Count/List/Empty`), dropped `"wordbank"` from the allowed `reviewTab` values (invalid saved values now fall back to `overview`), and removed the `wordBank` state object.
- `tests/app-progress.test.js` — updated the review-markup test to assert two sub-tabs and that the word-bank/weakest-letters IDs are gone; changed the persistence test's `reviewTab` from `"wordbank"` to `"trouble"`.

**Data layer kept:** `data.getWordBankEntries`/`setWordMastered`/`isWordMastered` (mastered words still leave the translation pool) and `handwriting.getWeakestLetters`/`rankWeakestLetters` were left intact — the mastered logic is used beyond the tab and `rankWeakestLetters` is unit-tested. Only the Review-page UI surface was removed. `handwriting.getWeakestLetters` is now unused by the UI.

**Behavior changed:** The Review page now has two tabs (Overview, Trouble Spots) instead of three — the Word Bank tab and its search/filter/mastered-toggle list are gone. Trouble Spots now shows only Most Missed, Toughest Sentences, and Hardest Verbs; the Weakest Letters chip grid is removed. A user whose saved `reviewTab` was `wordbank` now lands on Overview.

**Tests run:** `npm test` — 223/223 pass (before and after). Browser-verified on the dev server: Review page shows two tabs; Trouble Spots titles are Most Missed / Toughest Sentences / Hardest Verbs (no Weakest Letters); word-bank/weakest DOM nodes absent; no console errors.

**Risks / regressions to check:** (1) `handwriting.getWeakestLetters` is now dead code — harmless, left in place. (2) Unused i18n keys (`review.tabWordBank`, `review.weakestLetters`, `wordBank.*`) remain in `bootstrap-data.js`; left untouched to keep the diff focused. (3) Confirm nothing else linked to the Word Bank tab (e.g. a "see your words" affordance elsewhere) — none found in the app modules.

---

### 2026-07-02 — Add nikkud (vocalization) to all sentence-bank sentences with a display toggle

**Requested:** Add nikkud to all the sentences so the pronunciation is always correct; asked whether it was feasible in one run. Decided (via clarifying questions): generate the nikkud with the Dicta Nakdan auto-vocalizer, and store it in separate niqqud fields wired to the existing נִיקּוּד toggle (not inline in the plain fields).

**Change:**
- `sentence-bank-data.js` — vocalized every Hebrew string via Dicta's Nakdan API (`nakdan-2-0.loadbalancer.dicta.org.il/api`, genre "modern", top-ranked option per word) and added parallel niqqud fields to all 115 sentences: `hebrew_niqqud`, `hebrew_tokens_niqqud`, `hebrew_distractors_niqqud`, and per-`hebrew_alternates` entry `text_niqqud` + `tokens_niqqud`. Nakdan emits standard ktiv-haser-menuqad, so the pointed forms drop matres lectionis vs. the full-spelling plain forms (e.g. `איתך`→`אִתְּךָ`, `עכשיו`→`עַכְשָׁו`); verified every diff is purely mater removal (no consonant corruption). File was regenerated with consistent 2-space JSON indent and niqqud keys ordered next to their plain counterparts. Bumped `__build` to `20260702a`. `cloneSentence()` now also deep-copies `hebrew_tokens_niqqud` and `hebrew_distractors_niqqud`.
- `app/sentence-bank.js` — `prepareSentenceBankDeck()` reads the raw niqqud fields, stores `hebrewNiqqud` on each deck sentence, and builds a plain→niqqud lookup (`hebrewNiqqudByToken`) from raw tokens/distractors/alternate tokens (built from raw arrays so it is unaffected by later sanitize/reorder). `buildQuestionFromPair()` sets `promptNiqqud` (he2en only) and adds a `display` field (niqqud form) to each Hebrew bank token while `text` stays the plain matching value. New helper `sentenceTokenDisplayText(token)` returns the niqqud display only when `state.showNiqqudInline` is on. Rendering swaps only the visible glyphs — filled slots, bank chips, and mouse/touch drag ghosts (`resolveDragPayloadText`) — leaving `buildSentenceFrame`, slot sizing, per-slot correctness (`token.text === piece.tokenText`), and all answer matching on the plain text. Added `getCorrectAnswerDisplayText()` (used only for feedback) so the "Correct/​the Hebrew sentence is…" line shows nikkud when the toggle is on; `getCorrectAnswerText()` stays plain because the frame builder depends on it. `buildSentenceBankMistakeSummary()` shows the niqqud sentence in results when the toggle is on. The prompt path in `app/ui.js` already supported `question.promptNiqqud`, so no UI change was needed there.

**Files changed:** `sentence-bank-data.js` (data + cloneSentence), `app/sentence-bank.js` (deck prep, question build, rendering, feedback), `task-log.md`.

**Behavior changed:** With the נִיקּוּד toggle on, sentence-bank Hebrew now shows vowel points everywhere it appears: the he2en prompt sentence, the Hebrew answer chips and filled slots, the drag ghost, the correct-answer feedback line, and the results mistake list. With the toggle off, all Hebrew renders plain (full spelling) exactly as before. Matching/grading is unchanged — it still compares plain tokens, so answering is unaffected regardless of toggle state. Note: pointed forms use defective spelling, so turning the toggle on/off can change some consonants (matres), which is correct for vocalized Hebrew.

**Tests run:** `npm test` — 213/213 pass (before and after). Browser-verified on the dev server: data exposes niqqud for all 115 sentences; he2en prompt renders with nikkud; en2he Hebrew chips all render with nikkud while carrying plain `text`; placing the correct plain-token order still grades correct; feedback line shows the vocalized sentence; toggling niqqud off leaves no vowel points in the slots; no console errors.

**Risks / regressions to check:** (1) Nikkud accuracy — Nakdan is strong but not perfect on colloquial/modern text; the exact vowel points should be spot-reviewed by a fluent reader (pronunciation is generally correct, but some words may warrant hand-correction). (2) The male↔haser consonant shift between toggle states is expected but may surprise users; confirm it reads acceptably. (3) If a plain token has no niqqud entry (shouldn't happen — every token/distractor was vocalized), `display` falls back to the plain text, so no crash. (4) Matched-alternate feedback falls back to plain text (only the primary sentence's feedback is vocalized); acceptable and rare.

---

### 2026-06-29 — Add follow-the-cursor/finger drag visuals + a drag tip to the sentence builder

**Requested:** In the sentences game, dragging answer tokens to slots works but gives no visual feedback that dragging is a valid interaction (the only confirmation was seeing a slot fill). Add natural visual dragging that follows the cursor/finger, plus an unobtrusive in-game tip ("Tip: you can drag answer blocks to any slot in the sentence.") with a Hebrew translation, styled consistently with other game tips.

**Change:**
- `app/bootstrap-data.js` — added `prompt.sentenceBankDragTip` to both EN ("Tip: drag answer blocks to any slot in the sentence.") and HE ("טיפ: אפשר לגרור אבני תשובה לכל משבצת במשפט.") string tables.
- `app/sentence-bank.js` — `renderSentenceBankBoard()` now renders the drag tip as a `<p class="sentence-drag-tip">` inside the board, positioned between the answer blanks (`sentence-answer-line`) and the word-count meta (`sentence-answer-meta`)/token bank; only shown while the question is unlocked. Also added a floating drag-ghost token that follows the pointer. Mouse path: `applyMouseDragImage()` builds a styled clone and calls `dataTransfer.setDragImage()` in both `dragstart` handlers (slot + bank) so a consistent ghost follows the cursor. Touch path: the ghost is created lazily once the finger moves past an 8px threshold (`SENTENCE_DRAG_ACTIVATE_PX`), repositioned on every `touchmove`, and removed on end/cancel via `clearSentenceDragState()`. Touch drag now activates only after the threshold (taps/small moves no longer hijack scroll or flash a ghost). Helpers added: `resolveDragPayloadText`, `createSentenceDragGhostEl`, `positionSentenceDragGhost`, `showSentenceTouchDragGhost`, `removeSentenceDragGhost`, `applyMouseDragImage`.
- `app/ui.js` — no net change; `renderPromptHint()` left as the original speech-tip logic (an interim version that showed the drag tip in `#promptHint` was reverted when the tip moved into the board).
- `styles.css` — added `.sentence-drag-tip` (centered, 0.75rem, `var(--ink-soft)`, matches the soft look of other in-game tips; the board's grid gap handles spacing). Added `.sentence-drag-ghost` (fixed-position, pointer-events:none, z-index 1200, token-styled, transl(-50%,-135%) so it sits above the finger), `.sentence-drag-ghost.hebrew`, `.sentence-drag-ghost--mouse` (transform reset for the mouse drag image), and a light-theme variant.
- `tests/app-progress.test.js` — `simulateTouchDragAndDrop` now moves the finger from the start point to a distinct point (24,24 → 220,220) so it crosses the new activation threshold, matching a real drag. Updated the "renders english answer lines…" test to assert `#promptHint` stays hidden and that the in-board `.sentence-drag-tip` (queried via `#choiceContainer`) shows the expected EN text during an active question.

**Behavior changed:** Sentence-builder questions now show a drag tip inside the board, directly below the answer blanks and just above the word count and token bank (Hebrew or English per UI language); it disappears once the question is answered/locked. Dragging a token (mouse or touch) now shows a token-styled ghost following the cursor/finger; touch dragging requires an ~8px move to start (small taps still select via tap, page scroll still works until a drag begins).

**Tests run:** `npm test` — 184/184 pass (after updating two affected tests). Browser-verified on the dev server: board child order is `sentence-answer-line → sentence-drag-tip → sentence-answer-meta → sentence-token-bank`, the tip shows the Hebrew text, `#promptHint` stays hidden; synthetic touch drag creates a `.sentence-drag-ghost` (position:fixed, z-index 1200) that tracks the touch point and is removed on touchend; a sub-threshold move creates no ghost; no console errors.

**Risks / regressions to check:** Touch `touchmove` now calls `preventDefault()` once a drag is active, which intentionally locks page scroll during an in-progress drag — verify on a real device that scrolling the token bank still feels normal when not dragging. `setDragImage` is feature-detected and ghost creation guards on `global.document?.body`, so Node tests are unaffected. If the ghost ever appears to "stick," confirm `clearSentenceDragState()` runs on `dragend`/`touchcancel`.

---

### 2026-06-29 — Test ישיבה cleanly in the sentence game + trim basic-food words from the translation quiz

**Requested:** (1) In the sentence-builder, test ישיבה without offering פגישה as a distractor (the "The meeting was postponed…" sentence pitted the synonyms הישיבה vs הפגישה against each other). (2) Re-review the translation-game vocabulary and remove words that are too simple. User chose: suppress (don't delete), conservative-core scope, keep kitchen utensils and cooking verbs, remove basic food only.

**Change:**
- `sentence-bank-data.js` — in `professional_19` (`הישיבה נדחתה…`), replaced the `הפגישה` Hebrew distractor with `השיחה` ("the call/conversation"). No longer a synonym for "meeting"; pairs with the existing English distractor "The call". The other two `הפגישה` distractors (`professional_13`, `professional_16`) test different words (call/launch) and were left unchanged.
- `vocab-data.js` — added 40 basic-food Hebrew words to `LEXICON_AVAILABILITY_OVERRIDES` with `{ translationQuiz: false }` (עגבנייה, מלפפון, בצל, שום, תפוח אדמה, גזר, פלפל, חסה, לימון, תפוח, בננה, תפוז, ענבים, אבטיח, אבוקדו, עוף, דג, ביצה, חלב, גבינה, יוגורט, חמאה, שמנת, לחם, פיתה, אורז, פסטה, קמח, מלח, סוכר, דבש, מיץ, קפה, תה, יין, מחיר, תפריט, מלצר, טיפ, קינוח). This suppresses them from the translation quiz only; they remain available for sentence hints. Kitchen tools, cooking verbs, and borderline discourse/tech words were deliberately kept.

**Files changed:** `sentence-bank-data.js`, `vocab-data.js`, `task-log.md`.

**Behavior changed:** The ישיבה sentence no longer shows פגישה as a tile option. The translation/word-match quiz no longer draws the 40 basic-food words; they still appear as sentence hints. No game logic changed (both fixes are data-only).

**Tests run:** `npm test` 184/184 pass before and after. Browser-verified on the running dev server: `getBaseVocabulary()` reports the food words as `translationQuiz=false, sentenceHints=true` and kept words (קערה, לטגן, הגדרות, אמון) as `translationQuiz=true`; `getSentenceBank()` shows `professional_19` distractors as `["השיחה","בוטלה","אשלח","ישן","מקום"]` (no הפגישה). Grep guard: `הפגישה` remains only in `professional_13` and `professional_16`.

**Risks / regressions to check:** Override keys are bare Hebrew strings that suppress all senses of a word; confirmed each of the 40 appears in exactly one RAW entry (grep count = 2: RAW + override), so no cross-category collisions. `חשבון` was intentionally excluded (polysemous: bill/account/arithmetic). If a future review removes more words, keep verifying single-sense before adding.

---

### 2026-06-29 — Bump cache-bust tokens so the deployed Prepositions fix reaches cached browsers

**Requested:** User reported the Prepositions game still jumps straight to the review/summary screen on the deployed GitHub Pages site, even though the previous session's deploy fix "works in the preview box."

**Root cause:** The server side was already fully fixed by the prior session — verified that the live GitHub Pages deploy is healthy: `index.html` and all 38 referenced scripts/assets return HTTP 200, the latest `deploy-pages.yml` run succeeded, and the live `preposition-data.js` / `app/prepositions.js` are byte-identical to the working local files (live data populates 66 triggers, 8 objects, 11 inflection tables — deck builds non-empty). The remaining problem is purely client-side caching: the cache-bust query tokens on the two prep `<script>` tags (`preposition-data.js?v=20260628d`, `app/prepositions.js?v=20260628e`) were **not** bumped when the deploy fix shipped. Browsers that loaded those exact URLs during the broken window (when the data file 404'd) can keep serving the stale cached response, since the URL key never changed. No service worker is involved, so the HTTP cache keyed on the unchanged URL is the only thing pinning users to the broken state.

**Change:**
- `index.html` — bumped the cache-bust token on the two Prepositions script tags to `?v=20260629a` (`preposition-data.js` and `app/prepositions.js`), forcing every browser to fetch a URL it has never cached. No code logic changed.

**Files changed:** `index.html`, `task-log.md`.

**Behavior changed:** After deploy, all clients (including those with the broken state cached) fetch the corrected prep files and the game plays normally instead of jumping to the summary. A manual hard refresh would have fixed an individual machine, but this fixes it for everyone without one.

**Tests run:** `npm test` 184/184 pass. Live-site verification via `curl` + `diff` + Node (globals populate) as described above.

**Risks / regressions to check:** Must be committed, merged to `main`, and deployed for the new tokens to take effect — until then nothing changes for users. After deploy, confirm the game plays on GitHub Pages from a fresh browser. Going forward, when fixing a deploy/availability bug for an asset, also bump that asset's `?v=` token in `index.html` so cached clients pick up the fix.

---

### 2026-06-28 — Fix Prepositions game jumping straight to summary on GitHub Pages (missing deploy file)

**Requested:** Diagnose why the Prepositions game, when played on the deployed GitHub Pages site, immediately lands on the end-of-game review/summary screen instead of playing (works fine locally).

**Root cause:** The Pages deploy workflow `.github/workflows/deploy-pages.yml` builds `dist/` by copying an explicit, hardcoded list of files. When the Prepositions game was added (PR #13) the workflow was never updated to copy `preposition-data.js`, so that file 404s on GitHub Pages. `PREPOSITIONS`/`PREPOSITION_INFLECTIONS` are therefore undefined in the deployed bundle, `buildPrepositionsDeck()` returns an empty deck, and the first `loadPrepositionsQuestion()` sees an empty `questionQueue` and calls `finishPrepositions()` → session summary. Local dev served the whole directory, so the file was always present there. Verified via `curl`: live `preposition-data.js` returned HTTP 404 (GitHub's "Page not found" HTML) while sibling root data files returned 200.

**Change:**
- `.github/workflows/deploy-pages.yml` — added `cp preposition-data.js dist/` to the "Build static site bundle" step (placed between `hebrew-verbs.js` and `verb-game-data.js`). Cross-checked that the set of root-level `.js` files referenced by `index.html` now exactly matches the set copied by the workflow (no other omissions).

**Files changed:** `.github/workflows/deploy-pages.yml`, `task-log.md`.

**Behavior changed:** After the next deploy, `preposition-data.js` will be published, so the Prepositions game will load its deck and play normally on GitHub Pages instead of jumping to the summary. No change to local behavior.

**Tests run:** `npm test` 184/184 pass. (Deploy-config change; not exercised by the suite.) Diagnosis confirmed by comparing live vs local file hashes and HTTP status codes via `curl`.

**Risks / regressions to check:** Confirm on the deployed site after the workflow runs that `https://mikeesexton.github.io/ulpango/preposition-data.js` returns 200 and the game plays. Going forward, any new game mode that adds a root-level data file must also be added to this workflow's copy list (the hardcoded list is the failure mode here).

---

### 2026-06-28 — Fix false "App error: Unexpected runtime error" banner from resource-load failures

**Requested:** Investigate an "App error: Unexpected runtime error" banner that appears when running the deployed (GitHub Pages) site on iPad, even though the app plays fine.

**Change:**
- `index.html` — the global `error` listener (registered in capture phase) was catching resource-load failures (`<img>`, `<link>`/font, `<script>`) in addition to real JS errors. Those resource errors are not `ErrorEvent`s and carry no `message`, so they fell through to the "Unexpected runtime error" fallback and showed the banner. Added a guard at the top of the handler that returns early when `event.target` is a DOM element (`target !== window && target.tagName`), so only genuine script errors surface the banner.

**Files changed:** `index.html`, `task-log.md`.

**Behavior changed:** Non-fatal resource-load failures (most likely the cross-origin Google Fonts `<link>` being blocked by an iOS content/privacy blocker, with silent fallback to system fonts) no longer trigger the "App error" banner. Genuine uncaught JS errors and unhandled promise rejections still show it.

**Tests run:** `npm test` 184/184 pass (before and after). Browser repro: injecting a broken `<img>` into the DOM produced exactly "App error: Unexpected runtime error" before the fix; after the fix the banner stays hidden for the broken `<img>` but still shows "App error: Uncaught Error: ..." for a thrown error.

**Risks / regressions to check:** Confirm on the actual iPad that the banner no longer appears. If a *critical* resource (e.g. a `<script>` the app depends on) ever fails to load, the banner will no longer announce it — but such a failure would surface as a downstream JS error instead, which is still reported.

---

### 2026-06-28 — Prepositions: add four new inflectable prepositions (אצל, ליד, נגד, כמו)

**Requested:** Implement new inflectable prepositions in the Prepositions game (planned approach: triggers + hints, scope אצל/ליד/נגד/כמו; בשביל deferred).

**Change:**
- `preposition-data.js` — added four new paradigms to `PREPOSITION_INFLECTIONS`: `etsel` (אצל), `leyad` (ליד), `neged` (נגד), `kmo` (כמו), each with `base` + all 8 object forms (plain + niqqud). Added 8 triggers to `PREPOSITIONS` (2 per preposition), each with an English hint that pins the preposition unambiguously and reads naturally with object pronouns: אצל — עובד "to work for {o}" / לומד "to study under {o}"; ליד — יושב "to sit next to {o}" / עומד "to stand next to {o}"; נגד — מצביע "to vote against {o}" / משחק "to play against {o}"; כמו — נראה "to look like {o}" / מתנהג "to behave like {o}".
- `index.html` — bumped the `preposition-data.js` cache-busting query string `?v=20260628c` → `?v=20260628d` (also picks up the 23 triggers from the prior task).

**Files changed:** `preposition-data.js`, `index.html`, `task-log.md`.

**Behavior changed:** Prepositions game now inflects 11 prepositions (was 7) and has 66 triggers (was 58). The four new prepositions appear both as correct answers (via their triggers) and as distractors. No engine, i18n, intro, or test changes were needed — the data is consumed generically.

**Tests run:** `npm test` 184/184 pass (paradigm-coverage and option-builder tests auto-validate the 4 new paradigms; trigger test validates the 8 new triggers). Browser smoke check: 11 paradigm keys, each new paradigm has 8 distinct niqqud forms, 66 triggers, all 8 new trigger ids produce deck questions, `buildPrepositionOptions("kmo","3ms")` → 4 options with correct כָּמוֹהוּ, no console errors.

**Suggested follow-up:** בשביל (distractor-only, overlaps ל); plural-base prepositions לפני / אחרי / בלעדי (yod-suffix paradigms).

**Risks / regressions to check:** (1) Niqqud accuracy needs a native-speaker spot-check, especially the irregular כמו set (כָּמוֹהוּ / כָּמוֹהָ / כְּמוֹהֶם) and the 2ms/2fs minimal pairs across all four. (2) Separately noted: `verb-game-data.js` is still loaded as `?v=20260621a` in index.html despite the many roots added this session — its cache string should be bumped so deployed/returning users get the new roots (out of scope for this task, flagged for follow-up).

---

### 2026-06-28 — Prepositions: add 23 new governed-preposition triggers

**Requested:** Add 23 new prepositional-phrase triggers to the Prepositions game (new inflectable prepositions deferred to a later task).

**Change:**
- `preposition-data.js` — appended 23 triggers to the `PREPOSITIONS` array, each governing an existing inflectable preposition (no new paradigms): ל — מפריע/מספר/מודה/מרשה/מתאים; על — כועס/סומך/ממליץ/חולם/אחראי; ב — תומך/נוגע/בוחר/תלוי/מעוניין; עם — נפגש/רב/מתווכח; מ — מתעלם/מבקש/סובל/נפרד/מאוכזב. Each entry has a unique `prep-*` id, a `type`, an `he` citation form, the governed `prep` key, and an `en` gloss with the `{o}` object slot.

**Files changed:** `preposition-data.js`, `task-log.md`.

**Behavior changed:** Prepositions game grows from 35 to 58 triggers; the generated deck goes from 280 to 464 questions (58 triggers × 8 object inflections). Rounds still draw `PREPOSITIONS_ROUNDS` at random. No engine or test changes were needed — triggers reference existing inflection tables and distractors are auto-generated.

**Tests run:** `npm test` 184/184 pass (incl. the trigger-validation, option-builder, and deck-builder tests). Browser smoke check: 58 triggers load, no duplicate ids, all reference valid paradigms, all have the `{o}` slot, deck builds to 464 questions, no console errors.

**Suggested follow-up:** Add new inflectable prepositions (paradigms) — e.g. בשביל, אצל, כמו, נגד, ליד — each requiring all 8 object forms with niqqud and a check against the distractor pool. More trigger candidates also remain (נזכר ב, מתמקד ב, חוזר על, יוצא עם, מתרשם מ).

**Risks / regressions to check:** Native-speaker spot-check of governance is advisable (esp. מתאים ל "suits", תלוי ב "depends on", מבקש מ "request from"). The larger deck (464) is fine since rounds sample a fixed subset.

---

### 2026-06-28 — Binyanim: add ע"ע geminate roots (ס־ב־ב, מ־ד־ד)

**Requested:** Add more roots; user chose the ע"ע geminate (כפולים) direction — the last missing structural class.

**Change:**
- `verb-game-data.js` — added two geminate roots. `s-b-b` (ס־ב־ב, turning/surrounding): paal סָבַב / nifal נָסַב / piel סִבֵּב / hifil הֵסֵב / hufal הוּסַב / hitpael הִסְתּוֹבֵב (6 forms; pual `exists: false`). `m-d-d` (מ־ד־ד, measuring/coping): paal מָדַד / nifal נִמְדַּד / hitpael הִתְמוֹדֵד (3 forms). Geminate hitpa'els carry `actual_binyan: "hitpolel"` (documentation only — confirmed `actual_binyan` is not consumed by any UI code). The pair is a teaching contrast: הִסְתּוֹבֵב adds ס-metathesis to the geminate base, while הִתְמוֹדֵד keeps its order (מ is not a sibilant).
- `app/binyan-board.js` — registered three new teaching points in `TEACHING_POINT_KEYS`: geminateHifil (הֵסֵב), geminateHitpaelSibilant (הִסְתּוֹבֵב), geminateHitpael (הִתְמוֹדֵד).
- `app/bootstrap-data.js` — added en + he strings for the three new teaching keys under `binyan.teaching`.
- `tests/verb-game-data.test.js` — root count 25→27; added `m-d-d` to the ≥4-form exemption list (now `["ts-l-m", "b-y-n", "k-y-m", "m-d-d"]`); playable-form upper bound 130→145 (count went 121→130, was exactly at the old ceiling).

**Files changed:** `verb-game-data.js`, `app/binyan-board.js`, `app/bootstrap-data.js`, `tests/verb-game-data.test.js`, `task-log.md`.

**Behavior changed:** Binyanim pool grows 25→27 roots. The ע"ע geminate class is now represented, including the collapsed geminate hif'il (הֵסֵב) and the geminate hitpolel with/without metathesis (הִסְתּוֹבֵב vs הִתְמוֹדֵד), each with a localized teaching note. With this, all major weak-verb classes are covered.

**Tests run:** `npm test` 184/184 pass. Browser smoke check: 27 roots load, ס־ב־ב = 6 forms / מ־ד־ד = 3 forms, all 19 teaching points resolve in en + he, no console errors.

**Suggested roots still left to add:** none structurally required. Remaining options are pure vocabulary breadth (more שלמים, or פ"א initial-alef like א־כ־ל / א־ה־ב).

**Risks / regressions to check:** Native-speaker spot-check advisable for the geminate forms — especially נָסַב (formal register), הֵסֵב / הוּסַב (the "endorse/divert" senses), and the geminate vocalizations. If a future batch pushes playable forms past 145, bump the test upper bound again.

---

### 2026-06-28 — Binyanim: add ק־י־ם as a minimal-pair contrast to ק־ו־ם

**Requested:** Add ק־י־ם (kym) without causing problems with the existing look-alike ק־ו־ם (kwm).

**Change:**
- `verb-game-data.js` — added root `k-y-m` (ק־י־ם, ע"י): piel קִיֵּם / pual קֻיַּם / hitpael הִתְקַיֵּם (3 forms; paal/nifal/hifil/hufal marked `exists: false`, since those senses belong to ק־ו־ם). Unlike hollow ק־ו־ם (polel/polal/hitpolel), its `actual_binyan` values are the plain piel/pual/hitpael — the yod acts as a full consonant, which is the lesson. Also updated the `k-w-m` `notes` field: the sibling קִיֵּם/הִתְקַיֵּם forms are no longer described as "NOT listed here" but as living in their own root entry as a deliberate minimal pair.
- `app/binyan-board.js` — registered one new teaching point in `TEACHING_POINT_KEYS` (`ayinYodStrong`) on הִתְקַיֵּם.
- `app/bootstrap-data.js` — added `ayinYodStrong` en + he strings under `binyan.teaching`.
- `tests/verb-game-data.test.js` — root count 24→25; added `k-y-m` to the 3-playable-form exemption list (now `["ts-l-m", "b-y-n", "k-y-m"]`). Playable-form count went 118→121, still under the 130 ceiling (no bound change).

**Files changed:** `verb-game-data.js`, `app/binyan-board.js`, `app/bootstrap-data.js`, `tests/verb-game-data.test.js`, `task-log.md`.

**Behavior changed:** Binyanim pool grows 24→25 roots. ק־ו־ם and ק־י־ם now coexist as an explicit ע"ו/ע"י minimal pair (קוֹמֵם/הִתְקוֹמֵם vs קִיֵּם/הִתְקַיֵּם), each cross-referenced in its notes, with a localized teaching note on הִתְקַיֵּם. No collision: the game keys everything off `root.id`; `root_letters`/Hebrew string are display-only, and no `form_plain` overlaps between the two roots.

**Tests run:** `npm test` 184/184 pass. Browser smoke check: 25 roots load, both k-w-m and k-y-m present, k-y-m forms = piel,pual,hitpael, all 16 teaching points resolve in en + he, no console errors.

**Suggested roots still left to add:** none outstanding from the original gizra-gap list; all major weak-verb classes and the ע"ו/ע"י minimal pair are now represented.

**Risks / regressions to check:** Native-speaker spot-check still advisable for קֻיַּם register (less common than קִיֵּם / הִתְקַיֵּם). If a future batch pushes playable forms past 130, bump the test upper bound.

---

### 2026-06-28 — Binyanim: add third root batch (ל"א, ע"י, פ"נ)

**Requested:** Add the next roots (the remaining tracked leftovers).

**Change:**
- `verb-game-data.js` — added three roots: `k-r-aa` (ק־ר־א, ל"א alternate to מ־צ־א: paal/nifal/hifil/hufal), `b-y-n` (ב־י־ן, ע"י hollow — the genuinely new gizra, counterpart to ק־ו־ם: hifil/hufal/hitpael, hitpa'el realized as hitpolel הִתְבּוֹנֵן), `n-g-d` (נ־ג־ד, second פ"נ root: paal/hifil/hufal/hitpael, נ assimilates in הִגִּיד/הֻגַּד). All forms hand-verified; rare הֻקְרָא marked `distractor_eligible: false`. All teaching points reuse existing i18n keys (hollowReflexive for הִתְבּוֹנֵן, the generic פ"נ "נ stays put" note for הִתְנַגֵּד) — no new i18n strings needed.
- `tests/verb-game-data.test.js` — root count 21→24; added `b-y-n` to the 3-playable-form exemption alongside `ts-l-m`; playable-form upper bound 115→130 (count went 107→118).

**Files changed:** `verb-game-data.js`, `tests/verb-game-data.test.js`, `task-log.md`.

**Behavior changed:** Binyanim pool grows 21→24 roots (rounds still draw 6 at random). Adds the ע"י hollow class (contrasting the existing ע"ו קום), a second ל"א root, and a second פ"נ root. ב־י־ן is the first root in the game with only three playable forms besides צ־ל־ם.

**Tests run:** `npm test` 184/184 pass. Browser smoke check: 24 roots load, new forms present, all 15 teaching points resolve in en + he, no console errors.

**Suggested roots still left to add:** ק־י־ם (ע"י, would pair directly with ק־ו־ם via the yod/vav contrast — deferred because it overlaps the entangled-root warning already in the ק־ו־ם notes); otherwise the originally-suggested gizra gaps are now all represented.

**Risks / regressions to check:** Native-speaker spot-check still advisable for the newest forms (הֻקְרָא register, נָגַד paal usage, the הִתְבּוֹנֵן hitpolel vocalization). If a future batch pushes playable forms past 130, bump the test upper bound again.

---

### 2026-06-28 — Binyanim: reword התנפל gloss and add second root batch

**Requested:** Try a different gloss for הִתְנַפֵּל, then add the next batch of roots.

**Change:**
- `verb-game-data.js` — changed the `n-p-l` hitpa'el gloss from "pounced on, assaulted" to "attacked, lunged at". Added three roots covering classes the pool still lacked: `a-m-d` (ע־מ־ד, פ"ע initial-guttural: paal/nifal/hifil/hufal), `r-aa-h` (ר־א־ה, ל"ה + middle guttural, high-frequency: paal/nifal/hifil/hufal/hitpael), `m-ts-aa` (מ־צ־א, ל"א quiescent-alef: paal/nifal/hifil/hufal/hitpael). All vocalized forms authored and hand-verified; rare הֻרְאָה marked `distractor_eligible: false`.
- `app/binyan-board.js` — registered two new teaching points in `TEACHING_POINT_KEYS` (peGuttural, lamedAlefQuiescent). peGuttural is attached to both the ע־מ־ד nifal and hifil forms.
- `app/bootstrap-data.js` — added en + he i18n strings for the two new teaching keys.
- `tests/verb-game-data.test.js` — updated the hardcoded root count 18→21 and the playable-form upper bound 95→115 (count went 93→107).

**Files changed:** `verb-game-data.js`, `app/binyan-board.js`, `app/bootstrap-data.js`, `tests/verb-game-data.test.js`, `task-log.md`.

**Behavior changed:** Binyanim pool grows 18→21 roots (rounds still draw 6 at random). The classes פ"ע (guttural) and ל"א (quiescent alef) now appear, plus the high-frequency seeing/showing root ר־א־ה, each with localized teaching notes. The נ־פ־ל reflexive now reads "attacked, lunged at".

**Tests run:** `npm test` 184/184 pass. Browser smoke check via preview: 21 roots load, changed gloss present, all 13 teaching points resolve to localized text, no console errors.

**Suggested roots still left to add:** שׂ־י־ם or ב־י־ן (ע"י hollow, to contrast existing ע"ו קום), ק־ר־א as an alternate ל"א, and נ־ג־ד as an alternate פ"נ.

**Risks / regressions to check:** The new vocalized forms (especially נֶעֱמַד/הֶעֱמִיד/הֻעֲמַד hataf vowels, הֻרְאָה, and the הִתְמַצֵּא "well-versed" sense) should get a native-speaker spot-check. If a future batch pushes playable forms past 115, bump the test upper bound again.

---

### 2026-06-28 — Add four new roots to the Binyanim game

**Requested:** Add as many new roots to the Binyanim game as could be authored reliably, and track any suggested roots left for later.

**Change:**
- `verb-game-data.js` — added four roots, each introducing a גזרה / spelling phenomenon the existing 14 roots did not cover: `n-p-l` (נ־פ־ל, פ"נ nun-assimilation: paal/hifil/hufal/hitpael), `y-sh-v` (י־שׁ־ב, פ"י initial-yod, all 7 slots), `k-n-h` (ק־נ־ה, ל"ה weak final radical: paal/nifal/hifil/hufal), `z-m-n` (ז־מ־ן, voiced-sibilant metathesis הזדמן, completing the ס/צ/ז trio: piel/pual/hifil/hufal/hitpael). All vocalized forms authored and hand-verified; rare/less-common passives marked `distractor_eligible: false`.
- `app/binyan-board.js` — registered four new teaching points in `TEACHING_POINT_KEYS` (peNunAssimilation, peNunNoAssimilation, peYodConsonant, voicedSibilantMetathesis).
- `app/bootstrap-data.js` — added en + he i18n strings for the four new teaching keys.
- `tests/verb-game-data.test.js` — updated the hardcoded root count 14→18 and the playable-form upper bound 75→95 (count went 73→93).

**Files changed:** `verb-game-data.js`, `app/binyan-board.js`, `app/bootstrap-data.js`, `tests/verb-game-data.test.js`, `task-log.md`.

**Behavior changed:** The Binyanim game pool grows from 14 to 18 roots (rounds still draw 6 at random), so weak-verb classes פ"נ/פ"י/ל"ה and the ז voiced-sibilant metathesis can now appear, each with its own localized teaching note on correct/incorrect feedback.

**Tests run:** `npm test` 184/184 pass (before and after). Browser smoke check via preview: app loads with no console errors; all 18 roots present with expected form slots.

**Suggested roots still left to add (from this session's suggestions):** מ־צ־א or ק־ר־א (ל"א quiescent alef), ע־מ־ד (פ"ע initial guttural), שׂ־י־ם or ב־י־ן (ע"י hollow, to contrast existing ע"ו קום), ר־א־ה (ל"ה + guttural, high frequency), and נ־ג־ד as an alternate פ"נ. These were deferred to keep this batch to forms that could be authored with high confidence.

**Risks / regressions to check:** New vocalized forms should get a native-speaker spot-check (especially יִשֵּׁב/יֻשַּׁב register and the הִתְנַפֵּל "assault" gloss). If a future batch pushes playable forms past 95, bump the test upper bound again.

---

### 2026-06-28 — Clean up feedback and mistake-clinic copy

**Requested:** Clean up the awkward end-of-game Binyanim feedback from the screenshot and review the other games' tips/feedback for similar improvements.

**Change:**
- `app/bootstrap-data.js` — replaced the repeated/raw "Clinic:" wrapper with direct note text, rewrote Binyanim clinic copy to "Pattern..." phrasing, removed "Factitive" from learner-facing Binyanim hints, shortened Sentence Builder tips from "Game tip" to "Tip", and tightened Prepositions/Conjugation+ feedback and result-clinic copy.
- `app/binyan-board.js` — Binyanim mistake summaries now prefer the actual missed form's function for result feedback, falling back to the slot hint only when needed.
- `app/sentence-bank.js` — Sentence Builder result-clinic notes now reuse the learner-facing note rewrite while preserving notes that already read like advice.
- `tests/app-progress.test.js`, `tests/verb-game-data.test.js` — updated copy expectations and added coverage for the cleaner Binyanim clinic output.

**Files changed:** `app/bootstrap-data.js`, `app/binyan-board.js`, `app/sentence-bank.js`, `tests/app-progress.test.js`, `tests/verb-game-data.test.js`, `task-log.md`.

**Behavior changed:** Binyanim result rows now read like `Pattern: פִּעֵל carries a causative meaning here.` instead of `Clinic: פִּעֵל usually signals Factitive Active.` Prepositions and Conjugation+ clinic lines are shorter, Sentence Builder tips are less clunky, and authored Sentence Builder notes are less likely to leak developer-ish wording into the end summary.

**Tests run:** `npm test` 184/184 pass. `git diff --check` clean.

**Risks / regressions to check:** The Binyanim function labels are friendlier but still grammatical shorthand. If later user testing shows the labels are still too technical, the next pass should add one-sentence examples per binyan rather than only renaming the category.

---

### 2026-06-28 — Hide recommended simple common verbs from Translation

**Requested:** Remove all previously recommended too-simple common verbs from the Translation game.

**Change:**
- `hebrew-verbs.js` — changed these common-verb entries to `{ translationQuiz: false, sentenceHints: true }`: `common-verb-laanot` (to answer), `common-verb-laasot` (to do/make), `common-verb-ladaat` (to know), `common-verb-lashir` (to sing), `common-verb-ledaber` (to speak/talk), `common-verb-lehavi` (to bring), `common-verb-lehavin` (to understand), `common-verb-lichyot` (to live), `common-verb-liknot` (to buy), `common-verb-likro` (to read/call), `common-verb-limtzo` (to find), `common-verb-lirtzot` (to want), `common-verb-lishol` (to ask), and `common-verb-lishon` (to sleep). `common-verb-leehov` was already hidden in the prior pass and remains hidden.
- `tests/hebrew-verbs.test.js` — expanded the per-mode availability regression to cover the whole hidden common-verb set and all generated sense entries.
- `index.html` — bumped the `hebrew-verbs.js` cache query string to `20260628g`.

**Files changed:** `hebrew-verbs.js`, `tests/hebrew-verbs.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Translation no longer draws those basic/common infinitives, but they remain available for Conjugation and sentence hints.

**Tests run:** `npm test` 184/184 pass. Data check: 15 hidden common-verb base IDs checked, `visibleCount: 0` among generated Translation-eligible seed entries.

**Risks / regressions to check:** Translation pool size drops by more than the number of base verbs because multi-sense entries generate multiple seed vocabulary entries. This is intentional but worth remembering if pool-size expectations change.

---

### 2026-06-28 — Hide "to love / to like" from Translation

**Requested:** Remove "to love" from the Translation game and recommend other too-simple vocabulary to consider removing.

**Change:**
- `hebrew-verbs.js` — changed `common-verb-leehov` (`לאהוב`, senses "to love" / "to like") availability to `{ translationQuiz: false, sentenceHints: true }`, keeping it available for Conjugation and sentence-hint contexts while excluding it from Translation.
- `tests/hebrew-verbs.test.js` — extended the per-mode availability test to assert both `common-verb-leehov` sense entries stay hidden from Translation and available for sentence hints.
- `index.html` — bumped the `hebrew-verbs.js` cache query string.

**Files changed:** `hebrew-verbs.js`, `tests/hebrew-verbs.test.js`, `index.html`.

**Behavior changed:** The Translation game no longer draws `לאהוב` for "to love" or "to like"; the verb remains in the conjugation data.

**Tests run:** `npm test` 184/184 pass.

**Recommendations:** Strong next prune candidates from the still-translation-enabled common verbs: `לשיר` (to sing), `לישון` (to sleep), `לקנות` (to buy), `לקרוא` (to read/call), `לשאול` (to ask), `לענות` (to answer), `להביא` (to bring), `למצוא` (to find). Possible second wave: `לחיות` (to live), `לרצות` (to want), `לדעת` (to know), `להבין` (to understand), `לעשות` (to do/make), `לדבר` (to speak/talk).

**Risks / regressions to check:** None expected; this uses the existing availability gate. If the app is already open, the bumped script URL takes effect on reload.

---

### 2026-06-28 — Results mistake clinic: richer teaching notes where data supports it

**Requested:** Turn the existing session-mistake summaries into a more useful mistake clinic wherever practicable, without inventing weak explanations for modes that do not have enough structured data.

**Change:**
- `app/ui.js`, `styles.css`, `app/bootstrap-data.js` — result summaries now switch the section heading from "Session Mistakes" to "Mistake Clinic" when any missed item includes a clinic note; compact rows and verb-form groups can render an extra teaching line. Added EN/HE i18n for clinic labels and explanation templates.
- `app/sentence-bank.js` — sentence-builder mistake summaries now carry each sentence's authored `notes` as a clinic focus line.
- `app/prepositions.js` — generated questions now retain trigger/preposition/object metadata; missed answers explain which preposition the trigger governs and which object inflection was required.
- `app/adv-conj.js`, `app/bootstrap-runtime.js`, `app/session.js` — Conjugation+ now stores exact missed-question snapshots with subject, tense, and object context, falling back to the prior idiom-level summary when needed.
- `app/binyan-board.js` — Binyanim mistake summaries now reuse localized function hints and teaching-point explanations.
- `index.html` — bumped cache query strings for the touched browser assets.
- `tests/app-progress.test.js` — added focused regression coverage for clinic rendering plus Sentence Builder, Prepositions, Conjugation+, and Binyanim clinic data.

**Files changed:** `app/ui.js`, `styles.css`, `app/bootstrap-data.js`, `app/sentence-bank.js`, `app/prepositions.js`, `app/adv-conj.js`, `app/bootstrap-runtime.js`, `app/session.js`, `app/binyan-board.js`, `index.html`, `tests/app-progress.test.js`.

**Behavior changed:** Results now become a "Mistake Clinic" for modes with reliable teaching context: Sentence Builder shows authored notes, Prepositions explains governed preposition + inflected object, Conjugation+ calls out subject/tense/object axes, and Binyanim shows function/teaching-point notes. Plain answer lists remain simple where no trustworthy rule context exists.

**Tests run:** `npm test` 184/184 pass. Browser smoke check on `http://localhost:8081`: completed a Prepositions session with misses; results showed "Mistake Clinic" and a rule line like "מחכה governs ל; here it is inflected for you (pl.), so use מחכה לָכֶם." No boot error.

**Risks / regressions to check:** Some clinic text still mixes English object labels inside Hebrew UI for Prepositions/Conjugation+ because those object labels are currently English-only data. A future pass could add localized object labels if the Hebrew UI needs fully Hebrew explanations.

---

### 2026-06-28 — Progress tracker: track Prepositions + match home-tile emojis

**Requested:** (1) The Game Mode Performance tracker (home + review pages) should track the Prepositions game. (2) The tracker's mode emojis should match the homepage game-tile emojis.

**Change:**
- `app/data.js` — `calculateGameModeStats` now includes a `prepositions` bucket and aggregates `STORAGE_KEYS.prepositionsStats` (mirrors the advConj/binyan aggregation).
- `app/ui.js` — `renderGameModePerformance`: added a Prepositions card (🔗, `game.prepositionsName`), corrected the existing emojis to match the homepage tiles (conjugation 🔗→🏃, abbreviation ⏩→✂️), and added `sentenceBank`/`prepositions` to the fallback stats object. Now all five cards use the same emoji as their homepage tile: Sentences 🧩, Conjugation 🏃, Abbreviation ✂️, Prepositions 🔗, Binyanim 🌳.
- `tests/app-progress.test.js` — added `preposition-data.js` + `app/prepositions.js` to the harness script list and a new test asserting two answers (1 correct, 1 wrong) persist to `prepositionsStats`, aggregate into `modeStats.prepositions`, and render a "Prepositions" card with 🔗 and "✅ 1  ❌ 1".
- `index.html` — bumped `?v=` to `20260628d` on `app/data.js` and `app/ui.js`.

**Files changed:** `app/data.js`, `app/ui.js`, `tests/app-progress.test.js`, `index.html`.

**Behavior changed:** The Prepositions game's correct/incorrect counts now appear as their own card (with accuracy ring) in the Game Mode Performance tracker on both the home and review screens. The conjugation and abbreviation cards now show the same emoji as their homepage tiles (previously 🔗 and ⏩, which no longer matched).

**Tests run:** `npm test` 179/179 pass (added 1). Verified in browser preview: simulated 1 correct + 1 wrong prepositions answer; the review tracker shows a מילות יחס card with 🔗 and ✅ 1 ❌ 1 (half green/red ring), and the other cards read 🧩/🏃/✂️/🌳 matching the home tiles. `prepositionsStats` persisted `{attempts:2,correct:1}`. No console errors.

**Risks / regressions to check:** The "Conjugation" tracker card still aggregates both Conjugation (verbMatch) and Conjugation+ (advConj) progress under one card titled "Conjugation" with the 🏃 emoji — by design, not 1:1 with the 7 home tiles (there is no separate Conjugation+ or Translation card). If a separate Conjugation+ card is ever wanted, advConj would need its own bucket split out of `conjugation`.

---

### 2026-06-28 — Prepositions mode: legible עם spelling + speech no longer reveals answer

**Requested:** (1) "with them" rendered as אִתָּם (normative defective niqqud) is hard to read — spell it איתם (with the yod). (2) The prompt sound button spoke the trigger *and* the preposition, giving away the answer.

**Change:**
- `preposition-data.js` — switched the whole `im` (עם) paradigm's `niqqud` forms to plene vocalized spelling with the yod (אִיתִּי, אִיתְּךָ, אִיתָּם, …) so every comitative form stays legible on the answer buttons. `plain` forms were already plene; unchanged.
- `app/prepositions.js` — added `triggerHe` to each deck question and changed `getPrepositionsPromptSpeechPayload` to speak only `triggerHe` (e.g. "מסכים"), never the answer string. Previously it read `answerPlain`/`answerNiqqud`, which included the correct preposition.
- `index.html` — bumped `?v=` to `20260628c` on `preposition-data.js` and `app/prepositions.js`.

**Files changed:** `preposition-data.js` (im niqqud forms), `app/prepositions.js` (triggerHe + prompt speech payload), `index.html` (cache versions).

**Behavior changed:** עם answer options now display with the yod (e.g. אִיתָּם), and the prompt speaker reads only the trigger word, so it no longer reveals the governed preposition.

**Tests run:** `npm test` 178/178 pass. Verified in browser preview: all 8 `im` forms contain the yod (3mp = אִיתָּם); rendered a live "מסכים ____ / to agree with them" question showing אִיתָּם as an option; speech payload for that question = `{text:"מסכים"}` with the preposition absent. No console errors.

**Risks / regressions to check:** Plene-with-niqqud (ktiv male menukad) for עם is a deliberate legibility choice over strict normative defective spelling — worth a glance from a native speaker, but consistent across the paradigm. The מ paradigm's 1pl (מֵאִתָּנוּ) still uses defective את internally; left as-is since it wasn't flagged and reads fine.

---

### 2026-06-28 — Prepositions mode: cache-bust fix + center home tiles

**Requested:** On the user's server (localhost:8080) the new Prepositions tile showed the raw key `game.prepositionsName` and clicking it did nothing; also: center the home-screen game tiles.

**Cause:** The prior task edited existing JS files (controller.js, bootstrap-data.js, etc.) but did not bump their `?v=` cache-busting query strings in `index.html`, so browsers served stale cached copies — old `bootstrap-data.js` lacked the `prepositionsName` key (raw key shown) and old `controller.js` lacked the click handler (dead tile). The new files loaded fresh, which is why only those worked.

**Change:**
- `index.html` — bumped `?v=` to `20260628b` on every file touched by the Prepositions work: `styles.css`, `preposition-data.js`, `app/{constants,bootstrap-data,bootstrap-runtime,session,ui,prepositions,controller}.js`.
- `styles.css` — converted `.home-lesson-grid` from CSS grid to centered flex-wrap (`display:flex; flex-wrap:wrap; justify-content:center`) with per-breakpoint `flex-basis` calc for 2/3-per-row. The in-game `.game-picker` was split out of the shared rules and left as grid. Fixes the orphaned 7th tile (now centered in its row).

**Files changed:** `index.html` (version queries), `styles.css` (home tile grid → centered flex at base + 3 media-query breakpoints).

**Behavior changed:** Prepositions tile now shows its localized name (מילות יחס / Prepositions) and launches the game on click once the browser fetches the fresh JS. Home-screen tiles are horizontally centered, so an incomplete last row (e.g. the 7th tile) sits centered rather than left/column-aligned.

**Tests run:** `npm test` 178/178 pass. Verified in browser preview: Hebrew tile name resolves to `מילות יחס` (note also localized), clicking launches the session (mode `prepositions`, queue populated), and the 7-tile grid renders with the last tile centered. No console errors.

**Risks / regressions to check:** Users with the page already open must hard-reload (or the bumped `?v=` will force it on next load). The flex `flex-basis` calcs assume the per-breakpoint gap values (0.65/0.58/0.54rem) — if those gaps change, update the calc divisors. `.game-picker` intentionally unchanged.

---

### 2026-06-28 — New game mode: Prepositions (governed prepositions, inflected)

**Requested:** Build a game to test Hebrew prepositions like מתגעגע אליך. User chose (1) test *both* the preposition a word governs and its inflection for the object, and (2) a unified content net spanning verbs, adjectives, and expressions. Then approved building it.

**Change:** New multiple-choice mode cloned from the `advConj` flow. Each question shows a trigger + blank (e.g. `מתגעגע ____`) with an English hint ("to miss you (m.sg.)"); the player picks the correctly inflected preposition. Distractors are generated, not authored: two are *other* governed prepositions inflected to the same object (tests choice — e.g. עָלֶיךָ next to אֵלֶיךָ), one is the *right* preposition inflected to a different object (tests inflection). Options render with niqqud (vowels are what distinguish many forms; plain לך serves both 2ms/2fs). Reuses the shared streak/score, intro overlay, speech, feedback, and session-summary machinery.

Data model in new `preposition-data.js`: a per-preposition inflection table (אל, על, ל, ב, מ, עם, and accusative את used mainly as a distractor base) × 8 object pronouns, plus 35 triggers each keyed to one preposition with an English `{o}` template. Triggers tested:
- אל: מתגעגע (miss), ניגש (approach), פונה (turn to), מתייחס (relate to)
- ל: מחכה (wait for), דואג (worry about), עוזר (help), מצפה (look forward to), שייך (belongs to), מתרגל (get used to), דומה (similar to)
- על: חושב (think about), מסתכל (look at), שומע (hear about), מוותר (give up on), שומר (look after), מגן (protect), משפיע (influence), צוחק (laugh at)
- ב: מאמין (believe in), מטפל (take care of), משתמש (use), מקנא (envy), בוטח (trust), גאה (proud of), מאוהב (in love with)
- עם: מדבר (talk with), מסכים (agree with), מתחתן (marry)
- מ: נהנה (enjoy), פוחד (afraid of), שונה (different from), מרוצה (satisfied with), אכפת לי (care about), נמאס לי (fed up with)

**Files changed:**
- `preposition-data.js` (new) — inflection tables, object list, 35 triggers; exposes globals + CommonJS export.
- `app/prepositions.js` (new) — engine: deck/option builder (pure `buildPrepositionOptions`), start/intro/load/render/answer/stats/mistake-summary.
- `app/constants.js` — `PREPOSITIONS_ROUNDS = 10`, `STORAGE_KEYS.prepositionsStats`.
- `app/bootstrap-runtime.js` — element refs + `state.prepositions` slice.
- `app/bootstrap-data.js` — EN + HE i18n (game name/note, feedback correct/wrong/detail, summary title).
- `app/session.js` — active guards, `isModeSessionActive`, leave/summary cleanup, `resetPrepositionsState`/`clearPrepositionsIntro`/`finishPrepositions`.
- `app/ui.js` — render dispatch, header progress, layout/feedback gating, prompt-speech payload, mode-title block, home-tile highlight.
- `app/controller.js` — home/start button listeners, intro-overlay array, `openHomeLesson`/`continueFromResults`/`handleNextAction` cases.
- `index.html` — home tile (🔗), intro overlay, `preposition-data.js` + `app/prepositions.js` script tags.
- `tests/prepositions-data.test.js` (new) — paradigm completeness, trigger validity, option-builder invariants, deck answer strings.

Note: app.js was intentionally NOT touched — session.js/ui.js reference `app.*` directly, so the mode wires in without changing the boot/validation glue.

**Behavior changed:** New "Prepositions" tile on the home lesson grid launches a 10-round MCQ session with its own summary and persisted stats. No change to existing modes.

**Tests run:** `npm test` 178/178 pass (174 prior + 4 new), green before and after. Verified in browser preview (port 3000): launched the mode, answered correct (score/streak/feedback/highlight/localStorage stats all correct), confirmed distractor design live (בוטח → בִּי vs עָלַי/אִתִּי/בּוֹ; מוותר → עָלֶיךָ vs אֵלֶיךָ), and the end-of-session summary renders ("Prepositions Complete", 90% ring, mistake list מוותר עָלֶיךָ). No console errors.

**Risks / regressions to check:** Hand-authored niqqud on the inflection tables warrants a native-speaker proofread (esp. מ: מֵאִתָּנוּ for 1pl, and the עם/את comitative forms). Object pool is applied to every trigger, so a few random pairings read oddly (e.g. "marry us") though all are grammatical. Score accounting mirrors advConj (`correct = ROUNDS - wrong`), which assumes the player completes all 10 rounds. Same-object/different-preposition distractors lean on the inflection tables having no cross-preposition niqqud collisions — covered by the new test.

---

### 2026-06-27 — Conjugation game: add 20 common verbs (irregular focus)

**Requested:** Add new verbs to the conjugation game, targeting common verbs with a focus on irregulars — a curated list where the conjugations can be produced reliably, then implement all 20 in one pass. User approved the proposed 20-verb list and the default difficulty/priority scheme.

**Change:** Appended 20 fully-curated `createVerbEntry` records to the `STARTER_VERBS` array in `hebrew-verbs.js` (ids prefixed `common-verb-*`), each with complete present/past/future/imperative form sets (plain + niqqud via `markedForm`). `conjugation_mode: "curated"`, `review_status: "approved"`, so stored forms are authoritative (no generation). All available in translation quiz + sentence hints. Verbs added:
- ל"ה: לעשות (do/make), לרצות (want), לקנות (buy), לענות (answer), לחיות (live)
- ל"א: לקרוא (read/call), למצוא (find)
- guttural/other paal: לשאול (ask), לשמוע (hear), לחזור (return), לאהוב (love)
- פ"י / doubly-weak / פ"נ: לדעת (know), לצאת (go out), לישון (sleep), ליפול (fall)
- hollow paal: לקום (get up), לשיר (sing)
- hifil: להבין (understand), להביא (bring)
- piel: לדבר (speak)

`difficulty_level` 2–4 by complexity; `personal_priority` 55–67 (below existing seeds); `category` defaults to `core_advanced`.

**Files changed:** `hebrew-verbs.js` (added 20 verb entries before the `STARTER_VERBS` array close).

**Behavior changed:** Conjugation game (and translation quiz / sentence hints) now include 20 additional common verbs, heavily weighted toward irregular roots that were previously underrepresented (almost all prior irregulars were paal; this adds ל"ה, ל"א, hifil-hollow, and piel coverage).

**Tests run:** `npm test` 174/174 pass (before and after). Also loaded `hebrew-verbs.js` under Node to confirm all 20 entries parse and each carries 4 complete tense sets. Browser preview skipped: data-only change consumed via the same curated-verb path as existing working game verbs, and port 3000 was held by another session's dev server.

**Risks / regressions to check:** Hand-authored niqqud is worth a native-speaker proofread — particularly rarely-used imperative forms (e.g. לישון יְשַׁן, ליפול נְפֹל) and the pe-guttural future vocalization of לחזור (תַּחֲזֹר vs. תַּחְזְרִי). The special cholam future of לאהוב (אֹהַב/תֹּאהַב) means its 1s future plain spelling "אוהב" collides with the present masculine — intentional and correct, but visually identical in the game.

---

### 2026-06-27 — Home page: stop clipping emoji mode icons (rocket/scissors corners)

**Requested:** The emoji icons on the home "Choose Your Lesson" tiles looked cropped into rounded shapes — visible at the edges of the Conjugation+ rocket 🚀 and Abbreviation scissors ✂️.

**Change:** Home-page mode tiles render the emoji in a `<span class="game-tile-icon game-tile-emoji">`. The base `.game-tile-icon` rule sets `border-radius: 16px; overflow: hidden` (intended for image icons that fill the 54px box and want rounded corners). The `.game-tile-emoji` variant shrinks the box to the glyph but did not undo the clipping, so the rounded corners shaved off the parts of diagonal emoji (rocket fins, scissor blades) that reach into the corners. Added `border-radius: 0; overflow: visible` to `.game-tile-emoji` in `styles.css` so text emoji are never clipped. Image-only `.game-tile-icon` tiles are unaffected.

**Files changed:** `styles.css` (`.game-tile-emoji`: +`border-radius: 0`, +`overflow: visible`).

**Behavior changed:** Home-page emoji icons render fully without corner cropping. No layout/size change.

**Tests run:** `npm test` 174/174 pass (CSS-only change, not covered by tests). Verified in browser preview: rocket/scissors tiles compute `overflow: visible` + `border-radius: 0` and render uncropped (screenshot).

**Risks / regressions to check:** Negligible — scoped to the emoji-tile variant. Image icons still get rounded-corner clipping as before.

---

### 2026-06-27 — Sentences game: balance categories by adding 30 sentences to underrepresented categories

**Requested:** Add sentences to the sentences game so the four categories are more evenly represented. English tokens must be grouped finely (each ≈ one Hebrew word, e.g. "popping over" = קופץ, "to the supermarket" = לסופר), Hebrew compounds kept as single tokens (e.g. חד-משמעיות), and each sentence given a representative emoji.

**Change:**
- Bank was lopsided: colloquial 32, everyday 23, formal 19, professional 11. Added 30 new entries — professional +14 (`professional_12`–`25`, difficulty 2), formal +9 (`formal_20`–`28`, difficulty 3), everyday +7 (`everyday_24`–`30`, difficulty 1–2) — bringing the bank to **115** entries (colloquial 32, everyday 30, formal 28, professional 25).
- Each entry has emoji, fine-grained `english_tokens` aligned ~1:1 to Hebrew words, `hebrew_tokens`, 5 `hebrew_distractors`, 5 `english_distractors`, and `notes`. Hyphenated compound חד-משמעיות kept as one token (`formal_26`); רופא שיניים kept as one Hebrew chip with a shape-matched multiword distractor (`everyday_30`).

**Files changed:** `sentence-bank-data.js` (appended 30 entries); `tests/sentence-bank-data.test.js` (entry-count assertions 85 → 115).

**Behavior changed:** Sentences game now draws from 115 sentences with a far flatter category distribution; professional/formal/everyday rounds appear closer in frequency to colloquial.

**Tests run:** `npm test` 174/174 pass. Pre-validated all 30 entries with a scratch script replicating the suite's guardrails (English-token tiling = full coverage, terminal punctuation, standalone-"it" referent rule, multiword-distractor shape, no underscores, non-empty arrays/notes) — 0 problems. Browser smoke check via preview: bank loads as 115 entries with no console errors.

**Risks / regressions to check:** New Hebrew sentences and distractors are author-written and worth a native-speaker glance for naturalness (esp. formal register and the distractor decoys). Token alignment was optimized for tiling correctness; a few English chunks span two words where Hebrew has no 1:1 counterpart (object marker את, idioms like שנויה במחלוקת).

---

### 2026-06-27 — Sentences game: distractor tile cap, gender-agreement alternates, dead-distractor cleanup

**Requested:** Three improvements to the sentences game: (1) accepted-answer alternates so valid alternative answers aren't marked wrong, (2) grammar-trap distractors "as a system," (3) a tile cap so long sentences don't produce an overcrowded tile board (#6 from the suggestion list).

**Change:**
- **Tile cap (code):** `app/sentence-bank.js` — new `capSentenceBankDistractors()` (with `getAlternateRequiredDistractors()` helper) limits the distractors shown per round to `clamp(SENTENCE_BANK_MAX_TILES(12) − targetLen, min 3, available)`, shuffling first for variety. Crucially it force-keeps any distractor that an accepted alternate needs (so gender alternates stay buildable even when capped). Target tiles are never capped. Net effect: a 10-word sentence now shows 3 distractors (13 tiles) instead of 5 (15); short sentences are unaffected.
- **Gender-agreement system (content + #1 alternates):** For sentences where Hebrew speaker/addressee gender is free but English is neutral, added the feminine form(s) both as a grammar-trap `hebrew_distractor` AND as a buildable `hebrew_alternates` entry (same token count, differing tokens present as distractors — the colloquial_09 precedent). 1st-person speaker: `colloquial_04` (בא→באה), `colloquial_11` (מוצא→מוצאת), `everyday_01` (צריך→צריכה), `everyday_04` (יכול→יכולה, צריך→צריכה), `everyday_10` (יודע→יודעת). 2nd-person addressee: `everyday_02` (אתה→את, חוזר→חוזרת), `colloquial_16` (אתה→את, בא→באה, תחליט→תחליטי). Object-pronoun gender trap: `formal_05` (+אותו vs target אותה).
- **Dead-distractor cleanup (content, #2 quality):** Fixed 5 pre-existing entries whose distractors duplicated a target token (or each other) and were therefore silently dropped by the runtime `sanitizeDistractors` filter — shrinking the decoy pool. Replaced with live decoys, favoring grammar traps: `colloquial_05` (don't→saying), `professional_07` (אפשר→אישורים, number trap), `professional_09` (version→copy, the→those), `professional_10` (it→that, everyone→us), `formal_13` (a→an, problem→issue, to→for).

**Files changed:** `app/sentence-bank.js` (tile-cap logic); `sentence-bank-data.js` (gender distractors + hebrew_alternates on 8 entries, dead-distractor replacement on 5 entries); `tests/app-progress.test.js` (new test: long-sentence distractor cap caps to 3 and preserves the alternate-required tile).

**Behavior changed:** Long sentences show fewer distractor tiles (less crowded). Female (or female-addressed) learners building the grammatically-correct gendered Hebrew now get marked correct instead of wrong on 7 sentences. Five entries that effectively had a reduced decoy pool now present their full set.

**Tests run:** `npm test` 174/174 pass (was 173; +1 new cap test). Plus a full-bank node validation script confirming every alternate is the right length, buildable from target∪distractors, and reconstructable from its text, and that no distractor duplicates a target or repeats — CLEAN across all 85 entries.

**Risks / regressions to check:** Gender alternates only apply in the en→he direction (Hebrew answer). The feminine forms were author-verified but worth a native-speaker glance, especially the 2nd-person imperative flips (תחליטי). Tile cap uses `Math.random` via the shared shuffle; the count is deterministic but which distractors appear varies per round.

---

### 2026-06-27 — Sentences game: Hebrew word-order accepted-answer alternates

**Requested:** Follow-up to the gender alternates — add word-order alternates (the other class of accepted-answer alternate) so a learner who builds a valid alternative Hebrew word order isn't marked wrong.

**Change:** Added 7 `hebrew_alternates` that are exact permutations of the target tokens (same tiles, reordered — always buildable, no new distractors). All are natural, idiomatic reorderings, mostly fronting a time/adverbial clause:
- `colloquial_01` — front כל היום ("כל היום לא שמעתי ממך")
- `colloquial_03` — front אתמול
- `colloquial_27` — front the לפני-clause ("לפני שיהיה חם מדי, בוא נלך לים")
- `everyday_18` — חצי שעה / בתור swap ("הייתי חצי שעה בתור")
- `formal_01` — front לפני קבלת החלטה
- `formal_02` — front למרות התנודות הקטנות
- `formal_07` — front לפני בחירה

English (he→en) alternates were intentionally skipped: English word order is too rigid for same-token reorderings to read naturally, so any would risk accepting awkward English.

**Files changed:** `sentence-bank-data.js` (added `hebrew_alternates` to the 7 entries above; one — colloquial_27 — uses the inline-array style matching its surrounding entry). No code or test changes needed — these ride the existing alternate-matching path.

**Behavior changed:** In the en→he direction, those 7 sentences now accept the alternate word order as correct (and the feedback shows the learner's order back to them). 16 entries now have Hebrew alternates total (2 original + 7 gender from the prior task + 7 word-order, minus overlap = 16).

**Tests run:** `npm test` 174/174 pass. Full-bank validation script: every alternate is correct length, buildable, reconstructable from its text, AND the 7 new ones are confirmed exact permutations of their target token multiset — CLEAN across all 85 entries.

**Risks / regressions to check:** Word-order acceptability is a linguistic judgment — these were chosen conservatively (high-confidence natural orders) but a native-speaker spot-check wouldn't hurt. Each alternate is matched exactly (±2 adjacent modifier-swap tolerance), so adding them only widens what's accepted; it can't make a correct answer fail.

**Requested:** In the sentences game, several English answer options chunk multiple words together. Each English block should correspond to roughly one Hebrew word. Revise the three sentences shown in screenshots, surface other over-chunked candidates, then (after the user reviewed) re-split the six worst offenders and, finally, the moderate batch too — minus everyday_16 (left as-is: "the TV remote" → `השלט של הטלוויזיה` doesn't split cleanly in English word order).

**Change:** Re-split the `english_tokens` (and refreshed `english_distractors`) so each chip maps to ~one Hebrew word.

Screenshot trio:
- `colloquial_01` ("What's going on with you?...") — 5 → 8 chips.
- `everyday_04` ("Do you have a pen...") — 5 → 7 chips (split `I can use`, `I need to write`).
- `colloquial_19` ("Wow, I saw it. Cool...") — 5 → 7 chips (split `I saw it`, `Send me`).

Six worst offenders (user-approved second pass):
- `colloquial_08` ("I'm not into that idea...") — 4 → 7 chips.
- `colloquial_11` ("Where did I put my keys?...") — 3 → 6 chips.
- `colloquial_14` ("He's totally fine, bro...") — 3 → 6 chips.
- `everyday_19` ("Turn it down a bit...") — 3 → 6 chips.
- `everyday_20` ("If I don't answer...") — 2 → 5 chips.
- `formal_08` ("The findings support...") — 3 → 7 chips.

Moderate batch (third pass):
- `everyday_02` ("What time are you coming home?...") — 4 → 9 chips (user flagged that `coming home` = `חוזר`/`הביתה` must be two blocks).
- `everyday_01` ("I need to buy milk and bread...") — 4 → 8 chips.
- `everyday_13` ("There's no parking here...") — 4 → 8 chips.
- `everyday_05` ("We're meeting near the station...") — 3 → 6 chips.
- `colloquial_09` ("She did something shady...") — 5 → 10 chips.
- `professional_07` ("This requires approval from management...") — 4 → 8 chips.
- `formal_01` ("One must consider the long-term implications...") — 4 → 7 chips.
- `formal_02` ("The data indicate a clear trend...") — 4 → 7 chips.
- `formal_07` ("The different options should be examined...") — 4 → 7 chips.

Distractors rewritten to single-block shape matching the finer chips; entries with multiword target chips retain a multiword distractor (phrase-distractor guard). `formal_08` keeps its required `therefore` distractor (and avoids `however`). Standalone `it` chips that were split out (`everyday_19`, `professional_07`) are each licensed by a Hebrew `את`/`זה` cue.

**Files changed:** `sentence-bank-data.js` (english_tokens + english_distractors for all 18 entries above); `tests/sentence-bank-data.test.js` (updated the locked-in token assertions: `CHUNKING_AUDIT_ENTRIES` for everyday_04, colloquial_01, everyday_19, everyday_05, formal_07, plus the exact colloquial_19 snapshot — these previously enforced the now-reversed compacted grouping).

**Behavior changed:** Those eighteen he→en sentence rounds now present more, smaller English chips, each aligning to about one Hebrew word.

**Tests run:** `npm test` 173/173 pass (before, mid, and after). Plus an ad-hoc node script confirming every english_token is still a sequential `indexOf` substring of its sentence and no distractor duplicates a target token.

**Risks / regressions to check:** `everyday_16` deliberately left compacted (see above). Some entries now produce many chips (colloquial_09 = 10 targets + 5 distractors = 15 tiles; everyday_02 = 9 + 6 = 15) — worth eyeballing on a phone/tablet to confirm the tile board doesn't overflow awkwardly. The remaining compacted entries are still guarded by `PHRASE_COMPACTED_ENTRY_IDS` / `CHUNKING_AUDIT_ENTRIES`; re-splitting any later requires updating those guards too.

---

### 2026-06-26 — Bump GitHub Pages deploy actions off deprecated Node 20

**Requested:** Address the deploy workflow warning that its actions target Node 20 (being deprecated; GitHub was force-running them on Node 24).

**Change:** Updated `.github/workflows/deploy-pages.yml` to the current major versions (confirmed via the GitHub releases API): `actions/checkout@v4 → v7`, `actions/configure-pages@v5 → v6`, `actions/upload-pages-artifact@v3 → v5`, `actions/deploy-pages@v4 → v5`.

**Files changed:** `.github/workflows/deploy-pages.yml` (four `uses:` version bumps).

**Behavior changed:** None for the app. CI only — the Pages deploy now runs on Node 24-native actions, clearing the deprecation warning.

**Tests run:** `npm test` 173/173 pass (unaffected by the CI change). Real verification is the deploy workflow itself succeeding on merge to main.

**Risks / regressions to check:** These are major-version bumps, so behavior could differ — verified by watching the post-merge Pages deploy complete successfully. The site URL (https://mikeesexton.github.io/ulpango/) and build steps are unchanged.

---

### 2026-06-26 — Stabilize viewport height with svh (fix content pushed below the fold on iPad)

**Requested:** Another iPad screen recording: after finishing the translation game, the home content sat shoved to the bottom of the screen with a large empty band above it and a scrollbar — you had to scroll up to reach it. Same family as the original "vertical space gets added, scroll to get to the content" report.

**Diagnosis:** Extracted frames (`ffmpeg`) from a 1640×2360 capture = iPad Air, CSS viewport 820×1180 (so the `768–1023px` breakpoint, 3-column lesson grid). The full-height container was sized in `dvh` (dynamic viewport height), which changes value live as iOS Safari's toolbar shows/hides. The home view is vertically centered (`#homeView.active { margin-block: auto }`) inside that container. When layout is computed while `dvh` is large (toolbar collapsed) and the toolbar then expands, the centered content's top margin pushes it below the visible fold; the inner-scroll `.shell-body` (from the prior fix) then holds that scrolled-down position. Could not reproduce in the headless preview because it has no dynamic toolbar — all viewport units resolve equally there.

**Fix:** Switched the locked container height from `dvh` to `svh` (small viewport height — the stable value with the toolbar visible). `svh` never exceeds the smallest visible viewport, so centered content is always on-screen without scrolling regardless of toolbar state; when the toolbar hides and there's more room, the layout simply doesn't grow (no reflow/jump). Keeps the intended vertical centering. Changed all four occurrences: base `body { height: 100dvh → 100svh }` (the `100vh` fallback line is kept above it) and the `min-height: 100dvh → 100svh` in the `max-width:767px`, `768–1023px` media queries (body + app-shell).

**Files changed:** `styles.css` (`dvh` → `svh` in 4 places); `index.html` (styles.css cache-buster → 20260626a); `tests/app-progress.test.js` (updated the locked-document assertion from `height: 100dvh` to `height: 100svh` with an explanatory comment).

**Behavior changed:** On iOS, home/short views no longer get pushed below the fold when the toolbar animates; content stays reachable without scrolling. When the toolbar is hidden there may be extra background space below the app (stable, no jump). Desktop and the headless preview are visually unchanged.

**Tests run:** `npm test` 173/173 pass. Preview (820×1010): body height resolves, document + shell-body not scrollable, home centered, no horizontal overflow, no boot error.

**Risks / regressions to check:** Needs a physical-iPad retest — the `dvh`-vs-`svh` difference only manifests with a real dynamic toolbar. With `svh`, when the iOS toolbar is hidden the app occupies the smaller area and leaves background space below before the fixed bottom nav; confirm that looks acceptable. `svh` is well-supported in modern mobile Safari (2026); the `100vh` fallback covers anything older.

---

### 2026-06-25 — Fix bottom-nav drift during scroll (document-locked, inner scroll container)

**Requested:** After the overscroll fix, a real-iPad screen recording showed the fixed bottom nav (Home/Review/Settings) floating into the middle of the content during a momentum scroll on the Results page, then snapping back to the bottom when scrolling stopped.

**Diagnosis:** Classic iOS Safari behavior — it does not continuously reposition `position: fixed` elements while a momentum scroll is in flight; they ride along with the page and snap back only when the fling settles. Because the whole document scrolled and `#mobileBottomNav` is `position: fixed`, it got caught mid-screen. Only appeared on scrollable pages (Results/Review); Home and gameplay fit on screen. Pre-existing and independent of the gameplay overscroll fix. Confirmed by extracting frames from the user's recording (`ffmpeg`).

**Fix (CSS-only; the user chose the proper fix over leaving the cosmetic glitch):** Changed the scroll model so the document is locked and an inner region scrolls, leaving the fixed nav nothing to ride along with:
- `html`: added `height: 100%`.
- `body`: `min-height: 100vh/100dvh` → `height: 100vh; height: 100dvh;` and `overflow-x: hidden` → `overflow: hidden` (document no longer scrolls).
- `.app-shell`: `min-height: 100dvh` → `height: 100%` (fills the now-fixed-height body; grid rows unchanged).
- `.shell-body`: added `overflow-y: auto; -webkit-overflow-scrolling: touch;` (this is now the scroll container).

Verified no programmatic scrolling exists in JS (`grep` for scrollTo/scrollIntoView/scrollTop — none), so no script fallout.

**Files changed:** `styles.css` (four rules above); `index.html` (styles.css cache-buster → 20260625c); `tests/app-progress.test.js` (the "safe vertical centering" test hard-coded the old `.app-shell { min-height: 100dvh }` document-scroll model — updated to assert the new locked-document/inner-scroll model: `body` height+overflow:hidden, `.app-shell` height:100%, `.shell-body` overflow-y:auto; home-centering assertions for page-stack/#homeView kept).

**Behavior changed:** On scrollable pages the bottom nav now stays pinned during scroll instead of drifting. Home stays vertically centered; gameplay unchanged; gameplay overscroll fix still active. The scroll container is now `.shell-body` rather than the window (also affects desktop, where the scrollbar moves to the inner region).

**Tests run:** `npm test` 173/173 pass. Verified in preview (mobile + tablet): document/body `scrollHeight - clientHeight = 0` (locked), `.shell-body` is the scroller (injected-overflow probe scrolled to 500px while the nav stayed pinned 10px off the viewport bottom), home centered, no horizontal overflow, gameplay renders correctly with nav pinned.

**Risks / regressions to check:** The iOS drift itself can only be confirmed on a physical iPad — needs a real-device retest. Watch for: any view whose content is taller than `.shell-body` now scrolls inside that region (intended); the rare boot-error banner (a direct body child) could be clipped by `body { overflow: hidden }` in an error state; desktop scrollbar now lives on `.shell-body`.

---

### 2026-06-25 — Suppress iOS rubber-band overscroll during gameplay

**Requested:** On a real iPad, the view "scrolls when it shouldn't," especially during gameplay. (Same session also covered an iPadOS Control Center tip for enabling Screen Recording — no code involved.)

**Diagnosis:** Reproduced gameplay in the headless tablet (768×1024) and phone (375×812) presets — content fits with `scrollHeight - clientHeight = 0` even with the full 10-tile match grid, so it is not genuine content overflow. Both `html` and `body` had `overscroll-behavior: auto`, leaving iOS Safari's elastic "rubber-band" overscroll enabled: any touch-drag during gameplay bounces/drifts the whole view though nothing needs to scroll. The headless engine has no elastic overscroll, so this only shows on a physical device.

**Fix:** Added `overscroll-behavior: none` scoped to gameplay via `html:has(body[data-gameplay-active="true"]), body[data-gameplay-active="true"]`. Scoped to gameplay (not global) so pull-to-refresh still works on the home/menu screens. Targets both the root and body so the document scroller honors it regardless of which element Safari reads from.

**Files changed:** `styles.css` (new gameplay-scoped `overscroll-behavior: none` rule); `index.html` (styles.css cache-buster → 20260625b).

**Behavior changed:** During gameplay on touch devices, the page no longer rubber-band bounces at the scroll edges. Menu/home screens are unchanged (pull-to-refresh preserved). Desktop and the headless preview are visually unaffected.

**Tests run:** `npm test` 173/173 pass. Verified in preview that toggling `data-gameplay-active` flips computed `overscroll-behavior-y` from `auto`→`none` on both `html` and `body`, and stays `auto` without the attribute; no boot error.

**Risks / regressions to check:** `:has()` and `overscroll-behavior` are well-supported in modern mobile Safari (2026), but the elastic-bounce symptom itself can only be confirmed on a physical iPad — needs a real-device check. If the unwanted scroll persists, the next suspect is the dynamic address bar momentarily creating real overflow against the `100dvh` shell; the deeper fix there would be sizing the gameplay layout to the small viewport (`svh`) so it never overflows regardless of address-bar state.

---

### 2026-06-25 — Fix mobile/tablet phantom scroll on load (vh/dvh viewport mismatch)

**Requested:** Debug a scrolling issue on smartphone and tablet — on load, extra vertical space gets added and you must scroll down to reach the main content box; pull-to-refresh fixes it.

**Root cause:** `body` used `min-height: 100vh` while `.app-shell` used `min-height: 100dvh`. On mobile, `vh` is the *large* viewport (address bar collapsed) and `dvh` is the *dynamic* (currently visible) height. With the address bar showing on first paint, the body became taller than the visible viewport, creating phantom scroll space. Because the home content is vertically centered inside the `100dvh` shell (`#homeView.active { margin-block: auto }`), the two disagreeing heights pushed the centered content out of view. Pull-to-refresh collapses the address bar, making `vh === dvh`, which is why refreshing resolved it.

**Fix:** Added `min-height: 100dvh` to `body` (kept the `100vh` line above it as a fallback for browsers without `dvh`), so body and app-shell now size to the same dynamic viewport.

**Files changed:** `styles.css` (body min-height: added `100dvh` with `100vh` fallback); `index.html` (styles.css cache-buster → 20260625a so the CSS fix reaches users past cached stylesheets).

**Behavior changed:** On mobile/tablet, the home view no longer starts pushed below a band of empty scroll space on first load. Desktop and the headless preview are unaffected (all viewport units resolve equally there).

**Tests run:** `npm test` 173/173 pass (before and after). Verified in tablet-preset preview: `body` min-height resolves, `scrollHeight - clientHeight = 0`, no boot error.

**Risks / regressions to check:** The headless preview can't reproduce a real mobile address bar (all viewport units resolve to the same value there), so the visible fix should be confirmed on an actual phone/tablet. `dvh` is well-supported in modern mobile browsers; the retained `100vh` line keeps the prior behavior as a fallback on anything that lacks `dvh`.

---

### 2026-06-22 — Conjugation niqqud audit against Pealim (fixed 7 forms across 6 verbs)

**Requested:** Verify the hand-authored לתקן conjugation, and as many other conjugations as possible, against authoritative sources.

**Approach:** Dumped all 35 deck verbs' forms (`node` + `buildVerbConjugationDeck`), then compared each against Pealim.com (the standard niqqud reference) via WebSearch/WebFetch. Deep-checked 16 verbs: לתקן, להוכיח (the two I authored), plus לשחרר, לכבות, לנתח, להתקיים, לצנן, למחוץ, לארח, לדון, לרכוש, למעוך, לתכנן, לקחת, לתת, להגיד. Also ran a cross-verb sweep of the 2mpl/2fpl past vowel to catch systematic reduction errors.

**Errors found & fixed (all niqqud-only; plain spellings already correct):**
- `להוכיח` imperative m.sg: הוֹכַח → **הוֹכֵחַ** (hif'il imperative takes tsere, not patach).
- `למחוץ` past 2mpl/2fpl: מָחַצְתֶּם/מָחַצְתֶּן → **מְחַצְתֶּם/מְחַצְתֶּן** (R1 reduces to sheva).
- `למעוך` past 2mpl/2fpl: מָעַכְתֶּם/מָעַכְתֶּן → **מְעַכְתֶּם/מְעַכְתֶּן** (same reduction).
- `לרכוש` past 2mpl/2fpl: רָכַשְׁתֶּם/רָכַשְׁתֶּן → **רְכַשְׁתֶּם/רְכַשְׁתֶּן** (same; normative written form).
- `לארח` past 3ms: אֵרַח → **אֵרֵחַ** (pi'el 3ms tsere + furtive patach was missing).
- `לצנן` past 1pl: צִנַּנְנוּ → **צִנַּנּוּ** (geminate nun merges; the form even had an extra nun glyph vs its own plain spelling).
- `לתכנן` past 1pl: תִּכְנַנְנוּ → **תִּכְנַנּוּ** (same geminate merge).
- `לקחת` future 2fs/2pl/3pl: תִּקְחִי/תִּקְחוּ/יִקְחוּ → **תִּקְּחִי/תִּקְּחוּ/יִקְּחוּ** (assimilation dagesh in ק was dropped, though present in אֶקַּח/תִּקַּח).

**Verified correct (no change):** לתקן (100% match), לשחרר, לנתח, להתקיים, לדון, and the future/imperative of להגיד; the cross-verb 2mpl/2fpl sweep showed all the common paal verbs (לשמור, לסגור, לכתוב, לפתוח, ללמוד, etc.) already reduce correctly.

**Left as-is, flagged (judgment calls, not changed):**
- `לתת` past 2mpl/2fpl: Pealim shows qamatz נָתַתֶּם; data has reduced נְתַתֶּם. Both are attested for irregular נתן — not changed.
- `לכבות` past 2fs: כִּבִּיתְ vs Pealim כִּבִּית (trailing sheva on final ת) — minor/debatable, possibly WebFetch normalization, not changed.
- `להגיד` present/past use suppletive אומר/אמר (from לומר) rather than the technical מַגִּיד/הִגִּיד — intentional for modern usage, correct.

**Files changed:** `hebrew-verbs.js` (10 form corrections across 6 verbs); `index.html` (hebrew-verbs.js cache-buster → 20260622b).

**Tests run:** `npm test` 173/173 before and after; plus a `node` assertion confirming each corrected form resolves in the deck.

**Risks / regressions to check:** Niqqud verified against a single source (Pealim) read through WebFetch's summarizer — the substantive fixes are grammatically derivable and high-confidence, but the two flagged items (לתת qamatz/sheva, לכבות final sheva) deserve a native-speaker eye if precision matters.

---

### 2026-06-22 — Content: add לתקן + להוכיח to conjugation, add מסוגל sentences, remove מים from translation

**Requested:** (1) Add verbs להוכיח and לתקן to the conjugation game. (2) Add some sentence-game sentences using מסוגל. (3) Remove מים from translation. (4) Add רשע and טופס to translation (originally written "רשע וטופס" — clarified as two separate words).

**Approach / judgment calls:**
- **Verbs:** added both as curated starter-verb entries in `hebrew-verbs.js` with full authoritative niqqud forms (present 4 / past 9 / future 8 / imperative 3 = 24 learner-facing forms each). לתקן = pi'el ת-ק-נ (mirrors the existing לתכנן entry); להוכיח = hif'il פ"י י-כ-ח (initial-yod, guttural ח with patach furtive). Both `review_status: approved`, `conjugation_mode: curated` so the generator is never invoked. IDs `advanced-verb-letaken` / `advanced-verb-lehochiach`.
- **Conjugation-only:** added both IDs to `TRANSLATION_HIDDEN_STARTER_VERB_IDS` so they appear in the conjugation deck but NOT in the translation quiz (matches how the core starter verbs are handled; user asked for conjugation only).
- **Sentences:** added 5 entries using מסוגל across its inflections and difficulties — everyday_22 (מסוגל, d1), everyday_23 (מסוגלת, d2), colloquial_31 (מסוגל, d2), colloquial_32 (מסוגל, d3), professional_11 (מסוגלים, d3). Each follows the existing guardrails: terminal punctuation, fully-segmented English chips, single-word Hebrew distractors, 5 distractors per side, emoji, and a teaching note.
- **מים:** removed the standalone `["water", "מים", "מַיִם"]` row from the `groceries_food` block in `vocab-data.js`. Water compounds (נזקי מים, לחץ מים, דוד מים, חשבון מים, מסיר כתמים) are untouched. Note: removing the row shifts the auto-generated `groceries_food-NNN-*` ids for rows after it, so saved progress on those grocery items resets.
- **רשע / טופס:** טופס ("form", טוֹפֶס) already existed in the `bureaucracy` category — no change. Added רשע ("wicked / villain", רָשָׁע) to the END of the `core_advanced` array so no existing item ids shift. Available in the translation quiz by default.

**Files changed:**
- `hebrew-verbs.js` — two new curated verb entries before the starter-array close; two new IDs in `TRANSLATION_HIDDEN_STARTER_VERB_IDS`.
- `vocab-data.js` — removed the standalone מים row; appended רשע to `core_advanced` (טופס already present in `bureaucracy`).
- `sentence-bank-data.js` — appended 5 מסוגל sentences (now 85); bumped `__build` → `20260622a`.
- `tests/sentence-bank-data.test.js` — count assertion 80 → 85.
- `index.html` — bumped cache-busters → `20260622a` for `vocab-data.js`, `sentence-bank-data.js`, `hebrew-verbs.js`.

**Behavior changed:** Conjugation game now includes לתקן (to fix) and להוכיח (to prove), 24 forms each, conjugation-only. Sentence game has 5 new מסוגל sentences (85 total). מים no longer appears as a standalone translation word.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass. Node + live-preview verification: both verbs present in the runtime deck (24 forms, `translationQuiz=false`); standalone מים absent from the lexicon while compounds remain; 85 sentences with all 5 מסוגל entries well-formed; played a להוכיח conjugation round in the browser (forms rendered correctly, no console errors).

**Risks / regressions to check:** (1) Niqqud on the curated forms was authored by hand — worth a native-speaker spot-check (esp. להוכיח hif'il vocalization and the תיקן past-tense dagesh forms). (2) Grocery-item ids shifted after removing מים → progress on those items resets (cosmetic). (3) רשע is filed under `core_advanced` (general) — move it if a more specific category is preferred.

---

### 2026-06-22 — Conjugation game: group mistakes by verb, cap forms, columnar endgame layout

**Requested:** Follow-up to the per-form review list. (1) Group the session mistakes by verb and cap at a max count. (2) The endgame display wasted full rows on each mistake — show the info compactly as columns.

**Approach / judgment calls:**
- The conjugation game runs `VERB_MATCH_ROUNDS = 1` (one verb per session, up to ~19 forms), so grouping by verb normally yields a single group; the implementation is written generically and handles multiple verbs defensively.
- Added `wordId` to each recorded `sessionMistakeForms` entry. `buildVerbMatchMistakeSummary` now groups forms by `wordId` into `{ primary (verb niqqud), secondary (verb English), forms: [{primary, secondary}], overflow }`. Verb header text is resolved via the vocab lookup + `getHebrewText(word, true)` (same convention the old infinitive code used).
- **Cap:** new constant `VERB_MATCH_MISTAKE_MAX_FORMS = 6` caps forms shown *per verb*; excess increments `overflow`, surfaced as a "+N more" / "עוד N+" line rather than silently dropped.
- **Columnar layout:** new `ui.createVerbMistakeGroup` renders a verb-headed card with the forms in a CSS auto-fill grid (`.verb-mistake-forms`, `minmax(8.5rem, 1fr)`) — 4 columns on tablet, reflows to 2 on mobile. `renderResults` branches to it when a mistake item has a `forms` array; all other games keep the existing `createCompactRow` path untouched.

**Files changed:**
- `app/constants.js` — added `VERB_MATCH_MISTAKE_MAX_FORMS = 6`.
- `app/verb-match.js` — `recordVerbMatchMistakeForm` now stores `wordId`.
- `app/data.js` — `buildVerbMatchMistakeSummary` groups by verb, caps per-verb forms, tracks overflow.
- `app/ui.js` — new `createVerbMistakeGroup` helper; `renderResults` mistakes loop renders grouped cards when `item.forms` is present.
- `app/bootstrap-data.js` — added `results.moreForms` string (en: "+{count} more", he: "עוד {count}+").
- `styles.css` — added `.verb-mistake-group` / `-head` / `-verb` / `-gloss` / `-forms` (auto-fill grid) / `-form` / `-form-he` / `-form-en` / `-more` styles.
- `tests/app-progress.test.js` — updated the conjugation-summary test to seed `wordId`, assert the grouped shape (verb header + forms + overflow), and check the rendered `.verb-mistake-forms` column count (used `JSON.parse(JSON.stringify(...))` to dodge cross-realm prototype mismatch; queried via the registered `#resultsSummary` element since the harness's `document.querySelector` is a selector→element registry, not a tree query).
- `index.html` — bumped cache-busters → `20260622a` for `constants.js`, `bootstrap-data.js`, `ui.js` (in addition to the per-form change's `bootstrap-runtime.js`, `persistence.js`, `session.js`, `data.js`, `verb-match.js`).

**Behavior changed:** The conjugation results page now shows one card per verb — verb headword + English at top, the specific confused forms below in a compact multi-column grid (max 6 per verb, "+N more" when exceeded). Replaces the previous flat full-width per-form rows. No other game's summary affected.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass. Live-verified via preview (reloaded with bumped cache-busters): drove a finished verbMatch session with 8 seeded confused forms for לִהְיוֹת / to be; results rendered the verb header, a 4-col grid of 6 forms, and "עוד 2+"; confirmed 2-col reflow at 375px; no console errors.

**Risks / regressions to check:** (1) Verb header depends on the verb id resolving in `getAllVocabulary()` — if a conjugation-only verb is missing from that pool the header strings fall back to empty (forms still render). (2) The grid `minmax(8.5rem, 1fr)` was tuned for the current niqqud form lengths; unusually long forms could force a single column on the narrowest phones. (3) `results.moreForms` is a new i18n key — both en/he provided.

---

### 2026-06-22 — Conjugation game: per-form mistake review list

**Requested:** In the conjugation (verb match) game, the results page listed only the infinitive verb under "טעויות מהסשן" (e.g. לִרְאוֹת / to see), which is useless feedback since the game tests multiple conjugations of one verb. Asked whether it's practicable to show the specific forms gotten wrong instead. Chose the per-form review list.

**Approach / judgment calls:**
- The game is a match grid; a "mistake" is a mismatch between an English form and a Hebrew form. At mismatch time both cards' `pairId`s are available, and the round's `pairs` array maps each pairId to the full form (`englishText`, `valuePlain`, `valueNiqqud`), so I capture exactly which forms were confused.
- Recorded each confused form (both sides of the mismatch) into a new session array `match.sessionMistakeForms`, deduped by a `wordId::formId` composite key (form ids like `present_masculine_singular` repeat across verbs, so the verb id is part of the key).
- `buildVerbMatchMistakeSummary` now maps those forms to `{primary, secondary}` cards. Kept the prior summary convention of always showing niqqud (the old code forced niqqud via `getHebrewText(word, true)`), so primary = `valueNiqqud` (falls back to plain), secondary = English meaning. No summary-rendering/UI changes needed — same card shape.
- Left the existing `sessionMistakeIds` (verb-level) untouched since other code/persistence references it; only the summary builder switched to the form-level data.

**Files changed:**
- `app/verb-match.js` — added `recordVerbMatchMistakeForm(pairId)` helper; call it for both cards in `applyVerbMatchMismatch`; clear `sessionMistakeForms` in `resetVerbMatchState`.
- `app/data.js` — `buildVerbMatchMistakeSummary` now builds from `match.sessionMistakeForms` (per-form) instead of looking up the parent verb headword.
- `app/bootstrap-runtime.js` — added `sessionMistakeForms: []` to the default `match` state.
- `app/persistence.js` — persist `sessionMistakeForms` in the match snapshot.
- `app/session.js` — restore `sessionMistakeForms` from snapshot (array guard).
- `tests/app-progress.test.js` — updated the conjugation-summary test to seed `sessionMistakeForms` and assert the per-form list instead of the infinitive.
- `index.html` — bumped cache-busters → `20260622a` for `bootstrap-runtime.js`, `persistence.js`, `session.js`, `data.js`, `verb-match.js`.

**Behavior changed:** The conjugation game results page now lists the specific conjugated forms the player confused (e.g. הוֹלֵךְ / he goes, הָלַכְתִּי / I went), deduped, instead of the verb infinitive. No other game affected.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass. Live-verified via preview: drove a finished verbMatch session with seeded form mistakes; results page rendered the two forms with niqqud + English under "טעויות מהסשן"; no console errors.

**Risks / regressions to check:** (1) `sessionMistakeForms` is new state — confirm a mid-session save/restore (snapshot) round-trips it (guarded as array, defaults to `[]`). (2) Dedup is per verb+form; the same form confused in two different verbs will correctly show twice.

---

### 2026-06-21 — Sentences game: "Street-Smart Israel" batch (10 new colloquial sentences)

**Requested:** Suggest and add a surprise new batch of sentences to the sentence translation game. User chose the "Street-smart Israel" flavor at 10 sentences (via clarifying question), then gave two rounds of feedback during planning.

**Approach / judgment calls:**
- Added `colloquial_21`–`colloquial_30`: real cultural moments (shuk haggling 🛒, falafel order 🧆, bureaucracy line 🎫, beach 🏖️, sherut taxi 🚐) and slang idioms (חבל על הזמן, על הפנים, פעם שלישית גלידה, אין מצב, כפרה עליך). Filed under the existing `colloquial` category (UI label "Colloquial & Street") — no new category wiring needed.
- **User feedback incorporated:** (1) Reworked כפרה עליך away from a flat "sweetheart" — now the full affectionate opener of a heartfelt line, translated "You're a lifesaver," with a note explaining the literal "atonement upon you" origin. (2) Did a pass over all `english_tokens` to break up over-aggressive multi-word blobs so each chip maps roughly to one Hebrew word (e.g. "and I'll take"→"and"+"I'll take", "can I get off"→"can I"+"get off").
- Pre-checked every entry against the test guardrails: terminal punctuation both sides; English fully segmented into chips (no lexical text left outside tokens); single-word Hebrew chips (avoids the multiword-distractor rule); no standalone mid-sentence "it"; `נו`/`ממש` nuance cues surfaced in the English ("Come on"/"really"); 5 distractors per side. Difficulty spread 1–3.

**Files changed:**
- `sentence-bank-data.js` — appended 10 entries to `SENTENCE_BANK` (now 80); bumped `__build` → `"20260621a"`.
- `tests/sentence-bank-data.test.js` — updated the hard-coded count assertion (and test title) from 70 → 80.

**Behavior changed:** 10 new colloquial sentences are now playable in the Sentences translation game (both directions, with emoji prompts). No other game affected.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass. Live-verified via preview after reload: `__build` 20260621a, 80 total entries, all 10 new ids present with sensible token counts; no console errors.

**Risks / regressions to check:** (1) Idiom entries intentionally compress 2–3 Hebrew words into one English chip (חבל על הזמן→"amazing", על הפנים→"terrible", כפרה עליך→"You're a lifesaver") and colloquial_25 adds an English-only "you owe me" expansion — by design for idioms, but worth a play-through to confirm the chip mapping feels fair. (2) Verb gender is fixed feminine in colloquial_30 (יודעת) — matches its distractors; not flagged as gender-ambiguous like colloquial_09.

---

### 2026-06-21 — Sentences game: per-sentence emoji in the prompt card

**Requested:** Roll out emojis for the Sentences game (the deferred follow-up to the Binyanim emoji work).

**Approach / judgment calls:**
- Picked a meaningful emoji for each of the **70** sentences, keyed by id, based on the English text (e.g. colloquial_06 ice-cream → 🍦, everyday_11 pizza → 🍕, professional_03 requirements → 📋, formal_01 implications → ⚖️). Abstract formal sentences use conceptual glyphs (💭, ♻️, 🌌). The full set was reviewed/approved in the plan.
- **No spoiler risk** (unlike Binyanim): the Sentences game always shows the full prompt sentence; the player only re-orders a word bank, so the emoji is pure decoration in both directions and in review.
- **Reused the existing prompt-card emoji slot** (`#promptRootEmoji`) rather than renaming it — Sentences mode shows no prompt label, so the `.prompt-label-row` (which is `display: contents` outside Binyanim) lets the emoji render as a centered glyph above the sentence with no new markup or CSS. Cross-mode safety is already handled: `ui.setPromptCardVisibility(true)` clears the slot on every render, and Sentences sets it right after (same clear-then-set pattern as Binyanim).
- Bulk data edit done via a one-shot Node script (scratchpad) that inserts `"emoji"` after each unique `"id"` line — far more reliable than 70 manual edits; verified the file still parses and has exactly 70 emoji fields.

**Files changed:**
- `sentence-bank-data.js` — added an `emoji` field to all 70 `SENTENCE_BANK` entries.
- `app/sentence-bank.js` — `prepareSentenceBankDeck()` normalizes `emoji: String(entry?.emoji || "").trim()`; `buildQuestionFromPair()` carries `emoji: sentence.emoji || ""` onto the question; `renderSentenceBankQuestion()` sets/shows `#promptRootEmoji` (verbatim Binyanim pattern) right after `setPromptCardVisibility`/`renderPromptLabel`.
- `index.html` — bumped cache-busters for `sentence-bank-data.js` and `app/sentence-bank.js` (→20260621a).

**Behavior changed:** Each Sentences question now shows its emoji centered above the prompt sentence, in both translation directions and in review. No other game's prompt is affected.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass (plus a Node `require` parse check on the edited data file). Live-verified via preview: emoji renders centered above the prompt (📋 professional_03, ⚖️ formal_01) in dark + light; confirmed it does NOT leak when switching to the Translation match game (slot cleared); no console errors; no horizontal scroll; emoji centered.

**Risks / regressions to check:** (1) A few emoji repeat across the 70 (⏰, ⏳, etc.) — acceptable for decoration. (2) A few use VS16 presentation selectors (🪟, 🗓️, 🅿️, ⚖️, ⚠️, ♻️, 🖊️) — render fine in tested browsers; spot-check older Android. (3) Emoji is decorative (`aria-hidden` on the shared span); sentence text remains the accessible content.

---

### 2026-06-21 — Review page: category cards back to 2 columns (2×2) on desktop

**Requested:** The 3-column category grids from the desktop dashboard looked unbalanced (4 domains and 4 modes wrapped as 3 + 1, leaving an orphan card with empty cells). Display the categories in 2×2 grids.

**Files changed:**
- `styles.css` — in the `@media (min-width: 1024px)` block, `.review-analytics-card .domain-grid` / `.mode-grid` changed from `repeat(3, …)` back to `repeat(2, minmax(0, 1fr))`, so the 4 domain cards and 4 mode cards each form a clean 2×2 block (no orphan).
- `index.html` — bumped `styles.css?v=20260621f` → `?v=20260621g`.

**Behavior changed:** On desktop the Review category cards are now 2-up (2×2) instead of 3-up. Tablet/mobile were already 2-up and are unchanged.

**Tests run:** `npm test` = 173/173 pass. Live-verified at 1280px (with seeded data): domains and modes each render as 2×2, no orphan cards, balanced against the Most Missed ranking rail; no console errors.

**Risks / regressions to check:** If a category group ever has an odd number of cards, the last one will sit alone in its row (inherent to a 2-col grid) — acceptable and matches the rest of the app's 2-col category layout.

---

### 2026-06-21 — Review page: desktop two-column dashboard

**Requested:** The Review (סקירה) page used vertical/horizontal space poorly on desktop — everything was stacked in a single 760px-wide centered column inside the 1000px shell, leaving ~half the width empty and a long vertical scroll. Redesign for better space use.

**Approach / judgment calls:**
- On desktop (≥1024px) turned `.review-panel-content` into a two-column dashboard: a compact **Most Missed** ranking rail (`minmax(220px, 280px)`) beside a wider **Category Analytics** area (`1fr`), and widened the panel card from `max-width: 760px` to `100%` (fills the shell) so the page reads as a dashboard, not a phone column.
- Bumped the analytics card grids (`.domain-grid` / `.mode-grid`) from 2 to **3 columns** on desktop, and dropped the analytics section's `border-top`/`padding-top` (the divider only made sense when the two sections were stacked).
- **Most Missed list refactor:** it was rendered as two hardcoded `<ol>` columns with inline flex styles (JS-driven), which couldn't reflow into the narrow desktop rail. Refactored `ui.renderMostMissed` to emit a single `<ol class="missed-col">` and moved column control to CSS: `.missed-col { column-count: 2 }` by default (preserves the existing 2-column look on mobile/tablet, with correct continuous 1..n numbering via CSS multicol), overridden to `column-count: 1` in the desktop rail so it reads as a clean vertical ranking. Moved the formerly-inline `text-align`/margins/padding into `.missed-col` / `.missed-col li` and added `break-inside: avoid`.
- Tablet (768–1023px) and mobile are unchanged — the dashboard grid only applies at ≥1024px.

**Files changed:**
- `app/ui.js` — `renderMostMissed` now builds one `<ol>` (removed the two-column split and all inline styling).
- `styles.css` — `.missed-col` gains column/list styling; new desktop rules: `.review-panel-card` max-width 100%, `.review-panel-content` two-column grid, `.review-panel-content .missed-col` single column, analytics border removed, `.domain-grid`/`.mode-grid` 3 columns.
- `index.html` — bumped `styles.css` (→20260621f) and `app/ui.js` (→20260621b) cache-busters.

**Behavior changed:** On desktop the Review page is now a side-by-side dashboard (Most Missed ranking + 3-column Category Analytics) filling the shell width with far less vertical scroll. Tablet/mobile layouts are visually identical to before.

**Tests run:** `npm test` = 173/173 pass. Live-verified via preview at 1280px (seeded sample miss data to populate the ranking + analytics rings), 768px, and 375px: desktop two-column dashboard balanced and full-width; tablet/mobile keep the stacked 2-column layout with correct 1..n numbering; empty state ("no misses") renders in the rail; no console errors.

**Risks / regressions to check:** (1) Relies on CSS multicolumn for the missed list — numbering and `break-inside: avoid` behave in tested browsers; spot-check older engines. (2) In RTL the Most Missed rail sits on the right and Analytics on the left (natural for Hebrew); in LTR it mirrors — both intentional. (3) Widening the panel to full shell width is specific to this dense page; the home/games narrowing is unaffected.

---

### 2026-06-21 — Binyanim: inline emoji + binyan name on guessing prompt, larger name

**Requested:** During Binyanim gameplay (the answer-guessing screen), show the root emoji *inline* with the binyan name identifier (e.g. הֻפְעַל) instead of stacked above it, and increase the font size of that name.

**Approach / judgment calls:**
- Wrapped the existing `#promptRootEmoji` span and `#promptLabel` (the binyan name) in a new `.prompt-label-row` div. The row defaults to `display: contents` — so for every non-binyan mode the two elements behave exactly as before (separate grid children of `.prompt-card`, emoji hidden), avoiding any empty-row gap. Only `.prompt-card.mode-binyan-board .prompt-label-row` flips to `display: flex` (centered, `gap: 0.45rem`), putting the emoji and binyan name on one line.
- Bumped the binyan name font via `.prompt-card.mode-binyan-board .prompt-label` (0.82rem → 1.3rem, dropped the uppercase/letter-spacing that only made sense for Latin labels, color → `--ink`). Scoped to binyan so the shared `.prompt-label` (also used for a sentence-bank error title) is untouched.

**Files changed:**
- `index.html` — wrapped `#promptRootEmoji` + `#promptLabel` in `<div class="prompt-label-row">`; bumped `styles.css?v=20260621d` → `?v=20260621e`.
- `styles.css` — added `.prompt-label-row { display: contents }`, the `mode-binyan-board` flex override, and the larger binyan-name rule.

**Behavior changed:** On the Binyanim guessing screen the root emoji now sits on the same line as the (now larger) binyan name, with the conjugated form below. No change to the selection cards or to any other game's prompt.

**Tests run:** `npm test` = 173/173 pass. Live-verified via preview: emoji + name inline and vertically centered (measured same center-Y), name font 20.8px; confirmed unchanged Translation prompt (row collapses via `display:contents`, no gap, no leaked emoji); dark + light, mobile + desktop; no console errors.

**Risks / regressions to check:** Relies on `display: contents` (well-supported in modern browsers; the app already uses modern CSS). If a future layout needs the wrapper to be a real box outside binyan, revisit.

---

### 2026-06-21 — Binyanim: per-root emoji on selection cards and guessing prompt

**Requested:** Pick a meaningful emoji for each binyanim root and show it (1) on the root-selection card and (2) "as neatly as you can" in the prompt box while guessing the forms. Also assess (but do not build this round) whether per-sentence emoji is tractable for the Sentences game.

**Approach / judgment calls:**
- The root emoji reflects each root's *core meaning* — the theme shared by all of its binyanim — so it is a thematic cue, not a spoiler: answer options and most distractors are glosses pulled from sibling forms of the same root, which all share that theme. Confirmed visually (e.g. ש־ל־ם 💰 with options "was paid / came to an end / paid off / completed").
- Picked 14 distinct emoji; 🔒/🔓 deliberately pair the close/open roots; none collide with the home-screen game-tile emoji.
- **Prompt-box placement:** added a dedicated, isolated `#promptRootEmoji` span inside `.prompt-card` (above the binyan-name label) rather than mixing the emoji into the RTL Hebrew label/form text. It renders as a small (1.6rem), centered glyph; the Hebrew form stays the focal point.
- **Leak prevention (key fix):** other games (e.g. Translation match) don't route through `ui.renderPromptText`, so an initial attempt to clear the emoji there leaked the binyan emoji into the match game's prompt header. Reworked to clear `#promptRootEmoji` inside `ui.setPromptCardVisibility()` — the single chokepoint every mode calls when showing/hiding the prompt card (verified: all 7 modes call it). Binyan re-sets the emoji immediately after its own `setPromptCardVisibility(true)` call, so only binyan rounds show it.

**Files changed:**
- `verb-game-data.js` — added an `emoji` field to each of the 14 `ROOTS` entries (next to `core_meaning`).
- `app/binyan-board.js` — carry `emoji` through deck normalization (`emoji: root.emoji || ""`) and onto the question object (`buildBinyanBoardQuestion`); append a `.binyan-root-emoji` span to each selection tile in `renderBoardTiles()`; set/show `#promptRootEmoji` in `renderRoundQuestion()`.
- `index.html` — added `<span id="promptRootEmoji" class="prompt-root-emoji hidden" aria-hidden="true">` in `.prompt-card`; bumped cache-busters for `styles.css` (→20260621d), `verb-game-data.js`, `bootstrap-runtime.js`, `ui.js`, `binyan-board.js` (→20260621a).
- `app/bootstrap-runtime.js` — registered `promptRootEmoji` in the runtime element map.
- `app/ui.js` — `setPromptCardVisibility()` now clears/hides `#promptRootEmoji` (the universal reset point).
- `styles.css` — `.binyan-root-emoji { font-size: 2rem }` and `.prompt-root-emoji { font-size: 1.6rem; centered }`.

**Behavior changed:** Each Binyanim selection card now shows a thematic emoji above the root letters; after picking a root, that emoji appears centered above the form in the guessing prompt. No emoji appears in any other game's prompt box. Sentences game unchanged.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass. Live-verified via preview server: selection-card emoji (correct mapping, all 14) and guessing-prompt emoji confirmed on desktop/tablet/mobile, dark + light themes; confirmed the emoji does NOT leak into the Translation match prompt; no console errors; no horizontal scroll on mobile.

**Sentences game — feasibility (assessed, deferred per request):** Tractable. 70 sentences in `sentence-bank-data.js` (flat objects), ~85% concrete/depictable. Prompt renders via `ui.renderPromptText()` → `runtime.el.promptText`. Recommended future approach: add an optional `emoji` field per sentence, carry it onto the question, and reuse the same prompt-card emoji slot (rename `#promptRootEmoji` → generic `#promptEmoji`). Effort is mostly the ~70 manual emoji picks, not code. Not implemented this round.

**Risks / regressions to check:** (1) The emoji-clear lives in `setPromptCardVisibility` — if a future game shows the prompt card without calling it, a stale binyan emoji could persist; all current modes call it. (2) `⬆️`, `🗂️`, `🛡️`, `🔓`, `🔒` are presentation-emoji with VS16 selectors — render fine in tested browsers but check older Android. (3) Emoji are decorative (`aria-hidden`); root meaning remains available to screen readers via the existing meaning text.

---

### 2026-06-21 — Narrow homepage width on tablet

**Requested:** After narrowing game width on tablet in the prior session, do a similar pass on the homepage so it feels more optimized/balanced and less stretchy.

**Approach / judgment calls:**
- The homepage lesson launcher (`.home-grid` / `#homeDashboard`) had no width cap, so on tablet it stretched to the full shell width (~745px at 768px viewport), giving each of the six game tiles ~231px and an over-wide feel.
- Added a single rule in the existing `768–1023px` media query capping `.home-grid` at `max-width: 640px` and centering it (`margin-inline: auto`), mirroring how the games narrowed their content (prompt-card 680px, settings card 600px). Tiles now land at ~190px — squarer and more balanced.
- No HTML structure or JS changes; CSS-only. Cap sits within the existing 920px shell cap so it stays centered through the whole tablet range (verified at 768px and 1010px).

**Files changed:**
- `styles.css` — added `.home-grid { max-width: 640px; margin-inline: auto; width: 100%; }` inside the `@media (min-width: 768px) and (max-width: 1023px)` block.
- `index.html` — bumped `styles.css?v=20260621a` → `?v=20260621b` for cache-busting.

**Behavior changed:** On tablet (768–1023px), the "Choose Your Lesson" card no longer stretches edge-to-edge; it is capped at 640px and centered, with tighter, more balanced game tiles. Phone and desktop layouts unchanged.

**Tests run:** `npm test` = 173/173 pass. Live-verified via preview server at 768×1024 and 1010×1024 (HE/RTL): card centered, six tiles in 3 columns, no horizontal scroll, bottom nav unaffected.

**Risks / regressions to check:** Cap only applies in the tablet breakpoint; desktop (≥1024px) and phone (≤767px) are untouched. The lesson stage that replaces the dashboard during gameplay is a sibling (`.home-lesson-stage`), not inside `.home-grid`, so it is unaffected by this cap.

---

### 2026-06-21 — Desktop: enlarge bottom nav, shrink lesson card to match tablet

**Requested:** On desktop the bottom nav bar was much smaller than on tablet, while the "Choose Your Lesson" card felt bulky/over-wide. Make the desktop bottom bar bigger and shrink the lesson card so both feel visually consistent with the tablet layout.

**Approach / judgment calls:**
- On desktop (`≥1024px`) `.home-grid` had no width cap, so the lesson card filled the full 1000px shell (~960px), giving wide tiles; the bottom nav was only `min(560px, …)`. The two read as mismatched widths.
- Capped `.home-grid` at `max-width: 640px` centered (matching the tablet cap from the prior entry) and widened `.mobile-bottom-nav` from `560px` to `640px`. Both now measure exactly 640px and share the same centered left edge (verified: grid and nav both `left:320, width:640` at a 1280px viewport), so the card and bottom bar line up.
- CSS-only; no HTML structure or JS changes.

**Files changed:**
- `styles.css` — in the `@media (min-width: 1024px)` block: `.mobile-bottom-nav` width `min(560px…)` → `min(640px…)`; `.home-grid` gained `max-width: 640px; margin-inline: auto; width: 100%`.
- `index.html` — bumped `styles.css?v=20260621b` → `?v=20260621c`.

**Behavior changed:** On desktop the lesson launcher is now capped at 640px (tighter, tablet-consistent tiles) and the bottom nav is 640px wide; the two align vertically. Tablet and phone layouts unchanged.

**Tests run:** `npm test` = 173/173 pass (CSS-only; no test touches these). Live-verified via preview server at 1280×820 (HE/RTL): card and bottom nav both 640px, centered and aligned, six tiles in 3 columns, no console errors.

**Risks / regressions to check:** The 640px nav cap still uses `min(…, calc(100% - 2rem))`, so it shrinks gracefully on narrower desktop windows. Topbar/shell remain at the 1000px cap by design (only the dashboard card and bottom nav were narrowed).

---

### 2026-06-19 — Homepage redesign: minimal icon-grid game launcher

**Requested:** The home screen felt crowded (six tall, full-width game tiles stacked in one column, each with an icon + title + description line). Redesign it — drop the always-visible descriptions, move to a grid, and optimize/beautify for desktop, tablet, and mobile. After showing three mockups, the user chose the **"Icon grid (minimal)"** direction: centered cards with an enlarged icon on top, game name beneath, quiet card with an accent border on hover/focus; responsive 2-col phone / 3-col tablet+desktop; no visible descriptions.

**Approach / judgment calls:**
- Restyled **both** tile sets that share `.game-tile` — the landing `#homeDashboard .home-lesson-grid` (6 `home-game-tile`s) and the in-session `#gamePicker.game-picker` — so they stay visually identical.
- Converted `.game-tile` from a 2-column (icon-left) grid to a centered flex column (icon over title). Enlarged the icons; since they are fixed-size PNGs, updated **both** `.game-tile-icon` and `.game-tile-icon img` width/height at every breakpoint.
- **Kept** the `.game-tile-note` description elements in the DOM but made them screen-reader-only (visually-hidden pattern) rather than deleting them — preserves the accessible name ("Title — Description"), keeps i18n filling them harmlessly, and avoids touching the `game.*Note` keys still consumed by `bootstrap-data.js`/`binyan-board.js`. Removed the now-dead visible `.game-tile-note` overrides in the tablet/mobile blocks.
- Added grid-column rules on both containers at each breakpoint (base/mobile 2-col, tablet/desktop 3-col); `.game-picker` previously had only a single-column base rule. Equalized `.home-game-tile` height with the base (dropped the shorter override at base/tablet/mobile). Retuned the short-viewport (`max-height:760px`) `.game-tile` min-height and icon size for half-width cards. Overrode the RTL `body[data-ui-lang="he"] .game-tile { text-align:right }` to `center`. Added a `.game-tile:focus-visible` ring (no global button focus ring existed).
- No JS changes: preserved every id, the `.game-tile`/`.home-game-tile`/`.game-picker`/`.home-lesson-grid` classes, the `.home-game-tile.is-current` highlight hook, the per-game hover-accent id rules, and all `data-i18n` keys.

**Files changed:**
- `styles.css` — `.game-tile` restructured to centered flex card; `.game-tile-icon`(+img) enlarged (base 54px, desktop 60px, tablet 56px, mobile 50px, short-vp 44px); `.game-tile-title` cleaned up; `.game-tile-note` → visually-hidden; `.home-lesson-grid` + `.game-picker` given responsive columns (2/3/3 across mobile/tablet/desktop) in the base, `min-width:1024px`, `768–1023px`, and `max-width:767px` blocks; short-viewport and RTL tweaks; removed dead `.game-tile-note` and `.home-game-tile` min-height overrides.
- `index.html` — markup unchanged structurally (descriptions kept for SR); bumped `styles.css?v=20260620b` → `?v=20260620c`.

**Behavior changed:** The home game launcher is now a tidy icon grid — 2 columns on phones (whole launcher fits with no scroll), 3 on tablet/desktop — with centered icon-over-name cards and no visible descriptions. The in-session game picker matches. Descriptions remain available to screen readers. All other screens unchanged.

**Tests run:** `npm test` before = 168/168 pass; after = 168/168 pass (no test references the home tiles; none changed). Live-verified via preview server at 1280×800 / 768×1024 / 375×812 in dark+light themes and EN+HE: 3/3/2 columns respectively, uniform centered cards, no horizontal scroll, in-session picker matches, RTL grid mirrors correctly, `is-current` highlight intact, `.game-tile-note` clipped to 1×1 but text present for SR, no console errors.

**Risks / regressions to check:** (1) Descriptions are no longer visible — new users rely on the (self-explanatory) names + icons; the text is still in the SR tree. (2) Grid assumes equal-width 1fr columns; very long localized titles wrap to 2 lines (handled, cards are equal-height). (3) The desktop "hub" layout still flanks the lessons card with Review/Settings columns — unchanged here; the 3-col game grid fits within the center column.

---

### 2026-06-20 — Rename games in IvritElite

**Requested:** Rename three game titles across English and Hebrew:
- "Sentence Builder" → "Sentences"
- "Advanced Conjugation" → "Conjugation+"
- Abbreviation game Hebrew title: "קיצורים" → "ר״ת"

**Files changed:**
- `index.html` — Bumped `bootstrap-data.js` cache-busting query from `?v=20260620a` to `?v=20260620b` so the renamed strings actually load instead of a stale cached copy.
- `app/bootstrap-data.js` — Updated `bootstrapData.I18N`:
  - **English (en)**: `sentenceBankTitle`, `sentenceBankSecondChanceTitle`, `sentenceBankStart`, `sentenceBankName` changed from "Sentence Builder" variants to "Sentences"; `advConjName` changed from "Advanced Conjugation" to "Conjugation+"; summary titles updated accordingly.
  - **Hebrew (he)**: `sentenceBankTitle`, `sentenceBankSecondChanceTitle`, `sentenceBankStart`, `sentenceBankName` changed from "בונה משפטים" to "משפטים"; `abbreviationTitle`, `abbreviationStart`, `abbreviationRestart`, `abbreviationName` changed to "ר״ת"; `advConjName` changed to "נטיות+"; summary titles updated accordingly.

**Behavior changed:** Game tiles now display the new names on the home screen and throughout the app in both English and Hebrew. "Sentence Builder" is now "Sentences," "Advanced Conjugation" is now "Conjugation+," and the Hebrew abbreviation game shows "ר״ת" instead of "קיצורים."

**Tests run:** Manual verification via preview server — reloaded page and confirmed all game names updated correctly on the home screen in both English and Hebrew.

**Risks / regressions to check:** None identified. Game logic and functionality remain unchanged; only display names were updated.

---

### 2026-06-20 — Fix desktop-hub column widths on home screen

**Requested:** At wide widths the home "hub" (Review | Choose Your Lesson | Settings, shown side-by-side at ≥1024px via `body[data-desktop-hub-layout="true"]`) had badly balanced columns — Review (a collapsed card) took a full `1fr`, while the Home column holding the 3-wide game grid got an equal `1fr` that was too narrow, so the game tiles overflowed and were visually covered by the Settings column. Asked to re-examine the column widths and make them sensible.

**Files changed:**
- `styles.css` — In the `@media (min-width: 1024px)` block:
  - `body[data-desktop-hub-layout="true"] .page-stack` (and the `[data-ui-lang="he"]` variant) grid changed from `minmax(0,1fr) minmax(0,1fr) minmax(290px,0.74fr)` (and the HE mirror) to a symmetric `minmax(240px, 0.62fr) minmax(0, 2fr) minmax(240px, 0.62fr)` — the center Home column is now dominant (`2fr`) and the Review/Settings side rails are narrower and equal. Symmetric so EN and HE behave identically (page-view `order` already places Home in the center column for both).
  - `.home-lesson-grid, .game-picker` changed from `repeat(3, 1fr)` to `repeat(3, minmax(0, 1fr))` so tiles can shrink within their column and never overflow regardless of column width.
- `index.html` — Bumped `styles.css` cache query `?v=20260620c` → `?v=20260620d`.

**Behavior changed:** On screens ≥1024px the home hub now shows a wide centered lesson grid flanked by narrower Review and Settings rails; the game tiles are fully visible (previously clipped/overlapped). Verified in the preview at 1900px wide in both EN and HE (RTL), with Settings collapsed and expanded — no clipping in any combination. Narrower layouts (<1024px) are unaffected.

**Tests run:** Visual verification via preview server at 1900×1000 (EN + HE, Settings collapsed + expanded). No `npm test` impact — CSS-only change plus a version-string bump.

**Risks / regressions to check:** (1) At exactly 1024–~1100px the two 240px-min rails leave the center tighter; the `minmax(0,1fr)` tiles shrink to fit rather than overflow, so it stays functional but is the tightest case to spot-check. (2) The `#resultsView` center-column behavior in hub mode was not changed and should still render in the center column.

---

### 2026-06-20 — Tidy up stale game-name references

**Requested:** Update the hardcoded HTML fallback text still showing old game names, and sweep the codebase for anything else worth tidying related to the rename.

**Files changed:**
- `index.html` — Updated `data-i18n` fallback text (the literal shown before the i18n script runs, and exposed to screen readers) in both the home lesson grid and the in-session game picker: `game.sentenceBankName` "Sentence Builder" → "Sentences"; `game.advConjName` "Advanced Conjugation" → "Conjugation+". Also corrected two fallbacks that were already stale vs `bootstrap-data.js` (predating the rename): `game.translationNote` "Fast multiple-choice translation rounds." → "Match Hebrew words to their English meanings." and `game.abbreviationNote` "Guess English meanings from Hebrew abbreviations." → "Match Hebrew abbreviations to their English meanings." Updated the sentence-bank intro dialog `aria-label` "Sentence Builder intro" → "Sentences intro". Bumped `bootstrap-data.js` cache query `?v=20260620b` → `?v=20260620c`.
- `app/bootstrap-data.js` — Hebrew `prompt.abbreviationStart` quoted the old button label `"התחל קיצורים"`; changed to `"התחל ר״ת"` to match the renamed button (`session.abbreviationStart` he = "התחל ר״ת"). Left descriptive body text like `noAbbreviationTitle` ("אין קיצורים טעונים") as-is — there קיצורים is the common noun "abbreviations," not the game title, and ר״ת would read awkwardly.
- `tests/app-progress.test.js` — Updated the two `grid-template-columns` assertions in "desktop layout uses three live columns…" to the rebalanced hub values (`minmax(240px, 0.62fr) minmax(0, 2fr) minmax(240px, 0.62fr)` for both EN and the symmetric HE rule), since that test pins the exact column definition I changed in the previous entry.

**Behavior changed:** No visible runtime change in the rendered app for the HTML fallback edits — the i18n script already overwrote those strings at load, so the names/notes looked correct before; this just makes the raw source consistent. The Hebrew abbreviation start prompt now quotes the actual button label. The test change keeps the suite aligned with the new hub column widths.

**Tests run:** `npm test` = 168/168 pass (1 failure before the test-assertion update: the pinned old grid value; green after). Verified the home tiles in the preview via accessibility snapshot — names and notes all consistent (Sentences, Conjugation+, corrected Translation/Abbreviation notes).

**Risks / regressions to check:** None functional. Anyone hard-reading the suite should note the hub column test now expects the rebalanced values.

---

### 2026-06-20 — Fix clipped Category Analytics labels in narrow hub rail

**Requested:** After the hub columns were rebalanced (Review/Settings rails narrowed to `minmax(240px, 0.62fr)`), the Review column's "Category Analytics" domain labels were clipped — e.g. "Colloquial & Street" rendered as "Colloqui & Stree", "Professional" as "Profess". Resolve the display issue.

**Cause:** `.domain-grid`/`.mode-grid` are 2-column (`repeat(2, minmax(0, 1fr))`). In the now-240px-wide Review rail, each domain card's text cell collapsed to ~28px, so the English domain titles overflowed and were clipped. (Confirmed via live measurement: rail clamped to its 240px min; with 2 columns the title cell was far too narrow.)

**Files changed:**
- `styles.css` — In the `@media (min-width: 1024px)` block, added `body[data-desktop-hub-layout="true"] .review-analytics-card .domain-grid, …​ .mode-grid { grid-template-columns: 1fr; }` so the analytics cards stack single-column in the narrow hub rail, giving each card the full rail width (~204px) for its ring + label. Only applies in the desktop hub; the standalone `#reviewView` page at <1024px keeps its 2-column grid.
- `index.html` — Bumped `styles.css` cache query `?v=20260620d` → `?v=20260620e`.

**Behavior changed:** On screens ≥1024px the Review rail's Category Analytics (and mode-performance) cards now stack one per row with fully visible labels instead of two cramped, clipped columns. Verified in the preview at 1900px with the Review panel expanded — live measurement shows no horizontal clipping (`scrollWidth == clientWidth`) for all four domain titles. Hebrew unaffected (the HE `#reviewView` rules only set `direction`, not column count). Narrow/mobile review page unchanged.

**Tests run:** `npm test` = 168/168 pass. CSS-only change plus a version-string bump.

**Risks / regressions to check:** The single-column analytics makes the Review rail taller; it's a scrollable side rail so that's expected. Spot-check the standalone Review page on mobile (<1024px) still shows the 2-column analytics grid.

---

### 2026-06-20 — Unify all devices on single-page + bottom-nav (remove desktop hub)

**Requested:** The desktop three-column "hub" (Review | Home | Settings side-by-side) felt amateurish. Make every device use the same single-page layout with the Home/Review/Settings bar at the bottom.

**Approach:** Removed the desktop hub concept entirely. Every viewport now shows one route at a time (home/review/settings/results), switched by the bottom nav — the model mobile already used.

**Files changed:**
- `app/ui.js` — `renderRouteVisibility` no longer branches on viewport width / hub. It now activates exactly one page-view per `state.route` (results when summary active, else home/review/settings) at all widths, and always sets `data-desktop-hub-layout="false"`. (The attribute is kept so the dependent helpers `renderResultsActionsVisibility` and `controller.syncDesktopHubPanels` keep behaving in the non-hub/unified mode without further rewrites.)
- `styles.css` —
  - Rewrote the `@media (min-width: 1024px)` block: deleted every `[data-desktop-hub-layout="true"]` rule (3-column page-stack grid, view `order`s, hub review-grid/analytics/card-padding/collapse overrides). Removed `.mobile-bottom-nav { display: none }` so the bottom nav shows on desktop too, and centered it on wide screens (`left: 50%; transform: translateX(-50%); width: min(560px, calc(100% - 2rem))`). Narrowed `.app-shell` to `max-width: 1000px` with bottom padding to clear the now-visible nav. Set `.review-grid` to a single column (it holds one card now), and capped `.settings-card` (560px) and `.review-panel-card` (760px) centered for a focused, app-like look. Home keeps the 3-wide game grid.
  - Neutralized the collapsible header caret/affordance (`.collapsible-toggle::after { content: none }`, `cursor: default`) since collapsing was a hub-only feature and the toggle is now a no-op on the full Review/Settings pages — avoids a dead control.
- `index.html` — Bumped `styles.css` `?v=20260620e` → `?v=20260620f` and `app/ui.js` `?v=20260620b` → `?v=20260620c`.
- `tests/app-progress.test.js` — Rewrote the hub-pinning tests for the unified model: "all viewports share the single-page layout with the bottom nav" (bottom nav present + centered, no hub CSS), dropped the hub `collapsible-content display:none` assertion, and replaced the three JS behavior tests with width-parameterized versions ("every width shows exactly one route at a time", "results show the review performance button at every width", "review and settings cards stay expanded at every width").

**Behavior changed:** Desktop no longer shows the three-column hub. All devices now present a single page per route with a Home/Review/Settings bottom bar (full-width on mobile, centered on desktop). Desktop home is a centered 3-wide lesson grid; Review and Settings are centered cards reached via the bottom nav. The Review/Settings collapse carets are gone (the panels are always shown). Mobile is visually unchanged.

**Tests run:** `npm test` = 168/168 pass. Verified live in the preview at 1280px (home/review/settings) and 375px (home): single-page navigation via the bottom nav works, content is centered, no clipping, names correct.

**Risks / regressions to check:** (1) During active gameplay on desktop the topbar still shows its `shellHomeBtn` (gated `>=1024`) in addition to the bottom nav Home — redundant but harmless; revisit if it looks off. (2) `controller.syncDesktopHubPanels`/`toggleDesktopHubPanel` are now vestigial (always operate in the expanded/disabled branch) — left in place to keep the change conservative. (3) Confirm the results screen still shows the Review-performance button and centered metrics at desktop width.

---

### 2026-06-19 — Match-card centering, in-prompt tip, and new Hebrew font scheme

**Requested:** (1) Move the "select the Hebrew first to hear it aloud" tip inside the prompt box, keeping it polished and compact; (2) show that tip in all three matching games (Translation, Conjugation, Abbreviation); (3) fix centering issues in the abbreviation game; (4) apply a new font scheme — Frank Ruhl Libre for the IvritElite brand title only, Heebo for game card titles, Assistant for everything else — and check legibility across desktop/tablet/mobile.

**Approach / judgment calls:**
- *Centering:* Root cause was that the matching board rendered two independent column stacks (`.match-col > .match-stack`). When a left/English card wrapped to two lines, its short Hebrew counterpart stayed top-aligned in a taller row, so the row looked vertically off-center. Replaced the two-stack DOM with a single 2-column CSS grid where cards are appended interleaved (left, right, left, right …); grid auto-rows + `align-items: stretch` give every pair a shared row height, and the existing `.choice-btn { place-items: center }` re-centers each card's text. Applied the identical change to both renderers (`match-engine.js` for Translation/Abbreviation and `verb-match.js` for Conjugation) since they share the CSS and the same bug.
- *Tip:* Moved `#promptHint` from a sibling below `.prompt-card` to the last child inside it, restyled as `.prompt-hint-note` (small, muted, with a top divider) so it reads as a compact footnote within the box. Extended `ui.renderPromptHint` to also fire for word-match modes (using `state.wordMatch.active` instead of `state.match.active`, which only applies to conjugation), and added an `app.ui.renderPromptHint()` call to `matchEngine.renderPrompt` so the tip persists across re-renders as pairs are cleared.
- *Fonts:* Interpreted "game card titles" as the home game-picker tile titles (`.game-tile-title`). The in-game prompt heading ("Match the pairs") is the *prompt box*, not a game card, so per "Assistant for everything else" it became Assistant. Swapped the Google Fonts link from Alegreya/Chivo to Frank Ruhl Libre/Heebo/Assistant, repointed every `Alegreya`/`Chivo` declaration to Assistant, then set the two specific overrides. Frank Ruhl Libre and Heebo are native Hebrew typefaces, which also improves Hebrew rendering over the old Alegreya serif.

**Files changed:**
- `app/match-engine.js` — `renderCards` rebuilt: single `.match-columns` grid with interleaved left/right buttons (removed the `.match-col`/`.match-stack` wrappers); `renderPrompt` now calls `app.ui.renderPromptHint()`.
- `app/verb-match.js` — `renderVerbMatchCards` rebuilt the same way (interleaved grid, no column wrappers).
- `app/ui.js` — `renderPromptHint` now shows the tip for verb-match **and** word-match modes, picking the correct active flag per mode.
- `index.html` — Moved `#promptHint` inside `.prompt-card` (now `class="prompt-hint-note"`); swapped the Google Fonts `<link>` to `Assistant`/`Frank Ruhl Libre`/`Heebo`; bumped `styles.css?v=20260620b`.
- `styles.css` — Renamed/restyled `.prompt-support-note` → `.prompt-hint-note` (divider + muted footnote) and its media-query sizes; `.match-columns` now `align-items: stretch`; removed the orphaned `.match-col`/`.match-stack` rules (base + two media queries); `.shell-brand-title h1` → Frank Ruhl Libre 900; `.game-tile-title` → Heebo 700; all remaining `Alegreya`/`Chivo` → Assistant.
- `tests/app-progress.test.js` — Updated the "conjugation keeps English on the left and Hebrew on the right" test to read the flattened grid (`columns.children[0]`/`[1]` are now the cards themselves, not column wrappers).

**Behavior changed:** The tip now appears as a compact footnote inside the prompt box in all three matching games (when speech is enabled/supported). Match cards in every matching game now share row heights, so short Hebrew cards sit vertically centered opposite tall wrapped English cards. The brand title renders in Frank Ruhl Libre, home tile titles in Heebo, and all other text in Assistant. Verified legible on desktop (1280), tablet, and mobile (375), in both dark and light themes and both EN/HE UI.

**Tests run:** `npm test` before = 168/168 pass; after = 168/168 pass (1 test updated for the new DOM, no tests added/removed). Live-verified via the preview server: all three fonts load and apply (`Frank Ruhl Libre 900`, `Heebo 700`, `Assistant 700` loaded); abbreviation/translation/conjugation boards render with equal-height rows and centered cards; the tip shows inside the prompt box; no console errors.

**Risks / regressions to check:** (1) The card grid now assumes equal left/right counts (always true for paired data); if counts ever differ, the trailing grid cell would shift — acceptable for current gameplay. (2) Frank Ruhl Libre/Heebo are loaded from Google Fonts; an offline/CDN-blocked client falls back to the serif/sans defaults (brand → serif, tiles → sans) — no layout break, just substitute glyphs. (3) "Game card titles" was interpreted as the home tiles; if the user meant the in-game prompt heading too, that one is still Assistant and would need a one-line override.

---

### 2026-06-19 — Delete the unreachable multiple-choice Translation & Abbreviation code

**Requested:** Remove the now-unreachable multiple-choice (MC) Translation and Abbreviation gameplay (left in place by the earlier matching-layout conversion) and its MC-specific tests. The matching games (`lessonMatch`/`abbrMatch`) are the only live entry points.

**Approach / judgment calls:** Confirmed via grep that the MC paths are unreachable: `lesson` is only the app's idle/default mode (`lesson.active` is only ever set by `startLesson`→`nextQuestion`, both reachable solely through dead controller fallthroughs), and `abbreviation` mode is only reachable through the same dead branches. Every external call site to the removed functions already uses optional chaining (`?.`), so removal is a safe no-op for those sites. Per the task's "remove the whole MC lesson path" guidance (since `startLesson` is not wired to any live tile), the entire MC active-session flow was removed for both games — including the dead `start*`/`*Intro` scaffolding — to avoid leaving functions that call deleted functions. Kept genuinely-live helpers used by surviving code.

**Files changed:**
- `app/lesson.js` — Reduced to the two still-referenced helpers: `getLessonPromptSpeechPayload` (used by `ui.js`) and `cloneLessonQuestionSnapshot` (used by `session.js`/`persistence.js`). Removed `startLesson`, `playLessonStartIntro`, `beginLessonFromIntro`, `playSecondChanceIntro`, `beginSecondChanceFromIntro`, `nextQuestion`, `renderQuestion`, `renderChoices`, `applyAnswer`, `markChoiceResults`, `addMissedWord`, `buildQuestion`, `buildReviewQuestion`, `buildOptions`, `pickQuestionMode`, `rememberOptionHistory`, `tryStartReviewPhase`, `getLessonSelectionSpeechPayload`, and the private lesson-option helpers.
- `app/abbreviation.js` — Removed the 10 MC functions (`buildAbbreviationQuestion`, `buildAbbreviationOptions`, `renderAbbreviationChoices`, `selectAbbreviationOption`, `applyAbbreviationAnswer`, `markAbbreviationChoiceResults`, `nextAbbreviationQuestion`, `renderAbbreviationQuestion`, `getAbbreviationDirectionLabel`, `getAbbreviationRoundTarget`) plus the now-dead intro chain (`startAbbreviation`, `playAbbreviationIntro`, `beginAbbreviationFromIntro`) and orphaned private/speech helpers (`getAbbreviationOptionLabelKey`, `getAbbreviationSelectionSpeechPayload`). **Kept** the data functions still used by the matching game (`prepareAbbreviationDeck`, `pickBestAbbreviationEntry`, `getDueAbbreviationEntries`, `getExpansionText`) and the broadly-live `resetAbbreviationState`, `renderAbbreviationIdleState`, `cloneAbbreviationQuestionSnapshot`, `getAbbreviationPromptSpeechPayload`.
- `app/controller.js` — Removed `handleAbbreviationShortcutKey` (the 1–4/Enter MC shortcuts) and its `handleGlobalKeyDown` call site, the now-unused `isPlainShortcutEvent` helper, and the MC branches in `handleNextAction` for `lesson` and `abbreviation`. (Left the optional-chained `startLesson`/`startAbbreviation` calls in the dead `openHomeLesson`/`continueFromResults` fallthroughs — harmless no-ops, out of the stated scope.)
- `app.js` — Removed the dead `const` aliases, their entries in the startup validation block, and their entries in the `appRuntime.helpers` registry. Kept `cloneLessonQuestionSnapshot`, `cloneAbbreviationQuestionSnapshot`, `prepareAbbreviationDeck`, `renderAbbreviationIdleState`, `resetAbbreviationState`, `pickBestAbbreviationEntry`, `getDueAbbreviationEntries`.
- `tests/controller-abbreviation-shortcuts.test.js` — Deleted (covered the removed keyboard shortcuts).
- `tests/app-progress.test.js` — Updated the harness `__appTestExports` block to drop the removed const references (otherwise it throws `ReferenceError` at load and breaks every test). Removed 20 MC-specific tests (translation distractor/shape/dedupe, abbreviation option-label/expansion-feedback, second-chance, translation submit/selection/feedback-sound/speech). Rewrote 9 cross-cutting tests onto surviving modes (advanced-conjugation submit/selection/sound-fallback/disabled-sound, verb-match start-flow/session-pinning/leave-confirmation, and a data-pool sanitize check) so the behaviors stay covered without the MC path.
- `tests/abbreviation-data.test.js` — Removed the `contact-info abbreviations prefer each other as distractors` test (exercised the removed `buildAbbreviationOptions`); the underlying distractor data is no longer used by gameplay.

**Behavior changed:** None observable. The MC Translation/Abbreviation games were already unreachable; this only deletes their code and tests. Both matching games and all other modes are unchanged.

**Tests run:** `npm test` before = 192/192 pass; after = 168/168 pass (24 tests removed: 20 in `app-progress.test.js`, 1 in `abbreviation-data.test.js`, 3 in the deleted shortcuts file; 9 rewrites net zero). `node --check` passes on all edited source files. Live-verified via the preview server: app reloads with no console errors; both `lessonMatch` and `abbrMatch` launch and go active; `app.lessonMode` now exposes only the two kept helpers.

**Risks / regressions to check:** (1) Users with old persisted `localStorage` (`mode: "lesson"` + a saved `currentQuestion`, or `mode: "abbreviation"`) will resume into the idle state via `renderIdleLessonState`/`renderAbbreviationIdleState` rather than a live MC question — acceptable since MC no longer exists, but worth a sanity check on a real stale session. (2) `abbreviationQuizDistractorIds` data in the deck is now vestigial (no consumer) — candidate for a future data cleanup. (3) Several still-present session/data helpers tied to the old lesson mode (`finishLesson`, `buildLessonMistakeSummary`, `updateLessonProgress`, `pickLeastSeenLessonDomainId`, `finishAbbreviation`, `buildAbbreviationMistakeSummary`) are now dead but were left untouched as out-of-scope (they live in `session.js`/`data.js`); a future pass could remove them.

---

### 2026-06-19 — Convert Translation & Abbreviation to the matching layout

**Requested:** Make the Translation and Abbreviation games use the conjugation game's matching layout (Hebrew on one side, English on the other, click to match), drilling ~20 items per session since the format is faster. Replace the multiple-choice versions for the user, handle long answer strings gracefully, and clean up where sensible.

**Approach decided with the user:** Add the matching games as new modes (`lessonMatch`, `abbrMatch`) wired to the existing Translation/Abbreviation home tiles + in-session picker buttons, so the multiple-choice (MC) games become unreachable in the UI. The old MC code and its ~40+ tests are left intact and green for now ("retire now, delete later") — chosen because the MC games are deeply wired into `app.js` boot (alias lists, a startup validation block, the `helpers` registry) and heavily covered by `tests/app-progress.test.js`; a full deletion is a separate, riskier pass. Abbreviation cards match acronym ↔ English meaning; verbose English glosses are shortened for display; very long entries are filtered out and remaining long text wraps.

**Files changed:**
- `app/match-engine.js` (new) — Generic two-column matching engine (`app.matchEngine`) extracted from the verb-match mechanics, parameterized by a config (`ctx`, `getPairs`, `onSuccess`/`onMismatch`/`onAllMatched`, `getCardSpeechPayload`, `rightIsHebrew`, `promptText`). Handles refill, render, select, success/mismatch resolution, combo/streak, and the 180/300ms feedback timeouts. Adds a `match-card-long` class when text exceeds `MATCH_LONG_LEN`.
- `app/word-match.js` (new) — `app.wordMatch`: drives both new modes via the engine. Builds ~20 pairs (`WORD_MATCH_SESSION_SIZE`) from the existing pools (`data.getSelectedPool` + `data.pickBestWord` for translation; `runtime.abbreviationDeck` + `abbreviation.pickBestAbbreviationEntry` for abbreviations), filtering entries longer than `MATCH_MAX_LEN`. Records Leitner progress via `data.updateProgress` (modes `translationQuiz`/`abbreviationQuiz`), tracks mismatched ids for the summary, `shortGloss()` trims verbose English, and `finishWordMatch()` shows the session summary.
- `app/bootstrap-runtime.js` — Added a `wordMatch` state slice (board + session counters). Not persisted (transient).
- `app/constants.js` — `WORD_MATCH_SESSION_SIZE` (20), `MATCH_MAX_LEN` (40), `MATCH_LONG_LEN` (16).
- `app/session.js` — `startWordMatchTimer`/`stopWordMatchTimer`; included `wordMatch` in `hasActiveLearnSession`, `isModeSessionActive`, `endSessionAndNavigate` (reset + stop timer), and `showSessionSummary` teardown; restore guard drops un-resumable match modes to home.
- `app/controller.js` — Repointed the Translation/Abbreviation home tiles and picker buttons to `lessonMatch`/`abbrMatch`; added `openHomeLesson` and `continueFromResults` branches; `handleNextAction` is a no-op for these modes (matches resolve on click, no Next button).
- `app/ui.js` — Added `isWordMatchMode`; `renderLearnState` and `renderSessionHeader` branches for the new modes (progress = matched/total, Next hidden); `verb-match` shell layout applied; home-tile highlight maps `lessonMatch`→Translation and `abbrMatch`→Abbreviation.
- `app/bootstrap-data.js` — Added `summary.wordMatchNote` (EN+HE); updated the Translation/Abbreviation tile descriptions (EN+HE) to describe matching.
- `styles.css` — `.match-card` now grows vertically and wraps (`white-space: normal`, `overflow-wrap: anywhere`); `.match-card-long` reduces font for long strings.
- `index.html` — Registered the two new scripts (after `verb-match.js`) and bumped cache-busting `?v=` on all edited files + `styles.css`.

**Behavior changed:** The Translation and Abbreviation tiles now open a matching board — English on the left, Hebrew (words / acronyms) on the right, shuffled, 5 visible rows that refill as pairs are cleared — for a 20-item session ending in a results summary. The old 4-option multiple-choice versions (and the abbreviation 1–4/Enter keyboard shortcuts) are no longer reachable from the UI but remain in the codebase. Conjugation game unchanged.

**Tests run:** `npm test` before = 192/192 pass; after = 192/192 pass (no test changes; MC code left intact so its suite stays green). Live-verified via the preview server: app boots with no console errors; both tiles launch their matching game; full Translation and Abbreviation sessions play to "…Complete" summaries (20/20, note "Matched: 20 | Best combo: 20 | Time: 4s"); a deliberate mismatch increments the mismatch count, records the mistake id, and resets the streak; long English glosses wrap without breaking the 2-column grid; conjugation game still renders/plays; leave-session resets `wordMatch`; "Play Again" restarts the matching game.

**Risks / regressions to check:** (1) Dead code — the MC translation/abbreviation gameplay and its ~40+ tests still exist; a follow-up should delete them plus their `app.js` aliases/validation/helpers wiring (flagged as a background task). (2) Mid-session reload is not resumable for the new modes (board is transient) — it drops to home by design. (3) On a mismatch the left card's word is marked wrong in Leitner (mirrors the conjugation game); a mistapped-then-matched item nets one wrong + one correct. (4) `MATCH_MAX_LEN`/`MATCH_LONG_LEN` thresholds were tuned against current data; adding much longer entries may need retuning.

---

### 2026-06-19 — Show each form's grammatical function in the Binyanim game

**Requested:** Alongside the binyan name (הפעל etc.) and the form, also show the form's function (simple active, passive/reflexive, etc.).

**Files changed:**
- `app/binyan-board.js` — Captured the per-form `function` field on each deck entry (`func`) and carried it onto the question object, so the function travels with the current question.
- `app/ui.js` — `renderPromptHint` now displays the function for `binyanBoard` rounds: it translates `binyan.function.{func}` into the existing prompt hint note (rendered directly under the form), skipping `other`/empty. (renderPromptHint already runs via `renderSessionHeader` on each question load, so no extra wiring.)
- `app/bootstrap-data.js` — Added a `binyan.function` label map (EN + HE) for all `function` enum values: simple→"Simple active"/"פשוט (פעיל)", passive→"Passive"/"סביל", middle→"Middle"/"אמצעי", intensive→"Intensive (active)"/"מוגבר (פעיל)", causative→"Causative"/"גורם", reflexive→"Reflexive"/"חוזר", reciprocal→"Reciprocal"/"הדדי", resultative, inchoative, active.
- `index.html` — Bumped cache-busting `?v=` on `app/binyan-board.js`, `app/ui.js`, and `app/bootstrap-data.js`.

**Behavior changed:** In a Binyanim round, the prompt card now reads: binyan name (e.g. פָּעַל) → vocalized form (e.g. קָם) → its function (e.g. "Simple active"), then the gloss options. The function label is localized with the UI language. Uses the per-form authored `function` value (so it reflects real semantics — e.g. ל־מ־ד pi'el shows "Causative", not "Intensive"). No other game affected.

**Tests run:** `npm test` after = 177/177 pass (no test changes). Live-verified in a browser: walked the full כ־ת־ב paradigm and confirmed each form's binyan label, vocalized form (DOM matches state), and function line line up (פָּעַל/Simple active, נִפְעַל/Passive, פִּעֵל/Intensive (active), פֻּעַל/Passive, הִפְעִיל/Causative, הֻפְעַל/Passive, הִתְפַּעֵל/Reciprocal); confirmed both EN and HE function strings resolve. No console errors.

**Risks / regressions to check:** Showing the function gives a hint toward voice, but distractors are same-root siblings that often share a function (e.g. כ־ת־ב has three passives), so it doesn't trivially reveal the answer — and it is an intended teaching aid. `function: "other"` and missing functions render no line. Hebrew grammar terms are standard (סביל/פעיל/חוזר/הדדי/גורם/מוגבר); "middle"→"אמצעי" and the rare resultative/inchoative terms can be refined if desired.

---

### 2026-06-19 — Enable Hebrew speech in the Binyanim game

**Requested:** Enable text-to-speech in the Binyanim game so the Hebrew can be heard, using the same format as the other games.

**Files changed:**
- `app/binyan-board.js` — Added `getBinyanBoardPromptSpeechPayload()`, building a speech payload from the current question's vocalized form (niqqud carries the pronunciation) with `source: "prompt"`, mirroring `lessonMode.getLessonPromptSpeechPayload`. (`renderRoundQuestion` already calls `app.ui.renderPromptSpeechButton`, so the speaker control now appears.)
- `app/ui.js` — In `getCurrentPromptSpeechPayload`, the `binyanBoard` branch now returns the new payload instead of `null`, so the shared prompt speaker button and `playPromptSpeech` work for this mode.
- `index.html` — Bumped cache-busting `?v=` on `app/binyan-board.js` and `app/ui.js`.

**Behavior changed:** In a Binyanim round, the speaker icon now appears on the prompt card next to the vocalized form (same control/placement as the other Hebrew-prompt games); clicking it pronounces the form via the browser's `he-IL` voice. Options are English glosses, so there is no option-level speech. No other game affected.

**Tests run:** `npm test` after = 177/177 pass (no test changes). Live-verified in a browser: opened a כ־ת־ב round, confirmed the speaker button renders and is enabled, the prompt payload resolves to the vocalized form (`כָּתַב`, `lang: "he-IL"`), and `playPromptSpeech()` returns true with `speechSynthesis.speaking` true. No console errors.

**Risks / regressions to check:** Speech still depends on the browser having a Hebrew (`he-IL`) voice and the user's speech preference; behavior matches the other modes' speaker button (shown whenever speech is supported). The payload uses the vocalized form for both `plain` and `niqqud`, so pronunciation reflects the authored niqqud.

---

### 2026-06-19 — Add the Binyanim paradigm-board game

**Requested:** Build a new game testing the seven Hebrew binyanim, seeded from two attached files (`verb_game_schema.json`, `verbs_seed.json`). The user's starting idea was a Jeopardy board of roots; after design discussion we settled on a **Paradigm Board**: a board of root tiles → pick a root → play through that root's binyan forms as a connected mini-round → tile clears → clear all tiles to win. v1 scope (user-confirmed): **form → meaning** questions only, **niqqud always on**. Hard rule from the schema: verb forms are authored/verified data — the app only shuffles and displays, never generates.

**Files changed:**
- `verb-game-data.js` — **New.** Verbatim port of `verbs_seed.json` (6 roots, version, distractor strategy, binyanim metadata) into the project's IIFE/global pattern, exposed as `global.IvriQuestVerbGameData`. No forms transformed.
- `app/binyan-board.js` — **New.** The `app.binyanBoard` mode module, modeled on `app/adv-conj.js`. Builds a deck of roots (each with its `exists:true` forms in canonical binyan order) plus a cross-root distractor gloss pool; renders the root board and the per-root rounds into the shared `#choiceContainer`; builds 4-option form→meaning questions (3 distractors from sibling binyan glosses of the same root, topped up cross-root only when needed, excluding `distractor_eligible:false`); handles answer/score/feedback (revealing `teaching_point` when present), tile-clearing, win → `showSessionSummary`, and a session timer.
- `app/bootstrap-runtime.js` — Registered `homeBinyanBoardBtn`/`binyanBoardBtn` elements and added the `binyanBoard` state slice to `createInitialState`.
- `app/controller.js` — `bindUi` listeners for both new tiles; `binyanBoard` branches in `openHomeLesson`, `continueFromResults`, and `handleNextAction` (delegates to `handleBinyanBoardNext`).
- `app/ui.js` — `binyanBoard` branches in `renderLearnState` (dispatch to `renderBinyanBoard`), `renderSessionHeader`, `getGameplayHeaderMeta`, `updateLessonShellModeState` (standard layout + `mode-binyan-board` class), `updateStickyLessonActionsState` (feedback gate), and `getCurrentPromptSpeechPayload` (returns null — no speech yet).
- `app/session.js` — Added `binyanBoard` to `hasActiveLearnSession` and `isModeSessionActive`; reset/stop hooks in `endSessionAndNavigate` and `showSessionSummary`; a `restoreSessionState` guard normalizing a stale `binyanBoard` mode on reload (binyan sessions are not persisted/restored, matching advConj).
- `app/bootstrap-data.js` — Added EN + HE strings: `game.binyanName`/`binyanNote`, a `binyan` block (`cleared`, `difficulty.easy/medium/hard`), `feedback.binyanCorrect`/`binyanWrong`, `summary.binyanTitle`/`binyanNote`.
- `index.html` — Added the Binyanim tile to both the home dashboard grid and `#gamePicker`; added `<script>` tags for `verb-game-data.js` and `app/binyan-board.js`; bumped cache-busting `?v=` on the edited app files (`bootstrap-data.js`, `bootstrap-runtime.js`, `session.js`, `ui.js`, `binyan-board.js`, `controller.js`).
- `styles.css` — Appended board styling: `.binyan-board-grid`, `.binyan-root-tile` (+ cleared/disabled state and per-difficulty badge colors), root-letters/meaning/badge, and an enlarged prompt form for `mode-binyan-board`.

**Behavior changed:** A new "Binyanim" game appears on the home dashboard and in-session game picker. It shows a board of 6 root tiles (Hebrew root, English core meaning, difficulty badge + form count). Picking a root walks its existing binyanim in canonical order as vocalized-form → English-meaning multiple choice; correct/wrong locks the round, highlights the answer, plays the existing feedback sound, and reveals the form's teaching point when one exists. `exists:false` slots are never quizzed. Clearing every root opens the standard session summary (score/accuracy/time/mistakes, mistakes shown as vocalized form + gloss); "Play Again" restarts. No other game is affected.

**Tests run:** `npm test` before = 177/177 pass; after = 177/177 pass (no test changes). Live-verified in a browser (static server on the repo root): launched the game, confirmed the 6-tile board with difficulty badges/form counts; opened כ־ת־ב and confirmed the prompt shows the vocalized form with niqqud, the binyan-name label, and that all 3 distractors are sibling glosses of the same root; answered correctly (feedback `Correct. כָּתַב means "wrote".`); cleared all 7 forms in canonical order and confirmed the tile cleared and the board returned; opened ס־ד־ר and confirmed the הִסְתַּדֵּר metathesis teaching point renders in the feedback tray; completed the whole board → "Binyanim Complete" summary with score/accuracy/time and Hebrew-form mistakes; "Play Again" restarted with a fresh board; leaving mid-game via Home reset the mode and cleared the timer. No console errors.

**Risks / regressions to check:** Only 6 roots ship, so a board is short; add roots by appending to `verb-game-data.js` (no code change). Binyan results are not written to the spaced-repetition progress map (forms aren't vocab words) and binyan sessions are not restored across reloads — both intentional and matching advConj. Leaving any game leaves `state.mode` at a stale label (e.g. `"lesson"`) while the dashboard shows correctly — this is pre-existing app behavior, confirmed identical for advConj. Distractor top-up falls back to the cross-root pool only when a root has fewer than 4 eligible sibling glosses.

---

### 2026-06-19 — Scrap the Bubble Conjugation game and stop it auto-resuming

**Requested:** On `localhost:8080`, opening the Abbreviation game instead showed the Bubble Conjugation game (which was meant to be scrapped). It behaved correctly on GitHub Pages. Diagnose, then remove the bubble game for good.

**Diagnosis:** Not a code-on-disk problem on its face — `index.html` already had no bubble buttons/script. The app auto-restores the last session from `localStorage` (`ivriquest-session-v1`) on every load (`app.js` → `restoreSessionState`). A previously-saved `mode: "verbBubble"` session was being resumed on load, dropping the user into the bubble game regardless of what they clicked. GitHub Pages is a different origin (separate `localStorage`) with no such saved session, so it looked fine there. Root cause: this branch's working tree had re-added the bubble game (`verbBubble` mode wiring across controller/verb-match/session/ui), and a stale bubble session kept resurrecting it.

**Files changed:**
- `app/verb-match.js` — Removed bubble layout mode entirely: deleted `getVerbMatchLayoutMode`/`getVerbMatchModeName`/`isVerbBubbleMode` helpers, `startVerbBubbleMatch`, all `app.verbBubbleStage?.*` calls, `renderVerbMatchBubbles`, and the bubble branches in `refillVerbMatchColumns`/`renderVerbMatchCards`/`loadNextVerbRound`/`finishVerbMatchSession`. Classic Conjugation logic is unchanged; `layoutMode` is now always `"classic"`.
- `app/controller.js` — Removed the `homeVerbBubbleBtn`/`verbBubbleBtn` click bindings, the `verbBubble` case in `openHomeLesson`, the `verbBubble` summary/continue case, and reverted the gameplay-key condition to `verbMatch`-only. (Net: reverts to its committed `HEAD` state — the bubble wiring here was uncommitted.)
- `app/session.js` — Removed `verbBubble` from `isModeSessionActive` and the match timer; simplified the match-restore block to classic-only. **Added a guard at the top of `restoreSessionState`: any snapshot with `mode === "verbBubble"`, `match.layoutMode === "bubble"`, or `summary.game === "verbBubble"` is discarded and cleared from storage (`clearPersistedSession`), so a stale bubble session can never resurrect.**
- `app/ui.js` — Removed `verbBubble` branches from `isVerbMatchMode`, the shell/prompt `mode-verb-bubble` class toggles, the session-title key selection, and the home-tile highlight.
- `app/bootstrap-runtime.js` — Removed the `homeVerbBubbleBtn`/`verbBubbleBtn` element registrations.
- `app/bootstrap-data.js` — Removed the now-unused i18n strings `verbBubbleTitle`, `verbBubbleStart` (EN + HE) and `summary.bubbleMatchTitle` (EN + HE).
- `app/verb-bubble-stage.js` — Deleted (was an untracked, unloaded module).
- `styles.css` — Removed bubble-game CSS only: `.choices.match-bubble-grid`, `.match-bubble-stage*`, `.match-card.match-bubble*`, the `matchBubbleRise/SwayX/Pop/Shake` keyframes, the two responsive `@media` variants, and the `#homeVerbBubbleBtn/#verbBubbleBtn:hover` rule. Kept the shared `--bubble-*` CSS variables and all `.second-chance-bubble` rules (used by the unrelated intro overlays).
- `tests/app-progress.test.js` — Removed the "bubble conjugation is a separate selectable mode" test and dropped `verb-bubble-stage.js` from the harness script-load list.
- `index.html` — Removed the stale "verb-bubble-stage.js intentionally not loaded" comment and bumped cache-busting `?v=` to `20260619a` for the edited files (`bootstrap-data.js`, `bootstrap-runtime.js`, `session.js`, `ui.js`, `verb-match.js`, `controller.js`, `styles.css`) so browsers don't serve stale cached JS/CSS.

**Behavior changed:** Bubble Conjugation is fully gone and cannot be launched. A previously-saved bubble session is discarded on next load (and erased), so the app no longer auto-resumes into it — opening Abbreviation now opens Abbreviation. Classic Conjugation and all other games are unchanged.

**Tests run:** `npm test` before = 178/178 pass (branch baseline). `npm test` after = 177/177 pass (the one removed test is the deleted bubble test). Also live-verified in a browser (static server, served repo root): seeded a `verbBubble` session in `localStorage`, reloaded → app booted clean to a non-bubble state with the stale session cleared from storage and no console errors; clicking Abbreviation launched Abbreviation (`mode: "abbreviation"`, no bubble stage in DOM); starting classic Conjugation rendered the two-column match grid (10 cards, `layoutMode: "classic"`, no bubble stage).

**Risks / regressions to check:** Users who currently have a bubble session saved will, on first load after this ships, be dropped to a clean home state instead of resuming — intended. The `restoreSessionState` guard keys on `verbBubble`/`bubble` strings; harmless unless those identifiers are ever reused for a new feature. Mid-classic-match saved sessions still restore normally. Because the bubble wiring in `controller.js`/`tests/app-progress.test.js` was uncommitted, those two files now read as unmodified vs `HEAD` — expected.

---

### 2026-06-19 — Soften answer sound effects

**Requested:** The answer sound effects in `assets/sounds/` were a little harsh on the ears. Keep the notes/melody but rework the sounds so they are softer.

**Files changed:**
- `assets/sounds/answer-correct.mp3` / `.ogg`, `assets/sounds/answer-streak.mp3` / `.ogg`, `assets/sounds/answer-wrong.mp3` / `.ogg` — Re-encoded each clip through an ffmpeg softening chain (no pitch or tempo change): `afade in 18ms` (removes the clicky onset transient — most pronounced on the wrong sound, which had a full-spectrum click at t=0), `highshelf f=3200 g=-9` + `lowpass f=10000` (rolls off the bright/tinny harmonics that previously reached ~13–15 kHz), `volume -2.5dB`, and `afade out` over the tail. MP3s re-encoded with libmp3lame @128k; OGGs re-encoded with ffmpeg's native `vorbis` encoder (this ffmpeg build lacks `libvorbis`) @128k, keeping the original vorbis-in-ogg codec.
- `assets/sounds/original-backup/` (new) — Untouched copies of all six original files, in case the originals need to be restored.

**Behavior changed:** Correct / streak / wrong feedback sounds play the same melodies but noticeably softer: peak levels dropped from ~-0.5 dBFS to ~-3 to -4.7 dBFS, high-frequency brightness is reduced, and the sharp attack clicks are smoothed. Durations are unchanged. No app code references changed.

**Tests run:** Did not run `npm test` (asset-only change, no JS touched). Verified each output decodes cleanly and confirmed levels/spectrograms via `ffprobe`/`ffmpeg volumedetect`/`showspectrumpic`: onset clicks gone, top-end harmonics rolled off, fundamentals/melody intact.

**Risks / regressions to check:** The native ffmpeg `vorbis` encoder is lower quality than `libvorbis`; the clips are short SFX so this should be inaudible, but give the `.ogg` files a listen in a browser that prefers ogg (Firefox). If any sound now feels too quiet or too dull, the softening amount (high-shelf gain, lowpass cutoff, volume) can be eased and re-rendered from `original-backup/`. Originals are preserved in `assets/sounds/original-backup/`.

---

### 2026-06-09 — Soft-disable Bubble Conjugation game

**Requested:** Remove the Bubble Conjugation game from the UI without deleting its code, so it can be restored later.

**Files changed:**
- `index.html` — Removed the `<script defer src="./app/verb-bubble-stage.js">` tag (replaced with a comment). Removed the `homeVerbBubbleBtn` tile from the home screen game grid. Removed the `verbBubbleBtn` tile from the in-lesson game picker.

**Behavior changed:** Bubble Conjugation no longer appears as a selectable game on the home screen or in the in-lesson game picker. The `verb-bubble-stage.js` module is not loaded. All other games are unaffected.

**Tests run:** None (UI-only change; no logic altered).

**Risks / regressions to check:** Any code paths that reference `verbBubbleBtn` or `homeVerbBubbleBtn` by ID (e.g., in `controller.js` or `ui.js`) will silently no-op when looking up those elements — verify no errors are thrown on load. To re-enable, uncomment the script tag and restore the two button blocks.

---

### 2026-05-03 14:15 — Make Bubble Conjugation actually playable with rising staggered bubbles

**Requested:** The newly added Bubble Conjugation game wasn't playable — when a pair popped, both halves of the next pair surfaced together into adjacent fixed grid slots, making the next match visually obvious. Rework so bubbles continuously rise from the bottom at random horizontal positions, with the English and Hebrew halves of any pair released at independent times so a fresh pair-up isn't visually telegraphed. Reference video: https://www.youtube.com/watch?v=Ym1nc_64kzU (we are not adopting its special-bubble freeze/pop powerups). The classic two-column Conjugation must remain unchanged.

**Files changed:**
- `app/verb-bubble-stage.js` (new) — Module owning the bubble stage element, a persistent `Map<cardId, HTMLElement>` of live bubbles, an in-memory queue of pending halves, a self-rescheduling `setTimeout` spawn loop, per-bubble `animationend` listeners that pop or recycle, a `visibilitychange`-driven pause/resume, and an `unmount` that tears everything down. Initial seed at round start synchronously spawns up to 6 bubbles biased so at least one English and one Hebrew render before the first scheduled tick.
- `app/verb-match.js` — Removed the fixed `BUBBLE_LAYOUTS` 8-slot grid and all its helpers (`buildVerbMatchBubbleLayout`, `getNextBubbleSlot`, `ensureVerbMatchBubbleLayout`, `normalizeVerbMatchBubbleLayouts`, `applyBubbleStyle`, plus the unused `clampNumber`/`getCardNumber`). `refillVerbMatchColumns` now branches: classic mode keeps the existing column refill; bubble mode drains `remainingPairs` into `verbBubbleStage.enqueuePair`. `renderVerbMatchBubbles` is now a thin shim around `verbBubbleStage.mount` + `sync`. `loadNextVerbRound` clears the bubble queue and resets the round-key on a new verb. `resetVerbMatchState` calls `verbBubbleStage.unmount` so leaving bubble mode (or starting a new session) cleans the stage and scheduler. `finishVerbMatchSession` also unmounts in bubble mode.
- `styles.css` — Replaced `matchBubbleSurface` and `matchBubbleDrift` with two composable animations: `matchBubbleRise` (linear `top: 110% → -10%` over a per-bubble `--bubble-rise-duration` of 9–13s) and `matchBubbleSwayX` (gentle horizontal oscillation via `--bubble-sway-x`). The bubble base rule sets `top: 110%` so unstarted bubbles are below the stage. `.matched` and `.mismatch` keep rise running by listing it again in their animation stack — they layer pop or shake on top so neither selection state restarts the rise. Added `.match-bubble-stage.paused .match-card.match-bubble { animation-play-state: paused }` for tab-hidden pauses.
- `app/session.js` — Bubble-mode persistence restore now resets in-flight bubble state: `leftCards`/`rightCards` cleared, `remainingPairs` recomputed from `pairs` minus `matchedPairIds`, transient interaction state (selected/matched/mismatched IDs, `isResolving`) cleared. Mid-flight bubble positions are not recoverable across reload, but round progress (matched pairs, combo, score, time) is preserved.
- `index.html` — Added `<script defer src="./app/verb-bubble-stage.js?v=20260503b">` before `verb-match.js`. Bumped versions for `styles.css`, `app/session.js`, and `app/verb-match.js` to `20260503b`.
- `tests/app-progress.test.js` — Added the new `verb-bubble-stage.js` module to the harness's script load list before `verb-match.js`. Existing bubble regression continues to pass: the synchronous initial seed in `mount`/`sync` guarantees both `.match-bubble.english` and `.match-bubble.hebrew` exist after the first render without needing to advance fake timers.

**Behavior changed:** Bubble Conjugation now plays as a true rising-bubble stage. Each bubble enters at `y=110%` at a random `x` in 12–88% (with min-distance spacing to avoid overlap) and rises to `y=-10%` over 9–13s, with light horizontal sway. Each English and Hebrew half of any pair is queued and released independently — the scheduler shuffles the queue and dequeues every 1.5–2.5s — so the player never sees a fresh pair surface together. Visible target is 6 bubbles, refilled from the queue as bubbles pop or recycle. Unmatched bubbles that reach the top are removed, re-queued, and respawn at a new x after a 0.7–1.3s delay (they aren't lost). Successful matches still run the existing pop animation; mismatches shake briefly without despawning, and both bubbles keep rising. Niqqud toggles and selection clicks update existing bubble nodes in place rather than rebuilding the stage, so no rises restart on interaction. Tab-switch pauses the rise/sway animations and the spawn scheduler; returning to the tab resumes them. Classic two-column Conjugation is unchanged.

**Tests run:** `npm test` — passed, 174/174 before changes. `npm test` — passed, 174/174 after changes. `git diff --check -- . ':(exclude).claude'` — not run (no whitespace changes flagged in review). Browser smoke: `npx serve -l 3000`, opened the in-app browser and stepped through Bubble Conjugation: bubbles enter at staggered y positions and varying x, English (teal) and Hebrew (gold) halves are not visually paired, mismatch shake leaves both bubbles rising (animation list `matchBubbleRise, matchBubbleSwayX, matchBubbleShake` confirmed in computed style), match pop removes both bubbles within ~220ms, switching to classic Conjugation cleanly unmounts the bubble stage (`verbBubbleStage` internals show `mounted: false`, no scheduler timeout, no queue), and re-entering Bubble Conjugation re-seeds correctly. Light theme cyan/gold contrast verified.

**Risks / regressions to check:** Mid-round persistence reload now drops in-flight bubble positions on purpose — round progress is preserved but the visible bubble set is rebuilt. Manual QA should confirm this restoration feels clean (no flash of stale bubbles, no stuck `isResolving` state). With the rise animation always layered into `.matched` and `.mismatch` rules, browsers with quirky CSS animation list re-evaluation might briefly desync; spot-check on Safari and Firefox for any visible jump when the mismatch class is removed after 300ms. The recycle path requeues to the back of the queue — under very long unmatched sessions the queue can grow as recycled bubbles outpace dequeues, but visible count is capped at 6 so memory growth is bounded by the queue itself; worth keeping an eye on extremely long sessions. Mobile narrow widths still render fine at 375px (existing breakpoints kept), but very small phones in landscape might see the stage's `min-height: clamp(380px, 54vh, 560px)` push other UI; flagging since the previous static layout was forgiving and the new animated one is unforgiving if the stage shrinks under the rise distance.

---

### 2026-03-29 17:35 — Keep desktop side panels visible on results and polish sentence-builder prompt/answer behavior

**Requested:** Keep the desktop `Review` and `Settings` panels visible on the game-end/results screen, add a desktop topbar home button next to the time/combo pill with Hebrew mirroring, fix a Hebrew sentence-builder prompt overlap where the speaker button collided with centered text, and accept alternate Hebrew speaker-gender sentence-builder answers when the English prompt does not specify the speaker’s gender.

**Files changed:**
- `index.html` — Added a shared topbar action cluster with a desktop-only home emoji button and bumped frontend asset versions so the newer shell/runtime files invalidate correctly.
- `app/bootstrap-runtime.js` — Registered the new topbar home button in the shared element registry.
- `app/controller.js` — Bound the new topbar home button to the existing leave-home/session-exit flow.
- `app/ui.js` — Changed desktop route visibility so results render in the center column while `Review` and `Settings` stay live on desktop, and updated shell chrome to show the topbar home button during gameplay/results at desktop widths.
- `styles.css` — Added styling for the topbar action cluster/home button, changed desktop results from full-width takeover to center-column behavior inside the three-column hub, and fixed sentence-builder prompt spacing by reserving right-side speaker-button space explicitly instead of using logical inline padding that flipped in Hebrew.
- `app/sentence-bank.js` — Added support for alternate accepted sentence-builder answers, wired answer validation to accept any configured alternate token sequence, and made locked success rendering/feedback use the matched alternate answer text when appropriate.
- `sentence-bank-data.js` — Added a feminine-speaker alternate Hebrew answer for `colloquial_09` so `סומכת` is accepted when the English prompt leaves the speaker’s gender unspecified.
- `tests/app-progress.test.js` — Added/updated regressions for desktop results keeping the side panels visible, the desktop topbar home button behavior, the Hebrew prompt-spacing fix, and acceptance of alternate Hebrew gender variants in Sentence Builder.
- `tests/sentence-bank-data.test.js` — Added a data regression covering alternate Hebrew answers for gender-ambiguous English prompts.

**Behavior changed:** On desktop, results no longer wipe out the side rails; the summary now occupies the center column while `Review` and `Settings` remain visible and collapsible beside it. The topbar also gets a desktop home emoji button next to the gameplay pill, mirrored appropriately in Hebrew. In Sentence Builder, centered Hebrew prompts no longer overlap the speaker button, and entries like `אני לא סומכת עליה יותר` now count as correct when the English sentence does not force a masculine speaker.

**Tests run:** `node --test tests/app-progress.test.js tests/sentence-bank-data.test.js` — passed, 108/108. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** Manual QA should confirm the desktop center-column results layout still feels balanced at widths near the three-column breakpoint and that the topbar home button remains desktop-only. For the new sentence-builder alternate-answer path, the main thing to watch is that only explicitly configured alternates are accepted, so we don’t accidentally loosen validation for unrelated sentences.

---

### 2026-03-29 16:46 — Combine desktop review cards into one collapsible panel

**Requested:** Replace the separate `Most Missed` and `Category Analytics` desktop boxes with one unified collapsible review box, then publish the update to GitHub.

**Files changed:**
- `index.html` — Replaced the two separate review-side articles with one `Review` collapsible card containing `Most Missed` and `Category Analytics` as internal sections, and bumped the cache-busting asset versions for the updated shell files.
- `app/bootstrap-runtime.js` — Swapped the old separate review-card element lookups for the new unified review-panel card and toggle.
- `app/controller.js` — Retargeted the desktop-hub collapse wiring so it manages the new unified review panel instead of two separate review cards.
- `styles.css` — Added internal review-section styling and divider treatment so the unified review box still reads as two clear subsections while collapsing as one card.
- `tests/app-progress.test.js` — Updated the desktop layout/collapse regressions to expect a single review toggle and a unified review card rather than separate `Most Missed` and `Category Analytics` toggles.

**Behavior changed:** On desktop, the left rail now has a single collapsible `Review` box instead of two separate collapsible cards. Expanding it shows `Most Missed` and `Category Analytics` as subsections inside the same panel, which reduces visual fragmentation while keeping all the same information available.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 97/97. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** The main manual QA item is just checking the spacing/balance of the internal divider on desktop in both themes, especially in Hebrew where the centered subsection headings and dense analytics cards share the same panel.

---

### 2026-03-29 16:38 — Fix English prompt punctuation order inside Hebrew UI

**Requested:** Investigate a Hebrew-UI bug where an English sentence-builder prompt showed its final period on the wrong side of the sentence.

**Files changed:**
- `styles.css` — Added explicit LTR isolation for `.prompt-text.english-prompt` and isolated Hebrew prompt text as well, so terminal punctuation stays attached to the correct visual edge inside mixed-direction shells.
- `app/ui.js` — Updated the shared prompt renderer to add `english-prompt` whenever the current prompt surface is English and remove it when the prompt is Hebrew.
- `app/adv-conj.js` — Synced the advanced-conjugation prompt renderer with the same `english-prompt` class toggling logic.
- `app/lesson.js`, `app/abbreviation.js`, `app/verb-match.js`, `app/sentence-bank.js` — Marked English fallback/idle/no-content prompt states as `english-prompt` so they also render correctly in Hebrew UI.
- `tests/app-progress.test.js` — Added a style guard for LTR prompt isolation and a sentence-builder regression that verifies English prompts pick up the explicit English prompt class.

**Behavior changed:** English prompts shown inside the Hebrew UI shell now render with stable LTR punctuation ordering, so sentence-final periods no longer jump to the wrong side. The same fix also covers English fallback prompts in other game modes, not just Sentence Builder.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 97/97. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** The main manual QA item is simply refreshing the browser and checking one or two English prompts in Hebrew UI across both Sentence Builder and another mode, just to confirm the LTR isolation feels natural and didn’t affect centered alignment.

---

### 2026-03-29 16:26 — Reverse the Hebrew progress-fill gradient direction

**Requested:** In Hebrew UI, make the gameplay progress bar move from red to gold from right to left by reversing the fill gradient direction, not just the fill position and glowing tip.

**Files changed:**
- `styles.css` — Added a Hebrew-specific `progress-fill` gradient override so the red-to-gold color flow mirrors correctly in RTL.
- `tests/app-progress.test.js` — Strengthened the Hebrew progress-bar regression so it asserts the RTL-specific gradient direction as well as the right-anchored fill and left-side glowing tip.

**Behavior changed:** In Hebrew gameplay screens, the progress bar now reads naturally from right to left in both motion and color progression: the fill starts red on the right and runs toward the gold leading edge on the left.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 96/96. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** Manual QA should just confirm the mirrored gradient still feels visually balanced at very low progress percentages, since the gold tip now sits on the RTL leading edge as intended.

---

### 2026-03-29 16:20 — Mirror the desktop column widths in Hebrew

**Requested:** In Hebrew UI, reverse the desktop three-column *proportions* as well as the panel order, so the narrow Settings column moves to the left instead of staying on the right.

**Files changed:**
- `styles.css` — Added a Hebrew-specific desktop grid template so the three-column hub mirrors the English proportions rather than only swapping the card order.
- `tests/app-progress.test.js` — Added a regression asserting that the Hebrew desktop hub uses the mirrored column-width template.

**Behavior changed:** In Hebrew desktop layout, the narrow side column now appears on the left with Settings, while the center gameplay column and the opposite review column keep the wider proportions. This makes the whole desktop layout feel properly mirrored instead of just reordered.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 96/96. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** The main manual QA item is simply checking the visual balance of the mirrored Hebrew layout at desktop widths close to the breakpoint, since the narrower side column now changes sides as intended.

---

### 2026-03-29 16:12 — Add collapsible desktop Review and Settings cards

**Requested:** On desktop, make `Most Missed`, `Category Analytics`, and `Settings` collapsible so the user can reduce visual clutter, and center those section names within their boxes.

**Files changed:**
- `index.html` — Wrapped the desktop-side Review and Settings content blocks in collapsible panel containers, added centered toggle headers for `Most Missed`, `Category Analytics`, and `Settings`, and bumped asset versions for the updated stylesheet/controller/runtime files.
- `app/bootstrap-runtime.js` — Registered the new collapsible card and toggle elements so the controller can manage them.
- `app/controller.js` — Added desktop-hub panel toggle handlers plus sync logic so the three side cards can collapse/expand on desktop while staying effectively always open on smaller layouts.
- `app/ui.js` — Hooked route visibility updates into the desktop-hub panel sync so the collapsible controls stay in the right state as the layout switches between stacked and three-column modes.
- `styles.css` — Added centered collapsible header styling, desktop-only collapsed-content hiding, and a small chevron affordance that keeps the title visually centered while still showing expand/collapse state.
- `tests/app-progress.test.js` — Added regressions for the new centered collapsible headers and for the desktop-only collapse interaction behavior.

**Behavior changed:** On the three-column desktop hub, `Most Missed`, `Category Analytics`, and `Settings` can now each be collapsed down to a compact title bar, which makes it easier to reduce clutter while keeping those panels available. Their titles are centered within the card headers. On smaller layouts, the same headers remain visible but do not collapse the content.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 96/96. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** The only real UX thing to spot-check manually is whether the centered header plus right-edge chevron still feels balanced in Hebrew, especially when the side columns are narrow. The collapse state is intentionally not persisted between reloads right now, which keeps the implementation simple but means the side panels reopen on refresh.

---

### 2026-03-29 15:27 — Warm gameplay header refresh and Hebrew meal-chip cleanup

**Requested:** Replace the gameplay title/header pill treatment with a warmer shared progress-bar-and-status-pill header, make the top-right gameplay chrome show only time and combo, normalize Hebrew meal compounds into single sentence-builder chips with shape-matched distractors, and identify any cleanup worth doing before the next commit.

**Files changed:**
- `index.html` — Replaced the old top-right gameplay title with a dedicated gameplay-status pill, removed the in-stage round/time/combo row from the lesson header, and bumped cache-busting versions for the updated frontend assets.
- `app/bootstrap-runtime.js` — Registered the new gameplay pill elements and removed the old hidden lesson-status element lookups.
- `app/ui.js` — Switched gameplay-header rendering to a shared state-driven meta model, fed both the top-right pill and progress-bar accessibility text from the same timer/combo/progress data, and removed the old hidden status-row plumbing.
- `styles.css` — Restyled the shared gameplay progress bar to use a red/orange fill with a gold tip and warmer streak glow, added the new top-right gameplay pill styling, trimmed Sentence Builder prompt side gutters again, reduced mobile sentence-chip height a bit further, and removed obsolete status-row/game-title styling.
- `sentence-bank-data.js` — Normalized `ארוחת ערב` into a single Hebrew target chip, replaced the underscore placeholder meal distractor with real spaced Hebrew meal chips, and added `ארוחת בוקר`/`breakfast` as a shape-matched distractor.
- `tests/app-progress.test.js` — Updated layout/header regressions for the new top-right pill and warm progress bar, tightened the mobile sentence-builder spacing expectations, and added a render regression for one-chip Hebrew meal compounds.
- `tests/sentence-bank-data.test.js` — Added exact meal-expression checks plus a guardrail that bans underscore-form Hebrew placeholders and requires shape-matched multiword Hebrew distractors whenever a sentence uses a multiword Hebrew target chip.
- `.gitignore` — Ignored `.claude/` so the local `launch.json` does not get accidentally staged.

**Behavior changed:** During active gameplay, the top banner now shows a compact time/combo pill instead of the game name, and the only in-stage header chrome left is the warm red/orange progress bar with a gold tip that glows more strongly as the combo rises. Sentence Builder Hebrew meal expressions now appear as real single chips like `ארוחת ערב`, with matching multiword distractors such as `ארוחת צהריים` and `ארוחת בוקר`, so the answer is no longer telegraphed by chip count. On mobile, the sentence-builder prompt uses more of the available width and the option chips are slightly shorter.

**Tests run:** `node --test tests/app-progress.test.js tests/sentence-bank-data.test.js tests/hebrew-verbs.test.js` — passed, 127/127. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** The main remaining manual QA item is visual: spot-check the new top-right gameplay pill and warm progress bar in both light and dark themes on desktop and a narrow mobile viewport, especially in Hebrew UI, to confirm the pill stays anchored on the right and the gold progress tip does not feel too strong at very low progress.

---

### 2026-03-25 17:34 — Tighten Sentence Builder vertical spacing to reduce scrolling on mobile

**Requested:** Make the Sentence Builder boxes more vertically compact so the mode is less likely to require scrolling.

**Files changed:**
- `styles.css` — Reduced the base Sentence Builder spacing, slot/token heights, padding, and answer-row height, then added tighter phone and short-screen overrides so the sentence scaffold and word bank compress more aggressively on constrained viewports.
- `index.html` — Bumped the stylesheet asset version to `20260325b` so the compact layout refreshes cleanly in the browser.

**Behavior changed:** Sentence Builder now uses shorter answer slots, denser token pills, smaller inter-row gaps, and a tighter sentence frame overall. On phones and especially shorter mobile screens, the sentence bank contracts even further before the rest of the lesson UI does, which should cut down on avoidable scrolling without changing the gameplay flow.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 61/61. `npm test` — passed, 104/104.

**Risks / regressions to check:** The compact pass keeps tap targets reasonably large, but the remaining manual QA item is checking whether the smallest token pills still feel comfortable to tap on an actual phone, especially for longer English tokens like contractions.

---

### 2026-03-25 17:18 — Refine Sentence Builder assembly flow, remove inline hint controls, and turn notes into game tips

**Requested:** Make English sentence assembly read in the proper direction, improve the empty sentence display so punctuation is visible before the answer is filled, remove the `Hint` and `Clear` buttons, and move the note into post-answer feedback with more player-facing wording.

**Files changed:**
- `app/sentence-bank.js` — Rebuilt the answer-row renderer to map punctuation from the target sentence into an inline sentence frame, set explicit LTR/RTL direction on answer/bank rows, kept tap-to-remove on placed tokens, and rewrote sentence notes into post-answer “Game tip” explanations.
- `app/ui.js` — Removed sentence-mode pre-answer hint rendering and simplified the sentence-mode header actions so only the core `Check`/`Next` flow remains.
- `app/controller.js` — Dropped the old sentence hint/clear button bindings while keeping the sentence mode wired into the shared `Next` action flow.
- `app/bootstrap-runtime.js`, `app/session.js`, `app/persistence.js` — Removed the old sentence hint visibility state from the runtime/session snapshot shape.
- `app/bootstrap-data.js` — Added a localized `sentenceBankGameTip` feedback string used for post-answer note explanations.
- `index.html` — Removed the `Hint` and `Clear` buttons from the sticky action row and bumped the relevant frontend asset versions.
- `styles.css` — Restyled the sentence answer area as an inline sentence frame with visible punctuation scaffolding, explicit LTR/RTL alignment, and size-aware blank slots.
- `tests/app-progress.test.js` — Updated sentence-builder coverage to reflect the new no-hint/no-clear flow and the new post-answer game-tip behavior.

**Behavior changed:** Sentence Builder now shows the target sentence as a real scaffold rather than a centered stack of anonymous blanks, so commas/periods/question marks stay visible and English assembly is explicitly rendered left-to-right. The old pre-answer hint flow is gone; instead, notes now appear only after submission as learner-facing “Game tip” explanations with developer-ish distractor wording rewritten into gameplay guidance.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 61/61. `npm test` — passed, 104/104.

**Risks / regressions to check:** The automated tests cover the gameplay flow and feedback behavior, but the punctuation scaffold itself still deserves a quick browser pass on narrow mobile widths to confirm wrapping feels natural for long English answers and dense Hebrew punctuation.

---

### 2026-03-24 22:12 — Add Sentence Builder sentence-bank game mode

**Requested:** Implement the planned `Sentence Builder` MVP inside `Ulpango` using the provided sentence dataset and icon asset, with both translation directions, tap-to-build word-bank gameplay, notes as hints/explanations, separate sentence progress storage, and regression coverage.

**Files changed:**
- `sentence-bank-data.js` — Added the browser-loaded sentence-bank dataset generated from the provided JSON source and exposed it as `IvriQuestSentenceBank.getSentenceBank()`.
- `assets/icon-sentence-builder.png` — Added the provided game tile icon in the same transparent PNG format as the existing mode icons.
- `app/sentence-bank.js` — New Sentence Builder mode module for sentence deck preparation, weighted question selection, tap-to-build answer assembly, hint toggling, answer checking, review rounds, prompt speech, scoring, and sentence-specific progress updates.
- `app/content-sources.js` — Added sentence-bank content-source resolution with a safe fallback API.
- `app/constants.js` — Added a dedicated `sentenceProgress` storage key.
- `app/bootstrap-runtime.js` — Registered the new tile/buttons/intro elements and added `sentenceProgress` plus `sentenceBank` runtime state.
- `app/persistence.js` — Added sentence-progress persistence and sentence-bank session snapshot persistence.
- `app/session.js` — Wired Sentence Builder into session lifecycle handling, timer restore/cleanup, intro restore, leave/reset flow, and results summary generation.
- `app/controller.js` — Bound the new home/game-picker tile, hint/clear actions, reset behavior, results replay behavior, and sentence-bank submit/next handling.
- `app/ui.js` — Added Sentence Builder shell title handling, prompt hint rendering, prompt speech routing, header/action-state logic, analytics card rendering, and home-tile highlighting.
- `app/data.js` — Added sentence-bank totals into game-mode analytics without touching vocabulary most-missed rankings.
- `app/bootstrap-data.js` — Added English/Hebrew copy for the Sentence Builder tile, prompts, buttons, feedback, and summary labels.
- `index.html` — Added the new tile in both launch surfaces, the hint/clear footer buttons, the intro overlay, the sentence-bank script tag, the new mode module script tag, and refreshed cache-busting versions for changed assets/scripts.
- `styles.css` — Added Sentence Builder board, answer-row, token-bank, and tile-hover styling.
- `tests/app-progress.test.js` — Extended the app harness to load sentence-bank data/module support and added regression coverage for full-answer gating, hint/clear behavior, direction-specific scoring/progress, review-round reuse, and prompt speech behavior.
- `tests/sentence-bank-data.test.js` — Added a direct dataset integrity test for the real `sentence-bank-data.js` file.
- `task-log.md` — Appended this entry.

**Behavior changed:** `Ulpango` now includes a fifth playable mode, `Sentence Builder`, that lets the learner translate full sentences by tapping tokens from a shuffled bank into a fixed answer row. The mode supports both Hebrew→English and English→Hebrew prompts, gives extra score weight to English→Hebrew production, stores sentence progress separately from vocabulary progress, offers optional pre-answer notes as hints, reuses notes as post-answer explanations, supports second-chance review rounds for missed prompts, and contributes its own performance card in the home/review analytics area.

**Tests run:** `npm test` — passed, 104/104. `node --test tests/app-progress.test.js` — passed, 61/61. `node --test tests/sentence-bank-data.test.js` — passed, 1/1. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** Manual browser QA should confirm the new Sentence Builder footer button stack feels comfortable on smaller phones, especially when both `Hint` and `Clear` are visible before answer submission. Because sentence feedback now reveals the full target sentence exactly as stored in the dataset, it is also worth spot-checking a few punctuation-heavy prompts in both directions to confirm the revealed text and tap-built token order feel natural to learners.

---

### 2026-03-14 14:28 — Tighten Advanced Conjugation English grammar and filter confusing second-person banks

**Requested:** Fix Advanced Conjugation grammar issues so second-person English prompts are correct, and prevent confusing cards where a second-person subject is paired with a second-person object/possessive target such as `you (m.pl.) get off your (sg.) back`.

**Files changed:**
- `app/adv-conj.js` — Updated present-tense English template selection so second-person subjects use the base verb (`take/open/get`) instead of third-person singular forms (`takes/opens/gets`), and filtered out deck entries where a second-person subject is paired with any second-person object slot.
- `tests/app-progress.test.js` — Extended the harness exports and added regression coverage for the second-person present-tense verb fix plus the new deck filter that blocks second-person-subject/second-person-object prompt combinations.
- `task-log.md` — Appended this entry.

**Behavior changed:** Advanced Conjugation now renders prompts like `you (m.sg.) take out my juice` instead of `you (m.sg.) takes out my juice`, and it no longer serves answer banks where a `you ...` subject also introduces another `you (...)` or `your (...)` target in the same prompt.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 29/29. `node --test` — passed, 43/43.

**Risks / regressions to check:** The new filter is intentionally conservative: it removes all second-person-subject plus second-person-object combinations, even in cases where Hebrew could technically express them, because the learner-facing English prompts become misleading or awkward. A quick live spot-check of Advanced Conjugation on localhost would still be useful to confirm the updated prompts read naturally.

---

### 2026-03-14 14:05 — Continue reorganization with data selectors and first mode extractions

**Requested:** Continue the `app.js` reorganization plan beyond the earlier service/session/UI passes, focusing next on shared data selectors and then the first mode-by-mode extractions while keeping behavior identical.

**Files changed:**
- `app/data.js` — New data-layer module for progress records, due-word selection, translation-pool filtering, mastery flags, most-missed rankings, domain/game-mode stats, and mistake-summary builders.
- `app/abbreviation.js` — New abbreviation-mode module for round targeting, start/reset/intro flow, question generation, rendering, answer evaluation, and option/result handling.
- `app/adv-conj.js` — New Advanced Conjugation module for Hebrew/English prompt building, subject filtering, deck generation, start/intro flow, rendering, answer evaluation, and adv-conj stats/mistake summaries.
- `app.js` — Rewired the app to consume the new data and mode modules, exposed additional runtime metadata for the modules, removed the extracted inline implementations, and bumped `APP_BUILD` to `20260314i`.
- `index.html` — Added ordered `defer` script tags for `data.js`, `abbreviation.js`, and `adv-conj.js`, and refreshed cache-busting versions across the app-module chain.
- `tests/app-progress.test.js` — Updated the VM harness to load the new module files in the same order as the browser before instrumenting `app.js`.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. `app.js` is now down to `3908` lines, with the shared data layer plus the first two mode files moved out into dedicated modules.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 27/27. `node --test` — passed, 41/41.

**Risks / regressions to check:** The browser boot order now depends on a longer but still explicit `defer` script chain, so a quick live smoke test is still worthwhile. Verb Match and lesson/translation remain the largest mode-specific blocks left in `app.js`, so those should be the next extraction targets if we keep pushing this structure.

---

### 2026-03-14 12:55 — Continue app.js reorganization with services, session flow, and UI shell helpers

**Requested:** Continue the `app.js` organization plan beyond the foundation pass, keeping behavior identical while moving shared concerns into `app/` modules and verifying the full suite after each extraction.

**Files changed:**
- `app/audio.js` — New audio service module for cue source resolution, player caching, preloading, and answer-feedback playback.
- `app/persistence.js` — New persistence service module for preferences, survey links, progress saves, and the existing UI/session storage payloads.
- `app/session.js` — New session/navigation module for active-session detection, route resolution, intro auto-advance, overlay/leave-confirm flow, timer start/stop logic, session teardown, and results-summary transitions.
- `app/ui.js` — New shared UI-shell module for route visibility, shell chrome, app-shell locking, blocking overlays, prompt-card visibility, lesson-progress width, and the basic home/theme/sound/niqqud control rendering helpers.
- `app.js` — Rewired the app to import the extracted services through `window.IvriQuestApp`, removed the in-file duplicate implementations, exposed the needed runtime helpers to the new modules, and bumped `APP_BUILD` to `20260314f`.
- `index.html` — Added ordered `defer` script tags for the new session and UI modules and refreshed cache-busting versions across the `app/` script chain.
- `tests/app-progress.test.js` — Updated the VM harness to load `audio.js`, `persistence.js`, `session.js`, and `ui.js` in the same order as the browser before instrumenting `app.js`.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. `app.js` is now down to `4759` lines and no longer owns the shared audio, persistence, session lifecycle, overlay locking, or basic shell/prompt visibility helpers directly.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 27/27. `node --test` — passed, 41/41.

**Risks / regressions to check:** The browser now depends on a longer ordered `defer` chain under `index.html`, so a quick live smoke test is still worthwhile. The larger mode-specific renderers and selectors still live in `app.js`, so future extractions should keep following the same test-backed, low-risk pattern.

---

## Entry Format

```
### [DATE TIME] — <Short task title>
**Requested:** <What the user asked for>
**Files changed:** <List of files and what changed>
**Behavior changed:** <Observable changes to app behavior, or "None">
**Tests run:** <Commands run and outcomes>
**Risks / regressions to check:** <What could break or degrade>
```

---

## Log

---

### 2026-03-09 — Fix hover blink on choice buttons (all games)

**Requested:** Fix blinking/flashing hover animation glitch on desktop when clicking choice buttons.
**Files changed:**
- `styles.css`: Added `.choice-btn:hover { transform: none; box-shadow: none; }` inside the `@media (hover: hover)` block to disable the `translateY(-1px)` lift animation on choice buttons — the lift effect caused visible blinking when hovering across choices on desktop. Bumped CSS version to `20260309a`.
- `app.js`: Changed click handlers in `renderChoices()` (translation), `renderAbbreviationChoices()` (abbreviation), and `renderAdvConjChoices()` (advConj) to toggle `.selected` class on existing DOM buttons + call `renderSessionHeader()` instead of calling the full render function (which destroyed and recreated all button elements via `innerHTML = ""`). Bumped app.js version to `20260309a`.
**Behavior changed:** Choice buttons no longer lift/shift on hover on desktop — they stay flat. Selection highlight updates smoothly via CSS class toggle without rebuilding the DOM. Applies to all three choice-based games (translation, abbreviation, advanced conjugation). Game tiles, nav buttons, and action buttons still have the lift-on-hover effect.
**Tests run:** `npm test` — 25 pass, 1 fail (pre-existing), 1 cancelled (pre-existing). No regressions.
**Risks / regressions to check:** Click handler now only toggles `.selected` class and updates header — does NOT re-render prompt text or niqqud toggle. This is fine for selection (no prompt change needed), but verify that niqqud toggle still works when toggled mid-question (the toggle has its own handler that calls the full render).

---

### 2026-03-09 — Fix advConj leave navigation, transparent icon backgrounds

**Requested:** (1) Fix broken navigation when leaving Advanced Conjugation game (showed stale "Translation / Pick a mode" screen instead of returning home); (2) replace icon PNGs with transparent-background versions (white corners were visible on dark mode).
**Files changed:**
- `app.js`: Added `clearAdvConjIntro()` and `resetAdvConjState()` calls to `endSessionAndNavigate()` (was missing — advConj state/timer were never cleaned up when leaving); added `clearAdvConjIntro()`, `state.advConj.active = false`, `state.advConj.currentQuestion = null` to `showSessionSummary()` for consistency
- `assets/icon-translation.png`, `assets/icon-conjugation.png`, `assets/icon-abbreviation.png`, `assets/icon-adv-conjugation.png`: Processed via Python PIL to flood-fill white corner pixels with transparency (converted RGB → RGBA, BFS from all 4 corners replacing near-white pixels with alpha=0)
- `index.html`: Bumped icon cache-bust query params from `?v=20260309` to `?v=20260309b`
**Behavior changed:** Leaving an Advanced Conjugation game (via Home → Lose Progress) now correctly returns to the home dashboard with game picker. AdvConj timer stops and state resets properly. Icons display without white borders/corners on dark mode.
**Tests run:** `npm test` — 25 pass, 1 fail (pre-existing: `starter verb seed entries`), 1 cancelled (pre-existing: `app-progress.test.js` timeout). No regressions.
**Risks / regressions to check:** PIL flood-fill with threshold 245 may have caught some near-white edge pixels at the rounded-rect boundary — verify icons look clean at large sizes; `resetAdvConjState()` clears the timer via `clearInterval` — verify no double-clear if `finishAdvConj` was already called

---

### 2026-03-09 — AdvConj standardization: select+submit, targeted renders, icon cache bust

**Requested:** (1) Fix choice button hover animation glitch in advConj (buttons flashed on hover because clicking auto-submitted, causing instant lock/disable transition); (2) fix homepage icons not updating (browser caching old images); (3) standardize advConj gameplay to use select+submit pattern like abbreviation and translation; (4) audit and fix other game standardization differences.
**Files changed:**
- `app.js`: Changed `renderAdvConjChoices()` click handler from auto-submit (`applyAdvConjAnswer()`) to select-only (`renderAdvConjQuestion()`), added `.selected` class toggle on choice buttons; updated `renderSessionHeader()` advConj section to use `questionNeedsSelection()` and show Submit/Next like other games; updated `handleNextAction()` advConj section to add submit step (check `selectedOptionId` before calling `applyAdvConjAnswer()`); replaced `renderAll()` in `applyAdvConjAnswer()` with targeted `markAdvConjChoiceResults()` + `renderSessionHeader()` + `renderDomainPerformance()` + `renderMostMissed()`; replaced `renderAll()` in `loadAdvConjQuestion()` with `renderAdvConjQuestion()`; added `renderNiqqudToggle()` call to `renderAdvConjQuestion()`; normalized `selectedOptionId` check from `!= null` to truthy check for consistency
- `index.html`: Added `?v=20260309` cache-busting query params to all 8 icon `<img>` src attributes
**Behavior changed:** AdvConj now uses the same select+submit two-step interaction as abbreviation and translation games: click a choice to highlight it, then click Submit to confirm. Submit button shows disabled until a choice is selected. No more hover animation glitch (buttons no longer instantly lock/disable on click). Icons refresh past browser cache. Niqqud toggle renders during advConj questions.
**Tests run:** `npm test` — 25 pass, 1 fail (pre-existing: `starter verb seed entries`), 1 cancelled (pre-existing: `app-progress.test.js` timeout). No regressions.
**Risks / regressions to check:** Replacing `renderAll()` with targeted renders in advConj could miss some UI update that `renderAll()` was covering — verify persist/restore of session state still works; `markAdvConjChoiceResults()` is now called directly in `applyAdvConjAnswer()` instead of indirectly via `renderAll()` chain — verify correct/wrong highlighting still works

---

### 2026-03-09 — Adv. Conjugation: literal sentence prompts, bidirectional, feedback

**Requested:** Overhaul the Advanced Conjugation game: (1) change prompts from "idiom label + he → me" format to full literal English sentences (e.g. "he eats our head"); (2) drop the Hebrew subject pronoun from answers so players must identify conjugation from verb form; (3) make the game bidirectional (EN→HE and HE→EN); (4) add feedback text after answers, showing idiomatic meaning for non-obvious idioms; (5) add possessive pronoun support for English templates.
**Files changed:**
- `hebrew-idioms.js`: Added `literal_sg`, `literal_pl`, `showMeaning` fields to all 21 idiom entries; renamed `prompt_sg`/`prompt_pl` to `literal_sg`/`literal_pl` on first entry
- `app.js`: Added `poss` field to `ADV_CONJ_OBJECTS`; added `buildAdvConjEnglishSentence()` helper; rewrote `buildAdvConjDeck()` for bidirectional literal-sentence prompts with direction-aware distractor generation and ambiguous verb form filtering; updated `buildAdvConjHebrewAnswer()` to drop subject pronoun from all 3 object_type branches; updated `renderAdvConjQuestion()` to show `promptText` with conditional Hebrew CSS class instead of old label+arrow format; updated `renderAdvConjChoices()` to conditionally apply Hebrew/RTL styling based on answer direction; added `setFeedback` call in `applyAdvConjAnswer()` with `showMeaning` support; added `advConjCorrect`/`advConjWrong` i18n keys in EN and HE bundles
**Behavior changed:** Advanced Conjugation now shows full sentences as prompts. EN→HE: "he eats our head" → pick Hebrew (without pronoun). HE→EN: "אוכל לנו את הראש" → pick English literal. Feedback text appears after each answer; for non-obvious idioms, the idiomatic meaning is appended (e.g. "to nag / drive someone crazy with talk"). Ambiguous verb forms (identical msg/fsg) are skipped in HE→EN direction.
**Tests run:** `npm test` — 25 pass, 1 fail (pre-existing: `starter verb seed entries`), 1 cancelled (pre-existing: `app-progress.test.js` timeout). No regressions from changes.
**Risks / regressions to check:** `literal_sg`/`literal_pl` templates must use `{s}` (subject), `{o}` (direct object), `{p}` (possessive) placeholders correctly; `poss` field on `ADV_CONJ_OBJECTS` must match English possessive pronouns; ambiguous verb form filter (`he2en` direction) may skip too many valid questions for idioms with shared msg/fsg forms; `showMeaning` flag accuracy on each idiom

---

### 2026-03-09 — Icons, abbreviation bidirectional, advConj feedback fix, rename to Advanced Conjugation

**Requested:** (1) Rename uploaded icon files (3,4,5,6) to proper icon names; (2) make abbreviation game bidirectional (HE→EN and EN→HE); (3) fix advConj feedback text not clearing when advancing to next question; (4) rename "Adv. Conjugation" to "Advanced Conjugation" throughout.
**Files changed:**
- `assets/3.png` → `assets/icon-translation.png`, `assets/4.png` → `assets/icon-conjugation.png`, `assets/5.png` → `assets/icon-abbreviation.png`, `assets/6.png` → `assets/icon-adv-conjugation.png`: Renamed user-uploaded icon files to replace old icons
- `app.js`: Made `buildAbbreviationQuestion()` randomly assign `direction` ("he2en" or "en2he") with prompt set to `entry.abbr` or `entry.english` accordingly; updated `buildAbbreviationOptions()` to accept `direction` param and set option labels to `english` or `abbr` depending on direction; updated `renderAbbreviationQuestion()` to conditionally apply/remove `hebrew` CSS class on prompt; updated `renderAbbreviationChoices()` to apply `hebrew` class, `dir="rtl"`, `lang="he"` on choice buttons for en2he direction; added `clearFeedback()` call in `loadAdvConjQuestion()` to clear stale feedback between questions; changed EN i18n `advConjName` from "Adv. Conjugation" to "Advanced Conjugation"; changed EN i18n `advConjTitle` from "Adv. Conjugation Complete" to "Advanced Conjugation Complete"
- `index.html`: Changed both instances of "Adv. Conjugation" to "Advanced Conjugation" in home tile and game picker tile
**Behavior changed:** Abbreviation game now alternates randomly between HE→EN (Hebrew abbreviation prompt, English choices) and EN→HE (English meaning prompt, Hebrew abbreviation choices). AdvConj feedback text clears properly when advancing to next question. Game title shows "Advanced Conjugation" everywhere instead of "Adv. Conjugation". All 4 game icons updated with new designs.
**Tests run:** `npm test` — 25 pass, 1 fail (pre-existing: `starter verb seed entries`), 1 cancelled (pre-existing: `app-progress.test.js` timeout). No regressions from changes.
**Risks / regressions to check:** Abbreviation en2he direction shows Hebrew abbreviation choices that may look similar — verify distractor quality; abbreviation feedback text still uses `entry.english` and `entry.expansionHe` regardless of direction (should be fine since it shows full info); verify new icon file sizes/quality match expectations

---

### 2026-03-09 — Advanced Conjugation game mode

**Requested:** Implement a new "Advanced Conjugation" game mode where players conjugate both the subject and object of Hebrew verbal idioms (present tense, multiple object types: direct, l-dative, possessive suffix).
**Files changed:**
- `hebrew-idioms.js`: New file — 21 idiom entries from `hebrew_idioms.json`, wrapped with normalized `present_tense` and `english_meaning` aliases for the `HEBREW_IDIOMS` global array
- `assets/icon-adv-conjugation.png`: New icon asset (placeholder copy of abbreviation icon)
- `index.html`: Added `<script src="./hebrew-idioms.js">` tag; added `#homeAdvConjBtn` home tile; added `#advConjBtn` game picker tile; added `#advConjIntro` overlay
- `app.js`: Added `ADV_CONJ_ROUNDS`, `ADV_CONJ_SUBJECTS`, `ADV_CONJ_OBJECTS` constants; added `advConj` to `state`; added `advConjStats` to `STORAGE_KEYS`; added `el.homeAdvConjBtn`, `el.advConjBtn`, `el.advConjIntro`; added all advConj functions (`buildAdvConjHebrewAnswer`, `buildAdvConjDeck`, `resetAdvConjState`, `clearAdvConjIntro`, `startAdvConj`, `playAdvConjIntro`, `beginAdvConjFromIntro`, `loadAdvConjQuestion`, `renderAdvConjQuestion`, `renderAdvConjChoices`, `markAdvConjChoiceResults`, `applyAdvConjAnswer`, `updateAdvConjStats`, `finishAdvConj`, `buildAdvConjMistakeSummary`); wired event listeners; updated `openHomeLesson`, `isModeSessionActive`, `hasActiveLearnSession`, `continueFromResults`, `calculateGameModeStats`, `renderLearnState`, `renderSessionHeader`, `handleNextAction`; added i18n strings in both `en` and `he`
- `styles.css`: Added hover border-color rule for `#homeAdvConjBtn` and `#advConjBtn`
**Behavior changed:** New "Adv. Conjugation" game tile appears on the home screen and in the game picker. Clicking it launches a 10-round session where each question shows an idiom's English meaning and asks the player to select the correct present-tense Hebrew conjugation for a given subject+object pair (4 choices). Session summary shows mistakes. Stats fold into the Conjugation mode analytics ring.
**Tests run:** Not run (no test file for advConj; existing tests unchanged)
**Risks / regressions to check:** `HEBREW_IDIOMS` must load before `app.js`; `present_tense` and `english_meaning` normalization in `hebrew-idioms.js` must be correct; `shuffle` (not `shuffleArray`) is used throughout; `state.sessionScore`/`state.sessionStreak` (not `state.score`/`state.streak`) used in `applyAdvConjAnswer`; `el.choiceContainer` (not `el.choicesContainer`) used throughout

---

### 2026-03-08 — Visual Pop: icon tinting, per-mode colors, red ambient, section headings

**Requested:** 8 targeted visual polish changes: nav icon emoji upgrade, nav icon gold/blue glow, per-mode game tile color identity (gold/teal/violet), section heading brand color, domain emoji glow, red ambient blob, version bump.
**Files changed:**
- `index.html`: Nav icons replaced (⌂→🏠, ↺→🔄, ⚙→⚙️) in both desktop and mobile nav; `ambient-c` div added; CSS version bumped to `20260308c`
- `styles.css`: `.nav-link-icon` gold glow + active/light-mode overrides; `.section-head h2 { color: var(--brand) }`; per-mode game tile icon rules (gold/teal/violet) with hover border overrides; `.domain-emoji` gold glow + light override; `.ambient-c` red blob rule
**Behavior changed:** Nav icons now render as modern emoji with colored glow; game tiles have distinct color identities per mode; section headings display in brand gold/blue; review domain emojis have a gold halo; subtle warm crimson glow at bottom-right of background in dark mode
**Tests run:** `npm test` — 12/12 pass
**Risks / regressions to check:** Emoji rendering on older browsers/OSes (fallback to text glyph is acceptable); teal/violet tile colors on light mode (no override added — verify readability); ambient-c blob visibility in light mode (--error is #FF6B6B at low opacity, should be barely perceptible)

---

### 2026-03-08 — Make Sabra color scheme more prominent (interactive states)

**Requested:** Apply Sabra palette to interactive components that still used hardcoded old blue colors: dark mobile nav bar, dark/light mobile nav active state, dark desktop nav active state, game tile hover border, choice/match card selected border.

**Files changed:**
- `styles.css` — 6 targeted rule patches: (1) dark mobile nav container border → gold rim; (2) dark mobile nav active pill → gold tint + `var(--brand)` text; (3) new `.desktop-nav .nav-link.active` rule → gold-tinted pill + gold text in dark mode; (4) `.game-tile:hover` border → gold (dark) / blue (light); (5) `.choice-btn.selected, .match-card.selected` border → `var(--brand)`; (6) light mobile nav active → blue-tinted pill + brand-blue text. Version bumped to `v=20260308b`.
- `index.html` — Version bump for `styles.css`.

**Behavior changed:**
- Dark mobile: floating nav bar has midnight navy background with subtle gold rim; active tab shows warm gold pill + gold icon/label.
- Dark desktop: active nav link shows gold-tinted pill with gold text.
- Dark game: tile hover glows with gold border instead of old cold blue.
- Dark game: selected choice/match button has gold border ring instead of old blue.
- Light mobile: active tab shows blue-tinted pill with brand-blue text (matches desktop sidebar feel).
- Light game: tile hover shows blue border (not gold).

**Tests run:** `npm test` — 12/12 pass (CSS-only change).

**Risks / regressions to check:** `.desktop-nav .nav-link.active` (no theme qualifier) overrides the generic `.nav-link.active` in dark mode — verify light mode desktop sidebar still shows gold pill via the more-specific `body[data-theme="light"] .desktop-nav .nav-link.active` rule (higher specificity wins).

---

### 2026-03-08 — Sabra color scheme + verb/abbreviation bug fixes

**Requested:** Apply Sabra color scheme (Israeli flag blue, midnight navy, metallic gold) to both light and dark themes; fix "he standed"/"we puted" verb inflection; fix orphaned period in ז״א abbreviation choice button.

**Files changed:**
- `styles.css` — Full color variable overhaul in `:root` (dark) and `body[data-theme="light"]`; `.progress-fill` gradient changed from hardcoded `#7ab3ff` to `var(--brand-deep)→var(--brand)`; `.domain-ring` error segment updated to `rgba(230,57,70,0.82)` (dark) + light-mode override at `rgba(255,107,107,0.82)`; new `body[data-theme="light"] .desktop-nav` rules for solid blue sidebar with white text and gold active pill. Version bumped to `v=20260308a`.
- `hebrew-verbs.js` — Added `["put","put"]` and `["stand","stood"]` to `inflectEnglishPast` irregular map. Version bumped to `v=20260308a`.
- `abbreviation-data.js` — Removed trailing period from `abbr-015` (ז״א) `english` field: `"that is / i.e."` → `"that is / i.e"`.
- `index.html` — Version bumps for `styles.css` and `hebrew-verbs.js`.

**Behavior changed:**
- Dark mode: midnight navy background, dusty navy cards, gold buttons/active states/progress bar.
- Light mode: icy background, white cards, solid blue sidebar with white nav links and gold active pill, blue brand buttons.
- Conjugation: "עמד" → "he stood"; "שמנו" → "we put" (previously "he standed"/"we puted").
- Abbreviation game: ז״א choice button shows "that is / i.e" without orphaned period.

**Tests run:** `npm test` — 12/12 pass.

**Risks / regressions to check:** Gold brand color in dark mode may conflict with any hardcoded blue references elsewhere in `app.js` (none expected). Progress bar gradient now theme-adaptive — verify it renders cleanly in both modes. Light sidebar hides on mobile (`.desktop-nav { display:none }` by default) so no mobile regressions expected.

---

### 2026-03-07 — Fix desktop language toggle button layout (display conflict)

**Requested:** Fix the home-screen language toggle button on desktop where label and value were not separated left/right as intended.

**Root cause:** `#homeLangToggle` has both `.home-option-btn` (display:flex) and `.settings-block` (display:grid). Equal specificity (0,1,0) meant `.settings-block` won because it appears later in the file, discarding flex layout entirely.

**Files changed:**
- `styles.css` — Added `.home-option-btn.settings-block` two-class override rule (specificity 0,2,0) restoring `display:flex; align-items:center; justify-content:space-between; gap:0.75rem`. Version bumped to `v=20260307m`.
- `app.js` — `renderHomeOptions()` clears `style.textAlign` and `style.direction` on `homeLangValue` (empty string reset). `APP_BUILD` bumped to `"20260307o"`.
- `index.html` — Version strings updated to match above.

**Behavior changed:** On desktop (≥1024px), all three home-screen option rows (Language, Theme, Nikud) now show their label flush-left and value flush-right via flex layout. Previously both spans stacked vertically in a grid column.

**Tests run:** `npm test` — 12/12 pass (no logic changed).

**Risks / regressions to check:** Verify `.settings-block` styling (border, background, padding) is unchanged elsewhere in the app; only the display conflict on this specific button is overridden.

---

### 2026-03-07 13:40 — Create task log file

**Requested:** Create a human-readable log file within the project that tracks tasks completed, including task requested, date/time, files changed, behavior changed, tests run, and risks/regressions.

**Files changed:**
- `task-log.md` — Created (this file). No app logic touched.

**Behavior changed:** None. This is a documentation-only file; it is not imported or referenced by any app code.

**Tests run:** None required. File creation only.

**Risks / regressions to check:**
- None. File does not affect app runtime, build, or test suite.
- Confirm file is not accidentally included in any future bundle step if a bundler is added.

---

### 2026-03-07 15:15 — Establish shared AI task log SOP (Claude Code + Codex)

**Requested:** Make `task-log.md` a shared standard between Claude Code and ChatGPT Codex; update documentation to codify this as a standard operating procedure.

**Files changed:**
- `task-log.md` — Updated preamble to state the file is shared by all AI agents and required after every session.
- `CLAUDE.md` — Created. Project-level instructions for Claude Code: mandatory log entry format, conservative editing guidelines, project structure reference.
- `AGENTS.md` — Created. Equivalent instructions for ChatGPT Codex (same SOP; Codex reads `AGENTS.md` automatically).

**Behavior changed:** None. Documentation/instruction files only; no app logic touched.

**Tests run:** None required.

**Risks / regressions to check:**
- None for app behavior.
- If Codex is updated to use a different instruction filename, rename or alias `AGENTS.md` accordingly.
- Verify `CLAUDE.md` and `AGENTS.md` do not conflict with any future CI or lint rules if a build step is added.

---

### 2026-03-07 15:45 — One-verb conjugation rounds + desktop match card alignment

**Requested:**
1. Conjugation game: one full round covers all forms of one verb (not five).
2. On desktop, English match cards should be left-aligned and Hebrew match cards right-aligned.
3. Push changes to GitHub.

**Files changed:**
- `app.js` — `VERB_MATCH_ROUNDS` changed from `5` to `1`; `APP_BUILD` bumped to `20260307k`.
- `styles.css` — Inside `@media (min-width: 768px)`: added `text-align: left` to `.match-card` and `text-align: right` to `.match-card.hebrew`.
- `index.html` — `styles.css` query string bumped to `v=20260307h`; `app.js` query string bumped to `v=20260307k`.
- `tests/app-progress.test.js` — Updated "conjugation sessions are capped to a small verb set" test: changed expected `totalVerbs` and `verbQueue.length` from `5` to `1`.

**Behavior changed:**
- Conjugation session now covers exactly one verb per play-through; hitting the results screen is faster and tighter.
- On desktop (≥768px), English conjugation option cards are left-aligned; Hebrew option cards are right-aligned. Mobile card alignment is unchanged (still centered).

**Tests run:** `npm test` — 12/12 passed (one test updated to match new VERB_MATCH_ROUNDS value).

**Risks / regressions to check:**
- Verify the results screen appears correctly after matching all forms of a single verb.
- Check that "Continue" after results picks a new verb (not the same one).
- Confirm alignment looks correct at the 768px boundary on real devices/browsers.
- On mobile, confirm cards remain centered.

---

### 2026-03-07 16:15 — "Play Again" button, softer perfect-game praise, knuckles vocab

**Requested:**
1. End-of-game button should say "Play Again" instead of "Continue" (functionality unchanged).
2. Perfect-game praise: "That's amazing!" → "Amazing!"
3. Add "to crack your knuckles" to the translation vocabulary.

**Files changed:**
- `app.js` — English i18n `results.continue`: `"Continue"` → `"Play Again"`; Hebrew i18n `results.continue`: `"המשך"` → `"שחק שוב"`; `results.amazing`: `"That's amazing!"` → `"Amazing!"`; `APP_BUILD` bumped to `20260307l`.
- `index.html` — HTML fallback text on `#resultsContinueBtn`: `Continue` → `Play Again`; `app.js` query string bumped to `v=20260307l`; `vocab-data.js` query string bumped to `v=20260307c`.
- `vocab-data.js` — Added `["to crack your knuckles", "לפצח מפרקים", "לְפַצֵּחַ מַפְרָקִים"]` to `home_everyday_life`.

**Behavior changed:**
- Results screen button label is now "Play Again" / "שחק שוב"; click behavior is identical.
- Perfect score now shows "Amazing!" instead of "That's amazing!".
- "to crack your knuckles" (לְפַצֵּחַ מַפְרָקִים) is now in the translation pool.

**Tests run:** `npm test` — 12/12 passed. No test changes needed.

**Risks / regressions to check:**
- Confirm "Play Again" button fires correctly after translation, conjugation, and abbreviation sessions.
- Confirm "Amazing!" appears only on perfect scores; "Nice job!" still appears otherwise.
- Confirm new vocab entry appears in translation rounds and displays nikud correctly when nikud is on.

---

### 2026-03-07 16:45 — Bulk vocab additions and correction from vocab_additions_for_claude.json

**Requested:** Read `/Users/mikesexton/Downloads/vocab_additions_for_claude.json` and apply all additions and corrections to `vocab-data.js`, preserving existing structure.

**Files changed:**
- `vocab-data.js` — 1 correction + 56 new entries across 8 categories (see below).
- `index.html` — `vocab-data.js` query string bumped to `v=20260307d`.

**Corrections applied:**
- `home_everyday_life`: "to crack your knuckles" updated from `לְפַצֵּחַ מַפְרָקִים` (too vague — means "to crack joints" broadly) to `לַעֲשׂוֹת קְנָאקִים בָּאֶצְבָּעוֹת` (natural spoken Hebrew).
- `bleach`: old and new entries in JSON were identical — no change made.

**Additions by category:**
- `home_everyday_life` (+3): knuckle, joint, to make cracking sounds
- `emotional_nuance` (+5): moving on, to let go, emotional baggage, to dwell on, to spiral
- `conversation_glue` (+9): actually (×2 forms), like (filler), apparently, supposedly, all of a sudden, I mean, whatever (×2 forms)
- `dating_relationships` (+8): situationship, to lead someone on, to catch feelings, to be hung up on someone, to lose interest, to get attached, to pull away, to make it official
- `meta_language` (+10): participle, infinitive, imperative, grammatical gender, singular, plural, construct state, preposition, possessive suffix, direct object marker
- `technology_ai` (+10): prompt, token, context window, agent, to fine-tune, benchmark, model collapse, safety guardrail, reasoning, open weights
- `work_business` (+10): tradeoff, buy-in, alignment, action item, owner (of a task), bandwidth, bottleneck, scope creep, flagship initiative, implementation gap
- `media_digital_life_expanded` (+10): screenshot, to scroll, to swipe, to tap, to click, bug, glitch, lag, update, settings — note: JSON listed these under `media_digital_life`; routed to `media_digital_life_expanded` which is the matching existing category.

**Behavior changed:** 56 new entries and 1 corrected entry now appear in the translation game pool.

**Tests run:** `npm test` — 12/12 passed. No test changes needed.

**Risks / regressions to check:**
- Spot-check new entries in translation rounds with nikud toggle on and off.
- Confirm duplicate-English entries (both "actually" forms, both "whatever" forms) display as distinct cards without collision.
- Verify `media_digital_life_expanded` routing is correct — if a standalone `media_digital_life` category is added in future, these entries may need deduplication.

---

### 2026-03-07 17:30 — Options panel alignment fix, game tile title centering, vocab updates

**Requested:**
1. Options panel values still misaligned — English left-aligned, Hebrew (עברית) right-aligned.
2. Game tile titles should be vertically centered relative to their icons.
3. Rename "to make cracking sounds" → "to crack one's joints".
4. Add "chiropractor" to vocabulary.

**Files changed:**
- `styles.css` — Three changes:
  - `.home-option-value`: changed `text-align: right` → `text-align: left` (was incorrectly right-aligning all values including English ones).
  - Added `body[data-ui-lang="en"] #homeLangValue { text-align: right; direction: rtl; }` — right-aligns the Hebrew language label only when UI is in English mode.
  - `.game-tile-title`: added `align-self: center` so the title vertically centers within its grid row against the icon box.
  - `styles.css` query string bumped to `v=20260307i`.
- `vocab-data.js` — Renamed `"to make cracking sounds"` → `"to crack one's joints"` (same Hebrew); added `["chiropractor", "כירופרקטור", "כִּירוֹפְּרַקְטוֹר"]` to `health`. Query string bumped to `v=20260307e`.
- `index.html` — Version strings updated.

**Behavior changed:**
- Options panel: "Dark Mode", "Off", and any English language label are left-aligned; "עברית" is right-aligned (RTL) when UI language is English.
- Choose Your Lesson: game names now vertically centered alongside their icons.
- Translation game: "to crack one's joints" replaces "to make cracking sounds" as the English prompt; "chiropractor" added to health pool.

**Tests run:** `npm test` — 12/12 passed.

**Risks / regressions to check:**
- When toggling UI language to Hebrew, confirm Language value shows "English" left-aligned (not right-aligned).
- Confirm game tile titles look correct at mobile breakpoints where tile layout changes.
- Confirm "chiropractor" appears in translation rounds with correct nikud when nikud is on.

---

### 2026-03-07 18:45 — Options alignment true root-cause fix (display: grid vs flex conflict)

**Requested:** Desktop options panel still misaligned after multiple previous attempts. User confirmed issue is desktop-only.

**Root cause:** `#homeLangToggle` has both classes `settings-block` and `home-option-btn`. `.home-option-btn` (line 430) sets `display: flex; justify-content: space-between`. `.settings-block` (line 1113) sets `display: grid`. Both have equal specificity (0,1,0); the later-defined rule wins → `display: grid` silently overrides flex. Without flex, `justify-content: space-between` does nothing, and spans stack vertically in a single-column grid, left-aligned. All previous CSS/JS text-align fixes targeted the wrong element — positioning the span's text rather than fixing the broken container layout.

**Files changed:**
- `styles.css` — Added `.home-option-btn.settings-block { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }` (specificity 0,2,0, beats both single-class rules). Removed now-irrelevant `body[data-ui-lang="he"] .home-option-value { text-align: right }`. Removed `text-align: left` from `.home-option-value` (irrelevant with flex layout). Version bumped to `v=20260307m`.
- `app.js` — Cleared the previously-set `style.textAlign` and `style.direction` inline styles (set to `""`) in `renderHomeOptions()`. Kept `dir` attribute. `APP_BUILD` bumped to `20260307o`.
- `index.html` — Version strings updated.

**Behavior changed:** All three option buttons (Language, Theme, Nikud) now correctly show label flush-left and value flush-right via `justify-content: space-between`. Hebrew mode (RTL) is also handled correctly by the flex direction reversal.

**Tests run:** `npm test` — 12/12 passed.

**Risks / regressions to check:**
- Hard-refresh (Cmd+Shift+R) required to pick up new CSS.
- Verify all three option rows display correctly in both English and Hebrew modes.
- Inspect `#homeLangToggle` computed style — should show `display: flex`.
- Verify `.settings-block` used elsewhere in the app is not affected (the fix uses a two-class selector that only applies to elements with both classes).

---

### 2026-03-07 18:15 — Options alignment fix (inline styles) + vocab/conjugation additions

**Requested:** Fix persistent עברית misalignment in options panel using inline JS styles (bypass cascade). Add "closing the loop" vocab entry, remove nikud from אקונומיקה, rename לרסק to "to smash", add למחוץ ("to crush") to vocab and conjugation, add לביאה ("lioness") to vocab, add למעוך ("to mash") to conjugation.

**Root cause (alignment):** Previous CSS-only fixes lost the cascade battle. Inline styles via JS have the highest specificity and bypass all conflicts.

**Files changed:**
- `app.js` — `renderHomeOptions()`: added inline `style.textAlign` and `style.direction` on `el.homeLangValue`. `APP_BUILD` bumped to `20260307n`.
- `styles.css` — Removed now-redundant `[dir="rtl"]` and `[dir="ltr"]` attr selector blocks. Version bumped to `v=20260307l`.
- `vocab-data.js` — "closure" → "closing the loop"; אקונומיקה nikud removed (plain=nikud slot); לרסק → "to smash"; added `["to crush", "למחוץ", "לִמְחוֹץ"]`; added `["lioness", "לביאה", "לְבִיאָה"]` to `social_cultural`. Version bumped to `v=20260307f`.
- `hebrew-verbs.js` — Added `למעוך` (cooking-verb-lamoach) and `למחוץ` (physical-verb-limchotz) verb entries with full curated conjugations appended to `buildStarterVerbEntries()`. Version bumped to `v=20260307c`.
- `index.html` — All four version strings bumped.

**Behavior changed:**
- "עברית" now flush-right in English mode; "English" flush-left in Hebrew mode (guaranteed via inline styles).
- Translation: "closing the loop" prompt for סגירת מעגל; אקונומיקה never shows nikud; לרסק = "to smash"; למחוץ = "to crush"; לביאה = "lioness".
- Conjugation: למעוך and למחוץ now selectable as verbs.

**Tests run:** `npm test` — 12/12 passed.

**Risks / regressions to check:**
- Hard-refresh after deploy to pick up new CSS/JS.
- Verify options panel alignment in both language modes.
- Verify Theme/Nikud value rows still align correctly.
- Confirm new verbs display forms with/without nikud correctly.

---

### 2026-03-07 17:40 — Options panel alignment fix (second attempt, robust)

**Requested:** Screenshots showed options panel still misaligned after previous fix — עברית not right-aligned in English mode; "English" right-aligned in Hebrew mode.

**Root cause:** CSS-only `body[data-ui-lang="en"] #homeLangValue` selector was losing the cascade battle in ways that were difficult to trace. The `.home-option-btn` and `.settings-block` classes have conflicting `display` values, and the inherited RTL direction from the Hebrew-mode panel was overriding value alignment.

**Files changed:**
- `app.js` — `renderHomeOptions()`: added `el.homeLangValue.setAttribute("dir", state.language === "en" ? "rtl" : "ltr")` so the element carries an explicit direction attribute. `APP_BUILD` bumped to `20260307m`.
- `styles.css` — Replaced `body[data-ui-lang="en"] #homeLangValue` with three cleaner rules:
  - `body[data-ui-lang="he"] .home-option-value { text-align: right }` — Hebrew mode: all values right-aligned
  - `.home-option-value[dir="rtl"] { text-align: right; direction: rtl }` — explicitly right-aligns Hebrew label in English mode
  - `.home-option-value[dir="ltr"] { text-align: left; direction: ltr }` — explicitly left-aligns "English" label in Hebrew mode (overrides the panel's RTL). Version bumped to `v=20260307j`.
- `index.html` — Version strings bumped.

**Behavior changed:** Same visual intent as before, now working correctly in both modes.

**Tests run:** `npm test` — 12/12 passed.

**Risks / regressions to check:**
- Hard-refresh (`Cmd+Shift+R`) to ensure new CSS and JS are loaded.
- Verify עברית is flush-right in English mode.
- Verify "English" is flush-left in Hebrew mode.
- Verify Theme and Nikud values align correctly in both modes.

---

### 2026-03-08 — Visual Polish: Blue mobile nav, blue/gold topbar, red translation icon

**Requested:** Four follow-up CSS-only polish changes after the Sabra palette rollout: (1) mobile bottom nav solid blue in light mode, (2) topbar gold accents in dark mode + solid blue in light mode, (3) translation tile icon red in dark mode (distinct from gold/teal/violet scheme), (4) version bump.
**Files changed:**
- `styles.css`: `body[data-theme="light"] .mobile-bottom-nav` → solid blue `rgba(0,56,184,0.96)`; `.mobile-nav-link` light-mode color → near-white; active pill → gold `#D4AF37` with dark text; new `.nav-link-icon` light-mode overrides (white glow inactive, dark tint active); `.shell-logo` → gold border/bg/glow via `var(--brand)`; `.shell-brand-title h1` → gold text-shadow; added `.shell-topbar { border-color: rgba(244,196,48,0.2) }` for dark mode; added light-mode topbar rules (solid blue bg, near-white text/logo); `#homeLessonBtn`/`#lessonBtn` `.game-tile-icon` → `var(--error)` with crimson drop-shadow; light-mode override keeps `var(--brand)` blue
- `index.html`: CSS cache-bust `v=20260308c` → `v=20260308d`
**Behavior changed:** Light mode: topbar and mobile nav are now solid blue `#0038B8` matching the desktop sidebar; active mobile tab shows gold pill with dark ink. Dark mode: ע logo glows gold; topbar card has faint gold border; translation game tile icon is now crimson/red (visually distinct from teal conjugation and violet abbreviation tiles).
**Tests run:** `node --test tests/vocab-data.test.js` — 2/2 pass (CSS-only changes, no JS touched)
**Risks / regressions to check:** Shell topbar `border-color` override applies to all shell topbars — verify no layout shifts; mobile nav blue may look too saturated on very bright OLED screens; confirm active mobile tab label is readable (`#1A202C` on `#D4AF37`); translation icon crimson vs light-mode blue — verify both look intentional

---

### 2026-03-08 — Custom SVG nav icons, persistent bottom nav, remove in-game home btn, fix ambiguous past labels

**Requested:** Four improvements: (1) replace emoji nav icons with inline SVGs, (2) keep bottom nav visible during game sessions, (3) remove redundant in-game home button, (4) annotate past-tense English labels with "(past)" when verb past = base form (e.g. לשים "put/put").
**Files changed:**
- `index.html`: Replaced emoji (🏠 🔄 ⚙️) with inline SVG icons in both desktop nav and mobile bottom nav; version bump `v=20260308d` → `v=20260308e`
- `styles.css`: Added `.nav-link-icon svg { display: block; flex-shrink: 0 }` rule; removed `body[data-learn-session="true"] .mobile-bottom-nav { display: none }` and associated `padding-bottom` override; replaced with `#homeBtn { display: none }`
- `hebrew-verbs.js`: Added `pastTag` constant to `buildEnglishFormLabel`; appended `" (past)"` to all 9 past-tense case labels when `past === base`
- `tests/hebrew-verbs.test.js`: Added test "past-tense labels for ambiguous put/put verbs include (past) annotation" with לשים entry; verifies past labels get annotation, present/future do not
- `task-log.md`: This entry
**Behavior changed:** Nav shows clean line-art SVG icons instead of emoji (consistent cross-platform rendering). Bottom nav remains visible during active game sessions; content stays clear via existing `.app-shell` bottom padding. No in-game 🏠 button in lesson header. לשים past-tense prompts now read "I put (past)", "we put (past)", etc.; unambiguous verbs like לשמור ("kept") are unaffected.
**Tests run:** `node --test tests/hebrew-verbs.test.js` — 12/12 pass (new test + all existing)
**Risks / regressions to check:** Verify bottom nav doesn't obscure game content on small screens (normal `.app-shell` padding should provide clearance); confirm SVG stroke color inherits correctly in both light and dark themes and active state gold glow; verify lose-progress warning modal still fires when tapping nav during active session

---

### 2026-03-08 — Custom game tile SVG icons, elite ע logo, fix light-mode desktop nav icon visibility

**Requested:** Three visual polish fixes: (1) replace emoji/letter game tile icons with purpose-drawn inline SVGs, (2) make ע logo gold and elite-looking in both themes, (3) fix desktop nav icons invisible in light mode (blue SVG on blue sidebar).
**Files changed:**
- `index.html`: Replaced all 6 `.game-tile-icon` spans (home tiles + review gamePicker tiles) with inline SVGs — aleph-stroke for Translation, branching fork for Conjugation, text-lines-with-geresh-dots for Abbreviation; version bump `v=20260308e` → `v=20260308f`
- `styles.css`: (a) Added `.game-tile-icon svg { display: block; flex-shrink: 0 }` rule after `.game-tile-icon`; (b) Added `body[data-theme="light"] .desktop-nav .nav-link-icon` (white-ish) and `body[data-theme="light"] .desktop-nav .nav-link.active .nav-link-icon` (dark) rules after desktop nav active block; (c) Strengthened `.shell-logo` dark mode — richer border, bg, layered glow, inner shimmer; (d) Fixed `body[data-theme="light"] .shell-logo` — now gold `var(--brand)` with gold glow instead of near-white
**Behavior changed:** Game tiles show consistent SVG icons that inherit per-tile color theming (crimson/teal/violet) in both dark and light modes. ע logo glows gold on the dark blue `#0038B8` header in light mode, matching dark-mode aesthetic. Desktop nav icons in light mode are now white-ish strokes visible on the dark blue sidebar; active tab icon remains dark on gold background. Mobile nav unaffected (general light-mode blue rule still applies there).
**Tests run:** No JS changes; `npm test` passes (CSS/HTML only)
**Risks / regressions to check:** Verify SVG icon sizes look centered in 42×42 icon squares; confirm translation aleph-stroke SVG is visually distinct enough from a plain letter; check that ע logo `var(--brand)` resolves correctly in light mode (CSS var must be defined for light theme)

---

### 2026-03-08 — PNG logo images + Hebrew letter game tile icons

**Requested:** Use rendered PNG images for the ע logo (light/dark variants), and replace game tile SVG icons with colored Hebrew letters (ת Translation, ק Conjugation, נ Abbreviation).
**Files changed:**
- `assets/logo-light.png` (new): Cropped 1300×1300 → 128×128 from light-bg Gemini image; white rounded-rect with gold 3D ע
- `assets/logo-dark.png` (new): Cropped 1300×1300 → 128×128 from dark-bg Gemini image; charcoal rounded-rect with glowing gold ע
- `index.html`: `.shell-logo` span emptied (text removed); all 6 `.game-tile-icon` spans replaced with single Hebrew letters ת/ק/נ; version bump `v=20260308f` → `v=20260308g`
- `styles.css`: `.shell-logo` rewritten to use `background-image: url('./assets/logo-dark.png')` + `background-size: cover`; light-mode override swaps to `logo-light.png`; removed all text-based font/color/filter/border rules; removed now-unused `.game-tile-icon svg` rule
- `task-log.md`: This entry
**Behavior changed:** Logo is now the rendered premium PNG icon — dark background with glow in dark mode, white background in light mode. Game tiles show styled Hebrew letters inheriting per-tile colors (crimson ת, teal ק, violet נ) — consistent, crisp on all platforms.
**Tests run:** CSS/HTML only; no JS changes
**Risks / regressions to check:** Verify `./assets/` path resolves correctly from `index.html` root; confirm logo looks sharp on Retina (128px source → 48px display = ~2.67× density); check light-mode logo on blue topbar doesn't look washed out

---

### 2026-03-08 — Vocab edits + add לשחרר verb

**Requested:** Replace two construct-state vocab entries with standalone forms, remove two irrelevant entries, and add לשחרר as a Pi'el verb entry.
**Files changed:**
- `vocab-data.js`: (1) Line 435: replaced `["scene (of)", "זירת", "זִירַת"]` → `["scene / arena", "זירה", "זִירָה"]`; (2) Line 447: replaced `["roar of", "שאגת", "שַׁאֲגַת"]` → `["roar", "שאגה", "שְׁאָגָה"]`; (3) Removed `["frontier model", "מודל חזית", "מוֹדֶל חֲזִית"]`; (4) Removed `["closure conversation", "שיחת סגירה", "שיחת סגירה"]`
- `hebrew-verbs.js`: Added `createVerbEntry` for לשחרר (id: `starter-verb-leshacharer`) — Pi'el of ש-ח-ר with geminate resh, curated conjugation, senses "to free" / "to liberate", difficulty 3, priority 80
**Behavior changed:** Translation game no longer surfaces construct-state-only or irrelevant entries; standalone "scene / arena" and "roar" cards now appear. Conjugation game now includes לשחרר with full present/past/future forms.
**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Confirm לשחרר forms display correctly with niqqud in the conjugation game; verify אחסון compound entries (lines 532, 890) remain untouched

---

### 2026-03-08 — Clean up ע logo display in both themes

**Requested:** Fix the double-border-radius artifact on the shell logo badge — the PNG's baked-in background colour fought the CSS `border-radius`, causing white-box-on-dark-topbar in light mode and mismatched corner curves.
**Files changed:**
- `assets/logo-light.png`: BFS flood-fill from seed `(64,8)`, tolerance 25 — cleared ~7640 white background pixels → fully transparent
- `assets/logo-dark.png`: BFS flood-fill from seed `(64,8)`, tolerance 25 — cleared ~6063 dark background pixels → fully transparent
- `styles.css`: Added `background-color: #1a1a1e` to `.shell-logo` (dark mode badge); added `background-color: #f5f0e8` to `body[data-theme="light"] .shell-logo` (light mode cream badge); CSS now owns the badge colour entirely
- `index.html`: CSS cache-buster bumped `v=20260308j` → `v=20260308k`
- `task-log.md`: This entry
**Behavior changed:** Logo badge background and border-radius are now controlled entirely by CSS. Dark mode: near-black badge with gold ע. Light mode: cream/off-white badge with gold ע — no white box on the blue topbar.
**Tests run:** CSS/HTML/PNG only; no JS changes; verify visually in both themes
**Risks / regressions to check:** Confirm transparent PNGs render correctly on both Retina and non-Retina; check that flood-fill tolerance=25 did not eat into the gold ע letter pixels

---

### [2026-03-08] — Revert flood-fill damage; restore solid-background PNGs

**Requested:** Fix double-background artifact on ע logo badge caused by a previous failed flood-fill attempt.
**Files changed:**
- `assets/logo-light.png` — restored via `git checkout HEAD` (solid-background full-frame badge)
- `assets/logo-dark.png` — restored via `git checkout HEAD` (solid-background full-frame badge)
- `styles.css` — removed `background-color: #1a1a1e` from `.shell-logo`; removed `background-color: #f5f0e8` from `body[data-theme="light"] .shell-logo`
- `index.html` — bumped CSS cache-buster `v=20260308k` → `v=20260308l`
**Behavior changed:** Double-background (donut artifact from incomplete flood-fill) eliminated. Dark mode: clean dark badge clipped by `border-radius: 22%`. Light mode: clean cream badge, single edge.
**Tests run:** Visual only — no JS changes; hard-refresh and check both themes
**Risks / regressions to check:** Confirm both PNGs restored to pre-flood-fill state; verify no `background-color` on `.shell-logo` in DevTools; check Retina display for crisp badge edges

---

### [2026-03-08] — Switch logo to shadow-free SVGs (user-supplied)

**Requested:** Replace PNG logos with new shadow-free SVGs (1.svg=light, 2.svg=dark); strip white background rects so CSS controls badge color.
**Files changed:**
- `assets/logo-dark.svg` — new file (from 2.svg, white background rects stripped)
- `assets/logo-light.svg` — new file (from 1.svg, white background rects stripped)
- `styles.css` — `.shell-logo` now references `logo-dark.svg` with `background-color: #1a1a1e`; light theme rule references `logo-light.svg` with `background-color: #f5f0e8`
- `index.html` — cache-buster bumped `v=20260308l` → `v=20260308m`
**Behavior changed:** Logo badge now uses SVG assets; shadow gone; CSS background-color fills the transparent badge background.
**Tests run:** Visual only — hard-refresh and verify both themes
**Risks / regressions to check:** SVGs are ~2MB each (embedded raster); check load time; confirm transparent areas render correctly in both themes

---

### [2026-03-08] — Switch logo to new transparent-background PNGs

**Requested:** Replace SVG logo assets with user-supplied PNGs that have pre-baked transparent corners; remove double-background CSS artifacts.
**Files changed:**
- `assets/logo-light.png` — replaced with new 1000×1000 RGBA PNG (white badge, transparent corners)
- `assets/logo-dark.png` — replaced with new 1000×1000 RGBA PNG (dark badge, transparent corners)
- `styles.css` — `.shell-logo`: removed `background-color`, `border-radius`, `overflow`; switched `logo-dark.svg` → `logo-dark.png`, `background-size: cover` → `contain`; light theme rule: removed `background-color`, switched `logo-light.svg` → `logo-light.png`; media query `.shell-logo`: removed `border-radius: 14px`
- `index.html` — cache-buster bumped `v=20260308m` → `v=20260308n`
**Behavior changed:** Logo uses transparent-corner PNGs; no CSS border-radius/background-color needed; badge shape fully baked into PNG assets.
**Tests run:** Visual only — hard-refresh and verify dark/light themes; confirm no double-background artifact in DevTools
**Risks / regressions to check:** Confirm transparent corners blend correctly into topbar in both themes; check at 2.1rem (responsive size)

---

## 2026-03-08 — Mobile Accessibility: Larger Fonts & Better Tap Targets

**Agent:** Claude Code
**Files changed:** `styles.css`, `index.html`

**What was requested:** Improve mobile readability and tap-target sizes. Several font sizes in the ≤767px media query were below accessible minimums (as low as 9.6px), and `.choice-btn` min-height was 46px, slightly below the 48px iOS/Android recommendation.

**Changes made:**

*styles.css — `@media (max-width: 767px)` block:*
- `.mobile-nav-link span:last-child`: `0.74rem` → `0.8rem`
- `.status-row`: `font-size: 0.68rem` → `0.74rem`
- `.prompt-label`: `font-size: 0.64rem` → `0.76rem`
- `.choice-btn`: `min-height: 46px` → `50px`
- `.match-col-title`: `font-size: 0.6rem` → `0.7rem`
- `.match-card`: `min-height: 41px → 46px`, `padding: 0.4rem 0.28rem → 0.46rem 0.34rem`, `font-size: clamp(0.68rem, 2.5vw, 0.8rem) → clamp(0.78rem, 3vw, 0.92rem)`
- `.match-card.hebrew`: `clamp(0.78rem, 2.9vw, 0.92rem)` → `clamp(0.88rem, 3.2vw, 1.04rem)`

*styles.css — `@media (max-width: 767px) and (max-height: 760px)` block:*
- `.choice-btn`: `min-height: 43px` → `46px`
- `.match-card`: `font-size: 0.72rem` → `0.8rem`
- `.match-card.hebrew`: `font-size: 0.82rem` → `0.9rem`

*index.html:* cache-buster bumped `v=20260308n` → `v=20260308o`

**Tests run:** Visual only — open DevTools, set to iPhone SE (375×667), verify conjugation cards, column titles, prompt label, and buttons are noticeably more readable; confirm no layout overflow on short screens (~560px height)
**Risks / regressions to check:** Confirm match-card height increase doesn't cause overflow on very small phones; check that choice-btn labels don't wrap at new min-height

---

## 2026-03-08 — Game Mode Icons (PNG assets, theme-aware)

**Agent:** Claude Code
**Files changed:** `index.html`, `styles.css`, `assets/` (6 new PNGs)

**What was requested:** Replace the Hebrew letter text characters in game-mode tile icons with custom PNG images. Each game has a dark-theme and a light-theme variant.

**New assets added to `assets/`:**
- `icon-translation-dark.png` / `icon-translation-light.png` — pink/salmon gradient, Hebrew ן
- `icon-conjugation-dark.png` / `icon-conjugation-light.png` — teal/blue gradient, letter J
- `icon-abbreviation-dark.png` / `icon-abbreviation-light.png` — blue/purple gradient, Hebrew פד

**HTML changes (`index.html`):** Replaced `<span class="game-tile-icon">ת</span>` etc. with `<img class="icon-dark">` + `<img class="icon-light">` pairs in all 6 game-tile buttons (home dashboard + in-game picker).

**CSS changes (`styles.css`):**
- `.game-tile-icon`: removed text-based font-size, background, and border; added `overflow: hidden`, `background: transparent`, `border: none`
- Added `.game-tile-icon img { width: 42px; height: 42px; display: block; }`
- Added theme show/hide: `body[data-theme="dark"] .icon-light { display: none }` and vice versa
- Removed per-game color/filter/background overrides (no longer needed)
- Cache-buster bumped: `v=20260308o` → `v=20260308p`

**Tests run:** Visual only — verify icons appear in dark and light themes, confirm correct icon shown per theme
**Risks / regressions to check:** Confirm no layout shift on game-tile cards; check mobile tile sizing; verify theme toggle swaps icons correctly

---

## 2026-03-08 — Updated Game Icons, Hebrew Abbreviation Game Rename, New ר״ת Entry

**Agent:** Claude Code
**Files changed:** `index.html`, `styles.css`, `app.js`, `abbreviation-data.js`, `assets/` (3 new PNGs)

**What was requested:**
1. Replace game mode icons with new single-icon PNGs (same for dark and light themes)
2. Rename abbreviation game in Hebrew from "קיצורים" to "ראשי תיבות"
3. Add ראשי תיבות / ר״ת as a new entry in the abbreviation game

**Changes:**

*assets/:* Added `icon-translation.png`, `icon-conjugation.png`, `icon-abbreviation.png` (blue-gradient square icons, self-contained with rounded corners)

*index.html:* Replaced dark/light img pairs in all 6 `.game-tile-icon` spans with single `<img>` tags pointing to the new assets. Cache-buster bumped `v=20260308p` → `v=20260308q`

*styles.css:* Removed the `body[data-theme] .icon-dark/.icon-light` display-none toggle rules (no longer needed with single icons)

*app.js (line 516):* Hebrew abbreviation game name: `"קיצורים"` → `"ראשי תיבות"`

*abbreviation-data.js:* Added entry `abbr-207`: abbr `ר״ת`, expansionHe `ראשי תיבות`, english `"acronym / abbreviation"`, bucket `"Ideas, Science & Tech"`

**Tests run:** Visual only — verify icons display on home screen and in-game picker; confirm Hebrew UI shows "ראשי תיבות"; play abbreviation game and confirm ר״ת appears as a question
**Risks / regressions to check:** Confirm single icon looks correct in both dark and light themes; check icon sizing on mobile

---

## 2026-03-08 — Low-score feedback message

**Agent:** Claude Code
**Files changed:** `app.js`

**What was requested:** Show a different end-of-game message when the player scores under 50%.

**Changes made:**
- Added i18n keys `results.roomToImprove` in English ("There's room to improve") and Hebrew ("יש מקום לשיפור") to both locale objects
- Updated `renderSummaryState()` praise logic: `< 50%` accuracy → `roomToImprove`; `50–99%` → `niceJob`; `100%` → `amazing`

**Tests run:** Play a game, answer mostly wrong → confirm "There's room to improve" / "יש מקום לשיפור" appears on results screen; score ≥ 50% → "Nice job!"; perfect → "Amazing!"
**Risks / regressions to check:** None — isolated logic change in one function

---

## 2026-03-09 — Register-based taxonomy + vocabulary fixes

**Agent:** Claude Code
**Files changed:** `app.js`, `vocab-data.js`

**What was requested:**
1. Replace the four topic-based `PERFORMANCE_DOMAINS` with a register-based taxonomy ("How formal is this?")
2. Fix inaccurate/misleading vocabulary translations and add disambiguation notes

**Changes made:**

`app.js`:
- Replaced all four `PERFORMANCE_DOMAINS` objects with new register-based domains:
  - 🗣️ Colloquial & Street (id: `colloquial`) — conversation glue, dating, media, emotional/social
  - 🏠 Everyday Functional (id: `everyday`) — home, cooking, health, bureaucracy
  - 💼 Professional (id: `professional`) — work, finance, legal, civic, tech
  - 📚 Formal & Analytical (id: `formal`) — abstract, philosophy, science, linguistics, discourse
- Updated `FALLBACK_DOMAIN_ID` fallback string from `"ideas"` to `"formal"`

`vocab-data.js` (17 targeted edits):
- Critical fixes: diet תפריט→דיאטה; deployment הטמעה→פריסה; payroll שכר→תשלום שכר; "to lead someone on" למשוך מישהו→להוליך שולל; white paper נייר עמדה→מסמך מדיניות
- English label corrections: squalor→wretchedness/patheticness; paramedic→medic (field/EMT); in-laws→in-laws (parents' relationship)
- Duplicate disambiguation: "to blanch" and "to toss" noted as sharing Hebrew with "to poach" / "to sauté"; reasoning הסקה→הנמקה (disambiguated from inference); tradeoff פשרה→תמורה (disambiguated from compromise)
- Dual-meaning notes: attempt/experience (ניסיון); similarity/imagination (דמיון); confidence→ביטחון עצמי
- Register notes: apparently/probably (כנראה); fair enough/acceptable (מקובל)

**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Confirm home screen shows 4 new domain cards with correct labels and emojis; verify distractor logic still works (same-category groupings intact); spot-check updated vocab in quiz

---

## 2026-03-09 — Fix Most-Missed Two-Column Layout (Claude Code)

**Requested:** Apply inline styles in `renderMostMissed()` to force two-column flex layout that CSS alone couldn't achieve due to `.page-card { display: grid }` parent context overriding `.missed-list { display: flex }`.

**Root cause:** `.missed-list` is a direct grid item of `.page-card`; grid containers can suppress flex display on children. Inline styles have higher specificity and bypass stylesheet cascade.

**Changes made:**

`app.js` (`renderMostMissed()`, ~line 2957):
- Added inline styles on `el.mostMissedList`: `display: flex`, `gap: 1.25rem`, `alignItems: flex-start`
- Added inline styles on each `<ol>`: `flex: 1`, `margin: 0`, `paddingLeft`/`paddingRight` set conditionally based on `document.documentElement.dataset.uiLang === "he"` for RTL support

`styles.css`:
- Simplified `.missed-list` to `margin: 0` only (removed `display: flex` and `gap`)
- Emptied `.missed-col` block (layout now inline)
- Removed `body[data-ui-lang="he"] .missed-col` RTL override (now handled inline in JS)

**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Verify two columns appear side by side in Review tab; check RTL (Hebrew UI lang) still pads correctly on the right side; check mobile view (~400px) still shows two columns

---

### 2026-03-10 — AdvConj past/future tenses, new vocab & idioms

**Requested:** (1) Add past and future tenses to Advanced Conjugation game. (2) Add רצף (sequence) and ברצף (in a row) to vocabulary. (3) Add קורע to vocabulary and advConj game with figurative meaning "(to kill/send someone [funny])". (4) Add לכבות to vocabulary and regular conjugation game. (5) Add מכה to vocabulary. (6) Update מפיל לו את האסימון figurative meaning to "(to make it click/make sense for someone)". (7) Remove לבשל פחות מדי from vocabulary.
**Files changed:**
- `hebrew-idioms.js`: Added `past` and `future` conjugation keys (msg/fsg/mpl/fpl forms) and `literal_past`/`literal_future` English templates to all 22 existing idioms. Added new קורע (kara) idiom entry with all 3 tenses, `showMeaning: true`. Changed `hfalat_asiman` english to "(to make it click/make sense for someone)". Updated normalize step to create `past_tense` and `future_tense` aliases.
- `app.js`: Updated `buildAdvConjHebrewAnswer()` and `buildAdvConjEnglishSentence()` to accept a `tense` parameter. Updated `buildAdvConjDeck()` to iterate over ["present", "past", "future"] tenses, generating questions for all available tenses per idiom. Tense stored in question object. Ambiguity check uses per-tense data. Updated intro preview caller to pass "present".
- `vocab-data.js`: Added רצף and מכה to `core_advanced`. Added ברצף and קורע to `conversation_glue`. Added לכבות to `home_everyday_life`. Removed לבשל פחות מדי from `cooking_verbs`.
- `hebrew-verbs.js`: Added לכבות (pi'el, כ-ב-ה) as a starter verb entry with full present/past/future conjugations sourced from lekhabot_conjugations_modern_v2.json.

**Behavior changed:** Advanced Conjugation game now tests all three tenses — prompts like "he drove her crazy" (past) and "she will break his heart" (future) appear alongside present-tense questions. New vocab words appear in translation game. לכבות appears in conjugation game. קורע appears in both translation and advConj games with its figurative meaning shown after answering.
**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Verify past/future English templates read naturally for all idioms. Check that ambiguity filtering correctly skips he2en questions where mpl/fpl share the same past/future verb form. Verify לכבות conjugation forms are correct in the conjugation game. Confirm לבשל פחות מדי no longer appears in translation quiz.

---

### 2026-03-10 — Fix advConj Play Again, distractor ambiguity, cache busting

**Requested:** (1) Fix distractor where "your" was ambiguous between singular and plural objects. (2) Fix Play Again button not working in Advanced Conjugation — it was redirecting to the summary page instead of restarting. (3) Fix past/future tenses not appearing when user runs via localhost (cache issue).
**Files changed:**
- `app.js`: Changed `ADV_CONJ_OBJECTS` 2mpl `poss` from `"your"` to `"your (pl.)"` to disambiguate from singular `"your"`. Added `clearSummaryState()`, `state.mode = "advConj"`, `state.route = "home"`, and `state.lastPlayedMode = "advConj"` inside `startAdvConj()` so it works correctly when called from `continueFromResults()` (Play Again).
- `index.html`: Bumped all cache-busting query params from various dates to `?v=20260310a` so browsers load the latest JS/CSS files.

**Behavior changed:** Play Again button in Advanced Conjugation now correctly restarts the game instead of showing the summary again. English sentences with plural "you" objects now show "your (pl.)" to distinguish from singular "your". Users on localhost will get fresh files after hard-refreshing.
**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Verify "your (pl.)" reads naturally in English sentences. Confirm Play Again works in all game modes (translation, conjugation, abbreviation, advConj). Check that GitHub Pages deployment picks up the new cache params.

---

### 2026-03-11 — Fix stocks translation, לצנן conjugation, showMeaning double-parens

**Requested:** (1) ניירות ערך should translate as "stocks" — update abbreviation and add to vocab. (2) Past tense 1pl of לצנן generates "צינננו" (3 nuns) — should be "ציננו". (3) Check if ממ״ד exists in abbreviation game (it does — no action). (4) Fix doubled parentheses when showing figurative meaning for קורע in advConj feedback.
**Files changed:**
- `abbreviation-data.js`: Changed ני״ע english from "securities" to "stocks / securities".
- `vocab-data.js`: Added `["stocks / securities", "ניירות ערך", "נְיָרוֹת עֵרֶךְ"]` to core_advanced.
- `hebrew-verbs.js`: Removed לצנן from SAFE_GENERATION_OVERRIDES (auto-generated piel had geminate root bug producing "צינננו"). Added curated entry `starter-verb-letzanen` with manually correct forms including 1pl past "ציננו".
- `hebrew-idioms.js`: Removed wrapping parentheses from `english` field on קורע ("to kill/send someone [funny]") and אסימון ("to make it click/make sense for someone") entries — the display code in app.js already wraps with parens via `showMeaning`.
- `index.html`: Bumped cache-busting params to `?v=20260311a`.

**Behavior changed:** ניירות ערך now appears in translation game. ני״ע abbreviation shows "stocks / securities". לצנן conjugation game shows correct "ציננו" for 1pl past. AdvConj feedback for קורע/אסימון shows single parentheses instead of doubled.
**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Verify לצנן curated forms are all correct (present, past, future). Check other geminate piel verbs in SAFE_GENERATION_OVERRIDES (לדלל, לסנן, לקרר) may have the same 1pl past bug. Verify ממ״ד still appears correctly in abbreviation game.

---

### 2026-03-11 — Move iPad nav to bottom bar (raise breakpoint to 1024px)

**Requested:** On iPad, move the Home/Review/Settings sidebar nav to the bottom like mobile. The sidebar was cramping category text on review page and making the pre-game greeting look off-center.
**Files changed:**
- `styles.css`: Changed responsive breakpoint from 768px to 1024px — `@media (min-width: 768px)` → `(min-width: 1024px)`, `@media (max-width: 767px)` → `(max-width: 1023px)` (2 occurrences). Merged the two now-identical `@media (min-width: 1024px)` blocks into one.
- `index.html`: Bumped cache-busting params to `?v=20260311b`.

**Behavior changed:** iPad portrait (768-1023px) now shows bottom nav bar instead of sidebar. Full content width available for game tiles, review categories, and pre-game greetings. Desktop (1024px+) layout unchanged.
**Tests run:** `npm test` — all 12 tests pass
**Risks / regressions to check:** Verify layout at exactly 1024px still shows sidebar correctly. Check that no other CSS rules relied on the 768px breakpoint outside styles.css (e.g. inline styles or JS media queries in app.js).

---

### 2026-03-11 09:33 — Add submit-time feedback sounds and sound toggle

**Requested:** Reacquaint with the project, add submit-time answer sounds using the provided files (`powerUp2` for right answers, `lowThreeTone` for wrong answers), move/rename them as needed, and add a sound on/off control to both the Settings page and the home Options box in a way that can scale to more sounds later.

**Files changed:**
- `assets/sounds/answer-correct.ogg` — Moved/renamed from `sounds/powerUp2.ogg` for the correct-answer cue.
- `assets/sounds/answer-wrong.ogg` — Moved/renamed from `sounds/lowThreeTone.ogg` for the wrong-answer cue.
- `index.html` — Added `homeSoundToggle`/`homeSoundValue` to the home Options card, added `soundToggle` to the Settings page, and bumped the `app.js` cache-busting query param.
- `app.js` — Added a shared audio cue registry, persistent `ivriquest-sound-v1` preference storage, `state.audio.enabled`, settings/home toggle wiring, localized sound labels, and submit-time playback hooks in translation, abbreviation, and advanced conjugation answer handlers.
- `tests/app-progress.test.js` — Extended the fake DOM/audio harness to support click handlers and `Audio.play()` logging; added coverage for default-on sound prefs, persistence, submit-only playback, disabled-sound suppression, and abbreviation/advConj sound paths.
- `task-log.md` — Appended this entry.

**Behavior changed:** Translation, Abbreviation, and Advanced Conjugation now play a short sound only when the submitted answer is scored: `answer-correct.ogg` on correct submissions and `answer-wrong.ogg` on incorrect ones. Choice selection remains silent until Submit. Users can turn sound effects on or off from either the Settings page or the home Options card, and the preference persists across reloads.

**Tests run:** `node --test tests/app-progress.test.js` — 18 tests executed and passed, but the runner did not exit cleanly afterward (pre-existing hang reproduced). `npm test` — app-progress tests executed and passed through the same 18 cases, then the suite again failed to exit cleanly before reaching the remaining files (pre-existing hang reproduced). `node --test tests/hebrew-verbs.test.js` — 11 pass, 1 fail (pre-existing: "starter verb seed entries carry per-mode availability metadata"). `node --test tests/vocab-data.test.js` — 2 pass, 0 fail.

**Risks / regressions to check:** Verify the first sound playback is responsive in direct-file mode (`index.html`) as well as localhost. Check that the new Settings button text feels clear in both English and Hebrew. The Node test runner still hangs after `tests/app-progress.test.js`, so full-suite exit behavior remains unresolved outside this change.

---

### 2026-03-14 11:13 — Stabilize feedback audio and disambiguate advConj prompts

**Requested:** (1) Replace the answer sounds with newly provided WAV files, convert them to web-friendly formats, add a new streak sound every fourth correct answer, bring the same sounds into the conjugation game, and default sound to Off. (2) Investigate why GitHub Pages playback was inconsistent across iPad/mobile/desktop and make the live build reliably serve the latest cues. (3) Fix ambiguous Advanced Conjugation prompts where English "your" could refer to either singular or plural objects.

**Files changed:**
- `assets/sounds/answer-correct.ogg`, `assets/sounds/answer-correct.mp3` — Replaced the correct-answer cue with converted versions of the updated user WAV file.
- `assets/sounds/answer-streak.ogg`, `assets/sounds/answer-streak.mp3` — Added converted versions of the new streak cue from the user WAV file.
- `assets/sounds/answer-wrong.mp3` — Added MP3 fallback alongside the hosted wrong-answer cue set.
- `app.js` — Added versioned OGG/MP3 cue source selection, cue priming/preload logic, default sound preference Off, every-4th-correct streak playback, conjugation-game sound hooks, and explicit `you (sg.)` / `your (sg.)` labeling in `ADV_CONJ_OBJECTS` so singular vs plural second-person prompts are not ambiguous.
- `index.html` — Bumped cache-busting query params so browsers and GitHub Pages fetch the latest JS/audio assets.
- `tests/app-progress.test.js` — Added coverage for default-off sound prefs, MP3 fallback, preload/priming, streak playback, conjugation-game audio, and advConj singular/plural English prompt disambiguation.
- `task-log.md` — Appended this entry.

**Behavior changed:** Sound effects now default to Off for new users. When enabled, the app serves versioned audio assets with OGG preferred and MP3 fallback, primes them earlier to reduce first-play misses, and plays feedback in translation, abbreviation, conjugation, and advanced conjugation. Every fourth consecutive correct answer plays the streak cue. Advanced Conjugation prompts now distinguish singular and plural second-person possession as `your (sg.)` and `your (pl.)`, preventing ambiguous answer banks.

**Tests run:** `node --test tests/app-progress.test.js` — all targeted app-progress/audio tests passed, including streak and advConj disambiguation coverage; runner still hangs afterward due to the pre-existing open-handle issue. `node --test tests/vocab-data.test.js` — passed. `node --test tests/hebrew-verbs.test.js` — same unrelated pre-existing failure remains at line 343. Verified GitHub Pages deployment served `app.js?v=20260314a` and returned HTTP 200 for `assets/sounds/answer-streak.ogg?v=20260314a`.

**Risks / regressions to check:** Verify cached browsers pick up the new assets after one hard refresh. Confirm streak counting feels right across all game modes after interrupted sessions or resumes. The full Node suite still has a pre-existing hang/open-handle issue after `tests/app-progress.test.js`, so whole-suite exit behavior is not yet clean.

---

### 2026-03-14 11:20 — Trim unused logo assets, move verb migration outputs

**Requested:** Do the lightest-lift cleanup items from a repo review so the remaining bigger structural/content work can be handed off later.

**Files changed:**
- `migrate-hebrew-verbs.mjs` — Changed migration outputs to write into `generated/verbs/` and ensured the directory is created automatically before writing.
- `README.md` — Updated the migration-output paths in the docs to match `generated/verbs/`.
- `generated/verbs/hebrew-verb-review-report.json`, `generated/verbs/hebrew-verb-review-report.md`, `generated/verbs/hebrew-verb-migrated.json` — Moved the generated verb-report artifacts out of the repo root into a dedicated folder.
- `assets/logo-dark.svg`, `assets/logo-light.svg` — Deleted the old heavyweight SVG logo files that are no longer referenced by the live CSS.
- `task-log.md` — Appended this entry.

**Behavior changed:** None in the live app. The repository is lighter, and the verb-migration script now writes its generated artifacts into a dedicated folder instead of the project root.

**Tests run:** `node migrate-hebrew-verbs.mjs` — passed and regenerated outputs successfully into `generated/verbs/` with summary counts `{ generated_safe_verbs: 8, curated_verbs_needing_forms: 0, ambiguous_verbs_needing_sense_splitting: 3, phrase_only_items: 31, blocked_items: 57 }`. Also verified no live repo references remain to `logo-dark.svg` or `logo-light.svg` outside historical task-log notes.

**Risks / regressions to check:** If any outside scripts or personal notes expect the old root-level migration filenames, they will need to be pointed at `generated/verbs/` instead. The SVG deletions are safe for the current app because CSS uses PNG logos now, but reintroducing SVG logos later would require re-adding optimized assets.

---

### 2026-03-14 11:31 — Expand advConj subject coverage, fix test-runner hang

**Requested:** Expand the Advanced Conjugation subject coverage in `app.js` beyond just he/she/they, and investigate why the full Node test suite was hanging instead of exiting cleanly.

**Files changed:**
- `app.js` — Expanded `ADV_CONJ_SUBJECTS` to include present-tense second-person variants (`you (m.sg.)`, `you (f.sg.)`, `you (m.pl.)`, `you (f.pl.)`) where the underlying idiom data safely shares those present-tense forms; added `getAdvConjSubjectsForTense()` so past/future stay limited to the fully supported buckets; updated advConj deck generation to use tense-appropriate subject sets; switched advConj intro auto-advance to the shared tracked intro scheduler and added a guard so leaving home cancels the pending intro transition cleanly.
- `tests/app-progress.test.js` — Exported the new advConj helpers for test harness access; added regression coverage for present-vs-past/future subject availability and canceled advConj intro auto-advance; wrapped the VM `setTimeout`/`setInterval` APIs in tracked test-local timer helpers and cleaned them up after each test so the file no longer leaves open handles behind.
- `task-log.md` — Appended this entry.

**Behavior changed:** Advanced Conjugation now includes additional second-person subjects in present tense prompts and answer banks, while still avoiding fake past/future coverage that the idiom dataset does not currently support. Leaving Advanced Conjugation during its intro no longer risks a delayed auto-start firing after the session has already been closed. The Node test suite now exits normally instead of hanging after `tests/app-progress.test.js`.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 26/26. `node --test` — exited cleanly (hang resolved) and reported 39 pass / 1 fail; the remaining failure is `tests/hebrew-verbs.test.js` at line 343 (`starter verb seed entries carry per-mode availability metadata`), unchanged by this work.

**Risks / regressions to check:** This expands advConj only as far as the current idiom data can support safely. `I`, `we`, and non-present second-person forms still require richer tense data in `hebrew-idioms.js`; adding them in `app.js` alone would generate incorrect Hebrew. Because more present-tense second-person prompts now exist, spot-check distractor quality in Advanced Conjugation to make sure the larger subject pool still feels clean.

---

### 2026-03-14 11:38 — Align verb availability test with conjugation-only starter verbs

**Requested:** Keep `לכתוב` available in the conjugation game but not in the translation game, and resolve the stale verb-data suite failure around that availability metadata.

**Files changed:**
- `tests/hebrew-verbs.test.js` — Updated the `starter-verb-lichtov--sense-1` expectation so `availability.translationQuiz === false` and `availability.sentenceHints === true`, matching the current seed-verb metadata and intended product behavior.
- `task-log.md` — Appended this entry.

**Behavior changed:** None in the live app. `לכתוב` remains available to conjugation flows and remains excluded from the translation quiz pool; the test suite now reflects that rule correctly.

**Tests run:** `node --test tests/hebrew-verbs.test.js` — passed, 12/12. `node --test` — passed, 40/40.

**Risks / regressions to check:** If product intent changes and `לכתוב` should appear in the translation quiz later, the source of truth is `TRANSLATION_HIDDEN_STARTER_VERB_IDS` in `hebrew-verbs.js`, not this test.

---

### 2026-03-14 11:54 — Collapse duplicate advConj singular/plural markers

**Requested:** Fix the awkward Advanced Conjugation English wording where `(sg.)` or `(pl.)` appeared redundantly in prompts like “he will take you (sg.) out of your (sg.) mind”.

**Files changed:**
- `app.js` — Updated `buildAdvConjEnglishSentence()` to detect when the same second-person qualifier appears on both the direct-object and possessive forms in a single sentence, collapse the duplicated labels, and append a single trailing qualifier instead.
- `tests/app-progress.test.js` — Added a regression test covering the exact “take you out of your mind” pattern so the collapsed wording stays stable while preserving the earlier singular/plural disambiguation checks.
- `task-log.md` — Appended this entry.

**Behavior changed:** Advanced Conjugation still disambiguates singular vs plural second-person English prompts, but sentences that mention the same “you” twice now render a single marker, e.g. `he will take you out of your mind (sg.)` instead of repeating `(sg.)` twice.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 27/27. `node --test tests/hebrew-verbs.test.js` — passed, 12/12.

**Risks / regressions to check:** The collapsed marker is intentionally appended at the end of the sentence only when both `{o}` and `{p}` refer to the same disambiguated second-person form. Spot-check a few Advanced Conjugation prompts live to confirm the wording feels natural in both choices and feedback text.

---

### 2026-03-14 12:12 — Foundation pass: extract pure helpers into app/ scripts

**Requested:** After committing and pushing the latest prompt-label fix, begin the `app.js` reorganization with a low-risk foundation pass: create an `app/` folder, move pure helpers and constants out first, add the new files to `index.html` in ordered `defer` script tags, and keep behavior identical.

**Files changed:**
- `app/constants.js` — New namespace-backed constants module containing storage keys, round/count constants, advConj subject/object constants, Hebrew final-letter maps, vocabulary availability defaults, and the survey URL.
- `app/storage.js` — New pure storage helper module for `getStorage()`, `loadJson()`, and `saveJson()`.
- `app/utils.js` — New pure utility module for `normalizeVocabularyAvailability()`, `weightedRandomWord()`, and `shuffle()`.
- `app/hebrew.js` — New Hebrew-text helper module for niqqud stripping/building, final-letter normalization, medial-form normalization, and `prepareVocabulary()`.
- `app.js` — Replaced the extracted local helpers/constants with namespace imports from `window.IvriQuestApp`, added a foundation-load guard, removed the duplicated helper implementations, and bumped `APP_BUILD` to `20260314c`.
- `index.html` — Added ordered `defer` script tags for the new `app/` modules and converted the existing data/app script tags to ordered `defer` loading so the namespace is initialized before `app.js`.
- `tests/app-progress.test.js` — Updated the VM harness to load the new `app/` support scripts before instrumenting `app.js`.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. The app still runs as a plain static site, but `app.js` now consumes shared pure helpers from `app/` modules instead of defining all of them inline.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 27/27. `node --test` — passed, 41/41.

**Risks / regressions to check:** Because script loading now relies on ordered `defer`, spot-check the live page once to confirm no boot error appears before the app renders. This pass intentionally leaves stateful rendering, routing, and mode logic inside `app.js`; only pure helpers/constants were extracted.

---

### 2026-03-14 14:52 — Continue app.js reorg with Verb Match and Lesson extraction

**Requested:** Continue the `app.js` reorganization/tidying plan and report what still remains after the next substantial pass.

**Files changed:**
- `app/verb-match.js` — New dedicated Verb Match module containing start/reset/intro flow, round loading, pair selection, column refill, rendering, left/right card selection, success handling, mismatch handling, and “move current verb to mastered” behavior.
- `app/lesson.js` — New dedicated lesson/translation module containing lesson startup, intro handling, second-chance intro handling, question progression, review-phase entry, question rendering, answer application, choice marking, lesson question cloning, and option-building helpers.
- `app.js` — Rewired the bootstrap to import `lessonMode` and `verbMatch` module functions from `window.IvriQuestApp`, exposed `buildAnswerDisplay` to shared helpers, removed the old inlined Verb Match and lesson/question-flow implementations, and kept the remaining shell/rendering/bootstrap logic in place.
- `index.html` — Added ordered `defer` script tags for `app/lesson.js` and `app/verb-match.js`.
- `tests/app-progress.test.js` — Updated the harness boot order to load `app/lesson.js` and `app/verb-match.js` before instrumenting `app.js`.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. Verb Match and lesson/translation gameplay still behave the same, but their state transitions and rendering flow now live in dedicated modules instead of the main bootstrap file. This also preserves the earlier advConj grammar fix that filters confusing second-person-subject plus second-person-object combinations from Advanced Conjugation.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 29/29. `node --test` — passed, 43/43.

**Risks / regressions to check:** Script ordering matters more now that `app.js` depends on additional `app/` modules. Spot-check one full lesson run and one Verb Match run in the browser after the next push to confirm no stale-cache issue serves an older `app.js` alongside the new module files.

---

### 2026-03-14 15:18 — Move dashboard/results/modal rendering into ui module, trim dead conjugation helpers

**Requested:** Continue the reorganization plan by pushing more rendering logic out of `app.js`, and keep tidying where safe.

**Files changed:**
- `app/ui.js` — Expanded the UI module to own pool-meta rendering, domain/mode performance cards, home/dashboard rendering, results-summary rendering, settings rendering, idle lesson rendering, most-missed rendering, and the welcome/mastered modal open/close/restore flows.
- `app.js` — Rewired imports to consume the expanded UI module, removed the old inline UI/dashboard/results/modal renderers, exposed `getLanguageToggleLabel` to shared helpers for the home dashboard, and deleted an unused legacy conjugation-generator block that was no longer referenced anywhere in the runtime.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. The visual/dashboard layer is now concentrated in `app/ui.js`, and `app.js` is slimmer without changing gameplay. The removed conjugation-helper block was dead code; the live app already uses `IvriQuestHebrewVerbs.buildVerbConjugationDeck()` from `hebrew-verbs.js` for conjugation data.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 29/29. `node --test` — passed, 43/43.

**Risks / regressions to check:** The home/results/review/settings shells and the mastered/welcome overlays now depend more heavily on `app/ui.js`, so the next browser spot-check after a push should include opening the home dashboard, results screen, and mastered modal once each. The dead-code trim was kept intentionally narrow and only removed functions with no remaining references in the repo.

---

### 2026-03-14 15:29 — Move remaining mode-specific setup helpers out of app.js

**Requested:** Continue the reorganization plan with another low-risk pass.

**Files changed:**
- `app/abbreviation.js` — Took ownership of `prepareAbbreviationDeck()` and `cloneAbbreviationQuestionSnapshot()`, so abbreviation setup and snapshotting now live with the rest of the abbreviation mode.
- `app/verb-match.js` — Took ownership of `playVerbMatchIntro()` and `beginVerbMatchFromIntro()`, so Verb Match now owns its intro/start transition as well as its round flow.
- `app.js` — Rewired imports to use those module exports and removed the old inline implementations.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. This is a containment pass only; abbreviation deck prep, restored abbreviation-question snapshots, and Verb Match intro/start behavior all remain the same.

**Tests run:** `node --test` — passed, 43/43.

**Risks / regressions to check:** This pass touches restored-session and intro flow wiring, so the next browser spot-check after a push should still include resuming an active session and starting Verb Match from home once.

---

### 2026-03-14 15:47 — Extract i18n/presenter/controller layers from app.js

**Requested:** Continue the reorganization plan and keep shrinking `app.js` by moving the remaining shared presenter, language/theme, and controller code into dedicated modules.

**Files changed:**
- `app/i18n.js` — New module for language/theme/sound/niqqud preferences, translation lookup, `t()`, and language/theme application.
- `app/ui.js` — Expanded to own the shared render loop, session header rendering, prompt rendering, feedback helpers, answer display helpers, and selection-state helpers in addition to the earlier dashboard/results/modal rendering.
- `app/controller.js` — New module for DOM event binding, route/button handling, home-mode launch helpers, result continuation, summary-exit routing, reset-progress wiring, and next-action orchestration across modes.
- `app/session.js` — Took ownership of `restoreSessionState()` so session rehydration now lives with the rest of the session lifecycle logic.
- `app.js` — Rewired bootstrap imports to the new modules, removed the old inline implementations, and now mostly contains config/constants, runtime/state assembly, and startup sequencing.
- `index.html` — Added ordered `defer` loading for `app/i18n.js` and `app/controller.js`.
- `tests/app-progress.test.js` — Updated the harness boot order to load the new modules before instrumenting `app.js`.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. This is still a structural pass only; the app now reaches the same behavior through smaller modules. `app.js` dropped to roughly bootstrap-only, with just one remaining local helper (`buildDomainByCategoryMap()`).

**Tests run:** `node --test tests/app-progress.test.js` — passed, 29/29. `node --test` — passed, 43/43.

**Risks / regressions to check:** Because `app.js` now depends on more ordered modules, the next browser spot-check after a push should include one fresh reload plus: switching language/theme, opening a lesson, opening Verb Match, and reloading mid-session to confirm restored state still resumes cleanly.

---

### 2026-03-14 16:18 — Finish bootstrap-data extraction and move startup fallbacks/state out of app.js

**Requested:** Continue the `app.js` reorganization plan by pushing more startup-only config and wiring out of the main bootstrap file.

**Files changed:**
- `app/bootstrap-data.js` — New startup data module holding the locale bundle, performance domains, domain-category lookup, and fallback domain id.
- `app/content-sources.js` — New startup module holding the fallback vocab/abbreviation/verb APIs plus the shared `resolveContentApis()` selector.
- `app/bootstrap-runtime.js` — New startup module for the DOM element registry and initial state factory.
- `app.js` — Removed the inlined locale bundle, performance-domain config, fallback content APIs, giant DOM query block, and initial-state object; now consumes those startup modules and mainly orchestrates runtime wiring.
- `index.html` — Added ordered `defer` script tags for the new startup modules.
- `tests/app-progress.test.js` — Updated the harness boot order to match the browser’s new startup sequence.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended. This is a structural pass only. Startup order, fallback behavior, DOM lookup, initial state hydration, and the live app’s mode behavior should all remain the same.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 29/29. `node --test` — passed, 43/43.

**Risks / regressions to check:** Script ordering matters even more now that `app.js` is consuming several startup modules. After the next push, do one fresh browser reload and start at least one Translation and one Conjugation session to confirm there is no stale-cached boot sequence.

---

### 2026-03-14 16:34 — Fix Advanced Conjugation idiom export for real browser boot

**Requested:** Figure out why Advanced Conjugation would not start from `http://localhost:8080/` and fix it.

**Files changed:**
- `hebrew-idioms.js` — Exported `HEBREW_IDIOMS` onto `globalThis` so browser consumers can read the idiom list at runtime.
- `index.html` — Bumped the `hebrew-idioms.js` cache-busting query string so the browser fetches the fixed data file immediately.
- `tests/hebrew-idioms.test.js` — New regression tests that load the real idiom file and verify both global exposure and non-empty Advanced Conjugation deck generation.
- `task-log.md` — Appended this entry.

**Behavior changed:** Advanced Conjugation now sees the real idiom data in the live browser instead of an empty list, so the mode can build a playable deck again. This restores the browser path that the mocked harness had been hiding.

**Tests run:** `node --test tests/hebrew-idioms.test.js` — passed, 2/2. `node --test tests/app-progress.test.js` — passed, 29/29. `node --test` — passed, 45/45.

**Risks / regressions to check:** Do one hard refresh on `http://localhost:8080/` once so the old cached `hebrew-idioms.js?v=20260311b` is gone. After that, Advanced Conjugation should open normally.

---

### 2026-03-14 16:46 — Fix GitHub Pages artifact to publish modular app bundle

**Requested:** Investigate why the live GitHub Pages build showed `IvriQuest foundation scripts failed to load` while localhost was fine, and fix the deployment.

**Files changed:**
- `.github/workflows/deploy-pages.yml` — Updated the static-site bundle step to copy the new `app/` directory into `dist` so the deployed HTML can actually load the modularized runtime files.
- `index.html` — Bumped the `app/*.js` and `app.js` cache-busting query string from `20260314i` to `20260314j` so browsers stop reusing cached 404s for the newly published module paths.
- `app.js` — Bumped `APP_BUILD` to `20260314j` to stay aligned with the refreshed browser asset version.
- `task-log.md` — Appended this entry.

**Behavior changed:** None intended in the app itself. The fix restores the live deployment by making GitHub Pages publish the modular bundle that localhost was already serving correctly.

**Tests run:** `node --test` — passed, 45/45.

**Risks / regressions to check:** After the next push, verify that `https://mikeesexton.github.io/ulpango/app/constants.js?v=20260314j` returns `200` and that the app loads without the boot error. One hard refresh may still help on devices that cached the old missing-module URLs.

---

### 2026-03-14 17:05 — Normalize abbreviation punctuation, suppress exact collisions, add expansion-only niqqud batch

**Requested:** Implement the abbreviation punctuation cleanup, overlap suppression, and first safe niqqud pass without adding niqqud to acronym tokens themselves.

**Files changed:**
- `abbreviation-data.js` — Converted the remaining dotted abbreviations to gereshayim (`ח״פ`, `ע״מ`, `ע״פ`), added `availability.abbreviationQuiz: false` to exact-collision entries that should stay out of gameplay, and added `expansionHeNiqqud` to the first 24 safe everyday expansions.
- `app/abbreviation.js` — Added `getExpansionText()`, preserved acronym tokens unchanged, filtered the prepared deck by `availability.abbreviationQuiz`, and switched answer feedback to use `expansionHeNiqqud` only when inline niqqud is enabled.
- `app/data.js` — Updated abbreviation mistake summaries to use the niqqud-aware expansion text as well.
- `tests/app-progress.test.js` — Added a regression test proving the niqqud toggle affects only the full expansion text and not the acronym token.
- `tests/abbreviation-data.test.js` — New real-data tests covering period cleanup, duplicate-playable-acronym suppression, business/legal collision handling, and presence of the phase-1 `expansionHeNiqqud` fields.
- `index.html` / `app.js` — Bumped static asset cache versions to refresh the changed abbreviation data and module code.
- `task-log.md` — Appended this entry.

**Behavior changed:** Abbreviation mode now serves only geresh/gereshayim acronym forms, hides exact-collision abbreviations that would produce ambiguous answer banks, and shows niqqud only on the expanded Hebrew phrase when the global niqqud toggle is on.

**Tests run:** `node --test tests/abbreviation-data.test.js` — passed, 3/3. `node --test tests/app-progress.test.js` — passed, 30/30. `node --test` — passed, 49/49.

**Risks / regressions to check:** The collision cleanup intentionally removes a few exact-acronym entries from gameplay for now (`ע״מ`, `ע״פ`, `מ״מ` conflicting senses). If you later want context-sensitive reintroduction, that should be a separate pass with domain-aware prompts or labeling.

---

### 2026-03-14 17:42 — Add official-first abbreviation niqqud phase 2 and provenance URLs

**Requested:** Implement a second abbreviation-expansion niqqud tranche using an official-first source hierarchy, add provenance URLs for niqqud-bearing entries, and keep acronym tokens themselves unvowelized.

**Files changed:**
- `abbreviation-data.js` — Added shared official source URL constants, backfilled `expansionHeNiqqudSource` for the existing phase-1 entries, and added `expansionHeNiqqud` plus `expansionHeNiqqudSource` for the 24-entry phase-2 batch (`וכו׳`, `וכד׳`, `וגו׳`, `אחה״צ`, `לפנה״צ`, titles, measurement terms, `בי״ח`, `קופ״ח`, `ל״ד`, `ממ״ד`, `ממ״ק`, `ממ״מ`, `ר״ת`).
- `app/abbreviation.js` — Preserved the new provenance field when normalizing abbreviation entries into the playable deck, without changing visible runtime behavior.
- `tests/abbreviation-data.test.js` — Added explicit phase-2 coverage and a provenance invariant requiring every niqqud-bearing abbreviation expansion to carry a URL source.
- `tests/app-progress.test.js` — Added a phase-2 runtime regression proving the niqqud toggle still changes only the expanded Hebrew phrase and leaves the acronym token plain.
- `index.html` / `app.js` — Bumped cache-busting versions so browsers refresh the updated abbreviation data and runtime bundle.
- `task-log.md` — Appended this entry.

**Behavior changed:** Abbreviation mode now has a second safe niqqud tranche available on the Hebrew expansion side, and all niqqud-bearing abbreviation expansions now record the official source URL used for that batch. Acronym tokens remain unchanged with no niqqud added to the abbreviations themselves.

**Tests run:** `node --test tests/abbreviation-data.test.js` — passed, 5/5. `node --test tests/app-progress.test.js` — passed, 31/31. `node --test` — passed, 52/52.

**Risks / regressions to check:** The provenance field is currently stored only for niqqud-bearing abbreviation expansions, not for the entire abbreviation dataset. More politically or religiously loaded abbreviations were intentionally deferred so this pass stays anchored to stronger everyday/institutional source material.

---

### 2026-03-14 18:08 — Add Academy-backed institutional/legal abbreviation niqqud tranche

**Requested:** Find and implement another reliable abbreviation-expansion niqqud batch, keeping the source bar high and avoiding the more ambiguous political/religious leftovers.

**Files changed:**
- `abbreviation-data.js` — Added an 11-entry Academy-backed institutional/legal tranche with `expansionHeNiqqud` and exact `expansionHeNiqqudSource` URLs for `מע״מ`, `ת״ז`, `בע״מ`, `מנכ״ל`, `יו״ר`, `ביהמ״ש`, `בימ״ש`, `פס״ד`, `חו״ד`, `עו״ד`, and `רו״ח`.
- `tests/abbreviation-data.test.js` — Added an explicit phase-3 tranche test that requires this new batch to carry Academy `terms.hebrew-academy.org.il` provenance URLs.
- `tests/app-progress.test.js` — Added a runtime regression proving a phase-3 legal/institutional entry still keeps the acronym token plain while toggling niqqud only on the expanded Hebrew phrase.
- `index.html` / `app.js` — Bumped cache-busting versions so the refreshed abbreviation data loads consistently in the browser.
- `task-log.md` — Appended this entry.

**Behavior changed:** Abbreviation mode now includes a third, Academy-backed niqqud tranche for common institutional/legal abbreviations, while still leaving the acronym tokens themselves unvowelized.

**Tests run:** `node --test tests/abbreviation-data.test.js` — passed, 6/6. `node --test tests/app-progress.test.js` — passed, 32/32. `node --test` — passed, 54/54.

**Risks / regressions to check:** This batch intentionally stops short of entries like `ח״כ`, `רה״מ`, `עוסק מורשה`, `עוסק פטור`, and the more politically loaded or religious abbreviations, because those would require either mixed source families or a looser source standard than this pass used.

---

### 2026-03-15 10:14 — Strip Hebrew leakage from English-facing game text

**Requested:** Investigate why Hebrew was appearing inside English answer choices in the translation game, explain the cause, and make sure it cannot happen in any game.

**Files changed:**
- `app/utils.js` — Added `sanitizeEnglishDisplayText()` to remove Hebrew substrings and clean up the surrounding English punctuation/parentheticals instead of letting mixed-language source strings pass through raw.
- `app/hebrew.js` — Sanitized `word.en` during `prepareVocabulary()`, so translation, verb match, review, mastered lists, and most-missed views all consume cleaned English text from the normalized vocabulary layer.
- `app/abbreviation.js` — Sanitized abbreviation `english` values during deck preparation so English-side abbreviation prompts, options, and feedback cannot leak Hebrew notes from source data.
- `app/adv-conj.js` — Sanitized generated English sentences and idiom meaning strings so Advanced Conjugation English prompts/choices/feedback stay English-only even if an idiom source string contains Hebrew parentheticals.
- `tests/app-progress.test.js` — Added a cross-game regression proving Hebrew is stripped from English-facing text in translation, abbreviation, and advanced conjugation.
- `index.html` / `app.js` — Bumped cache-busting versions to refresh the updated JS modules in browsers.
- `task-log.md` — Appended this entry.

**Behavior changed:** Mixed-language English glosses in the source data are now sanitized before they reach gameplay UI. Legitimate Hebrew answers and prompts still display where they are supposed to; only English-facing strings are cleaned.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 33/33. `node --test tests/abbreviation-data.test.js` — passed, 6/6. `node --test` — passed, 55/55.

**Risks / regressions to check:** The sanitizer intentionally preserves English clarifiers while stripping Hebrew tokens, so spot-check a few data-heavy cards with parentheses/slashes to make sure the cleaned English still reads naturally.

---

### 2026-03-15 10:31 — Deduplicate visible answer-bank labels across games

**Requested:** After fixing Hebrew leakage in English answers, prevent any game from serving two identical visible answers in the same answer bank.

**Files changed:**
- `app/lesson.js` — Changed translation option building to dedupe by the label the learner actually sees: sanitized English in EN-choice rounds and plain Hebrew in HE-choice rounds. The bank now prefers same-category distractors first, but skips any candidate whose visible label duplicates an existing option.
- `app/abbreviation.js` — Changed abbreviation option building to dedupe by visible label too, so English-side abbreviation rounds cannot show two identical cleaned English choices.
- `app/verb-match.js` — Tightened pair selection to skip duplicate English-side card labels as well as duplicate Hebrew forms, preventing confusing repeated left-column cards.
- `tests/app-progress.test.js` — Added regressions for translation answer-bank dedupe in both directions, abbreviation English-choice dedupe, and verb-match English-card dedupe.
- `index.html` / `app.js` — Bumped cache-busting versions to refresh the updated client code.
- `task-log.md` — Appended this entry.

**Behavior changed:** Translation, abbreviation, and verb-match rounds now dedupe by the final label shown to the learner rather than only by entry ID. If duplicates collapse the candidate pool, the app prefers a smaller unique bank over repeated visible answers.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 36/36. `node --test` — passed, 58/58.

**Risks / regressions to check:** In rare small-category pools, a translation or abbreviation question may now render fewer than four options instead of showing duplicates. That is intentional, but it is worth spot-checking a few tiny categories live to make sure the reduced option count still feels okay.

---

### 2026-03-15 11:22 — Lay browser-TTS groundwork for spoken Hebrew

**Requested:** Start laying the groundwork for spoken Hebrew in the games, with a separate speech setting, answer-first playback, and the special "Hebrew first" behavior for the conjugation match game.

**Files changed:**
- `app/speech.js` — Added a shared browser-TTS module around `speechSynthesis`, including Hebrew-voice detection, support checks, payload building, voice priming, cancellation, and speech playback.
- `app/constants.js` / `app/persistence.js` / `app/bootstrap-runtime.js` / `app/i18n.js` / `app/controller.js` — Added a separate persisted speech preference (`ivriquest-speech-v1`), new runtime state, new toggle wiring, and a dedicated language-layer toggle separate from sound effects.
- `app/ui.js` / `index.html` / `app/bootstrap-data.js` — Added Speech toggles in home and settings UI, localized speech labels and the conjugation tip, plus a prompt-hint slot that appears only in conjugation when speech is enabled.
- `app/lesson.js` / `app/abbreviation.js` / `app/adv-conj.js` / `app/verb-match.js` — Added prompt/selection speech payload builders for future prompt audio, wired answer-first speech on Hebrew selections, and enforced the conjugation rule that only a first Hebrew-card selection speaks.
- `tests/app-speech.test.js` / `tests/app-progress.test.js` — Added shared speech-module unit coverage plus runtime regressions for speech persistence, unsupported browsers, translation/abbreviation/advanced-conjugation speech, and the conjugation "Hebrew first" rule.
- `app.js` / `index.html` — Registered the new speech module in the app bootstrap and bumped cache-busting versions for the changed JS bundle.
- `task-log.md` — Appended this entry.

**Behavior changed:** The app now has a separate Speech setting that uses browser TTS for Hebrew selections without changing submit behavior. Translation, abbreviation, and advanced conjugation can speak Hebrew answers on selection, and conjugation match only speaks when the Hebrew card is chosen first.

**Tests run:** `node --test tests/app-speech.test.js` — passed, 4/4. `node --test tests/app-progress.test.js` — passed, 42/42. `node --test` — passed, 68/68.

**Risks / regressions to check:** Browser speech support depends on the presence of a Hebrew voice, so the new toggle intentionally disables itself when no Hebrew voice is available. Abbreviation pronunciation is still best-effort in v1 because it speaks the visible acronym token until curated overrides are added later.

---

### 2026-03-15 11:49 — Add on-demand Hebrew prompt playback

**Requested:** Add a prompt-level option so whenever the prompt is Hebrew, the learner can click to hear it pronounced in Hebrew.

**Files changed:**
- `app/ui.js` / `app/controller.js` / `app/bootstrap-runtime.js` / `index.html` / `styles.css` — Added a dedicated prompt speech button on the prompt card, prompt-payload resolution, click handling, and lightweight prompt-action styling.
- `app/speech.js` — Added a `force` path so explicit prompt-button playback can work on demand even when automatic answer speech is turned off.
- `app/lesson.js` / `app/abbreviation.js` / `app/adv-conj.js` / `app/verb-match.js` — Reused the existing prompt speech payload builders so translation, abbreviation, advanced conjugation, and verb match can all expose Hebrew prompt playback through the shared button.
- `app/bootstrap-data.js` / `app.js` / `index.html` — Added localized prompt-button text and bumped cache-busting/build versions.
- `tests/app-speech.test.js` / `tests/app-progress.test.js` — Added coverage for forced prompt playback and for prompt-button visibility/click behavior in translation and conjugation.
- `task-log.md` — Appended this entry.

**Behavior changed:** When a round has Hebrew available in the prompt, the prompt card now shows a `Hear Prompt` button that reads the Hebrew aloud on demand. This is explicit prompt playback, so it works even if the automatic Speech setting is off; unsupported browsers still hide the control.

**Tests run:** `node --test tests/app-speech.test.js` — passed, 5/5. `node --test tests/app-progress.test.js` — passed, 44/44. `node --test` — passed, 71/71.

**Risks / regressions to check:** Verb match prompts are mixed English + Hebrew, so the button intentionally reads only the Hebrew verb portion. Prompt-button audio is manual and separate from automatic answer speech, so the two pathways should be spot-checked together on mobile Safari once before shipping.

---

### 2026-03-15 16:57 — Polish gameplay layout and replace prompt text button with inline speaker control

**Requested:** Tighten the gameplay shell spacing, make the prompt-audio control icon-only and inline, and give conjugation a cleaner, more intentional board layout without changing gameplay flow.

**Files changed:**
- `index.html` / `app/bootstrap-runtime.js` — Reworked the prompt card markup into a compact meta row plus content row and registered the sticky action bar in the runtime element registry.
- `app/ui.js` — Added lesson-shell mode hooks, prompt-card state hooks, sticky-action collapse handling, and converted the prompt speech control to an icon-only button with localized accessibility text.
- `app/lesson.js` / `app/abbreviation.js` / `app/verb-match.js` — Normalized prompt-label visibility so the shared shell can cleanly switch between standard quiz layouts and the conjugation board.
- `app/bootstrap-data.js` — Replaced the visible prompt-button copy with accessibility-only strings for the inline speaker control.
- `styles.css` — Tightened gameplay spacing, turned the session stats into compact metadata pills, styled the circular inline speaker button, and gave verb match a denser board-style prompt and column layout. Added an `is-empty` collapse state for sticky lesson actions.
- `tests/app-progress.test.js` / `app.js` / `index.html` — Updated regressions for the new icon-only prompt control, mode/layout hooks, and cache-busting/build versions.
- `task-log.md` — Appended this entry.

**Behavior changed:** The old `Hear Prompt` text button is now an inline circular speaker icon inside the prompt header. Translation, abbreviation, and advanced conjugation share a tighter prompt shell, while conjugation uses a more compact board-style header with the speech tip folded into the prompt metadata. Empty sticky action space no longer hangs around during active conjugation rounds.

**Tests run:** `node --test tests/app-speech.test.js` — passed, 5/5. `node --test tests/app-progress.test.js` — passed, 44/44. `node --test` — passed, 71/71.

**Risks / regressions to check:** The layout changes are structural, so the biggest real-world checks are visual: desktop verb match density, narrow mobile portrait wrapping in the status pills, and the inline speaker button’s tap target on iPhone/iPad Safari. Functionally the prompt button is unchanged, but a hard refresh is recommended because the prompt shell and module script URLs were cache-busted together.

---

### 2026-03-15 17:26 — Simplify prompt boxes and move conjugation hint out of the prompt card

**Requested:** Remove redundant prompt labels from translation, abbreviation, and conjugation gameplay, keep conjugation prompts centered, move the “Hebrew first” hint out of the prompt box, and stop the speaker icon from creating a separate vertical row.

**Files changed:**
- `index.html` — Simplified the prompt-card markup so the speaker button sits directly on the card and the hint renders as a separate support note below it.
- `app/ui.js` — Added a shared `renderPromptLabel()` helper, updated prompt-card state tracking, and kept the verb-match hint rendering separate from the prompt box.
- `app/lesson.js` / `app/abbreviation.js` / `app/adv-conj.js` / `app/verb-match.js` — Hid redundant in-game prompt labels for active rounds while keeping empty-state titles available where they are still useful.
- `styles.css` — Reworked the prompt shell again so the speaker icon is absolutely positioned in the corner, prompts stay centered, and the conjugation tip sits below the card instead of inside it.
- `tests/app-progress.test.js` / `app.js` / `index.html` — Updated the regressions for the hidden prompt label behavior and bumped build/cache versions again.
- `task-log.md` — Appended this entry.

**Behavior changed:** Translation no longer shows `Translate to Hebrew/English` inside the prompt card, abbreviation no longer shows `Abbreviation`, and conjugation no longer shows `Match the pairs` in the prompt box. The conjugation speech tip now sits outside the prompt card as a small support line, and the prompt speaker icon stays pinned to the card corner instead of using its own layout row.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 44/44. `node --test tests/app-speech.test.js` — passed, 5/5. `node --test` — passed, 71/71.

**Risks / regressions to check:** This pass is mainly spatial, so the important manual check is whether the prompt still feels centered with very long English prompts and whether the corner speaker button ever overlaps unusually long Hebrew on smaller phones. The cache-bust moved again, so a fresh tab is safer than relying on a live-reloading localhost tab.

---

### 2026-03-15 17:44 — Unify in-game header stat as a shared combo counter

**Requested:** Make the third in-game header stat consistent across modes by treating it as a combo counter rather than a mixed score/combo field, and make sure advanced conjugation does not inherit the previous game’s score total.

**Files changed:**
- `app/ui.js` — Split the old session counter responsibilities so the header now always displays a shared combo based on the current streak, while per-game score totals remain available for end-of-session summaries.
- `app/lesson.js` / `app/abbreviation.js` / `app/verb-match.js` / `app/adv-conj.js` — Updated game starts to reset only the per-game score tally and preserve the shared combo unless the learner breaks it with a wrong answer or explicitly ends the session.
- `app/bootstrap-data.js` / `index.html` — Added a shared `session.combo` label and updated the initial header placeholder from `Score` to `Combo`.
- `app.js` — Wired the new `resetSessionScore` helper through the bootstrap/export surface and bumped the build version.
- `tests/app-progress.test.js` — Added regressions proving the combo pill is uniform in lesson and conjugation, and that starting advanced conjugation resets the per-game score while preserving the shared combo.
- `task-log.md` — Appended this entry.

**Behavior changed:** The third stat pill during active gameplay is now always a combo counter, shown as `Combo xN`, across translation, abbreviation, advanced conjugation, and conjugation match. It follows the learner’s consecutive-correct streak across game starts instead of mixing in per-mode score semantics, while end-of-session results still use proper per-game scoring.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 46/46. `node --test` — passed, 73/73.

**Risks / regressions to check:** The main product decision here is that combo now survives starting a different game until the learner misses or explicitly exits/reset the session. If you want combo to reset when returning home between games, that’s an easy follow-up, but I left it continuous because that matches the “tracks between games” request most directly.

---

### 2026-03-15 17:54 — Remove conjugation column labels

**Requested:** Remove the `English` and `Hebrew` column labels from the conjugation board so the learner just sees the two card stacks.

**Files changed:**
- `app/verb-match.js` — Stopped rendering the column-title nodes above the left and right card stacks.
- `styles.css` — Removed the now-unused column-title styling.
- `task-log.md` — Appended this entry.

**Behavior changed:** Conjugation now shows the two matching columns without extra `English` / `Hebrew` headings, relying on the card content itself to make the distinction clear.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 46/46. `node --test` — passed, 73/73.

**Risks / regressions to check:** This is a small visual simplification, so the main manual check is just whether first-time users still immediately understand the board. The automated tests stayed green because no gameplay logic changed.

---

### 2026-03-15 17:58 — Keep conjugation columns fixed in Hebrew UI

**Requested:** Prevent the conjugation board from flipping columns in Hebrew UI so English always stays on the left and Hebrew always stays on the right.

**Files changed:**
- `app/verb-match.js` — Set the rendered match-column wrapper to `dir="ltr"` so the board order is explicit in the DOM.
- `styles.css` — Reinforced the match-column container with `direction: ltr` so the lesson shell’s Hebrew RTL mode cannot reverse the board.
- `tests/app-progress.test.js` — Added a regression proving Hebrew UI still renders an English left column and a Hebrew right column.
- `task-log.md` — Appended this entry.

**Behavior changed:** Conjugation now keeps the same left/right board layout in both English UI and Hebrew UI. Only the Hebrew card text remains RTL; the column order itself no longer flips with the overall page direction.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 47/47. `node --test` — passed, 74/74.

**Risks / regressions to check:** This is intentionally narrow, but it is worth eyeballing the Hebrew UI once on desktop and mobile to make sure the fixed LTR board still feels natural inside the otherwise RTL shell.

---

### 2026-03-15 18:20 — Add another Academy-backed abbreviation niqqud tranche

**Requested:** Add more niqqud to abbreviation expansions, prioritizing authoritative sources, and report what still remains afterward.

**Files changed:**
- `abbreviation-data.js` — Added exact-source `expansionHeNiqqud` and `expansionHeNiqqudSource` fields for `אג״ח`, `ני״ע`, `דו״ח`, and `מד״א`, using Academy terms pages.
- `tests/abbreviation-data.test.js` — Added a phase-4 tranche test to keep those new entries tied to Academy source URLs and unvowelized abbreviation tokens.
- `task-log.md` — Appended this entry.

**Behavior changed:** When niqqud display is enabled, those four abbreviation expansions now render with marked Hebrew while keeping the abbreviation token itself unchanged.

**Tests run:** `node --test tests/abbreviation-data.test.js` — passed, 7/7. `node --test` — passed, 75/75.

**Risks / regressions to check:** I intentionally left out nearby candidates like `ביהכ״נ` and `ביה״ד` in this pass because their dataset phrases include a definite article while the most direct Academy term pages surface the base construct forms. Those are still good next candidates, but they deserve a more explicit decision about whether we’re comfortable inferring the definite form from the authoritative base term.

---

### 2026-03-15 18:34 — Add a safe conjugation niqqud tranche for starter verbs

**Requested:** Add niqqud for conjugation-game verb forms where it can be done safely, and explain what still remains.

**Files changed:**
- `hebrew-verbs.js` — Added stored niqqud for the full present/past/future paradigms of `לסגור`, `לפתוח`, `לכתוב`, and `לשמור`, and fixed form normalization so string-backed stored forms preserve separate plain and marked values instead of collapsing them together.
- `tests/hebrew-verbs.test.js` — Added regressions proving those starter verbs now carry marked Hebrew across all learner-facing forms in the conjugation deck and that string-backed stored forms like `לשחרר` keep distinct plain/niqqud values.
- `task-log.md` — Appended this entry.

**Behavior changed:** When inline niqqud is enabled, conjugation cards for those four starter verbs now render marked Hebrew instead of plain consonantal forms, and existing stored marked forms like `לשחרר` now surface correctly in the game instead of being flattened to plain text.

**Tests run:** `node --test tests/hebrew-verbs.test.js` — passed, 14/14. `node --test` — passed, 77/77.

**Risks / regressions to check:** I intentionally stopped short of trying to mark the entire conjugation deck in one pass. The deck currently contains 28 study items and 584 visible forms, and while all current items are stored as authoritative in-repo, only a subset had trusted niqqud available immediately. I limited this pass to four fully regular starter verbs that I could verify cleanly from direct conjugation tables rather than guessing my way across all remaining irregular paradigms.

---

### 2026-03-15 18:48 — Extend starter conjugation niqqud to another safe regular tranche

**Requested:** Add more niqqud to conjugation-game verb forms, taking on only what feels safe.

**Files changed:**
- `hebrew-verbs.js` — Added stored infinitive niqqud plus full present/past/future marked forms for `ללמוד`, `לאכול`, `לעבוד`, and `לגור`, and taught study-word prompts to use a stored marked lemma when one exists.
- `tests/hebrew-verbs.test.js` — Extended the starter-verb niqqud regression to cover the new four verbs and added a prompt-side regression proving starter infinitives can now expose distinct `heNiqqud`.
- `task-log.md` — Appended this entry.

**Behavior changed:** When inline niqqud is enabled, the conjugation deck now shows marked Hebrew across all learner-facing forms for those four additional starter verbs, and the infinitive prompt itself can surface marked Hebrew where a verb entry now stores `lemma_niqqud`.

**Tests run:** `node --test tests/hebrew-verbs.test.js` — passed, 15/15. `node --test` — passed, 78/78.

**Risks / regressions to check:** I still kept this pass on the “direct table” side of the line. These four are regular starters I could verify cleanly from Pealim conjugation tables; I intentionally left the irregular starters and the remaining unmarked regular items alone rather than fill them by pattern or memory.

---

### 2026-03-15 19:02 — Add a larger verified conjugation niqqud tranche for starter verbs

**Requested:** Add more conjugation niqqud.

**Files changed:**
- `hebrew-verbs.js` — Added stored infinitive niqqud plus full present/past/future marked forms for `לשתות`, `לשחק`, `לבוא`, `לקחת`, `לשים`, `ללכת`, `לעמוד`, and `לשבת`.
- `tests/hebrew-verbs.test.js` — Extended starter-verb niqqud coverage with representative learner-facing forms from each newly marked verb and switched the prompt-side regression to an irregular infinitive (`לבוא`) so both regular and irregular prompt niqqud paths stay covered.
- `task-log.md` — Appended this entry.

**Behavior changed:** The conjugation deck now exposes marked Hebrew across all learner-facing forms for eight additional starter verbs, including several high-frequency irregulars, and their infinitive prompts can also surface stored niqqud.

**Tests run:** `node --test tests/hebrew-verbs.test.js` — passed, 15/15. `node --test` — passed, 78/78.

**Risks / regressions to check:** This is still a verified-table pass, not a full sweep. I used direct Pealim conjugation tables for each of these verbs and deliberately left the remaining unmarked items alone rather than infer them from memory or pattern.

---

### 2026-03-15 19:14 — Finish learner-facing conjugation niqqud coverage

**Requested:** Add more conjugation niqqud.

**Files changed:**
- `hebrew-verbs.js` — Added stored infinitive niqqud plus marked present/past/future forms for the remaining learner-facing deck entries: `להיות`, `לראות`, `לתת`, `להגיד`, `לכבות`, and `לצנן`.
- `tests/hebrew-verbs.test.js` — Extended representative starter-form assertions to the newly marked verbs and added a deck-level regression proving every learner-facing conjugation form now exposes niqqud.
- `task-log.md` — Appended this entry.

**Behavior changed:** The full conjugation deck now renders marked Hebrew on every learner-facing form when inline niqqud is enabled, including the remaining irregular starter verbs and the two multi-sense cooking verbs.

**Tests run:** `node --test tests/hebrew-verbs.test.js` — passed, 16/16. `node --test` — passed, 79/79.

**Risks / regressions to check:** This pass completes the current deck, but it still depends on the curated verb inventory staying in sync. If we add new conjugation entries later, they will need either stored niqqud or an explicit review step before we can preserve the “full deck is marked” guarantee.

---

### 2026-03-15 19:38 — Anchor quiz feedback below the action row and finish conjugation prompt niqqud

**Requested:** Finish prompt-side niqqud for the remaining conjugation prompts and move quiz feedback into a polished anchored tray below the action buttons, while keeping conjugation free of per-answer feedback.

**Files changed:**
- `hebrew-verbs.js` — Added stored infinitive niqqud for the remaining plain prompt lemmas: `לסגור`, `לפתוח`, `לכתוב`, `לשמור`, `לשחרר`, `למחוץ`, and `למעוך`.
- `index.html` — Replaced the old inline feedback paragraph with a structured lesson footer containing the sticky action row plus a dedicated feedback tray, and bumped asset versions to `20260315i`.
- `app.js` — Updated the build stamp to `20260315i` so the new frontend assets invalidate cleanly.
- `app/bootstrap-runtime.js` — Registered the new lesson footer and feedback tray DOM nodes.
- `app/bootstrap-data.js` — Replaced short feedback labels with sentence-based translation, abbreviation, and advanced-conjugation feedback copy in both English and Hebrew.
- `app/ui.js` — Switched the feedback API from a plain string to `{ tone, sentence, detail }`, routed rendering through the new tray, simplified Hebrew answer display, and made footer visibility depend on actionable buttons or quiz-mode feedback.
- `styles.css` — Added the anchored feedback tray styling and moved sticky behavior to the shared lesson footer so the button row stays fixed while feedback reveals underneath it.
- `app/lesson.js` — Converted translation feedback to complete-sentence tray messages.
- `app/abbreviation.js` — Converted abbreviation feedback to complete-sentence tray messages and added a detail line for expansion text in `en2he`.
- `app/adv-conj.js` — Converted advanced-conjugation feedback to complete-sentence tray messages.
- `app/verb-match.js` — Removed feedback-tray usage from conjugation flows so the mode stays quiet and relies on card state plus progression only.
- `tests/hebrew-verbs.test.js` — Added a deck-level regression proving every conjugation prompt surface now exposes stored infinitive niqqud.
- `tests/app-progress.test.js` — Added footer-tray, structured-feedback, and no-feedback-in-conjugation regressions and updated existing feedback assertions to the new tray structure.

**Behavior changed:** Translation, Abbreviation, and Advanced Conjugation now reveal complete-sentence feedback in a dedicated tray below the `Submit` / `Next` buttons, so the action row no longer jumps when feedback appears. Conjugation remains feedback-free at the textual layer, while its prompt infinitives now render with niqqud consistently when inline niqqud is enabled.

**Tests run:** `node --test tests/hebrew-verbs.test.js` — passed, 16/16. `node --test tests/app-progress.test.js` — passed, 50/50. `node --test` — passed, 82/82.

**Risks / regressions to check:** The new tray intentionally does not render in conjugation mode. If we later want round-complete messaging there, it should be designed as a separate progression surface rather than reusing per-answer quiz feedback.

---

### 2026-03-15 19:49 — Always show full Hebrew expansions in abbreviation feedback

**Requested:** Make sure abbreviation-game feedback always shows the full Hebrew of the abbreviation.

**Files changed:**
- `app/bootstrap-data.js` — Updated the shared abbreviation feedback detail copy to explicitly surface the full Hebrew expansion in English and Hebrew UI.
- `app/abbreviation.js` — Attached the expansion detail line for abbreviation feedback in both `he2en` and `en2he`, while still respecting the niqqud toggle for the Hebrew expansion text.
- `tests/app-progress.test.js` — Updated existing abbreviation feedback assertions and added a regression proving both directions now include the full Hebrew expansion.

**Behavior changed:** Abbreviation feedback now always includes the full Hebrew expansion below the main sentence, regardless of whether the player was translating from the abbreviation to English or from English back to the abbreviation.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 51/51. `node --test` — passed, 83/83.

**Risks / regressions to check:** This keeps the main abbreviation sentence concise and puts the full Hebrew in the detail line. If we later want even denser feedback, the next step would be to decide whether the expansion should move into the sentence itself or stay as a second line.

---

### 2026-03-15 19:57 — Add colloquial-meaning detail lines to Advanced Conjugation feedback

**Requested:** In Advanced Conjugation, use the second feedback line to explain the colloquial meaning of non-literal expressions.

**Files changed:**
- `app/bootstrap-data.js` — Added localized detail-line copy for colloquial-meaning feedback in English and Hebrew UI.
- `app/adv-conj.js` — Stored idiom meaning metadata on generated questions and attached a detail line to quiz feedback only when the idiom is explicitly marked with `showMeaning`.
- `tests/app-progress.test.js` — Added a regression proving marked idioms surface the colloquial meaning in the feedback detail line and literal-only idioms do not.

**Behavior changed:** Advanced Conjugation feedback now mirrors the abbreviation tray pattern: the main bold sentence still gives the correct answer, and the lighter detail line explains the colloquial meaning for idioms that are marked as needing that extra explanation.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 52/52. `node --test` — passed, 84/84.

**Risks / regressions to check:** This is intentionally driven by the existing `showMeaning` flag, so any idiom that should surface a colloquial explanation but is not marked yet will stay on the single-line feedback path until its data is updated.

---

### 2026-03-15 20:16 — Add hidden missed-word refocus weighting to translation

**Requested:** Add a hidden gameplay mechanic that skews translation vocab toward previously missed words, then drop that skew completely after five correct recoveries in a row.

**Files changed:**
- `app/constants.js` — Added tuning constants for the hidden translation miss-recovery system.
- `app/data.js` — Added per-record translation recovery streak tracking, a hidden missed-word bias multiplier, and wired that multiplier into the translation word picker so previously missed words get extra weight until they recover.
- `app/lesson.js` — Marked translation progress updates and translation word selection explicitly as translation-mode operations.
- `app/abbreviation.js` — Marked abbreviation progress updates separately so they do not affect the translation miss-recovery mechanic.
- `tests/app-progress.test.js` — Added regressions proving the hidden recovery streak resets on misses, caps at five, and fully neutralizes the extra selection bias after recovery.
- `index.html`, `app.js` — Bumped frontend asset versions to `20260315j`.

**Behavior changed:** Translation mode now quietly leans toward words the learner has previously missed, but that extra focus fades as the learner gets those words right again and disappears completely once a word has been answered correctly five translation times in a row after being missed.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 54/54. `node --test` — passed, 86/86.

**Risks / regressions to check:** This is intentionally a soft weighting rather than a hard override, so domain balancing and due-word scheduling still matter. If you later want the game to feel more or less aggressive about resurfacing misses, the two new constants are the safest tuning points.

---

### 2026-03-15 21:05 — Add a moderate three-tier typography scale for desktop, tablet, and phone

**Requested:** Increase text size and related spacing across desktop, iPad, and iPhone without going to a maximal scale, and stop iPad from inheriting the same compressed typography as phone layouts.

**Files changed:**
- `styles.css` — Added a moderate desktop/base typography lift across gameplay, review, dashboard, settings, results, and navigation; split the old `max-width: 1023px` mobile block into separate tablet (`768px–1023px`) and phone (`<=767px`) tiers; and softened the short-height phone override so it preserves readable minimum text sizes.
- `index.html`, `app.js` — Bumped frontend asset versions to `20260315k` so the refreshed browser picks up the new typography and spacing rules immediately.

**Behavior changed:** The app now uses a clearer three-tier responsive type system. Desktop gets a modest overall lift, iPad no longer uses the phone-compressed scale, and phones keep a compact layout without shrinking gameplay text back to the old tiny sizes on shorter screens. Prompt text, answer buttons, match cards, review analytics, dashboard tiles, settings controls, and navigation labels all use space more generously while preserving the existing structure and interaction flow.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 54/54. `node --test tests/app-speech.test.js` — passed, 5/5. `node --test` — passed, 86/86.

**Risks / regressions to check:** This pass intentionally increases text and padding together, so the main things to watch in the browser are long Hebrew prompt wrapping, prompt-speaker-button overlap, and whether any especially dense gameplay states feel a little too tall on the smallest phones. If any one screen feels slightly overgrown, it should be trimmed by reducing local padding before shrinking the shared scale back down.

---

### 2026-03-15 21:34 — Move gameplay titles into the top banner and simplify result metrics

**Requested:** Reclaim vertical space during gameplay by moving the current game title out of the lesson box and into the top banner, remove unnecessary mobile gameplay scrolling when everything already fits on screen, and trim results metrics so the mobile end pages can safely use a single three-card row.

**Files changed:**
- `index.html` — Added dedicated IDs for the top banner title and lesson-stage title row, and bumped frontend asset versions to `20260315l`.
- `app/bootstrap-runtime.js` — Registered the new top-banner title and lesson-title-row elements.
- `app/ui.js` — Added a shared gameplay-route detector, routed active game titles into the top banner, hid the in-stage lesson title row during active gameplay, exposed a `data-gameplay-active` body state, and simplified summary metrics down to score, accuracy, and time for all four games.
- `styles.css` — Added gameplay-active topbar styling, hid the in-stage lesson title row during active play, locked the mobile/tablet gameplay viewport to prevent stray scrolling, and tuned the results metric grid so the end pages can render as a single three-card row on smaller screens.
- `tests/app-progress.test.js` — Added regressions covering the new top-banner gameplay title behavior and the three-metric summary layout contract.

**Behavior changed:** During active gameplay, the top banner now shows the current game name and the lesson box no longer spends vertical space on a duplicate title row. On tablet and phone, gameplay now uses a cleaner locked viewport instead of allowing minor extra scrolling when the full lesson already fits onscreen. Translation, Abbreviation, Conjugation, and Advanced Conjugation results now all use the same three summary boxes: score, accuracy, and time.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 56/56. `node --test tests/app-speech.test.js` — passed, 5/5. `node --test` — passed, 88/88.

**Risks / regressions to check:** The mobile/tablet viewport lock assumes the active gameplay shells fit within the available height after the reclaimed title space. The main manual QA follow-up is checking especially long prompt/feedback combinations on smaller phones to confirm nothing important is clipped now that stray scrolling is suppressed.

---

### 2026-03-15 21:49 — Refine the gameplay banner title and remove the over-strong mobile height lock

**Requested:** Put the active game title beside `IvritElite` in the top banner instead of replacing the app name, and fix the mobile gameplay dead space / possible fourth-answer clipping.

**Files changed:**
- `index.html` — Split the top banner into a persistent app title plus a separate gameplay title label, and bumped frontend asset versions to `20260315m`.
- `app/bootstrap-runtime.js` — Registered the new banner game-title element.
- `app/ui.js` — Kept the app title fixed as `IvritElite`, routed the active game name into the new secondary banner label, and hid that label outside gameplay.
- `styles.css` — Styled the banner game-title label as a smaller inline companion to the app name, and removed the aggressive tablet/phone gameplay height-lock rules that were stretching the lesson shell and clipping content.
- `tests/app-progress.test.js` — Updated the gameplay-banner regression to cover the new paired-title behavior.

**Behavior changed:** The top banner now reads as `IvritElite` plus the current game label, rather than swapping the app name out entirely. On mobile and tablet, gameplay no longer forces the lesson shell to fill the entire available height, which fixes the dead space at the bottom of the lesson card and prevents the last answer from being clipped under the action area.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 56/56. `node --test tests/app-speech.test.js` — passed, 5/5. `node --test` — passed, 88/88.

**Risks / regressions to check:** This follow-up intentionally relaxes the earlier anti-scroll lock, so the remaining manual QA item is simply confirming whether the original light mobile scroll is now gone naturally after the stretching fix. If any tiny residual scroll remains, it should be addressed with lighter padding tuning rather than another full-height lock.

---

### 2026-03-15 21:58 — Push the gameplay title to the far side of the banner and promote it visually

**Requested:** Align the active game title to the opposite side of `IvritElite` and make it feel more prominent.

**Files changed:**
- `styles.css` — Made the banner row stretch to full width, kept the logo and `IvritElite` grouped, pushed the active game title to the far edge with auto spacing that respects LTR/RTL direction, and promoted the game title with stronger serif typography and brand-colored styling.
- `index.html`, `app.js` — Bumped frontend asset versions to `20260315n`.

**Behavior changed:** During gameplay, the banner now reads as a two-sided header: `IvritElite` stays anchored on its natural side and the active game name sits on the opposite side, with directionality handled naturally by the English/Hebrew UI mode. The game name is now styled as a true header companion rather than a small metadata tag.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 56/56. `node --test tests/app-speech.test.js` — passed, 5/5. `node --test` — passed, 88/88.

**Risks / regressions to check:** The main manual QA item is checking very narrow phone widths in Hebrew to confirm the app title and game title still sit comfortably on one line. If that feels too tight, the safest next step would be trimming the inter-title gap slightly before shrinking either title.

---

### 2026-03-15 23:03 — Fix light-mode gameplay pill contrast and feedback readability

**Requested:** Improve the light-mode appearance of the three gameplay status pills and make positive/negative feedback readable. Follow-up: cover the conjugation prompt box as part of the same light-mode cleanup.

### 2026-03-30 14:25 — Relax unnecessary advanced-conjugation gender cues and fix Hebrew prompt font fallback

**Requested:** In advanced conjugation, avoid specifying subject gender when the Hebrew conjugation does not actually distinguish it; also investigate a GitHub Pages glitch where Hebrew prompt text appears in the wrong font.

**Files changed:**
- `app/adv-conj.js` — Added subject-label collapsing so advanced-conjugation English prompts drop trailing gender qualifiers when another subject with the same stripped label shares the exact same Hebrew verb form for that tense.
- `styles.css` — Explicitly set Hebrew prompt text to use `Assistant` so prompt headings no longer inherit the global `Alegreya` serif heading font and fall back inconsistently across operating systems.
- `index.html` — Bumped the stylesheet and advanced-conjugation script asset versions so GitHub Pages serves the updated CSS/JS instead of a cached copy.
- `tests/app-progress.test.js` — Updated advanced-conjugation expectations to preserve singular/plural object cues while omitting unnecessary subject gender, and added a style regression locking Hebrew prompt text to `Assistant`.

**Behavior changed:** Advanced-conjugation prompts now say things like `they opened your (sg.) eyes` when the Hebrew past/future plural form is shared across masculine and feminine subjects, while still keeping gender when the present-tense conjugation actually distinguishes it. Hebrew prompts across the app now render with the same sans-serif Hebrew font consistently instead of picking up a system-dependent fallback from the serif heading stack.

**Root cause found:** The font glitch was not a GitHub Pages-only issue. Prompt text is rendered in an `h3`, and the global `h1/h2/h3` rule assigned `Alegreya`. Hebrew prompts were not overriding that heading font, so browsers fell back to different Hebrew-capable fonts depending on platform. The explicit `Assistant` override fixes that inconsistency.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 102/102. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** Manual QA should confirm the live Pages build has picked up the new asset versions and that Hebrew prompts now match the rest of the interface visually on both macOS and Windows. For advanced conjugation, the main behavior to spot-check is plural past/future prompts where masculine/feminine forms collapse to the same Hebrew surface.

---

### 2026-03-29 18:05 — Default-collapse desktop side panels, fix touch drag, and reset second-chance progress bars

**Requested:** Keep the desktop `Review` and `Settings` panels minimized by default, push the latest local batch, make sentence-builder dragging work on mobile/tablet, remove the desktop-only endgame `Review Performance` action, and reset the gameplay progress bar to track second-chance rounds specifically instead of staying full.

**Files changed:**
- `app/controller.js` — Changed desktop hub panel defaults so `Review` and `Settings` start collapsed on desktop until the user explicitly toggles them, while keeping mobile panels expanded.
- `app/sentence-bank.js` — Added touch-driven sentence-builder drag/drop support using touch start/move/end with slot detection, plus tap-suppression after a successful touch drop so mobile/tablet dragging no longer falls back into accidental taps.
- `app/ui.js` — Hid the results `Review Performance` action on desktop only and changed lesson/sentence-builder second-chance progress bars to use `current/total` review progress rather than forcing the bar to 100%.
- `sentence-bank-data.js` — Compacted `at all` into a single chip for the `בכלל` entry and added a phrase-sized distractor.
- `styles.css` — Kept the desktop results action row balanced when the review button is hidden.
- `index.html` — Bumped cache-busting asset versions for the updated CSS, sentence-bank data, sentence-builder logic, UI, and controller files.
- `tests/app-progress.test.js`, `tests/sentence-bank-data.test.js` — Added regressions for touch dragging, desktop-collapsed defaults, mobile-only review action visibility, second-chance progress tracking, `wait up` distractor filtering, and `at all` phrase chunking.

**Behavior changed:** On desktop, the side panels now start minimized to reduce clutter, and the results screen keeps only `Play Again` and `Back to Home`. On mobile/tablet, sentence-builder words can now be dragged by touch into blanks and occupied slots the same way they can with a mouse. During second-chance review rounds, the progress bar resets and advances through the review queue instead of staying full. The English chip `at all` now appears as one selectable unit for `בכלל`, and `wait up` is no longer offered as a distractor against `חכה`.

**Tests run:** `node --test tests/app-progress.test.js tests/sentence-bank-data.test.js tests/hebrew-verbs.test.js` — passed, 139/139. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** Manual QA should confirm touch dragging feels natural on an actual phone/tablet browser, especially when dragging onto occupied slots, and that the desktop collapsed-by-default panels still feel discoverable now that they open only on explicit user action.

---

**Files changed:**
- `styles.css` — Added light-theme overrides for gameplay status pills, conjugation prompt-card surface, success/error card text, and the full feedback tray so light mode now uses pale tinted surfaces with dark readable text instead of inheriting dark-mode treatments.
- `index.html`, `app.js` — Bumped frontend asset versions to `20260315o`.

**Behavior changed:** In light mode, the three top status pills now read as intentional blue-gray controls instead of muddy dark capsules. The feedback tray now uses readable light success/error/info surfaces with strong sentence/detail contrast, and conjugation prompt cards no longer retain a dark-mode background in light theme.

**Tests run:** `node --test tests/app-progress.test.js` — passed, 56/56. `node --test tests/app-speech.test.js` — passed, 5/5. `node --test` — passed, 88/88.

**Risks / regressions to check:** Manual QA should confirm the success/error tint balance still feels calm in light mode and that the updated card-state text colors remain readable across translation, abbreviation, advanced conjugation, and conjugation.

---

### 2026-05-03 10:48 — Add Bubble Conjugation as a separate game mode

**Requested:** Add a creative bubble-based twist on the conjugation game where English and Hebrew conjugation bubbles float up and pop when matched, while keeping the existing two-column Conjugation game available as its own selectable mode and preserving Hebrew-first speech playback.

**Files changed:**
- `index.html` — Added `Bubble Conjugation` tiles to both lesson pickers and bumped cache-busting versions for changed CSS/runtime files.
- `app/bootstrap-data.js` — Added English/Hebrew labels, prompts, session titles, and summary title for the new bubble mode.
- `app/bootstrap-runtime.js` — Registered the new bubble-mode buttons and added persisted match `layoutMode` state.
- `app/controller.js` — Wired `verbBubble` start/continue/next handling while leaving `verbMatch` routed to the original Conjugation mode.
- `app/session.js`, `app/persistence.js` — Persisted/restored the match layout and treated bubble conjugation as a distinct active match session.
- `app/ui.js` — Taught shared gameplay header, prompt speech, prompt hints, shell classes, and home tile highlighting about the new `verbBubble` mode.
- `app/verb-match.js` — Reused the existing conjugation matching/progress/speech logic, added `startVerbBubbleMatch`, and added a bubble renderer with unique floating slots, pop/mismatch states, and a smaller visible bubble set that refills as pairs are matched.
- `styles.css` — Added the bubble stage, floating bubble visuals, pop/float animations, theme variants, and responsive sizing while leaving classic match-column styling in place.
- `app/lesson.js`, `app/sentence-bank.js`, `app/abbreviation.js`, `app/adv-conj.js` — Cleared the bubble-grid class when switching into other modes.
- `tests/app-progress.test.js` — Added regression coverage that bubble conjugation is a separate selectable mode, renders mixed floating bubbles, still speaks Hebrew-first selections, and does not replace classic two-column Conjugation.

**Behavior changed:** The home lesson picker now includes `Bubble Conjugation` in addition to the original `Conjugation`. Bubble Conjugation shows English and Hebrew forms as floating bubbles in a water-like stage; correct matches pop and replacement bubbles surface. Choosing a Hebrew bubble before an English bubble still triggers Hebrew speech. The existing Conjugation game remains the two-column version.

**Tests run:** `npm test` — passed, 173/173 before changes. `node --test tests/app-progress.test.js` — passed, 109/109 after adding the focused bubble regression. `npm test` — passed, 174/174 after implementation. `git --no-pager diff --check -- .` — passed. Browser smoke: `python3 -m http.server 8083`, loaded `http://127.0.0.1:8083/` and `http://localhost:8083/` in the in-app browser, confirmed the Bubble Conjugation tile starts the new bubble mode and the page renders without console errors.

**Risks / regressions to check:** Manual QA should spend a few minutes on very narrow mobile widths and during longer bubble sessions, watching for bubble overlap after many refills. The mode reuses the existing match state, so the main behavioral risk is restored in-progress sessions with old bubble positions; the renderer now normalizes visible slots, but a refresh during active gameplay is worth spot-checking.

---

### 2026-03-29 15:52 — Replace the desktop sidebar with a live three-column hub and fix Hebrew progress direction

**Requested:** Rework desktop so Home/Review/Settings are no longer separate pages behind a sidebar, but instead appear as three live columns with Review on the left and Settings on the right in English; fix the top-right time/combo pill icon styling; make the progress bar behave correctly in Hebrew; and call out anything that could get messy with this implementation.

**Files changed:**
- `index.html` — Removed the old desktop sidebar markup entirely, switched the gameplay pill to emoji clock/fire icons, and bumped the stylesheet asset version so the new desktop shell and progress tweaks refresh cleanly.
- `app/ui.js` — Updated route visibility so desktop widths show Home, Review, and Settings together whenever results are not active, while keeping Results as a full-width takeover state and mirroring the side-column order in Hebrew.
- `app/controller.js` — Added a resize-driven re-render hook so the app can move cleanly between stacked and three-column layouts without requiring a reload.
- `styles.css` — Replaced the desktop shell/sidebar layout with a three-column page grid, narrowed the Settings column relative to Home/Review, removed obsolete sidebar-only styling, forced the gameplay pill to remain LTR for emoji/time/combo readability, and made the progress-fill tip anchor on the logical leading edge in Hebrew.
- `tests/app-progress.test.js` — Added regressions for the three-column desktop layout, the combined desktop route visibility, and right-to-left progress fill behavior, then refreshed the sidebar cleanup assertion so it checks that the dead sidebar markup is actually gone.

**Behavior changed:** On desktop, the app now behaves like a single dashboard: Review stays visible on the left, the active game or lesson picker lives in the center, and Settings stays visible on the right, including during gameplay. The old desktop sidebar is gone rather than merely hidden. The gameplay status pill now uses readable emoji icons, and Hebrew progress bars fill from the right with the glowing tip leading correctly from that side.

**Tests run:** `node --test tests/app-progress.test.js tests/sentence-bank-data.test.js tests/hebrew-verbs.test.js` — passed, 130/130. `git diff --check -- . ':(exclude).claude'` — passed.

**Risks / regressions to check:** The main thing to watch is desktop density near the `1024px` breakpoint, where the three-column hub has much less horizontal slack than before; if anything feels cramped there, the safest next adjustment is widening the breakpoint or slightly loosening the center/side column ratio rather than reintroducing hidden navigation. The other semantic change is intentional but important: on desktop, `review` and `settings` are no longer standalone destinations during normal use, so results is now the main full-screen route takeover.

---

### 2026-06-20 13:26 — Vocab cleanup (compound truncations), two new verbs, food/pharmacy categories, ייעוד

**Requested:**
1. Translation game tests the compound "immigration office" instead of just "immigration" — switch it to plain "immigration"; and אחסון ("storage") is only tested inside compounds, never alone. Flag other compounds worth truncating.
2. Add the verbs **לארח** (to host) and **להשתמש** (to use) to the conjugation game.
3. Add basic food / nutrition / grocery / restaurant / pharmacy vocabulary, including specific user-named words (clarified in-session: קיק = castor oil שמן קיק; "סדין" was a typo for **סידן** = calcium; שלוק = a gulp + לגימה = a sip).
4. Add **ייעוד** to the translation game and suggest other gaps.

**Files changed:**
- `vocab-data.js`:
  - `bureaucracy`: replaced `["immigration office", "רשות ההגירה", …]` with `["immigration", "הגירה", "הַגִּירָה"]`; added standalone `["procedure / process", "הליך", "הֲלִיךְ"]` (kept "legal proceeding" הליך משפטי).
  - `home_everyday_life`: added standalone `["storage", "אחסון", "אִחְסוּן"]` (kept storage container/compartment compounds).
  - `work_business`: added standalone `["appointed time / due date", "מועד", "מוֹעֵד"]` (next to "deadline" מועד אחרון) and `["capital", "הון", "הוֹן"]` (next to "equity" הון עצמי — both live in work_business). Per user, did NOT add a standalone ביטוח (kept "health insurance" compound only).
  - `abstract_philosophy`: added `["vocation / purpose", "ייעוד", "יִיעוּד"]`.
  - Added two new `CATEGORY_META` entries + two new `RAW` arrays (both `defaultSelected: true`), appended at the end so existing categories' `categoryIndex`/utility scores are unchanged: **`groceries_food`** "Groceries & Food" (80 entries: produce, proteins incl. סרדין, dairy, bakery/grains, pantry/condiments, beverages, grocery/restaurant navigation incl. לגימה "a sip" + שלוק "a gulp/swig") and **`pharmacy_personal_care`** "Pharmacy & Personal Care" (35 entries: OTC meds, supplements incl. סידן calcium + שמן קיק castor oil, personal-care/toiletries). Skipped 3 words already present elsewhere (receipt, thermometer, bandage).
- `hebrew-verbs.js`: appended two curated verb entries inside `buildStarterVerbEntries()` after `advanced-verb-lehitkayem`:
  - `advanced-verb-learach` — לארח, binyan piel (guttural middle radical ר + final guttural ח), full curated present/past/future/imperative.
  - `advanced-verb-lehishtamesh` — להשתמש, binyan hitpael (sibilant metathesis הִשְׁתַּ-), full curated forms; note that it takes ב־.

**Behavior changed:** Translation game now surfaces standalone הגירה / אחסון / הון / מועד / הליך / ייעוד plus ~115 new food & pharmacy words (auto-included since the pool is all translation-available, non-mastered vocab sorted by utility — there is no per-category picker UI). "immigration office" no longer appears. Conjugation game now includes לארח and להשתמש.

**Tests run:** `npm test` — 168/168 before, 168/168 after. Node data checks: `getBaseVocabulary()` → 1180 words, 0 duplicate ids, all new entries present with correct categories; `getSeedVerbEntries()` → 33 verbs, both new verbs validate via `normalizeAndValidateFormSet`/`resolveLearnerFacingForms`, `buildVerbConjugationDeck` → 36 cards, 0 errors. Browser smoke (npx serve :3000): both files load with no console errors; Translation round rendered with a new entry live ("sunscreen / קרם הגנה"); Conjugation game rendered verb forms correctly.

**Risks / regressions to check:** (1) Niqqud accuracy on the ~115 new vocab entries and the two verbs' full paradigms (gutturals in לארח; hitpa'el in להשתמש) — worth a native-speaker spot-check. (2) A few glosses were disambiguated to avoid collisions ("appointed time / due date" for מועד vs existing "appointment"=תור; "pepper (bell)", "iron (mineral)", "hair conditioner", "body lotion"). (3) The two new categories sort lowest by utility (appended last), so their words appear less frequently than older high-utility entries — expected, not a bug.

**Suggested gaps not yet added (awaiting user):** other abstract/standalone words such as היתכנות (feasibility), כדאיות (viability), נחישות (determination), התמדה (perseverance), משילות (governance), היערכות (readiness), זמינות (availability).

---

### 2026-06-20 14:07 — Translit cleanup, sentence-bank chunking pass, results 2-col grid, binyan difficulty removal

**Requested:**
1. Stop testing "determinism" and "dividend" in the translation game; find other translations that are actually transliterations and remove them.
2. Quality/consistency pass over the Sentences game's English word-block joinings — some blocks over-combine, many don't combine at all when they should (e.g. תחליט split into "Make"/"up"/"your"/"mind"; "are you"/"with us" should be joined).
3. Stop using "What's new" as a distractor for מה נסגר ("What's going on") in colloquial_01 — unfair near-synonym.
4. Render end-of-game error lists as a 2-column grid on all devices for the abbreviation and translation games.
5. Binyan board: remove the easy/medium/hard ratings entirely and serve roots randomly; lay roots out as an even 2×3 / 3×2 grid by device.

**Files changed:**
- `vocab-data.js` — Removed 4 pure transliteration entries: `dividend` (דיבידנד, finance), `determinism` (דטרמיניזם), `epistemology` (אפיסטמולוגיה), `metaphysics` (מטאפיזיקה) (all philosophy_intellectual_expanded). Kept genuinely native words (morality/מוסר) and established loanwords (ethics/אתיקה, algorithm/אלגוריתם, strategy/אסטרטגיה, etc.). Vocab count 1180 → 1176.
- `sentence-bank-data.js` — Rechunked the English token banks of 30 over-fragmented entries into natural phrase chips and gave them phrase-sized distractors (e.g. colloquial_16 → "Well" / "are you" / "coming" / "with us" / "or not" / "Make up your mind" / "already"). Replaced colloquial_01's "What's new" distractor with "What's the plan" (parallel shape, clearly-distinct meaning). Hebrew tokens/distractors left untouched per the request (English only). All 70 entries still pass the token-alignment frame check.
- `app/ui.js` — `renderSummaryState()`: add a `results-mistakes--grid` modifier class when `summary.game` ∈ {lesson, lessonMatch, abbreviation, abbrMatch} so only translation + abbreviation get the 2-column treatment (sentence-bank/conjugation/binyan keep single-column because their rows hold long content).
- `styles.css` — Added `.results-mistakes--grid { grid-template-columns: 1fr 1fr }` with the section title + empty-note spanning both columns. Binyan board grid changed from `repeat(auto-fit, minmax(148px,1fr))` to an even `repeat(2,1fr)` base with a `@media (min-width:768px) { repeat(3,1fr) }` (mobile 2×3, tablet/desktop 3×2). Removed the three `[data-difficulty=...]` badge border-color rules.
- `app/binyan-board.js` — Removed `BINYAN_ROUND_DIFFICULTY_TARGETS` and the per-difficulty bucketed selection; `selectBinyanRoundRoots()` now returns 6 randomly shuffled roots from the full pool (new `BINYAN_ROUND_ROOT_COUNT = 6`). Dropped `tile.dataset.difficulty`; the root badge now shows a localized form count ("N forms" / "N צורות") instead of "{difficulty} · {count}".
- `app/bootstrap-data.js` — Added `binyan.formCount` i18n key (en: "{count} forms", he: "{count} צורות"). Left the now-unused `binyan.difficulty.*` keys in place (harmless).
- `tests/sentence-bank-data.test.js` — Updated the colloquial_19 token assertion to the new chunking (["Wow","I saw it","Cool","Send me","the details"]; alignment check unchanged).
- `tests/verb-game-data.test.js` — Rewrote "select exactly two roots per difficulty" → "serve six roots drawn from the full root pool" (asserts 6 unique roots from ROOTS + the existing distractor-pool checks); the `assert.ok(root.difficulty)` data check is untouched since the difficulty field still exists in the data.

**Behavior changed:** Translation game no longer surfaces the 4 transliteration words. Sentences game shows natural multi-word chips for 30 sentences that were previously word-by-word (verified live: colloquial_18 now shows "tomorrow at 8" / "don't be late" chips). מה נסגר no longer offers the near-synonym "What's new" as a tempting wrong answer. Abbreviation + translation results now show mistakes in a 2-column grid on every viewport; other games unchanged. Binyan board serves 6 random roots in an even grid (2 cols ≤767px, 3 cols ≥768px) with no difficulty labels or colors — badge shows only the form count.

**Tests run:** `npm test` — 168/168 before and after (after updating the two affected assertions). Node data checks: all 70 sentence entries align (in-order full coverage), 0 distractor/target overlaps; 4 transliterations confirmed removed (1176 words). Browser smoke (npx serve :3000): no console errors; binyan board renders 6 roots with "N FORMS" badges, 2 cols @544px / 3 cols @1024px, no data-difficulty attrs; results `--grid` container computes 2 columns with full-width heading while plain `.results-mistakes` stays single-column; Sentences game renders multi-word phrase chips.

**Risks / regressions to check:** (1) The 30 rechunkings and their new distractors are judgment calls — worth a native/fluent spot-check for naturalness; alignment and tests are green but phrasing quality is subjective. (2) Longest abbreviation mistake note (תנצב״ה ≈ 73 chars incl. Hebrew expansion + English) wraps to ~3–4 lines in a narrow 2-column cell on small phones — it wraps cleanly, no horizontal overflow, but is dense. (3) Borderline transliterations were intentionally kept and await user decision (see below).

**Awaiting user decision — borderline transliteration candidates not removed:** methodology (מתודולוגיה), narrative (נרטיב), prompt (פרומפט), token (טוקן), benchmark (בנצ'מרק), slang (סלנג). These are transliterations but are arguably standard modern Hebrew usage; left in pending the user's call.

---

### 2026-06-20 — Exclude בירה (beer) from translation quiz

**Requested:** Remove בירה from the translation game. Keep it in backend vocabulary but don't quiz it.

**Files changed:**
- `vocab-data.js` — Added `["בירה", { translationQuiz: false }]` to `LEXICON_AVAILABILITY_OVERRIDES`. Word remains in the lexicon and is available for sentence hints; only excluded from the translation quiz pool.

**Behavior changed:** The word "beer" / בירה no longer appears as a quiz prompt or distractor in the translation game.

**Tests run:** `npm test` — 168/168 pass.

**Risks / regressions to check:** None expected; the override mechanism is well-tested and used by a dozen other words.

---

### 2026-06-20 — Safe low-risk cleanup pass (dead CSS, orphaned data, stale docs)

**Requested:** Audit the IvritElite codebase for cleanup opportunities and action the agreed "safe, low-risk batch" — changes with no behavioral impact. (The audit also surfaced a dead MC-lesson helper cluster and the vestigial `abbreviationQuizDistractorIds` data field; both were explicitly deferred and NOT touched this session. Also confirmed three false-positive "dead code" findings that are actually live and were left alone: `app/storage.js` (it's `runtime.storageApi`), `updateLessonProgress` (the shared progress bar used by every mode), and `.DS_Store` (already untracked).)

**Files changed:**
- `styles.css` — removed unused selectors: `.shell-summary`, `.shell-status`, `.shell-chip`, the `.stats-grid`/`.stat-tile`/`.stat-label`/`.stat-value` block, and `.prompt-support-note` (mobile media query). Removed `.dashboard-header-card` from its comma group (kept `.home-lessons-card`) and `.review-queue-item`/`.review-queue-title`/`.review-queue-note` from their comma groups (kept the `.compact-row` and `.results-mistake-*` siblings). All confirmed to have zero references in `index.html`/`app.js`/`app/`.
- `vocab-data.js` — removed the orphaned `translationQuizDistractors` field construction in `getBaseVocabulary()` (built for every word but only ever read by tests, never by the app).
- `tests/vocab-data.test.js` — removed the two `translationQuizDistractors` assertions and trimmed the two affected test titles accordingly (the availability/translation assertions in those tests remain).
- `app/bootstrap-runtime.js` — removed the `shellRouteSummary`/`shellRouteChip` `querySelector` entries from the `el` map (the `#shellRouteSummary`/`#shellRouteChip` elements don't exist in `index.html`).
- `app/ui.js` — removed the two dead `if (runtime.el?.shellRouteChip/shellRouteSummary)` blocks in `renderShellChrome` and the now-unused `routeKey` local.
- `app/bootstrap-data.js` — removed the unused `binyan.difficulty.{easy,medium,hard}` i18n keys from both the EN and HE locale blocks (no `translate()` call references them; binyan-board uses `cleared`/`formCount`/`functionHint.*`/`teaching.*`).
- `CLAUDE.md`, `AGENTS.md` — updated the "Project structure" section to reflect the modular `app/` layout and the full set of data files (was still describing a monolithic `app.js`).

**Behavior changed:** None — dead code / data / doc cleanup only.

**Tests run:** `npm test` before = 168/168 pass; after = 168/168 pass (only the two trimmed vocab assertions changed). Live-verified via preview server: app boots with no console errors/warnings, home dashboard renders all 6 game tiles, leave-game confirmation works, and the Binyanim board renders correctly (root cards with "N FORMS" labels confirm `binyan.formCount` still resolves; no difficulty label appears anywhere, confirming those keys were dead). Bottom nav and card styling intact.

**Risks / regressions to check:** Low. Edits to `styles.css`, `vocab-data.js`, `app/ui.js`, and `app/bootstrap-data.js` landed on top of pre-existing uncommitted working-tree changes in those files — keep that in mind when reviewing the combined diff. Main residual risk is a CSS selector or i18n key referenced via a dynamically-built string, but each removal was grep-confirmed unreferenced and smoke-tested in the browser.

---

### 2026-06-20 14:52 — Homepage lesson emoji icons

**Requested:** Execute the Claude spec in `/Users/mikesexton/Downloads/CLAUDE-CODE-SPEC.md`: replace only the homepage lesson-grid PNG icons with the specified emoji system, leave the in-lesson game picker and asset files alone, add the emoji CSS override, and bump the stylesheet cache-bust query.

**Files changed:**
- `index.html` — Replaced the six `#homeDashboard .home-lesson-grid` icon `<img>` spans with emoji spans: Translation 🔁, Sentences 🧩, Conjugation 🏃, Abbreviation ✂️, Conjugation+ 🚀, Binyanim 🌳. Left the `.game-tile-title` and `.game-tile-note` content unchanged. Left the in-lesson `#gamePicker` image icons unchanged. Bumped `styles.css?v=20260620f` to `?v=20260620g`.
- `styles.css` — Added `.game-tile-emoji` with auto dimensions, 42px font size, line-height 1, transparent background, and no border. Placed the rule after the existing responsive `.game-tile-icon` sizing so the emoji dimensions are not overridden by later media queries.

**Behavior changed:** The homepage lesson launcher now shows the requested emoji icons instead of PNG lesson icons. The in-lesson game picker continues to use the existing PNG assets.

**Tests run:** `npm test` — 168/168 pass.

**Risks / regressions to check:** Low. This is a narrow HTML/CSS change. Main visual risk is emoji rendering differences across operating systems/browsers, especially the ✂️ variation selector.

---

### 2026-06-20 15:00 — Center homepage and sentence-game text

**Requested:** Try centering UI text that felt visually better centered, specifically the homepage "Choose Your Lesson" heading and maybe the sentence-game sentences and word counts.

**Files changed:**
- `styles.css` — Centered `.home-lessons-card .section-head`; changed sentence-builder answer lines from left/right text alignment to centered text while keeping their LTR/RTL direction; centered `.sentence-answer-meta` word count text.
- `index.html` — Bumped `styles.css` cache query from `?v=20260620g` to `?v=20260620h`.
- `tests/app-progress.test.js` — Updated the existing sentence-builder CSS assertion to expect centered answer rows and word count text, and added coverage for the centered homepage lesson heading.

**Behavior changed:** The homepage lesson heading is centered above the lesson grid. In the Sentences game, the fill-in sentence row and "Words: N/N" count are now centered instead of being edge-aligned.

**Tests run:** `npm test` — 168/168 pass.

**Risks / regressions to check:** Low. The sentence answer row still preserves `dir="ltr"` / `dir="rtl"`, but centered wrapping may feel less structured for very long sentence prompts on narrow phones; spot-check a few long Sentences rounds.

---

### 2026-06-20 15:12 — Center lesson heading and unify game-start yalla popup

**Requested:** The homepage "Choose Your Lesson" heading still was not visibly centered in the browser. Also standardize the popup speech bubble when beginning games so every game uses the same "yalla" / "יאללה" message.

**Files changed:**
- `styles.css` — Strengthened the home lesson heading centering with centered `justify-content` plus a full-width, centered `.home-lessons-card .section-head h2`, so it wins over the desktop `.section-head` row rule.
- `index.html` — Bumped `styles.css` to `?v=20260620i`; changed Sentences, Conjugation, and Abbreviation intro bubble text to `יאללה!`; added a new `#binyanBoardIntro` overlay; bumped cache keys for the edited JS modules.
- `app/word-match.js` — Added a start intro flow for the homepage Translation and Abbreviation match games, delaying the timer start until the intro clears.
- `app/binyan-board.js` — Added a start intro flow for Binyanim and delayed its timer start until the intro clears.
- `app/session.js`, `app/ui.js`, `app/bootstrap-runtime.js`, `app/controller.js` — Registered/cleared/locked the new intro states and overlay so leave/home/navigation behavior stays consistent.
- `app/sentence-bank.js`, `app/verb-match.js`, `app/adv-conj.js` — Added cleanup for the new Word Match and Binyanim intro states when starting other games.
- `tests/app-progress.test.js` — Loaded the Word Match modules in the harness, strengthened heading-centering assertions, and added coverage that start intro bubbles use `יאללה!` and that Translation/Abbreviation/Binyanim intro states auto-advance.

**Behavior changed:** The homepage lesson heading should now render centered after reload. All six homepage games now show the same `יאללה!` start bubble before gameplay; Binyanim and the Word Match-based Translation/Abbreviation modes now have the same start-popup behavior as the other modes.

**Tests run:** `npm test` — 169/169 pass. `git diff --check` — pass. Served `http://localhost:8080/index.html` was checked with `curl` and is returning the new CSS/JS cache keys.

**Risks / regressions to check:** Low-to-moderate. The intro state plumbing touches multiple game start/reset paths; tests cover auto-advance and cleanup, but still spot-check quickly in the browser by starting each of the six games from the homepage. If the old left-aligned heading persists, hard-refresh once to clear the previously cached `styles.css` request.

---

### 2026-06-20 15:41 — Center leave warning and compact home/game layouts

**Requested:** Center the leave-game warning text, and safely center the homepage / compact game boxes vertically when there is spare screen space.

**Files changed:**
- `styles.css` — Turned the app shell/body/page stack into a height-aware grid, scoped vertical auto-centering to `#homeView.active`, preserved start alignment for other routes, and added a Hebrew UI override so the leave confirmation dialog remains centered instead of inheriting the broad RTL right alignment.
- `index.html` — Bumped the stylesheet cache query from `?v=20260620i` to `?v=20260620j`.
- `tests/app-progress.test.js` — Added CSS assertions for the safe home-route centering rules and centered Hebrew leave dialog override.
- `task-log.md` — Added this implementation entry.

**Behavior changed:** The homepage and compact active-game screens can sit vertically centered when the viewport has extra room, while taller screens remain usable without hard-coded offsets. The leave-game confirmation title/body stay centered in Hebrew UI.

**Tests run:** Baseline before changes: `npm test` — 169/169 pass. After changes: `npm test` — 170/170 pass. `git diff --check` — pass. Chrome/Playwright smoke against `http://localhost:8080/index.html` — pass: homepage and desktop Sentence view center delta 0, mobile Sentence view stays inside the shell body, and the Hebrew leave dialog computes `text-align: center` with `direction: rtl`.

**Risks / regressions to check:** Low. The layout change is CSS-only and scoped to the home route, but spot-check a cramped Sentence game and a taller game to confirm the auto-centering collapses cleanly when there is no spare vertical space.

---

### 2026-06-21 — Show correct answers (green) alongside mistakes (red) on game results

**Requested:** On the final/results screen of the translation game (`lessonMatch`) and the abbreviation game (`abbrMatch`), display both right and wrong answers, colored green and red, with the red (wrong) section on top for easier review. Fumbled-but-eventually-correct pairs should count as **wrong**.

**Approach / judgment calls:**
- Both active games run through `word-match.js` → `match-engine.js`, so the change lives there + the shared summary renderer. The legacy multiple-choice `"abbreviation"` mode is dead code (no `startAbbreviation`), so it was left untouched.
- In `finishWordMatch`, the correct list = `ctx.matchedPairIds` (all pairs, since the game ends only when everything is matched) minus `ctx.sessionMistakeIds`. This naturally makes a fumbled-then-matched pair appear only in the red list. Reused the existing `buildMistakes(game, ids)` helper to build both lists (identical row shape `{primary, secondary}`).
- Rendered both sections inside the existing `.results-mistakes` (grid) container: red "Session Mistakes" heading + rows first, then green "Correct Answers" heading + rows. The green section renders **only when `corrects.length > 0`**, so non-match games (lesson, sentenceBank, verbMatch, advConj, binyanBoard) that pass no `corrects` are unaffected.
- Colored rows via new `compact-row--wrong` / `compact-row--correct` modifier classes using the existing `--error-bg`/`--success-bg` tokens; `createCompactRow` gained an optional `variant` param.

**Files changed:**
- `app/word-match.js` — `finishWordMatch` builds `correctIds` (matched minus mistakes) and a `corrects` list, passes `corrects` to `showSessionSummary`.
- `app/session.js` — `showSessionSummary` stores `summary.corrects`; `clearSummaryState` resets it.
- `app/bootstrap-runtime.js` — added `corrects: []` to initial `state.summary`.
- `app/ui.js` — `renderSummaryState` renders the green "Correct Answers" section below the red mistakes section (gated on `corrects.length`); `createCompactRow` accepts `variant` and adds the wrong/correct modifier class; mistakes rows now pass `variant: "wrong"`.
- `app/bootstrap-data.js` — added `results.correctAnswers` ("Correct Answers" / "תשובות נכונות").
- `styles.css` — added `.compact-row--wrong` and `.compact-row--correct` color rules.

**Behavior changed:** After finishing the translation or abbreviation match game, the results screen now lists every matched pair — wrong attempts (red) on top under "Session Mistakes", clean answers (green) below under "Correct Answers". Other games' results screens are unchanged.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass (no test covers the results DOM). Live-verified via preview server (dark theme, EN): abbrMatch summary shows 2 red rows then 4 green rows in correct order with correct colors; a lesson-style summary with no `corrects` shows only the mistakes section (no empty green heading), confirming non-match games are unaffected.

**Risks / regressions to check:** (1) Relies on `ctx.matchedPairIds` containing the full set at finish — true because `onAllMatched` fires only when `matchedCount >= totalPairs`. (2) `corrects` is not persisted in the session snapshot, but the summary screen is shown immediately on finish and not restored, so this is moot. (3) The green section is gated purely on `corrects.length`; if a future game starts passing `corrects`, it will render the section too (intended).

---

### 2026-06-21 — Tablet polish + 3-column results lists

**Requested:** On the game results screen, allow up to **three columns** for the correct/incorrect answer lists on wide enough screens. Separately, the **tablet** (iPad) experience looked "stretchy" — improve legibility/visual balance there, not just for this game but app-wide, using a mix of constrained content width (margins) and larger fonts.

**Approach / judgment calls (CSS-only; user chose "targeted high-impact" + "cap width + larger fonts"):**
- **3-column results (desktop only):** added `.results-mistakes--grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }` inside the existing `@media (min-width: 1024px)` block. The summary renderer already appends every row into the grid container (`app/ui.js renderSummaryState`), so this is pure CSS — no JS change. Tablet and mobile keep 2 columns. Existing section-title `grid-column: 1 / -1` correctly spans all 3 columns.
- **Tablet content width cap (centered margins):** in the `@media (min-width: 768px) and (max-width: 1023px)` block — capped `.app-shell` to `max-width: 920px` (app-wide centered margins on wider tablets; harmless at ≤768px) and capped the game column (`.prompt-card` and `.choices`) to `max-width: 680px` + `margin-inline: auto`. **Key gotcha:** these are grid items, so `margin-inline: auto` alone collapses them to content width — had to add `width: 100%` so they stretch up to the cap then center. Capped both prompt-card and choices to the same 680px so the prompt header and answer board stay aligned. Also gave `.settings-card` (600px) and `.review-panel-card` (760px) tablet max-widths, mirroring the rules they already had only at desktop.
- **Tablet font bumps (legibility):** nudged up the conservative tablet sizes — `.prompt-text`, `.choice-btn`/`.choice-btn.hebrew`, `.match-card`/`.match-card.hebrew` (and a slightly taller `.match-card` min-height/padding), plus results-screen text (`.results-section-title`, `.results-metric-label`/`-value`, `.compact-row` title/note). Increases kept small (~5–10%) to avoid wrapping.

**Files changed:**
- `styles.css` — one rule added to the `min-width:1024px` block (3-col results); several additions/edits inside the `768–1023px` tablet block (app-shell/prompt-card/choices/settings-card/review-panel-card max-widths; font-size bumps for prompt, choice/match cards, and results text).
- `index.html` — bumped cache-buster `styles.css?v=20260620j` → `?v=20260621a`.

**Behavior changed:** On screens ≥1024px the results-screen correct/incorrect answer lists now render in **3 columns** (was 2). On tablets (768–1023px), gameplay content is centered in a comfortable column with side margins instead of stretching edge-to-edge, the game board and its prompt header are width-aligned, settings/review cards are capped, and key text is a notch larger. Mobile (≤767px) and desktop content widths are otherwise unchanged.

**Tests run:** `npm test` before = 173/173 pass; after = 173/173 pass (no test covers layout/CSS). Live-verified via preview server: desktop 1280×800 results render 3 columns (`grid-template-columns` = 3 tracks, 8 sample correct rows, section titles span full width, no overflow); tablet 768×1024 and 1000×800 — app-shell centers at 920, game board + prompt both 680px and left-aligned at the same offset (44px @768, 160px @1000), no horizontal overflow (`body.scrollWidth` == viewport); results screen at 768 reads well at 2 columns with bumped fonts; Hebrew/RTL keeps the board centered and mirrors topbar/nav correctly; no console errors. Settings-card computed `max-width:600px` confirmed.

**Risks / regressions to check:** (1) The 680px game-column cap applies to all game modes on tablet (verb match, sentence bank, binyan board, conjugation) — spot-checked translation match; other modes share `.prompt-card`/`.choices` so should behave the same but worth a glance. (2) Larger tablet fonts could wrap unusually long bilingual answer rows or long Hebrew prompts — verified no wrapping on sampled content at 768 and 1000px. (3) The app-shell 920 cap also narrows the topbar and bottom nav on wide tablets (intended; they stay aligned with content). (4) `width: 100%` on the grid-item caps is required — removing it would collapse those elements to content width.

---

### 2026-07-01 — Codebase review + four conservative hardening fixes (Claude Code)

**Requested:** A get-to-know-the-codebase review answering six questions (bugs, optimizations, fun/effectiveness/new-game/content ideas). User then chose to execute only the fix batch: (1) strengthen the stale sentence-bank restore check, (2) harden the uncommitted drag-ghost cleanup, (3) de-fragilize the hardcoded flexible-modifier list, (4) a tiny dead-code cleanup. Decisions: `VERB_MATCH_ROUNDS = 1` is intentional and was left alone; the game/content ideas (Rush timed mode, cross-mode Daily Review, "Shema" listening game, idiom expansion) were parked for future sessions.

**Change:**
- `app/session.js` — added `sanitizeRestoreAlternateList()` and `serializeSentenceForRestoreCheck()`; `isStaleRestoredSentenceBankQuestion()` now compares a canonical serialization of the persisted vs live sentence (english, hebrew, both token lists, both alternate lists, both distractor lists, difficulty) instead of just english/hebrew text, keeping the existing prompt/targetTokens checks. Closes the gap where edits to a sentence's alternates, distractors, or difficulty survived a mid-round restore with stale grading data. Also removed the dead `h.getAbbreviationRoundTarget?.()` call in `finishAbbreviation` (the helper is defined nowhere; the constant fallback was always used).
- `app/sentence-bank.js` — hardened `applyMouseDragImage()`: the mouse drag ghost is now tracked in `sentenceDragGhostEl` (so the existing `dragend → clearSentenceDragState()` path cleans it), any prior ghost is removed before appending, removal is idempotent, a `setDragImage` failure removes the ghost synchronously, and on success both a rAF and a 100ms timeout backstop are scheduled (rAF alone can stall in hidden tabs). Also renamed the flexible-modifier const to `FALLBACK_HEBREW_FLEXIBLE_MODIFIER_TOKENS`; `isHebrewFlexibleModifierToken()` now resolves the list lazily from `runtime.sentenceBankApi?.getFlexibleModifierTokens?.()` with the local fallback.
- `sentence-bank-data.js` — added `HEBREW_FLEXIBLE_MODIFIER_TOKENS` (["די","לגמרי","ממש","מאוד"]) near the top with an author-facing comment, exposed via new `getFlexibleModifierTokens()` on the `IvriQuestSentenceBank` API, so sentence authors see the swap-tolerance list next to the data they edit.
- `app/ui.js` — removed two dead `app.abbreviation?.getAbbreviationRoundTarget?.()` calls (lines that always fell through to `runtime.constants.ABBREVIATION_ROUNDS`).
- `tests/app-progress.test.js` — added `FakeElement.remove()` to the harness; new test "sentence builder never strands a mouse drag ghost after dragstart" (throwing `setDragImage` → ghost removed synchronously; working `setDragImage` → ghost present after dragstart, gone after dragend); two new stale-restore tests asserting invalidation when only `hebrew_alternates` or only `hebrew_distractors` change between save and restore.
- `tests/sentence-bank-data.test.js` — new test asserting `getFlexibleModifierTokens()` exists, returns unique trimmed non-empty strings including all four modifiers, and returns a fresh copy per call.

**Files changed:** `app/session.js`, `app/sentence-bank.js`, `app/ui.js`, `sentence-bank-data.js`, `tests/app-progress.test.js`, `tests/sentence-bank-data.test.js`, `task-log.md`.

**Behavior changed:** A restored mid-round sentence-builder question is now dropped (safe fallback to home) if the sentence's alternates, distractors, or difficulty changed in the data — previously only text changes were caught; identical data still restores normally. Mouse drag ghosts can no longer strand on screen in edge cases (setDragImage failure, throttled rAF). No other observable changes; the flexible-modifier and dead-code changes are behavior-identical.

**Tests run:** `npm test` — 184/184 pass before changes (baseline including the pre-existing uncommitted drag-ghost work), 188/188 pass after (4 new tests). Browser-verified on the dev server (`npx serve`, port 3000): app boots with zero console errors/warnings; sentence-builder board renders and plays; synthetic dragstart with a real DataTransfer creates exactly one `.sentence-drag-ghost` and dragend removes it; mid-round page reload restores the identical question (mode stays `sentenceBank`, same prompt) confirming no over-invalidation.

**Risks / regressions to check:** (1) Fix 1 makes invalidation stricter — after any future sentence-data edit, users mid-round on that sentence will be bounced to home once; reordering a distractor array without content changes also invalidates (accepted trade-off). (2) When these files deploy, bump the `?v=` cache-bust tokens in `index.html` for `sentence-bank-data.js`, `app/sentence-bank.js`, `app/session.js`, and `app/ui.js` (see the 2026-06-29 cache-bust entry for why). (3) Preview-only observation, pre-existing and unchanged: on very short viewports the sticky Check bar overlaps the token bank; renders fine at normal sizes.

---

### 2026-07-01 — Fix right-column mismatch logging in match games + accept floating-adverb sentence orders (Claude Code)

**Requested:** User reported two bugs from live play: (1) in the Translation game they mismatched חיסון (vaccination) but it never showed as wrong on the results page; (2) the sentence "שוב נפגשנו במקרה? פעם שלישית גלידה!" rejected their answer "נפגשנו במקרה שוב?" even though the שוב placement is interchangeable. Asked to apply both fixes and sweep the sentence bank for other floating-adverb sentences with the same missing-alternate gap.

**Root cause (bug 1):** The Translation and Abbreviation games are the shared two-column match game. On a mismatch, `matchEngine.applyMismatch` calls `config.onMismatch(leftCard.pairId, rightCard.pairId)` — passing both the English (left) and Hebrew (right) word ids. But `word-match.js` defined `onMismatch: (id) => recordResult(ctx, id, false, mode)` with a single parameter, so only the left card's word was recorded; the right card's word was silently dropped from both `sessionMistakeIds` (the summary) and the spaced-repetition `updateProgress` call. Mis-tapping a Hebrew tile (right column) therefore never registered. (verb-match's own mismatch handler already records both sides — word-match was the outlier.)

**Change:**
- `app/word-match.js` — `buildConfig().onMismatch` now takes `(leftId, rightId)` and calls `recordResult` for both, so a mismatch records both involved words. Fixes both the Translation and Abbreviation match games.
- `sentence-bank-data.js` — added `hebrew_alternates` to three sentences with genuinely interchangeable floating-adverb orders (each alternate is a pure reordering of the same token multiset):
  - `colloquial_25` (ice cream): accept "נפגשנו שוב במקרה?" and "נפגשנו במקרה שוב?" alongside the stored "שוב נפגשנו במקרה?".
  - `professional_05`: accept "לבדוק שוב את הנתונים" alongside "לבדוק את הנתונים שוב".
  - `colloquial_02`: accept fronted "עכשיו אין לי כוח לזה…" alongside "אין לי כוח לזה עכשיו…".
- `tests/app-progress.test.js` — new test "translation match records both mismatched words, including the Hebrew (right) card": drives a lessonMatch mismatch and asserts both pairIds land in `sessionMistakeIds` and the right word's progress record registered the attempt.

**Sweep result:** Scanned all 115 sentences for ~23 candidate floating adverbs (שוב, כבר, עדיין, תמיד, עכשיו, היום/מחר/אתמול, ממש, מאוד, לגמרי, די, באמת, בכלל, סתם, פשוט, אולי, …). 30 contained a candidate; only the 3 above are true, unambiguous reorderings needing a new alternate. Deliberately rejected the rest, e.g.: degree words bound to their adjective (ממש מטורף, ממש על הפנים, פשוט יותר where פשוט is the adjective "simple"); cases already covered by the existing adjacent-swap logic for די/לגמרי/ממש/מאוד (colloquial_07 "הזוי לגמרי", colloquial_12 "חם כאן מאוד"); and — importantly — `professional_08` "זה לא לגמרי ברור", where moving לגמרי to "זה לגמרי לא ברור" flips the negation scope ("not completely clear" → "completely unclear"), a meaning change, so no alternate was added.

**Files changed:** `app/word-match.js`, `sentence-bank-data.js`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** Mismatching a Hebrew (right-column) word in the Translation/Abbreviation match games now correctly flags that word on the results page and feeds its spaced-repetition schedule. The three swept sentences now accept the additional natural word orders instead of marking them wrong.

**Tests run:** `npm test` — 189/189 pass (was 188; +1 new test). Verified via node that all `hebrew_alternates` on the three edited sentences are exact token-multiset permutations of their base, and that the data file loads. Browser-verified on the running dev server (port 3000): a fresh fetch of `sentence-bank-data.js` contains all four new alternate strings.

**Risks / regressions to check:** (1) The mismatch fix now records BOTH words as wrong on a mismatch (previously only the left). This is intentional and matches verb-match, but it means a mismatch dings the English-side word's SR schedule too — acceptable, recovers on next correct. (2) When deploying, bump the `?v=` cache-bust tokens in `index.html` for `app/word-match.js` and `sentence-bank-data.js` (see the 2026-06-29 cache-bust entry). (3) The three new sentence alternates were vetted for naturalness and meaning-equivalence by hand; if more are added later, keep verifying the reorder doesn't change negation/emphasis scope (see the professional_08 rejection above).

---

### 2026-07-01 — Ship to GitHub Pages: bump cache-bust tokens + merge working tree to main (Claude Code)

**Requested:** "Push to GitHub and merge with main."

**Change:**
- `index.html` — bumped `?v=` cache-bust tokens to `20260701a` for every file changed in the working tree so GitHub Pages returning visitors fetch the new code instead of stale cached copies: `styles.css`, `sentence-bank-data.js`, `app/bootstrap-data.js`, `app/session.js`, `app/ui.js`, `app/sentence-bank.js`, `app/word-match.js`.
- Committed and merged the full working tree, which bundles three previously-logged bodies of work: (1) the drag-ghost/drag-tip sentence-builder UX (2026-06-29 entry), (2) the four conservative hardening fixes — stale-restore check, drag-ghost cleanup, flexible-modifier relocation, dead-code removal (2026-07-01 entry), and (3) the match-game right-column mismatch logging fix + floating-adverb sentence alternates (2026-07-01 entry).

**Files changed:** `index.html`, `task-log.md` (plus the already-logged files carried in this merge).

**Behavior changed:** None beyond the already-logged changes; the token bump only forces caches to refresh on deploy.

**Tests run:** `npm test` — 189/189 pass.

**Risks / regressions to check:** After the Pages deploy completes, hard-refresh once and confirm the app boots (all 40 scripts 200) and a sentence round plays; if any file was changed but its token missed a bump, cached clients would run mismatched versions.

---

### 2026-07-02 07:19 — Add "Shema" listening game built on the sentence-bank engine (Claude Code)

**Requested:** Implement the previously-discussed "Shema" listening game: hear a Hebrew sentence spoken aloud (browser TTS) and reconstruct it from word tiles, using the existing sentence bank. Named "Shema" (not "Listening") per user preference.

**Change:**
- `app/sentence-bank.js` — added a third question direction `listen` alongside `he2en`/`en2he`, plus a `shemaMode` session flag. New `normalizeSentenceDirection()` helper; `buildSentenceProgressKey` now accepts `listen` (progress keys `id::listen`, kept separate from the two translation directions). `buildQuestionFromPair` builds listen questions with Hebrew target tokens/distractors and `answerIsHebrew=true`. `getAcceptedAnswerVariants` accepts only the primary Hebrew word order for listen questions (dictation is exact; written `hebrew_alternates` are rejected), and `getAlternateRequiredDistractors` returns an empty set for listen. `buildCandidatePairs` emits listen-only pairs when `shemaMode` is set. New `startShema()` (delegates to `startSentenceBank({shema:true})`); `startSentenceBank` gained an options param and sets `shemaMode`/`lastPlayedMode` accordingly; `resetSentenceBankState` clears the flag. `getSentenceBankPromptSpeechPayload` now returns a payload for listen questions; new `playShemaPrompt({slow})` speaks the sentence (forced, 0.65 rate when slow). `nextSentenceBankQuestion` auto-plays the sentence once per new listen question. `renderSentenceBankBoard` renders a `.shema-controls` row ("🔊 Play sentence" / "🐢 Slower") for listen questions. `applySentenceBankAnswer` uses new shema feedback strings and appends the English meaning to the detail line. `buildSentenceBankMistakeSummary` formats listen mistakes (Hebrew primary, "Shema: <english>" secondary).
- `app/session.js` — restore-stale check accepts the `listen` direction (prompt=Hebrew, targets=Hebrew tokens); snapshot restore reads `shemaMode`; `finishSentenceBank` emits `game:"shema"` / `summary.shemaTitle` when in shema mode; `isModeSessionActive` distinguishes `"shema"` from `"sentenceBank"` via the flag.
- `app/persistence.js` — session snapshot now persists `sentenceBank.shemaMode`.
- `app/speech.js` — `speech.speak` honors an optional `options.rate` (used by the Slower button).
- `app/ui.js` — `renderPromptText` shows the localized "Listen to the sentence…" instruction (and hides the Hebrew text) for listen questions; `renderSessionHeader` titles the session "Shema"/"Shema Review" when in shema mode; `renderHomeLessonButtons` gates the home tile on `speech.isSupported()` (hidden when no Hebrew voice) and highlights the Shema vs Sentences tile correctly.
- `app/controller.js` — bound `#homeShemaBtn`; `openHomeLesson("shema")` starts/resumes the shema session (mode stays `sentenceBank` internally); `continueFromResults` restarts Shema from its summary.
- `app/bootstrap-runtime.js` — registered `homeShemaBtn` element; added `shemaMode:false` to sentence-bank state defaults.
- `app/bootstrap-data.js` — EN+HE strings: `game.shemaName/shemaNote`, `session.shemaTitle/shemaSecondChanceTitle`, `prompt.shemaListen/shemaPlay/shemaPlaySlow`, `feedback.shemaCorrect/shemaWrong/shemaMeaning`, `summary.shemaTitle`.
- `index.html` — new 👂 "Shema" home tile (ships `hidden`; unhidden at runtime when a Hebrew voice exists); bumped `?v=` to `20260702a` on all changed files (`styles.css`, `bootstrap-data.js`, `bootstrap-runtime.js`, `speech.js`, `persistence.js`, `session.js`, `ui.js`, `sentence-bank.js`, `controller.js`).
- `styles.css` — `.shema-controls` (centered flex row) and `.shema-play-btn` sizing.
- `tests/app-progress.test.js` — three new tests: full shema round (auto-speak on question load, hidden Hebrew prompt, play-button replay, correct answer scores difficulty+1, progress under `sb-1::listen` only); exact-order dictation (a written `hebrew_alternates` order is rejected, logs a miss, queues review with `direction:"listen"`); home-tile voice gating (visible with an he-IL voice, hidden without).

**Files changed:** `app/sentence-bank.js`, `app/session.js`, `app/persistence.js`, `app/speech.js`, `app/ui.js`, `app/controller.js`, `app/bootstrap-runtime.js`, `app/bootstrap-data.js`, `index.html`, `styles.css`, `tests/app-progress.test.js`, `task-log.md`.

**Behavior changed:** A new "Shema" tile (👂) appears on the home grid when the browser has a Hebrew TTS voice. It runs 10 listening rounds over the existing sentence bank: the sentence is spoken automatically (replayable, with a slow option), the Hebrew text stays hidden until answered, and the answer is assembled from the same tile UI as the sentence builder. Correct answers score difficulty+1; feedback reveals the sentence and its English meaning. Progress is tracked per-sentence under a separate `listen` direction, sessions survive reload, and the summary/Play Again flow is Shema-specific. The regular Sentences game is unchanged.

**Tests run:** `npm test` — 192/192 pass (189 baseline before changes, 3 new). Browser-verified on the local dev server: tile visible with a Hebrew voice; starting Shema shows the "Shema" title, instruction prompt, play/slow buttons, and 8 slots + 12 Hebrew tiles; `speechSynthesis.speaking` goes true on play; a full correct round scored 3 and wrote `professional_13::listen`; mid-session reload restored `shemaMode` and the listen question; forced finish showed "Shema Complete" and Play Again restarted Shema; no console errors.

**Risks / regressions to check:** (1) TTS pronunciation of unvocalized Hebrew — spot-check sentences by ear; `buildHebrewSpeechText` already prefers a niqqud override field if any sentence needs one. (2) Auto-play relies on prior user activation (the tile click); if a browser blocks it, the round still works via the Play button. (3) Some `hebrew_distractors` may be near-homophones of target words when heard rather than read — tune per sentence if a round feels unfair. (4) Shema attempts aggregate into the existing "Sentences" bucket in category analytics (`calculateGameModeStats` sums all `sentenceProgress` records); split it out if per-game analytics matter later. (5) Restored pre-existing snapshots lack `shemaMode` and default to `false` — correct for all sessions saved before this change.

---

### 2026-07-02 — Add a cursive-Hebrew handwriting practice game (letters trace mode, PR 1)

**Requested:** Build a handwriting practice game for ivritelite teaching cursive Hebrew (ktav yad). Approved plan: trace-over-template learn mode (one letter at a time, never whole words/sentences on one canvas), letters-first curriculum covering all 27 letterforms (finals included), standalone Leitner-style progress (no wiring into sentence-bank/Shema/vocab progress), responsive square canvas with Pointer Events. ($P freeform test mode and word rounds are planned follow-ups.)

**Change:**
- `handwriting-data.js` (new) — 27 cursive letterform templates `{id, letter, printChar, final, medialOf, nameEn, nameHe, order, descender, ascender, strokes}` in normalized 0–1 coordinates with a shared writing box (topline 0.15, baseline 0.75, descender floor ~0.965). Geometry machine-traced from Wikimedia Commons "Hebrew letter X handwriting" cursive SVGs (filled outlines → raster → Zhang-Suen skeletonization → centerline polylines). Letters flagged for possible human retouching: ף (low confidence), ם ח ד ץ א ק (medium — mostly stroke start/direction conventions, geometry solid).
- `app/handwriting-core.js` (new) — pure, DOM-free logic: `resamplePoints`, `pathLength`, `scoreTrace` (template coverage 70% + user-ink precision 30%, pass ≥75 score and ≥85% coverage; order/stroke-count blind by design), `normalizeProgressEntry`/`applyAttemptToProgress` (Leitner box 0–7 via `constants.LEITNER_INTERVALS`), `pickHandwritingSession` (≤2 new letters in curriculum order, then overdue weakest-first, then lowest-box fill, cycling within-session when fewer distinct letters exist than rounds), `letterformIdsForWord` (for the future word-rounds PR).
- `app/handwriting.js` (new) — game module following the binyan-board/word-match lifecycle conventions: `startHandwriting`, intro overlay with auto-advance, module-owned timer, canvas stage in `#choiceContainer` (DPR-aware square canvas, ResizeObserver, pointerdown/move/up/cancel with coalesced events, ~0.004 movement filter, tiny-stroke rejection), numbered stroke-start dots + faint template + guide lines, Undo/Clear/Skip/Check toolbar, auto-check once traced length ≥90% of template, first-attempt-decides round scoring (retries allowed for pedagogy, recorded once), per-letter progress saved to localStorage on every outcome, `session.showSessionSummary` completion. Render guard reuses the existing canvas across `renderAll` calls (theme/language toggles preserve ink mid-round).
- `app/constants.js` — `STORAGE_KEYS.handwritingProgress` (`ivriquest-handwriting-progress-v1`), `HANDWRITING_ROUNDS=10`, `HANDWRITING_TRACE_PASS_SCORE=75`, `HANDWRITING_NEW_LETTERS_PER_SESSION=2`.
- `app/bootstrap-runtime.js` — `handwriting` state object; `homeHandwritingBtn`/`handwritingBtn`/`handwritingIntro` element registry entries.
- `app/bootstrap-data.js` — EN+HE i18n: `game.handwritingName/Note`, `handwriting.*` (tracePrompt, printLabel, check/undo/clear/skip, feedbackPass/feedbackRetry), `prompt.handwritingStart`, `summary.handwritingTitle/Note`.
- `index.html` — home tile ✍️, game-picker tile, `#handwritingIntro` overlay, script tags for the three new files; bumped cache-bust tokens (`?v=20260702b`) on all modified JS files and styles.css.
- `app/controller.js` — tile bindings, `openHomeLesson("handwriting")` branch, `continueFromResults` branch, intro overlay interaction-blocking list.
- `app/session.js` — `clearHandwritingIntro`; handwriting cases in `hasActiveLearnSession`/`isModeSessionActive`; stop/clear/reset in `endSessionAndNavigate` and `showSessionSummary`.
- `app/ui.js` — `isUiLocked` intro union; header progress branch; `renderLearnState` dispatch; standard-layout and feedback mode lists; handwriting `renderSessionHeader` branch (hides Next button).
- `app/word-match.js`, `app/verb-match.js`, `app/sentence-bank.js`, `app/adv-conj.js`, `app/prepositions.js`, `app/binyan-board.js` — each competing-session reset now also clears the handwriting intro and resets handwriting state (lesson.js/abbreviation.js have no live start-cleanup blocks; their starters are retired no-ops).
- `styles.css` — `.handwriting-stage/.handwriting-canvas` (square, `touch-action:none`, max 60vh) `/.handwriting-toolbar/.handwriting-tool-btn`.
- `generated/handwriting-authoring.html` (new, not loaded by the app) — self-contained tracing page for authoring/retouching templates: reference-image underlay with opacity, pointer drawing, undo, resampled-JSON export, replay of pasted JSON or letters loaded from handwriting-data.js.
- `tests/handwriting-core.test.js`, `tests/handwriting-data.test.js` (new) — 20 tests: resampling invariants, trace-score self/jitter/wrong-shape/empty/stray-ink behavior, Leitner clamps and test-submode counters, scheduler ordering/new-letter cap/weakest-first, final-form word mapping; data-shape tests (27 unique forms, final↔medial mapping, full coverage of every Hebrew letter used in vocab-data.js and sentence-bank-data.js, bounds, descender/ascender geometry, sane path lengths).

**Behavior changed:** New "Handwriting" (✍️ / כתב יד) tile on the home dashboard and in the game picker. Sessions run 10 one-letter trace rounds (2 new letters per session in alef-bet order incl. finals, plus due/weak letters, cycling as needed), with faint cursive guide, numbered stroke dots, auto-check, retry-after-fail, and a standard results summary. Per-letterform Leitner progress persists in localStorage under a new key. No other game's behavior changed.

**Tests run:** `npm test` — 192/192 pass before changes; 212/212 pass after (20 new). Browser-verified on the dev server (desktop + 375px mobile): tile starts the game; intro auto-advances; canvas renders alef/bet/dalet templates; synthetic pointer tracing of the template scores 100 and auto-advances; a wrong shape scores 25 with retry feedback and one recorded miss; retry-pass doesn't double-record; summary shows correct title/score/mistakes; Continue restarts; localStorage entry updates per letter; second session leads with next new letters then weak box-0 letters; language toggle mid-round preserves the canvas and ink; starting binyan mid-handwriting (and vice versa) fully resets the other game; mobile canvas is a 332px square (DPR-2 backing store) with toolbar above the fold and no horizontal overflow; no console errors.

**Risks / regressions to check:** (1) Template quality — ף/ם/ח/ד/ץ/א/ק flagged for stroke-direction/artifact review; retouch via `generated/handwriting-authoring.html` (trace → Export JSON → paste into handwriting-data.js; data tests enforce shape constraints). (2) Trace-score thresholds (R=0.06, pass 75, coverage 0.85) are first-pass values pinned by tests — tune in constants.js after dogfooding on a real touchscreen. (3) Auto-check fires at ≥90% of template path length — very slow tracers with heavy overdraw could trigger early checks; Check button remains as fallback. (4) `setPointerCapture` is wrapped in try/catch (synthetic/stale pointer ids throw). (5) Session restore (`persistSessionState`) intentionally does not resume a mid-handwriting round — reload lands on the handwriting idle state, consistent with match-style games.

---

### 2026-07-02 — Declutter the Shema prompt card (remove duplicate speaker icon + instruction banner)

**Requested:** In Shema, remove the corner speaker icon on the prompt card (it duplicates the "🔊 Play sentence" button) and remove the large "Listen to the sentence, then build what you hear." instruction text — assume the player can figure it out.

**Change:**
- `app/ui.js` — `getCurrentPromptSpeechPayload()` now returns null for sentence-bank questions with `direction === "listen"`, which hides `#promptSpeechBtn` in Shema only (`sentenceBank.getSentenceBankPromptSpeechPayload` is untouched, so the Play/Slower buttons and the auto-play on question load still work; he2en sentence questions keep their corner speaker since it's the only audio control there). The `renderPromptText` listen branch now empties and hides `#promptText` instead of rendering `prompt.shemaListen`; the general question path and `renderIdleLessonState` explicitly remove the `hidden` class so the prompt reappears when leaving Shema.
- `tests/app-progress.test.js` — updated the shema round test to assert the prompt is empty and hidden (was asserting the old instruction string).

**Files changed:** `app/ui.js`, `tests/app-progress.test.js`, `task-log.md`. (No cache-bust bump needed: `app/ui.js` was already bumped to `?v=20260702b` in this session's handwriting change, which has not deployed yet.)

**Behavior changed:** Shema rounds show a cleaner prompt card: sentence emoji + Play sentence/Slower buttons, no instruction banner, no duplicate speaker icon. The `prompt.shemaListen` i18n key is now unused but left in place.

**Tests run:** `npm test` — 212/212 pass (after updating the one shema test that pinned the old instruction text). Browser-verified on the dev server: in a live Shema round `#promptText` is empty+hidden and `#promptSpeechBtn` is hidden while both play buttons render; a he2en Sentences question still shows the Hebrew prompt and the corner speaker; the lesson idle prompt reappears (unhidden) after leaving Shema.

**Risks / regressions to check:** `#promptText` is now toggled with the `hidden` class; if a future game mode renders prompt text without going through `renderPromptText`/`renderIdleLessonState` (or the handwriting module, which manages the class itself), confirm it removes `hidden` first. First-time Shema players lose the one-line explanation — watch for confusion feedback.

---

### 2026-07-02 — Collapse residual Shema prompt space + switch handwriting game to full-sentence rounds

**Requested:** (1) Shema still had leftover vertical space where the removed instruction text used to be — eliminate it. (2) Reconfigure the handwriting game: instead of practicing isolated letters in curriculum order, each round should spell out a full sentence, with the sentence shown in English and Hebrew in the prompt area, and no explicit instruction text ("trace cursive he" / "print form: ה").

**Change:**
- `app/ui.js` — added a `prompt-card--audio` marker class: `renderPromptText` clears it at the top and adds it in the Shema listen branch; `renderIdleLessonState` also clears it (and clears the `handwriting-prompt` class). This lets CSS collapse the prompt content row only in Shema. `getCurrentPromptSpeechPayload` already returns null for listen questions (prior task) so the corner speaker stays hidden in Shema.
- `styles.css` — `.prompt-card.prompt-card--audio .prompt-content-row { min-height: 0; padding: 0; }` collapses the ~49px reserved line in Shema. Added `.prompt-text.handwriting-prompt` (flex column), `.handwriting-line` (RTL Hebrew sentence), `.handwriting-line .hw-cell.current` (brand highlight) / `.done` (dimmed), and `.handwriting-en` (English subtitle) for the new sentence prompt.
- `app/handwriting-core.js` — added `buildSentenceCells(text, charToId)` (maps each char to `{char, letterformId|null}`, letters mapped, spaces/punctuation null) and `countLetterCells(cells)`. Existing letter scheduler (`pickHandwritingSession`) and its tests are retained but no longer called by the game (kept for a possible future letters mode).
- `app/handwriting.js` — reworked from letter-curriculum rounds to sentence rounds. `buildSentenceRounds()` pulls sentences from `IvriQuestSentenceBank.getSentenceBank()`, keeps those whose Hebrew letter count is within `HANDWRITING_SENTENCE_MIN/MAX_LETTERS`, prefers shorter ones, and shuffles a shortlist to pick `HANDWRITING_SENTENCE_ROUNDS` (3). Each round stores `{sentenceId, hebrew, english, cells}`. The player traces each Hebrew letter in reading order; `cellIndex` auto-skips spaces/punctuation via `nextLetterCellIndex`. `renderSentencePrompt` shows the Hebrew sentence in the prompt with the current letter highlighted and completed letters dimmed, English translation beneath, no per-letter label and no emoji. Per-letter trace scoring, auto-check, retry-after-fail, and per-letterform Leitner progress persistence are unchanged. Completing a sentence's letters advances to the next sentence; finishing all sentences shows the summary. State fields renamed (`letterIndex`→`cellIndex`, `attemptsThisLetter`→`attemptsThisCell`, `roundRecorded`→`cellRecorded`; `submode` dropped).
- `app/bootstrap-runtime.js` — updated the `handwriting` initial-state object to the new field set.
- `app/constants.js` — added `HANDWRITING_SENTENCE_ROUNDS=3`, `HANDWRITING_SENTENCE_MIN_LETTERS=6`, `HANDWRITING_SENTENCE_MAX_LETTERS=34`.
- `app/bootstrap-data.js` — removed the now-unused `handwriting.tracePrompt`/`printLabel` keys (EN+HE); changed `summary.handwritingNote` to "Sentences: {sentences}" / "משפטים: {sentences}"; softened the pass feedback to "Nice! Score: {score}" / "יפה! ציון: {score}".
- `index.html` — bumped cache-bust tokens to `?v=20260702c` on styles.css, constants.js, bootstrap-data.js, bootstrap-runtime.js, ui.js, handwriting-core.js, handwriting.js.
- `tests/handwriting-core.test.js` — added a `buildSentenceCells`/`countLetterCells` test (order preserved, letters mapped incl. final forms, separators null, count correct).

**Behavior changed:** Shema's prompt card is now compact (emoji + Play/Slower buttons, ~36px card vs ~86px). The handwriting game now runs 3 sentence rounds: the prompt shows the full Hebrew sentence (current letter highlighted, finished letters dimmed) with the English translation underneath; the player traces each letter's cursive template in order, spaces auto-skipped; no "trace cursive X" / "print form" text. Summary reports the sentence count.

**Tests run:** `npm test` — 213/213 pass (added 1). Browser-verified on the dev server (desktop + 375px mobile): Shema content row collapses to 0px height with the emoji still shown and no corner speaker; handwriting starts with 3 shortlisted sentences, the Hebrew prompt highlights the current letter and dims completed ones with the English subtitle below, tracing a letter scores and advances the highlight to the next letter, spaces are never the active cell, completing/skipping all letters advances rounds and then shows the "Handwriting Complete" summary; leaving handwriting restores the lesson idle and regular Sentences prompts with no leaked `handwriting-prompt`/`prompt-card--audio` classes; no console errors.

**Risks / regressions to check:** (1) Sentence length — 3 sentences × up to 34 letters is a real commitment; tune `HANDWRITING_SENTENCE_ROUNDS`/min/max letter constants after dogfooding. (2) The letter-curriculum scheduler (`pickHandwritingSession`) and the `HANDWRITING_ROUNDS`/`HANDWRITING_NEW_LETTERS_PER_SESSION` constants are now dead code paths kept for a future letters mode — remove if that mode is ruled out. (3) `prompt-card--audio` is cleared in `renderPromptText`/`renderIdleLessonState`/handwriting render; if a new mode sets the prompt via another path, ensure it clears the class. (4) Weak-letter bias no longer drives selection (sentences are chosen by length, not by the learner's weak letters), though per-letter Leitner progress is still recorded — a future pass could weight sentence choice toward sentences containing weak letters.

---

### 2026-07-02 — Handwriting: one sentence per session + fix RTL stroke directions (resh, he, qof)

**Requested:** (1) Each round of the handwriting game should be exactly one sentence — after one sentence you're done. (2) Double-check that stroke templates are drawn in the correct direction; user noted ר should be drawn right-to-left.

**Change:**
- `app/constants.js` — `HANDWRITING_SENTENCE_ROUNDS` 3 → 1. A session is now a single sentence.
- `handwriting-data.js` — reversed the point order of three strokes after a direction audit of all 27 letterforms (rendered every template with start/end markers and checked against the right-to-left / top-to-bottom handwriting convention, which web sources confirm as the general tendency — Hebrew has no rigid stroke standard): **resh** (now starts at the right end of the arc and sweeps up-and-over to the left tip), **he** stroke 1 (same roof+right-leg family; now starts at the right leg, ends at the left roof tip; the short left-leg tick stays second, drawn downward), **qof** stroke 1 (roof arc now right-to-left; the descender stays stroke 2, drawn top-to-bottom). Letters verified as already correct and left unchanged include chet (starts bottom-right, arches to bottom-left), shin (starts at right tip), mem/nun/zayin/tav/ayin (start right), samekh (starts at top moving leftward, i.e. counter-clockwise — the natural RTL circle), and the vertical/descender letters (start top). Judgment calls left as-is and worth a native-writer review in the authoring page: gimel, dalet, tsadi (all "3"-family, start top-left like writing a 3), lamed (starts at ascender tip; some writers start at the loop), pe (outer-to-inner spiral), pe-final (already flagged low-confidence from tracing).
- `index.html` — cache-bust bumps to `?v=20260702d` for handwriting-data.js and constants.js.

**Files changed:** `app/constants.js`, `handwriting-data.js`, `index.html`, `task-log.md`.

**Behavior changed:** A handwriting session is one sentence (was 3). Trace guides for ר, ה, ק now show the numbered start dot on the right side with the stroke flowing right-to-left. Scoring is direction-blind, so only the visual guidance (start dots) changes.

**Tests run:** `npm test` — 213/213 pass. Browser-verified: rendered all 27 templates with start/end markers before and after; resh/he/qof now start right; a full session runs exactly one sentence (29 letters skipped → summary appears immediately after).

**Risks / regressions to check:** Stroke direction has no universal standard — if the user writes gimel/dalet/lamed/pe differently than the kept convention, reverse those strokes the same way (reverse the `points` arrays; scoring is unaffected). One sentence per session means per-session letter coverage is narrower; the Leitner progress still accumulates across sessions.

---

### 2026-07-03 — Reclaim vertical space during gameplay on mobile (hide bottom nav, compact topbar, drop sticky footer)

**Requested:** Gameplay screens on mobile used vertical space poorly across games — the feedback tray + Next button covered the last answer choice (including the highlighted correct answer), and the fixed bottom nav plus its reserved padding wasted ~120px mid-game. Figure out how to optimize the mobile display.

**Change:**
- `styles.css` — new `@media (max-width: 767px)` block scoped to `body[data-gameplay-active="true"]`: hides `.mobile-bottom-nav` during active gameplay; shrinks `.app-shell` bottom padding from `5.2rem` to `0.62rem` (+safe-area); drops the sticky `.lesson-footer` from `bottom: 4.15rem` to `0.5rem` (+safe-area) via a `body[…] .lesson-shell .lesson-footer` selector whose specificity also overrides the sentence-bank and short-viewport variants; compacts the topbar (padding `0.42rem`, logo `1.9rem`, title `1.18rem` with nowrap/ellipsis, smaller gameplay pill and home button). Also changed the `@media (max-width: 1023px)` rule that force-hid `.shell-topbar-home` so it only applies outside gameplay (`body:not([data-gameplay-active="true"])`), since the 🏠 button is now the exit path while the nav is hidden.
- `app/ui.js` — `renderShellChrome()`: `showShellHomeButton` is now `gameplayActive || (viewportWidth >= 1024 && results-with-summary)` instead of requiring `>=1024px` for both cases, so the topbar 🏠 (already wired to `session.requestGoHome`, i.e. the leave-game confirm) shows on mobile/tablet during gameplay. Desktop behavior unchanged.
- `tests/app-progress.test.js` — the "bottom nav is never hidden" guard now asserts that any `.mobile-bottom-nav` `display: none` rule is scoped to `body[data-gameplay-active="true"]` (the original intent — no viewport-width hiding — still enforced).
- `index.html` — cache-bust bumps to `?v=20260703a` for styles.css and app/ui.js.

**Files changed:** `styles.css`, `app/ui.js`, `tests/app-progress.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** On phones (≤767px) during an active game session: the Home/Review/Settings bottom nav disappears and a compact 🏠 button appears in the (slimmed) topbar instead — tapping it opens the existing leave-game confirmation. The Next button + feedback tray now sit at the bottom edge of the screen, reclaiming ~110–120px, so a standard 4-choice round plus feedback fits fully on screen (verified down to 375×667) with no choices hidden behind the footer. Outside gameplay (home, review, settings, results) nothing changes — the bottom nav returns and the 🏠 hides. Tablets (768–1023px) keep their bottom nav but also gain the topbar 🏠 during gameplay. Desktop unchanged.

**Tests run:** `npm test` — 213/213 pass (before and after; one test updated as described). Browser-verified at 375×812 and 375×667: nav hidden + compact topbar during a lesson and prepositions round; all four choices, Submit/Next, and the feedback tray visible simultaneously with no overlap; 🏠 → leave-confirm → home restores the nav and hides 🏠; no console errors.

**Risks / regressions to check:** (1) Mid-game on mobile there is now no direct Review/Settings access — exiting via 🏠 is required first (intended, matches the leave-confirm flow the nav triggered anyway). (2) The compact 🏠 (2.2rem ≈ 35px) is slightly below the 44px ideal tap target. (3) Games whose footer appears in other states (e.g. sentence-bank second chance) inherit the new `bottom: 0.5rem` via the higher-specificity override — spot-check sentence builder on a real phone. (4) If a future rule hides `.mobile-bottom-nav` outside gameplay scope, the updated test will (intentionally) fail.

### 2026-07-03 — Fix "rised"→"rose"; add צריך (present-only) and 9 common verbs to the conjugation game

**Requested:** (1) The verb-conjugation match game showed the English past of "to rise" as "rised" — should be "rose". (2) Add צריך to the conjugation game. (3) Add any more verbs that can be added reliably. Follow-up: add the 9 candidate verbs, and advise whether צריך's compound past forms are natural or need a different learning method.

**Change (all in `hebrew-verbs.js`):**
- **rise fix:** Added `["rise", "rose"]` to `ENGLISH_PAST_IRREGULARS`. `inflectEnglishPast()` was falling through to the regular `/e$/`→`+d` rule and producing "rised"; the map now yields "rose" for every past-tense English label of לקום. Audited all 62 distinct verb glosses first — "rise" was the only incorrect English past.
- **צריך (present-only):** Added curated entry `common-verb-tzarich` with only the 4 present forms (צריך/צריכה/צריכים/צריכות → he/she needs, they need), fully vocalized. Deliberately NO past/future: צריך's past is a two-word compound (היה צריך) and its future is a different verb (nif'al להצטרך → אצטרך), neither of which fits a single-word conjugation drill without misrepresenting what they are. An earlier draft that included the compound past + nif'al future was reverted in favor of present-only; the entry's `notes` records that the past/future are taught as sentence patterns instead.
- **9 new common verbs (full curated tables, 24 forms each):** pa'al o-stem — לחשוב (think), לזכור (remember), למכור (sell), לגמור (finish); pi'el — לבקש (request), לספר (tell), לשלם (pay), לקבל (receive), לחפש (search). Consonantal (plain, ktiv-male) forms were taken from the tested generation engine (`buildGeneratedForms`) and verified to match programmatically; niqqud was hand-authored following the existing לסגור (paal_o) and לתקן (pi'el) templates — ktiv-haser-menuqad with dagesh, guttural chataf-patach for לחשוב/לחפש, sin dot for לחפש. All set `conjugation_mode:"curated"`, `translationQuiz:false` (conjugation game only; the flag doesn't gate that game anyway), `sentenceHints:true`.

**Investigation note:** The conjugation game (`app/verb-match.js`) consumes the full `buildVerbConjugationDeck()` output and does NOT filter by `availability.translationQuiz` — that flag only gates the separate word-meaning quiz. So new verbs enter the conjugation game purely by having valid vocalized tables (deck now 65 verbs, was 55). The deck enforces a tested invariant that every learner-facing form carry niqqud (`tests/hebrew-verbs.test.js:659`), which is why generation-backed (unvocalized) entries can't be used and full vocalized tables are required.

**Files changed:** `hebrew-verbs.js` (rise irregular + 10 new verb entries), `task-log.md`.

**Behavior changed:** In the verb-match conjugation game: לקום past options now read "rose" not "rised"; צריך appears as a present-only round (4 pairs); and think/remember/sell/finish/request/tell/pay/receive/search are now playable with present/past/future/imperative rounds.

**Tests run:** `npm test` — 213/213 pass. Node-harness checks: all 9 verbs' plain present/past/future forms match the generation engine exactly (no consonant typos; the only diffs were correct sofit ם on לשלם that the raw generator leaves medial); every deck form carries niqqud; צריך is present-only (4 forms); English past labels resolve correctly (thought/sold/told/paid via the irregulars map).

**Risks / regressions to check:** (1) The hand-authored niqqud on the 9 verbs is standard-pattern and self-reviewed, but the exact vowel points (esp. guttural לחשוב/לחפש and dagesh placement) should be spot-checked by a fluent reader; plain consonants are generator-verified so any error would be in vowels only. (2) These 9 are `translationQuiz:false`, so they appear only in the conjugation game, not the word-meaning quiz — flip to `true` if you also want them there. (3) צריך is present-only by design; if broader coverage is wanted, the past/future belong in the sentence bank rather than this drill.

### 2026-07-04 — Fix stale deploy of the verb changes; add cache-bust rule to CLAUDE.md

**Requested:** The "rised"→"rose" fix (merged in PR #22) was not visible on the live GitHub Pages site; investigate. Then add a note to prevent recurrence.

**Root cause:** `index.html` loads each file with a `?v=` cache-bust query string. PR #22 bumped the strings for `app/ui.js` and `styles.css` but not for `hebrew-verbs.js`, which stayed at `?v=20260628g`. Browsers and the Pages CDN cache by full URL, so the old `hebrew-verbs.js` kept being served even though the new file was deployed.

**Change:**
- `index.html` — bumped `hebrew-verbs.js` cache-bust `20260628g` → `20260704a` (PR #23), so the rise fix, צריך, and the 9 new verbs actually load.
- `CLAUDE.md` — added a "Cache-busting (required before push)" section: bump the `?v=` for every `.js`/`.css` file you edit (data files included) in the same commit, and verify before pushing.

**Files changed:** `index.html` (cache-bust bump), `CLAUDE.md` (new rule), `task-log.md`.

**Behavior changed:** Live site now serves the current `hebrew-verbs.js` after a Pages rebuild + hard reload; no runtime code behavior change.

**Tests run:** `npm test` — 213/213 pass (no logic changed).

**Risks / regressions to check:** None. Confirm on the live site (hard reload) that לקום shows "rose" and the new verbs/צריך appear.

### 2026-07-04 — Shema niqqud TTS fix; replace צריך with הצטרך; clean translation-game verbs; add קעקוע + 10 sentences

**Requested:** (1) Fix מספר being spoken "m'sefer" instead of "mispar" in the listening game (video showed colloquial_26). (2) Confirm צריך's status in the conjugation game and scan the translation game for too-simple verbs that should be conjugation-only. (3) Replace צריך with הצטרך in the conjugation game and choose a gloss. (4) Ensure הנחה (discount) and tattoo are in the translation game. (5) Propose and add new sentences.

**Change:**
- `app/sentence-bank.js` — `getSentenceBankPromptSpeechPayload` now passes `niqqud: question.sentence?.hebrewNiqqud` to `buildSpeechPayload`. Root cause of the מספר bug: this was the only speech payload in the app built from unpointed text, so the he-IL TTS guessed vowels (מִסֵּפֶר). The data already had correct מִסְפָּר niqqud; the speech layer already preferred `niqqud` when given (speech.js override chain). Fixes every ambiguous word in Shema/Hebrew-prompt sentences, not just מספר.
- `hebrew-verbs.js` — (a) Removed `common-verb-tzarich` (present-only צריך) and added `common-verb-lehitztarech`: להצטרך, hitpael of צ-ר-כ (with צ+ת→צט metathesis), curated, past + future only (17 vocalized forms: הִצְטָרַכְתִּי…, אֶצְטָרֵךְ…), gloss "to need" → deck labels "I needed" / "I will need" auto-generate correctly; no present (מצטרך is nonstandard — present is the modal צריך, taught via sentences) and no imperative. `translationQuiz: false`. (b) Flipped 11 more entries out of the translation quiz (pattern of the two earlier cleanup passes): added starter-verb-lishmor, starter-verb-leshacharer, starter-verb-lekhabot, starter-verb-letzanen, advanced-verb-lehishtamesh to `TRANSLATION_HIDDEN_STARTER_VERB_IDS`; set inline `translationQuiz: false` on physical-verb-limchotz, common-verb-latzet, common-verb-lipol, common-verb-lakum, common-verb-lishmoa, common-verb-lachzor. לשחרר/לכבות/לצנן/למחוץ were double-listed (verb-seed + vocab-data copies both in the translation pool); the rest were too-simple. Only the intentionally advanced seeds (למעוך, לנתח, לדון ב־, להתקיים, לארח) still feed the translation game.
- `vocab-data.js` — added `["tattoo", "קעקוע", "קַעֲקוּעַ"]` to `social_cultural`. (הנחה = discount was already present in groceries_food; verified only.)
- `sentence-bank-data.js` — 10 new entries (everyday_31–36, colloquial_33–36) targeting coverage gaps: אצטרך usage (everyday_31), the previously sentence-less new conjugation verbs זוכר/מוכר/לשלם/מקבל/מחפש/סיפרה, הנחה (everyday_34), קעקוע (colloquial_34), and final-letter handwriting coverage — ף in the picker pool goes 1→4 and ץ 1→3 (everyday_36, colloquial_35). All are 17–30 Hebrew letters, so all are handwriting-eligible; everyday_32/35 carry feminine hebrew_alternates (זוכרת/מחפשת). Bumped `__build` to 20260704a.
- `tests/sentence-bank-data.test.js` — entry-count assertions 115 → 125.
- `index.html` — cache-bust `?v=20260704b` on vocab-data.js, sentence-bank-data.js, hebrew-verbs.js, app/sentence-bank.js.

**Files changed:** `app/sentence-bank.js`, `hebrew-verbs.js`, `vocab-data.js`, `sentence-bank-data.js`, `tests/sentence-bank-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Shema (and any Hebrew sentence prompt) now feeds fully vocalized text to the TTS — מספר is read "mispar". Conjugation game: צריך's present-only round is gone; להצטרך appears with past/future rounds ("needed"/"will need"). Translation game: 12 verb cards removed (to need, keep, go out, fall, get up/rise, hear/listen, return/come back, use, and the doubled free/turn off/chill/crush copies); "tattoo" added. Sentence builder + Shema gain 10 sentences; the handwriting picker pool grows ~50→56 with real ף/ץ coverage.

**Tests run:** `npm test` — 213/213 pass before and after (sentence-count test updated 115→125). Node checks: seed vocabulary now exposes exactly 5 translation-visible verbs; להצטרך in deck with 17 forms, all vocalized, correct English labels; צריך absent; קעקוע/הנחה each present once; formerly doubled verbs now single. Browser-verified on the dev server: live Shema round builds its speech payload with niqqud (`סַבַּבָּה, מָחָר…`); a conjugation round renders and plays normally; all 10 new sentences survive `prepareSentenceBankDeck` (125 entries) with the everyday_32 feminine alternate intact; no console errors.

**Risks / regressions to check:** (1) TTS voices now receive pointed text everywhere in Shema — macOS/iOS Carmit handles niqqud well, but spot-check another platform's he-IL voice for regressions on previously fine sentences. (2) הצטרך niqqud is hand-authored (hitpael pattern) — worth a fluent-reader spot-check, esp. הִצְטָרַכְתֶּם/הִצְטָרְכָה. (3) The 10 new sentences' niqqud/distractors are self-reviewed; the ktiv-male plain vs ktiv-haser-menuqad split follows existing convention. (4) If צריך-the-word should still be drilled somewhere outside conjugation, it now appears only inside sentences (everyday_01/04/17, colloquial_33 etc.), not as a card.

### 2026-07-05 — Second-chance review rounds for Prepositions/Conjugation+/Binyanim; Review page rebuilt as 3 sub-tabs with Word Bank

**Requested:** (1) The prepositions game had no end-of-session mistake review — add one, and identify which other games are missing review rounds and implement where sensible. (2) Reorganize the Review page to surface the richer stats the app already collects, deciding on sub-pages. User chose: second-chance phases for Prepositions + Conjugation+ + Binyan Board (match-grid games and handwriting excluded); Review page as 3 sub-tabs (Overview / Trouble Spots / Word Bank) with a full word browser.

**Change — Part A (second-chance phases), mirroring the sentence-bank precedent (own intro overlay replays as the break; review answers update streak/wrongAnswers/persistent stats but award no sessionScore; items dedupe by key and never re-queue during review):**
- `app/bootstrap-runtime.js` — added `inReview/reviewQueue/secondChanceCurrent/secondChanceTotal` to the prepositions, advConj, and binyanBoard state defaults (also removed masteredModalOpen/masteredSelection — see Part B).
- `app/prepositions.js` — `applyPrepositionsAnswer`: sessionScore gated on `!question.isReview`; misses dedupe `sessionMistakes` by `triggerId:objectKey` and push a reset clone (reshuffled options, unlocked, `isReview:true`) to `reviewQueue`; new `tryStartPrepositionsReviewPhase()`; `loadPrepositionsQuestion` drains the review queue through the normal queue after replaying the intro, and now increments `currentRound`/`secondChanceCurrent` only when a question actually loads (fixes the counter overshooting to N+1 at finish).
- `app/adv-conj.js` — same shape, reusing the existing `idiomId::tense::subject::object::direction` mistake key for review dedup.
- `app/binyan-board.js` — misses enqueue `formId`; `finishRoot` starts the review phase (intro replay) before `finishBinyanBoard` when all roots clear; new `loadBinyanBoardReviewQuestion()` rebuilds questions from the deck via the existing `buildBinyanBoardQuestion` (fresh distractors) with `isReview=true`; `beginBinyanBoardFromIntro`/`handleBinyanBoardNext` route into the review loader; `finishBinyanBoard` reports review rounds. `correctCount` stays unconditional so summary totals include review rounds; `sessionScore` gated.
- `app/session.js` — reset functions carry the new fields; `finishPrepositions`/`finishAdvConj` compute `correct = rounds + reviewRounds − wrong`, reset the fields, and pass `summary.lessonNote {count}` when a review ran (previous notes preserved when not).
- `app/ui.js` — header meta + session header for all three games show "Second chance: X/Y" progress and review titles during the phase.
- `app/bootstrap-data.js` — new EN+HE `session.advConjSecondChanceTitle` / `prepositionsSecondChanceTitle` / `binyanSecondChanceTitle`.
- Note: `summary.noteKey` is stored but the current results screen renders only the praise line — identical to sentence-bank's existing (undisplayed) note; kept for parity.

**Change — Part B (Review page 3 sub-tabs):**
- `index.html` — `#reviewPanel` now holds a segmented `#reviewTabs` bar (role=tablist) and three tabpanels: Overview (4 stat cards `#reviewStatDue/Mastered/Sentences/Letters` + the existing domain/mode analytics grids), Trouble Spots (existing Most Missed + new Toughest Sentences, Hardest Verbs, Weakest Letters sections), Word Bank (`#wordBankSearch`, domain filter chips, count, scrollable list). Deleted the `#masteredModal` block — it was dead code (no launcher ever set `masteredModalOpen=true`); the Word Bank's per-row toggle replaces its only capability.
- `app/data.js` — new `getReviewOverviewStats()` (due = attempted words past nextDue; mastered count), `getHardestVerbs(limit)` (conjugationAttempts ≥ 3, below-perfect, sorted accuracy asc), `getWordBankEntries()` (full translation pool incl. mastered, with accuracy/level/due/new/domain per word).
- `app/sentence-bank.js` — new `getWorstSentences(limit)` (per-direction records with attempts ≥ 2 and ≥ 1 miss, sorted by miss rate) and `getPracticedSentenceCount()`.
- `app/handwriting-core.js` — new pure `rankWeakestLetters()` (min-attempts filter; box asc, lastScore asc, order asc) and `countLearnedLetters()` (box ≥ 3); `app/handwriting.js` — thin `getWeakestLetters`/`getLearnedLetterCount` wrappers over stored progress.
- `app/bootstrap-runtime.js` — `reviewTab` state (validated, restored from UI prefs) + non-persisted `wordBank {search, domain}`; element registry swaps the 5 mastered-modal entries for the 19 new review/wordbank elements.
- `app/persistence.js` — `persistUiState` now saves `reviewTab`.
- `app/ui.js` — `renderReviewState` (was an empty stub) toggles tabs/panels and dispatches per-tab renderers, early-returning when `route !== "review"` so mid-game renderAll()s do no data work; new `renderReviewOverviewStats`, `renderTroubleSpots` (compact rows + letter chips), `renderWordBankFilters`, `renderWordBankList` (~1,128 rows via DocumentFragment, no per-row listeners). Removed `closeMasteredModal`/`renderMasteredModal`/`restoreSelectedMasteredWords` and the `masteredModalOpen` UI-lock term.
- `app/controller.js` — tab clicks (persisted), search input, delegated filter-chip and mastered-toggle clicks (toggle calls `setWordMastered` + `saveProgress` + re-render); removed mastered-modal listeners, its Escape branch, and reset-handler references.
- `app.js` — removed the mastered-modal const bindings, boot-guard checks, and helper registrations (load-bearing: the guard throws if names go missing).
- `app/bootstrap-data.js` — new EN+HE `review.*` (tab labels, stat labels, trouble-spot titles, directions, letterBox) and `wordBank.*` namespaces; pruned the modal-only `mastered.*` keys (kept moveCurrent/streakStatus/ready/added used by verb-match).
- `styles.css` — `.review-tabs/.review-tab(.active)`, `.review-tab-panel`, `.review-stats-grid` (2-col mobile / 4-col desktop), `.review-stat-*`, `.trouble-list`, `.letter-chip*`, `.wordbank-*` (search, chips, scrollable list, rows, round toggle); removed `.mastered-*` styles; desktop `.review-panel-content` two-column layout replaced with single column (each tab shows one panel); Hebrew-UI RTL overrides for wordbank rows/labels.
- `index.html` — cache-bust `?v=20260705a` on all 15 touched files (app.js, adv-conj, binyan-board, bootstrap-data, bootstrap-runtime, controller, data, handwriting-core, handwriting, persistence, prepositions, sentence-bank, session, ui, styles.css).

**Files changed:** `app/prepositions.js`, `app/adv-conj.js`, `app/binyan-board.js`, `app/session.js`, `app/ui.js`, `app/bootstrap-runtime.js`, `app/bootstrap-data.js`, `app/persistence.js`, `app/data.js`, `app/sentence-bank.js`, `app/handwriting-core.js`, `app/handwriting.js`, `app/controller.js`, `app.js`, `styles.css`, `index.html`, `tests/app-progress.test.js`, `tests/handwriting-core.test.js`, `task-log.md`.

**Behavior changed:** Prepositions, Conjugation+, and Binyanim now re-ask each missed question once at session end after their intro overlay replays, with the header showing "Second chance: X/Y" and a review title; review answers earn no score but count in summary totals; zero-miss sessions are unchanged. The Review tab is now three sub-tabs: Overview (due/mastered/sentences/letters stat cards + the relocated analytics grids), Trouble Spots (most-missed words, toughest sentences per direction, hardest verbs by conjugation accuracy, weakest cursive letters by Leitner box), and Word Bank (searchable, domain-filterable browser of all 1,128 words with accuracy/level/due status and a mastered toggle that adds/removes words from the translation pool). The selected tab persists across reloads. The unreachable mastered-words modal is gone.

**Tests run:** `npm test` — 213/213 before, 223/223 after (10 new: three per-game review round-trips incl. dedup/no-re-queue/no-score assertions, header second-chance meta for all three games, review markup shape, getHardestVerbs, getWorstSentences + practiced count, reviewTab persistence + word-bank mastered round-trip, rankWeakestLetters, countLearnedLetters). Browser-verified on the dev server (375px + desktop, EN + HE): full 10-round prepositions session with 1 miss → intro replay → "Prepositions Review" header with "Second chance: 1/1" → correct review answer adds no score → summary notes 1 review round; Review page tabs switch and persist; Overview stats show live numbers; Trouble Spots populates all four sections from seeded progress; Word Bank search (EN+HE), domain chips, and mastered toggle round-trip (pool count drops/restores); Hebrew UI fully translated with RTL rows; Escape key clean; no console errors.

**Risks / regressions to check:** (1) Review-phase question clones in prepositions/advConj hold live object references in state — these sessions were already non-persistent across reloads, unchanged. (2) `summary.lessonNote` ("Second-chance rounds: N") is stored but the current results screen doesn't render notes — same as sentence-bank today; if the note should be visible, that's a small follow-up in `renderSummaryState`. (3) Anyone who had the (unreachable) mastered modal open via console hacks loses that path; Word Bank replaces it. (4) The desktop review panel is now single-column — the old side-by-side Most Missed/analytics layout is gone by design. (5) Binyan review questions rebuild with fresh distractors from the deck — a form whose root left the deck is skipped silently.

### 2026-07-11 14:59 EDT — Expand sentence bank with 60 high-utility sentences

**Requested:** Implement the approved 60-sentence expansion: 24 everyday, 16 colloquial, 12 professional, and 8 formal entries, with complete niqqud, aligned chips/distractors, gender alternatives, tests, cache busting, and runtime checks.

**Files changed:**
- `sentence-bank-data.js` — added a small internal authoring helper plus `everyday_37–60`, `colloquial_37–52`, `professional_26–37`, and `formal_29–36`; every entry includes pointed Hebrew, parallel pointed token/distractor arrays, phrase-sized English chips, 4–6 contrastive distractors per language, teaching notes, and the planned feminine alternatives. Updated the data build to `20260711b`.
- `tests/sentence-bank-data.test.js` — updated the expected bank size to 185 and added expansion-specific checks for IDs, category/difficulty distribution, niqqud/array alignment, chip coverage, distractor quality, and gender alternatives.
- `index.html` — bumped the sentence-bank data cache-buster to `20260711b`.
- `task-log.md` — recorded this work.

**Behavior changed:** Sentence Builder and Shema now draw from 185 sentences instead of 125, with substantially broader transit, restaurant, shopping, healthcare, housing, bureaucracy, conversational-repair, workplace, and analytical coverage. Forty-eight of the 60 new sentences meet the handwriting game's 6–34-letter eligibility window.

**Tests run:** Baseline `npm test` — 223/223 pass. `node --test tests/sentence-bank-data.test.js` — 20/20 pass. Final `npm test` — 225/225 pass. `git diff --check` — pass. Browser-verified on the local dev server: Sentence Builder launches and renders a full draggable/tappable round; at 375×812 the gameplay nav hides, compact Home control shows, chips wrap without horizontal overflow, and the board remains usable above the footer; Shema launches with hidden prompt plus Play/Slower controls, and manual Play produces no console warning/error. Live HTML requests `sentence-bank-data.js?v=20260711b`.

**Risks / regressions to check:** (1) The new niqqud is manually authored and follows the bank's existing ktiv-male/plain versus ktiv-haser/pointed convention; a fluent-reader spot check remains worthwhile, especially for loanwords such as רב־קו, אלרגיה, אינסטלטור, and דוגרי. (2) Browser TTS voices differ by platform, so spot-check רב־קו, כספומט, and the new formal compounds on the deployment target. (3) The bank is now 60 entries larger; session selection is weighted and remains performant in current testing, but future very large expansions may justify moving the compact authoring rows into a separate generated data source.

### 2026-07-11 15:41 EDT — Accept natural sentence orders; add הגיוני, חוקר, and להזהיר

**Requested:** Accept grammatically and logically equivalent Hebrew word orders throughout the newly added sentence set (specifically including מה בדיוק זה אומר), add הגיוני to Translation Match with at least two example sentences, add חוקר to Translation Match, and add מזהיר / להזהיר to the conjugation game.

**Files changed:**
- `sentence-bank-data.js` — added 30 explicitly authored natural word-order alternatives across the 60-entry expansion, including combined feminine/reordered forms where needed; added `everyday_61` and `colloquial_53`, both using הגיוני and each carrying a second natural clause/order arrangement; bank count is now 187; build bumped to `20260711c`.
- `vocab-data.js` — added הגיוני (“logical / reasonable”) and חוקר (“researcher”) as Translation Match vocabulary; build bumped to `20260711b`.
- `hebrew-verbs.js` — added curated, fully pointed Hif'il conjugations for להזהיר (“to warn”), including present מזהיר, past, future, and modern imperative forms; kept the verb conjugation-only in the translation availability metadata; build bumped to `20260711b`.
- `tests/sentence-bank-data.test.js` — updated count/category/difficulty expectations and added coverage for the 30 reordered rows and the reported מה בדיוק זה אומר order.
- `tests/vocab-data.test.js` — asserted both new vocabulary cards are Translation Match eligible.
- `tests/hebrew-verbs.test.js` — asserted the authoritative warn paradigm and conjugation-only availability.
- `index.html` — bumped cache-busters for all three changed data files.
- `task-log.md` — recorded this work.

**Behavior changed:** Sentence Builder accepts ordinary equivalent orderings for the audited new rows instead of requiring only the displayed order; the reported מה בדיוק זה אומר answer is accepted. The bank now contains two additional practical הגיוני sentences. Translation Match can serve הגיוני and חוקר. Conjugation can serve להזהיר, including מזהיר and its other person/tense forms.

**Tests run:** Baseline `npm test` — 225/225 pass. Focused `node --test tests/sentence-bank-data.test.js tests/vocab-data.test.js tests/hebrew-verbs.test.js` — 57/57 pass. Final `npm test` — 228/228 pass. `git diff --check` — pass. Direct runtime inspection confirmed the reported alternate, both new sentences, both Translation Match entries, and the מזהיר conjugation card.

**Risks / regressions to check:** Word-order equivalence is deliberately authored per sentence; it does not accept arbitrary permutations. Marked-but-possible orders remain rejected unless they are natural enough to teach. Shema still requires the exact spoken order by design. A fluent-reader spot check of the newly authored niqqud and the less common imperative הַזְהֵר remains worthwhile.

### 2026-07-12 16:00 EDT — Plan a large Translation Match vocabulary expansion

**Requested:** Audit the current Translation Match vocabulary and the full sentence bank, identify high-impact coverage gaps, and produce a concrete plan for a large vocabulary addition. Also diagnose why the initially opened Codex workspace appeared empty and confirm whether the recent Ulpango changes were visible.

**Files changed:**
- `generated/vocabulary-expansion-plan.md` — added a current-state audit and a four-batch, 144-card expansion plan covering conversation glue, advanced verbs, professional/analytical vocabulary, and Israeli colloquial/practical chunks, plus implementation sequencing, progress-safety guardrails, and acceptance criteria.
- `task-log.md` — recorded this planning session.

**Behavior changed:** None. This task produced a reviewed implementation plan only; no game data or application code changed.

**Tests run:** Loaded `vocab-data.js` and `sentence-bank-data.js` through their runtime APIs to verify 1,210 base vocabulary entries, 1,156 Translation Match-eligible base entries, 35 vocabulary categories, and 328 sentences (106 everyday / 97 colloquial / 65 professional / 60 formal). Cross-referenced recurring sentence tokens against Translation Match entries and checked proposed Hebrew forms for exact base-vocabulary collisions. `git diff --check` — pass.

**Risks / regressions to check:** (1) Current base vocabulary IDs include each row's array index, so implementation must append rather than insert/reorder rows or saved learner progress may be orphaned. (2) Proposed polysemous entries need concise learner-facing gloss review. (3) Niqqud is intentionally deferred to implementation and needs fluent review. (4) The initial access problem was workspace selection only: this Codex task opened in `/Users/mikesexton/Documents/New project`, while the healthy, clean Ulpango checkout is `/Users/mikesexton/Documents/Ulpango` on `main` at `7f7d156`, synchronized with `origin/main`.

### 2026-07-12 16:10 EDT — Add a single-line mobile gate to the vocabulary plan

**Requested:** Ensure proposed compound words and phrases in Translation Match are not long enough to wrap cards onto two lines on mobile or other interfaces.

**Files changed:**
- `generated/vocabulary-expansion-plan.md` — clarified that table glosses are provisional, added a one-line-only card guardrail, specified deterministic 320px/375px browser checks in both UI languages with niqqud on/off, and added the requirement to shorten or exclude cards that wrap rather than shrinking them further.
- `task-log.md` — recorded the planning refinement.

**Behavior changed:** None. This tightens the future implementation and visual acceptance criteria only.

**Tests run:** Inspected the live Translation Match rendering path and responsive styles. Confirmed the current implementation allows wrapping (`white-space: normal`, `overflow-wrap: anywhere`), applies reduced typography after 16 characters, and filters only above 40 characters, so character count alone cannot guarantee a single line. `git diff --check` — pass.

**Risks / regressions to check:** The proposed 144-card tables contain semantic descriptions rather than final display labels. Several English glosses and some Hebrew chunks will need shortening or removal during implementation to pass the new rendered-width gate.

### 2026-07-12 16:25 EDT — Implement the 144-card Translation Match expansion

**Requested:** Implement the approved four-batch Translation Match vocabulary expansion, while ensuring compound cards remain on one line on mobile and other interfaces.

**Files changed:**
- `vocab-data.js` — appended 144 fully pointed, Translation Match-eligible entries without inserting or reordering existing rows: 36 high-utility advanced verbs in `core_advanced`, 72 conversation/colloquial/practical cards in `conversation_glue`, and 36 professional/analytical bridge words in `scientific_analytical`. Final base lexicon is 1,354 entries, of which 1,300 are Translation Match eligible. Bumped `__build` to `20260712c`.
- `tests/vocab-data.test.js` — added expansion count/category checks, append-only ID boundary assertions, niqqud and exact-gloss collision checks, and a narrow-mobile length stress envelope.
- `generated/vocab-mobile-fit-audit.html` — added a deterministic same-origin QA fixture that renders all 144 additions in the production match-card layout, pairing English with both pointed and unpointed Hebrew and supporting English/Hebrew UI direction.
- `generated/vocabulary-expansion-plan.md` — marked the plan implemented and synchronized the few final label choices (`data collection`, `preparedness`, `governability`, and `data reliability`).
- `index.html` — bumped the `vocab-data.js` cache-buster to `20260712c`.
- `task-log.md` — recorded the implementation.

**Behavior changed:** Translation Match gains 144 high-impact cards spanning conversation glue, everyday Israeli chunks, advanced verbs, and professional/analytical vocabulary. Base playable vocabulary grows from 1,156 to 1,300 cards. Existing 1,210 entries retain their original IDs, so saved learner progress remains attached.

**Tests run:** Baseline `npm test` — 228/228 pass. Focused `node --test tests/vocab-data.test.js` — 10/10 pass. Final `npm test` — 231/231 pass. Runtime comparison against `HEAD:vocab-data.js` confirmed exactly 144 additions, zero changed/missing legacy ID+gloss records, and zero new exact Hebrew or English collisions. Hebrew Academy terminology was checked for high-risk professional forms including הִתָּכְנוּת, הֵעָרְכוּת, מְהֵימָנוּת, and מְשִׁילוּת. Browser audit with the production stylesheet rendered 576 stress cards (English + pointed Hebrew and English + plain Hebrew for every addition): zero multi-line or horizontally overflowing labels at 320px and 375px; Hebrew UI at 320px also had zero offenders. Live app loaded `vocab-data.js?v=20260712c` with no browser console warnings/errors. `git diff --check` — pass.

**Risks / regressions to check:** (1) Niqqud is hand-authored; the sentence-linked forms were aligned to existing sentence data and uncertain professional forms were checked against Academy terminology, but a fluent-reader pass remains worthwhile. (2) The permanent mobile-fit fixture depends on production class names and should be updated if the Translation Match markup changes. (3) Some colloquial chunks intentionally use compact learner-facing glosses rather than exhaustive literal definitions. (4) Existing position-based ID generation remains fragile if future work inserts or reorders rows; append-only authoring is still required.

### 2026-07-12 19:03 EDT — Simplify slash-separated game definitions

**Requested:** Audit Translation Match and Conjugation for cards that display two English definitions separated by a slash, and prefer one primary gloss when the meanings are similar, especially “stay / remain.”

**Files changed:**
- `vocab-data.js` — replaced all 41 slash-bearing playable Translation Match labels with one primary English gloss; retained each former English label as an ID-only source so every existing card ID remains stable; bumped the data build to `20260712d`.
- `hebrew-verbs.js` — simplified the learner-facing senses “to start / begin” to “to start” and “to stay / remain” to “to stay”; bumped the data build to `20260712c`.
- `tests/vocab-data.test.js` — updated affected expectations and added a complete playable-card slash audit plus representative legacy-ID assertions.
- `tests/hebrew-verbs.test.js` — added a seed-sense audit that rejects spaced slash synonym pairs and explicitly checks להתחיל and להישאר.
- `index.html` — bumped the vocabulary and verb-data cache-busters.
- `task-log.md` — recorded this work.

**Behavior changed:** Translation Match now shows one primary English meaning on every playable card, with examples including “logical,” “experience,” “acceptable,” “stock,” and “cash register.” Conjugation now renders “to stay” and forms such as “we stayed,” without the repeated “/ remain”; “to start” is similarly simplified. Grammar patterns that use slash notation, such as alternative governed prepositions, are unchanged because they are not competing definitions. Saved Translation Match progress remains attached to the same IDs.

**Tests run:** Baseline `npm test` — 231/231 pass. Focused `node --test tests/vocab-data.test.js tests/hebrew-verbs.test.js` — 41/41 pass; final vocabulary-only recheck `node --test tests/vocab-data.test.js` — 11/11 pass. Final `npm test` — 233/233 pass. Runtime comparison with `HEAD:vocab-data.js` confirmed all 1,210 pre-expansion ID+Hebrew records remain present and stable. Browser verification loaded `vocab-data.js?v=20260712d` and `hebrew-verbs.js?v=20260712c`, launched a fresh Conjugation round, found no button overflow in the narrow viewport check, and reported no console warnings/errors. `git diff --check` — pass.

**Risks / regressions to check:** Polysemous words now teach one selected primary sense in Translation Match; secondary senses such as ניסיון “attempt,” דמיון “similarity,” and קיום “fulfillment” are intentionally no longer printed on the isolated card. They can be taught later as separate sense-specific cards or through sentences if needed. Stable ID-English overrides live in the existing fourth-field metadata object alongside other card metadata.

### 2026-07-12 19:40 EDT — Pre-publish cleanup audit

**Requested:** Check whether the completed Translation Match and Conjugation changes need any cleanup before committing to GitHub and merging with `main`.

**Files changed:**
- `vocab-data.js` — converted the legacy ID-English overrides from bare fourth-field strings to named `idEnglish` properties in the existing row metadata object, keeping the data shape consistent with other card metadata.
- `generated/vocab-mobile-fit-audit.html` — synchronized the vocabulary cache-buster with the final `20260712d` data build.
- `task-log.md` — corrected the ID-override implementation note and recorded this audit.

**Behavior changed:** None. The cleanup preserves the same visible glosses, card IDs, vocabulary counts, and game behavior.

**Tests run:** `git fetch origin --prune` confirmed local `main` is 0 ahead / 0 behind `origin/main`. `npm test` — 233/233 pass. Runtime comparison against `HEAD:vocab-data.js` confirmed all 1,210 legacy ID+Hebrew records remain stable; the playable vocabulary contains zero slash labels and introduces zero new English/Hebrew conflicts. Repository scans found no merge markers, TODO/FIXME/debug statements, or whitespace errors in the changed files. `git diff --check` — pass.

**Risks / regressions to check:** No blocking cleanup remains. The working tree is intentionally uncommitted on `main`; create a feature branch before committing so the changes can be reviewed and merged through the repository's normal pull-request flow. Both new files under `generated/` are intentional deliverables and should be included in the commit.

### 2026-07-13 19:57 EDT — Political vocabulary, sentences, and abbreviations expansion

**Requested:** Add אנדרטה and a large, high-value political vocabulary tranche; cover Israeli–Palestinian and internal Israeli discourse, including conflict terminology, civil rights, LGBT life, olim, young adults, the middle class, and Tel Aviv; add a similarly broad political sentence tranche; avoid massacre/genocide content and excessive named figures; add relevant abbreviations including LGBT.

**Files changed:**
- `vocab-data.js` — added 150 append-only Translation Match cards after the existing politics/society rows, including אנדרטה, כיבוש, אלימות משטרתית, אפליה, התנקשות, רצח, השמדה, התנחלות, אלימות מתנחלים, foundational civics, courts, media, labor/housing, religion–state, olim, and LGBT terminology; prioritized foundational cards ahead of niche cultural rows; marked the competing judicial labels as supporters' and opponents' terms; bumped the vocabulary build to `20260713a`.
- `sentence-bank-data.js` — added 50 fully authored political/society rows (12 colloquial, 12 everyday, 12 professional, 14 formal) with pointed Hebrew, answer chips, distractors, and learning notes; corrected Knesset legislative sequence, hiring-policy wording, institutional English, and conventional niqqud; bumped the sentence build to `20260713b`.
- `abbreviation-data.js` — added 20 playable modern abbreviations (`abbr-210`–`abbr-229`), including להט״ב, להטב״ק+, רש״פ, אש״ף, מח״ש, דו״צ, מתפ״ש, שב״חים, מו״מ, חל״ת, מל״ג, רה״ע, identity labels, party names, and רל״ב; kept every visible English label within Abbreviation Match's 40-character eligibility limit.
- `tests/vocab-data.test.js`, `tests/sentence-bank-data.test.js`, and `tests/abbreviation-data.test.js` — updated totals and added continuity, scope, pointing, consonantal-alignment, uniqueness, framing, content-boundary, named-figure, category-mix, and match-width regressions.
- `index.html` — cache-busted all three changed data files.
- `task-log.md` — recorded the expansion and verification.

**Behavior changed:** Translation Match now contains 1,504 vocabulary cards, 1,450 playable, with 150 new political/society cards. Sentence Builder now contains 448 rows, including 50 new political/society sentences across four registers. The abbreviation source now contains 228 rows, with all 20 new abbreviations playable and eligible for Abbreviation Match. Only one new sentence names a political figure (`colloquial_148`, Bibi); the new content contains no massacre/genocide terms. Charged terminology is taught directly but with attribution, allegation markers, or framing notes where appropriate.

**Tests run:** Baseline `npm test` — 240/240 pass. Focused `node --test tests/vocab-data.test.js tests/sentence-bank-data.test.js tests/abbreviation-data.test.js` — 44/44 pass. Final `npm test` — 243/243 pass. Runtime audit confirmed 150 new vocabulary cards, 50 new sentence rows, 20 new playable abbreviations, all new abbreviation English labels at or below 40 characters, zero banned new-content matches, one Bibi/Trump sentence, and the expected `20260713a` / `20260713b` builds and cache-busters. `git diff --check` — pass.

**Risks / regressions to check:** Some political labels are inherently contested or context-sensitive; the tranche explicitly distinguishes supporters' and opponents' judicial terminology and keeps contested claims attributed. Conventional pointed Hebrew may use defective spelling while the unpointed game text uses modern full spelling, so sentence tests compare consonantal skeletons and require niqqud rather than demanding letter-for-letter identity. No commit or push was performed.

### 2026-07-13 21:37 EDT — Political sentence-bank QC and compact-chip authoring standard

**Requested:** Recheck the political expansion for quality; replace the illegible `formal_71` English “the plan was deposited”; make Hebrew and English chips follow the same roughly-one-word/one-meaning logic; eliminate long compounds such as “of the police-brutality allegations” and “before publishing the data”; and record/systematize the authoring rules so future agents do not repeat the problem.

**Files changed:**
- `sentence-bank-data.js` — audited all 50 new political rows in both languages and both chip banks. Rewrote `formal_71` in plain procedural language (“was published so the public could submit objections”), split the reported police-brutality and publication examples, fixed remaining clause-sized/modifier-packed chips, restored the omitted meaning in `everyday_129`, improved several calqued or unnatural full translations, corrected distractor grammar/agreement/register, fixed stale notes and pointed forms, and bumped the sentence build to `20260713d`.
- `tests/sentence-bank-data.test.js` — made the compact-chip policy apply automatically to the political append points and later IDs; changed the English default from two content words to one; added a reviewed reusable glossary for genuine terms/names/fixed expressions, exact keyed exceptions for irreducible grammar, target-count parity, Hebrew/English hard limits, rejected-pattern regressions, stale-registry checks, and exact regressions for the reported rows. Marked the older phrase-compaction/shape-matching behavior as legacy rather than new authoring precedent.
- `docs/sentence-bank-authoring.md` — added the durable authoring standard, examples, distractor/alternate rules, review checklist, glossary/exception procedure, and an explicit statement of what automation cannot infer.
- `AGENTS.md` — made the sentence-bank guide mandatory reading and added the split-first/glossary-last rule for future agents.
- `index.html` — cache-busted `sentence-bank-data.js` to `20260713d`.
- `task-log.md` — recorded the QC pass and permanent guardrails.

**Behavior changed:** The 50 political rows now use natural standalone English and substantially finer bilingual chips. `formal_71` no longer exposes either “deposited” or the awkward replacement “was opened to public objections.” `formal_68` separates the institution, aspect verb, review action, allegations, relation, and `police brutality`; `professional_81` separately tests `before`, `publishing`, and `the data`. Normal modifiers such as “simple explanation,” “cheaper apartment,” and “serious questions” were split, while established units such as `police brutality`, `polling station`, and `civil marriage` remain intact. Future rows at or after the current append boundaries fail if an unregistered English chip carries more than one meaning-bearing word.

**Tests run:** Baseline `npm test` — 243/243 pass. Focused final `node --test tests/sentence-bank-data.test.js` — 24/24 pass. Final `npm test` — 245/245 pass. `git diff --check` — pass. The focused suite also verifies all 50 new rows reconstruct both full sentences, have aligned pointed/plain Hebrew, contain 4–6 non-reused distractors per side, keep equal target-chip counts, and use every multiword-glossary or exact-grammar exception without stale entries.

**Risks / regressions to check:** (1) Automated content-word counting is deliberately conservative for English, but no test can reliably infer Hebrew semantic boundaries or contested termhood; the documented bilingual read-through remains mandatory. (2) The reusable multiword glossary contains only reviewed current terms; future additions should split first and extend it only for independently learnable vocabulary. (3) Older rows remain grandfathered under legacy compaction tests and were not migrated in this task. (4) No commit or push was performed.

### 2026-07-13 21:43 EDT — Publish and merge political language expansion

**Requested:** Push the completed political vocabulary, sentence, abbreviation, and QC work to GitHub and merge it into `main`.

**Files changed:** `task-log.md` — recorded the publication. The merged change set itself contains `AGENTS.md`, `abbreviation-data.js`, `docs/sentence-bank-authoring.md`, `index.html`, `sentence-bank-data.js`, `task-log.md`, the three related data tests, and `vocab-data.js`.

**Behavior changed:** The political language expansion and compact-chip QC rules are now published on GitHub `main` through pull request #37.

**Tests run:** `npm test` immediately before push — 245/245 pass. `git diff --check` before publication — pass. GitHub reported PR #37 clean and mergeable; merge commit `59a5045` was created successfully.

**Risks / regressions to check:** None specific to publication. The feature branch was deleted after merge; local and remote `main` were synchronized at the merge commit before this log-only follow-up.
### 2026-07-14 21:34 EDT — Vocabulary, sentence, and practical conjugation expansion

**Requested:** Add השבעה (incantation), סחרחורת (dizziness), and גאון (genius) to Vocabulary; choose a small related vocabulary batch; add a decently sized verb batch to Conjugation; and add one sentence using שפתיים plus one using שתי שפות.

**Change:**
- `vocab-data.js` — added seven playable Core Advanced cards: השבעה, גאון, לחש, כישוף, כישרון, הברקה, and תעלומה. Reused the existing playable Health card for סחרחורת instead of creating a duplicate. Bumped the data build to `20260714a`.
- `hebrew-verbs.js` — added 12 curated practical verbs (לעדכן, לוותר, לאשר, לבטל, לצרף, לברר, להסכים, להספיק, להזכיר, להמליץ, להשפיע, להבהיר), each with authoritative pointed infinitive and all 21 modern present/past/future drill forms. Verb seeds grow 124 → 136 and study items grow 138 → 150. Bumped the data build to `20260714a`.
- `sentence-bank-data.js` — appended `everyday_137` ("היא הזיזה את השפתיים אבל לא אמרה כלום.") and `everyday_138` ("היא מדברת שתי שפות בעבודה בכל יום.") with pointed Hebrew, compact bilingual chips, shape-matched distractors, and learner notes. Sentence bank grows 448 → 450. Bumped the data build to `20260714a`.
- `tests/vocab-data.test.js` — added coverage for the three requested cards, updated vocabulary totals, and bounded the older 144-card expansion test to its original append-only ranges.
- `tests/hebrew-verbs.test.js` — added coverage for all 12 new verb entries, 21 forms per verb, niqqud on every visible form, and representative English/Hebrew forms.
- `tests/sentence-bank-data.test.js` — updated totals/category counts, included the two new rows in alignment validation, and asserted the requested terms appear.
- `index.html` — bumped cache versions for all three changed data files.

**Files changed:** `vocab-data.js`, `hebrew-verbs.js`, `sentence-bank-data.js`, `tests/vocab-data.test.js`, `tests/hebrew-verbs.test.js`, `tests/sentence-bank-data.test.js`, `index.html`, `task-log.md`.

**Behavior changed:** Vocabulary gains 7 new playable cards while preserving the existing dizziness card; Conjugation gains 12 verbs and 252 new tense/person form prompts; Sentences/Shema gains 2 everyday rows using the requested expressions.

**Tests run:** `npm test` before: 245 pass, 0 fail. `node --test tests/vocab-data.test.js tests/sentence-bank-data.test.js`: initially 36 pass, 2 fail (new test helper name and stale exact vocabulary count), then fixed. `node --test tests/hebrew-verbs.test.js tests/vocab-data.test.js tests/sentence-bank-data.test.js`: initially 67 pass, 1 fail (new test looked up a non-existent deck-level `lemma` field), then fixed. Final `npm test`: 248 pass, 0 fail. `git diff --check`: pass. Standalone data audit: 1,511 vocab cards / 1,457 playable, 450 sentences, 136 verb seeds / 150 verb study items; all 12 new verbs expose 21 forms.

**Risks / regressions to check:** (1) The new verbs intentionally omit imperative drills, so each contributes 21 present/past/future forms rather than 24 forms. (2) Pointed paradigms were hand-authored and cross-checked against standard conjugation patterns/Pealim; the highest-value read-aloud checks are the quadriliteral לעדכן, pe-aleph לאשר, guttural pi'el לצרף/לברר, and final-guttural להשפיע. (3) השבעה can also be read differently without context; the card's niqqud הַשְׁבָּעָה disambiguates the intended “incantation/adjuration” sense.

---

### 2026-07-14 22:19 EDT — Publish and merge vocabulary/conjugation/sentence expansion

**Requested:** Push the completed vocabulary, practical conjugation, and requested sentence additions to GitHub and merge them into `main`.

**Files changed:** `task-log.md` — recorded publication. The merged content commit contains `hebrew-verbs.js`, `index.html`, `sentence-bank-data.js`, `vocab-data.js`, the three related data tests, and the preceding task-log entry.

**Behavior changed:** The seven vocabulary cards, 12 conjugation verbs, and two sentence rows are now published on GitHub `main` through pull request #38.

**Tests run:** `npm test` immediately before publication — 248 pass, 0 fail. `git diff --check` and `git diff --cached --check` — pass. GitHub reported PR #38 clean and mergeable with no required remote checks; squash merge commit `baf6c5fe1ca617c5a8a73628a951fe79bcbb8149` was created successfully.

**Risks / regressions to check:** None specific to publication. The feature branch was deleted locally and remotely after the merge; local `main` was fast-forwarded to the GitHub merge commit before this log-only follow-up.

---

### 2026-07-18 14:53 EDT — Responsive gameplay width, centering, navigation, and handwriting sizing

**Requested:** Make non-Sentences/Shema gameplay content horizontally centered and full-width; keep Conjugation+ answers in one or two even columns; make Sentences and Shema use the full gameplay width without changing Hebrew/English edge alignment; show the homepage bottom navigation during every game; vertically center gameplay except on widescreen/landscape displays; reduce the handwriting entry box; identify other visible layout problems; and provide the local port.

**Files changed:**
- `styles.css` — removed the shell and tablet gameplay width caps; widened prompts/boards to the full lesson shell; added an even two-column answer grid from 600px upward (one column below it); centered gameplay vertically with safe overflow fallback; top-aligned gameplay at the 768px + 4:3 widescreen threshold; kept the bottom nav visible during mobile gameplay and restored its reserved space; made Sentences/Shema prompts full-width while preserving directional edge alignment; made their action footer static so it cannot cover answer chips; and reduced/centered the handwriting canvas with viewport-aware limits.
- `app/ui.js` — added an explicit `mode-handwriting` shell/prompt class so the handwriting stage stays one column while other standard quiz modes use the even two-column answer layout.
- `index.html` — cache-busted the changed stylesheet and UI module. The pre-existing sentence-bank cache bump remains untouched.
- `tests/app-progress.test.js` — updated sentence-width and persistent-navigation assertions and added responsive layout regressions for full-width boards, centering/top-alignment, even answer columns, non-overlapping sentence actions, and handwriting sizing.
- `task-log.md` — recorded this task.

**Behavior changed:** Gameplay now fills the available shell width. On tablet/desktop, four-option modes such as Conjugation+ render as a balanced 2×2 grid; narrow phones use one column. Sentences and Shema retain left-aligned English/right-aligned Hebrew but use the whole board, and Check no longer overlays the last word-bank row. Active games keep Home/Review/Settings visible at the bottom. Gameplay is vertically centered in portrait/tall layouts and top-aligned on landscape/widescreen layouts. The handwriting canvas is smaller and centered while retaining a practical tracing area.

**Tests run:** Baseline `npm test` — 255 pass, 0 fail. Final `npm test` — 256 pass, 0 fail. `git diff --check` — pass. Live browser verification on `http://127.0.0.1:4173/` covered 1024×1366, 768×1024, 1024×768, and 390×844: portrait gameplay centered; landscape gameplay top-aligned; Conjugation+ formed equal 2×2/one-column grids as intended; Sentences/Shema spanned the board with directional alignment intact and no footer overlap; handwriting measured 471px square at 768×1024; bottom navigation stayed visible at every tested size.

**Risks / regressions to check:** The top-alignment switch uses a 768px minimum width and a 4:3-or-wider aspect ratio, so landscape phones wider than 768px also top-align, which is desirable for their limited vertical space. Very long sentence banks may require scrolling because their action is intentionally non-sticky to prevent chip overlap. No unrelated pre-existing working-tree changes were modified or reverted.

---

### 2026-07-18 15:08 EDT — Widescreen sentence centering and combined GitHub publication

**Requested:** Center all Sentences and Shema board content only on widescreen displays; on phone and portrait layouts keep the existing directional alignment and center only the word counter; then publish the responsive display work together with the completed Hebrew word-order work and merge it into `main`.

**Files changed:**
- `styles.css` — centered the sentence word counter at every width and added widescreen-only centering for the Sentences/Shema prompt, answer line, and token bank at the existing 768px + 4:3 aspect-ratio breakpoint.
- `index.html` — cache-busted `styles.css` to `20260718d`.
- `tests/app-progress.test.js` — updated the counter-alignment regression and added explicit widescreen-only centering coverage for Sentences and Shema.
- `task-log.md` — recorded the alignment follow-up and publication workflow.

**Behavior changed:** On phone and portrait layouts, English and Hebrew sentence content stays on its directional edge while `Words: n/n` is centered. On landscape/widescreen layouts, the prompt, answer slots, word counter, and word bank all center. The full combined change set also includes the previously completed 25 reviewed Hebrew word-order variants and responsive gameplay/navigation/handwriting improvements.

**Tests run:** Baseline `npm test` — 256 pass, 0 fail. Final `npm test` — 257 pass, 0 fail. `git diff --check` and `git diff --cached --check` — pass. Live browser checks at 768×1024 confirmed edge-aligned content plus a centered counter; 1024×768 confirmed the entire board centers. `git fetch origin --prune` confirmed local `main` and `origin/main` were synchronized before branching. GitHub branch `agent/responsive-sentence-alignment-and-word-orders` was pushed and ready pull request #40 was opened against `main`; this log commit is the final branch update before the requested immediate squash merge.

**Risks / regressions to check:** The widescreen definition intentionally matches the gameplay top-alignment threshold, so both layout changes switch together at 768px and a 4:3-or-wider aspect ratio. No scoring, sentence grading, or Shema alternate-acceptance behavior changed in this follow-up.

---

### 2026-07-18 23:06 EDT — Display-font preference and compact mobile gameplay

**Requested:** Add a persistent Heebo/Frank Ruhl Libre display-font setting with Heebo as the default; apply it to every existing Frank Ruhl Libre surface and the specified Sentences, Conjugation, Binyanim, and Handwriting prompts; improve Hebrew readability where space permits; compact Binyanim and Handwriting so gameplay does not scroll at 360×640; restore vertical centering on landscape/widescreen displays and Settings; and add durable regression coverage and design constraints.

**Files changed:**
- `app/constants.js`, `app/persistence.js`, `app/bootstrap-runtime.js`, `app.js` — added the `ivriquest-font-v1` preference, default/validation logic, runtime state, startup restoration, and body attribute application.
- `app/i18n.js`, `app/ui.js`, `app/controller.js`, `app/bootstrap-data.js` — added immediate font toggling, selector rendering/accessibility, click wiring, and English/Hebrew Settings labels.
- `app/verb-match.js` — split Conjugation's English gloss and Hebrew infinitive into dedicated spans so only the infinitive uses the selected display font.
- `index.html` — imported Heebo, added the two-glyph Font segmented setting with Heebo first, set the pre-start default body attribute, and cache-busted every changed stylesheet/module.
- `styles.css` — introduced the shared display-font variable; migrated all former Frank surfaces; applied the requested prompt typography and safe font-size increases; compacted Binyanim's prompt, roots, choices, and footer; compacted Handwriting's prompt, canvas, feedback state, and one-row 44px toolbar; and removed the landscape top-alignment rule while preserving safe centering/overflow.
- `tests/app-progress.test.js` — added font default, toggle, persistence, restoration, body attribute, preview glyph, prompt-structure, font-coverage, and centering regressions.
- `tests/gameplay-layout.test.js` — added a rendered headless-Chrome regression covering Binyanim board/question/feedback and Handwriting initial/feedback states at 360×640, footer separation, toolbar geometry, widescreen gameplay centering, Settings centering, and short-screen Settings access.
- `AGENTS.md` — added the required 360×640 no-scroll/no-overlap viewport floor and related touch-target/safe-centering rules for future gameplay UI work.
- `task-log.md` — recorded this implementation.

**Behavior changed:** Heebo is now the default managed display font, while Settings can persistently switch all managed display surfaces to Frank Ruhl Libre. Hebrew Sentences prompts, Conjugation infinitives, Binyanim roots/forms, and Handwriting prompts now use that preference. Binyanim shows emoji, unchanged Assistant-styled formation, and Hebrew form on one compact line; Handwriting uses a smaller responsive canvas and a single-row toolbar. Both games fit without gameplay scrolling at 360×640, including feedback, and answer choices remain clear of the footer. Gameplay and fitting Settings content are vertically centered at landscape/widescreen sizes; oversized Settings remains top-reachable and scrollable.

**Tests run:** Baseline `npm test` — 257 pass, 0 fail. Focused `node --test tests/app-progress.test.js` — 123 pass, 0 fail. Rendered `node --test tests/gameplay-layout.test.js` — 1 pass, 0 fail. Final `npm test` — 261 pass, 0 fail. `git diff --check` — pass. Live in-app Chrome verification covered 360×640 Binyanim and Handwriting geometry, 1366×1000 Settings centering, both font options, dark/light themes, and English/Hebrew UI.

**Risks / regressions to check:** The compact layout guarantee is intentionally bounded at 360×640 CSS pixels; smaller screens are best-effort. Handwriting's feedback-state canvas reduction uses `:has()`, matching the project's Chrome/browser target. The Chrome regression skips only when no supported Chrome executable is installed. Long localized feedback remains the highest-value state to recheck when copy changes, and future display surfaces must use `var(--display-font)` to participate in the preference.

---

### 2026-07-18 23:20 EDT — Symmetric Binyanim prompt alignment

**Requested:** Keep the new tight, centered Binyanim prompt while placing the `פָּעַל` formation label on one side, the emoji on the other, and the conjugated Hebrew form exactly in the center.

**Files changed:**
- `styles.css` — changed the Binyanim prompt line to a centered three-column grid with equal, tightly capped side tracks; pinned the formation label left, conjugated form center, and emoji right while preserving Hebrew direction and the existing hint/speech controls.
- `index.html` — cache-busted the updated stylesheet to `20260718g`.
- `tests/app-progress.test.js` — added structural coverage for the three-column prompt arrangement.
- `tests/gameplay-layout.test.js` — added rendered geometry assertions that the conjugated form sits on the card centerline and the two side items have equal offsets.
- `task-log.md` — recorded this follow-up.

**Behavior changed:** The Binyanim prompt now reads as a compact symmetric cluster: formation label on the left, conjugated Hebrew form on the true centerline, and emoji on the right. The side tracks remain equal at every width and stop expanding on wide screens, so the grouping stays tight rather than spreading across the card.

**Tests run:** Baseline `npm test` — 261 pass, 0 fail. Focused `node --test tests/app-progress.test.js tests/gameplay-layout.test.js` — 124 pass, 0 fail. Live Hebrew-interface check at 848×1008 measured the centered form at 0px offset, equal side spacing within 0.004px, a compact 144px side-to-side cluster, and no gameplay scrolling. Final `npm test` — 261 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** Very unusually long future Binyanim forms may cause the capped side tracks to shrink toward their 2.8rem minimum, but the center remains fixed and the 360×640 rendered regression guards against overflow and footer overlap.

---

### 2026-07-18 23:24 EDT — Restore Binyanim prompt to one horizontal line

**Requested:** Correct the prior symmetry follow-up: retain the original single horizontal prompt line and change only the left/center/right order, without moving the emoji vertically.

**Files changed:**
- `styles.css` — pinned the formation label, conjugated form, and emoji to the same grid row while retaining their symmetric columns.
- `index.html` — cache-busted the corrected stylesheet to `20260718h`.
- `tests/app-progress.test.js` — added a structural assertion that all three prompt items occupy row 1.
- `tests/gameplay-layout.test.js` — extended the rendered symmetry test to require matching vertical centers in addition to horizontal centering and equal side spacing.
- `task-log.md` — recorded the correction.

**Behavior changed:** The compact Binyanim prompt is once again one horizontal line: formation label on the left, conjugated form centered, emoji on the right. No item moves above or below another.

**Tests run:** Focused `node --test tests/app-progress.test.js tests/gameplay-layout.test.js` — 124 pass, 0 fail. Live Hebrew-interface check at 848×1008 measured vertical centers within 0.004px, horizontal symmetry within 0.004px, the conjugated form within 0.004px of the card center, and no gameplay scrolling. Final `npm test` — 261 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** The regression now checks both axes, preventing a future change from preserving horizontal coordinates while silently auto-placing one item on another row.

---

### 2026-07-18 23:30 EDT — Keep top-bar titles in Frank Ruhl Libre

**Requested:** Make the top-bar header the single exception to the display-font preference so it always keeps its serif font in both Hebrew and English.

**Files changed:**
- `styles.css` — fixed the top-bar title to Frank Ruhl Libre instead of the user-selectable display-font variable.
- `index.html` — cache-busted the stylesheet to `20260718i`.
- `tests/app-progress.test.js` — added regression coverage for the permanent top-bar font exception.
- `task-log.md` — recorded the change.

**Behavior changed:** The app name and in-game title shown in the top bar always use Frank Ruhl Libre, regardless of whether the rest of the app is set to Heebo or Frank Ruhl Libre. English top-bar titles retain the same serif treatment.

**Tests run:** `npm test` — 261 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** This exception is intentionally scoped to `.shell-brand-title h1`; other headings continue to follow the selected display font.

---

### 2026-07-18 23:38 EDT — Remove Binyanim root arrows and compact the board

**Requested:** Remove the navigation arrows from the Binyanim root tiles and compact the board vertically to conserve gameplay space.

**Files changed:**
- `styles.css` — suppressed the higher-specificity Hebrew arrow pseudo-element and made Binyanim grid rows content-sized and vertically centered instead of stretching to fill the lesson shell.
- `index.html` — cache-busted the stylesheet to `20260718k`.
- `tests/app-progress.test.js` — added structural regressions for arrow removal and content-sized grid rows.
- `tests/gameplay-layout.test.js` — now runs the Binyanim board check in Hebrew, verifies the arrow pseudo-element is absent, and confirms the rendered grid uses centered `max-content` rows.
- `task-log.md` — recorded the change.

**Behavior changed:** Binyanim root cards no longer show arrows in either language. The six-card board uses the cards' natural content height rather than stretching rows, reducing vertical space while retaining equal card heights within each row and keeping the board centered.

**Tests run:** Initial focused `node --test tests/app-progress.test.js tests/gameplay-layout.test.js` exposed a deliberately over-tight randomized pixel threshold; the source/layout assertion was corrected to test content sizing directly. Final `node --test tests/gameplay-layout.test.js` — 1 pass, 0 fail. Final `npm test` — 261 pass, 0 fail. `git diff --check` — pass. Live Hebrew 360×640 verification confirmed no arrows, no scrolling, and a compact centered six-card board.

**Risks / regressions to check:** Card height remains content-driven, so roots with longer wrapped meanings may produce a taller row than shorter roots; paired cards stay equal and the board remains within the supported viewport floor.

---

### 2026-07-18 23:40 EDT — Publish typography and responsive gameplay polish

**Requested:** Push the completed typography, Settings, Binyanim, Handwriting, and responsive-layout work to GitHub and merge it into `main`.

**Files changed:**
- `task-log.md` — recorded publication. The published implementation includes the display-font preference and localization/runtime wiring, responsive gameplay CSS, Binyanim refinements, cache busts, viewport design constraints, unit coverage, and rendered Chrome regression from the preceding task entries.

**Behavior changed:** The completed typography and responsive gameplay polish is published through pull request #41 for immediate merge into GitHub `main`.

**Tests run:** Final pre-publication `npm test` — 261 pass, 0 fail. `git diff --check` and `git diff --cached --check` — pass. GitHub reported pull request #41 clean and mergeable with no required status checks.

**Risks / regressions to check:** None specific to publication. After merge, synchronize local `main` and remove the publication branch locally and remotely.

---

### 2026-07-19 08:20 EDT — Stop Apple Hebrew TTS from speaking quote bytes

**Requested:** Diagnose the strange pronunciation in the supplied iPhone recording of the Shema sentence `במודעה כתבו 'שני חדרים מוארים', בפועל זה מחסן עם חלון.` and fix it.

**Files changed:**
- `app/speech.js` — strips paired ASCII quotation apostrophes from speech-only text before applying the existing Hebrew TTS respellings; word-internal loanword apostrophes remain untouched.
- `tests/app-speech.test.js` — added exact coverage for the recorded sentence and regressions preserving apostrophes in `קרינג'` and `פיצ'ר`.
- `index.html` — cache-busted the updated speech module to `20260719a`.
- `task-log.md` — records the diagnosis, fix, and verification.

**Behavior changed:** The displayed sentence still includes its quotation marks, but Apple’s Hebrew voice no longer vocalizes the closing apostrophe as the UTF-8 byte escape “X-D-7-X-B-3.” Other quoted Hebrew phrases receive the same speech-only cleanup, while apostrophes used inside Hebrew loanwords continue to reach the voice unchanged.

**Tests run:** Baseline `npm test` — 263 pass, 0 fail. Audio reproduction with Apple’s local Carmit `he-IL` voice plus Whisper transcription reproduced `XD7XB3`; the identical sentence without speech-level quotation apostrophes removed 1.54 seconds of erroneous output and transcribed without the escape. Focused `node --test tests/app-speech.test.js` — 8 pass, 0 fail. Final `npm test` — all 263 non-rendered checks passed; the rendered Chrome check completed its assertions but failed during the project’s known temporary-profile cleanup race (`ENOTEMPTY`). Two isolated `node --test tests/gameplay-layout.test.js` reruns reproduced only the same post-assertion cleanup error. `git diff --check` — pass.

**Risks / regressions to check:** Physical iPhone/Safari should be rechecked after deployment because the original recording came from iOS. The punctuation sanitizer deliberately targets only paired ASCII quotation apostrophes with quotation-like boundaries; unmatched and word-internal apostrophes are unchanged.

---

### 2026-07-19 08:30 EDT — Keep Conjugation+ and Prepositions feedback in flow

**Requested:** Safely fix the answered state in Conjugation+ and Prepositions where the Next button and feedback crowded or overlapped the final answer on iPhone despite unused space below the feedback.

**Files changed:**
- `app/ui.js` — adds dedicated lesson-shell mode classes for Conjugation+ and Prepositions and clears them when another mode is active.
- `styles.css` — keeps the footer for those two modes in normal document flow instead of using the shared sticky offset that caused the iOS displacement.
- `tests/gameplay-layout.test.js` — renders answered Conjugation+ and Prepositions questions at 360×640 and verifies no scrolling, no answer/footer overlap, a visible gap, and a static in-flow footer.
- `index.html` — cache-busts the updated stylesheet and UI module to `20260719a`.
- `task-log.md` — records the diagnosis, implementation, and verification.

**Behavior changed:** After an answer in Conjugation+ or Prepositions, the final answer, Next button, and feedback now stack with normal spacing. The footer consumes the previously unused space below it instead of being lifted toward the answers. Footer behavior in other games is unchanged.

**Tests run:** Baseline `npm test` — 264 pass, 0 fail. Focused `node --test tests/gameplay-layout.test.js` after the fix — 1 pass, 0 fail, including both new 360×640 answered-state checks. Final `npm test` — 264 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** The exact original devices used iPhone Safari, while automated geometry verification uses rendered Chrome at the stricter 360×640 viewport floor. Recheck both screenshots after deployment; unusually long future feedback remains protected by the no-scroll regression at that viewport.

---

### 2026-07-19 08:34 EDT — Publish Hebrew speech and mobile feedback fixes

**Requested:** Push the completed Hebrew pronunciation and Conjugation+/Prepositions feedback-layout fixes to GitHub and merge them into `main`.

**Files changed:**
- `task-log.md` — records publication of the implementation and regression coverage from the two preceding entries through pull request #43.

**Behavior changed:** The completed fixes are published for `main`: quoted Hebrew speech no longer vocalizes the closing quotation byte escape, and answered Conjugation+/Prepositions screens keep answers, controls, and feedback separated in normal flow.

**Tests run:** Pre-push `npm test` — 264 pass, 0 fail. `git diff --cached --check` — pass. Commit `c3aab3f` was pushed on `agent/hebrew-speech-and-mobile-feedback`; GitHub pull request #43 targets `main` and was reported clean and mergeable with no required status checks.

**Risks / regressions to check:** Recheck the original physical iPhone/Safari speech and answered-state recordings after GitHub Pages finishes deploying the merged change.

---

### 2026-07-21 16:57 EDT — Expand Inbal and Inat content and preserve the character strategy

**Requested:** Implement the planned content expansion before beginning character art: add vocabulary, sentences, and safe conjugation verbs for Inbal and Inat; preserve the strategic and visual plan as a live document; do not begin Ido visual work until the remaining reference pictures are supplied.

**Files changed:**
- `vocab-data.js` — adds the 30-card `religion_magic_spirituality` tranche for Inbal and the 30-card `literature_arts_cultural_history` tranche for Inat, with pointed Hebrew and category metadata; updates the data build marker.
- `sentence-bank-data.js` — adds 16 `inbal_*` and 24 `inat_*` entries covering incantation bowls, ritual and folklore, literature, art, cultural memory, public-domain cultural texts, and activism; updates the data build marker.
- `hebrew-verbs.js` — adds stored present, past, and future paradigms for `לברך`, `להתפלל`, `לפרש`, and `למחות`; updates the data build marker.
- `tests/vocab-data.test.js` — updates totals and verifies both new 30-card vocabulary tranches are pointed, playable, complete, and globally unique.
- `tests/sentence-bank-data.test.js` — updates totals/category counts, subjects the new character rows to the compact-chip policy, and verifies complete aligned Inbal/Inat sentence ranges and the intended conjugated forms.
- `tests/hebrew-verbs.test.js` — updates the seed count and verifies all four new character verbs expose complete, pointed, authoritative 21-form paradigms.
- `docs/character-gameplay-strategy.md` — records the live cast model, copy, routing boundaries, abbreviation ownership, implemented-content ledger, and visual-production handoff; explicitly pauses Ido art pending all reference images.
- `index.html` — cache-busts the three changed data sources to `20260721a`.
- `task-log.md` — records this implementation and verification.

**Behavior changed:** Translation Match gains 60 playable cards, Sentences/Shema gain 40 fully authored rows, and Conjugation gains four complete verbs. The app now contains 1,572 vocabulary entries, 502 sentence entries, and 142 seed verbs. No character picker, routing behavior, sprites, animation, or other visual integration was added.

**Tests run:** Baseline `npm test` — 264 pass, 0 fail. Focused `node --test tests/sentence-bank-data.test.js tests/vocab-data.test.js tests/hebrew-verbs.test.js` — 77 pass, 0 fail. Final `npm test` — 267 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** The new content is structurally and mechanically verified, but a native-speaker editorial pass remains valuable for register and niqqud nuance. The Herzl line uses its conventional English “dream” rendering while noting that `אגדה` literally means “legend.” Character ownership currently lives in category names, explicit sentence IDs, verb IDs, and the strategy ledger; runtime multi-owner routing will be implemented later with the character system.

---

### 2026-07-21 21:14 EDT — Publish the Inbal and Inat content expansion

**Requested:** Push the completed Inbal/Inat content expansion to GitHub and merge it into `main`.

**Files changed:**
- `task-log.md` — records publication of the vocabulary, sentence, conjugation, test, cache-bust, and live-strategy changes through pull request #45.

**Behavior changed:** None beyond the content expansion recorded immediately above; this entry records its GitHub publication and merge workflow.

**Tests run:** Pre-publication `npm test` — 267 pass, 0 fail. Focused content suite — 77 pass, 0 fail. `git diff --check` and `git diff --cached --check` — pass. Commit `551af9f` was pushed on `agent/inbal-inat-content-expansion`; pull request #45 targets `main`.

**Risks / regressions to check:** After merge, synchronize local `main` and verify GitHub reports the PR merged at the expected head commit.

---

### 2026-07-22 22:54 EDT — Enforce and repair Hebrew word-order alternates

**Requested:** Diagnose why the natural answer `היא כבר מלרלרת בטלפון שעתיים.` was rejected despite the sentence-authoring word-order rule; repair the most recent sentence batches; and make future batches fail automatically when agents skip the review.

**Files changed:**
- `sentence-bank-data.js` — audited all 52 sentences added after the word-order rule, classified 36 as fixed and 16 as flexible, and added 28 fully pointed, exact-token reorderings. Added a reviewed-sentence builder that requires an explicit `fixed` or `alternates` decision, validates complete token permutations, derives aligned alternate token arrays, and exposes the review result in the sentence data. Added an append-only review marker and updated the data build.
- `tests/sentence-bank-data.test.js` — locks all 28 newly accepted orders, including the reported `מלרלרת` order; checks their text, niqqud, token reuse, and buildability; and adds a ratchet that rejects the legacy builder or a missing/contradictory decision for every sentence from the review marker onward.
- `AGENTS.md` — makes the reviewed builder, explicit decision, append marker, and no-bypass rule mandatory for all future sentence additions.
- `docs/sentence-bank-authoring.md` — documents the reviewed authoring schema, validated permutation format, source ratchet, and regression ledger.
- `index.html` — cache-busts the corrected sentence data to `20260722a`.
- `task-log.md` — records the diagnosis, repair, enforcement, and verification.

**Behavior changed:** The reported answer and 27 other neutral Hebrew reorderings across the Tel Aviv slang and Inbal/Inat batches are now accepted in English-to-Hebrew sentence play. Future appended sentences cannot load or pass tests unless the author explicitly records whether their neutral word order is fixed or flexible and supplies a valid reordering when flexible.

**Tests run:** Baseline `npm test` — 267 pass, 0 fail. Focused `node --test tests/sentence-bank-data.test.js` — 31 pass, 0 fail. Final `npm test` — 268 pass, 0 fail. `git diff --check` — pass.

**Risks / regressions to check:** Static automation can force an explicit review and preserve every accepted result, but no deterministic source test can independently prove that a human or model recognized every semantically valid Hebrew order. The new fail-closed workflow removes silent omission as an acceptable authoring state; future audits should still distinguish neutral equivalents from grammatical but focus-shifting permutations.

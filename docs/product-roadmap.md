# Ulpango product roadmap

Status: live working document. Update this file as tranches ship, are cut, or are
resequenced. Written 2026-07-29 after a full-codebase review; supersedes nothing,
and sits alongside `docs/character-gameplay-strategy.md` (content routing) and
`docs/sentence-bank-authoring.md` (chip standards).

Audience assumption: the learner is the author plus a small number of real
learners. That is why `prefers-reduced-motion`, mobile layout, and first-session
experience are treated as requirements rather than polish, and why leaderboards
and retention mechanics are not.

## Thesis

Content coverage is large and still growing: 1,693 vocabulary cards, 3,780
hand-authored verb forms (3,756 of them fully pointed), 608 sentences, 800
generated preposition items, 282 abbreviations, 77 idioms, 297 binyan tiles, 27
letterforms. Recent
sessions have been spending their effort on niqqud sourcing, word-order audits,
and character routing — real work with a shrinking learner-visible return.

The review found that the binding constraint is not content volume.

> **The app can only *recognize*, and it cannot *query*.**

Two halves to that:

- **Cannot produce.** Every one of the nine modes is recognition or
  recombination — multiple choice, drag-and-drop chips, or canvas tracing.
  `grep -c '<input' index.html` returns **0**. The learner has never typed a
  Hebrew word. 3,780 verb forms exist (present 640, past 1,458, future 1,298,
  imperative 384) and are only ever shown, never demanded.
- **Cannot query.** Most missing Hebrew is already in the files but unlabelled.
  `register` exists in `verb-game-data.js` and nowhere else, so `סבבה` and
  `משלב רשמי` sit on one flat axis unmarked. Grammar explanations exist as prose
  in all 608 sentence `notes` and are machine-unreadable, so "drill me on
  conditionals" is impossible. `utility` — the field that drives item selection —
  is computed positionally from authoring order, so it measures when a word was
  typed rather than how much it matters.

A third, separate finding: the app tracks far more about the learner than it ever
shows them. An 8-box Leitner ladder is maintained per item and its distribution
is never displayed.

The roadmap therefore front-loads *annotation and production* over authoring, and
*showing what is already known* over new tracking.

## Standing constraints

Any session picking up this roadmap must respect these. They are load-bearing and
several are easy to violate accidentally.

- **Vocabulary IDs embed a positional index**, so `vocab-data.js` is append-only
  and words must never be re-shelved between categories — it orphans learner
  progress. Adding *fields* is safe; reordering rows is not.
- **`APPEND_ONLY_REVIEWED_SENTENCES_START`** — new sentences go through
  `buildReviewedSentence` with an explicit `wordOrderDecision`.
- **The word-order policy holds.** Per
  `generated/sentence-word-order-audit-2026-07-18.md`, grading is exact token
  order plus authored alternates; a global adjacent-swap hack was removed on
  2026-07-29. No general temporal, locative, modifier, or clause-movement rule
  is to be introduced. Anything new that relies on word order must have
  *internally fixed* order (construct chains, numeral phrases) to be safe.
- **Character routing never uses a `character` field** — it matches on existing
  content fields via `route.*`. Any new deck must be reachable that way.
- **Cache-busting.** Per `CLAUDE.md`, every `.js`/`.css` in a diff needs its
  `?v=` bumped in `index.html`, data files included.
- **Test-count pinning.** `tests/vocab-data.test.js`,
  `tests/sentence-bank-data.test.js` and siblings assert entry counts, so every
  content PR touches a count assertion. Expect this as a routine merge conflict,
  not a surprise.
- **Layout budget.** `AGENTS.md` mandates no vertical scrolling at 360×640.
  `tests/gameplay-layout.test.js` drives headless Chrome over CDP and is the
  gate for any new gameplay surface.

---

## Tranche A — Feel

**≈4.5 days. The tractable pole.** Ordered by felt change per hour. Every item
here affects all nine modes, because they route through shared chokepoints.

The starting position: `styles.css` is 5,131 lines and contains **three
`@keyframes`**, **five `transition` declarations**, and **zero
`prefers-reduced-motion` blocks**. There is very little motion to break, which
makes this cheap.

| # | Item | Effort |
|---|---|---|
| A0 | Motion foundation | 4h |
| A0b | `resetAllModeSessions` (bug fix) | 4h |
| A1 | Answer-feedback pulse | 4h |
| A2 | Make the streak visible | 2h |
| A3 | Per-character palette | 1.5d |
| A4 | CSS-only sprite life | 1d |
| A5 | Tile snap + dialogue-bubble fix | 1d |

### A0 — Motion foundation

Add motion tokens to `:root` alongside `--radius`/`--shadow`: `--dur-fast`,
`--dur`, `--dur-slow`, `--ease-out`, `--ease-spring`. Codify the values the three
existing keyframes already use (`180ms ease`,
`650ms cubic-bezier(0.15,0.8,0.22,1)`) rather than inventing new ones.

Then a `@media (prefers-reduced-motion: reduce)` block at the end of the file
zeroing `--dur-*` and setting `animation: none` / `transition: none` on
`.character-sprite`, `.match-card`, `.feedback-tray`. Roughly ten lines.

This is non-negotiable before any other motion work. With real learners, an app
that animates on every answer with no reduced-motion path is an accessibility
regression.

### A0b — `resetAllModeSessions` — SHIPPED 2026-07-29

**This is a bug fix, not a refactor.** Each mode's `start*` function opens with an
inline preamble that resets competing sessions, and every preamble is a different
subset of the complete list. Measured:

| Mode's start preamble | Fails to reset |
|---|---|
| `app/verb-match.js:129` | advConj, prepositions, sentenceBank |
| `app/word-match.js:151` | advConj, prepositions, binyanBoard |
| `app/adv-conj.js` | prepositions, sentenceBank, verbMatch |
| `app/prepositions.js` | sentenceBank, verbMatch |
| `app/binyan-board.js` | prepositions |
| `app/sentence-bank.js` | prepositions |
| `app/handwriting.js` | — (**the only complete one; use it as the reference**) |

Reproduce with:

```bash
for f in verb-match word-match sentence-bank adv-conj prepositions binyan-board handwriting; do
  echo "--- $f ---"
  grep -oE 'reset(AdvConj|Prepositions|SentenceBank|VerbMatch|WordMatch|BinyanBoard|Handwriting|Abbreviation)State' app/$f.js | sort -u | tr '\n' ' '
  echo
done
```

Why it is observable rather than cosmetic: `session.hasActiveLearnSession`
(`app/session.js:95`) ORs across *every* per-mode `.active` / `.introActive`
flag. A stale flag makes the app believe a session is live.

Repro: start Prepositions → go home mid-session → start Conjugation (whose
preamble omits `resetPrepositionsState`) → `state.prepositions.active` is still
`true`, so the leave-session guard fires on a session already abandoned, and
`persistSessionState` writes a stale slice that `restoreSessionState` can act on.

Fix: extract `session.resetAllModeSessions()` and have all seven preambles call
it. Do this before any new mode exists — each new mode multiplies the surface.

**As built.** The canonical complete list turned out to be in
`endSessionAndNavigate`, *not* `showSessionSummary` — it is the only teardown that
calls `resetAdvConjState` / `resetPrepositionsState` rather than flipping `.active`
by hand, and those two are what clear their `setInterval` handles. So the extract
came from there, and `endSessionAndNavigate` now delegates to it. No `keepMode`
parameter was needed: every preamble already resets its own slice before building
its session, so the shared function resets everything and callers set up after.
`showSessionSummary` was deliberately left alone — it must preserve enough state
for the summary it is about to render, and the normal finish path clears the
intervals before it runs.

### A1 — Answer-feedback pulse

**The highest-leverage single item in this document.**

`audio.playAnswerFeedbackSound` (`app/audio.js:126`) is the one function every
mode calls on every answer. It is already how the character reaction system got
universal coverage for free — it calls `character.recordAnswer` from there. Add
one more line: `app.ui?.pulseAnswerFeedback?.(isCorrect)`.

`ui.pulseAnswerFeedback` adds a class, sets a timer, removes it. Two keyframes: a
`correctPop` (scale 1 → 1.03 with a `--success-bg` wash) and a `wrongShake`
(translateX ±4px). Apply the class to `document.body` or `el.promptCard` — nodes
that no renderer rebuilds — so `renderAll()` cannot interrupt the animation.

One change, felt in all nine modes.

### A2 — Make the streak visible

The hook is already fully wired **and already styled**, which was a surprise:
`ui.getProgressStreakTier` (`app/ui.js:404`) computes tiers 0–4 and writes
`data-streak-tier`, and `styles.css:892-908` has rules for all four tiers. But
each rule is only `filter: brightness(…) saturate(…)` ramping 1.06 → 1.28, which
is imperceptible in practice.

So this is not "add CSS" — it is "make four existing tiers actually visible":
saturation shift → `--selection-glow` box-shadow → a slow 2s glow breathe → the
glow plus a gold top edge. Zero JS. Zero risk.

### A3 — Per-character visual identity

The obvious implementation breaks, and `styles.css:14-16` already explains why in
a comment: `--brand` is gold `#C9A54D` in dark but indigo `#2C3F77` in light, and
is used both as text on `--paper` and as a fill behind `--brand-ink`. Overriding
`--brand` per character yields an accent that is illegible in one of the two
themes. Handling that per theme naively is 5 characters × 2 themes × ~8 vars — an
unmaintainable matrix.

**Use a seed-var indirection layer instead.** Two edits to existing blocks:

```css
:root {
  --brand:          var(--char-accent, #C9A54D);
  --brand-deep:     var(--char-accent-deep, #B8923C);
  --gold:           var(--char-accent, #C9A54D);
  --selection-glow: var(--char-glow, rgba(201,165,77,.28));
}
body[data-theme="light"] { /* same pattern, light defaults */ }
```

Then each character is two blocks of three lines:

```css
body[data-character="ido"]                     { --char-accent: #E0567F; --char-accent-deep: #C43F66; --char-glow: rgba(224,86,127,.28); }
body[data-theme="light"][data-character="ido"] { --char-accent: #A82B52; --char-accent-deep: #8E1F42; --char-glow: rgba(168,43,82,.22); }
```

About 30 lines for five characters.

**A character owns the accent, never the surface.** Leave `--ink`, `--paper`,
`--line`, `--brand-ink` and `--bubble-*` alone — those are the contract that
keeps text legible.

The JS side is one function that sets `data-character` from the existing
`getActiveCharacter()` (`app/character.js:58`, which already resolves
mission → pendingChoice → lens), called from `character.render()`. Custom
properties cascade, so every accent in the app recolours at once with no other
change. Combined with A2, the streak glow becomes the active character's colour —
that is the payoff.

Palette directions consistent with the existing "Hebrew Editorial" register: Ido
magenta/coral (nightlife), Inbal violet (mystic), Ivri steel-cyan (hi-tech), Inat
deep crimson (political/academic), Itamar slate-grey (unsentimental).

Also worth doing: accent the dialogue bubble border, and make
`.character-sprite`'s hardcoded `drop-shadow` (`styles.css:2652`) a
`var(--char-shadow, …)` — warm for Ido, cool for Ivri. One line, disproportionate
effect.

**Not doing: per-character display fonts.** `--display-font` is a *user
preference* (`body[data-display-font="frank"]`). Overriding it per character
stomps a setting the learner deliberately chose, and Hebrew webfaces that render
niqqud correctly are limited. If any typographic differentiation is wanted,
restrict it to weight/letter-spacing on the dialogue bubble.

### A4 — Sprite life

Per `assets/SPRITE_STANDARD.md` the sprites are 512×512 full-figure transparent
cutouts, one independent image per reaction, no spritesheets. **This means
blinking is impossible without new art** — there is no isolable eye region.

But the body is available, and roughly 40 lines of CSS is the best
life-per-hour ratio in this document:

- **Idle breathe** — `translateY(-2px) scale(1.006)` on a 3.6s cycle. This alone
  stops the companion reading as a sticker.
- **Idle sway** — ±0.6deg rotate on a 7s cycle, deliberately prime-ratio'd
  against the breathe period so the two never visibly re-sync.
- **Reaction transition** — today `dataset.reaction` swaps the `background-image`
  as a hard cut. Add/remove a `reacting` class in `renderCompanion` driving a
  scale punch, so the character visibly *reacts* rather than teleporting between
  expressions. (A full cross-fade via an `::after` pseudo carrying the outgoing
  frame is possible but costs more for less.)
- **Celebrate hop** — 2-bounce `translateY` when `dataset.reaction="celebrating"`.
- **Struggle slump** — `translateY(2px)` plus a slower breathe when
  `="struggling"`.
- **Per-character shadow tint** via A3's `--char-shadow`.

All of it gated on A0's reduced-motion block.

**If blinking is still wanted after that**, it is a *7th reaction*, not a
spritesheet frame. One `neutral-blink-{chroma,transparent}.png` master pair per
character at 1254×1254, added to each `scripts/build-*-sprites.py` reaction list
and to `SPRITE_NAMES` (`app/character.js:25`); then a `setInterval` in
`renderCompanion` that flips `dataset.reaction` to `neutral-blink` for ~120ms
every 4–7s *only while the current frame is `neutral`*, guarded on
`matchMedia("(prefers-reduced-motion: reduce)")`. About 2h of engineering after
art lands.

Caveat worth weighing first: the four character folders already total ~4.9MB of
PNGs on a GitHub Pages site. A 7th state adds roughly another megabyte. Do the
CSS-only work, then re-ask whether blinking is still missed.

### A5 — Tile snap and the dialogue-bubble rebuild

Two small things, one of which is a real bug.

**Tile snap.** `placeTokenInSlot` triggers a full board rebuild. Don't fight it —
use the precedent already in the codebase: `app/match-engine.js` sets a
`card.incoming` flag when dealing (`:75`, `:84`) and consumes it during render to
toggle a class plus an inline `animationDelay` (`:146-147`), so only genuinely new
nodes animate under a full `innerHTML` rebuild. Mirror it: set
`question.justPlacedSlotIndex` in
`placeTokenInSlotInternal` (`app/sentence-bank.js:322`), have
`renderSentenceBankBoard` add a `.just-placed` class to that one slot and clear
the flag, and add one `slotSnap` keyframe (scale .92 → 1, `--ease-spring`).

**Bubble rebuild.** `app/character.js:972` does `bubble.innerHTML = ""` on every
`renderAll()` call — roughly 44 call sites across 18 files. Beyond making a bubble
entrance animation impossible, this **silently closes any per-word gloss tooltip
the learner had opened**. Early-return when the rendered `dialogueKey` is
unchanged (stash it on `bubble.dataset.dialogueKey`).

### On `renderAll()`

`ui.renderAll()` (`app/ui.js:749`) re-renders the entire tree on every state
change. **Do not introduce a diffing layer or a general targeted-render API.**
At 1,798 lines of imperative DOM that is the wrong trade. Three conventions are
sufficient for everything in this roadmap:

1. **Mutate rather than rebuild for animated nodes.** `renderCompanion` already
   does this correctly for the sprite — it sets `dataset.reaction` on a
   persistent element, so transitions survive.
2. **Use the `incoming` / `just*` flag convention** where a rebuild is
   unavoidable (A5).
3. **Put transient classes on nodes no renderer owns** — `document.body`,
   `el.promptCard` (A1).

### Cut from Tranche A

- **Haptics.** `navigator.vibrate` is unsupported in iOS Safari, and the
  hand-built Carmit respelling table (`app/speech.js:40-113`) is strong evidence
  that Apple devices are the primary target. Building for the platform that
  cannot run it is wasted effort.
- **More sound cues.** Adding cues is trivial (`AUDIO_CUES` in `app.js:600` plus
  `buildAudioCueSources`, which already handles ogg/mp3 fallback), but sound is
  **off by default** — `loadSoundPreference` returns enabled only on an explicit
  `true`. New cues change nothing until that default or a first-run prompt
  changes, which is a product decision to make deliberately rather than a
  side-effect to ship quietly.

---

## Tranche B — Show the learner what the app already knows

**≈2.5 days.** No new tracking; only surfacing.

### B1 — Daily streak (4h)

The data already exists. `createBondRecord` (`app/character.js:1239-1245`) stores
a deduped, sorted `days: []` per character, written from `addBondXp`
(`:1304`), and already exposes `daysInteracted` (`:1285`). It lives in
`ivriquest-character-bond-v1`, deliberately kept outside the day-keyed character
reset (see the comment at `app/constants.js:18-20`), so it survives.

Promote it to a learner-global `days: []` under a new
`STORAGE_KEYS.learnerProgress`, compute current and longest streak from
consecutive dates, and render it in the existing Review → characters tab
(`app/ui.js:1406`) plus a pill on the home dashboard.

Motivationally real, because a streak measures the one behaviour that actually
produces acquisition: showing up.

### B2 — Mastery map (2d)

`data.updateProgress` (`app/data.js:265`) maintains an 8-box Leitner level per
item against `LEITNER_INTERVALS` (`app/constants.js:31-40`, `[0, 8m, 45m, 4h,
20h, 3d, 7d, 14d]`). **The learner never sees the box distribution.** That is the
single largest gap between what the app knows and what it shows.

Render a stacked strip — "New · Learning ×3 · Familiar ×2 · Solid ×2" — per
performance domain. `runtime.performanceDomains`, `runtime.domainByCategory` and
`ui.renderDomainPerformance` already exist and already run inside `renderAll`.
Add a "due today" count from `nextDue <= now`.

Real, because it is a truthful picture of knowledge state rather than a points
abstraction, and because "31 items due" creates a pull that no XP bar does.

**Honest limitation:** only vocabulary and abbreviations flow through
`data.updateProgress`. advConj, prepositions and binyanBoard keep their own
`{attempts, correct}` plus per-item stats under separate storage keys, and
sentences use `sentenceProgress` keyed `"<id>::<direction>"`. A unified map needs
a read-only adapter normalising four shapes — budget half a day. **Do not
migrate the storage keys.**

### B3 — Recoveries

`data.updateProgress` already tracks `translationRecoveryStreak` and `misses`
(`app/data.js:283-297`), and `reduceAnswerState` (`app/character.js:1623`)
already has a dedicated `recovery` reaction. Surface it: "7 words reclaimed this
week." A genuine learning signal with the plumbing already in place.

### Cut from Tranche B

- **A global learner XP economy.** Bond XP is already better designed: the ×2
  on-lens multiplier means XP tracks *shared subject matter with a character*,
  not raw volume. A global level would be strictly less meaningful than the bond
  levels already shipped. If a headline number is wanted, derive total bond level
  across characters — zero new storage, and it means "you have real relationships
  with N characters," which is the actual product thesis.
- **A badge wall.** Content debt with no learning value. B3 is the one
  achievement shape worth having, because it reports something true about
  learning.
- **A skill tree.** It needs prerequisite structure the content does not have —
  vocabulary is routed by character lens and category, and the SRS deliberately
  interleaves. A tree would either be cosmetic gating over a flat pool or would
  fight the Leitner scheduler, which is the app's best feature.

---

## Tranche C — Content: annotate, then produce

**≈5–7 sessions.**

**Positioning decision, recorded here as policy.** The "above-beginner" stance
from `generated/vocabulary-expansion-plan.md` governs the **lexicon**, not
**grammar**:

> A high-frequency function word may be taught inside a system drill where its
> difficulty is morphological, agreement-based, or register-based. It must not be
> added as a standalone Translation Match card.

This matters because the gap is measured, not aesthetic. The most frequent tokens
in the app's *own* sentence bank that have no vocabulary card are exactly the
function words: `את` 95, `אני` 56, `לא` 53, `על` 50, `לי` 47, `יש` 32, `מה` 17,
`אפשר` 17, `צריך` 16, `כבר` 15, `יותר` 14, `איפה` 14, `כל` 12. The policy above
closes that hole without diluting the 1,619-card translation pool or reversing the
documented `צריך` card removal — `צריך` returns as a *modal inflection drill*, not
as a gloss.

### C1 — Annotation spine

**Architecture: a sidecar, not inline `meta`.** New `lexicon-annotations.js` keyed
`"<deck>:<id>"`, joined once at `app.js:616` where `baseVocabulary` is assembled,
with every field optional so a missing annotation can never break a mode.

Rationale specific to this repo:

- `vocab-data.js` is 2,275 lines that several workstreams touch; `task-log.md`
  already records a conflict on its count assertions. Annotating 1,684 rows
  inline guarantees more.
- Coverage can be partial and *visible*: a test pins "N of 1,684 annotated" as a
  ratchet that only increases — generalising the existing
  `niqqud_status: 5 reviewed / 95 unreviewed` honesty mechanism in
  `hebrew-idioms.js`.
- One schema can annotate vocabulary, verbs, sentences and idioms in a single
  join. Inline `meta` cannot.
- Per-field `reviewStatus` lets hand-reviewed `register` and machine-derived
  `pos` coexist honestly.

**Ships first and alone: `corpusHits`.** Count each item across the 608
sentences' `hebrew_tokens` (plus alternates), the 77 idioms, and the 178-entry
verb deck. 100% derivable, deterministic, re-runnable from `scripts/`, zero
authoring. It replaces `utility` in `data.pickBestWord`'s `utilityBoost` — a value
currently computed *positionally from authoring order*, i.e. measuring when a word
was typed. Name it honestly: it measures **in-repo** frequency, not corpus
frequency.

Ship it first and by itself. It is the only annotation the learner feels
immediately, and it de-risks the sidecar join before any hand-review is invested.

Then, ranked by payback per unit of review cost:

| Field | Machine-derivable? | Hand cost | Unlocks |
|---|---|---|---|
| `pos` | ~85–90% proposable (`en` starting "to " → verb; ending shape + gloss → noun) | ~2–3s/card to confirm | The gate: no numeral, construct, or mishkal drill can select items without it. Also fixes cross-POS distractors. |
| `phraseType` (`construct`/`adjectival`/`prepositional`/`lexical`) on the 681 two-word entries | partially; article placement and agreement give a noisy prior | ~681 decisions ≈ one focused session | Construct-state work over 747 existing entries — **195 already have a `־ת` head** and **130 have a head that is also a standalone card**, i.e. ready-made alternation pairs. |
| `register` (5 levels) | not derivable, but `category` gives a strong prior (`bureaucracy`/`legal_civic` → formal; `conversation_glue` → colloquial) | seed by category, review only disagreements; scope to the ~600 contrastive cards | Register-contrast drills; better sentence distractors. Note the deck currently contains the cards `משלב רשמי` / `משלב לא רשמי` while carrying no register field. |

**Be pessimistic about machine derivation.** Hebrew root extraction, termhood, and
construct-vs-adjectival all produce confidently wrong answers.
`docs/sentence-bank-authoring.md` already states that automation cannot reliably
infer Hebrew morphology, and the review confirmed it quantitatively: root-matching
the ~193 pattern nouns against the 162 verb paradigms yields only **27 candidate
pairs at roughly 60–70% precision** — `משיכה→להמשיך`, `קליטה→להקליט`,
`ספירה→לספר`, `שבעה→להשביע` are all wrong. Every annotation therefore ships
machine-**proposed** and human-**confirmed**, with the proposal script living in
`scripts/` so it is re-runnable and reviewable.

**Excluded from C1:** CEFR bands (no corpus, no build step, unfalsifiable); full
`root` on all vocabulary (low precision); שם פעולה derivation links (the 27 noisy
pairs above — the bottleneck is that the verb deck is small, so defer until the
verb deck grows).

### C2 — Typing mode

**The single highest-value new mode, and it requires zero new content.**

The gap is categorical: the learner has never typed a Hebrew word. The corpus is
the 3,780 existing pointed verb forms, which already carry per-form English labels
(`englishText: "I will be"`) and per-form adaptive tracking
(`conjugationAttempts`). v1 is the same deck, produced instead of recognised.

**Grading, in ktiv male against the plain string, three tiers:**

| Tier | Condition | Result |
|---|---|---|
| Exact | normalised input === normalised `valuePlain` | correct |
| Accepted with note | differs *only* by sofit form, geresh style (`׳` vs `'`), maqaf (`־` vs `-`), or **ו/י insertion or deletion** | correct + spelling note |
| Wrong | otherwise | wrong |

Niqqud is never required. Grading targets the plain string, which the repo already
guarantees is the niqqud-stripped form (test-pinned in `tests/vocab-data.test.js`
and the sentence-bank consonantal-alignment assertions).

**Reuse, not new code.** `app/hebrew.js` already has `stripNiqqud` and
`normalizeHebrewSofitForms`. The latter is exactly right for this: it
canonicalises medial↔final letters *positionally*, so a learner who types a medial
mem at word end is normalised rather than failed.

**The ktiv male/haser lesson falls out for free.** The consonantal-skeleton helper
— strip niqqud, then remove `ו` and `י` — is already written twice in test code
(`tests/sentence-bank-data.test.js:26`, `tests/hebrew-idioms.test.js:76`). Promote
it into `app/hebrew.js` and the "you spelled it haser" note is a diff away. The
repo has enforced a rigorous ktiv convention for months and has never surfaced it
as a lesson; this is that lesson, for about fifteen lines.

**The real risk is layout, not logic.** A Hebrew keyboard cannot be assumed, and
on mobile the learner would otherwise have to switch OS keyboards every round. So
an on-screen key row is *required*:

- `<input dir="rtl" lang="he" inputmode="none" autocapitalize="off" autocorrect="off" spellcheck="false">` —
  `inputmode="none"` suppresses the OS keyboard so the on-screen layout is
  authoritative.
- Three rows in **standard Israeli layout order**, so muscle memory transfers to a
  real keyboard. Render with the existing `choice-btn` grid CSS.
- Also accept physical `keydown` for desktop users who do have a Hebrew layout.
- Three rows at ~34px ≈ 120px, plus prompt, input and toolbar, against a 360×640
  no-scroll budget. **Verify against `tests/gameplay-layout.test.js` before
  writing the grader.**

Structure the module on `app/prepositions.js`, which is the cleanest template
(deck build, adaptive item stats, review phase, intro overlay). Add a pure-grader
test file with Hebrew fixtures covering all three tiers.

**Free follow-ons in the same mode, as prompt-selector tiers rather than new
plumbing:** dictation (swap the English prompt for a TTS payload — `app/speech.js`
already builds fully-pointed payloads, closing half the listening gap); infinitive
production; root extraction; gizra prediction.

### C3 — Number agreement and time idiom

**Scope corrected 2026-07-29.** An earlier draft called this "the largest Tier-1
hole" on the strength of a card count: zero cardinal numbers in 1,684 entries
(`שבעה` exists but is glossed "mourning week"; `השבעה` and `קערת השבעה` are
"incantation" and "incantation bowl"). That framing was wrong. This is an advanced
Hebrew app and it assumes the learner can count — the absence of `שלוש` as a
translation card is not a gap, and adding one would be exactly the beginner-trivia
the positioning policy exists to prevent.

What survives the objection is narrower and is not counting:

- **Gender polarity.** `שלוש בנות` / `שלושה בנים` — the numeral takes the
  *opposite* gender to its noun. This is a lifelong error source, including for
  fluent speakers, and it cannot be drilled without gendered nouns, which the repo
  does not have as data anywhere.
- **The counting form (construct numeral).** `שלושת הבנים`, `שני הספרים` — a
  distinct paradigm most learners never acquire, and unrelated to knowing the
  cardinals.
- **Gendered teens.** `אחד עשר` / `אחת עשרה`, where polarity interacts with a
  compound.
- **Clock and date idiom.** `רבע לשבע`, `שבע וחצי`, `עשרה לשמונה`, and
  `ב-15 במרץ` — conventions, not arithmetic. Clock time appears in 3 of 608
  sentences.

So the deliverable is an **agreement and idiom** drill, not a numbers deck, and no
cardinal ever appears as a bare word→gloss card. If the polarity system is already
solid, cut this tranche entirely — it drops to the value of the clock/date idiom
alone, which is small.

Shape if built: a closed system that generates rather than needing authoring,
following the `preposition-data.js` pattern (16 paradigms + 100 triggers → 800
items). Roughly 250 authored lines of `numeral-data.js` plus a 60–80-entry
gendered noun table yields >1,000 agreement items, and the mode is structurally a
copy of `app/prepositions.js`. Numeral phrases have internally fixed order, so
this does not touch the word-order policy.

### C4 — Free derivations nobody has built

Listed so future sessions can pick them up. All need little or no authoring.

- **Full-tense preposition governance — SHIPPED 2026-07-29.** 39 of the 83 verb
  triggers match a complete `hebrew-verbs.js` paradigm by their present-ms form
  (`מחכה→לחכות`, `משתמש→להשתמש`, `נפגש→להיפגש`), and the game was frozen in
  present tense only because nobody joined the two files. Deck 800 → 2,986.

  **Two estimates in the original draft were wrong, and the corrections generalize
  to the rest of C4.** First, this was *not* "no authoring." The verb deck's own
  `englishText` labels cannot be borrowed: only 3 of 39 carry the governed
  preposition, and several gloss a different sense than the trigger drills
  (`שומר` is "look after" here but "I kept" there; `מזמין` is "invite" here but
  "I ordered (food, tickets)" there). English third-person-singular and past had
  to be authored per trigger — 78 strings — with `base` and `future` derived from
  the trigger's existing `en` so it stays the single source of truth. Second,
  conjugating the subject **reintroduced the coreference bug** that the frozen
  dative-experiencer triggers were repaired for on 2026-07-27: `חיכיתי לי` needs
  the reflexive, and first and second person also collide across number, since
  "we waited for me" is incoherent in any context. Hence
  `prepositions.subjectCoreferencesObject`, which excludes identical pairs and
  same-person 1st/2nd pairs while allowing disjoint third person
  (`הוא חיכה להם` is ordinary Hebrew). Frames are also deduped by Hebrew surface,
  because lamed-hey verbs spell present ms and fs alike (`מחכה`).

  **The lesson for the remaining C4 items:** "derives for free" means the *Hebrew*
  is free. English glosses, agreement, and reference coherence are not, and each
  needs its own guard plus a test.
- **Infinitive production.** `lemma` and `lemma_niqqud` exist on all 162 verbs
  and are display-only, never drilled. "Given `הם סגרו`, produce the infinitive"
  tests a direction the app never tests.
- **Root extraction and gizra prediction.** Prompt from any of 3,780 inflected
  forms; answer the three-letter root; distractors computed from the 147 distinct
  roots sharing two letters. The gizra tier reuses the existing `tags` classes
  (`lamed-hey` 12, `pe-yod` 6, `pe-nun` 6, `metathesis` 4).
- **The verb-deck ↔ binyan-board bridge.** The two files share no linking field,
  but **34 roots match on letters** (`סגר, פתח, כתב, שמר, למד, ראה, ישב, קנה,
  שלח…`). Deriving `root` as a join key connects 60 gizra-classified roots that
  have translit to 141 lemmas that have full paradigms: "you know `נכתב` is
  passive — now conjugate it."
- **Future-as-request pragmatics.** 128 verbs have **both** imperative and future
  forms. Pairing them teaches the highest-value pragmatic fact in the whole gap
  list — that Israelis prefer `תגיד לי` to bare `אמור לי` — at zero authoring
  cost.
- **Noun possessive suffixes, seeded.** The 12 `possessive_suffix` idioms carry
  complete 10-form paradigms (`מדעתי…מדעתן`). Not a full system, but enough to
  drill the `־י/־ך/־ו/־ה/־נו` pattern on 12 real nouns immediately.

### Deferred as real writing projects

Register-swap pairs (**no paired formal/casual data exists anywhere** — ~120 must
be hand-written); pual/hufal paradigms (**but nifal is already fully drillable at
11 complete paradigms — that is the wedge**, and an active→passive nifal drill
plus the 34 bridged roots is nearly free); conditional and irrealis, especially
`היה` + participle (`הייתי רוצה`), which is among the most frequent spoken
structures and appears in 2 of 608 sentences; question-word and `האם` cohort
(`האם` appears in **zero** sentences, so formal yes/no question formation is
entirely absent); formal-document frames (`לכבוד`, `בכבוד רב`, `הנדון`); the 162
empty `examples[]` arrays, which is also the honest prerequisite for making the
שם פעולה link worth its noisy 27 pairs.

---

## Tranche D — Architecture paydown

**≈5–7 days, no user-visible change.** Sequenced deliberately.

### D1 — Delete the dead scaffolding first

`app/lesson.js` exports only two helpers, while `app/controller.js:303`,
`app/controller.js:352` and `app/ui.js:860` call
`app.lessonMode?.startLesson?.()` and `?.renderQuestion?.()` — **never defined**,
silently no-op via `?.()`. The live translation game is `lessonMatch` in
`app/word-match.js`. `app/abbreviation.js` is half-dead the same way: deck prep
and SRS picker remain, but `startAbbreviation`/`renderAbbreviationQuestion` are
called and never defined; the live game is `abbrMatch`.

Residue spans a state slice, a persistence slice, `session.finishLesson`,
`finishAbbreviation`, i18n keys, DOM overlays, `SUMMARY_GAME_NAME_KEYS.lesson`,
and `lastPlayedMode: "lesson"` as the **default** in
`app/bootstrap-runtime.js:169`.

Do this *first*, inside D2 rather than as a separate project: every dead mode
deleted is a switch arm that never needs translating into the registry.

### D2 — Mode registry

There is no registry today. Adding a mode means edits at roughly ten hardcoded
switch sites across six files: `controller.js` (`bindUi`, `openHomeLesson`,
`continueFromResults`, `handleNextAction`), `session.js`
(`hasActiveLearnSession`, `isModeSessionActive`, `restoreSessionState`,
`resumeActiveTimers`, `showSessionSummary`, per-mode `finish*`), `ui.js`
(`renderLearnState`, `SUMMARY_GAME_NAME_KEYS`, `getGameplayHeaderMeta`,
`renderHomeLessonButtons`), `persistence.js` (`persistSessionState`),
`bootstrap-runtime.js` (element registry + `createInitialState`), plus
`constants.js`, `index.html`, and `character.js` (`ACTIVITY_ORDER`,
`setRuntimeModeForActivity`).

Design it as a **descriptor table, not a framework**:

```js
app.modes.register({
  id: "dialogueScene",
  stateKey: "dialogueScene",
  start, isActive, render, stopTimer, clearIntro, reset, persist, restore,
  summaryNameKey: "game.dialogueSceneName",
  homeButtonId: "homeDialogueSceneBtn",
  activity: { nameEn: "Scenes", nameHe: "סצנות", intro: "scenes" },
  hasRounds: false,
});
```

Then rewrite the switch sites as loops over the registry.

**Migrate incrementally:** registry lookup first, falling through to the existing
switch when a mode is not found. Pilot on prepositions, binyanBoard and
handwriting — the smallest, and they already skip the `app.js` symbol guard, which
is the lighter-weight precedent. Leave `sentenceBank`/`shema` for last: they share
one state slice via `shemaMode` and are the hardest case.

**Not doing: a targeted-rendering or diffing layer.** The three conventions under
Tranche A are sufficient for everything in this roadmap, including Tranche E.

---

## Tranche E — The RPG direction

**V0 ≈5–8 days and is the go/no-go gate. V1 +5–8. V2 +5.**

### The design insight

A dialogue mode where the player picks the correct Hebrew reply is a reskinned
quiz, because "pick the correct Hebrew" *is* the quiz that already exists. The fix
is to split the choice from the execution:

> **Beat 1 — Choose.** The player sees 2–3 replies described by their English
> meaning and *tone* ("warm / blunt / deflect"). All are correct Hebrew. This is a
> narrative choice with no right answer.
>
> **Beat 2 — Say it.** The player must now *build* the Hebrew of the reply they
> chose, on the existing sentence-bank tile engine.

Beat 1 is the game. Beat 2 is the learning. The drill becomes the *execution of a
decision the player made*, which is the one thing a quiz can never be.

And Beat 2 is nearly free: `buildQuestionFromPair` (`app/sentence-bank.js:965`)
already takes a sentence plus direction and produces tiles, distractors, slots,
alternates and answer validation, all governed by the existing chip standards.

### Scene data format

Mirror the existing `dialogue(text, glosses)` helper (`app/character-data.js:7`)
so per-word glossing works unchanged:

```js
{
  id: "ido-01-the-group-chat",
  characterId: "ido",
  location: "dizengoff-cafe",
  requires: { bondLevel: 1, flags: [] },
  beats: [
    { type: "say", speaker: "ido", dialogueKey: "greeting" },   // reuse the shipped table
    { type: "say", speaker: "ido", line: dialogue("…", { … }) }, // or inline, same shape
    { type: "choose",
      promptEn: "Guy asks if you're coming out tonight.",
      replies: [
        { id: "yes",   labelEn: "Say yes, enthusiastically", tone: "warm",    sentenceId: "colloquial_23", goto: "b-warm",  bondXp: 3, setFlags: ["ido-said-yes"] },
        { id: "maybe", labelEn: "Hedge",                     tone: "evasive", sentenceId: "colloquial_88", goto: "b-hedge", bondXp: 1 },
        { id: "no",    labelEn: "Say you're staying in",     tone: "blunt",   sentenceId: "everyday_41",   goto: "b-blunt", bondXp: 1, setFlags: ["ido-stayed-in"] },
      ] },
    { id: "b-warm",  type: "say", speaker: "ido", line: dialogue(…), goto: "end" },
    { id: "b-hedge", type: "say", speaker: "ido", line: dialogue(…), goto: "end" },
    { id: "b-blunt", type: "say", speaker: "ido", line: dialogue(…), goto: "end" },
  ],
  outcome: { bondXp: 12, setFlags: [] },
}
```

Every `sentenceId` is an **existing row**. Authoring a scene means writing English
beats and picking 6–10 sentence IDs. You author connective tissue, not Hebrew.

### The sentence bank is already level-design data

This is what makes the ambitious pole tractable:

- **`category` is register is *setting*.** 199 colloquial rows are
  street/nightlife scenes; 113 formal + 108 professional are
  office/institutional; 188 everyday is domestic.
- **`style: "whatsapp"` (18 rows) is literally a chat-scene asset.** Ido's route
  already claims `sentenceStyles: ["whatsapp"]` and
  `sentenceCategories: ["colloquial"]`, and his existing dialogue line for that
  activity already reads *"the group chat just blew up — let's see what's going
  on."* **The first scene is effectively written in the data. Build that one.**
- **`sentenceIdPrefixes`** is a per-character content query — `inbal_*` has 95
  rows, making Inbal the second-best-supplied character for scenes.
- **`difficulty`** (1–3) is a per-beat difficulty knob within a scene.
- **`notes`** on all 608 rows is an authored explanation — a free scene footnote.
- **`hebrew_alternates`** means multiple phrasings already validate, so a reply
  does not feel like one memorised string.

**Authoring at scale:** extend the existing `scripts/character-content-report.js`
into a candidate-reply query — "Ido, colloquial, difficulty 2, whatsapp, not yet
used in a scene." Then add `tests/dialogue-scene-integrity.test.js` in the mould
of `tests/sentence-bank-data.test.js`: every `sentenceId` resolves in the deck,
every `goto` resolves to a beat id, no unreachable beats, every `setFlags` entry
is read by some `requires`, every `characterId` exists. That test is what makes 50
scenes maintainable instead of a swamp.

### Chaining is already solved — copy it

`character.captureActivitySummary` (`app/character.js:1565`) already **intercepts
`session.showSessionSummary`** and routes to `finishMission` (`:1589`) instead of
the results screen. That is precisely the "chain scenes and suppress the summary"
mechanism a scene runner needs. Likewise `setRuntimeModeForActivity` (`:1770`)
already performs the "make the runtime think we are in mode X" handoff needed when
a scene hands control to the tile engine for Beat 2. Reuse both; do not invent a
second mechanism.

### Increments

- **V0 — one vignette.** `app/dialogue-scene.js` + `app/dialogue-scene-data.js`
  with a single Ido whatsapp scene: 4 says, 1 choose with 3 replies, 3 one-beat
  branches, converge. No hub, no flags, no persistence beyond "seen." One home
  tile. **Ship criterion: does choose-then-build feel like a conversation?** If
  not, stop — that cost a week, not a quarter. Branching *choice* is what makes
  it a game, and one scene is enough to prove or kill it.
- **V1 — consequences.** `sceneFlags: []` in the state slice; `requires.flags`
  gating; 6–8 scenes. Flags feed `character.buildContentWeigher` (already called
  from `data.pickBestWord`), so a scene where you tell Ido you cook shifts your
  vocabulary weighting toward `cooking_verbs`. That is the consequence loop, and
  the hook for it already exists.
- **V2 — hub map.** Reskin `#characterMissionHub` as a location map, with
  locations gated on `requires.bondLevel` — bond levels already exist and already
  persist across the daily reset. "Navigating interactions" arrives *last*,
  because a hub is worthless before there are scenes to navigate to.

### Friction to expect

- **A scene is not a round.** `showSessionSummary` and `getGameplayHeaderMeta`
  assume every mode has rounds, a timer, and correct/incorrect counts. Hence
  `hasRounds: false` in the registry descriptor plus header and summary
  special-casing — roughly a day, unavoidable.
- **Mid-scene resumability is a hard requirement.** Full session resumability is a
  shipped guarantee; `persistSessionState` snapshots every mode. A mid-scene
  reload must restore both the beat cursor and the in-flight tile board — reuse
  `cloneSentenceBankQuestionSnapshot` (`app/sentence-bank.js:1217`) for the
  Beat-2 half.
- **`docs/character-gameplay-strategy.md:232-244`** says not to weave character
  art into gameplay while designs are incomplete, and to integrate through one
  generic character interface. Both A3 (`data-character`) and the scene format
  honour this — they route on data, never on hardcoded per-character branches.
  Keep it that way. (Note that section is otherwise stale: sprites for all four
  characters have shipped.)

---

## Gap ledger

All twenty verified gaps, with the tranche that addresses each. "Evidence" is how
absence was established.

| # | Gap | Tier | Evidence | Addressed by |
|---|---|---|---|---|
| 1 | Construct state (סמיכות) as a system | 1 | Only hit for `סמיכות` anywhere is a vocab card teaching it as a word to memorise | C1 `phraseType` → C-deferred builder |
| 2 | Noun possessive suffixes | 1 | Paradigms exist only on prepositions and 12 idiom nouns; 3 of 608 sentences use noun+suffix vs 52 with `של` | C4 (seeded) |
| 3 | Passive binyanim as living morphology | 1 | pual/hufal appear only as 3ms-past recognition tiles; zero hits in vocab/verbs/sentences | C-deferred (nifal wedge first) |
| 4 | שם פעולה / verbal nouns unlinked | 1 | ~193 pattern nouns exist as unrelated cards; no verbal-noun field on any verb | Deferred (27 pairs, ~65% precision) |
| 5 | Number *agreement* (gender polarity, counting form) and clock/date idiom | 2 | polarity and `שלושת` undrillable — no gendered-noun data; clock time in 3 of 608 sentences. **Not** "cannot count": bare cardinals are deliberately out of scope | **C3**, optional |
| 6 | Question words; `האם` formal questions | 2 | 0 of 1,684 cards; `האם` in 0 of 608 sentences | C-deferred cohort |
| 7 | Quantifiers | 2 | 0 cards; 30 incidental sentence uses | C-deferred |
| 8 | Comparatives / superlatives | 2 | No paradigm; 22 incidental sentence uses | C-deferred |
| 9 | Modals | 2 | 5 cards; `צריך`/`יכול`/`חייב`/`אפשר` = 0, `צריך` deliberately removed | C-deferred (inflection split + `היה`) |
| 10 | Negation system | 2 | `אין` 22, `אל` 10, `אף` 2 sentence uses; no drill | C-deferred |
| 11 | Conditionals / irrealis | 2 | 15 sentences with `אם`, 3 with `אילו`, 2 with `היה`+participle | C-deferred |
| 12 | Register as data | 3 | 0 `register` fields outside `verb-game-data.js` | **C1** |
| 13 | Real frequency ranking | 3 | `utility` computed positionally from authoring order | **C1 `corpusHits`** |
| 14 | **Production: typing** | 3 | `grep -c '<input' index.html` → 0 | **C2** |
| 15 | Ktiv male vs haser never taught | 3 | Convention enforced by tests, never surfaced; `כתיב` not a card | **C2 (free)** |
| 16 | Unvocalised reading as graded skill | 3 | Niqud is a global on/off preference, not a progression; only 2 vocab homographs exist | Not addressed — needs a design |
| 17 | Listening beyond sentence rebuild | 3 | Shema grades exact token order; no comprehension questions; no human audio | **C2 dictation** (partial) |
| 18 | Pragmatics / dialogue | 3 | All 608 items single-turn; politeness markers in 9 | **E** + C4 future-as-request |
| 19 | Formal written register / documents | 3 | No `לכבוד`/`בכבוד רב`/`הנדון`; 113 formal rows are isolated lines | C-deferred |
| 20 | Root and mishkal awareness | 3 | Binyanim stops at glossing a 3ms-past form; no root extraction, no noun patterns | **C4** |

---

## Non-goals

Recorded so they are not re-proposed:

- Haptics (iOS Safari cannot).
- A global learner XP economy (bond XP is better designed).
- A badge wall (content debt, no learning value).
- A skill tree (fights the Leitner scheduler).
- Per-character display fonts (stomps a user preference).
- A virtual-DOM or diffing layer (three conventions suffice).
- Leaderboards, social features.
- Recorded human audio.
- CEFR banding (unfalsifiable without a corpus).
- New function-word vocabulary cards (see the positioning policy in Tranche C).

## Itamar

`docs/character-gameplay-strategy.md:70-79` specifies a fifth character who owns
no subject area and drills the learner's weakest material. He is unbuilt:
`grep -ri itamar app/ index.html styles.css` returns zero hits. He has no sprites,
no dialogue table, and `character.ownsItem` has no representation for an adaptive
route as opposed to a subject route — that is a genuine design gap, not just
missing content.

Do not block Tranche E on him. Build scenes for Ido, who has 672 routed items and
is the best-supplied character.

## Recommended sequencing

1. **A0, A0b, A1, A2** — ≈1.5 days. Fixes a real session-state bug, adds the
   accessibility floor, and makes every answer in all nine modes feel like
   something.
2. **A3, A4** — ≈2.5 days. Per-character palette and a companion that breathes.
3. **C1 `corpusHits` alone** — the first content change the learner feels, and it
   de-risks the annotation sidecar.
4. **B1, B2** — the app starts showing what it knows.
5. **C2 typing** — the highest-value new mode; verify the 360×640 layout first.
6. **A5, C1 remaining annotations, C3, C4** — in whatever order appetite allows.
7. **D1 then D2** — pure debt, no user-visible change, but do not attempt E
   before it: a scene mode is the mode most likely to need rapid iteration, and
   iterating across ten hardcoded switch sites is how this stalls.
8. **E V0** — the go/no-go gate.

Items 1 and 2 together are about four days and constitute the entire tractable
pole. If nothing else here ever ships, that is still a real change in how the app
feels.

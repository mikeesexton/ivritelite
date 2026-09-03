# IvritElite (Advanced Duolingo-Style Hebrew Trainer)

Browser-only vocabulary trainer focused on advanced, practical Hebrew.

## Included in v1

- Fixed 10-round lesson flow with mixed forward/backward translation
- Mobile + desktop responsive UI (no install required)
- Adaptive spaced repetition (local-only progress)
- Inline nikud toggle next to Hebrew prompt text (`Show Nikud` / `Hide Nikud`)
- Start-screen performance snapshot by vocabulary type (emoji ring + ✅/❌ counts since last reset)
- Unified vocabulary pool (no category or curriculum-size filtering)
- Seed vocabulary set (938 entries) including:
  - Duolingo Advanced Core
  - Cooking Utensils
  - Cooking Verbs
  - Health
  - Work & Business
  - Bureaucracy
  - Home & Everyday Life
  - Abstract Thinking & Philosophy
  - Emotional Nuance
  - Conversation Glue
  - Legal & Civic Concepts
  - Technology & AI
  - Finance & Investing
  - Social & Cultural Reality
  - Dating & Relationships
  - Meta-Language
  - Scientific & Analytical
- Expanded tracks for abstract discourse, legal systems, tech/AI, finance, science, culture, communication, advanced grammar, and high-level policy discourse
- Every entry has nikud rendering in-app (seeded forms plus fallback rendering where needed)
- Structured Hebrew verb-conjugation pipeline with authoritative vs generated forms
- Starter verb set with curated irregular verbs and generation-gated regular verbs
- Migration/report workflow for existing verb vocab (`migrate-hebrew-verbs.mjs`)
- Automated regression tests for conjugation routing and fake-form rejection

## Setup on a new machine

Clone to `~/Developer/ivritelite`. Use the same absolute path on every machine — the
agent tools (Claude Code, Codex, Antigravity) store project paths absolutely.

**Do not keep this repo under `~/Documents` or `~/Desktop`.** With iCloud "Desktop &
Documents Folders" sync on, macOS evicts `.git` objects to the cloud (`dataless`,
zero blocks on disk) and writes sync-conflict files such as `.git/index 2` into git's
own metadata. That stalls git commands for minutes and can corrupt the repository.

Node — required for the test suite:

```bash
nvm use          # reads .nvmrc (Node 24, matching CI)
npm test         # expect 459 tests
```

`node --test` discovers test files by glob. On Node below 20 it finds none and exits
0, so an unexpectedly low test count is a failure, not a pass. CI enforces a floor of
400; locally you have to read the number.

Python — required only for the sprite pipeline (`npm run sprites:*`):

```bash
python3 -m pip install -r requirements.txt   # Pillow
npm run sprites:audit                        # exercises the whole toolchain
```

Chrome or Chromium is optional but worth installing: `tests/gameplay-layout.test.js`
skips itself when neither is present, which silently retires the rendered-layout
guard.

## Run

Option A (quick): double-click `index.html`.

Option B (recommended local server):

```bash
cd ~/Developer/ivritelite
/usr/bin/python3 -m http.server 8080
```

Then open:

`http://localhost:8080`

If your shell has a different Python path, this also works:

```bash
python3 -m http.server 8080
```

If your environment blocks binding a local port, use Option A and open `index.html` directly.

If you still see the old non-working page, force refresh (`Cmd+Shift+R`) after reopening.

## Verify

Run the conjugation regression tests:

```bash
npm test
```

Generate the current Hebrew verb migration report and structured draft entries:

```bash
npm run migrate:verbs
```

That writes:

- `generated/verbs/hebrew-verb-review-report.json`
- `generated/verbs/hebrew-verb-review-report.md`
- `generated/verbs/hebrew-verb-migrated.json`

## Publish To GitHub Pages

This app is a static browser game, so GitHub Pages is a good fit.

After you push this repo to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Source` to `GitHub Actions`.
4. Pushes to `main` will deploy the site automatically using `.github/workflows/deploy-pages.yml`.

The `.nojekyll` file is included so GitHub Pages serves the app as a plain static site.

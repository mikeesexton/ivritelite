"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.join(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");

// Every module export in this app is written `x = x || function`, so a stale
// cached copy does not merely lag — it *wins* over the new one. app/lesson.js
// was gutted from ~639 lines to 42 on 2026-06-20 and kept shipping under a
// 2026-03-15 cache key until 2026-08-17. Nothing failed; the browser simply
// never fetched the new file. docs/project-rules.md calls the bump "required
// before push — do not skip", and until now nothing checked it.

const REFERENCE = /(?:src|href)="\.\/([^"?]+\.(?:js|css))(?:\?v=([^"]*))?"/g;

function versionMap(html) {
  const map = new Map();
  for (const [, file, version] of html.matchAll(REFERENCE)) {
    map.set(file, version ?? null);
  }
  return map;
}

const versions = versionMap(indexHtml);

test("every local script and stylesheet carries a ?v= cache key", () => {
  const missing = [...versions].filter(([, v]) => v === null).map(([f]) => f);
  assert.deepEqual(
    missing,
    [],
    `index.html references these without a ?v=, so browsers will cache them forever: ${missing.join(", ")}`
  );
});

test("every cache key uses the documented YYYYMMDD+letter form", () => {
  const malformed = [...versions]
    .filter(([, v]) => v !== null && !/^\d{8}[a-z]+$/.test(v))
    .map(([f, v]) => `${f} (?v=${v})`);
  assert.deepEqual(
    malformed,
    [],
    `docs/project-rules.md specifies today's date plus a letter, e.g. 20260704a: ${malformed.join(", ")}`
  );
});

test("every versioned reference points at a file that exists", () => {
  const dangling = [...versions.keys()].filter(
    (file) => !fs.existsSync(path.join(repoRoot, file))
  );
  assert.deepEqual(
    dangling,
    [],
    `index.html loads files that are not in the repo, which 404 in production: ${dangling.join(", ")}`
  );
});

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return null;
  }
}

// The check that actually enforces the rule: anything shipped that changed on
// this branch must have had its cache key changed too. Needs a merge base, so
// CI checks out with fetch-depth: 0.
test("every changed file that index.html ships also had its ?v= bumped", (t) => {
  const base = git(["merge-base", "origin/main", "HEAD"]);
  if (!base) {
    t.skip(
      "no merge base with origin/main (shallow clone or missing remote); " +
        "the structural cache-key checks above still ran"
    );
    return;
  }

  const changed = (git(["diff", "--name-only", base]) || "")
    .split("\n")
    .filter(Boolean);
  const shippedChanged = changed.filter((file) => versions.has(file));
  if (shippedChanged.length === 0) return;

  const baseIndex = git(["show", `${base}:index.html`]);
  assert.ok(baseIndex, "could not read index.html at the merge base");
  const baseVersions = versionMap(baseIndex);

  const unbumped = shippedChanged.filter(
    (file) => baseVersions.get(file) === versions.get(file)
  );
  assert.deepEqual(
    unbumped,
    [],
    `changed since ${base.slice(0, 7)} but their ?v= in index.html is unchanged, ` +
      `so browsers keep serving the old copy: ${unbumped.join(", ")}`
  );
});

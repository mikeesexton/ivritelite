"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");

function readLines(relativePath) {
  const absolute = path.join(repoRoot, relativePath);
  return fs.readFileSync(absolute, "utf8").split("\n");
}

// The two agent instruction files diverged silently for months: cache-busting
// and the Hebrew pointing convention lived only in CLAUDE.md, while the
// sentence-bank authoring standard and the viewport floor lived only in
// AGENTS.md. Codex authored pointed content without ever seeing the pointing
// rule. Nothing contradicted, so nothing failed — the rules just went missing
// for whichever agent was in the room. These tests make that failure loud.

test("CLAUDE.md and AGENTS.md are identical below their title line", () => {
  const claude = readLines("CLAUDE.md");
  const agents = readLines("AGENTS.md");

  assert.equal(
    agents.slice(1).join("\n"),
    claude.slice(1).join("\n"),
    "CLAUDE.md and AGENTS.md have drifted. Put the rule in docs/project-rules.md, " +
      "then regenerate AGENTS.md from CLAUDE.md's body so both agents see it."
  );
});

test("each agent file keeps its own title", () => {
  assert.match(readLines("CLAUDE.md")[0], /^# Claude Code/);
  assert.match(readLines("AGENTS.md")[0], /^# Codex Agent/);
});

test("both agent files point at the canonical rules doc", () => {
  for (const file of ["CLAUDE.md", "AGENTS.md"]) {
    assert.ok(
      readLines(file).join("\n").includes("docs/project-rules.md"),
      `${file} must direct the agent to docs/project-rules.md`
    );
  }
});

test("the canonical rules doc still carries every load-bearing rule", () => {
  const rules = readLines("docs/project-rules.md").join("\n");

  const requiredSections = [
    "## Task Log (required)",
    "## General editing approach",
    "## Cache-busting (required before push — do not skip)",
    "## Hebrew pointing convention (data files)",
    "## Sentence-bank authoring (required)",
    "## Gameplay viewport floor (required)",
    "## Character sprite visual review (required)",
    "## Character artwork approval and cost control (required)",
    "## Project structure",
  ];

  for (const section of requiredSections) {
    assert.ok(
      rules.includes(section),
      `docs/project-rules.md is missing "${section}". It was merged there from ` +
        "CLAUDE.md and AGENTS.md; removing it drops the rule for both agents."
    );
  }
});

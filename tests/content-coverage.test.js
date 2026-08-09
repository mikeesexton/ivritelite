const test = require("node:test");
const assert = require("node:assert/strict");

const coverage = require("../scripts/content-coverage-report.js");

test("coverage matching accepts ordinary Hebrew clitics without using stems", () => {
  const sentence = { id: "example", hebrew: "הסיסמה נשמרה במחשב." };
  assert.equal(coverage.sentenceTestsHeadword(sentence, "סיסמה"), true);
  assert.equal(coverage.sentenceTestsHeadword(sentence, "מחשב"), true);
  assert.equal(coverage.sentenceTestsHeadword(sentence, "שמירה"), false);
});

test("coverage report exposes exact, reviewed, and unsupported states", () => {
  const vocabulary = [
    { id: "exact", category: "test", he: "סיסמה" },
    { id: "reviewed", category: "test", he: "שמירה" },
    { id: "unsupported", category: "test", he: "גיבוי" },
  ];
  const sentences = [{ id: "s1", hebrew: "הסיסמה נשמרה." }];
  const report = coverage.buildCoverageReport({
    vocabulary,
    sentences,
    reviewedSupport: { reviewed: ["s1"] },
  });
  assert.deepEqual(report.records.map((record) => record.status), ["exact", "reviewed", "unsupported"]);
  assert.deepEqual({ ...report.categories.get("test") }, { total: 3, exact: 1, reviewed: 1, unsupported: 1 });
});

test("reviewed coverage ids must resolve to real sentences", () => {
  assert.throws(
    () => coverage.buildCoverageReport({
      vocabulary: [{ id: "word", category: "test", he: "מילה" }],
      sentences: [],
      reviewedSupport: { word: ["missing"] },
    }),
    /missing sentence/,
  );
});

test("production coverage stays measurable and every reviewed id resolves", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.equal(report.records.length, 2168);
  assert.equal(report.records.filter((record) => record.status === "exact").length, 600);
  assert.equal(report.records.filter((record) => record.status === "reviewed").length, 0);
  assert.equal(report.records.filter((record) => record.status === "unsupported").length, 1568);
});

test("every card in the new cast and smartphone tranches has exact sentence support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const starts = new Map([
    ["media_digital_life_expanded", 27],
    ["literature_arts_cultural_history", 31],
    ["emergency_response", 68],
    ["devices_os_apps", 76],
    ["religious_life_practice", 112],
  ]);
  const added = report.records.filter((record) => {
    const start = starts.get(record.word.category);
    const index = Number(record.word.id.match(/-(\d{3})-/)?.[1]);
    return start && index >= start;
  });

  assert.equal(added.length, 60);
  assert.equal(added.filter((record) => record.status !== "exact").length, 0);
});

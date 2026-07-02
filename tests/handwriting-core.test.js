const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadHandwritingCore() {
  const sourcePath = path.join(__dirname, "..", "app", "handwriting-core.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  const context = {
    window: {},
    globalThis: {},
  };

  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });

  return context.IvriQuestApp.handwritingCore;
}

const core = loadHandwritingCore();

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function jitterStrokes(strokes, amount, seed = 1) {
  let state = seed;
  const random = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  return strokes.map((stroke) => ({
    points: stroke.points.map(([x, y]) => [x + (random() * 2 - 1) * amount, y + (random() * 2 - 1) * amount]),
  }));
}

const L_SHAPE = [{ points: [[0.3, 0.2], [0.3, 0.7], [0.7, 0.7]] }];
const DIAGONAL = [{ points: [[0.7, 0.2], [0.3, 0.7]] }];

test("resamplePoints returns the requested count with preserved endpoints", () => {
  const points = [[0, 0], [1, 0]];
  const resampled = core.resamplePoints(points, 9);
  assert.equal(resampled.length, 9);
  assert.deepEqual(plain(resampled[0]), [0, 0]);
  assert.ok(Math.abs(resampled[8][0] - 1) < 1e-9);
  for (let i = 1; i < resampled.length; i += 1) {
    const gap = resampled[i][0] - resampled[i - 1][0];
    assert.ok(Math.abs(gap - 0.125) < 1e-6, `expected uniform spacing, got ${gap}`);
  }
});

test("pathLength sums segment lengths", () => {
  assert.equal(core.pathLength([[0, 0], [0.3, 0], [0.3, 0.4]]), 0.7);
  assert.equal(core.pathLength([[0.5, 0.5]]), 0);
  assert.equal(core.pathLength([]), 0);
});

test("scoreTrace passes a template traced against itself", () => {
  const result = core.scoreTrace(L_SHAPE, L_SHAPE);
  assert.ok(result.score >= 95, `expected near-perfect score, got ${result.score}`);
  assert.equal(result.pass, true);
});

test("scoreTrace tolerates hand jitter", () => {
  const result = core.scoreTrace(jitterStrokes(L_SHAPE, 0.04), L_SHAPE);
  assert.equal(result.pass, true, `expected jittered trace to pass, got score ${result.score} coverage ${result.coverage}`);
});

test("scoreTrace fails a different shape", () => {
  const result = core.scoreTrace(DIAGONAL, L_SHAPE);
  assert.equal(result.pass, false);
});

test("scoreTrace fails empty ink", () => {
  const result = core.scoreTrace([], L_SHAPE);
  assert.deepEqual(plain(result), { coverage: 0, precision: 0, score: 0, pass: false });
});

test("scoreTrace penalizes stray ink through precision", () => {
  const clean = core.scoreTrace(L_SHAPE, L_SHAPE);
  const stray = core.scoreTrace([...L_SHAPE, { points: [[0.05, 0.05], [0.95, 0.05]] }], L_SHAPE);
  assert.ok(stray.precision < clean.precision);
  assert.ok(stray.score < clean.score);
});

test("applyAttemptToProgress moves the box up on pass and down on fail with clamps", () => {
  const start = core.normalizeProgressEntry(null);
  const passed = core.applyAttemptToProgress(start, { pass: true, score: 88, nowMs: 1000 });
  assert.equal(passed.attempts, 1);
  assert.equal(passed.correct, 1);
  assert.equal(passed.box, 1);
  assert.equal(passed.streak, 1);
  assert.equal(passed.lastScore, 88);
  assert.equal(passed.lastSeenMs, 1000);

  const failed = core.applyAttemptToProgress(passed, { pass: false, score: 20, nowMs: 2000 });
  assert.equal(failed.box, 0);
  assert.equal(failed.streak, 0);

  const floor = core.applyAttemptToProgress(failed, { pass: false, score: 0, nowMs: 3000 });
  assert.equal(floor.box, 0);

  let ceiling = core.normalizeProgressEntry({ attempts: 20, correct: 20, box: 7 });
  ceiling = core.applyAttemptToProgress(ceiling, { pass: true, score: 100, nowMs: 4000 });
  assert.equal(ceiling.box, 7);
});

test("applyAttemptToProgress tracks test-mode counters only in test submode", () => {
  const start = core.normalizeProgressEntry(null);
  const learn = core.applyAttemptToProgress(start, { pass: true, score: 90, nowMs: 1, submode: "learn" });
  assert.equal(learn.testAttempts, 0);
  const tested = core.applyAttemptToProgress(learn, { pass: true, score: 100, nowMs: 2, submode: "test" });
  assert.equal(tested.testAttempts, 1);
  assert.equal(tested.testCorrect, 1);
});

const FORMS = [
  { id: "alef", order: 1 },
  { id: "bet", order: 2 },
  { id: "gimel", order: 3 },
  { id: "dalet", order: 4 },
];
const INTERVALS = [0, 100, 200];

test("pickHandwritingSession introduces new letters in curriculum order and fills by cycling", () => {
  const rounds = core.pickHandwritingSession({}, FORMS, { rounds: 6, maxNew: 2, nowMs: 0, intervals: INTERVALS });
  assert.equal(rounds.length, 6);
  assert.equal(rounds[0].letterformId, "alef");
  assert.equal(rounds[0].isNew, true);
  assert.equal(rounds[1].letterformId, "bet");
  assert.equal(rounds[1].isNew, true);
  const ids = new Set(rounds.map((round) => round.letterformId));
  assert.deepEqual([...ids].sort(), ["alef", "bet"]);
});

test("pickHandwritingSession prefers overdue weak letters over strong ones", () => {
  const progress = {
    alef: { attempts: 5, correct: 5, box: 2, lastSeenMs: 0, lastScore: 95 },
    bet: { attempts: 5, correct: 1, box: 0, lastSeenMs: 0, lastScore: 40 },
    gimel: { attempts: 5, correct: 3, box: 1, lastSeenMs: 0, lastScore: 70 },
    dalet: { attempts: 5, correct: 5, box: 2, lastSeenMs: 950, lastScore: 90 },
  };
  const rounds = core.pickHandwritingSession(progress, FORMS, { rounds: 3, maxNew: 0, nowMs: 1000, intervals: INTERVALS });
  assert.equal(rounds[0].letterformId, "bet");
  assert.equal(rounds[1].letterformId, "gimel");
  assert.equal(rounds[2].letterformId, "alef");
});

test("pickHandwritingSession caps new letters per session", () => {
  const rounds = core.pickHandwritingSession({}, FORMS, { rounds: 10, maxNew: 2, nowMs: 0, intervals: INTERVALS });
  const newIds = new Set(rounds.filter((round) => round.isNew).map((round) => round.letterformId));
  assert.equal(newIds.size, 2);
});

test("letterformIdsForWord maps final forms and skips unknown characters", () => {
  const charToId = { א: "alef", ף: "pe-final", פ: "pe" };
  assert.deepEqual(plain(core.letterformIdsForWord("אף!", charToId)), ["alef", "pe-final"]);
  assert.deepEqual(plain(core.letterformIdsForWord("", charToId)), []);
});

test("buildSentenceCells keeps every character in order and maps only letters", () => {
  const charToId = { א: "alef", ו: "vav", ן: "nun-final", ל: "lamed", ו2: "x" };
  const cells = core.buildSentenceCells("אול, ן", charToId);
  assert.deepEqual(plain(cells.map((c) => c.char)), ["א", "ו", "ל", ",", " ", "ן"]);
  assert.deepEqual(plain(cells.map((c) => c.letterformId)), ["alef", "vav", "lamed", null, null, "nun-final"]);
  assert.equal(core.countLetterCells(cells), 4);
  assert.equal(core.countLetterCells([]), 0);
});

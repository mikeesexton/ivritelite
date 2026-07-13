const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const FIXED_NOW = 1_800_000_000_000;

function loadUtils({ mathRandom, now = FIXED_NOW } = {}) {
  const sourcePath = path.join(__dirname, "..", "app", "utils.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  const testMath = Object.create(Math);
  if (typeof mathRandom === "function") {
    testMath.random = mathRandom;
  }
  const context = {
    window: {},
    globalThis: {},
    Math: testMath,
    Date: { now: () => now },
  };

  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });

  return context.IvriQuestApp.utils;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("normalizeAdaptiveRecord fills defaults, clamps invalid values, and derives misses", () => {
  const utils = loadUtils();

  assert.deepEqual(plain(utils.normalizeAdaptiveRecord(undefined)), {
    attempts: 0,
    correct: 0,
    misses: 0,
    lastSeen: 0,
  });
  assert.deepEqual(plain(utils.normalizeAdaptiveRecord({ attempts: -2, correct: -1, lastSeen: -5 })), {
    attempts: 0,
    correct: 0,
    misses: 0,
    lastSeen: 0,
  });
  assert.deepEqual(plain(utils.normalizeAdaptiveRecord({ attempts: 3, correct: 5 })), {
    attempts: 3,
    correct: 3,
    misses: 0,
    lastSeen: 0,
  });
  assert.deepEqual(plain(utils.normalizeAdaptiveRecord({ attempts: 4, correct: 1, lastSeen: 12345 })), {
    attempts: 4,
    correct: 1,
    misses: 3,
    lastSeen: 12345,
  });
  assert.equal(utils.normalizeAdaptiveRecord({ attempts: 4, correct: 1, misses: 1 }).misses, 1);
});

test("getAdaptiveWeight favors new, weak, and missy items over strong or recent ones", () => {
  const utils = loadUtils({ mathRandom: () => 0 });

  const newWeight = utils.getAdaptiveWeight(undefined);
  const strongCleanWeight = utils.getAdaptiveWeight({ attempts: 10, correct: 10, misses: 0, lastSeen: 0 });
  assert.ok(newWeight > strongCleanWeight);

  const missyWeight = utils.getAdaptiveWeight({ attempts: 4, correct: 1, misses: 3, lastSeen: 0 });
  const cleanWeight = utils.getAdaptiveWeight({ attempts: 4, correct: 4, misses: 0, lastSeen: 0 });
  assert.ok(missyWeight > cleanWeight);

  const justSeenWeight = utils.getAdaptiveWeight({ attempts: 4, correct: 2, misses: 2, lastSeen: FIXED_NOW - 60 * 1000 });
  const restedWeight = utils.getAdaptiveWeight({ attempts: 4, correct: 2, misses: 2, lastSeen: FIXED_NOW - 11 * 60 * 1000 });
  assert.ok(justSeenWeight < restedWeight);
  assert.ok(Math.abs(justSeenWeight - restedWeight * 0.6) < 1e-9);

  const almostStrongWeight = utils.getAdaptiveWeight({ attempts: 5, correct: 5, misses: 0, lastSeen: 0 });
  const strongDampedWeight = utils.getAdaptiveWeight({ attempts: 6, correct: 6, misses: 0, lastSeen: 0 });
  assert.ok(Math.abs(strongDampedWeight - almostStrongWeight * 0.45) < 1e-9);
});

test("pickWeightedSubset samples without replacement and respects weights", () => {
  const utils = loadUtils({ mathRandom: () => 0.5 });
  const light = { id: "light" };
  const heavy = { id: "heavy" };

  const picked = utils.pickWeightedSubset(
    [
      { word: light, weight: 1 },
      { word: heavy, weight: 3 },
    ],
    2
  );
  assert.deepEqual(plain(picked.map((item) => item.id)), ["heavy", "light"]);
});

test("pickWeightedSubset returns the whole pool when count exceeds it and handles zero weights", () => {
  const utils = loadUtils({ mathRandom: () => 0.5 });
  const items = [{ id: "a" }, { id: "b" }, { id: "c" }];

  const all = utils.pickWeightedSubset(items.map((word) => ({ word, weight: 1 })), 10);
  assert.equal(all.length, 3);
  assert.equal(new Set(all.map((item) => item.id)).size, 3);

  const zeroWeighted = utils.pickWeightedSubset(items.map((word) => ({ word, weight: 0 })), 2);
  assert.equal(zeroWeighted.length, 2);
  assert.equal(new Set(zeroWeighted.map((item) => item.id)).size, 2);
});

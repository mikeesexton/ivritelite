const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadHandwritingHarness() {
  const soundLog = [];
  const context = {
    console,
    window: null,
    globalThis: null,
    IvriQuestApp: {
      handwriting: {
        // Pre-stubbed so the module's `x = x || function ...` idiom keeps these
        // no-ops: the real versions write progress and redraw the stage.
        updateHandwritingProgress() {},
        advanceHandwritingCell() {},
      },
      handwritingCore: {
        scoreTrace: null,
        pathLength: () => 1,
      },
      runtime: {
        constants: { HANDWRITING_TRACE_PASS_SCORE: 70, STREAK_SOUND_INTERVAL: 4 },
        global: { setTimeout() {}, clearTimeout() {} },
        helpers: {
          t: (key) => key,
          setFeedback() {},
          clearFeedback() {},
          playAnswerFeedbackSound(isCorrect) {
            soundLog.push(isCorrect === true);
          },
        },
        state: {
          language: "en",
          sessionStreak: 0,
          handwriting: null,
        },
      },
    },
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  ["handwriting-data.js", path.join("app", "handwriting.js")].forEach((relativePath) => {
    const sourcePath = path.join(__dirname, "..", relativePath);
    vm.runInContext(fs.readFileSync(sourcePath, "utf8"), context, { filename: sourcePath });
  });

  const letterformId = context.IvriQuestHandwritingData.getLetterforms()[0].id;
  context.IvriQuestApp.runtime.state.handwriting = {
    active: true,
    rounds: [{ cells: [{ letterformId }] }],
    roundIndex: 0,
    totalRounds: 1,
    cellIndex: 0,
    currentStrokes: [{ points: [{ x: 0.1, y: 0.1 }, { x: 0.2, y: 0.2 }] }],
    attemptsThisCell: 0,
    cellRecorded: false,
    lastTone: "",
    correctCount: 0,
    mismatchCount: 0,
    sessionMistakeIds: [],
    isResolving: false,
  };

  const app = context.IvriQuestApp;
  return {
    app,
    soundLog,
    state: app.runtime.state,
    attempt(pass) {
      app.handwritingCore.scoreTrace = () => ({ score: pass ? 90 : 20, pass });
      app.runtime.state.handwriting.isResolving = false;
      app.handwriting.checkHandwritingAttempt();
    },
  };
}

test("handwriting advances the session streak so the fourth correct trace hits the streak cue", () => {
  const harness = loadHandwritingHarness();

  const streaks = [];
  for (let i = 0; i < 4; i += 1) {
    harness.attempt(true);
    streaks.push(harness.state.sessionStreak);
  }

  assert.deepEqual(streaks, [1, 2, 3, 4]);
  assert.deepEqual(harness.soundLog, [true, true, true, true]);

  const interval = harness.app.runtime.constants.STREAK_SOUND_INTERVAL;
  assert.deepEqual(
    streaks.map((streak) => streak % interval === 0),
    [false, false, false, true]
  );
});

test("a failed handwriting trace clears the session streak", () => {
  const harness = loadHandwritingHarness();

  harness.attempt(true);
  harness.attempt(true);
  assert.equal(harness.state.sessionStreak, 2);

  harness.attempt(false);
  assert.equal(harness.state.sessionStreak, 0);
  assert.deepEqual(harness.soundLog, [true, true, false]);

  harness.attempt(true);
  assert.equal(harness.state.sessionStreak, 1);
});

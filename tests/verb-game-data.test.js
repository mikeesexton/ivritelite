const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const verbGameData = require("../verb-game-data.js");

class FakeClassList {
  constructor() {
    this.tokens = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this.tokens.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.tokens.delete(token));
  }

  toggle(token, force) {
    if (force) {
      this.tokens.add(token);
      return true;
    }
    this.tokens.delete(token);
    return false;
  }

  contains(token) {
    return this.tokens.has(token);
  }
}

class FakeElement {
  constructor() {
    this.classList = new FakeClassList();
    this.attributes = {};
    this.textContent = "";
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name];
  }
}

function loadBinyanApp(language = "en") {
  const context = {
    console,
    globalThis: null,
  };
  context.globalThis = context;

  const runScript = (relativePath) => {
    const source = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
    vm.runInNewContext(source, context, { filename: relativePath });
  };

  runScript("app/bootstrap-data.js");
  context.IvriQuestVerbGameData = verbGameData;
  context.IvriQuestApp.runtime = {
    i18nBundles: context.IvriQuestApp.bootstrapData.I18N,
    state: {
      language,
      binyanBoard: { currentQuestion: null },
    },
    helpers: {},
  };
  runScript("app/i18n.js");
  context.IvriQuestApp.runtime.helpers.t = context.IvriQuestApp.i18n.t;
  runScript("app/binyan-board.js");
  return context.IvriQuestApp;
}

function loadBinyanBoard(language = "en") {
  return loadBinyanApp(language).binyanBoard;
}

const REQUIRED_EXISTING_FORM_FIELDS = [
  "actual_binyan",
  "form_vocalized",
  "form_plain",
  "translit",
  "gloss",
  "function",
  "voice",
  "valence",
];

function buildTestBinyanDeckEntries() {
  const binyanNames = new Map(verbGameData.BINYANIM.map((entry) => [entry.slot, entry.name_he]));
  const roots = verbGameData.ROOTS.map((root) => ({
    id: root.id,
    root: root.root,
    coreMeaning: root.core_meaning || "",
    difficulty: root.difficulty || "",
    forms: Object.entries(root.forms || {})
      .filter(([, form]) => form?.exists === true)
      .map(([slot, form]) => ({
        formId: `${root.id}:${slot}`,
        rootId: root.id,
        slot,
        binyanNameHe: binyanNames.get(slot) || "",
        formVocalized: form.form_vocalized || "",
        translit: form.translit || "",
        gloss: form.gloss || "",
        func: form.function || "",
        teachingPoint: form.teaching_point || "",
        distractorEligible: form.distractor_eligible !== false,
      })),
    cleared: false,
  })).filter((root) => root.forms.length > 0);

  return {
    roots,
    distractorPool: roots.flatMap((root) => (
      root.forms
        .filter((form) => form.distractorEligible && form.gloss)
        .map((form) => form.gloss)
    )),
  };
}

test("binyan root data stays broad enough and fully authored", () => {
  const slots = new Set(verbGameData.BINYANIM.map((entry) => entry.slot));
  const rootIds = new Set();
  const formIds = new Set();
  let playableFormCount = 0;

  assert.equal(verbGameData.ROOTS.length, 14);

  for (const root of verbGameData.ROOTS) {
    assert.ok(root.id);
    assert.equal(rootIds.has(root.id), false, `duplicate root id: ${root.id}`);
    rootIds.add(root.id);
    assert.ok(root.root);
    assert.ok(root.core_meaning);
    assert.ok(root.difficulty);
    assert.ok(root.forms);

    const existingForms = Object.entries(root.forms).filter(([, form]) => form?.exists === true);
    assert.ok(existingForms.length >= 3, `${root.id} needs at least three playable forms`);
    if (!["ts-l-m"].includes(root.id)) {
      assert.ok(existingForms.length >= 4, `${root.id} needs at least four playable forms`);
    }
    playableFormCount += existingForms.length;

    for (const [slot, form] of Object.entries(root.forms)) {
      assert.ok(slots.has(slot), `${root.id} has unknown slot ${slot}`);
      if (form?.exists !== true) continue;

      const formId = `${root.id}:${slot}`;
      assert.equal(formIds.has(formId), false, `duplicate form id: ${formId}`);
      formIds.add(formId);

      for (const field of REQUIRED_EXISTING_FORM_FIELDS) {
        assert.equal(typeof form[field], "string", `${formId} missing ${field}`);
        assert.ok(form[field].trim(), `${formId} has blank ${field}`);
      }
    }
  }

  assert.ok(playableFormCount >= 65);
  assert.ok(playableFormCount <= 75);
});

test("binyan root data keeps duplicate plain forms distinguishable", () => {
  for (const root of verbGameData.ROOTS) {
    const byPlain = new Map();
    for (const [slot, form] of Object.entries(root.forms || {})) {
      if (form?.exists !== true) continue;
      const key = form.form_plain;
      const siblings = byPlain.get(key) || [];
      siblings.push({ slot, form });
      byPlain.set(key, siblings);
    }

    for (const [plain, siblings] of byPlain.entries()) {
      if (siblings.length <= 1) continue;
      const vocalized = new Set(siblings.map(({ form }) => form.form_vocalized));
      const glosses = new Set(siblings.map(({ form }) => form.gloss));
      assert.equal(vocalized.size, siblings.length, `${root.id}:${plain} needs distinct niqqud`);
      assert.equal(glosses.size, siblings.length, `${root.id}:${plain} needs distinct glosses`);
    }
  }
});

test("binyan gloss normalization catches reordered equivalent meanings", () => {
  const binyanBoard = loadBinyanBoard("en");

  assert.equal(
    binyanBoard.getBinyanGlossMeaningKey("was moved, was excited"),
    binyanBoard.getBinyanGlossMeaningKey("was excited, was moved")
  );
  assert.equal(
    binyanBoard.areBinyanGlossesConfusinglySimilar("was moved, was excited", "was excited, was moved"),
    true
  );
  assert.equal(
    binyanBoard.areBinyanGlossesConfusinglySimilar("opened something", "became open, was opened"),
    false
  );
});

test("binyan root data avoids distractor-eligible sibling gloss collisions", () => {
  const binyanBoard = loadBinyanBoard("en");
  for (const root of verbGameData.ROOTS) {
    const eligibleForms = Object.entries(root.forms || {})
      .filter(([, form]) => form?.exists === true && form.distractor_eligible !== false);

    for (let i = 0; i < eligibleForms.length; i += 1) {
      for (let j = i + 1; j < eligibleForms.length; j += 1) {
        const [leftSlot, leftForm] = eligibleForms[i];
        const [rightSlot, rightForm] = eligibleForms[j];
        assert.equal(
          binyanBoard.areBinyanGlossesConfusinglySimilar(leftForm.gloss, rightForm.gloss),
          false,
          `${root.id}:${leftSlot}/${rightSlot} have confusingly similar glosses: ${leftForm.gloss} | ${rightForm.gloss}`
        );
      }
    }
  }
});

test("binyan generated questions never include semantically duplicate answer options", () => {
  const app = loadBinyanApp("en");
  const deck = buildTestBinyanDeckEntries();
  app.utils = {
    shuffle(items) {
      return [...items];
    },
  };
  app.runtime.state.binyanBoard = {
    currentQuestion: null,
    distractorPool: deck.distractorPool,
  };

  for (const rootEntry of deck.roots) {
    for (const form of rootEntry.forms) {
      const question = app.binyanBoard.buildBinyanBoardQuestion(form, rootEntry);
      const correct = question.options.find((option) => option.isCorrect);
      assert.ok(correct, `${form.formId} should have a correct option`);

      const seen = [];
      for (const option of question.options) {
        for (const prior of seen) {
          assert.equal(
            app.binyanBoard.areBinyanGlossesConfusinglySimilar(prior.text, option.text),
            false,
            `${form.formId} generated confusing options: ${prior.text} | ${option.text}`
          );
        }
        seen.push(option);

        if (option.isCorrect) continue;
        assert.equal(
          app.binyanBoard.areBinyanGlossesConfusinglySimilar(correct.text, option.text),
          false,
          `${form.formId} correct option conflicts with distractor: ${correct.text} | ${option.text}`
        );
      }
    }
  }
});

test("binyan teaching points are localized when present", () => {
  const app = loadBinyanApp("en");
  const teachingPoints = verbGameData.ROOTS
    .flatMap((root) => Object.values(root.forms || {}))
    .map((form) => form?.teaching_point || "")
    .filter(Boolean);

  assert.ok(teachingPoints.length > 0);
  for (const teachingPoint of teachingPoints) {
    assert.ok(app.binyanBoard.getBinyanFeedbackDetail({ teachingPoint }), teachingPoint);
  }

  app.runtime.state.language = "he";
  for (const teachingPoint of teachingPoints) {
    assert.ok(app.binyanBoard.getBinyanFeedbackDetail({ teachingPoint }), teachingPoint);
  }
});

test("binyan board sessions select exactly two roots per difficulty", () => {
  const app = loadBinyanApp("en");
  app.utils = {
    shuffle(items) {
      return [...items];
    },
  };

  const deck = app.binyanBoard.buildBinyanBoardDeck();
  assert.equal(deck.roots.length, 6);
  assert.deepEqual(
    JSON.parse(JSON.stringify(deck.roots.map((root) => root.difficulty))),
    ["easy", "easy", "medium", "medium", "hard", "hard"]
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(deck.roots.reduce((counts, root) => {
      counts[root.difficulty] = (counts[root.difficulty] || 0) + 1;
      return counts;
    }, {}))),
    { easy: 2, medium: 2, hard: 2 }
  );

  const selectedRootIds = new Set(deck.roots.map((root) => root.id));
  const selectedGlosses = new Set(
    verbGameData.ROOTS
      .filter((root) => selectedRootIds.has(root.id))
      .flatMap((root) => Object.values(root.forms || {}))
      .filter((form) => form?.exists === true && form.distractor_eligible !== false && form.gloss)
      .map((form) => form.gloss)
  );
  assert.ok(deck.distractorPool.length > 0);
  assert.ok(deck.distractorPool.every((gloss) => selectedGlosses.has(gloss)));
});

test("binyan function hints use slot-level labels without transliterations", () => {
  const binyanBoard = loadBinyanBoard("en");
  const expectedHintsBySlot = {
    paal: "Simple Active",
    nifal: "Simple Passive",
    piel: "Factitive Active",
    pual: "Factitive Passive",
    hifil: "Causative Active",
    hufal: "Causative Passive",
    hitpael: "Reflexive/Reciprocal",
  };
  const transliterationPattern = /Pa'?al|Nif'?al|Pi'?el|Pu'?al|Hif'?il|Huf'?al|Hitpa'?el/i;

  for (const [slot, expectedHint] of Object.entries(expectedHintsBySlot)) {
    const hint = binyanBoard.getBinyanFunctionHintText({ slot, func: "passive" });
    assert.equal(hint, expectedHint);
    assert.doesNotMatch(hint, transliterationPattern);
  }
});

test("binyan function hints do not compose fallback labels from functions", () => {
  const binyanBoard = loadBinyanBoard("en");
  assert.equal(binyanBoard.getBinyanFunctionHintText({ slot: "unknown", func: "resultative" }), "");
  assert.equal(binyanBoard.getBinyanFunctionHintText({ slot: "piel", func: "resultative" }), "Factitive Active");
});

test("binyan function hint button renders hidden and revealed states", () => {
  const app = loadBinyanApp("en");
  const button = new FakeElement();
  let cardStateUpdates = 0;
  app.runtime.el = { promptFunctionHint: button };
  app.ui = {
    updatePromptCardState() {
      cardStateUpdates += 1;
    },
  };

  const question = { slot: "nifal", func: "passive", functionHintRevealed: false };
  app.binyanBoard.renderBinyanFunctionHint(question);

  assert.equal(button.textContent, "Hint");
  assert.equal(button.classList.contains("hidden"), false);
  assert.equal(button.classList.contains("is-revealed"), false);
  assert.equal(button.getAttribute("aria-expanded"), "false");

  question.functionHintRevealed = true;
  app.binyanBoard.renderBinyanFunctionHint(question);

  assert.equal(button.textContent, "Simple Passive");
  assert.equal(button.classList.contains("is-revealed"), true);
  assert.equal(button.getAttribute("aria-expanded"), "true");
  assert.equal(cardStateUpdates, 2);
});

test("binyan feedback uses plain localized teaching notes", () => {
  const app = loadBinyanApp("en");
  const feedbackPayloads = [];
  app.runtime.helpers.setFeedback = (payload) => feedbackPayloads.push(payload);

  const question = {
    isCorrect: true,
    formVocalized: "קוֹמֵם",
    gloss: "raised up; incited, stirred up",
    teachingPoint: "Pi'el SLOT realized as polel (CoCeC) because the root is hollow.",
  };

  app.binyanBoard.renderBinyanBoardFeedback(question);
  assert.deepEqual(JSON.parse(JSON.stringify(feedbackPayloads.at(-1))), {
    tone: "success",
    sentence: "Correct: קוֹמֵם means raised up, incited, or stirred up.",
    detail: "This hollow root uses a special factitive active pattern here.",
  });

  app.runtime.state.language = "he";
  app.binyanBoard.renderBinyanBoardFeedback(question);
  assert.deepEqual(JSON.parse(JSON.stringify(feedbackPayloads.at(-1))), {
    tone: "success",
    sentence: "נכון: קוֹמֵם פירושו raised up, incited, or stirred up.",
    detail: "בשורש חלול כזה משתמשים כאן בתבנית פעילה מיוחדת.",
  });
});

test("binyan root meanings use centered-friendly separators", () => {
  const binyanBoard = loadBinyanBoard("en");
  assert.equal(
    binyanBoard.formatBinyanRootMeaning("rising / standing / establishing"),
    "rising, standing, establishing"
  );
  assert.equal(binyanBoard.formatBinyanRootMeaning("writing"), "writing");
});

test("opening a root shuffles binyan form drill order without dropping forms", () => {
  const app = loadBinyanApp("en");
  const rootForms = [
    { formId: "root:paal", slot: "paal", formVocalized: "a", gloss: "a", func: "simple", distractorEligible: true },
    { formId: "root:nifal", slot: "nifal", formVocalized: "b", gloss: "b", func: "passive", distractorEligible: true },
    { formId: "root:piel", slot: "piel", formVocalized: "c", gloss: "c", func: "intensive", distractorEligible: true },
  ];
  const shuffleCalls = [];
  app.utils = {
    shuffle(items) {
      shuffleCalls.push([...items]);
      return [...items].reverse();
    },
  };
  app.runtime.state.binyanBoard = {
    active: true,
    deck: [{ id: "root", forms: rootForms, cleared: false }],
    distractorPool: ["d", "e", "f"],
    activeRootId: "",
    roundForms: [],
    roundIndex: 0,
    currentQuestion: null,
  };
  app.runtime.helpers.clearFeedback = () => {};
  app.runtime.helpers.renderSessionHeader = () => {};
  app.binyanBoard.renderBinyanBoard = () => {};

  app.binyanBoard.openRoot("root");

  assert.deepEqual(
    shuffleCalls[0].map((form) => form.formId),
    ["root:paal", "root:nifal", "root:piel"]
  );
  assert.deepEqual(
    app.runtime.state.binyanBoard.roundForms.map((form) => form.formId),
    ["root:piel", "root:nifal", "root:paal"]
  );
  assert.deepEqual(
    app.runtime.state.binyanBoard.roundForms.map((form) => form.formId).sort(),
    rootForms.map((form) => form.formId).sort()
  );
});

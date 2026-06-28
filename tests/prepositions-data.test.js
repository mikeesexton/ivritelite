const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function runScriptInContext(scriptPath, context) {
  const source = fs.readFileSync(scriptPath, "utf8");
  vm.runInContext(source, context, { filename: scriptPath });
}

function loadPrepositionsContext() {
  const root = path.join(__dirname, "..");
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  // Deterministic identity shuffle so option order is stable in assertions.
  context.IvriQuestApp = { utils: { shuffle: (list) => list.slice() } };
  vm.createContext(context);

  runScriptInContext(path.join(root, "preposition-data.js"), context);
  runScriptInContext(path.join(root, "app", "prepositions.js"), context);

  return context;
}

const OBJECT_KEYS = ["1sg", "2ms", "2fs", "3ms", "3fs", "1pl", "2mp", "3mp"];

test("every preposition paradigm covers all object keys with plain and niqqud forms", () => {
  const ctx = loadPrepositionsContext();
  const inflections = ctx.PREPOSITION_INFLECTIONS;
  assert.ok(inflections && typeof inflections === "object");

  for (const [prep, paradigm] of Object.entries(inflections)) {
    const niqqudSeen = new Set();
    for (const key of OBJECT_KEYS) {
      const form = paradigm[key];
      assert.ok(form, `${prep}.${key} is missing`);
      assert.ok(form.plain && form.plain.trim(), `${prep}.${key} plain is empty`);
      assert.ok(form.niqqud && form.niqqud.trim(), `${prep}.${key} niqqud is empty`);
      assert.ok(!niqqudSeen.has(form.niqqud), `${prep} has duplicate niqqud ${form.niqqud}`);
      niqqudSeen.add(form.niqqud);
    }
  }
});

test("every trigger references a defined preposition paradigm and unique id", () => {
  const ctx = loadPrepositionsContext();
  const inflections = ctx.PREPOSITION_INFLECTIONS;
  const ids = new Set();
  for (const trigger of ctx.PREPOSITIONS) {
    assert.ok(trigger.id && !ids.has(trigger.id), `duplicate or missing id: ${trigger.id}`);
    ids.add(trigger.id);
    assert.ok(trigger.he && trigger.he.trim(), `${trigger.id} missing he`);
    assert.ok(/\{o\}/.test(trigger.en), `${trigger.id} en is missing the {o} slot`);
    assert.ok(inflections[trigger.prep], `${trigger.id} references unknown prep ${trigger.prep}`);
  }
});

test("buildPrepositionOptions yields four distinct options with one matching the table", () => {
  const ctx = loadPrepositionsContext();
  const prepositions = ctx.IvriQuestApp.prepositions;
  const inflections = ctx.PREPOSITION_INFLECTIONS;

  for (const prep of Object.keys(inflections)) {
    for (const objectKey of OBJECT_KEYS) {
      const built = prepositions.buildPrepositionOptions(prep, objectKey, (list) => list.slice());
      assert.ok(built, `no options for ${prep}/${objectKey}`);
      assert.equal(built.options.length, 4);

      const correct = built.options.filter((option) => option.isCorrect);
      assert.equal(correct.length, 1, `${prep}/${objectKey} must have exactly one correct option`);
      assert.equal(correct[0].textNiqqud, inflections[prep][objectKey].niqqud);

      const niqqudForms = built.options.map((option) => option.textNiqqud);
      assert.equal(new Set(niqqudForms).size, 4, `${prep}/${objectKey} has duplicate option forms`);
    }
  }
});

test("buildPrepositionsDeck builds answer strings from the trigger and inflected form", () => {
  const ctx = loadPrepositionsContext();
  const prepositions = ctx.IvriQuestApp.prepositions;
  const deck = prepositions.buildPrepositionsDeck();

  assert.ok(deck.length > 0);
  for (const question of deck) {
    assert.equal(question.options.length, 4);
    assert.ok(question.promptText.includes("____"));
    assert.ok(question.answerNiqqud.endsWith(question.correctAnswer));
    const correct = question.options.find((option) => option.isCorrect);
    assert.equal(correct.textNiqqud, question.correctAnswer);
  }
});

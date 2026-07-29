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
    assert.ok(question.answerNiqqud.includes(question.correctAnswer));
    if (question.triggerTail) {
      // A tailed trigger puts the blank mid-sentence, so the answer no longer
      // ends with the inflected form.
      assert.equal(question.answerNiqqud, `${question.triggerHe} ${question.correctAnswer} ${question.triggerTail}`);
      assert.equal(question.promptText, `${question.triggerHe} ____ ${question.triggerTail}`);
    } else {
      assert.ok(question.answerNiqqud.endsWith(question.correctAnswer));
      assert.equal(question.promptText, `${question.triggerHe} ____`);
    }
    const correct = question.options.find((option) => option.isCorrect);
    assert.equal(correct.textNiqqud, question.correctAnswer);
  }
});

// Regression: prep-fedup and prep-care used to bake the experiencer into the
// trigger ("נמאס לי") and rotate the מ־ source through all eight objects, which
// generated נמאס לי ממני and אכפת לי ממני. Those are not merely unlikely — a
// source that coreferences the dative experiencer takes the reflexive
// (נמאס לי מעצמי), so the pair taught an ungrammatical pattern. Any trigger that
// bakes in an inflected preposition can reintroduce the collision.
test("no trigger bakes in a pronoun that its own object rotation can coreference", () => {
  const ctx = loadPrepositionsContext();
  const inflections = ctx.PREPOSITION_INFLECTIONS;

  const personByForm = new Map();
  for (const table of Object.values(inflections)) {
    for (const [objectKey, form] of Object.entries(table)) {
      if (objectKey === "base") continue;
      personByForm.set(form.plain, objectKey);
    }
  }

  for (const trigger of ctx.PREPOSITIONS) {
    const frame = [trigger.he, trigger.tail].filter(Boolean).join(" ");
    for (const word of frame.split(/\s+/)) {
      const frozenPerson = personByForm.get(word);
      if (!frozenPerson) continue;
      assert.equal(
        OBJECT_KEYS.includes(frozenPerson),
        false,
        `${trigger.id} freezes "${word}" (${frozenPerson}) in its frame while also generating ${frozenPerson} as an object, so "${frame} ${inflections[trigger.prep][frozenPerson].plain}" would coreference itself`
      );
    }
  }
});

test("the dative-experiencer expressions drill the ל־ experiencer, not the מ־ source", () => {
  const ctx = loadPrepositionsContext();
  const byId = new Map(ctx.PREPOSITIONS.map((trigger) => [trigger.id, trigger]));

  for (const id of ["prep-fedup", "prep-care"]) {
    const trigger = byId.get(id);
    assert.ok(trigger, `missing ${id}`);
    assert.equal(trigger.prep, "le", `${id} should inflect the dative`);
    assert.ok(trigger.tail, `${id} needs a fixed source phrase after the blank`);
    assert.match(trigger.tail, /^מ/, `${id} tail should carry the מ־ source`);
    assert.doesNotMatch(trigger.he, /\s/, `${id} trigger should no longer bake in a pronoun`);
  }

  const deck = ctx.IvriQuestApp.prepositions.buildPrepositionsDeck();
  const fedUp = deck.filter((question) => question.triggerId === "prep-fedup");
  assert.equal(fedUp.length, OBJECT_KEYS.length);
  assert.deepEqual(
    fedUp.map((question) => question.answerPlain).sort(),
    [
      "נמאס לה מהעבודה", "נמאס להם מהעבודה", "נמאס לו מהעבודה", "נמאס לי מהעבודה",
      "נמאס לך מהעבודה", "נמאס לך מהעבודה", "נמאס לכם מהעבודה", "נמאס לנו מהעבודה",
    ].sort()
  );
  assert.equal(deck.some((question) => /ממני/.test(question.answerPlain) && /נמאס|אכפת/.test(question.triggerHe)), false);
});

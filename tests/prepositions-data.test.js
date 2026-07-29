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

// The frozen-frame loader above deliberately omits hebrew-verbs.js. This one adds
// it, so the same module builds conjugated frames — the two loaders together pin
// both halves of the paradigm join, including its graceful degradation.
function loadConjugatedPrepositionsContext() {
  const root = path.join(__dirname, "..");
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  context.IvriQuestApp = { utils: { shuffle: (list) => list.slice() } };
  vm.createContext(context);

  runScriptInContext(path.join(root, "hebrew-verbs.js"), context);
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
  for (const object of ctx.PREPOSITION_OBJECTS) {
    assert.ok(object.en && object.en.trim(), `${object.key} missing English object label`);
    assert.ok(object.poss && object.poss.trim(), `${object.key} missing English possessive label`);
  }
  for (const trigger of ctx.PREPOSITIONS) {
    assert.ok(trigger.id && !ids.has(trigger.id), `duplicate or missing id: ${trigger.id}`);
    ids.add(trigger.id);
    assert.ok(trigger.he && trigger.he.trim(), `${trigger.id} missing he`);
    assert.ok(/\{[op]\}/.test(trigger.en), `${trigger.id} en is missing an object slot`);
    assert.ok(inflections[trigger.prep], `${trigger.id} references unknown prep ${trigger.prep}`);
  }
});

test("generated English hints resolve object and possessive slots naturally", () => {
  const ctx = loadPrepositionsContext();
  const prepositions = ctx.IvriQuestApp.prepositions;
  const deck = prepositions.buildPrepositionsDeck();

  for (const question of deck) {
    assert.doesNotMatch(question.englishHint, /\{[op]\}/, `${question.triggerId} left a placeholder`);
    assert.doesNotMatch(
      question.englishHint,
      /\b(?:me|you|him|her|us|them)['’]s\b/i,
      `${question.triggerId} generated an object-pronoun possessive`
    );
  }

  const hint = (triggerId, objectKey) => deck.find(
    (question) => question.triggerId === triggerId && question.objectKey === objectKey
  )?.englishHint;

  assert.equal(hint("prep-visitat", "1sg"), "to visit me at home");
  assert.equal(hint("prep-visitat", "3mp"), "to visit them at home");
  assert.equal(hint("prep-sleepover", "1sg"), "to sleep over at my place");
  assert.equal(hint("prep-sleepover", "3ms"), "to sleep over at his place");
  assert.equal(hint("prep-sleepover", "2fs"), "to sleep over at your (f.sg.) place");
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
    Array.from(fedUp, (question) => question.answerPlain).sort(),
    [
      "נמאס לה מהעבודה", "נמאס להם מהעבודה", "נמאס לו מהעבודה", "נמאס לי מהעבודה",
      "נמאס לך מהעבודה", "נמאס לך מהעבודה", "נמאס לכם מהעבודה", "נמאס לנו מהעבודה",
    ].sort()
  );
  assert.equal(deck.some((question) => /ממני/.test(question.answerPlain) && /נמאס|אכפת/.test(question.triggerHe)), false);
});

// --- Conjugated governance frames -------------------------------------------
// Governed prepositions used to be drilled only against a frozen present-tense
// verb ("מחכה ____"), because preposition-data.js and hebrew-verbs.js were never
// joined. PREPOSITION_VERB_LINKS joins them, so the same governance is now drilled
// across tense and person. Governance itself does not change — לחכות takes ל־ in
// every form — so these tests guard the join, not the answer.

test("every verb link points at a real trigger and a paradigm holding every drilled form", () => {
  const ctx = loadConjugatedPrepositionsContext();
  const links = ctx.PREPOSITION_VERB_LINKS;
  const formSpecs = ctx.PREPOSITION_VERB_FORMS;
  const deck = ctx.IvriQuestHebrewVerbs.buildVerbConjugationDeck();
  const triggersById = new Map(ctx.PREPOSITIONS.map((trigger) => [trigger.id, trigger]));

  const sensesByEntryId = new Map();
  for (const entry of deck) {
    const entryId = String(entry.id || "").replace(/--sense-\d+$/, "");
    if (!sensesByEntryId.has(entryId)) sensesByEntryId.set(entryId, []);
    sensesByEntryId.get(entryId).push(entry);
  }

  assert.ok(Object.keys(links).length > 0);
  for (const [triggerId, link] of Object.entries(links)) {
    const trigger = triggersById.get(triggerId);
    assert.ok(trigger, `${triggerId} is linked but is not a trigger in PREPOSITIONS`);
    assert.equal(trigger.type, "verb", `${triggerId} is linked but is not a verb trigger`);
    assert.match(trigger.en, /^to\s/, `${triggerId} gloss must start with "to " so base/future can derive from it`);

    const senses = sensesByEntryId.get(link.entryId);
    assert.ok(senses?.length, `${triggerId} links to unknown verb entry ${link.entryId}`);

    for (const formSpec of formSpecs) {
      // Every sense must agree, because the join takes whichever sense comes
      // first: a multi-sense verb is split per sense but shares one conjugation.
      const values = new Set(
        senses.map((sense) => (sense.forms || []).find((form) => form.id === formSpec.formId)?.valuePlain || "")
      );
      assert.ok(!values.has(""), `${link.entryId} lacks ${formSpec.formId}, needed by ${triggerId}`);
      assert.equal(values.size, 1, `${link.entryId} senses disagree on ${formSpec.formId}: ${[...values].join(" / ")}`);
    }

    // The link must be to the verb the trigger actually shows, or the game would
    // conjugate a different verb than the one the learner was reading.
    const presentMs = (senses[0].forms || []).find((form) => form.id === "present_masculine_singular");
    assert.equal(
      presentMs.valuePlain,
      trigger.he,
      `${triggerId} shows ${trigger.he} but ${link.entryId} conjugates ${presentMs.valuePlain}`
    );
  }
});

test("subjectCoreferencesObject blocks reference clashes and allows disjoint third person", () => {
  const prepositions = loadConjugatedPrepositionsContext().IvriQuestApp.prepositions;
  const clashes = prepositions.subjectCoreferencesObject;

  // Identical person: Hebrew wants the reflexive (חיכיתי לעצמי, not חיכיתי לי).
  assert.equal(clashes("1sg", "1sg"), true);
  assert.equal(clashes("3ms", "3ms"), true);
  // First and second person clash across number too — the singular sits inside
  // the plural, so "we waited for me" is incoherent in any context.
  assert.equal(clashes("1sg", "1pl"), true);
  assert.equal(clashes("1pl", "1sg"), true);
  assert.equal(clashes("2ms", "2mp"), true);
  // Third person across number is ordinary disjoint reference.
  assert.equal(clashes("3ms", "3mp"), false);
  assert.equal(clashes("3mp", "3ms"), false);
  assert.equal(clashes("3ms", "3fs"), false);
  // Different persons never clash, and a frozen frame has no subject at all.
  assert.equal(clashes("1sg", "3ms"), false);
  assert.equal(clashes("", "1sg"), false);
});

test("no conjugated item pairs a subject with an object it would have to coreference", () => {
  const ctx = loadConjugatedPrepositionsContext();
  const prepositions = ctx.IvriQuestApp.prepositions;
  const deck = prepositions.buildPrepositionsDeck();
  const subjectByHebrew = new Map();

  for (const [triggerId, link] of Object.entries(ctx.PREPOSITION_VERB_LINKS)) {
    const trigger = ctx.PREPOSITIONS.find((entry) => entry.id === triggerId);
    for (const frame of prepositions.buildTriggerFrames(trigger)) {
      subjectByHebrew.set(`${triggerId}:${frame.he}`, frame.subject);
    }
    assert.ok(link.entryId);
  }

  for (const question of deck) {
    const subject = subjectByHebrew.get(`${question.triggerId}:${question.triggerHe}`);
    if (!subject) continue;
    assert.equal(
      prepositions.subjectCoreferencesObject(subject, question.objectKey),
      false,
      `${question.triggerId} generated "${question.englishHint}" (${subject} subject, ${question.objectKey} object)`
    );
  }

  // Same guarantee stated over the rendered English, which is what a learner
  // actually sees, and which no amount of key bookkeeping can fake.
  const incoherent = deck.filter((question) => (
    /^I\b.*\b(?:me|us)\b/.test(question.englishHint)
    || /^we\b.*\b(?:me|us)\b/.test(question.englishHint)
    || /^he\b.*\bhim\b/.test(question.englishHint)
    || /^she\b.*\bher\b(?! place)/.test(question.englishHint)
    || /^they\b.*\bthem\b/.test(question.englishHint)
  ));
  assert.deepEqual(incoherent.map((question) => question.englishHint), []);
});

test("conjugated frames carry Hebrew and English that agree on subject and tense", () => {
  const ctx = loadConjugatedPrepositionsContext();
  const prepositions = ctx.IvriQuestApp.prepositions;
  const deck = prepositions.buildPrepositionsDeck();

  const item = (triggerId, hebrew, objectKey) => deck.find((question) => (
    question.triggerId === triggerId && question.triggerHe === hebrew && question.objectKey === objectKey
  ));

  // Present keeps the form the game used to be frozen at; past and future are new.
  assert.equal(item("prep-wait", "מחכה", "1sg").englishHint, "he waits for me");
  assert.equal(item("prep-wait", "מחכים", "1sg").englishHint, "they wait for me");
  assert.equal(item("prep-wait", "חיכיתי", "2ms").englishHint, "I waited for you (m.sg.)");
  assert.equal(item("prep-wait", "חיכתה", "1sg").englishHint, "she waited for me");
  assert.equal(item("prep-wait", "נחכה", "2ms").englishHint, "we will wait for you (m.sg.)");
  // The prompt and answer are built from the conjugated form, not the frozen one.
  assert.equal(item("prep-wait", "חיכיתי", "2ms").promptText, "חיכיתי ____");
  assert.equal(item("prep-wait", "חיכיתי", "2ms").answerNiqqud, "חיכיתי לְךָ");
  assert.ok(item("prep-wait", "חיכיתי", "2ms").triggerHeNiqqud);

  // Irregular English past is authored, not derived by suffixing "ed".
  assert.equal(item("prep-dateout", "יצאתי", "2ms").englishHint, "I went out with you (m.sg.)");
  assert.equal(item("prep-know", "הכרתי", "3ms").englishHint, "I knew him");
  assert.equal(item("prep-studyunder", "לומדת", "1sg").englishHint, "she studies under me");
  // Possessive slots keep resolving once a subject is prefixed.
  assert.equal(item("prep-sleepover", "ישנתי", "3ms").englishHint, "I slept over at his place");

  // A verb whose present masculine and feminine singular are spelled alike
  // contributes that form once, since both items would share prompt and answer.
  const waitFrames = prepositions.buildTriggerFrames(ctx.PREPOSITIONS.find((t) => t.id === "prep-wait"));
  const hebrewForms = waitFrames.map((frame) => frame.he);
  assert.equal(new Set(hebrewForms).size, hebrewForms.length, "frames must be deduped by Hebrew surface");
  assert.equal(hebrewForms.filter((form) => form === "מחכה").length, 1);
});

test("triggers without a paradigm link keep their frozen infinitive frame", () => {
  const ctx = loadConjugatedPrepositionsContext();
  const prepositions = ctx.IvriQuestApp.prepositions;
  const deck = prepositions.buildPrepositionsDeck();
  const linkedIds = new Set(Object.keys(ctx.PREPOSITION_VERB_LINKS));

  for (const trigger of ctx.PREPOSITIONS) {
    if (linkedIds.has(trigger.id)) continue;
    const items = deck.filter((question) => question.triggerId === trigger.id);
    if (!items.length) continue;
    assert.equal(items.length, OBJECT_KEYS.length, `${trigger.id} should stay at one frame per object`);
    for (const question of items) {
      assert.equal(question.triggerHe, trigger.he);
      assert.equal(question.triggerHeNiqqud, "");
    }
  }

  const chase = deck.filter((question) => question.triggerId === "prep-chase");
  assert.equal(chase.length, 8);
  assert.ok(chase.every((question) => question.englishHint.startsWith("to chase after ")));
});

test("the deck falls back to frozen frames when the verb paradigms are unavailable", () => {
  // hebrew-verbs.js loads before preposition-data.js in index.html, but the join
  // must not be load-order-critical: without it every trigger keeps one frame.
  const ctx = loadPrepositionsContext();
  const deck = ctx.IvriQuestApp.prepositions.buildPrepositionsDeck();

  assert.equal(deck.length, ctx.PREPOSITIONS.length * OBJECT_KEYS.length);
  for (const question of deck) {
    assert.equal(question.triggerHeNiqqud, "");
  }
  assert.equal(
    deck.find((question) => question.triggerId === "prep-wait" && question.objectKey === "1sg").englishHint,
    "to wait for me"
  );
});

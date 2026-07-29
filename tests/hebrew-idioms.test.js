const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function runScriptInContext(scriptPath, context) {
  const source = fs.readFileSync(scriptPath, "utf8");
  vm.runInContext(source, context, { filename: scriptPath });
}

test("hebrew idioms data is exposed on globalThis for browser consumers", () => {
  const idiomsPath = path.join(__dirname, "..", "hebrew-idioms.js");
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  runScriptInContext(idiomsPath, context);

  assert.ok(Array.isArray(context.HEBREW_IDIOMS));
  assert.ok(context.HEBREW_IDIOMS.length > 0);
});

test("advanced conjugation builds a non-empty deck with the real idiom source file", () => {
  const root = path.join(__dirname, "..");
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  runScriptInContext(path.join(root, "app", "constants.js"), context);
  runScriptInContext(path.join(root, "app", "utils.js"), context);
  runScriptInContext(path.join(root, "hebrew-idioms.js"), context);
  runScriptInContext(path.join(root, "app", "adv-conj.js"), context);

  context.IvriQuestApp.runtime = {
    constants: context.IvriQuestApp.constants,
    helpers: {},
  };

  const deck = context.IvriQuestApp.advConj.buildAdvConjDeck();
  assert.ok(deck.length > 0);
});

function loadIdioms() {
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  runScriptInContext(path.join(__dirname, "..", "hebrew-idioms.js"), context);
  return context.HEBREW_IDIOMS;
}

// The object keys advConj actually rotates through. A possessive_suffix idiom
// missing any of them loses that object silently in buildAdvConjDeck.
const ADV_CONJ_OBJECT_KEYS = ["1sg", "2msg", "3msg", "3fsg", "1pl", "2mpl", "3mpl"];
const SUBJECT_FORMS = ["msg", "fsg", "mpl", "fpl"];
const OBJECT_TYPES = new Set(["direct", "l_dative", "possessive_suffix"]);
// Every other data file in the repo spells this binyan `paal`. The idiom file
// used to mix in `qal`, which would split any grouping by binyan.
const BINYANIM = new Set(["paal", "piel", "hifil", "nifal", "hitpael", "pual", "hufal"]);

test("every idiom carries the fields advConj needs to build an item", () => {
  const idioms = loadIdioms();

  assert.equal(idioms.length, 100);
  assert.equal(new Set(idioms.map((entry) => entry.id)).size, idioms.length);

  idioms.forEach((idiom) => {
    const where = `idiom ${idiom.id}`;

    // buildAdvConjDeck skips the whole idiom without literal_sg, and
    // buildAdvConjEnglishSentence returns "" for whichever tense template is
    // missing — so a gap here silently shrinks the deck instead of failing.
    ["literal_sg", "literal_pl", "literal_past", "literal_future"].forEach((key) => {
      assert.ok(String(idiom[key] || "").trim(), `${where} needs ${key}`);
      assert.match(idiom[key], /\{s\}/, `${where} ${key} needs a {s} placeholder`);
    });

    assert.ok(OBJECT_TYPES.has(idiom.object_type), `${where} has object_type ${idiom.object_type}`);
    assert.ok(BINYANIM.has(idiom.binyan), `${where} has binyan ${idiom.binyan}`);

    ["present", "past", "future"].forEach((tense) => {
      const forms = idiom.conjugations[tense];
      assert.ok(forms, `${where} needs a ${tense} table`);
      SUBJECT_FORMS.forEach((form) => {
        assert.ok(String(forms[form] || "").trim(), `${where} needs ${tense}.${form}`);
      });
    });

    if (idiom.object_type === "l_dative") {
      // buildAdvConjHebrewAnswer interpolates this straight into the answer, so
      // a missing fixed_object renders the string "undefined" to the learner.
      assert.ok(String(idiom.fixed_object || "").trim(), `${where} needs a fixed_object`);
    }

    if (idiom.object_type === "possessive_suffix") {
      ADV_CONJ_OBJECT_KEYS.forEach((key) => {
        assert.ok(
          String(idiom.suffix_forms?.[key] || "").trim(),
          `${where} needs suffix_forms.${key}`,
        );
      });
    }
  });
});

test("the idiom pool stays deep enough that a ten-round session does not exhaust it", () => {
  const idioms = loadIdioms();

  // advConj weights by idiom, not by item, so a session touches at most
  // ADV_CONJ_ROUNDS distinct expressions. At 39 idioms the whole pool was seen
  // in about four sessions; this floor keeps that regression visible.
  assert.ok(idioms.length >= 100, `only ${idioms.length} idioms`);

  const byType = idioms.reduce((acc, idiom) => {
    acc[idiom.object_type] = (acc[idiom.object_type] || 0) + 1;
    return acc;
  }, {});
  // No frame should dominate so hard that the drill teaches one shape.
  Object.entries(byType).forEach(([type, count]) => {
    assert.ok(count >= 10, `only ${count} ${type} idioms`);
  });
  assert.ok(byType.l_dative <= idioms.length * 0.6, "l_dative should not dominate the pool");

  // The ladder reached level 3 and stopped; level 4 is the advanced tier.
  assert.ok(idioms.some((idiom) => idiom.level === 4), "no level-4 idioms");
});

test("the literal translation for לדרוך על היבלות uses blisters", () => {
  const idiomsPath = path.join(__dirname, "..", "hebrew-idioms.js");
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  runScriptInContext(idiomsPath, context);

  const idiom = context.HEBREW_IDIOMS.find((entry) => entry.id === "drichat_yabalot");
  assert.ok(idiom);
  assert.equal(idiom.literal_sg, "{s} steps on {p} blisters");
  assert.equal(idiom.literal_pl, "{s} step on {p} blisters");
  assert.equal(idiom.literal_past, "{s} stepped on {p} blisters");
  assert.equal(idiom.literal_future, "{s} will step on {p} blisters");
});

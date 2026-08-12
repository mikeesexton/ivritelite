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

  runScriptInContext(path.join(root, "preposition-data.js"), context);
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
const ADV_CONJ_OBJECT_KEYS = ["1sg", "2msg", "2fsg", "3msg", "3fsg", "1pl", "2mpl", "2fpl", "3mpl", "3fpl"];
const SUBJECT_FORMS = ["msg", "fsg", "mpl", "fpl"];
const OBJECT_TYPES = new Set(["direct", "l_dative", "possessive_suffix"]);
// Every other data file in the repo spells this binyan `paal`. The idiom file
// used to mix in `qal`, which would split any grouping by binyan.
const BINYANIM = new Set(["paal", "piel", "hifil", "nifal", "hitpael", "pual", "hufal"]);
const NIQQUD_PATTERN = /[\u0591-\u05C7]/;
// The original pilot, pointed against external dictionary entries. Every other
// idiom derives its pointing from an approved hebrew-verbs paradigm instead and
// cites it as `internal:hebrew-verbs#<seedId>` \u2014 provenance a test can actually
// resolve, which a URL never was.
const EXTERNAL_SOURCE_IDS = [
  "asiyat_yom",
  "hachzara_leatzmo",
  "hidlik",
  "ptihat_einayim",
  "sider",
];
const INTERNAL_SOURCE_PATTERN = /^internal:hebrew-verbs#(.+)$/;

function stripNiqqud(text) {
  return String(text || "").normalize("NFC").replace(/[\u0591-\u05C7]/g, "");
}

function consonantalSkeleton(text) {
  return stripNiqqud(text).replace(/[אהוי]/g, "");
}

test("every idiom carries the fields advConj needs to build an item", () => {
  const idioms = loadIdioms();

  assert.equal(idioms.length, 105);
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
  // in about four sessions; this floor keeps that regression visible. It was
  // relaxed to 75 when 23 literal verbs were migrated out and restored once the
  // pool was rebalanced — migrating a plain verb out is progress, but it should
  // be paid for with a real idiom, not with a lower bar.
  assert.ok(idioms.length >= 105, `only ${idioms.length} idioms`);

  const byType = idioms.reduce((acc, idiom) => {
    acc[idiom.object_type] = (acc[idiom.object_type] || 0) + 1;
    return acc;
  }, {});
  // No frame should dominate so hard that the drill teaches one shape.
  Object.entries(byType).forEach(([type, count]) => {
    assert.ok(count >= 10, `only ${count} ${type} idioms`);
  });
  // Every migration out of this file removes a `direct` entry, so the l_dative
  // share drifts up on its own. Keep the original 0.6 ceiling: the frame is
  // `<verb> ל<someone> <fixed phrase>` and a pool that is mostly one frame
  // teaches the frame rather than the expressions.
  assert.ok(byType.l_dative <= idioms.length * 0.6, "l_dative should not dominate the pool");
});

// `level` (1-4) was authored on every entry and read by nothing — advConj
// selects on per-idiom accuracy alone. The only thing referencing it was a test
// asserting a level-4 entry existed, which proved the data was there and never
// that anything consumed it, so the ladder cost an authoring judgement per
// idiom and silently drifted. Removed rather than wired in: adaptive weighting
// already models "hard for this learner", which is the better signal.
test("no idiom carries a difficulty level, which nothing reads", () => {
  // Spread out of the vm realm — arrays built there fail strict deepEqual
  // against a host [] on prototype identity alone.
  const withLevel = [...loadIdioms()].filter((idiom) => "level" in idiom);
  assert.deepEqual(withLevel.map((idiom) => idiom.id), []);
});

test("advanced conjugation pointing is explicit, complete, and sourced before runtime use", () => {
  const idioms = loadIdioms();
  const statusCounts = {};

  idioms.forEach((idiom) => {
    statusCounts[idiom.niqqud_status] = (statusCounts[idiom.niqqud_status] || 0) + 1;
    assert.ok(
      ["unreviewed", "reviewed"].includes(idiom.niqqud_status),
      `${idiom.id} has unsupported niqqud_status ${idiom.niqqud_status}`,
    );
    assert.ok(Array.isArray(idiom.niqqud_sources), `${idiom.id} needs niqqud_sources`);

    if (idiom.niqqud_status !== "reviewed") return;

    assert.ok(idiom.niqqud_sources.length > 0, `${idiom.id} reviewed pointing needs provenance`);
    idiom.niqqud_sources.forEach((source) => {
      assert.ok(
        /^https:\/\//.test(String(source)) || INTERNAL_SOURCE_PATTERN.test(String(source)),
        `${idiom.id} has invalid pointing source ${source}`,
      );
    });
    ["present", "past", "future"].forEach((tense) => {
      const forms = idiom.conjugations_niqqud?.[tense];
      assert.ok(forms, `${idiom.id} reviewed pointing needs ${tense} forms`);
      SUBJECT_FORMS.forEach((form) => {
        assert.match(String(forms?.[form] || ""), NIQQUD_PATTERN, `${idiom.id} needs pointed ${tense}.${form}`);
        assert.equal(
          consonantalSkeleton(forms?.[form]),
          consonantalSkeleton(idiom.conjugations[tense][form]),
          `${idiom.id} ${tense}.${form} pointing changes the consonantal skeleton`,
        );
      });
    });
    if (idiom.object_type === "l_dative") {
      assert.match(String(idiom.fixed_object_niqqud || ""), NIQQUD_PATTERN, `${idiom.id} needs pointed fixed_object`);
      assert.equal(
        consonantalSkeleton(idiom.fixed_object_niqqud),
        consonantalSkeleton(idiom.fixed_object),
        `${idiom.id} fixed_object pointing changes the consonantal skeleton`,
      );
    }
    if (idiom.object_type === "possessive_suffix") {
      assert.deepEqual(
        Object.keys(idiom.suffix_forms_niqqud).sort(),
        Object.keys(idiom.suffix_forms).sort(),
        `${idiom.id} needs every authored suffix form pointed`,
      );
      Object.keys(idiom.suffix_forms).forEach((key) => {
        assert.match(
          String(idiom.suffix_forms_niqqud?.[key] || ""),
          NIQQUD_PATTERN,
          `${idiom.id} needs pointed suffix_forms.${key}`,
        );
        assert.equal(
          consonantalSkeleton(idiom.suffix_forms_niqqud[key]),
          consonantalSkeleton(idiom.suffix_forms[key]),
          `${idiom.id} suffix_forms.${key} pointing changes the consonantal skeleton`,
        );
      });
    }
  });

  assert.deepEqual(statusCounts, { reviewed: 105 });
  assert.deepEqual(
    Array.from(idioms)
      .filter((idiom) => idiom.niqqud_sources.some((source) => /^https:\/\//.test(String(source))))
      .map((idiom) => idiom.id)
      .sort(),
    EXTERNAL_SOURCE_IDS,
  );
});

// A URL in a data file is a claim no test can check. A seed reference is one it
// can: resolve it and compare every pointed form against the approved paradigm.
test("every internally-sourced idiom matches the approved paradigm it cites", () => {
  const verbApi = require(path.join(__dirname, "..", "hebrew-verbs.js"));
  const seeds = new Map(verbApi.getSeedVerbEntries().map((entry) => [entry.id, entry]));
  const formSlots = {
    present: {
      msg: "masculine_singular",
      fsg: "feminine_singular",
      mpl: "masculine_plural",
      fpl: "feminine_plural",
    },
    past: {
      msg: "third_person_masculine_singular",
      fsg: "third_person_feminine_singular",
      mpl: "third_person_plural",
      fpl: "third_person_plural",
    },
    future: {
      msg: "third_person_masculine_singular",
      fsg: "third_person_feminine_singular",
      mpl: "third_person_plural",
      fpl: "third_person_plural",
    },
  };

  let checked = 0;
  loadIdioms().forEach((idiom) => {
    idiom.niqqud_sources.forEach((source) => {
      const match = INTERNAL_SOURCE_PATTERN.exec(String(source));
      if (!match) return;

      const seed = seeds.get(match[1]);
      assert.ok(seed, `${idiom.id} cites missing seed ${match[1]}`);
      assert.equal(seed.review_status, "approved", `${idiom.id} cites unapproved seed ${seed.id}`);
      assert.equal(seed.lemma, idiom.verb, `${idiom.id} cites seed for ${seed.lemma}, not ${idiom.verb}`);

      Object.entries(formSlots).forEach(([tense, slots]) => {
        Object.entries(slots).forEach(([idiomForm, seedForm]) => {
          assert.equal(
            idiom.conjugations_niqqud[tense][idiomForm],
            seed.forms[tense][seedForm].niqqud,
            `${idiom.id} ${tense}.${idiomForm} pointing drifted from ${seed.id}`,
          );
        });
      });
      checked += 1;
    });
  });

  assert.equal(checked, 100, `expected 100 internally-sourced idioms, checked ${checked}`);
});

test("the reviewed idiom pilot exactly matches approved internal verb paradigms", () => {
  const verbApi = require(path.join(__dirname, "..", "hebrew-verbs.js"));
  const seeds = new Map(verbApi.getSeedVerbEntries().map((entry) => [entry.id, entry]));
  const idioms = new Map(loadIdioms().map((entry) => [entry.id, entry]));
  const seedIds = {
    hidlik: "advanced-verb-lehadlik",
    sider: "advanced-verb-lesader",
    asiyat_yom: "common-verb-laasot",
    ptihat_einayim: "starter-verb-liftoach",
    hachzara_leatzmo: "advanced-verb-lehachzir",
  };
  const formSlots = {
    present: {
      msg: "masculine_singular",
      fsg: "feminine_singular",
      mpl: "masculine_plural",
      fpl: "feminine_plural",
    },
    past: {
      msg: "third_person_masculine_singular",
      fsg: "third_person_feminine_singular",
      mpl: "third_person_plural",
      fpl: "third_person_plural",
    },
    future: {
      msg: "third_person_masculine_singular",
      fsg: "third_person_feminine_singular",
      mpl: "third_person_plural",
      fpl: "third_person_plural",
    },
  };

  Object.entries(seedIds).forEach(([idiomId, seedId]) => {
    const idiom = idioms.get(idiomId);
    const seed = seeds.get(seedId);
    assert.ok(idiom, `missing reviewed idiom ${idiomId}`);
    assert.ok(seed, `missing approved verb seed ${seedId}`);
    assert.equal(seed.review_status, "approved", `${seedId} is no longer approved`);

    Object.entries(formSlots).forEach(([tense, slots]) => {
      Object.entries(slots).forEach(([idiomForm, seedForm]) => {
        assert.equal(
          idiom.conjugations[tense][idiomForm],
          seed.forms[tense][seedForm].plain,
          `${idiomId} ${tense}.${idiomForm} plain form drifted from ${seedId}`,
        );
        assert.equal(
          idiom.conjugations_niqqud[tense][idiomForm],
          seed.forms[tense][seedForm].niqqud,
          `${idiomId} ${tense}.${idiomForm} niqqud drifted from ${seedId}`,
        );
      });
    });
  });
});

test("advanced conjugation propagates only complete reviewed niqqud into prompts and choices", () => {
  const root = path.join(__dirname, "..");
  const deterministicMath = Object.create(Math);
  deterministicMath.random = () => 0;
  const context = { console, Math: deterministicMath };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  runScriptInContext(path.join(root, "preposition-data.js"), context);
  runScriptInContext(path.join(root, "app", "constants.js"), context);
  runScriptInContext(path.join(root, "app", "utils.js"), context);
  runScriptInContext(path.join(root, "app", "adv-conj.js"), context);
  context.IvriQuestApp.runtime = {
    constants: context.IvriQuestApp.constants,
    helpers: {},
  };

  const conjugations = {
    present: { msg: "כותב", fsg: "כותבת", mpl: "כותבים", fpl: "כותבות" },
    past: { msg: "כתב", fsg: "כתבה", mpl: "כתבו", fpl: "כתבו" },
    future: { msg: "יכתוב", fsg: "תכתוב", mpl: "יכתבו", fpl: "יכתבו" },
  };
  const conjugationsNiqqud = {
    present: { msg: "כּוֹתֵב", fsg: "כּוֹתֶבֶת", mpl: "כּוֹתְבִים", fpl: "כּוֹתְבוֹת" },
    past: { msg: "כָּתַב", fsg: "כָּתְבָה", mpl: "כָּתְבוּ", fpl: "כָּתְבוּ" },
    future: { msg: "יִכְתֹּב", fsg: "תִּכְתֹּב", mpl: "יִכְתְּבוּ", fpl: "יִכְתְּבוּ" },
  };
  context.HEBREW_IDIOMS = [{
    id: "pointed-fixture",
    object_type: "direct",
    negated: false,
    literal_sg: "{s} writes to {o}",
    literal_pl: "{s} write to {o}",
    literal_past: "{s} wrote to {o}",
    literal_future: "{s} will write to {o}",
    english: "to write",
    english_meaning: "to write",
    showMeaning: false,
    conjugations,
    conjugations_niqqud: conjugationsNiqqud,
    present_tense: conjugations.present,
    past_tense: conjugations.past,
    future_tense: conjugations.future,
    present_tense_niqqud: conjugationsNiqqud.present,
    past_tense_niqqud: conjugationsNiqqud.past,
    future_tense_niqqud: conjugationsNiqqud.future,
    niqqud_status: "reviewed",
    niqqud_sources: ["https://example.test/reviewed-paradigm"],
  }];

  // The builders take the subject entry now, because past and future read a
  // person-marked slot out of the linked verb paradigm rather than the idiom's
  // own gender/number table.
  const HE_SUBJECT = context.IvriQuestApp.constants.ADV_CONJ_SUBJECTS.find((s) => s.en === "he");
  const advConj = context.IvriQuestApp.advConj;
  assert.equal(
    advConj.buildAdvConjHebrewAnswerNiqqud(context.HEBREW_IDIOMS[0], HE_SUBJECT, "1sg", "present"),
    "כּוֹתֵב אוֹתִי",
  );

  const en2he = advConj.buildAdvConjDeck();
  assert.ok(en2he.length > 0);
  assert.ok(en2he.every((question) => question.direction === "en2he"));
  en2he.forEach((question) => {
    assert.match(question.correctAnswerNiqqud, NIQQUD_PATTERN);
    question.options.forEach((option) => assert.match(option.textNiqqud, NIQQUD_PATTERN));
  });

  deterministicMath.random = () => 0.9;
  const he2en = advConj.buildAdvConjDeck();
  assert.ok(he2en.length > 0);
  assert.ok(he2en.every((question) => question.direction === "he2en"));
  he2en.forEach((question) => assert.match(question.promptNiqqud, NIQQUD_PATTERN));

  context.HEBREW_IDIOMS[0].niqqud_status = "unreviewed";
  assert.equal(
    advConj.buildAdvConjHebrewAnswerNiqqud(context.HEBREW_IDIOMS[0], HE_SUBJECT, "1sg", "present"),
    "",
  );
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

// Past and future inflect for person; an idiom's own four-slot table does not,
// so first and second person in those tenses come from the verb's paradigm in
// hebrew-verbs.js, joined on `verb`. Unlinked idioms still build — they just
// stay third-person in past and future, the way the whole file used to.
//
// This is a real coverage gap, so it is measured rather than left implicit.
// Authoring a paradigm for any lemma below lights up every idiom using it; the
// floor should only ever be raised.
test("the idiom-to-paradigm join keeps its person coverage in past and future", () => {
  const verbApi = require("../hebrew-verbs.js");
  const idioms = loadIdioms();
  const lemmas = new Set(verbApi.getSeedVerbEntries().map((entry) => entry.lemma));

  const linked = idioms.filter((idiom) => lemmas.has(idiom.verb));
  assert.ok(
    linked.length >= 105,
    `only ${linked.length} of ${idioms.length} idioms reach first and second person in past/future`,
  );

  // Every idiom names a verb, so the join has something to match on even when
  // no paradigm exists yet.
  idioms.forEach((idiom) => {
    assert.ok(String(idiom.verb || "").trim(), `idiom ${idiom.id} needs a verb lemma`);
  });
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadVocabulary() {
  const sourcePath = path.join(__dirname, "..", "vocab-data.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  const context = {
    window: {},
    globalThis: {},
  };

  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });

  return context.IvriQuestVocab.getBaseVocabulary();
}

test("basic standalone vocabulary stays in the lexicon but is unavailable for translation quiz", () => {
  const vocabulary = loadVocabulary();
  const dictionaryOnlyHebrew = new Set(["סכין", "מקרר", "כיור", "רופא", "אחות", "בית חולים", "משרד", "פגישה", "פרויקט", "דרכון", "ויזה"]);
  const entriesByHebrew = new Map(vocabulary.map((word) => [word.he, word]));

  dictionaryOnlyHebrew.forEach((hebrew) => {
    const word = entriesByHebrew.get(hebrew);
    assert.ok(word, `expected lexicon entry for ${hebrew}`);
    assert.equal(word.availability?.translationQuiz, false, `expected ${hebrew} to stay out of translation quiz`);
    assert.equal(word.availability?.sentenceHints, true, `expected ${hebrew} to stay available for sentence hints`);
  });

  assert.equal(entriesByHebrew.get("מצקת")?.availability?.translationQuiz, true);
  assert.equal(entriesByHebrew.get("מצקת")?.availability?.sentenceHints, true);
});

test("conjugation-first cooking verbs stay out of translation quiz while לצנן stays in", () => {
  const vocabulary = loadVocabulary();
  const entriesByHebrew = new Map(vocabulary.map((word) => [word.he, word]));

  assert.equal(entriesByHebrew.get("לסנן")?.availability?.translationQuiz, false);
  assert.equal(entriesByHebrew.get("לקרר")?.availability?.translationQuiz, false);
  assert.equal(entriesByHebrew.get("לצנן")?.availability?.translationQuiz, true);
});

test("duplicate Hebrew glosses are collapsed into shared translations", () => {
  const vocabulary = loadVocabulary();
  const entriesByHebrew = new Map();

  vocabulary.forEach((word) => {
    const bucket = entriesByHebrew.get(word.he) || [];
    bucket.push(word.en);
    entriesByHebrew.set(word.he, bucket);
  });

  assert.deepEqual(entriesByHebrew.get("חובה"), ["obligation"]);
  assert.deepEqual(entriesByHebrew.get("לערבב"), ["to stir"]);
  assert.deepEqual(entriesByHebrew.get("להקציף"), ["to whip"]);
  assert.deepEqual(entriesByHebrew.get("לגרד"), ["to grate"]);
});

test("מוצאי שבת keeps its Saturday-night translation", () => {
  const vocabulary = loadVocabulary();
  const entry = vocabulary.find((word) => word.he === "מוצאי שבת");

  assert.ok(entry);
  assert.equal(entry.en, "Saturday night");
});

test("requested existential and event vocabulary is available for translation", () => {
  const vocabulary = loadVocabulary();
  const entriesByHebrew = new Map(vocabulary.map((word) => [word.he, word]));

  assert.equal(entriesByHebrew.get("טקס")?.en, "ceremony");
  assert.equal(entriesByHebrew.get("התקיים")?.en, "took place");
  assert.equal(entriesByHebrew.get("מלמטה למעלה")?.en, "bottom-up");
  assert.equal(entriesByHebrew.get("מלמעלה למטה")?.en, "top-down");
  assert.equal(entriesByHebrew.get("קיום")?.en, "existence");
  assert.equal(entriesByHebrew.get("קיומי")?.en, "existential");
  assert.equal(entriesByHebrew.get("קיימות")?.en, "sustainability");
});

test("logical and researcher vocabulary is available for translation", () => {
  const entriesByHebrew = new Map(loadVocabulary().map((word) => [word.he, word]));

  assert.equal(entriesByHebrew.get("הגיוני")?.en, "logical");
  assert.equal(entriesByHebrew.get("הגיוני")?.availability?.translationQuiz, true);
  assert.equal(entriesByHebrew.get("חוקר")?.en, "researcher");
  assert.equal(entriesByHebrew.get("חוקר")?.availability?.translationQuiz, true);
});

test("commitment uses the correct spelling and never adds the misspelled variant", () => {
  const vocabulary = loadVocabulary();
  const entriesByHebrew = new Map(vocabulary.map((word) => [word.he, word]));

  assert.equal(entriesByHebrew.get("מחויבות")?.en, "commitment");
  assert.equal(entriesByHebrew.has("מחוביות"), false);
});

test("Translation Match uses one primary English gloss per playable card", () => {
  const vocabulary = loadVocabulary();
  const playable = vocabulary.filter((word) => word.availability?.translationQuiz);

  assert.equal(playable.filter((word) => word.en.includes("/")).length, 0);

  const entriesByHebrew = new Map(vocabulary.map((word) => [word.he, word]));
  assert.equal(entriesByHebrew.get("הגיוני")?.id, "core_advanced-002-logical-reasonable");
  assert.equal(entriesByHebrew.get("התקיים")?.id, "core_advanced-019-took-place-was-held");
  assert.equal(entriesByHebrew.get("עדיין")?.id, "conversation_glue-025-still-yet");
  assert.equal(entriesByHebrew.get("חשבון")?.id, "groceries_food-070-bill-check");
});

function getPlannedExpansion(vocabulary) {
  const originalCategorySizes = new Map([
    ["core_advanced", 124],
    ["conversation_glue", 24],
    ["scientific_analytical", 17],
  ]);

  return vocabulary.filter((word) => {
    const originalSize = originalCategorySizes.get(word.category);
    if (!originalSize) return false;
    const idMatch = word.id.match(/^[a-z_]+-(\d{3})-/);
    return idMatch && Number(idMatch[1]) > originalSize;
  });
}

test("planned Translation Match expansion adds 144 append-only cards", () => {
  const vocabulary = loadVocabulary();
  const expansion = getPlannedExpansion(vocabulary);
  const countsByCategory = expansion.reduce((counts, word) => {
    counts[word.category] = (counts[word.category] || 0) + 1;
    return counts;
  }, {});

  assert.equal(vocabulary.length, 1354);
  assert.equal(vocabulary.filter((word) => word.availability?.translationQuiz).length, 1300);
  assert.equal(expansion.length, 144);
  assert.deepEqual(countsByCategory, {
    core_advanced: 36,
    conversation_glue: 72,
    scientific_analytical: 36,
  });
  assert.ok(expansion.every((word) => word.availability?.translationQuiz));

  const entriesByHebrew = new Map(vocabulary.map((word) => [word.he, word]));
  assert.equal(entriesByHebrew.get("רשע")?.id, "core_advanced-124-wicked-villain");
  assert.equal(entriesByHebrew.get("לדחות")?.id, "core_advanced-125-to-postpone");
  assert.equal(entriesByHebrew.get("קורע")?.id, "conversation_glue-024-hilarious-slang");
  assert.equal(entriesByHebrew.get("עדיין")?.id, "conversation_glue-025-still-yet");
  assert.equal(entriesByHebrew.get("דיוק")?.id, "scientific_analytical-017-accuracy");
  assert.equal(entriesByHebrew.get("ישיבה")?.id, "scientific_analytical-018-work-meeting");
});

test("planned Translation Match cards have niqqud and no gloss collisions", () => {
  const vocabulary = loadVocabulary();
  const expansion = getPlannedExpansion(vocabulary);
  const hebrewCounts = new Map();
  const englishCounts = new Map();

  vocabulary.forEach((word) => {
    hebrewCounts.set(word.he, (hebrewCounts.get(word.he) || 0) + 1);
    englishCounts.set(word.en, (englishCounts.get(word.en) || 0) + 1);
  });

  expansion.forEach((word) => {
    assert.match(word.heNiqqud, /[\u05B0-\u05BC\u05C1\u05C2\u05C7]/, `expected niqqud for ${word.he}`);
    assert.equal(hebrewCounts.get(word.he), 1, `duplicate Hebrew card: ${word.he}`);
    assert.equal(englishCounts.get(word.en), 1, `duplicate English card: ${word.en}`);
  });
});

test("planned compound cards stay inside the narrow-mobile stress envelope", () => {
  const expansion = getPlannedExpansion(loadVocabulary());
  const longestEnglish = expansion.reduce((longest, word) => word.en.length > longest.en.length ? word : longest);
  const longestHebrew = expansion.reduce((longest, word) => word.he.length > longest.he.length ? word : longest);

  assert.ok(longestEnglish.en.length <= 20, `${longestEnglish.en} exceeds the English stress envelope`);
  assert.ok(longestHebrew.he.length <= 12, `${longestHebrew.he} exceeds the Hebrew stress envelope`);
});

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

test("requested incantation, dizziness, and genius vocabulary is available for translation", () => {
  const words = loadVocabulary();
  const byHebrew = new Map(words.map((word) => [word.he, word]));

  assert.equal(byHebrew.get("השבעה")?.en, "incantation");
  assert.equal(byHebrew.get("סחרחורת")?.en, "dizziness");
  assert.equal(byHebrew.get("גאון")?.en, "genius");
  ["השבעה", "סחרחורת", "גאון"].forEach((hebrew) => {
    assert.equal(byHebrew.get(hebrew)?.availability?.translationQuiz, true);
  });
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
  const plannedCategorySizes = new Map([
    ["core_advanced", 36],
    ["conversation_glue", 72],
    ["scientific_analytical", 36],
  ]);

  return vocabulary.filter((word) => {
    const originalSize = originalCategorySizes.get(word.category);
    if (!originalSize) return false;
    const idMatch = word.id.match(/^[a-z_]+-(\d{3})-/);
    return idMatch
      && Number(idMatch[1]) > originalSize
      && Number(idMatch[1]) <= originalSize + plannedCategorySizes.get(word.category);
  });
}

test("planned Translation Match expansion adds 144 append-only cards", () => {
  const vocabulary = loadVocabulary();
  const expansion = getPlannedExpansion(vocabulary);
  const countsByCategory = expansion.reduce((counts, word) => {
    counts[word.category] = (counts[word.category] || 0) + 1;
    return counts;
  }, {});

  assert.equal(vocabulary.length, 1693);
  assert.equal(vocabulary.filter((word) => word.availability?.translationQuiz).length, 1628);
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

test("politics and society tranche adds 150 safe, pointed, globally unique cards", () => {
  const vocabulary = loadVocabulary();
  const politics = vocabulary.filter((word) => word.category === "politics_society_expanded");
  // Bounded so the tranche stays pinned at its original 150 cards while the
  // category itself remains open to later appends.
  const tranche = politics.slice(18, 168);
  const expectedNumbers = Array.from({ length: 150 }, (_, index) => String(index + 19).padStart(3, "0"));
  const actualNumbers = Array.from(tranche, (word) => word.id.match(/^politics_society_expanded-(\d{3})-/)?.[1]);

  assert.equal(politics.length, 170);
  assert.equal(tranche.length, 150);
  assert.deepEqual(actualNumbers, expectedNumbers);
  assert.equal(tranche[0].id, "politics_society_expanded-019-memorial");
  assert.equal(tranche.at(-1).id, "politics_society_expanded-168-center-periphery-gap");

  const requiredTerms = new Map([
    ["אנדרטה", "memorial"],
    ["כיבוש", "occupation"],
    ["אלימות משטרתית", "police brutality"],
    ["אפליה", "discrimination"],
    ["התנקשות", "assassination"],
    ["רצח", "murder"],
    ["השמדה", "annihilation"],
    ["התנחלות", "settlement"],
    ["מתנחל", "settler"],
    ["אלימות מתנחלים", "settler violence"],
    ["דמוקרטיה", "democracy"],
    ["שלטון החוק", "rule of law"],
    ["ממשלה", "government"],
    ["ראש הממשלה", "prime minister"],
    ["שר", "minister"],
    ["מפלגה", "political party"],
    ["בחירות", "election"],
    ["הצבעה", "vote"],
    ["בוחר", "voter"],
    ["ימין", "right wing"],
    ["שמאל", "left wing"],
    ["מרכז פוליטי", "political center"],
    ["מצע", "political platform"],
    ["דעת קהל", "public opinion"],
    ["סקר דעת קהל", "opinion poll"],
    ["שחיתות", "corruption"],
    ["שוחד", "bribery"],
    ["שקיפות", "transparency"],
    ["הסתה", "incitement"],
    ["תעמולה", "propaganda"],
    ["משטרה", "police"],
    ["זכויות אדם", "human rights"],
    ["שוויון", "equality"],
    ["גזענות", "racism"],
    ["הומופוביה", "homophobia"],
    ["טרנספוביה", "transphobia"],
    ["הדרה", "exclusion"],
    ["העדפה מתקנת", "affirmative action"],
    ["פליט", "refugee"],
    ["חופש התנועה", "freedom of movement"],
    ["הרפורמה המשפטית", "judicial reform (supporters' term)"],
    ["הפיכה משטרית", "regime coup"],
    ["משבר יוקר המחיה", "cost-of-living crisis"],
    ["מעמד הביניים", "middle class"],
    ["שוויון בנטל", "equal sharing of the burden"],
    ["חוק הגיוס", "conscription law"],
    ["קליטת עלייה", "immigrant absorption"],
    ["הכרה בתארים מחו״ל", "foreign degree recognition"],
    ["קהילת הלהט״ב", "LGBT community"],
    ["נישואים אזרחיים", "civil marriage"],
    ["הבועה התל־אביבית", "Tel Aviv bubble"],
  ]);
  const trancheByHebrew = new Map(tranche.map((word) => [word.he, word]));

  requiredTerms.forEach((english, hebrew) => {
    assert.equal(trancheByHebrew.get(hebrew)?.en, english, `expected ${hebrew} to mean ${english}`);
  });
  assert.equal(trancheByHebrew.get("אנדרטה")?.heNiqqud, "אַנְדַּרְטָה");

  const englishCounts = new Map();
  const hebrewCounts = new Map();
  vocabulary.forEach((word) => {
    englishCounts.set(word.en, (englishCounts.get(word.en) || 0) + 1);
    hebrewCounts.set(word.he, (hebrewCounts.get(word.he) || 0) + 1);
  });

  const stripNiqqud = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
  const hasNiqqud = /[\u05B0-\u05BC\u05C1\u05C2\u05C7]/;

  tranche.forEach((word) => {
    assert.equal(englishCounts.get(word.en), 1, `duplicate English card: ${word.en}`);
    assert.equal(hebrewCounts.get(word.he), 1, `duplicate Hebrew card: ${word.he}`);
    assert.equal(word.en.includes("/"), false, `multi-gloss English card: ${word.en}`);
    assert.ok(word.en.length <= 40, `English card is too wide for the game: ${word.en}`);
    assert.ok(word.he.length <= 30, `Hebrew card is too wide for the game: ${word.he}`);
    assert.match(word.heNiqqud, hasNiqqud, `expected actual niqqud for ${word.he}`);
    assert.equal(stripNiqqud(word.heNiqqud), word.he, `plain/pointed mismatch for ${word.he}`);
    word.heNiqqud.split(/[\s־-]+/u).filter((token) => /[א-ת]/u.test(token)).forEach((token) => {
      assert.match(token, hasNiqqud, `expected each Hebrew form to be pointed in ${word.he}`);
    });

    assert.doesNotMatch(word.en.toLowerCase(), /massacre|genocide/);
    assert.doesNotMatch(word.he, /טבח|רצח עם/);
  });
});

test("Inbal and Inat receive complete, pointed thematic vocabulary tranches", () => {
  const vocabulary = loadVocabulary();
  const expected = new Map([
    ["religion_magic_spirituality", ["קערת השבעה", "קמיע", "עין הרע", "דיבוק", "חוזר בשאלה", "ארמית", "כתר", "מלכות", "תורת הקבלה", "תיקון עולם"]],
    ["literature_arts_cultural_history", ["ביקורת ספרות", "קריאה צמודה", "שיר מחאה", "זיכרון קולקטיבי", "תנועת הפועלים", "סאטירה"]],
  ]);
  const expectedCounts = new Map([
    ["religion_magic_spirituality", 138],
    ["literature_arts_cultural_history", 30],
  ]);

  expected.forEach((requiredHebrew, category) => {
    const tranche = vocabulary.filter((word) => word.category === category);
    assert.equal(tranche.length, expectedCounts.get(category), `${category} card count changed`);
    assert.ok(tranche.every((word) => word.availability?.translationQuiz), `${category} should be playable`);
    assert.ok(tranche.every((word) => /[\u05B0-\u05BC\u05C1\u05C2\u05C7]/.test(word.heNiqqud)), `${category} needs niqqud`);
    requiredHebrew.forEach((hebrew) => {
      assert.ok(tranche.some((word) => word.he === hebrew), `${category} is missing ${hebrew}`);
    });
  });

  const hebrewCounts = new Map();
  const englishCounts = new Map();
  vocabulary.forEach((word) => {
    hebrewCounts.set(word.he, (hebrewCounts.get(word.he) || 0) + 1);
    englishCounts.set(word.en, (englishCounts.get(word.en) || 0) + 1);
  });
  [...expected.keys()].flatMap((category) => vocabulary.filter((word) => word.category === category)).forEach((word) => {
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

test("the lexical-focus cards are playable, pointed, and free of gloss collisions", () => {
  const vocabulary = loadVocabulary();
  const expected = new Map([
    ["תחרותי", { en: "competitive", category: "work_business", id: "work_business-087-competitive" }],
    ["ספורים", { en: "just a handful", category: "core_advanced", id: "core_advanced-168-just-a-handful" }],
    ["בלי חרטות", { en: "no regrets", category: "conversation_glue", id: "conversation_glue-098-no-regrets" }],
  ]);

  const hebrewCounts = new Map();
  const englishCounts = new Map();
  vocabulary.forEach((word) => {
    hebrewCounts.set(word.he, (hebrewCounts.get(word.he) || 0) + 1);
    englishCounts.set(word.en, (englishCounts.get(word.en) || 0) + 1);
  });

  expected.forEach((meta, hebrew) => {
    const word = vocabulary.find((entry) => entry.he === hebrew);
    assert.ok(word, `missing card for ${hebrew}`);
    assert.equal(word.en, meta.en);
    assert.equal(word.category, meta.category);
    assert.equal(word.id, meta.id, `${hebrew} id must stay stable`);
    assert.equal(word.availability?.translationQuiz, true);
    assert.match(word.heNiqqud, /[ְ-ׇּׁׂ]/, `${hebrew} needs niqqud`);
    // The matching board grades by pair id, so a shared surface or gloss would
    // mark a correct answer wrong when both cards land on one board.
    assert.equal(hebrewCounts.get(word.he), 1, `duplicate Hebrew card: ${word.he}`);
    assert.equal(englishCounts.get(word.en), 1, `duplicate English card: ${word.en}`);
  });
});

test("the rumor card is playable, pointed, and unique", () => {
  const vocabulary = loadVocabulary();
  const word = vocabulary.find((entry) => entry.he === "שמועה");

  assert.ok(word, "missing card for שמועה");
  assert.equal(word.en, "rumor");
  assert.equal(word.category, "social_cultural");
  assert.equal(word.id, "social_cultural-020-rumor", "שמועה id must stay stable");
  assert.equal(word.heNiqqud, "שְׁמוּעָה");
  assert.equal(word.availability?.translationQuiz, true);
  assert.equal(vocabulary.filter((entry) => entry.he === word.he).length, 1);
  assert.equal(vocabulary.filter((entry) => entry.en === word.en).length, 1);
});

// A card whose heNiqqud is just a copy of its plain form renders unpointed with
// the nikud toggle on and gives the speech engine nothing to work with. 169
// cards were in that state; this keeps the debt from creeping back.
test("every vocabulary card carries real niqqud, apart from documented acronyms", () => {
  const vocabulary = loadVocabulary();
  const niqqudPattern = /[֑-ׇ]/;

  // An acronym has no vowels of its own, so pointing it would be wrong rather
  // than merely missing. Anything added here needs the same justification.
  const ACRONYM_EXCEPTIONS = new Set(["אג״ח"]);

  const unpointed = vocabulary.filter((word) => word.heNiqqud === word.he);
  const unexpected = unpointed.filter((word) => !ACRONYM_EXCEPTIONS.has(word.he));
  // Compared by length rather than deepEqual: loadVocabulary runs the source in
  // a vm context, so arrays derived from it carry that realm's Array prototype
  // and deepStrictEqual fails against a literal even when both are empty.
  assert.equal(
    unexpected.length,
    0,
    `these cards need real niqqud: ${unexpected.map((word) => `${word.id} (${word.he})`).join(", ")}`,
  );

  // Guard the other direction too: a heNiqqud that differs from he but carries
  // no niqqud mark would be a typo rather than a vocalization.
  vocabulary
    .filter((word) => word.heNiqqud !== word.he)
    .forEach((word) => {
      assert.match(word.heNiqqud, niqqudPattern, `${word.id} heNiqqud has no niqqud mark`);
    });

  // Every listed exception must still exist, so a stale entry cannot hide a gap.
  ACRONYM_EXCEPTIONS.forEach((he) => {
    assert.ok(
      vocabulary.some((word) => word.he === he && word.heNiqqud === word.he),
      `stale acronym exception: ${he}`,
    );
  });
});

// Two playable cards sharing BOTH Hebrew and English can be drawn onto the same
// Translation Match board, where the grader keys on pair id — so matching the
// first Hebrew to the second English is marked wrong although it is correct.
// Homographs with distinct glosses (אחריות, תור, הנחה) are fine and expected.
test("no two playable cards share both their Hebrew and their English", () => {
  const playable = loadVocabulary().filter((word) => word.availability?.translationQuiz);
  const seen = new Map();
  const collisions = [];

  playable.forEach((word) => {
    const key = `${word.he}\u0000${word.en}`;
    if (seen.has(key)) collisions.push(`${word.he} / ${word.en}: ${seen.get(key)} + ${word.id}`);
    else seen.set(key, word.id);
  });

  assert.equal(collisions.length, 0, `duplicate playable cards: ${collisions.join(" | ")}`);
});

// Vocabulary ids embed a positional index (`vocab-data.js` builds
// `${category}-${idx+1}-${slug}`), so a row inserted anywhere but the tail of
// its category renumbers every row below it and orphans the learner's Leitner
// box, accuracy history and mastered toggle for each one.
//
// The existing count assertions cannot see this: a head insertion changes no
// total. Commit 4e8dc9b parked verbs at the head of four categories and
// silently re-keyed 64 cards while every test stayed green. This baseline is
// the guard — it fails on deletion and on insert-position alike.
//
// Adding cards at a category tail is expected and safe; regenerate the fixture
// in the same commit that adds them, and confirm the diff is additions only.
test("vocabulary ids are append-only within each category", () => {
  const baseline = require("./fixtures/vocab-id-baseline.json");
  const current = new Set(loadVocabulary().map((word) => word.id));

  const missing = baseline.filter((id) => !current.has(id));
  assert.deepEqual(missing, [], `${missing.length} vocabulary ids changed or disappeared`);
});

// The deck the learner actually sees is `vocab-data.js` concatenated with
// `hebrew-verbs.js` seed vocabulary (`app.js` spreads both into
// `prepareVocabulary`, which is a `.map()` and dedupes nothing). Every
// uniqueness assertion above loads only `vocab-data.js`, so a verb present in
// both files reaches Translation Match twice with the same Hebrew and English.
// That is how commit 4e8dc9b shipped 25 duplicate cards with a green suite.
//
// KNOWN_MERGED_DUPLICATES predates that commit. These rows sit mid-category in
// `core_advanced`, so deleting them would renumber every id below and orphan
// learner progress — the very failure this file now guards. Retiring one means
// setting `translationQuiz: false` on its `vocab-data.js` row so the id
// survives; until then they are pinned, and the list must only ever shrink.
const KNOWN_MERGED_DUPLICATES = [
  "לאשר",
  "לבטל",
  "להבהיר",
  "להזכיר",
  "להמליץ",
  "להסכים",
  "להשפיע",
  "לוותר",
  "לעדכן",
  "לצרף",
];

test("the merged Translation Match pool has no new duplicate cards", () => {
  const verbApi = require("../hebrew-verbs.js");
  const merged = [...loadVocabulary(), ...verbApi.getSeedVocabularyEntries()]
    .filter((word) => word.availability?.translationQuiz);

  const seen = new Map();
  const collisions = [];
  merged.forEach((word) => {
    const key = `${word.he} ${word.en}`;
    if (seen.has(key)) {
      collisions.push({ he: word.he, detail: `${word.he} / ${word.en}: ${seen.get(key)} + ${word.id}` });
    } else {
      seen.set(key, word.id);
    }
  });

  const unexpected = collisions.filter((item) => !KNOWN_MERGED_DUPLICATES.includes(item.he));
  assert.deepEqual(unexpected.map((item) => item.detail), []);

  // Fails when a pinned duplicate is resolved, so the list cannot go stale.
  assert.deepEqual(
    collisions.map((item) => item.he).sort(),
    [...KNOWN_MERGED_DUPLICATES].sort(),
  );
});

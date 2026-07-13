const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadSentenceBankApi() {
  const sourcePath = path.join(__dirname, "..", "sentence-bank-data.js");
  const context = {
    console,
    globalThis: null,
    window: null,
  };
  context.globalThis = context;
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, "utf8"), context, { filename: sourcePath });
  return context.IvriQuestSentenceBank;
}

function sanitizeTokenList(list) {
  return Array.isArray(list)
    ? list.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
}

function isAttachableSentenceSuffix(text) {
  const trimmed = String(text || "").trim();
  return Boolean(trimmed) && /^[,.;:!?…)\]"'׳״-]+$/.test(trimmed);
}

function buildSentenceFrame(sentenceText, targetTokens) {
  const fullText = String(sentenceText || "");
  const tokens = sanitizeTokenList(targetTokens);
  const pieces = [];
  let cursor = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const tokenText = tokens[index];
    const tokenIndex = fullText.indexOf(tokenText, cursor);
    if (tokenIndex === -1) {
      return { failed: true, pieces: [], trailingText: "" };
    }
    const separatorText = fullText.slice(cursor, tokenIndex);
    const previousPiece = pieces[pieces.length - 1] || null;
    const shouldAttachSeparator = previousPiece && isAttachableSentenceSuffix(separatorText);
    pieces.push({
      beforeText: shouldAttachSeparator ? "" : separatorText,
      tokenText,
      afterText: "",
    });
    if (shouldAttachSeparator) {
      previousPiece.afterText = `${previousPiece.afterText || ""}${separatorText}`;
    }
    cursor = tokenIndex + tokenText.length;
  }

  let trailingText = fullText.slice(cursor);
  if (pieces.length && isAttachableSentenceSuffix(trailingText)) {
    pieces[pieces.length - 1].afterText = `${pieces[pieces.length - 1].afterText || ""}${trailingText}`;
    trailingText = "";
  }

  return {
    failed: false,
    pieces,
    trailingText,
  };
}

function getStaticEnglishWordChunks(entry) {
  const frame = buildSentenceFrame(entry.english, entry.english_tokens);
  if (frame.failed) {
    return [{ where: "unmatched", text: "__TOKEN_MISMATCH__" }];
  }
  const chunks = [];
  frame.pieces.forEach((piece, index) => {
    if (/[A-Za-z0-9]/.test(piece.beforeText)) {
      chunks.push({ where: `before:${index}`, text: piece.beforeText });
    }
    if (/[A-Za-z0-9]/.test(piece.afterText)) {
      chunks.push({ where: `after:${index}`, text: piece.afterText });
    }
  });
  if (/[A-Za-z0-9]/.test(frame.trailingText)) {
    chunks.push({ where: "trailing", text: frame.trailingText });
  }
  return chunks;
}

const NUANCE_GUARDRAILS = [
  {
    label: "כבר",
    matches(tokens) {
      return tokens.includes("כבר");
    },
    englishCue: /\b(already|right now)\b|on my way/i,
    noteCue: /\b(already|urgency)\b|on (my )?way/i,
  },
  {
    label: "נו",
    matches(tokens) {
      return tokens.includes("נו");
    },
    englishCue: /\b(well|come on)\b/i,
    noteCue: /\b(well|come on|impatient|impatience|so\?)\b/i,
  },
  {
    label: "סתם",
    matches(tokens) {
      return tokens.includes("סתם");
    },
    englishCue: /\bjust\b|for no reason/i,
    noteCue: /\bjust\b|for no reason|casual/i,
  },
  {
    label: "ממש",
    matches(tokens) {
      return tokens.includes("ממש");
    },
    englishCue: /\b(really|totally|very)\b/i,
    noteCue: /\b(really|totally|very)\b/i,
  },
  {
    label: "לגמרי",
    matches(tokens) {
      return tokens.includes("לגמרי");
    },
    englishCue: /\b(entirely|completely|totally)\b/i,
    noteCue: /\b(entirely|completely|totally)\b/i,
  },
  {
    label: "כרגע",
    matches(tokens) {
      return tokens.includes("כרגע");
    },
    englishCue: /\b(right now|currently|at the moment)\b/i,
    noteCue: /\b(right now|currently|at the moment)\b/i,
  },
  {
    label: "יוצא לדרך",
    matches(tokens) {
      return tokens.includes("יוצא") && tokens.includes("לדרך");
    },
    englishCue: /\b(on my way|heading out)\b/i,
    noteCue: /\b(on my way|heading out)\b/i,
  },
];

const ALIGNMENT_GUARDRAILS = [
  {
    label: "מכך",
    matches(tokens) {
      return tokens.includes("מכך");
    },
    englishCue: /\bfrom (this|that|it)\b/i,
    noteCue: /\bfrom (this|that|it)\b|מכך/i,
  },
  {
    label: "מכאן",
    matches(tokens) {
      return tokens.includes("מכאן");
    },
    englishCue: /\b(near here|from here|far from here)\b/i,
    noteCue: /\bfrom here\b|מכאן/i,
  },
  {
    label: "בהקדם",
    matches(tokens) {
      return tokens.includes("בהקדם");
    },
    englishCue: /\b(shortly|as soon as possible)\b/i,
    noteCue: /\b(shortly|as soon as possible)\b|בהקדם/i,
  },
  {
    label: "כשיהיו",
    matches(tokens) {
      return tokens.includes("כשיהיו");
    },
    englishCue: /\bwhen there (are|will be)\b/i,
    noteCue: /\bwhen there (are|will be)\b|כשיהיו/i,
  },
  {
    label: "בפועל",
    matches(tokens) {
      return tokens.includes("בפועל");
    },
    englishCue: /\bin practice\b/i,
    noteCue: /\bin practice\b|בפועל/i,
  },
  {
    label: "לעומק",
    matches(tokens) {
      return tokens.includes("לעומק");
    },
    englishCue: /\bin depth\b/i,
    noteCue: /\bin depth\b|לעומק/i,
  },
  {
    label: "מדובר",
    matches(tokens) {
      return tokens.includes("מדובר");
    },
    englishCue: /\bthis is\b|\bit concerns\b/i,
    noteCue: /\bthis is about\b|\bit concerns\b|מדובר/i,
  },
];

const EXPLICIT_HEBREW_IT_TOKEN_CUES = new Set([
  "את",
  "זה",
  "זאת",
  "אותו",
  "אותה",
  "אותם",
  "אותן",
  "הוא",
  "היא",
  "הם",
  "הן",
]);

function hasExplicitHebrewItCue(tokens) {
  return sanitizeTokenList(tokens).some((token) => {
    if (EXPLICIT_HEBREW_IT_TOKEN_CUES.has(token)) return true;
    return /^(?:[שובכלמ]?זה|[שובכלמ]?זאת)$/.test(token);
  });
}

const PHRASE_COMPACTED_ENTRY_IDS = [
  "colloquial_02",
  "colloquial_01",
  "colloquial_04",
  "colloquial_07",
  "colloquial_15",
  "colloquial_16",
  "colloquial_20",
  "everyday_04",
  "everyday_05",
  "everyday_06",
  "everyday_08",
  "everyday_09",
  "everyday_12",
  "everyday_14",
  "everyday_15",
  "everyday_16",
  "everyday_17",
  "everyday_18",
  "everyday_19",
  "professional_01",
  "professional_02",
  "professional_03",
  "professional_04",
  "professional_05",
  "professional_06",
  "professional_08",
  "formal_03",
  "formal_04",
  "formal_05",
  "formal_06",
  "formal_07",
  "formal_09",
  // Round-2 expansion (everyday_62+, colloquial_54+, professional_38+, formal_37+)
  ...Array.from({ length: 25 }, (_, i) => `everyday_${62 + i}`),
  ...Array.from({ length: 20 }, (_, i) => `colloquial_${54 + i}`),
  ...Array.from({ length: 14 }, (_, i) => `professional_${38 + i}`),
  ...Array.from({ length: 12 }, (_, i) => `formal_${37 + i}`),
  // Round-3 expansion (everyday_87+, colloquial_74+, professional_52+, formal_49+)
  ...Array.from({ length: 20 }, (_, i) => `everyday_${87 + i}`),
  ...Array.from({ length: 24 }, (_, i) => `colloquial_${74 + i}`),
  ...Array.from({ length: 14 }, (_, i) => `professional_${52 + i}`),
  ...Array.from({ length: 12 }, (_, i) => `formal_${49 + i}`),
  // Round-4 expansion (everyday_107+, colloquial_98+, professional_66+, formal_61+)
  ...Array.from({ length: 18 }, (_, i) => `everyday_${107 + i}`),
  ...Array.from({ length: 42 }, (_, i) => `colloquial_${98 + i}`),
  ...Array.from({ length: 7 }, (_, i) => `professional_${66 + i}`),
  ...Array.from({ length: 3 }, (_, i) => `formal_${61 + i}`),
];

const CHUNKING_AUDIT_ENTRIES = [
  {
    id: "formal_06",
    requiredTokens: ["The analysis", "is based on", "several assumptions", "may not be"],
    forbiddenTokens: ["The", "analysis", "is", "based", "on", "several", "assumptions", "may", "not", "be"],
  },
  {
    id: "professional_08",
    requiredTokens: ["Can we get", "on this matter", "It's not", "entirely clear"],
    forbiddenTokens: ["Can", "we", "get", "It's", "not", "entirely", "clear"],
  },
  {
    id: "colloquial_07",
    requiredTokens: ["Are you", "right now", "That sounds", "completely ridiculous", "to me"],
    forbiddenTokens: ["Are", "you", "right", "now", "That", "sounds", "completely", "ridiculous", "to", "me"],
  },
  {
    id: "colloquial_15",
    requiredTokens: ["at all"],
    forbiddenTokens: ["at", "all"],
  },
  {
    id: "everyday_09",
    requiredTokens: ["Can I get", "the bill"],
    forbiddenTokens: ["Can", "I", "get", "the", "bill"],
  },
  {
    id: "everyday_12",
    requiredTokens: ["How long", "does it take", "to get there", "by bus"],
    forbiddenTokens: ["How", "long", "does", "it", "take", "to", "get", "there", "by", "bus"],
  },
  {
    id: "colloquial_20",
    requiredTokens: ["hold on", "I'll get back", "to you", "in a sec"],
    forbiddenTokens: ["hold", "on", "I'll", "get", "back", "to", "you", "in", "a", "sec"],
  },
  {
    id: "everyday_04",
    requiredTokens: ["Do you have", "a pen", "I can", "use", "I need", "to write", "something"],
    forbiddenTokens: ["I can use", "I need to write", "Do", "you", "have"],
  },
  {
    id: "everyday_05",
    requiredTokens: ["We're", "meeting", "near", "the station", "don't", "be late"],
    forbiddenTokens: ["We're meeting", "near the station", "don't be late"],
  },
  {
    id: "everyday_14",
    requiredTokens: ["The train", "is delayed", "take a taxi"],
    forbiddenTokens: ["The", "train", "is", "delayed", "take", "a", "taxi"],
  },
  {
    id: "everyday_19",
    requiredTokens: ["Turn", "it", "down", "a bit", "I'm", "on the phone"],
    forbiddenTokens: ["Turn it down", "I'm on the phone"],
  },
  {
    id: "colloquial_01",
    requiredTokens: ["What's", "going on", "with you", "I haven't", "heard", "from you", "all", "day"],
    forbiddenTokens: ["What's going on", "I haven't heard", "all day"],
  },
  {
    id: "professional_03",
    requiredTokens: ["doesn't align", "with the defined requirements", "we'll need to", "update it"],
    forbiddenTokens: ["doesn't", "align", "with", "the", "defined", "requirements", "we'll", "need", "to", "update", "it"],
  },
  {
    id: "formal_05",
    requiredTokens: ["There is", "significant", "variation", "between", "the groups", "it must be", "explained"],
    forbiddenTokens: ["significant variation", "between the groups", "it must be explained"],
  },
  {
    id: "formal_07",
    requiredTokens: ["The different", "options", "should be", "examined", "in depth", "before", "choosing"],
    forbiddenTokens: ["The different options", "should be examined", "before choosing"],
  },
  {
    id: "formal_09",
    requiredTokens: ["This is", "a complex", "multi-dimensional", "phenomenon", "that is difficult", "to define", "simply"],
    forbiddenTokens: ["This", "is", "a", "complex", "that", "difficult", "to", "define"],
  },
];

function sentenceIdRange(prefix, start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => `${prefix}_${start + index}`);
}

const EXPANSION_ENTRY_IDS = [
  ...sentenceIdRange("everyday", 37, 61),
  ...sentenceIdRange("colloquial", 37, 53),
  ...sentenceIdRange("professional", 26, 37),
  ...sentenceIdRange("formal", 29, 36),
];

const ROUND2_ENTRY_IDS = [
  ...sentenceIdRange("everyday", 62, 86),
  ...sentenceIdRange("colloquial", 54, 73),
  ...sentenceIdRange("professional", 38, 51),
  ...sentenceIdRange("formal", 37, 48),
];

const ROUND3_ENTRY_IDS = [
  ...sentenceIdRange("everyday", 87, 106),
  ...sentenceIdRange("colloquial", 74, 97),
  ...sentenceIdRange("professional", 52, 65),
  ...sentenceIdRange("formal", 49, 60),
];

const ROUND4_ENTRY_IDS = [
  ...sentenceIdRange("everyday", 107, 124),
  ...sentenceIdRange("colloquial", 98, 139),
  ...sentenceIdRange("professional", 66, 72),
  ...sentenceIdRange("formal", 61, 63),
];

const EXPANSION_WORD_ORDER_ALTERNATE_IDS = [
  "everyday_39", "everyday_40", "everyday_43", "everyday_49", "everyday_52", "everyday_55",
  "everyday_57", "everyday_59", "everyday_60", "everyday_61", "colloquial_39", "colloquial_40",
  "colloquial_43", "colloquial_45", "colloquial_46", "colloquial_47", "colloquial_48", "colloquial_53",
  "professional_26", "professional_27", "professional_31", "professional_33", "professional_34",
  "professional_35", "professional_36", "professional_37", "formal_29", "formal_30", "formal_31", "formal_32",
];

const EXPANSION_GENDER_ALTERNATE_IDS = [
  "everyday_48",
  "everyday_50",
  "everyday_54",
  "everyday_58",
  "colloquial_37",
  "colloquial_38",
  "colloquial_41",
  "colloquial_42",
  "colloquial_48",
  "colloquial_49",
  "colloquial_50",
  "colloquial_52",
  "professional_27",
  "professional_29",
  // Round-3 expansion gender alternates
  "everyday_88",
  "everyday_89",
  "everyday_90",
  "everyday_92",
  "everyday_96",
  "colloquial_77",
  "colloquial_84",
  "colloquial_85",
  "colloquial_89",
  "colloquial_91",
  "colloquial_97",
  "professional_56",
  "everyday_106",
  // Round-4 expansion gender alternates
  "colloquial_106",
  "colloquial_114",
  "colloquial_115",
  "colloquial_117",
  "colloquial_122",
  "colloquial_124",
  "colloquial_127",
  "colloquial_131",
  "colloquial_137",
  "colloquial_138",
];

test("sentence bank data exposes 398 complete entries with notes, distractors, and tokens", () => {
  const api = loadSentenceBankApi();
  assert.ok(api);
  assert.equal(typeof api.getSentenceBank, "function");

  const entries = api.getSentenceBank();
  assert.equal(entries.length, 398);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 398);
  assert.equal(entries.filter((entry) => String(entry.notes || "").trim()).length, 398);

  entries.forEach((entry) => {
    assert.ok(entry.id);
    assert.ok(entry.category);
    assert.match(String(entry.english), /\S/);
    assert.match(String(entry.hebrew), /\S/);
    assert.ok(Array.isArray(entry.english_tokens));
    assert.ok(Array.isArray(entry.hebrew_tokens));
    assert.ok(Array.isArray(entry.english_distractors));
    assert.ok(Array.isArray(entry.hebrew_distractors));
    assert.ok(entry.english_tokens.length > 0);
    assert.ok(entry.hebrew_tokens.length > 0);
    assert.ok(entry.english_distractors.length > 0);
    assert.ok(entry.hebrew_distractors.length > 0);
    assert.ok([1, 2, 3].includes(entry.difficulty));
  });
});

test("sentence bank expansion adds the planned category and difficulty mix", () => {
  const entries = loadSentenceBankApi().getSentenceBank();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const categoryCounts = {};
  entries.forEach((entry) => {
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
  });

  assert.deepEqual(categoryCounts, {
    colloquial: 139,
    everyday: 124,
    professional: 72,
    formal: 63,
  });

  const expansion = EXPANSION_ENTRY_IDS.map((id) => byId.get(id));
  assert.equal(expansion.length, 62);
  assert.ok(expansion.every(Boolean));
  assert.deepEqual(
    expansion.reduce((counts, entry) => {
      counts[entry.difficulty] = (counts[entry.difficulty] || 0) + 1;
      return counts;
    }, {}),
    { 1: 16, 2: 33, 3: 13 }
  );

  const round2 = ROUND2_ENTRY_IDS.map((id) => byId.get(id));
  assert.equal(round2.length, 71);
  assert.ok(round2.every(Boolean));
  assert.deepEqual(
    round2.reduce((counts, entry) => {
      counts[entry.difficulty] = (counts[entry.difficulty] || 0) + 1;
      return counts;
    }, {}),
    { 1: 15, 2: 39, 3: 17 }
  );

  const round3 = ROUND3_ENTRY_IDS.map((id) => byId.get(id));
  assert.equal(round3.length, 70);
  assert.ok(round3.every(Boolean));
  assert.deepEqual(
    round3.reduce((counts, entry) => {
      counts[entry.difficulty] = (counts[entry.difficulty] || 0) + 1;
      return counts;
    }, {}),
    { 1: 14, 2: 38, 3: 18 }
  );

  const round4 = ROUND4_ENTRY_IDS.map((id) => byId.get(id));
  assert.equal(round4.length, 70);
  assert.ok(round4.every(Boolean));
  assert.deepEqual(
    round4.reduce((counts, entry) => {
      counts[entry.difficulty] = (counts[entry.difficulty] || 0) + 1;
      return counts;
    }, {}),
    { 1: 15, 2: 37, 3: 18 }
  );
});

test("sentence bank expansion keeps text, niqqud, chips, distractors, and alternates aligned", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const niqqudPattern = /[\u0591-\u05c7]/;

  [...EXPANSION_ENTRY_IDS, ...ROUND2_ENTRY_IDS, ...ROUND3_ENTRY_IDS, ...ROUND4_ENTRY_IDS].forEach((id) => {
    const entry = byId.get(id);
    assert.ok(entry, `missing expansion entry ${id}`);
    assert.match(entry.hebrew_niqqud, niqqudPattern, `${id} needs pointed Hebrew`);
    assert.equal(entry.hebrew_tokens.length, entry.hebrew_tokens_niqqud.length, `${id} target niqqud alignment`);
    assert.equal(entry.hebrew_distractors.length, entry.hebrew_distractors_niqqud.length, `${id} distractor niqqud alignment`);
    assert.ok(entry.hebrew_distractors.length >= 4 && entry.hebrew_distractors.length <= 6, `${id} Hebrew distractor count`);
    assert.ok(entry.english_distractors.length >= 4 && entry.english_distractors.length <= 6, `${id} English distractor count`);
    assert.equal(new Set(entry.hebrew_distractors).size, entry.hebrew_distractors.length, `${id} duplicate Hebrew distractor`);
    assert.equal(new Set(entry.english_distractors).size, entry.english_distractors.length, `${id} duplicate English distractor`);
    assert.equal(entry.hebrew_distractors.some((token) => entry.hebrew_tokens.includes(token)), false, `${id} Hebrew target reused as distractor`);
    assert.equal(entry.english_distractors.some((token) => entry.english_tokens.includes(token)), false, `${id} English target reused as distractor`);
    assert.equal(buildSentenceFrame(entry.hebrew, entry.hebrew_tokens).failed, false, `${id} Hebrew chips do not match sentence`);
    assert.equal(buildSentenceFrame(entry.english, entry.english_tokens).failed, false, `${id} English chips do not match sentence`);
    assert.deepEqual(getStaticEnglishWordChunks(entry), [], `${id} leaves English outside selectable chips`);

    (entry.hebrew_alternates || []).forEach((alternate) => {
      assert.match(alternate.text_niqqud, niqqudPattern, `${id} alternate needs pointed Hebrew`);
      assert.equal(alternate.tokens.length, entry.hebrew_tokens.length, `${id} alternate target length`);
      assert.equal(alternate.tokens.length, alternate.tokens_niqqud.length, `${id} alternate niqqud alignment`);
      assert.equal(buildSentenceFrame(alternate.text, alternate.tokens).failed, false, `${id} alternate chips do not match sentence`);
    });
  });

  EXPANSION_GENDER_ALTERNATE_IDS.forEach((id) => {
    assert.ok(byId.get(id).hebrew_alternates.length > 0, `${id} needs a feminine Hebrew alternative`);
  });
});

test("new sentence-bank rows accept authored natural Hebrew word orders", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));

  EXPANSION_WORD_ORDER_ALTERNATE_IDS.forEach((id) => {
    const entry = byId.get(id);
    assert.ok(entry, `missing ${id}`);
    assert.ok(
      entry.hebrew_alternates.some((alternate) => alternate.tokens.join("|") !== entry.hebrew_tokens.join("|")),
      `${id} needs a reordered Hebrew alternate`
    );
  });

  assert.equal(
    byId.get("colloquial_39").hebrew_alternates.some((alternate) => alternate.text === "מה בדיוק זה אומר?"),
    true
  );
});

test("sentence bank data avoids exact-synonym distractors for curated formal entries", () => {
  const entries = loadSentenceBankApi().getSentenceBank();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));

  assert.ok(byId.has("formal_04"));
  assert.ok(byId.has("formal_06"));
  assert.ok(byId.has("formal_08"));

  assert.equal(byId.get("formal_04").hebrew_distractors.includes("איך"), false);
  assert.equal(byId.get("formal_04").hebrew_distractors.includes("מדוע"), true);

  assert.equal(byId.get("formal_06").hebrew_distractors.includes("נכונות"), false);
  assert.equal(byId.get("formal_06").english_distractors.includes("correct"), false);
  assert.equal(byId.get("formal_06").hebrew_distractors.includes("מוכחות"), true);
  assert.equal(byId.get("formal_06").english_distractors.includes("fully reliable"), true);

  assert.equal(byId.get("formal_08").hebrew_distractors.includes("אבל"), false);
  assert.equal(byId.get("formal_08").english_distractors.includes("however"), false);
  assert.equal(byId.get("formal_08").hebrew_distractors.includes("לכן"), true);
  assert.equal(byId.get("formal_08").english_distractors.includes("therefore"), true);
});

test("sentence bank includes the requested קיים, קיום, קיומי, קיימות, טקס, and התקיים drills", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));

  assert.equal(byId.get("formal_11")?.hebrew, "הטקס התקיים באולם המרכזי אחרי השקיעה.");
  assert.deepEqual(Array.from(byId.get("formal_11")?.english_tokens || []), ["The ceremony", "was held", "in the main hall", "after sunset"]);
  assert.equal(byId.get("formal_12")?.hebrew, "הדיון התקיים בזום ולא במשרד.");
  assert.deepEqual(Array.from(byId.get("formal_12")?.english_tokens || []), ["The discussion", "took place", "on Zoom", "not", "in the office"]);

  assert.equal(byId.get("formal_13")?.hebrew, "קיים פתרון פשוט יותר לבעיה הזאת.");
  assert.equal(byId.get("formal_14")?.hebrew, "קיימים כמה סיכונים שצריך לקחת בחשבון.");
  assert.equal(byId.get("formal_15")?.hebrew, "ההסכם עדיין קיים למרות השינויים.");
  assert.equal(byId.get("formal_16")?.hebrew, "הפתרון הזה בר קיימא גם בטווח הארוך.");
  assert.equal(byId.get("formal_17")?.hebrew, "קיום חיים מחוץ לכדור הארץ עדיין לא הוכח.");
  assert.equal(byId.get("formal_18")?.hebrew, "בשבילו זו לא בעיה טכנית, אלא משבר קיומי.");
  assert.equal(byId.get("formal_19")?.hebrew, "קיימות היא לא רק סיסמה אלא דרך עבודה.");
});

test("sentence bank data compacts low-value English glue into selectable phrase chips", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const englishTokens = (id) => Array.from(byId.get(id).english_tokens);

  assert.equal(byId.get("colloquial_02").english, "I don't have energy for this right now, we'll talk later.");
  assert.deepEqual(englishTokens("colloquial_02"), ["I", "don't", "have", "energy", "for this", "right now", "we'll", "talk", "later"]);

  assert.deepEqual(englishTokens("colloquial_07"), ["Are you", "serious", "right now", "That sounds", "completely ridiculous", "to me"]);
  assert.deepEqual(englishTokens("colloquial_15"), ["Amazing", "I", "didn't", "expect", "that", "at all", "well", "done"]);
  assert.deepEqual(englishTokens("everyday_09"), ["Can I get", "the bill", "please"]);
  assert.deepEqual(englishTokens("everyday_12"), ["How long", "does it take", "to get there", "by bus"]);
  assert.deepEqual(englishTokens("colloquial_20"), ["Bro", "hold on", "I'll get back", "to you", "in a sec"]);
  assert.deepEqual(englishTokens("professional_08"), ["Can we get", "clarification", "on this matter", "It's not", "entirely clear"]);
  assert.deepEqual(englishTokens("formal_06"), ["The analysis", "is based on", "several assumptions", "which", "may not be", "accurate"]);

  assert.deepEqual(englishTokens("everyday_17"), ["The soap", "ran out", "we need", "to buy", "more"]);
  assert.deepEqual(englishTokens("professional_01"), ["I'll", "review", "the document", "and", "get back", "to you", "shortly"]);
  assert.deepEqual(englishTokens("professional_04"), ["Is there an update", "on the project", "I", "want", "to understand", "where it stands"]);
  assert.deepEqual(englishTokens("professional_06"), ["We're", "working on it", "right now", "we'll", "update", "when there are", "results"]);
  assert.deepEqual(englishTokens("formal_03"), ["It", "can", "be", "inferred", "from this", "that", "the", "model", "is", "not", "stable", "under", "certain", "conditions"]);
  assert.deepEqual(englishTokens("formal_04"), ["The central question", "is", "how", "to implement", "this", "in practice", "not", "just", "in theory"]);
});

test("sentence bank data loosens overly broad English chips in reported rows", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const englishTokens = (id) => Array.from(byId.get(id).english_tokens);

  assert.deepEqual(englishTokens("colloquial_05"), ["He's", "just", "talking", "nonsense", "don't", "take", "him", "seriously"]);
  assert.deepEqual(englishTokens("everyday_03"), ["I forgot", "to charge", "my phone", "it's", "about to", "die"]);
  assert.deepEqual(englishTokens("professional_10"), ["It's important", "to meet", "the deadlines", "otherwise", "it", "will delay", "everyone"]);
  assert.deepEqual(englishTokens("formal_09"), ["This is", "a complex", "multi-dimensional", "phenomenon", "that is difficult", "to define", "simply"]);
  assert.deepEqual(englishTokens("formal_13"), ["There is", "a", "simpler", "solution", "to", "this", "problem"]);
  assert.deepEqual(englishTokens("formal_14"), ["There are", "several", "risks", "that need to be", "taken", "into account"]);
});

test("sentence bank data loosens approved recommendation English chips", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const englishTokens = (id) => Array.from(byId.get(id).english_tokens);

  assert.deepEqual(englishTokens("everyday_10"), ["What", "do you", "want", "to eat", "tonight", "I", "don't", "know", "what", "to cook"]);
  assert.deepEqual(englishTokens("formal_17"), ["The existence", "of life", "outside", "Earth", "has", "not", "yet", "been proven"]);
  assert.deepEqual(englishTokens("formal_10"), ["One must", "distinguish", "between", "cause", "and", "effect", "otherwise", "we'll reach", "incorrect", "conclusions"]);
  assert.deepEqual(englishTokens("everyday_07"), ["Remind", "me", "to send", "the email", "I", "always", "forget"]);
  assert.deepEqual(englishTokens("everyday_11"), ["We ordered", "pizza", "it", "should", "arrive", "in about", "twenty", "minutes"]);
  assert.deepEqual(englishTokens("professional_09"), ["We'll send", "an", "updated", "version", "later", "today", "after", "making", "revisions"]);
  assert.deepEqual(englishTokens("colloquial_13"), ["Wow", "I", "had no idea", "it was", "like that", "Thanks", "for telling", "me"]);
  assert.deepEqual(englishTokens("professional_05"), ["I", "recommend", "checking", "the data", "again", "there may be", "an error"]);
});

test("sentence bank data keeps newly audited english entries chunked into natural phrase chips", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));

  CHUNKING_AUDIT_ENTRIES.forEach(({ id, requiredTokens, forbiddenTokens }) => {
    const entry = byId.get(id);
    assert.ok(entry, `missing sentence-bank entry ${id}`);
    const tokens = Array.from(entry.english_tokens || []);

    requiredTokens.forEach((token) => {
      assert.ok(tokens.includes(token), `${id} should include the phrase chip "${token}"`);
    });

    forbiddenTokens.forEach((token) => {
      assert.equal(tokens.includes(token), false, `${id} still uses fragmented token "${token}"`);
    });
  });
});

test("sentence bank data keeps meal expressions as single Hebrew chips", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const entry = byId.get("everyday_02");

  assert.ok(entry);
  assert.ok(entry.hebrew_tokens.includes("ארוחת ערב"));
  assert.equal(entry.hebrew_tokens.includes("ארוחת"), false);
  assert.equal(entry.hebrew_tokens.includes("ערב"), false);
  assert.ok(entry.hebrew_distractors.includes("ארוחת צהריים"));
  assert.ok(entry.hebrew_distractors.includes("ארוחת בוקר"));
  assert.equal(entry.hebrew_distractors.some((token) => token.includes("_")), false);
});

test("sentence bank data can mark alternate Hebrew answers for gender-ambiguous English prompts", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const entry = byId.get("colloquial_09");

  assert.ok(entry);
  assert.ok(Array.isArray(entry.hebrew_alternates));
  assert.equal(entry.hebrew_alternates.length, 1);
  assert.equal(entry.hebrew_alternates[0].text, "היא עשתה לי קטע מסריח, אני לא סומכת עליה יותר.");
  assert.deepEqual(Array.from(entry.hebrew_alternates[0].tokens), ["היא", "עשתה", "לי", "קטע", "מסריח", "אני", "לא", "סומכת", "עליה", "יותר"]);
});

test("sentence bank data includes the מוצאי שבת texting sentence with a reordered alternate", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const entry = byId.get("everyday_21");

  assert.ok(entry);
  assert.equal(entry.hebrew, "הוא שלח לי הודעה במוצאי שבת כאילו לא קרה כלום.");
  assert.equal(entry.english, "He texted me Saturday night as if nothing happened.");
  assert.deepEqual(Array.from(entry.hebrew_tokens), ["הוא", "שלח", "לי", "הודעה", "במוצאי", "שבת", "כאילו", "לא קרה", "כלום"]);
  assert.deepEqual(Array.from(entry.english_tokens), ["He", "texted", "me", "Saturday", "night", "as if", "nothing", "happened"]);
  assert.equal(entry.hebrew_tokens.includes("מוצאי שבת"), false);
  assert.ok(entry.hebrew_distractors.includes("בלילה"));
  assert.ok(Array.isArray(entry.hebrew_alternates));
  assert.equal(entry.hebrew_alternates.length, 1);
  assert.equal(entry.hebrew_alternates[0].text, "הוא שלח לי הודעה במוצאי שבת כאילו כלום לא קרה.");
  assert.deepEqual(Array.from(entry.hebrew_alternates[0].tokens), ["הוא", "שלח", "לי", "הודעה", "במוצאי", "שבת", "כאילו", "כלום", "לא קרה"]);
});

test("sentence bank data rewrites colloquial_19 as a fully aligned punctuated WhatsApp line", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const entry = byId.get("colloquial_19");

  assert.ok(entry);
  assert.equal(entry.hebrew, "וואלה, ראיתי את זה. מגניב. שלח לי את הפרטים.");
  assert.equal(entry.english, "Wow, I saw it. Cool. Send me the details.");
  assert.deepEqual(Array.from(entry.hebrew_tokens), ["וואלה", "ראיתי", "את", "זה", "מגניב", "שלח", "לי", "הפרטים"]);
  assert.deepEqual(Array.from(entry.english_tokens), ["Wow", "I saw", "it", "Cool", "Send", "me", "the details"]);
  assert.deepEqual(getStaticEnglishWordChunks(entry), []);
});

test("sentence bank data preserves visible English or note cues for audited Hebrew nuance markers", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));

  assert.equal(byId.get("everyday_06").english, "I'm running a few minutes late, I'm already on my way.");
  assert.match(byId.get("everyday_06").notes, /\burgency\b/i);
  assert.equal(byId.get("colloquial_04").english, "Wait a second, I'm coming downstairs right now.");
  assert.match(byId.get("colloquial_16").english, /\balready\b/i);
  assert.match(byId.get("colloquial_16").notes, /\bimpatience\b/i);

  byId.forEach((entry) => {
    const tokens = Array.from(entry.hebrew_tokens || []);
    const english = String(entry.english || "");
    const notes = String(entry.notes || "");

    NUANCE_GUARDRAILS.forEach((guardrail) => {
      if (!guardrail.matches(tokens, entry)) return;
      const hasCue = guardrail.englishCue.test(english) || guardrail.noteCue.test(notes);
      assert.ok(
        hasCue,
        `${entry.id} includes ${guardrail.label} but its English sentence and note do not surface that nuance`
      );
    });
  });
});

test("sentence bank data keeps english answer rows fully blank except for punctuation and spacing", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const englishTokens = (id) => Array.from(byId.get(id).english_tokens);

  assert.equal(byId.get("formal_03").english, "It can be inferred from this that the model is not stable under certain conditions.");
  assert.deepEqual(englishTokens("formal_03"), ["It", "can", "be", "inferred", "from this", "that", "the", "model", "is", "not", "stable", "under", "certain", "conditions"]);
  assert.match(byId.get("formal_03").notes, /\bfrom this\b/i);
  assert.ok(englishTokens("formal_03").includes("from this"));

  assert.equal(byId.get("everyday_08").english, "Is it near here or far from here? I don't know the area.");
  assert.deepEqual(englishTokens("everyday_08"), ["Is", "it", "near", "here", "or", "far", "from here", "I", "don't", "know", "the area"]);
  assert.match(byId.get("everyday_08").notes, /\bfrom here\b/i);
  assert.ok(englishTokens("everyday_08").includes("from here"));

  assert.ok(englishTokens("everyday_17").includes("The soap"));
  assert.ok(englishTokens("professional_06").includes("when there are"));

  byId.forEach((entry) => {
    const tokens = Array.from(entry.hebrew_tokens || []);
    const english = String(entry.english || "");
    const notes = String(entry.notes || "");

    ALIGNMENT_GUARDRAILS.forEach((guardrail) => {
      if (!guardrail.matches(tokens, entry)) return;
      const hasCue = guardrail.englishCue.test(english) || guardrail.noteCue.test(notes);
      assert.ok(
        hasCue,
        `${entry.id} includes ${guardrail.label} but its English sentence and note flatten that meaning too much`
      );
    });

    assert.deepEqual(
      getStaticEnglishWordChunks(entry),
      [],
      `${entry.id} still leaves lexical English outside the selectable chips`
    );
  });
});

test("sentence bank data ends every current row with terminal punctuation on both sides", () => {
  const entries = loadSentenceBankApi().getSentenceBank();
  const terminalPunctuation = /[.!?…״׳”'»)]\s*$/;

  entries.forEach((entry) => {
    assert.match(
      String(entry.english || ""),
      terminalPunctuation,
      `${entry.id} is missing terminal punctuation in English`
    );
    assert.match(
      String(entry.hebrew || ""),
      terminalPunctuation,
      `${entry.id} is missing terminal punctuation in Hebrew`
    );
  });
});

test("sentence bank data only uses non-leading standalone English it when Hebrew has an explicit referent cue", () => {
  const entries = loadSentenceBankApi().getSentenceBank();

  entries.forEach((entry) => {
    const englishTokens = Array.from(entry.english_tokens || []).map((token) => String(token || "").trim().toLowerCase());
    const hasNonLeadingIt = englishTokens.some((token, index) => token === "it" && index > 0);
    if (!hasNonLeadingIt) return;

    const hebrewTokens = Array.from(entry.hebrew_tokens || []).map((token) => String(token || "").trim());
    const hasExplicitObjectCue = hasExplicitHebrewItCue(hebrewTokens);
    assert.ok(
      hasExplicitObjectCue,
      `${entry.id} uses standalone English "it" without an explicit Hebrew referent cue`
    );
  });
});

test("sentence bank data gives phrase-sized distractors to the compacted english banks", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));

  PHRASE_COMPACTED_ENTRY_IDS.forEach((id) => {
    const entry = byId.get(id);
    if (!entry.english_tokens.some((token) => /\s/.test(token))) return;
    assert.ok(
      entry.english_distractors.some((token) => /\s/.test(token)),
      `${id} uses compact phrase tokens but has no phrase-sized English distractor`
    );
  });
});

test("sentence bank data shape-matches Hebrew multiword compounds with multiword distractors", () => {
  const entries = loadSentenceBankApi().getSentenceBank();

  entries.forEach((entry) => {
    const allHebrewChoices = [...entry.hebrew_tokens, ...entry.hebrew_distractors].map((token) => String(token || ""));
    assert.equal(
      allHebrewChoices.some((token) => token.includes("_")),
      false,
      `${entry.id} still uses underscore placeholder formatting in Hebrew chips`
    );

    if (!entry.hebrew_tokens.some((token) => /\s/.test(String(token || "")))) return;
    assert.ok(
      entry.hebrew_distractors.some((token) => /\s/.test(String(token || ""))),
      `${entry.id} uses a multiword Hebrew target chip but has no shape-matched multiword Hebrew distractor`
    );
  });
});

test("sentence bank data exposes the flexible modifier tokens used for adjacent-swap grading", () => {
  const api = loadSentenceBankApi();
  assert.equal(typeof api.getFlexibleModifierTokens, "function");

  const tokens = api.getFlexibleModifierTokens();
  assert.ok(Array.isArray(tokens));
  assert.ok(tokens.length > 0);
  tokens.forEach((token) => {
    assert.equal(typeof token, "string");
    assert.equal(token, token.trim());
    assert.ok(token.length > 0);
  });
  assert.equal(new Set(tokens).size, tokens.length);
  ["די", "לגמרי", "ממש", "מאוד"].forEach((expected) => {
    assert.ok(tokens.includes(expected), `missing flexible modifier ${expected}`);
  });

  tokens.push("mutated");
  assert.ok(!api.getFlexibleModifierTokens().includes("mutated"));
});

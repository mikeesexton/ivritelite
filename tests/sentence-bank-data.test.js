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

function hebrewConsonantalSkeleton(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g, "")
    .replace(/[וי]/g, "")
    .normalize("NFC");
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

// Legacy snapshots only. New authoring follows docs/sentence-bank-authoring.md
// and the compact-token policy enforced for the current append-only ranges.
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

const POLITICAL_ENTRY_IDS = [
  ...sentenceIdRange("colloquial", 140, 151),
  ...sentenceIdRange("everyday", 125, 136),
  ...sentenceIdRange("professional", 73, 84),
  ...sentenceIdRange("formal", 64, 77),
];

const REQUESTED_ENTRY_IDS = sentenceIdRange("everyday", 137, 138);
const INBAL_ENTRY_IDS = sentenceIdRange("inbal", 1, 95).map((id) => id.replace(/_(\d)$/, "_0$1"));
const INAT_ENTRY_IDS = sentenceIdRange("inat", 1, 25).map((id) => id.replace(/_(\d)$/, "_0$1"));
// One-word-focus rows added alongside the תחרותי / ספורים / בלי חרטות cards and
// the לקלוט, להגיש, להקליט conjugation entries. Registered here so the alignment
// checks below cover them; the compact-token policy already does, via their
// plain `<bank>_<number>` ids.
const LEXICAL_FOCUS_ENTRY_IDS = [
  ...sentenceIdRange("colloquial", 152, 156),
  ...sentenceIdRange("professional", 85, 88),
  ...sentenceIdRange("formal", 78, 79),
  "everyday_139",
];
// Singular שמועה rows added alongside the rumor vocabulary card.
const RUMOR_ENTRY_IDS = ["colloquial_157", "professional_89"];

const COMPACT_TOKEN_POLICY_START = Object.freeze({
  colloquial: 140,
  everyday: 125,
  professional: 73,
  formal: 64,
});

const ENGLISH_FUNCTION_WORDS = new Set(`
  a an the and or but nor for so yet as at by from in into of on onto to under over
  with within without about after before during through while because although if when
  whether that this these those my your his her its our their i me we us you he him she
  it they them one ones is am are was were be been being do does did have has had
  can could may might must shall should will would not no than then there here up out off
  just only more most less least very already still every each all any some another other
  which who whom whose what where why how according following based due like outside beyond
  until finally fully against regardless theyre
`.trim().split(/\s+/));

function compactTokenExceptionKey(id, bank, token) {
  return `${id}\u0000${bank}\u0000${token}`;
}

function compactUnitMap(values, reason) {
  return values.trim().split("\n").map((value) => [value.trim(), reason]);
}

// This is a reusable glossary, not a waiver for convenient phrase grouping.
// Add an item only when the whole string is itself vocabulary a learner should
// recognize as a term, category, fixed expression, or name.
const COMPACT_ENGLISH_MULTIWORD_UNITS = new Map([
  ...compactUnitMap(`
    affordable housing
    annual growth
    budget analysis
    central government
    centrist parties
    city limits
    civil marriage
    civil rights
    civilian government
    coalition negotiations
    commercial space
    collective memory
    civil disobedience
    close reading
    community center
    cost living
    disciplinary offenses
    disciplinary violations
    domestic law
    duty obey
    economic team
    education system
    effective control
    election day
    election polls
    electoral threshold
    evacuation request
    existing law
    export prices
    family group chat
    final vote
    freedom expression
    freedom movement
    freedom religion
    gender identity
    government decision
    government institutions
    higher education
    hiring policy
    housing prices
    independent review
    industrial exports
    incantation bowl
    international law
    labor market
    labor organizations
    legal advice
    legal team
    lgbtq community
    lgbtq youth
    local authority
    local government
    local lists
    longtime resident
    longtime residents
    marital status
    medical assistance
    meeting summary
    memorial day
    middle class
    military control
    monitoring team
    municipal bylaws
    neighbor dispute
    new immigrant
    new immigrants
    outreach team
    party office
    place residence
    planning process
    police brutality
    protective formula
    political center
    polling station
    preliminary reading
    promotion procedure
    public figure
    public order
    public participation
    public sphere
    public transportation
    regional tribunal
    research team
    ritual bath
    self employed retirees
    settler violence
    sexual orientation
    sports organizations
    state revenue
    street art
    tax obligations
    temporary presence
    upper class
    voting rights
    walking tour
    wealthy owners
    work team
    workers rights
    young adults
    counter narrative
    education ministry
    evil eye
    oral history
    protest song
  `, "term: recognized multiword vocabulary unit"),
  ...compactUnitMap(`
    calms down
    distinguish among
    distinguished between
    falls apart
    goes air
    leaves screen
    mixed together
    right left
    present day
    upside down
  `, "fixed-expression: lexicalized verb or paired expression"),
  ...compactUnitMap(`
    basic laws
    central israel
    civil administration
    civil service commission
    green line
    internal police investigations
    supreme court
    tel aviv
  `, "proper-name: geographic, legal, or institutional name"),
  ...compactUnitMap(`
    baal shem tov
    bar yochai
    garden eden
    rabbi nachman
    rabbi shimon
  `, "proper-name: religious figure or scriptural place"),
  ...compactUnitMap(`
    divine presence
    ein sof
    ten sefirot
    tikkun olam
    tree life
  `, "term: named concept in Kabbalah a learner should recognize whole"),
  ...compactUnitMap(`
    rosh hashanah
    yom kippur
  `, "proper-name: festival on the Hebrew calendar"),
  ...compactUnitMap(`
    atonement rite
    harmful spirits
    memorial candle
    palm frond
    penitential prayers
    prayer shawl
    study hall
    traveller prayer
    ultra orthodox
  `, "term: ritual object, practice, or category — each is a vocabulary card gloss"),
  ...compactUnitMap(`
    sleight hand
  `, "fixed-expression: lexicalized English idiom"),
]);

const COMPACT_ENGLISH_CONTEXT_EXCEPTIONS = new Map([
  [compactTokenExceptionKey("colloquial_151", "target", "When people say"), "grammar: impersonal Hebrew verb needs a generic English subject"],
  [compactTokenExceptionKey("colloquial_151", "distractor", "When people write"), "grammar: impersonal Hebrew verb needs a generic English subject"],
  [compactTokenExceptionKey("professional_83", "distractor", "makes it harder"), "grammar: natural analytic rendering of one Hebrew verb"],
]);

// Keep empty unless Hebrew and English genuinely cannot express a natural row
// with comparable target counts. Future entries require an exact id + reason.
const COMPACT_TARGET_COUNT_EXCEPTIONS = new Map();

function isCompactTokenPolicyEntry(entry) {
  if (/^(?:inbal|inat)_\d+$/.test(String(entry?.id || ""))) return true;
  const match = /^(colloquial|everyday|professional|formal)_(\d+)$/.exec(String(entry?.id || ""));
  return Boolean(match) && Number(match[2]) >= COMPACT_TOKEN_POLICY_START[match[1]];
}

function englishWordParts(token) {
  return String(token || "")
    .toLowerCase()
    .replace(/\bin order to\b/g, "to")
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function englishContentWords(token) {
  return englishWordParts(token).filter((word) => !ENGLISH_FUNCTION_WORDS.has(word));
}

function canonicalEnglishContentKey(token) {
  return englishContentWords(token).join(" ");
}

function whitespaceWordCount(token) {
  return String(token || "").trim().split(/\s+/u).filter(Boolean).length;
}

const EXPANSION_WORD_ORDER_ALTERNATE_IDS = [
  "everyday_39", "everyday_40", "everyday_43", "everyday_49", "everyday_52", "everyday_55",
  "everyday_57", "everyday_59", "everyday_60", "everyday_61", "colloquial_39", "colloquial_40",
  "colloquial_43", "colloquial_45", "colloquial_46", "colloquial_47", "colloquial_48", "colloquial_53",
  "professional_26", "professional_27", "professional_31", "professional_33", "professional_34",
  "professional_35", "professional_36", "professional_37", "formal_29", "formal_30", "formal_31", "formal_32",
];

const WORD_ORDER_AUDIT_ALTERNATE_TEXTS = {
  colloquial_26: ["לקחתי מספר ואני מחכה כבר שעה בתור."],
  professional_06: [
    "כרגע אנחנו עובדים על זה, נעדכן כשיהיו תוצאות.",
    "אנחנו כרגע עובדים על זה, נעדכן כשיהיו תוצאות.",
  ],
  professional_09: ["בהמשך היום נשלח גרסה מעודכנת, אחרי שנבצע תיקונים."],
  professional_13: ["מחר בבוקר בוא נסגור את הפרטים בשיחה קצרה."],
  professional_19: ["הישיבה נדחתה, בהמשך אעדכן אותך לגבי מועד חדש."],
  formal_15: ["ההסכם קיים עדיין למרות השינויים."],
  formal_17: ["קיום חיים מחוץ לכדור הארץ לא הוכח עדיין."],
  formal_27: ["השפעת הגורם הזה על התוצאה שנויה עדיין במחלוקת."],
  professional_46: ["התקציב לרבעון הבא לא אושר עדיין."],
  professional_51: [
    "אם לא נקבל היום אישור, נדחה את הפרסום לשבוע הבא.",
    "אם היום לא נקבל אישור, נדחה את הפרסום לשבוע הבא.",
  ],
  professional_57: [
    "לפי הדוח, השנה המחירים עלו בעשרה אחוזים.",
    "לפי הדוח, המחירים השנה עלו בעשרה אחוזים.",
  ],
  formal_51: ["על פי הפרסומים, בקרוב ייחתם ההסכם."],
  formal_59: ["אם יאושר התקציב, הפרויקט מיד יצא לדרך."],
  everyday_105: [
    "אנחנו כבר מחכים כמעט חצי שעה.",
    "אנחנו מחכים כמעט חצי שעה כבר.",
  ],
  colloquial_96: [
    "עד שהגענו, האוכל היה כבר קר.",
    "עד שהגענו, האוכל היה קר כבר.",
  ],
  colloquial_104: ["נפל לי פתאום האסימון: הם חזרו להיות זוג."],
  colloquial_108: ["כבר יומיים יש וי כחול והוא לא עונה."],
  colloquial_133: [
    "החודש לא נכנסים לים, זאת עונת המדוזות.",
    "לא נכנסים החודש לים, זאת עונת המדוזות.",
  ],
  everyday_138: ["בכל יום היא מדברת שתי שפות בעבודה."],
  colloquial_vodge_02: [
    "בבוקר הוודג' שלי הרוס בלי איפור.",
    "הוודג' שלי הרוס בבוקר בלי איפור.",
    "בלי איפור בבוקר הוודג' שלי הרוס.",
  ],
  colloquial_vodge_03: ["לפני שיוצאים מהבית, תסדר את הוודג'."],
  colloquial_falsh_01: ["אל תהיה פאלש, תגיד מה שאתה חושב באמת."],
  colloquial_dov_01: [
    "ביום שישי כל הדובים באים למסיבה.",
    "כל הדובים ביום שישי באים למסיבה.",
  ],
  colloquial_kukitza_01: ["הקוקיצה החדשה במשרד מכירה כבר את כולם."],
  colloquial_melarler_01: [
    "היא כבר מלרלרת בטלפון שעתיים.",
    "היא כבר שעתיים מלרלרת בטלפון.",
    "כבר שעתיים היא מלרלרת בטלפון.",
    "היא מלרלרת כבר שעתיים בטלפון.",
    "היא כבר מלרלרת שעתיים בטלפון.",
  ],
  inbal_07: ["לפני הטקס היא הדליקה נר ושרפה קטורת."],
  inbal_08: ["לפני ששותים אותו, מברכים על היין."],
  inbal_09: ["לפני השקיעה היא חזרה מהמקווה."],
  inbal_10: ["היא משלבת טקסט קדוש ואמנות רחוב כאומנית שחזרה בשאלה."],
  inbal_15: ["בסיפור לכל קללה יש פרצה שמבטלת אותה."],
  inat_14: [
    "לפעמים צנזורה הופכת ספר אסור לספר מבוקש.",
    "צנזורה הופכת לפעמים ספר אסור לספר מבוקש.",
  ],
  inat_18: ["מול משרד החינוך מחו הסטודנטים."],
  inat_19: ["לאחר שהכביש נחסם, המשטרה פיזרה את ההפגנה."],
  inat_22: ["החוקרת מתעדת כיצד עם הזמן זיכרון קולקטיבי משתנה."],
  inat_23: [
    "מחינו אתמול בכיכר, ומחר נמחה שוב.",
    "מחינו בכיכר אתמול, ומחר נמחה שוב.",
    "אתמול מחינו בכיכר, ומחר שוב נמחה.",
    "מחינו אתמול בכיכר, ומחר שוב נמחה.",
    "מחינו בכיכר אתמול, ומחר שוב נמחה.",
  ],
};

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
  "everyday_125",
];

test("sentence bank data exposes 596 complete entries with notes, distractors, and tokens", () => {
  const api = loadSentenceBankApi();
  assert.ok(api);
  assert.equal(typeof api.getSentenceBank, "function");

  const entries = api.getSentenceBank();
  assert.equal(entries.length, 596);
  assert.equal(new Set(entries.map((entry) => entry.id)).size, 596);
  assert.equal(entries.filter((entry) => String(entry.notes || "").trim()).length, 596);

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
    colloquial: 196,
    everyday: 185,
    professional: 105,
    formal: 110,
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

  const political = POLITICAL_ENTRY_IDS.map((id) => byId.get(id));
  assert.equal(political.length, 50);
  assert.ok(political.every(Boolean));
  assert.deepEqual(
    political.reduce((counts, entry) => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
      return counts;
    }, {}),
    { colloquial: 12, everyday: 12, professional: 12, formal: 14 }
  );
});

test("sentence bank expansion keeps text, niqqud, chips, distractors, and alternates aligned", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const niqqudPattern = /[\u0591-\u05c7]/;

  [...EXPANSION_ENTRY_IDS, ...ROUND2_ENTRY_IDS, ...ROUND3_ENTRY_IDS, ...ROUND4_ENTRY_IDS, ...POLITICAL_ENTRY_IDS, ...REQUESTED_ENTRY_IDS, ...INBAL_ENTRY_IDS, ...INAT_ENTRY_IDS, ...LEXICAL_FOCUS_ENTRY_IDS, ...RUMOR_ENTRY_IDS].forEach((id) => {
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

test("Inbal and Inat sentence tranches stay aligned and exercise their conjugation verbs", () => {
  const entries = loadSentenceBankApi().getSentenceBank();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const inbal = INBAL_ENTRY_IDS.map((id) => byId.get(id));
  const inat = INAT_ENTRY_IDS.map((id) => byId.get(id));

  assert.equal(inbal.length, 95);
  assert.equal(inat.length, 25);
  assert.ok([...inbal, ...inat].every(Boolean));
  [...inbal, ...inat].forEach((entry) => {
    assert.equal(entry.hebrew_tokens.length, entry.english_tokens.length, `${entry.id} bilingual target count`);
    assert.equal(buildSentenceFrame(entry.hebrew, entry.hebrew_tokens).failed, false, `${entry.id} Hebrew chips`);
    assert.equal(buildSentenceFrame(entry.english, entry.english_tokens).failed, false, `${entry.id} English chips`);
    assert.deepEqual(getStaticEnglishWordChunks(entry), [], `${entry.id} leaves English outside chips`);
  });

  const inbalHebrew = inbal.map((entry) => entry.hebrew).join("\n");
  assert.match(inbalHebrew, /קערת השבעה/);
  assert.match(inbalHebrew, /בירכנו|מברכים/);
  const inatHebrew = inat.map((entry) => entry.hebrew).join("\n");
  assert.match(inatHebrew, /פירשה/);
  assert.match(inatHebrew, /מחו|מחינו|נמחה/);
});

test("sentence bank includes requested lips and two-languages examples", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  assert.match(byId.get("everyday_137")?.hebrew || "", /שפתיים/);
  assert.match(byId.get("everyday_138")?.hebrew || "", /שתי שפות/);
});

test("political sentence expansion has 50 aligned, broad, non-graphic learning rows", () => {
  const entries = loadSentenceBankApi().getSentenceBank();
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const political = POLITICAL_ENTRY_IDS.map((id) => byId.get(id));

  assert.equal(POLITICAL_ENTRY_IDS.length, 50);
  assert.equal(new Set(POLITICAL_ENTRY_IDS).size, 50);
  assert.ok(political.every(Boolean));

  political.forEach((entry) => {
    assert.equal(
      hebrewConsonantalSkeleton(entry.hebrew_niqqud),
      hebrewConsonantalSkeleton(entry.hebrew),
      `${entry.id} full pointed/plain consonantal alignment`
    );
    entry.hebrew_tokens.forEach((token, index) => {
      assert.match(entry.hebrew_tokens_niqqud[index], /[\u0591-\u05C7]/, `${entry.id} target ${index} needs niqqud`);
      assert.equal(
        hebrewConsonantalSkeleton(entry.hebrew_tokens_niqqud[index]),
        hebrewConsonantalSkeleton(token),
        `${entry.id} target ${index} pointed/plain consonantal alignment`
      );
    });
    entry.hebrew_distractors.forEach((token, index) => {
      assert.match(entry.hebrew_distractors_niqqud[index], /[\u0591-\u05C7]/, `${entry.id} distractor ${index} needs niqqud`);
      assert.equal(
        hebrewConsonantalSkeleton(entry.hebrew_distractors_niqqud[index]),
        hebrewConsonantalSkeleton(token),
        `${entry.id} distractor ${index} pointed/plain consonantal alignment`
      );
    });
  });

  const combinedHebrew = political.map((entry) => `${entry.hebrew} ${entry.notes}`).join("\n");
  [
    "אנדרטה", "בחירות", "קואליציה", "אופוזיציה", "כיבוש", "התנחלות",
    "אלימות מתנחלים", "אלימות משטרתית", "אפליה", "התנקשות", "להט״ב",
    "עולים", "תל אביב", "יוקר המחיה", "נישואים אזרחיים", "מעמד הביניים",
    "בית המשפט העליון", "הפגנה",
  ].forEach((anchor) => {
    assert.ok(combinedHebrew.includes(anchor), `political expansion needs scope anchor ${anchor}`);
  });

  const combinedContent = political
    .map((entry) => `${entry.hebrew} ${entry.english} ${entry.notes}`)
    .join("\n");
  assert.doesNotMatch(combinedContent, /\b(?:massacre|genocide)\b|טבח|רצח\s+עם/iu);

  const namedRows = political.filter((entry) =>
    /\b(?:Bibi|Trump)\b|ביבי|טראמפ/iu.test(`${entry.hebrew} ${entry.english}`)
  );
  assert.ok(namedRows.length <= 2, `expected at most two Bibi/Trump rows, found ${namedRows.length}`);
});

test("current and future sentence rows keep bilingual chips compact and comparable", () => {
  const entries = loadSentenceBankApi().getSentenceBank().filter(isCompactTokenPolicyEntry);
  const usedLexicalUnits = new Set();
  const usedContextExceptions = new Set();
  const usedCountExceptions = new Set();
  const forbiddenClauseChips = [
    "before publishing the data",
    "of the police-brutality allegations",
    "to allow the public",
    "to submit objections",
    "was formally deposited",
  ];
  const forbiddenHebrewChips = new Set([
    "לפני פרסום הנתונים",
    "במונח שליטה צבאית",
    "בתחבורה ציבורית בשבת",
    "ואופייה של השבת",
    "ביקשה שנציין",
    "לאחר פרישת הסיעה",
  ]);

  assert.ok(entries.length >= POLITICAL_ENTRY_IDS.length);

  COMPACT_ENGLISH_MULTIWORD_UNITS.forEach((reason, key) => {
    assert.match(reason, /^(?:term|fixed-expression|proper-name): \S/);
    assert.match(key, /\S+ \S+/);
  });
  COMPACT_ENGLISH_CONTEXT_EXCEPTIONS.forEach((reason, key) => {
    assert.match(reason, /^grammar: \S/);
    assert.match(key, /\S/);
  });
  COMPACT_TARGET_COUNT_EXCEPTIONS.forEach((reason, id) => {
    assert.match(reason, /\S/);
    assert.match(id, /^(?:colloquial|everyday|professional|formal)_\d+$/);
  });

  entries.forEach((entry) => {
    if (entry.hebrew_tokens.length !== entry.english_tokens.length) {
      assert.ok(
        COMPACT_TARGET_COUNT_EXCEPTIONS.has(entry.id),
        `${entry.id} target chips should have comparable bilingual boundaries`
      );
      usedCountExceptions.add(entry.id);
    }

    entry.hebrew_tokens.forEach((token) => {
      assert.ok(
        whitespaceWordCount(token) <= 3,
        `${entry.id} Hebrew target chip is too broad: "${token}"`
      );
      assert.equal(
        forbiddenHebrewChips.has(token),
        false,
        `${entry.id} still uses the over-broad Hebrew chip "${token}"`
      );
    });
    entry.hebrew_distractors.forEach((token) => {
      assert.ok(
        whitespaceWordCount(token) <= 3,
        `${entry.id} Hebrew distractor chip is too broad: "${token}"`
      );
      assert.equal(
        forbiddenHebrewChips.has(token),
        false,
        `${entry.id} still uses the over-broad Hebrew distractor "${token}"`
      );
    });
    (entry.hebrew_alternates || []).forEach((alternate) => {
      alternate.tokens.forEach((token) => {
        assert.ok(
          whitespaceWordCount(token) <= 3,
          `${entry.id} Hebrew alternate chip is too broad: "${token}"`
        );
      });
    });

    [
      ["target", entry.english_tokens],
      ["distractor", entry.english_distractors],
    ].forEach(([bank, tokens]) => {
      tokens.forEach((token) => {
        assert.ok(
          englishWordParts(token).length <= 5,
          `${entry.id} English ${bank} chip exceeds the hard five-word limit: "${token}"`
        );

        const contentKey = canonicalEnglishContentKey(token);
        if (englishContentWords(token).length > 1) {
          if (COMPACT_ENGLISH_MULTIWORD_UNITS.has(contentKey)) {
            usedLexicalUnits.add(contentKey);
          } else {
            const contextKey = compactTokenExceptionKey(entry.id, bank, token);
            assert.ok(
              COMPACT_ENGLISH_CONTEXT_EXCEPTIONS.has(contextKey),
              `${entry.id} English ${bank} chip carries multiple content ideas without a glossary term or exact grammar exception: "${token}"`
            );
            usedContextExceptions.add(contextKey);
          }
        }

        forbiddenClauseChips.forEach((forbidden) => {
          assert.notEqual(
            token.toLowerCase(),
            forbidden,
            `${entry.id} still uses the over-broad chip "${token}"`
          );
        });
      });
    });
  });

  assert.deepEqual(
    [...usedLexicalUnits].sort(),
    [...COMPACT_ENGLISH_MULTIWORD_UNITS.keys()].sort(),
    "multiword glossary units must be used and non-stale"
  );
  assert.deepEqual(
    [...usedContextExceptions].sort(),
    [...COMPACT_ENGLISH_CONTEXT_EXCEPTIONS.keys()].sort(),
    "compact-token grammar exceptions must be exact, used, and non-stale"
  );
  assert.deepEqual(
    [...usedCountExceptions].sort(),
    [...COMPACT_TARGET_COUNT_EXCEPTIONS.keys()].sort(),
    "target-count exceptions must be exact, used, and non-stale"
  );
});

test("reported political rows keep legible English and fine-grained chips", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const formal68 = byId.get("formal_68");
  const formal71 = byId.get("formal_71");
  const professional81 = byId.get("professional_81");

  assert.doesNotMatch(formal71.english, /\bdeposited\b/i);
  assert.deepEqual(Array.from(formal71.english_tokens), [
    "The plan", "to expand", "the settlement", "was published", "so", "the public", "could submit", "objections", "as part of", "the planning process",
  ]);
  assert.deepEqual(Array.from(formal71.hebrew_tokens), [
    "התוכנית", "להרחבת", "ההתנחלות", "פורסמה", "כדי", "שהציבור", "יוכל להגיש", "התנגדויות", "במסגרת", "הליך התכנון",
  ]);

  assert.deepEqual(Array.from(formal68.english_tokens), [
    "The Department", "of Internal Police Investigations", "began", "to review", "allegations", "of", "police brutality",
  ]);
  assert.deepEqual(Array.from(professional81.english_tokens), [
    "The monitoring team", "verified", "reports", "of settler violence", "before", "publishing", "the data",
  ]);
  assert.deepEqual(Array.from(professional81.hebrew_tokens), [
    "צוות המעקב", "אימת", "דיווחים", "על אלימות מתנחלים", "לפני", "פרסום", "הנתונים",
  ]);
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

test("append-only sentence authoring cannot bypass an explicit Hebrew word-order review", () => {
  const sourcePath = path.join(__dirname, "..", "sentence-bank-data.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  const marker = "// APPEND_ONLY_REVIEWED_SENTENCES_START";
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, "reviewed-sentence source marker is missing");
  assert.doesNotMatch(
    source.slice(markerIndex),
    /\bbuildExpandedSentence\s*\(\s*\{/,
    "append-only sentences must use buildReviewedSentence"
  );

  const entries = loadSentenceBankApi().getSentenceBank();
  const reviewedStart = entries.findIndex((entry) => entry.id === "colloquial_vodge_01");
  assert.notEqual(reviewedStart, -1, "reviewed sentence tranche is missing");
  const reviewedEntries = entries.slice(reviewedStart);
  assert.ok(reviewedEntries.length >= 52);

  reviewedEntries.forEach((entry) => {
    assert.ok(
      ["fixed", "alternates"].includes(entry.hebrew_order_review),
      `${entry.id} needs an explicit fixed-vs-alternates word-order decision`
    );
    const primaryOrder = entry.hebrew_tokens.join("|");
    const reorderedAlternates = (entry.hebrew_alternates || []).filter(
      (alternate) => alternate.tokens.join("|") !== primaryOrder
    );
    assert.equal(
      reorderedAlternates.length > 0,
      entry.hebrew_order_review === "alternates",
      `${entry.id} word-order decision does not match its authored alternates`
    );
  });
});

test("approved word-order audit rows keep every reviewed Hebrew order buildable", () => {
  const byId = new Map(loadSentenceBankApi().getSentenceBank().map((entry) => [entry.id, entry]));
  const niqqudPattern = /[\u0591-\u05c7]/;
  let reviewedVariantCount = 0;

  Object.entries(WORD_ORDER_AUDIT_ALTERNATE_TEXTS).forEach(([id, expectedTexts]) => {
    const entry = byId.get(id);
    assert.ok(entry, `missing audited sentence ${id}`);

    expectedTexts.forEach((expectedText) => {
      const alternate = entry.hebrew_alternates.find((variant) => variant.text === expectedText);
      assert.ok(alternate, `${id} needs reviewed order: ${expectedText}`);
      assert.equal(alternate.tokens.length, entry.hebrew_tokens.length, `${id} alternate target length`);
      assert.deepEqual(
        [...alternate.tokens].sort(),
        [...entry.hebrew_tokens].sort(),
        `${id} reviewed order must reuse the primary tiles`
      );
      assert.equal(alternate.tokens_niqqud.length, alternate.tokens.length, `${id} alternate niqqud alignment`);
      assert.match(alternate.text_niqqud, niqqudPattern, `${id} alternate needs pointed Hebrew`);
      assert.equal(
        hebrewConsonantalSkeleton(alternate.text_niqqud),
        hebrewConsonantalSkeleton(alternate.text),
        `${id} alternate pointed/plain consonantal alignment`
      );
      assert.equal(buildSentenceFrame(alternate.text, alternate.tokens).failed, false, `${id} alternate frame`);
      reviewedVariantCount += 1;
    });
  });

  assert.equal(
    reviewedVariantCount,
    Object.values(WORD_ORDER_AUDIT_ALTERNATE_TEXTS).flat().length
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

test("legacy sentence rows shape-match Hebrew multiword compounds with multiword distractors", () => {
  const entries = loadSentenceBankApi().getSentenceBank();

  entries.forEach((entry) => {
    const allHebrewChoices = [...entry.hebrew_tokens, ...entry.hebrew_distractors].map((token) => String(token || ""));
    assert.equal(
      allHebrewChoices.some((token) => token.includes("_")),
      false,
      `${entry.id} still uses underscore placeholder formatting in Hebrew chips`
    );

    // New rows follow the compact-unit policy above. Requiring a multiword
    // distractor merely because a genuine term is multiword would reward the
    // same artificial phrase packing that policy is designed to prevent.
    if (isCompactTokenPolicyEntry(entry)) return;
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

test("everyday_85 accepts the alternate order with a fronted time adverb", () => {
  const api = loadSentenceBankApi();
  const entry = api.getSentenceBank().find((sentence) => sentence.id === "everyday_85");
  assert.ok(entry, "everyday_85 exists");
  const alternate = entry.hebrew_alternates.find(
    (variant) => variant.tokens.join("|") === "השיעור|מתחיל|בדיוק|בשמונה|וחצי"
  );
  assert.ok(alternate, "everyday_85 has the reordered בדיוק alternate");
  assert.equal(alternate.tokens.length, entry.hebrew_tokens.length);
  assert.equal(alternate.tokens_niqqud.length, alternate.tokens.length);
});

test("formal_32 accepts the alternate English order for the generalization warning", () => {
  const api = loadSentenceBankApi();
  const entry = api.getSentenceBank().find((sentence) => sentence.id === "formal_32");
  assert.ok(entry, "formal_32 exists");
  assert.ok(Array.isArray(entry.english_alternates));
  const expectedAlternates = [
    "Findings should not be generalized from this sample to the entire population.",
    "Conclusions from this sample should not be generalized to the entire population.",
    "Conclusions should not be generalized from this sample to the entire population.",
  ];
  assert.deepEqual(
    Array.from(entry.english_alternates, (alternate) => alternate.text),
    expectedAlternates
  );
  entry.english_alternates.forEach((alternate) => {
    assert.equal(alternate.tokens.length, entry.english_tokens.length);
  });
});

test("professional_21 accepts feminine מעדיפה when the English speaker gender is unspecified", () => {
  const api = loadSentenceBankApi();
  const entry = api.getSentenceBank().find((sentence) => sentence.id === "professional_21");
  assert.ok(entry, "professional_21 exists");
  const alternate = entry.hebrew_alternates.find(
    (variant) => variant.text === "אני מעדיפה לסגור את זה בכתב כדי שיהיה תיעוד."
  );
  assert.ok(alternate, "professional_21 has the feminine alternate");
  assert.equal(alternate.tokens.length, entry.hebrew_tokens.length);
  assert.equal(alternate.tokens_niqqud.length, alternate.tokens.length);
  assert.equal(alternate.tokens[1], "מעדיפה");
  assert.equal(alternate.tokens_niqqud[1], "מַעֲדִיפָה");
});

test("colloquial_130 points the loanword פארק with dagesh so TTS says park, not fark", () => {
  const api = loadSentenceBankApi();
  const entry = api.getSentenceBank().find((sentence) => sentence.id === "colloquial_130");
  assert.ok(entry, "colloquial_130 exists");
  const pointedPark = "פַּארְק".normalize("NFC");
  assert.ok(entry.hebrew_niqqud.normalize("NFC").includes(pointedPark), "sentence niqqud has dagesh in פארק");
  const parkToken = entry.hebrew_tokens_niqqud.find((token) => token.includes("פ"));
  assert.ok(parkToken.normalize("NFC").includes(pointedPark), "token niqqud has dagesh in פארק");
});

// A distractor that is the same word inflected for the other gender is a valid
// alternative translation whenever the English is gender-neutral ("you", "we").
// The bank's own answer to this is hebrewAlternates: a row may offer the other
// gender as a distractor only if it also accepts that reading. Rows where the
// English names the subject (he said / she wrote) or where the Hebrew supplies
// the referent are real contrasts and are listed as exempt.
test("gender-variant distractors are either accepted as alternates or removed", () => {
  const entries = loadSentenceBankApi().getSentenceBank();
  const SECOND_PERSON_PRONOUNS = [["אתה", "את"], ["אתם", "אתן"]];
  const ENGLISH_DISAMBIGUATES = new Set([
    "colloquial_01",   // שמעתי (I heard) vs שמעת (you heard) — person, not gender
    "colloquial_92", "colloquial_98", "colloquial_109", "colloquial_126",
    "colloquial_127", "professional_47",              // English names he or she
    "everyday_11", "everyday_84", "professional_38",  // referent is in the Hebrew
    "everyday_92",   // the target את is the object marker, not the pronoun
    "colloquial_89", // "it came out" takes masculine \u05d9\u05e6\u05d0 by convention here
  ]);

  function genderPairKind(a, b) {
    if (a === b) return "";
    for (const [m, f] of SECOND_PERSON_PRONOUNS) {
      if ((a === m && b === f) || (a === f && b === m)) return "2nd-person pronoun";
    }
    if (a === `${b}\u05d9` || b === `${a}\u05d9`) return "2nd-person m/f";
    if (a === `${b}\u05d4` || b === `${a}\u05d4`) return "singular participle m/f";
    const plural = (x, y) => x.endsWith("\u05d9\u05dd") && y.endsWith("\u05d5\u05ea")
      && x.slice(0, -2) === y.slice(0, -2);
    if (plural(a, b) || plural(b, a)) return "plural participle m/f";
    return "";
  }

  const offenders = [];
  entries.forEach((entry) => {
    if (ENGLISH_DISAMBIGUATES.has(entry.id)) return;
    const acceptedTokens = new Set(
      (entry.hebrew_alternates || []).flatMap((alternate) => alternate.tokens || []),
    );
    (entry.hebrew_distractors || []).forEach((distractor) => {
      if (acceptedTokens.has(distractor)) return;
      entry.hebrew_tokens.forEach((token) => {
        const kind = genderPairKind(distractor, token);
        if (kind) {
          offenders.push(`${entry.id}: "${distractor}" is the ${kind} counterpart of target "${token}" and is not an accepted alternate`);
        }
      });
    });
  });

  assert.deepEqual(offenders, []);
});

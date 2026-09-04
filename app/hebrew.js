(function initIvriQuestAppHebrew(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const constants = app.constants || {};
const utils = app.utils || {};
const hebrew = app.hebrew = app.hebrew || {};

const finalToMedial = constants.HEBREW_FINAL_TO_MEDIAL || {};
const medialToFinal = constants.HEBREW_MEDIAL_TO_FINAL || {};
const sanitizeEnglishText = utils.sanitizeEnglishDisplayText || function sanitizeEnglishDisplayText(text) {
  return String(text || "").trim();
};
const normalizeAvailability = utils.normalizeVocabularyAvailability || function normalizeVocabularyAvailability(availability) {
  return {
    translationQuiz: availability?.translationQuiz !== false,
    sentenceHints: availability?.sentenceHints !== false,
  };
};

function isHebrewLetter(char) {
  return /[א-תךםןףץ]/.test(String(char || ""));
}

function isNiqqudMark(char) {
  return /[\u0591-\u05c7]/.test(String(char || ""));
}

function hasHebrewLetterAhead(chars, idx) {
  let i = idx + 1;
  while (i < chars.length && isNiqqudMark(chars[i])) {
    i += 1;
  }
  return i < chars.length && isHebrewLetter(chars[i]);
}

function splitHebrewParts(text) {
  return String(text).split(/([\s"'׳״.,;:!?()[\]{}\-\/]+)/).filter((part) => part.length);
}

function isHebrewToken(token) {
  return /[\u0590-\u05ff]/.test(token);
}

hebrew.toMedialHebrewLetter = hebrew.toMedialHebrewLetter || function toMedialHebrewLetter(letter) {
  return finalToMedial[letter] || letter;
};

hebrew.stripNiqqud = hebrew.stripNiqqud || function stripNiqqud(text) {
  return String(text || "").normalize("NFC").replace(/[\u0591-\u05c7]/g, "");
};

// Prefixes that attach to a Hebrew noun without changing which word it is, so a
// headword still counts as present under one. Kept to the single-letter clitics:
// anything longer starts guessing at morphology, which docs/sentence-bank-authoring.md
// says automation cannot do reliably.
const HEADWORD_CLITICS = new Set(["ה", "ו", "ב", "כ", "ל", "מ", "ש"]);

// Comparison form for headword matching: unpointed, unpunctuated, single-spaced,
// with maqaf and dashes treated as word breaks. scripts/content-coverage-report.js
// reads this from here rather than keeping its own copy, because the report and
// the runtime have to agree on what "this sentence uses this word" means.
hebrew.normalizeHeadwordText = hebrew.normalizeHeadwordText || function normalizeHeadwordText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0591-\u05c7]/g, "")
    .replace(/[\u05f4"'\u05f3\u2019.,!?;:()[\]{}]/g, "")
    // Maqaf (U+05BE) is not listed: it falls inside the U+0591-U+05C7 sweep above
    // and is already gone by here. That makes a maqaf compound one token, so a
    // card written with a space cannot match a sentence written with a maqaf —
    // under-reporting, which is the direction this matcher errs in on purpose.
    // Twelve cards and ten sentences use one, and both sides normalize alike.
    .replace(/[\u2013\u2014-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// One already-normalized token against one already-normalized headword part,
// allowing attached clitics. Exposed because an indexed caller has already done
// the normalizing and splitting and only needs this comparison — running the
// full n-gram scan per token instead would re-normalize thousands of times.
hebrew.headwordSurfaceMatches = hebrew.headwordSurfaceMatches || headwordSurfaceMatches;

function headwordSurfaceMatches(surface, headword) {
  if (surface === headword) return true;
  let candidate = surface;
  for (let depth = 0; depth < 3 && candidate.length > headword.length; depth += 1) {
    if (!HEADWORD_CLITICS.has(candidate[0])) break;
    candidate = candidate.slice(1);
    if (candidate === headword) return true;
  }
  return false;
}

// True when `text` contains `headword` as a whole word or n-gram, allowing only
// attached clitics. Deliberately conservative: it will not match an inflected or
// construct form, so it under-reports rather than claiming a relationship that is
// not there.
hebrew.textContainsHeadword = hebrew.textContainsHeadword || function textContainsHeadword(text, headword) {
  const words = hebrew.normalizeHeadwordText(text).split(" ").filter(Boolean);
  const headwordWords = hebrew.normalizeHeadwordText(headword).split(" ").filter(Boolean);
  if (!headwordWords.length || words.length < headwordWords.length) return false;
  for (let start = 0; start <= words.length - headwordWords.length; start += 1) {
    if (headwordWords.every((word, offset) => headwordSurfaceMatches(words[start + offset], word))) {
      return true;
    }
  }
  return false;
};

// The first normalized word of a headword, so a caller can index headwords and
// test only the plausible candidates for a given position instead of every card.
// Matching 1,254 sentences against 2,206 cards naively is 2.8M n-gram checks;
// indexed it is a few thousand and runs in single-digit milliseconds.
hebrew.headwordIndexKeys = hebrew.headwordIndexKeys || function headwordIndexKeys(surface) {
  const keys = [surface];
  let candidate = surface;
  for (let depth = 0; depth < 3 && candidate.length > 1; depth += 1) {
    if (!HEADWORD_CLITICS.has(candidate[0])) break;
    candidate = candidate.slice(1);
    keys.push(candidate);
  }
  return keys;
};

hebrew.applyFallbackNiqqud = hebrew.applyFallbackNiqqud || function applyFallbackNiqqud(text) {
  return String(text || "");
};

hebrew.collectTokenVariants = hebrew.collectTokenVariants || function collectTokenVariants(plain, marked, tokenVariants) {
  const plainParts = splitHebrewParts(plain);
  const markedParts = splitHebrewParts(marked);
  if (plainParts.length !== markedParts.length) return;

  for (let i = 0; i < plainParts.length; i += 1) {
    const plainToken = plainParts[i];
    const markedToken = markedParts[i];
    if (!isHebrewToken(plainToken) || !isHebrewToken(markedToken)) continue;
    if (hebrew.stripNiqqud(markedToken) !== hebrew.stripNiqqud(plainToken)) continue;

    if (!tokenVariants.has(plainToken)) {
      tokenVariants.set(plainToken, new Map());
    }

    const variants = tokenVariants.get(plainToken);
    variants.set(markedToken, (variants.get(markedToken) || 0) + 1);
  }
};

hebrew.buildNiqqudFromTokens = hebrew.buildNiqqudFromTokens || function buildNiqqudFromTokens(plain, tokenMap) {
  const parts = splitHebrewParts(plain);
  let touched = false;

  const mapped = parts.map((part) => {
    if (!isHebrewToken(part)) return part;
    const replacement = tokenMap.get(part);
    if (!replacement) return part;
    touched = true;
    return replacement;
  });

  return touched ? mapped.join("") : plain;
};

hebrew.normalizeHebrewSofitForms = hebrew.normalizeHebrewSofitForms || function normalizeHebrewSofitForms(text) {
  const chars = String(text || "").normalize("NFC").split("");
  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];
    if (!isHebrewLetter(char)) continue;

    const medial = hebrew.toMedialHebrewLetter(char);
    const atTokenEnd = !hasHebrewLetterAhead(chars, i);
    chars[i] = atTokenEnd && medialToFinal[medial] ? medialToFinal[medial] : medial;
  }
  return chars.join("");
};

hebrew.normalizeGeneratedHebrewForms = hebrew.normalizeGeneratedHebrewForms || function normalizeGeneratedHebrewForms(formMap) {
  const normalized = {};
  Object.entries(formMap || {}).forEach(([key, value]) => {
    normalized[key] = hebrew.normalizeHebrewSofitForms(value);
  });
  return normalized;
};

hebrew.normalizeHebrewToMedial = hebrew.normalizeHebrewToMedial || function normalizeHebrewToMedial(text) {
  return String(text || "")
    .normalize("NFC")
    .split("")
    .map((char) => hebrew.toMedialHebrewLetter(char))
    .join("");
};

hebrew.prepareVocabulary = hebrew.prepareVocabulary || function prepareVocabulary(words) {
  const phraseMap = new Map();
  const tokenVariants = new Map();

  words.forEach((word) => {
    const plain = String(word?.he || "");
    const marked = String(word?.heNiqqud || "");
    if (!plain || !marked || marked === plain) return;

    phraseMap.set(plain, marked);
    if (hebrew.stripNiqqud(marked) === hebrew.stripNiqqud(plain)) {
      hebrew.collectTokenVariants(plain, marked, tokenVariants);
    }
  });

  const tokenMap = new Map();
  tokenVariants.forEach((variantMap, plainToken) => {
    let bestVariant = plainToken;
    let bestCount = 0;
    variantMap.forEach((count, variant) => {
      if (count > bestCount) {
        bestCount = count;
        bestVariant = variant;
      }
    });
    tokenMap.set(plainToken, bestVariant);
  });

  const availabilityDefaults = constants.VOCABULARY_AVAILABILITY_DEFAULTS || {
    translationQuiz: true,
    sentenceHints: true,
  };

  return words.map((word) => {
    const plain = String(word?.he || "");
    const existing = String(word?.heNiqqud || "");
    const english = sanitizeEnglishText(word?.en);
    const availability = normalizeAvailability(word?.availability || availabilityDefaults);

    if (!plain) {
      return { ...word, availability, en: english, heNiqqud: existing || plain };
    }

    if (existing && existing !== plain) {
      return {
        ...word,
        availability,
        en: english,
        heNiqqud: existing,
      };
    }

    let marked = phraseMap.get(plain) || hebrew.buildNiqqudFromTokens(plain, tokenMap);
    if (!marked || hebrew.stripNiqqud(marked) !== hebrew.stripNiqqud(plain)) marked = plain;
    if (marked === plain) marked = hebrew.applyFallbackNiqqud(plain);

    return {
      ...word,
      availability,
      en: english,
      heNiqqud: marked,
    };
  });
};
})(typeof window !== "undefined" ? window : globalThis);

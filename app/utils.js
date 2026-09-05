(function initIvriQuestAppUtils(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const constants = app.constants || {};
const utils = app.utils = app.utils || {};

utils.normalizeVocabularyAvailability = utils.normalizeVocabularyAvailability || function normalizeVocabularyAvailability(availability) {
  const defaults = constants.VOCABULARY_AVAILABILITY_DEFAULTS || {
    translationQuiz: true,
    sentenceHints: true,
  };
  return {
    translationQuiz: availability?.translationQuiz !== false ? defaults.translationQuiz : false,
    sentenceHints: availability?.sentenceHints !== false ? defaults.sentenceHints : false,
  };
};

utils.weightedRandomWord = utils.weightedRandomWord || function weightedRandomWord(weightedItems) {
  if (!weightedItems.length) return null;

  const totalWeight = weightedItems.reduce((sum, item) => sum + Math.max(0, item.weight || 0), 0);
  if (totalWeight <= 0) {
    const idx = Math.floor(Math.random() * weightedItems.length);
    return weightedItems[idx]?.word || null;
  }

  let threshold = Math.random() * totalWeight;
  for (const item of weightedItems) {
    threshold -= Math.max(0, item.weight || 0);
    if (threshold <= 0) {
      return item.word;
    }
  }

  return weightedItems[weightedItems.length - 1]?.word || null;
};

utils.shuffle = utils.shuffle || function shuffle(items) {
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

// A stable string hash, so a mission plan can be rebuilt from a seed string
// rather than stored. FNV-1a.
utils.hashSeed = utils.hashSeed || function hashSeed(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

// mulberry32. Small, fast, and more than good enough to order a nine-item list.
// Exists so plan building is a pure function that tests can drive without
// stubbing Math.random.
utils.seededRandom = utils.seededRandom || function seededRandom(seed) {
  let state = (Number(seed) >>> 0) || 1;
  return function next() {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Accepts either a seed or a live generator, so several draws can share one
// stream and stay deterministic together.
utils.seededShuffle = utils.seededShuffle || function seededShuffle(items, seed) {
  const random = typeof seed === "function" ? seed : utils.seededRandom(seed);
  const arr = [...items];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

utils.normalizeAdaptiveRecord = utils.normalizeAdaptiveRecord || function normalizeAdaptiveRecord(raw) {
  const attempts = Math.max(0, Number(raw?.attempts || 0));
  const correct = Math.max(0, Math.min(attempts, Number(raw?.correct || 0)));
  const explicitMisses = Number(raw?.misses);
  const misses = Number.isFinite(explicitMisses) && explicitMisses >= 0
    ? Math.round(explicitMisses)
    : attempts - correct;
  return {
    attempts,
    correct,
    misses,
    lastSeen: Math.max(0, Number(raw?.lastSeen || 0)),
  };
};

utils.getAdaptiveWeight = utils.getAdaptiveWeight || function getAdaptiveWeight(record) {
  const rec = utils.normalizeAdaptiveRecord(record);
  const accuracy = rec.attempts ? rec.correct / rec.attempts : 0;

  const newBoost = rec.attempts === 0 ? 1.45 : 1;
  const weaknessBoost = 1 + (1 - accuracy) * 0.85;
  const missBoost = 1 + Math.min(3, rec.misses) * 0.5;
  const strengthDamp = rec.attempts >= 6 && accuracy >= 0.9 ? 0.45 : 1;
  const recencyDamp = rec.lastSeen && Date.now() - rec.lastSeen < 10 * 60 * 1000 ? 0.6 : 1;
  const jitter = 0.7 + Math.random() * 0.8;

  return newBoost * weaknessBoost * missBoost * strengthDamp * recencyDamp * jitter;
};

utils.pickWeightedSubset = utils.pickWeightedSubset || function pickWeightedSubset(weightedItems, count) {
  const remaining = [...weightedItems];
  const picked = [];

  while (picked.length < count && remaining.length) {
    const word = utils.weightedRandomWord(remaining);
    if (word === null) break;
    const idx = remaining.findIndex((item) => item.word === word);
    picked.push(word);
    remaining.splice(idx === -1 ? remaining.length - 1 : idx, 1);
  }

  return picked;
};

utils.sanitizeEnglishDisplayText = utils.sanitizeEnglishDisplayText || function sanitizeEnglishDisplayText(text) {
  let cleaned = String(text || "").trim();
  if (!cleaned) return "";
  if (!/[\u0590-\u05FF]/.test(cleaned)) return cleaned;

  cleaned = cleaned
    .replace(/[\u0590-\u05FF]+/g, "")
    .replace(/:\s*,\s*/g, ": ")
    .replace(/\(\s*,\s*/g, "(")
    .replace(/,\s*\)/g, ")")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+\)/g, ")")
    .replace(/\(\s+/g, "(")
    .replace(/\s{2,}/g, " ")
    .trim();

  cleaned = cleaned
    .replace(/\(\s*(?:also|same word as|same as)?\s*:?\s*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

  return cleaned;
};
})(typeof window !== "undefined" ? window : globalThis);

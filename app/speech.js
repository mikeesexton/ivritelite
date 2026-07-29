(function initIvriQuestAppSpeech(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const speech = app.speech = app.speech || {};

function getRuntime() {
  return app.runtime || {};
}

function getSpeechSynthesis() {
  if (!global.speechSynthesis) return null;
  if (typeof global.speechSynthesis.speak !== "function") return null;
  if (typeof global.speechSynthesis.cancel !== "function") return null;
  if (typeof global.speechSynthesis.getVoices !== "function") return null;
  return global.speechSynthesis;
}

function cleanText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

// Carmit, Apple's he-IL voice, can speak a closing ASCII quotation apostrophe
// as its UTF-8 byte escape ("XD7XB3"). Remove paired quotation apostrophes
// from speech text while leaving word-internal loanword marks such as קרינג'
// and פיצ'ר untouched. Displayed text is never changed.
function stripTtsQuotationApostrophes(text) {
  return text.replace(
    /(^|[\s([{\"“])'([^'\n]+)'(?=$|[\s)\]}.,:;!?\"”])/g,
    "$1$2"
  );
}

// Speech-only respellings for correctly pointed words that the he-IL voices
// still misread (kamatz katan spoken as /a/). Applied to the text sent to the
// synthesizer only — displayed niqqud is never changed. Input is normalized to
// NFC first, so the patterns below are written in NFC mark order (vowel before
// dagesh) with escapes: ְ-ּׁׂ = points/dagesh/shin dots,
// ָ = kamatz, ֹ = cholam, ּ = dagesh.
const TTS_RESPELLINGS = [
  // Final ץ׳ marks /tsh/ in the camp farewell פאטוץ׳. Spell the affricate
  // phonetically so the Hebrew voice does not pronounce the punctuation.
  {
    pattern: /פָּאטוּץ['׳](?=$|[\s־.,:;!?)"'])/g,
    replacement: "פָּאטוּטְשׁ",
  },
  {
    pattern: /פאטוץ['׳](?=$|[\s־.,:;!?)"'])/g,
    replacement: "פָּאטוּטְשׁ",
  },
  // Word-final צ' marks /tsh/ in loanwords, but Apple's he-IL voice can read
  // the punctuation itself. Spell brunch phonetically for speech only.
  {
    pattern: /בְּרַנְץ['׳](?=$|[\s־.,:;!?)"'])/g,
    replacement: "בְּרַנְטְשׁ",
  },
  // Some he-IL voices misread the Pu'al kubutz in שֻׁלַּם. A speech-only
  // shuruk preserves the intended shulam pronunciation.
  {
    pattern: /שֻׁלַּם(?=$|[\s־.,:;!?)"'])/g,
    replacement: "שׁוּלַּם",
  },
  // Standalone כָּל/כָל (kol), with optional attached prefixes (וְ, בְּ, לְ,
  // כְּ, שֶׁ, מִ, הַ and combinations): kamatz katan → cholam, e.g. וְכָל → וְכֹל.
  // The lookahead keeps longer words such as כָּלָה or מִיכָל untouched.
  {
    pattern: /(^|[\s־("'])((?:[ובלכשמה][ְ-ּׁׂ]{0,2}){0,3})כָ(ּ?)ל(?=$|[\s־.,:;!?)"'])/g,
    replacement: "$1$2כֹ$3ל",
  },
  // תָּכְנִית family (tokhnit): kamatz katan → cholam male, e.g. תָּכְנִית → תּוֹכְנִית.
  {
    pattern: /תָ(ּ?)כְנִ/g,
    replacement: "ת$1וֹכְנִ",
  },
  // חָכְמָה (chokhmah): kamatz katan → cholam male. Without this the he-IL
  // voices read the sefirah as chakhmah.
  {
    pattern: /חָכְמ/g,
    replacement: "חוֹכְמ",
  },
  // Word-final vav after kamatz is consonantal /v/, but the he-IL voices read
  // it as the vowel /u/ — עַכְשָׁו comes out "achshau". A final bet (rafe, as in
  // רַב) spells the /v/ unambiguously for speech only.
  {
    pattern: /עַכְשָׁו(?=$|[\s־.,:;!?)"'])/g,
    replacement: "עַכְשָׁב",
  },
  {
    pattern: /(^|[\s־("'])עכשיו(?=$|[\s־.,:;!?)"'])/g,
    replacement: "$1עַכְשָׁב",
  },
  // Word-initial אָזְנ (ozen family): kamatz katan → cholam male,
  // e.g. אָזְנַיִם → אוֹזְנַיִם.
  {
    pattern: /(^|[\s־("'])אָזְנ/g,
    replacement: "$1אוֹזְנ",
  },
  // A vav that carries both a vowel and a dagesh is a doubled consonantal /v/
  // (בַּוַּעֲדָה, צַוַּאר), but the he-IL voices read the geminate as /w/ —
  // "ba-waada". Dropping the dagesh keeps the same letter and vowel and leaves
  // the vav unambiguously consonantal. The vowel between ו and the dagesh is
  // what separates these from shuruk (וּ), which must stay untouched.
  {
    pattern: /\u05d5([\u05b0-\u05b8\u05bb\u05c7])\u05bc/g,
    replacement: "ו$1",
  },
  // Kamatz directly before a chataf-kamatz syllable is always kamatz katan
  // (e.g. צָהֳרַיִם → צֹהֳרַיִם); the lookahead skips an intervening dagesh.
  {
    pattern: /ָ(?=ּ?[א-ת]ֳ)/g,
    replacement: "ֹ",
  },
];

function containsHebrew(text) {
  return /[\u0590-\u05FF]/.test(String(text || ""));
}

function getVoiceCache() {
  const runtime = getRuntime();
  if (!Array.isArray(runtime.speechVoiceCache)) {
    runtime.speechVoiceCache = [];
  }
  return runtime.speechVoiceCache;
}

function loadVoices() {
  const synth = getSpeechSynthesis();
  if (!synth) return [];

  try {
    const voices = synth.getVoices().filter(Boolean);
    getRuntime().speechVoiceCache = voices;
    return voices;
  } catch {
    getRuntime().speechVoiceCache = [];
    return [];
  }
}

speech.applyTtsRespellings = speech.applyTtsRespellings || function applyTtsRespellings(text) {
  const speechText = stripTtsQuotationApostrophes(String(text || "").normalize("NFC"));
  return TTS_RESPELLINGS.reduce(
    (result, rule) => result.replace(rule.pattern, rule.replacement),
    speechText
  );
};

speech.buildHebrewSpeechText = speech.buildHebrewSpeechText || function buildHebrewSpeechText(options = {}) {
  const overrideNiqqud = cleanText(options.speechOverrideNiqqud);
  if (overrideNiqqud) return speech.applyTtsRespellings(overrideNiqqud);

  const overridePlain = cleanText(options.speechOverridePlain);
  if (overridePlain) return speech.applyTtsRespellings(overridePlain);

  const niqqud = cleanText(options.niqqud);
  if (niqqud) return speech.applyTtsRespellings(niqqud);

  return speech.applyTtsRespellings(cleanText(options.plain));
};

speech.buildSpeechPayload = speech.buildSpeechPayload || function buildSpeechPayload(options = {}) {
  const text = speech.buildHebrewSpeechText(options);
  if (!text || !containsHebrew(text)) return null;

  return {
    text,
    lang: "he-IL",
    source: options.source === "prompt" ? "prompt" : "answer",
    cacheKey: `${options.source === "prompt" ? "prompt" : "answer"}:${text}`,
  };
};

speech.primeVoices = speech.primeVoices || function primeVoices() {
  const runtime = getRuntime();
  const synth = getSpeechSynthesis();
  if (!synth) {
    runtime.speechVoiceCache = [];
    return [];
  }

  const refreshVoices = () => {
    loadVoices();
    runtime.helpers?.renderAll?.();
    return getVoiceCache();
  };

  if (!runtime.speechVoicesListenerAttached && typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", refreshVoices);
    runtime.speechVoicesListenerAttached = true;
  }

  return refreshVoices();
};

speech.getHebrewVoice = speech.getHebrewVoice || function getHebrewVoice() {
  const voices = getVoiceCache().length ? getVoiceCache() : loadVoices();
  return voices.find((voice) => /^he(?:-|$)/i.test(String(voice?.lang || "").trim())) || null;
};

speech.isSupported = speech.isSupported || function isSupported() {
  if (typeof global.SpeechSynthesisUtterance !== "function") return false;
  return Boolean(speech.getHebrewVoice());
};

speech.isEnabled = speech.isEnabled || function isEnabled() {
  return Boolean(getRuntime().state?.speech?.enabled);
};

speech.cancel = speech.cancel || function cancel() {
  const synth = getSpeechSynthesis();
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    // Ignore browser speech cancellation failures.
  }
};

speech.speak = speech.speak || function speak(payload, options = {}) {
  const runtime = getRuntime();
  if (!speech.isEnabled() && options.force !== true) return false;
  if (runtime.helpers?.isUiLocked?.()) return false;
  if (!payload || !payload.text) return false;
  if (!speech.isSupported()) return false;

  const synth = getSpeechSynthesis();
  const voice = speech.getHebrewVoice();
  if (!synth || !voice) return false;

  let utterance = null;
  try {
    utterance = new global.SpeechSynthesisUtterance(payload.text);
  } catch {
    return false;
  }

  utterance.lang = payload.lang || "he-IL";
  utterance.voice = voice;
  const rate = Number(options.rate);
  if (Number.isFinite(rate) && rate > 0) {
    utterance.rate = rate;
  }

  speech.cancel();

  try {
    synth.speak(utterance);
    return true;
  } catch {
    return false;
  }
};
})(typeof window !== "undefined" ? window : globalThis);

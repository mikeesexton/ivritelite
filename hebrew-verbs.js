(function initIvriQuestHebrewVerbs(root, factory) {
"use strict";

const api = factory();

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

if (root) {
  root.IvriQuestHebrewVerbs = api;
}
})(typeof globalThis !== "undefined" ? globalThis : this, function createIvriQuestHebrewVerbs() {
"use strict";

/**
 * @typedef {{
 *   gloss: string,
 *   usage_pattern: string | null,
 *   safe_for_generation: boolean,
 * }} VerbSense
 *
 * @typedef {{
 *   present?: Record<string, string | {plain: string, niqqud?: string}>,
 *   past?: Record<string, string | {plain: string, niqqud?: string}>,
 *   future?: Record<string, string | {plain: string, niqqud?: string}>,
 *   imperative?: Record<string, string | {plain: string, niqqud?: string}>,
 * }} VerbFormSet
 *
 * @typedef {{
 *   id: string,
 *   lemma: string,
 *   lemma_niqqud?: string,
 *   root: string[] | null,
 *   binyan: string | null,
 *   regularity: "regular" | "irregular" | "ambiguous" | "phrase",
 *   conjugation_mode: "generated" | "curated" | "phrase_only" | "blocked",
 *   senses: VerbSense[],
 *   usage_pattern: string | null,
 *   forms: VerbFormSet,
 *   generated_forms: VerbFormSet,
 *   review_status: "unreviewed" | "approved" | "edited" | "rejected",
 *   notes: string,
 *   examples: Array<Record<string, unknown>>,
 *   difficulty_level: number,
 *   tags: string[],
 *   personal_priority: number,
 *   category: string,
 *   source_word_ids: string[],
 *   availability: { translationQuiz: boolean, sentenceHints: boolean },
 *   source: string,
 *   generation_pattern: string | null,
 * }} VerbEntry
 */

const MODERN_MATCH_FORM_ORDER = [
  { id: "present_masculine_singular", tense: "present", slot: "masculine_singular" },
  { id: "past_first_person_singular", tense: "past", slot: "first_person_singular" },
  { id: "future_first_person_singular", tense: "future", slot: "first_person_singular" },
  { id: "present_feminine_singular", tense: "present", slot: "feminine_singular" },
  { id: "past_third_person_masculine_singular", tense: "past", slot: "third_person_masculine_singular" },
  { id: "future_third_person_masculine_singular", tense: "future", slot: "third_person_masculine_singular" },
  { id: "present_masculine_plural", tense: "present", slot: "masculine_plural" },
  { id: "past_third_person_feminine_singular", tense: "past", slot: "third_person_feminine_singular" },
  { id: "future_third_person_feminine_singular", tense: "future", slot: "third_person_feminine_singular" },
  { id: "present_feminine_plural", tense: "present", slot: "feminine_plural" },
  { id: "past_first_person_plural", tense: "past", slot: "first_person_plural" },
  { id: "future_first_person_plural", tense: "future", slot: "first_person_plural" },
  { id: "past_second_person_masculine_singular", tense: "past", slot: "second_person_masculine_singular" },
  { id: "future_second_person_masculine_singular", tense: "future", slot: "second_person_masculine_singular" },
  { id: "past_second_person_feminine_singular", tense: "past", slot: "second_person_feminine_singular" },
  { id: "future_second_person_feminine_singular", tense: "future", slot: "second_person_feminine_singular" },
  { id: "past_second_person_masculine_plural", tense: "past", slot: "second_person_masculine_plural" },
  { id: "future_second_person_plural", tense: "future", slot: "second_person_plural" },
  { id: "past_second_person_feminine_plural", tense: "past", slot: "second_person_feminine_plural" },
  { id: "past_third_person_plural", tense: "past", slot: "third_person_plural" },
  { id: "future_third_person_plural", tense: "future", slot: "third_person_plural" },
];

const FORMAL_FUTURE_FORM_ORDER = [
  { id: "future_second_person_feminine_plural", tense: "future", slot: "second_person_feminine_plural" },
  { id: "future_third_person_feminine_plural", tense: "future", slot: "third_person_feminine_plural" },
];

// Modern learner-facing imperative drills collapse plural gender to the shared plural form.
const IMPERATIVE_FORM_ORDER = [
  { id: "imperative_second_person_masculine_singular", tense: "imperative", slot: "second_person_masculine_singular" },
  { id: "imperative_second_person_feminine_singular", tense: "imperative", slot: "second_person_feminine_singular" },
  { id: "imperative_second_person_plural", tense: "imperative", slot: "second_person_plural" },
];

const AVAILABILITY_DEFAULTS = Object.freeze({
  translationQuiz: true,
  sentenceHints: true,
});

const RECOGNIZED_REGULARITY = new Set(["regular", "irregular", "ambiguous", "phrase"]);
const RECOGNIZED_CONJUGATION_MODES = new Set(["generated", "curated", "phrase_only", "blocked"]);
const RECOGNIZED_REVIEW_STATUS = new Set(["unreviewed", "approved", "edited", "rejected"]);
const STRONG_ROOT_WEAK_LETTERS = new Set(["א", "ה", "ו", "י"]);
const BLOCKED_GLOSSES = new Set(["to be honest"]);
const KNOWN_AMBIGUOUS_LEMMAS = new Set(["לצפות"]);
const HEBREW_FINAL_TO_MEDIAL = Object.freeze({
  ך: "כ",
  ם: "מ",
  ן: "נ",
  ף: "פ",
  ץ: "צ",
});
const HEBREW_MEDIAL_TO_FINAL = Object.freeze({
  כ: "ך",
  מ: "ם",
  נ: "ן",
  פ: "ף",
  צ: "ץ",
});
const KNOWN_CURATED_LEMMAS = new Map([
  ["לבוא", { root: ["ב", "ו", "א"], binyan: "paal", difficulty_level: 4 }],
  ["להיות", { root: ["ה", "י", "ה"], binyan: "paal", difficulty_level: 5 }],
  ["לראות", { root: ["ר", "א", "ה"], binyan: "paal", difficulty_level: 4 }],
  ["לקחת", { root: ["ל", "ק", "ח"], binyan: "paal", difficulty_level: 4 }],
  ["לשים", { root: ["ש", "י", "ם"], binyan: "paal", difficulty_level: 4 }],
  ["לתת", { root: ["נ", "ת", "נ"], binyan: "paal", difficulty_level: 5 }],
  ["ללכת", { root: ["ה", "ל", "כ"], binyan: "paal", difficulty_level: 4 }],
  ["להגיד", { root: ["נ", "ג", "ד"], binyan: "hifil", difficulty_level: 4 }],
  ["לעמוד", { root: ["ע", "מ", "ד"], binyan: "paal", difficulty_level: 3 }],
  ["לשבת", { root: ["י", "ש", "ב"], binyan: "paal", difficulty_level: 3 }],
]);

const SAFE_GENERATION_OVERRIDES = new Map([
  ["לתבל", {
    root: ["ת", "ב", "ל"],
    binyan: "piel",
    personal_priority: 85,
    imperative: makeImperative(
      markedForm("תבל", "תַּבֵּל"),
      markedForm("תבלי", "תַּבְּלִי"),
      markedForm("תבלו", "תַּבְּלוּ")
    ),
  }],
  ["לקפל", {
    root: ["ק", "פ", "ל"],
    binyan: "piel",
    personal_priority: 80,
    imperative: makeImperative(
      markedForm("קפל", "קַפֵּל"),
      markedForm("קפלי", "קַפְּלִי"),
      markedForm("קפלו", "קַפְּלוּ")
    ),
  }],
  ["לקשט", {
    root: ["ק", "ש", "ט"],
    binyan: "piel",
    personal_priority: 76,
    imperative: makeImperative(
      markedForm("קשט", "קַשֵּׁט"),
      markedForm("קשטי", "קַשְּׁטִי"),
      markedForm("קשטו", "קַשְּׁטוּ")
    ),
  }],
  ["לדלל", {
    root: ["ד", "ל", "ל"],
    binyan: "piel",
    personal_priority: 74,
    imperative: makeImperative(
      markedForm("דלל", "דַּלֵּל"),
      markedForm("דללי", "דַּלְּלִי"),
      markedForm("דללו", "דַּלְּלוּ")
    ),
  }],
  ["לסנן", {
    root: ["ס", "נ", "נ"],
    binyan: "piel",
    personal_priority: 78,
    imperative: makeImperative(
      markedForm("סנן", "סַנֵּן"),
      markedForm("סנני", "סַנְּנִי"),
      markedForm("סננו", "סַנְּנוּ")
    ),
  }],
  ["לקרר", {
    root: ["ק", "ר", "ר"],
    binyan: "piel",
    personal_priority: 73,
    imperative: makeImperative(
      markedForm("קרר", "קָרֵר"),
      markedForm("קררי", "קָרְרִי"),
      markedForm("קררו", "קָרְרוּ")
    ),
  }],
  ["לרפד", { root: ["ר", "פ", "ד"], binyan: "piel", personal_priority: 71 }],
  ["להסמיך", {
    root: ["ס", "מ", "כ"],
    binyan: "hifil",
    personal_priority: 70,
    imperative: makeImperative(
      markedForm("הסמך", "הַסְמֵךְ"),
      markedForm("הסמיכי", "הַסְמִיכִי"),
      markedForm("הסמיכו", "הַסְמִיכוּ")
    ),
  }],
  ["להרתיח", {
    root: ["ר", "ת", "ח"],
    binyan: "hifil",
    personal_priority: 79,
    imperative: makeImperative(
      markedForm("הרתח", "הַרְתֵּחַ"),
      markedForm("הרתיחי", "הַרְתִּיחִי"),
      markedForm("הרתיחו", "הַרְתִּיחוּ")
    ),
  }],
]);

const TRANSLATION_HIDDEN_STARTER_VERB_IDS = new Set([
  "starter-verb-liftoach",
  "starter-verb-lisgor",
  "starter-verb-lilmod",
  "starter-verb-lesachek",
  "starter-verb-laavod",
  "starter-verb-lagur",
  "starter-verb-larutz",
  "starter-verb-lirkhosh",
  "starter-verb-lavo",
  "starter-verb-lihyot",
  "starter-verb-lirot",
  "starter-verb-lakachat",
  "starter-verb-lasim",
  "starter-verb-latet",
  "starter-verb-lashevet",
  "starter-verb-lalechet",
  "starter-verb-lehagid",
  "starter-verb-laamod",
  "starter-verb-leechol",
  "starter-verb-lishtot",
  "starter-verb-lichtov",
  "starter-verb-letachnen",
  "advanced-verb-lehochiach",
  "advanced-verb-letaken",
  "starter-verb-lishmor",
  "starter-verb-leshacharer",
  "starter-verb-lekhabot",
  "starter-verb-letzanen",
  "advanced-verb-lehishtamesh",
]);

function normalizeAvailability(availability) {
  return {
    translationQuiz: availability?.translationQuiz !== false,
    sentenceHints: availability?.sentenceHints !== false,
  };
}

function mergeAvailability(current, incoming) {
  const left = normalizeAvailability(current || AVAILABILITY_DEFAULTS);
  const right = normalizeAvailability(incoming || AVAILABILITY_DEFAULTS);
  return {
    translationQuiz: left.translationQuiz && right.translationQuiz,
    sentenceHints: left.sentenceHints || right.sentenceHints,
  };
}

function getStarterVerbAvailability(id) {
  return TRANSLATION_HIDDEN_STARTER_VERB_IDS.has(id)
    ? { translationQuiz: false, sentenceHints: true }
    : AVAILABILITY_DEFAULTS;
}

function makePresent(ms, fs, mp, fp) {
  return {
    masculine_singular: ms,
    feminine_singular: fs,
    masculine_plural: mp,
    feminine_plural: fp,
  };
}

function makePast(firstPersonSingular, secondMasculineSingular, secondFeminineSingular, thirdMasculineSingular, thirdFeminineSingular, firstPersonPlural, secondMasculinePlural, secondFemininePlural, thirdPlural) {
  return {
    first_person_singular: firstPersonSingular,
    second_person_masculine_singular: secondMasculineSingular,
    second_person_feminine_singular: secondFeminineSingular,
    third_person_masculine_singular: thirdMasculineSingular,
    third_person_feminine_singular: thirdFeminineSingular,
    first_person_plural: firstPersonPlural,
    second_person_masculine_plural: secondMasculinePlural,
    second_person_feminine_plural: secondFemininePlural,
    third_person_plural: thirdPlural,
  };
}

function makeFuture(firstPersonSingular, secondMasculineSingular, secondFeminineSingular, thirdMasculineSingular, thirdFeminineSingular, firstPersonPlural, secondPersonPlural, thirdPersonPlural, secondFemininePlural, thirdFemininePlural) {
  const future = {
    first_person_singular: firstPersonSingular,
    second_person_masculine_singular: secondMasculineSingular,
    second_person_feminine_singular: secondFeminineSingular,
    third_person_masculine_singular: thirdMasculineSingular,
    third_person_feminine_singular: thirdFeminineSingular,
    first_person_plural: firstPersonPlural,
    second_person_plural: secondPersonPlural,
    third_person_plural: thirdPersonPlural,
  };

  if (secondFemininePlural) {
    future.second_person_feminine_plural = secondFemininePlural;
  }
  if (thirdFemininePlural) {
    future.third_person_feminine_plural = thirdFemininePlural;
  }

  return future;
}

function makeImperative(secondMasculineSingular, secondFeminineSingular, secondPersonPlural) {
  return {
    second_person_masculine_singular: secondMasculineSingular,
    second_person_feminine_singular: secondFeminineSingular,
    second_person_plural: secondPersonPlural,
  };
}

function markedForm(plain, niqqud) {
  return { plain, niqqud };
}

function makeForms(present, past, future, imperative) {
  const forms = {};
  if (present) forms.present = present;
  if (past) forms.past = past;
  if (future) forms.future = future;
  if (imperative) forms.imperative = imperative;
  return forms;
}

function makeSense(gloss, usagePattern, safeForGeneration) {
  return {
    gloss,
    usage_pattern: usagePattern || null,
    safe_for_generation: Boolean(safeForGeneration),
  };
}

function createVerbEntry(config) {
  const senses = Array.isArray(config?.senses) && config.senses.length
    ? config.senses.map((sense) => ({
        gloss: String(sense?.gloss || "").trim(),
        usage_pattern: sense?.usage_pattern || null,
        safe_for_generation: Boolean(sense?.safe_for_generation),
      }))
    : [makeSense(String(config?.gloss || "").trim(), config?.usage_pattern || null, config?.safe_for_generation)];

  return {
    id: String(config?.id || slugifyHebrewId(config?.lemma || config?.gloss || "verb")),
    lemma: String(config?.lemma || "").trim(),
    lemma_niqqud: String(config?.lemma_niqqud || config?.lemmaNiqqud || "").trim(),
    root: Array.isArray(config?.root) ? cloneData(config.root) : null,
    binyan: config?.binyan || null,
    regularity: RECOGNIZED_REGULARITY.has(config?.regularity) ? config.regularity : "regular",
    conjugation_mode: RECOGNIZED_CONJUGATION_MODES.has(config?.conjugation_mode) ? config.conjugation_mode : "blocked",
    senses,
    usage_pattern: config?.usage_pattern || deriveSharedUsagePattern(senses),
    forms: cloneData(config?.forms || {}),
    generated_forms: cloneData(config?.generated_forms || {}),
    review_status: RECOGNIZED_REVIEW_STATUS.has(config?.review_status) ? config.review_status : "unreviewed",
    notes: String(config?.notes || ""),
    examples: Array.isArray(config?.examples) ? cloneData(config.examples) : [],
    difficulty_level: clampNumber(config?.difficulty_level, 1, 5, 3),
    tags: Array.isArray(config?.tags) ? config.tags.map((tag) => String(tag || "").trim()).filter(Boolean) : [],
    personal_priority: clampNumber(config?.personal_priority, 1, 100, 60),
    category: String(config?.category || "core_advanced"),
    source_word_ids: Array.isArray(config?.source_word_ids)
      ? config.source_word_ids.map((id) => String(id || "").trim()).filter(Boolean)
      : [],
    availability: normalizeAvailability(config?.availability || AVAILABILITY_DEFAULTS),
    source: String(config?.source || "hebrew-verb"),
    generation_pattern: config?.generation_pattern || null,
  };
}

function buildStarterVerbEntries() {
  return [
    createVerbEntry({
      id: "starter-verb-lisgor",
      availability: getStarterVerbAvailability("starter-verb-lisgor"),
      lemma: "לסגור",
      lemma_niqqud: "לִסְגּוֹר",
      root: ["ס", "ג", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to close", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("סוגר", "סוֹגֵר"),
          markedForm("סוגרת", "סוֹגֶרֶת"),
          markedForm("סוגרים", "סוֹגְרִים"),
          markedForm("סוגרות", "סוֹגְרוֹת")
        ),
        makePast(
          markedForm("סגרתי", "סָגַרְתִּי"),
          markedForm("סגרת", "סָגַרְתָּ"),
          markedForm("סגרת", "סָגַרְתְּ"),
          markedForm("סגר", "סָגַר"),
          markedForm("סגרה", "סָגְרָה"),
          markedForm("סגרנו", "סָגַרְנוּ"),
          markedForm("סגרתם", "סְגַרְתֶּם"),
          markedForm("סגרתן", "סְגַרְתֶּן"),
          markedForm("סגרו", "סָגְרוּ")
        ),
        makeFuture(
          markedForm("אסגור", "אֶסְגּוֹר"),
          markedForm("תסגור", "תִּסְגּוֹר"),
          markedForm("תסגרי", "תִּסְגְּרִי"),
          markedForm("יסגור", "יִסְגּוֹר"),
          markedForm("תסגור", "תִּסְגּוֹר"),
          markedForm("נסגור", "נִסְגּוֹר"),
          markedForm("תסגרו", "תִּסְגְּרוּ"),
          markedForm("יסגרו", "יִסְגְּרוּ")
        ),
        makeImperative(
          markedForm("סגר", "סְגֹר"),
          markedForm("סגרי", "סִגְרִי"),
          markedForm("סגרו", "סִגְרוּ"),
          markedForm("סגרנה", "סְגֹרְנָה")
        )
      ),
      review_status: "approved",
      notes: "Authoritative stored forms override generation.",
      difficulty_level: 1,
      tags: ["starter", "seed", "regular"],
      personal_priority: 95,
      generation_pattern: "paal_o",
    }),
    createVerbEntry({
      id: "starter-verb-liftoach",
      availability: getStarterVerbAvailability("starter-verb-liftoach"),
      lemma: "לפתוח",
      lemma_niqqud: "לִפְתּוֹחַ",
      root: ["פ", "ת", "ח"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to open", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("פותח", "פּוֹתֵחַ"),
          markedForm("פותחת", "פּוֹתַחַת"),
          markedForm("פותחים", "פּוֹתְחִים"),
          markedForm("פותחות", "פּוֹתְחוֹת")
        ),
        makePast(
          markedForm("פתחתי", "פָּתַחְתִּי"),
          markedForm("פתחת", "פָּתַחְתָּ"),
          markedForm("פתחת", "פָּתַחְתְּ"),
          markedForm("פתח", "פָּתַח"),
          markedForm("פתחה", "פָּתְחָה"),
          markedForm("פתחנו", "פָּתַחְנוּ"),
          markedForm("פתחתם", "פְּתַחְתֶּם"),
          markedForm("פתחתן", "פְּתַחְתֶּן"),
          markedForm("פתחו", "פָּתְחוּ")
        ),
        makeFuture(
          markedForm("אפתח", "אֶפְתַּח"),
          markedForm("תפתח", "תִּפְתַּח"),
          markedForm("תפתחי", "תִּפְתְּחִי"),
          markedForm("יפתח", "יִפְתַּח"),
          markedForm("תפתח", "תִּפְתַּח"),
          markedForm("נפתח", "נִפְתַּח"),
          markedForm("תפתחו", "תִּפְתְּחוּ"),
          markedForm("יפתחו", "יִפְתְּחוּ")
        ),
        makeImperative(
          markedForm("פתח", "פְּתַח"),
          markedForm("פתחי", "פִּתְחִי"),
          markedForm("פתחו", "פִּתְחוּ"),
          markedForm("פתחנה", "פְּתַחְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 1,
      tags: ["starter", "seed", "regular"],
      personal_priority: 94,
    }),
    createVerbEntry({
      id: "starter-verb-lichtov",
      availability: getStarterVerbAvailability("starter-verb-lichtov"),
      lemma: "לכתוב",
      lemma_niqqud: "לִכְתּוֹב",
      root: ["כ", "ת", "ב"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to write", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("כותב", "כּוֹתֵב"),
          markedForm("כותבת", "כּוֹתֶבֶת"),
          markedForm("כותבים", "כּוֹתְבִים"),
          markedForm("כותבות", "כּוֹתְבוֹת")
        ),
        makePast(
          markedForm("כתבתי", "כָּתַבְתִּי"),
          markedForm("כתבת", "כָּתַבְתָּ"),
          markedForm("כתבת", "כָּתַבְתְּ"),
          markedForm("כתב", "כָּתַב"),
          markedForm("כתבה", "כָּתְבָה"),
          markedForm("כתבנו", "כָּתַבְנוּ"),
          markedForm("כתבתם", "כְּתַבְתֶּם"),
          markedForm("כתבתן", "כְּתַבְתֶּן"),
          markedForm("כתבו", "כָּתְבוּ")
        ),
        makeFuture(
          markedForm("אכתוב", "אֶכְתֹּב"),
          markedForm("תכתוב", "תִּכְתֹּב"),
          markedForm("תכתבי", "תִּכְתְּבִי"),
          markedForm("יכתוב", "יִכְתֹּב"),
          markedForm("תכתוב", "תִּכְתֹּב"),
          markedForm("נכתוב", "נִכְתֹּב"),
          markedForm("תכתבו", "תִּכְתְּבוּ"),
          markedForm("יכתבו", "יִכְתְּבוּ")
        ),
        makeImperative(
          markedForm("כתב", "כְּתֹב"),
          markedForm("כתבי", "כִּתְבִי"),
          markedForm("כתבו", "כִּתְבוּ"),
          markedForm("כתבנה", "כְּתֹבְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 2,
      tags: ["starter", "seed", "regular"],
      personal_priority: 93,
    }),
    createVerbEntry({
      id: "starter-verb-lishmor",
      availability: getStarterVerbAvailability("starter-verb-lishmor"),
      lemma: "לשמור",
      lemma_niqqud: "לִשְׁמוֹר",
      root: ["ש", "מ", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to keep", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("שומר", "שׁוֹמֵר"),
          markedForm("שומרת", "שׁוֹמֶרֶת"),
          markedForm("שומרים", "שׁוֹמְרִים"),
          markedForm("שומרות", "שׁוֹמְרוֹת")
        ),
        makePast(
          markedForm("שמרתי", "שָׁמַרְתִּי"),
          markedForm("שמרת", "שָׁמַרְתָּ"),
          markedForm("שמרת", "שָׁמַרְתְּ"),
          markedForm("שמר", "שָׁמַר"),
          markedForm("שמרה", "שָׁמְרָה"),
          markedForm("שמרנו", "שָׁמַרְנוּ"),
          markedForm("שמרתם", "שְׁמַרְתֶּם"),
          markedForm("שמרתן", "שְׁמַרְתֶּן"),
          markedForm("שמרו", "שָׁמְרוּ")
        ),
        makeFuture(
          markedForm("אשמור", "אֶשְׁמֹר"),
          markedForm("תשמור", "תִּשְׁמֹר"),
          markedForm("תשמרי", "תִּשְׁמְרִי"),
          markedForm("ישמור", "יִשְׁמֹר"),
          markedForm("תשמור", "תִּשְׁמֹר"),
          markedForm("נשמור", "נִשְׁמֹר"),
          markedForm("תשמרו", "תִּשְׁמְרוּ"),
          markedForm("ישמרו", "יִשְׁמְרוּ")
        ),
        makeImperative(
          markedForm("שמר", "שְׁמֹר"),
          markedForm("שמרי", "שִׁמְרִי"),
          markedForm("שמרו", "שִׁמְרוּ"),
          markedForm("שמרנה", "שְׁמֹרְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 1,
      tags: ["starter", "seed", "regular"],
      personal_priority: 92,
      generation_pattern: "paal_o",
    }),
    createVerbEntry({
      id: "starter-verb-lilmod",
      availability: getStarterVerbAvailability("starter-verb-lilmod"),
      lemma: "ללמוד",
      lemma_niqqud: "לִלְמֹד",
      root: ["ל", "מ", "ד"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to study", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("לומד", "לוֹמֵד"),
          markedForm("לומדת", "לוֹמֶדֶת"),
          markedForm("לומדים", "לוֹמְדִים"),
          markedForm("לומדות", "לוֹמְדוֹת")
        ),
        makePast(
          markedForm("למדתי", "לָמַדְתִּי"),
          markedForm("למדת", "לָמַדְתָּ"),
          markedForm("למדת", "לָמַדְתְּ"),
          markedForm("למד", "לָמַד"),
          markedForm("למדה", "לָמְדָה"),
          markedForm("למדנו", "לָמַדְנוּ"),
          markedForm("למדתם", "לְמַדְתֶּם"),
          markedForm("למדתן", "לְמַדְתֶּן"),
          markedForm("למדו", "לָמְדוּ")
        ),
        makeFuture(
          markedForm("אלמד", "אֶלְמַד"),
          markedForm("תלמד", "תִּלְמַד"),
          markedForm("תלמדי", "תִּלְמְדִי"),
          markedForm("ילמד", "יִלְמַד"),
          markedForm("תלמד", "תִּלְמַד"),
          markedForm("נלמד", "נִלְמַד"),
          markedForm("תלמדו", "תִּלְמְדוּ"),
          markedForm("ילמדו", "יִלְמְדוּ")
        ),
        makeImperative(
          markedForm("למד", "לְמַד"),
          markedForm("למדי", "לִמְדִי"),
          markedForm("למדו", "לִמְדוּ"),
          markedForm("למדנה", "לְמַדְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 2,
      tags: ["starter", "seed", "regular"],
      personal_priority: 91,
    }),
    createVerbEntry({
      id: "starter-verb-leechol",
      availability: getStarterVerbAvailability("starter-verb-leechol"),
      lemma: "לאכול",
      lemma_niqqud: "לֶאֱכֹל",
      root: ["א", "כ", "ל"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to eat", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("אוכל", "אוֹכֵל"),
          markedForm("אוכלת", "אוֹכֶלֶת"),
          markedForm("אוכלים", "אוֹכְלִים"),
          markedForm("אוכלות", "אוֹכְלוֹת")
        ),
        makePast(
          markedForm("אכלתי", "אָכַלְתִּי"),
          markedForm("אכלת", "אָכַלְתָּ"),
          markedForm("אכלת", "אָכַלְתְּ"),
          markedForm("אכל", "אָכַל"),
          markedForm("אכלה", "אָכְלָה"),
          markedForm("אכלנו", "אָכַלְנוּ"),
          markedForm("אכלתם", "אֲכַלְתֶּם"),
          markedForm("אכלתן", "אֲכַלְתֶּן"),
          markedForm("אכלו", "אָכְלוּ")
        ),
        makeFuture(
          markedForm("אוכל", "אֹכַל"),
          markedForm("תאכל", "תֹּאכַל"),
          markedForm("תאכלי", "תֹּאכְלִי"),
          markedForm("יאכל", "יֹאכַל"),
          markedForm("תאכל", "תֹּאכַל"),
          markedForm("נאכל", "נֹאכַל"),
          markedForm("תאכלו", "תֹּאכְלוּ"),
          markedForm("יאכלו", "יֹאכְלוּ")
        ),
        makeImperative(
          markedForm("אכל", "אֱכֹל"),
          markedForm("אכלי", "אִכְלִי"),
          markedForm("אכלו", "אִכְלוּ"),
          markedForm("אכלנה", "אֱכֹלְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 2,
      tags: ["starter", "seed", "regular"],
      personal_priority: 90,
    }),
    createVerbEntry({
      id: "starter-verb-lishtot",
      availability: getStarterVerbAvailability("starter-verb-lishtot"),
      lemma: "לשתות",
      lemma_niqqud: "לִשְׁתּוֹת",
      root: ["ש", "ת", "ה"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to drink", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("שותה", "שׁוֹתֶה"),
          markedForm("שותה", "שׁוֹתָה"),
          markedForm("שותים", "שׁוֹתִים"),
          markedForm("שותות", "שׁוֹתוֹת")
        ),
        makePast(
          markedForm("שתיתי", "שָׁתִיתִי"),
          markedForm("שתית", "שָׁתִיתָ"),
          markedForm("שתית", "שָׁתִיתְ"),
          markedForm("שתה", "שָׁתָה"),
          markedForm("שתתה", "שָׁתְתָה"),
          markedForm("שתינו", "שָׁתִינוּ"),
          markedForm("שתיתם", "שְׁתִיתֶם"),
          markedForm("שתיתן", "שְׁתִיתֶן"),
          markedForm("שתו", "שָׁתוּ")
        ),
        makeFuture(
          markedForm("אשתה", "אֶשְׁתֶּה"),
          markedForm("תשתה", "תִּשְׁתֶּה"),
          markedForm("תשתי", "תִּשְׁתִּי"),
          markedForm("ישתה", "יִשְׁתֶּה"),
          markedForm("תשתה", "תִּשְׁתֶּה"),
          markedForm("נשתה", "נִשְׁתֶּה"),
          markedForm("תשתו", "תִּשְׁתּוּ"),
          markedForm("ישתו", "יִשְׁתּוּ")
        ),
        makeImperative(
          markedForm("שתה", "שְׁתֵה"),
          markedForm("שתי", "שְׁתִי"),
          markedForm("שתו", "שְׁתוּ"),
          markedForm("שתינה", "שְׁתֶינָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 3,
      tags: ["starter", "seed", "regular"],
      personal_priority: 89,
    }),
    createVerbEntry({
      id: "starter-verb-lesachek",
      availability: getStarterVerbAvailability("starter-verb-lesachek"),
      lemma: "לשחק",
      lemma_niqqud: "לְשַׂחֵק",
      root: ["ש", "ח", "ק"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to play", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("משחק", "מְשַׂחֵק"),
          markedForm("משחקת", "מְשַׂחֶקֶת"),
          markedForm("משחקים", "מְשַׂחֲקִים"),
          markedForm("משחקות", "מְשַׂחֲקוֹת")
        ),
        makePast(
          markedForm("שיחקתי", "שִׂיחַקְתִּי"),
          markedForm("שיחקת", "שִׂיחַקְתָּ"),
          markedForm("שיחקת", "שִׂיחַקְתְּ"),
          markedForm("שיחק", "שִׂיחֵק"),
          markedForm("שיחקה", "שִׂיחֲקָה"),
          markedForm("שיחקנו", "שִׂיחַקְנוּ"),
          markedForm("שיחקתם", "שִׂיחַקְתֶּם"),
          markedForm("שיחקתן", "שִׂיחַקְתֶּן"),
          markedForm("שיחקו", "שִׂיחֲקוּ")
        ),
        makeFuture(
          markedForm("אשחק", "אֲשַׂחֵק"),
          markedForm("תשחק", "תְּשַׂחֵק"),
          markedForm("תשחקי", "תְּשַׂחֲקִי"),
          markedForm("ישחק", "יְשַׂחֵק"),
          markedForm("תשחק", "תְּשַׂחֵק"),
          markedForm("נשחק", "נְשַׂחֵק"),
          markedForm("תשחקו", "תְּשַׂחֲקוּ"),
          markedForm("ישחקו", "יְשַׂחֲקוּ")
        ),
        makeImperative(
          markedForm("שחק", "שַׂחֵק"),
          markedForm("שחקי", "שַׂחֲקִי"),
          markedForm("שחקו", "שַׂחֲקוּ"),
          markedForm("שחקנה", "שַׂחֵקְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 1,
      tags: ["starter", "seed", "regular"],
      personal_priority: 88,
    }),
    createVerbEntry({
      id: "starter-verb-laavod",
      availability: getStarterVerbAvailability("starter-verb-laavod"),
      lemma: "לעבוד",
      lemma_niqqud: "לַעֲבֹד",
      root: ["ע", "ב", "ד"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to work", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("עובד", "עוֹבֵד"),
          markedForm("עובדת", "עוֹבֶדֶת"),
          markedForm("עובדים", "עוֹבְדִים"),
          markedForm("עובדות", "עוֹבְדוֹת")
        ),
        makePast(
          markedForm("עבדתי", "עָבַדְתִּי"),
          markedForm("עבדת", "עָבַדְתָּ"),
          markedForm("עבדת", "עָבַדְתְּ"),
          markedForm("עבד", "עָבַד"),
          markedForm("עבדה", "עָבְדָה"),
          markedForm("עבדנו", "עָבַדְנוּ"),
          markedForm("עבדתם", "עֲבַדְתֶּם"),
          markedForm("עבדתן", "עֲבַדְתֶּן"),
          markedForm("עבדו", "עָבְדוּ")
        ),
        makeFuture(
          markedForm("אעבוד", "אֶעֱבֹד"),
          markedForm("תעבוד", "תַּעֲבֹד"),
          markedForm("תעבדי", "תַּעַבְדִי"),
          markedForm("יעבוד", "יַעֲבֹד"),
          markedForm("תעבוד", "תַּעֲבֹד"),
          markedForm("נעבוד", "נַעֲבֹד"),
          markedForm("תעבדו", "תַּעַבְדוּ"),
          markedForm("יעבדו", "יַעַבְדוּ")
        ),
        makeImperative(
          markedForm("עבד", "עֲבֹד"),
          markedForm("עבדי", "עִבְדִי"),
          markedForm("עבדו", "עִבְדוּ"),
          markedForm("עבדנה", "עֲבֹדְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 2,
      tags: ["starter", "seed", "regular"],
      personal_priority: 87,
    }),
    createVerbEntry({
      id: "starter-verb-lagur",
      availability: getStarterVerbAvailability("starter-verb-lagur"),
      lemma: "לגור",
      lemma_niqqud: "לָגוּר",
      root: ["ג", "ו", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to live", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("גר", "גָּר"),
          markedForm("גרה", "גָּרָה"),
          markedForm("גרים", "גָּרִים"),
          markedForm("גרות", "גָּרוֹת")
        ),
        makePast(
          markedForm("גרתי", "גַּרְתִּי"),
          markedForm("גרת", "גַּרְתָּ"),
          markedForm("גרת", "גַּרְתְּ"),
          markedForm("גר", "גָּר"),
          markedForm("גרה", "גָּרָה"),
          markedForm("גרנו", "גַּרְנוּ"),
          markedForm("גרתם", "גַּרְתֶּם"),
          markedForm("גרתן", "גַּרְתֶּן"),
          markedForm("גרו", "גָּרוּ")
        ),
        makeFuture(
          markedForm("אגור", "אָגוּר"),
          markedForm("תגור", "תָּגוּר"),
          markedForm("תגורי", "תָּגוּרִי"),
          markedForm("יגור", "יָגוּר"),
          markedForm("תגור", "תָּגוּר"),
          markedForm("נגור", "נָגוּר"),
          markedForm("תגורו", "תָּגוּרוּ"),
          markedForm("יגורו", "יָגוּרוּ")
        ),
        makeImperative(
          markedForm("גור", "גּוּר"),
          markedForm("גורי", "גּוּרִי"),
          markedForm("גורו", "גּוּרוּ"),
          markedForm("גרנה", "גֹּרְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 2,
      tags: ["starter", "seed", "regular"],
      personal_priority: 86,
    }),
    createVerbEntry({
      id: "starter-verb-larutz",
      availability: getStarterVerbAvailability("starter-verb-larutz"),
      lemma: "לרוץ",
      lemma_niqqud: "לָרוּץ",
      root: ["ר", "ו", "ץ"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense("to run", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("רץ", "רָץ"),
          markedForm("רצה", "רָצָה"),
          markedForm("רצים", "רָצִים"),
          markedForm("רצות", "רָצוֹת")
        ),
        makePast(
          markedForm("רצתי", "רַצְתִּי"),
          markedForm("רצת", "רַצְתָּ"),
          markedForm("רצת", "רַצְתְּ"),
          markedForm("רץ", "רָץ"),
          markedForm("רצה", "רָצָה"),
          markedForm("רצנו", "רַצְנוּ"),
          markedForm("רצתם", "רַצְתֶּם"),
          markedForm("רצתן", "רַצְתֶּן"),
          markedForm("רצו", "רָצוּ")
        ),
        makeFuture(
          markedForm("ארוץ", "אָרוּץ"),
          markedForm("תרוץ", "תָּרוּץ"),
          markedForm("תרוצי", "תָּרוּצִי"),
          markedForm("ירוץ", "יָרוּץ"),
          markedForm("תרוץ", "תָּרוּץ"),
          markedForm("נרוץ", "נָרוּץ"),
          markedForm("תרוצו", "תָּרוּצוּ"),
          markedForm("ירוצו", "יָרוּצוּ")
        ),
        makeImperative(
          markedForm("רוץ", "רוּץ"),
          markedForm("רוצי", "רוּצִי"),
          markedForm("רוצו", "רוּצוּ"),
          markedForm("רצנה", "רֹצְנָה")
        )
      ),
      review_status: "approved",
      notes: "Authoritative stored forms cover this hollow pa'al movement verb.",
      difficulty_level: 2,
      tags: ["starter", "seed", "regular"],
      personal_priority: 85,
    }),
    createVerbEntry({
      id: "starter-verb-lirkhosh",
      availability: getStarterVerbAvailability("starter-verb-lirkhosh"),
      lemma: "לרכוש",
      lemma_niqqud: "לִרְכּוֹשׁ",
      root: ["ר", "כ", "ש"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to purchase", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("רוכש", "רוֹכֵשׁ"),
          markedForm("רוכשת", "רוֹכֶשֶׁת"),
          markedForm("רוכשים", "רוֹכְשִׁים"),
          markedForm("רוכשות", "רוֹכְשׁוֹת")
        ),
        makePast(
          markedForm("רכשתי", "רָכַשְׁתִּי"),
          markedForm("רכשת", "רָכַשְׁתָּ"),
          markedForm("רכשת", "רָכַשְׁתְּ"),
          markedForm("רכש", "רָכַשׁ"),
          markedForm("רכשה", "רָכְשָׁה"),
          markedForm("רכשנו", "רָכַשְׁנוּ"),
          markedForm("רכשתם", "רְכַשְׁתֶּם"),
          markedForm("רכשתן", "רְכַשְׁתֶּן"),
          markedForm("רכשו", "רָכְשׁוּ")
        ),
        makeFuture(
          markedForm("ארכוש", "אֶרְכּוֹשׁ"),
          markedForm("תרכוש", "תִּרְכּוֹשׁ"),
          markedForm("תרכשי", "תִּרְכְּשִׁי"),
          markedForm("ירכוש", "יִרְכּוֹשׁ"),
          markedForm("תרכוש", "תִּרְכּוֹשׁ"),
          markedForm("נרכוש", "נִרְכּוֹשׁ"),
          markedForm("תרכשו", "תִּרְכְּשׁוּ"),
          markedForm("ירכשו", "יִרְכְּשׁוּ")
        ),
        makeImperative(
          markedForm("רכוש", "רְכוֹשׁ"),
          markedForm("רכשי", "רִכְשִׁי"),
          markedForm("רכשו", "רִכְשׁוּ"),
          markedForm("רכשנה", "רְכוֹשְׁנָה")
        )
      ),
      review_status: "approved",
      notes: "Stored authoritative forms cover the common everyday verb for purchasing.",
      difficulty_level: 2,
      tags: ["starter", "seed", "curated"],
      personal_priority: 84,
    }),
    createVerbEntry({
      id: "starter-verb-lavo",
      availability: getStarterVerbAvailability("starter-verb-lavo"),
      lemma: "לבוא",
      lemma_niqqud: "לָבוֹא",
      root: ["ב", "ו", "א"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to come", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("בא", "בָּא"),
          markedForm("באה", "בָּאָה"),
          markedForm("באים", "בָּאִים"),
          markedForm("באות", "בָּאוֹת")
        ),
        makePast(
          markedForm("באתי", "בָּאתִי"),
          markedForm("באת", "בָּאתָ"),
          markedForm("באת", "בָּאתְ"),
          markedForm("בא", "בָּא"),
          markedForm("באה", "בָּאָה"),
          markedForm("באנו", "בָּאנוּ"),
          markedForm("באתם", "בָּאתֶם"),
          markedForm("באתן", "בָּאתֶן"),
          markedForm("באו", "בָּאוּ")
        ),
        makeFuture(
          markedForm("אבוא", "אָבוֹא"),
          markedForm("תבוא", "תָּבוֹא"),
          markedForm("תבואי", "תָּבוֹאִי"),
          markedForm("יבוא", "יָבוֹא"),
          markedForm("תבוא", "תָּבוֹא"),
          markedForm("נבוא", "נָבוֹא"),
          markedForm("תבואו", "תָּבוֹאוּ"),
          markedForm("יבואו", "יָבוֹאוּ")
        ),
        makeImperative(
          markedForm("בוא", "בּוֹא"),
          markedForm("בואי", "בּוֹאִי"),
          markedForm("בואו", "בּוֹאוּ"),
          markedForm("באנה", "בֹּאְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 4,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 96,
    }),
    createVerbEntry({
      id: "starter-verb-lihyot",
      availability: getStarterVerbAvailability("starter-verb-lihyot"),
      lemma: "להיות",
      lemma_niqqud: "לִהְיוֹת",
      root: ["ה", "י", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to be", null, false)],
      forms: makeForms(
        null,
        makePast(
          markedForm("הייתי", "הָיִיתִי"),
          markedForm("היית", "הָיִיתָ"),
          markedForm("היית", "הָיִיתְ"),
          markedForm("היה", "הָיָה"),
          markedForm("הייתה", "הָיְתָה"),
          markedForm("היינו", "הָיִינוּ"),
          markedForm("הייתם", "הֱיִיתֶם"),
          markedForm("הייתן", "הֱיִיתֶן"),
          markedForm("היו", "הָיוּ")
        ),
        makeFuture(
          markedForm("אהיה", "אֶהְיֶה"),
          markedForm("תהיה", "תִּהְיֶה"),
          markedForm("תהיי", "תִּהְיִי"),
          markedForm("יהיה", "יִהְיֶה"),
          markedForm("תהיה", "תִּהְיֶה"),
          markedForm("נהיה", "נִהְיֶה"),
          markedForm("תהיו", "תִּהְיוּ"),
          markedForm("יהיו", "יִהְיוּ")
        ),
        makeImperative(
          markedForm("היה", "הֱיֵה"),
          markedForm("היי", "הֱיִי"),
          markedForm("היו", "הֱיוּ"),
          markedForm("היינה", "הֱיֶינָה")
        )
      ),
      review_status: "approved",
      notes: "Modern practical Hebrew usually omits the present-tense copula.",
      difficulty_level: 5,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 99,
    }),
    createVerbEntry({
      id: "starter-verb-lirot",
      availability: getStarterVerbAvailability("starter-verb-lirot"),
      lemma: "לראות",
      lemma_niqqud: "לִרְאוֹת",
      root: ["ר", "א", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to see", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("רואה", "רוֹאֶה"),
          markedForm("רואה", "רוֹאָה"),
          markedForm("רואים", "רוֹאִים"),
          markedForm("רואות", "רוֹאוֹת")
        ),
        makePast(
          markedForm("ראיתי", "רָאִיתִי"),
          markedForm("ראית", "רָאִיתָ"),
          markedForm("ראית", "רָאִיתְ"),
          markedForm("ראה", "רָאָה"),
          markedForm("ראתה", "רָאֲתָה"),
          markedForm("ראינו", "רָאִינוּ"),
          markedForm("ראיתם", "רְאִיתֶם"),
          markedForm("ראיתן", "רְאִיתֶן"),
          markedForm("ראו", "רָאוּ")
        ),
        makeFuture(
          markedForm("אראה", "אֶרְאֶה"),
          markedForm("תראה", "תִּרְאֶה"),
          markedForm("תראי", "תִּרְאִי"),
          markedForm("יראה", "יִרְאֶה"),
          markedForm("תראה", "תִּרְאֶה"),
          markedForm("נראה", "נִרְאֶה"),
          markedForm("תראו", "תִּרְאוּ"),
          markedForm("יראו", "יִרְאוּ")
        ),
        makeImperative(
          markedForm("ראה", "רְאֵה"),
          markedForm("ראי", "רְאִי"),
          markedForm("ראו", "רְאוּ"),
          markedForm("ראינה", "רְאֶינָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 4,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 90,
    }),
    createVerbEntry({
      id: "starter-verb-lakachat",
      availability: getStarterVerbAvailability("starter-verb-lakachat"),
      lemma: "לקחת",
      lemma_niqqud: "לָקַחַת",
      root: ["ל", "ק", "ח"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to take", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("לוקח", "לוֹקֵחַ"),
          markedForm("לוקחת", "לוֹקַחַת"),
          markedForm("לוקחים", "לוֹקְחִים"),
          markedForm("לוקחות", "לוֹקְחוֹת")
        ),
        makePast(
          markedForm("לקחתי", "לָקַחְתִּי"),
          markedForm("לקחת", "לָקַחְתָּ"),
          markedForm("לקחת", "לָקַחְתְּ"),
          markedForm("לקח", "לָקַח"),
          markedForm("לקחה", "לָקְחָה"),
          markedForm("לקחנו", "לָקַחְנוּ"),
          markedForm("לקחתם", "לְקַחְתֶּם"),
          markedForm("לקחתן", "לְקַחְתֶּן"),
          markedForm("לקחו", "לָקְחוּ")
        ),
        makeFuture(
          markedForm("אקח", "אֶקַּח"),
          markedForm("תיקח", "תִּקַּח"),
          markedForm("תיקחי", "תִּקְּחִי"),
          markedForm("ייקח", "יִקַּח"),
          markedForm("תיקח", "תִּקַּח"),
          markedForm("ניקח", "נִקַּח"),
          markedForm("תיקחו", "תִּקְּחוּ"),
          markedForm("ייקחו", "יִקְּחוּ")
        ),
        makeImperative(
          markedForm("קח", "קַח"),
          markedForm("קחי", "קְחִי"),
          markedForm("קחו", "קְחוּ"),
          markedForm("קחנה", "קַחְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 4,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 88,
    }),
    createVerbEntry({
      id: "starter-verb-lasim",
      availability: getStarterVerbAvailability("starter-verb-lasim"),
      lemma: "לשים",
      lemma_niqqud: "לָשִׂים",
      root: ["ש", "י", "ם"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to put", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("שם", "שָׂם"),
          markedForm("שמה", "שָׂמָה"),
          markedForm("שמים", "שָׂמִים"),
          markedForm("שמות", "שָׂמוֹת")
        ),
        makePast(
          markedForm("שמתי", "שַׂמְתִּי"),
          markedForm("שמת", "שַׂמְתָּ"),
          markedForm("שמת", "שַׂמְתְּ"),
          markedForm("שם", "שָׂם"),
          markedForm("שמה", "שָׂמָה"),
          markedForm("שמנו", "שַׂמְנוּ"),
          markedForm("שמתם", "שַׂמְתֶּם"),
          markedForm("שמתן", "שַׂמְתֶּן"),
          markedForm("שמו", "שָׂמוּ")
        ),
        makeFuture(
          markedForm("אשים", "אָשִׂים"),
          markedForm("תשים", "תָּשִׂים"),
          markedForm("תשימי", "תָּשִׂימִי"),
          markedForm("ישים", "יָשִׂים"),
          markedForm("תשים", "תָּשִׂים"),
          markedForm("נשים", "נָשִׂים"),
          markedForm("תשימו", "תָּשִׂימוּ"),
          markedForm("ישימו", "יָשִׂימוּ")
        ),
        makeImperative(
          markedForm("שים", "שִׂים"),
          markedForm("שימי", "שִׂימִי"),
          markedForm("שימו", "שִׂימוּ"),
          markedForm("שמנה", "שֵׂמְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 4,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 87,
    }),
    createVerbEntry({
      id: "starter-verb-latet",
      availability: getStarterVerbAvailability("starter-verb-latet"),
      lemma: "לתת",
      lemma_niqqud: "לָתֵת",
      root: ["נ", "ת", "נ"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to give", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נותן", "נוֹתֵן"),
          markedForm("נותנת", "נוֹתֶנֶת"),
          markedForm("נותנים", "נוֹתְנִים"),
          markedForm("נותנות", "נוֹתְנוֹת")
        ),
        makePast(
          markedForm("נתתי", "נָתַתִּי"),
          markedForm("נתת", "נָתַתָּ"),
          markedForm("נתת", "נָתַתְּ"),
          markedForm("נתן", "נָתַן"),
          markedForm("נתנה", "נָתְנָה"),
          markedForm("נתנו", "נָתַנּוּ"),
          markedForm("נתתם", "נְתַתֶּם"),
          markedForm("נתתן", "נְתַתֶּן"),
          markedForm("נתנו", "נָתְנוּ")
        ),
        makeFuture(
          markedForm("אתן", "אֶתֵּן"),
          markedForm("תיתן", "תִּתֵּן"),
          markedForm("תיתני", "תִּתְּנִי"),
          markedForm("ייתן", "יִתֵּן"),
          markedForm("תיתן", "תִּתֵּן"),
          markedForm("ניתן", "נִתֵּן"),
          markedForm("תיתנו", "תִּתְּנוּ"),
          markedForm("ייתנו", "יִתְּנוּ")
        ),
        makeImperative(
          markedForm("תן", "תֵּן"),
          markedForm("תני", "תְּנִי"),
          markedForm("תנו", "תְּנוּ"),
          markedForm("תנה", "תֵּנָּה")
        )
      ),
      review_status: "approved",
      difficulty_level: 5,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 94,
    }),
    createVerbEntry({
      id: "starter-verb-lalechet",
      availability: getStarterVerbAvailability("starter-verb-lalechet"),
      lemma: "ללכת",
      lemma_niqqud: "לָלֶכֶת",
      root: ["ה", "ל", "כ"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to go", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("הולך", "הוֹלֵךְ"),
          markedForm("הולכת", "הוֹלֶכֶת"),
          markedForm("הולכים", "הוֹלְכִים"),
          markedForm("הולכות", "הוֹלְכוֹת")
        ),
        makePast(
          markedForm("הלכתי", "הָלַכְתִּי"),
          markedForm("הלכת", "הָלַכְתָּ"),
          markedForm("הלכת", "הָלַכְתְּ"),
          markedForm("הלך", "הָלַךְ"),
          markedForm("הלכה", "הָלְכָה"),
          markedForm("הלכנו", "הָלַכְנוּ"),
          markedForm("הלכתם", "הֲלַכְתֶּם"),
          markedForm("הלכתן", "הֲלַכְתֶּן"),
          markedForm("הלכו", "הָלְכוּ")
        ),
        makeFuture(
          markedForm("אלך", "אֵלֵךְ"),
          markedForm("תלך", "תֵּלֵךְ"),
          markedForm("תלכי", "תֵּלְכִי"),
          markedForm("ילך", "יֵלֵךְ"),
          markedForm("תלך", "תֵּלֵךְ"),
          markedForm("נלך", "נֵלֵךְ"),
          markedForm("תלכו", "תֵּלְכוּ"),
          markedForm("ילכו", "יֵלְכוּ")
        ),
        makeImperative(
          markedForm("לך", "לֵךְ"),
          markedForm("לכי", "לְכִי"),
          markedForm("לכו", "לְכוּ"),
          markedForm("לכנה", "לֵכְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 4,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 91,
    }),
    createVerbEntry({
      id: "starter-verb-lehagid",
      availability: getStarterVerbAvailability("starter-verb-lehagid"),
      lemma: "להגיד",
      lemma_niqqud: "לְהַגִּיד",
      root: ["נ", "ג", "ד"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to say", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("אומר", "אוֹמֵר"),
          markedForm("אומרת", "אוֹמֶרֶת"),
          markedForm("אומרים", "אוֹמְרִים"),
          markedForm("אומרות", "אוֹמְרוֹת")
        ),
        makePast(
          markedForm("אמרתי", "אָמַרְתִּי"),
          markedForm("אמרת", "אָמַרְתָּ"),
          markedForm("אמרת", "אָמַרְתְּ"),
          markedForm("אמר", "אָמַר"),
          markedForm("אמרה", "אָמְרָה"),
          markedForm("אמרנו", "אָמַרְנוּ"),
          markedForm("אמרתם", "אֲמַרְתֶּם"),
          markedForm("אמרתן", "אֲמַרְתֶּן"),
          markedForm("אמרו", "אָמְרוּ")
        ),
        makeFuture(
          markedForm("אגיד", "אַגִּיד"),
          markedForm("תגיד", "תַּגִּיד"),
          markedForm("תגידי", "תַּגִּידִי"),
          markedForm("יגיד", "יַגִּיד"),
          markedForm("תגיד", "תַּגִּיד"),
          markedForm("נגיד", "נַגִּיד"),
          markedForm("תגידו", "תַּגִּידוּ"),
          markedForm("יגידו", "יַגִּידוּ")
        ),
        makeImperative(
          markedForm("הגד", "הַגֵּד"),
          markedForm("הגידי", "הַגִּידִי"),
          markedForm("הגידו", "הַגִּידוּ"),
          markedForm("הגדנה", "הַגֵּדְנָה")
        )
      ),
      review_status: "approved",
      notes: "Modern usage is suppletive: present and past come from אמר, future from להגיד.",
      difficulty_level: 4,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 85,
    }),
    createVerbEntry({
      id: "starter-verb-laamod",
      availability: getStarterVerbAvailability("starter-verb-laamod"),
      lemma: "לעמוד",
      lemma_niqqud: "לַעֲמֹד",
      root: ["ע", "מ", "ד"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to stand", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("עומד", "עוֹמֵד"),
          markedForm("עומדת", "עוֹמֶדֶת"),
          markedForm("עומדים", "עוֹמְדִים"),
          markedForm("עומדות", "עוֹמְדוֹת")
        ),
        makePast(
          markedForm("עמדתי", "עָמַדְתִּי"),
          markedForm("עמדת", "עָמַדְתָּ"),
          markedForm("עמדת", "עָמַדְתְּ"),
          markedForm("עמד", "עָמַד"),
          markedForm("עמדה", "עָמְדָה"),
          markedForm("עמדנו", "עָמַדְנוּ"),
          markedForm("עמדתם", "עֲמַדְתֶּם"),
          markedForm("עמדתן", "עֲמַדְתֶּן"),
          markedForm("עמדו", "עָמְדוּ")
        ),
        makeFuture(
          markedForm("אעמוד", "אֶעֱמֹד"),
          markedForm("תעמוד", "תַּעֲמֹד"),
          markedForm("תעמדי", "תַּעַמְדִי"),
          markedForm("יעמוד", "יַעֲמֹד"),
          markedForm("תעמוד", "תַּעֲמֹד"),
          markedForm("נעמוד", "נַעֲמֹד"),
          markedForm("תעמדו", "תַּעַמְדוּ"),
          markedForm("יעמדו", "יַעַמְדוּ")
        ),
        makeImperative(
          markedForm("עמד", "עֲמֹד"),
          markedForm("עמדי", "עִמְדִי"),
          markedForm("עמדו", "עִמְדוּ"),
          markedForm("עמדנה", "עֲמֹדְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 3,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 83,
    }),
    createVerbEntry({
      id: "starter-verb-lashevet",
      availability: getStarterVerbAvailability("starter-verb-lashevet"),
      lemma: "לשבת",
      lemma_niqqud: "לָשֶׁבֶת",
      root: ["י", "ש", "ב"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to sit", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("יושב", "יוֹשֵׁב"),
          markedForm("יושבת", "יוֹשֶׁבֶת"),
          markedForm("יושבים", "יוֹשְׁבִים"),
          markedForm("יושבות", "יוֹשְׁבוֹת")
        ),
        makePast(
          markedForm("ישבתי", "יָשַׁבְתִּי"),
          markedForm("ישבת", "יָשַׁבְתָּ"),
          markedForm("ישבת", "יָשַׁבְתְּ"),
          markedForm("ישב", "יָשַׁב"),
          markedForm("ישבה", "יָשְׁבָה"),
          markedForm("ישבנו", "יָשַׁבְנוּ"),
          markedForm("ישבתם", "יְשַׁבְתֶּם"),
          markedForm("ישבתן", "יְשַׁבְתֶּן"),
          markedForm("ישבו", "יָשְׁבוּ")
        ),
        makeFuture(
          markedForm("אשב", "אֵשֵׁב"),
          markedForm("תשב", "תֵּשֵׁב"),
          markedForm("תשבי", "תֵּשְׁבִי"),
          markedForm("ישב", "יֵשֵׁב"),
          markedForm("תשב", "תֵּשֵׁב"),
          markedForm("נשב", "נֵשֵׁב"),
          markedForm("תשבו", "תֵּשְׁבוּ"),
          markedForm("ישבו", "יֵשְׁבוּ")
        ),
        makeImperative(
          markedForm("שב", "שֵׁב"),
          markedForm("שבי", "שְׁבִי"),
          markedForm("שבו", "שְׁבוּ"),
          markedForm("שבנה", "שֵׁבְנָה")
        )
      ),
      review_status: "approved",
      difficulty_level: 3,
      tags: ["starter", "seed", "curated", "irregular"],
      personal_priority: 82,
    }),
    createVerbEntry({
      id: "cooking-verb-lamoach",
      availability: { translationQuiz: true, sentenceHints: true },
      lemma: "למעוך",
      lemma_niqqud: "לִמְעוֹךְ",
      root: ["מ", "ע", "ך"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to mash", null, false)],
      forms: makeForms(
        makePresent(
          {plain: "מועך", niqqud: "מוֹעֵךְ"},
          {plain: "מועכת", niqqud: "מוֹעֶכֶת"},
          {plain: "מועכים", niqqud: "מוֹעֲכִים"},
          {plain: "מועכות", niqqud: "מוֹעֲכוֹת"}
        ),
        makePast(
          {plain: "מעכתי", niqqud: "מָעַכְתִּי"},
          {plain: "מעכת", niqqud: "מָעַכְתָּ"},
          {plain: "מעכת", niqqud: "מָעַכְתְּ"},
          {plain: "מעך", niqqud: "מָעַךְ"},
          {plain: "מעכה", niqqud: "מָעֲכָה"},
          {plain: "מעכנו", niqqud: "מָעַכְנוּ"},
          {plain: "מעכתם", niqqud: "מְעַכְתֶּם"},
          {plain: "מעכתן", niqqud: "מְעַכְתֶּן"},
          {plain: "מעכו", niqqud: "מָעֲכוּ"}
        ),
        makeFuture(
          {plain: "אמעך", niqqud: "אֶמְעַךְ"},
          {plain: "תמעך", niqqud: "תִּמְעַךְ"},
          {plain: "תמעכי", niqqud: "תִּמְעֲכִי"},
          {plain: "ימעך", niqqud: "יִמְעַךְ"},
          {plain: "תמעך", niqqud: "תִּמְעַךְ"},
          {plain: "נמעך", niqqud: "נִמְעַךְ"},
          {plain: "תמעכו", niqqud: "תִּמְעֲכוּ"},
          {plain: "ימעכו", niqqud: "יִמְעֲכוּ"}
        ),
        makeImperative(
          {plain: "מעך", niqqud: "מְעַךְ"},
          {plain: "מעכי", niqqud: "מַעֲכִי"},
          {plain: "מעכו", niqqud: "מַעֲכוּ"},
          {plain: "מעכנה", niqqud: "מְעַכְנָה"}
        )
      ),
      review_status: "approved",
      difficulty_level: 3,
      tags: ["curated", "cooking_verbs", "irregular"],
      personal_priority: 60,
      category: "cooking_verbs",
    }),
    createVerbEntry({
      id: "physical-verb-limchotz",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "למחוץ",
      lemma_niqqud: "לִמְחוֹץ",
      root: ["מ", "ח", "ץ"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to crush", null, false)],
      forms: makeForms(
        makePresent(
          {plain: "מוחץ", niqqud: "מוֹחֵץ"},
          {plain: "מוחצת", niqqud: "מוֹחֶצֶת"},
          {plain: "מוחצים", niqqud: "מוֹחֲצִים"},
          {plain: "מוחצות", niqqud: "מוֹחֲצוֹת"}
        ),
        makePast(
          {plain: "מחצתי", niqqud: "מָחַצְתִּי"},
          {plain: "מחצת", niqqud: "מָחַצְתָּ"},
          {plain: "מחצת", niqqud: "מָחַצְתְּ"},
          {plain: "מחץ", niqqud: "מָחַץ"},
          {plain: "מחצה", niqqud: "מָחֲצָה"},
          {plain: "מחצנו", niqqud: "מָחַצְנוּ"},
          {plain: "מחצתם", niqqud: "מְחַצְתֶּם"},
          {plain: "מחצתן", niqqud: "מְחַצְתֶּן"},
          {plain: "מחצו", niqqud: "מָחֲצוּ"}
        ),
        makeFuture(
          {plain: "אמחץ", niqqud: "אֶמְחַץ"},
          {plain: "תמחץ", niqqud: "תִּמְחַץ"},
          {plain: "תמחצי", niqqud: "תִּמְחֲצִי"},
          {plain: "ימחץ", niqqud: "יִמְחַץ"},
          {plain: "תמחץ", niqqud: "תִּמְחַץ"},
          {plain: "נמחץ", niqqud: "נִמְחַץ"},
          {plain: "תמחצו", niqqud: "תִּמְחֲצוּ"},
          {plain: "ימחצו", niqqud: "יִמְחֲצוּ"}
        ),
        makeImperative(
          {plain: "מחץ", niqqud: "מְחַץ"},
          {plain: "מחצי", niqqud: "מַחֲצִי"},
          {plain: "מחצו", niqqud: "מַחֲצוּ"},
          {plain: "מחצנה", niqqud: "מְחַצְנָה"}
        )
      ),
      review_status: "approved",
      difficulty_level: 3,
      tags: ["curated", "physical_verbs", "irregular"],
      personal_priority: 60,
      category: "physical_verbs",
    }),
    createVerbEntry({
      id: "starter-verb-leshacharer",
      availability: getStarterVerbAvailability("starter-verb-leshacharer"),
      lemma: "לשחרר",
      lemma_niqqud: "לְשַׁחְרֵר",
      root: ["ש", "ח", "ר"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to free", null, true), makeSense("to liberate", null, true)],
      forms: makeForms(
        makePresent("מְשַׁחְרֵר", "מְשַׁחְרֶרֶת", "מְשַׁחְרְרִים", "מְשַׁחְרְרוֹת"),
        makePast("שִׁחְרַרְתִּי", "שִׁחְרַרְתָּ", "שִׁחְרַרְתְּ", "שִׁחְרֵר", "שִׁחְרְרָה", "שִׁחְרַרְנוּ", "שִׁחְרַרְתֶּם", "שִׁחְרַרְתֶּן", "שִׁחְרְרוּ"),
        makeFuture("אֲשַׁחְרֵר", "תְּשַׁחְרֵר", "תְּשַׁחְרְרִי", "יְשַׁחְרֵר", "תְּשַׁחְרֵר", "נְשַׁחְרֵר", "תְּשַׁחְרְרוּ", "יְשַׁחְרְרוּ"),
        makeImperative("שַׁחְרֵר", "שַׁחְרְרִי", "שַׁחְרְרוּ", "שַׁחְרֵרְנָה")
      ),
      review_status: "approved",
      notes: "Pi'el of ש-ח-ר with geminate resh. Gloss covers 'to free' (individuals) and 'to liberate' (peoples/nations).",
      difficulty_level: 3,
      tags: ["piel", "regular"],
      personal_priority: 80,
    }),
    createVerbEntry({
      id: "starter-verb-lekhabot",
      availability: getStarterVerbAvailability("starter-verb-lekhabot"),
      lemma: "לכבות",
      lemma_niqqud: "לְכַבּוֹת",
      root: ["כ", "ב", "ה"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to turn off", null, true), makeSense("to extinguish", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מכבה", "מְכַבֶּה"),
          markedForm("מכבה", "מְכַבָּה"),
          markedForm("מכבים", "מְכַבִּים"),
          markedForm("מכבות", "מְכַבּוֹת")
        ),
        makePast(
          markedForm("כיביתי", "כִּבִּיתִי"),
          markedForm("כיבית", "כִּבִּיתָ"),
          markedForm("כיבית", "כִּבִּיתְ"),
          markedForm("כיבה", "כִּבָּה"),
          markedForm("כיבתה", "כִּבְּתָה"),
          markedForm("כיבינו", "כִּבִּינוּ"),
          markedForm("כיביתם", "כִּבִּיתֶם"),
          markedForm("כיביתן", "כִּבִּיתֶן"),
          markedForm("כיבו", "כִּבּוּ")
        ),
        makeFuture(
          markedForm("אכבה", "אֲכַבֶּה"),
          markedForm("תכבה", "תְּכַבֶּה"),
          markedForm("תכבי", "תְּכַבִּי"),
          markedForm("יכבה", "יְכַבֶּה"),
          markedForm("תכבה", "תְּכַבֶּה"),
          markedForm("נכבה", "נְכַבֶּה"),
          markedForm("תכבו", "תְּכַבּוּ"),
          markedForm("יכבו", "יְכַבּוּ")
        ),
        makeImperative(
          markedForm("כבה", "כַּבֵּה"),
          markedForm("כבי", "כַּבִּי"),
          markedForm("כבו", "כַּבּוּ"),
          markedForm("כבינה", "כַּבֶּינָה")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of כ-ב-ה. Common everyday verb for turning off lights, electronics, extinguishing fire.",
      difficulty_level: 2,
      tags: ["piel", "seed"],
      personal_priority: 79,
    }),
    createVerbEntry({
      id: "starter-verb-letzanen",
      availability: getStarterVerbAvailability("starter-verb-letzanen"),
      lemma: "לצנן",
      lemma_niqqud: "לְצַנֵּן",
      root: ["צ", "נ", "נ"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to chill", null, true), makeSense("to cool down", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מצנן", "מְצַנֵּן"),
          markedForm("מצננת", "מְצַנֶּנֶת"),
          markedForm("מצננים", "מְצַנְּנִים"),
          markedForm("מצננות", "מְצַנְּנוֹת")
        ),
        makePast(
          markedForm("ציננתי", "צִנַּנְתִּי"),
          markedForm("ציננת", "צִנַּנְתָּ"),
          markedForm("ציננת", "צִנַּנְתְּ"),
          markedForm("צינן", "צִנֵּן"),
          markedForm("ציננה", "צִנְּנָה"),
          markedForm("ציננו", "צִנַּנּוּ"),
          markedForm("ציננתם", "צִנַּנְתֶּם"),
          markedForm("ציננתן", "צִנַּנְתֶּן"),
          markedForm("ציננו", "צִנְּנוּ")
        ),
        makeFuture(
          markedForm("אצנן", "אֲצַנֵּן"),
          markedForm("תצנן", "תְּצַנֵּן"),
          markedForm("תצנני", "תְּצַנְּנִי"),
          markedForm("יצנן", "יְצַנֵּן"),
          markedForm("תצנן", "תְּצַנֵּן"),
          markedForm("נצנן", "נְצַנֵּן"),
          markedForm("תצננו", "תְּצַנְּנוּ"),
          markedForm("יצננו", "יְצַנְּנוּ")
        ),
        makeImperative(
          markedForm("צנן", "צַנֵּן"),
          markedForm("צנני", "צַנְּנִי"),
          markedForm("צננו", "צַנְּנוּ"),
          markedForm("צננה", "צַנֵּנָּה")
        )
      ),
      review_status: "approved",
      difficulty_level: 2,
      tags: ["piel", "seed"],
      personal_priority: 72,
    }),
    createVerbEntry({
      id: "starter-verb-letachnen",
      availability: getStarterVerbAvailability("starter-verb-letachnen"),
      lemma: "לתכנן",
      lemma_niqqud: "לְתַכְנֵן",
      root: ["ת", "כ", "נ", "נ"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to plan", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מתכנן", "מְתַכְנֵן"),
          markedForm("מתכננת", "מְתַכְנֶנֶת"),
          markedForm("מתכננים", "מְתַכְנְנִים"),
          markedForm("מתכננות", "מְתַכְנְנוֹת")
        ),
        makePast(
          markedForm("תכננתי", "תִּכְנַנְתִּי"),
          markedForm("תכננת", "תִּכְנַנְתָּ"),
          markedForm("תכננת", "תִּכְנַנְתְּ"),
          markedForm("תכנן", "תִּכְנֵן"),
          markedForm("תכננה", "תִּכְנְנָה"),
          markedForm("תכננו", "תִּכְנַנּוּ"),
          markedForm("תכננתם", "תִּכְנַנְתֶּם"),
          markedForm("תכננתן", "תִּכְנַנְתֶּן"),
          markedForm("תכננו", "תִּכְנְנוּ")
        ),
        makeFuture(
          markedForm("אתכנן", "אֲתַכְנֵן"),
          markedForm("תתכנן", "תְּתַכְנֵן"),
          markedForm("תתכנני", "תְּתַכְנְנִי"),
          markedForm("יתכנן", "יְתַכְנֵן"),
          markedForm("תתכנן", "תְּתַכְנֵן"),
          markedForm("נתכנן", "נְתַכְנֵן"),
          markedForm("תתכננו", "תְּתַכְנְנוּ"),
          markedForm("יתכננו", "יְתַכְנְנוּ"),
          markedForm("תתכננה", "תְּתַכְנֵנָּה"),
          markedForm("יתכננה", "יְתַכְנֵנָּה")
        ),
        makeImperative(
          markedForm("תכנן", "תַּכְנֵן"),
          markedForm("תכנני", "תַּכְנְנִי"),
          markedForm("תכננו", "תַּכְנְנוּ"),
          markedForm("תכננה", "תַּכְנֵנָּה")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of ת-כ-נ. Stored authoritative forms cover the common everyday verb for planning.",
      difficulty_level: 2,
      tags: ["piel", "seed"],
      personal_priority: 71,
    }),
    createVerbEntry({
      id: "advanced-verb-lenateach",
      availability: getStarterVerbAvailability("advanced-verb-lenateach"),
      lemma: "לנתח",
      lemma_niqqud: "לְנַתֵּחַ",
      root: ["נ", "ת", "ח"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to analyze", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מנתח", "מְנַתֵּחַ"),
          markedForm("מנתחת", "מְנַתַּחַת"),
          markedForm("מנתחים", "מְנַתְּחִים"),
          markedForm("מנתחות", "מְנַתְּחוֹת")
        ),
        makePast(
          markedForm("ניתחתי", "נִתַּחְתִּי"),
          markedForm("ניתחת", "נִתַּחְתָּ"),
          markedForm("ניתחת", "נִתַּחְתְּ"),
          markedForm("ניתח", "נִתֵּחַ"),
          markedForm("ניתחה", "נִתְּחָה"),
          markedForm("ניתחנו", "נִתַּחְנוּ"),
          markedForm("ניתחתם", "נִתַּחְתֶּם"),
          markedForm("ניתחתן", "נִתַּחְתֶּן"),
          markedForm("ניתחו", "נִתְּחוּ")
        ),
        makeFuture(
          markedForm("אנתח", "אֲנַתֵּחַ"),
          markedForm("תנתח", "תְּנַתֵּחַ"),
          markedForm("תנתחי", "תְּנַתְּחִי"),
          markedForm("ינתח", "יְנַתֵּחַ"),
          markedForm("תנתח", "תְּנַתֵּחַ"),
          markedForm("ננתח", "נְנַתֵּחַ"),
          markedForm("תנתחו", "תְּנַתְּחוּ"),
          markedForm("ינתחו", "יְנַתְּחוּ")
        ),
        makeImperative(
          markedForm("נתח", "נַתֵּחַ"),
          markedForm("נתחי", "נַתְּחִי"),
          markedForm("נתחו", "נַתְּחוּ"),
          markedForm("נתחנה", "נַתֵּחְנָה")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of נ-ת-ח. Stored forms cover analytical and medical senses of 'to analyze/dissect'.",
      difficulty_level: 3,
      tags: ["piel", "seed", "analytical"],
      personal_priority: 78,
      category: "scientific_analytical",
    }),
    createVerbEntry({
      id: "advanced-verb-ladun",
      availability: getStarterVerbAvailability("advanced-verb-ladun"),
      lemma: "לדון",
      lemma_niqqud: "לָדוּן",
      root: ["ד", "י", "נ"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to discuss", "ב־", false)],
      forms: makeForms(
        makePresent(
          markedForm("דן", "דָּן"),
          markedForm("דנה", "דָּנָה"),
          markedForm("דנים", "דָּנִים"),
          markedForm("דנות", "דָּנוֹת")
        ),
        makePast(
          markedForm("דנתי", "דַּנְתִּי"),
          markedForm("דנת", "דַּנְתָּ"),
          markedForm("דנת", "דַּנְתְּ"),
          markedForm("דן", "דָּן"),
          markedForm("דנה", "דָּנָה"),
          markedForm("דנו", "דַּנּוּ"),
          markedForm("דנתם", "דַּנְתֶּם"),
          markedForm("דנתן", "דַּנְתֶּן"),
          markedForm("דנו", "דָּנוּ")
        ),
        makeFuture(
          markedForm("אדון", "אָדוּן"),
          markedForm("תדון", "תָּדוּן"),
          markedForm("תדוני", "תָּדוּנִי"),
          markedForm("ידון", "יָדוּן"),
          markedForm("תדון", "תָּדוּן"),
          markedForm("נדון", "נָדוּן"),
          markedForm("תדונו", "תָּדוּנוּ"),
          markedForm("ידונו", "יָדוּנוּ")
        ),
        makeImperative(
          markedForm("דון", "דּוּן"),
          markedForm("דוני", "דּוּנִי"),
          markedForm("דונו", "דּוּנוּ"),
          markedForm("דונה", "דּוּנָה")
        )
      ),
      review_status: "approved",
      notes: "Pa'al hollow verb used with ב־ for 'to discuss a subject'.",
      difficulty_level: 3,
      tags: ["paal", "seed", "discussion"],
      personal_priority: 77,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "advanced-verb-lehitkayem",
      availability: getStarterVerbAvailability("advanced-verb-lehitkayem"),
      lemma: "להתקיים",
      lemma_niqqud: "לְהִתְקַיֵּם",
      root: ["ק", "ו", "מ"],
      binyan: "hitpael",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to take place", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתקיים", "מִתְקַיֵּם"),
          markedForm("מתקיימת", "מִתְקַיֶּמֶת"),
          markedForm("מתקיימים", "מִתְקַיְּמִים"),
          markedForm("מתקיימות", "מִתְקַיְּמוֹת")
        ),
        makePast(
          markedForm("התקיימתי", "הִתְקַיַּמְתִּי"),
          markedForm("התקיימת", "הִתְקַיַּמְתָּ"),
          markedForm("התקיימת", "הִתְקַיַּמְתְּ"),
          markedForm("התקיים", "הִתְקַיֵּם"),
          markedForm("התקיימה", "הִתְקַיְּמָה"),
          markedForm("התקיימנו", "הִתְקַיַּמְנוּ"),
          markedForm("התקיימתם", "הִתְקַיַּמְתֶּם"),
          markedForm("התקיימתן", "הִתְקַיַּמְתֶּן"),
          markedForm("התקיימו", "הִתְקַיְּמוּ")
        ),
        makeFuture(
          markedForm("אתקיים", "אֶתְקַיֵּם"),
          markedForm("תתקיים", "תִּתְקַיֵּם"),
          markedForm("תתקיימי", "תִּתְקַיְּמִי"),
          markedForm("יתקיים", "יִתְקַיֵּם"),
          markedForm("תתקיים", "תִּתְקַיֵּם"),
          markedForm("נתקיים", "נִתְקַיֵּם"),
          markedForm("תתקיימו", "תִּתְקַיְּמוּ"),
          markedForm("יתקיימו", "יִתְקַיְּמוּ")
        ),
        makeImperative(
          markedForm("התקיים", "הִתְקַיֵּם"),
          markedForm("התקיימי", "הִתְקַיְּמִי"),
          markedForm("התקיימו", "הִתְקַיְּמוּ"),
          markedForm("התקיימנה", "הִתְקַיֵּמְנָה")
        )
      ),
      review_status: "approved",
      notes: "Hitpa'el event verb: 'to take place' or 'to be held', especially for meetings, ceremonies, and events.",
      difficulty_level: 4,
      tags: ["hitpael", "seed", "events"],
      personal_priority: 76,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "advanced-verb-learach",
      availability: getStarterVerbAvailability("advanced-verb-learach"),
      lemma: "לארח",
      lemma_niqqud: "לְאָרֵחַ",
      root: ["א", "ר", "ח"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to host", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מארח", "מְאָרֵחַ"),
          markedForm("מארחת", "מְאָרַחַת"),
          markedForm("מארחים", "מְאָרְחִים"),
          markedForm("מארחות", "מְאָרְחוֹת")
        ),
        makePast(
          markedForm("אירחתי", "אֵרַחְתִּי"),
          markedForm("אירחת", "אֵרַחְתָּ"),
          markedForm("אירחת", "אֵרַחְתְּ"),
          markedForm("אירח", "אֵרֵחַ"),
          markedForm("אירחה", "אֵרְחָה"),
          markedForm("אירחנו", "אֵרַחְנוּ"),
          markedForm("אירחתם", "אֵרַחְתֶּם"),
          markedForm("אירחתן", "אֵרַחְתֶּן"),
          markedForm("אירחו", "אֵרְחוּ")
        ),
        makeFuture(
          markedForm("אארח", "אֲאָרֵחַ"),
          markedForm("תארח", "תְּאָרֵחַ"),
          markedForm("תארחי", "תְּאָרְחִי"),
          markedForm("יארח", "יְאָרֵחַ"),
          markedForm("תארח", "תְּאָרֵחַ"),
          markedForm("נארח", "נְאָרֵחַ"),
          markedForm("תארחו", "תְּאָרְחוּ"),
          markedForm("יארחו", "יְאָרְחוּ")
        ),
        makeImperative(
          markedForm("ארח", "אָרֵחַ"),
          markedForm("ארחי", "אָרְחִי"),
          markedForm("ארחו", "אָרְחוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el verb with guttural middle radical (ר) and final guttural (ח): 'to host' guests.",
      difficulty_level: 3,
      tags: ["piel", "seed", "hosting"],
      personal_priority: 74,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "advanced-verb-lehishtamesh",
      availability: getStarterVerbAvailability("advanced-verb-lehishtamesh"),
      lemma: "להשתמש",
      lemma_niqqud: "לְהִשְׁתַּמֵּשׁ",
      root: ["ש", "מ", "ש"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to use", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("משתמש", "מִשְׁתַּמֵּשׁ"),
          markedForm("משתמשת", "מִשְׁתַּמֶּשֶׁת"),
          markedForm("משתמשים", "מִשְׁתַּמְּשִׁים"),
          markedForm("משתמשות", "מִשְׁתַּמְּשׁוֹת")
        ),
        makePast(
          markedForm("השתמשתי", "הִשְׁתַּמַּשְׁתִּי"),
          markedForm("השתמשת", "הִשְׁתַּמַּשְׁתָּ"),
          markedForm("השתמשת", "הִשְׁתַּמַּשְׁתְּ"),
          markedForm("השתמש", "הִשְׁתַּמֵּשׁ"),
          markedForm("השתמשה", "הִשְׁתַּמְּשָׁה"),
          markedForm("השתמשנו", "הִשְׁתַּמַּשְׁנוּ"),
          markedForm("השתמשתם", "הִשְׁתַּמַּשְׁתֶּם"),
          markedForm("השתמשתן", "הִשְׁתַּמַּשְׁתֶּן"),
          markedForm("השתמשו", "הִשְׁתַּמְּשׁוּ")
        ),
        makeFuture(
          markedForm("אשתמש", "אֶשְׁתַּמֵּשׁ"),
          markedForm("תשתמש", "תִּשְׁתַּמֵּשׁ"),
          markedForm("תשתמשי", "תִּשְׁתַּמְּשִׁי"),
          markedForm("ישתמש", "יִשְׁתַּמֵּשׁ"),
          markedForm("תשתמש", "תִּשְׁתַּמֵּשׁ"),
          markedForm("נשתמש", "נִשְׁתַּמֵּשׁ"),
          markedForm("תשתמשו", "תִּשְׁתַּמְּשׁוּ"),
          markedForm("ישתמשו", "יִשְׁתַּמְּשׁוּ")
        ),
        makeImperative(
          markedForm("השתמש", "הִשְׁתַּמֵּשׁ"),
          markedForm("השתמשי", "הִשְׁתַּמְּשִׁי"),
          markedForm("השתמשו", "הִשְׁתַּמְּשׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Hitpa'el verb 'to use'; takes ב־ (להשתמש ב־ — to use something).",
      difficulty_level: 2,
      tags: ["hitpael", "seed", "everyday"],
      personal_priority: 82,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "advanced-verb-letaken",
      availability: getStarterVerbAvailability("advanced-verb-letaken"),
      lemma: "לתקן",
      lemma_niqqud: "לְתַקֵּן",
      root: ["ת", "ק", "נ"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to fix", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתקן", "מְתַקֵּן"),
          markedForm("מתקנת", "מְתַקֶּנֶת"),
          markedForm("מתקנים", "מְתַקְּנִים"),
          markedForm("מתקנות", "מְתַקְּנוֹת")
        ),
        makePast(
          markedForm("תיקנתי", "תִּקַּנְתִּי"),
          markedForm("תיקנת", "תִּקַּנְתָּ"),
          markedForm("תיקנת", "תִּקַּנְתְּ"),
          markedForm("תיקן", "תִּקֵּן"),
          markedForm("תיקנה", "תִּקְּנָה"),
          markedForm("תיקנו", "תִּקַּנּוּ"),
          markedForm("תיקנתם", "תִּקַּנְתֶּם"),
          markedForm("תיקנתן", "תִּקַּנְתֶּן"),
          markedForm("תיקנו", "תִּקְּנוּ")
        ),
        makeFuture(
          markedForm("אתקן", "אֲתַקֵּן"),
          markedForm("תתקן", "תְּתַקֵּן"),
          markedForm("תתקני", "תְּתַקְּנִי"),
          markedForm("יתקן", "יְתַקֵּן"),
          markedForm("תתקן", "תְּתַקֵּן"),
          markedForm("נתקן", "נְתַקֵּן"),
          markedForm("תתקנו", "תְּתַקְּנוּ"),
          markedForm("יתקנו", "יְתַקְּנוּ")
        ),
        makeImperative(
          markedForm("תקן", "תַּקֵּן"),
          markedForm("תקני", "תַּקְּנִי"),
          markedForm("תקנו", "תַּקְּנוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of ת-ק-נ — to fix, repair, or correct. Stored authoritative forms.",
      difficulty_level: 2,
      tags: ["piel", "seed", "everyday"],
      personal_priority: 70,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "advanced-verb-lehochiach",
      availability: getStarterVerbAvailability("advanced-verb-lehochiach"),
      lemma: "להוכיח",
      lemma_niqqud: "לְהוֹכִיחַ",
      root: ["י", "כ", "ח"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to prove", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מוכיח", "מוֹכִיחַ"),
          markedForm("מוכיחה", "מוֹכִיחָה"),
          markedForm("מוכיחים", "מוֹכִיחִים"),
          markedForm("מוכיחות", "מוֹכִיחוֹת")
        ),
        makePast(
          markedForm("הוכחתי", "הוֹכַחְתִּי"),
          markedForm("הוכחת", "הוֹכַחְתָּ"),
          markedForm("הוכחת", "הוֹכַחְתְּ"),
          markedForm("הוכיח", "הוֹכִיחַ"),
          markedForm("הוכיחה", "הוֹכִיחָה"),
          markedForm("הוכחנו", "הוֹכַחְנוּ"),
          markedForm("הוכחתם", "הוֹכַחְתֶּם"),
          markedForm("הוכחתן", "הוֹכַחְתֶּן"),
          markedForm("הוכיחו", "הוֹכִיחוּ")
        ),
        makeFuture(
          markedForm("אוכיח", "אוֹכִיחַ"),
          markedForm("תוכיח", "תּוֹכִיחַ"),
          markedForm("תוכיחי", "תּוֹכִיחִי"),
          markedForm("יוכיח", "יוֹכִיחַ"),
          markedForm("תוכיח", "תּוֹכִיחַ"),
          markedForm("נוכיח", "נוֹכִיחַ"),
          markedForm("תוכיחו", "תּוֹכִיחוּ"),
          markedForm("יוכיחו", "יוֹכִיחוּ")
        ),
        makeImperative(
          markedForm("הוכח", "הוֹכֵחַ"),
          markedForm("הוכיחי", "הוֹכִיחִי"),
          markedForm("הוכיחו", "הוֹכִיחוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of י-כ-ח — to prove or demonstrate. Stored authoritative forms.",
      difficulty_level: 3,
      tags: ["hifil", "seed"],
      personal_priority: 68,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "advanced-verb-lehazhir",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להזהיר",
      lemma_niqqud: "לְהַזְהִיר",
      root: ["ז", "ה", "ר"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to warn", "את־ ... מפני/ש־", false)],
      forms: makeForms(
        makePresent(
          markedForm("מזהיר", "מַזְהִיר"),
          markedForm("מזהירה", "מַזְהִירָה"),
          markedForm("מזהירים", "מַזְהִירִים"),
          markedForm("מזהירות", "מַזְהִירוֹת")
        ),
        makePast(
          markedForm("הזהרתי", "הִזְהַרְתִּי"),
          markedForm("הזהרת", "הִזְהַרְתָּ"),
          markedForm("הזהרת", "הִזְהַרְתְּ"),
          markedForm("הזהיר", "הִזְהִיר"),
          markedForm("הזהירה", "הִזְהִירָה"),
          markedForm("הזהרנו", "הִזְהַרְנוּ"),
          markedForm("הזהרתם", "הִזְהַרְתֶּם"),
          markedForm("הזהרתן", "הִזְהַרְתֶּן"),
          markedForm("הזהירו", "הִזְהִירוּ")
        ),
        makeFuture(
          markedForm("אזהיר", "אַזְהִיר"),
          markedForm("תזהיר", "תַּזְהִיר"),
          markedForm("תזהירי", "תַּזְהִירִי"),
          markedForm("יזהיר", "יַזְהִיר"),
          markedForm("תזהיר", "תַּזְהִיר"),
          markedForm("נזהיר", "נַזְהִיר"),
          markedForm("תזהירו", "תַּזְהִירוּ"),
          markedForm("יזהירו", "יַזְהִירוּ")
        ),
        makeImperative(
          markedForm("הזהר", "הַזְהֵר"),
          markedForm("הזהירי", "הַזְהִירִי"),
          markedForm("הזהירו", "הַזְהִירוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of ז-ה-ר — to warn someone about something or warn that something may happen. Stored authoritative forms.",
      difficulty_level: 3,
      tags: ["hifil", "seed", "communication"],
      personal_priority: 72,
      category: "core_advanced",
    }),
    createVerbEntry({
      id: "common-verb-laasot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לעשות",
      lemma_niqqud: "לַעֲשׂוֹת",
      root: ["ע", "שׂ", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to do", null, false), makeSense("to make", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("עושה", "עוֹשֶׂה"),
          markedForm("עושה", "עוֹשָׂה"),
          markedForm("עושים", "עוֹשִׂים"),
          markedForm("עושות", "עוֹשׂוֹת")
        ),
        makePast(
          markedForm("עשיתי", "עָשִׂיתִי"),
          markedForm("עשית", "עָשִׂיתָ"),
          markedForm("עשית", "עָשִׂית"),
          markedForm("עשה", "עָשָׂה"),
          markedForm("עשתה", "עָשְׂתָה"),
          markedForm("עשינו", "עָשִׂינוּ"),
          markedForm("עשיתם", "עֲשִׂיתֶם"),
          markedForm("עשיתן", "עֲשִׂיתֶן"),
          markedForm("עשו", "עָשׂוּ")
        ),
        makeFuture(
          markedForm("אעשה", "אֶעֱשֶׂה"),
          markedForm("תעשה", "תַּעֲשֶׂה"),
          markedForm("תעשי", "תַּעֲשִׂי"),
          markedForm("יעשה", "יַעֲשֶׂה"),
          markedForm("תעשה", "תַּעֲשֶׂה"),
          markedForm("נעשה", "נַעֲשֶׂה"),
          markedForm("תעשו", "תַּעֲשׂוּ"),
          markedForm("יעשו", "יַעֲשׂוּ")
        ),
        makeImperative(
          markedForm("עשה", "עֲשֵׂה"),
          markedForm("עשי", "עֲשִׂי"),
          markedForm("עשו", "עֲשׂוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ה verb (ע-שׂ-ה), one of the most common Hebrew verbs.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 67,
    }),
    createVerbEntry({
      id: "common-verb-lirtzot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לרצות",
      lemma_niqqud: "לִרְצוֹת",
      root: ["ר", "צ", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to want", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("רוצה", "רוֹצֶה"),
          markedForm("רוצה", "רוֹצָה"),
          markedForm("רוצים", "רוֹצִים"),
          markedForm("רוצות", "רוֹצוֹת")
        ),
        makePast(
          markedForm("רציתי", "רָצִיתִי"),
          markedForm("רצית", "רָצִיתָ"),
          markedForm("רצית", "רָצִית"),
          markedForm("רצה", "רָצָה"),
          markedForm("רצתה", "רָצְתָה"),
          markedForm("רצינו", "רָצִינוּ"),
          markedForm("רציתם", "רְצִיתֶם"),
          markedForm("רציתן", "רְצִיתֶן"),
          markedForm("רצו", "רָצוּ")
        ),
        makeFuture(
          markedForm("ארצה", "אֶרְצֶה"),
          markedForm("תרצה", "תִּרְצֶה"),
          markedForm("תרצי", "תִּרְצִי"),
          markedForm("ירצה", "יִרְצֶה"),
          markedForm("תרצה", "תִּרְצֶה"),
          markedForm("נרצה", "נִרְצֶה"),
          markedForm("תרצו", "תִּרְצוּ"),
          markedForm("ירצו", "יִרְצוּ")
        ),
        makeImperative(
          markedForm("רצה", "רְצֵה"),
          markedForm("רצי", "רְצִי"),
          markedForm("רצו", "רְצוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ה verb (ר-צ-ה) for 'to want'.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-liknot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לקנות",
      lemma_niqqud: "לִקְנוֹת",
      root: ["ק", "נ", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to buy", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("קונה", "קוֹנֶה"),
          markedForm("קונה", "קוֹנָה"),
          markedForm("קונים", "קוֹנִים"),
          markedForm("קונות", "קוֹנוֹת")
        ),
        makePast(
          markedForm("קניתי", "קָנִיתִי"),
          markedForm("קנית", "קָנִיתָ"),
          markedForm("קנית", "קָנִית"),
          markedForm("קנה", "קָנָה"),
          markedForm("קנתה", "קָנְתָה"),
          markedForm("קנינו", "קָנִינוּ"),
          markedForm("קניתם", "קְנִיתֶם"),
          markedForm("קניתן", "קְנִיתֶן"),
          markedForm("קנו", "קָנוּ")
        ),
        makeFuture(
          markedForm("אקנה", "אֶקְנֶה"),
          markedForm("תקנה", "תִּקְנֶה"),
          markedForm("תקני", "תִּקְנִי"),
          markedForm("יקנה", "יִקְנֶה"),
          markedForm("תקנה", "תִּקְנֶה"),
          markedForm("נקנה", "נִקְנֶה"),
          markedForm("תקנו", "תִּקְנוּ"),
          markedForm("יקנו", "יִקְנוּ")
        ),
        makeImperative(
          markedForm("קנה", "קְנֵה"),
          markedForm("קני", "קְנִי"),
          markedForm("קנו", "קְנוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ה verb (ק-נ-ה) for 'to buy'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 65,
    }),
    createVerbEntry({
      id: "common-verb-laanot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לענות",
      lemma_niqqud: "לַעֲנוֹת",
      root: ["ע", "נ", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to answer", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("עונה", "עוֹנֶה"),
          markedForm("עונה", "עוֹנָה"),
          markedForm("עונים", "עוֹנִים"),
          markedForm("עונות", "עוֹנוֹת")
        ),
        makePast(
          markedForm("עניתי", "עָנִיתִי"),
          markedForm("ענית", "עָנִיתָ"),
          markedForm("ענית", "עָנִית"),
          markedForm("ענה", "עָנָה"),
          markedForm("ענתה", "עָנְתָה"),
          markedForm("ענינו", "עָנִינוּ"),
          markedForm("עניתם", "עֲנִיתֶם"),
          markedForm("עניתן", "עֲנִיתֶן"),
          markedForm("ענו", "עָנוּ")
        ),
        makeFuture(
          markedForm("אענה", "אֶעֱנֶה"),
          markedForm("תענה", "תַּעֲנֶה"),
          markedForm("תעני", "תַּעֲנִי"),
          markedForm("יענה", "יַעֲנֶה"),
          markedForm("תענה", "תַּעֲנֶה"),
          markedForm("נענה", "נַעֲנֶה"),
          markedForm("תענו", "תַּעֲנוּ"),
          markedForm("יענו", "יַעֲנוּ")
        ),
        makeImperative(
          markedForm("ענה", "עֲנֵה"),
          markedForm("עני", "עֲנִי"),
          markedForm("ענו", "עֲנוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ה verb (ע-נ-ה) for 'to answer'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "lamed-hey"],
      personal_priority: 60,
    }),
    createVerbEntry({
      id: "common-verb-lichyot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לחיות",
      lemma_niqqud: "לִחְיוֹת",
      root: ["ח", "י", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to live", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("חי", "חַי"),
          markedForm("חיה", "חַיָּה"),
          markedForm("חיים", "חַיִּים"),
          markedForm("חיות", "חַיּוֹת")
        ),
        makePast(
          markedForm("חייתי", "חָיִיתִי"),
          markedForm("חיית", "חָיִיתָ"),
          markedForm("חיית", "חָיִית"),
          markedForm("חי", "חַי"),
          markedForm("חיתה", "חָיְתָה"),
          markedForm("חיינו", "חָיִינוּ"),
          markedForm("חייתם", "חֲיִיתֶם"),
          markedForm("חייתן", "חֲיִיתֶן"),
          markedForm("חיו", "חָיוּ")
        ),
        makeFuture(
          markedForm("אחיה", "אֶחְיֶה"),
          markedForm("תחיה", "תִּחְיֶה"),
          markedForm("תחיי", "תִּחְיִי"),
          markedForm("יחיה", "יִחְיֶה"),
          markedForm("תחיה", "תִּחְיֶה"),
          markedForm("נחיה", "נִחְיֶה"),
          markedForm("תחיו", "תִּחְיוּ"),
          markedForm("יחיו", "יִחְיוּ")
        ),
        makeImperative(
          markedForm("חיה", "חֲיֵה"),
          markedForm("חיי", "חֲיִי"),
          markedForm("חיו", "חֲיוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ה verb (ח-י-ה) for 'to live / be alive'.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "lamed-hey"],
      personal_priority: 58,
    }),
    createVerbEntry({
      id: "common-verb-likro",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לקרוא",
      lemma_niqqud: "לִקְרוֹא",
      root: ["ק", "ר", "א"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to read", null, false), makeSense("to call", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("קורא", "קוֹרֵא"),
          markedForm("קוראת", "קוֹרֵאת"),
          markedForm("קוראים", "קוֹרְאִים"),
          markedForm("קוראות", "קוֹרְאוֹת")
        ),
        makePast(
          markedForm("קראתי", "קָרָאתִי"),
          markedForm("קראת", "קָרָאתָ"),
          markedForm("קראת", "קָרָאת"),
          markedForm("קרא", "קָרָא"),
          markedForm("קראה", "קָרְאָה"),
          markedForm("קראנו", "קָרָאנוּ"),
          markedForm("קראתם", "קְרָאתֶם"),
          markedForm("קראתן", "קְרָאתֶן"),
          markedForm("קראו", "קָרְאוּ")
        ),
        makeFuture(
          markedForm("אקרא", "אֶקְרָא"),
          markedForm("תקרא", "תִּקְרָא"),
          markedForm("תקראי", "תִּקְרְאִי"),
          markedForm("יקרא", "יִקְרָא"),
          markedForm("תקרא", "תִּקְרָא"),
          markedForm("נקרא", "נִקְרָא"),
          markedForm("תקראו", "תִּקְרְאוּ"),
          markedForm("יקראו", "יִקְרְאוּ")
        ),
        makeImperative(
          markedForm("קרא", "קְרָא"),
          markedForm("קראי", "קִרְאִי"),
          markedForm("קראו", "קִרְאוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"א verb (ק-ר-א) for 'to read' and 'to call'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "lamed-aleph", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-limtzo",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "למצוא",
      lemma_niqqud: "לִמְצוֹא",
      root: ["מ", "צ", "א"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to find", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מוצא", "מוֹצֵא"),
          markedForm("מוצאת", "מוֹצֵאת"),
          markedForm("מוצאים", "מוֹצְאִים"),
          markedForm("מוצאות", "מוֹצְאוֹת")
        ),
        makePast(
          markedForm("מצאתי", "מָצָאתִי"),
          markedForm("מצאת", "מָצָאתָ"),
          markedForm("מצאת", "מָצָאת"),
          markedForm("מצא", "מָצָא"),
          markedForm("מצאה", "מָצְאָה"),
          markedForm("מצאנו", "מָצָאנוּ"),
          markedForm("מצאתם", "מְצָאתֶם"),
          markedForm("מצאתן", "מְצָאתֶן"),
          markedForm("מצאו", "מָצְאוּ")
        ),
        makeFuture(
          markedForm("אמצא", "אֶמְצָא"),
          markedForm("תמצא", "תִּמְצָא"),
          markedForm("תמצאי", "תִּמְצְאִי"),
          markedForm("ימצא", "יִמְצָא"),
          markedForm("תמצא", "תִּמְצָא"),
          markedForm("נמצא", "נִמְצָא"),
          markedForm("תמצאו", "תִּמְצְאוּ"),
          markedForm("ימצאו", "יִמְצְאוּ")
        ),
        makeImperative(
          markedForm("מצא", "מְצָא"),
          markedForm("מצאי", "מִצְאִי"),
          markedForm("מצאו", "מִצְאוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"א verb (מ-צ-א) for 'to find'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "lamed-aleph"],
      personal_priority: 59,
    }),
    createVerbEntry({
      id: "common-verb-lishol",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לשאול",
      lemma_niqqud: "לִשְׁאוֹל",
      root: ["ש", "א", "ל"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to ask", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("שואל", "שׁוֹאֵל"),
          markedForm("שואלת", "שׁוֹאֶלֶת"),
          markedForm("שואלים", "שׁוֹאֲלִים"),
          markedForm("שואלות", "שׁוֹאֲלוֹת")
        ),
        makePast(
          markedForm("שאלתי", "שָׁאַלְתִּי"),
          markedForm("שאלת", "שָׁאַלְתָּ"),
          markedForm("שאלת", "שָׁאַלְתְּ"),
          markedForm("שאל", "שָׁאַל"),
          markedForm("שאלה", "שָׁאֲלָה"),
          markedForm("שאלנו", "שָׁאַלְנוּ"),
          markedForm("שאלתם", "שְׁאַלְתֶּם"),
          markedForm("שאלתן", "שְׁאַלְתֶּן"),
          markedForm("שאלו", "שָׁאֲלוּ")
        ),
        makeFuture(
          markedForm("אשאל", "אֶשְׁאַל"),
          markedForm("תשאל", "תִּשְׁאַל"),
          markedForm("תשאלי", "תִּשְׁאֲלִי"),
          markedForm("ישאל", "יִשְׁאַל"),
          markedForm("תשאל", "תִּשְׁאַל"),
          markedForm("נשאל", "נִשְׁאַל"),
          markedForm("תשאלו", "תִּשְׁאֲלוּ"),
          markedForm("ישאלו", "יִשְׁאֲלוּ")
        ),
        makeImperative(
          markedForm("שאל", "שְׁאַל"),
          markedForm("שאלי", "שַׁאֲלִי"),
          markedForm("שאלו", "שַׁאֲלוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al verb (ש-א-ל) with guttural middle radical, for 'to ask'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "guttural"],
      personal_priority: 61,
    }),
    createVerbEntry({
      id: "common-verb-ladaat",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לדעת",
      lemma_niqqud: "לָדַעַת",
      root: ["י", "ד", "ע"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to know", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("יודע", "יוֹדֵעַ"),
          markedForm("יודעת", "יוֹדַעַת"),
          markedForm("יודעים", "יוֹדְעִים"),
          markedForm("יודעות", "יוֹדְעוֹת")
        ),
        makePast(
          markedForm("ידעתי", "יָדַעְתִּי"),
          markedForm("ידעת", "יָדַעְתָּ"),
          markedForm("ידעת", "יָדַעְתְּ"),
          markedForm("ידע", "יָדַע"),
          markedForm("ידעה", "יָדְעָה"),
          markedForm("ידענו", "יָדַעְנוּ"),
          markedForm("ידעתם", "יְדַעְתֶּם"),
          markedForm("ידעתן", "יְדַעְתֶּן"),
          markedForm("ידעו", "יָדְעוּ")
        ),
        makeFuture(
          markedForm("אדע", "אֵדַע"),
          markedForm("תדע", "תֵּדַע"),
          markedForm("תדעי", "תֵּדְעִי"),
          markedForm("ידע", "יֵדַע"),
          markedForm("תדע", "תֵּדַע"),
          markedForm("נדע", "נֵדַע"),
          markedForm("תדעו", "תֵּדְעוּ"),
          markedForm("ידעו", "יֵדְעוּ")
        ),
        makeImperative(
          markedForm("דע", "דַּע"),
          markedForm("דעי", "דְּעִי"),
          markedForm("דעו", "דְּעוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al פ\"י verb (י-ד-ע) with guttural final radical, for 'to know'.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "pe-yod", "high-frequency"],
      personal_priority: 67,
    }),
    createVerbEntry({
      id: "common-verb-latzet",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לצאת",
      lemma_niqqud: "לָצֵאת",
      root: ["י", "צ", "א"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to go out", null, false), makeSense("to leave", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("יוצא", "יוֹצֵא"),
          markedForm("יוצאת", "יוֹצֵאת"),
          markedForm("יוצאים", "יוֹצְאִים"),
          markedForm("יוצאות", "יוֹצְאוֹת")
        ),
        makePast(
          markedForm("יצאתי", "יָצָאתִי"),
          markedForm("יצאת", "יָצָאתָ"),
          markedForm("יצאת", "יָצָאת"),
          markedForm("יצא", "יָצָא"),
          markedForm("יצאה", "יָצְאָה"),
          markedForm("יצאנו", "יָצָאנוּ"),
          markedForm("יצאתם", "יְצָאתֶם"),
          markedForm("יצאתן", "יְצָאתֶן"),
          markedForm("יצאו", "יָצְאוּ")
        ),
        makeFuture(
          markedForm("אצא", "אֵצֵא"),
          markedForm("תצא", "תֵּצֵא"),
          markedForm("תצאי", "תֵּצְאִי"),
          markedForm("יצא", "יֵצֵא"),
          markedForm("תצא", "תֵּצֵא"),
          markedForm("נצא", "נֵצֵא"),
          markedForm("תצאו", "תֵּצְאוּ"),
          markedForm("יצאו", "יֵצְאוּ")
        ),
        makeImperative(
          markedForm("צא", "צֵא"),
          markedForm("צאי", "צְאִי"),
          markedForm("צאו", "צְאוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al doubly-weak verb (י-צ-א, פ\"י + ל\"א) for 'to go out / leave'.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "pe-yod", "lamed-aleph", "high-frequency"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-lishon",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לישון",
      lemma_niqqud: "לִישׁוֹן",
      root: ["י", "ש", "נ"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to sleep", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("ישן", "יָשֵׁן"),
          markedForm("ישנה", "יְשֵׁנָה"),
          markedForm("ישנים", "יְשֵׁנִים"),
          markedForm("ישנות", "יְשֵׁנוֹת")
        ),
        makePast(
          markedForm("ישנתי", "יָשַׁנְתִּי"),
          markedForm("ישנת", "יָשַׁנְתָּ"),
          markedForm("ישנת", "יָשַׁנְתְּ"),
          markedForm("ישן", "יָשַׁן"),
          markedForm("ישנה", "יָשְׁנָה"),
          markedForm("ישנו", "יָשַׁנּוּ"),
          markedForm("ישנתם", "יְשַׁנְתֶּם"),
          markedForm("ישנתן", "יְשַׁנְתֶּן"),
          markedForm("ישנו", "יָשְׁנוּ")
        ),
        makeFuture(
          markedForm("אישן", "אִישַׁן"),
          markedForm("תישן", "תִּישַׁן"),
          markedForm("תישני", "תִּישְׁנִי"),
          markedForm("יישן", "יִישַׁן"),
          markedForm("תישן", "תִּישַׁן"),
          markedForm("נישן", "נִישַׁן"),
          markedForm("תישנו", "תִּישְׁנוּ"),
          markedForm("יישנו", "יִישְׁנוּ")
        ),
        makeImperative(
          markedForm("ישן", "יְשַׁן"),
          markedForm("ישני", "יִשְׁנִי"),
          markedForm("ישנו", "יִשְׁנוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al פ\"י verb (י-ש-נ) for 'to sleep'.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "pe-yod"],
      personal_priority: 60,
    }),
    createVerbEntry({
      id: "common-verb-lipol",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "ליפול",
      lemma_niqqud: "לִיפֹּל",
      root: ["נ", "פ", "ל"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to fall", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נופל", "נוֹפֵל"),
          markedForm("נופלת", "נוֹפֶלֶת"),
          markedForm("נופלים", "נוֹפְלִים"),
          markedForm("נופלות", "נוֹפְלוֹת")
        ),
        makePast(
          markedForm("נפלתי", "נָפַלְתִּי"),
          markedForm("נפלת", "נָפַלְתָּ"),
          markedForm("נפלת", "נָפַלְתְּ"),
          markedForm("נפל", "נָפַל"),
          markedForm("נפלה", "נָפְלָה"),
          markedForm("נפלנו", "נָפַלְנוּ"),
          markedForm("נפלתם", "נְפַלְתֶּם"),
          markedForm("נפלתן", "נְפַלְתֶּן"),
          markedForm("נפלו", "נָפְלוּ")
        ),
        makeFuture(
          markedForm("אפול", "אֶפֹּל"),
          markedForm("תיפול", "תִּפֹּל"),
          markedForm("תיפלי", "תִּפְּלִי"),
          markedForm("ייפול", "יִפֹּל"),
          markedForm("תיפול", "תִּפֹּל"),
          markedForm("ניפול", "נִפֹּל"),
          markedForm("תיפלו", "תִּפְּלוּ"),
          markedForm("ייפלו", "יִפְּלוּ")
        ),
        makeImperative(
          markedForm("נפול", "נְפֹל"),
          markedForm("נפלי", "נִפְלִי"),
          markedForm("נפלו", "נִפְלוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al פ\"נ verb (נ-פ-ל); the nun assimilates in the future, for 'to fall'.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "pe-nun"],
      personal_priority: 57,
    }),
    createVerbEntry({
      id: "common-verb-lakum",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לקום",
      lemma_niqqud: "לָקוּם",
      root: ["ק", "ו", "מ"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to get up", null, false), makeSense("to rise", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("קם", "קָם"),
          markedForm("קמה", "קָמָה"),
          markedForm("קמים", "קָמִים"),
          markedForm("קמות", "קָמוֹת")
        ),
        makePast(
          markedForm("קמתי", "קַמְתִּי"),
          markedForm("קמת", "קַמְתָּ"),
          markedForm("קמת", "קַמְתְּ"),
          markedForm("קם", "קָם"),
          markedForm("קמה", "קָמָה"),
          markedForm("קמנו", "קַמְנוּ"),
          markedForm("קמתם", "קַמְתֶּם"),
          markedForm("קמתן", "קַמְתֶּן"),
          markedForm("קמו", "קָמוּ")
        ),
        makeFuture(
          markedForm("אקום", "אָקוּם"),
          markedForm("תקום", "תָּקוּם"),
          markedForm("תקומי", "תָּקוּמִי"),
          markedForm("יקום", "יָקוּם"),
          markedForm("תקום", "תָּקוּם"),
          markedForm("נקום", "נָקוּם"),
          markedForm("תקומו", "תָּקוּמוּ"),
          markedForm("יקומו", "יָקוּמוּ")
        ),
        makeImperative(
          markedForm("קום", "קוּם"),
          markedForm("קומי", "קוּמִי"),
          markedForm("קומו", "קוּמוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al hollow verb (ע\"ו, ק-ו-מ) for 'to get up / rise'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "hollow"],
      personal_priority: 62,
    }),
    createVerbEntry({
      id: "common-verb-lehitztarech",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להצטרך",
      lemma_niqqud: "לְהִצְטָרֵךְ",
      root: ["צ", "ר", "כ"],
      binyan: "hitpael",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to need", null, false)],
      forms: makeForms(
        null,
        makePast(
          markedForm("הצטרכתי", "הִצְטָרַכְתִּי"),
          markedForm("הצטרכת", "הִצְטָרַכְתָּ"),
          markedForm("הצטרכת", "הִצְטָרַכְתְּ"),
          markedForm("הצטרך", "הִצְטָרֵךְ"),
          markedForm("הצטרכה", "הִצְטָרְכָה"),
          markedForm("הצטרכנו", "הִצְטָרַכְנוּ"),
          markedForm("הצטרכתם", "הִצְטָרַכְתֶּם"),
          markedForm("הצטרכתן", "הִצְטָרַכְתֶּן"),
          markedForm("הצטרכו", "הִצְטָרְכוּ")
        ),
        makeFuture(
          markedForm("אצטרך", "אֶצְטָרֵךְ"),
          markedForm("תצטרך", "תִּצְטָרֵךְ"),
          markedForm("תצטרכי", "תִּצְטָרְכִי"),
          markedForm("יצטרך", "יִצְטָרֵךְ"),
          markedForm("תצטרך", "תִּצְטָרֵךְ"),
          markedForm("נצטרך", "נִצְטָרֵךְ"),
          markedForm("תצטרכו", "תִּצְטָרְכוּ"),
          markedForm("יצטרכו", "יִצְטָרְכוּ")
        )
      ),
      review_status: "approved",
      notes: "Hitpa'el of צ-ר-כ with the standard צ+ת→צט metathesis. Supplies the past (הצטרכתי 'needed') and future (אצטרך 'will need') of the suppletive 'need' paradigm; the present is the modal צריך/צריכה/צריכים/צריכות, taught as a sentence pattern rather than drilled here. No imperative in normal use.",
      difficulty_level: 3,
      tags: ["hitpael", "irregular", "modal"],
      personal_priority: 70,
    }),
    createVerbEntry({
      id: "common-verb-lachshov",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לחשוב",
      lemma_niqqud: "לַחְשֹׁב",
      root: ["ח", "ש", "ב"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      generation_pattern: "paal_o",
      senses: [makeSense("to think", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("חושב", "חוֹשֵׁב"),
          markedForm("חושבת", "חוֹשֶׁבֶת"),
          markedForm("חושבים", "חוֹשְׁבִים"),
          markedForm("חושבות", "חוֹשְׁבוֹת")
        ),
        makePast(
          markedForm("חשבתי", "חָשַׁבְתִּי"),
          markedForm("חשבת", "חָשַׁבְתָּ"),
          markedForm("חשבת", "חָשַׁבְתְּ"),
          markedForm("חשב", "חָשַׁב"),
          markedForm("חשבה", "חָשְׁבָה"),
          markedForm("חשבנו", "חָשַׁבְנוּ"),
          markedForm("חשבתם", "חֲשַׁבְתֶּם"),
          markedForm("חשבתן", "חֲשַׁבְתֶּן"),
          markedForm("חשבו", "חָשְׁבוּ")
        ),
        makeFuture(
          markedForm("אחשוב", "אֶחְשׁוֹב"),
          markedForm("תחשוב", "תַּחְשׁוֹב"),
          markedForm("תחשבי", "תַּחְשְׁבִי"),
          markedForm("יחשוב", "יַחְשׁוֹב"),
          markedForm("תחשוב", "תַּחְשׁוֹב"),
          markedForm("נחשוב", "נַחְשׁוֹב"),
          markedForm("תחשבו", "תַּחְשְׁבוּ"),
          markedForm("יחשבו", "יַחְשְׁבוּ")
        ),
        makeImperative(
          markedForm("חשוב", "חֲשֹׁב"),
          markedForm("חשבי", "חִשְׁבִי"),
          markedForm("חשבו", "חִשְׁבוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al strong verb (ח-ש-ב), o-future; first-radical guttural.",
      difficulty_level: 2,
      tags: ["paal", "regular"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-lizkor",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לזכור",
      lemma_niqqud: "לִזְכֹּר",
      root: ["ז", "כ", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      generation_pattern: "paal_o",
      senses: [makeSense("to remember", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("זוכר", "זוֹכֵר"),
          markedForm("זוכרת", "זוֹכֶרֶת"),
          markedForm("זוכרים", "זוֹכְרִים"),
          markedForm("זוכרות", "זוֹכְרוֹת")
        ),
        makePast(
          markedForm("זכרתי", "זָכַרְתִּי"),
          markedForm("זכרת", "זָכַרְתָּ"),
          markedForm("זכרת", "זָכַרְתְּ"),
          markedForm("זכר", "זָכַר"),
          markedForm("זכרה", "זָכְרָה"),
          markedForm("זכרנו", "זָכַרְנוּ"),
          markedForm("זכרתם", "זְכַרְתֶּם"),
          markedForm("זכרתן", "זְכַרְתֶּן"),
          markedForm("זכרו", "זָכְרוּ")
        ),
        makeFuture(
          markedForm("אזכור", "אֶזְכּוֹר"),
          markedForm("תזכור", "תִּזְכּוֹר"),
          markedForm("תזכרי", "תִּזְכְּרִי"),
          markedForm("יזכור", "יִזְכּוֹר"),
          markedForm("תזכור", "תִּזְכּוֹר"),
          markedForm("נזכור", "נִזְכּוֹר"),
          markedForm("תזכרו", "תִּזְכְּרוּ"),
          markedForm("יזכרו", "יִזְכְּרוּ")
        ),
        makeImperative(
          markedForm("זכור", "זְכֹר"),
          markedForm("זכרי", "זִכְרִי"),
          markedForm("זכרו", "זִכְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al strong verb (ז-כ-ר), o-future.",
      difficulty_level: 2,
      tags: ["paal", "regular"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-limkor",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "למכור",
      lemma_niqqud: "לִמְכֹּר",
      root: ["מ", "כ", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      generation_pattern: "paal_o",
      senses: [makeSense("to sell", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מוכר", "מוֹכֵר"),
          markedForm("מוכרת", "מוֹכֶרֶת"),
          markedForm("מוכרים", "מוֹכְרִים"),
          markedForm("מוכרות", "מוֹכְרוֹת")
        ),
        makePast(
          markedForm("מכרתי", "מָכַרְתִּי"),
          markedForm("מכרת", "מָכַרְתָּ"),
          markedForm("מכרת", "מָכַרְתְּ"),
          markedForm("מכר", "מָכַר"),
          markedForm("מכרה", "מָכְרָה"),
          markedForm("מכרנו", "מָכַרְנוּ"),
          markedForm("מכרתם", "מְכַרְתֶּם"),
          markedForm("מכרתן", "מְכַרְתֶּן"),
          markedForm("מכרו", "מָכְרוּ")
        ),
        makeFuture(
          markedForm("אמכור", "אֶמְכּוֹר"),
          markedForm("תמכור", "תִּמְכּוֹר"),
          markedForm("תמכרי", "תִּמְכְּרִי"),
          markedForm("ימכור", "יִמְכּוֹר"),
          markedForm("תמכור", "תִּמְכּוֹר"),
          markedForm("נמכור", "נִמְכּוֹר"),
          markedForm("תמכרו", "תִּמְכְּרוּ"),
          markedForm("ימכרו", "יִמְכְּרוּ")
        ),
        makeImperative(
          markedForm("מכור", "מְכֹר"),
          markedForm("מכרי", "מִכְרִי"),
          markedForm("מכרו", "מִכְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al strong verb (מ-כ-ר), o-future.",
      difficulty_level: 2,
      tags: ["paal", "regular"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-ligmor",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לגמור",
      lemma_niqqud: "לִגְמֹר",
      root: ["ג", "מ", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      generation_pattern: "paal_o",
      senses: [makeSense("to finish", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("גומר", "גּוֹמֵר"),
          markedForm("גומרת", "גּוֹמֶרֶת"),
          markedForm("גומרים", "גּוֹמְרִים"),
          markedForm("גומרות", "גּוֹמְרוֹת")
        ),
        makePast(
          markedForm("גמרתי", "גָּמַרְתִּי"),
          markedForm("גמרת", "גָּמַרְתָּ"),
          markedForm("גמרת", "גָּמַרְתְּ"),
          markedForm("גמר", "גָּמַר"),
          markedForm("גמרה", "גָּמְרָה"),
          markedForm("גמרנו", "גָּמַרְנוּ"),
          markedForm("גמרתם", "גְּמַרְתֶּם"),
          markedForm("גמרתן", "גְּמַרְתֶּן"),
          markedForm("גמרו", "גָּמְרוּ")
        ),
        makeFuture(
          markedForm("אגמור", "אֶגְמוֹר"),
          markedForm("תגמור", "תִּגְמוֹר"),
          markedForm("תגמרי", "תִּגְמְרִי"),
          markedForm("יגמור", "יִגְמוֹר"),
          markedForm("תגמור", "תִּגְמוֹר"),
          markedForm("נגמור", "נִגְמוֹר"),
          markedForm("תגמרו", "תִּגְמְרוּ"),
          markedForm("יגמרו", "יִגְמְרוּ")
        ),
        makeImperative(
          markedForm("גמור", "גְּמֹר"),
          markedForm("גמרי", "גִּמְרִי"),
          markedForm("גמרו", "גִּמְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al strong verb (ג-מ-ר), o-future.",
      difficulty_level: 2,
      tags: ["paal", "regular"],
      personal_priority: 62,
    }),
    createVerbEntry({
      id: "common-verb-levakesh",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לבקש",
      lemma_niqqud: "לְבַקֵּשׁ",
      root: ["ב", "ק", "ש"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to request", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מבקש", "מְבַקֵּשׁ"),
          markedForm("מבקשת", "מְבַקֶּשֶׁת"),
          markedForm("מבקשים", "מְבַקְּשִׁים"),
          markedForm("מבקשות", "מְבַקְּשׁוֹת")
        ),
        makePast(
          markedForm("ביקשתי", "בִּקַּשְׁתִּי"),
          markedForm("ביקשת", "בִּקַּשְׁתָּ"),
          markedForm("ביקשת", "בִּקַּשְׁתְּ"),
          markedForm("ביקש", "בִּקֵּשׁ"),
          markedForm("ביקשה", "בִּקְּשָׁה"),
          markedForm("ביקשנו", "בִּקַּשְׁנוּ"),
          markedForm("ביקשתם", "בִּקַּשְׁתֶּם"),
          markedForm("ביקשתן", "בִּקַּשְׁתֶּן"),
          markedForm("ביקשו", "בִּקְּשׁוּ")
        ),
        makeFuture(
          markedForm("אבקש", "אֲבַקֵּשׁ"),
          markedForm("תבקש", "תְּבַקֵּשׁ"),
          markedForm("תבקשי", "תְּבַקְּשִׁי"),
          markedForm("יבקש", "יְבַקֵּשׁ"),
          markedForm("תבקש", "תְּבַקֵּשׁ"),
          markedForm("נבקש", "נְבַקֵּשׁ"),
          markedForm("תבקשו", "תְּבַקְּשׁוּ"),
          markedForm("יבקשו", "יְבַקְּשׁוּ")
        ),
        makeImperative(
          markedForm("בקש", "בַּקֵּשׁ"),
          markedForm("בקשי", "בַּקְּשִׁי"),
          markedForm("בקשו", "בַּקְּשׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el strong verb (ב-ק-ש).",
      difficulty_level: 2,
      tags: ["piel", "regular"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-lesaper",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לספר",
      lemma_niqqud: "לְסַפֵּר",
      root: ["ס", "פ", "ר"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to tell", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מספר", "מְסַפֵּר"),
          markedForm("מספרת", "מְסַפֶּרֶת"),
          markedForm("מספרים", "מְסַפְּרִים"),
          markedForm("מספרות", "מְסַפְּרוֹת")
        ),
        makePast(
          markedForm("סיפרתי", "סִפַּרְתִּי"),
          markedForm("סיפרת", "סִפַּרְתָּ"),
          markedForm("סיפרת", "סִפַּרְתְּ"),
          markedForm("סיפר", "סִפֵּר"),
          markedForm("סיפרה", "סִפְּרָה"),
          markedForm("סיפרנו", "סִפַּרְנוּ"),
          markedForm("סיפרתם", "סִפַּרְתֶּם"),
          markedForm("סיפרתן", "סִפַּרְתֶּן"),
          markedForm("סיפרו", "סִפְּרוּ")
        ),
        makeFuture(
          markedForm("אספר", "אֲסַפֵּר"),
          markedForm("תספר", "תְּסַפֵּר"),
          markedForm("תספרי", "תְּסַפְּרִי"),
          markedForm("יספר", "יְסַפֵּר"),
          markedForm("תספר", "תְּסַפֵּר"),
          markedForm("נספר", "נְסַפֵּר"),
          markedForm("תספרו", "תְּסַפְּרוּ"),
          markedForm("יספרו", "יְסַפְּרוּ")
        ),
        makeImperative(
          markedForm("ספר", "סַפֵּר"),
          markedForm("ספרי", "סַפְּרִי"),
          markedForm("ספרו", "סַפְּרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el strong verb (ס-פ-ר).",
      difficulty_level: 2,
      tags: ["piel", "regular"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-leshalem",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לשלם",
      lemma_niqqud: "לְשַׁלֵּם",
      root: ["ש", "ל", "מ"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to pay", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("משלם", "מְשַׁלֵּם"),
          markedForm("משלמת", "מְשַׁלֶּמֶת"),
          markedForm("משלמים", "מְשַׁלְּמִים"),
          markedForm("משלמות", "מְשַׁלְּמוֹת")
        ),
        makePast(
          markedForm("שילמתי", "שִׁלַּמְתִּי"),
          markedForm("שילמת", "שִׁלַּמְתָּ"),
          markedForm("שילמת", "שִׁלַּמְתְּ"),
          markedForm("שילם", "שִׁלֵּם"),
          markedForm("שילמה", "שִׁלְּמָה"),
          markedForm("שילמנו", "שִׁלַּמְנוּ"),
          markedForm("שילמתם", "שִׁלַּמְתֶּם"),
          markedForm("שילמתן", "שִׁלַּמְתֶּן"),
          markedForm("שילמו", "שִׁלְּמוּ")
        ),
        makeFuture(
          markedForm("אשלם", "אֲשַׁלֵּם"),
          markedForm("תשלם", "תְּשַׁלֵּם"),
          markedForm("תשלמי", "תְּשַׁלְּמִי"),
          markedForm("ישלם", "יְשַׁלֵּם"),
          markedForm("תשלם", "תְּשַׁלֵּם"),
          markedForm("נשלם", "נְשַׁלֵּם"),
          markedForm("תשלמו", "תְּשַׁלְּמוּ"),
          markedForm("ישלמו", "יְשַׁלְּמוּ")
        ),
        makeImperative(
          markedForm("שלם", "שַׁלֵּם"),
          markedForm("שלמי", "שַׁלְּמִי"),
          markedForm("שלמו", "שַׁלְּמוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el strong verb (ש-ל-מ).",
      difficulty_level: 2,
      tags: ["piel", "regular"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-lekabel",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לקבל",
      lemma_niqqud: "לְקַבֵּל",
      root: ["ק", "ב", "ל"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to receive", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מקבל", "מְקַבֵּל"),
          markedForm("מקבלת", "מְקַבֶּלֶת"),
          markedForm("מקבלים", "מְקַבְּלִים"),
          markedForm("מקבלות", "מְקַבְּלוֹת")
        ),
        makePast(
          markedForm("קיבלתי", "קִבַּלְתִּי"),
          markedForm("קיבלת", "קִבַּלְתָּ"),
          markedForm("קיבלת", "קִבַּלְתְּ"),
          markedForm("קיבל", "קִבֵּל"),
          markedForm("קיבלה", "קִבְּלָה"),
          markedForm("קיבלנו", "קִבַּלְנוּ"),
          markedForm("קיבלתם", "קִבַּלְתֶּם"),
          markedForm("קיבלתן", "קִבַּלְתֶּן"),
          markedForm("קיבלו", "קִבְּלוּ")
        ),
        makeFuture(
          markedForm("אקבל", "אֲקַבֵּל"),
          markedForm("תקבל", "תְּקַבֵּל"),
          markedForm("תקבלי", "תְּקַבְּלִי"),
          markedForm("יקבל", "יְקַבֵּל"),
          markedForm("תקבל", "תְּקַבֵּל"),
          markedForm("נקבל", "נְקַבֵּל"),
          markedForm("תקבלו", "תְּקַבְּלוּ"),
          markedForm("יקבלו", "יְקַבְּלוּ")
        ),
        makeImperative(
          markedForm("קבל", "קַבֵּל"),
          markedForm("קבלי", "קַבְּלִי"),
          markedForm("קבלו", "קַבְּלוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el strong verb (ק-ב-ל).",
      difficulty_level: 2,
      tags: ["piel", "regular"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-lechapes",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לחפש",
      lemma_niqqud: "לְחַפֵּשׂ",
      root: ["ח", "פ", "ש"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to search", null, true)],
      forms: makeForms(
        makePresent(
          markedForm("מחפש", "מְחַפֵּשׂ"),
          markedForm("מחפשת", "מְחַפֶּשֶׂת"),
          markedForm("מחפשים", "מְחַפְּשִׂים"),
          markedForm("מחפשות", "מְחַפְּשׂוֹת")
        ),
        makePast(
          markedForm("חיפשתי", "חִפַּשְׂתִּי"),
          markedForm("חיפשת", "חִפַּשְׂתָּ"),
          markedForm("חיפשת", "חִפַּשְׂתְּ"),
          markedForm("חיפש", "חִפֵּשׂ"),
          markedForm("חיפשה", "חִפְּשָׂה"),
          markedForm("חיפשנו", "חִפַּשְׂנוּ"),
          markedForm("חיפשתם", "חִפַּשְׂתֶּם"),
          markedForm("חיפשתן", "חִפַּשְׂתֶּן"),
          markedForm("חיפשו", "חִפְּשׂוּ")
        ),
        makeFuture(
          markedForm("אחפש", "אֲחַפֵּשׂ"),
          markedForm("תחפש", "תְּחַפֵּשׂ"),
          markedForm("תחפשי", "תְּחַפְּשִׂי"),
          markedForm("יחפש", "יְחַפֵּשׂ"),
          markedForm("תחפש", "תְּחַפֵּשׂ"),
          markedForm("נחפש", "נְחַפֵּשׂ"),
          markedForm("תחפשו", "תְּחַפְּשׂוּ"),
          markedForm("יחפשו", "יְחַפְּשׂוּ")
        ),
        makeImperative(
          markedForm("חפש", "חַפֵּשׂ"),
          markedForm("חפשי", "חַפְּשִׂי"),
          markedForm("חפשו", "חַפְּשׂוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el strong verb (ח-פ-שׂ); first-radical guttural.",
      difficulty_level: 2,
      tags: ["piel", "regular"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-lashir",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לשיר",
      lemma_niqqud: "לָשִׁיר",
      root: ["ש", "י", "ר"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to sing", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("שר", "שָׁר"),
          markedForm("שרה", "שָׁרָה"),
          markedForm("שרים", "שָׁרִים"),
          markedForm("שרות", "שָׁרוֹת")
        ),
        makePast(
          markedForm("שרתי", "שַׁרְתִּי"),
          markedForm("שרת", "שַׁרְתָּ"),
          markedForm("שרת", "שַׁרְתְּ"),
          markedForm("שר", "שָׁר"),
          markedForm("שרה", "שָׁרָה"),
          markedForm("שרנו", "שַׁרְנוּ"),
          markedForm("שרתם", "שַׁרְתֶּם"),
          markedForm("שרתן", "שַׁרְתֶּן"),
          markedForm("שרו", "שָׁרוּ")
        ),
        makeFuture(
          markedForm("אשיר", "אָשִׁיר"),
          markedForm("תשיר", "תָּשִׁיר"),
          markedForm("תשירי", "תָּשִׁירִי"),
          markedForm("ישיר", "יָשִׁיר"),
          markedForm("תשיר", "תָּשִׁיר"),
          markedForm("נשיר", "נָשִׁיר"),
          markedForm("תשירו", "תָּשִׁירוּ"),
          markedForm("ישירו", "יָשִׁירוּ")
        ),
        makeImperative(
          markedForm("שיר", "שִׁיר"),
          markedForm("שירי", "שִׁירִי"),
          markedForm("שירו", "שִׁירוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al hollow verb (ע\"י, ש-י-ר) for 'to sing'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "hollow"],
      personal_priority: 55,
    }),
    createVerbEntry({
      id: "common-verb-lehavin",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להבין",
      lemma_niqqud: "לְהָבִין",
      root: ["ב", "י", "נ"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to understand", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מבין", "מֵבִין"),
          markedForm("מבינה", "מְבִינָה"),
          markedForm("מבינים", "מְבִינִים"),
          markedForm("מבינות", "מְבִינוֹת")
        ),
        makePast(
          markedForm("הבנתי", "הֵבַנְתִּי"),
          markedForm("הבנת", "הֵבַנְתָּ"),
          markedForm("הבנת", "הֵבַנְתְּ"),
          markedForm("הבין", "הֵבִין"),
          markedForm("הבינה", "הֵבִינָה"),
          markedForm("הבנו", "הֵבַנּוּ"),
          markedForm("הבנתם", "הֲבַנְתֶּם"),
          markedForm("הבנתן", "הֲבַנְתֶּן"),
          markedForm("הבינו", "הֵבִינוּ")
        ),
        makeFuture(
          markedForm("אבין", "אָבִין"),
          markedForm("תבין", "תָּבִין"),
          markedForm("תביני", "תָּבִינִי"),
          markedForm("יבין", "יָבִין"),
          markedForm("תבין", "תָּבִין"),
          markedForm("נבין", "נָבִין"),
          markedForm("תבינו", "תָּבִינוּ"),
          markedForm("יבינו", "יָבִינוּ")
        ),
        makeImperative(
          markedForm("הבן", "הָבֵן"),
          markedForm("הביני", "הָבִינִי"),
          markedForm("הבינו", "הָבִינוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il hollow verb (ע\"ו, ב-י-נ) for 'to understand'.",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "hollow", "high-frequency"],
      personal_priority: 63,
    }),
    createVerbEntry({
      id: "common-verb-lehavi",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להביא",
      lemma_niqqud: "לְהָבִיא",
      root: ["ב", "ו", "א"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to bring", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מביא", "מֵבִיא"),
          markedForm("מביאה", "מְבִיאָה"),
          markedForm("מביאים", "מְבִיאִים"),
          markedForm("מביאות", "מְבִיאוֹת")
        ),
        makePast(
          markedForm("הבאתי", "הֵבֵאתִי"),
          markedForm("הבאת", "הֵבֵאתָ"),
          markedForm("הבאת", "הֵבֵאת"),
          markedForm("הביא", "הֵבִיא"),
          markedForm("הביאה", "הֵבִיאָה"),
          markedForm("הבאנו", "הֵבֵאנוּ"),
          markedForm("הבאתם", "הֲבֵאתֶם"),
          markedForm("הבאתן", "הֲבֵאתֶן"),
          markedForm("הביאו", "הֵבִיאוּ")
        ),
        makeFuture(
          markedForm("אביא", "אָבִיא"),
          markedForm("תביא", "תָּבִיא"),
          markedForm("תביאי", "תָּבִיאִי"),
          markedForm("יביא", "יָבִיא"),
          markedForm("תביא", "תָּבִיא"),
          markedForm("נביא", "נָבִיא"),
          markedForm("תביאו", "תָּבִיאוּ"),
          markedForm("יביאו", "יָבִיאוּ")
        ),
        makeImperative(
          markedForm("הבא", "הָבֵא"),
          markedForm("הביאי", "הָבִיאִי"),
          markedForm("הביאו", "הָבִיאוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il irregular verb (ב-ו-א) for 'to bring'.",
      difficulty_level: 4,
      tags: ["hifil", "irregular", "high-frequency"],
      personal_priority: 62,
    }),
    createVerbEntry({
      id: "common-verb-ledaber",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לדבר",
      lemma_niqqud: "לְדַבֵּר",
      root: ["ד", "ב", "ר"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to speak", null, false), makeSense("to talk", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מדבר", "מְדַבֵּר"),
          markedForm("מדברת", "מְדַבֶּרֶת"),
          markedForm("מדברים", "מְדַבְּרִים"),
          markedForm("מדברות", "מְדַבְּרוֹת")
        ),
        makePast(
          markedForm("דיברתי", "דִּבַּרְתִּי"),
          markedForm("דיברת", "דִּבַּרְתָּ"),
          markedForm("דיברת", "דִּבַּרְתְּ"),
          markedForm("דיבר", "דִּבֵּר"),
          markedForm("דיברה", "דִּבְּרָה"),
          markedForm("דיברנו", "דִּבַּרְנוּ"),
          markedForm("דיברתם", "דִּבַּרְתֶּם"),
          markedForm("דיברתן", "דִּבַּרְתֶּן"),
          markedForm("דיברו", "דִּבְּרוּ")
        ),
        makeFuture(
          markedForm("אדבר", "אֲדַבֵּר"),
          markedForm("תדבר", "תְּדַבֵּר"),
          markedForm("תדברי", "תְּדַבְּרִי"),
          markedForm("ידבר", "יְדַבֵּר"),
          markedForm("תדבר", "תְּדַבֵּר"),
          markedForm("נדבר", "נְדַבֵּר"),
          markedForm("תדברו", "תְּדַבְּרוּ"),
          markedForm("ידברו", "יְדַבְּרוּ")
        ),
        makeImperative(
          markedForm("דבר", "דַּבֵּר"),
          markedForm("דברי", "דַּבְּרִי"),
          markedForm("דברו", "דַּבְּרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el verb (ד-ב-ר) for 'to speak / talk'.",
      difficulty_level: 2,
      tags: ["piel", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-leehov",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לאהוב",
      lemma_niqqud: "לֶאֱהֹב",
      root: ["א", "ה", "ב"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to love", null, false), makeSense("to like", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("אוהב", "אוֹהֵב"),
          markedForm("אוהבת", "אוֹהֶבֶת"),
          markedForm("אוהבים", "אוֹהֲבִים"),
          markedForm("אוהבות", "אוֹהֲבוֹת")
        ),
        makePast(
          markedForm("אהבתי", "אָהַבְתִּי"),
          markedForm("אהבת", "אָהַבְתָּ"),
          markedForm("אהבת", "אָהַבְתְּ"),
          markedForm("אהב", "אָהַב"),
          markedForm("אהבה", "אָהֲבָה"),
          markedForm("אהבנו", "אָהַבְנוּ"),
          markedForm("אהבתם", "אֲהַבְתֶּם"),
          markedForm("אהבתן", "אֲהַבְתֶּן"),
          markedForm("אהבו", "אָהֲבוּ")
        ),
        makeFuture(
          markedForm("אוהב", "אֹהַב"),
          markedForm("תאהב", "תֹּאהַב"),
          markedForm("תאהבי", "תֹּאהֲבִי"),
          markedForm("יאהב", "יֹאהַב"),
          markedForm("תאהב", "תֹּאהַב"),
          markedForm("נאהב", "נֹאהַב"),
          markedForm("תאהבו", "תֹּאהֲבוּ"),
          markedForm("יאהבו", "יֹאהֲבוּ")
        ),
        makeImperative(
          markedForm("אהב", "אֱהַב"),
          markedForm("אהבי", "אֶהֱבִי"),
          markedForm("אהבו", "אֶהֱבוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al pe-aleph verb (א-ה-ב) taking the special cholam future, for 'to love / like'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "pe-aleph", "high-frequency"],
      personal_priority: 63,
    }),
    createVerbEntry({
      id: "common-verb-lishmoa",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לשמוע",
      lemma_niqqud: "לִשְׁמֹעַ",
      root: ["ש", "מ", "ע"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to hear", null, false), makeSense("to listen", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("שומע", "שׁוֹמֵעַ"),
          markedForm("שומעת", "שׁוֹמַעַת"),
          markedForm("שומעים", "שׁוֹמְעִים"),
          markedForm("שומעות", "שׁוֹמְעוֹת")
        ),
        makePast(
          markedForm("שמעתי", "שָׁמַעְתִּי"),
          markedForm("שמעת", "שָׁמַעְתָּ"),
          markedForm("שמעת", "שָׁמַעְתְּ"),
          markedForm("שמע", "שָׁמַע"),
          markedForm("שמעה", "שָׁמְעָה"),
          markedForm("שמענו", "שָׁמַעְנוּ"),
          markedForm("שמעתם", "שְׁמַעְתֶּם"),
          markedForm("שמעתן", "שְׁמַעְתֶּן"),
          markedForm("שמעו", "שָׁמְעוּ")
        ),
        makeFuture(
          markedForm("אשמע", "אֶשְׁמַע"),
          markedForm("תשמע", "תִּשְׁמַע"),
          markedForm("תשמעי", "תִּשְׁמְעִי"),
          markedForm("ישמע", "יִשְׁמַע"),
          markedForm("תשמע", "תִּשְׁמַע"),
          markedForm("נשמע", "נִשְׁמַע"),
          markedForm("תשמעו", "תִּשְׁמְעוּ"),
          markedForm("ישמעו", "יִשְׁמְעוּ")
        ),
        makeImperative(
          markedForm("שמע", "שְׁמַע"),
          markedForm("שמעי", "שִׁמְעִי"),
          markedForm("שמעו", "שִׁמְעוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ע (lamed-guttural) verb (ש-מ-ע) for 'to hear / listen'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "guttural", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-lachzor",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לחזור",
      lemma_niqqud: "לַחֲזֹר",
      root: ["ח", "ז", "ר"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to return", null, false), makeSense("to come back", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("חוזר", "חוֹזֵר"),
          markedForm("חוזרת", "חוֹזֶרֶת"),
          markedForm("חוזרים", "חוֹזְרִים"),
          markedForm("חוזרות", "חוֹזְרוֹת")
        ),
        makePast(
          markedForm("חזרתי", "חָזַרְתִּי"),
          markedForm("חזרת", "חָזַרְתָּ"),
          markedForm("חזרת", "חָזַרְתְּ"),
          markedForm("חזר", "חָזַר"),
          markedForm("חזרה", "חָזְרָה"),
          markedForm("חזרנו", "חָזַרְנוּ"),
          markedForm("חזרתם", "חֲזַרְתֶּם"),
          markedForm("חזרתן", "חֲזַרְתֶּן"),
          markedForm("חזרו", "חָזְרוּ")
        ),
        makeFuture(
          markedForm("אחזור", "אֶחֱזֹר"),
          markedForm("תחזור", "תַּחֲזֹר"),
          markedForm("תחזרי", "תַּחְזְרִי"),
          markedForm("יחזור", "יַחֲזֹר"),
          markedForm("תחזור", "תַּחֲזֹר"),
          markedForm("נחזור", "נַחֲזֹר"),
          markedForm("תחזרו", "תַּחְזְרוּ"),
          markedForm("יחזרו", "יַחְזְרוּ")
        ),
        makeImperative(
          markedForm("חזור", "חֲזֹר"),
          markedForm("חזרי", "חִזְרִי"),
          markedForm("חזרו", "חִזְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al pe-guttural verb (ח-ז-ר) for 'to return / come back'.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "guttural", "high-frequency"],
      personal_priority: 62,
    }),
    createVerbEntry({
      id: "common-verb-lehagia",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להגיע",
      lemma_niqqud: "לְהַגִּיעַ",
      root: ["נ", "ג", "ע"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to arrive", "ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("מגיע", "מַגִּיעַ"),
          markedForm("מגיעה", "מַגִּיעָה"),
          markedForm("מגיעים", "מַגִּיעִים"),
          markedForm("מגיעות", "מַגִּיעוֹת")
        ),
        makePast(
          markedForm("הגעתי", "הִגַּעְתִּי"),
          markedForm("הגעת", "הִגַּעְתָּ"),
          markedForm("הגעת", "הִגַּעְתְּ"),
          markedForm("הגיע", "הִגִּיעַ"),
          markedForm("הגיעה", "הִגִּיעָה"),
          markedForm("הגענו", "הִגַּעְנוּ"),
          markedForm("הגעתם", "הִגַּעְתֶּם"),
          markedForm("הגעתן", "הִגַּעְתֶּן"),
          markedForm("הגיעו", "הִגִּיעוּ")
        ),
        makeFuture(
          markedForm("אגיע", "אַגִּיעַ"),
          markedForm("תגיע", "תַּגִּיעַ"),
          markedForm("תגיעי", "תַּגִּיעִי"),
          markedForm("יגיע", "יַגִּיעַ"),
          markedForm("תגיע", "תַּגִּיעַ"),
          markedForm("נגיע", "נַגִּיעַ"),
          markedForm("תגיעו", "תַּגִּיעוּ"),
          markedForm("יגיעו", "יַגִּיעוּ")
        ),
        makeImperative(
          markedForm("הגע", "הַגַּע"),
          markedForm("הגיעי", "הַגִּיעִי"),
          markedForm("הגיעו", "הַגִּיעוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il pe-nun verb (נ-ג-ע) for 'to arrive / reach'.",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "pe-nun", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-lehatchil",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להתחיל",
      lemma_niqqud: "לְהַתְחִיל",
      root: ["ת", "ח", "ל"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to start / begin", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתחיל", "מַתְחִיל"),
          markedForm("מתחילה", "מַתְחִילָה"),
          markedForm("מתחילים", "מַתְחִילִים"),
          markedForm("מתחילות", "מַתְחִילוֹת")
        ),
        makePast(
          markedForm("התחלתי", "הִתְחַלְתִּי"),
          markedForm("התחלת", "הִתְחַלְתָּ"),
          markedForm("התחלת", "הִתְחַלְתְּ"),
          markedForm("התחיל", "הִתְחִיל"),
          markedForm("התחילה", "הִתְחִילָה"),
          markedForm("התחלנו", "הִתְחַלְנוּ"),
          markedForm("התחלתם", "הִתְחַלְתֶּם"),
          markedForm("התחלתן", "הִתְחַלְתֶּן"),
          markedForm("התחילו", "הִתְחִילוּ")
        ),
        makeFuture(
          markedForm("אתחיל", "אַתְחִיל"),
          markedForm("תתחיל", "תַּתְחִיל"),
          markedForm("תתחילי", "תַּתְחִילִי"),
          markedForm("יתחיל", "יַתְחִיל"),
          markedForm("תתחיל", "תַּתְחִיל"),
          markedForm("נתחיל", "נַתְחִיל"),
          markedForm("תתחילו", "תַּתְחִילוּ"),
          markedForm("יתחילו", "יַתְחִילוּ")
        ),
        makeImperative(
          markedForm("התחל", "הַתְחֵל"),
          markedForm("התחילי", "הַתְחִילִי"),
          markedForm("התחילו", "הַתְחִילוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular hif'il verb (ת-ח-ל) for 'to start / begin'.",
      difficulty_level: 3,
      tags: ["hifil", "regular", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-lehamshich",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להמשיך",
      lemma_niqqud: "לְהַמְשִׁיךְ",
      root: ["מ", "ש", "כ"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to continue", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("ממשיך", "מַמְשִׁיךְ"),
          markedForm("ממשיכה", "מַמְשִׁיכָה"),
          markedForm("ממשיכים", "מַמְשִׁיכִים"),
          markedForm("ממשיכות", "מַמְשִׁיכוֹת")
        ),
        makePast(
          markedForm("המשכתי", "הִמְשַׁכְתִּי"),
          markedForm("המשכת", "הִמְשַׁכְתָּ"),
          markedForm("המשכת", "הִמְשַׁכְתְּ"),
          markedForm("המשיך", "הִמְשִׁיךְ"),
          markedForm("המשיכה", "הִמְשִׁיכָה"),
          markedForm("המשכנו", "הִמְשַׁכְנוּ"),
          markedForm("המשכתם", "הִמְשַׁכְתֶּם"),
          markedForm("המשכתן", "הִמְשַׁכְתֶּן"),
          markedForm("המשיכו", "הִמְשִׁיכוּ")
        ),
        makeFuture(
          markedForm("אמשיך", "אַמְשִׁיךְ"),
          markedForm("תמשיך", "תַּמְשִׁיךְ"),
          markedForm("תמשיכי", "תַּמְשִׁיכִי"),
          markedForm("ימשיך", "יַמְשִׁיךְ"),
          markedForm("תמשיך", "תַּמְשִׁיךְ"),
          markedForm("נמשיך", "נַמְשִׁיךְ"),
          markedForm("תמשיכו", "תַּמְשִׁיכוּ"),
          markedForm("ימשיכו", "יַמְשִׁיכוּ")
        ),
        makeImperative(
          markedForm("המשך", "הַמְשֵׁךְ"),
          markedForm("המשיכי", "הַמְשִׁיכִי"),
          markedForm("המשיכו", "הַמְשִׁיכוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular hif'il verb (מ-ש-כ) for 'to continue'.",
      difficulty_level: 3,
      tags: ["hifil", "regular", "high-frequency"],
      personal_priority: 63,
    }),
    createVerbEntry({
      id: "common-verb-lehargish",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להרגיש",
      lemma_niqqud: "לְהַרְגִּישׁ",
      root: ["ר", "ג", "ש"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to feel", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מרגיש", "מַרְגִּישׁ"),
          markedForm("מרגישה", "מַרְגִּישָׁה"),
          markedForm("מרגישים", "מַרְגִּישִׁים"),
          markedForm("מרגישות", "מַרְגִּישׁוֹת")
        ),
        makePast(
          markedForm("הרגשתי", "הִרְגַּשְׁתִּי"),
          markedForm("הרגשת", "הִרְגַּשְׁתָּ"),
          markedForm("הרגשת", "הִרְגַּשְׁתְּ"),
          markedForm("הרגיש", "הִרְגִּישׁ"),
          markedForm("הרגישה", "הִרְגִּישָׁה"),
          markedForm("הרגשנו", "הִרְגַּשְׁנוּ"),
          markedForm("הרגשתם", "הִרְגַּשְׁתֶּם"),
          markedForm("הרגשתן", "הִרְגַּשְׁתֶּן"),
          markedForm("הרגישו", "הִרְגִּישׁוּ")
        ),
        makeFuture(
          markedForm("ארגיש", "אַרְגִּישׁ"),
          markedForm("תרגיש", "תַּרְגִּישׁ"),
          markedForm("תרגישי", "תַּרְגִּישִׁי"),
          markedForm("ירגיש", "יַרְגִּישׁ"),
          markedForm("תרגיש", "תַּרְגִּישׁ"),
          markedForm("נרגיש", "נַרְגִּישׁ"),
          markedForm("תרגישו", "תַּרְגִּישׁוּ"),
          markedForm("ירגישו", "יַרְגִּישׁוּ")
        ),
        makeImperative(
          markedForm("הרגש", "הַרְגֵּשׁ"),
          markedForm("הרגישי", "הַרְגִּישִׁי"),
          markedForm("הרגישו", "הַרְגִּישׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular hif'il verb (ר-ג-ש) for 'to feel'.",
      difficulty_level: 3,
      tags: ["hifil", "regular", "high-frequency"],
      personal_priority: 63,
    }),
    createVerbEntry({
      id: "common-verb-lehikanes",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להיכנס",
      lemma_niqqud: "לְהִכָּנֵס",
      root: ["כ", "נ", "ס"],
      binyan: "nifal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to enter", "ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("נכנס", "נִכְנָס"),
          markedForm("נכנסת", "נִכְנֶסֶת"),
          markedForm("נכנסים", "נִכְנָסִים"),
          markedForm("נכנסות", "נִכְנָסוֹת")
        ),
        makePast(
          markedForm("נכנסתי", "נִכְנַסְתִּי"),
          markedForm("נכנסת", "נִכְנַסְתָּ"),
          markedForm("נכנסת", "נִכְנַסְתְּ"),
          markedForm("נכנס", "נִכְנַס"),
          markedForm("נכנסה", "נִכְנְסָה"),
          markedForm("נכנסנו", "נִכְנַסְנוּ"),
          markedForm("נכנסתם", "נִכְנַסְתֶּם"),
          markedForm("נכנסתן", "נִכְנַסְתֶּן"),
          markedForm("נכנסו", "נִכְנְסוּ")
        ),
        makeFuture(
          markedForm("איכנס", "אֶכָּנֵס"),
          markedForm("תיכנס", "תִּכָּנֵס"),
          markedForm("תיכנסי", "תִּכָּנְסִי"),
          markedForm("ייכנס", "יִכָּנֵס"),
          markedForm("תיכנס", "תִּכָּנֵס"),
          markedForm("ניכנס", "נִכָּנֵס"),
          markedForm("תיכנסו", "תִּכָּנְסוּ"),
          markedForm("ייכנסו", "יִכָּנְסוּ")
        ),
        makeImperative(
          markedForm("היכנס", "הִכָּנֵס"),
          markedForm("היכנסי", "הִכָּנְסִי"),
          markedForm("היכנסו", "הִכָּנְסוּ")
        )
      ),
      review_status: "approved",
      notes: "Nif'al verb (כ-נ-ס) for 'to enter'. First nif'al entry in the deck.",
      difficulty_level: 4,
      tags: ["nifal", "regular", "high-frequency"],
      personal_priority: 62,
    }),
    createVerbEntry({
      id: "common-verb-lehishaer",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להישאר",
      lemma_niqqud: "לְהִשָּׁאֵר",
      root: ["ש", "א", "ר"],
      binyan: "nifal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to stay / remain", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נשאר", "נִשְׁאָר"),
          markedForm("נשארת", "נִשְׁאֶרֶת"),
          markedForm("נשארים", "נִשְׁאָרִים"),
          markedForm("נשארות", "נִשְׁאָרוֹת")
        ),
        makePast(
          markedForm("נשארתי", "נִשְׁאַרְתִּי"),
          markedForm("נשארת", "נִשְׁאַרְתָּ"),
          markedForm("נשארת", "נִשְׁאַרְתְּ"),
          markedForm("נשאר", "נִשְׁאַר"),
          markedForm("נשארה", "נִשְׁאֲרָה"),
          markedForm("נשארנו", "נִשְׁאַרְנוּ"),
          markedForm("נשארתם", "נִשְׁאַרְתֶּם"),
          markedForm("נשארתן", "נִשְׁאַרְתֶּן"),
          markedForm("נשארו", "נִשְׁאֲרוּ")
        ),
        makeFuture(
          markedForm("אישאר", "אֶשָּׁאֵר"),
          markedForm("תישאר", "תִּשָּׁאֵר"),
          markedForm("תישארי", "תִּשָּׁאֲרִי"),
          markedForm("יישאר", "יִשָּׁאֵר"),
          markedForm("תישאר", "תִּשָּׁאֵר"),
          markedForm("נישאר", "נִשָּׁאֵר"),
          markedForm("תישארו", "תִּשָּׁאֲרוּ"),
          markedForm("יישארו", "יִשָּׁאֲרוּ")
        ),
        makeImperative(
          markedForm("הישאר", "הִשָּׁאֵר"),
          markedForm("הישארי", "הִשָּׁאֲרִי"),
          markedForm("הישארו", "הִשָּׁאֲרוּ")
        )
      ),
      review_status: "approved",
      notes: "Nif'al verb (ש-א-ר) for 'to stay / remain'.",
      difficulty_level: 4,
      tags: ["nifal", "regular", "high-frequency"],
      personal_priority: 62,
    }),
    createVerbEntry({
      id: "common-verb-lehipagesh",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להיפגש",
      lemma_niqqud: "לְהִפָּגֵשׁ",
      root: ["פ", "ג", "ש"],
      binyan: "nifal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to meet up", "עם", false)],
      forms: makeForms(
        makePresent(
          markedForm("נפגש", "נִפְגָּשׁ"),
          markedForm("נפגשת", "נִפְגֶּשֶׁת"),
          markedForm("נפגשים", "נִפְגָּשִׁים"),
          markedForm("נפגשות", "נִפְגָּשׁוֹת")
        ),
        makePast(
          markedForm("נפגשתי", "נִפְגַּשְׁתִּי"),
          markedForm("נפגשת", "נִפְגַּשְׁתָּ"),
          markedForm("נפגשת", "נִפְגַּשְׁתְּ"),
          markedForm("נפגש", "נִפְגַּשׁ"),
          markedForm("נפגשה", "נִפְגְּשָׁה"),
          markedForm("נפגשנו", "נִפְגַּשְׁנוּ"),
          markedForm("נפגשתם", "נִפְגַּשְׁתֶּם"),
          markedForm("נפגשתן", "נִפְגַּשְׁתֶּן"),
          markedForm("נפגשו", "נִפְגְּשׁוּ")
        ),
        makeFuture(
          markedForm("איפגש", "אֶפָּגֵשׁ"),
          markedForm("תיפגש", "תִּפָּגֵשׁ"),
          markedForm("תיפגשי", "תִּפָּגְשִׁי"),
          markedForm("ייפגש", "יִפָּגֵשׁ"),
          markedForm("תיפגש", "תִּפָּגֵשׁ"),
          markedForm("ניפגש", "נִפָּגֵשׁ"),
          markedForm("תיפגשו", "תִּפָּגְשׁוּ"),
          markedForm("ייפגשו", "יִפָּגְשׁוּ")
        ),
        makeImperative(
          markedForm("היפגש", "הִפָּגֵשׁ"),
          markedForm("היפגשי", "הִפָּגְשִׁי"),
          markedForm("היפגשו", "הִפָּגְשׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Nif'al reciprocal verb (פ-ג-ש) for 'to meet up (with)'.",
      difficulty_level: 4,
      tags: ["nifal", "regular", "reciprocal", "high-frequency"],
      personal_priority: 61,
    }),
    createVerbEntry({
      id: "common-verb-lehitkasher",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להתקשר",
      lemma_niqqud: "לְהִתְקַשֵּׁר",
      root: ["ק", "ש", "ר"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to call (on the phone)", "ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("מתקשר", "מִתְקַשֵּׁר"),
          markedForm("מתקשרת", "מִתְקַשֶּׁרֶת"),
          markedForm("מתקשרים", "מִתְקַשְּׁרִים"),
          markedForm("מתקשרות", "מִתְקַשְּׁרוֹת")
        ),
        makePast(
          markedForm("התקשרתי", "הִתְקַשַּׁרְתִּי"),
          markedForm("התקשרת", "הִתְקַשַּׁרְתָּ"),
          markedForm("התקשרת", "הִתְקַשַּׁרְתְּ"),
          markedForm("התקשר", "הִתְקַשֵּׁר"),
          markedForm("התקשרה", "הִתְקַשְּׁרָה"),
          markedForm("התקשרנו", "הִתְקַשַּׁרְנוּ"),
          markedForm("התקשרתם", "הִתְקַשַּׁרְתֶּם"),
          markedForm("התקשרתן", "הִתְקַשַּׁרְתֶּן"),
          markedForm("התקשרו", "הִתְקַשְּׁרוּ")
        ),
        makeFuture(
          markedForm("אתקשר", "אֶתְקַשֵּׁר"),
          markedForm("תתקשר", "תִּתְקַשֵּׁר"),
          markedForm("תתקשרי", "תִּתְקַשְּׁרִי"),
          markedForm("יתקשר", "יִתְקַשֵּׁר"),
          markedForm("תתקשר", "תִּתְקַשֵּׁר"),
          markedForm("נתקשר", "נִתְקַשֵּׁר"),
          markedForm("תתקשרו", "תִּתְקַשְּׁרוּ"),
          markedForm("יתקשרו", "יִתְקַשְּׁרוּ")
        ),
        makeImperative(
          markedForm("התקשר", "הִתְקַשֵּׁר"),
          markedForm("התקשרי", "הִתְקַשְּׁרִי"),
          markedForm("התקשרו", "הִתְקַשְּׁרוּ")
        )
      ),
      review_status: "approved",
      notes: "Hitpa'el verb (ק-ש-ר) for 'to call (on the phone)'.",
      difficulty_level: 4,
      tags: ["hitpael", "regular", "high-frequency"],
      personal_priority: 61,
    }),
    createVerbEntry({
      id: "common-verb-lishloach",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לשלוח",
      lemma_niqqud: "לִשְׁלוֹחַ",
      root: ["ש", "ל", "ח"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to send", "את־ ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("שולח", "שׁוֹלֵחַ"),
          markedForm("שולחת", "שׁוֹלַחַת"),
          markedForm("שולחים", "שׁוֹלְחִים"),
          markedForm("שולחות", "שׁוֹלְחוֹת")
        ),
        makePast(
          markedForm("שלחתי", "שָׁלַחְתִּי"),
          markedForm("שלחת", "שָׁלַחְתָּ"),
          markedForm("שלחת", "שָׁלַחְתְּ"),
          markedForm("שלח", "שָׁלַח"),
          markedForm("שלחה", "שָׁלְחָה"),
          markedForm("שלחנו", "שָׁלַחְנוּ"),
          markedForm("שלחתם", "שְׁלַחְתֶּם"),
          markedForm("שלחתן", "שְׁלַחְתֶּן"),
          markedForm("שלחו", "שָׁלְחוּ")
        ),
        makeFuture(
          markedForm("אשלח", "אֶשְׁלַח"),
          markedForm("תשלח", "תִּשְׁלַח"),
          markedForm("תשלחי", "תִּשְׁלְחִי"),
          markedForm("ישלח", "יִשְׁלַח"),
          markedForm("תשלח", "תִּשְׁלַח"),
          markedForm("נשלח", "נִשְׁלַח"),
          markedForm("תשלחו", "תִּשְׁלְחוּ"),
          markedForm("ישלחו", "יִשְׁלְחוּ")
        ),
        makeImperative(
          markedForm("שלח", "שְׁלַח"),
          markedForm("שלחי", "שִׁלְחִי"),
          markedForm("שלחו", "שִׁלְחוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל-guttural verb (ש-ל-ח); future takes patach like לפתוח. Core messaging verb (תשלח לי מיקום).",
      difficulty_level: 2,
      tags: ["paal", "regular", "communication", "high-frequency"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-lishkoach",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לשכוח",
      lemma_niqqud: "לִשְׁכּוֹחַ",
      root: ["ש", "כ", "ח"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to forget", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("שוכח", "שׁוֹכֵחַ"),
          markedForm("שוכחת", "שׁוֹכַחַת"),
          markedForm("שוכחים", "שׁוֹכְחִים"),
          markedForm("שוכחות", "שׁוֹכְחוֹת")
        ),
        makePast(
          markedForm("שכחתי", "שָׁכַחְתִּי"),
          markedForm("שכחת", "שָׁכַחְתָּ"),
          markedForm("שכחת", "שָׁכַחְתְּ"),
          markedForm("שכח", "שָׁכַח"),
          markedForm("שכחה", "שָׁכְחָה"),
          markedForm("שכחנו", "שָׁכַחְנוּ"),
          markedForm("שכחתם", "שְׁכַחְתֶּם"),
          markedForm("שכחתן", "שְׁכַחְתֶּן"),
          markedForm("שכחו", "שָׁכְחוּ")
        ),
        makeFuture(
          markedForm("אשכח", "אֶשְׁכַּח"),
          markedForm("תשכח", "תִּשְׁכַּח"),
          markedForm("תשכחי", "תִּשְׁכְּחִי"),
          markedForm("ישכח", "יִשְׁכַּח"),
          markedForm("תשכח", "תִּשְׁכַּח"),
          markedForm("נשכח", "נִשְׁכַּח"),
          markedForm("תשכחו", "תִּשְׁכְּחוּ"),
          markedForm("ישכחו", "יִשְׁכְּחוּ")
        ),
        makeImperative(
          markedForm("שכח", "שְׁכַח"),
          markedForm("שכחי", "שִׁכְחִי"),
          markedForm("שכחו", "שִׁכְחוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל-guttural verb (ש-כ-ח); future takes patach like לפתוח. Past שכחתי is everywhere in daily speech.",
      difficulty_level: 2,
      tags: ["paal", "regular", "high-frequency"],
      personal_priority: 65,
    }),
    createVerbEntry({
      id: "common-verb-laazor",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לעזור",
      lemma_niqqud: "לַעֲזוֹר",
      root: ["ע", "ז", "ר"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to help", "ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("עוזר", "עוֹזֵר"),
          markedForm("עוזרת", "עוֹזֶרֶת"),
          markedForm("עוזרים", "עוֹזְרִים"),
          markedForm("עוזרות", "עוֹזְרוֹת")
        ),
        makePast(
          markedForm("עזרתי", "עָזַרְתִּי"),
          markedForm("עזרת", "עָזַרְתָּ"),
          markedForm("עזרת", "עָזַרְתְּ"),
          markedForm("עזר", "עָזַר"),
          markedForm("עזרה", "עָזְרָה"),
          markedForm("עזרנו", "עָזַרְנוּ"),
          markedForm("עזרתם", "עֲזַרְתֶּם"),
          markedForm("עזרתן", "עֲזַרְתֶּן"),
          markedForm("עזרו", "עָזְרוּ")
        ),
        makeFuture(
          markedForm("אעזור", "אֶעֱזֹר"),
          markedForm("תעזור", "תַּעֲזֹר"),
          markedForm("תעזרי", "תַּעַזְרִי"),
          markedForm("יעזור", "יַעֲזֹר"),
          markedForm("תעזור", "תַּעֲזֹר"),
          markedForm("נעזור", "נַעֲזֹר"),
          markedForm("תעזרו", "תַּעַזְרוּ"),
          markedForm("יעזרו", "יַעַזְרוּ")
        ),
        makeImperative(
          markedForm("עזור", "עֲזֹר"),
          markedForm("עזרי", "עִזְרִי"),
          markedForm("עזרו", "עִזְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al פ-guttural verb (ע-ז-ר) conjugating like לעבוד; takes ל־ before the person helped (לעזור לי).",
      difficulty_level: 2,
      tags: ["paal", "regular", "pe-guttural", "high-frequency"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "common-verb-livdok",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לבדוק",
      lemma_niqqud: "לִבְדּוֹק",
      root: ["ב", "ד", "ק"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to check", "את־", false)],
      forms: makeForms(
        makePresent(
          markedForm("בודק", "בּוֹדֵק"),
          markedForm("בודקת", "בּוֹדֶקֶת"),
          markedForm("בודקים", "בּוֹדְקִים"),
          markedForm("בודקות", "בּוֹדְקוֹת")
        ),
        makePast(
          markedForm("בדקתי", "בָּדַקְתִּי"),
          markedForm("בדקת", "בָּדַקְתָּ"),
          markedForm("בדקת", "בָּדַקְתְּ"),
          markedForm("בדק", "בָּדַק"),
          markedForm("בדקה", "בָּדְקָה"),
          markedForm("בדקנו", "בָּדַקְנוּ"),
          markedForm("בדקתם", "בְּדַקְתֶּם"),
          markedForm("בדקתן", "בְּדַקְתֶּן"),
          markedForm("בדקו", "בָּדְקוּ")
        ),
        makeFuture(
          markedForm("אבדוק", "אֶבְדּוֹק"),
          markedForm("תבדוק", "תִּבְדּוֹק"),
          markedForm("תבדקי", "תִּבְדְּקִי"),
          markedForm("יבדוק", "יִבְדּוֹק"),
          markedForm("תבדוק", "תִּבְדּוֹק"),
          markedForm("נבדוק", "נִבְדּוֹק"),
          markedForm("תבדקו", "תִּבְדְּקוּ"),
          markedForm("יבדקו", "יִבְדְּקוּ")
        ),
        makeImperative(
          markedForm("בדוק", "בְּדֹק"),
          markedForm("בדקי", "בִּדְקִי"),
          markedForm("בדקו", "בִּדְקוּ")
        )
      ),
      review_status: "approved",
      notes: "Fully regular pa'al o-future verb (ב-ד-ק) conjugating exactly like לסגור.",
      difficulty_level: 2,
      tags: ["paal", "regular", "high-frequency"],
      personal_priority: 60,
    }),
    createVerbEntry({
      id: "common-verb-linsoa",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לנסוע",
      lemma_niqqud: "לִנְסוֹעַ",
      root: ["נ", "ס", "ע"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to travel (by vehicle)", "ל־/ב־", false)],
      forms: makeForms(
        makePresent(
          markedForm("נוסע", "נוֹסֵעַ"),
          markedForm("נוסעת", "נוֹסַעַת"),
          markedForm("נוסעים", "נוֹסְעִים"),
          markedForm("נוסעות", "נוֹסְעוֹת")
        ),
        makePast(
          markedForm("נסעתי", "נָסַעְתִּי"),
          markedForm("נסעת", "נָסַעְתָּ"),
          markedForm("נסעת", "נָסַעְתְּ"),
          markedForm("נסע", "נָסַע"),
          markedForm("נסעה", "נָסְעָה"),
          markedForm("נסענו", "נָסַעְנוּ"),
          markedForm("נסעתם", "נְסַעְתֶּם"),
          markedForm("נסעתן", "נְסַעְתֶּן"),
          markedForm("נסעו", "נָסְעוּ")
        ),
        makeFuture(
          markedForm("אסע", "אֶסַּע"),
          markedForm("תיסע", "תִּסַּע"),
          markedForm("תיסעי", "תִּסְּעִי"),
          markedForm("ייסע", "יִסַּע"),
          markedForm("תיסע", "תִּסַּע"),
          markedForm("ניסע", "נִסַּע"),
          markedForm("תיסעו", "תִּסְּעוּ"),
          markedForm("ייסעו", "יִסְּעוּ")
        ),
        makeImperative(
          markedForm("סע", "סַע"),
          markedForm("סעי", "סְעִי"),
          markedForm("סעו", "סְעוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al פ\"נ verb (נ-ס-ע); the nun assimilates in the future (אסע, ייסע) like ליפול, and the imperative drops it entirely (סע!).",
      difficulty_level: 3,
      tags: ["paal", "irregular", "pe-nun", "travel", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-laredet",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לרדת",
      lemma_niqqud: "לָרֶדֶת",
      root: ["י", "ר", "ד"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to go down", null, false), makeSense("to get off (a bus or train)", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("יורד", "יוֹרֵד"),
          markedForm("יורדת", "יוֹרֶדֶת"),
          markedForm("יורדים", "יוֹרְדִים"),
          markedForm("יורדות", "יוֹרְדוֹת")
        ),
        makePast(
          markedForm("ירדתי", "יָרַדְתִּי"),
          markedForm("ירדת", "יָרַדְתָּ"),
          markedForm("ירדת", "יָרַדְתְּ"),
          markedForm("ירד", "יָרַד"),
          markedForm("ירדה", "יָרְדָה"),
          markedForm("ירדנו", "יָרַדְנוּ"),
          markedForm("ירדתם", "יְרַדְתֶּם"),
          markedForm("ירדתן", "יְרַדְתֶּן"),
          markedForm("ירדו", "יָרְדוּ")
        ),
        makeFuture(
          markedForm("ארד", "אֵרֵד"),
          markedForm("תרד", "תֵּרֵד"),
          markedForm("תרדי", "תֵּרְדִי"),
          markedForm("ירד", "יֵרֵד"),
          markedForm("תרד", "תֵּרֵד"),
          markedForm("נרד", "נֵרֵד"),
          markedForm("תרדו", "תֵּרְדוּ"),
          markedForm("ירדו", "יֵרְדוּ")
        ),
        makeImperative(
          markedForm("רד", "רֵד"),
          markedForm("רדי", "רְדִי"),
          markedForm("רדו", "רְדוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al פ\"י verb (י-ר-ד); the yod drops in the future (אֵרֵד like אֵצֵא) and imperative (רד!). Also used for rain: יורד גשם.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "pe-yod", "travel", "high-frequency"],
      personal_priority: 63,
    }),
    createVerbEntry({
      id: "common-verb-laalot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לעלות",
      lemma_niqqud: "לַעֲלוֹת",
      root: ["ע", "ל", "ה"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to go up", null, false), makeSense("to cost", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("עולה", "עוֹלֶה"),
          markedForm("עולה", "עוֹלָה"),
          markedForm("עולים", "עוֹלִים"),
          markedForm("עולות", "עוֹלוֹת")
        ),
        makePast(
          markedForm("עליתי", "עָלִיתִי"),
          markedForm("עלית", "עָלִיתָ"),
          markedForm("עלית", "עָלִית"),
          markedForm("עלה", "עָלָה"),
          markedForm("עלתה", "עָלְתָה"),
          markedForm("עלינו", "עָלִינוּ"),
          markedForm("עליתם", "עֲלִיתֶם"),
          markedForm("עליתן", "עֲלִיתֶן"),
          markedForm("עלו", "עָלוּ")
        ),
        makeFuture(
          markedForm("אעלה", "אֶעֱלֶה"),
          markedForm("תעלה", "תַּעֲלֶה"),
          markedForm("תעלי", "תַּעֲלִי"),
          markedForm("יעלה", "יַעֲלֶה"),
          markedForm("תעלה", "תַּעֲלֶה"),
          markedForm("נעלה", "נַעֲלֶה"),
          markedForm("תעלו", "תַּעֲלוּ"),
          markedForm("יעלו", "יַעֲלוּ")
        ),
        makeImperative(
          markedForm("עלה", "עֲלֵה"),
          markedForm("עלי", "עֲלִי"),
          markedForm("עלו", "עֲלוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל\"ה verb (ע-ל-ה) conjugating like לעשות. Doubles as 'to cost': כמה זה עולה?",
      difficulty_level: 4,
      tags: ["paal", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 63,
    }),
    createVerbEntry({
      id: "common-verb-lehazmin",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להזמין",
      lemma_niqqud: "לְהַזְמִין",
      root: ["ז", "מ", "נ"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to order (food, tickets)", "את־", false), makeSense("to invite", "את־ ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("מזמין", "מַזְמִין"),
          markedForm("מזמינה", "מַזְמִינָה"),
          markedForm("מזמינים", "מַזְמִינִים"),
          markedForm("מזמינות", "מַזְמִינוֹת")
        ),
        makePast(
          markedForm("הזמנתי", "הִזְמַנְתִּי"),
          markedForm("הזמנת", "הִזְמַנְתָּ"),
          markedForm("הזמנת", "הִזְמַנְתְּ"),
          markedForm("הזמין", "הִזְמִין"),
          markedForm("הזמינה", "הִזְמִינָה"),
          markedForm("הזמנו", "הִזְמַנּוּ"),
          markedForm("הזמנתם", "הִזְמַנְתֶּם"),
          markedForm("הזמנתן", "הִזְמַנְתֶּן"),
          markedForm("הזמינו", "הִזְמִינוּ")
        ),
        makeFuture(
          markedForm("אזמין", "אַזְמִין"),
          markedForm("תזמין", "תַּזְמִין"),
          markedForm("תזמיני", "תַּזְמִינִי"),
          markedForm("יזמין", "יַזְמִין"),
          markedForm("תזמין", "תַּזְמִין"),
          markedForm("נזמין", "נַזְמִין"),
          markedForm("תזמינו", "תַּזְמִינוּ"),
          markedForm("יזמינו", "יַזְמִינוּ")
        ),
        makeImperative(
          markedForm("הזמן", "הַזְמֵן"),
          markedForm("הזמיני", "הַזְמִינִי"),
          markedForm("הזמינו", "הַזְמִינוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of ז-מ-נ conjugating like להזהיר. Covers both ordering (הזמנו פיצה) and inviting people. Note past 1pl הזמנו vs 3pl הזמינו.",
      difficulty_level: 3,
      tags: ["hifil", "regular", "food", "high-frequency"],
      personal_priority: 65,
    }),
    createVerbEntry({
      id: "common-verb-lehachlit",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "להחליט",
      lemma_niqqud: "לְהַחְלִיט",
      root: ["ח", "ל", "ט"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to decide", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מחליט", "מַחְלִיט"),
          markedForm("מחליטה", "מַחְלִיטָה"),
          markedForm("מחליטים", "מַחְלִיטִים"),
          markedForm("מחליטות", "מַחְלִיטוֹת")
        ),
        makePast(
          markedForm("החלטתי", "הֶחְלַטְתִּי"),
          markedForm("החלטת", "הֶחְלַטְתָּ"),
          markedForm("החלטת", "הֶחְלַטְתְּ"),
          markedForm("החליט", "הֶחְלִיט"),
          markedForm("החליטה", "הֶחְלִיטָה"),
          markedForm("החלטנו", "הֶחְלַטְנוּ"),
          markedForm("החלטתם", "הֶחְלַטְתֶּם"),
          markedForm("החלטתן", "הֶחְלַטְתֶּן"),
          markedForm("החליטו", "הֶחְלִיטוּ")
        ),
        makeFuture(
          markedForm("אחליט", "אַחְלִיט"),
          markedForm("תחליט", "תַּחְלִיט"),
          markedForm("תחליטי", "תַּחְלִיטִי"),
          markedForm("יחליט", "יַחְלִיט"),
          markedForm("תחליט", "תַּחְלִיט"),
          markedForm("נחליט", "נַחְלִיט"),
          markedForm("תחליטו", "תַּחְלִיטוּ"),
          markedForm("יחליטו", "יַחְלִיטוּ")
        ),
        makeImperative(
          markedForm("החלט", "הַחְלֵט"),
          markedForm("החליטי", "הַחְלִיטִי"),
          markedForm("החליטו", "הַחְלִיטוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of ח-ל-ט; the guttural ח takes segol in the past (הֶחְלִיט). Pairs with the colloquial nudge תחליט כבר!",
      difficulty_level: 3,
      tags: ["hifil", "regular", "pe-guttural", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "common-verb-lechakot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לחכות",
      lemma_niqqud: "לְחַכּוֹת",
      root: ["ח", "כ", "ה"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to wait (for)", "ל־", false)],
      forms: makeForms(
        makePresent(
          markedForm("מחכה", "מְחַכֶּה"),
          markedForm("מחכה", "מְחַכָּה"),
          markedForm("מחכים", "מְחַכִּים"),
          markedForm("מחכות", "מְחַכּוֹת")
        ),
        makePast(
          markedForm("חיכיתי", "חִכִּיתִי"),
          markedForm("חיכית", "חִכִּיתָ"),
          markedForm("חיכית", "חִכִּית"),
          markedForm("חיכה", "חִכָּה"),
          markedForm("חיכתה", "חִכְּתָה"),
          markedForm("חיכינו", "חִכִּינוּ"),
          markedForm("חיכיתם", "חִכִּיתֶם"),
          markedForm("חיכיתן", "חִכִּיתֶן"),
          markedForm("חיכו", "חִכּוּ")
        ),
        makeFuture(
          markedForm("אחכה", "אֲחַכֶּה"),
          markedForm("תחכה", "תְּחַכֶּה"),
          markedForm("תחכי", "תְּחַכִּי"),
          markedForm("יחכה", "יְחַכֶּה"),
          markedForm("תחכה", "תְּחַכֶּה"),
          markedForm("נחכה", "נְחַכֶּה"),
          markedForm("תחכו", "תְּחַכּוּ"),
          markedForm("יחכו", "יְחַכּוּ")
        ),
        makeImperative(
          markedForm("חכה", "חַכֵּה"),
          markedForm("חכי", "חַכִּי"),
          markedForm("חכו", "חַכּוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el ל\"ה verb (ח-כ-ה); takes ל־ before what is awaited (מחכה לך). Imperative חכה is the everyday 'wait!'.",
      difficulty_level: 4,
      tags: ["piel", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 64,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitlabesh",
      availability: getStarterVerbAvailability("advanced-verb-lehitlabesh"),
      lemma: "להתלבש",
      lemma_niqqud: "לְהִתְלַבֵּשׁ",
      root: ["ל", "ב", "ש"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to get dressed", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתלבש", "מִתְלַבֵּשׁ"),
          markedForm("מתלבשת", "מִתְלַבֶּשֶׁת"),
          markedForm("מתלבשים", "מִתְלַבְּשִׁים"),
          markedForm("מתלבשות", "מִתְלַבְּשׁוֹת")
        ),
        makePast(
          markedForm("התלבשתי", "הִתְלַבַּשְׁתִּי"),
          markedForm("התלבשת", "הִתְלַבַּשְׁתָּ"),
          markedForm("התלבשת", "הִתְלַבַּשְׁתְּ"),
          markedForm("התלבש", "הִתְלַבֵּשׁ"),
          markedForm("התלבשה", "הִתְלַבְּשָׁה"),
          markedForm("התלבשנו", "הִתְלַבַּשְׁנוּ"),
          markedForm("התלבשתם", "הִתְלַבַּשְׁתֶּם"),
          markedForm("התלבשתן", "הִתְלַבַּשְׁתֶּן"),
          markedForm("התלבשו", "הִתְלַבְּשׁוּ")
        ),
        makeFuture(
          markedForm("אתלבש", "אֶתְלַבֵּשׁ"),
          markedForm("תתלבש", "תִּתְלַבֵּשׁ"),
          markedForm("תתלבשי", "תִּתְלַבְּשִׁי"),
          markedForm("יתלבש", "יִתְלַבֵּשׁ"),
          markedForm("תתלבש", "תִּתְלַבֵּשׁ"),
          markedForm("נתלבש", "נִתְלַבֵּשׁ"),
          markedForm("תתלבשו", "תִּתְלַבְּשׁוּ"),
          markedForm("יתלבשו", "יִתְלַבְּשׁוּ")
        ),
        makeImperative(
          markedForm("התלבש", "הִתְלַבֵּשׁ"),
          markedForm("התלבשי", "הִתְלַבְּשִׁי"),
          markedForm("התלבשו", "הִתְלַבְּשׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Reflexive hitpa'el of ל-ב-ש: dress oneself. Pairs with the binyan-board root ל-ב-ש (לבש/הלביש/התלבש).",
      difficulty_level: 2,
      tags: ["hitpael", "regular", "everyday", "high-frequency"],
      personal_priority: 85,
    }),
    createVerbEntry({
      id: "advanced-verb-lehistakel",
      availability: getStarterVerbAvailability("advanced-verb-lehistakel"),
      lemma: "להסתכל",
      lemma_niqqud: "לְהִסְתַּכֵּל",
      root: ["ס", "כ", "ל"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to look at", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מסתכל", "מִסְתַּכֵּל"),
          markedForm("מסתכלת", "מִסְתַּכֶּלֶת"),
          markedForm("מסתכלים", "מִסְתַּכְּלִים"),
          markedForm("מסתכלות", "מִסְתַּכְּלוֹת")
        ),
        makePast(
          markedForm("הסתכלתי", "הִסְתַּכַּלְתִּי"),
          markedForm("הסתכלת", "הִסְתַּכַּלְתָּ"),
          markedForm("הסתכלת", "הִסְתַּכַּלְתְּ"),
          markedForm("הסתכל", "הִסְתַּכֵּל"),
          markedForm("הסתכלה", "הִסְתַּכְּלָה"),
          markedForm("הסתכלנו", "הִסְתַּכַּלְנוּ"),
          markedForm("הסתכלתם", "הִסְתַּכַּלְתֶּם"),
          markedForm("הסתכלתן", "הִסְתַּכַּלְתֶּן"),
          markedForm("הסתכלו", "הִסְתַּכְּלוּ")
        ),
        makeFuture(
          markedForm("אסתכל", "אֶסְתַּכֵּל"),
          markedForm("תסתכל", "תִּסְתַּכֵּל"),
          markedForm("תסתכלי", "תִּסְתַּכְּלִי"),
          markedForm("יסתכל", "יִסְתַּכֵּל"),
          markedForm("תסתכל", "תִּסְתַּכֵּל"),
          markedForm("נסתכל", "נִסְתַּכֵּל"),
          markedForm("תסתכלו", "תִּסְתַּכְּלוּ"),
          markedForm("יסתכלו", "יִסְתַּכְּלוּ")
        ),
        makeImperative(
          markedForm("הסתכל", "הִסְתַּכֵּל"),
          markedForm("הסתכלי", "הִסְתַּכְּלִי"),
          markedForm("הסתכלו", "הִסְתַּכְּלוּ")
        )
      ),
      review_status: "approved",
      notes: "Sibilant metathesis: the ת of hitpa'el swaps with ס (התסכל → הסתכל). Takes על or ב (מסתכל עליך / בזה).",
      difficulty_level: 3,
      tags: ["hitpael", "metathesis", "everyday", "high-frequency"],
      personal_priority: 88,
    }),
    createVerbEntry({
      id: "advanced-verb-lehistader",
      availability: getStarterVerbAvailability("advanced-verb-lehistader"),
      lemma: "להסתדר",
      lemma_niqqud: "לְהִסְתַּדֵּר",
      root: ["ס", "ד", "ר"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to manage", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מסתדר", "מִסְתַּדֵּר"),
          markedForm("מסתדרת", "מִסְתַּדֶּרֶת"),
          markedForm("מסתדרים", "מִסְתַּדְּרִים"),
          markedForm("מסתדרות", "מִסְתַּדְּרוֹת")
        ),
        makePast(
          markedForm("הסתדרתי", "הִסְתַּדַּרְתִּי"),
          markedForm("הסתדרת", "הִסְתַּדַּרְתָּ"),
          markedForm("הסתדרת", "הִסְתַּדַּרְתְּ"),
          markedForm("הסתדר", "הִסְתַּדֵּר"),
          markedForm("הסתדרה", "הִסְתַּדְּרָה"),
          markedForm("הסתדרנו", "הִסְתַּדַּרְנוּ"),
          markedForm("הסתדרתם", "הִסְתַּדַּרְתֶּם"),
          markedForm("הסתדרתן", "הִסְתַּדַּרְתֶּן"),
          markedForm("הסתדרו", "הִסְתַּדְּרוּ")
        ),
        makeFuture(
          markedForm("אסתדר", "אֶסְתַּדֵּר"),
          markedForm("תסתדר", "תִּסְתַּדֵּר"),
          markedForm("תסתדרי", "תִּסְתַּדְּרִי"),
          markedForm("יסתדר", "יִסְתַּדֵּר"),
          markedForm("תסתדר", "תִּסְתַּדֵּר"),
          markedForm("נסתדר", "נִסְתַּדֵּר"),
          markedForm("תסתדרו", "תִּסְתַּדְּרוּ"),
          markedForm("יסתדרו", "יִסְתַּדְּרוּ")
        ),
        makeImperative(
          markedForm("הסתדר", "הִסְתַּדֵּר"),
          markedForm("הסתדרי", "הִסְתַּדְּרִי"),
          markedForm("הסתדרו", "הִסְתַּדְּרוּ")
        )
      ),
      review_status: "approved",
      notes: "The 'it'll work out' verb: אני אסתדר = I'll manage. Sibilant metathesis like הסתכל; also the binyan-board showcase for it (root ס-ד-ר).",
      difficulty_level: 3,
      tags: ["hitpael", "metathesis", "everyday", "high-frequency"],
      personal_priority: 87,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitragel",
      availability: getStarterVerbAvailability("advanced-verb-lehitragel"),
      lemma: "להתרגל",
      lemma_niqqud: "לְהִתְרַגֵּל",
      root: ["ר", "ג", "ל"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to get used to", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתרגל", "מִתְרַגֵּל"),
          markedForm("מתרגלת", "מִתְרַגֶּלֶת"),
          markedForm("מתרגלים", "מִתְרַגְּלִים"),
          markedForm("מתרגלות", "מִתְרַגְּלוֹת")
        ),
        makePast(
          markedForm("התרגלתי", "הִתְרַגַּלְתִּי"),
          markedForm("התרגלת", "הִתְרַגַּלְתָּ"),
          markedForm("התרגלת", "הִתְרַגַּלְתְּ"),
          markedForm("התרגל", "הִתְרַגֵּל"),
          markedForm("התרגלה", "הִתְרַגְּלָה"),
          markedForm("התרגלנו", "הִתְרַגַּלְנוּ"),
          markedForm("התרגלתם", "הִתְרַגַּלְתֶּם"),
          markedForm("התרגלתן", "הִתְרַגַּלְתֶּן"),
          markedForm("התרגלו", "הִתְרַגְּלוּ")
        ),
        makeFuture(
          markedForm("אתרגל", "אֶתְרַגֵּל"),
          markedForm("תתרגל", "תִּתְרַגֵּל"),
          markedForm("תתרגלי", "תִּתְרַגְּלִי"),
          markedForm("יתרגל", "יִתְרַגֵּל"),
          markedForm("תתרגל", "תִּתְרַגֵּל"),
          markedForm("נתרגל", "נִתְרַגֵּל"),
          markedForm("תתרגלו", "תִּתְרַגְּלוּ"),
          markedForm("יתרגלו", "יִתְרַגְּלוּ")
        ),
        makeImperative(
          markedForm("התרגל", "הִתְרַגֵּל"),
          markedForm("התרגלי", "הִתְרַגְּלִי"),
          markedForm("התרגלו", "הִתְרַגְּלוּ")
        )
      ),
      review_status: "approved",
      notes: "Takes ל־: מתרגל לחום = getting used to the heat. From the same root as רגיל (usual) and תרגיל (exercise).",
      difficulty_level: 2,
      tags: ["hitpael", "regular", "everyday", "high-frequency"],
      personal_priority: 84,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitragesh",
      availability: getStarterVerbAvailability("advanced-verb-lehitragesh"),
      lemma: "להתרגש",
      lemma_niqqud: "לְהִתְרַגֵּשׁ",
      root: ["ר", "ג", "ש"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to get excited", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתרגש", "מִתְרַגֵּשׁ"),
          markedForm("מתרגשת", "מִתְרַגֶּשֶׁת"),
          markedForm("מתרגשים", "מִתְרַגְּשִׁים"),
          markedForm("מתרגשות", "מִתְרַגְּשׁוֹת")
        ),
        makePast(
          markedForm("התרגשתי", "הִתְרַגַּשְׁתִּי"),
          markedForm("התרגשת", "הִתְרַגַּשְׁתָּ"),
          markedForm("התרגשת", "הִתְרַגַּשְׁתְּ"),
          markedForm("התרגש", "הִתְרַגֵּשׁ"),
          markedForm("התרגשה", "הִתְרַגְּשָׁה"),
          markedForm("התרגשנו", "הִתְרַגַּשְׁנוּ"),
          markedForm("התרגשתם", "הִתְרַגַּשְׁתֶּם"),
          markedForm("התרגשתן", "הִתְרַגַּשְׁתֶּן"),
          markedForm("התרגשו", "הִתְרַגְּשׁוּ")
        ),
        makeFuture(
          markedForm("אתרגש", "אֶתְרַגֵּשׁ"),
          markedForm("תתרגש", "תִּתְרַגֵּשׁ"),
          markedForm("תתרגשי", "תִּתְרַגְּשִׁי"),
          markedForm("יתרגש", "יִתְרַגֵּשׁ"),
          markedForm("תתרגש", "תִּתְרַגֵּשׁ"),
          markedForm("נתרגש", "נִתְרַגֵּשׁ"),
          markedForm("תתרגשו", "תִּתְרַגְּשׁוּ"),
          markedForm("יתרגשו", "יִתְרַגְּשׁוּ")
        ),
        makeImperative(
          markedForm("התרגש", "הִתְרַגֵּשׁ"),
          markedForm("התרגשי", "הִתְרַגְּשִׁי"),
          markedForm("התרגשו", "הִתְרַגְּשׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Emotion hitpa'el from ר-ג-ש (feeling): get excited or moved. Same root as להרגיש and the binyan-board root ר-ג-ש.",
      difficulty_level: 2,
      tags: ["hitpael", "regular", "everyday"],
      personal_priority: 82,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitorer",
      availability: getStarterVerbAvailability("advanced-verb-lehitorer"),
      lemma: "להתעורר",
      lemma_niqqud: "לְהִתְעוֹרֵר",
      root: ["ע", "ו", "ר"],
      binyan: "hitpael",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to wake up", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתעורר", "מִתְעוֹרֵר"),
          markedForm("מתעוררת", "מִתְעוֹרֶרֶת"),
          markedForm("מתעוררים", "מִתְעוֹרְרִים"),
          markedForm("מתעוררות", "מִתְעוֹרְרוֹת")
        ),
        makePast(
          markedForm("התעוררתי", "הִתְעוֹרַרְתִּי"),
          markedForm("התעוררת", "הִתְעוֹרַרְתָּ"),
          markedForm("התעוררת", "הִתְעוֹרַרְתְּ"),
          markedForm("התעורר", "הִתְעוֹרֵר"),
          markedForm("התעוררה", "הִתְעוֹרְרָה"),
          markedForm("התעוררנו", "הִתְעוֹרַרְנוּ"),
          markedForm("התעוררתם", "הִתְעוֹרַרְתֶּם"),
          markedForm("התעוררתן", "הִתְעוֹרַרְתֶּן"),
          markedForm("התעוררו", "הִתְעוֹרְרוּ")
        ),
        makeFuture(
          markedForm("אתעורר", "אֶתְעוֹרֵר"),
          markedForm("תתעורר", "תִּתְעוֹרֵר"),
          markedForm("תתעוררי", "תִּתְעוֹרְרִי"),
          markedForm("יתעורר", "יִתְעוֹרֵר"),
          markedForm("תתעורר", "תִּתְעוֹרֵר"),
          markedForm("נתעורר", "נִתְעוֹרֵר"),
          markedForm("תתעוררו", "תִּתְעוֹרְרוּ"),
          markedForm("יתעוררו", "יִתְעוֹרְרוּ")
        ),
        makeImperative(
          markedForm("התעורר", "הִתְעוֹרֵר"),
          markedForm("התעוררי", "הִתְעוֹרְרִי"),
          markedForm("התעוררו", "הִתְעוֹרְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Hollow root ע-ו-ר, so the hitpa'el slot is realized as hitpolel (הִתְעוֹרֵר) — same pattern as התקומם from the binyan board.",
      difficulty_level: 4,
      tags: ["hitpael", "irregular", "hitpolel", "everyday", "high-frequency"],
      personal_priority: 86,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitkaleach",
      availability: getStarterVerbAvailability("advanced-verb-lehitkaleach"),
      lemma: "להתקלח",
      lemma_niqqud: "לְהִתְקַלֵּחַ",
      root: ["ק", "ל", "ח"],
      binyan: "hitpael",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to shower", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתקלח", "מִתְקַלֵּחַ"),
          markedForm("מתקלחת", "מִתְקַלַּחַת"),
          markedForm("מתקלחים", "מִתְקַלְּחִים"),
          markedForm("מתקלחות", "מִתְקַלְּחוֹת")
        ),
        makePast(
          markedForm("התקלחתי", "הִתְקַלַּחְתִּי"),
          markedForm("התקלחת", "הִתְקַלַּחְתָּ"),
          markedForm("התקלחת", "הִתְקַלַּחַתְּ"),
          markedForm("התקלח", "הִתְקַלֵּחַ"),
          markedForm("התקלחה", "הִתְקַלְּחָה"),
          markedForm("התקלחנו", "הִתְקַלַּחְנוּ"),
          markedForm("התקלחתם", "הִתְקַלַּחְתֶּם"),
          markedForm("התקלחתן", "הִתְקַלַּחְתֶּן"),
          markedForm("התקלחו", "הִתְקַלְּחוּ")
        ),
        makeFuture(
          markedForm("אתקלח", "אֶתְקַלֵּחַ"),
          markedForm("תתקלח", "תִּתְקַלֵּחַ"),
          markedForm("תתקלחי", "תִּתְקַלְּחִי"),
          markedForm("יתקלח", "יִתְקַלֵּחַ"),
          markedForm("תתקלח", "תִּתְקַלֵּחַ"),
          markedForm("נתקלח", "נִתְקַלֵּחַ"),
          markedForm("תתקלחו", "תִּתְקַלְּחוּ"),
          markedForm("יתקלחו", "יִתְקַלְּחוּ")
        ),
        makeImperative(
          markedForm("התקלח", "הִתְקַלֵּחַ"),
          markedForm("התקלחי", "הִתְקַלְּחִי"),
          markedForm("התקלחו", "הִתְקַלְּחוּ")
        )
      ),
      review_status: "approved",
      notes: "ל\"ח verb: the final ח takes a furtive patach (מִתְקַלֵּחַ) and colors nearby vowels (מִתְקַלַּחַת, הִתְקַלַּחַתְּ). From קילוח (a stream of water).",
      difficulty_level: 3,
      tags: ["hitpael", "irregular", "lamed-guttural", "everyday"],
      personal_priority: 83,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitamen",
      availability: getStarterVerbAvailability("advanced-verb-lehitamen"),
      lemma: "להתאמן",
      lemma_niqqud: "לְהִתְאַמֵּן",
      root: ["א", "מ", "נ"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to work out", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתאמן", "מִתְאַמֵּן"),
          markedForm("מתאמנת", "מִתְאַמֶּנֶת"),
          markedForm("מתאמנים", "מִתְאַמְּנִים"),
          markedForm("מתאמנות", "מִתְאַמְּנוֹת")
        ),
        makePast(
          markedForm("התאמנתי", "הִתְאַמַּנְתִּי"),
          markedForm("התאמנת", "הִתְאַמַּנְתָּ"),
          markedForm("התאמנת", "הִתְאַמַּנְתְּ"),
          markedForm("התאמן", "הִתְאַמֵּן"),
          markedForm("התאמנה", "הִתְאַמְּנָה"),
          markedForm("התאמנו", "הִתְאַמַּנּוּ"),
          markedForm("התאמנתם", "הִתְאַמַּנְתֶּם"),
          markedForm("התאמנתן", "הִתְאַמַּנְתֶּן"),
          markedForm("התאמנו", "הִתְאַמְּנוּ")
        ),
        makeFuture(
          markedForm("אתאמן", "אֶתְאַמֵּן"),
          markedForm("תתאמן", "תִּתְאַמֵּן"),
          markedForm("תתאמני", "תִּתְאַמְּנִי"),
          markedForm("יתאמן", "יִתְאַמֵּן"),
          markedForm("תתאמן", "תִּתְאַמֵּן"),
          markedForm("נתאמן", "נִתְאַמֵּן"),
          markedForm("תתאמנו", "תִּתְאַמְּנוּ"),
          markedForm("יתאמנו", "יִתְאַמְּנוּ")
        ),
        makeImperative(
          markedForm("התאמן", "הִתְאַמֵּן"),
          markedForm("התאמני", "הִתְאַמְּנִי"),
          markedForm("התאמנו", "הִתְאַמְּנוּ")
        )
      ),
      review_status: "approved",
      notes: "Gym and practice verb (מתאמן בחדר כושר). Past 1pl הִתְאַמַּנּוּ and 3pl הִתְאַמְּנוּ share the plain spelling התאמנו — only the niqqud separates them, like תכננו from לתכנן.",
      difficulty_level: 2,
      tags: ["hitpael", "regular", "everyday"],
      personal_priority: 80,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitkadem",
      availability: getStarterVerbAvailability("advanced-verb-lehitkadem"),
      lemma: "להתקדם",
      lemma_niqqud: "לְהִתְקַדֵּם",
      root: ["ק", "ד", "מ"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to make progress", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתקדם", "מִתְקַדֵּם"),
          markedForm("מתקדמת", "מִתְקַדֶּמֶת"),
          markedForm("מתקדמים", "מִתְקַדְּמִים"),
          markedForm("מתקדמות", "מִתְקַדְּמוֹת")
        ),
        makePast(
          markedForm("התקדמתי", "הִתְקַדַּמְתִּי"),
          markedForm("התקדמת", "הִתְקַדַּמְתָּ"),
          markedForm("התקדמת", "הִתְקַדַּמְתְּ"),
          markedForm("התקדם", "הִתְקַדֵּם"),
          markedForm("התקדמה", "הִתְקַדְּמָה"),
          markedForm("התקדמנו", "הִתְקַדַּמְנוּ"),
          markedForm("התקדמתם", "הִתְקַדַּמְתֶּם"),
          markedForm("התקדמתן", "הִתְקַדַּמְתֶּן"),
          markedForm("התקדמו", "הִתְקַדְּמוּ")
        ),
        makeFuture(
          markedForm("אתקדם", "אֶתְקַדֵּם"),
          markedForm("תתקדם", "תִּתְקַדֵּם"),
          markedForm("תתקדמי", "תִּתְקַדְּמִי"),
          markedForm("יתקדם", "יִתְקַדֵּם"),
          markedForm("תתקדם", "תִּתְקַדֵּם"),
          markedForm("נתקדם", "נִתְקַדֵּם"),
          markedForm("תתקדמו", "תִּתְקַדְּמוּ"),
          markedForm("יתקדמו", "יִתְקַדְּמוּ")
        ),
        makeImperative(
          markedForm("התקדם", "הִתְקַדֵּם"),
          markedForm("התקדמי", "הִתְקַדְּמִי"),
          markedForm("התקדמו", "הִתְקַדְּמוּ")
        )
      ),
      review_status: "approved",
      notes: "Progress verb from ק-ד-מ (front/forward): advance, move ahead — literal steps or a project. בוא נתקדם = let's move forward.",
      difficulty_level: 2,
      tags: ["hitpael", "regular", "everyday", "work"],
      personal_priority: 78,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitnaheg",
      availability: getStarterVerbAvailability("advanced-verb-lehitnaheg"),
      lemma: "להתנהג",
      lemma_niqqud: "לְהִתְנַהֵג",
      root: ["נ", "ה", "ג"],
      binyan: "hitpael",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to behave", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתנהג", "מִתְנַהֵג"),
          markedForm("מתנהגת", "מִתְנַהֶגֶת"),
          markedForm("מתנהגים", "מִתְנַהֲגִים"),
          markedForm("מתנהגות", "מִתְנַהֲגוֹת")
        ),
        makePast(
          markedForm("התנהגתי", "הִתְנַהַגְתִּי"),
          markedForm("התנהגת", "הִתְנַהַגְתָּ"),
          markedForm("התנהגת", "הִתְנַהַגְתְּ"),
          markedForm("התנהג", "הִתְנַהֵג"),
          markedForm("התנהגה", "הִתְנַהֲגָה"),
          markedForm("התנהגנו", "הִתְנַהַגְנוּ"),
          markedForm("התנהגתם", "הִתְנַהַגְתֶּם"),
          markedForm("התנהגתן", "הִתְנַהַגְתֶּן"),
          markedForm("התנהגו", "הִתְנַהֲגוּ")
        ),
        makeFuture(
          markedForm("אתנהג", "אֶתְנַהֵג"),
          markedForm("תתנהג", "תִּתְנַהֵג"),
          markedForm("תתנהגי", "תִּתְנַהֲגִי"),
          markedForm("יתנהג", "יִתְנַהֵג"),
          markedForm("תתנהג", "תִּתְנַהֵג"),
          markedForm("נתנהג", "נִתְנַהֵג"),
          markedForm("תתנהגו", "תִּתְנַהֲגוּ"),
          markedForm("יתנהגו", "יִתְנַהֲגוּ")
        ),
        makeImperative(
          markedForm("התנהג", "הִתְנַהֵג"),
          markedForm("התנהגי", "הִתְנַהֲגִי"),
          markedForm("התנהגו", "הִתְנַהֲגוּ")
        )
      ),
      review_status: "approved",
      notes: "ע' guttural: the ה refuses dagesh and a plain sheva, so plural forms take chataf-patach (מִתְנַהֲגִים). Same root as נהג (driver).",
      difficulty_level: 3,
      tags: ["hitpael", "irregular", "ayin-guttural", "everyday"],
      personal_priority: 77,
    }),
    createVerbEntry({
      id: "advanced-verb-lehitstaer",
      availability: getStarterVerbAvailability("advanced-verb-lehitstaer"),
      lemma: "להצטער",
      lemma_niqqud: "לְהִצְטַעֵר",
      root: ["צ", "ע", "ר"],
      binyan: "hitpael",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to be sorry", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מצטער", "מִצְטַעֵר"),
          markedForm("מצטערת", "מִצְטַעֶרֶת"),
          markedForm("מצטערים", "מִצְטַעֲרִים"),
          markedForm("מצטערות", "מִצְטַעֲרוֹת")
        ),
        makePast(
          markedForm("הצטערתי", "הִצְטַעַרְתִּי"),
          markedForm("הצטערת", "הִצְטַעַרְתָּ"),
          markedForm("הצטערת", "הִצְטַעַרְתְּ"),
          markedForm("הצטער", "הִצְטַעֵר"),
          markedForm("הצטערה", "הִצְטַעֲרָה"),
          markedForm("הצטערנו", "הִצְטַעַרְנוּ"),
          markedForm("הצטערתם", "הִצְטַעַרְתֶּם"),
          markedForm("הצטערתן", "הִצְטַעַרְתֶּן"),
          markedForm("הצטערו", "הִצְטַעֲרוּ")
        ),
        makeFuture(
          markedForm("אצטער", "אֶצְטַעֵר"),
          markedForm("תצטער", "תִּצְטַעֵר"),
          markedForm("תצטערי", "תִּצְטַעֲרִי"),
          markedForm("יצטער", "יִצְטַעֵר"),
          markedForm("תצטער", "תִּצְטַעֵר"),
          markedForm("נצטער", "נִצְטַעֵר"),
          markedForm("תצטערו", "תִּצְטַעֲרוּ"),
          markedForm("יצטערו", "יִצְטַעֲרוּ")
        ),
        makeImperative(
          markedForm("הצטער", "הִצְטַעֵר"),
          markedForm("הצטערי", "הִצְטַעֲרִי"),
          markedForm("הצטערו", "הִצְטַעֲרוּ")
        )
      ),
      review_status: "approved",
      notes: "Emphatic metathesis: the ת swaps and hardens to ט after צ (התצער → הצטער), like הצטלם. The everyday מצטער = 'sorry'. Same mechanics as the seed verb להצטרך.",
      difficulty_level: 3,
      tags: ["hitpael", "irregular", "metathesis", "everyday", "high-frequency"],
      personal_priority: 85,
    }),
    createVerbEntry({
      id: "advanced-verb-lehishtatef",
      availability: getStarterVerbAvailability("advanced-verb-lehishtatef"),
      lemma: "להשתתף",
      lemma_niqqud: "לְהִשְׁתַּתֵּף",
      root: ["ש", "ת", "פ"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to participate", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("משתתף", "מִשְׁתַּתֵּף"),
          markedForm("משתתפת", "מִשְׁתַּתֶּפֶת"),
          markedForm("משתתפים", "מִשְׁתַּתְּפִים"),
          markedForm("משתתפות", "מִשְׁתַּתְּפוֹת")
        ),
        makePast(
          markedForm("השתתפתי", "הִשְׁתַּתַּפְתִּי"),
          markedForm("השתתפת", "הִשְׁתַּתַּפְתָּ"),
          markedForm("השתתפת", "הִשְׁתַּתַּפְתְּ"),
          markedForm("השתתף", "הִשְׁתַּתֵּף"),
          markedForm("השתתפה", "הִשְׁתַּתְּפָה"),
          markedForm("השתתפנו", "הִשְׁתַּתַּפְנוּ"),
          markedForm("השתתפתם", "הִשְׁתַּתַּפְתֶּם"),
          markedForm("השתתפתן", "הִשְׁתַּתַּפְתֶּן"),
          markedForm("השתתפו", "הִשְׁתַּתְּפוּ")
        ),
        makeFuture(
          markedForm("אשתתף", "אֶשְׁתַּתֵּף"),
          markedForm("תשתתף", "תִּשְׁתַּתֵּף"),
          markedForm("תשתתפי", "תִּשְׁתַּתְּפִי"),
          markedForm("ישתתף", "יִשְׁתַּתֵּף"),
          markedForm("תשתתף", "תִּשְׁתַּתֵּף"),
          markedForm("נשתתף", "נִשְׁתַּתֵּף"),
          markedForm("תשתתפו", "תִּשְׁתַּתְּפוּ"),
          markedForm("ישתתפו", "יִשְׁתַּתְּפוּ")
        ),
        makeImperative(
          markedForm("השתתף", "הִשְׁתַּתֵּף"),
          markedForm("השתתפי", "הִשְׁתַּתְּפִי"),
          markedForm("השתתפו", "הִשְׁתַּתְּפוּ")
        )
      ),
      review_status: "approved",
      notes: "Takes ב־: משתתף בפגישה = participates in the meeting. Sibilant metathesis with ש, exactly like the seed verb להשתמש.",
      difficulty_level: 3,
      tags: ["hitpael", "metathesis", "work", "everyday"],
      personal_priority: 76,
    }),
    createVerbEntry({
      id: "advanced-verb-lehizaher",
      availability: getStarterVerbAvailability("advanced-verb-lehizaher"),
      lemma: "להיזהר",
      lemma_niqqud: "לְהִזָּהֵר",
      root: ["ז", "ה", "ר"],
      binyan: "nifal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to be careful", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נזהר", "נִזְהָר"),
          markedForm("נזהרת", "נִזְהֶרֶת"),
          markedForm("נזהרים", "נִזְהָרִים"),
          markedForm("נזהרות", "נִזְהָרוֹת")
        ),
        makePast(
          markedForm("נזהרתי", "נִזְהַרְתִּי"),
          markedForm("נזהרת", "נִזְהַרְתָּ"),
          markedForm("נזהרת", "נִזְהַרְתְּ"),
          markedForm("נזהר", "נִזְהַר"),
          markedForm("נזהרה", "נִזְהֲרָה"),
          markedForm("נזהרנו", "נִזְהַרְנוּ"),
          markedForm("נזהרתם", "נִזְהַרְתֶּם"),
          markedForm("נזהרתן", "נִזְהַרְתֶּן"),
          markedForm("נזהרו", "נִזְהֲרוּ")
        ),
        makeFuture(
          markedForm("איזהר", "אֶזָּהֵר"),
          markedForm("תיזהר", "תִּזָּהֵר"),
          markedForm("תיזהרי", "תִּזָּהֲרִי"),
          markedForm("ייזהר", "יִזָּהֵר"),
          markedForm("תיזהר", "תִּזָּהֵר"),
          markedForm("ניזהר", "נִזָּהֵר"),
          markedForm("תיזהרו", "תִּזָּהֲרוּ"),
          markedForm("ייזהרו", "יִזָּהֲרוּ")
        ),
        makeImperative(
          markedForm("היזהר", "הִזָּהֵר"),
          markedForm("היזהרי", "הִזָּהֲרִי"),
          markedForm("היזהרו", "הִזָּהֲרוּ")
        )
      ),
      review_status: "approved",
      notes: "The warning verb: תיזהר! = careful! Takes מ־ for the danger (נזהר מהכלב). The ה takes chataf-patach before vocalic endings (נִזְהֲרָה, תִּזָּהֲרִי).",
      difficulty_level: 3,
      tags: ["nifal", "irregular", "everyday", "high-frequency"],
      personal_priority: 84,
    }),
    createVerbEntry({
      id: "advanced-verb-leheradem",
      availability: getStarterVerbAvailability("advanced-verb-leheradem"),
      lemma: "להירדם",
      lemma_niqqud: "לְהֵרָדֵם",
      root: ["ר", "ד", "מ"],
      binyan: "nifal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to fall asleep", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נרדם", "נִרְדָּם"),
          markedForm("נרדמת", "נִרְדֶּמֶת"),
          markedForm("נרדמים", "נִרְדָּמִים"),
          markedForm("נרדמות", "נִרְדָּמוֹת")
        ),
        makePast(
          markedForm("נרדמתי", "נִרְדַּמְתִּי"),
          markedForm("נרדמת", "נִרְדַּמְתָּ"),
          markedForm("נרדמת", "נִרְדַּמְתְּ"),
          markedForm("נרדם", "נִרְדַּם"),
          markedForm("נרדמה", "נִרְדְּמָה"),
          markedForm("נרדמנו", "נִרְדַּמְנוּ"),
          markedForm("נרדמתם", "נִרְדַּמְתֶּם"),
          markedForm("נרדמתן", "נִרְדַּמְתֶּן"),
          markedForm("נרדמו", "נִרְדְּמוּ")
        ),
        makeFuture(
          markedForm("אירדם", "אֵרָדֵם"),
          markedForm("תירדם", "תֵּרָדֵם"),
          markedForm("תירדמי", "תֵּרָדְמִי"),
          markedForm("יירדם", "יֵרָדֵם"),
          markedForm("תירדם", "תֵּרָדֵם"),
          markedForm("נירדם", "נֵרָדֵם"),
          markedForm("תירדמו", "תֵּרָדְמוּ"),
          markedForm("יירדמו", "יֵרָדְמוּ")
        ),
        makeImperative(
          markedForm("הירדם", "הֵרָדֵם"),
          markedForm("הירדמי", "הֵרָדְמִי"),
          markedForm("הירדמו", "הֵרָדְמוּ")
        )
      ),
      review_status: "approved",
      notes: "The ר rejects the nif'al dagesh, so the future/infinitive prefix compensates with tsere: לְהֵרָדֵם, יֵרָדֵם (not *יִרָּדֵם).",
      difficulty_level: 3,
      tags: ["nifal", "irregular", "everyday", "high-frequency"],
      personal_priority: 83,
    }),
    createVerbEntry({
      id: "advanced-verb-lehigamer",
      availability: getStarterVerbAvailability("advanced-verb-lehigamer"),
      lemma: "להיגמר",
      lemma_niqqud: "לְהִגָּמֵר",
      root: ["ג", "מ", "ר"],
      binyan: "nifal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to end", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נגמר", "נִגְמָר"),
          markedForm("נגמרת", "נִגְמֶרֶת"),
          markedForm("נגמרים", "נִגְמָרִים"),
          markedForm("נגמרות", "נִגְמָרוֹת")
        ),
        makePast(
          markedForm("נגמרתי", "נִגְמַרְתִּי"),
          markedForm("נגמרת", "נִגְמַרְתָּ"),
          markedForm("נגמרת", "נִגְמַרְתְּ"),
          markedForm("נגמר", "נִגְמַר"),
          markedForm("נגמרה", "נִגְמְרָה"),
          markedForm("נגמרנו", "נִגְמַרְנוּ"),
          markedForm("נגמרתם", "נִגְמַרְתֶּם"),
          markedForm("נגמרתן", "נִגְמַרְתֶּן"),
          markedForm("נגמרו", "נִגְמְרוּ")
        ),
        makeFuture(
          markedForm("איגמר", "אֶגָּמֵר"),
          markedForm("תיגמר", "תִּגָּמֵר"),
          markedForm("תיגמרי", "תִּגָּמְרִי"),
          markedForm("ייגמר", "יִגָּמֵר"),
          markedForm("תיגמר", "תִּגָּמֵר"),
          markedForm("ניגמר", "נִגָּמֵר"),
          markedForm("תיגמרו", "תִּגָּמְרוּ"),
          markedForm("ייגמרו", "יִגָּמְרוּ")
        ),
        makeImperative(
          markedForm("היגמר", "הִגָּמֵר"),
          markedForm("היגמרי", "הִגָּמְרִי"),
          markedForm("היגמרו", "הִגָּמְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Intransitive twin of the seed verb לגמור: השיעור נגמר = the lesson ended. With a dative it means running out: נגמר לי הכסף (see the sentence bank's נגמרה לי הסוללה).",
      difficulty_level: 2,
      tags: ["nifal", "regular", "everyday", "high-frequency"],
      personal_priority: 82,
    }),
    createVerbEntry({
      id: "advanced-verb-lehipared",
      availability: getStarterVerbAvailability("advanced-verb-lehipared"),
      lemma: "להיפרד",
      lemma_niqqud: "לְהִפָּרֵד",
      root: ["פ", "ר", "ד"],
      binyan: "nifal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to say goodbye", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נפרד", "נִפְרָד"),
          markedForm("נפרדת", "נִפְרֶדֶת"),
          markedForm("נפרדים", "נִפְרָדִים"),
          markedForm("נפרדות", "נִפְרָדוֹת")
        ),
        makePast(
          markedForm("נפרדתי", "נִפְרַדְתִּי"),
          markedForm("נפרדת", "נִפְרַדְתָּ"),
          markedForm("נפרדת", "נִפְרַדְתְּ"),
          markedForm("נפרד", "נִפְרַד"),
          markedForm("נפרדה", "נִפְרְדָה"),
          markedForm("נפרדנו", "נִפְרַדְנוּ"),
          markedForm("נפרדתם", "נִפְרַדְתֶּם"),
          markedForm("נפרדתן", "נִפְרַדְתֶּן"),
          markedForm("נפרדו", "נִפְרְדוּ")
        ),
        makeFuture(
          markedForm("איפרד", "אֶפָּרֵד"),
          markedForm("תיפרד", "תִּפָּרֵד"),
          markedForm("תיפרדי", "תִּפָּרְדִי"),
          markedForm("ייפרד", "יִפָּרֵד"),
          markedForm("תיפרד", "תִּפָּרֵד"),
          markedForm("ניפרד", "נִפָּרֵד"),
          markedForm("תיפרדו", "תִּפָּרְדוּ"),
          markedForm("ייפרדו", "יִפָּרְדוּ")
        ),
        makeImperative(
          markedForm("היפרד", "הִפָּרֵד"),
          markedForm("היפרדי", "הִפָּרְדִי"),
          markedForm("היפרדו", "הִפָּרְדוּ")
        )
      ),
      review_status: "approved",
      notes: "Takes מ־: נפרדתי מההורים = I said goodbye to my parents. Between partners it means breaking up (הם נפרדו).",
      difficulty_level: 2,
      tags: ["nifal", "regular", "everyday"],
      personal_priority: 78,
    }),
    createVerbEntry({
      id: "advanced-verb-lehishaver",
      availability: getStarterVerbAvailability("advanced-verb-lehishaver"),
      lemma: "להישבר",
      lemma_niqqud: "לְהִשָּׁבֵר",
      root: ["ש", "ב", "ר"],
      binyan: "nifal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to break", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נשבר", "נִשְׁבָּר"),
          markedForm("נשברת", "נִשְׁבֶּרֶת"),
          markedForm("נשברים", "נִשְׁבָּרִים"),
          markedForm("נשברות", "נִשְׁבָּרוֹת")
        ),
        makePast(
          markedForm("נשברתי", "נִשְׁבַּרְתִּי"),
          markedForm("נשברת", "נִשְׁבַּרְתָּ"),
          markedForm("נשברת", "נִשְׁבַּרְתְּ"),
          markedForm("נשבר", "נִשְׁבַּר"),
          markedForm("נשברה", "נִשְׁבְּרָה"),
          markedForm("נשברנו", "נִשְׁבַּרְנוּ"),
          markedForm("נשברתם", "נִשְׁבַּרְתֶּם"),
          markedForm("נשברתן", "נִשְׁבַּרְתֶּן"),
          markedForm("נשברו", "נִשְׁבְּרוּ")
        ),
        makeFuture(
          markedForm("אישבר", "אֶשָּׁבֵר"),
          markedForm("תישבר", "תִּשָּׁבֵר"),
          markedForm("תישברי", "תִּשָּׁבְרִי"),
          markedForm("יישבר", "יִשָּׁבֵר"),
          markedForm("תישבר", "תִּשָּׁבֵר"),
          markedForm("נישבר", "נִשָּׁבֵר"),
          markedForm("תישברו", "תִּשָּׁבְרוּ"),
          markedForm("יישברו", "יִשָּׁבְרוּ")
        ),
        makeImperative(
          markedForm("הישבר", "הִשָּׁבֵר"),
          markedForm("הישברי", "הִשָּׁבְרִי"),
          markedForm("הישברו", "הִשָּׁבְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Intransitive break: הכוס נשברה = the glass broke. Slang with dative: נשבר לי = I've had it / I'm fed up.",
      difficulty_level: 2,
      tags: ["nifal", "regular", "everyday"],
      personal_priority: 77,
    }),
    createVerbEntry({
      id: "advanced-verb-leheraot",
      availability: getStarterVerbAvailability("advanced-verb-leheraot"),
      lemma: "להיראות",
      lemma_niqqud: "לְהֵרָאוֹת",
      root: ["ר", "א", "ה"],
      binyan: "nifal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to seem", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נראה", "נִרְאֶה"),
          markedForm("נראית", "נִרְאֵית"),
          markedForm("נראים", "נִרְאִים"),
          markedForm("נראות", "נִרְאוֹת")
        ),
        makePast(
          markedForm("נראיתי", "נִרְאֵיתִי"),
          markedForm("נראית", "נִרְאֵיתָ"),
          markedForm("נראית", "נִרְאֵית"),
          markedForm("נראה", "נִרְאָה"),
          markedForm("נראתה", "נִרְאֲתָה"),
          markedForm("נראינו", "נִרְאֵינוּ"),
          markedForm("נראיתם", "נִרְאֵיתֶם"),
          markedForm("נראיתן", "נִרְאֵיתֶן"),
          markedForm("נראו", "נִרְאוּ")
        ),
        makeFuture(
          markedForm("איראה", "אֵרָאֶה"),
          markedForm("תיראה", "תֵּרָאֶה"),
          markedForm("תיראי", "תֵּרָאִי"),
          markedForm("ייראה", "יֵרָאֶה"),
          markedForm("תיראה", "תֵּרָאֶה"),
          markedForm("ניראה", "נֵרָאֶה"),
          markedForm("תיראו", "תֵּרָאוּ"),
          markedForm("ייראו", "יֵרָאוּ")
        )
      ),
      review_status: "approved",
      notes: "ל\"ה nif'al of ר-א-ה: look/seem/appear. The workhorse phrase is נראה לי = 'seems to me / I think'. Imperative is archaic, so it is omitted. The ר forces a tsere prefix (לְהֵרָאוֹת, יֵרָאֶה).",
      difficulty_level: 4,
      tags: ["nifal", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 88,
    }),
    createVerbEntry({
      id: "advanced-verb-lehealem",
      availability: getStarterVerbAvailability("advanced-verb-lehealem"),
      lemma: "להיעלם",
      lemma_niqqud: "לְהֵעָלֵם",
      root: ["ע", "ל", "מ"],
      binyan: "nifal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to disappear", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נעלם", "נֶעְלָם"),
          markedForm("נעלמת", "נֶעְלֶמֶת"),
          markedForm("נעלמים", "נֶעְלָמִים"),
          markedForm("נעלמות", "נֶעְלָמוֹת")
        ),
        makePast(
          markedForm("נעלמתי", "נֶעְלַמְתִּי"),
          markedForm("נעלמת", "נֶעְלַמְתָּ"),
          markedForm("נעלמת", "נֶעְלַמְתְּ"),
          markedForm("נעלם", "נֶעְלַם"),
          markedForm("נעלמה", "נֶעֶלְמָה"),
          markedForm("נעלמנו", "נֶעְלַמְנוּ"),
          markedForm("נעלמתם", "נֶעְלַמְתֶּם"),
          markedForm("נעלמתן", "נֶעְלַמְתֶּן"),
          markedForm("נעלמו", "נֶעֶלְמוּ")
        ),
        makeFuture(
          markedForm("איעלם", "אֵעָלֵם"),
          markedForm("תיעלם", "תֵּעָלֵם"),
          markedForm("תיעלמי", "תֵּעָלְמִי"),
          markedForm("ייעלם", "יֵעָלֵם"),
          markedForm("תיעלם", "תֵּעָלֵם"),
          markedForm("ניעלם", "נֵעָלֵם"),
          markedForm("תיעלמו", "תֵּעָלְמוּ"),
          markedForm("ייעלמו", "יֵעָלְמוּ")
        ),
        makeImperative(
          markedForm("היעלם", "הֵעָלֵם"),
          markedForm("היעלמי", "הֵעָלְמִי"),
          markedForm("היעלמו", "הֵעָלְמוּ")
        )
      ),
      review_status: "approved",
      notes: "פ' guttural nif'al: the ע rejects the dagesh, so the prefix takes tsere (לְהֵעָלֵם, יֵעָלֵם) and the present opens with segol (נֶעְלָם). Ghosting vocabulary: הוא פשוט נעלם.",
      difficulty_level: 3,
      tags: ["nifal", "irregular", "pe-guttural", "everyday"],
      personal_priority: 79,
    }),
    createVerbEntry({
      id: "advanced-verb-lehivaled",
      availability: getStarterVerbAvailability("advanced-verb-lehivaled"),
      lemma: "להיוולד",
      lemma_niqqud: "לְהִוָּלֵד",
      root: ["י", "ל", "ד"],
      binyan: "nifal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to be born", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נולד", "נוֹלָד"),
          markedForm("נולדת", "נוֹלֶדֶת"),
          markedForm("נולדים", "נוֹלָדִים"),
          markedForm("נולדות", "נוֹלָדוֹת")
        ),
        makePast(
          markedForm("נולדתי", "נוֹלַדְתִּי"),
          markedForm("נולדת", "נוֹלַדְתָּ"),
          markedForm("נולדת", "נוֹלַדְתְּ"),
          markedForm("נולד", "נוֹלַד"),
          markedForm("נולדה", "נוֹלְדָה"),
          markedForm("נולדנו", "נוֹלַדְנוּ"),
          markedForm("נולדתם", "נוֹלַדְתֶּם"),
          markedForm("נולדתן", "נוֹלַדְתֶּן"),
          markedForm("נולדו", "נוֹלְדוּ")
        ),
        makeFuture(
          markedForm("איוולד", "אֶוָּלֵד"),
          markedForm("תיוולד", "תִּוָּלֵד"),
          markedForm("תיוולדי", "תִּוָּלְדִי"),
          markedForm("ייוולד", "יִוָּלֵד"),
          markedForm("תיוולד", "תִּוָּלֵד"),
          markedForm("ניוולד", "נִוָּלֵד"),
          markedForm("תיוולדו", "תִּוָּלְדוּ"),
          markedForm("ייוולדו", "יִוָּלְדוּ")
        )
      ),
      review_status: "approved",
      notes: "פ\"י nif'al: the yod becomes וֹ in past/present (נוֹלַד — like נוֹדַע) but a doubled consonantal ו in the future (יִוָּלֵד, plain ייוולד). נולדתי ב… = I was born in…. Imperative omitted (unused).",
      difficulty_level: 4,
      tags: ["nifal", "irregular", "pe-yod", "high-frequency"],
      personal_priority: 81,
    }),
  ];
}

const STARTER_VERBS = buildStarterVerbEntries();

function getSeedVerbEntries() {
  return cloneData(STARTER_VERBS);
}

function getSeedVocabularyEntries() {
  const entries = [];

  getSeedVerbEntries().forEach((entry) => {
    const studyItems = expandEntryToStudyItems(entry);
    studyItems.forEach((item) => {
      entries.push({
        id: item.word.id,
        category: item.word.category,
        en: item.word.en,
        he: item.word.he,
        heNiqqud: item.word.heNiqqud,
        utility: item.word.utility,
        availability: cloneData(item.word.availability || AVAILABILITY_DEFAULTS),
        source: "verb-seed",
      });
    });
  });

  return entries;
}

function buildVerbConjugationDeck(config) {
  const options = config && typeof config === "object" ? config : {};
  const vocabulary = Array.isArray(options.vocabulary) ? options.vocabulary : [];
  const customEntries = Array.isArray(options.entries) ? options.entries.map((entry) => createVerbEntry(entry)) : [];
  const migrated = migrateVocabulary(vocabulary);
  const seedEntries = getSeedVerbEntries();
  const mergedEntries = mergeVerbEntries(seedEntries, customEntries.concat(migrated.entries));
  const deck = [];

  mergedEntries
    .sort((left, right) => {
      if ((right.personal_priority || 0) !== (left.personal_priority || 0)) {
        return (right.personal_priority || 0) - (left.personal_priority || 0);
      }
      return String(left.lemma || "").localeCompare(String(right.lemma || ""), "he");
    })
    .forEach((entry) => {
      const items = expandEntryToStudyItems(entry);
      items.forEach((item) => {
        const resolved = resolveLearnerFacingForms(item.entry, item.sense, options);
        if (!resolved) return;

        const forms = flattenVerbForms(resolved.forms, item.sense.gloss, options);
        if (forms.length < 4) return;

        deck.push({
          id: item.word.id,
          word: item.word,
          forms,
          formSource: resolved.source,
          reviewStatus: item.entry.review_status,
          usagePattern: item.sense.usage_pattern || item.entry.usage_pattern || null,
        });
      });
    });

  return deck;
}

function expandEntryToStudyItems(entry) {
  const senses = Array.isArray(entry?.senses) ? entry.senses.filter((sense) => sense && String(sense.gloss || "").trim()) : [];
  if (!senses.length) return [];

  if (!isConjugationCandidate(entry) && !hasAuthoritativeForms(entry)) {
    return [];
  }

  return senses.map((sense, index) => ({
    entry,
    sense,
    word: buildStudyWord(entry, sense, index),
  }));
}

function buildStudyWord(entry, sense, senseIndex) {
  const usagePattern = sense?.usage_pattern || entry?.usage_pattern || null;
  const multipleSenses = Array.isArray(entry?.senses) && entry.senses.length > 1;
  const lemmaPlain = String(entry?.lemma || "").trim();
  const lemmaNiqqud = String(entry?.lemma_niqqud || entry?.lemmaNiqqud || entry?.lemma || "").trim();
  const preferredId = !multipleSenses && Array.isArray(entry?.source_word_ids) && entry.source_word_ids.length === 1
    ? entry.source_word_ids[0]
    : `${String(entry?.id || slugifyHebrewId(entry?.lemma || "verb"))}--sense-${senseIndex + 1}`;

  return {
    id: preferredId,
    category: String(entry?.category || "core_advanced"),
    en: usagePattern ? `${String(sense?.gloss || "").trim()} (${usagePattern})` : String(sense?.gloss || "").trim(),
    he: usagePattern ? `${lemmaPlain} ${usagePattern}` : lemmaPlain,
    heNiqqud: usagePattern ? `${lemmaNiqqud} ${usagePattern}` : lemmaNiqqud,
    utility: clampNumber(entry?.personal_priority, 1, 100, 60),
    availability: normalizeAvailability(entry?.availability || AVAILABILITY_DEFAULTS),
    source: String(entry?.source || "hebrew-verb"),
    usagePattern,
  };
}

function resolveLearnerFacingForms(entry, sense, options) {
  const authoritative = normalizeAndValidateFormSet(entry?.forms, {
    generated: false,
    formalFuturePlural: Boolean(options?.formalFuturePlural),
    lemma: entry?.lemma,
  });
  if (authoritative) {
    return {
      source: "authoritative",
      forms: authoritative,
    };
  }

  const authoritativeSlots = normalizeFormSetSlots(entry?.forms, {
    generated: false,
    formalFuturePlural: Boolean(options?.formalFuturePlural),
    lemma: entry?.lemma,
  });

  if (!canGenerateForms(entry, sense)) {
    return null;
  }

  const generatedDraft = buildGeneratedForms(entry);
  const generated = normalizeAndValidateFormSet(generatedDraft, {
    generated: true,
    formalFuturePlural: Boolean(options?.formalFuturePlural),
    lemma: entry?.lemma,
  });
  if (!generated) {
    return null;
  }

  if (authoritativeSlots) {
    return {
      source: "generated",
      forms: mergeNormalizedFormSets(generated, authoritativeSlots),
    };
  }

  return {
    source: "generated",
    forms: generated,
  };
}

function canGenerateForms(entry, sense) {
  if (!entry || !sense) return false;
  if (entry.review_status === "rejected") return false;
  if (entry.regularity !== "regular") return false;
  if (entry.conjugation_mode !== "generated") return false;
  if (entry.regularity === "ambiguous" || entry.regularity === "phrase") return false;
  if (containsWhitespace(entry.lemma)) return false;
  if (!sense.safe_for_generation) return false;
  return true;
}

function buildGeneratedForms(entry) {
  const prebuilt = normalizeAndValidateFormSet(entry?.generated_forms, {
    generated: true,
    formalFuturePlural: false,
    lemma: entry?.lemma,
  });
  if (prebuilt) {
    return prebuilt;
  }

  const root = normalizeRoot(entry?.root);
  if (!root) return null;

  if (entry?.generation_pattern === "paal_o") {
    return generatePaalOForms(root);
  }

  if (entry?.binyan === "piel" && isStrongRoot(root)) {
    return generatePielForms(root);
  }

  if (entry?.binyan === "hifil" && isStrongRoot(root)) {
    return generateHifilForms(root);
  }

  return null;
}

function generatePaalOForms(root) {
  const [r1, r2, r3] = root;
  return makeForms(
    makePresent(`${r1}ו${r2}${r3}`, `${r1}ו${r2}${r3}ת`, `${r1}ו${r2}${r3}ים`, `${r1}ו${r2}${r3}ות`),
    makePast(`${r1}${r2}${r3}תי`, `${r1}${r2}${r3}ת`, `${r1}${r2}${r3}ת`, `${r1}${r2}${r3}`, `${r1}${r2}${r3}ה`, `${r1}${r2}${r3}נו`, `${r1}${r2}${r3}תם`, `${r1}${r2}${r3}תן`, `${r1}${r2}${r3}ו`),
    makeFuture(`א${r1}${r2}ו${r3}`, `ת${r1}${r2}ו${r3}`, `ת${r1}${r2}${r3}י`, `י${r1}${r2}ו${r3}`, `ת${r1}${r2}ו${r3}`, `נ${r1}${r2}ו${r3}`, `ת${r1}${r2}${r3}ו`, `י${r1}${r2}${r3}ו`)
  );
}

function generatePielForms(root) {
  const [r1, r2, r3] = root;
  const presentStem = `מ${r1}${r2}${r3}`;
  const pastStem = `${r1}י${r2}${r3}`;
  const futureStem = `${r1}${r2}${r3}`;

  return makeForms(
    makePresent(presentStem, `${presentStem}ת`, `${presentStem}ים`, `${presentStem}ות`),
    makePast(`${pastStem}תי`, `${pastStem}ת`, `${pastStem}ת`, pastStem, `${pastStem}ה`, `${pastStem}נו`, `${pastStem}תם`, `${pastStem}תן`, `${pastStem}ו`),
    makeFuture(`א${futureStem}`, `ת${futureStem}`, `ת${futureStem}י`, `י${futureStem}`, `ת${futureStem}`, `נ${futureStem}`, `ת${futureStem}ו`, `י${futureStem}ו`)
  );
}

function generateHifilForms(root) {
  const [r1, r2, r3] = root;
  const presentStem = `מ${r1}${r2}י${r3}`;
  const pastMasculineStem = `ה${r1}${r2}י${r3}`;
  const pastSuffixStem = `ה${r1}${r2}${r3}`;
  const futureStem = `${r1}${r2}י${r3}`;

  return makeForms(
    makePresent(presentStem, `${presentStem}ה`, `${presentStem}ים`, `${presentStem}ות`),
    makePast(`${pastSuffixStem}תי`, `${pastSuffixStem}ת`, `${pastSuffixStem}ת`, pastMasculineStem, `${pastMasculineStem}ה`, `${pastSuffixStem}נו`, `${pastSuffixStem}תם`, `${pastSuffixStem}תן`, `${pastMasculineStem}ו`),
    makeFuture(`א${futureStem}`, `ת${futureStem}`, `ת${futureStem}י`, `י${futureStem}`, `ת${futureStem}`, `נ${futureStem}`, `ת${futureStem}ו`, `י${futureStem}ו`)
  );
}

function flattenVerbForms(forms, gloss, options) {
  const slots = getFormSlots(Boolean(options?.formalFuturePlural));
  const flattened = [];

  slots.forEach((slotMeta) => {
    const value = normalizeFormValue(forms?.[slotMeta.tense]?.[slotMeta.slot]);
    if (!value) return;

    flattened.push({
      id: slotMeta.id,
      englishText: buildEnglishFormLabel(gloss, slotMeta.id),
      valuePlain: value.plain,
      valueNiqqud: value.niqqud,
    });
  });

  return flattened;
}

function normalizeAndValidateFormSet(formSet, options) {
  const output = normalizeFormSetSlots(formSet, options);
  if (!output) return null;
  const flattened = flattenVerbForms(output, "to do", { formalFuturePlural: Boolean(options?.formalFuturePlural) });
  if (flattened.length < 4) return null;

  return output;
}

function normalizeFormSetSlots(formSet, options) {
  if (!formSet || typeof formSet !== "object") return null;

  const output = {};
  const slots = getFormSlots(Boolean(options?.formalFuturePlural));
  let hasInvalidProvidedSlot = false;

  slots.forEach((slotMeta) => {
    const rawValue = formSet?.[slotMeta.tense]?.[slotMeta.slot];
    if (!rawValue) return;

    const normalized = normalizeFormValue(rawValue);
    if (!normalized || !isValidHebrewForm(normalized.plain)) {
      hasInvalidProvidedSlot = true;
      return;
    }
    if (options?.generated && failsGeneratedSanity(normalized.plain, slotMeta.id, options?.lemma)) {
      hasInvalidProvidedSlot = true;
      return;
    }

    if (!output[slotMeta.tense]) {
      output[slotMeta.tense] = {};
    }
    output[slotMeta.tense][slotMeta.slot] = normalized;
  });

  if (hasInvalidProvidedSlot || !Object.keys(output).length) {
    return null;
  }

  return output;
}

function mergeNormalizedFormSets(base, overrides) {
  if (!base) return overrides ? cloneData(overrides) : null;
  if (!overrides) return cloneData(base);

  const merged = cloneData(base);
  Object.keys(overrides).forEach((tense) => {
    if (!merged[tense]) {
      merged[tense] = {};
    }
    Object.keys(overrides[tense] || {}).forEach((slot) => {
      merged[tense][slot] = cloneData(overrides[tense][slot]);
    });
  });
  return merged;
}

function normalizeFormValue(raw) {
  if (!raw) return null;

  if (typeof raw === "string") {
    const niqqud = normalizeHebrewSofitForms(normalizeWhitespace(raw));
    if (!niqqud) return null;
    const plain = normalizeHebrewSofitForms(stripNiqqud(niqqud));
    if (!plain) return null;
    return {
      plain,
      niqqud,
    };
  }

  if (typeof raw === "object") {
    const rawPlain = normalizeWhitespace(raw.plain || raw.valuePlain || raw.he || "");
    const rawNiqqud = normalizeWhitespace(raw.niqqud || raw.valueNiqqud || "");
    const niqqud = normalizeHebrewSofitForms(rawNiqqud || rawPlain);
    if (!niqqud) return null;
    const plain = normalizeHebrewSofitForms(stripNiqqud(rawPlain || niqqud));
    if (!plain) return null;
    return {
      plain,
      niqqud: niqqud || plain,
    };
  }

  return null;
}

function isValidHebrewForm(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) return false;
  if (!/[\u0590-\u05ff]/.test(normalized)) return false;
  if (!/^[\u0590-\u05ff'"׳״\-\s]+$/.test(normalized)) return false;
  return true;
}

function failsGeneratedSanity(value, slotId, lemma) {
  const plain = stripNiqqud(value);
  const normalizedLemma = stripNiqqud(lemma || "");

  if (!plain || !normalizedLemma) return false;
  if (/(?:הת|הים|הות)$/.test(plain)) return true;
  if (slotId.startsWith("present_") && plain === normalizedLemma) return true;

  return false;
}

function hasAuthoritativeForms(entry) {
  return Boolean(
    normalizeAndValidateFormSet(entry?.forms, {
      generated: false,
      formalFuturePlural: false,
      lemma: entry?.lemma,
    })
  );
}

function isConjugationCandidate(entry) {
  if (!entry) return false;
  if (entry.review_status === "rejected") return false;
  if (entry.conjugation_mode === "blocked") return false;
  if (entry.conjugation_mode === "phrase_only") return false;
  if (entry.conjugation_mode === "curated") {
    return hasAuthoritativeForms(entry);
  }
  if (entry.regularity === "phrase") return false;
  return true;
}

function migrateVocabulary(words) {
  const groups = buildVocabularyVerbGroups(Array.isArray(words) ? words : []);
  const entries = [];
  const report = {
    generated_safe_verbs: [],
    curated_verbs_needing_forms: [],
    ambiguous_verbs_needing_sense_splitting: [],
    phrase_only_items: [],
    blocked_items: [],
  };

  groups.forEach((group) => {
    const migrated = migrateVerbGroup(group);
    if (!migrated) return;

    if (migrated.entry) {
      entries.push(migrated.entry);
    }

    if (migrated.reportBucket && report[migrated.reportBucket]) {
      report[migrated.reportBucket].push(buildReportRecord(group, migrated));
    }
  });

  return {
    entries,
    report,
  };
}

function buildVocabularyVerbGroups(words) {
  const grouped = new Map();

  words.forEach((word) => {
    if (String(word?.source || "") === "verb-seed") return;
    if (!looksLikeVerbVocabularyWord(word)) return;

    const lemma = normalizeWhitespace(String(word?.he || ""));
    if (!lemma) return;

    if (!grouped.has(lemma)) {
      grouped.set(lemma, {
        lemma,
        glosses: new Map(),
        wordIds: [],
        category: String(word?.category || "core_advanced"),
        utility: Number(word?.utility || 60),
        availability: normalizeAvailability(word?.availability || AVAILABILITY_DEFAULTS),
      });
    }

    const group = grouped.get(lemma);
    const gloss = normalizeWhitespace(String(word?.en || ""));
    if (gloss) {
      group.glosses.set(gloss.toLowerCase(), gloss);
    }
    group.wordIds.push(String(word?.id || slugifyHebrewId(`${lemma}-${group.wordIds.length + 1}`)));
    group.utility = Math.max(group.utility, Number(word?.utility || 60));
    group.availability = mergeAvailability(group.availability, word?.availability || AVAILABILITY_DEFAULTS);
    if (!group.category && word?.category) {
      group.category = String(word.category);
    }
  });

  return [...grouped.values()].map((group) => ({
    lemma: group.lemma,
    glosses: [...group.glosses.values()],
    source_word_ids: group.wordIds.slice(),
    category: group.category || "core_advanced",
    personal_priority: clampNumber(group.utility, 1, 100, 60),
    availability: normalizeAvailability(group.availability || AVAILABILITY_DEFAULTS),
  }));
}

function migrateVerbGroup(group) {
  const primaryGloss = String(group?.glosses?.[0] || "to do");
  const notesPrefix = `Migrated from vocab item${group?.source_word_ids?.length === 1 ? "" : "s"}: ${group?.source_word_ids?.join(", ") || "none"}.`;

  if (containsWhitespace(group?.lemma)) {
    return {
      entry: createVerbEntry({
        id: `${slugifyHebrewId(group.lemma)}-phrase-only`,
        lemma: group.lemma,
        root: null,
        binyan: null,
        regularity: "phrase",
        conjugation_mode: "phrase_only",
        senses: [makeSense(primaryGloss, null, false)],
        forms: {},
        generated_forms: {},
        review_status: "unreviewed",
        notes: `${notesPrefix} Multi-word Hebrew item kept in vocabulary mode only.`,
        examples: [],
        difficulty_level: 2,
        tags: ["migrated", "phrase_only"],
        personal_priority: group.personal_priority,
        source_word_ids: group.source_word_ids,
        availability: group.availability,
        category: group.category,
        source: "vocab-migration",
      }),
      reportBucket: "phrase_only_items",
      reason: "Multi-word Hebrew lemma defaults to phrase_only.",
    };
  }

  if (KNOWN_AMBIGUOUS_LEMMAS.has(group.lemma) || group.glosses.length > 1) {
    return {
      entry: createVerbEntry({
        id: `${slugifyHebrewId(group.lemma)}-ambiguous`,
        lemma: group.lemma,
        root: null,
        binyan: null,
        regularity: "ambiguous",
        conjugation_mode: "phrase_only",
        senses: group.glosses.map((gloss) => makeSense(gloss, null, false)),
        forms: {},
        generated_forms: {},
        review_status: "unreviewed",
        notes: `${notesPrefix} Ambiguous lemma requires sense splitting before conjugation mode.`,
        examples: [],
        difficulty_level: 3,
        tags: ["migrated", "ambiguous"],
        personal_priority: group.personal_priority,
        source_word_ids: group.source_word_ids,
        availability: group.availability,
        category: group.category,
        source: "vocab-migration",
      }),
      reportBucket: "ambiguous_verbs_needing_sense_splitting",
      reason: "Lemma is known ambiguous or has multiple unsplit English glosses.",
    };
  }

  const generatedOverride = SAFE_GENERATION_OVERRIDES.get(group.lemma);
  if (generatedOverride) {
    const entry = createVerbEntry({
      id: `${slugifyHebrewId(group.lemma)}-generated`,
      lemma: group.lemma,
      root: generatedOverride.root,
      binyan: generatedOverride.binyan,
      regularity: "regular",
      conjugation_mode: "generated",
      senses: [makeSense(primaryGloss, null, true)],
      forms: generatedOverride.imperative ? makeForms(null, null, null, generatedOverride.imperative) : {},
      generated_forms: {},
      review_status: "unreviewed",
      notes: `${notesPrefix} Explicitly whitelisted as safe for limited generation.`,
      examples: [],
      difficulty_level: 2,
      tags: ["migrated", "generated_safe"],
      personal_priority: generatedOverride.personal_priority || group.personal_priority,
      source_word_ids: group.source_word_ids,
      availability: group.availability,
      category: group.category,
      source: "vocab-migration",
    });

    const generatedForms = buildGeneratedForms(entry);
    entry.generated_forms = generatedForms ? cloneData(generatedForms) : {};

    return {
      entry,
      reportBucket: "generated_safe_verbs",
      reason: "Explicit safe-for-generation override with a supported pattern.",
    };
  }

  const curatedHint = KNOWN_CURATED_LEMMAS.get(group.lemma);
  if (curatedHint) {
    return {
      entry: createVerbEntry({
        id: `${slugifyHebrewId(group.lemma)}-curated`,
        lemma: group.lemma,
        root: curatedHint.root,
        binyan: curatedHint.binyan,
        regularity: "irregular",
        conjugation_mode: "curated",
        senses: [makeSense(primaryGloss, null, false)],
        forms: {},
        generated_forms: {},
        review_status: "unreviewed",
        notes: `${notesPrefix} Difficult verb needs curated authoritative forms before learner-facing conjugation.`,
        examples: [],
        difficulty_level: curatedHint.difficulty_level || 4,
        tags: ["migrated", "curated_needed"],
        personal_priority: group.personal_priority,
        source_word_ids: group.source_word_ids,
        availability: group.availability,
        category: group.category,
        source: "vocab-migration",
      }),
      reportBucket: "curated_verbs_needing_forms",
      reason: "Known difficult verb without authoritative stored forms.",
    };
  }

  return {
    entry: createVerbEntry({
      id: `${slugifyHebrewId(group.lemma)}-blocked`,
      lemma: group.lemma,
      root: null,
      binyan: null,
      regularity: "regular",
      conjugation_mode: "blocked",
      senses: [makeSense(primaryGloss, null, false)],
      forms: {},
      generated_forms: {},
      review_status: "unreviewed",
      notes: `${notesPrefix} No authoritative forms and no approved generation path.`,
      examples: [],
      difficulty_level: 3,
      tags: ["migrated", "blocked"],
      personal_priority: group.personal_priority,
      source_word_ids: group.source_word_ids,
      availability: group.availability,
      category: group.category,
      source: "vocab-migration",
    }),
    reportBucket: "blocked_items",
    reason: "Unsupported for learner-facing conjugation until curated.",
  };
}

function buildReportRecord(group, migrated) {
  return {
    lemma: group.lemma,
    glosses: group.glosses.slice(),
    source_word_ids: group.source_word_ids.slice(),
    reason: migrated.reason,
    conjugation_mode: migrated.entry?.conjugation_mode || null,
    regularity: migrated.entry?.regularity || null,
  };
}

function looksLikeVerbVocabularyWord(word) {
  const english = normalizeWhitespace(String(word?.en || ""));
  const hebrew = normalizeWhitespace(String(word?.he || ""));
  if (!english || !hebrew) return false;
  if (BLOCKED_GLOSSES.has(english.toLowerCase())) return false;
  if (!/^to\s+/i.test(english)) return false;
  return /^ל[\u0590-\u05ff]/.test(hebrew);
}

function mergeVerbEntries(primaryEntries, secondaryEntries) {
  const merged = new Map();

  [...(Array.isArray(primaryEntries) ? primaryEntries : []), ...(Array.isArray(secondaryEntries) ? secondaryEntries : [])].forEach((entry) => {
    if (!entry || !entry.id) return;
    if (!merged.has(entry.id)) {
      merged.set(entry.id, cloneData(entry));
    }
  });

  return [...merged.values()];
}

function buildEnglishFormLabel(gloss, slotId) {
  const base = toVerbBasePhrase(gloss);
  const presentThird = inflectEnglishThirdPerson(base);
  const presentNonThird = inflectEnglishPresentNonThird(base);
  const past = inflectEnglishPast(base);
  const pastPl = base === "be" ? "were" : past;
  const pastTag = past === base ? " (past)" : "";

  switch (slotId) {
    case "present_masculine_singular":
      return `he ${presentThird}`;
    case "present_feminine_singular":
      return `she ${presentThird}`;
    case "present_masculine_plural":
      return `they (m.pl.) ${presentNonThird}`;
    case "present_feminine_plural":
      return `they (f.pl.) ${presentNonThird}`;
    case "past_first_person_singular":
      return `I ${past}${pastTag}`;
    case "past_second_person_masculine_singular":
      return `you (m.s.) ${pastPl}${pastTag}`;
    case "past_second_person_feminine_singular":
      return `you (f.s.) ${pastPl}${pastTag}`;
    case "past_third_person_masculine_singular":
      return `he ${past}${pastTag}`;
    case "past_third_person_feminine_singular":
      return `she ${past}${pastTag}`;
    case "past_first_person_plural":
      return `we ${pastPl}${pastTag}`;
    case "past_second_person_masculine_plural":
      return `you (m.pl.) ${pastPl}${pastTag}`;
    case "past_second_person_feminine_plural":
      return `you (f.pl.) ${pastPl}${pastTag}`;
    case "past_third_person_plural":
      return `they ${pastPl}${pastTag}`;
    case "future_first_person_singular":
      return `I will ${base}`;
    case "future_second_person_masculine_singular":
      return `you (m.s.) will ${base}`;
    case "future_second_person_feminine_singular":
      return `you (f.s.) will ${base}`;
    case "future_third_person_masculine_singular":
      return `he will ${base}`;
    case "future_third_person_feminine_singular":
      return `she will ${base}`;
    case "future_first_person_plural":
      return `we will ${base}`;
    case "future_second_person_plural":
      return `you (pl.) will ${base}`;
    case "future_third_person_plural":
      return `they will ${base}`;
    case "future_second_person_feminine_plural":
      return `you (f.pl.) will ${base}`;
    case "future_third_person_feminine_plural":
      return `they (f.pl.) will ${base}`;
    case "imperative_second_person_masculine_singular":
      return `${base}! (m.s.)`;
    case "imperative_second_person_feminine_singular":
      return `${base}! (f.s.)`;
    case "imperative_second_person_plural":
      return `${base}! (pl.)`;
    default:
      return base;
  }
}

function toVerbBasePhrase(englishInfinitive) {
  const raw = String(englishInfinitive || "").trim().toLowerCase();
  if (!raw) return "do";
  return raw.replace(/^to\s+/, "").trim() || "do";
}

const ENGLISH_PRESENT_THIRD_PERSON_IRREGULARS = new Map([
  ["be", "is"],
  ["do", "does"],
  ["have", "has"],
]);

const ENGLISH_PRESENT_NON_THIRD_IRREGULARS = new Map([
  ["be", "are"],
]);

const ENGLISH_PAST_IRREGULARS = new Map([
  ["be", "was"],
  ["become", "became"],
  ["begin", "began"],
  ["break", "broke"],
  ["bring", "brought"],
  ["build", "built"],
  ["buy", "bought"],
  ["catch", "caught"],
  ["choose", "chose"],
  ["come", "came"],
  ["cost", "cost"],
  ["cut", "cut"],
  ["do", "did"],
  ["drink", "drank"],
  ["drive", "drove"],
  ["eat", "ate"],
  ["fall", "fell"],
  ["feel", "felt"],
  ["find", "found"],
  ["fly", "flew"],
  ["forget", "forgot"],
  ["get", "got"],
  ["give", "gave"],
  ["go", "went"],
  ["grow", "grew"],
  ["have", "had"],
  ["hear", "heard"],
  ["keep", "kept"],
  ["know", "knew"],
  ["leave", "left"],
  ["make", "made"],
  ["meet", "met"],
  ["pay", "paid"],
  ["plan", "planned"],
  ["put", "put"],
  ["read", "read"],
  ["rise", "rose"],
  ["run", "ran"],
  ["say", "said"],
  ["see", "saw"],
  ["sell", "sold"],
  ["send", "sent"],
  ["sing", "sang"],
  ["sit", "sat"],
  ["sleep", "slept"],
  ["speak", "spoke"],
  ["spend", "spent"],
  ["stand", "stood"],
  ["take", "took"],
  ["teach", "taught"],
  ["tell", "told"],
  ["think", "thought"],
  ["understand", "understood"],
  ["wake", "woke"],
  ["wear", "wore"],
  ["win", "won"],
  ["write", "wrote"],
]);

function splitVerbPhrase(phrase) {
  const parts = String(phrase || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { head: "do", tail: "" };
  }
  return {
    head: parts[0],
    tail: parts.slice(1).join(" "),
  };
}

function joinVerbPhrase(head, tail) {
  return tail ? `${head} ${tail}` : head;
}

function inflectEnglishPresentNonThird(basePhrase) {
  const parts = splitVerbPhrase(basePhrase);
  const verb = ENGLISH_PRESENT_NON_THIRD_IRREGULARS.get(parts.head) || parts.head;
  return joinVerbPhrase(verb, parts.tail);
}

function inflectEnglishThirdPerson(basePhrase) {
  const parts = splitVerbPhrase(basePhrase);
  let verb = ENGLISH_PRESENT_THIRD_PERSON_IRREGULARS.get(parts.head);
  if (!verb && /(s|x|z|sh|ch|o)$/.test(parts.head)) {
    verb = `${parts.head}es`;
  } else if (!verb && /[^aeiou]y$/.test(parts.head)) {
    verb = `${parts.head.slice(0, -1)}ies`;
  } else if (!verb) {
    verb = `${parts.head}s`;
  }
  return joinVerbPhrase(verb, parts.tail);
}

function inflectEnglishPast(basePhrase) {
  const parts = splitVerbPhrase(basePhrase);
  let verb = ENGLISH_PAST_IRREGULARS.get(parts.head);
  if (!verb) {
    if (/e$/.test(parts.head)) {
      verb = `${parts.head}d`;
    } else if (/[^aeiou]y$/.test(parts.head)) {
      verb = `${parts.head.slice(0, -1)}ied`;
    } else {
      verb = `${parts.head}ed`;
    }
  }
  return joinVerbPhrase(verb, parts.tail);
}

function getFormSlots(includeFormalFuturePlural) {
  const baseSlots = MODERN_MATCH_FORM_ORDER.concat(IMPERATIVE_FORM_ORDER);
  return includeFormalFuturePlural
    ? baseSlots.concat(FORMAL_FUTURE_FORM_ORDER)
    : baseSlots;
}

function normalizeRoot(root) {
  if (!Array.isArray(root) || root.length !== 3) return null;
  const normalized = root
    .map((letter) => toMedialHebrewLetter(normalizeWhitespace(String(letter || ""))))
    .filter(Boolean);
  if (normalized.length !== 3) return null;
  if (!normalized.every((letter) => /^[א-ת]$/.test(letter))) return null;
  return normalized;
}

function isStrongRoot(root) {
  const normalized = normalizeRoot(root);
  if (!normalized) return false;
  return normalized.every((letter) => !STRONG_ROOT_WEAK_LETTERS.has(letter));
}

function deriveSharedUsagePattern(senses) {
  const patterns = senses
    .map((sense) => sense?.usage_pattern || null)
    .filter(Boolean);
  if (!patterns.length) return null;
  return patterns.every((pattern) => pattern === patterns[0]) ? patterns[0] : null;
}

function containsWhitespace(text) {
  return /\s/.test(String(text || ""));
}

function normalizeWhitespace(text) {
  return String(text || "").trim().replace(/\s+/g, " ");
}

function toMedialHebrewLetter(letter) {
  return HEBREW_FINAL_TO_MEDIAL[letter] || letter;
}

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

function normalizeHebrewSofitForms(text) {
  const chars = String(text || "").normalize("NFC").split("");
  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];
    if (!isHebrewLetter(char)) continue;

    const medial = toMedialHebrewLetter(char);
    const atTokenEnd = !hasHebrewLetterAhead(chars, i);
    chars[i] = atTokenEnd && HEBREW_MEDIAL_TO_FINAL[medial] ? HEBREW_MEDIAL_TO_FINAL[medial] : medial;
  }
  return chars.join("");
}

function stripNiqqud(text) {
  return String(text || "").normalize("NFC").replace(/[\u0591-\u05c7]/g, "");
}

function slugifyHebrewId(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0590-\u05ffa-zA-Z0-9_-]/g, "")
    .slice(0, 80)
    .toLowerCase() || "verb";
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

return {
  MATCH_FORM_ORDER: MODERN_MATCH_FORM_ORDER.concat(IMPERATIVE_FORM_ORDER).map((slot) => slot.id),
  FORMAL_FUTURE_FORM_ORDER: FORMAL_FUTURE_FORM_ORDER.map((slot) => slot.id),
  IMPERATIVE_FORM_ORDER: IMPERATIVE_FORM_ORDER.map((slot) => slot.id),
  getSeedVerbEntries,
  getSeedVocabularyEntries,
  buildVerbConjugationDeck,
  migrateVocabulary,
  buildGeneratedForms,
  resolveLearnerFacingForms,
  normalizeAndValidateFormSet,
  __build: "20260712a",
};
});

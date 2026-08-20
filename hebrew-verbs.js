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
  // Added to give Conjugation+ person-marked past and future forms for its
  // idioms, not as new vocabulary. They conjugate; Translation Match already
  // has cards for these meanings.
  "advanced-verb-lishbor",
  "advanced-verb-lignov",
  "advanced-verb-lishtof",
  "advanced-verb-limrot",
  "advanced-verb-lidroch",
  "advanced-verb-litzbot",
  "advanced-verb-lizrok",
  "advanced-verb-lidfok",
  "advanced-verb-lachsoch",
  "advanced-verb-lahafoch",
  "advanced-verb-lisrof",
  "advanced-verb-laharog",
  "advanced-verb-lischov",
  "advanced-verb-lidchof",
  "advanced-verb-likroa",
  "advanced-verb-liktoa",
  "advanced-verb-limroach",
  "advanced-verb-lizrot",
  "advanced-verb-lesovev",
  "advanced-verb-lechamem",
  "advanced-verb-lechasel",
  "advanced-verb-lemarer",
  "advanced-verb-leshabesh",
  "advanced-verb-lechazek",
  "advanced-verb-lefotzetz",
  "advanced-verb-lefarek",
  "advanced-verb-leharim",
  "advanced-verb-lehaavir",
  "advanced-verb-lehaalot",
  "advanced-verb-lehapil",
  "advanced-verb-lehaif",
  "advanced-verb-lehair",
  "advanced-verb-lehatot",
  "advanced-verb-lehashir",
  "advanced-verb-lehaarich",
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
  "technology-verb-lehatkin",
  "technology-verb-lehasir",
  "technology-verb-limchok",
  "technology-verb-leshatef",
  "technology-verb-lesankhren",
  "technology-verb-legabot",
  "technology-verb-leshachzer",
  "technology-verb-lehitchaber",
  "technology-verb-lehitnatek",
  "technology-verb-leafes",

  // Hidden for a different reason than the group above: these two collided on
  // the Translation Match board rather than duplicating an existing meaning.
  // A card's Hebrew is the lemma unless the sense carries a usage_pattern, so
  // lehorid's two senses ("to take down" / "to download") rendered two
  // identical tiles against different glosses — the learner cannot tell them
  // apart and a wrong pick penalises both ids. Every other multi-sense verb was
  // already hidden, lehaalot ("to raise" / "to upload") included; lehorid was
  // the one that slipped. lehealem collided with the vocabulary card for the
  // slang sense "to ghost", which is kept because nothing else teaches it.
  // Both verbs stay in the conjugation deck, so neither meaning is lost.
  "advanced-verb-lehorid",
  "advanced-verb-lehealem",

  // Same collision, opposite direction from what the conjugation-first list
  // would do. Their vocabulary twins are rephrasings rather than separate
  // senses — "to have time (to)" against "to manage in time", and "to check
  // into" against "to find out" — so either card could have kept the slot, but
  // both twins sit inside the pinned 144-card append-only expansion that
  // tests/vocab-data.test.js requires to stay playable. Hiding the conjugation
  // card is therefore the only option that does not break that guarantee, and
  // costs nothing: both verbs remain in the conjugation deck.
  "advanced-verb-lehaspik",
  "advanced-verb-levarer",

]);

const CONJUGATION_HIDDEN_VERB_IDS = new Set([
  "advanced-verb-lehitkayem",
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
      senses: [makeSense("to start", null, false)],
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
      senses: [makeSense("to stay", null, false)],
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
    createVerbEntry({
      id: "advanced-verb-lelamed",
      availability: getStarterVerbAvailability("advanced-verb-lelamed"),
      lemma: "ללמד",
      lemma_niqqud: "לְלַמֵּד",
      root: ["ל", "מ", "ד"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to teach", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מלמד", "מְלַמֵּד"),
          markedForm("מלמדת", "מְלַמֶּדֶת"),
          markedForm("מלמדים", "מְלַמְּדִים"),
          markedForm("מלמדות", "מְלַמְּדוֹת")
        ),
        makePast(
          markedForm("לימדתי", "לִמַּדְתִּי"),
          markedForm("לימדת", "לִמַּדְתָּ"),
          markedForm("לימדת", "לִמַּדְתְּ"),
          markedForm("לימד", "לִמֵּד"),
          markedForm("לימדה", "לִמְּדָה"),
          markedForm("לימדנו", "לִמַּדְנוּ"),
          markedForm("לימדתם", "לִמַּדְתֶּם"),
          markedForm("לימדתן", "לִמַּדְתֶּן"),
          markedForm("לימדו", "לִמְּדוּ")
        ),
        makeFuture(
          markedForm("אלמד", "אֲלַמֵּד"),
          markedForm("תלמד", "תְּלַמֵּד"),
          markedForm("תלמדי", "תְּלַמְּדִי"),
          markedForm("ילמד", "יְלַמֵּד"),
          markedForm("תלמד", "תְּלַמֵּד"),
          markedForm("נלמד", "נְלַמֵּד"),
          markedForm("תלמדו", "תְּלַמְּדוּ"),
          markedForm("ילמדו", "יְלַמְּדוּ")
        ),
        makeImperative(
          markedForm("למד", "לַמֵּד"),
          markedForm("למדי", "לַמְּדִי"),
          markedForm("למדו", "לַמְּדוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of ל-מ-ד (contrast the seed pa'al ללמוד 'to study'): teach. Takes double object — מלמד אותם עברית.",
      difficulty_level: 2,
      tags: ["piel", "regular", "everyday", "high-frequency"],
      personal_priority: 80,
    }),
    createVerbEntry({
      id: "advanced-verb-lenasot",
      availability: getStarterVerbAvailability("advanced-verb-lenasot"),
      lemma: "לנסות",
      lemma_niqqud: "לְנַסּוֹת",
      root: ["נ", "ס", "ה"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to try", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מנסה", "מְנַסֶּה"),
          markedForm("מנסה", "מְנַסָּה"),
          markedForm("מנסים", "מְנַסִּים"),
          markedForm("מנסות", "מְנַסּוֹת")
        ),
        makePast(
          markedForm("ניסיתי", "נִסִּיתִי"),
          markedForm("ניסית", "נִסִּיתָ"),
          markedForm("ניסית", "נִסִּית"),
          markedForm("ניסה", "נִסָּה"),
          markedForm("ניסתה", "נִסְּתָה"),
          markedForm("ניסינו", "נִסִּינוּ"),
          markedForm("ניסיתם", "נִסִּיתֶם"),
          markedForm("ניסיתן", "נִסִּיתֶן"),
          markedForm("ניסו", "נִסּוּ")
        ),
        makeFuture(
          markedForm("אנסה", "אֲנַסֶּה"),
          markedForm("תנסה", "תְּנַסֶּה"),
          markedForm("תנסי", "תְּנַסִּי"),
          markedForm("ינסה", "יְנַסֶּה"),
          markedForm("תנסה", "תְּנַסֶּה"),
          markedForm("ננסה", "נְנַסֶּה"),
          markedForm("תנסו", "תְּנַסּוּ"),
          markedForm("ינסו", "יְנַסּוּ")
        ),
        makeImperative(
          markedForm("נסה", "נַסֵּה"),
          markedForm("נסי", "נַסִּי"),
          markedForm("נסו", "נַסּוּ")
        )
      ),
      review_status: "approved",
      notes: "ל\"ה pi'el (נ-ס-ה): try, attempt. Takes infinitive — מנסה להבין. Same ל\"ה pattern as the seed לחכות/לכבות.",
      difficulty_level: 3,
      tags: ["piel", "irregular", "lamed-hey", "high-frequency"],
      personal_priority: 84,
    }),
    createVerbEntry({
      id: "advanced-verb-lenakot",
      availability: getStarterVerbAvailability("advanced-verb-lenakot"),
      lemma: "לנקות",
      lemma_niqqud: "לְנַקּוֹת",
      root: ["נ", "ק", "ה"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to clean", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מנקה", "מְנַקֶּה"),
          markedForm("מנקה", "מְנַקָּה"),
          markedForm("מנקים", "מְנַקִּים"),
          markedForm("מנקות", "מְנַקּוֹת")
        ),
        makePast(
          markedForm("ניקיתי", "נִקִּיתִי"),
          markedForm("ניקית", "נִקִּיתָ"),
          markedForm("ניקית", "נִקִּית"),
          markedForm("ניקה", "נִקָּה"),
          markedForm("ניקתה", "נִקְּתָה"),
          markedForm("ניקינו", "נִקִּינוּ"),
          markedForm("ניקיתם", "נִקִּיתֶם"),
          markedForm("ניקיתן", "נִקִּיתֶן"),
          markedForm("ניקו", "נִקּוּ")
        ),
        makeFuture(
          markedForm("אנקה", "אֲנַקֶּה"),
          markedForm("תנקה", "תְּנַקֶּה"),
          markedForm("תנקי", "תְּנַקִּי"),
          markedForm("ינקה", "יְנַקֶּה"),
          markedForm("תנקה", "תְּנַקֶּה"),
          markedForm("ננקה", "נְנַקֶּה"),
          markedForm("תנקו", "תְּנַקּוּ"),
          markedForm("ינקו", "יְנַקּוּ")
        ),
        makeImperative(
          markedForm("נקה", "נַקֵּה"),
          markedForm("נקי", "נַקִּי"),
          markedForm("נקו", "נַקּוּ")
        )
      ),
      review_status: "approved",
      notes: "ל\"ה pi'el (נ-ק-ה): clean. Same shape as לנסות. From the root behind נקי (clean) and ניקיון (cleanliness).",
      difficulty_level: 3,
      tags: ["piel", "irregular", "lamed-hey", "everyday"],
      personal_priority: 79,
    }),
    createVerbEntry({
      id: "advanced-verb-leshanot",
      availability: getStarterVerbAvailability("advanced-verb-leshanot"),
      lemma: "לשנות",
      lemma_niqqud: "לְשַׁנּוֹת",
      root: ["ש", "נ", "ה"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to change", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("משנה", "מְשַׁנֶּה"),
          markedForm("משנה", "מְשַׁנָּה"),
          markedForm("משנים", "מְשַׁנִּים"),
          markedForm("משנות", "מְשַׁנּוֹת")
        ),
        makePast(
          markedForm("שיניתי", "שִׁנִּיתִי"),
          markedForm("שינית", "שִׁנִּיתָ"),
          markedForm("שינית", "שִׁנִּית"),
          markedForm("שינה", "שִׁנָּה"),
          markedForm("שינתה", "שִׁנְּתָה"),
          markedForm("שינינו", "שִׁנִּינוּ"),
          markedForm("שיניתם", "שִׁנִּיתֶם"),
          markedForm("שיניתן", "שִׁנִּיתֶן"),
          markedForm("שינו", "שִׁנּוּ")
        ),
        makeFuture(
          markedForm("אשנה", "אֲשַׁנֶּה"),
          markedForm("תשנה", "תְּשַׁנֶּה"),
          markedForm("תשני", "תְּשַׁנִּי"),
          markedForm("ישנה", "יְשַׁנֶּה"),
          markedForm("תשנה", "תְּשַׁנֶּה"),
          markedForm("נשנה", "נְשַׁנֶּה"),
          markedForm("תשנו", "תְּשַׁנּוּ"),
          markedForm("ישנו", "יְשַׁנּוּ")
        ),
        makeImperative(
          markedForm("שנה", "שַׁנֵּה"),
          markedForm("שני", "שַׁנִּי"),
          markedForm("שנו", "שַׁנּוּ")
        )
      ),
      review_status: "approved",
      notes: "ל\"ה pi'el (ש-נ-ה): change, alter. Note the plain future/imperative ישנו/שנו overlaps in spelling with לישון forms — the niqqud (יְשַׁנּוּ vs יִישְׁנוּ) and context disambiguate.",
      difficulty_level: 3,
      tags: ["piel", "irregular", "lamed-hey", "everyday"],
      personal_priority: 78,
    }),
    createVerbEntry({
      id: "advanced-verb-levashel",
      availability: getStarterVerbAvailability("advanced-verb-levashel"),
      lemma: "לבשל",
      lemma_niqqud: "לְבַשֵּׁל",
      root: ["ב", "ש", "ל"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to cook", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מבשל", "מְבַשֵּׁל"),
          markedForm("מבשלת", "מְבַשֶּׁלֶת"),
          markedForm("מבשלים", "מְבַשְּׁלִים"),
          markedForm("מבשלות", "מְבַשְּׁלוֹת")
        ),
        makePast(
          markedForm("בישלתי", "בִּשַּׁלְתִּי"),
          markedForm("בישלת", "בִּשַּׁלְתָּ"),
          markedForm("בישלת", "בִּשַּׁלְתְּ"),
          markedForm("בישל", "בִּשֵּׁל"),
          markedForm("בישלה", "בִּשְּׁלָה"),
          markedForm("בישלנו", "בִּשַּׁלְנוּ"),
          markedForm("בישלתם", "בִּשַּׁלְתֶּם"),
          markedForm("בישלתן", "בִּשַּׁלְתֶּן"),
          markedForm("בישלו", "בִּשְּׁלוּ")
        ),
        makeFuture(
          markedForm("אבשל", "אֲבַשֵּׁל"),
          markedForm("תבשל", "תְּבַשֵּׁל"),
          markedForm("תבשלי", "תְּבַשְּׁלִי"),
          markedForm("יבשל", "יְבַשֵּׁל"),
          markedForm("תבשל", "תְּבַשֵּׁל"),
          markedForm("נבשל", "נְבַשֵּׁל"),
          markedForm("תבשלו", "תְּבַשְּׁלוּ"),
          markedForm("יבשלו", "יְבַשְּׁלוּ")
        ),
        makeImperative(
          markedForm("בשל", "בַּשֵּׁל"),
          markedForm("בשלי", "בַּשְּׁלִי"),
          markedForm("בשלו", "בַּשְּׁלוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el strong verb (ב-ש-ל): cook. Same paradigm as the seed לספר. Appears throughout the sentence bank (מבשל כל היום).",
      difficulty_level: 2,
      tags: ["piel", "regular", "everyday", "high-frequency"],
      personal_priority: 81,
    }),
    createVerbEntry({
      id: "advanced-verb-lesader",
      availability: getStarterVerbAvailability("advanced-verb-lesader"),
      lemma: "לסדר",
      lemma_niqqud: "לְסַדֵּר",
      root: ["ס", "ד", "ר"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to arrange", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מסדר", "מְסַדֵּר"),
          markedForm("מסדרת", "מְסַדֶּרֶת"),
          markedForm("מסדרים", "מְסַדְּרִים"),
          markedForm("מסדרות", "מְסַדְּרוֹת")
        ),
        makePast(
          markedForm("סידרתי", "סִדַּרְתִּי"),
          markedForm("סידרת", "סִדַּרְתָּ"),
          markedForm("סידרת", "סִדַּרְתְּ"),
          markedForm("סידר", "סִדֵּר"),
          markedForm("סידרה", "סִדְּרָה"),
          markedForm("סידרנו", "סִדַּרְנוּ"),
          markedForm("סידרתם", "סִדַּרְתֶּם"),
          markedForm("סידרתן", "סִדַּרְתֶּן"),
          markedForm("סידרו", "סִדְּרוּ")
        ),
        makeFuture(
          markedForm("אסדר", "אֲסַדֵּר"),
          markedForm("תסדר", "תְּסַדֵּר"),
          markedForm("תסדרי", "תְּסַדְּרִי"),
          markedForm("יסדר", "יְסַדֵּר"),
          markedForm("תסדר", "תְּסַדֵּר"),
          markedForm("נסדר", "נְסַדֵּר"),
          markedForm("תסדרו", "תְּסַדְּרוּ"),
          markedForm("יסדרו", "יְסַדְּרוּ")
        ),
        makeImperative(
          markedForm("סדר", "סַדֵּר"),
          markedForm("סדרי", "סַדְּרִי"),
          markedForm("סדרו", "סַדְּרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of ס-ד-ר: arrange, tidy, set in order. Same root as the binyan-board ס-ד-ר and the seed להסתדר. תסדר את החדר = tidy the room.",
      difficulty_level: 2,
      tags: ["piel", "regular", "everyday"],
      personal_priority: 76,
    }),
    createVerbEntry({
      id: "advanced-verb-letayel",
      availability: getStarterVerbAvailability("advanced-verb-letayel"),
      lemma: "לטייל",
      lemma_niqqud: "לְטַיֵּל",
      root: ["ט", "י", "ל"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to travel", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מטייל", "מְטַיֵּל"),
          markedForm("מטיילת", "מְטַיֶּלֶת"),
          markedForm("מטיילים", "מְטַיְּלִים"),
          markedForm("מטיילות", "מְטַיְּלוֹת")
        ),
        makePast(
          markedForm("טיילתי", "טִיַּלְתִּי"),
          markedForm("טיילת", "טִיַּלְתָּ"),
          markedForm("טיילת", "טִיַּלְתְּ"),
          markedForm("טייל", "טִיֵּל"),
          markedForm("טיילה", "טִיְּלָה"),
          markedForm("טיילנו", "טִיַּלְנוּ"),
          markedForm("טיילתם", "טִיַּלְתֶּם"),
          markedForm("טיילתן", "טִיַּלְתֶּן"),
          markedForm("טיילו", "טִיְּלוּ")
        ),
        makeFuture(
          markedForm("אטייל", "אֲטַיֵּל"),
          markedForm("תטייל", "תְּטַיֵּל"),
          markedForm("תטיילי", "תְּטַיְּלִי"),
          markedForm("יטייל", "יְטַיֵּל"),
          markedForm("תטייל", "תְּטַיֵּל"),
          markedForm("נטייל", "נְטַיֵּל"),
          markedForm("תטיילו", "תְּטַיְּלוּ"),
          markedForm("יטיילו", "יְטַיְּלוּ")
        ),
        makeImperative(
          markedForm("טייל", "טַיֵּל"),
          markedForm("טיילי", "טַיְּלִי"),
          markedForm("טיילו", "טַיְּלוּ")
        )
      ),
      review_status: "approved",
      notes: "ע\"י pi'el (ט-י-ל): travel, hike, take a stroll. The middle yod doubles (טִיֵּל). From the root behind טיול (a trip).",
      difficulty_level: 2,
      tags: ["piel", "irregular", "ayin-yod", "everyday"],
      personal_priority: 77,
    }),
    createVerbEntry({
      id: "advanced-verb-levaker",
      availability: getStarterVerbAvailability("advanced-verb-levaker"),
      lemma: "לבקר",
      lemma_niqqud: "לְבַקֵּר",
      root: ["ב", "ק", "ר"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [
        makeSense("to visit", "ב־", false),
        makeSense("to criticize", "את־", false),
      ],
      forms: makeForms(
        makePresent(
          markedForm("מבקר", "מְבַקֵּר"),
          markedForm("מבקרת", "מְבַקֶּרֶת"),
          markedForm("מבקרים", "מְבַקְּרִים"),
          markedForm("מבקרות", "מְבַקְּרוֹת")
        ),
        makePast(
          markedForm("ביקרתי", "בִּקַּרְתִּי"),
          markedForm("ביקרת", "בִּקַּרְתָּ"),
          markedForm("ביקרת", "בִּקַּרְתְּ"),
          markedForm("ביקר", "בִּקֵּר"),
          markedForm("ביקרה", "בִּקְּרָה"),
          markedForm("ביקרנו", "בִּקַּרְנוּ"),
          markedForm("ביקרתם", "בִּקַּרְתֶּם"),
          markedForm("ביקרתן", "בִּקַּרְתֶּן"),
          markedForm("ביקרו", "בִּקְּרוּ")
        ),
        makeFuture(
          markedForm("אבקר", "אֲבַקֵּר"),
          markedForm("תבקר", "תְּבַקֵּר"),
          markedForm("תבקרי", "תְּבַקְּרִי"),
          markedForm("יבקר", "יְבַקֵּר"),
          markedForm("תבקר", "תְּבַקֵּר"),
          markedForm("נבקר", "נְבַקֵּר"),
          markedForm("תבקרו", "תְּבַקְּרוּ"),
          markedForm("יבקרו", "יְבַקְּרוּ")
        ),
        makeImperative(
          markedForm("בקר", "בַּקֵּר"),
          markedForm("בקרי", "בַּקְּרִי"),
          markedForm("בקרו", "בַּקְּרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el of ב-ק-ר (distinct from ב-ק-ש 'request'). Two senses on one paradigm, told apart by what follows: לבקר ב־ or אצל is to visit (מבקר אצל סבתא), while לבקר את is to criticize or review (מבקר את המדיניות, and the agent noun מבקר המדינה, the State Comptroller).",
      difficulty_level: 2,
      tags: ["piel", "regular", "everyday"],
      personal_priority: 75,
    }),
    createVerbEntry({
      id: "advanced-verb-lehasbir",
      availability: getStarterVerbAvailability("advanced-verb-lehasbir"),
      lemma: "להסביר",
      lemma_niqqud: "לְהַסְבִּיר",
      root: ["ס", "ב", "ר"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to explain", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מסביר", "מַסְבִּיר"),
          markedForm("מסבירה", "מַסְבִּירָה"),
          markedForm("מסבירים", "מַסְבִּירִים"),
          markedForm("מסבירות", "מַסְבִּירוֹת")
        ),
        makePast(
          markedForm("הסברתי", "הִסְבַּרְתִּי"),
          markedForm("הסברת", "הִסְבַּרְתָּ"),
          markedForm("הסברת", "הִסְבַּרְתְּ"),
          markedForm("הסביר", "הִסְבִּיר"),
          markedForm("הסבירה", "הִסְבִּירָה"),
          markedForm("הסברנו", "הִסְבַּרְנוּ"),
          markedForm("הסברתם", "הִסְבַּרְתֶּם"),
          markedForm("הסברתן", "הִסְבַּרְתֶּן"),
          markedForm("הסבירו", "הִסְבִּירוּ")
        ),
        makeFuture(
          markedForm("אסביר", "אַסְבִּיר"),
          markedForm("תסביר", "תַּסְבִּיר"),
          markedForm("תסבירי", "תַּסְבִּירִי"),
          markedForm("יסביר", "יַסְבִּיר"),
          markedForm("תסביר", "תַּסְבִּיר"),
          markedForm("נסביר", "נַסְבִּיר"),
          markedForm("תסבירו", "תַּסְבִּירוּ"),
          markedForm("יסבירו", "יַסְבִּירוּ")
        ),
        makeImperative(
          markedForm("הסבר", "הַסְבֵּר"),
          markedForm("הסבירי", "הַסְבִּירִי"),
          markedForm("הסבירו", "הַסְבִּירוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il strong verb (ס-ב-ר): explain. Takes ל for the audience — מסביר לי. The noun הסבר (explanation) shares the root.",
      difficulty_level: 2,
      tags: ["hifil", "regular", "everyday", "high-frequency"],
      personal_priority: 80,
    }),
    createVerbEntry({
      id: "advanced-verb-lehadlik",
      availability: getStarterVerbAvailability("advanced-verb-lehadlik"),
      lemma: "להדליק",
      lemma_niqqud: "לְהַדְלִיק",
      root: ["ד", "ל", "ק"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to turn on", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מדליק", "מַדְלִיק"),
          markedForm("מדליקה", "מַדְלִיקָה"),
          markedForm("מדליקים", "מַדְלִיקִים"),
          markedForm("מדליקות", "מַדְלִיקוֹת")
        ),
        makePast(
          markedForm("הדלקתי", "הִדְלַקְתִּי"),
          markedForm("הדלקת", "הִדְלַקְתָּ"),
          markedForm("הדלקת", "הִדְלַקְתְּ"),
          markedForm("הדליק", "הִדְלִיק"),
          markedForm("הדליקה", "הִדְלִיקָה"),
          markedForm("הדלקנו", "הִדְלַקְנוּ"),
          markedForm("הדלקתם", "הִדְלַקְתֶּם"),
          markedForm("הדלקתן", "הִדְלַקְתֶּן"),
          markedForm("הדליקו", "הִדְלִיקוּ")
        ),
        makeFuture(
          markedForm("אדליק", "אַדְלִיק"),
          markedForm("תדליק", "תַּדְלִיק"),
          markedForm("תדליקי", "תַּדְלִיקִי"),
          markedForm("ידליק", "יַדְלִיק"),
          markedForm("תדליק", "תַּדְלִיק"),
          markedForm("נדליק", "נַדְלִיק"),
          markedForm("תדליקו", "תַּדְלִיקוּ"),
          markedForm("ידליקו", "יַדְלִיקוּ")
        ),
        makeImperative(
          markedForm("הדלק", "הַדְלֵק"),
          markedForm("הדליקי", "הַדְלִיקִי"),
          markedForm("הדליקו", "הַדְלִיקוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of ד-ל-ק: turn on (a light/device), light (a candle). The opposite of the seed pi'el לכבות. Slang: זה מדליק אותי = that excites me.",
      difficulty_level: 2,
      tags: ["hifil", "regular", "everyday", "high-frequency"],
      personal_priority: 78,
    }),
    createVerbEntry({
      id: "advanced-verb-lehafsik",
      availability: getStarterVerbAvailability("advanced-verb-lehafsik"),
      lemma: "להפסיק",
      lemma_niqqud: "לְהַפְסִיק",
      root: ["פ", "ס", "ק"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to stop", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מפסיק", "מַפְסִיק"),
          markedForm("מפסיקה", "מַפְסִיקָה"),
          markedForm("מפסיקים", "מַפְסִיקִים"),
          markedForm("מפסיקות", "מַפְסִיקוֹת")
        ),
        makePast(
          markedForm("הפסקתי", "הִפְסַקְתִּי"),
          markedForm("הפסקת", "הִפְסַקְתָּ"),
          markedForm("הפסקת", "הִפְסַקְתְּ"),
          markedForm("הפסיק", "הִפְסִיק"),
          markedForm("הפסיקה", "הִפְסִיקָה"),
          markedForm("הפסקנו", "הִפְסַקְנוּ"),
          markedForm("הפסקתם", "הִפְסַקְתֶּם"),
          markedForm("הפסקתן", "הִפְסַקְתֶּן"),
          markedForm("הפסיקו", "הִפְסִיקוּ")
        ),
        makeFuture(
          markedForm("אפסיק", "אַפְסִיק"),
          markedForm("תפסיק", "תַּפְסִיק"),
          markedForm("תפסיקי", "תַּפְסִיקִי"),
          markedForm("יפסיק", "יַפְסִיק"),
          markedForm("תפסיק", "תַּפְסִיק"),
          markedForm("נפסיק", "נַפְסִיק"),
          markedForm("תפסיקו", "תַּפְסִיקוּ"),
          markedForm("יפסיקו", "יַפְסִיקוּ")
        ),
        makeImperative(
          markedForm("הפסק", "הַפְסֵק"),
          markedForm("הפסיקי", "הַפְסִיקִי"),
          markedForm("הפסיקו", "הַפְסִיקוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of פ-ס-ק: stop, quit, cut off. Takes infinitive — תפסיק לדבר. הפסקה (a break/recess) shares the root.",
      difficulty_level: 2,
      tags: ["hifil", "regular", "everyday", "high-frequency"],
      personal_priority: 79,
    }),
    createVerbEntry({
      id: "advanced-verb-lehakshiv",
      availability: getStarterVerbAvailability("advanced-verb-lehakshiv"),
      lemma: "להקשיב",
      lemma_niqqud: "לְהַקְשִׁיב",
      root: ["ק", "ש", "ב"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to listen", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מקשיב", "מַקְשִׁיב"),
          markedForm("מקשיבה", "מַקְשִׁיבָה"),
          markedForm("מקשיבים", "מַקְשִׁיבִים"),
          markedForm("מקשיבות", "מַקְשִׁיבוֹת")
        ),
        makePast(
          markedForm("הקשבתי", "הִקְשַׁבְתִּי"),
          markedForm("הקשבת", "הִקְשַׁבְתָּ"),
          markedForm("הקשבת", "הִקְשַׁבְתְּ"),
          markedForm("הקשיב", "הִקְשִׁיב"),
          markedForm("הקשיבה", "הִקְשִׁיבָה"),
          markedForm("הקשבנו", "הִקְשַׁבְנוּ"),
          markedForm("הקשבתם", "הִקְשַׁבְתֶּם"),
          markedForm("הקשבתן", "הִקְשַׁבְתֶּן"),
          markedForm("הקשיבו", "הִקְשִׁיבוּ")
        ),
        makeFuture(
          markedForm("אקשיב", "אַקְשִׁיב"),
          markedForm("תקשיב", "תַּקְשִׁיב"),
          markedForm("תקשיבי", "תַּקְשִׁיבִי"),
          markedForm("יקשיב", "יַקְשִׁיב"),
          markedForm("תקשיב", "תַּקְשִׁיב"),
          markedForm("נקשיב", "נַקְשִׁיב"),
          markedForm("תקשיבו", "תַּקְשִׁיבוּ"),
          markedForm("יקשיבו", "יַקְשִׁיבוּ")
        ),
        makeImperative(
          markedForm("הקשב", "הַקְשֵׁב"),
          markedForm("הקשיבי", "הַקְשִׁיבִי"),
          markedForm("הקשיבו", "הַקְשִׁיבוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of ק-ש-ב: listen, pay attention. Takes ל — מקשיב למורה. Contrast the seed לשמוע (hear).",
      difficulty_level: 2,
      tags: ["hifil", "regular", "everyday"],
      personal_priority: 74,
    }),
    createVerbEntry({
      id: "advanced-verb-lehachnis",
      availability: getStarterVerbAvailability("advanced-verb-lehachnis"),
      lemma: "להכניס",
      lemma_niqqud: "לְהַכְנִיס",
      root: ["כ", "נ", "ס"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to put in", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מכניס", "מַכְנִיס"),
          markedForm("מכניסה", "מַכְנִיסָה"),
          markedForm("מכניסים", "מַכְנִיסִים"),
          markedForm("מכניסות", "מַכְנִיסוֹת")
        ),
        makePast(
          markedForm("הכנסתי", "הִכְנַסְתִּי"),
          markedForm("הכנסת", "הִכְנַסְתָּ"),
          markedForm("הכנסת", "הִכְנַסְתְּ"),
          markedForm("הכניס", "הִכְנִיס"),
          markedForm("הכניסה", "הִכְנִיסָה"),
          markedForm("הכנסנו", "הִכְנַסְנוּ"),
          markedForm("הכנסתם", "הִכְנַסְתֶּם"),
          markedForm("הכנסתן", "הִכְנַסְתֶּן"),
          markedForm("הכניסו", "הִכְנִיסוּ")
        ),
        makeFuture(
          markedForm("אכניס", "אַכְנִיס"),
          markedForm("תכניס", "תַּכְנִיס"),
          markedForm("תכניסי", "תַּכְנִיסִי"),
          markedForm("יכניס", "יַכְנִיס"),
          markedForm("תכניס", "תַּכְנִיס"),
          markedForm("נכניס", "נַכְנִיס"),
          markedForm("תכניסו", "תַּכְנִיסוּ"),
          markedForm("יכניסו", "יַכְנִיסוּ")
        ),
        makeImperative(
          markedForm("הכנס", "הַכְנֵס"),
          markedForm("הכניסי", "הַכְנִיסִי"),
          markedForm("הכניסו", "הַכְנִיסוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of כ-נ-ס: put in, insert, bring in. The causative of the seed nif'al להיכנס (enter). מכניס את הכרטיס = inserts the card.",
      difficulty_level: 2,
      tags: ["hifil", "regular", "everyday"],
      personal_priority: 73,
    }),
    createVerbEntry({
      id: "advanced-verb-lehachzir",
      availability: getStarterVerbAvailability("advanced-verb-lehachzir"),
      lemma: "להחזיר",
      lemma_niqqud: "לְהַחְזִיר",
      root: ["ח", "ז", "ר"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to give back", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מחזיר", "מַחְזִיר"),
          markedForm("מחזירה", "מַחְזִירָה"),
          markedForm("מחזירים", "מַחְזִירִים"),
          markedForm("מחזירות", "מַחְזִירוֹת")
        ),
        makePast(
          markedForm("החזרתי", "הֶחְזַרְתִּי"),
          markedForm("החזרת", "הֶחְזַרְתָּ"),
          markedForm("החזרת", "הֶחְזַרְתְּ"),
          markedForm("החזיר", "הֶחְזִיר"),
          markedForm("החזירה", "הֶחְזִירָה"),
          markedForm("החזרנו", "הֶחְזַרְנוּ"),
          markedForm("החזרתם", "הֶחְזַרְתֶּם"),
          markedForm("החזרתן", "הֶחְזַרְתֶּן"),
          markedForm("החזירו", "הֶחְזִירוּ")
        ),
        makeFuture(
          markedForm("אחזיר", "אַחְזִיר"),
          markedForm("תחזיר", "תַּחְזִיר"),
          markedForm("תחזירי", "תַּחְזִירִי"),
          markedForm("יחזיר", "יַחְזִיר"),
          markedForm("תחזיר", "תַּחְזִיר"),
          markedForm("נחזיר", "נַחְזִיר"),
          markedForm("תחזירו", "תַּחְזִירוּ"),
          markedForm("יחזירו", "יַחְזִירוּ")
        ),
        makeImperative(
          markedForm("החזר", "הַחְזֵר"),
          markedForm("החזירי", "הַחְזִירִי"),
          markedForm("החזירו", "הַחְזִירוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of ח-ז-ר (initial guttural): give back, return something. Past prefix is segol (הֶחְזִיר) like the seed להחליט; future/present take patach (אַחְזִיר, מַחְזִיר). Causative of the seed לחזור.",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "pe-guttural", "everyday"],
      personal_priority: 74,
    }),
    createVerbEntry({
      id: "advanced-verb-lehatzliach",
      availability: getStarterVerbAvailability("advanced-verb-lehatzliach"),
      lemma: "להצליח",
      lemma_niqqud: "לְהַצְלִיחַ",
      root: ["צ", "ל", "ח"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to succeed", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מצליח", "מַצְלִיחַ"),
          markedForm("מצליחה", "מַצְלִיחָה"),
          markedForm("מצליחים", "מַצְלִיחִים"),
          markedForm("מצליחות", "מַצְלִיחוֹת")
        ),
        makePast(
          markedForm("הצלחתי", "הִצְלַחְתִּי"),
          markedForm("הצלחת", "הִצְלַחְתָּ"),
          markedForm("הצלחת", "הִצְלַחַתְּ"),
          markedForm("הצליח", "הִצְלִיחַ"),
          markedForm("הצליחה", "הִצְלִיחָה"),
          markedForm("הצלחנו", "הִצְלַחְנוּ"),
          markedForm("הצלחתם", "הִצְלַחְתֶּם"),
          markedForm("הצלחתן", "הִצְלַחְתֶּן"),
          markedForm("הצליחו", "הִצְלִיחוּ")
        ),
        makeFuture(
          markedForm("אצליח", "אַצְלִיחַ"),
          markedForm("תצליח", "תַּצְלִיחַ"),
          markedForm("תצליחי", "תַּצְלִיחִי"),
          markedForm("יצליח", "יַצְלִיחַ"),
          markedForm("תצליח", "תַּצְלִיחַ"),
          markedForm("נצליח", "נַצְלִיחַ"),
          markedForm("תצליחו", "תַּצְלִיחוּ"),
          markedForm("יצליחו", "יַצְלִיחוּ")
        ),
        makeImperative(
          markedForm("הצלח", "הַצְלֵחַ"),
          markedForm("הצליחי", "הַצְלִיחִי"),
          markedForm("הצליחו", "הַצְלִיחוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il of צ-ל-ח (final guttural): succeed, manage. The ח takes a furtive patach (מַצְלִיחַ) and colors the 2fs past to הִצְלַחַתְּ. Takes infinitive — הצלחתי לפתור.",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "lamed-guttural", "high-frequency"],
      personal_priority: 78,
    }),
    createVerbEntry({
      id: "advanced-verb-lehakir",
      availability: getStarterVerbAvailability("advanced-verb-lehakir"),
      lemma: "להכיר",
      lemma_niqqud: "לְהַכִּיר",
      root: ["נ", "כ", "ר"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to know", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מכיר", "מַכִּיר"),
          markedForm("מכירה", "מַכִּירָה"),
          markedForm("מכירים", "מַכִּירִים"),
          markedForm("מכירות", "מַכִּירוֹת")
        ),
        makePast(
          markedForm("הכרתי", "הִכַּרְתִּי"),
          markedForm("הכרת", "הִכַּרְתָּ"),
          markedForm("הכרת", "הִכַּרְתְּ"),
          markedForm("הכיר", "הִכִּיר"),
          markedForm("הכירה", "הִכִּירָה"),
          markedForm("הכרנו", "הִכַּרְנוּ"),
          markedForm("הכרתם", "הִכַּרְתֶּם"),
          markedForm("הכרתן", "הִכַּרְתֶּן"),
          markedForm("הכירו", "הִכִּירוּ")
        ),
        makeFuture(
          markedForm("אכיר", "אַכִּיר"),
          markedForm("תכיר", "תַּכִּיר"),
          markedForm("תכירי", "תַּכִּירִי"),
          markedForm("יכיר", "יַכִּיר"),
          markedForm("תכיר", "תַּכִּיר"),
          markedForm("נכיר", "נַכִּיר"),
          markedForm("תכירו", "תַּכִּירוּ"),
          markedForm("יכירו", "יַכִּירוּ")
        ),
        makeImperative(
          markedForm("הכר", "הַכֵּר"),
          markedForm("הכירי", "הַכִּירִי"),
          markedForm("הכירו", "הַכִּירוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il פ\"נ (נ-כ-ר): know, be acquainted with (people/places) — distinct from the seed לדעת (know facts). The nun assimilates into a dagesh (הִכִּיר, מַכִּיר), like הִפִּיל. נעים להכיר!",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "pe-nun", "high-frequency"],
      personal_priority: 80,
    }),
    createVerbEntry({
      id: "advanced-verb-lehorid",
      availability: getStarterVerbAvailability("advanced-verb-lehorid"),
      lemma: "להוריד",
      lemma_niqqud: "לְהוֹרִיד",
      root: ["י", "ר", "ד"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [
        makeSense("to take down", null, false),
        makeSense("to download", null, false),
      ],
      forms: makeForms(
        makePresent(
          markedForm("מוריד", "מוֹרִיד"),
          markedForm("מורידה", "מוֹרִידָה"),
          markedForm("מורידים", "מוֹרִידִים"),
          markedForm("מורידות", "מוֹרִידוֹת")
        ),
        makePast(
          markedForm("הורדתי", "הוֹרַדְתִּי"),
          markedForm("הורדת", "הוֹרַדְתָּ"),
          markedForm("הורדת", "הוֹרַדְתְּ"),
          markedForm("הוריד", "הוֹרִיד"),
          markedForm("הורידה", "הוֹרִידָה"),
          markedForm("הורדנו", "הוֹרַדְנוּ"),
          markedForm("הורדתם", "הוֹרַדְתֶּם"),
          markedForm("הורדתן", "הוֹרַדְתֶּן"),
          markedForm("הורידו", "הוֹרִידוּ")
        ),
        makeFuture(
          markedForm("אוריד", "אוֹרִיד"),
          markedForm("תוריד", "תּוֹרִיד"),
          markedForm("תורידי", "תּוֹרִידִי"),
          markedForm("יוריד", "יוֹרִיד"),
          markedForm("תוריד", "תּוֹרִיד"),
          markedForm("נוריד", "נוֹרִיד"),
          markedForm("תורידו", "תּוֹרִידוּ"),
          markedForm("יורידו", "יוֹרִידוּ")
        ),
        makeImperative(
          markedForm("הורד", "הוֹרֵד"),
          markedForm("הורידי", "הוֹרִידִי"),
          markedForm("הורידו", "הוֹרִידוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il פ\"י (י-ר-ד): take down, lower, download. The initial yod surfaces as holam throughout (הוֹרִיד, מוֹרִיד, יוֹרִיד). Causative of the seed לרדת; also 'download a file' (מוריד קובץ).",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "pe-yod", "everyday", "high-frequency"],
      personal_priority: 79,
    }),
    createVerbEntry({
      id: "advanced-verb-litzchok",
      availability: getStarterVerbAvailability("advanced-verb-litzchok"),
      lemma: "לצחוק",
      lemma_niqqud: "לִצְחֹק",
      root: ["צ", "ח", "ק"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to laugh", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("צוחק", "צוֹחֵק"),
          markedForm("צוחקת", "צוֹחֶקֶת"),
          markedForm("צוחקים", "צוֹחֲקִים"),
          markedForm("צוחקות", "צוֹחֲקוֹת")
        ),
        makePast(
          markedForm("צחקתי", "צָחַקְתִּי"),
          markedForm("צחקת", "צָחַקְתָּ"),
          markedForm("צחקת", "צָחַקְתְּ"),
          markedForm("צחק", "צָחַק"),
          markedForm("צחקה", "צָחֲקָה"),
          markedForm("צחקנו", "צָחַקְנוּ"),
          markedForm("צחקתם", "צְחַקְתֶּם"),
          markedForm("צחקתן", "צְחַקְתֶּן"),
          markedForm("צחקו", "צָחֲקוּ")
        ),
        makeFuture(
          markedForm("אצחק", "אֶצְחַק"),
          markedForm("תצחק", "תִּצְחַק"),
          markedForm("תצחקי", "תִּצְחֲקִי"),
          markedForm("יצחק", "יִצְחַק"),
          markedForm("תצחק", "תִּצְחַק"),
          markedForm("נצחק", "נִצְחַק"),
          markedForm("תצחקו", "תִּצְחֲקוּ"),
          markedForm("יצחקו", "יִצְחֲקוּ")
        ),
        makeImperative(
          markedForm("צחק", "צְחַק"),
          markedForm("צחקי", "צַחֲקִי"),
          markedForm("צחקו", "צַחֲקוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al with guttural middle radical (צ-ח-ק): the o-infinitive לצחוק takes an a-future (יִצְחַק — the source of the name יצחק). The ח takes chataf-patach before vowel endings (צוֹחֲקִים, צָחֲקוּ). צוחק על = laughs at.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "ayin-guttural", "everyday"],
      personal_priority: 72,
    }),
    createVerbEntry({
      id: "advanced-verb-latus",
      availability: getStarterVerbAvailability("advanced-verb-latus"),
      lemma: "לטוס",
      lemma_niqqud: "לָטוּס",
      root: ["ט", "ו", "ס"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to fly", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("טס", "טָס"),
          markedForm("טסה", "טָסָה"),
          markedForm("טסים", "טָסִים"),
          markedForm("טסות", "טָסוֹת")
        ),
        makePast(
          markedForm("טסתי", "טַסְתִּי"),
          markedForm("טסת", "טַסְתָּ"),
          markedForm("טסת", "טַסְתְּ"),
          markedForm("טס", "טָס"),
          markedForm("טסה", "טָסָה"),
          markedForm("טסנו", "טַסְנוּ"),
          markedForm("טסתם", "טַסְתֶּם"),
          markedForm("טסתן", "טַסְתֶּן"),
          markedForm("טסו", "טָסוּ")
        ),
        makeFuture(
          markedForm("אטוס", "אָטוּס"),
          markedForm("תטוס", "תָּטוּס"),
          markedForm("תטוסי", "תָּטוּסִי"),
          markedForm("יטוס", "יָטוּס"),
          markedForm("תטוס", "תָּטוּס"),
          markedForm("נטוס", "נָטוּס"),
          markedForm("תטוסו", "תָּטוּסוּ"),
          markedForm("יטוסו", "יָטוּסוּ")
        ),
        makeImperative(
          markedForm("טוס", "טוּס"),
          markedForm("טוסי", "טוּסִי"),
          markedForm("טוסו", "טוּסוּ")
        )
      ),
      review_status: "approved",
      notes: "ע\"ו hollow root (ט-ו-ס): fly (in a plane). Same paradigm as the seed לגור/לרוץ — present טָס and past 3ms טָס share a form, distinguished by tense. Future prefix takes kamatz (אָטוּס).",
      difficulty_level: 2,
      tags: ["paal", "irregular", "ayin-vav", "everyday"],
      personal_priority: 71,
    }),
    createVerbEntry({
      id: "advanced-verb-lagaat",
      availability: getStarterVerbAvailability("advanced-verb-lagaat"),
      lemma: "לגעת",
      lemma_niqqud: "לָגַעַת",
      root: ["נ", "ג", "ע"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to touch", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("נוגע", "נוֹגֵעַ"),
          markedForm("נוגעת", "נוֹגַעַת"),
          markedForm("נוגעים", "נוֹגְעִים"),
          markedForm("נוגעות", "נוֹגְעוֹת")
        ),
        makePast(
          markedForm("נגעתי", "נָגַעְתִּי"),
          markedForm("נגעת", "נָגַעְתָּ"),
          markedForm("נגעת", "נָגַעְתְּ"),
          markedForm("נגע", "נָגַע"),
          markedForm("נגעה", "נָגְעָה"),
          markedForm("נגענו", "נָגַעְנוּ"),
          markedForm("נגעתם", "נְגַעְתֶּם"),
          markedForm("נגעתן", "נְגַעְתֶּן"),
          markedForm("נגעו", "נָגְעוּ")
        ),
        makeFuture(
          markedForm("אגע", "אֶגַּע"),
          markedForm("תיגע", "תִּגַּע"),
          markedForm("תיגעי", "תִּגְּעִי"),
          markedForm("ייגע", "יִגַּע"),
          markedForm("תיגע", "תִּגַּע"),
          markedForm("ניגע", "נִגַּע"),
          markedForm("תיגעו", "תִּגְּעוּ"),
          markedForm("ייגעו", "יִגְּעוּ")
        ),
        makeImperative(
          markedForm("גע", "גַּע"),
          markedForm("געי", "גְּעִי"),
          markedForm("געו", "גְּעוּ")
        )
      ),
      review_status: "approved",
      notes: "Doubly weak pa'al (נ-ג-ע): פ\"נ so the nun assimilates in the future (יִגַּע, like ליפול), and final guttural ע forces patach (נָגַע, אֶגַּע, imperative גַּע). Infinitive לָגַעַת like לָדַעַת. Takes ב — נוגע בזה.",
      difficulty_level: 4,
      tags: ["paal", "irregular", "pe-nun", "lamed-guttural"],
      personal_priority: 70,
    }),
    createVerbEntry({
      id: "character-verb-lirkod",
      availability: getStarterVerbAvailability("character-verb-lirkod"),
      lemma: "לרקוד",
      lemma_niqqud: "לִרְקוֹד",
      root: ["ר", "ק", "ד"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to dance", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("רוקד", "רוֹקֵד"),
          markedForm("רוקדת", "רוֹקֶדֶת"),
          markedForm("רוקדים", "רוֹקְדִים"),
          markedForm("רוקדות", "רוֹקְדוֹת")
        ),
        makePast(
          markedForm("רקדתי", "רָקַדְתִּי"),
          markedForm("רקדת", "רָקַדְתָּ"),
          markedForm("רקדת", "רָקַדְתְּ"),
          markedForm("רקד", "רָקַד"),
          markedForm("רקדה", "רָקְדָה"),
          markedForm("רקדנו", "רָקַדְנוּ"),
          markedForm("רקדתם", "רְקַדְתֶּם"),
          markedForm("רקדתן", "רְקַדְתֶּן"),
          markedForm("רקדו", "רָקְדוּ")
        ),
        makeFuture(
          markedForm("ארקוד", "אֶרְקוֹד"),
          markedForm("תרקוד", "תִּרְקוֹד"),
          markedForm("תרקדי", "תִּרְקְדִי"),
          markedForm("ירקוד", "יִרְקוֹד"),
          markedForm("תרקוד", "תִּרְקוֹד"),
          markedForm("נרקוד", "נִרְקוֹד"),
          markedForm("תרקדו", "תִּרְקְדוּ"),
          markedForm("ירקדו", "יִרְקְדוּ")
        ),
        makeImperative(
          markedForm("רקוד", "רְקוֹד"),
          markedForm("רקדי", "רִקְדִי"),
          markedForm("רקדו", "רִקְדוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular pa'al of ר-ק-ד with an o-future (אֶרְקוֹד, like לִטְבּוֹל). Dictionary-attested throughout. Nightlife staple in Ido's register.",
      difficulty_level: 2,
      tags: ["paal", "regular", "everyday", "nightlife"],
      personal_priority: 84,
    }),
    createVerbEntry({
      id: "character-verb-levalot",
      availability: getStarterVerbAvailability("character-verb-levalot"),
      lemma: "לבלות",
      lemma_niqqud: "לְבַלּוֹת",
      root: ["ב", "ל", "ה"],
      binyan: "piel",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to hang out", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מבלה", "מְבַלֶּה"),
          markedForm("מבלה", "מְבַלָּה"),
          markedForm("מבלים", "מְבַלִּים"),
          markedForm("מבלות", "מְבַלּוֹת")
        ),
        makePast(
          markedForm("ביליתי", "בִּלִּיתִי"),
          markedForm("בילית", "בִּלִּיתָ"),
          markedForm("בילית", "בִּלִּית"),
          markedForm("בילה", "בִּלָּה"),
          markedForm("בילתה", "בִּלְּתָה"),
          markedForm("בילינו", "בִּלִּינוּ"),
          markedForm("ביליתם", "בִּלִּיתֶם"),
          markedForm("ביליתן", "בִּלִּיתֶן"),
          markedForm("בילו", "בִּלּוּ")
        ),
        makeFuture(
          markedForm("אבלה", "אֲבַלֶּה"),
          markedForm("תבלה", "תְּבַלֶּה"),
          markedForm("תבלי", "תְּבַלִּי"),
          markedForm("יבלה", "יְבַלֶּה"),
          markedForm("תבלה", "תְּבַלֶּה"),
          markedForm("נבלה", "נְבַלֶּה"),
          markedForm("תבלו", "תְּבַלּוּ"),
          markedForm("יבלו", "יְבַלּוּ")
        ),
        makeImperative(
          markedForm("בלה", "בַּלֵּה"),
          markedForm("בלי", "בַּלִּי"),
          markedForm("בלו", "בַּלּוּ")
        )
      ),
      review_status: "approved",
      notes: "Pi'el ל\"ה of ב-ל-ה, slot-for-slot like לנסות. Present ms and fs share the plain spelling מבלה, and past 2ms/2fs share בילית — both resolved only by niqqud. Everyday sense is spending time out with people.",
      difficulty_level: 2,
      tags: ["piel", "irregular", "lamed-hey", "everyday", "nightlife"],
      personal_priority: 86,
    }),
    createVerbEntry({
      id: "character-verb-lachpor",
      availability: getStarterVerbAvailability("character-verb-lachpor"),
      lemma: "לחפור",
      lemma_niqqud: "לַחְפּוֹר",
      root: ["ח", "פ", "ר"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to go on and on", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("חופר", "חוֹפֵר"),
          markedForm("חופרת", "חוֹפֶרֶת"),
          markedForm("חופרים", "חוֹפְרִים"),
          markedForm("חופרות", "חוֹפְרוֹת")
        ),
        makePast(
          markedForm("חפרתי", "חָפַרְתִּי"),
          markedForm("חפרת", "חָפַרְתָּ"),
          markedForm("חפרת", "חָפַרְתְּ"),
          markedForm("חפר", "חָפַר"),
          markedForm("חפרה", "חָפְרָה"),
          markedForm("חפרנו", "חָפַרְנוּ"),
          markedForm("חפרתם", "חֲפַרְתֶּם"),
          markedForm("חפרתן", "חֲפַרְתֶּן"),
          markedForm("חפרו", "חָפְרוּ")
        ),
        makeFuture(
          markedForm("אחפור", "אֶחְפּוֹר"),
          markedForm("תחפור", "תַּחְפּוֹר"),
          markedForm("תחפרי", "תַּחְפְּרִי"),
          markedForm("יחפור", "יַחְפּוֹר"),
          markedForm("תחפור", "תַּחְפּוֹר"),
          markedForm("נחפור", "נַחְפּוֹר"),
          markedForm("תחפרו", "תַּחְפְּרוּ"),
          markedForm("יחפרו", "יַחְפְּרוּ")
        ),
        makeImperative(
          markedForm("חפור", "חֲפוֹר"),
          markedForm("חפרי", "חִפְרִי"),
          markedForm("חפרו", "חִפְרוּ")
        )
      ),
      review_status: "approved",
      notes: "Pe-guttural pa'al of ח-פ-ר, pointed like לחשוב: segol prefix in the 1s future (אֶחְפּוֹר) and patach elsewhere (תַּחְפּוֹר, יַחְפּוֹר). The paradigm is the dictionary verb 'to dig'; only the gloss is slang — חופר describes someone talking your ear off.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "guttural", "slang", "colloquial"],
      personal_priority: 72,
    }),
    createVerbEntry({
      id: "character-verb-lizrom",
      availability: getStarterVerbAvailability("character-verb-lizrom"),
      lemma: "לזרום",
      lemma_niqqud: "לִזְרוֹם",
      root: ["ז", "ר", "מ"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to go with the flow", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("זורם", "זוֹרֵם"),
          markedForm("זורמת", "זוֹרֶמֶת"),
          markedForm("זורמים", "זוֹרְמִים"),
          markedForm("זורמות", "זוֹרְמוֹת")
        ),
        makePast(
          markedForm("זרמתי", "זָרַמְתִּי"),
          markedForm("זרמת", "זָרַמְתָּ"),
          markedForm("זרמת", "זָרַמְתְּ"),
          markedForm("זרם", "זָרַם"),
          markedForm("זרמה", "זָרְמָה"),
          markedForm("זרמנו", "זָרַמְנוּ"),
          markedForm("זרמתם", "זְרַמְתֶּם"),
          markedForm("זרמתן", "זְרַמְתֶּן"),
          markedForm("זרמו", "זָרְמוּ")
        ),
        makeFuture(
          markedForm("אזרום", "אֶזְרוֹם"),
          markedForm("תזרום", "תִּזְרוֹם"),
          markedForm("תזרמי", "תִּזְרְמִי"),
          markedForm("יזרום", "יִזְרוֹם"),
          markedForm("תזרום", "תִּזְרוֹם"),
          markedForm("נזרום", "נִזְרוֹם"),
          markedForm("תזרמו", "תִּזְרְמוּ"),
          markedForm("יזרמו", "יִזְרְמוּ")
        ),
        makeImperative(
          markedForm("זרום", "זְרוֹם"),
          markedForm("זרמי", "זִרְמִי"),
          markedForm("זרמו", "זִרְמוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular pa'al of ז-ר-מ with an o-future. The paradigm is the dictionary verb 'to flow'; the colloquial sense is being easygoing, and it takes עם — זורם עם זה.",
      difficulty_level: 2,
      tags: ["paal", "regular", "slang", "colloquial"],
      personal_priority: 76,
    }),
    createVerbEntry({
      id: "character-verb-lefargen",
      availability: getStarterVerbAvailability("character-verb-lefargen"),
      lemma: "לפרגן",
      lemma_niqqud: "לְפַרְגֵּן",
      root: ["פ", "ר", "ג", "נ"],
      binyan: "piel",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to give props", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מפרגן", "מְפַרְגֵּן"),
          markedForm("מפרגנת", "מְפַרְגֶּנֶת"),
          markedForm("מפרגנים", "מְפַרְגְּנִים"),
          markedForm("מפרגנות", "מְפַרְגְּנוֹת")
        ),
        makePast(
          markedForm("פרגנתי", "פִּרְגַּנְתִּי"),
          markedForm("פרגנת", "פִּרְגַּנְתָּ"),
          markedForm("פרגנת", "פִּרְגַּנְתְּ"),
          markedForm("פרגן", "פִּרְגֵּן"),
          markedForm("פרגנה", "פִּרְגְּנָה"),
          markedForm("פרגנו", "פִּרְגַּנּוּ"),
          markedForm("פרגנתם", "פִּרְגַּנְתֶּם"),
          markedForm("פרגנתן", "פִּרְגַּנְתֶּן"),
          markedForm("פרגנו", "פִּרְגְּנוּ")
        ),
        makeFuture(
          markedForm("אפרגן", "אֲפַרְגֵּן"),
          markedForm("תפרגן", "תְּפַרְגֵּן"),
          markedForm("תפרגני", "תְּפַרְגְּנִי"),
          markedForm("יפרגן", "יְפַרְגֵּן"),
          markedForm("תפרגן", "תְּפַרְגֵּן"),
          markedForm("נפרגן", "נְפַרְגֵּן"),
          markedForm("תפרגנו", "תְּפַרְגְּנוּ"),
          markedForm("יפרגנו", "יְפַרְגְּנוּ")
        ),
        makeImperative(
          markedForm("פרגן", "פַּרְגֵּן"),
          markedForm("פרגני", "פַּרְגְּנִי"),
          markedForm("פרגנו", "פַּרְגְּנוּ")
        )
      ),
      review_status: "approved",
      notes: "Denominal loan verb from Yiddish farginen; the quadriliteral pi'el paradigm follows the regular לתכנן template rather than a dictionary paradigm. Past 1p פִּרְגַּנּוּ and 3p פִּרְגְּנוּ share the plain spelling פרגנו, as in תכננו. The פ takes a dagesh in the past (פִּרְגֵּן, \"pirgen\") but not after the sheva na of the infinitive (לְפַרְגֵּן, \"lefargen\"). Takes ל — מפרגן לו.",
      difficulty_level: 3,
      tags: ["piel", "quadriliteral", "slang", "colloquial"],
      personal_priority: 74,
    }),
    createVerbEntry({
      id: "character-verb-lehitcharfen",
      availability: getStarterVerbAvailability("character-verb-lehitcharfen"),
      lemma: "להתחרפן",
      lemma_niqqud: "לְהִתְחַרְפֵּן",
      root: ["ח", "ר", "פ", "נ"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to freak out", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתחרפן", "מִתְחַרְפֵּן"),
          markedForm("מתחרפנת", "מִתְחַרְפֶּנֶת"),
          markedForm("מתחרפנים", "מִתְחַרְפְּנִים"),
          markedForm("מתחרפנות", "מִתְחַרְפְּנוֹת")
        ),
        makePast(
          markedForm("התחרפנתי", "הִתְחַרְפַּנְתִּי"),
          markedForm("התחרפנת", "הִתְחַרְפַּנְתָּ"),
          markedForm("התחרפנת", "הִתְחַרְפַּנְתְּ"),
          markedForm("התחרפן", "הִתְחַרְפֵּן"),
          markedForm("התחרפנה", "הִתְחַרְפְּנָה"),
          markedForm("התחרפנו", "הִתְחַרְפַּנּוּ"),
          markedForm("התחרפנתם", "הִתְחַרְפַּנְתֶּם"),
          markedForm("התחרפנתן", "הִתְחַרְפַּנְתֶּן"),
          markedForm("התחרפנו", "הִתְחַרְפְּנוּ")
        ),
        makeFuture(
          markedForm("אתחרפן", "אֶתְחַרְפֵּן"),
          markedForm("תתחרפן", "תִּתְחַרְפֵּן"),
          markedForm("תתחרפני", "תִּתְחַרְפְּנִי"),
          markedForm("יתחרפן", "יִתְחַרְפֵּן"),
          markedForm("תתחרפן", "תִּתְחַרְפֵּן"),
          markedForm("נתחרפן", "נִתְחַרְפֵּן"),
          markedForm("תתחרפנו", "תִּתְחַרְפְּנוּ"),
          markedForm("יתחרפנו", "יִתְחַרְפְּנוּ")
        )
      ),
      review_status: "approved",
      notes: "Slang hitpa'el built on מחורפן; the quadriliteral paradigm is derived from the regular template, not dictionary-attested in this shape. No metathesis — only sibilants trigger it and the first radical here is ח. No imperative: the live command is the negated future, אל תתחרפן.",
      difficulty_level: 3,
      tags: ["hitpael", "quadriliteral", "slang", "colloquial"],
      personal_priority: 70,
    }),
    createVerbEntry({
      id: "character-verb-lehitmazmez",
      availability: getStarterVerbAvailability("character-verb-lehitmazmez"),
      lemma: "להתמזמז",
      lemma_niqqud: "לְהִתְמַזְמֵז",
      root: ["מ", "ז", "מ", "ז"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to make out", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתמזמז", "מִתְמַזְמֵז"),
          markedForm("מתמזמזת", "מִתְמַזְמֶזֶת"),
          markedForm("מתמזמזים", "מִתְמַזְמְזִים"),
          markedForm("מתמזמזות", "מִתְמַזְמְזוֹת")
        ),
        makePast(
          markedForm("התמזמזתי", "הִתְמַזְמַזְתִּי"),
          markedForm("התמזמזת", "הִתְמַזְמַזְתָּ"),
          markedForm("התמזמזת", "הִתְמַזְמַזְתְּ"),
          markedForm("התמזמז", "הִתְמַזְמֵז"),
          markedForm("התמזמזה", "הִתְמַזְמְזָה"),
          markedForm("התמזמזנו", "הִתְמַזְמַזְנוּ"),
          markedForm("התמזמזתם", "הִתְמַזְמַזְתֶּם"),
          markedForm("התמזמזתן", "הִתְמַזְמַזְתֶּן"),
          markedForm("התמזמזו", "הִתְמַזְמְזוּ")
        ),
        makeFuture(
          markedForm("אתמזמז", "אֶתְמַזְמֵז"),
          markedForm("תתמזמז", "תִּתְמַזְמֵז"),
          markedForm("תתמזמזי", "תִּתְמַזְמְזִי"),
          markedForm("יתמזמז", "יִתְמַזְמֵז"),
          markedForm("תתמזמז", "תִּתְמַזְמֵז"),
          markedForm("נתמזמז", "נִתְמַזְמֵז"),
          markedForm("תתמזמזו", "תִּתְמַזְמְזוּ"),
          markedForm("יתמזמזו", "יִתְמַזְמְזוּ")
        )
      ),
      review_status: "approved",
      notes: "Reduplicated slang root מ-ז-מ-ז; the quadriliteral hitpa'el paradigm is template-derived, not dictionary-attested, the same status as מלרלר. No metathesis — the first radical is מ, and the ז radicals sit in positions two and four where it never applies. Takes עם.",
      difficulty_level: 3,
      tags: ["hitpael", "quadriliteral", "slang", "colloquial", "dating"],
      personal_priority: 66,
    }),
    createVerbEntry({
      id: "character-verb-lehitlabet",
      availability: getStarterVerbAvailability("character-verb-lehitlabet"),
      lemma: "להתלבט",
      lemma_niqqud: "לְהִתְלַבֵּט",
      root: ["ל", "ב", "ט"],
      binyan: "hitpael",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to go back and forth", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מתלבט", "מִתְלַבֵּט"),
          markedForm("מתלבטת", "מִתְלַבֶּטֶת"),
          markedForm("מתלבטים", "מִתְלַבְּטִים"),
          markedForm("מתלבטות", "מִתְלַבְּטוֹת")
        ),
        makePast(
          markedForm("התלבטתי", "הִתְלַבַּטְתִּי"),
          markedForm("התלבטת", "הִתְלַבַּטְתָּ"),
          markedForm("התלבטת", "הִתְלַבַּטְתְּ"),
          markedForm("התלבט", "הִתְלַבֵּט"),
          markedForm("התלבטה", "הִתְלַבְּטָה"),
          markedForm("התלבטנו", "הִתְלַבַּטְנוּ"),
          markedForm("התלבטתם", "הִתְלַבַּטְתֶּם"),
          markedForm("התלבטתן", "הִתְלַבַּטְתֶּן"),
          markedForm("התלבטו", "הִתְלַבְּטוּ")
        ),
        makeFuture(
          markedForm("אתלבט", "אֶתְלַבֵּט"),
          markedForm("תתלבט", "תִּתְלַבֵּט"),
          markedForm("תתלבטי", "תִּתְלַבְּטִי"),
          markedForm("יתלבט", "יִתְלַבֵּט"),
          markedForm("תתלבט", "תִּתְלַבֵּט"),
          markedForm("נתלבט", "נִתְלַבֵּט"),
          markedForm("תתלבטו", "תִּתְלַבְּטוּ"),
          markedForm("יתלבטו", "יִתְלַבְּטוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular hitpa'el of ל-ב-ט, pointed exactly like להתלבש apart from the third radical. Dictionary-attested. Describes weighing a decision rather than physical movement. No imperative — הִתְלַבֵּט does not work as a command.",
      difficulty_level: 3,
      tags: ["hitpael", "regular", "everyday"],
      personal_priority: 78,
    }),
    createVerbEntry({
      id: "character-verb-lignoach",
      availability: getStarterVerbAvailability("character-verb-lignoach"),
      lemma: "לגנוח",
      lemma_niqqud: "לִגְנוֹחַ",
      root: ["ג", "נ", "ח"],
      binyan: "paal",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to groan", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("גונח", "גּוֹנֵחַ"),
          markedForm("גונחת", "גּוֹנַחַת"),
          markedForm("גונחים", "גּוֹנְחִים"),
          markedForm("גונחות", "גּוֹנְחוֹת")
        ),
        makePast(
          markedForm("גנחתי", "גָּנַחְתִּי"),
          markedForm("גנחת", "גָּנַחְתָּ"),
          markedForm("גנחת", "גָּנַחְתְּ"),
          markedForm("גנח", "גָּנַח"),
          markedForm("גנחה", "גָּנְחָה"),
          markedForm("גנחנו", "גָּנַחְנוּ"),
          markedForm("גנחתם", "גְּנַחְתֶּם"),
          markedForm("גנחתן", "גְּנַחְתֶּן"),
          markedForm("גנחו", "גָּנְחוּ")
        ),
        makeFuture(
          markedForm("אגנח", "אֶגְנַח"),
          markedForm("תגנח", "תִּגְנַח"),
          markedForm("תגנחי", "תִּגְנְחִי"),
          markedForm("יגנח", "יִגְנַח"),
          markedForm("תגנח", "תִּגְנַח"),
          markedForm("נגנח", "נִגְנַח"),
          markedForm("תגנחו", "תִּגְנְחוּ"),
          markedForm("יגנחו", "יִגְנְחוּ")
        )
      ),
      review_status: "approved",
      notes: "Pa'al ל-guttural of ג-נ-ח, pointed exactly like לשלוח and לפתוח: patach under the final guttural in the infinitive (לִגְנוֹחַ), the present feminine singular (גּוֹנַחַת), and the future (אֶגְנַח, יִגְנַח). Covers a groan of pain, effort, or complaint. No imperative — commanding someone to groan is not idiomatic.",
      difficulty_level: 3,
      tags: ["paal", "irregular", "lamed-guttural", "body", "colloquial"],
      personal_priority: 70,
    }),
    createVerbEntry({
      id: "character-verb-lehagish",
      availability: getStarterVerbAvailability("character-verb-lehagish"),
      lemma: "להגיש",
      lemma_niqqud: "לְהַגִּישׁ",
      root: ["נ", "ג", "ש"],
      binyan: "hifil",
      regularity: "irregular",
      conjugation_mode: "curated",
      senses: [makeSense("to submit", "את־", false)],
      forms: makeForms(
        makePresent(
          markedForm("מגיש", "מַגִּישׁ"),
          markedForm("מגישה", "מַגִּישָׁה"),
          markedForm("מגישים", "מַגִּישִׁים"),
          markedForm("מגישות", "מַגִּישׁוֹת")
        ),
        makePast(
          markedForm("הגשתי", "הִגַּשְׁתִּי"),
          markedForm("הגשת", "הִגַּשְׁתָּ"),
          markedForm("הגשת", "הִגַּשְׁתְּ"),
          markedForm("הגיש", "הִגִּישׁ"),
          markedForm("הגישה", "הִגִּישָׁה"),
          markedForm("הגשנו", "הִגַּשְׁנוּ"),
          markedForm("הגשתם", "הִגַּשְׁתֶּם"),
          markedForm("הגשתן", "הִגַּשְׁתֶּן"),
          markedForm("הגישו", "הִגִּישׁוּ")
        ),
        makeFuture(
          markedForm("אגיש", "אַגִּישׁ"),
          markedForm("תגיש", "תַּגִּישׁ"),
          markedForm("תגישי", "תַּגִּישִׁי"),
          markedForm("יגיש", "יַגִּישׁ"),
          markedForm("תגיש", "תַּגִּישׁ"),
          markedForm("נגיש", "נַגִּישׁ"),
          markedForm("תגישו", "תַּגִּישׁוּ"),
          markedForm("יגישו", "יַגִּישׁוּ")
        ),
        makeImperative(
          markedForm("הגש", "הַגֵּשׁ"),
          markedForm("הגישי", "הַגִּישִׁי"),
          markedForm("הגישו", "הַגִּישׁוּ")
        )
      ),
      review_status: "approved",
      notes: "Hif'il pe-nun of נ-ג-ש: the nun assimilates into a dagesh throughout (הִגַּשְׁתִּי, הִגִּישׁ), exactly like להגיע and להגיד, but with plain non-guttural endings like להדליק. The stored gloss is the bureaucratic one — להגיש בקשה, טופס, מכרז, תלונה, התנגדות. The same verb also means 'to serve' food (להגיש ארוחה), which keeps its own dictionary card in cooking_verbs.",
      difficulty_level: 3,
      tags: ["hifil", "irregular", "pe-nun", "bureaucracy", "practical"],
      personal_priority: 76,
    }),
    createVerbEntry({
      id: "character-verb-liklot",
      availability: { translationQuiz: false, sentenceHints: true },
      lemma: "לקלוט",
      lemma_niqqud: "לִקְלוֹט",
      root: ["ק", "ל", "ט"],
      binyan: "paal",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [
        makeSense("to catch on", null, false),
        makeSense("to pick up (a signal)", null, false),
        makeSense("to take in (immigrants)", null, false),
      ],
      forms: makeForms(
        makePresent(
          markedForm("קולט", "קוֹלֵט"),
          markedForm("קולטת", "קוֹלֶטֶת"),
          markedForm("קולטים", "קוֹלְטִים"),
          markedForm("קולטות", "קוֹלְטוֹת")
        ),
        makePast(
          markedForm("קלטתי", "קָלַטְתִּי"),
          markedForm("קלטת", "קָלַטְתָּ"),
          markedForm("קלטת", "קָלַטְתְּ"),
          markedForm("קלט", "קָלַט"),
          markedForm("קלטה", "קָלְטָה"),
          markedForm("קלטנו", "קָלַטְנוּ"),
          markedForm("קלטתם", "קְלַטְתֶּם"),
          markedForm("קלטתן", "קְלַטְתֶּן"),
          markedForm("קלטו", "קָלְטוּ")
        ),
        makeFuture(
          markedForm("אקלוט", "אֶקְלוֹט"),
          markedForm("תקלוט", "תִּקְלוֹט"),
          markedForm("תקלטי", "תִּקְלְטִי"),
          markedForm("יקלוט", "יִקְלוֹט"),
          markedForm("תקלוט", "תִּקְלוֹט"),
          markedForm("נקלוט", "נִקְלוֹט"),
          markedForm("תקלטו", "תִּקְלְטוּ"),
          markedForm("יקלטו", "יִקְלְטוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular pa'al-o of the strong root ק-ל-ט, pointed exactly like לסגור. One paradigm, three senses that route to different companions: קלטתי is colloquial for 'I got it / it clicked'; קולט means picking up a signal or reception; קליטת עלייה is the absorption of new immigrants. Kept out of Translation Match because all three senses share the surface לקלוט and would collide on the matching board — the sense split is taught in conjugation instead. See also להקליט, the hif'il of the same root.",
      difficulty_level: 3,
      tags: ["paal", "regular", "shlemim", "multi-sense", "practical"],
      personal_priority: 74,
    }),
    createVerbEntry({
      id: "character-verb-lehaklit",
      availability: getStarterVerbAvailability("character-verb-lehaklit"),
      lemma: "להקליט",
      lemma_niqqud: "לְהַקְלִיט",
      root: ["ק", "ל", "ט"],
      binyan: "hifil",
      regularity: "regular",
      conjugation_mode: "curated",
      senses: [makeSense("to record", null, false)],
      forms: makeForms(
        makePresent(
          markedForm("מקליט", "מַקְלִיט"),
          markedForm("מקליטה", "מַקְלִיטָה"),
          markedForm("מקליטים", "מַקְלִיטִים"),
          markedForm("מקליטות", "מַקְלִיטוֹת")
        ),
        makePast(
          markedForm("הקלטתי", "הִקְלַטְתִּי"),
          markedForm("הקלטת", "הִקְלַטְתָּ"),
          markedForm("הקלטת", "הִקְלַטְתְּ"),
          markedForm("הקליט", "הִקְלִיט"),
          markedForm("הקליטה", "הִקְלִיטָה"),
          markedForm("הקלטנו", "הִקְלַטְנוּ"),
          markedForm("הקלטתם", "הִקְלַטְתֶּם"),
          markedForm("הקלטתן", "הִקְלַטְתֶּן"),
          markedForm("הקליטו", "הִקְלִיטוּ")
        ),
        makeFuture(
          markedForm("אקליט", "אַקְלִיט"),
          markedForm("תקליט", "תַּקְלִיט"),
          markedForm("תקליטי", "תַּקְלִיטִי"),
          markedForm("יקליט", "יַקְלִיט"),
          markedForm("תקליט", "תַּקְלִיט"),
          markedForm("נקליט", "נַקְלִיט"),
          markedForm("תקליטו", "תַּקְלִיטוּ"),
          markedForm("יקליטו", "יַקְלִיטוּ")
        ),
        makeImperative(
          markedForm("הקלט", "הַקְלֵט"),
          markedForm("הקליטי", "הַקְלִיטִי"),
          markedForm("הקליטו", "הַקְלִיטוּ")
        )
      ),
      review_status: "approved",
      notes: "Regular hif'il of ק-ל-ט, pointed exactly like להדליק. The causative partner of לקלוט: קלט takes something in, הקליט commits it to a recording. Covers recording audio, video, a meeting, or an oral-history interview. Related nouns from the same root: הקלטה, תקליט, קלטת, מקלט.",
      difficulty_level: 3,
      tags: ["hifil", "regular", "media", "practical"],
      personal_priority: 74,
    }),
  ];
}

function buildRequestedVerbEntries() {
  const batch = [
    {
      id: "advanced-verb-leadken", lemma: "לעדכן", lemma_niqqud: "לְעַדְכֵּן", root: ["ע", "ד", "כ", "נ"], binyan: "piel", regularity: "regular", gloss: "to update", difficulty_level: 3,
      present: [["מעדכן", "מְעַדְכֵּן"], ["מעדכנת", "מְעַדְכֶּנֶת"], ["מעדכנים", "מְעַדְכְּנִים"], ["מעדכנות", "מְעַדְכְּנוֹת"]],
      past: [["עדכנתי", "עִדְכַּנְתִּי"], ["עדכנת", "עִדְכַּנְתָּ"], ["עדכנת", "עִדְכַּנְתְּ"], ["עדכן", "עִדְכֵּן"], ["עדכנה", "עִדְכְּנָה"], ["עדכנו", "עִדְכַּנּוּ"], ["עדכנתם", "עִדְכַּנְתֶּם"], ["עדכנתן", "עִדְכַּנְתֶּן"], ["עדכנו", "עִדְכְּנוּ"]],
      future: [["אעדכן", "אֲעַדְכֵּן"], ["תעדכן", "תְּעַדְכֵּן"], ["תעדכני", "תְּעַדְכְּנִי"], ["יעדכן", "יְעַדְכֵּן"], ["תעדכן", "תְּעַדְכֵּן"], ["נעדכן", "נְעַדְכֵּן"], ["תעדכנו", "תְּעַדְכְּנוּ"], ["יעדכנו", "יְעַדְכְּנוּ"]],
    },
    {
      id: "advanced-verb-levater", lemma: "לוותר", lemma_niqqud: "לְוַתֵּר", root: ["ו", "ת", "ר"], binyan: "piel", regularity: "regular", gloss: "to give up", difficulty_level: 3,
      present: [["מוותר", "מְוַתֵּר"], ["מוותרת", "מְוַתֶּרֶת"], ["מוותרים", "מְוַתְּרִים"], ["מוותרות", "מְוַתְּרוֹת"]],
      past: [["ויתרתי", "וִתַּרְתִּי"], ["ויתרת", "וִתַּרְתָּ"], ["ויתרת", "וִתַּרְתְּ"], ["ויתר", "וִתֵּר"], ["ויתרה", "וִתְּרָה"], ["ויתרנו", "וִתַּרְנוּ"], ["ויתרתם", "וִתַּרְתֶּם"], ["ויתרתן", "וִתַּרְתֶּן"], ["ויתרו", "וִתְּרוּ"]],
      future: [["אוותר", "אֲוַתֵּר"], ["תוותר", "תְּוַתֵּר"], ["תוותרי", "תְּוַתְּרִי"], ["יוותר", "יְוַתֵּר"], ["תוותר", "תְּוַתֵּר"], ["נוותר", "נְוַתֵּר"], ["תוותרו", "תְּוַתְּרוּ"], ["יוותרו", "יְוַתְּרוּ"]],
    },
    {
      id: "advanced-verb-leasher", lemma: "לאשר", lemma_niqqud: "לְאַשֵּׁר", root: ["א", "ש", "ר"], binyan: "piel", regularity: "irregular", gloss: "to approve", difficulty_level: 3,
      present: [["מאשר", "מְאַשֵּׁר"], ["מאשרת", "מְאַשֶּׁרֶת"], ["מאשרים", "מְאַשְּׁרִים"], ["מאשרות", "מְאַשְּׁרוֹת"]],
      past: [["אישרתי", "אִשַּׁרְתִּי"], ["אישרת", "אִשַּׁרְתָּ"], ["אישרת", "אִשַּׁרְתְּ"], ["אישר", "אִשֵּׁר"], ["אישרה", "אִשְּׁרָה"], ["אישרנו", "אִשַּׁרְנוּ"], ["אישרתם", "אִשַּׁרְתֶּם"], ["אישרתן", "אִשַּׁרְתֶּן"], ["אישרו", "אִשְּׁרוּ"]],
      future: [["אאשר", "אֲאַשֵּׁר"], ["תאשר", "תְּאַשֵּׁר"], ["תאשרי", "תְּאַשְּׁרִי"], ["יאשר", "יְאַשֵּׁר"], ["תאשר", "תְּאַשֵּׁר"], ["נאשר", "נְאַשֵּׁר"], ["תאשרו", "תְּאַשְּׁרוּ"], ["יאשרו", "יְאַשְּׁרוּ"]],
    },
    {
      id: "advanced-verb-levatel", lemma: "לבטל", lemma_niqqud: "לְבַטֵּל", root: ["ב", "ט", "ל"], binyan: "piel", regularity: "regular", gloss: "to cancel", difficulty_level: 2,
      present: [["מבטל", "מְבַטֵּל"], ["מבטלת", "מְבַטֶּלֶת"], ["מבטלים", "מְבַטְּלִים"], ["מבטלות", "מְבַטְּלוֹת"]],
      past: [["ביטלתי", "בִּטַּלְתִּי"], ["ביטלת", "בִּטַּלְתָּ"], ["ביטלת", "בִּטַּלְתְּ"], ["ביטל", "בִּטֵּל"], ["ביטלה", "בִּטְּלָה"], ["ביטלנו", "בִּטַּלְנוּ"], ["ביטלתם", "בִּטַּלְתֶּם"], ["ביטלתן", "בִּטַּלְתֶּן"], ["ביטלו", "בִּטְּלוּ"]],
      future: [["אבטל", "אֲבַטֵּל"], ["תבטל", "תְּבַטֵּל"], ["תבטלי", "תְּבַטְּלִי"], ["יבטל", "יְבַטֵּל"], ["תבטל", "תְּבַטֵּל"], ["נבטל", "נְבַטֵּל"], ["תבטלו", "תְּבַטְּלוּ"], ["יבטלו", "יְבַטְּלוּ"]],
    },
    {
      id: "advanced-verb-letzaref", lemma: "לצרף", lemma_niqqud: "לְצָרֵף", root: ["צ", "ר", "פ"], binyan: "piel", regularity: "irregular", gloss: "to attach", difficulty_level: 3,
      present: [["מצרף", "מְצָרֵף"], ["מצרפת", "מְצָרֶפֶת"], ["מצרפים", "מְצָרְפִים"], ["מצרפות", "מְצָרְפוֹת"]],
      past: [["צירפתי", "צֵרַפְתִּי"], ["צירפת", "צֵרַפְתָּ"], ["צירפת", "צֵרַפְתְּ"], ["צירף", "צֵרֵף"], ["צירפה", "צֵרְפָה"], ["צירפנו", "צֵרַפְנוּ"], ["צירפתם", "צֵרַפְתֶּם"], ["צירפתן", "צֵרַפְתֶּן"], ["צירפו", "צֵרְפוּ"]],
      future: [["אצרף", "אֲצָרֵף"], ["תצרף", "תְּצָרֵף"], ["תצרפי", "תְּצָרְפִי"], ["יצרף", "יְצָרֵף"], ["תצרף", "תְּצָרֵף"], ["נצרף", "נְצָרֵף"], ["תצרפו", "תְּצָרְפוּ"], ["יצרפו", "יְצָרְפוּ"]],
    },
    {
      id: "advanced-verb-levarer", lemma: "לברר", lemma_niqqud: "לְבָרֵר", root: ["ב", "ר", "ר"], binyan: "piel", regularity: "irregular", gloss: "to find out", difficulty_level: 3,
      present: [["מברר", "מְבָרֵר"], ["מבררת", "מְבָרֶרֶת"], ["מבררים", "מְבָרְרִים"], ["מבררות", "מְבָרְרוֹת"]],
      past: [["ביררתי", "בֵּרַרְתִּי"], ["ביררת", "בֵּרַרְתָּ"], ["ביררת", "בֵּרַרְתְּ"], ["בירר", "בֵּרֵר"], ["ביררה", "בֵּרְרָה"], ["ביררנו", "בֵּרַרְנוּ"], ["ביררתם", "בֵּרַרְתֶּם"], ["ביררתן", "בֵּרַרְתֶּן"], ["ביררו", "בֵּרְרוּ"]],
      future: [["אברר", "אֲבָרֵר"], ["תברר", "תְּבָרֵר"], ["תבררי", "תְּבָרְרִי"], ["יברר", "יְבָרֵר"], ["תברר", "תְּבָרֵר"], ["נברר", "נְבָרֵר"], ["תבררו", "תְּבָרְרוּ"], ["יבררו", "יְבָרְרוּ"]],
    },
    {
      id: "advanced-verb-lehaskim", lemma: "להסכים", lemma_niqqud: "לְהַסְכִּים", root: ["ס", "כ", "מ"], binyan: "hifil", regularity: "regular", gloss: "to agree", difficulty_level: 2,
      present: [["מסכים", "מַסְכִּים"], ["מסכימה", "מַסְכִּימָה"], ["מסכימים", "מַסְכִּימִים"], ["מסכימות", "מַסְכִּימוֹת"]],
      past: [["הסכמתי", "הִסְכַּמְתִּי"], ["הסכמת", "הִסְכַּמְתָּ"], ["הסכמת", "הִסְכַּמְתְּ"], ["הסכים", "הִסְכִּים"], ["הסכימה", "הִסְכִּימָה"], ["הסכמנו", "הִסְכַּמְנוּ"], ["הסכמתם", "הִסְכַּמְתֶּם"], ["הסכמתן", "הִסְכַּמְתֶּן"], ["הסכימו", "הִסְכִּימוּ"]],
      future: [["אסכים", "אַסְכִּים"], ["תסכים", "תַּסְכִּים"], ["תסכימי", "תַּסְכִּימִי"], ["יסכים", "יַסְכִּים"], ["תסכים", "תַּסְכִּים"], ["נסכים", "נַסְכִּים"], ["תסכימו", "תַּסְכִּימוּ"], ["יסכימו", "יַסְכִּימוּ"]],
    },
    {
      id: "advanced-verb-lehaspik", lemma: "להספיק", lemma_niqqud: "לְהַסְפִּיק", root: ["ס", "פ", "ק"], binyan: "hifil", regularity: "regular", gloss: "to manage in time", difficulty_level: 3,
      present: [["מספיק", "מַסְפִּיק"], ["מספיקה", "מַסְפִּיקָה"], ["מספיקים", "מַסְפִּיקִים"], ["מספיקות", "מַסְפִּיקוֹת"]],
      past: [["הספקתי", "הִסְפַּקְתִּי"], ["הספקת", "הִסְפַּקְתָּ"], ["הספקת", "הִסְפַּקְתְּ"], ["הספיק", "הִסְפִּיק"], ["הספיקה", "הִסְפִּיקָה"], ["הספקנו", "הִסְפַּקְנוּ"], ["הספקתם", "הִסְפַּקְתֶּם"], ["הספקתן", "הִסְפַּקְתֶּן"], ["הספיקו", "הִסְפִּיקוּ"]],
      future: [["אספיק", "אַסְפִּיק"], ["תספיק", "תַּסְפִּיק"], ["תספיקי", "תַּסְפִּיקִי"], ["יספיק", "יַסְפִּיק"], ["תספיק", "תַּסְפִּיק"], ["נספיק", "נַסְפִּיק"], ["תספיקו", "תַּסְפִּיקוּ"], ["יספיקו", "יַסְפִּיקוּ"]],
    },
    {
      id: "advanced-verb-lehazkir", lemma: "להזכיר", lemma_niqqud: "לְהַזְכִּיר", root: ["ז", "כ", "ר"], binyan: "hifil", regularity: "regular", gloss: "to remind", difficulty_level: 3,
      present: [["מזכיר", "מַזְכִּיר"], ["מזכירה", "מַזְכִּירָה"], ["מזכירים", "מַזְכִּירִים"], ["מזכירות", "מַזְכִּירוֹת"]],
      past: [["הזכרתי", "הִזְכַּרְתִּי"], ["הזכרת", "הִזְכַּרְתָּ"], ["הזכרת", "הִזְכַּרְתְּ"], ["הזכיר", "הִזְכִּיר"], ["הזכירה", "הִזְכִּירָה"], ["הזכרנו", "הִזְכַּרְנוּ"], ["הזכרתם", "הִזְכַּרְתֶּם"], ["הזכרתן", "הִזְכַּרְתֶּן"], ["הזכירו", "הִזְכִּירוּ"]],
      future: [["אזכיר", "אַזְכִּיר"], ["תזכיר", "תַּזְכִּיר"], ["תזכירי", "תַּזְכִּירִי"], ["יזכיר", "יַזְכִּיר"], ["תזכיר", "תַּזְכִּיר"], ["נזכיר", "נַזְכִּיר"], ["תזכירו", "תַּזְכִּירוּ"], ["יזכירו", "יַזְכִּירוּ"]],
    },
    {
      id: "advanced-verb-lehamlitz", lemma: "להמליץ", lemma_niqqud: "לְהַמְלִיץ", root: ["מ", "ל", "צ"], binyan: "hifil", regularity: "regular", gloss: "to recommend", difficulty_level: 3,
      present: [["ממליץ", "מַמְלִיץ"], ["ממליצה", "מַמְלִיצָה"], ["ממליצים", "מַמְלִיצִים"], ["ממליצות", "מַמְלִיצוֹת"]],
      past: [["המלצתי", "הִמְלַצְתִּי"], ["המלצת", "הִמְלַצְתָּ"], ["המלצת", "הִמְלַצְתְּ"], ["המליץ", "הִמְלִיץ"], ["המליצה", "הִמְלִיצָה"], ["המלצנו", "הִמְלַצְנוּ"], ["המלצתם", "הִמְלַצְתֶּם"], ["המלצתן", "הִמְלַצְתֶּן"], ["המליצו", "הִמְלִיצוּ"]],
      future: [["אמליץ", "אַמְלִיץ"], ["תמליץ", "תַּמְלִיץ"], ["תמליצי", "תַּמְלִיצִי"], ["ימליץ", "יַמְלִיץ"], ["תמליץ", "תַּמְלִיץ"], ["נמליץ", "נַמְלִיץ"], ["תמליצו", "תַּמְלִיצוּ"], ["ימליצו", "יַמְלִיצוּ"]],
    },
    {
      id: "advanced-verb-lehashpia", lemma: "להשפיע", lemma_niqqud: "לְהַשְׁפִּיעַ", root: ["ש", "פ", "ע"], binyan: "hifil", regularity: "irregular", gloss: "to affect", difficulty_level: 4,
      present: [["משפיע", "מַשְׁפִּיעַ"], ["משפיעה", "מַשְׁפִּיעָה"], ["משפיעים", "מַשְׁפִּיעִים"], ["משפיעות", "מַשְׁפִּיעוֹת"]],
      past: [["השפעתי", "הִשְׁפַּעְתִּי"], ["השפעת", "הִשְׁפַּעְתָּ"], ["השפעת", "הִשְׁפַּעְתְּ"], ["השפיע", "הִשְׁפִּיעַ"], ["השפיעה", "הִשְׁפִּיעָה"], ["השפענו", "הִשְׁפַּעְנוּ"], ["השפעתם", "הִשְׁפַּעְתֶּם"], ["השפעתן", "הִשְׁפַּעְתֶּן"], ["השפיעו", "הִשְׁפִּיעוּ"]],
      future: [["אשפיע", "אַשְׁפִּיעַ"], ["תשפיע", "תַּשְׁפִּיעַ"], ["תשפיעי", "תַּשְׁפִּיעִי"], ["ישפיע", "יַשְׁפִּיעַ"], ["תשפיע", "תַּשְׁפִּיעַ"], ["נשפיע", "נַשְׁפִּיעַ"], ["תשפיעו", "תַּשְׁפִּיעוּ"], ["ישפיעו", "יַשְׁפִּיעוּ"]],
    },
    {
      id: "advanced-verb-lehavhir", lemma: "להבהיר", lemma_niqqud: "לְהַבְהִיר", root: ["ב", "ה", "ר"], binyan: "hifil", regularity: "irregular", gloss: "to clarify", difficulty_level: 3,
      present: [["מבהיר", "מַבְהִיר"], ["מבהירה", "מַבְהִירָה"], ["מבהירים", "מַבְהִירִים"], ["מבהירות", "מַבְהִירוֹת"]],
      past: [["הבהרתי", "הִבְהַרְתִּי"], ["הבהרת", "הִבְהַרְתָּ"], ["הבהרת", "הִבְהַרְתְּ"], ["הבהיר", "הִבְהִיר"], ["הבהירה", "הִבְהִירָה"], ["הבהרנו", "הִבְהַרְנוּ"], ["הבהרתם", "הִבְהַרְתֶּם"], ["הבהרתן", "הִבְהַרְתֶּן"], ["הבהירו", "הִבְהִירוּ"]],
      future: [["אבהיר", "אַבְהִיר"], ["תבהיר", "תַּבְהִיר"], ["תבהירי", "תַּבְהִירִי"], ["יבהיר", "יַבְהִיר"], ["תבהיר", "תַּבְהִיר"], ["נבהיר", "נַבְהִיר"], ["תבהירו", "תַּבְהִירוּ"], ["יבהירו", "יַבְהִירוּ"]],
    },
    {
      id: "advanced-verb-laharos", lemma: "להרוס", lemma_niqqud: "לַהֲרוֹס", root: ["ה", "ר", "ס"], binyan: "paal", regularity: "irregular", gloss: "to destroy", difficulty_level: 2,
      present: [["הורס", "הוֹרֵס"], ["הורסת", "הוֹרֶסֶת"], ["הורסים", "הוֹרְסִים"], ["הורסות", "הוֹרְסוֹת"]],
      past: [["הרסתי", "הָרַסְתִּי"], ["הרסת", "הָרַסְתָּ"], ["הרסת", "הָרַסְתְּ"], ["הרס", "הָרַס"], ["הרסה", "הָרְסָה"], ["הרסנו", "הָרַסְנוּ"], ["הרסתם", "הֲרַסְתֶּם"], ["הרסתן", "הֲרַסְתֶּן"], ["הרסו", "הָרְסוּ"]],
      future: [["אהרוס", "אֶהֱרוֹס"], ["תהרוס", "תַּהֲרוֹס"], ["תהרסי", "תַּהַרְסִי"], ["יהרוס", "יַהֲרוֹס"], ["תהרוס", "תַּהֲרוֹס"], ["נהרוס", "נַהֲרוֹס"], ["תהרסו", "תַּהַרְסוּ"], ["יהרסו", "יַהַרְסוּ"]],
    },
    {
      id: "advanced-verb-lelarler", lemma: "ללרלר", lemma_niqqud: "לְלַרְלֵר", root: ["ל", "ר", "ל", "ר"], binyan: "piel", regularity: "regular", gloss: "to chatter nonstop", difficulty_level: 3,
      present: [["מלרלר", "מְלַרְלֵר"], ["מלרלרת", "מְלַרְלֶרֶת"], ["מלרלרים", "מְלַרְלְרִים"], ["מלרלרות", "מְלַרְלְרוֹת"]],
      past: [["לרלרתי", "לִרְלַרְתִּי"], ["לרלרת", "לִרְלַרְתָּ"], ["לרלרת", "לִרְלַרְתְּ"], ["לרלר", "לִרְלֵר"], ["לרלרה", "לִרְלְרָה"], ["לרלרנו", "לִרְלַרְנוּ"], ["לרלרתם", "לִרְלַרְתֶּם"], ["לרלרתן", "לִרְלַרְתֶּן"], ["לרלרו", "לִרְלְרוּ"]],
      future: [["אלרלר", "אֲלַרְלֵר"], ["תלרלר", "תְּלַרְלֵר"], ["תלרלרי", "תְּלַרְלְרִי"], ["ילרלר", "יְלַרְלֵר"], ["תלרלר", "תְּלַרְלֵר"], ["נלרלר", "נְלַרְלֵר"], ["תלרלרו", "תְּלַרְלְרוּ"], ["ילרלרו", "יְלַרְלְרוּ"]],
    },
    {
      id: "character-verb-levarech", lemma: "לברך", lemma_niqqud: "לְבָרֵךְ", root: ["ב", "ר", "כ"], binyan: "piel", regularity: "irregular", gloss: "to bless", difficulty_level: 3,
      present: [["מברך", "מְבָרֵךְ"], ["מברכת", "מְבָרֶכֶת"], ["מברכים", "מְבָרְכִים"], ["מברכות", "מְבָרְכוֹת"]],
      past: [["בירכתי", "בֵּרַכְתִּי"], ["בירכת", "בֵּרַכְתָּ"], ["בירכת", "בֵּרַכְתְּ"], ["בירך", "בֵּרֵךְ"], ["בירכה", "בֵּרְכָה"], ["בירכנו", "בֵּרַכְנוּ"], ["בירכתם", "בֵּרַכְתֶּם"], ["בירכתן", "בֵּרַכְתֶּן"], ["בירכו", "בֵּרְכוּ"]],
      future: [["אברך", "אֲבָרֵךְ"], ["תברך", "תְּבָרֵךְ"], ["תברכי", "תְּבָרְכִי"], ["יברך", "יְבָרֵךְ"], ["תברך", "תְּבָרֵךְ"], ["נברך", "נְבָרֵךְ"], ["תברכו", "תְּבָרְכוּ"], ["יברכו", "יְבָרְכוּ"]],
    },
    {
      id: "character-verb-lehitpalel", lemma: "להתפלל", lemma_niqqud: "לְהִתְפַּלֵּל", root: ["פ", "ל", "ל"], binyan: "hitpael", regularity: "regular", gloss: "to pray", difficulty_level: 3,
      present: [["מתפלל", "מִתְפַּלֵּל"], ["מתפללת", "מִתְפַּלֶּלֶת"], ["מתפללים", "מִתְפַּלְּלִים"], ["מתפללות", "מִתְפַּלְּלוֹת"]],
      past: [["התפללתי", "הִתְפַּלַּלְתִּי"], ["התפללת", "הִתְפַּלַּלְתָּ"], ["התפללת", "הִתְפַּלַּלְתְּ"], ["התפלל", "הִתְפַּלֵּל"], ["התפללה", "הִתְפַּלְּלָה"], ["התפללנו", "הִתְפַּלַּלְנוּ"], ["התפללתם", "הִתְפַּלַּלְתֶּם"], ["התפללתן", "הִתְפַּלַּלְתֶּן"], ["התפללו", "הִתְפַּלְּלוּ"]],
      future: [["אתפלל", "אֶתְפַּלֵּל"], ["תתפלל", "תִּתְפַּלֵּל"], ["תתפללי", "תִּתְפַּלְּלִי"], ["יתפלל", "יִתְפַּלֵּל"], ["תתפלל", "תִּתְפַּלֵּל"], ["נתפלל", "נִתְפַּלֵּל"], ["תתפללו", "תִּתְפַּלְּלוּ"], ["יתפללו", "יִתְפַּלְּלוּ"]],
    },
    {
      id: "character-verb-lefaresh", lemma: "לפרש", lemma_niqqud: "לְפָרֵשׁ", root: ["פ", "ר", "ש"], binyan: "piel", regularity: "irregular", gloss: "to interpret", difficulty_level: 3,
      present: [["מפרש", "מְפָרֵשׁ"], ["מפרשת", "מְפָרֶשֶׁת"], ["מפרשים", "מְפָרְשִׁים"], ["מפרשות", "מְפָרְשׁוֹת"]],
      past: [["פירשתי", "פֵּרַשְׁתִּי"], ["פירשת", "פֵּרַשְׁתָּ"], ["פירשת", "פֵּרַשְׁתְּ"], ["פירש", "פֵּרֵשׁ"], ["פירשה", "פֵּרְשָׁה"], ["פירשנו", "פֵּרַשְׁנוּ"], ["פירשתם", "פֵּרַשְׁתֶּם"], ["פירשתן", "פֵּרַשְׁתֶּן"], ["פירשו", "פֵּרְשׁוּ"]],
      future: [["אפרש", "אֲפָרֵשׁ"], ["תפרש", "תְּפָרֵשׁ"], ["תפרשי", "תְּפָרְשִׁי"], ["יפרש", "יְפָרֵשׁ"], ["תפרש", "תְּפָרֵשׁ"], ["נפרש", "נְפָרֵשׁ"], ["תפרשו", "תְּפָרְשׁוּ"], ["יפרשו", "יְפָרְשׁוּ"]],
    },
    {
      id: "character-verb-limchot", lemma: "למחות", lemma_niqqud: "לִמְחוֹת", root: ["מ", "ח", "ה"], binyan: "paal", regularity: "irregular", gloss: "to protest", difficulty_level: 4,
      present: [["מוחה", "מוֹחֶה"], ["מוחה", "מוֹחָה"], ["מוחים", "מוֹחִים"], ["מוחות", "מוֹחוֹת"]],
      past: [["מחיתי", "מָחִיתִי"], ["מחית", "מָחִיתָ"], ["מחית", "מָחִית"], ["מחה", "מָחָה"], ["מחתה", "מָחֲתָה"], ["מחינו", "מָחִינוּ"], ["מחיתם", "מְחִיתֶם"], ["מחיתן", "מְחִיתֶן"], ["מחו", "מָחוּ"]],
      future: [["אמחה", "אֶמְחֶה"], ["תמחה", "תִּמְחֶה"], ["תמחי", "תִּמְחִי"], ["ימחה", "יִמְחֶה"], ["תמחה", "תִּמְחֶה"], ["נמחה", "נִמְחֶה"], ["תמחו", "תִּמְחוּ"], ["ימחו", "יִמְחוּ"]],
    },
    {
      id: "character-verb-lehaamin", lemma: "להאמין", lemma_niqqud: "לְהַאֲמִין", root: ["א", "מ", "נ"], binyan: "hifil", regularity: "irregular", gloss: "to believe", difficulty_level: 2,
      present: [["מאמין", "מַאֲמִין"], ["מאמינה", "מַאֲמִינָה"], ["מאמינים", "מַאֲמִינִים"], ["מאמינות", "מַאֲמִינוֹת"]],
      past: [["האמנתי", "הֶאֱמַנְתִּי"], ["האמנת", "הֶאֱמַנְתָּ"], ["האמנת", "הֶאֱמַנְתְּ"], ["האמין", "הֶאֱמִין"], ["האמינה", "הֶאֱמִינָה"], ["האמנו", "הֶאֱמַנּוּ"], ["האמנתם", "הֶאֱמַנְתֶּם"], ["האמנתן", "הֶאֱמַנְתֶּן"], ["האמינו", "הֶאֱמִינוּ"]],
      future: [["אאמין", "אַאֲמִין"], ["תאמין", "תַּאֲמִין"], ["תאמיני", "תַּאֲמִינִי"], ["יאמין", "יַאֲמִין"], ["תאמין", "תַּאֲמִין"], ["נאמין", "נַאֲמִין"], ["תאמינו", "תַּאֲמִינוּ"], ["יאמינו", "יַאֲמִינוּ"]],
    },
    {
      id: "character-verb-latzum", lemma: "לצום", lemma_niqqud: "לָצוּם", root: ["צ", "ו", "מ"], binyan: "paal", regularity: "irregular", gloss: "to fast", difficulty_level: 2,
      present: [["צם", "צָם"], ["צמה", "צָמָה"], ["צמים", "צָמִים"], ["צמות", "צָמוֹת"]],
      past: [["צמתי", "צַמְתִּי"], ["צמת", "צַמְתָּ"], ["צמת", "צַמְתְּ"], ["צם", "צָם"], ["צמה", "צָמָה"], ["צמנו", "צַמְנוּ"], ["צמתם", "צַמְתֶּם"], ["צמתן", "צַמְתֶּן"], ["צמו", "צָמוּ"]],
      future: [["אצום", "אָצוּם"], ["תצום", "תָּצוּם"], ["תצומי", "תָּצוּמִי"], ["יצום", "יָצוּם"], ["תצום", "תָּצוּם"], ["נצום", "נָצוּם"], ["תצומו", "תָּצוּמוּ"], ["יצומו", "יָצוּמוּ"]],
    },
    {
      id: "character-verb-lekadesh", lemma: "לקדש", lemma_niqqud: "לְקַדֵּשׁ", root: ["ק", "ד", "ש"], binyan: "piel", regularity: "regular", gloss: "to sanctify", difficulty_level: 3,
      present: [["מקדש", "מְקַדֵּשׁ"], ["מקדשת", "מְקַדֶּשֶׁת"], ["מקדשים", "מְקַדְּשִׁים"], ["מקדשות", "מְקַדְּשׁוֹת"]],
      past: [["קידשתי", "קִידַּשְׁתִּי"], ["קידשת", "קִידַּשְׁתָּ"], ["קידשת", "קִידַּשְׁתְּ"], ["קידש", "קִידֵּשׁ"], ["קידשה", "קִידְּשָׁה"], ["קידשנו", "קִידַּשְׁנוּ"], ["קידשתם", "קִידַּשְׁתֶּם"], ["קידשתן", "קִידַּשְׁתֶּן"], ["קידשו", "קִידְּשׁוּ"]],
      future: [["אקדש", "אֲקַדֵּשׁ"], ["תקדש", "תְּקַדֵּשׁ"], ["תקדשי", "תְּקַדְּשִׁי"], ["יקדש", "יְקַדֵּשׁ"], ["תקדש", "תְּקַדֵּשׁ"], ["נקדש", "נְקַדֵּשׁ"], ["תקדשו", "תְּקַדְּשׁוּ"], ["יקדשו", "יְקַדְּשׁוּ"]],
    },
    {
      id: "character-verb-litbol", lemma: "לטבול", lemma_niqqud: "לִטְבּוֹל", root: ["ט", "ב", "ל"], binyan: "paal", regularity: "regular", gloss: "to immerse", difficulty_level: 3,
      present: [["טובל", "טוֹבֵל"], ["טובלת", "טוֹבֶלֶת"], ["טובלים", "טוֹבְלִים"], ["טובלות", "טוֹבְלוֹת"]],
      past: [["טבלתי", "טָבַלְתִּי"], ["טבלת", "טָבַלְתָּ"], ["טבלת", "טָבַלְתְּ"], ["טבל", "טָבַל"], ["טבלה", "טָבְלָה"], ["טבלנו", "טָבַלְנוּ"], ["טבלתם", "טְבַלְתֶּם"], ["טבלתן", "טְבַלְתֶּן"], ["טבלו", "טָבְלוּ"]],
      future: [["אטבול", "אֶטְבּוֹל"], ["תטבול", "תִּטְבּוֹל"], ["תטבלי", "תִּטְבְּלִי"], ["יטבול", "יִטְבּוֹל"], ["תטבול", "תִּטְבּוֹל"], ["נטבול", "נִטְבּוֹל"], ["תטבלו", "תִּטְבְּלוּ"], ["יטבלו", "יִטְבְּלוּ"]],
    },
    {
      id: "character-verb-lekalel", lemma: "לקלל", lemma_niqqud: "לְקַלֵּל", root: ["ק", "ל", "ל"], binyan: "piel", regularity: "regular", gloss: "to curse", difficulty_level: 3,
      present: [["מקלל", "מְקַלֵּל"], ["מקללת", "מְקַלֶּלֶת"], ["מקללים", "מְקַלְּלִים"], ["מקללות", "מְקַלְּלוֹת"]],
      past: [["קיללתי", "קִילַּלְתִּי"], ["קיללת", "קִילַּלְתָּ"], ["קיללת", "קִילַּלְתְּ"], ["קילל", "קִילֵּל"], ["קיללה", "קִילְּלָה"], ["קיללנו", "קִילַּלְנוּ"], ["קיללתם", "קִילַּלְתֶּם"], ["קיללתן", "קִילַּלְתֶּן"], ["קיללו", "קִילְּלוּ"]],
      future: [["אקלל", "אֲקַלֵּל"], ["תקלל", "תְּקַלֵּל"], ["תקללי", "תְּקַלְּלִי"], ["יקלל", "יְקַלֵּל"], ["תקלל", "תְּקַלֵּל"], ["נקלל", "נְקַלֵּל"], ["תקללו", "תְּקַלְּלוּ"], ["יקללו", "יְקַלְּלוּ"]],
    },
    {
      id: "character-verb-lenachesh", lemma: "לנחש", lemma_niqqud: "לְנַחֵשׁ", root: ["נ", "ח", "ש"], binyan: "piel", regularity: "regular", gloss: "to guess", difficulty_level: 2,
      present: [["מנחש", "מְנַחֵשׁ"], ["מנחשת", "מְנַחֶשֶׁת"], ["מנחשים", "מְנַחְשִׁים"], ["מנחשות", "מְנַחְשׁוֹת"]],
      past: [["ניחשתי", "נִיחַשְׁתִּי"], ["ניחשת", "נִיחַשְׁתָּ"], ["ניחשת", "נִיחַשְׁתְּ"], ["ניחש", "נִיחֵשׁ"], ["ניחשה", "נִיחְשָׁה"], ["ניחשנו", "נִיחַשְׁנוּ"], ["ניחשתם", "נִיחַשְׁתֶּם"], ["ניחשתן", "נִיחַשְׁתֶּן"], ["ניחשו", "נִיחְשׁוּ"]],
      future: [["אנחש", "אֲנַחֵשׁ"], ["תנחש", "תְּנַחֵשׁ"], ["תנחשי", "תְּנַחְשִׁי"], ["ינחש", "יְנַחֵשׁ"], ["תנחש", "תְּנַחֵשׁ"], ["ננחש", "נְנַחֵשׁ"], ["תנחשו", "תְּנַחְשׁוּ"], ["ינחשו", "יְנַחְשׁוּ"]],
    },
    {
      id: "character-verb-lehashbia", lemma: "להשביע", lemma_niqqud: "לְהַשְׁבִּיעַ", root: ["ש", "ב", "ע"], binyan: "hifil", regularity: "regular", gloss: "to adjure", difficulty_level: 4,
      present: [["משביע", "מַשְׁבִּיעַ"], ["משביעה", "מַשְׁבִּיעָה"], ["משביעים", "מַשְׁבִּיעִים"], ["משביעות", "מַשְׁבִּיעוֹת"]],
      past: [["השבעתי", "הִשְׁבַּעְתִּי"], ["השבעת", "הִשְׁבַּעְתָּ"], ["השבעת", "הִשְׁבַּעְתְּ"], ["השביע", "הִשְׁבִּיעַ"], ["השביעה", "הִשְׁבִּיעָה"], ["השבענו", "הִשְׁבַּעְנוּ"], ["השבעתם", "הִשְׁבַּעְתֶּם"], ["השבעתן", "הִשְׁבַּעְתֶּן"], ["השביעו", "הִשְׁבִּיעוּ"]],
      future: [["אשביע", "אַשְׁבִּיעַ"], ["תשביע", "תַּשְׁבִּיעַ"], ["תשביעי", "תַּשְׁבִּיעִי"], ["ישביע", "יַשְׁבִּיעַ"], ["תשביע", "תַּשְׁבִּיעַ"], ["נשביע", "נַשְׁבִּיעַ"], ["תשביעו", "תַּשְׁבִּיעוּ"], ["ישביעו", "יַשְׁבִּיעוּ"]],
    },
    {
      id: "character-verb-lehitgayer", lemma: "להתגייר", lemma_niqqud: "לְהִתְגַּיֵּיר", root: ["ג", "י", "ר"], binyan: "hitpael", regularity: "irregular", gloss: "to convert", difficulty_level: 4,
      present: [["מתגייר", "מִתְגַּיֵּיר"], ["מתגיירת", "מִתְגַּיֶּירֶת"], ["מתגיירים", "מִתְגַּיְּירִים"], ["מתגיירות", "מִתְגַּיְּירוֹת"]],
      past: [["התגיירתי", "הִתְגַּיַּירְתִּי"], ["התגיירת", "הִתְגַּיַּירְתָּ"], ["התגיירת", "הִתְגַּיַּירְתְּ"], ["התגייר", "הִתְגַּיֵּיר"], ["התגיירה", "הִתְגַּיְּירָה"], ["התגיירנו", "הִתְגַּיַּירְנוּ"], ["התגיירתם", "הִתְגַּיַּירְתֶּם"], ["התגיירתן", "הִתְגַּיַּירְתֶּן"], ["התגיירו", "הִתְגַּיְּירוּ"]],
      future: [["אתגייר", "אֶתְגַּיֵּיר"], ["תתגייר", "תִּתְגַּיֵּיר"], ["תתגיירי", "תִּתְגַּיְּירִי"], ["יתגייר", "יִתְגַּיֵּיר"], ["תתגייר", "תִּתְגַּיֵּיר"], ["נתגייר", "נִתְגַּיֵּיר"], ["תתגיירו", "תִּתְגַּיְּירוּ"], ["יתגיירו", "יִתְגַּיְּירוּ"]],
    },
    {
      id: "advanced-verb-leakhzev", lemma: "לאכזב", lemma_niqqud: "לְאַכְזֵב", root: ["א", "כ", "ז", "ב"], binyan: "piel", regularity: "regular", gloss: "to disappoint", difficulty_level: 3,
      present: [["מאכזב", "מְאַכְזֵב"], ["מאכזבת", "מְאַכְזֶבֶת"], ["מאכזבים", "מְאַכְזְבִים"], ["מאכזבות", "מְאַכְזְבוֹת"]],
      past: [["אכזבתי", "אִכְזַבְתִּי"], ["אכזבת", "אִכְזַבְתָּ"], ["אכזבת", "אִכְזַבְתְּ"], ["אכזב", "אִכְזֵב"], ["אכזבה", "אִכְזְבָה"], ["אכזבנו", "אִכְזַבְנוּ"], ["אכזבתם", "אִכְזַבְתֶּם"], ["אכזבתן", "אִכְזַבְתֶּן"], ["אכזבו", "אִכְזְבוּ"]],
      future: [["אאכזב", "אֲאַכְזֵב"], ["תאכזב", "תְּאַכְזֵב"], ["תאכזבי", "תְּאַכְזְבִי"], ["יאכזב", "יְאַכְזֵב"], ["תאכזב", "תְּאַכְזֵב"], ["נאכזב", "נְאַכְזֵב"], ["תאכזבו", "תְּאַכְזְבוּ"], ["יאכזבו", "יְאַכְזְבוּ"]],
      imperative: [["אכזב", "אַכְזֵב"], ["אכזבי", "אַכְזְבִי"], ["אכזבו", "אַכְזְבוּ"]],
    },
    {
      id: "advanced-verb-leragesh", lemma: "לרגש", lemma_niqqud: "לְרַגֵּשׁ", root: ["ר", "ג", "ש"], binyan: "piel", regularity: "regular", gloss: "to move deeply", difficulty_level: 3,
      present: [["מרגש", "מְרַגֵּשׁ"], ["מרגשת", "מְרַגֶּשֶׁת"], ["מרגשים", "מְרַגְּשִׁים"], ["מרגשות", "מְרַגְּשׁוֹת"]],
      past: [["ריגשתי", "רִגַּשְׁתִּי"], ["ריגשת", "רִגַּשְׁתָּ"], ["ריגשת", "רִגַּשְׁתְּ"], ["ריגש", "רִגֵּשׁ"], ["ריגשה", "רִגְּשָׁה"], ["ריגשנו", "רִגַּשְׁנוּ"], ["ריגשתם", "רִגַּשְׁתֶּם"], ["ריגשתן", "רִגַּשְׁתֶּן"], ["ריגשו", "רִגְּשׁוּ"]],
      future: [["ארגש", "אֲרַגֵּשׁ"], ["תרגש", "תְּרַגֵּשׁ"], ["תרגשי", "תְּרַגְּשִׁי"], ["ירגש", "יְרַגֵּשׁ"], ["תרגש", "תְּרַגֵּשׁ"], ["נרגש", "נְרַגֵּשׁ"], ["תרגשו", "תְּרַגְּשׁוּ"], ["ירגשו", "יְרַגְּשׁוּ"]],
      imperative: [["רגש", "רַגֵּשׁ"], ["רגשי", "רַגְּשִׁי"], ["רגשו", "רַגְּשׁוּ"]],
    },
    {
      id: "advanced-verb-levalbel", lemma: "לבלבל", lemma_niqqud: "לְבַלְבֵּל", root: ["ב", "ל", "ב", "ל"], binyan: "piel", regularity: "regular", gloss: "to confuse", difficulty_level: 3,
      present: [["מבלבל", "מְבַלְבֵּל"], ["מבלבלת", "מְבַלְבֶּלֶת"], ["מבלבלים", "מְבַלְבְּלִים"], ["מבלבלות", "מְבַלְבְּלוֹת"]],
      past: [["בילבלתי", "בִּלְבַּלְתִּי"], ["בילבלת", "בִּלְבַּלְתָּ"], ["בילבלת", "בִּלְבַּלְתְּ"], ["בילבל", "בִּלְבֵּל"], ["בילבלה", "בִּלְבְּלָה"], ["בילבלנו", "בִּלְבַּלְנוּ"], ["בילבלתם", "בִּלְבַּלְתֶּם"], ["בילבלתן", "בִּלְבַּלְתֶּן"], ["בילבלו", "בִּלְבְּלוּ"]],
      future: [["אבלבל", "אֲבַלְבֵּל"], ["תבלבל", "תְּבַלְבֵּל"], ["תבלבלי", "תְּבַלְבְּלִי"], ["יבלבל", "יְבַלְבֵּל"], ["תבלבל", "תְּבַלְבֵּל"], ["נבלבל", "נְבַלְבֵּל"], ["תבלבלו", "תְּבַלְבְּלוּ"], ["יבלבלו", "יְבַלְבְּלוּ"]],
      imperative: [["בלבל", "בַּלְבֵּל"], ["בלבלי", "בַּלְבְּלִי"], ["בלבלו", "בַּלְבְּלוּ"]],
    },
    {
      id: "advanced-verb-leshakhnea", lemma: "לשכנע", lemma_niqqud: "לְשַׁכְנֵעַ", root: ["ש", "כ", "נ", "ע"], binyan: "piel", regularity: "regular", gloss: "to convince", difficulty_level: 3,
      present: [["משכנע", "מְשַׁכְנֵעַ"], ["משכנעת", "מְשַׁכְנַעַת"], ["משכנעים", "מְשַׁכְנְעִים"], ["משכנעות", "מְשַׁכְנְעוֹת"]],
      past: [["שיכנעתי", "שִׁכְנַעְתִּי"], ["שיכנעת", "שִׁכְנַעְתָּ"], ["שיכנעת", "שִׁכְנַעְתְּ"], ["שיכנע", "שִׁכְנֵעַ"], ["שיכנעה", "שִׁכְנְעָה"], ["שיכנענו", "שִׁכְנַעְנוּ"], ["שיכנעתם", "שִׁכְנַעְתֶּם"], ["שיכנעתן", "שִׁכְנַעְתֶּן"], ["שיכנעו", "שִׁכְנְעוּ"]],
      future: [["אשכנע", "אֲשַׁכְנֵעַ"], ["תשכנע", "תְּשַׁכְנֵעַ"], ["תשכנעי", "תְּשַׁכְנְעִי"], ["ישכנע", "יְשַׁכְנֵעַ"], ["תשכנע", "תְּשַׁכְנֵעַ"], ["נשכנע", "נְשַׁכְנֵעַ"], ["תשכנעו", "תְּשַׁכְנְעוּ"], ["ישכנעו", "יְשַׁכְנְעוּ"]],
      imperative: [["שכנע", "שַׁכְנֵעַ"], ["שכנעי", "שַׁכְנְעִי"], ["שכנעו", "שַׁכְנְעוּ"]],
    },
    {
      id: "advanced-verb-lefanek", lemma: "לפנק", lemma_niqqud: "לְפַנֵּק", root: ["פ", "נ", "ק"], binyan: "piel", regularity: "regular", gloss: "to pamper", difficulty_level: 3,
      present: [["מפנק", "מְפַנֵּק"], ["מפנקת", "מְפַנֶּקֶת"], ["מפנקים", "מְפַנְּקִים"], ["מפנקות", "מְפַנְּקוֹת"]],
      past: [["פינקתי", "פִּנַּקְתִּי"], ["פינקת", "פִּנַּקְתָּ"], ["פינקת", "פִּנַּקְתְּ"], ["פינק", "פִּנֵּק"], ["פינקה", "פִּנְּקָה"], ["פינקנו", "פִּנַּקְנוּ"], ["פינקתם", "פִּנַּקְתֶּם"], ["פינקתן", "פִּנַּקְתֶּן"], ["פינקו", "פִּנְּקוּ"]],
      future: [["אפנק", "אֲפַנֵּק"], ["תפנק", "תְּפַנֵּק"], ["תפנקי", "תְּפַנְּקִי"], ["יפנק", "יְפַנֵּק"], ["תפנק", "תְּפַנֵּק"], ["נפנק", "נְפַנֵּק"], ["תפנקו", "תְּפַנְּקוּ"], ["יפנקו", "יְפַנְּקוּ"]],
      imperative: [["פנק", "פַּנֵּק"], ["פנקי", "פַּנְּקִי"], ["פנקו", "פַּנְּקוּ"]],
    },
    {
      id: "advanced-verb-lekalkel", lemma: "לקלקל", lemma_niqqud: "לְקַלְקֵל", root: ["ק", "ל", "ק", "ל"], binyan: "piel", regularity: "regular", gloss: "to spoil", difficulty_level: 3,
      present: [["מקלקל", "מְקַלְקֵל"], ["מקלקלת", "מְקַלְקֶלֶת"], ["מקלקלים", "מְקַלְקְלִים"], ["מקלקלות", "מְקַלְקְלוֹת"]],
      past: [["קילקלתי", "קִלְקַלְתִּי"], ["קילקלת", "קִלְקַלְתָּ"], ["קילקלת", "קִלְקַלְתְּ"], ["קילקל", "קִלְקֵל"], ["קילקלה", "קִלְקְלָה"], ["קילקלנו", "קִלְקַלְנוּ"], ["קילקלתם", "קִלְקַלְתֶּם"], ["קילקלתן", "קִלְקַלְתֶּן"], ["קילקלו", "קִלְקְלוּ"]],
      future: [["אקלקל", "אֲקַלְקֵל"], ["תקלקל", "תְּקַלְקֵל"], ["תקלקלי", "תְּקַלְקְלִי"], ["יקלקל", "יְקַלְקֵל"], ["תקלקל", "תְּקַלְקֵל"], ["נקלקל", "נְקַלְקֵל"], ["תקלקלו", "תְּקַלְקְלוּ"], ["יקלקלו", "יְקַלְקְלוּ"]],
      imperative: [["קלקל", "קַלְקֵל"], ["קלקלי", "קַלְקְלִי"], ["קלקלו", "קַלְקְלוּ"]],
    },
    {
      id: "advanced-verb-leharshim", lemma: "להרשים", lemma_niqqud: "לְהַרְשִׁים", root: ["ר", "ש", "מ"], binyan: "hifil", regularity: "regular", gloss: "to impress (someone)", difficulty_level: 3,
      present: [["מרשים", "מַרְשִׁים"], ["מרשימה", "מַרְשִׁימָה"], ["מרשימים", "מַרְשִׁימִים"], ["מרשימות", "מַרְשִׁימוֹת"]],
      past: [["הרשמתי", "הִרְשַׁמְתִּי"], ["הרשמת", "הִרְשַׁמְתָּ"], ["הרשמת", "הִרְשַׁמְתְּ"], ["הרשים", "הִרְשִׁים"], ["הרשימה", "הִרְשִׁימָה"], ["הרשמנו", "הִרְשַׁמְנוּ"], ["הרשמתם", "הִרְשַׁמְתֶּם"], ["הרשמתן", "הִרְשַׁמְתֶּן"], ["הרשימו", "הִרְשִׁימוּ"]],
      future: [["ארשים", "אַרְשִׁים"], ["תרשים", "תַּרְשִׁים"], ["תרשימי", "תַּרְשִׁימִי"], ["ירשים", "יַרְשִׁים"], ["תרשים", "תַּרְשִׁים"], ["נרשים", "נַרְשִׁים"], ["תרשימו", "תַּרְשִׁימוּ"], ["ירשימו", "יַרְשִׁימוּ"]],
      imperative: [["הרשם", "הַרְשֵׁם"], ["הרשימי", "הַרְשִׁימִי"], ["הרשימו", "הַרְשִׁימוּ"]],
    },
    {
      id: "advanced-verb-lehaaliv", lemma: "להעליב", lemma_niqqud: "לְהַעֲלִיב", root: ["ע", "ל", "ב"], binyan: "hifil", regularity: "irregular", gloss: "to offend", difficulty_level: 3,
      present: [["מעליב", "מַעֲלִיב"], ["מעליבה", "מַעֲלִיבָה"], ["מעליבים", "מַעֲלִיבִים"], ["מעליבות", "מַעֲלִיבוֹת"]],
      past: [["העלבתי", "הֶעֱלַבְתִּי"], ["העלבת", "הֶעֱלַבְתָּ"], ["העלבת", "הֶעֱלַבְתְּ"], ["העליב", "הֶעֱלִיב"], ["העליבה", "הֶעֱלִיבָה"], ["העלבנו", "הֶעֱלַבְנוּ"], ["העלבתם", "הֶעֱלַבְתֶּם"], ["העלבתן", "הֶעֱלַבְתֶּן"], ["העליבו", "הֶעֱלִיבוּ"]],
      future: [["אעליב", "אַעֲלִיב"], ["תעליב", "תַּעֲלִיב"], ["תעליבי", "תַּעֲלִיבִי"], ["יעליב", "יַעֲלִיב"], ["תעליב", "תַּעֲלִיב"], ["נעליב", "נַעֲלִיב"], ["תעליבו", "תַּעֲלִיבוּ"], ["יעליבו", "יַעֲלִיבוּ"]],
      imperative: [["העלב", "הַעֲלֵב"], ["העליבי", "הַעֲלִיבִי"], ["העליבו", "הַעֲלִיבוּ"]],
    },
    {
      id: "advanced-verb-lehatrid", lemma: "להטריד", lemma_niqqud: "לְהַטְרִיד", root: ["ט", "ר", "ד"], binyan: "hifil", regularity: "regular", gloss: "to bother", difficulty_level: 3,
      present: [["מטריד", "מַטְרִיד"], ["מטרידה", "מַטְרִידָה"], ["מטרידים", "מַטְרִידִים"], ["מטרידות", "מַטְרִידוֹת"]],
      past: [["הטרדתי", "הִטְרַדְתִּי"], ["הטרדת", "הִטְרַדְתָּ"], ["הטרדת", "הִטְרַדְתְּ"], ["הטריד", "הִטְרִיד"], ["הטרידה", "הִטְרִידָה"], ["הטרדנו", "הִטְרַדְנוּ"], ["הטרדתם", "הִטְרַדְתֶּם"], ["הטרדתן", "הִטְרַדְתֶּן"], ["הטרידו", "הִטְרִידוּ"]],
      future: [["אטריד", "אַטְרִיד"], ["תטריד", "תַּטְרִיד"], ["תטרידי", "תַּטְרִידִי"], ["יטריד", "יַטְרִיד"], ["תטריד", "תַּטְרִיד"], ["נטריד", "נַטְרִיד"], ["תטרידו", "תַּטְרִידוּ"], ["יטרידו", "יַטְרִידוּ"]],
      imperative: [["הטרד", "הַטְרֵד"], ["הטרידי", "הַטְרִידִי"], ["הטרידו", "הַטְרִידוּ"]],
    },
    {
      id: "advanced-verb-lehafchid", lemma: "להפחיד", lemma_niqqud: "לְהַפְחִיד", root: ["פ", "ח", "ד"], binyan: "hifil", regularity: "regular", gloss: "to frighten", difficulty_level: 3,
      present: [["מפחיד", "מַפְחִיד"], ["מפחידה", "מַפְחִידָה"], ["מפחידים", "מַפְחִידִים"], ["מפחידות", "מַפְחִידוֹת"]],
      past: [["הפחדתי", "הִפְחַדְתִּי"], ["הפחדת", "הִפְחַדְתָּ"], ["הפחדת", "הִפְחַדְתְּ"], ["הפחיד", "הִפְחִיד"], ["הפחידה", "הִפְחִידָה"], ["הפחדנו", "הִפְחַדְנוּ"], ["הפחדתם", "הִפְחַדְתֶּם"], ["הפחדתן", "הִפְחַדְתֶּן"], ["הפחידו", "הִפְחִידוּ"]],
      future: [["אפחיד", "אַפְחִיד"], ["תפחיד", "תַּפְחִיד"], ["תפחידי", "תַּפְחִידִי"], ["יפחיד", "יַפְחִיד"], ["תפחיד", "תַּפְחִיד"], ["נפחיד", "נַפְחִיד"], ["תפחידו", "תַּפְחִידוּ"], ["יפחידו", "יַפְחִידוּ"]],
      imperative: [["הפחד", "הַפְחֵד"], ["הפחידי", "הַפְחִידִי"], ["הפחידו", "הַפְחִידוּ"]],
    },
    {
      id: "advanced-verb-lehargiz", lemma: "להרגיז", lemma_niqqud: "לְהַרְגִּיז", root: ["ר", "ג", "ז"], binyan: "hifil", regularity: "regular", gloss: "to infuriate", difficulty_level: 3,
      present: [["מרגיז", "מַרְגִּיז"], ["מרגיזה", "מַרְגִּיזָה"], ["מרגיזים", "מַרְגִּיזִים"], ["מרגיזות", "מַרְגִּיזוֹת"]],
      past: [["הרגזתי", "הִרְגַּזְתִּי"], ["הרגזת", "הִרְגַּזְתָּ"], ["הרגזת", "הִרְגַּזְתְּ"], ["הרגיז", "הִרְגִּיז"], ["הרגיזה", "הִרְגִּיזָה"], ["הרגזנו", "הִרְגַּזְנוּ"], ["הרגזתם", "הִרְגַּזְתֶּם"], ["הרגזתן", "הִרְגַּזְתֶּן"], ["הרגיזו", "הִרְגִּיזוּ"]],
      future: [["ארגיז", "אַרְגִּיז"], ["תרגיז", "תַּרְגִּיז"], ["תרגיזי", "תַּרְגִּיזִי"], ["ירגיז", "יַרְגִּיז"], ["תרגיז", "תַּרְגִּיז"], ["נרגיז", "נַרְגִּיז"], ["תרגיזו", "תַּרְגִּיזוּ"], ["ירגיזו", "יַרְגִּיזוּ"]],
      imperative: [["הרגז", "הַרְגֵּז"], ["הרגיזי", "הַרְגִּיזִי"], ["הרגיזו", "הַרְגִּיזוּ"]],
    },
    {
      id: "advanced-verb-lehashpil", lemma: "להשפיל", lemma_niqqud: "לְהַשְׁפִּיל", root: ["ש", "פ", "ל"], binyan: "hifil", regularity: "regular", gloss: "to humiliate", difficulty_level: 3,
      present: [["משפיל", "מַשְׁפִּיל"], ["משפילה", "מַשְׁפִּילָה"], ["משפילים", "מַשְׁפִּילִים"], ["משפילות", "מַשְׁפִּילוֹת"]],
      past: [["השפלתי", "הִשְׁפַּלְתִּי"], ["השפלת", "הִשְׁפַּלְתָּ"], ["השפלת", "הִשְׁפַּלְתְּ"], ["השפיל", "הִשְׁפִּיל"], ["השפילה", "הִשְׁפִּילָה"], ["השפלנו", "הִשְׁפַּלְנוּ"], ["השפלתם", "הִשְׁפַּלְתֶּם"], ["השפלתן", "הִשְׁפַּלְתֶּן"], ["השפילו", "הִשְׁפִּילוּ"]],
      future: [["אשפיל", "אַשְׁפִּיל"], ["תשפיל", "תַּשְׁפִּיל"], ["תשפילי", "תַּשְׁפִּילִי"], ["ישפיל", "יַשְׁפִּיל"], ["תשפיל", "תַּשְׁפִּיל"], ["נשפיל", "נַשְׁפִּיל"], ["תשפילו", "תַּשְׁפִּילוּ"], ["ישפילו", "יַשְׁפִּילוּ"]],
      imperative: [["השפל", "הַשְׁפֵּל"], ["השפילי", "הַשְׁפִּילִי"], ["השפילו", "הַשְׁפִּילוּ"]],
    },
    {
      id: "advanced-verb-lehavhil", lemma: "להבהיל", lemma_niqqud: "לְהַבְהִיל", root: ["ב", "ה", "ל"], binyan: "hifil", regularity: "regular", gloss: "to alarm", difficulty_level: 3,
      present: [["מבהיל", "מַבְהִיל"], ["מבהילה", "מַבְהִילָה"], ["מבהילים", "מַבְהִילִים"], ["מבהילות", "מַבְהִילוֹת"]],
      past: [["הבהלתי", "הִבְהַלְתִּי"], ["הבהלת", "הִבְהַלְתָּ"], ["הבהלת", "הִבְהַלְתְּ"], ["הבהיל", "הִבְהִיל"], ["הבהילה", "הִבְהִילָה"], ["הבהלנו", "הִבְהַלְנוּ"], ["הבהלתם", "הִבְהַלְתֶּם"], ["הבהלתן", "הִבְהַלְתֶּן"], ["הבהילו", "הִבְהִילוּ"]],
      future: [["אבהיל", "אַבְהִיל"], ["תבהיל", "תַּבְהִיל"], ["תבהילי", "תַּבְהִילִי"], ["יבהיל", "יַבְהִיל"], ["תבהיל", "תַּבְהִיל"], ["נבהיל", "נַבְהִיל"], ["תבהילו", "תַּבְהִילוּ"], ["יבהילו", "יַבְהִילוּ"]],
      imperative: [["הבהל", "הַבְהֵל"], ["הבהילי", "הַבְהִילִי"], ["הבהילו", "הַבְהִילוּ"]],
    },
    {
      id: "advanced-verb-lehargia", lemma: "להרגיע", lemma_niqqud: "לְהַרְגִּיעַ", root: ["ר", "ג", "ע"], binyan: "hifil", regularity: "irregular", gloss: "to calm down", difficulty_level: 3,
      present: [["מרגיע", "מַרְגִּיעַ"], ["מרגיעה", "מַרְגִּיעָה"], ["מרגיעים", "מַרְגִּיעִים"], ["מרגיעות", "מַרְגִּיעוֹת"]],
      past: [["הרגעתי", "הִרְגַּעְתִּי"], ["הרגעת", "הִרְגַּעְתָּ"], ["הרגעת", "הִרְגַּעְתְּ"], ["הרגיע", "הִרְגִּיעַ"], ["הרגיעה", "הִרְגִּיעָה"], ["הרגענו", "הִרְגַּעְנוּ"], ["הרגעתם", "הִרְגַּעְתֶּם"], ["הרגעתן", "הִרְגַּעְתֶּן"], ["הרגיעו", "הִרְגִּיעוּ"]],
      future: [["ארגיע", "אַרְגִּיעַ"], ["תרגיע", "תַּרְגִּיעַ"], ["תרגיעי", "תַּרְגִּיעִי"], ["ירגיע", "יַרְגִּיעַ"], ["תרגיע", "תַּרְגִּיעַ"], ["נרגיע", "נַרְגִּיעַ"], ["תרגיעו", "תַּרְגִּיעוּ"], ["ירגיעו", "יַרְגִּיעוּ"]],
      imperative: [["הרגע", "הַרְגַּע"], ["הרגיעי", "הַרְגִּיעִי"], ["הרגיעו", "הַרְגִּיעוּ"]],
    },
    {
      id: "advanced-verb-lehaftia", lemma: "להפתיע", lemma_niqqud: "לְהַפְתִּיעַ", root: ["פ", "ת", "ע"], binyan: "hifil", regularity: "irregular", gloss: "to surprise", difficulty_level: 3,
      present: [["מפתיע", "מַפְתִּיעַ"], ["מפתיעה", "מַפְתִּיעָה"], ["מפתיעים", "מַפְתִּיעִים"], ["מפתיעות", "מַפְתִּיעוֹת"]],
      past: [["הפתעתי", "הִפְתַּעְתִּי"], ["הפתעת", "הִפְתַּעְתָּ"], ["הפתעת", "הִפְתַּעְתְּ"], ["הפתיע", "הִפְתִּיעַ"], ["הפתיעה", "הִפְתִּיעָה"], ["הפתענו", "הִפְתַּעְנוּ"], ["הפתעתם", "הִפְתַּעְתֶּם"], ["הפתעתן", "הִפְתַּעְתֶּן"], ["הפתיעו", "הִפְתִּיעוּ"]],
      future: [["אפתיע", "אַפְתִּיעַ"], ["תפתיע", "תַּפְתִּיעַ"], ["תפתיעי", "תַּפְתִּיעִי"], ["יפתיע", "יַפְתִּיעַ"], ["תפתיע", "תַּפְתִּיעַ"], ["נפתיע", "נַפְתִּיעַ"], ["תפתיעו", "תַּפְתִּיעוּ"], ["יפתיעו", "יַפְתִּיעוּ"]],
      imperative: [["הפתע", "הַפְתַּע"], ["הפתיעי", "הַפְתִּיעִי"], ["הפתיעו", "הַפְתִּיעוּ"]],
    },
    {
      id: "advanced-verb-lehadhim", lemma: "להדהים", lemma_niqqud: "לְהַדְהִים", root: ["ד", "ה", "מ"], binyan: "hifil", regularity: "regular", gloss: "to astonish", difficulty_level: 3,
      present: [["מדהים", "מַדְהִים"], ["מדהימה", "מַדְהִימָה"], ["מדהימים", "מַדְהִימִים"], ["מדהימות", "מַדְהִימוֹת"]],
      past: [["הדהמתי", "הִדְהַמְתִּי"], ["הדהמת", "הִדְהַמְתָּ"], ["הדהמת", "הִדְהַמְתְּ"], ["הדהים", "הִדְהִים"], ["הדהימה", "הִדְהִימָה"], ["הדהמנו", "הִדְהַמְנוּ"], ["הדהמתם", "הִדְהַמְתֶּם"], ["הדהמתן", "הִדְהַמְתֶּן"], ["הדהימו", "הִדְהִימוּ"]],
      future: [["אדהים", "אַדְהִים"], ["תדהים", "תַּדְהִים"], ["תדהימי", "תַּדְהִימִי"], ["ידהים", "יַדְהִים"], ["תדהים", "תַּדְהִים"], ["נדהים", "נַדְהִים"], ["תדהימו", "תַּדְהִימוּ"], ["ידהימו", "יַדְהִימוּ"]],
      imperative: [["הדהם", "הַדְהֵם"], ["הדהימי", "הַדְהִימִי"], ["הדהימו", "הַדְהִימוּ"]],
    },
    {
      id: "advanced-verb-lehalchits", lemma: "להלחיץ", lemma_niqqud: "לְהַלְחִיץ", root: ["ל", "ח", "צ"], binyan: "hifil", regularity: "regular", gloss: "to stress out", difficulty_level: 3,
      present: [["מלחיץ", "מַלְחִיץ"], ["מלחיצה", "מַלְחִיצָה"], ["מלחיצים", "מַלְחִיצִים"], ["מלחיצות", "מַלְחִיצוֹת"]],
      past: [["הלחצתי", "הִלְחַצְתִּי"], ["הלחצת", "הִלְחַצְתָּ"], ["הלחצת", "הִלְחַצְתְּ"], ["הלחיץ", "הִלְחִיץ"], ["הלחיצה", "הִלְחִיצָה"], ["הלחצנו", "הִלְחַצְנוּ"], ["הלחצתם", "הִלְחַצְתֶּם"], ["הלחצתן", "הִלְחַצְתֶּן"], ["הלחיצו", "הִלְחִיצוּ"]],
      future: [["אלחיץ", "אַלְחִיץ"], ["תלחיץ", "תַּלְחִיץ"], ["תלחיצי", "תַּלְחִיצִי"], ["ילחיץ", "יַלְחִיץ"], ["תלחיץ", "תַּלְחִיץ"], ["נלחיץ", "נַלְחִיץ"], ["תלחיצו", "תַּלְחִיצוּ"], ["ילחיצו", "יַלְחִיצוּ"]],
      imperative: [["הלחץ", "הַלְחֵץ"], ["הלחיצי", "הַלְחִיצִי"], ["הלחיצו", "הַלְחִיצוּ"]],
    },
    {
      id: "advanced-verb-lehatsil", lemma: "להציל", lemma_niqqud: "לְהַצִּיל", root: ["נ", "צ", "ל"], binyan: "hifil", regularity: "irregular", gloss: "to save", difficulty_level: 3,
      present: [["מציל", "מַצִּיל"], ["מצילה", "מַצִּילָה"], ["מצילים", "מַצִּילִים"], ["מצילות", "מַצִּילוֹת"]],
      past: [["הצלתי", "הִצַּלְתִּי"], ["הצלת", "הִצַּלְתָּ"], ["הצלת", "הִצַּלְתְּ"], ["הציל", "הִצִּיל"], ["הצילה", "הִצִּילָה"], ["הצלנו", "הִצַּלְנוּ"], ["הצלתם", "הִצַּלְתֶּם"], ["הצלתן", "הִצַּלְתֶּן"], ["הצילו", "הִצִּילוּ"]],
      future: [["אציל", "אַצִּיל"], ["תציל", "תַּצִּיל"], ["תצילי", "תַּצִּילִי"], ["יציל", "יַצִּיל"], ["תציל", "תַּצִּיל"], ["נציל", "נַצִּיל"], ["תצילו", "תַּצִּילוּ"], ["יצילו", "יַצִּילוּ"]],
      imperative: [["הצל", "הַצֵּל"], ["הצילי", "הַצִּילִי"], ["הצילו", "הַצִּילוּ"]],
    },
    {
      id: "advanced-verb-leoded", lemma: "לעודד", lemma_niqqud: "לְעוֹדֵד", root: ["ע", "ו", "ד", "ד"], binyan: "piel", regularity: "regular", gloss: "to encourage", difficulty_level: 3,
      present: [["מעודד", "מְעוֹדֵד"], ["מעודדת", "מְעוֹדֶדֶת"], ["מעודדים", "מְעוֹדְדִים"], ["מעודדות", "מְעוֹדְדוֹת"]],
      past: [["עודדתי", "עוֹדַדְתִּי"], ["עודדת", "עוֹדַדְתָּ"], ["עודדת", "עוֹדַדְתְּ"], ["עודד", "עוֹדֵד"], ["עודדה", "עוֹדְדָה"], ["עודדנו", "עוֹדַדְנוּ"], ["עודדתם", "עוֹדַדְתֶּם"], ["עודדתן", "עוֹדַדְתֶּן"], ["עודדו", "עוֹדְדוּ"]],
      future: [["אעודד", "אֲעוֹדֵד"], ["תעודד", "תְּעוֹדֵד"], ["תעודדי", "תְּעוֹדְדִי"], ["יעודד", "יְעוֹדֵד"], ["תעודד", "תְּעוֹדֵד"], ["נעודד", "נְעוֹדֵד"], ["תעודדו", "תְּעוֹדְדוּ"], ["יעודדו", "יְעוֹדְדוּ"]],
      imperative: [["עודד", "עוֹדֵד"], ["עודדי", "עוֹדְדִי"], ["עודדו", "עוֹדְדוּ"]],
    },
    {
      id: "advanced-verb-lesakren", lemma: "לסקרן", lemma_niqqud: "לְסַקְרֵן", root: ["ס", "ק", "ר", "נ"], binyan: "piel", regularity: "regular", gloss: "to intrigue", difficulty_level: 3,
      present: [["מסקרן", "מְסַקְרֵן"], ["מסקרנת", "מְסַקְרֶנֶת"], ["מסקרנים", "מְסַקְרְנִים"], ["מסקרנות", "מְסַקְרְנוֹת"]],
      past: [["סקרנתי", "סִקְרַנְתִּי"], ["סקרנת", "סִקְרַנְתָּ"], ["סקרנת", "סִקְרַנְתְּ"], ["סקרן", "סִקְרֵן"], ["סקרנה", "סִקְרְנָה"], ["סקרנו", "סִקְרַנּוּ"], ["סקרנתם", "סִקְרַנְתֶּם"], ["סקרנתן", "סִקְרַנְתֶּן"], ["סקרנו", "סִקְרְנוּ"]],
      future: [["אסקרן", "אֲסַקְרֵן"], ["תסקרן", "תְּסַקְרֵן"], ["תסקרני", "תְּסַקְרְנִי"], ["יסקרן", "יְסַקְרֵן"], ["תסקרן", "תְּסַקְרֵן"], ["נסקרן", "נְסַקְרֵן"], ["תסקרנו", "תְּסַקְרְנוּ"], ["יסקרנו", "יְסַקְרְנוּ"]],
      imperative: [["סקרן", "סַקְרֵן"], ["סקרני", "סַקְרְנִי"], ["סקרנו", "סַקְרְנוּ"]],
    },
    {
      id: "advanced-verb-leayef", lemma: "לעייף", lemma_niqqud: "לְעַיֵּף", root: ["ע", "י", "פ"], binyan: "piel", regularity: "regular", gloss: "to tire out", difficulty_level: 3,
      present: [["מעייף", "מְעַיֵּף"], ["מעייפת", "מְעַיֶּפֶת"], ["מעייפים", "מְעַיְּפִים"], ["מעייפות", "מְעַיְּפוֹת"]],
      past: [["עייפתי", "עִיַּפְתִּי"], ["עייפת", "עִיַּפְתָּ"], ["עייפת", "עִיַּפְתְּ"], ["עייף", "עִיֵּף"], ["עייפה", "עִיְּפָה"], ["עייפנו", "עִיַּפְנוּ"], ["עייפתם", "עִיַּפְתֶּם"], ["עייפתן", "עִיַּפְתֶּן"], ["עייפו", "עִיְּפוּ"]],
      future: [["אעייף", "אֲעַיֵּף"], ["תעייף", "תְּעַיֵּף"], ["תעייפי", "תְּעַיְּפִי"], ["יעייף", "יְעַיֵּף"], ["תעייף", "תְּעַיֵּף"], ["נעייף", "נְעַיֵּף"], ["תעייפו", "תְּעַיְּפוּ"], ["יעייפו", "יְעַיְּפוּ"]],
      imperative: [["עייף", "עַיֵּף"], ["עייפי", "עַיְּפִי"], ["עייפו", "עַיְּפוּ"]],
    },
    {
      id: "advanced-verb-leshaamem", lemma: "לשעמם", lemma_niqqud: "לְשַׁעֲמֵם", root: ["ש", "ע", "מ", "מ"], binyan: "piel", regularity: "regular", gloss: "to bore", difficulty_level: 3,
      present: [["משעמם", "מְשַׁעֲמֵם"], ["משעממת", "מְשַׁעֲמֶמֶת"], ["משעממים", "מְשַׁעֲמְמִים"], ["משעממות", "מְשַׁעֲמְמוֹת"]],
      past: [["שיעממתי", "שִׁעֲמַמְתִּי"], ["שיעממת", "שִׁעֲמַמְתָּ"], ["שיעממת", "שִׁעֲמַמְתְּ"], ["שיעמם", "שִׁעֲמֵם"], ["שיעממה", "שִׁעֲמְמָה"], ["שיעממנו", "שִׁעֲמַמְנוּ"], ["שיעממתם", "שִׁעֲמַמְתֶּם"], ["שיעממתן", "שִׁעֲמַמְתֶּן"], ["שיעממו", "שִׁעֲמְמוּ"]],
      future: [["אשעמם", "אֲשַׁעֲמֵם"], ["תשעמם", "תְּשַׁעֲמֵם"], ["תשעממי", "תְּשַׁעֲמְמִי"], ["ישעמם", "יְשַׁעֲמֵם"], ["תשעמם", "תְּשַׁעֲמֵם"], ["נשעמם", "נְשַׁעֲמֵם"], ["תשעממו", "תְּשַׁעֲמְמוּ"], ["ישעממו", "יְשַׁעֲמְמוּ"]],
      imperative: [["שעמם", "שַׁעֲמֵם"], ["שעממי", "שַׁעֲמְמִי"], ["שעממו", "שַׁעֲמְמוּ"]],
    },
    {
      id: "advanced-verb-lemanef", lemma: "למנף", lemma_niqqud: "לְמַנֵּף", root: ["מ", "נ", "פ"], binyan: "piel", regularity: "regular", gloss: "to leverage", difficulty_level: 3,
      present: [["ממנף", "מְמַנֵּף"], ["ממנפת", "מְמַנֶּפֶת"], ["ממנפים", "מְמַנְּפִים"], ["ממנפות", "מְמַנְּפוֹת"]],
      past: [["מינפתי", "מִנַּפְתִּי"], ["מינפת", "מִנַּפְתָּ"], ["מינפת", "מִנַּפְתְּ"], ["מינף", "מִנֵּף"], ["מינפה", "מִנְּפָה"], ["מינפנו", "מִנַּפְנוּ"], ["מינפתם", "מִנַּפְתֶּם"], ["מינפתן", "מִנַּפְתֶּן"], ["מינפו", "מִנְּפוּ"]],
      future: [["אמנף", "אֲמַנֵּף"], ["תמנף", "תְּמַנֵּף"], ["תמנפי", "תְּמַנְּפִי"], ["ימנף", "יְמַנֵּף"], ["תמנף", "תְּמַנֵּף"], ["נמנף", "נְמַנֵּף"], ["תמנפו", "תְּמַנְּפוּ"], ["ימנפו", "יְמַנְּפוּ"]],
      imperative: [["מנף", "מַנֵּף"], ["מנפי", "מַנְּפִי"], ["מנפו", "מַנְּפוּ"]],
    },
    {
      id: "advanced-verb-lehaarich", lemma: "להעריך", lemma_niqqud: "לְהַעֲרִיךְ", root: ["ע", "ר", "כ"], binyan: "hifil", regularity: "irregular", gloss: "to appreciate", difficulty_level: 3,
      present: [["מעריך", "מַעֲרִיךְ"], ["מעריכה", "מַעֲרִיכָה"], ["מעריכים", "מַעֲרִיכִים"], ["מעריכות", "מַעֲרִיכוֹת"]],
      past: [["הערכתי", "הֶעֱרַכְתִּי"], ["הערכת", "הֶעֱרַכְתָּ"], ["הערכת", "הֶעֱרַכְתְּ"], ["העריך", "הֶעֱרִיךְ"], ["העריכה", "הֶעֱרִיכָה"], ["הערכנו", "הֶעֱרַכְנוּ"], ["הערכתם", "הֶעֱרַכְתֶּם"], ["הערכתן", "הֶעֱרַכְתֶּן"], ["העריכו", "הֶעֱרִיכוּ"]],
      future: [["אעריך", "אַעֲרִיךְ"], ["תעריך", "תַּעֲרִיךְ"], ["תעריכי", "תַּעֲרִיכִי"], ["יעריך", "יַעֲרִיךְ"], ["תעריך", "תַּעֲרִיךְ"], ["נעריך", "נַעֲרִיךְ"], ["תעריכו", "תַּעֲרִיכוּ"], ["יעריכו", "יַעֲרִיכוּ"]],
      imperative: [["הערך", "הַעֲרֵךְ"], ["העריכי", "הַעֲרִיכִי"], ["העריכו", "הַעֲרִיכוּ"]],
    },
    {
      id: "advanced-verb-leatzben", lemma: "לעצבן", lemma_niqqud: "לְעַצְבֵּן", root: ["ע", "צ", "ב", "נ"], binyan: "piel", regularity: "regular", gloss: "to annoy", difficulty_level: 3,
      present: [["מעצבן", "מְעַצְבֵּן"], ["מעצבנת", "מְעַצְבֶּנֶת"], ["מעצבנים", "מְעַצְבְּנִים"], ["מעצבנות", "מְעַצְבְּנוֹת"]],
      past: [["עיצבנתי", "עִצְבַּנְתִּי"], ["עיצבנת", "עִצְבַּנְתָּ"], ["עיצבנת", "עִצְבַּנְתְּ"], ["עיצבן", "עִצְבֵּן"], ["עיצבנה", "עִצְבְּנָה"], ["עיצבנו", "עִצְבַּנּוּ"], ["עיצבנתם", "עִצְבַּנְתֶּם"], ["עיצבנתן", "עִצְבַּנְתֶּן"], ["עיצבנו", "עִצְבְּנוּ"]],
      future: [["אעצבן", "אֲעַצְבֵּן"], ["תעצבן", "תְּעַצְבֵּן"], ["תעצבני", "תְּעַצְבְּנִי"], ["יעצבן", "יְעַצְבֵּן"], ["תעצבן", "תְּעַצְבֵּן"], ["נעצבן", "נְעַצְבֵּן"], ["תעצבנו", "תְּעַצְבְּנוּ"], ["יעצבנו", "יְעַצְבְּנוּ"]],
      imperative: [["עצבן", "עַצְבֵּן"], ["עצבני", "עַצְבְּנִי"], ["עצבנו", "עַצְבְּנוּ"]],
    },
    {
      id: "advanced-verb-lehatish", lemma: "להתיש", lemma_niqqud: "לְהַתִּישׁ", root: ["ת", "ש", "ש"], binyan: "hifil", regularity: "irregular", gloss: "to wear down", difficulty_level: 3,
      present: [["מתיש", "מַתִּישׁ"], ["מתישה", "מַתִּישָׁה"], ["מתישים", "מַתִּישִׁים"], ["מתישות", "מַתִּישׁוֹת"]],
      past: [["התשתי", "הִתַּשְׁתִּי"], ["התשת", "הִתַּשְׁתָּ"], ["התשת", "הִתַּשְׁתְּ"], ["התיש", "הִתִּישׁ"], ["התישה", "הִתִּישָׁה"], ["התשנו", "הִתַּשְׁנוּ"], ["התשתם", "הִתַּשְׁתֶּם"], ["התשתן", "הִתַּשְׁתֶּן"], ["התישו", "הִתִּישׁוּ"]],
      future: [["אתיש", "אַתִּישׁ"], ["תתיש", "תַּתִּישׁ"], ["תתישי", "תַּתִּישִׁי"], ["יתיש", "יַתִּישׁ"], ["תתיש", "תַּתִּישׁ"], ["נתיש", "נַתִּישׁ"], ["תתישו", "תַּתִּישׁוּ"], ["יתישו", "יַתִּישׁוּ"]],
      imperative: [["התש", "הַתֵּשׁ"], ["התישי", "הַתִּישִׁי"], ["התישו", "הַתִּישׁוּ"]],
    },
    {
      id: "advanced-verb-leshagea", lemma: "לשגע", lemma_niqqud: "לְשַׁגֵּעַ", root: ["ש", "ג", "ע"], binyan: "piel", regularity: "regular", gloss: "to drive crazy", difficulty_level: 3,
      present: [["משגע", "מְשַׁגֵּעַ"], ["משגעת", "מְשַׁגַּעַת"], ["משגעים", "מְשַׁגְּעִים"], ["משגעות", "מְשַׁגְּעוֹת"]],
      past: [["שיגעתי", "שִׁגַּעְתִּי"], ["שיגעת", "שִׁגַּעְתָּ"], ["שיגעת", "שִׁגַּעְתְּ"], ["שיגע", "שִׁגֵּעַ"], ["שיגעה", "שִׁגְּעָה"], ["שיגענו", "שִׁגַּעְנוּ"], ["שיגעתם", "שִׁגַּעְתֶּם"], ["שיגעתן", "שִׁגַּעְתֶּן"], ["שיגעו", "שִׁגְּעוּ"]],
      future: [["אשגע", "אֲשַׁגֵּעַ"], ["תשגע", "תְּשַׁגֵּעַ"], ["תשגעי", "תְּשַׁגְּעִי"], ["ישגע", "יְשַׁגֵּעַ"], ["תשגע", "תְּשַׁגֵּעַ"], ["נשגע", "נְשַׁגֵּעַ"], ["תשגעו", "תְּשַׁגְּעוּ"], ["ישגעו", "יְשַׁגְּעוּ"]],
      imperative: [["שגע", "שַׁגֵּעַ"], ["שגעי", "שַׁגְּעִי"], ["שגעו", "שַׁגְּעוּ"]],
    },
    {
      id: "advanced-verb-lehatrif", lemma: "להטריף", lemma_niqqud: "לְהַטְרִיף", root: ["ט", "ר", "פ"], binyan: "hifil", regularity: "regular", gloss: "to drive insane", difficulty_level: 3,
      present: [["מטריף", "מַטְרִיף"], ["מטריפה", "מַטְרִיפָה"], ["מטריפים", "מַטְרִיפִים"], ["מטריפות", "מַטְרִיפוֹת"]],
      past: [["הטרפתי", "הִטְרַפְתִּי"], ["הטרפת", "הִטְרַפְתָּ"], ["הטרפת", "הִטְרַפְתְּ"], ["הטריף", "הִטְרִיף"], ["הטריפה", "הִטְרִיפָה"], ["הטרפנו", "הִטְרַפְנוּ"], ["הטרפתם", "הִטְרַפְתֶּם"], ["הטרפתן", "הִטְרַפְתֶּן"], ["הטריפו", "הִטְרִיפוּ"]],
      future: [["אטריף", "אַטְרִיף"], ["תטריף", "תַּטְרִיף"], ["תטריפי", "תַּטְרִיפִי"], ["יטריף", "יַטְרִיף"], ["תטריף", "תַּטְרִיף"], ["נטריף", "נַטְרִיף"], ["תטריפו", "תַּטְרִיפוּ"], ["יטריפו", "יַטְרִיפוּ"]],
      imperative: [["הטרף", "הַטְרֵף"], ["הטריפי", "הַטְרִיפִי"], ["הטריפו", "הַטְרִיפוּ"]],
    },
    {
      id: "advanced-verb-lenatzel", lemma: "לנצל", lemma_niqqud: "לְנַצֵּל", root: ["נ", "צ", "ל"], binyan: "piel", regularity: "regular", gloss: "to exploit", difficulty_level: 3,
      present: [["מנצל", "מְנַצֵּל"], ["מנצלת", "מְנַצֶּלֶת"], ["מנצלים", "מְנַצְּלִים"], ["מנצלות", "מְנַצְּלוֹת"]],
      past: [["ניצלתי", "נִצַּלְתִּי"], ["ניצלת", "נִצַּלְתָּ"], ["ניצלת", "נִצַּלְתְּ"], ["ניצל", "נִצֵּל"], ["ניצלה", "נִצְּלָה"], ["ניצלנו", "נִצַּלְנוּ"], ["ניצלתם", "נִצַּלְתֶּם"], ["ניצלתן", "נִצַּלְתֶּן"], ["ניצלו", "נִצְּלוּ"]],
      future: [["אנצל", "אֲנַצֵּל"], ["תנצל", "תְּנַצֵּל"], ["תנצלי", "תְּנַצְּלִי"], ["ינצל", "יְנַצֵּל"], ["תנצל", "תְּנַצֵּל"], ["ננצל", "נְנַצֵּל"], ["תנצלו", "תְּנַצְּלוּ"], ["ינצלו", "יְנַצְּלוּ"]],
      imperative: [["נצל", "נַצֵּל"], ["נצלי", "נַצְּלִי"], ["נצלו", "נַצְּלוּ"]],
    },
    {
      id: "advanced-verb-levaes", lemma: "לבאס", lemma_niqqud: "לְבָאֵס", root: ["ב", "א", "ס"], binyan: "piel", regularity: "irregular", gloss: "to bum out", difficulty_level: 3,
      present: [["מבאס", "מְבָאֵס"], ["מבאסת", "מְבָאֶסֶת"], ["מבאסים", "מְבָאֲסִים"], ["מבאסות", "מְבָאֲסוֹת"]],
      past: [["באסתי", "בֵּאַסְתִּי"], ["באסת", "בֵּאַסְתָּ"], ["באסת", "בֵּאַסְתְּ"], ["באס", "בֵּאֵס"], ["באסה", "בֵּאֲסָה"], ["באסנו", "בֵּאַסְנוּ"], ["באסתם", "בֵּאַסְתֶּם"], ["באסתן", "בֵּאַסְתֶּן"], ["באסו", "בֵּאֲסוּ"]],
      future: [["אבאס", "אֲבָאֵס"], ["תבאס", "תְּבָאֵס"], ["תבאסי", "תְּבָאֲסִי"], ["יבאס", "יְבָאֵס"], ["תבאס", "תְּבָאֵס"], ["נבאס", "נְבָאֵס"], ["תבאסו", "תְּבָאֲסוּ"], ["יבאסו", "יְבָאֲסוּ"]],
      imperative: [["באס", "בָּאֵס"], ["באסי", "בָּאֲסִי"], ["באסו", "בָּאֲסוּ"]],
    },
    {
      id: "advanced-verb-lehatzchik", lemma: "להצחיק", lemma_niqqud: "לְהַצְחִיק", root: ["צ", "ח", "ק"], binyan: "hifil", regularity: "regular", gloss: "to make laugh", difficulty_level: 3,
      present: [["מצחיק", "מַצְחִיק"], ["מצחיקה", "מַצְחִיקָה"], ["מצחיקים", "מַצְחִיקִים"], ["מצחיקות", "מַצְחִיקוֹת"]],
      past: [["הצחקתי", "הִצְחַקְתִּי"], ["הצחקת", "הִצְחַקְתָּ"], ["הצחקת", "הִצְחַקְתְּ"], ["הצחיק", "הִצְחִיק"], ["הצחיקה", "הִצְחִיקָה"], ["הצחקנו", "הִצְחַקְנוּ"], ["הצחקתם", "הִצְחַקְתֶּם"], ["הצחקתן", "הִצְחַקְתֶּן"], ["הצחיקו", "הִצְחִיקוּ"]],
      future: [["אצחיק", "אַצְחִיק"], ["תצחיק", "תַּצְחִיק"], ["תצחיקי", "תַּצְחִיקִי"], ["יצחיק", "יַצְחִיק"], ["תצחיק", "תַּצְחִיק"], ["נצחיק", "נַצְחִיק"], ["תצחיקו", "תַּצְחִיקוּ"], ["יצחיקו", "יַצְחִיקוּ"]],
      imperative: [["הצחק", "הַצְחֵק"], ["הצחיקי", "הַצְחִיקִי"], ["הצחיקו", "הַצְחִיקוּ"]],
    },
    {
      id: "advanced-verb-leramot", lemma: "לרמות", lemma_niqqud: "לְרַמּוֹת", root: ["ר", "מ", "ה"], binyan: "piel", regularity: "irregular", gloss: "to deceive", difficulty_level: 3,
      present: [["מרמה", "מְרַמֶּה"], ["מרמה", "מְרַמָּה"], ["מרמים", "מְרַמִּים"], ["מרמות", "מְרַמּוֹת"]],
      past: [["רימיתי", "רִמִּיתִי"], ["רימית", "רִמִּיתָ"], ["רימית", "רִמִּית"], ["רימה", "רִמָּה"], ["רימתה", "רִמְּתָה"], ["רימינו", "רִמִּינוּ"], ["רימיתם", "רִמִּיתֶם"], ["רימיתן", "רִמִּיתֶן"], ["רימו", "רִמּוּ"]],
      future: [["ארמה", "אֲרַמֶּה"], ["תרמה", "תְּרַמֶּה"], ["תרמי", "תְּרַמִּי"], ["ירמה", "יְרַמֶּה"], ["תרמה", "תְּרַמֶּה"], ["נרמה", "נְרַמֶּה"], ["תרמו", "תְּרַמּוּ"], ["ירמו", "יְרַמּוּ"]],
      imperative: [["רמה", "רַמֵּה"], ["רמי", "רַמִּי"], ["רמו", "רַמּוּ"]],
    },
    {
      id: "advanced-verb-lehotzi", lemma: "להוציא", lemma_niqqud: "לְהוֹצִיא", root: ["י", "צ", "א"], binyan: "hifil", regularity: "irregular", gloss: "to take out", difficulty_level: 2,
      present: [["מוציא", "מוֹצִיא"], ["מוציאה", "מוֹצִיאָה"], ["מוציאים", "מוֹצִיאִים"], ["מוציאות", "מוֹצִיאוֹת"]],
      past: [["הוצאתי", "הוֹצֵאתִי"], ["הוצאת", "הוֹצֵאתָ"], ["הוצאת", "הוֹצֵאת"], ["הוציא", "הוֹצִיא"], ["הוציאה", "הוֹצִיאָה"], ["הוצאנו", "הוֹצֵאנוּ"], ["הוצאתם", "הוֹצֵאתֶם"], ["הוצאתן", "הוֹצֵאתֶן"], ["הוציאו", "הוֹצִיאוּ"]],
      future: [["אוציא", "אוֹצִיא"], ["תוציא", "תּוֹצִיא"], ["תוציאי", "תּוֹצִיאִי"], ["יוציא", "יוֹצִיא"], ["תוציא", "תּוֹצִיא"], ["נוציא", "נוֹצִיא"], ["תוציאו", "תּוֹצִיאוּ"], ["יוציאו", "יוֹצִיאוּ"]],
      imperative: [["הוצא", "הוֹצֵא"], ["הוציאי", "הוֹצִיאִי"], ["הוציאו", "הוֹצִיאוּ"]],
    },
    {
      id: "advanced-verb-litfos", lemma: "לתפוס", lemma_niqqud: "לִתְפֹּס", root: ["ת", "פ", "ס"], binyan: "paal", regularity: "regular", gloss: "to catch", difficulty_level: 2,
      present: [["תופס", "תּוֹפֵס"], ["תופסת", "תּוֹפֶסֶת"], ["תופסים", "תּוֹפְסִים"], ["תופסות", "תּוֹפְסוֹת"]],
      past: [["תפסתי", "תָּפַסְתִּי"], ["תפסת", "תָּפַסְתָּ"], ["תפסת", "תָּפַסְתְּ"], ["תפס", "תָּפַס"], ["תפסה", "תָּפְסָה"], ["תפסנו", "תָּפַסְנוּ"], ["תפסתם", "תְּפַסְתֶּם"], ["תפסתן", "תְּפַסְתֶּן"], ["תפסו", "תָּפְסוּ"]],
      future: [["אתפוס", "אֶתְפֹּס"], ["תתפוס", "תִּתְפֹּס"], ["תתפסי", "תִּתְפְּסִי"], ["יתפוס", "יִתְפֹּס"], ["תתפוס", "תִּתְפֹּס"], ["נתפוס", "נִתְפֹּס"], ["תתפסו", "תִּתְפְּסוּ"], ["יתפסו", "יִתְפְּסוּ"]],
      imperative: [["תפוס", "תְּפֹס"], ["תפסי", "תִּפְסִי"], ["תפסו", "תִּפְסוּ"]],
    },
    {
      id: "advanced-verb-lehaamid", lemma: "להעמיד", lemma_niqqud: "לְהַעֲמִיד", root: ["ע", "מ", "ד"], binyan: "hifil", regularity: "irregular", gloss: "to stand up", difficulty_level: 3,
      present: [["מעמיד", "מַעֲמִיד"], ["מעמידה", "מַעֲמִידָה"], ["מעמידים", "מַעֲמִידִים"], ["מעמידות", "מַעֲמִידוֹת"]],
      past: [["העמדתי", "הֶעֱמַדְתִּי"], ["העמדת", "הֶעֱמַדְתָּ"], ["העמדת", "הֶעֱמַדְתְּ"], ["העמיד", "הֶעֱמִיד"], ["העמידה", "הֶעֱמִידָה"], ["העמדנו", "הֶעֱמַדְנוּ"], ["העמדתם", "הֶעֱמַדְתֶּם"], ["העמדתן", "הֶעֱמַדְתֶּן"], ["העמידו", "הֶעֱמִידוּ"]],
      future: [["אעמיד", "אַעֲמִיד"], ["תעמיד", "תַּעֲמִיד"], ["תעמידי", "תַּעֲמִידִי"], ["יעמיד", "יַעֲמִיד"], ["תעמיד", "תַּעֲמִיד"], ["נעמיד", "נַעֲמִיד"], ["תעמידו", "תַּעֲמִידוּ"], ["יעמידו", "יַעֲמִידוּ"]],
      imperative: [["העמד", "הַעֲמֵד"], ["העמידי", "הַעֲמִידִי"], ["העמידו", "הַעֲמִידוּ"]],
    },
    {
      id: "advanced-verb-lishbor", lemma: "לשבור", lemma_niqqud: "לִשְׁבּוֹר", root: ["ש", "ב", "ר"], binyan: "paal", regularity: "regular", gloss: "to break", difficulty_level: 2,
      present: [["שובר", "שׁוֹבֵר"], ["שוברת", "שׁוֹבֶרֶת"], ["שוברים", "שׁוֹבְרִים"], ["שוברות", "שׁוֹבְרוֹת"]],
      past: [["שברתי", "שָׁבַרְתִּי"], ["שברת", "שָׁבַרְתָּ"], ["שברת", "שָׁבַרְתְּ"], ["שבר", "שָׁבַר"], ["שברה", "שָׁבְרָה"], ["שברנו", "שָׁבַרְנוּ"], ["שברתם", "שְׁבַרְתֶּם"], ["שברתן", "שְׁבַרְתֶּן"], ["שברו", "שָׁבְרוּ"]],
      future: [["אשבור", "אֶשְׁבֹּר"], ["תשבור", "תִּשְׁבֹּר"], ["תשברי", "תִּשְׁבְּרִי"], ["ישבור", "יִשְׁבֹּר"], ["תשבור", "תִּשְׁבֹּר"], ["נשבור", "נִשְׁבֹּר"], ["תשברו", "תִּשְׁבְּרוּ"], ["ישברו", "יִשְׁבְּרוּ"]],
      imperative: [["שבור", "שְׁבֹר"], ["שברי", "שִׁבְרִי"], ["שברו", "שִׁבְרוּ"]],
    },
    {
      id: "advanced-verb-lignov", lemma: "לגנוב", lemma_niqqud: "לִגְנוֹב", root: ["ג", "נ", "ב"], binyan: "paal", regularity: "regular", gloss: "to steal", difficulty_level: 2,
      present: [["גונב", "גּוֹנֵב"], ["גונבת", "גּוֹנֶבֶת"], ["גונבים", "גּוֹנְבִים"], ["גונבות", "גּוֹנְבוֹת"]],
      past: [["גנבתי", "גָּנַבְתִּי"], ["גנבת", "גָּנַבְתָּ"], ["גנבת", "גָּנַבְתְּ"], ["גנב", "גָּנַב"], ["גנבה", "גָּנְבָה"], ["גנבנו", "גָּנַבְנוּ"], ["גנבתם", "גְּנַבְתֶּם"], ["גנבתן", "גְּנַבְתֶּן"], ["גנבו", "גָּנְבוּ"]],
      future: [["אגנוב", "אֶגְנֹב"], ["תגנוב", "תִּגְנֹב"], ["תגנבי", "תִּגְנְבִי"], ["יגנוב", "יִגְנֹב"], ["תגנוב", "תִּגְנֹב"], ["נגנוב", "נִגְנֹב"], ["תגנבו", "תִּגְנְבוּ"], ["יגנבו", "יִגְנְבוּ"]],
      imperative: [["גנוב", "גְּנֹב"], ["גנבי", "גִּנְבִי"], ["גנבו", "גִּנְבוּ"]],
    },
    {
      id: "advanced-verb-lishtof", lemma: "לשטוף", lemma_niqqud: "לִשְׁטוֹף", root: ["ש", "ט", "פ"], binyan: "paal", regularity: "regular", gloss: "to rinse", difficulty_level: 2,
      present: [["שוטף", "שׁוֹטֵף"], ["שוטפת", "שׁוֹטֶפֶת"], ["שוטפים", "שׁוֹטְפִים"], ["שוטפות", "שׁוֹטְפוֹת"]],
      past: [["שטפתי", "שָׁטַפְתִּי"], ["שטפת", "שָׁטַפְתָּ"], ["שטפת", "שָׁטַפְתְּ"], ["שטף", "שָׁטַף"], ["שטפה", "שָׁטְפָה"], ["שטפנו", "שָׁטַפְנוּ"], ["שטפתם", "שְׁטַפְתֶּם"], ["שטפתן", "שְׁטַפְתֶּן"], ["שטפו", "שָׁטְפוּ"]],
      future: [["אשטוף", "אֶשְׁטֹף"], ["תשטוף", "תִּשְׁטֹף"], ["תשטפי", "תִּשְׁטְפִי"], ["ישטוף", "יִשְׁטֹף"], ["תשטוף", "תִּשְׁטֹף"], ["נשטוף", "נִשְׁטֹף"], ["תשטפו", "תִּשְׁטְפוּ"], ["ישטפו", "יִשְׁטְפוּ"]],
      imperative: [["שטוף", "שְׁטֹף"], ["שטפי", "שִׁטְפִי"], ["שטפו", "שִׁטְפוּ"]],
    },
    {
      id: "advanced-verb-limrot", lemma: "למרוט", lemma_niqqud: "לִמְרוֹט", root: ["מ", "ר", "ט"], binyan: "paal", regularity: "regular", gloss: "to pluck", difficulty_level: 3,
      present: [["מורט", "מוֹרֵט"], ["מורטת", "מוֹרֶטֶת"], ["מורטים", "מוֹרְטִים"], ["מורטות", "מוֹרְטוֹת"]],
      past: [["מרטתי", "מָרַטְתִּי"], ["מרטת", "מָרַטְתָּ"], ["מרטת", "מָרַטְתְּ"], ["מרט", "מָרַט"], ["מרטה", "מָרְטָה"], ["מרטנו", "מָרַטְנוּ"], ["מרטתם", "מְרַטְתֶּם"], ["מרטתן", "מְרַטְתֶּן"], ["מרטו", "מָרְטוּ"]],
      future: [["אמרוט", "אֶמְרֹט"], ["תמרוט", "תִּמְרֹט"], ["תמרטי", "תִּמְרְטִי"], ["ימרוט", "יִמְרֹט"], ["תמרוט", "תִּמְרֹט"], ["נמרוט", "נִמְרֹט"], ["תמרטו", "תִּמְרְטוּ"], ["ימרטו", "יִמְרְטוּ"]],
      imperative: [["מרוט", "מְרֹט"], ["מרטי", "מִרְטִי"], ["מרטו", "מִרְטוּ"]],
    },
    {
      id: "advanced-verb-lidroch", lemma: "לדרוך", lemma_niqqud: "לִדְרוֹךְ", root: ["ד", "ר", "כ"], binyan: "paal", regularity: "regular", gloss: "to step", difficulty_level: 2,
      present: [["דורך", "דּוֹרֵךְ"], ["דורכת", "דּוֹרֶכֶת"], ["דורכים", "דּוֹרְכִים"], ["דורכות", "דּוֹרְכוֹת"]],
      past: [["דרכתי", "דָּרַכְתִּי"], ["דרכת", "דָּרַכְתָּ"], ["דרכת", "דָּרַכְתְּ"], ["דרך", "דָּרַךְ"], ["דרכה", "דָּרְכָה"], ["דרכנו", "דָּרַכְנוּ"], ["דרכתם", "דְּרַכְתֶּם"], ["דרכתן", "דְּרַכְתֶּן"], ["דרכו", "דָּרְכוּ"]],
      future: [["אדרוך", "אֶדְרֹךְ"], ["תדרוך", "תִּדְרֹךְ"], ["תדרכי", "תִּדְרְכִי"], ["ידרוך", "יִדְרֹךְ"], ["תדרוך", "תִּדְרֹךְ"], ["נדרוך", "נִדְרֹךְ"], ["תדרכו", "תִּדְרְכוּ"], ["ידרכו", "יִדְרְכוּ"]],
      imperative: [["דרוך", "דְּרֹךְ"], ["דרכי", "דִּרְכִי"], ["דרכו", "דִּרְכוּ"]],
    },
    {
      id: "advanced-verb-litzbot", lemma: "לצבוט", lemma_niqqud: "לִצְבּוֹט", root: ["צ", "ב", "ט"], binyan: "paal", regularity: "regular", gloss: "to pinch", difficulty_level: 3,
      present: [["צובט", "צוֹבֵט"], ["צובטת", "צוֹבֶטֶת"], ["צובטים", "צוֹבְטִים"], ["צובטות", "צוֹבְטוֹת"]],
      past: [["צבטתי", "צָבַטְתִּי"], ["צבטת", "צָבַטְתָּ"], ["צבטת", "צָבַטְתְּ"], ["צבט", "צָבַט"], ["צבטה", "צָבְטָה"], ["צבטנו", "צָבַטְנוּ"], ["צבטתם", "צְבַטְתֶּם"], ["צבטתן", "צְבַטְתֶּן"], ["צבטו", "צָבְטוּ"]],
      future: [["אצבוט", "אֶצְבֹּט"], ["תצבוט", "תִּצְבֹּט"], ["תצבטי", "תִּצְבְּטִי"], ["יצבוט", "יִצְבֹּט"], ["תצבוט", "תִּצְבֹּט"], ["נצבוט", "נִצְבֹּט"], ["תצבטו", "תִּצְבְּטוּ"], ["יצבטו", "יִצְבְּטוּ"]],
      imperative: [["צבוט", "צְבֹט"], ["צבטי", "צִבְטִי"], ["צבטו", "צִבְטוּ"]],
    },
    {
      id: "advanced-verb-lizrok", lemma: "לזרוק", lemma_niqqud: "לִזְרוֹק", root: ["ז", "ר", "ק"], binyan: "paal", regularity: "regular", gloss: "to throw", difficulty_level: 2,
      present: [["זורק", "זוֹרֵק"], ["זורקת", "זוֹרֶקֶת"], ["זורקים", "זוֹרְקִים"], ["זורקות", "זוֹרְקוֹת"]],
      past: [["זרקתי", "זָרַקְתִּי"], ["זרקת", "זָרַקְתָּ"], ["זרקת", "זָרַקְתְּ"], ["זרק", "זָרַק"], ["זרקה", "זָרְקָה"], ["זרקנו", "זָרַקְנוּ"], ["זרקתם", "זְרַקְתֶּם"], ["זרקתן", "זְרַקְתֶּן"], ["זרקו", "זָרְקוּ"]],
      future: [["אזרוק", "אֶזְרֹק"], ["תזרוק", "תִּזְרֹק"], ["תזרקי", "תִּזְרְקִי"], ["יזרוק", "יִזְרֹק"], ["תזרוק", "תִּזְרֹק"], ["נזרוק", "נִזְרֹק"], ["תזרקו", "תִּזְרְקוּ"], ["יזרקו", "יִזְרְקוּ"]],
      imperative: [["זרוק", "זְרֹק"], ["זרקי", "זִרְקִי"], ["זרקו", "זִרְקוּ"]],
    },
    {
      id: "advanced-verb-lidfok", lemma: "לדפוק", lemma_niqqud: "לִדְפּוֹק", root: ["ד", "פ", "ק"], binyan: "paal", regularity: "regular", gloss: "to knock", difficulty_level: 2,
      present: [["דופק", "דּוֹפֵק"], ["דופקת", "דּוֹפֶקֶת"], ["דופקים", "דּוֹפְקִים"], ["דופקות", "דּוֹפְקוֹת"]],
      past: [["דפקתי", "דָּפַקְתִּי"], ["דפקת", "דָּפַקְתָּ"], ["דפקת", "דָּפַקְתְּ"], ["דפק", "דָּפַק"], ["דפקה", "דָּפְקָה"], ["דפקנו", "דָּפַקְנוּ"], ["דפקתם", "דְּפַקְתֶּם"], ["דפקתן", "דְּפַקְתֶּן"], ["דפקו", "דָּפְקוּ"]],
      future: [["אדפוק", "אֶדְפֹּק"], ["תדפוק", "תִּדְפֹּק"], ["תדפקי", "תִּדְפְּקִי"], ["ידפוק", "יִדְפֹּק"], ["תדפוק", "תִּדְפֹּק"], ["נדפוק", "נִדְפֹּק"], ["תדפקו", "תִּדְפְּקוּ"], ["ידפקו", "יִדְפְּקוּ"]],
      imperative: [["דפוק", "דְּפֹק"], ["דפקי", "דִּפְקִי"], ["דפקו", "דִּפְקוּ"]],
    },
    {
      id: "advanced-verb-lachsoch", lemma: "לחסוך", lemma_niqqud: "לַחְסוֹךְ", root: ["ח", "ס", "כ"], binyan: "paal", regularity: "irregular", gloss: "to spare", difficulty_level: 3,
      present: [["חוסך", "חוֹסֵךְ"], ["חוסכת", "חוֹסֶכֶת"], ["חוסכים", "חוֹסְכִים"], ["חוסכות", "חוֹסְכוֹת"]],
      past: [["חסכתי", "חָסַכְתִּי"], ["חסכת", "חָסַכְתָּ"], ["חסכת", "חָסַכְתְּ"], ["חסך", "חָסַךְ"], ["חסכה", "חָסְכָה"], ["חסכנו", "חָסַכְנוּ"], ["חסכתם", "חֲסַכְתֶּם"], ["חסכתן", "חֲסַכְתֶּן"], ["חסכו", "חָסְכוּ"]],
      future: [["אחסוך", "אֶחְסֹךְ"], ["תחסוך", "תַּחְסֹךְ"], ["תחסכי", "תַּחְסְכִי"], ["יחסוך", "יַחְסֹךְ"], ["תחסוך", "תַּחְסֹךְ"], ["נחסוך", "נַחְסֹךְ"], ["תחסכו", "תַּחְסְכוּ"], ["יחסכו", "יַחְסְכוּ"]],
      imperative: [["חסוך", "חֲסֹךְ"], ["חסכי", "חִסְכִי"], ["חסכו", "חִסְכוּ"]],
    },
    {
      id: "advanced-verb-lahafoch", lemma: "להפוך", lemma_niqqud: "לַהֲפוֹךְ", root: ["ה", "פ", "כ"], binyan: "paal", regularity: "irregular", gloss: "to turn over", difficulty_level: 3,
      present: [["הופך", "הוֹפֵךְ"], ["הופכת", "הוֹפֶכֶת"], ["הופכים", "הוֹפְכִים"], ["הופכות", "הוֹפְכוֹת"]],
      past: [["הפכתי", "הָפַכְתִּי"], ["הפכת", "הָפַכְתָּ"], ["הפכת", "הָפַכְתְּ"], ["הפך", "הָפַךְ"], ["הפכה", "הָפְכָה"], ["הפכנו", "הָפַכְנוּ"], ["הפכתם", "הֲפַכְתֶּם"], ["הפכתן", "הֲפַכְתֶּן"], ["הפכו", "הָפְכוּ"]],
      future: [["אהפוך", "אֶהְפֹּךְ"], ["תהפוך", "תַּהֲפֹךְ"], ["תהפכי", "תַּהַפְכִי"], ["יהפוך", "יַהֲפֹךְ"], ["תהפוך", "תַּהֲפֹךְ"], ["נהפוך", "נַהֲפֹךְ"], ["תהפכו", "תַּהַפְכוּ"], ["יהפכו", "יַהַפְכוּ"]],
      imperative: [["הפוך", "הֲפֹךְ"], ["הפכי", "הִפְכִי"], ["הפכו", "הִפְכוּ"]],
    },
    {
      id: "advanced-verb-lisrof", lemma: "לשרוף", lemma_niqqud: "לִשְׂרוֹף", root: ["ש", "ר", "פ"], binyan: "paal", regularity: "regular", gloss: "to burn", difficulty_level: 2,
      present: [["שורף", "שׂוֹרֵף"], ["שורפת", "שׂוֹרֶפֶת"], ["שורפים", "שׂוֹרְפִים"], ["שורפות", "שׂוֹרְפוֹת"]],
      past: [["שרפתי", "שָׂרַפְתִּי"], ["שרפת", "שָׂרַפְתָּ"], ["שרפת", "שָׂרַפְתְּ"], ["שרף", "שָׂרַף"], ["שרפה", "שָׂרְפָה"], ["שרפנו", "שָׂרַפְנוּ"], ["שרפתם", "שְׂרַפְתֶּם"], ["שרפתן", "שְׂרַפְתֶּן"], ["שרפו", "שָׂרְפוּ"]],
      future: [["אשרוף", "אֶשְׂרֹף"], ["תשרוף", "תִּשְׂרֹף"], ["תשרפי", "תִּשְׂרְפִי"], ["ישרוף", "יִשְׂרֹף"], ["תשרוף", "תִּשְׂרֹף"], ["נשרוף", "נִשְׂרֹף"], ["תשרפו", "תִּשְׂרְפוּ"], ["ישרפו", "יִשְׂרְפוּ"]],
      imperative: [["שרוף", "שְׂרֹף"], ["שרפי", "שִׂרְפִי"], ["שרפו", "שִׂרְפוּ"]],
    },
    {
      id: "advanced-verb-laharog", lemma: "להרוג", lemma_niqqud: "לַהֲרוֹג", root: ["ה", "ר", "ג"], binyan: "paal", regularity: "irregular", gloss: "to kill", difficulty_level: 2,
      present: [["הורג", "הוֹרֵג"], ["הורגת", "הוֹרֶגֶת"], ["הורגים", "הוֹרְגִים"], ["הורגות", "הוֹרְגוֹת"]],
      past: [["הרגתי", "הָרַגְתִּי"], ["הרגת", "הָרַגְתָּ"], ["הרגת", "הָרַגְתְּ"], ["הרג", "הָרַג"], ["הרגה", "הָרְגָה"], ["הרגנו", "הָרַגְנוּ"], ["הרגתם", "הֲרַגְתֶּם"], ["הרגתן", "הֲרַגְתֶּן"], ["הרגו", "הָרְגוּ"]],
      future: [["אהרוג", "אֶהֱרֹג"], ["תהרוג", "תַּהֲרֹג"], ["תהרגי", "תַּהַרְגִי"], ["יהרוג", "יַהֲרֹג"], ["תהרוג", "תַּהֲרֹג"], ["נהרוג", "נַהֲרֹג"], ["תהרגו", "תַּהַרְגוּ"], ["יהרגו", "יַהַרְגוּ"]],
      imperative: [["הרוג", "הֲרֹג"], ["הרגי", "הִרְגִי"], ["הרגו", "הִרְגוּ"]],
    },
    {
      id: "advanced-verb-lischov", lemma: "לסחוב", lemma_niqqud: "לִסְחוֹב", root: ["ס", "ח", "ב"], binyan: "paal", regularity: "irregular", gloss: "to lug", difficulty_level: 2,
      present: [["סוחב", "סוֹחֵב"], ["סוחבת", "סוֹחֶבֶת"], ["סוחבים", "סוֹחֲבִים"], ["סוחבות", "סוֹחֲבוֹת"]],
      past: [["סחבתי", "סָחַבְתִּי"], ["סחבת", "סָחַבְתָּ"], ["סחבת", "סָחַבְתְּ"], ["סחב", "סָחַב"], ["סחבה", "סָחֲבָה"], ["סחבנו", "סָחַבְנוּ"], ["סחבתם", "סְחַבְתֶּם"], ["סחבתן", "סְחַבְתֶּן"], ["סחבו", "סָחֲבוּ"]],
      future: [["אסחב", "אֶסְחַב"], ["תסחב", "תִּסְחַב"], ["תסחבי", "תִּסְחֲבִי"], ["יסחב", "יִסְחַב"], ["תסחב", "תִּסְחַב"], ["נסחב", "נִסְחַב"], ["תסחבו", "תִּסְחֲבוּ"], ["יסחבו", "יִסְחֲבוּ"]],
      imperative: [["סחב", "סְחַב"], ["סחבי", "סַחֲבִי"], ["סחבו", "סַחֲבוּ"]],
    },
    {
      id: "advanced-verb-lidchof", lemma: "לדחוף", lemma_niqqud: "לִדְחוֹף", root: ["ד", "ח", "פ"], binyan: "paal", regularity: "irregular", gloss: "to shove", difficulty_level: 2,
      present: [["דוחף", "דּוֹחֵף"], ["דוחפת", "דּוֹחֶפֶת"], ["דוחפים", "דּוֹחֲפִים"], ["דוחפות", "דּוֹחֲפוֹת"]],
      past: [["דחפתי", "דָּחַפְתִּי"], ["דחפת", "דָּחַפְתָּ"], ["דחפת", "דָּחַפְתְּ"], ["דחף", "דָּחַף"], ["דחפה", "דָּחֲפָה"], ["דחפנו", "דָּחַפְנוּ"], ["דחפתם", "דְּחַפְתֶּם"], ["דחפתן", "דְּחַפְתֶּן"], ["דחפו", "דָּחֲפוּ"]],
      future: [["אדחף", "אֶדְחַף"], ["תדחף", "תִּדְחַף"], ["תדחפי", "תִּדְחֲפִי"], ["ידחף", "יִדְחַף"], ["תדחף", "תִּדְחַף"], ["נדחף", "נִדְחַף"], ["תדחפו", "תִּדְחֲפוּ"], ["ידחפו", "יִדְחֲפוּ"]],
      imperative: [["דחף", "דְּחַף"], ["דחפי", "דַּחֲפִי"], ["דחפו", "דַּחֲפוּ"]],
    },
    {
      id: "advanced-verb-likroa", lemma: "לקרוע", lemma_niqqud: "לִקְרוֹעַ", root: ["ק", "ר", "ע"], binyan: "paal", regularity: "irregular", gloss: "to tear", difficulty_level: 2,
      present: [["קורע", "קוֹרֵעַ"], ["קורעת", "קוֹרַעַת"], ["קורעים", "קוֹרְעִים"], ["קורעות", "קוֹרְעוֹת"]],
      past: [["קרעתי", "קָרַעְתִּי"], ["קרעת", "קָרַעְתָּ"], ["קרעת", "קָרַעְתְּ"], ["קרע", "קָרַע"], ["קרעה", "קָרְעָה"], ["קרענו", "קָרַעְנוּ"], ["קרעתם", "קְרַעְתֶּם"], ["קרעתן", "קְרַעְתֶּן"], ["קרעו", "קָרְעוּ"]],
      future: [["אקרע", "אֶקְרַע"], ["תקרע", "תִּקְרַע"], ["תקרעי", "תִּקְרְעִי"], ["יקרע", "יִקְרַע"], ["תקרע", "תִּקְרַע"], ["נקרע", "נִקְרַע"], ["תקרעו", "תִּקְרְעוּ"], ["יקרעו", "יִקְרְעוּ"]],
      imperative: [["קרע", "קְרַע"], ["קרעי", "קִרְעִי"], ["קרעו", "קִרְעוּ"]],
    },
    {
      id: "advanced-verb-liktoa", lemma: "לקטוע", lemma_niqqud: "לִקְטוֹעַ", root: ["ק", "ט", "ע"], binyan: "paal", regularity: "irregular", gloss: "to cut off", difficulty_level: 4,
      present: [["קוטע", "קוֹטֵעַ"], ["קוטעת", "קוֹטַעַת"], ["קוטעים", "קוֹטְעִים"], ["קוטעות", "קוֹטְעוֹת"]],
      past: [["קטעתי", "קָטַעְתִּי"], ["קטעת", "קָטַעְתָּ"], ["קטעת", "קָטַעְתְּ"], ["קטע", "קָטַע"], ["קטעה", "קָטְעָה"], ["קטענו", "קָטַעְנוּ"], ["קטעתם", "קְטַעְתֶּם"], ["קטעתן", "קְטַעְתֶּן"], ["קטעו", "קָטְעוּ"]],
      future: [["אקטע", "אֶקְטַע"], ["תקטע", "תִּקְטַע"], ["תקטעי", "תִּקְטְעִי"], ["יקטע", "יִקְטַע"], ["תקטע", "תִּקְטַע"], ["נקטע", "נִקְטַע"], ["תקטעו", "תִּקְטְעוּ"], ["יקטעו", "יִקְטְעוּ"]],
      imperative: [["קטע", "קְטַע"], ["קטעי", "קִטְעִי"], ["קטעו", "קִטְעוּ"]],
    },
    {
      id: "advanced-verb-limroach", lemma: "למרוח", lemma_niqqud: "לִמְרוֹחַ", root: ["מ", "ר", "ח"], binyan: "paal", regularity: "irregular", gloss: "to smear", difficulty_level: 3,
      present: [["מורח", "מוֹרֵחַ"], ["מורחת", "מוֹרַחַת"], ["מורחים", "מוֹרְחִים"], ["מורחות", "מוֹרְחוֹת"]],
      past: [["מרחתי", "מָרַחְתִּי"], ["מרחת", "מָרַחְתָּ"], ["מרחת", "מָרַחְתְּ"], ["מרח", "מָרַח"], ["מרחה", "מָרְחָה"], ["מרחנו", "מָרַחְנוּ"], ["מרחתם", "מְרַחְתֶּם"], ["מרחתן", "מְרַחְתֶּן"], ["מרחו", "מָרְחוּ"]],
      future: [["אמרח", "אֶמְרַח"], ["תמרח", "תִּמְרַח"], ["תמרחי", "תִּמְרְחִי"], ["ימרח", "יִמְרַח"], ["תמרח", "תִּמְרַח"], ["נמרח", "נִמְרַח"], ["תמרחו", "תִּמְרְחוּ"], ["ימרחו", "יִמְרְחוּ"]],
      imperative: [["מרח", "מְרַח"], ["מרחי", "מִרְחִי"], ["מרחו", "מִרְחוּ"]],
    },
    {
      id: "advanced-verb-lizrot", lemma: "לזרות", lemma_niqqud: "לִזְרוֹת", root: ["ז", "ר", "ה"], binyan: "paal", regularity: "irregular", gloss: "to scatter", difficulty_level: 4,
      present: [["זורה", "זוֹרֶה"], ["זורה", "זוֹרָה"], ["זורים", "זוֹרִים"], ["זורות", "זוֹרוֹת"]],
      past: [["זריתי", "זָרִיתִי"], ["זרית", "זָרִיתָ"], ["זרית", "זָרִית"], ["זרה", "זָרָה"], ["זרתה", "זָרְתָה"], ["זרינו", "זָרִינוּ"], ["זריתם", "זְרִיתֶם"], ["זריתן", "זְרִיתֶן"], ["זרו", "זָרוּ"]],
      future: [["אזרה", "אֶזְרֶה"], ["תזרה", "תִּזְרֶה"], ["תזרי", "תִּזְרִי"], ["יזרה", "יִזְרֶה"], ["תזרה", "תִּזְרֶה"], ["נזרה", "נִזְרֶה"], ["תזרו", "תִּזְרוּ"], ["יזרו", "יִזְרוּ"]],
      imperative: [["זרה", "זְרֵה"], ["זרי", "זְרִי"], ["זרו", "זְרוּ"]],
    },
    {
      id: "advanced-verb-lesovev", lemma: "לסובב", lemma_niqqud: "לְסוֹבֵב", root: ["ס", "ב", "ב"], binyan: "piel", regularity: "irregular", gloss: "to spin", difficulty_level: 3,
      present: [["מסובב", "מְסוֹבֵב"], ["מסובבת", "מְסוֹבֶבֶת"], ["מסובבים", "מְסוֹבְבִים"], ["מסובבות", "מְסוֹבְבוֹת"]],
      past: [["סובבתי", "סוֹבַבְתִּי"], ["סובבת", "סוֹבַבְתָּ"], ["סובבת", "סוֹבַבְתְּ"], ["סובב", "סוֹבֵב"], ["סובבה", "סוֹבְבָה"], ["סובבנו", "סוֹבַבְנוּ"], ["סובבתם", "סוֹבַבְתֶּם"], ["סובבתן", "סוֹבַבְתֶּן"], ["סובבו", "סוֹבְבוּ"]],
      future: [["אסובב", "אֲסוֹבֵב"], ["תסובב", "תְּסוֹבֵב"], ["תסובבי", "תְּסוֹבְבִי"], ["יסובב", "יְסוֹבֵב"], ["תסובב", "תְּסוֹבֵב"], ["נסובב", "נְסוֹבֵב"], ["תסובבו", "תְּסוֹבְבוּ"], ["יסובבו", "יְסוֹבְבוּ"]],
      imperative: [["סובב", "סוֹבֵב"], ["סובבי", "סוֹבְבִי"], ["סובבו", "סוֹבְבוּ"]],
    },
    {
      id: "advanced-verb-lechamem", lemma: "לחמם", lemma_niqqud: "לְחַמֵּם", root: ["ח", "מ", "מ"], binyan: "piel", regularity: "regular", gloss: "to warm", difficulty_level: 2,
      present: [["מחמם", "מְחַמֵּם"], ["מחממת", "מְחַמֶּמֶת"], ["מחממים", "מְחַמְּמִים"], ["מחממות", "מְחַמְּמוֹת"]],
      past: [["חיממתי", "חִמַּמְתִּי"], ["חיממת", "חִמַּמְתָּ"], ["חיממת", "חִמַּמְתְּ"], ["חימם", "חִמֵּם"], ["חיממה", "חִמְּמָה"], ["חיממנו", "חִמַּמְנוּ"], ["חיממתם", "חִמַּמְתֶּם"], ["חיממתן", "חִמַּמְתֶּן"], ["חיממו", "חִמְּמוּ"]],
      future: [["אחמם", "אֲחַמֵּם"], ["תחמם", "תְּחַמֵּם"], ["תחממי", "תְּחַמְּמִי"], ["יחמם", "יְחַמֵּם"], ["תחמם", "תְּחַמֵּם"], ["נחמם", "נְחַמֵּם"], ["תחממו", "תְּחַמְּמוּ"], ["יחממו", "יְחַמְּמוּ"]],
      imperative: [["חמם", "חַמֵּם"], ["חממי", "חַמְּמִי"], ["חממו", "חַמְּמוּ"]],
    },
    {
      id: "advanced-verb-lechasel", lemma: "לחסל", lemma_niqqud: "לְחַסֵּל", root: ["ח", "ס", "ל"], binyan: "piel", regularity: "regular", gloss: "to eliminate", difficulty_level: 3,
      present: [["מחסל", "מְחַסֵּל"], ["מחסלת", "מְחַסֶּלֶת"], ["מחסלים", "מְחַסְּלִים"], ["מחסלות", "מְחַסְּלוֹת"]],
      past: [["חיסלתי", "חִסַּלְתִּי"], ["חיסלת", "חִסַּלְתָּ"], ["חיסלת", "חִסַּלְתְּ"], ["חיסל", "חִסֵּל"], ["חיסלה", "חִסְּלָה"], ["חיסלנו", "חִסַּלְנוּ"], ["חיסלתם", "חִסַּלְתֶּם"], ["חיסלתן", "חִסַּלְתֶּן"], ["חיסלו", "חִסְּלוּ"]],
      future: [["אחסל", "אֲחַסֵּל"], ["תחסל", "תְּחַסֵּל"], ["תחסלי", "תְּחַסְּלִי"], ["יחסל", "יְחַסֵּל"], ["תחסל", "תְּחַסֵּל"], ["נחסל", "נְחַסֵּל"], ["תחסלו", "תְּחַסְּלוּ"], ["יחסלו", "יְחַסְּלוּ"]],
      imperative: [["חסל", "חַסֵּל"], ["חסלי", "חַסְּלִי"], ["חסלו", "חַסְּלוּ"]],
    },
    {
      id: "advanced-verb-lemarer", lemma: "למרר", lemma_niqqud: "לְמָרֵר", root: ["מ", "ר", "ר"], binyan: "piel", regularity: "irregular", gloss: "to embitter", difficulty_level: 4,
      present: [["ממרר", "מְמָרֵר"], ["ממררת", "מְמָרֶרֶת"], ["ממררים", "מְמָרְרִים"], ["ממררות", "מְמָרְרוֹת"]],
      past: [["מיררתי", "מֵרַרְתִּי"], ["מיררת", "מֵרַרְתָּ"], ["מיררת", "מֵרַרְתְּ"], ["מירר", "מֵרֵר"], ["מיררה", "מֵרְרָה"], ["מיררנו", "מֵרַרְנוּ"], ["מיררתם", "מֵרַרְתֶּם"], ["מיררתן", "מֵרַרְתֶּן"], ["מיררו", "מֵרְרוּ"]],
      future: [["אמרר", "אֲמָרֵר"], ["תמרר", "תְּמָרֵר"], ["תמררי", "תְּמָרְרִי"], ["ימרר", "יְמָרֵר"], ["תמרר", "תְּמָרֵר"], ["נמרר", "נְמָרֵר"], ["תמררו", "תְּמָרְרוּ"], ["ימררו", "יְמָרְרוּ"]],
      imperative: [["מרר", "מָרֵר"], ["מררי", "מָרְרִי"], ["מררו", "מָרְרוּ"]],
    },
    {
      id: "advanced-verb-leshabesh", lemma: "לשבש", lemma_niqqud: "לְשַׁבֵּשׁ", root: ["ש", "ב", "ש"], binyan: "piel", regularity: "regular", gloss: "to disrupt", difficulty_level: 3,
      present: [["משבש", "מְשַׁבֵּשׁ"], ["משבשת", "מְשַׁבֶּשֶׁת"], ["משבשים", "מְשַׁבְּשִׁים"], ["משבשות", "מְשַׁבְּשׁוֹת"]],
      past: [["שיבשתי", "שִׁבַּשְׁתִּי"], ["שיבשת", "שִׁבַּשְׁתָּ"], ["שיבשת", "שִׁבַּשְׁתְּ"], ["שיבש", "שִׁבֵּשׁ"], ["שיבשה", "שִׁבְּשָׁה"], ["שיבשנו", "שִׁבַּשְׁנוּ"], ["שיבשתם", "שִׁבַּשְׁתֶּם"], ["שיבשתן", "שִׁבַּשְׁתֶּן"], ["שיבשו", "שִׁבְּשׁוּ"]],
      future: [["אשבש", "אֲשַׁבֵּשׁ"], ["תשבש", "תְּשַׁבֵּשׁ"], ["תשבשי", "תְּשַׁבְּשִׁי"], ["ישבש", "יְשַׁבֵּשׁ"], ["תשבש", "תְּשַׁבֵּשׁ"], ["נשבש", "נְשַׁבֵּשׁ"], ["תשבשו", "תְּשַׁבְּשׁוּ"], ["ישבשו", "יְשַׁבְּשׁוּ"]],
      imperative: [["שבש", "שַׁבֵּשׁ"], ["שבשי", "שַׁבְּשִׁי"], ["שבשו", "שַׁבְּשׁוּ"]],
    },
    {
      id: "advanced-verb-lechazek", lemma: "לחזק", lemma_niqqud: "לְחַזֵּק", root: ["ח", "ז", "ק"], binyan: "piel", regularity: "regular", gloss: "to strengthen", difficulty_level: 3,
      present: [["מחזק", "מְחַזֵּק"], ["מחזקת", "מְחַזֶּקֶת"], ["מחזקים", "מְחַזְּקִים"], ["מחזקות", "מְחַזְּקוֹת"]],
      past: [["חיזקתי", "חִזַּקְתִּי"], ["חיזקת", "חִזַּקְתָּ"], ["חיזקת", "חִזַּקְתְּ"], ["חיזק", "חִזֵּק"], ["חיזקה", "חִזְּקָה"], ["חיזקנו", "חִזַּקְנוּ"], ["חיזקתם", "חִזַּקְתֶּם"], ["חיזקתן", "חִזַּקְתֶּן"], ["חיזקו", "חִזְּקוּ"]],
      future: [["אחזק", "אֲחַזֵּק"], ["תחזק", "תְּחַזֵּק"], ["תחזקי", "תְּחַזְּקִי"], ["יחזק", "יְחַזֵּק"], ["תחזק", "תְּחַזֵּק"], ["נחזק", "נְחַזֵּק"], ["תחזקו", "תְּחַזְּקוּ"], ["יחזקו", "יְחַזְּקוּ"]],
      imperative: [["חזק", "חַזֵּק"], ["חזקי", "חַזְּקִי"], ["חזקו", "חַזְּקוּ"]],
    },
    {
      id: "advanced-verb-lefotzetz", lemma: "לפוצץ", lemma_niqqud: "לְפוֹצֵץ", root: ["פ", "צ", "צ"], binyan: "piel", regularity: "irregular", gloss: "to blow up", difficulty_level: 3,
      present: [["מפוצץ", "מְפוֹצֵץ"], ["מפוצצת", "מְפוֹצֶצֶת"], ["מפוצצים", "מְפוֹצְצִים"], ["מפוצצות", "מְפוֹצְצוֹת"]],
      past: [["פוצצתי", "פּוֹצַצְתִּי"], ["פוצצת", "פּוֹצַצְתָּ"], ["פוצצת", "פּוֹצַצְתְּ"], ["פוצץ", "פּוֹצֵץ"], ["פוצצה", "פּוֹצְצָה"], ["פוצצנו", "פּוֹצַצְנוּ"], ["פוצצתם", "פּוֹצַצְתֶּם"], ["פוצצתן", "פּוֹצַצְתֶּן"], ["פוצצו", "פּוֹצְצוּ"]],
      future: [["אפוצץ", "אֲפוֹצֵץ"], ["תפוצץ", "תְּפוֹצֵץ"], ["תפוצצי", "תְּפוֹצְצִי"], ["יפוצץ", "יְפוֹצֵץ"], ["תפוצץ", "תְּפוֹצֵץ"], ["נפוצץ", "נְפוֹצֵץ"], ["תפוצצו", "תְּפוֹצְצוּ"], ["יפוצצו", "יְפוֹצְצוּ"]],
      imperative: [["פוצץ", "פּוֹצֵץ"], ["פוצצי", "פּוֹצְצִי"], ["פוצצו", "פּוֹצְצוּ"]],
    },
    {
      id: "advanced-verb-lefarek", lemma: "לפרק", lemma_niqqud: "לְפָרֵק", root: ["פ", "ר", "ק"], binyan: "piel", regularity: "irregular", gloss: "to dismantle", difficulty_level: 3,
      present: [["מפרק", "מְפָרֵק"], ["מפרקת", "מְפָרֶקֶת"], ["מפרקים", "מְפָרְקִים"], ["מפרקות", "מְפָרְקוֹת"]],
      past: [["פירקתי", "פֵּרַקְתִּי"], ["פירקת", "פֵּרַקְתָּ"], ["פירקת", "פֵּרַקְתְּ"], ["פירק", "פֵּרֵק"], ["פירקה", "פֵּרְקָה"], ["פירקנו", "פֵּרַקְנוּ"], ["פירקתם", "פֵּרַקְתֶּם"], ["פירקתן", "פֵּרַקְתֶּן"], ["פירקו", "פֵּרְקוּ"]],
      future: [["אפרק", "אֲפָרֵק"], ["תפרק", "תְּפָרֵק"], ["תפרקי", "תְּפָרְקִי"], ["יפרק", "יְפָרֵק"], ["תפרק", "תְּפָרֵק"], ["נפרק", "נְפָרֵק"], ["תפרקו", "תְּפָרְקוּ"], ["יפרקו", "יְפָרְקוּ"]],
      imperative: [["פרק", "פָּרֵק"], ["פרקי", "פָּרְקִי"], ["פרקו", "פָּרְקוּ"]],
    },
    {
      id: "advanced-verb-leharim", lemma: "להרים", lemma_niqqud: "לְהָרִים", root: ["ר", "ו", "ם"], binyan: "hifil", regularity: "irregular", gloss: "to lift", difficulty_level: 2,
      present: [["מרים", "מֵרִים"], ["מרימה", "מְרִימָה"], ["מרימים", "מְרִימִים"], ["מרימות", "מְרִימוֹת"]],
      past: [["הרמתי", "הֵרַמְתִּי"], ["הרמת", "הֵרַמְתָּ"], ["הרמת", "הֵרַמְתְּ"], ["הרים", "הֵרִים"], ["הרימה", "הֵרִימָה"], ["הרמנו", "הֵרַמְנוּ"], ["הרמתם", "הֲרַמְתֶּם"], ["הרמתן", "הֲרַמְתֶּן"], ["הרימו", "הֵרִימוּ"]],
      future: [["ארים", "אָרִים"], ["תרים", "תָּרִים"], ["תרימי", "תָּרִימִי"], ["ירים", "יָרִים"], ["תרים", "תָּרִים"], ["נרים", "נָרִים"], ["תרימו", "תָּרִימוּ"], ["ירימו", "יָרִימוּ"]],
      imperative: [["הרם", "הָרֵם"], ["הרימי", "הָרִימִי"], ["הרימו", "הָרִימוּ"]],
    },
    {
      id: "advanced-verb-lehaavir", lemma: "להעביר", lemma_niqqud: "לְהַעֲבִיר", root: ["ע", "ב", "ר"], binyan: "hifil", regularity: "irregular", gloss: "to transfer", difficulty_level: 2,
      present: [["מעביר", "מַעֲבִיר"], ["מעבירה", "מַעֲבִירָה"], ["מעבירים", "מַעֲבִירִים"], ["מעבירות", "מַעֲבִירוֹת"]],
      past: [["העברתי", "הֶעֱבַרְתִּי"], ["העברת", "הֶעֱבַרְתָּ"], ["העברת", "הֶעֱבַרְתְּ"], ["העביר", "הֶעֱבִיר"], ["העבירה", "הֶעֱבִירָה"], ["העברנו", "הֶעֱבַרְנוּ"], ["העברתם", "הֶעֱבַרְתֶּם"], ["העברתן", "הֶעֱבַרְתֶּן"], ["העבירו", "הֶעֱבִירוּ"]],
      future: [["אעביר", "אַעֲבִיר"], ["תעביר", "תַּעֲבִיר"], ["תעבירי", "תַּעֲבִירִי"], ["יעביר", "יַעֲבִיר"], ["תעביר", "תַּעֲבִיר"], ["נעביר", "נַעֲבִיר"], ["תעבירו", "תַּעֲבִירוּ"], ["יעבירו", "יַעֲבִירוּ"]],
      imperative: [["העבר", "הַעֲבֵר"], ["העבירי", "הַעֲבִירִי"], ["העבירו", "הַעֲבִירוּ"]],
    },
    {
      id: "advanced-verb-lehaalot", lemma: "להעלות", lemma_niqqud: "לְהַעֲלוֹת", root: ["ע", "ל", "ה"], binyan: "hifil", regularity: "irregular", glosses: ["to raise", "to upload"], difficulty_level: 3,
      present: [["מעלה", "מַעֲלֶה"], ["מעלה", "מַעֲלָה"], ["מעלים", "מַעֲלִים"], ["מעלות", "מַעֲלוֹת"]],
      past: [["העליתי", "הֶעֱלֵיתִי"], ["העלית", "הֶעֱלֵיתָ"], ["העלית", "הֶעֱלֵית"], ["העלה", "הֶעֱלָה"], ["העלתה", "הֶעֶלְתָה"], ["העלינו", "הֶעֱלֵינוּ"], ["העליתם", "הֶעֱלֵיתֶם"], ["העליתן", "הֶעֱלֵיתֶן"], ["העלו", "הֶעֱלוּ"]],
      future: [["אעלה", "אַעֲלֶה"], ["תעלה", "תַּעֲלֶה"], ["תעלי", "תַּעֲלִי"], ["יעלה", "יַעֲלֶה"], ["תעלה", "תַּעֲלֶה"], ["נעלה", "נַעֲלֶה"], ["תעלו", "תַּעֲלוּ"], ["יעלו", "יַעֲלוּ"]],
      imperative: [["העלה", "הַעֲלֵה"], ["העלי", "הַעֲלִי"], ["העלו", "הַעֲלוּ"]],
    },
    {
      id: "technology-verb-lehatkin", lemma: "להתקין", lemma_niqqud: "לְהַתְקִין", root: ["ת", "ק", "נ"], binyan: "hifil", regularity: "regular", gloss: "to install", difficulty_level: 2,
      present: [["מתקין", "מַתְקִין"], ["מתקינה", "מַתְקִינָה"], ["מתקינים", "מַתְקִינִים"], ["מתקינות", "מַתְקִינוֹת"]],
      past: [["התקנתי", "הִתְקַנְתִּי"], ["התקנת", "הִתְקַנְתָּ"], ["התקנת", "הִתְקַנְתְּ"], ["התקין", "הִתְקִין"], ["התקינה", "הִתְקִינָה"], ["התקנו", "הִתְקַנּוּ"], ["התקנתם", "הִתְקַנְתֶּם"], ["התקנתן", "הִתְקַנְתֶּן"], ["התקינו", "הִתְקִינוּ"]],
      future: [["אתקין", "אַתְקִין"], ["תתקין", "תַּתְקִין"], ["תתקיני", "תַּתְקִינִי"], ["יתקין", "יַתְקִין"], ["תתקין", "תַּתְקִין"], ["נתקין", "נַתְקִין"], ["תתקינו", "תַּתְקִינוּ"], ["יתקינו", "יַתְקִינוּ"]],
    },
    {
      id: "technology-verb-lehasir", lemma: "להסיר", lemma_niqqud: "לְהָסִיר", root: ["ס", "ו", "ר"], binyan: "hifil", regularity: "irregular", gloss: "to uninstall", difficulty_level: 3,
      present: [["מסיר", "מֵסִיר"], ["מסירה", "מְסִירָה"], ["מסירים", "מְסִירִים"], ["מסירות", "מְסִירוֹת"]],
      past: [["הסרתי", "הֵסַרְתִּי"], ["הסרת", "הֵסַרְתָּ"], ["הסרת", "הֵסַרְתְּ"], ["הסיר", "הֵסִיר"], ["הסירה", "הֵסִירָה"], ["הסרנו", "הֵסַרְנוּ"], ["הסרתם", "הֲסַרְתֶּם"], ["הסרתן", "הֲסַרְתֶּן"], ["הסירו", "הֵסִירוּ"]],
      future: [["אסיר", "אָסִיר"], ["תסיר", "תָּסִיר"], ["תסירי", "תָּסִירִי"], ["יסיר", "יָסִיר"], ["תסיר", "תָּסִיר"], ["נסיר", "נָסִיר"], ["תסירו", "תָּסִירוּ"], ["יסירו", "יָסִירוּ"]],
    },
    {
      id: "technology-verb-limchok", lemma: "למחוק", lemma_niqqud: "לִמְחֹק", root: ["מ", "ח", "ק"], binyan: "paal", regularity: "regular", gloss: "to delete", difficulty_level: 2,
      present: [["מוחק", "מוֹחֵק"], ["מוחקת", "מוֹחֶקֶת"], ["מוחקים", "מוֹחֲקִים"], ["מוחקות", "מוֹחֲקוֹת"]],
      past: [["מחקתי", "מָחַקְתִּי"], ["מחקת", "מָחַקְתָּ"], ["מחקת", "מָחַקְתְּ"], ["מחק", "מָחַק"], ["מחקה", "מָחֲקָה"], ["מחקנו", "מָחַקְנוּ"], ["מחקתם", "מְחַקְתֶּם"], ["מחקתן", "מְחַקְתֶּן"], ["מחקו", "מָחֲקוּ"]],
      future: [["אמחק", "אֶמְחַק"], ["תמחק", "תִּמְחַק"], ["תמחקי", "תִּמְחֲקִי"], ["ימחק", "יִמְחַק"], ["תמחק", "תִּמְחַק"], ["נמחק", "נִמְחַק"], ["תמחקו", "תִּמְחֲקוּ"], ["ימחקו", "יִמְחֲקוּ"]],
    },
    {
      id: "technology-verb-leshatef", lemma: "לשתף", lemma_niqqud: "לְשַׁתֵּף", root: ["ש", "ת", "פ"], binyan: "piel", regularity: "regular", gloss: "to share", difficulty_level: 2,
      present: [["משתף", "מְשַׁתֵּף"], ["משתפת", "מְשַׁתֶּפֶת"], ["משתפים", "מְשַׁתְּפִים"], ["משתפות", "מְשַׁתְּפוֹת"]],
      past: [["שיתפתי", "שִׁתַּפְתִּי"], ["שיתפת", "שִׁתַּפְתָּ"], ["שיתפת", "שִׁתַּפְתְּ"], ["שיתף", "שִׁתֵּף"], ["שיתפה", "שִׁתְּפָה"], ["שיתפנו", "שִׁתַּפְנוּ"], ["שיתפתם", "שִׁתַּפְתֶּם"], ["שיתפתן", "שִׁתַּפְתֶּן"], ["שיתפו", "שִׁתְּפוּ"]],
      future: [["אשתף", "אֲשַׁתֵּף"], ["תשתף", "תְּשַׁתֵּף"], ["תשתפי", "תְּשַׁתְּפִי"], ["ישתף", "יְשַׁתֵּף"], ["תשתף", "תְּשַׁתֵּף"], ["נשתף", "נְשַׁתֵּף"], ["תשתפו", "תְּשַׁתְּפוּ"], ["ישתפו", "יְשַׁתְּפוּ"]],
    },
    {
      id: "technology-verb-lesankhren", lemma: "לסנכרן", lemma_niqqud: "לְסַנְכְרֵן", root: ["ס", "נ", "כ", "ר"], binyan: "piel", regularity: "regular", gloss: "to sync", difficulty_level: 3,
      present: [["מסנכרן", "מְסַנְכְרֵן"], ["מסנכרנת", "מְסַנְכְרֶנֶת"], ["מסנכרנים", "מְסַנְכְרְנִים"], ["מסנכרנות", "מְסַנְכְרְנוֹת"]],
      past: [["סנכרנתי", "סִנְכְרַנְתִּי"], ["סנכרנת", "סִנְכְרַנְתָּ"], ["סנכרנת", "סִנְכְרַנְתְּ"], ["סנכרן", "סִנְכְרֵן"], ["סנכרנה", "סִנְכְרְנָה"], ["סנכרנו", "סִנְכְרַנּוּ"], ["סנכרנתם", "סִנְכְרַנְתֶּם"], ["סנכרנתן", "סִנְכְרַנְתֶּן"], ["סנכרנו", "סִנְכְרְנוּ"]],
      future: [["אסנכרן", "אֲסַנְכְרֵן"], ["תסנכרן", "תְּסַנְכְרֵן"], ["תסנכרני", "תְּסַנְכְרְנִי"], ["יסנכרן", "יְסַנְכְרֵן"], ["תסנכרן", "תְּסַנְכְרֵן"], ["נסנכרן", "נְסַנְכְרֵן"], ["תסנכרנו", "תְּסַנְכְרְנוּ"], ["יסנכרנו", "יְסַנְכְרְנוּ"]],
    },
    {
      id: "technology-verb-legabot", lemma: "לגבות", lemma_niqqud: "לְגַבּוֹת", root: ["ג", "ב", "ה"], binyan: "piel", regularity: "irregular", gloss: "to back up", difficulty_level: 3,
      present: [["מגבה", "מְגַבֶּה"], ["מגבה", "מְגַבָּה"], ["מגבים", "מְגַבִּים"], ["מגבות", "מְגַבּוֹת"]],
      past: [["גיביתי", "גִּבִּיתִי"], ["גיבית", "גִּבִּיתָ"], ["גיבית", "גִּבִּית"], ["גיבה", "גִּבָּה"], ["גיבתה", "גִּבְּתָה"], ["גיבינו", "גִּבִּינוּ"], ["גיביתם", "גִּבִּיתֶם"], ["גיביתן", "גִּבִּיתֶן"], ["גיבו", "גִּבּוּ"]],
      future: [["אגבה", "אֲגַבֶּה"], ["תגבה", "תְּגַבֶּה"], ["תגבי", "תְּגַבִּי"], ["יגבה", "יְגַבֶּה"], ["תגבה", "תְּגַבֶּה"], ["נגבה", "נְגַבֶּה"], ["תגבו", "תְּגַבּוּ"], ["יגבו", "יְגַבּוּ"]],
    },
    {
      id: "technology-verb-leshachzer", lemma: "לשחזר", lemma_niqqud: "לְשַׁחְזֵר", root: ["ש", "ח", "ז", "ר"], binyan: "piel", regularity: "regular", gloss: "to restore", difficulty_level: 3,
      present: [["משחזר", "מְשַׁחְזֵר"], ["משחזרת", "מְשַׁחְזֶרֶת"], ["משחזרים", "מְשַׁחְזְרִים"], ["משחזרות", "מְשַׁחְזְרוֹת"]],
      past: [["שחזרתי", "שִׁחְזַרְתִּי"], ["שחזרת", "שִׁחְזַרְתָּ"], ["שחזרת", "שִׁחְזַרְתְּ"], ["שחזר", "שִׁחְזֵר"], ["שחזרה", "שִׁחְזְרָה"], ["שחזרנו", "שִׁחְזַרְנוּ"], ["שחזרתם", "שִׁחְזַרְתֶּם"], ["שחזרתן", "שִׁחְזַרְתֶּן"], ["שחזרו", "שִׁחְזְרוּ"]],
      future: [["אשחזר", "אֲשַׁחְזֵר"], ["תשחזר", "תְּשַׁחְזֵר"], ["תשחזרי", "תְּשַׁחְזְרִי"], ["ישחזר", "יְשַׁחְזֵר"], ["תשחזר", "תְּשַׁחְזֵר"], ["נשחזר", "נְשַׁחְזֵר"], ["תשחזרו", "תְּשַׁחְזְרוּ"], ["ישחזרו", "יְשַׁחְזְרוּ"]],
    },
    {
      id: "technology-verb-lehitchaber", lemma: "להתחבר", lemma_niqqud: "לְהִתְחַבֵּר", root: ["ח", "ב", "ר"], binyan: "hitpael", regularity: "regular", gloss: "to sign in", difficulty_level: 2,
      present: [["מתחבר", "מִתְחַבֵּר"], ["מתחברת", "מִתְחַבֶּרֶת"], ["מתחברים", "מִתְחַבְּרִים"], ["מתחברות", "מִתְחַבְּרוֹת"]],
      past: [["התחברתי", "הִתְחַבַּרְתִּי"], ["התחברת", "הִתְחַבַּרְתָּ"], ["התחברת", "הִתְחַבַּרְתְּ"], ["התחבר", "הִתְחַבֵּר"], ["התחברה", "הִתְחַבְּרָה"], ["התחברנו", "הִתְחַבַּרְנוּ"], ["התחברתם", "הִתְחַבַּרְתֶּם"], ["התחברתן", "הִתְחַבַּרְתֶּן"], ["התחברו", "הִתְחַבְּרוּ"]],
      future: [["אתחבר", "אֶתְחַבֵּר"], ["תתחבר", "תִּתְחַבֵּר"], ["תתחברי", "תִּתְחַבְּרִי"], ["יתחבר", "יִתְחַבֵּר"], ["תתחבר", "תִּתְחַבֵּר"], ["נתחבר", "נִתְחַבֵּר"], ["תתחברו", "תִּתְחַבְּרוּ"], ["יתחברו", "יִתְחַבְּרוּ"]],
    },
    {
      id: "technology-verb-lehitnatek", lemma: "להתנתק", lemma_niqqud: "לְהִתְנַתֵּק", root: ["נ", "ת", "ק"], binyan: "hitpael", regularity: "regular", gloss: "to sign out", difficulty_level: 2,
      present: [["מתנתק", "מִתְנַתֵּק"], ["מתנתקת", "מִתְנַתֶּקֶת"], ["מתנתקים", "מִתְנַתְּקִים"], ["מתנתקות", "מִתְנַתְּקוֹת"]],
      past: [["התנתקתי", "הִתְנַתַּקְתִּי"], ["התנתקת", "הִתְנַתַּקְתָּ"], ["התנתקת", "הִתְנַתַּקְתְּ"], ["התנתק", "הִתְנַתֵּק"], ["התנתקה", "הִתְנַתְּקָה"], ["התנתקנו", "הִתְנַתַּקְנוּ"], ["התנתקתם", "הִתְנַתַּקְתֶּם"], ["התנתקתן", "הִתְנַתַּקְתֶּן"], ["התנתקו", "הִתְנַתְּקוּ"]],
      future: [["אתנתק", "אֶתְנַתֵּק"], ["תתנתק", "תִּתְנַתֵּק"], ["תתנתקי", "תִּתְנַתְּקִי"], ["יתנתק", "יִתְנַתֵּק"], ["תתנתק", "תִּתְנַתֵּק"], ["נתנתק", "נִתְנַתֵּק"], ["תתנתקו", "תִּתְנַתְּקוּ"], ["יתנתקו", "יִתְנַתְּקוּ"]],
    },
    {
      id: "technology-verb-leafes", lemma: "לאפס", lemma_niqqud: "לְאַפֵּס", root: ["א", "פ", "ס"], binyan: "piel", regularity: "regular", gloss: "to reset", difficulty_level: 3,
      present: [["מאפס", "מְאַפֵּס"], ["מאפסת", "מְאַפֶּסֶת"], ["מאפסים", "מְאַפְּסִים"], ["מאפסות", "מְאַפְּסוֹת"]],
      past: [["איפסתי", "אִפַּסְתִּי"], ["איפסת", "אִפַּסְתָּ"], ["איפסת", "אִפַּסְתְּ"], ["איפס", "אִפֵּס"], ["איפסה", "אִפְּסָה"], ["איפסנו", "אִפַּסְנוּ"], ["איפסתם", "אִפַּסְתֶּם"], ["איפסתן", "אִפַּסְתֶּן"], ["איפסו", "אִפְּסוּ"]],
      future: [["אאפס", "אֲאַפֵּס"], ["תאפס", "תְּאַפֵּס"], ["תאפסי", "תְּאַפְּסִי"], ["יאפס", "יְאַפֵּס"], ["תאפס", "תְּאַפֵּס"], ["נאפס", "נְאַפֵּס"], ["תאפסו", "תְּאַפְּסוּ"], ["יאפסו", "יְאַפְּסוּ"]],
    },
    {
      id: "advanced-verb-lehapil", lemma: "להפיל", lemma_niqqud: "לְהַפִּיל", root: ["נ", "פ", "ל"], binyan: "hifil", regularity: "irregular", gloss: "to drop", difficulty_level: 3,
      present: [["מפיל", "מַפִּיל"], ["מפילה", "מַפִּילָה"], ["מפילים", "מַפִּילִים"], ["מפילות", "מַפִּילוֹת"]],
      past: [["הפלתי", "הִפַּלְתִּי"], ["הפלת", "הִפַּלְתָּ"], ["הפלת", "הִפַּלְתְּ"], ["הפיל", "הִפִּיל"], ["הפילה", "הִפִּילָה"], ["הפלנו", "הִפַּלְנוּ"], ["הפלתם", "הִפַּלְתֶּם"], ["הפלתן", "הִפַּלְתֶּן"], ["הפילו", "הִפִּילוּ"]],
      future: [["אפיל", "אַפִּיל"], ["תפיל", "תַּפִּיל"], ["תפילי", "תַּפִּילִי"], ["יפיל", "יַפִּיל"], ["תפיל", "תַּפִּיל"], ["נפיל", "נַפִּיל"], ["תפילו", "תַּפִּילוּ"], ["יפילו", "יַפִּילוּ"]],
      imperative: [["הפל", "הַפֵּל"], ["הפילי", "הַפִּילִי"], ["הפילו", "הַפִּילוּ"]],
    },
    {
      id: "advanced-verb-lehaif", lemma: "להעיף", lemma_niqqud: "לְהָעִיף", root: ["ע", "ו", "פ"], binyan: "hifil", regularity: "irregular", gloss: "to fling", difficulty_level: 3,
      present: [["מעיף", "מֵעִיף"], ["מעיפה", "מְעִיפָה"], ["מעיפים", "מְעִיפִים"], ["מעיפות", "מְעִיפוֹת"]],
      past: [["העפתי", "הֵעַפְתִּי"], ["העפת", "הֵעַפְתָּ"], ["העפת", "הֵעַפְתְּ"], ["העיף", "הֵעִיף"], ["העיפה", "הֵעִיפָה"], ["העפנו", "הֵעַפְנוּ"], ["העפתם", "הֲעַפְתֶּם"], ["העפתן", "הֲעַפְתֶּן"], ["העיפו", "הֵעִיפוּ"]],
      future: [["אעיף", "אָעִיף"], ["תעיף", "תָּעִיף"], ["תעיפי", "תָּעִיפִי"], ["יעיף", "יָעִיף"], ["תעיף", "תָּעִיף"], ["נעיף", "נָעִיף"], ["תעיפו", "תָּעִיפוּ"], ["יעיפו", "יָעִיפוּ"]],
      imperative: [["העף", "הָעֵף"], ["העיפי", "הָעִיפִי"], ["העיפו", "הָעִיפוּ"]],
    },
    {
      id: "advanced-verb-lehair", lemma: "להאיר", lemma_niqqud: "לְהָאִיר", root: ["א", "ו", "ר"], binyan: "hifil", regularity: "irregular", gloss: "to light up", difficulty_level: 3,
      present: [["מאיר", "מֵאִיר"], ["מאירה", "מְאִירָה"], ["מאירים", "מְאִירִים"], ["מאירות", "מְאִירוֹת"]],
      past: [["הארתי", "הֵאַרְתִּי"], ["הארת", "הֵאַרְתָּ"], ["הארת", "הֵאַרְתְּ"], ["האיר", "הֵאִיר"], ["האירה", "הֵאִירָה"], ["הארנו", "הֵאַרְנוּ"], ["הארתם", "הֲאַרְתֶּם"], ["הארתן", "הֲאַרְתֶּן"], ["האירו", "הֵאִירוּ"]],
      future: [["אאיר", "אָאִיר"], ["תאיר", "תָּאִיר"], ["תאירי", "תָּאִירִי"], ["יאיר", "יָאִיר"], ["תאיר", "תָּאִיר"], ["נאיר", "נָאִיר"], ["תאירו", "תָּאִירוּ"], ["יאירו", "יָאִירוּ"]],
      imperative: [["האר", "הָאֵר"], ["האירי", "הָאִירִי"], ["האירו", "הָאִירוּ"]],
    },
    {
      id: "advanced-verb-lehatot", lemma: "להטות", lemma_niqqud: "לְהַטּוֹת", root: ["נ", "ט", "ה"], binyan: "hifil", regularity: "irregular", gloss: "to tilt", difficulty_level: 4,
      present: [["מטה", "מַטֶּה"], ["מטה", "מַטָּה"], ["מטים", "מַטִּים"], ["מטות", "מַטּוֹת"]],
      past: [["הטיתי", "הִטֵּיתִי"], ["הטית", "הִטֵּיתָ"], ["הטית", "הִטֵּית"], ["הטה", "הִטָּה"], ["הטתה", "הִטְּתָה"], ["הטינו", "הִטֵּינוּ"], ["הטיתם", "הִטֵּיתֶם"], ["הטיתן", "הִטֵּיתֶן"], ["הטו", "הִטּוּ"]],
      future: [["אטה", "אַטֶּה"], ["תטה", "תַּטֶּה"], ["תטי", "תַּטִּי"], ["יטה", "יַטֶּה"], ["תטה", "תַּטֶּה"], ["נטה", "נַטֶּה"], ["תטו", "תַּטּוּ"], ["יטו", "יַטּוּ"]],
      imperative: [["הטה", "הַטֵּה"], ["הטי", "הַטִּי"], ["הטו", "הַטּוּ"]],
    },
    {
      id: "advanced-verb-lehashir", lemma: "להשאיר", lemma_niqqud: "לְהַשְׁאִיר", root: ["ש", "א", "ר"], binyan: "hifil", regularity: "regular", gloss: "to leave behind", difficulty_level: 2,
      present: [["משאיר", "מַשְׁאִיר"], ["משאירה", "מַשְׁאִירָה"], ["משאירים", "מַשְׁאִירִים"], ["משאירות", "מַשְׁאִירוֹת"]],
      past: [["השארתי", "הִשְׁאַרְתִּי"], ["השארת", "הִשְׁאַרְתָּ"], ["השארת", "הִשְׁאַרְתְּ"], ["השאיר", "הִשְׁאִיר"], ["השאירה", "הִשְׁאִירָה"], ["השארנו", "הִשְׁאַרְנוּ"], ["השארתם", "הִשְׁאַרְתֶּם"], ["השארתן", "הִשְׁאַרְתֶּן"], ["השאירו", "הִשְׁאִירוּ"]],
      future: [["אשאיר", "אַשְׁאִיר"], ["תשאיר", "תַּשְׁאִיר"], ["תשאירי", "תַּשְׁאִירִי"], ["ישאיר", "יַשְׁאִיר"], ["תשאיר", "תַּשְׁאִיר"], ["נשאיר", "נַשְׁאִיר"], ["תשאירו", "תַּשְׁאִירוּ"], ["ישאירו", "יַשְׁאִירוּ"]],
      imperative: [["השאר", "הַשְׁאֵר"], ["השאירי", "הַשְׁאִירִי"], ["השאירו", "הַשְׁאִירוּ"]],
    },
  ];

  return batch.map(({ present, past, future, gloss, glosses, ...config }) => createVerbEntry({
    ...config,
    availability: getStarterVerbAvailability(config.id),
    conjugation_mode: "curated",
    senses: (glosses || [gloss]).map((senseGloss) => makeSense(senseGloss, null, false)),
    forms: makeForms(
      makePresent(...present.map(([plain, niqqud]) => markedForm(plain, niqqud))),
      makePast(...past.map(([plain, niqqud]) => markedForm(plain, niqqud))),
      makeFuture(...future.map(([plain, niqqud]) => markedForm(plain, niqqud))),
      config.imperative ? makeImperative(...config.imperative.map(([plain, niqqud]) => markedForm(plain, niqqud))) : undefined
    ),
    review_status: "approved",
    notes: "Authoritative present, past, and future forms for the expanded practical-verb deck.",
    tags: [config.binyan, "core-advanced", "practical"],
    personal_priority: 78,
    category: "core_advanced",
  }));
}

const STARTER_VERBS = buildStarterVerbEntries().concat(buildRequestedVerbEntries());

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
  if (CONJUGATION_HIDDEN_VERB_IDS.has(entry.id)) return [];

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
  // Only the copula head inflects for number, so "be sorry" has to become
  // "were sorry" and not "was sorry". Matching the head rather than the whole
  // phrase keeps every multi-word "to be …" gloss right, not just bare "be".
  const pastPl = past.replace(/^was\b/, "were");
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
  ["hang", "hung"],
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
  ["stop", "stopped"],
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
  __build: "20260808b",
};
});

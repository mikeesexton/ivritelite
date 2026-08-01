(function initIvriQuestAppConstants(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const constants = app.constants = app.constants || {};

constants.STORAGE_KEYS = constants.STORAGE_KEYS || Object.freeze({
  progress: "ivriquest-progress-v1",
  sentenceProgress: "ivriquest-sentence-progress-v1",
  language: "ivriquest-language-v1",
  theme: "ivriquest-theme-v1",
  displayFont: "ivriquest-font-v1",
  sound: "ivriquest-sound-v1",
  speech: "ivriquest-speech-v1",
  ui: "ivriquest-ui-v1",
  session: "ivriquest-session-v1",
  character: "ivriquest-character-v1",
  // Deliberately separate from `character`, which is day-keyed and rebuilt on
  // every date change. Relationship progress has to outlive that reset.
  characterBond: "ivriquest-character-bond-v1",
  welcomeSeen: "ivriquest-welcome-seen-v1",
  advConjStats: "advConjStats",
  prepositionsStats: "ivriquest-prepositions-stats-v1",
  binyanBoardStats: "ivriquest-binyan-board-stats-v1",
  handwritingProgress: "ivriquest-handwriting-progress-v1",
  advConjItemStats: "ivriquest-adv-conj-item-stats-v1",
  prepositionsItemStats: "ivriquest-prepositions-item-stats-v1",
  binyanBoardItemStats: "ivriquest-binyan-item-stats-v1",
});

constants.LEITNER_INTERVALS = constants.LEITNER_INTERVALS || Object.freeze([
  0,
  8 * 60 * 1000,
  45 * 60 * 1000,
  4 * 60 * 60 * 1000,
  20 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  14 * 24 * 60 * 60 * 1000,
]);
constants.LESSON_ROUNDS = constants.LESSON_ROUNDS || 10;
constants.ABBREVIATION_ROUNDS = constants.ABBREVIATION_ROUNDS || 10;
constants.ADV_CONJ_ROUNDS = constants.ADV_CONJ_ROUNDS || 10;
constants.PREPOSITIONS_ROUNDS = constants.PREPOSITIONS_ROUNDS || 10;
constants.HANDWRITING_ROUNDS = constants.HANDWRITING_ROUNDS || 10;
constants.HANDWRITING_TRACE_PASS_SCORE = constants.HANDWRITING_TRACE_PASS_SCORE || 75;
constants.HANDWRITING_NEW_LETTERS_PER_SESSION = constants.HANDWRITING_NEW_LETTERS_PER_SESSION || 2;
constants.HANDWRITING_SENTENCE_ROUNDS = constants.HANDWRITING_SENTENCE_ROUNDS || 1;
constants.HANDWRITING_SENTENCE_MIN_LETTERS = constants.HANDWRITING_SENTENCE_MIN_LETTERS || 6;
constants.HANDWRITING_SENTENCE_MAX_LETTERS = constants.HANDWRITING_SENTENCE_MAX_LETTERS || 34;
constants.TRANSLATION_MISS_RECOVERY_TARGET = constants.TRANSLATION_MISS_RECOVERY_TARGET || 5;
constants.TRANSLATION_MISS_BIAS_PER_MISS = constants.TRANSLATION_MISS_BIAS_PER_MISS || 0.55;
constants.STREAK_SOUND_INTERVAL = constants.STREAK_SOUND_INTERVAL || 4;
constants.VERB_MATCH_ROUNDS = constants.VERB_MATCH_ROUNDS || 1;
constants.MATCH_MAX_PAIRS = constants.MATCH_MAX_PAIRS || 12;
constants.MATCH_VISIBLE_ROWS = constants.MATCH_VISIBLE_ROWS || 5;
constants.WORD_MATCH_SESSION_SIZE = constants.WORD_MATCH_SESSION_SIZE || 20;
constants.MATCH_MAX_LEN = constants.MATCH_MAX_LEN || 40;
constants.MATCH_LONG_LEN = constants.MATCH_LONG_LEN || 16;
constants.CONJUGATION_MASTER_STREAK = constants.CONJUGATION_MASTER_STREAK || 10;
constants.VERB_MATCH_MISTAKE_MAX_FORMS = constants.VERB_MATCH_MISTAKE_MAX_FORMS || 6;

// Hebrew present inflects for gender and number but not person, so `form` — the
// key into an idiom's own 4-slot tense table — is all the present needs, and
// every subject below works there. Past and future do inflect for person, and
// those 4 slots hold third-person forms only. `pastSlot`/`futureSlot` name the
// hebrew-verbs paradigm slot to read instead; an idiom with no linked paradigm
// falls back to its own table and therefore offers third person alone.
//
// `personKey` feeds the coreference guard and uses the same 1/2/3 prefix
// convention as ADV_CONJ_OBJECT_KEYS.
constants.ADV_CONJ_SUBJECTS = constants.ADV_CONJ_SUBJECTS || [
  { form: "msg", pronoun: "אני", en: "I (m.)", personKey: "1sg",
    pastSlot: "first_person_singular", futureSlot: "first_person_singular" },
  { form: "fsg", pronoun: "אני", en: "I (f.)", personKey: "1sg",
    pastSlot: "first_person_singular", futureSlot: "first_person_singular" },
  { form: "mpl", pronoun: "אנחנו", en: "we (m.)", personKey: "1pl",
    pastSlot: "first_person_plural", futureSlot: "first_person_plural" },
  { form: "fpl", pronoun: "אנחנו", en: "we (f.)", personKey: "1pl",
    pastSlot: "first_person_plural", futureSlot: "first_person_plural" },
  { form: "msg", pronoun: "אתה", en: "you (m.sg.)", personKey: "2msg",
    pastSlot: "second_person_masculine_singular", futureSlot: "second_person_masculine_singular" },
  { form: "fsg", pronoun: "את", en: "you (f.sg.)", personKey: "2fsg",
    pastSlot: "second_person_feminine_singular", futureSlot: "second_person_feminine_singular" },
  { form: "mpl", pronoun: "אתם", en: "you (m.pl.)", personKey: "2mpl",
    pastSlot: "second_person_masculine_plural", futureSlot: "second_person_plural" },
  { form: "fpl", pronoun: "אתן", en: "you (f.pl.)", personKey: "2fpl",
    pastSlot: "second_person_feminine_plural", futureSlot: "second_person_plural" },
  { form: "msg", pronoun: "הוא", en: "he", personKey: "3msg",
    pastSlot: "third_person_masculine_singular", futureSlot: "third_person_masculine_singular" },
  { form: "fsg", pronoun: "היא", en: "she", personKey: "3fsg",
    pastSlot: "third_person_feminine_singular", futureSlot: "third_person_feminine_singular" },
  { form: "mpl", pronoun: "הם", en: "they (m.)", personKey: "3mpl",
    pastSlot: "third_person_plural", futureSlot: "third_person_plural" },
  { form: "fpl", pronoun: "הן", en: "they (f.)", personKey: "3mpl",
    pastSlot: "third_person_plural", futureSlot: "third_person_plural" },
];

// Derived from PREPOSITION_INFLECTIONS rather than hand-copied beside it. The
// two tables are the same paradigms — `dirObj` is the `et` row and `lObj` is the
// `le` row — and when they were maintained separately they drifted: this table
// was missing the feminine-singular addressee entirely, so a learner met לָךְ and
// אוֹתָךְ in Prepositions and never in Conjugation+.
//
// Object keys stay in this file's `2msg`/`3fsg` spelling because idiom
// `suffix_forms` are authored against them; ADV_CONJ_OBJECT_KEYS maps each to
// its preposition-table key.
//
// Plural labels carry gender because the feminine plurals exist here: a bare
// "you (pl.)" would read onto both אֶתְכֶם and אֶתְכֶן, which is exactly the
// ambiguity the singular addressee already had before 2fsg was added.
constants.ADV_CONJ_OBJECT_KEYS = constants.ADV_CONJ_OBJECT_KEYS || [
  { key: "1sg",  prepKey: "1sg", en: "me",           poss: "my" },
  { key: "2msg", prepKey: "2ms", en: "you (m.sg.)",  poss: "your (m.sg.)" },
  { key: "2fsg", prepKey: "2fs", en: "you (f.sg.)",  poss: "your (f.sg.)" },
  { key: "3msg", prepKey: "3ms", en: "him",          poss: "his" },
  { key: "3fsg", prepKey: "3fs", en: "her",          poss: "her" },
  { key: "1pl",  prepKey: "1pl", en: "us",           poss: "our" },
  { key: "2mpl", prepKey: "2mp", en: "you (m.pl.)",  poss: "your (m.pl.)" },
  { key: "2fpl", prepKey: "2fp", en: "you (f.pl.)",  poss: "your (f.pl.)" },
  { key: "3mpl", prepKey: "3mp", en: "them (m.)",    poss: "their (m.)" },
  { key: "3fpl", prepKey: "3fp", en: "them (f.)",    poss: "their (f.)" },
];

constants.ADV_CONJ_OBJECTS = constants.ADV_CONJ_OBJECTS || (function buildAdvConjObjects() {
  const inflections = global.PREPOSITION_INFLECTIONS;
  if (!inflections?.et || !inflections?.le) {
    throw new Error("ADV_CONJ_OBJECTS needs preposition-data.js loaded first");
  }
  return constants.ADV_CONJ_OBJECT_KEYS.map((entry) => ({
    key: entry.key,
    dirObj: inflections.et[entry.prepKey].plain,
    dirObjNiqqud: inflections.et[entry.prepKey].niqqud,
    lObj: inflections.le[entry.prepKey].plain,
    lObjNiqqud: inflections.le[entry.prepKey].niqqud,
    en: entry.en,
    poss: entry.poss,
  }));
})();

constants.HEBREW_FINAL_TO_MEDIAL = constants.HEBREW_FINAL_TO_MEDIAL || Object.freeze({
  ך: "כ",
  ם: "מ",
  ן: "נ",
  ף: "פ",
  ץ: "צ",
});

constants.HEBREW_MEDIAL_TO_FINAL = constants.HEBREW_MEDIAL_TO_FINAL || Object.freeze({
  כ: "ך",
  מ: "ם",
  נ: "ן",
  פ: "ף",
  צ: "ץ",
});

constants.VOCABULARY_AVAILABILITY_DEFAULTS = constants.VOCABULARY_AVAILABILITY_DEFAULTS || Object.freeze({
  translationQuiz: true,
  sentenceHints: true,
});

constants.FEEDBACK_SURVEY_URL = constants.FEEDBACK_SURVEY_URL || "https://forms.gle/KqqP7TVLxphRDM179";
})(typeof window !== "undefined" ? window : globalThis);

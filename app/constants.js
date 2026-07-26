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

constants.ADV_CONJ_SUBJECTS = constants.ADV_CONJ_SUBJECTS || [
  { form: "msg", pronoun: "הוא", en: "he" },
  { form: "msg", pronoun: "אתה", en: "you (m.sg.)", tenses: ["present"] },
  { form: "fsg", pronoun: "היא", en: "she" },
  { form: "fsg", pronoun: "את", en: "you (f.sg.)", tenses: ["present"] },
  { form: "mpl", pronoun: "הם", en: "they (m.)" },
  { form: "mpl", pronoun: "אתם", en: "you (m.pl.)", tenses: ["present"] },
  { form: "fpl", pronoun: "הן", en: "they (f.)" },
  { form: "fpl", pronoun: "אתן", en: "you (f.pl.)", tenses: ["present"] },
];

constants.ADV_CONJ_OBJECTS = constants.ADV_CONJ_OBJECTS || [
  { key: "1sg",  dirObj: "אותי",  lObj: "לי",   en: "me",        poss: "my" },
  { key: "2msg", dirObj: "אותך",  lObj: "לך",   en: "you (sg.)", poss: "your (sg.)" },
  { key: "3msg", dirObj: "אותו",  lObj: "לו",   en: "him",       poss: "his" },
  { key: "3fsg", dirObj: "אותה",  lObj: "לה",   en: "her",       poss: "her" },
  { key: "1pl",  dirObj: "אותנו", lObj: "לנו",  en: "us",        poss: "our" },
  { key: "2mpl", dirObj: "אתכם",  lObj: "לכם",  en: "you (pl.)", poss: "your (pl.)" },
  { key: "3mpl", dirObj: "אותם",  lObj: "להם",  en: "them",      poss: "their" },
];

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

(function initIvriQuestPrepositions(global) {
"use strict";

// Object pronouns a governed preposition can inflect for. Order is the
// canonical display order; `en` is the English gloss substituted into a
// trigger's {o} slot.
const PREPOSITION_OBJECTS = [
  { key: "1sg", en: "me" },
  { key: "2ms", en: "you (m.sg.)" },
  { key: "2fs", en: "you (f.sg.)" },
  { key: "3ms", en: "him" },
  { key: "3fs", en: "her" },
  { key: "1pl", en: "us" },
  { key: "2mp", en: "you (pl.)" },
  { key: "3mp", en: "them" },
];

// Inflection paradigms for each governed preposition. `plain` is the
// niqqud-free spelling; `niqqud` is the vocalized form used on answer
// buttons (vowels are what distinguish many of these forms).
const PREPOSITION_INFLECTIONS = {
  // אל — to / toward
  el: {
    base: "אל",
    "1sg": { plain: "אליי", niqqud: "אֵלַי" },
    "2ms": { plain: "אליך", niqqud: "אֵלֶיךָ" },
    "2fs": { plain: "אלייך", niqqud: "אֵלַיִךְ" },
    "3ms": { plain: "אליו", niqqud: "אֵלָיו" },
    "3fs": { plain: "אליה", niqqud: "אֵלֶיהָ" },
    "1pl": { plain: "אלינו", niqqud: "אֵלֵינוּ" },
    "2mp": { plain: "אליכם", niqqud: "אֲלֵיכֶם" },
    "3mp": { plain: "אליהם", niqqud: "אֲלֵיהֶם" },
  },
  // על — on / about / upon
  al: {
    base: "על",
    "1sg": { plain: "עליי", niqqud: "עָלַי" },
    "2ms": { plain: "עליך", niqqud: "עָלֶיךָ" },
    "2fs": { plain: "עלייך", niqqud: "עָלַיִךְ" },
    "3ms": { plain: "עליו", niqqud: "עָלָיו" },
    "3fs": { plain: "עליה", niqqud: "עָלֶיהָ" },
    "1pl": { plain: "עלינו", niqqud: "עָלֵינוּ" },
    "2mp": { plain: "עליכם", niqqud: "עֲלֵיכֶם" },
    "3mp": { plain: "עליהם", niqqud: "עֲלֵיהֶם" },
  },
  // ל — to / for (dative)
  le: {
    base: "ל",
    "1sg": { plain: "לי", niqqud: "לִי" },
    "2ms": { plain: "לך", niqqud: "לְךָ" },
    "2fs": { plain: "לך", niqqud: "לָךְ" },
    "3ms": { plain: "לו", niqqud: "לוֹ" },
    "3fs": { plain: "לה", niqqud: "לָהּ" },
    "1pl": { plain: "לנו", niqqud: "לָנוּ" },
    "2mp": { plain: "לכם", niqqud: "לָכֶם" },
    "3mp": { plain: "להם", niqqud: "לָהֶם" },
  },
  // ב — in / with / at
  be: {
    base: "ב",
    "1sg": { plain: "בי", niqqud: "בִּי" },
    "2ms": { plain: "בך", niqqud: "בְּךָ" },
    "2fs": { plain: "בך", niqqud: "בָּךְ" },
    "3ms": { plain: "בו", niqqud: "בּוֹ" },
    "3fs": { plain: "בה", niqqud: "בָּהּ" },
    "1pl": { plain: "בנו", niqqud: "בָּנוּ" },
    "2mp": { plain: "בכם", niqqud: "בָּכֶם" },
    "3mp": { plain: "בהם", niqqud: "בָּהֶם" },
  },
  // מ / מן — from
  mi: {
    base: "מ",
    "1sg": { plain: "ממני", niqqud: "מִמֶּנִּי" },
    "2ms": { plain: "ממך", niqqud: "מִמְּךָ" },
    "2fs": { plain: "ממך", niqqud: "מִמֵּךְ" },
    "3ms": { plain: "ממנו", niqqud: "מִמֶּנּוּ" },
    "3fs": { plain: "ממנה", niqqud: "מִמֶּנָּה" },
    "1pl": { plain: "מאיתנו", niqqud: "מֵאִתָּנוּ" },
    "2mp": { plain: "מכם", niqqud: "מִכֶּם" },
    "3mp": { plain: "מהם", niqqud: "מֵהֶם" },
  },
  // עם — with (inflects on the את comitative base). Uses plene vocalized
  // spelling (with the yod: אִיתָם) so the forms stay legible on the buttons.
  im: {
    base: "עם",
    "1sg": { plain: "איתי", niqqud: "אִיתִּי" },
    "2ms": { plain: "איתך", niqqud: "אִיתְּךָ" },
    "2fs": { plain: "איתך", niqqud: "אִיתָּךְ" },
    "3ms": { plain: "איתו", niqqud: "אִיתּוֹ" },
    "3fs": { plain: "איתה", niqqud: "אִיתָּהּ" },
    "1pl": { plain: "איתנו", niqqud: "אִיתָּנוּ" },
    "2mp": { plain: "איתכם", niqqud: "אִיתְּכֶם" },
    "3mp": { plain: "איתם", niqqud: "אִיתָּם" },
  },
  // את — accusative direct-object marker (used mainly as a distractor base)
  et: {
    base: "את",
    "1sg": { plain: "אותי", niqqud: "אוֹתִי" },
    "2ms": { plain: "אותך", niqqud: "אוֹתְךָ" },
    "2fs": { plain: "אותך", niqqud: "אוֹתָךְ" },
    "3ms": { plain: "אותו", niqqud: "אוֹתוֹ" },
    "3fs": { plain: "אותה", niqqud: "אוֹתָהּ" },
    "1pl": { plain: "אותנו", niqqud: "אוֹתָנוּ" },
    "2mp": { plain: "אתכם", niqqud: "אֶתְכֶם" },
    "3mp": { plain: "אותם", niqqud: "אוֹתָם" },
  },
};

// Triggers: a word/expression plus the preposition it governs. `he` is the
// Hebrew shown before the blank; `en` is the English meaning with an {o}
// slot for the object pronoun; `prep` keys into PREPOSITION_INFLECTIONS.
const PREPOSITIONS = [
  { id: "prep-miss",      type: "verb",       he: "מתגעגע",  prep: "el", en: "to miss {o}" },
  { id: "prep-approach",  type: "verb",       he: "ניגש",    prep: "el", en: "to approach {o}" },
  { id: "prep-turnto",    type: "verb",       he: "פונה",    prep: "el", en: "to turn to {o}" },
  { id: "prep-relateto",  type: "verb",       he: "מתייחס",  prep: "el", en: "to relate to {o}" },
  { id: "prep-wait",      type: "verb",       he: "מחכה",    prep: "le", en: "to wait for {o}" },
  { id: "prep-worry",     type: "verb",       he: "דואג",    prep: "le", en: "to worry about {o}" },
  { id: "prep-help",      type: "verb",       he: "עוזר",    prep: "le", en: "to help {o}" },
  { id: "prep-expect",    type: "verb",       he: "מצפה",    prep: "le", en: "to look forward to {o}" },
  { id: "prep-belong",    type: "verb",       he: "שייך",    prep: "le", en: "belongs to {o}" },
  { id: "prep-getused",   type: "verb",       he: "מתרגל",   prep: "le", en: "to get used to {o}" },
  { id: "prep-thinkof",   type: "verb",       he: "חושב",    prep: "al", en: "to think about {o}" },
  { id: "prep-lookat",    type: "verb",       he: "מסתכל",   prep: "al", en: "to look at {o}" },
  { id: "prep-hearabout", type: "verb",       he: "שומע",    prep: "al", en: "to hear about {o}" },
  { id: "prep-giveup",    type: "verb",       he: "מוותר",   prep: "al", en: "to give up on {o}" },
  { id: "prep-guard",     type: "verb",       he: "שומר",    prep: "al", en: "to look after {o}" },
  { id: "prep-protect",   type: "verb",       he: "מגן",     prep: "al", en: "to protect {o}" },
  { id: "prep-influence", type: "verb",       he: "משפיע",   prep: "al", en: "to influence {o}" },
  { id: "prep-laughat",   type: "verb",       he: "צוחק",    prep: "al", en: "to laugh at {o}" },
  { id: "prep-believe",   type: "verb",       he: "מאמין",   prep: "be", en: "to believe in {o}" },
  { id: "prep-treat",     type: "verb",       he: "מטפל",    prep: "be", en: "to take care of {o}" },
  { id: "prep-use",       type: "verb",       he: "משתמש",   prep: "be", en: "to use {o}" },
  { id: "prep-envy",      type: "verb",       he: "מקנא",    prep: "be", en: "to envy {o}" },
  { id: "prep-trust",     type: "verb",       he: "בוטח",    prep: "be", en: "to trust {o}" },
  { id: "prep-talkwith",  type: "verb",       he: "מדבר",    prep: "im", en: "to talk with {o}" },
  { id: "prep-agree",     type: "verb",       he: "מסכים",   prep: "im", en: "to agree with {o}" },
  { id: "prep-marry",     type: "verb",       he: "מתחתן",   prep: "im", en: "to marry {o}" },
  { id: "prep-enjoy",     type: "verb",       he: "נהנה",    prep: "mi", en: "to enjoy {o}" },
  { id: "prep-afraid",    type: "verb",       he: "פוחד",    prep: "mi", en: "to be afraid of {o}" },
  { id: "prep-proud",     type: "adjective",  he: "גאה",     prep: "be", en: "proud of {o}" },
  { id: "prep-inlove",    type: "adjective",  he: "מאוהב",   prep: "be", en: "in love with {o}" },
  { id: "prep-similar",   type: "adjective",  he: "דומה",    prep: "le", en: "similar to {o}" },
  { id: "prep-different", type: "adjective",  he: "שונה",    prep: "mi", en: "different from {o}" },
  { id: "prep-satisfied", type: "adjective",  he: "מרוצה",   prep: "mi", en: "satisfied with {o}" },
  { id: "prep-care",      type: "expression", he: "אכפת לי", prep: "mi", en: "to care about {o}" },
  { id: "prep-fedup",     type: "expression", he: "נמאס לי", prep: "mi", en: "to be fed up with {o}" },
];

if (typeof global !== "undefined") {
  global.PREPOSITION_OBJECTS = PREPOSITION_OBJECTS;
  global.PREPOSITION_INFLECTIONS = PREPOSITION_INFLECTIONS;
  global.PREPOSITIONS = PREPOSITIONS;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PREPOSITION_OBJECTS, PREPOSITION_INFLECTIONS, PREPOSITIONS };
}
})(typeof globalThis !== "undefined" ? globalThis : this);

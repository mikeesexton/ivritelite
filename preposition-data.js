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
  // אצל — at someone's place / by / in someone's possession
  etsel: {
    base: "אצל",
    "1sg": { plain: "אצלי", niqqud: "אֶצְלִי" },
    "2ms": { plain: "אצלך", niqqud: "אֶצְלְךָ" },
    "2fs": { plain: "אצלך", niqqud: "אֶצְלֵךְ" },
    "3ms": { plain: "אצלו", niqqud: "אֶצְלוֹ" },
    "3fs": { plain: "אצלה", niqqud: "אֶצְלָהּ" },
    "1pl": { plain: "אצלנו", niqqud: "אֶצְלֵנוּ" },
    "2mp": { plain: "אצלכם", niqqud: "אֶצְלְכֶם" },
    "3mp": { plain: "אצלם", niqqud: "אֶצְלָם" },
  },
  // ליד — next to / beside
  leyad: {
    base: "ליד",
    "1sg": { plain: "לידי", niqqud: "לְיָדִי" },
    "2ms": { plain: "לידך", niqqud: "לְיָדְךָ" },
    "2fs": { plain: "לידך", niqqud: "לְיָדֵךְ" },
    "3ms": { plain: "לידו", niqqud: "לְיָדוֹ" },
    "3fs": { plain: "לידה", niqqud: "לְיָדָהּ" },
    "1pl": { plain: "לידנו", niqqud: "לְיָדֵנוּ" },
    "2mp": { plain: "לידכם", niqqud: "לְיָדְכֶם" },
    "3mp": { plain: "לידם", niqqud: "לְיָדָם" },
  },
  // נגד — against
  neged: {
    base: "נגד",
    "1sg": { plain: "נגדי", niqqud: "נֶגְדִּי" },
    "2ms": { plain: "נגדך", niqqud: "נֶגְדְּךָ" },
    "2fs": { plain: "נגדך", niqqud: "נֶגְדֵּךְ" },
    "3ms": { plain: "נגדו", niqqud: "נֶגְדּוֹ" },
    "3fs": { plain: "נגדה", niqqud: "נֶגְדָּהּ" },
    "1pl": { plain: "נגדנו", niqqud: "נֶגְדֵּנוּ" },
    "2mp": { plain: "נגדכם", niqqud: "נֶגְדְּכֶם" },
    "3mp": { plain: "נגדם", niqqud: "נֶגְדָּם" },
  },
  // כמו — like / as
  kmo: {
    base: "כמו",
    "1sg": { plain: "כמוני", niqqud: "כָּמוֹנִי" },
    "2ms": { plain: "כמוך", niqqud: "כָּמוֹךָ" },
    "2fs": { plain: "כמוך", niqqud: "כָּמוֹךְ" },
    "3ms": { plain: "כמוהו", niqqud: "כָּמוֹהוּ" },
    "3fs": { plain: "כמוה", niqqud: "כָּמוֹהָ" },
    "1pl": { plain: "כמונו", niqqud: "כָּמוֹנוּ" },
    "2mp": { plain: "כמוכם", niqqud: "כְּמוֹכֶם" },
    "3mp": { plain: "כמוהם", niqqud: "כְּמוֹהֶם" },
  },
  // בשביל — for / for the sake of
  bishvil: {
    base: "בשביל",
    "1sg": { plain: "בשבילי", niqqud: "בִּשְׁבִילִי" },
    "2ms": { plain: "בשבילך", niqqud: "בִּשְׁבִילְךָ" },
    "2fs": { plain: "בשבילך", niqqud: "בִּשְׁבִילֵךְ" },
    "3ms": { plain: "בשבילו", niqqud: "בִּשְׁבִילוֹ" },
    "3fs": { plain: "בשבילה", niqqud: "בִּשְׁבִילָהּ" },
    "1pl": { plain: "בשבילנו", niqqud: "בִּשְׁבִילֵנוּ" },
    "2mp": { plain: "בשבילכם", niqqud: "בִּשְׁבִילְכֶם" },
    "3mp": { plain: "בשבילם", niqqud: "בִּשְׁבִילָם" },
  },
  // בגלל — because of. Kamatz reduces to patach before the heavy suffix
  // (בִּגְלַלְכֶם), matching Academy vocalization.
  biglal: {
    base: "בגלל",
    "1sg": { plain: "בגללי", niqqud: "בִּגְלָלִי" },
    "2ms": { plain: "בגללך", niqqud: "בִּגְלָלְךָ" },
    "2fs": { plain: "בגללך", niqqud: "בִּגְלָלֵךְ" },
    "3ms": { plain: "בגללו", niqqud: "בִּגְלָלוֹ" },
    "3fs": { plain: "בגללה", niqqud: "בִּגְלָלָהּ" },
    "1pl": { plain: "בגללנו", niqqud: "בִּגְלָלֵנוּ" },
    "2mp": { plain: "בגללכם", niqqud: "בִּגְלַלְכֶם" },
    "3mp": { plain: "בגללם", niqqud: "בִּגְלָלָם" },
  },
  // לפני — before / in front of. Plural-type suffixes: light suffixes on
  // לְפָנ־ (לְפָנַי), heavy suffixes on לִפְנֵי־ (לִפְנֵיכֶם).
  lifnei: {
    base: "לפני",
    "1sg": { plain: "לפניי", niqqud: "לְפָנַי" },
    "2ms": { plain: "לפניך", niqqud: "לְפָנֶיךָ" },
    "2fs": { plain: "לפנייך", niqqud: "לְפָנַיִךְ" },
    "3ms": { plain: "לפניו", niqqud: "לְפָנָיו" },
    "3fs": { plain: "לפניה", niqqud: "לְפָנֶיהָ" },
    "1pl": { plain: "לפנינו", niqqud: "לְפָנֵינוּ" },
    "2mp": { plain: "לפניכם", niqqud: "לִפְנֵיכֶם" },
    "3mp": { plain: "לפניהם", niqqud: "לִפְנֵיהֶם" },
  },
  // אחרי — after / behind. Plural-type suffixes, chataf-patach under the ח.
  acharei: {
    base: "אחרי",
    "1sg": { plain: "אחריי", niqqud: "אַחֲרַי" },
    "2ms": { plain: "אחריך", niqqud: "אַחֲרֶיךָ" },
    "2fs": { plain: "אחרייך", niqqud: "אַחֲרַיִךְ" },
    "3ms": { plain: "אחריו", niqqud: "אַחֲרָיו" },
    "3fs": { plain: "אחריה", niqqud: "אַחֲרֶיהָ" },
    "1pl": { plain: "אחרינו", niqqud: "אַחֲרֵינוּ" },
    "2mp": { plain: "אחריכם", niqqud: "אַחֲרֵיכֶם" },
    "3mp": { plain: "אחריהם", niqqud: "אַחֲרֵיהֶם" },
  },
  // מול — opposite / facing
  mul: {
    base: "מול",
    "1sg": { plain: "מולי", niqqud: "מוּלִי" },
    "2ms": { plain: "מולך", niqqud: "מוּלְךָ" },
    "2fs": { plain: "מולך", niqqud: "מוּלֵךְ" },
    "3ms": { plain: "מולו", niqqud: "מוּלוֹ" },
    "3fs": { plain: "מולה", niqqud: "מוּלָהּ" },
    "1pl": { plain: "מולנו", niqqud: "מוּלֵנוּ" },
    "2mp": { plain: "מולכם", niqqud: "מוּלְכֶם" },
    "3mp": { plain: "מולם", niqqud: "מוּלָם" },
  },
  // את — accusative direct-object marker (also serves as a distractor base)
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
  // Dative-experiencer expressions. The slot worth drilling is the ל־
  // experiencer, not the מ־ source, so these carry a `tail` and put the blank in
  // the middle: "נמאס ____ מהעבודה". Freezing the experiencer at לי and rotating
  // the source instead produced נמאס לי ממני / אכפת לי ממני, which are not just
  // improbable but wrong — a source that coreferences the experiencer takes the
  // reflexive (נמאס לי מעצמי). English glosses keep the object-form pronoun the
  // {o} slot supplies, so they are phrased around the thing rather than the person.
  { id: "prep-care",      type: "expression", he: "אכפת", prep: "le", tail: "מהתוצאה", en: "the result matters to {o}" },
  { id: "prep-fedup",     type: "expression", he: "נמאס", prep: "le", tail: "מהעבודה", en: "work is getting old for {o}" },
  { id: "prep-bother",      type: "verb",      he: "מפריע",  prep: "le", en: "to bother {o}" },
  { id: "prep-tell",        type: "verb",      he: "מספר",   prep: "le", en: "to tell {o}" },
  { id: "prep-thank",       type: "verb",      he: "מודה",   prep: "le", en: "to thank {o}" },
  { id: "prep-allow",       type: "verb",      he: "מרשה",   prep: "le", en: "to allow {o}" },
  { id: "prep-suit",        type: "verb",      he: "מתאים",  prep: "le", en: "to suit {o}" },
  { id: "prep-angry",       type: "verb",      he: "כועס",   prep: "al", en: "to be angry at {o}" },
  { id: "prep-relyon",      type: "verb",      he: "סומך",   prep: "al", en: "to rely on {o}" },
  { id: "prep-recommend",   type: "verb",      he: "ממליץ",  prep: "al", en: "to recommend {o}" },
  { id: "prep-dream",       type: "verb",      he: "חולם",   prep: "al", en: "to dream about {o}" },
  { id: "prep-responsible", type: "adjective", he: "אחראי",  prep: "al", en: "responsible for {o}" },
  { id: "prep-support",     type: "verb",      he: "תומך",   prep: "be", en: "to support {o}" },
  { id: "prep-touch",       type: "verb",      he: "נוגע",   prep: "be", en: "to touch {o}" },
  { id: "prep-choose",      type: "verb",      he: "בוחר",   prep: "be", en: "to choose {o}" },
  { id: "prep-depend",      type: "verb",      he: "תלוי",   prep: "be", en: "to depend on {o}" },
  { id: "prep-interested",  type: "adjective", he: "מעוניין", prep: "be", en: "interested in {o}" },
  { id: "prep-meet",        type: "verb",      he: "נפגש",   prep: "im", en: "to meet {o}" },
  { id: "prep-quarrel",     type: "verb",      he: "רב",     prep: "im", en: "to quarrel with {o}" },
  { id: "prep-argue",       type: "verb",      he: "מתווכח", prep: "im", en: "to argue with {o}" },
  { id: "prep-ignore",      type: "verb",      he: "מתעלם",  prep: "mi", en: "to ignore {o}" },
  { id: "prep-askfrom",     type: "verb",      he: "מבקש",   prep: "mi", en: "to request from {o}" },
  { id: "prep-suffer",      type: "verb",      he: "סובל",   prep: "mi", en: "to suffer from {o}" },
  { id: "prep-partfrom",    type: "verb",      he: "נפרד",   prep: "mi", en: "to part from {o}" },
  { id: "prep-disappointed", type: "adjective", he: "מאוכזב", prep: "mi", en: "disappointed by {o}" },
  { id: "prep-workfor",     type: "verb", he: "עובד",   prep: "etsel", en: "to work for {o}" },
  { id: "prep-studyunder",  type: "verb", he: "לומד",   prep: "etsel", en: "to study under {o}" },
  { id: "prep-sitnextto",   type: "verb", he: "יושב",   prep: "leyad", en: "to sit next to {o}" },
  { id: "prep-standnextto", type: "verb", he: "עומד",   prep: "leyad", en: "to stand next to {o}" },
  { id: "prep-voteagainst", type: "verb", he: "מצביע",  prep: "neged", en: "to vote against {o}" },
  { id: "prep-playagainst", type: "verb", he: "משחק",   prep: "neged", en: "to play against {o}" },
  { id: "prep-looklike",    type: "verb", he: "נראה",   prep: "kmo",   en: "to look like {o}" },
  { id: "prep-behavelike",  type: "verb", he: "מתנהג",  prep: "kmo",   en: "to behave like {o}" },
  { id: "prep-join",         type: "verb",       he: "מצטרף",       prep: "el",      en: "to join {o}" },
  { id: "prep-getclose",     type: "verb",       he: "מתקרב",       prep: "el",      en: "to get close to {o}" },
  { id: "prep-phone",        type: "verb",       he: "מתקשר",       prep: "el",      en: "to phone {o}" },
  { id: "prep-listen",       type: "verb",       he: "מקשיב",       prep: "le",      en: "to listen to {o}" },
  { id: "prep-forgive",      type: "verb",       he: "סולח",        prep: "le",      en: "to forgive {o}" },
  { id: "prep-easyfor",      type: "expression", he: "זה קטן",      prep: "al",      en: "it's a piece of cake for {o}" },
  { id: "prep-fallinlove",   type: "verb",       he: "מתאהב",       prep: "be",      en: "to fall in love with {o}" },
  { id: "prep-hurt",         type: "verb",       he: "פוגע",        prep: "be",      en: "to hurt {o}" },
  { id: "prep-makeup",       type: "verb",       he: "משלים",       prep: "im",      en: "to make up with {o}" },
  { id: "prep-dateout",      type: "verb",       he: "יוצא",        prep: "im",      en: "to go out with {o}" },
  { id: "prep-share",        type: "verb",       he: "מתחלק",       prep: "im",      en: "to share with {o}" },
  { id: "prep-cooperate",    type: "expression", he: "משתף פעולה",  prep: "im",      en: "to cooperate with {o}" },
  { id: "prep-impressed",    type: "verb",       he: "מתרשם",       prep: "mi",      en: "to be impressed by {o}" },
  { id: "prep-visitat",      type: "verb",       he: "מבקר",        prep: "etsel",   en: "to visit at {o}'s place" },
  { id: "prep-sleepover",    type: "verb",       he: "ישן",         prep: "etsel",   en: "to sleep over at {o}'s place" },
  { id: "prep-passby",       type: "verb",       he: "עובר",        prep: "leyad",   en: "to pass by {o}" },
  { id: "prep-fightagainst", type: "verb",       he: "נלחם",        prep: "neged",   en: "to fight against {o}" },
  { id: "prep-demonstrate",  type: "verb",       he: "מפגין",       prep: "neged",   en: "to demonstrate against {o}" },
  { id: "prep-thinklike",    type: "verb",       he: "חושב",        prep: "kmo",     en: "to think like {o}" },
  { id: "prep-exactlylike",  type: "expression", he: "בדיוק",       prep: "kmo",     en: "exactly like {o}" },
  { id: "prep-doall",        type: "expression", he: "עושה הכול",   prep: "bishvil", en: "does everything for {o}" },
  { id: "prep-goodfor",      type: "adjective",  he: "טוב",         prep: "bishvil", en: "good for {o}" },
  { id: "prep-latebecause",  type: "verb",       he: "מאחר",        prep: "biglal",  en: "to be late because of {o}" },
  { id: "prep-allbecause",   type: "expression", he: "הכול",        prep: "biglal",  en: "it's all because of {o}" },
  { id: "prep-arrivebefore", type: "verb",       he: "מגיע",        prep: "lifnei",  en: "to arrive before {o}" },
  { id: "prep-inline",       type: "expression", he: "עומד בתור",   prep: "lifnei",  en: "to stand in line ahead of {o}" },
  { id: "prep-chase",        type: "verb",       he: "רודף",        prep: "acharei", en: "to chase after {o}" },
  { id: "prep-follow",       type: "verb",       he: "עוקב",        prep: "acharei", en: "to follow {o}" },
  { id: "prep-liveacross",   type: "verb",       he: "גר",          prep: "mul",     en: "to live across from {o}" },
  { id: "prep-standfacing",  type: "verb",       he: "עומד",        prep: "mul",     en: "to stand facing {o}" },
  { id: "prep-meetperson",   type: "verb",       he: "פוגש",        prep: "et",      en: "to meet {o}" },
  { id: "prep-know",         type: "verb",       he: "מכיר",        prep: "et",      en: "to know {o}" },
  { id: "prep-invite",       type: "verb",       he: "מזמין",       prep: "et",      en: "to invite {o}" },
  { id: "prep-love",         type: "verb",       he: "אוהב",        prep: "et",      en: "to love {o}" },
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

(function initIvriQuestCharacterData(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const characterData = app.characterData = app.characterData || {};

function dialogue(text, glosses) {
  return Object.freeze({ text, glosses: Object.freeze(glosses || {}) });
}

const IDO_DIALOGUE = Object.freeze({
  description: dialogue("הוא גיי", { הוא: "he is", גיי: "gay" }),
  firstM: dialogue("כשאתה לומד על תל אביב, תל אביב לומדת עליך. מוכן, כפרה?", {
    כשאתה: "when you", לומד: "learn", על: "about", תל: "Tel Aviv", אביב: "Tel Aviv",
    לומדת: "learns", עליך: "about you", מוכן: "ready", כפרה: "babe",
  }),
  firstF: dialogue("כשאת לומדת על תל אביב, תל אביב לומדת עלייך. מוכנה, כפרה?", {
    כשאת: "when you", לומדת: "learn", על: "about", תל: "Tel Aviv", אביב: "Tel Aviv",
    עלייך: "about you", מוכנה: "ready", כפרה: "babe",
  }),
  greeting: dialogue("אהלן, כפרה. היום לומדים איך אנשים באמת מדברים — ואיך הם באמת חיים.", {
    אהלן: "hey", כפרה: "babe", היום: "today", לומדים: "we’re learning", איך: "how",
    אנשים: "people", באמת: "really", מדברים: "talk", ואיך: "and how", הם: "they", חיים: "live",
  }),
  fourRight: dialogue("אוקיייי, עכשיו אנחנו מדברים.", {
    אוקיייי: "okayyy", עכשיו: "now", אנחנו: "we’re", מדברים: "talking",
  }),
  oneWrong: dialogue("לא נורא, אף אחד לא ראה את זה.", {
    לא: "not", נורא: "terrible", אף: "no", אחד: "one", ראה: "saw", את: "that", זה: "that",
  }),
  fourWrongM: dialogue("רגע, בלי לחץ... אתה מתקדם.", {
    רגע: "wait", בלי: "without", לחץ: "pressure", אתה: "you", מתקדם: "are improving",
  }),
  fourWrongF: dialogue("רגע, בלי לחץ... את מתקדמת.", {
    רגע: "wait", בלי: "without", לחץ: "pressure", את: "you", מתקדמת: "are improving",
  }),
  recovery: dialogue("לא נפלת, סתם עשית ווגינג.", {
    לא: "not", נפלת: "fell", סתם: "just", עשית: "did", ווגינג: "voguing",
  }),
  perfectM: dialogue("אפס טעויות. יש לך משהו להגיד על זה? בוא תראה איך עושה טווס!", {
    אפס: "zero", טעויות: "mistakes", יש: "have", לך: "you", משהו: "something",
    להגיד: "to say", על: "about", זה: "that", בוא: "come", תראה: "see",
    איך: "how", עושה: "does", טווס: "peacock",
  }),
  perfectF: dialogue("אפס טעויות. יש לך משהו להגיד על זה? בואי תראי איך עושה טווס!", {
    אפס: "zero", טעויות: "mistakes", יש: "have", לך: "you", משהו: "something",
    להגיד: "to say", על: "about", זה: "that", בואי: "come", תראי: "see",
    איך: "how", עושה: "does", טווס: "peacock",
  }),
  mission: dialogue("סבבה, סיימנו. עשית עבודה מעולה — נתראה מחר, חיים שלי.", {
    סבבה: "alright", סיימנו: "we’re done", עשית: "you did", עבודה: "work", מעולה: "great",
    נתראה: "see you", מחר: "tomorrow", חיים: "my love", שלי: "my love",
  }),
  vocabulary: dialogue("נתרגל קצת אוצר מילים לפני שיוצאים!", {
    נתרגל: "let’s practice", קצת: "some", אוצר: "vocabulary", מילים: "vocabulary",
    לפני: "before", שיוצאים: "we go out",
  }),
  sentences: dialogue("הקבוצה בדיוק התפוצצה מהודעות — נראה מה הולך שם?", {
    הקבוצה: "group chat", בדיוק: "just", התפוצצה: "blew up", מהודעות: "with messages",
    נראה: "let’s see", מה: "what", הולך: "is going on", שם: "there",
  }),
  listening: dialogue("גיא אומרת שהיא שלחה לך הודעה קולית. הבנת מה היא אמרה?", {
    גיא: "Guy", אומרת: "says", שהיא: "that she", שלחה: "sent", לך: "to you",
    הודעה: "voice message", קולית: "voice message", הבנת: "understood", מה: "what",
    היא: "she", אמרה: "said",
  }),
  conjugation: dialogue("מעלים רמה בדקדוק, כפרה. יאללה!", {
    מעלים: "we’re raising", רמה: "the level", בדקדוק: "in grammar", כפרה: "babe", יאללה: "let’s go",
  }),
  abbreviations: dialogue("ישראלים מתים על קיצורים — נלמד כמה!", {
    ישראלים: "Israelis", מתים: "love", על: "love", קיצורים: "abbreviations",
    נלמד: "let’s learn", כמה: "some",
  }),
  advConj: dialogue("נושא. פועל. מושא. סטטוס זוגי. יאללה!", {
    נושא: "subject", פועל: "verb", מושא: "object", סטטוס: "relationship status",
    זוגי: "relationship status", יאללה: "let’s go",
  }),
  prepositions: dialogue("לכל פועל יש מילת היחס שלו. מתחילים!", {
    לכל: "every", פועל: "verb", יש: "has", מילת: "preposition", היחס: "preposition",
    שלו: "its", מתחילים: "let’s start",
  }),
  binyanim: dialogue("שורש אחד, שבע אישיויות. הכי תל אביב.", {
    שורש: "root", אחד: "one", שבע: "seven", אישיויות: "personalities",
    הכי: "so", תל: "Tel Aviv", אביב: "Tel Aviv",
  }),
  handwriting: dialogue("כתב יד: כל אות עוברת מייקאובר.", {
    כתב: "handwriting", יד: "handwriting", כל: "every", אות: "letter",
    עוברת: "gets", מייקאובר: "a makeover",
  }),
});

const INBAL_DIALOGUE = Object.freeze({
  description: dialogue("מיסטית. רוחנית. דתית. אין הבדל.", {
    מיסטית: "mystic", רוחנית: "spiritual", דתית: "religious", אין: "no", הבדל: "difference",
  }),
  first: dialogue("היקום כיוון אותך אליי. קוראים לי ענבל.", {
    היקום: "the universe", כיוון: "steered", אותך: "you", אליי: "to me",
    קוראים: "they call", לי: "me", ענבל: "Inbal",
  }),
  greeting: dialogue("קראתי בקפה. היום יום טוב ללמוד.", {
    קראתי: "I read", בקפה: "in the coffee", היום: "today", יום: "a day",
    טוב: "good", ללמוד: "to learn",
  }),
  fourRight: dialogue("האנרגיה זורמת. זה כבר לא מזל—זה כוח.", {
    האנרגיה: "the energy", זורמת: "is flowing", זה: "this", כבר: "already",
    לא: "not", מזל: "luck", כוח: "power",
  }),
  oneWrongM: dialogue("זה לא אתה—זה מזל רע רגעי.", {
    זה: "this", לא: "not", אתה: "you", מזל: "luck", רע: "bad", רגעי: "momentary",
  }),
  oneWrongF: dialogue("זה לא את—זה מזל רע רגעי.", {
    זה: "this", לא: "not", את: "you", מזל: "luck", רע: "bad", רגעי: "momentary",
  }),
  fourWrong: dialogue("צריך לשבור את הקללה הזאת. נשימה, ומתחילים מחדש.", {
    צריך: "we need", לשבור: "to break", את: "(object marker)", הקללה: "the curse",
    הזאת: "this", נשימה: "a breath", ומתחילים: "and we start", מחדש: "over",
  }),
  recovery: dialogue("הקללה נשברה.", {
    הקללה: "the curse", נשברה: "is broken",
  }),
  perfect: dialogue("לא לימדתי אותך את זה—זה כבר היה בנשמה.", {
    לא: "not", לימדתי: "I taught", אותך: "you", את: "(object marker)", זה: "this",
    כבר: "already", היה: "was", בנשמה: "in the soul",
  }),
  mission: dialogue("נסגר מעגל, נפתח מעגל. אני מברכת אותך. עד הפעם הבאה.", {
    נסגר: "closes", מעגל: "a circle", נפתח: "opens", אני: "I", מברכת: "bless",
    אותך: "you", עד: "until", הפעם: "the time", הבאה: "next",
  }),
  vocabularyM: dialogue("כל מילה מסתירה סוד. בוא נגלה.", {
    כל: "every", מילה: "word", מסתירה: "hides", סוד: "a secret",
    בוא: "come", נגלה: "let’s uncover",
  }),
  vocabularyF: dialogue("כל מילה מסתירה סוד. בואי נגלה.", {
    כל: "every", מילה: "word", מסתירה: "hides", סוד: "a secret",
    בואי: "come", נגלה: "let’s uncover",
  }),
  sentences: dialogue("מילים מפוזרות. נסדר אותן ללחש.", {
    מילים: "words", מפוזרות: "scattered", נסדר: "we’ll arrange",
    אותן: "them", ללחש: "into a spell",
  }),
  listeningM: dialogue("שמע. תקשיב. עצום עיניים.", {
    שמע: "listen", תקשיב: "pay attention", עצום: "close", עיניים: "your eyes",
  }),
  listeningF: dialogue("שמעי. תקשיבי. עצמי עיניים.", {
    שמעי: "listen", תקשיבי: "pay attention", עצמי: "close", עיניים: "your eyes",
  }),
  conjugationM: dialogue("הפועל משנה צורה כמו אדם זאב. עקוב אחריו.", {
    הפועל: "the verb", משנה: "changes", צורה: "form", כמו: "like",
    אדם: "a werewolf", זאב: "a werewolf", עקוב: "follow", אחריו: "it",
  }),
  conjugationF: dialogue("הפועל משנה צורה כמו אדם זאב. עקבי אחריו.", {
    הפועל: "the verb", משנה: "changes", צורה: "form", כמו: "like",
    אדם: "a werewolf", זאב: "a werewolf", עקבי: "follow", אחריו: "it",
  }),
  abbreviations: dialogue("קפיצת הדרך: מתחילת המילה לסופה, בלי לעבור באמצע.", {
    קפיצת: "a miraculous leap", הדרך: "a miraculous leap", מתחילת: "from the start of",
    המילה: "the word", לסופה: "to its end", בלי: "without",
    לעבור: "passing", באמצע: "through the middle",
  }),
  advConjM: dialogue("שניים נקשרים כאן—נושא ומושא. אל תפחד מהקשר.", {
    שניים: "two", נקשרים: "are bound", כאן: "here", נושא: "a subject",
    ומושא: "and an object", אל: "don’t", תפחד: "be afraid", מהקשר: "of the connection",
  }),
  advConjF: dialogue("שניים נקשרים כאן—נושא ומושא. אל תפחדי מהקשר.", {
    שניים: "two", נקשרים: "are bound", כאן: "here", נושא: "a subject",
    ומושא: "and an object", אל: "don’t", תפחדי: "be afraid", מהקשר: "of the connection",
  }),
  prepositionsM: dialogue("המילים הקטנות שולטות בכול. כבד אותן.", {
    המילים: "the words", הקטנות: "small", שולטות: "rule", בכול: "everything",
    כבד: "respect", אותן: "them",
  }),
  prepositionsF: dialogue("המילים הקטנות שולטות בכול. כבדי אותן.", {
    המילים: "the words", הקטנות: "small", שולטות: "rule", בכול: "everything",
    כבדי: "respect", אותן: "them",
  }),
  binyanim: dialogue("שורש אחד, שבעה בניינים. זה קסם הבריאה.", {
    שורש: "root", אחד: "one", שבעה: "seven", בניינים: "binyanim",
    זה: "this is", קסם: "the magic", הבריאה: "of creation",
  }),
  handwritingM: dialogue("עכשיו אתה חורט. ככה נכתבים לחשים.", {
    עכשיו: "now", אתה: "you", חורט: "are engraving", ככה: "this is how",
    נכתבים: "are written", לחשים: "spells",
  }),
  handwritingF: dialogue("עכשיו את חורטת. ככה נכתבים לחשים.", {
    עכשיו: "now", את: "you", חורטת: "are engraving", ככה: "this is how",
    נכתבים: "are written", לחשים: "spells",
  }),
});

const IVRI_DIALOGUE = Object.freeze({
  description: dialogue("הייטק. הון סיכון. אקזיט. הכל ביזנס.", {
    הייטק: "high tech", הון: "venture capital", סיכון: "venture capital",
    אקזיט: "exit", הכל: "everything", ביזנס: "business",
  }),
  firstM: dialogue("ברוך הבא לבורד. בוא נהפוך את העברית שלך ליוניקורן הבא.", {
    ברוך: "welcome", הבא: "welcome", לבורד: "to the board", בוא: "come",
    נהפוך: "let’s turn", את: "(object marker)", העברית: "your Hebrew",
    שלך: "your", ליוניקורן: "into a unicorn",
  }),
  firstF: dialogue("ברוכה הבאה לבורד. בואי נהפוך את העברית שלך ליוניקורן הבא.", {
    ברוכה: "welcome", הבאה: "welcome", לבורד: "to the board", בואי: "come",
    נהפוך: "let’s turn", את: "(object marker)", העברית: "your Hebrew",
    שלך: "your", ליוניקורן: "into a unicorn", הבא: "next",
  }),
  greetingM: dialogue("זמן להשקיע בעצמך. מוכן לספרינט של היום?", {
    זמן: "time", להשקיע: "to invest", בעצמך: "in yourself", מוכן: "ready",
    לספרינט: "for today’s sprint", של: "of", היום: "today",
  }),
  greetingF: dialogue("זמן להשקיע בעצמך. מוכנה לספרינט של היום?", {
    זמן: "time", להשקיע: "to invest", בעצמך: "in yourself", מוכנה: "ready",
    לספרינט: "for today’s sprint", של: "of", היום: "today",
  }),
  fourRight: dialogue("מצוין. זה מה שאני קורא לו בקרת איכות. ממשיכים לבצע.", {
    מצוין: "excellent", זה: "this", מה: "what", שאני: "that I", קורא: "call",
    לו: "it", בקרת: "control", איכות: "quality", ממשיכים: "we keep",
    לבצע: "executing",
  }),
  oneWrongM: dialogue("בוא נעשה דיבאג ונמשיך.", {
    בוא: "come", נעשה: "let’s do", דיבאג: "debugging", ונמשיך: "and continue",
  }),
  oneWrongF: dialogue("בואי נעשה דיבאג ונמשיך.", {
    בואי: "come", נעשה: "let’s do", דיבאג: "debugging", ונמשיך: "and continue",
  }),
  fourWrong: dialogue("אנחנו שורפים מזומנים. פיבוט, עכשיו!", {
    אנחנו: "we’re", שורפים: "burning", מזומנים: "cash", פיבוט: "pivot", עכשיו: "now",
  }),
  recovery: dialogue("תיקון מסלול מצוין. חזרנו לרווחיות.", {
    תיקון: "correction", מסלול: "course", מצוין: "excellent",
    חזרנו: "we’re back", לרווחיות: "to profitability",
  }),
  perfect: dialogue("אקזיט מושלם! ביצוע ללא דופי.", {
    אקזיט: "exit", מושלם: "perfect", ביצוע: "execution", ללא: "without", דופי: "flaw",
  }),
  mission: dialogue("סגרנו את הסיבוב בהצלחה. מחר חוזרים לעבוד.", {
    סגרנו: "we closed", את: "(object marker)", הסיבוב: "the round",
    בהצלחה: "successfully", מחר: "tomorrow", חוזרים: "we’re back", לעבוד: "to work",
  }),
  vocabulary: dialogue("אוצר מילים זה נכס אסטרטגי. בואו נתאמן.", {
    אוצר: "vocabulary", מילים: "vocabulary", זה: "is", נכס: "an asset",
    אסטרטגי: "strategic", בואו: "come", נתאמן: "let’s practice",
  }),
  sentencesM: dialogue("הבורד דורש דוחות ברורים. בוא נתרגם את התובנות בשבילם.", {
    הבורד: "the board", דורש: "requires", דוחות: "reports", ברורים: "clear",
    בוא: "come", נתרגם: "let’s translate", את: "(object marker)",
    התובנות: "the insights", בשבילם: "for them",
  }),
  sentencesF: dialogue("הבורד דורש דוחות ברורים. בואי נתרגם את התובנות בשבילם.", {
    הבורד: "the board", דורש: "requires", דוחות: "reports", ברורים: "clear",
    בואי: "come", נתרגם: "let’s translate", את: "(object marker)",
    התובנות: "the insights", בשבילם: "for them",
  }),
  listeningM: dialogue("המשקיעים מדברים. תקשיב טוב לפידבק.", {
    המשקיעים: "the investors", מדברים: "are talking", תקשיב: "listen",
    טוב: "carefully", לפידבק: "to the feedback",
  }),
  listeningF: dialogue("המשקיעים מדברים. תקשיבי טוב לפידבק.", {
    המשקיעים: "the investors", מדברים: "are talking", תקשיבי: "listen",
    טוב: "carefully", לפידבק: "to the feedback",
  }),
  conjugationM: dialogue("פיץ׳ זה הכול עניין של טיימינג. תדייק בזמנים ובפעלים.", {
    "פיץ׳": "a pitch", זה: "is", הכול: "all", עניין: "a matter",
    של: "of", טיימינג: "timing", תדייק: "be precise",
    בזמנים: "with tenses", ובפעלים: "and verbs",
  }),
  conjugationF: dialogue("פיץ׳ זה הכול עניין של טיימינג. תדייקי בזמנים ובפעלים.", {
    "פיץ׳": "a pitch", זה: "is", הכול: "all", עניין: "a matter",
    של: "of", טיימינג: "timing", תדייקי: "be precise",
    בזמנים: "with tenses", ובפעלים: "and verbs",
  }),
  abbreviationsM: dialogue("זמן זה משאב יקר. קיצורים יביאו אותנו לדדליין. בוא נתחיל.", {
    זמן: "time", זה: "is", משאב: "a resource", יקר: "valuable",
    קיצורים: "abbreviations", יביאו: "will get", אותנו: "us",
    לדדליין: "to the deadline", בוא: "come", נתחיל: "let’s begin",
  }),
  abbreviationsF: dialogue("זמן זה משאב יקר. קיצורים יביאו אותנו לדדליין. בואי נתחיל.", {
    זמן: "time", זה: "is", משאב: "a resource", יקר: "valuable",
    קיצורים: "abbreviations", יביאו: "will get", אותנו: "us",
    לדדליין: "to the deadline", בואי: "come", נתחיל: "let’s begin",
  }),
  advConj: dialogue("אנחנו בתוך אודיט פנימי. כל פועל וזמן חייבים להיות מתועדים כהלכה.", {
    אנחנו: "we’re", בתוך: "in", אודיט: "an audit", פנימי: "internal",
    כל: "every", פועל: "verb", וזמן: "and tense", חייבים: "must",
    להיות: "be", מתועדים: "documented", כהלכה: "properly",
  }),
  prepositionsM: dialogue("הרמ״ט שלי במיאמי והאינבוקס בכאוס. תעזור לי לנתב הכול.", {
    "הרמ״ט": "my chief of staff", שלי: "my", במיאמי: "in Miami",
    והאינבוקס: "and the inbox", בכאוס: "is in chaos", תעזור: "help",
    לי: "me", לנתב: "route", הכול: "everything",
  }),
  prepositionsF: dialogue("הרמ״ט שלי במיאמי והאינבוקס בכאוס. תעזרי לי לנתב הכול.", {
    "הרמ״ט": "my chief of staff", שלי: "my", במיאמי: "in Miami",
    והאינבוקס: "and the inbox", בכאוס: "is in chaos", תעזרי: "help",
    לי: "me", לנתב: "route", הכול: "everything",
  }),
  binyanim: dialogue("הגיע הזמן לעשות סקייל. בואו נבנה.", {
    הגיע: "has come", הזמן: "the time", לעשות: "to do", סקייל: "scale",
    בואו: "come", נבנה: "let’s build",
  }),
  handwritingM: dialogue("הפגישה הזאת סודית, בלי מחשבים בחדר. קח עט ותכתוב מהר.", {
    הפגישה: "the meeting", הזאת: "this", סודית: "is secret", בלי: "without",
    מחשבים: "computers", בחדר: "in the room", קח: "take", עט: "a pen",
    ותכתוב: "and write", מהר: "quickly",
  }),
  handwritingF: dialogue("הפגישה הזאת סודית, בלי מחשבים בחדר. קחי עט ותכתבי מהר.", {
    הפגישה: "the meeting", הזאת: "this", סודית: "is secret", בלי: "without",
    מחשבים: "computers", בחדר: "in the room", קחי: "take", עט: "a pen",
    ותכתבי: "and write", מהר: "quickly",
  }),
});

// Missing keys resolve through this chain so a character with an incomplete
// dialogue table degrades to a sensible line instead of rendering nothing.
characterData.DIALOGUE_FALLBACKS = characterData.DIALOGUE_FALLBACKS || Object.freeze({
  recovery: "fourRight",
  oneWrong: "fourWrong",
  vocabulary: "greeting",
  sentences: "greeting",
  listening: "greeting",
  conjugation: "greeting",
  abbreviations: "greeting",
  advConj: "greeting",
  prepositions: "greeting",
  binyanim: "greeting",
  handwriting: "greeting",
});

characterData.characters = characterData.characters || Object.freeze({
  ido: Object.freeze({
    id: "ido",
    nameEn: "Ido",
    nameHe: "עידו",
    order: 1,
    dialogue: IDO_DIALOGUE,
    route: Object.freeze({
      vocabCategories: Object.freeze([
        "social_cultural",
        "culture_identity_expanded",
        "dating_relationships",
        "relationships_dating_expanded",
        "conversation_glue",
        "media_digital_life_expanded",
      ]),
      sentenceCategories: Object.freeze(["colloquial"]),
      sentenceStyles: Object.freeze(["whatsapp"]),
      abbrBuckets: Object.freeze(["Daily Life & Home"]),
      verbIds: Object.freeze(["advanced-verb-laharos", "advanced-verb-lelarler"]),
    }),
  }),
  inbal: Object.freeze({
    id: "inbal",
    nameEn: "Inbal",
    nameHe: "ענבל",
    order: 2,
    dialogue: INBAL_DIALOGUE,
    route: Object.freeze({
      vocabCategories: Object.freeze(["religion_magic_spirituality"]),
      // Words squarely in her territory that live in other categories. Several
      // sit in categories Ido owns; the strategy doc sanctions multi-owner
      // routing for genuinely cross-cutting items, so he keeps them too.
      vocabWords: Object.freeze([
        "חילוני",
        "דתי",
        "חרדי",
        "חילוניות",
        "חופש דת",
        "חופש מדת",
        "דת ומדינה",
        "כפייה דתית",
        "טקס חג",
        "פרקטיקה דתית",
        "קהילת בית כנסת",
        "סלנג חילוני",
        "פילוסופיה דתית",
        "לחש",
        "אמונה",
        "תעלומה",
      ]),
      sentenceIdPrefixes: Object.freeze(["inbal_"]),
      abbrBuckets: Object.freeze(["People, Health & Culture"]),
      verbIds: Object.freeze([
        "character-verb-levarech",
        "character-verb-lehitpalel",
        "character-verb-lehaamin",
        "character-verb-latzum",
        "character-verb-lekadesh",
        "character-verb-litbol",
        "character-verb-lekalel",
        "character-verb-lenachesh",
        "character-verb-lehashbia",
        "character-verb-lehitgayer",
      ]),
    }),
  }),
  ivri: Object.freeze({
    id: "ivri",
    nameEn: "Ivri",
    nameHe: "עברי",
    order: 3,
    dialogue: IVRI_DIALOGUE,
    route: Object.freeze({
      vocabCategories: Object.freeze([
        "work_business",
        "technology_ai",
        "finance_investing",
        "technology_ai_expanded",
        "business_finance_expanded",
        "communication_mastery_expanded",
      ]),
      sentenceCategories: Object.freeze(["professional"]),
      abbrBuckets: Object.freeze(["Civics, Law & Work", "Ideas, Science & Tech"]),
      verbIds: Object.freeze([
        "starter-verb-laavod",
        "starter-verb-letachnen",
        "advanced-verb-lenateach",
        "common-verb-liknot",
        "common-verb-limkor",
        "common-verb-lehachlit",
        "advanced-verb-leadken",
        "advanced-verb-leasher",
      ]),
    }),
  }),
});

characterData.getCharacter = characterData.getCharacter || function getCharacter(id) {
  return characterData.characters[String(id || "")] || null;
};

characterData.getCharacterIds = characterData.getCharacterIds || function getCharacterIds() {
  return Object.values(characterData.characters)
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.id);
};
})(typeof window !== "undefined" ? window : globalThis);

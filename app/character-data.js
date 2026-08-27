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

// Authored plural-address in the source script; every line below is rewritten to
// singular. Where masculine and feminine singular share a spelling (שלך, לך,
// שקלת, אותך) the line stays single-variant rather than duplicated.
const INAT_DIALOGUE = Object.freeze({
  // Ungendered like the other three cards: dropping תכיר/תכירי removes the only
  // gendered word, so one line serves both.
  description: dialogue("פוליטיקה. היסטוריה. הפרופסורית.", {
    פוליטיקה: "politics", היסטוריה: "history", הפרופסורית: "the professor",
  }),
  first: dialogue("להימנע מפוליטיקה זה חכם. אבל להבין אותה זה חשוב. שנתחיל?", {
    להימנע: "to avoid", מפוליטיקה: "politics", זה: "is", חכם: "smart",
    אבל: "but", להבין: "to understand", אותה: "it", חשוב: "important",
    שנתחיל: "shall we begin",
  }),
  greetingM: dialogue("אנחנו חיים בזמנים מורכבים. זה תלוי בנו לעשות בזה סדר. בוא נתחיל.", {
    אנחנו: "we", חיים: "live", בזמנים: "in times", מורכבים: "complicated",
    זה: "it", תלוי: "is up to", בנו: "us", לעשות: "to make", בזה: "of it",
    סדר: "sense", בוא: "come", נתחיל: "let’s begin",
  }),
  greetingF: dialogue("אנחנו חיים בזמנים מורכבים. זה תלוי בנו לעשות בזה סדר. בואי נתחיל.", {
    אנחנו: "we", חיים: "live", בזמנים: "in times", מורכבים: "complicated",
    זה: "it", תלוי: "is up to", בנו: "us", לעשות: "to make", בזה: "of it",
    סדר: "sense", בואי: "come", נתחיל: "let’s begin",
  }),
  fourRightM: dialogue("מצוין. בקרוב תופיע בקשת 12.", {
    מצוין: "excellent", בקרוב: "soon", תופיע: "you’ll be on", בקשת: "Channel 12",
  }),
  fourRightF: dialogue("מצוין. בקרוב תופיעי בקשת 12.", {
    מצוין: "excellent", בקרוב: "soon", תופיעי: "you’ll be on", בקשת: "Channel 12",
  }),
  oneWrongM: dialogue("זהירות. כדאי לקרוא שוב. קטן עליך.", {
    זהירות: "careful", כדאי: "it’s worth", לקרוא: "reading", שוב: "again",
    קטן: "you’ve got this", עליך: "you’ve got this",
  }),
  oneWrongF: dialogue("זהירות. כדאי לקרוא שוב. קטן עלייך.", {
    זהירות: "careful", כדאי: "it’s worth", לקרוא: "reading", שוב: "again",
    קטן: "you’ve got this", עלייך: "you’ve got this",
  }),
  fourWrong: dialogue("אולי כדאי להתחיל טיוטה חדשה.", {
    אולי: "maybe", כדאי: "it’s worth", להתחיל: "starting", טיוטה: "a draft", חדשה: "new",
  }),
  recovery: dialogue("תיקון מעולה. הנקודה שלך ברורה עכשיו.", {
    תיקון: "a correction", מעולה: "excellent", הנקודה: "the point",
    שלך: "your", ברורה: "is clear", עכשיו: "now",
  }),
  perfect: dialogue("עבודה יוצאת מן הכלל. רמת דוקטורט. שקלת לימודי משפטים?", {
    עבודה: "work", יוצאת: "outstanding", מן: "outstanding", הכלל: "outstanding",
    רמת: "level", דוקטורט: "doctorate", שקלת: "have you considered",
    לימודי: "studies", משפטים: "law",
  }),
  mission: dialogue("תודה על העזרה. כדאי לך לנוח — השיעור מחר מתחיל בתשע.", {
    תודה: "thank you", על: "for", העזרה: "the help", כדאי: "you should",
    לך: "you", לנוח: "rest", השיעור: "the class", מחר: "tomorrow",
    מתחיל: "starts", בתשע: "at nine",
  }),
  vocabularyM: dialogue("טיעונים חזקים דורשים שפה מדויקת. בוא נתרגל.", {
    טיעונים: "arguments", חזקים: "strong", דורשים: "require", שפה: "language",
    מדויקת: "precise", בוא: "come", נתרגל: "let’s practice",
  }),
  vocabularyF: dialogue("טיעונים חזקים דורשים שפה מדויקת. בואי נתרגל.", {
    טיעונים: "arguments", חזקים: "strong", דורשים: "require", שפה: "language",
    מדויקת: "precise", בואי: "come", נתרגל: "let’s practice",
  }),
  sentencesM: dialogue("העיתון ביקש טור דעה. תוכל לעבור על זה?", {
    העיתון: "the newspaper", ביקש: "asked for", טור: "an opinion column",
    דעה: "an opinion column", תוכל: "could you", לעבור: "go over", על: "over", זה: "it",
  }),
  sentencesF: dialogue("העיתון ביקש טור דעה. תוכלי לעבור על זה?", {
    העיתון: "the newspaper", ביקש: "asked for", טור: "an opinion column",
    דעה: "an opinion column", תוכלי: "could you", לעבור: "go over", על: "over", זה: "it",
  }),
  listeningM: dialogue("תקשיב לראיון הזה בפודקאסט. מה מעניין אותך פה?", {
    תקשיב: "listen", לראיון: "to the interview", הזה: "this",
    בפודקאסט: "on the podcast", מה: "what", מעניין: "interests", אותך: "you", פה: "here",
  }),
  listeningF: dialogue("תקשיבי לראיון הזה בפודקאסט. מה מעניין אותך פה?", {
    תקשיבי: "listen", לראיון: "to the interview", הזה: "this",
    בפודקאסט: "on the podcast", מה: "what", מעניין: "interests", אותך: "you", פה: "here",
  }),
  conjugation: dialogue("כדי לנהל דיון טוב, צריך לחשוב מהר. קדימה.", {
    כדי: "in order", לנהל: "to hold", דיון: "a debate", טוב: "good",
    צריך: "you need", לחשוב: "to think", מהר: "fast", קדימה: "let’s go",
  }),
  abbreviationsM: dialogue("אי אפשר להימנע מר״ת כשמדברים על מדיניות. בוא נתרגל.", {
    אי: "impossible", אפשר: "impossible", להימנע: "to avoid",
    "מר״ת": "abbreviations", כשמדברים: "when talking", על: "about",
    מדיניות: "policy", בוא: "come", נתרגל: "let’s practice",
  }),
  abbreviationsF: dialogue("אי אפשר להימנע מר״ת כשמדברים על מדיניות. בואי נתרגל.", {
    אי: "impossible", אפשר: "impossible", להימנע: "to avoid",
    "מר״ת": "abbreviations", כשמדברים: "when talking", על: "about",
    מדיניות: "policy", בואי: "come", נתרגל: "let’s practice",
  }),
  advConjM: dialogue("היסטוריה היא בעצם אוסף של סיפורים. בוא נלמד אותם.", {
    היסטוריה: "history", היא: "is", בעצם: "really", אוסף: "a collection",
    של: "of", סיפורים: "stories", בוא: "come", נלמד: "let’s learn", אותם: "them",
  }),
  advConjF: dialogue("היסטוריה היא בעצם אוסף של סיפורים. בואי נלמד אותם.", {
    היסטוריה: "history", היא: "is", בעצם: "really", אוסף: "a collection",
    של: "of", סיפורים: "stories", בואי: "come", נלמד: "let’s learn", אותם: "them",
  }),
  prepositionsM: dialogue("היסטוריה עוסקת באנשים ובמערכות היחסים ביניהם. בוא נבין אותם.", {
    היסטוריה: "history", עוסקת: "is about", באנשים: "people",
    ובמערכות: "and the relationships", היחסים: "and the relationships",
    ביניהם: "between them", בוא: "come", נבין: "let’s understand", אותם: "them",
  }),
  prepositionsF: dialogue("היסטוריה עוסקת באנשים ובמערכות היחסים ביניהם. בואי נבין אותם.", {
    היסטוריה: "history", עוסקת: "is about", באנשים: "people",
    ובמערכות: "and the relationships", היחסים: "and the relationships",
    ביניהם: "between them", בואי: "come", נבין: "let’s understand", אותם: "them",
  }),
  binyanimM: dialogue("חוקים חלים על הכל — אפילו על שורשים. בוא נלמד.", {
    חוקים: "laws", חלים: "apply", על: "to", הכל: "everything",
    אפילו: "even", שורשים: "roots", בוא: "come", נלמד: "let’s learn",
  }),
  binyanimF: dialogue("חוקים חלים על הכל — אפילו על שורשים. בואי נלמד.", {
    חוקים: "laws", חלים: "apply", על: "to", הכל: "everything",
    אפילו: "even", שורשים: "roots", בואי: "come", נלמד: "let’s learn",
  }),
  handwritingM: dialogue("האוניברסיטה מארחת פאנל, אני צריכה שתרשום הערות.", {
    האוניברסיטה: "the university", מארחת: "is hosting", פאנל: "a panel",
    אני: "I", צריכה: "need", שתרשום: "you to take", הערות: "notes",
  }),
  handwritingF: dialogue("האוניברסיטה מארחת פאנל, אני צריכה שתרשמי הערות.", {
    האוניברסיטה: "the university", מארחת: "is hosting", פאנל: "a panel",
    אני: "I", צריכה: "need", שתרשמי: "you to take", הערות: "notes",
  }),
});

const IDAN_DIALOGUE = Object.freeze({
  description: dialogue("בטיחות וביטחון. בלי תירוצים, בלי ניחושים.", {
    בטיחות: "safety", וביטחון: "and security", בלי: "without",
    תירוצים: "excuses", ניחושים: "guessing",
  }),
  firstM: dialogue("אני עידן. נתחיל במה שחייבים לדעת כשיש אזעקה, ונמשיך משם. מוכן?", {
    אני: "I am", עידן: "Idan", נתחיל: "we’ll start", במה: "with what",
    שחייבים: "one must", לדעת: "know", כשיש: "when there is", אזעקה: "a siren",
    ונמשיך: "and we’ll continue", משם: "from there", מוכן: "ready",
  }),
  firstF: dialogue("אני עידן. נתחיל במה שחייבים לדעת כשיש אזעקה, ונמשיך משם. מוכנה?", {
    אני: "I am", עידן: "Idan", נתחיל: "we’ll start", במה: "with what",
    שחייבים: "one must", לדעת: "know", כשיש: "when there is", אזעקה: "a siren",
    ונמשיך: "and we’ll continue", משם: "from there", מוכנה: "ready",
  }),
  greeting: dialogue("תדריך קצר ואז עובדים. מילים שמצילות חיים קודם, השאר אחר כך.", {
    תדריך: "a briefing", קצר: "short", ואז: "and then", עובדים: "we work",
    מילים: "words", שמצילות: "that save", חיים: "lives", קודם: "first",
    השאר: "the rest", אחר: "afterwards", כך: "afterwards",
  }),
  fourRight: dialogue("ארבע במטרה. ככה נראית מוכנות.", {
    ארבע: "four", במטרה: "on target", ככה: "this is how", נראית: "looks",
    מוכנות: "readiness",
  }),
  oneWrongM: dialogue("עצור. קרא שוב, ואז תענה.", {
    עצור: "stop", קרא: "read", שוב: "again", ואז: "and then", תענה: "answer",
  }),
  oneWrongF: dialogue("עצרי. קראי שוב, ואז תעני.", {
    עצרי: "stop", קראי: "read", שוב: "again", ואז: "and then", תעני: "answer",
  }),
  fourWrong: dialogue("מפסיקים לנחש. נשימה, ריכוז, וחוזרים לנוהל.", {
    מפסיקים: "we stop", לנחש: "guessing", נשימה: "a breath", ריכוז: "focus",
    וחוזרים: "and we return", לנוהל: "to procedure",
  }),
  recovery: dialogue("התאוששת. תיקון מדויק — ממשיכים.", {
    התאוששת: "you recovered", תיקון: "a correction", מדויק: "precise",
    ממשיכים: "we continue",
  }),
  perfect: dialogue("ביצוע נקי, בלי סטייה. זאת הרמה שאני מצפה לה.", {
    ביצוע: "execution", נקי: "clean", בלי: "without", סטייה: "deviation",
    זאת: "this is", הרמה: "the standard", שאני: "that I", מצפה: "expect", לה: "it",
  }),
  mission: dialogue("המשימה הושלמה. תחקיר קצר, ומחר חוזרים למה שנשאר פתוח.", {
    המשימה: "the mission", הושלמה: "is complete", תחקיר: "a debrief", קצר: "short",
    ומחר: "and tomorrow", חוזרים: "we return", למה: "to what", שנשאר: "remained",
    פתוח: "open",
  }),
  vocabulary: dialogue("אוצר מילים של ביטחון ובטיחות. כל מילה כאן שימושית ברגע אמת.", {
    אוצר: "vocabulary", מילים: "vocabulary", של: "of", ביטחון: "security",
    ובטיחות: "and safety", כל: "every", מילה: "word", כאן: "here",
    שימושית: "is useful", ברגע: "in a moment of", אמת: "truth",
  }),
  sentences: dialogue("הוראה מגיעה במשפט שלם. קודם קוראים את כולו, אחר כך מחליטים.", {
    הוראה: "an instruction", מגיעה: "arrives", במשפט: "in a sentence",
    שלם: "complete", קודם: "first", קוראים: "we read", את: "it",
    כולו: "all of it", אחר: "then", כך: "then", מחליטים: "we decide",
  }),
  listeningM: dialogue("בשטח שומעים פעם אחת. תנצל אותה.", {
    בשטח: "in the field", שומעים: "you hear", פעם: "once", אחת: "once",
    תנצל: "make the most of", אותה: "it",
  }),
  listeningF: dialogue("בשטח שומעים פעם אחת. תנצלי אותה.", {
    בשטח: "in the field", שומעים: "you hear", פעם: "once", אחת: "once",
    תנצלי: "make the most of", אותה: "it",
  }),
  conjugation: dialogue("פקודה בזמן הלא נכון היא פקודה שגויה. זמן, גוף, בניין.", {
    פקודה: "an order", בזמן: "in the tense", הלא: "wrong", נכון: "wrong",
    היא: "is", שגויה: "incorrect", זמן: "tense", גוף: "person", בניין: "binyan",
  }),
  abbreviations: dialogue("צה״ל, פקע״ר, ממ״ד. במצב חירום מדברים בקיצורים — ואין זמן לשאול.", {
    "צה״ל": "IDF", "פקע״ר": "Home Front Command", "ממ״ד": "safe room",
    במצב: "in a state of", חירום: "emergency", מדברים: "people speak",
    בקיצורים: "in abbreviations", ואין: "and there is no", זמן: "time",
    לשאול: "to ask",
  }),
  advConj: dialogue("נושא, פועל, מושא — כמו דיווח. שום חלק לא זז בלי סיבה.", {
    נושא: "subject", פועל: "verb", מושא: "object", כמו: "like", דיווח: "a report",
    שום: "no", חלק: "part", לא: "does not", זז: "move", בלי: "without",
    סיבה: "a reason",
  }),
  prepositions: dialogue("מתי, לאן, עם מי. מילות יחס הן הפרטים שמצילים.", {
    מתי: "when", לאן: "where to", עם: "with", מי: "whom", מילות: "prepositions",
    יחס: "prepositions", הן: "are", הפרטים: "the details", שמצילים: "that save you",
  }),
  binyanim: dialogue("שורש אחד, שבעה בניינים. מזהים את התבנית ולא מנחשים.", {
    שורש: "root", אחד: "one", שבעה: "seven", בניינים: "binyanim",
    מזהים: "we identify", את: "the", התבנית: "pattern", ולא: "and do not",
    מנחשים: "guess",
  }),
  handwriting: dialogue("טופס לא קריא הוא טופס חסר תועלת. אות אחרי אות.", {
    טופס: "a form", לא: "not", קריא: "legible", הוא: "is", חסר: "useless",
    תועלת: "useless", אות: "a letter", אחרי: "after",
  }),
});

// Home-front acronyms every resident needs regardless of whose day it is. These
// are granted to all five characters, the same way `civil_defense_safety` is:
// the everyday security tier is course policy, not one character's shelf.
const CIVIL_DEFENSE_ABBR_IDS = Object.freeze([
  "abbr-155", // פקע״ר — Home Front Command
  "abbr-172", // מד״א — Magen David Adom
  "abbr-184", // ממ״ד — safe room (apartment)
  "abbr-185", // ממ״ק — floor shelter
  "abbr-186", // ממ״מ — institutional shelter
  "abbr-260", // כב״א — the fire service
]);

// Idan's alone. Ivri and Inat hold the buckets these sit in, so they name the
// same list under `abbrExcludeIds`: the military register belongs to one voice
// rather than arriving incidentally through "Ideas, Science & Tech".
const MILITARY_ABBR_IDS = Object.freeze([
  "abbr-144", // צה״ל
  "abbr-145", // רמטכ״ל
  "abbr-146", // אמ״ן
  "abbr-147", // שב״כ
  "abbr-151", // מל״ל
  "abbr-152", // פצ״ר
  "abbr-153", // חה״א
  "abbr-154", // חה״י
  "abbr-156", // אכ״א
  "abbr-157", // אג״ת
  "abbr-158", // קמ״ן
  "abbr-159", // קמב״ץ
  "abbr-160", // מש״ק
  "abbr-161", // מ״פ
  "abbr-162", // סמ״פ
  "abbr-163", // מג״ד
  "abbr-164", // סמג״ד
  "abbr-165", // מח״ט
  "abbr-166", // מ״צ
  "abbr-167", // אב״כ
  "abbr-168", // נב״ק
  "abbr-169", // מכ״ם
  "abbr-170", // רק״ם
  "abbr-171", // נגמ״ש
  "abbr-215", // דו״צ
  "abbr-283", // תא״ל
]);

// Police command reads as security rather than military, and the strategy doc
// gives policing to Inat. Idan is granted these without an exclusion, so Ivri
// and Inat keep them through their buckets.
const POLICE_COMMAND_ABBR_IDS = Object.freeze([
  "abbr-148", // המפכ״ל — Police Commissioner
  "abbr-150", // מג״ב — Border Police
]);

// Rows a character-specific signal reaches but which carry no scenario of their
// own: the ordinary civilian-safety register any resident narrates, with nothing
// alarming in it. Same policy as CIVIL_DEFENSE_ABBR_IDS, one level down — the
// grant is per row rather than per shelf, because Idan's bank mixes "the shelter
// is in the yard" with sirens and casualties. Anything naming an azaka, an
// injury, a burn, smoke, an interception or army service stays reserved.
const CAST_WIDE_SENTENCE_IDS = Object.freeze([
  "idan_07", // fire extinguisher next to the emergency exit
  "idan_09", // fasten a seatbelt
  "idan_10", // the guidelines are updated all the time
  "idan_11", // no protected space in the building, the shelter is in the yard
  "idan_14", // an emergency bag with water and medicine
  "idan_26", // helping the neighbour downstairs — no alarming word in the row
  "idan_37", // a fire drill at the office
  "idan_40", // crossing at a crosswalk
  "idan_41", // a helmet on a site
  "idan_42", // swimming where there is a lifeguard
  "idan_43", // electricity with wet hands
  "idan_44", // giving the address when calling the centre
  "idan_45", // the police number
  "idan_46", // keeping water for three days
  "idan_47", // batteries and a radio
  "idan_48", // documents and medicine in one bag
  "idan_49", // the power outage
  "idan_50", // the municipality announced a water outage
  "idan_54", // a security check at the mall entrance
  "idan_55", // the guard asked to open the bag
  "idan_56", // installing the Home Front Command app
  "idan_58", // the shelter key is with the building committee — idan_11's twin
  "idan_60", // checking the safe room monthly
  // The tranche authored to carry the cast-wide `civil_defense_safety` shelf,
  // which had sentence support from only 21 rows for 70 cards. Each one is
  // anchored on a card that had none. Same register as the rows above: standing
  // rules and static infrastructure, never an event.
  "idan_91", // the safety instructions are posted at the entrance
  "idan_92", // reporting a safety hazard to the municipality
  "idan_93", // the light in the stairwell
  "idan_94", // the storeroom in the basement
  "idan_95", // the emergency hotline number on the fridge
  "idan_96", // the municipality published a public announcement
  "idan_97", // a portable radio in the drawer
  "idan_98", // testing the smoke detector once a year
  "idan_99", // the fire service number
  "idan_100", // a road closure because of works
  "idan_101", // an identity check at reception
  "idan_102", // a metal detector at the entrance
  "idan_103", // what is in the emergency supplies cupboard
  "idan_104", // where the reinforced room is in the flat
  "idan_105", // keeping a safe distance from the car in front
  "idan_106", // emergency preparedness starts at home
  "idan_107", // civil defense as a system
  "idan_108", // the support line is open around the clock
  "idan_109", // there is a street shelter at the corner
  "idan_110", // a defense drill at the school
]);

// Keyed by kind so the audience rule needs no per-kind branch. Only sentences
// need an exception today; another kind means another key.
characterData.SHARED_ITEM_IDS = characterData.SHARED_ITEM_IDS || Object.freeze({
  sentence: CAST_WIDE_SENTENCE_IDS,
});

// Lines the engine can request for any character. A character's own table wins;
// these cover copy that belongs to the app rather than to one voice.
characterData.SHARED_DIALOGUE = characterData.SHARED_DIALOGUE || Object.freeze({
  quitM: dialogue("בטוח שאתה רוצה לפרוש מהמשימה? אפשר לבחור דמות חדשה בהגדרות או בעמוד הסקירה.", {
    בטוח: "sure", שאתה: "that you", רוצה: "want", לפרוש: "to quit",
    מהמשימה: "from the mission", אפשר: "you can", לבחור: "to choose",
    דמות: "a character", חדשה: "new", בהגדרות: "in settings", או: "or",
    בעמוד: "on the page", הסקירה: "review",
  }),
  quitF: dialogue("בטוחה שאת רוצה לפרוש מהמשימה? אפשר לבחור דמות חדשה בהגדרות או בעמוד הסקירה.", {
    בטוחה: "sure", שאת: "that you", רוצה: "want", לפרוש: "to quit",
    מהמשימה: "from the mission", אפשר: "you can", לבחור: "to choose",
    דמות: "a character", חדשה: "new", בהגדרות: "in settings", או: "or",
    בעמוד: "on the page", הסקירה: "review",
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
        // Practical Tel Aviv life, which the strategy doc always gave him but
        // the route table never carried. Groceries and the kitchen come with
        // it; cooking_utensils and cooking_verbs stay shared because they are
        // technique rather than street life.
        "home_everyday_life",
        "groceries_food",
        "everyday_survival_expanded",
        // Cast-wide by policy, not a topic claim — see CIVIL_DEFENSE_ABBR_IDS.
        "civil_defense_safety",
      ]),
      sentenceCategories: Object.freeze(["colloquial"]),
      sentenceStyles: Object.freeze(["whatsapp"]),
      abbrBuckets: Object.freeze(["Daily Life & Home"]),
      abbrIds: CIVIL_DEFENSE_ABBR_IDS,
      // Authored for Ido, then routed from the shared pool. The pool verbs are
      // his by register rather than by topic — going out, making plans, texting,
      // laughing — so they stay available to everyone and simply weigh more here.
      verbIds: Object.freeze([
        "advanced-verb-laharos",
        "advanced-verb-lelarler",
        "character-verb-lirkod",
        "character-verb-levalot",
        "character-verb-lachpor",
        "character-verb-lizrom",
        "character-verb-lefargen",
        "character-verb-lehitcharfen",
        "character-verb-lehitmazmez",
        "character-verb-lehitlabet",
        "common-verb-latzet",
        "common-verb-lehipagesh",
        "common-verb-lehitkasher",
        "common-verb-lishloach",
        "common-verb-lehazmin",
        "advanced-verb-litzchok",
        "advanced-verb-lehitlabesh",
        "advanced-verb-lehitragesh",
        "character-verb-lignoach",
        // One sense of a shared paradigm. The route matcher accepts a full deck
        // id, so קלטתי ("it clicked") weighs here while the signal and immigrant
        // senses of the same verb belong to Ivri and Inat.
        "character-verb-liklot--sense-1",
        // The domestic tranche that comes with practical-life vocabulary: the
        // verbs an apartment runs on. לישון stays unowned because Inbal already
        // holds sleep through להירדם and להתעורר.
        "advanced-verb-levashel",
        "advanced-verb-lenakot",
        "advanced-verb-lehadlik",
        "starter-verb-lekhabot",
        "advanced-verb-lesader",
        "advanced-verb-lehitkaleach",
        "starter-verb-lagur",
        "advanced-verb-letayel",
        "starter-verb-lashevet",
        "common-verb-lakum",
      ]),
    }),
  }),
  inbal: Object.freeze({
    id: "inbal",
    nameEn: "Inbal",
    nameHe: "ענבל",
    order: 2,
    dialogue: INBAL_DIALOGUE,
    route: Object.freeze({
      vocabCategories: Object.freeze([
        "religion_magic_spirituality",
        // Her existing shelf is over-indexed on Kabbalah and folk magic; this one
        // carries the lived half of the same brief — the calendar, kashrut,
        // services, lifecycle rites, denominations, and other faiths.
        "religious_life_practice",
        // Cast-wide by policy, not a topic claim — see CIVIL_DEFENSE_ABBR_IDS.
        "civil_defense_safety",
      ]),
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
        // Kashrut certification and a lifeguard's watch are the same word, so the
        // card sits on the unrouted core_advanced shelf and stays everyone's;
        // naming it here is what makes it weigh for her.
        "השגחה",
      ]),
      sentenceIdPrefixes: Object.freeze(["inbal_"]),
      abbrBuckets: Object.freeze(["People, Health & Culture"]),
      abbrIds: CIVIL_DEFENSE_ABBR_IDS,
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
        // Routed from the shared pool: birth, disappearance, appearance, sleep
        // and liturgy are hers by subject rather than by register. לשיר was
        // rejected for Ido as not streetwise; sung prayer makes it hers.
        "advanced-verb-lehealem",
        "advanced-verb-lehivaled",
        "advanced-verb-leheraot",
        "advanced-verb-leheradem",
        "advanced-verb-lehitorer",
        "common-verb-lashir",
        // Second shared-pool tranche, hers by subject: petition and prayer,
        // parting and mourning, inner feeling, ascent (עלייה לרגל, עליית נשמה),
        // hearing a sign, breaking (the Lurianic שבירת הכלים), ritual caution,
        // and return (חזרה בתשובה). לעלות is routed by sense, because its
        // second sense is "to cost".
        "common-verb-levakesh",
        "advanced-verb-lehipared",
        "common-verb-lehargish",
        "common-verb-laalot--sense-1",
        "common-verb-lishmoa",
        "advanced-verb-lehishaver",
        "advanced-verb-lehizaher",
        "common-verb-lachzor",
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
        // Bureaucracy is named in his blurb and was never routed. The two
        // science shelves follow the abbreviation split, which already gives
        // him the "Ideas, Science & Tech" bucket.
        "bureaucracy",
        "scientific_analytical",
        "science_research_expanded",
        // His three technology shelves were all abstract AI/startup/infosec
        // register with no card for anything a person touches. Ido keeps the
        // social and gesture layer in `media_digital_life_expanded`; the split is
        // that Ido uses the phone and Ivri administers the machine.
        "devices_os_apps",
        // Cast-wide by policy, not a topic claim — see CIVIL_DEFENSE_ABBR_IDS.
        "civil_defense_safety",
      ]),
      // Device words that already sit on Ido's shelves and are genuinely both
      // readings. Matched on `he`, never re-shelved: a card stays on its own
      // topic shelf and is reached from here. The gesture verbs — לגלול, להחליק,
      // להקיש — stay Ido's alone, because swiping is his register, not admin.
      vocabWords: Object.freeze([
        "הגדרות",
        "עדכון",
        "באג",
        "סוללה",
        "אחסון",
        // The conjugation deck files new verbs under core_advanced, which no
        // character owns, so a verb routed by id still needs its Translation
        // Match card named here.
        "להתמקד",
        "להשוות",
      ]),
      sentenceCategories: Object.freeze(["professional"]),
      abbrBuckets: Object.freeze(["Civics, Law & Work", "Ideas, Science & Tech"]),
      abbrIds: CIVIL_DEFENSE_ABBR_IDS,
      // His blurb used to claim military terminology, but nothing was routed and
      // the register now belongs to Idan. He keeps defense as an industry through
      // the technology shelves; the uniformed acronyms leave his buckets here.
      abbrExcludeIds: MILITARY_ABBR_IDS,
      verbIds: Object.freeze([
        "starter-verb-laavod",
        "starter-verb-letachnen",
        "advanced-verb-lenateach",
        "common-verb-liknot",
        "common-verb-limkor",
        "common-verb-lehachlit",
        "advanced-verb-leadken",
        "advanced-verb-leasher",
        "character-verb-lehagish",
        "character-verb-lehaklit",
        // Reception and input, not the colloquial "I got it" — see Ido's route.
        "character-verb-liklot--sense-2",
        // Routed from the shared pool: the process verbs a form, a contract, or
        // a deadline runs on. His by register rather than by topic.
        "advanced-verb-letaken",
        "advanced-verb-lehishtamesh",
        "advanced-verb-levatel",
        "advanced-verb-letzaref",
        "advanced-verb-levarer",
        "advanced-verb-lehaskim",
        "advanced-verb-lehaspik",
        "advanced-verb-lehavhir",
        "advanced-verb-lehazhir",
        "advanced-verb-lehachzir",
        "common-verb-leshalem",
        "common-verb-livdok",
        "advanced-verb-lehaalot--sense-2",
        "advanced-verb-lehorid--sense-2",
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
        // The process verbs above, continued: narrowing scope and weighing two
        // options are what a brief and a spec run on. להשוות is shared with
        // Inat, who compares texts and precedents rather than vendors.
        "advanced-verb-lehitmaked",
        "advanced-verb-lehashvot",
      ]),
    }),
  }),
  inat: Object.freeze({
    id: "inat",
    nameEn: "Inat",
    nameHe: "עינת",
    order: 4,
    dialogue: INAT_DIALOGUE,
    route: Object.freeze({
      vocabCategories: Object.freeze([
        "politics_society_expanded",
        "literature_arts_cultural_history",
        "legal_civic",
        "law_legal_systems_expanded",
        // The academic/analytical register is already hers through the `formal`
        // sentence bank; these are the shelves that register reads from.
        "abstract_philosophy",
        "philosophy_intellectual_expanded",
        "high_level_discourse_expanded",
        "abstract_concepts_expanded",
        // Cast-wide by policy, not a topic claim — see CIVIL_DEFENSE_ABBR_IDS.
        "civil_defense_safety",
      ]),
      // Withheld from the rest of the cast under their active lenses. Only the partisan
      // shelf is named: her literature, law, and philosophy shelves are
      // distinctive rather than sensitive, and fencing a topic shelf merely
      // because one character owns it would put 72% of the vocabulary deck out
      // of reach on any given day.
      vocabReserveCategories: Object.freeze(["politics_society_expanded"]),
      // Words on her lens that sit on someone else's shelf. תחרותי is a
      // work_business card Ivri also owns; ספורים is unrouted core_advanced and
      // is hers by register — it is journalistic rather than conversational.
      vocabWords: Object.freeze([
        "תחרותי",
        "ספורים",
        // Shared with Ivri, matching the verb route above.
        "להשוות",
        // Her lens on cards that sit on Ivri's shelves: he reads ירידה as a
        // quarter's revenue and הסמכה as a regulator's licence, she reads them
        // as a decline in turnout and as academic credentials. השכלה is on the
        // unrouted core_advanced shelf, so naming it here is what gives it an
        // owner at all.
        "ירידה",
        "הסמכה",
        "השכלה",
      ]),
      // The academic/analytical register is hers; Ivri keeps `professional`.
      sentenceCategories: Object.freeze(["formal"]),
      sentenceIdPrefixes: Object.freeze(["inat_"]),
      // A political tranche authored into the shared register banks before the
      // withholding layer existed, so occupation terminology and settler
      // violence were arriving as neutral filler in Ido's and Ivri's missions.
      // Naming a row here makes it hers *and* fences it: unlike a register
      // grant, a reserve id is a character-specific signal. The `formal_` rows
      // are already hers through the category and are listed so the fence is
      // stated rather than inferred.
      sentenceReserveIds: Object.freeze([
        "colloquial_140", "colloquial_141", "colloquial_142", "colloquial_143",
        "colloquial_144", "colloquial_147", "colloquial_148", "colloquial_149",
        "colloquial_150", "colloquial_151",
        "everyday_125", "everyday_126", "everyday_127", "everyday_128",
        "everyday_129", "everyday_130", "everyday_131", "everyday_135",
        "everyday_136",
        "professional_74", "professional_75", "professional_76", "professional_77",
        "professional_78", "professional_79", "professional_80", "professional_81",
        "professional_82", "professional_83", "professional_84",
        "formal_64", "formal_65", "formal_66", "formal_67", "formal_68",
        "formal_69", "formal_70", "formal_71", "formal_72", "formal_73",
        "formal_74", "formal_75", "formal_76", "formal_77", "formal_86", "formal_87",
      ]),
      // Shared with Ivri on purpose: the bucket mixes his corporate and
      // regulatory acronyms with her parties, courts, and rights bodies, and the
      // strategy doc sanctions multi-owner routing rather than an arbitrary cut.
      abbrBuckets: Object.freeze(["Civics, Law & Work"]),
      abbrIds: CIVIL_DEFENSE_ABBR_IDS,
      // She keeps policing — the doc gives her police brutality and occupation
      // vocabulary — but the uniformed military acronyms in this bucket are Idan's.
      abbrExcludeIds: MILITARY_ABBR_IDS,
      verbIds: Object.freeze([
        "character-verb-lefaresh",
        "character-verb-limchot",
        "advanced-verb-ladun",
        "advanced-verb-lehochiach",
        "advanced-verb-lehashpia",
        "starter-verb-leshacharer",
        "common-verb-lesaper",
        "advanced-verb-lelamed",
        // Shared with Ivri: he submits forms and tenders, she files complaints
        // and objections; he records a meeting, she records an oral history.
        "character-verb-lehagish",
        "character-verb-lehaklit",
        // קליטת עלייה as policy and history, not the colloquial sense.
        "character-verb-liklot--sense-3",
        // Only the criticism sense of לבקר; the visit sense stays unowned.
        "advanced-verb-levaker--sense-2",
        // Routed from the shared pool: reading, writing, memory, and argument.
        "starter-verb-lichtov",
        "common-verb-likro",
        "common-verb-lizkor",
        "common-verb-lishkoach",
        "advanced-verb-lehishtatef",
        "advanced-verb-leshanot",
        "common-verb-lishol",
        "common-verb-laanot",
        "advanced-verb-lehasbir",
        "common-verb-lehavin",
        // Shared with Ivri, the same way lehagish and lehaklit are: he compares
        // vendors and quarters, she compares texts, precedents, and readings.
        "advanced-verb-lehashvot",
      ]),
    }),
  }),
  idan: Object.freeze({
    id: "idan",
    nameEn: "Idan",
    nameHe: "עידן",
    order: 5,
    dialogue: IDAN_DIALOGUE,
    // Three shelves. `civil_defense_safety` is what a civilian needs and is
    // shared with the whole cast; `military_operational` and `emergency_response`
    // are his alone. The boost stays uniform across the owned subset, so each
    // mode's weak, missed, and overdue ordering still decides what he drills
    // inside it.
    route: Object.freeze({
      vocabCategories: Object.freeze([
        "civil_defense_safety",
        "military_operational",
        // Professional first-responder and police-procedure register. Inat keeps
        // the critical reading of policing — brutality, oversight, occupation —
        // and he gets the procedure, the same perspective split the Ivri/Inat
        // boundary section already uses for defense.
        "emergency_response",
      ]),
      // Security words that live on other shelves. Matched on `he`, never moved:
      // vocabulary ids embed a positional index. Several are cards the new
      // categories deliberately did not duplicate; the trailing group is the
      // trauma vocabulary that already sits on the unrouted `health` shelf, which
      // stays where it is rather than being re-shelved.
      vocabWords: Object.freeze([
        "אבטחה",
        "בטיחות",
        "אזהרה",
        "חזית",
        "ביטחון לאומי",
        "מחסום צבאי",
        "פיגוע",
        "הפסקת אש",
        "כיבוש",
        "חוק הגיוס",
        "פטור מגיוס",
        "שירות צבאי",
        "שירות מילואים",
        "דוקטרינת ביטחון",
        "מדד התרעה מוקדמת",
        "חירום",
        "תיקון חירום",
        "יירוט",
        "עזרה ראשונה",
        "אמבולנס",
        "הנחיות",
        "היערכות",
        "נוהל",
        "משמעת",
        // Trauma cards on the unrouted `health` shelf. The rest of that shelf is
        // chronic care, pharmacy, and diagnostics and stays unowned.
        "חובש",
        "חדר מיון",
        "תחבושת",
        "תפרים",
        "שבר",
        "נקע",
      ]),
      sentenceIdPrefixes: Object.freeze(["idan_"]),
      abbrIds: Object.freeze([
        ...CIVIL_DEFENSE_ABBR_IDS,
        ...MILITARY_ABBR_IDS,
        ...POLICE_COMMAND_ABBR_IDS,
      ]),
      // Withheld from the rest of the cast under their active lenses. His two own shelves
      // are named; `civil_defense_safety` deliberately is not, because a single
      // card carries no scenario and the everyday security tier is course policy.
      vocabReserveCategories: Object.freeze([
        "military_operational",
        "emergency_response",
      ]),
      // The hard-security and trauma subset of `vocabWords` above. The rest of
      // that list — אבטחה, בטיחות, אזהרה, הנחיות, נוהל, עזרה ראשונה, אמבולנס —
      // is ordinary vocabulary any resident needs and stays shared. Several of
      // these sit on shelves someone else owns, which is exactly why they need
      // naming: an explicit reserve beats a co-owner's grant.
      vocabReserveWords: Object.freeze([
        "פיגוע",
        "כיבוש",
        "מחסום צבאי",
        "הפסקת אש",
        "חוק הגיוס",
        "פטור מגיוס",
        "שירות צבאי",
        "שירות מילואים",
        "ביטחון לאומי",
        "חזית",
        "יירוט",
        // Trauma cards on the unrouted `health` shelf.
        "חובש",
        "חדר מיון",
        "תחבושת",
        "תפרים",
        "שבר",
        "נקע",
      ]),
      // The uniformed register only. `abbrExcludeIds` on Ivri and Inat already
      // keeps MILITARY_ABBR_IDS off their shelves; this is what additionally
      // keeps it out of Ido's and Inbal's draws, where it was arriving as
      // weight-1 filler because neither of them holds the buckets it sits in.
      //
      // POLICE_COMMAND_ABBR_IDS is deliberately *not* reserved. The strategy doc
      // splits policing by perspective rather than assigning it — Inat keeps the
      // critical reading — and המפכ״ל and מג״ב are civic institutions rather than
      // the military register. A reserve here would fence them from her.
      abbrReserveIds: Object.freeze([...MILITARY_ABBR_IDS]),
      // Only the violent paradigms. The rest of his verb route is shared-pool
      // register — לשמור, לבדוק, לחכות, להקשיב — which no character should be
      // denied, so `verbIds` never fences on its own.
      verbReserveIds: Object.freeze([
        "advanced-verb-laharog",
        "advanced-verb-lechasel",
        "advanced-verb-lefotzetz",
      ]),
      // Routed from the shared pool by register rather than by topic, the same
      // way Ido's nightlife verbs and Ivri's process verbs are: the verbs an
      // instruction, a warning, or a report runs on.
      verbIds: Object.freeze([
        "starter-verb-lishmor",
        "advanced-verb-lehizaher",
        "advanced-verb-lehazhir",
        "advanced-verb-lehatsil",
        "advanced-verb-lehafsik",
        "common-verb-lehikanes",
        "starter-verb-lisgor",
        "starter-verb-liftoach",
        "starter-verb-larutz",
        "starter-verb-laamod",
        "common-verb-lechakot",
        "advanced-verb-lehakshiv",
        "common-verb-lishmoa",
        "advanced-verb-lehargia",
        "advanced-verb-lehavhil",
        "advanced-verb-lehafchid",
        "starter-verb-lekhabot",
        "advanced-verb-lisrof",
        "common-verb-livdok",
        "advanced-verb-lechazek",
        "advanced-verb-lehitamen",
        "advanced-verb-litfos",
        "advanced-verb-lehaamid",
        "advanced-verb-limrot",
        "advanced-verb-lehitnaheg",
        "advanced-verb-laharog",
        "advanced-verb-lechasel",
        "advanced-verb-lefotzetz",
      ]),
    }),
  }),
});

// Ownership decides weight: an owned item is boosted so roughly
// TARGET_OWNED_SHARE of a draw lands in the active character's pool. It lives
// here rather than in app/character.js because scripts/character-content-report.js
// needs the same answer, and a second copy of this predicate drifts.
characterData.ownsItem = characterData.ownsItem || function ownsItem(route, kind, item) {
  if (!route || !item) return false;
  if (kind === "vocab") {
    // Matched on `he`, not `id`: vocabulary ids embed a positional index
    // (social_cultural-0NN-secular) that shifts when a row is inserted into the
    // same category, so id matching would silently rot.
    return route.vocabCategories?.includes(item.category) === true ||
      route.vocabWords?.includes(item.he) === true;
  }
  if (kind === "abbreviation") {
    // Buckets are too coarse to split the security acronyms out of Ivri's and
    // Inat's shelves, so an id list can grant one and an exclusion list can
    // withhold one. Exclusion is checked first: it has to beat a bucket grant,
    // which is the whole point of naming it.
    const abbrId = String(item.id || "");
    if (route.abbrExcludeIds?.includes(abbrId) === true) return false;
    return route.abbrIds?.includes(abbrId) === true ||
      route.abbrBuckets?.includes(item.bucket) === true;
  }
  if (kind === "verb") {
    const id = String(item.id || "");
    return route.verbIds?.some((verbId) => id === verbId || id.startsWith(`${verbId}--`)) === true;
  }
  if (kind === "sentence") {
    const id = String(item.id || "");
    return route.sentenceIdPrefixes?.some((prefix) => id.startsWith(prefix)) === true ||
      route.sentenceReserveIds?.includes(id) === true ||
      route.sentenceCategories?.includes(item.category) === true ||
      route.sentenceStyles?.includes(item.style) === true;
  }
  return false;
};

// The route fields that mark an item as belonging to one voice rather than to a
// register or a topic shelf. Only these fence. `sentenceCategories`,
// `sentenceStyles`, `vocabCategories`, `abbrBuckets` and `verbIds` deliberately
// do not: they carry register and grammar, which every character needs, and a
// blanket rule over them would leave each character with little more than its
// own bank.
const RESERVE_FIELDS = Object.freeze({
  sentence: Object.freeze(["sentenceReserveIds"]),
  vocab: Object.freeze(["vocabReserveCategories", "vocabReserveWords"]),
  abbreviation: Object.freeze(["abbrReserveIds"]),
  verb: Object.freeze(["verbReserveIds"]),
});

function reservesItem(route, kind, item) {
  if (!route || !item) return false;
  if (kind === "sentence") {
    return route.sentenceReserveIds?.includes(String(item.id || "")) === true;
  }
  if (kind === "vocab") {
    return route.vocabReserveCategories?.includes(item.category) === true ||
      route.vocabReserveWords?.includes(item.he) === true;
  }
  if (kind === "abbreviation") {
    return route.abbrReserveIds?.includes(String(item.id || "")) === true;
  }
  if (kind === "verb") {
    const id = String(item.id || "");
    return route.verbReserveIds?.some((verbId) => id === verbId || id.startsWith(`${verbId}--`)) === true;
  }
  return false;
}

// Which characters may be shown an item under an active character lens. `null`
// means everyone, which is the ordinary case — register, style, buckets, verbs,
// topic shelves and the cast-wide security tier are all shared.
//
// Precedence, mirroring the abbrExcludeIds convention that an explicit list is
// checked before a derived one:
//
//   1. SHARED_ITEM_IDS un-fences a named row outright.
//   2. An explicit `<kind>Reserve*` field is decisive — it beats a co-owner's
//      grant, which is how a strongly coded row sitting on someone else's shelf
//      gets fenced at all.
//   3. Otherwise a character-specific signal (today only sentence id prefixes)
//      fences to *every* character that owns the row by any signal. The union
//      rather than the prefix holder alone is what preserves the deliberate
//      multi-owner cases — Inbal's colloquial rows stay available to Ido.
characterData.getItemAudience = characterData.getItemAudience || function getItemAudience(kind, item) {
  if (!item) return null;
  if (characterData.SHARED_ITEM_IDS?.[kind]?.includes(String(item.id || "")) === true) return null;

  const entries = Object.values(characterData.characters);
  const reservers = entries
    .filter((entry) => reservesItem(entry.route, kind, item))
    .map((entry) => entry.id);
  if (reservers.length) return reservers;

  if (kind !== "sentence") return null;
  const id = String(item.id || "");
  const prefixed = entries.some(
    (entry) => entry.route?.sentenceIdPrefixes?.some((prefix) => id.startsWith(prefix)) === true,
  );
  if (!prefixed) return null;
  return entries
    .filter((entry) => characterData.ownsItem(entry.route, kind, item))
    .map((entry) => entry.id);
};

characterData.RESERVE_FIELDS = characterData.RESERVE_FIELDS || RESERVE_FIELDS;

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

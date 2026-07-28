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
        // Routed from the shared pool: birth, disappearance, appearance, sleep
        // and liturgy are hers by subject rather than by register. לשיר was
        // rejected for Ido as not streetwise; sung prayer makes it hers.
        "advanced-verb-lehealem",
        "advanced-verb-lehivaled",
        "advanced-verb-leheraot",
        "advanced-verb-leheradem",
        "advanced-verb-lehitorer",
        "common-verb-lashir",
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
      ]),
      // Words on her lens that sit on someone else's shelf. תחרותי is a
      // work_business card Ivri also owns; ספורים is unrouted core_advanced and
      // is hers by register — it is journalistic rather than conversational.
      vocabWords: Object.freeze([
        "תחרותי",
        "ספורים",
      ]),
      // The academic/analytical register is hers; Ivri keeps `professional`.
      sentenceCategories: Object.freeze(["formal"]),
      sentenceIdPrefixes: Object.freeze(["inat_"]),
      // Shared with Ivri on purpose: the bucket mixes his corporate and
      // regulatory acronyms with her parties, courts, and rights bodies, and the
      // strategy doc sanctions multi-owner routing rather than an arbitrary cut.
      abbrBuckets: Object.freeze(["Civics, Law & Work"]),
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

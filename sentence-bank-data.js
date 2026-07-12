(function initIvriQuestSentenceBank(global) {
"use strict";

// Degree adverbs the sentence builder accepts in either adjacent order.
// Add here when authoring sentences that rely on flexible modifier placement.
const HEBREW_FLEXIBLE_MODIFIER_TOKENS = ["די", "לגמרי", "ממש", "מאוד"];

function buildExpandedSentence({
  id,
  emoji,
  category,
  difficulty,
  hebrew,
  hebrewNiqqud,
  english,
  hebrewTokenPairs,
  englishTokens,
  hebrewDistractorPairs,
  englishDistractors,
  notes,
  hebrewAlternates = [],
  style = null,
}) {
  return {
    id,
    emoji,
    category,
    style,
    difficulty,
    hebrew,
    hebrew_niqqud: hebrewNiqqud,
    english,
    hebrew_tokens: hebrewTokenPairs.map(([plain]) => plain),
    hebrew_tokens_niqqud: hebrewTokenPairs.map(([, marked]) => marked),
    english_tokens: englishTokens,
    hebrew_distractors: hebrewDistractorPairs.map(([plain]) => plain),
    hebrew_distractors_niqqud: hebrewDistractorPairs.map(([, marked]) => marked),
    english_distractors: englishDistractors,
    hebrew_alternates: hebrewAlternates.map((alternate) => ({
      text: alternate.text,
      text_niqqud: alternate.textNiqqud,
      tokens: alternate.tokenPairs.map(([plain]) => plain),
      tokens_niqqud: alternate.tokenPairs.map(([, marked]) => marked),
    })),
    notes,
  };
}

const SENTENCE_BANK = [
  {
    "id": "colloquial_01",
    "emoji": "📵",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "מה נסגר איתך? לא שמעתי ממך כל היום.",
    "hebrew_niqqud": "מָה נִסְגַּר אִתְּךָ? לֹא שָׁמַעְתִּי מִמְּךָ כָּל הַיּוֹם.",
    "english": "What's going on with you? I haven't heard from you all day.",
    "hebrew_tokens": [
      "מה",
      "נסגר",
      "איתך",
      "לא",
      "שמעתי",
      "ממך",
      "כל",
      "היום"
    ],
    "hebrew_tokens_niqqud": [
      "מָה",
      "נִסְגַּר",
      "אִתְּךָ",
      "לֹא",
      "שָׁמַעְתִּי",
      "מִמְּךָ",
      "כָּל",
      "הַיּוֹם"
    ],
    "english_tokens": [
      "What's",
      "going on",
      "with you",
      "I haven't",
      "heard",
      "from you",
      "all",
      "day"
    ],
    "hebrew_distractors": [
      "נגמר",
      "אליך",
      "שמעת",
      "הלילה",
      "עליך"
    ],
    "hebrew_distractors_niqqud": [
      "נִגְמַר",
      "אֵלֶיךָ",
      "שָׁמַעְתָּ",
      "הַלַּיְלָה",
      "עָלֶיךָ"
    ],
    "english_distractors": [
      "the plan",
      "about him",
      "saw",
      "from him",
      "last night",
      "I just"
    ],
    "hebrew_alternates": [
      {
        "text": "מה נסגר איתך? כל היום לא שמעתי ממך.",
        "text_niqqud": "מָה נִסְגַּר אִתְּךָ? כָּל הַיּוֹם לֹא שָׁמַעְתִּי מִמְּךָ.",
        "tokens": [
          "מה",
          "נסגר",
          "איתך",
          "כל",
          "היום",
          "לא",
          "שמעתי",
          "ממך"
        ],
        "tokens_niqqud": [
          "מָה",
          "נִסְגַּר",
          "אִתְּךָ",
          "כָּל",
          "הַיּוֹם",
          "לֹא",
          "שָׁמַעְתִּי",
          "מִמְּךָ"
        ]
      }
    ],
    "notes": "נסגר is slang — literally 'closed' but means 'going on/happening' in colloquial speech."
  },
  {
    "id": "colloquial_02",
    "emoji": "😮‍💨",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "אין לי כוח לזה עכשיו, נדבר אחר כך.",
    "hebrew_niqqud": "אֵין לִי כּוֹחַ לְזֶה עַכְשָׁו, נְדַבֵּר אַחַר כָּךְ.",
    "english": "I don't have energy for this right now, we'll talk later.",
    "hebrew_tokens": [
      "אין",
      "לי",
      "כוח",
      "לזה",
      "עכשיו",
      "נדבר",
      "אחר",
      "כך"
    ],
    "hebrew_tokens_niqqud": [
      "אֵין",
      "לִי",
      "כּוֹחַ",
      "לְזֶה",
      "עַכְשָׁו",
      "נְדַבֵּר",
      "אַחַר",
      "כָּךְ"
    ],
    "english_tokens": [
      "I",
      "don't",
      "have",
      "energy",
      "for this",
      "right now",
      "we'll",
      "talk",
      "later"
    ],
    "hebrew_distractors": [
      "יש",
      "זמן",
      "מחר",
      "דיברנו",
      "בשביל"
    ],
    "hebrew_distractors_niqqud": [
      "יֵשׁ",
      "זְמַן",
      "מָחָר",
      "דִּבַּרְנוּ",
      "בִּשְׁבִיל"
    ],
    "english_distractors": [
      "more time",
      "tomorrow morning",
      "spoke",
      "never",
      "want"
    ],
    "hebrew_alternates": [
      {
        "text": "עכשיו אין לי כוח לזה, נדבר אחר כך.",
        "text_niqqud": "עַכְשָׁו אֵין לִי כּוֹחַ לָזֶה, נְדַבֵּר אַחַר כָּךְ.",
        "tokens": [
          "עכשיו",
          "אין",
          "לי",
          "כוח",
          "לזה",
          "נדבר",
          "אחר",
          "כך"
        ],
        "tokens_niqqud": [
          "עַכְשָׁו",
          "אֵין",
          "לִי",
          "כּוֹחַ",
          "לָזֶה",
          "נְדַבֵּר",
          "אַחַר",
          "כָּךְ"
        ]
      }
    ],
    "notes": "אין לי כוח is a very common colloquial phrase meaning 'I can't deal' or 'I have no energy for this.'"
  },
  {
    "id": "colloquial_03",
    "emoji": "🤯",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "זה היה ממש מטורף אתמול, לא האמנתי למה שקרה.",
    "hebrew_niqqud": "זֶה הָיָה מַמָּשׁ מְטֹרָף אֶתְמוֹל, לֹא הֶאֱמַנְתִּי לְמָה שֶׁקָּרָה.",
    "english": "That was totally crazy yesterday, I couldn't believe what happened.",
    "hebrew_tokens": [
      "זה",
      "היה",
      "ממש",
      "מטורף",
      "אתמול",
      "לא",
      "האמנתי",
      "למה",
      "שקרה"
    ],
    "hebrew_tokens_niqqud": [
      "זֶה",
      "הָיָה",
      "מַמָּשׁ",
      "מְטֹרָף",
      "אֶתְמוֹל",
      "לֹא",
      "הֶאֱמַנְתִּי",
      "לְמָה",
      "שֶׁקָּרָה"
    ],
    "english_tokens": [
      "That was",
      "totally crazy",
      "yesterday",
      "I couldn't believe",
      "what happened"
    ],
    "hebrew_distractors": [
      "קצת",
      "נורמלי",
      "היום",
      "ראיתי",
      "איפה"
    ],
    "hebrew_distractors_niqqud": [
      "קְצָת",
      "נוֹרְמָלִי",
      "הַיּוֹם",
      "רָאִיתִי",
      "אֵיפֹה"
    ],
    "english_distractors": [
      "It was",
      "completely normal",
      "this morning",
      "I totally saw",
      "what changed"
    ],
    "hebrew_alternates": [
      {
        "text": "אתמול זה היה ממש מטורף, לא האמנתי למה שקרה.",
        "text_niqqud": "אֶתְמוֹל זֶה הָיָה מַמָּשׁ מְטֹרָף, לֹא הֶאֱמַנְתִּי לְמָה שֶׁקָּרָה.",
        "tokens": [
          "אתמול",
          "זה",
          "היה",
          "ממש",
          "מטורף",
          "לא",
          "האמנתי",
          "למה",
          "שקרה"
        ],
        "tokens_niqqud": [
          "אֶתְמוֹל",
          "זֶה",
          "הָיָה",
          "מַמָּשׁ",
          "מְטֹרָף",
          "לֹא",
          "הֶאֱמַנְתִּי",
          "לְמָה",
          "שֶׁקָּרָה"
        ]
      }
    ],
    "notes": "מטורף literally means 'insane' but is used casually like 'crazy/wild' in English."
  },
  {
    "id": "colloquial_04",
    "emoji": "🏃",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "חכה שנייה, אני כבר בא למטה.",
    "hebrew_niqqud": "חַכֵּה שְׁנִיָּה, אֲנִי כְּבָר בָּא לְמַטָּה.",
    "english": "Wait a second, I'm coming downstairs right now.",
    "hebrew_tokens": [
      "חכה",
      "שנייה",
      "אני",
      "כבר",
      "בא",
      "למטה"
    ],
    "hebrew_tokens_niqqud": [
      "חַכֵּה",
      "שְׁנִיָּה",
      "אֲנִי",
      "כְּבָר",
      "בָּא",
      "לְמַטָּה"
    ],
    "english_tokens": [
      "Wait",
      "a",
      "second",
      "I'm",
      "coming",
      "downstairs",
      "right now"
    ],
    "hebrew_distractors": [
      "דקה",
      "עכשיו",
      "למעלה",
      "הולך",
      "פה",
      "באה"
    ],
    "hebrew_distractors_niqqud": [
      "דַּקָּה",
      "עַכְשָׁו",
      "לְמַעְלָה",
      "הוֹלֵךְ",
      "פֹּה",
      "בָּאָה"
    ],
    "english_distractors": [
      "one minute",
      "upstairs",
      "going",
      "right here",
      "leaving"
    ],
    "hebrew_alternates": [
      {
        "text": "חכה שנייה, אני כבר באה למטה.",
        "text_niqqud": "חַכֵּה שְׁנִיָּה, אֲנִי כְּבָר בָּאָה לְמַטָּה.",
        "tokens": [
          "חכה",
          "שנייה",
          "אני",
          "כבר",
          "באה",
          "למטה"
        ],
        "tokens_niqqud": [
          "חַכֵּה",
          "שְׁנִיָּה",
          "אֲנִי",
          "כְּבָר",
          "בָּאָה",
          "לְמַטָּה"
        ]
      }
    ],
    "notes": "כבר בא adds urgency — 'already coming' implies 'on my way right now.'"
  },
  {
    "id": "colloquial_05",
    "emoji": "🙄",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "הוא סתם מדבר שטויות, אל תיקח אותו ברצינות.",
    "hebrew_niqqud": "הוּא סְתָם מְדַבֵּר שְׁטוּיוֹת, אַל תִּקַּח אוֹתוֹ בִּרְצִינוּת.",
    "english": "He's just talking nonsense, don't take him seriously.",
    "hebrew_tokens": [
      "הוא",
      "סתם",
      "מדבר",
      "שטויות",
      "אל",
      "תיקח",
      "אותו",
      "ברצינות"
    ],
    "hebrew_tokens_niqqud": [
      "הוּא",
      "סְתָם",
      "מְדַבֵּר",
      "שְׁטוּיוֹת",
      "אַל",
      "תִּקַּח",
      "אוֹתוֹ",
      "בִּרְצִינוּת"
    ],
    "english_tokens": [
      "He's",
      "just",
      "talking",
      "nonsense",
      "don't",
      "take",
      "him",
      "seriously"
    ],
    "hebrew_distractors": [
      "היא",
      "מדברת",
      "אמת",
      "אותה",
      "תשמע"
    ],
    "hebrew_distractors_niqqud": [
      "הִיא",
      "מְדַבֶּרֶת",
      "אֱמֶת",
      "אוֹתָהּ",
      "תִּשְׁמַע"
    ],
    "english_distractors": [
      "She's",
      "truth",
      "saying",
      "listen",
      "to",
      "her",
      "always"
    ],
    "notes": "Third person gender swap (הוא/היא, מדבר/מדברת, אותו/אותה) is a good distractor set here."
  },
  {
    "id": "colloquial_06",
    "emoji": "🍦",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "בא לי משהו מתוק, אולי נלך לקנות גלידה.",
    "hebrew_niqqud": "בָּא לִי מַשֶּׁהוּ מָתוֹק, אוּלַי נֵלֵךְ לִקְנוֹת גְּלִידָה.",
    "english": "I feel like something sweet, maybe we should go get ice cream.",
    "hebrew_tokens": [
      "בא",
      "לי",
      "משהו",
      "מתוק",
      "אולי",
      "נלך",
      "לקנות",
      "גלידה"
    ],
    "hebrew_tokens_niqqud": [
      "בָּא",
      "לִי",
      "מַשֶּׁהוּ",
      "מָתוֹק",
      "אוּלַי",
      "נֵלֵךְ",
      "לִקְנוֹת",
      "גְּלִידָה"
    ],
    "english_tokens": [
      "I feel like",
      "something sweet",
      "maybe we should",
      "go get",
      "ice cream"
    ],
    "hebrew_distractors": [
      "מלוח",
      "לאכול",
      "בטוח",
      "שוקולד",
      "רוצה"
    ],
    "hebrew_distractors_niqqud": [
      "מָלוּחַ",
      "לֶאֱכֹל",
      "בָּטוּחַ",
      "שׁוֹקוֹלָד",
      "רוֹצֶה"
    ],
    "english_distractors": [
      "I want",
      "something salty",
      "definitely we should",
      "stay and eat",
      "chocolate cake"
    ],
    "notes": "בא לי is a uniquely Israeli expression — literally 'comes to me' but means 'I feel like / I'm craving.'"
  },
  {
    "id": "colloquial_07",
    "emoji": "🤨",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "אתה רציני עכשיו? זה נשמע לי הזוי לגמרי.",
    "hebrew_niqqud": "אַתָּה רְצִינִי עַכְשָׁו? זֶה נִשְׁמָע לִי הָזוּי לְגַמְרֵי.",
    "english": "Are you serious right now? That sounds completely ridiculous to me.",
    "hebrew_tokens": [
      "אתה",
      "רציני",
      "עכשיו",
      "זה",
      "נשמע",
      "לי",
      "הזוי",
      "לגמרי"
    ],
    "hebrew_tokens_niqqud": [
      "אַתָּה",
      "רְצִינִי",
      "עַכְשָׁו",
      "זֶה",
      "נִשְׁמָע",
      "לִי",
      "הָזוּי",
      "לְגַמְרֵי"
    ],
    "english_tokens": [
      "Are you",
      "serious",
      "right now",
      "That sounds",
      "completely ridiculous",
      "to me"
    ],
    "hebrew_distractors": [
      "נראה",
      "קצת",
      "נורא",
      "באמת",
      "לך"
    ],
    "hebrew_distractors_niqqud": [
      "נִרְאֶה",
      "קְצָת",
      "נוֹרָא",
      "בֶּאֱמֶת",
      "לְךָ"
    ],
    "english_distractors": [
      "You look",
      "slightly weird",
      "totally normal",
      "really serious",
      "for me"
    ],
    "notes": "הזוי literally means 'hallucinatory/delusional' — used colloquially to mean 'ridiculous/unbelievable.'"
  },
  {
    "id": "colloquial_08",
    "emoji": "🙅",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "לא זורם לי הרעיון הזה, בוא נחשוב על משהו אחר.",
    "hebrew_niqqud": "לֹא זוֹרֵם לִי הָרַעֲיוֹן הַזֶּה, בּוֹא נַחֲשֹׁב עַל מַשֶּׁהוּ אַחֵר.",
    "english": "I'm not into that idea, let's think of something else.",
    "hebrew_tokens": [
      "לא",
      "זורם",
      "לי",
      "הרעיון",
      "הזה",
      "בוא",
      "נחשוב",
      "על",
      "משהו",
      "אחר"
    ],
    "hebrew_tokens_niqqud": [
      "לֹא",
      "זוֹרֵם",
      "לִי",
      "הָרַעֲיוֹן",
      "הַזֶּה",
      "בּוֹא",
      "נַחֲשֹׁב",
      "עַל",
      "מַשֶּׁהוּ",
      "אַחֵר"
    ],
    "english_tokens": [
      "I'm not",
      "into",
      "that idea",
      "let's think",
      "of",
      "something",
      "else"
    ],
    "hebrew_distractors": [
      "מתאים",
      "הזאת",
      "נעשה",
      "טוב",
      "רוצה"
    ],
    "hebrew_distractors_niqqud": [
      "מַתְאִים",
      "הַזֹּאת",
      "נַעֲשֶׂה",
      "טוֹב",
      "רוֹצֶה"
    ],
    "english_distractors": [
      "that plan",
      "let's do",
      "the same",
      "I'd love",
      "anything"
    ],
    "notes": "זורם לי literally 'flows for me' — slang for 'I'm into it / it vibes with me.'"
  },
  {
    "id": "colloquial_09",
    "emoji": "😒",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "היא עשתה לי קטע מסריח, אני לא סומך עליה יותר.",
    "hebrew_niqqud": "הִיא עָשְׂתָה לִי קֶטַע מַסְרִיחַ, אֲנִי לֹא סוֹמֵךְ עָלֶיהָ יוֹתֵר.",
    "english": "She did something shady to me, I don't trust her anymore.",
    "hebrew_tokens": [
      "היא",
      "עשתה",
      "לי",
      "קטע",
      "מסריח",
      "אני",
      "לא",
      "סומך",
      "עליה",
      "יותר"
    ],
    "hebrew_tokens_niqqud": [
      "הִיא",
      "עָשְׂתָה",
      "לִי",
      "קֶטַע",
      "מַסְרִיחַ",
      "אֲנִי",
      "לֹא",
      "סוֹמֵךְ",
      "עָלֶיהָ",
      "יוֹתֵר"
    ],
    "english_tokens": [
      "She",
      "did",
      "something",
      "shady",
      "to me",
      "I",
      "don't",
      "trust",
      "her",
      "anymore"
    ],
    "hebrew_distractors": [
      "הוא",
      "עשה",
      "עליו",
      "סומכת",
      "טוב"
    ],
    "hebrew_distractors_niqqud": [
      "הוּא",
      "עֲשֵׂה",
      "עָלָיו",
      "סוֹמֶכֶת",
      "טוֹב"
    ],
    "english_distractors": [
      "He",
      "made",
      "nice",
      "for me",
      "him"
    ],
    "hebrew_alternates": [
      {
        "text": "היא עשתה לי קטע מסריח, אני לא סומכת עליה יותר.",
        "text_niqqud": "הִיא עָשְׂתָה לִי קֶטַע מַסְרִיחַ, אֲנִי לֹא סוֹמֶכֶת עָלֶיהָ יוֹתֵר.",
        "tokens": [
          "היא",
          "עשתה",
          "לי",
          "קטע",
          "מסריח",
          "אני",
          "לא",
          "סומכת",
          "עליה",
          "יותר"
        ],
        "tokens_niqqud": [
          "הִיא",
          "עָשְׂתָה",
          "לִי",
          "קֶטַע",
          "מַסְרִיחַ",
          "אֲנִי",
          "לֹא",
          "סוֹמֶכֶת",
          "עָלֶיהָ",
          "יוֹתֵר"
        ]
      }
    ],
    "notes": "קטע מסריח literally 'a stinky bit/segment' — heavy slang meaning 'a shady/messed up move.' Third-person gender distractors work well here."
  },
  {
    "id": "colloquial_10",
    "emoji": "⏰",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "יאללה, בוא נזוז, נהיה מאוחר.",
    "hebrew_niqqud": "יַאלְלָה, בּוֹא נָזוּז, נִהְיֶה מְאֻחָר.",
    "english": "Come on, let's go, it's getting late.",
    "hebrew_tokens": [
      "יאללה",
      "בוא",
      "נזוז",
      "נהיה",
      "מאוחר"
    ],
    "hebrew_tokens_niqqud": [
      "יַאלְלָה",
      "בּוֹא",
      "נָזוּז",
      "נִהְיֶה",
      "מְאֻחָר"
    ],
    "english_tokens": [
      "Come on",
      "let's go",
      "it's getting late"
    ],
    "hebrew_distractors": [
      "נלך",
      "מוקדם",
      "עכשיו",
      "כבר",
      "לאן"
    ],
    "hebrew_distractors_niqqud": [
      "נֵלֵךְ",
      "מֻקְדָּם",
      "עַכְשָׁו",
      "כְּבָר",
      "לְאָן"
    ],
    "english_distractors": [
      "Hang on",
      "let's stay",
      "it's still early"
    ],
    "notes": "יאללה is borrowed from Arabic — one of the most common Israeli slang words, meaning 'come on/let's go.'"
  },
  {
    "id": "colloquial_11",
    "emoji": "🔑",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "איפה שמתי את המפתחות שלי? אני לא מוצא אותם.",
    "hebrew_niqqud": "אֵיפֹה שַׂמְתִּי אֶת הַמַּפְתְּחוֹת שֶׁלִּי? אֲנִי לֹא מוֹצֵא אוֹתָם.",
    "english": "Where did I put my keys? I can't find them.",
    "hebrew_tokens": [
      "איפה",
      "שמתי",
      "את",
      "המפתחות",
      "שלי",
      "אני",
      "לא",
      "מוצא",
      "אותם"
    ],
    "hebrew_tokens_niqqud": [
      "אֵיפֹה",
      "שַׂמְתִּי",
      "אֶת",
      "הַמַּפְתְּחוֹת",
      "שֶׁלִּי",
      "אֲנִי",
      "לֹא",
      "מוֹצֵא",
      "אוֹתָם"
    ],
    "english_tokens": [
      "Where",
      "did I put",
      "my keys",
      "I can't",
      "find",
      "them"
    ],
    "hebrew_distractors": [
      "מתי",
      "הארנק",
      "שלך",
      "אותן",
      "רואה",
      "מוצאת"
    ],
    "hebrew_distractors_niqqud": [
      "מָתַי",
      "הָאַרְנָק",
      "שֶׁלְּךָ",
      "אוֹתָן",
      "רוֹאֶה",
      "מוֹצֵאת"
    ],
    "english_distractors": [
      "When",
      "did I lose",
      "my wallet",
      "see",
      "it"
    ],
    "hebrew_alternates": [
      {
        "text": "איפה שמתי את המפתחות שלי? אני לא מוצאת אותם.",
        "text_niqqud": "אֵיפֹה שַׂמְתִּי אֶת הַמַּפְתְּחוֹת שֶׁלִּי? אֲנִי לֹא מוֹצֵאת אוֹתָם.",
        "tokens": [
          "איפה",
          "שמתי",
          "את",
          "המפתחות",
          "שלי",
          "אני",
          "לא",
          "מוצאת",
          "אותם"
        ],
        "tokens_niqqud": [
          "אֵיפֹה",
          "שַׂמְתִּי",
          "אֶת",
          "הַמַּפְתְּחוֹת",
          "שֶׁלִּי",
          "אֲנִי",
          "לֹא",
          "מוֹצֵאת",
          "אוֹתָם"
        ]
      }
    ],
    "notes": "אותם vs אותן tests masculine vs feminine pronoun for 'them' — מפתחות is masculine plural."
  },
  {
    "id": "colloquial_12",
    "emoji": "🪟",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "אפשר לפתוח את החלון? חם כאן מאוד.",
    "hebrew_niqqud": "אֶפְשָׁר לִפְתֹּחַ אֶת הַחַלּוֹן? חַם כָּאן מְאוֹד.",
    "english": "Can you open the window? It's very hot here.",
    "hebrew_tokens": [
      "אפשר",
      "לפתוח",
      "את",
      "החלון",
      "חם",
      "כאן",
      "מאוד"
    ],
    "hebrew_tokens_niqqud": [
      "אֶפְשָׁר",
      "לִפְתֹּחַ",
      "אֶת",
      "הַחַלּוֹן",
      "חַם",
      "כָּאן",
      "מְאוֹד"
    ],
    "english_tokens": [
      "Can you open",
      "the window",
      "It's very hot",
      "here"
    ],
    "hebrew_distractors": [
      "לסגור",
      "הדלת",
      "קר",
      "שם",
      "בחוץ"
    ],
    "hebrew_distractors_niqqud": [
      "לִסְגֹּר",
      "הַדֶּלֶת",
      "קַר",
      "שֵׁם",
      "בַּחוּץ"
    ],
    "english_distractors": [
      "Can you close",
      "the door",
      "It's very cold",
      "outside"
    ],
    "notes": "Semantic opposites make strong distractors: לפתוח/לסגור (open/close), חם/קר (hot/cold)."
  },
  {
    "id": "colloquial_13",
    "emoji": "😮",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "וואלה, לא ידעתי שזה ככה. תודה שאמרת לי.",
    "hebrew_niqqud": "וָואלָה, לֹא יָדַעְתִּי שֶׁזֶּה כָּכָה. תּוֹדָה שֶׁאָמַרְתְּ לִי.",
    "english": "Wow, I had no idea it was like that. Thanks for telling me.",
    "hebrew_tokens": [
      "וואלה",
      "לא",
      "ידעתי",
      "שזה",
      "ככה",
      "תודה",
      "שאמרת",
      "לי"
    ],
    "hebrew_tokens_niqqud": [
      "וָואלָה",
      "לֹא",
      "יָדַעְתִּי",
      "שֶׁזֶּה",
      "כָּכָה",
      "תּוֹדָה",
      "שֶׁאָמַרְתְּ",
      "לִי"
    ],
    "english_tokens": [
      "Wow",
      "I",
      "had no idea",
      "it was",
      "like that",
      "Thanks",
      "for telling",
      "me"
    ],
    "hebrew_distractors": [
      "באמת",
      "חשבתי",
      "אחרת",
      "סליחה",
      "ששמעת"
    ],
    "hebrew_distractors_niqqud": [
      "בֶּאֱמֶת",
      "חָשַׁבְתִּי",
      "אַחֶרֶת",
      "סְלִיחָה",
      "שֶׁשָּׁמַעְתָּ"
    ],
    "english_distractors": [
      "Really",
      "we",
      "always thought",
      "it seemed",
      "different",
      "Sorry",
      "for hearing",
      "it"
    ],
    "notes": "וואלה (walla) is borrowed from Arabic — expresses surprise, like 'wow/really?!'"
  },
  {
    "id": "colloquial_14",
    "emoji": "👌",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "הוא בסדר גמור, אחי, אל תגזים בכלל.",
    "hebrew_niqqud": "הוּא בְּסֵדֶר גָּמוּר, אָחִי, אַל תַּגְזִים בִּכְלָל.",
    "english": "He's totally fine, bro, don't exaggerate.",
    "hebrew_tokens": [
      "הוא",
      "בסדר",
      "גמור",
      "אחי",
      "אל",
      "תגזים",
      "בכלל"
    ],
    "hebrew_tokens_niqqud": [
      "הוּא",
      "בְּסֵדֶר",
      "גָּמוּר",
      "אָחִי",
      "אַל",
      "תַּגְזִים",
      "בִּכְלָל"
    ],
    "english_tokens": [
      "He's",
      "totally",
      "fine",
      "bro",
      "don't",
      "exaggerate"
    ],
    "hebrew_distractors": [
      "היא",
      "לא",
      "תדאג",
      "חבר",
      "קצת"
    ],
    "hebrew_distractors_niqqud": [
      "הִיא",
      "לֹא",
      "תִּדְאַג",
      "חָבֵר",
      "קְצָת"
    ],
    "english_distractors": [
      "She's",
      "kind of",
      "worried",
      "friend",
      "worry"
    ],
    "notes": "אחי literally 'my brother' — used like 'bro/dude' in casual speech. Third-person הוא/היא distractor applies."
  },
  {
    "id": "colloquial_15",
    "emoji": "🎉",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "פצצה! לא ציפיתי לזה בכלל, כל הכבוד.",
    "hebrew_niqqud": "פְּצָצָה! לֹא צִפִּיתִי לָזֶה בִּכְלָל, כָּל הַכָּבוֹד.",
    "english": "Amazing! I didn't expect that at all, well done.",
    "hebrew_tokens": [
      "פצצה",
      "לא",
      "ציפיתי",
      "לזה",
      "בכלל",
      "כל",
      "הכבוד"
    ],
    "hebrew_tokens_niqqud": [
      "פְּצָצָה",
      "לֹא",
      "צִפִּיתִי",
      "לָזֶה",
      "בִּכְלָל",
      "כָּל",
      "הַכָּבוֹד"
    ],
    "english_tokens": [
      "Amazing",
      "I",
      "didn't",
      "expect",
      "that",
      "at all",
      "well",
      "done"
    ],
    "hebrew_distractors": [
      "יופי",
      "רציתי",
      "ממש",
      "חבל",
      "תודה"
    ],
    "hebrew_distractors_niqqud": [
      "יֹפִי",
      "רָצִיתִי",
      "מַמָּשׁ",
      "חֲבָל",
      "תּוֹדָה"
    ],
    "english_distractors": [
      "great",
      "wanted",
      "for real",
      "shame",
      "thanks"
    ],
    "notes": "פצצה literally 'bomb' — slang for 'amazing/incredible.' כל הכבוד literally 'all the honor' means 'well done.'"
  },
  {
    "id": "colloquial_16",
    "emoji": "🤷",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "נו, אתה בא איתנו או לא? תחליט כבר.",
    "hebrew_niqqud": "נוּ, אַתָּה בָּא אִתָּנוּ אוֹ לֹא? תַּחְלִיט כְּבָר.",
    "english": "Well, are you coming with us or not? Make up your mind already.",
    "hebrew_tokens": [
      "נו",
      "אתה",
      "בא",
      "איתנו",
      "או",
      "לא",
      "תחליט",
      "כבר"
    ],
    "hebrew_tokens_niqqud": [
      "נוּ",
      "אַתָּה",
      "בָּא",
      "אִתָּנוּ",
      "אוֹ",
      "לֹא",
      "תַּחְלִיט",
      "כְּבָר"
    ],
    "english_tokens": [
      "Well",
      "are you",
      "coming",
      "with us",
      "or not",
      "Make up your mind",
      "already"
    ],
    "hebrew_distractors": [
      "הולך",
      "אליהם",
      "אולי",
      "תגיד",
      "עכשיו",
      "את",
      "באה",
      "תחליטי"
    ],
    "hebrew_distractors_niqqud": [
      "הוֹלֵךְ",
      "אֲלֵיהֶם",
      "אוּלַי",
      "תַּגִּיד",
      "עַכְשָׁו",
      "אֶת",
      "בָּאָה",
      "תַּחְלִיטִי"
    ],
    "english_distractors": [
      "are they",
      "without us",
      "going home",
      "Take your time",
      "right now"
    ],
    "hebrew_alternates": [
      {
        "text": "נו, את באה איתנו או לא? תחליטי כבר.",
        "text_niqqud": "נוּ, אַתְּ בָּאָה אִתָּנוּ אוֹ לֹא? תַּחְלִיטִי כְּבָר.",
        "tokens": [
          "נו",
          "את",
          "באה",
          "איתנו",
          "או",
          "לא",
          "תחליטי",
          "כבר"
        ],
        "tokens_niqqud": [
          "נוּ",
          "אַתְּ",
          "בָּאָה",
          "אִתָּנוּ",
          "אוֹ",
          "לֹא",
          "תַּחְלִיטִי",
          "כְּבָר"
        ]
      }
    ],
    "notes": "נו is borrowed from Yiddish — an impatient 'well?/so?/come on!' Very common in spoken Hebrew. תחליט כבר adds impatience: 'decide already.'"
  },
  {
    "id": "colloquial_17",
    "emoji": "😟",
    "category": "colloquial",
    "style": "whatsapp",
    "difficulty": 1,
    "hebrew": "נו?? מה קורה, אתה בסדר? ענה לי.",
    "hebrew_niqqud": "נוּ?? מָה קוֹרֶה, אַתָּה בְּסֵדֶר? עָנָה לִי.",
    "english": "Well?? What's going on, are you ok? Answer me.",
    "hebrew_tokens": [
      "נו",
      "מה",
      "קורה",
      "אתה",
      "בסדר",
      "ענה",
      "לי"
    ],
    "hebrew_tokens_niqqud": [
      "נוּ",
      "מָה",
      "קוֹרֶה",
      "אַתָּה",
      "בְּסֵדֶר",
      "עָנָה",
      "לִי"
    ],
    "english_tokens": [
      "Well",
      "What's going on",
      "are you ok",
      "Answer me"
    ],
    "hebrew_distractors": [
      "איפה",
      "טוב",
      "תגיד",
      "שלום",
      "כן"
    ],
    "hebrew_distractors_niqqud": [
      "אֵיפֹה",
      "טוֹב",
      "תַּגִּיד",
      "שָׁלוֹם",
      "כֵּן"
    ],
    "english_distractors": [
      "Hello",
      "Where are you",
      "are you sure",
      "Tell me"
    ],
    "notes": "Typical WhatsApp urgency — short, punchy, with נו for impatience and imperative ענה."
  },
  {
    "id": "colloquial_18",
    "emoji": "🗓️",
    "category": "colloquial",
    "style": "whatsapp",
    "difficulty": 1,
    "hebrew": "סבבה, מחר ב-8, אל תאחר.",
    "hebrew_niqqud": "סַבַּבָּה, מָחָר בְּ-8, אַל תְּאַחֵר.",
    "english": "Cool, tomorrow at 8, don't be late.",
    "hebrew_tokens": [
      "סבבה",
      "מחר",
      "ב-8",
      "אל",
      "תאחר"
    ],
    "hebrew_tokens_niqqud": [
      "סַבַּבָּה",
      "מָחָר",
      "בִּ-8",
      "אַל",
      "תְּאַחֵר"
    ],
    "english_tokens": [
      "Cool",
      "tomorrow at 8",
      "don't be late"
    ],
    "hebrew_distractors": [
      "בסדר",
      "היום",
      "ב-9",
      "תבוא",
      "מוקדם"
    ],
    "hebrew_distractors_niqqud": [
      "בְּסֵדֶר",
      "הַיּוֹם",
      "בְּ-9",
      "תָּבוֹא",
      "מֻקְדָּם"
    ],
    "english_distractors": [
      "Okay",
      "today at 9",
      "come early"
    ],
    "notes": "סבבה is slang from Arabic — means 'cool/alright/no problem.'"
  },
  {
    "id": "colloquial_19",
    "emoji": "📩",
    "category": "colloquial",
    "style": "whatsapp",
    "difficulty": 1,
    "hebrew": "וואלה, ראיתי את זה. מגניב. שלח לי את הפרטים.",
    "hebrew_niqqud": "וָואלָה, רָאִיתִי אֶת זֶה. מַגְנִיב. שְׁלַח לִי אֶת הַפְּרָטִים.",
    "english": "Wow, I saw it. Cool. Send me the details.",
    "hebrew_tokens": [
      "וואלה",
      "ראיתי",
      "את",
      "זה",
      "מגניב",
      "שלח",
      "לי",
      "הפרטים"
    ],
    "hebrew_tokens_niqqud": [
      "וָואלָה",
      "רָאִיתִי",
      "אֶת",
      "זֶה",
      "מַגְנִיב",
      "שְׁלַח",
      "לִי",
      "הַפְּרָטִים"
    ],
    "english_tokens": [
      "Wow",
      "I saw",
      "it",
      "Cool",
      "Send",
      "me",
      "the details"
    ],
    "hebrew_distractors": [
      "שמעתי",
      "יפה",
      "תראה",
      "המידע",
      "בבקשה"
    ],
    "hebrew_distractors_niqqud": [
      "שָׁמַעְתִּי",
      "יָפֶה",
      "תִּרְאֶה",
      "הַמֵּידָע",
      "בְּבַקָּשָׁה"
    ],
    "english_distractors": [
      "Really",
      "I heard",
      "this",
      "Nice",
      "Show",
      "the info"
    ],
    "notes": "מגניב literally 'cooling' — slang for 'cool/awesome.'"
  },
  {
    "id": "colloquial_20",
    "emoji": "✋",
    "category": "colloquial",
    "style": "whatsapp",
    "difficulty": 1,
    "hebrew": "אחי חכה, אני עונה לך בעוד שנייה.",
    "hebrew_niqqud": "אָחִי חַכֵּה, אֲנִי עוֹנֶה לְךָ בְּעוֹד שְׁנִיָּה.",
    "english": "Bro hold on, I'll get back to you in a sec.",
    "hebrew_tokens": [
      "אחי",
      "חכה",
      "אני",
      "עונה",
      "לך",
      "בעוד",
      "שנייה"
    ],
    "hebrew_tokens_niqqud": [
      "אָחִי",
      "חַכֵּה",
      "אֲנִי",
      "עוֹנֶה",
      "לְךָ",
      "בְּעוֹד",
      "שְׁנִיָּה"
    ],
    "english_tokens": [
      "Bro",
      "hold on",
      "I'll get back",
      "to you",
      "in a sec"
    ],
    "hebrew_distractors": [
      "חבר",
      "רגע",
      "כותב",
      "עכשיו",
      "דקה"
    ],
    "hebrew_distractors_niqqud": [
      "חָבֵר",
      "רֶגַע",
      "כּוֹתֵב",
      "עַכְשָׁו",
      "דַּקָּה"
    ],
    "english_distractors": [
      "my friend",
      "wait up",
      "I'm writing",
      "right now",
      "in a minute"
    ],
    "notes": "עונה here means 'answering/responding' — בעוד שנייה means 'in another second.'"
  },
  {
    "id": "everyday_01",
    "emoji": "🛒",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אני צריך לקנות חלב ולחם, אין כלום בבית.",
    "hebrew_niqqud": "אֲנִי צָרִיךְ לִקְנוֹת חָלָב וְלֶחֶם, אֵין כְּלוּם בַּבַּיִת.",
    "english": "I need to buy milk and bread, there's nothing at home.",
    "hebrew_tokens": [
      "אני",
      "צריך",
      "לקנות",
      "חלב",
      "ולחם",
      "אין",
      "כלום",
      "בבית"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "צָרִיךְ",
      "לִקְנוֹת",
      "חָלָב",
      "וְלֶחֶם",
      "אֵין",
      "כְּלוּם",
      "בַּבַּיִת"
    ],
    "english_tokens": [
      "I",
      "need",
      "to buy",
      "milk",
      "and bread",
      "there's",
      "nothing",
      "at home"
    ],
    "hebrew_distractors": [
      "למכור",
      "וביצים",
      "הכל",
      "בחנות",
      "רוצה",
      "צריכה"
    ],
    "hebrew_distractors_niqqud": [
      "לִמְכֹּר",
      "וּבֵיצִים",
      "הַכֹּל",
      "בַּחֲנוּת",
      "רוֹצֶה",
      "צְרִיכָה"
    ],
    "english_distractors": [
      "to sell",
      "eggs",
      "and cheese",
      "everything",
      "at the store"
    ],
    "hebrew_alternates": [
      {
        "text": "אני צריכה לקנות חלב ולחם, אין כלום בבית.",
        "text_niqqud": "אֲנִי צְרִיכָה לִקְנוֹת חָלָב וְלֶחֶם, אֵין כְּלוּם בַּבַּיִת.",
        "tokens": [
          "אני",
          "צריכה",
          "לקנות",
          "חלב",
          "ולחם",
          "אין",
          "כלום",
          "בבית"
        ],
        "tokens_niqqud": [
          "אֲנִי",
          "צְרִיכָה",
          "לִקְנוֹת",
          "חָלָב",
          "וְלֶחֶם",
          "אֵין",
          "כְּלוּם",
          "בַּבַּיִת"
        ]
      }
    ],
    "notes": "Basic shopping vocabulary. ולחם combines the conjunction ו (and) with לחם (bread) — common Hebrew pattern."
  },
  {
    "id": "everyday_02",
    "emoji": "🍽️",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "באיזה שעה אתה חוזר הביתה? אני רוצה לתכנן ארוחת ערב.",
    "hebrew_niqqud": "בְּאֵיזֶה שָׁעָה אַתָּה חוֹזֵר הַבַּיְתָה? אֲנִי רוֹצָה לְתַכְנֵן אֲרוּחַת עֶרֶב.",
    "english": "What time are you coming home? I want to plan dinner.",
    "hebrew_tokens": [
      "באיזה",
      "שעה",
      "אתה",
      "חוזר",
      "הביתה",
      "אני",
      "רוצה",
      "לתכנן",
      "ארוחת ערב"
    ],
    "hebrew_tokens_niqqud": [
      "בְּאֵיזֶה",
      "שָׁעָה",
      "אַתָּה",
      "חוֹזֵר",
      "הַבַּיְתָה",
      "אֲנִי",
      "רוֹצָה",
      "לְתַכְנֵן",
      "אֲרוּחַת עֶרֶב"
    ],
    "english_tokens": [
      "What",
      "time",
      "are you",
      "coming",
      "home",
      "I",
      "want",
      "to plan",
      "dinner"
    ],
    "hebrew_distractors": [
      "יוצא",
      "לעבודה",
      "צריך",
      "ארוחת צהריים",
      "ארוחת בוקר",
      "את",
      "חוזרת"
    ],
    "hebrew_distractors_niqqud": [
      "יוֹצֵא",
      "לָעֲבוֹדָה",
      "צָרִיךְ",
      "אֲרוּחַת צָהֳרַיִם",
      "אֲרוּחַת בֹּקֶר",
      "אֶת",
      "חוֹזֶרֶת"
    ],
    "english_distractors": [
      "day",
      "leaving",
      "work",
      "I need",
      "to make",
      "lunch"
    ],
    "hebrew_alternates": [
      {
        "text": "באיזה שעה את חוזרת הביתה? אני רוצה לתכנן ארוחת ערב.",
        "text_niqqud": "בְּאֵיזֶה שָׁעָה אַתְּ חוֹזֶרֶת הַבַּיְתָה? אֲנִי רוֹצָה לְתַכְנֵן אֲרוּחַת עֶרֶב.",
        "tokens": [
          "באיזה",
          "שעה",
          "את",
          "חוזרת",
          "הביתה",
          "אני",
          "רוצה",
          "לתכנן",
          "ארוחת ערב"
        ],
        "tokens_niqqud": [
          "בְּאֵיזֶה",
          "שָׁעָה",
          "אַתְּ",
          "חוֹזֶרֶת",
          "הַבַּיְתָה",
          "אֲנִי",
          "רוֹצָה",
          "לְתַכְנֵן",
          "אֲרוּחַת עֶרֶב"
        ]
      }
    ],
    "notes": "ארוחת ערב (evening meal) contrasts cleanly with ארוחת צהריים (lunch) and ארוחת בוקר (breakfast)."
  },
  {
    "id": "everyday_03",
    "emoji": "🪫",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "שכחתי להטעין את הטלפון, הוא עומד להיכבות.",
    "hebrew_niqqud": "שָׁכַחְתִּי לְהַטְעִין אֶת הַטֵּלֵפוֹן, הוּא עוֹמֵד לְהִכָּבוֹת.",
    "english": "I forgot to charge my phone, it's about to die.",
    "hebrew_tokens": [
      "שכחתי",
      "להטעין",
      "את",
      "הטלפון",
      "הוא",
      "עומד",
      "להיכבות"
    ],
    "hebrew_tokens_niqqud": [
      "שָׁכַחְתִּי",
      "לְהַטְעִין",
      "אֶת",
      "הַטֵּלֵפוֹן",
      "הוּא",
      "עוֹמֵד",
      "לְהִכָּבוֹת"
    ],
    "english_tokens": [
      "I forgot",
      "to charge",
      "my phone",
      "it's",
      "about to",
      "die"
    ],
    "hebrew_distractors": [
      "זכרתי",
      "לכבות",
      "המחשב",
      "כבר",
      "נדלק"
    ],
    "hebrew_distractors_niqqud": [
      "זָכַרְתִּי",
      "לְכַבּוֹת",
      "הַמַּחְשֵׁב",
      "כְּבָר",
      "נִדְלַק"
    ],
    "english_distractors": [
      "I remembered",
      "to turn off",
      "my computer",
      "it",
      "already",
      "died"
    ],
    "notes": "עומד להיכבות literally 'stands to be extinguished' — about to turn off/die. להטעין (to charge) vs לכבות (to turn off) is a good pair."
  },
  {
    "id": "everyday_04",
    "emoji": "🖊️",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "יש לך עט שאני יכול להשתמש בו? אני צריך לכתוב משהו.",
    "hebrew_niqqud": "יֵשׁ לְךָ עֵט שֶׁאֲנִי יָכוֹל לְהִשְׁתַּמֵּשׁ בּוֹ? אֲנִי צָרִיךְ לִכְתֹּב מַשֶּׁהוּ.",
    "english": "Do you have a pen I can use? I need to write something.",
    "hebrew_tokens": [
      "יש",
      "לך",
      "עט",
      "שאני",
      "יכול",
      "להשתמש",
      "בו",
      "אני",
      "צריך",
      "לכתוב",
      "משהו"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לְךָ",
      "עֵט",
      "שֶׁאֲנִי",
      "יָכוֹל",
      "לְהִשְׁתַּמֵּשׁ",
      "בּוֹ",
      "אֲנִי",
      "צָרִיךְ",
      "לִכְתֹּב",
      "מַשֶּׁהוּ"
    ],
    "english_tokens": [
      "Do you have",
      "a pen",
      "I can",
      "use",
      "I need",
      "to write",
      "something"
    ],
    "hebrew_distractors": [
      "עיפרון",
      "לקרוא",
      "בה",
      "רוצה",
      "אין",
      "יכולה",
      "צריכה"
    ],
    "hebrew_distractors_niqqud": [
      "עִפָּרוֹן",
      "לִקְרֹא",
      "בָּהּ",
      "רוֹצֶה",
      "אֵין",
      "יְכוֹלָה",
      "צְרִיכָה"
    ],
    "english_distractors": [
      "a pencil",
      "borrow",
      "I want",
      "to read",
      "anything"
    ],
    "hebrew_alternates": [
      {
        "text": "יש לך עט שאני יכולה להשתמש בו? אני צריכה לכתוב משהו.",
        "text_niqqud": "יֵשׁ לְךָ עֵט שֶׁאֲנִי יְכוֹלָה לְהִשְׁתַּמֵּשׁ בּוֹ? אֲנִי צְרִיכָה לִכְתֹּב מַשֶּׁהוּ.",
        "tokens": [
          "יש",
          "לך",
          "עט",
          "שאני",
          "יכולה",
          "להשתמש",
          "בו",
          "אני",
          "צריכה",
          "לכתוב",
          "משהו"
        ],
        "tokens_niqqud": [
          "יֵשׁ",
          "לְךָ",
          "עֵט",
          "שֶׁאֲנִי",
          "יְכוֹלָה",
          "לְהִשְׁתַּמֵּשׁ",
          "בּוֹ",
          "אֲנִי",
          "צְרִיכָה",
          "לִכְתֹּב",
          "מַשֶּׁהוּ"
        ]
      }
    ],
    "notes": "בו (in it, masc.) vs בה (in it, fem.) — עט is masculine so בו is correct."
  },
  {
    "id": "everyday_05",
    "emoji": "🚉",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אנחנו נפגשים ליד התחנה, אל תאחר.",
    "hebrew_niqqud": "אֲנַחְנוּ נִפְגָּשִׁים לְיַד הַתַּחֲנָה, אַל תְּאַחֵר.",
    "english": "We're meeting near the station, don't be late.",
    "hebrew_tokens": [
      "אנחנו",
      "נפגשים",
      "ליד",
      "התחנה",
      "אל",
      "תאחר"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנַחְנוּ",
      "נִפְגָּשִׁים",
      "לְיַד",
      "הַתַּחֲנָה",
      "אַל",
      "תְּאַחֵר"
    ],
    "english_tokens": [
      "We're",
      "meeting",
      "near",
      "the station",
      "don't",
      "be late"
    ],
    "hebrew_distractors": [
      "מול",
      "הקניון",
      "תבוא",
      "מוקדם",
      "בתוך"
    ],
    "hebrew_distractors_niqqud": [
      "מוּל",
      "הַקַּנְיוֹן",
      "תָּבוֹא",
      "מֻקְדָּם",
      "בְּתוֹךְ"
    ],
    "english_distractors": [
      "across",
      "the mall",
      "leaving",
      "come early",
      "inside"
    ],
    "notes": "ליד (near/next to) vs מול (across from) vs בתוך (inside) — spatial preposition distractors."
  },
  {
    "id": "everyday_06",
    "emoji": "⏱️",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אני מאחר בכמה דקות, כבר יוצא לדרך.",
    "hebrew_niqqud": "אֲנִי מְאַחֵר בְּכַמָּה דַּקּוֹת, כְּבָר יוֹצֵא לַדֶּרֶךְ.",
    "english": "I'm running a few minutes late, I'm already on my way.",
    "hebrew_tokens": [
      "אני",
      "מאחר",
      "בכמה",
      "דקות",
      "כבר",
      "יוצא",
      "לדרך"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "מְאַחֵר",
      "בְּכַמָּה",
      "דַּקּוֹת",
      "כְּבָר",
      "יוֹצֵא",
      "לַדֶּרֶךְ"
    ],
    "english_tokens": [
      "I'm running",
      "a few minutes late",
      "I'm already",
      "on my way"
    ],
    "hebrew_distractors": [
      "שעות",
      "מגיע",
      "עוד",
      "מוקדם",
      "חוזר"
    ],
    "hebrew_distractors_niqqud": [
      "שָׁעוֹת",
      "מַגִּיעַ",
      "עוֹד",
      "מֻקְדָּם",
      "חוֹזֵר"
    ],
    "english_distractors": [
      "I'm arriving",
      "a few hours early",
      "I'm still",
      "at home"
    ],
    "notes": "כבר יוצא לדרך adds urgency — the speaker is already on the way. יוצא לדרך literally 'going out to the road' — means 'heading out/on my way.'"
  },
  {
    "id": "everyday_07",
    "emoji": "📧",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "תזכיר לי לשלוח את המייל, אני תמיד שוכח.",
    "hebrew_niqqud": "תַּזְכִּיר לִי לִשְׁלֹחַ אֶת הֲמֵיְל, אֲנִי תָּמִיד שׁוֹכֵחַ.",
    "english": "Remind me to send the email, I always forget.",
    "hebrew_tokens": [
      "תזכיר",
      "לי",
      "לשלוח",
      "את",
      "המייל",
      "אני",
      "תמיד",
      "שוכח"
    ],
    "hebrew_tokens_niqqud": [
      "תַּזְכִּיר",
      "לִי",
      "לִשְׁלֹחַ",
      "אֶת",
      "הֲמֵיְל",
      "אֲנִי",
      "תָּמִיד",
      "שׁוֹכֵחַ"
    ],
    "english_tokens": [
      "Remind",
      "me",
      "to send",
      "the email",
      "I",
      "always",
      "forget"
    ],
    "hebrew_distractors": [
      "תגיד",
      "לקרוא",
      "ההודעה",
      "לפעמים",
      "זוכר"
    ],
    "hebrew_distractors_niqqud": [
      "תַּגִּיד",
      "לִקְרֹא",
      "הַהוֹדָעָה",
      "לִפְעָמִים",
      "זוֹכֵר"
    ],
    "english_distractors": [
      "Tell",
      "her",
      "to read",
      "the message",
      "he",
      "sometimes",
      "remembers"
    ],
    "notes": "תזכיר (remind) vs זוכר (remember) — common confusion for learners."
  },
  {
    "id": "everyday_08",
    "emoji": "🗺️",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "זה קרוב מכאן או רחוק? אני לא מכיר את האזור.",
    "hebrew_niqqud": "זֶה קָרוֹב מִכָּאן אוֹ רָחוֹק? אֲנִי לֹא מַכִּיר אֶת הָאֵזוֹר.",
    "english": "Is it near here or far from here? I don't know the area.",
    "hebrew_tokens": [
      "זה",
      "קרוב",
      "מכאן",
      "או",
      "רחוק",
      "אני",
      "לא",
      "מכיר",
      "את",
      "האזור"
    ],
    "hebrew_tokens_niqqud": [
      "זֶה",
      "קָרוֹב",
      "מִכָּאן",
      "אוֹ",
      "רָחוֹק",
      "אֲנִי",
      "לֹא",
      "מַכִּיר",
      "אֶת",
      "הָאֵזוֹר"
    ],
    "english_tokens": [
      "Is",
      "it",
      "near",
      "here",
      "or",
      "far",
      "from here",
      "I",
      "don't",
      "know",
      "the area"
    ],
    "hebrew_distractors": [
      "משם",
      "גדול",
      "מבין",
      "העיר",
      "קטן"
    ],
    "hebrew_distractors_niqqud": [
      "מִשָּׁם",
      "גָּדוֹל",
      "מִבֵּין",
      "הָעִיר",
      "קָטָן"
    ],
    "english_distractors": [
      "from there",
      "very big",
      "understand",
      "the city",
      "too small"
    ],
    "hebrew_alternates": [
      {
        "text": "זה קרוב או רחוק מכאן? אני לא מכיר את האזור.",
        "text_niqqud": "זֶה קָרוֹב אוֹ רָחוֹק מִכָּאן? אֲנִי לֹא מַכִּיר אֶת הָאֵזוֹר.",
        "tokens": [
          "זה",
          "קרוב",
          "או",
          "רחוק",
          "מכאן",
          "אני",
          "לא",
          "מכיר",
          "את",
          "האזור"
        ],
        "tokens_niqqud": [
          "זֶה",
          "קָרוֹב",
          "אוֹ",
          "רָחוֹק",
          "מִכָּאן",
          "אֲנִי",
          "לֹא",
          "מַכִּיר",
          "אֶת",
          "הָאֵזוֹר"
        ]
      }
    ],
    "notes": "מכאן literally means 'from here'; in natural English this often comes out as 'near here' or 'far from here.' קרוב/רחוק (close/far) are basic but essential spatial adjectives. The order קרוב או רחוק מכאן is also accepted."
  },
  {
    "id": "everyday_09",
    "emoji": "🧾",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אפשר לקבל את החשבון, בבקשה?",
    "hebrew_niqqud": "אֶפְשָׁר לְקַבֵּל אֶת הַחֶשְׁבּוֹן, בְּבַקָּשָׁה?",
    "english": "Can I get the bill, please?",
    "hebrew_tokens": [
      "אפשר",
      "לקבל",
      "את",
      "החשבון",
      "בבקשה"
    ],
    "hebrew_tokens_niqqud": [
      "אֶפְשָׁר",
      "לְקַבֵּל",
      "אֶת",
      "הַחֶשְׁבּוֹן",
      "בְּבַקָּשָׁה"
    ],
    "english_tokens": [
      "Can I get",
      "the bill",
      "please"
    ],
    "hebrew_distractors": [
      "לשלם",
      "התפריט",
      "תודה",
      "לראות",
      "הקבלה"
    ],
    "hebrew_distractors_niqqud": [
      "לְשַׁלֵּם",
      "הַתַּפְרִיט",
      "תּוֹדָה",
      "לִרְאוֹת",
      "הַקַּבָּלָה"
    ],
    "english_distractors": [
      "Can I pay",
      "the menu",
      "thank you",
      "Can I see",
      "the receipt"
    ],
    "notes": "Essential restaurant vocabulary. החשבון (the bill) vs התפריט (the menu) vs הקבלה (the receipt)."
  },
  {
    "id": "everyday_10",
    "emoji": "🍲",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "מה אתה רוצה לאכול הערב? אני לא יודע מה לבשל.",
    "hebrew_niqqud": "מָה אַתָּה רוֹצֶה לֶאֱכֹל הָעֶרֶב? אֲנִי לֹא יוֹדֵעַ מָה לְבַשֵּׁל.",
    "english": "What do you want to eat tonight? I don't know what to cook.",
    "hebrew_tokens": [
      "מה",
      "אתה",
      "רוצה",
      "לאכול",
      "הערב",
      "אני",
      "לא",
      "יודע",
      "מה",
      "לבשל"
    ],
    "hebrew_tokens_niqqud": [
      "מָה",
      "אַתָּה",
      "רוֹצֶה",
      "לֶאֱכֹל",
      "הָעֶרֶב",
      "אֲנִי",
      "לֹא",
      "יוֹדֵעַ",
      "מָה",
      "לְבַשֵּׁל"
    ],
    "english_tokens": [
      "What",
      "do you",
      "want",
      "to eat",
      "tonight",
      "I",
      "don't",
      "know",
      "what",
      "to cook"
    ],
    "hebrew_distractors": [
      "לשתות",
      "הבוקר",
      "יכול",
      "להזמין",
      "אוהב",
      "יודעת"
    ],
    "hebrew_distractors_niqqud": [
      "לִשְׁתּוֹת",
      "הַבֹּקֶר",
      "יָכוֹל",
      "לְהַזְמִין",
      "אוֹהֵב",
      "יוֹדַעַת"
    ],
    "english_distractors": [
      "When",
      "does he",
      "prefer",
      "to drink",
      "this morning",
      "I'm",
      "not",
      "sure",
      "which",
      "to order"
    ],
    "hebrew_alternates": [
      {
        "text": "מה אתה רוצה לאכול הערב? אני לא יודעת מה לבשל.",
        "text_niqqud": "מָה אַתָּה רוֹצֶה לֶאֱכֹל הָעֶרֶב? אֲנִי לֹא יוֹדַעַת מָה לְבַשֵּׁל.",
        "tokens": [
          "מה",
          "אתה",
          "רוצה",
          "לאכול",
          "הערב",
          "אני",
          "לא",
          "יודעת",
          "מה",
          "לבשל"
        ],
        "tokens_niqqud": [
          "מָה",
          "אַתָּה",
          "רוֹצֶה",
          "לֶאֱכֹל",
          "הָעֶרֶב",
          "אֲנִי",
          "לֹא",
          "יוֹדַעַת",
          "מָה",
          "לְבַשֵּׁל"
        ]
      }
    ],
    "notes": "לאכול (to eat) vs לבשל (to cook) vs להזמין (to order) — food-related verb distractors."
  },
  {
    "id": "everyday_11",
    "emoji": "🍕",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "הזמנו פיצה, היא אמורה להגיע בעוד עשרים דקות.",
    "hebrew_niqqud": "הִזְמַנּוּ פִּיצָה, הִיא אֲמוּרָה לְהַגִּיעַ בְּעוֹד עֶשְׂרִים דַּקּוֹת.",
    "english": "We ordered pizza, it should arrive in about twenty minutes.",
    "hebrew_tokens": [
      "הזמנו",
      "פיצה",
      "היא",
      "אמורה",
      "להגיע",
      "בעוד",
      "עשרים",
      "דקות"
    ],
    "hebrew_tokens_niqqud": [
      "הִזְמַנּוּ",
      "פִּיצָה",
      "הִיא",
      "אֲמוּרָה",
      "לְהַגִּיעַ",
      "בְּעוֹד",
      "עֶשְׂרִים",
      "דַּקּוֹת"
    ],
    "english_tokens": [
      "We ordered",
      "pizza",
      "it",
      "should",
      "arrive",
      "in about",
      "twenty",
      "minutes"
    ],
    "hebrew_distractors": [
      "בישלנו",
      "סושי",
      "אמור",
      "לצאת",
      "עשר"
    ],
    "hebrew_distractors_niqqud": [
      "בִּשַּׁלְנוּ",
      "סוּשִׁי",
      "אֱמֹר",
      "לָצֵאת",
      "עָשָׂר"
    ],
    "english_distractors": [
      "They cooked",
      "sushi",
      "she",
      "might",
      "leave",
      "after about",
      "ten",
      "hours"
    ],
    "notes": "אמורה (feminine, agreeing with פיצה) vs אמור (masculine) — third-person gender agreement."
  },
  {
    "id": "everyday_12",
    "emoji": "🚌",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "כמה זמן לוקח להגיע לשם באוטובוס?",
    "hebrew_niqqud": "כַּמָּה זְמַן לוֹקֵחַ לְהַגִּיעַ לְשָׁם בָּאוֹטוֹבּוּס?",
    "english": "How long does it take to get there by bus?",
    "hebrew_tokens": [
      "כמה",
      "זמן",
      "לוקח",
      "להגיע",
      "לשם",
      "באוטובוס"
    ],
    "hebrew_tokens_niqqud": [
      "כַּמָּה",
      "זְמַן",
      "לוֹקֵחַ",
      "לְהַגִּיעַ",
      "לְשָׁם",
      "בָּאוֹטוֹבּוּס"
    ],
    "english_tokens": [
      "How long",
      "does it take",
      "to get there",
      "by bus"
    ],
    "hebrew_distractors": [
      "לכאן",
      "ברכבת",
      "עולה",
      "רחוק",
      "במכונית"
    ],
    "hebrew_distractors_niqqud": [
      "לְכָאן",
      "בָּרַכֶּבֶת",
      "עוֹלֶה",
      "רָחוֹק",
      "בַּמְּכוֹנִית"
    ],
    "english_distractors": [
      "How far",
      "does it cost",
      "to come here",
      "by train",
      "by car"
    ],
    "notes": "Transportation distractors: באוטובוס (by bus) vs ברכבת (by train) vs במכונית (by car)."
  },
  {
    "id": "everyday_13",
    "emoji": "🅿️",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אין חניה פה, בוא נחפש קצת יותר רחוק.",
    "hebrew_niqqud": "אֵין חֲנָיָה פֹּה, בּוֹא נְחַפֵּשׂ קְצָת יוֹתֵר רָחוֹק.",
    "english": "There's no parking here, let's look a bit further away.",
    "hebrew_tokens": [
      "אין",
      "חניה",
      "פה",
      "בוא",
      "נחפש",
      "קצת",
      "יותר",
      "רחוק"
    ],
    "hebrew_tokens_niqqud": [
      "אֵין",
      "חֲנָיָה",
      "פֹּה",
      "בּוֹא",
      "נְחַפֵּשׂ",
      "קְצָת",
      "יוֹתֵר",
      "רָחוֹק"
    ],
    "english_tokens": [
      "There's no",
      "parking",
      "here",
      "let's",
      "look",
      "a bit",
      "further",
      "away"
    ],
    "hebrew_distractors": [
      "יש",
      "מקום",
      "שם",
      "נלך",
      "קרוב"
    ],
    "hebrew_distractors_niqqud": [
      "יֵשׁ",
      "מָקוֹם",
      "שֵׁם",
      "נֵלֵךְ",
      "קָרוֹב"
    ],
    "english_distractors": [
      "There's lots",
      "space",
      "there",
      "walk",
      "closer"
    ],
    "notes": "אין (there isn't) vs יש (there is) — fundamental pair. קרוב/רחוק (close/far) also tested."
  },
  {
    "id": "everyday_14",
    "emoji": "🚕",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "הרכבת מתעכבת, כדאי לקחת מונית.",
    "hebrew_niqqud": "הָרַכֶּבֶת מִתְעַכֶּבֶת, כְּדַאי לָקַחַת מוֹנִית.",
    "english": "The train is delayed, we should take a taxi.",
    "hebrew_tokens": [
      "הרכבת",
      "מתעכבת",
      "כדאי",
      "לקחת",
      "מונית"
    ],
    "hebrew_tokens_niqqud": [
      "הָרַכֶּבֶת",
      "מִתְעַכֶּבֶת",
      "כְּדַאי",
      "לָקַחַת",
      "מוֹנִית"
    ],
    "english_tokens": [
      "The train",
      "is delayed",
      "we should",
      "take a taxi"
    ],
    "hebrew_distractors": [
      "האוטובוס",
      "מגיעה",
      "אפשר",
      "לחכות",
      "אוטובוס"
    ],
    "hebrew_distractors_niqqud": [
      "הָאוֹטוֹבּוּס",
      "מַגִּיעָה",
      "אֶפְשָׁר",
      "לְחַכּוֹת",
      "אוֹטוֹבּוּס"
    ],
    "english_distractors": [
      "The bus",
      "is arriving",
      "we could",
      "wait outside",
      "take a walk"
    ],
    "notes": "מתעכבת (delayed, fem.) agrees with רכבת (train, fem.). כדאי means 'it's worthwhile/advisable.'"
  },
  {
    "id": "everyday_15",
    "emoji": "🧺",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "הכביסה מוכנה, אפשר להוציא אותה מהמייבש?",
    "hebrew_niqqud": "הַכְּבִיסָה מוּכָנָה, אֶפְשָׁר לְהוֹצִיא אוֹתָהּ מֵהַמְּיַבֵּשׁ?",
    "english": "The laundry is done, can you take it out of the dryer?",
    "hebrew_tokens": [
      "הכביסה",
      "מוכנה",
      "אפשר",
      "להוציא",
      "אותה",
      "מהמייבש"
    ],
    "hebrew_tokens_niqqud": [
      "הַכְּבִיסָה",
      "מוּכָנָה",
      "אֶפְשָׁר",
      "לְהוֹצִיא",
      "אוֹתָהּ",
      "מֵהַמְּיַבֵּשׁ"
    ],
    "english_tokens": [
      "The laundry",
      "is done",
      "can",
      "you",
      "take",
      "it",
      "out of the dryer"
    ],
    "hebrew_distractors": [
      "מוכן",
      "להכניס",
      "אותו",
      "מהמכונה",
      "לקפל"
    ],
    "hebrew_distractors_niqqud": [
      "מוּכָן",
      "לְהַכְנִיס",
      "אוֹתוֹ",
      "מֵהַמְּכוֹנָה",
      "לְקַפֵּל"
    ],
    "english_distractors": [
      "all set",
      "put in",
      "him",
      "washing machine",
      "fold"
    ],
    "notes": "מוכנה (fem.) agrees with כביסה (laundry, fem.). להוציא (take out) vs להכניס (put in)."
  },
  {
    "id": "everyday_16",
    "emoji": "📺",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "מישהו ראה את השלט של הטלוויזיה?",
    "hebrew_niqqud": "מִישֶׁהוּ רָאָה אֶת הַשַּׁלָּט שֶׁל הַטֵּלֵוִיזְיָה?",
    "english": "Has anyone seen the TV remote?",
    "hebrew_tokens": [
      "מישהו",
      "ראה",
      "את",
      "השלט",
      "של",
      "הטלוויזיה"
    ],
    "hebrew_tokens_niqqud": [
      "מִישֶׁהוּ",
      "רָאָה",
      "אֶת",
      "הַשַּׁלָּט",
      "שֶׁל",
      "הַטֵּלֵוִיזְיָה"
    ],
    "english_tokens": [
      "Has anyone",
      "seen",
      "the TV remote"
    ],
    "hebrew_distractors": [
      "משהו",
      "לקח",
      "המפתחות",
      "הטלפון",
      "שמע"
    ],
    "hebrew_distractors_niqqud": [
      "מַשֶּׁהוּ",
      "לֶקַח",
      "הַמַּפְתְּחוֹת",
      "הַטֵּלֵפוֹן",
      "שְׁמַע"
    ],
    "english_distractors": [
      "someone else",
      "took",
      "the keys",
      "phone charger",
      "heard"
    ],
    "notes": "מישהו (someone/anyone) vs משהו (something) — classic beginner confusion."
  },
  {
    "id": "everyday_17",
    "emoji": "🧼",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "נגמר הסבון, צריך לקנות.",
    "hebrew_niqqud": "נִגְמַר הַסַּבּוֹן, צָרִיךְ לִקְנוֹת.",
    "english": "The soap ran out, we need to buy more.",
    "hebrew_tokens": [
      "נגמר",
      "הסבון",
      "צריך",
      "לקנות"
    ],
    "hebrew_tokens_niqqud": [
      "נִגְמַר",
      "הַסַּבּוֹן",
      "צָרִיךְ",
      "לִקְנוֹת"
    ],
    "english_tokens": [
      "The soap",
      "ran out",
      "we need",
      "to buy",
      "more"
    ],
    "hebrew_distractors": [
      "נשאר",
      "השמפו",
      "רוצה",
      "להביא",
      "יש"
    ],
    "hebrew_distractors_niqqud": [
      "נִשְׁאַר",
      "הַשַּׁמְפּוּ",
      "רוֹצֶה",
      "לְהָבִיא",
      "יֵשׁ"
    ],
    "english_distractors": [
      "hair gel",
      "shampoo bottle",
      "we want",
      "to bring",
      "there's more"
    ],
    "notes": "נגמר (ran out/finished) vs נשאר (remained/left) — opposite pair."
  },
  {
    "id": "everyday_18",
    "emoji": "⏳",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "הייתי בתור חצי שעה ועדיין לא הגיע תורי.",
    "hebrew_niqqud": "הָיִיתִי בְּתוֹר חֲצִי שָׁעָה וַעֲדַיִן לֹא הִגִּיעַ תּוֹרִי.",
    "english": "I've been in line for half an hour and it's still not my turn.",
    "hebrew_tokens": [
      "הייתי",
      "בתור",
      "חצי",
      "שעה",
      "ועדיין",
      "לא",
      "הגיע",
      "תורי"
    ],
    "hebrew_tokens_niqqud": [
      "הָיִיתִי",
      "בְּתוֹר",
      "חֲצִי",
      "שָׁעָה",
      "וַעֲדַיִן",
      "לֹא",
      "הִגִּיעַ",
      "תּוֹרִי"
    ],
    "english_tokens": [
      "I've",
      "been in line",
      "for half an hour",
      "and it's",
      "still",
      "not",
      "my turn"
    ],
    "hebrew_distractors": [
      "רבע",
      "דקה",
      "כבר",
      "עברתי",
      "תורך"
    ],
    "hebrew_distractors_niqqud": [
      "רֶבַע",
      "דַּקָּה",
      "כְּבָר",
      "עָבַרְתִּי",
      "תּוֹרְךָ"
    ],
    "english_distractors": [
      "a quarter",
      "ten minutes",
      "already done",
      "passed by",
      "your turn"
    ],
    "hebrew_alternates": [
      {
        "text": "הייתי חצי שעה בתור ועדיין לא הגיע תורי.",
        "text_niqqud": "הָיִיתִי חֲצִי שָׁעָה בַּתּוֹר וַעֲדַיִן לֹא הִגִּיעַ תּוֹרִי.",
        "tokens": [
          "הייתי",
          "חצי",
          "שעה",
          "בתור",
          "ועדיין",
          "לא",
          "הגיע",
          "תורי"
        ],
        "tokens_niqqud": [
          "הָיִיתִי",
          "חֲצִי",
          "שָׁעָה",
          "בַּתּוֹר",
          "וַעֲדַיִן",
          "לֹא",
          "הִגִּיעַ",
          "תּוֹרִי"
        ]
      }
    ],
    "notes": "תורי (my turn) — the possessive suffix is attached directly. תורך (your turn) is a good distractor."
  },
  {
    "id": "everyday_19",
    "emoji": "🔉",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "תוריד לי את הקול קצת, אני בטלפון.",
    "hebrew_niqqud": "תּוֹרִיד לִי אֶת הַקּוֹל קְצָת, אֲנִי בַּטֵּלֵפוֹן.",
    "english": "Turn it down a bit, I'm on the phone.",
    "hebrew_tokens": [
      "תוריד",
      "לי",
      "את",
      "הקול",
      "קצת",
      "אני",
      "בטלפון"
    ],
    "hebrew_tokens_niqqud": [
      "תּוֹרִיד",
      "לִי",
      "אֶת",
      "הַקּוֹל",
      "קְצָת",
      "אֲנִי",
      "בַּטֵּלֵפוֹן"
    ],
    "english_tokens": [
      "Turn",
      "it",
      "down",
      "a bit",
      "I'm",
      "on the phone"
    ],
    "hebrew_distractors": [
      "תעלה",
      "המוזיקה",
      "הרבה",
      "במחשב",
      "תכבה"
    ],
    "hebrew_distractors_niqqud": [
      "תַּעֲלֶה",
      "הַמּוּזִיקָה",
      "הַרְבֵּה",
      "בַּמַּחְשֵׁב",
      "תִּכְבֶּה"
    ],
    "english_distractors": [
      "up",
      "a lot",
      "at the computer",
      "the music",
      "for now"
    ],
    "notes": "תוריד (turn down/lower) vs תעלה (turn up/raise) — directional verb pair."
  },
  {
    "id": "everyday_20",
    "emoji": "💬",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אם אני לא עונה, תשאיר הודעה.",
    "hebrew_niqqud": "אִם אֲנִי לֹא עוֹנֶה, תַּשְׁאִיר הוֹדָעָה.",
    "english": "If I don't answer, leave a message.",
    "hebrew_tokens": [
      "אם",
      "אני",
      "לא",
      "עונה",
      "תשאיר",
      "הודעה"
    ],
    "hebrew_tokens_niqqud": [
      "אִם",
      "אֲנִי",
      "לֹא",
      "עוֹנֶה",
      "תַּשְׁאִיר",
      "הוֹדָעָה"
    ],
    "english_tokens": [
      "If",
      "I don't",
      "answer",
      "leave",
      "a message"
    ],
    "hebrew_distractors": [
      "כש",
      "תתקשר",
      "מכתב",
      "תשלח",
      "תמיד"
    ],
    "hebrew_distractors_niqqud": [
      "כְּשֶׁ",
      "תִּתְקַשֵּׁר",
      "מִכְתָּב",
      "תִּשְׁלַח",
      "תָּמִיד"
    ],
    "english_distractors": [
      "When",
      "I do",
      "call",
      "send",
      "a letter"
    ],
    "notes": "אם (if) vs כש (when) — conditional vs temporal conjunction."
  },
  {
    "id": "everyday_21",
    "emoji": "📱",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "הוא שלח לי הודעה במוצאי שבת כאילו לא קרה כלום.",
    "hebrew_niqqud": "הוּא שָׁלַח לִי הוֹדָעָה בְּמוֹצָאֵי שַׁבָּת כְּאִלּוּ לֹא קָרָה כְּלוּם.",
    "english": "He texted me Saturday night as if nothing happened.",
    "hebrew_tokens": [
      "הוא",
      "שלח",
      "לי",
      "הודעה",
      "במוצאי",
      "שבת",
      "כאילו",
      "לא קרה",
      "כלום"
    ],
    "hebrew_tokens_niqqud": [
      "הוּא",
      "שָׁלַח",
      "לִי",
      "הוֹדָעָה",
      "בְּמוֹצָאֵי",
      "שַׁבָּת",
      "כְּאִלּוּ",
      "לֹא קָרָה",
      "כְּלוּם"
    ],
    "english_tokens": [
      "He",
      "texted",
      "me",
      "Saturday",
      "night",
      "as if",
      "nothing",
      "happened"
    ],
    "hebrew_distractors": [
      "בלילה",
      "מחר",
      "פתאום",
      "אחרי",
      "בבוקר",
      "לא ענה"
    ],
    "hebrew_distractors_niqqud": [
      "בַּלַּיְלָה",
      "מָחָר",
      "פִּתְאוֹם",
      "אַחֲרֵי",
      "בַּבֹּקֶר",
      "לֹא עָנָה"
    ],
    "english_distractors": [
      "called",
      "Friday",
      "morning",
      "like nothing",
      "changed"
    ],
    "hebrew_alternates": [
      {
        "text": "הוא שלח לי הודעה במוצאי שבת כאילו כלום לא קרה.",
        "text_niqqud": "הוּא שָׁלַח לִי הוֹדָעָה בְּמוֹצָאֵי שַׁבָּת כְּאִלּוּ כְּלוּם לֹא קָרָה.",
        "tokens": [
          "הוא",
          "שלח",
          "לי",
          "הודעה",
          "במוצאי",
          "שבת",
          "כאילו",
          "כלום",
          "לא קרה"
        ],
        "tokens_niqqud": [
          "הוּא",
          "שָׁלַח",
          "לִי",
          "הוֹדָעָה",
          "בְּמוֹצָאֵי",
          "שַׁבָּת",
          "כְּאִלּוּ",
          "כְּלוּם",
          "לֹא קָרָה"
        ]
      }
    ],
    "notes": "מוצאי שבת means Saturday night / right after Shabbat. כאילו לא קרה כלום and כאילו כלום לא קרה both mean 'as if nothing happened.'"
  },
  {
    "id": "professional_01",
    "emoji": "📄",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני אעבור על המסמך ואחזור אליך בהקדם.",
    "hebrew_niqqud": "אֲנִי אֶעֱבֹר עַל הַמִּסְמָךְ וְאֶחֱזֹר אֵלֶיךָ בְּהֶקְדֵּם.",
    "english": "I'll review the document and get back to you shortly.",
    "hebrew_tokens": [
      "אני",
      "אעבור",
      "על",
      "המסמך",
      "ואחזור",
      "אליך",
      "בהקדם"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "אֶעֱבֹר",
      "עַל",
      "הַמִּסְמָךְ",
      "וְאֶחֱזֹר",
      "אֵלֶיךָ",
      "בְּהֶקְדֵּם"
    ],
    "english_tokens": [
      "I'll",
      "review",
      "the document",
      "and",
      "get back",
      "to you",
      "shortly"
    ],
    "hebrew_distractors": [
      "אקרא",
      "הדוח",
      "אליו",
      "מאוחר",
      "אשלח"
    ],
    "hebrew_distractors_niqqud": [
      "אֶקְרָא",
      "הַדּוּחַ",
      "אֵלָיו",
      "מְאֻחָר",
      "אֶשְׁלַח"
    ],
    "english_distractors": [
      "read through",
      "the report",
      "to him",
      "later today",
      "send"
    ],
    "notes": "בהקדם means 'as soon as possible/shortly' — very common in professional Hebrew."
  },
  {
    "id": "professional_02",
    "emoji": "📅",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "נצטרך לתאם פגישה לשבוע הבא, מתי אתה פנוי?",
    "hebrew_niqqud": "נִצְטָרֵךְ לְתָאֵם פְּגִישָׁה לַשָּׁבוּעַ הַבָּא, מָתַי אַתָּה פָּנוּי?",
    "english": "We'll need to schedule a meeting for next week, when are you available?",
    "hebrew_tokens": [
      "נצטרך",
      "לתאם",
      "פגישה",
      "לשבוע",
      "הבא",
      "מתי",
      "אתה",
      "פנוי"
    ],
    "hebrew_tokens_niqqud": [
      "נִצְטָרֵךְ",
      "לְתָאֵם",
      "פְּגִישָׁה",
      "לַשָּׁבוּעַ",
      "הַבָּא",
      "מָתַי",
      "אַתָּה",
      "פָּנוּי"
    ],
    "english_tokens": [
      "We'll",
      "need to",
      "schedule",
      "a meeting",
      "for next week",
      "when",
      "are you",
      "available"
    ],
    "hebrew_distractors": [
      "לבטל",
      "שיחה",
      "הזה",
      "עסוק",
      "איפה"
    ],
    "hebrew_distractors_niqqud": [
      "לְבַטֵּל",
      "שִׂיחָה",
      "הַזֶּה",
      "עָסוּק",
      "אֵיפֹה"
    ],
    "english_distractors": [
      "cancel",
      "team call",
      "this week",
      "too busy",
      "where exactly"
    ],
    "notes": "לתאם (to coordinate/schedule) vs לבטל (to cancel). פנוי (available) vs עסוק (busy)."
  },
  {
    "id": "professional_03",
    "emoji": "📋",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "זה לא תואם את הדרישות שהוגדרו, נצטרך לעדכן.",
    "hebrew_niqqud": "זֶה לֹא תּוֹאֵם אֶת הַדְּרִישׁוֹת שֶׁהֻגְדְּרוּ, נִצְטָרֵךְ לְעַדְכֵּן.",
    "english": "This doesn't align with the defined requirements, we'll need to update it.",
    "hebrew_tokens": [
      "זה",
      "לא",
      "תואם",
      "את",
      "הדרישות",
      "שהוגדרו",
      "נצטרך",
      "לעדכן"
    ],
    "hebrew_tokens_niqqud": [
      "זֶה",
      "לֹא",
      "תּוֹאֵם",
      "אֶת",
      "הַדְּרִישׁוֹת",
      "שֶׁהֻגְדְּרוּ",
      "נִצְטָרֵךְ",
      "לְעַדְכֵּן"
    ],
    "english_tokens": [
      "This",
      "doesn't align",
      "with the defined requirements",
      "we'll need to",
      "update it"
    ],
    "hebrew_distractors": [
      "מתאים",
      "הנתונים",
      "שנכתבו",
      "לשנות",
      "אפשר"
    ],
    "hebrew_distractors_niqqud": [
      "מַתְאִים",
      "הַנְּתוּנִים",
      "שֶׁנִּכְתְּבוּ",
      "לְשַׁנּוֹת",
      "אֶפְשָׁר"
    ],
    "english_distractors": [
      "this fits",
      "with the current data",
      "we can leave",
      "change that",
      "already approved"
    ],
    "notes": "תואם (aligns/matches) vs מתאים (suitable/fits) — subtle professional vocabulary distinction."
  },
  {
    "id": "professional_04",
    "emoji": "📊",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "יש עדכון לגבי הפרויקט? אני רוצה להבין איפה זה עומד.",
    "hebrew_niqqud": "יֵשׁ עִדְכּוּן לְגַבֵּי הַפְּרוֹיֵקְט? אֲנִי רוֹצֶה לְהָבִין אֵיפֹה זֶה עוֹמֵד.",
    "english": "Is there an update on the project? I want to understand where it stands.",
    "hebrew_tokens": [
      "יש",
      "עדכון",
      "לגבי",
      "הפרויקט",
      "אני",
      "רוצה",
      "להבין",
      "איפה",
      "זה",
      "עומד"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "עִדְכּוּן",
      "לְגַבֵּי",
      "הַפְּרוֹיֵקְט",
      "אֲנִי",
      "רוֹצֶה",
      "לְהָבִין",
      "אֵיפֹה",
      "זֶה",
      "עוֹמֵד"
    ],
    "english_tokens": [
      "Is there an update",
      "on the project",
      "I",
      "want",
      "to understand",
      "where it stands"
    ],
    "hebrew_distractors": [
      "שינוי",
      "על",
      "התוכנית",
      "צריך",
      "לדעת"
    ],
    "hebrew_distractors_niqqud": [
      "שִׁנּוּי",
      "עַל",
      "הַתָּכְנִית",
      "צָרִיךְ",
      "לָדַעַת"
    ],
    "english_distractors": [
      "latest change",
      "about it",
      "the plan",
      "need to",
      "already know"
    ],
    "notes": "לגבי (regarding/about) is formal/professional. איפה זה עומד ('where it stands') is a common status idiom."
  },
  {
    "id": "professional_05",
    "emoji": "🔍",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני ממליץ לבדוק את הנתונים שוב, ייתכן שיש טעות.",
    "hebrew_niqqud": "אֲנִי מַמְלִיץ לִבְדֹּק אֶת הַנְּתוּנִים שׁוּב, יִתָּכֵן שֶׁיֵּשׁ טָעוּת.",
    "english": "I recommend checking the data again, there may be an error.",
    "hebrew_tokens": [
      "אני",
      "ממליץ",
      "לבדוק",
      "את",
      "הנתונים",
      "שוב",
      "ייתכן",
      "שיש",
      "טעות"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "מַמְלִיץ",
      "לִבְדֹּק",
      "אֶת",
      "הַנְּתוּנִים",
      "שׁוּב",
      "יִתָּכֵן",
      "שֶׁיֵּשׁ",
      "טָעוּת"
    ],
    "english_tokens": [
      "I",
      "recommend",
      "checking",
      "the data",
      "again",
      "there may be",
      "an error"
    ],
    "hebrew_distractors": [
      "מציע",
      "לשנות",
      "המסמכים",
      "בטוח",
      "בעיה"
    ],
    "hebrew_distractors_niqqud": [
      "מַצִּיעַ",
      "לְשַׁנּוֹת",
      "הַמִּסְמָכִים",
      "בָּטוּחַ",
      "בְּעָיָה"
    ],
    "english_distractors": [
      "I suggest",
      "small",
      "change",
      "the documents",
      "for sure",
      "a problem"
    ],
    "hebrew_alternates": [
      {
        "text": "אני ממליץ לבדוק שוב את הנתונים, ייתכן שיש טעות.",
        "text_niqqud": "אֲנִי מַמְלִיץ לִבְדֹּק שׁוּב אֶת הַנְּתוּנִים, יִתָּכֵן שֶׁיֵּשׁ טָעוּת.",
        "tokens": [
          "אני",
          "ממליץ",
          "לבדוק",
          "שוב",
          "את",
          "הנתונים",
          "ייתכן",
          "שיש",
          "טעות"
        ],
        "tokens_niqqud": [
          "אֲנִי",
          "מַמְלִיץ",
          "לִבְדֹּק",
          "שׁוּב",
          "אֶת",
          "הַנְּתוּנִים",
          "יִתָּכֵן",
          "שֶׁיֵּשׁ",
          "טָעוּת"
        ]
      }
    ],
    "notes": "ייתכן (it's possible/may be) is a more formal way to express uncertainty. ממליץ (recommend) vs מציע (suggest)."
  },
  {
    "id": "professional_06",
    "emoji": "⚙️",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אנחנו עובדים על זה כרגע, נעדכן כשיהיו תוצאות.",
    "hebrew_niqqud": "אֲנַחְנוּ עוֹבְדִים עַל זֶה כָּרֶגַע, נְעַדְכֵּן כְּשֶׁיִּהְיוּ תּוֹצָאוֹת.",
    "english": "We're working on it right now, we'll update when there are results.",
    "hebrew_tokens": [
      "אנחנו",
      "עובדים",
      "על",
      "זה",
      "כרגע",
      "נעדכן",
      "כשיהיו",
      "תוצאות"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנַחְנוּ",
      "עוֹבְדִים",
      "עַל",
      "זֶה",
      "כָּרֶגַע",
      "נְעַדְכֵּן",
      "כְּשֶׁיִּהְיוּ",
      "תּוֹצָאוֹת"
    ],
    "english_tokens": [
      "We're",
      "working on it",
      "right now",
      "we'll",
      "update",
      "when there are",
      "results"
    ],
    "hebrew_distractors": [
      "סיימנו",
      "אחרי",
      "שינויים",
      "נדווח",
      "מחר"
    ],
    "hebrew_distractors_niqqud": [
      "סִיַּמְנוּ",
      "אַחֲרֵי",
      "שִׁנּוּיִים",
      "נְדַוֵּחַ",
      "מָחָר"
    ],
    "english_distractors": [
      "already finished",
      "after that",
      "big changes",
      "full report",
      "by tomorrow"
    ],
    "notes": "כשיהיו is a contraction of כש+יהיו (when there will be) — tests understanding of Hebrew future tense embedding."
  },
  {
    "id": "professional_07",
    "emoji": "✅",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "זה דורש אישור מההנהלה, אי אפשר להתקדם בלי זה.",
    "hebrew_niqqud": "זֶה דּוֹרֵשׁ אִשּׁוּר מֵהַהַנְהָלָה, אִי אֶפְשָׁר לְהִתְקַדֵּם בְּלִי זֶה.",
    "english": "This requires approval from management, we can't proceed without it.",
    "hebrew_tokens": [
      "זה",
      "דורש",
      "אישור",
      "מההנהלה",
      "אי",
      "אפשר",
      "להתקדם",
      "בלי",
      "זה"
    ],
    "hebrew_tokens_niqqud": [
      "זֶה",
      "דּוֹרֵשׁ",
      "אִשּׁוּר",
      "מֵהַהַנְהָלָה",
      "אִי",
      "אֶפְשָׁר",
      "לְהִתְקַדֵּם",
      "בְּלִי",
      "זֶה"
    ],
    "english_tokens": [
      "This",
      "requires",
      "approval",
      "from management",
      "we can't",
      "proceed",
      "without",
      "it"
    ],
    "hebrew_distractors": [
      "צריך",
      "הסכמה",
      "מהצוות",
      "אישורים",
      "עם"
    ],
    "hebrew_distractors_niqqud": [
      "צָרִיךְ",
      "הַסְכָּמָה",
      "מֵהַצֶּוֶת",
      "אִשּׁוּרִים",
      "עַם"
    ],
    "english_distractors": [
      "needs",
      "permission",
      "from the team",
      "continue",
      "with it"
    ],
    "notes": "דורש (requires/demands) is more formal than צריך (needs). מההנהלה (from management) vs מהצוות (from the team)."
  },
  {
    "id": "professional_08",
    "emoji": "❓",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אפשר לקבל הבהרה בנושא הזה? זה לא לגמרי ברור.",
    "hebrew_niqqud": "אֶפְשָׁר לְקַבֵּל הַבְהָרָה בַּנּוֹשֵׂא הַזֶּה? זֶה לֹא לְגַמְרֵי בָּרוּר.",
    "english": "Can we get clarification on this matter? It's not entirely clear.",
    "hebrew_tokens": [
      "אפשר",
      "לקבל",
      "הבהרה",
      "בנושא",
      "הזה",
      "זה",
      "לא",
      "לגמרי",
      "ברור"
    ],
    "hebrew_tokens_niqqud": [
      "אֶפְשָׁר",
      "לְקַבֵּל",
      "הַבְהָרָה",
      "בַּנּוֹשֵׂא",
      "הַזֶּה",
      "זֶה",
      "לֹא",
      "לְגַמְרֵי",
      "בָּרוּר"
    ],
    "english_tokens": [
      "Can we get",
      "clarification",
      "on this matter",
      "It's not",
      "entirely clear"
    ],
    "hebrew_distractors": [
      "הסבר",
      "על",
      "ההוא",
      "בכלל",
      "מובן"
    ],
    "hebrew_distractors_niqqud": [
      "הֶסְבֵּר",
      "עַל",
      "הַהוּא",
      "בִּכְלָל",
      "מוּבָן"
    ],
    "english_distractors": [
      "quick summary",
      "about that",
      "this topic",
      "not at all",
      "fully understood"
    ],
    "notes": "הבהרה (clarification) vs הסבר (explanation) — both professional but different nuances."
  },
  {
    "id": "professional_09",
    "emoji": "📤",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "נשלח גרסה מעודכנת בהמשך היום, אחרי שנבצע תיקונים.",
    "hebrew_niqqud": "נִשְׁלַח גִּרְסָה מְעֻדְכֶּנֶת בְּהֶמְשֵׁךְ הַיּוֹם, אַחֲרֵי שֶׁנְּבַצֵּעַ תִּקּוּנִים.",
    "english": "We'll send an updated version later today, after making revisions.",
    "hebrew_tokens": [
      "נשלח",
      "גרסה",
      "מעודכנת",
      "בהמשך",
      "היום",
      "אחרי",
      "שנבצע",
      "תיקונים"
    ],
    "hebrew_tokens_niqqud": [
      "נִשְׁלַח",
      "גִּרְסָה",
      "מְעֻדְכֶּנֶת",
      "בְּהֶמְשֵׁךְ",
      "הַיּוֹם",
      "אַחֲרֵי",
      "שֶׁנְּבַצֵּעַ",
      "תִּקּוּנִים"
    ],
    "english_tokens": [
      "We'll send",
      "an",
      "updated",
      "version",
      "later",
      "today",
      "after",
      "making",
      "revisions"
    ],
    "hebrew_distractors": [
      "נקבל",
      "ישנה",
      "מחר",
      "לפני",
      "שינויים"
    ],
    "hebrew_distractors_niqqud": [
      "נְקַבֵּל",
      "יֶשְׁנָהּ",
      "מָחָר",
      "לִפְנֵי",
      "שִׁנּוּיִים"
    ],
    "english_distractors": [
      "We'll receive",
      "the",
      "old",
      "copy",
      "tomorrow",
      "morning",
      "before",
      "those",
      "changes"
    ],
    "notes": "מעודכנת (updated, fem.) agrees with גרסה (version, fem.). נשלח here means 'we'll send' (future first person plural)."
  },
  {
    "id": "professional_10",
    "emoji": "📆",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "חשוב לעמוד בלוחות הזמנים, אחרת זה יעכב את כולם.",
    "hebrew_niqqud": "חָשׁוּב לַעֲמֹד בְּלוּחוֹת הַזְּמַנִּים, אַחֶרֶת זֶה יְעַכֵּב אֶת כֻּלָּם.",
    "english": "It's important to meet the deadlines, otherwise it will delay everyone.",
    "hebrew_tokens": [
      "חשוב",
      "לעמוד",
      "בלוחות",
      "הזמנים",
      "אחרת",
      "זה",
      "יעכב",
      "את",
      "כולם"
    ],
    "hebrew_tokens_niqqud": [
      "חָשׁוּב",
      "לַעֲמֹד",
      "בְּלוּחוֹת",
      "הַזְּמַנִּים",
      "אַחֶרֶת",
      "זֶה",
      "יְעַכֵּב",
      "אֶת",
      "כֻּלָּם"
    ],
    "english_tokens": [
      "It's important",
      "to meet",
      "the deadlines",
      "otherwise",
      "it",
      "will delay",
      "everyone"
    ],
    "hebrew_distractors": [
      "קשה",
      "לשמור",
      "התקציב",
      "אולי",
      "יעזור"
    ],
    "hebrew_distractors_niqqud": [
      "קָשֶׁה",
      "לִשְׁמֹר",
      "הַתַּקְצִיב",
      "אוּלַי",
      "יַעֲזֹר"
    ],
    "english_distractors": [
      "It's difficult",
      "to keep",
      "the budget",
      "maybe",
      "that",
      "will help",
      "us"
    ],
    "notes": "לעמוד בלוחות זמנים (to meet deadlines) is a common professional phrase. לעמוד literally means 'to stand.'"
  },
  {
    "id": "formal_01",
    "emoji": "⚖️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "יש לשקול את ההשלכות ארוכות הטווח לפני קבלת החלטה.",
    "hebrew_niqqud": "יֵשׁ לִשְׁקֹל אֶת הַהַשְׁלָכוֹת אֲרֻכּוֹת הַטְּוָח לִפְנֵי קַבָּלַת הַחְלָטָה.",
    "english": "One must consider the long-term implications before making a decision.",
    "hebrew_tokens": [
      "יש",
      "לשקול",
      "את",
      "ההשלכות",
      "ארוכות",
      "הטווח",
      "לפני",
      "קבלת",
      "החלטה"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לִשְׁקֹל",
      "אֶת",
      "הַהַשְׁלָכוֹת",
      "אֲרֻכּוֹת",
      "הַטְּוָח",
      "לִפְנֵי",
      "קַבָּלַת",
      "הַחְלָטָה"
    ],
    "english_tokens": [
      "One must",
      "consider",
      "the long-term",
      "implications",
      "before",
      "making",
      "a decision"
    ],
    "hebrew_distractors": [
      "לחשוב",
      "קצרות",
      "אחרי",
      "ההחלטה",
      "התוצאות"
    ],
    "hebrew_distractors_niqqud": [
      "לַחֲשֹׁב",
      "קְצָרוֹת",
      "אַחֲרֵי",
      "הַהַחְלָטָה",
      "הַתּוֹצָאוֹת"
    ],
    "english_distractors": [
      "One should",
      "ignore",
      "the short-term",
      "after",
      "an opinion"
    ],
    "hebrew_alternates": [
      {
        "text": "לפני קבלת החלטה יש לשקול את ההשלכות ארוכות הטווח.",
        "text_niqqud": "לִפְנֵי קַבָּלַת הַחְלָטָה יֵשׁ לִשְׁקֹל אֶת הַהַשְׁלָכוֹת אֲרֻכּוֹת הַטְּוָח.",
        "tokens": [
          "לפני",
          "קבלת",
          "החלטה",
          "יש",
          "לשקול",
          "את",
          "ההשלכות",
          "ארוכות",
          "הטווח"
        ],
        "tokens_niqqud": [
          "לִפְנֵי",
          "קַבָּלַת",
          "הַחְלָטָה",
          "יֵשׁ",
          "לִשְׁקֹל",
          "אֶת",
          "הַהַשְׁלָכוֹת",
          "אֲרֻכּוֹת",
          "הַטְּוָח"
        ]
      }
    ],
    "notes": "יש לשקול is formal register — colloquial would be צריך לחשוב על. Good test of register awareness."
  },
  {
    "id": "formal_02",
    "emoji": "📈",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הנתונים מצביעים על מגמה ברורה, למרות התנודות הקטנות.",
    "hebrew_niqqud": "הַנְּתוּנִים מַצְבִּיעִים עַל מְגַמָּה בְּרוּרָה, לַמְרוֹת הַתְּנוּדוֹת הַקְּטַנּוֹת.",
    "english": "The data indicate a clear trend, despite minor fluctuations.",
    "hebrew_tokens": [
      "הנתונים",
      "מצביעים",
      "על",
      "מגמה",
      "ברורה",
      "למרות",
      "התנודות",
      "הקטנות"
    ],
    "hebrew_tokens_niqqud": [
      "הַנְּתוּנִים",
      "מַצְבִּיעִים",
      "עַל",
      "מְגַמָּה",
      "בְּרוּרָה",
      "לַמְרוֹת",
      "הַתְּנוּדוֹת",
      "הַקְּטַנּוֹת"
    ],
    "english_tokens": [
      "The data",
      "indicate",
      "a clear",
      "trend",
      "despite",
      "minor",
      "fluctuations"
    ],
    "hebrew_distractors": [
      "מראים",
      "שינוי",
      "גדולות",
      "בגלל",
      "התוצאות"
    ],
    "hebrew_distractors_niqqud": [
      "מַרְאִים",
      "שִׁנּוּי",
      "גְּדוֹלוֹת",
      "בִּגְלַל",
      "הַתּוֹצָאוֹת"
    ],
    "english_distractors": [
      "show",
      "a vague",
      "change",
      "because of",
      "major"
    ],
    "hebrew_alternates": [
      {
        "text": "למרות התנודות הקטנות, הנתונים מצביעים על מגמה ברורה.",
        "text_niqqud": "לַמְרוֹת הַתְּנוּדוֹת הַקְּטַנּוֹת, הַנְּתוּנִים מַצְבִּיעִים עַל מְגַמָּה בְּרוּרָה.",
        "tokens": [
          "למרות",
          "התנודות",
          "הקטנות",
          "הנתונים",
          "מצביעים",
          "על",
          "מגמה",
          "ברורה"
        ],
        "tokens_niqqud": [
          "לַמְרוֹת",
          "הַתְּנוּדוֹת",
          "הַקְּטַנּוֹת",
          "הַנְּתוּנִים",
          "מַצְבִּיעִים",
          "עַל",
          "מְגַמָּה",
          "בְּרוּרָה"
        ]
      }
    ],
    "notes": "מצביעים (indicate/point to) is more formal than מראים (show). למרות (despite) vs בגלל (because of) — causal logic distractor."
  },
  {
    "id": "formal_03",
    "emoji": "🧮",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "ניתן להסיק מכך כי המודל אינו יציב בתנאים מסוימים.",
    "hebrew_niqqud": "נִתָּן לְהַסִּיק מִכָּךְ כִּי הַמּוֹדֵל אֵינוֹ יַצִּיב בִּתְנָאִים מְסֻיָּמִים.",
    "english": "It can be inferred from this that the model is not stable under certain conditions.",
    "hebrew_tokens": [
      "ניתן",
      "להסיק",
      "מכך",
      "כי",
      "המודל",
      "אינו",
      "יציב",
      "בתנאים",
      "מסוימים"
    ],
    "hebrew_tokens_niqqud": [
      "נִתָּן",
      "לְהַסִּיק",
      "מִכָּךְ",
      "כִּי",
      "הַמּוֹדֵל",
      "אֵינוֹ",
      "יַצִּיב",
      "בִּתְנָאִים",
      "מְסֻיָּמִים"
    ],
    "english_tokens": [
      "It",
      "can",
      "be",
      "inferred",
      "from this",
      "that",
      "the",
      "model",
      "is",
      "not",
      "stable",
      "under",
      "certain",
      "conditions"
    ],
    "hebrew_distractors": [
      "אפשר",
      "לראות",
      "שהוא",
      "מדויק",
      "בכל"
    ],
    "hebrew_distractors_niqqud": [
      "אֶפְשָׁר",
      "לִרְאוֹת",
      "שֶׁהוּא",
      "מְדֻיָּק",
      "בְּכָל"
    ],
    "english_distractors": [
      "can see",
      "look at",
      "fully accurate",
      "all",
      "always"
    ],
    "notes": "ניתן להסיק מכך ('it can be inferred from this') is very formal. אינו is the formal negation of הוא — colloquial would use הוא לא."
  },
  {
    "id": "formal_04",
    "emoji": "🛠️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "השאלה המרכזית היא כיצד ליישם זאת בפועל, ולא רק בתיאוריה.",
    "hebrew_niqqud": "הַשְּׁאֵלָה הַמֶּרְכָּזִית הִיא כֵּיצַד לְיַשֵּׂם זֹאת בְּפֹעַל, וְלֹא רַק בַּתֵּאוֹרְיָה.",
    "english": "The central question is how to implement this in practice, not just in theory.",
    "hebrew_tokens": [
      "השאלה",
      "המרכזית",
      "היא",
      "כיצד",
      "ליישם",
      "זאת",
      "בפועל",
      "ולא",
      "רק",
      "בתיאוריה"
    ],
    "hebrew_tokens_niqqud": [
      "הַשְּׁאֵלָה",
      "הַמֶּרְכָּזִית",
      "הִיא",
      "כֵּיצַד",
      "לְיַשֵּׂם",
      "זֹאת",
      "בְּפֹעַל",
      "וְלֹא",
      "רַק",
      "בַּתֵּאוֹרְיָה"
    ],
    "english_tokens": [
      "The central question",
      "is",
      "how",
      "to implement",
      "this",
      "in practice",
      "not",
      "just",
      "in theory"
    ],
    "hebrew_distractors": [
      "מדוע",
      "לעשות",
      "את",
      "בעיקרון",
      "החשובה"
    ],
    "hebrew_distractors_niqqud": [
      "מַדּוּעַ",
      "לַעֲשׂוֹת",
      "אֶת",
      "בְּעִקָּרוֹן",
      "הַחֲשׁוּבָה"
    ],
    "english_distractors": [
      "to do",
      "in principle",
      "important point",
      "all the time",
      "why exactly"
    ],
    "notes": "כיצד is the formal version of איך (how). ליישם (to implement) is formal; colloquial would be לעשות (to do)."
  },
  {
    "id": "formal_05",
    "emoji": "🔀",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "קיימת שונות משמעותית בין הקבוצות, ויש להסביר אותה.",
    "hebrew_niqqud": "קַיֶּמֶת שׁוֹנוּת מַשְׁמָעוּתִית בֵּין הַקְּבוּצוֹת, וְיֵשׁ לְהַסְבִּיר אוֹתָהּ.",
    "english": "There is significant variation between the groups, and it must be explained.",
    "hebrew_tokens": [
      "קיימת",
      "שונות",
      "משמעותית",
      "בין",
      "הקבוצות",
      "ויש",
      "להסביר",
      "אותה"
    ],
    "hebrew_tokens_niqqud": [
      "קַיֶּמֶת",
      "שׁוֹנוּת",
      "מַשְׁמָעוּתִית",
      "בֵּין",
      "הַקְּבוּצוֹת",
      "וְיֵשׁ",
      "לְהַסְבִּיר",
      "אוֹתָהּ"
    ],
    "english_tokens": [
      "There is",
      "significant",
      "variation",
      "between",
      "the groups",
      "and",
      "it must be",
      "explained"
    ],
    "hebrew_distractors": [
      "קיים",
      "הבדל",
      "קטנה",
      "בתוך",
      "לבדוק",
      "אותו"
    ],
    "hebrew_distractors_niqqud": [
      "קַיָּם",
      "הֶבְדֵּל",
      "קְטַנָּה",
      "בְּתוֹךְ",
      "לִבְדֹּק",
      "אוֹתוֹ"
    ],
    "english_distractors": [
      "There was",
      "a small difference",
      "within the groups",
      "or",
      "it should be checked"
    ],
    "notes": "קיימת (exists, fem.) agrees with שונות (variation, fem.). קיים (masc.) is the third-person gender distractor."
  },
  {
    "id": "formal_06",
    "emoji": "💭",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הניתוח מבוסס על מספר הנחות יסוד, שייתכן שאינן מדויקות.",
    "hebrew_niqqud": "הַנִּתּוּחַ מְבֻסָּס עַל מִסְפַּר הֲנָחוֹת יְסוֹד, שֶׁיִּתָּכֵן שֶׁאֵינָן מְדֻיָּקוֹת.",
    "english": "The analysis is based on several assumptions, which may not be accurate.",
    "hebrew_tokens": [
      "הניתוח",
      "מבוסס",
      "על",
      "מספר",
      "הנחות",
      "יסוד",
      "שייתכן",
      "שאינן",
      "מדויקות"
    ],
    "hebrew_tokens_niqqud": [
      "הַנִּתּוּחַ",
      "מְבֻסָּס",
      "עַל",
      "מִסְפַּר",
      "הֲנָחוֹת",
      "יְסוֹד",
      "שֶׁיִּתָּכֵן",
      "שֶׁאֵינָן",
      "מְדֻיָּקוֹת"
    ],
    "english_tokens": [
      "The analysis",
      "is based on",
      "several assumptions",
      "which",
      "may not be",
      "accurate"
    ],
    "hebrew_distractors": [
      "המחקר",
      "תלוי",
      "הרבה",
      "שאינם",
      "מוכחות"
    ],
    "hebrew_distractors_niqqud": [
      "הַמֶּחְקָר",
      "תָּלוּי",
      "הַרְבֵּה",
      "שֶׁאֵינָם",
      "מוּכָחוֹת"
    ],
    "english_distractors": [
      "The research",
      "depends on",
      "many assumptions",
      "fully reliable",
      "already proven"
    ],
    "notes": "שאינן (that they [fem.] are not) agrees with הנחות (assumptions, fem.). שאינם (masc.) is the gender distractor."
  },
  {
    "id": "formal_07",
    "emoji": "🔎",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "יש לבחון את האפשרויות השונות לעומק לפני בחירה.",
    "hebrew_niqqud": "יֵשׁ לִבְחֹן אֶת הָאֶפְשָׁרוּיוֹת הַשּׁוֹנוֹת לָעֹמֶק לִפְנֵי בְּחִירָה.",
    "english": "The different options should be examined in depth before choosing.",
    "hebrew_tokens": [
      "יש",
      "לבחון",
      "את",
      "האפשרויות",
      "השונות",
      "לעומק",
      "לפני",
      "בחירה"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לִבְחֹן",
      "אֶת",
      "הָאֶפְשָׁרוּיוֹת",
      "הַשּׁוֹנוֹת",
      "לָעֹמֶק",
      "לִפְנֵי",
      "בְּחִירָה"
    ],
    "english_tokens": [
      "The different",
      "options",
      "should be",
      "examined",
      "in depth",
      "before",
      "choosing"
    ],
    "hebrew_distractors": [
      "לבדוק",
      "הדרכים",
      "במהירות",
      "אחרי",
      "החלטה"
    ],
    "hebrew_distractors_niqqud": [
      "לִבְדֹּק",
      "הַדְּרָכִים",
      "בִּמְהִירוּת",
      "אַחֲרֵי",
      "הַחְלָטָה"
    ],
    "english_distractors": [
      "The same",
      "methods",
      "can be",
      "reviewed",
      "after"
    ],
    "hebrew_alternates": [
      {
        "text": "לפני בחירה יש לבחון את האפשרויות השונות לעומק.",
        "text_niqqud": "לִפְנֵי בְּחִירָה יֵשׁ לִבְחֹן אֶת הָאֶפְשָׁרוּיוֹת הַשּׁוֹנוֹת לָעֹמֶק.",
        "tokens": [
          "לפני",
          "בחירה",
          "יש",
          "לבחון",
          "את",
          "האפשרויות",
          "השונות",
          "לעומק"
        ],
        "tokens_niqqud": [
          "לִפְנֵי",
          "בְּחִירָה",
          "יֵשׁ",
          "לִבְחֹן",
          "אֶת",
          "הָאֶפְשָׁרוּיוֹת",
          "הַשּׁוֹנוֹת",
          "לָעֹמֶק"
        ]
      }
    ],
    "notes": "לעומק (in depth) vs במהירות (quickly) — contrasting manner adverbs. יש לבחון is formal impersonal obligation."
  },
  {
    "id": "formal_08",
    "emoji": "🧪",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הממצאים תומכים בהשערה הראשונית, אך לא באופן מלא.",
    "hebrew_niqqud": "הַמִּמְצָאִים תּוֹמְכִים בַּהַשְׁעָרָה הָרִאשׁוֹנִית, אַךְ לֹא בְּאֹפֶן מָלֵא.",
    "english": "The findings support the initial hypothesis, but not completely.",
    "hebrew_tokens": [
      "הממצאים",
      "תומכים",
      "בהשערה",
      "הראשונית",
      "אך",
      "לא",
      "באופן",
      "מלא"
    ],
    "hebrew_tokens_niqqud": [
      "הַמִּמְצָאִים",
      "תּוֹמְכִים",
      "בַּהַשְׁעָרָה",
      "הָרִאשׁוֹנִית",
      "אַךְ",
      "לֹא",
      "בְּאֹפֶן",
      "מָלֵא"
    ],
    "english_tokens": [
      "The findings",
      "support",
      "the initial",
      "hypothesis",
      "but",
      "not",
      "completely"
    ],
    "hebrew_distractors": [
      "התוצאות",
      "סותרים",
      "הסופית",
      "לכן",
      "חלקי"
    ],
    "hebrew_distractors_niqqud": [
      "הַתּוֹצָאוֹת",
      "סוֹתְרִים",
      "הַסּוֹפִית",
      "לָכֵן",
      "חֶלְקִי"
    ],
    "english_distractors": [
      "The results",
      "contradict",
      "the final",
      "therefore",
      "partially"
    ],
    "notes": "אך (but/however) is formal; colloquial uses אבל. תומכים (support) vs סותרים (contradict)."
  },
  {
    "id": "formal_09",
    "emoji": "🌀",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "מדובר בתופעה מורכבת ורב-ממדית, שקשה להגדיר בפשטות.",
    "hebrew_niqqud": "מְדֻבָּר בְּתוֹפָעָה מֻרְכֶּבֶת וְרַב-מְמַדִּית, שֶׁקָּשֶׁה לְהַגְדִּיר בְּפַשְׁטוּת.",
    "english": "This is a complex, multi-dimensional phenomenon that is difficult to define simply.",
    "hebrew_tokens": [
      "מדובר",
      "בתופעה",
      "מורכבת",
      "ורב-ממדית",
      "שקשה",
      "להגדיר",
      "בפשטות"
    ],
    "hebrew_tokens_niqqud": [
      "מְדֻבָּר",
      "בְּתוֹפָעָה",
      "מֻרְכֶּבֶת",
      "וְרַב-מְמַדִּית",
      "שֶׁקָּשֶׁה",
      "לְהַגְדִּיר",
      "בְּפַשְׁטוּת"
    ],
    "english_tokens": [
      "This is",
      "a complex",
      "multi-dimensional",
      "phenomenon",
      "that is difficult",
      "to define",
      "simply"
    ],
    "hebrew_distractors": [
      "בבעיה",
      "פשוטה",
      "להסביר",
      "שקל",
      "במדויק"
    ],
    "hebrew_distractors_niqqud": [
      "בִּבְעָיָה",
      "פְּשׁוּטָה",
      "לְהַסְבִּיר",
      "שֶׁקֶל",
      "בִּמְדֻיָּק"
    ],
    "english_distractors": [
      "the problem",
      "very simple",
      "can be explained",
      "quite easily",
      "in a sentence"
    ],
    "notes": "מדובר ב (it concerns / this is about) is a formal framing device. מורכבת (complex) vs פשוטה (simple)."
  },
  {
    "id": "formal_10",
    "emoji": "🔗",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "יש להבחין בין סיבה לתוצאה, אחרת נגיע למסקנות שגויות.",
    "hebrew_niqqud": "יֵשׁ לְהַבְחִין בֵּין סִבָּה לְתוֹצָאָה, אַחֶרֶת נַגִּיעַ לְמַסְקָנוֹת שְׁגוּיוֹת.",
    "english": "One must distinguish between cause and effect, otherwise we'll reach incorrect conclusions.",
    "hebrew_tokens": [
      "יש",
      "להבחין",
      "בין",
      "סיבה",
      "לתוצאה",
      "אחרת",
      "נגיע",
      "למסקנות",
      "שגויות"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לְהַבְחִין",
      "בֵּין",
      "סִבָּה",
      "לְתוֹצָאָה",
      "אַחֶרֶת",
      "נַגִּיעַ",
      "לְמַסְקָנוֹת",
      "שְׁגוּיוֹת"
    ],
    "english_tokens": [
      "One must",
      "distinguish",
      "between",
      "cause",
      "and",
      "effect",
      "otherwise",
      "we'll reach",
      "incorrect",
      "conclusions"
    ],
    "hebrew_distractors": [
      "להפריד",
      "ובין",
      "להנחה",
      "נכונות",
      "נבין"
    ],
    "hebrew_distractors_niqqud": [
      "לְהַפְרִיד",
      "וּבֵין",
      "לַהֲנָחָה",
      "נְכוֹנוּת",
      "נָבִין"
    ],
    "english_distractors": [
      "One should",
      "separate",
      "an assumption",
      "from",
      "a result",
      "always",
      "we'll get",
      "correct",
      "answers"
    ],
    "notes": "להבחין (to distinguish) is formal. סיבה (cause) and תוצאה (effect) are key academic vocabulary. שגויות (incorrect) is more formal than לא נכונות."
  },
  {
    "id": "formal_11",
    "emoji": "🌇",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הטקס התקיים באולם המרכזי אחרי השקיעה.",
    "hebrew_niqqud": "הַטֶּקֶס הִתְקַיֵּם בָּאוּלָם הַמֶּרְכָּזִי אַחֲרֵי הַשְּׁקִיעָה.",
    "english": "The ceremony was held in the main hall after sunset.",
    "hebrew_tokens": [
      "הטקס",
      "התקיים",
      "באולם",
      "המרכזי",
      "אחרי",
      "השקיעה"
    ],
    "hebrew_tokens_niqqud": [
      "הַטֶּקֶס",
      "הִתְקַיֵּם",
      "בָּאוּלָם",
      "הַמֶּרְכָּזִי",
      "אַחֲרֵי",
      "הַשְּׁקִיעָה"
    ],
    "english_tokens": [
      "The ceremony",
      "was held",
      "in the main hall",
      "after sunset"
    ],
    "hebrew_distractors": [
      "הדיון",
      "בוטל",
      "בחדר",
      "הקטן",
      "לפני"
    ],
    "hebrew_distractors_niqqud": [
      "הַדִּיּוּן",
      "בֻּטַּל",
      "בַּחֶדֶר",
      "הַקָּטָן",
      "לִפְנֵי"
    ],
    "english_distractors": [
      "The meeting",
      "was cancelled",
      "in a small room",
      "before noon"
    ],
    "notes": "התקיים means 'took place' or 'was held' for events; here the ceremony was held in a specific place."
  },
  {
    "id": "formal_12",
    "emoji": "💻",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הדיון התקיים בזום ולא במשרד.",
    "hebrew_niqqud": "הַדִּיּוּן הִתְקַיֵּם בְּזוּם וְלֹא בַּמִּשְׂרָד.",
    "english": "The discussion took place on Zoom, not in the office.",
    "hebrew_tokens": [
      "הדיון",
      "התקיים",
      "בזום",
      "ולא",
      "במשרד"
    ],
    "hebrew_tokens_niqqud": [
      "הַדִּיּוּן",
      "הִתְקַיֵּם",
      "בְּזוּם",
      "וְלֹא",
      "בַּמִּשְׂרָד"
    ],
    "english_tokens": [
      "The discussion",
      "took place",
      "on Zoom",
      "not",
      "in the office"
    ],
    "hebrew_distractors": [
      "הטקס",
      "נדחה",
      "בטלפון",
      "וגם",
      "באולם"
    ],
    "hebrew_distractors_niqqud": [
      "הַטֶּקֶס",
      "נִדְחָה",
      "בַּטֵּלֵפוֹן",
      "וְגַם",
      "בָּאוּלָם"
    ],
    "english_distractors": [
      "The ceremony",
      "was postponed",
      "by phone",
      "also",
      "in the hall"
    ],
    "notes": "לדון gives דיון as the noun 'discussion'; התקיים keeps the event meaning 'took place'."
  },
  {
    "id": "formal_13",
    "emoji": "💡",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "קיים פתרון פשוט יותר לבעיה הזאת.",
    "hebrew_niqqud": "קַיָּם פִּתְרוֹן פָּשׁוּט יוֹתֵר לַבְּעָיָה הַזֹּאת.",
    "english": "There is a simpler solution to this problem.",
    "hebrew_tokens": [
      "קיים",
      "פתרון",
      "פשוט",
      "יותר",
      "לבעיה",
      "הזאת"
    ],
    "hebrew_tokens_niqqud": [
      "קַיָּם",
      "פִּתְרוֹן",
      "פָּשׁוּט",
      "יוֹתֵר",
      "לַבְּעָיָה",
      "הַזֹּאת"
    ],
    "english_tokens": [
      "There is",
      "a",
      "simpler",
      "solution",
      "to",
      "this",
      "problem"
    ],
    "hebrew_distractors": [
      "קיימת",
      "סיכון",
      "מורכב",
      "פחות",
      "לשאלה"
    ],
    "hebrew_distractors_niqqud": [
      "קַיֶּמֶת",
      "סִכּוּן",
      "מֻרְכָּב",
      "פָּחוֹת",
      "לַשְּׁאֵלָה"
    ],
    "english_distractors": [
      "There are",
      "an",
      "harder",
      "issue",
      "for",
      "that",
      "question",
      "less simple"
    ],
    "notes": "קיים can mean 'there exists' or 'there is' when it agrees with a masculine noun like פתרון."
  },
  {
    "id": "formal_14",
    "emoji": "⚠️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "קיימים כמה סיכונים שצריך לקחת בחשבון.",
    "hebrew_niqqud": "קַיָּמִים כַּמָּה סִכּוּנִים שֶׁצָּרִיךְ לָקַחַת בְּחֶשְׁבּוֹן.",
    "english": "There are several risks that need to be taken into account.",
    "hebrew_tokens": [
      "קיימים",
      "כמה",
      "סיכונים",
      "שצריך",
      "לקחת",
      "בחשבון"
    ],
    "hebrew_tokens_niqqud": [
      "קַיָּמִים",
      "כַּמָּה",
      "סִכּוּנִים",
      "שֶׁצָּרִיךְ",
      "לָקַחַת",
      "בְּחֶשְׁבּוֹן"
    ],
    "english_tokens": [
      "There are",
      "several",
      "risks",
      "that need to be",
      "taken",
      "into account"
    ],
    "hebrew_distractors": [
      "קיים",
      "הרבה",
      "יתרונות",
      "שאפשר",
      "להתעלם"
    ],
    "hebrew_distractors_niqqud": [
      "קַיָּם",
      "הַרְבֵּה",
      "יִתְרוֹנוֹת",
      "שֶׁאֶפְשָׁר",
      "לְהִתְעַלֵּם"
    ],
    "english_distractors": [
      "There is",
      "many",
      "advantages",
      "that can be",
      "ignored"
    ],
    "notes": "קיימים is the masculine plural 'there are'; לקחת בחשבון means 'to take into account'."
  },
  {
    "id": "formal_15",
    "emoji": "🤝",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "ההסכם עדיין קיים למרות השינויים.",
    "hebrew_niqqud": "הַהֶסְכֵּם עֲדַיִן קַיָּם לַמְרוֹת הַשִּׁנּוּיִים.",
    "english": "The agreement still exists despite the changes.",
    "hebrew_tokens": [
      "ההסכם",
      "עדיין",
      "קיים",
      "למרות",
      "השינויים"
    ],
    "hebrew_tokens_niqqud": [
      "הַהֶסְכֵּם",
      "עֲדַיִן",
      "קַיָּם",
      "לַמְרוֹת",
      "הַשִּׁנּוּיִים"
    ],
    "english_tokens": [
      "The agreement",
      "still exists",
      "despite",
      "the changes"
    ],
    "hebrew_distractors": [
      "המסמך",
      "כבר",
      "בוטל",
      "בגלל",
      "הבעיות"
    ],
    "hebrew_distractors_niqqud": [
      "הַמִּסְמָךְ",
      "כְּבָר",
      "בֻּטַּל",
      "בִּגְלַל",
      "הַבְּעָיוֹת"
    ],
    "english_distractors": [
      "The document",
      "was already cancelled",
      "because of",
      "the problems"
    ],
    "notes": "קיים can also mean 'still exists' or 'remains in force', especially for agreements and arrangements."
  },
  {
    "id": "formal_16",
    "emoji": "♻️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הפתרון הזה בר קיימא גם בטווח הארוך.",
    "hebrew_niqqud": "הַפִּתְרוֹן הַזֶּה בַּר קְיָמָא גַּם בַּטְּוָח הָאָרֹךְ.",
    "english": "This solution is sustainable even in the long term.",
    "hebrew_tokens": [
      "הפתרון",
      "הזה",
      "בר קיימא",
      "גם",
      "בטווח",
      "הארוך"
    ],
    "hebrew_tokens_niqqud": [
      "הַפִּתְרוֹן",
      "הַזֶּה",
      "בַּר קְיָמָא",
      "גַּם",
      "בַּטְּוָח",
      "הָאָרֹךְ"
    ],
    "english_tokens": [
      "This solution",
      "is sustainable",
      "even",
      "in the long term"
    ],
    "hebrew_distractors": [
      "הרעיון",
      "ההוא",
      "לא יציב",
      "רק",
      "בטווח קצר"
    ],
    "hebrew_distractors_niqqud": [
      "הָרַעֲיוֹן",
      "הַהוּא",
      "לֹא יַצִּיב",
      "רַק",
      "בִּטְוָח קָצָר"
    ],
    "english_distractors": [
      "That idea",
      "is temporary",
      "only",
      "in the short term"
    ],
    "hebrew_alternates": [
      {
        "text": "הפתרון הזה גם בר קיימא בטווח הארוך.",
        "text_niqqud": "הַפִּתְרוֹן הַזֶּה גַּם בַּר קְיָמָא בַּטְּוָח הָאָרֹךְ.",
        "tokens": [
          "הפתרון",
          "הזה",
          "גם",
          "בר קיימא",
          "בטווח",
          "הארוך"
        ],
        "tokens_niqqud": [
          "הַפִּתְרוֹן",
          "הַזֶּה",
          "גַּם",
          "בַּר קְיָמָא",
          "בַּטְּוָח",
          "הָאָרֹךְ"
        ]
      }
    ],
    "notes": "בר קיימא means 'sustainable' or literally 'able to exist'; it differs from קיים as 'exists'. גם may sit before בר קיימא as well as before בטווח הארוך."
  },
  {
    "id": "formal_17",
    "emoji": "👽",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "קיום חיים מחוץ לכדור הארץ עדיין לא הוכח.",
    "hebrew_niqqud": "קִיּוּם חַיִּים מִחוּץ לְכַדּוּר הָאָרֶץ עֲדַיִן לֹא הוּכַח.",
    "english": "The existence of life outside Earth has not yet been proven.",
    "hebrew_tokens": [
      "קיום",
      "חיים",
      "מחוץ",
      "לכדור",
      "הארץ",
      "עדיין",
      "לא",
      "הוכח"
    ],
    "hebrew_tokens_niqqud": [
      "קִיּוּם",
      "חַיִּים",
      "מִחוּץ",
      "לְכַדּוּר",
      "הָאָרֶץ",
      "עֲדַיִן",
      "לֹא",
      "הוּכַח"
    ],
    "english_tokens": [
      "The existence",
      "of life",
      "outside",
      "Earth",
      "has",
      "not",
      "yet",
      "been proven"
    ],
    "hebrew_distractors": [
      "סיום",
      "מחקר",
      "בתוך",
      "המעבדה",
      "כבר",
      "אושר"
    ],
    "hebrew_distractors_niqqud": [
      "סִיּוּם",
      "מֶחְקָר",
      "בְּתוֹךְ",
      "הַמַּעְבָּדָה",
      "כְּבָר",
      "אֹשֶׁר"
    ],
    "english_distractors": [
      "The end",
      "of research",
      "inside",
      "the lab",
      "was",
      "already",
      "approved"
    ],
    "notes": "קיום is the noun 'existence' here, not the verb לקיים."
  },
  {
    "id": "formal_18",
    "emoji": "🌌",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "בשבילו זו לא בעיה טכנית, אלא משבר קיומי.",
    "hebrew_niqqud": "בִּשְׁבִילוֹ זוֹ לֹא בְּעָיָה טֶכְנִית, אֶלָּא מַשְׁבֵּר קִיּוּמִי.",
    "english": "For him, this is not a technical problem, but an existential crisis.",
    "hebrew_tokens": [
      "בשבילו",
      "זו",
      "לא",
      "בעיה",
      "טכנית",
      "אלא",
      "משבר",
      "קיומי"
    ],
    "hebrew_tokens_niqqud": [
      "בִּשְׁבִילוֹ",
      "זוֹ",
      "לֹא",
      "בְּעָיָה",
      "טֶכְנִית",
      "אֶלָּא",
      "מַשְׁבֵּר",
      "קִיּוּמִי"
    ],
    "english_tokens": [
      "For him",
      "this is not",
      "a technical problem",
      "but",
      "an existential crisis"
    ],
    "hebrew_distractors": [
      "בשבילה",
      "זה",
      "שאלה",
      "מעשית",
      "וגם",
      "דיון"
    ],
    "hebrew_distractors_niqqud": [
      "בִּשְׁבִילָהּ",
      "זֶה",
      "שָׁאֲלָה",
      "מַעֲשִׂית",
      "וְגַם",
      "דִּיּוּן"
    ],
    "english_distractors": [
      "For her",
      "this is",
      "a practical question",
      "and also",
      "a discussion"
    ],
    "notes": "קיומי means 'existential', often for something that touches identity, survival, or basic meaning."
  },
  {
    "id": "formal_19",
    "emoji": "🌍",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "קיימות היא לא רק סיסמה אלא דרך עבודה.",
    "hebrew_niqqud": "קַיָּמוֹת הִיא לֹא רַק סִיסְמָה אֶלָּא דֶּרֶךְ עֲבוֹדָה.",
    "english": "Sustainability is not just a slogan but a way of working.",
    "hebrew_tokens": [
      "קיימות",
      "היא",
      "לא",
      "רק",
      "סיסמה",
      "אלא",
      "דרך",
      "עבודה"
    ],
    "hebrew_tokens_niqqud": [
      "קַיָּמוֹת",
      "הִיא",
      "לֹא",
      "רַק",
      "סִיסְמָה",
      "אֶלָּא",
      "דֶּרֶךְ",
      "עֲבוֹדָה"
    ],
    "english_tokens": [
      "Sustainability",
      "is not just",
      "a slogan",
      "but",
      "a way of working"
    ],
    "hebrew_distractors": [
      "יעילות",
      "זה",
      "בעיקר",
      "כותרת",
      "וגם",
      "שיטת"
    ],
    "hebrew_distractors_niqqud": [
      "יְעִילוּת",
      "זֶה",
      "בְּעִקָּר",
      "כּוֹתֶרֶת",
      "וְגַם",
      "שִׁיטַת"
    ],
    "english_distractors": [
      "Efficiency",
      "is mostly",
      "a headline",
      "and also",
      "a method"
    ],
    "notes": "קיימות is the noun 'sustainability'; it is not being used here as a verb form."
  },
  {
    "id": "colloquial_21",
    "emoji": "🛒",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "כמה זה? נו, תן לי מחיר טוב ואני לוקח שניים.",
    "hebrew_niqqud": "כַּמָּה זֶה? נוּ, תֵּן לִי מְחִיר טוֹב וַאֲנִי לוֹקֵחַ שְׁנַיִם.",
    "english": "How much is this? Come on, give me a good price and I'll take two.",
    "hebrew_tokens": [
      "כמה",
      "זה",
      "נו",
      "תן",
      "לי",
      "מחיר",
      "טוב",
      "ואני",
      "לוקח",
      "שניים"
    ],
    "hebrew_tokens_niqqud": [
      "כַּמָּה",
      "זֶה",
      "נוּ",
      "תֵּן",
      "לִי",
      "מְחִיר",
      "טוֹב",
      "וַאֲנִי",
      "לוֹקֵחַ",
      "שְׁנַיִם"
    ],
    "english_tokens": [
      "How much",
      "is this",
      "Come on",
      "give",
      "me",
      "a good",
      "price",
      "and",
      "I'll take",
      "two"
    ],
    "hebrew_distractors": [
      "יקר",
      "זול",
      "מוכר",
      "אחד",
      "עכשיו"
    ],
    "hebrew_distractors_niqqud": [
      "יָקָר",
      "זוֹל",
      "מוֹכֵר",
      "אֶחָד",
      "עַכְשָׁו"
    ],
    "english_distractors": [
      "That's too expensive",
      "the cheapest one",
      "I'll sell",
      "just one",
      "right now"
    ],
    "notes": "נו is an all-purpose nudge — 'come on / well.' Haggling at the שוק (market) is expected, not rude."
  },
  {
    "id": "colloquial_22",
    "emoji": "🧆",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "חצי מנה בפיתה, עם הכול ובלי חריף בבקשה.",
    "hebrew_niqqud": "חֲצִי מָנָה בְּפִתָּה, עִם הַכֹּל וּבְלִי חָרִיף בְּבַקָּשָׁה.",
    "english": "Half a portion in a pita, with everything and without spicy please.",
    "hebrew_tokens": [
      "חצי",
      "מנה",
      "בפיתה",
      "עם",
      "הכול",
      "ובלי",
      "חריף",
      "בבקשה"
    ],
    "hebrew_tokens_niqqud": [
      "חֲצִי",
      "מָנָה",
      "בְּפִתָּה",
      "עִם",
      "הַכֹּל",
      "וּבְלִי",
      "חָרִיף",
      "בְּבַקָּשָׁה"
    ],
    "english_tokens": [
      "Half",
      "a portion",
      "in a pita",
      "with",
      "everything",
      "and without",
      "spicy",
      "please"
    ],
    "hebrew_distractors": [
      "שלמה",
      "בלאפה",
      "חסה",
      "מתוק",
      "פלאפל"
    ],
    "hebrew_distractors_niqqud": [
      "שְׁלֹמֹה",
      "בְּלָאפָה",
      "חַסָּה",
      "מָתוֹק",
      "פָלָאפֶל"
    ],
    "english_distractors": [
      "A full portion",
      "in a laffa",
      "with salad",
      "extra sauce",
      "no salt"
    ],
    "notes": "עם הכול ('with everything') is the standard way to order toppings; חריף = spicy/hot sauce."
  },
  {
    "id": "colloquial_23",
    "emoji": "🤤",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "האוכל שם היה חבל על הזמן, חייבים לחזור.",
    "hebrew_niqqud": "הָאֹכֶל שָׁם הָיָה חֲבָל עַל הַזְּמַן, חַיָּבִים לַחְזֹר.",
    "english": "The food there was amazing, we have to go back.",
    "hebrew_tokens": [
      "האוכל",
      "שם",
      "היה",
      "חבל",
      "על",
      "הזמן",
      "חייבים",
      "לחזור"
    ],
    "hebrew_tokens_niqqud": [
      "הָאֹכֶל",
      "שָׁם",
      "הָיָה",
      "חֲבָל",
      "עַל",
      "הַזְּמַן",
      "חַיָּבִים",
      "לַחְזֹר"
    ],
    "english_tokens": [
      "The food",
      "there",
      "was",
      "amazing",
      "we",
      "have to",
      "go back"
    ],
    "hebrew_distractors": [
      "גרוע",
      "פעם",
      "אסור",
      "להישאר",
      "יקר"
    ],
    "hebrew_distractors_niqqud": [
      "גָּרוּעַ",
      "פַּעַם",
      "אָסוּר",
      "לְהִשָּׁאֵר",
      "יָקָר"
    ],
    "english_distractors": [
      "was terrible",
      "we shouldn't",
      "stay home",
      "next time",
      "too pricey"
    ],
    "notes": "חבל על הזמן literally means 'a waste of time,' but in slang it's high praise — 'amazing / out of this world.' Tone decides the meaning."
  },
  {
    "id": "colloquial_24",
    "emoji": "😖",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "השירות במסעדה הזאת היה ממש על הפנים.",
    "hebrew_niqqud": "הַשֵּׁרוּת בַּמִּסְעָדָה הַזֹּאת הָיָה מַמָּשׁ עַל הַפָּנִים.",
    "english": "The service at this restaurant was really terrible.",
    "hebrew_tokens": [
      "השירות",
      "במסעדה",
      "הזאת",
      "היה",
      "ממש",
      "על",
      "הפנים"
    ],
    "hebrew_tokens_niqqud": [
      "הַשֵּׁרוּת",
      "בַּמִּסְעָדָה",
      "הַזֹּאת",
      "הָיָה",
      "מַמָּשׁ",
      "עַל",
      "הַפָּנִים"
    ],
    "english_tokens": [
      "The service",
      "at",
      "this restaurant",
      "was",
      "really",
      "terrible"
    ],
    "hebrew_distractors": [
      "האוכל",
      "מצוין",
      "קצת",
      "מהיר",
      "נחמד"
    ],
    "hebrew_distractors_niqqud": [
      "הָאֹכֶל",
      "מְצֻיָּן",
      "קְצָת",
      "מָהִיר",
      "נֶחְמָד"
    ],
    "english_distractors": [
      "The food",
      "was excellent",
      "a little",
      "quite fast",
      "very friendly"
    ],
    "notes": "על הפנים (literally 'on the face') is slang for 'awful / lousy' — used for service, weather, or how you feel."
  },
  {
    "id": "colloquial_25",
    "emoji": "🍦",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "שוב נפגשנו במקרה? פעם שלישית גלידה!",
    "hebrew_niqqud": "שׁוּב נִפְגַּשְׁנוּ בְּמִקְרֶה? פַּעַם שְׁלִישִׁית גְּלִידָה!",
    "english": "We met by chance again? Third time you owe me ice cream!",
    "hebrew_tokens": [
      "שוב",
      "נפגשנו",
      "במקרה",
      "פעם",
      "שלישית",
      "גלידה"
    ],
    "hebrew_tokens_niqqud": [
      "שׁוּב",
      "נִפְגַּשְׁנוּ",
      "בְּמִקְרֶה",
      "פַּעַם",
      "שְׁלִישִׁית",
      "גְּלִידָה"
    ],
    "english_tokens": [
      "We met",
      "by chance",
      "again",
      "Third time",
      "you owe me",
      "ice cream"
    ],
    "hebrew_distractors": [
      "אולי",
      "בכוונה",
      "ראשונה",
      "קפה",
      "שוקולד"
    ],
    "hebrew_distractors_niqqud": [
      "אוּלַי",
      "בְּכַוָּנָה",
      "רִאשׁוֹנָה",
      "קָפֶה",
      "שׁוֹקוֹלָד"
    ],
    "english_distractors": [
      "on purpose",
      "the first time",
      "coffee's on you",
      "by mistake",
      "tomorrow"
    ],
    "hebrew_alternates": [
      {
        "text": "נפגשנו שוב במקרה? פעם שלישית גלידה!",
        "text_niqqud": "נִפְגַּשְׁנוּ שׁוּב בְּמִקְרֶה? פַּעַם שְׁלִישִׁית גְּלִידָה!",
        "tokens": [
          "נפגשנו",
          "שוב",
          "במקרה",
          "פעם",
          "שלישית",
          "גלידה"
        ],
        "tokens_niqqud": [
          "נִפְגַּשְׁנוּ",
          "שׁוּב",
          "בְּמִקְרֶה",
          "פַּעַם",
          "שְׁלִישִׁית",
          "גְּלִידָה"
        ]
      },
      {
        "text": "נפגשנו במקרה שוב? פעם שלישית גלידה!",
        "text_niqqud": "נִפְגַּשְׁנוּ בְּמִקְרֶה שׁוּב? פַּעַם שְׁלִישִׁית גְּלִידָה!",
        "tokens": [
          "נפגשנו",
          "במקרה",
          "שוב",
          "פעם",
          "שלישית",
          "גלידה"
        ],
        "tokens_niqqud": [
          "נִפְגַּשְׁנוּ",
          "בְּמִקְרֶה",
          "שׁוּב",
          "פַּעַם",
          "שְׁלִישִׁית",
          "גְּלִידָה"
        ]
      }
    ],
    "notes": "פעם שלישית גלידה ('third time, ice cream') is a playful saying — keep bumping into someone and the third time 'earns' a treat. Israel's 'we have to stop meeting like this.'"
  },
  {
    "id": "colloquial_26",
    "emoji": "🎫",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "לקחתי מספר ואני כבר מחכה שעה בתור.",
    "hebrew_niqqud": "לָקַחְתִּי מִסְפָּר וַאֲנִי כְּבָר מְחַכֶּה שָׁעָה בַּתּוֹר.",
    "english": "I took a number and I've already been waiting an hour in line.",
    "hebrew_tokens": [
      "לקחתי",
      "מספר",
      "ואני",
      "כבר",
      "מחכה",
      "שעה",
      "בתור"
    ],
    "hebrew_tokens_niqqud": [
      "לָקַחְתִּי",
      "מִסְפָּר",
      "וַאֲנִי",
      "כְּבָר",
      "מְחַכֶּה",
      "שָׁעָה",
      "בַּתּוֹר"
    ],
    "english_tokens": [
      "I took",
      "a number",
      "and I've",
      "already",
      "been waiting",
      "an hour",
      "in line"
    ],
    "hebrew_distractors": [
      "שכחתי",
      "טופס",
      "הלכתי",
      "דקה",
      "בבית"
    ],
    "hebrew_distractors_niqqud": [
      "שָׁכַחְתִּי",
      "טֹפֶס",
      "הָלַכְתִּי",
      "דַּקָּה",
      "בַּבַּיִת"
    ],
    "english_distractors": [
      "I forgot",
      "a form",
      "for a minute",
      "I left",
      "at the desk"
    ],
    "notes": "Standing בתור (in line) and taking a מספר (number) is a rite of passage at any Israeli office or clinic. כבר here adds the 'already' impatience."
  },
  {
    "id": "colloquial_27",
    "emoji": "🏖️",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "בוא נלך לים לפני שיהיה חם מדי.",
    "hebrew_niqqud": "בּוֹא נֵלֵךְ לַיָּם לִפְנֵי שֶׁיִּהְיֶה חַם מִדַּי.",
    "english": "Let's go to the beach before it gets too hot.",
    "hebrew_tokens": [
      "בוא",
      "נלך",
      "לים",
      "לפני",
      "שיהיה",
      "חם",
      "מדי"
    ],
    "hebrew_tokens_niqqud": [
      "בּוֹא",
      "נֵלֵךְ",
      "לַיָּם",
      "לִפְנֵי",
      "שֶׁיִּהְיֶה",
      "חַם",
      "מִדַּי"
    ],
    "english_tokens": [
      "Let's",
      "go",
      "to the beach",
      "before",
      "it gets",
      "too",
      "hot"
    ],
    "hebrew_distractors": [
      "נישאר",
      "לפארק",
      "אחרי",
      "קר",
      "עכשיו"
    ],
    "hebrew_distractors_niqqud": [
      "נִשָּׁאֵר",
      "לַפַּארְק",
      "אַחֲרֵי",
      "קַר",
      "עַכְשָׁו"
    ],
    "english_distractors": [
      "Let's stay",
      "to the park",
      "after",
      "too cold",
      "later"
    ],
    "hebrew_alternates": [
      {
        "text": "לפני שיהיה חם מדי, בוא נלך לים.",
        "text_niqqud": "לִפְנֵי שֶׁיִּהְיֶה חַם מִדַּי, בּוֹא נֵלֵךְ לַיָּם.",
        "tokens": [
          "לפני",
          "שיהיה",
          "חם",
          "מדי",
          "בוא",
          "נלך",
          "לים"
        ],
        "tokens_niqqud": [
          "לִפְנֵי",
          "שֶׁיִּהְיֶה",
          "חַם",
          "מִדַּי",
          "בּוֹא",
          "נֵלֵךְ",
          "לַיָּם"
        ]
      }
    ],
    "notes": "ים (literally 'sea') is how Israelis say 'the beach.' בוא נ... ('come, let's...') is the everyday way to suggest doing something."
  },
  {
    "id": "colloquial_28",
    "emoji": "🚐",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "נהג, אפשר לרדת בתחנה הבאה? תודה.",
    "hebrew_niqqud": "נַהָג, אֶפְשָׁר לָרֶדֶת בַּתַּחֲנָה הַבָּאָה? תּוֹדָה.",
    "english": "Driver, can I get off at the next stop? Thanks.",
    "hebrew_tokens": [
      "נהג",
      "אפשר",
      "לרדת",
      "בתחנה",
      "הבאה",
      "תודה"
    ],
    "hebrew_tokens_niqqud": [
      "נַהָג",
      "אֶפְשָׁר",
      "לָרֶדֶת",
      "בַּתַּחֲנָה",
      "הַבָּאָה",
      "תּוֹדָה"
    ],
    "english_tokens": [
      "Driver",
      "can I",
      "get off",
      "at the",
      "next",
      "stop",
      "Thanks"
    ],
    "hebrew_distractors": [
      "מונית",
      "לעלות",
      "הקודמת",
      "עכשיו",
      "כסף"
    ],
    "hebrew_distractors_niqqud": [
      "מוֹנִית",
      "לַעֲלוֹת",
      "הַקּוֹדֶמֶת",
      "עַכְשָׁו",
      "כֶּסֶף"
    ],
    "english_distractors": [
      "Taxi",
      "get on",
      "the previous stop",
      "right here",
      "the fare"
    ],
    "notes": "On a מונית שירות (shared taxi) you call out to the נהג (driver) to be let off; לרדת ('to go down') is how you say to get off a bus or taxi."
  },
  {
    "id": "colloquial_29",
    "emoji": "😱",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "אין מצב! לא מאמין שהוא באמת אמר את זה.",
    "hebrew_niqqud": "אֵין מַצָּב! לֹא מַאֲמִין שֶׁהוּא בֶּאֱמֶת אָמַר אֶת זֶה.",
    "english": "No way! I can't believe he really said that.",
    "hebrew_tokens": [
      "אין",
      "מצב",
      "לא",
      "מאמין",
      "שהוא",
      "באמת",
      "אמר",
      "את",
      "זה"
    ],
    "hebrew_tokens_niqqud": [
      "אֵין",
      "מַצָּב",
      "לֹא",
      "מַאֲמִין",
      "שֶׁהוּא",
      "בֶּאֱמֶת",
      "אָמַר",
      "אֶת",
      "זֶה"
    ],
    "english_tokens": [
      "No",
      "way",
      "I can't",
      "believe",
      "he",
      "really",
      "said",
      "that"
    ],
    "hebrew_distractors": [
      "יש",
      "ברור",
      "שמעתי",
      "אולי",
      "שתק"
    ],
    "hebrew_distractors_niqqud": [
      "יֵשׁ",
      "בָּרוּר",
      "שָׁמַעְתִּי",
      "אוּלַי",
      "שָׁתַק"
    ],
    "english_distractors": [
      "Of course",
      "I heard that",
      "maybe",
      "he asked",
      "stayed quiet"
    ],
    "notes": "אין מצב (literally 'there's no situation') means 'no way! / impossible!' — disbelief or flat refusal, depending on tone."
  },
  {
    "id": "colloquial_30",
    "emoji": "🥹",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "כפרה עליך, לא יודעת מה הייתי עושה בלעדיך.",
    "hebrew_niqqud": "כַּפָּרָה עָלֶיךָ, לֹא יוֹדַעַת מָה הָיִיתִי עוֹשָׂה בִּלְעָדֶיךָ.",
    "english": "You're a lifesaver, I don't know what I'd do without you.",
    "hebrew_tokens": [
      "כפרה",
      "עליך",
      "לא",
      "יודעת",
      "מה",
      "הייתי",
      "עושה",
      "בלעדיך"
    ],
    "hebrew_tokens_niqqud": [
      "כַּפָּרָה",
      "עָלֶיךָ",
      "לֹא",
      "יוֹדַעַת",
      "מָה",
      "הָיִיתִי",
      "עוֹשָׂה",
      "בִּלְעָדֶיךָ"
    ],
    "english_tokens": [
      "You're a lifesaver",
      "I don't",
      "know",
      "what",
      "I'd",
      "do",
      "without you"
    ],
    "hebrew_distractors": [
      "איתך",
      "כן",
      "חושבת",
      "איפה",
      "בלעדיו"
    ],
    "hebrew_distractors_niqqud": [
      "אִתְּךָ",
      "כֵּן",
      "חוֹשֶׁבֶת",
      "אֵיפֹה",
      "בִּלְעָדָיו"
    ],
    "english_distractors": [
      "Thank you",
      "I do",
      "when",
      "I can",
      "with you"
    ],
    "notes": "כפרה עליך (Mizrahi origin, literally 'atonement upon you') is a deeply affectionate expression of love and gratitude — much warmer than a plain 'sweetheart,' closer to 'you're a lifesaver / I adore you.' On its own, כפרה can be used as a tender 'sweetheart.'"
  },
  {
    "id": "everyday_22",
    "emoji": "😴",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אני לא מסוגל לקום מוקדם בבוקר.",
    "hebrew_niqqud": "אֲנִי לֹא מְסֻגָּל לָקוּם מֻקְדָּם בַּבֹּקֶר.",
    "english": "I can't get up early in the morning.",
    "hebrew_tokens": [
      "אני",
      "לא",
      "מסוגל",
      "לקום",
      "מוקדם",
      "בבוקר"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "לֹא",
      "מְסֻגָּל",
      "לָקוּם",
      "מֻקְדָּם",
      "בַּבֹּקֶר"
    ],
    "english_tokens": [
      "I",
      "can't",
      "get up",
      "early",
      "in the morning"
    ],
    "hebrew_distractors": [
      "רוצה",
      "אוהב",
      "לישון",
      "מאוחר",
      "בלילה"
    ],
    "hebrew_distractors_niqqud": [
      "רוֹצֶה",
      "אוֹהֵב",
      "לִישֹׁן",
      "מְאֻחָר",
      "בַּלַּיְלָה"
    ],
    "english_distractors": [
      "I want",
      "love to",
      "sleep",
      "late",
      "at night"
    ],
    "notes": "מסוגל means 'capable of / able to' and is followed by an infinitive; 'לא מסוגל' is a very common way to say 'I just can't (bring myself to).'"
  },
  {
    "id": "everyday_23",
    "emoji": "💪",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "היא מסוגלת לעבוד שתים עשרה שעות ברצף.",
    "hebrew_niqqud": "הִיא מְסֻגֶּלֶת לַעֲבֹד שְׁתֵּים עֶשְׂרֵה שָׁעוֹת בְּרֶצֶף.",
    "english": "She is able to work twelve hours straight.",
    "hebrew_tokens": [
      "היא",
      "מסוגלת",
      "לעבוד",
      "שתים",
      "עשרה",
      "שעות",
      "ברצף"
    ],
    "hebrew_tokens_niqqud": [
      "הִיא",
      "מְסֻגֶּלֶת",
      "לַעֲבֹד",
      "שְׁתֵּים",
      "עֶשְׂרֵה",
      "שָׁעוֹת",
      "בְּרֶצֶף"
    ],
    "english_tokens": [
      "She",
      "is able to",
      "work",
      "twelve",
      "hours",
      "straight"
    ],
    "hebrew_distractors": [
      "רוצה",
      "צריכה",
      "לנוח",
      "שלוש",
      "לבד"
    ],
    "hebrew_distractors_niqqud": [
      "רוֹצֶה",
      "צְרִיכָה",
      "לָנוּחַ",
      "שָׁלוֹשׁ",
      "לְבַד"
    ],
    "english_distractors": [
      "wants to",
      "needs to",
      "rest",
      "three",
      "alone"
    ],
    "notes": "מסוגלת is the feminine singular of מסוגל; ברצף means 'in a row / straight / continuously.'"
  },
  {
    "id": "colloquial_31",
    "emoji": "🤨",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "אתה באמת מסוגל לעשות את זה לבד?",
    "hebrew_niqqud": "אַתָּה בֶּאֱמֶת מְסֻגָּל לַעֲשׂוֹת אֶת זֶה לְבַד?",
    "english": "Are you really capable of doing this alone?",
    "hebrew_tokens": [
      "אתה",
      "באמת",
      "מסוגל",
      "לעשות",
      "את",
      "זה",
      "לבד"
    ],
    "hebrew_tokens_niqqud": [
      "אַתָּה",
      "בֶּאֱמֶת",
      "מְסֻגָּל",
      "לַעֲשׂוֹת",
      "אֶת",
      "זֶה",
      "לְבַד"
    ],
    "english_tokens": [
      "Are you",
      "really",
      "capable of",
      "doing",
      "this",
      "alone"
    ],
    "hebrew_distractors": [
      "היא",
      "אולי",
      "לסיים",
      "אותו",
      "יחד"
    ],
    "hebrew_distractors_niqqud": [
      "הִיא",
      "אוּלַי",
      "לְסַיֵּם",
      "אוֹתוֹ",
      "יַחַד"
    ],
    "english_distractors": [
      "Is she",
      "maybe",
      "finishing",
      "it",
      "together"
    ],
    "notes": "מסוגל ל־ + infinitive = 'capable of doing'; here it carries a slightly challenging, 'you sure?' tone."
  },
  {
    "id": "colloquial_32",
    "emoji": "😶",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "אני פשוט לא מסוגל להאמין שזה קרה.",
    "hebrew_niqqud": "אֲנִי פָּשׁוּט לֹא מְסֻגָּל לְהַאֲמִין שֶׁזֶּה קָרָה.",
    "english": "I just can't believe that this happened.",
    "hebrew_tokens": [
      "אני",
      "פשוט",
      "לא",
      "מסוגל",
      "להאמין",
      "שזה",
      "קרה"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "פָּשׁוּט",
      "לֹא",
      "מְסֻגָּל",
      "לְהַאֲמִין",
      "שֶׁזֶּה",
      "קָרָה"
    ],
    "english_tokens": [
      "I",
      "just",
      "can't",
      "believe",
      "that",
      "this",
      "happened"
    ],
    "hebrew_distractors": [
      "מוכן",
      "עדיין",
      "לזכור",
      "שהוא",
      "נגמר"
    ],
    "hebrew_distractors_niqqud": [
      "מוּכָן",
      "עֲדַיִן",
      "לִזְכֹּר",
      "שֶׁהוּא",
      "נִגְמַר"
    ],
    "english_distractors": [
      "willing",
      "still",
      "remember",
      "that he",
      "ended"
    ],
    "notes": "'לא מסוגל להאמין' is the everyday 'I can't believe it' — מסוגל adds a sense of being emotionally unable, stronger than a plain לא יכול."
  },
  {
    "id": "professional_11",
    "emoji": "🎯",
    "category": "professional",
    "style": null,
    "difficulty": 3,
    "hebrew": "אנחנו מסוגלים לעמוד ביעדים שהוצבו.",
    "hebrew_niqqud": "אֲנַחְנוּ מְסֻגָּלִים לַעֲמֹד בַּיְּעָדִים שֶׁהֻצְּבוּ.",
    "english": "We are able to meet the targets that were set.",
    "hebrew_tokens": [
      "אנחנו",
      "מסוגלים",
      "לעמוד",
      "ביעדים",
      "שהוצבו"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנַחְנוּ",
      "מְסֻגָּלִים",
      "לַעֲמֹד",
      "בַּיְּעָדִים",
      "שֶׁהֻצְּבוּ"
    ],
    "english_tokens": [
      "We",
      "are able to",
      "meet",
      "the targets",
      "that were set"
    ],
    "hebrew_distractors": [
      "מתכוונים",
      "לסיים",
      "במשימות",
      "שבוטלו",
      "מחר"
    ],
    "hebrew_distractors_niqqud": [
      "מִתְכַּוְּנִים",
      "לְסַיֵּם",
      "בִּמְשִׂימוֹת",
      "שֶׁבֻּטְּלוּ",
      "מָחָר"
    ],
    "english_distractors": [
      "intend to",
      "finish",
      "the tasks",
      "that were canceled",
      "tomorrow"
    ],
    "notes": "מסוגלים is the masculine plural; לעמוד ב־ means 'to meet / live up to' a target, deadline, or standard."
  },
  {
    "id": "professional_12",
    "emoji": "📨",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני אעביר את זה לצוות ואחזור אליך עם תשובה.",
    "hebrew_niqqud": "אֲנִי אַעֲבִיר אֶת זֶה לַצֶּוֶת וְאֶחֱזֹר אֵלֶיךָ עִם תְּשׁוּבָה.",
    "english": "I'll pass this on to the team and get back to you with an answer.",
    "hebrew_tokens": [
      "אני",
      "אעביר",
      "את",
      "זה",
      "לצוות",
      "ואחזור",
      "אליך",
      "עם",
      "תשובה"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "אַעֲבִיר",
      "אֶת",
      "זֶה",
      "לַצֶּוֶת",
      "וְאֶחֱזֹר",
      "אֵלֶיךָ",
      "עִם",
      "תְּשׁוּבָה"
    ],
    "english_tokens": [
      "I'll",
      "pass",
      "this",
      "on to",
      "the team",
      "and",
      "get back",
      "to you",
      "with",
      "an answer"
    ],
    "hebrew_distractors": [
      "אמסור",
      "למנהל",
      "הודעה",
      "מחר",
      "שאלה"
    ],
    "hebrew_distractors_niqqud": [
      "אֶמְסֹר",
      "לַמְּנַהֵל",
      "הוֹדָעָה",
      "מָחָר",
      "שָׁאֲלָה"
    ],
    "english_distractors": [
      "I won't",
      "forward",
      "a message",
      "tomorrow",
      "a question"
    ],
    "notes": "אעביר ל־ = pass/forward to; ואחזור אליך = and get back to you — standard email follow-up phrasing."
  },
  {
    "id": "professional_13",
    "emoji": "📅",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "בוא נסגור את הפרטים בשיחה קצרה מחר בבוקר.",
    "hebrew_niqqud": "בּוֹא נִסְגֹּר אֶת הַפְּרָטִים בְּשִׂיחָה קְצָרָה מָחָר בַּבֹּקֶר.",
    "english": "Let's finalize the details in a short call tomorrow morning.",
    "hebrew_tokens": [
      "בוא",
      "נסגור",
      "את",
      "הפרטים",
      "בשיחה",
      "קצרה",
      "מחר",
      "בבוקר"
    ],
    "hebrew_tokens_niqqud": [
      "בּוֹא",
      "נִסְגֹּר",
      "אֶת",
      "הַפְּרָטִים",
      "בְּשִׂיחָה",
      "קְצָרָה",
      "מָחָר",
      "בַּבֹּקֶר"
    ],
    "english_tokens": [
      "Let's",
      "finalize",
      "the details",
      "in",
      "a short",
      "call",
      "tomorrow",
      "morning"
    ],
    "hebrew_distractors": [
      "נדחה",
      "הפגישה",
      "ארוכה",
      "הערב",
      "במייל"
    ],
    "hebrew_distractors_niqqud": [
      "נִדְחָה",
      "הַפְּגִישָׁה",
      "אֲרֻכָּה",
      "הָעֶרֶב",
      "בְּמֵיְל"
    ],
    "english_distractors": [
      "postpone",
      "the meeting",
      "a long",
      "tonight",
      "by email"
    ],
    "notes": "נסגור פרטים (literally 'close details') = finalize/nail down the details; בשיחה = in a call."
  },
  {
    "id": "professional_14",
    "emoji": "📎",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "צירפתי את הקובץ למייל, תגיד לי אם משהו חסר.",
    "hebrew_niqqud": "צֵרַפְתִּי אֶת הַקֹּבֶץ לְמֵיְל, תַּגִּיד לִי אִם מַשֶּׁהוּ חָסֵר.",
    "english": "I attached the file to the email, let me know if anything is missing.",
    "hebrew_tokens": [
      "צירפתי",
      "את",
      "הקובץ",
      "למייל",
      "תגיד",
      "לי",
      "אם",
      "משהו",
      "חסר"
    ],
    "hebrew_tokens_niqqud": [
      "צֵרַפְתִּי",
      "אֶת",
      "הַקֹּבֶץ",
      "לְמֵיְל",
      "תַּגִּיד",
      "לִי",
      "אִם",
      "מַשֶּׁהוּ",
      "חָסֵר"
    ],
    "english_tokens": [
      "I attached",
      "the file",
      "to the email",
      "let me know",
      "if",
      "anything",
      "is missing"
    ],
    "hebrew_distractors": [
      "שלחתי",
      "הקישור",
      "להודעה",
      "תבדוק",
      "נכון"
    ],
    "hebrew_distractors_niqqud": [
      "שָׁלַחְתִּי",
      "הַקִּשּׁוּר",
      "לַהוֹדָעָה",
      "תִּבְדֹּק",
      "נָכוֹן"
    ],
    "english_distractors": [
      "I deleted",
      "the link",
      "to the message",
      "check",
      "is correct"
    ],
    "notes": "צירפתי = I attached; תגיד לי אם = let me know if; חסר here = is missing/lacking."
  },
  {
    "id": "professional_15",
    "emoji": "✏️",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "הלקוח ביקש שינויים, נצטרך לעדכן את ההצעה.",
    "hebrew_niqqud": "הַלָּקוֹחַ בִּקֵּשׁ שִׁנּוּיִים, נִצְטָרֵךְ לְעַדְכֵּן אֶת הַהַצָּעָה.",
    "english": "The client asked for changes, we'll need to update the proposal.",
    "hebrew_tokens": [
      "הלקוח",
      "ביקש",
      "שינויים",
      "נצטרך",
      "לעדכן",
      "את",
      "ההצעה"
    ],
    "hebrew_tokens_niqqud": [
      "הַלָּקוֹחַ",
      "בִּקֵּשׁ",
      "שִׁנּוּיִים",
      "נִצְטָרֵךְ",
      "לְעַדְכֵּן",
      "אֶת",
      "הַהַצָּעָה"
    ],
    "english_tokens": [
      "The client",
      "asked for",
      "changes",
      "we'll need",
      "to update",
      "the proposal"
    ],
    "hebrew_distractors": [
      "המנהל",
      "אישר",
      "תוספות",
      "נוכל",
      "החוזה"
    ],
    "hebrew_distractors_niqqud": [
      "הַמְּנַהֵל",
      "אִשֵּׁר",
      "תּוֹסָפוֹת",
      "נוּכַל",
      "הַחוֹזֶה"
    ],
    "english_distractors": [
      "The manager",
      "approved",
      "additions",
      "we'll be able",
      "the contract"
    ],
    "notes": "הלקוח = the client; ביקש שינויים = asked for changes; ההצעה = the proposal/offer."
  },
  {
    "id": "professional_16",
    "emoji": "🗓️",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני חושב שכדאי לדחות את ההשקה בשבוע.",
    "hebrew_niqqud": "אֲנִי חוֹשֵׁב שֶׁכְּדַאי לִדְחוֹת אֶת הַהַשָּׁקָה בְּשָׁבוּעַ.",
    "english": "I think we should postpone the launch by a week.",
    "hebrew_tokens": [
      "אני",
      "חושב",
      "שכדאי",
      "לדחות",
      "את",
      "ההשקה",
      "בשבוע"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "חוֹשֵׁב",
      "שֶׁכְּדַאי",
      "לִדְחוֹת",
      "אֶת",
      "הַהַשָּׁקָה",
      "בְּשָׁבוּעַ"
    ],
    "english_tokens": [
      "I think",
      "we should",
      "postpone",
      "the launch",
      "by a week"
    ],
    "hebrew_distractors": [
      "מציע",
      "שעדיף",
      "להקדים",
      "הפגישה",
      "בחודש"
    ],
    "hebrew_distractors_niqqud": [
      "מַצִּיעַ",
      "שֶׁעָדִיף",
      "לְהַקְדִּים",
      "הַפְּגִישָׁה",
      "בַּחֹדֶשׁ"
    ],
    "english_distractors": [
      "I suggest",
      "it's better",
      "move up",
      "the meeting",
      "by a month"
    ],
    "notes": "כדאי = it's worthwhile/we should; לדחות = postpone; ההשקה = the launch (of a product)."
  },
  {
    "id": "professional_17",
    "emoji": "🧾",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "נסכם את הנקודות העיקריות ונשלח סיכום לכולם.",
    "hebrew_niqqud": "נְסַכֵּם אֶת הַנְּקֻדּוֹת הָעִקָּרִיּוֹת וְנִשְׁלַח סִכּוּם לְכֻלָּם.",
    "english": "Let's summarize the main points and send a recap to everyone.",
    "hebrew_tokens": [
      "נסכם",
      "את",
      "הנקודות",
      "העיקריות",
      "ונשלח",
      "סיכום",
      "לכולם"
    ],
    "hebrew_tokens_niqqud": [
      "נְסַכֵּם",
      "אֶת",
      "הַנְּקֻדּוֹת",
      "הָעִקָּרִיּוֹת",
      "וְנִשְׁלַח",
      "סִכּוּם",
      "לְכֻלָּם"
    ],
    "english_tokens": [
      "Let's summarize",
      "the main",
      "points",
      "and send",
      "a recap",
      "to everyone"
    ],
    "hebrew_distractors": [
      "נפרט",
      "הסעיפים",
      "המשניות",
      "נדפיס",
      "לצוות"
    ],
    "hebrew_distractors_niqqud": [
      "נְפָרֵט",
      "הַסְּעִיפִים",
      "הַמִּשְׁנָיוֹת",
      "נַדְפִּיס",
      "לַצֶּוֶת"
    ],
    "english_distractors": [
      "Let's expand",
      "the sections",
      "the minor",
      "print",
      "to the team"
    ],
    "notes": "נסכם = let's summarize; הנקודות העיקריות = the main points; סיכום = summary/recap."
  },
  {
    "id": "professional_18",
    "emoji": "⏳",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "תוכל לשלוח לי את הדוח עד סוף היום?",
    "hebrew_niqqud": "תּוּכַל לִשְׁלֹחַ לִי אֶת הַדּוּחַ עַד סוֹף הַיּוֹם?",
    "english": "Could you send me the report by the end of the day?",
    "hebrew_tokens": [
      "תוכל",
      "לשלוח",
      "לי",
      "את",
      "הדוח",
      "עד",
      "סוף",
      "היום"
    ],
    "hebrew_tokens_niqqud": [
      "תּוּכַל",
      "לִשְׁלֹחַ",
      "לִי",
      "אֶת",
      "הַדּוּחַ",
      "עַד",
      "סוֹף",
      "הַיּוֹם"
    ],
    "english_tokens": [
      "Could you",
      "send",
      "me",
      "the report",
      "by",
      "the end of",
      "the day"
    ],
    "hebrew_distractors": [
      "תוכלי",
      "להעביר",
      "הסיכום",
      "תחילת",
      "השבוע"
    ],
    "hebrew_distractors_niqqud": [
      "תּוּכְלִי",
      "לְהַעֲבִיר",
      "הַסִּכּוּם",
      "תְּחִלַּת",
      "הַשָּׁבוּעַ"
    ],
    "english_distractors": [
      "Can she",
      "forward",
      "the summary",
      "the start of",
      "the week"
    ],
    "notes": "תוכל = could you (m.); עד סוף היום = by the end of the day."
  },
  {
    "id": "professional_19",
    "emoji": "📆",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "הישיבה נדחתה, אעדכן אותך בהמשך לגבי מועד חדש.",
    "hebrew_niqqud": "הַיְּשִׁיבָה נִדְחֲתָה, אֲעַדְכֵּן אוֹתְךָ בַּהֶמְשֵׁךְ לְגַבֵּי מוֹעֵד חָדָשׁ.",
    "english": "The meeting was postponed, I'll update you later about a new time.",
    "hebrew_tokens": [
      "הישיבה",
      "נדחתה",
      "אעדכן",
      "אותך",
      "בהמשך",
      "לגבי",
      "מועד",
      "חדש"
    ],
    "hebrew_tokens_niqqud": [
      "הַיְּשִׁיבָה",
      "נִדְחֲתָה",
      "אֲעַדְכֵּן",
      "אוֹתְךָ",
      "בַּהֶמְשֵׁךְ",
      "לְגַבֵּי",
      "מוֹעֵד",
      "חָדָשׁ"
    ],
    "english_tokens": [
      "The meeting",
      "was postponed",
      "I'll update",
      "you",
      "later",
      "about",
      "a new",
      "time"
    ],
    "hebrew_distractors": [
      "השיחה",
      "בוטלה",
      "אשלח",
      "ישן",
      "מקום"
    ],
    "hebrew_distractors_niqqud": [
      "הַשִּׂיחָה",
      "בֻּטְּלָה",
      "אֶשְׁלַח",
      "יָשָׁן",
      "מָקוֹם"
    ],
    "english_distractors": [
      "The call",
      "was canceled",
      "I'll send",
      "old",
      "a place"
    ],
    "notes": "הישיבה נדחתה = the meeting was postponed; מועד = appointed time/date; בהמשך = later on."
  },
  {
    "id": "professional_20",
    "emoji": "💰",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "יש לנו חריגה בתקציב, צריך לבדוק איפה.",
    "hebrew_niqqud": "יֵשׁ לָנוּ חֲרִיגָה בַּתַּקְצִיב, צָרִיךְ לִבְדֹּק אֵיפֹה.",
    "english": "We have an overrun in the budget, we need to check where.",
    "hebrew_tokens": [
      "יש",
      "לנו",
      "חריגה",
      "בתקציב",
      "צריך",
      "לבדוק",
      "איפה"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לָנוּ",
      "חֲרִיגָה",
      "בַּתַּקְצִיב",
      "צָרִיךְ",
      "לִבְדֹּק",
      "אֵיפֹה"
    ],
    "english_tokens": [
      "We have",
      "an overrun",
      "in the budget",
      "we need",
      "to check",
      "where"
    ],
    "hebrew_distractors": [
      "אין",
      "עודף",
      "בלוח",
      "לתקן",
      "מתי"
    ],
    "hebrew_distractors_niqqud": [
      "אֵין",
      "עֹדֶף",
      "בַּלּוּחַ",
      "לְתַקֵּן",
      "מָתַי"
    ],
    "english_distractors": [
      "We don't have",
      "a surplus",
      "in the schedule",
      "to fix",
      "when"
    ],
    "notes": "חריגה בתקציב = budget overrun/deviation; בתקציב from תקציב (budget)."
  },
  {
    "id": "professional_21",
    "emoji": "📝",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני מעדיף לסגור את זה בכתב כדי שיהיה תיעוד.",
    "hebrew_niqqud": "אֲנִי מַעֲדִיף לִסְגֹּר אֶת זֶה בִּכְתָב כְּדֵי שֶׁיִּהְיֶה תִּעוּד.",
    "english": "I prefer to settle this in writing so there's a record.",
    "hebrew_tokens": [
      "אני",
      "מעדיף",
      "לסגור",
      "את",
      "זה",
      "בכתב",
      "כדי",
      "שיהיה",
      "תיעוד"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "מַעֲדִיף",
      "לִסְגֹּר",
      "אֶת",
      "זֶה",
      "בִּכְתָב",
      "כְּדֵי",
      "שֶׁיִּהְיֶה",
      "תִּעוּד"
    ],
    "english_tokens": [
      "I prefer",
      "to settle",
      "this",
      "in writing",
      "so",
      "there's",
      "a record"
    ],
    "hebrew_distractors": [
      "מעדיפה",
      "להשאיר",
      "בעל פה",
      "הסכם",
      "פרוטוקול"
    ],
    "hebrew_distractors_niqqud": [
      "מַעֲדִיפָה",
      "לְהַשְׁאִיר",
      "בְּעַל פֶּה",
      "הֶסְכֵּם",
      "פְּרוֹטוֹקוֹל"
    ],
    "english_distractors": [
      "I'd rather",
      "to leave",
      "out loud",
      "an agreement",
      "a protocol"
    ],
    "notes": "לסגור בכתב = settle in writing; כדי שיהיה תיעוד = so there will be documentation/a record."
  },
  {
    "id": "professional_22",
    "emoji": "🗂️",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "הצוות עמוס השבוע, אפשר להעביר את זה לשבוע הבא?",
    "hebrew_niqqud": "הַצֶּוֶת עָמוּס הַשָּׁבוּעַ, אֶפְשָׁר לְהַעֲבִיר אֶת זֶה לַשָּׁבוּעַ הַבָּא?",
    "english": "The team is busy this week, can we move this to next week?",
    "hebrew_tokens": [
      "הצוות",
      "עמוס",
      "השבוע",
      "אפשר",
      "להעביר",
      "את",
      "זה",
      "לשבוע",
      "הבא"
    ],
    "hebrew_tokens_niqqud": [
      "הַצֶּוֶת",
      "עָמוּס",
      "הַשָּׁבוּעַ",
      "אֶפְשָׁר",
      "לְהַעֲבִיר",
      "אֶת",
      "זֶה",
      "לַשָּׁבוּעַ",
      "הַבָּא"
    ],
    "english_tokens": [
      "The team",
      "is busy",
      "this week",
      "can we",
      "move",
      "this",
      "to",
      "next week"
    ],
    "hebrew_distractors": [
      "המנהל",
      "פנוי",
      "היום",
      "לדחות",
      "לחודש"
    ],
    "hebrew_distractors_niqqud": [
      "הַמְּנַהֵל",
      "פָּנוּי",
      "הַיּוֹם",
      "לִדְחוֹת",
      "לַחֹדֶשׁ"
    ],
    "english_distractors": [
      "The manager",
      "is free",
      "today",
      "postpone",
      "to next month"
    ],
    "notes": "עמוס = busy/loaded; להעביר ל = move/push to; לשבוע הבא = to next week."
  },
  {
    "id": "professional_23",
    "emoji": "✅",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני אקח אחריות על המשימה הזאת ואדווח על ההתקדמות.",
    "hebrew_niqqud": "אֲנִי אֶקַּח אַחְרָיוּת עַל הַמְּשִׂימָה הַזֹּאת וַאֲדַוֵּחַ עַל הַהִתְקַדְּמוּת.",
    "english": "I'll take responsibility for this task and report on the progress.",
    "hebrew_tokens": [
      "אני",
      "אקח",
      "אחריות",
      "על",
      "המשימה",
      "הזאת",
      "ואדווח",
      "על",
      "ההתקדמות"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "אֶקַּח",
      "אַחְרָיוּת",
      "עַל",
      "הַמְּשִׂימָה",
      "הַזֹּאת",
      "וַאֲדַוֵּחַ",
      "עַל",
      "הַהִתְקַדְּמוּת"
    ],
    "english_tokens": [
      "I'll take",
      "responsibility",
      "for",
      "this task",
      "and report",
      "on",
      "the progress"
    ],
    "hebrew_distractors": [
      "אתן",
      "שליטה",
      "המטלה",
      "ואסביר",
      "התהליך"
    ],
    "hebrew_distractors_niqqud": [
      "אִתָּן",
      "שְׁלִיטָה",
      "הַמַּטָּלָה",
      "וְאַסְבִּיר",
      "הַתַּהֲלִיךְ"
    ],
    "english_distractors": [
      "I'll give",
      "control",
      "the chore",
      "and explain",
      "the process"
    ],
    "notes": "אקח אחריות = I'll take responsibility; אדווח על = report on; ההתקדמות = the progress."
  },
  {
    "id": "professional_24",
    "emoji": "🙏",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "תודה על המשוב, ניקח את ההערות לתשומת לבנו.",
    "hebrew_niqqud": "תּוֹדָה עַל הַמָּשׁוֹב, נִקַּח אֶת הַהֶעָרוֹת לִתְשׂוּמֶת לִבֵּנוּ.",
    "english": "Thanks for the feedback, we'll take the comments into consideration.",
    "hebrew_tokens": [
      "תודה",
      "על",
      "המשוב",
      "ניקח",
      "את",
      "ההערות",
      "לתשומת",
      "לבנו"
    ],
    "hebrew_tokens_niqqud": [
      "תּוֹדָה",
      "עַל",
      "הַמָּשׁוֹב",
      "נִקַּח",
      "אֶת",
      "הַהֶעָרוֹת",
      "לִתְשׂוּמֶת",
      "לִבֵּנוּ"
    ],
    "english_tokens": [
      "Thanks",
      "for",
      "the feedback",
      "we'll take",
      "the comments",
      "into consideration"
    ],
    "hebrew_distractors": [
      "סליחה",
      "הביקורת",
      "נדחה",
      "הבקשות",
      "בחשבון"
    ],
    "hebrew_distractors_niqqud": [
      "סְלִיחָה",
      "הַבִּקֹּרֶת",
      "נִדְחָה",
      "הַבַּקָּשׁוֹת",
      "בְּחֶשְׁבּוֹן"
    ],
    "english_distractors": [
      "Sorry",
      "the criticism",
      "we'll reject",
      "the requests",
      "into account"
    ],
    "notes": "המשוב = the feedback; ניקח לתשומת לבנו = we'll take into our consideration/attention."
  },
  {
    "id": "professional_25",
    "emoji": "⚖️",
    "category": "professional",
    "style": null,
    "difficulty": 2,
    "hebrew": "נצטרך אישור מהמחלקה המשפטית לפני שנחתום.",
    "hebrew_niqqud": "נִצְטָרֵךְ אִשּׁוּר מֵהַמַּחְלָקָה הַמִּשְׁפָּטִית לִפְנֵי שֶׁנַּחְתֹּם.",
    "english": "We'll need approval from the legal department before we sign.",
    "hebrew_tokens": [
      "נצטרך",
      "אישור",
      "מהמחלקה",
      "המשפטית",
      "לפני",
      "שנחתום"
    ],
    "hebrew_tokens_niqqud": [
      "נִצְטָרֵךְ",
      "אִשּׁוּר",
      "מֵהַמַּחְלָקָה",
      "הַמִּשְׁפָּטִית",
      "לִפְנֵי",
      "שֶׁנַּחְתֹּם"
    ],
    "english_tokens": [
      "We'll need",
      "approval",
      "from",
      "the legal",
      "department",
      "before",
      "we sign"
    ],
    "hebrew_distractors": [
      "נבקש",
      "חתימה",
      "מההנהלה",
      "הכספית",
      "שנסכם"
    ],
    "hebrew_distractors_niqqud": [
      "נְבַקֵּשׁ",
      "חֲתִימָה",
      "מֵהַהַנְהָלָה",
      "הַכַּסְפִּית",
      "שֶׁנְּסַכֵּם"
    ],
    "english_distractors": [
      "We'll ask for",
      "a signature",
      "from management",
      "the financial",
      "we summarize"
    ],
    "notes": "אישור = approval; המחלקה המשפטית = the legal department; לפני שנחתום = before we sign."
  },
  {
    "id": "formal_20",
    "emoji": "📊",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "יש להתייחס לנתונים בזהירות, שכן המדגם מצומצם.",
    "hebrew_niqqud": "יֵשׁ לְהִתְיַחֵס לַנְּתוּנִים בִּזְהִירוּת, שֶׁכֵּן הַמִּדְגָּם מְצֻמְצָם.",
    "english": "The data should be treated with caution, since the sample is small.",
    "hebrew_tokens": [
      "יש",
      "להתייחס",
      "לנתונים",
      "בזהירות",
      "שכן",
      "המדגם",
      "מצומצם"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לְהִתְיַחֵס",
      "לַנְּתוּנִים",
      "בִּזְהִירוּת",
      "שֶׁכֵּן",
      "הַמִּדְגָּם",
      "מְצֻמְצָם"
    ],
    "english_tokens": [
      "The data",
      "should be treated",
      "with caution",
      "since",
      "the sample",
      "is small"
    ],
    "hebrew_distractors": [
      "אין",
      "להסתמך",
      "למסקנות",
      "בביטחון",
      "גדול"
    ],
    "hebrew_distractors_niqqud": [
      "אֵין",
      "לְהִסְתַּמֵּךְ",
      "לְמַסְקָנוֹת",
      "בְּבִטָּחוֹן",
      "גָּדוֹל"
    ],
    "english_distractors": [
      "one must not",
      "rely",
      "on the conclusions",
      "with confidence",
      "is large"
    ],
    "notes": "יש להתייחס בזהירות = should be treated with caution; שכן = since/because (formal); המדגם מצומצם = the sample is limited/small."
  },
  {
    "id": "formal_21",
    "emoji": "❓",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "המחקר מעלה שאלות נוספות שטרם נמצא להן מענה.",
    "hebrew_niqqud": "הַמֶּחְקָר מַעֲלֶה שְׁאֵלוֹת נוֹסָפוֹת שֶׁטֶּרֶם נִמְצָא לָהֶן מַעֲנֶה.",
    "english": "The research raises further questions that have yet to be answered.",
    "hebrew_tokens": [
      "המחקר",
      "מעלה",
      "שאלות",
      "נוספות",
      "שטרם",
      "נמצא",
      "להן",
      "מענה"
    ],
    "hebrew_tokens_niqqud": [
      "הַמֶּחְקָר",
      "מַעֲלֶה",
      "שְׁאֵלוֹת",
      "נוֹסָפוֹת",
      "שֶׁטֶּרֶם",
      "נִמְצָא",
      "לָהֶן",
      "מַעֲנֶה"
    ],
    "english_tokens": [
      "The research",
      "raises",
      "further",
      "questions",
      "that have yet",
      "to be answered"
    ],
    "hebrew_distractors": [
      "הניסוי",
      "פותר",
      "ישנות",
      "תשובות",
      "פתרון"
    ],
    "hebrew_distractors_niqqud": [
      "הַנִּסּוּי",
      "פּוֹתֵר",
      "יְשָׁנוֹת",
      "תְּשׁוּבוֹת",
      "פִּתְרוֹן"
    ],
    "english_distractors": [
      "The experiment",
      "solves",
      "old",
      "answers",
      "a solution"
    ],
    "notes": "מעלה שאלות = raises questions; שטרם נמצא להן מענה = that have yet to be answered (טרם = not yet, formal)."
  },
  {
    "id": "formal_22",
    "emoji": "🔍",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "ההבחנה בין שני המושגים אינה תמיד ברורה דיה.",
    "hebrew_niqqud": "הַהַבְחָנָה בֵּין שְׁנֵי הַמֻּשָּׂגִים אֵינָהּ תָּמִיד בְּרוּרָה דַּיָּה.",
    "english": "The distinction between the two concepts is not always sufficiently clear.",
    "hebrew_tokens": [
      "ההבחנה",
      "בין",
      "שני",
      "המושגים",
      "אינה",
      "תמיד",
      "ברורה",
      "דיה"
    ],
    "hebrew_tokens_niqqud": [
      "הַהַבְחָנָה",
      "בֵּין",
      "שְׁנֵי",
      "הַמֻּשָּׂגִים",
      "אֵינָהּ",
      "תָּמִיד",
      "בְּרוּרָה",
      "דַּיָּה"
    ],
    "english_tokens": [
      "The distinction",
      "between",
      "the two",
      "concepts",
      "is not",
      "always",
      "sufficiently",
      "clear"
    ],
    "hebrew_distractors": [
      "ההבדל",
      "שלושה",
      "הרעיונות",
      "לעולם",
      "מספיק"
    ],
    "hebrew_distractors_niqqud": [
      "הַהֶבְדֵּל",
      "שְׁלוֹשָׁה",
      "הָרַעֲיוֹנוֹת",
      "לְעוֹלָם",
      "מַסְפִּיק"
    ],
    "english_distractors": [
      "The difference",
      "three",
      "the ideas",
      "never",
      "enough"
    ],
    "notes": "ההבחנה בין = the distinction between; אינה = formal negation (is not, f.); ברורה דיה = sufficiently clear (דיה = enough)."
  },
  {
    "id": "formal_23",
    "emoji": "⚖️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "יש לאזן בין היתרונות לחסרונות בטרם קבלת ההחלטה.",
    "hebrew_niqqud": "יֵשׁ לְאַזֵּן בֵּין הַיִּתְרוֹנוֹת לְחֶסְרוֹנוֹת בְּטֶרֶם קַבָּלַת הַהַחְלָטָה.",
    "english": "One must balance the advantages against the disadvantages before making the decision.",
    "hebrew_tokens": [
      "יש",
      "לאזן",
      "בין",
      "היתרונות",
      "לחסרונות",
      "בטרם",
      "קבלת",
      "ההחלטה"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לְאַזֵּן",
      "בֵּין",
      "הַיִּתְרוֹנוֹת",
      "לְחֶסְרוֹנוֹת",
      "בְּטֶרֶם",
      "קַבָּלַת",
      "הַהַחְלָטָה"
    ],
    "english_tokens": [
      "One must",
      "balance",
      "the advantages",
      "against",
      "the disadvantages",
      "before",
      "making",
      "the decision"
    ],
    "hebrew_distractors": [
      "אפשר",
      "להשוות",
      "הסיכונים",
      "הרווחים",
      "ההצבעה"
    ],
    "hebrew_distractors_niqqud": [
      "אֶפְשָׁר",
      "לְהַשְׁווֹת",
      "הַסִּכּוּנִים",
      "הָרְוָחִים",
      "הַהַצְבָּעָה"
    ],
    "english_distractors": [
      "one can",
      "to compare",
      "the risks",
      "the profits",
      "the vote"
    ],
    "notes": "יש לאזן בין = one must balance between; בטרם = before (formal); קבלת ההחלטה = making the decision (literally 'receiving the decision')."
  },
  {
    "id": "formal_24",
    "emoji": "🧩",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "הטענה מבוססת על ראיות חלקיות בלבד, ולכן יש לבחון אותה מחדש.",
    "hebrew_niqqud": "הַטַּעֲנָה מְבֻסֶּסֶת עַל רְאָיוֹת חֶלְקִיּוֹת בִּלְבַד, וְלָכֵן יֵשׁ לִבְחֹן אוֹתָהּ מֵחָדָשׁ.",
    "english": "The claim rests on partial evidence only, and therefore must be reexamined.",
    "hebrew_tokens": [
      "הטענה",
      "מבוססת",
      "על",
      "ראיות",
      "חלקיות",
      "בלבד",
      "ולכן",
      "יש",
      "לבחון",
      "אותה",
      "מחדש"
    ],
    "hebrew_tokens_niqqud": [
      "הַטַּעֲנָה",
      "מְבֻסֶּסֶת",
      "עַל",
      "רְאָיוֹת",
      "חֶלְקִיּוֹת",
      "בִּלְבַד",
      "וְלָכֵן",
      "יֵשׁ",
      "לִבְחֹן",
      "אוֹתָהּ",
      "מֵחָדָשׁ"
    ],
    "english_tokens": [
      "The claim",
      "rests on",
      "partial",
      "evidence",
      "only",
      "and therefore",
      "must be reexamined"
    ],
    "hebrew_distractors": [
      "ההשערה",
      "נשענת",
      "מלאות",
      "עדויות",
      "לאשר"
    ],
    "hebrew_distractors_niqqud": [
      "הַהַשְׁעָרָה",
      "נִשְׁעֶנֶת",
      "מְלֵאוּת",
      "עֵדוּיוֹת",
      "לְאַשֵּׁר"
    ],
    "english_distractors": [
      "The hypothesis",
      "leans on",
      "full",
      "testimonies",
      "be confirmed"
    ],
    "notes": "הטענה מבוססת על = the claim is based on; ראיות חלקיות = partial evidence; יש לבחון מחדש = must be reexamined."
  },
  {
    "id": "formal_25",
    "emoji": "📈",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "ניתן לראות בכך עדות למגמה רחבה יותר.",
    "hebrew_niqqud": "נִתָּן לִרְאוֹת בְּכָךְ עֵדוּת לִמְגַמָּה רְחָבָה יוֹתֵר.",
    "english": "This can be seen as evidence of a broader trend.",
    "hebrew_tokens": [
      "ניתן",
      "לראות",
      "בכך",
      "עדות",
      "למגמה",
      "רחבה",
      "יותר"
    ],
    "hebrew_tokens_niqqud": [
      "נִתָּן",
      "לִרְאוֹת",
      "בְּכָךְ",
      "עֵדוּת",
      "לִמְגַמָּה",
      "רְחָבָה",
      "יוֹתֵר"
    ],
    "english_tokens": [
      "This",
      "can be seen",
      "as evidence",
      "of",
      "a broader",
      "trend"
    ],
    "hebrew_distractors": [
      "אפשר",
      "להבחין",
      "סימן",
      "לתופעה",
      "צרה"
    ],
    "hebrew_distractors_niqqud": [
      "אֶפְשָׁר",
      "לְהַבְחִין",
      "סִימָן",
      "לַתּוֹפָעָה",
      "צָרָה"
    ],
    "english_distractors": [
      "it's possible",
      "to notice",
      "a sign",
      "of a phenomenon",
      "narrower"
    ],
    "notes": "ניתן לראות בכך = this can be seen as (literally 'one can see in this'); מגמה = trend; רחבה יותר = broader."
  },
  {
    "id": "formal_26",
    "emoji": "🗣️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "המסקנות אינן חד-משמעיות, ויש מקום לפרשנויות שונות.",
    "hebrew_niqqud": "הַמַּסְקָנוֹת אֵינָן חַד-מַשְׁמָעִיּוֹת, וְיֵשׁ מָקוֹם לְפַרְשָׁנוּיוֹת שׁוֹנוֹת.",
    "english": "The conclusions are not unequivocal, and there is room for differing interpretations.",
    "hebrew_tokens": [
      "המסקנות",
      "אינן",
      "חד-משמעיות",
      "ויש",
      "מקום",
      "לפרשנויות",
      "שונות"
    ],
    "hebrew_tokens_niqqud": [
      "הַמַּסְקָנוֹת",
      "אֵינָן",
      "חַד-מַשְׁמָעִיּוֹת",
      "וְיֵשׁ",
      "מָקוֹם",
      "לְפַרְשָׁנוּיוֹת",
      "שׁוֹנוֹת"
    ],
    "english_tokens": [
      "The conclusions",
      "are not",
      "unequivocal",
      "and there is",
      "room",
      "for",
      "differing",
      "interpretations"
    ],
    "hebrew_distractors": [
      "הממצאים",
      "הינן",
      "ברורות",
      "אין",
      "דומות"
    ],
    "hebrew_distractors_niqqud": [
      "הַמִּמְצָאִים",
      "הִנָּן",
      "בְּרוּרוֹת",
      "אֵין",
      "דּוֹמוֹת"
    ],
    "english_distractors": [
      "The findings",
      "are",
      "clear",
      "there is no",
      "similar"
    ],
    "notes": "אינן = formal negation (are not, f.pl.); חד-משמעיות = unequivocal (single hyphenated compound); פרשנויות שונות = differing interpretations."
  },
  {
    "id": "formal_27",
    "emoji": "⚗️",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "השפעת הגורם הזה על התוצאה עדיין שנויה במחלוקת.",
    "hebrew_niqqud": "הַשְׁפָּעַת הַגּוֹרֵם הַזֶּה עַל הַתּוֹצָאָה עֲדַיִן שְׁנוּיָה בְּמַחְלֹקֶת.",
    "english": "The effect of this factor on the outcome is still disputed.",
    "hebrew_tokens": [
      "השפעת",
      "הגורם",
      "הזה",
      "על",
      "התוצאה",
      "עדיין",
      "שנויה",
      "במחלוקת"
    ],
    "hebrew_tokens_niqqud": [
      "הַשְׁפָּעַת",
      "הַגּוֹרֵם",
      "הַזֶּה",
      "עַל",
      "הַתּוֹצָאָה",
      "עֲדַיִן",
      "שְׁנוּיָה",
      "בְּמַחְלֹקֶת"
    ],
    "english_tokens": [
      "The effect",
      "of this",
      "factor",
      "on",
      "the outcome",
      "is still",
      "disputed"
    ],
    "hebrew_distractors": [
      "תרומת",
      "הנתון",
      "הסיבה",
      "כבר",
      "מוסכמת"
    ],
    "hebrew_distractors_niqqud": [
      "תְּרוּמַת",
      "הַנָּתוּן",
      "הַסִּבָּה",
      "כְּבָר",
      "מֻסְכֶּמֶת"
    ],
    "english_distractors": [
      "The contribution",
      "the datum",
      "the cause",
      "already",
      "agreed"
    ],
    "notes": "השפעת הגורם = the effect of the factor; שנוי/שנויה במחלוקת = (a matter that is) disputed/controversial."
  },
  {
    "id": "formal_28",
    "emoji": "🧭",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "יש להפריד בין העמדה האישית לבין הניתוח האובייקטיבי.",
    "hebrew_niqqud": "יֵשׁ לְהַפְרִיד בֵּין הָעֶמְדָּה הָאִישִׁית לְבֵין הַנִּתּוּחַ הָאוֹבְּיֶקְטִיבִי.",
    "english": "One must separate the personal stance from the objective analysis.",
    "hebrew_tokens": [
      "יש",
      "להפריד",
      "בין",
      "העמדה",
      "האישית",
      "לבין",
      "הניתוח",
      "האובייקטיבי"
    ],
    "hebrew_tokens_niqqud": [
      "יֵשׁ",
      "לְהַפְרִיד",
      "בֵּין",
      "הָעֶמְדָּה",
      "הָאִישִׁית",
      "לְבֵין",
      "הַנִּתּוּחַ",
      "הָאוֹבְּיֶקְטִיבִי"
    ],
    "english_tokens": [
      "One must",
      "separate",
      "the personal",
      "stance",
      "from",
      "the objective",
      "analysis"
    ],
    "hebrew_distractors": [
      "אפשר",
      "לחבר",
      "הדעה",
      "המקצועית",
      "הסובייקטיבי"
    ],
    "hebrew_distractors_niqqud": [
      "אֶפְשָׁר",
      "לְחַבֵּר",
      "הַדֵּעָה",
      "הַמִּקְצוֹעִית",
      "הַסּוּבְּיֶקְטִיבִי"
    ],
    "english_distractors": [
      "one can",
      "to combine",
      "the opinion",
      "the professional",
      "the subjective"
    ],
    "notes": "יש להפריד בין... לבין = one must separate between X and Y; העמדה האישית = the personal stance/position; אובייקטיבי = objective."
  },
  {
    "id": "everyday_24",
    "emoji": "🪟",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אפשר לשבת ליד החלון?",
    "hebrew_niqqud": "אֶפְשָׁר לָשֶׁבֶת לְיַד הַחַלּוֹן?",
    "english": "Can we sit by the window?",
    "hebrew_tokens": [
      "אפשר",
      "לשבת",
      "ליד",
      "החלון"
    ],
    "hebrew_tokens_niqqud": [
      "אֶפְשָׁר",
      "לָשֶׁבֶת",
      "לְיַד",
      "הַחַלּוֹן"
    ],
    "english_tokens": [
      "Can we",
      "sit",
      "by",
      "the window"
    ],
    "hebrew_distractors": [
      "אסור",
      "לעמוד",
      "מול",
      "הדלת",
      "בחוץ"
    ],
    "hebrew_distractors_niqqud": [
      "אָסוּר",
      "לַעֲמֹד",
      "מוּל",
      "הַדֶּלֶת",
      "בַּחוּץ"
    ],
    "english_distractors": [
      "We can't",
      "stand",
      "across from",
      "the door",
      "outside"
    ],
    "notes": "אפשר ל = can we / is it possible to; ליד = next to/by; החלון = the window."
  },
  {
    "id": "everyday_25",
    "emoji": "☕",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "נגמר לי הקפה, אני קופץ לסופר.",
    "hebrew_niqqud": "נִגְמַר לִי הַקָּפֶה, אֲנִי קוֹפֵץ לַסּוּפֶּר.",
    "english": "I'm out of coffee, I'm popping over to the supermarket.",
    "hebrew_tokens": [
      "נגמר",
      "לי",
      "הקפה",
      "אני",
      "קופץ",
      "לסופר"
    ],
    "hebrew_tokens_niqqud": [
      "נִגְמַר",
      "לִי",
      "הַקָּפֶה",
      "אֲנִי",
      "קוֹפֵץ",
      "לַסּוּפֶּר"
    ],
    "english_tokens": [
      "I'm out of",
      "coffee",
      "I'm",
      "popping over",
      "to the supermarket"
    ],
    "hebrew_distractors": [
      "נשאר",
      "הסוכר",
      "היא",
      "רצה",
      "הביתה"
    ],
    "hebrew_distractors_niqqud": [
      "נִשְׁאַר",
      "הַסֻּכָּר",
      "הִיא",
      "רָצָה",
      "הַבַּיְתָה"
    ],
    "english_distractors": [
      "I still have",
      "sugar",
      "she",
      "running",
      "home"
    ],
    "notes": "נגמר לי = I've run out of; קופץ ל = popping over to (קופץ literally 'jumping'); לסופר = to the supermarket."
  },
  {
    "id": "everyday_26",
    "emoji": "💡",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "תכבה את האור לפני שאתה יוצא.",
    "hebrew_niqqud": "תְּכַבֶּה אֶת הָאוֹר לִפְנֵי שֶׁאַתָּה יוֹצֵא.",
    "english": "Turn off the light before you leave.",
    "hebrew_tokens": [
      "תכבה",
      "את",
      "האור",
      "לפני",
      "שאתה",
      "יוצא"
    ],
    "hebrew_tokens_niqqud": [
      "תְּכַבֶּה",
      "אֶת",
      "הָאוֹר",
      "לִפְנֵי",
      "שֶׁאַתָּה",
      "יוֹצֵא"
    ],
    "english_tokens": [
      "Turn off",
      "the light",
      "before",
      "you",
      "leave"
    ],
    "hebrew_distractors": [
      "תדליק",
      "המזגן",
      "אחרי",
      "שאני",
      "נכנס"
    ],
    "hebrew_distractors_niqqud": [
      "תַּדְלִיק",
      "הַמַּזְגָן",
      "אַחֲרֵי",
      "שֶׁאֲנִי",
      "נִכְנַס"
    ],
    "english_distractors": [
      "Turn on",
      "the AC",
      "after",
      "I",
      "enter"
    ],
    "notes": "תכבה = turn off (imperative m.); את האור = the light; לפני שאתה יוצא = before you leave."
  },
  {
    "id": "everyday_27",
    "emoji": "🍽️",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "הילדים רעבים, מתי האוכל מוכן?",
    "hebrew_niqqud": "הַיְּלָדִים רְעֵבִים, מָתַי הָאֹכֶל מוּכָן?",
    "english": "The kids are hungry, when is the food ready?",
    "hebrew_tokens": [
      "הילדים",
      "רעבים",
      "מתי",
      "האוכל",
      "מוכן"
    ],
    "hebrew_tokens_niqqud": [
      "הַיְּלָדִים",
      "רְעֵבִים",
      "מָתַי",
      "הָאֹכֶל",
      "מוּכָן"
    ],
    "english_tokens": [
      "The kids",
      "are hungry",
      "when",
      "is",
      "the food",
      "ready"
    ],
    "hebrew_distractors": [
      "ההורים",
      "עייפים",
      "איפה",
      "הקינוח",
      "חם"
    ],
    "hebrew_distractors_niqqud": [
      "הַהוֹרִים",
      "עֲיֵפִים",
      "אֵיפֹה",
      "הַקִּנּוּחַ",
      "חַם"
    ],
    "english_distractors": [
      "The parents",
      "are tired",
      "where",
      "the dessert",
      "hot"
    ],
    "notes": "הילדים רעבים = the kids are hungry; מתי = when; מוכן = ready (m.)."
  },
  {
    "id": "everyday_28",
    "emoji": "🌧️",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "שכחתי את המטרייה והתחיל לרדת גשם.",
    "hebrew_niqqud": "שָׁכַחְתִּי אֶת הַמִּטְרִיָּה וְהִתְחִיל לָרֶדֶת גֶּשֶׁם.",
    "english": "I forgot my umbrella and it started to rain.",
    "hebrew_tokens": [
      "שכחתי",
      "את",
      "המטרייה",
      "והתחיל",
      "לרדת",
      "גשם"
    ],
    "hebrew_tokens_niqqud": [
      "שָׁכַחְתִּי",
      "אֶת",
      "הַמִּטְרִיָּה",
      "וְהִתְחִיל",
      "לָרֶדֶת",
      "גֶּשֶׁם"
    ],
    "english_tokens": [
      "I forgot",
      "my umbrella",
      "and",
      "it started",
      "to rain"
    ],
    "hebrew_distractors": [
      "לקחתי",
      "המעיל",
      "והפסיק",
      "לבוא",
      "שלג"
    ],
    "hebrew_distractors_niqqud": [
      "לָקַחְתִּי",
      "הַמְּעִיל",
      "וְהִפְסִיק",
      "לָבוֹא",
      "שֶׁלֶג"
    ],
    "english_distractors": [
      "I took",
      "my coat",
      "and it stopped",
      "to come",
      "snow"
    ],
    "notes": "שכחתי = I forgot; המטרייה = the umbrella; התחיל לרדת גשם = it started to rain (literally 'rain started to fall')."
  },
  {
    "id": "everyday_29",
    "emoji": "🤫",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "הוא ישן, אפשר לדבר יותר בשקט?",
    "hebrew_niqqud": "הוּא יָשַׁן, אֶפְשָׁר לְדַבֵּר יוֹתֵר בְּשֶׁקֶט?",
    "english": "He's sleeping, can we talk more quietly?",
    "hebrew_tokens": [
      "הוא",
      "ישן",
      "אפשר",
      "לדבר",
      "יותר",
      "בשקט"
    ],
    "hebrew_tokens_niqqud": [
      "הוּא",
      "יָשַׁן",
      "אֶפְשָׁר",
      "לְדַבֵּר",
      "יוֹתֵר",
      "בְּשֶׁקֶט"
    ],
    "english_tokens": [
      "He's sleeping",
      "can we",
      "talk",
      "more",
      "quietly"
    ],
    "hebrew_distractors": [
      "היא",
      "ערה",
      "לצעוק",
      "פחות",
      "בקול"
    ],
    "hebrew_distractors_niqqud": [
      "הִיא",
      "עֵרָה",
      "לִצְעֹק",
      "פָּחוֹת",
      "בְּקוֹל"
    ],
    "english_distractors": [
      "She's awake",
      "shout",
      "less",
      "loudly",
      "outside"
    ],
    "notes": "הוא ישן = he's sleeping; אפשר לדבר = can we talk; יותר בשקט = more quietly."
  },
  {
    "id": "everyday_30",
    "emoji": "🦷",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "צריך לקבוע תור לרופא שיניים.",
    "hebrew_niqqud": "צָרִיךְ לִקְבֹּעַ תּוֹר לְרוֹפֵא שִׁנַּיִם.",
    "english": "We need to make a dentist appointment.",
    "hebrew_tokens": [
      "צריך",
      "לקבוע",
      "תור",
      "לרופא שיניים"
    ],
    "hebrew_tokens_niqqud": [
      "צָרִיךְ",
      "לִקְבֹּעַ",
      "תּוֹר",
      "לְרוֹפֵא שִׁנַּיִם"
    ],
    "english_tokens": [
      "We need",
      "to make",
      "a dentist",
      "appointment"
    ],
    "hebrew_distractors": [
      "אפשר",
      "לבטל",
      "פגישה",
      "לרופא עיניים",
      "מחר"
    ],
    "hebrew_distractors_niqqud": [
      "אֶפְשָׁר",
      "לְבַטֵּל",
      "פְּגִישָׁה",
      "לְרוֹפֵא עֵינַיִם",
      "מָחָר"
    ],
    "english_distractors": [
      "I can",
      "to cancel",
      "a meeting",
      "an eye doctor",
      "tomorrow"
    ],
    "notes": "צריך לקבוע תור = we need to make/schedule an appointment; רופא שיניים = dentist (kept as one compound chip)."
  },
  {
    "id": "everyday_31",
    "emoji": "🌅",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "אצטרך לקום מוקדם מחר בבוקר.",
    "hebrew_niqqud": "אֶצְטָרֵךְ לָקוּם מֻקְדָּם מָחָר בַּבֹּקֶר.",
    "english": "I'll need to get up early tomorrow morning.",
    "hebrew_tokens": [
      "אצטרך",
      "לקום",
      "מוקדם",
      "מחר",
      "בבוקר"
    ],
    "hebrew_tokens_niqqud": [
      "אֶצְטָרֵךְ",
      "לָקוּם",
      "מֻקְדָּם",
      "מָחָר",
      "בַּבֹּקֶר"
    ],
    "english_tokens": [
      "I'll need",
      "to get up",
      "early",
      "tomorrow",
      "morning"
    ],
    "hebrew_distractors": [
      "קמתי",
      "מאוחר",
      "אתמול",
      "בערב",
      "ללכת"
    ],
    "hebrew_distractors_niqqud": [
      "קַמְתִּי",
      "מְאֻחָר",
      "אֶתְמוֹל",
      "בָּעֶרֶב",
      "לָלֶכֶת"
    ],
    "english_distractors": [
      "I got up",
      "to leave",
      "late",
      "yesterday",
      "evening"
    ],
    "notes": "אצטרך is the future of the suppletive 'need' paradigm — present צריך, past היה צריך, future אצטרך (from להצטרך). Like צריך, it takes an infinitive: אצטרך לקום = I'll have to get up."
  },
  {
    "id": "everyday_32",
    "emoji": "🔑",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אני לא זוכר איפה שמתי את המפתחות.",
    "hebrew_niqqud": "אֲנִי לֹא זוֹכֵר אֵיפֹה שַׂמְתִּי אֶת הַמַּפְתְּחוֹת.",
    "english": "I don't remember where I put the keys.",
    "hebrew_tokens": [
      "אני",
      "לא",
      "זוכר",
      "איפה",
      "שמתי",
      "את",
      "המפתחות"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "לֹא",
      "זוֹכֵר",
      "אֵיפֹה",
      "שַׂמְתִּי",
      "אֶת",
      "הַמַּפְתְּחוֹת"
    ],
    "english_tokens": [
      "I",
      "don't",
      "remember",
      "where",
      "I put",
      "the keys"
    ],
    "hebrew_alternates": [
      {
        "text": "אני לא זוכרת איפה שמתי את המפתחות.",
        "text_niqqud": "אֲנִי לֹא זוֹכֶרֶת אֵיפֹה שַׂמְתִּי אֶת הַמַּפְתְּחוֹת.",
        "tokens": [
          "אני",
          "לא",
          "זוכרת",
          "איפה",
          "שמתי",
          "את",
          "המפתחות"
        ],
        "tokens_niqqud": [
          "אֲנִי",
          "לֹא",
          "זוֹכֶרֶת",
          "אֵיפֹה",
          "שַׂמְתִּי",
          "אֶת",
          "הַמַּפְתְּחוֹת"
        ]
      }
    ],
    "hebrew_distractors": [
      "שכחתי",
      "מתי",
      "הארנק",
      "לקחתי",
      "הדלת"
    ],
    "hebrew_distractors_niqqud": [
      "שָׁכַחְתִּי",
      "מָתַי",
      "הָאַרְנָק",
      "לָקַחְתִּי",
      "הַדֶּלֶת"
    ],
    "english_distractors": [
      "I forgot",
      "when",
      "the wallet",
      "I took",
      "the door"
    ],
    "notes": "זוכר agrees with the speaker — a woman says זוכרת (accepted as an alternate answer). שמתי (I put) is the past of לשים; איפה asks 'where', while the distractor מתי asks 'when'."
  },
  {
    "id": "colloquial_33",
    "emoji": "🚗",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "הוא מוכר את האוטו כי הוא צריך כסף.",
    "hebrew_niqqud": "הוּא מוֹכֵר אֶת הָאוֹטוֹ כִּי הוּא צָרִיךְ כֶּסֶף.",
    "english": "He's selling the car because he needs money.",
    "hebrew_tokens": [
      "הוא",
      "מוכר",
      "את",
      "האוטו",
      "כי",
      "הוא",
      "צריך",
      "כסף"
    ],
    "hebrew_tokens_niqqud": [
      "הוּא",
      "מוֹכֵר",
      "אֶת",
      "הָאוֹטוֹ",
      "כִּי",
      "הוּא",
      "צָרִיךְ",
      "כֶּסֶף"
    ],
    "english_tokens": [
      "He's",
      "selling",
      "the car",
      "because",
      "he needs",
      "money"
    ],
    "hebrew_distractors": [
      "קונה",
      "האופניים",
      "אבל",
      "רוצה",
      "זמן"
    ],
    "hebrew_distractors_niqqud": [
      "קוֹנֶה",
      "הָאוֹפַנַּיִם",
      "אֲבָל",
      "רוֹצֶה",
      "זְמַן"
    ],
    "english_distractors": [
      "He's buying",
      "the bike",
      "but",
      "he wants",
      "time"
    ],
    "notes": "מוכר (sells) vs the opposite distractor קונה (buys). צריך כסף = needs money — the present of 'need' is the modal צריך; האוטו is the everyday word for car (המכונית is more formal)."
  },
  {
    "id": "everyday_33",
    "emoji": "💳",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אפשר לשלם בכרטיס או רק במזומן?",
    "hebrew_niqqud": "אֶפְשָׁר לְשַׁלֵּם בְּכַרְטִיס אוֹ רַק בִּמְזֻמָּן?",
    "english": "Can I pay by card, or only in cash?",
    "hebrew_tokens": [
      "אפשר",
      "לשלם",
      "בכרטיס",
      "או",
      "רק",
      "במזומן"
    ],
    "hebrew_tokens_niqqud": [
      "אֶפְשָׁר",
      "לְשַׁלֵּם",
      "בְּכַרְטִיס",
      "אוֹ",
      "רַק",
      "בִּמְזֻמָּן"
    ],
    "english_tokens": [
      "Can I pay",
      "by card",
      "or",
      "only",
      "in cash"
    ],
    "hebrew_distractors": [
      "לקנות",
      "בצ׳ק",
      "גם",
      "בחנות",
      "לחתום"
    ],
    "hebrew_distractors_niqqud": [
      "לִקְנוֹת",
      "בְּצֶ׳ק",
      "גַּם",
      "בַּחֲנוּת",
      "לַחְתֹּם"
    ],
    "english_distractors": [
      "Can I buy",
      "by check",
      "also",
      "in the store",
      "to sign"
    ],
    "notes": "לשלם (pi'el, to pay): שילמתי, אשלם. אפשר + infinitive is the standard 'can I…?' pattern; בכרטיס = by card, במזומן = in cash."
  },
  {
    "id": "everyday_34",
    "emoji": "🏷️",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "כל לקוח חדש מקבל הנחה של עשרה אחוזים.",
    "hebrew_niqqud": "כָּל לָקוֹחַ חָדָשׁ מְקַבֵּל הֲנָחָה שֶׁל עֲשָׂרָה אֲחוּזִים.",
    "english": "Every new customer gets a ten percent discount.",
    "hebrew_tokens": [
      "כל",
      "לקוח",
      "חדש",
      "מקבל",
      "הנחה",
      "של",
      "עשרה",
      "אחוזים"
    ],
    "hebrew_tokens_niqqud": [
      "כָּל",
      "לָקוֹחַ",
      "חָדָשׁ",
      "מְקַבֵּל",
      "הֲנָחָה",
      "שֶׁל",
      "עֲשָׂרָה",
      "אֲחוּזִים"
    ],
    "english_tokens": [
      "Every",
      "new customer",
      "gets",
      "a ten percent",
      "discount"
    ],
    "hebrew_distractors": [
      "ותיק",
      "נותן",
      "מתנה",
      "עשרים",
      "משלם"
    ],
    "hebrew_distractors_niqqud": [
      "וָתִיק",
      "נוֹתֵן",
      "מַתָּנָה",
      "עֶשְׂרִים",
      "מְשַׁלֵּם"
    ],
    "english_distractors": [
      "a returning customer",
      "gives",
      "a gift",
      "twenty",
      "pays"
    ],
    "notes": "מקבל (pi'el ק-ב-ל, receives/gets) vs the distractors נותן (gives) and משלם (pays). הנחה here = discount; in formal writing the same word means 'assumption'. עשרה אחוזים = ten percent."
  },
  {
    "id": "everyday_35",
    "emoji": "🏠",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "אני מחפש דירה קרובה למרכז העיר.",
    "hebrew_niqqud": "אֲנִי מְחַפֵּשׂ דִּירָה קְרוֹבָה לְמֶרְכַּז הָעִיר.",
    "english": "I'm looking for an apartment close to the city center.",
    "hebrew_tokens": [
      "אני",
      "מחפש",
      "דירה",
      "קרובה",
      "למרכז",
      "העיר"
    ],
    "hebrew_tokens_niqqud": [
      "אֲנִי",
      "מְחַפֵּשׂ",
      "דִּירָה",
      "קְרוֹבָה",
      "לְמֶרְכַּז",
      "הָעִיר"
    ],
    "english_tokens": [
      "I'm looking for",
      "an apartment",
      "close to",
      "the city center"
    ],
    "hebrew_alternates": [
      {
        "text": "אני מחפשת דירה קרובה למרכז העיר.",
        "text_niqqud": "אֲנִי מְחַפֶּשֶׂת דִּירָה קְרוֹבָה לְמֶרְכַּז הָעִיר.",
        "tokens": [
          "אני",
          "מחפשת",
          "דירה",
          "קרובה",
          "למרכז",
          "העיר"
        ],
        "tokens_niqqud": [
          "אֲנִי",
          "מְחַפֶּשֶׂת",
          "דִּירָה",
          "קְרוֹבָה",
          "לְמֶרְכַּז",
          "הָעִיר"
        ]
      }
    ],
    "hebrew_distractors": [
      "רחוקה",
      "בית",
      "גדולה",
      "לתחנה",
      "הכפר"
    ],
    "hebrew_distractors_niqqud": [
      "רְחוֹקָה",
      "בַּיִת",
      "גְּדוֹלָה",
      "לַתַּחֲנָה",
      "הַכְּפָר"
    ],
    "english_distractors": [
      "I'm renting out",
      "a house",
      "far from",
      "the station",
      "the village"
    ],
    "notes": "מחפש (pi'el, to look for) takes a direct object — no preposition like English 'for'. A woman says מחפשת (accepted as an alternate). קרובה agrees with דירה (fem.); רחוקה (far) is the opposite distractor."
  },
  {
    "id": "colloquial_34",
    "emoji": "🎨",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "אחותי עשתה קעקוע קטן על היד.",
    "hebrew_niqqud": "אֲחוֹתִי עָשְׂתָה קַעֲקוּעַ קָטָן עַל הַיָּד.",
    "english": "My sister got a small tattoo on her hand.",
    "hebrew_tokens": [
      "אחותי",
      "עשתה",
      "קעקוע",
      "קטן",
      "על",
      "היד"
    ],
    "hebrew_tokens_niqqud": [
      "אֲחוֹתִי",
      "עָשְׂתָה",
      "קַעֲקוּעַ",
      "קָטָן",
      "עַל",
      "הַיָּד"
    ],
    "english_tokens": [
      "My sister",
      "got",
      "a small",
      "tattoo",
      "on her hand"
    ],
    "hebrew_distractors": [
      "אחי",
      "ציור",
      "גדול",
      "הרגל",
      "הורידה"
    ],
    "hebrew_distractors_niqqud": [
      "אָחִי",
      "צִיּוּר",
      "גָּדוֹל",
      "הָרֶגֶל",
      "הוֹרִידָה"
    ],
    "english_distractors": [
      "My brother",
      "removed",
      "a drawing",
      "big",
      "on her leg"
    ],
    "notes": "In Hebrew you 'do' a tattoo: עשתה קעקוע = got a tattoo (lit. made). קעקוע is the everyday noun; the formal dictionary term is כתובת קעקע."
  },
  {
    "id": "everyday_36",
    "emoji": "🍦",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "בקיץ אנחנו אוכלים גלידה בחוץ.",
    "hebrew_niqqud": "בַּקַּיִץ אֲנַחְנוּ אוֹכְלִים גְּלִידָה בַּחוּץ.",
    "english": "In the summer we eat ice cream outside.",
    "hebrew_tokens": [
      "בקיץ",
      "אנחנו",
      "אוכלים",
      "גלידה",
      "בחוץ"
    ],
    "hebrew_tokens_niqqud": [
      "בַּקַּיִץ",
      "אֲנַחְנוּ",
      "אוֹכְלִים",
      "גְּלִידָה",
      "בַּחוּץ"
    ],
    "english_tokens": [
      "In the summer",
      "we",
      "eat",
      "ice cream",
      "outside"
    ],
    "hebrew_distractors": [
      "בחורף",
      "הם",
      "שותים",
      "מרק",
      "בבית"
    ],
    "hebrew_distractors_niqqud": [
      "בַּחֹרֶף",
      "הֵם",
      "שׁוֹתִים",
      "מָרָק",
      "בַּבַּיִת"
    ],
    "english_distractors": [
      "In the winter",
      "they",
      "drink",
      "soup",
      "at home"
    ],
    "notes": "Final-form practice: ץ appears twice, in קיץ (summer) and חוץ (outside). The seasonal opposites בקיץ/בחורף and בחוץ/בבית are the distractor pairs."
  },
  {
    "id": "colloquial_35",
    "emoji": "💸",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "בסוף החודש אין לי כסף.",
    "hebrew_niqqud": "בְּסוֹף הַחֹדֶשׁ אֵין לִי כֶּסֶף.",
    "english": "At the end of the month I have no money.",
    "hebrew_tokens": [
      "בסוף",
      "החודש",
      "אין",
      "לי",
      "כסף"
    ],
    "hebrew_tokens_niqqud": [
      "בְּסוֹף",
      "הַחֹדֶשׁ",
      "אֵין",
      "לִי",
      "כֶּסֶף"
    ],
    "english_tokens": [
      "At the end",
      "of the month",
      "I have",
      "no money"
    ],
    "hebrew_distractors": [
      "בתחילת",
      "השבוע",
      "יש",
      "לך",
      "זמן"
    ],
    "hebrew_distractors_niqqud": [
      "בִּתְחִלַּת",
      "הַשָּׁבוּעַ",
      "יֵשׁ",
      "לְךָ",
      "זְמַן"
    ],
    "english_distractors": [
      "At the start",
      "of the week",
      "you have",
      "plenty of money",
      "time"
    ],
    "notes": "אין לי = I don't have (lit. 'there isn't to me') — the standard possession pattern, opposite יש לי. Final-form practice: ף in both סוף (end) and כסף (money)."
  },
  {
    "id": "colloquial_36",
    "emoji": "😺",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "היא סיפרה לי סיפור מצחיק על החתול שלה.",
    "hebrew_niqqud": "הִיא סִפְּרָה לִי סִפּוּר מַצְחִיק עַל הֶחָתוּל שֶׁלָּהּ.",
    "english": "She told me a funny story about her cat.",
    "hebrew_tokens": [
      "היא",
      "סיפרה",
      "לי",
      "סיפור",
      "מצחיק",
      "על",
      "החתול",
      "שלה"
    ],
    "hebrew_tokens_niqqud": [
      "הִיא",
      "סִפְּרָה",
      "לִי",
      "סִפּוּר",
      "מַצְחִיק",
      "עַל",
      "הֶחָתוּל",
      "שֶׁלָּהּ"
    ],
    "english_tokens": [
      "She told",
      "me",
      "a funny",
      "story",
      "about",
      "her cat"
    ],
    "hebrew_distractors": [
      "הוא",
      "שאלה",
      "עצוב",
      "שיר",
      "הכלב"
    ],
    "hebrew_distractors_niqqud": [
      "הוּא",
      "שָׁאֲלָה",
      "עָצוּב",
      "שִׁיר",
      "הַכֶּלֶב"
    ],
    "english_distractors": [
      "He told",
      "asked",
      "a sad",
      "song",
      "her dog"
    ],
    "notes": "Same root twice: סיפרה (pi'el ס-פ-ר, she told) and סיפור (a story). מצחיק = funny; עצוב (sad) is the opposite distractor."
  }
];

const SENTENCE_EXPANSION = [
  buildExpandedSentence({
    id: "everyday_37", emoji: "🚆", category: "everyday", difficulty: 1,
    hebrew: "מאיזה רציף יוצאת הרכבת לחיפה?", hebrewNiqqud: "מֵאֵיזֶה רָצִיף יוֹצֵאת הָרַכֶּבֶת לְחֵיפָה?",
    english: "From which platform does the train to Haifa leave?",
    hebrewTokenPairs: [["מאיזה", "מֵאֵיזֶה"], ["רציף", "רָצִיף"], ["יוצאת", "יוֹצֵאת"], ["הרכבת", "הָרַכֶּבֶת"], ["לחיפה", "לְחֵיפָה"]],
    englishTokens: ["From which", "platform", "does the train", "to Haifa", "leave"],
    hebrewDistractorPairs: [["מאיזו", "מֵאֵיזוֹ"], ["תחנה", "תַּחֲנָה"], ["מגיעה", "מַגִּיעָה"], ["האוטובוס", "הָאוֹטוֹבּוּס"], ["לירושלים", "לִירוּשָׁלַיִם"]],
    englishDistractors: ["At which", "station", "does the bus", "from Haifa", "arrive"],
    notes: "מאיזה רציף is the standard way to ask which platform a train leaves from. יוצאת agrees with the feminine noun רכבת."
  }),
  buildExpandedSentence({
    id: "everyday_38", emoji: "🚌", category: "everyday", difficulty: 1,
    hebrew: "איפה מתקפים את הרב־קו?", hebrewNiqqud: "אֵיפֹה מְתַקְּפִים אֶת הָרַב־קַו?",
    english: "Where do I validate the Rav-Kav?",
    hebrewTokenPairs: [["איפה", "אֵיפֹה"], ["מתקפים", "מְתַקְּפִים"], ["את", "אֶת"], ["הרב־קו", "הָרַב־קַו"]],
    englishTokens: ["Where", "do I", "validate", "the Rav-Kav"],
    hebrewDistractorPairs: [["מתי", "מָתַי"], ["טוענים", "טוֹעֲנִים"], ["עם", "עִם"], ["הכרטיס", "הַכַּרְטִיס"], ["באפליקציה", "בָּאֲפְּלִיקַצְיָה"]],
    englishDistractors: ["When", "do we", "reload", "the ticket", "in the app"],
    notes: "לתקף means to validate a transit ticket or Rav-Kav before or when boarding. The impersonal plural מתקפים is natural for asking how something is done."
  }),
  buildExpandedSentence({
    id: "everyday_39", emoji: "🚕", category: "everyday", difficulty: 1,
    hebrew: "אפשר להפעיל מונה, בבקשה?", hebrewNiqqud: "אֶפְשָׁר לְהַפְעִיל מוֹנֶה, בְּבַקָּשָׁה?",
    english: "Can you turn on the meter, please?",
    hebrewTokenPairs: [["אפשר", "אֶפְשָׁר"], ["להפעיל", "לְהַפְעִיל"], ["מונה", "מוֹנֶה"], ["בבקשה", "בְּבַקָּשָׁה"]],
    englishTokens: ["Can you", "turn on", "the meter", "please"],
    hebrewDistractorPairs: [["כדאי", "כְּדַאי"], ["לכבות", "לְכַבּוֹת"], ["מזגן", "מַזְגָן"], ["עכשיו", "עַכְשָׁו"], ["לאט", "לְאַט"]],
    englishDistractors: ["Should we", "turn off", "the air conditioner", "now", "slowly"],
    notes: "להפעיל מונה is the standard taxi request for asking the driver to use the meter."
  }),
  buildExpandedSentence({
    id: "everyday_40", emoji: "🧭", category: "everyday", difficulty: 1,
    hebrew: "סליחה, איך מגיעים מכאן לשוק?", hebrewNiqqud: "סְלִיחָה, אֵיךְ מַגִּיעִים מִכָּאן לַשּׁוּק?",
    english: "Excuse me, how do I get to the market from here?",
    hebrewTokenPairs: [["סליחה", "סְלִיחָה"], ["איך", "אֵיךְ"], ["מגיעים", "מַגִּיעִים"], ["מכאן", "מִכָּאן"], ["לשוק", "לַשּׁוּק"]],
    englishTokens: ["Excuse me", "how", "do I get", "to the market", "from here"],
    hebrewDistractorPairs: [["בבקשה", "בְּבַקָּשָׁה"], ["מתי", "מָתַי"], ["חוזרים", "חוֹזְרִים"], ["משם", "מִשָּׁם"], ["לתחנה", "לַתַּחֲנָה"]],
    englishDistractors: ["Please", "when", "do I return", "from there", "to the station"],
    notes: "איך מגיעים is an impersonal everyday way to ask for directions, regardless of the speaker's gender."
  }),
  buildExpandedSentence({
    id: "everyday_41", emoji: "🗺️", category: "everyday", difficulty: 2,
    hebrew: "נראה לי שהלכנו לאיבוד; בוא נבדוק במפה.", hebrewNiqqud: "נִרְאֶה לִי שֶׁהָלַכְנוּ לְאִבּוּד; בּוֹא נִבְדֹּק בַּמַּפָּה.",
    english: "I think we're lost; let's check the map.",
    hebrewTokenPairs: [["נראה", "נִרְאֶה"], ["לי", "לִי"], ["שהלכנו", "שֶׁהָלַכְנוּ"], ["לאיבוד", "לְאִבּוּד"], ["בוא", "בּוֹא"], ["נבדוק", "נִבְדֹּק"], ["במפה", "בַּמַּפָּה"]],
    englishTokens: ["I think", "we're lost", "let's", "check", "the map"],
    hebrewDistractorPairs: [["ברור", "בָּרוּר"], ["שחזרנו", "שֶׁחָזַרְנוּ"], ["הביתה", "הַבַּיְתָה"], ["נמשיך", "נַמְשִׁיךְ"], ["בשלט", "בַּשֶּׁלֶט"]],
    englishDistractors: ["I'm sure", "we're back", "home", "continue", "the sign"],
    notes: "ללכת לאיבוד means to get lost. נראה לי softens the statement to 'I think' or 'it seems to me.'",
    hebrewAlternates: [{
      text: "נראה לי שהלכנו לאיבוד; בואי נבדוק במפה.", textNiqqud: "נִרְאֶה לִי שֶׁהָלַכְנוּ לְאִבּוּד; בּוֹאִי נִבְדֹּק בַּמַּפָּה.",
      tokenPairs: [["נראה", "נִרְאֶה"], ["לי", "לִי"], ["שהלכנו", "שֶׁהָלַכְנוּ"], ["לאיבוד", "לְאִבּוּד"], ["בואי", "בּוֹאִי"], ["נבדוק", "נִבְדֹּק"], ["במפה", "בַּמַּפָּה"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_42", emoji: "🍽️", category: "everyday", difficulty: 2,
    hebrew: "יש לנו הזמנה על שם לוי לשעה שמונה.", hebrewNiqqud: "יֵשׁ לָנוּ הַזְמָנָה עַל שֵׁם לֵוִי לְשָׁעָה שְׁמוֹנֶה.",
    english: "We have a reservation under Levi for eight o'clock.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["לנו", "לָנוּ"], ["הזמנה", "הַזְמָנָה"], ["על שם", "עַל שֵׁם"], ["לוי", "לֵוִי"], ["לשעה", "לְשָׁעָה"], ["שמונה", "שְׁמוֹנֶה"]],
    englishTokens: ["We have", "a reservation", "under", "Levi", "for", "eight o'clock"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["שולחן", "שֻׁלְחָן"], ["בלי שם", "בְּלִי שֵׁם"], ["כהן", "כֹּהֵן"], ["למחר", "לְמָחָר"]],
    englishDistractors: ["We need", "a table", "without a name", "Cohen", "tomorrow"],
    notes: "הזמנה על שם... is the normal phrase for a reservation booked under someone's name."
  }),
  buildExpandedSentence({
    id: "everyday_43", emoji: "🥜", category: "everyday", difficulty: 2,
    hebrew: "יש במנה הזאת אגוזים? יש לי אלרגיה.", hebrewNiqqud: "יֵשׁ בַּמָּנָה הַזֹּאת אֱגוֹזִים? יֵשׁ לִי אַלֶּרְגְּיָה.",
    english: "Does this dish contain nuts? I have an allergy.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["במנה", "בַּמָּנָה"], ["הזאת", "הַזֹּאת"], ["אגוזים", "אֱגוֹזִים"], ["יש", "יֵשׁ"], ["לי", "לִי"], ["אלרגיה", "אַלֶּרְגְּיָה"]],
    englishTokens: ["Does", "this dish", "contain", "nuts", "I have", "an allergy"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["במרק", "בַּמָּרָק"], ["הזה", "הַזֶּה"], ["שקדים", "שְׁקֵדִים"], ["רגישות", "רְגִישׁוּת"]],
    englishDistractors: ["Doesn't", "this soup", "include", "almonds", "a sensitivity"],
    notes: "יש במנה הזאת...? is a direct, useful restaurant pattern. אלרגיה identifies a medical allergy rather than a preference."
  }),
  buildExpandedSentence({
    id: "everyday_44", emoji: "🥡", category: "everyday", difficulty: 1,
    hebrew: "אפשר לארוז את מה שנשאר?", hebrewNiqqud: "אֶפְשָׁר לֶאֱרֹז אֶת מַה שֶּׁנִּשְׁאַר?",
    english: "Can you pack up what's left?",
    hebrewTokenPairs: [["אפשר", "אֶפְשָׁר"], ["לארוז", "לֶאֱרֹז"], ["את", "אֶת"], ["מה", "מַה"], ["שנשאר", "שֶּׁנִּשְׁאַר"]],
    englishTokens: ["Can you", "pack up", "what's left"],
    hebrewDistractorPairs: [["כדאי", "כְּדַאי"], ["לזרוק", "לִזְרֹק"], ["עם", "עִם"], ["מי", "מִי"], ["שהזמנו", "שֶׁהִזְמַנּוּ"]],
    englishDistractors: ["Should we", "throw away", "what we ordered", "everything", "here"],
    notes: "לארוז את מה שנשאר is the usual restaurant request to pack leftovers to take away."
  }),
  buildExpandedSentence({
    id: "everyday_45", emoji: "👕", category: "everyday", difficulty: 2,
    hebrew: "יש לכם את זה במידה גדולה יותר?", hebrewNiqqud: "יֵשׁ לָכֶם אֶת זֶה בְּמִדָּה גְּדוֹלָה יוֹתֵר?",
    english: "Do you have this in a larger size?",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["לכם", "לָכֶם"], ["את", "אֶת"], ["זה", "זֶה"], ["במידה", "בְּמִדָּה"], ["גדולה", "גְּדוֹלָה"], ["יותר", "יוֹתֵר"]],
    englishTokens: ["Do you have", "this", "in", "a larger", "size"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["להם", "לָהֶם"], ["אותו", "אוֹתוֹ"], ["בצבע", "בְּצֶבַע"], ["קטנה", "קְטַנָּה"]],
    englishDistractors: ["They have", "that", "with", "a smaller", "color"],
    notes: "במידה גדולה יותר is the standard shopping phrase for asking for a larger clothing size."
  }),
  buildExpandedSentence({
    id: "everyday_46", emoji: "↩️", category: "everyday", difficulty: 2,
    hebrew: "אני רוצה להחזיר את החולצה; היא קטנה מדי.", hebrewNiqqud: "אֲנִי רוֹצֶה לְהַחֲזִיר אֶת הַחֻלְצָה; הִיא קְטַנָּה מִדַּי.",
    english: "I'd like to return the shirt; it's too small.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["רוצה", "רוֹצֶה"], ["להחזיר", "לְהַחֲזִיר"], ["את", "אֶת"], ["החולצה", "הַחֻלְצָה"], ["היא", "הִיא"], ["קטנה", "קְטַנָּה"], ["מדי", "מִדַּי"]],
    englishTokens: ["I'd like", "to return", "the shirt", "it's", "too small"],
    hebrewDistractorPairs: [["צריך", "צָרִיךְ"], ["להחליף", "לְהַחֲלִיף"], ["המכנסיים", "הַמִּכְנָסַיִם"], ["גדולה", "גְּדוֹלָה"], ["מספיק", "מַסְפִּיק"]],
    englishDistractors: ["I need", "to exchange", "the pants", "they're", "large enough"],
    notes: "להחזיר is to return an item. מדי after an adjective means 'too,' as in קטנה מדי, 'too small.'"
  }),
  buildExpandedSentence({
    id: "everyday_47", emoji: "🧾", category: "everyday", difficulty: 1,
    hebrew: "אפשר לקבל קבלה במייל?", hebrewNiqqud: "אֶפְשָׁר לְקַבֵּל קַבָּלָה בַּמֵּייל?",
    english: "Can I get the receipt by email?",
    hebrewTokenPairs: [["אפשר", "אֶפְשָׁר"], ["לקבל", "לְקַבֵּל"], ["קבלה", "קַבָּלָה"], ["במייל", "בַּמֵּייל"]],
    englishTokens: ["Can I get", "the receipt", "by email"],
    hebrewDistractorPairs: [["צריך", "צָרִיךְ"], ["לשלוח", "לִשְׁלֹחַ"], ["חשבונית", "חֶשְׁבּוֹנִית"], ["בדואר", "בַּדֹּאַר"], ["מודפסת", "מֻדְפֶּסֶת"]],
    englishDistractors: ["I need", "to send", "the invoice", "by mail", "printed"],
    notes: "קבלה is a receipt, while חשבונית is an invoice. במייל means by email."
  }),
  buildExpandedSentence({
    id: "everyday_48", emoji: "💊", category: "everyday", difficulty: 2,
    hebrew: "אני צריך משהו לכאב גרון בלי מרשם.", hebrewNiqqud: "אֲנִי צָרִיךְ מַשֶּׁהוּ לִכְאֵב גָּרוֹן בְּלִי מִרְשָׁם.",
    english: "I need something for a sore throat without a prescription.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["צריך", "צָרִיךְ"], ["משהו", "מַשֶּׁהוּ"], ["לכאב גרון", "לִכְאֵב גָּרוֹן"], ["בלי", "בְּלִי"], ["מרשם", "מִרְשָׁם"]],
    englishTokens: ["I need", "something", "for a sore throat", "without", "a prescription"],
    hebrewDistractorPairs: [["רוצה", "רוֹצֶה"], ["תרופה", "תְּרוּפָה"], ["לכאב ראש", "לִכְאֵב רֹאשׁ"], ["עם", "עִם"], ["הפניה", "הַפְנָיָה"]],
    englishDistractors: ["I want", "medicine", "for a headache", "with", "a referral"],
    notes: "בלי מרשם means over the counter, literally 'without a prescription.' כאב גרון is a sore throat.",
    hebrewAlternates: [{
      text: "אני צריכה משהו לכאב גרון בלי מרשם.", textNiqqud: "אֲנִי צְרִיכָה מַשֶּׁהוּ לִכְאֵב גָּרוֹן בְּלִי מִרְשָׁם.",
      tokenPairs: [["אני", "אֲנִי"], ["צריכה", "צְרִיכָה"], ["משהו", "מַשֶּׁהוּ"], ["לכאב גרון", "לִכְאֵב גָּרוֹן"], ["בלי", "בְּלִי"], ["מרשם", "מִרְשָׁם"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_49", emoji: "🤒", category: "everyday", difficulty: 1,
    hebrew: "יש לי חום ושיעול כבר יומיים.", hebrewNiqqud: "יֵשׁ לִי חֹם וְשִׁעוּל כְּבָר יוֹמַיִם.",
    english: "I've had a fever and a cough for two days.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["לי", "לִי"], ["חום", "חֹם"], ["ושיעול", "וְשִׁעוּל"], ["כבר", "כְּבָר"], ["יומיים", "יוֹמַיִם"]],
    englishTokens: ["I've had", "a fever", "and a cough", "for", "two days"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["לה", "לָהּ"], ["כאב", "כְּאֵב"], ["ונזלת", "וְנַזֶּלֶת"], ["שבוע", "שָׁבוּעַ"]],
    englishDistractors: ["She has", "a pain", "and a cold", "since", "one week"],
    notes: "יש לי חום is the standard way to say 'I have a fever.' כבר literally adds 'already' and marks the duration as continuing through now."
  }),
  buildExpandedSentence({
    id: "everyday_50", emoji: "📅", category: "everyday", difficulty: 2,
    hebrew: "אני חייב לדחות את התור; יש משהו פנוי ביום חמישי?", hebrewNiqqud: "אֲנִי חַיָּב לִדְחוֹת אֶת הַתּוֹר; יֵשׁ מַשֶּׁהוּ פָּנוּי בְּיוֹם חֲמִישִׁי?",
    english: "I have to postpone the appointment; is anything available on Thursday?",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["חייב", "חַיָּב"], ["לדחות", "לִדְחוֹת"], ["את", "אֶת"], ["התור", "הַתּוֹר"], ["יש", "יֵשׁ"], ["משהו", "מַשֶּׁהוּ"], ["פנוי", "פָּנוּי"], ["ביום", "בְּיוֹם"], ["חמישי", "חֲמִישִׁי"]],
    englishTokens: ["I have to", "postpone", "the appointment", "is anything", "available", "on Thursday"],
    hebrewDistractorPairs: [["רוצה", "רוֹצֶה"], ["להקדים", "לְהַקְדִּים"], ["הפגישה", "הַפְּגִישָׁה"], ["הכול", "הַכֹּל"], ["סגור", "סָגוּר"], ["שלישי", "שְׁלִישִׁי"]],
    englishDistractors: ["I want to", "move up", "the meeting", "is everything", "closed", "on Tuesday"],
    notes: "לדחות תור means to postpone an appointment. פנוי is used for an available time slot.",
    hebrewAlternates: [{
      text: "אני חייבת לדחות את התור; יש משהו פנוי ביום חמישי?", textNiqqud: "אֲנִי חַיֶּבֶת לִדְחוֹת אֶת הַתּוֹר; יֵשׁ מַשֶּׁהוּ פָּנוּי בְּיוֹם חֲמִישִׁי?",
      tokenPairs: [["אני", "אֲנִי"], ["חייבת", "חַיֶּבֶת"], ["לדחות", "לִדְחוֹת"], ["את", "אֶת"], ["התור", "הַתּוֹר"], ["יש", "יֵשׁ"], ["משהו", "מַשֶּׁהוּ"], ["פנוי", "פָּנוּי"], ["ביום", "בְּיוֹם"], ["חמישי", "חֲמִישִׁי"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_51", emoji: "🚑", category: "everyday", difficulty: 1,
    hebrew: "איפה חדר המיון הקרוב ביותר?", hebrewNiqqud: "אֵיפֹה חֲדַר הַמִּיּוּן הַקָּרוֹב בְּיוֹתֵר?",
    english: "Where is the nearest emergency room?",
    hebrewTokenPairs: [["איפה", "אֵיפֹה"], ["חדר המיון", "חֲדַר הַמִּיּוּן"], ["הקרוב", "הַקָּרוֹב"], ["ביותר", "בְּיוֹתֵר"]],
    englishTokens: ["Where is", "the nearest", "emergency room"],
    hebrewDistractorPairs: [["מתי", "מָתַי"], ["חדר ההמתנה", "חֲדַר הַהַמְתָּנָה"], ["הרחוק", "הָרָחוֹק"], ["מכאן", "מִכָּאן"]],
    englishDistractors: ["When is", "the farthest", "waiting room", "from here"],
    notes: "חדר מיון is an emergency room. הקרוב ביותר forms the superlative 'the nearest.'"
  }),
  buildExpandedSentence({
    id: "everyday_52", emoji: "🚿", category: "everyday", difficulty: 1,
    hebrew: "אין מים חמים מאז אתמול.", hebrewNiqqud: "אֵין מַיִם חַמִּים מֵאָז אֶתְמוֹל.",
    english: "There hasn't been hot water since yesterday.",
    hebrewTokenPairs: [["אין", "אֵין"], ["מים", "מַיִם"], ["חמים", "חַמִּים"], ["מאז", "מֵאָז"], ["אתמול", "אֶתְמוֹל"]],
    englishTokens: ["There hasn't been", "hot water", "since", "yesterday"],
    hebrewDistractorPairs: [["יש", "יֵשׁ"], ["חשמל", "חַשְׁמַל"], ["קרים", "קָרִים"], ["עד", "עַד"], ["היום", "הַיּוֹם"]],
    englishDistractors: ["There has been", "cold water", "until", "today", "electricity"],
    notes: "אין מים חמים is the usual way to report that the hot water is out. מאז marks a starting point continuing until now."
  }),
  buildExpandedSentence({
    id: "everyday_53", emoji: "🔧", category: "everyday", difficulty: 2,
    hebrew: "הכיור סתום; צריך להזמין אינסטלטור.", hebrewNiqqud: "הַכִּיּוֹר סָתוּם; צָרִיךְ לְהַזְמִין אִינְסְטָלָטוֹר.",
    english: "The sink is clogged; we need to call a plumber.",
    hebrewTokenPairs: [["הכיור", "הַכִּיּוֹר"], ["סתום", "סָתוּם"], ["צריך", "צָרִיךְ"], ["להזמין", "לְהַזְמִין"], ["אינסטלטור", "אִינְסְטָלָטוֹר"]],
    englishTokens: ["The sink", "is clogged", "we need", "to call", "a plumber"],
    hebrewDistractorPairs: [["הברז", "הַבֶּרֶז"], ["פתוח", "פָּתוּחַ"], ["אפשר", "אֶפְשָׁר"], ["לבטל", "לְבַטֵּל"], ["חשמלאי", "חַשְׁמַלַּאי"]],
    englishDistractors: ["The faucet", "is open", "we can", "cancel", "an electrician"],
    notes: "סתום describes a clogged drain or sink. להזמין אינסטלטור means to call or arrange for a plumber."
  }),
  buildExpandedSentence({
    id: "everyday_54", emoji: "🏠", category: "everyday", difficulty: 2,
    hebrew: "מי אחראי על התיקון, אני או בעל הדירה?", hebrewNiqqud: "מִי אַחְרַאי עַל הַתִּקּוּן, אֲנִי אוֹ בַּעַל הַדִּירָה?",
    english: "Who is responsible for the repair, me or the landlord?",
    hebrewTokenPairs: [["מי", "מִי"], ["אחראי", "אַחְרַאי"], ["על", "עַל"], ["התיקון", "הַתִּקּוּן"], ["אני", "אֲנִי"], ["או", "אוֹ"], ["בעל הדירה", "בַּעַל הַדִּירָה"]],
    englishTokens: ["Who is", "responsible for", "the repair", "me", "or", "the landlord"],
    hebrewDistractorPairs: [["מה", "מַה"], ["זכאי", "זַכַּאי"], ["בלי", "בְּלִי"], ["התשלום", "הַתַּשְׁלוּם"], ["השוכר", "הַשּׂוֹכֵר"], ["ועד הבית", "וַעַד הַבַּיִת"]],
    englishDistractors: ["What is", "eligible for", "the payment", "the tenant", "and", "the building committee"],
    notes: "אחראי על means responsible for. בעל הדירה is the landlord, literally the owner of the apartment.",
    hebrewAlternates: [
      { text: "מי אחראית על התיקון, אני או בעל הדירה?", textNiqqud: "מִי אַחְרָאִית עַל הַתִּקּוּן, אֲנִי אוֹ בַּעַל הַדִּירָה?", tokenPairs: [["מי", "מִי"], ["אחראית", "אַחְרָאִית"], ["על", "עַל"], ["התיקון", "הַתִּקּוּן"], ["אני", "אֲנִי"], ["או", "אוֹ"], ["בעל הדירה", "בַּעַל הַדִּירָה"]] },
      { text: "מי אחראי על התיקון, אני או בעלת הדירה?", textNiqqud: "מִי אַחְרַאי עַל הַתִּקּוּן, אֲנִי אוֹ בַּעֲלַת הַדִּירָה?", tokenPairs: [["מי", "מִי"], ["אחראי", "אַחְרַאי"], ["על", "עַל"], ["התיקון", "הַתִּקּוּן"], ["אני", "אֲנִי"], ["או", "אוֹ"], ["בעלת הדירה", "בַּעֲלַת הַדִּירָה"]] },
      { text: "מי אחראית על התיקון, אני או בעלת הדירה?", textNiqqud: "מִי אַחְרָאִית עַל הַתִּקּוּן, אֲנִי אוֹ בַּעֲלַת הַדִּירָה?", tokenPairs: [["מי", "מִי"], ["אחראית", "אַחְרָאִית"], ["על", "עַל"], ["התיקון", "הַתִּקּוּן"], ["אני", "אֲנִי"], ["או", "אוֹ"], ["בעלת הדירה", "בַּעֲלַת הַדִּירָה"]] }
    ]
  }),
  buildExpandedSentence({
    id: "everyday_55", emoji: "💡", category: "everyday", difficulty: 2,
    hebrew: "חשבון החשמל גבוה מהרגיל החודש.", hebrewNiqqud: "חֶשְׁבּוֹן הַחַשְׁמַל גָּבוֹהַּ מֵהָרָגִיל הַחֹדֶשׁ.",
    english: "The electricity bill is higher than usual this month.",
    hebrewTokenPairs: [["חשבון החשמל", "חֶשְׁבּוֹן הַחַשְׁמַל"], ["גבוה", "גָּבוֹהַּ"], ["מהרגיל", "מֵהָרָגִיל"], ["החודש", "הַחֹדֶשׁ"]],
    englishTokens: ["The electricity bill", "is higher", "than usual", "this month"],
    hebrewDistractorPairs: [["חשבון המים", "חֶשְׁבּוֹן הַמַּיִם"], ["נמוך", "נָמוּךְ"], ["מהצפוי", "מֵהַצָּפוּי"], ["השבוע", "הַשָּׁבוּעַ"]],
    englishDistractors: ["The water bill", "is lower", "than expected", "this week"],
    notes: "מהרגיל means 'than usual.' Utility bills commonly use the construct phrase חשבון החשמל."
  }),
  buildExpandedSentence({
    id: "everyday_56", emoji: "📄", category: "everyday", difficulty: 2,
    hebrew: "אילו מסמכים צריך להביא לפגישה?", hebrewNiqqud: "אֵילוּ מִסְמָכִים צָרִיךְ לְהָבִיא לַפְּגִישָׁה?",
    english: "Which documents do I need to bring to the appointment?",
    hebrewTokenPairs: [["אילו", "אֵילוּ"], ["מסמכים", "מִסְמָכִים"], ["צריך", "צָרִיךְ"], ["להביא", "לְהָבִיא"], ["לפגישה", "לַפְּגִישָׁה"]],
    englishTokens: ["Which", "documents", "do I need", "to bring", "to the appointment"],
    hebrewDistractorPairs: [["כמה", "כַּמָּה"], ["טפסים", "טְפָסִים"], ["אפשר", "אֶפְשָׁר"], ["לשלוח", "לִשְׁלֹחַ"], ["למשרד", "לַמִּשְׂרָד"]],
    englishDistractors: ["How many", "forms", "can I", "send", "to the office"],
    notes: "אילו asks 'which' before a plural noun. צריך is impersonal here, so the question works for any speaker."
  }),
  buildExpandedSentence({
    id: "everyday_57", emoji: "✍️", category: "everyday", difficulty: 1,
    hebrew: "איפה חותמים בטופס הזה?", hebrewNiqqud: "אֵיפֹה חוֹתְמִים בַּטֹּפֶס הַזֶּה?",
    english: "Where do I sign this form?",
    hebrewTokenPairs: [["איפה", "אֵיפֹה"], ["חותמים", "חוֹתְמִים"], ["בטופס", "בַּטֹּפֶס"], ["הזה", "הַזֶּה"]],
    englishTokens: ["Where", "do I sign", "this form"],
    hebrewDistractorPairs: [["מתי", "מָתַי"], ["ממלאים", "מְמַלְּאִים"], ["במסמך", "בַּמִּסְמָךְ"], ["ההוא", "הַהוּא"]],
    englishDistractors: ["When", "do I fill out", "that document", "here"],
    notes: "חותמים is an impersonal plural used naturally for 'where do I sign?' טופס is a form."
  }),
  buildExpandedSentence({
    id: "everyday_58", emoji: "🪪", category: "everyday", difficulty: 2,
    hebrew: "איבדתי את תעודת הזהות ואני צריך לדווח על זה.", hebrewNiqqud: "אִבַּדְתִּי אֶת תְּעוּדַת הַזֶּהוּת וַאֲנִי צָרִיךְ לְדַוֵּחַ עַל זֶה.",
    english: "I lost my ID card and need to report it.",
    hebrewTokenPairs: [["איבדתי", "אִבַּדְתִּי"], ["את", "אֶת"], ["תעודת הזהות", "תְּעוּדַת הַזֶּהוּת"], ["ואני", "וַאֲנִי"], ["צריך", "צָרִיךְ"], ["לדווח", "לְדַוֵּחַ"], ["על", "עַל"], ["זה", "זֶה"]],
    englishTokens: ["I lost", "my ID card", "and", "need", "to report", "it"],
    hebrewDistractorPairs: [["מצאתי", "מָצָאתִי"], ["רישיון הנהיגה", "רִשְׁיוֹן הַנְּהִיגָה"], ["רוצה", "רוֹצֶה"], ["לחדש", "לְחַדֵּשׁ"], ["אותו", "אוֹתוֹ"]],
    englishDistractors: ["I found", "my driver's license", "want", "to renew", "it online"],
    notes: "תעודת זהות is an Israeli ID card. לדווח על means to report an incident or loss.",
    hebrewAlternates: [{
      text: "איבדתי את תעודת הזהות ואני צריכה לדווח על זה.", textNiqqud: "אִבַּדְתִּי אֶת תְּעוּדַת הַזֶּהוּת וַאֲנִי צְרִיכָה לְדַוֵּחַ עַל זֶה.",
      tokenPairs: [["איבדתי", "אִבַּדְתִּי"], ["את", "אֶת"], ["תעודת הזהות", "תְּעוּדַת הַזֶּהוּת"], ["ואני", "וַאֲנִי"], ["צריכה", "צְרִיכָה"], ["לדווח", "לְדַוֵּחַ"], ["על", "עַל"], ["זה", "זֶה"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_59", emoji: "🏧", category: "everyday", difficulty: 1,
    hebrew: "הכרטיס שלי לא עובד בכספומט.", hebrewNiqqud: "הַכַּרְטִיס שֶׁלִּי לֹא עוֹבֵד בַּכַּסְפּוֹמָט.",
    english: "My card isn't working at the ATM.",
    hebrewTokenPairs: [["הכרטיס", "הַכַּרְטִיס"], ["שלי", "שֶׁלִּי"], ["לא", "לֹא"], ["עובד", "עוֹבֵד"], ["בכספומט", "בַּכַּסְפּוֹמָט"]],
    englishTokens: ["My card", "isn't working", "at the ATM"],
    hebrewDistractorPairs: [["הטלפון", "הַטֵּלֵפוֹן"], ["שלו", "שֶׁלּוֹ"], ["כבר", "כְּבָר"], ["תקין", "תַּקִּין"], ["בקופה", "בַּקֻּפָּה"]],
    englishDistractors: ["His phone", "is working", "at the register", "already", "properly"],
    notes: "כספומט is an ATM. לא עובד is the everyday phrase for a card, machine, or device not working."
  }),
  buildExpandedSentence({
    id: "everyday_60", emoji: "🌧️", category: "everyday", difficulty: 1,
    hebrew: "אם ימשיך לרדת גשם, נישאר בבית.", hebrewNiqqud: "אִם יַמְשִׁיךְ לָרֶדֶת גֶּשֶׁם, נִשָּׁאֵר בַּבַּיִת.",
    english: "If it keeps raining, we'll stay home.",
    hebrewTokenPairs: [["אם", "אִם"], ["ימשיך", "יַמְשִׁיךְ"], ["לרדת", "לָרֶדֶת"], ["גשם", "גֶּשֶׁם"], ["נישאר", "נִשָּׁאֵר"], ["בבית", "בַּבַּיִת"]],
    englishTokens: ["If it keeps", "raining", "we'll stay", "home"],
    hebrewDistractorPairs: [["כאשר", "כַּאֲשֶׁר"], ["יפסיק", "יַפְסִיק"], ["לנשוב", "לִנְשֹׁב"], ["שלג", "שֶׁלֶג"], ["נצא", "נֵצֵא"], ["החוצה", "הַחוּצָה"]],
    englishDistractors: ["When it stops", "snowing", "we'll go", "outside", "the wind"],
    notes: "אם plus the future is the normal real-condition pattern. להמשיך לרדת describes rain that keeps falling."
  }),
  buildExpandedSentence({
    id: "colloquial_37", emoji: "🔁", category: "colloquial", difficulty: 1,
    hebrew: "לא הבנתי; אתה יכול להגיד את זה שוב?", hebrewNiqqud: "לֹא הֵבַנְתִּי; אַתָּה יָכוֹל לְהַגִּיד אֶת זֶה שׁוּב?",
    english: "I didn't understand; can you say that again?",
    hebrewTokenPairs: [["לא", "לֹא"], ["הבנתי", "הֵבַנְתִּי"], ["אתה", "אַתָּה"], ["יכול", "יָכוֹל"], ["להגיד", "לְהַגִּיד"], ["את", "אֶת"], ["זה", "זֶה"], ["שוב", "שׁוּב"]],
    englishTokens: ["I didn't", "understand", "can you", "say", "that", "again"],
    hebrewDistractorPairs: [["כבר", "כְּבָר"], ["זכרתי", "זָכַרְתִּי"], ["צריך", "צָרִיךְ"], ["להסביר", "לְהַסְבִּיר"], ["אחר כך", "אַחַר כָּךְ"]],
    englishDistractors: ["I already", "remembered", "you need to", "explain", "later"],
    notes: "לא הבנתי followed by אתה יכול להגיד את זה שוב is a direct but polite conversational repair request.",
    hebrewAlternates: [{
      text: "לא הבנתי; את יכולה להגיד את זה שוב?", textNiqqud: "לֹא הֵבַנְתִּי; אַתְּ יְכוֹלָה לְהַגִּיד אֶת זֶה שׁוּב?",
      tokenPairs: [["לא", "לֹא"], ["הבנתי", "הֵבַנְתִּי"], ["את", "אַתְּ"], ["יכולה", "יְכוֹלָה"], ["להגיד", "לְהַגִּיד"], ["את", "אֶת"], ["זה", "זֶה"], ["שוב", "שׁוּב"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_38", emoji: "🗣️", category: "colloquial", difficulty: 2,
    hebrew: "אפשר לדבר קצת יותר לאט? אני עדיין לומד עברית.", hebrewNiqqud: "אֶפְשָׁר לְדַבֵּר קְצָת יוֹתֵר לְאַט? אֲנִי עֲדַיִן לוֹמֵד עִבְרִית.",
    english: "Can you speak a little more slowly? I'm still learning Hebrew.",
    hebrewTokenPairs: [["אפשר", "אֶפְשָׁר"], ["לדבר", "לְדַבֵּר"], ["קצת", "קְצָת"], ["יותר", "יוֹתֵר"], ["לאט", "לְאַט"], ["אני", "אֲנִי"], ["עדיין", "עֲדַיִן"], ["לומד", "לוֹמֵד"], ["עברית", "עִבְרִית"]],
    englishTokens: ["Can you", "speak", "a little", "more slowly", "I'm still", "learning", "Hebrew"],
    hebrewDistractorPairs: [["צריך", "צָרִיךְ"], ["לכתוב", "לִכְתֹּב"], ["הרבה", "הַרְבֵּה"], ["מהר", "מַהֵר"], ["כבר", "כְּבָר"], ["יודע", "יוֹדֵעַ"]],
    englishDistractors: ["Do you need to", "write", "a lot", "faster", "I already", "know"],
    notes: "אפשר לדבר...? avoids choosing the listener's gender. עדיין לומד means the learning is still in progress.",
    hebrewAlternates: [{
      text: "אפשר לדבר קצת יותר לאט? אני עדיין לומדת עברית.", textNiqqud: "אֶפְשָׁר לְדַבֵּר קְצָת יוֹתֵר לְאַט? אֲנִי עֲדַיִן לוֹמֶדֶת עִבְרִית.",
      tokenPairs: [["אפשר", "אֶפְשָׁר"], ["לדבר", "לְדַבֵּר"], ["קצת", "קְצָת"], ["יותר", "יוֹתֵר"], ["לאט", "לְאַט"], ["אני", "אֲנִי"], ["עדיין", "עֲדַיִן"], ["לומדת", "לוֹמֶדֶת"], ["עברית", "עִבְרִית"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_39", emoji: "❓", category: "colloquial", difficulty: 1,
    hebrew: "מה זה אומר בדיוק?", hebrewNiqqud: "מַה זֶה אוֹמֵר בְּדִיּוּק?",
    english: "What exactly does that mean?",
    hebrewTokenPairs: [["מה", "מַה"], ["זה", "זֶה"], ["אומר", "אוֹמֵר"], ["בדיוק", "בְּדִיּוּק"]],
    englishTokens: ["What exactly", "does that", "mean"],
    hebrewDistractorPairs: [["מי", "מִי"], ["זאת", "זֹאת"], ["כותב", "כּוֹתֵב"], ["בערך", "בְּעֵרֶךְ"]],
    englishDistractors: ["Who", "does this", "write", "approximately"],
    notes: "מה זה אומר? asks for a meaning or explanation. בדיוק adds 'exactly.'"
  }),
  buildExpandedSentence({
    id: "colloquial_40", emoji: "🇮🇱", category: "colloquial", difficulty: 2,
    hebrew: "אומרים את זה ככה בעברית, או שיש דרך יותר טבעית?", hebrewNiqqud: "אוֹמְרִים אֶת זֶה כָּכָה בְּעִבְרִית, אוֹ שֶׁיֵּשׁ דֶּרֶךְ יוֹתֵר טִבְעִית?",
    english: "Do people say it that way in Hebrew, or is there a more natural way?",
    hebrewTokenPairs: [["אומרים", "אוֹמְרִים"], ["את", "אֶת"], ["זה", "זֶה"], ["ככה", "כָּכָה"], ["בעברית", "בְּעִבְרִית"], ["או", "אוֹ"], ["שיש", "שֶׁיֵּשׁ"], ["דרך", "דֶּרֶךְ"], ["יותר", "יוֹתֵר"], ["טבעית", "טִבְעִית"]],
    englishTokens: ["Do people", "say", "it", "that way", "in Hebrew", "or", "is there", "a more natural", "way"],
    hebrewDistractorPairs: [["כותבים", "כּוֹתְבִים"], ["אותו", "אוֹתוֹ"], ["אחרת", "אַחֶרֶת"], ["באנגלית", "בְּאַנְגְּלִית"], ["צורה", "צוּרָה"], ["רשמית", "רִשְׁמִית"]],
    englishDistractors: ["Can we", "write", "differently", "in English", "a more formal", "form"],
    notes: "אומרים את זה ככה? asks whether wording sounds natural, not merely whether it is grammatically possible."
  }),
  buildExpandedSentence({
    id: "colloquial_41", emoji: "🤔", category: "colloquial", difficulty: 2,
    hebrew: "נראה לי שכן, אבל אני לא בטוח.", hebrewNiqqud: "נִרְאֶה לִי שֶׁכֵּן, אֲבָל אֲנִי לֹא בָּטוּחַ.",
    english: "I think so, but I'm not sure.",
    hebrewTokenPairs: [["נראה", "נִרְאֶה"], ["לי", "לִי"], ["שכן", "שֶׁכֵּן"], ["אבל", "אֲבָל"], ["אני", "אֲנִי"], ["לא", "לֹא"], ["בטוח", "בָּטוּחַ"]],
    englishTokens: ["I think so", "but", "I'm not", "sure"],
    hebrewDistractorPairs: [["ברור", "בָּרוּר"], ["לו", "לוֹ"], ["שלא", "שֶׁלֹּא"], ["לכן", "לָכֵן"], ["כבר", "כְּבָר"], ["מוכן", "מוּכָן"]],
    englishDistractors: ["It's clear", "to him", "I don't think so", "therefore", "I'm already", "ready"],
    notes: "נראה לי שכן is a common softened yes: 'I think so.' בטוח or בטוחה agrees with the speaker.",
    hebrewAlternates: [{
      text: "נראה לי שכן, אבל אני לא בטוחה.", textNiqqud: "נִרְאֶה לִי שֶׁכֵּן, אֲבָל אֲנִי לֹא בְּטוּחָה.",
      tokenPairs: [["נראה", "נִרְאֶה"], ["לי", "לִי"], ["שכן", "שֶׁכֵּן"], ["אבל", "אֲבָל"], ["אני", "אֲנִי"], ["לא", "לֹא"], ["בטוחה", "בְּטוּחָה"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_42", emoji: "💬", category: "colloquial", difficulty: 2,
    hebrew: "אני מבין את הנקודה, אבל לא לגמרי מסכים.", hebrewNiqqud: "אֲנִי מֵבִין אֶת הַנְּקֻדָּה, אֲבָל לֹא לְגַמְרֵי מַסְכִּים.",
    english: "I see the point, but I don't completely agree.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["מבין", "מֵבִין"], ["את", "אֶת"], ["הנקודה", "הַנְּקֻדָּה"], ["אבל", "אֲבָל"], ["לא", "לֹא"], ["לגמרי", "לְגַמְרֵי"], ["מסכים", "מַסְכִּים"]],
    englishTokens: ["I see", "the point", "but", "I don't", "completely", "agree"],
    hebrewDistractorPairs: [["מכיר", "מַכִּיר"], ["הבעיה", "הַבְּעָיָה"], ["לכן", "לָכֵן"], ["מאוד", "מְאֹד"], ["מתנגד", "מִתְנַגֵּד"]],
    englishDistractors: ["I know", "the problem", "therefore", "I strongly", "object"],
    notes: "מבין את הנקודה means 'I see the point.' לגמרי adds 'completely,' leaving room for partial agreement.",
    hebrewAlternates: [{
      text: "אני מבינה את הנקודה, אבל לא לגמרי מסכימה.", textNiqqud: "אֲנִי מְבִינָה אֶת הַנְּקֻדָּה, אֲבָל לֹא לְגַמְרֵי מַסְכִּימָה.",
      tokenPairs: [["אני", "אֲנִי"], ["מבינה", "מְבִינָה"], ["את", "אֶת"], ["הנקודה", "הַנְּקֻדָּה"], ["אבל", "אֲבָל"], ["לא", "לֹא"], ["לגמרי", "לְגַמְרֵי"], ["מסכימה", "מַסְכִּימָה"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_43", emoji: "🫱", category: "colloquial", difficulty: 1,
    hebrew: "לא נעים לי לדבר על זה עכשיו.", hebrewNiqqud: "לֹא נָעִים לִי לְדַבֵּר עַל זֶה עַכְשָׁו.",
    english: "I'm not comfortable talking about that right now.",
    hebrewTokenPairs: [["לא", "לֹא"], ["נעים", "נָעִים"], ["לי", "לִי"], ["לדבר", "לְדַבֵּר"], ["על", "עַל"], ["זה", "זֶה"], ["עכשיו", "עַכְשָׁו"]],
    englishTokens: ["I'm not comfortable", "talking", "about that", "right now"],
    hebrewDistractorPairs: [["מאוד", "מְאֹד"], ["חשוב", "חָשׁוּב"], ["לו", "לוֹ"], ["לכתוב", "לִכְתֹּב"], ["מחר", "מָחָר"]],
    englishDistractors: ["It's very important", "to him", "writing", "about this", "tomorrow"],
    notes: "לא נעים לי is a soft boundary-setting phrase: something feels uncomfortable or awkward to me."
  }),
  buildExpandedSentence({
    id: "colloquial_44", emoji: "😅", category: "colloquial", difficulty: 2,
    hebrew: "סליחה שנעלמתי; היה לי שבוע מטורף.", hebrewNiqqud: "סְלִיחָה שֶׁנֶּעֱלַמְתִּי; הָיָה לִי שָׁבוּעַ מְטֹרָף.",
    english: "Sorry I disappeared; I had a crazy week.",
    hebrewTokenPairs: [["סליחה", "סְלִיחָה"], ["שנעלמתי", "שֶׁנֶּעֱלַמְתִּי"], ["היה", "הָיָה"], ["לי", "לִי"], ["שבוע", "שָׁבוּעַ"], ["מטורף", "מְטֹרָף"]],
    englishTokens: ["Sorry", "I disappeared", "I had", "a crazy", "week"],
    hebrewDistractorPairs: [["תודה", "תּוֹדָה"], ["שחזרתי", "שֶׁחָזַרְתִּי"], ["יש", "יֵשׁ"], ["יום", "יוֹם"], ["רגוע", "רָגוּעַ"]],
    englishDistractors: ["Thanks", "I came back", "I have", "a calm", "day"],
    notes: "נעלמתי literally means 'I disappeared' and is commonly used to apologize for going quiet or not replying."
  }),
  buildExpandedSentence({
    id: "colloquial_45", emoji: "☕", category: "colloquial", difficulty: 1,
    hebrew: "מה דעתך על קפה מחר אחרי העבודה?", hebrewNiqqud: "מַה דַּעְתְּךָ עַל קָפֶה מָחָר אַחֲרֵי הָעֲבוֹדָה?",
    english: "How about coffee tomorrow after work?",
    hebrewTokenPairs: [["מה", "מַה"], ["דעתך", "דַּעְתְּךָ"], ["על", "עַל"], ["קפה", "קָפֶה"], ["מחר", "מָחָר"], ["אחרי", "אַחֲרֵי"], ["העבודה", "הָעֲבוֹדָה"]],
    englishTokens: ["How about", "coffee", "tomorrow", "after work"],
    hebrewDistractorPairs: [["מי", "מִי"], ["רוצה", "רוֹצֶה"], ["תה", "תֵּה"], ["היום", "הַיּוֹם"], ["לפני", "לִפְנֵי"], ["הלימודים", "הַלִּמּוּדִים"]],
    englishDistractors: ["Who wants", "tea", "today", "before class", "instead"],
    notes: "מה דעתך על...? is a natural, low-pressure way to suggest a plan or ask someone's opinion."
  }),
  buildExpandedSentence({
    id: "colloquial_46", emoji: "📅", category: "colloquial", difficulty: 2,
    hebrew: "לא אצליח להגיע הערב; אפשר לדחות?", hebrewNiqqud: "לֹא אַצְלִיחַ לְהַגִּיעַ הָעֶרֶב; אֶפְשָׁר לִדְחוֹת?",
    english: "I won't be able to make it tonight; can we reschedule?",
    hebrewTokenPairs: [["לא", "לֹא"], ["אצליח", "אַצְלִיחַ"], ["להגיע", "לְהַגִּיעַ"], ["הערב", "הָעֶרֶב"], ["אפשר", "אֶפְשָׁר"], ["לדחות", "לִדְחוֹת"]],
    englishTokens: ["I won't be able", "to make it", "tonight", "can we", "reschedule"],
    hebrewDistractorPairs: [["כן", "כֵּן"], ["אוכל", "אוּכַל"], ["לצאת", "לָצֵאת"], ["מחר", "מָחָר"], ["כדאי", "כְּדַאי"], ["להקדים", "לְהַקְדִּים"]],
    englishDistractors: ["I will be able", "to go out", "tomorrow", "should we", "move it earlier"],
    notes: "לא אצליח להגיע is a natural way to say you will not be able to make an event. לדחות means postpone or reschedule."
  }),
  buildExpandedSentence({
    id: "colloquial_47", emoji: "🙌", category: "colloquial", difficulty: 2,
    hebrew: "אני בפנים; רק תגידו מתי ואיפה.", hebrewNiqqud: "אֲנִי בִּפְנִים; רַק תַּגִּידוּ מָתַי וְאֵיפֹה.",
    english: "I'm in; just tell me when and where.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["בפנים", "בִּפְנִים"], ["רק", "רַק"], ["תגידו", "תַּגִּידוּ"], ["מתי", "מָתַי"], ["ואיפה", "וְאֵיפֹה"]],
    englishTokens: ["I'm in", "just", "tell me", "when", "and where"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["בחוץ", "בַּחוּץ"], ["כבר", "כְּבָר"], ["תשאלו", "תִּשְׁאֲלוּ"], ["למה", "לָמָּה"]],
    englishDistractors: ["He's out", "already", "ask me", "why", "and how"],
    notes: "אני בפנים literally means 'I'm inside,' but colloquially it means 'I'm in' or willing to join."
  }),
  buildExpandedSentence({
    id: "colloquial_48", emoji: "📍", category: "colloquial", difficulty: 2,
    hebrew: "תשלח לי מיקום כשאתה מגיע.", hebrewNiqqud: "תִּשְׁלַח לִי מִקּוּם כְּשֶׁאַתָּה מַגִּיעַ.",
    english: "Send me your location when you get there.",
    hebrewTokenPairs: [["תשלח", "תִּשְׁלַח"], ["לי", "לִי"], ["מיקום", "מִקּוּם"], ["כשאתה", "כְּשֶׁאַתָּה"], ["מגיע", "מַגִּיעַ"]],
    englishTokens: ["Send me", "your location", "when you", "get there"],
    hebrewDistractorPairs: [["תכתוב", "תִּכְתֹּב"], ["לו", "לוֹ"], ["כתובת", "כְּתֹבֶת"], ["לפני שאתה", "לִפְנֵי שֶׁאַתָּה"], ["יוצא", "יוֹצֵא"]],
    englishDistractors: ["Write him", "the address", "before you", "leave", "later"],
    notes: "לשלוח מיקום is the everyday messaging phrase for sharing a live or pinned location.",
    hebrewAlternates: [{
      text: "תשלחי לי מיקום כשאת מגיעה.", textNiqqud: "תִּשְׁלְחִי לִי מִקּוּם כְּשֶׁאַתְּ מַגִּיעָה.",
      tokenPairs: [["תשלחי", "תִּשְׁלְחִי"], ["לי", "לִי"], ["מיקום", "מִקּוּם"], ["כשאת", "כְּשֶׁאַתְּ"], ["מגיעה", "מַגִּיעָה"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_49", emoji: "🎉", category: "colloquial", difficulty: 2,
    hebrew: "יאללה, זרום; יהיה כיף.", hebrewNiqqud: "יַאלְלָה, זְרוֹם; יִהְיֶה כֵּיף.",
    english: "Come on, go with it; it'll be fun.",
    hebrewTokenPairs: [["יאללה", "יַאלְלָה"], ["זרום", "זְרוֹם"], ["יהיה", "יִהְיֶה"], ["כיף", "כֵּיף"]],
    englishTokens: ["Come on", "go with it", "it'll be", "fun"],
    hebrewDistractorPairs: [["די", "דַּי"], ["עצור", "עֲצֹר"], ["היה", "הָיָה"], ["משעמם", "מְשַׁעְמֵם"]],
    englishDistractors: ["Enough", "stop", "it was", "boring"],
    notes: "זרום is a colloquial masculine imperative meaning to go along with a plan or be flexible.",
    hebrewAlternates: [{
      text: "יאללה, זרמי; יהיה כיף.", textNiqqud: "יַאלְלָה, זִרְמִי; יִהְיֶה כֵּיף.",
      tokenPairs: [["יאללה", "יַאלְלָה"], ["זרמי", "זִרְמִי"], ["יהיה", "יִהְיֶה"], ["כיף", "כֵּיף"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_50", emoji: "🗣️", category: "colloquial", difficulty: 3,
    hebrew: "בוא נדבר דוגרי: זה לא הולך לעבוד.", hebrewNiqqud: "בּוֹא נְדַבֵּר דֻּגְרִי: זֶה לֹא הוֹלֵךְ לַעֲבֹד.",
    english: "Let's be honest: this isn't going to work.",
    hebrewTokenPairs: [["בוא", "בּוֹא"], ["נדבר", "נְדַבֵּר"], ["דוגרי", "דֻּגְרִי"], ["זה", "זֶה"], ["לא", "לֹא"], ["הולך", "הוֹלֵךְ"], ["לעבוד", "לַעֲבֹד"]],
    englishTokens: ["Let's", "be honest", "this", "isn't going to", "work"],
    hebrewDistractorPairs: [["צריך", "צָרִיךְ"], ["נכתוב", "נִכְתֹּב"], ["בעדינות", "בַּעֲדִינוּת"], ["כן", "כֵּן"], ["מצליח", "מַצְלִיחַ"]],
    englishDistractors: ["We should", "write carefully", "that", "is going to", "succeed"],
    notes: "לדבר דוגרי means to speak frankly or straight. זה לא הולך לעבוד is the colloquial future-like pattern 'this isn't going to work.'",
    hebrewAlternates: [{
      text: "בואי נדבר דוגרי: זה לא הולך לעבוד.", textNiqqud: "בּוֹאִי נְדַבֵּר דֻּגְרִי: זֶה לֹא הוֹלֵךְ לַעֲבֹד.",
      tokenPairs: [["בואי", "בּוֹאִי"], ["נדבר", "נְדַבֵּר"], ["דוגרי", "דֻּגְרִי"], ["זה", "זֶה"], ["לא", "לֹא"], ["הולך", "הוֹלֵךְ"], ["לעבוד", "לַעֲבֹד"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_51", emoji: "💔", category: "colloquial", difficulty: 2,
    hebrew: "האמת, קצת נפגעתי ממה שאמרת.", hebrewNiqqud: "הָאֱמֶת, קְצָת נִפְגַּעְתִּי מִמַּה שֶׁאָמַרְתָּ.",
    english: "Honestly, I was a little hurt by what you said.",
    hebrewTokenPairs: [["האמת", "הָאֱמֶת"], ["קצת", "קְצָת"], ["נפגעתי", "נִפְגַּעְתִּי"], ["ממה", "מִמַּה"], ["שאמרת", "שֶׁאָמַרְתָּ"]],
    englishTokens: ["Honestly", "I was", "a little hurt", "by what", "you said"],
    hebrewDistractorPairs: [["בצחוק", "בִּצְחוֹק"], ["מאוד", "מְאֹד"], ["שמחתי", "שָׂמַחְתִּי"], ["ממי", "מִמִּי"], ["שעשית", "שֶׁעָשִׂיתָ"]],
    englishDistractors: ["Jokingly", "I felt", "very happy", "because of who", "you did"],
    notes: "האמת can introduce a candid feeling. נפגעתי means 'I was hurt' emotionally and does not mark the speaker's gender."
  }),
  buildExpandedSentence({
    id: "colloquial_52", emoji: "🚩", category: "colloquial", difficulty: 3,
    hebrew: "הוא שולח לי מסרים מעורבים, ואני לא יודע איפה אני עומד.", hebrewNiqqud: "הוּא שׁוֹלֵחַ לִי מְסָרִים מְעֹרָבִים, וַאֲנִי לֹא יוֹדֵעַ אֵיפֹה אֲנִי עוֹמֵד.",
    english: "He's sending me mixed signals, and I don't know where I stand.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["שולח", "שׁוֹלֵחַ"], ["לי", "לִי"], ["מסרים מעורבים", "מְסָרִים מְעֹרָבִים"], ["ואני", "וַאֲנִי"], ["לא", "לֹא"], ["יודע", "יוֹדֵעַ"], ["איפה", "אֵיפֹה"], ["אני", "אֲנִי"], ["עומד", "עוֹמֵד"]],
    englishTokens: ["He's sending", "me", "mixed signals", "and I", "don't know", "where", "I stand"],
    hebrewDistractorPairs: [["היא", "הִיא"], ["מסביר", "מַסְבִּיר"], ["לה", "לָהּ"], ["מסרים ברורים", "מְסָרִים בְּרוּרִים"], ["מבין", "מֵבִין"], ["יושב", "יוֹשֵׁב"]],
    englishDistractors: ["She's explaining", "to her", "clear signals", "but I", "understand", "where I sit"],
    notes: "מסרים מעורבים means mixed signals. לא יודע איפה אני עומד is idiomatic: not knowing the status of the relationship.",
    hebrewAlternates: [{
      text: "הוא שולח לי מסרים מעורבים, ואני לא יודעת איפה אני עומדת.", textNiqqud: "הוּא שׁוֹלֵחַ לִי מְסָרִים מְעֹרָבִים, וַאֲנִי לֹא יוֹדַעַת אֵיפֹה אֲנִי עוֹמֶדֶת.",
      tokenPairs: [["הוא", "הוּא"], ["שולח", "שׁוֹלֵחַ"], ["לי", "לִי"], ["מסרים מעורבים", "מְסָרִים מְעֹרָבִים"], ["ואני", "וַאֲנִי"], ["לא", "לֹא"], ["יודעת", "יוֹדַעַת"], ["איפה", "אֵיפֹה"], ["אני", "אֲנִי"], ["עומדת", "עוֹמֶדֶת"]]
    }]
  }),
  buildExpandedSentence({
    id: "professional_26", emoji: "📋", category: "professional", difficulty: 2,
    hebrew: "לפני שמתחילים, נעבור בקצרה על סדר היום.", hebrewNiqqud: "לִפְנֵי שֶׁמַּתְחִילִים, נַעֲבֹר בִּקְצָרָה עַל סֵדֶר הַיּוֹם.",
    english: "Before we start, let's briefly go over the agenda.",
    hebrewTokenPairs: [["לפני", "לִפְנֵי"], ["שמתחילים", "שֶׁמַּתְחִילִים"], ["נעבור", "נַעֲבֹר"], ["בקצרה", "בִּקְצָרָה"], ["על", "עַל"], ["סדר היום", "סֵדֶר הַיּוֹם"]],
    englishTokens: ["Before we start", "let's briefly", "go over", "the agenda"],
    hebrewDistractorPairs: [["אחרי", "אַחֲרֵי"], ["שמסיימים", "שֶׁמְּסַיְּמִים"], ["נדלג", "נְדַלֵּג"], ["בפירוט", "בְּפֵרוּט"], ["פרוטוקול הישיבה", "פְּרוֹטוֹקוֹל הַיְּשִׁיבָה"]],
    englishDistractors: ["After we finish", "let's skip", "in detail", "the meeting minutes", "later"],
    notes: "לעבור על means to review or go over material. סדר היום is the agenda."
  }),
  buildExpandedSentence({
    id: "professional_27", emoji: "⏱️", category: "professional", difficulty: 2,
    hebrew: "אני יכול לסיים עד יום רביעי, לא לפני.", hebrewNiqqud: "אֲנִי יָכוֹל לְסַיֵּם עַד יוֹם רְבִיעִי, לֹא לִפְנֵי.",
    english: "I can finish by Wednesday, not before.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["יכול", "יָכוֹל"], ["לסיים", "לְסַיֵּם"], ["עד", "עַד"], ["יום", "יוֹם"], ["רביעי", "רְבִיעִי"], ["לא", "לֹא"], ["לפני", "לִפְנֵי"]],
    englishTokens: ["I can", "finish", "by", "Wednesday", "not", "before"],
    hebrewDistractorPairs: [["חייב", "חַיָּב"], ["להתחיל", "לְהַתְחִיל"], ["מיום", "מִיּוֹם"], ["שלישי", "שְׁלִישִׁי"], ["אחרי", "אַחֲרֵי"]],
    englishDistractors: ["I must", "start", "from", "Tuesday", "after"],
    notes: "עד יום רביעי sets Wednesday as the deadline. לא לפני makes the scheduling constraint explicit.",
    hebrewAlternates: [{
      text: "אני יכולה לסיים עד יום רביעי, לא לפני.", textNiqqud: "אֲנִי יְכוֹלָה לְסַיֵּם עַד יוֹם רְבִיעִי, לֹא לִפְנֵי.",
      tokenPairs: [["אני", "אֲנִי"], ["יכולה", "יְכוֹלָה"], ["לסיים", "לְסַיֵּם"], ["עד", "עַד"], ["יום", "יוֹם"], ["רביעי", "רְבִיעִי"], ["לא", "לֹא"], ["לפני", "לִפְנֵי"]]
    }]
  }),
  buildExpandedSentence({
    id: "professional_28", emoji: "⏳", category: "professional", difficulty: 2,
    hebrew: "אנחנו מחכים לתשובה מהלקוח לפני שנוכל להתקדם.", hebrewNiqqud: "אֲנַחְנוּ מְחַכִּים לִתְשׁוּבָה מֵהַלָּקוֹחַ לִפְנֵי שֶׁנּוּכַל לְהִתְקַדֵּם.",
    english: "We're waiting for the client's response before we can proceed.",
    hebrewTokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["מחכים", "מְחַכִּים"], ["לתשובה", "לִתְשׁוּבָה"], ["מהלקוח", "מֵהַלָּקוֹחַ"], ["לפני", "לִפְנֵי"], ["שנוכל", "שֶׁנּוּכַל"], ["להתקדם", "לְהִתְקַדֵּם"]],
    englishTokens: ["We're waiting for", "the client's response", "before", "we can", "proceed"],
    hebrewDistractorPairs: [["הם", "הֵם"], ["שולחים", "שׁוֹלְחִים"], ["בקשה", "בַּקָּשָׁה"], ["מהצוות", "מֵהַצֶּוֶת"], ["אחרי", "אַחֲרֵי"], ["לעצור", "לַעֲצֹר"]],
    englishDistractors: ["They're sending", "a request", "from the team", "after", "we need to", "stop"],
    notes: "לחכות לתשובה means to wait for a response. לפני שנוכל להתקדם frames the response as a blocker."
  }),
  buildExpandedSentence({
    id: "professional_29", emoji: "👤", category: "professional", difficulty: 2,
    hebrew: "מי אחראי על השלב הבא?", hebrewNiqqud: "מִי אַחְרַאי עַל הַשָּׁלָב הַבָּא?",
    english: "Who is responsible for the next step?",
    hebrewTokenPairs: [["מי", "מִי"], ["אחראי", "אַחְרַאי"], ["על", "עַל"], ["השלב", "הַשָּׁלָב"], ["הבא", "הַבָּא"]],
    englishTokens: ["Who is", "responsible for", "the next", "step"],
    hebrewDistractorPairs: [["מה", "מַה"], ["זכאי", "זַכַּאי"], ["בלי", "בְּלִי"], ["החלק", "הַחֵלֶק"], ["הקודם", "הַקּוֹדֵם"]],
    englishDistractors: ["What is", "eligible for", "the previous", "part", "without"],
    notes: "אחראי על is the standard workplace phrase for owning or being responsible for a task.",
    hebrewAlternates: [{
      text: "מי אחראית על השלב הבא?", textNiqqud: "מִי אַחְרָאִית עַל הַשָּׁלָב הַבָּא?",
      tokenPairs: [["מי", "מִי"], ["אחראית", "אַחְרָאִית"], ["על", "עַל"], ["השלב", "הַשָּׁלָב"], ["הבא", "הַבָּא"]]
    }]
  }),
  buildExpandedSentence({
    id: "professional_30", emoji: "✅", category: "professional", difficulty: 2,
    hebrew: "רק כדי לוודא שהבנתי: הבקשה היא לגרסה חדשה עד מחר?", hebrewNiqqud: "רַק כְּדֵי לְוַדֵּא שֶׁהֵבַנְתִּי: הַבַּקָּשָׁה הִיא לְגִרְסָה חֲדָשָׁה עַד מָחָר?",
    english: "Just to make sure I understood: is the request for a new version by tomorrow?",
    hebrewTokenPairs: [["רק", "רַק"], ["כדי", "כְּדֵי"], ["לוודא", "לְוַדֵּא"], ["שהבנתי", "שֶׁהֵבַנְתִּי"], ["הבקשה", "הַבַּקָּשָׁה"], ["היא", "הִיא"], ["לגרסה", "לְגִרְסָה"], ["חדשה", "חֲדָשָׁה"], ["עד", "עַד"], ["מחר", "מָחָר"]],
    englishTokens: ["Just to", "make sure", "I understood", "is the request", "for a new version", "by tomorrow"],
    hebrewDistractorPairs: [["כבר", "כְּבָר"], ["להוכיח", "לְהוֹכִיחַ"], ["ששכחתי", "שֶׁשָּׁכַחְתִּי"], ["ההצעה", "הַהַצָּעָה"], ["לטיוטה", "לְטִיּוּטָה"], ["בשבוע הבא", "בַּשָּׁבוּעַ הַבָּא"]],
    englishDistractors: ["Already", "to prove", "I forgot", "is the proposal", "for a draft", "next week"],
    notes: "רק כדי לוודא שהבנתי is a polite professional clarification opener: 'just to make sure I understood.'"
  }),
  buildExpandedSentence({
    id: "professional_31", emoji: "🔝", category: "professional", difficulty: 2,
    hebrew: "מה בעדיפות גבוהה יותר כרגע?", hebrewNiqqud: "מַה בַּעֲדִיפוּת גְּבוֹהָה יוֹתֵר כָּרֶגַע?",
    english: "What has higher priority right now?",
    hebrewTokenPairs: [["מה", "מַה"], ["בעדיפות", "בַּעֲדִיפוּת"], ["גבוהה", "גְּבוֹהָה"], ["יותר", "יוֹתֵר"], ["כרגע", "כָּרֶגַע"]],
    englishTokens: ["What has", "higher priority", "right now"],
    hebrewDistractorPairs: [["מי", "מִי"], ["באחריות", "בְּאַחֲרָיוּת"], ["נמוכה", "נְמוּכָה"], ["פחות", "פָּחוֹת"], ["בהמשך", "בַּהֶמְשֵׁךְ"]],
    englishDistractors: ["Who has", "lower priority", "later", "less", "responsibility"],
    notes: "בעדיפות גבוהה means high priority. כרגע narrows the question to what matters right now."
  }),
  buildExpandedSentence({
    id: "professional_32", emoji: "📐", category: "professional", difficulty: 2,
    hebrew: "הבקשה הזאת מחוץ להיקף שסיכמנו.", hebrewNiqqud: "הַבַּקָּשָׁה הַזֹּאת מִחוּץ לַהֶקֵּף שֶׁסִּכַּמְנוּ.",
    english: "This request is outside the scope we agreed on.",
    hebrewTokenPairs: [["הבקשה", "הַבַּקָּשָׁה"], ["הזאת", "הַזֹּאת"], ["מחוץ", "מִחוּץ"], ["להיקף", "לַהֶקֵּף"], ["שסיכמנו", "שֶׁסִּכַּמְנוּ"]],
    englishTokens: ["This request", "is outside", "the scope", "we agreed on"],
    hebrewDistractorPairs: [["הדרישה", "הַדְּרִישָׁה"], ["ההיא", "הַהִיא"], ["בתוך", "בְּתוֹךְ"], ["לתקציב", "לַתַּקְצִיב"], ["שהגדרנו", "שֶׁהִגְדַּרְנוּ"]],
    englishDistractors: ["That requirement", "is inside", "the budget", "we defined", "instead"],
    notes: "מחוץ להיקף is the professional expression for out of scope. שסיכמנו refers to what the parties previously agreed."
  }),
  buildExpandedSentence({
    id: "professional_33", emoji: "🧮", category: "professional", difficulty: 2,
    hebrew: "אשלח הערכת זמן ועלות עד סוף היום.", hebrewNiqqud: "אֶשְׁלַח הַעֲרָכַת זְמַן וְעָלוּת עַד סוֹף הַיּוֹם.",
    english: "I'll send a time and cost estimate by the end of the day.",
    hebrewTokenPairs: [["אשלח", "אֶשְׁלַח"], ["הערכת זמן ועלות", "הַעֲרָכַת זְמַן וְעָלוּת"], ["עד", "עַד"], ["סוף היום", "סוֹף הַיּוֹם"]],
    englishTokens: ["I'll send", "a time and cost estimate", "by", "the end of the day"],
    hebrewDistractorPairs: [["אקבל", "אֲקַבֵּל"], ["דוח מצב מפורט", "דּוּחַ מַצָּב מְפֹרָט"], ["אחרי", "אַחֲרֵי"], ["תחילת השבוע", "תְּחִלַּת הַשָּׁבוּעַ"]],
    englishDistractors: ["I'll receive", "a detailed status report", "after", "the start of the week"],
    notes: "הערכת זמן ועלות is an estimate of both duration and cost. עד סוף היום is a common work deadline."
  }),
  buildExpandedSentence({
    id: "professional_34", emoji: "📊", category: "professional", difficulty: 2,
    hebrew: "חסרים לנו נתונים כדי לקבל החלטה.", hebrewNiqqud: "חֲסֵרִים לָנוּ נְתוּנִים כְּדֵי לְקַבֵּל הַחְלָטָה.",
    english: "We're missing data needed to make a decision.",
    hebrewTokenPairs: [["חסרים", "חֲסֵרִים"], ["לנו", "לָנוּ"], ["נתונים", "נְתוּנִים"], ["כדי", "כְּדֵי"], ["לקבל", "לְקַבֵּל"], ["החלטה", "הַחְלָטָה"]],
    englishTokens: ["We're missing", "data", "needed to", "make", "a decision"],
    hebrewDistractorPairs: [["מספיקים", "מַסְפִּיקִים"], ["להם", "לָהֶם"], ["מסמכים", "מִסְמָכִים"], ["לפני", "לִפְנֵי"], ["לדחות", "לִדְחוֹת"], ["פגישה", "פְּגִישָׁה"]],
    englishDistractors: ["They have enough", "documents", "before", "postponing", "a meeting"],
    notes: "חסרים לנו literally means 'are missing to us.' לקבל החלטה is the standard collocation for making a decision."
  }),
  buildExpandedSentence({
    id: "professional_35", emoji: "⚠️", category: "professional", difficulty: 3,
    hebrew: "הסיכון העיקרי הוא עיכוב באספקה.", hebrewNiqqud: "הַסִּכּוּן הָעִקָּרִי הוּא עִכּוּב בָּאַסְפָּקָה.",
    english: "The main risk is a delay in delivery.",
    hebrewTokenPairs: [["הסיכון", "הַסִּכּוּן"], ["העיקרי", "הָעִקָּרִי"], ["הוא", "הוּא"], ["עיכוב", "עִכּוּב"], ["באספקה", "בָּאַסְפָּקָה"]],
    englishTokens: ["The main risk", "is", "a delay", "in delivery"],
    hebrewDistractorPairs: [["היתרון", "הַיִּתְרוֹן"], ["המשני", "הַמִּשְׁנִי"], ["היא", "הִיא"], ["שיפור", "שִׁפּוּר"], ["באיכות", "בָּאֵיכוּת"]],
    englishDistractors: ["The secondary benefit", "shows", "an improvement", "in quality", "instead"],
    notes: "הסיכון העיקרי identifies the primary risk. עיכוב באספקה is a delay in delivery or supply."
  }),
  buildExpandedSentence({
    id: "professional_36", emoji: "▶️", category: "professional", difficulty: 3,
    hebrew: "אם אין התנגדויות, נמשיך לפי התוכנית.", hebrewNiqqud: "אִם אֵין הִתְנַגְּדֻיּוֹת, נַמְשִׁיךְ לְפִי הַתָּכְנִית.",
    english: "If there are no objections, we'll proceed according to plan.",
    hebrewTokenPairs: [["אם", "אִם"], ["אין", "אֵין"], ["התנגדויות", "הִתְנַגְּדֻיּוֹת"], ["נמשיך", "נַמְשִׁיךְ"], ["לפי", "לְפִי"], ["התוכנית", "הַתָּכְנִית"]],
    englishTokens: ["If there are", "no objections", "we'll proceed", "according to", "plan"],
    hebrewDistractorPairs: [["כאשר", "כַּאֲשֶׁר"], ["יש", "יֵשׁ"], ["הצעות", "הַצָּעוֹת"], ["נעצור", "נַעֲצֹר"], ["בניגוד", "בְּנִגּוּד"], ["להסכם", "לַהֶסְכֵּם"]],
    englishDistractors: ["When there are", "several proposals", "we'll stop", "contrary to", "the agreement"],
    notes: "אם אין התנגדויות is formal meeting language for proceeding unless someone objects. לפי means according to."
  }),
  buildExpandedSentence({
    id: "professional_37", emoji: "🏢", category: "professional", difficulty: 3,
    hebrew: "אם הבעיה לא תיפתר היום, נעביר את הנושא להנהלה.", hebrewNiqqud: "אִם הַבְּעָיָה לֹא תִּפָּתֵר הַיּוֹם, נַעֲבִיר אֶת הַנּוֹשֵׂא לַהַנְהָלָה.",
    english: "If the problem isn't resolved today, we'll take the matter to management.",
    hebrewTokenPairs: [["אם", "אִם"], ["הבעיה", "הַבְּעָיָה"], ["לא", "לֹא"], ["תיפתר", "תִּפָּתֵר"], ["היום", "הַיּוֹם"], ["נעביר", "נַעֲבִיר"], ["את", "אֶת"], ["הנושא", "הַנּוֹשֵׂא"], ["להנהלה", "לַהַנְהָלָה"]],
    englishTokens: ["If the problem", "isn't resolved", "today", "we'll take", "the matter", "to management"],
    hebrewDistractorPairs: [["כאשר", "כַּאֲשֶׁר"], ["הבקשה", "הַבַּקָּשָׁה"], ["תידחה", "תִּדָּחֶה"], ["מחר", "מָחָר"], ["נחזיר", "נַחֲזִיר"], ["לצוות", "לַצֶּוֶת"]],
    englishDistractors: ["When the request", "is postponed", "tomorrow", "we'll return", "the task", "to the team"],
    notes: "להעביר את הנושא להנהלה is a natural professional escalation phrase without using an English loan verb."
  }),
  buildExpandedSentence({
    id: "formal_29", emoji: "🔎", category: "formal", difficulty: 3,
    hebrew: "יש להעריך את מהימנות המקורות לפני שמסתמכים עליהם.", hebrewNiqqud: "יֵשׁ לְהַעֲרִיךְ אֶת מְהֵימָנוּת הַמְּקוֹרוֹת לִפְנֵי שֶׁמִּסְתַּמְּכִים עֲלֵיהֶם.",
    english: "The reliability of the sources should be assessed before relying on them.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["להעריך", "לְהַעֲרִיךְ"], ["את", "אֶת"], ["מהימנות", "מְהֵימָנוּת"], ["המקורות", "הַמְּקוֹרוֹת"], ["לפני", "לִפְנֵי"], ["שמסתמכים", "שֶׁמִּסְתַּמְּכִים"], ["עליהם", "עֲלֵיהֶם"]],
    englishTokens: ["The reliability", "of the sources", "should be assessed", "before", "relying on them"],
    hebrewDistractorPairs: [["ניתן", "נִתָּן"], ["להוכיח", "לְהוֹכִיחַ"], ["דיוק", "דִּיּוּק"], ["הממצאים", "הַמִּמְצָאִים"], ["אחרי", "אַחֲרֵי"], ["שמתעלמים מהם", "שֶׁמִּתְעַלְּמִים מֵהֶם"]],
    englishDistractors: ["The accuracy", "of the findings", "can be proven", "after", "ignoring them"],
    notes: "יש להעריך is an impersonal formal recommendation. מהימנות refers to reliability or trustworthiness of sources."
  }),
  buildExpandedSentence({
    id: "formal_30", emoji: "🔗", category: "formal", difficulty: 3,
    hebrew: "מתאם בין המשתנים אינו מעיד בהכרח על קשר סיבתי.", hebrewNiqqud: "מִתְאָם בֵּין הַמִּשְׁתַּנִּים אֵינוֹ מֵעִיד בְּהֶכְרֵחַ עַל קֶשֶׁר סִבָּתִי.",
    english: "A correlation between the variables does not necessarily indicate a causal relationship.",
    hebrewTokenPairs: [["מתאם", "מִתְאָם"], ["בין", "בֵּין"], ["המשתנים", "הַמִּשְׁתַּנִּים"], ["אינו", "אֵינוֹ"], ["מעיד", "מֵעִיד"], ["בהכרח", "בְּהֶכְרֵחַ"], ["על", "עַל"], ["קשר סיבתי", "קֶשֶׁר סִבָּתִי"]],
    englishTokens: ["A correlation", "between", "the variables", "does not necessarily", "indicate", "a causal relationship"],
    hebrewDistractorPairs: [["הבדל", "הֶבְדֵּל"], ["בתוך", "בְּתוֹךְ"], ["הקבוצות", "הַקְּבוּצוֹת"], ["בהחלט", "בְּהֶחְלֵט"], ["מוכיח", "מוֹכִיחַ"], ["קשר מקרי", "קֶשֶׁר מִקְרִי"]],
    englishDistractors: ["A difference", "within", "the groups", "definitely", "proves", "a random relationship"],
    notes: "אינו מעיד בהכרח is a formal caution that something does not necessarily indicate a conclusion. קשר סיבתי is a causal relationship."
  }),
  buildExpandedSentence({
    id: "formal_31", emoji: "🧪", category: "formal", difficulty: 3,
    hebrew: "אחת ממגבלות המחקר היא היעדר קבוצת ביקורת.", hebrewNiqqud: "אַחַת מִמִּגְבְּלוֹת הַמֶּחְקָר הִיא הֶעְדֵּר קְבוּצַת בִּקֹּרֶת.",
    english: "One limitation of the study is the absence of a control group.",
    hebrewTokenPairs: [["אחת", "אַחַת"], ["ממגבלות", "מִמִּגְבְּלוֹת"], ["המחקר", "הַמֶּחְקָר"], ["היא", "הִיא"], ["היעדר", "הֶעְדֵּר"], ["קבוצת ביקורת", "קְבוּצַת בִּקֹּרֶת"]],
    englishTokens: ["One limitation", "of the study", "is", "the absence", "of a control group"],
    hebrewDistractorPairs: [["יתרון", "יִתְרוֹן"], ["מהניתוח", "מֵהַנִּתּוּחַ"], ["הוא", "הוּא"], ["קיומה", "קִיּוּמָהּ"], ["קבוצת ניסוי", "קְבוּצַת נִסּוּי"]],
    englishDistractors: ["One advantage", "of the analysis", "includes", "the presence", "of an experimental group"],
    notes: "אחת ממגבלות המחקר introduces a study limitation. היעדר means absence, and קבוצת ביקורת is a control group."
  }),
  buildExpandedSentence({
    id: "formal_32", emoji: "👥", category: "formal", difficulty: 3,
    hebrew: "אין להכליל מן המדגם הזה על כלל האוכלוסייה.", hebrewNiqqud: "אֵין לְהַכְלִיל מִן הַמִּדְגָּם הַזֶּה עַל כְּלַל הָאֻכְלוּסִיָּה.",
    english: "Findings from this sample should not be generalized to the entire population.",
    hebrewTokenPairs: [["אין", "אֵין"], ["להכליל", "לְהַכְלִיל"], ["מן", "מִן"], ["המדגם", "הַמִּדְגָּם"], ["הזה", "הַזֶּה"], ["על", "עַל"], ["כלל האוכלוסייה", "כְּלַל הָאֻכְלוּסִיָּה"]],
    englishTokens: ["Findings", "from this sample", "should not be generalized", "to", "the entire population"],
    hebrewDistractorPairs: [["יש", "יֵשׁ"], ["להסיק", "לְהַסִּיק"], ["מתוך", "מִתּוֹךְ"], ["המחקר", "הַמֶּחְקָר"], ["ההוא", "הַהוּא"], ["חלק מהאוכלוסייה", "חֵלֶק מֵהָאֻכְלוּסִיָּה"]],
    englishDistractors: ["Conclusions", "from that study", "should be drawn", "about", "part of the population"],
    notes: "אין להכליל is a formal warning not to generalize. כלל האוכלוסייה means the population as a whole."
  }),
  buildExpandedSentence({
    id: "formal_33", emoji: "🧩", category: "formal", difficulty: 3,
    hebrew: "הסבר חלופי עשוי להתאים לנתונים באותה מידה.", hebrewNiqqud: "הֶסְבֵּר חֲלוּפִי עָשׂוּי לְהַתְאִים לַנְּתוּנִים בְּאוֹתָהּ מִדָּה.",
    english: "An alternative explanation may fit the data equally well.",
    hebrewTokenPairs: [["הסבר", "הֶסְבֵּר"], ["חלופי", "חֲלוּפִי"], ["עשוי", "עָשׂוּי"], ["להתאים", "לְהַתְאִים"], ["לנתונים", "לַנְּתוּנִים"], ["באותה מידה", "בְּאוֹתָהּ מִדָּה"]],
    englishTokens: ["An alternative", "explanation", "may", "fit", "the data", "equally well"],
    hebrewDistractorPairs: [["פתרון", "פִּתְרוֹן"], ["ראשוני", "רִאשׁוֹנִי"], ["חייב", "חַיָּב"], ["לסתור", "לִסְתֹּר"], ["את הממצאים", "אֶת הַמִּמְצָאִים"], ["באופן חלקי", "בְּאֹפֶן חֶלְקִי"]],
    englishDistractors: ["An initial", "solution", "must", "contradict", "the findings", "partially"],
    notes: "הסבר חלופי is an alternative explanation. באותה מידה means to the same degree or equally well."
  }),
  buildExpandedSentence({
    id: "formal_34", emoji: "❔", category: "formal", difficulty: 3,
    hebrew: "רמת אי־הוודאות גבוהה מכדי להסיק מסקנה נחרצת.", hebrewNiqqud: "רָמַת אִי־הַוַּדָּאוּת גְּבוֹהָה מִכְּדֵי לְהַסִּיק מַסְקָנָה נֶחְרֶצֶת.",
    english: "The level of uncertainty is too high to draw a definitive conclusion.",
    hebrewTokenPairs: [["רמת", "רָמַת"], ["אי־הוודאות", "אִי־הַוַּדָּאוּת"], ["גבוהה", "גְּבוֹהָה"], ["מכדי", "מִכְּדֵי"], ["להסיק", "לְהַסִּיק"], ["מסקנה", "מַסְקָנָה"], ["נחרצת", "נֶחְרֶצֶת"]],
    englishTokens: ["The level", "of uncertainty", "is too high", "to draw", "a definitive", "conclusion"],
    hebrewDistractorPairs: [["מידת", "מִדַּת"], ["הביטחון", "הַבִּטָּחוֹן"], ["נמוכה", "נְמוּכָה"], ["מספיק כדי", "מַסְפִּיק כְּדֵי"], ["לדחות", "לִדְחוֹת"], ["השערה זמנית", "הַשְׁעָרָה זְמַנִּית"]],
    englishDistractors: ["The degree", "of confidence", "is low enough", "to reject", "a temporary", "hypothesis"],
    notes: "מכדי plus an infinitive means 'too ... to.' מסקנה נחרצת is a definitive or categorical conclusion."
  }),
  buildExpandedSentence({
    id: "formal_35", emoji: "⚖️", category: "formal", difficulty: 3,
    hebrew: "יש להביא בחשבון גם את ההשלכות האתיות.", hebrewNiqqud: "יֵשׁ לְהָבִיא בְּחֶשְׁבּוֹן גַּם אֶת הַהַשְׁלָכוֹת הָאֶתִיּוֹת.",
    english: "The ethical implications must also be taken into account.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["להביא בחשבון", "לְהָבִיא בְּחֶשְׁבּוֹן"], ["גם", "גַּם"], ["את", "אֶת"], ["ההשלכות", "הַהַשְׁלָכוֹת"], ["האתיות", "הָאֶתִיּוֹת"]],
    englishTokens: ["The ethical implications", "must also", "be taken into account"],
    hebrewDistractorPairs: [["ניתן", "נִתָּן"], ["להוציא מהחשבון", "לְהוֹצִיא מֵהַחֶשְׁבּוֹן"], ["רק", "רַק"], ["היתרונות", "הַיִּתְרוֹנוֹת"], ["הכלכליים", "הַכַּלְכָּלִיִּים"]],
    englishDistractors: ["The economic advantages", "can only", "be left out", "instead", "partially"],
    notes: "להביא בחשבון means to take into account. ההשלכות האתיות are the ethical implications or consequences."
  }),
  buildExpandedSentence({
    id: "formal_36", emoji: "🤝", category: "formal", difficulty: 3,
    hebrew: "יישום ההמלצה מחייב תיאום בין כמה גורמים.", hebrewNiqqud: "יִשּׂוּם הַהַמְלָצָה מְחַיֵּב תֵּאוּם בֵּין כַּמָּה גּוֹרְמִים.",
    english: "Implementing the recommendation requires coordination among several parties.",
    hebrewTokenPairs: [["יישום", "יִשּׂוּם"], ["ההמלצה", "הַהַמְלָצָה"], ["מחייב", "מְחַיֵּב"], ["תיאום", "תֵּאוּם"], ["בין", "בֵּין"], ["כמה", "כַּמָּה"], ["גורמים", "גּוֹרְמִים"]],
    englishTokens: ["Implementing", "the recommendation", "requires", "coordination", "among", "several parties"],
    hebrewDistractorPairs: [["דחיית", "דְּחִיַּת"], ["ההחלטה", "הַהַחְלָטָה"], ["מונעת", "מוֹנַעַת"], ["תחרות", "תַּחֲרוּת"], ["בתוך", "בְּתוֹךְ"], ["גורם אחד", "גּוֹרֵם אֶחָד"]],
    englishDistractors: ["Postponing", "the decision", "prevents", "competition", "within", "one party"],
    notes: "יישום is implementation. מחייב תיאום means requires coordination, and גורמים refers to involved parties or bodies."
  }),
  buildExpandedSentence({
    id: "everyday_61", emoji: "🏷️", category: "everyday", difficulty: 2,
    hebrew: "זה לא הגיוני לשלם מחיר מלא על מוצר פגום.", hebrewNiqqud: "זֶה לֹא הֶגְיוֹנִי לְשַׁלֵּם מְחִיר מָלֵא עַל מוּצָר פָּגוּם.",
    english: "It doesn't make sense to pay full price for a defective product.",
    hebrewTokenPairs: [["זה", "זֶה"], ["לא", "לֹא"], ["הגיוני", "הֶגְיוֹנִי"], ["לשלם", "לְשַׁלֵּם"], ["מחיר", "מְחִיר"], ["מלא", "מָלֵא"], ["על", "עַל"], ["מוצר", "מוּצָר"], ["פגום", "פָּגוּם"]],
    englishTokens: ["It doesn't", "make sense", "to pay", "full price", "for", "a defective product"],
    hebrewDistractorPairs: [["כדאי", "כְּדַאי"], ["לקבל", "לְקַבֵּל"], ["הנחה", "הֲנָחָה"], ["חלקי", "חֶלְקִי"], ["שירות", "שֵׁרוּת"], ["חדש", "חָדָשׁ"]],
    englishDistractors: ["It is worthwhile", "to receive", "a discount", "partial payment", "for a new service"],
    notes: "הגיוני means logical, reasonable, or making sense. A full infinitive phrase can come either before or after זה לא הגיוני."
  }),
  buildExpandedSentence({
    id: "colloquial_53", emoji: "🧠", category: "colloquial", difficulty: 2,
    hebrew: "זה נשמע הגיוני, אבל אני רוצה לבדוק את הפרטים.", hebrewNiqqud: "זֶה נִשְׁמָע הֶגְיוֹנִי, אֲבָל אֲנִי רוֹצֶה לִבְדֹּק אֶת הַפְּרָטִים.",
    english: "That sounds reasonable, but I want to check the details.",
    hebrewTokenPairs: [["זה", "זֶה"], ["נשמע", "נִשְׁמָע"], ["הגיוני", "הֶגְיוֹנִי"], ["אבל", "אֲבָל"], ["אני", "אֲנִי"], ["רוצה", "רוֹצֶה"], ["לבדוק", "לִבְדֹּק"], ["את", "אֶת"], ["הפרטים", "הַפְּרָטִים"]],
    englishTokens: ["That", "sounds", "reasonable", "but", "I want", "to check", "the details"],
    hebrewDistractorPairs: [["מרגיש", "מַרְגִּישׁ"], ["מוזר", "מוּזָר"], ["למרות", "לַמְרוֹת"], ["מעדיף", "מַעֲדִיף"], ["לשנות", "לְשַׁנּוֹת"], ["התוכנית", "הַתָּכְנִית"]],
    englishDistractors: ["This feels", "strange", "although", "I prefer", "to change", "the plan"],
    notes: "נשמע הגיוני is the everyday way to say that an idea sounds reasonable or makes sense."
  })
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION);

const SENTENCE_EXPANSION_ROUND2 = [
  buildExpandedSentence({
    id: "everyday_62", emoji: "💊", category: "everyday", difficulty: 2,
    hebrew: "אני צריכה לחדש את המרשם לפני סוף החודש.", hebrewNiqqud: "אֲנִי צְרִיכָה לְחַדֵּשׁ אֶת הַמִּרְשָׁם לִפְנֵי סוֹף הַחֹדֶשׁ.",
    english: "I need to renew the prescription before the end of the month.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["צריכה", "צְרִיכָה"], ["לחדש", "לְחַדֵּשׁ"], ["את", "אֶת"], ["המרשם", "הַמִּרְשָׁם"], ["לפני", "לִפְנֵי"], ["סוף", "סוֹף"], ["החודש", "הַחֹדֶשׁ"]],
    englishTokens: ["I", "need", "to renew", "the prescription", "before", "the end", "of the month"],
    hebrewDistractorPairs: [["צריך", "צָרִיךְ"], ["לבטל", "לְבַטֵּל"], ["התור", "הַתּוֹר"], ["אחרי", "אַחֲרֵי"], ["תחילת", "תְּחִלַּת"]],
    englishDistractors: ["I don't need", "to cancel", "the appointment", "after", "the beginning", "of the week"],
    notes: "צריכה agrees with a feminine speaker — the masculine צריך is the gender swap distractor. לחדש (renew) vs לבטל (cancel) is the verb trap.",
    hebrewAlternates: [{
      text: "אני צריך לחדש את המרשם לפני סוף החודש.", textNiqqud: "אֲנִי צָרִיךְ לְחַדֵּשׁ אֶת הַמִּרְשָׁם לִפְנֵי סוֹף הַחֹדֶשׁ.",
      tokenPairs: [["אני", "אֲנִי"], ["צריך", "צָרִיךְ"], ["לחדש", "לְחַדֵּשׁ"], ["את", "אֶת"], ["המרשם", "הַמִּרְשָׁם"], ["לפני", "לִפְנֵי"], ["סוף", "סוֹף"], ["החודש", "הַחֹדֶשׁ"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_63", emoji: "🤕", category: "everyday", difficulty: 1,
    hebrew: "יש לי כאב ראש חזק מהבוקר.", hebrewNiqqud: "יֵשׁ לִי כְּאֵב רֹאשׁ חָזָק מֵהַבֹּקֶר.",
    english: "I've had a bad headache since the morning.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["לי", "לִי"], ["כאב ראש", "כְּאֵב רֹאשׁ"], ["חזק", "חָזָק"], ["מהבוקר", "מֵהַבֹּקֶר"]],
    englishTokens: ["I've had", "a bad", "headache", "since the morning"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["לה", "לָהּ"], ["כאב בטן", "כְּאֵב בֶּטֶן"], ["חלש", "חַלָּשׁ"], ["מהערב", "מֵהָעֶרֶב"]],
    englishDistractors: ["She has", "a mild", "stomachache", "since the evening", "I don't have"],
    notes: "כאב ראש (headache) stays one compound chip; כאב בטן (stomachache) is the matching compound distractor. חזק here means 'bad/strong'."
  }),
  buildExpandedSentence({
    id: "everyday_64", emoji: "🩺", category: "everyday", difficulty: 2,
    hebrew: "הרופאה אמרה לי לנוח ולשתות הרבה מים.", hebrewNiqqud: "הָרוֹפְאָה אָמְרָה לִי לָנוּחַ וְלִשְׁתּוֹת הַרְבֵּה מַיִם.",
    english: "The doctor told me to rest and drink a lot of water.",
    hebrewTokenPairs: [["הרופאה", "הָרוֹפְאָה"], ["אמרה", "אָמְרָה"], ["לי", "לִי"], ["לנוח", "לָנוּחַ"], ["ולשתות", "וְלִשְׁתּוֹת"], ["הרבה", "הַרְבֵּה"], ["מים", "מַיִם"]],
    englishTokens: ["The doctor", "told", "me", "to rest", "and drink", "a lot of", "water"],
    hebrewDistractorPairs: [["הרופא", "הָרוֹפֵא"], ["אמר", "אָמַר"], ["לרוץ", "לָרוּץ"], ["ולאכול", "וְלֶאֱכֹל"], ["קפה", "קָפֶה"]],
    englishDistractors: ["The nurse", "asked", "him", "to run", "and eat", "coffee"],
    notes: "הרופאה is a female doctor — אמרה agrees with her; the masculine pair הרופא/אמר is the gender swap distractor set."
  }),
  buildExpandedSentence({
    id: "everyday_65", emoji: "🩸", category: "everyday", difficulty: 2,
    hebrew: "קבעתי תור לבדיקת דם ביום ראשון בבוקר.", hebrewNiqqud: "קָבַעְתִּי תּוֹר לִבְדִיקַת דָּם בְּיוֹם רִאשׁוֹן בַּבֹּקֶר.",
    english: "I made an appointment for a blood test on Sunday morning.",
    hebrewTokenPairs: [["קבעתי", "קָבַעְתִּי"], ["תור", "תּוֹר"], ["לבדיקת דם", "לִבְדִיקַת דָּם"], ["ביום ראשון", "בְּיוֹם רִאשׁוֹן"], ["בבוקר", "בַּבֹּקֶר"]],
    englishTokens: ["I made", "an appointment", "for a blood test", "on Sunday", "morning"],
    hebrewDistractorPairs: [["ביטלתי", "בִּטַּלְתִּי"], ["פגישה", "פְּגִישָׁה"], ["לבדיקת עיניים", "לִבְדִיקַת עֵינַיִם"], ["ביום שלישי", "בְּיוֹם שְׁלִישִׁי"], ["בערב", "בָּעֶרֶב"]],
    englishDistractors: ["I canceled", "a meeting", "for an eye exam", "on Tuesday", "evening"],
    notes: "בדיקת דם (blood test) and ביום ראשון (on Sunday) are compound chips; the traps swap them for בדיקת עיניים and ביום שלישי."
  }),
  buildExpandedSentence({
    id: "everyday_66", emoji: "🏥", category: "everyday", difficulty: 2,
    hebrew: "איפה יש בית מרקחת שפתוח עכשיו?", hebrewNiqqud: "אֵיפֹה יֵשׁ בֵּית מִרְקַחַת שֶׁפָּתוּחַ עַכְשָׁו?",
    english: "Where is there a pharmacy that's open now?",
    hebrewTokenPairs: [["איפה", "אֵיפֹה"], ["יש", "יֵשׁ"], ["בית מרקחת", "בֵּית מִרְקַחַת"], ["שפתוח", "שֶׁפָּתוּחַ"], ["עכשיו", "עַכְשָׁו"]],
    englishTokens: ["Where", "is there", "a pharmacy", "that's open", "now"],
    hebrewDistractorPairs: [["מתי", "מָתַי"], ["אין", "אֵין"], ["בית חולים", "בֵּית חוֹלִים"], ["שסגור", "שֶׁסָּגוּר"], ["הלילה", "הַלַּיְלָה"]],
    englishDistractors: ["When", "isn't there", "a hospital", "that's closed", "tonight"],
    notes: "בית מרקחת (pharmacy) is a construct compound kept as one chip; בית חולים (hospital) is the compound trap. שפתוח = 'that is open' with the ש relative prefix."
  }),
  buildExpandedSentence({
    id: "everyday_67", emoji: "🧅", category: "everyday", difficulty: 2,
    hebrew: "תקצצי את הבצל ואני אטגן אותו בשמן זית.", hebrewNiqqud: "תְּקַצְּצִי אֶת הַבָּצָל וַאֲנִי אֲטַגֵּן אוֹתוֹ בְּשֶׁמֶן זַיִת.",
    english: "Chop the onion and I'll fry it in olive oil.",
    hebrewTokenPairs: [["תקצצי", "תְּקַצְּצִי"], ["את", "אֶת"], ["הבצל", "הַבָּצָל"], ["ואני", "וַאֲנִי"], ["אטגן", "אֲטַגֵּן"], ["אותו", "אוֹתוֹ"], ["בשמן זית", "בְּשֶׁמֶן זַיִת"]],
    englishTokens: ["Chop", "the onion", "and", "I'll fry", "it", "in olive oil"],
    hebrewDistractorPairs: [["תקצוץ", "תִּקְצֹץ"], ["העגבנייה", "הָעַגְבָנִיָּה"], ["אבשל", "אֲבַשֵּׁל"], ["אותה", "אוֹתָהּ"], ["במי ברז", "בְּמֵי בֶּרֶז"]],
    englishDistractors: ["Peel", "the tomato", "I'll boil", "them", "in tap water"],
    notes: "תקצצי is the feminine imperative — the masculine תקצוץ is the gender swap trap. שמן זית (olive oil) stays one compound chip with מי ברז (tap water) as its matching compound distractor. אותו refers back to the masculine בצל.",
    hebrewAlternates: [{
      text: "תקצוץ את הבצל ואני אטגן אותו בשמן זית.", textNiqqud: "תִּקְצֹץ אֶת הַבָּצָל וַאֲנִי אֲטַגֵּן אוֹתוֹ בְּשֶׁמֶן זַיִת.",
      tokenPairs: [["תקצוץ", "תִּקְצֹץ"], ["את", "אֶת"], ["הבצל", "הַבָּצָל"], ["ואני", "וַאֲנִי"], ["אטגן", "אֲטַגֵּן"], ["אותו", "אוֹתוֹ"], ["בשמן זית", "בְּשֶׁמֶן זַיִת"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_68", emoji: "🍅", category: "everyday", difficulty: 1,
    hebrew: "כמה עולה קילו עגבניות היום?", hebrewNiqqud: "כַּמָּה עוֹלֶה קִילוֹ עַגְבָנִיּוֹת הַיּוֹם?",
    english: "How much does a kilo of tomatoes cost today?",
    hebrewTokenPairs: [["כמה", "כַּמָּה"], ["עולה", "עוֹלֶה"], ["קילו", "קִילוֹ"], ["עגבניות", "עַגְבָנִיּוֹת"], ["היום", "הַיּוֹם"]],
    englishTokens: ["How much", "does", "a kilo", "of tomatoes", "cost", "today"],
    hebrewDistractorPairs: [["מתי", "מָתַי"], ["שוקל", "שׁוֹקֵל"], ["חצי", "חֲצִי"], ["מלפפונים", "מְלָפְפוֹנִים"], ["מחר", "מָחָר"]],
    englishDistractors: ["When", "half", "of cucumbers", "weigh", "tomorrow"],
    notes: "עולה here means 'costs' — the same verb as 'goes up'. שוקל (weighs) is the verb trap; מלפפונים (cucumbers) the produce swap."
  }),
  buildExpandedSentence({
    id: "everyday_69", emoji: "🥚", category: "everyday", difficulty: 1,
    hebrew: "שכחתי להוסיף ביצים לרשימת הקניות.", hebrewNiqqud: "שָׁכַחְתִּי לְהוֹסִיף בֵּיצִים לִרְשִׁימַת הַקְּנִיּוֹת.",
    english: "I forgot to add eggs to the shopping list.",
    hebrewTokenPairs: [["שכחתי", "שָׁכַחְתִּי"], ["להוסיף", "לְהוֹסִיף"], ["ביצים", "בֵּיצִים"], ["לרשימת הקניות", "לִרְשִׁימַת הַקְּנִיּוֹת"]],
    englishTokens: ["I forgot", "to add", "eggs", "to the shopping list"],
    hebrewDistractorPairs: [["זכרתי", "זָכַרְתִּי"], ["לקנות", "לִקְנוֹת"], ["חלב", "חָלָב"], ["לסל הקניות", "לְסַל הַקְּנִיּוֹת"], ["מהשוק", "מֵהַשּׁוּק"]],
    englishDistractors: ["I remembered", "to buy", "milk", "to the shopping cart", "from the market"],
    notes: "רשימת הקניות (the shopping list) is a construct compound chip; סל הקניות (the shopping cart) is its compound trap. זכרתי (I remembered) is the opposite of שכחתי."
  }),
  buildExpandedSentence({
    id: "everyday_70", emoji: "🍰", category: "everyday", difficulty: 2,
    hebrew: "העוגה צריכה עוד עשר דקות בתנור.", hebrewNiqqud: "הָעוּגָה צְרִיכָה עוֹד עֶשֶׂר דַּקּוֹת בַּתַּנּוּר.",
    english: "The cake needs ten more minutes in the oven.",
    hebrewTokenPairs: [["העוגה", "הָעוּגָה"], ["צריכה", "צְרִיכָה"], ["עוד", "עוֹד"], ["עשר", "עֶשֶׂר"], ["דקות", "דַּקּוֹת"], ["בתנור", "בַּתַּנּוּר"]],
    englishTokens: ["The cake", "needs", "ten", "more", "minutes", "in the oven"],
    hebrewDistractorPairs: [["המרק", "הַמָּרָק"], ["צריך", "צָרִיךְ"], ["חמש", "חָמֵשׁ"], ["שעות", "שָׁעוֹת"], ["במקרר", "בַּמְּקָרֵר"]],
    englishDistractors: ["The soup", "five", "hours", "in the fridge", "still"],
    notes: "צריכה agrees with the feminine עוגה — the masculine צריך would suit המרק, the distractor noun. Classic noun-verb agreement drill."
  }),
  buildExpandedSentence({
    id: "everyday_71", emoji: "🍲", category: "everyday", difficulty: 1,
    hebrew: "המרק יצא ממש טעים, רוצה לטעום?", hebrewNiqqud: "הַמָּרָק יָצָא מַמָּשׁ טָעִים, רוֹצֶה לִטְעֹם?",
    english: "The soup came out really tasty, want a taste?",
    hebrewTokenPairs: [["המרק", "הַמָּרָק"], ["יצא", "יָצָא"], ["ממש", "מַמָּשׁ"], ["טעים", "טָעִים"], ["רוצה", "רוֹצֶה"], ["לטעום", "לִטְעֹם"]],
    englishTokens: ["The soup", "came out", "really", "tasty", "want", "a taste"],
    hebrewDistractorPairs: [["הסלט", "הַסָּלָט"], ["נשאר", "נִשְׁאַר"], ["מגעיל", "מַגְעִיל"], ["יכולה", "יְכוֹלָה"], ["לבשל", "לְבַשֵּׁל"]],
    englishDistractors: ["The salad", "stayed", "disgusting", "can you", "to cook"],
    notes: "יצא is used idiomatically — the soup 'came out' tasty. ממש means 'really' and is a flexible modifier; מגעיל (disgusting) is the opposite trap."
  }),
  buildExpandedSentence({
    id: "everyday_72", emoji: "🧰", category: "everyday", difficulty: 2,
    hebrew: "הטכנאי יגיע מחר בבוקר לתקן את המקרר.", hebrewNiqqud: "הַטֶּכְנַאי יַגִּיעַ מָחָר בַּבֹּקֶר לְתַקֵּן אֶת הַמְּקָרֵר.",
    english: "The technician will arrive tomorrow morning to fix the refrigerator.",
    hebrewTokenPairs: [["הטכנאי", "הַטֶּכְנַאי"], ["יגיע", "יַגִּיעַ"], ["מחר", "מָחָר"], ["בבוקר", "בַּבֹּקֶר"], ["לתקן", "לְתַקֵּן"], ["את", "אֶת"], ["המקרר", "הַמְּקָרֵר"]],
    englishTokens: ["The technician", "will arrive", "tomorrow", "morning", "to fix", "the refrigerator"],
    hebrewDistractorPairs: [["הגיע", "הִגִּיעַ"], ["השכן", "הַשָּׁכֵן"], ["בערב", "בָּעֶרֶב"], ["לנקות", "לְנַקּוֹת"], ["המדיח", "הַמֵּדִיחַ"]],
    englishDistractors: ["arrived", "The neighbor", "evening", "to clean", "the dishwasher"],
    notes: "יגיע is true future — הגיע (arrived) is the tense trap. לתקן (fix) vs לנקות (clean), מקרר (refrigerator) vs מדיח (dishwasher)."
  }),
  buildExpandedSentence({
    id: "everyday_73", emoji: "🏢", category: "everyday", difficulty: 2,
    hebrew: "השכנים החדשים עברו לדירה שמעלינו בשבוע שעבר.", hebrewNiqqud: "הַשְּׁכֵנִים הַחֲדָשִׁים עָבְרוּ לַדִּירָה שֶׁמֵּעָלֵינוּ בַּשָּׁבוּעַ שֶׁעָבַר.",
    english: "The new neighbors moved into the apartment above us last week.",
    hebrewTokenPairs: [["השכנים", "הַשְּׁכֵנִים"], ["החדשים", "הַחֲדָשִׁים"], ["עברו", "עָבְרוּ"], ["לדירה", "לַדִּירָה"], ["שמעלינו", "שֶׁמֵּעָלֵינוּ"], ["בשבוע שעבר", "בַּשָּׁבוּעַ שֶׁעָבַר"]],
    englishTokens: ["The new", "neighbors", "moved", "into the apartment", "above us", "last week"],
    hebrewDistractorPairs: [["הישנים", "הַיְשָׁנִים"], ["עברה", "עָבְרָה"], ["לבניין", "לַבִּנְיָן"], ["שמתחתינו", "שֶׁמִּתַּחְתֵּינוּ"], ["בחודש שעבר", "בַּחֹדֶשׁ שֶׁעָבַר"]],
    englishDistractors: ["The old", "neighbor", "into the building", "below us", "last month"],
    notes: "עברו agrees with plural שכנים; עברה (she moved) is the number/gender trap. בשבוע שעבר (last week) stays one chip vs בחודש שעבר (last month)."
  }),
  buildExpandedSentence({
    id: "everyday_74", emoji: "👧", category: "everyday", difficulty: 1,
    hebrew: "הבת שלי לומדת לבשל אצל סבתא שלה.", hebrewNiqqud: "הַבַּת שֶׁלִּי לוֹמֶדֶת לְבַשֵּׁל אֵצֶל סָבְתָא שֶׁלָּהּ.",
    english: "My daughter is learning to cook at her grandma's.",
    hebrewTokenPairs: [["הבת", "הַבַּת"], ["שלי", "שֶׁלִּי"], ["לומדת", "לוֹמֶדֶת"], ["לבשל", "לְבַשֵּׁל"], ["אצל", "אֵצֶל"], ["סבתא", "סָבְתָא"], ["שלה", "שֶׁלָּהּ"]],
    englishTokens: ["My", "daughter", "is learning", "to cook", "at", "her", "grandma's"],
    hebrewDistractorPairs: [["הבן", "הַבֵּן"], ["שלו", "שֶׁלּוֹ"], ["לומד", "לוֹמֵד"], ["לאפות", "לֶאֱפוֹת"], ["סבא", "סַבָּא"]],
    englishDistractors: ["son", "his", "is teaching", "to bake", "grandpa's"],
    notes: "Double של possession chain: הבת שלי ... סבתא שלה. לומדת agrees with the feminine daughter — לומד is the gender swap."
  }),
  buildExpandedSentence({
    id: "everyday_75", emoji: "🎒", category: "everyday", difficulty: 1,
    hebrew: "הילדים חוזרים מבית הספר בארבע.", hebrewNiqqud: "הַיְלָדִים חוֹזְרִים מִבֵּית הַסֵּפֶר בְּאַרְבַּע.",
    english: "The kids come back from school at four.",
    hebrewTokenPairs: [["הילדים", "הַיְלָדִים"], ["חוזרים", "חוֹזְרִים"], ["מבית הספר", "מִבֵּית הַסֵּפֶר"], ["בארבע", "בְּאַרְבַּע"]],
    englishTokens: ["The kids", "come back", "from school", "at four"],
    hebrewDistractorPairs: [["הילד", "הַיֶּלֶד"], ["חוזר", "חוֹזֵר"], ["מגן הילדים", "מִגַּן הַיְלָדִים"], ["בשמונה", "בִּשְׁמוֹנֶה"], ["יוצאים", "יוֹצְאִים"]],
    englishDistractors: ["The kid", "comes back", "from kindergarten", "at eight", "leave"],
    notes: "חוזרים agrees with plural ילדים — the singular חוזר is the trap. בית הספר (school) stays one compound chip vs גן הילדים (kindergarten)."
  }),
  buildExpandedSentence({
    id: "everyday_76", emoji: "🔑", category: "everyday", difficulty: 2,
    hebrew: "נעלת את הדלת? אני לא זוכרת.", hebrewNiqqud: "נָעַלְתָּ אֶת הַדֶּלֶת? אֲנִי לֹא זוֹכֶרֶת.",
    english: "Did you lock the door? I don't remember.",
    hebrewTokenPairs: [["נעלת", "נָעַלְתָּ"], ["את", "אֶת"], ["הדלת", "הַדֶּלֶת"], ["אני", "אֲנִי"], ["לא", "לֹא"], ["זוכרת", "זוֹכֶרֶת"]],
    englishTokens: ["Did you lock", "the door", "I don't", "remember"],
    hebrewDistractorPairs: [["פתחת", "פָּתַחְתָּ"], ["החלון", "הַחַלּוֹן"], ["זוכר", "זוֹכֵר"], ["סגרנו", "סָגַרְנוּ"], ["המפתח", "הַמַּפְתֵּחַ"]],
    englishDistractors: ["Did you open", "the window", "he doesn't", "forget", "the key"],
    notes: "זוכרת marks the speaker as feminine — the masculine זוכר is the gender swap — while נעלת addresses a masculine 'you'. פתחת (opened) is the opposite."
  }),
  buildExpandedSentence({
    id: "everyday_77", emoji: "🛋️", category: "everyday", difficulty: 2,
    hebrew: "קנינו ספה חדשה אבל היא לא נכנסת במעלית.", hebrewNiqqud: "קָנִינוּ סַפָּה חֲדָשָׁה אֲבָל הִיא לֹא נִכְנֶסֶת בַּמַּעֲלִית.",
    english: "We bought a new couch but it doesn't fit in the elevator.",
    hebrewTokenPairs: [["קנינו", "קָנִינוּ"], ["ספה", "סַפָּה"], ["חדשה", "חֲדָשָׁה"], ["אבל", "אֲבָל"], ["היא", "הִיא"], ["לא", "לֹא"], ["נכנסת", "נִכְנֶסֶת"], ["במעלית", "בַּמַּעֲלִית"]],
    englishTokens: ["We bought", "a new", "couch", "but", "it", "doesn't fit", "in the elevator"],
    hebrewDistractorPairs: [["מכרנו", "מָכַרְנוּ"], ["שולחן", "שֻׁלְחָן"], ["הוא", "הוּא"], ["נכנס", "נִכְנָס"], ["במדרגות", "בַּמַּדְרֵגוֹת"]],
    englishDistractors: ["We sold", "an old", "table", "he", "doesn't go up", "on the stairs"],
    notes: "The couch is feminine, so 'it' is היא and the verb is נכנסת; the masculine pair הוא/נכנס is the agreement trap — it would fit שולחן."
  }),
  buildExpandedSentence({
    id: "everyday_78", emoji: "🏛️", category: "everyday", difficulty: 2,
    hebrew: "צריך למלא את הטופס ולהחזיר אותו לעירייה.", hebrewNiqqud: "צָרִיךְ לְמַלֵּא אֶת הַטֹּפֶס וּלְהַחֲזִיר אוֹתוֹ לָעִירִיָּה.",
    english: "You need to fill out the form and return it to the municipality.",
    hebrewTokenPairs: [["צריך", "צָרִיךְ"], ["למלא", "לְמַלֵּא"], ["את", "אֶת"], ["הטופס", "הַטֹּפֶס"], ["ולהחזיר", "וּלְהַחֲזִיר"], ["אותו", "אוֹתוֹ"], ["לעירייה", "לָעִירִיָּה"]],
    englishTokens: ["You need", "to fill out", "the form", "and return", "it", "to the municipality"],
    hebrewDistractorPairs: [["אפשר", "אֶפְשָׁר"], ["לחתום", "לַחְתֹּם"], ["אותה", "אוֹתָהּ"], ["לדואר", "לַדֹּאַר"], ["המכתב", "הַמִּכְתָּב"]],
    englishDistractors: ["You can", "to sign", "her", "to the post office", "the letter"],
    notes: "Impersonal צריך — 'one needs to'. אותו refers to the masculine טופס; אותה is the gender trap. עירייה (municipality) vs דואר (post office)."
  }),
  buildExpandedSentence({
    id: "everyday_79", emoji: "📮", category: "everyday", difficulty: 2,
    hebrew: "עמדתי בתור בדואר כמעט שעה שלמה.", hebrewNiqqud: "עָמַדְתִּי בַּתּוֹר בַּדֹּאַר כִּמְעַט שָׁעָה שְׁלֵמָה.",
    english: "I stood in line at the post office for almost a whole hour.",
    hebrewTokenPairs: [["עמדתי", "עָמַדְתִּי"], ["בתור", "בַּתּוֹר"], ["בדואר", "בַּדֹּאַר"], ["כמעט", "כִּמְעַט"], ["שעה", "שָׁעָה"], ["שלמה", "שְׁלֵמָה"]],
    englishTokens: ["I stood", "in line", "at the post office", "for", "almost", "a whole hour"],
    hebrewDistractorPairs: [["ישבתי", "יָשַׁבְתִּי"], ["בבנק", "בַּבַּנְק"], ["רק", "רַק"], ["דקה", "דַּקָּה"], ["אחת", "אַחַת"]],
    englishDistractors: ["I sat", "at the bank", "only", "one minute", "waiting"],
    notes: "Past-tense narrative. עמדתי בתור = I stood in line — here at the post office for שעה שלמה, a whole hour. ישבתי (I sat) is the verb trap."
  }),
  buildExpandedSentence({
    id: "everyday_80", emoji: "🧾", category: "everyday", difficulty: 2,
    hebrew: "שילמתי את הארנונה באתר של העירייה.", hebrewNiqqud: "שִׁלַּמְתִּי אֶת הָאַרְנוֹנָה בָּאֲתָר שֶׁל הָעִירִיָּה.",
    english: "I paid the property tax through the website of the municipality.",
    hebrewTokenPairs: [["שילמתי", "שִׁלַּמְתִּי"], ["את", "אֶת"], ["הארנונה", "הָאַרְנוֹנָה"], ["באתר", "בָּאֲתָר"], ["של", "שֶׁל"], ["העירייה", "הָעִירִיָּה"]],
    englishTokens: ["I paid", "the property tax", "through the website", "of", "the municipality"],
    hebrewDistractorPairs: [["קיבלתי", "קִבַּלְתִּי"], ["החשבון", "הַחֶשְׁבּוֹן"], ["בסניף", "בַּסְּנִיף"], ["הבנק", "הַבַּנְק"], ["החשמל", "הַחַשְׁמַל"]],
    englishDistractors: ["I received", "the electricity bill", "at the branch", "the bank"],
    notes: "ארנונה is Israeli municipal property tax — core bureaucracy vocabulary. באתר של = through the website of; בסניף (at the branch) is the in-person trap."
  }),
  buildExpandedSentence({
    id: "everyday_81", emoji: "🚏", category: "everyday", difficulty: 2,
    hebrew: "תרדי בתחנה הבאה ותפני ימינה.", hebrewNiqqud: "תֵּרְדִי בַּתַּחֲנָה הַבָּאָה וְתִפְנִי יָמִינָה.",
    english: "Get off at the next stop and turn right.",
    hebrewTokenPairs: [["תרדי", "תֵּרְדִי"], ["בתחנה", "בַּתַּחֲנָה"], ["הבאה", "הַבָּאָה"], ["ותפני", "וְתִפְנִי"], ["ימינה", "יָמִינָה"]],
    englishTokens: ["Get off", "at the next", "stop", "and turn", "right"],
    hebrewDistractorPairs: [["תרד", "תֵּרֵד"], ["ותפנה", "וְתִפְנֶה"], ["הקודמת", "הַקּוֹדֶמֶת"], ["שמאלה", "שְׂמֹאלָה"], ["ישר", "יָשָׁר"]],
    englishDistractors: ["at the previous", "and keep going", "left", "straight", "Get on"],
    notes: "Feminine commands תרדי/תפני — the masculine forms תרד/תפנה are the gender swap. ימינה (right) vs שמאלה (left) is the direction trap.",
    hebrewAlternates: [{
      text: "תרד בתחנה הבאה ותפנה ימינה.", textNiqqud: "תֵּרֵד בַּתַּחֲנָה הַבָּאָה וְתִפְנֶה יָמִינָה.",
      tokenPairs: [["תרד", "תֵּרֵד"], ["בתחנה", "בַּתַּחֲנָה"], ["הבאה", "הַבָּאָה"], ["ותפנה", "וְתִפְנֶה"], ["ימינה", "יָמִינָה"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_82", emoji: "🚪", category: "everyday", difficulty: 2,
    hebrew: "הכניסה לבניין נמצאת בצד השני.", hebrewNiqqud: "הַכְּנִיסָה לַבִּנְיָן נִמְצֵאת בַּצַּד הַשֵּׁנִי.",
    english: "The entrance to the building is on the other side.",
    hebrewTokenPairs: [["הכניסה", "הַכְּנִיסָה"], ["לבניין", "לַבִּנְיָן"], ["נמצאת", "נִמְצֵאת"], ["בצד", "בַּצַּד"], ["השני", "הַשֵּׁנִי"]],
    englishTokens: ["The entrance", "to the building", "is", "on the other", "side"],
    hebrewDistractorPairs: [["היציאה", "הַיְצִיאָה"], ["לחניון", "לַחֲנָיוֹן"], ["נמצא", "נִמְצָא"], ["הראשון", "הָרִאשׁוֹן"], ["למעלה", "לְמַעְלָה"]],
    englishDistractors: ["The exit", "to the parking garage", "are", "on the first", "upstairs"],
    notes: "נמצאת agrees with the feminine כניסה — the masculine נמצא is the agreement trap (it would fit חניון). היציאה (the exit) is the opposite."
  }),
  buildExpandedSentence({
    id: "everyday_83", emoji: "🥵", category: "everyday", difficulty: 1,
    hebrew: "חם מאוד היום, קחי כובע ובקבוק מים.", hebrewNiqqud: "חַם מְאוֹד הַיּוֹם, קְחִי כּוֹבַע וּבַקְבּוּק מַיִם.",
    english: "It's very hot today, take a hat and a bottle of water.",
    hebrewTokenPairs: [["חם", "חַם"], ["מאוד", "מְאוֹד"], ["היום", "הַיּוֹם"], ["קחי", "קְחִי"], ["כובע", "כּוֹבַע"], ["ובקבוק", "וּבַקְבּוּק"], ["מים", "מַיִם"]],
    englishTokens: ["It's", "very", "hot", "today", "take", "a hat", "and a bottle", "of water"],
    hebrewDistractorPairs: [["קר", "קַר"], ["קח", "קַח"], ["מטרייה", "מִטְרִיָּה"], ["ומעיל", "וּמְעִיל"], ["קפה", "קָפֶה"]],
    englishDistractors: ["cold", "It was", "an umbrella", "and a coat", "of coffee"],
    notes: "קחי is the feminine imperative — the masculine קח is the gender swap. מאוד means 'very' and is a flexible modifier the builder accepts on either side of חם. קר (cold) is the opposite."
  }),
  buildExpandedSentence({
    id: "everyday_84", emoji: "🌧️", category: "everyday", difficulty: 2,
    hebrew: "מחר אמור לרדת גשם כל היום.", hebrewNiqqud: "מָחָר אָמוּר לָרֶדֶת גֶּשֶׁם כָּל הַיּוֹם.",
    english: "It's supposed to rain all day tomorrow.",
    hebrewTokenPairs: [["מחר", "מָחָר"], ["אמור", "אָמוּר"], ["לרדת", "לָרֶדֶת"], ["גשם", "גֶּשֶׁם"], ["כל", "כָּל"], ["היום", "הַיּוֹם"]],
    englishTokens: ["It's supposed", "to rain", "all", "day", "tomorrow"],
    hebrewDistractorPairs: [["אתמול", "אֶתְמוֹל"], ["אמורה", "אֲמוּרָה"], ["לזרוח", "לִזְרֹחַ"], ["שלג", "שֶׁלֶג"], ["הבוקר", "הַבֹּקֶר"]],
    englishDistractors: ["yesterday", "to snow", "morning", "It might", "stop"],
    notes: "אמור + infinitive = 'supposed to'. לרדת גשם is literally 'rain descends' — the same לרדת as getting off a bus. שלג (snow) swaps the precipitation.",
    hebrewAlternates: [{
      text: "אמור לרדת גשם כל היום מחר.", textNiqqud: "אָמוּר לָרֶדֶת גֶּשֶׁם כָּל הַיּוֹם מָחָר.",
      tokenPairs: [["אמור", "אָמוּר"], ["לרדת", "לָרֶדֶת"], ["גשם", "גֶּשֶׁם"], ["כל", "כָּל"], ["היום", "הַיּוֹם"], ["מחר", "מָחָר"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_85", emoji: "⏰", category: "everyday", difficulty: 1,
    hebrew: "השיעור מתחיל בשמונה וחצי בדיוק.", hebrewNiqqud: "הַשִּׁעוּר מַתְחִיל בִּשְׁמוֹנֶה וָחֵצִי בְּדִיּוּק.",
    english: "The class starts at exactly eight thirty.",
    hebrewTokenPairs: [["השיעור", "הַשִּׁעוּר"], ["מתחיל", "מַתְחִיל"], ["בשמונה", "בִּשְׁמוֹנֶה"], ["וחצי", "וָחֵצִי"], ["בדיוק", "בְּדִיּוּק"]],
    englishTokens: ["The class", "starts", "at exactly", "eight", "thirty"],
    hebrewDistractorPairs: [["נגמר", "נִגְמָר"], ["בתשע", "בְּתֵשַׁע"], ["ורבע", "וָרֶבַע"], ["בערך", "בְּעֵרֶךְ"], ["המבחן", "הַמִּבְחָן"]],
    englishDistractors: ["ends", "at around", "nine", "fifteen", "The exam"],
    notes: "Time-telling: שמונה וחצי is literally 'eight and a half'. נגמר (ends) is the opposite of מתחיל; בערך (approximately) contrasts with בדיוק (exactly)."
  }),
  buildExpandedSentence({
    id: "everyday_86", emoji: "🤝", category: "everyday", difficulty: 2,
    hebrew: "ניפגש בעוד רבע שעה ליד הכניסה.", hebrewNiqqud: "נִפָּגֵשׁ בְּעוֹד רֶבַע שָׁעָה לְיַד הַכְּנִיסָה.",
    english: "We'll meet in a quarter of an hour by the entrance.",
    hebrewTokenPairs: [["ניפגש", "נִפָּגֵשׁ"], ["בעוד", "בְּעוֹד"], ["רבע שעה", "רֶבַע שָׁעָה"], ["ליד", "לְיַד"], ["הכניסה", "הַכְּנִיסָה"]],
    englishTokens: ["We'll meet", "in", "a quarter of an hour", "by", "the entrance"],
    hebrewDistractorPairs: [["נדבר", "נְדַבֵּר"], ["חצי שעה", "חֲצִי שָׁעָה"], ["מול", "מוּל"], ["היציאה", "הַיְצִיאָה"], ["מחר", "מָחָר"]],
    englishDistractors: ["We'll talk", "half an hour", "across from", "the exit", "tomorrow"],
    notes: "True future ניפגש (we'll meet). רבע שעה (a quarter hour) is one compound chip vs חצי שעה (half an hour). ליד (by) vs מול (across from)."
  }),
  buildExpandedSentence({
    id: "colloquial_54", emoji: "👻", category: "colloquial", difficulty: 2,
    hebrew: "היא פשוט נעלמה לי אחרי הדייט השני.", hebrewNiqqud: "הִיא פָּשׁוּט נֶעֶלְמָה לִי אַחֲרֵי הַדֵּייט הַשֵּׁנִי.",
    english: "She just disappeared on me after the second date.",
    hebrewTokenPairs: [["היא", "הִיא"], ["פשוט", "פָּשׁוּט"], ["נעלמה", "נֶעֶלְמָה"], ["לי", "לִי"], ["אחרי", "אַחֲרֵי"], ["הדייט", "הַדֵּייט"], ["השני", "הַשֵּׁנִי"]],
    englishTokens: ["She", "just", "disappeared", "on me", "after", "the second", "date"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["ענתה", "עָנְתָה"], ["לו", "לוֹ"], ["לפני", "לִפְנֵי"], ["הראשון", "הָרִאשׁוֹן"]],
    englishDistractors: ["He", "answered", "on him", "before", "the first"],
    notes: "נעלמה — 'she disappeared' — is casual dating slang for ghosting after a date. פשוט softens it to 'just/simply'."
  }),
  buildExpandedSentence({
    id: "colloquial_55", emoji: "🚩", category: "colloquial", difficulty: 2,
    hebrew: "זה נשמע לי כמו דגל אדום רציני.", hebrewNiqqud: "זֶה נִשְׁמָע לִי כְּמוֹ דֶּגֶל אָדֹם רְצִינִי.",
    english: "That sounds to me like a serious red flag.",
    hebrewTokenPairs: [["זה", "זֶה"], ["נשמע", "נִשְׁמָע"], ["לי", "לִי"], ["כמו", "כְּמוֹ"], ["דגל אדום", "דֶּגֶל אָדֹם"], ["רציני", "רְצִינִי"]],
    englishTokens: ["That", "sounds", "to me", "like", "a serious", "red flag"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["נראה", "נִרְאֶה"], ["לה", "לָהּ"], ["אור ירוק", "אוֹר יָרֹק"], ["מצחיק", "מַצְחִיק"]],
    englishDistractors: ["He", "looks", "to her", "a funny", "green light"],
    notes: "דגל אדום (red flag) is borrowed dating slang kept as one compound chip; אור ירוק (green light) is the compound opposite. נשמע לי = 'sounds to me'."
  }),
  buildExpandedSentence({
    id: "colloquial_56", emoji: "💬", category: "colloquial", difficulty: 3,
    hebrew: "יצא לך לדבר איתה מאז?", hebrewNiqqud: "יָצָא לְךָ לְדַבֵּר אִתָּהּ מֵאָז?",
    english: "Did you get a chance to talk to her since?",
    hebrewTokenPairs: [["יצא", "יָצָא"], ["לך", "לְךָ"], ["לדבר", "לְדַבֵּר"], ["איתה", "אִתָּהּ"], ["מאז", "מֵאָז"]],
    englishTokens: ["Did you", "get a chance", "to talk", "to her", "since"],
    hebrewDistractorPairs: [["בא", "בָּא"], ["לי", "לִי"], ["לשמוע", "לִשְׁמֹעַ"], ["איתו", "אִתּוֹ"], ["לפני", "לִפְנֵי"]],
    englishDistractors: ["Did I", "feel like", "to hear", "to him", "before"],
    notes: "יצא לך ל... is literally 'did it come out for you to...' — a casual way to ask whether you happened to get a chance. בא לך (feel like) is the confusable construction."
  }),
  buildExpandedSentence({
    id: "colloquial_57", emoji: "😍", category: "colloquial", difficulty: 1,
    hebrew: "הדייט הלך מעולה, אנחנו נפגשים שוב בשישי.", hebrewNiqqud: "הַדֵּייט הָלַךְ מְעֻלֶּה, אֲנַחְנוּ נִפְגָּשִׁים שׁוּב בְּשִׁישִׁי.",
    english: "The date went great, we're meeting again on Friday.",
    hebrewTokenPairs: [["הדייט", "הַדֵּייט"], ["הלך", "הָלַךְ"], ["מעולה", "מְעֻלֶּה"], ["אנחנו", "אֲנַחְנוּ"], ["נפגשים", "נִפְגָּשִׁים"], ["שוב", "שׁוּב"], ["בשישי", "בְּשִׁישִׁי"]],
    englishTokens: ["The date", "went", "great", "we're meeting", "again", "on Friday"],
    hebrewDistractorPairs: [["המסיבה", "הַמְּסִבָּה"], ["נורא", "נוֹרָא"], ["נפגשות", "נִפְגָּשׁוֹת"], ["בשבת", "בְּשַׁבָּת"], ["נפרדים", "נִפְרָדִים"]],
    englishDistractors: ["The party", "terribly", "we're breaking up", "on Saturday", "never"],
    notes: "הלך מעולה — 'it went great'; נורא (terribly) is the opposite. נפגשים is masculine/mixed plural; נפגשות is the feminine-plural gender swap."
  }),
  buildExpandedSentence({
    id: "colloquial_58", emoji: "😂", category: "colloquial", difficulty: 1,
    hebrew: "סתם צחקתי, אל תיקחי את זה ללב.", hebrewNiqqud: "סְתָם צָחַקְתִּי, אַל תִּקְּחִי אֶת זֶה לַלֵּב.",
    english: "I was just kidding, don't take it to heart.",
    hebrewTokenPairs: [["סתם", "סְתָם"], ["צחקתי", "צָחַקְתִּי"], ["אל", "אַל"], ["תיקחי", "תִּקְּחִי"], ["את", "אֶת"], ["זה", "זֶה"], ["ללב", "לַלֵּב"]],
    englishTokens: ["I was", "just", "kidding", "don't take", "it", "to heart"],
    hebrewDistractorPairs: [["תיקח", "תִּקַּח"], ["בכיתי", "בָּכִיתִי"], ["ברצינות", "בִּרְצִינוּת"], ["תמיד", "תָּמִיד"], ["עליי", "עָלַי"]],
    englishDistractors: ["I was crying", "seriously", "always", "about me", "don't worry"],
    notes: "סתם means 'just (kidding), for no reason' — a casual softener. תיקחי is the feminine imperative; the masculine תיקח is the gender swap. לקחת ללב is the common phrase 'to take to heart'."
  }),
  buildExpandedSentence({
    id: "colloquial_59", emoji: "🎬", category: "colloquial", difficulty: 1,
    hebrew: "בא לך לצאת לסרט ביום חמישי?", hebrewNiqqud: "בָּא לָךְ לָצֵאת לְסֶרֶט בְּיוֹם חֲמִישִׁי?",
    english: "Do you feel like going out to a movie on Thursday?",
    hebrewTokenPairs: [["בא", "בָּא"], ["לך", "לָךְ"], ["לצאת", "לָצֵאת"], ["לסרט", "לְסֶרֶט"], ["ביום חמישי", "בְּיוֹם חֲמִישִׁי"]],
    englishTokens: ["Do you", "feel like", "going out", "to a movie", "on Thursday"],
    hebrewDistractorPairs: [["יצא", "יָצָא"], ["לי", "לִי"], ["להישאר", "לְהִשָּׁאֵר"], ["להצגה", "לְהַצָּגָה"], ["ביום שני", "בְּיוֹם שֵׁנִי"]],
    englishDistractors: ["Did I", "get a chance", "staying home", "to a play", "on Monday"],
    notes: "בא לך = 'do you feel like' (literally 'does it come to you'), here addressed to a woman (לָךְ). Compound chip ביום חמישי vs ביום שני. Contrast with יצא לך, which asks about a past chance."
  }),
  buildExpandedSentence({
    id: "colloquial_60", emoji: "💸", category: "colloquial", difficulty: 2,
    hebrew: "תכלס, המסעדה הזאת שווה כל שקל.", hebrewNiqqud: "תַּכְלֶס, הַמִּסְעָדָה הַזֹּאת שָׁוָה כָּל שֶׁקֶל.",
    english: "Honestly, this restaurant is worth every shekel.",
    hebrewTokenPairs: [["תכלס", "תַּכְלֶס"], ["המסעדה", "הַמִּסְעָדָה"], ["הזאת", "הַזֹּאת"], ["שווה", "שָׁוָה"], ["כל", "כָּל"], ["שקל", "שֶׁקֶל"]],
    englishTokens: ["Honestly", "this restaurant", "is worth", "every", "shekel"],
    hebrewDistractorPairs: [["הבר", "הַבָּר"], ["הזה", "הַזֶּה"], ["עולה", "עוֹלֶה"], ["חצי", "חֲצִי"], ["אגורה", "אֲגוֹרָה"]],
    englishDistractors: ["this bar", "costs", "half", "a penny", "Basically"],
    notes: "תכלס is slang (via Yiddish from תכלית) for 'honestly / bottom line'. שווה כל שקל = worth every shekel; אגורה (the smallest coin) undercuts it."
  }),
  buildExpandedSentence({
    id: "colloquial_61", emoji: "😩", category: "colloquial", difficulty: 2,
    hebrew: "איזה באסה שביטלו את ההופעה.", hebrewNiqqud: "אֵיזֶה בָּאסָה שֶׁבִּטְּלוּ אֶת הַהוֹפָעָה.",
    english: "What a bummer that they canceled the show.",
    hebrewTokenPairs: [["איזה", "אֵיזֶה"], ["באסה", "בָּאסָה"], ["שביטלו", "שֶׁבִּטְּלוּ"], ["את", "אֶת"], ["ההופעה", "הַהוֹפָעָה"]],
    englishTokens: ["What a", "bummer", "that they canceled", "the show"],
    hebrewDistractorPairs: [["כיף", "כֵּיף"], ["שדחו", "שֶׁדָּחוּ"], ["המסיבה", "הַמְּסִבָּה"], ["איזו", "אֵיזוֹ"], ["שהקדימו", "שֶׁהִקְדִּימוּ"]],
    englishDistractors: ["joy", "that they postponed", "the party", "that they moved up", "So much"],
    notes: "באסה is slang borrowed from Arabic for a bummer/letdown. ביטלו is plural past ('they canceled'); דחו (postponed) is the softer trap."
  }),
  buildExpandedSentence({
    id: "colloquial_62", emoji: "🎂", category: "colloquial", difficulty: 2,
    hebrew: "וואי, שכחתי לגמרי מיום ההולדת שלה.", hebrewNiqqud: "וַאי, שָׁכַחְתִּי לְגַמְרֵי מִיּוֹם הַהֻלֶּדֶת שֶׁלָּהּ.",
    english: "Oh no, I totally forgot about her birthday.",
    hebrewTokenPairs: [["וואי", "וַאי"], ["שכחתי", "שָׁכַחְתִּי"], ["לגמרי", "לְגַמְרֵי"], ["מיום ההולדת", "מִיּוֹם הַהֻלֶּדֶת"], ["שלה", "שֶׁלָּהּ"]],
    englishTokens: ["Oh no", "I", "totally", "forgot", "about her", "birthday"],
    hebrewDistractorPairs: [["מיום השנה", "מִיּוֹם הַשָּׁנָה"], ["שלו", "שֶׁלּוֹ"], ["זכרתי", "זָכַרְתִּי"], ["בקושי", "בְּקֹשִׁי"], ["מהחתונה", "מֵהַחֲתֻנָּה"]],
    englishDistractors: ["about his", "anniversary", "I remembered", "barely", "the wedding"],
    notes: "לגמרי = 'totally/completely' and is a flexible modifier. יום ההולדת (birthday) stays a compound chip; יום השנה (anniversary) matches its shape. שלה vs שלו is the her/his trap."
  }),
  buildExpandedSentence({
    id: "colloquial_63", emoji: "🏃", category: "colloquial", difficulty: 1,
    hebrew: "כולם כבר בדרך, איפה אתם?", hebrewNiqqud: "כֻּלָּם כְּבָר בַּדֶּרֶךְ, אֵיפֹה אַתֶּם?",
    english: "Everyone's already on the way, where are you?",
    hebrewTokenPairs: [["כולם", "כֻּלָּם"], ["כבר", "כְּבָר"], ["בדרך", "בַּדֶּרֶךְ"], ["איפה", "אֵיפֹה"], ["אתם", "אַתֶּם"]],
    englishTokens: ["Everyone's", "already", "on the way", "where are", "you"],
    hebrewDistractorPairs: [["אתן", "אַתֶּן"], ["אף אחד", "אַף אֶחָד"], ["בבית", "בַּבַּיִת"], ["עדיין", "עֲדַיִן"], ["אנחנו", "אֲנַחְנוּ"]],
    englishDistractors: ["No one's", "at home", "still", "are we", "there"],
    notes: "כבר בדרך = 'already on the way' — urgency phrasing. אתם is plural 'you'; אתן is the feminine-plural gender swap."
  }),
  buildExpandedSentence({
    id: "colloquial_64", emoji: "🤷", category: "colloquial", difficulty: 3,
    hebrew: "עזבי, לא משנה, אני אסתדר לבד.", hebrewNiqqud: "עִזְבִי, לֹא מְשַׁנֶּה, אֲנִי אֶסְתַּדֵּר לְבַד.",
    english: "Forget it, never mind, I'll manage on my own.",
    hebrewTokenPairs: [["עזבי", "עִזְבִי"], ["לא", "לֹא"], ["משנה", "מְשַׁנֶּה"], ["אני", "אֲנִי"], ["אסתדר", "אֶסְתַּדֵּר"], ["לבד", "לְבַד"]],
    englishTokens: ["Forget it", "never mind", "I'll", "manage", "on my own"],
    hebrewDistractorPairs: [["עזוב", "עֲזֹב"], ["חשוב", "חָשׁוּב"], ["נסתדר", "נִסְתַּדֵּר"], ["ביחד", "בְּיַחַד"], ["תמיד", "תָּמִיד"]],
    englishDistractors: ["it matters", "we'll", "give up", "together", "always"],
    notes: "עזבי — literally the feminine imperative 'leave!' — works as casual slang for 'forget it'; עזוב is the masculine gender swap. אסתדר = I'll manage/be fine."
  }),
  buildExpandedSentence({
    id: "colloquial_65", emoji: "🛒", category: "colloquial", difficulty: 2,
    hebrew: "אני בדרך אלייך, צריכה משהו מהסופר?", hebrewNiqqud: "אֲנִי בַּדֶּרֶךְ אֵלַיִךְ, צְרִיכָה מַשֶּׁהוּ מֵהַסּוּפֶּר?",
    english: "I'm on my way to you, need anything from the supermarket?",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["בדרך", "בַּדֶּרֶךְ"], ["אלייך", "אֵלַיִךְ"], ["צריכה", "צְרִיכָה"], ["משהו", "מַשֶּׁהוּ"], ["מהסופר", "מֵהַסּוּפֶּר"]],
    englishTokens: ["I'm", "on my way", "to you", "need", "anything", "from the supermarket"],
    hebrewDistractorPairs: [["אליך", "אֵלֶיךָ"], ["צריך", "צָרִיךְ"], ["הכול", "הַכֹּל"], ["מהשוק", "מֵהַשּׁוּק"], ["חוזרת", "חוֹזֶרֶת"]],
    englishDistractors: ["everything", "from the market", "coming back", "to him", "want"],
    notes: "Feminine speaker asking a feminine friend: אלייך and צריכה both mark gender — אליך and צריך are the masculine swaps. בדרך = on my way."
  }),
  buildExpandedSentence({
    id: "colloquial_66", emoji: "🍻", category: "colloquial", difficulty: 1,
    hebrew: "אנחנו יושבים בבר ליד הים, בואי.", hebrewNiqqud: "אֲנַחְנוּ יוֹשְׁבִים בְּבָר לְיַד הַיָּם, בּוֹאִי.",
    english: "We're sitting at a bar by the beach, come.",
    hebrewTokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["יושבים", "יוֹשְׁבִים"], ["בבר", "בְּבָר"], ["ליד", "לְיַד"], ["הים", "הַיָּם"], ["בואי", "בּוֹאִי"]],
    englishTokens: ["We're sitting", "at a bar", "by", "the beach", "come"],
    hebrewDistractorPairs: [["בוא", "בּוֹא"], ["יושבות", "יוֹשְׁבוֹת"], ["במסעדה", "בְּמִסְעָדָה"], ["מול", "מוּל"], ["הפארק", "הַפַּארְק"]],
    englishDistractors: ["We're standing", "at a restaurant", "across from", "the park", "later"],
    notes: "בואי is the feminine imperative 'come' — בוא is the masculine swap. יושבים (mixed/masculine plural) vs יושבות (feminine plural)."
  }),
  buildExpandedSentence({
    id: "colloquial_67", emoji: "😴", category: "colloquial", difficulty: 2,
    hebrew: "נרדמתי על הספה באמצע הסרט.", hebrewNiqqud: "נִרְדַּמְתִּי עַל הַסַּפָּה בְּאֶמְצַע הַסֶּרֶט.",
    english: "I fell asleep on the couch in the middle of the movie.",
    hebrewTokenPairs: [["נרדמתי", "נִרְדַּמְתִּי"], ["על", "עַל"], ["הספה", "הַסַּפָּה"], ["באמצע", "בְּאֶמְצַע"], ["הסרט", "הַסֶּרֶט"]],
    englishTokens: ["I fell asleep", "on", "the couch", "in the middle", "of the movie"],
    hebrewDistractorPairs: [["התעוררתי", "הִתְעוֹרַרְתִּי"], ["במיטה", "בַּמִּטָּה"], ["בסוף", "בְּסוֹף"], ["החדשות", "הַחֲדָשׁוֹת"], ["ליד", "לְיַד"]],
    englishDistractors: ["I woke up", "in bed", "at the end", "of the news", "next to"],
    notes: "נרדמתי (I fell asleep) vs התעוררתי (I woke up) — opposite trap. באמצע = in the middle of; past-tense narrative."
  }),
  buildExpandedSentence({
    id: "colloquial_68", emoji: "🚗", category: "colloquial", difficulty: 2,
    hebrew: "אין לי רכב השבוע, תוכלי לאסוף אותי?", hebrewNiqqud: "אֵין לִי רֶכֶב הַשָּׁבוּעַ, תּוּכְלִי לֶאֱסֹף אוֹתִי?",
    english: "I don't have a car this week, could you pick me up?",
    hebrewTokenPairs: [["אין", "אֵין"], ["לי", "לִי"], ["רכב", "רֶכֶב"], ["השבוע", "הַשָּׁבוּעַ"], ["תוכלי", "תּוּכְלִי"], ["לאסוף", "לֶאֱסֹף"], ["אותי", "אוֹתִי"]],
    englishTokens: ["I don't have", "a car", "this week", "could you", "pick", "me up"],
    hebrewDistractorPairs: [["תוכל", "תּוּכַל"], ["יש", "יֵשׁ"], ["אופניים", "אוֹפַנַּיִם"], ["להוריד", "לְהוֹרִיד"], ["אותה", "אוֹתָהּ"]],
    englishDistractors: ["I have", "a bike", "next month", "drop", "her off"],
    notes: "תוכלי addresses a woman — תוכל is the masculine swap. לאסוף (pick up) vs להוריד (drop off) is the opposite pair."
  }),
  buildExpandedSentence({
    id: "colloquial_69", emoji: "📱", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "מאחרת בעשר דקות, תזמינו לי קפה.", hebrewNiqqud: "מְאַחֶרֶת בְּעֶשֶׂר דַּקּוֹת, תַּזְמִינוּ לִי קָפֶה.",
    english: "Running ten minutes late, order me a coffee.",
    hebrewTokenPairs: [["מאחרת", "מְאַחֶרֶת"], ["בעשר", "בְּעֶשֶׂר"], ["דקות", "דַּקּוֹת"], ["תזמינו", "תַּזְמִינוּ"], ["לי", "לִי"], ["קפה", "קָפֶה"]],
    englishTokens: ["Running", "ten", "minutes", "late", "order me", "a coffee"],
    hebrewDistractorPairs: [["מאחר", "מְאַחֵר"], ["בחמש", "בְּחָמֵשׁ"], ["שעות", "שָׁעוֹת"], ["תשמרו", "תִּשְׁמְרוּ"], ["תה", "תֵּה"]],
    englishDistractors: ["five", "hours", "save me", "a tea", "He's running"],
    notes: "WhatsApp-style clipped message. מאחרת marks the sender as feminine (מאחר is the masculine swap); תזמינו is a plural command to the group."
  }),
  buildExpandedSentence({
    id: "colloquial_70", emoji: "📍", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "הגעתי, אני חונה למטה.", hebrewNiqqud: "הִגַּעְתִּי, אֲנִי חוֹנֶה לְמַטָּה.",
    english: "I've arrived, I'm parking downstairs.",
    hebrewTokenPairs: [["הגעתי", "הִגַּעְתִּי"], ["אני", "אֲנִי"], ["חונה", "חוֹנֶה"], ["למטה", "לְמַטָּה"]],
    englishTokens: ["I've arrived", "I'm parking", "downstairs"],
    hebrewDistractorPairs: [["יצאתי", "יָצָאתִי"], ["מחכה", "מְחַכֶּה"], ["למעלה", "לְמַעְלָה"], ["עוצר", "עוֹצֵר"], ["בפנים", "בִּפְנִים"]],
    englishDistractors: ["I've left", "I'm waiting", "upstairs", "inside", "stopping"],
    notes: "Terse WhatsApp arrival ping. חונה = parking (present tense); למטה (downstairs) vs למעלה (upstairs) is the direction trap."
  }),
  buildExpandedSentence({
    id: "colloquial_71", emoji: "🔋", category: "colloquial", difficulty: 2, style: "whatsapp",
    hebrew: "הסוללה שלי על אחוז, נדבר כשאגיע הביתה.", hebrewNiqqud: "הַסּוֹלְלָה שֶׁלִּי עַל אָחוּז, נְדַבֵּר כְּשֶׁאַגִּיעַ הַבַּיְתָה.",
    english: "My battery is at one percent, we'll talk when I get home.",
    hebrewTokenPairs: [["הסוללה", "הַסּוֹלְלָה"], ["שלי", "שֶׁלִּי"], ["על", "עַל"], ["אחוז", "אָחוּז"], ["נדבר", "נְדַבֵּר"], ["כשאגיע", "כְּשֶׁאַגִּיעַ"], ["הביתה", "הַבַּיְתָה"]],
    englishTokens: ["My battery", "is at", "one percent", "we'll talk", "when I get", "home"],
    hebrewDistractorPairs: [["המסך", "הַמָּסָךְ"], ["שלו", "שֶׁלּוֹ"], ["מאה", "מֵאָה"], ["כשאצא", "כְּשֶׁאֵצֵא"], ["מהבית", "מֵהַבַּיִת"]],
    englishDistractors: ["His screen", "a hundred", "when I leave", "from home", "is broken"],
    notes: "על אחוז — 'at one percent' — everyday phone talk. כשאגיע fuses כש with the future ('when I arrive'); כשאצא (when I leave) is the trap."
  }),
  buildExpandedSentence({
    id: "colloquial_72", emoji: "🥱", category: "colloquial", difficulty: 3,
    hebrew: "חפרת לי שעה על הדיאטה החדשה שלך.", hebrewNiqqud: "חָפַרְתָּ לִי שָׁעָה עַל הַדִּיאֵטָה הַחֲדָשָׁה שֶׁלְּךָ.",
    english: "You went on and on at me for an hour about your new diet.",
    hebrewTokenPairs: [["חפרת", "חָפַרְתָּ"], ["לי", "לִי"], ["שעה", "שָׁעָה"], ["על", "עַל"], ["הדיאטה", "הַדִּיאֵטָה"], ["החדשה", "הַחֲדָשָׁה"], ["שלך", "שֶׁלְּךָ"]],
    englishTokens: ["You went on and on", "at me", "for an hour", "about", "your", "new diet"],
    hebrewDistractorPairs: [["סיפרת", "סִפַּרְתָּ"], ["דקה", "דַּקָּה"], ["העבודה", "הָעֲבוֹדָה"], ["הישנה", "הַיְשָׁנָה"], ["שלה", "שֶׁלָּהּ"]],
    englishDistractors: ["You told me", "for a minute", "old", "her", "job"],
    notes: "לחפור — literally 'to dig' — is slang for talking someone's ear off. סיפרת (you told) is the neutral verb it replaces."
  }),
  buildExpandedSentence({
    id: "colloquial_73", emoji: "💪", category: "colloquial", difficulty: 3,
    hebrew: "סמוך עליי, אני מסדר את זה עד מחר.", hebrewNiqqud: "סְמֹךְ עָלַי, אֲנִי מְסַדֵּר אֶת זֶה עַד מָחָר.",
    english: "Trust me, I'll sort it out by tomorrow.",
    hebrewTokenPairs: [["סמוך", "סְמֹךְ"], ["עליי", "עָלַי"], ["אני", "אֲנִי"], ["מסדר", "מְסַדֵּר"], ["את", "אֶת"], ["זה", "זֶה"], ["עד", "עַד"], ["מחר", "מָחָר"]],
    englishTokens: ["Trust", "me", "I'll sort", "it", "out", "by tomorrow"],
    hebrewDistractorPairs: [["סמכי", "סִמְכִי"], ["עליו", "עָלָיו"], ["מקלקל", "מְקַלְקֵל"], ["אתמול", "אֶתְמוֹל"], ["שוכח", "שׁוֹכֵחַ"]],
    englishDistractors: ["on him", "I'm ruining", "by yesterday", "forgetting", "Doubt"],
    notes: "סמוך עליי — 'trust me' — is a common phrase; סמכי is the feminine imperative swap. מסדר is colloquial present-for-future: 'I'm sorting it' means I'll get it done."
  }),
  buildExpandedSentence({
    id: "professional_38", emoji: "🧾", category: "professional", difficulty: 2,
    hebrew: "שלחתי את החשבונית, התשלום אמור להגיע עד סוף החודש.", hebrewNiqqud: "שָׁלַחְתִּי אֶת הַחֶשְׁבּוֹנִית, הַתַּשְׁלוּם אָמוּר לְהַגִּיעַ עַד סוֹף הַחֹדֶשׁ.",
    english: "I sent the invoice; the payment should arrive by the end of the month.",
    hebrewTokenPairs: [["שלחתי", "שָׁלַחְתִּי"], ["את", "אֶת"], ["החשבונית", "הַחֶשְׁבּוֹנִית"], ["התשלום", "הַתַּשְׁלוּם"], ["אמור", "אָמוּר"], ["להגיע", "לְהַגִּיעַ"], ["עד", "עַד"], ["סוף", "סוֹף"], ["החודש", "הַחֹדֶשׁ"]],
    englishTokens: ["I sent", "the invoice", "the payment", "should", "arrive", "by", "the end", "of the month"],
    hebrewDistractorPairs: [["קיבלתי", "קִבַּלְתִּי"], ["הקבלה", "הַקַּבָּלָה"], ["אמורה", "אֲמוּרָה"], ["תחילת", "תְּחִלַּת"], ["ההחזר", "הַהֶחְזֵר"]],
    englishDistractors: ["I received", "the receipt", "the refund", "the beginning", "might"],
    notes: "חשבונית (invoice) vs קבלה (receipt) — the classic billing pair, here from the sender's side. אמור agrees with the masculine תשלום; אמורה is the agreement trap."
  }),
  buildExpandedSentence({
    id: "professional_39", emoji: "👩‍💼", category: "professional", difficulty: 2,
    hebrew: "המנהלת החדשה רוצה לקבוע שיחת היכרות עם כל הצוות.", hebrewNiqqud: "הַמְּנַהֶלֶת הַחֲדָשָׁה רוֹצָה לִקְבֹּעַ שִׂיחַת הֶכֵּרוּת עִם כָּל הַצֶּוֶת.",
    english: "The new manager wants to schedule an introductory call with the whole team.",
    hebrewTokenPairs: [["המנהלת", "הַמְּנַהֶלֶת"], ["החדשה", "הַחֲדָשָׁה"], ["רוצה", "רוֹצָה"], ["לקבוע", "לִקְבֹּעַ"], ["שיחת היכרות", "שִׂיחַת הֶכֵּרוּת"], ["עם", "עִם"], ["כל", "כָּל"], ["הצוות", "הַצֶּוֶת"]],
    englishTokens: ["The new", "manager", "wants", "to schedule", "an introductory call", "with", "the whole", "team"],
    hebrewDistractorPairs: [["המנהל", "הַמְּנַהֵל"], ["לבטל", "לְבַטֵּל"], ["שיחת ועידה", "שִׂיחַת וְעִידָה"], ["חצי", "חֲצִי"], ["הלקוחות", "הַלָּקוֹחוֹת"]],
    englishDistractors: ["The old", "director", "to cancel", "a conference call", "half the", "clients"],
    notes: "המנהלת is a female manager — המנהל is the gender swap. שיחת היכרות (intro call) stays one compound chip; שיחת ועידה (conference call) matches its shape."
  }),
  buildExpandedSentence({
    id: "professional_40", emoji: "🤝", category: "professional", difficulty: 3,
    hebrew: "המשא ומתן נמשך יותר זמן ממה שציפינו.", hebrewNiqqud: "הַמַּשָּׂא וּמַתָּן נִמְשַׁךְ יוֹתֵר זְמַן מִמַּה שֶׁצִּפִּינוּ.",
    english: "The negotiation took longer than we expected.",
    hebrewTokenPairs: [["המשא ומתן", "הַמַּשָּׂא וּמַתָּן"], ["נמשך", "נִמְשַׁךְ"], ["יותר", "יוֹתֵר"], ["זמן", "זְמַן"], ["ממה", "מִמַּה"], ["שציפינו", "שֶׁצִּפִּינוּ"]],
    englishTokens: ["The negotiation", "took", "longer", "than", "we expected"],
    hebrewDistractorPairs: [["סדר היום", "סֵדֶר הַיּוֹם"], ["הסתיים", "הִסְתַּיֵּם"], ["פחות", "פָּחוֹת"], ["שרצינו", "שֶׁרָצִינוּ"], ["מכפי", "מִכְּפִי"]],
    englishDistractors: ["The agenda", "ended", "less time", "we wanted", "earlier"],
    notes: "משא ומתן (negotiation) is a fixed compound kept as one chip. The comparative frame יותר... ממה ש... = 'more than'; ציפינו is plural past (we expected)."
  }),
  buildExpandedSentence({
    id: "professional_41", emoji: "📊", category: "professional", difficulty: 2,
    hebrew: "אשמח לקבל את הנתונים המעודכנים לפני הישיבה.", hebrewNiqqud: "אֶשְׂמַח לְקַבֵּל אֶת הַנְּתוּנִים הַמְּעֻדְכָּנִים לִפְנֵי הַיְשִׁיבָה.",
    english: "I'd be glad to receive the updated data before the meeting.",
    hebrewTokenPairs: [["אשמח", "אֶשְׂמַח"], ["לקבל", "לְקַבֵּל"], ["את", "אֶת"], ["הנתונים", "הַנְּתוּנִים"], ["המעודכנים", "הַמְּעֻדְכָּנִים"], ["לפני", "לִפְנֵי"], ["הישיבה", "הַיְשִׁיבָה"]],
    englishTokens: ["I'd be glad", "to receive", "the updated", "data", "before", "the meeting"],
    hebrewDistractorPairs: [["אשלח", "אֶשְׁלַח"], ["הישנים", "הַיְשָׁנִים"], ["אחרי", "אַחֲרֵי"], ["ההפסקה", "הַהַפְסָקָה"], ["המסמכים", "הַמִּסְמָכִים"]],
    englishDistractors: ["I'll send", "the old", "after", "the break", "documents"],
    notes: "אשמח ל... is the polite formal-professional opener 'I'd be glad to'. מעודכנים (updated) vs ישנים (old); לפני vs אחרי is the opposite pair."
  }),
  buildExpandedSentence({
    id: "professional_42", emoji: "🍾", category: "professional", difficulty: 2,
    hebrew: "יש צוואר בקבוק בתהליך האישור של ההזמנות.", hebrewNiqqud: "יֵשׁ צַוַּאר בַּקְבּוּק בְּתַהֲלִיךְ הָאִשּׁוּר שֶׁל הַהַזְמָנוֹת.",
    english: "There's a bottleneck in the approval process for the orders.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["צוואר בקבוק", "צַוַּאר בַּקְבּוּק"], ["בתהליך", "בְּתַהֲלִיךְ"], ["האישור", "הָאִשּׁוּר"], ["של", "שֶׁל"], ["ההזמנות", "הַהַזְמָנוֹת"]],
    englishTokens: ["There's", "a bottleneck", "in the", "approval", "process", "for the orders"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["אבן דרך", "אֶבֶן דֶּרֶךְ"], ["בשלב", "בְּשָׁלָב"], ["התשלום", "הַתַּשְׁלוּם"], ["החשבוניות", "הַחֶשְׁבּוֹנִיּוֹת"]],
    englishDistractors: ["There isn't", "a milestone", "payment", "stage", "for the invoices"],
    notes: "צוואר בקבוק — literally 'bottle neck' — is the borrowed workplace metaphor, kept as one compound chip; אבן דרך (milestone) matches its shape."
  }),
  buildExpandedSentence({
    id: "professional_43", emoji: "🗓️", category: "professional", difficulty: 2,
    hebrew: "הראיון השני מתוכנן ליום שלישי בשעה עשר.", hebrewNiqqud: "הָרֵאָיוֹן הַשֵּׁנִי מְתֻכְנָן לְיוֹם שְׁלִישִׁי בְּשָׁעָה עֶשֶׂר.",
    english: "The second interview is scheduled for Tuesday at ten.",
    hebrewTokenPairs: [["הראיון", "הָרֵאָיוֹן"], ["השני", "הַשֵּׁנִי"], ["מתוכנן", "מְתֻכְנָן"], ["ליום שלישי", "לְיוֹם שְׁלִישִׁי"], ["בשעה", "בְּשָׁעָה"], ["עשר", "עֶשֶׂר"]],
    englishTokens: ["The second", "interview", "is scheduled", "for Tuesday", "at", "ten"],
    hebrewDistractorPairs: [["הראשון", "הָרִאשׁוֹן"], ["נדחה", "נִדְחָה"], ["ליום חמישי", "לְיוֹם חֲמִישִׁי"], ["שמונה", "שְׁמוֹנֶה"], ["המבחן", "הַמִּבְחָן"]],
    englishDistractors: ["The first", "was postponed", "for Thursday", "eight", "exam"],
    notes: "מתוכנן is a passive participle — 'is scheduled/planned'. ליום שלישי (for Tuesday) stays one chip vs ליום חמישי (for Thursday)."
  }),
  buildExpandedSentence({
    id: "professional_44", emoji: "☎️", category: "professional", difficulty: 2,
    hebrew: "נא לעדכן את הלקוח לפני שמשנים את לוח הזמנים.", hebrewNiqqud: "נָא לְעַדְכֵּן אֶת הַלָּקוֹחַ לִפְנֵי שֶׁמְּשַׁנִּים אֶת לוּחַ הַזְּמַנִּים.",
    english: "Please update the client before changing the schedule.",
    hebrewTokenPairs: [["נא", "נָא"], ["לעדכן", "לְעַדְכֵּן"], ["את", "אֶת"], ["הלקוח", "הַלָּקוֹחַ"], ["לפני", "לִפְנֵי"], ["שמשנים", "שֶׁמְּשַׁנִּים"], ["את", "אֶת"], ["לוח הזמנים", "לוּחַ הַזְּמַנִּים"]],
    englishTokens: ["Please", "update", "the client", "before", "changing", "the schedule"],
    hebrewDistractorPairs: [["סדר היום", "סֵדֶר הַיּוֹם"], ["הספק", "הַסַּפָּק"], ["אחרי", "אַחֲרֵי"], ["שמבטלים", "שֶׁמְּבַטְּלִים"], ["כדאי", "כְּדַאי"]],
    englishDistractors: ["the agenda", "the vendor", "after", "canceling", "You should"],
    notes: "נא + infinitive is polite-official 'please...'. לוח הזמנים (the schedule) is one compound chip; סדר היום (the agenda) matches its shape. שמשנים is an impersonal plural."
  }),
  buildExpandedSentence({
    id: "professional_45", emoji: "📈", category: "professional", difficulty: 2,
    hebrew: "סיכמנו שכל צוות יציג את ההתקדמות שלו בישיבה הבאה.", hebrewNiqqud: "סִכַּמְנוּ שֶׁכָּל צֶוֶת יַצִּיג אֶת הַהִתְקַדְּמוּת שֶׁלּוֹ בַּיְשִׁיבָה הַבָּאָה.",
    english: "We agreed that each team will present its progress at the next meeting.",
    hebrewTokenPairs: [["סיכמנו", "סִכַּמְנוּ"], ["שכל", "שֶׁכָּל"], ["צוות", "צֶוֶת"], ["יציג", "יַצִּיג"], ["את", "אֶת"], ["ההתקדמות", "הַהִתְקַדְּמוּת"], ["שלו", "שֶׁלּוֹ"], ["בישיבה", "בַּיְשִׁיבָה"], ["הבאה", "הַבָּאָה"]],
    englishTokens: ["We agreed", "that each", "team", "will present", "its", "progress", "at the next", "meeting"],
    hebrewDistractorPairs: [["שכחנו", "שָׁכַחְנוּ"], ["עובד", "עוֹבֵד"], ["הציג", "הִצִּיג"], ["שלה", "שֶׁלָּהּ"], ["הקודמת", "הַקּוֹדֶמֶת"]],
    englishDistractors: ["We forgot", "employee", "presented", "her", "at the previous"],
    notes: "סיכמנו = 'we agreed/settled'. יציג is true future; הציג (presented) is the tense trap. שלו agrees with the masculine צוות."
  }),
  buildExpandedSentence({
    id: "professional_46", emoji: "💰", category: "professional", difficulty: 2,
    hebrew: "התקציב לרבעון הבא עדיין לא אושר.", hebrewNiqqud: "הַתַּקְצִיב לָרִבְעוֹן הַבָּא עֲדַיִן לֹא אֻשַּׁר.",
    english: "The budget for the next quarter hasn't been approved yet.",
    hebrewTokenPairs: [["התקציב", "הַתַּקְצִיב"], ["לרבעון", "לָרִבְעוֹן"], ["הבא", "הַבָּא"], ["עדיין", "עֲדַיִן"], ["לא", "לֹא"], ["אושר", "אֻשַּׁר"]],
    englishTokens: ["The budget", "for the next", "quarter", "hasn't been", "approved", "yet"],
    hebrewDistractorPairs: [["הדוח", "הַדּוּחַ"], ["הקודם", "הַקּוֹדֵם"], ["נדחה", "נִדְחָה"], ["מזמן", "מִזְּמַן"], ["הוגש", "הֻגַּשׁ"]],
    englishDistractors: ["The report", "for the previous", "was rejected", "long ago", "submitted"],
    notes: "אושר is the passive 'was approved'; נדחה (was rejected) is the opposite passive. עדיין לא = not yet."
  }),
  buildExpandedSentence({
    id: "professional_47", emoji: "🎤", category: "professional", difficulty: 2,
    hebrew: "היא הציגה את התוכנית בביטחון והרשימה את כולם.", hebrewNiqqud: "הִיא הִצִּיגָה אֶת הַתָּכְנִית בְּבִטָּחוֹן וְהִרְשִׁימָה אֶת כֻּלָּם.",
    english: "She presented the plan confidently and impressed everyone.",
    hebrewTokenPairs: [["היא", "הִיא"], ["הציגה", "הִצִּיגָה"], ["את", "אֶת"], ["התוכנית", "הַתָּכְנִית"], ["בביטחון", "בְּבִטָּחוֹן"], ["והרשימה", "וְהִרְשִׁימָה"], ["את", "אֶת"], ["כולם", "כֻּלָּם"]],
    englishTokens: ["She", "presented", "the plan", "confidently", "and impressed", "everyone"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["הציג", "הִצִּיג"], ["בלחץ", "בְּלַחַץ"], ["ואכזבה", "וְאִכְזְבָה"], ["ההצעה", "הַהַצָּעָה"]],
    englishDistractors: ["He", "under pressure", "and disappointed", "the offer", "read"],
    notes: "הציגה and הרשימה are feminine past forms — the masculine הציג is the gender swap. אכזבה (disappointed) flips הרשימה (impressed)."
  }),
  buildExpandedSentence({
    id: "professional_48", emoji: "📧", category: "professional", difficulty: 2,
    hebrew: "מצטערת על העיכוב, אחזור אלייך עם תשובה עד מחר.", hebrewNiqqud: "מִצְטַעֶרֶת עַל הָעִכּוּב, אֶחֱזֹר אֵלַיִךְ עִם תְּשׁוּבָה עַד מָחָר.",
    english: "Sorry for the delay, I'll get back to you with an answer by tomorrow.",
    hebrewTokenPairs: [["מצטערת", "מִצְטַעֶרֶת"], ["על", "עַל"], ["העיכוב", "הָעִכּוּב"], ["אחזור", "אֶחֱזֹר"], ["אלייך", "אֵלַיִךְ"], ["עם", "עִם"], ["תשובה", "תְּשׁוּבָה"], ["עד", "עַד"], ["מחר", "מָחָר"]],
    englishTokens: ["Sorry", "for", "the delay", "I'll get back", "to you", "with", "an answer", "by tomorrow"],
    hebrewDistractorPairs: [["מצטער", "מִצְטַעֵר"], ["אליך", "אֵלֶיךָ"], ["הביטול", "הַבִּטּוּל"], ["שאלה", "שְׁאֵלָה"], ["אשלח", "אֶשְׁלַח"]],
    englishDistractors: ["the cancellation", "a question", "I'll send", "to him", "Thanks"],
    notes: "Both speaker and addressee are feminine: מצטערת and אלייך — the masculine forms מצטער/אליך are the gender swap traps. עיכוב = delay."
  }),
  buildExpandedSentence({
    id: "professional_49", emoji: "🖥️", category: "professional", difficulty: 2,
    hebrew: "המערכת תהיה בתחזוקה בין שתיים לארבע, תכננו בהתאם.", hebrewNiqqud: "הַמַּעֲרֶכֶת תִּהְיֶה בְּתַחְזוּקָה בֵּין שְׁתַּיִם לְאַרְבַּע, תַּכְנְנוּ בְּהֶתְאֵם.",
    english: "The system will be down for maintenance between two and four, plan accordingly.",
    hebrewTokenPairs: [["המערכת", "הַמַּעֲרֶכֶת"], ["תהיה", "תִּהְיֶה"], ["בתחזוקה", "בְּתַחְזוּקָה"], ["בין", "בֵּין"], ["שתיים", "שְׁתַּיִם"], ["לארבע", "לְאַרְבַּע"], ["תכננו", "תַּכְנְנוּ"], ["בהתאם", "בְּהֶתְאֵם"]],
    englishTokens: ["The system", "will be down", "for maintenance", "between", "two", "and four", "plan", "accordingly"],
    hebrewDistractorPairs: [["הייתה", "הָיְתָה"], ["האתר", "הָאֲתָר"], ["בשדרוג", "בְּשִׁדְרוּג"], ["לשש", "לְשֵׁשׁ"], ["תמתינו", "תַּמְתִּינוּ"]],
    englishDistractors: ["was down", "The website", "for an upgrade", "and six", "wait"],
    notes: "תהיה is feminine future agreeing with מערכת; הייתה (was) is the tense trap. תכננו is a plural imperative — 'plan (accordingly)'."
  }),
  buildExpandedSentence({
    id: "professional_50", emoji: "🧑‍💻", category: "professional", difficulty: 2,
    hebrew: "קיבלנו שלוש הצעות מחיר, צריך להשוות ביניהן.", hebrewNiqqud: "קִבַּלְנוּ שָׁלוֹשׁ הַצָּעוֹת מְחִיר, צָרִיךְ לְהַשְׁווֹת בֵּינֵיהֶן.",
    english: "We received three price quotes; we need to compare them.",
    hebrewTokenPairs: [["קיבלנו", "קִבַּלְנוּ"], ["שלוש", "שָׁלוֹשׁ"], ["הצעות מחיר", "הַצָּעוֹת מְחִיר"], ["צריך", "צָרִיךְ"], ["להשוות", "לְהַשְׁווֹת"], ["ביניהן", "בֵּינֵיהֶן"]],
    englishTokens: ["We received", "three", "price quotes", "we need", "to compare", "them"],
    hebrewDistractorPairs: [["שלחנו", "שָׁלַחְנוּ"], ["שתי", "שְׁתֵּי"], ["הזמנות עבודה", "הַזְמָנוֹת עֲבוֹדָה"], ["לבחור", "לִבְחֹר"], ["ביניהם", "בֵּינֵיהֶם"]],
    englishDistractors: ["We sent", "two", "work orders", "to choose", "among us"],
    notes: "הצעות מחיר (price quotes) is a compound chip; הזמנות עבודה (work orders) matches its shape. ביניהן is the feminine-plural suffix agreeing with הצעות — ביניהם is the gender swap."
  }),
  buildExpandedSentence({
    id: "professional_51", emoji: "🗂️", category: "professional", difficulty: 2,
    hebrew: "אם לא נקבל אישור היום, נדחה את הפרסום לשבוע הבא.", hebrewNiqqud: "אִם לֹא נְקַבֵּל אִשּׁוּר הַיּוֹם, נִדְחֶה אֶת הַפִּרְסוּם לַשָּׁבוּעַ הַבָּא.",
    english: "If we don't receive approval today, we'll postpone the publication to next week.",
    hebrewTokenPairs: [["אם", "אִם"], ["לא", "לֹא"], ["נקבל", "נְקַבֵּל"], ["אישור", "אִשּׁוּר"], ["היום", "הַיּוֹם"], ["נדחה", "נִדְחֶה"], ["את", "אֶת"], ["הפרסום", "הַפִּרְסוּם"], ["לשבוע", "לַשָּׁבוּעַ"], ["הבא", "הַבָּא"]],
    englishTokens: ["If", "we don't", "receive", "approval", "today", "we'll postpone", "the publication", "to next", "week"],
    hebrewDistractorPairs: [["כאשר", "כַּאֲשֶׁר"], ["נשלח", "נִשְׁלַח"], ["סירוב", "סֵרוּב"], ["נקדים", "נַקְדִּים"], ["אתמול", "אֶתְמוֹל"]],
    englishDistractors: ["When", "we'll send", "a refusal", "we'll move up", "yesterday"],
    notes: "Real conditional: אם + future in both clauses. נדחה (we'll postpone) vs נקדים (we'll move up) is the opposite trap; אישור vs סירוב (approval vs refusal)."
  }),
  buildExpandedSentence({
    id: "formal_37", emoji: "🔗", category: "formal", difficulty: 3,
    hebrew: "הממצאים מצביעים על קשר ישיר בין שני המשתנים.", hebrewNiqqud: "הַמִּמְצָאִים מַצְבִּיעִים עַל קֶשֶׁר יָשִׁיר בֵּין שְׁנֵי הַמִּשְׁתַּנִּים.",
    english: "The findings point to a direct connection between the two variables.",
    hebrewTokenPairs: [["הממצאים", "הַמִּמְצָאִים"], ["מצביעים", "מַצְבִּיעִים"], ["על", "עַל"], ["קשר", "קֶשֶׁר"], ["ישיר", "יָשִׁיר"], ["בין", "בֵּין"], ["שני", "שְׁנֵי"], ["המשתנים", "הַמִּשְׁתַּנִּים"]],
    englishTokens: ["The findings", "point to", "a direct", "connection", "between", "the two", "variables"],
    hebrewDistractorPairs: [["ההנחות", "הַהַנָּחוֹת"], ["מרמזים", "מְרַמְּזִים"], ["עקיף", "עָקִיף"], ["שלושת", "שְׁלוֹשֶׁת"], ["הגורמים", "הַגּוֹרְמִים"]],
    englishDistractors: ["The assumptions", "hint at", "an indirect", "the three", "factors"],
    notes: "Formal research register. ישיר (direct) vs עקיף (indirect) is the key contrast; מצביעים על = 'point to'."
  }),
  buildExpandedSentence({
    id: "formal_38", emoji: "📉", category: "formal", difficulty: 3,
    hebrew: "ככל שהמחיר עולה, כך יורד הביקוש.", hebrewNiqqud: "כְּכָל שֶׁהַמְּחִיר עוֹלֶה, כָּךְ יוֹרֵד הַבִּקּוּשׁ.",
    english: "As the price rises, demand falls.",
    hebrewTokenPairs: [["ככל", "כְּכָל"], ["שהמחיר", "שֶׁהַמְּחִיר"], ["עולה", "עוֹלֶה"], ["כך", "כָּךְ"], ["יורד", "יוֹרֵד"], ["הביקוש", "הַבִּקּוּשׁ"]],
    englishTokens: ["As", "the price", "rises", "demand", "falls"],
    hebrewDistractorPairs: [["שההיצע", "שֶׁהַהֶצֵּעַ"], ["נשאר", "נִשְׁאָר"], ["גדל", "גָּדֵל"], ["ההכנסה", "הַהַכְנָסָה"], ["כאשר", "כַּאֲשֶׁר"]],
    englishDistractors: ["the supply", "stays", "grows", "income", "When"],
    notes: "ככל ש... כך... is the formal correlative 'the more... the more...'. עולה/יורד (rises/falls) is a built-in opposite pair; ביקוש (demand) vs היצע (supply)."
  }),
  buildExpandedSentence({
    id: "formal_39", emoji: "🕰️", category: "formal", difficulty: 3,
    hebrew: "המחקר נערך במשך חמש שנים בשלושה מוסדות שונים.", hebrewNiqqud: "הַמֶּחְקָר נֶעֱרַךְ בְּמֶשֶׁךְ חָמֵשׁ שָׁנִים בִּשְׁלוֹשָׁה מוֹסָדוֹת שׁוֹנִים.",
    english: "The study was conducted over five years at three different institutions.",
    hebrewTokenPairs: [["המחקר", "הַמֶּחְקָר"], ["נערך", "נֶעֱרַךְ"], ["במשך", "בְּמֶשֶׁךְ"], ["חמש", "חָמֵשׁ"], ["שנים", "שָׁנִים"], ["בשלושה", "בִּשְׁלוֹשָׁה"], ["מוסדות", "מוֹסָדוֹת"], ["שונים", "שׁוֹנִים"]],
    englishTokens: ["The study", "was conducted", "over", "five", "years", "at three", "different", "institutions"],
    hebrewDistractorPairs: [["הניסוי", "הַנִּסּוּי"], ["נכתב", "נִכְתַּב"], ["חודשים", "חֳדָשִׁים"], ["זהים", "זֵהִים"], ["בשני", "בִּשְׁנֵי"]],
    englishDistractors: ["The experiment", "was written", "months", "identical", "at two"],
    notes: "נערך is the formal passive 'was conducted'. שונים (different) vs זהים (identical) is the contrast; note the counted phrases חמש שנים and שלושה מוסדות."
  }),
  buildExpandedSentence({
    id: "formal_40", emoji: "⚖️", category: "formal", difficulty: 3,
    hebrew: "לעומת זאת, בקבוצה השנייה נצפתה מגמה הפוכה.", hebrewNiqqud: "לְעֻמַּת זֹאת, בַּקְּבוּצָה הַשְּׁנִיָּה נִצְפְּתָה מְגַמָּה הֲפוּכָה.",
    english: "In contrast, an opposite trend was observed in the second group.",
    hebrewTokenPairs: [["לעומת זאת", "לְעֻמַּת זֹאת"], ["בקבוצה", "בַּקְּבוּצָה"], ["השנייה", "הַשְּׁנִיָּה"], ["נצפתה", "נִצְפְּתָה"], ["מגמה", "מְגַמָּה"], ["הפוכה", "הֲפוּכָה"]],
    englishTokens: ["In contrast", "an opposite", "trend", "was observed", "in the second", "group"],
    hebrewDistractorPairs: [["יתרה מזאת", "יְתֵרָה מִזֹּאת"], ["הראשונה", "הָרִאשׁוֹנָה"], ["נצפה", "נִצְפָּה"], ["דומה", "דּוֹמָה"], ["תוצאה", "תּוֹצָאָה"]],
    englishDistractors: ["Moreover", "in the first", "a similar", "result", "was expected"],
    notes: "לעומת זאת ('in contrast') is a fixed discourse marker kept as one chip; יתרה מזאת ('moreover') matches its shape. נצפתה is a feminine passive agreeing with מגמה."
  }),
  buildExpandedSentence({
    id: "formal_41", emoji: "🧾", category: "formal", difficulty: 3,
    hebrew: "אין די בראיות הקיימות כדי לבסס את המסקנה.", hebrewNiqqud: "אֵין דַּי בָּרְאָיוֹת הַקַּיָּמוֹת כְּדֵי לְבַסֵּס אֶת הַמַּסְקָנָה.",
    english: "The existing evidence is not sufficient to establish the conclusion.",
    hebrewTokenPairs: [["אין", "אֵין"], ["די", "דַּי"], ["בראיות", "בָּרְאָיוֹת"], ["הקיימות", "הַקַּיָּמוֹת"], ["כדי", "כְּדֵי"], ["לבסס", "לְבַסֵּס"], ["את", "אֶת"], ["המסקנה", "הַמַּסְקָנָה"]],
    englishTokens: ["The existing", "evidence", "is not sufficient", "to establish", "the conclusion"],
    hebrewDistractorPairs: [["יש", "יֵשׁ"], ["בנתונים", "בַּנְּתוּנִים"], ["החדשות", "הַחֲדָשׁוֹת"], ["להפריך", "לְהַפְרִיךְ"], ["ההשערה", "הַהַשְׁעָרָה"]],
    englishDistractors: ["The new", "data", "is enough", "to refute", "the hypothesis"],
    notes: "אין די ב... is the formal 'there is not enough...'. לבסס (establish) vs להפריך (refute) is the argumentative opposite. Here די means 'sufficient', not the slangy 'enough!'."
  }),
  buildExpandedSentence({
    id: "formal_42", emoji: "🏛️", category: "formal", difficulty: 3,
    hebrew: "ההצעה תיבחן בוועדה בישיבתה הקרובה.", hebrewNiqqud: "הַהַצָּעָה תִּבָּחֵן בַּוַּעֲדָה בִּישִׁיבָתָהּ הַקְּרוֹבָה.",
    english: "The proposal will be examined by the committee at its upcoming session.",
    hebrewTokenPairs: [["ההצעה", "הַהַצָּעָה"], ["תיבחן", "תִּבָּחֵן"], ["בוועדה", "בַּוַּעֲדָה"], ["בישיבתה", "בִּישִׁיבָתָהּ"], ["הקרובה", "הַקְּרוֹבָה"]],
    englishTokens: ["The proposal", "will be examined", "by the committee", "at its", "upcoming", "session"],
    hebrewDistractorPairs: [["נבחנה", "נִבְחֲנָה"], ["בממשלה", "בַּמֶּמְשָׁלָה"], ["בישיבתו", "בִּישִׁיבָתוֹ"], ["הקודמת", "הַקּוֹדֶמֶת"], ["הבקשה", "הַבַּקָּשָׁה"]],
    englishDistractors: ["was examined", "by the government", "at his", "previous", "The request"],
    notes: "תיבחן is a feminine future passive agreeing with הצעה; נבחנה (was examined) is the tense trap. ישיבתה fuses 'its session' — the ־ה suffix refers back to the feminine ועדה."
  }),
  buildExpandedSentence({
    id: "formal_43", emoji: "📊", category: "formal", difficulty: 3,
    hebrew: "מרבית המשתתפים דיווחו על שיפור ניכר בתוך חודש.", hebrewNiqqud: "מַרְבִּית הַמִּשְׁתַּתְּפִים דִּוְּחוּ עַל שִׁפּוּר נִכָּר בְּתוֹךְ חֹדֶשׁ.",
    english: "Most of the participants reported a noticeable improvement within a month.",
    hebrewTokenPairs: [["מרבית", "מַרְבִּית"], ["המשתתפים", "הַמִּשְׁתַּתְּפִים"], ["דיווחו", "דִּוְּחוּ"], ["על", "עַל"], ["שיפור", "שִׁפּוּר"], ["ניכר", "נִכָּר"], ["בתוך", "בְּתוֹךְ"], ["חודש", "חֹדֶשׁ"]],
    englishTokens: ["Most of", "the participants", "reported", "a noticeable", "improvement", "within", "a month"],
    hebrewDistractorPairs: [["מיעוט", "מִעוּט"], ["החוקרים", "הַחוֹקְרִים"], ["הרעה", "הַרְעָה"], ["קל", "קַל"], ["שנה", "שָׁנָה"]],
    englishDistractors: ["A minority of", "the researchers", "a deterioration", "slight", "a year"],
    notes: "מרבית (most of) vs מיעוט (a minority) frames the quantifier contrast; שיפור (improvement) vs הרעה (deterioration) the outcome contrast. דיווחו is plural past."
  }),
  buildExpandedSentence({
    id: "formal_44", emoji: "🌍", category: "formal", difficulty: 3,
    hebrew: "התופעה נפוצה יותר באזורים עירוניים מאשר בכפריים.", hebrewNiqqud: "הַתּוֹפָעָה נְפוֹצָה יוֹתֵר בַּאֲזוֹרִים עִירוֹנִיִּים מֵאֲשֶׁר בְּכַפְרִיִּים.",
    english: "The phenomenon is more common in urban areas than in rural ones.",
    hebrewTokenPairs: [["התופעה", "הַתּוֹפָעָה"], ["נפוצה", "נְפוֹצָה"], ["יותר", "יוֹתֵר"], ["באזורים", "בַּאֲזוֹרִים"], ["עירוניים", "עִירוֹנִיִּים"], ["מאשר", "מֵאֲשֶׁר"], ["בכפריים", "בְּכַפְרִיִּים"]],
    englishTokens: ["The phenomenon", "is more", "common", "in urban", "areas", "than in rural", "ones"],
    hebrewDistractorPairs: [["נדירה", "נְדִירָה"], ["פחות", "פָּחוֹת"], ["במרכזים", "בַּמֶּרְכָּזִים"], ["מסוכנת", "מְסֻכֶּנֶת"], ["בערים", "בֶּעָרִים"]],
    englishDistractors: ["is less", "rare", "in centers", "dangerous", "in cities"],
    notes: "Comparative frame יותר... מאשר ('more... than'). נפוצה (common) vs נדירה (rare) is the adjective flip; both agree with the feminine תופעה."
  }),
  buildExpandedSentence({
    id: "formal_45", emoji: "🧠", category: "formal", difficulty: 3,
    hebrew: "ראוי לציין כי מדובר בממצאים ראשוניים בלבד.", hebrewNiqqud: "רָאוּי לְצַיֵּן כִּי מְדֻבָּר בְּמִמְצָאִים רִאשׁוֹנִיִּים בִּלְבַד.",
    english: "It is worth noting that these are only preliminary findings.",
    hebrewTokenPairs: [["ראוי", "רָאוּי"], ["לציין", "לְצַיֵּן"], ["כי", "כִּי"], ["מדובר", "מְדֻבָּר"], ["בממצאים", "בְּמִמְצָאִים"], ["ראשוניים", "רִאשׁוֹנִיִּים"], ["בלבד", "בִּלְבַד"]],
    englishTokens: ["It is worth", "noting", "that", "these are", "only", "preliminary", "findings"],
    hebrewDistractorPairs: [["אסור", "אָסוּר"], ["לשכוח", "לִשְׁכֹּחַ"], ["בנתונים", "בַּנְּתוּנִים"], ["סופיים", "סוֹפִיִּים"], ["בעיקר", "בְּעִקָּר"]],
    englishDistractors: ["One must not", "forget", "data", "final", "mainly"],
    notes: "ראוי לציין is the formal opener 'it is worth noting'. מדובר ב... literally means 'this is / it concerns...'. ראשוניים (preliminary) vs סופיים (final) is the key contrast."
  }),
  buildExpandedSentence({
    id: "formal_46", emoji: "🔬", category: "formal", difficulty: 3,
    hebrew: "השערת המחקר אוששה באופן חלקי בלבד.", hebrewNiqqud: "הַשְׁעָרַת הַמֶּחְקָר אֻשְּׁשָׁה בְּאֹפֶן חֶלְקִי בִּלְבַד.",
    english: "The research hypothesis was only partially confirmed.",
    hebrewTokenPairs: [["השערת המחקר", "הַשְׁעָרַת הַמֶּחְקָר"], ["אוששה", "אֻשְּׁשָׁה"], ["באופן", "בְּאֹפֶן"], ["חלקי", "חֶלְקִי"], ["בלבד", "בִּלְבַד"]],
    englishTokens: ["The research hypothesis", "was", "only", "partially", "confirmed"],
    hebrewDistractorPairs: [["שאלת המחקר", "שְׁאֵלַת הַמֶּחְקָר"], ["הופרכה", "הֻפְרְכָה"], ["מלא", "מָלֵא"], ["לחלוטין", "לַחֲלוּטִין"], ["נבדקה", "נִבְדְּקָה"]],
    englishDistractors: ["The research question", "was refuted", "fully", "completely", "was tested"],
    notes: "השערת המחקר (the research hypothesis) is a construct compound chip; שאלת המחקר (the research question) matches its shape. אוששה (was confirmed) vs הופרכה (was refuted) is the classic pair."
  }),
  buildExpandedSentence({
    id: "formal_47", emoji: "⏳", category: "formal", difficulty: 3,
    hebrew: "הצעדים הללו עשויים להועיל בטווח הקצר בלבד.", hebrewNiqqud: "הַצְּעָדִים הַלָּלוּ עֲשׂוּיִים לְהוֹעִיל בַּטְּוָח הַקָּצָר בִּלְבַד.",
    english: "These measures are likely to help in the short term only.",
    hebrewTokenPairs: [["הצעדים", "הַצְּעָדִים"], ["הללו", "הַלָּלוּ"], ["עשויים", "עֲשׂוּיִים"], ["להועיל", "לְהוֹעִיל"], ["בטווח הקצר", "בַּטְּוָח הַקָּצָר"], ["בלבד", "בִּלְבַד"]],
    englishTokens: ["These", "measures", "are likely", "to help", "in the short term", "only"],
    hebrewDistractorPairs: [["עלולים", "עֲלוּלִים"], ["להזיק", "לְהַזִּיק"], ["בטווח הארוך", "בַּטְּוָח הָאָרֹךְ"], ["האלה", "הָאֵלֶּה"], ["המהלכים", "הַמַּהֲלָכִים"]],
    englishDistractors: ["are liable", "to harm", "in the long term", "those", "moves"],
    notes: "עשוי signals a likely positive outcome while עלול signals a feared negative one — a nuance pair worth drilling. בטווח הקצר (the short term) is one chip vs בטווח הארוך (the long term)."
  }),
  buildExpandedSentence({
    id: "formal_48", emoji: "🗳️", category: "formal", difficulty: 3,
    hebrew: "סקר שנערך לאחרונה מלמד כי דעת הקהל חלוקה בנושא.", hebrewNiqqud: "סֶקֶר שֶׁנֶּעֱרַךְ לָאַחֲרוֹנָה מְלַמֵּד כִּי דַּעַת הַקָּהָל חֲלוּקָה בַּנּוֹשֵׂא.",
    english: "A recent survey shows that public opinion is divided on the issue.",
    hebrewTokenPairs: [["סקר", "סֶקֶר"], ["שנערך", "שֶׁנֶּעֱרַךְ"], ["לאחרונה", "לָאַחֲרוֹנָה"], ["מלמד", "מְלַמֵּד"], ["כי", "כִּי"], ["דעת הקהל", "דַּעַת הַקָּהָל"], ["חלוקה", "חֲלוּקָה"], ["בנושא", "בַּנּוֹשֵׂא"]],
    englishTokens: ["A recent", "survey", "shows", "that", "public opinion", "is divided", "on the issue"],
    hebrewDistractorPairs: [["מחקר", "מֶחְקָר"], ["שיתפרסם", "שֶׁיִּתְפַּרְסֵם"], ["דעת המומחים", "דַּעַת הַמֻּמְחִים"], ["מאוחדת", "מְאֻחֶדֶת"], ["מוכיח", "מוֹכִיחַ"]],
    englishDistractors: ["A study", "that will be published", "expert opinion", "is united", "proves"],
    notes: "שנערך is a passive relative clause ('that was conducted'). דעת הקהל (public opinion) is a construct compound chip; דעת המומחים (expert opinion) matches. חלוקה (divided) vs מאוחדת (united)."
  }),
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION_ROUND2);

function addReorderedHebrewAlternate(id, text, textNiqqud, tokenOrder, sourceAlternateIndex = -1) {
  const entry = SENTENCE_BANK.find((sentence) => sentence.id === id);
  if (!entry) return;
  const source = sourceAlternateIndex >= 0 ? entry.hebrew_alternates[sourceAlternateIndex] : entry;
  const tokens = sourceAlternateIndex >= 0 ? source.tokens : source.hebrew_tokens;
  const tokensNiqqud = sourceAlternateIndex >= 0 ? source.tokens_niqqud : source.hebrew_tokens_niqqud;
  entry.hebrew_alternates.push({
    text,
    text_niqqud: textNiqqud,
    tokens: tokenOrder.map((index) => tokens[index]),
    tokens_niqqud: tokenOrder.map((index) => tokensNiqqud[index]),
  });
}

// Authored alternatives only: each order below is natural and preserves the same proposition.
addReorderedHebrewAlternate("everyday_39", "אפשר בבקשה להפעיל מונה?", "אֶפְשָׁר בְּבַקָּשָׁה לְהַפְעִיל מוֹנֶה?", [0, 3, 1, 2]);
addReorderedHebrewAlternate("everyday_40", "סליחה, איך מגיעים לשוק מכאן?", "סְלִיחָה, אֵיךְ מַגִּיעִים לַשּׁוּק מִכָּאן?", [0, 1, 2, 4, 3]);
addReorderedHebrewAlternate("everyday_43", "יש אגוזים במנה הזאת? יש לי אלרגיה.", "יֵשׁ אֱגוֹזִים בַּמָּנָה הַזֹּאת? יֵשׁ לִי אַלֶּרְגְּיָה.", [0, 3, 1, 2, 4, 5, 6]);
addReorderedHebrewAlternate("everyday_49", "כבר יומיים יש לי חום ושיעול.", "כְּבָר יוֹמַיִם יֵשׁ לִי חֹם וְשִׁעוּל.", [4, 5, 0, 1, 2, 3]);
addReorderedHebrewAlternate("everyday_52", "מאז אתמול אין מים חמים.", "מֵאָז אֶתְמוֹל אֵין מַיִם חַמִּים.", [3, 4, 0, 1, 2]);
addReorderedHebrewAlternate("everyday_55", "החודש חשבון החשמל גבוה מהרגיל.", "הַחֹדֶשׁ חֶשְׁבּוֹן הַחַשְׁמַל גָּבוֹהַּ מֵהָרָגִיל.", [3, 0, 1, 2]);
addReorderedHebrewAlternate("everyday_57", "בטופס הזה איפה חותמים?", "בַּטֹּפֶס הַזֶּה אֵיפֹה חוֹתְמִים?", [2, 3, 0, 1]);
addReorderedHebrewAlternate("everyday_59", "בכספומט הכרטיס שלי לא עובד.", "בַּכַּסְפּוֹמָט הַכַּרְטִיס שֶׁלִּי לֹא עוֹבֵד.", [4, 0, 1, 2, 3]);
addReorderedHebrewAlternate("everyday_60", "נישאר בבית אם ימשיך לרדת גשם.", "נִשָּׁאֵר בַּבַּיִת אִם יַמְשִׁיךְ לָרֶדֶת גֶּשֶׁם.", [4, 5, 0, 1, 2, 3]);
addReorderedHebrewAlternate("colloquial_39", "מה בדיוק זה אומר?", "מָה בְּדִיּוּק זֶה אוֹמֵר?", [0, 3, 1, 2]);
addReorderedHebrewAlternate("colloquial_40", "בעברית אומרים את זה ככה, או שיש דרך יותר טבעית?", "בְּעִבְרִית אוֹמְרִים אֶת זֶה כָּכָה, אוֹ שֶׁיֵּשׁ דֶּרֶךְ יוֹתֵר טִבְעִית?", [4, 0, 1, 2, 3, 5, 6, 7, 8, 9]);
addReorderedHebrewAlternate("colloquial_43", "עכשיו לא נעים לי לדבר על זה.", "עַכְשָׁו לֹא נָעִים לִי לְדַבֵּר עַל זֶה.", [6, 0, 1, 2, 3, 4, 5]);
addReorderedHebrewAlternate("colloquial_45", "מה דעתך על קפה אחרי העבודה מחר?", "מָה דַּעְתְּךָ עַל קָפֶה אַחֲרֵי הָעֲבוֹדָה מָחָר?", [0, 1, 2, 3, 5, 6, 4]);
addReorderedHebrewAlternate("colloquial_46", "הערב לא אצליח להגיע; אפשר לדחות?", "הָעֶרֶב לֹא אַצְלִיחַ לְהַגִּיעַ; אֶפְשָׁר לִדְחוֹת?", [3, 0, 1, 2, 4, 5]);
addReorderedHebrewAlternate("colloquial_47", "רק תגידו מתי ואיפה; אני בפנים.", "רַק תַּגִּידוּ מָתַי וְאֵיפֹה; אֲנִי בִּפְנִים.", [2, 3, 4, 5, 0, 1]);
addReorderedHebrewAlternate("colloquial_48", "כשאתה מגיע, תשלח לי מיקום.", "כְּשֶׁאַתָּה מַגִּיעַ, תִּשְׁלַח לִי מִקּוּם.", [3, 4, 0, 1, 2]);
addReorderedHebrewAlternate("colloquial_48", "כשאת מגיעה, תשלחי לי מיקום.", "כְּשֶׁאַתְּ מַגִּיעָה, תִּשְׁלְחִי לִי מִקּוּם.", [3, 4, 0, 1, 2], 0);
addReorderedHebrewAlternate("professional_26", "נעבור בקצרה על סדר היום לפני שמתחילים.", "נַעֲבֹר בִּקְצָרָה עַל סֵדֶר הַיּוֹם לִפְנֵי שֶׁמַּתְחִילִים.", [2, 3, 4, 5, 0, 1]);
addReorderedHebrewAlternate("professional_27", "עד יום רביעי אני יכול לסיים, לא לפני.", "עַד יוֹם רְבִיעִי אֲנִי יָכוֹל לְסַיֵּם, לֹא לִפְנֵי.", [3, 4, 5, 0, 1, 2, 6, 7]);
addReorderedHebrewAlternate("professional_27", "עד יום רביעי אני יכולה לסיים, לא לפני.", "עַד יוֹם רְבִיעִי אֲנִי יְכוֹלָה לְסַיֵּם, לֹא לִפְנֵי.", [3, 4, 5, 0, 1, 2, 6, 7], 0);
addReorderedHebrewAlternate("professional_31", "כרגע מה בעדיפות גבוהה יותר?", "כָּרֶגַע מָה בַּעֲדִיפוּת גְּבוֹהָה יוֹתֵר?", [4, 0, 1, 2, 3]);
addReorderedHebrewAlternate("professional_33", "עד סוף היום אשלח הערכת זמן ועלות.", "עַד סוֹף הַיּוֹם אֶשְׁלַח הַעֲרָכַת זְמַן וְעָלוּת.", [2, 3, 0, 1]);
addReorderedHebrewAlternate("professional_34", "כדי לקבל החלטה, חסרים לנו נתונים.", "כְּדֵי לְקַבֵּל הַחְלָטָה, חֲסֵרִים לָנוּ נְתוּנִים.", [3, 4, 5, 0, 1, 2]);
addReorderedHebrewAlternate("professional_35", "עיכוב באספקה הוא הסיכון העיקרי.", "עִכּוּב בָּאַסְפָּקָה הוּא הַסִּכּוּן הָעִקָּרִי.", [3, 4, 2, 0, 1]);
addReorderedHebrewAlternate("professional_36", "נמשיך לפי התוכנית אם אין התנגדויות.", "נַמְשִׁיךְ לְפִי הַתָּכְנִית אִם אֵין הִתְנַגְּדֻיּוֹת.", [3, 4, 5, 0, 1, 2]);
addReorderedHebrewAlternate("professional_37", "נעביר את הנושא להנהלה אם הבעיה לא תיפתר היום.", "נַעֲבִיר אֶת הַנּוֹשֵׂא לַהַנְהָלָה אִם הַבְּעָיָה לֹא תִּפָּתֵר הַיּוֹם.", [5, 6, 7, 8, 0, 1, 2, 3, 4]);
addReorderedHebrewAlternate("formal_29", "לפני שמסתמכים עליהם, יש להעריך את מהימנות המקורות.", "לִפְנֵי שֶׁמִּסְתַּמְּכִים עֲלֵיהֶם, יֵשׁ לְהַעֲרִיךְ אֶת מְהֵימָנוּת הַמְּקוֹרוֹת.", [5, 6, 7, 0, 1, 2, 3, 4]);
addReorderedHebrewAlternate("formal_30", "מתאם בין המשתנים אינו בהכרח מעיד על קשר סיבתי.", "מִתְאָם בֵּין הַמִּשְׁתַּנִּים אֵינוֹ בְּהֶכְרֵחַ מֵעִיד עַל קֶשֶׁר סִבָּתִי.", [0, 1, 2, 3, 5, 4, 6, 7]);
SENTENCE_BANK.find((sentence) => sentence.id === "formal_31").hebrew_alternates.push({
  text: "היעדר קבוצת ביקורת הוא אחת ממגבלות המחקר.",
  text_niqqud: "הֶעְדֵּר קְבוּצַת בִּקֹּרֶת הוּא אַחַת מִמִּגְבְּלוֹת הַמֶּחְקָר.",
  tokens: ["היעדר", "קבוצת ביקורת", "הוא", "אחת", "ממגבלות", "המחקר"],
  tokens_niqqud: ["הֶעְדֵּר", "קְבוּצַת בִּקֹּרֶת", "הוּא", "אַחַת", "מִמִּגְבְּלוֹת", "הַמֶּחְקָר"],
});
addReorderedHebrewAlternate("formal_32", "מן המדגם הזה אין להכליל על כלל האוכלוסייה.", "מִן הַמִּדְגָּם הַזֶּה אֵין לְהַכְלִיל עַל כְּלַל הָאֻכְלוּסִיָּה.", [2, 3, 4, 0, 1, 5, 6]);
addReorderedHebrewAlternate("everyday_61", "לשלם מחיר מלא על מוצר פגום זה לא הגיוני.", "לְשַׁלֵּם מְחִיר מָלֵא עַל מוּצָר פָּגוּם זֶה לֹא הֶגְיוֹנִי.", [3, 4, 5, 6, 7, 8, 0, 1, 2]);
addReorderedHebrewAlternate("colloquial_53", "אבל אני רוצה לבדוק את הפרטים; זה נשמע הגיוני.", "אֲבָל אֲנִי רוֹצֶה לִבְדֹּק אֶת הַפְּרָטִים; זֶה נִשְׁמָע הֶגְיוֹנִי.", [3, 4, 5, 6, 7, 8, 0, 1, 2]);

// Round-3 expansion: tech & social media, social plans & banter (tranche 1).
const SENTENCE_EXPANSION_ROUND3 = [
  buildExpandedSentence({
    id: "everyday_87", emoji: "🪫", category: "everyday", difficulty: 1,
    hebrew: "הסוללה שלי נגמרה באמצע השיחה.", hebrewNiqqud: "הַסּוֹלְלָה שֶׁלִּי נִגְמְרָה בְּאֶמְצַע הַשִּׂיחָה.",
    english: "My battery died in the middle of the call.",
    hebrewTokenPairs: [["הסוללה", "הַסּוֹלְלָה"], ["שלי", "שֶׁלִּי"], ["נגמרה", "נִגְמְרָה"], ["באמצע", "בְּאֶמְצַע"], ["השיחה", "הַשִּׂיחָה"]],
    englishTokens: ["My battery", "died", "in the middle", "of the call"],
    hebrewDistractorPairs: [["המצלמה", "הַמַּצְלֵמָה"], ["שלה", "שֶׁלָּהּ"], ["נשברה", "נִשְׁבְּרָה"], ["בסוף", "בְּסוֹף"], ["הפגישה", "הַפְּגִישָׁה"]],
    englishDistractors: ["My camera", "broke", "at the end", "of the meeting", "Her battery"],
    notes: "נגמרה — lit. 'ran out/ended': Hebrew says the battery 'finished' rather than 'died'. באמצע = in the middle of."
  }),
  buildExpandedSentence({
    id: "everyday_88", emoji: "📲", category: "everyday", difficulty: 1,
    hebrew: "תשלח לי את התמונה בהודעה.", hebrewNiqqud: "תִּשְׁלַח לִי אֶת הַתְּמוּנָה בְּהוֹדָעָה.",
    english: "Send me the picture in a message.",
    hebrewTokenPairs: [["תשלח", "תִּשְׁלַח"], ["לי", "לִי"], ["את", "אֶת"], ["התמונה", "הַתְּמוּנָה"], ["בהודעה", "בְּהוֹדָעָה"]],
    englishTokens: ["Send", "me", "the picture", "in a message"],
    hebrewDistractorPairs: [["תשלחי", "תִּשְׁלְחִי"], ["לו", "לוֹ"], ["הסרטון", "הַסִּרְטוֹן"], ["במייל", "בַּמֵּייל"]],
    englishDistractors: ["him", "the video", "in an email", "Bring"],
    notes: "Future-tense תשלח works as an imperative in spoken Hebrew ('send!'). תשלחי is the feminine-addressee form.",
    hebrewAlternates: [{
      text: "תשלחי לי את התמונה בהודעה.", textNiqqud: "תִּשְׁלְחִי לִי אֶת הַתְּמוּנָה בְּהוֹדָעָה.",
      tokenPairs: [["תשלחי", "תִּשְׁלְחִי"], ["לי", "לִי"], ["את", "אֶת"], ["התמונה", "הַתְּמוּנָה"], ["בהודעה", "בְּהוֹדָעָה"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_89", emoji: "🔑", category: "everyday", difficulty: 2,
    hebrew: "שכחתי את הסיסמה והייתי צריך לאפס אותה.", hebrewNiqqud: "שָׁכַחְתִּי אֶת הַסִּסְמָה וְהָיִיתִי צָרִיךְ לְאַפֵּס אוֹתָהּ.",
    english: "I forgot the password and had to reset it.",
    hebrewTokenPairs: [["שכחתי", "שָׁכַחְתִּי"], ["את", "אֶת"], ["הסיסמה", "הַסִּסְמָה"], ["והייתי", "וְהָיִיתִי"], ["צריך", "צָרִיךְ"], ["לאפס", "לְאַפֵּס"], ["אותה", "אוֹתָהּ"]],
    englishTokens: ["I forgot", "the password", "and had to", "reset it"],
    hebrewDistractorPairs: [["זכרתי", "זָכַרְתִּי"], ["שם משתמש", "שֵׁם מִשְׁתַּמֵּשׁ"], ["צריכה", "צְרִיכָה"], ["לשנות", "לְשַׁנּוֹת"], ["אותו", "אוֹתוֹ"]],
    englishDistractors: ["I remembered", "the username", "and wanted to", "change it", "she had to"],
    notes: "הייתי צריך = 'I had to' (past modal). לאפס (to reset) is a pi'el built from אפס (zero). אותה agrees with the feminine סיסמה.",
    hebrewAlternates: [{
      text: "שכחתי את הסיסמה והייתי צריכה לאפס אותה.", textNiqqud: "שָׁכַחְתִּי אֶת הַסִּסְמָה וְהָיִיתִי צְרִיכָה לְאַפֵּס אוֹתָהּ.",
      tokenPairs: [["שכחתי", "שָׁכַחְתִּי"], ["את", "אֶת"], ["הסיסמה", "הַסִּסְמָה"], ["והייתי", "וְהָיִיתִי"], ["צריכה", "צְרִיכָה"], ["לאפס", "לְאַפֵּס"], ["אותה", "אוֹתָהּ"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_90", emoji: "📵", category: "everyday", difficulty: 2,
    hebrew: "האפליקציה קורסת כל פעם שאני פותח אותה.", hebrewNiqqud: "הָאַפְּלִיקַצְיָה קוֹרֶסֶת כָּל פַּעַם שֶׁאֲנִי פּוֹתֵחַ אוֹתָהּ.",
    english: "The app crashes every time I open it.",
    hebrewTokenPairs: [["האפליקציה", "הָאַפְּלִיקַצְיָה"], ["קורסת", "קוֹרֶסֶת"], ["כל פעם", "כָּל פַּעַם"], ["שאני", "שֶׁאֲנִי"], ["פותח", "פּוֹתֵחַ"], ["אותה", "אוֹתָהּ"]],
    englishTokens: ["The app", "crashes", "every time", "I open it"],
    hebrewDistractorPairs: [["הטלפון", "הַטֵּלֶפוֹן"], ["נתקעת", "נִתְקַעַת"], ["כל היום", "כָּל הַיּוֹם"], ["פותחת", "פּוֹתַחַת"], ["סוגר", "סוֹגֵר"]],
    englishDistractors: ["The phone", "freezes", "all day", "I close it", "she opens it"],
    notes: "קורסת (crashes — lit. 'collapses') agrees with the feminine אפליקציה. פותח marks a male speaker; פותחת is the feminine swap.",
    hebrewAlternates: [{
      text: "האפליקציה קורסת כל פעם שאני פותחת אותה.", textNiqqud: "הָאַפְּלִיקַצְיָה קוֹרֶסֶת כָּל פַּעַם שֶׁאֲנִי פּוֹתַחַת אוֹתָהּ.",
      tokenPairs: [["האפליקציה", "הָאַפְּלִיקַצְיָה"], ["קורסת", "קוֹרֶסֶת"], ["כל פעם", "כָּל פַּעַם"], ["שאני", "שֶׁאֲנִי"], ["פותחת", "פּוֹתַחַת"], ["אותה", "אוֹתָהּ"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_91", emoji: "📶", category: "everyday", difficulty: 1,
    hebrew: "אין לי קליטה כאן, אחזור אליך אחר כך.", hebrewNiqqud: "אֵין לִי קְלִיטָה כָּאן, אֶחֱזֹר אֵלֶיךָ אַחַר כָּךְ.",
    english: "I have no reception here; I'll get back to you later.",
    hebrewTokenPairs: [["אין", "אֵין"], ["לי", "לִי"], ["קליטה", "קְלִיטָה"], ["כאן", "כָּאן"], ["אחזור", "אֶחֱזֹר"], ["אליך", "אֵלֶיךָ"], ["אחר כך", "אַחַר כָּךְ"]],
    englishTokens: ["I have no", "reception", "here", "I'll get back", "to you", "later"],
    hebrewDistractorPairs: [["יש", "יֵשׁ"], ["אינטרנט", "אִינְטֶרְנֶט"], ["שם", "שָׁם"], ["אתקשר", "אֶתְקַשֵּׁר"], ["לפני כן", "לִפְנֵי כֵן"]],
    englishDistractors: ["There is", "wifi", "there", "I'll call", "before that"],
    notes: "קליטה = (cell) reception. אחזור אליך — lit. 'I will return to you' — is the standard 'I'll get back to you'. אחר כך = later."
  }),
  buildExpandedSentence({
    id: "everyday_92", emoji: "🔉", category: "everyday", difficulty: 2,
    hebrew: "תנמיך את המוזיקה, אני בפגישה.", hebrewNiqqud: "תַּנְמִיךְ אֶת הַמּוּזִיקָה, אֲנִי בִּפְגִישָׁה.",
    english: "Turn down the music; I'm in a meeting.",
    hebrewTokenPairs: [["תנמיך", "תַּנְמִיךְ"], ["את", "אֶת"], ["המוזיקה", "הַמּוּזִיקָה"], ["אני", "אֲנִי"], ["בפגישה", "בִּפְגִישָׁה"]],
    englishTokens: ["Turn down", "the music", "I'm", "in a meeting"],
    hebrewDistractorPairs: [["תגביר", "תַּגְבִּיר"], ["הטלוויזיה", "הַטֵּלֶוִיזְיָה"], ["אתה", "אַתָּה"], ["בחופשה", "בְּחֻפְשָׁה"], ["תנמיכי", "תַּנְמִיכִי"]],
    englishDistractors: ["Turn up", "the TV", "you're", "on vacation", "quiet down"],
    notes: "תנמיך (future of להנמיך, hif'il from נמוך 'low') acts as an imperative: 'turn down'. The opposite trap is תגביר = turn up.",
    hebrewAlternates: [{
      text: "תנמיכי את המוזיקה, אני בפגישה.", textNiqqud: "תַּנְמִיכִי אֶת הַמּוּזִיקָה, אֲנִי בִּפְגִישָׁה.",
      tokenPairs: [["תנמיכי", "תַּנְמִיכִי"], ["את", "אֶת"], ["המוזיקה", "הַמּוּזִיקָה"], ["אני", "אֲנִי"], ["בפגישה", "בִּפְגִישָׁה"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_93", emoji: "💻", category: "everyday", difficulty: 2,
    hebrew: "המחשב התעדכן ועכשיו הכול איטי.", hebrewNiqqud: "הַמַּחְשֵׁב הִתְעַדְכֵּן וְעַכְשָׁו הַכֹּל אִטִּי.",
    english: "The computer updated and now everything is slow.",
    hebrewTokenPairs: [["המחשב", "הַמַּחְשֵׁב"], ["התעדכן", "הִתְעַדְכֵּן"], ["ועכשיו", "וְעַכְשָׁו"], ["הכול", "הַכֹּל"], ["איטי", "אִטִּי"]],
    englishTokens: ["The computer", "updated", "and now", "everything", "is slow"],
    hebrewDistractorPairs: [["הטלפון", "הַטֵּלֶפוֹן"], ["נדלק", "נִדְלַק"], ["מהיר", "מָהִיר"], ["שום דבר", "שׁוּם דָּבָר"]],
    englishDistractors: ["The phone", "turned on", "is fast", "nothing", "and then"],
    notes: "התעדכן — hitpa'el, 'updated itself'; software updates use this reflexive form. הכול = everything; איטי = slow."
  }),
  buildExpandedSentence({
    id: "everyday_94", emoji: "📡", category: "everyday", difficulty: 1,
    hebrew: "יש כאן אינטרנט? מה הסיסמה?", hebrewNiqqud: "יֵשׁ כָּאן אִינְטֶרְנֶט? מָה הַסִּסְמָה?",
    english: "Is there internet here? What's the password?",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["כאן", "כָּאן"], ["אינטרנט", "אִינְטֶרְנֶט"], ["מה", "מָה"], ["הסיסמה", "הַסִּסְמָה"]],
    englishTokens: ["Is there", "internet", "here", "What's", "the password"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["שם", "שָׁם"], ["קליטה", "קְלִיטָה"], ["איפה", "אֵיפֹה"], ["השעה", "הַשָּׁעָה"]],
    englishDistractors: ["There's no", "reception", "there", "Where's", "the time"],
    notes: "Rising intonation turns יש כאן אינטרנט into a yes/no question — no question word needed. הסיסמה = the password."
  }),
  buildExpandedSentence({
    id: "everyday_95", emoji: "📦", category: "everyday", difficulty: 2,
    hebrew: "הזמנתי באינטרנט וזה הגיע תוך יומיים.", hebrewNiqqud: "הִזְמַנְתִּי בָּאִינְטֶרְנֶט וְזֶה הִגִּיעַ תּוֹךְ יוֹמַיִם.",
    english: "I ordered online and it arrived within two days.",
    hebrewTokenPairs: [["הזמנתי", "הִזְמַנְתִּי"], ["באינטרנט", "בָּאִינְטֶרְנֶט"], ["וזה", "וְזֶה"], ["הגיע", "הִגִּיעַ"], ["תוך", "תּוֹךְ"], ["יומיים", "יוֹמַיִם"]],
    englishTokens: ["I ordered", "online", "and it arrived", "within", "two days"],
    hebrewDistractorPairs: [["קניתי", "קָנִיתִי"], ["בחנות", "בַּחֲנוּת"], ["שבועיים", "שְׁבוּעַיִם"], ["אחרי", "אַחֲרֵי"], ["וזאת", "וְזֹאת"]],
    englishDistractors: ["I bought", "at the store", "two weeks", "after", "and she arrived"],
    notes: "תוך יומיים = within two days; יומיים is the dual of יום, like שבועיים (two weeks). קניתי (bought) vs הזמנתי (ordered) is the verb trap."
  }),
  buildExpandedSentence({
    id: "colloquial_74", emoji: "📸", category: "colloquial", difficulty: 2,
    hebrew: "ראית את הסטורי שהיא העלתה אתמול?", hebrewNiqqud: "רָאִיתָ אֶת הַסְּטוֹרִי שֶׁהִיא הֶעֶלְתָה אֶתְמוֹל?",
    english: "Did you see the story she uploaded yesterday?",
    hebrewTokenPairs: [["ראית", "רָאִיתָ"], ["את", "אֶת"], ["הסטורי", "הַסְּטוֹרִי"], ["שהיא", "שֶׁהִיא"], ["העלתה", "הֶעֶלְתָה"], ["אתמול", "אֶתְמוֹל"]],
    englishTokens: ["Did you see", "the story", "she uploaded", "yesterday"],
    hebrewDistractorPairs: [["שמעת", "שָׁמַעְתָּ"], ["התמונה", "הַתְּמוּנָה"], ["שהוא", "שֶׁהוּא"], ["העלה", "הֶעֱלָה"], ["מחקה", "מָחֲקָה"]],
    englishDistractors: ["Did you hear", "the picture", "he uploaded", "she deleted", "today"],
    notes: "סטורי is the borrowed Instagram term. העלתה = 'she uploaded' (להעלות, lit. 'to raise'); masculine העלה is the swap. ראית here addresses a man."
  }),
  buildExpandedSentence({
    id: "colloquial_75", emoji: "🚫", category: "colloquial", difficulty: 2,
    hebrew: "הוא חסם אותי אחרי הוויכוח.", hebrewNiqqud: "הוּא חָסַם אוֹתִי אַחֲרֵי הַוִּכּוּחַ.",
    english: "He blocked me after the argument.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["חסם", "חָסַם"], ["אותי", "אוֹתִי"], ["אחרי", "אַחֲרֵי"], ["הוויכוח", "הַוִּכּוּחַ"]],
    englishTokens: ["He", "blocked", "me", "after", "the argument"],
    hebrewDistractorPairs: [["היא", "הִיא"], ["מחק", "מָחַק"], ["אותו", "אוֹתוֹ"], ["לפני", "לִפְנֵי"], ["הפגישה", "הַפְּגִישָׁה"]],
    englishDistractors: ["She", "deleted", "him", "before", "the meeting"],
    notes: "חסם = blocked (on social media as in real life). ויכוח doubles its vav in plain spelling after the article: הוויכוח."
  }),
  buildExpandedSentence({
    id: "colloquial_76", emoji: "🎬", category: "colloquial", difficulty: 2,
    hebrew: "כולם מדברים על הסרטון שהפך ויראלי.", hebrewNiqqud: "כֻּלָּם מְדַבְּרִים עַל הַסִּרְטוֹן שֶׁהָפַךְ וִירָלִי.",
    english: "Everyone is talking about the video that went viral.",
    hebrewTokenPairs: [["כולם", "כֻּלָּם"], ["מדברים", "מְדַבְּרִים"], ["על", "עַל"], ["הסרטון", "הַסִּרְטוֹן"], ["שהפך", "שֶׁהָפַךְ"], ["ויראלי", "וִירָלִי"]],
    englishTokens: ["Everyone", "is talking", "about", "the video", "that went", "viral"],
    hebrewDistractorPairs: [["אף אחד", "אַף אֶחָד"], ["שומעים", "שׁוֹמְעִים"], ["התמונה", "הַתְּמוּנָה"], ["שנמחק", "שֶׁנִּמְחַק"], ["מפורסם", "מְפֻרְסָם"]],
    englishDistractors: ["Nobody", "is hearing", "the photo", "that was deleted", "famous"],
    notes: "הפך ויראלי = 'became viral'; הפך (turned/became) + adjective is a common pattern. כולם takes the plural מדברים."
  }),
  buildExpandedSentence({
    id: "colloquial_77", emoji: "🤳", category: "colloquial", difficulty: 2,
    hebrew: "אני מבזבז יותר מדי זמן על גלילה בטלפון.", hebrewNiqqud: "אֲנִי מְבַזְבֵּז יוֹתֵר מִדַּי זְמַן עַל גְּלִילָה בַּטֵּלֶפוֹן.",
    english: "I waste too much time scrolling on the phone.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["מבזבז", "מְבַזְבֵּז"], ["יותר מדי", "יוֹתֵר מִדַּי"], ["זמן", "זְמַן"], ["על גלילה", "עַל גְּלִילָה"], ["בטלפון", "בַּטֵּלֶפוֹן"]],
    englishTokens: ["I waste", "too much", "time", "scrolling", "on the phone"],
    hebrewDistractorPairs: [["מבזבזת", "מְבַזְבֶּזֶת"], ["מעט", "מְעַט"], ["כסף", "כֶּסֶף"], ["על משחקים", "עַל מִשְׂחָקִים"], ["במחשב", "בַּמַּחְשֵׁב"]],
    englishDistractors: ["I spend", "too little", "money", "on games", "on the computer"],
    notes: "מבזבז = wastes (masc.); feminine מבזבזת is the gender swap. גלילה (scrolling) is the verbal noun of לגלול (to scroll).",
    hebrewAlternates: [{
      text: "אני מבזבזת יותר מדי זמן על גלילה בטלפון.", textNiqqud: "אֲנִי מְבַזְבֶּזֶת יוֹתֵר מִדַּי זְמַן עַל גְּלִילָה בַּטֵּלֶפוֹן.",
      tokenPairs: [["אני", "אֲנִי"], ["מבזבזת", "מְבַזְבֶּזֶת"], ["יותר מדי", "יוֹתֵר מִדַּי"], ["זמן", "זְמַן"], ["על גלילה", "עַל גְּלִילָה"], ["בטלפון", "בַּטֵּלֶפוֹן"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_78", emoji: "🪫", category: "colloquial", difficulty: 2, style: "whatsapp",
    hebrew: "אני על אחוז סוללה, נדבר יותר מאוחר.", hebrewNiqqud: "אֲנִי עַל אָחוּז סוֹלְלָה, נְדַבֵּר יוֹתֵר מְאֻחָר.",
    english: "I'm at one percent battery; we'll talk later.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["על", "עַל"], ["אחוז", "אָחוּז"], ["סוללה", "סוֹלְלָה"], ["נדבר", "נְדַבֵּר"], ["יותר מאוחר", "יוֹתֵר מְאֻחָר"]],
    englishTokens: ["I'm at", "one percent", "battery", "we'll talk", "later"],
    hebrewDistractorPairs: [["אתה", "אַתָּה"], ["מטען", "מַטְעֵן"], ["נתראה", "נִתְרָאֶה"], ["יותר מוקדם", "יוֹתֵר מֻקְדָּם"], ["בלי", "בְּלִי"]],
    englishDistractors: ["You're at", "a charger", "we'll meet", "earlier", "without"],
    notes: "WhatsApp shorthand. על אחוז — lit. 'on one percent' (battery) — the slangy way to say the phone is about to die. יותר מאוחר = later."
  }),
  buildExpandedSentence({
    id: "colloquial_79", emoji: "👥", category: "colloquial", difficulty: 2,
    hebrew: "תוציא אותי מהקבוצה, יש יותר מדי הודעות.", hebrewNiqqud: "תּוֹצִיא אוֹתִי מֵהַקְּבוּצָה, יֵשׁ יוֹתֵר מִדַּי הוֹדָעוֹת.",
    english: "Take me out of the group; there are too many messages.",
    hebrewTokenPairs: [["תוציא", "תּוֹצִיא"], ["אותי", "אוֹתִי"], ["מהקבוצה", "מֵהַקְּבוּצָה"], ["יש", "יֵשׁ"], ["יותר מדי", "יוֹתֵר מִדַּי"], ["הודעות", "הוֹדָעוֹת"]],
    englishTokens: ["Take me out", "of the group", "there are", "too many", "messages"],
    hebrewDistractorPairs: [["תכניס", "תַּכְנִיס"], ["אותה", "אוֹתָהּ"], ["מכל הקבוצות", "מִכָּל הַקְּבוּצוֹת"], ["אין", "אֵין"], ["תמונות", "תְּמוּנוֹת"]],
    englishDistractors: ["Add me", "to the group", "from all the groups", "there aren't", "pictures"],
    notes: "תוציא (future of להוציא) as an imperative: 'take (me) out'. מהקבוצה = from the (WhatsApp) group. יותר מדי = too many/too much."
  }),
  buildExpandedSentence({
    id: "professional_52", emoji: "🖥️", category: "professional", difficulty: 2,
    hebrew: "נעשה את הפגישה בזום, אשלח לך קישור.", hebrewNiqqud: "נַעֲשֶׂה אֶת הַפְּגִישָׁה בְּזוּם, אֶשְׁלַח לְךָ קִשּׁוּר.",
    english: "We'll do the meeting on Zoom; I'll send you a link.",
    hebrewTokenPairs: [["נעשה", "נַעֲשֶׂה"], ["את", "אֶת"], ["הפגישה", "הַפְּגִישָׁה"], ["בזום", "בְּזוּם"], ["אשלח", "אֶשְׁלַח"], ["לך", "לְךָ"], ["קישור", "קִשּׁוּר"]],
    englishTokens: ["We'll do", "the meeting", "on Zoom", "I'll send", "you", "a link"],
    hebrewDistractorPairs: [["נבטל", "נְבַטֵּל"], ["השיחה", "הַשִּׂיחָה"], ["במשרד", "בַּמִּשְׂרָד"], ["תשלח", "תִּשְׁלַח"], ["זימון", "זִמּוּן"]],
    englishDistractors: ["We'll cancel", "the call", "at the office", "you'll send", "an invite"],
    notes: "נעשה — future 1pl used for plans: 'we'll do'. ב marks the platform (בזום = on Zoom). קישור = link; זימון = calendar invite."
  }),
  buildExpandedSentence({
    id: "professional_53", emoji: "🛠️", category: "professional", difficulty: 2,
    hebrew: "המערכת לא עובדת, התמיכה כבר מטפלת בזה.", hebrewNiqqud: "הַמַּעֲרֶכֶת לֹא עוֹבֶדֶת, הַתְּמִיכָה כְּבָר מְטַפֶּלֶת בָּזֶה.",
    english: "The system is down; support is already handling it.",
    hebrewTokenPairs: [["המערכת", "הַמַּעֲרֶכֶת"], ["לא", "לֹא"], ["עובדת", "עוֹבֶדֶת"], ["התמיכה", "הַתְּמִיכָה"], ["כבר", "כְּבָר"], ["מטפלת", "מְטַפֶּלֶת"], ["בזה", "בָּזֶה"]],
    englishTokens: ["The system", "is", "down", "support", "is already", "handling it"],
    hebrewDistractorPairs: [["האתר", "הָאֲתַר"], ["עובד", "עוֹבֵד"], ["ההנהלה", "הַהַנְהָלָה"], ["מתעלמת", "מִתְעַלֶּמֶת"], ["מזה", "מִזֶּה"]],
    englishDistractors: ["The website", "is working", "management", "is ignoring it", "was handling it"],
    notes: "לא עובדת (lit. 'isn't working') is how Hebrew says a system is down. כבר = already. לטפל takes ב — hence מטפלת בזה."
  }),
  buildExpandedSentence({
    id: "professional_54", emoji: "📧", category: "professional", difficulty: 2,
    hebrew: "שלחתי לך מייל עם קובץ מצורף, תאשר שקיבלת.", hebrewNiqqud: "שָׁלַחְתִּי לְךָ מֵייל עִם קֹבֶץ מְצֹרָף, תְּאַשֵּׁר שֶׁקִּבַּלְתָּ.",
    english: "I sent you an email with an attached file; confirm that you got it.",
    hebrewTokenPairs: [["שלחתי", "שָׁלַחְתִּי"], ["לך", "לְךָ"], ["מייל", "מֵייל"], ["עם", "עִם"], ["קובץ מצורף", "קֹבֶץ מְצֹרָף"], ["תאשר", "תְּאַשֵּׁר"], ["שקיבלת", "שֶׁקִּבַּלְתָּ"]],
    englishTokens: ["I sent", "you", "an email", "with", "an attached file", "confirm", "that you got it"],
    hebrewDistractorPairs: [["קיבלתי", "קִבַּלְתִּי"], ["לה", "לָהּ"], ["הודעה", "הוֹדָעָה"], ["קישור מצורף", "קִשּׁוּר מְצֹרָף"], ["תמחק", "תִּמְחַק"]],
    englishDistractors: ["I received", "her", "a message", "an attached link", "delete"],
    notes: "קובץ מצורף = attached file (מצורף is a passive participle). תאשר — future as imperative, 'confirm'. שקיבלת = that you received."
  }),
  buildExpandedSentence({
    id: "colloquial_80", emoji: "🔥", category: "colloquial", difficulty: 2,
    hebrew: "בואו אלינו בשישי, אנחנו עושים על האש.", hebrewNiqqud: "בּוֹאוּ אֵלֵינוּ בְּשִׁישִׁי, אֲנַחְנוּ עוֹשִׂים עַל הָאֵשׁ.",
    english: "Come over to us on Friday; we're doing a barbecue.",
    hebrewTokenPairs: [["בואו", "בּוֹאוּ"], ["אלינו", "אֵלֵינוּ"], ["בשישי", "בְּשִׁישִׁי"], ["אנחנו", "אֲנַחְנוּ"], ["עושים", "עוֹשִׂים"], ["על האש", "עַל הָאֵשׁ"]],
    englishTokens: ["Come over", "to us", "on Friday", "we're doing", "a barbecue"],
    hebrewDistractorPairs: [["בוא", "בּוֹא"], ["אליהם", "אֲלֵיהֶם"], ["בשבת", "בְּשַׁבָּת"], ["אוכלים", "אוֹכְלִים"], ["על הגג", "עַל הַגָּג"]],
    englishDistractors: ["Come alone", "to them", "on Saturday", "we're eating", "on the roof"],
    notes: "על האש — lit. 'on the fire' — is THE Israeli barbecue idiom. בשישי is short for ביום שישי (on Friday). בואו is the plural imperative."
  }),
  buildExpandedSentence({
    id: "colloquial_81", emoji: "🥗", category: "colloquial", difficulty: 1,
    hebrew: "מה להביא? רק את עצמך.", hebrewNiqqud: "מָה לְהָבִיא? רַק אֶת עַצְמְךָ.",
    english: "What should I bring? Just yourself.",
    hebrewTokenPairs: [["מה", "מָה"], ["להביא", "לְהָבִיא"], ["רק", "רַק"], ["את", "אֶת"], ["עצמך", "עַצְמְךָ"]],
    englishTokens: ["What", "should I bring", "Just", "yourself"],
    hebrewDistractorPairs: [["מי", "מִי"], ["לקנות", "לִקְנוֹת"], ["גם", "גַּם"], ["עצמכם", "עַצְמְכֶם"], ["משהו", "מַשֶּׁהוּ"]],
    englishDistractors: ["Who", "should I buy", "also", "yourselves", "something"],
    notes: "רק את עצמך — 'just yourself'; the reflexive עצמך takes the object marker את. Addressed to a man; to a woman the vowels change but not the spelling."
  }),
  buildExpandedSentence({
    id: "colloquial_82", emoji: "🚗", category: "colloquial", difficulty: 1,
    hebrew: "סליחה שאיחרתי, היה פקק מטורף.", hebrewNiqqud: "סְלִיחָה שֶׁאִחַרְתִּי, הָיָה פְּקָק מְטֹרָף.",
    english: "Sorry I'm late; there was crazy traffic.",
    hebrewTokenPairs: [["סליחה", "סְלִיחָה"], ["שאיחרתי", "שֶׁאִחַרְתִּי"], ["היה", "הָיָה"], ["פקק", "פְּקָק"], ["מטורף", "מְטֹרָף"]],
    englishTokens: ["Sorry", "I'm late", "there was", "crazy", "traffic"],
    hebrewDistractorPairs: [["תודה", "תּוֹדָה"], ["שהקדמתי", "שֶׁהִקְדַּמְתִּי"], ["יהיה", "יִהְיֶה"], ["גשם", "גֶּשֶׁם"], ["קל", "קַל"]],
    englishDistractors: ["Thanks", "I'm early", "there will be", "rain", "light"],
    notes: "פקק = traffic jam (lit. 'cork'). מטורף = crazy, the standard slang intensifier. סליחה ש… = sorry that…"
  }),
  buildExpandedSentence({
    id: "colloquial_83", emoji: "😲", category: "colloquial", difficulty: 2,
    hebrew: "אין מצב שסיימת את הכול לבד!", hebrewNiqqud: "אֵין מַצָּב שֶׁסִּיַּמְתָּ אֶת הַכֹּל לְבַד!",
    english: "No way you finished all of it alone!",
    hebrewTokenPairs: [["אין מצב", "אֵין מַצָּב"], ["שסיימת", "שֶׁסִּיַּמְתָּ"], ["את", "אֶת"], ["הכול", "הַכֹּל"], ["לבד", "לְבַד"]],
    englishTokens: ["No way", "you finished", "all of it", "alone"],
    hebrewDistractorPairs: [["ברור", "בָּרוּר"], ["שהתחלת", "שֶׁהִתְחַלְתָּ"], ["חצי", "חֲצִי"], ["ביחד", "בְּיַחַד"], ["כל היום", "כָּל הַיּוֹם"]],
    englishDistractors: ["Obviously", "you started", "half", "together", "all day"],
    notes: "אין מצב — lit. 'there's no situation' — the go-to slang for 'no way!'. לבד = alone. שסיימת here addresses a man."
  }),
  buildExpandedSentence({
    id: "colloquial_84", emoji: "💸", category: "colloquial", difficulty: 2,
    hebrew: "בוא נתחלק בחשבון, בפעם הבאה זה עליי.", hebrewNiqqud: "בּוֹא נִתְחַלֵּק בַּחֶשְׁבּוֹן, בַּפַּעַם הַבָּאָה זֶה עָלַי.",
    english: "Let's split the bill; next time it's on me.",
    hebrewTokenPairs: [["בוא", "בּוֹא"], ["נתחלק", "נִתְחַלֵּק"], ["בחשבון", "בַּחֶשְׁבּוֹן"], ["בפעם הבאה", "בַּפַּעַם הַבָּאָה"], ["זה", "זֶה"], ["עליי", "עָלַי"]],
    englishTokens: ["Let's", "split", "the bill", "next time", "it's on me"],
    hebrewDistractorPairs: [["בואי", "בּוֹאִי"], ["נשלם", "נְשַׁלֵּם"], ["בטיפ", "בַּטִּיפּ"], ["בשבוע הבא", "בַּשָּׁבוּעַ הַבָּא"], ["עליך", "עָלֶיךָ"]],
    englishDistractors: ["we'll pay", "the tip", "next week", "it's on you", "Let's go"],
    notes: "בוא + future = 'let's'. נתחלק = split (hitpa'el of חלק). זה עליי — 'it's on me' works for picking up the bill exactly like in English.",
    hebrewAlternates: [{
      text: "בואי נתחלק בחשבון, בפעם הבאה זה עליי.", textNiqqud: "בּוֹאִי נִתְחַלֵּק בַּחֶשְׁבּוֹן, בַּפַּעַם הַבָּאָה זֶה עָלַי.",
      tokenPairs: [["בואי", "בּוֹאִי"], ["נתחלק", "נִתְחַלֵּק"], ["בחשבון", "בַּחֶשְׁבּוֹן"], ["בפעם הבאה", "בַּפַּעַם הַבָּאָה"], ["זה", "זֶה"], ["עליי", "עָלַי"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_85", emoji: "🤗", category: "colloquial", difficulty: 2,
    hebrew: "מזמן לא התראינו, מת לראות אותך!", hebrewNiqqud: "מִזְּמַן לֹא הִתְרָאִינוּ, מֵת לִרְאוֹת אוֹתְךָ!",
    english: "We haven't seen each other in ages; dying to see you!",
    hebrewTokenPairs: [["מזמן", "מִזְּמַן"], ["לא", "לֹא"], ["התראינו", "הִתְרָאִינוּ"], ["מת", "מֵת"], ["לראות", "לִרְאוֹת"], ["אותך", "אוֹתְךָ"]],
    englishTokens: ["We haven't seen each other", "in ages", "dying", "to see you"],
    hebrewDistractorPairs: [["עוד לא", "עוֹד לֹא"], ["דיברנו", "דִּבַּרְנוּ"], ["מתה", "מֵתָה"], ["לשמוע", "לִשְׁמֹעַ"], ["אותם", "אוֹתָם"]],
    englishDistractors: ["We haven't talked", "not yet", "excited", "to hear you", "them"],
    notes: "התראינו — reciprocal hitpa'el, 'saw each other'. מת ל… (lit. 'dying to') = 'can't wait to'. A female speaker says מתה.",
    hebrewAlternates: [{
      text: "מזמן לא התראינו, מתה לראות אותך!", textNiqqud: "מִזְּמַן לֹא הִתְרָאִינוּ, מֵתָה לִרְאוֹת אוֹתְךָ!",
      tokenPairs: [["מזמן", "מִזְּמַן"], ["לא", "לֹא"], ["התראינו", "הִתְרָאִינוּ"], ["מתה", "מֵתָה"], ["לראות", "לִרְאוֹת"], ["אותך", "אוֹתְךָ"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_86", emoji: "🍺", category: "colloquial", difficulty: 2,
    hebrew: "אם אתה כבר בא, תביא משהו לשתות.", hebrewNiqqud: "אִם אַתָּה כְּבָר בָּא, תָּבִיא מַשֶּׁהוּ לִשְׁתּוֹת.",
    english: "If you're coming anyway, bring something to drink.",
    hebrewTokenPairs: [["אם", "אִם"], ["אתה", "אַתָּה"], ["כבר", "כְּבָר"], ["בא", "בָּא"], ["תביא", "תָּבִיא"], ["משהו", "מַשֶּׁהוּ"], ["לשתות", "לִשְׁתּוֹת"]],
    englishTokens: ["If", "you're", "coming", "anyway", "bring", "something", "to drink"],
    hebrewDistractorPairs: [["את", "אַתְּ"], ["באה", "בָּאָה"], ["תקנה", "תִּקְנֶה"], ["לאכול", "לֶאֱכֹל"], ["מחר", "מָחָר"]],
    englishDistractors: ["she's coming", "buy", "to eat", "tomorrow", "If not"],
    notes: "אם אתה כבר בא — כבר here means 'anyway / already on your way'. תביא = future as imperative. To a woman: אם את כבר באה, תביאי."
  }),
  buildExpandedSentence({
    id: "colloquial_87", emoji: "😏", category: "colloquial", difficulty: 1,
    hebrew: "אתה עובד עליי? ברצינות?", hebrewNiqqud: "אַתָּה עוֹבֵד עָלַי? בִּרְצִינוּת?",
    english: "Are you messing with me? Seriously?",
    hebrewTokenPairs: [["אתה", "אַתָּה"], ["עובד", "עוֹבֵד"], ["עליי", "עָלַי"], ["ברצינות", "בִּרְצִינוּת"]],
    englishTokens: ["Are you", "messing", "with me", "Seriously"],
    hebrewDistractorPairs: [["את", "אַתְּ"], ["צוחק", "צוֹחֵק"], ["עלינו", "עָלֵינוּ"], ["בצחוק", "בִּצְחוֹק"]],
    englishDistractors: ["Is he", "laughing", "at us", "As a joke"],
    notes: "עובד עליי — lit. 'working on me' — slang for 'pulling my leg / messing with me'. ברצינות = seriously."
  }),
  buildExpandedSentence({
    id: "colloquial_88", emoji: "🪑", category: "colloquial", difficulty: 1,
    hebrew: "תשמרו לי מקום, אני בדרך.", hebrewNiqqud: "תִּשְׁמְרוּ לִי מָקוֹם, אֲנִי בַּדֶּרֶךְ.",
    english: "Save me a seat; I'm on my way.",
    hebrewTokenPairs: [["תשמרו", "תִּשְׁמְרוּ"], ["לי", "לִי"], ["מקום", "מָקוֹם"], ["אני", "אֲנִי"], ["בדרך", "בַּדֶּרֶךְ"]],
    englishTokens: ["Save", "me", "a seat", "I'm", "on my way"],
    hebrewDistractorPairs: [["מהר", "מַהֵר"], ["לו", "לוֹ"], ["כיסא", "כִּסֵּא"], ["אתם", "אַתֶּם"], ["בבית", "בַּבַּיִת"]],
    englishDistractors: ["quickly", "him", "a chair", "you're", "at home"],
    notes: "תשמרו — plural future-as-imperative: 'save (for) me'. אני בדרך = I'm on my way (lit. 'in the way')."
  }),
  buildExpandedSentence({
    id: "colloquial_89", emoji: "🍰", category: "colloquial", difficulty: 2,
    hebrew: "יצא מדהים, אתה חייב לתת לי את המתכון.", hebrewNiqqud: "יָצָא מַדְהִים, אַתָּה חַיָּב לָתֵת לִי אֶת הַמַּתְכּוֹן.",
    english: "It came out amazing; you have to give me the recipe.",
    hebrewTokenPairs: [["יצא", "יָצָא"], ["מדהים", "מַדְהִים"], ["אתה", "אַתָּה"], ["חייב", "חַיָּב"], ["לתת", "לָתֵת"], ["לי", "לִי"], ["את", "אֶת"], ["המתכון", "הַמַּתְכּוֹן"]],
    englishTokens: ["It came out", "amazing", "you have to", "give", "me", "the recipe"],
    hebrewDistractorPairs: [["יצאה", "יָצְאָה"], ["נורא", "נוֹרָא"], ["חייבת", "חַיֶּבֶת"], ["לקחת", "לָקַחַת"], ["הרשימה", "הָרְשִׁימָה"]],
    englishDistractors: ["She came out", "awful", "take", "the list", "you want to"],
    notes: "יצא מדהים — 'it came out amazing'; יצא is the go-to verb for how food or projects turn out. חייב = must (fem. חייבת).",
    hebrewAlternates: [{
      text: "יצא מדהים, את חייבת לתת לי את המתכון.", textNiqqud: "יָצָא מַדְהִים, אַתְּ חַיֶּבֶת לָתֵת לִי אֶת הַמַּתְכּוֹן.",
      tokenPairs: [["יצא", "יָצָא"], ["מדהים", "מַדְהִים"], ["את", "אַתְּ"], ["חייבת", "חַיֶּבֶת"], ["לתת", "לָתֵת"], ["לי", "לִי"], ["את", "אֶת"], ["המתכון", "הַמַּתְכּוֹן"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_90", emoji: "🕗", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "אחי, איפה אתה? כולם כבר פה.", hebrewNiqqud: "אָחִי, אֵיפֹה אַתָּה? כֻּלָּם כְּבָר פֹּה.",
    english: "Bro, where are you? Everyone's already here.",
    hebrewTokenPairs: [["אחי", "אָחִי"], ["איפה", "אֵיפֹה"], ["אתה", "אַתָּה"], ["כולם", "כֻּלָּם"], ["כבר", "כְּבָר"], ["פה", "פֹּה"]],
    englishTokens: ["Bro", "where are you", "Everyone's", "already", "here"],
    hebrewDistractorPairs: [["אחותי", "אֲחוֹתִי"], ["מתי", "מָתַי"], ["אני", "אֲנִי"], ["אף אחד", "אַף אֶחָד"], ["שם", "שָׁם"]],
    englishDistractors: ["Sis", "when are you", "Nobody's", "there", "at the party"],
    notes: "WhatsApp register. אחי (lit. 'my brother') = bro, the default address between friends. פה = here, the colloquial twin of כאן. כבר = already."
  }),
  buildExpandedSentence({
    id: "colloquial_91", emoji: "😂", category: "colloquial", difficulty: 2,
    hebrew: "החברים שלי צוחקים עליי שאני תמיד מאחר.", hebrewNiqqud: "הַחֲבֵרִים שֶׁלִּי צוֹחֲקִים עָלַי שֶׁאֲנִי תָּמִיד מְאַחֵר.",
    english: "My friends make fun of me for always being late.",
    hebrewTokenPairs: [["החברים שלי", "הַחֲבֵרִים שֶׁלִּי"], ["צוחקים", "צוֹחֲקִים"], ["עליי", "עָלַי"], ["שאני", "שֶׁאֲנִי"], ["תמיד", "תָּמִיד"], ["מאחר", "מְאַחֵר"]],
    englishTokens: ["My friends", "make fun of me", "for always", "being late"],
    hebrewDistractorPairs: [["ההורים שלי", "הַהוֹרִים שֶׁלִּי"], ["כועסים", "כּוֹעֲסִים"], ["אף פעם", "אַף פַּעַם"], ["מקדים", "מַקְדִּים"], ["מאחרת", "מְאַחֶרֶת"]],
    englishDistractors: ["My parents", "are angry at me", "for never", "being early", "my sisters"],
    notes: "צוחקים עליי = laugh at me / make fun of me (על marks the target). מאחר = habitually late (masc.); fem. מאחרת.",
    hebrewAlternates: [{
      text: "החברים שלי צוחקים עליי שאני תמיד מאחרת.", textNiqqud: "הַחֲבֵרִים שֶׁלִּי צוֹחֲקִים עָלַי שֶׁאֲנִי תָּמִיד מְאַחֶרֶת.",
      tokenPairs: [["החברים שלי", "הַחֲבֵרִים שֶׁלִּי"], ["צוחקים", "צוֹחֲקִים"], ["עליי", "עָלַי"], ["שאני", "שֶׁאֲנִי"], ["תמיד", "תָּמִיד"], ["מאחרת", "מְאַחֶרֶת"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_96", emoji: "🍲", category: "everyday", difficulty: 2,
    hebrew: "אנחנו מארחים הערב, אז אני מבשל כל היום.", hebrewNiqqud: "אֲנַחְנוּ מְאָרְחִים הָעֶרֶב, אָז אֲנִי מְבַשֵּׁל כָּל הַיּוֹם.",
    english: "We're hosting tonight, so I've been cooking all day.",
    hebrewTokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["מארחים", "מְאָרְחִים"], ["הערב", "הָעֶרֶב"], ["אז", "אָז"], ["אני", "אֲנִי"], ["מבשל", "מְבַשֵּׁל"], ["כל היום", "כָּל הַיּוֹם"]],
    englishTokens: ["We're hosting", "tonight", "so", "I've been cooking", "all day"],
    hebrewDistractorPairs: [["הם", "הֵם"], ["אוכלים", "אוֹכְלִים"], ["מחר", "מָחָר"], ["מבשלת", "מְבַשֶּׁלֶת"], ["כל הלילה", "כָּל הַלַּיְלָה"]],
    englishDistractors: ["They're eating", "tomorrow", "but", "she's been cooking", "all night"],
    notes: "מארחים = hosting (לארח). Present-tense מבשל plus a duration (כל היום) covers English 'have been cooking'. Fem. speaker: מבשלת.",
    hebrewAlternates: [{
      text: "אנחנו מארחים הערב, אז אני מבשלת כל היום.", textNiqqud: "אֲנַחְנוּ מְאָרְחִים הָעֶרֶב, אָז אֲנִי מְבַשֶּׁלֶת כָּל הַיּוֹם.",
      tokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["מארחים", "מְאָרְחִים"], ["הערב", "הָעֶרֶב"], ["אז", "אָז"], ["אני", "אֲנִי"], ["מבשלת", "מְבַשֶּׁלֶת"], ["כל היום", "כָּל הַיּוֹם"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_97", emoji: "🕖", category: "everyday", difficulty: 1,
    hebrew: "באיזו שעה אמרנו להיפגש?", hebrewNiqqud: "בְּאֵיזוֹ שָׁעָה אָמַרְנוּ לְהִפָּגֵשׁ?",
    english: "What time did we say we'd meet?",
    hebrewTokenPairs: [["באיזו", "בְּאֵיזוֹ"], ["שעה", "שָׁעָה"], ["אמרנו", "אָמַרְנוּ"], ["להיפגש", "לְהִפָּגֵשׁ"]],
    englishTokens: ["What time", "did we say", "we'd meet"],
    hebrewDistractorPairs: [["באיזה", "בְּאֵיזֶה"], ["יום", "יוֹם"], ["שכחנו", "שָׁכַחְנוּ"], ["להתקשר", "לְהִתְקַשֵּׁר"]],
    englishDistractors: ["What day", "did we forget", "we'd call", "at whose place"],
    notes: "באיזו שעה — 'at what hour'; איזו agrees with the feminine שעה (masc. איזה). להיפגש = to meet (nif'al, reciprocal)."
  }),
  buildExpandedSentence({
    id: "everyday_98", emoji: "📅", category: "everyday", difficulty: 2,
    hebrew: "אפשר לדחות לשבוע הבא? משהו צץ לי.", hebrewNiqqud: "אֶפְשָׁר לִדְחוֹת לַשָּׁבוּעַ הַבָּא? מַשֶּׁהוּ צָץ לִי.",
    english: "Can we push it to next week? Something came up.",
    hebrewTokenPairs: [["אפשר", "אֶפְשָׁר"], ["לדחות", "לִדְחוֹת"], ["לשבוע הבא", "לַשָּׁבוּעַ הַבָּא"], ["משהו", "מַשֶּׁהוּ"], ["צץ", "צָץ"], ["לי", "לִי"]],
    englishTokens: ["Can we", "push it", "to next week", "Something", "came up"],
    hebrewDistractorPairs: [["אי אפשר", "אִי אֶפְשָׁר"], ["להקדים", "לְהַקְדִּים"], ["לחודש הבא", "לַחֹדֶשׁ הַבָּא"], ["שום דבר", "שׁוּם דָּבָר"], ["נפל", "נָפַל"]],
    englishDistractors: ["We can't", "move it up", "to next month", "Nothing", "fell through"],
    notes: "לדחות = to postpone; להקדים (move earlier) is its opposite. צץ לי — lit. 'popped up on me' — the idiom for 'something came up'."
  }),
  buildExpandedSentence({
    id: "everyday_99", emoji: "🧮", category: "everyday", difficulty: 2,
    hebrew: "כמה אנשים באים בסוף? שאדע כמה לבשל.", hebrewNiqqud: "כַּמָּה אֲנָשִׁים בָּאִים בַּסּוֹף? שֶׁאֵדַע כַּמָּה לְבַשֵּׁל.",
    english: "How many people are coming in the end? So I know how much to cook.",
    hebrewTokenPairs: [["כמה", "כַּמָּה"], ["אנשים", "אֲנָשִׁים"], ["באים", "בָּאִים"], ["בסוף", "בַּסּוֹף"], ["שאדע", "שֶׁאֵדַע"], ["כמה", "כַּמָּה"], ["לבשל", "לְבַשֵּׁל"]],
    englishTokens: ["How many", "people", "are coming", "in the end", "So I know", "how much", "to cook"],
    hebrewDistractorPairs: [["מתי", "מָתַי"], ["ילדים", "יְלָדִים"], ["עוזבים", "עוֹזְבִים"], ["שאזכור", "שֶׁאֶזְכֹּר"], ["לקנות", "לִקְנוֹת"]],
    englishDistractors: ["When", "kids", "are leaving", "So I remember", "to buy"],
    notes: "שאדע — 'so that I'll know'; bare ש + future expresses purpose in speech. בסוף = in the end. כמה covers both 'how many' and 'how much'."
  }),
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION_ROUND3);

function cloneSentence(item) {
  return {
    ...item,
    english_tokens: Array.isArray(item?.english_tokens) ? [...item.english_tokens] : [],
    hebrew_tokens: Array.isArray(item?.hebrew_tokens) ? [...item.hebrew_tokens] : [],
    hebrew_tokens_niqqud: Array.isArray(item?.hebrew_tokens_niqqud) ? [...item.hebrew_tokens_niqqud] : [],
    english_distractors: Array.isArray(item?.english_distractors) ? [...item.english_distractors] : [],
    hebrew_distractors: Array.isArray(item?.hebrew_distractors) ? [...item.hebrew_distractors] : [],
    hebrew_distractors_niqqud: Array.isArray(item?.hebrew_distractors_niqqud) ? [...item.hebrew_distractors_niqqud] : [],
  };
}

global.IvriQuestSentenceBank = {
  getSentenceBank() {
    return SENTENCE_BANK.map(cloneSentence);
  },
  getFlexibleModifierTokens() {
    return [...HEBREW_FLEXIBLE_MODIFIER_TOKENS];
  },
  __build: "20260712a",
};
})(typeof window !== "undefined" ? window : globalThis);

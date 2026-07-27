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
  englishAlternates = [],
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
    english_alternates: englishAlternates.map((alternate) => ({
      text: alternate.text,
      tokens: alternate.tokens,
    })),
    notes,
  };
}

function buildReviewedSentence({
  wordOrderDecision,
  hebrewOrderAlternates = [],
  hebrewTokenPairs,
  hebrewAlternates = [],
  ...sentence
}) {
  if (!["fixed", "alternates"].includes(wordOrderDecision)) {
    throw new Error(`${sentence.id || "New sentence"} needs wordOrderDecision: "fixed" or "alternates"`);
  }

  const expectedOrder = hebrewTokenPairs.map((_, index) => index).join(",");
  const reorderedAlternates = hebrewOrderAlternates.map(({ text, textNiqqud, order }) => {
    if (!Array.isArray(order) || [...order].sort((a, b) => a - b).join(",") !== expectedOrder) {
      throw new Error(`${sentence.id} has an invalid Hebrew token-order permutation`);
    }
    return {
      text,
      textNiqqud,
      tokenPairs: order.map((index) => hebrewTokenPairs[index]),
    };
  });
  const entry = buildExpandedSentence({
    ...sentence,
    hebrewTokenPairs,
    hebrewAlternates: [...hebrewAlternates, ...reorderedAlternates],
  });
  const primaryOrder = entry.hebrew_tokens.join("\u001f");
  const hasReorderedAlternate = entry.hebrew_alternates.some(
    (alternate) => alternate.tokens.join("\u001f") !== primaryOrder
  );

  if (wordOrderDecision === "alternates" && !hasReorderedAlternate) {
    throw new Error(`${entry.id} is marked flexible but has no reordered Hebrew alternate`);
  }
  if (wordOrderDecision === "fixed" && hasReorderedAlternate) {
    throw new Error(`${entry.id} has a reordered Hebrew alternate but is marked fixed`);
  }

  return {
    ...entry,
    hebrew_order_review: wordOrderDecision,
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
      "בָּאָה"
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
      "בָּאָה",
      "תַּחְלִיטִי"
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
    "hebrew_alternates": [
      {
        "text": "כרגע אנחנו עובדים על זה, נעדכן כשיהיו תוצאות.",
        "text_niqqud": "כָּרֶגַע אֲנַחְנוּ עוֹבְדִים עַל זֶה, נְעַדְכֵּן כְּשֶׁיִּהְיוּ תּוֹצָאוֹת.",
        "tokens": ["כרגע", "אנחנו", "עובדים", "על", "זה", "נעדכן", "כשיהיו", "תוצאות"],
        "tokens_niqqud": ["כָּרֶגַע", "אֲנַחְנוּ", "עוֹבְדִים", "עַל", "זֶה", "נְעַדְכֵּן", "כְּשֶׁיִּהְיוּ", "תּוֹצָאוֹת"]
      },
      {
        "text": "אנחנו כרגע עובדים על זה, נעדכן כשיהיו תוצאות.",
        "text_niqqud": "אֲנַחְנוּ כָּרֶגַע עוֹבְדִים עַל זֶה, נְעַדְכֵּן כְּשֶׁיִּהְיוּ תּוֹצָאוֹת.",
        "tokens": ["אנחנו", "כרגע", "עובדים", "על", "זה", "נעדכן", "כשיהיו", "תוצאות"],
        "tokens_niqqud": ["אֲנַחְנוּ", "כָּרֶגַע", "עוֹבְדִים", "עַל", "זֶה", "נְעַדְכֵּן", "כְּשֶׁיִּהְיוּ", "תּוֹצָאוֹת"]
      }
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
    "hebrew_alternates": [
      {
        "text": "בהמשך היום נשלח גרסה מעודכנת, אחרי שנבצע תיקונים.",
        "text_niqqud": "בְּהֶמְשֵׁךְ הַיּוֹם נִשְׁלַח גִּרְסָה מְעֻדְכֶּנֶת, אַחֲרֵי שֶׁנְּבַצֵּעַ תִּקּוּנִים.",
        "tokens": ["בהמשך", "היום", "נשלח", "גרסה", "מעודכנת", "אחרי", "שנבצע", "תיקונים"],
        "tokens_niqqud": ["בְּהֶמְשֵׁךְ", "הַיּוֹם", "נִשְׁלַח", "גִּרְסָה", "מְעֻדְכֶּנֶת", "אַחֲרֵי", "שֶׁנְּבַצֵּעַ", "תִּקּוּנִים"]
      }
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
    "hebrew_alternates": [
      {
        "text": "ההסכם קיים עדיין למרות השינויים.",
        "text_niqqud": "הַהֶסְכֵּם קַיָּם עֲדַיִן לַמְרוֹת הַשִּׁנּוּיִים.",
        "tokens": ["ההסכם", "קיים", "עדיין", "למרות", "השינויים"],
        "tokens_niqqud": ["הַהֶסְכֵּם", "קַיָּם", "עֲדַיִן", "לַמְרוֹת", "הַשִּׁנּוּיִים"]
      }
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
    "hebrew_alternates": [
      {
        "text": "קיום חיים מחוץ לכדור הארץ לא הוכח עדיין.",
        "text_niqqud": "קִיּוּם חַיִּים מִחוּץ לְכַדּוּר הָאָרֶץ לֹא הוּכַח עֲדַיִן.",
        "tokens": ["קיום", "חיים", "מחוץ", "לכדור", "הארץ", "לא", "הוכח", "עדיין"],
        "tokens_niqqud": ["קִיּוּם", "חַיִּים", "מִחוּץ", "לְכַדּוּר", "הָאָרֶץ", "לֹא", "הוּכַח", "עֲדַיִן"]
      }
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
    "hebrew_alternates": [
      {
        "text": "לקחתי מספר ואני מחכה כבר שעה בתור.",
        "text_niqqud": "לָקַחְתִּי מִסְפָּר וַאֲנִי מְחַכֶּה כְּבָר שָׁעָה בַּתּוֹר.",
        "tokens": ["לקחתי", "מספר", "ואני", "מחכה", "כבר", "שעה", "בתור"],
        "tokens_niqqud": ["לָקַחְתִּי", "מִסְפָּר", "וַאֲנִי", "מְחַכֶּה", "כְּבָר", "שָׁעָה", "בַּתּוֹר"]
      }
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
    "hebrew_alternates": [
      {
        "text": "מחר בבוקר בוא נסגור את הפרטים בשיחה קצרה.",
        "text_niqqud": "מָחָר בַּבֹּקֶר בּוֹא נִסְגֹּר אֶת הַפְּרָטִים בְּשִׂיחָה קְצָרָה.",
        "tokens": ["מחר", "בבוקר", "בוא", "נסגור", "את", "הפרטים", "בשיחה", "קצרה"],
        "tokens_niqqud": ["מָחָר", "בַּבֹּקֶר", "בּוֹא", "נִסְגֹּר", "אֶת", "הַפְּרָטִים", "בְּשִׂיחָה", "קְצָרָה"]
      }
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
      "מחר",
      "להעביר",
      "הסיכום",
      "תחילת",
      "השבוע"
    ],
    "hebrew_distractors_niqqud": [
      "מָחָר",
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
    "hebrew_alternates": [
      {
        "text": "הישיבה נדחתה, בהמשך אעדכן אותך לגבי מועד חדש.",
        "text_niqqud": "הַיְּשִׁיבָה נִדְחֲתָה, בַּהֶמְשֵׁךְ אֲעַדְכֵּן אוֹתְךָ לְגַבֵּי מוֹעֵד חָדָשׁ.",
        "tokens": ["הישיבה", "נדחתה", "בהמשך", "אעדכן", "אותך", "לגבי", "מועד", "חדש"],
        "tokens_niqqud": ["הַיְּשִׁיבָה", "נִדְחֲתָה", "בַּהֶמְשֵׁךְ", "אֲעַדְכֵּן", "אוֹתְךָ", "לְגַבֵּי", "מוֹעֵד", "חָדָשׁ"]
      }
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
    "hebrew_alternates": [
      {
        "text": "אני מעדיפה לסגור את זה בכתב כדי שיהיה תיעוד.",
        "text_niqqud": "אֲנִי מַעֲדִיפָה לִסְגֹּר אֶת זֶה בִּכְתָב כְּדֵי שֶׁיִּהְיֶה תִּעוּד.",
        "tokens": [
          "אני",
          "מעדיפה",
          "לסגור",
          "את",
          "זה",
          "בכתב",
          "כדי",
          "שיהיה",
          "תיעוד"
        ],
        "tokens_niqqud": [
          "אֲנִי",
          "מַעֲדִיפָה",
          "לִסְגֹּר",
          "אֶת",
          "זֶה",
          "בִּכְתָב",
          "כְּדֵי",
          "שֶׁיִּהְיֶה",
          "תִּעוּד"
        ]
      }
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
    "hebrew_alternates": [
      {
        "text": "השפעת הגורם הזה על התוצאה שנויה עדיין במחלוקת.",
        "text_niqqud": "הַשְׁפָּעַת הַגּוֹרֵם הַזֶּה עַל הַתּוֹצָאָה שְׁנוּיָה עֲדַיִן בְּמַחְלֹקֶת.",
        "tokens": ["השפעת", "הגורם", "הזה", "על", "התוצאה", "שנויה", "עדיין", "במחלוקת"],
        "tokens_niqqud": ["הַשְׁפָּעַת", "הַגּוֹרֵם", "הַזֶּה", "עַל", "הַתּוֹצָאָה", "שְׁנוּיָה", "עֲדַיִן", "בְּמַחְלֹקֶת"]
      }
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
    englishAlternates: [
      {
        text: "Findings should not be generalized from this sample to the entire population.",
        tokens: ["Findings", "should not be generalized", "from this sample", "to", "the entire population"],
      },
      {
        text: "Conclusions from this sample should not be generalized to the entire population.",
        tokens: ["Conclusions", "from this sample", "should not be generalized", "to", "the entire population"],
      },
      {
        text: "Conclusions should not be generalized from this sample to the entire population.",
        tokens: ["Conclusions", "should not be generalized", "from this sample", "to", "the entire population"],
      },
    ],
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
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["אתמול", "אֶתְמוֹל"], ["לרוץ", "לָרוּץ"], ["ולאכול", "וְלֶאֱכֹל"], ["קפה", "קָפֶה"]],
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
    hebrewDistractorPairs: [["קר", "קַר"], ["מחר", "מָחָר"], ["מטרייה", "מִטְרִיָּה"], ["ומעיל", "וּמְעִיל"], ["קפה", "קָפֶה"]],
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
    hebrewDistractorPairs: [["המסיבה", "הַמְּסִבָּה"], ["נורא", "נוֹרָא"], ["מחר", "מָחָר"], ["בשבת", "בְּשַׁבָּת"], ["נפרדים", "נִפְרָדִים"]],
    englishDistractors: ["The party", "terribly", "we're breaking up", "on Saturday", "never"],
    notes: "הלך מעולה — 'it went great'; נורא (terribly) is the opposite. נפגשים is masculine/mixed plural; נפגשות is the feminine-plural gender swap."
  }),
  buildExpandedSentence({
    id: "colloquial_58", emoji: "😂", category: "colloquial", difficulty: 1,
    hebrew: "סתם צחקתי, אל תיקחי את זה ללב.", hebrewNiqqud: "סְתָם צָחַקְתִּי, אַל תִּקְּחִי אֶת זֶה לַלֵּב.",
    english: "I was just kidding, don't take it to heart.",
    hebrewTokenPairs: [["סתם", "סְתָם"], ["צחקתי", "צָחַקְתִּי"], ["אל", "אַל"], ["תיקחי", "תִּקְּחִי"], ["את", "אֶת"], ["זה", "זֶה"], ["ללב", "לַלֵּב"]],
    englishTokens: ["I was", "just", "kidding", "don't take", "it", "to heart"],
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["בכיתי", "בָּכִיתִי"], ["ברצינות", "בִּרְצִינוּת"], ["תמיד", "תָּמִיד"], ["עליי", "עָלַי"]],
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
    hebrewAlternates: [
      {
        text: "וואי, שכחתי מיום ההולדת שלה לגמרי.",
        textNiqqud: "וַאי, שָׁכַחְתִּי מִיּוֹם הַהֻלֶּדֶת שֶׁלָּהּ לְגַמְרֵי.",
        tokenPairs: [["וואי", "וַאי"], ["שכחתי", "שָׁכַחְתִּי"], ["מיום ההולדת", "מִיּוֹם הַהֻלֶּדֶת"], ["שלה", "שֶׁלָּהּ"], ["לגמרי", "לְגַמְרֵי"]],
      },
    ],
    notes: "לגמרי = 'totally/completely' and is a flexible modifier: fronting it after the verb is the more idiomatic order, but trailing it at the end of the clause is also correct, so both are accepted. יום ההולדת (birthday) stays a compound chip; יום השנה (anniversary) matches its shape. שלה vs שלו is the her/his trap."
  }),
  buildExpandedSentence({
    id: "colloquial_63", emoji: "🏃", category: "colloquial", difficulty: 1,
    hebrew: "כולם כבר בדרך, איפה אתם?", hebrewNiqqud: "כֻּלָּם כְּבָר בַּדֶּרֶךְ, אֵיפֹה אַתֶּם?",
    english: "Everyone's already on the way, where are you?",
    hebrewTokenPairs: [["כולם", "כֻּלָּם"], ["כבר", "כְּבָר"], ["בדרך", "בַּדֶּרֶךְ"], ["איפה", "אֵיפֹה"], ["אתם", "אַתֶּם"]],
    englishTokens: ["Everyone's", "already", "on the way", "where are", "you"],
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["אף אחד", "אַף אֶחָד"], ["בבית", "בַּבַּיִת"], ["עדיין", "עֲדַיִן"], ["אנחנו", "אֲנַחְנוּ"]],
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
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["אתמול", "אֶתְמוֹל"], ["במסעדה", "בְּמִסְעָדָה"], ["מול", "מוּל"], ["הפארק", "הַפַּארְק"]],
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
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["יש", "יֵשׁ"], ["אופניים", "אוֹפַנַּיִם"], ["להוריד", "לְהוֹרִיד"], ["אותה", "אוֹתָהּ"]],
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
    hebrewAlternates: [
      {
        text: "חפרת לי על הדיאטה החדשה שלך שעה.",
        textNiqqud: "חָפַרְתָּ לִי עַל הַדִּיאֵטָה הַחֲדָשָׁה שֶׁלְּךָ שָׁעָה.",
        tokenPairs: [["חפרת", "חָפַרְתָּ"], ["לי", "לִי"], ["על", "עַל"], ["הדיאטה", "הַדִּיאֵטָה"], ["החדשה", "הַחֲדָשָׁה"], ["שלך", "שֶׁלְּךָ"], ["שעה", "שָׁעָה"]],
      },
    ],
    notes: "לחפור — literally 'to dig' — is slang for talking someone's ear off. סיפרת (you told) is the neutral verb it replaces. The duration שעה may sit right after the verb phrase or trail at the end of the clause; both orders are accepted."
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
    hebrewAlternates: [{
      text: "התקציב לרבעון הבא לא אושר עדיין.", textNiqqud: "הַתַּקְצִיב לָרִבְעוֹן הַבָּא לֹא אֻשַּׁר עֲדַיִן.",
      tokenPairs: [["התקציב", "הַתַּקְצִיב"], ["לרבעון", "לָרִבְעוֹן"], ["הבא", "הַבָּא"], ["לא", "לֹא"], ["אושר", "אֻשַּׁר"], ["עדיין", "עֲדַיִן"]]
    }],
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
    hebrewAlternates: [
      {
        text: "אם לא נקבל היום אישור, נדחה את הפרסום לשבוע הבא.", textNiqqud: "אִם לֹא נְקַבֵּל הַיּוֹם אִשּׁוּר, נִדְחֶה אֶת הַפִּרְסוּם לַשָּׁבוּעַ הַבָּא.",
        tokenPairs: [["אם", "אִם"], ["לא", "לֹא"], ["נקבל", "נְקַבֵּל"], ["היום", "הַיּוֹם"], ["אישור", "אִשּׁוּר"], ["נדחה", "נִדְחֶה"], ["את", "אֶת"], ["הפרסום", "הַפִּרְסוּם"], ["לשבוע", "לַשָּׁבוּעַ"], ["הבא", "הַבָּא"]]
      },
      {
        text: "אם היום לא נקבל אישור, נדחה את הפרסום לשבוע הבא.", textNiqqud: "אִם הַיּוֹם לֹא נְקַבֵּל אִשּׁוּר, נִדְחֶה אֶת הַפִּרְסוּם לַשָּׁבוּעַ הַבָּא.",
        tokenPairs: [["אם", "אִם"], ["היום", "הַיּוֹם"], ["לא", "לֹא"], ["נקבל", "נְקַבֵּל"], ["אישור", "אִשּׁוּר"], ["נדחה", "נִדְחֶה"], ["את", "אֶת"], ["הפרסום", "הַפִּרְסוּם"], ["לשבוע", "לַשָּׁבוּעַ"], ["הבא", "הַבָּא"]]
      }
    ],
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
addReorderedHebrewAlternate("everyday_85", "השיעור מתחיל בדיוק בשמונה וחצי.", "הַשִּׁעוּר מַתְחִיל בְּדִיּוּק בִּשְׁמוֹנֶה וָחֵצִי.", [0, 1, 4, 2, 3]);

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
    notes: "Rising intonation turns יש כאן אינטרנט into a yes/no question — no question word needed. הסיסמה = the password.",
    hebrewAlternates: [{
      text: "יש אינטרנט כאן? מה הסיסמה?", textNiqqud: "יֵשׁ אִינְטֶרְנֶט כָּאן? מָה הַסִּסְמָה?",
      tokenPairs: [["יש", "יֵשׁ"], ["אינטרנט", "אִינְטֶרְנֶט"], ["כאן", "כָּאן"], ["מה", "מָה"], ["הסיסמה", "הַסִּסְמָה"]]
    }]
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
    }, {
      text: "לא התראינו מזמן, מת לראות אותך!", textNiqqud: "לֹא הִתְרָאִינוּ מִזְּמַן, מֵת לִרְאוֹת אוֹתְךָ!",
      tokenPairs: [["לא", "לֹא"], ["התראינו", "הִתְרָאִינוּ"], ["מזמן", "מִזְּמַן"], ["מת", "מֵת"], ["לראות", "לִרְאוֹת"], ["אותך", "אוֹתְךָ"]]
    }, {
      text: "לא התראינו מזמן, מתה לראות אותך!", textNiqqud: "לֹא הִתְרָאִינוּ מִזְּמַן, מֵתָה לִרְאוֹת אוֹתְךָ!",
      tokenPairs: [["לא", "לֹא"], ["התראינו", "הִתְרָאִינוּ"], ["מזמן", "מִזְּמַן"], ["מתה", "מֵתָה"], ["לראות", "לִרְאוֹת"], ["אותך", "אוֹתְךָ"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_86", emoji: "🍺", category: "colloquial", difficulty: 2,
    hebrew: "אם אתה כבר בא, תביא משהו לשתות.", hebrewNiqqud: "אִם אַתָּה כְּבָר בָּא, תָּבִיא מַשֶּׁהוּ לִשְׁתּוֹת.",
    english: "If you're coming anyway, bring something to drink.",
    hebrewTokenPairs: [["אם", "אִם"], ["אתה", "אַתָּה"], ["כבר", "כְּבָר"], ["בא", "בָּא"], ["תביא", "תָּבִיא"], ["משהו", "מַשֶּׁהוּ"], ["לשתות", "לִשְׁתּוֹת"]],
    englishTokens: ["If", "you're", "coming", "anyway", "bring", "something", "to drink"],
    hebrewDistractorPairs: [["אתמול", "אֶתְמוֹל"], ["תמיד", "תָּמִיד"], ["תקנה", "תִּקְנֶה"], ["לאכול", "לֶאֱכֹל"], ["מחר", "מָחָר"]],
    englishDistractors: ["she's coming", "buy", "to eat", "tomorrow", "If not"],
    notes: "אם אתה כבר בא — כבר here means 'anyway / already on your way'. תביא = future as imperative. To a woman: אם את כבר באה, תביאי."
  }),
  buildExpandedSentence({
    id: "colloquial_87", emoji: "😏", category: "colloquial", difficulty: 1,
    hebrew: "אתה עובד עליי? ברצינות?", hebrewNiqqud: "אַתָּה עוֹבֵד עָלַי? בִּרְצִינוּת?",
    english: "Are you messing with me? Seriously?",
    hebrewTokenPairs: [["אתה", "אַתָּה"], ["עובד", "עוֹבֵד"], ["עליי", "עָלַי"], ["ברצינות", "בִּרְצִינוּת"]],
    englishTokens: ["Are you", "messing", "with me", "Seriously"],
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["צוחק", "צוֹחֵק"], ["עלינו", "עָלֵינוּ"], ["בצחוק", "בִּצְחוֹק"]],
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
  // Round-3 tranche 2: opinions & news, narrative sequencing, conditionals & numbers.
  buildExpandedSentence({
    id: "professional_55", emoji: "🗣️", category: "professional", difficulty: 2,
    hebrew: "לדעתי המצב מסובך יותר ממה שהוא נראה.", hebrewNiqqud: "לְדַעְתִּי הַמַּצָּב מְסֻבָּךְ יוֹתֵר מִמָּה שֶׁהוּא נִרְאֶה.",
    english: "In my opinion the situation is more complicated than it seems.",
    hebrewTokenPairs: [["לדעתי", "לְדַעְתִּי"], ["המצב", "הַמַּצָּב"], ["מסובך", "מְסֻבָּךְ"], ["יותר", "יוֹתֵר"], ["ממה שהוא", "מִמָּה שֶׁהוּא"], ["נראה", "נִרְאֶה"]],
    englishTokens: ["In my opinion", "the situation", "is more complicated", "than", "it seems"],
    hebrewDistractorPairs: [["לדעתה", "לְדַעְתָּהּ"], ["הפתרון", "הַפִּתְרוֹן"], ["פשוט", "פָּשׁוּט"], ["פחות", "פָּחוֹת"], ["ממה שהיא", "מִמָּה שֶׁהִיא"]],
    englishDistractors: ["In her opinion", "the solution", "is simpler", "less", "she seems"],
    notes: "לדעתי = in my opinion (דעה = opinion). יותר ממה ש… = 'more than what…' — the standard comparative over a clause."
  }),
  buildExpandedSentence({
    id: "professional_56", emoji: "⚖️", category: "professional", difficulty: 2,
    hebrew: "אני מסכים איתך, אבל חשוב לשמוע גם את הצד השני.", hebrewNiqqud: "אֲנִי מַסְכִּים אִתְּךָ, אֲבָל חָשׁוּב לִשְׁמֹעַ גַּם אֶת הַצַּד הַשֵּׁנִי.",
    english: "I agree with you, but it's important to also hear the other side.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["מסכים", "מַסְכִּים"], ["איתך", "אִתְּךָ"], ["אבל", "אֲבָל"], ["חשוב", "חָשׁוּב"], ["לשמוע", "לִשְׁמֹעַ"], ["גם", "גַּם"], ["את", "אֶת"], ["הצד השני", "הַצַּד הַשֵּׁנִי"]],
    englishTokens: ["I agree", "with you", "but", "it's important", "to also hear", "the other side"],
    hebrewDistractorPairs: [["מסכימה", "מַסְכִּימָה"], ["איתו", "אִתּוֹ"], ["קל", "קַל"], ["להגיד", "לְהַגִּיד"], ["הדעה השנייה", "הַדֵּעָה הַשְּׁנִיָּה"]],
    englishDistractors: ["she agrees", "with him", "it's easy", "to also say", "the second opinion"],
    notes: "מסכים עם = agree with. חשוב + infinitive is the impersonal 'it's important to…'. הצד השני = the other side.",
    hebrewAlternates: [{
      text: "אני מסכימה איתך, אבל חשוב לשמוע גם את הצד השני.", textNiqqud: "אֲנִי מַסְכִּימָה אִתְּךָ, אֲבָל חָשׁוּב לִשְׁמֹעַ גַּם אֶת הַצַּד הַשֵּׁנִי.",
      tokenPairs: [["אני", "אֲנִי"], ["מסכימה", "מַסְכִּימָה"], ["איתך", "אִתְּךָ"], ["אבל", "אֲבָל"], ["חשוב", "חָשׁוּב"], ["לשמוע", "לִשְׁמֹעַ"], ["גם", "גַּם"], ["את", "אֶת"], ["הצד השני", "הַצַּד הַשֵּׁנִי"]]
    }]
  }),
  buildExpandedSentence({
    id: "professional_57", emoji: "📊", category: "professional", difficulty: 3,
    hebrew: "לפי הדוח, המחירים עלו בעשרה אחוזים השנה.", hebrewNiqqud: "לְפִי הַדּוֹחַ, הַמְּחִירִים עָלוּ בַּעֲשָׂרָה אֲחוּזִים הַשָּׁנָה.",
    english: "According to the report, prices rose by ten percent this year.",
    hebrewTokenPairs: [["לפי", "לְפִי"], ["הדוח", "הַדּוֹחַ"], ["המחירים", "הַמְּחִירִים"], ["עלו", "עָלוּ"], ["בעשרה", "בַּעֲשָׂרָה"], ["אחוזים", "אֲחוּזִים"], ["השנה", "הַשָּׁנָה"]],
    englishTokens: ["According to", "the report", "prices", "rose", "by ten", "percent", "this year"],
    hebrewDistractorPairs: [["למרות", "לַמְרוֹת"], ["הסקר", "הַסֶּקֶר"], ["ירדו", "יָרְדוּ"], ["בחמישה", "בַּחֲמִשָּׁה"], ["החודש", "הַחֹדֶשׁ"]],
    englishDistractors: ["Despite", "the survey", "fell", "by five", "this month"],
    hebrewAlternates: [
      {
        text: "לפי הדוח, השנה המחירים עלו בעשרה אחוזים.", textNiqqud: "לְפִי הַדּוֹחַ, הַשָּׁנָה הַמְּחִירִים עָלוּ בַּעֲשָׂרָה אֲחוּזִים.",
        tokenPairs: [["לפי", "לְפִי"], ["הדוח", "הַדּוֹחַ"], ["השנה", "הַשָּׁנָה"], ["המחירים", "הַמְּחִירִים"], ["עלו", "עָלוּ"], ["בעשרה", "בַּעֲשָׂרָה"], ["אחוזים", "אֲחוּזִים"]]
      },
      {
        text: "לפי הדוח, המחירים השנה עלו בעשרה אחוזים.", textNiqqud: "לְפִי הַדּוֹחַ, הַמְּחִירִים הַשָּׁנָה עָלוּ בַּעֲשָׂרָה אֲחוּזִים.",
        tokenPairs: [["לפי", "לְפִי"], ["הדוח", "הַדּוֹחַ"], ["המחירים", "הַמְּחִירִים"], ["השנה", "הַשָּׁנָה"], ["עלו", "עָלוּ"], ["בעשרה", "בַּעֲשָׂרָה"], ["אחוזים", "אֲחוּזִים"]]
      }
    ],
    notes: "לפי = according to. עלו ב… — rose BY; the ב marks the amount of change. עשרה אחוזים = ten percent (אחוז is masculine, so עשרה)."
  }),
  buildExpandedSentence({
    id: "professional_58", emoji: "🤝", category: "professional", difficulty: 3,
    hebrew: "מצד אחד זה יקר, מצד שני זה חוסך לנו זמן.", hebrewNiqqud: "מִצַּד אֶחָד זֶה יָקָר, מִצַּד שֵׁנִי זֶה חוֹסֵךְ לָנוּ זְמַן.",
    english: "On the one hand it's expensive; on the other hand it saves us time.",
    hebrewTokenPairs: [["מצד אחד", "מִצַּד אֶחָד"], ["זה", "זֶה"], ["יקר", "יָקָר"], ["מצד שני", "מִצַּד שֵׁנִי"], ["זה", "זֶה"], ["חוסך", "חוֹסֵךְ"], ["לנו", "לָנוּ"], ["זמן", "זְמַן"]],
    englishTokens: ["On the one hand", "it's expensive", "on the other hand", "it saves", "us", "time"],
    hebrewDistractorPairs: [["זול", "זוֹל"], ["מבזבז", "מְבַזְבֵּז"], ["לכם", "לָכֶם"], ["כסף", "כֶּסֶף"], ["בסופו של דבר", "בְּסוֹפוֹ שֶׁל דָּבָר"]],
    englishDistractors: ["it's cheap", "it wastes", "for them", "money", "at the end of the day"],
    notes: "מצד אחד… מצד שני… — 'on the one hand… on the other…'; the paired discourse frame. חוסך = saves (time or money)."
  }),
  buildExpandedSentence({
    id: "professional_59", emoji: "🧑‍⚖️", category: "professional", difficulty: 3,
    hebrew: "רוב הציבור מתנגד להחלטה החדשה.", hebrewNiqqud: "רֹב הַצִּבּוּר מִתְנַגֵּד לַהַחְלָטָה הַחֲדָשָׁה.",
    english: "Most of the public opposes the new decision.",
    hebrewTokenPairs: [["רוב", "רֹב"], ["הציבור", "הַצִּבּוּר"], ["מתנגד", "מִתְנַגֵּד"], ["להחלטה", "לַהַחְלָטָה"], ["החדשה", "הַחֲדָשָׁה"]],
    englishTokens: ["Most of", "the public", "opposes", "the new", "decision"],
    hebrewDistractorPairs: [["חצי", "חֲצִי"], ["הממשלה", "הַמֶּמְשָׁלָה"], ["תומך", "תּוֹמֵךְ"], ["לתוכנית", "לַתָּכְנִית"], ["הישנה", "הַיְשָׁנָה"]],
    englishDistractors: ["Half of", "the government", "supports", "the old", "plan"],
    notes: "רוב ה… = most of the…. מתנגד ל = opposes (התנגד takes ל). Singular מתנגד agrees with the collective רוב."
  }),
  buildExpandedSentence({
    id: "professional_60", emoji: "🕐", category: "professional", difficulty: 2,
    hebrew: "הישיבה התארכה, אז נעדכן אתכם במייל.", hebrewNiqqud: "הַיְשִׁיבָה הִתְאָרְכָה, אָז נְעַדְכֵּן אֶתְכֶם בַּמֵּייל.",
    english: "The meeting ran long, so we'll update you by email.",
    hebrewTokenPairs: [["הישיבה", "הַיְשִׁיבָה"], ["התארכה", "הִתְאָרְכָה"], ["אז", "אָז"], ["נעדכן", "נְעַדְכֵּן"], ["אתכם", "אֶתְכֶם"], ["במייל", "בַּמֵּייל"]],
    englishTokens: ["The meeting", "ran long", "so", "we'll update", "you", "by email"],
    hebrewDistractorPairs: [["ההרצאה", "הַהַרְצָאָה"], ["התקצרה", "הִתְקַצְּרָה"], ["נשלח", "נִשְׁלַח"], ["אותם", "אוֹתָם"], ["בטלפון", "בַּטֵּלֶפוֹן"]],
    englishDistractors: ["The lecture", "ended early", "we'll call", "them", "by phone"],
    notes: "התארכה — hitpa'el, 'ran long / stretched out'. נעדכן = we'll update (לעדכן); עדכון is the noun 'update'."
  }),
  buildExpandedSentence({
    id: "professional_61", emoji: "🎤", category: "professional", difficulty: 3,
    hebrew: "העיתונאית שאלה אם השר מתכוון להתפטר.", hebrewNiqqud: "הָעִתּוֹנָאִית שָׁאֲלָה אִם הַשַּׂר מִתְכַּוֵּן לְהִתְפַּטֵּר.",
    english: "The journalist asked whether the minister intends to resign.",
    hebrewTokenPairs: [["העיתונאית", "הָעִתּוֹנָאִית"], ["שאלה", "שָׁאֲלָה"], ["אם", "אִם"], ["השר", "הַשַּׂר"], ["מתכוון", "מִתְכַּוֵּן"], ["להתפטר", "לְהִתְפַּטֵּר"]],
    englishTokens: ["The journalist", "asked", "whether", "the minister", "intends", "to resign"],
    hebrewDistractorPairs: [["העיתונאי", "הָעִתּוֹנַאי"], ["ענתה", "עָנְתָה"], ["למה", "לָמָּה"], ["ראש העיר", "רֹאשׁ הָעִיר"], ["מסרב", "מְסָרֵב"]],
    englishDistractors: ["answered", "why", "the mayor", "refuses", "The editor"],
    notes: "שאלה אם — 'asked whether'; indirect yes/no questions use אם. מתכוון ל = intends to. להתפטר = to resign (hitpa'el)."
  }),
  buildExpandedSentence({
    id: "professional_62", emoji: "🧮", category: "professional", difficulty: 3,
    hebrew: "נצטרך לבדוק את הנתונים לפני שנסיק מסקנות.", hebrewNiqqud: "נִצְטָרֵךְ לִבְדֹּק אֶת הַנְּתוּנִים לִפְנֵי שֶׁנַּסִּיק מַסְקָנוֹת.",
    english: "We'll need to check the data before we draw conclusions.",
    hebrewTokenPairs: [["נצטרך", "נִצְטָרֵךְ"], ["לבדוק", "לִבְדֹּק"], ["את", "אֶת"], ["הנתונים", "הַנְּתוּנִים"], ["לפני שנסיק", "לִפְנֵי שֶׁנַּסִּיק"], ["מסקנות", "מַסְקָנוֹת"]],
    englishTokens: ["We'll need", "to check", "the data", "before we draw", "conclusions"],
    hebrewDistractorPairs: [["נרצה", "נִרְצֶה"], ["למחוק", "לִמְחֹק"], ["התוצאות", "הַתּוֹצָאוֹת"], ["אחרי שנסיק", "אַחֲרֵי שֶׁנַּסִּיק"], ["שאלות", "שְׁאֵלוֹת"]],
    englishDistractors: ["We'll want", "to delete", "the results", "after we draw", "questions"],
    notes: "נצטרך = we'll need (future of להצטרך). להסיק מסקנות = to draw conclusions — a fixed collocation. לפני ש + future for 'before we…'."
  }),
  buildExpandedSentence({
    id: "professional_63", emoji: "💰", category: "professional", difficulty: 3,
    hebrew: "ההנהלה הודיעה שהתקציב יקוצץ בשנה הבאה.", hebrewNiqqud: "הַהַנְהָלָה הוֹדִיעָה שֶׁהַתַּקְצִיב יְקֻצַּץ בַּשָּׁנָה הַבָּאָה.",
    english: "Management announced that the budget would be cut next year.",
    hebrewTokenPairs: [["ההנהלה", "הַהַנְהָלָה"], ["הודיעה", "הוֹדִיעָה"], ["שהתקציב", "שֶׁהַתַּקְצִיב"], ["יקוצץ", "יְקֻצַּץ"], ["בשנה הבאה", "בַּשָּׁנָה הַבָּאָה"]],
    englishTokens: ["Management", "announced", "that the budget", "would be cut", "next year"],
    hebrewDistractorPairs: [["הוועדה", "הַוַּעֲדָה"], ["הכחישה", "הִכְחִישָׁה"], ["שהשכר", "שֶׁהַשָּׂכָר"], ["יוגדל", "יֻגְדַּל"], ["בשנה שעברה", "בַּשָּׁנָה שֶׁעָבְרָה"]],
    englishDistractors: ["The committee", "denied", "that the salary", "would be increased", "last year"],
    notes: "Indirect speech keeps the original future: הודיעה ש…יקוצץ = 'announced that it WILL be cut', rendered in English as 'would'. יקוצץ is a pu'al future passive."
  }),
  buildExpandedSentence({
    id: "professional_64", emoji: "🥊", category: "professional", difficulty: 3,
    hebrew: "ההצעה שלך מעניינת, אבל אני רואה את זה אחרת.", hebrewNiqqud: "הַהַצָּעָה שֶׁלְּךָ מְעַנְיֶנֶת, אֲבָל אֲנִי רוֹאֶה אֶת זֶה אַחֶרֶת.",
    english: "Your proposal is interesting, but I see it differently.",
    hebrewTokenPairs: [["ההצעה שלך", "הַהַצָּעָה שֶׁלְּךָ"], ["מעניינת", "מְעַנְיֶנֶת"], ["אבל", "אֲבָל"], ["אני", "אֲנִי"], ["רואה", "רוֹאֶה"], ["את זה", "אֶת זֶה"], ["אחרת", "אַחֶרֶת"]],
    englishTokens: ["Your proposal", "is interesting", "but", "I see it", "differently"],
    hebrewDistractorPairs: [["ההצעה שלה", "הַהַצָּעָה שֶׁלָּהּ"], ["משעממת", "מְשַׁעֲמֶמֶת"], ["ולכן", "וְלָכֵן"], ["מבין", "מֵבִין"], ["בדיוק ככה", "בְּדִיּוּק כָּכָה"]],
    englishDistractors: ["Her proposal", "is boring", "and therefore", "I understand it", "exactly that way"],
    notes: "רואה את זה אחרת — 'sees it differently'; the polite Israeli disagreement formula. מעניינת agrees with the feminine הצעה."
  }),
  buildExpandedSentence({
    id: "professional_65", emoji: "🧭", category: "professional", difficulty: 2,
    hebrew: "בוא נחזור לנושא, אנחנו קצת מתפזרים.", hebrewNiqqud: "בּוֹא נַחֲזֹר לַנּוֹשֵׂא, אֲנַחְנוּ קְצָת מִתְפַּזְּרִים.",
    english: "Let's get back to the topic; we're getting a bit scattered.",
    hebrewTokenPairs: [["בוא", "בּוֹא"], ["נחזור", "נַחֲזֹר"], ["לנושא", "לַנּוֹשֵׂא"], ["אנחנו", "אֲנַחְנוּ"], ["קצת", "קְצָת"], ["מתפזרים", "מִתְפַּזְּרִים"]],
    englishTokens: ["Let's", "get back", "to the topic", "we're getting", "a bit", "scattered"],
    hebrewDistractorPairs: [["מחר", "מָחָר"], ["נעבור", "נַעֲבֹר"], ["להפסקה", "לַהַפְסָקָה"], ["מאוד", "מְאֹד"], ["מתקדמים", "מִתְקַדְּמִים"]],
    englishDistractors: ["we'll move", "to a break", "very", "making progress", "Let's not"],
    notes: "נחזור לנושא = back to the topic. מתפזרים — lit. 'scattering' — describes a discussion drifting. קצת softens it."
  }),
  buildExpandedSentence({
    id: "formal_49", emoji: "🏛️", category: "formal", difficulty: 3,
    hebrew: "הוחלט לדחות את ההצבעה לשבוע הבא.", hebrewNiqqud: "הֻחְלַט לִדְחוֹת אֶת הַהַצְבָּעָה לַשָּׁבוּעַ הַבָּא.",
    english: "It was decided to postpone the vote until next week.",
    hebrewTokenPairs: [["הוחלט", "הֻחְלַט"], ["לדחות", "לִדְחוֹת"], ["את", "אֶת"], ["ההצבעה", "הַהַצְבָּעָה"], ["לשבוע הבא", "לַשָּׁבוּעַ הַבָּא"]],
    englishTokens: ["It was decided", "to postpone", "the vote", "until next week"],
    hebrewDistractorPairs: [["הוצע", "הֻצַּע"], ["לקיים", "לְקַיֵּם"], ["הפגישה", "הַפְּגִישָׁה"], ["לחודש הבא", "לַחֹדֶשׁ הַבָּא"], ["סוכם", "סֻכַּם"]],
    englishDistractors: ["It was proposed", "to hold", "the meeting", "until next month", "It was agreed"],
    notes: "הוחלט — impersonal huf'al passive: 'it was decided', no stated subject; the backbone of Hebrew news style. הצבעה = vote."
  }),
  buildExpandedSentence({
    id: "formal_50", emoji: "📺", category: "formal", difficulty: 3,
    hebrew: "הריאיון שודר אמש בשידור חי.", hebrewNiqqud: "הָרֵאָיוֹן שֻׁדַּר אֶמֶשׁ בְּשִׁדּוּר חַי.",
    english: "The interview was broadcast live last night.",
    hebrewTokenPairs: [["הריאיון", "הָרֵאָיוֹן"], ["שודר", "שֻׁדַּר"], ["אמש", "אֶמֶשׁ"], ["בשידור חי", "בְּשִׁדּוּר חַי"]],
    englishTokens: ["The interview", "was broadcast", "live", "last night"],
    hebrewDistractorPairs: [["הנאום", "הַנְּאוּם"], ["הוקלט", "הֻקְלַט"], ["הבוקר", "הַבֹּקֶר"], ["בערוץ אחר", "בְּעָרוּץ אַחֵר"]],
    englishDistractors: ["The speech", "was recorded", "this morning", "on another channel"],
    notes: "שודר — pu'al passive, 'was broadcast'. אמש = last night (formal; colloquial אתמול בלילה). בשידור חי = live, lit. 'in live broadcast'."
  }),
  buildExpandedSentence({
    id: "formal_51", emoji: "📰", category: "formal", difficulty: 3,
    hebrew: "על פי הפרסומים, ההסכם ייחתם בקרוב.", hebrewNiqqud: "עַל פִּי הַפִּרְסוּמִים, הַהֶסְכֵּם יֵחָתֵם בְּקָרוֹב.",
    english: "According to the reports, the agreement will be signed soon.",
    hebrewTokenPairs: [["על פי", "עַל פִּי"], ["הפרסומים", "הַפִּרְסוּמִים"], ["ההסכם", "הַהֶסְכֵּם"], ["ייחתם", "יֵחָתֵם"], ["בקרוב", "בְּקָרוֹב"]],
    englishTokens: ["According to", "the reports", "the agreement", "will be signed", "soon"],
    hebrewDistractorPairs: [["למרות", "לַמְרוֹת"], ["השמועות", "הַשְּׁמוּעוֹת"], ["החוזה", "הַחוֹזֶה"], ["יבוטל", "יְבֻטַּל"], ["בעוד שנה", "בְּעוֹד שָׁנָה"]],
    englishDistractors: ["Despite", "the rumors", "the contract", "will be canceled", "in a year"],
    hebrewAlternates: [{
      text: "על פי הפרסומים, בקרוב ייחתם ההסכם.", textNiqqud: "עַל פִּי הַפִּרְסוּמִים, בְּקָרוֹב יֵחָתֵם הַהֶסְכֵּם.",
      tokenPairs: [["על פי", "עַל פִּי"], ["הפרסומים", "הַפִּרְסוּמִים"], ["בקרוב", "בְּקָרוֹב"], ["ייחתם", "יֵחָתֵם"], ["ההסכם", "הַהֶסְכֵּם"]]
    }],
    notes: "ייחתם — nif'al future passive, 'will be signed'. על פי = according to (higher register than לפי). בקרוב = soon."
  }),
  buildExpandedSentence({
    id: "formal_52", emoji: "🗳️", category: "formal", difficulty: 3,
    hebrew: "קשה לדעת מה יקרה בבחירות הקרובות.", hebrewNiqqud: "קָשֶׁה לָדַעַת מָה יִקְרֶה בַּבְּחִירוֹת הַקְּרוֹבוֹת.",
    english: "It's hard to know what will happen in the upcoming elections.",
    hebrewTokenPairs: [["קשה", "קָשֶׁה"], ["לדעת", "לָדַעַת"], ["מה", "מָה"], ["יקרה", "יִקְרֶה"], ["בבחירות", "בַּבְּחִירוֹת"], ["הקרובות", "הַקְּרוֹבוֹת"]],
    englishTokens: ["It's hard", "to know", "what will happen", "in the upcoming", "elections"],
    hebrewDistractorPairs: [["קל", "קַל"], ["לנחש", "לְנַחֵשׁ"], ["מה קרה", "מָה קָרָה"], ["בפגישות", "בַּפְּגִישׁוֹת"], ["הבאות", "הַבָּאוֹת"]],
    englishDistractors: ["It's easy", "to guess", "what happened", "in the next", "meetings"],
    notes: "קשה + infinitive — impersonal 'it's hard to…'. מה יקרה = an embedded question ('what will happen'). הקרובות agrees with plural בחירות."
  }),
  buildExpandedSentence({
    id: "formal_53", emoji: "📉", category: "formal", difficulty: 3,
    hebrew: "פורסם כי שיעור האבטלה ירד ברבעון האחרון.", hebrewNiqqud: "פֻּרְסַם כִּי שִׁעוּר הָאַבְטָלָה יָרַד בָּרִבְעוֹן הָאַחֲרוֹן.",
    english: "It was published that the unemployment rate fell in the last quarter.",
    hebrewTokenPairs: [["פורסם", "פֻּרְסַם"], ["כי", "כִּי"], ["שיעור האבטלה", "שִׁעוּר הָאַבְטָלָה"], ["ירד", "יָרַד"], ["ברבעון", "בָּרִבְעוֹן"], ["האחרון", "הָאַחֲרוֹן"]],
    englishTokens: ["It was published", "that", "the unemployment rate", "fell", "in the last", "quarter"],
    hebrewDistractorPairs: [["נמסר", "נִמְסַר"], ["שיעור הצמיחה", "שִׁעוּר הַצְּמִיחָה"], ["עלה", "עָלָה"], ["בחודש", "בַּחֹדֶשׁ"], ["הראשון", "הָרִאשׁוֹן"]],
    englishDistractors: ["It was reported", "the growth rate", "rose", "in the first", "month"],
    notes: "פורסם כי — 'it was published that'; כי replaces ש in formal register. שיעור האבטלה = the unemployment rate (a construct chain)."
  }),
  buildExpandedSentence({
    id: "formal_54", emoji: "🔍", category: "formal", difficulty: 3,
    hebrew: "הנושא ייבחן מחדש לאחר קבלת הממצאים.", hebrewNiqqud: "הַנּוֹשֵׂא יִבָּחֵן מֵחָדָשׁ לְאַחַר קַבָּלַת הַמִּמְצָאִים.",
    english: "The issue will be re-examined after the findings are received.",
    hebrewTokenPairs: [["הנושא", "הַנּוֹשֵׂא"], ["ייבחן", "יִבָּחֵן"], ["מחדש", "מֵחָדָשׁ"], ["לאחר", "לְאַחַר"], ["קבלת", "קַבָּלַת"], ["הממצאים", "הַמִּמְצָאִים"]],
    englishTokens: ["The issue", "will be re-examined", "after", "the findings", "are received"],
    hebrewDistractorPairs: [["ההסכם", "הַהֶסְכֵּם"], ["יידחה", "יִדָּחֶה"], ["לפני", "לִפְנֵי"], ["המסמכים", "הַמִּסְמָכִים"], ["שליחת", "שְׁלִיחַת"]],
    englishDistractors: ["The agreement", "will be postponed", "before", "the documents", "are sent"],
    notes: "ייבחן מחדש — nif'al future passive + מחדש ('anew') = will be re-examined. לאחר קבלת… — formal 'after receipt of…' with the verbal noun in construct."
  }),
  buildExpandedSentence({
    id: "formal_55", emoji: "🌡️", category: "formal", difficulty: 2,
    hebrew: "על פי התחזית, צפוי גל חום בסוף השבוע.", hebrewNiqqud: "עַל פִּי הַתַּחֲזִית, צָפוּי גַּל חֹם בְּסוֹף הַשָּׁבוּעַ.",
    english: "According to the forecast, a heat wave is expected over the weekend.",
    hebrewTokenPairs: [["על פי", "עַל פִּי"], ["התחזית", "הַתַּחֲזִית"], ["צפוי", "צָפוּי"], ["גל חום", "גַּל חֹם"], ["בסוף השבוע", "בְּסוֹף הַשָּׁבוּעַ"]],
    englishTokens: ["According to", "the forecast", "a heat wave", "is expected", "over the weekend"],
    hebrewDistractorPairs: [["גל קור", "גַּל קֹר"], ["ייתכן", "יִתָּכֵן"], ["באמצע השבוע", "בְּאֶמְצַע הַשָּׁבוּעַ"], ["למרות", "לַמְרוֹת"]],
    englishDistractors: ["a cold snap", "is possible", "midweek", "Despite", "the report"],
    notes: "צפוי = is expected (passive participle); weather Hebrew loves it. גל חום = heat wave; גל קור is the cold-snap twin. סוף השבוע = the weekend."
  }),
  buildExpandedSentence({
    id: "formal_56", emoji: "🎓", category: "formal", difficulty: 2,
    hebrew: "ההרשמה לקורס תיסגר בסוף החודש.", hebrewNiqqud: "הַהַרְשָׁמָה לַקּוּרְס תִּסָּגֵר בְּסוֹף הַחֹדֶשׁ.",
    english: "Registration for the course will close at the end of the month.",
    hebrewTokenPairs: [["ההרשמה", "הַהַרְשָׁמָה"], ["לקורס", "לַקּוּרְס"], ["תיסגר", "תִּסָּגֵר"], ["בסוף", "בְּסוֹף"], ["החודש", "הַחֹדֶשׁ"]],
    englishTokens: ["Registration", "for the course", "will close", "at the end", "of the month"],
    hebrewDistractorPairs: [["הבחינה", "הַבְּחִינָה"], ["לסמסטר", "לַסֵּמֶסְטֶר"], ["תיפתח", "תִּפָּתַח"], ["בתחילת", "בִּתְחִלַּת"], ["השבוע", "הַשָּׁבוּעַ"]],
    englishDistractors: ["The exam", "for the semester", "will open", "at the beginning", "of the week"],
    notes: "תיסגר — nif'al future, 'will close'; processes like registration take the passive voice. הרשמה = registration (from נרשם)."
  }),
  buildExpandedSentence({
    id: "formal_57", emoji: "🚱", category: "formal", difficulty: 2,
    hebrew: "אין לשתות את המים האלה לפני הרתחה.", hebrewNiqqud: "אֵין לִשְׁתּוֹת אֶת הַמַּיִם הָאֵלֶּה לִפְנֵי הַרְתָּחָה.",
    english: "Do not drink this water before boiling.",
    hebrewTokenPairs: [["אין", "אֵין"], ["לשתות", "לִשְׁתּוֹת"], ["את", "אֶת"], ["המים האלה", "הַמַּיִם הָאֵלֶּה"], ["לפני", "לִפְנֵי"], ["הרתחה", "הַרְתָּחָה"]],
    englishTokens: ["Do not drink", "this water", "before", "boiling"],
    hebrewDistractorPairs: [["אפשר", "אֶפְשָׁר"], ["לאכול", "לֶאֱכֹל"], ["הפירות האלה", "הַפֵּרוֹת הָאֵלֶּה"], ["אחרי", "אַחֲרֵי"], ["שטיפה", "שְׁטִיפָה"]],
    englishDistractors: ["You may eat", "these fruits", "after", "washing", "Do not buy"],
    notes: "אין + infinitive — formal prohibition: 'one must not…'. הרתחה = boiling (the hif'il verbal noun of להרתיח)."
  }),
  buildExpandedSentence({
    id: "formal_58", emoji: "🕯️", category: "formal", difficulty: 3,
    hebrew: "אלמלא הפקקים, היינו מגיעים בזמן.", hebrewNiqqud: "אִלְמָלֵא הַפְּקָקִים, הָיִינוּ מַגִּיעִים בַּזְּמַן.",
    english: "Were it not for the traffic jams, we would have arrived on time.",
    hebrewTokenPairs: [["אלמלא", "אִלְמָלֵא"], ["הפקקים", "הַפְּקָקִים"], ["היינו", "הָיִינוּ"], ["מגיעים", "מַגִּיעִים"], ["בזמן", "בַּזְּמַן"]],
    englishTokens: ["Were it not", "for the traffic jams", "we would have", "arrived", "on time"],
    hebrewDistractorPairs: [["בגלל", "בִּגְלַל"], ["הגשם", "הַגֶּשֶׁם"], ["היית", "הָיִיתָ"], ["מאחרים", "מְאַחֲרִים"], ["באיחור", "בְּאִחוּר"]],
    englishDistractors: ["Because of", "the rain", "you would have", "been late", "this morning"],
    notes: "אלמלא = 'were it not for' — the formal counterfactual. היינו + present participle (היינו מגיעים) is the standard 'would have' construction."
  }),
  buildExpandedSentence({
    id: "formal_59", emoji: "🚀", category: "formal", difficulty: 3,
    hebrew: "אם יאושר התקציב, הפרויקט יצא לדרך מיד.", hebrewNiqqud: "אִם יְאֻשַּׁר הַתַּקְצִיב, הַפְּרוֹיֶקְט יֵצֵא לַדֶּרֶךְ מִיָּד.",
    english: "If the budget is approved, the project will get under way immediately.",
    hebrewTokenPairs: [["אם", "אִם"], ["יאושר", "יְאֻשַּׁר"], ["התקציב", "הַתַּקְצִיב"], ["הפרויקט", "הַפְּרוֹיֶקְט"], ["יצא לדרך", "יֵצֵא לַדֶּרֶךְ"], ["מיד", "מִיָּד"]],
    englishTokens: ["If", "the budget", "is approved", "the project", "will get under way", "immediately"],
    hebrewDistractorPairs: [["יבוטל", "יְבֻטַּל"], ["ההסכם", "הַהֶסְכֵּם"], ["ייעצר", "יֵעָצֵר"], ["בהמשך", "בַּהֶמְשֵׁךְ"], ["יעלה לדיון", "יַעֲלֶה לְדִיּוּן"]],
    englishDistractors: ["is canceled", "the agreement", "will be stopped", "later on", "will come up for discussion"],
    hebrewAlternates: [{
      text: "אם יאושר התקציב, הפרויקט מיד יצא לדרך.", textNiqqud: "אִם יְאֻשַּׁר הַתַּקְצִיב, הַפְּרוֹיֶקְט מִיָּד יֵצֵא לַדֶּרֶךְ.",
      tokenPairs: [["אם", "אִם"], ["יאושר", "יְאֻשַּׁר"], ["התקציב", "הַתַּקְצִיב"], ["הפרויקט", "הַפְּרוֹיֶקְט"], ["מיד", "מִיָּד"], ["יצא לדרך", "יֵצֵא לַדֶּרֶךְ"]]
    }],
    notes: "אם + future in both clauses = the real conditional. יאושר — pu'al future passive, 'will be approved'. יצא לדרך — lit. 'set out on the road' = get under way / launch."
  }),
  buildExpandedSentence({
    id: "formal_60", emoji: "🌍", category: "formal", difficulty: 3,
    hebrew: "ככל שהטמפרטורות עולות, כך גובר הסיכון לשרפות.", hebrewNiqqud: "כְּכָל שֶׁהַטֶּמְפֵּרָטוּרוֹת עוֹלוֹת, כָּךְ גּוֹבֵר הַסִּכּוּן לִשְׂרֵפוֹת.",
    english: "The more temperatures rise, the greater the risk of fires.",
    hebrewTokenPairs: [["ככל", "כְּכָל"], ["שהטמפרטורות", "שֶׁהַטֶּמְפֵּרָטוּרוֹת"], ["עולות", "עוֹלוֹת"], ["כך", "כָּךְ"], ["גובר", "גּוֹבֵר"], ["הסיכון", "הַסִּכּוּן"], ["לשרפות", "לִשְׂרֵפוֹת"]],
    englishTokens: ["The more", "temperatures", "rise", "the greater", "the risk", "of fires"],
    hebrewDistractorPairs: [["שהמחירים", "שֶׁהַמְּחִירִים"], ["יורדות", "יוֹרְדוֹת"], ["פוחת", "פּוֹחֵת"], ["הסיכוי", "הַסִּכּוּי"], ["לשיטפונות", "לְשִׁטְפוֹנוֹת"]],
    englishDistractors: ["prices", "fall", "the smaller", "the chance", "of floods"],
    notes: "ככל ש… כך… = 'the more… the more…'. גובר = grows stronger (formal). סיכון (risk) vs סיכוי (chance) is a classic trap."
  }),
  buildExpandedSentence({
    id: "everyday_100", emoji: "🚶", category: "everyday", difficulty: 1,
    hebrew: "קודם אכלנו, ואחר כך יצאנו לטייל.", hebrewNiqqud: "קֹדֶם אָכַלְנוּ, וְאַחַר כָּךְ יָצָאנוּ לְטַיֵּל.",
    english: "First we ate, and afterwards we went out for a walk.",
    hebrewTokenPairs: [["קודם", "קֹדֶם"], ["אכלנו", "אָכַלְנוּ"], ["ואחר כך", "וְאַחַר כָּךְ"], ["יצאנו", "יָצָאנוּ"], ["לטייל", "לְטַיֵּל"]],
    englishTokens: ["First", "we ate", "and afterwards", "we went out", "for a walk"],
    hebrewDistractorPairs: [["אתמול", "אֶתְמוֹל"], ["בישלנו", "בִּשַּׁלְנוּ"], ["ולפני כן", "וְלִפְנֵי כֵן"], ["נשארנו", "נִשְׁאַרְנוּ"], ["לרוץ", "לָרוּץ"]],
    englishDistractors: ["Yesterday", "we cooked", "and before that", "we stayed", "for a run"],
    notes: "קודם… ואחר כך… — 'first… and afterwards…', the basic narrative sequencers. יצאנו לטייל = went out for a walk."
  }),
  buildExpandedSentence({
    id: "everyday_101", emoji: "🍳", category: "everyday", difficulty: 2,
    hebrew: "בזמן שבישלתי, היא ערכה את השולחן.", hebrewNiqqud: "בִּזְמַן שֶׁבִּשַּׁלְתִּי, הִיא עָרְכָה אֶת הַשֻּׁלְחָן.",
    english: "While I was cooking, she set the table.",
    hebrewTokenPairs: [["בזמן", "בִּזְמַן"], ["שבישלתי", "שֶׁבִּשַּׁלְתִּי"], ["היא", "הִיא"], ["ערכה", "עָרְכָה"], ["את", "אֶת"], ["השולחן", "הַשֻּׁלְחָן"]],
    englishTokens: ["While", "I was cooking", "she", "set", "the table"],
    hebrewDistractorPairs: [["אחרי", "אַחֲרֵי"], ["שניקיתי", "שֶׁנִּקִּיתִי"], ["הוא", "הוּא"], ["ערך", "עָרַךְ"], ["המיטה", "הַמִּטָּה"]],
    englishDistractors: ["After", "I was cleaning", "he", "made", "the bed"],
    notes: "בזמן ש = while. לערוך את השולחן = to set the table. ערכה agrees with היא; masculine ערך is the swap."
  }),
  buildExpandedSentence({
    id: "everyday_102", emoji: "🔑", category: "everyday", difficulty: 2,
    hebrew: "כשהגעתי הביתה, קלטתי שאיבדתי את המפתחות.", hebrewNiqqud: "כְּשֶׁהִגַּעְתִּי הַבַּיְתָה, קָלַטְתִּי שֶׁאִבַּדְתִּי אֶת הַמַּפְתְּחוֹת.",
    english: "When I got home, I realized I'd lost the keys.",
    hebrewTokenPairs: [["כשהגעתי", "כְּשֶׁהִגַּעְתִּי"], ["הביתה", "הַבַּיְתָה"], ["קלטתי", "קָלַטְתִּי"], ["שאיבדתי", "שֶׁאִבַּדְתִּי"], ["את", "אֶת"], ["המפתחות", "הַמַּפְתְּחוֹת"]],
    englishTokens: ["When I got", "home", "I realized", "I'd lost", "the keys"],
    hebrewDistractorPairs: [["כשיצאתי", "כְּשֶׁיָּצָאתִי"], ["לעבודה", "לָעֲבוֹדָה"], ["שכחתי", "שָׁכַחְתִּי"], ["שמצאתי", "שֶׁמָּצָאתִי"], ["הארנק", "הָאַרְנָק"]],
    englishDistractors: ["When I left", "for work", "I forgot", "I'd found", "the wallet"],
    notes: "קלטתי — colloquial 'I realized / it hit me' (לקלוט = to absorb). הביתה = homeward (the directional ־ה). איבדתי = I lost."
  }),
  buildExpandedSentence({
    id: "everyday_103", emoji: "⏰", category: "everyday", difficulty: 1,
    hebrew: "השיעור מתחיל בתשע ורבע בדיוק.", hebrewNiqqud: "הַשִּׁעוּר מַתְחִיל בְּתֵשַׁע וָרֶבַע בְּדִיּוּק.",
    english: "The lesson starts at a quarter past nine exactly.",
    hebrewTokenPairs: [["השיעור", "הַשִּׁעוּר"], ["מתחיל", "מַתְחִיל"], ["בתשע", "בְּתֵשַׁע"], ["ורבע", "וָרֶבַע"], ["בדיוק", "בְּדִיּוּק"]],
    englishTokens: ["The lesson", "starts", "at a quarter past nine", "exactly"],
    hebrewDistractorPairs: [["הסרט", "הַסֶּרֶט"], ["נגמר", "נִגְמָר"], ["בעשר", "בְּעֶשֶׂר"], ["וחצי", "וָחֵצִי"], ["בערך", "בְּעֵרֶךְ"]],
    englishDistractors: ["The movie", "ends", "at half past ten", "roughly", "at noon"],
    notes: "Clock time: תשע ורבע = 'nine and a quarter' (quarter past nine); עשר וחצי = half past ten. בדיוק = exactly; בערך = approximately."
  }),
  buildExpandedSentence({
    id: "everyday_104", emoji: "💵", category: "everyday", difficulty: 2,
    hebrew: "זה עולה מאתיים חמישים שקל בסך הכול.", hebrewNiqqud: "זֶה עוֹלֶה מָאתַיִם חֲמִשִּׁים שֶׁקֶל בְּסַךְ הַכֹּל.",
    english: "It costs two hundred fifty shekels in total.",
    hebrewTokenPairs: [["זה", "זֶה"], ["עולה", "עוֹלֶה"], ["מאתיים", "מָאתַיִם"], ["חמישים", "חֲמִשִּׁים"], ["שקל", "שֶׁקֶל"], ["בסך הכול", "בְּסַךְ הַכֹּל"]],
    englishTokens: ["It costs", "two hundred", "fifty", "shekels", "in total"],
    hebrewDistractorPairs: [["זאת", "זֹאת"], ["שווה", "שָׁוֶה"], ["שלוש מאות", "שְׁלֹשׁ מֵאוֹת"], ["לחודש", "לַחֹדֶשׁ"], ["אלף", "אֶלֶף"]],
    englishDistractors: ["It's worth", "three hundred", "a thousand", "per month", "half price"],
    notes: "מאתיים = two hundred (a dual!). Prices use singular שקל after numbers: חמישים שקל. בסך הכול = in total."
  }),
  buildExpandedSentence({
    id: "everyday_105", emoji: "🕰️", category: "everyday", difficulty: 2,
    hebrew: "אנחנו מחכים כבר כמעט חצי שעה.", hebrewNiqqud: "אֲנַחְנוּ מְחַכִּים כְּבָר כִּמְעַט חֲצִי שָׁעָה.",
    english: "We've already been waiting for almost half an hour.",
    hebrewTokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["מחכים", "מְחַכִּים"], ["כבר", "כְּבָר"], ["כמעט", "כִּמְעַט"], ["חצי שעה", "חֲצִי שָׁעָה"]],
    englishTokens: ["We've", "already", "been waiting", "for almost", "half an hour"],
    hebrewDistractorPairs: [["הם", "הֵם"], ["יושבים", "יוֹשְׁבִים"], ["בקושי", "בְּקֹשִׁי"], ["שעה שלמה", "שָׁעָה שְׁלֵמָה"], ["מחכות", "מְחַכּוֹת"]],
    englishDistractors: ["They've", "been sitting", "for barely", "a whole hour", "just now"],
    hebrewAlternates: [
      {
        text: "אנחנו כבר מחכים כמעט חצי שעה.", textNiqqud: "אֲנַחְנוּ כְּבָר מְחַכִּים כִּמְעַט חֲצִי שָׁעָה.",
        tokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["כבר", "כְּבָר"], ["מחכים", "מְחַכִּים"], ["כמעט", "כִּמְעַט"], ["חצי שעה", "חֲצִי שָׁעָה"]]
      },
      {
        text: "אנחנו מחכות כבר כמעט חצי שעה.", textNiqqud: "אֲנַחְנוּ מְחַכּוֹת כְּבָר כִּמְעַט חֲצִי שָׁעָה.",
        tokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["מחכות", "מְחַכּוֹת"], ["כבר", "כְּבָר"], ["כמעט", "כִּמְעַט"], ["חצי שעה", "חֲצִי שָׁעָה"]]
      },
      {
        text: "אנחנו מחכים כמעט חצי שעה כבר.", textNiqqud: "אֲנַחְנוּ מְחַכִּים כִּמְעַט חֲצִי שָׁעָה כְּבָר.",
        tokenPairs: [["אנחנו", "אֲנַחְנוּ"], ["מחכים", "מְחַכִּים"], ["כמעט", "כִּמְעַט"], ["חצי שעה", "חֲצִי שָׁעָה"], ["כבר", "כְּבָר"]]
      }
    ],
    notes: "Present tense מחכים + כבר + a duration covers the English perfect: 'have been waiting'. חצי שעה = half an hour."
  }),
  buildExpandedSentence({
    id: "everyday_106", emoji: "🔁", category: "everyday", difficulty: 3,
    hebrew: "זאת הפעם השלישית שאני מבקש ממך.", hebrewNiqqud: "זֹאת הַפַּעַם הַשְּׁלִישִׁית שֶׁאֲנִי מְבַקֵּשׁ מִמְּךָ.",
    english: "This is the third time I'm asking you.",
    hebrewTokenPairs: [["זאת", "זֹאת"], ["הפעם", "הַפַּעַם"], ["השלישית", "הַשְּׁלִישִׁית"], ["שאני", "שֶׁאֲנִי"], ["מבקש", "מְבַקֵּשׁ"], ["ממך", "מִמְּךָ"]],
    englishTokens: ["This is", "the third time", "I'm asking", "you"],
    hebrewDistractorPairs: [["זה", "זֶה"], ["הראשונה", "הָרִאשׁוֹנָה"], ["מבקשת", "מְבַקֶּשֶׁת"], ["ממנה", "מִמֶּנָּה"], ["בשבוע", "בַּשָּׁבוּעַ"]],
    englishDistractors: ["the first time", "she's asking", "her", "this week", "That was"],
    notes: "הפעם השלישית ש… — ordinal + ש clause: 'the third time that…'. פעם is feminine, so השלישית. מבקש מ = request from.",
    hebrewAlternates: [{
      text: "זאת הפעם השלישית שאני מבקשת ממך.", textNiqqud: "זֹאת הַפַּעַם הַשְּׁלִישִׁית שֶׁאֲנִי מְבַקֶּשֶׁת מִמְּךָ.",
      tokenPairs: [["זאת", "זֹאת"], ["הפעם", "הַפַּעַם"], ["השלישית", "הַשְּׁלִישִׁית"], ["שאני", "שֶׁאֲנִי"], ["מבקשת", "מְבַקֶּשֶׁת"], ["ממך", "מִמְּךָ"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_92", emoji: "⏳", category: "colloquial", difficulty: 2,
    hebrew: "הוא אמר שיגיע בשמונה, ובסוף הגיע בעשר.", hebrewNiqqud: "הוּא אָמַר שֶׁיַּגִּיעַ בִּשְׁמוֹנֶה, וּבַסּוֹף הִגִּיעַ בְּעֶשֶׂר.",
    english: "He said he'd come at eight, and in the end he came at ten.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["אמר", "אָמַר"], ["שיגיע", "שֶׁיַּגִּיעַ"], ["בשמונה", "בִּשְׁמוֹנֶה"], ["ובסוף", "וּבַסּוֹף"], ["הגיע", "הִגִּיעַ"], ["בעשר", "בְּעֶשֶׂר"]],
    englishTokens: ["He said", "he'd come", "at eight", "and in the end", "he came", "at ten"],
    hebrewDistractorPairs: [["היא", "הִיא"], ["אמרה", "אָמְרָה"], ["שתגיע", "שֶׁתַּגִּיעַ"], ["בשבע", "בְּשֶׁבַע"], ["ובהתחלה", "וּבַהַתְחָלָה"]],
    englishDistractors: ["She said", "she'd come", "at seven", "and at first", "she came"],
    notes: "אמר שיגיע — 'said he WILL come': Hebrew keeps the original future in reported speech; English shifts to 'would'. ובסוף = and in the end."
  }),
  buildExpandedSentence({
    id: "colloquial_93", emoji: "🗣️", category: "colloquial", difficulty: 2,
    hebrew: "היא שאלה אותי איפה למדתי עברית.", hebrewNiqqud: "הִיא שָׁאֲלָה אוֹתִי אֵיפֹה לָמַדְתִּי עִבְרִית.",
    english: "She asked me where I had learned Hebrew.",
    hebrewTokenPairs: [["היא", "הִיא"], ["שאלה", "שָׁאֲלָה"], ["אותי", "אוֹתִי"], ["איפה", "אֵיפֹה"], ["למדתי", "לָמַדְתִּי"], ["עברית", "עִבְרִית"]],
    englishTokens: ["She asked", "me", "where", "I had learned", "Hebrew"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["ענה", "עָנָה"], ["מתי", "מָתַי"], ["לימדתי", "לִמַּדְתִּי"], ["אנגלית", "אַנְגְּלִית"]],
    englishDistractors: ["He answered", "when", "I had taught", "English", "them"],
    notes: "An embedded WH-question: שאלה איפה למדתי — no word-order change and no tense shift in Hebrew. לימדתי (pi'el) = I taught; למדתי = I learned."
  }),
  buildExpandedSentence({
    id: "colloquial_94", emoji: "🏃", category: "colloquial", difficulty: 2,
    hebrew: "ברגע שהישיבה נגמרה, כולם ברחו הביתה.", hebrewNiqqud: "בָּרֶגַע שֶׁהַיְשִׁיבָה נִגְמְרָה, כֻּלָּם בָּרְחוּ הַבַּיְתָה.",
    english: "The moment the meeting ended, everyone bolted home.",
    hebrewTokenPairs: [["ברגע", "בָּרֶגַע"], ["שהישיבה", "שֶׁהַיְשִׁיבָה"], ["נגמרה", "נִגְמְרָה"], ["כולם", "כֻּלָּם"], ["ברחו", "בָּרְחוּ"], ["הביתה", "הַבַּיְתָה"]],
    englishTokens: ["The moment", "the meeting", "ended", "everyone", "bolted", "home"],
    hebrewDistractorPairs: [["לפני", "לִפְנֵי"], ["שההרצאה", "שֶׁהַהַרְצָאָה"], ["התחילה", "הִתְחִילָה"], ["נשארו", "נִשְׁאֲרוּ"], ["למשרד", "לַמִּשְׂרָד"]],
    englishDistractors: ["Before", "the lecture", "started", "stayed", "at the office"],
    notes: "ברגע ש = the moment that. ברחו — lit. 'fled' — playful for rushing off. הביתה = homeward."
  }),
  buildExpandedSentence({
    id: "colloquial_95", emoji: "😅", category: "colloquial", difficulty: 3,
    hebrew: "כבר עמדתי לוותר, אבל החלטתי להמשיך.", hebrewNiqqud: "כְּבָר עָמַדְתִּי לְוַתֵּר, אֲבָל הֶחְלַטְתִּי לְהַמְשִׁיךְ.",
    english: "I was already about to give up, but I decided to keep going.",
    hebrewTokenPairs: [["כבר", "כְּבָר"], ["עמדתי", "עָמַדְתִּי"], ["לוותר", "לְוַתֵּר"], ["אבל", "אֲבָל"], ["החלטתי", "הֶחְלַטְתִּי"], ["להמשיך", "לְהַמְשִׁיךְ"]],
    englishTokens: ["I was already", "about to", "give up", "but", "I decided", "to keep going"],
    hebrewDistractorPairs: [["עמדנו", "עָמַדְנוּ"], ["להתחיל", "לְהַתְחִיל"], ["ולכן", "וְלָכֵן"], ["שכחתי", "שָׁכַחְתִּי"], ["לעצור", "לַעֲצֹר"]],
    englishDistractors: ["We were", "to start", "and so", "I forgot", "to stop"],
    notes: "עמד ל + infinitive = 'was about to' — a compact, useful structure. לוותר = give up; להמשיך = continue. כבר adds 'already'."
  }),
  buildExpandedSentence({
    id: "colloquial_96", emoji: "🥶", category: "colloquial", difficulty: 1,
    hebrew: "עד שהגענו, האוכל כבר היה קר.", hebrewNiqqud: "עַד שֶׁהִגַּעְנוּ, הָאֹכֶל כְּבָר הָיָה קַר.",
    english: "By the time we arrived, the food was already cold.",
    hebrewTokenPairs: [["עד שהגענו", "עַד שֶׁהִגַּעְנוּ"], ["האוכל", "הָאֹכֶל"], ["כבר", "כְּבָר"], ["היה", "הָיָה"], ["קר", "קַר"]],
    englishTokens: ["By the time", "we arrived", "the food", "was already", "cold"],
    hebrewDistractorPairs: [["עד שיצאנו", "עַד שֶׁיָּצָאנוּ"], ["הקפה", "הַקָּפֶה"], ["חם", "חַם"], ["יהיה", "יִהְיֶה"], ["השולחן", "הַשֻּׁלְחָן"]],
    englishDistractors: ["By the time we left", "the coffee", "hot", "will be", "the table"],
    hebrewAlternates: [
      {
        text: "עד שהגענו, האוכל היה כבר קר.", textNiqqud: "עַד שֶׁהִגַּעְנוּ, הָאֹכֶל הָיָה כְּבָר קַר.",
        tokenPairs: [["עד שהגענו", "עַד שֶׁהִגַּעְנוּ"], ["האוכל", "הָאֹכֶל"], ["היה", "הָיָה"], ["כבר", "כְּבָר"], ["קר", "קַר"]]
      },
      {
        text: "עד שהגענו, האוכל היה קר כבר.", textNiqqud: "עַד שֶׁהִגַּעְנוּ, הָאֹכֶל הָיָה קַר כְּבָר.",
        tokenPairs: [["עד שהגענו", "עַד שֶׁהִגַּעְנוּ"], ["האוכל", "הָאֹכֶל"], ["היה", "הָיָה"], ["קר", "קַר"], ["כבר", "כְּבָר"]]
      }
    ],
    notes: "עד ש + past = 'by the time…'. כבר marks 'already'. Present-tense adjectives need no 'to be', but the past needs היה."
  }),
  buildExpandedSentence({
    id: "colloquial_97", emoji: "🤷", category: "colloquial", difficulty: 1,
    hebrew: "לא יודע, תלוי במזג האוויר.", hebrewNiqqud: "לֹא יוֹדֵעַ, תָּלוּי בְּמֶזֶג הָאֲוִיר.",
    english: "I don't know; it depends on the weather.",
    hebrewTokenPairs: [["לא", "לֹא"], ["יודע", "יוֹדֵעַ"], ["תלוי", "תָּלוּי"], ["במזג האוויר", "בְּמֶזֶג הָאֲוִיר"]],
    englishTokens: ["I don't know", "it depends", "on the weather"],
    hebrewDistractorPairs: [["יודעת", "יוֹדַעַת"], ["בטוח", "בָּטוּחַ"], ["במצב הרוח", "בְּמַצַּב הָרוּחַ"], ["בכסף", "בַּכֶּסֶף"]],
    englishDistractors: ["I'm not sure", "it's certain", "on the mood", "on the money"],
    notes: "Dropped pronoun: לא יודע = '(I) don't know' — very Israeli. תלוי ב = depends on. מזג האוויר = the weather (a construct).",
    hebrewAlternates: [{
      text: "לא יודעת, תלוי במזג האוויר.", textNiqqud: "לֹא יוֹדַעַת, תָּלוּי בְּמֶזֶג הָאֲוִיר.",
      tokenPairs: [["לא", "לֹא"], ["יודעת", "יוֹדַעַת"], ["תלוי", "תָּלוּי"], ["במזג האוויר", "בְּמֶזֶג הָאֲוִיר"]]
    }]
  }),
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION_ROUND3);

const SENTENCE_EXPANSION_ROUND4 = [
  buildExpandedSentence({
    id: "colloquial_98", emoji: "🙈", category: "colloquial", difficulty: 2, style: "whatsapp",
    hebrew: "ראית מה היא כתבה בקבוצה? איזה פדיחה.",
    hebrewNiqqud: "רָאִית מָה הִיא כָּתְבָה בַּקְּבוּצָה? אֵיזֶה פָּדִיחָה.",
    english: "Did you see what she wrote in the group? So embarrassing.",
    hebrewTokenPairs: [["ראית", "רָאִית"], ["מה", "מָה"], ["היא", "הִיא"], ["כתבה", "כָּתְבָה"], ["בקבוצה", "בַּקְּבוּצָה"], ["איזה", "אֵיזֶה"], ["פדיחה", "פָּדִיחָה"]],
    englishTokens: ["Did you see", "what", "she", "wrote", "in the group", "So", "embarrassing"],
    hebrewDistractorPairs: [["שמעת", "שָׁמַעְתְּ"], ["הוא", "הוּא"], ["כתב", "כָּתַב"], ["בסטורי", "בַּסְּטוֹרִי"], ["איזו", "אֵיזוֹ"]],
    englishDistractors: ["Did you hear", "he", "posted", "in the story", "How", "awkward"],
    notes: "פדיחה (from Arabic) = an embarrassing moment, a cringe. Spoken Hebrew says איזה פדיחה even though פדיחה is feminine — the normative איזו is the grammar-trap distractor. ראית here addresses a woman."
  }),
  buildExpandedSentence({
    id: "colloquial_99", emoji: "🎬", category: "colloquial", difficulty: 2,
    hebrew: "הוא חושב שהיא תחזור אליו? הוא חי בסרט.",
    hebrewNiqqud: "הוּא חוֹשֵׁב שֶׁהִיא תַּחְזֹר אֵלָיו? הוּא חַי בְּסֶרֶט.",
    english: "He thinks she'll come back to him? He's living in a movie.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["חושב", "חוֹשֵׁב"], ["שהיא", "שֶׁהִיא"], ["תחזור", "תַּחְזֹר"], ["אליו", "אֵלָיו"], ["הוא", "הוּא"], ["חי", "חַי"], ["בסרט", "בְּסֶרֶט"]],
    englishTokens: ["He", "thinks", "she'll", "come back", "to him", "He's", "living in a movie"],
    hebrewDistractorPairs: [["היא", "הִיא"], ["מאמין", "מַאֲמִין"], ["שהוא", "שֶׁהוּא"], ["תסלח", "תִּסְלַח"], ["בסרטים", "בַּסְּרָטִים"]],
    englishDistractors: ["She", "believes", "he'll", "forgive him", "to her", "dreaming out loud"],
    notes: "חי בסרט — literally 'lives in a movie' — is the slang for someone delusional; the plural חי בסרטים also exists (distractor). תחזור אליו = 'will come back to him'."
  }),
  buildExpandedSentence({
    id: "colloquial_100", emoji: "🕗", category: "colloquial", difficulty: 2, style: "whatsapp",
    hebrew: "קבענו בשמונה והוא הבריז לי ברגע האחרון.",
    hebrewNiqqud: "קָבַעְנוּ בִּשְׁמוֹנֶה וְהוּא הִבְרִיז לִי בָּרֶגַע הָאַחֲרוֹן.",
    english: "We made plans for eight and he bailed on me at the last minute.",
    hebrewTokenPairs: [["קבענו", "קָבַעְנוּ"], ["בשמונה", "בִּשְׁמוֹנֶה"], ["והוא", "וְהוּא"], ["הבריז", "הִבְרִיז"], ["לי", "לִי"], ["ברגע", "בָּרֶגַע"], ["האחרון", "הָאַחֲרוֹן"]],
    englishTokens: ["We made plans", "for eight", "and he", "bailed on me", "at the last", "minute"],
    hebrewDistractorPairs: [["ביטלנו", "בִּטַּלְנוּ"], ["בתשע", "בְּתֵשַׁע"], ["והיא", "וְהִיא"], ["הופיע", "הוֹפִיעַ"], ["בזמן", "בַּזְּמַן"]],
    englishDistractors: ["We forgot", "for nine", "and she", "showed up", "in the end", "moment"],
    notes: "הבריז (slang, from Arabic) = to bail on someone, stand them up. קבענו = 'we set (a time to meet)' — the standard verb for making plans."
  }),
  buildExpandedSentence({
    id: "colloquial_101", emoji: "🚪", category: "colloquial", difficulty: 2,
    hebrew: "הסלקטור לא הכניס אותנו, אז הלכנו לבר בפלורנטין.",
    hebrewNiqqud: "הַסֶּלֶקְטוֹר לֹא הִכְנִיס אוֹתָנוּ, אָז הָלַכְנוּ לְבָר בִּפְלוֹרֶנְטִין.",
    english: "The selector didn't let us in, so we went to a bar in Florentin.",
    hebrewTokenPairs: [["הסלקטור", "הַסֶּלֶקְטוֹר"], ["לא", "לֹא"], ["הכניס", "הִכְנִיס"], ["אותנו", "אוֹתָנוּ"], ["אז", "אָז"], ["הלכנו", "הָלַכְנוּ"], ["לבר", "לְבָר"], ["בפלורנטין", "בִּפְלוֹרֶנְטִין"]],
    englishTokens: ["The selector", "didn't", "let us in", "so", "we went", "to a bar", "in Florentin"],
    hebrewDistractorPairs: [["הברמן", "הַבַּרְמֶן"], ["הוציא", "הוֹצִיא"], ["אותם", "אוֹתָם"], ["לרחוב", "לָרְחוֹב"], ["ביפו", "בְּיָפוֹ"]],
    englishDistractors: ["The bartender", "let us through", "so that", "we drove", "to a club", "in Jaffa"],
    notes: "סלקטור — the club doorman who decides who gets in, a fixture of Tel Aviv nightlife. הכניס = 'let (someone) in', literally 'brought in'. Florentin is the south-side bar neighborhood."
  }),
  buildExpandedSentence({
    id: "colloquial_102", emoji: "🌅", category: "colloquial", difficulty: 3,
    hebrew: "הם המשיכו לאפטר וחזרו הביתה בשבע בבוקר.",
    hebrewNiqqud: "הֵם הִמְשִׁיכוּ לָאַפְטֶר וְחָזְרוּ הַבַּיְתָה בְּשֶׁבַע בַּבֹּקֶר.",
    english: "They went on to the after-party and got home at seven in the morning.",
    hebrewTokenPairs: [["הם", "הֵם"], ["המשיכו", "הִמְשִׁיכוּ"], ["לאפטר", "לָאַפְטֶר"], ["וחזרו", "וְחָזְרוּ"], ["הביתה", "הַבַּיְתָה"], ["בשבע", "בְּשֶׁבַע"], ["בבוקר", "בַּבֹּקֶר"]],
    englishTokens: ["They", "went on", "to the after-party", "and got home", "at seven", "in the morning"],
    hebrewDistractorPairs: [["הן", "הֵן"], ["הפסיקו", "הִפְסִיקוּ"], ["למועדון", "לַמּוֹעֲדוֹן"], ["ונסעו", "וְנָסְעוּ"], ["בצהריים", "בַּצָּהֳרַיִם"]],
    englishDistractors: ["We", "stayed", "at the bar", "and slept", "at noon", "until the morning"],
    notes: "אפטר (from English 'after') = the after-party that starts when the club closes — a Tel Aviv institution. המשיכו ל־ = 'continued on to'."
  }),
  buildExpandedSentence({
    id: "colloquial_103", emoji: "👀", category: "colloquial", difficulty: 2,
    hebrew: "ראיתי את האקס שלה בדייט עם מישהי חדשה בדיזנגוף.",
    hebrewNiqqud: "רָאִיתִי אֶת הָאֶקְס שֶׁלָּהּ בְּדֵייט עִם מִישֶׁהִי חֲדָשָׁה בְּדִיזֶנְגוֹף.",
    english: "I saw her ex on a date with someone new on Dizengoff.",
    hebrewTokenPairs: [["ראיתי", "רָאִיתִי"], ["את", "אֶת"], ["האקס", "הָאֶקְס"], ["שלה", "שֶׁלָּהּ"], ["בדייט", "בְּדֵייט"], ["עם", "עִם"], ["מישהי", "מִישֶׁהִי"], ["חדשה", "חֲדָשָׁה"], ["בדיזנגוף", "בְּדִיזֶנְגוֹף"]],
    englishTokens: ["I saw", "her ex", "on a date", "with someone", "new", "on Dizengoff"],
    hebrewDistractorPairs: [["שמעתי", "שָׁמַעְתִּי"], ["האקסית", "הָאֶקְסִית"], ["שלו", "שֶׁלּוֹ"], ["בפגישה", "בִּפְגִישָׁה"], ["מישהו", "מִישֶׁהוּ"], ["ברוטשילד", "בְּרוֹטְשִׁילְד"]],
    englishDistractors: ["I heard", "his ex", "at brunch", "with a friend", "on Rothschild"],
    notes: "האקס / האקסית — 'the ex' (m/f), straight from English; דייט is likewise borrowed. Dizengoff Street is prime Tel Aviv people-watching territory."
  }),
  buildExpandedSentence({
    id: "colloquial_104", emoji: "🪙", category: "colloquial", difficulty: 3,
    hebrew: "פתאום נפל לי האסימון: הם חזרו להיות זוג.",
    hebrewNiqqud: "פִּתְאוֹם נָפַל לִי הָאֲסִימוֹן: הֵם חָזְרוּ לִהְיוֹת זוּג.",
    english: "Suddenly the penny dropped for me: they're back together.",
    hebrewTokenPairs: [["פתאום", "פִּתְאוֹם"], ["נפל", "נָפַל"], ["לי", "לִי"], ["האסימון", "הָאֲסִימוֹן"], ["הם", "הֵם"], ["חזרו", "חָזְרוּ"], ["להיות", "לִהְיוֹת"], ["זוג", "זוּג"]],
    englishTokens: ["Suddenly", "the penny dropped", "for me", "they're", "back together"],
    hebrewDistractorPairs: [["לאט לאט", "לְאַט לְאַט"], ["עלה", "עָלָה"], ["לה", "לָהּ"], ["הרעיון", "הָרַעְיוֹן"], ["להיפרד", "לְהִפָּרֵד"]],
    englishDistractors: ["Finally", "the coin fell", "for us", "she's", "broken up"],
    hebrewAlternates: [{
      text: "נפל לי פתאום האסימון: הם חזרו להיות זוג.", textNiqqud: "נָפַל לִי פִּתְאוֹם הָאֲסִימוֹן: הֵם חָזְרוּ לִהְיוֹת זוּג.",
      tokenPairs: [["נפל", "נָפַל"], ["לי", "לִי"], ["פתאום", "פִּתְאוֹם"], ["האסימון", "הָאֲסִימוֹן"], ["הם", "הֵם"], ["חזרו", "חָזְרוּ"], ["להיות", "לִהְיוֹת"], ["זוג", "זוּג"]]
    }],
    notes: "נפל האסימון — literally 'the token dropped' (old payphone tokens) = the penny dropped, it finally clicked. נפל לי האסימון puts the person realizing it in לי."
  }),
  buildExpandedSentence({
    id: "colloquial_105", emoji: "💔", category: "colloquial", difficulty: 3,
    hebrew: "זה היה רק סטוץ, היא לא מחפשת קשר רציני.",
    hebrewNiqqud: "זֶה הָיָה רַק סְטוּץ, הִיא לֹא מְחַפֶּשֶׂת קֶשֶׁר רְצִינִי.",
    english: "It was just a fling, she isn't looking for anything serious.",
    hebrewTokenPairs: [["זה", "זֶה"], ["היה", "הָיָה"], ["רק", "רַק"], ["סטוץ", "סְטוּץ"], ["היא", "הִיא"], ["לא", "לֹא"], ["מחפשת", "מְחַפֶּשֶׂת"], ["קשר", "קֶשֶׁר"], ["רציני", "רְצִינִי"]],
    englishTokens: ["It", "was", "just", "a fling", "she", "isn't", "looking for", "anything serious"],
    hebrewDistractorPairs: [["זאת", "זֹאת"], ["הייתה", "הָיְתָה"], ["אהבה", "אַהֲבָה"], ["הוא", "הוּא"], ["מחפש", "מְחַפֵּשׂ"], ["רומן", "רוֹמָן"]],
    englishDistractors: ["a crush", "he", "wasn't", "looking at", "something casual"],
    notes: "סטוץ = a fling, a no-strings romance. קשר רציני = a serious relationship — the phrase every dating-app bio negotiates. רק = 'just/only'."
  }),
  buildExpandedSentence({
    id: "colloquial_106", emoji: "🗣️", category: "colloquial", difficulty: 3,
    hebrew: "כל השמועות האלה? חרטא אחד גדול, תאמיני לי.",
    hebrewNiqqud: "כָּל הַשְּׁמוּעוֹת הָאֵלֶּה? חַרְטָא אֶחָד גָּדוֹל, תַּאֲמִינִי לִי.",
    english: "All those rumors? One big pile of nonsense, believe me.",
    hebrewTokenPairs: [["כל", "כָּל"], ["השמועות", "הַשְּׁמוּעוֹת"], ["האלה", "הָאֵלֶּה"], ["חרטא", "חַרְטָא"], ["אחד", "אֶחָד"], ["גדול", "גָּדוֹל"], ["תאמיני", "תַּאֲמִינִי"], ["לי", "לִי"]],
    englishTokens: ["All", "those rumors", "One big", "pile of nonsense", "believe", "me"],
    hebrewDistractorPairs: [["רוב", "רֹב"], ["הסיפורים", "הַסִּפּוּרִים"], ["קטן", "קָטָן"], ["תאמין", "תַּאֲמִין"], ["ממני", "מִמֶּנִּי"]],
    englishDistractors: ["Some", "of the stories", "A little", "bit of gossip", "trust", "us"],
    notes: "חרטא (from Arabic) = utter nonsense, baloney. תאמיני לי addresses a woman; the masculine תאמין לי is accepted as an alternate.",
    hebrewAlternates: [{
      text: "כל השמועות האלה? חרטא אחד גדול, תאמין לי.", textNiqqud: "כָּל הַשְּׁמוּעוֹת הָאֵלֶּה? חַרְטָא אֶחָד גָּדוֹל, תַּאֲמִין לִי.",
      tokenPairs: [["כל", "כָּל"], ["השמועות", "הַשְּׁמוּעוֹת"], ["האלה", "הָאֵלֶּה"], ["חרטא", "חַרְטָא"], ["אחד", "אֶחָד"], ["גדול", "גָּדוֹל"], ["תאמין", "תַּאֲמִין"], ["לי", "לִי"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_107", emoji: "🔕", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "השתקתי את הקבוצה של הבניין עד יום ראשון.",
    hebrewNiqqud: "הִשְׁתַּקְתִּי אֶת הַקְּבוּצָה שֶׁל הַבִּנְיָן עַד יוֹם רִאשׁוֹן.",
    english: "I muted the building group until Sunday.",
    hebrewTokenPairs: [["השתקתי", "הִשְׁתַּקְתִּי"], ["את", "אֶת"], ["הקבוצה", "הַקְּבוּצָה"], ["של", "שֶׁל"], ["הבניין", "הַבִּנְיָן"], ["עד", "עַד"], ["יום ראשון", "יוֹם רִאשׁוֹן"]],
    englishTokens: ["I muted", "the building group", "until", "Sunday"],
    hebrewDistractorPairs: [["עזבתי", "עָזַבְתִּי"], ["ההודעות", "הַהוֹדָעוֹת"], ["השכנים", "הַשְּׁכֵנִים"], ["יום שישי", "יוֹם שִׁישִׁי"], ["מחר", "מָחָר"]],
    englishDistractors: ["I left", "the parents' group", "after", "Friday", "by accident"],
    notes: "השתקתי = 'I muted' — the survival move for every Israeli building's WhatsApp group (הקבוצה של הבניין). עד יום ראשון = until Sunday, the first day of the Israeli week."
  }),
  buildExpandedSentence({
    id: "colloquial_108", emoji: "✔️", category: "colloquial", difficulty: 2, style: "whatsapp",
    hebrew: "יש וי כחול כבר יומיים והוא לא עונה.",
    hebrewNiqqud: "יֵשׁ וִי כָּחֹל כְּבָר יוֹמַיִם וְהוּא לֹא עוֹנֶה.",
    english: "There's been a blue check for two days already and he isn't answering.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["וי כחול", "וִי כָּחֹל"], ["כבר", "כְּבָר"], ["יומיים", "יוֹמַיִם"], ["והוא", "וְהוּא"], ["לא", "לֹא"], ["עונה", "עוֹנֶה"]],
    englishTokens: ["There's been", "a blue check", "for two days", "already", "and he", "isn't answering"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["וי אחד", "וִי אֶחָד"], ["שבוע", "שָׁבוּעַ"], ["והיא", "וְהִיא"], ["כותבת", "כּוֹתֶבֶת"]],
    englishDistractors: ["There was", "one gray check", "for a week", "and she", "stopped typing"],
    hebrewAlternates: [{
      text: "כבר יומיים יש וי כחול והוא לא עונה.", textNiqqud: "כְּבָר יוֹמַיִם יֵשׁ וִי כָּחֹל וְהוּא לֹא עוֹנֶה.",
      tokenPairs: [["כבר", "כְּבָר"], ["יומיים", "יוֹמַיִם"], ["יש", "יֵשׁ"], ["וי כחול", "וִי כָּחֹל"], ["והוא", "וְהוּא"], ["לא", "לֹא"], ["עונה", "עוֹנֶה"]]
    }],
    notes: "וי כחול — the WhatsApp blue check. Being left on read (נקרא ולא נענה) is prime gossip material; כבר יומיים = 'two days already'."
  }),
  buildExpandedSentence({
    id: "colloquial_109", emoji: "🎙️", category: "colloquial", difficulty: 2,
    hebrew: "היא שלחה הודעה קולית של שלוש דקות, מי מקשיב לזה?",
    hebrewNiqqud: "הִיא שָׁלְחָה הוֹדָעָה קוֹלִית שֶׁל שָׁלוֹשׁ דַּקּוֹת, מִי מַקְשִׁיב לָזֶה?",
    english: "She sent a voice note three minutes long, who listens to that?",
    hebrewTokenPairs: [["היא", "הִיא"], ["שלחה", "שָׁלְחָה"], ["הודעה קולית", "הוֹדָעָה קוֹלִית"], ["של", "שֶׁל"], ["שלוש", "שָׁלוֹשׁ"], ["דקות", "דַּקּוֹת"], ["מי", "מִי"], ["מקשיב", "מַקְשִׁיב"], ["לזה", "לָזֶה"]],
    englishTokens: ["She sent", "a voice note", "three", "minutes", "long", "who", "listens", "to that"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["שלח", "שָׁלַח"], ["הודעת טקסט", "הוֹדַעַת טֶקְסְט"], ["שניות", "שְׁנִיּוֹת"], ["עונה", "עוֹנֶה"]],
    englishDistractors: ["He sent", "a text message", "seconds", "short", "nobody", "replies"],
    notes: "הודעה קולית = a voice note; the three-minute voice note is a beloved Israeli group-chat crime. מי מקשיב לזה? = 'who listens to that?' — a rhetorical eye-roll."
  }),
  buildExpandedSentence({
    id: "colloquial_110", emoji: "🔌", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "מישהו לקח לי את המטען? תחזירו, זה לא מצחיק.",
    hebrewNiqqud: "מִישֶׁהוּ לָקַח לִי אֶת הַמַּטְעֵן? תַּחְזִירוּ, זֶה לֹא מַצְחִיק.",
    english: "Did someone take my charger? Give it back, it's not funny.",
    hebrewTokenPairs: [["מישהו", "מִישֶׁהוּ"], ["לקח", "לָקַח"], ["לי", "לִי"], ["את", "אֶת"], ["המטען", "הַמַּטְעֵן"], ["תחזירו", "תַּחְזִירוּ"], ["זה", "זֶה"], ["לא", "לֹא"], ["מצחיק", "מַצְחִיק"]],
    englishTokens: ["Did someone", "take", "my charger", "Give it back", "it's", "not", "funny"],
    hebrewDistractorPairs: [["מישהי", "מִישֶׁהִי"], ["גנב", "גָּנַב"], ["הכבל", "הַכֶּבֶל"], ["תביאו", "תָּבִיאוּ"], ["מגניב", "מַגְנִיב"]],
    englishDistractors: ["Did anyone", "borrow", "my cable", "Bring it here", "so", "weird"],
    notes: "Classic roommate-group message. תחזירו is plural — you're scolding the whole group at once. לקח לי = 'took (from) me'; the לי marks the injured party."
  }),
  buildExpandedSentence({
    id: "colloquial_111", emoji: "🎒", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "שכחתי מה צריך להביא מחר לגן, מישהי זוכרת?",
    hebrewNiqqud: "שָׁכַחְתִּי מָה צָרִיךְ לְהָבִיא מָחָר לַגַּן, מִישֶׁהִי זוֹכֶרֶת?",
    english: "I forgot what we need to bring to kindergarten tomorrow, does anyone remember?",
    hebrewTokenPairs: [["שכחתי", "שָׁכַחְתִּי"], ["מה", "מָה"], ["צריך", "צָרִיךְ"], ["להביא", "לְהָבִיא"], ["מחר", "מָחָר"], ["לגן", "לַגַּן"], ["מישהי", "מִישֶׁהִי"], ["זוכרת", "זוֹכֶרֶת"]],
    englishTokens: ["I forgot", "what", "we need", "to bring", "to kindergarten", "tomorrow", "does anyone", "remember"],
    hebrewDistractorPairs: [["זכרתי", "זָכַרְתִּי"], ["למה", "לָמָּה"], ["לקנות", "לִקְנוֹת"], ["אתמול", "אֶתְמוֹל"], ["לבית הספר", "לְבֵית הַסֵּפֶר"]],
    englishDistractors: ["I remembered", "when", "we want", "to buy", "to school", "yesterday"],
    notes: "The kindergarten parents' WhatsApp group (קבוצת ההורים) runs Israeli family life. מישהי זוכרת? uses the feminine — the unspoken assumption about who answers. גן = kindergarten."
  }),
  buildExpandedSentence({
    id: "colloquial_112", emoji: "🚪", category: "colloquial", difficulty: 2, style: "whatsapp",
    hebrew: "שמתם לב שדנה עזבה את הקבוצה באמצע הוויכוח?",
    hebrewNiqqud: "שַׂמְתֶּם לֵב שֶׁדָּנָה עָזְבָה אֶת הַקְּבוּצָה בְּאֶמְצַע הַוִּכּוּחַ?",
    english: "Did you notice Dana left the group in the middle of the argument?",
    hebrewTokenPairs: [["שמתם", "שַׂמְתֶּם"], ["לב", "לֵב"], ["שדנה", "שֶׁדָּנָה"], ["עזבה", "עָזְבָה"], ["את", "אֶת"], ["הקבוצה", "הַקְּבוּצָה"], ["באמצע", "בְּאֶמְצַע"], ["הוויכוח", "הַוִּכּוּחַ"]],
    englishTokens: ["Did you notice", "Dana", "left", "the group", "in the middle", "of the argument"],
    hebrewDistractorPairs: [["שמעתם", "שְׁמַעְתֶּם"], ["שרונית", "שֶׁרוֹנִית"], ["הצטרפה", "הִצְטָרְפָה"], ["הצ'אט", "הַצַּ'אט"], ["בסוף", "בְּסוֹף"]],
    englishDistractors: ["Did you see", "Ronit", "joined", "the chat", "at the end", "of the meeting"],
    notes: "עזבה את הקבוצה — 'left the group', the nuclear option of Israeli WhatsApp drama. שמתם לב = 'did you (pl.) notice', literally 'did you put heart'."
  }),
  buildExpandedSentence({
    id: "colloquial_113", emoji: "💬", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "יש מאתיים הודעות חדשות בקבוצה, מה פספסתי?",
    hebrewNiqqud: "יֵשׁ מָאתַיִם הוֹדָעוֹת חֲדָשׁוֹת בַּקְּבוּצָה, מָה פִּסְפַסְתִּי?",
    english: "There are two hundred new messages in the group, what did I miss?",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["מאתיים", "מָאתַיִם"], ["הודעות", "הוֹדָעוֹת"], ["חדשות", "חֲדָשׁוֹת"], ["בקבוצה", "בַּקְּבוּצָה"], ["מה", "מָה"], ["פספסתי", "פִּסְפַסְתִּי"]],
    englishTokens: ["There are", "two hundred", "new messages", "in the group", "what did", "I miss"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["אלפיים", "אַלְפַּיִם"], ["תמונות", "תְּמוּנוֹת"], ["ישנות", "יְשָׁנוֹת"], ["שכחתי", "שָׁכַחְתִּי"]],
    englishDistractors: ["There were", "two thousand", "old photos", "in the story", "who did"],
    notes: "פספסתי = 'I missed (it)' — from לפספס, one of Hebrew's favorite slang verbs. Coming back to two hundred unread messages is the Israeli group-chat default."
  }),
  buildExpandedSentence({
    id: "colloquial_114", emoji: "📺", category: "colloquial", difficulty: 2,
    hebrew: "אני לא מאמינה שהוא הודח דווקא לפני הגמר.",
    hebrewNiqqud: "אֲנִי לֹא מַאֲמִינָה שֶׁהוּא הוּדַח דַּוְקָא לִפְנֵי הַגְּמָר.",
    english: "I can't believe he was eliminated right before the finale.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["לא", "לֹא"], ["מאמינה", "מַאֲמִינָה"], ["שהוא", "שֶׁהוּא"], ["הודח", "הוּדַח"], ["דווקא", "דַּוְקָא"], ["לפני", "לִפְנֵי"], ["הגמר", "הַגְּמָר"]],
    englishTokens: ["I", "can't", "believe", "he was eliminated", "right before", "the finale"],
    hebrewDistractorPairs: [["מאמין", "מַאֲמִין"], ["שהיא", "שֶׁהִיא"], ["נבחר", "נִבְחַר"], ["אחרי", "אַחֲרֵי"], ["הפרק", "הַפֶּרֶק"]],
    englishDistractors: ["We", "can't wait", "she was chosen", "right after", "the premiere"],
    notes: "הודח = 'was eliminated/voted off' — reality-TV Hebrew. דווקא adds 'of all times, right (before)'. מאמינה marks a female speaker; the masculine מאמין is accepted as an alternate.",
    hebrewAlternates: [{
      text: "אני לא מאמין שהוא הודח דווקא לפני הגמר.", textNiqqud: "אֲנִי לֹא מַאֲמִין שֶׁהוּא הוּדַח דַּוְקָא לִפְנֵי הַגְּמָר.",
      tokenPairs: [["אני", "אֲנִי"], ["לא", "לֹא"], ["מאמין", "מַאֲמִין"], ["שהוא", "שֶׁהוּא"], ["הודח", "הוּדַח"], ["דווקא", "דַּוְקָא"], ["לפני", "לִפְנֵי"], ["הגמר", "הַגְּמָר"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_115", emoji: "🤐", category: "colloquial", difficulty: 2,
    hebrew: "אל תעשה לי ספוילר, עוד לא ראיתי את הפרק האחרון!",
    hebrewNiqqud: "אַל תַּעֲשֶׂה לִי סְפּוֹיְלֶר, עוֹד לֹא רָאִיתִי אֶת הַפֶּרֶק הָאַחֲרוֹן!",
    english: "Don't give me a spoiler, I haven't seen the last episode yet!",
    hebrewTokenPairs: [["אל", "אַל"], ["תעשה", "תַּעֲשֶׂה"], ["לי", "לִי"], ["ספוילר", "סְפּוֹיְלֶר"], ["עוד לא", "עוֹד לֹא"], ["ראיתי", "רָאִיתִי"], ["את", "אֶת"], ["הפרק", "הַפֶּרֶק"], ["האחרון", "הָאַחֲרוֹן"]],
    englishTokens: ["Don't", "give me", "a spoiler", "I haven't seen", "the last", "episode", "yet"],
    hebrewDistractorPairs: [["תעשי", "תַּעֲשִׂי"], ["לנו", "לָנוּ"], ["טריילר", "טְרֵיילֶר"], ["כבר לא", "כְּבָר לֹא"], ["הסרט", "הַסֶּרֶט"]],
    englishDistractors: ["Please", "send me", "a summary", "I've watched", "the first", "season"],
    notes: "ספוילר came into Hebrew intact; אל תעשה לי ספוילר = 'don't spoil it for me' (lit. 'don't make me a spoiler'). עוד לא = 'not yet'. Feminine-addressed אל תעשי is accepted as an alternate.",
    hebrewAlternates: [{
      text: "אל תעשי לי ספוילר, עוד לא ראיתי את הפרק האחרון!", textNiqqud: "אַל תַּעֲשִׂי לִי סְפּוֹיְלֶר, עוֹד לֹא רָאִיתִי אֶת הַפֶּרֶק הָאַחֲרוֹן!",
      tokenPairs: [["אל", "אַל"], ["תעשי", "תַּעֲשִׂי"], ["לי", "לִי"], ["ספוילר", "סְפּוֹיְלֶר"], ["עוד לא", "עוֹד לֹא"], ["ראיתי", "רָאִיתִי"], ["את", "אֶת"], ["הפרק", "הַפֶּרֶק"], ["האחרון", "הָאַחֲרוֹן"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_116", emoji: "🌟", category: "colloquial", difficulty: 1,
    hebrew: "ראינו סלב מהריאליטי יושב בבית קפה ברוטשילד.",
    hebrewNiqqud: "רָאִינוּ סֶלֶבּ מֵהָרִיאָלִיטִי יוֹשֵׁב בְּבֵית קָפֶה בְּרוֹטְשִׁילְד.",
    english: "We saw a celeb from the reality show sitting at a café on Rothschild.",
    hebrewTokenPairs: [["ראינו", "רָאִינוּ"], ["סלב", "סֶלֶבּ"], ["מהריאליטי", "מֵהָרִיאָלִיטִי"], ["יושב", "יוֹשֵׁב"], ["בבית קפה", "בְּבֵית קָפֶה"], ["ברוטשילד", "בְּרוֹטְשִׁילְד"]],
    englishTokens: ["We saw", "a celeb", "from the reality show", "sitting", "at a café", "on Rothschild"],
    hebrewDistractorPairs: [["שמענו", "שָׁמַעְנוּ"], ["שופט", "שׁוֹפֵט"], ["מהחדשות", "מֵהַחֲדָשׁוֹת"], ["עומד", "עוֹמֵד"], ["על הטיילת", "עַל הַטַּיֶּלֶת"]],
    englishDistractors: ["We heard", "a judge", "from the news", "standing", "at a bar", "on Dizengoff"],
    notes: "סלב = celeb; הריאליטי = the reality show — Hebrew keeps the English words and adds ה־. Spotting reality-TV faces at Rothschild cafés is a Tel Aviv sport."
  }),
  buildExpandedSentence({
    id: "colloquial_117", emoji: "🍿", category: "colloquial", difficulty: 2,
    hebrew: "כולן באות אליי לראות את הגמר, תביאו חטיפים.",
    hebrewNiqqud: "כֻּלָּן בָּאוֹת אֵלַי לִרְאוֹת אֶת הַגְּמָר, תָּבִיאוּ חֲטִיפִים.",
    english: "Everyone's coming to my place to watch the finale, bring snacks.",
    hebrewTokenPairs: [["כולן", "כֻּלָּן"], ["באות", "בָּאוֹת"], ["אליי", "אֵלַי"], ["לראות", "לִרְאוֹת"], ["את", "אֶת"], ["הגמר", "הַגְּמָר"], ["תביאו", "תָּבִיאוּ"], ["חטיפים", "חֲטִיפִים"]],
    englishTokens: ["Everyone's", "coming", "to my place", "to watch", "the finale", "bring", "snacks"],
    hebrewDistractorPairs: [["כולם", "כֻּלָּם"], ["אליה", "אֵלֶיהָ"], ["לצלם", "לְצַלֵּם"], ["תקנו", "תִּקְנוּ"], ["מחר", "מָחָר"]],
    englishDistractors: ["Nobody's", "driving", "to her place", "to film", "the premiere", "buy"],
    notes: "כולן באות is feminine plural — a girls'-night finale party; the masculine כולם באים is accepted too. תביאו חטיפים = 'bring snacks' (plural imperative).",
    hebrewAlternates: [{
      text: "כולם באים אליי לראות את הגמר, תביאו חטיפים.", textNiqqud: "כֻּלָּם בָּאִים אֵלַי לִרְאוֹת אֶת הַגְּמָר, תָּבִיאוּ חֲטִיפִים.",
      tokenPairs: [["כולם", "כֻּלָּם"], ["באים", "בָּאִים"], ["אליי", "אֵלַי"], ["לראות", "לִרְאוֹת"], ["את", "אֶת"], ["הגמר", "הַגְּמָר"], ["תביאו", "תָּבִיאוּ"], ["חטיפים", "חֲטִיפִים"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_118", emoji: "💄", category: "colloquial", difficulty: 3,
    hebrew: "המשפיענית הזאת עושה פרסומת סמויה לכל מוצר שני.",
    hebrewNiqqud: "הַמַּשְׁפִּיעָנִית הַזֹּאת עוֹשָׂה פִּרְסֹמֶת סְמוּיָה לְכָל מוּצָר שֵׁנִי.",
    english: "That influencer does hidden advertising for every other product.",
    hebrewTokenPairs: [["המשפיענית", "הַמַּשְׁפִּיעָנִית"], ["הזאת", "הַזֹּאת"], ["עושה", "עוֹשָׂה"], ["פרסומת", "פִּרְסֹמֶת"], ["סמויה", "סְמוּיָה"], ["לכל", "לְכָל"], ["מוצר", "מוּצָר"], ["שני", "שֵׁנִי"]],
    englishTokens: ["That influencer", "does", "hidden advertising", "for every", "other", "product"],
    hebrewDistractorPairs: [["הדוגמנית", "הַדֻּגְמָנִית"], ["הזה", "הַזֶּה"], ["מקבלת", "מְקַבֶּלֶת"], ["גלויה", "גְּלוּיָה"], ["מותג", "מוּתָג"]],
    englishDistractors: ["This model", "makes", "open sponsorship", "for some", "new", "brand"],
    notes: "משפיענית = (female) influencer — Hebrew coined its own word from להשפיע, 'to influence'. פרסומת סמויה = undisclosed sponsored content, a running Israeli media scandal. כל מוצר שני = 'every other product'."
  }),
  buildExpandedSentence({
    id: "colloquial_119", emoji: "😬", category: "colloquial", difficulty: 2,
    hebrew: "הסרטון הזה קרינג' ברמות, לא הצלחתי לצפות עד הסוף.",
    hebrewNiqqud: "הַסִּרְטוֹן הַזֶּה קְרִינְג' בְּרָמוֹת, לֹא הִצְלַחְתִּי לִצְפּוֹת עַד הַסּוֹף.",
    english: "That video is next-level cringe, I couldn't watch to the end.",
    hebrewTokenPairs: [["הסרטון", "הַסִּרְטוֹן"], ["הזה", "הַזֶּה"], ["קרינג'", "קְרִינְג'"], ["ברמות", "בְּרָמוֹת"], ["לא", "לֹא"], ["הצלחתי", "הִצְלַחְתִּי"], ["לצפות", "לִצְפּוֹת"], ["עד", "עַד"], ["הסוף", "הַסּוֹף"]],
    englishTokens: ["That video", "is", "next-level", "cringe", "I couldn't", "watch", "to the end"],
    hebrewDistractorPairs: [["התמונה", "הַתְּמוּנָה"], ["הזאת", "הַזֹּאת"], ["מצחיק", "מַצְחִיק"], ["הצלחנו", "הִצְלַחְנוּ"], ["עד האמצע", "עַד הָאֶמְצַע"]],
    englishDistractors: ["That photo", "was", "kind of", "funny", "I managed", "to the middle"],
    notes: "קרינג' is borrowed wholesale; ברמות ('on levels') intensifies any adjective — קרינג' ברמות = cringe on another level. לצפות עד הסוף = to watch to the end."
  }),
  buildExpandedSentence({
    id: "colloquial_120", emoji: "🎪", category: "colloquial", difficulty: 2,
    hebrew: "יש לי פומו רציני, כל הפיד מלא בתמונות מהפסטיבל.",
    hebrewNiqqud: "יֵשׁ לִי פוֹמוֹ רְצִינִי, כָּל הַפִּיד מָלֵא בִּתְמוּנוֹת מֵהַפֶּסְטִיבָל.",
    english: "I have serious FOMO, the whole feed is full of photos from the festival.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["לי", "לִי"], ["פומו", "פוֹמוֹ"], ["רציני", "רְצִינִי"], ["כל", "כָּל"], ["הפיד", "הַפִּיד"], ["מלא", "מָלֵא"], ["בתמונות", "בִּתְמוּנוֹת"], ["מהפסטיבל", "מֵהַפֶּסְטִיבָל"]],
    englishTokens: ["I have", "serious", "FOMO", "the whole", "feed", "is full", "of photos", "from the festival"],
    hebrewDistractorPairs: [["יש לה", "יֵשׁ לָהּ"], ["קל", "קַל"], ["הסטורי", "הַסְּטוֹרִי"], ["ריק", "רֵיק"], ["בסרטונים", "בְּסִרְטוֹנִים"]],
    englishDistractors: ["She has", "mild", "jealousy", "the entire", "story", "of videos"],
    notes: "פומו (FOMO) and פיד (feed) live comfortably inside Hebrew sentences now. מלא ב־ = 'full of'. רציני after a noun = 'serious/major'."
  }),
  buildExpandedSentence({
    id: "colloquial_121", emoji: "❤️", category: "colloquial", difficulty: 1,
    hebrew: "התמונה שלה קיבלה אלף לייקים תוך שעה.",
    hebrewNiqqud: "הַתְּמוּנָה שֶׁלָּהּ קִבְּלָה אֶלֶף לַיְיקִים תּוֹךְ שָׁעָה.",
    english: "Her photo got a thousand likes within an hour.",
    hebrewTokenPairs: [["התמונה", "הַתְּמוּנָה"], ["שלה", "שֶׁלָּהּ"], ["קיבלה", "קִבְּלָה"], ["אלף", "אֶלֶף"], ["לייקים", "לַיְיקִים"], ["תוך", "תּוֹךְ"], ["שעה", "שָׁעָה"]],
    englishTokens: ["Her photo", "got", "a thousand", "likes", "within", "an hour"],
    hebrewDistractorPairs: [["הסרטון", "הַסִּרְטוֹן"], ["שלו", "שֶׁלּוֹ"], ["איבדה", "אִבְּדָה"], ["מאה", "מֵאָה"], ["עוקבים", "עוֹקְבִים"]],
    englishDistractors: ["His video", "lost", "a hundred", "followers", "after", "a day"],
    notes: "לייקים and עוקבים (followers) — one borrowed, one native — headline Israeli Instagram talk. תוך שעה = within an hour."
  }),
  buildExpandedSentence({
    id: "colloquial_122", emoji: "🎧", category: "colloquial", difficulty: 2,
    hebrew: "אני לא מבינה את ההייפ סביב הפודקאסט הזה.",
    hebrewNiqqud: "אֲנִי לֹא מְבִינָה אֶת הַהַייפּ סְבִיב הַפּוֹדְקָאסְט הַזֶּה.",
    english: "I don't get the hype around this podcast.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["לא", "לֹא"], ["מבינה", "מְבִינָה"], ["את", "אֶת"], ["ההייפ", "הַהַייפּ"], ["סביב", "סְבִיב"], ["הפודקאסט", "הַפּוֹדְקָאסְט"], ["הזה", "הַזֶּה"]],
    englishTokens: ["I", "don't", "get the hype", "around", "this podcast"],
    hebrewDistractorPairs: [["מבין", "מֵבִין"], ["שומעת", "שׁוֹמַעַת"], ["מאחורי", "מֵאֲחוֹרֵי"], ["הפלייליסט", "הַפְּלֵיילִיסְט"], ["הזאת", "הַזֹּאת"]],
    englishDistractors: ["We", "can't", "hear the buzz", "behind", "this playlist"],
    notes: "הייפ = hype, fully naturalized. סביב = 'around/surrounding'. מבינה marks a female speaker — the masculine מבין is accepted as an alternate.",
    hebrewAlternates: [{
      text: "אני לא מבין את ההייפ סביב הפודקאסט הזה.", textNiqqud: "אֲנִי לֹא מֵבִין אֶת הַהַייפּ סְבִיב הַפּוֹדְקָאסְט הַזֶּה.",
      tokenPairs: [["אני", "אֲנִי"], ["לא", "לֹא"], ["מבין", "מֵבִין"], ["את", "אֶת"], ["ההייפ", "הַהַייפּ"], ["סביב", "סְבִיב"], ["הפודקאסט", "הַפּוֹדְקָאסְט"], ["הזה", "הַזֶּה"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_123", emoji: "📱", category: "colloquial", difficulty: 2,
    hebrew: "נתקעתי שעה על רילס במקום ללכת לישון.",
    hebrewNiqqud: "נִתְקַעְתִּי שָׁעָה עַל רִילְס בִּמְקוֹם לָלֶכֶת לִישֹׁן.",
    english: "I got stuck on Reels for an hour instead of going to sleep.",
    hebrewTokenPairs: [["נתקעתי", "נִתְקַעְתִּי"], ["שעה", "שָׁעָה"], ["על", "עַל"], ["רילס", "רִילְס"], ["במקום", "בִּמְקוֹם"], ["ללכת", "לָלֶכֶת"], ["לישון", "לִישֹׁן"]],
    englishTokens: ["I got stuck", "on Reels", "for an hour", "instead of", "going", "to sleep"],
    hebrewDistractorPairs: [["ויתרתי", "וִתַּרְתִּי"], ["דקה", "דַּקָּה"], ["בגלל", "בִּגְלַל"], ["לקום", "לָקוּם"], ["מוקדם", "מֻקְדָּם"]],
    englishDistractors: ["I gave up", "on the news", "for a minute", "because of", "waking up"],
    notes: "נתקעתי = 'I got stuck' — the verb Israelis use for scroll paralysis. במקום + infinitive = 'instead of doing'. רילס needs no translation."
  }),
  buildExpandedSentence({
    id: "colloquial_124", emoji: "🎟️", category: "colloquial", difficulty: 3,
    hebrew: "הוא השיג כרטיסים להופעה בקומבינה, אל תשאלי איך.",
    hebrewNiqqud: "הוּא הִשִּׂיג כַּרְטִיסִים לַהוֹפָעָה בְּקוֹמְבִּינָה, אַל תִּשְׁאֲלִי אֵיךְ.",
    english: "He scored tickets to the show through some scheme, don't ask how.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["השיג", "הִשִּׂיג"], ["כרטיסים", "כַּרְטִיסִים"], ["להופעה", "לַהוֹפָעָה"], ["בקומבינה", "בְּקוֹמְבִּינָה"], ["אל", "אַל"], ["תשאלי", "תִּשְׁאֲלִי"], ["איך", "אֵיךְ"]],
    englishTokens: ["He scored", "tickets", "to the show", "through some scheme", "don't ask", "how"],
    hebrewDistractorPairs: [["תשאל", "תִּשְׁאַל"], ["איבד", "אִבֵּד"], ["מקומות", "מְקוֹמוֹת"], ["למשחק", "לַמִּשְׂחָק"], ["מתי", "מָתַי"]],
    englishDistractors: ["He lost", "passes", "to the game", "at full price", "don't tell", "when"],
    notes: "קומבינה — a workaround or scheme that bends the rules; getting things done בקומבינה is a national art form. אל תשאלי addresses a woman; the masculine אל תשאל is accepted.",
    hebrewAlternates: [{
      text: "הוא השיג כרטיסים להופעה בקומבינה, אל תשאל איך.", textNiqqud: "הוּא הִשִּׂיג כַּרְטִיסִים לַהוֹפָעָה בְּקוֹמְבִּינָה, אַל תִּשְׁאַל אֵיךְ.",
      tokenPairs: [["הוא", "הוּא"], ["השיג", "הִשִּׂיג"], ["כרטיסים", "כַּרְטִיסִים"], ["להופעה", "לַהוֹפָעָה"], ["בקומבינה", "בְּקוֹמְבִּינָה"], ["אל", "אַל"], ["תשאל", "תִּשְׁאַל"], ["איך", "אֵיךְ"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_125", emoji: "🏷️", category: "colloquial", difficulty: 3,
    hebrew: "שילמת מחיר מלא? יצאת פראייר, היה קוד הנחה.",
    hebrewNiqqud: "שִׁלַּמְתָּ מְחִיר מָלֵא? יָצָאתָ פְרָאיֶיר, הָיָה קוֹד הֲנָחָה.",
    english: "You paid full price? You came out a sucker, there was a discount code.",
    hebrewTokenPairs: [["שילמת", "שִׁלַּמְתָּ"], ["מחיר", "מְחִיר"], ["מלא", "מָלֵא"], ["יצאת", "יָצָאתָ"], ["פראייר", "פְרָאיֶיר"], ["היה", "הָיָה"], ["קוד", "קוֹד"], ["הנחה", "הֲנָחָה"]],
    englishTokens: ["You paid", "full price", "You came out", "a sucker", "there was", "a discount code"],
    hebrewDistractorPairs: [["ביקשת", "בִּקַּשְׁתָּ"], ["חצי", "חֲצִי"], ["גאון", "גָּאוֹן"], ["לא היה", "לֹא הָיָה"], ["מבצע", "מִבְצָע"]],
    englishDistractors: ["You asked for", "half price", "You looked like", "a genius", "there wasn't", "a secret sale"],
    notes: "פראייר — a sucker; the deepest Israeli fear is לצאת פראייר, to come out the sucker. The plain spelling שילמת reads as either gender; only the vowels change."
  }),
  buildExpandedSentence({
    id: "colloquial_126", emoji: "🍽️", category: "colloquial", difficulty: 3,
    hebrew: "היא קיבלה שולחן בלי תור כי יש לה פרוטקציה במסעדה.",
    hebrewNiqqud: "הִיא קִבְּלָה שֻׁלְחָן בְּלִי תּוֹר כִּי יֵשׁ לָהּ פְּרוֹטֶקְצְיָה בַּמִּסְעָדָה.",
    english: "She got a table without waiting because she has connections at the restaurant.",
    hebrewTokenPairs: [["היא", "הִיא"], ["קיבלה", "קִבְּלָה"], ["שולחן", "שֻׁלְחָן"], ["בלי", "בְּלִי"], ["תור", "תּוֹר"], ["כי", "כִּי"], ["יש לה", "יֵשׁ לָהּ"], ["פרוטקציה", "פְּרוֹטֶקְצְיָה"], ["במסעדה", "בַּמִּסְעָדָה"]],
    englishTokens: ["She got", "a table", "without", "waiting", "because", "she has", "connections", "at the restaurant"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["קיבל", "קִבֵּל"], ["כיסא", "כִּסֵּא"], ["עם", "עִם"], ["יש לו", "יֵשׁ לוֹ"], ["סבלנות", "סַבְלָנוּת"]],
    englishDistractors: ["He got", "a seat", "with", "a reservation", "he needs", "patience"],
    notes: "פרוטקציה = pull/connections (from Russian protektsia) — the unofficial Israeli fast lane. בלי תור = without (waiting in) line."
  }),
  buildExpandedSentence({
    id: "colloquial_127", emoji: "👏", category: "colloquial", difficulty: 2,
    hebrew: "תפרגני לה, היא עבדה על הפרויקט הזה חודשים.",
    hebrewNiqqud: "תְּפַרְגְּנִי לָהּ, הִיא עָבְדָה עַל הַפְּרוֹיֶקְט הַזֶּה חֳדָשִׁים.",
    english: "Give her some credit, she worked on that project for months.",
    hebrewTokenPairs: [["תפרגני", "תְּפַרְגְּנִי"], ["לה", "לָהּ"], ["היא", "הִיא"], ["עבדה", "עָבְדָה"], ["על", "עַל"], ["הפרויקט", "הַפְּרוֹיֶקְט"], ["הזה", "הַזֶּה"], ["חודשים", "חֳדָשִׁים"]],
    englishTokens: ["Give her some credit", "she", "worked", "on that project", "for months"],
    hebrewDistractorPairs: [["תפרגן", "תְּפַרְגֵּן"], ["לו", "לוֹ"], ["הוא", "הוּא"], ["עבד", "עָבַד"], ["שבועות", "שָׁבוּעוֹת"]],
    englishDistractors: ["Give him a break", "he", "slept", "on this idea", "for weeks"],
    notes: "לפרגן (from Yiddish farginen) = to be generous with praise, not begrudge — a word Israelis insist has no English equivalent. תפרגני addresses a woman; masculine תפרגן is accepted.",
    hebrewAlternates: [{
      text: "תפרגן לה, היא עבדה על הפרויקט הזה חודשים.", textNiqqud: "תְּפַרְגֵּן לָהּ, הִיא עָבְדָה עַל הַפְּרוֹיֶקְט הַזֶּה חֳדָשִׁים.",
      tokenPairs: [["תפרגן", "תְּפַרְגֵּן"], ["לה", "לָהּ"], ["היא", "הִיא"], ["עבדה", "עָבְדָה"], ["על", "עַל"], ["הפרויקט", "הַפְּרוֹיֶקְט"], ["הזה", "הַזֶּה"], ["חודשים", "חֳדָשִׁים"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_128", emoji: "🚈", category: "colloquial", difficulty: 2,
    hebrew: "אין חנייה בעיר? אשכרה יותר מהיר ברכבת הקלה.",
    hebrewNiqqud: "אֵין חֲנָיָה בָּעִיר? אַשְׁכָּרָה יוֹתֵר מָהִיר בָּרַכֶּבֶת הַקַּלָּה.",
    english: "No parking in the city? It's actually faster on the light rail.",
    hebrewTokenPairs: [["אין", "אֵין"], ["חנייה", "חֲנָיָה"], ["בעיר", "בָּעִיר"], ["אשכרה", "אַשְׁכָּרָה"], ["יותר", "יוֹתֵר"], ["מהיר", "מָהִיר"], ["ברכבת הקלה", "בָּרַכֶּבֶת הַקַּלָּה"]],
    englishTokens: ["No parking", "in the city", "It's actually", "faster", "on the light rail"],
    hebrewDistractorPairs: [["יש", "יֵשׁ"], ["תנועה", "תְּנוּעָה"], ["בצפון", "בַּצָּפוֹן"], ["איטי", "אִטִּי"], ["באופניים חשמליים", "בְּאוֹפַנַּיִם חַשְׁמַלִּיִּים"]],
    englishDistractors: ["No traffic", "in the north", "It's barely", "slower", "on the electric bike"],
    notes: "אשכרה (from Arabic) = 'literally/actually, no kidding'. הרכבת הקלה — Tel Aviv's long-awaited light rail. Complaining about חנייה (parking) is the city's official pastime."
  }),
  buildExpandedSentence({
    id: "colloquial_129", emoji: "🛴", category: "colloquial", difficulty: 2,
    hebrew: "עוד קורקינט כמעט דרס אותי על המדרכה בדיזנגוף.",
    hebrewNiqqud: "עוֹד קוֹרְקִינֵט כִּמְעַט דָּרַס אוֹתִי עַל הַמִּדְרָכָה בְּדִיזֶנְגוֹף.",
    english: "Another scooter almost ran me over on the sidewalk on Dizengoff.",
    hebrewTokenPairs: [["עוד", "עוֹד"], ["קורקינט", "קוֹרְקִינֵט"], ["כמעט", "כִּמְעַט"], ["דרס", "דָּרַס"], ["אותי", "אוֹתִי"], ["על", "עַל"], ["המדרכה", "הַמִּדְרָכָה"], ["בדיזנגוף", "בְּדִיזֶנְגוֹף"]],
    englishTokens: ["Another scooter", "almost", "ran me over", "on the sidewalk", "on Dizengoff"],
    hebrewDistractorPairs: [["אופניים", "אוֹפַנַּיִם"], ["בקושי", "בְּקֹשִׁי"], ["עקף", "עָקַף"], ["על הכביש", "עַל הַכְּבִישׁ"], ["באלנבי", "בְּאַלֶנְבִּי"]],
    englishDistractors: ["Another bike", "barely", "passed me", "on the road", "on Allenby"],
    notes: "קורקינט = the electric scooter, apex predator of Tel Aviv sidewalks. דרס = ran over; כמעט דרס אותי = almost flattened me. עוד here = 'yet another', the sigh built into the sentence."
  }),
  buildExpandedSentence({
    id: "colloquial_130", emoji: "🌳", category: "colloquial", difficulty: 1,
    hebrew: "שישי בפארק הירקון: פיקניק, גיטרה, וכל תל אביב שם.",
    hebrewNiqqud: "שִׁישִׁי בְּפַּארְק הַיַּרְקוֹן: פִּיקְנִיק, גִּיטָרָה, וְכָל תֵּל אָבִיב שָׁם.",
    english: "Friday at Yarkon Park: a picnic, a guitar, and all of Tel Aviv is there.",
    hebrewTokenPairs: [["שישי", "שִׁישִׁי"], ["בפארק הירקון", "בְּפַּארְק הַיַּרְקוֹן"], ["פיקניק", "פִּיקְנִיק"], ["גיטרה", "גִּיטָרָה"], ["וכל", "וְכָל"], ["תל אביב", "תֵּל אָבִיב"], ["שם", "שָׁם"]],
    englishTokens: ["Friday", "at Yarkon Park", "a picnic", "a guitar", "and all", "of Tel Aviv", "is there"],
    hebrewDistractorPairs: [["שבת", "שַׁבָּת"], ["בנמל", "בַּנָּמֵל"], ["מנגל", "מַנְגָּל"], ["רמקול", "רַמְקוֹל"], ["רמת גן", "רָמַת גַּן"]],
    englishDistractors: ["Saturday", "at the harbor", "a barbecue", "a speaker", "and half", "of Ramat Gan"],
    notes: "פארק הירקון is Tel Aviv's Central Park; on Friday afternoons the whole city migrates there. וכל תל אביב שם = 'and all of Tel Aviv is there' — barely an exaggeration."
  }),
  buildExpandedSentence({
    id: "colloquial_131", emoji: "🚗", category: "colloquial", difficulty: 3,
    hebrew: "יש מצב שאני פשוט מוכר את האוטו, נמאס לי מהחניות.",
    hebrewNiqqud: "יֵשׁ מַצָּב שֶׁאֲנִי פָּשׁוּט מוֹכֵר אֶת הָאוֹטוֹ, נִמְאַס לִי מֵהַחֲנָיוֹת.",
    english: "There's a chance I just sell the car, I'm sick of the parking.",
    hebrewTokenPairs: [["יש מצב", "יֵשׁ מַצָּב"], ["שאני", "שֶׁאֲנִי"], ["פשוט", "פָּשׁוּט"], ["מוכר", "מוֹכֵר"], ["את", "אֶת"], ["האוטו", "הָאוֹטוֹ"], ["נמאס", "נִמְאַס"], ["לי", "לִי"], ["מהחניות", "מֵהַחֲנָיוֹת"]],
    englishTokens: ["There's a chance", "I", "just", "sell the car", "I'm sick of", "the parking"],
    hebrewDistractorPairs: [["אין מצב", "אֵין מַצָּב"], ["שאת", "שֶׁאַתְּ"], ["קונה", "קוֹנֶה"], ["מוכרת", "מוֹכֶרֶת"], ["האופנוע", "הָאוֹפָנוֹעַ"], ["מהפקקים", "מֵהַפְּקָקִים"]],
    englishDistractors: ["There's no way", "we", "finally", "fix the bike", "I'm proud of", "the traffic"],
    notes: "יש מצב = 'there's a chance / could be' — the exact opposite of אין מצב (no way), which sits in the distractors. נמאס לי מ־ = 'I'm fed up with'. מוכרת is the female speaker's form, accepted as an alternate.",
    hebrewAlternates: [{
      text: "יש מצב שאני פשוט מוכרת את האוטו, נמאס לי מהחניות.", textNiqqud: "יֵשׁ מַצָּב שֶׁאֲנִי פָּשׁוּט מוֹכֶרֶת אֶת הָאוֹטוֹ, נִמְאַס לִי מֵהַחֲנָיוֹת.",
      tokenPairs: [["יש מצב", "יֵשׁ מַצָּב"], ["שאני", "שֶׁאֲנִי"], ["פשוט", "פָּשׁוּט"], ["מוכרת", "מוֹכֶרֶת"], ["את", "אֶת"], ["האוטו", "הָאוֹטוֹ"], ["נמאס", "נִמְאַס"], ["לי", "לִי"], ["מהחניות", "מֵהַחֲנָיוֹת"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_132", emoji: "🏓", category: "colloquial", difficulty: 1,
    hebrew: "אי אפשר לישון על החוף, המטקות האלה בכל מקום.",
    hebrewNiqqud: "אִי אֶפְשָׁר לִישֹׁן עַל הַחוֹף, הַמַּטְקוֹת הָאֵלֶּה בְּכָל מָקוֹם.",
    english: "It's impossible to sleep on the beach, the matkot are everywhere.",
    hebrewTokenPairs: [["אי אפשר", "אִי אֶפְשָׁר"], ["לישון", "לִישֹׁן"], ["על", "עַל"], ["החוף", "הַחוֹף"], ["המטקות", "הַמַּטְקוֹת"], ["האלה", "הָאֵלֶּה"], ["בכל", "בְּכָל"], ["מקום", "מָקוֹם"]],
    englishTokens: ["It's impossible", "to sleep", "on", "the beach", "the matkot", "are everywhere"],
    hebrewDistractorPairs: [["קל", "קַל"], ["לקרוא", "לִקְרֹא"], ["מתחת", "מִתַּחַת"], ["השמשייה", "הַשִּׁמְשִׁיָּה"], ["בשום מקום", "בְּשׁוּם מָקוֹם"]],
    englishDistractors: ["It's easy", "to read", "under", "the umbrella", "the waves", "are quiet"],
    notes: "מטקות — beach paddleball, Israel's unofficial national sport; the thwack is the soundtrack of every Tel Aviv beach. אי אפשר = 'it's impossible'."
  }),
  buildExpandedSentence({
    id: "colloquial_133", emoji: "🪼", category: "colloquial", difficulty: 2,
    hebrew: "לא נכנסים לים החודש, זאת עונת המדוזות.",
    hebrewNiqqud: "לֹא נִכְנָסִים לַיָּם הַחֹדֶשׁ, זֹאת עוֹנַת הַמֶּדוּזוֹת.",
    english: "Nobody's going in the water this month, it's jellyfish season.",
    hebrewTokenPairs: [["לא", "לֹא"], ["נכנסים", "נִכְנָסִים"], ["לים", "לַיָּם"], ["החודש", "הַחֹדֶשׁ"], ["זאת", "זֹאת"], ["עונת", "עוֹנַת"], ["המדוזות", "הַמֶּדוּזוֹת"]],
    englishTokens: ["Nobody's", "going in", "the water", "this month", "it's", "jellyfish", "season"],
    hebrewDistractorPairs: [["כולם", "כֻּלָּם"], ["יוצאים", "יוֹצְאִים"], ["מהים", "מֵהַיָּם"], ["השבוע", "הַשָּׁבוּעַ"], ["הגלים", "הַגַּלִּים"]],
    englishDistractors: ["Everyone's", "staying out of", "the sand", "this week", "surfing", "weather"],
    hebrewAlternates: [
      {
        text: "החודש לא נכנסים לים, זאת עונת המדוזות.", textNiqqud: "הַחֹדֶשׁ לֹא נִכְנָסִים לַיָּם, זֹאת עוֹנַת הַמֶּדוּזוֹת.",
        tokenPairs: [["החודש", "הַחֹדֶשׁ"], ["לא", "לֹא"], ["נכנסים", "נִכְנָסִים"], ["לים", "לַיָּם"], ["זאת", "זֹאת"], ["עונת", "עוֹנַת"], ["המדוזות", "הַמֶּדוּזוֹת"]]
      },
      {
        text: "לא נכנסים החודש לים, זאת עונת המדוזות.", textNiqqud: "לֹא נִכְנָסִים הַחֹדֶשׁ לַיָּם, זֹאת עוֹנַת הַמֶּדוּזוֹת.",
        tokenPairs: [["לא", "לֹא"], ["נכנסים", "נִכְנָסִים"], ["החודש", "הַחֹדֶשׁ"], ["לים", "לַיָּם"], ["זאת", "זֹאת"], ["עונת", "עוֹנַת"], ["המדוזות", "הַמֶּדוּזוֹת"]]
      }
    ],
    notes: "עונת המדוזות — jellyfish season, the midsummer stretch when the Mediterranean empties out. The impersonal plural לא נכנסים = 'one doesn't go in'."
  }),
  buildExpandedSentence({
    id: "colloquial_134", emoji: "🌇", category: "colloquial", difficulty: 1, style: "whatsapp",
    hebrew: "שקיעה מהממת בטיילת עכשיו, בואו מהר!",
    hebrewNiqqud: "שְׁקִיעָה מְהַמֶּמֶת בַּטַּיֶּלֶת עַכְשָׁו, בּוֹאוּ מַהֵר!",
    english: "Stunning sunset on the boardwalk right now, come quick!",
    hebrewTokenPairs: [["שקיעה", "שְׁקִיעָה"], ["מהממת", "מְהַמֶּמֶת"], ["בטיילת", "בַּטַּיֶּלֶת"], ["עכשיו", "עַכְשָׁו"], ["בואו", "בּוֹאוּ"], ["מהר", "מַהֵר"]],
    englishTokens: ["Stunning", "sunset", "on the boardwalk", "right now", "come", "quick"],
    hebrewDistractorPairs: [["זריחה", "זְרִיחָה"], ["מעוננת", "מְעֻנֶּנֶת"], ["בחוף", "בַּחוֹף"], ["הערב", "הָעֶרֶב"], ["רוצו", "רוּצוּ"]],
    englishDistractors: ["Cloudy", "sunrise", "on the beach", "tonight", "run", "slowly"],
    notes: "מהממת = stunning — the go-to superlative for Tel Aviv sunsets. הטיילת is the beachfront promenade. בואו מהר = 'come (pl.) quick', the message that empties offices at 7 pm."
  }),
  buildExpandedSentence({
    id: "colloquial_135", emoji: "🏄", category: "colloquial", difficulty: 2,
    hebrew: "הגולשים תופסים גלים בחוף גורדון מחמש בבוקר.",
    hebrewNiqqud: "הַגּוֹלְשִׁים תּוֹפְסִים גַּלִּים בְּחוֹף גּוֹרְדוֹן מֵחָמֵשׁ בַּבֹּקֶר.",
    english: "The surfers catch waves at Gordon Beach from five in the morning.",
    hebrewTokenPairs: [["הגולשים", "הַגּוֹלְשִׁים"], ["תופסים", "תּוֹפְסִים"], ["גלים", "גַּלִּים"], ["בחוף גורדון", "בְּחוֹף גּוֹרְדוֹן"], ["מחמש", "מֵחָמֵשׁ"], ["בבוקר", "בַּבֹּקֶר"]],
    englishTokens: ["The surfers", "catch", "waves", "at Gordon Beach", "from five", "in the morning"],
    hebrewDistractorPairs: [["השחיינים", "הַשַּׂחְיָנִים"], ["מפספסים", "מְפַסְפְּסִים"], ["סירות", "סִירוֹת"], ["בחוף הילטון", "בְּחוֹף הִילְטוֹן"], ["בערב", "בָּעֶרֶב"]],
    englishDistractors: ["The swimmers", "miss", "boats", "at Hilton Beach", "until six", "in the evening"],
    notes: "חוף גורדון and חוף הילטון are Tel Aviv's classic beaches — Hilton is the surfers' turf. תופסים גלים = catching waves; מחמש בבוקר = from 5 a.m."
  }),
  buildExpandedSentence({
    id: "colloquial_136", emoji: "☕", category: "colloquial", difficulty: 1,
    hebrew: "בשבילי הפוך גדול על סויה, בלי סוכר.",
    hebrewNiqqud: "בִּשְׁבִילִי הָפוּךְ גָּדוֹל עַל סוֹיָה, בְּלִי סֻכָּר.",
    english: "For me a large latte with soy, no sugar.",
    hebrewTokenPairs: [["בשבילי", "בִּשְׁבִילִי"], ["הפוך", "הָפוּךְ"], ["גדול", "גָּדוֹל"], ["על", "עַל"], ["סויה", "סוֹיָה"], ["בלי", "בְּלִי"], ["סוכר", "סֻכָּר"]],
    englishTokens: ["For me", "a large", "latte", "with", "soy", "no sugar"],
    hebrewDistractorPairs: [["בשבילה", "בִּשְׁבִילָהּ"], ["אספרסו", "אֶסְפְּרֶסוֹ"], ["קטן", "קָטָן"], ["שיבולת שועל", "שִׁבֹּלֶת שׁוּעָל"], ["עם", "עִם"]],
    englishDistractors: ["For her", "a small", "espresso", "without", "oat milk", "extra hot"],
    notes: "הפוך ('upside-down') is Israel's latte. Barista Hebrew puts the milk choice after על: הפוך על סויה = latte with soy; שיבולת שועל (oat) is the other option on every menu."
  }),
  buildExpandedSentence({
    id: "colloquial_137", emoji: "🪙", category: "colloquial", difficulty: 2,
    hebrew: "זוכרת שהכול בקופיקס עלה חמישה שקלים? תקופה יפה.",
    hebrewNiqqud: "זוֹכֶרֶת שֶׁהַכֹּל בְּקוֹפִיקְס עָלָה חֲמִשָּׁה שְׁקָלִים? תְּקוּפָה יָפָה.",
    english: "Remember when everything at Cofix cost five shekels? Good times.",
    hebrewTokenPairs: [["זוכרת", "זוֹכֶרֶת"], ["שהכול", "שֶׁהַכֹּל"], ["בקופיקס", "בְּקוֹפִיקְס"], ["עלה", "עָלָה"], ["חמישה", "חֲמִשָּׁה"], ["שקלים", "שְׁקָלִים"], ["תקופה", "תְּקוּפָה"], ["יפה", "יָפָה"]],
    englishTokens: ["Remember", "when everything", "at Cofix", "cost", "five shekels", "Good times"],
    hebrewDistractorPairs: [["זוכר", "זוֹכֵר"], ["בקיוסק", "בַּקִּיוֹסְק"], ["ירד", "יָרַד"], ["עשרה", "עֲשָׂרָה"], ["קשה", "קָשָׁה"]],
    englishDistractors: ["Forget", "when nothing", "at the kiosk", "was worth", "ten shekels", "Hard years"],
    notes: "קופיקס launched the five-shekel-everything craze in 2013; prices crept up and the nostalgia stayed. זוכרת addresses a woman (masculine זוכר accepted). תקופה יפה = 'those were the days'.",
    hebrewAlternates: [{
      text: "זוכר שהכול בקופיקס עלה חמישה שקלים? תקופה יפה.", textNiqqud: "זוֹכֵר שֶׁהַכֹּל בְּקוֹפִיקְס עָלָה חֲמִשָּׁה שְׁקָלִים? תְּקוּפָה יָפָה.",
      tokenPairs: [["זוכר", "זוֹכֵר"], ["שהכול", "שֶׁהַכֹּל"], ["בקופיקס", "בְּקוֹפִיקְס"], ["עלה", "עָלָה"], ["חמישה", "חֲמִשָּׁה"], ["שקלים", "שְׁקָלִים"], ["תקופה", "תְּקוּפָה"], ["יפה", "יָפָה"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_138", emoji: "🧆", category: "colloquial", difficulty: 2,
    hebrew: "בואי נלך לנגב חומוס ביפו לפני שייגמר.",
    hebrewNiqqud: "בּוֹאִי נֵלֵךְ לְנַגֵּב חֻמּוּס בְּיָפוֹ לִפְנֵי שֶׁיִּגָּמֵר.",
    english: "Come on, let's go wipe up hummus in Jaffa before it runs out.",
    hebrewTokenPairs: [["בואי", "בּוֹאִי"], ["נלך", "נֵלֵךְ"], ["לנגב", "לְנַגֵּב"], ["חומוס", "חֻמּוּס"], ["ביפו", "בְּיָפוֹ"], ["לפני", "לִפְנֵי"], ["שייגמר", "שֶׁיִּגָּמֵר"]],
    englishTokens: ["Come on", "let's go", "wipe up", "hummus", "in Jaffa", "before it", "runs out"],
    hebrewDistractorPairs: [["בוא", "בּוֹא"], ["נרוץ", "נָרוּץ"], ["לבשל", "לְבַשֵּׁל"], ["פלאפל", "פָלָאפֶל"], ["באבו גוש", "בְּאַבּוּ גוֹשׁ"]],
    englishDistractors: ["Come here", "let's run", "cook", "falafel", "in Abu Ghosh", "after it"],
    notes: "לנגב חומוס — literally 'to wipe hummus' — is the only correct verb for eating it with pita. Jaffa's hummus joints famously sell out by early afternoon. בואי addresses a woman; בוא (masculine) is accepted.",
    hebrewAlternates: [{
      text: "בוא נלך לנגב חומוס ביפו לפני שייגמר.", textNiqqud: "בּוֹא נֵלֵךְ לְנַגֵּב חֻמּוּס בְּיָפוֹ לִפְנֵי שֶׁיִּגָּמֵר.",
      tokenPairs: [["בוא", "בּוֹא"], ["נלך", "נֵלֵךְ"], ["לנגב", "לְנַגֵּב"], ["חומוס", "חֻמּוּס"], ["ביפו", "בְּיָפוֹ"], ["לפני", "לִפְנֵי"], ["שייגמר", "שֶׁיִּגָּמֵר"]]
    }]
  }),
  buildExpandedSentence({
    id: "colloquial_139", emoji: "🥞", category: "colloquial", difficulty: 3,
    hebrew: "חיכינו שעה לברנץ' אבל האוכל היה סוף הדרך.",
    hebrewNiqqud: "חִכִּינוּ שָׁעָה לַבְּרַנְץ' אֲבָל הָאֹכֶל הָיָה סוֹף הַדֶּרֶךְ.",
    english: "We waited an hour for brunch but the food was out of this world.",
    hebrewTokenPairs: [["חיכינו", "חִכִּינוּ"], ["שעה", "שָׁעָה"], ["לברנץ'", "לַבְּרַנְץ'"], ["אבל", "אֲבָל"], ["האוכל", "הָאֹכֶל"], ["היה", "הָיָה"], ["סוף הדרך", "סוֹף הַדֶּרֶךְ"]],
    englishTokens: ["We waited", "an hour", "for brunch", "but the food", "was", "out of this world"],
    hebrewDistractorPairs: [["נסענו", "נָסַעְנוּ"], ["לארוחת ערב", "לַאֲרוּחַת עֶרֶב"], ["התור", "הַתּוֹר"], ["היה בסדר", "הָיָה בְּסֵדֶר"], ["בקושי", "בְּקֹשִׁי"]],
    englishDistractors: ["We drove", "a while", "for dinner", "but the line", "wasn't", "worth the wait"],
    notes: "סוף הדרך — literally 'the end of the road' — means 'as good as it gets'. Waiting an hour for weekend brunch is a Tel Aviv rite; ברנץ' is the borrowed word."
  }),
  buildExpandedSentence({
    id: "everyday_107", emoji: "🚉", category: "everyday", difficulty: 1,
    hebrew: "ירדתי בתחנת השלום והלכתי ברגל לעזריאלי.",
    hebrewNiqqud: "יָרַדְתִּי בְּתַחֲנַת הַשָּׁלוֹם וְהָלַכְתִּי בָּרֶגֶל לָעַזְרִיאֵלִי.",
    english: "I got off at HaShalom station and walked to Azrieli.",
    hebrewTokenPairs: [["ירדתי", "יָרַדְתִּי"], ["בתחנת השלום", "בְּתַחֲנַת הַשָּׁלוֹם"], ["והלכתי", "וְהָלַכְתִּי"], ["ברגל", "בָּרֶגֶל"], ["לעזריאלי", "לָעַזְרִיאֵלִי"]],
    englishTokens: ["I got off", "at HaShalom station", "and walked", "to Azrieli"],
    hebrewDistractorPairs: [["עליתי", "עָלִיתִי"], ["בתחנת האוניברסיטה", "בְּתַחֲנַת הָאוּנִיבֶרְסִיטָה"], ["ונסעתי", "וְנָסַעְתִּי"], ["לשרונה", "לְשָׂרוֹנָה"], ["באוטובוס", "בָּאוֹטוֹבּוּס"]],
    englishDistractors: ["I got on", "at the University station", "and drove", "to Sarona", "by mistake"],
    notes: "תחנת השלום is the train station under the Azrieli towers — the landmark every Tel Aviv meeting is measured from. ירדתי ב־ = 'I got off at'; ברגל = on foot."
  }),
  buildExpandedSentence({
    id: "everyday_108", emoji: "🍅", category: "everyday", difficulty: 2,
    hebrew: "בשוק הכרמל הירקות טריים ובחצי מחיר מהסופר.",
    hebrewNiqqud: "בְּשׁוּק הַכַּרְמֶל הַיְּרָקוֹת טְרִיִּים וּבַחֲצִי מְחִיר מֵהַסּוּפֶּר.",
    english: "At the Carmel Market the vegetables are fresh and half the price of the supermarket.",
    hebrewTokenPairs: [["בשוק הכרמל", "בְּשׁוּק הַכַּרְמֶל"], ["הירקות", "הַיְּרָקוֹת"], ["טריים", "טְרִיִּים"], ["ובחצי", "וּבַחֲצִי"], ["מחיר", "מְחִיר"], ["מהסופר", "מֵהַסּוּפֶּר"]],
    englishTokens: ["At the Carmel Market", "the vegetables", "are fresh", "and half", "the price", "of the supermarket"],
    hebrewDistractorPairs: [["בשוק הפשפשים", "בְּשׁוּק הַפִּשְׁפְּשִׁים"], ["הפירות", "הַפֵּרוֹת"], ["יקרים", "יְקָרִים"], ["כפול", "כָּפוּל"], ["מהמכולת", "מֵהַמַּכֹּלֶת"]],
    englishDistractors: ["At the flea market", "the fruit", "expensive", "double", "of the corner store"],
    notes: "שוק הכרמל is Tel Aviv's main open-air market; שוק הפשפשים (the Jaffa flea market) is the shape-matched distractor. Comparative מ־ = 'than': בחצי מחיר מהסופר = half the supermarket's price."
  }),
  buildExpandedSentence({
    id: "everyday_109", emoji: "🚲", category: "everyday", difficulty: 2,
    hebrew: "אני עושה את כל הדרך לעבודה בשביל האופניים לאורך הירקון.",
    hebrewNiqqud: "אֲנִי עוֹשֶׂה אֶת כָּל הַדֶּרֶךְ לָעֲבוֹדָה בִּשְׁבִיל הָאוֹפַנַּיִם לְאֹרֶךְ הַיַּרְקוֹן.",
    english: "I do the whole way to work on the bike path along the Yarkon.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["עושה", "עוֹשֶׂה"], ["את", "אֶת"], ["כל", "כָּל"], ["הדרך", "הַדֶּרֶךְ"], ["לעבודה", "לָעֲבוֹדָה"], ["בשביל האופניים", "בִּשְׁבִיל הָאוֹפַנַּיִם"], ["לאורך", "לְאֹרֶךְ"], ["הירקון", "הַיַּרְקוֹן"]],
    englishTokens: ["I do", "the whole way", "to work", "on the bike path", "along", "the Yarkon"],
    hebrewDistractorPairs: [["רצה", "רָצָה"], ["חצי", "חֲצִי"], ["לחדר כושר", "לַחֲדַר כֹּשֶׁר"], ["בכביש הראשי", "בַּכְּבִישׁ הָרָאשִׁי"], ["החוף", "הַחוֹף"]],
    englishDistractors: ["I run", "half the way", "to the gym", "on the main road", "along the beach"],
    notes: "שביל אופניים = bike path; the Yarkon riverside route is Tel Aviv's cycling highway. עושה את כל הדרך = 'do the whole way' — עושה works hard in spoken Hebrew."
  }),
  buildExpandedSentence({
    id: "everyday_110", emoji: "🚋", category: "everyday", difficulty: 2,
    hebrew: "הרכבת הקלה מלאה בשמונה בבוקר, אין איפה לעמוד.",
    hebrewNiqqud: "הָרַכֶּבֶת הַקַּלָּה מְלֵאָה בִּשְׁמוֹנֶה בַּבֹּקֶר, אֵין אֵיפֹה לַעֲמֹד.",
    english: "The light rail is packed at eight in the morning, there's nowhere to stand.",
    hebrewTokenPairs: [["הרכבת הקלה", "הָרַכֶּבֶת הַקַּלָּה"], ["מלאה", "מְלֵאָה"], ["בשמונה", "בִּשְׁמוֹנֶה"], ["בבוקר", "בַּבֹּקֶר"], ["אין", "אֵין"], ["איפה", "אֵיפֹה"], ["לעמוד", "לַעֲמֹד"]],
    englishTokens: ["The light rail", "is packed", "at eight", "in the morning", "there's nowhere", "to stand"],
    hebrewDistractorPairs: [["האוטובוס האחרון", "הָאוֹטוֹבּוּס הָאַחֲרוֹן"], ["ריקה", "רֵיקָה"], ["בעשר", "בְּעֶשֶׂר"], ["בלילה", "בַּלַּיְלָה"], ["לשבת", "לָשֶׁבֶת"]],
    englishDistractors: ["The last bus", "is empty", "at ten", "at night", "there's plenty of room", "to sit"],
    notes: "אין איפה לעמוד = 'there's nowhere (even) to stand'. The light rail filled up the moment it finally opened. מלאה agrees with the feminine רכבת."
  }),
  buildExpandedSentence({
    id: "everyday_111", emoji: "🐕", category: "everyday", difficulty: 1,
    hebrew: "בשבת בבוקר כל העיר על החוף עם קפה וכלב.",
    hebrewNiqqud: "בְּשַׁבָּת בַּבֹּקֶר כָּל הָעִיר עַל הַחוֹף עִם קָפֶה וְכֶלֶב.",
    english: "On Saturday morning the whole city is at the beach with coffee and a dog.",
    hebrewTokenPairs: [["בשבת", "בְּשַׁבָּת"], ["בבוקר", "בַּבֹּקֶר"], ["כל", "כָּל"], ["העיר", "הָעִיר"], ["על", "עַל"], ["החוף", "הַחוֹף"], ["עם", "עִם"], ["קפה", "קָפֶה"], ["וכלב", "וְכֶלֶב"]],
    englishTokens: ["On Saturday", "morning", "the whole city", "is at the beach", "with coffee", "and a dog"],
    hebrewDistractorPairs: [["בשישי", "בְּשִׁישִׁי"], ["בערב", "בָּעֶרֶב"], ["חצי", "חֲצִי"], ["הרחוב", "הָרְחוֹב"], ["וחתול", "וְחָתוּל"]],
    englishDistractors: ["On Friday", "evening", "half the street", "is at the market", "with beer", "and a cat"],
    notes: "Tel Aviv's Shabbat-morning liturgy: espresso, dog, sea. The dog is practically mandatory — the city claims more dogs per capita than almost anywhere on earth."
  }),
  buildExpandedSentence({
    id: "everyday_112", emoji: "🍅", category: "everyday", difficulty: 2,
    hebrew: "שכחנו קרם הגנה ועכשיו שנינו אדומים כמו עגבנייה.",
    hebrewNiqqud: "שָׁכַחְנוּ קְרֶם הֲגָנָה וְעַכְשָׁו שְׁנֵינוּ אֲדֻמִּים כְּמוֹ עַגְבָנִיָּה.",
    english: "We forgot sunscreen and now we're both red as a tomato.",
    hebrewTokenPairs: [["שכחנו", "שָׁכַחְנוּ"], ["קרם הגנה", "קְרֶם הֲגָנָה"], ["ועכשיו", "וְעַכְשָׁו"], ["שנינו", "שְׁנֵינוּ"], ["אדומים", "אֲדֻמִּים"], ["כמו", "כְּמוֹ"], ["עגבנייה", "עַגְבָנִיָּה"]],
    englishTokens: ["We forgot", "sunscreen", "and now", "we're both", "red", "as a tomato"],
    hebrewDistractorPairs: [["הבאנו", "הֵבֵאנוּ"], ["מגבות", "מַגָּבוֹת"], ["כולם", "כֻּלָּם"], ["חיוורים", "חִוְּרִים"], ["כמו קיר", "כְּמוֹ קִיר"]],
    englishDistractors: ["We brought", "towels", "and then", "they're all", "pale", "as a wall"],
    notes: "קרם הגנה = sunscreen (lit. 'protection cream'). שנינו = 'the two of us'. The Mediterranean sun takes no prisoners — כמו עגבנייה, like a tomato."
  }),
  buildExpandedSentence({
    id: "everyday_113", emoji: "🌱", category: "everyday", difficulty: 1,
    hebrew: "חצי מהתפריט כאן טבעוני, אפילו השניצל.",
    hebrewNiqqud: "חֲצִי מֵהַתַּפְרִיט כָּאן טִבְעוֹנִי, אֲפִלּוּ הַשְּׁנִיצֶל.",
    english: "Half the menu here is vegan, even the schnitzel.",
    hebrewTokenPairs: [["חצי", "חֲצִי"], ["מהתפריט", "מֵהַתַּפְרִיט"], ["כאן", "כָּאן"], ["טבעוני", "טִבְעוֹנִי"], ["אפילו", "אֲפִלּוּ"], ["השניצל", "הַשְּׁנִיצֶל"]],
    englishTokens: ["Half", "the menu here", "is vegan", "even", "the schnitzel"],
    hebrewDistractorPairs: [["רוב", "רֹב"], ["מהקינוחים", "מֵהַקִּנּוּחִים"], ["שם", "שָׁם"], ["חריף", "חָרִיף"], ["הסלט", "הַסָּלָט"]],
    englishDistractors: ["Most of", "the desserts there", "is spicy", "especially", "the salad"],
    notes: "Tel Aviv is routinely ranked the world's most vegan-friendly city — even the שניצל, the national comfort food, has a טבעוני version. אפילו = even."
  }),
  buildExpandedSentence({
    id: "everyday_114", emoji: "🥐", category: "everyday", difficulty: 2,
    hebrew: "עמדנו ארבעים דקות בתור למאפייה החדשה בפלורנטין.",
    hebrewNiqqud: "עָמַדְנוּ אַרְבָּעִים דַּקּוֹת בַּתּוֹר לַמַּאֲפִיָּה הַחֲדָשָׁה בִּפְלוֹרֶנְטִין.",
    english: "We stood forty minutes in line for the new bakery in Florentin.",
    hebrewTokenPairs: [["עמדנו", "עָמַדְנוּ"], ["ארבעים", "אַרְבָּעִים"], ["דקות", "דַּקּוֹת"], ["בתור", "בַּתּוֹר"], ["למאפייה", "לַמַּאֲפִיָּה"], ["החדשה", "הַחֲדָשָׁה"], ["בפלורנטין", "בִּפְלוֹרֶנְטִין"]],
    englishTokens: ["We stood", "forty", "minutes", "in line", "for the new bakery", "in Florentin"],
    hebrewDistractorPairs: [["ישבנו", "יָשַׁבְנוּ"], ["עשרים", "עֶשְׂרִים"], ["בכניסה", "בַּכְּנִיסָה"], ["לבית הקפה", "לְבֵית הַקָּפֶה"], ["בנווה צדק", "בִּנְוֵה צֶדֶק"]],
    englishDistractors: ["We sat", "twenty", "hours", "at the entrance", "for the old café", "in Neve Tzedek"],
    notes: "The pastry-hype cycle — a bakery opens, Instagram erupts, the line wraps the block — is a Florentin specialty. עמדנו בתור = we stood in line."
  }),
  buildExpandedSentence({
    id: "everyday_115", emoji: "🍳", category: "everyday", difficulty: 1,
    hebrew: "אין כמו שקשוקה של יום שישי אחרי הים.",
    hebrewNiqqud: "אֵין כְּמוֹ שַׁקְשׁוּקָה שֶׁל יוֹם שִׁישִׁי אַחֲרֵי הַיָּם.",
    english: "There's nothing like a Friday shakshuka after the beach.",
    hebrewTokenPairs: [["אין", "אֵין"], ["כמו", "כְּמוֹ"], ["שקשוקה", "שַׁקְשׁוּקָה"], ["של", "שֶׁל"], ["יום שישי", "יוֹם שִׁישִׁי"], ["אחרי", "אַחֲרֵי"], ["הים", "הַיָּם"]],
    englishTokens: ["There's nothing like", "a Friday", "shakshuka", "after the beach"],
    hebrewDistractorPairs: [["יש", "יֵשׁ"], ["ג'חנון", "גַּ'חְנוּן"], ["יום שבת", "יוֹם שַׁבָּת"], ["לפני", "לִפְנֵי"], ["המקלחת", "הַמִּקְלַחַת"]],
    englishDistractors: ["There's more than", "a Saturday", "jachnun", "before the shower", "with bread"],
    notes: "אין כמו... = 'there's nothing like...'. Post-beach Friday shakshuka is a sacred sequence; ג'חנון (the distractor) is its slow-cooked Yemenite Saturday cousin. הים = the sea — in Tel Aviv, 'the beach'."
  }),
  buildExpandedSentence({
    id: "everyday_116", emoji: "🥟", category: "everyday", difficulty: 2,
    hebrew: "קניתי בורקס חם ומיץ רימונים בשוק לפני העבודה.",
    hebrewNiqqud: "קָנִיתִי בּוּרֶקָס חַם וּמִיץ רִמּוֹנִים בַּשּׁוּק לִפְנֵי הָעֲבוֹדָה.",
    english: "I bought a hot bourekas and pomegranate juice at the market before work.",
    hebrewTokenPairs: [["קניתי", "קָנִיתִי"], ["בורקס", "בּוּרֶקָס"], ["חם", "חַם"], ["ומיץ", "וּמִיץ"], ["רימונים", "רִמּוֹנִים"], ["בשוק", "בַּשּׁוּק"], ["לפני", "לִפְנֵי"], ["העבודה", "הָעֲבוֹדָה"]],
    englishTokens: ["I bought", "a hot bourekas", "and pomegranate", "juice", "at the market", "before work"],
    hebrewDistractorPairs: [["מכרתי", "מָכַרְתִּי"], ["כריך", "כָּרִיךְ"], ["קר", "קַר"], ["תפוזים", "תַּפּוּזִים"], ["בקיוסק", "בַּקִּיוֹסְק"]],
    englishDistractors: ["I sold", "a cold sandwich", "and orange", "tea", "at the kiosk", "after class"],
    notes: "בורקס — the flaky filled pastry that fuels Israeli mornings; fresh מיץ רימונים (pomegranate juice) is the shuk's other currency. לפני העבודה = before work."
  }),
  buildExpandedSentence({
    id: "everyday_117", emoji: "📈", category: "everyday", difficulty: 2,
    hebrew: "בעל הבית העלה את השכירות בעוד אלף שקל.",
    hebrewNiqqud: "בַּעַל הַבַּיִת הֶעֱלָה אֶת הַשְּׂכִירוּת בְּעוֹד אֶלֶף שֶׁקֶל.",
    english: "The landlord raised the rent by another thousand shekels.",
    hebrewTokenPairs: [["בעל הבית", "בַּעַל הַבַּיִת"], ["העלה", "הֶעֱלָה"], ["את", "אֶת"], ["השכירות", "הַשְּׂכִירוּת"], ["בעוד", "בְּעוֹד"], ["אלף", "אֶלֶף"], ["שקל", "שֶׁקֶל"]],
    englishTokens: ["The landlord", "raised", "the rent", "by another", "thousand", "shekels"],
    hebrewDistractorPairs: [["השכן", "הַשָּׁכֵן"], ["הוריד", "הוֹרִיד"], ["הפיקדון", "הַפִּקָּדוֹן"], ["ועד הבית", "וַעַד הַבַּיִת"], ["מאה", "מֵאָה"]],
    englishDistractors: ["The neighbor", "lowered", "the deposit", "by only", "a hundred", "agorot"],
    notes: "בעל הבית = the landlord (lit. 'owner of the house'); השכירות = the rent. בעוד אלף שקל = 'by another thousand shekels' — the annual Tel Aviv ritual."
  }),
  buildExpandedSentence({
    id: "everyday_118", emoji: "🪟", category: "everyday", difficulty: 3,
    hebrew: "במודעה כתבו 'שני חדרים מוארים', בפועל זה מחסן עם חלון.",
    hebrewNiqqud: "בַּמּוֹדָעָה כָּתְבוּ 'שְׁנֵי חֲדָרִים מוּאָרִים', בְּפֹעַל זֶה מַחְסָן עִם חַלּוֹן.",
    english: "The ad said 'two sunny rooms'; in practice it's a storage room with a window.",
    hebrewTokenPairs: [["במודעה", "בַּמּוֹדָעָה"], ["כתבו", "כָּתְבוּ"], ["שני חדרים", "שְׁנֵי חֲדָרִים"], ["מוארים", "מוּאָרִים"], ["בפועל", "בְּפֹעַל"], ["זה", "זֶה"], ["מחסן", "מַחְסָן"], ["עם חלון", "עִם חַלּוֹן"]],
    englishTokens: ["The ad said", "two sunny rooms", "in practice", "it's", "a storage room", "with a window"],
    hebrewDistractorPairs: [["בחוזה", "בַּחוֹזֶה"], ["הבטיחו", "הִבְטִיחוּ"], ["שלושה חדרים", "שְׁלוֹשָׁה חֲדָרִים"], ["ארמון", "אַרְמוֹן"], ["עם מרפסת", "עִם מִרְפֶּסֶת"]],
    englishDistractors: ["The listing promised", "three tiny rooms", "in theory", "a palace", "with a balcony"],
    notes: "Apartment-ad Hebrew is its own dialect: מוארים ('full of light') can mean one bulb works. בפועל = 'in practice' — the word that deflates every listing. מחסן = storage room."
  }),
  buildExpandedSentence({
    id: "everyday_119", emoji: "🏃", category: "everyday", difficulty: 3,
    hebrew: "הגענו לראות את הדירה ועוד שלושים איש חיכו במדרגות.",
    hebrewNiqqud: "הִגַּעְנוּ לִרְאוֹת אֶת הַדִּירָה וְעוֹד שְׁלוֹשִׁים אִישׁ חִכּוּ בַּמַּדְרֵגוֹת.",
    english: "We came to see the apartment and another thirty people were waiting on the stairs.",
    hebrewTokenPairs: [["הגענו", "הִגַּעְנוּ"], ["לראות", "לִרְאוֹת"], ["את", "אֶת"], ["הדירה", "הַדִּירָה"], ["ועוד", "וְעוֹד"], ["שלושים", "שְׁלוֹשִׁים"], ["איש", "אִישׁ"], ["חיכו", "חִכּוּ"], ["במדרגות", "בַּמַּדְרֵגוֹת"]],
    englishTokens: ["We came", "to see", "the apartment", "and another", "thirty people", "were waiting", "on the stairs"],
    hebrewDistractorPairs: [["שכחנו", "שָׁכַחְנוּ"], ["לשכור", "לִשְׂכֹּר"], ["הסטודיו", "הַסְּטוּדְיוֹ"], ["מתווכים", "מְתַוְּכִים"], ["בלובי", "בַּלּוֹבִּי"]],
    englishDistractors: ["We forgot", "to rent", "the studio", "and only", "three brokers", "in the lobby"],
    notes: "The open-house stampede: one listing, thirty hopefuls in the stairwell. עוד שלושים איש = 'another thirty people' — איש serves as the counting word for people."
  }),
  buildExpandedSentence({
    id: "everyday_120", emoji: "🔑", category: "everyday", difficulty: 3,
    hebrew: "שילמנו דמי תיווך של חודש שלם בשביל דירה בלי מעלית.",
    hebrewNiqqud: "שִׁלַּמְנוּ דְּמֵי תִּוּוּךְ שֶׁל חֹדֶשׁ שָׁלֵם בִּשְׁבִיל דִּירָה בְּלִי מַעֲלִית.",
    english: "We paid a whole month's broker fee for an apartment with no elevator.",
    hebrewTokenPairs: [["שילמנו", "שִׁלַּמְנוּ"], ["דמי תיווך", "דְּמֵי תִּוּוּךְ"], ["של", "שֶׁל"], ["חודש", "חֹדֶשׁ"], ["שלם", "שָׁלֵם"], ["בשביל", "בִּשְׁבִיל"], ["דירה", "דִּירָה"], ["בלי", "בְּלִי"], ["מעלית", "מַעֲלִית"]],
    englishTokens: ["We paid", "a whole month's", "broker fee", "for an apartment", "with no elevator"],
    hebrewDistractorPairs: [["חסכנו", "חָסַכְנוּ"], ["פיקדון", "פִּקָּדוֹן"], ["חצי", "חֲצִי"], ["בשביל פנטהאוז", "בִּשְׁבִיל פֶּנְטְהָאוּז"], ["עם", "עִם"]],
    englishDistractors: ["We saved", "half a year's", "deposit", "for a penthouse", "with two balconies"],
    notes: "דמי תיווך — the broker's fee, traditionally a full month's rent for opening a door. בלי מעלית = no elevator, said while eyeing a fourth-floor walk-up."
  }),
  buildExpandedSentence({
    id: "everyday_121", emoji: "🛋️", category: "everyday", difficulty: 2,
    hebrew: "מחפשים שותף שלישי לדירה ליד השוק, בלי אגו ובלי דרמות.",
    hebrewNiqqud: "מְחַפְּשִׂים שֻׁתָּף שְׁלִישִׁי לְדִירָה לְיַד הַשּׁוּק, בְּלִי אֶגוֹ וּבְלִי דְּרָמוֹת.",
    english: "Looking for a third roommate for an apartment by the market, no ego and no drama.",
    hebrewTokenPairs: [["מחפשים", "מְחַפְּשִׂים"], ["שותף", "שֻׁתָּף"], ["שלישי", "שְׁלִישִׁי"], ["לדירה", "לְדִירָה"], ["ליד השוק", "לְיַד הַשּׁוּק"], ["בלי", "בְּלִי"], ["אגו", "אֶגוֹ"], ["ובלי", "וּבְלִי"], ["דרמות", "דְּרָמוֹת"]],
    englishTokens: ["Looking for", "a third roommate", "for an apartment", "by the market", "no ego", "and no drama"],
    hebrewDistractorPairs: [["מציעים", "מַצִּיעִים"], ["שותפה", "שֻׁתָּפָה"], ["רביעי", "רְבִיעִי"], ["ליד הים", "לְיַד הַיָּם"], ["חיות", "חַיּוֹת"]],
    englishDistractors: ["Offering", "a second bedroom", "for a couple", "by the beach", "no pets", "and no smoking"],
    notes: "Roommate-ad Hebrew: בלי אגו ובלי דרמות ('no ego, no drama') promises a harmony no Tel Aviv flatshare has ever achieved. שותף/שותפה = roommate (m/f)."
  }),
  buildExpandedSentence({
    id: "everyday_122", emoji: "🏢", category: "everyday", difficulty: 3,
    hebrew: "ישיבת ועד הבית נגמרה בצעקות בגלל האופניים בחניה.",
    hebrewNiqqud: "יְשִׁיבַת וַעַד הַבַּיִת נִגְמְרָה בִּצְעָקוֹת בִּגְלַל הָאוֹפַנַּיִם בַּחֲנָיָה.",
    english: "The building committee meeting ended in shouting because of the bikes in the parking area.",
    hebrewTokenPairs: [["ישיבת", "יְשִׁיבַת"], ["ועד הבית", "וַעַד הַבַּיִת"], ["נגמרה", "נִגְמְרָה"], ["בצעקות", "בִּצְעָקוֹת"], ["בגלל", "בִּגְלַל"], ["האופניים", "הָאוֹפַנַּיִם"], ["בחניה", "בַּחֲנָיָה"]],
    englishTokens: ["The building committee", "meeting", "ended in shouting", "because of", "the bikes", "in the parking area"],
    hebrewDistractorPairs: [["מסיבת", "מְסִבַּת"], ["השכנים", "הַשְּׁכֵנִים"], ["התחילה", "הִתְחִילָה"], ["בעוגה", "בְּעוּגָה"], ["על הגג", "עַל הַגַּג"]],
    englishDistractors: ["The tenants'", "party", "started with cake", "instead of", "the strollers", "on the roof"],
    notes: "ועד הבית — the building committee that collects dues and hosts Israel's fiercest micro-politics. נגמרה בצעקות = 'ended in shouting', the standard adjournment."
  }),
  buildExpandedSentence({
    id: "everyday_123", emoji: "📦", category: "everyday", difficulty: 2,
    hebrew: "עברנו דירה שלישית בשלוש שנים, כבר לא פותחים את הקרטונים.",
    hebrewNiqqud: "עָבַרְנוּ דִּירָה שְׁלִישִׁית בְּשָׁלוֹשׁ שָׁנִים, כְּבָר לֹא פּוֹתְחִים אֶת הַקַּרְטוֹנִים.",
    english: "We've moved to a third apartment in three years, we don't open the boxes anymore.",
    hebrewTokenPairs: [["עברנו", "עָבַרְנוּ"], ["דירה", "דִּירָה"], ["שלישית", "שְׁלִישִׁית"], ["בשלוש", "בְּשָׁלוֹשׁ"], ["שנים", "שָׁנִים"], ["כבר לא", "כְּבָר לֹא"], ["פותחים", "פּוֹתְחִים"], ["את", "אֶת"], ["הקרטונים", "הַקַּרְטוֹנִים"]],
    englishTokens: ["We've moved", "to a third apartment", "in three years", "we don't open", "the boxes", "anymore"],
    hebrewDistractorPairs: [["נשארנו", "נִשְׁאַרְנוּ"], ["באותה דירה", "בְּאוֹתָהּ דִּירָה"], ["בעשר", "בְּעֶשֶׂר"], ["סופרים", "סוֹפְרִים"], ["המפתחות", "הַמַּפְתְּחוֹת"]],
    englishDistractors: ["We've stayed", "in the same studio", "for ten months", "we don't count", "the keys", "yet"],
    notes: "כבר לא = 'not anymore' — after enough moves you already leave the boxes taped. עברנו דירה = 'we moved (apartments)'; the verb לעבור covers all relocation."
  }),
  buildExpandedSentence({
    id: "everyday_124", emoji: "🛋️", category: "everyday", difficulty: 2,
    hebrew: "מצאתי ספה כמעט חדשה ביד שנייה בפחות מחצי מחיר.",
    hebrewNiqqud: "מָצָאתִי סַפָּה כִּמְעַט חֲדָשָׁה בְּיָד שְׁנִיָּה בְּפָחוֹת מֵחֲצִי מְחִיר.",
    english: "I found an almost-new sofa second-hand for less than half price.",
    hebrewTokenPairs: [["מצאתי", "מָצָאתִי"], ["ספה", "סַפָּה"], ["כמעט", "כִּמְעַט"], ["חדשה", "חֲדָשָׁה"], ["ביד שנייה", "בְּיָד שְׁנִיָּה"], ["בפחות", "בְּפָחוֹת"], ["מחצי", "מֵחֲצִי"], ["מחיר", "מְחִיר"]],
    englishTokens: ["I found", "an almost-new sofa", "second-hand", "for less than", "half price"],
    hebrewDistractorPairs: [["מכרתי", "מָכַרְתִּי"], ["שולחן שבור", "שֻׁלְחָן שָׁבוּר"], ["בחנות", "בַּחֲנוּת"], ["ביותר", "בְּיוֹתֵר"], ["מהשכירות", "מֵהַשְּׂכִירוּת"]],
    englishDistractors: ["I sold", "a broken table", "brand-new", "for more than", "double the rent"],
    notes: "יד שנייה = second-hand; furnishing a Tel Aviv flat from the online listings and street finds is standard practice. בפחות מחצי מחיר = for under half price."
  }),
  buildExpandedSentence({
    id: "professional_66", emoji: "💸", category: "professional", difficulty: 2,
    hebrew: "החברה שלהם עשתה אקזיט, וכל המשרד מדבר רק על זה.",
    hebrewNiqqud: "הַחֶבְרָה שֶׁלָּהֶם עָשְׂתָה אֶקְזִיט, וְכָל הַמִּשְׂרָד מְדַבֵּר רַק עַל זֶה.",
    english: "Their company made an exit, and the whole office is talking only about it.",
    hebrewTokenPairs: [["החברה שלהם", "הַחֶבְרָה שֶׁלָּהֶם"], ["עשתה", "עָשְׂתָה"], ["אקזיט", "אֶקְזִיט"], ["וכל", "וְכָל"], ["המשרד", "הַמִּשְׂרָד"], ["מדבר", "מְדַבֵּר"], ["רק על זה", "רַק עַל זֶה"]],
    englishTokens: ["Their company", "made", "an exit", "and the whole", "office", "is talking", "only about it"],
    hebrewDistractorPairs: [["הסטארטאפ שלה", "הַסְּטַארְטַאפּ שֶׁלָּהּ"], ["גייסה", "גִּיְּסָה"], ["סבב", "סֶבֶב"], ["שותק", "שׁוֹתֵק"], ["רק על העסקה", "רַק עַל הָעִסְקָה"]],
    englishDistractors: ["Her startup", "raised", "a funding round", "is silent", "only about the deal"],
    notes: "אקזיט (exit — a startup being sold) came into everyday Hebrew straight from high-tech English; עשתה אקזיט is the standard collocation. גייסה סבב (raised a round) is the neighboring buzz-phrase trap."
  }),
  buildExpandedSentence({
    id: "professional_67", emoji: "💰", category: "professional", difficulty: 2,
    hebrew: "הסטארטאפ גייס עשרים מיליון דולר בסבב השני.",
    hebrewNiqqud: "הַסְּטַארְטַאפּ גִּיֵּס עֶשְׂרִים מִילְיוֹן דּוֹלָר בַּסֶּבֶב הַשֵּׁנִי.",
    english: "The startup raised twenty million dollars in its second round.",
    hebrewTokenPairs: [["הסטארטאפ", "הַסְּטַארְטַאפּ"], ["גייס", "גִּיֵּס"], ["עשרים", "עֶשְׂרִים"], ["מיליון", "מִילְיוֹן"], ["דולר", "דּוֹלָר"], ["בסבב", "בַּסֶּבֶב"], ["השני", "הַשֵּׁנִי"]],
    englishTokens: ["The startup", "raised", "twenty million", "dollars", "in its second", "round"],
    hebrewDistractorPairs: [["היוניקורן", "הַיּוּנִיקוֹרְן"], ["בזבז", "בִּזְבֵּז"], ["מאתיים", "מָאתַיִם"], ["שקל", "שֶׁקֶל"], ["הראשון", "הָרִאשׁוֹן"]],
    englishDistractors: ["The unicorn", "spent", "two hundred", "shekels", "in its first", "quarter"],
    notes: "Startup Hebrew: גייס = raised (funding), סבב = a round. יוניקורן (the distractor) needs no translation on Rothschild Boulevard."
  }),
  buildExpandedSentence({
    id: "professional_68", emoji: "🎧", category: "professional", difficulty: 2,
    hebrew: "אי אפשר להתרכז באופן ספייס כשכולם בשיחות זום.",
    hebrewNiqqud: "אִי אֶפְשָׁר לְהִתְרַכֵּז בָּאוֹפֶן סְפֵּייס כְּשֶׁכֻּלָּם בְּשִׂיחוֹת זוּם.",
    english: "It's impossible to concentrate in the open space when everyone is on Zoom calls.",
    hebrewTokenPairs: [["אי אפשר", "אִי אֶפְשָׁר"], ["להתרכז", "לְהִתְרַכֵּז"], ["באופן ספייס", "בָּאוֹפֶן סְפֵּייס"], ["כשכולם", "כְּשֶׁכֻּלָּם"], ["בשיחות", "בְּשִׂיחוֹת"], ["זום", "זוּם"]],
    englishTokens: ["It's impossible", "to concentrate", "in the open space", "when everyone", "is on Zoom calls"],
    hebrewDistractorPairs: [["קל", "קַל"], ["לנמנם", "לְנַמְנֵם"], ["במטבחון", "בַּמִּטְבָּחוֹן"], ["כשאף אחד", "כְּשֶׁאַף אֶחָד"], ["במשרד", "בַּמִּשְׂרָד"]],
    englishDistractors: ["It's easy", "to nap", "in the kitchen", "when nobody", "is at the office"],
    notes: "אופן ספייס — the open-plan office, imported with its noise. מטבחון (the distractor) is the office kitchenette where the actual decisions happen. כש־ = when."
  }),
  buildExpandedSentence({
    id: "professional_69", emoji: "🐶", category: "professional", difficulty: 1,
    hebrew: "יש שלושה כלבים במשרד ורק מנהלת אחת.",
    hebrewNiqqud: "יֵשׁ שְׁלוֹשָׁה כְּלָבִים בַּמִּשְׂרָד וְרַק מְנַהֶלֶת אַחַת.",
    english: "There are three dogs at the office and only one manager.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["שלושה", "שְׁלוֹשָׁה"], ["כלבים", "כְּלָבִים"], ["במשרד", "בַּמִּשְׂרָד"], ["ורק", "וְרַק"], ["מנהלת", "מְנַהֶלֶת"], ["אחת", "אַחַת"]],
    englishTokens: ["There are", "three dogs", "at the office", "and only", "one manager"],
    hebrewDistractorPairs: [["אין", "אֵין"], ["חתולים", "חֲתוּלִים"], ["שני", "שְׁנֵי"], ["בישיבה", "בַּיְשִׁיבָה"], ["מתמחה", "מִתְמַחֶה"]],
    englishDistractors: ["There is", "two cats", "at the meeting", "and also", "one intern"],
    notes: "The office dog (כלב משרד) outranks everyone at a Tel Aviv startup. מנהלת = a (female) manager; אחת agrees in the feminine."
  }),
  buildExpandedSentence({
    id: "professional_70", emoji: "⏰", category: "professional", difficulty: 2,
    hebrew: "הדדליין של הספרינט הוקדם, אז כולם נשארים עד מאוחר.",
    hebrewNiqqud: "הַדֶּדְלַיְן שֶׁל הַסְּפְּרִינְט הֻקְדַּם, אָז כֻּלָּם נִשְׁאָרִים עַד מְאֻחָר.",
    english: "The deadline for the sprint was moved up, so everyone is staying late.",
    hebrewTokenPairs: [["הדדליין", "הַדֶּדְלַיְן"], ["של", "שֶׁל"], ["הספרינט", "הַסְּפְּרִינְט"], ["הוקדם", "הֻקְדַּם"], ["אז", "אָז"], ["כולם", "כֻּלָּם"], ["נשארים", "נִשְׁאָרִים"], ["עד", "עַד"], ["מאוחר", "מְאֻחָר"]],
    englishTokens: ["The deadline", "for the sprint", "was moved up", "so", "everyone", "is staying", "late"],
    hebrewDistractorPairs: [["הדמו", "הַדֶּמוֹ"], ["ההשקה", "הַהַשָּׁקָה"], ["נדחה", "נִדְחָה"], ["הולכים", "הוֹלְכִים"], ["הביתה", "הַבַּיְתָה"]],
    englishDistractors: ["The demo", "for the launch", "was pushed back", "because", "nobody", "is going home"],
    notes: "דדליין and ספרינט arrived untranslated with the tech industry. הוקדם = 'was moved earlier' — the passive that ruins evenings; its opposite נדחה (postponed) is the tile everyone wishes were true."
  }),
  buildExpandedSentence({
    id: "professional_71", emoji: "🏠", category: "professional", difficulty: 3,
    hebrew: "המנכ\"ל רוצה את כולם במשרד, אבל הצוות מתעקש על היברידי.",
    hebrewNiqqud: "הַמַּנְכָּ\"ל רוֹצֶה אֶת כֻּלָּם בַּמִּשְׂרָד, אֲבָל הַצֶּוֶת מִתְעַקֵּשׁ עַל הִיבְּרִידִי.",
    english: "The CEO wants everyone at the office, but the team insists on hybrid.",
    hebrewTokenPairs: [["המנכ\"ל", "הַמַּנְכָּ\"ל"], ["רוצה", "רוֹצֶה"], ["את כולם", "אֶת כֻּלָּם"], ["במשרד", "בַּמִּשְׂרָד"], ["אבל", "אֲבָל"], ["הצוות", "הַצֶּוֶת"], ["מתעקש", "מִתְעַקֵּשׁ"], ["על", "עַל"], ["היברידי", "הִיבְּרִידִי"]],
    englishTokens: ["The CEO", "wants", "everyone", "at the office", "but the team", "insists", "on hybrid"],
    hebrewDistractorPairs: [["הסמנכ\"ל", "הַסְּמַנְכָּ\"ל"], ["מבטיח", "מַבְטִיחַ"], ["אף אחד", "אַף אֶחָד"], ["בבית", "בַּבַּיִת"], ["מוותר", "מְוַתֵּר"]],
    englishDistractors: ["The VP", "promises", "nobody", "at home", "but the board", "gives up"],
    notes: "מנכ\"ל (CEO) and סמנכ\"ל (VP) are acronyms so common they behave like ordinary words. מתעקש על = insists on; היברידי — the post-2020 word no Israeli office meeting escapes."
  }),
  buildExpandedSentence({
    id: "professional_72", emoji: "🐛", category: "professional", difficulty: 3,
    hebrew: "זה לא באג, זה פיצ'ר — ככה אמרו לי בפיתוח.",
    hebrewNiqqud: "זֶה לֹא בַּאג, זֶה פִיצֶ'ר — כָּכָה אָמְרוּ לִי בְּפִתּוּחַ.",
    english: "It's not a bug, it's a feature — that's what they told me in development.",
    hebrewTokenPairs: [["זה", "זֶה"], ["לא", "לֹא"], ["באג", "בַּאג"], ["זה", "זֶה"], ["פיצ'ר", "פִיצֶ'ר"], ["ככה", "כָּכָה"], ["אמרו", "אָמְרוּ"], ["לי", "לִי"], ["בפיתוח", "בְּפִתּוּחַ"]],
    englishTokens: ["It's not", "a bug", "it's", "a feature", "that's what", "they told me", "in development"],
    hebrewDistractorPairs: [["רק", "רַק"], ["תקלה", "תַּקָּלָה"], ["דמו", "דֶּמוֹ"], ["כך", "כָּךְ"], ["בתמיכה", "בַּתְּמִיכָה"]],
    englishDistractors: ["It's only", "a glitch", "a demo", "that's how", "they warned us", "in QA"],
    notes: "The universal engineering excuse, fully naturalized: באג and פיצ'ר. ככה = 'that's how' (casual); its formal twin כך sits in the distractors. בפיתוח = in the dev department."
  }),
  buildExpandedSentence({
    id: "formal_61", emoji: "🛴", category: "formal", difficulty: 3,
    hebrew: "עיריית תל אביב מזכירה לתושבים כי אין לנסוע בקורקינט על המדרכה.",
    hebrewNiqqud: "עִירִיַּת תֵּל אָבִיב מַזְכִּירָה לַתּוֹשָׁבִים כִּי אֵין לִנְסֹעַ בְּקוֹרְקִינֵט עַל הַמִּדְרָכָה.",
    english: "The Tel Aviv municipality reminds residents that riding a scooter on the sidewalk is not allowed.",
    hebrewTokenPairs: [["עיריית תל אביב", "עִירִיַּת תֵּל אָבִיב"], ["מזכירה", "מַזְכִּירָה"], ["לתושבים", "לַתּוֹשָׁבִים"], ["כי", "כִּי"], ["אין לנסוע", "אֵין לִנְסֹעַ"], ["בקורקינט", "בְּקוֹרְקִינֵט"], ["על המדרכה", "עַל הַמִּדְרָכָה"]],
    englishTokens: ["The Tel Aviv municipality", "reminds", "residents", "that riding", "a scooter", "on the sidewalk", "is not allowed"],
    hebrewDistractorPairs: [["מודיעה", "מוֹדִיעָה"], ["לנהגים", "לַנֶּהָגִים"], ["מותר לנסוע", "מֻתָּר לִנְסֹעַ"], ["באופניים", "בְּאוֹפַנַּיִם"], ["בשביל האופניים", "בִּשְׁבִיל הָאוֹפַנַּיִם"]],
    englishDistractors: ["announces to", "drivers", "that parking", "a bicycle", "in the bike lane", "is permitted"],
    notes: "Municipal-notice register: כי replaces ש, and אין + infinitive = 'one must not' — the exact pattern on Israeli public signage. עיריית is the construct form of עירייה; the city scolding scooter riders is a running Tel Aviv joke."
  }),
  buildExpandedSentence({
    id: "formal_62", emoji: "🏖️", category: "formal", difficulty: 2,
    hebrew: "העירייה מבקשת מהמתרחצים שלא להשאיר זבל על החוף.",
    hebrewNiqqud: "הָעִירִיָּה מְבַקֶּשֶׁת מֵהַמִּתְרַחֲצִים שֶׁלֹּא לְהַשְׁאִיר זֶבֶל עַל הַחוֹף.",
    english: "The municipality asks bathers not to leave trash on the beach.",
    hebrewTokenPairs: [["העירייה", "הָעִירִיָּה"], ["מבקשת", "מְבַקֶּשֶׁת"], ["מהמתרחצים", "מֵהַמִּתְרַחֲצִים"], ["שלא", "שֶׁלֹּא"], ["להשאיר", "לְהַשְׁאִיר"], ["זבל", "זֶבֶל"], ["על", "עַל"], ["החוף", "הַחוֹף"]],
    englishTokens: ["The municipality", "asks", "bathers", "not to leave", "trash", "on the beach"],
    hebrewDistractorPairs: [["המציל", "הַמַּצִּיל"], ["דורשת", "דּוֹרֶשֶׁת"], ["מהגולשים", "מֵהַגּוֹלְשִׁים"], ["להביא", "לְהָבִיא"], ["כיסאות", "כִּסְּאוֹת"]],
    englishDistractors: ["The lifeguard", "orders", "surfers", "not to bring", "chairs", "on the boardwalk"],
    notes: "Municipal-request register: מבקשת מ־... שלא + infinitive = 'requests that (people) not...'. מתרחצים ('bathers') is a word that exists only on signs and in municipal announcements."
  }),
  buildExpandedSentence({
    id: "formal_63", emoji: "🚧", category: "formal", difficulty: 3,
    hebrew: "אנו מתנצלים על אי הנוחות הזמנית בעקבות עבודות הרכבת הקלה.",
    hebrewNiqqud: "אָנוּ מִתְנַצְּלִים עַל אִי הַנּוֹחוּת הַזְּמַנִּית בְּעִקְבוֹת עֲבוֹדוֹת הָרַכֶּבֶת הַקַּלָּה.",
    english: "We apologize for the temporary inconvenience due to the light rail works.",
    hebrewTokenPairs: [["אנו", "אָנוּ"], ["מתנצלים", "מִתְנַצְּלִים"], ["על", "עַל"], ["אי הנוחות", "אִי הַנּוֹחוּת"], ["הזמנית", "הַזְּמַנִּית"], ["בעקבות", "בְּעִקְבוֹת"], ["עבודות", "עֲבוֹדוֹת"], ["הרכבת הקלה", "הָרַכֶּבֶת הַקַּלָּה"]],
    englishTokens: ["We apologize", "for the temporary", "inconvenience", "due to", "the light rail", "works"],
    hebrewDistractorPairs: [["אנו מודים", "אָנוּ מוֹדִים"], ["הקבועה", "הַקְּבוּעָה"], ["בזכות", "בִּזְכוּת"], ["המנהרה", "הַמִּנְהָרָה"], ["סגירת", "סְגִירַת"]],
    englishDistractors: ["We thank you", "for the permanent", "delay", "thanks to", "the new tunnel", "closures"],
    notes: "The sign every Tel Avivian read for a decade. אי־ prefixed to a noun negates it: אי הנוחות = 'the inconvenience'. אנו is the formal 'we'; בעקבות = 'following/due to'. 'Works' is signage English (as in 'roadworks') — its stiffness matches the register of אנו and אי הנוחות."
  }),
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION_ROUND4);

const SENTENCE_EXPANSION_POLITICS = [
  buildExpandedSentence({
    id: "colloquial_140", emoji: "🗳️", category: "colloquial", difficulty: 2,
    hebrew: "עוד בחירות? אין מצב שהקואליציה הזאת מחזיקה עד הקיץ.",
    hebrewNiqqud: "עוֹד בְּחִירוֹת? אֵין מַצָּב שֶׁהַקּוֹאָלִיצְיָה הַזֹּאת מַחֲזִיקָה עַד הַקַּיִץ.",
    english: "Another election? No way this coalition lasts until the summer.",
    hebrewTokenPairs: [["עוד בחירות", "עוֹד בְּחִירוֹת"], ["אין מצב", "אֵין מַצָּב"], ["שהקואליציה הזאת", "שֶׁהַקּוֹאָלִיצְיָה הַזֹּאת"], ["מחזיקה", "מַחֲזִיקָה"], ["עד הקיץ", "עַד הַקַּיִץ"]],
    englishTokens: ["Another election", "No way", "this coalition", "lasts", "until the summer"],
    hebrewDistractorPairs: [["עוד סיבוב", "עוֹד סִיבּוּב"], ["יש סיכוי", "יֵשׁ סִכּוּי"], ["שהאופוזיציה", "שֶׁהָאוֹפּוֹזִיצְיָה"], ["נופלת", "נוֹפֶלֶת"], ["עד החורף", "עַד הַחֹרֶף"]],
    englishDistractors: ["One more round", "There is a chance", "that the opposition", "falls apart", "until winter"],
    notes: "In Israeli political talk בחירות is conventionally plural even for one election. אין מצב is a strongly colloquial 'no way,' while קואליציה is the governing coalition."
  }),
  buildExpandedSentence({
    id: "colloquial_141", emoji: "↔️", category: "colloquial", difficulty: 2,
    hebrew: "כולם רבים על ימין ושמאל, ובינתיים יוקר המחיה רק עולה.",
    hebrewNiqqud: "כֻּלָּם רָבִים עַל יָמִין וּשְׂמֹאל, וּבֵינְתַיִם יֹקֶר הַמִּחְיָה רַק עוֹלֶה.",
    english: "Everyone argues about right and left, while the cost of living just keeps rising.",
    hebrewTokenPairs: [["כולם", "כֻּלָּם"], ["רבים על", "רָבִים עַל"], ["ימין ושמאל", "יָמִין וּשְׂמֹאל"], ["ובינתיים", "וּבֵינְתַיִם"], ["יוקר המחיה", "יֹקֶר הַמִּחְיָה"], ["רק", "רַק"], ["עולה", "עוֹלֶה"]],
    englishTokens: ["Everyone", "argues about", "right and left", "while", "the cost of living", "just keeps", "rising"],
    hebrewDistractorPairs: [["רוב האנשים", "רֹב הָאֲנָשִׁים"], ["מסכימים על", "מַסְכִּימִים עַל"], ["המרכז הפוליטי", "הַמֶּרְכָּז הַפּוֹלִיטִי"], ["באותו זמן", "בְּאוֹתוֹ זְמַן"], ["מחירי היצוא", "מְחִירֵי הַיְצוּא"], ["סוף סוף יורדים", "סוֹף סוֹף יוֹרְדִים"]],
    englishDistractors: ["Most people", "agree on", "the political center", "at that moment", "export prices", "finally fall"],
    notes: "ימין ושמאל are the everyday labels for the political right and left. יוקר המחיה, literally 'the costliness of living,' is the standard phrase for cost-of-living debates."
  }),
  buildExpandedSentence({
    id: "colloquial_142", emoji: "📣", category: "colloquial", difficulty: 1,
    hebrew: "ההפגנה מתחילה בשבע, ניפגש ליד האנדרטה?",
    hebrewNiqqud: "הַהַפְגָּנָה מַתְחִילָה בְּשֶׁבַע, נִפָּגֵשׁ לְיַד הָאַנְדַּרְטָה?",
    english: "The protest starts at seven—should we meet by the monument?",
    hebrewTokenPairs: [["ההפגנה", "הַהַפְגָּנָה"], ["מתחילה", "מַתְחִילָה"], ["בשבע", "בְּשֶׁבַע"], ["ניפגש", "נִפָּגֵשׁ"], ["ליד", "לְיַד"], ["האנדרטה", "הָאַנְדַּרְטָה"]],
    englishTokens: ["The protest", "starts", "at seven", "should we meet", "by", "the monument"],
    hebrewDistractorPairs: [["העצרת", "הָעֲצֶרֶת"], ["מסתיימת", "מִסְתַּיֶּמֶת"], ["בתשע", "בְּתֵשַׁע"], ["מתפזרים", "מִתְפַּזְּרִים"], ["מול", "מוּל"], ["התחנה", "הַתַּחֲנָה"]],
    englishDistractors: ["The rally", "ends", "at nine", "should we disperse", "opposite", "the station"],
    notes: "הפגנה is a demonstration or protest; עצרת is a rally or assembly. אנדרטה is a memorial monument and a natural landmark for arranging where to meet."
  }),
  buildExpandedSentence({
    id: "colloquial_143", emoji: "📱", category: "colloquial", difficulty: 3,
    hebrew: "הסרטון הצית ויכוח על אלימות משטרתית, אבל אף אחד לא בדק את ההקשר.",
    hebrewNiqqud: "הַסִּרְטוֹן הִצִּית וִכּוּחַ עַל אַלִּימוּת מִשְׁטַרְתִּית, אֲבָל אַף אֶחָד לֹא בָּדַק אֶת הַהֶקְשֵׁר.",
    english: "The video sparked an argument about police brutality, but no one checked the context.",
    hebrewTokenPairs: [["הסרטון", "הַסִּרְטוֹן"], ["הצית", "הִצִּית"], ["ויכוח", "וִכּוּחַ"], ["על", "עַל"], ["אלימות משטרתית", "אַלִּימוּת מִשְׁטַרְתִּית"], ["אבל", "אֲבָל"], ["אף אחד לא", "אַף אֶחָד לֹא"], ["בדק", "בָּדַק"], ["את ההקשר", "אֶת הַהֶקְשֵׁר"]],
    englishTokens: ["The video", "sparked", "an argument", "about", "police brutality", "but", "no one", "checked", "the context"],
    hebrewDistractorPairs: [["הדיווח", "הַדִּוּוּחַ"], ["סיים", "סִיֵּם"], ["מריבה", "מְרִיבָה"], ["בלי", "בְּלִי"], ["אדישות", "אֲדִישׁוּת"], ["כולם", "כֻּלָּם"]],
    englishDistractors: ["The report", "settled", "a quarrel", "without", "indifference", "everyone"],
    notes: "אלימות משטרתית is the common activist and media phrase for police brutality or police violence. ההקשר means 'the context'; the sentence describes a media argument without deciding its facts."
  }),
  buildExpandedSentence({
    id: "colloquial_144", emoji: "🗯️", category: "colloquial", difficulty: 3,
    hebrew: "הוא אומר כיבוש, היא אומרת שליטה צבאית; פה אפילו המילים פוליטיות.",
    hebrewNiqqud: "הוּא אוֹמֵר כִּבּוּשׁ, הִיא אוֹמֶרֶת שְׁלִיטָה צְבָאִית; פֹּה אֲפִלּוּ הַמִּלִּים פּוֹלִיטִיּוֹת.",
    english: "He says occupation, she says military control; here even the words are political.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["אומר", "אוֹמֵר"], ["כיבוש", "כִּבּוּשׁ"], ["היא", "הִיא"], ["אומרת", "אוֹמֶרֶת"], ["שליטה צבאית", "שְׁלִיטָה צְבָאִית"], ["פה", "פֹּה"], ["אפילו", "אֲפִלּוּ"], ["המילים", "הַמִּלִּים"], ["פוליטיות", "פּוֹלִיטִיּוֹת"]],
    englishTokens: ["He", "says", "occupation", "she", "says", "military control", "here", "even", "the words", "are political"],
    hebrewDistractorPairs: [["טוען", "טוֹעֵן"], ["סיפוח", "סִפּוּחַ"], ["ממשל אזרחי", "מִמְשָׁל אֶזְרָחִי"], ["שם", "שָׁם"], ["רק המספרים", "רַק הַמִּסְפָּרִים"], ["ניטרליים", "נֵיטְרָלִיִּים"]],
    englishDistractors: ["argues", "annexation", "civilian government", "there", "only the numbers", "are neutral"],
    notes: "כיבוש is the usual Hebrew word for occupation; שליטה צבאית is the more descriptive 'military control.' The paired wording highlights how speakers' term choice can signal framing."
  }),
  buildExpandedSentence({
    id: "colloquial_145", emoji: "🏳️‍🌈", category: "colloquial", difficulty: 2,
    hebrew: "עברנו לתל אביב כי רצינו קהילה גאה ויותר פתיחות.",
    hebrewNiqqud: "עָבַרְנוּ לְתֵל אָבִיב כִּי רָצִינוּ קְהִלָּה גֵּאָה וְיוֹתֵר פְּתִיחוּת.",
    english: "We moved to Tel Aviv because we wanted an LGBTQ community and greater openness.",
    hebrewTokenPairs: [["עברנו", "עָבַרְנוּ"], ["לתל אביב", "לְתֵל אָבִיב"], ["כי", "כִּי"], ["רצינו", "רָצִינוּ"], ["קהילה גאה", "קְהִלָּה גֵּאָה"], ["ויותר", "וְיוֹתֵר"], ["פתיחות", "פְּתִיחוּת"]],
    englishTokens: ["We moved", "to Tel Aviv", "because", "we wanted", "an LGBTQ community", "and greater", "openness"],
    hebrewDistractorPairs: [["חזרנו", "חָזַרְנוּ"], ["לחיפה", "לְחֵיפָה"], ["עזבנו", "עָזַבְנוּ"], ["בדידות", "בְּדִידוּת"], ["ועבודה", "וַעֲבוֹדָה"], ["שקטה יותר", "שְׁקֵטָה יוֹתֵר"]],
    englishDistractors: ["We returned", "to Haifa", "we left", "solitude", "and a job", "that was quieter"],
    notes: "קהילה גאה, literally 'proud community,' is a common warm term for the LGBTQ community. The more institutional abbreviation is להט״ב."
  }),
  buildExpandedSentence({
    id: "colloquial_146", emoji: "🏠", category: "colloquial", difficulty: 2,
    hebrew: "עם המשכורת הזאת, צעירים וצעירות יכולים רק לחלום על דירה במרכז הארץ.",
    hebrewNiqqud: "עִם הַמַּשְׂכֹּרֶת הַזֹּאת, צְעִירִים וּצְעִירוֹת יְכוֹלִים רַק לַחֲלֹם עַל דִּירָה בְּמֶרְכַּז הָאָרֶץ.",
    english: "On this salary, young adults can only dream of an apartment in central Israel.",
    hebrewTokenPairs: [["עם המשכורת הזאת", "עִם הַמַּשְׂכֹּרֶת הַזֹּאת"], ["צעירים וצעירות", "צְעִירִים וּצְעִירוֹת"], ["יכולים רק לחלום", "יְכוֹלִים רַק לַחֲלֹם"], ["על דירה", "עַל דִּירָה"], ["במרכז הארץ", "בְּמֶרְכַּז הָאָרֶץ"]],
    englishTokens: ["On this salary", "young adults", "can only dream", "of an apartment", "in central Israel"],
    hebrewDistractorPairs: [["עם החיסכון ההוא", "עִם הַחִסָּכוֹן הַהוּא"], ["גמלאים", "גִּמְלָאִים"], ["חייבים כבר לקנות", "חַיָּבִים כְּבָר לִקְנוֹת"], ["משרד", "מִשְׂרָד"], ["בפריפריה", "בַּפֶּרִיפֶרְיָה"]],
    englishDistractors: ["With those savings", "retirees", "must already buy", "an office", "on the outskirts"],
    notes: "צעירים וצעירות explicitly includes young men and women; mixed groups take the masculine-plural יכולים. המרכז often means Israel's expensive central region, not merely a city center."
  }),
  buildExpandedSentence({
    id: "colloquial_147", emoji: "🧳", category: "colloquial", difficulty: 3,
    hebrew: "העולים החדשים בקושי מבינים את אחוז החסימה, וכבר מפציצים אותם בסקרי בחירות.",
    hebrewNiqqud: "הָעוֹלִים הַחֲדָשִׁים בְּקֹשִׁי מְבִינִים אֶת אֲחוּז הַחֲסִימָה, וּכְבָר מַפְצִיצִים אוֹתָם בְּסִקְרֵי בְּחִירוֹת.",
    english: "The new immigrants barely understand the electoral threshold, and they are already being bombarded with election polls.",
    hebrewTokenPairs: [["העולים החדשים", "הָעוֹלִים הַחֲדָשִׁים"], ["בקושי", "בְּקֹשִׁי"], ["מבינים", "מְבִינִים"], ["את אחוז החסימה", "אֶת אֲחוּז הַחֲסִימָה"], ["וכבר", "וּכְבָר"], ["מפציצים אותם", "מַפְצִיצִים אוֹתָם"], ["בסקרי בחירות", "בְּסִקְרֵי בְּחִירוֹת"]],
    englishTokens: ["The new immigrants", "barely", "understand", "the electoral threshold", "and", "they are already being bombarded", "with election polls"],
    hebrewDistractorPairs: [["התושבים הוותיקים", "הַתּוֹשָׁבִים הַוָּתִיקִים"], ["בקלות", "בְּקַלּוּת"], ["שוכחים", "שׁוֹכְחִים"], ["מנדט", "מַנְדָּט"], ["והשאלונים", "וְהַשְּׁאֵלוֹנִים"], ["עדיין", "עֲדַיִן"]],
    englishDistractors: ["Longtime residents", "easily", "forget", "a seat", "and questionnaires", "still"],
    notes: "עולים חדשים are new immigrants under the idea of aliyah. אחוז החסימה is the electoral threshold a party must cross to enter the Knesset; מפציצים אותם is the colloquial 'bombarding them.'"
  }),
  buildExpandedSentence({
    id: "colloquial_148", emoji: "📺", category: "colloquial", difficulty: 2,
    hebrew: "כל פעם שביבי עולה לשידור, הקבוצה המשפחתית מתפוצצת מהודעות.",
    hebrewNiqqud: "כָּל פַּעַם שֶׁבִּיבִּי עוֹלֶה לְשִׁדּוּר, הַקְּבוּצָה הַמִּשְׁפַּחְתִּית מִתְפּוֹצֶצֶת מֵהוֹדָעוֹת.",
    english: "Every time Bibi goes on air, the family group chat blows up with messages.",
    hebrewTokenPairs: [["כל פעם", "כָּל פַּעַם"], ["שביבי", "שֶׁבִּיבִּי"], ["עולה לשידור", "עוֹלֶה לְשִׁדּוּר"], ["הקבוצה המשפחתית", "הַקְּבוּצָה הַמִּשְׁפַּחְתִּית"], ["מתפוצצת", "מִתְפּוֹצֶצֶת"], ["מהודעות", "מֵהוֹדָעוֹת"]],
    englishTokens: ["Every time", "Bibi", "goes on air", "the family group chat", "blows up", "with messages"],
    hebrewDistractorPairs: [["לעיתים רחוקות", "לְעִתִּים רְחוֹקוֹת"], ["שהפרשן", "שֶׁהַפַּרְשָׁן"], ["יורד מהמסך", "יוֹרֵד מֵהַמָּסָךְ"], ["צוות העבודה", "צֶוֶת הָעֲבוֹדָה"], ["נרגע", "נִרְגָּע"], ["מתמונות", "מִתְּמוּנוֹת"]],
    englishDistractors: ["Once in a while", "the commentator", "leaves the screen", "the work team", "calms down", "with pictures"],
    notes: "עולה לשידור means 'goes on air.' ביבי is Benjamin Netanyahu's universally recognized nickname; the joke is about family-chat polarization, not a political judgment."
  }),
  buildExpandedSentence({
    id: "colloquial_149", emoji: "🧾", category: "colloquial", difficulty: 2,
    hebrew: "מעמד הביניים משלם יותר ומרגיש שהוא מקבל פחות.",
    hebrewNiqqud: "מַעֲמַד הַבֵּינַיִם מְשַׁלֵּם יוֹתֵר וּמַרְגִּישׁ שֶׁהוּא מְקַבֵּל פָּחוֹת.",
    english: "The middle class pays more and feels like it gets less.",
    hebrewTokenPairs: [["מעמד הביניים", "מַעֲמַד הַבֵּינַיִם"], ["משלם", "מְשַׁלֵּם"], ["יותר", "יוֹתֵר"], ["ומרגיש", "וּמַרְגִּישׁ"], ["שהוא", "שֶׁהוּא"], ["מקבל", "מְקַבֵּל"], ["פחות", "פָּחוֹת"]],
    englishTokens: ["The middle class", "pays", "more", "and feels", "like it", "gets", "less"],
    hebrewDistractorPairs: [["המעמד הגבוה", "הַמַּעֲמָד הַגָּבוֹהַּ"], ["חוסך", "חוֹסֵךְ"], ["מעט", "מְעַט"], ["ויודע", "וְיוֹדֵעַ"], ["שהמעמד", "שֶׁהַמַּעֲמָד"], ["דורש", "דּוֹרֵשׁ"]],
    englishDistractors: ["The upper class", "saves", "a little", "and knows", "that group", "demands"],
    notes: "מעמד הביניים is the standard socioeconomic phrase 'the middle class.' Hebrew treats the collective phrase as masculine singular here, hence משלם and שהוא."
  }),
  buildExpandedSentence({
    id: "colloquial_150", emoji: "🚌", category: "colloquial", difficulty: 2,
    hebrew: "תחבורה ציבורית בשבת? בתל אביב זה נשמע מובן מאליו, ובערים אחרות ממש לא.",
    hebrewNiqqud: "תַּחְבּוּרָה צִבּוּרִית בְּשַׁבָּת? בְּתֵל אָבִיב זֶה נִשְׁמָע מוּבָן מֵאֵלָיו, וּבְעָרִים אֲחֵרוֹת מַמָּשׁ לֹא.",
    english: "Public transportation on Shabbat? In Tel Aviv it seems like a given; in other cities, definitely not.",
    hebrewTokenPairs: [["תחבורה ציבורית", "תַּחְבּוּרָה צִבּוּרִית"], ["בשבת", "בְּשַׁבָּת"], ["בתל אביב", "בְּתֵל אָבִיב"], ["זה", "זֶה"], ["נשמע", "נִשְׁמָע"], ["מובן מאליו", "מוּבָן מֵאֵלָיו"], ["ובערים", "וּבְעָרִים"], ["אחרות", "אֲחֵרוֹת"], ["ממש לא", "מַמָּשׁ לֹא"]],
    englishTokens: ["Public transportation", "on Shabbat", "In Tel Aviv", "it", "seems", "like a given", "in", "other cities", "definitely not"],
    hebrewDistractorPairs: [["רכב", "רֶכֶב"], ["ביום ראשון", "בְּיוֹם רִאשׁוֹן"], ["בירושלים", "בִּירוּשָׁלַיִם"], ["מרגיש", "מַרְגִּישׁ"], ["שנוי במחלוקת", "שָׁנוּי בְּמַחֲלֹקֶת"], ["ובכפרים", "וּבִכְפָרִים"]],
    englishDistractors: ["Cars", "on Sunday", "In Jerusalem", "feels", "controversial", "and in villages"],
    notes: "תחבורה ציבורית בשבת is a recurring religion-and-state debate. מובן מאליו means 'self-evident' or obvious; ממש לא gives the emphatic colloquial contrast 'not at all.'"
  }),
  buildExpandedSentence({
    id: "colloquial_151", emoji: "📰", category: "colloquial", difficulty: 3,
    hebrew: "כשאומרים אלימות מתנחלים, צריך לברר על איזה אירוע מדברים.",
    hebrewNiqqud: "כְּשֶׁאוֹמְרִים אַלִּימוּת מִתְנַחֲלִים, צָרִיךְ לְבָרֵר עַל אֵיזֶה אֵירוּעַ מְדַבְּרִים.",
    english: "When people say ‘settler violence,’ you need to check which incident they’re talking about.",
    hebrewTokenPairs: [["כשאומרים", "כְּשֶׁאוֹמְרִים"], ["אלימות מתנחלים", "אַלִּימוּת מִתְנַחֲלִים"], ["צריך", "צָרִיךְ"], ["לברר", "לְבָרֵר"], ["על איזה אירוע", "עַל אֵיזֶה אֵירוּעַ"], ["מדברים", "מְדַבְּרִים"]],
    englishTokens: ["When people say", "settler violence", "you need to", "check", "which incident", "they’re talking about"],
    hebrewDistractorPairs: [["כשכותבים", "כְּשֶׁכּוֹתְבִים"], ["מחאה", "מְחָאָה"], ["אפשר להניח", "אֶפְשָׁר לְהַנִּיחַ"], ["על איזו תקופה", "עַל אֵיזוֹ תְּקוּפָה"], ["מתווכחים", "מִתְוַכְּחִים"]],
    englishDistractors: ["When people write", "a protest", "you can assume", "which period", "they dispute"],
    notes: "אלימות מתנחלים is the compact media phrase 'settler violence.' The impersonal plural אומרים and מדברים avoids naming a speaker and keeps the sentence focused on careful reference."
  }),
  buildExpandedSentence({
    id: "everyday_125", emoji: "🗿", category: "everyday", difficulty: 2,
    hebrew: "המדריכה הסבירה שהאנדרטה מנציחה מאבק למען זכויות אזרח.",
    hebrewNiqqud: "הַמַּדְרִיכָה הִסְבִּירָה שֶׁהָאַנְדַּרְטָה מַנְצִיחָה מַאֲבָק לְמַעַן זְכֻיּוֹת אֶזְרָח.",
    english: "The guide explained that the monument commemorates a struggle for civil rights.",
    hebrewTokenPairs: [["המדריכה", "הַמַּדְרִיכָה"], ["הסבירה", "הִסְבִּירָה"], ["שהאנדרטה", "שֶׁהָאַנְדַּרְטָה"], ["מנציחה", "מַנְצִיחָה"], ["מאבק", "מַאֲבָק"], ["למען", "לְמַעַן"], ["זכויות אזרח", "זְכֻיּוֹת אֶזְרָח"]],
    englishTokens: ["The guide", "explained", "that the monument", "commemorates", "a struggle", "for", "civil rights"],
    hebrewDistractorPairs: [["העיתונאית", "הָעִתּוֹנָאִית"], ["טענה", "טָעֲנָה"], ["שהכיכר", "שֶׁהַכִּכָּר"], ["מסתירה", "מַסְתִּירָה"], ["זכויות עובדים", "זְכֻיּוֹת עוֹבְדִים"]],
    englishDistractors: ["The journalist", "claimed", "that the square", "conceals", "workers' rights"],
    notes: "אנדרטה is a memorial monument; מנציחה means 'commemorates' and agrees with the feminine noun אנדרטה. The primary guide is female; a masculine guide alternative is accepted.",
    hebrewAlternates: [{
      text: "המדריך הסביר שהאנדרטה מנציחה מאבק למען זכויות אזרח.", textNiqqud: "הַמַּדְרִיךְ הִסְבִּיר שֶׁהָאַנְדַּרְטָה מַנְצִיחָה מַאֲבָק לְמַעַן זְכֻיּוֹת אֶזְרָח.",
      tokenPairs: [["המדריך", "הַמַּדְרִיךְ"], ["הסביר", "הִסְבִּיר"], ["שהאנדרטה", "שֶׁהָאַנְדַּרְטָה"], ["מנציחה", "מַנְצִיחָה"], ["מאבק", "מַאֲבָק"], ["למען", "לְמַעַן"], ["זכויות אזרח", "זְכֻיּוֹת אֶזְרָח"]]
    }]
  }),
  buildExpandedSentence({
    id: "everyday_126", emoji: "📍", category: "everyday", difficulty: 1,
    hebrew: "בדקתי איפה הקלפי שלי לפני יום הבחירות.",
    hebrewNiqqud: "בָּדַקְתִּי אֵיפֹה הַקַּלְפִּי שֶׁלִּי לִפְנֵי יוֹם הַבְּחִירוֹת.",
    english: "I checked where my polling station is before election day.",
    hebrewTokenPairs: [["בדקתי", "בָּדַקְתִּי"], ["איפה", "אֵיפֹה"], ["הקלפי שלי", "הַקַּלְפִּי שֶׁלִּי"], ["לפני", "לִפְנֵי"], ["יום הבחירות", "יוֹם הַבְּחִירוֹת"]],
    englishTokens: ["I checked", "where", "my polling station is", "before", "election day"],
    hebrewDistractorPairs: [["שכחתי", "שָׁכַחְתִּי"], ["מתי", "מָתַי"], ["מטה המפלגה", "מַטֵּה הַמִּפְלָגָה"], ["נפתח", "נִפְתָּח"], ["אחרי", "אַחֲרֵי"], ["יום הזיכרון", "יוֹם הַזִּכָּרוֹן"]],
    englishDistractors: ["I forgot", "when", "the party office", "opens", "after", "memorial day"],
    notes: "קלפי can mean the ballot box or, in ordinary election-day speech, the polling station. יום הבחירות is election day."
  }),
  buildExpandedSentence({
    id: "everyday_127", emoji: "🧩", category: "everyday", difficulty: 2,
    hebrew: "אחרי שהממשלה הוקמה ניסינו להבין אילו מפלגות השתייכו לקואליציה ואילו לאופוזיציה.",
    hebrewNiqqud: "אַחֲרֵי שֶׁהַמֶּמְשָׁלָה הוּקְמָה נִיסִּינוּ לְהָבִין אֵילוּ מִפְלָגוֹת הִשְׁתַּיְּכוּ לַקּוֹאָלִיצְיָה וְאֵילוּ לָאוֹפּוֹזִיצְיָה.",
    english: "After the government was formed, we tried to understand which parties belonged to the coalition and which to the opposition.",
    hebrewTokenPairs: [["אחרי", "אַחֲרֵי"], ["שהממשלה", "שֶׁהַמֶּמְשָׁלָה"], ["הוקמה", "הוּקְמָה"], ["ניסינו", "נִיסִּינוּ"], ["להבין", "לְהָבִין"], ["אילו מפלגות", "אֵילוּ מִפְלָגוֹת"], ["השתייכו", "הִשְׁתַּיְּכוּ"], ["לקואליציה", "לַקּוֹאָלִיצְיָה"], ["ואילו", "וְאֵילוּ"], ["לאופוזיציה", "לָאוֹפּוֹזִיצְיָה"]],
    englishTokens: ["After", "the government", "was formed", "we tried", "to understand", "which parties", "belonged", "to the coalition", "and which", "to the opposition"],
    hebrewDistractorPairs: [["לפני", "לִפְנֵי"], ["הסקרים", "הַסְּקָרִים"], ["הצלחנו", "הִצְלַחְנוּ"], ["להחליט", "לְהַחְלִיט"], ["אילו נציגים", "אֵילוּ נְצִיגִים"], ["בוועדה", "בַּוַּעֲדָה"]],
    englishDistractors: ["Before", "the polls", "we managed", "to decide", "which representatives", "were on the committee"],
    notes: "The קואליציה supports and forms the government; the אופוזיציה consists of parties outside it. Both are everyday loanwords in Israeli news."
  }),
  buildExpandedSentence({
    id: "everyday_128", emoji: "⚖️", category: "everyday", difficulty: 2,
    hebrew: "היא הגישה תלונה על אפליה בעבודה וקיבלה ייעוץ משפטי.",
    hebrewNiqqud: "הִיא הִגִּישָׁה תְּלוּנָה עַל אַפְלָיָה בָּעֲבוֹדָה וְקִבְּלָה יִעוּץ מִשְׁפָּטִי.",
    english: "She filed a complaint about discrimination at work and received legal advice.",
    hebrewTokenPairs: [["היא", "הִיא"], ["הגישה", "הִגִּישָׁה"], ["תלונה", "תְּלוּנָה"], ["על אפליה", "עַל אַפְלָיָה"], ["בעבודה", "בָּעֲבוֹדָה"], ["וקיבלה", "וְקִבְּלָה"], ["ייעוץ משפטי", "יִעוּץ מִשְׁפָּטִי"]],
    englishTokens: ["She", "filed", "a complaint", "about discrimination", "at work", "and received", "legal advice"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["ביטל", "בִּטֵּל"], ["בקשה", "בַּקָּשָׁה"], ["על איחור", "עַל אִחוּר"], ["ודחה", "וְדָחָה"], ["סיוע רפואי", "סִיּוּעַ רְפוּאִי"]],
    englishDistractors: ["He", "withdrew", "an application", "about a delay", "and refused", "medical assistance"],
    notes: "להגיש תלונה is the fixed phrase 'to file a complaint.' אפליה is discrimination, and ייעוץ משפטי is legal advice."
  }),
  buildExpandedSentence({
    id: "everyday_129", emoji: "🔎", category: "everyday", difficulty: 3,
    hebrew: "בהפגנה שמעתי אנשים קוראים לוועדת בדיקה שתחקור אלימות משטרתית.",
    hebrewNiqqud: "בַּהַפְגָּנָה שָׁמַעְתִּי אֲנָשִׁים קוֹרְאִים לְוַעֲדַת בְּדִיקָה שֶׁתַּחֲקוֹר אַלִּימוּת מִשְׁטַרְתִּית.",
    english: "At the protest, I heard people calling for a committee to investigate police brutality.",
    hebrewTokenPairs: [["בהפגנה", "בַּהַפְגָּנָה"], ["שמעתי", "שָׁמַעְתִּי"], ["אנשים", "אֲנָשִׁים"], ["קוראים", "קוֹרְאִים"], ["לוועדת בדיקה", "לְוַעֲדַת בְּדִיקָה"], ["שתחקור", "שֶׁתַּחֲקוֹר"], ["אלימות משטרתית", "אַלִּימוּת מִשְׁטַרְתִּית"]],
    englishTokens: ["At the protest", "I heard", "people", "calling", "for a committee", "to investigate", "police brutality"],
    hebrewDistractorPairs: [["בכנס", "בַּכֶּנֶס"], ["ראיתי", "רָאִיתִי"], ["שוטרים", "שׁוֹטְרִים"], ["מסרבים", "מְסָרְבִים"], ["לפרק", "לְפָרֵק"], ["צוות הסברה", "צֶוֶת הַסְבָּרָה"]],
    englishDistractors: ["At the conference", "I saw", "officers", "refusing", "to disband", "an outreach team"],
    notes: "קוראים לוועדת בדיקה means 'call for an inquiry or review committee.' The sentence reports a demand heard at a protest without presenting the allegation as a finding."
  }),
  buildExpandedSentence({
    id: "everyday_130", emoji: "🚌", category: "everyday", difficulty: 2,
    hebrew: "בנסיעה עברנו ליד התנחלות ושמענו הסבר על המחלוקת סביבה.",
    hebrewNiqqud: "בַּנְּסִיעָה עָבַרְנוּ לְיַד הִתְנַחֲלוּת וְשָׁמַעְנוּ הֶסְבֵּר עַל הַמַּחֲלֹקֶת סְבִיבָהּ.",
    english: "During the trip, we passed by a settlement and heard an explanation of the controversy surrounding it.",
    hebrewTokenPairs: [["בנסיעה", "בַּנְּסִיעָה"], ["עברנו ליד", "עָבַרְנוּ לְיַד"], ["התנחלות", "הִתְנַחֲלוּת"], ["ושמענו", "וְשָׁמַעְנוּ"], ["הסבר", "הֶסְבֵּר"], ["על המחלוקת", "עַל הַמַּחֲלֹקֶת"], ["סביבה", "סְבִיבָהּ"]],
    englishTokens: ["During the trip", "we passed by", "a settlement", "and heard", "an explanation", "of the controversy", "surrounding it"],
    hebrewDistractorPairs: [["בטיול הרגלי", "בַּטִּיּוּל הָרַגְלִי"], ["עצרנו", "עָצַרְנוּ"], ["ליד מחסום", "לְיַד מַחְסוֹם"], ["וצילמנו", "וְצִלַּמְנוּ"], ["נאום", "נְאוּם"], ["על ההסכמה לגביו", "עַל הַהַסְכָּמָה לְגַבָּיו"]],
    englishDistractors: ["On the walking tour", "we stopped", "at a checkpoint", "and photographed", "a speech", "about the agreement over it"],
    notes: "התנחלות is the standard word for a settlement in this political context. סביבה, 'around it,' agrees with the feminine noun and makes the referent explicit."
  }),
  buildExpandedSentence({
    id: "everyday_131", emoji: "🎓", category: "everyday", difficulty: 3,
    hebrew: "בשיעור דיברנו על הכיבוש ועל הדרכים השונות שבהן מציגים אותו.",
    hebrewNiqqud: "בַּשִּׁעוּר דִּבַּרְנוּ עַל הַכִּבּוּשׁ וְעַל הַדְּרָכִים הַשּׁוֹנוֹת שֶׁבָּהֶן מַצִּיגִים אוֹתוֹ.",
    english: "In class we discussed the occupation and the different ways in which it is portrayed.",
    hebrewTokenPairs: [["בשיעור", "בַּשִּׁעוּר"], ["דיברנו", "דִּבַּרְנוּ"], ["על הכיבוש", "עַל הַכִּבּוּשׁ"], ["ועל", "וְעַל"], ["הדרכים", "הַדְּרָכִים"], ["השונות", "הַשּׁוֹנוֹת"], ["שבהן", "שֶׁבָּהֶן"], ["מציגים אותו", "מַצִּיגִים אוֹתוֹ"]],
    englishTokens: ["In class", "we discussed", "the occupation", "and", "the different", "ways", "in which", "it is portrayed"],
    hebrewDistractorPairs: [["בהפסקה", "בַּהַפְסָקָה"], ["קראנו", "קָרָאנוּ"], ["על הסיפוח", "עַל הַסִּפּוּחַ"], ["ועל גישה", "וְעַל גִּישָׁה"], ["שדרכה", "שֶׁדַּרְכָּהּ"], ["מסתירים אותו", "מַסְתִּירִים אוֹתוֹ"]],
    englishDistractors: ["During the break", "we read about", "annexation", "and an approach", "through which", "it is concealed"],
    notes: "הכיבוש is 'the occupation.' דרכים שונות שבהן מציגים אותו teaches the feminine plural connector שבהן and explicitly refers back with אותו."
  }),
  buildExpandedSentence({
    id: "everyday_132", emoji: "🏳️‍🌈", category: "everyday", difficulty: 2,
    hebrew: "המרכז הקהילתי מציע ייעוץ לנוער להט״בי ולמשפחות.",
    hebrewNiqqud: "הַמֶּרְכָּז הַקְּהִלָּתִי מַצִּיעַ יִעוּץ לְנוֹעַר לַהַטָ״בִי וְלַמִּשְׁפָּחוֹת.",
    english: "The community center offers counseling to LGBTQ youth and families.",
    hebrewTokenPairs: [["המרכז הקהילתי", "הַמֶּרְכָּז הַקְּהִלָּתִי"], ["מציע", "מַצִּיעַ"], ["ייעוץ", "יִעוּץ"], ["לנוער להט״בי", "לְנוֹעַר לַהַטָ״בִי"], ["ולמשפחות", "וְלַמִּשְׁפָּחוֹת"]],
    englishTokens: ["The community center", "offers", "counseling", "to LGBTQ youth", "and families"],
    hebrewDistractorPairs: [["בית הספר", "בֵּית הַסֵּפֶר"], ["מבקש", "מְבַקֵּשׁ"], ["תרומות", "תְּרוּמוֹת"], ["מפעילים", "מִפְּעִילִים"], ["ולמורים", "וְלַמּוֹרִים"]],
    englishDistractors: ["The school", "requests", "donations", "from activists", "and teachers"],
    notes: "להט״ב is the Hebrew abbreviation for lesbian, gay, transgender, and bisexual; להט״בי is its adjectival form. נוער is grammatically masculine singular."
  }),
  buildExpandedSentence({
    id: "everyday_133", emoji: "🛂", category: "everyday", difficulty: 2,
    hebrew: "העולה החדשה ביקשה הסבר פשוט על זכויות ההצבעה שלה.",
    hebrewNiqqud: "הָעוֹלָה הַחֲדָשָׁה בִּקְּשָׁה הֶסְבֵּר פָּשׁוּט עַל זְכֻיּוֹת הַהַצְבָּעָה שֶׁלָּהּ.",
    english: "The new immigrant asked for a simple explanation of her voting rights.",
    hebrewTokenPairs: [["העולה החדשה", "הָעוֹלָה הַחֲדָשָׁה"], ["ביקשה", "בִּקְּשָׁה"], ["הסבר", "הֶסְבֵּר"], ["פשוט", "פָּשׁוּט"], ["על", "עַל"], ["זכויות ההצבעה שלה", "זְכֻיּוֹת הַהַצְבָּעָה שֶׁלָּהּ"]],
    englishTokens: ["The new immigrant", "asked for", "a simple", "explanation", "of", "her voting rights"],
    hebrewDistractorPairs: [["התושבת הוותיקה", "הַתּוֹשֶׁבֶת הַוָּתִיקָה"], ["נתנה", "נָתְנָה"], ["טופס", "טֹפֶס"], ["מפורט", "מְפֹרָט"], ["לגבי", "לְגַבֵּי"], ["חובות המס שלה", "חוֹבוֹת הַמַּס שֶׁלָּהּ"]],
    englishDistractors: ["The longtime resident", "provided", "a detailed", "form", "regarding", "her tax obligations"],
    notes: "עולה חדשה is a female new immigrant; the masculine is עולה חדש. זכויות הצבעה are voting rights, with שלה explicitly marking 'her.'"
  }),
  buildExpandedSentence({
    id: "everyday_134", emoji: "🔑", category: "everyday", difficulty: 1,
    hebrew: "הזוג הצעיר חיפש דירה זולה יותר מחוץ לתל אביב.",
    hebrewNiqqud: "הַזּוּג הַצָּעִיר חִפֵּשׂ דִּירָה זוֹלָה יוֹתֵר מִחוּץ לְתֵל אָבִיב.",
    english: "The young couple looked for a cheaper apartment outside Tel Aviv.",
    hebrewTokenPairs: [["הזוג", "הַזּוּג"], ["הצעיר", "הַצָּעִיר"], ["חיפש", "חִפֵּשׂ"], ["דירה", "דִּירָה"], ["זולה יותר", "זוֹלָה יוֹתֵר"], ["מחוץ", "מִחוּץ"], ["לתל אביב", "לְתֵל אָבִיב"]],
    englishTokens: ["The young", "couple", "looked for", "a cheaper", "apartment", "outside", "Tel Aviv"],
    hebrewDistractorPairs: [["השותף", "הַשּׁוּתָף"], ["הוותיק", "הַוָּתִיק"], ["מצא", "מָצָא"], ["משרד", "מִשְׂרָד"], ["יקר יותר", "יָקָר יוֹתֵר"], ["בירושלים", "בִּירוּשָׁלַיִם"]],
    englishDistractors: ["The longtime", "roommate", "found", "a more expensive", "office", "in Jerusalem"],
    notes: "זוג is grammatically masculine singular regardless of the partners' genders, so חיפש agrees with זוג. מחוץ ל־ means 'outside of.'"
  }),
  buildExpandedSentence({
    id: "everyday_135", emoji: "💍", category: "everyday", difficulty: 2,
    hebrew: "שאלנו למה זוגות מסוימים בוחרים בנישואים אזרחיים בחו״ל.",
    hebrewNiqqud: "שָׁאַלְנוּ לָמָּה זוּגוֹת מְסֻיָּמִים בּוֹחֲרִים בְּנִישּׂוּאִים אֶזְרָחִיִּים בְּחוּ״ל.",
    english: "We asked why some couples opt for a civil marriage abroad.",
    hebrewTokenPairs: [["שאלנו", "שָׁאַלְנוּ"], ["למה", "לָמָּה"], ["זוגות מסוימים", "זוּגוֹת מְסֻיָּמִים"], ["בוחרים", "בּוֹחֲרִים"], ["בנישואים אזרחיים", "בְּנִישּׂוּאִים אֶזְרָחִיִּים"], ["בחו״ל", "בְּחוּ״ל"]],
    englishTokens: ["We asked", "why", "some couples", "opt for", "a civil marriage", "abroad"],
    hebrewDistractorPairs: [["הן", "הֵן"], ["הסבירו", "הִסְבִּירוּ"], ["מתי", "מָתַי"], ["יחידים", "יְחִידִים"], ["נמנעים", "נִמְנָעִים"], ["מטקס", "מִטֶּקֶס"]],
    englishDistractors: ["They", "explained", "when", "individuals", "avoid", "a ceremony"],
    notes: "נישואים אזרחיים means civil marriage, a central term in religion-and-state discussions. בחו״ל is the ubiquitous abbreviation for 'abroad.'"
  }),
  buildExpandedSentence({
    id: "everyday_136", emoji: "🎧", category: "everyday", difficulty: 3,
    hebrew: "בפודקאסט דיברו על התנקשות בדמות ציבורית ועל ההשלכות הפוליטיות שלה.",
    hebrewNiqqud: "בַּפּוֹדְקָאסְט דִּבְּרוּ עַל הִתְנַקְּשׁוּת בִּדְמוּת צִבּוּרִית וְעַל הַהַשְׁלָכוֹת הַפּוֹלִיטִיּוֹת שֶׁלָּהּ.",
    english: "On the podcast, they discussed the assassination of a public figure and its political consequences.",
    hebrewTokenPairs: [["בפודקאסט", "בַּפּוֹדְקָאסְט"], ["דיברו", "דִּבְּרוּ"], ["על התנקשות", "עַל הִתְנַקְּשׁוּת"], ["בדמות ציבורית", "בִּדְמוּת צִבּוּרִית"], ["ועל", "וְעַל"], ["ההשלכות", "הַהַשְׁלָכוֹת"], ["הפוליטיות שלה", "הַפּוֹלִיטִיּוֹת שֶׁלָּהּ"]],
    englishTokens: ["On the podcast", "they discussed", "the assassination", "of a public figure", "and", "its political", "consequences"],
    hebrewDistractorPairs: [["במהדורה", "בַּמַּהֲדוּרָה"], ["טענו", "טָעֲנוּ"], ["שמחאה", "שֶׁמְּחָאָה"], ["היא", "הִיא"], ["מקרית", "מִקְרִית"], ["וחסרת השפעה", "וַחֲסַרַת הַשְׁפָּעָה"]],
    englishDistractors: ["On the broadcast", "they claimed", "that a protest", "was", "accidental", "and inconsequential"],
    notes: "התנקשות can refer to an assassination or an assassination attempt, usually involving a public figure; the verb is להתנקש ב־. The sentence keeps the reference abstract and non-graphic."
  }),
  buildExpandedSentence({
    id: "professional_73", emoji: "🏗️", category: "professional", difficulty: 3,
    hebrew: "הרשות המקומית פרסמה תוכנית להגדלת מלאי הדיור בר־השגה.",
    hebrewNiqqud: "הָרָשׁוּת הַמְּקוֹמִית פִּרְסְמָה תָּכְנִית לְהַגְדָּלַת מְלַאי הַדִּיּוּר בַּר־הַשָּׂגָה.",
    english: "The local authority published a plan to increase the stock of affordable housing.",
    hebrewTokenPairs: [["הרשות המקומית", "הָרָשׁוּת הַמְּקוֹמִית"], ["פרסמה", "פִּרְסְמָה"], ["תוכנית", "תָּכְנִית"], ["להגדלת", "לְהַגְדָּלַת"], ["מלאי", "מְלַאי"], ["הדיור בר־השגה", "הַדִּיּוּר בַּר־הַשָּׂגָה"]],
    englishTokens: ["The local authority", "published", "a plan", "to increase", "the stock", "of affordable housing"],
    hebrewDistractorPairs: [["הממשלה המרכזית", "הַמֶּמְשָׁלָה הַמֶּרְכָּזִית"], ["גנזה", "גָּנְזָה"], ["הודעה", "הוֹדָעָה"], ["לצמצום", "לְצִמְצוּם"], ["המחסור", "הַמַּחְסוֹר"], ["בשטחי מסחר", "בְּשִׁטְחֵי מִסְחָר"]],
    englishDistractors: ["The central government", "shelved", "a notice", "to reduce", "the shortage", "of commercial space"],
    notes: "דיור בר־השגה is the policy term 'affordable housing.' מלאי, literally inventory or stock, is common in planning and economic writing."
  }),
  buildExpandedSentence({
    id: "professional_74", emoji: "✍️", category: "professional", difficulty: 3,
    hebrew: "העורכת ביקשה שנציין אם המקור משתמש במילה כיבוש או במונח שליטה צבאית.",
    hebrewNiqqud: "הָעוֹרֶכֶת בִּקְּשָׁה שֶׁנְּצַיֵּן אִם הַמָּקוֹר מִשְׁתַּמֵּשׁ בַּמִּלָּה כִּבּוּשׁ אוֹ בַּמּוּנָח שְׁלִיטָה צְבָאִית.",
    english: "The editor asked us to note whether the source uses the word occupation or the term military control.",
    hebrewTokenPairs: [["העורכת", "הָעוֹרֶכֶת"], ["ביקשה", "בִּקְּשָׁה"], ["שנציין", "שֶׁנְּצַיֵּן"], ["אם המקור", "אִם הַמָּקוֹר"], ["משתמש", "מִשְׁתַּמֵּשׁ"], ["במילה", "בַּמִּלָּה"], ["כיבוש", "כִּבּוּשׁ"], ["או", "אוֹ"], ["במונח", "בַּמּוּנָח"], ["שליטה צבאית", "שְׁלִיטָה צְבָאִית"]],
    englishTokens: ["The editor", "asked us", "to note", "whether the source", "uses", "the word", "occupation", "or", "the term", "military control"],
    hebrewDistractorPairs: [["הכתבת", "הַכַּתֶּבֶת"], ["השמיטה", "הִשְׁמִיטָה"], ["כינוי", "כִּנּוּי"], ["סיפוח", "סִפּוּחַ"], ["ואת הביטוי", "וְאֶת הַבִּטּוּי"], ["ממשל אזרחי", "מִמְשָׁל אֶזְרָחִי"]],
    englishDistractors: ["The reporter", "omitted", "a label", "annexation", "and the phrase", "civilian government"],
    notes: "Professional editing often attributes loaded wording to its source. מילה is an ordinary word; מונח is a defined term, a useful register distinction."
  }),
  buildExpandedSentence({
    id: "professional_75", emoji: "📄", category: "professional", difficulty: 3,
    hebrew: "הצוות המשפטי הכין עתירה נגד מדיניות שלפי הטענה מפלה קבוצות מסוימות.",
    hebrewNiqqud: "הַצֶּוֶת הַמִּשְׁפָּטִי הֵכִין עֲתִירָה נֶגֶד מְדִינִיּוּת שֶׁלְּפִי הַטַּעֲנָה מַפְלָה קְבוּצוֹת מְסֻיָּמוֹת.",
    english: "The legal team prepared a petition against a policy alleged to discriminate against certain groups.",
    hebrewTokenPairs: [["הצוות המשפטי", "הַצֶּוֶת הַמִּשְׁפָּטִי"], ["הכין", "הֵכִין"], ["עתירה", "עֲתִירָה"], ["נגד מדיניות", "נֶגֶד מְדִינִיּוּת"], ["שלפי הטענה", "שֶׁלְּפִי הַטַּעֲנָה"], ["מפלה", "מַפְלָה"], ["קבוצות", "קְבוּצוֹת"], ["מסוימות", "מְסֻיָּמוֹת"]],
    englishTokens: ["The legal team", "prepared", "a petition", "against a policy", "alleged to", "discriminate against", "certain", "groups"],
    hebrewDistractorPairs: [["הצוות הכלכלי", "הַצֶּוֶת הַכַּלְכָּלִי"], ["דחה", "דָּחָה"], ["חוזה", "חוֹזֶה"], ["תקנה", "תַּקָּנָה"], ["מחקר", "מֶחְקָר"], ["ארגונים", "אִרְגּוּנִים"]],
    englishDistractors: ["The economic team", "rejected", "a contract", "a regulation", "research", "organizations"],
    notes: "עתירה is a legal petition, often to a court. שלפי הטענה ('which, according to the allegation') preserves the distinction between an allegation and a finding."
  }),
  buildExpandedSentence({
    id: "professional_76", emoji: "🗂️", category: "professional", difficulty: 3,
    hebrew: "הארגון תיעד טענות לאלימות משטרתית והעביר את הממצאים לבדיקה עצמאית.",
    hebrewNiqqud: "הָאִרְגּוּן תִּעֵד טַעֲנוֹת לְאַלִּימוּת מִשְׁטַרְתִּית וְהֶעֱבִיר אֶת הַמִּמְצָאִים לִבְדִיקָה עַצְמָאִית.",
    english: "The organization documented allegations of police brutality and submitted the findings for independent review.",
    hebrewTokenPairs: [["הארגון", "הָאִרְגּוּן"], ["תיעד", "תִּעֵד"], ["טענות", "טַעֲנוֹת"], ["לאלימות משטרתית", "לְאַלִּימוּת מִשְׁטַרְתִּית"], ["והעביר", "וְהֶעֱבִיר"], ["את הממצאים", "אֶת הַמִּמְצָאִים"], ["לבדיקה עצמאית", "לִבְדִיקָה עַצְמָאִית"]],
    englishTokens: ["The organization", "documented", "allegations", "of police brutality", "and submitted", "the findings", "for independent review"],
    hebrewDistractorPairs: [["המשרד", "הַמִּשְׂרָד"], ["הכחיש", "הִכְחִישׁ"], ["דיווחים", "דִּוּוּחִים"], ["על הפרות משמעת", "עַל הֲפָרוֹת מִשְׁמַעַת"], ["וגנז", "וְגָנַז"], ["את ההמלצות", "אֶת הַהַמְלָצוֹת"]],
    englishDistractors: ["The ministry", "denied", "reports", "of disciplinary violations", "and shelved", "the recommendations"],
    notes: "תיעד means documented; ממצאים are findings. The noun טענות marks the reports as allegations pending the independent review described here."
  }),
  buildExpandedSentence({
    id: "professional_77", emoji: "🤝", category: "professional", difficulty: 2,
    hebrew: "מדיניות הקבלה לעבודה אוסרת אפליה על רקע נטייה מינית או זהות מגדרית.",
    hebrewNiqqud: "מְדִינִיּוּת הַקַּבָּלָה לַעֲבוֹדָה אוֹסֶרֶת אַפְלָיָה עַל רֶקַע נְטִיָּה מִינִית אוֹ זֶהוּת מִגְדָּרִית.",
    english: "The hiring policy prohibits discrimination based on sexual orientation or gender identity.",
    hebrewTokenPairs: [["מדיניות הקבלה לעבודה", "מְדִינִיּוּת הַקַּבָּלָה לַעֲבוֹדָה"], ["אוסרת", "אוֹסֶרֶת"], ["אפליה", "אַפְלָיָה"], ["על רקע", "עַל רֶקַע"], ["נטייה מינית", "נְטִיָּה מִינִית"], ["או", "אוֹ"], ["זהות מגדרית", "זֶהוּת מִגְדָּרִית"]],
    englishTokens: ["The hiring policy", "prohibits", "discrimination", "based on", "sexual orientation", "or", "gender identity"],
    hebrewDistractorPairs: [["נוהל הקידום", "נֹהַל הַקִּדּוּם"], ["מאפשר", "מְאַפְשֵׁר"], ["העדפה", "הַעֲדָפָה"], ["בלי קשר ל", "בְּלִי קֶשֶׁר לְ"], ["מצב משפחתי", "מַצָּב מִשְׁפַּחְתִּי"], ["מקום מגורים", "מְקוֹם מְגוּרִים"]],
    englishDistractors: ["The promotion procedure", "allows", "preference", "regardless of", "marital status", "place of residence"],
    notes: "על רקע means 'on the basis of' in anti-discrimination language. נטייה מינית and זהות מגדרית are the standard professional terms for sexual orientation and gender identity."
  }),
  buildExpandedSentence({
    id: "professional_78", emoji: "📊", category: "professional", difficulty: 2,
    hebrew: "לפי הסקר, אף גוש אינו יכול להשיג רוב בלי תמיכת מפלגות המרכז.",
    hebrewNiqqud: "לְפִי הַסֶּקֶר, אַף גּוּשׁ אֵינוֹ יָכוֹל לְהַשִּׂיג רֹב בְּלִי תְּמִיכַת מִפְלְגוֹת הַמֶּרְכָּז.",
    english: "According to the poll, no bloc can secure a majority without support from the centrist parties.",
    hebrewTokenPairs: [["לפי הסקר", "לְפִי הַסֶּקֶר"], ["אף גוש", "אַף גּוּשׁ"], ["אינו יכול להשיג", "אֵינוֹ יָכוֹל לְהַשִּׂיג"], ["רוב", "רֹב"], ["בלי תמיכת", "בְּלִי תְּמִיכַת"], ["מפלגות המרכז", "מִפְלְגוֹת הַמֶּרְכָּז"]],
    englishTokens: ["According to the poll", "no bloc", "can secure", "a majority", "without support from", "the centrist parties"],
    hebrewDistractorPairs: [["לפי המדגם", "לְפִי הַמִּדְגָּם"], ["כל מחנה", "כָּל מַחֲנֶה"], ["מבטיח", "מַבְטִיחַ"], ["מיעוט", "מִעוּט"], ["בעזרת קולות", "בְּעֶזְרַת קוֹלוֹת"], ["של הרשימות המקומיות", "שֶׁל הָרְשִׁימוֹת הַמְּקוֹמִיּוֹת"]],
    englishDistractors: ["According to the sample", "every camp", "promises", "a minority", "with votes", "from local lists"],
    notes: "גוש is a political bloc, and רוב is a majority. אינו יכול is a more professional written alternative to לא יכול."
  }),
  buildExpandedSentence({
    id: "professional_79", emoji: "💼", category: "professional", difficulty: 2,
    hebrew: "ניתוח התקציב בוחן את השפעת המסים על מעמד הביניים ועל צעירים עובדים.",
    hebrewNiqqud: "נִתּוּחַ הַתַּקְצִיב בּוֹחֵן אֶת הַשְּׁפָּעַת הַמִּסִּים עַל מַעֲמַד הַבֵּינַיִם וְעַל צְעִירִים עוֹבְדִים.",
    english: "The budget analysis examines the effect of taxes on the middle class and young workers.",
    hebrewTokenPairs: [["ניתוח התקציב", "נִתּוּחַ הַתַּקְצִיב"], ["בוחן", "בּוֹחֵן"], ["את השפעת", "אֶת הַשְּׁפָּעַת"], ["המסים", "הַמִּסִּים"], ["על מעמד הביניים", "עַל מַעֲמַד הַבֵּינַיִם"], ["ועל צעירים", "וְעַל צְעִירִים"], ["עובדים", "עוֹבְדִים"]],
    englishTokens: ["The budget analysis", "examines", "the effect of", "taxes", "on the middle class", "and young", "workers"],
    hebrewDistractorPairs: [["סיכום הישיבה", "סִכּוּם הַיְּשִׁיבָה"], ["מתעלם", "מִתְעַלֵּם"], ["מהשפעת", "מֵהַשְּׁפָּעַת"], ["הסובסידיות", "הַסּוּבְּסִידְיוֹת"], ["על בעלי הון", "עַל בַּעֲלֵי הוֹן"], ["ועל גמלאים עצמאיים", "וְעַל גִּמְלָאִים עַצְמָאִים"]],
    englishDistractors: ["The meeting summary", "ignores", "the impact of", "subsidies", "on wealthy owners", "and self-employed retirees"],
    notes: "השפעת המסים is the construct phrase 'the effect of taxes.' צעירים עובדים means working young adults, a frequent policy demographic."
  }),
  buildExpandedSentence({
    id: "professional_80", emoji: "🗺️", category: "professional", difficulty: 3,
    hebrew: "בדוח חשוב להבחין בין התנחלות, מאחז ושכונה מעבר לקו הירוק.",
    hebrewNiqqud: "בַּדּוּחַ חָשׁוּב לְהַבְחִין בֵּין הִתְנַחֲלוּת, מַאֲחָז וּשְׁכוּנָה מֵעֵבֶר לַקַּו הַיָּרֹק.",
    english: "In the report, it is important to distinguish among a settlement, an outpost, and a neighborhood beyond the Green Line.",
    hebrewTokenPairs: [["בדוח", "בַּדּוּחַ"], ["חשוב", "חָשׁוּב"], ["להבחין בין", "לְהַבְחִין בֵּין"], ["התנחלות", "הִתְנַחֲלוּת"], ["מאחז", "מַאֲחָז"], ["ושכונה", "וּשְׁכוּנָה"], ["מעבר לקו הירוק", "מֵעֵבֶר לַקַּו הַיָּרֹק"]],
    englishTokens: ["In the report", "it is important", "to distinguish among", "a settlement", "an outpost", "and a neighborhood", "beyond the Green Line"],
    hebrewDistractorPairs: [["במצגת", "בַּמַּצֶּגֶת"], ["מיותר", "מְיֻתָּר"], ["לשלב", "לְשַׁלֵּב"], ["בין כפר", "בֵּין כְּפָר"], ["בסיס", "בָּסִיס"], ["ובתוך תחומי העיר", "וּבְתוֹךְ תְּחוּמֵי הָעִיר"]],
    englishDistractors: ["In the presentation", "it is unnecessary", "to combine", "a village", "a base", "within city limits"],
    notes: "התנחלות is settlement; מאחז is outpost. מעבר לקו הירוק ('beyond the Green Line') is geographic-political terminology, and the sentence teaches careful category distinctions."
  }),
  buildExpandedSentence({
    id: "professional_81", emoji: "✅", category: "professional", difficulty: 3,
    hebrew: "צוות המעקב אימת דיווחים על אלימות מתנחלים לפני פרסום הנתונים.",
    hebrewNiqqud: "צֶוֶת הַמַּעֲקָב אִמֵּת דִּוּוּחִים עַל אַלִּימוּת מִתְנַחֲלִים לִפְנֵי פִּרְסוּם הַנְּתוּנִים.",
    english: "The monitoring team verified reports of settler violence before publishing the data.",
    hebrewTokenPairs: [["צוות המעקב", "צֶוֶת הַמַּעֲקָב"], ["אימת", "אִמֵּת"], ["דיווחים", "דִּוּוּחִים"], ["על אלימות מתנחלים", "עַל אַלִּימוּת מִתְנַחֲלִים"], ["לפני", "לִפְנֵי"], ["פרסום", "פִּרְסוּם"], ["הנתונים", "הַנְּתוּנִים"]],
    englishTokens: ["The monitoring team", "verified", "reports", "of settler violence", "before", "publishing", "the data"],
    hebrewDistractorPairs: [["צוות המחקר", "צֶוֶת הַמֶּחְקָר"], ["אסף", "אָסַף"], ["שמועות", "שְׁמוּעוֹת"], ["על מחאה", "עַל מְחָאָה"], ["ואז", "וְאָז"], ["סיים", "סִיֵּם"]],
    englishDistractors: ["The research team", "collected", "rumors", "about a protest", "then", "finished"],
    notes: "אימת means verified or corroborated, not merely collected. The sequence emphasizes professional verification before publishing politically sensitive reports."
  }),
  buildExpandedSentence({
    id: "professional_82", emoji: "⚖️", category: "professional", difficulty: 3,
    hebrew: "החוקרים חלוקים בשאלת היקף הסמכויות של המנהל האזרחי במסגרת הכיבוש.",
    hebrewNiqqud: "הַחוֹקְרִים חֲלוּקִים בִּשְׁאֵלַת הֶקֵּף הַסַּמְכֻיּוֹת שֶׁל הַמִּנְהָל הָאֶזְרָחִי בְּמִסְגֶּרֶת הַכִּבּוּשׁ.",
    english: "The researchers disagree over the scope of the powers of the Civil Administration under the occupation.",
    hebrewTokenPairs: [["החוקרים", "הַחוֹקְרִים"], ["חלוקים", "חֲלוּקִים"], ["בשאלת", "בִּשְׁאֵלַת"], ["היקף", "הֶקֵּף"], ["הסמכויות", "הַסַּמְכֻיּוֹת"], ["של המנהל האזרחי", "שֶׁל הַמִּנְהָל הָאֶזְרָחִי"], ["במסגרת", "בְּמִסְגֶּרֶת"], ["הכיבוש", "הַכִּבּוּשׁ"]],
    englishTokens: ["The researchers", "disagree", "over", "the scope", "of the powers", "of the Civil Administration", "under", "the occupation"],
    hebrewDistractorPairs: [["היועצים", "הַיּוֹעֲצִים"], ["מסכימים", "מַסְכִּימִים"], ["לגבי", "לְגַבֵּי"], ["תחום", "תְּחוּם"], ["תפקידיה", "תַּפְקִידֶיהָ"], ["של הרשות המקומית", "שֶׁל הָרָשׁוּת הַמְּקוֹמִית"]],
    englishDistractors: ["The advisers", "agree", "regarding", "the field", "of the duties", "of local government"],
    notes: "חלוקים בשאלה is a professional way to say 'disagree over the question.' המנהל האזרחי is the formal name Civil Administration in this context."
  }),
  buildExpandedSentence({
    id: "professional_83", emoji: "🧭", category: "professional", difficulty: 2,
    hebrew: "התוכנית מסייעת לעולים להכיר את שוק העבודה ואת מוסדות השלטון.",
    hebrewNiqqud: "הַתָּכְנִית מְסַיַּעַת לָעוֹלִים לְהַכִּיר אֶת שׁוּק הָעֲבוֹדָה וְאֶת מוֹסְדוֹת הַשִּׁלְטוֹן.",
    english: "The program helps immigrants learn about the labor market and government institutions.",
    hebrewTokenPairs: [["התוכנית", "הַתָּכְנִית"], ["מסייעת", "מְסַיַּעַת"], ["לעולים", "לָעוֹלִים"], ["להכיר", "לְהַכִּיר"], ["את שוק העבודה", "אֶת שׁוּק הָעֲבוֹדָה"], ["ואת מוסדות השלטון", "וְאֶת מוֹסְדוֹת הַשִּׁלְטוֹן"]],
    englishTokens: ["The program", "helps", "immigrants", "learn about", "the labor market", "and government institutions"],
    hebrewDistractorPairs: [["הסדנה", "הַסַּדְנָה"], ["מקשה", "מַקְשָׁה"], ["על תיירים", "עַל תַּיָּרִים"], ["לשכוח", "לִשְׁכֹּחַ"], ["את מערכת החינוך", "אֶת מַעֲרֶכֶת הַחִנּוּךְ"], ["ואת ארגוני העובדים", "וְאֶת אִרְגּוּנֵי הָעוֹבְדִים"]],
    englishDistractors: ["The workshop", "makes it harder", "for tourists", "to forget", "the education system", "and labor organizations"],
    notes: "Here עולים means immigrants who made aliyah. להכיר can mean to become familiar with, not only to meet a person; מוסדות השלטון are institutions of government."
  }),
  buildExpandedSentence({
    id: "professional_84", emoji: "🤝", category: "professional", difficulty: 3,
    hebrew: "המשא ומתן הקואליציוני עוסק בגיוס, בתחבורה ציבורית בשבת ובנישואים אזרחיים.",
    hebrewNiqqud: "הַמַּשָּׂא וּמַתָּן הַקּוֹאָלִיצְיוֹנִי עוֹסֵק בְּגִיּוּס, בִּתְחָבוּרָה צִבּוּרִית בְּשַׁבָּת וּבְנִשּׂוּאִים אֶזְרָחִיִּים.",
    english: "The coalition negotiations cover conscription, public transportation on Shabbat, and civil marriage.",
    hebrewTokenPairs: [["המשא ומתן הקואליציוני", "הַמַּשָּׂא וּמַתָּן הַקּוֹאָלִיצְיוֹנִי"], ["עוסק", "עוֹסֵק"], ["בגיוס", "בְּגִיּוּס"], ["בתחבורה ציבורית", "בִּתְחָבוּרָה צִבּוּרִית"], ["בשבת", "בְּשַׁבָּת"], ["ובנישואים אזרחיים", "וּבְנִשּׂוּאִים אֶזְרָחִיִּים"]],
    englishTokens: ["The coalition negotiations", "cover", "conscription", "public transportation", "on Shabbat", "and civil marriage"],
    hebrewDistractorPairs: [["הדיון", "הַדִּיּוּן"], ["מתעלם", "מִתְעַלֵּם"], ["מחינוך", "מֵחִנּוּךְ"], ["ממסחר", "מִמִּסְחָר"], ["ביום ראשון", "בְּיוֹם רִאשׁוֹן"], ["ומטקסים", "וּמִטְּקָסִים"]],
    englishDistractors: ["The discussion", "ignores", "education", "commerce", "on Sunday", "and ceremonies"],
    notes: "משא ומתן קואליציוני is coalition negotiation. גיוס, Shabbat transportation, and civil marriage are recurring religion-and-state bargaining topics."
  }),
  buildExpandedSentence({
    id: "formal_64", emoji: "🏛️", category: "formal", difficulty: 3,
    hebrew: "לאחר פרישת הסיעה, הממשלה תידרש להוכיח כי עומד לרשותה רוב בכנסת.",
    hebrewNiqqud: "לְאַחַר פְּרִישַׁת הַסִּיעָה, הַמֶּמְשָׁלָה תִּדָּרֵשׁ לְהוֹכִיחַ כִּי עוֹמֵד לִרְשׁוּתָהּ רֹב בַּכְּנֶסֶת.",
    english: "Following the faction's withdrawal, the government will be required to prove that it commands a majority in the Knesset.",
    hebrewTokenPairs: [["לאחר", "לְאַחַר"], ["פרישת", "פְּרִישַׁת"], ["הסיעה", "הַסִּיעָה"], ["הממשלה", "הַמֶּמְשָׁלָה"], ["תידרש", "תִּדָּרֵשׁ"], ["להוכיח", "לְהוֹכִיחַ"], ["כי", "כִּי"], ["עומד לרשותה", "עוֹמֵד לִרְשׁוּתָהּ"], ["רוב", "רֹב"], ["בכנסת", "בַּכְּנֶסֶת"]],
    englishTokens: ["Following", "the faction's", "withdrawal", "the government", "will be required", "to prove", "that", "it commands", "a majority", "in the Knesset"],
    hebrewDistractorPairs: [["לפני", "לִפְנֵי"], ["הצטרפות", "הִצְטָרְפוּת"], ["המפלגה", "הַמִּפְלָגָה"], ["הוועדה", "הַוַּעֲדָה"], ["תוכל", "תּוּכַל"], ["להניח", "לְהַנִּיחַ"]],
    englishDistractors: ["Before", "the party", "joined", "the committee", "will be able", "to assume"],
    notes: "סיעה is a parliamentary faction. עומד לרשותה literally means 'stands at its disposal' and is a formal way to say the government commands a majority."
  }),
  buildExpandedSentence({
    id: "formal_65", emoji: "📜", category: "formal", difficulty: 2,
    hebrew: "הצעת החוק מטעם האופוזיציה הועברה לדיון בוועדה לאחר שאושרה בקריאה טרומית.",
    hebrewNiqqud: "הַצָּעַת הַחֹק מִטַּעַם הָאוֹפּוֹזִיצְיָה הוּעֲבְרָה לְדִיּוּן בַּוַּעֲדָה לְאַחַר שֶׁאֻשְּׁרָה בִּקְרִיאָה טְרוֹמִית.",
    english: "The bill from the opposition was referred to a committee after it passed a preliminary reading.",
    hebrewTokenPairs: [["הצעת החוק", "הַצָּעַת הַחֹק"], ["מטעם האופוזיציה", "מִטַּעַם הָאוֹפּוֹזִיצְיָה"], ["הועברה", "הוּעֲבְרָה"], ["לדיון בוועדה", "לְדִיּוּן בַּוַּעֲדָה"], ["לאחר שאושרה", "לְאַחַר שֶׁאֻשְּׁרָה"], ["בקריאה טרומית", "בִּקְרִיאָה טְרוֹמִית"]],
    englishTokens: ["The bill", "from the opposition", "was referred", "to a committee", "after it passed", "a preliminary reading"],
    hebrewDistractorPairs: [["החלטת הממשלה", "הַחְלָטַת הַמֶּמְשָׁלָה"], ["מטעם הקואליציה", "מִטַּעַם הַקּוֹאָלִיצְיָה"], ["נדחתה", "נִדְחֲתָה"], ["להצבעה סופית", "לְהַצְבָּעָה סוֹפִית"], ["במליאה", "בַּמְּלִיאָה"]],
    englishDistractors: ["The government decision", "from the coalition", "was rejected", "for a final vote", "in the plenary"],
    notes: "מטעם means 'sponsored by' or 'on behalf of.' A bill that passes קריאה טרומית, its preliminary reading, is referred to a committee before its first reading; מליאה is the Knesset plenary."
  }),
  buildExpandedSentence({
    id: "formal_66", emoji: "⚖️", category: "formal", difficulty: 3,
    hebrew: "בית המשפט העליון יבחן אם התיקון עולה בקנה אחד עם חוקי היסוד.",
    hebrewNiqqud: "בֵּית הַמִּשְׁפָּט הָעֶלְיוֹן יִבְחַן אִם הַתִּקּוּן עוֹלֶה בְּקָנֶה אֶחָד עִם חֻקֵּי הַיְסוֹד.",
    english: "The Supreme Court will examine whether the amendment is consistent with the Basic Laws.",
    hebrewTokenPairs: [["בית המשפט העליון", "בֵּית הַמִּשְׁפָּט הָעֶלְיוֹן"], ["יבחן", "יִבְחַן"], ["אם התיקון", "אִם הַתִּקּוּן"], ["עולה בקנה אחד", "עוֹלֶה בְּקָנֶה אֶחָד"], ["עם חוקי היסוד", "עִם חֻקֵּי הַיְסוֹד"]],
    englishTokens: ["The Supreme Court", "will examine", "whether the amendment", "is consistent", "with the Basic Laws"],
    hebrewDistractorPairs: [["בית הדין האזורי", "בֵּית הַדִּין הָאֵזוֹרִי"], ["יקבע", "יִקְבַּע"], ["כי התקנה", "כִּי הַתַּקָּנָה"], ["סותרת לחלוטין", "סוֹתֶרֶת לַחֲלוּטִין"], ["את חוקי העזר", "אֶת חֻקֵּי הָעֵזֶר"]],
    englishDistractors: ["The regional tribunal", "will determine", "that the regulation", "fully contradicts", "the municipal bylaws"],
    notes: "עולה בקנה אחד עם is the formal idiom 'is consistent with.' חוקי היסוד are Israel's Basic Laws; the sentence leaves the court's conclusion open."
  }),
  buildExpandedSentence({
    id: "formal_67", emoji: "📣", category: "formal", difficulty: 3,
    hebrew: "הזכות להפגין מוגנת, בכפוף למגבלות שנועדו לשמור על הסדר הציבורי.",
    hebrewNiqqud: "הַזְּכוּת לְהַפְגִּין מוּגֶנֶת, בִּכְפוּף לְמִגְבָּלוֹת שֶׁנּוֹעֲדוּ לִשְׁמֹר עַל הַסֵּדֶר הַצִּבּוּרִי.",
    english: "The right to demonstrate is protected, subject to restrictions intended to preserve public order.",
    hebrewTokenPairs: [["הזכות", "הַזְּכוּת"], ["להפגין", "לְהַפְגִּין"], ["מוגנת", "מוּגֶנֶת"], ["בכפוף", "בִּכְפוּף"], ["למגבלות", "לְמִגְבָּלוֹת"], ["שנועדו", "שֶׁנּוֹעֲדוּ"], ["לשמור", "לִשְׁמֹר"], ["על הסדר הציבורי", "עַל הַסֵּדֶר הַצִּבּוּרִי"]],
    englishTokens: ["The right", "to demonstrate", "is protected", "subject to", "restrictions", "intended", "to preserve", "public order"],
    hebrewDistractorPairs: [["החובה", "הַחוֹבָה"], ["להתפזר", "לְהִתְפַּזֵּר"], ["מוגבלת", "מֻגְבֶּלֶת"], ["ללא תנאים", "לְלֹא תְּנָאִים"], ["להפר", "לְהָפֵר"], ["את חופש הביטוי", "אֶת חֹפֶשׁ הַבִּטּוּי"]],
    englishDistractors: ["The duty", "to disperse", "is limited", "without conditions", "to violate", "freedom of expression"],
    notes: "בכפוף ל־ is formal legal Hebrew for 'subject to.' The sentence presents both the protected right and the public-order qualification in neutral legal language."
  }),
  buildExpandedSentence({
    id: "formal_68", emoji: "🔍", category: "formal", difficulty: 3,
    hebrew: "המחלקה לחקירות שוטרים החלה לבדוק טענות בדבר אלימות משטרתית.",
    hebrewNiqqud: "הַמַּחְלָקָה לַחֲקִירוֹת שׁוֹטְרִים הֵחֵלָּה לִבְדֹּק טַעֲנוֹת בִּדְבַר אַלִּימוּת מִשְׁטַרְתִּית.",
    english: "The Department of Internal Police Investigations began to review allegations of police brutality.",
    hebrewTokenPairs: [["המחלקה", "הַמַּחְלָקָה"], ["לחקירות שוטרים", "לַחֲקִירוֹת שׁוֹטְרִים"], ["החלה", "הֵחֵלָּה"], ["לבדוק", "לִבְדֹּק"], ["טענות", "טַעֲנוֹת"], ["בדבר", "בִּדְבַר"], ["אלימות משטרתית", "אַלִּימוּת מִשְׁטַרְתִּית"]],
    englishTokens: ["The Department", "of Internal Police Investigations", "began", "to review", "allegations", "of", "police brutality"],
    hebrewDistractorPairs: [["נציבות שירות המדינה", "נְצִיבוּת שֵׁרוּת הַמְּדִינָה"], ["סיימה", "סִיְּמָה"], ["לבחון", "לִבְחֹן"], ["מסקנות", "מַסְקָנוֹת"], ["לגבי", "לְגַבֵּי"], ["עבירות משמעת", "עֲבֵרוֹת מִשְׁמַעַת"]],
    englishDistractors: ["The Civil Service Commission", "finished", "examining", "findings", "about", "disciplinary offenses"],
    notes: "המחלקה לחקירות שוטרים is the department commonly known by the abbreviation מח״ש. בדיקת הטענות means reviewing the allegations, not presuming a finding."
  }),
  buildExpandedSentence({
    id: "formal_69", emoji: "🟰", category: "formal", difficulty: 3,
    hebrew: "אין להפלות אדם מחמת מוצא, דת, מין, נטייה מינית או מוגבלות.",
    hebrewNiqqud: "אֵין לְהַפְלוֹת אָדָם מֵחֲמַת מוֹצָא, דָּת, מִין, נְטִיָּה מִינִית אוֹ מֻגְבָּלוּת.",
    english: "It is forbidden to discriminate against a person because of origin, religion, sex, sexual orientation, or disability.",
    hebrewTokenPairs: [["אין", "אֵין"], ["להפלות", "לְהַפְלוֹת"], ["אדם", "אָדָם"], ["מחמת", "מֵחֲמַת"], ["מוצא", "מוֹצָא"], ["דת", "דָּת"], ["מין", "מִין"], ["נטייה מינית", "נְטִיָּה מִינִית"], ["או מוגבלות", "אוֹ מֻגְבָּלוּת"]],
    englishTokens: ["It is forbidden", "to discriminate against", "a person", "because of", "origin", "religion", "sex", "sexual orientation", "or disability"],
    hebrewDistractorPairs: [["מותר", "מֻתָּר"], ["להעדיף", "לְהַעֲדִיף"], ["מועמד", "מֻעֲמָד"], ["לנוכח", "לְנֹכַח"], ["השכלה גבוהה", "הַשְׂכָּלָה גְּבוֹהָה"], ["וניסיון", "וְנִסָּיוֹן"]],
    englishDistractors: ["It is permitted", "to prefer", "an applicant", "in light of", "higher education", "and experience"],
    notes: "אין + infinitive gives a formal prohibition. מחמת is a legal-register 'because of'; אפליה and להפלות are the noun and verb forms of discrimination."
  }),
  buildExpandedSentence({
    id: "formal_70", emoji: "🏳️‍🌈", category: "formal", difficulty: 2,
    hebrew: "הוועדה המליצה להרחיב את ההגנה על זכויות קהילת הלהט״ב.",
    hebrewNiqqud: "הַוַּעֲדָה הִמְלִיצָה לְהַרְחִיב אֶת הַהֲגָנָה עַל זְכֻיּוֹת קְהִלַּת הַלַּהַטָ״ב.",
    english: "The committee recommended expanding protection for the rights of the LGBTQ community.",
    hebrewTokenPairs: [["הוועדה", "הַוַּעֲדָה"], ["המליצה", "הִמְלִיצָה"], ["להרחיב", "לְהַרְחִיב"], ["את ההגנה", "אֶת הַהֲגָנָה"], ["על זכויות", "עַל זְכֻיּוֹת"], ["קהילת הלהט״ב", "קְהִלַּת הַלַּהַטָ״ב"]],
    englishTokens: ["The committee", "recommended", "expanding", "protection", "for the rights", "of the LGBTQ community"],
    hebrewDistractorPairs: [["המועצה", "הַמּוֹעָצָה"], ["סירבה", "סֵרְבָה"], ["לצמצם", "לְצַמְצֵם"], ["את המימון", "אֶת הַמִּמּוּן"], ["של חובות", "שֶׁל חוֹבוֹת"], ["ארגוני הספורט", "אִרְגּוּנֵי הַסְּפּוֹרְט"]],
    englishDistractors: ["The council", "refused", "to reduce", "funding", "for the obligations", "of sports organizations"],
    notes: "קהילת הלהט״ב is the LGBTQ community in formal institutional wording. להרחיב את ההגנה means to broaden or expand protections."
  }),
  buildExpandedSentence({
    id: "formal_71", emoji: "🏘️", category: "formal", difficulty: 3,
    hebrew: "התוכנית להרחבת ההתנחלות פורסמה כדי שהציבור יוכל להגיש התנגדויות במסגרת הליך התכנון.",
    hebrewNiqqud: "הַתָּכְנִית לְהַרְחָבַת הַהִתְנַחֲלוּת פֻּרְסְמָה כְּדֵי שֶׁהַצִּבּוּר יוּכַל לְהַגִּישׁ הִתְנַגְּדֻיּוֹת בְּמִסְגֶּרֶת הֲלִיךְ הַתִּכְנוּן.",
    english: "The plan to expand the settlement was published so the public could submit objections as part of the planning process.",
    hebrewTokenPairs: [["התוכנית", "הַתָּכְנִית"], ["להרחבת", "לְהַרְחָבַת"], ["ההתנחלות", "הַהִתְנַחֲלוּת"], ["פורסמה", "פֻּרְסְמָה"], ["כדי", "כְּדֵי"], ["שהציבור", "שֶׁהַצִּבּוּר"], ["יוכל להגיש", "יוּכַל לְהַגִּישׁ"], ["התנגדויות", "הִתְנַגְּדֻיּוֹת"], ["במסגרת", "בְּמִסְגֶּרֶת"], ["הליך התכנון", "הֲלִיךְ הַתִּכְנוּן"]],
    englishTokens: ["The plan", "to expand", "the settlement", "was published", "so", "the public", "could submit", "objections", "as part of", "the planning process"],
    hebrewDistractorPairs: [["בקשת הפינוי", "בַּקָּשַׁת הַפִּנּוּי"], ["אושרה", "אֻשְּׁרָה"], ["בלי", "בְּלִי"], ["שיתוף הציבור", "שִׁתּוּף הַצִּבּוּר"], ["בניגוד", "בְּנִגּוּד"], ["להחלטת הממשלה", "לְהַחְלָטַת הַמֶּמְשָׁלָה"]],
    englishDistractors: ["The evacuation request", "was approved", "without", "public participation", "contrary to", "the government decision"],
    notes: "Planning notices may use the technical verb הופקדה for this stage. The learner-facing sentence states its practical effect: publication so the public can submit objections."
  }),
  buildExpandedSentence({
    id: "formal_72", emoji: "🧾", category: "formal", difficulty: 3,
    hebrew: "הרשויות הודיעו שכל דיווח על אלימות מתנחלים ייחקר, ושהמסקנות ייקבעו על סמך הראיות.",
    hebrewNiqqud: "הָרָשֻׁיּוֹת הוֹדִיעוּ שֶׁכָּל דִּוּוּחַ עַל אַלִּימוּת מִתְנַחֲלִים יֵחָקֵר, וְשֶׁהַמַּסְקָנוֹת יִקָּבְעוּ עַל סְמַךְ הָרְאָיוֹת.",
    english: "The authorities announced that every report of settler violence would be investigated and that conclusions would be based on the evidence.",
    hebrewTokenPairs: [["הרשויות", "הָרָשֻׁיּוֹת"], ["הודיעו", "הוֹדִיעוּ"], ["שכל דיווח", "שֶׁכָּל דִּוּוּחַ"], ["על אלימות מתנחלים", "עַל אַלִּימוּת מִתְנַחֲלִים"], ["ייחקר", "יֵחָקֵר"], ["ושהמסקנות", "וְשֶׁהַמַּסְקָנוֹת"], ["ייקבעו", "יִקָּבְעוּ"], ["על סמך הראיות", "עַל סְמַךְ הָרְאָיוֹת"]],
    englishTokens: ["The authorities", "announced", "that every report", "of settler violence", "would be investigated", "and that conclusions", "would be based", "on the evidence"],
    hebrewDistractorPairs: [["הארגונים", "הָאִרְגּוּנִים"], ["העריכו", "הֶעֱרִיכוּ"], ["שחלק מהשמועות", "שֶׁחֵלֶק מֵהַשְּׁמוּעוֹת"], ["על סכסוך שכנים", "עַל סִכְסוּךְ שְׁכֵנִים"], ["יוזנחו", "יֻזְנְחוּ"], ["ללא בדיקה", "לְלֹא בְּדִיקָה"]],
    englishDistractors: ["The organizations", "estimated", "that some rumors", "of a neighbor dispute", "would be ignored", "without review"],
    notes: "ייחקר is the formal passive future, 'will be investigated.' על סמך הראיות anchors the announcement in evidence rather than presuming any report true or false."
  }),
  buildExpandedSentence({
    id: "formal_73", emoji: "🌐", category: "formal", difficulty: 3,
    hebrew: "במשפט הבין־לאומי, השאלה אם שטח נתון תחת כיבוש נבחנת לפי מידת השליטה האפקטיבית בו.",
    hebrewNiqqud: "בַּמִּשְׁפָּט הַבֵּין־לְאֻמִּי, הַשְּׁאֵלָה אִם שֶׁטַח נָתוּן תַּחַת כִּבּוּשׁ נִבְחֶנֶת לְפִי מִדַּת הַשְּׁלִיטָה הָאֶפֶקְטִיבִית בּוֹ.",
    english: "In international law, the question of whether a territory is under occupation is assessed by the degree of effective control over it.",
    hebrewTokenPairs: [["במשפט הבין־לאומי", "בַּמִּשְׁפָּט הַבֵּין־לְאֻמִּי"], ["השאלה", "הַשְּׁאֵלָה"], ["אם", "אִם"], ["שטח", "שֶׁטַח"], ["נתון תחת כיבוש", "נָתוּן תַּחַת כִּבּוּשׁ"], ["נבחנת", "נִבְחֶנֶת"], ["לפי מידת", "לְפִי מִדַּת"], ["השליטה האפקטיבית", "הַשְּׁלִיטָה הָאֶפֶקְטִיבִית"], ["בו", "בּוֹ"]],
    englishTokens: ["In international law", "the question", "of whether", "a territory", "is under occupation", "is assessed", "by the degree", "of effective control", "over it"],
    hebrewDistractorPairs: [["סיפוח", "סִפּוּחַ"], ["מוגדר", "מֻגְדָּר"], ["בדין המקומי", "בַּדִּין הַמְּקוֹמִי"], ["בלי קשר ל", "בְּלִי קֶשֶׁר לְ"], ["הנוכחות הזמנית", "הַנּוֹכְחוּת הַזְּמַנִּית"], ["בגבול", "בַּגְּבוּל"]],
    englishDistractors: ["Annexation", "is defined", "in domestic law", "regardless of", "temporary presence", "at the border"],
    notes: "משפט בין־לאומי is international law; שליטה אפקטיבית is effective control. The legal question is assessed here without applying the criterion to a particular territory."
  }),
  buildExpandedSentence({
    id: "formal_74", emoji: "⚠️", category: "formal", difficulty: 3,
    hebrew: "החלטה לבצע התנקשות בדמות ציבורית מעוררת שאלות משפטיות ומוסריות כבדות.",
    hebrewNiqqud: "הַחְלָטָה לְבַצֵּעַ הִתְנַקְּשׁוּת בִּדְמוּת צִבּוּרִית מְעוֹרֶרֶת שְׁאֵלוֹת מִשְׁפָּטִיּוֹת וּמוּסָרִיּוֹת כְּבֵדוֹת.",
    english: "A decision to assassinate a public figure raises serious legal and moral questions.",
    hebrewTokenPairs: [["החלטה", "הַחְלָטָה"], ["לבצע התנקשות", "לְבַצֵּעַ הִתְנַקְּשׁוּת"], ["בדמות ציבורית", "בִּדְמוּת צִבּוּרִית"], ["מעוררת", "מְעוֹרֶרֶת"], ["שאלות", "שְׁאֵלוֹת"], ["משפטיות", "מִשְׁפָּטִיּוֹת"], ["ומוסריות", "וּמוּסָרִיּוֹת"], ["כבדות", "כְּבֵדוֹת"]],
    englishTokens: ["A decision", "to assassinate", "a public figure", "raises", "serious", "legal", "and moral", "questions"],
    hebrewDistractorPairs: [["המלצה", "הַמְלָצָה"], ["להגן", "לְהָגֵן"], ["על מוסד", "עַל מוֹסָד"], ["פותרת", "פּוֹתֶרֶת"], ["בעיות", "בְּעָיוֹת"], ["עלויות", "עָלֻיּוֹת"]],
    englishDistractors: ["A recommendation", "to protect", "an institution", "resolves", "problems", "costs"],
    notes: "לבצע means 'to carry out.' התנקשות ב־ is assassination of or an attempt on a public figure. This abstract sentence teaches the term while foregrounding legal and moral scrutiny."
  }),
  buildExpandedSentence({
    id: "formal_75", emoji: "📚", category: "formal", difficulty: 3,
    hebrew: "המאמר הבחין בין המונחים רצח, הרג והשמדה והסביר את השימוש בכל אחד מהם.",
    hebrewNiqqud: "הַמַּאֲמָר הִבְחִין בֵּין הַמֻּנָּחִים רֶצַח, הֶרֶג וְהַשְׁמָדָה וְהִסְבִּיר אֶת הַשִּׁמּוּשׁ בְּכָל אֶחָד מֵהֶם.",
    english: "The article distinguished between the terms murder, killing, and annihilation and explained the use of each one.",
    hebrewTokenPairs: [["המאמר", "הַמַּאֲמָר"], ["הבחין בין", "הִבְחִין בֵּין"], ["המונחים", "הַמֻּנָּחִים"], ["רצח", "רֶצַח"], ["הרג", "הֶרֶג"], ["והשמדה", "וְהַשְׁמָדָה"], ["והסביר", "וְהִסְבִּיר"], ["את השימוש", "אֶת הַשִּׁמּוּשׁ"], ["בכל אחד מהם", "בְּכָל אֶחָד מֵהֶם"]],
    englishTokens: ["The article", "distinguished between", "the terms", "murder", "killing", "and annihilation", "and explained", "the use", "of each one"],
    hebrewDistractorPairs: [["הדיון", "הַדִּיּוּן"], ["ערבב", "עִרְבֵּב"], ["בין פשע", "בֵּין פֶּשַׁע"], ["פגיעה", "פְּגִיעָה"], ["ושיקום", "וְשִׁקּוּם"], ["כדי לקבוע", "כְּדֵי לִקְבֹּעַ"]],
    englishDistractors: ["The debate", "mixed together", "crime", "injury", "and reconstruction", "in order to rank"],
    notes: "רצח is murder, הרג is killing, and השמדה is annihilation or destruction. The sentence is explicitly about how the three terms are used."
  }),
  buildExpandedSentence({
    id: "formal_76", emoji: "🕊️", category: "formal", difficulty: 3,
    hebrew: "ההסדר המוצע מבקש לאזן בין חופש הדת, חופש מדת ואופייה של השבת במרחב הציבורי.",
    hebrewNiqqud: "הַהֶסְדֵּר הַמֻּצָּע מְבַקֵּשׁ לְאַזֵּן בֵּין חֹפֶשׁ הַדָּת, חֹפֶשׁ מִדָּת וְאֹפְיָהּ שֶׁל הַשַּׁבָּת בַּמֶּרְחָב הַצִּבּוּרִי.",
    english: "The proposed arrangement seeks to balance freedom of religion, freedom from religion, and the character of Shabbat in the public sphere.",
    hebrewTokenPairs: [["ההסדר", "הַהֶסְדֵּר"], ["המוצע", "הַמֻּצָּע"], ["מבקש", "מְבַקֵּשׁ"], ["לאזן בין", "לְאַזֵּן בֵּין"], ["חופש הדת", "חֹפֶשׁ הַדָּת"], ["חופש מדת", "חֹפֶשׁ מִדָּת"], ["ואופייה", "וְאֹפְיָהּ"], ["של השבת", "שֶׁל הַשַּׁבָּת"], ["במרחב הציבורי", "בַּמֶּרְחָב הַצִּבּוּרִי"]],
    englishTokens: ["The proposed", "arrangement", "seeks", "to balance", "freedom of religion", "freedom from religion", "and the character", "of Shabbat", "in the public sphere"],
    hebrewDistractorPairs: [["החוק הקיים", "הַחֹק הַקַּיָּם"], ["מסרב", "מְסָרֵב"], ["להעדיף", "לְהַעֲדִיף"], ["בין חובת הציות", "בֵּין חוֹבַת הַצִּיּוּת"], ["ופרטיות", "וּפְרָטִיּוּת"], ["של החג", "שֶׁל הֶחָג"]],
    englishDistractors: ["The existing law", "refuses", "to favor", "the duty to obey", "and privacy", "of a holiday"],
    notes: "חופש הדת is freedom of religion; חופש מדת is freedom from religion. אופי means character, and אופייה של השבת means 'the character of Shabbat.'"
  }),
  buildExpandedSentence({
    id: "formal_77", emoji: "📈", category: "formal", difficulty: 3,
    hebrew: "המדיניות תיבחן לפי האופן שבו היא משפיעה על יוקר המחיה, מחירי הדיור ואי־השוויון.",
    hebrewNiqqud: "הַמְּדִינִיּוּת תִּבָּחֵן לְפִי הָאֹפֶן שֶׁבּוֹ הִיא מַשְׁפִּיעָה עַל יֹקֶר הַמִּחְיָה, מְחִירֵי הַדִּיּוּר וְאִי־הַשִּׁוְיוֹן.",
    english: "The policy will be evaluated based on how it affects the cost of living, housing prices, and inequality.",
    hebrewTokenPairs: [["המדיניות", "הַמְּדִינִיּוּת"], ["תיבחן", "תִּבָּחֵן"], ["לפי האופן שבו", "לְפִי הָאֹפֶן שֶׁבּוֹ"], ["היא משפיעה", "הִיא מַשְׁפִּיעָה"], ["על יוקר המחיה", "עַל יֹקֶר הַמִּחְיָה"], ["מחירי הדיור", "מְחִירֵי הַדִּיּוּר"], ["ואי־השוויון", "וְאִי־הַשִּׁוְיוֹן"]],
    englishTokens: ["The policy", "will be evaluated", "based on how", "it affects", "the cost of living", "housing prices", "and inequality"],
    hebrewDistractorPairs: [["התוכנית", "הַתָּכְנִית"], ["תאושר", "תְּאֻשַּׁר"], ["בלי קשר להשפעתה", "בְּלִי קֶשֶׁר לְהַשְׁפָּעָתָהּ"], ["על היצוא התעשייתי", "עַל הַיְּצוּא הַתַּעֲשִׂיָּתִי"], ["הכנסות המדינה", "הַכְנָסוֹת הַמְּדִינָה"], ["והצמיחה השנתית", "וְהַצְּמִיחָה הַשְּׁנָתִית"]],
    englishDistractors: ["The program", "will be approved", "regardless of its effect", "on industrial exports", "state revenue", "and annual growth"],
    notes: "תיבחן is the formal passive 'will be evaluated.' יוקר המחיה, מחירי הדיור, and אי־השוויון are core policy terms: cost of living, housing prices, and inequality."
  }),
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION_POLITICS);

const SENTENCE_EXPANSION_REQUESTED = [
  buildExpandedSentence({
    id: "everyday_137", emoji: "👄", category: "everyday", difficulty: 1,
    hebrew: "היא הזיזה את השפתיים אבל לא אמרה כלום.",
    hebrewNiqqud: "הִיא הֵזִיזָה אֶת הַשְּׂפָתַיִם אֲבָל לֹא אָמְרָה כְּלוּם.",
    english: "She moved her lips but said nothing.",
    hebrewTokenPairs: [["היא", "הִיא"], ["הזיזה", "הֵזִיזָה"], ["את השפתיים", "אֶת הַשְּׂפָתַיִם"], ["אבל", "אֲבָל"], ["לא אמרה", "לֹא אָמְרָה"], ["כלום", "כְּלוּם"]],
    englishTokens: ["She", "moved", "her lips", "but", "said", "nothing"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["סגר", "סָגַר"], ["את העיניים", "אֶת הָעֵינַיִם"], ["ואז", "וְאָז"], ["חייך", "חִיֵּךְ"]],
    englishDistractors: ["He", "closed", "his eyes", "and then", "smiled"],
    notes: "שפתיים means 'lips.' It is grammatically dual in form, so the definite plural phrase is השפתיים."
  }),
  buildExpandedSentence({
    id: "everyday_138", emoji: "🗣️", category: "everyday", difficulty: 1,
    hebrew: "היא מדברת שתי שפות בעבודה בכל יום.",
    hebrewNiqqud: "הִיא מְדַבֶּרֶת שְׁתֵּי שָׂפוֹת בָּעֲבוֹדָה בְּכָל יוֹם.",
    english: "She speaks two languages at work every day.",
    hebrewTokenPairs: [["היא", "הִיא"], ["מדברת", "מְדַבֶּרֶת"], ["שתי", "שְׁתֵּי"], ["שפות", "שָׂפוֹת"], ["בעבודה", "בָּעֲבוֹדָה"], ["בכל יום", "בְּכָל יוֹם"]],
    englishTokens: ["She", "speaks", "two", "languages", "at work", "every day"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["לומד", "לוֹמֵד"], ["שלוש", "שָׁלוֹשׁ"], ["מיומנויות", "מְיֻמָּנוּיוֹת"], ["בבית", "בַּבַּיִת"]],
    englishDistractors: ["He", "studies", "three", "skills", "at home"],
    hebrewAlternates: [{
      text: "בכל יום היא מדברת שתי שפות בעבודה.", textNiqqud: "בְּכָל יוֹם הִיא מְדַבֶּרֶת שְׁתֵּי שָׂפוֹת בָּעֲבוֹדָה.",
      tokenPairs: [["בכל יום", "בְּכָל יוֹם"], ["היא", "הִיא"], ["מדברת", "מְדַבֶּרֶת"], ["שתי", "שְׁתֵּי"], ["שפות", "שָׂפוֹת"], ["בעבודה", "בָּעֲבוֹדָה"]]
    }],
    notes: "שתי is the feminine construct form of 'two,' used before the feminine plural noun שפות: שתי שפות, 'two languages.'"
  }),
  // APPEND_ONLY_REVIEWED_SENTENCES_START
  // Every sentence from this marker onward must use buildReviewedSentence and
  // record whether neutral Hebrew order is fixed or represented by alternates.
  buildReviewedSentence({
    id: "colloquial_vodge_01", emoji: "😍", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "יש לו וודג' של דוגמן.",
    hebrewNiqqud: "יֵשׁ לוֹ ווֹדְג' שֶׁל דֻּגְמָן.",
    english: "He has the face of a model.",
    hebrewTokenPairs: [["יש", "יֵשׁ"], ["לו", "לוֹ"], ["וודג'", "ווֹדְג'"], ["של", "שֶׁל"], ["דוגמן", "דֻּגְמָן"]],
    englishTokens: ["He", "has", "the face", "of", "a model"],
    hebrewDistractorPairs: [["פרצוף", "פַּרְצוּף"], ["גוף", "גּוּף"], ["חיוך", "חִיּוּךְ"], ["קול", "קוֹל"]],
    englishDistractors: ["the body", "a smile", "the voice", "a star"],
    notes: "וודג' is LGBTQ+ slang for one's face or looks, borrowed from Arabic wajh ('face'). It is masculine; the single-vav spelling ودج' is also seen."
  }),
  buildReviewedSentence({
    id: "colloquial_vodge_02", emoji: "💄", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "בלי איפור הוודג' שלי הרוס בבוקר.",
    hebrewNiqqud: "בְּלִי אִיפּוּר הַווֹדְג' שֶׁלִּי הָרוּס בַּבֹּקֶר.",
    english: "Without makeup my face is a wreck in the morning.",
    hebrewTokenPairs: [["בלי", "בְּלִי"], ["איפור", "אִיפּוּר"], ["הוודג'", "הַווֹדְג'"], ["שלי", "שֶׁלִּי"], ["הרוס", "הָרוּס"], ["בבוקר", "בַּבֹּקֶר"]],
    englishTokens: ["Without", "makeup", "my face", "is a wreck", "in the morning"],
    hebrewDistractorPairs: [["נראה", "נִרְאֶה"], ["עייף", "עָיֵף"], ["בלילה", "בַּלַּיְלָה"], ["הכל", "הַכֹּל"]],
    englishDistractors: ["looks", "tired", "at night", "everything"],
    hebrewOrderAlternates: [
      {
        text: "בבוקר הוודג' שלי הרוס בלי איפור.",
        textNiqqud: "בַּבֹּקֶר הַווֹדְג' שֶׁלִּי הָרוּס בְּלִי אִיפּוּר.",
        order: [5, 2, 3, 4, 0, 1],
      },
      {
        text: "הוודג' שלי הרוס בבוקר בלי איפור.",
        textNiqqud: "הַווֹדְג' שֶׁלִּי הָרוּס בַּבֹּקֶר בְּלִי אִיפּוּר.",
        order: [2, 3, 4, 5, 0, 1],
      },
      {
        text: "בלי איפור בבוקר הוודג' שלי הרוס.",
        textNiqqud: "בְּלִי אִיפּוּר בַּבֹּקֶר הַווֹדְג' שֶׁלִּי הָרוּס.",
        order: [0, 1, 5, 2, 3, 4],
      },
    ],
    notes: "וודג' here is slang for one's face/looks; הוודג' שלי = 'my face.' The word comes from Arabic wajh ('face')."
  }),
  buildReviewedSentence({
    id: "colloquial_vodge_03", emoji: "💅", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "תסדר את הוודג' לפני שיוצאים מהבית.",
    hebrewNiqqud: "תְּסַדֵּר אֶת הַווֹדְג' לִפְנֵי שֶׁיּוֹצְאִים מֵהַבַּיִת.",
    english: "Fix your face before we leave the house.",
    hebrewTokenPairs: [["תסדר", "תְּסַדֵּר"], ["את", "אֶת"], ["הוודג'", "הַווֹדְג'"], ["לפני", "לִפְנֵי"], ["שיוצאים", "שֶׁיּוֹצְאִים"], ["מהבית", "מֵהַבַּיִת"]],
    englishTokens: ["Fix", "your face", "before", "we leave", "the house"],
    hebrewDistractorPairs: [["תלבש", "תִּלְבַּשׁ"], ["אחרי", "אַחֲרֵי"], ["נשארים", "נִשְׁאָרִים"], ["בבית", "בַּבַּיִת"]],
    englishDistractors: ["get dressed", "after", "we stay", "at home"],
    hebrewOrderAlternates: [{
      text: "לפני שיוצאים מהבית, תסדר את הוודג'.",
      textNiqqud: "לִפְנֵי שֶׁיּוֹצְאִים מֵהַבַּיִת, תְּסַדֵּר אֶת הַווֹדְג'.",
      order: [3, 4, 5, 0, 1, 2],
    }],
    notes: "תסדר את הוודג' is a campy way to say 'fix your face/look.' וודג' is slang for face/looks, from Arabic wajh ('face')."
  }),
  buildReviewedSentence({
    id: "colloquial_falsh_01", emoji: "🙄", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "אל תהיה פאלש, תגיד מה שאתה באמת חושב.",
    hebrewNiqqud: "אַל תִּהְיֶה פָאלְשׁ, תַּגִּיד מַה שֶּׁאַתָּה בֶּאֱמֶת חוֹשֵׁב.",
    english: "Don't be fake, say what you really think.",
    hebrewTokenPairs: [["אל", "אַל"], ["תהיה", "תִּהְיֶה"], ["פאלש", "פָאלְשׁ"], ["תגיד", "תַּגִּיד"], ["מה", "מַה"], ["שאתה", "שֶּׁאַתָּה"], ["באמת", "בֶּאֱמֶת"], ["חושב", "חוֹשֵׁב"]],
    englishTokens: ["Don't", "be", "fake", "say", "what you", "really", "think"],
    hebrewDistractorPairs: [["ישר", "יָשָׁר"], ["תשתוק", "תִּשְׁתֹּק"], ["שקר", "שֶׁקֶר"], ["נחמד", "נֶחְמָד"]],
    englishDistractors: ["honest", "be quiet", "a lie", "nice"],
    hebrewOrderAlternates: [{
      text: "אל תהיה פאלש, תגיד מה שאתה חושב באמת.",
      textNiqqud: "אַל תִּהְיֶה פָאלְשׁ, תַּגִּיד מַה שֶּׁאַתָּה חוֹשֵׁב בֶּאֱמֶת.",
      order: [0, 1, 2, 3, 4, 5, 7, 6],
    }],
    notes: "פאלש (from Yiddish/German 'falsch') is slang for fake, phony, or two-faced — used about people or vibes."
  }),
  buildReviewedSentence({
    id: "colloquial_ochtcha_01", emoji: "💁", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אוחצ'ה, ראית מה היא לבשה אתמול?!",
    hebrewNiqqud: "אוֹחְצָ'ה, רָאִית מָה הִיא לָבְשָׁה אֶתְמוֹל?!",
    english: "Girl, did you see what she wore yesterday?!",
    hebrewTokenPairs: [["אוחצ'ה", "אוֹחְצָ'ה"], ["ראית", "רָאִית"], ["מה", "מָה"], ["היא", "הִיא"], ["לבשה", "לָבְשָׁה"], ["אתמול", "אֶתְמוֹל"]],
    englishTokens: ["Girl", "did you see", "what", "she", "wore", "yesterday"],
    hebrewDistractorPairs: [["שמעת", "שָׁמַעְתְּ"], ["הוא", "הוּא"], ["קנה", "קָנָה"], ["היום", "הַיּוֹם"]],
    englishDistractors: ["did you hear", "he", "bought", "today"],
    notes: "אוחצ'ה (also אוחצ') is camp slang for a flamboyant gay man and a term of address like 'girl!' or 'queen.' From Arabic for 'sister.'"
  }),
  buildReviewedSentence({
    id: "colloquial_hores_01", emoji: "🔥", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אחותי, את הורסת עם השמלה הזאת!",
    hebrewNiqqud: "אָחוֹתִי, אַתְּ הוֹרֶסֶת עִם הַשִּׂמְלָה הַזֹּאת!",
    english: "Girl, you're killing it in that dress!",
    hebrewTokenPairs: [["אחותי", "אָחוֹתִי"], ["את", "אַתְּ"], ["הורסת", "הוֹרֶסֶת"], ["עם", "עִם"], ["השמלה", "הַשִּׂמְלָה"], ["הזאת", "הַזֹּאת"]],
    englishTokens: ["Girl", "you're", "killing it", "in", "that dress"],
    hebrewDistractorPairs: [["אחי", "אָחִי"], ["הוא", "הוּא"], ["נראה", "נִרְאֶה"], ["המעיל", "הַמְּעִיל"], ["ההוא", "הַהוּא"]],
    englishDistractors: ["bro", "he", "looks", "the coat", "that one"],
    notes: "הורס/הורסת literally 'destroys,' but as slang means 'killing it / looking amazing.' Common in gay and general Israeli slang."
  }),
  buildReviewedSentence({
    id: "colloquial_hores_02", emoji: "🤩", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הביצוע שלו אתמול פשוט הורס.",
    hebrewNiqqud: "הַבִּיצּוּעַ שֶׁלּוֹ אֶתְמוֹל פָּשׁוּט הוֹרֵס.",
    english: "His performance yesterday was just a knockout.",
    hebrewTokenPairs: [["הביצוע", "הַבִּיצּוּעַ"], ["שלו", "שֶׁלּוֹ"], ["אתמול", "אֶתְמוֹל"], ["פשוט", "פָּשׁוּט"], ["הורס", "הוֹרֵס"]],
    englishTokens: ["His", "performance", "yesterday", "was just", "a knockout"],
    hebrewDistractorPairs: [["השיר", "הַשִּׁיר"], ["שלה", "שֶׁלָּהּ"], ["היום", "הַיּוֹם"], ["ממש", "מַמָּשׁ"], ["משעמם", "מְשַׁעֲמֵם"]],
    englishDistractors: ["the song", "hers", "today", "really", "boring"],
    notes: "הורס as slang = amazing, a knockout ('killing it'). Here it describes a performance rather than a person."
  }),
  buildReviewedSentence({
    id: "colloquial_dov_01", emoji: "🐻", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "כל הדובים באים למסיבה ביום שישי.",
    hebrewNiqqud: "כָּל הַדֻּבִּים בָּאִים לַמְּסִבָּה בְּיוֹם שִׁישִׁי.",
    english: "All the bears come to the party on Friday.",
    hebrewTokenPairs: [["כל", "כָּל"], ["הדובים", "הַדֻּבִּים"], ["באים", "בָּאִים"], ["למסיבה", "לַמְּסִבָּה"], ["ביום", "בְּיוֹם"], ["שישי", "שִׁישִׁי"]],
    englishTokens: ["All", "the bears", "come", "to the party", "on", "Friday"],
    hebrewDistractorPairs: [["כמה", "כַּמָּה"], ["החתולים", "הַחֲתוּלִים"], ["הולכים", "הוֹלְכִים"], ["לים", "לַיָּם"], ["ראשון", "רִאשׁוֹן"]],
    englishDistractors: ["some", "the cats", "go", "to the beach", "Sunday"],
    hebrewOrderAlternates: [
      {
        text: "ביום שישי כל הדובים באים למסיבה.",
        textNiqqud: "בְּיוֹם שִׁישִׁי כָּל הַדֻּבִּים בָּאִים לַמְּסִבָּה.",
        order: [4, 5, 0, 1, 2, 3],
      },
      {
        text: "כל הדובים ביום שישי באים למסיבה.",
        textNiqqud: "כָּל הַדֻּבִּים בְּיוֹם שִׁישִׁי בָּאִים לַמְּסִבָּה.",
        order: [0, 1, 4, 5, 2, 3],
      },
    ],
    notes: "דוב ('bear') in gay slang is a large, hairy man — same as English 'bear.' Plural דובים."
  }),
  buildReviewedSentence({
    id: "colloquial_dov_02", emoji: "🧔", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הוא דוב חמוד עם זקן וחיוך גדול.",
    hebrewNiqqud: "הוּא דֹּב חָמוּד עִם זָקָן וְחִיּוּךְ גָּדוֹל.",
    english: "He's a cute bear with a beard and a big smile.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["דוב", "דֹּב"], ["חמוד", "חָמוּד"], ["עם", "עִם"], ["זקן", "זָקָן"], ["וחיוך", "וְחִיּוּךְ"], ["גדול", "גָּדוֹל"]],
    englishTokens: ["He's", "a cute", "bear", "with", "a beard", "and a", "big smile"],
    hebrewDistractorPairs: [["היא", "הִיא"], ["חתול", "חָתוּל"], ["רזה", "רָזֶה"], ["בלי", "בְּלִי"], ["שפם", "שָׂפָם"], ["קטן", "קָטָן"]],
    englishDistractors: ["she's", "a cat", "skinny", "without", "a mustache", "small"],
    notes: "דוב ('bear') = a big, hairy, often bearded gay man. Used affectionately."
  }),
  buildReviewedSentence({
    id: "colloquial_kukitza_01", emoji: "🍪", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "הקוקיצה החדשה במשרד כבר מכירה את כולם.",
    hebrewNiqqud: "הַקּוּקִיצָה הַחֲדָשָׁה בַּמִּשְׂרָד כְּבָר מַכִּירָה אֶת כֻּלָּם.",
    english: "The new twink at the office already knows everyone.",
    hebrewTokenPairs: [["הקוקיצה", "הַקּוּקִיצָה"], ["החדשה", "הַחֲדָשָׁה"], ["במשרד", "בַּמִּשְׂרָד"], ["כבר", "כְּבָר"], ["מכירה", "מַכִּירָה"], ["את", "אֶת"], ["כולם", "כֻּלָּם"]],
    englishTokens: ["The new", "twink", "at the office", "already", "knows", "everyone"],
    hebrewDistractorPairs: [["הבחור", "הַבָּחוּר"], ["הישן", "הַיָּשָׁן"], ["בבית", "בַּבַּיִת"], ["שכח", "שָׁכַח"], ["אף אחד", "אַף אֶחָד"]],
    englishDistractors: ["the guy", "old", "at home", "forgot", "no one"],
    hebrewOrderAlternates: [{
      text: "הקוקיצה החדשה במשרד מכירה כבר את כולם.",
      textNiqqud: "הַקּוּקִיצָה הַחֲדָשָׁה בַּמִּשְׂרָד מַכִּירָה כְּבָר אֶת כֻּלָּם.",
      order: [0, 1, 2, 4, 3, 5, 6],
    }],
    notes: "קוקיצה (from English 'cookie') is playful slang for a young, cute, effeminate gay guy (like 'twink'). Grammatically feminine."
  }),
  buildReviewedSentence({
    id: "colloquial_melarler_01", emoji: "📞", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "היא מלרלרת בטלפון כבר שעתיים.",
    hebrewNiqqud: "הִיא מְלַרְלֶרֶת בַּטֶּלֶפוֹן כְּבָר שְׁעָתַיִם.",
    english: "She's already been yakking on the phone for two hours.",
    hebrewTokenPairs: [["היא", "הִיא"], ["מלרלרת", "מְלַרְלֶרֶת"], ["בטלפון", "בַּטֶּלֶפוֹן"], ["כבר", "כְּבָר"], ["שעתיים", "שְׁעָתַיִם"]],
    englishTokens: ["She's already", "been yakking", "on the phone", "for", "two hours"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["עובד", "עוֹבֵד"], ["במחשב", "בַּמַּחְשֵׁב"], ["רק", "רַק"], ["דקה", "דַּקָּה"]],
    englishDistractors: ["he has been", "working", "on the computer", "only", "a minute"],
    hebrewOrderAlternates: [
      {
        text: "היא כבר מלרלרת בטלפון שעתיים.",
        textNiqqud: "הִיא כְּבָר מְלַרְלֶרֶת בַּטֶּלֶפוֹן שְׁעָתַיִם.",
        order: [0, 3, 1, 2, 4],
      },
      {
        text: "היא כבר שעתיים מלרלרת בטלפון.",
        textNiqqud: "הִיא כְּבָר שְׁעָתַיִם מְלַרְלֶרֶת בַּטֶּלֶפוֹן.",
        order: [0, 3, 4, 1, 2],
      },
      {
        text: "כבר שעתיים היא מלרלרת בטלפון.",
        textNiqqud: "כְּבָר שְׁעָתַיִם הִיא מְלַרְלֶרֶת בַּטֶּלֶפוֹן.",
        order: [3, 4, 0, 1, 2],
      },
      {
        text: "היא מלרלרת כבר שעתיים בטלפון.",
        textNiqqud: "הִיא מְלַרְלֶרֶת כְּבָר שְׁעָתַיִם בַּטֶּלֶפוֹן.",
        order: [0, 1, 3, 4, 2],
      },
      {
        text: "היא כבר מלרלרת שעתיים בטלפון.",
        textNiqqud: "הִיא כְּבָר מְלַרְלֶרֶת שְׁעָתַיִם בַּטֶּלֶפוֹן.",
        order: [0, 3, 1, 4, 2],
      },
    ],
    notes: "מלרלר/מלרלרת (to לרלר) is slang for chattering or gossiping nonstop — a reduplicated, onomatopoeic verb."
  }),
  buildReviewedSentence({
    id: "colloquial_patutch_01", emoji: "👋", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "טוב מותק, אני זזה, פאטוץ'!",
    hebrewNiqqud: "טוֹב מוֹתֶק, אֲנִי זָזָה, פָּאטוּץ'!",
    english: "Okay babe, I'm off, bye!",
    hebrewTokenPairs: [["טוב", "טוֹב"], ["מותק", "מוֹתֶק"], ["אני", "אֲנִי"], ["זזה", "זָזָה"], ["פאטוץ'", "פָּאטוּץ'"]],
    englishTokens: ["Okay", "babe", "I'm", "off", "bye"],
    hebrewDistractorPairs: [["רגע", "רֶגַע"], ["יקירי", "יַקִּירִי"], ["הוא", "הוּא"], ["נשאר", "נִשְׁאָר"], ["שלום", "שָׁלוֹם"]],
    englishDistractors: ["wait", "dear", "he", "stays", "hello"],
    notes: "פאטוץ' is a light, campy way to say 'bye!' זזה = 'I'm off/moving along' (feminine)."
  }),
];

SENTENCE_BANK.push(...SENTENCE_EXPANSION_REQUESTED);

const INBAL_SENTENCES = [
  buildReviewedSentence({
    id: "inbal_01", emoji: "🏺", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הארכאולוגים מצאו קערת השבעה ועליה טקסט בארמית.",
    hebrewNiqqud: "הָאַרְכֵאוֹלוֹגִים מָצְאוּ קְעָרַת הַשְׁבָּעָה וְעָלֶיהָ טֶקְסְט בַּאֲרָמִית.",
    english: "The archaeologists found an incantation bowl with Aramaic text.",
    hebrewTokenPairs: [["הארכאולוגים", "הָאַרְכֵאוֹלוֹגִים"], ["מצאו", "מָצְאוּ"], ["קערת השבעה", "קְעָרַת הַשְׁבָּעָה"], ["ועליה", "וְעָלֶיהָ"], ["טקסט", "טֶקְסְט"], ["בארמית", "בַּאֲרָמִית"]],
    englishTokens: ["The archaeologists", "found", "an incantation bowl", "with", "Aramaic", "text"],
    hebrewDistractorPairs: [["האמנים", "הָאָמָּנִים"], ["שברו", "שָׁבְרוּ"], ["פסל", "פֶּסֶל"], ["בלטינית", "בְּלָטִינִית"]],
    englishDistractors: ["The artists", "broke", "a statue", "Latin"],
    notes: "קערת השבעה is an incantation bowl. Late-antique examples commonly carry protective texts written in spirals, often in Aramaic."
  }),
  buildReviewedSentence({
    id: "inbal_02", emoji: "🌀", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הכתב מסתובב פנימה משפתה.",
    hebrewNiqqud: "הַכְּתָב מִסְתּוֹבֵב פְּנִימָה מִשְּׂפָתָהּ.",
    english: "The writing spirals inward from its rim.",
    hebrewTokenPairs: [["הכתב", "הַכְּתָב"], ["מסתובב", "מִסְתּוֹבֵב"], ["פנימה", "פְּנִימָה"], ["משפתה", "מִשְּׂפָתָהּ"]],
    englishTokens: ["The writing", "spirals", "inward", "from its rim"],
    hebrewDistractorPairs: [["הציור", "הַצִּיּוּר"], ["נמחק", "נִמְחָק"], ["מתחת", "מִתַּחַת"], ["לפינה", "לַפִּנָּה"]],
    englishDistractors: ["The drawing", "disappears", "under", "the corner"],
    notes: "שפה can mean an edge or rim as well as a language or lip. משפתה means 'from its rim.'"
  }),
  buildReviewedSentence({
    id: "inbal_03", emoji: "🚪", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הם קברו את הקערה הפוכה מתחת לסף הבית.",
    hebrewNiqqud: "הֵם קָבְרוּ אֶת הַקְּעָרָה הֲפוּכָה מִתַּחַת לְסַף הַבַּיִת.",
    english: "They buried the bowl upside down beneath the threshold of the house.",
    hebrewTokenPairs: [["הם", "הֵם"], ["קברו", "קָבְרוּ"], ["את", "אֶת"], ["הקערה", "הַקְּעָרָה"], ["הפוכה", "הֲפוּכָה"], ["מתחת", "מִתַּחַת"], ["לסף", "לְסַף"], ["הבית", "הַבַּיִת"]],
    englishTokens: ["They", "buried", "the", "bowl", "upside down", "beneath", "the threshold", "of the house"],
    hebrewDistractorPairs: [["אנחנו", "אֲנַחְנוּ"], ["הרמנו", "הֵרַמְנוּ"], ["הקמיע", "הַקָּמֵעַ"], ["בעליית הגג", "בַּעֲלִיַּת הַגָּג"]],
    englishDistractors: ["We", "lifted", "the amulet", "in the attic"],
    notes: "Incantation bowls were often buried upside down beneath floors or thresholds. סף is a threshold."
  }),
  buildReviewedSentence({
    id: "inbal_04", emoji: "✍️", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "ענבל מעתיקה נוסחת הגנה על החרס.",
    hebrewNiqqud: "עִנְבָּל מַעְתִּיקָה נֻסְחַת הֲגָנָה עַל הַחֶרֶס.",
    english: "Inbal copies a protective formula onto the pottery.",
    hebrewTokenPairs: [["ענבל", "עִנְבָּל"], ["מעתיקה", "מַעְתִּיקָה"], ["נוסחת הגנה", "נֻסְחַת הֲגָנָה"], ["על", "עַל"], ["החרס", "הַחֶרֶס"]],
    englishTokens: ["Inbal", "copies", "a protective formula", "onto", "the pottery"],
    hebrewDistractorPairs: [["איתמר", "אִיתָמָר"], ["מוחק", "מוֹחֵק"], ["שיר", "שִׁיר"], ["הנייר", "הַנְּיָר"]],
    englishDistractors: ["Itamar", "erases", "a song", "the paper"],
    notes: "נוסחה is a formula; in a construct phrase it becomes נוסחת. חרס is pottery or fired clay."
  }),
  buildReviewedSentence({
    id: "inbal_05", emoji: "🧿", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הקמיע אמור להגן על הבית מעין הרע.",
    hebrewNiqqud: "הַקָּמֵעַ אָמוּר לְהָגֵן עַל הַבַּיִת מֵעַיִן הָרַע.",
    english: "The amulet is supposed to protect the house from the evil eye.",
    hebrewTokenPairs: [["הקמיע", "הַקָּמֵעַ"], ["אמור", "אָמוּר"], ["להגן", "לְהָגֵן"], ["על", "עַל"], ["הבית", "הַבַּיִת"], ["מעין הרע", "מֵעַיִן הָרַע"]],
    englishTokens: ["The amulet", "is supposed", "to protect", "the house", "from", "the evil eye"],
    hebrewDistractorPairs: [["הציור", "הַצִּיּוּר"], ["עלול", "עָלוּל"], ["לפתוח", "לִפְתֹּחַ"], ["החנות", "הַחֲנוּת"]],
    englishDistractors: ["The painting", "might", "to open", "the shop"],
    notes: "אמור + infinitive expresses 'is supposed to.' עין הרע is the evil eye."
  }),
  buildReviewedSentence({
    id: "inbal_06", emoji: "🌙", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "סבתא שלה פותרת חלומות, אבל מזהירה שסמל אינו נבואה.",
    hebrewNiqqud: "סָבְתָא שֶׁלָּהּ פּוֹתֶרֶת חֲלוֹמוֹת, אֲבָל מַזְהִירָה שֶׁסֵּמֶל אֵינוֹ נְבוּאָה.",
    english: "Her grandmother interprets dreams but warns that a symbol is not a prophecy.",
    hebrewTokenPairs: [["סבתא שלה", "סָבְתָא שֶׁלָּהּ"], ["פותרת", "פּוֹתֶרֶת"], ["חלומות", "חֲלוֹמוֹת"], ["אבל", "אֲבָל"], ["מזהירה", "מַזְהִירָה"], ["שסמל", "שֶׁסֵּמֶל"], ["אינו", "אֵינוֹ"], ["נבואה", "נְבוּאָה"]],
    englishTokens: ["Her grandmother", "interprets", "dreams", "but", "warns", "that a symbol", "is not", "a prophecy"],
    hebrewDistractorPairs: [["אחותו", "אֲחוֹתוֹ"], ["שוכחת", "שׁוֹכַחַת"], ["סיפורים", "סִפּוּרִים"], ["מבטיחה", "מַבְטִיחָה"]],
    englishDistractors: ["His sister", "forgets", "stories", "promises"],
    notes: "פתרון חלומות is dream interpretation; the traditional verb is לפתור חלום, literally 'to solve a dream.'"
  }),
  buildReviewedSentence({
    id: "inbal_07", emoji: "🕯️", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "היא הדליקה נר ושרפה קטורת לפני הטקס.",
    hebrewNiqqud: "הִיא הִדְלִיקָה נֵר וְשָׂרְפָה קְטֹרֶת לִפְנֵי הַטֶּקֶס.",
    english: "She lit a candle and burned incense before the ritual.",
    hebrewTokenPairs: [["היא", "הִיא"], ["הדליקה", "הִדְלִיקָה"], ["נר", "נֵר"], ["ושרפה", "וְשָׂרְפָה"], ["קטורת", "קְטֹרֶת"], ["לפני", "לִפְנֵי"], ["הטקס", "הַטֶּקֶס"]],
    englishTokens: ["She", "lit", "a candle", "and burned", "incense", "before", "the ritual"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["כיבה", "כִּבָּה"], ["מנורה", "מְנוֹרָה"], ["אחרי", "אַחֲרֵי"]],
    englishDistractors: ["He", "extinguished", "a lamp", "after"],
    hebrewOrderAlternates: [{
      text: "לפני הטקס היא הדליקה נר ושרפה קטורת.",
      textNiqqud: "לִפְנֵי הַטֶּקֶס הִיא הִדְלִיקָה נֵר וְשָׂרְפָה קְטֹרֶת.",
      order: [5, 6, 0, 1, 2, 3, 4],
    }],
    notes: "קטורת is incense, especially in ritual or biblical contexts."
  }),
  buildReviewedSentence({
    id: "inbal_08", emoji: "🍷", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "מברכים על היין לפני ששותים אותו.",
    hebrewNiqqud: "מְבָרְכִים עַל הַיַּיִן לִפְנֵי שֶׁשּׁוֹתִים אוֹתוֹ.",
    english: "They recite a blessing over the wine before drinking it.",
    hebrewTokenPairs: [["מברכים", "מְבָרְכִים"], ["על", "עַל"], ["היין", "הַיַּיִן"], ["לפני", "לִפְנֵי"], ["ששותים", "שֶׁשּׁוֹתִים"], ["אותו", "אוֹתוֹ"]],
    englishTokens: ["They recite", "a blessing", "over", "the wine", "before", "drinking it"],
    hebrewDistractorPairs: [["מקללים", "מְקַלְּלִים"], ["את", "אֶת"], ["המים", "הַמַּיִם"], ["אחרי", "אַחֲרֵי"]],
    englishDistractors: ["They curse", "a warning", "the water", "after"],
    hebrewOrderAlternates: [{
      text: "לפני ששותים אותו, מברכים על היין.",
      textNiqqud: "לִפְנֵי שֶׁשּׁוֹתִים אוֹתוֹ, מְבָרְכִים עַל הַיַּיִן.",
      order: [3, 4, 5, 0, 1, 2],
    }],
    notes: "לברך על means to recite a blessing over something. מברכים is the present masculine plural form."
  }),
  buildReviewedSentence({
    id: "inbal_09", emoji: "🌅", category: "professional", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "היא חזרה מהמקווה לפני השקיעה.",
    hebrewNiqqud: "הִיא חָזְרָה מֵהַמִּקְוֶה לִפְנֵי הַשְּׁקִיעָה.",
    english: "She returned from the ritual bath before sunset.",
    hebrewTokenPairs: [["היא", "הִיא"], ["חזרה", "חָזְרָה"], ["מהמקווה", "מֵהַמִּקְוֶה"], ["לפני", "לִפְנֵי"], ["השקיעה", "הַשְּׁקִיעָה"]],
    englishTokens: ["She", "returned", "from the ritual bath", "before", "sunset"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["יצא", "יָצָא"], ["מהספרייה", "מֵהַסִּפְרִיָּה"], ["בזריחה", "בַּזְּרִיחָה"]],
    englishDistractors: ["He", "left", "from the library", "at sunrise"],
    hebrewOrderAlternates: [{
      text: "לפני השקיעה היא חזרה מהמקווה.",
      textNiqqud: "לִפְנֵי הַשְּׁקִיעָה הִיא חָזְרָה מֵהַמִּקְוֶה.",
      order: [3, 4, 0, 1, 2],
    }],
    notes: "מקווה is a ritual bath. מהמקווה combines מן + המקווה."
  }),
  buildReviewedSentence({
    id: "inbal_10", emoji: "🎨", category: "professional", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "כאומנית שחזרה בשאלה, היא משלבת טקסט קדוש ואמנות רחוב.",
    hebrewNiqqud: "כְּאָמָּנִית שֶׁחָזְרָה בִּשְׁאֵלָה, הִיא מְשַׁלֶּבֶת טֶקְסְט קָדוֹשׁ וְאָמָּנוּת רְחוֹב.",
    english: "As an artist who left religion, she combines sacred text and street art.",
    hebrewTokenPairs: [["כאומנית", "כְּאָמָּנִית"], ["שחזרה", "שֶׁחָזְרָה"], ["בשאלה", "בִּשְׁאֵלָה"], ["היא", "הִיא"], ["משלבת", "מְשַׁלֶּבֶת"], ["טקסט", "טֶקְסְט"], ["קדוש", "קָדוֹשׁ"], ["ואמנות רחוב", "וְאָמָּנוּת רְחוֹב"]],
    englishTokens: ["As an artist", "who left", "religion", "she", "combines", "sacred", "text", "and street art"],
    hebrewDistractorPairs: [["כמרצה", "כְּמַרְצָה"], ["דתייה", "דָּתִיָּה"], ["הוא", "הוּא"], ["מפרידה", "מַפְרִידָה"]],
    englishDistractors: ["As a lecturer", "religious", "he", "separates"],
    hebrewOrderAlternates: [{
      text: "היא משלבת טקסט קדוש ואמנות רחוב כאומנית שחזרה בשאלה.",
      textNiqqud: "הִיא מְשַׁלֶּבֶת טֶקְסְט קָדוֹשׁ וְאָמָּנוּת רְחוֹב כְּאָמָּנִית שֶׁחָזְרָה בִּשְׁאֵלָה.",
      order: [3, 4, 5, 6, 7, 0, 1, 2],
    }],
    notes: "חוזרת בשאלה is the feminine form for someone who has left an Orthodox religious way of life; חוזר בשאלה is masculine."
  }),
  buildReviewedSentence({
    id: "inbal_11", emoji: "👻", category: "professional", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "האגדה מספרת על דיבוק שנצמד לנשמה.",
    hebrewNiqqud: "הָאַגָּדָה מְסַפֶּרֶת עַל דִּיבּוּק שֶׁנִּצְמַד לַנְּשָׁמָה.",
    english: "The legend tells of a dybbuk that clung to a soul.",
    hebrewTokenPairs: [["האגדה", "הָאַגָּדָה"], ["מספרת", "מְסַפֶּרֶת"], ["על", "עַל"], ["דיבוק", "דִּיבּוּק"], ["שנצמד", "שֶׁנִּצְמַד"], ["לנשמה", "לַנְּשָׁמָה"]],
    englishTokens: ["The legend", "tells", "of", "a dybbuk", "that clung", "to a soul"],
    hebrewDistractorPairs: [["המחקר", "הַמֶּחְקָר"], ["מוכיח", "מוֹכִיחַ"], ["מלאך", "מַלְאָךְ"], ["שהתרחק", "שֶׁהִתְרַחֵק"]],
    englishDistractors: ["The study", "proves", "an angel", "that fled"],
    notes: "In Jewish folklore, a דיבוק is a possessing spirit. The sentence presents the idea as legend, not fact."
  }),
  buildReviewedSentence({
    id: "inbal_12", emoji: "🎲", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הם מתווכחים אם זה צירוף מקרים או אות מבשר.",
    hebrewNiqqud: "הֵם מִתְוַכְּחִים אִם זֶה צֵרוּף מִקְרִים אוֹ אוֹת מְבַשֵּׂר.",
    english: "They debate whether this is a coincidence or an omen.",
    hebrewTokenPairs: [["הם", "הֵם"], ["מתווכחים", "מִתְוַכְּחִים"], ["אם", "אִם"], ["זה", "זֶה"], ["צירוף מקרים", "צֵרוּף מִקְרִים"], ["או", "אוֹ"], ["אות מבשר", "אוֹת מְבַשֵּׂר"]],
    englishTokens: ["They", "debate", "whether", "this is", "a coincidence", "or", "an omen"],
    hebrewDistractorPairs: [["אנחנו", "אֲנַחְנוּ"], ["מסכימים", "מַסְכִּימִים"], ["למה", "לָמָּה"], ["הוכחה", "הוֹכָחָה"]],
    englishDistractors: ["We", "agree", "why", "proof"],
    notes: "צירוף מקרים is a coincidence; אות מבשר is an omen or portent."
  }),
  buildReviewedSentence({
    id: "inbal_13", emoji: "🧠", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "האינטואיציה שלה אומרת לחכות, אבל הראיות מצביעות על פעולה.",
    hebrewNiqqud: "הָאִינְטוּאִיצְיָה שֶׁלָּהּ אוֹמֶרֶת לְחַכּוֹת, אֲבָל הָרְאָיוֹת מַצְבִּיעוֹת עַל פְּעֻלָּה.",
    english: "Her intuition says to wait but the evidence points toward action.",
    hebrewTokenPairs: [["האינטואיציה שלה", "הָאִינְטוּאִיצְיָה שֶׁלָּהּ"], ["אומרת", "אוֹמֶרֶת"], ["לחכות", "לְחַכּוֹת"], ["אבל", "אֲבָל"], ["הראיות", "הָרְאָיוֹת"], ["מצביעות", "מַצְבִּיעוֹת"], ["על", "עַל"], ["פעולה", "פְּעֻלָּה"]],
    englishTokens: ["Her intuition", "says", "to wait", "but", "the evidence", "points", "toward", "action"],
    hebrewDistractorPairs: [["הפחד שלו", "הַפַּחַד שֶׁלּוֹ"], ["מבקש", "מְבַקֵּשׁ"], ["לברוח", "לִבְרֹחַ"], ["השמועה", "הַשְּׁמוּעָה"]],
    englishDistractors: ["His fear", "asks", "to flee", "the rumor"],
    notes: "This sentence deliberately contrasts intuition with evidence without dismissing either vocabulary domain."
  }),
  buildReviewedSentence({
    id: "inbal_14", emoji: "🎶", category: "formal", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אפשר ללחוש תפילה ואפשר גם לשיר אותה.",
    hebrewNiqqud: "אֶפְשָׁר לִלְחֹשׁ תְּפִלָּה וְאֶפְשָׁר גַּם לָשִׁיר אוֹתָהּ.",
    english: "A prayer can be whispered and it can also be sung.",
    hebrewTokenPairs: [["אפשר", "אֶפְשָׁר"], ["ללחוש", "לִלְחֹשׁ"], ["תפילה", "תְּפִלָּה"], ["ואפשר", "וְאֶפְשָׁר"], ["גם", "גַּם"], ["לשיר", "לָשִׁיר"], ["אותה", "אוֹתָהּ"]],
    englishTokens: ["A prayer", "can", "be whispered", "and it", "can", "also", "be sung"],
    hebrewDistractorPairs: [["אסור", "אָסוּר"], ["לצעוק", "לִצְעֹק"], ["קללה", "קְלָלָה"], ["אותו", "אוֹתוֹ"]],
    englishDistractors: ["A curse", "must", "be shouted", "him"],
    notes: "אותה refers back to the feminine noun תפילה."
  }),
  buildReviewedSentence({
    id: "inbal_15", emoji: "🗝️", category: "formal", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "לכל קללה בסיפור יש פרצה שמבטלת אותה.",
    hebrewNiqqud: "לְכָל קְלָלָה בַּסִּפּוּר יֵשׁ פִּרְצָה שֶׁמְּבַטֶּלֶת אוֹתָהּ.",
    english: "Every curse in the story has a loophole that cancels it.",
    hebrewTokenPairs: [["לכל", "לְכָל"], ["קללה", "קְלָלָה"], ["בסיפור", "בַּסִּפּוּר"], ["יש", "יֵשׁ"], ["פרצה", "פִּרְצָה"], ["שמבטלת", "שֶׁמְּבַטֶּלֶת"], ["אותה", "אוֹתָהּ"]],
    englishTokens: ["Every", "curse", "in the story", "has", "a loophole", "that cancels", "it"],
    hebrewDistractorPairs: [["לאף", "לְאַף"], ["ברכה", "בְּרָכָה"], ["במחקר", "בַּמֶּחְקָר"], ["מחזקת", "מְחַזֶּקֶת"]],
    englishDistractors: ["No", "blessing", "in the study", "strengthens"],
    hebrewOrderAlternates: [{
      text: "בסיפור לכל קללה יש פרצה שמבטלת אותה.",
      textNiqqud: "בַּסִּפּוּר לְכָל קְלָלָה יֵשׁ פִּרְצָה שֶׁמְּבַטֶּלֶת אוֹתָהּ.",
      order: [2, 0, 1, 3, 4, 5, 6],
    }],
    notes: "פרצה is a gap or loophole. The sentence refers to story logic, not a real supernatural claim."
  }),
  buildReviewedSentence({
    id: "inbal_16", emoji: "🏠", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "בירכנו את הסטודיו החדש ותלינו קמיע ליד הדלת.",
    hebrewNiqqud: "בֵּרַכְנוּ אֶת הַסְטוּדְיוֹ הֶחָדָשׁ וְתָלִינוּ קָמֵעַ לְיַד הַדֶּלֶת.",
    english: "We blessed the new studio and hung an amulet beside the door.",
    hebrewTokenPairs: [["בירכנו", "בֵּרַכְנוּ"], ["את", "אֶת"], ["הסטודיו", "הַסְטוּדְיוֹ"], ["החדש", "הֶחָדָשׁ"], ["ותלינו", "וְתָלִינוּ"], ["קמיע", "קָמֵעַ"], ["ליד", "לְיַד"], ["הדלת", "הַדֶּלֶת"]],
    englishTokens: ["We blessed", "the", "new", "studio", "and hung", "an amulet", "beside", "the door"],
    hebrewDistractorPairs: [["פתחנו", "פָּתַחְנוּ"], ["הגלריה", "הַגָּלֶרְיָה"], ["הישן", "הַיָּשָׁן"], ["והסרנו", "וְהֵסַרְנוּ"]],
    englishDistractors: ["We opened", "gallery", "old", "and removed"],
    notes: "בירכנו is 'we blessed,' a past-tense form of לברך. קמיע is a protective amulet."
  }),
  buildReviewedSentence({
    id: "inbal_17", emoji: "🌳", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "המקובלים מסדרים את עשר הספירות בתרשים שנקרא עץ החיים.",
    hebrewNiqqud: "הַמְּקוּבָּלִים מְסַדְּרִים אֶת עֶשֶׂר הַסְּפִירוֹת בְּתַרְשִׁים שֶׁנִּקְרָא עֵץ הַחַיִּים.",
    english: "The kabbalists arrange the ten sefirot in a diagram called the Tree of Life.",
    hebrewTokenPairs: [["המקובלים", "הַמְּקוּבָּלִים"], ["מסדרים", "מְסַדְּרִים"], ["את עשר הספירות", "אֶת עֶשֶׂר הַסְּפִירוֹת"], ["בתרשים", "בְּתַרְשִׁים"], ["שנקרא", "שֶׁנִּקְרָא"], ["עץ החיים", "עֵץ הַחַיִּים"]],
    englishTokens: ["The kabbalists", "arrange", "the ten sefirot", "in a diagram", "called", "the Tree of Life"],
    hebrewDistractorPairs: [["הארכאולוגים", "הָאַרְכֵאוֹלוֹגִים"], ["שוברים", "שׁוֹבְרִים"], ["בספר", "בְּסֵפֶר"], ["גן עדן", "גַּן עֵדֶן"]],
    englishDistractors: ["The archaeologists", "break", "in a book", "the Garden of Eden"],
    notes: "ספירה (plural ספירות) is an emanation in Kabbalah. עץ החיים is the standard diagram arranging the ten of them."
  }),
  buildReviewedSentence({
    id: "inbal_18", emoji: "⚖️", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "חסד בלי גבורה הוא שפע בלי גבול.",
    hebrewNiqqud: "חֶסֶד בְּלִי גְּבוּרָה הוּא שֶׁפַע בְּלִי גְּבוּל.",
    english: "Kindness without severity is abundance without limit.",
    hebrewTokenPairs: [["חסד", "חֶסֶד"], ["בלי", "בְּלִי"], ["גבורה", "גְּבוּרָה"], ["הוא", "הוּא"], ["שפע", "שֶׁפַע"], ["בלי גבול", "בְּלִי גְּבוּל"]],
    englishTokens: ["Kindness", "without", "severity", "is", "abundance", "without limit"],
    hebrewDistractorPairs: [["רחמים", "רַחֲמִים"], ["עם", "עִם"], ["דין", "דִּין"], ["חוסר", "חֹסֶר"]],
    englishDistractors: ["mercy", "with", "judgment", "a lack"],
    notes: "חסד and גבורה are the fourth and fifth sefirot, conventionally read as a pair holding each other in balance."
  }),
  buildReviewedSentence({
    id: "inbal_19", emoji: "📖", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הזוהר נכתב בארמית ומיוחס לרבי שמעון בר יוחאי.",
    hebrewNiqqud: "הַזֹּהַר נִכְתַּב בַּאֲרָמִית וּמְיוּחָס לְרַבִּי שִׁמְעוֹן בַּר יוֹחַאי.",
    english: "The Zohar was written in Aramaic and is attributed to Rabbi Shimon bar Yochai.",
    hebrewTokenPairs: [["הזוהר", "הַזֹּהַר"], ["נכתב", "נִכְתַּב"], ["בארמית", "בַּאֲרָמִית"], ["ומיוחס", "וּמְיוּחָס"], ["לרבי שמעון", "לְרַבִּי שִׁמְעוֹן"], ["בר יוחאי", "בַּר יוֹחַאי"]],
    englishTokens: ["The Zohar", "was written", "in Aramaic", "and is attributed", "to Rabbi Shimon", "bar Yochai"],
    hebrewDistractorPairs: [["התלמוד", "הַתַּלְמוּד"], ["נקרא", "נִקְרָא"], ["בעברית", "בְּעִבְרִית"], ["ונדפס", "וְנִדְפַּס"]],
    englishDistractors: ["The Talmud", "is read", "in Hebrew", "and was printed"],
    notes: "מיוחס means 'attributed to,' which is the careful word here: traditional attribution names Shimon bar Yochai, while scholarship places the text in thirteenth-century Castile."
  }),
  buildReviewedSentence({
    id: "inbal_20", emoji: "♾️", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "אין סוף הוא השם לאלוהות שלפני כל צמצום.",
    hebrewNiqqud: "אֵין סוֹף הוּא הַשֵּׁם לָאֱלֹהוּת שֶׁלִּפְנֵי כָּל צִמְצוּם.",
    english: "Ein Sof is the name for the divinity that precedes any contraction.",
    hebrewTokenPairs: [["אין סוף", "אֵין סוֹף"], ["הוא", "הוּא"], ["השם", "הַשֵּׁם"], ["לאלוהות", "לָאֱלֹהוּת"], ["שלפני", "שֶׁלִּפְנֵי"], ["כל צמצום", "כָּל צִמְצוּם"]],
    englishTokens: ["Ein Sof", "is", "the name", "for the divinity", "that precedes", "any contraction"],
    hebrewDistractorPairs: [["הבריאה", "הַבְּרִיאָה"], ["הסוד", "הַסּוֹד"], ["לעולם", "לָעוֹלָם"], ["שאחרי", "שֶׁאַחֲרֵי"]],
    englishDistractors: ["the creation", "the secret", "for the world", "that follows"],
    notes: "אין סוף literally 'without end.' צמצום is the contraction by which the infinite makes room for a world."
  }),
  buildReviewedSentence({
    id: "inbal_21", emoji: "🔢", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "בגימטריה לכל אות יש מספר.",
    hebrewNiqqud: "בְּגִימַטְרִיָּה לְכָל אוֹת יֵשׁ מִסְפָּר.",
    english: "In gematria every letter has a number.",
    hebrewTokenPairs: [["בגימטריה", "בְּגִימַטְרִיָּה"], ["לכל אות", "לְכָל אוֹת"], ["יש", "יֵשׁ"], ["מספר", "מִסְפָּר"]],
    englishTokens: ["In gematria", "every letter", "has", "a number"],
    hebrewDistractorPairs: [["בקבלה", "בַּקַּבָּלָה"], ["לכל מילה", "לְכָל מִילָּה"], ["אין", "אֵין"], ["סוד", "סוֹד"]],
    englishDistractors: ["In Kabbalah", "every word", "there is no", "a secret"],
    hebrewOrderAlternates: [
      {
        text: "לכל אות יש מספר בגימטריה.",
        textNiqqud: "לְכָל אוֹת יֵשׁ מִסְפָּר בְּגִימַטְרִיָּה.",
        order: [1, 2, 3, 0],
      },
    ],
    notes: "The adverbial בגימטריה can open or close the clause; both orders are natural."
  }),
  buildReviewedSentence({
    id: "inbal_22", emoji: "🌍", category: "professional", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "תיקון עולם הוא מושג מהקבלה שהפוליטיקה אימצה.",
    hebrewNiqqud: "תִּיקּוּן עוֹלָם הוּא מוּשָּׂג מֵהַקַּבָּלָה שֶׁהַפּוֹלִיטִיקָה אִימְּצָה.",
    english: "Tikkun olam is a concept from Kabbalah that politics adopted.",
    hebrewTokenPairs: [["תיקון עולם", "תִּיקּוּן עוֹלָם"], ["הוא", "הוּא"], ["מושג", "מוּשָּׂג"], ["מהקבלה", "מֵהַקַּבָּלָה"], ["שהפוליטיקה", "שֶׁהַפּוֹלִיטִיקָה"], ["אימצה", "אִימְּצָה"]],
    englishTokens: ["Tikkun olam", "is", "a concept", "from Kabbalah", "that politics", "adopted"],
    hebrewDistractorPairs: [["גלגול נשמות", "גִּלְגּוּל נְשָׁמוֹת"], ["מנהג", "מִנְהָג"], ["מהתלמוד", "מֵהַתַּלְמוּד"], ["ששכחו", "שֶׁשָּׁכְחוּ"]],
    englishDistractors: ["Reincarnation", "a custom", "from the Talmud", "that they forgot"],
    notes: "תיקון עולם begins as a Lurianic term for repairing a broken creation and is now used mainly as social-justice language."
  }),
  buildReviewedSentence({
    id: "inbal_23", emoji: "🕊️", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "השכינה היא הנוכחות האלוהית, והמקובלים תיארו אותה כנקבה.",
    hebrewNiqqud: "הַשְּׁכִינָה הִיא הַנּוֹכְחוּת הָאֱלֹהִית, וְהַמְּקוּבָּלִים תֵּיאֲרוּ אוֹתָהּ כִּנְקֵבָה.",
    english: "The Shekhinah is the divine presence, and the kabbalists described it as female.",
    hebrewTokenPairs: [["השכינה", "הַשְּׁכִינָה"], ["היא", "הִיא"], ["הנוכחות האלוהית", "הַנּוֹכְחוּת הָאֱלֹהִית"], ["והמקובלים", "וְהַמְּקוּבָּלִים"], ["תיארו אותה", "תֵּיאֲרוּ אוֹתָהּ"], ["כנקבה", "כִּנְקֵבָה"]],
    englishTokens: ["The Shekhinah", "is", "the divine presence", "and the kabbalists", "described it", "as female"],
    hebrewDistractorPairs: [["הנשמה", "הַנְּשָׁמָה"], ["החוכמה", "הַחוֹכְמָה"], ["והחוקרים", "וְהַחוֹקְרִים"], ["כזכר", "כְּזָכָר"]],
    englishDistractors: ["The soul", "the wisdom", "and the researchers", "as male"],
    notes: "שכינה, from the root ש.כ.נ ('to dwell'), is grammatically feminine, and Kabbalah treats that gender as meaningful rather than incidental."
  }),
  buildReviewedSentence({
    id: "inbal_24", emoji: "🙏", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "בלי כוונה התפילה היא רק טקסט.",
    hebrewNiqqud: "בְּלִי כַּוָּנָה הַתְּפִילָּה הִיא רַק טֶקְסְט.",
    english: "Without intention, prayer is only text.",
    hebrewTokenPairs: [["בלי כוונה", "בְּלִי כַּוָּנָה"], ["התפילה", "הַתְּפִילָּה"], ["היא", "הִיא"], ["רק טקסט", "רַק טֶקְסְט"]],
    englishTokens: ["Without intention", "prayer", "is", "only text"],
    hebrewDistractorPairs: [["בלי ברכה", "בְּלִי בְּרָכָה"], ["המזמור", "הַמִּזְמוֹר"], ["אינה", "אֵינָהּ"], ["עוד מנהג", "עוֹד מִנְהָג"]],
    englishDistractors: ["Without a blessing", "the psalm", "is not", "another custom"],
    hebrewOrderAlternates: [
      {
        text: "התפילה היא רק טקסט בלי כוונה.",
        textNiqqud: "הַתְּפִילָּה הִיא רַק טֶקְסְט בְּלִי כַּוָּנָה.",
        order: [1, 2, 3, 0],
      },
    ],
    notes: "כוונה is the directed intention that is supposed to make a recited text into prayer."
  }),
  buildReviewedSentence({
    id: "inbal_25", emoji: "🌾", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "רבי נחמן לימד התבודדות: לדבר עם אלוהים לבד בשדה.",
    hebrewNiqqud: "רֶבִּי נַחְמָן לִימֵּד הִתְבּוֹדְדוּת: לְדַבֵּר עִם אֱלֹהִים לְבַד בַּשָּׂדֶה.",
    english: "Rabbi Nachman taught hitbodedut: speaking with God alone in a field.",
    hebrewTokenPairs: [["רבי נחמן", "רֶבִּי נַחְמָן"], ["לימד", "לִימֵּד"], ["התבודדות", "הִתְבּוֹדְדוּת"], ["לדבר", "לְדַבֵּר"], ["עם אלוהים", "עִם אֱלֹהִים"], ["לבד", "לְבַד"], ["בשדה", "בַּשָּׂדֶה"]],
    englishTokens: ["Rabbi Nachman", "taught", "hitbodedut", "speaking", "with God", "alone", "in a field"],
    hebrewDistractorPairs: [["הבעל שם טוב", "הַבַּעַל שֵׁם טוֹב"], ["אסר", "אָסַר"], ["לצעוק", "לִצְעוֹק"], ["בבית הכנסת", "בְּבֵית הַכְּנֶסֶת"]],
    englishDistractors: ["The Baal Shem Tov", "forbade", "to shout", "in the synagogue"],
    notes: "התבודדות is Rabbi Nachman of Breslov's practice of unscripted solitary talk with God, usually outdoors."
  }),
  buildReviewedSentence({
    id: "inbal_26", emoji: "🌑", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "לפי הקבלה הקליפות מסתירות את האור.",
    hebrewNiqqud: "לְפִי הַקַּבָּלָה הַקְּלִיפּוֹת מַסְתִּירוֹת אֶת הָאוֹר.",
    english: "According to Kabbalah, the husks conceal the light.",
    hebrewTokenPairs: [["לפי הקבלה", "לְפִי הַקַּבָּלָה"], ["הקליפות", "הַקְּלִיפּוֹת"], ["מסתירות", "מַסְתִּירוֹת"], ["את האור", "אֶת הָאוֹר"]],
    englishTokens: ["According to Kabbalah", "the husks", "conceal", "the light"],
    hebrewDistractorPairs: [["לפי המסורת", "לְפִי הַמָּסוֹרֶת"], ["המלאכים", "הַמַּלְאָכִים"], ["שומרות", "שׁוֹמְרוֹת"], ["את הסוד", "אֶת הַסּוֹד"]],
    englishDistractors: ["According to tradition", "the angels", "guard", "the secret"],
    hebrewOrderAlternates: [
      {
        text: "הקליפות מסתירות את האור לפי הקבלה.",
        textNiqqud: "הַקְּלִיפּוֹת מַסְתִּירוֹת אֶת הָאוֹר לְפִי הַקַּבָּלָה.",
        order: [1, 2, 3, 0],
      },
    ],
    notes: "קליפה literally 'peel' or 'husk'; in Kabbalah the קליפות are the shells that hide divine light."
  }),
  buildReviewedSentence({
    id: "inbal_27", emoji: "👭", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אחותי חזרה בתשובה ואני נשארתי חילוני.",
    hebrewNiqqud: "אֲחוֹתִי חָזְרָה בִּתְשׁוּבָה וַאֲנִי נִשְׁאַרְתִּי חִילּוֹנִי.",
    english: "My sister returned to observance and I stayed secular.",
    hebrewTokenPairs: [["אחותי", "אֲחוֹתִי"], ["חזרה", "חָזְרָה"], ["בתשובה", "בִּתְשׁוּבָה"], ["ואני", "וַאֲנִי"], ["נשארתי", "נִשְׁאַרְתִּי"], ["חילוני", "חִילּוֹנִי"]],
    englishTokens: ["My sister", "returned", "to observance", "and I", "stayed", "secular"],
    hebrewDistractorPairs: [["אחי", "אָחִי"], ["דודתי", "דּוֹדָתִי"], ["לכפירה", "לִכְפִירָה"], ["עזבתי", "עָזַבְתִּי"], ["חרדי", "חֲרֵדִי"]],
    englishDistractors: ["My brother", "My aunt", "to heresy", "I left", "ultra-Orthodox"],
    notes: "חזר בתשובה is the fixed phrase for becoming religiously observant; חילוני is its secular counterpart. The pair names the two sides of the seam."
  }),
  buildReviewedSentence({
    id: "inbal_28", emoji: "🧢", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הוא מוריד את הכיפה כשהוא נוסע לתל אביב.",
    hebrewNiqqud: "הוּא מוֹרִיד אֶת הַכִּיפָּה כְּשֶׁהוּא נוֹסֵעַ לְתֵל אָבִיב.",
    english: "He removes his skullcap when he travels to Tel Aviv.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["מוריד", "מוֹרִיד"], ["את הכיפה", "אֶת הַכִּיפָּה"], ["כשהוא", "כְּשֶׁהוּא"], ["נוסע", "נוֹסֵעַ"], ["לתל אביב", "לְתֵל אָבִיב"]],
    englishTokens: ["He", "removes", "his skullcap", "when he", "travels", "to Tel Aviv"],
    hebrewDistractorPairs: [["לובש", "לוֹבֵשׁ"], ["את הטלית", "אֶת הַטַּלִּית"], ["כשאני", "כְּשֶׁאֲנִי"], ["לירושלים", "לִירוּשָׁלַיִם"], ["תמיד", "תָּמִיד"]],
    englishDistractors: ["wears", "his prayer shawl", "when I", "to Jerusalem", "always"],
    notes: "מוריד את הכיפה is the everyday way to describe stepping out of religious presentation, not removing a hat."
  }),
  buildReviewedSentence({
    id: "inbal_29", emoji: "🍽️", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "בבית הזה שומרים כשרות אבל לא שומרים שבת.",
    hebrewNiqqud: "בַּבַּיִת הַזֶּה שׁוֹמְרִים כַּשְׁרוּת אֲבָל לֹא שׁוֹמְרִים שַׁבָּת.",
    english: "In this house they keep kosher but they do not keep Shabbat.",
    hebrewTokenPairs: [["בבית הזה", "בַּבַּיִת הַזֶּה"], ["שומרים", "שׁוֹמְרִים"], ["כשרות", "כַּשְׁרוּת"], ["אבל", "אֲבָל"], ["לא שומרים", "לֹא שׁוֹמְרִים"], ["שבת", "שַׁבָּת"]],
    englishTokens: ["In this house", "they keep", "kosher", "but", "they do not keep", "Shabbat"],
    hebrewDistractorPairs: [["במשפחה שלי", "בַּמִּשְׁפָּחָה שֶׁלִּי"], ["מקפידים", "מַקְפִּידִים"], ["על צניעות", "עַל צְנִיעוּת"], ["חג", "חַג"], ["תמיד", "תָּמִיד"]],
    englishDistractors: ["In my family", "they are strict", "about modesty", "a holiday", "always"],
    notes: "שומר כשרות and שומר שבת are separate observances, and keeping one without the other is an ordinary Israeli arrangement."
  }),
  buildReviewedSentence({
    id: "inbal_30", emoji: "🎖️", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אחרי הצבא הוא הפסיק להתפלל ונשאר חילוני.",
    hebrewNiqqud: "אַחֲרֵי הַצָּבָא הוּא הִפְסִיק לְהִתְפַּלֵּל וְנִשְׁאַר חִילּוֹנִי.",
    english: "After the army he stopped praying and stayed secular.",
    hebrewTokenPairs: [["אחרי הצבא", "אַחֲרֵי הַצָּבָא"], ["הוא", "הוּא"], ["הפסיק", "הִפְסִיק"], ["להתפלל", "לְהִתְפַּלֵּל"], ["ונשאר", "וְנִשְׁאַר"], ["חילוני", "חִילּוֹנִי"]],
    englishTokens: ["After the army", "he", "stopped", "praying", "and stayed", "secular"],
    hebrewDistractorPairs: [["לפני הצבא", "לִפְנֵי הַצָּבָא"], ["התחיל", "הִתְחִיל"], ["לצום", "לָצוּם"], ["דתי", "דָּתִי"], ["מיד", "מִיָּד"]],
    englishDistractors: ["Before the army", "started", "to fast", "religious", "immediately"],
    notes: "Military service is the most common point at which Israelis describe leaving or entering observance."
  }),
  buildReviewedSentence({
    id: "inbal_31", emoji: "🕯️", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הסבתא שלי מסורתית: היא מדליקה נרות ונוסעת בשבת.",
    hebrewNiqqud: "הַסַּבְתָּא שֶׁלִּי מָסוֹרְתִּית: הִיא מַדְלִיקָה נֵרוֹת וְנוֹסַעַת בְּשַׁבָּת.",
    english: "My grandmother is traditional: she lights candles and drives on Shabbat.",
    hebrewTokenPairs: [["הסבתא שלי", "הַסַּבְתָּא שֶׁלִּי"], ["מסורתית", "מָסוֹרְתִּית"], ["היא", "הִיא"], ["מדליקה", "מַדְלִיקָה"], ["נרות", "נֵרוֹת"], ["ונוסעת", "וְנוֹסַעַת"], ["בשבת", "בְּשַׁבָּת"]],
    englishTokens: ["My grandmother", "is traditional", "she", "lights", "candles", "and drives", "on Shabbat"],
    hebrewDistractorPairs: [["הדודה שלי", "הַדּוֹדָה שֶׁלִּי"], ["חילונית", "חִילּוֹנִית"], ["מכבה", "מְכַבָּה"], ["סליחות", "סְלִיחוֹת"], ["בחג", "בְּחַג"]],
    englishDistractors: ["My aunt", "secular", "extinguishes", "penitential prayers", "on a holiday"],
    notes: "מסורתי names the large Israeli middle ground: ritual is kept selectively rather than by halakhic rule."
  }),
  buildReviewedSentence({
    id: "inbal_32", emoji: "💍", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "השידוך נקבע בלי שהם נפגשו קודם.",
    hebrewNiqqud: "הַשִּׁידּוּךְ נִקְבַּע בְּלִי שֶׁהֵם נִפְגְּשׁוּ קוֹדֶם.",
    english: "The match was set without them meeting first.",
    hebrewTokenPairs: [["השידוך", "הַשִּׁידּוּךְ"], ["נקבע", "נִקְבַּע"], ["בלי", "בְּלִי"], ["שהם", "שֶׁהֵם"], ["נפגשו", "נִפְגְּשׁוּ"], ["קודם", "קוֹדֶם"]],
    englishTokens: ["The match", "was set", "without", "them", "meeting", "first"],
    hebrewDistractorPairs: [["החתונה", "הַחֲתוּנָּה"], ["בוטלה", "בּוּטְלָה"], ["אחרי", "אַחֲרֵי"], ["מיד", "מִיָּד"], ["שוב", "שׁוּב"]],
    englishDistractors: ["The wedding", "was canceled", "after", "immediately", "again"],
    notes: "שידוך is an arranged introduction, still standard in religious communities and the source of the verb להשתדך."
  }),
  buildReviewedSentence({
    id: "inbal_33", emoji: "🧿", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "שמו קמע מעל המיטה כדי להרחיק מזיקים.",
    hebrewNiqqud: "שָׂמוּ קָמֵעַ מֵעַל הַמִּיטָּה כְּדֵי לְהַרְחִיק מַזִּיקִים.",
    english: "They put an amulet over the bed in order to repel harmful spirits.",
    hebrewTokenPairs: [["שמו", "שָׂמוּ"], ["קמע", "קָמֵעַ"], ["מעל המיטה", "מֵעַל הַמִּיטָּה"], ["כדי", "כְּדֵי"], ["להרחיק", "לְהַרְחִיק"], ["מזיקים", "מַזִּיקִים"]],
    englishTokens: ["They put", "an amulet", "over the bed", "in order", "to repel", "harmful spirits"],
    hebrewDistractorPairs: [["תלו", "תָּלוּ"], ["מזוזה", "מְזוּזָה"], ["ליד הדלת", "לְיַד הַדֶּלֶת"], ["לגרש", "לְגָרֵשׁ"], ["שדים", "שֵׁדִים"]],
    englishDistractors: ["They hung", "a mezuzah", "by the door", "to expel", "demons"],
    notes: "מזיק is a harmful spirit in folk belief, distinct from שד; protective amulets over a bed are attested folk practice, not halakha."
  }),
  buildReviewedSentence({
    id: "inbal_34", emoji: "🌙", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "לפי האגדה לילית באה בלילה לחדר של תינוקות.",
    hebrewNiqqud: "לְפִי הָאַגָּדָה לִילִית בָּאָה בַּלַּיְלָה לַחֶדֶר שֶׁל תִּינוֹקוֹת.",
    english: "According to legend Lilith comes at night to the room of babies.",
    hebrewTokenPairs: [["לפי האגדה", "לְפִי הָאַגָּדָה"], ["לילית", "לִילִית"], ["באה", "בָּאָה"], ["בלילה", "בַּלַּיְלָה"], ["לחדר", "לַחֶדֶר"], ["של תינוקות", "שֶׁל תִּינוֹקוֹת"]],
    englishTokens: ["According to legend", "Lilith", "comes", "at night", "to the room", "of babies"],
    hebrewDistractorPairs: [["לפי המדרש", "לְפִי הַמִּדְרָשׁ"], ["מכשפה", "מְכַשֵּׁפָה"], ["בבוקר", "בַּבֹּקֶר"], ["לגינה", "לַגִּינָּה"], ["של זקנים", "שֶׁל זְקֵנִים"]],
    englishDistractors: ["According to midrash", "a witch", "in the morning", "to the garden", "of elders"],
    notes: "לפי האגדה marks this as folklore rather than doctrine. Lilith appears as a child-threatening figure in late-antique amulets and folk texts."
  }),
  buildReviewedSentence({
    id: "inbal_35", emoji: "🪵", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "סבתא אמרה בלי עין הרע ונגעה בעץ.",
    hebrewNiqqud: "סַבְתָּא אָמְרָה בְּלִי עַיִן הָרַע וְנָגְעָה בָּעֵץ.",
    english: "Grandma said no jinx and touched wood.",
    hebrewTokenPairs: [["סבתא", "סַבְתָּא"], ["אמרה", "אָמְרָה"], ["בלי עין הרע", "בְּלִי עַיִן הָרַע"], ["ונגעה", "וְנָגְעָה"], ["בעץ", "בָּעֵץ"]],
    englishTokens: ["Grandma", "said", "no jinx", "and touched", "wood"],
    hebrewDistractorPairs: [["אמא", "אִמָּא"], ["לחשה", "לָחֲשָׁה"], ["תפילת הדרך", "תְּפִילַּת הַדֶּרֶךְ"], ["וירקה", "וְיָרְקָה"], ["בקמע", "בַּקָּמֵעַ"]],
    englishDistractors: ["Mom", "whispered", "a traveller prayer", "and spat", "on an amulet"],
    notes: "בלי עין הרע is said reflexively after mentioning good fortune, exactly like English 'knock on wood'."
  }),
  buildReviewedSentence({
    id: "inbal_36", emoji: "🎩", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הקוסם עשה אחיזת עיניים והקהל האמין לו.",
    hebrewNiqqud: "הַקּוֹסֵם עָשָׂה אֲחִיזַת עֵינַיִים וְהַקָּהָל הֶאֱמִין לוֹ.",
    english: "The magician did sleight of hand and the audience believed him.",
    hebrewTokenPairs: [["הקוסם", "הַקּוֹסֵם"], ["עשה", "עָשָׂה"], ["אחיזת עיניים", "אֲחִיזַת עֵינַיִים"], ["והקהל", "וְהַקָּהָל"], ["האמין", "הֶאֱמִין"], ["לו", "לוֹ"]],
    englishTokens: ["The magician", "did", "sleight of hand", "and the audience", "believed", "him"],
    hebrewDistractorPairs: [["המקובל", "הַמְּקוּבָּל"], ["גילה", "גִּילָּה"], ["סוד גדול", "סוֹד גָּדוֹל"], ["והחוקר", "וְהַחוֹקֵר"], ["פירש", "פֵּירֵשׁ"]],
    englishDistractors: ["The kabbalist", "revealed", "a secret", "and the researcher", "interpreted"],
    notes: "אחיזת עיניים literally 'seizing the eyes' is the Hebrew term for a conjuring trick, and is used dismissively of false wonder-working."
  }),
  buildReviewedSentence({
    id: "inbal_37", emoji: "🐓", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "בערב יום כיפור נהגו לעשות כפרות עם תרנגול.",
    hebrewNiqqud: "בְּעֶרֶב יוֹם כִּיפּוּר נָהֲגוּ לַעֲשׂוֹת כַּפָּרוֹת עִם תַּרְנְגוֹל.",
    english: "On the eve of Yom Kippur they used to do the atonement rite with a rooster.",
    hebrewTokenPairs: [["בערב", "בְּעֶרֶב"], ["יום כיפור", "יוֹם כִּיפּוּר"], ["נהגו", "נָהֲגוּ"], ["לעשות", "לַעֲשׂוֹת"], ["כפרות", "כַּפָּרוֹת"], ["עם תרנגול", "עִם תַּרְנְגוֹל"]],
    englishTokens: ["On the eve", "of Yom Kippur", "they used", "to do", "the atonement rite", "with a rooster"],
    hebrewDistractorPairs: [["בבוקר", "בַּבֹּקֶר"], ["של פסח", "שֶׁל פֶּסַח"], ["שכחו", "שָׁכְחוּ"], ["לטבול", "לִטְבּוֹל"], ["עם דג", "עִם דָּג"]],
    englishDistractors: ["In the morning", "of Passover", "they forgot", "to immerse", "with a fish"],
    notes: "כפרות is the pre-Yom Kippur rite of transferring sins to a fowl; many now use money instead, and the practice has always been contested."
  }),
  buildReviewedSentence({
    id: "inbal_38", emoji: "☕", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אנשים עוד מאמינים שאפשר לנחש את העתיד בקפה.",
    hebrewNiqqud: "אֲנָשִׁים עוֹד מַאֲמִינִים שֶׁאֶפְשָׁר לְנַחֵשׁ אֶת הֶעָתִיד בַּקָּפֶה.",
    english: "People still believe that one can guess the future in coffee.",
    hebrewTokenPairs: [["אנשים", "אֲנָשִׁים"], ["עוד", "עוֹד"], ["מאמינים", "מַאֲמִינִים"], ["שאפשר", "שֶׁאֶפְשָׁר"], ["לנחש", "לְנַחֵשׁ"], ["את העתיד", "אֶת הֶעָתִיד"], ["בקפה", "בַּקָּפֶה"]],
    englishTokens: ["People", "still", "believe", "that one can", "guess", "the future", "in coffee"],
    hebrewDistractorPairs: [["מקובלים", "מְקוּבָּלִים"], ["כבר לא", "כְּבָר לֹא"], ["מכחישים", "מַכְחִישִׁים"], ["לשנות", "לְשַׁנּוֹת"], ["את הגורל", "אֶת הַגּוֹרָל"], ["בכוכבים", "בַּכּוֹכָבִים"]],
    englishDistractors: ["Kabbalists", "no longer", "deny", "to change", "fate", "in the stars"],
    notes: "Reading coffee grounds is live Israeli folk practice, and לנחש covers both 'guess' and 'divine' — the same ambiguity as ניחוש עתידות."
  }),
  buildReviewedSentence({
    id: "inbal_39", emoji: "📯", category: "formal", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "תוקעים בשופר מאה קולות בראש השנה.",
    hebrewNiqqud: "תּוֹקְעִים בַּשּׁוֹפָר מֵאָה קוֹלוֹת בְּרֹאשׁ הַשָּׁנָה.",
    english: "They blow the shofar a hundred blasts on Rosh Hashanah.",
    hebrewTokenPairs: [["תוקעים", "תּוֹקְעִים"], ["בשופר", "בַּשּׁוֹפָר"], ["מאה", "מֵאָה"], ["קולות", "קוֹלוֹת"], ["בראש השנה", "בְּרֹאשׁ הַשָּׁנָה"]],
    englishTokens: ["They blow", "the shofar", "a hundred", "blasts", "on Rosh Hashanah"],
    hebrewDistractorPairs: [["מנגנים", "מְנַגְּנִים"], ["בחלילית", "בַּחֲלִילִית"], ["אלף", "אֶלֶף"], ["שירים", "שִׁירִים"], ["בפורים", "בְּפוּרִים"]],
    englishDistractors: ["They play", "the recorder", "a thousand", "songs", "on Purim"],
    notes: "תוקעים בשופר uses ב־ for the instrument. A hundred blasts is the customary total across the Rosh Hashanah service."
  }),
  buildReviewedSentence({
    id: "inbal_40", emoji: "🍋", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הוא קונה אתרוג ולולב לפני סוכות.",
    hebrewNiqqud: "הוּא קוֹנֶה אֶתְרוֹג וְלוּלָב לִפְנֵי סוּכּוֹת.",
    english: "He buys a citron and a palm frond before Sukkot.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["קונה", "קוֹנֶה"], ["אתרוג", "אֶתְרוֹג"], ["ולולב", "וְלוּלָב"], ["לפני סוכות", "לִפְנֵי סוּכּוֹת"]],
    englishTokens: ["He", "buys", "a citron", "and a palm frond", "before Sukkot"],
    hebrewDistractorPairs: [["מוכר", "מוֹכֵר"], ["מגילה", "מְגִילָּה"], ["וטלית", "וְטַלִּית"], ["אחרי פסח", "אַחֲרֵי פֶּסַח"], ["תמיד", "תָּמִיד"]],
    englishDistractors: ["sells", "a scroll", "and a prayer shawl", "after Passover", "always"],
    notes: "אתרוג and לולב are two of the four species taken on Sukkot; buying them is an annual market ritual in itself."
  }),
  buildReviewedSentence({
    id: "inbal_41", emoji: "🕯️", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "אחרי ההבדלה כיביתי את הנר והכל היה שקט.",
    hebrewNiqqud: "אַחֲרֵי הַהַבְדָּלָה כִּיבִּיתִי אֶת הַנֵּר וְהַכֹּל הָיָה שָׁקֵט.",
    english: "After Havdalah I extinguished the candle and everything was quiet.",
    hebrewTokenPairs: [["אחרי ההבדלה", "אַחֲרֵי הַהַבְדָּלָה"], ["כיביתי", "כִּיבִּיתִי"], ["את הנר", "אֶת הַנֵּר"], ["והכל", "וְהַכֹּל"], ["היה", "הָיָה"], ["שקט", "שָׁקֵט"]],
    englishTokens: ["After Havdalah", "I extinguished", "the candle", "and everything", "was", "quiet"],
    hebrewDistractorPairs: [["אחרי הקידוש", "אַחֲרֵי הַקִּידּוּשׁ"], ["הדלקתי", "הִדְלַקְתִּי"], ["את השופר", "אֶת הַשּׁוֹפָר"], ["ואף אחד", "וְאַף אֶחָד"], ["רועש", "רוֹעֵשׁ"]],
    englishDistractors: ["After Kiddush", "I lit", "the shofar", "and nobody", "noisy"],
    notes: "הבדלה closes Shabbat and קידוש opens it — the pair is the most useful contrast in the Shabbat vocabulary."
  }),
  buildReviewedSentence({
    id: "inbal_42", emoji: "🕎", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אמא מדליקה נר נשמה ביום השנה.",
    hebrewNiqqud: "אִמָּא מַדְלִיקָה נֵר נְשָׁמָה בְּיוֹם הַשָּׁנָה.",
    english: "Mom lights a memorial candle on the anniversary.",
    hebrewTokenPairs: [["אמא", "אִמָּא"], ["מדליקה", "מַדְלִיקָה"], ["נר נשמה", "נֵר נְשָׁמָה"], ["ביום השנה", "בְּיוֹם הַשָּׁנָה"]],
    englishTokens: ["Mom", "lights", "a memorial candle", "on the anniversary"],
    hebrewDistractorPairs: [["אבא", "אַבָּא"], ["קורא", "קוֹרֵא"], ["קדיש", "קַדִּישׁ"], ["בשבת", "בַּשַּׁבָּת"], ["תמיד", "תָּמִיד"]],
    englishDistractors: ["Dad", "reads", "Kaddish", "on Shabbat", "always"],
    notes: "נר נשמה burns for a yahrzeit; יום השנה is the Hebrew-calendar anniversary of a death."
  }),
  buildReviewedSentence({
    id: "inbal_43", emoji: "👶", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "בברית המילה כולם בכו חוץ מהתינוק.",
    hebrewNiqqud: "בַּבְּרִית מִילָה כּוּלָּם בָּכוּ חוּץ מֵהַתִּינוֹק.",
    english: "At the circumcision everyone cried but not the baby.",
    hebrewTokenPairs: [["בברית המילה", "בַּבְּרִית מִילָה"], ["כולם", "כּוּלָּם"], ["בכו", "בָּכוּ"], ["חוץ מהתינוק", "חוּץ מֵהַתִּינוֹק"]],
    englishTokens: ["At the circumcision", "everyone", "cried", "but not the baby"],
    hebrewDistractorPairs: [["בחתונה", "בַּחֲתוּנָּה"], ["הסבתא", "הַסַּבְתָּא"], ["צחקו", "צָחֲקוּ"], ["חוץ מהחתן", "חוּץ מֵהֶחָתָן"], ["שתקו", "שָׁתְקוּ"]],
    englishDistractors: ["At the wedding", "the grandmother", "laughed", "but not the groom", "were silent"],
    notes: "ברית מילה is usually shortened to ברית in speech; the joke about who cries is a fixture of the event."
  }),
  buildReviewedSentence({
    id: "inbal_44", emoji: "📜", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "קוראים את המגילה פעמיים בפורים.",
    hebrewNiqqud: "קוֹרְאִים אֶת הַמְּגִילָּה פַּעֲמַיִים בְּפוּרִים.",
    english: "They read the scroll twice on Purim.",
    hebrewTokenPairs: [["קוראים", "קוֹרְאִים"], ["את המגילה", "אֶת הַמְּגִילָּה"], ["פעמיים", "פַּעֲמַיִים"], ["בפורים", "בְּפוּרִים"]],
    englishTokens: ["They read", "the scroll", "twice", "on Purim"],
    hebrewDistractorPairs: [["שומעים", "שׁוֹמְעִים"], ["את ההגדה", "אֶת הַהַגָּדָה"], ["פעם אחת", "פַּעַם אַחַת"], ["בחנוכה", "בַּחֲנוּכָּה"], ["לבד", "לְבַד"]],
    englishDistractors: ["They hear", "the Haggadah", "once", "on Hanukkah", "alone"],
    notes: "המגילה without qualification means Esther, read on the eve of Purim and again in the morning."
  }),
  buildReviewedSentence({
    id: "inbal_45", emoji: "🔤", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "המקובלים קוראים לנשמה בשלושה שמות.",
    hebrewNiqqud: "הַמְּקוּבָּלִים קוֹרְאִים לַנְּשָׁמָה בִּשְׁלוֹשָׁה שֵׁמוֹת.",
    english: "The kabbalists call the soul by three names.",
    hebrewTokenPairs: [["המקובלים", "הַמְּקוּבָּלִים"], ["קוראים", "קוֹרְאִים"], ["לנשמה", "לַנְּשָׁמָה"], ["בשלושה", "בִּשְׁלוֹשָׁה"], ["שמות", "שֵׁמוֹת"]],
    englishTokens: ["The kabbalists", "call", "the soul", "by three", "names"],
    hebrewDistractorPairs: [["החוקרים", "הַחוֹקְרִים"], ["כותבים", "כּוֹתְבִים"], ["לגוף", "לַגּוּף"], ["בשני", "בִּשְׁנֵי"], ["ספרים", "סְפָרִים"]],
    englishDistractors: ["The researchers", "write", "to the body", "by two", "books"],
    notes: "The three names are נפש, רוח and נשמה — ascending levels of soul in Kabbalah, all three of which are ordinary modern words too."
  }),
  buildReviewedSentence({
    id: "inbal_46", emoji: "✨", category: "formal", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "לפי הקבלה בכל אדם יש ניצוץ של אור.",
    hebrewNiqqud: "לְפִי הַקַּבָּלָה בְּכָל אָדָם יֵשׁ נִיצוֹץ שֶׁל אוֹר.",
    english: "According to Kabbalah in every person there is a spark of light.",
    hebrewTokenPairs: [["לפי הקבלה", "לְפִי הַקַּבָּלָה"], ["בכל אדם", "בְּכָל אָדָם"], ["יש", "יֵשׁ"], ["ניצוץ", "נִיצוֹץ"], ["של אור", "שֶׁל אוֹר"]],
    englishTokens: ["According to Kabbalah", "in every person", "there is", "a spark", "of light"],
    hebrewDistractorPairs: [["לפי המדרש", "לְפִי הַמִּדְרָשׁ"], ["בכל חיה", "בְּכָל חַיָּה"], ["אין", "אֵין"], ["קליפה", "קְלִיפָּה"], ["של חושך", "שֶׁל חוֹשֶׁךְ"]],
    englishDistractors: ["According to midrash", "in every animal", "there is no", "a husk", "of darkness"],
    hebrewOrderAlternates: [
      {
        text: "בכל אדם יש ניצוץ של אור לפי הקבלה.",
        textNiqqud: "בְּכָל אָדָם יֵשׁ נִיצוֹץ שֶׁל אוֹר לְפִי הַקַּבָּלָה.",
        order: [1, 2, 3, 4, 0],
      },
    ],
    notes: "ניצוץ is the divine spark trapped in the material world after שבירת הכלים. The attributing phrase may open or close the clause."
  }),
  buildReviewedSentence({
    id: "inbal_47", emoji: "🙏", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הדבקות היא הרגע שבו התפילה מפסיקה להיות מילים.",
    hebrewNiqqud: "הַדְּבֵקוּת הִיא הָרֶגַע שֶׁבּוֹ הַתְּפִילָּה מַפְסִיקָה לִהְיוֹת מִילִּים.",
    english: "Devotion is the moment when prayer stops to be words.",
    hebrewTokenPairs: [["הדבקות", "הַדְּבֵקוּת"], ["היא", "הִיא"], ["הרגע", "הָרֶגַע"], ["שבו", "שֶׁבּוֹ"], ["התפילה", "הַתְּפִילָּה"], ["מפסיקה", "מַפְסִיקָה"], ["להיות", "לִהְיוֹת"], ["מילים", "מִילִּים"]],
    englishTokens: ["Devotion", "is", "the moment", "when", "prayer", "stops", "to be", "words"],
    hebrewDistractorPairs: [["הכוונה", "הַכַּוָּנָה"], ["המקום", "הַמָּקוֹם"], ["המצווה", "הַמִּצְוָה"], ["מתחילה", "מַתְחִילָה"], ["טקסט", "טֶקְסְט"]],
    englishDistractors: ["Intention", "the place", "the commandment", "begins", "text"],
    notes: "דבקות is cleaving to God — the state כוונה is meant to produce, and the Hasidic ideal of prayer beyond recitation."
  }),
  buildReviewedSentence({
    id: "inbal_48", emoji: "💧", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "היא טבלה במקווה לפני החתונה.",
    hebrewNiqqud: "הִיא טָבְלָה בַּמִּקְוֶה לִפְנֵי הַחֲתוּנָּה.",
    english: "She immersed in the mikveh before the wedding.",
    hebrewTokenPairs: [["היא", "הִיא"], ["טבלה", "טָבְלָה"], ["במקווה", "בַּמִּקְוֶה"], ["לפני החתונה", "לִפְנֵי הַחֲתוּנָּה"]],
    englishTokens: ["She", "immersed", "in the mikveh", "before the wedding"],
    hebrewDistractorPairs: [["התפללה", "הִתְפַּלְּלָה"], ["בים", "בַּיָּם"], ["אחרי הברית", "אַחֲרֵי הַבְּרִית"], ["מיד", "מִיָּד"], ["שוב", "שׁוּב"]],
    englishDistractors: ["prayed", "in the sea", "after the circumcision", "immediately", "again"],
    notes: "טבל is the verb for ritual immersion; the pre-wedding mikveh visit is one of its most common modern occasions."
  }),
  buildReviewedSentence({
    id: "inbal_49", emoji: "🤫", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הרב השביע אותו שלא יגלה את הסוד.",
    hebrewNiqqud: "הָרַב הִשְׁבִּיעַ אוֹתוֹ שֶׁלֹּא יְגַלֶּה אֶת הַסּוֹד.",
    english: "The rabbi adjured him not to reveal the secret.",
    hebrewTokenPairs: [["הרב", "הָרַב"], ["השביע", "הִשְׁבִּיעַ"], ["אותו", "אוֹתוֹ"], ["שלא יגלה", "שֶׁלֹּא יְגַלֶּה"], ["את הסוד", "אֶת הַסּוֹד"]],
    englishTokens: ["The rabbi", "adjured", "him", "not to reveal", "the secret"],
    hebrewDistractorPairs: [["המקובלת", "הַמְּקוּבֶּלֶת"], ["ביקש", "בִּיקֵּשׁ"], ["שיספר", "שֶׁיְּסַפֵּר"], ["את הלחש", "אֶת הַלַּחַשׁ"], ["מיד", "מִיָּד"]],
    englishDistractors: ["The kabbalist", "asked", "that he tell", "the spell", "immediately"],
    notes: "השביע means to put someone under oath, and is the same root as השבעה, the adjuration written on incantation bowls."
  }),
  buildReviewedSentence({
    id: "inbal_50", emoji: "📖", category: "professional", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הוא התגייר אחרי שלמד שנה בבית מדרש.",
    hebrewNiqqud: "הוּא הִתְגַּיֵּיר אַחֲרֵי שֶׁלָּמַד שָׁנָה בְּבֵית מִדְרָשׁ.",
    english: "He converted after he studied a year in a study hall.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["התגייר", "הִתְגַּיֵּיר"], ["אחרי", "אַחֲרֵי"], ["שלמד", "שֶׁלָּמַד"], ["שנה", "שָׁנָה"], ["בבית מדרש", "בְּבֵית מִדְרָשׁ"]],
    englishTokens: ["He", "converted", "after", "he studied", "a year", "in a study hall"],
    hebrewDistractorPairs: [["נולד", "נוֹלַד"], ["לפני", "לִפְנֵי"], ["שעבד", "שֶׁעָבַד"], ["חודש", "חוֹדֶשׁ"], ["בישיבה", "בִּישִׁיבָה"]],
    englishDistractors: ["was born", "before", "he worked", "a month", "in a yeshiva"],
    notes: "התגייר is the reflexive of גיור, conversion to Judaism; בית מדרש is a study hall, distinct from a synagogue."
  }),
  buildReviewedSentence({
    id: "inbal_51", emoji: "🤞", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אני אשתדל להגיע לקידוש, בלי נדר.",
    hebrewNiqqud: "אֲנִי אֶשְׁתַּדֵּל לְהַגִּיעַ לַקִּידּוּשׁ, בְּלִי נֶדֶר.",
    english: "I will try to come to the Kiddush, no promises.",
    hebrewTokenPairs: [["אני", "אֲנִי"], ["אשתדל", "אֶשְׁתַּדֵּל"], ["להגיע", "לְהַגִּיעַ"], ["לקידוש", "לַקִּידּוּשׁ"], ["בלי נדר", "בְּלִי נֶדֶר"]],
    englishTokens: ["I", "will try", "to come", "to the Kiddush", "no promises"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["אסכים", "אַסְכִּים"], ["לשכוח", "לִשְׁכּוֹחַ"], ["להבדלה", "לְהַבְדָּלָה"], ["בטוח", "בָּטוּחַ"]],
    englishDistractors: ["He", "will agree", "to forget", "to the Havdalah", "for sure"],
    notes: "בלי נדר is the everyday religious hedge that keeps a commitment from hardening into a vow. It attaches to אשתדל rather than to a flat promise, which is how it is actually used."
  }),
  buildReviewedSentence({
    id: "inbal_52", emoji: "💸", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "המקובל לקח מאה שקל סתם על ברכה.",
    hebrewNiqqud: "הַמְּקוּבָּל לָקַח מֵאָה שֶׁקֶל סְתָם עַל בְּרָכָה.",
    english: "The kabbalist took a hundred shekels just for a blessing.",
    hebrewTokenPairs: [["המקובל", "הַמְּקוּבָּל"], ["לקח", "לָקַח"], ["מאה", "מֵאָה"], ["שקל", "שֶׁקֶל"], ["סתם", "סְתָם"], ["על ברכה", "עַל בְּרָכָה"]],
    englishTokens: ["The kabbalist", "took", "a hundred", "shekels", "just", "for a blessing"],
    hebrewDistractorPairs: [["הרב", "הָרַב"], ["נתן", "נָתַן"], ["אלף", "אֶלֶף"], ["דולר", "דּוֹלָר"], ["על קמע", "עַל קָמֵעַ"]],
    englishDistractors: ["The rabbi", "gave", "a thousand", "dollars", "for an amulet"],
    notes: "סתם here is dismissive — just that and no more. The line sits in her folklore-versus-fraud register rather than in a devotional one."
  }),
  buildReviewedSentence({
    id: "inbal_53", emoji: "✈️", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "אמא שלי אומרת תהילים כשאני טסה.",
    hebrewNiqqud: "אִמָּא שֶׁלִּי אוֹמֶרֶת תְּהִילִּים כְּשֶׁאֲנִי טָסָה.",
    english: "My mom says Psalms when I fly.",
    hebrewTokenPairs: [["אמא שלי", "אִמָּא שֶׁלִּי"], ["אומרת", "אוֹמֶרֶת"], ["תהילים", "תְּהִילִּים"], ["כשאני", "כְּשֶׁאֲנִי"], ["טסה", "טָסָה"]],
    englishTokens: ["My mom", "says", "Psalms", "when I", "fly"],
    hebrewDistractorPairs: [["אבא שלי", "אַבָּא שֶׁלִּי"], ["קוראת", "קוֹרֵאת"], ["קדיש", "קַדִּישׁ"], ["כשהוא", "כְּשֶׁהוּא"], ["נוסעת", "נוֹסַעַת"]],
    englishDistractors: ["My dad", "reads", "Kaddish", "when he", "travels"],
    hebrewOrderAlternates: [{
      text: "כשאני טסה אמא שלי אומרת תהילים.",
      textNiqqud: "כְּשֶׁאֲנִי טָסָה אִמָּא שֶׁלִּי אוֹמֶרֶת תְּהִילִּים.",
      order: [3, 4, 0, 1, 2],
    }],
    notes: "Saying Psalms for a safe journey is common well beyond strictly observant families. אומרת תהילים is the fixed collocation; one does not קורא them in this sense."
  }),
  buildReviewedSentence({
    id: "inbal_54", emoji: "🚶", category: "colloquial", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "הוא יצא בשאלה אבל עדיין צם ביום כיפור.",
    hebrewNiqqud: "הוּא יָצָא בִּשְׁאֵלָה אֲבָל עֲדַיִין צָם בְּיוֹם כִּיפּוּר.",
    english: "He left religion but still fasts on Yom Kippur.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["יצא", "יָצָא"], ["בשאלה", "בִּשְׁאֵלָה"], ["אבל", "אֲבָל"], ["עדיין", "עֲדַיִין"], ["צם", "צָם"], ["ביום כיפור", "בְּיוֹם כִּיפּוּר"]],
    englishTokens: ["He", "left", "religion", "but", "still", "fasts", "on Yom Kippur"],
    hebrewDistractorPairs: [["חזר", "חָזַר"], ["לישיבה", "לִישִׁיבָה"], ["כי", "כִּי"], ["מתפלל", "מִתְפַּלֵּל"], ["בפסח", "בְּפֶסַח"]],
    englishDistractors: ["returned", "to a yeshiva", "because", "prays", "on Passover"],
    hebrewOrderAlternates: [{
      text: "הוא יצא בשאלה אבל ביום כיפור עדיין צם.",
      textNiqqud: "הוּא יָצָא בִּשְׁאֵלָה אֲבָל בְּיוֹם כִּיפּוּר עֲדַיִין צָם.",
      order: [0, 1, 2, 3, 6, 4, 5],
    }],
    notes: "יצא בשאלה is the standard phrase for leaving religious observance, the mirror of חזר בתשובה. Keeping Yom Kippur afterwards is extremely common; the term for such a person is דתל\"ש."
  }),
  buildReviewedSentence({
    id: "inbal_55", emoji: "🔮", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "היא קוראת את המזל שלה אבל לא מאמינה בזה.",
    hebrewNiqqud: "הִיא קוֹרֵאת אֶת הַמַּזָּל שֶׁלָּהּ אֲבָל לֹא מַאֲמִינָה בָּזֶה.",
    english: "She reads her horoscope but does not believe in it.",
    hebrewTokenPairs: [["היא", "הִיא"], ["קוראת", "קוֹרֵאת"], ["את המזל שלה", "אֶת הַמַּזָּל שֶׁלָּהּ"], ["אבל", "אֲבָל"], ["לא מאמינה", "לֹא מַאֲמִינָה"], ["בזה", "בָּזֶה"]],
    englishTokens: ["She", "reads", "her horoscope", "but", "does not believe", "in it"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["בודקת", "בּוֹדֶקֶת"], ["את הקלפים", "אֶת הַקְּלָפִים"], ["כי", "כִּי"], ["סומכת", "סוֹמֶכֶת"]],
    englishDistractors: ["He", "checks", "the cards", "because", "relies"],
    notes: "קורא את המזל is the ordinary Israeli way to say reading a horoscope. The sentence keeps her running distinction between practising something and believing it."
  }),
  buildReviewedSentence({
    id: "inbal_56", emoji: "🧂", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הדודה שלי שמה מלח בפינות של הבית.",
    hebrewNiqqud: "הַדּוֹדָה שֶׁלִּי שָׂמָה מֶלַח בַּפִּינּוֹת שֶׁל הַבַּיִת.",
    english: "My aunt put salt in the corners of the house.",
    hebrewTokenPairs: [["הדודה שלי", "הַדּוֹדָה שֶׁלִּי"], ["שמה", "שָׂמָה"], ["מלח", "מֶלַח"], ["בפינות", "בַּפִּינּוֹת"], ["של הבית", "שֶׁל הַבַּיִת"]],
    englishTokens: ["My aunt", "put", "salt", "in the corners", "of the house"],
    hebrewDistractorPairs: [["אמא", "אִמָּא"], ["פיזרה", "פִּיזְּרָה"], ["סוכר", "סוּכָּר"], ["בחלונות", "בַּחַלּוֹנוֹת"], ["של הגינה", "שֶׁל הַגִּינָּה"]],
    englishDistractors: ["Mom", "scattered", "sugar", "in the windows", "of the garden"],
    notes: "Salt in the corners of a home is a protective folk practice with no halakhic standing — the kind of distinction she draws rather than dismisses. שָׂמָה takes a sin, not a shin."
  }),
  buildReviewedSentence({
    id: "inbal_57", emoji: "🧱", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "כתבתי פתק ותחבתי אותו בכותל.",
    hebrewNiqqud: "כָּתַבְתִּי פֶּתֶק וְתָחַבְתִּי אוֹתוֹ בַּכּוֹתֶל.",
    english: "I wrote a note and stuck it in the Kotel.",
    hebrewTokenPairs: [["כתבתי", "כָּתַבְתִּי"], ["פתק", "פֶּתֶק"], ["ותחבתי", "וְתָחַבְתִּי"], ["אותו", "אוֹתוֹ"], ["בכותל", "בַּכּוֹתֶל"]],
    englishTokens: ["I wrote", "a note", "and stuck", "it", "in the Kotel"],
    hebrewDistractorPairs: [["קראתי", "קָרָאתִי"], ["מכתב", "מִכְתָּב"], ["וזרקתי", "וְזָרַקְתִּי"], ["אותם", "אוֹתָם"], ["בים", "בַּיָּם"]],
    englishDistractors: ["I read", "a letter", "and threw", "them", "in the sea"],
    notes: "Notes wedged into the Kotel are collected and buried twice a year rather than discarded. תחב is the everyday verb for pushing something into a gap."
  }),
  buildReviewedSentence({
    id: "inbal_58", emoji: "🧘", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אני לא דתייה, אני פשוט רוחנית.",
    hebrewNiqqud: "אֲנִי לֹא דָּתִיָּה, אֲנִי פָּשׁוּט רוּחָנִית.",
    english: "I am not religious, I am just spiritual.",
    hebrewTokenPairs: [["אני לא", "אֲנִי לֹא"], ["דתייה", "דָּתִיָּה"], ["אני", "אֲנִי"], ["פשוט", "פָּשׁוּט"], ["רוחנית", "רוּחָנִית"]],
    englishTokens: ["I am not", "religious", "I am", "just", "spiritual"],
    hebrewDistractorPairs: [["את", "אַתְּ"], ["חילונית", "חִילּוֹנִית"], ["בהחלט", "בְּהֶחְלֵט"], ["מאמינה", "מַאֲמִינָה"], ["מסורתית", "מָסוֹרְתִּית"]],
    englishDistractors: ["You are", "secular", "definitely", "a believer", "traditional"],
    notes: "The line is the standard self-description for someone spiritually engaged but not observant. רוחנית is deliberately set against דתייה rather than against חילונית."
  }),
  buildReviewedSentence({
    id: "inbal_59", emoji: "🐍", category: "colloquial", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "חלמתי על נחש ואמא אמרה שזה סימן.",
    hebrewNiqqud: "חָלַמְתִּי עַל נָחָשׁ וְאִמָּא אָמְרָה שֶׁזֶּה סִימָן.",
    english: "I dreamed about a snake and Mom said that it is a sign.",
    hebrewTokenPairs: [["חלמתי", "חָלַמְתִּי"], ["על נחש", "עַל נָחָשׁ"], ["ואמא", "וְאִמָּא"], ["אמרה", "אָמְרָה"], ["שזה", "שֶׁזֶּה"], ["סימן", "סִימָן"]],
    englishTokens: ["I dreamed", "about a snake", "and Mom", "said", "that it is", "a sign"],
    hebrewDistractorPairs: [["שכחתי", "שָׁכַחְתִּי"], ["על חתול", "עַל חָתוּל"], ["וסבתא", "וְסַבְתָּא"], ["צחקה", "צָחֲקָה"], ["שטויות", "שְׁטוּיּוֹת"]],
    englishDistractors: ["I forgot", "about a cat", "and Grandma", "laughed", "nonsense"],
    notes: "Snakes are a stock image in Jewish dream interpretation. The line continues her thread on symbols against prophecy, this time from inside the family."
  }),
  buildReviewedSentence({
    id: "inbal_60", emoji: "🤝", category: "colloquial", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הוא שומר נגיעה, אז אל תלחצי לו יד.",
    hebrewNiqqud: "הוּא שׁוֹמֵר נְגִיעָה, אָז אַל תִּלְחֲצִי לוֹ יָד.",
    english: "He observes no touching, so do not shake his hand.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["שומר", "שׁוֹמֵר"], ["נגיעה", "נְגִיעָה"], ["אז", "אָז"], ["אל תלחצי", "אַל תִּלְחֲצִי"], ["לו", "לוֹ"], ["יד", "יָד"]],
    englishTokens: ["He", "observes", "no touching", "so", "do not shake", "his", "hand"],
    hebrewDistractorPairs: [["היא", "הִיא"], ["מפר", "מֵפֵר"], ["מגע", "מַגָּע"], ["כי", "כִּי"], ["אל תדברי", "אַל תְּדַבְּרִי"], ["ראש", "רֹאשׁ"]],
    englishDistractors: ["She", "breaks", "contact", "because", "do not speak", "head"],
    notes: "שומר נגיעה describes observing the prohibition on physical contact between unmarried men and women. Knowing not to put a hand out is the practical corollary."
  }),
  buildReviewedSentence({
    id: "inbal_61", emoji: "🔍", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "הם בדקו את המזוזות אחרי האסון.",
    hebrewNiqqud: "הֵם בָּדְקוּ אֶת הַמְּזוּזוֹת אַחֲרֵי הָאָסוֹן.",
    english: "They checked the mezuzahs after the disaster.",
    hebrewTokenPairs: [["הם", "הֵם"], ["בדקו", "בָּדְקוּ"], ["את המזוזות", "אֶת הַמְּזוּזוֹת"], ["אחרי", "אַחֲרֵי"], ["האסון", "הָאָסוֹן"]],
    englishTokens: ["They", "checked", "the mezuzahs", "after", "the disaster"],
    hebrewDistractorPairs: [["אנחנו", "אֲנַחְנוּ"], ["תלינו", "תָּלִינוּ"], ["את הקמעות", "אֶת הַקְּמֵעוֹת"], ["לפני", "לִפְנֵי"], ["החתונה", "הַחֲתוּנָּה"]],
    englishDistractors: ["We", "hung", "the amulets", "before", "the wedding"],
    hebrewOrderAlternates: [{
      text: "אחרי האסון הם בדקו את המזוזות.",
      textNiqqud: "אַחֲרֵי הָאָסוֹן הֵם בָּדְקוּ אֶת הַמְּזוּזוֹת.",
      order: [3, 4, 0, 1, 2],
    }],
    notes: "Having mezuzah scrolls checked after a misfortune is widespread practice — folk causality expressed inside a halakhic frame rather than against it."
  }),
  buildReviewedSentence({
    id: "inbal_62", emoji: "🕘", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הוא מניח תפילין כל בוקר חוץ משבת.",
    hebrewNiqqud: "הוּא מַנִּיחַ תְּפִילִּין כָּל בּוֹקֶר חוּץ מִשַּׁבָּת.",
    english: "He puts on tefillin every morning except on Shabbat.",
    hebrewTokenPairs: [["הוא", "הוּא"], ["מניח", "מַנִּיחַ"], ["תפילין", "תְּפִילִּין"], ["כל", "כָּל"], ["בוקר", "בּוֹקֶר"], ["חוץ", "חוּץ"], ["משבת", "מִשַּׁבָּת"]],
    englishTokens: ["He", "puts on", "tefillin", "every", "morning", "except", "on Shabbat"],
    hebrewDistractorPairs: [["קושר", "קוֹשֵׁר"], ["טלית", "טַלִּית"], ["בערב", "בָּעֶרֶב"], ["מחג", "מֵחַג"], ["פעמיים", "פַּעֲמַיִים"]],
    englishDistractors: ["ties", "a prayer shawl", "in the evening", "on a holiday", "twice"],
    notes: "Tefillin are laid on weekday mornings and specifically not on Shabbat or festivals, which is what the exception marks. The verb is מניח, never שם."
  }),
  buildReviewedSentence({
    id: "inbal_63", emoji: "🌊", category: "everyday", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "בראש השנה הלכנו לתשליך ליד הנחל.",
    hebrewNiqqud: "בְּרֹאשׁ הַשָּׁנָה הָלַכְנוּ לְתַשְׁלִיךְ לְיַד הַנַּחַל.",
    english: "On Rosh Hashanah we went to Tashlich by the stream.",
    hebrewTokenPairs: [["בראש השנה", "בְּרֹאשׁ הַשָּׁנָה"], ["הלכנו", "הָלַכְנוּ"], ["לתשליך", "לְתַשְׁלִיךְ"], ["ליד", "לְיַד"], ["הנחל", "הַנַּחַל"]],
    englishTokens: ["On Rosh Hashanah", "we went", "to Tashlich", "by", "the stream"],
    hebrewDistractorPairs: [["ביום כיפור", "בְּיוֹם כִּיפּוּר"], ["נסענו", "נָסַעְנוּ"], ["לכפרות", "לְכַפָּרוֹת"], ["מתחת", "מִתַּחַת"], ["לגשר", "לַגֶּשֶׁר"]],
    englishDistractors: ["On Yom Kippur", "we drove", "to the atonement rite", "under", "the bridge"],
    hebrewOrderAlternates: [{
      text: "הלכנו לתשליך ליד הנחל בראש השנה.",
      textNiqqud: "הָלַכְנוּ לְתַשְׁלִיךְ לְיַד הַנַּחַל בְּרֹאשׁ הַשָּׁנָה.",
      order: [1, 2, 3, 4, 0],
    }],
    notes: "Tashlich is the Rosh Hashanah practice of symbolically casting sins into flowing water, which is why it needs a stream rather than a synagogue."
  }),
  buildReviewedSentence({
    id: "inbal_64", emoji: "📱", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "היא סופרת עומר באפליקציה בטלפון.",
    hebrewNiqqud: "הִיא סוֹפֶרֶת עוֹמֶר בָּאַפְּלִיקַצְיָה בַּטֶּלֶפוֹן.",
    english: "She counts the Omer on an app on her phone.",
    hebrewTokenPairs: [["היא", "הִיא"], ["סופרת", "סוֹפֶרֶת"], ["עומר", "עוֹמֶר"], ["באפליקציה", "בָּאַפְּלִיקַצְיָה"], ["בטלפון", "בַּטֶּלֶפוֹן"]],
    englishTokens: ["She", "counts", "the Omer", "on an app", "on her phone"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["שוכחת", "שׁוֹכַחַת"], ["ברכה", "בְּרָכָה"], ["במחברת", "בְּמַחְבֶּרֶת"], ["במחשב", "בַּמַּחְשֵׁב"]],
    englishDistractors: ["He", "forgets", "a blessing", "in a notebook", "on a computer"],
    notes: "Counting the Omer runs the forty-nine days between Pesach and Shavuot, and apps that send the nightly reminder are now ordinary. The פ of בָּאַפְּלִיקַצְיָה carries a dagesh."
  }),
  buildReviewedSentence({
    id: "inbal_65", emoji: "🖐️", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "תלו חמסה במכונית כדי שכלום לא יקרה.",
    hebrewNiqqud: "תָּלוּ חַמְסָה בַּמְּכוֹנִית כְּדֵי שֶׁכְּלוּם לֹא יִקְרֶה.",
    english: "They hung a hamsa in the car so that nothing would happen.",
    hebrewTokenPairs: [["תלו", "תָּלוּ"], ["חמסה", "חַמְסָה"], ["במכונית", "בַּמְּכוֹנִית"], ["כדי", "כְּדֵי"], ["שכלום", "שֶׁכְּלוּם"], ["לא יקרה", "לֹא יִקְרֶה"]],
    englishTokens: ["They hung", "a hamsa", "in the car", "so", "that nothing", "would happen"],
    hebrewDistractorPairs: [["שמו", "שָׂמוּ"], ["מזוזה", "מְזוּזָה"], ["בבית", "בַּבַּיִת"], ["בגלל", "בִּגְלַל"], ["שמשהו", "שֶׁמַּשֶּׁהוּ"]],
    englishDistractors: ["They put", "a mezuzah", "in the house", "because", "that something"],
    notes: "The hamsa is a protective hand amulet shared across Jewish and Muslim folk practice. Hanging one from a rear-view mirror is its most ordinary Israeli form."
  }),
  buildReviewedSentence({
    id: "inbal_66", emoji: "🙌", category: "everyday", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "אחרי הטיסה הוא בירך הגומל בבית הכנסת.",
    hebrewNiqqud: "אַחֲרֵי הַטִּיסָה הוּא בֵּירֵךְ הַגּוֹמֵל בְּבֵית הַכְּנֶסֶת.",
    english: "After the flight he recited Hagomel in the synagogue.",
    hebrewTokenPairs: [["אחרי", "אַחֲרֵי"], ["הטיסה", "הַטִּיסָה"], ["הוא", "הוּא"], ["בירך", "בֵּירֵךְ"], ["הגומל", "הַגּוֹמֵל"], ["בבית הכנסת", "בְּבֵית הַכְּנֶסֶת"]],
    englishTokens: ["After", "the flight", "he", "recited", "Hagomel", "in the synagogue"],
    hebrewDistractorPairs: [["לפני", "לִפְנֵי"], ["הנסיעה", "הַנְּסִיעָה"], ["שכח", "שָׁכַח"], ["קדיש", "קַדִּישׁ"], ["בסוכה", "בַּסּוּכָּה"]],
    englishDistractors: ["Before", "the trip", "forgot", "Kaddish", "in the sukkah"],
    hebrewOrderAlternates: [{
      text: "הוא בירך הגומל בבית הכנסת אחרי הטיסה.",
      textNiqqud: "הוּא בֵּירֵךְ הַגּוֹמֵל בְּבֵית הַכְּנֶסֶת אַחֲרֵי הַטִּיסָה.",
      order: [2, 3, 4, 5, 0, 1],
    }],
    notes: "ברכת הגומל is said before a minyan after surviving danger — sea travel, illness, captivity — and by extension after flying."
  }),
  buildReviewedSentence({
    id: "inbal_67", emoji: "📕", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "הפוסקים שללו קמעות וראו בהם אמונה טפלה.",
    hebrewNiqqud: "הַפּוֹסְקִים שָׁלְלוּ קְמֵעוֹת וְרָאוּ בָּהֶם אֱמוּנָה טְפֵלָה.",
    english: "The authorities rejected amulets and saw them as superstition.",
    hebrewTokenPairs: [["הפוסקים", "הַפּוֹסְקִים"], ["שללו", "שָׁלְלוּ"], ["קמעות", "קְמֵעוֹת"], ["וראו בהם", "וְרָאוּ בָּהֶם"], ["אמונה טפלה", "אֱמוּנָה טְפֵלָה"]],
    englishTokens: ["The authorities", "rejected", "amulets", "and saw them as", "superstition"],
    hebrewDistractorPairs: [["הרבנים", "הָרַבָּנִים"], ["אישרו", "אִישְּׁרוּ"], ["מזוזות", "מְזוּזוֹת"], ["ומצאו בהם", "וּמָצְאוּ בָּהֶם"], ["מסורת", "מָסוֹרֶת"]],
    englishDistractors: ["The rabbis", "approved", "mezuzahs", "and found in them", "tradition"],
    notes: "Maimonides is the classic voice rejecting amulets as אמונה טפלה, superstition, against a long and stubborn popular practice of using them."
  }),
  buildReviewedSentence({
    id: "inbal_68", emoji: "🗿", category: "formal", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "לפי האגדה רב יצר גולם מחומר בעיר פראג.",
    hebrewNiqqud: "לְפִי הָאַגָּדָה רַב יָצַר גּוֹלֶם מֵחוֹמֶר בְּעִיר פְּרָאג.",
    english: "According to legend a rabbi created a golem from clay in the city of Prague.",
    hebrewTokenPairs: [["לפי האגדה", "לְפִי הָאַגָּדָה"], ["רב", "רַב"], ["יצר", "יָצַר"], ["גולם", "גּוֹלֶם"], ["מחומר", "מֵחוֹמֶר"], ["בעיר", "בְּעִיר"], ["פראג", "פְּרָאג"]],
    englishTokens: ["According to legend", "a rabbi", "created", "a golem", "from clay", "in the city", "of Prague"],
    hebrewDistractorPairs: [["לפי המחקר", "לְפִי הַמֶּחְקָר"], ["תלמיד", "תַּלְמִיד"], ["שבר", "שָׁבַר"], ["מאבן", "מֵאֶבֶן"], ["בצפת", "בִּצְפַת"]],
    englishDistractors: ["According to research", "a student", "broke", "from stone", "in Safed"],
    hebrewOrderAlternates: [{
      text: "רב יצר גולם מחומר בעיר פראג לפי האגדה.",
      textNiqqud: "רַב יָצַר גּוֹלֶם מֵחוֹמֶר בְּעִיר פְּרָאג לְפִי הָאַגָּדָה.",
      order: [1, 2, 3, 4, 5, 6, 0],
    }],
    notes: "The Golem of Prague is attributed to the Maharal, Rabbi Judah Loew. Writing בעיר פראג rather than בפראג keeps the initial פ hard instead of spirantising it."
  }),
  buildReviewedSentence({
    id: "inbal_69", emoji: "🔁", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "גלגול נשמות אינו מופיע בתלמוד אלא בקבלה.",
    hebrewNiqqud: "גִּלְגּוּל נְשָׁמוֹת אֵינוֹ מוֹפִיעַ בַּתַּלְמוּד אֶלָּא בַּקַּבָּלָה.",
    english: "Reincarnation does not appear in the Talmud but in Kabbalah.",
    hebrewTokenPairs: [["גלגול נשמות", "גִּלְגּוּל נְשָׁמוֹת"], ["אינו", "אֵינוֹ"], ["מופיע", "מוֹפִיעַ"], ["בתלמוד", "בַּתַּלְמוּד"], ["אלא", "אֶלָּא"], ["בקבלה", "בַּקַּבָּלָה"]],
    englishTokens: ["Reincarnation", "does not", "appear", "in the Talmud", "but", "in Kabbalah"],
    hebrewDistractorPairs: [["תיקון עולם", "תִּיקּוּן עוֹלָם"], ["אכן", "אָכֵן"], ["נזכר", "נִזְכָּר"], ["בתורה", "בַּתּוֹרָה"], ["במדרש", "בַּמִּדְרָשׁ"]],
    englishDistractors: ["Tikkun olam", "indeed", "is mentioned", "in the Torah", "in midrash"],
    notes: "Reincarnation entered Jewish thought through kabbalistic literature, notably the Zohar and the Lurianic school, rather than through the Talmud."
  }),
  buildReviewedSentence({
    id: "inbal_70", emoji: "💤", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "חלום שלא נפתר דומה למכתב שלא נקרא.",
    hebrewNiqqud: "חֲלוֹם שֶׁלֹּא נִפְתַּר דּוֹמֶה לְמִכְתָּב שֶׁלֹּא נִקְרָא.",
    english: "A dream that was not interpreted is like a letter that was not read.",
    hebrewTokenPairs: [["חלום", "חֲלוֹם"], ["שלא", "שֶׁלֹּא"], ["נפתר", "נִפְתַּר"], ["דומה", "דּוֹמֶה"], ["למכתב", "לְמִכְתָּב"], ["שלא", "שֶׁלֹּא"], ["נקרא", "נִקְרָא"]],
    englishTokens: ["A dream", "that was not", "interpreted", "is like", "a letter", "that was not", "read"],
    hebrewDistractorPairs: [["סוד", "סוֹד"], ["שכבר", "שֶׁכְּבָר"], ["נשכח", "נִשְׁכַּח"], ["שונה", "שׁוֹנֶה"], ["לספר", "לְסֵפֶר"]],
    englishDistractors: ["A secret", "that already", "was forgotten", "is different", "to a book"],
    notes: "The dictum is Talmudic, Berakhot 55a. It closes her dream-interpretation thread from the tradition's own side rather than from folk practice."
  }),
];

const INAT_SENTENCES = [
  buildReviewedSentence({
    id: "inat_01", emoji: "💭", category: "everyday", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "אם תרצו, אין זו אגדה.", hebrewNiqqud: "אִם תִּרְצוּ, אֵין זוֹ אַגָּדָה.",
    english: "If you will it, this is not a dream.",
    hebrewTokenPairs: [["אם", "אִם"], ["תרצו", "תִּרְצוּ"], ["אין זו", "אֵין זוֹ"], ["אגדה", "אַגָּדָה"]],
    englishTokens: ["If", "you will it", "this is not", "a dream"],
    hebrewDistractorPairs: [["כאשר", "כַּאֲשֶׁר"], ["תשכחו", "תִּשְׁכְּחוּ"], ["יש זאת", "יֵשׁ זֹאת"], ["עובדה", "עֻבְדָּה"]],
    englishDistractors: ["When", "you forget it", "this is", "a fact"],
    notes: "A famous Hebrew rendering of Theodor Herzl's motto. אגדה literally means 'legend'; 'dream' is the conventional English rendering."
  }),
  buildReviewedSentence({
    id: "inat_02", emoji: "🎼", category: "everyday", difficulty: 1,
    wordOrderDecision: "fixed",
    hebrew: "עוד לא אבדה תקוותנו.", hebrewNiqqud: "עוֹד לֹא אָבְדָה תִּקְוָתֵנוּ.",
    english: "Our hope is not yet lost.",
    hebrewTokenPairs: [["עוד", "עוֹד"], ["לא", "לֹא"], ["אבדה", "אָבְדָה"], ["תקוותנו", "תִּקְוָתֵנוּ"]],
    englishTokens: ["Our hope", "is", "not yet", "lost"],
    hebrewDistractorPairs: [["כבר", "כְּבָר"], ["כן", "כֵּן"], ["נמצאה", "נִמְצְאָה"], ["דרכנו", "דַּרְכֵּנוּ"]],
    englishDistractors: ["Our path", "was", "already", "found"],
    notes: "A line from Hatikvah, based on Naftali Herz Imber's poem Tikvatenu."
  }),
  buildReviewedSentence({
    id: "inat_03", emoji: "🏞️", category: "everyday", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "האדם אינו אלא תבנית נוף מולדתו.", hebrewNiqqud: "הָאָדָם אֵינוֹ אֶלָּא תַּבְנִית נוֹף מוֹלַדְתּוֹ.",
    english: "A person is nothing but the shape of their homeland's landscape.",
    hebrewTokenPairs: [["האדם", "הָאָדָם"], ["אינו", "אֵינוֹ"], ["אלא", "אֶלָּא"], ["תבנית", "תַּבְנִית"], ["נוף", "נוֹף"], ["מולדתו", "מוֹלַדְתּוֹ"]],
    englishTokens: ["A person", "is", "nothing but", "the shape", "of their homeland's", "landscape"],
    hebrewDistractorPairs: [["המשורר", "הַמְּשׁוֹרֵר"], ["הוא גם", "הוּא גַּם"], ["תמונה", "תְּמוּנָה"], ["עתידו", "עֲתִידוֹ"]],
    englishDistractors: ["A poet", "is also", "a picture", "their future"],
    notes: "The opening line of Shaul Tchernichovsky's poem האדם אינו אלא. מולדתו means 'his homeland'; the English uses singular 'their.'"
  }),
  buildReviewedSentence({
    id: "inat_04", emoji: "⚖️", category: "everyday", difficulty: 1,
    wordOrderDecision: "fixed",
    hebrew: "צדק צדק תרדוף.", hebrewNiqqud: "צֶדֶק צֶדֶק תִּרְדֹּף.",
    english: "Justice, justice shall you pursue.",
    hebrewTokenPairs: [["צדק", "צֶדֶק"], ["צדק", "צֶדֶק"], ["תרדוף", "תִּרְדֹּף"]],
    englishTokens: ["Justice", "justice", "shall you pursue"],
    hebrewDistractorPairs: [["חוק", "חוֹק"], ["שלום", "שָׁלוֹם"], ["תעזוב", "תַּעֲזֹב"], ["תשכח", "תִּשְׁכַּח"]],
    englishDistractors: ["Law", "peace", "shall you leave", "shall you forget"],
    notes: "A short biblical line from Deuteronomy 16:20. The repeated צדק is part of the source text."
  }),
  buildReviewedSentence({
    id: "inat_05", emoji: "🔎", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "קריאה צמודה חושפת מוטיב שחוזר לאורך הרומן.",
    hebrewNiqqud: "קְרִיאָה צְמוּדָה חוֹשֶׂפֶת מוֹטִיב שֶׁחוֹזֵר לְאֹרֶךְ הָרוֹמָן.",
    english: "Close reading reveals a motif that recurs throughout the novel.",
    hebrewTokenPairs: [["קריאה צמודה", "קְרִיאָה צְמוּדָה"], ["חושפת", "חוֹשֶׂפֶת"], ["מוטיב", "מוֹטִיב"], ["שחוזר", "שֶׁחוֹזֵר"], ["לאורך", "לְאֹרֶךְ"], ["הרומן", "הָרוֹמָן"]],
    englishTokens: ["Close reading", "reveals", "a motif", "that recurs", "throughout", "the novel"],
    hebrewDistractorPairs: [["קריאה מהירה", "קְרִיאָה מְהִירָה"], ["מסתירה", "מַסְתִּירָה"], ["פרט", "פְּרָט"], ["המאמר", "הַמַּאֲמָר"]],
    englishDistractors: ["Quick", "reading", "hides", "a detail", "the article"],
    notes: "קריאה צמודה is close reading: sustained attention to the language and structure of a text."
  }),
  buildReviewedSentence({
    id: "inat_06", emoji: "🗣️", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "השיר משנה משמעות כשהמספר משתנה.",
    hebrewNiqqud: "הַשִּׁיר מְשַׁנֶּה מַשְׁמָעוּת כְּשֶׁהַמְּסַפֵּר מִשְׁתַּנֶּה.",
    english: "The poem changes meaning when the narrator changes.",
    hebrewTokenPairs: [["השיר", "הַשִּׁיר"], ["משנה", "מְשַׁנֶּה"], ["משמעות", "מַשְׁמָעוּת"], ["כשהמספר", "כְּשֶׁהַמְּסַפֵּר"], ["משתנה", "מִשְׁתַּנֶּה"]],
    englishTokens: ["The poem", "changes", "meaning", "when the narrator", "changes"],
    hebrewDistractorPairs: [["הסיפור", "הַסִּפּוּר"], ["שומר", "שׁוֹמֵר"], ["צורה", "צוּרָה"], ["כשהקורא", "כְּשֶׁהַקּוֹרֵא"]],
    englishDistractors: ["The story", "keeps", "form", "when the reader"],
    notes: "מספר means narrator here; context distinguishes it from the identically spelled word for number."
  }),
  buildReviewedSentence({
    id: "inat_07", emoji: "🌐", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "המרצה ביקשה מהסטודנטים להשוות שלושה תרגומים.",
    hebrewNiqqud: "הַמַּרְצָה בִּקְּשָׁה מֵהַסְטוּדֶנְטִים לְהַשְׁווֹת שְׁלוֹשָׁה תַּרְגּוּמִים.",
    english: "The lecturer asked the students to compare three translations.",
    hebrewTokenPairs: [["המרצה", "הַמַּרְצָה"], ["ביקשה", "בִּקְּשָׁה"], ["מהסטודנטים", "מֵהַסְטוּדֶנְטִים"], ["להשוות", "לְהַשְׁווֹת"], ["שלושה", "שְׁלוֹשָׁה"], ["תרגומים", "תַּרְגּוּמִים"]],
    englishTokens: ["The lecturer", "asked", "the students", "to compare", "three", "translations"],
    hebrewDistractorPairs: [["העורכת", "הָעוֹרֶכֶת"], ["אסרה", "אָסְרָה"], ["מהקוראים", "מֵהַקּוֹרְאִים"], ["למחוק", "לִמְחֹק"]],
    englishDistractors: ["The editor", "forbade", "the readers", "to erase"],
    notes: "להשוות means to compare. תרגום is translation; the plural is תרגומים."
  }),
  buildReviewedSentence({
    id: "inat_08", emoji: "🗄️", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הארכיון שומר מכתבים, כרזות והקלטות מן התקופה.",
    hebrewNiqqud: "הָאַרְכִיּוֹן שׁוֹמֵר מִכְתָּבִים, כְּרָזוֹת וְהַקְלָטוֹת מִן הַתְּקוּפָה.",
    english: "The archive preserves letters, posters, and recordings from the period.",
    hebrewTokenPairs: [["הארכיון", "הָאַרְכִיּוֹן"], ["שומר", "שׁוֹמֵר"], ["מכתבים", "מִכְתָּבִים"], ["כרזות", "כְּרָזוֹת"], ["והקלטות", "וְהַקְלָטוֹת"], ["מן", "מִן"], ["התקופה", "הַתְּקוּפָה"]],
    englishTokens: ["The archive", "preserves", "letters", "posters", "and recordings", "from", "the period"],
    hebrewDistractorPairs: [["המוזיאון", "הַמּוּזֵאוֹן"], ["מוכר", "מוֹכֵר"], ["ספרים", "סְפָרִים"], ["מהעתיד", "מֵהֶעָתִיד"]],
    englishDistractors: ["The museum", "sells", "books", "from the future"],
    notes: "ארכיון is an archive; כרזות are posters or placards; הקלטות are recordings."
  }),
  buildReviewedSentence({
    id: "inat_09", emoji: "🎙️", category: "professional", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "היסטוריה שבעל פה משמרת קולות שלא נכנסו לארכיון.",
    hebrewNiqqud: "הִיסְטוֹרְיָה שֶׁבְּעַל פֶּה מְשַׁמֶּרֶת קוֹלוֹת שֶׁלֹּא נִכְנְסוּ לָאַרְכִיּוֹן.",
    english: "Oral history preserves voices that never entered the archive.",
    hebrewTokenPairs: [["היסטוריה שבעל פה", "הִיסְטוֹרְיָה שֶׁבְּעַל פֶּה"], ["משמרת", "מְשַׁמֶּרֶת"], ["קולות", "קוֹלוֹת"], ["שלא", "שֶׁלֹּא"], ["נכנסו", "נִכְנְסוּ"], ["לארכיון", "לָאַרְכִיּוֹן"]],
    englishTokens: ["Oral history", "preserves", "voices", "that never", "entered", "the archive"],
    hebrewDistractorPairs: [["היסטוריה רשמית", "הִיסְטוֹרְיָה רִשְׁמִית"], ["מוחקת", "מוֹחֶקֶת"], ["תמונות", "תְּמוּנוֹת"], ["יצאו", "יָצְאוּ"]],
    englishDistractors: ["Official", "history", "erases", "pictures", "left"],
    notes: "היסטוריה שבעל פה is oral history: recorded memories and testimony, especially from people underrepresented in written archives."
  }),
  buildReviewedSentence({
    id: "inat_10", emoji: "🎸", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "שיר מחאה הופך כאב פרטי לציבורי.",
    hebrewNiqqud: "שִׁיר מְחָאָה הוֹפֵךְ כְּאֵב פְּרָטִי לְצִבּוּרִי.",
    english: "A protest song makes private pain public.",
    hebrewTokenPairs: [["שיר מחאה", "שִׁיר מְחָאָה"], ["הופך", "הוֹפֵךְ"], ["כאב", "כְּאֵב"], ["פרטי", "פְּרָטִי"], ["לציבורי", "לְצִבּוּרִי"]],
    englishTokens: ["A protest song", "makes", "private", "pain", "public"],
    hebrewDistractorPairs: [["שיר אהבה", "שִׁיר אַהֲבָה"], ["משאיר", "מַשְׁאִיר"], ["שמחה", "שִׂמְחָה"], ["פרטית", "פְּרָטִית"]],
    englishDistractors: ["A love", "song", "leaves", "joy", "hidden"],
    notes: "שיר מחאה is a protest song. The adjective order differs between Hebrew and the deliberately fine-grained English chips."
  }),
  buildReviewedSentence({
    id: "inat_11", emoji: "🎭", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "סאטירה תוקפת כוח פוליטי באמצעות הומור.",
    hebrewNiqqud: "סָטִירָה תּוֹקֶפֶת כֹּחַ פּוֹלִיטִי בְּאֶמְצָעוּת הוּמוֹר.",
    english: "Satire attacks political power through humor.",
    hebrewTokenPairs: [["סאטירה", "סָטִירָה"], ["תוקפת", "תּוֹקֶפֶת"], ["כוח", "כֹּחַ"], ["פוליטי", "פּוֹלִיטִי"], ["באמצעות", "בְּאֶמְצָעוּת"], ["הומור", "הוּמוֹר"]],
    englishTokens: ["Satire", "attacks", "political", "power", "through", "humor"],
    hebrewDistractorPairs: [["מלודרמה", "מֶלוֹדְרָמָה"], ["מחזקת", "מְחַזֶּקֶת"], ["רגשי", "רִגְשִׁי"], ["בכעס", "בְּכַעַס"]],
    englishDistractors: ["Melodrama", "strengthens", "emotional", "through anger"],
    notes: "באמצעות is a formal 'by means of' or 'through.'"
  }),
  buildReviewedSentence({
    id: "inat_12", emoji: "🏙️", category: "professional", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "ההפקה העבירה את העלילה לתל אביב של ימינו.",
    hebrewNiqqud: "הַהֲפָקָה הֶעֱבִירָה אֶת הָעֲלִילָה לְתֵל אָבִיב שֶׁל יָמֵינוּ.",
    english: "The production moved the plot to present-day Tel Aviv.",
    hebrewTokenPairs: [["ההפקה", "הַהֲפָקָה"], ["העבירה", "הֶעֱבִירָה"], ["את", "אֶת"], ["העלילה", "הָעֲלִילָה"], ["לתל אביב", "לְתֵל אָבִיב"], ["של ימינו", "שֶׁל יָמֵינוּ"]],
    englishTokens: ["The production", "moved", "the", "plot", "to present-day", "Tel Aviv"],
    hebrewDistractorPairs: [["הביקורת", "הַבִּקֹּרֶת"], ["השאירה", "הִשְׁאִירָה"], ["הדמות", "הַדְּמוּת"], ["לירושלים", "לִירוּשָׁלַיִם"]],
    englishDistractors: ["The review", "kept", "the character", "to Jerusalem"],
    notes: "של ימינו means 'of our day' or present-day. הפקה is a stage or screen production."
  }),
  buildReviewedSentence({
    id: "inat_13", emoji: "🖼️", category: "professional", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "האוצרת הסבירה מדוע החלל הריק הוא חלק מהיצירה.",
    hebrewNiqqud: "הָאוֹצֶרֶת הִסְבִּירָה מַדּוּעַ הֶחָלָל הָרֵיק הוּא חֵלֶק מֵהַיְּצִירָה.",
    english: "The curator explained why the empty space is part of the artwork.",
    hebrewTokenPairs: [["האוצרת", "הָאוֹצֶרֶת"], ["הסבירה", "הִסְבִּירָה"], ["מדוע", "מַדּוּעַ"], ["החלל", "הֶחָלָל"], ["הריק", "הָרֵיק"], ["הוא", "הוּא"], ["חלק", "חֵלֶק"], ["מהיצירה", "מֵהַיְּצִירָה"]],
    englishTokens: ["The curator", "explained", "why", "the empty", "space", "is", "part", "of the artwork"],
    hebrewDistractorPairs: [["המבקרת", "הַמְּבַקֶּרֶת"], ["שאלה", "שָׁאֲלָה"], ["מתי", "מָתַי"], ["המלא", "הַמָּלֵא"]],
    englishDistractors: ["The critic", "asked", "when", "full"],
    notes: "אוצרת is a female curator. חלל can mean space or void; here it refers to empty visual or gallery space."
  }),
  buildReviewedSentence({
    id: "inat_14", emoji: "🚫", category: "professional", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "צנזורה לפעמים הופכת ספר אסור לספר מבוקש.",
    hebrewNiqqud: "צֶנְזוּרָה לִפְעָמִים הוֹפֶכֶת סֵפֶר אָסוּר לְסֵפֶר מְבֻקָּשׁ.",
    english: "Censorship sometimes turns a forbidden book into a sought-after book.",
    hebrewTokenPairs: [["צנזורה", "צֶנְזוּרָה"], ["לפעמים", "לִפְעָמִים"], ["הופכת", "הוֹפֶכֶת"], ["ספר", "סֵפֶר"], ["אסור", "אָסוּר"], ["לספר", "לְסֵפֶר"], ["מבוקש", "מְבֻקָּשׁ"]],
    englishTokens: ["Censorship", "sometimes", "turns", "a forbidden", "book", "into a sought-after", "book"],
    hebrewDistractorPairs: [["פרסום", "פִּרְסוּם"], ["תמיד", "תָּמִיד"], ["משאיר", "מַשְׁאִיר"], ["נשכח", "נִשְׁכָּח"]],
    englishDistractors: ["Publicity", "always", "leaves", "forgotten"],
    hebrewOrderAlternates: [
      {
        text: "לפעמים צנזורה הופכת ספר אסור לספר מבוקש.",
        textNiqqud: "לִפְעָמִים צֶנְזוּרָה הוֹפֶכֶת סֵפֶר אָסוּר לְסֵפֶר מְבֻקָּשׁ.",
        order: [1, 0, 2, 3, 4, 5, 6],
      },
      {
        text: "צנזורה הופכת לפעמים ספר אסור לספר מבוקש.",
        textNiqqud: "צֶנְזוּרָה הוֹפֶכֶת לִפְעָמִים סֵפֶר אָסוּר לְסֵפֶר מְבֻקָּשׁ.",
        order: [0, 2, 1, 3, 4, 5, 6],
      },
    ],
    notes: "מבוקש can mean wanted, desired, or sought-after."
  }),
  buildReviewedSentence({
    id: "inat_15", emoji: "🗯️", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "חופש הביטוי אינו פוטר אמירה מביקורת.",
    hebrewNiqqud: "חוֹפֶשׁ הַבִּטּוּי אֵינוֹ פּוֹטֵר אֲמִירָה מִבִּקֹּרֶת.",
    english: "Freedom of expression does not exempt a statement from criticism.",
    hebrewTokenPairs: [["חופש הביטוי", "חוֹפֶשׁ הַבִּטּוּי"], ["אינו", "אֵינוֹ"], ["פוטר", "פּוֹטֵר"], ["אמירה", "אֲמִירָה"], ["מביקורת", "מִבִּקֹּרֶת"]],
    englishTokens: ["Freedom of expression", "does not", "exempt", "a statement", "from criticism"],
    hebrewDistractorPairs: [["חופש התנועה", "חוֹפֶשׁ הַתְּנוּעָה"], ["תמיד", "תָּמִיד"], ["מחייב", "מְחַיֵּב"], ["החלטה", "הַחְלָטָה"]],
    englishDistractors: ["Freedom of movement", "always", "requires", "a decision"],
    notes: "פוטר את... מ־ means exempts someone or something from. The sentence distinguishes legal freedom from freedom from criticism."
  }),
  buildReviewedSentence({
    id: "inat_16", emoji: "📣", category: "formal", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הפעילים ארגנו צעדה וחילקו עלונים.",
    hebrewNiqqud: "הַפְּעִילִים אִרְגְּנוּ צְעָדָה וְחִלְּקוּ עֲלוֹנִים.",
    english: "The activists organized a march and distributed leaflets.",
    hebrewTokenPairs: [["הפעילים", "הַפְּעִילִים"], ["ארגנו", "אִרְגְּנוּ"], ["צעדה", "צְעָדָה"], ["וחילקו", "וְחִלְּקוּ"], ["עלונים", "עֲלוֹנִים"]],
    englishTokens: ["The activists", "organized", "a march", "and distributed", "leaflets"],
    hebrewDistractorPairs: [["הפקידים", "הַפְּקִידִים"], ["ביטלו", "בִּטְּלוּ"], ["פגישה", "פְּגִישָׁה"], ["כרטיסים", "כַּרְטִיסִים"]],
    englishDistractors: ["The officials", "canceled", "a meeting", "tickets"],
    notes: "צעדה is an organized march; עלונים are leaflets or flyers."
  }),
  buildReviewedSentence({
    id: "inat_17", emoji: "✊", category: "formal", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "העובדים הכריזו על שביתה כללית.",
    hebrewNiqqud: "הָעוֹבְדִים הִכְרִיזוּ עַל שְׁבִיתָה כְּלָלִית.",
    english: "The workers declared a general strike.",
    hebrewTokenPairs: [["העובדים", "הָעוֹבְדִים"], ["הכריזו", "הִכְרִיזוּ"], ["על", "עַל"], ["שביתה", "שְׁבִיתָה"], ["כללית", "כְּלָלִית"]],
    englishTokens: ["The workers", "declared", "a", "general", "strike"],
    hebrewDistractorPairs: [["המנהלים", "הַמְּנַהֲלִים"], ["ויתרו", "וִתְּרוּ"], ["פגישה", "פְּגִישָׁה"], ["פרטית", "פְּרָטִית"]],
    englishDistractors: ["The managers", "abandoned", "a meeting", "private"],
    notes: "להכריז על is to declare or announce. שביתה כללית is a general strike."
  }),
  buildReviewedSentence({
    id: "inat_18", emoji: "🏫", category: "formal", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "הסטודנטים מחו מול משרד החינוך.",
    hebrewNiqqud: "הַסְטוּדֶנְטִים מָחוּ מוּל מִשְׂרַד הַחִנּוּךְ.",
    english: "The students protested outside the Education Ministry.",
    hebrewTokenPairs: [["הסטודנטים", "הַסְטוּדֶנְטִים"], ["מחו", "מָחוּ"], ["מול", "מוּל"], ["משרד החינוך", "מִשְׂרַד הַחִנּוּךְ"]],
    englishTokens: ["The students", "protested", "outside", "the Education Ministry"],
    hebrewDistractorPairs: [["המורים", "הַמּוֹרִים"], ["חגגו", "חָגְגוּ"], ["בתוך", "בְּתוֹךְ"], ["הספרייה", "הַסִּפְרִיָּה"]],
    englishDistractors: ["The teachers", "celebrated", "inside", "the library"],
    hebrewOrderAlternates: [{
      text: "מול משרד החינוך מחו הסטודנטים.",
      textNiqqud: "מוּל מִשְׂרַד הַחִנּוּךְ מָחוּ הַסְטוּדֶנְטִים.",
      order: [2, 3, 1, 0],
    }],
    notes: "מחו is 'they protested,' the past plural form of למחות. מול means opposite, facing, or outside a site."
  }),
  buildReviewedSentence({
    id: "inat_19", emoji: "🚓", category: "formal", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "המשטרה פיזרה את ההפגנה לאחר שהכביש נחסם.",
    hebrewNiqqud: "הַמִּשְׁטָרָה פִּזְּרָה אֶת הַהַפְגָּנָה לְאַחַר שֶׁהַכְּבִישׁ נֶחְסַם.",
    english: "The police dispersed the demonstration after the road was blocked.",
    hebrewTokenPairs: [["המשטרה", "הַמִּשְׁטָרָה"], ["פיזרה", "פִּזְּרָה"], ["את", "אֶת"], ["ההפגנה", "הַהַפְגָּנָה"], ["לאחר", "לְאַחַר"], ["שהכביש", "שֶׁהַכְּבִישׁ"], ["נחסם", "נֶחְסַם"]],
    englishTokens: ["The police", "dispersed", "the", "demonstration", "after", "the road", "was blocked"],
    hebrewDistractorPairs: [["העירייה", "הָעִירִיָּה"], ["אישרה", "אִשְּׁרָה"], ["הצעדה", "הַצְּעָדָה"], ["לפני", "לִפְנֵי"]],
    englishDistractors: ["The municipality", "approved", "the march", "before"],
    hebrewOrderAlternates: [{
      text: "לאחר שהכביש נחסם, המשטרה פיזרה את ההפגנה.",
      textNiqqud: "לְאַחַר שֶׁהַכְּבִישׁ נֶחְסַם, הַמִּשְׁטָרָה פִּזְּרָה אֶת הַהַפְגָּנָה.",
      order: [4, 5, 6, 0, 1, 2, 3],
    }],
    notes: "פיזרה את ההפגנה means dispersed the demonstration. The sentence reports a sequence without evaluating the police action."
  }),
  buildReviewedSentence({
    id: "inat_20", emoji: "📢", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "היא פירשה את הנאום כקריאה לאי־ציות אזרחי.",
    hebrewNiqqud: "הִיא פֵּרְשָׁה אֶת הַנְּאוּם כִּקְרִיאָה לְאִי־צִיּוּת אֶזְרָחִי.",
    english: "She interpreted the speech as a call for civil disobedience.",
    hebrewTokenPairs: [["היא", "הִיא"], ["פירשה", "פֵּרְשָׁה"], ["את", "אֶת"], ["הנאום", "הַנְּאוּם"], ["כקריאה", "כִּקְרִיאָה"], ["לאי־ציות אזרחי", "לְאִי־צִיּוּת אֶזְרָחִי"]],
    englishTokens: ["She", "interpreted", "the", "speech", "as a call", "for civil disobedience"],
    hebrewDistractorPairs: [["הוא", "הוּא"], ["סיכם", "סִכֵּם"], ["המאמר", "הַמַּאֲמָר"], ["כהזמנה", "כְּהַזְמָנָה"]],
    englishDistractors: ["He", "summarized", "the article", "as an invitation"],
    notes: "פירשה is the feminine past form of לפרש. אי־ציות אזרחי is civil disobedience."
  }),
  buildReviewedSentence({
    id: "inat_21", emoji: "🏛️", category: "formal", difficulty: 2,
    wordOrderDecision: "fixed",
    hebrew: "הוועדה התעלמה מעדות התושבים.",
    hebrewNiqqud: "הַוַּעֲדָה הִתְעַלְּמָה מֵעֵדוּת הַתּוֹשָׁבִים.",
    english: "The committee ignored the testimony of the residents.",
    hebrewTokenPairs: [["הוועדה", "הַוַּעֲדָה"], ["התעלמה", "הִתְעַלְּמָה"], ["מעדות", "מֵעֵדוּת"], ["התושבים", "הַתּוֹשָׁבִים"]],
    englishTokens: ["The committee", "ignored", "the testimony", "of the residents"],
    hebrewDistractorPairs: [["המועצה", "הַמּוֹעָצָה"], ["הקשיבה", "הִקְשִׁיבָה"], ["להצעת", "לְהַצָּעַת"], ["המומחים", "הַמֻּמְחִים"]],
    englishDistractors: ["The council", "heard", "the proposal", "of the experts"],
    notes: "להתעלם מ־ means to ignore. עדות can mean testimony or evidence depending on context."
  }),
  buildReviewedSentence({
    id: "inat_22", emoji: "🧠", category: "formal", difficulty: 3,
    wordOrderDecision: "alternates",
    hebrew: "החוקרת מתעדת כיצד זיכרון קולקטיבי משתנה עם הזמן.",
    hebrewNiqqud: "הַחוֹקֶרֶת מְתַעֶדֶת כֵּיצַד זִכָּרוֹן קוֹלֶקְטִיבִי מִשְׁתַּנֶּה עִם הַזְּמַן.",
    english: "The researcher documents how collective memory changes over time.",
    hebrewTokenPairs: [["החוקרת", "הַחוֹקֶרֶת"], ["מתעדת", "מְתַעֶדֶת"], ["כיצד", "כֵּיצַד"], ["זיכרון קולקטיבי", "זִכָּרוֹן קוֹלֶקְטִיבִי"], ["משתנה", "מִשְׁתַּנֶּה"], ["עם הזמן", "עִם הַזְּמַן"]],
    englishTokens: ["The researcher", "documents", "how", "collective memory", "changes", "over time"],
    hebrewDistractorPairs: [["העיתונאית", "הָעִתּוֹנָאִית"], ["מנחשת", "מְנַחֶשֶׁת"], ["מדוע", "מַדּוּעַ"], ["זיכרון אישי", "זִכָּרוֹן אִישִׁי"]],
    englishDistractors: ["The journalist", "guesses", "why", "personal", "memory"],
    hebrewOrderAlternates: [{
      text: "החוקרת מתעדת כיצד עם הזמן זיכרון קולקטיבי משתנה.",
      textNiqqud: "הַחוֹקֶרֶת מְתַעֶדֶת כֵּיצַד עִם הַזְּמַן זִכָּרוֹן קוֹלֶקְטִיבִי מִשְׁתַּנֶּה.",
      order: [0, 1, 2, 5, 3, 4],
    }],
    notes: "זיכרון קולקטיבי is collective memory: the shared, changing remembrance of a group."
  }),
  buildReviewedSentence({
    id: "inat_23", emoji: "📅", category: "formal", difficulty: 2,
    wordOrderDecision: "alternates",
    hebrew: "אתמול מחינו בכיכר, ומחר נמחה שוב.",
    hebrewNiqqud: "אֶתְמוֹל מָחִינוּ בַּכִּכָּר, וּמָחָר נִמְחֶה שׁוּב.",
    english: "Yesterday we protested in the square and tomorrow we will protest again.",
    hebrewTokenPairs: [["אתמול", "אֶתְמוֹל"], ["מחינו", "מָחִינוּ"], ["בכיכר", "בַּכִּכָּר"], ["ומחר", "וּמָחָר"], ["נמחה", "נִמְחֶה"], ["שוב", "שׁוּב"]],
    englishTokens: ["Yesterday", "we protested", "in the square", "and tomorrow", "we will protest", "again"],
    hebrewDistractorPairs: [["היום", "הַיּוֹם"], ["חגגנו", "חָגַגְנוּ"], ["בפארק", "בַּפַּארְק"], ["ננוח", "נָנוּחַ"]],
    englishDistractors: ["Today", "we celebrated", "in the park", "we will rest"],
    hebrewOrderAlternates: [
      {
        text: "מחינו אתמול בכיכר, ומחר נמחה שוב.",
        textNiqqud: "מָחִינוּ אֶתְמוֹל בַּכִּכָּר, וּמָחָר נִמְחֶה שׁוּב.",
        order: [1, 0, 2, 3, 4, 5],
      },
      {
        text: "מחינו בכיכר אתמול, ומחר נמחה שוב.",
        textNiqqud: "מָחִינוּ בַּכִּכָּר אֶתְמוֹל, וּמָחָר נִמְחֶה שׁוּב.",
        order: [1, 2, 0, 3, 4, 5],
      },
      {
        text: "אתמול מחינו בכיכר, ומחר שוב נמחה.",
        textNiqqud: "אֶתְמוֹל מָחִינוּ בַּכִּכָּר, וּמָחָר שׁוּב נִמְחֶה.",
        order: [0, 1, 2, 3, 5, 4],
      },
      {
        text: "מחינו אתמול בכיכר, ומחר שוב נמחה.",
        textNiqqud: "מָחִינוּ אֶתְמוֹל בַּכִּכָּר, וּמָחָר שׁוּב נִמְחֶה.",
        order: [1, 0, 2, 3, 5, 4],
      },
      {
        text: "מחינו בכיכר אתמול, ומחר שוב נמחה.",
        textNiqqud: "מָחִינוּ בַּכִּכָּר אֶתְמוֹל, וּמָחָר שׁוּב נִמְחֶה.",
        order: [1, 2, 0, 3, 5, 4],
      },
    ],
    notes: "מחינו is past 'we protested'; נמחה is future 'we will protest.' Both come from למחות."
  }),
  buildReviewedSentence({
    id: "inat_24", emoji: "↔️", category: "formal", difficulty: 3,
    wordOrderDecision: "fixed",
    hebrew: "המאמר מציב נרטיב נגדי מול הסיפור ההגמוני.",
    hebrewNiqqud: "הַמַּאֲמָר מַצִּיב נָרָטִיב נֶגְדִּי מוּל הַסִּפּוּר הַהֶגְמוֹנִי.",
    english: "The article sets a counter-narrative against the hegemonic story.",
    hebrewTokenPairs: [["המאמר", "הַמַּאֲמָר"], ["מציב", "מַצִּיב"], ["נרטיב נגדי", "נָרָטִיב נֶגְדִּי"], ["מול", "מוּל"], ["הסיפור", "הַסִּפּוּר"], ["ההגמוני", "הַהֶגְמוֹנִי"]],
    englishTokens: ["The article", "sets", "a counter-narrative", "against", "the hegemonic", "story"],
    hebrewDistractorPairs: [["הנאום", "הַנְּאוּם"], ["מסתיר", "מַסְתִּיר"], ["קונצנזוס", "קוֹנְצֶנְזוּס"], ["לצד", "לְצַד"]],
    englishDistractors: ["The speech", "hides", "a consensus", "beside"],
    notes: "נרטיב נגדי is a counter-narrative; הגמוני describes a dominant cultural account."
  }),
];

SENTENCE_BANK.push(...INBAL_SENTENCES, ...INAT_SENTENCES);

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
  __build: "20260726e",
};
})(typeof window !== "undefined" ? window : globalThis);

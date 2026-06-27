(function initIvriQuestSentenceBank(global) {
"use strict";

const SENTENCE_BANK = [
  {
    "id": "colloquial_01",
    "emoji": "📵",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "מה נסגר איתך? לא שמעתי ממך כל היום.",
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
    "hebrew_alternates": [
      {
        "text": "מה נסגר איתך? כל היום לא שמעתי ממך.",
        "tokens": [
          "מה",
          "נסגר",
          "איתך",
          "כל",
          "היום",
          "לא",
          "שמעתי",
          "ממך"
        ]
      }
    ],
    "english_distractors": [
      "the plan",
      "about him",
      "saw",
      "from him",
      "last night",
      "I just"
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
    "english_distractors": [
      "more time",
      "tomorrow morning",
      "spoke",
      "never",
      "want"
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
    "hebrew_alternates": [
      {
        "text": "אתמול זה היה ממש מטורף, לא האמנתי למה שקרה.",
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
        ]
      }
    ],
    "english_distractors": [
      "It was",
      "completely normal",
      "this morning",
      "I totally saw",
      "what changed"
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
    "english": "Wait a second, I'm coming downstairs right now.",
    "hebrew_tokens": [
      "חכה",
      "שנייה",
      "אני",
      "כבר",
      "בא",
      "למטה"
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
    "hebrew_alternates": [
      {
        "text": "חכה שנייה, אני כבר באה למטה.",
        "tokens": [
          "חכה",
          "שנייה",
          "אני",
          "כבר",
          "באה",
          "למטה"
        ]
      }
    ],
    "english_distractors": [
      "one minute",
      "upstairs",
      "going",
      "right here",
      "leaving"
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
    "hebrew_alternates": [
      {
        "text": "היא עשתה לי קטע מסריח, אני לא סומכת עליה יותר.",
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
        ]
      }
    ],
    "english_distractors": [
      "He",
      "made",
      "nice",
      "for me",
      "him"
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
    "english": "Come on, let's go, it's getting late.",
    "hebrew_tokens": [
      "יאללה",
      "בוא",
      "נזוז",
      "נהיה",
      "מאוחר"
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
    "hebrew_alternates": [
      {
        "text": "איפה שמתי את המפתחות שלי? אני לא מוצאת אותם.",
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
        ]
      }
    ],
    "english_distractors": [
      "When",
      "did I lose",
      "my wallet",
      "see",
      "it"
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
    "hebrew_alternates": [
      {
        "text": "נו, את באה איתנו או לא? תחליטי כבר.",
        "tokens": [
          "נו",
          "את",
          "באה",
          "איתנו",
          "או",
          "לא",
          "תחליטי",
          "כבר"
        ]
      }
    ],
    "english_distractors": [
      "are they",
      "without us",
      "going home",
      "Take your time",
      "right now"
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
    "english": "Cool, tomorrow at 8, don't be late.",
    "hebrew_tokens": [
      "סבבה",
      "מחר",
      "ב-8",
      "אל",
      "תאחר"
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
    "hebrew_alternates": [
      {
        "text": "אני צריכה לקנות חלב ולחם, אין כלום בבית.",
        "tokens": [
          "אני",
          "צריכה",
          "לקנות",
          "חלב",
          "ולחם",
          "אין",
          "כלום",
          "בבית"
        ]
      }
    ],
    "english_distractors": [
      "to sell",
      "eggs",
      "and cheese",
      "everything",
      "at the store"
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
    "hebrew_alternates": [
      {
        "text": "באיזה שעה את חוזרת הביתה? אני רוצה לתכנן ארוחת ערב.",
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
        ]
      }
    ],
    "english_distractors": [
      "day",
      "leaving",
      "work",
      "I need",
      "to make",
      "lunch"
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
    "hebrew_alternates": [
      {
        "text": "יש לך עט שאני יכולה להשתמש בו? אני צריכה לכתוב משהו.",
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
        ]
      }
    ],
    "english_distractors": [
      "a pencil",
      "borrow",
      "I want",
      "to read",
      "anything"
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
    "english": "We're meeting near the station, don't be late.",
    "hebrew_tokens": [
      "אנחנו",
      "נפגשים",
      "ליד",
      "התחנה",
      "אל",
      "תאחר"
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
    "english_tokens": [
      "Is",
      "it",
      "near here",
      "or",
      "far from here",
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
    "english_distractors": [
      "from there",
      "very big",
      "understand",
      "the city",
      "too small"
    ],
    "notes": "מכאן literally means 'from here'; in natural English this often comes out as 'near here' or 'far from here.' קרוב/רחוק (close/far) are basic but essential spatial adjectives."
  },
  {
    "id": "everyday_09",
    "emoji": "🧾",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אפשר לקבל את החשבון, בבקשה?",
    "english": "Can I get the bill, please?",
    "hebrew_tokens": [
      "אפשר",
      "לקבל",
      "את",
      "החשבון",
      "בבקשה"
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
    "hebrew_alternates": [
      {
        "text": "מה אתה רוצה לאכול הערב? אני לא יודעת מה לבשל.",
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
        ]
      }
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
    "notes": "לאכול (to eat) vs לבשל (to cook) vs להזמין (to order) — food-related verb distractors."
  },
  {
    "id": "everyday_11",
    "emoji": "🍕",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "הזמנו פיצה, היא אמורה להגיע בעוד עשרים דקות.",
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
    "english": "How long does it take to get there by bus?",
    "hebrew_tokens": [
      "כמה",
      "זמן",
      "לוקח",
      "להגיע",
      "לשם",
      "באוטובוס"
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
    "english": "The train is delayed, we should take a taxi.",
    "hebrew_tokens": [
      "הרכבת",
      "מתעכבת",
      "כדאי",
      "לקחת",
      "מונית"
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
    "english": "The laundry is done, can you take it out of the dryer?",
    "hebrew_tokens": [
      "הכביסה",
      "מוכנה",
      "אפשר",
      "להוציא",
      "אותה",
      "מהמייבש"
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
    "english": "Has anyone seen the TV remote?",
    "hebrew_tokens": [
      "מישהו",
      "ראה",
      "את",
      "השלט",
      "של",
      "הטלוויזיה"
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
    "english": "The soap ran out, we need to buy more.",
    "hebrew_tokens": [
      "נגמר",
      "הסבון",
      "צריך",
      "לקנות"
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
    "hebrew_alternates": [
      {
        "text": "הייתי חצי שעה בתור ועדיין לא הגיע תורי.",
        "tokens": [
          "הייתי",
          "חצי",
          "שעה",
          "בתור",
          "ועדיין",
          "לא",
          "הגיע",
          "תורי"
        ]
      }
    ],
    "english_distractors": [
      "a quarter",
      "ten minutes",
      "already done",
      "passed by",
      "your turn"
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
    "english": "If I don't answer, leave a message.",
    "hebrew_tokens": [
      "אם",
      "אני",
      "לא",
      "עונה",
      "תשאיר",
      "הודעה"
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
    "hebrew_alternates": [
      {
        "text": "הוא שלח לי הודעה במוצאי שבת כאילו כלום לא קרה.",
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
        ]
      }
    ],
    "hebrew_distractors": [
      "בלילה",
      "מחר",
      "פתאום",
      "אחרי",
      "בבוקר",
      "לא ענה"
    ],
    "english_distractors": [
      "called",
      "Friday",
      "morning",
      "like nothing",
      "changed"
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
    "english_distractors": [
      "I suggest",
      "small",
      "change",
      "the documents",
      "for sure",
      "a problem"
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
    "hebrew_alternates": [
      {
        "text": "לפני קבלת החלטה יש לשקול את ההשלכות ארוכות הטווח.",
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
        ]
      }
    ],
    "english_distractors": [
      "One should",
      "ignore",
      "the short-term",
      "after",
      "an opinion"
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
    "hebrew_alternates": [
      {
        "text": "למרות התנודות הקטנות, הנתונים מצביעים על מגמה ברורה.",
        "tokens": [
          "למרות",
          "התנודות",
          "הקטנות",
          "הנתונים",
          "מצביעים",
          "על",
          "מגמה",
          "ברורה"
        ]
      }
    ],
    "english_distractors": [
      "show",
      "a vague",
      "change",
      "because of",
      "major"
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
    "english_tokens": [
      "There is",
      "significant variation",
      "between the groups",
      "and",
      "it must be explained"
    ],
    "hebrew_distractors": [
      "קיים",
      "הבדל",
      "קטנה",
      "בתוך",
      "לבדוק",
      "אותו"
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
    "hebrew_alternates": [
      {
        "text": "לפני בחירה יש לבחון את האפשרויות השונות לעומק.",
        "tokens": [
          "לפני",
          "בחירה",
          "יש",
          "לבחון",
          "את",
          "האפשרויות",
          "השונות",
          "לעומק"
        ]
      }
    ],
    "english_distractors": [
      "The same",
      "methods",
      "can be",
      "reviewed",
      "after"
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
    "english": "The ceremony was held in the main hall after sunset.",
    "hebrew_tokens": [
      "הטקס",
      "התקיים",
      "באולם",
      "המרכזי",
      "אחרי",
      "השקיעה"
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
    "english": "The discussion took place on Zoom, not in the office.",
    "hebrew_tokens": [
      "הדיון",
      "התקיים",
      "בזום",
      "ולא",
      "במשרד"
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
    "english": "There is a simpler solution to this problem.",
    "hebrew_tokens": [
      "קיים",
      "פתרון",
      "פשוט",
      "יותר",
      "לבעיה",
      "הזאת"
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
    "english": "There are several risks that need to be taken into account.",
    "hebrew_tokens": [
      "קיימים",
      "כמה",
      "סיכונים",
      "שצריך",
      "לקחת",
      "בחשבון"
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
    "english": "The agreement still exists despite the changes.",
    "hebrew_tokens": [
      "ההסכם",
      "עדיין",
      "קיים",
      "למרות",
      "השינויים"
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
    "english": "This solution is sustainable even in the long term.",
    "hebrew_tokens": [
      "הפתרון",
      "הזה",
      "בר קיימא",
      "גם",
      "בטווח",
      "הארוך"
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
    "english_distractors": [
      "That idea",
      "is temporary",
      "only",
      "in the short term"
    ],
    "notes": "בר קיימא means 'sustainable' or literally 'able to exist'; it differs from קיים as 'exists'."
  },
  {
    "id": "formal_17",
    "emoji": "👽",
    "category": "formal",
    "style": null,
    "difficulty": 3,
    "hebrew": "קיום חיים מחוץ לכדור הארץ עדיין לא הוכח.",
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
    "english": "How much is this? Come on, give me a good price and I'll take two.",
    "hebrew_tokens": ["כמה", "זה", "נו", "תן", "לי", "מחיר", "טוב", "ואני", "לוקח", "שניים"],
    "english_tokens": ["How much", "is this", "Come on", "give", "me", "a good", "price", "and", "I'll take", "two"],
    "hebrew_distractors": ["יקר", "זול", "מוכר", "אחד", "עכשיו"],
    "english_distractors": ["That's too expensive", "the cheapest one", "I'll sell", "just one", "right now"],
    "notes": "נו is an all-purpose nudge — 'come on / well.' Haggling at the שוק (market) is expected, not rude."
  },
  {
    "id": "colloquial_22",
    "emoji": "🧆",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "חצי מנה בפיתה, עם הכול ובלי חריף בבקשה.",
    "english": "Half a portion in a pita, with everything and without spicy please.",
    "hebrew_tokens": ["חצי", "מנה", "בפיתה", "עם", "הכול", "ובלי", "חריף", "בבקשה"],
    "english_tokens": ["Half", "a portion", "in a pita", "with", "everything", "and without", "spicy", "please"],
    "hebrew_distractors": ["שלמה", "בלאפה", "חסה", "מתוק", "פלאפל"],
    "english_distractors": ["A full portion", "in a laffa", "with salad", "extra sauce", "no salt"],
    "notes": "עם הכול ('with everything') is the standard way to order toppings; חריף = spicy/hot sauce."
  },
  {
    "id": "colloquial_23",
    "emoji": "🤤",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "האוכל שם היה חבל על הזמן, חייבים לחזור.",
    "english": "The food there was amazing, we have to go back.",
    "hebrew_tokens": ["האוכל", "שם", "היה", "חבל", "על", "הזמן", "חייבים", "לחזור"],
    "english_tokens": ["The food", "there", "was", "amazing", "we", "have to", "go back"],
    "hebrew_distractors": ["גרוע", "פעם", "אסור", "להישאר", "יקר"],
    "english_distractors": ["was terrible", "we shouldn't", "stay home", "next time", "too pricey"],
    "notes": "חבל על הזמן literally means 'a waste of time,' but in slang it's high praise — 'amazing / out of this world.' Tone decides the meaning."
  },
  {
    "id": "colloquial_24",
    "emoji": "😖",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "השירות במסעדה הזאת היה ממש על הפנים.",
    "english": "The service at this restaurant was really terrible.",
    "hebrew_tokens": ["השירות", "במסעדה", "הזאת", "היה", "ממש", "על", "הפנים"],
    "english_tokens": ["The service", "at", "this restaurant", "was", "really", "terrible"],
    "hebrew_distractors": ["האוכל", "מצוין", "קצת", "מהיר", "נחמד"],
    "english_distractors": ["The food", "was excellent", "a little", "quite fast", "very friendly"],
    "notes": "על הפנים (literally 'on the face') is slang for 'awful / lousy' — used for service, weather, or how you feel."
  },
  {
    "id": "colloquial_25",
    "emoji": "🍦",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "שוב נפגשנו במקרה? פעם שלישית גלידה!",
    "english": "We met by chance again? Third time you owe me ice cream!",
    "hebrew_tokens": ["שוב", "נפגשנו", "במקרה", "פעם", "שלישית", "גלידה"],
    "english_tokens": ["We met", "by chance", "again", "Third time", "you owe me", "ice cream"],
    "hebrew_distractors": ["אולי", "בכוונה", "ראשונה", "קפה", "שוקולד"],
    "english_distractors": ["on purpose", "the first time", "coffee's on you", "by mistake", "tomorrow"],
    "notes": "פעם שלישית גלידה ('third time, ice cream') is a playful saying — keep bumping into someone and the third time 'earns' a treat. Israel's 'we have to stop meeting like this.'"
  },
  {
    "id": "colloquial_26",
    "emoji": "🎫",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "לקחתי מספר ואני כבר מחכה שעה בתור.",
    "english": "I took a number and I've already been waiting an hour in line.",
    "hebrew_tokens": ["לקחתי", "מספר", "ואני", "כבר", "מחכה", "שעה", "בתור"],
    "english_tokens": ["I took", "a number", "and I've", "already", "been waiting", "an hour", "in line"],
    "hebrew_distractors": ["שכחתי", "טופס", "הלכתי", "דקה", "בבית"],
    "english_distractors": ["I forgot", "a form", "for a minute", "I left", "at the desk"],
    "notes": "Standing בתור (in line) and taking a מספר (number) is a rite of passage at any Israeli office or clinic. כבר here adds the 'already' impatience."
  },
  {
    "id": "colloquial_27",
    "emoji": "🏖️",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "בוא נלך לים לפני שיהיה חם מדי.",
    "english": "Let's go to the beach before it gets too hot.",
    "hebrew_tokens": ["בוא", "נלך", "לים", "לפני", "שיהיה", "חם", "מדי"],
    "english_tokens": ["Let's", "go", "to the beach", "before", "it gets", "too", "hot"],
    "hebrew_distractors": ["נישאר", "לפארק", "אחרי", "קר", "עכשיו"],
    "hebrew_alternates": [
      {
        "text": "לפני שיהיה חם מדי, בוא נלך לים.",
        "tokens": ["לפני", "שיהיה", "חם", "מדי", "בוא", "נלך", "לים"]
      }
    ],
    "english_distractors": ["Let's stay", "to the park", "after", "too cold", "later"],
    "notes": "ים (literally 'sea') is how Israelis say 'the beach.' בוא נ... ('come, let's...') is the everyday way to suggest doing something."
  },
  {
    "id": "colloquial_28",
    "emoji": "🚐",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "נהג, אפשר לרדת בתחנה הבאה? תודה.",
    "english": "Driver, can I get off at the next stop? Thanks.",
    "hebrew_tokens": ["נהג", "אפשר", "לרדת", "בתחנה", "הבאה", "תודה"],
    "english_tokens": ["Driver", "can I", "get off", "at the", "next", "stop", "Thanks"],
    "hebrew_distractors": ["מונית", "לעלות", "הקודמת", "עכשיו", "כסף"],
    "english_distractors": ["Taxi", "get on", "the previous stop", "right here", "the fare"],
    "notes": "On a מונית שירות (shared taxi) you call out to the נהג (driver) to be let off; לרדת ('to go down') is how you say to get off a bus or taxi."
  },
  {
    "id": "colloquial_29",
    "emoji": "😱",
    "category": "colloquial",
    "style": null,
    "difficulty": 1,
    "hebrew": "אין מצב! לא מאמין שהוא באמת אמר את זה.",
    "english": "No way! I can't believe he really said that.",
    "hebrew_tokens": ["אין", "מצב", "לא", "מאמין", "שהוא", "באמת", "אמר", "את", "זה"],
    "english_tokens": ["No", "way", "I can't", "believe", "he", "really", "said", "that"],
    "hebrew_distractors": ["יש", "ברור", "שמעתי", "אולי", "שתק"],
    "english_distractors": ["Of course", "I heard that", "maybe", "he asked", "stayed quiet"],
    "notes": "אין מצב (literally 'there's no situation') means 'no way! / impossible!' — disbelief or flat refusal, depending on tone."
  },
  {
    "id": "colloquial_30",
    "emoji": "🥹",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "כפרה עליך, לא יודעת מה הייתי עושה בלעדיך.",
    "english": "You're a lifesaver, I don't know what I'd do without you.",
    "hebrew_tokens": ["כפרה", "עליך", "לא", "יודעת", "מה", "הייתי", "עושה", "בלעדיך"],
    "english_tokens": ["You're a lifesaver", "I don't", "know", "what", "I'd", "do", "without you"],
    "hebrew_distractors": ["איתך", "כן", "חושבת", "איפה", "בלעדיו"],
    "english_distractors": ["Thank you", "I do", "when", "I can", "with you"],
    "notes": "כפרה עליך (Mizrahi origin, literally 'atonement upon you') is a deeply affectionate expression of love and gratitude — much warmer than a plain 'sweetheart,' closer to 'you're a lifesaver / I adore you.' On its own, כפרה can be used as a tender 'sweetheart.'"
  },
  {
    "id": "everyday_22",
    "emoji": "😴",
    "category": "everyday",
    "style": null,
    "difficulty": 1,
    "hebrew": "אני לא מסוגל לקום מוקדם בבוקר.",
    "english": "I can't get up early in the morning.",
    "hebrew_tokens": ["אני", "לא", "מסוגל", "לקום", "מוקדם", "בבוקר"],
    "english_tokens": ["I", "can't", "get up", "early", "in the morning"],
    "hebrew_distractors": ["רוצה", "אוהב", "לישון", "מאוחר", "בלילה"],
    "english_distractors": ["I want", "love to", "sleep", "late", "at night"],
    "notes": "מסוגל means 'capable of / able to' and is followed by an infinitive; 'לא מסוגל' is a very common way to say 'I just can't (bring myself to).'"
  },
  {
    "id": "everyday_23",
    "emoji": "💪",
    "category": "everyday",
    "style": null,
    "difficulty": 2,
    "hebrew": "היא מסוגלת לעבוד שתים עשרה שעות ברצף.",
    "english": "She is able to work twelve hours straight.",
    "hebrew_tokens": ["היא", "מסוגלת", "לעבוד", "שתים", "עשרה", "שעות", "ברצף"],
    "english_tokens": ["She", "is able to", "work", "twelve", "hours", "straight"],
    "hebrew_distractors": ["רוצה", "צריכה", "לנוח", "שלוש", "לבד"],
    "english_distractors": ["wants to", "needs to", "rest", "three", "alone"],
    "notes": "מסוגלת is the feminine singular of מסוגל; ברצף means 'in a row / straight / continuously.'"
  },
  {
    "id": "colloquial_31",
    "emoji": "🤨",
    "category": "colloquial",
    "style": null,
    "difficulty": 2,
    "hebrew": "אתה באמת מסוגל לעשות את זה לבד?",
    "english": "Are you really capable of doing this alone?",
    "hebrew_tokens": ["אתה", "באמת", "מסוגל", "לעשות", "את", "זה", "לבד"],
    "english_tokens": ["Are you", "really", "capable of", "doing", "this", "alone"],
    "hebrew_distractors": ["היא", "אולי", "לסיים", "אותו", "יחד"],
    "english_distractors": ["Is she", "maybe", "finishing", "it", "together"],
    "notes": "מסוגל ל־ + infinitive = 'capable of doing'; here it carries a slightly challenging, 'you sure?' tone."
  },
  {
    "id": "colloquial_32",
    "emoji": "😶",
    "category": "colloquial",
    "style": null,
    "difficulty": 3,
    "hebrew": "אני פשוט לא מסוגל להאמין שזה קרה.",
    "english": "I just can't believe that this happened.",
    "hebrew_tokens": ["אני", "פשוט", "לא", "מסוגל", "להאמין", "שזה", "קרה"],
    "english_tokens": ["I", "just", "can't", "believe", "that", "this", "happened"],
    "hebrew_distractors": ["מוכן", "עדיין", "לזכור", "שהוא", "נגמר"],
    "english_distractors": ["willing", "still", "remember", "that he", "ended"],
    "notes": "'לא מסוגל להאמין' is the everyday 'I can't believe it' — מסוגל adds a sense of being emotionally unable, stronger than a plain לא יכול."
  },
  {
    "id": "professional_11",
    "emoji": "🎯",
    "category": "professional",
    "style": null,
    "difficulty": 3,
    "hebrew": "אנחנו מסוגלים לעמוד ביעדים שהוצבו.",
    "english": "We are able to meet the targets that were set.",
    "hebrew_tokens": ["אנחנו", "מסוגלים", "לעמוד", "ביעדים", "שהוצבו"],
    "english_tokens": ["We", "are able to", "meet", "the targets", "that were set"],
    "hebrew_distractors": ["מתכוונים", "לסיים", "במשימות", "שבוטלו", "מחר"],
    "english_distractors": ["intend to", "finish", "the tasks", "that were canceled", "tomorrow"],
    "notes": "מסוגלים is the masculine plural; לעמוד ב־ means 'to meet / live up to' a target, deadline, or standard."
  }
];

function cloneSentence(item) {
  return {
    ...item,
    english_tokens: Array.isArray(item?.english_tokens) ? [...item.english_tokens] : [],
    hebrew_tokens: Array.isArray(item?.hebrew_tokens) ? [...item.hebrew_tokens] : [],
    english_distractors: Array.isArray(item?.english_distractors) ? [...item.english_distractors] : [],
    hebrew_distractors: Array.isArray(item?.hebrew_distractors) ? [...item.hebrew_distractors] : [],
  };
}

global.IvriQuestSentenceBank = {
  getSentenceBank() {
    return SENTENCE_BANK.map(cloneSentence);
  },
  __build: "20260622a",
};
})(typeof window !== "undefined" ? window : globalThis);

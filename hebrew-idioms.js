// Hebrew idioms data for Advanced Conjugation game mode.
// Each entry exposes a normalized shape used by advConj functions in app.js:
//   present_tense  — alias for conjugations.present
//   past_tense     — alias for conjugations.past
//   future_tense   — alias for conjugations.future
//   english_meaning — alias for english
const HEBREW_IDIOMS = (function () {
  const raw = [
  {
    "id": "hidlik",
    "infinitive": "להדליק מישהו",
    "english": "to excite / turn someone on",
    "verb": "להדליק",
    "root": "ד.ל.ק",
    "binyan": "hifil",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "אתה מדליק אותי",
    "negated": false,
    "literal_sg": "{s} lights {o} up",
    "literal_pl": "{s} light {o} up",
    "literal_past": "{s} lit {o} up",
    "literal_future": "{s} will light {o} up",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מדליק",
        "fsg": "מדליקה",
        "mpl": "מדליקים",
        "fpl": "מדליקות"
      },
      "past": {
        "msg": "הדליק",
        "fsg": "הדליקה",
        "mpl": "הדליקו",
        "fpl": "הדליקו"
      },
      "future": {
        "msg": "ידליק",
        "fsg": "תדליק",
        "mpl": "ידליקו",
        "fpl": "ידליקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַדְלִיק",
        "fsg": "מַדְלִיקָה",
        "mpl": "מַדְלִיקִים",
        "fpl": "מַדְלִיקוֹת"
      },
      "past": {
        "msg": "הִדְלִיק",
        "fsg": "הִדְלִיקָה",
        "mpl": "הִדְלִיקוּ",
        "fpl": "הִדְלִיקוּ"
      },
      "future": {
        "msg": "יַדְלִיק",
        "fsg": "תַּדְלִיק",
        "mpl": "יַדְלִיקוּ",
        "fpl": "יַדְלִיקוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "https://www.pealim.com/dict/423-lehadlik/"
    ]
  },
  {
    "id": "kara",
    "infinitive": "לקרוע מישהו",
    "english": "to kill/send someone [funny]",
    "verb": "לקרוע",
    "root": "ק.ר.ע",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הוא קורע אותי",
    "negated": false,
    "literal_sg": "{s} tears {o}",
    "literal_pl": "{s} tear {o}",
    "literal_past": "{s} tore {o}",
    "literal_future": "{s} will tear {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "קורע",
        "fsg": "קורעת",
        "mpl": "קורעים",
        "fpl": "קורעות"
      },
      "past": {
        "msg": "קרע",
        "fsg": "קרעה",
        "mpl": "קרעו",
        "fpl": "קרעו"
      },
      "future": {
        "msg": "יקרע",
        "fsg": "תקרע",
        "mpl": "יקרעו",
        "fpl": "יקרעו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "קוֹרֵעַ",
        "fsg": "קוֹרַעַת",
        "mpl": "קוֹרְעִים",
        "fpl": "קוֹרְעוֹת"
      },
      "past": {
        "msg": "קָרַע",
        "fsg": "קָרְעָה",
        "mpl": "קָרְעוּ",
        "fpl": "קָרְעוּ"
      },
      "future": {
        "msg": "יִקְרַע",
        "fsg": "תִּקְרַע",
        "mpl": "יִקְרְעוּ",
        "fpl": "יִקְרְעוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-likroa"
    ]
  },
  {
    "id": "haalat_sif",
    "infinitive": "להעלות למישהו את הסעיף",
    "english": "to drive someone up the wall",
    "verb": "להעלות",
    "root": "ע.ל.ה",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את הסעיף",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הסעיף",
    "example": "אתה מעלה לי את הסעיף",
    "negated": false,
    "literal_sg": "{s} raises {p} paragraph",
    "literal_pl": "{s} raise {p} paragraph",
    "literal_past": "{s} raised {p} paragraph",
    "literal_future": "{s} will raise {p} paragraph",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מעלה",
        "fsg": "מעלה",
        "mpl": "מעלים",
        "fpl": "מעלות"
      },
      "past": {
        "msg": "העלה",
        "fsg": "העלתה",
        "mpl": "העלו",
        "fpl": "העלו"
      },
      "future": {
        "msg": "יעלה",
        "fsg": "תעלה",
        "mpl": "יעלו",
        "fpl": "יעלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲלֶה",
        "fsg": "מַעֲלָה",
        "mpl": "מַעֲלִים",
        "fpl": "מַעֲלוֹת"
      },
      "past": {
        "msg": "הֶעֱלָה",
        "fsg": "הֶעֶלְתָה",
        "mpl": "הֶעֱלוּ",
        "fpl": "הֶעֱלוּ"
      },
      "future": {
        "msg": "יַעֲלֶה",
        "fsg": "תַּעֲלֶה",
        "mpl": "יַעֲלוּ",
        "fpl": "יַעֲלוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַסָּעִיף",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaalot"
    ]
  },
  {
    "id": "horadat_hesheq",
    "infinitive": "להוריד למישהו את החשק",
    "english": "to kill someone's motivation",
    "verb": "להוריד",
    "root": "י.ר.ד",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את החשק",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את החשק",
    "example": "אתה מוריד לי את החשק",
    "negated": false,
    "literal_sg": "{s} brings down {p} desire",
    "literal_pl": "{s} bring down {p} desire",
    "literal_past": "{s} brought down {p} desire",
    "literal_future": "{s} will bring down {p} desire",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוריד",
        "fsg": "מורידה",
        "mpl": "מורידים",
        "fpl": "מורידות"
      },
      "past": {
        "msg": "הוריד",
        "fsg": "הורידה",
        "mpl": "הורידו",
        "fpl": "הורידו"
      },
      "future": {
        "msg": "יוריד",
        "fsg": "תוריד",
        "mpl": "יורידו",
        "fpl": "יורידו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹרִיד",
        "fsg": "מוֹרִידָה",
        "mpl": "מוֹרִידִים",
        "fpl": "מוֹרִידוֹת"
      },
      "past": {
        "msg": "הוֹרִיד",
        "fsg": "הוֹרִידָה",
        "mpl": "הוֹרִידוּ",
        "fpl": "הוֹרִידוּ"
      },
      "future": {
        "msg": "יוֹרִיד",
        "fsg": "תּוֹרִיד",
        "mpl": "יוֹרִידוּ",
        "fpl": "יוֹרִידוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַחֵשֶׁק",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehorid"
    ]
  },
  {
    "id": "hotzaat_mitz",
    "infinitive": "להוציא למישהו את המיץ",
    "english": "to exhaust / wear someone out",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את המיץ",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את המיץ",
    "example": "אתה מוציא לי את המיץ",
    "negated": false,
    "literal_sg": "{s} takes out {p} juice",
    "literal_pl": "{s} take out {p} juice",
    "literal_past": "{s} took out {p} juice",
    "literal_future": "{s} will take out {p} juice",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַמִּיץ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "shvira_lev",
    "infinitive": "לשבור למישהו את הלב",
    "english": "to break someone's heart",
    "verb": "לשבור",
    "root": "ש.ב.ר",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את הלב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הלב",
    "example": "אתה שובר לי את הלב",
    "negated": false,
    "literal_sg": "{s} breaks {p} heart",
    "literal_pl": "{s} break {p} heart",
    "literal_past": "{s} broke {p} heart",
    "literal_future": "{s} will break {p} heart",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "שובר",
        "fsg": "שוברת",
        "mpl": "שוברים",
        "fpl": "שוברות"
      },
      "past": {
        "msg": "שבר",
        "fsg": "שברה",
        "mpl": "שברו",
        "fpl": "שברו"
      },
      "future": {
        "msg": "ישבור",
        "fsg": "תשבור",
        "mpl": "ישברו",
        "fpl": "ישברו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "שׁוֹבֵר",
        "fsg": "שׁוֹבֶרֶת",
        "mpl": "שׁוֹבְרִים",
        "fpl": "שׁוֹבְרוֹת"
      },
      "past": {
        "msg": "שָׁבַר",
        "fsg": "שָׁבְרָה",
        "mpl": "שָׁבְרוּ",
        "fpl": "שָׁבְרוּ"
      },
      "future": {
        "msg": "יִשְׁבֹּר",
        "fsg": "תִּשְׁבֹּר",
        "mpl": "יִשְׁבְּרוּ",
        "fpl": "יִשְׁבְּרוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַלֵּב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lishbor"
    ]
  },
  {
    "id": "asiya_hayim",
    "infinitive": "לעשות למישהו את החיים קשים",
    "english": "to make someone's life difficult",
    "verb": "לעשות",
    "root": "ע.ש.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את החיים קשים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את החיים קשים",
    "example": "אתה עושה לי את החיים קשים",
    "negated": false,
    "literal_sg": "{s} makes {p} life difficult",
    "literal_pl": "{s} make {p} life difficult",
    "literal_past": "{s} made {p} life difficult",
    "literal_future": "{s} will make {p} life difficult",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַחַיִּים קָשִׁים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laasot"
    ]
  },
  {
    "id": "hfalat_asiman",
    "infinitive": "להפיל למישהו את האסימון",
    "english": "to make it click/make sense for someone",
    "verb": "להפיל",
    "root": "נ.פ.ל",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את האסימון",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את האסימון",
    "example": "אתה מפיל לי את האסימון",
    "negated": false,
    "literal_sg": "{s} drops {p} token",
    "literal_pl": "{s} drop {p} token",
    "literal_past": "{s} dropped {p} token",
    "literal_future": "{s} will drop {p} token",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מפיל",
        "fsg": "מפילה",
        "mpl": "מפילים",
        "fpl": "מפילות"
      },
      "past": {
        "msg": "הפיל",
        "fsg": "הפילה",
        "mpl": "הפילו",
        "fpl": "הפילו"
      },
      "future": {
        "msg": "יפיל",
        "fsg": "תפיל",
        "mpl": "יפילו",
        "fpl": "יפילו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַפִּיל",
        "fsg": "מַפִּילָה",
        "mpl": "מַפִּילִים",
        "fpl": "מַפִּילוֹת"
      },
      "past": {
        "msg": "הִפִּיל",
        "fsg": "הִפִּילָה",
        "mpl": "הִפִּילוּ",
        "fpl": "הִפִּילוּ"
      },
      "future": {
        "msg": "יַפִּיל",
        "fsg": "תַּפִּיל",
        "mpl": "יַפִּילוּ",
        "fpl": "יַפִּילוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָאֲסִימוֹן",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehapil"
    ]
  },
  {
    "id": "ptihat_einayim",
    "infinitive": "לפתוח למישהו את העיניים",
    "english": "to open someone's eyes",
    "verb": "לפתוח",
    "root": "פ.ת.ח",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את העיניים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את העיניים",
    "example": "אתה פותח לי את העיניים",
    "negated": false,
    "literal_sg": "{s} opens {p} eyes",
    "literal_pl": "{s} open {p} eyes",
    "literal_past": "{s} opened {p} eyes",
    "literal_future": "{s} will open {p} eyes",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "פותח",
        "fsg": "פותחת",
        "mpl": "פותחים",
        "fpl": "פותחות"
      },
      "past": {
        "msg": "פתח",
        "fsg": "פתחה",
        "mpl": "פתחו",
        "fpl": "פתחו"
      },
      "future": {
        "msg": "יפתח",
        "fsg": "תפתח",
        "mpl": "יפתחו",
        "fpl": "יפתחו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "פּוֹתֵחַ",
        "fsg": "פּוֹתַחַת",
        "mpl": "פּוֹתְחִים",
        "fpl": "פּוֹתְחוֹת"
      },
      "past": {
        "msg": "פָּתַח",
        "fsg": "פָּתְחָה",
        "mpl": "פָּתְחוּ",
        "fpl": "פָּתְחוּ"
      },
      "future": {
        "msg": "יִפְתַּח",
        "fsg": "תִּפְתַּח",
        "mpl": "יִפְתְּחוּ",
        "fpl": "יִפְתְּחוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָעֵינַיִם",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "https://www.pealim.com/dict/1747-liftoach/",
      "https://terms.hebrew-academy.org.il/munnah/66449_1/%D7%A8%D6%B4%D7%A4%D6%B0%D7%A8%D7%95%D6%BC%D7%A3%20%D7%94%D6%B8%D7%A2%D6%B5%D7%99%D7%A0%D6%B7%D7%99%D6%B4%D7%9D"
    ]
  },
  {
    "id": "yeshiva_neshama",
    "infinitive": "לשבת למישהו על הנשמה",
    "english": "to suffocate / pressure someone",
    "verb": "לשבת",
    "root": "י.ש.ב",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "על הנשמה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ על הנשמה",
    "example": "אתה יושב לי על הנשמה",
    "negated": false,
    "literal_sg": "{s} sits on {p} soul",
    "literal_pl": "{s} sit on {p} soul",
    "literal_past": "{s} sat on {p} soul",
    "literal_future": "{s} will sit on {p} soul",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "יושב",
        "fsg": "יושבת",
        "mpl": "יושבים",
        "fpl": "יושבות"
      },
      "past": {
        "msg": "ישב",
        "fsg": "ישבה",
        "mpl": "ישבו",
        "fpl": "ישבו"
      },
      "future": {
        "msg": "יישב",
        "fsg": "תישב",
        "mpl": "יישבו",
        "fpl": "יישבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "יוֹשֵׁב",
        "fsg": "יוֹשֶׁבֶת",
        "mpl": "יוֹשְׁבִים",
        "fpl": "יוֹשְׁבוֹת"
      },
      "past": {
        "msg": "יָשַׁב",
        "fsg": "יָשְׁבָה",
        "mpl": "יָשְׁבוּ",
        "fpl": "יָשְׁבוּ"
      },
      "future": {
        "msg": "יֵשֵׁב",
        "fsg": "תֵּשֵׁב",
        "mpl": "יֵשְׁבוּ",
        "fpl": "יֵשְׁבוּ"
      }
    },
    "fixed_object_niqqud": "עַל הַנְּשָׁמָה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lashevet"
    ]
  },
  {
    "id": "yerida_gav",
    "infinitive": "לרדת למישהו מהגב",
    "english": "to get off someone's back",
    "verb": "לרדת",
    "root": "י.ר.ד",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "מהגב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ מהגב",
    "example": "אתה יורד לי מהגב",
    "negated": false,
    "literal_sg": "{s} gets off {p} back",
    "literal_pl": "{s} get off {p} back",
    "literal_past": "{s} got off {p} back",
    "literal_future": "{s} will get off {p} back",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "יורד",
        "fsg": "יורדת",
        "mpl": "יורדים",
        "fpl": "יורדות"
      },
      "past": {
        "msg": "ירד",
        "fsg": "ירדה",
        "mpl": "ירדו",
        "fpl": "ירדו"
      },
      "future": {
        "msg": "יירד",
        "fsg": "תירד",
        "mpl": "יירדו",
        "fpl": "יירדו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "יוֹרֵד",
        "fsg": "יוֹרֶדֶת",
        "mpl": "יוֹרְדִים",
        "fpl": "יוֹרְדוֹת"
      },
      "past": {
        "msg": "יָרַד",
        "fsg": "יָרְדָה",
        "mpl": "יָרְדוּ",
        "fpl": "יָרְדוּ"
      },
      "future": {
        "msg": "יֵרֵד",
        "fsg": "תֵּרֵד",
        "mpl": "יֵרְדוּ",
        "fpl": "יֵרְדוּ"
      }
    },
    "fixed_object_niqqud": "מֵהַגַּב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laredet"
    ]
  },
  {
    "id": "amida_derekh",
    "infinitive": "לעמוד למישהו בדרך",
    "english": "to stand in someone's way",
    "verb": "לעמוד",
    "root": "ע.מ.ד",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "בדרך",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ בדרך",
    "example": "אתה עומד לי בדרך",
    "negated": false,
    "literal_sg": "{s} stands in {p} way",
    "literal_pl": "{s} stand in {p} way",
    "literal_past": "{s} stood in {p} way",
    "literal_future": "{s} will stand in {p} way",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "עומד",
        "fsg": "עומדת",
        "mpl": "עומדים",
        "fpl": "עומדות"
      },
      "past": {
        "msg": "עמד",
        "fsg": "עמדה",
        "mpl": "עמדו",
        "fpl": "עמדו"
      },
      "future": {
        "msg": "יעמוד",
        "fsg": "תעמוד",
        "mpl": "יעמדו",
        "fpl": "יעמדו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹמֵד",
        "fsg": "עוֹמֶדֶת",
        "mpl": "עוֹמְדִים",
        "fpl": "עוֹמְדוֹת"
      },
      "past": {
        "msg": "עָמַד",
        "fsg": "עָמְדָה",
        "mpl": "עָמְדוּ",
        "fpl": "עָמְדוּ"
      },
      "future": {
        "msg": "יַעֲמֹד",
        "fsg": "תַּעֲמֹד",
        "mpl": "יַעַמְדוּ",
        "fpl": "יַעַמְדוּ"
      }
    },
    "fixed_object_niqqud": "בַּדֶּרֶךְ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-laamod"
    ]
  },
  {
    "id": "khnisa_rosh",
    "infinitive": "להיכנס למישהו לראש",
    "english": "to get inside someone's head",
    "verb": "להיכנס",
    "root": "כ.נ.ס",
    "binyan": "nifal",
    "object_type": "l_dative",
    "fixed_object": "לראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ לראש",
    "example": "אתה נכנס לי לראש",
    "negated": false,
    "literal_sg": "{s} enters {p} head",
    "literal_pl": "{s} enter {p} head",
    "literal_past": "{s} entered {p} head",
    "literal_future": "{s} will enter {p} head",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "נכנס",
        "fsg": "נכנסת",
        "mpl": "נכנסים",
        "fpl": "נכנסות"
      },
      "past": {
        "msg": "נכנס",
        "fsg": "נכנסה",
        "mpl": "נכנסו",
        "fpl": "נכנסו"
      },
      "future": {
        "msg": "ייכנס",
        "fsg": "תיכנס",
        "mpl": "ייכנסו",
        "fpl": "ייכנסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "נִכְנָס",
        "fsg": "נִכְנֶסֶת",
        "mpl": "נִכְנָסִים",
        "fpl": "נִכְנָסוֹת"
      },
      "past": {
        "msg": "נִכְנַס",
        "fsg": "נִכְנְסָה",
        "mpl": "נִכְנְסוּ",
        "fpl": "נִכְנְסוּ"
      },
      "future": {
        "msg": "יִכָּנֵס",
        "fsg": "תִּכָּנֵס",
        "mpl": "יִכָּנְסוּ",
        "fpl": "יִכָּנְסוּ"
      }
    },
    "fixed_object_niqqud": "לָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-lehikanes"
    ]
  },
  {
    "id": "lo_yatza_rosh",
    "infinitive": "לא לצאת למישהו מהראש",
    "english": "to not leave someone's head",
    "verb": "לצאת",
    "root": "י.צ.א",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "מהראש",
    "template": "לא ⟨VERB⟩ ⟨L_OBJ⟩ מהראש",
    "example": "אתה לא יוצא לי מהראש",
    "negated": true,
    "literal_sg": "{s} doesn't leave {p} head",
    "literal_pl": "{s} don't leave {p} head",
    "literal_past": "{s} didn't leave {p} head",
    "literal_future": "{s} won't leave {p} head",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "יוצא",
        "fsg": "יוצאת",
        "mpl": "יוצאים",
        "fpl": "יוצאות"
      },
      "past": {
        "msg": "יצא",
        "fsg": "יצאה",
        "mpl": "יצאו",
        "fpl": "יצאו"
      },
      "future": {
        "msg": "ייצא",
        "fsg": "תצא",
        "mpl": "ייצאו",
        "fpl": "ייצאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "יוֹצֵא",
        "fsg": "יוֹצֵאת",
        "mpl": "יוֹצְאִים",
        "fpl": "יוֹצְאוֹת"
      },
      "past": {
        "msg": "יָצָא",
        "fsg": "יָצְאָה",
        "mpl": "יָצְאוּ",
        "fpl": "יָצְאוּ"
      },
      "future": {
        "msg": "יֵצֵא",
        "fsg": "תֵּצֵא",
        "mpl": "יֵצְאוּ",
        "fpl": "יֵצְאוּ"
      }
    },
    "fixed_object_niqqud": "מֵהָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-latzet"
    ]
  },
  {
    "id": "ntina_barosh",
    "infinitive": "לתת למישהו בראש",
    "english": "to tear into / yell at someone",
    "verb": "לתת",
    "root": "נ.ת.נ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "בראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ בראש",
    "example": "אתה נותן לי בראש",
    "negated": false,
    "literal_sg": "{s} gives {o} in the head",
    "literal_pl": "{s} give {o} in the head",
    "literal_past": "{s} gave {o} in the head",
    "literal_future": "{s} will give {o} in the head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "נותן",
        "fsg": "נותנת",
        "mpl": "נותנים",
        "fpl": "נותנות"
      },
      "past": {
        "msg": "נתן",
        "fsg": "נתנה",
        "mpl": "נתנו",
        "fpl": "נתנו"
      },
      "future": {
        "msg": "ייתן",
        "fsg": "תיתן",
        "mpl": "ייתנו",
        "fpl": "ייתנו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "נוֹתֵן",
        "fsg": "נוֹתֶנֶת",
        "mpl": "נוֹתְנִים",
        "fpl": "נוֹתְנוֹת"
      },
      "past": {
        "msg": "נָתַן",
        "fsg": "נָתְנָה",
        "mpl": "נָתְנוּ",
        "fpl": "נָתְנוּ"
      },
      "future": {
        "msg": "יִתֵּן",
        "fsg": "תִּתֵּן",
        "mpl": "יִתְּנוּ",
        "fpl": "יִתְּנוּ"
      }
    },
    "fixed_object_niqqud": "בָּרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-latet"
    ]
  },
  {
    "id": "akhila_rosh",
    "infinitive": "לאכול למישהו את הראש",
    "english": "to nag / drive someone crazy with talk",
    "verb": "לאכול",
    "root": "א.כ.ל",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את הראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הראש",
    "example": "אתה אוכל לי את הראש",
    "negated": false,
    "literal_sg": "{s} eats {p} head",
    "literal_pl": "{s} eat {p} head",
    "literal_past": "{s} ate {p} head",
    "literal_future": "{s} will eat {p} head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "אוכל",
        "fsg": "אוכלת",
        "mpl": "אוכלים",
        "fpl": "אוכלות"
      },
      "past": {
        "msg": "אכל",
        "fsg": "אכלה",
        "mpl": "אכלו",
        "fpl": "אכלו"
      },
      "future": {
        "msg": "יאכל",
        "fsg": "תאכל",
        "mpl": "יאכלו",
        "fpl": "יאכלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "אוֹכֵל",
        "fsg": "אוֹכֶלֶת",
        "mpl": "אוֹכְלִים",
        "fpl": "אוֹכְלוֹת"
      },
      "past": {
        "msg": "אָכַל",
        "fsg": "אָכְלָה",
        "mpl": "אָכְלוּ",
        "fpl": "אָכְלוּ"
      },
      "future": {
        "msg": "יֹאכַל",
        "fsg": "תֹּאכַל",
        "mpl": "יֹאכְלוּ",
        "fpl": "יֹאכְלוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-leechol"
    ]
  },
  {
    "id": "gnivat_lev",
    "infinitive": "לגנוב למישהו את הלב",
    "english": "to steal someone's heart",
    "verb": "לגנוב",
    "root": "ג.נ.ב",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את הלב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הלב",
    "example": "אתה גונב לי את הלב",
    "negated": false,
    "literal_sg": "{s} steals {p} heart",
    "literal_pl": "{s} steal {p} heart",
    "literal_past": "{s} stole {p} heart",
    "literal_future": "{s} will steal {p} heart",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "גונב",
        "fsg": "גונבת",
        "mpl": "גונבים",
        "fpl": "גונבות"
      },
      "past": {
        "msg": "גנב",
        "fsg": "גנבה",
        "mpl": "גנבו",
        "fpl": "גנבו"
      },
      "future": {
        "msg": "יגנוב",
        "fsg": "תגנוב",
        "mpl": "יגנבו",
        "fpl": "יגנבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "גּוֹנֵב",
        "fsg": "גּוֹנֶבֶת",
        "mpl": "גּוֹנְבִים",
        "fpl": "גּוֹנְבוֹת"
      },
      "past": {
        "msg": "גָּנַב",
        "fsg": "גָּנְבָה",
        "mpl": "גָּנְבוּ",
        "fpl": "גָּנְבוּ"
      },
      "future": {
        "msg": "יִגְנֹב",
        "fsg": "תִּגְנֹב",
        "mpl": "יִגְנְבוּ",
        "fpl": "יִגְנְבוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַלֵּב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lignov"
    ]
  },
  {
    "id": "hotzaat_midato",
    "infinitive": "להוציא מישהו מדעתו",
    "english": "to drive someone out of their mind",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "דעת",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "אתה מוציא אותי מדעתי",
    "negated": false,
    "literal_sg": "{s} takes {o} out of {p} mind",
    "literal_pl": "{s} take {o} out of {p} mind",
    "literal_past": "{s} took {o} out of {p} mind",
    "literal_future": "{s} will take {o} out of {p} mind",
    "showMeaning": false,
    "suffix_forms": {
      "1sg": "מדעתי",
      "2msg": "מדעתך",
      "2fsg": "מדעתך",
      "3msg": "מדעתו",
      "3fsg": "מדעתה",
      "1pl": "מדעתנו",
      "2mpl": "מדעתכם",
      "2fpl": "מדעתכן",
      "3mpl": "מדעתם",
      "3fpl": "מדעתן"
    },
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מִדַּעְתִּי",
      "2msg": "מִדַּעְתְּךָ",
      "2fsg": "מִדַּעְתֵּךְ",
      "3msg": "מִדַּעְתּוֹ",
      "3fsg": "מִדַּעְתָּהּ",
      "1pl": "מִדַּעְתֵּנוּ",
      "2mpl": "מִדַּעְתְּכֶם",
      "2fpl": "מִדַּעְתְּכֶן",
      "3mpl": "מִדַּעְתָּם",
      "3fpl": "מִדַּעְתָּן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "hotzaat_miklav",
    "infinitive": "להוציא מישהו מכליו",
    "english": "to make someone totally lose it",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "כלים",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "אתה מוציא אותי מכליי",
    "negated": false,
    "literal_sg": "{s} takes {o} out of {p} vessels",
    "literal_pl": "{s} take {o} out of {p} vessels",
    "literal_past": "{s} took {o} out of {p} vessels",
    "literal_future": "{s} will take {o} out of {p} vessels",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "מכליי",
      "2msg": "מכליך",
      "2fsg": "מכליך",
      "3msg": "מכליו",
      "3fsg": "מכליה",
      "1pl": "מכלינו",
      "2mpl": "מכליכם",
      "2fpl": "מכליכן",
      "3mpl": "מכליהם",
      "3fpl": "מכליהן"
    },
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מִכֵּלַי",
      "2msg": "מִכֵּלֶיךָ",
      "2fsg": "מִכֵּלַיִךְ",
      "3msg": "מִכֵּלָיו",
      "3fsg": "מִכֵּלֶיהָ",
      "1pl": "מִכֵּלֵינוּ",
      "2mpl": "מִכְּלֵיכֶם",
      "2fpl": "מִכְּלֵיכֶן",
      "3mpl": "מִכְּלֵיהֶם",
      "3fpl": "מִכְּלֵיהֶן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "bilbul_moach",
    "infinitive": "לבלבל למישהו את המוח",
    "english": "to mess with someone's head / talk nonsense at someone",
    "verb": "לבלבל",
    "root": "ב.ל.ב.ל",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "את המוח",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את המוח",
    "example": "אתה מבלבל לי את המוח",
    "negated": false,
    "literal_sg": "{s} confuses {p} brain",
    "literal_pl": "{s} confuse {p} brain",
    "literal_past": "{s} confused {p} brain",
    "literal_future": "{s} will confuse {p} brain",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מבלבל",
        "fsg": "מבלבלת",
        "mpl": "מבלבלים",
        "fpl": "מבלבלות"
      },
      "past": {
        "msg": "בלבל",
        "fsg": "בלבלה",
        "mpl": "בלבלו",
        "fpl": "בלבלו"
      },
      "future": {
        "msg": "יבלבל",
        "fsg": "תבלבל",
        "mpl": "יבלבלו",
        "fpl": "יבלבלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְבַלְבֵּל",
        "fsg": "מְבַלְבֶּלֶת",
        "mpl": "מְבַלְבְּלִים",
        "fpl": "מְבַלְבְּלוֹת"
      },
      "past": {
        "msg": "בִּלְבֵּל",
        "fsg": "בִּלְבְּלָה",
        "mpl": "בִּלְבְּלוּ",
        "fpl": "בִּלְבְּלוּ"
      },
      "future": {
        "msg": "יְבַלְבֵּל",
        "fsg": "תְּבַלְבֵּל",
        "mpl": "יְבַלְבְּלוּ",
        "fpl": "יְבַלְבְּלוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַמֹּחַ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-levalbel"
    ]
  },
  {
    "id": "shtifat_moach",
    "infinitive": "לשטוף למישהו את המוח",
    "english": "to brainwash someone",
    "verb": "לשטוף",
    "root": "ש.ט.פ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את המוח",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את המוח",
    "example": "הפרסומות שוטפות לנו את המוח",
    "negated": false,
    "literal_sg": "{s} washes {p} brain",
    "literal_pl": "{s} wash {p} brain",
    "literal_past": "{s} washed {p} brain",
    "literal_future": "{s} will wash {p} brain",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "שוטף",
        "fsg": "שוטפת",
        "mpl": "שוטפים",
        "fpl": "שוטפות"
      },
      "past": {
        "msg": "שטף",
        "fsg": "שטפה",
        "mpl": "שטפו",
        "fpl": "שטפו"
      },
      "future": {
        "msg": "ישטוף",
        "fsg": "תשטוף",
        "mpl": "ישטפו",
        "fpl": "ישטפו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "שׁוֹטֵף",
        "fsg": "שׁוֹטֶפֶת",
        "mpl": "שׁוֹטְפִים",
        "fpl": "שׁוֹטְפוֹת"
      },
      "past": {
        "msg": "שָׁטַף",
        "fsg": "שָׁטְפָה",
        "mpl": "שָׁטְפוּ",
        "fpl": "שָׁטְפוּ"
      },
      "future": {
        "msg": "יִשְׁטֹף",
        "fsg": "תִּשְׁטֹף",
        "mpl": "יִשְׁטְפוּ",
        "fpl": "יִשְׁטְפוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַמֹּחַ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lishtof"
    ]
  },
  {
    "id": "hotzaat_neshama",
    "infinitive": "להוציא למישהו את הנשמה",
    "english": "to wear someone down / drain someone completely",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את הנשמה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הנשמה",
    "example": "אתה מוציא לי את הנשמה",
    "negated": false,
    "literal_sg": "{s} takes out {p} soul",
    "literal_pl": "{s} take out {p} soul",
    "literal_past": "{s} took out {p} soul",
    "literal_future": "{s} will take out {p} soul",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַנְּשָׁמָה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "aliyat_atzabim",
    "infinitive": "לעלות למישהו על העצבים",
    "english": "to get on someone's nerves",
    "verb": "לעלות",
    "root": "ע.ל.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "על העצבים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ על העצבים",
    "example": "אתה עולה לי על העצבים",
    "negated": false,
    "literal_sg": "{s} climbs on {p} nerves",
    "literal_pl": "{s} climb on {p} nerves",
    "literal_past": "{s} climbed on {p} nerves",
    "literal_future": "{s} will climb on {p} nerves",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "עולה",
        "fsg": "עולה",
        "mpl": "עולים",
        "fpl": "עולות"
      },
      "past": {
        "msg": "עלה",
        "fsg": "עלתה",
        "mpl": "עלו",
        "fpl": "עלו"
      },
      "future": {
        "msg": "יעלה",
        "fsg": "תעלה",
        "mpl": "יעלו",
        "fpl": "יעלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹלֶה",
        "fsg": "עוֹלָה",
        "mpl": "עוֹלִים",
        "fpl": "עוֹלוֹת"
      },
      "past": {
        "msg": "עָלָה",
        "fsg": "עָלְתָה",
        "mpl": "עָלוּ",
        "fpl": "עָלוּ"
      },
      "future": {
        "msg": "יַעֲלֶה",
        "fsg": "תַּעֲלֶה",
        "mpl": "יַעֲלוּ",
        "fpl": "יַעֲלוּ"
      }
    },
    "fixed_object_niqqud": "עַל הָעֲצַבִּים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laalot"
    ]
  },
  {
    "id": "sivuv_rosh",
    "infinitive": "לסובב למישהו את הראש",
    "english": "to turn someone's head / sweet-talk someone",
    "verb": "לסובב",
    "root": "ס.ב.ב",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "את הראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הראש",
    "example": "היא מסובבת לו את הראש",
    "negated": false,
    "literal_sg": "{s} spins {p} head",
    "literal_pl": "{s} spin {p} head",
    "literal_past": "{s} spun {p} head",
    "literal_future": "{s} will spin {p} head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מסובב",
        "fsg": "מסובבת",
        "mpl": "מסובבים",
        "fpl": "מסובבות"
      },
      "past": {
        "msg": "סובב",
        "fsg": "סובבה",
        "mpl": "סובבו",
        "fpl": "סובבו"
      },
      "future": {
        "msg": "יסובב",
        "fsg": "תסובב",
        "mpl": "יסובבו",
        "fpl": "יסובבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְסוֹבֵב",
        "fsg": "מְסוֹבֶבֶת",
        "mpl": "מְסוֹבְבִים",
        "fpl": "מְסוֹבְבוֹת"
      },
      "past": {
        "msg": "סוֹבֵב",
        "fsg": "סוֹבְבָה",
        "mpl": "סוֹבְבוּ",
        "fpl": "סוֹבְבוּ"
      },
      "future": {
        "msg": "יְסוֹבֵב",
        "fsg": "תְּסוֹבֵב",
        "mpl": "יְסוֹבְבוּ",
        "fpl": "יְסוֹבְבוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lesovev"
    ]
  },
  {
    "id": "simat_regel",
    "infinitive": "לשים למישהו רגל",
    "english": "to trip someone up / sabotage someone",
    "verb": "לשים",
    "root": "ש.י.מ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "רגל",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ רגל",
    "example": "הוא שם לי רגל",
    "negated": false,
    "literal_sg": "{s} puts a leg out for {o}",
    "literal_pl": "{s} put a leg out for {o}",
    "literal_past": "{s} put (past) a leg out for {o}",
    "literal_future": "{s} will put a leg out for {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "שם",
        "fsg": "שמה",
        "mpl": "שמים",
        "fpl": "שמות"
      },
      "past": {
        "msg": "שם",
        "fsg": "שמה",
        "mpl": "שמו",
        "fpl": "שמו"
      },
      "future": {
        "msg": "ישים",
        "fsg": "תשים",
        "mpl": "ישימו",
        "fpl": "ישימו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "שָׂם",
        "fsg": "שָׂמָה",
        "mpl": "שָׂמִים",
        "fpl": "שָׂמוֹת"
      },
      "past": {
        "msg": "שָׂם",
        "fsg": "שָׂמָה",
        "mpl": "שָׂמוּ",
        "fpl": "שָׂמוּ"
      },
      "future": {
        "msg": "יָשִׂים",
        "fsg": "תָּשִׂים",
        "mpl": "יָשִׂימוּ",
        "fpl": "יָשִׂימוּ"
      }
    },
    "fixed_object_niqqud": "רֶגֶל",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lasim"
    ]
  },
  {
    "id": "chimum_lev",
    "infinitive": "לחמם למישהו את הלב",
    "english": "to warm someone's heart",
    "verb": "לחמם",
    "root": "ח.מ.מ",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "את הלב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הלב",
    "example": "אתה מחמם לי את הלב",
    "negated": false,
    "literal_sg": "{s} warms {p} heart",
    "literal_pl": "{s} warm {p} heart",
    "literal_past": "{s} warmed {p} heart",
    "literal_future": "{s} will warm {p} heart",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "מחמם",
        "fsg": "מחממת",
        "mpl": "מחממים",
        "fpl": "מחממות"
      },
      "past": {
        "msg": "חימם",
        "fsg": "חיממה",
        "mpl": "חיממו",
        "fpl": "חיממו"
      },
      "future": {
        "msg": "יחמם",
        "fsg": "תחמם",
        "mpl": "יחממו",
        "fpl": "יחממו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְחַמֵּם",
        "fsg": "מְחַמֶּמֶת",
        "mpl": "מְחַמְּמִים",
        "fpl": "מְחַמְּמוֹת"
      },
      "past": {
        "msg": "חִמֵּם",
        "fsg": "חִמְּמָה",
        "mpl": "חִמְּמוּ",
        "fpl": "חִמְּמוּ"
      },
      "future": {
        "msg": "יְחַמֵּם",
        "fsg": "תְּחַמֵּם",
        "mpl": "יְחַמְּמוּ",
        "fpl": "יְחַמְּמוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַלֵּב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lechamem"
    ]
  },
  {
    "id": "merihat_atzabim",
    "infinitive": "למרוט למישהו את העצבים",
    "english": "to fray someone's nerves / wear someone's patience thin",
    "verb": "למרוט",
    "root": "מ.ר.ט",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את העצבים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את העצבים",
    "example": "אתה מורט לי את העצבים",
    "negated": false,
    "literal_sg": "{s} plucks {p} nerves",
    "literal_pl": "{s} pluck {p} nerves",
    "literal_past": "{s} plucked {p} nerves",
    "literal_future": "{s} will pluck {p} nerves",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מורט",
        "fsg": "מורטת",
        "mpl": "מורטים",
        "fpl": "מורטות"
      },
      "past": {
        "msg": "מרט",
        "fsg": "מרטה",
        "mpl": "מרטו",
        "fpl": "מרטו"
      },
      "future": {
        "msg": "ימרוט",
        "fsg": "תמרוט",
        "mpl": "ימרטו",
        "fpl": "ימרטו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹרֵט",
        "fsg": "מוֹרֶטֶת",
        "mpl": "מוֹרְטִים",
        "fpl": "מוֹרְטוֹת"
      },
      "past": {
        "msg": "מָרַט",
        "fsg": "מָרְטָה",
        "mpl": "מָרְטוּ",
        "fpl": "מָרְטוּ"
      },
      "future": {
        "msg": "יִמְרֹט",
        "fsg": "תִּמְרֹט",
        "mpl": "יִמְרְטוּ",
        "fpl": "יִמְרְטוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָעֲצַבִּים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-limrot"
    ]
  },
  {
    "id": "ruach_mifrasim",
    "infinitive": "להוציא למישהו את הרוח מהמפרשים",
    "english": "to take the wind out of someone's sails",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את הרוח מהמפרשים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הרוח מהמפרשים",
    "example": "התשובה שלה הוציאה לו את הרוח מהמפרשים",
    "negated": false,
    "literal_sg": "{s} takes the wind out of {p} sails",
    "literal_pl": "{s} take the wind out of {p} sails",
    "literal_past": "{s} took the wind out of {p} sails",
    "literal_future": "{s} will take the wind out of {p} sails",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָרוּחַ מֵהַמִּפְרָשִׂים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "sider",
    "infinitive": "לסדר מישהו",
    "english": "to screw someone over",
    "verb": "לסדר",
    "root": "ס.ד.ר",
    "binyan": "piel",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הקבלן סידר אותנו",
    "negated": false,
    "literal_sg": "{s} arranges {o}",
    "literal_pl": "{s} arrange {o}",
    "literal_past": "{s} arranged {o}",
    "literal_future": "{s} will arrange {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מסדר",
        "fsg": "מסדרת",
        "mpl": "מסדרים",
        "fpl": "מסדרות"
      },
      "past": {
        "msg": "סידר",
        "fsg": "סידרה",
        "mpl": "סידרו",
        "fpl": "סידרו"
      },
      "future": {
        "msg": "יסדר",
        "fsg": "תסדר",
        "mpl": "יסדרו",
        "fpl": "יסדרו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְסַדֵּר",
        "fsg": "מְסַדֶּרֶת",
        "mpl": "מְסַדְּרִים",
        "fpl": "מְסַדְּרוֹת"
      },
      "past": {
        "msg": "סִדֵּר",
        "fsg": "סִדְּרָה",
        "mpl": "סִדְּרוּ",
        "fpl": "סִדְּרוּ"
      },
      "future": {
        "msg": "יְסַדֵּר",
        "fsg": "תְּסַדֵּר",
        "mpl": "יְסַדְּרוּ",
        "fpl": "יְסַדְּרוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "https://www.pealim.com/dict/1320-lesader/"
    ]
  },
  {
    "id": "marach",
    "infinitive": "למרוח מישהו",
    "english": "to string someone along",
    "verb": "למרוח",
    "root": "מ.ר.ח",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הוא מרח אותי שבועיים",
    "negated": false,
    "literal_sg": "{s} smears {o}",
    "literal_pl": "{s} smear {o}",
    "literal_past": "{s} smeared {o}",
    "literal_future": "{s} will smear {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מורח",
        "fsg": "מורחת",
        "mpl": "מורחים",
        "fpl": "מורחות"
      },
      "past": {
        "msg": "מרח",
        "fsg": "מרחה",
        "mpl": "מרחו",
        "fpl": "מרחו"
      },
      "future": {
        "msg": "ימרח",
        "fsg": "תמרח",
        "mpl": "ימרחו",
        "fpl": "ימרחו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹרֵחַ",
        "fsg": "מוֹרַחַת",
        "mpl": "מוֹרְחִים",
        "fpl": "מוֹרְחוֹת"
      },
      "past": {
        "msg": "מָרַח",
        "fsg": "מָרְחָה",
        "mpl": "מָרְחוּ",
        "fpl": "מָרְחוּ"
      },
      "future": {
        "msg": "יִמְרַח",
        "fsg": "תִּמְרַח",
        "mpl": "יִמְרְחוּ",
        "fpl": "יִמְרְחוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-limroach"
    ]
  },
  {
    "id": "asiyat_yom",
    "infinitive": "לעשות למישהו את היום",
    "english": "to make someone's day",
    "verb": "לעשות",
    "root": "ע.ש.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את היום",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את היום",
    "example": "המחמאה שלך עשתה לי את היום",
    "negated": false,
    "literal_sg": "{s} makes {p} day",
    "literal_pl": "{s} make {p} day",
    "literal_past": "{s} made {p} day",
    "literal_future": "{s} will make {p} day",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַיּוֹם",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "https://www.pealim.com/dict/3-laasot/",
      "https://www.pealim.com/dict/5998-hayom/"
    ]
  },
  {
    "id": "haramat_moral",
    "infinitive": "להרים למישהו את המורל",
    "english": "to lift someone's spirits",
    "verb": "להרים",
    "root": "ר.ו.ם",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את המורל",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את המורל",
    "example": "השיר הזה מרים לי את המורל",
    "negated": false,
    "literal_sg": "{s} lifts {p} morale",
    "literal_pl": "{s} lift {p} morale",
    "literal_past": "{s} lifted {p} morale",
    "literal_future": "{s} will lift {p} morale",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מרים",
        "fsg": "מרימה",
        "mpl": "מרימים",
        "fpl": "מרימות"
      },
      "past": {
        "msg": "הרים",
        "fsg": "הרימה",
        "mpl": "הרימו",
        "fpl": "הרימו"
      },
      "future": {
        "msg": "ירים",
        "fsg": "תרים",
        "mpl": "ירימו",
        "fpl": "ירימו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מֵרִים",
        "fsg": "מְרִימָה",
        "mpl": "מְרִימִים",
        "fpl": "מְרִימוֹת"
      },
      "past": {
        "msg": "הֵרִים",
        "fsg": "הֵרִימָה",
        "mpl": "הֵרִימוּ",
        "fpl": "הֵרִימוּ"
      },
      "future": {
        "msg": "יָרִים",
        "fsg": "תָּרִים",
        "mpl": "יָרִימוּ",
        "fpl": "יָרִימוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַמּוֹרָל",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-leharim"
    ]
  },
  {
    "id": "harisat_matzav_ruach",
    "infinitive": "להרוס למישהו את מצב הרוח",
    "english": "to ruin someone's mood",
    "verb": "להרוס",
    "root": "ה.ר.ס",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את מצב הרוח",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את מצב הרוח",
    "example": "החדשות הרסו לי את מצב הרוח",
    "negated": false,
    "literal_sg": "{s} ruins {p} mood",
    "literal_pl": "{s} ruin {p} mood",
    "literal_past": "{s} ruined {p} mood",
    "literal_future": "{s} will ruin {p} mood",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "הורס",
        "fsg": "הורסת",
        "mpl": "הורסים",
        "fpl": "הורסות"
      },
      "past": {
        "msg": "הרס",
        "fsg": "הרסה",
        "mpl": "הרסו",
        "fpl": "הרסו"
      },
      "future": {
        "msg": "יהרוס",
        "fsg": "תהרוס",
        "mpl": "יהרסו",
        "fpl": "יהרסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "הוֹרֵס",
        "fsg": "הוֹרֶסֶת",
        "mpl": "הוֹרְסִים",
        "fpl": "הוֹרְסוֹת"
      },
      "past": {
        "msg": "הָרַס",
        "fsg": "הָרְסָה",
        "mpl": "הָרְסוּ",
        "fpl": "הָרְסוּ"
      },
      "future": {
        "msg": "יַהֲרוֹס",
        "fsg": "תַּהֲרוֹס",
        "mpl": "יַהַרְסוּ",
        "fpl": "יַהַרְסוּ"
      }
    },
    "fixed_object_niqqud": "אֶת מַצַּב הָרוּחַ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-laharos"
    ]
  },
  {
    "id": "gnivat_hatzaga",
    "infinitive": "לגנוב למישהו את ההצגה",
    "english": "to steal someone's thunder",
    "verb": "לגנוב",
    "root": "ג.נ.ב",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את ההצגה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את ההצגה",
    "example": "הוא גנב לי את ההצגה בישיבה",
    "negated": false,
    "literal_sg": "{s} steals {p} show",
    "literal_pl": "{s} steal {p} show",
    "literal_past": "{s} stole {p} show",
    "literal_future": "{s} will steal {p} show",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "גונב",
        "fsg": "גונבת",
        "mpl": "גונבים",
        "fpl": "גונבות"
      },
      "past": {
        "msg": "גנב",
        "fsg": "גנבה",
        "mpl": "גנבו",
        "fpl": "גנבו"
      },
      "future": {
        "msg": "יגנוב",
        "fsg": "תגנוב",
        "mpl": "יגנבו",
        "fpl": "יגנבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "גּוֹנֵב",
        "fsg": "גּוֹנֶבֶת",
        "mpl": "גּוֹנְבִים",
        "fpl": "גּוֹנְבוֹת"
      },
      "past": {
        "msg": "גָּנַב",
        "fsg": "גָּנְבָה",
        "mpl": "גָּנְבוּ",
        "fpl": "גָּנְבוּ"
      },
      "future": {
        "msg": "יִגְנֹב",
        "fsg": "תִּגְנֹב",
        "mpl": "יִגְנְבוּ",
        "fpl": "יִגְנְבוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַהַצָּגָה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lignov"
    ]
  },
  {
    "id": "drichat_yabalot",
    "infinitive": "לדרוך למישהו על היבלות",
    "english": "to touch a sore spot / hit a nerve",
    "verb": "לדרוך",
    "root": "ד.ר.כ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "על היבלות",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ על היבלות",
    "example": "השאלה הזאת דרכה לי על היבלות",
    "negated": false,
    "literal_sg": "{s} steps on {p} blisters",
    "literal_pl": "{s} step on {p} blisters",
    "literal_past": "{s} stepped on {p} blisters",
    "literal_future": "{s} will step on {p} blisters",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "דורך",
        "fsg": "דורכת",
        "mpl": "דורכים",
        "fpl": "דורכות"
      },
      "past": {
        "msg": "דרך",
        "fsg": "דרכה",
        "mpl": "דרכו",
        "fpl": "דרכו"
      },
      "future": {
        "msg": "ידרוך",
        "fsg": "תדרוך",
        "mpl": "ידרכו",
        "fpl": "ידרכו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "דּוֹרֵךְ",
        "fsg": "דּוֹרֶכֶת",
        "mpl": "דּוֹרְכִים",
        "fpl": "דּוֹרְכוֹת"
      },
      "past": {
        "msg": "דָּרַךְ",
        "fsg": "דָּרְכָה",
        "mpl": "דָּרְכוּ",
        "fpl": "דָּרְכוּ"
      },
      "future": {
        "msg": "יִדְרֹךְ",
        "fsg": "תִּדְרֹךְ",
        "mpl": "יִדְרְכוּ",
        "fpl": "יִדְרְכוּ"
      }
    },
    "fixed_object_niqqud": "עַל הַיַּבָּלוֹת",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lidroch"
    ]
  },
  {
    "id": "tsvitat_lev",
    "infinitive": "לצבוט למישהו בלב",
    "english": "to tug at someone's heartstrings",
    "verb": "לצבוט",
    "root": "צ.ב.ט",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "בלב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ בלב",
    "example": "הסרט הזה צבט לי בלב",
    "negated": false,
    "literal_sg": "{s} pinches {p} heart",
    "literal_pl": "{s} pinch {p} heart",
    "literal_past": "{s} pinched {p} heart",
    "literal_future": "{s} will pinch {p} heart",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "צובט",
        "fsg": "צובטת",
        "mpl": "צובטים",
        "fpl": "צובטות"
      },
      "past": {
        "msg": "צבט",
        "fsg": "צבטה",
        "mpl": "צבטו",
        "fpl": "צבטו"
      },
      "future": {
        "msg": "יצבוט",
        "fsg": "תצבוט",
        "mpl": "יצבטו",
        "fpl": "יצבטו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "צוֹבֵט",
        "fsg": "צוֹבֶטֶת",
        "mpl": "צוֹבְטִים",
        "fpl": "צוֹבְטוֹת"
      },
      "past": {
        "msg": "צָבַט",
        "fsg": "צָבְטָה",
        "mpl": "צָבְטוּ",
        "fpl": "צָבְטוּ"
      },
      "future": {
        "msg": "יִצְבֹּט",
        "fsg": "תִּצְבֹּט",
        "mpl": "יִצְבְּטוּ",
        "fpl": "יִצְבְּטוּ"
      }
    },
    "fixed_object_niqqud": "בַּלֵּב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-litzbot"
    ]
  },
  {
    "id": "zarak",
    "infinitive": "לזרוק מישהו",
    "english": "to dump someone",
    "verb": "לזרוק",
    "root": "ז.ר.ק",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "היא זרקה אותו אחרי שנה",
    "negated": false,
    "literal_sg": "{s} throws {o}",
    "literal_pl": "{s} throw {o}",
    "literal_past": "{s} threw {o}",
    "literal_future": "{s} will throw {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "זורק",
        "fsg": "זורקת",
        "mpl": "זורקים",
        "fpl": "זורקות"
      },
      "past": {
        "msg": "זרק",
        "fsg": "זרקה",
        "mpl": "זרקו",
        "fpl": "זרקו"
      },
      "future": {
        "msg": "יזרוק",
        "fsg": "תזרוק",
        "mpl": "יזרקו",
        "fpl": "יזרקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "זוֹרֵק",
        "fsg": "זוֹרֶקֶת",
        "mpl": "זוֹרְקִים",
        "fpl": "זוֹרְקוֹת"
      },
      "past": {
        "msg": "זָרַק",
        "fsg": "זָרְקָה",
        "mpl": "זָרְקוּ",
        "fpl": "זָרְקוּ"
      },
      "future": {
        "msg": "יִזְרֹק",
        "fsg": "תִּזְרֹק",
        "mpl": "יִזְרְקוּ",
        "fpl": "יִזְרְקוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lizrok"
    ]
  },
  {
    "id": "tafas_oti",
    "infinitive": "לתפוס מישהו",
    "english": "to catch someone out",
    "verb": "לתפוס",
    "root": "ת.פ.ס",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "תפסת אותי",
    "negated": false,
    "literal_sg": "{s} catches {o}",
    "literal_pl": "{s} catch {o}",
    "literal_past": "{s} caught {o}",
    "literal_future": "{s} will catch {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "תופס",
        "fsg": "תופסת",
        "mpl": "תופסים",
        "fpl": "תופסות"
      },
      "past": {
        "msg": "תפס",
        "fsg": "תפסה",
        "mpl": "תפסו",
        "fpl": "תפסו"
      },
      "future": {
        "msg": "יתפוס",
        "fsg": "תתפוס",
        "mpl": "יתפסו",
        "fpl": "יתפסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "תּוֹפֵס",
        "fsg": "תּוֹפֶסֶת",
        "mpl": "תּוֹפְסִים",
        "fpl": "תּוֹפְסוֹת"
      },
      "past": {
        "msg": "תָּפַס",
        "fsg": "תָּפְסָה",
        "mpl": "תָּפְסוּ",
        "fpl": "תָּפְסוּ"
      },
      "future": {
        "msg": "יִתְפֹּס",
        "fsg": "תִּתְפֹּס",
        "mpl": "יִתְפְּסוּ",
        "fpl": "יִתְפְּסוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-litfos"
    ]
  },
  {
    "id": "dafak",
    "infinitive": "לדפוק מישהו",
    "english": "to screw someone over",
    "verb": "לדפוק",
    "root": "ד.פ.ק",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הם דפקו אותנו בחוזה",
    "negated": false,
    "literal_sg": "{s} knocks {o}",
    "literal_pl": "{s} knock {o}",
    "literal_past": "{s} knocked {o}",
    "literal_future": "{s} will knock {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "דופק",
        "fsg": "דופקת",
        "mpl": "דופקים",
        "fpl": "דופקות"
      },
      "past": {
        "msg": "דפק",
        "fsg": "דפקה",
        "mpl": "דפקו",
        "fpl": "דפקו"
      },
      "future": {
        "msg": "ידפוק",
        "fsg": "תדפוק",
        "mpl": "ידפקו",
        "fpl": "ידפקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "דּוֹפֵק",
        "fsg": "דּוֹפֶקֶת",
        "mpl": "דּוֹפְקִים",
        "fpl": "דּוֹפְקוֹת"
      },
      "past": {
        "msg": "דָּפַק",
        "fsg": "דָּפְקָה",
        "mpl": "דָּפְקוּ",
        "fpl": "דָּפְקוּ"
      },
      "future": {
        "msg": "יִדְפֹּק",
        "fsg": "תִּדְפֹּק",
        "mpl": "יִדְפְּקוּ",
        "fpl": "יִדְפְּקוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lidfok"
    ]
  },
  {
    "id": "heif",
    "infinitive": "להעיף מישהו",
    "english": "to boot someone out",
    "verb": "להעיף",
    "root": "ע.ו.פ",
    "binyan": "hifil",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "העיפו אותו מהעבודה",
    "negated": false,
    "literal_sg": "{s} flies {o} out",
    "literal_pl": "{s} fly {o} out",
    "literal_past": "{s} flew {o} out",
    "literal_future": "{s} will fly {o} out",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מעיף",
        "fsg": "מעיפה",
        "mpl": "מעיפים",
        "fpl": "מעיפות"
      },
      "past": {
        "msg": "העיף",
        "fsg": "העיפה",
        "mpl": "העיפו",
        "fpl": "העיפו"
      },
      "future": {
        "msg": "יעיף",
        "fsg": "תעיף",
        "mpl": "יעיפו",
        "fpl": "יעיפו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מֵעִיף",
        "fsg": "מְעִיפָה",
        "mpl": "מְעִיפִים",
        "fpl": "מְעִיפוֹת"
      },
      "past": {
        "msg": "הֵעִיף",
        "fsg": "הֵעִיפָה",
        "mpl": "הֵעִיפוּ",
        "fpl": "הֵעִיפוּ"
      },
      "future": {
        "msg": "יָעִיף",
        "fsg": "תָּעִיף",
        "mpl": "יָעִיפוּ",
        "fpl": "יָעִיפוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaif"
    ]
  },
  {
    "id": "chisel",
    "infinitive": "לחסל מישהו",
    "english": "to finish someone off",
    "verb": "לחסל",
    "root": "ח.ס.ל",
    "binyan": "piel",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "האימון הזה חיסל אותי",
    "negated": false,
    "literal_sg": "{s} eliminates {o}",
    "literal_pl": "{s} eliminate {o}",
    "literal_past": "{s} eliminated {o}",
    "literal_future": "{s} will eliminate {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מחסל",
        "fsg": "מחסלת",
        "mpl": "מחסלים",
        "fpl": "מחסלות"
      },
      "past": {
        "msg": "חיסל",
        "fsg": "חיסלה",
        "mpl": "חיסלו",
        "fpl": "חיסלו"
      },
      "future": {
        "msg": "יחסל",
        "fsg": "תחסל",
        "mpl": "יחסלו",
        "fpl": "יחסלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְחַסֵּל",
        "fsg": "מְחַסֶּלֶת",
        "mpl": "מְחַסְּלִים",
        "fpl": "מְחַסְּלוֹת"
      },
      "past": {
        "msg": "חִסֵּל",
        "fsg": "חִסְּלָה",
        "mpl": "חִסְּלוּ",
        "fpl": "חִסְּלוּ"
      },
      "future": {
        "msg": "יְחַסֵּל",
        "fsg": "תְּחַסֵּל",
        "mpl": "יְחַסְּלוּ",
        "fpl": "יְחַסְּלוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lechasel"
    ]
  },
  {
    "id": "asiyat_tova",
    "infinitive": "לעשות למישהו טובה",
    "english": "to do someone a favor",
    "verb": "לעשות",
    "root": "ע.ש.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "טובה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ טובה",
    "example": "תעשה לי טובה",
    "negated": false,
    "literal_sg": "{s} does {o} a favor",
    "literal_pl": "{s} do {o} a favor",
    "literal_past": "{s} did {o} a favor",
    "literal_future": "{s} will do {o} a favor",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "טוֹבָה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laasot"
    ]
  },
  {
    "id": "dibur_al_halev",
    "infinitive": "לדבר למישהו על הלב",
    "english": "to talk someone round",
    "verb": "לדבר",
    "root": "ד.ב.ר",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "על הלב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ על הלב",
    "example": "היא דיברה לי על הלב",
    "negated": false,
    "literal_sg": "{s} talks on {p} heart",
    "literal_pl": "{s} talk on {p} heart",
    "literal_past": "{s} talked on {p} heart",
    "literal_future": "{s} will talk on {p} heart",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מדבר",
        "fsg": "מדברת",
        "mpl": "מדברים",
        "fpl": "מדברות"
      },
      "past": {
        "msg": "דיבר",
        "fsg": "דיברה",
        "mpl": "דיברו",
        "fpl": "דיברו"
      },
      "future": {
        "msg": "ידבר",
        "fsg": "תדבר",
        "mpl": "ידברו",
        "fpl": "ידברו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְדַבֵּר",
        "fsg": "מְדַבֶּרֶת",
        "mpl": "מְדַבְּרִים",
        "fpl": "מְדַבְּרוֹת"
      },
      "past": {
        "msg": "דִּבֵּר",
        "fsg": "דִּבְּרָה",
        "mpl": "דִּבְּרוּ",
        "fpl": "דִּבְּרוּ"
      },
      "future": {
        "msg": "יְדַבֵּר",
        "fsg": "תְּדַבֵּר",
        "mpl": "יְדַבְּרוּ",
        "fpl": "יְדַבְּרוּ"
      }
    },
    "fixed_object_niqqud": "עַל הַלֵּב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-ledaber"
    ]
  },
  {
    "id": "asiyat_seder_barosh",
    "infinitive": "לעשות למישהו סדר בראש",
    "english": "to sort someone's head out",
    "verb": "לעשות",
    "root": "ע.ש.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "סדר בראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ סדר בראש",
    "example": "השיחה עשתה לי סדר בראש",
    "negated": false,
    "literal_sg": "{s} makes order in {p} head",
    "literal_pl": "{s} make order in {p} head",
    "literal_past": "{s} made order in {p} head",
    "literal_future": "{s} will make order in {p} head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "סֵדֶר בָּרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laasot"
    ]
  },
  {
    "id": "hachzarat_chiyuch",
    "infinitive": "להחזיר למישהו את החיוך",
    "english": "to bring someone's smile back",
    "verb": "להחזיר",
    "root": "ח.ז.ר",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את החיוך",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את החיוך",
    "example": "הוא החזיר לי את החיוך",
    "negated": false,
    "literal_sg": "{s} returns {p} smile",
    "literal_pl": "{s} return {p} smile",
    "literal_past": "{s} returned {p} smile",
    "literal_future": "{s} will return {p} smile",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מחזיר",
        "fsg": "מחזירה",
        "mpl": "מחזירים",
        "fpl": "מחזירות"
      },
      "past": {
        "msg": "החזיר",
        "fsg": "החזירה",
        "mpl": "החזירו",
        "fpl": "החזירו"
      },
      "future": {
        "msg": "יחזיר",
        "fsg": "תחזיר",
        "mpl": "יחזירו",
        "fpl": "יחזירו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַחְזִיר",
        "fsg": "מַחְזִירָה",
        "mpl": "מַחְזִירִים",
        "fpl": "מַחְזִירוֹת"
      },
      "past": {
        "msg": "הֶחְזִיר",
        "fsg": "הֶחְזִירָה",
        "mpl": "הֶחְזִירוּ",
        "fpl": "הֶחְזִירוּ"
      },
      "future": {
        "msg": "יַחְזִיר",
        "fsg": "תַּחְזִיר",
        "mpl": "יַחְזִירוּ",
        "fpl": "יַחְזִירוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַחִיּוּךְ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehachzir"
    ]
  },
  {
    "id": "tfisat_ayin",
    "infinitive": "לתפוס למישהו את העין",
    "english": "to catch someone's eye",
    "verb": "לתפוס",
    "root": "ת.פ.ס",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את העין",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את העין",
    "example": "השמלה תפסה לי את העין",
    "negated": false,
    "literal_sg": "{s} catches {p} eye",
    "literal_pl": "{s} catch {p} eye",
    "literal_past": "{s} caught {p} eye",
    "literal_future": "{s} will catch {p} eye",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "תופס",
        "fsg": "תופסת",
        "mpl": "תופסים",
        "fpl": "תופסות"
      },
      "past": {
        "msg": "תפס",
        "fsg": "תפסה",
        "mpl": "תפסו",
        "fpl": "תפסו"
      },
      "future": {
        "msg": "יתפוס",
        "fsg": "תתפוס",
        "mpl": "יתפסו",
        "fpl": "יתפסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "תּוֹפֵס",
        "fsg": "תּוֹפֶסֶת",
        "mpl": "תּוֹפְסִים",
        "fpl": "תּוֹפְסוֹת"
      },
      "past": {
        "msg": "תָּפַס",
        "fsg": "תָּפְסָה",
        "mpl": "תָּפְסוּ",
        "fpl": "תָּפְסוּ"
      },
      "future": {
        "msg": "יִתְפֹּס",
        "fsg": "תִּתְפֹּס",
        "mpl": "יִתְפְּסוּ",
        "fpl": "יִתְפְּסוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָעַיִן",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-litfos"
    ]
  },
  {
    "id": "chisachon_keev",
    "infinitive": "לחסוך למישהו את הכאב",
    "english": "to spare someone the pain",
    "verb": "לחסוך",
    "root": "ח.ס.כ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את הכאב",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הכאב",
    "example": "חסכת לי את הכאב",
    "negated": false,
    "literal_sg": "{s} saves {o} the pain",
    "literal_pl": "{s} save {o} the pain",
    "literal_past": "{s} saved {o} the pain",
    "literal_future": "{s} will save {o} the pain",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "חוסך",
        "fsg": "חוסכת",
        "mpl": "חוסכים",
        "fpl": "חוסכות"
      },
      "past": {
        "msg": "חסך",
        "fsg": "חסכה",
        "mpl": "חסכו",
        "fpl": "חסכו"
      },
      "future": {
        "msg": "יחסוך",
        "fsg": "תחסוך",
        "mpl": "יחסכו",
        "fpl": "יחסכו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "חוֹסֵךְ",
        "fsg": "חוֹסֶכֶת",
        "mpl": "חוֹסְכִים",
        "fpl": "חוֹסְכוֹת"
      },
      "past": {
        "msg": "חָסַךְ",
        "fsg": "חָסְכָה",
        "mpl": "חָסְכוּ",
        "fpl": "חָסְכוּ"
      },
      "future": {
        "msg": "יַחְסֹךְ",
        "fsg": "תַּחְסֹךְ",
        "mpl": "יַחְסְכוּ",
        "fpl": "יַחְסְכוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַכְּאֵב",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lachsoch"
    ]
  },
  {
    "id": "haarat_yom",
    "infinitive": "להאיר למישהו את היום",
    "english": "to make someone's day",
    "verb": "להאיר",
    "root": "א.ו.ר",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את היום",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את היום",
    "example": "ההודעה שלך האירה לי את היום",
    "negated": false,
    "literal_sg": "{s} lights up {p} day",
    "literal_pl": "{s} light up {p} day",
    "literal_past": "{s} lit up {p} day",
    "literal_future": "{s} will light up {p} day",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מאיר",
        "fsg": "מאירה",
        "mpl": "מאירים",
        "fpl": "מאירות"
      },
      "past": {
        "msg": "האיר",
        "fsg": "האירה",
        "mpl": "האירו",
        "fpl": "האירו"
      },
      "future": {
        "msg": "יאיר",
        "fsg": "תאיר",
        "mpl": "יאירו",
        "fpl": "יאירו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מֵאִיר",
        "fsg": "מְאִירָה",
        "mpl": "מְאִירִים",
        "fpl": "מְאִירוֹת"
      },
      "past": {
        "msg": "הֵאִיר",
        "fsg": "הֵאִירָה",
        "mpl": "הֵאִירוּ",
        "fpl": "הֵאִירוּ"
      },
      "future": {
        "msg": "יָאִיר",
        "fsg": "תָּאִיר",
        "mpl": "יָאִירוּ",
        "fpl": "יָאִירוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַיּוֹם",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehair"
    ]
  },
  {
    "id": "mirur_chayim",
    "infinitive": "למרר למישהו את החיים",
    "english": "to make someone's life miserable",
    "verb": "למרר",
    "root": "מ.ר.ר",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "את החיים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את החיים",
    "example": "השכן ממרר לנו את החיים",
    "negated": false,
    "literal_sg": "{s} embitters {p} life",
    "literal_pl": "{s} embitter {p} life",
    "literal_past": "{s} embittered {p} life",
    "literal_future": "{s} will embitter {p} life",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "ממרר",
        "fsg": "ממררת",
        "mpl": "ממררים",
        "fpl": "ממררות"
      },
      "past": {
        "msg": "מירר",
        "fsg": "מיררה",
        "mpl": "מיררו",
        "fpl": "מיררו"
      },
      "future": {
        "msg": "ימרר",
        "fsg": "תמרר",
        "mpl": "ימררו",
        "fpl": "ימררו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְמָרֵר",
        "fsg": "מְמָרֶרֶת",
        "mpl": "מְמָרְרִים",
        "fpl": "מְמָרְרוֹת"
      },
      "past": {
        "msg": "מֵרֵר",
        "fsg": "מֵרְרָה",
        "mpl": "מֵרְרוּ",
        "fpl": "מֵרְרוּ"
      },
      "future": {
        "msg": "יְמָרֵר",
        "fsg": "תְּמָרֵר",
        "mpl": "יְמָרְרוּ",
        "fpl": "יְמָרְרוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַחַיִּים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lemarer"
    ]
  },
  {
    "id": "asiyat_mavet",
    "infinitive": "לעשות למישהו את המוות",
    "english": "to give someone hell",
    "verb": "לעשות",
    "root": "ע.ש.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את המוות",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את המוות",
    "example": "הם עשו לי את המוות",
    "negated": false,
    "literal_sg": "{s} makes {p} death",
    "literal_pl": "{s} make {p} death",
    "literal_past": "{s} made {p} death",
    "literal_future": "{s} will make {p} death",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַמָּוֶת",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laasot"
    ]
  },
  {
    "id": "haramat_telefon",
    "infinitive": "להרים למישהו טלפון",
    "english": "to give someone a call",
    "verb": "להרים",
    "root": "ר.ו.מ",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "טלפון",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ טלפון",
    "example": "תרים לי טלפון בערב",
    "negated": false,
    "literal_sg": "{s} lifts a phone for {o}",
    "literal_pl": "{s} lift a phone for {o}",
    "literal_past": "{s} lifted a phone for {o}",
    "literal_future": "{s} will lift a phone for {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מרים",
        "fsg": "מרימה",
        "mpl": "מרימים",
        "fpl": "מרימות"
      },
      "past": {
        "msg": "הרים",
        "fsg": "הרימה",
        "mpl": "הרימו",
        "fpl": "הרימו"
      },
      "future": {
        "msg": "ירים",
        "fsg": "תרים",
        "mpl": "ירימו",
        "fpl": "ירימו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מֵרִים",
        "fsg": "מְרִימָה",
        "mpl": "מְרִימִים",
        "fpl": "מְרִימוֹת"
      },
      "past": {
        "msg": "הֵרִים",
        "fsg": "הֵרִימָה",
        "mpl": "הֵרִימוּ",
        "fpl": "הֵרִימוּ"
      },
      "future": {
        "msg": "יָרִים",
        "fsg": "תָּרִים",
        "mpl": "יָרִימוּ",
        "fpl": "יָרִימוּ"
      }
    },
    "fixed_object_niqqud": "טֶלֶפוֹן",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-leharim"
    ]
  },
  {
    "id": "ntinat_kavod",
    "infinitive": "לתת למישהו כבוד",
    "english": "to show someone respect",
    "verb": "לתת",
    "root": "נ.ת.נ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "כבוד",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ כבוד",
    "example": "תן לה כבוד",
    "negated": false,
    "literal_sg": "{s} gives {o} respect",
    "literal_pl": "{s} give {o} respect",
    "literal_past": "{s} gave {o} respect",
    "literal_future": "{s} will give {o} respect",
    "showMeaning": false,
    "conjugations": {
      "present": {
        "msg": "נותן",
        "fsg": "נותנת",
        "mpl": "נותנים",
        "fpl": "נותנות"
      },
      "past": {
        "msg": "נתן",
        "fsg": "נתנה",
        "mpl": "נתנו",
        "fpl": "נתנו"
      },
      "future": {
        "msg": "ייתן",
        "fsg": "תיתן",
        "mpl": "ייתנו",
        "fpl": "ייתנו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "נוֹתֵן",
        "fsg": "נוֹתֶנֶת",
        "mpl": "נוֹתְנִים",
        "fpl": "נוֹתְנוֹת"
      },
      "past": {
        "msg": "נָתַן",
        "fsg": "נָתְנָה",
        "mpl": "נָתְנוּ",
        "fpl": "נָתְנוּ"
      },
      "future": {
        "msg": "יִתֵּן",
        "fsg": "תִּתֵּן",
        "mpl": "יִתְּנוּ",
        "fpl": "יִתְּנוּ"
      }
    },
    "fixed_object_niqqud": "כָּבוֹד",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-latet"
    ]
  },
  {
    "id": "shibush_tochniyot",
    "infinitive": "לשבש למישהו את התוכניות",
    "english": "to mess up someone's plans",
    "verb": "לשבש",
    "root": "ש.ב.ש",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "את התוכניות",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את התוכניות",
    "example": "הגשם שיבש לנו את התוכניות",
    "negated": false,
    "literal_sg": "{s} disrupts {p} plans",
    "literal_pl": "{s} disrupt {p} plans",
    "literal_past": "{s} disrupted {p} plans",
    "literal_future": "{s} will disrupt {p} plans",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "משבש",
        "fsg": "משבשת",
        "mpl": "משבשים",
        "fpl": "משבשות"
      },
      "past": {
        "msg": "שיבש",
        "fsg": "שיבשה",
        "mpl": "שיבשו",
        "fpl": "שיבשו"
      },
      "future": {
        "msg": "ישבש",
        "fsg": "תשבש",
        "mpl": "ישבשו",
        "fpl": "ישבשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְשַׁבֵּשׁ",
        "fsg": "מְשַׁבֶּשֶׁת",
        "mpl": "מְשַׁבְּשִׁים",
        "fpl": "מְשַׁבְּשׁוֹת"
      },
      "past": {
        "msg": "שִׁבֵּשׁ",
        "fsg": "שִׁבְּשָׁה",
        "mpl": "שִׁבְּשׁוּ",
        "fpl": "שִׁבְּשׁוּ"
      },
      "future": {
        "msg": "יְשַׁבֵּשׁ",
        "fsg": "תְּשַׁבֵּשׁ",
        "mpl": "יְשַׁבְּשׁוּ",
        "fpl": "יְשַׁבְּשׁוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַתָּכְנִיּוֹת",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-leshabesh"
    ]
  },
  {
    "id": "zriyat_melach",
    "infinitive": "לזרות למישהו מלח על הפצעים",
    "english": "to rub salt in someone's wounds",
    "verb": "לזרות",
    "root": "ז.ר.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "מלח על הפצעים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ מלח על הפצעים",
    "example": "אל תזרה לי מלח על הפצעים",
    "negated": false,
    "literal_sg": "{s} scatters salt on {p} wounds",
    "literal_pl": "{s} scatter salt on {p} wounds",
    "literal_past": "{s} scattered salt on {p} wounds",
    "literal_future": "{s} will scatter salt on {p} wounds",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "זורה",
        "fsg": "זורה",
        "mpl": "זורים",
        "fpl": "זורות"
      },
      "past": {
        "msg": "זרה",
        "fsg": "זרתה",
        "mpl": "זרו",
        "fpl": "זרו"
      },
      "future": {
        "msg": "יזרה",
        "fsg": "תזרה",
        "mpl": "יזרו",
        "fpl": "יזרו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "זוֹרֶה",
        "fsg": "זוֹרָה",
        "mpl": "זוֹרִים",
        "fpl": "זוֹרוֹת"
      },
      "past": {
        "msg": "זָרָה",
        "fsg": "זָרְתָה",
        "mpl": "זָרוּ",
        "fpl": "זָרוּ"
      },
      "future": {
        "msg": "יִזְרֶה",
        "fsg": "תִּזְרֶה",
        "mpl": "יִזְרוּ",
        "fpl": "יִזְרוּ"
      }
    },
    "fixed_object_niqqud": "מֶלַח עַל הַפְּצָעִים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lizrot"
    ]
  },
  {
    "id": "hotzaat_milim",
    "infinitive": "להוציא למישהו את המילים מהפה",
    "english": "to take the words out of someone's mouth",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את המילים מהפה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את המילים מהפה",
    "example": "הוצאת לי את המילים מהפה",
    "negated": false,
    "literal_sg": "{s} takes the words out of {p} mouth",
    "literal_pl": "{s} take the words out of {p} mouth",
    "literal_past": "{s} took the words out of {p} mouth",
    "literal_future": "{s} will take the words out of {p} mouth",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַמִּלִּים מֵהַפֶּה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "sgirat_pina",
    "infinitive": "לסגור למישהו פינה",
    "english": "to sort something out for someone",
    "verb": "לסגור",
    "root": "ס.ג.ר",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "פינה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ פינה",
    "example": "הוא סגר לי פינה מול הבנק",
    "negated": false,
    "literal_sg": "{s} closes {o} a corner",
    "literal_pl": "{s} close {o} a corner",
    "literal_past": "{s} closed {o} a corner",
    "literal_future": "{s} will close {o} a corner",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "סוגר",
        "fsg": "סוגרת",
        "mpl": "סוגרים",
        "fpl": "סוגרות"
      },
      "past": {
        "msg": "סגר",
        "fsg": "סגרה",
        "mpl": "סגרו",
        "fpl": "סגרו"
      },
      "future": {
        "msg": "יסגור",
        "fsg": "תסגור",
        "mpl": "יסגרו",
        "fpl": "יסגרו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "סוֹגֵר",
        "fsg": "סוֹגֶרֶת",
        "mpl": "סוֹגְרִים",
        "fpl": "סוֹגְרוֹת"
      },
      "past": {
        "msg": "סָגַר",
        "fsg": "סָגְרָה",
        "mpl": "סָגְרוּ",
        "fpl": "סָגְרוּ"
      },
      "future": {
        "msg": "יִסְגּוֹר",
        "fsg": "תִּסְגּוֹר",
        "mpl": "יִסְגְּרוּ",
        "fpl": "יִסְגְּרוּ"
      }
    },
    "fixed_object_niqqud": "פִּנָּה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lisgor"
    ]
  },
  {
    "id": "ptichat_delet",
    "infinitive": "לפתוח למישהו דלת",
    "english": "to open a door for someone",
    "verb": "לפתוח",
    "root": "פ.ת.ח",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "דלת",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ דלת",
    "example": "הקורס פתח לי דלת",
    "negated": false,
    "literal_sg": "{s} opens {o} a door",
    "literal_pl": "{s} open {o} a door",
    "literal_past": "{s} opened {o} a door",
    "literal_future": "{s} will open {o} a door",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "פותח",
        "fsg": "פותחת",
        "mpl": "פותחים",
        "fpl": "פותחות"
      },
      "past": {
        "msg": "פתח",
        "fsg": "פתחה",
        "mpl": "פתחו",
        "fpl": "פתחו"
      },
      "future": {
        "msg": "יפתח",
        "fsg": "תפתח",
        "mpl": "יפתחו",
        "fpl": "יפתחו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "פּוֹתֵחַ",
        "fsg": "פּוֹתַחַת",
        "mpl": "פּוֹתְחִים",
        "fpl": "פּוֹתְחוֹת"
      },
      "past": {
        "msg": "פָּתַח",
        "fsg": "פָּתְחָה",
        "mpl": "פָּתְחוּ",
        "fpl": "פָּתְחוּ"
      },
      "future": {
        "msg": "יִפְתַּח",
        "fsg": "תִּפְתַּח",
        "mpl": "יִפְתְּחוּ",
        "fpl": "יִפְתְּחוּ"
      }
    },
    "fixed_object_niqqud": "דֶּלֶת",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-liftoach"
    ]
  },
  {
    "id": "hatayat_ozen",
    "infinitive": "להטות למישהו אוזן",
    "english": "to lend someone an ear",
    "verb": "להטות",
    "root": "נ.ט.ה",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "אוזן",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ אוזן",
    "example": "הוא הטה לי אוזן",
    "negated": false,
    "literal_sg": "{s} inclines an ear to {o}",
    "literal_pl": "{s} incline an ear to {o}",
    "literal_past": "{s} inclined an ear to {o}",
    "literal_future": "{s} will incline an ear to {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מטה",
        "fsg": "מטה",
        "mpl": "מטים",
        "fpl": "מטות"
      },
      "past": {
        "msg": "הטה",
        "fsg": "הטתה",
        "mpl": "הטו",
        "fpl": "הטו"
      },
      "future": {
        "msg": "יטה",
        "fsg": "תטה",
        "mpl": "יטו",
        "fpl": "יטו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַטֶּה",
        "fsg": "מַטָּה",
        "mpl": "מַטִּים",
        "fpl": "מַטּוֹת"
      },
      "past": {
        "msg": "הִטָּה",
        "fsg": "הִטְּתָה",
        "mpl": "הִטּוּ",
        "fpl": "הִטּוּ"
      },
      "future": {
        "msg": "יַטֶּה",
        "fsg": "תַּטֶּה",
        "mpl": "יַטּוּ",
        "fpl": "יַטּוּ"
      }
    },
    "fixed_object_niqqud": "אֹזֶן",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehatot"
    ]
  },
  {
    "id": "hafichat_chayim",
    "infinitive": "להפוך למישהו את החיים",
    "english": "to turn someone's life upside down",
    "verb": "להפוך",
    "root": "ה.פ.כ",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את החיים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את החיים",
    "example": "המעבר הפך לנו את החיים",
    "negated": false,
    "literal_sg": "{s} turns {p} life over",
    "literal_pl": "{s} turn {p} life over",
    "literal_past": "{s} turned {p} life over",
    "literal_future": "{s} will turn {p} life over",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "הופך",
        "fsg": "הופכת",
        "mpl": "הופכים",
        "fpl": "הופכות"
      },
      "past": {
        "msg": "הפך",
        "fsg": "הפכה",
        "mpl": "הפכו",
        "fpl": "הפכו"
      },
      "future": {
        "msg": "יהפוך",
        "fsg": "תהפוך",
        "mpl": "יהפכו",
        "fpl": "יהפכו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "הוֹפֵךְ",
        "fsg": "הוֹפֶכֶת",
        "mpl": "הוֹפְכִים",
        "fpl": "הוֹפְכוֹת"
      },
      "past": {
        "msg": "הָפַךְ",
        "fsg": "הָפְכָה",
        "mpl": "הָפְכוּ",
        "fpl": "הָפְכוּ"
      },
      "future": {
        "msg": "יַהֲפֹךְ",
        "fsg": "תַּהֲפֹךְ",
        "mpl": "יַהַפְכוּ",
        "fpl": "יַהַפְכוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַחַיִּים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lahafoch"
    ]
  },
  {
    "id": "hotzaa_mishalva",
    "infinitive": "להוציא מישהו משלוותו",
    "english": "to throw someone off balance",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "שלווה",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הידיעה הוציאה אותי משלוותי",
    "negated": false,
    "literal_sg": "{s} takes {o} out of {p} calm",
    "literal_pl": "{s} take {o} out of {p} calm",
    "literal_past": "{s} took {o} out of {p} calm",
    "literal_future": "{s} will take {o} out of {p} calm",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "משלוותי",
      "2msg": "משלוותך",
      "2fsg": "משלוותך",
      "3msg": "משלוותו",
      "3fsg": "משלוותה",
      "1pl": "משלוותנו",
      "2mpl": "משלוותכם",
      "2fpl": "משלוותכן",
      "3mpl": "משלוותם",
      "3fpl": "משלוותן"
    },
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מִשַּׁלְוָתִי",
      "2msg": "מִשַּׁלְוָתְךָ",
      "2fsg": "מִשַּׁלְוָתֵךְ",
      "3msg": "מִשַּׁלְוָתוֹ",
      "3fsg": "מִשַּׁלְוָתָהּ",
      "1pl": "מִשַּׁלְוָתֵנוּ",
      "2mpl": "מִשַּׁלְוַתְכֶם",
      "2fpl": "מִשַּׁלְוַתְכֶן",
      "3mpl": "מִשַּׁלְוָתָם",
      "3fpl": "מִשַּׁלְוָתָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "haamada_bimkomo",
    "infinitive": "להעמיד מישהו במקומו",
    "english": "to put someone in their place",
    "verb": "להעמיד",
    "root": "ע.מ.ד",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "מקום",
    "suffix_preposition": "ב",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "היא העמידה אותו במקומו",
    "negated": false,
    "literal_sg": "{s} stands {o} in {p} place",
    "literal_pl": "{s} stand {o} in {p} place",
    "literal_past": "{s} stood {o} in {p} place",
    "literal_future": "{s} will stand {o} in {p} place",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "במקומי",
      "2msg": "במקומך",
      "2fsg": "במקומך",
      "3msg": "במקומו",
      "3fsg": "במקומה",
      "1pl": "במקומנו",
      "2mpl": "במקומכם",
      "2fpl": "במקומכן",
      "3mpl": "במקומם",
      "3fpl": "במקומן"
    },
    "conjugations": {
      "present": {
        "msg": "מעמיד",
        "fsg": "מעמידה",
        "mpl": "מעמידים",
        "fpl": "מעמידות"
      },
      "past": {
        "msg": "העמיד",
        "fsg": "העמידה",
        "mpl": "העמידו",
        "fpl": "העמידו"
      },
      "future": {
        "msg": "יעמיד",
        "fsg": "תעמיד",
        "mpl": "יעמידו",
        "fpl": "יעמידו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲמִיד",
        "fsg": "מַעֲמִידָה",
        "mpl": "מַעֲמִידִים",
        "fpl": "מַעֲמִידוֹת"
      },
      "past": {
        "msg": "הֶעֱמִיד",
        "fsg": "הֶעֱמִידָה",
        "mpl": "הֶעֱמִידוּ",
        "fpl": "הֶעֱמִידוּ"
      },
      "future": {
        "msg": "יַעֲמִיד",
        "fsg": "תַּעֲמִיד",
        "mpl": "יַעֲמִידוּ",
        "fpl": "יַעֲמִידוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "בִּמְקוֹמִי",
      "2msg": "בִּמְקוֹמְךָ",
      "2fsg": "בִּמְקוֹמֵךְ",
      "3msg": "בִּמְקוֹמוֹ",
      "3fsg": "בִּמְקוֹמָהּ",
      "1pl": "בִּמְקוֹמֵנוּ",
      "2mpl": "בִּמְקוֹמְכֶם",
      "2fpl": "בִּמְקוֹמְכֶן",
      "3mpl": "בִּמְקוֹמָם",
      "3fpl": "בִּמְקוֹמָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaamid"
    ]
  },
  {
    "id": "tfisa_bimilato",
    "infinitive": "לתפוס מישהו במילתו",
    "english": "to take someone at their word",
    "verb": "לתפוס",
    "root": "ת.פ.ס",
    "binyan": "paal",
    "object_type": "possessive_suffix",
    "suffix_noun": "מילה",
    "suffix_preposition": "ב",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "תפסתי אותו במילתו",
    "negated": false,
    "literal_sg": "{s} catches {o} at {p} word",
    "literal_pl": "{s} catch {o} at {p} word",
    "literal_past": "{s} caught {o} at {p} word",
    "literal_future": "{s} will catch {o} at {p} word",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "במילתי",
      "2msg": "במילתך",
      "2fsg": "במילתך",
      "3msg": "במילתו",
      "3fsg": "במילתה",
      "1pl": "במילתנו",
      "2mpl": "במילתכם",
      "2fpl": "במילתכן",
      "3mpl": "במילתם",
      "3fpl": "במילתן"
    },
    "conjugations": {
      "present": {
        "msg": "תופס",
        "fsg": "תופסת",
        "mpl": "תופסים",
        "fpl": "תופסות"
      },
      "past": {
        "msg": "תפס",
        "fsg": "תפסה",
        "mpl": "תפסו",
        "fpl": "תפסו"
      },
      "future": {
        "msg": "יתפוס",
        "fsg": "תתפוס",
        "mpl": "יתפסו",
        "fpl": "יתפסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "תּוֹפֵס",
        "fsg": "תּוֹפֶסֶת",
        "mpl": "תּוֹפְסִים",
        "fpl": "תּוֹפְסוֹת"
      },
      "past": {
        "msg": "תָּפַס",
        "fsg": "תָּפְסָה",
        "mpl": "תָּפְסוּ",
        "fpl": "תָּפְסוּ"
      },
      "future": {
        "msg": "יִתְפֹּס",
        "fsg": "תִּתְפֹּס",
        "mpl": "יִתְפְּסוּ",
        "fpl": "יִתְפְּסוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "בְּמִלָּתִי",
      "2msg": "בְּמִלָּתְךָ",
      "2fsg": "בְּמִלָּתֵךְ",
      "3msg": "בְּמִלָּתוֹ",
      "3fsg": "בְּמִלָּתָהּ",
      "1pl": "בְּמִלָּתֵנוּ",
      "2mpl": "בְּמִלַּתְכֶם",
      "2fpl": "בְּמִלַּתְכֶן",
      "3mpl": "בְּמִלָּתָם",
      "3fpl": "בְּמִלָּתָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-litfos"
    ]
  },
  {
    "id": "hachzara_leatzmo",
    "infinitive": "להחזיר מישהו לעצמו",
    "english": "to bring someone back to themselves",
    "verb": "להחזיר",
    "root": "ח.ז.ר",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "עצם",
    "suffix_preposition": "ל",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "החופשה החזירה אותי לעצמי",
    "negated": false,
    "literal_sg": "{s} brings {o} back to {p} self",
    "literal_pl": "{s} bring {o} back to {p} self",
    "literal_past": "{s} brought {o} back to {p} self",
    "literal_future": "{s} will bring {o} back to {p} self",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "לעצמי",
      "2msg": "לעצמך",
      "2fsg": "לעצמך",
      "3msg": "לעצמו",
      "3fsg": "לעצמה",
      "1pl": "לעצמנו",
      "2mpl": "לעצמכם",
      "2fpl": "לעצמכן",
      "3mpl": "לעצמם",
      "3fpl": "לעצמן"
    },
    "conjugations": {
      "present": {
        "msg": "מחזיר",
        "fsg": "מחזירה",
        "mpl": "מחזירים",
        "fpl": "מחזירות"
      },
      "past": {
        "msg": "החזיר",
        "fsg": "החזירה",
        "mpl": "החזירו",
        "fpl": "החזירו"
      },
      "future": {
        "msg": "יחזיר",
        "fsg": "תחזיר",
        "mpl": "יחזירו",
        "fpl": "יחזירו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַחְזִיר",
        "fsg": "מַחְזִירָה",
        "mpl": "מַחְזִירִים",
        "fpl": "מַחְזִירוֹת"
      },
      "past": {
        "msg": "הֶחְזִיר",
        "fsg": "הֶחְזִירָה",
        "mpl": "הֶחְזִירוּ",
        "fpl": "הֶחְזִירוּ"
      },
      "future": {
        "msg": "יַחְזִיר",
        "fsg": "תַּחְזִיר",
        "mpl": "יַחְזִירוּ",
        "fpl": "יַחְזִירוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "לְעַצְמִי",
      "2msg": "לְעַצְמְךָ",
      "2fsg": "לְעַצְמֵךְ",
      "3msg": "לְעַצְמוֹ",
      "3fsg": "לְעַצְמָהּ",
      "1pl": "לְעַצְמֵנוּ",
      "2mpl": "לְעַצְמְכֶם",
      "2fpl": "לְעַצְמְכֶן",
      "3mpl": "לְעַצְמָם",
      "3fpl": "לְעַצְמָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "https://www.pealim.com/dict/581-lehachazir/",
      "https://hebrew-academy.org.il/%D7%A0%D7%98%D7%99%D7%99%D7%AA-%D7%9E%D7%99%D7%9C%D7%95%D7%AA-%D7%94%D7%99%D7%97%D7%A1/"
    ]
  },
  {
    "id": "haavara_al_daato",
    "infinitive": "להעביר מישהו על דעתו",
    "english": "to drive someone out of their mind",
    "verb": "להעביר",
    "root": "ע.ב.ר",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "דעת",
    "suffix_preposition": "על",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הרעש מעביר אותי על דעתי",
    "negated": false,
    "literal_sg": "{s} drives {o} past {p} senses",
    "literal_pl": "{s} drive {o} past {p} senses",
    "literal_past": "{s} drove {o} past {p} senses",
    "literal_future": "{s} will drive {o} past {p} senses",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "על דעתי",
      "2msg": "על דעתך",
      "2fsg": "על דעתך",
      "3msg": "על דעתו",
      "3fsg": "על דעתה",
      "1pl": "על דעתנו",
      "2mpl": "על דעתכם",
      "2fpl": "על דעתכן",
      "3mpl": "על דעתם",
      "3fpl": "על דעתן"
    },
    "conjugations": {
      "present": {
        "msg": "מעביר",
        "fsg": "מעבירה",
        "mpl": "מעבירים",
        "fpl": "מעבירות"
      },
      "past": {
        "msg": "העביר",
        "fsg": "העבירה",
        "mpl": "העבירו",
        "fpl": "העבירו"
      },
      "future": {
        "msg": "יעביר",
        "fsg": "תעביר",
        "mpl": "יעבירו",
        "fpl": "יעבירו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲבִיר",
        "fsg": "מַעֲבִירָה",
        "mpl": "מַעֲבִירִים",
        "fpl": "מַעֲבִירוֹת"
      },
      "past": {
        "msg": "הֶעֱבִיר",
        "fsg": "הֶעֱבִירָה",
        "mpl": "הֶעֱבִירוּ",
        "fpl": "הֶעֱבִירוּ"
      },
      "future": {
        "msg": "יַעֲבִיר",
        "fsg": "תַּעֲבִיר",
        "mpl": "יַעֲבִירוּ",
        "fpl": "יַעֲבִירוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "עַל דַּעְתִּי",
      "2msg": "עַל דַּעְתְּךָ",
      "2fsg": "עַל דַּעְתֵּךְ",
      "3msg": "עַל דַּעְתּוֹ",
      "3fsg": "עַל דַּעְתָּהּ",
      "1pl": "עַל דַּעְתֵּנוּ",
      "2mpl": "עַל דַּעְתְּכֶם",
      "2fpl": "עַל דַּעְתְּכֶן",
      "3mpl": "עַל דַּעְתָּם",
      "3fpl": "עַל דַּעְתָּן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaavir"
    ]
  },
  {
    "id": "hashara_betzarato",
    "infinitive": "להשאיר מישהו בצרתו",
    "english": "to leave someone in the lurch",
    "verb": "להשאיר",
    "root": "ש.א.ר",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "צרה",
    "suffix_preposition": "ב",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הם השאירו אותנו בצרתנו",
    "negated": false,
    "literal_sg": "{s} leaves {o} in {p} trouble",
    "literal_pl": "{s} leave {o} in {p} trouble",
    "literal_past": "{s} left {o} in {p} trouble",
    "literal_future": "{s} will leave {o} in {p} trouble",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "בצרתי",
      "2msg": "בצרתך",
      "2fsg": "בצרתך",
      "3msg": "בצרתו",
      "3fsg": "בצרתה",
      "1pl": "בצרתנו",
      "2mpl": "בצרתכם",
      "2fpl": "בצרתכן",
      "3mpl": "בצרתם",
      "3fpl": "בצרתן"
    },
    "conjugations": {
      "present": {
        "msg": "משאיר",
        "fsg": "משאירה",
        "mpl": "משאירים",
        "fpl": "משאירות"
      },
      "past": {
        "msg": "השאיר",
        "fsg": "השאירה",
        "mpl": "השאירו",
        "fpl": "השאירו"
      },
      "future": {
        "msg": "ישאיר",
        "fsg": "תשאיר",
        "mpl": "ישאירו",
        "fpl": "ישאירו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַשְׁאִיר",
        "fsg": "מַשְׁאִירָה",
        "mpl": "מַשְׁאִירִים",
        "fpl": "מַשְׁאִירוֹת"
      },
      "past": {
        "msg": "הִשְׁאִיר",
        "fsg": "הִשְׁאִירָה",
        "mpl": "הִשְׁאִירוּ",
        "fpl": "הִשְׁאִירוּ"
      },
      "future": {
        "msg": "יַשְׁאִיר",
        "fsg": "תַּשְׁאִיר",
        "mpl": "יַשְׁאִירוּ",
        "fpl": "יַשְׁאִירוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "בְּצָרָתִי",
      "2msg": "בְּצָרָתְךָ",
      "2fsg": "בְּצָרָתֵךְ",
      "3msg": "בְּצָרָתוֹ",
      "3fsg": "בְּצָרָתָהּ",
      "1pl": "בְּצָרָתֵנוּ",
      "2mpl": "בְּצָרַתְכֶם",
      "2fpl": "בְּצָרַתְכֶן",
      "3mpl": "בְּצָרָתָם",
      "3fpl": "בְּצָרָתָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehashir"
    ]
  },
  {
    "id": "haamada_al_tauto",
    "infinitive": "להעמיד מישהו על טעותו",
    "english": "to set someone straight",
    "verb": "להעמיד",
    "root": "ע.מ.ד",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "טעות",
    "suffix_preposition": "על",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "המורה העמידה אותי על טעותי",
    "negated": false,
    "literal_sg": "{s} sets {o} straight about {p} mistake",
    "literal_pl": "{s} set {o} straight about {p} mistake",
    "literal_past": "{s} set {o} straight about {p} mistake",
    "literal_future": "{s} will set {o} straight about {p} mistake",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "על טעותי",
      "2msg": "על טעותך",
      "2fsg": "על טעותך",
      "3msg": "על טעותו",
      "3fsg": "על טעותה",
      "1pl": "על טעותנו",
      "2mpl": "על טעותכם",
      "2fpl": "על טעותכן",
      "3mpl": "על טעותם",
      "3fpl": "על טעותן"
    },
    "conjugations": {
      "present": {
        "msg": "מעמיד",
        "fsg": "מעמידה",
        "mpl": "מעמידים",
        "fpl": "מעמידות"
      },
      "past": {
        "msg": "העמיד",
        "fsg": "העמידה",
        "mpl": "העמידו",
        "fpl": "העמידו"
      },
      "future": {
        "msg": "יעמיד",
        "fsg": "תעמיד",
        "mpl": "יעמידו",
        "fpl": "יעמידו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲמִיד",
        "fsg": "מַעֲמִידָה",
        "mpl": "מַעֲמִידִים",
        "fpl": "מַעֲמִידוֹת"
      },
      "past": {
        "msg": "הֶעֱמִיד",
        "fsg": "הֶעֱמִידָה",
        "mpl": "הֶעֱמִידוּ",
        "fpl": "הֶעֱמִידוּ"
      },
      "future": {
        "msg": "יַעֲמִיד",
        "fsg": "תַּעֲמִיד",
        "mpl": "יַעֲמִידוּ",
        "fpl": "יַעֲמִידוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "עַל טָעוּתִי",
      "2msg": "עַל טָעוּתְךָ",
      "2fsg": "עַל טָעוּתֵךְ",
      "3msg": "עַל טָעוּתוֹ",
      "3fsg": "עַל טָעוּתָהּ",
      "1pl": "עַל טָעוּתֵנוּ",
      "2mpl": "עַל טָעוּתְכֶם",
      "2fpl": "עַל טָעוּתְכֶן",
      "3mpl": "עַל טָעוּתָם",
      "3fpl": "עַל טָעוּתָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaamid"
    ]
  },
  {
    "id": "tfisa_bekilkelato",
    "infinitive": "לתפוס מישהו בקלקלתו",
    "english": "to catch someone red-handed",
    "verb": "לתפוס",
    "root": "ת.פ.ס",
    "binyan": "paal",
    "object_type": "possessive_suffix",
    "suffix_noun": "קלקלה",
    "suffix_preposition": "ב",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "תפסו אותו בקלקלתו",
    "negated": false,
    "literal_sg": "{s} catches {o} in {p} wrongdoing",
    "literal_pl": "{s} catch {o} in {p} wrongdoing",
    "literal_past": "{s} caught {o} in {p} wrongdoing",
    "literal_future": "{s} will catch {o} in {p} wrongdoing",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "בקלקלתי",
      "2msg": "בקלקלתך",
      "2fsg": "בקלקלתך",
      "3msg": "בקלקלתו",
      "3fsg": "בקלקלתה",
      "1pl": "בקלקלתנו",
      "2mpl": "בקלקלתכם",
      "2fpl": "בקלקלתכן",
      "3mpl": "בקלקלתם",
      "3fpl": "בקלקלתן"
    },
    "conjugations": {
      "present": {
        "msg": "תופס",
        "fsg": "תופסת",
        "mpl": "תופסים",
        "fpl": "תופסות"
      },
      "past": {
        "msg": "תפס",
        "fsg": "תפסה",
        "mpl": "תפסו",
        "fpl": "תפסו"
      },
      "future": {
        "msg": "יתפוס",
        "fsg": "תתפוס",
        "mpl": "יתפסו",
        "fpl": "יתפסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "תּוֹפֵס",
        "fsg": "תּוֹפֶסֶת",
        "mpl": "תּוֹפְסִים",
        "fpl": "תּוֹפְסוֹת"
      },
      "past": {
        "msg": "תָּפַס",
        "fsg": "תָּפְסָה",
        "mpl": "תָּפְסוּ",
        "fpl": "תָּפְסוּ"
      },
      "future": {
        "msg": "יִתְפֹּס",
        "fsg": "תִּתְפֹּס",
        "mpl": "יִתְפְּסוּ",
        "fpl": "יִתְפְּסוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "בְּקַלְקָלָתִי",
      "2msg": "בְּקַלְקָלָתְךָ",
      "2fsg": "בְּקַלְקָלָתֵךְ",
      "3msg": "בְּקַלְקָלָתוֹ",
      "3fsg": "בְּקַלְקָלָתָהּ",
      "1pl": "בְּקַלְקָלָתֵנוּ",
      "2mpl": "בְּקַלְקָלַתְכֶם",
      "2fpl": "בְּקַלְקָלַתְכֶן",
      "3mpl": "בְּקַלְקָלָתָם",
      "3fpl": "בְּקַלְקָלָתָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-litfos"
    ]
  },
  {
    "id": "ktia_bidvarav",
    "infinitive": "לקטוע מישהו בדבריו",
    "english": "to cut someone off mid-sentence",
    "verb": "לקטוע",
    "root": "ק.ט.ע",
    "binyan": "paal",
    "object_type": "possessive_suffix",
    "suffix_noun": "דברים",
    "suffix_preposition": "ב",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הוא קטע אותי בדבריי",
    "negated": false,
    "literal_sg": "{s} cuts {o} off in {p} words",
    "literal_pl": "{s} cut {o} off in {p} words",
    "literal_past": "{s} cut {o} off in {p} words",
    "literal_future": "{s} will cut {o} off in {p} words",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "בדבריי",
      "2msg": "בדבריך",
      "2fsg": "בדבריך",
      "3msg": "בדבריו",
      "3fsg": "בדבריה",
      "1pl": "בדברינו",
      "2mpl": "בדבריכם",
      "2fpl": "בדבריכן",
      "3mpl": "בדבריהם",
      "3fpl": "בדבריהן"
    },
    "conjugations": {
      "present": {
        "msg": "קוטע",
        "fsg": "קוטעת",
        "mpl": "קוטעים",
        "fpl": "קוטעות"
      },
      "past": {
        "msg": "קטע",
        "fsg": "קטעה",
        "mpl": "קטעו",
        "fpl": "קטעו"
      },
      "future": {
        "msg": "יקטע",
        "fsg": "תקטע",
        "mpl": "יקטעו",
        "fpl": "יקטעו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "קוֹטֵעַ",
        "fsg": "קוֹטַעַת",
        "mpl": "קוֹטְעִים",
        "fpl": "קוֹטְעוֹת"
      },
      "past": {
        "msg": "קָטַע",
        "fsg": "קָטְעָה",
        "mpl": "קָטְעוּ",
        "fpl": "קָטְעוּ"
      },
      "future": {
        "msg": "יִקְטַע",
        "fsg": "תִּקְטַע",
        "mpl": "יִקְטְעוּ",
        "fpl": "יִקְטְעוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "בִּדְבָרַי",
      "2msg": "בִּדְבָרֶיךָ",
      "2fsg": "בִּדְבָרַיִךְ",
      "3msg": "בִּדְבָרָיו",
      "3fsg": "בִּדְבָרֶיהָ",
      "1pl": "בִּדְבָרֵינוּ",
      "2mpl": "בְּדִבְרֵיכֶם",
      "2fpl": "בְּדִבְרֵיכֶן",
      "3mpl": "בְּדִבְרֵיהֶם",
      "3fpl": "בְּדִבְרֵיהֶן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-liktoa"
    ]
  },
  {
    "id": "chizuk_bedaato",
    "infinitive": "לחזק מישהו בדעתו",
    "english": "to reinforce someone's view",
    "verb": "לחזק",
    "root": "ח.ז.ק",
    "binyan": "piel",
    "object_type": "possessive_suffix",
    "suffix_noun": "דעה",
    "suffix_preposition": "ב",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "התגובות חיזקו אותו בדעתו",
    "negated": false,
    "literal_sg": "{s} strengthens {o} in {p} opinion",
    "literal_pl": "{s} strengthen {o} in {p} opinion",
    "literal_past": "{s} strengthened {o} in {p} opinion",
    "literal_future": "{s} will strengthen {o} in {p} opinion",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "בדעתי",
      "2msg": "בדעתך",
      "2fsg": "בדעתך",
      "3msg": "בדעתו",
      "3fsg": "בדעתה",
      "1pl": "בדעתנו",
      "2mpl": "בדעתכם",
      "2fpl": "בדעתכן",
      "3mpl": "בדעתם",
      "3fpl": "בדעתן"
    },
    "conjugations": {
      "present": {
        "msg": "מחזק",
        "fsg": "מחזקת",
        "mpl": "מחזקים",
        "fpl": "מחזקות"
      },
      "past": {
        "msg": "חיזק",
        "fsg": "חיזקה",
        "mpl": "חיזקו",
        "fpl": "חיזקו"
      },
      "future": {
        "msg": "יחזק",
        "fsg": "תחזק",
        "mpl": "יחזקו",
        "fpl": "יחזקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְחַזֵּק",
        "fsg": "מְחַזֶּקֶת",
        "mpl": "מְחַזְּקִים",
        "fpl": "מְחַזְּקוֹת"
      },
      "past": {
        "msg": "חִזֵּק",
        "fsg": "חִזְּקָה",
        "mpl": "חִזְּקוּ",
        "fpl": "חִזְּקוּ"
      },
      "future": {
        "msg": "יְחַזֵּק",
        "fsg": "תְּחַזֵּק",
        "mpl": "יְחַזְּקוּ",
        "fpl": "יְחַזְּקוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "בְּדַעְתִּי",
      "2msg": "בְּדַעְתְּךָ",
      "2fsg": "בְּדַעְתֵּךְ",
      "3msg": "בְּדַעְתּוֹ",
      "3fsg": "בְּדַעְתָּהּ",
      "1pl": "בְּדַעְתֵּנוּ",
      "2mpl": "בְּדַעְתְּכֶם",
      "2fpl": "בְּדַעְתְּכֶן",
      "3mpl": "בְּדַעְתָּם",
      "3fpl": "בְּדַעְתָּן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lechazek"
    ]
  },
  {
    "id": "srifat_oto",
    "infinitive": "לשרוף מישהו",
    "english": "to blow someone's cover",
    "verb": "לשרוף",
    "root": "ש.ר.פ",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הוא שרף אותי מול כל הצוות",
    "negated": false,
    "literal_sg": "{s} burns {o}",
    "literal_pl": "{s} burn {o}",
    "literal_past": "{s} burned {o}",
    "literal_future": "{s} will burn {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "שורף",
        "fsg": "שורפת",
        "mpl": "שורפים",
        "fpl": "שורפות"
      },
      "past": {
        "msg": "שרף",
        "fsg": "שרפה",
        "mpl": "שרפו",
        "fpl": "שרפו"
      },
      "future": {
        "msg": "ישרוף",
        "fsg": "תשרוף",
        "mpl": "ישרפו",
        "fpl": "ישרפו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "שׂוֹרֵף",
        "fsg": "שׂוֹרֶפֶת",
        "mpl": "שׂוֹרְפִים",
        "fpl": "שׂוֹרְפוֹת"
      },
      "past": {
        "msg": "שָׂרַף",
        "fsg": "שָׂרְפָה",
        "mpl": "שָׂרְפוּ",
        "fpl": "שָׂרְפוּ"
      },
      "future": {
        "msg": "יִשְׂרֹף",
        "fsg": "תִּשְׂרֹף",
        "mpl": "יִשְׂרְפוּ",
        "fpl": "יִשְׂרְפוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lisrof"
    ]
  },
  {
    "id": "pitzutz_oto",
    "infinitive": "לפוצץ מישהו",
    "english": "to stand someone up",
    "verb": "לפוצץ",
    "root": "פ.צ.צ",
    "binyan": "piel",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "היא פוצצה אותי בלי להתקשר",
    "negated": false,
    "literal_sg": "{s} blows {o} up",
    "literal_pl": "{s} blow {o} up",
    "literal_past": "{s} blew {o} up",
    "literal_future": "{s} will blow {o} up",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מפוצץ",
        "fsg": "מפוצצת",
        "mpl": "מפוצצים",
        "fpl": "מפוצצות"
      },
      "past": {
        "msg": "פוצץ",
        "fsg": "פוצצה",
        "mpl": "פוצצו",
        "fpl": "פוצצו"
      },
      "future": {
        "msg": "יפוצץ",
        "fsg": "תפוצץ",
        "mpl": "יפוצצו",
        "fpl": "יפוצצו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְפוֹצֵץ",
        "fsg": "מְפוֹצֶצֶת",
        "mpl": "מְפוֹצְצִים",
        "fpl": "מְפוֹצְצוֹת"
      },
      "past": {
        "msg": "פּוֹצֵץ",
        "fsg": "פּוֹצְצָה",
        "mpl": "פּוֹצְצוּ",
        "fpl": "פּוֹצְצוּ"
      },
      "future": {
        "msg": "יְפוֹצֵץ",
        "fsg": "תְּפוֹצֵץ",
        "mpl": "יְפוֹצְצוּ",
        "fpl": "יְפוֹצְצוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lefotzetz"
    ]
  },
  {
    "id": "gmirat_oto",
    "infinitive": "לגמור מישהו",
    "english": "to wear someone out completely",
    "verb": "לגמור",
    "root": "ג.מ.ר",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "האימון הזה גמר אותי",
    "negated": false,
    "literal_sg": "{s} finishes {o}",
    "literal_pl": "{s} finish {o}",
    "literal_past": "{s} finished {o}",
    "literal_future": "{s} will finish {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "גומר",
        "fsg": "גומרת",
        "mpl": "גומרים",
        "fpl": "גומרות"
      },
      "past": {
        "msg": "גמר",
        "fsg": "גמרה",
        "mpl": "גמרו",
        "fpl": "גמרו"
      },
      "future": {
        "msg": "יגמור",
        "fsg": "תגמור",
        "mpl": "יגמרו",
        "fpl": "יגמרו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "גּוֹמֵר",
        "fsg": "גּוֹמֶרֶת",
        "mpl": "גּוֹמְרִים",
        "fpl": "גּוֹמְרוֹת"
      },
      "past": {
        "msg": "גָּמַר",
        "fsg": "גָּמְרָה",
        "mpl": "גָּמְרוּ",
        "fpl": "גָּמְרוּ"
      },
      "future": {
        "msg": "יִגְמוֹר",
        "fsg": "תִּגְמוֹר",
        "mpl": "יִגְמְרוּ",
        "fpl": "יִגְמְרוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-ligmor"
    ]
  },
  {
    "id": "shvirat_oto",
    "infinitive": "לשבור מישהו",
    "english": "to break someone down",
    "verb": "לשבור",
    "root": "ש.ב.ר",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "החקירה שברה אותו",
    "negated": false,
    "literal_sg": "{s} breaks {o}",
    "literal_pl": "{s} break {o}",
    "literal_past": "{s} broke {o}",
    "literal_future": "{s} will break {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "שובר",
        "fsg": "שוברת",
        "mpl": "שוברים",
        "fpl": "שוברות"
      },
      "past": {
        "msg": "שבר",
        "fsg": "שברה",
        "mpl": "שברו",
        "fpl": "שברו"
      },
      "future": {
        "msg": "ישבור",
        "fsg": "תשבור",
        "mpl": "ישברו",
        "fpl": "ישברו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "שׁוֹבֵר",
        "fsg": "שׁוֹבֶרֶת",
        "mpl": "שׁוֹבְרִים",
        "fpl": "שׁוֹבְרוֹת"
      },
      "past": {
        "msg": "שָׁבַר",
        "fsg": "שָׁבְרָה",
        "mpl": "שָׁבְרוּ",
        "fpl": "שָׁבְרוּ"
      },
      "future": {
        "msg": "יִשְׁבֹּר",
        "fsg": "תִּשְׁבֹּר",
        "mpl": "יִשְׁבְּרוּ",
        "fpl": "יִשְׁבְּרוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lishbor"
    ]
  },
  {
    "id": "harigat_oto",
    "infinitive": "להרוג מישהו",
    "english": "to crack someone up",
    "verb": "להרוג",
    "root": "ה.ר.ג",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הבדיחה שלו הרגה אותי",
    "negated": false,
    "literal_sg": "{s} kills {o}",
    "literal_pl": "{s} kill {o}",
    "literal_past": "{s} killed {o}",
    "literal_future": "{s} will kill {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "הורג",
        "fsg": "הורגת",
        "mpl": "הורגים",
        "fpl": "הורגות"
      },
      "past": {
        "msg": "הרג",
        "fsg": "הרגה",
        "mpl": "הרגו",
        "fpl": "הרגו"
      },
      "future": {
        "msg": "יהרוג",
        "fsg": "תהרוג",
        "mpl": "יהרגו",
        "fpl": "יהרגו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "הוֹרֵג",
        "fsg": "הוֹרֶגֶת",
        "mpl": "הוֹרְגִים",
        "fpl": "הוֹרְגוֹת"
      },
      "past": {
        "msg": "הָרַג",
        "fsg": "הָרְגָה",
        "mpl": "הָרְגוּ",
        "fpl": "הָרְגוּ"
      },
      "future": {
        "msg": "יַהֲרֹג",
        "fsg": "תַּהֲרֹג",
        "mpl": "יַהַרְגוּ",
        "fpl": "יַהַרְגוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-laharog"
    ]
  },
  {
    "id": "schivat_oto",
    "infinitive": "לסחוב מישהו",
    "english": "to drag someone around",
    "verb": "לסחוב",
    "root": "ס.ח.ב",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "סחבו אותנו בין המשרדים כל היום",
    "negated": false,
    "literal_sg": "{s} drags {o}",
    "literal_pl": "{s} drag {o}",
    "literal_past": "{s} dragged {o}",
    "literal_future": "{s} will drag {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "סוחב",
        "fsg": "סוחבת",
        "mpl": "סוחבים",
        "fpl": "סוחבות"
      },
      "past": {
        "msg": "סחב",
        "fsg": "סחבה",
        "mpl": "סחבו",
        "fpl": "סחבו"
      },
      "future": {
        "msg": "יסחב",
        "fsg": "תסחב",
        "mpl": "יסחבו",
        "fpl": "יסחבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "סוֹחֵב",
        "fsg": "סוֹחֶבֶת",
        "mpl": "סוֹחֲבִים",
        "fpl": "סוֹחֲבוֹת"
      },
      "past": {
        "msg": "סָחַב",
        "fsg": "סָחֲבָה",
        "mpl": "סָחֲבוּ",
        "fpl": "סָחֲבוּ"
      },
      "future": {
        "msg": "יִסְחַב",
        "fsg": "תִּסְחַב",
        "mpl": "יִסְחֲבוּ",
        "fpl": "יִסְחֲבוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lischov"
    ]
  },
  {
    "id": "prikat_oto",
    "infinitive": "לפרק מישהו",
    "english": "to destroy someone emotionally",
    "verb": "לפרק",
    "root": "פ.ר.ק",
    "binyan": "piel",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הפרידה פירקה אותה",
    "negated": false,
    "literal_sg": "{s} takes {o} apart",
    "literal_pl": "{s} take {o} apart",
    "literal_past": "{s} took {o} apart",
    "literal_future": "{s} will take {o} apart",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מפרק",
        "fsg": "מפרקת",
        "mpl": "מפרקים",
        "fpl": "מפרקות"
      },
      "past": {
        "msg": "פירק",
        "fsg": "פירקה",
        "mpl": "פירקו",
        "fpl": "פירקו"
      },
      "future": {
        "msg": "יפרק",
        "fsg": "תפרק",
        "mpl": "יפרקו",
        "fpl": "יפרקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְפָרֵק",
        "fsg": "מְפָרֶקֶת",
        "mpl": "מְפָרְקִים",
        "fpl": "מְפָרְקוֹת"
      },
      "past": {
        "msg": "פֵּרֵק",
        "fsg": "פֵּרְקָה",
        "mpl": "פֵּרְקוּ",
        "fpl": "פֵּרְקוּ"
      },
      "future": {
        "msg": "יְפָרֵק",
        "fsg": "תְּפָרֵק",
        "mpl": "יְפָרְקוּ",
        "fpl": "יְפָרְקוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lefarek"
    ]
  },
  {
    "id": "dchifat_oto",
    "infinitive": "לדחוף מישהו",
    "english": "to pull strings for someone",
    "verb": "לדחוף",
    "root": "ד.ח.פ",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הדוד שלו דחף אותו לתפקיד",
    "negated": false,
    "literal_sg": "{s} pushes {o}",
    "literal_pl": "{s} push {o}",
    "literal_past": "{s} pushed {o}",
    "literal_future": "{s} will push {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "דוחף",
        "fsg": "דוחפת",
        "mpl": "דוחפים",
        "fpl": "דוחפות"
      },
      "past": {
        "msg": "דחף",
        "fsg": "דחפה",
        "mpl": "דחפו",
        "fpl": "דחפו"
      },
      "future": {
        "msg": "ידחוף",
        "fsg": "תדחוף",
        "mpl": "ידחפו",
        "fpl": "ידחפו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "דּוֹחֵף",
        "fsg": "דּוֹחֶפֶת",
        "mpl": "דּוֹחֲפִים",
        "fpl": "דּוֹחֲפוֹת"
      },
      "past": {
        "msg": "דָּחַף",
        "fsg": "דָּחֲפָה",
        "mpl": "דָּחֲפוּ",
        "fpl": "דָּחֲפוּ"
      },
      "future": {
        "msg": "יִדְחַף",
        "fsg": "תִּדְחַף",
        "mpl": "יִדְחֲפוּ",
        "fpl": "יִדְחֲפוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lidchof"
    ]
  },
  {
    "id": "haavara_al_midotav",
    "infinitive": "להעביר מישהו על מידותיו",
    "english": "to make someone lose their temper",
    "verb": "להעביר",
    "root": "ע.ב.ר",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "מידות",
    "suffix_preposition": "על",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הרעש הזה מעביר אותי על מידותיי",
    "negated": false,
    "literal_sg": "{s} carries {o} past {p} measures",
    "literal_pl": "{s} carry {o} past {p} measures",
    "literal_past": "{s} carried {o} past {p} measures",
    "literal_future": "{s} will carry {o} past {p} measures",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "על מידותיי",
      "2msg": "על מידותיך",
      "2fsg": "על מידותייך",
      "3msg": "על מידותיו",
      "3fsg": "על מידותיה",
      "1pl": "על מידותינו",
      "2mpl": "על מידותיכם",
      "2fpl": "על מידותיכן",
      "3mpl": "על מידותיהם",
      "3fpl": "על מידותיהן"
    },
    "conjugations": {
      "present": {
        "msg": "מעביר",
        "fsg": "מעבירה",
        "mpl": "מעבירים",
        "fpl": "מעבירות"
      },
      "past": {
        "msg": "העביר",
        "fsg": "העבירה",
        "mpl": "העבירו",
        "fpl": "העבירו"
      },
      "future": {
        "msg": "יעביר",
        "fsg": "תעביר",
        "mpl": "יעבירו",
        "fpl": "יעבירו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲבִיר",
        "fsg": "מַעֲבִירָה",
        "mpl": "מַעֲבִירִים",
        "fpl": "מַעֲבִירוֹת"
      },
      "past": {
        "msg": "הֶעֱבִיר",
        "fsg": "הֶעֱבִירָה",
        "mpl": "הֶעֱבִירוּ",
        "fpl": "הֶעֱבִירוּ"
      },
      "future": {
        "msg": "יַעֲבִיר",
        "fsg": "תַּעֲבִיר",
        "mpl": "יַעֲבִירוּ",
        "fpl": "יַעֲבִירוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "עַל מִדּוֹתַי",
      "2msg": "עַל מִדּוֹתֶיךָ",
      "2fsg": "עַל מִדּוֹתַיִךְ",
      "3msg": "עַל מִדּוֹתָיו",
      "3fsg": "עַל מִדּוֹתֶיהָ",
      "1pl": "עַל מִדּוֹתֵינוּ",
      "2mpl": "עַל מִדּוֹתֵיכֶם",
      "2fpl": "עַל מִדּוֹתֵיכֶן",
      "3mpl": "עַל מִדּוֹתֵיהֶם",
      "3fpl": "עַל מִדּוֹתֵיהֶן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaavir"
    ]
  },
  {
    "id": "hotzaa_migidro",
    "infinitive": "להוציא מישהו מגדרו",
    "english": "to make someone beside themselves",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "גדר",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "החדשות הוציאו אותו מגדרו",
    "negated": false,
    "literal_sg": "{s} takes {o} out of {p} bounds",
    "literal_pl": "{s} take {o} out of {p} bounds",
    "literal_past": "{s} took {o} out of {p} bounds",
    "literal_future": "{s} will take {o} out of {p} bounds",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "מגדרי",
      "2msg": "מגדרך",
      "2fsg": "מגדרך",
      "3msg": "מגדרו",
      "3fsg": "מגדרה",
      "1pl": "מגדרנו",
      "2mpl": "מגדרכם",
      "2fpl": "מגדרכן",
      "3mpl": "מגדרם",
      "3fpl": "מגדרן"
    },
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מִגִּדְרִי",
      "2msg": "מִגִּדְרְךָ",
      "2fsg": "מִגִּדְרֵךְ",
      "3msg": "מִגִּדְרוֹ",
      "3fsg": "מִגִּדְרָהּ",
      "1pl": "מִגִּדְרֵנוּ",
      "2mpl": "מִגִּדְרְכֶם",
      "2fpl": "מִגִּדְרְכֶן",
      "3mpl": "מִגִּדְרָם",
      "3fpl": "מִגִּדְרָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "hotzaa_meashtonotav",
    "infinitive": "להוציא מישהו מעשתונותיו",
    "english": "to make someone lose their composure",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "עשתונות",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הלחץ הוציא אותה מעשתונותיה",
    "negated": false,
    "literal_sg": "{s} takes {o} out of {p} wits",
    "literal_pl": "{s} take {o} out of {p} wits",
    "literal_past": "{s} took {o} out of {p} wits",
    "literal_future": "{s} will take {o} out of {p} wits",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "מעשתונותיי",
      "2msg": "מעשתונותיך",
      "2fsg": "מעשתונותייך",
      "3msg": "מעשתונותיו",
      "3fsg": "מעשתונותיה",
      "1pl": "מעשתונותינו",
      "2mpl": "מעשתונותיכם",
      "2fpl": "מעשתונותיכן",
      "3mpl": "מעשתונותיהם",
      "3fpl": "מעשתונותיהן"
    },
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מֵעֶשְׁתּוֹנוֹתַי",
      "2msg": "מֵעֶשְׁתּוֹנוֹתֶיךָ",
      "2fsg": "מֵעֶשְׁתּוֹנוֹתַיִךְ",
      "3msg": "מֵעֶשְׁתּוֹנוֹתָיו",
      "3fsg": "מֵעֶשְׁתּוֹנוֹתֶיהָ",
      "1pl": "מֵעֶשְׁתּוֹנוֹתֵינוּ",
      "2mpl": "מֵעֶשְׁתּוֹנוֹתֵיכֶם",
      "2fpl": "מֵעֶשְׁתּוֹנוֹתֵיכֶן",
      "3mpl": "מֵעֶשְׁתּוֹנוֹתֵיהֶם",
      "3fpl": "מֵעֶשְׁתּוֹנוֹתֵיהֶן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "haamada_al_tivo",
    "infinitive": "להעמיד מישהו על טיבו",
    "english": "to size someone up for what they are",
    "verb": "להעמיד",
    "root": "ע.מ.ד",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "טיב",
    "suffix_preposition": "על",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "הפגישה הראשונה העמידה אותי על טיבו",
    "negated": false,
    "literal_sg": "{s} stands {o} on {p} quality",
    "literal_pl": "{s} stand {o} on {p} quality",
    "literal_past": "{s} stood {o} on {p} quality",
    "literal_future": "{s} will stand {o} on {p} quality",
    "showMeaning": true,
    "suffix_forms": {
      "1sg": "על טיבי",
      "2msg": "על טיבך",
      "2fsg": "על טיבך",
      "3msg": "על טיבו",
      "3fsg": "על טיבה",
      "1pl": "על טיבנו",
      "2mpl": "על טיבכם",
      "2fpl": "על טיבכן",
      "3mpl": "על טיבם",
      "3fpl": "על טיבן"
    },
    "conjugations": {
      "present": {
        "msg": "מעמיד",
        "fsg": "מעמידה",
        "mpl": "מעמידים",
        "fpl": "מעמידות"
      },
      "past": {
        "msg": "העמיד",
        "fsg": "העמידה",
        "mpl": "העמידו",
        "fpl": "העמידו"
      },
      "future": {
        "msg": "יעמיד",
        "fsg": "תעמיד",
        "mpl": "יעמידו",
        "fpl": "יעמידו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲמִיד",
        "fsg": "מַעֲמִידָה",
        "mpl": "מַעֲמִידִים",
        "fpl": "מַעֲמִידוֹת"
      },
      "past": {
        "msg": "הֶעֱמִיד",
        "fsg": "הֶעֱמִידָה",
        "mpl": "הֶעֱמִידוּ",
        "fpl": "הֶעֱמִידוּ"
      },
      "future": {
        "msg": "יַעֲמִיד",
        "fsg": "תַּעֲמִיד",
        "mpl": "יַעֲמִידוּ",
        "fpl": "יַעֲמִידוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "עַל טִיבִי",
      "2msg": "עַל טִיבְךָ",
      "2fsg": "עַל טִיבֵךְ",
      "3msg": "עַל טִיבוֹ",
      "3fsg": "עַל טִיבָהּ",
      "1pl": "עַל טִיבֵנוּ",
      "2mpl": "עַל טִיבְכֶם",
      "2fpl": "עַל טִיבְכֶן",
      "3mpl": "עַל טִיבָם",
      "3fpl": "עַל טִיבָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaamid"
    ]
  },
  {
    "id": "kilkul_teavon",
    "infinitive": "לקלקל למישהו את התיאבון",
    "english": "to ruin someone's appetite",
    "verb": "לקלקל",
    "root": "ק.ל.ק.ל",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "את התיאבון",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את התיאבון",
    "example": "אתה מקלקל לי את התיאבון",
    "negated": false,
    "literal_sg": "{s} ruins {p} appetite",
    "literal_pl": "{s} ruin {p} appetite",
    "literal_past": "{s} ruined {p} appetite",
    "literal_future": "{s} will ruin {p} appetite",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מקלקל",
        "fsg": "מקלקלת",
        "mpl": "מקלקלים",
        "fpl": "מקלקלות"
      },
      "past": {
        "msg": "קילקל",
        "fsg": "קילקלה",
        "mpl": "קילקלו",
        "fpl": "קילקלו"
      },
      "future": {
        "msg": "יקלקל",
        "fsg": "תקלקל",
        "mpl": "יקלקלו",
        "fpl": "יקלקלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְקַלְקֵל",
        "fsg": "מְקַלְקֶלֶת",
        "mpl": "מְקַלְקְלִים",
        "fpl": "מְקַלְקְלוֹת"
      },
      "past": {
        "msg": "קִלְקֵל",
        "fsg": "קִלְקְלָה",
        "mpl": "קִלְקְלוּ",
        "fpl": "קִלְקְלוּ"
      },
      "future": {
        "msg": "יְקַלְקֵל",
        "fsg": "תְּקַלְקֵל",
        "mpl": "יְקַלְקְלוּ",
        "fpl": "יְקַלְקְלוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַתֵּאָבוֹן",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lekalkel"
    ]
  },
  {
    "id": "hotzaat_einayim",
    "infinitive": "להוציא למישהו את העיניים",
    "english": "to make someone envious / rub it in",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "l_dative",
    "fixed_object": "את העיניים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את העיניים",
    "example": "הם מוציאים לי את העיניים",
    "negated": false,
    "literal_sg": "{s} takes out {p} eyes",
    "literal_pl": "{s} take out {p} eyes",
    "literal_past": "{s} took out {p} eyes",
    "literal_future": "{s} will take out {p} eyes",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָעֵינַיִם",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "mechirat_lokshim",
    "infinitive": "למכור למישהו לוקשים",
    "english": "to feed someone a line / spin someone lies",
    "verb": "למכור",
    "root": "מ.כ.ר",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "לוקשים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ לוקשים",
    "example": "אל תמכור לי לוקשים",
    "negated": false,
    "literal_sg": "{s} sells {o} noodles",
    "literal_pl": "{s} sell {o} noodles",
    "literal_past": "{s} sold {o} noodles",
    "literal_future": "{s} will sell {o} noodles",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוכר",
        "fsg": "מוכרת",
        "mpl": "מוכרים",
        "fpl": "מוכרות"
      },
      "past": {
        "msg": "מכר",
        "fsg": "מכרה",
        "mpl": "מכרו",
        "fpl": "מכרו"
      },
      "future": {
        "msg": "ימכור",
        "fsg": "תמכור",
        "mpl": "ימכרו",
        "fpl": "ימכרו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹכֵר",
        "fsg": "מוֹכֶרֶת",
        "mpl": "מוֹכְרִים",
        "fpl": "מוֹכְרוֹת"
      },
      "past": {
        "msg": "מָכַר",
        "fsg": "מָכְרָה",
        "mpl": "מָכְרוּ",
        "fpl": "מָכְרוּ"
      },
      "future": {
        "msg": "יִמְכּוֹר",
        "fsg": "תִּמְכּוֹר",
        "mpl": "יִמְכְּרוּ",
        "fpl": "יִמְכְּרוּ"
      }
    },
    "fixed_object_niqqud": "לוֹקְשִׁים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-limkor"
    ]
  },
  {
    "id": "sipur_sipurim",
    "infinitive": "לספר למישהו סיפורים",
    "english": "to feed someone nonsense",
    "verb": "לספר",
    "root": "ס.פ.ר",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "סיפורים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ סיפורים",
    "example": "אל תספר לי סיפורים",
    "negated": false,
    "literal_sg": "{s} tells {o} stories",
    "literal_pl": "{s} tell {o} stories",
    "literal_past": "{s} told {o} stories",
    "literal_future": "{s} will tell {o} stories",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מספר",
        "fsg": "מספרת",
        "mpl": "מספרים",
        "fpl": "מספרות"
      },
      "past": {
        "msg": "סיפר",
        "fsg": "סיפרה",
        "mpl": "סיפרו",
        "fpl": "סיפרו"
      },
      "future": {
        "msg": "יספר",
        "fsg": "תספר",
        "mpl": "יספרו",
        "fpl": "יספרו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְסַפֵּר",
        "fsg": "מְסַפֶּרֶת",
        "mpl": "מְסַפְּרִים",
        "fpl": "מְסַפְּרוֹת"
      },
      "past": {
        "msg": "סִפֵּר",
        "fsg": "סִפְּרָה",
        "mpl": "סִפְּרוּ",
        "fpl": "סִפְּרוּ"
      },
      "future": {
        "msg": "יְסַפֵּר",
        "fsg": "תְּסַפֵּר",
        "mpl": "יְסַפְּרוּ",
        "fpl": "יְסַפְּרוּ"
      }
    },
    "fixed_object_niqqud": "סִפּוּרִים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-lesaper"
    ]
  },
  {
    "id": "yetziat_meaf",
    "infinitive": "לצאת למישהו מהאף",
    "english": "to be sick and tired of something",
    "verb": "לצאת",
    "root": "י.צ.א",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "מהאף",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ מהאף",
    "example": "הפרויקט הזה יוצא לי מהאף",
    "negated": false,
    "literal_sg": "{s} comes out of {p} nose",
    "literal_pl": "{s} come out of {p} nose",
    "literal_past": "{s} came out of {p} nose",
    "literal_future": "{s} will come out of {p} nose",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "יוצא",
        "fsg": "יוצאת",
        "mpl": "יוצאים",
        "fpl": "יוצאות"
      },
      "past": {
        "msg": "יצא",
        "fsg": "יצאה",
        "mpl": "יצאו",
        "fpl": "יצאו"
      },
      "future": {
        "msg": "יצא",
        "fsg": "תצא",
        "mpl": "יצאו",
        "fpl": "יצאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "יוֹצֵא",
        "fsg": "יוֹצֵאת",
        "mpl": "יוֹצְאִים",
        "fpl": "יוֹצְאוֹת"
      },
      "past": {
        "msg": "יָצָא",
        "fsg": "יָצְאָה",
        "mpl": "יָצְאוּ",
        "fpl": "יָצְאוּ"
      },
      "future": {
        "msg": "יֵצֵא",
        "fsg": "תֵּצֵא",
        "mpl": "יֵצְאוּ",
        "fpl": "יֵצְאוּ"
      }
    },
    "fixed_object_niqqud": "מֵהָאַף",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-latzet"
    ]
  },
  {
    "id": "aliyat_larosh",
    "infinitive": "לעלות למישהו לראש",
    "english": "to go to someone's head",
    "verb": "לעלות",
    "root": "ע.ל.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "לראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ לראש",
    "example": "ההצלחה עלתה לו לראש",
    "negated": false,
    "literal_sg": "{s} goes up to {p} head",
    "literal_pl": "{s} go up to {p} head",
    "literal_past": "{s} went up to {p} head",
    "literal_future": "{s} will go up to {p} head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "עולה",
        "fsg": "עולה",
        "mpl": "עולים",
        "fpl": "עולות"
      },
      "past": {
        "msg": "עלה",
        "fsg": "עלתה",
        "mpl": "עלו",
        "fpl": "עלו"
      },
      "future": {
        "msg": "יעלה",
        "fsg": "תעלה",
        "mpl": "יעלו",
        "fpl": "יעלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹלֶה",
        "fsg": "עוֹלָה",
        "mpl": "עוֹלִים",
        "fpl": "עוֹלוֹת"
      },
      "past": {
        "msg": "עָלָה",
        "fsg": "עָלְתָה",
        "mpl": "עָלוּ",
        "fpl": "עָלוּ"
      },
      "future": {
        "msg": "יַעֲלֶה",
        "fsg": "תַּעֲלֶה",
        "mpl": "יַעֲלוּ",
        "fpl": "יַעֲלוּ"
      }
    },
    "fixed_object_niqqud": "לָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laalot"
    ]
  },
  {
    "id": "ptihat_harosh",
    "infinitive": "לפתוח למישהו את הראש",
    "english": "to broaden someone's mind",
    "verb": "לפתוח",
    "root": "פ.ת.ח",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את הראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את הראש",
    "example": "הטיול פתח לי את הראש",
    "negated": false,
    "literal_sg": "{s} opens {p} head",
    "literal_pl": "{s} open {p} head",
    "literal_past": "{s} opened {p} head",
    "literal_future": "{s} will open {p} head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "פותח",
        "fsg": "פותחת",
        "mpl": "פותחים",
        "fpl": "פותחות"
      },
      "past": {
        "msg": "פתח",
        "fsg": "פתחה",
        "mpl": "פתחו",
        "fpl": "פתחו"
      },
      "future": {
        "msg": "יפתח",
        "fsg": "תפתח",
        "mpl": "יפתחו",
        "fpl": "יפתחו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "פּוֹתֵחַ",
        "fsg": "פּוֹתַחַת",
        "mpl": "פּוֹתְחִים",
        "fpl": "פּוֹתְחוֹת"
      },
      "past": {
        "msg": "פָּתַח",
        "fsg": "פָּתְחָה",
        "mpl": "פָּתְחוּ",
        "fpl": "פָּתְחוּ"
      },
      "future": {
        "msg": "יִפְתַּח",
        "fsg": "תִּפְתַּח",
        "mpl": "יִפְתְּחוּ",
        "fpl": "יִפְתְּחוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-liftoach"
    ]
  },
  {
    "id": "simat_maklot",
    "infinitive": "לשים למישהו מקלות בגלגלים",
    "english": "to throw a wrench in someone's works",
    "verb": "לשים",
    "root": "ש.י.ם",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "מקלות בגלגלים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ מקלות בגלגלים",
    "example": "הוא שם לי מקלות בגלגלים",
    "negated": false,
    "literal_sg": "{s} puts sticks in {p} wheels",
    "literal_pl": "{s} put sticks in {p} wheels",
    "literal_past": "{s} put sticks in {p} wheels",
    "literal_future": "{s} will put sticks in {p} wheels",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "שם",
        "fsg": "שמה",
        "mpl": "שמים",
        "fpl": "שמות"
      },
      "past": {
        "msg": "שם",
        "fsg": "שמה",
        "mpl": "שמו",
        "fpl": "שמו"
      },
      "future": {
        "msg": "ישים",
        "fsg": "תשים",
        "mpl": "ישימו",
        "fpl": "ישימו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "שָׂם",
        "fsg": "שָׂמָה",
        "mpl": "שָׂמִים",
        "fpl": "שָׂמוֹת"
      },
      "past": {
        "msg": "שָׂם",
        "fsg": "שָׂמָה",
        "mpl": "שָׂמוּ",
        "fpl": "שָׂמוּ"
      },
      "future": {
        "msg": "יָשִׂים",
        "fsg": "תָּשִׂים",
        "mpl": "יָשִׂימוּ",
        "fpl": "יָשִׂימוּ"
      }
    },
    "fixed_object_niqqud": "מַקְלוֹת בַּגַּלְגַּלִּים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lasim"
    ]
  },
  {
    "id": "yeshivat_al_harosh",
    "infinitive": "לשבת למישהו על הראש",
    "english": "to hound someone / breathe down someone's neck",
    "verb": "לשבת",
    "root": "י.ש.ב",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "על הראש",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ על הראש",
    "example": "המנהל יושב לי על הראש",
    "negated": false,
    "literal_sg": "{s} sits on {p} head",
    "literal_pl": "{s} sit on {p} head",
    "literal_past": "{s} sat on {p} head",
    "literal_future": "{s} will sit on {p} head",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "יושב",
        "fsg": "יושבת",
        "mpl": "יושבים",
        "fpl": "יושבות"
      },
      "past": {
        "msg": "ישב",
        "fsg": "ישבה",
        "mpl": "ישבו",
        "fpl": "ישבו"
      },
      "future": {
        "msg": "ישב",
        "fsg": "תשב",
        "mpl": "ישבו",
        "fpl": "ישבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "יוֹשֵׁב",
        "fsg": "יוֹשֶׁבֶת",
        "mpl": "יוֹשְׁבִים",
        "fpl": "יוֹשְׁבוֹת"
      },
      "past": {
        "msg": "יָשַׁב",
        "fsg": "יָשְׁבָה",
        "mpl": "יָשְׁבוּ",
        "fpl": "יָשְׁבוּ"
      },
      "future": {
        "msg": "יֵשֵׁב",
        "fsg": "תֵּשֵׁב",
        "mpl": "יֵשְׁבוּ",
        "fpl": "יֵשְׁבוּ"
      }
    },
    "fixed_object_niqqud": "עַל הָרֹאשׁ",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lashevet"
    ]
  },
  {
    "id": "yeridat_lachaim",
    "infinitive": "לרדת למישהו לחיים",
    "english": "to make someone's life miserable",
    "verb": "לרדת",
    "root": "י.ר.ד",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "לחיים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ לחיים",
    "example": "הם יורדים לו לחיים",
    "negated": false,
    "literal_sg": "{s} comes down on {p} life",
    "literal_pl": "{s} come down on {p} life",
    "literal_past": "{s} came down on {p} life",
    "literal_future": "{s} will come down on {p} life",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "יורד",
        "fsg": "יורדת",
        "mpl": "יורדים",
        "fpl": "יורדות"
      },
      "past": {
        "msg": "ירד",
        "fsg": "ירדה",
        "mpl": "ירדו",
        "fpl": "ירדו"
      },
      "future": {
        "msg": "ירד",
        "fsg": "תרד",
        "mpl": "ירדו",
        "fpl": "ירדו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "יוֹרֵד",
        "fsg": "יוֹרֶדֶת",
        "mpl": "יוֹרְדִים",
        "fpl": "יוֹרְדוֹת"
      },
      "past": {
        "msg": "יָרַד",
        "fsg": "יָרְדָה",
        "mpl": "יָרְדוּ",
        "fpl": "יָרְדוּ"
      },
      "future": {
        "msg": "יֵרֵד",
        "fsg": "תֵּרֵד",
        "mpl": "יֵרְדוּ",
        "fpl": "יֵרְדוּ"
      }
    },
    "fixed_object_niqqud": "לַחַיִּים",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laredet"
    ]
  },
  {
    "id": "defikat_hayom",
    "infinitive": "לדפוק למישהו את היום",
    "english": "to ruin someone's day",
    "verb": "לדפוק",
    "root": "ד.פ.ק",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "את היום",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ את היום",
    "example": "החדשות דפקו לי את היום",
    "negated": false,
    "literal_sg": "{s} bangs up {p} day",
    "literal_pl": "{s} bang up {p} day",
    "literal_past": "{s} banged up {p} day",
    "literal_future": "{s} will bang up {p} day",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "דופק",
        "fsg": "דופקת",
        "mpl": "דופקים",
        "fpl": "דופקות"
      },
      "past": {
        "msg": "דפק",
        "fsg": "דפקה",
        "mpl": "דפקו",
        "fpl": "דפקו"
      },
      "future": {
        "msg": "ידפוק",
        "fsg": "תדפוק",
        "mpl": "ידפקו",
        "fpl": "ידפקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "דּוֹפֵק",
        "fsg": "דּוֹפֶקֶת",
        "mpl": "דּוֹפְקִים",
        "fpl": "דּוֹפְקוֹת"
      },
      "past": {
        "msg": "דָּפַק",
        "fsg": "דָּפְקָה",
        "mpl": "דָּפְקוּ",
        "fpl": "דָּפְקוּ"
      },
      "future": {
        "msg": "יִדְפֹּק",
        "fsg": "תִּדְפֹּק",
        "mpl": "יִדְפְּקוּ",
        "fpl": "יִדְפְּקוּ"
      }
    },
    "fixed_object_niqqud": "אֶת הַיּוֹם",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lidfok"
    ]
  },
  {
    "id": "sechok_layadayim",
    "infinitive": "לשחק למישהו לידיים",
    "english": "to play into someone's hands",
    "verb": "לשחק",
    "root": "ש.ח.ק",
    "binyan": "piel",
    "object_type": "l_dative",
    "fixed_object": "לידיים",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ לידיים",
    "example": "העיכוב משחק לו לידיים",
    "negated": false,
    "literal_sg": "{s} plays into {p} hands",
    "literal_pl": "{s} play into {p} hands",
    "literal_past": "{s} played into {p} hands",
    "literal_future": "{s} will play into {p} hands",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "משחק",
        "fsg": "משחקת",
        "mpl": "משחקים",
        "fpl": "משחקות"
      },
      "past": {
        "msg": "שיחק",
        "fsg": "שיחקה",
        "mpl": "שיחקו",
        "fpl": "שיחקו"
      },
      "future": {
        "msg": "ישחק",
        "fsg": "תשחק",
        "mpl": "ישחקו",
        "fpl": "ישחקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְשַׂחֵק",
        "fsg": "מְשַׂחֶקֶת",
        "mpl": "מְשַׂחֲקִים",
        "fpl": "מְשַׂחֲקוֹת"
      },
      "past": {
        "msg": "שִׂיחֵק",
        "fsg": "שִׂיחֲקָה",
        "mpl": "שִׂיחֲקוּ",
        "fpl": "שִׂיחֲקוּ"
      },
      "future": {
        "msg": "יְשַׂחֵק",
        "fsg": "תְּשַׂחֵק",
        "mpl": "יְשַׂחֲקוּ",
        "fpl": "יְשַׂחֲקוּ"
      }
    },
    "fixed_object_niqqud": "לַיָּדַיִם",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lesachek"
    ]
  },
  {
    "id": "asiyat_hanacha",
    "infinitive": "לעשות למישהו הנחה",
    "english": "to cut someone some slack",
    "verb": "לעשות",
    "root": "ע.שׂ.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "הנחה",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ הנחה",
    "example": "תעשה לי הנחה, זה היום הראשון שלי",
    "negated": false,
    "literal_sg": "{s} gives {o} a discount",
    "literal_pl": "{s} give {o} a discount",
    "literal_past": "{s} gave {o} a discount",
    "literal_future": "{s} will give {o} a discount",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "הֲנָחָה",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laasot"
    ]
  },
  {
    "id": "asiyat_bushot",
    "infinitive": "לעשות למישהו בושות",
    "english": "to embarrass someone in public",
    "verb": "לעשות",
    "root": "ע.שׂ.ה",
    "binyan": "paal",
    "object_type": "l_dative",
    "fixed_object": "בושות",
    "template": "⟨VERB⟩ ⟨L_OBJ⟩ בושות",
    "example": "עשית לי בושות מול כולם",
    "negated": false,
    "literal_sg": "{s} makes embarrassments for {o}",
    "literal_pl": "{s} make embarrassments for {o}",
    "literal_past": "{s} made embarrassments for {o}",
    "literal_future": "{s} will make embarrassments for {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "עושה",
        "fsg": "עושה",
        "mpl": "עושים",
        "fpl": "עושות"
      },
      "past": {
        "msg": "עשה",
        "fsg": "עשתה",
        "mpl": "עשו",
        "fpl": "עשו"
      },
      "future": {
        "msg": "יעשה",
        "fsg": "תעשה",
        "mpl": "יעשו",
        "fpl": "יעשו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "עוֹשֶׂה",
        "fsg": "עוֹשָׂה",
        "mpl": "עוֹשִׂים",
        "fpl": "עוֹשׂוֹת"
      },
      "past": {
        "msg": "עָשָׂה",
        "fsg": "עָשְׂתָה",
        "mpl": "עָשׂוּ",
        "fpl": "עָשׂוּ"
      },
      "future": {
        "msg": "יַעֲשֶׂה",
        "fsg": "תַּעֲשֶׂה",
        "mpl": "יַעֲשׂוּ",
        "fpl": "יַעֲשׂוּ"
      }
    },
    "fixed_object_niqqud": "בּוּשׁוֹת",
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-laasot"
    ]
  },
  {
    "id": "klitat_mishehu",
    "infinitive": "לקלוט מישהו",
    "english": "to read / get someone",
    "verb": "לקלוט",
    "root": "ק.ל.ט",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "אני קולט אותך",
    "negated": false,
    "literal_sg": "{s} picks {o} up",
    "literal_pl": "{s} pick {o} up",
    "literal_past": "{s} picked {o} up",
    "literal_future": "{s} will pick {o} up",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "קולט",
        "fsg": "קולטת",
        "mpl": "קולטים",
        "fpl": "קולטות"
      },
      "past": {
        "msg": "קלט",
        "fsg": "קלטה",
        "mpl": "קלטו",
        "fpl": "קלטו"
      },
      "future": {
        "msg": "יקלוט",
        "fsg": "תקלוט",
        "mpl": "יקלטו",
        "fpl": "יקלטו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "קוֹלֵט",
        "fsg": "קוֹלֶטֶת",
        "mpl": "קוֹלְטִים",
        "fpl": "קוֹלְטוֹת"
      },
      "past": {
        "msg": "קָלַט",
        "fsg": "קָלְטָה",
        "mpl": "קָלְטוּ",
        "fpl": "קָלְטוּ"
      },
      "future": {
        "msg": "יִקְלוֹט",
        "fsg": "תִּקְלוֹט",
        "mpl": "יִקְלְטוּ",
        "fpl": "יִקְלְטוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#character-verb-liklot"
    ]
  },
  {
    "id": "mechikat_mishehu",
    "infinitive": "למחוק מישהו",
    "english": "to wipe the floor with someone",
    "verb": "למחוק",
    "root": "מ.ח.ק",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הם מחקו אותנו במשחק",
    "negated": false,
    "literal_sg": "{s} erases {o}",
    "literal_pl": "{s} erase {o}",
    "literal_past": "{s} erased {o}",
    "literal_future": "{s} will erase {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מוחק",
        "fsg": "מוחקת",
        "mpl": "מוחקים",
        "fpl": "מוחקות"
      },
      "past": {
        "msg": "מחק",
        "fsg": "מחקה",
        "mpl": "מחקו",
        "fpl": "מחקו"
      },
      "future": {
        "msg": "ימחק",
        "fsg": "תמחק",
        "mpl": "ימחקו",
        "fpl": "ימחקו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹחֵק",
        "fsg": "מוֹחֶקֶת",
        "mpl": "מוֹחֲקִים",
        "fpl": "מוֹחֲקוֹת"
      },
      "past": {
        "msg": "מָחַק",
        "fsg": "מָחֲקָה",
        "mpl": "מָחֲקוּ",
        "fpl": "מָחֲקוּ"
      },
      "future": {
        "msg": "יִמְחַק",
        "fsg": "תִּמְחַק",
        "mpl": "יִמְחֲקוּ",
        "fpl": "יִמְחֲקוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#technology-verb-limchok"
    ]
  },
  {
    "id": "harisat_mishehu",
    "infinitive": "להרוס מישהו",
    "english": "to devastate someone",
    "verb": "להרוס",
    "root": "ה.ר.ס",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הסרט הזה הרס אותי",
    "negated": false,
    "literal_sg": "{s} destroys {o}",
    "literal_pl": "{s} destroy {o}",
    "literal_past": "{s} destroyed {o}",
    "literal_future": "{s} will destroy {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "הורס",
        "fsg": "הורסת",
        "mpl": "הורסים",
        "fpl": "הורסות"
      },
      "past": {
        "msg": "הרס",
        "fsg": "הרסה",
        "mpl": "הרסו",
        "fpl": "הרסו"
      },
      "future": {
        "msg": "יהרוס",
        "fsg": "תהרוס",
        "mpl": "יהרסו",
        "fpl": "יהרסו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "הוֹרֵס",
        "fsg": "הוֹרֶסֶת",
        "mpl": "הוֹרְסִים",
        "fpl": "הוֹרְסוֹת"
      },
      "past": {
        "msg": "הָרַס",
        "fsg": "הָרְסָה",
        "mpl": "הָרְסוּ",
        "fpl": "הָרְסוּ"
      },
      "future": {
        "msg": "יַהֲרוֹס",
        "fsg": "תַּהֲרוֹס",
        "mpl": "יַהַרְסוּ",
        "fpl": "יַהַרְסוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-laharos"
    ]
  },
  {
    "id": "kibui_mishehu",
    "infinitive": "לכבות מישהו",
    "english": "to turn someone off",
    "verb": "לכבות",
    "root": "כ.ב.ה",
    "binyan": "piel",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הסגנון שלו מכבה אותי",
    "negated": false,
    "literal_sg": "{s} switches {o} off",
    "literal_pl": "{s} switch {o} off",
    "literal_past": "{s} switched {o} off",
    "literal_future": "{s} will switch {o} off",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מכבה",
        "fsg": "מכבה",
        "mpl": "מכבים",
        "fpl": "מכבות"
      },
      "past": {
        "msg": "כיבה",
        "fsg": "כיבתה",
        "mpl": "כיבו",
        "fpl": "כיבו"
      },
      "future": {
        "msg": "יכבה",
        "fsg": "תכבה",
        "mpl": "יכבו",
        "fpl": "יכבו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מְכַבֶּה",
        "fsg": "מְכַבָּה",
        "mpl": "מְכַבִּים",
        "fpl": "מְכַבּוֹת"
      },
      "past": {
        "msg": "כִּבָּה",
        "fsg": "כִּבְּתָה",
        "mpl": "כִּבּוּ",
        "fpl": "כִּבּוּ"
      },
      "future": {
        "msg": "יְכַבֶּה",
        "fsg": "תְּכַבֶּה",
        "mpl": "יְכַבּוּ",
        "fpl": "יְכַבּוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-lekhabot"
    ]
  },
  {
    "id": "kniyat_mishehu",
    "infinitive": "לקנות מישהו",
    "english": "to win someone over",
    "verb": "לקנות",
    "root": "ק.נ.ה",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הוא קנה אותי במשפט הראשון",
    "negated": false,
    "literal_sg": "{s} buys {o}",
    "literal_pl": "{s} buy {o}",
    "literal_past": "{s} bought {o}",
    "literal_future": "{s} will buy {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "קונה",
        "fsg": "קונה",
        "mpl": "קונים",
        "fpl": "קונות"
      },
      "past": {
        "msg": "קנה",
        "fsg": "קנתה",
        "mpl": "קנו",
        "fpl": "קנו"
      },
      "future": {
        "msg": "יקנה",
        "fsg": "תקנה",
        "mpl": "יקנו",
        "fpl": "יקנו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "קוֹנֶה",
        "fsg": "קוֹנָה",
        "mpl": "קוֹנִים",
        "fpl": "קוֹנוֹת"
      },
      "past": {
        "msg": "קָנָה",
        "fsg": "קָנְתָה",
        "mpl": "קָנוּ",
        "fpl": "קָנוּ"
      },
      "future": {
        "msg": "יִקְנֶה",
        "fsg": "תִּקְנֶה",
        "mpl": "יִקְנוּ",
        "fpl": "יִקְנוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#common-verb-liknot"
    ]
  },
  {
    "id": "achilat_mishehu",
    "infinitive": "לאכול מישהו",
    "english": "to eat away at someone",
    "verb": "לאכול",
    "root": "א.כ.ל",
    "binyan": "paal",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "מה אוכל אותך?",
    "negated": false,
    "literal_sg": "{s} eats {o}",
    "literal_pl": "{s} eat {o}",
    "literal_past": "{s} ate {o}",
    "literal_future": "{s} will eat {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "אוכל",
        "fsg": "אוכלת",
        "mpl": "אוכלים",
        "fpl": "אוכלות"
      },
      "past": {
        "msg": "אכל",
        "fsg": "אכלה",
        "mpl": "אכלו",
        "fpl": "אכלו"
      },
      "future": {
        "msg": "יאכל",
        "fsg": "תאכל",
        "mpl": "יאכלו",
        "fpl": "יאכלו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "אוֹכֵל",
        "fsg": "אוֹכֶלֶת",
        "mpl": "אוֹכְלִים",
        "fpl": "אוֹכְלוֹת"
      },
      "past": {
        "msg": "אָכַל",
        "fsg": "אָכְלָה",
        "mpl": "אָכְלוּ",
        "fpl": "אָכְלוּ"
      },
      "future": {
        "msg": "יֹאכַל",
        "fsg": "תֹּאכַל",
        "mpl": "יֹאכְלוּ",
        "fpl": "יֹאכְלוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#starter-verb-leechol"
    ]
  },
  {
    "id": "hapalat_mishehu",
    "infinitive": "להפיל מישהו",
    "english": "to bring someone down / set someone up",
    "verb": "להפיל",
    "root": "נ.פ.ל",
    "binyan": "hifil",
    "object_type": "direct",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩",
    "example": "הם הפילו אותו בוועדה",
    "negated": false,
    "literal_sg": "{s} drops {o}",
    "literal_pl": "{s} drop {o}",
    "literal_past": "{s} dropped {o}",
    "literal_future": "{s} will drop {o}",
    "showMeaning": true,
    "conjugations": {
      "present": {
        "msg": "מפיל",
        "fsg": "מפילה",
        "mpl": "מפילים",
        "fpl": "מפילות"
      },
      "past": {
        "msg": "הפיל",
        "fsg": "הפילה",
        "mpl": "הפילו",
        "fpl": "הפילו"
      },
      "future": {
        "msg": "יפיל",
        "fsg": "תפיל",
        "mpl": "יפילו",
        "fpl": "יפילו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַפִּיל",
        "fsg": "מַפִּילָה",
        "mpl": "מַפִּילִים",
        "fpl": "מַפִּילוֹת"
      },
      "past": {
        "msg": "הִפִּיל",
        "fsg": "הִפִּילָה",
        "mpl": "הִפִּילוּ",
        "fpl": "הִפִּילוּ"
      },
      "future": {
        "msg": "יַפִּיל",
        "fsg": "תַּפִּיל",
        "mpl": "יַפִּילוּ",
        "fpl": "יַפִּילוּ"
      }
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehapil"
    ]
  },
  {
    "id": "hatzalat_meatzmo",
    "infinitive": "להציל מישהו מעצמו",
    "english": "to save someone from themselves",
    "verb": "להציל",
    "root": "נ.צ.ל",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "עצם",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "מישהו צריך להציל אותו מעצמו",
    "negated": false,
    "literal_sg": "{s} saves {o} from {p} own self",
    "literal_pl": "{s} save {o} from {p} own self",
    "literal_past": "{s} saved {o} from {p} own self",
    "literal_future": "{s} will save {o} from {p} own self",
    "showMeaning": false,
    "suffix_forms": {
      "1sg": "מעצמי",
      "2msg": "מעצמך",
      "2fsg": "מעצמך",
      "3msg": "מעצמו",
      "3fsg": "מעצמה",
      "1pl": "מעצמנו",
      "2mpl": "מעצמכם",
      "2fpl": "מעצמכן",
      "3mpl": "מעצמם",
      "3fpl": "מעצמן"
    },
    "conjugations": {
      "present": {
        "msg": "מציל",
        "fsg": "מצילה",
        "mpl": "מצילים",
        "fpl": "מצילות"
      },
      "past": {
        "msg": "הציל",
        "fsg": "הצילה",
        "mpl": "הצילו",
        "fpl": "הצילו"
      },
      "future": {
        "msg": "יציל",
        "fsg": "תציל",
        "mpl": "יצילו",
        "fpl": "יצילו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַצִּיל",
        "fsg": "מַצִּילָה",
        "mpl": "מַצִּילִים",
        "fpl": "מַצִּילוֹת"
      },
      "past": {
        "msg": "הִצִּיל",
        "fsg": "הִצִּילָה",
        "mpl": "הִצִּילוּ",
        "fpl": "הִצִּילוּ"
      },
      "future": {
        "msg": "יַצִּיל",
        "fsg": "תַּצִּיל",
        "mpl": "יַצִּילוּ",
        "fpl": "יַצִּילוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מֵעַצְמִי",
      "2msg": "מֵעַצְמְךָ",
      "2fsg": "מֵעַצְמֵךְ",
      "3msg": "מֵעַצְמוֹ",
      "3fsg": "מֵעַצְמָהּ",
      "1pl": "מֵעַצְמֵנוּ",
      "2mpl": "מֵעַצְמְכֶם",
      "2fpl": "מֵעַצְמְכֶן",
      "3mpl": "מֵעַצְמָם",
      "3fpl": "מֵעַצְמָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehatsil"
    ]
  },
  {
    "id": "hotzaat_meizuno",
    "infinitive": "להוציא מישהו מאיזונו",
    "english": "to throw someone off balance",
    "verb": "להוציא",
    "root": "י.צ.א",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "איזון",
    "suffix_preposition": "מ",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "השאלה הזאת הוציאה אותו מאיזונו",
    "negated": false,
    "literal_sg": "{s} takes {o} out of {p} balance",
    "literal_pl": "{s} take {o} out of {p} balance",
    "literal_past": "{s} took {o} out of {p} balance",
    "literal_future": "{s} will take {o} out of {p} balance",
    "showMeaning": false,
    "suffix_forms": {
      "1sg": "מאיזוני",
      "2msg": "מאיזונך",
      "2fsg": "מאיזונך",
      "3msg": "מאיזונו",
      "3fsg": "מאיזונה",
      "1pl": "מאיזוננו",
      "2mpl": "מאיזונכם",
      "2fpl": "מאיזונכן",
      "3mpl": "מאיזונם",
      "3fpl": "מאיזונן"
    },
    "conjugations": {
      "present": {
        "msg": "מוציא",
        "fsg": "מוציאה",
        "mpl": "מוציאים",
        "fpl": "מוציאות"
      },
      "past": {
        "msg": "הוציא",
        "fsg": "הוציאה",
        "mpl": "הוציאו",
        "fpl": "הוציאו"
      },
      "future": {
        "msg": "יוציא",
        "fsg": "תוציא",
        "mpl": "יוציאו",
        "fpl": "יוציאו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מוֹצִיא",
        "fsg": "מוֹצִיאָה",
        "mpl": "מוֹצִיאִים",
        "fpl": "מוֹצִיאוֹת"
      },
      "past": {
        "msg": "הוֹצִיא",
        "fsg": "הוֹצִיאָה",
        "mpl": "הוֹצִיאוּ",
        "fpl": "הוֹצִיאוּ"
      },
      "future": {
        "msg": "יוֹצִיא",
        "fsg": "תּוֹצִיא",
        "mpl": "יוֹצִיאוּ",
        "fpl": "יוֹצִיאוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "מֵאִזּוּנִי",
      "2msg": "מֵאִזּוּנְךָ",
      "2fsg": "מֵאִזּוּנֵךְ",
      "3msg": "מֵאִזּוּנוֹ",
      "3fsg": "מֵאִזּוּנָהּ",
      "1pl": "מֵאִזּוּנֵנוּ",
      "2mpl": "מֵאִזּוּנְכֶם",
      "2fpl": "מֵאִזּוּנְכֶן",
      "3mpl": "מֵאִזּוּנָם",
      "3fpl": "מֵאִזּוּנָן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehotzi"
    ]
  },
  {
    "id": "haamadat_al_raglav",
    "infinitive": "להעמיד מישהו על רגליו",
    "english": "to get someone back on their feet",
    "verb": "להעמיד",
    "root": "ע.מ.ד",
    "binyan": "hifil",
    "object_type": "possessive_suffix",
    "suffix_noun": "רגליים",
    "suffix_preposition": "על",
    "template": "⟨VERB⟩ ⟨DIR_OBJ⟩ ⟨SUFFIX_FORM⟩",
    "example": "המשפחה העמידה אותו על רגליו",
    "negated": false,
    "literal_sg": "{s} stands {o} on {p} feet",
    "literal_pl": "{s} stand {o} on {p} feet",
    "literal_past": "{s} stood {o} on {p} feet",
    "literal_future": "{s} will stand {o} on {p} feet",
    "showMeaning": false,
    "suffix_forms": {
      "1sg": "על רגליי",
      "2msg": "על רגליך",
      "2fsg": "על רגלייך",
      "3msg": "על רגליו",
      "3fsg": "על רגליה",
      "1pl": "על רגלינו",
      "2mpl": "על רגליכם",
      "2fpl": "על רגליכן",
      "3mpl": "על רגליהם",
      "3fpl": "על רגליהן"
    },
    "conjugations": {
      "present": {
        "msg": "מעמיד",
        "fsg": "מעמידה",
        "mpl": "מעמידים",
        "fpl": "מעמידות"
      },
      "past": {
        "msg": "העמיד",
        "fsg": "העמידה",
        "mpl": "העמידו",
        "fpl": "העמידו"
      },
      "future": {
        "msg": "יעמיד",
        "fsg": "תעמיד",
        "mpl": "יעמידו",
        "fpl": "יעמידו"
      }
    },
    "conjugations_niqqud": {
      "present": {
        "msg": "מַעֲמִיד",
        "fsg": "מַעֲמִידָה",
        "mpl": "מַעֲמִידִים",
        "fpl": "מַעֲמִידוֹת"
      },
      "past": {
        "msg": "הֶעֱמִיד",
        "fsg": "הֶעֱמִידָה",
        "mpl": "הֶעֱמִידוּ",
        "fpl": "הֶעֱמִידוּ"
      },
      "future": {
        "msg": "יַעֲמִיד",
        "fsg": "תַּעֲמִיד",
        "mpl": "יַעֲמִידוּ",
        "fpl": "יַעֲמִידוּ"
      }
    },
    "suffix_forms_niqqud": {
      "1sg": "עַל רַגְלַי",
      "2msg": "עַל רַגְלֶיךָ",
      "2fsg": "עַל רַגְלַיִךְ",
      "3msg": "עַל רַגְלָיו",
      "3fsg": "עַל רַגְלֶיהָ",
      "1pl": "עַל רַגְלֵינוּ",
      "2mpl": "עַל רַגְלֵיכֶם",
      "2fpl": "עַל רַגְלֵיכֶן",
      "3mpl": "עַל רַגְלֵיהֶם",
      "3fpl": "עַל רַגְלֵיהֶן"
    },
    "niqqud_status": "reviewed",
    "niqqud_sources": [
      "internal:hebrew-verbs#advanced-verb-lehaamid"
    ]
  }
];

  // Normalize the runtime aliases and expose an explicit pointing contract.
  // A reviewed entry must supply a complete pointed paradigm and provenance;
  // unreviewed entries deliberately fall back to plain Hebrew in the game.
  return raw.map(function (item) {
    return Object.assign({}, item, {
      present_tense: item.conjugations.present,
      past_tense: item.conjugations.past || null,
      future_tense: item.conjugations.future || null,
      present_tense_niqqud: item.conjugations_niqqud?.present || null,
      past_tense_niqqud: item.conjugations_niqqud?.past || null,
      future_tense_niqqud: item.conjugations_niqqud?.future || null,
      english_meaning: item.english,
      niqqud_status: item.niqqud_status || "unreviewed",
      niqqud_sources: Array.isArray(item.niqqud_sources) ? item.niqqud_sources.slice() : [],
    });
  });
})();

if (typeof globalThis !== "undefined") {
  globalThis.HEBREW_IDIOMS = HEBREW_IDIOMS;
}

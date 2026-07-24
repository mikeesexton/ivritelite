const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadSpeechHarness(options = {}) {
  const speakLog = [];
  let cancelCount = 0;

  const context = {
    console,
    SpeechSynthesisUtterance: options.noUtterance ? undefined : class FakeSpeechSynthesisUtterance {
      constructor(text) {
        this.text = text;
        this.lang = "";
        this.voice = null;
      }
    },
    speechSynthesis: options.noSpeechSynthesis ? undefined : {
      _listeners: {},
      getVoices() {
        return Array.isArray(options.voices) ? options.voices : [{ lang: "he-IL", name: "Hebrew Test" }];
      },
      addEventListener(type, handler) {
        this._listeners[type] = handler;
      },
      removeEventListener(type) {
        delete this._listeners[type];
      },
      speak(utterance) {
        speakLog.push({
          text: utterance.text,
          lang: utterance.lang,
          voiceName: utterance.voice?.name || "",
          voiceLang: utterance.voice?.lang || "",
        });
      },
      cancel() {
        cancelCount += 1;
      },
    },
    IvriQuestApp: {
      runtime: {
        state: {
          speech: {
            enabled: options.enabled !== false,
          },
        },
        helpers: {
          isUiLocked() {
            return options.uiLocked === true;
          },
          renderAll() {},
        },
      },
    },
  };

  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, "..", "app", "speech.js"), "utf8");
  vm.runInContext(source, context);

  return {
    speech: context.IvriQuestApp.speech,
    speakLog,
    getCancelCount() {
      return cancelCount;
    },
  };
}

test("buildHebrewSpeechText prefers explicit override, then niqqud, then plain", () => {
  const { speech } = loadSpeechHarness();

  assert.equal(
    speech.buildHebrewSpeechText({
      plain: "שלום",
      niqqud: "שָׁלוֹם",
      speechOverridePlain: "שלום לך",
      speechOverrideNiqqud: "שָׁלוֹם לְךָ",
    }),
    "שָׁלוֹם לְךָ"
  );

  assert.equal(
    speech.buildHebrewSpeechText({
      plain: "שלום",
      niqqud: "שָׁלוֹם",
    }),
    "שָׁלוֹם"
  );

  assert.equal(
    speech.buildHebrewSpeechText({
      plain: "שלום",
    }),
    "שלום"
  );
});

test("isSupported requires a Hebrew voice and utterance support", () => {
  const supported = loadSpeechHarness();
  assert.equal(supported.speech.isSupported(), true);

  const noHebrewVoice = loadSpeechHarness({
    voices: [{ lang: "en-US", name: "English Test" }],
  });
  assert.equal(noHebrewVoice.speech.isSupported(), false);

  const noUtterance = loadSpeechHarness({ noUtterance: true });
  assert.equal(noUtterance.speech.isSupported(), false);
});

test("speak cancels prior speech and uses the Hebrew voice", () => {
  const { speech, speakLog, getCancelCount } = loadSpeechHarness();

  const payload = speech.buildSpeechPayload({
    plain: "שלום",
    niqqud: "שָׁלוֹם",
    source: "answer",
  });

  assert.equal(speech.speak(payload), true);
  assert.equal(getCancelCount(), 1);
  assert.equal(speakLog.length, 1);
  assert.deepEqual(speakLog[0], {
    text: "שָׁלוֹם",
    lang: "he-IL",
    voiceName: "Hebrew Test",
    voiceLang: "he-IL",
  });
});

test("speak no-ops when speech is disabled or the UI is locked", () => {
  const disabled = loadSpeechHarness({ enabled: false });
  const payload = disabled.speech.buildSpeechPayload({
    plain: "שלום",
    source: "answer",
  });
  assert.equal(disabled.speech.speak(payload), false);
  assert.equal(disabled.speakLog.length, 0);

  const locked = loadSpeechHarness({ uiLocked: true });
  const lockedPayload = locked.speech.buildSpeechPayload({
    plain: "שלום",
    source: "answer",
  });
  assert.equal(locked.speech.speak(lockedPayload), false);
  assert.equal(locked.speakLog.length, 0);
});

test("forced speech can play on explicit prompt requests even when automatic speech is disabled", () => {
  const { speech, speakLog } = loadSpeechHarness({ enabled: false });
  const payload = speech.buildSpeechPayload({
    plain: "שלום",
    niqqud: "שָׁלוֹם",
    source: "prompt",
  });

  assert.equal(speech.speak(payload, { force: true }), true);
  assert.equal(speakLog.length, 1);
  assert.equal(speakLog[0].text, "שָׁלוֹם");
});

test("applyTtsRespellings respells kamatz-katan words the he-IL voices misread", () => {
  const { speech } = loadSpeechHarness();
  const respell = (text) => speech.applyTtsRespellings(text).normalize("NFC");
  const nfc = (text) => text.normalize("NFC");

  // standalone כל with common attached prefixes → cholam
  assert.equal(respell("וְכָל תֵּל אָבִיב שָׁם"), nfc("וְכֹל תֵּל אָבִיב שָׁם"));
  assert.equal(respell("בְּכָל יוֹם"), nfc("בְּכֹל יוֹם"));
  assert.equal(respell("כָּל־הַכָּבוֹד"), nfc("כֹּל־הַכָּבוֹד"));
  assert.equal(respell("הַכָּל בְּסֵדֶר"), nfc("הַכֹּל בְּסֵדֶר"));

  // תכנית family → cholam male
  assert.equal(respell("הַתָּכְנִית הַזֹּאת"), nfc("הַתּוֹכְנִית הַזֹּאת"));
  assert.equal(respell("תָּכְנִיּוֹת רַבּוֹת"), nfc("תּוֹכְנִיּוֹת רַבּוֹת"));

  // ozen family and kamatz before chataf-kamatz
  assert.equal(respell("אָזְנַיִם"), nfc("אוֹזְנַיִם"));
  assert.equal(respell("צָהֳרַיִם"), nfc("צֹהֳרַיִם"));
  assert.equal(respell("בַּצָּהֳרַיִם"), nfc("בַּצֹּהֳרַיִם"));

  // words that merely contain the letters must stay untouched
  assert.equal(respell("כַּלְכָּלָה"), nfc("כַּלְכָּלָה"));
  assert.equal(respell("מִיכָל בָּאָה"), nfc("מִיכָל בָּאָה"));
  assert.equal(respell("הֵיכָל גָּדוֹל"), nfc("הֵיכָל גָּדוֹל"));

  // plain (unpointed) text has no kamatz to respell
  assert.equal(respell("וכל תל אביב"), "וכל תל אביב");
});

test("applyTtsRespellings removes quotation apostrophes without changing Hebrew loanwords", () => {
  const { speech } = loadSpeechHarness();
  const sentence = "בַּמּוֹדָעָה כָּתְבוּ 'שְׁנֵי חֲדָרִים מוּאָרִים', בְּפֹעַל זֶה מַחְסָן עִם חַלּוֹן.";

  assert.equal(
    speech.applyTtsRespellings(sentence),
    "בַּמּוֹדָעָה כָּתְבוּ שְׁנֵי חֲדָרִים מוּאָרִים, בְּפֹעַל זֶה מַחְסָן עִם חַלּוֹן."
  );
  assert.equal(
    speech.applyTtsRespellings("קְרִינְג' בְּרָמוֹת; זֶה פִיצֶ'ר."),
    "קְרִינְג' בְּרָמוֹת; זֶה פִיצֶ'ר."
  );
});

test("applyTtsRespellings gives brunch and שולם stable phonetic speech forms", () => {
  const { speech } = loadSpeechHarness();

  assert.equal(
    speech.applyTtsRespellings("חִכִּינוּ שָׁעָה לַבְּרַנְץ' אֲבָל הָאֹכֶל הָיָה סוֹף הַדֶּרֶךְ."),
    "חִכִּינוּ שָׁעָה לַבְּרַנְטְשׁ אֲבָל הָאֹכֶל הָיָה סוֹף הַדֶּרֶךְ."
  );
  assert.equal(speech.applyTtsRespellings("שֻׁלַּם"), "שׁוּלַּם");
});

test("buildHebrewSpeechText applies TTS respellings to every text source", () => {
  const { speech } = loadSpeechHarness();
  const nfc = (text) => text.normalize("NFC");

  assert.equal(
    speech.buildHebrewSpeechText({ niqqud: "וְכָל תֵּל אָבִיב" }).normalize("NFC"),
    nfc("וְכֹל תֵּל אָבִיב")
  );
  assert.equal(
    speech.buildHebrewSpeechText({
      niqqud: "וְכָל תֵּל אָבִיב",
      speechOverrideNiqqud: "הַתָּכְנִית",
    }).normalize("NFC"),
    nfc("הַתּוֹכְנִית")
  );
});

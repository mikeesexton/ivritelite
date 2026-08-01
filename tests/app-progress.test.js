const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const verbApi = require("../hebrew-verbs.js");

const nativeSetTimeout = global.setTimeout;
const nativeClearTimeout = global.clearTimeout;
const nativeSetInterval = global.setInterval;
const nativeClearInterval = global.clearInterval;
const activeHarnesses = new Set();

const MODERN_IMPERATIVE_IDS = [
  "imperative_second_person_masculine_singular",
  "imperative_second_person_feminine_singular",
  "imperative_second_person_plural",
];

class FakeClassList {
  constructor() {
    this.tokens = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this.tokens.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.tokens.delete(token));
  }

  toggle(token, force) {
    if (force === undefined) {
      if (this.tokens.has(token)) {
        this.tokens.delete(token);
        return false;
      }
      this.tokens.add(token);
      return true;
    }
    if (force) {
      this.tokens.add(token);
      return true;
    }
    this.tokens.delete(token);
    return false;
  }

  contains(token) {
    return this.tokens.has(token);
  }
}

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = String(tagName || "div").toUpperCase();
    this.classList = new FakeClassList();
    this.style = {
      setProperty(name, value) {
        this[name] = value;
      },
    };
    this.attributes = {};
    this.children = [];
    this.dataset = {};
    this.listeners = {};
    this._textContent = "";
    this._innerHTML = "";
    this.disabled = false;
    this.hidden = false;
    this.value = "";
    this.className = "";
    this.parentElement = null;
  }

  append(...nodes) {
    nodes.forEach((node) => {
      if (node && typeof node === "object") {
        node.parentElement = this;
      }
      this.children.push(node);
    });
  }

  remove() {
    const parent = this.parentElement;
    if (parent && Array.isArray(parent.children)) {
      parent.children = parent.children.filter((child) => child !== this);
    }
    this.parentElement = null;
  }

  appendChild(node) {
    if (node && typeof node === "object") {
      node.parentElement = this;
    }
    this.children.push(node);
    return node;
  }

  addEventListener(type, handler) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(handler);
  }

  removeEventListener(type, handler) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((candidate) => candidate !== handler);
  }

  click() {
    const handlers = this.listeners.click || [];
    const event = {
      target: this,
      currentTarget: this,
      preventDefault() {},
      stopPropagation() {},
    };
    handlers.forEach((handler) => handler(event));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || new FakeElement();
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (nodes) => {
      nodes.forEach((node) => {
        if (matchesSelector(node, selector)) {
          matches.push(node);
        }
        if (Array.isArray(node.children) && node.children.length > 0) {
          visit(node.children);
        }
      });
    };
    visit(this.children);
    return matches;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (matchesSelector(current, selector)) {
        return current;
      }
      current = current.parentElement || null;
    }
    return null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name.startsWith("data-")) {
      const key = name
        .slice(5)
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      this.dataset[key] = String(value);
    }
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  get className() {
    return Array.from(this.classList.tokens).join(" ");
  }

  set className(value) {
    this.classList = new FakeClassList();
    String(value || "")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => this.classList.add(token));
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = String(value || "");
    this.children = [];
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(value) {
    this._textContent = String(value ?? "");
  }
}

function matchesSelector(node, selector) {
  if (!node || !selector) return false;
  if (selector.startsWith(".")) {
    return node.classList.contains(selector.slice(1));
  }
  return node.tagName === selector.toUpperCase();
}

function createLocalStorage(initialEntries = {}) {
  const store = new Map(Object.entries(initialEntries));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    __dump() {
      return Object.fromEntries(store.entries());
    },
  };
}

function runScriptInContext(sourcePath, context, transform = null) {
  const source = fs.readFileSync(sourcePath, "utf8");
  const nextSource = typeof transform === "function" ? transform(source) : source;
  vm.runInContext(nextSource, context, { filename: sourcePath });
}

function loadAppHarness(vocabulary, abbreviations = [], verbDeck = [], options = {}) {
  const sourcePath = path.join(__dirname, "..", "app.js");
  const instrumented = (source) => source.replace(
    /\}\)\(typeof window !== "undefined" \? window : globalThis\);\s*$/,
    `
globalThis.__appTestExports = {
  ADV_CONJ_SUBJECTS,
  ADV_CONJ_OBJECTS,
  app: globalThis.IvriQuestApp,
  applyAdvConjAnswer,
  applySentenceBankAnswer,
  applyVerbMatchMismatch,
  applyVerbMatchSuccess,
  buildAbbreviationMistakeSummary,
  buildAdvConjDeck,
  buildAdvConjEnglishSentence,
  getAdvConjSubjectsForTense,
  beginVerbMatchFromIntro,
  confirmLeaveSession,
  closeLeaveSessionConfirm,
  closeWelcomeModal,
  clearSentenceBankAnswer,
  document,
  goHome,
  getMostMissedRanked,
  getProgressRecord,
  getSelectedPool,
  localStorage,
  loadNextVerbRound,
  navigateTo,
  nextSentenceBankQuestion,
  requestLeaveSession,
  requestGoHome,
  resumeActiveTimers,
  restoreSessionState,
  startAdvConj,
  startSentenceBank,
  startVerbMatch,
  toggleSoundPreference,
  toggleSentenceBankHint,
  toggleSpeechPreference,
  updateProgress,
  state,
};
})(typeof window !== "undefined" ? window : globalThis);
`
  );

  const audioPlayLog = [];
  const audioLoadLog = [];
  const speechSpeakLog = [];
  let speechCancelCount = 0;
  const timeoutHandles = new Set();
  const intervalHandles = new Set();
  const elements = new Map();
  const document = {
    body: new FakeElement("body"),
    documentElement: new FakeElement("html"),
    title: "",
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, new FakeElement());
      }
      return elements.get(selector);
    },
    querySelectorAll() {
      return [];
    },
    createElement(tagName) {
      return new FakeElement(tagName);
    },
    elementFromPoint() {
      return this.__elementFromPointTarget || null;
    },
  };
  document.documentElement.style = {};

  function trackedSetTimeout(handler, delay, ...args) {
    const handle = nativeSetTimeout(() => {
      timeoutHandles.delete(handle);
      handler(...args);
    }, delay);
    timeoutHandles.add(handle);
    return handle;
  }

  function trackedClearTimeout(handle) {
    timeoutHandles.delete(handle);
    nativeClearTimeout(handle);
  }

  function trackedSetInterval(handler, delay, ...args) {
    const handle = nativeSetInterval(handler, delay, ...args);
    intervalHandles.add(handle);
    return handle;
  }

  function trackedClearInterval(handle) {
    intervalHandles.delete(handle);
    nativeClearInterval(handle);
  }

  const testMath = Object.create(Math);
  if (typeof options.mathRandom === "function") {
    testMath.random = options.mathRandom;
  }

  const context = {
    console,
    Math: testMath,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Map,
    Set,
    Promise,
    URLSearchParams,
    innerWidth: Number(options.innerWidth || 0),
    setTimeout: trackedSetTimeout,
    clearTimeout: trackedClearTimeout,
    setInterval: trackedSetInterval,
    clearInterval: trackedClearInterval,
    __IVRIQUEST_TEST_CONFIG__: {
      introAutoAdvanceMs: 0,
    },
    document,
    Audio: class FakeAudio {
      constructor(src) {
        this.src = src;
        this.preload = "";
        this.currentTime = 0;
      }

      canPlayType(type) {
        if (options.audioSupport && Object.hasOwn(options.audioSupport, type)) {
          return options.audioSupport[type];
        }
        return "probably";
      }

      play() {
        audioPlayLog.push(this.src);
        return Promise.resolve();
      }

      load() {
        audioLoadLog.push(this.src);
      }
    },
    SpeechSynthesisUtterance: class FakeSpeechSynthesisUtterance {
      constructor(text) {
        this.text = text;
        this.lang = "";
        this.voice = null;
      }
    },
    speechSynthesis: {
      _listeners: {},
      getVoices() {
        return Array.isArray(options.speechVoices)
          ? options.speechVoices
          : [{ lang: "he-IL", name: "Hebrew Test" }];
      },
      addEventListener(type, handler) {
        this._listeners[type] = handler;
      },
      removeEventListener(type) {
        delete this._listeners[type];
      },
      speak(utterance) {
        speechSpeakLog.push({
          text: utterance.text,
          lang: utterance.lang,
          voiceName: utterance.voice?.name || "",
          voiceLang: utterance.voice?.lang || "",
        });
      },
      cancel() {
        speechCancelCount += 1;
      },
    },
    localStorage: createLocalStorage(options.localStorageData || {
      "ivriquest-welcome-seen-v1": "1",
    }),
    confirm() {
      return false;
    },
    addEventListener() {},
    removeEventListener() {},
    location: { search: "" },
    HEBREW_IDIOMS: options.idioms || [],
    IvriQuestVocab: {
      EXPANSION_TRACKS: {},
      getBaseVocabulary() {
        return vocabulary;
      },
    },
    IvriQuestAbbreviations: {
      getAbbreviations() {
        return abbreviations;
      },
    },
    IvriQuestSentenceBank: {
      getSentenceBank() {
        return options.sentenceBank || [];
      },
    },
    IvriQuestHebrewVerbs: {
      MATCH_FORM_ORDER: [
        "present_masculine_singular",
        "past_first_person_singular",
        "future_first_person_singular",
        "present_feminine_singular",
        "past_third_person_masculine_singular",
        "future_third_person_masculine_singular",
        "present_masculine_plural",
        "past_third_person_feminine_singular",
        "future_third_person_feminine_singular",
        "present_feminine_plural",
        "past_first_person_plural",
        "future_first_person_plural",
        "past_second_person_masculine_singular",
        "future_second_person_masculine_singular",
        "past_second_person_feminine_singular",
        "future_second_person_feminine_singular",
        "past_second_person_masculine_plural",
        "future_second_person_plural",
        "past_second_person_feminine_plural",
        "past_third_person_plural",
        "future_third_person_plural",
        "imperative_second_person_masculine_singular",
        "imperative_second_person_feminine_singular",
        "imperative_second_person_plural",
      ],
      getSeedVocabularyEntries() {
        return [];
      },
      // Real paradigms: advConj joins on these to reach person-marked past and
      // future forms, so a stub would silently collapse the subject axis.
      getSeedVerbEntries() {
        return verbApi.getSeedVerbEntries();
      },
      buildVerbConjugationDeck() {
        return verbDeck;
      },
    },
  };

  context.window = context;
  context.globalThis = context;
  document.defaultView = context;

  vm.createContext(context);
  [
    path.join(__dirname, "..", "verb-game-data.js"),
    path.join(__dirname, "..", "preposition-data.js"),
    path.join(__dirname, "..", "app", "constants.js"),
    path.join(__dirname, "..", "app", "storage.js"),
    path.join(__dirname, "..", "app", "utils.js"),
    path.join(__dirname, "..", "app", "hebrew.js"),
    path.join(__dirname, "..", "app", "bootstrap-data.js"),
    path.join(__dirname, "..", "app", "content-sources.js"),
    path.join(__dirname, "..", "app", "bootstrap-runtime.js"),
    path.join(__dirname, "..", "app", "audio.js"),
    path.join(__dirname, "..", "app", "speech.js"),
    path.join(__dirname, "..", "app", "persistence.js"),
    path.join(__dirname, "..", "app", "session.js"),
    path.join(__dirname, "..", "app", "i18n.js"),
    path.join(__dirname, "..", "app", "ui.js"),
    path.join(__dirname, "..", "app", "data.js"),
    path.join(__dirname, "..", "app", "lesson.js"),
    path.join(__dirname, "..", "app", "sentence-bank.js"),
    path.join(__dirname, "..", "app", "abbreviation.js"),
    path.join(__dirname, "..", "app", "adv-conj.js"),
    path.join(__dirname, "..", "app", "prepositions.js"),
    path.join(__dirname, "..", "app", "verb-match.js"),
    path.join(__dirname, "..", "app", "match-engine.js"),
    path.join(__dirname, "..", "app", "word-match.js"),
    path.join(__dirname, "..", "app", "binyan-board.js"),
    path.join(__dirname, "..", "app", "controller.js"),
  ].forEach((scriptPath) => runScriptInContext(scriptPath, context));
  runScriptInContext(sourcePath, context, instrumented);
  const harness = {
    ...context.__appTestExports,
    audioLoadLog,
    audioPlayLog,
    speechSpeakLog,
    getSpeechCancelCount() {
      return speechCancelCount;
    },
    cleanup() {
      timeoutHandles.forEach((handle) => nativeClearTimeout(handle));
      timeoutHandles.clear();
      intervalHandles.forEach((handle) => nativeClearInterval(handle));
      intervalHandles.clear();
      activeHarnesses.delete(harness);
    },
  };
  activeHarnesses.add(harness);
  return harness;
}

function waitForTimers() {
  return new Promise((resolve) => nativeSetTimeout(resolve, 0));
}

function assertAudioPlayLog(audioPlayLog, expectedPatterns) {
  assert.equal(audioPlayLog.length, expectedPatterns.length);
  expectedPatterns.forEach((pattern, index) => {
    assert.match(audioPlayLog[index], pattern);
  });
}

function assertAudioLoadLog(audioLoadLog, expectedPatterns) {
  assert.equal(audioLoadLog.length, expectedPatterns.length);
  expectedPatterns.forEach((pattern, index) => {
    assert.match(audioLoadLog[index], pattern);
  });
}

function getFeedbackText(document) {
  const sentence = document.querySelector("#feedbackSentence").textContent;
  const detail = document.querySelector("#feedbackDetail").textContent;
  return [sentence, detail].filter(Boolean).join(" ");
}

function findVisibleButtonByText(root, selector, text) {
  return root.querySelectorAll(selector).find((node) => (
    node.textContent === text
    && !node.classList.contains("hidden")
    && !node.classList.contains("used")
  ));
}

function getSentenceSlots(document) {
  return document.querySelector("#choiceContainer").querySelectorAll(".sentence-slot");
}

function getSentenceStaticTexts(document) {
  return document.querySelector("#choiceContainer").querySelectorAll(".sentence-static").map((node) => node.textContent);
}

function getSentenceStaticWordChunks(document) {
  return getSentenceStaticTexts(document).filter((text) => /[A-Za-z0-9]/.test(text));
}

function createFakeDataTransfer() {
  const store = new Map();
  return {
    effectAllowed: "move",
    dropEffect: "move",
    setData(type, value) {
      store.set(type, String(value));
    },
    getData(type) {
      return store.get(type) || "";
    },
  };
}

function simulateDragAndDrop(source, target) {
  const dataTransfer = createFakeDataTransfer();
  const baseEvent = {
    preventDefault() {},
    stopPropagation() {},
  };
  (source.listeners.dragstart || []).forEach((handler) => handler({
    ...baseEvent,
    target: source,
    currentTarget: source,
    dataTransfer,
  }));
  (target.listeners.dragenter || []).forEach((handler) => handler({
    ...baseEvent,
    target,
    currentTarget: target,
    dataTransfer,
  }));
  (target.listeners.dragover || []).forEach((handler) => handler({
    ...baseEvent,
    target,
    currentTarget: target,
    dataTransfer,
  }));
  (target.listeners.drop || []).forEach((handler) => handler({
    ...baseEvent,
    target,
    currentTarget: target,
    dataTransfer,
  }));
  (source.listeners.dragend || []).forEach((handler) => handler({
    ...baseEvent,
    target: source,
    currentTarget: source,
    dataTransfer,
  }));
}

function simulateTouchDragAndDrop(document, source, target) {
  const startPoint = { clientX: 24, clientY: 24 };
  const movePoint = { clientX: 220, clientY: 220 };
  document.__elementFromPointTarget = target;
  const baseEvent = {
    preventDefault() {},
    stopPropagation() {},
  };
  (source.listeners.touchstart || []).forEach((handler) => handler({
    ...baseEvent,
    target: source,
    currentTarget: source,
    touches: [startPoint],
    changedTouches: [startPoint],
  }));
  (source.listeners.touchmove || []).forEach((handler) => handler({
    ...baseEvent,
    target: source,
    currentTarget: source,
    touches: [movePoint],
    changedTouches: [movePoint],
  }));
  (source.listeners.touchend || []).forEach((handler) => handler({
    ...baseEvent,
    target: source,
    currentTarget: source,
    touches: [],
    changedTouches: [movePoint],
  }));
  document.__elementFromPointTarget = null;
}

function dragSentenceTokenToSlot(document, tokenText, slotIndex) {
  const source = findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", tokenText);
  const target = getSentenceSlots(document)[slotIndex];
  simulateDragAndDrop(source, target);
}

function dragPlacedSentenceToken(document, fromIndex, toIndex) {
  const slots = getSentenceSlots(document);
  simulateDragAndDrop(slots[fromIndex], slots[toIndex]);
}

function touchDragSentenceTokenToSlot(document, tokenText, slotIndex) {
  const source = findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", tokenText);
  const target = getSentenceSlots(document)[slotIndex];
  simulateTouchDragAndDrop(document, source, target);
}

function placeSentenceTokenByTap(document, tokenText, slotIndex) {
  const slot = getSentenceSlots(document)[slotIndex];
  slot.click();
  findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", tokenText).click();
}

function fillSentenceAnswerByTap(document, tokens) {
  tokens.forEach((token, index) => placeSentenceTokenByTap(document, token, index));
}

function placeSentenceTokenInNextEmptySlotByTap(document, tokenText) {
  findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", tokenText).click();
}

function pressKey(node, key) {
  const baseEvent = {
    key,
    preventDefault() {},
    stopPropagation() {},
  };
  (node.listeners.keydown || []).forEach((handler) => handler({
    ...baseEvent,
    target: node,
    currentTarget: node,
  }));
}

function getSentenceSlotTexts(document) {
  return getSentenceSlots(document).map((slot) => slot.textContent.replace(/\u00A0/g, "").trim());
}

test.afterEach(() => {
  activeHarnesses.forEach((harness) => harness.cleanup());
  activeHarnesses.clear();
});

test("welcome modal appears once and survey links stay available", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const firstHarness = loadAppHarness(vocabulary, [], [], { localStorageData: {} });
  const feedbackLink = firstHarness.document.querySelector("#feedbackSurveyLink");
  const welcomeLink = firstHarness.document.querySelector("#welcomeSurveyLink");

  assert.equal(firstHarness.state.welcomeModalOpen, true);
  assert.equal(firstHarness.localStorage.getItem("ivriquest-welcome-seen-v1"), "1");
  assert.equal(feedbackLink.getAttribute("href"), "https://forms.gle/KqqP7TVLxphRDM179");
  assert.equal(feedbackLink.getAttribute("target"), "_blank");
  assert.equal(feedbackLink.getAttribute("rel"), "noopener noreferrer");
  assert.equal(welcomeLink.getAttribute("href"), "https://forms.gle/KqqP7TVLxphRDM179");
  assert.equal(welcomeLink.getAttribute("target"), "_blank");
  assert.equal(welcomeLink.getAttribute("rel"), "noopener noreferrer");

  firstHarness.closeWelcomeModal();
  assert.equal(firstHarness.state.welcomeModalOpen, false);

  const returningHarness = loadAppHarness(vocabulary, [], [], {
    localStorageData: firstHarness.localStorage.__dump(),
  });
  assert.equal(returningHarness.state.welcomeModalOpen, false);
});

test("most-missed rankings ignore words that are unavailable for translation quiz", () => {
  const vocabulary = [
    { id: "basic-office", category: "work_business", en: "office", he: "משרד", heNiqqud: "מִשְׂרָד", utility: 82, source: "seed", availability: { translationQuiz: false, sentenceHints: true } },
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test", availability: { translationQuiz: true, sentenceHints: true } },
  ];
  const { getMostMissedRanked, updateProgress } = loadAppHarness(vocabulary);

  updateProgress("basic-office", false);
  updateProgress("alpha", false);

  assert.deepEqual(
    getMostMissedRanked().map((item) => `${item.wordId}:${item.missed}`),
    ["alpha:1"]
  );
});

test("translation miss recovery streak resets on misses and neutralizes the hidden bias after five correct recoveries", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const { getProgressRecord, updateProgress } = loadAppHarness(vocabulary);

  updateProgress("alpha", false, { mode: "translationQuiz" });
  assert.equal(getProgressRecord("alpha").translationRecoveryStreak, 0);

  for (let i = 1; i <= 5; i += 1) {
    updateProgress("alpha", true, { mode: "translationQuiz" });
    assert.equal(getProgressRecord("alpha").translationRecoveryStreak, i);
  }

  updateProgress("alpha", true, { mode: "translationQuiz" });
  assert.equal(getProgressRecord("alpha").translationRecoveryStreak, 5);

  updateProgress("alpha", false, { mode: "translationQuiz" });
  assert.equal(getProgressRecord("alpha").translationRecoveryStreak, 0);
});

test("translation selection weights previously missed words until their five-answer recovery streak clears the bias", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 60, source: "test" },
    { id: "beta", category: "core_advanced", en: "beta", he: "בטא", heNiqqud: "בֵּטָא", utility: 60, source: "test" },
  ];
  const harness = loadAppHarness(vocabulary, [], [], {
    mathRandom: () => 0,
  });

  harness.state.progress.alpha = {
    attempts: 4,
    correct: 4,
    misses: 2,
    level: 0,
    nextDue: 0,
    lastSeen: 0,
    translationRecoveryStreak: 0,
  };
  harness.state.progress.beta = {
    attempts: 4,
    correct: 4,
    misses: 0,
    level: 0,
    nextDue: 0,
    lastSeen: 0,
    translationRecoveryStreak: 0,
  };

  let weighted = [];
  harness.app.utils.weightedRandomWord = (items) => {
    weighted = items;
    return items[0]?.word || null;
  };

  harness.app.data.pickBestWord(vocabulary, [], { mode: "translationQuiz" });
  const alphaFocusedWeight = weighted.find((item) => item.word.id === "alpha")?.weight || 0;
  const betaNeutralWeight = weighted.find((item) => item.word.id === "beta")?.weight || 0;
  assert.ok(alphaFocusedWeight > betaNeutralWeight);

  harness.state.progress.alpha.translationRecoveryStreak = 5;
  harness.app.data.pickBestWord(vocabulary, [], { mode: "translationQuiz" });
  const alphaRecoveredWeight = weighted.find((item) => item.word.id === "alpha")?.weight || 0;
  const betaRecoveredWeight = weighted.find((item) => item.word.id === "beta")?.weight || 0;
  assert.equal(alphaRecoveredWeight, betaRecoveredWeight);
});

test("sentence builder renders english answer lines left-to-right and omits post-answer tips", () => {
  const sentenceBank = [
    {
      id: "sb-1",
      category: "everyday",
      difficulty: 2,
      english: "He's just talking nonsense, don't take him seriously.",
      hebrew: "הוא סתם מדבר שטויות, אל תיקח אותו ברצינות.",
      english_tokens: ["He's", "just", "talking", "nonsense", "don't", "take", "him", "seriously"],
      hebrew_tokens: ["הוא", "סתם", "מדבר", "שטויות", "אל", "תיקח", "אותו", "ברצינות"],
      english_distractors: ["she", "truth", "listen", "later"],
      hebrew_distractors: ["היא", "אמת", "תקשיב", "מחר"],
      notes: "Third person gender swap (הוא/היא, מדבר/מדברת, אותו/אותה) is a good distractor set here.",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(state.sentenceBank.currentQuestion.direction, "he2en");
  assert.equal(document.querySelector("#nextBtn").disabled, true);
  assert.equal(document.querySelector("#stickyLessonActions").textContent.includes("Hint"), false);
  assert.equal(document.querySelector("#stickyLessonActions").textContent.includes("Clear"), false);
  assert.equal(document.querySelector("#promptHint").classList.contains("hidden"), true);
  assert.equal(
    document.querySelector("#choiceContainer").querySelectorAll(".sentence-drag-tip").length,
    0
  );
  assert.equal(document.querySelector("#promptLabel").classList.contains("hidden"), true);
  assert.equal(getSentenceSlots(document)[0].getAttribute("dir"), undefined);

  fillSentenceAnswerByTap(document, ["He's", "just", "talking", "nonsense", "don't", "take", "him", "seriously"]);
  assert.equal(document.querySelector("#nextBtn").disabled, false);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 2);
  assert.equal(
    getFeedbackText(document),
    "Correct. The English sentence is He's just talking nonsense, don't take him seriously."
  );
  assert.doesNotMatch(getFeedbackText(document), /Tip:/);
  assert.equal(document.querySelector(".prompt-card").classList.contains("hidden"), false);
  assert.equal(document.querySelector(".sentence-token-bank") !== null, true);
  assert.equal(state.sentenceProgress["sb-1::he2en"].attempts, 1);
  assert.equal(state.sentenceProgress["sb-1::he2en"].correct, 1);
  assert.equal(state.sentenceProgress["sb-1::he2en"].level, 1);
  assert.equal(state.sentenceProgress["sb-1::he2en"].misses, 0);
  assert.equal(state.sentenceProgress["sb-1::en2he"], undefined);

  const modeStats = harness.app.data.calculateGameModeStats();
  assert.equal(modeStats.sentenceBank.attempts, 1);
  assert.equal(modeStats.sentenceBank.correct, 1);
  assert.equal(modeStats.sentenceBank.wrong, 0);
});

test("shema round speaks the sentence, hides the Hebrew prompt, and tracks listen progress", () => {
  const sentenceBank = [
    {
      id: "sb-1",
      category: "everyday",
      difficulty: 2,
      english: "He's just talking nonsense, don't take him seriously.",
      hebrew: "הוא סתם מדבר שטויות, אל תיקח אותו ברצינות.",
      english_tokens: ["He's", "just", "talking", "nonsense", "don't", "take", "him", "seriously"],
      hebrew_tokens: ["הוא", "סתם", "מדבר", "שטויות", "אל", "תיקח", "אותו", "ברצינות"],
      english_distractors: ["she", "truth", "listen", "later"],
      hebrew_distractors: ["היא", "אמת", "תקשיב", "מחר"],
      notes: "Third person gender swap (הוא/היא, מדבר/מדברת, אותו/אותה) is a good distractor set here.",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  state.sentenceBank.shemaMode = true;
  harness.nextSentenceBankQuestion();

  const question = state.sentenceBank.currentQuestion;
  assert.equal(question.direction, "listen");
  assert.equal(question.answerIsHebrew, true);
  assert.equal(document.querySelector("#promptText").textContent, "");
  assert.equal(document.querySelector("#promptText").classList.contains("hidden"), true);
  assert.equal(harness.speechSpeakLog.length, 1);
  assert.equal(harness.speechSpeakLog[0].text, "הוא סתם מדבר שטויות, אל תיקח אותו ברצינות.");
  assert.equal(harness.speechSpeakLog[0].lang, "he-IL");

  const playButtons = document.querySelector("#choiceContainer").querySelectorAll(".shema-play-btn");
  assert.equal(playButtons.length, 2);
  playButtons[0].click();
  assert.equal(harness.speechSpeakLog.length, 2);

  state.language = "he";
  fillSentenceAnswerByTap(document, ["הוא", "סתם", "מדבר", "שטויות", "אל", "תיקח", "אותו", "ברצינות"]);
  assert.equal(document.querySelector("#nextBtn").disabled, false);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 3);
  assert.equal(
    getFeedbackText(document),
    "נכון. שמעת הוא סתם מדבר שטויות, אל תיקח אותו ברצינות. "
      + "משמעות: He's just talking nonsense, don't take him seriously."
  );
  const feedbackItems = document.querySelector("#feedbackItems");
  assert.equal(document.querySelector("#feedbackSentence").classList.contains("hidden"), true);
  assert.equal(document.querySelector("#feedbackDetail").classList.contains("hidden"), true);
  assert.equal(feedbackItems.classList.contains("hidden"), false);
  assert.equal(feedbackItems.children[0].className, "feedback-item");
  assert.equal(feedbackItems.children[0].children[0].textContent, "שמעת");
  assert.equal(feedbackItems.children[0].children[1].children[0].textContent, "הוא סתם מדבר שטויות, אל תיקח אותו ברצינות.");
  assert.equal(feedbackItems.children[0].children[1].children[0].getAttribute("dir"), "rtl");
  assert.equal(feedbackItems.children[0].children[1].children[0].getAttribute("lang"), "he");
  assert.equal(feedbackItems.children[1].children[0].textContent, "משמעות");
  assert.equal(feedbackItems.children[1].children[1].children[0].textContent, "He's just talking nonsense, don't take him seriously.");
  assert.equal(feedbackItems.children.length, 2);
  assert.equal(document.querySelector("#choiceContainer").querySelectorAll(".shema-play-btn").length, 2);
  assert.equal(feedbackItems.children[1].children[1].children[0].getAttribute("dir"), "ltr");
  assert.equal(feedbackItems.children[1].children[1].children[0].getAttribute("lang"), "en");
  assert.equal(state.sentenceProgress["sb-1::listen"].attempts, 1);
  assert.equal(state.sentenceProgress["sb-1::listen"].correct, 1);
  assert.equal(state.sentenceProgress["sb-1::he2en"], undefined);
  assert.equal(state.sentenceProgress["sb-1::en2he"], undefined);
});

test("shema requires the exact spoken word order and rejects written alternates", () => {
  const sentenceBank = [
    {
      id: "sb-2",
      category: "colloquial",
      difficulty: 2,
      english: "What's going on with you? I haven't heard from you all day.",
      hebrew: "מה נסגר איתך? לא שמעתי ממך כל היום.",
      english_tokens: ["What's", "going on", "with you", "I haven't", "heard", "from you", "all", "day"],
      hebrew_tokens: ["מה", "נסגר", "איתך", "לא", "שמעתי", "ממך", "כל", "היום"],
      hebrew_alternates: [
        {
          text: "מה נסגר איתך? כל היום לא שמעתי ממך.",
          tokens: ["מה", "נסגר", "איתך", "כל", "היום", "לא", "שמעתי", "ממך"],
        },
      ],
      english_distractors: ["the plan", "saw", "from him"],
      hebrew_distractors: ["נגמר", "אליך", "שמעת"],
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  state.sentenceBank.shemaMode = true;
  harness.nextSentenceBankQuestion();

  assert.equal(state.sentenceBank.currentQuestion.direction, "listen");
  fillSentenceAnswerByTap(document, ["מה", "נסגר", "איתך", "כל", "היום", "לא", "שמעתי", "ממך"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 0);
  assert.equal(
    getFeedbackText(document),
    "Not quite. The sentence was מה נסגר איתך? לא שמעתי ממך כל היום. "
      + "Meaning: What's going on with you? I haven't heard from you all day."
  );
  assert.equal(state.sentenceProgress["sb-2::listen"].misses, 1);
  assert.equal(state.sentenceBank.reviewQueue.length, 1);
  assert.equal(state.sentenceBank.reviewQueue[0].direction, "listen");
});

test("sentence builder accepts an alternate Hebrew word order for en2he questions", () => {
  const sentenceBank = [
    {
      id: "sb-order",
      category: "colloquial",
      difficulty: 2,
      english: "We haven't seen each other in ages; dying to see you!",
      hebrew: "מזמן לא התראינו, מת לראות אותך!",
      english_tokens: ["We haven't seen each other", "in ages", "dying", "to see you"],
      hebrew_tokens: ["מזמן", "לא", "התראינו", "מת", "לראות", "אותך"],
      hebrew_alternates: [
        {
          text: "לא התראינו מזמן, מת לראות אותך!",
          tokens: ["לא", "התראינו", "מזמן", "מת", "לראות", "אותך"],
        },
      ],
      english_distractors: ["We haven't talked", "not yet", "excited"],
      hebrew_distractors: ["עוד לא", "דיברנו", "לשמוע"],
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(state.sentenceBank.currentQuestion.direction, "en2he");
  fillSentenceAnswerByTap(document, ["לא", "התראינו", "מזמן", "מת", "לראות", "אותך"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sentenceBank.currentQuestion.wasLastAnswerCorrect, true);
  assert.ok(state.sessionScore > 0, "reordered Hebrew answer is scored as correct");
});

test("sentence bank incorrect answer diffing matches the closest variant and keeps valid alternate tokens green", () => {
  const sentenceBank = [
    {
      id: "colloquial_122",
      category: "colloquial",
      difficulty: 2,
      emoji: "🎧",
      english: "I don't get the hype around this podcast.",
      english_tokens: ["I", "don't", "get the hype", "around", "this podcast"],
      hebrew: "אני לא מבינה את ההייפ סביב הפודקאסט הזה.",
      hebrew_tokens: ["אני", "לא", "מבינה", "את", "ההייפ", "סביב", "הפודקאסט", "הזה"],
      hebrew_tokens_niqqud: ["אני", "לא", "מבינה", "את", "ההייפ", "סביב", "הפודקאסט", "הזה"],
      hebrew_alternates: [
        {
          text: "אני לא מבין את ההייפ סביב הפודקאסט הזה.",
          tokens: ["אני", "לא", "מבין", "את", "ההייפ", "סביב", "הפודקאסט", "הזה"],
          tokens_niqqud: ["אני", "לא", "מבין", "את", "ההייפ", "סביב", "הפודקאסט", "הזה"],
        },
      ],
      english_distractors: ["We", "can't", "hear the buzz"],
      hebrew_distractors: ["מבין", "שומעת", "הזאת"],
      hebrew_distractors_niqqud: ["מבין", "שומעת", "הזאת"],
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  ["אני", "לא", "מבין", "את", "ההייפ", "סביב", "הפודקאסט", "הזאת"].forEach((tokenText) => {
    placeSentenceTokenInNextEmptySlotByTap(document, tokenText);
  });

  document.querySelector("#nextBtn").click();

  assert.equal(state.sentenceBank.currentQuestion.wasLastAnswerCorrect, false);
  const slotButtons = getSentenceSlots(document);
  assert.equal(slotButtons.length, 8);
  assert.equal(slotButtons[2].classList.contains("correct"), true);
  assert.equal(slotButtons[2].classList.contains("wrong"), false);
  assert.equal(slotButtons[7].classList.contains("wrong"), true);
  const feedbackMsg = getFeedbackText(document);
  assert.match(feedbackMsg, /מבין/);
});

test("shema home tile is only shown when a Hebrew voice is available", () => {
  const withVoice = loadAppHarness([], [], [], {});
  withVoice.app.ui.renderHomeState();
  assert.equal(withVoice.document.querySelector("#homeShemaBtn").classList.contains("hidden"), false);

  const withoutVoice = loadAppHarness([], [], [], { speechVoices: [] });
  withoutVoice.app.ui.renderHomeState();
  assert.equal(withoutVoice.document.querySelector("#homeShemaBtn").classList.contains("hidden"), true);
});

test("binyanim answers update simple game mode analytics", () => {
  const harness = loadAppHarness([]);
  const { app, document, state } = harness;
  const board = state.binyanBoard;

  app.runtime.helpers.playAnswerFeedbackSound = () => {};
  app.runtime.helpers.renderSessionHeader = () => {};
  app.runtime.helpers.renderDomainPerformance = () => {};
  app.runtime.helpers.renderMostMissed = () => {};
  app.binyanBoard.renderBinyanBoardFeedback = () => {};
  app.binyanBoard.markBinyanBoardChoiceResults = () => {};

  board.currentQuestion = {
    formId: "test:paal",
    rootId: "test",
    formVocalized: "פָּתַח",
    gloss: "opened",
    options: [
      { id: "correct", text: "opened", isCorrect: true },
      { id: "wrong", text: "closed", isCorrect: false },
    ],
    selectedOptionId: "correct",
    locked: false,
  };
  app.binyanBoard.applyBinyanBoardAnswer();

  board.currentQuestion = {
    formId: "test:nifal",
    rootId: "test",
    formVocalized: "נִפְתַּח",
    gloss: "was opened",
    options: [
      { id: "correct", text: "was opened", isCorrect: true },
      { id: "wrong", text: "developed", isCorrect: false },
    ],
    selectedOptionId: "wrong",
    locked: false,
  };
  app.binyanBoard.applyBinyanBoardAnswer();

  const storageKey = app.runtime.constants.STORAGE_KEYS.binyanBoardStats;
  assert.deepEqual(JSON.parse(harness.localStorage.getItem(storageKey)), { attempts: 2, correct: 1 });

  const itemStatsKey = app.runtime.constants.STORAGE_KEYS.binyanBoardItemStats;
  const itemRecord = JSON.parse(harness.localStorage.getItem(itemStatsKey)).test;
  assert.equal(itemRecord.attempts, 2);
  assert.equal(itemRecord.correct, 1);
  assert.equal(itemRecord.misses, 1);
  assert.ok(itemRecord.lastSeen > 0);

  const modeStats = app.data.calculateGameModeStats();
  assert.equal(modeStats.binyanBoard.attempts, 2);
  assert.equal(modeStats.binyanBoard.correct, 1);
  assert.equal(modeStats.binyanBoard.wrong, 1);

  app.ui.renderGameModePerformance();
  const homeCards = document.querySelector("#homeModePerformance").children;
  const binyanCard = homeCards.find((card) => card.children[1]?.children[0]?.textContent === "Binyanim");
  assert.ok(binyanCard);
  assert.equal(binyanCard.children[0]?.children[0]?.textContent, "ח");
  assert.equal(binyanCard.children[1].children[1].children[0]?.textContent, "✓ 1");
  assert.equal(binyanCard.children[1].children[1].children[2]?.textContent, "✗ 1");
});

test("preposition answers update simple game mode analytics", () => {
  const harness = loadAppHarness([]);
  const { app, document } = harness;
  const prep = app.runtime.state.prepositions;

  app.runtime.helpers.playAnswerFeedbackSound = () => {};
  app.runtime.helpers.renderSessionHeader = () => {};
  app.runtime.helpers.renderDomainPerformance = () => {};
  app.runtime.helpers.renderMostMissed = () => {};
  app.prepositions.markPrepositionsChoiceResults = () => {};

  app.runtime.state.mode = "prepositions";
  prep.active = true;

  prep.currentQuestion = {
    triggerId: "prep-miss",
    objectKey: "2msg",
    triggerHe: "מתגעגע",
    promptText: "מתגעגע ____",
    englishHint: "to miss you (m.sg.)",
    correctAnswer: "אֵלֶיךָ",
    answerPlain: "מתגעגע אליך",
    answerNiqqud: "מתגעגע אֵלֶיךָ",
    options: [
      { id: "correct", text: "אליך", textNiqqud: "אֵלֶיךָ", isCorrect: true },
      { id: "d1", text: "עליך", textNiqqud: "עָלֶיךָ", isCorrect: false },
    ],
    selectedOptionId: "correct",
    locked: false,
  };
  app.prepositions.applyPrepositionsAnswer();

  prep.currentQuestion = {
    triggerId: "prep-wait",
    objectKey: "1sg",
    triggerHe: "מחכה",
    promptText: "מחכה ____",
    englishHint: "to wait for me",
    correctAnswer: "לִי",
    answerPlain: "מחכה לי",
    answerNiqqud: "מחכה לִי",
    options: [
      { id: "correct", text: "לי", textNiqqud: "לִי", isCorrect: true },
      { id: "d1", text: "בי", textNiqqud: "בִּי", isCorrect: false },
    ],
    selectedOptionId: "d1",
    locked: false,
  };
  app.prepositions.applyPrepositionsAnswer();

  const storageKey = app.runtime.constants.STORAGE_KEYS.prepositionsStats;
  assert.deepEqual(JSON.parse(harness.localStorage.getItem(storageKey)), { attempts: 2, correct: 1 });

  const itemStatsKey = app.runtime.constants.STORAGE_KEYS.prepositionsItemStats;
  const itemStats = JSON.parse(harness.localStorage.getItem(itemStatsKey));
  assert.equal(itemStats["prep-miss:2msg"].attempts, 1);
  assert.equal(itemStats["prep-miss:2msg"].correct, 1);
  assert.equal(itemStats["prep-miss:2msg"].misses, 0);
  assert.equal(itemStats["prep-wait:1sg"].attempts, 1);
  assert.equal(itemStats["prep-wait:1sg"].correct, 0);
  assert.equal(itemStats["prep-wait:1sg"].misses, 1);

  const modeStats = app.data.calculateGameModeStats();
  assert.equal(modeStats.prepositions.attempts, 2);
  assert.equal(modeStats.prepositions.correct, 1);
  assert.equal(modeStats.prepositions.wrong, 1);

  app.ui.renderGameModePerformance();
  const homeCards = document.querySelector("#homeModePerformance").children;
  const prepCard = homeCards.find((card) => card.children[1]?.children[0]?.textContent === "Prepositions");
  assert.ok(prepCard);
  assert.equal(prepCard.children[0]?.children[0]?.textContent, "ז");
  assert.equal(prepCard.children[1].children[1].children[0]?.textContent, "✓ 1");
  assert.equal(prepCard.children[1].children[1].children[2]?.textContent, "✗ 1");
});

test("verb match session picks the weakest verb using conjugation history", () => {
  const vocabulary = [
    { id: "verb-weak", category: "core_advanced", en: "to fall", he: "ליפול", heNiqqud: "לִיפֹּל", utility: 80, source: "test" },
    { id: "verb-strong", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      id: "verb-weak",
      word: { id: "verb-weak", en: "to fall", he: "ליפול", heNiqqud: "לִיפֹּל" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he falls", valuePlain: "נופל", valueNiqqud: "נוֹפֵל" },
        { id: "past_first_person_singular", englishText: "I fell", valuePlain: "נפלתי", valueNiqqud: "נָפַלְתִּי" },
        { id: "present_feminine_singular", englishText: "she falls", valuePlain: "נופלת", valueNiqqud: "נוֹפֶלֶת" },
      ],
    },
    {
      id: "verb-strong",
      word: { id: "verb-strong", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "past_first_person_singular", englishText: "I went", valuePlain: "הלכתי", valueNiqqud: "הָלַכְתִּי" },
        { id: "present_feminine_singular", englishText: "she goes", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת" },
      ],
    },
  ];
  const harness = loadAppHarness(vocabulary, [], verbDeck, { mathRandom: () => 0 });

  harness.state.progress["verb-weak"] = {
    attempts: 0,
    correct: 0,
    level: 0,
    nextDue: 0,
    lastSeen: 0,
    mastered: false,
    misses: 0,
    conjugationAttempts: 6,
    conjugationCorrect: 1,
    conjugationStreak: 0,
    lastConjugationSeen: 0,
  };
  harness.state.progress["verb-strong"] = {
    attempts: 0,
    correct: 0,
    level: 0,
    nextDue: 0,
    lastSeen: 0,
    mastered: false,
    misses: 0,
    conjugationAttempts: 6,
    conjugationCorrect: 6,
    conjugationStreak: 8,
    lastConjugationSeen: 0,
  };

  let captured = [];
  harness.app.utils.weightedRandomWord = (items) => {
    if (!captured.length) captured = [...items];
    return items.reduce((best, item) => (item.weight > best.weight ? item : best), items[0]).word;
  };

  harness.startVerbMatch();

  const weakWeight = captured.find((item) => item.word.id === "verb-weak")?.weight || 0;
  const strongWeight = captured.find((item) => item.word.id === "verb-strong")?.weight || 0;
  assert.ok(weakWeight > strongWeight);
  assert.equal(harness.state.match.verbQueue.length, 1);
  assert.equal(harness.state.match.verbQueue[0].id, "verb-weak");
});

test("advanced conjugation selection favors idioms with weak history and records per-idiom results", () => {
  const idiomShape = {
    object_type: "l_dative",
    fixed_object: "את העיניים",
    literal_sg: "{s} opens {p} eyes",
    literal_pl: "{s} open {p} eyes",
    literal_past: "{s} opened {p} eyes",
    literal_future: "{s} will open {p} eyes",
    present_tense: { msg: "פותח", fsg: "פותחת", mpl: "פותחים", fpl: "פותחות" },
    past_tense: { msg: "פתח", fsg: "פתחה", mpl: "פתחו", fpl: "פתחו" },
    future_tense: { msg: "יפתח", fsg: "תפתח", mpl: "יפתחו", fpl: "יפתחו" },
  };
  const idioms = [
    { ...idiomShape, id: "idiom-weak" },
    { ...idiomShape, id: "idiom-strong" },
  ];
  const harness = loadAppHarness([], [], [], {
    idioms,
    mathRandom: () => 0,
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
      "ivriquest-adv-conj-item-stats-v1": JSON.stringify({
        "idiom-weak": { attempts: 6, correct: 1, misses: 5, lastSeen: 0 },
        "idiom-strong": { attempts: 6, correct: 6, misses: 0, lastSeen: 0 },
      }),
    },
  });

  let captured = [];
  harness.app.utils.weightedRandomWord = (items) => {
    if (!captured.length) captured = [...items];
    return items[0]?.word || null;
  };

  const deck = harness.buildAdvConjDeck();
  const picked = harness.app.advConj.pickAdvConjQuestions(deck, 5);
  assert.equal(picked.length, 5);

  const weakWeight = captured.find((item) => item.word.idiomId === "idiom-weak")?.weight || 0;
  const strongWeight = captured.find((item) => item.word.idiomId === "idiom-strong")?.weight || 0;
  assert.ok(weakWeight > strongWeight);

  harness.state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-weak",
    correctAnswer: "פתח לך את העיניים",
    options: [{ id: "right", text: "פתח לך את העיניים", isCorrect: true }],
    selectedOptionId: "right",
  };
  harness.applyAdvConjAnswer();

  const itemStats = JSON.parse(harness.localStorage.getItem("ivriquest-adv-conj-item-stats-v1"));
  assert.equal(itemStats["idiom-weak"].attempts, 7);
  assert.equal(itemStats["idiom-weak"].correct, 2);
  assert.equal(itemStats["idiom-weak"].misses, 5);
  assert.ok(itemStats["idiom-weak"].lastSeen > 0);
});

test("prepositions selection favors trigger-object pairs with weak history", () => {
  const harness = loadAppHarness([], [], [], {
    mathRandom: () => 0,
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
      "ivriquest-prepositions-item-stats-v1": JSON.stringify({
        "trig-a:1sg": { attempts: 6, correct: 1, misses: 5, lastSeen: 0 },
        "trig-b:2msg": { attempts: 6, correct: 6, misses: 0, lastSeen: 0 },
      }),
    },
  });

  const deck = [
    { triggerId: "trig-a", objectKey: "1sg" },
    { triggerId: "trig-b", objectKey: "2msg" },
  ];

  let captured = [];
  harness.app.utils.weightedRandomWord = (items) => {
    if (!captured.length) captured = [...items];
    return items[0]?.word || null;
  };

  const picked = harness.app.prepositions.pickPrepositionsQuestions(deck, 1);
  assert.equal(picked.length, 1);

  const weakWeight = captured.find((item) => item.word.triggerId === "trig-a")?.weight || 0;
  const strongWeight = captured.find((item) => item.word.triggerId === "trig-b")?.weight || 0;
  assert.ok(weakWeight > strongWeight);
});

test("sentence builder omits authored notes from immediate feedback", () => {
  const sentenceBank = [
    {
      id: "sb-formal-tip",
      category: "formal",
      difficulty: 3,
      english: "The central question is how to implement this in practice, not just in theory.",
      hebrew: "השאלה המרכזית היא כיצד ליישם זאת בפועל, ולא רק בתיאוריה.",
      english_tokens: ["The", "central", "question", "is", "how", "to", "implement", "this", "in", "practice", "not", "just", "in", "theory"],
      hebrew_tokens: ["השאלה", "המרכזית", "היא", "כיצד", "ליישם", "זאת", "בפועל", "ולא", "רק", "בתיאוריה"],
      english_distractors: ["do", "important", "why"],
      hebrew_distractors: ["מדוע", "לעשות", "החשובה"],
      notes: "כיצד is the formal version of איך (how). ליישם (to implement) is formal; colloquial would be לעשות (to do).",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, ["The", "central", "question", "is", "how", "to", "implement", "this", "in", "practice", "not", "just", "in", "theory"]);
  document.querySelector("#nextBtn").click();

  assert.equal(
    getFeedbackText(document),
    "Correct. The English sentence is The central question is how to implement this in practice, not just in theory."
  );
});

test("sentence builder keeps directional content edge-aligned and centers the word counter", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /\.home-lessons-card \.section-head\s*\{[^}]*align-items:\s*start;/s);
  assert.match(styles, /\.home-lessons-card \.section-head h2\s*\{[^}]*width:\s*100%;[^}]*text-align:\s*left;/s);
  assert.match(styles, /body\[data-ui-lang="he"\] \.home-lessons-card \.section-head h2\s*\{[^}]*text-align:\s*right;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-content-row\s*\{[^}]*justify-content:\s*flex-start;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-text\s*\{[^}]*text-align:\s*start;/s);
  assert.match(styles, /\.prompt-text\.english-prompt\s*\{[^}]*direction:\s*ltr;[^}]*unicode-bidi:\s*isolate;/s);
  assert.match(styles, /\.prompt-text\.hebrew\s*\{[^}]*font-family:\s*var\(--display-font\);/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-text\.hebrew\s*\{[^}]*text-align:\s*start;/s);
  assert.match(styles, /\.sentence-answer-line\.english\s*\{[^}]*text-align:\s*start;/s);
  assert.match(styles, /\.sentence-answer-line\.hebrew\s*\{[^}]*text-align:\s*start;/s);
  assert.match(styles, /\.sentence-answer-meta\s*\{[^}]*text-align:\s*center;/s);
});

test("game start intro bubbles use the same yalla message", async () => {
  const markup = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  ["lessonStartIntro", "sentenceBankIntro", "verbMatchIntro", "abbreviationIntro", "advConjIntro", "prepositionsIntro", "binyanBoardIntro", "handwritingIntro"].forEach((id) => {
    assert.match(
      markup,
      new RegExp(`id="${id}"[\\s\\S]*?<p class="second-chance-bubble"[^>]*>יאללה!<\\/p>[\\s\\S]*?intro-character-sprite`)
    );
  });

  const vocabulary = Array.from({ length: 8 }, (_, index) => ({
    id: `word-${index + 1}`,
    category: "core_advanced",
    en: `word ${index + 1}`,
    he: `מילה${index + 1}`,
    heNiqqud: `מִילָה${index + 1}`,
    utility: 80 - index,
    source: "test",
  }));
  const abbreviations = Array.from({ length: 8 }, (_, index) => ({
    id: `abbr-${index + 1}`,
    abbr: `א${index + 1}׳`,
    expansionHe: `ארוך ${index + 1}`,
    english: `abbreviation ${index + 1}`,
  }));
  const harness = loadAppHarness(vocabulary, abbreviations);

  harness.app.wordMatch.startLessonMatch();
  assert.equal(harness.state.wordMatch.introActive, true);
  assert.equal(harness.document.querySelector("#lessonStartIntro").classList.contains("active"), true);
  await waitForTimers();
  assert.equal(harness.state.wordMatch.introActive, false);
  assert.ok(harness.state.wordMatch.startMs > 0);
  harness.goHome();

  harness.app.wordMatch.startAbbrMatch();
  assert.equal(harness.state.wordMatch.introActive, true);
  assert.equal(harness.document.querySelector("#abbreviationIntro").classList.contains("active"), true);
  await waitForTimers();
  assert.equal(harness.state.wordMatch.introActive, false);
  assert.ok(harness.state.wordMatch.startMs > 0);
  harness.goHome();

  harness.app.binyanBoard.startBinyanBoard();
  assert.equal(harness.state.binyanBoard.introActive, true);
  assert.equal(harness.document.querySelector("#binyanBoardIntro").classList.contains("active"), true);
  await waitForTimers();
  assert.equal(harness.state.binyanBoard.introActive, false);
  assert.ok(harness.state.binyanBoard.startMs > 0);
  harness.goHome();
});

test("translation match records both mismatched words, including the Hebrew (right) card", () => {
  const vocabulary = Array.from({ length: 8 }, (_, index) => ({
    id: `word-${index + 1}`,
    category: "core_advanced",
    en: `word ${index + 1}`,
    he: `מילה${index + 1}`,
    heNiqqud: `מִילָה${index + 1}`,
    utility: 80 - index,
    source: "test",
  }));
  const harness = loadAppHarness(vocabulary);

  harness.app.wordMatch.startLessonMatch();
  harness.app.wordMatch.beginWordMatchFromIntro();

  const ctx = harness.state.wordMatch;
  const leftCard = ctx.leftCards[0];
  const rightCard = ctx.rightCards.find((card) => card.pairId !== leftCard.pairId);
  assert.ok(leftCard && rightCard, "board has a mismatching left/right pair");

  const config = harness.app.wordMatch.buildConfig("lessonMatch");
  harness.app.matchEngine.handleLeft(config, leftCard.id);
  harness.app.matchEngine.handleRight(config, rightCard.id);

  assert.ok(ctx.sessionMistakeIds.includes(leftCard.pairId), "left (English) word recorded as a miss");
  assert.ok(ctx.sessionMistakeIds.includes(rightCard.pairId), "right (Hebrew) word recorded as a miss");
  assert.ok(harness.getProgressRecord(rightCard.pairId).attempts > 0, "right word's progress registered the attempt");
});

test("sentence builder gives English prompts explicit LTR prompt styling in Hebrew UI", () => {
  const sentenceBank = [
    {
      id: "sb-english-prompt-bidi",
      category: "formal",
      difficulty: 3,
      english: "One must consider the long-term implications before making a decision.",
      hebrew: "יש לשקול את ההשלכות ארוכות הטווח לפני קבלת החלטה.",
      english_tokens: ["One", "must", "consider", "the", "long-term", "implications", "before", "making", "a", "decision"],
      hebrew_tokens: ["יש", "לשקול", "את", "ההשלכות", "ארוכות", "הטווח", "לפני", "קבלת", "החלטה"],
      english_distractors: ["brief", "ignore", "afterward"],
      hebrew_distractors: ["קצר", "להתעלם", "לאחר מכן"],
      notes: "Formal register: יש לשקול means one should consider.",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  state.language = "he";
  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  const prompt = document.querySelector("#promptText");
  assert.equal(prompt.textContent, "One must consider the long-term implications before making a decision.");
  assert.equal(prompt.classList.contains("english-prompt"), true);
  assert.equal(prompt.classList.contains("hebrew"), false);
});

test("sentence builder base layout trims prompt, board, and feedback spacing without changing alignment", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-card\s*\{[^}]*padding:\s*0\.7rem 0\.8rem;[^}]*border:\s*1px solid var\(--line\);[^}]*background:\s*var\(--prompt-bg\);[^}]*gap:\s*0\.2rem;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-content-row\s*\{[^}]*min-height:\s*clamp\(3\.35rem,\s*5\.8vw,\s*4rem\);[^}]*padding-left:\s*0\.16rem;[^}]*padding-right:\s*0\.16rem;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-card\.has-prompt-control \.prompt-content-row\s*\{[^}]*padding-left:\s*0\.16rem;[^}]*padding-right:\s*0\.16rem;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-text\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*100%;[^}]*font-size:\s*clamp\(1\.36rem,\s*3\.7vw,\s*1\.86rem\);[^}]*line-height:\s*1\.18;/s);
  assert.match(styles, /\.sentence-builder\s*\{[^}]*gap:\s*0\.68rem;/s);
  assert.match(styles, /\.sentence-answer-line\s*\{[^}]*min-height:\s*2\.9rem;[^}]*line-height:\s*1\.68;/s);
  assert.match(styles, /\.sentence-token-bank\s*\{[^}]*gap:\s*0\.44rem 0\.34rem;/s);
  assert.match(styles, /\.sentence-answer-meta\s*\{[^}]*font-size:\s*0\.8rem;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.feedback-tray\s*\{[^}]*padding:\s*0\.64rem 0\.8rem 0\.68rem;/s);
});

test("binyanim function hint fits long revealed labels", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /\.prompt-function-hint\s*\{[^}]*box-sizing:\s*border-box;/s);
  assert.match(styles, /\.prompt-card\.mode-binyan-board \.prompt-function-hint\s*\{[^}]*max-width:\s*min\(38%,\s*12\.8rem\);[^}]*padding-inline:\s*0\.78rem;[^}]*text-overflow:\s*clip;/s);
  assert.match(styles, /\.prompt-card\.mode-binyan-board \.prompt-function-hint\.is-revealed\s*\{[^}]*font-size:\s*0\.72rem;/s);
});

test("sentence builder mobile breakpoint uses smaller sentence tokens and a tighter footer stack", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const mobileChoiceBtn = styles.match(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.choice-btn\s*\{[^}]*min-height:\s*(\d+)px;/s);
  const mobileSentenceToken = styles.match(/@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.sentence-token\s*\{[^}]*min-height:\s*(\d+)px;[^}]*padding:\s*0\.32rem 0\.6rem;[^}]*border-radius:\s*4px;[^}]*font-size:\s*0\.9rem;/s);

  assert.ok(mobileChoiceBtn);
  assert.ok(mobileSentenceToken);
  assert.ok(Number(mobileSentenceToken[1]) < Number(mobileChoiceBtn[1]));
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-content-row\s*\{[^}]*min-height:\s*3\.08rem;[^}]*padding-left:\s*0\.04rem;[^}]*padding-right:\s*0\.04rem;/s);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-card\.has-prompt-control \.prompt-content-row\s*\{[^}]*padding-left:\s*0\.04rem;[^}]*padding-right:\s*0\.04rem;/s);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-text\s*\{[^}]*max-width:\s*100%;[^}]*font-size:\s*clamp\(1\.34rem,\s*5\.9vw,\s*1\.66rem\);/s);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.lesson-footer\s*\{[^}]*bottom:\s*calc\(4\.05rem \+ env\(safe-area-inset-bottom\)\);[^}]*gap:\s*0\.34rem;/s);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.feedback-tray\s*\{[^}]*padding:\s*0\.52rem 0\.66rem 0\.58rem;/s);
  assert.match(styles, /@media \(max-width: 767px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.next-btn\s*\{[^}]*min-height:\s*50px;[^}]*font-size:\s*0\.96rem;/s);
});

test("sentence builder short mobile breakpoint adds an extra compaction step", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /@media \(max-width: 767px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-content-row\s*\{[^}]*min-height:\s*2\.9rem;[^}]*padding-left:\s*0\.02rem;[^}]*padding-right:\s*0\.02rem;/s);
  assert.match(styles, /@media \(max-width: 767px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-card\.has-prompt-control \.prompt-content-row\s*\{[^}]*padding-left:\s*0\.02rem;[^}]*padding-right:\s*0\.02rem;/s);
  assert.match(styles, /@media \(max-width: 767px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-text\s*\{[^}]*max-width:\s*100%;[^}]*font-size:\s*clamp\(1\.24rem,\s*5\.3vw,\s*1\.48rem\);/s);
  assert.match(styles, /@media \(max-width: 767px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.sentence-token\s*\{[^}]*min-height:\s*36px;[^}]*padding:\s*0\.28rem 0\.56rem;[^}]*border-radius:\s*4px;[^}]*font-size:\s*0\.86rem;/s);
  assert.match(styles, /@media \(max-width: 767px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.feedback-tray\s*\{[^}]*padding:\s*0\.46rem 0\.6rem 0\.5rem;/s);
  assert.match(styles, /@media \(max-width: 767px\) and \(max-height: 760px\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.next-btn\s*\{[^}]*min-height:\s*46px;[^}]*font-size:\s*0\.92rem;/s);
});

test("gameplay header styling uses a flat accent progress bar and a top-right status pill", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const markup = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(markup, /class="shell-topbar-actions"[\s\S]*id="shellGameplayPill"[\s\S]*id="shellHomeBtn"/s);
  assert.match(styles, /\.shell-topbar-actions\s*\{[^}]*display:\s*inline-flex;[^}]*justify-content:\s*flex-end;[^}]*direction:\s*ltr;/s);
  assert.match(styles, /\.shell-topbar-home\s*\{[^}]*min-width:\s*2\.62rem;[^}]*min-height:\s*2\.62rem;[^}]*font-size:\s*1\.05rem;/s);
  assert.match(styles, /body\[data-ui-lang="he"\] \.shell-topbar-actions\s*\{[^}]*flex-direction:\s*row-reverse;/s);
  assert.match(styles, /\.shell-gameplay-pill\s*\{[^}]*padding:\s*0\.46rem 0\.78rem;[^}]*border-radius:\s*999px;/s);
  assert.match(styles, /\.progress-strip\s*\{[^}]*height:\s*8px;[^}]*background:\s*var\(--line\);/s);
  assert.match(styles, /\.progress-fill\s*\{[^}]*background:\s*var\(--brand\);/s);
  assert.doesNotMatch(styles, /\.progress-fill::after/);
  assert.match(styles, /\.progress-strip\[data-streak-tier="4"\] \.progress-fill,\s*\.progress-fill\[data-streak-tier="4"\]\s*\{[^}]*brightness\(1\.28\)/s);
});

test("all viewports share the single-page layout with the bottom nav", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const markup = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.doesNotMatch(markup, /class="desktop-nav\b/);
  // The bottom nav carries home/review/settings on every device.
  assert.match(markup, /id="mobileBottomNav"[\s\S]*data-route="home"[\s\S]*data-route="review"[\s\S]*data-route="settings"/s);
  // The old desktop "hub" layout is gone entirely.
  assert.doesNotMatch(styles, /data-desktop-hub-layout="true"/);
  // The bottom nav stays available on the home page and during gameplay at every width.
  const navHideRules = styles.match(/[^{}]*\.mobile-bottom-nav[^{}]*\{[^}]*display:\s*none[^}]*\}/g) || [];
  assert.equal(navHideRules.length, 0);
  // On wide screens the bottom nav is centered rather than stretched edge-to-edge.
  assert.match(styles, /@media \(min-width: 1024px\)\s*\{[\s\S]*?\.mobile-bottom-nav\s*\{[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\);/s);
});

test("gameplay boards use the full shell width and center safely outside widescreen layouts", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /\.app-shell\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(styles, /body\[data-gameplay-active="true"\] #homeView\.active\s*\{[^}]*width:\s*100%;[^}]*margin-block:\s*auto;/s);
  assert.doesNotMatch(styles, /body\[data-gameplay-active="true"\] #homeView\.active\s*\{[^}]*margin-block:\s*0;/s);
  assert.match(styles, /@media \(min-width: 768px\) and \(max-width: 1023px\)\s*\{[\s\S]*?\.prompt-card\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(styles, /@media \(min-width: 768px\) and \(max-width: 1023px\)\s*\{[\s\S]*?\.choices\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/s);
  assert.match(styles, /@media \(min-width: 600px\)\s*\{[\s\S]*?\.lesson-shell\.mode-standard:not\(\.mode-sentence-bank\):not\(\.mode-binyan-board\):not\(\.mode-handwriting\) > \.choices:not\(\.match-grid\):not\(\.summary-grid\)\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);[^}]*grid-auto-rows:\s*1fr;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.lesson-footer\s*\{[^}]*position:\s*static;/s);
  assert.match(styles, /\.handwriting-canvas\s*\{[^}]*width:\s*min\(100%,\s*88vw,\s*46vh,\s*30rem\);[^}]*max-width:\s*none;/s);
});

test("Sentences and Shema center their full board only on widescreen layouts", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /@media \(min-width: 768px\) and \(min-aspect-ratio: 4 \/ 3\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-content-row\s*\{[^}]*justify-content:\s*center;/s);
  assert.match(styles, /@media \(min-width: 768px\) and \(min-aspect-ratio: 4 \/ 3\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.prompt-text,[\s\S]*?\.prompt-text\.english-prompt\s*\{[^}]*margin-inline:\s*auto;[^}]*text-align:\s*center;/s);
  assert.match(styles, /@media \(min-width: 768px\) and \(min-aspect-ratio: 4 \/ 3\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.sentence-answer-line\s*\{[^}]*text-align:\s*center;/s);
  assert.match(styles, /@media \(min-width: 768px\) and \(min-aspect-ratio: 4 \/ 3\)\s*\{[\s\S]*?\.lesson-shell\.mode-sentence-bank \.sentence-token-bank\s*\{[^}]*justify-content:\s*center;/s);
});

test("home route uses safe vertical centering and leave warning text stays centered", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  // The document is locked at the small viewport height (svh is stable while
  // iOS toolbars show/hide, unlike dvh) and the shell body is the scroll
  // container, so the fixed bottom nav cannot drift during momentum scrolling
  // and centered content is never pushed below the fold on long pages.
  assert.match(styles, /body\s*\{[^}]*height:\s*100svh;[^}]*overflow:\s*hidden;/s);
  assert.match(styles, /\.app-shell\s*\{[^}]*height:\s*100%;[^}]*grid-template-rows:\s*auto minmax\(0,\s*1fr\);/s);
  assert.match(styles, /\.shell-body\s*\{[^}]*display:\s*grid;[^}]*min-height:\s*0;[^}]*overflow-y:\s*auto;/s);
  assert.match(styles, /\.page-stack\s*\{[^}]*display:\s*grid;[^}]*min-height:\s*100%;[^}]*grid-template-rows:\s*minmax\(0,\s*1fr\);[^}]*align-items:\s*start;/s);
  assert.match(styles, /#homeView\.active\s*\{[^}]*margin-block:\s*auto;/s);
  assert.match(styles, /#settingsView\.active\s*\{[^}]*margin-block:\s*auto;/s);
  assert.match(styles, /@media \(min-width: 1024px\)\s*\{[\s\S]*?\.shell-body\s*\{[^}]*display:\s*grid;/s);
  assert.match(styles, /body\[data-ui-lang="he"\] \.session-leave-dialog\s*\{[^}]*text-align:\s*center;/s);
});

test("desktop review and settings cards use start-aligned collapsible headers", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const markup = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(markup, /id="reviewPanelToggle"[\s\S]*aria-controls="reviewPanel"/s);
  assert.doesNotMatch(markup, /id="mostMissedToggle"/);
  assert.doesNotMatch(markup, /id="reviewAnalyticsToggle"/);
  assert.match(markup, /id="settingsToggle"[\s\S]*aria-controls="settingsPanel"/s);
  assert.match(markup, /class="review-section-title"[^>]*data-i18n="missed.title"/s);
  assert.match(markup, /class="review-section-title"[^>]*data-i18n="review.analyticsEyebrow"/s);
  assert.match(styles, /\.collapsible-toggle\s*\{[^}]*width:\s*100%;[^}]*text-align:\s*start;/s);
  assert.match(styles, /\.review-section-title\s*\{[^}]*text-align:\s*start;/s);
});

test("Hebrew progress bars fill from right to left", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(styles, /body\[data-ui-lang="he"\] \.progress-fill\s*\{[^}]*margin-left:\s*auto;[^}]*margin-right:\s*0;/s);
});

test("sentence builder uses compact phrase chips instead of prefilled english glue", () => {
  const sentenceBank = [
    {
      id: "sb-streamlined-english",
      category: "colloquial",
      difficulty: 2,
      english: "I don't have energy for this right now, we'll talk later.",
      hebrew: "אין לי כוח לזה עכשיו, נדבר אחר כך.",
      english_tokens: ["I", "don't", "have", "energy", "for this", "right now", "we'll", "talk", "later"],
      hebrew_tokens: ["אין", "לי", "כוח", "לזה", "עכשיו", "נדבר", "אחר", "כך"],
      english_distractors: ["more time", "tomorrow morning", "never"],
      hebrew_distractors: ["יש", "מחר", "דיברנו"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(getSentenceSlots(document).length, 9);
  assert.deepEqual(getSentenceStaticWordChunks(document), []);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "for this"));
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "right now"));

  fillSentenceAnswerByTap(document, ["I", "don't", "have", "energy", "for this", "right now", "we'll", "talk", "later"]);
  document.querySelector("#nextBtn").click();

  assert.match(getFeedbackText(document), /^Correct\. The English sentence is I don't have energy for this right now, we'll talk later\./);
});

test("sentence builder renders formal predicate phrases like is based on as a single chip", () => {
  const sentenceBank = [
    {
      id: "sb-based-on-phrase",
      category: "formal",
      difficulty: 3,
      english: "The analysis is based on several assumptions, which may not be accurate.",
      hebrew: "הניתוח מבוסס על מספר הנחות יסוד, שייתכן שאינן מדויקות.",
      english_tokens: ["The analysis", "is based on", "several assumptions", "which", "may not be", "accurate"],
      hebrew_tokens: ["הניתוח", "מבוסס", "על", "מספר", "הנחות", "יסוד", "שייתכן", "שאינן", "מדויקות"],
      english_distractors: ["The research", "depends on", "many assumptions"],
      hebrew_distractors: ["המחקר", "תלוי", "מוכחות"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(getSentenceSlots(document).length, 6);
  assert.deepEqual(getSentenceStaticWordChunks(document), []);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "is based on"));
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "is"), undefined);
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "based"), undefined);
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "on"), undefined);
});

test("sentence builder keeps right now as a single colloquial chip", () => {
  const sentenceBank = [
    {
      id: "sb-right-now-phrase",
      category: "colloquial",
      difficulty: 2,
      english: "Are you serious right now? That sounds completely ridiculous to me.",
      hebrew: "אתה רציני עכשיו? זה נשמע לי הזוי לגמרי.",
      english_tokens: ["Are you", "serious", "right now", "That sounds", "completely ridiculous", "to me"],
      hebrew_tokens: ["אתה", "רציני", "עכשיו", "זה", "נשמע", "לי", "הזוי", "לגמרי"],
      english_distractors: ["You look", "slightly weird", "totally normal"],
      hebrew_distractors: ["נראה", "קצת", "נורמלי"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.deepEqual(getSentenceStaticWordChunks(document), []);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "right now"));
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "right"), undefined);
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "now"), undefined);
});

test("sentence builder renders request scaffolds like Can we get as one option while keeping the row blank", () => {
  const sentenceBank = [
    {
      id: "sb-can-we-get-phrase",
      category: "professional",
      difficulty: 2,
      english: "Can we get clarification on this matter? It's not entirely clear.",
      hebrew: "אפשר לקבל הבהרה בנושא הזה? זה לא לגמרי ברור.",
      english_tokens: ["Can we get", "clarification", "on this matter", "It's not", "entirely clear"],
      hebrew_tokens: ["אפשר", "לקבל", "הבהרה", "בנושא", "הזה", "זה", "לא", "לגמרי", "ברור"],
      english_distractors: ["quick summary", "about that", "fully understood"],
      hebrew_distractors: ["הסבר", "על", "מובן"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(getSentenceSlots(document).length, 5);
  assert.deepEqual(getSentenceStaticWordChunks(document), []);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "Can we get"));
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "It's not"));
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "Can"), undefined);
});

test("sentence builder renders Hebrew meal compounds as one chip with shape-matched distractors", () => {
  const sentenceBank = [
    {
      id: "sb-hebrew-meal-compound",
      category: "everyday",
      difficulty: 1,
      english: "I want to plan dinner.",
      hebrew: "אני רוצה לתכנן ארוחת ערב.",
      english_tokens: ["I want", "to plan", "dinner"],
      hebrew_tokens: ["אני", "רוצה", "לתכנן", "ארוחת ערב"],
      english_distractors: ["need to cook", "lunch plans", "breakfast"],
      hebrew_distractors: ["ארוחת צהריים", "ארוחת בוקר", "צריך"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(getSentenceSlots(document).length, 4);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "ארוחת ערב"));
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "ארוחת צהריים"));
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "ארוחת בוקר"));
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "ארוחת"), undefined);
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "ערב"), undefined);
});

test("sentence builder attaches punctuation to the preceding answer chunk so commas do not hang alone", () => {
  const sentenceBank = [
    {
      id: "sb-inline-punctuation",
      category: "everyday",
      difficulty: 1,
      english: "I'm running a few minutes late, I'm already on my way.",
      hebrew: "אני מאחר בכמה דקות, כבר יוצא לדרך.",
      english_tokens: ["I'm", "running", "a", "few", "minutes", "late", "I'm", "on", "my", "way"],
      hebrew_tokens: ["אני", "מאחר", "בכמה", "דקות", "כבר", "יוצא", "לדרך"],
      english_distractors: ["hours", "returning", "still"],
      hebrew_distractors: ["שעות", "חוזר", "עוד"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  const answerLine = document.querySelector("#choiceContainer").querySelector(".sentence-answer-line");
  const topLevelStaticTexts = answerLine.children
    .filter((child) => child.classList.contains("sentence-static"))
    .map((child) => child.textContent);
  const attachedSuffixes = answerLine.querySelectorAll(".sentence-static-attached").map((child) => child.textContent);

  assert.equal(topLevelStaticTexts.includes(", "), false);
  assert.equal(topLevelStaticTexts.includes("."), false);
  assert.deepEqual(attachedSuffixes, [", ", "."]);
});

test("sentence builder keeps article-based english prompts fully blank by compacting phrase chips", () => {
  const sentenceBank = [
    {
      id: "sb-article-phrase",
      category: "everyday",
      difficulty: 1,
      english: "The soap ran out, we need to buy more.",
      hebrew: "נגמר הסבון, צריך לקנות.",
      english_tokens: ["The soap", "ran out", "we need", "to buy", "more"],
      hebrew_tokens: ["נגמר", "הסבון", "צריך", "לקנות"],
      english_distractors: ["hair gel", "shampoo bottle", "we want"],
      hebrew_distractors: ["נשאר", "השמפו", "רוצים"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(getSentenceSlots(document).length, 5);
  assert.deepEqual(getSentenceStaticWordChunks(document), []);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "The soap"));
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "we need"));
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "to buy"));
});

test("sentence builder keeps fused-form english prompts fully blank by compacting phrase chips", () => {
  const sentenceBank = [
    {
      id: "sb-restored-alignment",
      category: "formal",
      difficulty: 3,
      english: "It can be inferred from this that the model is not stable under certain conditions.",
      hebrew: "ניתן להסיק מכך כי המודל אינו יציב בתנאים מסוימים.",
      english_tokens: ["It", "can", "be", "inferred", "from this", "that", "the", "model", "is", "not", "stable", "under", "certain", "conditions"],
      hebrew_tokens: ["ניתן", "להסיק", "מכך", "כי", "המודל", "אינו", "יציב", "בתנאים", "מסוימים"],
      english_distractors: ["can see", "look at", "fully accurate"],
      hebrew_distractors: ["אפשר", "לראות", "מדויק"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.equal(getSentenceSlots(document).length, 14);
  assert.deepEqual(getSentenceStaticWordChunks(document), []);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "from this"));
});

test("sentence builder lets you drag into any blank and still supports tap-to-place fallback", () => {
  const sentenceBank = [
    {
      id: "sb-drag",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  dragSentenceTokenToSlot(document, "tomorrow", 4);
  dragSentenceTokenToSlot(document, "We", 0);
  placeSentenceTokenByTap(document, "will", 1);
  placeSentenceTokenByTap(document, "see", 2);
  placeSentenceTokenByTap(document, "you", 3);

  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify([
      "answer-0",
      "answer-1",
      "answer-2",
      "answer-3",
      "answer-4",
    ])
  );
  assert.equal(document.querySelector("#nextBtn").disabled, false);
});

test("sentence builder supports touch dragging on mobile/tablet layouts", () => {
  const sentenceBank = [
    {
      id: "sb-touch-drag",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { innerWidth: 768, sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  touchDragSentenceTokenToSlot(document, "tomorrow", 4);
  touchDragSentenceTokenToSlot(document, "We", 0);

  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify([
      "answer-0",
      "",
      "",
      "",
      "answer-4",
    ])
  );
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "We"), undefined);
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "tomorrow"), undefined);
});

test("sentence builder never strands a mouse drag ghost after dragstart", () => {
  const sentenceBank = [
    {
      id: "sb-ghost",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  const findBodyGhosts = () => document.body.children.filter(
    (child) => child?.classList?.contains?.("sentence-drag-ghost")
  );
  const fireDragEvent = (node, type, dataTransfer) => {
    (node.listeners[type] || []).forEach((handler) => handler({
      preventDefault() {},
      stopPropagation() {},
      target: node,
      currentTarget: node,
      dataTransfer,
    }));
  };
  const token = findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "We");

  const throwingDataTransfer = {
    ...createFakeDataTransfer(),
    setDragImage() {
      throw new Error("setDragImage unsupported");
    },
  };
  fireDragEvent(token, "dragstart", throwingDataTransfer);
  assert.equal(findBodyGhosts().length, 0);

  const workingDataTransfer = {
    ...createFakeDataTransfer(),
    setDragImage() {},
  };
  fireDragEvent(token, "dragstart", workingDataTransfer);
  assert.equal(findBodyGhosts().length, 1);
  fireDragEvent(token, "dragend", workingDataTransfer);
  assert.equal(findBodyGhosts().length, 0);
});

test("sentence builder contracts the bank after a word is used instead of keeping placeholders", () => {
  const sentenceBank = [
    {
      id: "sb-contracting-bank",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  const initialButtons = document.querySelector("#choiceContainer").querySelectorAll(".sentence-token");
  assert.equal(initialButtons.length, 7);

  placeSentenceTokenByTap(document, "We", 0);

  const bankButtons = document.querySelector("#choiceContainer").querySelectorAll(".sentence-token");
  assert.equal(bankButtons.length, 6);
  assert.equal(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "We"), undefined);
});

test("sentence builder inserts a dragged bank word into an occupied slot and shifts later words right", () => {
  const sentenceBank = [
    {
      id: "sb-insert-bank-into-occupied",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "We", 0);
  placeSentenceTokenByTap(document, "will", 1);
  dragSentenceTokenToSlot(document, "tomorrow", 4);
  dragSentenceTokenToSlot(document, "see", 1);

  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify([
      "answer-0",
      "answer-2",
      "answer-1",
      "",
      "answer-4",
    ])
  );
  assert.deepEqual(getSentenceSlotTexts(document), ["We", "see", "will", "", "tomorrow"]);
});

test("sentence builder returns the last word to the bank when an occupied-slot insert happens on a full row", () => {
  const sentenceBank = [
    {
      id: "sb-insert-full-overflow",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, ["We", "will", "see", "you", "tomorrow"]);
  dragSentenceTokenToSlot(document, "later", 1);

  assert.deepEqual(getSentenceSlotTexts(document), ["We", "later", "will", "see", "you"]);
  assert.ok(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "tomorrow"));
  assert.equal(document.querySelector("#nextBtn").disabled, false);
});

test("sentence builder inserts a dragged placed word into an occupied slot without collapsing earlier gaps", () => {
  const sentenceBank = [
    {
      id: "sb-insert-moved-word",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "We", 0);
  placeSentenceTokenByTap(document, "will", 2);
  placeSentenceTokenByTap(document, "see", 3);
  placeSentenceTokenByTap(document, "tomorrow", 4);
  dragPlacedSentenceToken(document, 4, 2);

  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify([
      "answer-0",
      "",
      "answer-4",
      "answer-1",
      "answer-2",
    ])
  );
  assert.deepEqual(getSentenceSlotTexts(document), ["We", "", "tomorrow", "will", "see"]);
});

test("sentence builder lets you tap a word to fill the next empty line", () => {
  const sentenceBank = [
    {
      id: "sb-next-empty-tap",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  dragSentenceTokenToSlot(document, "tomorrow", 4);
  placeSentenceTokenInNextEmptySlotByTap(document, "We");
  placeSentenceTokenInNextEmptySlotByTap(document, "will");
  placeSentenceTokenInNextEmptySlotByTap(document, "see");
  placeSentenceTokenInNextEmptySlotByTap(document, "you");

  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify([
      "answer-0",
      "answer-1",
      "answer-2",
      "answer-3",
      "answer-4",
    ])
  );
  assert.equal(document.querySelector("#nextBtn").disabled, false);
});

test("sentence builder keyboard flow can select a bank word and insert it into an occupied slot", () => {
  const sentenceBank = [
    {
      id: "sb-keyboard-insert",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "We", 0);
  placeSentenceTokenByTap(document, "will", 1);
  dragSentenceTokenToSlot(document, "tomorrow", 4);

  pressKey(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "see"), " ");
  assert.equal(state.sentenceBank.currentQuestion.selectedBankTokenId, "answer-2");

  pressKey(getSentenceSlots(document)[1], "Enter");

  assert.equal(state.sentenceBank.currentQuestion.selectedBankTokenId, "");
  assert.deepEqual(getSentenceSlotTexts(document), ["We", "see", "will", "", "tomorrow"]);
});

test("sentence builder keyboard flow removes filled slots and clears selection", () => {
  const sentenceBank = [
    {
      id: "sb-keyboard-remove-escape",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "We", 0);
  pressKey(getSentenceSlots(document)[0], "Backspace");
  assert.deepEqual(getSentenceSlotTexts(document), ["", "", "", "", ""]);

  pressKey(findVisibleButtonByText(document.querySelector("#choiceContainer"), ".sentence-token", "see"), " ");
  assert.equal(state.sentenceBank.currentQuestion.selectedBankTokenId, "answer-2");
  pressKey(getSentenceSlots(document)[0], "Escape");
  assert.equal(state.sentenceBank.currentQuestion.selectedBankTokenId, "");
});

test("sentence builder filters exact-synonym distractors from the prepared deck", () => {
  const harness = loadAppHarness([]);
  const deck = harness.app.sentenceBank.prepareSentenceBankDeck([
    {
      id: "sb-synonym-filter",
      category: "test",
      difficulty: 2,
      english: "But how accurate?",
      hebrew: "אך כיצד מדויקות",
      english_tokens: ["but", "how", "accurate"],
      hebrew_tokens: ["אך", "כיצד", "מדויקות"],
      english_distractors: ["however", "why", "correct", "reliable"],
      hebrew_distractors: ["אבל", "מדוע", "איך", "נכונות", "מוכחות"],
      notes: "",
    },
  ]);

  assert.deepEqual(deck[0].englishDistractors, ["why", "reliable"]);
  assert.deepEqual(deck[0].hebrewDistractors, ["מדוע", "מוכחות"]);
});

test("sentence builder filters about/on distractors as too close to be fair", () => {
  const harness = loadAppHarness([]);
  const deck = harness.app.sentenceBank.prepareSentenceBankDeck([
    {
      id: "sb-about-on-filter",
      category: "formal",
      difficulty: 2,
      english: "Can we get clarification on this matter?",
      hebrew: "אפשר לקבל הבהרה בנושא הזה?",
      english_tokens: ["Can", "we", "get", "clarification", "on", "this", "matter"],
      hebrew_tokens: ["אפשר", "לקבל", "הבהרה", "בנושא", "הזה"],
      english_distractors: ["about", "explanation", "that"],
      hebrew_distractors: ["על", "הסבר", "ההוא"],
      notes: "",
    },
  ]);

  assert.deepEqual(deck[0].englishDistractors, ["explanation", "that"]);
  assert.deepEqual(deck[0].hebrewDistractors, ["על", "הסבר", "ההוא"]);
});

test("sentence builder filters hold on/wait up distractors as too close to be fair", () => {
  const harness = loadAppHarness([]);
  const deck = harness.app.sentenceBank.prepareSentenceBankDeck([
    {
      id: "sb-hold-on-wait-up-filter",
      category: "colloquial",
      difficulty: 1,
      english: "Bro hold on, I'll get back to you in a sec.",
      hebrew: "אחי חכה, אני אענה לך בעוד שנייה.",
      english_tokens: ["Bro", "hold on", "I'll get back", "to you", "in a sec"],
      hebrew_tokens: ["אחי", "חכה", "אני אענה", "לך", "בעוד שנייה"],
      english_distractors: ["wait up", "my friend", "right now"],
      hebrew_distractors: ["חבר שלי", "כרגע", "עוד מעט"],
      notes: "",
    },
  ]);

  assert.deepEqual(deck[0].englishDistractors, ["my friend", "right now"]);
  assert.deepEqual(deck[0].hebrewDistractors, ["חבר שלי", "כרגע", "עוד מעט"]);
});

test("sentence builder accepts an explicitly reviewed Hebrew here/very alternate", () => {
  const sentenceBank = [
    {
      id: "sb-hot-here",
      category: "everyday",
      difficulty: 1,
      english: "Can you open the window? It's very hot here.",
      hebrew: "אפשר לפתוח את החלון? חם כאן מאוד.",
      english_tokens: ["Can", "you", "open", "the", "window", "It's", "very", "hot", "here"],
      hebrew_tokens: ["אפשר", "לפתוח", "את", "החלון", "חם", "כאן", "מאוד"],
      hebrew_alternates: [{
        text: "אפשר לפתוח את החלון? חם מאוד כאן.",
        tokens: ["אפשר", "לפתוח", "את", "החלון", "חם", "מאוד", "כאן"],
      }],
      english_distractors: ["close", "door", "cold"],
      hebrew_distractors: ["לסגור", "הדלת", "קר"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, ["אפשר", "לפתוח", "את", "החלון", "חם", "מאוד", "כאן"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 2);
  assert.match(getFeedbackText(document), /^Correct\. The Hebrew sentence is אפשר לפתוח את החלון\? חם מאוד כאן\./);
  assert.ok(getSentenceSlots(document).every((slot) => slot.classList.contains("correct") && !slot.classList.contains("wrong")));
});

test("sentence builder accepts an explicitly reviewed Hebrew degree-word alternate", () => {
  const sentenceBank = [
    {
      id: "sb-not-clear",
      category: "professional",
      difficulty: 2,
      english: "It's not entirely clear.",
      hebrew: "זה לא לגמרי ברור.",
      english_tokens: ["It's", "not", "entirely", "clear"],
      hebrew_tokens: ["זה", "לא", "לגמרי", "ברור"],
      hebrew_alternates: [{
        text: "זה לא ברור לגמרי.",
        tokens: ["זה", "לא", "ברור", "לגמרי"],
      }],
      english_distractors: ["fully", "understood"],
      hebrew_distractors: ["מאוד", "מובן"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, ["זה", "לא", "ברור", "לגמרי"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 3);
  assert.match(getFeedbackText(document), /^Correct\. The Hebrew sentence is זה לא ברור לגמרי\./);
  assert.ok(getSentenceSlots(document).every((slot) => slot.classList.contains("correct") && !slot.classList.contains("wrong")));
});

function loadRealSentenceBankEntries(ids) {
  const sourcePath = path.join(__dirname, "..", "sentence-bank-data.js");
  const context = { console, globalThis: null, window: null };
  context.globalThis = context;
  context.window = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, "utf8"), context, { filename: sourcePath });
  const byId = new Map(context.IvriQuestSentenceBank.getSentenceBank().map((entry) => [entry.id, entry]));
  return ids.map((id) => JSON.parse(JSON.stringify(byId.get(id))));
}

function answerRealSentenceInHebrew(id, tokens) {
  const harness = loadAppHarness([], [], [], { sentenceBank: loadRealSentenceBankEntries([id]) });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, tokens);
  document.querySelector("#nextBtn").click();
  return { document, state };
}

// The feminine tiles have to be rendered for the tap to land at all, so this
// covers both halves: the chip reaches the pool, and the answer is accepted.
test("sentence builder lets a learner answer in the feminine on a gender-alternate row", () => {
  const { document } = answerRealSentenceInHebrew(
    "everyday_32",
    ["אני", "לא", "זוכרת", "איפה", "שמתי", "את", "המפתחות"]
  );

  assert.match(getFeedbackText(document), /^Correct\. The Hebrew sentence is אני לא זוכרת איפה שמתי את המפתחות\./);
  assert.ok(getSentenceSlots(document).every((slot) => slot.classList.contains("correct") && !slot.classList.contains("wrong")));
});

// colloquial_48 needs three separate feminine chips against the 12-tile ceiling,
// so it is the row where distractor capping is most likely to drop one.
test("sentence builder keeps every required gender chip when the tile pool is capped", () => {
  const { document } = answerRealSentenceInHebrew(
    "colloquial_48",
    ["תשלחי", "לי", "מיקום", "כשאת", "מגיעה"]
  );

  assert.match(getFeedbackText(document), /^Correct\. The Hebrew sentence is תשלחי לי מיקום כשאת מגיעה\./);
  assert.ok(getSentenceSlots(document).every((slot) => slot.classList.contains("correct") && !slot.classList.contains("wrong")));
});

test("sentence builder rejects unreviewed adjacent modifier swaps", () => {
  const sentenceBank = [
    {
      id: "sb-no-global-modifier-swap",
      category: "formal",
      difficulty: 3,
      english: "There is not enough existing evidence.",
      hebrew: "אין די בראיות הקיימות.",
      english_tokens: ["There is not", "enough", "existing", "evidence"],
      hebrew_tokens: ["אין", "די", "בראיות", "הקיימות"],
      english_distractors: ["There is", "plenty of", "new", "proof"],
      hebrew_distractors: ["יש", "הרבה", "חדשות", "הוכחות"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, ["די", "אין", "בראיות", "הקיימות"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 0);
  assert.equal(state.sentenceBank.wrongAnswers, 1);
  assert.match(getFeedbackText(document), /^Not quite\. The Hebrew sentence is אין די בראיות הקיימות\./);
});

test("sentence builder wrong answers enqueue review in the same direction without awarding review score", async () => {
  const sentenceBank = [
    {
      id: "sb-review",
      category: "everyday",
      difficulty: 1,
      english: "See you later.",
      hebrew: "נתראה אחר כך.",
      english_tokens: ["See", "you", "later"],
      hebrew_tokens: ["נתראה", "אחר", "כך"],
      english_distractors: ["now", "tomorrow", "again"],
      hebrew_distractors: ["היום", "עוד", "שם"],
      notes: "A casual goodbye for now.",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "later", 0);
  placeSentenceTokenByTap(document, "you", 1);
  placeSentenceTokenByTap(document, "See", 2);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 0);
  assert.equal(state.sentenceBank.wrongAnswers, 1);
  assert.equal(JSON.stringify(state.sentenceBank.reviewQueue), JSON.stringify([{ sentenceId: "sb-review", direction: "he2en" }]));
  assert.match(getFeedbackText(document), /Not quite\. The English sentence is See you later\./);

  harness.nextSentenceBankQuestion();
  await waitForTimers();
  if (state.sentenceBank.introActive) {
    harness.app.sentenceBank.beginSentenceBankFromIntro();
  }

  assert.equal(state.sentenceBank.currentQuestion.isReview, true);
  assert.equal(state.sentenceBank.currentQuestion.direction, "he2en");
  fillSentenceAnswerByTap(document, ["See", "you", "later"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 0);
  assert.equal(state.sentenceProgress["sb-review::he2en"].attempts, 2);
  assert.equal(state.sentenceProgress["sb-review::he2en"].correct, 1);
  assert.equal(state.sentenceProgress["sb-review::he2en"].misses, 1);
});

test("sentence builder accepts an alternate Hebrew speaker-gender form when the English leaves it unspecified", () => {
  const sentenceBank = [
    {
      id: "sb-gender-alt",
      category: "colloquial",
      difficulty: 3,
      english: "She did something shady to me, I don't trust her anymore.",
      hebrew: "היא עשתה לי קטע מסריח, אני לא סומך עליה יותר.",
      hebrew_alternates: [
        {
          text: "היא עשתה לי קטע מסריח, אני לא סומכת עליה יותר.",
          tokens: ["היא", "עשתה", "לי", "קטע", "מסריח", "אני", "לא", "סומכת", "עליה", "יותר"],
        },
      ],
      english_tokens: ["She", "did", "something", "shady", "to", "me", "I", "don't", "trust", "her", "anymore"],
      hebrew_tokens: ["היא", "עשתה", "לי", "קטע", "מסריח", "אני", "לא", "סומך", "עליה", "יותר"],
      english_distractors: ["he", "him", "nice"],
      hebrew_distractors: ["הוא", "עשה", "סומכת"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  fillSentenceAnswerByTap(document, ["היא", "עשתה", "לי", "קטע", "מסריח", "אני", "לא", "סומכת", "עליה", "יותר"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 4);
  assert.match(getFeedbackText(document), /^Correct\. The Hebrew sentence is היא עשתה לי קטע מסריח, אני לא סומכת עליה יותר\./);
  assert.ok(getSentenceSlots(document).every((slot) => slot.classList.contains("correct") && !slot.classList.contains("wrong")));
});

test("sentence builder caps distractor tiles on long sentences but keeps alternate-required tiles", () => {
  const sentenceBank = [
    {
      id: "sb-tile-cap",
      category: "colloquial",
      difficulty: 3,
      english: "She did something shady to me, I don't trust her anymore.",
      hebrew: "היא עשתה לי קטע מסריח, אני לא סומך עליה יותר.",
      hebrew_alternates: [
        {
          text: "היא עשתה לי קטע מסריח, אני לא סומכת עליה יותר.",
          tokens: ["היא", "עשתה", "לי", "קטע", "מסריח", "אני", "לא", "סומכת", "עליה", "יותר"],
        },
      ],
      english_tokens: ["She", "did", "something", "shady", "to", "me", "I", "don't", "trust", "her", "anymore"],
      hebrew_tokens: ["היא", "עשתה", "לי", "קטע", "מסריח", "אני", "לא", "סומך", "עליה", "יותר"],
      english_distractors: ["he", "him", "nice"],
      hebrew_distractors: ["הוא", "עשה", "סומכת", "עליו", "טוב", "רע"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  const tiles = Array.from(state.sentenceBank.currentQuestion.bankTokens);
  // 10 target tokens + capped distractors (12 - 10 floored at 3) = 3 distractors = 13 tiles.
  assert.equal(tiles.length, 13);
  assert.equal(tiles.filter((token) => token.isCorrect === false).length, 3);
  // The gender-alternate's distinct token must survive the cap so the alternate stays buildable.
  assert.ok(tiles.some((token) => token.text === "סומכת"));
});

test("sentence builder keeps מוצאי שבת split and accepts both כאילו orders", () => {
  const sentenceBank = [
    {
      id: "sb-motzash",
      category: "everyday",
      difficulty: 2,
      english: "He texted me Saturday night as if nothing happened.",
      hebrew: "הוא שלח לי הודעה במוצאי שבת כאילו לא קרה כלום.",
      hebrew_alternates: [
        {
          text: "הוא שלח לי הודעה במוצאי שבת כאילו כלום לא קרה.",
          tokens: ["הוא", "שלח", "לי", "הודעה", "במוצאי", "שבת", "כאילו", "כלום", "לא קרה"],
        },
      ],
      english_tokens: ["He", "texted", "me", "Saturday", "night", "as if", "nothing", "happened"],
      hebrew_tokens: ["הוא", "שלח", "לי", "הודעה", "במוצאי", "שבת", "כאילו", "לא קרה", "כלום"],
      english_distractors: ["called", "Friday", "morning"],
      hebrew_distractors: ["בלילה", "מחר", "אחרי"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  assert.ok(Array.from(state.sentenceBank.currentQuestion.targetTokens).includes("במוצאי"));
  assert.ok(Array.from(state.sentenceBank.currentQuestion.targetTokens).includes("שבת"));
  assert.equal(Array.from(state.sentenceBank.currentQuestion.targetTokens).includes("מוצאי שבת"), false);
  assert.ok(Array.from(state.sentenceBank.currentQuestion.bankTokens).some((token) => token.text === "בלילה"));

  fillSentenceAnswerByTap(document, ["הוא", "שלח", "לי", "הודעה", "במוצאי", "שבת", "כאילו", "כלום", "לא קרה"]);
  document.querySelector("#nextBtn").click();

  assert.equal(state.sessionScore, 3);
  assert.match(getFeedbackText(document), /^Correct\. The Hebrew sentence is הוא שלח לי הודעה במוצאי שבת כאילו כלום לא קרה\./);
});

test("sentence builder removes and moves placed words without collapsing the slot layout", () => {
  const sentenceBank = [
    {
      id: "sb-move",
      category: "everyday",
      difficulty: 1,
      english: "See you soon.",
      hebrew: "נתראה בקרוב.",
      english_tokens: ["See", "you", "soon"],
      hebrew_tokens: ["נתראה", "בקרוב"],
      english_distractors: ["later"],
      hebrew_distractors: ["מחר"],
      notes: "",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  dragSentenceTokenToSlot(document, "soon", 2);
  dragSentenceTokenToSlot(document, "See", 0);
  getSentenceSlots(document)[2].click();
  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify(["answer-0", "", ""])
  );

  placeSentenceTokenByTap(document, "soon", 2);
  dragPlacedSentenceToken(document, 0, 1);
  assert.equal(
    JSON.stringify(Array.from(state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify(["", "answer-0", "answer-2"])
  );
});

test("sentence builder restores partially filled non-sequential slots from persisted session state", () => {
  const sentenceBank = [
    {
      id: "sb-restore",
      category: "everyday",
      difficulty: 1,
      english: "I need to buy milk and bread, there's nothing at home.",
      hebrew: "אני צריך לקנות חלב ולחם, אין כלום בבית.",
      english_tokens: ["I", "need", "to", "buy", "milk", "and", "bread", "there's", "nothing", "at", "home"],
      hebrew_tokens: ["אני", "צריך", "לקנות", "חלב", "ולחם", "אין", "כלום", "בבית"],
      english_distractors: ["sell", "everything"],
      hebrew_distractors: ["למכור", "הכל"],
      notes: "",
    },
  ];
  const firstHarness = loadAppHarness([], [], [], { sentenceBank });
  firstHarness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  firstHarness.state.mode = "sentenceBank";
  firstHarness.state.sentenceBank.active = true;
  firstHarness.nextSentenceBankQuestion();

  dragSentenceTokenToSlot(firstHarness.document, "home", 10);
  dragSentenceTokenToSlot(firstHarness.document, "I", 0);
  dragSentenceTokenToSlot(firstHarness.document, "buy", 3);

  const restoredHarness = loadAppHarness([], [], [], {
    sentenceBank,
    localStorageData: firstHarness.localStorage.__dump(),
  });

  assert.equal(restoredHarness.state.mode, "sentenceBank");
  assert.ok(restoredHarness.state.sentenceBank.currentQuestion);
  assert.equal(
    JSON.stringify(Array.from(restoredHarness.state.sentenceBank.currentQuestion.slotTokenIds)),
    JSON.stringify([
      "answer-0",
      "",
      "",
      "answer-3",
      "",
      "",
      "",
      "",
      "",
      "",
      "answer-10",
    ])
  );
});

test("sentence builder drops stale restored questions when the live sentence entry changes", () => {
  const oldSentenceBank = [
    {
      id: "sb-stale",
      category: "colloquial",
      difficulty: 1,
      english: "Wow I saw it, cool. Send me the details",
      hebrew: "וואלה ראיתי, מגניב. שלח לי את הפרטים",
      english_tokens: ["Wow", "I", "saw", "it", "cool", "Send", "me", "the", "details"],
      hebrew_tokens: ["וואלה", "ראיתי", "מגניב", "שלח", "לי", "את", "הפרטים"],
      english_distractors: ["Maybe", "later"],
      hebrew_distractors: ["אולי", "אחר כך"],
      notes: "",
    },
  ];
  const updatedSentenceBank = [
    {
      id: "sb-stale",
      category: "colloquial",
      difficulty: 1,
      english: "Wow, I saw it. Cool. Send me the details.",
      hebrew: "וואלה, ראיתי את זה. מגניב. שלח לי את הפרטים.",
      english_tokens: ["Wow", "I", "saw", "it", "Cool", "Send", "me", "the", "details"],
      hebrew_tokens: ["וואלה", "ראיתי", "את", "זה", "מגניב", "שלח", "לי", "הפרטים"],
      english_distractors: ["Maybe", "later"],
      hebrew_distractors: ["אולי", "אחר כך"],
      notes: "",
    },
  ];

  const firstHarness = loadAppHarness([], [], [], { sentenceBank: oldSentenceBank });
  firstHarness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  firstHarness.state.mode = "sentenceBank";
  firstHarness.state.lastPlayedMode = "sentenceBank";
  firstHarness.state.sentenceBank.active = true;
  firstHarness.nextSentenceBankQuestion();
  firstHarness.app.persistence.persistSessionState();

  assert.equal(firstHarness.state.sentenceBank.currentQuestion.prompt, "Wow I saw it, cool. Send me the details");

  const restoredHarness = loadAppHarness([], [], [], {
    sentenceBank: updatedSentenceBank,
    localStorageData: firstHarness.localStorage.__dump(),
  });

  assert.equal(restoredHarness.state.mode, "lesson");
  assert.equal(restoredHarness.state.route, "home");
  assert.equal(restoredHarness.state.lastPlayedMode, "sentenceBank");
  assert.equal(restoredHarness.state.sentenceBank.active, false);
  assert.equal(restoredHarness.state.sentenceBank.currentQuestion, null);
});

test("sentence builder drops stale restored questions when only the sentence alternates change", () => {
  const baseSentence = {
    id: "sb-stale-alternates",
    category: "everyday",
    difficulty: 1,
    english: "We will see you tomorrow.",
    hebrew: "נראה אותך מחר.",
    english_tokens: ["We", "will", "see", "you", "tomorrow"],
    hebrew_tokens: ["נראה", "אותך", "מחר"],
    english_distractors: ["later", "them"],
    hebrew_distractors: ["עכשיו", "אותם"],
    notes: "",
  };
  const oldSentenceBank = [{ ...baseSentence }];
  const updatedSentenceBank = [{
    ...baseSentence,
    hebrew_alternates: [
      { text: "מחר נראה אותך.", tokens: ["מחר", "נראה", "אותך"] },
    ],
  }];

  const firstHarness = loadAppHarness([], [], [], { sentenceBank: oldSentenceBank });
  firstHarness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  firstHarness.state.mode = "sentenceBank";
  firstHarness.state.sentenceBank.active = true;
  firstHarness.nextSentenceBankQuestion();
  firstHarness.app.persistence.persistSessionState();

  const restoredHarness = loadAppHarness([], [], [], {
    sentenceBank: updatedSentenceBank,
    localStorageData: firstHarness.localStorage.__dump(),
  });

  assert.equal(restoredHarness.state.mode, "lesson");
  assert.equal(restoredHarness.state.route, "home");
  assert.equal(restoredHarness.state.sentenceBank.active, false);
  assert.equal(restoredHarness.state.sentenceBank.currentQuestion, null);
});

test("sentence builder drops stale restored questions when only the sentence distractors change", () => {
  const baseSentence = {
    id: "sb-stale-distractors",
    category: "everyday",
    difficulty: 1,
    english: "We will see you tomorrow.",
    hebrew: "נראה אותך מחר.",
    english_tokens: ["We", "will", "see", "you", "tomorrow"],
    hebrew_tokens: ["נראה", "אותך", "מחר"],
    english_distractors: ["later", "them"],
    hebrew_distractors: ["עכשיו", "אותם"],
    notes: "",
  };
  const oldSentenceBank = [{ ...baseSentence }];
  const updatedSentenceBank = [{
    ...baseSentence,
    hebrew_distractors: ["עכשיו", "אתכם"],
  }];

  const firstHarness = loadAppHarness([], [], [], { sentenceBank: oldSentenceBank });
  firstHarness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  firstHarness.state.mode = "sentenceBank";
  firstHarness.state.sentenceBank.active = true;
  firstHarness.nextSentenceBankQuestion();
  firstHarness.app.persistence.persistSessionState();

  const restoredHarness = loadAppHarness([], [], [], {
    sentenceBank: updatedSentenceBank,
    localStorageData: firstHarness.localStorage.__dump(),
  });

  assert.equal(restoredHarness.state.mode, "lesson");
  assert.equal(restoredHarness.state.route, "home");
  assert.equal(restoredHarness.state.sentenceBank.active, false);
  assert.equal(restoredHarness.state.sentenceBank.currentQuestion, null);
});

test("sentence builder hides the translate label while keeping the prompt text and Hebrew speech button", () => {
  const sentenceBank = [
    {
      id: "sb-speech",
      category: "everyday",
      difficulty: 1,
      english: "No problem.",
      hebrew: "אין בעיה.",
      english_tokens: ["No", "problem"],
      hebrew_tokens: ["אין", "בעיה"],
      english_distractors: ["thanks"],
      hebrew_distractors: ["כן"],
      notes: "",
    },
  ];

  const hebrewHarness = loadAppHarness([], [], [], { sentenceBank });
  hebrewHarness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  hebrewHarness.state.mode = "sentenceBank";
  hebrewHarness.state.sentenceBank.active = true;
  hebrewHarness.nextSentenceBankQuestion();
  assert.equal(hebrewHarness.document.querySelector("#promptLabel").classList.contains("hidden"), true);
  assert.equal(hebrewHarness.document.querySelector("#promptText").textContent, "אין בעיה.");
  assert.equal(hebrewHarness.document.querySelector("#promptSpeechBtn").classList.contains("hidden"), false);
  hebrewHarness.document.querySelector("#promptSpeechBtn").click();
  assert.deepEqual(hebrewHarness.speechSpeakLog.map((entry) => entry.text), ["אין בעיה."]);

  const englishHarness = loadAppHarness([], [], [], { sentenceBank });
  englishHarness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  englishHarness.state.mode = "sentenceBank";
  englishHarness.state.sentenceBank.active = true;
  englishHarness.nextSentenceBankQuestion();
  assert.equal(englishHarness.document.querySelector("#promptLabel").classList.contains("hidden"), true);
  assert.equal(englishHarness.document.querySelector("#promptText").textContent, "No problem.");
  assert.equal(englishHarness.document.querySelector("#promptSpeechBtn").classList.contains("hidden"), true);
});

test("sentence builder explains the correct and chosen word when only one slotted word is wrong", () => {
  const vocabulary = [
    { id: "support", category: "core_advanced", en: "support", he: "תומכים", heNiqqud: "תּוֹמְכִים", utility: 80, source: "test" },
    { id: "contradict", category: "core_advanced", en: "contradict", he: "סותרים", heNiqqud: "סוֹתְרִים", utility: 78, source: "test" },
  ];
  const sentenceBank = [
    {
      id: "sb-word-tip",
      category: "formal",
      difficulty: 2,
      english: "The findings support the model.",
      hebrew: "הממצאים תומכים במודל.",
      english_tokens: ["The", "findings", "support", "the", "model"],
      hebrew_tokens: ["הממצאים", "תומכים", "במודל"],
      english_distractors: ["contradict"],
      hebrew_distractors: ["סותרים"],
      notes: "",
    },
  ];
  const harness = loadAppHarness(vocabulary, [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "en2he")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "הממצאים", 0);
  placeSentenceTokenByTap(document, "סותרים", 1);
  placeSentenceTokenByTap(document, "במודל", 2);
  document.querySelector("#nextBtn").click();

  assert.equal(
    getFeedbackText(document),
    "Not quite. The Hebrew sentence is הממצאים תומכים במודל. "
      + "Correct word: תומכים = support. Chosen word: סותרים = contradict."
  );
});

test("sentence builder does not add a generic tip when a miss has no single-word correction", () => {
  const sentenceBank = [
    {
      id: "sb-generic-tip",
      category: "everyday",
      difficulty: 1,
      english: "See you later.",
      hebrew: "נתראה אחר כך.",
      english_tokens: ["See", "you", "later"],
      hebrew_tokens: ["נתראה", "אחר", "כך"],
      english_distractors: ["now", "tomorrow", "again"],
      hebrew_distractors: ["היום", "עוד", "שם"],
      notes: "A casual goodbye for now.",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { document, state } = harness;

  harness.app.utils.weightedRandomWord = (items) => items.find((item) => item.word.direction === "he2en")?.word || items[0]?.word;
  state.mode = "sentenceBank";
  state.sentenceBank.active = true;
  harness.nextSentenceBankQuestion();

  placeSentenceTokenByTap(document, "later", 0);
  placeSentenceTokenByTap(document, "See", 1);
  placeSentenceTokenByTap(document, "you", 2);
  document.querySelector("#nextBtn").click();

  assert.equal(getFeedbackText(document), "Not quite. The English sentence is See you later.");
  assert.doesNotMatch(getFeedbackText(document), /Tip:/);
  assert.doesNotMatch(getFeedbackText(document), /Correct word:/);
});

test("advanced conjugation feedback adds colloquial meaning only for marked idioms", () => {
  const idioms = [
    {
      id: "idiom-1",
      english: "to drive someone up the wall",
      english_meaning: "to drive someone up the wall",
      showMeaning: true,
    },
    {
      id: "idiom-2",
      english: "to open someone's eyes",
      english_meaning: "to open someone's eyes",
      showMeaning: false,
    },
  ];
  const harness = loadAppHarness([], [], [], { idioms });

  harness.state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-1",
    correctAnswer: "העלתה לי את הסעיף",
    options: [{ id: "right", text: "העלתה לי את הסעיף", isCorrect: true }],
    selectedOptionId: "right",
  };
  harness.applyAdvConjAnswer();
  assert.match(getFeedbackText(harness.document), /Everyday meaning: to drive someone up the wall\./);

  harness.state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-2",
    correctAnswer: "פתחה לי את העיניים",
    options: [{ id: "right", text: "פתחה לי את העיניים", isCorrect: true }],
    selectedOptionId: "right",
  };
  harness.applyAdvConjAnswer();
  assert.doesNotMatch(getFeedbackText(harness.document), /Everyday meaning:/);
});

test("Hebrew is stripped from English-facing text across data pools and advanced conjugation", () => {
  const vocabulary = [
    { id: "alpha", category: "cooking_verbs", en: "to toss / pan-toss (חלוט)", he: "להקפיץ", heNiqqud: "לְהַקְפִּיץ", utility: 90, source: "test" },
    { id: "beta", category: "cooking_verbs", en: "to saute", he: "להקפיץ-2", heNiqqud: "לְהַקְפִּיץ-2", utility: 80, source: "test" },
    { id: "gamma", category: "cooking_verbs", en: "to ferment", he: "לתסוס", heNiqqud: "לְתַסֵּס", utility: 70, source: "test" },
    { id: "delta", category: "cooking_verbs", en: "to line a pan", he: "לרפד תבנית", heNiqqud: "לְרַפֵּד תַּבְנִית", utility: 60, source: "test" },
  ];
  const abbreviations = [
    { id: "abbr-1", abbr: "וכו׳", expansionHe: "וכולי", english: "etc. / and so on (חלוט)", bucket: "Daily Life & Home" },
    { id: "abbr-2", abbr: "לדוג׳", expansionHe: "לדוגמה", english: "for example (לחלוט)", bucket: "Daily Life & Home" },
  ];
  const { ADV_CONJ_OBJECTS, app, buildAdvConjEnglishSentence, getSelectedPool } = loadAppHarness(vocabulary, abbreviations);

  const sanitizedWords = getSelectedPool();
  const contaminatedWord = sanitizedWords.find((word) => word.id === "alpha");
  assert.ok(contaminatedWord);
  assert.equal(/[\u0590-\u05FF]/.test(contaminatedWord.en), false);
  assert.equal(contaminatedWord.en, "to toss / pan-toss");

  const deck = app.abbreviation.prepareAbbreviationDeck(abbreviations);
  assert.ok(deck.length);
  deck.forEach((entry) => {
    assert.equal(/[\u0590-\u05FF]/.test(entry.english), false);
  });

  const advConjEnglish = buildAdvConjEnglishSentence(
    {
      literal_sg: "{s} gets {o} in line (להקפיץ)",
      literal_pl: "{s} get {o} in line (להקפיץ)",
    },
    { en: "he" },
    ADV_CONJ_OBJECTS.find((entry) => entry.key === "1sg"),
    "present"
  );
  assert.equal(/[\u0590-\u05FF]/.test(advConjEnglish), false);
});

test("abbreviation speech keeps authored acronyms but disables written truncations", () => {
  const vocabulary = Array.from({ length: 8 }, (_, index) => ({
    id: `word-${index + 1}`,
    category: "core_advanced",
    en: `word ${index + 1}`,
    he: `מילה${index + 1}`,
    heNiqqud: `מִילָה${index + 1}`,
    utility: 80 - index,
    source: "test",
  }));
  const abbreviations = [
    { id: "street", abbr: "רח׳", expansionHe: "רחוב", english: "street" },
    {
      id: "border-police",
      abbr: "מג״ב",
      expansionHe: "משמר הגבול",
      english: "Border Police",
      speechHe: "מגב",
      speechHeNiqqud: "מַגָּב",
    },
  ];
  const { app } = loadAppHarness(vocabulary, abbreviations);
  const deck = app.abbreviation.prepareAbbreviationDeck(abbreviations);
  const street = deck.find((entry) => entry.id === "street");
  const borderPolice = deck.find((entry) => entry.id === "border-police");

  assert.equal(street.speechDisabled, true);
  assert.equal(borderPolice.speechDisabled, false);
  assert.equal(borderPolice.speechHe, "מגב");
  assert.equal(borderPolice.speechHeNiqqud, "מַגָּב");
  assert.equal(app.abbreviation.getAbbreviationPromptSpeechPayload({
    promptIsHebrew: true,
    prompt: street.abbr,
    entry: street,
  }), null);
});

test("verb match rounds dedupe identical visible English cards", () => {
  const vocabulary = [
    { id: "verb-go", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-go", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "past_first_person_singular", englishText: "he goes", valuePlain: "הלכתי", valueNiqqud: "הָלַכְתִּי" },
        { id: "present_feminine_singular", englishText: "she goes", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת" },
      ],
    },
  ];
  const harness = loadAppHarness(vocabulary, [], verbDeck);

  harness.state.mode = "verbMatch";
  harness.state.match.active = true;
  harness.state.match.verbQueue = [...verbDeck];
  harness.loadNextVerbRound();
  const englishCards = harness.state.match.leftCards.map((card) => card.englishText);
  assert.equal(new Set(englishCards).size, englishCards.length);
});

test("verb match rounds keep all available deduped forms for a verb", () => {
  const vocabulary = [
    { id: "verb-run", category: "core_advanced", en: "to run", he: "לרוץ", heNiqqud: "לָרוּץ", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-run", en: "to run", he: "לרוץ", heNiqqud: "לָרוּץ" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he runs", valuePlain: "רץ", valueNiqqud: "רָץ" },
        { id: "past_first_person_singular", englishText: "I ran", valuePlain: "רצתי", valueNiqqud: "רַצְתִּי" },
        { id: "future_first_person_singular", englishText: "I will run", valuePlain: "ארוץ", valueNiqqud: "אָרוּץ" },
        { id: "present_feminine_singular", englishText: "she runs", valuePlain: "רצה", valueNiqqud: "רָצָה" },
        { id: "past_third_person_masculine_singular", englishText: "he ran", valuePlain: "רץ", valueNiqqud: "רָץ" },
        { id: "future_third_person_masculine_singular", englishText: "he will run", valuePlain: "ירוץ", valueNiqqud: "יָרוּץ" },
        { id: "present_masculine_plural", englishText: "they (m.pl.) run", valuePlain: "רצים", valueNiqqud: "רָצִים" },
        { id: "past_third_person_feminine_singular", englishText: "she ran", valuePlain: "רצה", valueNiqqud: "רָצָה" },
        { id: "future_third_person_feminine_singular", englishText: "she will run", valuePlain: "תרוץ", valueNiqqud: "תָּרוּץ" },
        { id: "present_feminine_plural", englishText: "they (f.pl.) run", valuePlain: "רצות", valueNiqqud: "רָצוֹת" },
        { id: "past_first_person_plural", englishText: "we ran", valuePlain: "רצנו", valueNiqqud: "רַצְנוּ" },
        { id: "future_first_person_plural", englishText: "we will run", valuePlain: "נרוץ", valueNiqqud: "נָרוּץ" },
        { id: "imperative_second_person_masculine_singular", englishText: "run! (m.s.)", valuePlain: "רוץ", valueNiqqud: "רוּץ" },
        { id: "imperative_second_person_feminine_singular", englishText: "run! (f.s.)", valuePlain: "רוצי", valueNiqqud: "רוּצִי" },
        { id: "imperative_second_person_plural", englishText: "run! (pl.)", valuePlain: "רוצו", valueNiqqud: "רוּצוּ" },
      ],
    },
  ];
  const harness = loadAppHarness(vocabulary, [], verbDeck);

  harness.state.mode = "verbMatch";
  harness.state.match.active = true;
  harness.state.match.verbQueue = [...verbDeck];
  harness.loadNextVerbRound();

  assert.equal(harness.state.match.pairs.length, 13);
  assert.deepEqual(
    Array.from(harness.state.match.pairs
      .filter((pair) => pair.id.startsWith("imperative_"))
      .map((pair) => pair.id)),
    [
      "imperative_second_person_masculine_singular",
      "imperative_second_person_feminine_singular",
      "imperative_second_person_plural",
    ]
  );
  assert.deepEqual(
    Array.from(harness.state.match.pairs.map((pair) => pair.id)),
    [
      "present_masculine_singular",
      "past_first_person_singular",
      "future_first_person_singular",
      "present_feminine_singular",
      "future_third_person_masculine_singular",
      "present_masculine_plural",
      "future_third_person_feminine_singular",
      "present_feminine_plural",
      "past_first_person_plural",
      "future_first_person_plural",
      "imperative_second_person_masculine_singular",
      "imperative_second_person_feminine_singular",
      "imperative_second_person_plural",
    ]
  );
});

test("verb match rounds preserve all modern imperative forms for every imperative-enabled deck verb", () => {
  const vocabulary = [
    { id: "cook-fold", category: "cooking_verbs", en: "to fold", he: "לקפל", heNiqqud: "לְקַפֵּל", utility: 80, source: "test" },
    { id: "cook-season", category: "cooking_verbs", en: "to season", he: "לתבל", heNiqqud: "לְתַבֵּל", utility: 84, source: "test" },
    { id: "cook-boil", category: "cooking_verbs", en: "to boil", he: "להרתיח", heNiqqud: "לְהַרְתִּיחַ", utility: 79, source: "test" },
    { id: "cook-thicken", category: "cooking_verbs", en: "to thicken", he: "להסמיך", heNiqqud: "לְהַסְמִיךְ", utility: 70, source: "test" },
    { id: "cook-dilute", category: "cooking_verbs", en: "to dilute", he: "לדלל", heNiqqud: "לְדַלֵּל", utility: 74, source: "test" },
    { id: "cook-strain", category: "cooking_verbs", en: "to strain", he: "לסנן", heNiqqud: "לְסַנֵּן", utility: 78, source: "test" },
    { id: "cook-refrigerate", category: "cooking_verbs", en: "to refrigerate", he: "לקרר", heNiqqud: "לְקָרֵר", utility: 73, source: "test" },
    { id: "cook-garnish", category: "cooking_verbs", en: "to garnish", he: "לקשט", heNiqqud: "לְקַשֵּׁט", utility: 76, source: "test" },
  ];
  const verbDeck = verbApi.buildVerbConjugationDeck({ vocabulary });
  const imperativeEnabled = verbDeck.filter((item) => item.forms.some((form) => form.id.startsWith("imperative_")));
  const harness = loadAppHarness(vocabulary, [], verbDeck);

  assert.ok(imperativeEnabled.length > 0);

  imperativeEnabled.forEach((item) => {
    harness.state.mode = "verbMatch";
    harness.state.match.active = true;
    harness.state.match.verbQueue = [item];
    harness.state.match.currentVerb = null;
    harness.state.match.currentVerbIndex = 0;
    harness.loadNextVerbRound();

    const imperativeIds = Array.from(
      harness.state.match.pairs
        .filter((pair) => pair.id.startsWith("imperative_"))
        .map((pair) => pair.id)
    ).sort((left, right) => MODERN_IMPERATIVE_IDS.indexOf(left) - MODERN_IMPERATIVE_IDS.indexOf(right));

    assert.deepEqual(imperativeIds, MODERN_IMPERATIVE_IDS, `${item.id} should keep all modern imperative pairs in rounds`);
  });
});

test("sound preference defaults to disabled and toggle persists to localStorage", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const { localStorage, state, toggleSoundPreference } = loadAppHarness(vocabulary, [], [], {
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assert.equal(state.audio.enabled, false);
  toggleSoundPreference();
  assert.equal(state.audio.enabled, true);
  assert.equal(localStorage.getItem("ivriquest-sound-v1"), JSON.stringify({ enabled: true }));
});

test("display font defaults to Heebo and persists Frank Ruhl Libre as the alternative", () => {
  const firstHarness = loadAppHarness([], [], [], {
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assert.equal(firstHarness.state.displayFont, "heebo");
  assert.equal(firstHarness.document.body.getAttribute("data-display-font"), "heebo");
  assert.equal(firstHarness.document.querySelector("#displayFontToggle").getAttribute("aria-label"), "Font: Heebo");

  firstHarness.document.querySelector("#displayFontToggle").click();
  assert.equal(firstHarness.state.displayFont, "frank");
  assert.equal(firstHarness.document.body.getAttribute("data-display-font"), "frank");
  assert.equal(firstHarness.localStorage.getItem("ivriquest-font-v1"), "frank");
  assert.equal(firstHarness.document.querySelector("#displayFontToggle").getAttribute("aria-label"), "Font: Frank Ruhl Libre");

  const restoredHarness = loadAppHarness([], [], [], {
    localStorageData: firstHarness.localStorage.__dump(),
  });
  assert.equal(restoredHarness.state.displayFont, "frank");
  assert.equal(restoredHarness.document.body.getAttribute("data-display-font"), "frank");

  const invalidHarness = loadAppHarness([], [], [], {
    localStorageData: {
      "ivriquest-font-v1": "unsupported-font",
      "ivriquest-welcome-seen-v1": "1",
    },
  });
  assert.equal(invalidHarness.state.displayFont, "heebo");
  assert.equal(invalidHarness.document.body.getAttribute("data-display-font"), "heebo");

  assert.equal(
    firstHarness.document.querySelector("#displayFontToggle").getAttribute("aria-description"),
    "Switch between Heebo and Frank Ruhl Libre. Each preview shows the Hebrew letter ayin."
  );
  firstHarness.app.i18n.toggleLanguage();
  assert.equal(
    firstHarness.document.querySelector("#displayFontToggle").getAttribute("aria-description"),
    "החלפה בין Heebo לבין Frank Ruhl Libre. כל תצוגה מקדימה מציגה את האות עי״ן."
  );
});

test("font selector previews both faces and requested Hebrew surfaces use the shared display font", () => {
  const markup = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

  assert.match(markup, /family=Heebo:wght@400;500;600;700;900/);
  assert.match(markup, /id="displayFontToggle"[\s\S]*data-seg="heebo">ע<[\s\S]*data-seg="frank">ע</s);
  assert.match(styles, /:root\s*\{[^}]*--display-font:\s*"Heebo",\s*"Assistant",\s*sans-serif;/s);
  assert.match(styles, /body\[data-display-font="frank"\]\s*\{[^}]*--display-font:\s*"Frank Ruhl Libre",\s*serif;/s);
  assert.match(styles, /\.shell-brand-title h1\s*\{[^}]*font-family:\s*"Frank Ruhl Libre",\s*serif;/s);
  assert.match(styles, /\.lesson-shell\.mode-sentence-bank \.prompt-text\.hebrew\s*\{[^}]*font-family:\s*var\(--display-font\);/s);
  assert.match(styles, /\.binyan-root-letters\s*\{[^}]*font-family:\s*var\(--display-font\);/s);
  assert.match(styles, /body\[data-ui-lang="he"\] \.game-tile\.binyan-root-tile::after\s*\{[^}]*content:\s*none;/s);
  assert.match(styles, /\.choices\.binyan-board-grid\s*\{[^}]*grid-auto-rows:\s*max-content;[^}]*align-self:\s*center;[^}]*align-content:\s*center;/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-text\.hebrew\s*\{[^}]*font-family:\s*var\(--display-font\);/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-label\s*\{[^}]*font-family:\s*"Assistant",\s*sans-serif;/s);
  assert.match(styles, /\.handwriting-line\s*\{[^}]*font-family:\s*var\(--display-font\);/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-card\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(2\.8rem,\s*4\.8rem\)\s+minmax\(0,\s*max-content\)\s+minmax\(2\.8rem,\s*4\.8rem\);[^}]*justify-content:\s*center;/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-root-emoji,[\s\S]*?\.lesson-shell\.mode-binyan-board \.prompt-text\s*\{[^}]*grid-row:\s*1;/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-label\s*\{[^}]*grid-column:\s*1;/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-text\s*\{[^}]*grid-column:\s*2;/s);
  assert.match(styles, /\.lesson-shell\.mode-binyan-board \.prompt-root-emoji\s*\{[^}]*grid-column:\s*3;/s);
});

test("speech preference defaults to disabled and toggle persists separately", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const { localStorage, state, toggleSpeechPreference } = loadAppHarness(vocabulary, [], [], {
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assert.equal(state.speech.enabled, false);
  toggleSpeechPreference();
  assert.equal(state.speech.enabled, true);
  assert.equal(localStorage.getItem("ivriquest-speech-v1"), JSON.stringify({ enabled: true }));
  assert.equal(localStorage.getItem("ivriquest-sound-v1"), null);
});

test("speech toggles disable cleanly when Hebrew speech is unavailable", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const { document, state, toggleSpeechPreference } = loadAppHarness(vocabulary, [], [], {
    speechVoices: [],
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assert.equal(document.querySelector("#speechToggle").disabled, true);
  assert.equal(document.querySelector("#homeSpeechToggle").disabled, true);
  assert.equal(state.speech.enabled, false);
  toggleSpeechPreference();
  assert.equal(state.speech.enabled, false);
});

test("verb match prompt speech button reads the current Hebrew prompt", () => {
  const vocabulary = [
    { id: "verb-word", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      id: "verb-1",
      word: vocabulary[0],
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
      ],
    },
  ];

  const harness = loadAppHarness(vocabulary, [], verbDeck);
  harness.state.mode = "verbMatch";
  harness.state.match.active = true;
  harness.state.match.verbQueue = [...verbDeck];
  harness.loadNextVerbRound();

  const promptButton = harness.document.querySelector("#promptSpeechBtn");
  assert.equal(promptButton.classList.contains("hidden"), false);
  assert.equal(promptButton.textContent.trim(), "");
  assert.equal(promptButton.getAttribute("aria-label"), "Play Hebrew prompt");
  assert.equal(harness.document.querySelector("#homeLessonStage").classList.contains("mode-verb-match"), true);
  assert.equal(harness.document.querySelector("#stickyLessonActions").classList.contains("is-empty"), true);
  promptButton.click();
  assert.deepEqual(harness.speechSpeakLog.map((entry) => entry.text), ["לָלֶכֶת"]);
});

test("gameplay headers collapse stats into the streak-aware progress bar across lesson and conjugation", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      id: "verb-1",
      word: { id: "verb-word", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
      ],
    },
  ];
  const harness = loadAppHarness(vocabulary, [], verbDeck);

  harness.state.sessionScore = 9;
  harness.state.sessionStreak = 4;
  harness.state.mode = "lesson";
  harness.state.lesson.active = true;
  harness.state.currentQuestion = {
    locked: false,
    word: vocabulary[0],
    prompt: vocabulary[0].en,
    promptIsHebrew: false,
    optionsAreHebrew: true,
    options: [{ id: "alpha", word: vocabulary[0] }],
    selectedOptionId: null,
  };
  harness.state.lesson.elapsedSeconds = 166;
  harness.app.ui.renderSessionHeader();
  assert.equal(harness.document.querySelector("#lessonProgressBar").dataset.streakTier, "2");
  assert.match(harness.document.querySelector("#lessonProgressBar").getAttribute("aria-label"), /Combo x4/);
  assert.equal(harness.document.querySelector("#shellGameplayTime").textContent, "166s");
  assert.equal(harness.document.querySelector("#shellGameplayCombo").textContent, "x4");

  harness.state.mode = "verbMatch";
  harness.state.match.active = true;
  harness.state.match.currentVerb = verbDeck[0];
  harness.state.match.matchedCount = 0;
  harness.state.match.totalPairs = 1;
  harness.state.match.bestCombo = 9;
  harness.state.match.elapsedSeconds = 203;
  harness.app.ui.renderSessionHeader();
  assert.equal(harness.document.querySelector("#lessonProgressBar").dataset.streakTier, "2");
  assert.match(harness.document.querySelector("#lessonProgressBar").getAttribute("aria-label"), /Combo x4/);
  assert.equal(harness.document.querySelector("#shellGameplayTime").textContent, "203s");
  assert.equal(harness.document.querySelector("#shellGameplayCombo").textContent, "x4");
});

test("active gameplay shows the top-right time and combo pill and hides it outside gameplay", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const harness = loadAppHarness(vocabulary, [], [], { innerWidth: 1280 });

  harness.state.route = "home";
  harness.state.mode = "lesson";
  harness.state.lesson.active = true;
  harness.state.lesson.elapsedSeconds = 298;
  harness.state.sessionStreak = 3;
  harness.app.ui.renderSessionHeader();
  harness.app.ui.updateLessonShellModeState();

  assert.equal(harness.document.body.getAttribute("data-gameplay-active"), "true");
  const gameplayModeTitle = harness.document.querySelector("#modeTitle").textContent;
  assert.notEqual(gameplayModeTitle, "IvritElite");
  assert.equal(harness.document.querySelector("#shellTopTitle").textContent, gameplayModeTitle);
  assert.equal(harness.document.querySelector("#shellGameplayPill").classList.contains("hidden"), false);
  assert.equal(harness.document.querySelector("#shellHomeBtn").classList.contains("hidden"), false);
  assert.equal(harness.document.querySelector("#shellGameplayTime").textContent, "298s");
  assert.equal(harness.document.querySelector("#shellGameplayCombo").textContent, "x3");
  assert.match(harness.document.querySelector("#shellGameplayPill").getAttribute("aria-label"), /Time: 298s • Combo x3/);
  assert.equal(harness.document.querySelector("#lessonTitleRow").classList.contains("hidden"), true);

  harness.state.lesson.active = false;
  harness.state.route = "review";
  harness.app.ui.renderShellChrome();
  harness.app.ui.updateLessonShellModeState();

  assert.equal(harness.document.body.getAttribute("data-gameplay-active"), "false");
  assert.equal(harness.document.querySelector("#shellTopTitle").textContent, "IvritElite");
  assert.equal(harness.document.querySelector("#shellGameplayPill").classList.contains("hidden"), true);
  assert.equal(harness.document.querySelector("#shellHomeBtn").classList.contains("hidden"), true);

  harness.state.route = "results";
  harness.state.summary.active = true;
  harness.state.summary.game = "sentenceBank";
  harness.app.ui.renderShellChrome();

  assert.equal(harness.document.querySelector("#shellGameplayPill").classList.contains("hidden"), true);
  assert.equal(harness.document.querySelector("#shellHomeBtn").classList.contains("hidden"), false);
  assert.equal(harness.document.querySelector("#shellTopTitle").textContent, "Sentences");
});

test("second-chance rounds reset the progress bar and track review progress specifically", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const sentenceBank = [
    {
      id: "sb-second-chance-progress",
      category: "everyday",
      difficulty: 1,
      english: "We will see you tomorrow.",
      hebrew: "נראה אותך מחר.",
      english_tokens: ["We", "will", "see", "you", "tomorrow"],
      hebrew_tokens: ["נראה", "אותך", "מחר"],
      english_distractors: ["later", "them"],
      hebrew_distractors: ["עכשיו", "אותם"],
      notes: "",
    },
  ];
  const harness = loadAppHarness(vocabulary, [], [], { sentenceBank });

  harness.state.route = "home";
  harness.state.mode = "lesson";
  harness.state.lesson.active = true;
  harness.state.lesson.inReview = true;
  harness.state.lesson.secondChanceCurrent = 1;
  harness.state.lesson.secondChanceTotal = 4;
  harness.state.currentQuestion = {
    locked: false,
    word: vocabulary[0],
    prompt: vocabulary[0].en,
    promptIsHebrew: false,
    optionsAreHebrew: true,
    options: [{ id: "alpha", word: vocabulary[0] }],
    selectedOptionId: null,
  };
  harness.app.ui.renderSessionHeader();

  assert.equal(harness.document.querySelector("#lessonProgressFill").style.width, "25%");
  assert.match(harness.document.querySelector("#lessonProgressBar").getAttribute("aria-label"), /Second chance: 1\/4/);

  harness.state.mode = "sentenceBank";
  harness.state.sentenceBank.active = true;
  harness.state.sentenceBank.inReview = true;
  harness.state.sentenceBank.secondChanceCurrent = 2;
  harness.state.sentenceBank.secondChanceTotal = 5;
  harness.state.sentenceBank.currentQuestion = {
    prompt: "נראה אותך מחר.",
    promptIsHebrew: true,
    answerIsHebrew: false,
    locked: false,
    bankTokens: [],
    targetTokens: ["We", "will", "see", "you", "tomorrow"],
    slotTokenIds: ["", "", "", "", ""],
  };
  harness.app.ui.renderSessionHeader();

  assert.equal(harness.document.querySelector("#lessonProgressFill").style.width, "40%");
  assert.match(harness.document.querySelector("#lessonProgressBar").getAttribute("aria-label"), /Second chance: 2\/5/);
});

test("every width shows exactly one route at a time", () => {
  [1280, 400].forEach((innerWidth) => {
    const harness = loadAppHarness([], [], [], { innerWidth });

    harness.state.route = "review";
    harness.state.summary.active = false;
    harness.app.ui.renderRouteVisibility();

    assert.equal(harness.document.body.getAttribute("data-desktop-hub-layout"), "false");
    assert.equal(harness.document.querySelector("#reviewView").classList.contains("active"), true);
    assert.equal(harness.document.querySelector("#homeView").classList.contains("active"), false);
    assert.equal(harness.document.querySelector("#settingsView").classList.contains("active"), false);
    assert.equal(harness.document.querySelector("#resultsView").classList.contains("active"), false);

    harness.state.route = "results";
    harness.state.summary.active = true;
    harness.app.ui.renderRouteVisibility();

    assert.equal(harness.document.querySelector("#resultsView").classList.contains("active"), true);
    assert.equal(harness.document.querySelector("#reviewView").classList.contains("active"), false);
    assert.equal(harness.document.querySelector("#settingsView").classList.contains("active"), false);
    assert.equal(harness.document.querySelector("#homeView").classList.contains("active"), false);
  });
});

test("results show the review performance button at every width", () => {
  [1280, 400].forEach((innerWidth) => {
    const harness = loadAppHarness([], [], [], { innerWidth });

    harness.state.route = "results";
    harness.state.summary.active = true;
    harness.app.ui.renderRouteVisibility();

    assert.equal(harness.document.querySelector("#resultsView").classList.contains("active"), true);
    assert.equal(harness.document.querySelector("#resultsReviewBtn").hidden, false);
  });
});

test("review and settings cards stay expanded at every width", () => {
  [1280, 400].forEach((innerWidth) => {
    const harness = loadAppHarness([], [], [], { innerWidth });
    const reviewCard = harness.document.querySelector("#reviewPanelCard");
    const reviewToggle = harness.document.querySelector("#reviewPanelToggle");
    const settingsCard = harness.document.querySelector("#settingsCard");
    const settingsToggle = harness.document.querySelector("#settingsToggle");

    assert.equal(harness.document.body.getAttribute("data-desktop-hub-layout"), "false");
    assert.equal(reviewCard.getAttribute("data-collapsed"), "false");
    assert.equal(settingsCard.getAttribute("data-collapsed"), "false");

    // Collapsing is no longer a feature; the headers are static and clicking is a no-op.
    reviewToggle.click();
    settingsToggle.click();
    assert.equal(reviewCard.getAttribute("data-collapsed"), "false");
    assert.equal(settingsCard.getAttribute("data-collapsed"), "false");
  });
});

test("all game summaries now use only score accuracy and time metrics", () => {
  const harness = loadAppHarness([]);
  const expectedLabels = ["Score", "Accuracy", "Time"];

  ["lesson", "abbreviation", "verbMatch", "advConj"].forEach((game) => {
    harness.state.summary.game = game;
    harness.state.summary.elapsedSeconds = 42;
    const metrics = harness.app.ui.buildSummaryMetrics({
      scoreValue: 7,
      scoreTotal: 10,
      accuracy: 70,
    });
    assert.equal(metrics.length, 3);
    assert.deepEqual(Array.from(metrics, (metric) => metric.label), expectedLabels);
  });
});

test("handwriting summaries arrange per-letter results in three columns", () => {
  const harness = loadAppHarness([]);
  const { app, document, state } = harness;
  Object.assign(state.summary, {
    active: true,
    game: "handwriting",
    correctCount: 2,
    incorrectCount: 1,
    elapsedSeconds: 10,
    mistakes: [{ primary: "כ", secondary: "kaf" }],
    corrects: [
      { primary: "ל", secondary: "lamed" },
      { primary: "מ", secondary: "mem" },
    ],
  });

  app.ui.renderSummaryState();

  const letterGrid = document.querySelector("#resultsSummary").children[2];
  assert.equal(letterGrid.classList.contains("results-mistakes--letter-grid"), true);
  assert.equal(letterGrid.querySelectorAll(".compact-row").length, 3);
});

test("mistake rows isolate each language so Hebrew and English stop colliding", () => {
  const harness = loadAppHarness([]);
  const { app, document, state } = harness;
  state.route = "results";
  Object.assign(state.summary, {
    active: true,
    game: "sentenceBank",
    correctCount: 4,
    incorrectCount: 2,
    elapsedSeconds: 40,
    mistakes: [
      {
        primary: "It was just a fling.",
        secondary: "זה היה רק סטוץ.",
        fields: [
          { label: "Hebrew sentence", value: "זה היה רק סטוץ.", dir: "rtl", lang: "he" },
          { label: "English sentence", value: "It was just a fling.", dir: "ltr", lang: "en" },
        ],
      },
      { primary: "כלב", secondary: "dog" },
    ],
  });

  app.ui.renderSummaryState();
  const rows = document.querySelector("#resultsSummary").children[2].querySelectorAll(".compact-row");
  assert.equal(rows.length, 2);

  // A row with fields lays each language out on its own line, with its own dir.
  const fieldRow = rows[0];
  assert.equal(fieldRow.classList.contains("compact-row--fields"), true);
  const values = fieldRow.querySelectorAll(".feedback-item-value");
  assert.deepEqual(
    Array.from(values, (node) => [node.getAttribute("dir"), node.getAttribute("lang"), node.textContent]),
    [["rtl", "he", "זה היה רק סטוץ."], ["ltr", "en", "It was just a fling."]]
  );
  assert.deepEqual(
    Array.from(fieldRow.querySelectorAll(".feedback-item-label"), (node) => node.textContent),
    ["Hebrew sentence", "English sentence"]
  );
  // No row should still be gluing a label onto its value.
  assert.equal(fieldRow.textContent.includes(" · "), false);

  // A row without fields keeps the old shape but is no longer direction-blind.
  const plainRow = rows[1];
  assert.equal(plainRow.classList.contains("compact-row--fields"), false);
  assert.equal(plainRow.querySelector(".compact-row-title").getAttribute("dir"), "auto");
  assert.equal(plainRow.querySelector(".compact-row-note").getAttribute("dir"), "auto");
});

test("results promote structured mistake notes into a mistake clinic", () => {
  const harness = loadAppHarness([]);
  const { app, document, state } = harness;
  state.route = "results";
  Object.assign(state.summary, {
    active: true,
    game: "prepositions",
    titleKey: "summary.prepositionsTitle",
    correctCount: 8,
    incorrectCount: 2,
    elapsedSeconds: 33,
    mistakes: [
      {
        primary: "מתגעגע אֲלֵיהֶם",
        secondary: "to miss them",
        clinicKey: "results.prepositionClinic",
        clinicVars: {
          trigger: "מתגעגע",
          prep: "אל",
          object: "them",
          answer: "מתגעגע אֲלֵיהֶם",
        },
      },
    ],
  });

  app.ui.renderSummaryState();
  const resultsSummary = document.querySelector("#resultsSummary");
  const mistakesWrap = resultsSummary.children[2];
  assert.equal(mistakesWrap.children[0].textContent, "Mistake Clinic");
  const clinicRows = mistakesWrap.querySelectorAll(".compact-row-clinic");
  assert.equal(clinicRows.length, 1);
  assert.equal(
    clinicRows[0].textContent,
    "Pattern: מתגעגע takes אל; with them, use מתגעגע אֲלֵיהֶם."
  );
});

test("sentence builder mistake summaries carry authored clinic notes", () => {
  const sentenceBank = [
    {
      id: "clinic-sentence",
      category: "everyday",
      difficulty: 2,
      english: "I need to write a note.",
      hebrew: "אני צריך לכתוב פתק.",
      english_tokens: ["I", "need to", "write", "a note"],
      hebrew_tokens: ["אני", "צריך", "לכתוב", "פתק"],
      english_distractors: ["you", "can", "read", "a sign"],
      hebrew_distractors: ["אתה", "יכול", "לקרוא", "שלט"],
      notes: "Watch the צריך + infinitive pattern.",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  harness.state.sentenceBank.sessionMistakeKeys = ["clinic-sentence::en2he"];

  const mistakes = harness.app.sentenceBank.buildSentenceBankMistakeSummary();
  assert.equal(mistakes.length, 1);
  assert.equal(mistakes[0].clinicKey, "results.sentenceClinic");
  assert.deepEqual(JSON.parse(JSON.stringify(mistakes[0].clinicVars)), {
    note: "Watch the צריך + infinitive pattern.",
  });
});

test("preposition misses explain the governed preposition and object inflection", () => {
  const harness = loadAppHarness([], [], [], {
    localStorageData: { "ivriquest-welcome-seen-v1": "1" },
  });
  const question = harness.app.prepositions.buildPrepositionsDeck()
    .find((candidate) => candidate.triggerId === "prep-miss" && candidate.objectKey === "3mp");
  assert.ok(question);
  question.selectedOptionId = question.options.find((option) => !option.isCorrect)?.id || "";
  harness.state.prepositions.active = true;
  harness.state.prepositions.currentQuestion = question;

  harness.app.prepositions.applyPrepositionsAnswer();

  const mistakes = harness.app.prepositions.buildPrepositionsMistakeSummary();
  assert.equal(mistakes.length, 1);
  assert.equal(mistakes[0].clinicKey, "results.prepositionClinic");
  assert.deepEqual(JSON.parse(JSON.stringify(mistakes[0].clinicVars)), {
    trigger: "מתגעגע",
    prep: "אל",
    object: "them",
    answer: "מתגעגע אֲלֵיהֶם",
  });
});

test("advanced conjugation misses remember subject tense and object clinic context", () => {
  const idioms = [
    {
      id: "idiom-open-eyes",
      english: "to open your eyes",
      english_meaning: "to pay attention",
      showMeaning: true,
      object_type: "l_dative",
      fixed_object: "את העיניים",
      literal_sg: "{s} opens {p} eyes",
      literal_pl: "{s} open {p} eyes",
      literal_past: "{s} opened {p} eyes",
      literal_future: "{s} will open {p} eyes",
      present_tense: { msg: "פותח", fsg: "פותחת", mpl: "פותחים", fpl: "פותחות" },
      past_tense: { msg: "פתח", fsg: "פתחה", mpl: "פתחו", fpl: "פתחו" },
      future_tense: { msg: "יפתח", fsg: "תפתח", mpl: "תפתחו", fpl: "תפתחו" },
    },
  ];
  const harness = loadAppHarness([], [], [], { idioms, mathRandom: () => 0 });
  const question = harness.app.advConj.buildAdvConjDeck()[0];
  assert.ok(question);
  question.selectedOptionId = question.options.find((option) => !option.isCorrect)?.id || "";
  harness.state.advConj.currentQuestion = question;

  harness.app.advConj.applyAdvConjAnswer();

  const mistakes = harness.app.advConj.buildAdvConjMistakeSummary();
  assert.equal(mistakes.length, 1);
  assert.equal(mistakes[0].clinicKey, "results.advConjClinic");
  assert.deepEqual(JSON.parse(JSON.stringify(mistakes[0].clinicVars)), {
    subject: question.subjectLabel,
    tense: question.tense,
    object: question.objectLabel,
  });
});

test("binyanim mistake summaries reuse function hints and teaching points as clinic notes", () => {
  const harness = loadAppHarness([]);
  harness.state.binyanBoard.deck = [
    {
      forms: [
        {
          formId: "l-b-sh:hitpael",
          slot: "hitpael",
          binyanNameHe: "הִתְפַּעֵל",
          formVocalized: "הִתְלַבֵּשׁ",
          gloss: "got dressed",
          func: "reflexive",
          teachingPoint: "No metathesis — ל is not a sibilant, so the ת of hitpael stays put.",
        },
      ],
    },
  ];
  harness.state.binyanBoard.sessionMistakeIds = ["l-b-sh:hitpael"];

  const mistakes = harness.app.binyanBoard.buildBinyanBoardMistakeSummary();
  assert.equal(mistakes.length, 1);
  assert.match(mistakes[0].clinic, /Pattern: הִתְפַּעֵל carries a reflexive meaning here\./);
  assert.match(mistakes[0].clinic, /No spelling change here/);
});

test("starting advanced conjugation resets the game score but preserves the shared combo", () => {
  const idioms = [
    {
      id: "idiom-1",
      english: "to open your eyes",
      showMeaning: false,
      object_type: "l_dative",
      fixed_object: "את העיניים",
      literal_sg: "{s} opens {p} eyes",
      literal_pl: "{s} open {p} eyes",
      literal_past: "{s} opened {p} eyes",
      literal_future: "{s} will open {p} eyes",
      present_tense: { msg: "פותח", fsg: "פותחת", mpl: "פותחים", fpl: "פותחות" },
      past_tense: { msg: "פתח", fsg: "פתחה", mpl: "פתחו", fpl: "פתחו" },
      future_tense: { msg: "יפתח", fsg: "תפתח", mpl: "תפתחו", fpl: "תפתחו" },
    },
  ];
  const harness = loadAppHarness([], [], [], { idioms });

  harness.state.sessionScore = 6;
  harness.state.sessionStreak = 3;
  harness.startAdvConj();
  harness.app.ui.renderSessionHeader();

  assert.equal(harness.state.sessionScore, 0);
  assert.equal(harness.state.sessionStreak, 3);
  assert.equal(harness.document.querySelector("#lessonProgressBar").dataset.streakTier, "1");
  assert.match(harness.document.querySelector("#lessonProgressBar").getAttribute("aria-label"), /Combo x3/);
  harness.goHome();
});

test("lesson footer keeps action buttons above the feedback tray in the markup", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(
    html,
    /<div id="lessonFooter"[\s\S]*<div id="stickyLessonActions"[\s\S]*<\/div>[\s\S]*<section id="feedbackTray"/
  );
});

test("conjugation never shows the feedback tray during mismatch, match success, or verb completion", async () => {
  const vocabulary = [
    { id: "verb-word", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const mismatchDeck = [
    {
      id: "verb-1",
      word: vocabulary[0],
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "past_first_person_singular", englishText: "I went", valuePlain: "הלכתי", valueNiqqud: "הָלַכְתִּי" },
      ],
    },
  ];

  const mismatchHarness = loadAppHarness(vocabulary, [], mismatchDeck);
  mismatchHarness.state.mode = "verbMatch";
  mismatchHarness.state.match.active = true;
  mismatchHarness.state.match.verbQueue = [...mismatchDeck];
  mismatchHarness.loadNextVerbRound();
  const wrongLeft = mismatchHarness.state.match.leftCards[0];
  const wrongRight = mismatchHarness.state.match.rightCards.find((card) => card.pairId !== wrongLeft.pairId);
  mismatchHarness.applyVerbMatchMismatch(wrongLeft, wrongRight);
  assert.equal(mismatchHarness.document.querySelector("#feedbackTray").classList.contains("hidden"), true);
  await waitForTimers();
  assert.equal(mismatchHarness.document.querySelector("#feedbackTray").classList.contains("hidden"), true);

  const successDeck = [
    {
      id: "verb-2",
      word: vocabulary[0],
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
      ],
    },
  ];
  const successHarness = loadAppHarness(vocabulary, [], successDeck);
  successHarness.state.mode = "verbMatch";
  successHarness.state.match.active = true;
  successHarness.state.match.verbQueue = [...successDeck];
  successHarness.loadNextVerbRound();
  const left = successHarness.state.match.leftCards[0];
  const right = successHarness.state.match.rightCards.find((card) => card.pairId === left.pairId);
  successHarness.applyVerbMatchSuccess(left, right);
  assert.equal(successHarness.document.querySelector("#feedbackTray").classList.contains("hidden"), true);
  await waitForTimers();
  assert.equal(successHarness.document.querySelector("#feedbackTray").classList.contains("hidden"), true);
  assert.equal(successHarness.document.querySelector("#nextBtn").classList.contains("hidden"), false);
});

test("advanced conjugation selections speak Hebrew answers before submit", () => {
  const harness = loadAppHarness([], [], []);
  harness.toggleSpeechPreference();

  harness.state.mode = "advConj";
  harness.state.advConj.active = true;
  harness.state.advConj.currentQuestion = {
    locked: false,
    promptText: "he opened your eyes",
    promptIsHebrew: false,
    correctAnswer: "פתח לך את העיניים",
    correctAnswerNiqqud: "פָּתַח לְךָ אֶת הָעֵינַיִם",
    correctAnswerIsHebrew: true,
    options: [{
      id: "correct",
      text: "פתח לך את העיניים",
      textNiqqud: "פָּתַח לְךָ אֶת הָעֵינַיִם",
      isCorrect: true,
    }],
    selectedOptionId: null,
  };
  harness.app.advConj.renderAdvConjChoices(harness.state.advConj.currentQuestion);
  const buttons = harness.document.querySelector("#choiceContainer").querySelectorAll("button");
  buttons[0].click();

  assert.equal(harness.speechSpeakLog.length, 1);
  assert.equal(
    harness.speechSpeakLog[0].text.normalize("NFD"),
    "פָּתַח לְךָ אֶת הָעֵינַיִם".normalize("NFD"),
  );
});

test("advanced conjugation niqqud toggle updates Hebrew prompts, choices, and locked feedback with legacy fallback", () => {
  const harness = loadAppHarness([], [], [], {
    idioms: [{ id: "pilot-idiom", english: "to open someone's eyes", showMeaning: false }],
  });
  const { app, document, state } = harness;
  state.mode = "advConj";
  state.advConj.active = true;

  const he2en = {
    idiomId: "pilot-idiom",
    locked: false,
    promptText: "פתח לי את העיניים",
    promptNiqqud: "פָּתַח לִי אֶת הָעֵינַיִם",
    promptIsHebrew: true,
    correctAnswer: "he opened my eyes",
    correctAnswerNiqqud: "",
    correctAnswerIsHebrew: false,
    options: [{ id: "correct", text: "he opened my eyes", textNiqqud: "", isCorrect: true }],
    selectedOptionId: null,
  };
  state.advConj.currentQuestion = he2en;
  state.showNiqqudInline = false;
  app.advConj.renderAdvConjQuestion();
  assert.equal(document.querySelector("#promptText").textContent, "פתח לי את העיניים");
  state.showNiqqudInline = true;
  app.advConj.renderAdvConjQuestion();
  assert.equal(document.querySelector("#promptText").textContent, "פָּתַח לִי אֶת הָעֵינַיִם");

  const en2he = {
    idiomId: "pilot-idiom",
    locked: true,
    promptText: "he opened my eyes",
    promptNiqqud: "",
    promptIsHebrew: false,
    correctAnswer: "פתח לי את העיניים",
    correctAnswerNiqqud: "פָּתַח לִי אֶת הָעֵינַיִם",
    correctAnswerIsHebrew: true,
    options: [
      {
        id: "correct",
        text: "פתח לי את העיניים",
        textNiqqud: "פָּתַח לִי אֶת הָעֵינַיִם",
        isCorrect: true,
      },
      {
        id: "wrong",
        text: "פתח לו את העיניים",
        textNiqqud: "פָּתַח לוֹ אֶת הָעֵינַיִם",
        isCorrect: false,
      },
    ],
    selectedOptionId: "wrong",
  };
  state.advConj.currentQuestion = en2he;
  app.advConj.renderAdvConjQuestion();
  assert.equal(
    document.querySelector("#choiceContainer").querySelectorAll("button")[0].textContent,
    "פָּתַח לִי אֶת הָעֵינַיִם",
  );
  assert.match(getFeedbackText(document), /פָּתַח לִי אֶת הָעֵינַיִם/);

  state.showNiqqudInline = false;
  app.advConj.renderAdvConjQuestion();
  assert.equal(
    document.querySelector("#choiceContainer").querySelectorAll("button")[0].textContent,
    "פתח לי את העיניים",
  );
  assert.match(getFeedbackText(document), /פתח לי את העיניים/);
  assert.doesNotMatch(getFeedbackText(document), /[\u0591-\u05C7]/);

  const legacy = {
    ...en2he,
    correctAnswerNiqqud: undefined,
    options: en2he.options.map(({ textNiqqud, ...option }) => option),
  };
  state.showNiqqudInline = true;
  state.advConj.currentQuestion = legacy;
  app.advConj.renderAdvConjQuestion();
  assert.equal(
    document.querySelector("#choiceContainer").querySelectorAll("button")[0].textContent,
    "פתח לי את העיניים",
  );
  assert.match(getFeedbackText(document), /פתח לי את העיניים/);
});

test("advanced conjugation mistake summaries prefer reviewed pointed answers", () => {
  const harness = loadAppHarness([], [], [], {
    idioms: [{ id: "pilot-idiom", english: "to open someone's eyes", showMeaning: false }],
  });
  const { app, state } = harness;
  state.advConj.currentQuestion = {
    idiomId: "pilot-idiom",
    tense: "past",
    subjectForm: "msg",
    subjectLabel: "he",
    objectKey: "1sg",
    objectLabel: "me",
    direction: "en2he",
    locked: false,
    promptText: "he opened my eyes",
    promptIsHebrew: false,
    correctAnswer: "פתח לי את העיניים",
    correctAnswerNiqqud: "פָּתַח לִי אֶת הָעֵינַיִם",
    correctAnswerIsHebrew: true,
    options: [
      { id: "correct", text: "פתח לי את העיניים", isCorrect: true },
      { id: "wrong", text: "פתח לו את העיניים", isCorrect: false },
    ],
    selectedOptionId: "wrong",
  };

  app.advConj.applyAdvConjAnswer();

  assert.equal(
    app.advConj.buildAdvConjMistakeSummary()[0].primary,
    "פָּתַח לִי אֶת הָעֵינַיִם",
  );
});

test("verb match speaks only when the Hebrew card is selected first and shows the tip", async () => {
  const vocabulary = [
    { id: "verb-word", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      id: "verb-1",
      word: vocabulary[0],
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
      ],
    },
  ];

  const rightFirstHarness = loadAppHarness(vocabulary, [], verbDeck);
  rightFirstHarness.toggleSpeechPreference();
  rightFirstHarness.state.mode = "verbMatch";
  rightFirstHarness.state.match.active = true;
  rightFirstHarness.state.match.verbQueue = [...verbDeck];
  rightFirstHarness.loadNextVerbRound();

  assert.equal(rightFirstHarness.document.querySelector("#promptHint").textContent, "Tip: select the Hebrew first to hear it aloud.");
  assert.equal(rightFirstHarness.document.querySelector("#stickyLessonActions").classList.contains("is-empty"), true);
  const rightCardId = rightFirstHarness.state.match.rightCards[0].id;
  const leftCardId = rightFirstHarness.state.match.leftCards[0].id;
  rightFirstHarness.app.verbMatch.handleVerbMatchRight(rightCardId);
  assert.deepEqual(rightFirstHarness.speechSpeakLog.map((entry) => entry.text), ["הוֹלֵךְ"]);
  rightFirstHarness.app.verbMatch.handleVerbMatchLeft(leftCardId);
  assert.equal(rightFirstHarness.speechSpeakLog.length, 1);
  await waitForTimers();

  const leftFirstHarness = loadAppHarness(vocabulary, [], verbDeck);
  leftFirstHarness.toggleSpeechPreference();
  leftFirstHarness.state.mode = "verbMatch";
  leftFirstHarness.state.match.active = true;
  leftFirstHarness.state.match.verbQueue = [...verbDeck];
  leftFirstHarness.loadNextVerbRound();
  leftFirstHarness.app.verbMatch.handleVerbMatchLeft(leftFirstHarness.state.match.leftCards[0].id);
  leftFirstHarness.app.verbMatch.handleVerbMatchRight(leftFirstHarness.state.match.rightCards[0].id);
  assert.deepEqual(leftFirstHarness.speechSpeakLog, []);
});

test("advanced conjugation submits play feedback sounds", () => {
  const { applyAdvConjAnswer, audioPlayLog, state } = loadAppHarness(
    [],
    [],
    [],
    {
      idioms: [
        { id: "idiom-1", english: "to be honest", showMeaning: false },
      ],
      localStorageData: {
        "ivriquest-sound-v1": JSON.stringify({ enabled: true }),
        "ivriquest-welcome-seen-v1": "1",
      },
    }
  );

  state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-1",
    correctAnswer: "ניסוח נכון",
    options: [
      { id: "wrong", text: "ניסוח שגוי", isCorrect: false },
      { id: "right", text: "ניסוח נכון", isCorrect: true },
    ],
    selectedOptionId: "right",
  };
  applyAdvConjAnswer();

  state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-1",
    correctAnswer: "ניסוח נכון",
    options: [
      { id: "wrong", text: "ניסוח שגוי", isCorrect: false },
      { id: "right", text: "ניסוח נכון", isCorrect: true },
    ],
    selectedOptionId: "wrong",
  };
  applyAdvConjAnswer();

  assertAudioPlayLog(audioPlayLog, [
    /^\.\/assets\/sounds\/answer-correct\.ogg\?v=[0-9a-z]+$/,
    /^\.\/assets\/sounds\/answer-wrong\.ogg\?v=[0-9a-z]+$/,
  ]);
});

test("audio playback falls back to mp3 when ogg support is unavailable", () => {
  const { applyAdvConjAnswer, audioPlayLog, state } = loadAppHarness([], [], [], {
    idioms: [
      { id: "idiom-1", english: "to be honest", showMeaning: false },
    ],
    audioSupport: {
      'audio/ogg; codecs="vorbis"': "",
      "audio/mpeg": "probably",
    },
    localStorageData: {
      "ivriquest-sound-v1": JSON.stringify({ enabled: true }),
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-1",
    correctAnswer: "ניסוח נכון",
    options: [{ id: "right", text: "ניסוח נכון", isCorrect: true }],
    selectedOptionId: "right",
  };
  applyAdvConjAnswer();

  assertAudioPlayLog(audioPlayLog, [/^\.\/assets\/sounds\/answer-correct\.mp3\?v=[0-9a-z]+$/]);
});

test("enabling sounds primes all feedback cues", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const { audioLoadLog, toggleSoundPreference } = loadAppHarness(vocabulary, [], [], {
    localStorageData: {
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assert.deepEqual(audioLoadLog, []);
  toggleSoundPreference();
  assertAudioLoadLog(audioLoadLog, [
    /^\.\/assets\/sounds\/answer-correct\.ogg\?v=[0-9a-z]+$/,
    /^\.\/assets\/sounds\/answer-streak\.ogg\?v=[0-9a-z]+$/,
    /^\.\/assets\/sounds\/answer-wrong\.ogg\?v=[0-9a-z]+$/,
  ]);
});

test("saved enabled sound preference primes all feedback cues at startup", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const { audioLoadLog } = loadAppHarness(vocabulary, [], [], {
    localStorageData: {
      "ivriquest-sound-v1": JSON.stringify({ enabled: true }),
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assertAudioLoadLog(audioLoadLog, [
    /^\.\/assets\/sounds\/answer-correct\.ogg\?v=[0-9a-z]+$/,
    /^\.\/assets\/sounds\/answer-streak\.ogg\?v=[0-9a-z]+$/,
    /^\.\/assets\/sounds\/answer-wrong\.ogg\?v=[0-9a-z]+$/,
  ]);
});

test("disabled sounds suppress feedback playback", () => {
  const { applyAdvConjAnswer, audioPlayLog, state } = loadAppHarness([], [], [], {
    idioms: [
      { id: "idiom-1", english: "to be honest", showMeaning: false },
    ],
    localStorageData: {
      "ivriquest-sound-v1": JSON.stringify({ enabled: false }),
      "ivriquest-welcome-seen-v1": "1",
    },
  });

  assert.equal(state.audio.enabled, false);

  state.advConj.currentQuestion = {
    locked: false,
    idiomId: "idiom-1",
    correctAnswer: "ניסוח נכון",
    options: [{ id: "right", text: "ניסוח נכון", isCorrect: true }],
    selectedOptionId: "right",
  };
  applyAdvConjAnswer();

  assert.deepEqual(audioPlayLog, []);
});

test("conjugation matches play correct, wrong, and streak sounds", async () => {
  const vocabulary = [
    { id: "verb-go", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-go", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "present_feminine_singular", englishText: "she goes", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת" },
      ],
    },
  ];

  const correctHarness = loadAppHarness(vocabulary, [], verbDeck, {
    localStorageData: {
      "ivriquest-sound-v1": JSON.stringify({ enabled: true }),
      "ivriquest-welcome-seen-v1": "1",
    },
  });
  correctHarness.startVerbMatch();
  await waitForTimers();
  const correctLeft = correctHarness.state.match.leftCards[0];
  const correctRight = correctHarness.state.match.rightCards.find((card) => card.pairId === correctLeft.pairId);
  correctHarness.applyVerbMatchSuccess(correctLeft, correctRight);
  assertAudioPlayLog(correctHarness.audioPlayLog, [/^\.\/assets\/sounds\/answer-correct\.ogg\?v=[0-9a-z]+$/]);
  correctHarness.goHome();

  const wrongHarness = loadAppHarness(vocabulary, [], verbDeck, {
    localStorageData: {
      "ivriquest-sound-v1": JSON.stringify({ enabled: true }),
      "ivriquest-welcome-seen-v1": "1",
    },
  });
  wrongHarness.startVerbMatch();
  await waitForTimers();
  const wrongLeft = wrongHarness.state.match.leftCards[0];
  const wrongRight = wrongHarness.state.match.rightCards.find((card) => card.pairId !== wrongLeft.pairId);
  wrongHarness.applyVerbMatchMismatch(wrongLeft, wrongRight);
  assertAudioPlayLog(wrongHarness.audioPlayLog, [/^\.\/assets\/sounds\/answer-wrong\.ogg\?v=[0-9a-z]+$/]);
  wrongHarness.goHome();

  const streakHarness = loadAppHarness(vocabulary, [], verbDeck, {
    localStorageData: {
      "ivriquest-sound-v1": JSON.stringify({ enabled: true }),
      "ivriquest-welcome-seen-v1": "1",
    },
  });
  streakHarness.startVerbMatch();
  await waitForTimers();
  streakHarness.state.sessionStreak = 3;
  const streakLeft = streakHarness.state.match.leftCards[0];
  const streakRight = streakHarness.state.match.rightCards.find((card) => card.pairId === streakLeft.pairId);
  streakHarness.applyVerbMatchSuccess(streakLeft, streakRight);
  assert.equal(streakHarness.state.sessionStreak, 4);
  assertAudioPlayLog(streakHarness.audioPlayLog, [/^\.\/assets\/sounds\/answer-streak\.ogg\?v=[0-9a-z]+$/]);
  streakHarness.goHome();
});

test("advanced conjugation English prompts keep number cues while omitting unnecessary subject gender", () => {
  const idiom = {
    id: "ptihat_einayim",
    object_type: "l_dative",
    fixed_object: "את העיניים",
    literal_sg: "{s} opens {p} eyes",
    literal_pl: "{s} open {p} eyes",
    literal_past: "{s} opened {p} eyes",
    literal_future: "{s} will open {p} eyes",
    present_tense: { msg: "פותח", fsg: "פותחת", mpl: "פותחים", fpl: "פותחות" },
    past_tense: { msg: "פתח", fsg: "פתחה", mpl: "פתחו", fpl: "פתחו" },
    future_tense: { msg: "יפתח", fsg: "תפתח", mpl: "יפתחו", fpl: "יפתחו" },
  };
  const { ADV_CONJ_SUBJECTS, ADV_CONJ_OBJECTS, buildAdvConjEnglishSentence } = loadAppHarness([], [], [], {
    idioms: [idiom],
  });
  const subj = ADV_CONJ_SUBJECTS.find((entry) => entry.en === "they (f.)");
  const singularYou = ADV_CONJ_OBJECTS.find((obj) => obj.key === "2msg");
  const pluralYou = ADV_CONJ_OBJECTS.find((obj) => obj.key === "2mpl");

  assert.equal(singularYou?.poss, "your (m.sg.)");
  assert.equal(pluralYou?.poss, "your (m.pl.)");
  assert.equal(
    buildAdvConjEnglishSentence(idiom, subj, singularYou, "past"),
    "they opened your (m.sg.) eyes"
  );
  assert.equal(
    buildAdvConjEnglishSentence(idiom, subj, pluralYou, "past"),
    "they opened your (m.pl.) eyes"
  );
  assert.equal(
    buildAdvConjEnglishSentence(idiom, subj, singularYou, "present"),
    "they (f.) open your (m.sg.) eyes"
  );
});

test("advanced conjugation collapses duplicate singular-plural markers when object and possessive refer to the same you", () => {
  const idiom = {
    id: "yotzi_midaat",
    object_type: "possessive_suffix",
    literal_sg: "{s} takes {o} out of {p} mind",
    literal_pl: "{s} take {o} out of {p} mind",
    literal_past: "{s} took {o} out of {p} mind",
    literal_future: "{s} will take {o} out of {p} mind",
    suffix_forms: { "2msg": "מדעתך", "2mpl": "מדעתכם" },
    present_tense: { msg: "מוציא", fsg: "מוציאה", mpl: "מוציאים", fpl: "מוציאות" },
    past_tense: { msg: "הוציא", fsg: "הוציאה", mpl: "הוציאו", fpl: "הוציאו" },
    future_tense: { msg: "יוציא", fsg: "תוציא", mpl: "יוציאו", fpl: "יוציאו" },
  };
  const { ADV_CONJ_OBJECTS, buildAdvConjEnglishSentence } = loadAppHarness([], [], [], {
    idioms: [idiom],
  });
  const subj = { form: "msg", en: "he" };
  const singularYou = ADV_CONJ_OBJECTS.find((obj) => obj.key === "2msg");
  const pluralYou = ADV_CONJ_OBJECTS.find((obj) => obj.key === "2mpl");

  assert.equal(
    buildAdvConjEnglishSentence(idiom, subj, singularYou, "future"),
    "he will take you out of your mind (m.sg.)"
  );
  assert.equal(
    buildAdvConjEnglishSentence(idiom, subj, pluralYou, "future"),
    "he will take you out of your mind (m.pl.)"
  );
});

test("advanced conjugation subjects span all three persons and no longer gate on tense", () => {
  const { ADV_CONJ_SUBJECTS, getAdvConjSubjectsForTense } = loadAppHarness([], [], []);
  const labels = (subjects) => Array.from(subjects, (subject) => subject.en);

  const everySubject = [
    "I (m.)", "I (f.)", "we (m.)", "we (f.)",
    "you (m.sg.)", "you (f.sg.)", "you (m.pl.)", "you (f.pl.)",
    "he", "she", "they (m.)", "they (f.)",
  ];
  assert.deepEqual(labels(ADV_CONJ_SUBJECTS), everySubject);

  // The tense gate used to live here as `tenses: ["present"]`, which pinned
  // second person to the present and left first person out of the game
  // entirely. It now lives in form resolution, which can consult a verb
  // paradigm, so this returns the whole list and the deck decides.
  ["present", "past", "future"].forEach((tense) => {
    assert.deepEqual(labels(getAdvConjSubjectsForTense(tense)), everySubject, tense);
  });

  // Every subject carries the slots resolution needs.
  ADV_CONJ_SUBJECTS.forEach((subject) => {
    assert.match(subject.personKey, /^[123](sg|pl|msg|fsg|mpl|fpl)$/, subject.en);
    assert.ok(subject.pastSlot, `${subject.en} needs a pastSlot`);
    assert.ok(subject.futureSlot, `${subject.en} needs a futureSlot`);
  });
});

test("past and future reach beyond third person only when a verb paradigm backs the idiom", () => {
  const tables = {
    present_tense: { msg: "מדליק", fsg: "מדליקה", mpl: "מדליקים", fpl: "מדליקות" },
    past_tense: { msg: "הדליק", fsg: "הדליקה", mpl: "הדליקו", fpl: "הדליקו" },
    future_tense: { msg: "ידליק", fsg: "תדליק", mpl: "ידליקו", fpl: "ידליקו" },
  };
  const base = {
    object_type: "direct",
    negated: false,
    literal_sg: "{s} lights {o} up",
    literal_pl: "{s} light {o} up",
    literal_past: "{s} lit {o} up",
    literal_future: "{s} will light {o} up",
    english: "to excite someone",
    english_meaning: "to excite someone",
    showMeaning: false,
    ...tables,
  };

  const personsFor = (deck, tense) =>
    new Set(deck.filter((item) => item.tense === tense).map((item) => item.subjectLabel));

  // להדליק has a stored paradigm, so its person-marked past and future slots
  // are available and first and second person become drillable there.
  const linked = loadAppHarness([], [], [], {
    idioms: [{ ...base, id: "linked-fixture", verb: "להדליק" }],
  }).buildAdvConjDeck();
  ["past", "future"].forEach((tense) => {
    const persons = personsFor(linked, tense);
    assert.ok([...persons].some((label) => /^I\b/.test(label)), `${tense} should reach first person`);
    assert.ok([...persons].some((label) => /^you\b/.test(label)), `${tense} should reach second person`);
  });

  // A verb with no paradigm keeps the pre-existing behaviour: the idiom's own
  // four slots are third person, so nobody else may borrow them.
  const unlinked = loadAppHarness([], [], [], {
    idioms: [{ ...base, id: "unlinked-fixture", verb: "לאאאא" }],
  }).buildAdvConjDeck();
  ["past", "future"].forEach((tense) => {
    const persons = [...personsFor(unlinked, tense)];
    assert.ok(persons.length > 0, `${tense} should still build third-person items`);
    persons.forEach((label) => {
      assert.match(label, /^(he|she|they)/, `${tense} leaked a non-third-person subject: ${label}`);
    });
  });

  // Present is person-neutral in Hebrew, so it never depended on the paradigm.
  assert.ok([...personsFor(unlinked, "present")].some((label) => /^I\b/.test(label)));
});

test("advanced conjugation present-tense English uses base verbs for second-person subjects", () => {
  const idiom = {
    id: "hotzaat_mitz",
    object_type: "l_dative",
    fixed_object: "את המיץ",
    literal_sg: "{s} takes out {p} juice",
    literal_pl: "{s} take out {p} juice",
    literal_past: "{s} took out {p} juice",
    literal_future: "{s} will take out {p} juice",
    present_tense: { msg: "מוציא", fsg: "מוציאה", mpl: "מוציאים", fpl: "מוציאות" },
    past_tense: { msg: "הוציא", fsg: "הוציאה", mpl: "הוציאו", fpl: "הוציאו" },
    future_tense: { msg: "יוציא", fsg: "תוציא", mpl: "יוציאו", fpl: "יוציאו" },
  };
  const { ADV_CONJ_OBJECTS, buildAdvConjEnglishSentence } = loadAppHarness([], [], [], {
    idioms: [idiom],
  });
  const myObject = ADV_CONJ_OBJECTS.find((obj) => obj.key === "1sg");

  assert.equal(
    buildAdvConjEnglishSentence(idiom, { form: "msg", en: "you (m.sg.)" }, myObject, "present"),
    "you (m.sg.) take out my juice"
  );
  assert.equal(
    buildAdvConjEnglishSentence(idiom, { form: "fsg", en: "you (f.sg.)" }, myObject, "present"),
    "you (f.sg.) take out my juice"
  );
});

test("advanced conjugation skips second-person subject plus second-person object combinations", () => {
  const idiom = {
    id: "mehagav",
    english: "to get off someone's back",
    english_meaning: "to get off someone's back",
    object_type: "l_dative",
    fixed_object: "מהגב",
    literal_sg: "{s} gets off {p} back",
    literal_pl: "{s} get off {p} back",
    literal_past: "{s} got off {p} back",
    literal_future: "{s} will get off {p} back",
    present_tense: { msg: "יורד", fsg: "יורדת", mpl: "יורדים", fpl: "יורדות" },
    past_tense: { msg: "ירד", fsg: "ירדה", mpl: "ירדו", fpl: "ירדו" },
    future_tense: { msg: "יירד", fsg: "תירד", mpl: "יירדו", fpl: "יירדו" },
  };
  const { buildAdvConjDeck } = loadAppHarness([], [], [], {
    idioms: [idiom],
    mathRandom: () => 0,
  });

  const deck = buildAdvConjDeck();
  assert.ok(deck.length > 0);
  assert.equal(
    deck.some((card) => card.promptText.includes("you (m.pl.) get off your (sg.) back")),
    false
  );
  assert.equal(
    deck.some((card) => {
      if (!/^you\b/i.test(card.promptText)) return false;
      const extraYouMarkers = card.promptText.match(/you\s*\(/gi) || [];
      return extraYouMarkers.length > 1 || /your\s*\(/i.test(card.promptText);
    }),
    false
  );
});

test("advanced conjugation intro auto-advance is canceled when leaving home", async () => {
  const idiom = {
    id: "ptihat_einayim",
    english: "to open someone's eyes",
    english_meaning: "to open someone's eyes",
    object_type: "l_dative",
    fixed_object: "את העיניים",
    literal_sg: "{s} opens {p} eyes",
    literal_pl: "{s} open {p} eyes",
    literal_past: "{s} opened {p} eyes",
    literal_future: "{s} will open {p} eyes",
    showMeaning: false,
    present_tense: { msg: "פותח", fsg: "פותחת", mpl: "פותחים", fpl: "פותחות" },
    past_tense: { msg: "פתח", fsg: "פתחה", mpl: "פתחו", fpl: "פתחו" },
    future_tense: { msg: "יפתח", fsg: "תפתח", mpl: "יפתחו", fpl: "יפתחו" },
  };
  const { goHome, startAdvConj, state } = loadAppHarness([], [], [], {
    idioms: [idiom],
  });

  startAdvConj();
  assert.equal(state.advConj.introActive, true);

  goHome();
  await waitForTimers();

  assert.equal(state.advConj.active, false);
  assert.equal(state.advConj.introActive, false);
  assert.equal(state.advConj.currentQuestion, null);
});

test("verb match start flow enters intro state and home clears it", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
    { id: "beta", category: "core_advanced", en: "beta", he: "בטא", heNiqqud: "בֵּטָא", utility: 79, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-go", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "present_feminine_singular", englishText: "she goes", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת" },
      ],
    },
  ];
  const { goHome, startVerbMatch, state } = loadAppHarness(vocabulary, [], verbDeck);

  startVerbMatch();
  assert.equal(state.match.verbIntroActive, true);
  assert.equal(state.route, "home");

  goHome();
  assert.equal(state.match.verbIntroActive, false);
  assert.equal(state.route, "home");
  assert.equal(state.abbreviation.active, false);
  assert.equal(state.lesson.active, false);
  assert.equal(state.match.active, false);
});

test("starting conjugation immediately swaps out the home picker and shows five visible rows", async () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-cool", en: "to cool", he: "לקרר", heNiqqud: "לְקָרֵר" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he cools", valuePlain: "מקרר", valueNiqqud: "מְקָרֵר" },
        { id: "present_feminine_singular", englishText: "she cools", valuePlain: "מקררת", valueNiqqud: "מְקָרֶרֶת" },
        { id: "past_first_person_singular", englishText: "I cooled", valuePlain: "קיררתי", valueNiqqud: "קִרַּרְתִּי" },
        { id: "future_first_person_singular", englishText: "I will cool", valuePlain: "אקרר", valueNiqqud: "אֲקָרֵר" },
        { id: "present_masculine_plural", englishText: "they (m.pl.) cool", valuePlain: "מקררים", valueNiqqud: "מְקָרְרִים" },
        { id: "present_feminine_plural", englishText: "they (f.pl.) cool", valuePlain: "מקררות", valueNiqqud: "מְקָרְרוֹת" },
      ],
    },
  ];

  const harness = loadAppHarness(vocabulary, [], verbDeck);
  const dashboard = harness.document.querySelector("#homeDashboard");
  const stage = harness.document.querySelector("#homeLessonStage");

  harness.startVerbMatch();
  assert.equal(dashboard.classList.contains("hidden"), true);
  assert.equal(stage.classList.contains("hidden"), false);
  assert.equal(harness.state.match.verbIntroActive, true);

  await waitForTimers();
  assert.equal(harness.state.match.leftCards.length, 5);
  assert.equal(harness.state.match.rightCards.length, 5);
  harness.goHome();
});

test("conjugation prompt keeps the English gloss separate from the display-font Hebrew infinitive", () => {
  const verbDeck = [{
    word: { id: "verb-open", en: "to open", he: "לפתוח", heNiqqud: "לִפְתֹּחַ" },
    forms: [],
  }];
  const harness = loadAppHarness([], [], verbDeck);
  harness.state.mode = "verbMatch";
  harness.state.match.active = true;
  harness.state.match.currentVerb = verbDeck[0];
  harness.state.showNiqqudInline = true;

  harness.app.verbMatch.renderVerbMatchPrompt();

  const prompt = harness.document.querySelector("#promptText");
  assert.equal(prompt.classList.contains("verb-match-prompt"), true);
  assert.equal(prompt.children.length, 3);
  assert.equal(prompt.children[0].classList.contains("verb-prompt-english"), true);
  assert.equal(prompt.children[0].textContent, "to open");
  assert.equal(prompt.children[1].textContent, "|");
  assert.equal(prompt.children[2].classList.contains("verb-prompt-hebrew"), true);
  assert.equal(prompt.children[2].getAttribute("lang"), "he");
  assert.equal(prompt.children[2].textContent, "לִפְתֹּחַ");
});

test("conjugation keeps English on the left and Hebrew on the right in Hebrew UI", async () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-come", en: "to come", he: "לבוא", heNiqqud: "לָבוֹא" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he comes", valuePlain: "בא", valueNiqqud: "בָּא" },
        { id: "future_first_person_singular", englishText: "I will come", valuePlain: "אבוא", valueNiqqud: "אָבוֹא" },
      ],
    },
  ];

  const harness = loadAppHarness(vocabulary, [], verbDeck);
  harness.state.language = "he";
  harness.startVerbMatch();
  await waitForTimers();

  const columns = harness.document.querySelector("#choiceContainer").querySelector(".match-columns");
  assert.equal(columns.getAttribute("dir"), "ltr");
  assert.equal(columns.children[0].classList.contains("hebrew"), false);
  assert.equal(columns.children[1].classList.contains("hebrew"), true);
  harness.goHome();
});

test("conjugation sessions are capped to a small verb set so results are reachable", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
  ];
  const verbDeck = Array.from({ length: 8 }, (_, index) => ({
    word: {
      id: `verb-${index + 1}`,
      en: `to test ${index + 1}`,
      he: `לבדוק${index + 1}`,
      heNiqqud: `לִבְדוֹק${index + 1}`,
    },
    formSource: "validated",
    forms: [
      { id: "present_masculine_singular", englishText: `he tests ${index + 1}`, valuePlain: `בודק${index + 1}`, valueNiqqud: `בּוֹדֵק${index + 1}` },
      { id: "present_feminine_singular", englishText: `she tests ${index + 1}`, valuePlain: `בודקת${index + 1}`, valueNiqqud: `בּוֹדֶקֶת${index + 1}` },
      { id: "past_first_person_singular", englishText: `I tested ${index + 1}`, valuePlain: `בדקתי${index + 1}`, valueNiqqud: `בָּדַקְתִּי${index + 1}` },
      { id: "future_first_person_singular", englishText: `I will test ${index + 1}`, valuePlain: `אבדוק${index + 1}`, valueNiqqud: `אֶבְדּוֹק${index + 1}` },
    ],
  }));

  const { startVerbMatch, state } = loadAppHarness(vocabulary, [], verbDeck);
  startVerbMatch();

  assert.equal(state.match.totalVerbs, 1);
  assert.equal(state.match.verbQueue.length, 1);
});

test("active learn sessions stay pinned to home and restored intros auto-advance into gameplay", async () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
    { id: "beta", category: "core_advanced", en: "beta", he: "בטא", heNiqqud: "בֵּטָא", utility: 79, source: "test" },
    { id: "gamma", category: "core_advanced", en: "gamma", he: "גמא", heNiqqud: "גַּמָּא", utility: 78, source: "test" },
    { id: "delta", category: "core_advanced", en: "delta", he: "דלתא", heNiqqud: "דֶּלְתָּא", utility: 77, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-go", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "present_feminine_singular", englishText: "she goes", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת" },
      ],
    },
  ];

  const activeSessionHarness = loadAppHarness(vocabulary, [], verbDeck);
  activeSessionHarness.startVerbMatch();
  await waitForTimers();
  assert.equal(activeSessionHarness.state.route, "home");
  assert.equal(activeSessionHarness.document.body.getAttribute("data-learn-session"), "true");
  activeSessionHarness.navigateTo("review");
  assert.equal(activeSessionHarness.state.route, "home");
  activeSessionHarness.navigateTo("settings");
  assert.equal(activeSessionHarness.state.route, "home");
  activeSessionHarness.goHome();
  assert.equal(activeSessionHarness.document.body.getAttribute("data-learn-session"), "false");

  const verbHarness = loadAppHarness(vocabulary, [], verbDeck);
  verbHarness.restoreSessionState({
    mode: "verbMatch",
    route: "review",
    match: {
      active: true,
      verbIntroActive: true,
      verbQueue: verbDeck,
      totalVerbs: verbDeck.length,
      currentVerbIndex: 0,
      pairs: [],
      remainingPairs: [],
      leftCards: [],
      rightCards: [],
      mismatchedCardIds: [],
      matchedCardIds: [],
      matchedPairIds: [],
      sessionMatched: 0,
      sessionTotalPairs: 0,
      mismatchCount: 0,
      sessionMistakeIds: [],
    },
  });
  verbHarness.resumeActiveTimers();
  assert.equal(verbHarness.state.route, "home");
  await waitForTimers();
  assert.equal(verbHarness.state.match.verbIntroActive, false);
  assert.ok(verbHarness.state.match.currentVerb);
  assert.ok(verbHarness.state.match.leftCards.length > 0);
  verbHarness.goHome();
});

test("home button opens a leave confirmation before dropping session progress", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
    { id: "beta", category: "core_advanced", en: "beta", he: "בטא", heNiqqud: "בֵּטָא", utility: 79, source: "test" },
  ];
  const { closeLeaveSessionConfirm, requestGoHome, confirmLeaveSession, state } = loadAppHarness(vocabulary);

  state.mode = "verbMatch";
  state.route = "home";
  state.match.active = true;

  requestGoHome();
  assert.equal(state.leaveConfirmOpen, true);
  assert.equal(state.match.active, true);

  closeLeaveSessionConfirm();
  assert.equal(state.leaveConfirmOpen, false);
  assert.equal(state.match.active, true);

  requestGoHome();
  confirmLeaveSession();
  assert.equal(state.leaveConfirmOpen, false);
  assert.equal(state.match.active, false);
  assert.equal(state.route, "home");
});

test("leaving an active game for review keeps the warning and lands on review after confirmation", () => {
  const vocabulary = [
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test" },
    { id: "beta", category: "core_advanced", en: "beta", he: "בטא", heNiqqud: "בֵּטָא", utility: 79, source: "test" },
  ];
  const { confirmLeaveSession, requestLeaveSession, state } = loadAppHarness(vocabulary);

  state.mode = "verbMatch";
  state.route = "home";
  state.match.active = true;

  requestLeaveSession("review");
  assert.equal(state.leaveConfirmOpen, true);
  assert.equal(state.match.active, true);

  confirmLeaveSession();
  assert.equal(state.leaveConfirmOpen, false);
  assert.equal(state.match.active, false);
  assert.equal(state.route, "review");
});

test("conjugation summary opens on the results route and home exits without a leave prompt", () => {
  const vocabulary = [
    { id: "verb-go", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 80, source: "test" },
  ];
  const verbDeck = [
    {
      word: { id: "verb-go", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת" },
      formSource: "validated",
      forms: [
        { id: "present_masculine_singular", englishText: "he goes", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ" },
        { id: "present_feminine_singular", englishText: "she goes", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת" },
      ],
    },
  ];
  const { document, loadNextVerbRound, requestGoHome, state } = loadAppHarness(vocabulary, [], verbDeck);

  state.mode = "verbMatch";
  state.route = "home";
  state.match.active = true;
  state.match.verbQueue = [];
  state.match.totalVerbs = 3;
  state.match.sessionMatched = 7;
  state.match.sessionTotalPairs = 10;
  state.match.bestCombo = 4;
  state.match.elapsedSeconds = 21;
  state.match.mismatchCount = 3;
  state.match.sessionMistakeIds = ["verb-go"];
  state.match.sessionMistakeForms = [
    { key: "verb-go::present_masculine_singular", wordId: "verb-go", valuePlain: "הולך", valueNiqqud: "הוֹלֵךְ", englishText: "he goes" },
    { key: "verb-go::present_feminine_singular", wordId: "verb-go", valuePlain: "הולכת", valueNiqqud: "הוֹלֶכֶת", englishText: "she goes" },
  ];

  loadNextVerbRound();

  assert.equal(state.summary.active, true);
  assert.equal(state.route, "results");
  assert.equal(state.summary.game, "verbMatch");
  assert.equal(state.summary.correctCount, 7);
  assert.equal(state.summary.incorrectCount, 3);
  assert.equal(document.querySelector("#resultsView").classList.contains("active"), true);
  assert.equal(document.querySelector("#resultsNote").textContent, "Nice job!");
  assert.equal(document.querySelector("#resultsSummary").children[0].children.length, 1);
  assert.equal(document.querySelector("#resultsSummary").children[0].children[0].children[0].children.length, 1);
  assert.deepEqual(
    JSON.parse(JSON.stringify(state.summary.mistakes)),
    [
      {
        primary: "לָלֶכֶת",
        secondary: "to go",
        forms: [
          { primary: "הוֹלֵךְ", secondary: "he goes" },
          { primary: "הוֹלֶכֶת", secondary: "she goes" },
        ],
        overflow: 0,
      },
    ]
  );
  const verbForms = document.querySelector("#resultsSummary").querySelectorAll(".verb-mistake-forms");
  assert.equal(verbForms.length, 1);
  assert.equal(verbForms[0].children.length, 2);

  requestGoHome();
  assert.equal(state.leaveConfirmOpen, false);
  assert.equal(state.summary.active, false);
  assert.equal(state.route, "home");
});

test("translation pool excludes words marked unavailable for translation quiz", () => {
  const vocabulary = [
    { id: "basic-go", category: "core_advanced", en: "to go", he: "ללכת", heNiqqud: "לָלֶכֶת", utility: 91, source: "verb-seed", availability: { translationQuiz: false, sentenceHints: true } },
    { id: "basic-office", category: "work_business", en: "office", he: "משרד", heNiqqud: "מִשְׂרָד", utility: 82, source: "seed", availability: { translationQuiz: false, sentenceHints: true } },
    { id: "alpha", category: "core_advanced", en: "alpha", he: "אלפא", heNiqqud: "אַלְפָא", utility: 80, source: "test", availability: { translationQuiz: true, sentenceHints: true } },
  ];
  const { getSelectedPool } = loadAppHarness(vocabulary);

  assert.deepEqual(
    Array.from(getSelectedPool(), (word) => word.id),
    ["alpha"]
  );
});

test("prepositions runs a second-chance review phase for missed questions", () => {
  const harness = loadAppHarness([]);
  const { app, state } = harness;
  const prep = state.prepositions;

  app.runtime.helpers.playAnswerFeedbackSound = () => {};
  app.runtime.helpers.renderDomainPerformance = () => {};
  app.runtime.helpers.renderMostMissed = () => {};
  app.prepositions.markPrepositionsChoiceResults = () => {};
  app.prepositions.renderPrepositionsQuestion = () => {};

  state.mode = "prepositions";
  prep.active = true;

  const makeQuestion = (over = {}) => ({
    triggerId: "prep-wait",
    objectKey: "me",
    triggerHe: "מחכה",
    prepBase: "ל",
    objectLabel: "me",
    promptText: "מחכה ____",
    englishHint: "to wait for me",
    correctAnswer: "לִי",
    answerPlain: "מחכה לי",
    answerNiqqud: "מחכה לִי",
    options: [
      { id: "correct", text: "לי", textNiqqud: "לִי", isCorrect: true },
      { id: "d1", text: "בי", textNiqqud: "בִּי", isCorrect: false },
    ],
    selectedOptionId: "d1",
    locked: false,
    ...over,
  });

  prep.currentQuestion = makeQuestion();
  app.prepositions.applyPrepositionsAnswer();
  assert.equal(prep.reviewQueue.length, 1);
  assert.equal(prep.reviewQueue[0].isReview, true);
  assert.equal(prep.reviewQueue[0].locked, false);
  assert.equal(prep.reviewQueue[0].selectedOptionId, null);

  prep.currentQuestion = makeQuestion();
  app.prepositions.applyPrepositionsAnswer();
  assert.equal(prep.reviewQueue.length, 1, "double miss must not duplicate the review item");
  assert.equal(prep.sessionMistakes.length, 1, "double miss must not duplicate the clinic entry");

  prep.questionQueue = [];
  const scoreBefore = state.sessionScore;
  app.prepositions.loadPrepositionsQuestion();
  assert.equal(prep.inReview, true);
  assert.equal(prep.secondChanceTotal, 1);
  assert.equal(prep.introActive, true, "the game's own intro replays as the second-chance break");

  app.prepositions.beginPrepositionsFromIntro();
  assert.equal(prep.secondChanceCurrent, 1);
  assert.equal(prep.currentQuestion.isReview, true);

  prep.currentQuestion.selectedOptionId = "correct";
  app.prepositions.applyPrepositionsAnswer();
  assert.equal(state.sessionScore, scoreBefore, "review answers award no session score");

  app.prepositions.loadPrepositionsQuestion();
  assert.equal(state.summary.active, true);
  assert.equal(state.summary.noteKey, "summary.lessonNote");
  assert.equal(state.summary.noteVars.count, 1);
  assert.equal(prep.inReview, false);
  assert.equal(prep.secondChanceTotal, 0);
});

test("conjugation+ review re-asks missed questions once and never re-queues review misses", () => {
  const harness = loadAppHarness([]);
  const { app, state } = harness;
  const advConj = state.advConj;

  app.runtime.helpers.playAnswerFeedbackSound = () => {};
  app.runtime.helpers.renderDomainPerformance = () => {};
  app.runtime.helpers.renderMostMissed = () => {};
  app.advConj.markAdvConjChoiceResults = () => {};
  app.advConj.renderAdvConjQuestion = () => {};

  state.mode = "advConj";
  advConj.active = true;

  const makeQuestion = (over = {}) => ({
    idiomId: "idiom-1",
    tense: "past",
    subjectForm: "אני",
    subjectLabel: "I",
    objectKey: "him",
    objectLabel: "him",
    direction: "en2he",
    promptText: "I trusted him",
    correctAnswer: "סָמַכְתִּי עָלָיו",
    options: [
      { id: "correct", text: "סמכתי עליו", isCorrect: true },
      { id: "d1", text: "סמכתי אותו", isCorrect: false },
    ],
    selectedOptionId: "d1",
    locked: false,
    ...over,
  });

  advConj.currentQuestion = makeQuestion();
  app.advConj.applyAdvConjAnswer();
  advConj.currentQuestion = makeQuestion();
  app.advConj.applyAdvConjAnswer();
  assert.equal(advConj.reviewQueue.length, 1, "same idiom/tense/subject/object missed twice queues once");

  advConj.questionQueue = [];
  app.advConj.loadAdvConjQuestion();
  assert.equal(advConj.inReview, true);
  assert.equal(advConj.secondChanceTotal, 1);
  assert.equal(advConj.introActive, true);

  app.advConj.beginAdvConjFromIntro();
  assert.equal(advConj.secondChanceCurrent, 1);
  assert.equal(advConj.currentQuestion.isReview, true);

  const wrongBefore = advConj.wrongAnswers;
  app.advConj.applyAdvConjAnswer();
  assert.equal(advConj.wrongAnswers, wrongBefore + 1, "review misses still count as wrong");
  assert.equal(advConj.reviewQueue.length, 0, "a miss during review must not re-queue");

  app.advConj.loadAdvConjQuestion();
  assert.equal(state.summary.active, true);
  assert.equal(state.summary.noteKey, "summary.lessonNote");
  assert.equal(state.summary.noteVars.count, 1);
  assert.equal(advConj.inReview, false);
});

test("binyan board replays missed forms in a second-chance phase", () => {
  const harness = loadAppHarness([]);
  const { app, state } = harness;
  const board = state.binyanBoard;

  app.runtime.helpers.playAnswerFeedbackSound = () => {};
  app.runtime.helpers.renderDomainPerformance = () => {};
  app.runtime.helpers.renderMostMissed = () => {};
  app.binyanBoard.renderBinyanBoardFeedback = () => {};
  app.binyanBoard.markBinyanBoardChoiceResults = () => {};
  app.binyanBoard.renderBinyanBoard = () => {};

  state.mode = "binyanBoard";
  board.active = true;
  board.startMs = 1;
  board.deck = [
    {
      id: "root1",
      emoji: "🌳",
      cleared: false,
      forms: [
        { formId: "f1", slot: "paal", binyanNameHe: "פָּעַל", formVocalized: "פָּתַח", gloss: "opened", func: "", teachingPoint: "", distractorEligible: true },
        { formId: "f2", slot: "nifal", binyanNameHe: "נִפְעַל", formVocalized: "נִפְתַּח", gloss: "was opened", func: "", teachingPoint: "", distractorEligible: true },
      ],
    },
  ];
  board.distractorPool = ["developed", "was written", "closed"];
  board.totalRoots = 1;

  board.currentQuestion = {
    formId: "f1",
    formVocalized: "פָּתַח",
    gloss: "opened",
    options: [
      { id: "correct", text: "opened", isCorrect: true },
      { id: "d1", text: "closed", isCorrect: false },
    ],
    selectedOptionId: "d1",
    locked: false,
  };
  app.binyanBoard.applyBinyanBoardAnswer();
  assert.equal(board.reviewQueue.length, 1);
  assert.equal(board.reviewQueue[0], "f1");

  const scoreBefore = state.sessionScore;
  const correctBefore = board.correctCount;
  app.binyanBoard.finishRoot(board.deck[0]);
  assert.equal(board.inReview, true);
  assert.equal(board.secondChanceTotal, 1);
  assert.equal(board.introActive, true, "binyan intro replays before the review phase");
  assert.equal(state.summary.active, false, "summary must wait for the review phase");

  app.binyanBoard.beginBinyanBoardFromIntro();
  assert.equal(board.secondChanceCurrent, 1);
  assert.ok(board.currentQuestion);
  assert.equal(board.currentQuestion.formId, "f1");
  assert.equal(board.currentQuestion.isReview, true);

  board.currentQuestion.selectedOptionId = "correct";
  app.binyanBoard.applyBinyanBoardAnswer();
  assert.equal(state.sessionScore, scoreBefore, "review answers award no session score");
  assert.equal(board.correctCount, correctBefore + 1, "review answers still count in the summary totals");

  app.binyanBoard.handleBinyanBoardNext();
  assert.equal(state.summary.active, true);
  assert.equal(state.summary.noteKey, "summary.lessonNote");
  assert.equal(state.summary.noteVars.count, 1);
});

test("gameplay header shows second-chance progress and review titles for the three quiz games", () => {
  const harness = loadAppHarness([]);
  const { app, state, document } = harness;

  const cases = [
    { mode: "prepositions", slice: state.prepositions, title: "Prepositions Review" },
    { mode: "advConj", slice: state.advConj, title: "Conjugation+ Review" },
    { mode: "binyanBoard", slice: state.binyanBoard, title: "Binyanim Review" },
  ];

  cases.forEach(({ mode, slice, title }) => {
    state.mode = mode;
    slice.active = true;
    slice.inReview = true;
    slice.secondChanceCurrent = 1;
    slice.secondChanceTotal = 3;
    const meta = app.ui.getGameplayHeaderMeta();
    assert.equal(meta.progressText, "Second chance: 1/3", `${mode} header meta`);
    app.ui.renderSessionHeader();
    assert.equal(document.querySelector("#modeTitle").textContent, title, `${mode} review title`);
    slice.active = false;
    slice.inReview = false;
  });
});

test("review page markup exposes two sub-tabs and no mastered modal", () => {
  const markup = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(markup, /data-review-tab="overview"[\s\S]*data-review-tab="trouble"/s);
  assert.match(markup, /id="reviewOverviewPanel"[\s\S]*id="reviewTroublePanel"/s);
  assert.match(markup, /id="reviewPanelToggle"[\s\S]*aria-controls="reviewPanel"/s);
  assert.match(markup, /id="mostMissedList"/);
  assert.match(markup, /id="reviewDomainPerformance"/);
  assert.doesNotMatch(markup, /data-review-tab="wordbank"/);
  assert.doesNotMatch(markup, /id="reviewWordBankPanel"/);
  assert.doesNotMatch(markup, /id="wordBankSearch"/);
  assert.doesNotMatch(markup, /id="weakestLettersList"/);
  assert.doesNotMatch(markup, /id="masteredModal"/);
});

test("getHardestVerbs ranks low-accuracy conjugation records above noise", () => {
  const vocabulary = [
    { id: "verb-a", category: "core", en: "to open", he: "לפתוח", heNiqqud: "לִפְתֹּחַ", utility: 90 },
    { id: "verb-b", category: "core", en: "to close", he: "לסגור", heNiqqud: "לִסְגֹּר", utility: 90 },
    { id: "verb-c", category: "core", en: "to write", he: "לכתוב", heNiqqud: "לִכְתֹּב", utility: 90 },
  ];
  const harness = loadAppHarness(vocabulary);
  const { app, state } = harness;

  state.progress["verb-a"] = { conjugationAttempts: 10, conjugationCorrect: 4 };
  state.progress["verb-b"] = { conjugationAttempts: 2, conjugationCorrect: 0 };
  state.progress["verb-c"] = { conjugationAttempts: 6, conjugationCorrect: 6 };

  const hardest = app.data.getHardestVerbs(5);
  assert.equal(hardest.length, 1, "below-threshold and perfect records are excluded");
  assert.equal(hardest[0].word.id, "verb-a");
  assert.equal(hardest[0].attempts, 10);
  assert.equal(hardest[0].correct, 4);
});

test("getWorstSentences surfaces high-miss-rate sentence records by direction", () => {
  const sentenceBank = [
    {
      id: "sb-1",
      category: "everyday",
      difficulty: 1,
      english: "Good morning.",
      hebrew: "בוקר טוב.",
      english_tokens: ["Good", "morning"],
      hebrew_tokens: ["בוקר", "טוב"],
      english_distractors: ["evening"],
      hebrew_distractors: ["ערב"],
      notes: "n",
    },
    {
      id: "sb-2",
      category: "everyday",
      difficulty: 1,
      english: "Good night.",
      hebrew: "לילה טוב.",
      english_tokens: ["Good", "night"],
      hebrew_tokens: ["לילה", "טוב"],
      english_distractors: ["morning"],
      hebrew_distractors: ["בוקר"],
      notes: "n",
    },
  ];
  const harness = loadAppHarness([], [], [], { sentenceBank });
  const { app, state } = harness;

  state.sentenceProgress["sb-1::he2en"] = { attempts: 4, correct: 1, misses: 3 };
  state.sentenceProgress["sb-2::listen"] = { attempts: 4, correct: 3, misses: 1 };
  state.sentenceProgress["sb-2::en2he"] = { attempts: 1, correct: 0, misses: 1 };

  const worst = app.sentenceBank.getWorstSentences(5);
  assert.equal(worst.length, 2, "single-attempt records are excluded");
  assert.equal(worst[0].sentence.id, "sb-1");
  assert.equal(worst[0].direction, "he2en");
  assert.equal(worst[0].misses, 3);
  assert.equal(worst[1].sentence.id, "sb-2");

  assert.equal(app.sentenceBank.getPracticedSentenceCount(), 2);
});

test("review tab persists through ui state and word bank reflects mastered toggles", () => {
  const vocabulary = [
    { id: "word-a", category: "core", en: "table", he: "שולחן", heNiqqud: "שֻׁלְחָן", utility: 90 },
    { id: "word-b", category: "core", en: "chair", he: "כיסא", heNiqqud: "כִּסֵּא", utility: 90 },
  ];
  const harness = loadAppHarness(vocabulary);
  const { app, state } = harness;

  state.reviewTab = "trouble";
  app.persistence.persistUiState();
  const savedUi = JSON.parse(harness.localStorage.getItem(app.runtime.constants.STORAGE_KEYS.ui));
  assert.equal(savedUi.reviewTab, "trouble");

  app.data.setWordMastered("word-a", true);
  const entries = app.data.getWordBankEntries();
  const masteredEntry = entries.find((entry) => entry.word.id === "word-a");
  assert.equal(masteredEntry.mastered, true);
  assert.equal(app.data.getSelectedPool().some((word) => word.id === "word-a"), false, "mastered words leave the translation pool");
  assert.equal(app.data.getReviewOverviewStats().masteredCount, 1);

  app.data.setWordMastered("word-a", false);
  assert.equal(app.data.getSelectedPool().some((word) => word.id === "word-a"), true);
});

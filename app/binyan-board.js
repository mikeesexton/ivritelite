(function initIvriQuestAppBinyanBoard(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const binyanBoard = app.binyanBoard = app.binyanBoard || {};

const BINYAN_ORDER = ["paal", "nifal", "piel", "pual", "hifil", "hufal", "hitpael"];
const BINYAN_ROUND_ROOT_COUNT = 6;
const TEACHING_POINT_KEYS = {
  "No metathesis — ל is not a sibilant, so the ת of hitpael stays put.": "binyan.teaching.noMetathesis",
  "Metathesis: ת and ס swap (התסדר → הסתדר) because the first radical is a sibilant.": "binyan.teaching.sibilantMetathesis",
  "Emphatic metathesis: ת swaps AND becomes ט after צ (התצלם → הצטלם).": "binyan.teaching.emphaticMetathesis",
  "Pi'el SLOT realized as polel (CoCeC) because the root is hollow.": "binyan.teaching.hollowFactitiveActive",
  "Pu'al slot realized as polal.": "binyan.teaching.hollowFactitivePassive",
  "Hitpael slot realized as hitpolel for hollow roots.": "binyan.teaching.hollowReflexive",
};

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function getSession() {
  return app.session || {};
}

function getGameData() {
  return global.IvriQuestVerbGameData || null;
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

function shuffle(list) {
  return typeof app.utils?.shuffle === "function" ? app.utils.shuffle(list) : list;
}

function getBinyanNameHe(slot) {
  const data = getGameData();
  const meta = (data?.BINYANIM || []).find((entry) => entry.slot === slot);
  return meta ? meta.name_he : "";
}

function getTranslatedText(key, vars = {}) {
  const value = translate(key, vars);
  return value === key ? "" : value;
}

function selectBinyanRoundRoots(roots) {
  return shuffle(roots.slice()).slice(0, BINYAN_ROUND_ROOT_COUNT);
}

function getBinyanGlossMeaningParts(gloss) {
  return [...new Set(String(gloss || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\bor\b/g, ",")
    .replace(/[;/]/g, ",")
    .split(",")
    .map((part) => part.trim().replace(/\s+/g, " "))
    .filter(Boolean))]
    .sort();
}

function canUseBinyanDistractorGloss(gloss, usedGlosses) {
  if (!gloss) return false;
  return !usedGlosses.some((usedGloss) => binyanBoard.areBinyanGlossesConfusinglySimilar(usedGloss, gloss));
}

binyanBoard.getBinyanGlossMeaningKey = binyanBoard.getBinyanGlossMeaningKey || function getBinyanGlossMeaningKey(gloss) {
  return getBinyanGlossMeaningParts(gloss).join("|");
};

binyanBoard.areBinyanGlossesConfusinglySimilar = binyanBoard.areBinyanGlossesConfusinglySimilar || function areBinyanGlossesConfusinglySimilar(firstGloss, secondGloss) {
  const firstParts = getBinyanGlossMeaningParts(firstGloss);
  const secondParts = getBinyanGlossMeaningParts(secondGloss);
  if (!firstParts.length || !secondParts.length) return false;

  const firstKey = firstParts.join("|");
  const secondKey = secondParts.join("|");
  if (firstKey === secondKey) return true;

  const firstSet = new Set(firstParts);
  const secondSet = new Set(secondParts);
  const firstInSecond = firstParts.every((part) => secondSet.has(part));
  const secondInFirst = secondParts.every((part) => firstSet.has(part));
  return firstInSecond || secondInFirst;
};

binyanBoard.getBinyanFunctionHintText = binyanBoard.getBinyanFunctionHintText || function getBinyanFunctionHintText(question) {
  const slot = String(question?.slot || "").trim();
  if (!slot) return "";
  return getTranslatedText(`binyan.functionHint.${slot}`);
};

binyanBoard.renderBinyanFunctionHint = binyanBoard.renderBinyanFunctionHint || function renderBinyanFunctionHint(question) {
  const runtime = getRuntime();
  const button = runtime.el?.promptFunctionHint;
  if (!button) return;

  const hintText = binyanBoard.getBinyanFunctionHintText(question);
  const showHint = Boolean(hintText);
  button.classList.toggle("hidden", !showHint);
  if (!showHint) {
    button.textContent = "";
    button.classList.remove("is-revealed");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "");
    button.setAttribute("title", "");
    app.ui?.updatePromptCardState?.();
    return;
  }

  const isRevealed = Boolean(question.functionHintRevealed);
  const hiddenText = getTranslatedText("binyan.functionHint.hidden") || "Hint";
  const revealTitle = getTranslatedText("binyan.functionHint.revealTitle") || "Show function hint";
  const hideTitle = getTranslatedText("binyan.functionHint.hideTitle") || "Hide function hint";
  button.textContent = isRevealed ? hintText : hiddenText;
  button.classList.toggle("is-revealed", isRevealed);
  button.setAttribute("aria-expanded", isRevealed ? "true" : "false");
  button.setAttribute("aria-label", isRevealed ? hideTitle : revealTitle);
  button.setAttribute("title", isRevealed ? hintText : revealTitle);
  app.ui?.updatePromptCardState?.();
};

binyanBoard.toggleBinyanFunctionHint = binyanBoard.toggleBinyanFunctionHint || function toggleBinyanFunctionHint() {
  const question = getRuntime().state.binyanBoard.currentQuestion;
  if (!question) return;
  question.functionHintRevealed = !question.functionHintRevealed;
  binyanBoard.renderBinyanFunctionHint(question);
};

binyanBoard.formatBinyanFeedbackGloss = binyanBoard.formatBinyanFeedbackGloss || function formatBinyanFeedbackGloss(gloss) {
  const parts = String(gloss || "")
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) return String(gloss || "").trim();
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, or ${parts[parts.length - 1]}`;
};

binyanBoard.formatBinyanRootMeaning = binyanBoard.formatBinyanRootMeaning || function formatBinyanRootMeaning(meaning) {
  return String(meaning || "")
    .trim()
    .replace(/\s*\/\s*/g, ", ");
};

binyanBoard.getBinyanFeedbackDetail = binyanBoard.getBinyanFeedbackDetail || function getBinyanFeedbackDetail(question) {
  const key = TEACHING_POINT_KEYS[question?.teachingPoint || ""];
  return key ? getTranslatedText(key) : "";
};

binyanBoard.renderBinyanBoardFeedback = binyanBoard.renderBinyanBoardFeedback || function renderBinyanBoardFeedback(question) {
  const h = getHelpers();
  if (!question || typeof question.isCorrect !== "boolean") return;
  h.setFeedback?.({
    tone: question.isCorrect ? "success" : "error",
    sentence: translate(
      question.isCorrect ? "feedback.binyanCorrect" : "feedback.binyanWrong",
      {
        form: question.formVocalized,
        gloss: binyanBoard.formatBinyanFeedbackGloss(question.gloss),
      }
    ),
    detail: binyanBoard.getBinyanFeedbackDetail(question),
  });
};

binyanBoard.updateBinyanBoardStats = binyanBoard.updateBinyanBoardStats || function updateBinyanBoardStats(isCorrect) {
  const runtime = getRuntime();
  const storageKey = runtime.constants?.STORAGE_KEYS?.binyanBoardStats;
  if (!storageKey || !runtime.storageApi?.loadJson || !runtime.storageApi?.saveJson) return;

  const stats = runtime.storageApi.loadJson(storageKey, { attempts: 0, correct: 0 }) || {};
  const attempts = Math.max(0, Number(stats.attempts || 0)) + 1;
  const correct = Math.max(0, Math.min(attempts, Number(stats.correct || 0) + (isCorrect ? 1 : 0)));
  runtime.storageApi.saveJson(storageKey, { attempts, correct });
};

binyanBoard.getBinyanBoardPromptSpeechPayload = binyanBoard.getBinyanBoardPromptSpeechPayload || function getBinyanBoardPromptSpeechPayload(question = getRuntime().state.binyanBoard.currentQuestion) {
  if (!question?.formVocalized) return null;
  return app.speech?.buildSpeechPayload?.({
    plain: question.formVocalized,
    niqqud: question.formVocalized,
    source: "prompt",
  }) || null;
};

binyanBoard.buildBinyanBoardDeck = binyanBoard.buildBinyanBoardDeck || function buildBinyanBoardDeck() {
  const data = getGameData();
  const roots = Array.isArray(data?.ROOTS) ? data.ROOTS : [];

  const deckRoots = roots.map((root) => {
    const forms = [];
    for (const slot of BINYAN_ORDER) {
      const form = root.forms?.[slot];
      if (!form || form.exists !== true) continue;
      const entry = {
        formId: `${root.id}:${slot}`,
        rootId: root.id,
        slot,
        binyanNameHe: getBinyanNameHe(slot),
        formVocalized: form.form_vocalized || "",
        translit: form.translit || "",
        gloss: form.gloss || "",
        func: form.function || "",
        teachingPoint: form.teaching_point || "",
        distractorEligible: form.distractor_eligible !== false,
      };
      forms.push(entry);
    }
    return {
      id: root.id,
      root: root.root,
      coreMeaning: root.core_meaning || "",
      difficulty: root.difficulty || "",
      forms,
      cleared: false,
    };
  }).filter((root) => root.forms.length > 0);

  const selectedRoots = selectBinyanRoundRoots(deckRoots);
  const distractorPool = selectedRoots.flatMap((root) => (
    root.forms
      .filter((form) => form.distractorEligible && form.gloss)
      .map((form) => form.gloss)
  ));

  return { roots: selectedRoots, distractorPool };
};

binyanBoard.buildBinyanBoardQuestion = binyanBoard.buildBinyanBoardQuestion || function buildBinyanBoardQuestion(form, rootEntry) {
  const runtime = getRuntime();
  const board = runtime.state.binyanBoard;
  const usedGlosses = [form.gloss];

  const siblingGlosses = rootEntry.forms
    .filter((sibling) => sibling.formId !== form.formId && sibling.distractorEligible && sibling.gloss)
    .map((sibling) => sibling.gloss);

  const distractors = [];
  for (const gloss of shuffle([...siblingGlosses])) {
    if (distractors.length >= 3) break;
    if (!canUseBinyanDistractorGloss(gloss, usedGlosses)) continue;
    usedGlosses.push(gloss);
    distractors.push(gloss);
  }

  if (distractors.length < 3) {
    for (const gloss of shuffle([...(board.distractorPool || [])])) {
      if (distractors.length >= 3) break;
      if (!canUseBinyanDistractorGloss(gloss, usedGlosses)) continue;
      usedGlosses.push(gloss);
      distractors.push(gloss);
    }
  }

  const options = shuffle([
    { id: "correct", text: form.gloss, isCorrect: true },
    ...distractors.map((gloss, index) => ({ id: `d${index + 1}`, text: gloss, isCorrect: false })),
  ]);

  return {
    rootId: rootEntry.id,
    formId: form.formId,
    slot: form.slot,
    binyanNameHe: form.binyanNameHe,
    formVocalized: form.formVocalized,
    gloss: form.gloss,
    func: form.func,
    teachingPoint: form.teachingPoint,
    functionHintRevealed: false,
    isCorrect: null,
    options,
    selectedOptionId: null,
    locked: false,
  };
};

binyanBoard.startBinyanBoard = binyanBoard.startBinyanBoard || function startBinyanBoard() {
  const runtime = getRuntime();
  const h = getHelpers();
  const s = getSession();

  app.speech?.cancel?.();
  s.stopVerbMatchTimer?.();
  s.stopLessonTimer?.();
  s.stopSentenceBankTimer?.();
  s.stopAbbreviationTimer?.();
  s.resetAdvConjState?.();
  h.resetVerbMatchState?.();
  h.resetAbbreviationState?.();
  h.resetSentenceBankState?.();
  s.clearSummaryState?.();
  binyanBoard.resetBinyanBoardState();
  h.resetSessionScore?.();
  h.clearFeedback?.();

  runtime.state.mode = "binyanBoard";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = "binyanBoard";

  const deck = binyanBoard.buildBinyanBoardDeck();
  const board = runtime.state.binyanBoard;
  board.deck = deck.roots;
  board.distractorPool = deck.distractorPool;
  board.totalRoots = deck.roots.length;
  board.clearedCount = 0;
  board.active = true;
  board.activeRootId = "";
  board.currentQuestion = null;
  board.startMs = Date.now();

  binyanBoard.startBinyanBoardTimer();
  h.renderAll?.();
};

binyanBoard.startBinyanBoardTimer = binyanBoard.startBinyanBoardTimer || function startBinyanBoardTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  binyanBoard.stopBinyanBoardTimer();
  runtime.state.binyanBoard.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.binyanBoard.active) return;
    runtime.state.binyanBoard.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.binyanBoard.startMs) / 1000));
    if (runtime.state.mode === "binyanBoard") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

binyanBoard.stopBinyanBoardTimer = binyanBoard.stopBinyanBoardTimer || function stopBinyanBoardTimer() {
  const runtime = getRuntime();
  if (!runtime.state.binyanBoard.timerId) return;
  runtime.global.clearInterval(runtime.state.binyanBoard.timerId);
  runtime.state.binyanBoard.timerId = null;
};

binyanBoard.resetBinyanBoardState = binyanBoard.resetBinyanBoardState || function resetBinyanBoardState() {
  const runtime = getRuntime();
  binyanBoard.stopBinyanBoardTimer();
  runtime.state.binyanBoard = {
    active: false,
    deck: [],
    distractorPool: [],
    totalRoots: 0,
    clearedCount: 0,
    activeRootId: "",
    roundForms: [],
    roundIndex: 0,
    currentQuestion: null,
    correctCount: 0,
    wrongAnswers: 0,
    sessionMistakeIds: [],
    startMs: 0,
    elapsedSeconds: 0,
    timerId: null,
  };
};

binyanBoard.openRoot = binyanBoard.openRoot || function openRoot(rootId) {
  const runtime = getRuntime();
  const board = runtime.state.binyanBoard;
  if (!board.active) return;
  const rootEntry = board.deck.find((root) => root.id === rootId);
  if (!rootEntry || rootEntry.cleared) return;
  board.activeRootId = rootId;
  board.roundForms = shuffle(rootEntry.forms.slice());
  board.roundIndex = 0;
  binyanBoard.loadRoundQuestion();
};

binyanBoard.loadRoundQuestion = binyanBoard.loadRoundQuestion || function loadRoundQuestion() {
  const runtime = getRuntime();
  const h = getHelpers();
  const board = runtime.state.binyanBoard;
  const rootEntry = board.deck.find((root) => root.id === board.activeRootId);
  if (!rootEntry) {
    binyanBoard.returnToBoard();
    return;
  }
  if (board.roundIndex >= board.roundForms.length) {
    binyanBoard.finishRoot(rootEntry);
    return;
  }
  const form = board.roundForms[board.roundIndex];
  board.currentQuestion = binyanBoard.buildBinyanBoardQuestion(form, rootEntry);
  h.clearFeedback?.();
  binyanBoard.renderBinyanBoard();
  h.renderSessionHeader?.();
};

binyanBoard.applyBinyanBoardAnswer = binyanBoard.applyBinyanBoardAnswer || function applyBinyanBoardAnswer() {
  const runtime = getRuntime();
  const h = getHelpers();
  const board = runtime.state.binyanBoard;
  const question = board.currentQuestion;
  if (!question || question.locked) return;

  question.locked = true;
  const selected = question.options.find((option) => option.id === question.selectedOptionId);
  const isCorrect = selected?.isCorrect ?? false;

  if (isCorrect) {
    runtime.state.sessionStreak += 1;
    runtime.state.sessionScore += 1;
    board.correctCount += 1;
  } else {
    runtime.state.sessionStreak = 0;
    board.wrongAnswers += 1;
    if (!board.sessionMistakeIds.includes(question.formId)) {
      board.sessionMistakeIds.push(question.formId);
    }
  }

  question.isCorrect = isCorrect;
  binyanBoard.updateBinyanBoardStats(isCorrect);
  binyanBoard.renderBinyanBoardFeedback(question);
  h.playAnswerFeedbackSound?.(isCorrect);
  binyanBoard.markBinyanBoardChoiceResults(question);
  h.renderSessionHeader?.();
  h.renderDomainPerformance?.();
  h.renderMostMissed?.();
};

binyanBoard.handleBinyanBoardNext = binyanBoard.handleBinyanBoardNext || function handleBinyanBoardNext() {
  const runtime = getRuntime();
  const board = runtime.state.binyanBoard;
  if (!board.active) return;
  const question = board.currentQuestion;
  if (!question) return;
  if (question.locked) {
    board.roundIndex += 1;
    binyanBoard.loadRoundQuestion();
    return;
  }
  if (question.selectedOptionId) {
    binyanBoard.applyBinyanBoardAnswer();
  }
};

binyanBoard.finishRoot = binyanBoard.finishRoot || function finishRoot(rootEntry) {
  const runtime = getRuntime();
  const board = runtime.state.binyanBoard;
  if (rootEntry && !rootEntry.cleared) {
    rootEntry.cleared = true;
    board.clearedCount += 1;
  }
  board.currentQuestion = null;
  board.activeRootId = "";
  board.roundForms = [];
  board.roundIndex = 0;

  if (board.deck.every((root) => root.cleared)) {
    binyanBoard.finishBinyanBoard();
    return;
  }
  binyanBoard.returnToBoard();
};

binyanBoard.returnToBoard = binyanBoard.returnToBoard || function returnToBoard() {
  const h = getHelpers();
  const runtime = getRuntime();
  runtime.state.binyanBoard.currentQuestion = null;
  runtime.state.binyanBoard.activeRootId = "";
  h.clearFeedback?.();
  binyanBoard.renderBinyanBoard();
  h.renderSessionHeader?.();
};

binyanBoard.finishBinyanBoard = binyanBoard.finishBinyanBoard || function finishBinyanBoard() {
  const runtime = getRuntime();
  const s = getSession();
  const board = runtime.state.binyanBoard;
  binyanBoard.stopBinyanBoardTimer();
  const mistakes = binyanBoard.buildBinyanBoardMistakeSummary();
  const total = board.correctCount + board.wrongAnswers;
  s.showSessionSummary?.({
    game: "binyanBoard",
    titleKey: "summary.binyanTitle",
    scoreKey: "summary.score",
    scoreVars: { score: board.correctCount, total },
    noteKey: "summary.binyanNote",
    noteVars: { roots: board.totalRoots },
    correctCount: board.correctCount,
    incorrectCount: board.wrongAnswers,
    elapsedSeconds: board.elapsedSeconds,
    mistakes,
  });
};

binyanBoard.buildBinyanBoardMistakeSummary = binyanBoard.buildBinyanBoardMistakeSummary || function buildBinyanBoardMistakeSummary() {
  const runtime = getRuntime();
  const board = runtime.state.binyanBoard;
  const byId = new Map();
  board.deck.forEach((root) => root.forms.forEach((form) => byId.set(form.formId, form)));
  return board.sessionMistakeIds
    .map((id) => {
      const form = byId.get(id);
      if (!form) return null;
      return { primary: form.formVocalized, secondary: form.gloss };
    })
    .filter(Boolean);
};

binyanBoard.renderBinyanBoard = binyanBoard.renderBinyanBoard || function renderBinyanBoard() {
  const runtime = getRuntime();
  const h = getHelpers();
  const board = runtime.state.binyanBoard;

  if (!board.active) {
    app.ui?.renderIdleLessonState?.();
    return;
  }

  h.setGamePickerVisibility?.(false);
  runtime.el.choiceContainer.classList.remove("summary-grid", "match-grid", "match-bubble-grid");

  if (board.currentQuestion) {
    binyanBoard.renderRoundQuestion(board.currentQuestion);
  } else {
    binyanBoard.renderBoardTiles();
  }
};

binyanBoard.renderBoardTiles = binyanBoard.renderBoardTiles || function renderBoardTiles() {
  const runtime = getRuntime();
  const h = getHelpers();
  const board = runtime.state.binyanBoard;

  h.setPromptCardVisibility?.(false);
  app.ui?.renderPromptLabel?.("", false);

  const container = runtime.el.choiceContainer;
  container.innerHTML = "";
  container.classList.add("binyan-board-grid");

  for (const root of board.deck) {
    const tile = global.document.createElement("button");
    tile.type = "button";
    tile.className = "game-tile binyan-root-tile";
    tile.classList.toggle("is-cleared", root.cleared);
    tile.disabled = root.cleared;

    const rootText = global.document.createElement("span");
    rootText.className = "binyan-root-letters hebrew";
    rootText.dir = "rtl";
    rootText.setAttribute("lang", "he");
    rootText.textContent = root.root;
    tile.appendChild(rootText);

    const meaning = global.document.createElement("span");
    meaning.className = "binyan-root-meaning";
    meaning.textContent = binyanBoard.formatBinyanRootMeaning(root.coreMeaning);
    tile.appendChild(meaning);

    const badge = global.document.createElement("span");
    badge.className = "binyan-root-badge";
    badge.textContent = root.cleared
      ? translate("binyan.cleared")
      : translate("binyan.formCount", { count: root.forms.length });
    tile.appendChild(badge);

    tile.addEventListener("click", () => binyanBoard.openRoot(root.id));
    container.appendChild(tile);
  }
};

binyanBoard.renderRoundQuestion = binyanBoard.renderRoundQuestion || function renderRoundQuestion(question) {
  const runtime = getRuntime();
  const h = getHelpers();

  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("binyan-board-grid");

  app.ui?.renderPromptLabel?.(question.binyanNameHe, true);
  if (runtime.el.promptText) {
    runtime.el.promptText.textContent = question.formVocalized;
    runtime.el.promptText.classList.remove("hidden", "english-prompt");
    runtime.el.promptText.classList.add("hebrew");
    runtime.el.promptText.dir = "rtl";
    runtime.el.promptText.setAttribute("lang", "he");
  }
  binyanBoard.renderBinyanFunctionHint(question);

  binyanBoard.renderBinyanBoardChoices(question);
  if (question.locked) {
    binyanBoard.renderBinyanBoardFeedback(question);
  }
  app.ui?.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

binyanBoard.renderBinyanBoardChoices = binyanBoard.renderBinyanBoardChoices || function renderBinyanBoardChoices(question) {
  const runtime = getRuntime();
  const container = runtime.el.choiceContainer;
  container.innerHTML = "";
  for (const option of question.options) {
    const btn = global.document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.textContent = option.text;
    btn.addEventListener("click", () => {
      if (question.locked) return;
      question.selectedOptionId = option.id;
      container.querySelectorAll(".choice-btn").forEach((button, index) => {
        button.classList.toggle("selected", question.options[index]?.id === option.id);
      });
      getHelpers().renderSessionHeader?.();
    });
    btn.classList.toggle("selected", question.selectedOptionId === option.id && !question.locked);
    container.appendChild(btn);
  }
  if (question.locked) {
    binyanBoard.markBinyanBoardChoiceResults(question);
  }
};

binyanBoard.markBinyanBoardChoiceResults = binyanBoard.markBinyanBoardChoiceResults || function markBinyanBoardChoiceResults(question) {
  const runtime = getRuntime();
  const buttons = runtime.el.choiceContainer.querySelectorAll(".choice-btn");
  question.options.forEach((option, index) => {
    if (!buttons[index]) return;
    if (option.isCorrect) buttons[index].classList.add("correct");
    else if (option.id === question.selectedOptionId) buttons[index].classList.add("wrong");
    buttons[index].disabled = true;
  });
};
})(typeof window !== "undefined" ? window : globalThis);

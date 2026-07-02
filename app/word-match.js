(function initIvriQuestAppWordMatch(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const wordMatch = app.wordMatch = app.wordMatch || {};

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function getData() {
  return app.data || {};
}

function getSession() {
  return app.session || {};
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

function sanitizeEnglishText(text) {
  return app.utils?.sanitizeEnglishDisplayText
    ? app.utils.sanitizeEnglishDisplayText(text)
    : String(text || "").trim();
}

wordMatch.shortGloss = wordMatch.shortGloss || function shortGloss(text) {
  const clean = sanitizeEnglishText(text);
  const longLen = getRuntime().constants?.MATCH_LONG_LEN || 16;
  if (clean.length <= longLen) return clean;
  if (clean.includes(" / ")) {
    return clean.split(" / ")[0].trim();
  }
  return clean;
};

wordMatch.resetWordMatchState = wordMatch.resetWordMatchState || function resetWordMatchState() {
  const ctx = getRuntime().state?.wordMatch;
  if (!ctx) return;
  getSession().stopWordMatchTimer?.();
  app.matchEngine?.resetBoard?.(ctx);
  ctx.active = false;
  ctx.introActive = false;
  ctx.game = "";
  ctx.startMs = 0;
  ctx.elapsedSeconds = 0;
  ctx.timerId = null;
  ctx.sessionMistakeIds = [];
};

function recordResult(ctx, id, isCorrect, mode) {
  if (!id) return;
  getData().updateProgress?.(id, isCorrect, { mode });
  if (!isCorrect && !ctx.sessionMistakeIds.includes(id)) {
    ctx.sessionMistakeIds.push(id);
  }
  app.persistence?.saveProgress?.();
}

wordMatch.buildConfig = wordMatch.buildConfig || function buildConfig(game) {
  const runtime = getRuntime();
  const ctx = runtime.state.wordMatch;
  const isLesson = game === "lessonMatch";
  const mode = isLesson ? "translationQuiz" : "abbreviationQuiz";

  return {
    ctx,
    rightIsHebrew: true,
    isActive: () => Boolean(runtime.state.wordMatch.active && runtime.state.wordMatch.game === game),
    promptText: () => translate("match.prompt"),
    onSuccess: (id) => recordResult(ctx, id, true, mode),
    onMismatch: (leftId, rightId) => {
      recordResult(ctx, leftId, false, mode);
      recordResult(ctx, rightId, false, mode);
    },
    onAllMatched: () => wordMatch.finishWordMatch(),
    getCardSpeechPayload: (card) => app.speech?.buildSpeechPayload?.({
      plain: card.hebrewPlain,
      niqqud: isLesson ? card.hebrewNiqqud : undefined,
      source: "answer",
    }) || null,
  };
};

function pickPairs(game) {
  const runtime = getRuntime();
  const data = getData();
  const constants = runtime.constants || {};
  const maxLen = constants.MATCH_MAX_LEN || 40;
  const target = constants.WORD_MATCH_SESSION_SIZE || 20;

  if (game === "lessonMatch") {
    const pool = (data.getSelectedPool?.() || []).filter((word) => word && word.he);
    const sized = pool.filter((word) => sanitizeEnglishText(word.en).length <= maxLen && String(word.he).length <= maxLen);
    const usable = sized.length >= 8 ? sized : pool;
    const count = Math.min(target, usable.length);
    const used = [];
    const picked = [];
    let guard = 0;
    while (picked.length < count && guard < count * 5 + 5) {
      guard += 1;
      const word = data.pickBestWord?.(usable, used, { mode: "translationQuiz" });
      if (!word || used.includes(word.id)) break;
      used.push(word.id);
      picked.push(word);
    }
    return picked.map((word) => ({
      id: word.id,
      englishText: sanitizeEnglishText(word.en),
      valuePlain: word.he,
      valueNiqqud: word.heNiqqud || word.he,
    }));
  }

  const pool = runtime.abbreviationDeck || [];
  const sized = pool.filter((entry) => wordMatch.shortGloss(entry.english).length <= maxLen && String(entry.abbr).length <= maxLen);
  const usable = sized.length >= 8 ? sized : pool;
  const count = Math.min(target, usable.length);
  const used = [];
  const picked = [];
  let guard = 0;
  while (picked.length < count && guard < count * 5 + 5) {
    guard += 1;
    const entry = app.abbreviation?.pickBestAbbreviationEntry?.(usable, used);
    if (!entry || used.includes(entry.id)) break;
    used.push(entry.id);
    picked.push(entry);
  }
  return picked.map((entry) => ({
    id: entry.id,
    englishText: wordMatch.shortGloss(entry.english),
    valuePlain: entry.abbr,
    valueNiqqud: entry.abbr,
  }));
}

function resetCompetingSessions() {
  const runtime = getRuntime();
  const h = getHelpers();
  const s = getSession();
  app.speech?.cancel?.();
  s.stopVerbMatchTimer?.();
  s.stopLessonTimer?.();
  s.stopAbbreviationTimer?.();
  s.stopSentenceBankTimer?.();
  s.stopWordMatchTimer?.();
  s.closeLeaveSessionConfirm?.();
  h.closeMasteredModal?.();
  s.clearLessonStartIntro?.();
  s.clearSecondChanceIntro?.();
  s.clearVerbMatchIntro?.();
  s.clearAbbreviationIntro?.();
  s.clearSentenceBankIntro?.();
  s.clearWordMatchIntro?.();
  s.clearBinyanBoardIntro?.();
  s.clearHandwritingIntro?.();
  app.handwriting?.resetHandwritingState?.();
  s.clearSummaryState?.();
  runtime.state.lesson.active = false;
  runtime.state.lesson.inReview = false;
  runtime.state.sentenceBank.active = false;
  runtime.state.currentQuestion = null;
  h.resetSessionScore?.();
  h.resetVerbMatchState?.();
  h.resetAbbreviationState?.();
  h.resetSentenceBankState?.();
}

function startGame(game) {
  const runtime = getRuntime();
  const h = getHelpers();

  resetCompetingSessions();
  wordMatch.resetWordMatchState();

  runtime.state.mode = game;
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = game;
  h.setGamePickerVisibility?.(false);
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.clearFeedback?.();

  const pairs = pickPairs(game);
  if (!pairs.length) {
    runtime.state.wordMatch.active = false;
    runtime.state.wordMatch.game = game;
    wordMatch.renderIdleState();
    return;
  }

  const ctx = runtime.state.wordMatch;
  ctx.active = true;
  ctx.introActive = false;
  ctx.game = game;
  ctx.sessionMistakeIds = [];
  ctx.startMs = 0;
  ctx.elapsedSeconds = 0;

  const config = wordMatch.buildConfig(game);
  config.pairs = pairs;
  app.matchEngine?.setup?.(config);
  wordMatch.playWordMatchIntro();
  h.renderAll?.();
}

wordMatch.playWordMatchIntro = wordMatch.playWordMatchIntro || function playWordMatchIntro() {
  const runtime = getRuntime();
  const session = getSession();
  const h = getHelpers();
  const overlay = runtime.state.wordMatch.game === "abbrMatch"
    ? runtime.el.abbreviationIntro
    : runtime.el.lessonStartIntro;
  if (!overlay) {
    wordMatch.beginWordMatchFromIntro();
    return;
  }

  session.clearWordMatchIntro?.();
  runtime.state.wordMatch.introActive = true;
  h.showBlockingOverlay?.(overlay);
  session.scheduleIntroAutoAdvance?.(() => wordMatch.beginWordMatchFromIntro());
};

wordMatch.beginWordMatchFromIntro = wordMatch.beginWordMatchFromIntro || function beginWordMatchFromIntro() {
  const runtime = getRuntime();
  const session = getSession();
  if (!runtime.state.wordMatch.active) return;
  if (runtime.state.wordMatch.introActive) {
    session.clearWordMatchIntro?.();
  }
  if (!runtime.state.wordMatch.startMs) {
    runtime.state.wordMatch.startMs = Date.now();
    runtime.state.wordMatch.elapsedSeconds = 0;
    session.startWordMatchTimer?.();
  }
  getHelpers().renderAll?.();
};

wordMatch.startLessonMatch = wordMatch.startLessonMatch || function startLessonMatch() {
  startGame("lessonMatch");
};

wordMatch.startAbbrMatch = wordMatch.startAbbrMatch || function startAbbrMatch() {
  startGame("abbrMatch");
};

wordMatch.renderActiveRound = wordMatch.renderActiveRound || function renderActiveRound() {
  const game = getRuntime().state?.wordMatch?.game;
  if (!game) {
    wordMatch.renderIdleState();
    return;
  }
  app.matchEngine?.renderRound?.(wordMatch.buildConfig(game));
};

wordMatch.renderIdleState = wordMatch.renderIdleState || function renderIdleState() {
  const runtime = getRuntime();
  const h = getHelpers();
  const game = runtime.state.wordMatch.game || runtime.state.mode;
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptText.classList.remove("hebrew");
  runtime.el.promptText.classList.add("english-prompt");
  runtime.el.promptText.textContent = game === "abbrMatch"
    ? translate("prompt.abbreviationStart")
    : translate("prompt.start");
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

function buildMistakes(game, ids) {
  const runtime = getRuntime();
  const data = getData();
  const h = getHelpers();
  if (game === "lessonMatch") {
    const lookup = new Map((data.getAllVocabulary?.() || []).map((word) => [word.id, word]));
    return ids
      .map((id) => lookup.get(id))
      .filter(Boolean)
      .map((word) => ({ primary: h.getHebrewText?.(word, true) || word.he, secondary: word.en }));
  }
  const lookup = new Map((runtime.abbreviationDeck || []).map((entry) => [entry.id, entry]));
  return ids
    .map((id) => lookup.get(id))
    .filter(Boolean)
    .map((entry) => ({
      primary: entry.abbr,
      secondary: `${entry.english} | ${app.abbreviation?.getExpansionText?.(entry, runtime.state.showNiqqudInline) || entry.expansionHe}`,
    }));
}

wordMatch.finishWordMatch = wordMatch.finishWordMatch || function finishWordMatch() {
  const runtime = getRuntime();
  const ctx = runtime.state.wordMatch;
  const game = ctx.game;
  const matched = ctx.matchedCount;
  const total = ctx.totalPairs || matched;
  const bestCombo = ctx.bestCombo;
  const mismatchCount = ctx.mismatchCount;
  const elapsed = ctx.elapsedSeconds;
  const mistakeIds = ctx.sessionMistakeIds.slice();
  const mistakeSet = new Set(mistakeIds);
  const correctIds = (ctx.matchedPairIds || []).filter((id) => !mistakeSet.has(id));
  const mistakes = buildMistakes(game, mistakeIds);
  const corrects = buildMistakes(game, correctIds);

  getSession().stopWordMatchTimer?.();
  ctx.active = false;
  wordMatch.resetWordMatchState();

  getSession().showSessionSummary?.({
    game,
    titleKey: game === "abbrMatch" ? "summary.abbreviationTitle" : "summary.lessonTitle",
    scoreKey: "summary.score",
    scoreVars: { score: matched, total },
    noteKey: "summary.wordMatchNote",
    noteVars: { matched, combo: bestCombo, seconds: elapsed },
    correctCount: matched,
    incorrectCount: mismatchCount,
    elapsedSeconds: elapsed,
    mistakes,
    corrects,
  });
};
})(typeof window !== "undefined" ? window : globalThis);

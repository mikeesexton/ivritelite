(function initIvriQuestAppSession(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const session = app.session = app.session || {};

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function sanitizeRestoreTokenList(tokens) {
  return Array.isArray(tokens)
    ? tokens.map((token) => String(token || "").trim())
    : [];
}

function tokenListsMatch(left, right) {
  const leftTokens = sanitizeRestoreTokenList(left);
  const rightTokens = sanitizeRestoreTokenList(right);
  if (leftTokens.length !== rightTokens.length) return false;
  return leftTokens.every((token, index) => token === rightTokens[index]);
}

function sanitizeRestoreAlternateList(alternates) {
  return Array.isArray(alternates)
    ? alternates.map((variant) => ({
        text: String(variant?.text || "").trim(),
        tokens: sanitizeRestoreTokenList(variant?.tokens),
      }))
    : [];
}

function serializeSentenceForRestoreCheck(sentence) {
  return JSON.stringify({
    english: String(sentence?.english || "").trim(),
    hebrew: String(sentence?.hebrew || "").trim(),
    englishTokens: sanitizeRestoreTokenList(sentence?.englishTokens),
    hebrewTokens: sanitizeRestoreTokenList(sentence?.hebrewTokens),
    englishAlternates: sanitizeRestoreAlternateList(sentence?.englishAlternates),
    hebrewAlternates: sanitizeRestoreAlternateList(sentence?.hebrewAlternates),
    englishDistractors: sanitizeRestoreTokenList(sentence?.englishDistractors),
    hebrewDistractors: sanitizeRestoreTokenList(sentence?.hebrewDistractors),
    difficulty: Number(sentence?.difficulty || 0),
  });
}

function buildLiveSentenceBankQuestionState(question) {
  const runtime = getRuntime();
  const sentenceId = String(question?.sentence?.id || "").trim();
  const direction = question?.direction === "en2he" || question?.direction === "he2en"
    ? question.direction
    : "";
  if (!sentenceId || !direction) return null;

  const sentence = (runtime.sentenceBankDeck || []).find((entry) => entry.id === sentenceId);
  if (!sentence) return null;

  return {
    direction,
    sentence,
    prompt: direction === "en2he" ? sentence.english : sentence.hebrew,
    targetTokens: direction === "en2he" ? sentence.hebrewTokens : sentence.englishTokens,
  };
}

function isStaleRestoredSentenceBankQuestion(question) {
  if (!question) return false;

  const liveState = buildLiveSentenceBankQuestionState(question);
  if (!liveState) return true;

  return (
    String(question?.prompt || "").trim() !== String(liveState.prompt || "").trim()
    || !tokenListsMatch(question?.targetTokens, liveState.targetTokens)
    || serializeSentenceForRestoreCheck(question?.sentence)
      !== serializeSentenceForRestoreCheck(liveState.sentence)
  );
}

function invalidateRestoredSentenceBankState() {
  const runtime = getRuntime();
  const h = getHelpers();

  h.resetSentenceBankState?.();
  if (runtime.state.mode === "sentenceBank") {
    runtime.state.mode = "lesson";
  }
  runtime.state.route = "home";
}

session.hasActiveLearnSession = session.hasActiveLearnSession || function hasActiveLearnSession() {
  const runtime = getRuntime();
  return Boolean(
    runtime.state?.lesson?.active ||
      runtime.state?.lesson?.lessonStartIntroActive ||
      runtime.state?.lesson?.secondChanceIntroActive ||
      runtime.state?.sentenceBank?.active ||
      runtime.state?.sentenceBank?.introActive ||
      runtime.state?.abbreviation?.active ||
      runtime.state?.abbreviation?.introActive ||
      runtime.state?.advConj?.active ||
      runtime.state?.advConj?.introActive ||
      runtime.state?.prepositions?.active ||
      runtime.state?.prepositions?.introActive ||
      runtime.state?.binyanBoard?.active ||
      runtime.state?.binyanBoard?.introActive ||
      runtime.state?.match?.active ||
      runtime.state?.match?.verbIntroActive ||
      runtime.state?.wordMatch?.active ||
      runtime.state?.wordMatch?.introActive
  );
};

session.isModeSessionActive = session.isModeSessionActive || function isModeSessionActive(mode) {
  const runtime = getRuntime();
  if (mode === "verbMatch") {
    const matchActive = Boolean(runtime.state?.match?.active || runtime.state?.match?.verbIntroActive);
    return matchActive && (runtime.state?.match?.layoutMode || "classic") === "classic";
  }
  if (mode === "abbreviation") {
    return Boolean(runtime.state?.abbreviation?.active || runtime.state?.abbreviation?.introActive);
  }
  if (mode === "lessonMatch" || mode === "abbrMatch") {
    return Boolean(
      (runtime.state?.wordMatch?.active || runtime.state?.wordMatch?.introActive) &&
      runtime.state?.wordMatch?.game === mode
    );
  }
  if (mode === "sentenceBank") {
    return Boolean(runtime.state?.sentenceBank?.active || runtime.state?.sentenceBank?.introActive);
  }
  if (mode === "advConj") {
    return Boolean(runtime.state?.advConj?.active || runtime.state?.advConj?.introActive);
  }
  if (mode === "prepositions") {
    return Boolean(runtime.state?.prepositions?.active || runtime.state?.prepositions?.introActive);
  }
  if (mode === "binyanBoard") {
    return Boolean(runtime.state?.binyanBoard?.active || runtime.state?.binyanBoard?.introActive);
  }
  return Boolean(
    runtime.state?.lesson?.active ||
      runtime.state?.lesson?.lessonStartIntroActive ||
      runtime.state?.lesson?.secondChanceIntroActive
  );
};

session.resolveInitialRoute = session.resolveInitialRoute || function resolveInitialRoute(candidate, options = {}) {
  const runtime = getRuntime();
  const valid = new Set(["home", "review", "settings", "results"]);
  if (runtime.state?.summary?.active) {
    return valid.has(candidate) ? candidate : "results";
  }
  if (session.hasActiveLearnSession()) {
    return "home";
  }
  return valid.has(candidate) && candidate !== "results" ? candidate : "home";
};

session.restoreSessionState = session.restoreSessionState || function restoreSessionState(snapshot) {
  const runtime = getRuntime();
  const h = getHelpers();
  if (!snapshot || typeof snapshot !== "object") return;

  if (snapshot.mode === "verbBubble" || snapshot.match?.layoutMode === "bubble" || snapshot.summary?.game === "verbBubble") {
    app.persistence?.clearPersistedSession?.();
    return;
  }

  runtime.state.mode = typeof snapshot.mode === "string" ? snapshot.mode : runtime.state.mode;
  runtime.state.route = typeof snapshot.route === "string" ? snapshot.route : runtime.state.route;
  runtime.state.lastPlayedMode = typeof snapshot.lastPlayedMode === "string" ? snapshot.lastPlayedMode : runtime.state.lastPlayedMode;
  runtime.state.sessionScore = Math.max(0, Number(snapshot.sessionScore || 0));
  runtime.state.sessionStreak = Math.max(0, Number(snapshot.sessionStreak || 0));
  runtime.state.showNiqqudInline = Boolean(snapshot.showNiqqudInline);

  if (snapshot.currentQuestion) {
    runtime.state.currentQuestion = h.cloneLessonQuestionSnapshot?.(snapshot.currentQuestion) || snapshot.currentQuestion;
    runtime.state.currentQuestion.locked = Boolean(snapshot.currentQuestion.locked);
  }

  if (snapshot.summary) {
    Object.assign(runtime.state.summary, {
      active: Boolean(snapshot.summary.active),
      game: String(snapshot.summary.game || ""),
      titleKey: String(snapshot.summary.titleKey || ""),
      titleVars: snapshot.summary.titleVars || {},
      scoreKey: String(snapshot.summary.scoreKey || ""),
      scoreVars: snapshot.summary.scoreVars || {},
      noteKey: String(snapshot.summary.noteKey || ""),
      noteVars: snapshot.summary.noteVars || {},
      correctCount: Math.max(0, Number(snapshot.summary.correctCount || 0)),
      incorrectCount: Math.max(0, Number(snapshot.summary.incorrectCount || 0)),
      elapsedSeconds: Math.max(0, Number(snapshot.summary.elapsedSeconds || 0)),
      mistakes: Array.isArray(snapshot.summary.mistakes) ? snapshot.summary.mistakes : [],
    });
  }

  if (snapshot.lesson) {
    Object.assign(runtime.state.lesson, {
      active: Boolean(snapshot.lesson.active),
      currentRound: Math.max(0, Number(snapshot.lesson.currentRound || 0)),
      secondChanceCurrent: Math.max(0, Number(snapshot.lesson.secondChanceCurrent || 0)),
      secondChanceTotal: Math.max(0, Number(snapshot.lesson.secondChanceTotal || 0)),
      startMs: Math.max(0, Number(snapshot.lesson.startMs || 0)),
      elapsedSeconds: Math.max(0, Number(snapshot.lesson.elapsedSeconds || 0)),
      askedWordIds: Array.isArray(snapshot.lesson.askedWordIds) ? snapshot.lesson.askedWordIds : [],
      domainCounts: snapshot.lesson.domainCounts || {},
      missedWordIds: Array.isArray(snapshot.lesson.missedWordIds) ? snapshot.lesson.missedWordIds : [],
      reviewQueue: Array.isArray(snapshot.lesson.reviewQueue) ? snapshot.lesson.reviewQueue : [],
      inReview: Boolean(snapshot.lesson.inReview),
      lessonStartIntroActive: Boolean(snapshot.lesson.lessonStartIntroActive),
      secondChanceIntroActive: Boolean(snapshot.lesson.secondChanceIntroActive),
      optionHistory: snapshot.lesson.optionHistory || {},
      wrongAnswers: Math.max(0, Number(snapshot.lesson.wrongAnswers || 0)),
      sessionMistakeIds: Array.isArray(snapshot.lesson.sessionMistakeIds) ? snapshot.lesson.sessionMistakeIds : [],
      timerId: null,
    });
  }

  if (snapshot.sentenceBank) {
    Object.assign(runtime.state.sentenceBank, {
      active: Boolean(snapshot.sentenceBank.active),
      introActive: Boolean(snapshot.sentenceBank.introActive),
      inReview: Boolean(snapshot.sentenceBank.inReview),
      currentRound: Math.max(0, Number(snapshot.sentenceBank.currentRound || 0)),
      secondChanceCurrent: Math.max(0, Number(snapshot.sentenceBank.secondChanceCurrent || 0)),
      secondChanceTotal: Math.max(0, Number(snapshot.sentenceBank.secondChanceTotal || 0)),
      startMs: Math.max(0, Number(snapshot.sentenceBank.startMs || 0)),
      elapsedSeconds: Math.max(0, Number(snapshot.sentenceBank.elapsedSeconds || 0)),
      askedSentenceIds: Array.isArray(snapshot.sentenceBank.askedSentenceIds) ? snapshot.sentenceBank.askedSentenceIds : [],
      reviewQueue: Array.isArray(snapshot.sentenceBank.reviewQueue) ? snapshot.sentenceBank.reviewQueue : [],
      currentQuestion: snapshot.sentenceBank.currentQuestion
        ? h.cloneSentenceBankQuestionSnapshot?.(snapshot.sentenceBank.currentQuestion) || snapshot.sentenceBank.currentQuestion
        : null,
      wrongAnswers: Math.max(0, Number(snapshot.sentenceBank.wrongAnswers || 0)),
      sessionMistakeKeys: Array.isArray(snapshot.sentenceBank.sessionMistakeKeys) ? snapshot.sentenceBank.sessionMistakeKeys : [],
      availableScore: Math.max(0, Number(snapshot.sentenceBank.availableScore || 0)),
      timerId: null,
    });
    if (runtime.state.sentenceBank.currentQuestion) {
      runtime.state.sentenceBank.currentQuestion.locked = Boolean(snapshot.sentenceBank.currentQuestion?.locked);
      if (isStaleRestoredSentenceBankQuestion(runtime.state.sentenceBank.currentQuestion)) {
        invalidateRestoredSentenceBankState();
      }
    }
  }

  if (snapshot.abbreviation) {
    Object.assign(runtime.state.abbreviation, {
      active: Boolean(snapshot.abbreviation.active),
      currentRound: Math.max(0, Number(snapshot.abbreviation.currentRound || 0)),
      startMs: Math.max(0, Number(snapshot.abbreviation.startMs || 0)),
      elapsedSeconds: Math.max(0, Number(snapshot.abbreviation.elapsedSeconds || 0)),
      askedEntryIds: Array.isArray(snapshot.abbreviation.askedEntryIds) ? snapshot.abbreviation.askedEntryIds : [],
      introActive: Boolean(snapshot.abbreviation.introActive),
      currentQuestion: snapshot.abbreviation.currentQuestion
        ? h.cloneAbbreviationQuestionSnapshot?.(snapshot.abbreviation.currentQuestion) || snapshot.abbreviation.currentQuestion
        : null,
      wrongAnswers: Math.max(0, Number(snapshot.abbreviation.wrongAnswers || 0)),
      sessionMistakeIds: Array.isArray(snapshot.abbreviation.sessionMistakeIds) ? snapshot.abbreviation.sessionMistakeIds : [],
      timerId: null,
    });
    if (runtime.state.abbreviation.currentQuestion) {
      runtime.state.abbreviation.currentQuestion.locked = Boolean(snapshot.abbreviation.currentQuestion?.locked);
    }
  }

  if (snapshot.match) {
    Object.assign(runtime.state.match, {
      active: Boolean(snapshot.match.active),
      verbQueue: Array.isArray(snapshot.match.verbQueue) ? snapshot.match.verbQueue : [],
      totalVerbs: Math.max(0, Number(snapshot.match.totalVerbs || 0)),
      currentVerbIndex: Math.max(0, Number(snapshot.match.currentVerbIndex || 0)),
      currentVerb: snapshot.match.currentVerb || null,
      pairs: Array.isArray(snapshot.match.pairs) ? snapshot.match.pairs : [],
      remainingPairs: Array.isArray(snapshot.match.remainingPairs) ? snapshot.match.remainingPairs : [],
      leftCards: Array.isArray(snapshot.match.leftCards) ? snapshot.match.leftCards : [],
      rightCards: Array.isArray(snapshot.match.rightCards) ? snapshot.match.rightCards : [],
      layoutMode: "classic",
      selectedLeftId: snapshot.match.selectedLeftId || null,
      selectedRightId: snapshot.match.selectedRightId || null,
      mismatchedCardIds: Array.isArray(snapshot.match.mismatchedCardIds) ? snapshot.match.mismatchedCardIds : [],
      matchedCardIds: Array.isArray(snapshot.match.matchedCardIds) ? snapshot.match.matchedCardIds : [],
      matchedPairIds: Array.isArray(snapshot.match.matchedPairIds) ? snapshot.match.matchedPairIds : [],
      isResolving: Boolean(snapshot.match.isResolving),
      nextCardId: Math.max(1, Number(snapshot.match.nextCardId || 1)),
      combo: Math.max(0, Number(snapshot.match.combo || 0)),
      bestCombo: Math.max(0, Number(snapshot.match.bestCombo || 0)),
      matchedCount: Math.max(0, Number(snapshot.match.matchedCount || 0)),
      totalPairs: Math.max(0, Number(snapshot.match.totalPairs || 0)),
      startMs: Math.max(0, Number(snapshot.match.startMs || 0)),
      elapsedSeconds: Math.max(0, Number(snapshot.match.elapsedSeconds || 0)),
      verbIntroActive: Boolean(snapshot.match.verbIntroActive),
      sessionMatched: Math.max(0, Number(snapshot.match.sessionMatched || 0)),
      sessionTotalPairs: Math.max(0, Number(snapshot.match.sessionTotalPairs || 0)),
      currentVerbHadMismatch: Boolean(snapshot.match.currentVerbHadMismatch),
      eligibleMasterWordId: String(snapshot.match.eligibleMasterWordId || ""),
      mismatchCount: Math.max(0, Number(snapshot.match.mismatchCount || 0)),
      sessionMistakeIds: Array.isArray(snapshot.match.sessionMistakeIds) ? snapshot.match.sessionMistakeIds : [],
      sessionMistakeForms: Array.isArray(snapshot.match.sessionMistakeForms) ? snapshot.match.sessionMistakeForms : [],
      timerId: null,
    });
  }

  if (runtime.state.mode === "binyanBoard" && !runtime.state.binyanBoard?.active) {
    runtime.state.mode = "home";
  }

  if ((runtime.state.mode === "lessonMatch" || runtime.state.mode === "abbrMatch") && !runtime.state.wordMatch?.active && !runtime.state.wordMatch?.introActive) {
    runtime.state.mode = "home";
  }

  runtime.state.route = session.resolveInitialRoute(runtime.state.route);
};

session.navigateTo = session.navigateTo || function navigateTo(route) {
  const runtime = getRuntime();
  runtime.state.route = session.resolveInitialRoute(route);
  getHelpers().renderAll?.();
};

session.restorePendingOverlays = session.restorePendingOverlays || function restorePendingOverlays() {
  const runtime = getRuntime();
  const h = getHelpers();
  if (runtime.state?.lesson?.secondChanceIntroActive) {
    h.playSecondChanceIntro?.();
  } else if (runtime.state?.lesson?.lessonStartIntroActive) {
    h.playLessonStartIntro?.();
  } else if (runtime.state?.sentenceBank?.introActive) {
    h.playSentenceBankIntro?.();
  } else if (runtime.state?.abbreviation?.introActive) {
    h.playAbbreviationIntro?.();
  } else if (runtime.state?.match?.verbIntroActive) {
    h.playVerbMatchIntro?.();
  } else if (runtime.state?.wordMatch?.introActive) {
    app.wordMatch?.playWordMatchIntro?.();
  } else if (runtime.state?.binyanBoard?.introActive) {
    app.binyanBoard?.playBinyanBoardIntro?.();
  }
};

session.resumeActiveTimers = session.resumeActiveTimers || function resumeActiveTimers() {
  const runtime = getRuntime();
  const h = getHelpers();

  session.restorePendingOverlays();

  if (runtime.state?.lesson?.active && runtime.state.lesson.startMs && !runtime.state.lesson.lessonStartIntroActive && !runtime.state.lesson.secondChanceIntroActive) {
    runtime.state.lesson.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.lesson.startMs) / 1000));
    session.startLessonTimer();
  }
  if (runtime.state?.sentenceBank?.active && runtime.state.sentenceBank.startMs && !runtime.state.sentenceBank.introActive) {
    runtime.state.sentenceBank.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.sentenceBank.startMs) / 1000));
    session.startSentenceBankTimer();
  }
  if (runtime.state?.abbreviation?.active && runtime.state.abbreviation.startMs && !runtime.state.abbreviation.introActive) {
    runtime.state.abbreviation.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.abbreviation.startMs) / 1000));
    session.startAbbreviationTimer();
  }
  if (runtime.state?.match?.active && runtime.state.match.startMs && !runtime.state.match.verbIntroActive) {
    runtime.state.match.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.match.startMs) / 1000));
    session.startVerbMatchTimer();
  }
  if (runtime.state?.wordMatch?.active && runtime.state.wordMatch.startMs && !runtime.state.wordMatch.introActive) {
    runtime.state.wordMatch.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.wordMatch.startMs) / 1000));
    session.startWordMatchTimer();
  }
  if (runtime.state?.binyanBoard?.active && runtime.state.binyanBoard.startMs && !runtime.state.binyanBoard.introActive) {
    runtime.state.binyanBoard.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.binyanBoard.startMs) / 1000));
    app.binyanBoard?.startBinyanBoardTimer?.();
  }

  h.updateUiLockState?.();
};

session.clearIntroAutoAdvance = session.clearIntroAutoAdvance || function clearIntroAutoAdvance() {
  const runtime = getRuntime();
  if (!runtime.introAutoAdvanceTimerId) return;
  runtime.global.clearTimeout(runtime.introAutoAdvanceTimerId);
  runtime.introAutoAdvanceTimerId = null;
};

session.scheduleIntroAutoAdvance = session.scheduleIntroAutoAdvance || function scheduleIntroAutoAdvance(action) {
  const runtime = getRuntime();
  session.clearIntroAutoAdvance();
  if (typeof action !== "function") return;

  runtime.introAutoAdvanceTimerId = runtime.global.setTimeout(() => {
    runtime.introAutoAdvanceTimerId = null;
    action();
  }, runtime.introAutoAdvanceMs);
};

session.clearSummaryState = session.clearSummaryState || function clearSummaryState() {
  const runtime = getRuntime();
  runtime.state.summary.active = false;
  runtime.state.summary.game = "";
  runtime.state.summary.titleKey = "";
  runtime.state.summary.titleVars = {};
  runtime.state.summary.scoreKey = "";
  runtime.state.summary.scoreVars = {};
  runtime.state.summary.noteKey = "";
  runtime.state.summary.noteVars = {};
  runtime.state.summary.correctCount = 0;
  runtime.state.summary.incorrectCount = 0;
  runtime.state.summary.elapsedSeconds = 0;
  runtime.state.summary.mistakes = [];
  runtime.state.summary.corrects = [];
};

session.openLeaveSessionConfirm = session.openLeaveSessionConfirm || function openLeaveSessionConfirm(targetRoute = "home") {
  const runtime = getRuntime();
  runtime.state.pendingLeaveRoute = targetRoute;
  runtime.state.leaveConfirmOpen = true;
  getHelpers().showBlockingOverlay?.(runtime.el.leaveSessionConfirm);
};

session.closeLeaveSessionConfirm = session.closeLeaveSessionConfirm || function closeLeaveSessionConfirm(options = {}) {
  const runtime = getRuntime();
  runtime.state.leaveConfirmOpen = false;
  if (!options.preservePending) {
    runtime.state.pendingLeaveRoute = "home";
  }
  getHelpers().hideBlockingOverlay?.(runtime.el.leaveSessionConfirm);
};

session.confirmLeaveSession = session.confirmLeaveSession || function confirmLeaveSession() {
  const runtime = getRuntime();
  const targetRoute = runtime.state.pendingLeaveRoute || "home";
  session.closeLeaveSessionConfirm({ preservePending: true });
  session.endSessionAndNavigate(targetRoute);
  runtime.state.pendingLeaveRoute = "home";
};

session.requestLeaveSession = session.requestLeaveSession || function requestLeaveSession(targetRoute = "home") {
  if (!session.hasActiveLearnSession()) {
    session.endSessionAndNavigate(targetRoute);
    return;
  }
  session.openLeaveSessionConfirm(targetRoute);
};

session.requestGoHome = session.requestGoHome || function requestGoHome() {
  session.requestLeaveSession("home");
};

session.endSessionAndNavigate = session.endSessionAndNavigate || function endSessionAndNavigate(targetRoute = "home") {
  const runtime = getRuntime();
  const h = getHelpers();

  session.stopVerbMatchTimer();
  session.stopLessonTimer();
  session.stopSentenceBankTimer();
  session.stopAbbreviationTimer();
  session.stopWordMatchTimer();
  session.closeLeaveSessionConfirm();
  h.closeMasteredModal?.();
  session.clearLessonStartIntro();
  session.clearSecondChanceIntro();
  session.clearSentenceBankIntro?.();
  session.clearVerbMatchIntro();
  session.clearAbbreviationIntro();
  session.clearWordMatchIntro?.();
  session.clearAdvConjIntro();
  session.clearPrepositionsIntro?.();
  session.clearBinyanBoardIntro?.();
  h.resetSessionCounters?.();
  h.resetSentenceBankState?.();
  h.resetVerbMatchState?.();
  h.resetAbbreviationState?.();
  app.wordMatch?.resetWordMatchState?.();
  session.resetAdvConjState();
  session.resetPrepositionsState?.();
  app.binyanBoard?.resetBinyanBoardState?.();
  runtime.state.lesson.active = false;
  runtime.state.lesson.inReview = false;
  runtime.state.sentenceBank.active = false;
  runtime.state.sentenceBank.inReview = false;
  runtime.state.sentenceBank.currentQuestion = null;
  runtime.state.currentQuestion = null;
  session.clearSummaryState();
  runtime.state.mode = "home";
  runtime.state.route = targetRoute === "review" || targetRoute === "settings" ? targetRoute : "home";
  h.clearFeedback?.();
  app.persistence?.clearPersistedSession?.();
  h.renderAll?.();
};

session.goHome = session.goHome || function goHome() {
  session.endSessionAndNavigate("home");
};

session.showSessionSummary = session.showSessionSummary || function showSessionSummary(config = {}) {
  const runtime = getRuntime();
  const h = getHelpers();

  session.stopVerbMatchTimer();
  session.stopLessonTimer();
  session.stopSentenceBankTimer();
  session.stopAbbreviationTimer();
  session.stopWordMatchTimer();
  session.closeLeaveSessionConfirm();
  session.clearLessonStartIntro();
  session.clearSecondChanceIntro();
  session.clearSentenceBankIntro?.();
  session.clearVerbMatchIntro();
  session.clearAbbreviationIntro();
  session.clearWordMatchIntro?.();
  session.clearAdvConjIntro();
  session.clearPrepositionsIntro?.();
  session.clearBinyanBoardIntro?.();
  runtime.state.lesson.active = false;
  runtime.state.lesson.inReview = false;
  runtime.state.currentQuestion = null;
  runtime.state.sentenceBank.active = false;
  runtime.state.sentenceBank.inReview = false;
  runtime.state.sentenceBank.currentQuestion = null;
  runtime.state.match.active = false;
  runtime.state.wordMatch.active = false;
  runtime.state.abbreviation.active = false;
  runtime.state.abbreviation.currentQuestion = null;
  runtime.state.advConj.active = false;
  runtime.state.advConj.currentQuestion = null;
  runtime.state.prepositions.active = false;
  runtime.state.prepositions.currentQuestion = null;
  app.binyanBoard?.stopBinyanBoardTimer?.();
  runtime.state.binyanBoard.active = false;
  runtime.state.binyanBoard.currentQuestion = null;
  runtime.state.mode = "summary";
  runtime.state.summary.active = true;
  runtime.state.summary.game = String(config.game || "");
  runtime.state.summary.titleKey = String(config.titleKey || "");
  runtime.state.summary.titleVars = config.titleVars || {};
  runtime.state.summary.scoreKey = String(config.scoreKey || "");
  runtime.state.summary.scoreVars = config.scoreVars || {};
  runtime.state.summary.noteKey = String(config.noteKey || "");
  runtime.state.summary.noteVars = config.noteVars || {};
  runtime.state.summary.correctCount = Math.max(0, Number(config.correctCount || 0));
  runtime.state.summary.incorrectCount = Math.max(0, Number(config.incorrectCount || 0));
  runtime.state.summary.elapsedSeconds = Math.max(0, Number(config.elapsedSeconds || 0));
  runtime.state.summary.mistakes = Array.isArray(config.mistakes) ? config.mistakes : [];
  runtime.state.summary.corrects = Array.isArray(config.corrects) ? config.corrects : [];
  runtime.state.route = "results";
  h.clearFeedback?.();
  h.renderAll?.();
};

session.finishLesson = session.finishLesson || function finishLesson() {
  const runtime = getRuntime();
  const h = getHelpers();
  const lessonRounds = runtime.constants.LESSON_ROUNDS || 0;

  session.stopLessonTimer();
  session.clearLessonStartIntro();
  session.clearSecondChanceIntro();
  session.clearVerbMatchIntro();
  runtime.state.lesson.active = false;
  runtime.state.currentQuestion = null;
  const reviewRounds = runtime.state.lesson.secondChanceTotal;
  runtime.state.lesson.inReview = false;
  runtime.state.lesson.secondChanceCurrent = 0;
  runtime.state.lesson.secondChanceTotal = 0;
  session.showSessionSummary({
    game: "lesson",
    titleKey: "summary.lessonTitle",
    scoreKey: "summary.score",
    scoreVars: {
      score: runtime.state.sessionScore,
      total: lessonRounds,
    },
    noteKey: reviewRounds > 0 ? "summary.lessonNote" : "summary.lessonNoteNone",
    noteVars: reviewRounds > 0 ? { count: reviewRounds } : {},
    correctCount: Math.max(0, lessonRounds + reviewRounds - runtime.state.lesson.wrongAnswers),
    incorrectCount: runtime.state.lesson.wrongAnswers,
    elapsedSeconds: runtime.state.lesson.elapsedSeconds,
    mistakes: h.buildLessonMistakeSummary?.() || [],
  });
};

session.finishSentenceBank = session.finishSentenceBank || function finishSentenceBank() {
  const runtime = getRuntime();
  const h = getHelpers();

  session.stopSentenceBankTimer();
  session.clearSentenceBankIntro?.();
  runtime.state.sentenceBank.active = false;
  runtime.state.sentenceBank.currentQuestion = null;
  const reviewRounds = runtime.state.sentenceBank.secondChanceTotal;
  runtime.state.sentenceBank.inReview = false;
  runtime.state.sentenceBank.secondChanceCurrent = 0;
  runtime.state.sentenceBank.secondChanceTotal = 0;

  session.showSessionSummary({
    game: "sentenceBank",
    titleKey: "summary.sentenceBankTitle",
    scoreKey: "summary.score",
    scoreVars: {
      score: runtime.state.sessionScore,
      total: runtime.state.sentenceBank.availableScore,
    },
    noteKey: reviewRounds > 0 ? "summary.lessonNote" : "summary.lessonNoteNone",
    noteVars: reviewRounds > 0 ? { count: reviewRounds } : {},
    correctCount: Math.max(
      0,
      runtime.constants.LESSON_ROUNDS + reviewRounds - runtime.state.sentenceBank.wrongAnswers
    ),
    incorrectCount: runtime.state.sentenceBank.wrongAnswers,
    elapsedSeconds: runtime.state.sentenceBank.elapsedSeconds,
    mistakes: h.buildSentenceBankMistakeSummary?.() || [],
  });
};

session.finishAbbreviation = session.finishAbbreviation || function finishAbbreviation() {
  const runtime = getRuntime();
  const h = getHelpers();
  const abbreviationRounds = runtime.constants.ABBREVIATION_ROUNDS || 0;

  session.stopAbbreviationTimer();
  session.clearLessonStartIntro();
  session.clearSecondChanceIntro();
  session.clearVerbMatchIntro();
  session.clearAbbreviationIntro();

  const roundsDone = runtime.state.abbreviation.currentRound;
  const targetRounds = abbreviationRounds;
  const elapsed = runtime.state.abbreviation.elapsedSeconds;

  runtime.state.abbreviation.active = false;
  runtime.state.abbreviation.currentQuestion = null;

  session.showSessionSummary({
    game: "abbreviation",
    titleKey: "summary.abbreviationTitle",
    scoreKey: "summary.score",
    scoreVars: {
      score: runtime.state.sessionScore,
      total: targetRounds,
    },
    noteKey: "summary.abbreviationNote",
    noteVars: {
      rounds: roundsDone || targetRounds,
      seconds: elapsed,
    },
    correctCount: Math.max(0, (roundsDone || targetRounds) - runtime.state.abbreviation.wrongAnswers),
    incorrectCount: runtime.state.abbreviation.wrongAnswers,
    elapsedSeconds: elapsed,
    mistakes: h.buildAbbreviationMistakeSummary?.() || [],
  });
};

session.clearAbbreviationIntro = session.clearAbbreviationIntro || function clearAbbreviationIntro() {
  const runtime = getRuntime();
  runtime.state.abbreviation.introActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(runtime.el.abbreviationIntro);
};

session.clearWordMatchIntro = session.clearWordMatchIntro || function clearWordMatchIntro() {
  const runtime = getRuntime();
  const overlay = runtime.state.wordMatch.game === "abbrMatch"
    ? runtime.el.abbreviationIntro
    : runtime.el.lessonStartIntro;
  runtime.state.wordMatch.introActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(overlay);
};

session.startAbbreviationTimer = session.startAbbreviationTimer || function startAbbreviationTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  session.stopAbbreviationTimer();
  runtime.state.abbreviation.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.abbreviation.active) return;
    runtime.state.abbreviation.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.abbreviation.startMs) / 1000));
    if (runtime.state.mode === "abbreviation") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

session.stopAbbreviationTimer = session.stopAbbreviationTimer || function stopAbbreviationTimer() {
  const runtime = getRuntime();
  if (!runtime.state.abbreviation.timerId) return;
  runtime.global.clearInterval(runtime.state.abbreviation.timerId);
  runtime.state.abbreviation.timerId = null;
};

session.resetAdvConjState = session.resetAdvConjState || function resetAdvConjState() {
  const runtime = getRuntime();
  if (runtime.state.advConj.timerId) {
    runtime.global.clearInterval(runtime.state.advConj.timerId);
  }
  runtime.state.advConj = {
    active: false,
    introActive: false,
    currentRound: 0,
    startMs: 0,
    elapsedSeconds: 0,
    timerId: null,
    questionQueue: [],
    currentQuestion: null,
    wrongAnswers: 0,
    sessionMistakeIds: [],
    sessionMistakes: [],
  };
};

session.clearAdvConjIntro = session.clearAdvConjIntro || function clearAdvConjIntro() {
  const runtime = getRuntime();
  session.clearIntroAutoAdvance();
  if (runtime.el.advConjIntro) {
    runtime.el.advConjIntro.classList.add("hidden");
    runtime.el.advConjIntro.setAttribute("aria-hidden", "true");
  }
  runtime.state.advConj.introActive = false;
};

session.resetPrepositionsState = session.resetPrepositionsState || function resetPrepositionsState() {
  const runtime = getRuntime();
  if (runtime.state.prepositions.timerId) {
    runtime.global.clearInterval(runtime.state.prepositions.timerId);
  }
  runtime.state.prepositions = {
    active: false,
    introActive: false,
    currentRound: 0,
    startMs: 0,
    elapsedSeconds: 0,
    timerId: null,
    questionQueue: [],
    currentQuestion: null,
    wrongAnswers: 0,
    sessionMistakes: [],
  };
};

session.clearPrepositionsIntro = session.clearPrepositionsIntro || function clearPrepositionsIntro() {
  const runtime = getRuntime();
  session.clearIntroAutoAdvance();
  if (runtime.el.prepositionsIntro) {
    runtime.el.prepositionsIntro.classList.add("hidden");
    runtime.el.prepositionsIntro.setAttribute("aria-hidden", "true");
  }
  runtime.state.prepositions.introActive = false;
};

session.finishPrepositions = session.finishPrepositions || function finishPrepositions() {
  const runtime = getRuntime();
  const rounds = runtime.constants.PREPOSITIONS_ROUNDS || 0;

  if (runtime.state.prepositions.timerId) {
    runtime.global.clearInterval(runtime.state.prepositions.timerId);
    runtime.state.prepositions.timerId = null;
  }
  runtime.state.prepositions.active = false;
  const wrong = runtime.state.prepositions.wrongAnswers;
  const correct = rounds - wrong;
  const seconds = runtime.state.prepositions.elapsedSeconds;
  const mistakes = app.prepositions?.buildPrepositionsMistakeSummary?.() || [];
  session.showSessionSummary({
    game: "prepositions",
    titleKey: "summary.prepositionsTitle",
    noteKey: "summary.abbreviationNote",
    correctCount: correct,
    incorrectCount: wrong,
    elapsedSeconds: seconds,
    mistakes,
  });
};

session.clearBinyanBoardIntro = session.clearBinyanBoardIntro || function clearBinyanBoardIntro() {
  const runtime = getRuntime();
  runtime.state.binyanBoard.introActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(runtime.el.binyanBoardIntro);
};

session.finishAdvConj = session.finishAdvConj || function finishAdvConj() {
  const runtime = getRuntime();
  const h = getHelpers();
  const rounds = runtime.constants.ADV_CONJ_ROUNDS || 0;

  if (runtime.state.advConj.timerId) {
    runtime.global.clearInterval(runtime.state.advConj.timerId);
    runtime.state.advConj.timerId = null;
  }
  runtime.state.advConj.active = false;
  const correct = rounds - runtime.state.advConj.wrongAnswers;
  const wrong = runtime.state.advConj.wrongAnswers;
  const seconds = runtime.state.advConj.elapsedSeconds;
  const mistakes = h.buildAdvConjMistakeSummary?.() || [];
  session.showSessionSummary({
    game: "advConj",
    titleKey: "summary.advConjTitle",
    correctCount: correct,
    incorrectCount: wrong,
    elapsedSeconds: seconds,
    mistakes,
  });
};

session.clearLessonStartIntro = session.clearLessonStartIntro || function clearLessonStartIntro() {
  const runtime = getRuntime();
  runtime.state.lesson.lessonStartIntroActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(runtime.el.lessonStartIntro);
};

session.clearSentenceBankIntro = session.clearSentenceBankIntro || function clearSentenceBankIntro() {
  const runtime = getRuntime();
  runtime.state.sentenceBank.introActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(runtime.el.sentenceBankIntro);
};

session.clearSecondChanceIntro = session.clearSecondChanceIntro || function clearSecondChanceIntro() {
  const runtime = getRuntime();
  runtime.state.lesson.secondChanceIntroActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(runtime.el.secondChanceIntro);
};

session.clearVerbMatchIntro = session.clearVerbMatchIntro || function clearVerbMatchIntro() {
  const runtime = getRuntime();
  runtime.state.match.verbIntroActive = false;
  session.clearIntroAutoAdvance();
  getHelpers().hideBlockingOverlay?.(runtime.el.verbMatchIntro);
};

session.startVerbMatchTimer = session.startVerbMatchTimer || function startVerbMatchTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  session.stopVerbMatchTimer();
  runtime.state.match.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.match.active) return;
    runtime.state.match.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.match.startMs) / 1000));
    if (runtime.state.mode === "verbMatch") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

session.stopVerbMatchTimer = session.stopVerbMatchTimer || function stopVerbMatchTimer() {
  const runtime = getRuntime();
  if (!runtime.state.match.timerId) return;
  runtime.global.clearInterval(runtime.state.match.timerId);
  runtime.state.match.timerId = null;
};

session.startWordMatchTimer = session.startWordMatchTimer || function startWordMatchTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  session.stopWordMatchTimer();
  runtime.state.wordMatch.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.wordMatch.active) return;
    runtime.state.wordMatch.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.wordMatch.startMs) / 1000));
    if (runtime.state.mode === "lessonMatch" || runtime.state.mode === "abbrMatch") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

session.stopWordMatchTimer = session.stopWordMatchTimer || function stopWordMatchTimer() {
  const runtime = getRuntime();
  if (!runtime.state.wordMatch.timerId) return;
  runtime.global.clearInterval(runtime.state.wordMatch.timerId);
  runtime.state.wordMatch.timerId = null;
};

session.startSentenceBankTimer = session.startSentenceBankTimer || function startSentenceBankTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  session.stopSentenceBankTimer();
  runtime.state.sentenceBank.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.sentenceBank.active) return;
    runtime.state.sentenceBank.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.sentenceBank.startMs) / 1000));
    if (runtime.state.mode === "sentenceBank") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

session.stopSentenceBankTimer = session.stopSentenceBankTimer || function stopSentenceBankTimer() {
  const runtime = getRuntime();
  if (!runtime.state.sentenceBank.timerId) return;
  runtime.global.clearInterval(runtime.state.sentenceBank.timerId);
  runtime.state.sentenceBank.timerId = null;
};

session.startLessonTimer = session.startLessonTimer || function startLessonTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  session.stopLessonTimer();
  runtime.state.lesson.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.lesson.active) return;
    runtime.state.lesson.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.lesson.startMs) / 1000));
    if (runtime.state.mode === "lesson") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

session.stopLessonTimer = session.stopLessonTimer || function stopLessonTimer() {
  const runtime = getRuntime();
  if (!runtime.state.lesson.timerId) return;
  runtime.global.clearInterval(runtime.state.lesson.timerId);
  runtime.state.lesson.timerId = null;
};
})(typeof window !== "undefined" ? window : globalThis);

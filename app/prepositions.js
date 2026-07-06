(function initIvriQuestAppPrepositions(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const prepositions = app.prepositions = app.prepositions || {};

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function getSession() {
  return app.session || {};
}

function getInflections() {
  return global.PREPOSITION_INFLECTIONS || {};
}

function getObjects() {
  return Array.isArray(global.PREPOSITION_OBJECTS) ? global.PREPOSITION_OBJECTS : [];
}

function getTriggers() {
  return Array.isArray(global.PREPOSITIONS) ? global.PREPOSITIONS : [];
}

function sanitizeEnglishText(text) {
  return app.utils?.sanitizeEnglishDisplayText
    ? app.utils.sanitizeEnglishDisplayText(text)
    : String(text || "").trim();
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

prepositions.getObjectLabel = prepositions.getObjectLabel || function getObjectLabel(objectKey) {
  const entry = getObjects().find((object) => object.key === objectKey);
  return entry ? entry.en : objectKey;
};

prepositions.buildPromptText = prepositions.buildPromptText || function buildPromptText(trigger) {
  return `${trigger.he} ____`;
};

prepositions.buildEnglishHint = prepositions.buildEnglishHint || function buildEnglishHint(trigger, objectKey) {
  return sanitizeEnglishText(String(trigger.en || "").replace(/\{o\}/g, prepositions.getObjectLabel(objectKey)));
};

// Pure option builder: returns four shuffled options (one correct) for a
// trigger inflected to `objectKey`. Distractors test both axes — a wrong
// preposition inflected to the same object, and the right preposition
// inflected to a different object. Reads only from the inflection tables so
// it can be exercised in isolation.
prepositions.buildPrepositionOptions = prepositions.buildPrepositionOptions || function buildPrepositionOptions(prepKey, objectKey, shuffleFn) {
  const inflections = getInflections();
  const objects = getObjects();
  const correctForm = inflections[prepKey]?.[objectKey];
  if (!correctForm) return null;

  const shuffle = typeof shuffleFn === "function" ? shuffleFn : (list) => list;
  const usedNiqqud = new Set([correctForm.niqqud]);
  const distractors = [];

  function tryAdd(form) {
    if (!form || usedNiqqud.has(form.niqqud)) return false;
    usedNiqqud.add(form.niqqud);
    distractors.push(form);
    return true;
  }

  // Two distractors: a different governed preposition, same object.
  const otherPreps = shuffle(Object.keys(inflections).filter((key) => key !== prepKey));
  for (const key of otherPreps) {
    if (distractors.length >= 2) break;
    tryAdd(inflections[key]?.[objectKey]);
  }

  // One distractor: the correct preposition inflected to a different object.
  const otherObjects = shuffle(objects.filter((object) => object.key !== objectKey));
  for (const object of otherObjects) {
    if (distractors.length >= 3) break;
    tryAdd(inflections[prepKey]?.[object.key]);
  }

  // Backfill from any remaining wrong-preposition forms if needed.
  for (const key of otherPreps) {
    if (distractors.length >= 3) break;
    for (const object of objects) {
      if (distractors.length >= 3) break;
      tryAdd(inflections[key]?.[object.key]);
    }
  }

  if (distractors.length < 3) return null;

  const options = shuffle([
    { id: "correct", text: correctForm.plain, textNiqqud: correctForm.niqqud, isCorrect: true },
    ...distractors.slice(0, 3).map((form, index) => ({
      id: `d${index + 1}`,
      text: form.plain,
      textNiqqud: form.niqqud,
      isCorrect: false,
    })),
  ]);

  return { correctForm, options };
};

prepositions.getPrepositionsPromptSpeechPayload = prepositions.getPrepositionsPromptSpeechPayload || function getPrepositionsPromptSpeechPayload(question = getRuntime().state.prepositions.currentQuestion) {
  if (!question?.triggerHe) return null;
  // Speak only the trigger word, never the answer's preposition.
  return app.speech?.buildSpeechPayload?.({
    plain: question.triggerHe,
    source: "prompt",
  }) || null;
};

prepositions.getPrepositionsSelectionSpeechPayload = prepositions.getPrepositionsSelectionSpeechPayload || function getPrepositionsSelectionSpeechPayload(question, option) {
  if (!option) return null;
  return app.speech?.buildSpeechPayload?.({
    plain: option.text,
    niqqud: option.textNiqqud,
    source: "answer",
  }) || null;
};

prepositions.buildPrepositionsDeck = prepositions.buildPrepositionsDeck || function buildPrepositionsDeck() {
  const shuffle = app.utils?.shuffle;
  const deck = [];
  const objects = getObjects();
  for (const trigger of getTriggers()) {
    if (!getInflections()[trigger.prep]) continue;
    for (const object of objects) {
      const built = prepositions.buildPrepositionOptions(trigger.prep, object.key, shuffle);
      if (!built) continue;
      const answerPlain = `${trigger.he} ${built.correctForm.plain}`;
      const answerNiqqud = `${trigger.he} ${built.correctForm.niqqud}`;
      const prepBase = getInflections()[trigger.prep]?.base || trigger.prep;
      deck.push({
        triggerId: trigger.id,
        triggerHe: trigger.he,
        prepKey: trigger.prep,
        prepBase,
        objectKey: object.key,
        objectLabel: prepositions.getObjectLabel(object.key),
        promptText: prepositions.buildPromptText(trigger),
        promptIsHebrew: true,
        englishHint: prepositions.buildEnglishHint(trigger, object.key),
        correctAnswer: built.correctForm.niqqud,
        answerPlain,
        answerNiqqud,
        options: built.options,
        selectedOptionId: null,
        locked: false,
      });
    }
  }
  return typeof shuffle === "function" ? shuffle(deck) : deck;
};

prepositions.startPrepositions = prepositions.startPrepositions || function startPrepositions() {
  const runtime = getRuntime();
  const h = getHelpers();
  const s = getSession();
  const shuffle = app.utils?.shuffle;
  app.speech?.cancel?.();
  s.stopVerbMatchTimer?.();
  s.stopLessonTimer?.();
  s.stopAbbreviationTimer?.();
  s.stopWordMatchTimer?.();
  h.resetAbbreviationState?.();
  s.clearAbbreviationIntro?.();
  s.clearWordMatchIntro?.();
  s.clearBinyanBoardIntro?.();
  s.clearAdvConjIntro?.();
  s.clearSummaryState?.();
  app.wordMatch?.resetWordMatchState?.();
  app.binyanBoard?.resetBinyanBoardState?.();
  s.clearHandwritingIntro?.();
  app.handwriting?.resetHandwritingState?.();
  s.resetAdvConjState?.();
  s.resetPrepositionsState?.();
  h.resetSessionScore?.();
  runtime.state.mode = "prepositions";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = "prepositions";
  const deck = prepositions.buildPrepositionsDeck();
  runtime.state.prepositions.questionQueue = (typeof shuffle === "function" ? shuffle(deck) : deck).slice(0, runtime.constants.PREPOSITIONS_ROUNDS);
  runtime.state.prepositions.active = true;
  runtime.state.prepositions.startMs = Date.now();
  runtime.state.prepositions.timerId = runtime.global.setInterval(() => {
    runtime.state.prepositions.elapsedSeconds = Math.floor((Date.now() - runtime.state.prepositions.startMs) / 1000);
    h.renderAll?.();
  }, 1000);
  prepositions.playPrepositionsIntro();
};

prepositions.playPrepositionsIntro = prepositions.playPrepositionsIntro || function playPrepositionsIntro() {
  const runtime = getRuntime();
  runtime.state.prepositions.introActive = true;
  if (runtime.el.prepositionsIntro) {
    runtime.el.prepositionsIntro.classList.remove("hidden");
    runtime.el.prepositionsIntro.setAttribute("aria-hidden", "false");
  }
  getSession().scheduleIntroAutoAdvance?.(() => prepositions.beginPrepositionsFromIntro());
};

prepositions.beginPrepositionsFromIntro = prepositions.beginPrepositionsFromIntro || function beginPrepositionsFromIntro() {
  const runtime = getRuntime();
  if (!runtime.state.prepositions.active) return;
  getSession().clearPrepositionsIntro?.();
  prepositions.loadPrepositionsQuestion();
};

prepositions.tryStartPrepositionsReviewPhase = prepositions.tryStartPrepositionsReviewPhase || function tryStartPrepositionsReviewPhase() {
  const state = getRuntime().state.prepositions;
  if (state.inReview || !state.reviewQueue.length) return false;
  state.inReview = true;
  state.secondChanceTotal = state.reviewQueue.length;
  state.secondChanceCurrent = 0;
  return true;
};

prepositions.loadPrepositionsQuestion = prepositions.loadPrepositionsQuestion || function loadPrepositionsQuestion() {
  const runtime = getRuntime();
  const state = runtime.state.prepositions;
  if (state.questionQueue.length === 0) {
    if (!state.inReview && prepositions.tryStartPrepositionsReviewPhase()) {
      state.questionQueue = state.reviewQueue;
      state.reviewQueue = [];
      state.currentQuestion = null;
      getHelpers().renderSessionHeader?.();
      prepositions.playPrepositionsIntro();
      return;
    }
    getSession().finishPrepositions?.();
    return;
  }
  state.currentQuestion = state.questionQueue.shift();
  if (state.inReview) state.secondChanceCurrent += 1;
  else state.currentRound += 1;
  getHelpers().clearFeedback?.();
  prepositions.renderPrepositionsQuestion();
};

prepositions.renderPrepositionsQuestion = prepositions.renderPrepositionsQuestion || function renderPrepositionsQuestion() {
  const runtime = getRuntime();
  const h = getHelpers();
  const question = runtime.state.prepositions.currentQuestion;
  if (!question) return;
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.(question.englishHint, true);
  if (runtime.el.promptText) {
    runtime.el.promptText.textContent = question.promptText;
    runtime.el.promptText.classList.remove("hidden");
    runtime.el.promptText.classList.add("hebrew");
    runtime.el.promptText.classList.remove("english-prompt");
  }
  prepositions.renderPrepositionsChoices(question);
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

prepositions.renderPrepositionsChoices = prepositions.renderPrepositionsChoices || function renderPrepositionsChoices(question) {
  const runtime = getRuntime();
  runtime.el.choiceContainer.innerHTML = "";
  for (const option of question.options) {
    const btn = global.document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn hebrew";
    btn.dir = "rtl";
    btn.setAttribute("lang", "he");
    btn.textContent = option.textNiqqud || option.text;
    btn.addEventListener("click", () => {
      if (question.locked) return;
      question.selectedOptionId = option.id;
      runtime.el.choiceContainer.querySelectorAll(".choice-btn").forEach((button, index) => {
        button.classList.toggle("selected", question.options[index]?.id === option.id);
      });
      getHelpers().renderSessionHeader?.();
      app.speech?.speak?.(prepositions.getPrepositionsSelectionSpeechPayload(question, option));
    });
    btn.classList.toggle("selected", question.selectedOptionId === option.id && !question.locked);
    runtime.el.choiceContainer.appendChild(btn);
  }
  if (question.locked) {
    prepositions.markPrepositionsChoiceResults(question);
  }
};

prepositions.markPrepositionsChoiceResults = prepositions.markPrepositionsChoiceResults || function markPrepositionsChoiceResults(question) {
  const runtime = getRuntime();
  const buttons = runtime.el.choiceContainer.querySelectorAll(".choice-btn");
  question.options.forEach((option, index) => {
    if (!buttons[index]) return;
    if (option.isCorrect) buttons[index].classList.add("correct");
    else if (option.id === question.selectedOptionId) buttons[index].classList.add("wrong");
    buttons[index].disabled = true;
  });
};

prepositions.applyPrepositionsAnswer = prepositions.applyPrepositionsAnswer || function applyPrepositionsAnswer() {
  const runtime = getRuntime();
  const h = getHelpers();
  const question = runtime.state.prepositions.currentQuestion;
  if (!question || question.locked) return;
  app.speech?.cancel?.();
  question.locked = true;
  const selected = question.options.find((option) => option.id === question.selectedOptionId);
  const isCorrect = selected?.isCorrect ?? false;
  if (isCorrect) {
    runtime.state.sessionStreak += 1;
    if (!question.isReview) {
      runtime.state.sessionScore += 1;
    }
  } else {
    runtime.state.sessionStreak = 0;
    runtime.state.prepositions.wrongAnswers += 1;
    const mistakeKey = `${question.triggerId}:${question.objectKey}`;
    if (!runtime.state.prepositions.sessionMistakes.some((entry) => entry.key === mistakeKey)) {
      runtime.state.prepositions.sessionMistakes.push({
        key: mistakeKey,
        primary: question.answerNiqqud,
        secondary: question.englishHint,
        clinicKey: "results.prepositionClinic",
        clinicVars: {
          trigger: question.triggerHe,
          prep: question.prepBase,
          object: question.objectLabel,
          answer: question.answerNiqqud,
        },
      });
    }
    if (!question.isReview && !runtime.state.prepositions.reviewQueue.some((entry) => entry.key === mistakeKey)) {
      const shuffle = app.utils?.shuffle || ((list) => list);
      runtime.state.prepositions.reviewQueue.push({
        ...question,
        key: mistakeKey,
        options: shuffle(question.options.map((option) => ({ ...option }))),
        selectedOptionId: null,
        locked: false,
        isReview: true,
      });
    }
  }

  h.setFeedback?.({
    tone: isCorrect ? "success" : "error",
    sentence: translate(
      isCorrect ? "feedback.prepositionsCorrect" : "feedback.prepositionsWrong",
      { answer: question.answerNiqqud }
    ),
    detail: translate("feedback.prepositionsDetail", { meaning: question.englishHint }),
  });
  h.playAnswerFeedbackSound?.(isCorrect);
  prepositions.updatePrepositionsStats(isCorrect);
  prepositions.markPrepositionsChoiceResults(question);
  h.renderSessionHeader?.();
  h.renderDomainPerformance?.();
  h.renderMostMissed?.();
};

prepositions.updatePrepositionsStats = prepositions.updatePrepositionsStats || function updatePrepositionsStats(isCorrect) {
  const runtime = getRuntime();
  const stats = runtime.storageApi.loadJson(runtime.constants.STORAGE_KEYS.prepositionsStats, { attempts: 0, correct: 0 });
  stats.attempts += 1;
  if (isCorrect) stats.correct += 1;
  runtime.storageApi.saveJson(runtime.constants.STORAGE_KEYS.prepositionsStats, stats);
};

prepositions.buildPrepositionsMistakeSummary = prepositions.buildPrepositionsMistakeSummary || function buildPrepositionsMistakeSummary() {
  return getRuntime().state.prepositions.sessionMistakes.slice();
};
})(typeof window !== "undefined" ? window : globalThis);

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

function getVerbFormSpecs() {
  return Array.isArray(global.PREPOSITION_VERB_FORMS) ? global.PREPOSITION_VERB_FORMS : [];
}

function getVerbLinks() {
  return global.PREPOSITION_VERB_LINKS || {};
}

// Paradigms are looked up by seed-entry id, not deck id: a multi-sense verb is
// split into one deck entry per sense but every sense shares one conjugation, so
// the first entry under an id is representative. Cached because the deck is
// rebuilt on every startPrepositions.
let paradigmsByEntryId = null;

function getParadigm(entryId) {
  if (!paradigmsByEntryId) {
    const runtimeDeck = getRuntime().verbFormDeck;
    const deck = Array.isArray(runtimeDeck) && runtimeDeck.length
      ? runtimeDeck
      : (global.IvriQuestHebrewVerbs?.buildVerbConjugationDeck?.() || []);
    paradigmsByEntryId = new Map();
    for (const entry of deck) {
      const key = String(entry?.id || "").replace(/--sense-\d+$/, "");
      if (!key || paradigmsByEntryId.has(key)) continue;
      const forms = new Map();
      for (const form of entry.forms || []) {
        if (form?.id) forms.set(form.id, form);
      }
      paradigmsByEntryId.set(key, forms);
    }
  }
  return paradigmsByEntryId.get(entryId) || null;
}

function stripInfinitiveTo(text) {
  return String(text || "").replace(/^to\s+/i, "");
}

// True when a verb subject and a drilled object cannot refer to different people,
// so the frame would need a reflexive rather than a plain inflected preposition.
//
// Exact matches are the obvious case (חיכיתי לי wants חיכיתי לעצמי). First and
// second person also collide across number, because their reference is fixed by
// who is speaking: "we waited for me" and "I waited for us" are incoherent no
// matter the context, since the singular is inside the plural. Third person does
// not collide across number — "he waited for them" reads as disjoint reference
// and is ordinary Hebrew — so only identical third-person pairs are excluded.
prepositions.subjectCoreferencesObject = prepositions.subjectCoreferencesObject || function subjectCoreferencesObject(subjectKey, objectKey) {
  if (!subjectKey || !objectKey) return false;
  if (subjectKey === objectKey) return true;
  const subjectPerson = String(subjectKey).charAt(0);
  const objectPerson = String(objectKey).charAt(0);
  if (subjectPerson !== objectPerson) return false;
  return subjectPerson === "1" || subjectPerson === "2";
};

// One frame per Hebrew verb form this trigger is drilled in. A trigger with no
// paradigm link — every adjective and expression, and the verbs whose present
// form matches no stored paradigm — yields its single frozen frame with the
// trigger's own infinitive gloss, which is the behaviour this game had before
// conjugated frames existed.
prepositions.buildTriggerFrames = prepositions.buildTriggerFrames || function buildTriggerFrames(trigger) {
  const frozen = [{ he: trigger.he, heNiqqud: "", subject: "", en: trigger.en }];
  const link = getVerbLinks()[trigger.id];
  if (!link) return frozen;
  const paradigm = getParadigm(link.entryId);
  if (!paradigm) return frozen;

  const base = stripInfinitiveTo(trigger.en);
  const predicates = {
    base,
    future: `will ${base}`,
    s3: link.s3 || base,
    past: link.past || base,
  };

  // Deduped by Hebrew surface: several paradigms syncretize the forms this game
  // uses — lamed-hey verbs spell present masculine and feminine singular alike
  // (מחכה) — and two items with identical Hebrew and an identical answer differ
  // only in flavour text, so they would dilute the queue without teaching more.
  const frames = [];
  const seenHe = new Set();
  for (const spec of getVerbFormSpecs()) {
    const form = paradigm.get(spec.formId);
    if (!form?.valuePlain || seenHe.has(form.valuePlain)) continue;
    const predicate = predicates[spec.key];
    if (!predicate) continue;
    seenHe.add(form.valuePlain);
    frames.push({
      he: form.valuePlain,
      heNiqqud: form.valueNiqqud || "",
      subject: spec.subject || "",
      en: `${spec.pronoun} ${predicate}`,
    });
  }
  return frames.length ? frames : frozen;
};

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

prepositions.getPossessiveObjectLabel = prepositions.getPossessiveObjectLabel || function getPossessiveObjectLabel(objectKey) {
  const entry = getObjects().find((object) => object.key === objectKey);
  return entry?.poss || entry?.en || objectKey;
};

// A trigger may carry a `tail`: a fixed phrase that follows the blank, so the
// inflected preposition can be drilled mid-sentence rather than only at the end.
// Dative-experiencer expressions need this — in נמאס לי מהעבודה the slot worth
// practising is the ל־ experiencer, and it sits before the מ־ source.
// `frameHe` is the conjugated verb form for this item; it falls back to the
// trigger's frozen form for triggers with no paradigm link.
prepositions.buildPromptText = prepositions.buildPromptText || function buildPromptText(trigger, frameHe) {
  return prepositions.joinTriggerParts(trigger, "____", frameHe);
};

prepositions.joinTriggerParts = prepositions.joinTriggerParts || function joinTriggerParts(trigger, middle, frameHe) {
  return [frameHe || trigger.he, middle, trigger.tail].filter(Boolean).join(" ");
};

prepositions.buildEnglishHint = prepositions.buildEnglishHint || function buildEnglishHint(trigger, objectKey, frameEn) {
  return sanitizeEnglishText(
    String(frameEn || trigger.en || "")
      .replace(/\{o\}/g, prepositions.getObjectLabel(objectKey))
      .replace(/\{p\}/g, prepositions.getPossessiveObjectLabel(objectKey))
  );
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
  // Speak only the trigger word, never the answer's preposition. A tail is not
  // spoken either: "נמאס מהעבודה" without its dative is a malformed sentence,
  // so reading the frame aloud without the blank would teach the wrong shape.
  // Conjugated frames carry niqqud, which the TTS respelling table needs to
  // disambiguate forms that share a consonantal skeleton (תחכה is both "she will
  // wait" and "you (m.) will wait").
  return app.speech?.buildSpeechPayload?.({
    plain: question.triggerHe,
    niqqud: question.triggerHeNiqqud || "",
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
    for (const frame of prepositions.buildTriggerFrames(trigger)) {
      for (const object of objects) {
        // This is the same failure the frozen dative-experiencer triggers had
        // before their 2026-07-27 repair, reintroduced by conjugating the subject
        // rather than baking it in.
        if (prepositions.subjectCoreferencesObject(frame.subject, object.key)) continue;
        const built = prepositions.buildPrepositionOptions(trigger.prep, object.key, shuffle);
        if (!built) continue;
        const answerPlain = prepositions.joinTriggerParts(trigger, built.correctForm.plain, frame.he);
        const answerNiqqud = prepositions.joinTriggerParts(trigger, built.correctForm.niqqud, frame.he);
        const prepBase = getInflections()[trigger.prep]?.base || trigger.prep;
        deck.push({
          triggerId: trigger.id,
          triggerHe: frame.he,
          triggerHeNiqqud: frame.heNiqqud || "",
          triggerTail: trigger.tail || "",
          prepKey: trigger.prep,
          prepBase,
          objectKey: object.key,
          objectLabel: prepositions.getObjectLabel(object.key),
          promptText: prepositions.buildPromptText(trigger, frame.he),
          promptIsHebrew: true,
          englishHint: prepositions.buildEnglishHint(trigger, object.key, frame.en),
          correctAnswer: built.correctForm.niqqud,
          answerPlain,
          answerNiqqud,
          options: built.options,
          selectedOptionId: null,
          locked: false,
        });
      }
    }
  }
  return typeof shuffle === "function" ? shuffle(deck) : deck;
};

prepositions.pickPrepositionsQuestions = prepositions.pickPrepositionsQuestions || function pickPrepositionsQuestions(deck, count) {
  const utils = app.utils || {};
  if (typeof utils.pickWeightedSubset !== "function" || typeof utils.getAdaptiveWeight !== "function") {
    const shuffled = typeof utils.shuffle === "function" ? utils.shuffle(deck) : [...deck];
    return shuffled.slice(0, count);
  }

  const stats = prepositions.getPrepositionsItemStats();
  const weighted = deck.map((question) => ({
    word: question,
    weight: utils.getAdaptiveWeight(stats[`${question.triggerId}:${question.objectKey}`]),
  }));
  return utils.pickWeightedSubset(weighted, count);
};

prepositions.startPrepositions = prepositions.startPrepositions || function startPrepositions() {
  const runtime = getRuntime();
  const h = getHelpers();
  const s = getSession();
  app.speech?.cancel?.();
  s.resetAllModeSessions?.();
  s.clearSummaryState?.();
  h.resetSessionScore?.();
  runtime.state.mode = "prepositions";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = "prepositions";
  const deck = prepositions.buildPrepositionsDeck();
  runtime.state.prepositions.questionQueue = prepositions.pickPrepositionsQuestions(deck, runtime.constants.PREPOSITIONS_ROUNDS);
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
    getHelpers().showBlockingOverlay?.(runtime.el.prepositionsIntro);
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
  app.character?.clearTransientReaction?.();
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
  prepositions.updatePrepositionsItemStats(`${question.triggerId}:${question.objectKey}`, isCorrect);
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

prepositions.getPrepositionsItemStats = prepositions.getPrepositionsItemStats || function getPrepositionsItemStats() {
  const runtime = getRuntime();
  return runtime.storageApi.loadJson(runtime.constants.STORAGE_KEYS.prepositionsItemStats, {}) || {};
};

prepositions.updatePrepositionsItemStats = prepositions.updatePrepositionsItemStats || function updatePrepositionsItemStats(itemKey, isCorrect) {
  if (!itemKey || typeof app.utils?.normalizeAdaptiveRecord !== "function") return;
  const runtime = getRuntime();
  const stats = prepositions.getPrepositionsItemStats();
  const rec = app.utils.normalizeAdaptiveRecord(stats[itemKey]);
  rec.attempts += 1;
  if (isCorrect) {
    rec.correct += 1;
  } else {
    rec.misses += 1;
  }
  rec.lastSeen = Date.now();
  stats[itemKey] = rec;
  runtime.storageApi.saveJson(runtime.constants.STORAGE_KEYS.prepositionsItemStats, stats);
};

prepositions.buildPrepositionsMistakeSummary = prepositions.buildPrepositionsMistakeSummary || function buildPrepositionsMistakeSummary() {
  return getRuntime().state.prepositions.sessionMistakes.slice();
};
})(typeof window !== "undefined" ? window : globalThis);

(function initIvriQuestAppAbbreviation(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const abbreviation = app.abbreviation = app.abbreviation || {};

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

function sanitizeEnglishText(text) {
  return app.utils?.sanitizeEnglishDisplayText
    ? app.utils.sanitizeEnglishDisplayText(text)
    : String(text || "").trim();
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

abbreviation.getExpansionText = abbreviation.getExpansionText || function getExpansionText(entry, withNiqqud = false) {
  const plain = String(entry?.expansionHe || entry?.expansion_he || "").trim();
  const marked = String(entry?.expansionHeNiqqud || entry?.expansion_he_niqqud || "").trim();
  return withNiqqud && marked ? marked : plain;
};

abbreviation.getAbbreviationPromptSpeechPayload = abbreviation.getAbbreviationPromptSpeechPayload || function getAbbreviationPromptSpeechPayload(question = getRuntime().state.abbreviation.currentQuestion) {
  if (!question?.promptIsHebrew || question.entry?.speechDisabled) return null;
  return app.speech?.buildSpeechPayload?.({
    plain: question.prompt,
    speechOverridePlain: question.entry?.speechHe,
    speechOverrideNiqqud: question.entry?.speechHeNiqqud,
    source: "prompt",
  }) || null;
};

abbreviation.cloneAbbreviationQuestionSnapshot = abbreviation.cloneAbbreviationQuestionSnapshot || function cloneAbbreviationQuestionSnapshot(question) {
  return {
    ...question,
    entry: question.entry ? { ...question.entry } : null,
    options: question.options.map((option) => ({
      ...option,
      entry: option.entry ? { ...option.entry } : null,
    })),
    locked: question.locked !== undefined ? Boolean(question.locked) : true,
    selectedOptionId: question.selectedOptionId ?? null,
  };
};

abbreviation.prepareAbbreviationDeck = abbreviation.prepareAbbreviationDeck || function prepareAbbreviationDeck(entries) {
  const source = Array.isArray(entries) ? entries : [];
  const seenIds = new Set();
  const cleaned = [];

  source.forEach((entry, index) => {
    const abbr = String(entry?.abbr || "").trim();
    const expansionHe = String(entry?.expansionHe || entry?.expansion_he || "").trim();
    const expansionHeNiqqud = String(entry?.expansionHeNiqqud || entry?.expansion_he_niqqud || "").trim();
    const expansionHeNiqqudSource = String(entry?.expansionHeNiqqudSource || entry?.expansion_he_niqqud_source || "").trim();
    const speechHe = String(entry?.speechHe || entry?.speech_he || "").trim();
    const speechHeNiqqud = String(entry?.speechHeNiqqud || entry?.speech_he_niqqud || "").trim();
    const speechDisabled = entry?.speechDisabled === true || /['׳]$/.test(abbr);
    const english = sanitizeEnglishText(entry?.english);
    if (!abbr || !expansionHe || !english) return;

    let idBase = String(entry?.id || `abbr-${index + 1}`).trim();
    if (!idBase) {
      idBase = `abbr-${index + 1}`;
    }

    let id = idBase;
    let suffix = 2;
    while (seenIds.has(id)) {
      id = `${idBase}-${suffix}`;
      suffix += 1;
    }
    seenIds.add(id);

    cleaned.push({
      id,
      abbr,
      expansionHe,
      expansionHeNiqqud,
      expansionHeNiqqudSource,
      speechHe,
      speechHeNiqqud,
      speechDisabled,
      english,
      bucket: String(entry?.bucket || "").trim(),
      abbreviationQuizDistractorIds: Array.isArray(entry?.abbreviationQuizDistractorIds)
        ? entry.abbreviationQuizDistractorIds
            .map((value) => String(value || "").trim())
            .filter(Boolean)
        : [],
      notes: String(entry?.notes || "").trim(),
      source: String(entry?.source || "abbreviation"),
      availability: {
        abbreviationQuiz: entry?.availability?.abbreviationQuiz !== false,
      },
    });
  });

  return cleaned.filter((entry) => entry.availability?.abbreviationQuiz !== false);
};

abbreviation.renderAbbreviationIdleState = abbreviation.renderAbbreviationIdleState || function renderAbbreviationIdleState() {
  const runtime = getRuntime();
  const h = getHelpers();
  runtime.state.mode = "abbreviation";
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptText.classList.remove("hebrew");
  runtime.el.promptText.classList.add("english-prompt");
  runtime.el.promptText.textContent = translate("prompt.abbreviationStart");
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

abbreviation.resetAbbreviationState = abbreviation.resetAbbreviationState || function resetAbbreviationState() {
  const runtime = getRuntime();
  getSession().stopAbbreviationTimer?.();
  runtime.state.abbreviation.active = false;
  runtime.state.abbreviation.currentRound = 0;
  runtime.state.abbreviation.startMs = 0;
  runtime.state.abbreviation.elapsedSeconds = 0;
  runtime.state.abbreviation.timerId = null;
  runtime.state.abbreviation.askedEntryIds = [];
  runtime.state.abbreviation.introActive = false;
  runtime.state.abbreviation.currentQuestion = null;
  runtime.state.abbreviation.wrongAnswers = 0;
  runtime.state.abbreviation.sessionMistakeIds = [];
};

abbreviation.pickBestAbbreviationEntry = abbreviation.pickBestAbbreviationEntry || function pickBestAbbreviationEntry(pool, usedEntryIds = []) {
  const weightedRandomWord = app.utils?.weightedRandomWord;
  const data = getData();
  const runtime = getRuntime();
  const now = Date.now();
  const freshPool = usedEntryIds.length < pool.length ? pool.filter((entry) => !usedEntryIds.includes(entry.id)) : pool;
  // Before the due split: an unmet entry counts as due. Abbreviation progress
  // shares the vocabulary progress map, so the same "already met" test applies.
  const allowed = app.character?.filterWithheldContent?.("abbreviation", freshPool, {
    isSeen: (entry) => data.hasWordProgress?.(entry.id) === true,
  }) || freshPool;
  const due = abbreviation.getDueAbbreviationEntries(allowed, now);
  const set = due.length ? due : allowed;
  const maxLevel = runtime.constants.LEITNER_INTERVALS.length - 1;

  const characterWeigher = app.character?.buildContentWeigher?.("abbreviation", set) || (() => 1);
  const weighted = set.map((entry) => {
    const rec = data.getProgressRecord?.(entry.id) || { attempts: 0, correct: 0, nextDue: 0, level: 0 };
    const accuracy = rec.attempts ? rec.correct / rec.attempts : 0;
    const overdueMs = rec.attempts ? Math.max(0, now - rec.nextDue) : 0;
    const overdueHours = overdueMs / (60 * 60 * 1000);

    const newEntryBoost = rec.attempts === 0 ? 1.35 : 1;
    const dueBoost = rec.attempts > 0 && rec.nextDue <= now ? 1 + Math.min(1.2, overdueHours / 12) : 1;
    const weaknessBoost = 1 + (1 - accuracy) * 0.85;
    const levelBoost = 1 + ((maxLevel - rec.level) / maxLevel) * 0.35;
    const characterBoost = characterWeigher(entry);
    const jitter = 0.7 + Math.random() * 0.8;

    return {
      word: entry,
      weight: newEntryBoost * dueBoost * weaknessBoost * levelBoost * characterBoost * jitter,
    };
  });

  return typeof weightedRandomWord === "function" ? weightedRandomWord(weighted) : null;
};

abbreviation.getDueAbbreviationEntries = abbreviation.getDueAbbreviationEntries || function getDueAbbreviationEntries(pool, now = Date.now()) {
  const data = getData();
  return pool.filter((entry) => {
    const rec = data.getProgressRecord?.(entry.id) || { attempts: 0, nextDue: 0 };
    return rec.attempts === 0 || rec.nextDue <= now;
  });
};
})(typeof window !== "undefined" ? window : globalThis);

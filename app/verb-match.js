(function initIvriQuestAppVerbMatch(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const verbMatch = app.verbMatch = app.verbMatch || {};

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

// Conjugation drills quiz the forms, not preposition government, so the
// usage pattern baked into the study word (e.g. "to invite (את־ ל־)") is
// stripped from the prompt and its speech. Vocab and other games keep it.
function stripUsagePattern(word) {
  const usagePattern = String(word?.usagePattern || "").trim();
  if (!usagePattern) {
    return { en: word?.en, he: word?.he, heNiqqud: word?.heNiqqud };
  }
  const dropSuffix = (text, suffix) => {
    const value = String(text || "");
    return value.endsWith(suffix) ? value.slice(0, -suffix.length) : value;
  };
  return {
    en: dropSuffix(word?.en, ` (${usagePattern})`),
    he: dropSuffix(word?.he, ` ${usagePattern}`),
    heNiqqud: dropSuffix(word?.heNiqqud, ` ${usagePattern}`),
  };
}

verbMatch.getVerbMatchPromptSpeechPayload = verbMatch.getVerbMatchPromptSpeechPayload || function getVerbMatchPromptSpeechPayload() {
  const runtime = getRuntime();
  const current = runtime.state.match.currentVerb?.word;
  if (!current) return null;
  const stripped = stripUsagePattern(current);
  return app.speech?.buildSpeechPayload?.({
    plain: stripped.he,
    niqqud: stripped.heNiqqud,
    speechOverridePlain: current.speechHe,
    speechOverrideNiqqud: current.speechHeNiqqud,
    source: "prompt",
  }) || null;
};

verbMatch.getVerbMatchCardSpeechPayload = verbMatch.getVerbMatchCardSpeechPayload || function getVerbMatchCardSpeechPayload(card) {
  if (!card) return null;
  return app.speech?.buildSpeechPayload?.({
    plain: card.hebrewPlain,
    niqqud: card.hebrewNiqqud,
    source: "answer",
  }) || null;
};

verbMatch.moveEligibleVerbToMastered = verbMatch.moveEligibleVerbToMastered || function moveEligibleVerbToMastered() {
  const runtime = getRuntime();
  const h = getHelpers();
  const data = getData();
  const wordId = runtime.state.match.eligibleMasterWordId;
  if (!wordId || data.isWordMastered?.(wordId)) return;

  const word = data.getWordById?.(wordId);
  if (!data.isWordAvailableForMode?.(word, "translationQuiz")) return;
  if (!data.setWordMastered?.(wordId, true)) return;

  runtime.state.match.eligibleMasterWordId = "";
  app.persistence?.saveProgress?.();
  h.renderSessionHeader?.();
  h.renderPoolMeta?.();
  h.renderDomainPerformance?.();
  h.renderMostMissed?.();
  h.renderMasteredModal?.();

};

verbMatch.pickVerbMatchQueue = verbMatch.pickVerbMatchQueue || function pickVerbMatchQueue(deck, count) {
  const runtime = getRuntime();
  const data = getData();
  const utils = app.utils || {};
  if (typeof utils.pickWeightedSubset !== "function" || typeof utils.getAdaptiveWeight !== "function") {
    const shuffled = typeof utils.shuffle === "function" ? utils.shuffle(deck) : [...deck];
    return shuffled.slice(0, count);
  }

  const masterStreak = Math.max(1, Number(runtime.constants?.CONJUGATION_MASTER_STREAK || 10));
  const characterWeigher = app.character?.buildContentWeigher?.(
    "verb",
    deck,
    (entry) => ({ id: entry?.id || entry?.word?.id || "" }),
  ) || (() => 1);
  const weighted = deck.map((entry) => {
    const wordId = entry?.id || entry?.word?.id || "";
    const rec = data.getProgressRecord?.(wordId) || {};
    const streak = Math.max(0, Math.min(masterStreak, Number(rec.conjugationStreak || 0)));
    const streakDamp = Math.max(0.2, 1 - (streak / masterStreak) * 0.8);
    const masteredDamp = data.isWordMastered?.(wordId) ? 0.35 : 1;
    const characterBoost = characterWeigher(entry);
    const weight = utils.getAdaptiveWeight({
      attempts: rec.conjugationAttempts,
      correct: rec.conjugationCorrect,
      lastSeen: rec.lastConjugationSeen,
    }) * streakDamp * masteredDamp * characterBoost;
    return { word: entry, weight };
  });

  return utils.pickWeightedSubset(weighted, count);
};

verbMatch.startVerbMatch = verbMatch.startVerbMatch || function startVerbMatch() {
  const runtime = getRuntime();
  const h = getHelpers();
  const s = getSession();
  app.speech?.cancel?.();
  s.resetAllModeSessions?.();
  s.clearSummaryState?.();
  h.resetSessionScore?.();
  runtime.state.mode = "verbMatch";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = "verbMatch";
  runtime.state.match.layoutMode = "classic";
  h.setGamePickerVisibility?.(false);
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");

  if (!runtime.verbFormDeck?.length) {
    runtime.state.match.active = false;
    verbMatch.renderVerbMatchIdleState();
    return;
  }

  runtime.state.match.active = true;
  runtime.state.match.verbQueue = verbMatch.pickVerbMatchQueue(runtime.verbFormDeck, runtime.constants.VERB_MATCH_ROUNDS);
  runtime.state.match.totalVerbs = runtime.state.match.verbQueue.length;
  runtime.state.match.currentVerbIndex = 0;
  runtime.state.match.startMs = 0;
  runtime.state.match.elapsedSeconds = 0;
  runtime.state.match.sessionMatched = 0;
  runtime.state.match.sessionTotalPairs = runtime.state.match.verbQueue.reduce(
    (sum, item) => sum + verbMatch.selectVerbRoundPairs(item.forms).length,
    0
  );
  h.clearFeedback?.();
  h.playVerbMatchIntro?.();
  h.renderAll?.();
};

verbMatch.playVerbMatchIntro = verbMatch.playVerbMatchIntro || function playVerbMatchIntro() {
  const runtime = getRuntime();
  const session = getSession();
  const h = getHelpers();
  if (!runtime.el.verbMatchIntro) {
    verbMatch.beginVerbMatchFromIntro();
    return;
  }

  session.clearVerbMatchIntro?.();
  runtime.state.match.verbIntroActive = true;
  h.showBlockingOverlay?.(runtime.el.verbMatchIntro);
  session.scheduleIntroAutoAdvance?.(() => verbMatch.beginVerbMatchFromIntro());
};

verbMatch.beginVerbMatchFromIntro = verbMatch.beginVerbMatchFromIntro || function beginVerbMatchFromIntro() {
  const runtime = getRuntime();
  const session = getSession();
  const h = getHelpers();
  if (!runtime.state.match.active) return;
  if (!runtime.state.match.verbIntroActive && runtime.state.match.currentVerb) return;
  if (runtime.state.match.verbIntroActive) {
    session.clearVerbMatchIntro?.();
  }

  if (!runtime.state.match.startMs) {
    runtime.state.match.startMs = Date.now();
    runtime.state.match.elapsedSeconds = 0;
    session.startVerbMatchTimer?.();
  }
  h.clearFeedback?.();
  verbMatch.loadNextVerbRound();
};

verbMatch.resetVerbMatchState = verbMatch.resetVerbMatchState || function resetVerbMatchState() {
  const runtime = getRuntime();
  runtime.state.match.active = false;
  runtime.state.match.verbQueue = [];
  runtime.state.match.totalVerbs = 0;
  runtime.state.match.currentVerbIndex = 0;
  runtime.state.match.currentVerb = null;
  runtime.state.match.pairs = [];
  runtime.state.match.remainingPairs = [];
  runtime.state.match.leftCards = [];
  runtime.state.match.rightCards = [];
  runtime.state.match.layoutMode = "classic";
  runtime.state.match.selectedLeftId = null;
  runtime.state.match.selectedRightId = null;
  runtime.state.match.mismatchedCardIds = [];
  runtime.state.match.matchedCardIds = [];
  runtime.state.match.matchedPairIds = [];
  runtime.state.match.isResolving = false;
  runtime.state.match.nextCardId = 1;
  runtime.state.match.combo = 0;
  runtime.state.match.bestCombo = 0;
  runtime.state.match.matchedCount = 0;
  runtime.state.match.totalPairs = 0;
  runtime.state.match.startMs = 0;
  runtime.state.match.elapsedSeconds = 0;
  runtime.state.match.verbIntroActive = false;
  runtime.state.match.sessionMatched = 0;
  runtime.state.match.sessionTotalPairs = 0;
  runtime.state.match.currentVerbHadMismatch = false;
  runtime.state.match.eligibleMasterWordId = "";
  runtime.state.match.mismatchCount = 0;
  runtime.state.match.sessionMistakeIds = [];
  runtime.state.match.sessionMistakeForms = [];
};

verbMatch.finishVerbMatchSession = verbMatch.finishVerbMatchSession || function finishVerbMatchSession() {
  const runtime = getRuntime();
  const s = getSession();
  const verbsCovered = runtime.state.match.totalVerbs;
  const sessionMatched = runtime.state.match.sessionMatched;
  const sessionTotal = runtime.state.match.sessionTotalPairs || sessionMatched;
  const bestCombo = runtime.state.match.bestCombo;
  const elapsed = runtime.state.match.elapsedSeconds;
  const mismatchCount = runtime.state.match.mismatchCount;
  const mistakes = app.data?.buildVerbMatchMistakeSummary?.() || [];

  s.stopVerbMatchTimer?.();
  runtime.state.match.active = false;
  verbMatch.resetVerbMatchState();
  s.showSessionSummary?.({
    game: "verbMatch",
    titleKey: "summary.matchTitle",
    scoreKey: "summary.score",
    scoreVars: { score: sessionMatched, total: sessionTotal },
    noteKey: "summary.matchNote",
    noteVars: { verbs: verbsCovered, combo: bestCombo, seconds: elapsed },
    correctCount: sessionMatched,
    incorrectCount: mismatchCount,
    elapsedSeconds: elapsed,
    mistakes,
  });
};

verbMatch.loadNextVerbRound = verbMatch.loadNextVerbRound || function loadNextVerbRound() {
  const runtime = getRuntime();
  const shuffle = app.utils?.shuffle;
  const h = getHelpers();
  if (!runtime.state.match.active) return;
  const nextVerb = runtime.state.match.verbQueue.shift();

  if (!nextVerb) {
    verbMatch.finishVerbMatchSession();
    return;
  }

  runtime.state.match.currentVerbIndex += 1;
  runtime.state.match.currentVerb = nextVerb;
  runtime.state.match.pairs = verbMatch.selectVerbRoundPairs(nextVerb.forms);
  if (!runtime.state.match.pairs.length) {
    verbMatch.loadNextVerbRound();
    return;
  }

  runtime.state.match.totalPairs = runtime.state.match.pairs.length;
  runtime.state.match.matchedCount = 0;
  runtime.state.match.selectedLeftId = null;
  runtime.state.match.selectedRightId = null;
  runtime.state.match.mismatchedCardIds = [];
  runtime.state.match.matchedCardIds = [];
  runtime.state.match.matchedPairIds = [];
  runtime.state.match.isResolving = false;
  runtime.state.match.combo = 0;
  runtime.state.match.currentVerbHadMismatch = false;
  runtime.state.match.eligibleMasterWordId = "";
  runtime.state.match.remainingPairs = typeof shuffle === "function" ? shuffle(runtime.state.match.pairs) : [...runtime.state.match.pairs];
  runtime.state.match.leftCards = [];
  runtime.state.match.rightCards = [];
  runtime.state.match.nextCardId = 1;
  verbMatch.refillVerbMatchColumns();
  h.clearFeedback?.();
  verbMatch.renderVerbMatchRound();
};

verbMatch.selectVerbRoundPairs = verbMatch.selectVerbRoundPairs || function selectVerbRoundPairs(forms) {
  const runtime = getRuntime();
  const ordered = forms.filter((item) => runtime.matchFormOrder.includes(item.id));
  const byId = new Map(ordered.map((item) => [item.id, item]));
  const deduped = [];
  const seenHebrew = new Map();
  const seenEnglish = new Map();

  function getHebrewKey(item) {
    if (!item) return "";
    return String(
      runtime.state.showNiqqudInline
        ? (item.valueNiqqud || item.valuePlain || "")
        : (item.valuePlain || "")
    ).trim();
  }

  function isImperative(item) {
    return Boolean(item?.id && String(item.id).startsWith("imperative_"));
  }

  function replacePair(index, item, previousEnglishKey, nextEnglishKey) {
    deduped[index] = item;
    if (previousEnglishKey) {
      seenEnglish.delete(previousEnglishKey);
    }
    if (nextEnglishKey) {
      seenEnglish.set(nextEnglishKey, index);
    }
  }

  runtime.matchFormOrder.forEach((id) => {
    const item = byId.get(id);
    if (!item) return;
    const hebrewKey = getHebrewKey(item);
    const englishKey = sanitizeEnglishText(item.englishText);
    if (!hebrewKey || !englishKey || seenEnglish.has(englishKey)) return;

    const existingHebrewIndex = seenHebrew.get(hebrewKey);
    if (existingHebrewIndex !== undefined) {
      const existing = deduped[existingHebrewIndex];
      if (!isImperative(existing) && isImperative(item)) {
        replacePair(existingHebrewIndex, item, sanitizeEnglishText(existing?.englishText), englishKey);
      }
      return;
    }

    seenHebrew.set(hebrewKey, deduped.length);
    seenEnglish.set(englishKey, deduped.length);
    deduped.push(item);
  });

  return deduped;
};

verbMatch.refillVerbMatchColumns = verbMatch.refillVerbMatchColumns || function refillVerbMatchColumns() {
  const runtime = getRuntime();
  const shuffle = app.utils?.shuffle;

  const visibleRowsBase = getHelpers().getVisibleVerbMatchRows?.() || runtime.constants.MATCH_VISIBLE_ROWS;
  const visibleRows = visibleRowsBase;

  while (runtime.state.match.leftCards.length < visibleRows && runtime.state.match.remainingPairs.length) {
    const pair = runtime.state.match.remainingPairs.shift();
    if (!pair) break;

    runtime.state.match.leftCards.push({
      id: `left-${runtime.state.match.nextCardId}`,
      pairId: pair.id,
      englishText: pair.englishText,
      incoming: true,
    });
    runtime.state.match.nextCardId += 1;

    runtime.state.match.rightCards.push({
      id: `right-${runtime.state.match.nextCardId}`,
      pairId: pair.id,
      hebrewPlain: pair.valuePlain,
      hebrewNiqqud: pair.valueNiqqud || pair.valuePlain,
      incoming: true,
    });
    runtime.state.match.nextCardId += 1;
  }

  runtime.state.match.rightCards = typeof shuffle === "function" ? shuffle(runtime.state.match.rightCards) : runtime.state.match.rightCards;
};

verbMatch.renderVerbMatchIdleState = verbMatch.renderVerbMatchIdleState || function renderVerbMatchIdleState() {
  const runtime = getRuntime();
  const h = getHelpers();
  runtime.state.mode = "verbMatch";
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptText.innerHTML = "";
  runtime.el.promptText.classList.remove("hebrew");
  runtime.el.promptText.classList.remove("verb-match-prompt");
  runtime.el.promptText.classList.add("english-prompt");
  runtime.el.promptText.removeAttribute("aria-label");
  runtime.el.promptText.textContent = translate("prompt.verbMatchStart");
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

verbMatch.renderVerbMatchRound = verbMatch.renderVerbMatchRound || function renderVerbMatchRound() {
  const runtime = getRuntime();
  const h = getHelpers();
  if (!runtime.state.match.active || !runtime.state.match.currentVerb) {
    verbMatch.renderVerbMatchIdleState();
    return;
  }

  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  h.renderPromptText?.();
  verbMatch.renderVerbMatchCards();
};

verbMatch.renderVerbMatchPrompt = verbMatch.renderVerbMatchPrompt || function renderVerbMatchPrompt() {
  const runtime = getRuntime();
  const h = getHelpers();
  if (!runtime.state.match.active || !runtime.state.match.currentVerb) {
    runtime.el.promptText.innerHTML = "";
    runtime.el.promptText.classList.remove("hebrew");
    runtime.el.promptText.classList.remove("verb-match-prompt");
    runtime.el.promptText.classList.add("english-prompt");
    runtime.el.promptText.removeAttribute("aria-label");
    runtime.el.promptText.textContent = translate("prompt.verbMatchStart");
    h.renderNiqqudToggle?.();
    return;
  }

  const current = stripUsagePattern(runtime.state.match.currentVerb.word);
  const heText = runtime.state.showNiqqudInline ? current.heNiqqud : current.he;
  runtime.el.promptText.innerHTML = "";
  runtime.el.promptText.classList.remove("hebrew");
  runtime.el.promptText.classList.add("english-prompt");
  runtime.el.promptText.classList.add("verb-match-prompt");
  runtime.el.promptText.setAttribute("aria-label", `${current.en} | ${heText}`);

  const english = global.document.createElement("span");
  english.className = "verb-prompt-english";
  english.textContent = current.en;

  const separator = global.document.createElement("span");
  separator.className = "verb-prompt-separator";
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "|";

  const hebrew = global.document.createElement("span");
  hebrew.className = "verb-prompt-hebrew";
  hebrew.dir = "rtl";
  hebrew.setAttribute("lang", "he");
  hebrew.textContent = heText;

  runtime.el.promptText.append(english, separator, hebrew);
  h.renderNiqqudToggle?.();
};

verbMatch.renderVerbMatchCards = verbMatch.renderVerbMatchCards || function renderVerbMatchCards() {
  const runtime = getRuntime();
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-bubble-grid");
  runtime.el.choiceContainer.classList.add("match-grid");
  const leftSelected = runtime.state.match.selectedLeftId;
  const rightSelected = runtime.state.match.selectedRightId;
  const mismatchSet = new Set(runtime.state.match.mismatchedCardIds);
  const matchedSet = new Set(runtime.state.match.matchedCardIds);

  const wrap = global.document.createElement("div");
  wrap.className = "match-columns";
  wrap.setAttribute("dir", "ltr");

  const leftCards = runtime.state.match.leftCards;
  const rightCards = runtime.state.match.rightCards;
  const longLen = runtime.constants?.MATCH_LONG_LEN || 16;
  const rows = Math.max(leftCards.length, rightCards.length);
  for (let idx = 0; idx < rows; idx += 1) {
    const leftCard = leftCards[idx];
    if (leftCard) {
      const btn = global.document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn match-card";
      btn.textContent = leftCard.englishText;
      if (String(leftCard.englishText || "").length > longLen) {
        btn.classList.add("match-card-long");
      }
      btn.classList.toggle("selected", leftSelected === leftCard.id);
      btn.classList.toggle("matched", matchedSet.has(leftCard.id));
      btn.classList.toggle("mismatch", mismatchSet.has(leftCard.id));
      btn.classList.toggle("incoming", Boolean(leftCard.incoming));
      if (leftCard.incoming) {
        btn.style.animationDelay = `${idx * 40}ms`;
      }
      btn.addEventListener("click", () => verbMatch.handleVerbMatchLeft(leftCard.id));
      wrap.append(btn);
      leftCard.incoming = false;
    }

    const rightCard = rightCards[idx];
    if (rightCard) {
      const text = runtime.state.showNiqqudInline ? rightCard.hebrewNiqqud : rightCard.hebrewPlain;
      const btn = global.document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn match-card hebrew";
      btn.textContent = text;
      if (String(text || "").length > longLen) {
        btn.classList.add("match-card-long");
      }
      btn.classList.toggle("selected", rightSelected === rightCard.id);
      btn.classList.toggle("matched", matchedSet.has(rightCard.id));
      btn.classList.toggle("mismatch", mismatchSet.has(rightCard.id));
      btn.classList.toggle("incoming", Boolean(rightCard.incoming));
      if (rightCard.incoming) {
        btn.style.animationDelay = `${idx * 40 + 30}ms`;
      }
      btn.addEventListener("click", () => verbMatch.handleVerbMatchRight(rightCard.id));
      wrap.append(btn);
      rightCard.incoming = false;
    }
  }

  runtime.el.choiceContainer.append(wrap);
};

verbMatch.handleVerbMatchLeft = verbMatch.handleVerbMatchLeft || function handleVerbMatchLeft(cardId) {
  const runtime = getRuntime();
  if (!runtime.state.match.active || !runtime.state.match.currentVerb || runtime.state.match.isResolving) return;
  const card = runtime.state.match.leftCards.find((item) => item.id === cardId);
  if (!card) return;

  runtime.state.match.selectedLeftId = runtime.state.match.selectedLeftId === cardId ? null : cardId;
  verbMatch.resolveVerbMatchSelection();
  verbMatch.renderVerbMatchRound();
};

verbMatch.handleVerbMatchRight = verbMatch.handleVerbMatchRight || function handleVerbMatchRight(cardId) {
  const runtime = getRuntime();
  if (!runtime.state.match.active || !runtime.state.match.currentVerb || runtime.state.match.isResolving) return;
  const card = runtime.state.match.rightCards.find((item) => item.id === cardId);
  if (!card) return;

  const shouldSpeak = !runtime.state.match.selectedLeftId && runtime.state.match.selectedRightId !== cardId;
  runtime.state.match.selectedRightId = runtime.state.match.selectedRightId === cardId ? null : cardId;
  if (shouldSpeak && runtime.state.match.selectedRightId === cardId) {
    app.speech?.speak?.(verbMatch.getVerbMatchCardSpeechPayload(card));
  }
  verbMatch.resolveVerbMatchSelection();
  verbMatch.renderVerbMatchRound();
};

verbMatch.resolveVerbMatchSelection = verbMatch.resolveVerbMatchSelection || function resolveVerbMatchSelection() {
  const runtime = getRuntime();
  if (!runtime.state.match.selectedLeftId || !runtime.state.match.selectedRightId) return;

  const leftCard = runtime.state.match.leftCards.find((item) => item.id === runtime.state.match.selectedLeftId);
  const rightCard = runtime.state.match.rightCards.find((item) => item.id === runtime.state.match.selectedRightId);
  if (!leftCard || !rightCard) {
    runtime.state.match.selectedLeftId = null;
    runtime.state.match.selectedRightId = null;
    return;
  }

  if (leftCard.pairId === rightCard.pairId) {
    verbMatch.applyVerbMatchSuccess(leftCard, rightCard);
    return;
  }

  verbMatch.applyVerbMatchMismatch(leftCard, rightCard);
};

verbMatch.applyVerbMatchSuccess = verbMatch.applyVerbMatchSuccess || function applyVerbMatchSuccess(leftCard, rightCard) {
  const runtime = getRuntime();
  const h = getHelpers();
  const data = getData();
  const currentWordId = runtime.state.match.currentVerb?.word?.id || "";
  app.speech?.cancel?.();
  runtime.state.match.isResolving = true;
  runtime.state.match.matchedCardIds = [leftCard.id, rightCard.id];
  runtime.state.match.selectedLeftId = null;
  runtime.state.match.selectedRightId = null;
  runtime.state.match.combo += 1;
  runtime.state.match.bestCombo = Math.max(runtime.state.match.bestCombo, runtime.state.match.combo);
  runtime.state.sessionStreak += 1;
  runtime.state.sessionScore += 1;
  runtime.state.match.sessionMatched += 1;
  h.playAnswerFeedbackSound?.(true);
  data.updateConjugationProgress?.(currentWordId, true);
  h.renderDomainPerformance?.();

  if (!runtime.state.match.matchedPairIds.includes(leftCard.pairId)) {
    runtime.state.match.matchedPairIds.push(leftCard.pairId);
  }
  runtime.state.match.matchedCount = runtime.state.match.matchedPairIds.length;
  verbMatch.renderVerbMatchRound();

  runtime.global.setTimeout(() => {
    if (!runtime.state.match.active) return;
    runtime.state.match.leftCards = runtime.state.match.leftCards.filter((item) => item.id !== leftCard.id);
    runtime.state.match.rightCards = runtime.state.match.rightCards.filter((item) => item.id !== rightCard.id);
    runtime.state.match.matchedCardIds = [];
    verbMatch.refillVerbMatchColumns();
    runtime.state.match.isResolving = false;

    if (runtime.state.match.matchedCount >= runtime.state.match.totalPairs) {
      const current = runtime.state.match.currentVerb.word;
      const streakCount = data.recordConjugationRound?.(current.id, !runtime.state.match.currentVerbHadMismatch) || 0;
      const reachedMasterThreshold = streakCount >= runtime.constants.CONJUGATION_MASTER_STREAK && !data.isWordMastered?.(current.id);
      runtime.state.match.eligibleMasterWordId = reachedMasterThreshold ? current.id : "";
      const hasMoreVerbs = runtime.state.match.verbQueue.length > 0;
      if (!hasMoreVerbs) {
        verbMatch.finishVerbMatchSession();
        return;
      }
    }
    verbMatch.renderVerbMatchRound();
  }, 180);
};

verbMatch.recordVerbMatchMistakeForm = verbMatch.recordVerbMatchMistakeForm || function recordVerbMatchMistakeForm(pairId) {
  const runtime = getRuntime();
  const wordId = runtime.state.match.currentVerb?.word?.id || "";
  const pair = runtime.state.match.pairs.find((item) => item.id === pairId);
  if (!pair) return;
  const key = `${wordId}::${pair.id}`;
  if (runtime.state.match.sessionMistakeForms.some((item) => item.key === key)) return;
  runtime.state.match.sessionMistakeForms.push({
    key,
    wordId,
    valuePlain: pair.valuePlain || "",
    valueNiqqud: pair.valueNiqqud || pair.valuePlain || "",
    englishText: pair.englishText || "",
  });
};

verbMatch.applyVerbMatchMismatch = verbMatch.applyVerbMatchMismatch || function applyVerbMatchMismatch(leftCard, rightCard) {
  const runtime = getRuntime();
  const h = getHelpers();
  const data = getData();
  const currentWordId = runtime.state.match.currentVerb?.word?.id || "";
  app.speech?.cancel?.();
  runtime.state.match.isResolving = true;
  runtime.state.match.combo = 0;
  runtime.state.sessionStreak = 0;
  runtime.state.match.currentVerbHadMismatch = true;
  runtime.state.match.mismatchCount += 1;
  if (currentWordId && !runtime.state.match.sessionMistakeIds.includes(currentWordId)) {
    runtime.state.match.sessionMistakeIds.push(currentWordId);
  }
  verbMatch.recordVerbMatchMistakeForm(leftCard.pairId);
  verbMatch.recordVerbMatchMistakeForm(rightCard.pairId);
  runtime.state.match.mismatchedCardIds = [leftCard.id, rightCard.id];
  runtime.state.match.selectedLeftId = null;
  runtime.state.match.selectedRightId = null;
  h.playAnswerFeedbackSound?.(false);
  data.updateConjugationProgress?.(currentWordId, false);
  h.renderDomainPerformance?.();
  verbMatch.renderVerbMatchRound();

  runtime.global.setTimeout(() => {
    if (!runtime.state.match.active) return;
    runtime.state.match.mismatchedCardIds = [];
    runtime.state.match.isResolving = false;
    verbMatch.renderVerbMatchRound();
  }, 300);
};
})(typeof window !== "undefined" ? window : globalThis);

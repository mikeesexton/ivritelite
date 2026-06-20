(function initIvriQuestAppMatchEngine(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const matchEngine = app.matchEngine = app.matchEngine || {};

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

matchEngine.getVisibleRows = matchEngine.getVisibleRows || function getVisibleRows() {
  const h = getHelpers();
  return h.getVisibleVerbMatchRows?.() || getRuntime().constants?.MATCH_VISIBLE_ROWS || 5;
};

matchEngine.resetBoard = matchEngine.resetBoard || function resetBoard(ctx) {
  if (!ctx) return;
  ctx.pairs = [];
  ctx.remainingPairs = [];
  ctx.leftCards = [];
  ctx.rightCards = [];
  ctx.selectedLeftId = null;
  ctx.selectedRightId = null;
  ctx.mismatchedCardIds = [];
  ctx.matchedCardIds = [];
  ctx.matchedPairIds = [];
  ctx.isResolving = false;
  ctx.nextCardId = 1;
  ctx.matchedCount = 0;
  ctx.totalPairs = 0;
  ctx.combo = 0;
  ctx.bestCombo = 0;
  ctx.mismatchCount = 0;
};

matchEngine.setup = matchEngine.setup || function setup(config) {
  const ctx = config.ctx;
  const shuffle = app.utils?.shuffle;
  const pairs = Array.isArray(config.pairs) ? config.pairs.slice() : [];
  ctx.totalPairs = pairs.length;
  ctx.matchedCount = 0;
  ctx.matchedPairIds = [];
  ctx.remainingPairs = typeof shuffle === "function" ? shuffle(pairs) : pairs;
  ctx.leftCards = [];
  ctx.rightCards = [];
  ctx.nextCardId = 1;
  ctx.selectedLeftId = null;
  ctx.selectedRightId = null;
  ctx.mismatchedCardIds = [];
  ctx.matchedCardIds = [];
  ctx.isResolving = false;
  ctx.combo = 0;
  ctx.bestCombo = 0;
  ctx.mismatchCount = 0;
  matchEngine.refillColumns(config);
};

matchEngine.refillColumns = matchEngine.refillColumns || function refillColumns(config) {
  const ctx = config.ctx;
  const shuffle = app.utils?.shuffle;
  const visibleRows = matchEngine.getVisibleRows();

  while (ctx.leftCards.length < visibleRows && ctx.remainingPairs.length) {
    const pair = ctx.remainingPairs.shift();
    if (!pair) break;

    ctx.leftCards.push({
      id: `left-${ctx.nextCardId}`,
      pairId: pair.id,
      englishText: pair.englishText,
      incoming: true,
    });
    ctx.nextCardId += 1;

    ctx.rightCards.push({
      id: `right-${ctx.nextCardId}`,
      pairId: pair.id,
      hebrewPlain: pair.valuePlain,
      hebrewNiqqud: pair.valueNiqqud || pair.valuePlain,
      incoming: true,
    });
    ctx.nextCardId += 1;
  }

  ctx.rightCards = typeof shuffle === "function" ? shuffle(ctx.rightCards) : ctx.rightCards;
};

matchEngine.renderRound = matchEngine.renderRound || function renderRound(config) {
  const runtime = getRuntime();
  const h = getHelpers();
  if (!config.isActive?.()) return;

  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid");
  h.renderSessionHeader?.();
  matchEngine.renderPrompt(config);
  matchEngine.renderCards(config);
};

matchEngine.renderPrompt = matchEngine.renderPrompt || function renderPrompt(config) {
  const runtime = getRuntime();
  const h = getHelpers();
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptText.classList.remove("hebrew");
  runtime.el.promptText.classList.add("english-prompt");
  runtime.el.promptText.textContent = config.promptText ? config.promptText() : "";
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
  app.ui?.renderPromptHint?.();
};

matchEngine.renderCards = matchEngine.renderCards || function renderCards(config) {
  const runtime = getRuntime();
  const ctx = config.ctx;
  const longLen = runtime.constants?.MATCH_LONG_LEN || 16;
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-bubble-grid");
  runtime.el.choiceContainer.classList.add("match-grid");

  const matchedSet = new Set(ctx.matchedCardIds);
  const mismatchSet = new Set(ctx.mismatchedCardIds);

  const wrap = global.document.createElement("div");
  wrap.className = "match-columns";
  wrap.setAttribute("dir", "ltr");

  const rows = Math.max(ctx.leftCards.length, ctx.rightCards.length);
  for (let idx = 0; idx < rows; idx += 1) {
    const leftCard = ctx.leftCards[idx];
    if (leftCard) {
      const btn = global.document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn match-card";
      btn.textContent = leftCard.englishText;
      if (String(leftCard.englishText || "").length > longLen) {
        btn.classList.add("match-card-long");
      }
      btn.classList.toggle("selected", ctx.selectedLeftId === leftCard.id);
      btn.classList.toggle("matched", matchedSet.has(leftCard.id));
      btn.classList.toggle("mismatch", mismatchSet.has(leftCard.id));
      btn.classList.toggle("incoming", Boolean(leftCard.incoming));
      if (leftCard.incoming) {
        btn.style.animationDelay = `${idx * 40}ms`;
      }
      btn.addEventListener("click", () => matchEngine.handleLeft(config, leftCard.id));
      wrap.append(btn);
      leftCard.incoming = false;
    }

    const rightCard = ctx.rightCards[idx];
    if (rightCard) {
      const text = runtime.state.showNiqqudInline ? rightCard.hebrewNiqqud : rightCard.hebrewPlain;
      const btn = global.document.createElement("button");
      btn.type = "button";
      btn.className = config.rightIsHebrew === false ? "choice-btn match-card" : "choice-btn match-card hebrew";
      btn.textContent = text;
      if (String(text || "").length > longLen) {
        btn.classList.add("match-card-long");
      }
      btn.classList.toggle("selected", ctx.selectedRightId === rightCard.id);
      btn.classList.toggle("matched", matchedSet.has(rightCard.id));
      btn.classList.toggle("mismatch", mismatchSet.has(rightCard.id));
      btn.classList.toggle("incoming", Boolean(rightCard.incoming));
      if (rightCard.incoming) {
        btn.style.animationDelay = `${idx * 40 + 30}ms`;
      }
      btn.addEventListener("click", () => matchEngine.handleRight(config, rightCard.id));
      wrap.append(btn);
      rightCard.incoming = false;
    }
  }

  runtime.el.choiceContainer.append(wrap);
};

matchEngine.handleLeft = matchEngine.handleLeft || function handleLeft(config, cardId) {
  const ctx = config.ctx;
  if (!config.isActive?.() || ctx.isResolving) return;
  const card = ctx.leftCards.find((item) => item.id === cardId);
  if (!card) return;

  ctx.selectedLeftId = ctx.selectedLeftId === cardId ? null : cardId;
  matchEngine.resolveSelection(config);
  matchEngine.renderRound(config);
};

matchEngine.handleRight = matchEngine.handleRight || function handleRight(config, cardId) {
  const ctx = config.ctx;
  if (!config.isActive?.() || ctx.isResolving) return;
  const card = ctx.rightCards.find((item) => item.id === cardId);
  if (!card) return;

  const shouldSpeak = !ctx.selectedLeftId && ctx.selectedRightId !== cardId;
  ctx.selectedRightId = ctx.selectedRightId === cardId ? null : cardId;
  if (shouldSpeak && ctx.selectedRightId === cardId && config.getCardSpeechPayload) {
    app.speech?.speak?.(config.getCardSpeechPayload(card));
  }
  matchEngine.resolveSelection(config);
  matchEngine.renderRound(config);
};

matchEngine.resolveSelection = matchEngine.resolveSelection || function resolveSelection(config) {
  const ctx = config.ctx;
  if (!ctx.selectedLeftId || !ctx.selectedRightId) return;

  const leftCard = ctx.leftCards.find((item) => item.id === ctx.selectedLeftId);
  const rightCard = ctx.rightCards.find((item) => item.id === ctx.selectedRightId);
  if (!leftCard || !rightCard) {
    ctx.selectedLeftId = null;
    ctx.selectedRightId = null;
    return;
  }

  if (leftCard.pairId === rightCard.pairId) {
    matchEngine.applySuccess(config, leftCard, rightCard);
    return;
  }

  matchEngine.applyMismatch(config, leftCard, rightCard);
};

matchEngine.applySuccess = matchEngine.applySuccess || function applySuccess(config, leftCard, rightCard) {
  const runtime = getRuntime();
  const h = getHelpers();
  const ctx = config.ctx;
  app.speech?.cancel?.();
  ctx.isResolving = true;
  ctx.matchedCardIds = [leftCard.id, rightCard.id];
  ctx.selectedLeftId = null;
  ctx.selectedRightId = null;
  ctx.combo += 1;
  ctx.bestCombo = Math.max(ctx.bestCombo, ctx.combo);
  runtime.state.sessionStreak += 1;
  runtime.state.sessionScore += 1;
  h.playAnswerFeedbackSound?.(true);
  config.onSuccess?.(leftCard.pairId);
  h.renderDomainPerformance?.();

  if (!ctx.matchedPairIds.includes(leftCard.pairId)) {
    ctx.matchedPairIds.push(leftCard.pairId);
  }
  ctx.matchedCount = ctx.matchedPairIds.length;
  matchEngine.renderRound(config);

  runtime.global.setTimeout(() => {
    if (!config.isActive?.()) return;
    ctx.leftCards = ctx.leftCards.filter((item) => item.id !== leftCard.id);
    ctx.rightCards = ctx.rightCards.filter((item) => item.id !== rightCard.id);
    ctx.matchedCardIds = [];
    matchEngine.refillColumns(config);
    ctx.isResolving = false;

    if (ctx.matchedCount >= ctx.totalPairs) {
      config.onAllMatched?.();
      return;
    }
    matchEngine.renderRound(config);
  }, 180);
};

matchEngine.applyMismatch = matchEngine.applyMismatch || function applyMismatch(config, leftCard, rightCard) {
  const runtime = getRuntime();
  const h = getHelpers();
  const ctx = config.ctx;
  app.speech?.cancel?.();
  ctx.isResolving = true;
  ctx.combo = 0;
  runtime.state.sessionStreak = 0;
  ctx.mismatchCount += 1;
  ctx.mismatchedCardIds = [leftCard.id, rightCard.id];
  ctx.selectedLeftId = null;
  ctx.selectedRightId = null;
  h.playAnswerFeedbackSound?.(false);
  config.onMismatch?.(leftCard.pairId, rightCard.pairId);
  h.renderDomainPerformance?.();
  matchEngine.renderRound(config);

  runtime.global.setTimeout(() => {
    if (!config.isActive?.()) return;
    ctx.mismatchedCardIds = [];
    ctx.isResolving = false;
    matchEngine.renderRound(config);
  }, 300);
};
})(typeof window !== "undefined" ? window : globalThis);

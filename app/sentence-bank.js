(function initIvriQuestAppSentenceBank(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const sentenceBank = app.sentenceBank = app.sentenceBank || {};
let activeSentenceDrag = null;
let activeSentenceTouchDrag = null;
let suppressSentenceTapUntil = 0;
let sentenceDragGhostEl = null;
const SENTENCE_DRAG_ACTIVATE_PX = 8;

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function getSession() {
  return app.session || {};
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

function getNowMs() {
  return Number(global.Date?.now ? global.Date.now() : Date.now());
}

function clampDifficulty(value) {
  const next = Math.round(Number(value || 1));
  return Math.max(1, Math.min(3, next));
}

function sanitizeTokenList(tokens) {
  return (Array.isArray(tokens) ? tokens : [])
    .map((token) => String(token || "").trim())
    .filter(Boolean);
}

function sanitizeAnswerVariants(variants, targetTokens) {
  const targetLength = sanitizeTokenList(targetTokens).length;
  const seen = new Set();

  return (Array.isArray(variants) ? variants : [])
    .map((variant) => {
      if (Array.isArray(variant)) {
        const tokens = sanitizeTokenList(variant);
        return tokens.length ? { text: "", tokens } : null;
      }
      if (!variant || typeof variant !== "object") return null;
      const tokens = sanitizeTokenList(variant.tokens || variant.tokenList);
      if (!tokens.length) return null;
      return {
        text: String(variant.text || "").trim(),
        textNiqqud: String(variant.textNiqqud || variant.text_niqqud || "").trim(),
        tokens,
      };
    })
    .filter((variant) => variant && variant.tokens.length === targetLength)
    .filter((variant) => {
      const key = JSON.stringify(variant.tokens);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const NON_DISTINCT_DISTRACTOR_GROUPS = [
  ["איך", "כיצד"],
  ["אך", "אבל"],
  ["about", "on"],
  ["accurate", "correct"],
  ["but", "however"],
  ["hold on", "wait", "wait up"],
  ["מדויק", "נכון"],
  ["מדויקת", "נכונה"],
  ["מדויקים", "נכונים"],
  ["מדויקות", "נכונות"],
];

const NON_DISTINCT_DISTRACTOR_INDEX = new Map();
NON_DISTINCT_DISTRACTOR_GROUPS.forEach((group, groupIndex) => {
  group.forEach((token) => {
    NON_DISTINCT_DISTRACTOR_INDEX.set(String(token || "").trim().toLowerCase(), groupIndex);
  });
});

function normalizeComparableToken(token) {
  return String(token || "").trim().toLowerCase();
}

function sentenceTokenDisplayText(token) {
  if (!token) return "";
  const showNiqqud = getRuntime().state?.showNiqqudInline;
  return showNiqqud && token.display ? token.display : token.text;
}

function isNonDistinctDistractor(targetToken, distractorToken) {
  const targetGroup = NON_DISTINCT_DISTRACTOR_INDEX.get(normalizeComparableToken(targetToken));
  const distractorGroup = NON_DISTINCT_DISTRACTOR_INDEX.get(normalizeComparableToken(distractorToken));
  return targetGroup !== undefined && targetGroup === distractorGroup;
}

function sanitizeDistractors(tokens, targetTokens) {
  const targetSet = new Set(targetTokens.map((token) => String(token || "").trim()));
  const seen = new Set();
  return sanitizeTokenList(tokens).filter((token) => {
    if (targetSet.has(token) || seen.has(token)) return false;
    if (targetTokens.some((targetToken) => isNonDistinctDistractor(targetToken, token))) return false;
    seen.add(token);
    return true;
  });
}

function isAttachableSentenceSuffix(text) {
  const trimmed = String(text || "").trim();
  return Boolean(trimmed) && /^[,.;:!?…)\]"'׳״-]+$/.test(trimmed);
}

function buildSentenceFrame(sentenceText, targetTokens) {
  const fullText = String(sentenceText || "");
  const tokens = sanitizeTokenList(targetTokens);
  const pieces = [];
  let cursor = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const tokenText = tokens[index];
    const tokenIndex = fullText.indexOf(tokenText, cursor);
    if (tokenIndex === -1) {
      return {
        pieces: tokens.map((token, tokenIndexFallback) => ({
          beforeText: tokenIndexFallback === 0 ? "" : " ",
          tokenText: token,
          afterText: "",
        })),
        trailingText: "",
      };
    }
    const separatorText = fullText.slice(cursor, tokenIndex);
    const previousPiece = pieces[pieces.length - 1] || null;
    const shouldAttachSeparator = previousPiece && isAttachableSentenceSuffix(separatorText);
    pieces.push({
      beforeText: shouldAttachSeparator ? "" : separatorText,
      tokenText,
      afterText: "",
    });
    if (shouldAttachSeparator) {
      previousPiece.afterText = `${previousPiece.afterText || ""}${separatorText}`;
    }
    cursor = tokenIndex + tokenText.length;
  }

  let trailingText = fullText.slice(cursor);
  if (pieces.length && isAttachableSentenceSuffix(trailingText)) {
    pieces[pieces.length - 1].afterText = `${pieces[pieces.length - 1].afterText || ""}${trailingText}`;
    trailingText = "";
  }

  return {
    pieces,
    trailingText,
  };
}

function hasHebrewText(text) {
  return /[\u0590-\u05ff]/.test(String(text || ""));
}

function normalizeSentenceMeaningKey(token) {
  const value = String(token || "").trim();
  if (!value) return "";
  if (hasHebrewText(value)) {
    const stripped = app.hebrew?.stripNiqqud ? app.hebrew.stripNiqqud(value) : value;
    return app.hebrew?.normalizeHebrewToMedial
      ? app.hebrew.normalizeHebrewToMedial(stripped).trim()
      : stripped.trim();
  }
  return value
    .replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "")
    .toLowerCase();
}

function sanitizeMeaningText(text) {
  const sanitizeEnglishText = app.utils?.sanitizeEnglishDisplayText;
  return typeof sanitizeEnglishText === "function"
    ? sanitizeEnglishText(text)
    : String(text || "").trim();
}

function addSentenceMeaningEntry(lookup, token, meaning) {
  const key = normalizeSentenceMeaningKey(token);
  const cleanMeaning = sanitizeMeaningText(meaning);
  if (!key || !cleanMeaning) return;
  if (!lookup.has(key)) {
    lookup.set(key, []);
  }
  const variants = lookup.get(key);
  if (!variants.includes(cleanMeaning)) {
    variants.push(cleanMeaning);
  }
}

function buildSentenceMeaningLookup() {
  const runtime = getRuntime();
  if (runtime.sentenceBankMeaningLookup) {
    return runtime.sentenceBankMeaningLookup;
  }

  const lookup = new Map();
  (runtime.baseVocabulary || []).forEach((word) => {
    addSentenceMeaningEntry(lookup, word?.he, word?.en);
    addSentenceMeaningEntry(lookup, word?.heNiqqud, word?.en);
  });

  (runtime.verbFormDeck || []).forEach((entry) => {
    (entry?.forms || []).forEach((form) => {
      addSentenceMeaningEntry(lookup, form?.valuePlain, form?.englishText);
      addSentenceMeaningEntry(lookup, form?.valueNiqqud, form?.englishText);
    });
  });

  runtime.sentenceBankMeaningLookup = lookup;
  return lookup;
}

function resolveSentenceTokenMeaning(token) {
  const variants = buildSentenceMeaningLookup().get(normalizeSentenceMeaningKey(token)) || [];
  return variants.slice(0, 2).join(" / ");
}

function buildEmptySentenceSlots(length) {
  return Array.from({ length: Math.max(0, Number(length || 0)) }, () => "");
}

function normalizeSentenceSlotIndex(index, max) {
  if (index === null || index === undefined || index === "") {
    return null;
  }
  const next = Number(index);
  return Number.isInteger(next) && next >= 0 && next < max ? next : null;
}

function normalizeQuestionState(question) {
  if (!question || typeof question !== "object") return null;

  const targetLength = Array.isArray(question.targetTokens) ? question.targetTokens.length : 0;
  const validIds = new Set((question.bankTokens || []).map((token) => String(token?.id || "").trim()).filter(Boolean));
  let slotTokenIds = Array.isArray(question.slotTokenIds)
    ? question.slotTokenIds.map((tokenId) => String(tokenId || "").trim())
    : Array.isArray(question.placedBankTokenIds)
      ? question.placedBankTokenIds.map((tokenId) => String(tokenId || "").trim())
      : [];

  if (slotTokenIds.length < targetLength) {
    slotTokenIds = slotTokenIds.concat(buildEmptySentenceSlots(targetLength - slotTokenIds.length));
  } else if (slotTokenIds.length > targetLength) {
    slotTokenIds = slotTokenIds.slice(0, targetLength);
  }

  const usedTokenIds = new Set();
  slotTokenIds = slotTokenIds.map((tokenId) => {
    if (!tokenId || !validIds.has(tokenId) || usedTokenIds.has(tokenId)) {
      return "";
    }
    usedTokenIds.add(tokenId);
    return tokenId;
  });

  question.slotTokenIds = slotTokenIds;
  question.placedBankTokenIds = slotTokenIds.filter(Boolean);

  const selectedBankTokenId = String(question.selectedBankTokenId || "").trim();
  question.selectedBankTokenId = selectedBankTokenId && validIds.has(selectedBankTokenId) && !usedTokenIds.has(selectedBankTokenId)
    ? selectedBankTokenId
    : "";

  const selectedSlotIndex = normalizeSentenceSlotIndex(question.selectedSlotIndex, targetLength);
  question.selectedSlotIndex = selectedSlotIndex !== null && !slotTokenIds[selectedSlotIndex]
    ? selectedSlotIndex
    : null;

  question.wasLastAnswerCorrect = question.wasLastAnswerCorrect === true;

  return question;
}

function getQuestionSlotTokenIds(question) {
  return normalizeQuestionState(question)?.slotTokenIds || [];
}

function getSlottedTokens(question) {
  return getQuestionSlotTokenIds(question)
    .map((tokenId) => tokenId ? getQuestionTokenById(question, tokenId) : null);
}

function getFilledSlotCount(question) {
  return getQuestionSlotTokenIds(question).filter(Boolean).length;
}

function getPlacedAnswerTokens(question) {
  return getSlottedTokens(question).map((token) => String(token?.text || "").trim());
}

function getNextEmptySlotIndex(question) {
  return getQuestionSlotTokenIds(question).findIndex((tokenId) => !tokenId);
}

function clearQuestionSelection(question) {
  if (!question) return;
  question.selectedBankTokenId = "";
  question.selectedSlotIndex = null;
}

function syncQuestionSlotState(question, slotTokenIds) {
  if (!question) return;
  question.slotTokenIds = slotTokenIds;
  question.placedBankTokenIds = slotTokenIds.filter(Boolean);
}

function placeTokenInSlotInternal(question, tokenId, slotIndex) {
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedSlotIndex = normalizeSentenceSlotIndex(slotIndex, slotTokenIds.length);
  if (normalizedSlotIndex === null || slotTokenIds[normalizedSlotIndex]) return false;
  if (!getQuestionTokenById(question, tokenId) || slotTokenIds.includes(tokenId)) return false;
  slotTokenIds[normalizedSlotIndex] = tokenId;
  syncQuestionSlotState(question, slotTokenIds);
  return true;
}

function movePlacedTokenInternal(question, fromIndex, toIndex) {
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedFromIndex = normalizeSentenceSlotIndex(fromIndex, slotTokenIds.length);
  const normalizedToIndex = normalizeSentenceSlotIndex(toIndex, slotTokenIds.length);
  if (normalizedFromIndex === null || normalizedToIndex === null || normalizedFromIndex === normalizedToIndex) {
    return false;
  }
  if (!slotTokenIds[normalizedFromIndex] || slotTokenIds[normalizedToIndex]) return false;
  slotTokenIds[normalizedToIndex] = slotTokenIds[normalizedFromIndex];
  slotTokenIds[normalizedFromIndex] = "";
  syncQuestionSlotState(question, slotTokenIds);
  return true;
}

function canInsertTokenAtSlot(question, tokenId, slotIndex, options = {}) {
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedSlotIndex = normalizeSentenceSlotIndex(slotIndex, slotTokenIds.length);
  const normalizedFromIndex = normalizeSentenceSlotIndex(options.fromIndex, slotTokenIds.length);
  if (normalizedSlotIndex === null || !getQuestionTokenById(question, tokenId)) {
    return false;
  }

  if (normalizedFromIndex !== null) {
    return Boolean(slotTokenIds[normalizedFromIndex]) && slotTokenIds[normalizedFromIndex] === tokenId && normalizedFromIndex !== normalizedSlotIndex;
  }

  return !slotTokenIds.includes(tokenId);
}

function insertTokenAtSlotInternal(question, tokenId, slotIndex, options = {}) {
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedSlotIndex = normalizeSentenceSlotIndex(slotIndex, slotTokenIds.length);
  const normalizedFromIndex = normalizeSentenceSlotIndex(options.fromIndex, slotTokenIds.length);
  if (!canInsertTokenAtSlot(question, tokenId, normalizedSlotIndex, { fromIndex: normalizedFromIndex })) {
    return false;
  }

  const nextSlotTokenIds = [...slotTokenIds];
  if (normalizedFromIndex !== null) {
    nextSlotTokenIds[normalizedFromIndex] = "";
  }

  let carry = tokenId;
  for (let index = normalizedSlotIndex; index < nextSlotTokenIds.length; index += 1) {
    const displaced = nextSlotTokenIds[index];
    nextSlotTokenIds[index] = carry;
    carry = displaced;
    if (!carry) break;
  }

  syncQuestionSlotState(question, nextSlotTokenIds);
  return true;
}

function buildSentenceSlotAriaLabel(question, slotIndex, token) {
  const total = Math.max(0, Number(question?.targetTokens?.length || 0));
  if (token?.text) {
    return `Sentence slot ${slotIndex + 1} of ${total}, filled with ${token.text}.`;
  }
  return `Sentence slot ${slotIndex + 1} of ${total}, empty.`;
}

function buildSentenceSlotAriaDescription(question, token) {
  if (token?.text) {
    return question?.selectedBankTokenId
      ? "Press Enter to insert the selected word here and shift later words forward, or press Backspace to remove this word."
      : "Press Backspace to remove this word.";
  }

  return question?.selectedBankTokenId
    ? "Press Enter to place the selected word here."
    : "Activate to choose this blank.";
}

function buildSentenceBankTokenAriaLabel(token) {
  return `Answer bank word ${String(token?.text || "").trim()}.`;
}

function buildSentenceBankTokenAriaDescription(isSelected) {
  return isSelected
    ? "Selected. Press Escape to cancel, then move to a blank and press Enter to place it or to a filled slot to insert it."
    : "Press Space to select this word for keyboard placement, or activate it to place it in the next blank.";
}

function isEquivalentSentenceTokenOrder(expectedTokens, actualTokens) {
  if (!Array.isArray(expectedTokens) || !Array.isArray(actualTokens) || expectedTokens.length !== actualTokens.length) {
    return false;
  }

  for (let index = 0; index < expectedTokens.length; index += 1) {
    if (expectedTokens[index] !== actualTokens[index]) return false;
  }
  return true;
}

function buildSingleWordDifference(question) {
  const expected = (question?.targetTokens || []).map((token) => String(token || "").trim());
  const actual = getPlacedAnswerTokens(question);
  if (expected.length !== actual.length || !expected.length) return null;

  let mismatchIndex = null;
  for (let index = 0; index < expected.length; index += 1) {
    if (expected[index] === actual[index]) continue;
    if (mismatchIndex !== null) return null;
    mismatchIndex = index;
  }

  if (mismatchIndex === null || !actual[mismatchIndex]) return null;
  return {
    correctWord: expected[mismatchIndex],
    chosenWord: actual[mismatchIndex],
  };
}

function buildSingleWordMeaningTip(question) {
  const difference = buildSingleWordDifference(question);
  if (!difference) return "";

  const correctMeaning = resolveSentenceTokenMeaning(difference.correctWord);
  const chosenMeaning = resolveSentenceTokenMeaning(difference.chosenWord);
  if (!correctMeaning || !chosenMeaning) return "";

  return translate("feedback.sentenceBankSingleWordTip", {
    correctWord: difference.correctWord,
    correctMeaning,
    chosenWord: difference.chosenWord,
    chosenMeaning,
  });
}

function buildSingleWordMeaningFeedbackItems(question) {
  const difference = buildSingleWordDifference(question);
  if (!difference) return [];

  const correctMeaning = resolveSentenceTokenMeaning(difference.correctWord);
  const chosenMeaning = resolveSentenceTokenMeaning(difference.chosenWord);
  if (!correctMeaning || !chosenMeaning) return [];

  const answerIsHebrew = Boolean(question?.answerIsHebrew);
  const answerLanguage = answerIsHebrew ? "he" : "en";
  const answerDirection = answerIsHebrew ? "rtl" : "ltr";
  return [
    {
      label: translate("feedback.correctWordLabel"),
      value: difference.correctWord,
      dir: answerDirection,
      lang: answerLanguage,
      meta: correctMeaning,
      metaDir: "ltr",
      metaLang: "en",
    },
    {
      label: translate("feedback.chosenWordLabel"),
      value: difference.chosenWord,
      dir: answerDirection,
      lang: answerLanguage,
      meta: chosenMeaning,
      metaDir: "ltr",
      metaLang: "en",
    },
  ];
}

function setSentenceDragPayload(payload) {
  activeSentenceDrag = payload && typeof payload === "object" ? { ...payload } : null;
}

function clearSentenceDragPayload() {
  activeSentenceDrag = null;
}

function resolveDragPayloadText(question, payload) {
  const token = payload?.tokenId ? getQuestionTokenById(question, payload.tokenId) : null;
  return String(sentenceTokenDisplayText(token) || "").trim();
}

function createSentenceDragGhostEl(text, isHebrew) {
  const doc = global.document;
  if (!doc?.body || !text) return null;
  const ghost = doc.createElement("div");
  ghost.className = `sentence-drag-ghost ${isHebrew ? "hebrew" : ""}`.trim();
  ghost.setAttribute("dir", isHebrew ? "rtl" : "ltr");
  ghost.setAttribute("aria-hidden", "true");
  ghost.textContent = text;
  return ghost;
}

function positionSentenceDragGhost(point) {
  if (!sentenceDragGhostEl || !point) return;
  sentenceDragGhostEl.style.left = `${point.clientX}px`;
  sentenceDragGhostEl.style.top = `${point.clientY}px`;
}

function showSentenceTouchDragGhost(text, isHebrew, point) {
  removeSentenceDragGhost();
  const ghost = createSentenceDragGhostEl(text, isHebrew);
  if (!ghost) return;
  global.document.body.appendChild(ghost);
  sentenceDragGhostEl = ghost;
  positionSentenceDragGhost(point);
}

function removeSentenceDragGhost() {
  if (sentenceDragGhostEl && typeof sentenceDragGhostEl.remove === "function") {
    sentenceDragGhostEl.remove();
  }
  sentenceDragGhostEl = null;
}

function applyMouseDragImage(event, text, isHebrew) {
  if (!event?.dataTransfer?.setDragImage) return;
  const ghost = createSentenceDragGhostEl(text, isHebrew);
  if (!ghost) return;
  ghost.classList.add("sentence-drag-ghost--mouse");
  ghost.style.left = "-1000px";
  ghost.style.top = "-1000px";
  removeSentenceDragGhost();
  global.document.body.appendChild(ghost);
  sentenceDragGhostEl = ghost;
  const removeGhost = () => {
    if (sentenceDragGhostEl === ghost) sentenceDragGhostEl = null;
    if (typeof ghost.remove === "function") ghost.remove();
  };
  let applied = false;
  try {
    event.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2);
    applied = true;
  } catch {}
  if (!applied) {
    removeGhost();
    return;
  }
  if (typeof global.requestAnimationFrame === "function") {
    global.requestAnimationFrame(removeGhost);
  }
  if (typeof global.setTimeout === "function") {
    global.setTimeout(removeGhost, 100);
  } else if (typeof global.requestAnimationFrame !== "function") {
    removeGhost();
  }
}

function suppressSentenceTap(durationMs = 400) {
  suppressSentenceTapUntil = getNowMs() + Math.max(0, Number(durationMs || 0));
}

function shouldSuppressSentenceTap() {
  return suppressSentenceTapUntil > getNowMs();
}

function clearSentenceTouchDragTargets() {
  getRuntime().el?.choiceContainer?.querySelectorAll?.(".sentence-slot").forEach((slot) => {
    slot.classList.remove("drag-target");
    slot.classList.remove("insert-target");
  });
}

function clearSentenceDragState() {
  activeSentenceTouchDrag = null;
  removeSentenceDragGhost();
  clearSentenceTouchDragTargets();
  clearSentenceDragPayload();
}

function resolveSentenceTouchSlotElement(clientX, clientY) {
  const pointedNode = global.document?.elementFromPoint?.(clientX, clientY);
  if (!pointedNode) return null;
  if (pointedNode.classList?.contains?.("sentence-slot")) return pointedNode;
  return typeof pointedNode.closest === "function" ? pointedNode.closest(".sentence-slot") : null;
}

function updateSentenceTouchDragTarget(question, touchPoint) {
  clearSentenceTouchDragTargets();
  if (!question || question.locked || !touchPoint) return null;
  const slot = resolveSentenceTouchSlotElement(touchPoint.clientX, touchPoint.clientY);
  if (!slot) return null;

  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedSlotIndex = normalizeSentenceSlotIndex(slot.getAttribute?.("data-slot-index"), slotTokenIds.length);
  const payload = activeSentenceTouchDrag?.payload || activeSentenceDrag;
  if (normalizedSlotIndex === null || !canDropSentencePayload(question, normalizedSlotIndex, payload)) {
    return null;
  }

  const slotIsOccupied = Boolean(slotTokenIds[normalizedSlotIndex]);
  slot.classList.toggle("insert-target", slotIsOccupied);
  slot.classList.toggle("drag-target", !slotIsOccupied);
  if (activeSentenceTouchDrag) {
    activeSentenceTouchDrag.slotIndex = normalizedSlotIndex;
  }
  return {
    slot,
    slotIndex: normalizedSlotIndex,
  };
}

function startSentenceTouchDrag(question, payload, touchPoint) {
  if (!question || question.locked || !payload) return;
  clearQuestionSelection(question);
  activeSentenceTouchDrag = {
    payload: { ...payload },
    slotIndex: null,
    activated: false,
    startPoint: touchPoint ? { x: touchPoint.clientX, y: touchPoint.clientY } : null,
    ghostText: resolveDragPayloadText(question, payload),
    isHebrew: Boolean(question.answerIsHebrew),
  };
  setSentenceDragPayload(payload);
}

function handleSentenceTouchMove(question, event) {
  if (!activeSentenceTouchDrag?.payload) return;
  const touchPoint = event?.touches?.[0];
  if (!touchPoint) return;
  if (!activeSentenceTouchDrag.activated) {
    const start = activeSentenceTouchDrag.startPoint;
    const dx = start ? touchPoint.clientX - start.x : SENTENCE_DRAG_ACTIVATE_PX;
    const dy = start ? touchPoint.clientY - start.y : SENTENCE_DRAG_ACTIVATE_PX;
    if ((dx * dx) + (dy * dy) < (SENTENCE_DRAG_ACTIVATE_PX * SENTENCE_DRAG_ACTIVATE_PX)) {
      return;
    }
    activeSentenceTouchDrag.activated = true;
    showSentenceTouchDragGhost(activeSentenceTouchDrag.ghostText, activeSentenceTouchDrag.isHebrew, touchPoint);
  }
  positionSentenceDragGhost(touchPoint);
  updateSentenceTouchDragTarget(question, touchPoint);
  event.preventDefault?.();
}

function finishSentenceTouchDrag(question, event) {
  if (!activeSentenceTouchDrag?.payload) return false;
  if (!activeSentenceTouchDrag.activated) {
    clearSentenceDragState();
    return false;
  }
  const touchPoint = event?.changedTouches?.[0] || event?.touches?.[0] || null;
  const activeTarget = updateSentenceTouchDragTarget(question, touchPoint);
  const handled = activeTarget
    ? sentenceBank.handleSlotDrop(activeTarget.slotIndex, activeSentenceTouchDrag.payload)
    : false;
  if (handled) {
    event.preventDefault?.();
    suppressSentenceTap();
  } else {
    clearSentenceDragState();
  }
  return handled;
}

function resolveSentenceDragPayload(event) {
  if (event?.dataTransfer?.getData) {
    const raw = event.dataTransfer.getData("application/x-ivriquest-sentence-token");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return activeSentenceDrag;
      }
    }
  }
  return activeSentenceDrag;
}

function canDropSentencePayload(question, slotIndex, payload) {
  if (!question || question.locked) return false;
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedSlotIndex = normalizeSentenceSlotIndex(slotIndex, slotTokenIds.length);
  if (normalizedSlotIndex === null) return false;
  if (payload?.type === "bank") {
    return canInsertTokenAtSlot(question, payload.tokenId, normalizedSlotIndex);
  }
  if (payload?.type === "slot") {
    return canInsertTokenAtSlot(question, payload.tokenId, normalizedSlotIndex, { fromIndex: payload.slotIndex });
  }
  return false;
}

function rewriteSentenceNoteForGame(note) {
  const cleanNote = String(note || "")
    .replace(/\s+/g, " ")
    .replace(/\u2014/g, " - ")
    .trim();
  if (!cleanNote) return "";

  const hasGender = /gender swap|gender distractor|agrees with|masculine|feminine|masc\.|fem\./i.test(cleanNote);
  const hasOpposites = /semantic opposites|opposite pair/i.test(cleanNote);
  const hasFormal = /\bformal\b|\bprofessional\b|\bacademic\b|\bregister\b/i.test(cleanNote);
  const hasCasual = /\bslang\b|\bcasual\b|\bcolloquial\b|\bwhatsapp\b|borrowed from arabic|borrowed from yiddish/i.test(cleanNote);
  const hasLiteral = /\bliterally\b/i.test(cleanNote);
  const hasUrgency = /\burgency\b|\bimpatient\b|on my way right now|already coming/i.test(cleanNote);
  const hasAttachment = /\bcontraction\b|\bcombines the conjunction\b|\battached directly\b|\bsuffix\b|\bprefix\b/i.test(cleanNote);
  const hasChunk = /\bcommon phrase\b|\bstatus idiom\b|\bset phrase\b|\bexpression\b|\bvery common\b/i.test(cleanNote);
  const hasVocabularyFocus = /\bvocabulary\b/i.test(cleanNote);
  const hasContrast = /\bvs\b|contrasting|distractor pair|distractors?:/i.test(cleanNote);
  const sentences = [];

  if (hasFormal) {
    sentences.push("This one uses a more formal tone.");
  } else if (hasCasual) {
    sentences.push("This one is casual Hebrew.");
  }

  if (hasGender) {
    sentences.push("Watch the gender match here.");
  } else if (hasOpposites) {
    sentences.push("One extra word flips the meaning here.");
  } else if (hasLiteral) {
    sentences.push("Don't go by the literal wording.");
  } else if (hasAttachment) {
    sentences.push("Watch the small attached pieces here.");
  } else if (hasUrgency) {
    sentences.push("This one sounds quick and urgent.");
  } else if (hasChunk) {
    sentences.push("Try to hear it as one natural phrase.");
  } else if (hasVocabularyFocus) {
    sentences.push("Watch the key word choice here.");
  } else if (hasContrast) {
    sentences.push(hasFormal
      ? "Pick the more polished wording."
      : "Watch the difference between the close choices.");
  }

  if (sentences.length === 1) {
    if (hasFormal) {
      sentences.push("Pick the more polished wording.");
    } else if (hasCasual) {
      sentences.push(hasLiteral ? "Don't go by the literal wording." : "Go with the everyday meaning.");
    }
  }

  return sentences.length ? sentences.slice(0, 2).join(" ") : "Watch the wording closely here.";
}

function buildSentenceClinicNote(note) {
  const cleanNote = String(note || "")
    .replace(/\s+/g, " ")
    .replace(/\u2014/g, " - ")
    .trim();
  if (!cleanNote) return "";
  if (/^(watch|remember|try|pick|use|go with|don't)\b/i.test(cleanNote)) return cleanNote;
  return rewriteSentenceNoteForGame(cleanNote);
}

function buildSentenceFeedbackDetail(question, isCorrect) {
  if (isCorrect) return "";
  return buildSingleWordMeaningTip(question);
}

function buildStructuredSentenceFeedback(question, isCorrect, correctAnswer) {
  const answerIsHebrew = question?.direction !== "he2en";
  const items = [
    {
      label: translate(
        question?.direction === "listen"
          ? "feedback.heardLabel"
          : answerIsHebrew
            ? "feedback.hebrewSentenceLabel"
            : "feedback.englishSentenceLabel"
      ),
      value: correctAnswer,
      dir: answerIsHebrew ? "rtl" : "ltr",
      lang: answerIsHebrew ? "he" : "en",
    },
  ];

  if (question?.direction === "listen") {
    items.push({
      label: translate("feedback.meaningLabel"),
      value: question?.sentence?.english,
      dir: "ltr",
      lang: "en",
    });
  }

  if (!isCorrect) {
    items.push(...buildSingleWordMeaningFeedbackItems(question));
  }

  return {
    result: translate(isCorrect ? "feedback.correctResult" : "feedback.wrongResult"),
    items,
  };
}

function normalizeSentenceDirection(direction) {
  return direction === "en2he" || direction === "listen" ? direction : "he2en";
}

function buildSentenceProgressKey(sentenceId, direction) {
  return `${String(sentenceId || "").trim()}::${normalizeSentenceDirection(direction)}`;
}

function getQuestionKey(question) {
  return buildSentenceProgressKey(question?.sentence?.id, question?.direction);
}

function getSentenceProgressRecord(sentenceId, direction) {
  const runtime = getRuntime();
  const key = buildSentenceProgressKey(sentenceId, direction);
  const existing = runtime.state.sentenceProgress[key] || {};
  const attempts = Math.max(0, Number(existing.attempts || 0));
  const correct = Math.max(0, Math.min(attempts, Number(existing.correct || 0)));
  const explicitMisses = Number(existing.misses);
  const misses = Number.isFinite(explicitMisses) && explicitMisses >= 0
    ? Math.round(explicitMisses)
    : Math.max(0, attempts - correct);

  return {
    attempts: 0,
    correct: 0,
    level: 0,
    nextDue: 0,
    lastSeen: 0,
    misses: 0,
    ...existing,
    attempts,
    correct,
    misses,
  };
}

function setSentenceProgressRecord(sentenceId, direction, record) {
  const runtime = getRuntime();
  runtime.state.sentenceProgress[buildSentenceProgressKey(sentenceId, direction)] = record;
}

sentenceBank.getWorstSentences = sentenceBank.getWorstSentences || function getWorstSentences(limit = 5) {
  const runtime = getRuntime();
  const deckById = new Map((runtime.sentenceBankDeck || []).map((sentence) => [sentence.id, sentence]));
  const entries = [];
  Object.entries(runtime.state.sentenceProgress || {}).forEach(([key, raw]) => {
    const [sentenceId, direction] = String(key).split("::");
    const sentence = deckById.get(sentenceId);
    if (!sentence) return;
    const rec = getSentenceProgressRecord(sentenceId, direction);
    if (rec.attempts < 2 || rec.misses < 1) return;
    entries.push({
      sentence,
      direction: normalizeSentenceDirection(direction),
      attempts: rec.attempts,
      correct: rec.correct,
      misses: rec.misses,
      missRate: rec.misses / rec.attempts,
    });
  });
  entries.sort((a, b) => {
    if (a.missRate !== b.missRate) return b.missRate - a.missRate;
    if (a.misses !== b.misses) return b.misses - a.misses;
    return String(a.sentence.hebrew).localeCompare(String(b.sentence.hebrew), "he");
  });
  return entries.slice(0, Math.max(0, limit));
};

sentenceBank.getPracticedSentenceCount = sentenceBank.getPracticedSentenceCount || function getPracticedSentenceCount() {
  const runtime = getRuntime();
  const deckIds = new Set((runtime.sentenceBankDeck || []).map((sentence) => sentence.id));
  const practiced = new Set();
  Object.entries(runtime.state.sentenceProgress || {}).forEach(([key, raw]) => {
    const sentenceId = String(key).split("::")[0];
    if (!deckIds.has(sentenceId)) return;
    if (Math.max(0, Number(raw?.attempts || 0)) > 0) practiced.add(sentenceId);
  });
  return practiced.size;
};

function updateSentenceProgress(sentenceId, direction, isCorrect) {
  const runtime = getRuntime();
  const record = getSentenceProgressRecord(sentenceId, direction);
  const now = Date.now();
  const intervals = runtime.constants.LEITNER_INTERVALS || [0];
  const maxLevel = Math.max(0, intervals.length - 1);

  record.attempts += 1;
  record.lastSeen = now;

  if (isCorrect) {
    record.correct += 1;
    record.level = Math.min(maxLevel, record.level + 1);
    const interval = Math.max(0, Number(intervals[record.level] || 0));
    const intervalBoost = direction === "en2he" ? 1.15 : 1;
    record.nextDue = now + Math.round(interval * intervalBoost);
  } else {
    record.misses = Math.max(0, Number(record.misses || 0)) + 1;
    record.level = Math.max(0, record.level - 1);
    record.nextDue = now + (direction === "en2he" ? 60 * 1000 : 2 * 60 * 1000);
  }

  setSentenceProgressRecord(sentenceId, direction, record);
}

function getDuePairs(pairs, now = Date.now()) {
  return pairs.filter((pair) => {
    const record = getSentenceProgressRecord(pair.sentence.id, pair.direction);
    return record.attempts === 0 || record.nextDue <= now;
  });
}

const SENTENCE_BANK_MAX_TILES = 12;
const SENTENCE_BANK_MIN_DISTRACTORS = 3;

function getAlternateRequiredDistractors(sentence, direction, targetTokens) {
  if (direction === "listen") return new Set();
  const alternates = direction === "en2he" ? sentence?.hebrewAlternates : sentence?.englishAlternates;
  if (!Array.isArray(alternates) || !alternates.length) return new Set();
  const targetSet = new Set(targetTokens);
  const required = new Set();
  alternates.forEach((variant) => {
    sanitizeTokenList(variant?.tokens).forEach((token) => {
      if (!targetSet.has(token)) required.add(token);
    });
  });
  return required;
}

function capSentenceBankDistractors(targetTokens, distractorTokens, sentence, direction, doShuffle) {
  const available = distractorTokens.length;
  if (!available) return distractorTokens;
  const cap = Math.max(
    SENTENCE_BANK_MIN_DISTRACTORS,
    Math.min(available, SENTENCE_BANK_MAX_TILES - targetTokens.length)
  );
  const shuffled = doShuffle(distractorTokens);
  if (cap >= available) return shuffled;

  const required = getAlternateRequiredDistractors(sentence, direction, targetTokens);
  const kept = shuffled.filter((token) => required.has(token));
  for (const token of shuffled) {
    if (kept.length >= cap) break;
    if (!required.has(token)) kept.push(token);
  }
  return kept;
}

function buildQuestionFromPair(pair, options = {}) {
  const shuffle = app.utils?.shuffle;
  const doShuffle = typeof shuffle === "function" ? shuffle : (items) => [...items];
  const sentence = pair?.sentence;
  const direction = normalizeSentenceDirection(pair?.direction);
  if (!sentence) return null;

  const answerIsHebrew = direction !== "he2en";
  const targetTokens = answerIsHebrew
    ? [...sentence.hebrewTokens]
    : [...sentence.englishTokens];
  const distractorTokens = capSentenceBankDistractors(
    targetTokens,
    answerIsHebrew ? [...sentence.hebrewDistractors] : [...sentence.englishDistractors],
    sentence,
    direction,
    doShuffle
  );
  const niqqudByToken = answerIsHebrew && sentence.hebrewNiqqudByToken ? sentence.hebrewNiqqudByToken : null;
  const tokenDisplay = (text) => (niqqudByToken && niqqudByToken[text]) || text;
  const bankTokens = doShuffle([
    ...targetTokens.map((text, index) => ({ id: `answer-${index}`, text, display: tokenDisplay(text), isCorrect: true })),
    ...distractorTokens.map((text, index) => ({ id: `distractor-${index}`, text, display: tokenDisplay(text), isCorrect: false })),
  ]);

  return {
    sentence: { ...sentence },
    emoji: sentence.emoji || "",
    direction,
    questionKey: buildSentenceProgressKey(sentence.id, direction),
    promptLabel: translate(
      direction === "listen"
        ? "prompt.shemaListen"
        : options.isReview
          ? direction === "en2he" ? "prompt.reviewToHebrew" : "prompt.reviewToEnglish"
          : direction === "en2he" ? "prompt.toHebrew" : "prompt.toEnglish"
    ),
    prompt: direction === "en2he" ? sentence.english : sentence.hebrew,
    promptNiqqud: direction === "he2en" ? sentence.hebrewNiqqud || "" : "",
    promptIsHebrew: direction === "he2en",
    optionsAreHebrew: answerIsHebrew,
    answerIsHebrew,
    targetTokens,
    bankTokens,
    slotTokenIds: buildEmptySentenceSlots(targetTokens.length),
    placedBankTokenIds: [],
    selectedBankTokenId: "",
    selectedSlotIndex: null,
    wasLastAnswerCorrect: false,
    scoreValue: direction === "he2en" ? sentence.difficulty : sentence.difficulty + 1,
    isReview: options.isReview === true,
    locked: false,
  };
}

function getQuestionTokenById(question, tokenId) {
  return (question?.bankTokens || []).find((token) => token.id === tokenId) || null;
}

function getPlacedTokens(question) {
  return getSlottedTokens(question).filter(Boolean);
}

function isAnswerComplete(question) {
  return Boolean(question) && getFilledSlotCount(question) === (question.targetTokens || []).length;
}

function getAcceptedAnswerVariants(question) {
  if (!question) return [];
  const primaryTokens = sanitizeTokenList(question.targetTokens);
  const primaryText = question.direction === "he2en"
    ? String(question?.sentence?.english || "").trim()
    : String(question?.sentence?.hebrew || "").trim();
  const alternates = question.direction === "en2he"
    ? question?.sentence?.hebrewAlternates
    : question.direction === "listen"
      ? []
      : question?.sentence?.englishAlternates;

  return [
    { text: primaryText, tokens: primaryTokens },
    ...(Array.isArray(alternates) ? alternates : []),
  ].filter((variant) => Array.isArray(variant?.tokens) && variant.tokens.length === primaryTokens.length);
}

function findClosestAcceptedAnswerVariant(question, actualTokens = getPlacedAnswerTokens(question)) {
  const actual = sanitizeTokenList(actualTokens);
  const variants = getAcceptedAnswerVariants(question);
  if (!variants.length) return null;
  if (!actual.length) return variants[0];

  let bestVariant = variants[0];
  let bestScore = -1;

  variants.forEach((variant) => {
    let score = 0;
    const vTokens = variant.tokens || [];
    const minLen = Math.min(vTokens.length, actual.length);
    for (let i = 0; i < minLen; i++) {
      if (vTokens[i] === actual[i]) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestVariant = variant;
    }
  });

  return bestVariant;
}

function findMatchingAcceptedAnswerVariant(question, actualTokens = getPlacedAnswerTokens(question)) {
  const actual = sanitizeTokenList(actualTokens);
  if (!actual.length) return null;
  return getAcceptedAnswerVariants(question).find((variant) => (
    isEquivalentSentenceTokenOrder(variant.tokens, actual)
  )) || null;
}

function isPlacedAnswerCorrect(question) {
  return Boolean(findMatchingAcceptedAnswerVariant(question));
}

function getCorrectAnswerText(question, options = {}) {
  if (!question?.sentence) return "";
  const matchedVariant = options.matchingVariant
    || findMatchingAcceptedAnswerVariant(question, options.actualTokens)
    || findClosestAcceptedAnswerVariant(question, options.actualTokens);
  if (matchedVariant?.text) {
    return matchedVariant.text;
  }
  return question.direction === "he2en" ? question.sentence.english : question.sentence.hebrew;
}

function getCorrectAnswerDisplayText(question, options = {}) {
  const matchedVariant = options.matchingVariant
    || findMatchingAcceptedAnswerVariant(question, options.actualTokens)
    || findClosestAcceptedAnswerVariant(question, options.actualTokens);
  const plain = getCorrectAnswerText(question, { matchingVariant: matchedVariant, actualTokens: options.actualTokens });
  if (!question?.sentence || question.direction === "he2en") return plain;
  if (!getRuntime().state?.showNiqqudInline) return plain;
  if (matchedVariant?.textNiqqud) return matchedVariant.textNiqqud;
  if (plain === question.sentence.hebrew && question.sentence.hebrewNiqqud) {
    return question.sentence.hebrewNiqqud;
  }
  return plain;
}

function buildCandidatePairs(pool, askedSentenceIds) {
  const allowed = app.character?.filterWithheldContent?.("sentence", pool) || pool;
  const unused = allowed.filter((sentence) => !askedSentenceIds.includes(sentence.id));
  const freshPool = unused.length ? unused : allowed;
  if (getRuntime().state?.sentenceBank?.shemaMode) {
    return (freshPool.length ? freshPool : allowed).map((sentence) => ({ sentence, direction: "listen" }));
  }
  return (freshPool.length ? freshPool : allowed).flatMap((sentence) => ([
    { sentence, direction: "he2en" },
    { sentence, direction: "en2he" },
  ]));
}

function pickWeightedPair(pairs) {
  const weightedRandomWord = app.utils?.weightedRandomWord;
  if (!pairs.length || typeof weightedRandomWord !== "function") return pairs[0] || null;

  const now = Date.now();
  const duePairs = getDuePairs(pairs, now);
  const activePairs = duePairs.length ? duePairs : pairs;
  const characterWeigher = app.character?.buildContentWeigher?.(
    "sentence",
    activePairs,
    (pair) => pair.sentence,
  ) || (() => 1);
  const weightedPairs = activePairs.map((pair) => {
    const record = getSentenceProgressRecord(pair.sentence.id, pair.direction);
    const accuracy = record.attempts ? record.correct / record.attempts : 0;
    const overdueMs = record.attempts ? Math.max(0, now - record.nextDue) : 0;
    const overdueHours = overdueMs / (60 * 60 * 1000);
    const directionBoost = pair.direction === "en2he" ? 1.18 : 1;
    const newBoost = record.attempts === 0 ? 1.4 : 1;
    const dueBoost = record.attempts > 0 && record.nextDue <= now ? 1 + Math.min(1.35, overdueHours / 10) : 1;
    const weaknessBoost = 1 + (1 - accuracy) * 0.85;
    const levelBoost = 1 + ((Math.max(0, getRuntime().constants.LEITNER_INTERVALS.length - 1) - record.level) / Math.max(1, getRuntime().constants.LEITNER_INTERVALS.length - 1)) * 0.4;
    const missBoost = 1 + Math.min(3, Math.max(0, Number(record.misses || 0))) * (pair.direction === "en2he" ? 0.65 : 0.5);
    const difficultyBoost = 1 + (pair.sentence.difficulty - 1) * 0.28;
    const characterBoost = characterWeigher(pair);
    const jitter = 0.78 + Math.random() * 0.55;

    return {
      word: pair,
      weight: newBoost * dueBoost * weaknessBoost * levelBoost * missBoost * difficultyBoost * directionBoost * characterBoost * jitter,
    };
  });

  return weightedRandomWord(weightedPairs);
}

sentenceBank.prepareSentenceBankDeck = sentenceBank.prepareSentenceBankDeck || function prepareSentenceBankDeck(entries) {
  const source = Array.isArray(entries) ? entries : [];
  const seenIds = new Set();
  const cleaned = [];

  source.forEach((entry, index) => {
    const english = String(entry?.english || "").trim();
    const hebrew = String(entry?.hebrew || "").trim();
    const englishTokens = sanitizeTokenList(entry?.english_tokens || entry?.englishTokens);
    const hebrewTokens = sanitizeTokenList(entry?.hebrew_tokens || entry?.hebrewTokens);
    if (!english || !hebrew || !englishTokens.length || !hebrewTokens.length) return;

    let idBase = String(entry?.id || `sentence-${index + 1}`).trim();
    if (!idBase) {
      idBase = `sentence-${index + 1}`;
    }
    let id = idBase;
    let suffix = 2;
    while (seenIds.has(id)) {
      id = `${idBase}-${suffix}`;
      suffix += 1;
    }
    seenIds.add(id);

    const hebrewNiqqudByToken = {};
    const addNiqqudPair = (plain, marked) => {
      const key = String(plain || "").trim();
      const value = String(marked || "").trim();
      if (key && value && !hebrewNiqqudByToken[key]) {
        hebrewNiqqudByToken[key] = value;
      }
    };
    const rawHebrewTokens = Array.isArray(entry?.hebrew_tokens) ? entry.hebrew_tokens : [];
    const rawHebrewTokensNiqqud = Array.isArray(entry?.hebrew_tokens_niqqud) ? entry.hebrew_tokens_niqqud : [];
    rawHebrewTokens.forEach((token, tokenIndex) => addNiqqudPair(token, rawHebrewTokensNiqqud[tokenIndex]));
    const rawHebrewDistractors = Array.isArray(entry?.hebrew_distractors) ? entry.hebrew_distractors : [];
    const rawHebrewDistractorsNiqqud = Array.isArray(entry?.hebrew_distractors_niqqud) ? entry.hebrew_distractors_niqqud : [];
    rawHebrewDistractors.forEach((token, tokenIndex) => addNiqqudPair(token, rawHebrewDistractorsNiqqud[tokenIndex]));
    (Array.isArray(entry?.hebrew_alternates) ? entry.hebrew_alternates : []).forEach((variant) => {
      const altTokens = Array.isArray(variant?.tokens) ? variant.tokens : [];
      const altTokensNiqqud = Array.isArray(variant?.tokens_niqqud) ? variant.tokens_niqqud : [];
      altTokens.forEach((token, tokenIndex) => addNiqqudPair(token, altTokensNiqqud[tokenIndex]));
    });

    cleaned.push({
      id,
      category: String(entry?.category || "general").trim() || "general",
      style: entry?.style == null ? "" : String(entry.style).trim(),
      difficulty: clampDifficulty(entry?.difficulty),
      emoji: String(entry?.emoji || "").trim(),
      english,
      hebrew,
      hebrewNiqqud: String(entry?.hebrew_niqqud || "").trim(),
      hebrewNiqqudByToken,
      englishTokens,
      hebrewTokens,
      englishAlternates: sanitizeAnswerVariants(entry?.english_alternates || entry?.englishAlternates, englishTokens),
      hebrewAlternates: sanitizeAnswerVariants(entry?.hebrew_alternates || entry?.hebrewAlternates, hebrewTokens),
      englishDistractors: sanitizeDistractors(entry?.english_distractors || entry?.englishDistractors, englishTokens),
      hebrewDistractors: sanitizeDistractors(entry?.hebrew_distractors || entry?.hebrewDistractors, hebrewTokens),
      notes: String(entry?.notes || "").trim(),
      source: String(entry?.source || "sentence-bank").trim() || "sentence-bank",
    });
  });

  return cleaned;
};

sentenceBank.getSentenceBankPromptSpeechPayload = sentenceBank.getSentenceBankPromptSpeechPayload || function getSentenceBankPromptSpeechPayload(question = getRuntime().state.sentenceBank.currentQuestion) {
  if (!question) return null;
  if (!question.promptIsHebrew && question.direction !== "listen") return null;
  return app.speech?.buildSpeechPayload?.({
    plain: question.prompt,
    niqqud: question.sentence?.hebrewNiqqud,
    source: "prompt",
  }) || null;
};

sentenceBank.playShemaPrompt = sentenceBank.playShemaPrompt || function playShemaPrompt(options = {}) {
  const payload = sentenceBank.getSentenceBankPromptSpeechPayload();
  if (!payload) return false;
  return app.speech?.speak?.(payload, {
    force: true,
    rate: options.slow ? 0.65 : undefined,
  }) || false;
};

sentenceBank.cloneSentenceBankQuestionSnapshot = sentenceBank.cloneSentenceBankQuestionSnapshot || function cloneSentenceBankQuestionSnapshot(question) {
  const normalized = normalizeQuestionState(question ? { ...question } : null);
  return {
    ...normalized,
    sentence: normalized?.sentence ? { ...normalized.sentence } : null,
    targetTokens: Array.isArray(normalized?.targetTokens) ? [...normalized.targetTokens] : [],
    bankTokens: Array.isArray(normalized?.bankTokens)
      ? normalized.bankTokens.map((token) => ({ ...token }))
      : [],
    slotTokenIds: Array.isArray(normalized?.slotTokenIds) ? [...normalized.slotTokenIds] : [],
    placedBankTokenIds: Array.isArray(normalized?.placedBankTokenIds) ? [...normalized.placedBankTokenIds] : [],
    selectedBankTokenId: String(normalized?.selectedBankTokenId || ""),
    selectedSlotIndex: normalized?.selectedSlotIndex ?? null,
    wasLastAnswerCorrect: normalized?.wasLastAnswerCorrect === true,
    locked: normalized?.locked !== undefined ? Boolean(normalized.locked) : true,
  };
};

sentenceBank.buildSentenceBankMistakeSummary = sentenceBank.buildSentenceBankMistakeSummary || function buildSentenceBankMistakeSummary() {
  const runtime = getRuntime();
  const lookup = new Map((runtime.sentenceBankDeck || []).map((sentence) => [sentence.id, sentence]));
  return runtime.state.sentenceBank.sessionMistakeKeys
    .map((key) => {
      const [sentenceId, direction = "he2en"] = String(key || "").split("::");
      const sentence = lookup.get(sentenceId);
      if (!sentence) return null;
      const clinicNote = buildSentenceClinicNote(sentence.notes);
      const hebrewText = runtime.state?.showNiqqudInline && sentence.hebrewNiqqud
        ? sentence.hebrewNiqqud
        : sentence.hebrew;
      // Hebrew first in every direction: a mistake list reads better with one
      // stable column order than with each row mirroring its own prompt.
      const hebrewField = {
        label: translate(direction === "listen" ? "feedback.heardLabel" : "feedback.hebrewSentenceLabel"),
        value: hebrewText,
        dir: "rtl",
        lang: "he",
      };
      const englishField = {
        label: translate(direction === "listen" ? "feedback.meaningLabel" : "feedback.englishSentenceLabel"),
        value: sentence.english,
        dir: "ltr",
        lang: "en",
      };
      return {
        primary: direction === "he2en" ? sentence.english : hebrewText,
        secondary: direction === "he2en" ? hebrewText : sentence.english,
        fields: [hebrewField, englishField],
        clinicKey: clinicNote ? "results.sentenceClinic" : "",
        clinicVars: clinicNote ? { note: clinicNote } : {},
      };
    })
    .filter(Boolean);
};

sentenceBank.getRoundTarget = sentenceBank.getRoundTarget || function getRoundTarget() {
  const runtime = getRuntime();
  if (!runtime.sentenceBankDeck?.length) return 0;
  // Shema runs on this slice via `shemaMode`, so a beat for either mode sizes it.
  const beat = app.character?.getActiveBeat?.();
  const target = beat && (beat.mode === "sentenceBank" || beat.mode === "shema") && beat.rounds > 0
    ? beat.rounds
    : runtime.constants.LESSON_ROUNDS;
  return Math.min(target, runtime.sentenceBankDeck.length);
};

sentenceBank.resetSentenceBankState = sentenceBank.resetSentenceBankState || function resetSentenceBankState() {
  const runtime = getRuntime();
  const session = getSession();
  session.stopSentenceBankTimer?.();
  runtime.state.sentenceBank.active = false;
  runtime.state.sentenceBank.introActive = false;
  runtime.state.sentenceBank.inReview = false;
  runtime.state.sentenceBank.currentRound = 0;
  runtime.state.sentenceBank.secondChanceCurrent = 0;
  runtime.state.sentenceBank.secondChanceTotal = 0;
  runtime.state.sentenceBank.startMs = 0;
  runtime.state.sentenceBank.elapsedSeconds = 0;
  runtime.state.sentenceBank.timerId = null;
  runtime.state.sentenceBank.askedSentenceIds = [];
  runtime.state.sentenceBank.reviewQueue = [];
  runtime.state.sentenceBank.currentQuestion = null;
  runtime.state.sentenceBank.wrongAnswers = 0;
  runtime.state.sentenceBank.sessionMistakeKeys = [];
  runtime.state.sentenceBank.availableScore = 0;
  runtime.state.sentenceBank.shemaMode = false;
};

sentenceBank.renderSentenceBankIdleState = sentenceBank.renderSentenceBankIdleState || function renderSentenceBankIdleState() {
  const runtime = getRuntime();
  const h = getHelpers();
  runtime.state.mode = "sentenceBank";
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid", "match-grid");
  runtime.el.choiceContainer.classList.add("sentence-bank-board");
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptText.classList.remove("hebrew", "english-prompt");
  runtime.el.promptText.textContent = translate("prompt.sentenceBankStart");
  runtime.el.choiceContainer.innerHTML = "";
  h.clearFeedback?.();
  h.renderPromptHint?.();
  app.ui?.renderPromptSpeechButton?.();
};

sentenceBank.startShema = sentenceBank.startShema || function startShema() {
  sentenceBank.startSentenceBank({ shema: true });
};

sentenceBank.startSentenceBank = sentenceBank.startSentenceBank || function startSentenceBank(options = {}) {
  const runtime = getRuntime();
  const h = getHelpers();
  const session = getSession();

  app.speech?.cancel?.();
  session.resetAllModeSessions?.();
  session.clearSummaryState?.();
  h.resetSessionScore?.();
  runtime.state.sentenceBank.shemaMode = options.shema === true;
  runtime.state.mode = "sentenceBank";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = options.shema === true ? "shema" : "sentenceBank";
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid");
  h.clearFeedback?.();

  const repair = app.character?.takeRepairQueue?.(options.shema === true ? "shema" : "sentenceBank") || [];
  if (repair.length) runtime.state.sentenceBank.reviewQueue = repair;

  if (!runtime.sentenceBankDeck?.length) {
    runtime.state.sentenceBank.active = false;
    sentenceBank.renderSentenceBankIdleState();
    app.ui?.renderPromptLabel?.(translate("prompt.noSentenceBankTitle"), true);
    runtime.el.promptText.classList.remove("hebrew");
    runtime.el.promptText.classList.add("english-prompt");
    runtime.el.promptText.textContent = translate("prompt.noSentenceBankBody");
    h.setFeedback?.(translate("prompt.noSentenceBankTitle"), false);
    return;
  }

  runtime.state.sentenceBank.active = true;
  sentenceBank.playSentenceBankIntro();
  h.renderAll?.();
};

sentenceBank.playSentenceBankIntro = sentenceBank.playSentenceBankIntro || function playSentenceBankIntro() {
  const runtime = getRuntime();
  const session = getSession();
  const h = getHelpers();
  if (!runtime.el.sentenceBankIntro) {
    sentenceBank.beginSentenceBankFromIntro();
    return;
  }

  session.clearSentenceBankIntro?.();
  runtime.state.sentenceBank.introActive = true;
  h.showBlockingOverlay?.(runtime.el.sentenceBankIntro);
  session.scheduleIntroAutoAdvance?.(() => sentenceBank.beginSentenceBankFromIntro());
};

sentenceBank.beginSentenceBankFromIntro = sentenceBank.beginSentenceBankFromIntro || function beginSentenceBankFromIntro() {
  const runtime = getRuntime();
  const session = getSession();
  if (!runtime.state.sentenceBank.active) return;
  if (!runtime.state.sentenceBank.introActive && runtime.state.sentenceBank.currentQuestion) return;
  if (runtime.state.sentenceBank.introActive) {
    session.clearSentenceBankIntro?.();
  }
  if (!runtime.state.sentenceBank.startMs) {
    runtime.state.sentenceBank.startMs = Date.now();
    runtime.state.sentenceBank.elapsedSeconds = 0;
    session.startSentenceBankTimer?.();
  }
  sentenceBank.nextSentenceBankQuestion();
};

sentenceBank.buildSentenceBankQuestion = sentenceBank.buildSentenceBankQuestion || function buildSentenceBankQuestion(pool) {
  const runtime = getRuntime();
  const pair = pickWeightedPair(buildCandidatePairs(pool, runtime.state.sentenceBank.askedSentenceIds));
  if (!pair?.sentence) return null;
  runtime.state.sentenceBank.askedSentenceIds.push(pair.sentence.id);
  return buildQuestionFromPair(pair, { isReview: false });
};

// Deliberately not filtered by the character withholding layer: this is the
// in-session second-chance queue, so changing its contents would shorten a review
// phase already in progress rather than select material for a new round.
sentenceBank.buildSentenceBankReviewQuestion = sentenceBank.buildSentenceBankReviewQuestion || function buildSentenceBankReviewQuestion(pool) {
  const runtime = getRuntime();
  while (runtime.state.sentenceBank.reviewQueue.length) {
    const candidate = runtime.state.sentenceBank.reviewQueue.shift();
    const sentence = pool.find((item) => item.id === candidate?.sentenceId);
    if (!sentence) continue;
    return buildQuestionFromPair({ sentence, direction: candidate.direction }, { isReview: true });
  }
  return null;
};

sentenceBank.tryStartReviewPhase = sentenceBank.tryStartReviewPhase || function tryStartReviewPhase() {
  const runtime = getRuntime();
  if (runtime.state.sentenceBank.inReview || !runtime.state.sentenceBank.reviewQueue.length) return false;
  // Inside a mission the misses are held back to a repair beat at the end
  // instead of being re-asked two questions later. Returns false in free play,
  // which keeps today's per-session behaviour there byte for byte.
  const mode = runtime.state.sentenceBank.shemaMode ? "shema" : "sentenceBank";
  if (app.character?.deferReviewQueue?.(mode, runtime.state.sentenceBank.reviewQueue)) {
    runtime.state.sentenceBank.reviewQueue = [];
    return false;
  }
  runtime.state.sentenceBank.inReview = true;
  runtime.state.sentenceBank.secondChanceTotal = runtime.state.sentenceBank.reviewQueue.length;
  runtime.state.sentenceBank.secondChanceCurrent = 0;
  return true;
};

sentenceBank.nextSentenceBankQuestion = sentenceBank.nextSentenceBankQuestion || function nextSentenceBankQuestion() {
  const runtime = getRuntime();
  const h = getHelpers();
  const session = getSession();
  const pool = runtime.sentenceBankDeck || [];

  if (runtime.state.mode !== "sentenceBank") return;
  if (!runtime.state.sentenceBank.active) {
    session.goHome?.();
    return;
  }
  if (runtime.state.sentenceBank.introActive) return;

  const targetRounds = sentenceBank.getRoundTarget();
  if (!targetRounds && !runtime.state.sentenceBank.inReview && !runtime.state.sentenceBank.reviewQueue.length) {
    session.finishSentenceBank?.();
    return;
  }

  if (!runtime.state.sentenceBank.inReview && runtime.state.sentenceBank.currentRound >= targetRounds) {
    if (!sentenceBank.tryStartReviewPhase()) {
      session.finishSentenceBank?.();
      return;
    }
    runtime.state.sentenceBank.currentQuestion = null;
    h.renderSessionHeader?.();
    sentenceBank.playSentenceBankIntro();
    return;
  }

  if (runtime.state.sentenceBank.inReview && runtime.state.sentenceBank.secondChanceCurrent >= runtime.state.sentenceBank.secondChanceTotal) {
    session.finishSentenceBank?.();
    return;
  }

  const question = runtime.state.sentenceBank.inReview
    ? sentenceBank.buildSentenceBankReviewQuestion(pool)
    : sentenceBank.buildSentenceBankQuestion(pool);
  if (!question) {
    runtime.state.sentenceBank.active = false;
    session.finishSentenceBank?.();
    return;
  }

  if (runtime.state.sentenceBank.inReview) {
    runtime.state.sentenceBank.secondChanceCurrent += 1;
  } else {
    runtime.state.sentenceBank.currentRound += 1;
    runtime.state.sentenceBank.availableScore += question.scoreValue;
  }
  app.character?.clearTransientReaction?.();
  runtime.state.sentenceBank.currentQuestion = question;
  h.clearFeedback?.();
  sentenceBank.renderSentenceBankQuestion();
  if (question.direction === "listen") {
    sentenceBank.playShemaPrompt();
  }
};

sentenceBank.canSubmitCurrentQuestion = sentenceBank.canSubmitCurrentQuestion || function canSubmitCurrentQuestion(question = getRuntime().state.sentenceBank.currentQuestion) {
  return isAnswerComplete(question) && !question?.locked;
};

sentenceBank.renderSentenceBankQuestion = sentenceBank.renderSentenceBankQuestion || function renderSentenceBankQuestion() {
  const runtime = getRuntime();
  const h = getHelpers();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  runtime.el.choiceContainer.classList.remove("summary-grid", "match-grid");
  runtime.el.choiceContainer.classList.add("sentence-bank-board");
  h.renderSessionHeader?.();

  if (!question) return;

  app.ui?.renderPromptLabel?.("", false);
  if (runtime.el?.promptRootEmoji) {
    runtime.el.promptRootEmoji.textContent = question.emoji || "";
    runtime.el.promptRootEmoji.classList.toggle("hidden", !question.emoji);
  }
  h.renderPromptText?.(question);
  sentenceBank.renderSentenceBankBoard(question);
  h.renderPromptHint?.();
};

sentenceBank.renderSentenceBankBoard = sentenceBank.renderSentenceBankBoard || function renderSentenceBankBoard(question) {
  const runtime = getRuntime();
  normalizeQuestionState(question);
  runtime.el.choiceContainer.innerHTML = "";
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const slottedTokens = getSlottedTokens(question);
  const placedTokenTexts = slottedTokens.map((t) => t?.text || "");
  const acceptedVariant = question.locked
    ? (findMatchingAcceptedAnswerVariant(question, placedTokenTexts) || findClosestAcceptedAnswerVariant(question, placedTokenTexts))
    : null;
  const displayTargetTokens = acceptedVariant?.tokens || question.targetTokens;
  const sentenceFrame = buildSentenceFrame(
    getCorrectAnswerText(question, { matchingVariant: acceptedVariant, actualTokens: placedTokenTexts }),
    displayTargetTokens
  );

  const board = global.document.createElement("div");
  board.className = `sentence-builder ${question.locked ? "is-feedback" : ""}`.trim();

  if (question.direction === "listen") {
    const controls = global.document.createElement("div");
    controls.className = "shema-controls";
    const playBtn = global.document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "choice-btn shema-play-btn";
    playBtn.textContent = translate("prompt.shemaPlay");
    playBtn.addEventListener("click", () => sentenceBank.playShemaPrompt());
    const slowBtn = global.document.createElement("button");
    slowBtn.type = "button";
    slowBtn.className = "choice-btn shema-play-btn";
    slowBtn.textContent = translate("prompt.shemaPlaySlow");
    slowBtn.addEventListener("click", () => sentenceBank.playShemaPrompt({ slow: true }));
    controls.append(playBtn, slowBtn);
    board.append(controls);
  }

  const answerRow = global.document.createElement("section");
  answerRow.className = `sentence-answer-line ${question.answerIsHebrew ? "hebrew" : "english"}`;
  answerRow.setAttribute("dir", question.answerIsHebrew ? "rtl" : "ltr");

  sentenceFrame.pieces.forEach((piece, index) => {
    if (piece.beforeText) {
      const staticText = global.document.createElement("span");
      staticText.className = "sentence-static";
      staticText.textContent = piece.beforeText;
      answerRow.append(staticText);
    }

    const pieceEl = global.document.createElement("span");
    pieceEl.className = "sentence-piece";

    const tokenId = slotTokenIds[index] || "";
    const token = slottedTokens[index] || null;
    const slot = global.document.createElement("button");
    slot.type = "button";
    slot.className = `choice-btn sentence-slot ${question.answerIsHebrew ? "hebrew" : ""}`;
    slot.style.setProperty("--slot-ch", String(Math.max(3, piece.tokenText.length)));
    slot.setAttribute("data-slot-index", String(index));
    slot.setAttribute("aria-label", buildSentenceSlotAriaLabel(question, index, token));
    slot.setAttribute("aria-description", buildSentenceSlotAriaDescription(question, token));
    if (token) {
      slot.classList.add("filled");
      slot.textContent = sentenceTokenDisplayText(token);
      if (question.selectedBankTokenId === tokenId) {
        slot.classList.add("selected");
      }
      if (question.locked) {
        slot.classList.add(question.wasLastAnswerCorrect || (token && token.text === displayTargetTokens[index]) ? "correct" : "wrong");
      }
    } else {
      slot.classList.add("empty");
      slot.textContent = "\u00A0";
      if (question.selectedSlotIndex === index) {
        slot.classList.add("selected");
      }
    }

    slot.disabled = Boolean(question.locked);
    slot.draggable = Boolean(!question.locked && token);
    if (!question.locked) {
      slot.addEventListener("click", () => sentenceBank.selectSentenceSlot(index));
      slot.addEventListener("keydown", (event) => {
        sentenceBank.handleSentenceSlotKeydown(index, event);
      });
      if (token) {
        slot.addEventListener("dragstart", (event) => {
          clearQuestionSelection(question);
          setSentenceDragPayload({ type: "slot", slotIndex: index, tokenId });
          if (event?.dataTransfer?.setData) {
            event.dataTransfer.setData("application/x-ivriquest-sentence-token", JSON.stringify({ type: "slot", slotIndex: index, tokenId }));
            event.dataTransfer.effectAllowed = "move";
          }
          applyMouseDragImage(event, sentenceTokenDisplayText(token), question.answerIsHebrew);
        });
        slot.addEventListener("dragend", () => {
          clearSentenceDragState();
        });
        slot.addEventListener("touchstart", (event) => {
          startSentenceTouchDrag(question, { type: "slot", slotIndex: index, tokenId }, event?.touches?.[0]);
        });
        slot.addEventListener("touchmove", (event) => {
          handleSentenceTouchMove(question, event);
        });
        slot.addEventListener("touchend", (event) => {
          finishSentenceTouchDrag(question, event);
        });
        slot.addEventListener("touchcancel", () => {
          clearSentenceDragState();
        });
      }
      slot.addEventListener("dragover", (event) => {
        const payload = resolveSentenceDragPayload(event);
        if (!canDropSentencePayload(question, index, payload)) return;
        event.preventDefault?.();
        slot.classList.toggle("insert-target", Boolean(token));
        slot.classList.toggle("drag-target", !token);
      });
      slot.addEventListener("dragenter", (event) => {
        const payload = resolveSentenceDragPayload(event);
        if (!canDropSentencePayload(question, index, payload)) return;
        event.preventDefault?.();
        slot.classList.toggle("insert-target", Boolean(token));
        slot.classList.toggle("drag-target", !token);
      });
      slot.addEventListener("dragleave", () => {
        slot.classList.remove("drag-target");
        slot.classList.remove("insert-target");
      });
      slot.addEventListener("drop", (event) => {
        event.preventDefault?.();
        slot.classList.remove("drag-target");
        slot.classList.remove("insert-target");
        sentenceBank.handleSlotDrop(index, resolveSentenceDragPayload(event));
      });
    }
    pieceEl.append(slot);
    if (piece.afterText) {
      const suffixText = global.document.createElement("span");
      suffixText.className = "sentence-static sentence-static-attached";
      suffixText.textContent = piece.afterText;
      pieceEl.append(suffixText);
    }
    answerRow.append(pieceEl);
  });

  if (sentenceFrame.trailingText) {
    const staticText = global.document.createElement("span");
    staticText.className = "sentence-static";
    staticText.textContent = sentenceFrame.trailingText;
    answerRow.append(staticText);
  }

  board.append(answerRow);
  if (!question.locked) {
    const answerMeta = global.document.createElement("p");
    answerMeta.className = "sentence-answer-meta small-note";
    answerMeta.textContent = translate("session.words", {
      count: `${getFilledSlotCount(question)}/${question.targetTokens.length}`,
    });

    const bankGrid = global.document.createElement("section");
    bankGrid.className = `sentence-token-bank ${question.answerIsHebrew ? "hebrew" : "english"}`;
    bankGrid.setAttribute("dir", question.answerIsHebrew ? "rtl" : "ltr");

    question.bankTokens.forEach((token) => {
      if (slotTokenIds.includes(token.id)) {
        return;
      }
      const btn = global.document.createElement("button");
      btn.type = "button";
      btn.className = `choice-btn sentence-token ${question.answerIsHebrew ? "hebrew" : ""}`;
      btn.textContent = sentenceTokenDisplayText(token);
      const isSelected = question.selectedBankTokenId === token.id;
      btn.classList.toggle("selected", isSelected);
      btn.setAttribute("aria-label", buildSentenceBankTokenAriaLabel(token));
      btn.setAttribute("aria-description", buildSentenceBankTokenAriaDescription(isSelected));
      btn.setAttribute("aria-pressed", isSelected ? "true" : "false");
      btn.draggable = true;
      btn.addEventListener("click", () => sentenceBank.selectBankToken(token.id));
      btn.addEventListener("keydown", (event) => {
        sentenceBank.handleSentenceBankTokenKeydown(token.id, event);
      });
      btn.addEventListener("dragstart", (event) => {
        clearQuestionSelection(question);
        setSentenceDragPayload({ type: "bank", tokenId: token.id });
        if (event?.dataTransfer?.setData) {
          event.dataTransfer.setData("application/x-ivriquest-sentence-token", JSON.stringify({ type: "bank", tokenId: token.id }));
          event.dataTransfer.effectAllowed = "move";
        }
        applyMouseDragImage(event, sentenceTokenDisplayText(token), question.answerIsHebrew);
      });
      btn.addEventListener("dragend", () => {
        clearSentenceDragState();
      });
      btn.addEventListener("touchstart", (event) => {
        startSentenceTouchDrag(question, { type: "bank", tokenId: token.id }, event?.touches?.[0]);
      });
      btn.addEventListener("touchmove", (event) => {
        handleSentenceTouchMove(question, event);
      });
      btn.addEventListener("touchend", (event) => {
        finishSentenceTouchDrag(question, event);
      });
      btn.addEventListener("touchcancel", () => {
        clearSentenceDragState();
      });
      bankGrid.append(btn);
    });

    board.append(answerMeta, bankGrid);
  }
  runtime.el.choiceContainer.append(board);
};

sentenceBank.placeTokenInSlot = sentenceBank.placeTokenInSlot || function placeTokenInSlot(tokenId, slotIndex, options = {}) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) return false;
  const placed = placeTokenInSlotInternal(question, tokenId, slotIndex);
  if (!placed) return false;
  if (options.clearSelection !== false) {
    clearQuestionSelection(question);
  }
  if (options.render !== false) {
    sentenceBank.renderSentenceBankQuestion();
  }
  return true;
};

sentenceBank.placeTokenInNextEmptySlot = sentenceBank.placeTokenInNextEmptySlot || function placeTokenInNextEmptySlot(tokenId, options = {}) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) return false;
  const nextEmptySlotIndex = getNextEmptySlotIndex(question);
  if (nextEmptySlotIndex < 0) return false;
  return sentenceBank.placeTokenInSlot(tokenId, nextEmptySlotIndex, options);
};

sentenceBank.insertTokenAtSlot = sentenceBank.insertTokenAtSlot || function insertTokenAtSlot(tokenId, slotIndex, options = {}) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) return false;
  const inserted = insertTokenAtSlotInternal(question, tokenId, slotIndex, options);
  if (!inserted) return false;
  if (options.clearSelection !== false) {
    clearQuestionSelection(question);
  }
  if (options.render !== false) {
    sentenceBank.renderSentenceBankQuestion();
  }
  return true;
};

sentenceBank.movePlacedToken = sentenceBank.movePlacedToken || function movePlacedToken(fromIndex, toIndex, options = {}) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) return false;
  const moved = movePlacedTokenInternal(question, fromIndex, toIndex);
  if (!moved) return false;
  if (options.clearSelection !== false) {
    clearQuestionSelection(question);
  }
  if (options.render !== false) {
    sentenceBank.renderSentenceBankQuestion();
  }
  return true;
};

sentenceBank.selectSentenceSlot = sentenceBank.selectSentenceSlot || function selectSentenceSlot(index) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked || shouldSuppressSentenceTap()) return;

  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedIndex = normalizeSentenceSlotIndex(index, slotTokenIds.length);
  if (normalizedIndex === null) return;

  if (slotTokenIds[normalizedIndex]) {
    sentenceBank.removePlacedToken(normalizedIndex);
    return;
  }

  if (question.selectedBankTokenId) {
    sentenceBank.placeTokenInSlot(question.selectedBankTokenId, normalizedIndex, { render: false });
    clearQuestionSelection(question);
  } else {
    question.selectedSlotIndex = question.selectedSlotIndex === normalizedIndex ? null : normalizedIndex;
  }
  sentenceBank.renderSentenceBankQuestion();
};

sentenceBank.handleSentenceSlotKeydown = sentenceBank.handleSentenceSlotKeydown || function handleSentenceSlotKeydown(index, event) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) return;

  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedIndex = normalizeSentenceSlotIndex(index, slotTokenIds.length);
  if (normalizedIndex === null) return;

  const key = String(event?.key || "");
  const hasToken = Boolean(slotTokenIds[normalizedIndex]);
  if (key === "Escape") {
    if (question.selectedBankTokenId || question.selectedSlotIndex !== null) {
      event.preventDefault?.();
      clearQuestionSelection(question);
      sentenceBank.renderSentenceBankQuestion();
    }
    return;
  }

  if (key === "Backspace" || key === "Delete") {
    if (hasToken) {
      event.preventDefault?.();
      sentenceBank.removePlacedToken(normalizedIndex);
    }
    return;
  }

  if (!question.selectedBankTokenId || (key !== "Enter" && key !== " " && key !== "Spacebar")) {
    return;
  }

  event.preventDefault?.();
  const handled = hasToken
    ? sentenceBank.insertTokenAtSlot(question.selectedBankTokenId, normalizedIndex, { render: false })
    : sentenceBank.placeTokenInSlot(question.selectedBankTokenId, normalizedIndex, { render: false });

  if (handled) {
    clearQuestionSelection(question);
  }
  sentenceBank.renderSentenceBankQuestion();
};

sentenceBank.handleSlotDrop = sentenceBank.handleSlotDrop || function handleSlotDrop(slotIndex, payload) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) {
    clearSentenceDragState();
    return false;
  }

  const activePayload = payload || activeSentenceDrag;
  let handled = false;
  if (activePayload?.type === "slot") {
    handled = sentenceBank.insertTokenAtSlot(activePayload.tokenId, slotIndex, {
      fromIndex: activePayload.slotIndex,
      render: false,
    });
  } else if (activePayload?.type === "bank") {
    handled = sentenceBank.insertTokenAtSlot(activePayload.tokenId, slotIndex, { render: false });
  }

  clearQuestionSelection(question);
  clearSentenceDragState();
  if (handled) {
    sentenceBank.renderSentenceBankQuestion();
  }
  return handled;
};

sentenceBank.handleSentenceBankTokenKeydown = sentenceBank.handleSentenceBankTokenKeydown || function handleSentenceBankTokenKeydown(tokenId, event) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked || shouldSuppressSentenceTap() || getQuestionSlotTokenIds(question).includes(tokenId)) {
    return;
  }

  const key = String(event?.key || "");
  if (key === "Escape") {
    if (question.selectedBankTokenId || question.selectedSlotIndex !== null) {
      event.preventDefault?.();
      clearQuestionSelection(question);
      sentenceBank.renderSentenceBankQuestion();
    }
    return;
  }

  if (key !== " " && key !== "Spacebar") {
    return;
  }

  event.preventDefault?.();
  question.selectedSlotIndex = null;
  question.selectedBankTokenId = question.selectedBankTokenId === tokenId ? "" : tokenId;
  sentenceBank.renderSentenceBankQuestion();
};

sentenceBank.selectBankToken = sentenceBank.selectBankToken || function selectBankToken(tokenId) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked || getQuestionSlotTokenIds(question).includes(tokenId)) {
    return;
  }
  if (question.selectedSlotIndex !== null) {
    sentenceBank.placeTokenInSlot(tokenId, question.selectedSlotIndex, { render: false });
    clearQuestionSelection(question);
  } else {
    const placed = sentenceBank.placeTokenInNextEmptySlot(tokenId, { render: false });
    if (!placed) {
      const nextSelectedTokenId = question.selectedBankTokenId === tokenId ? "" : tokenId;
      question.selectedBankTokenId = nextSelectedTokenId;
    } else {
      clearQuestionSelection(question);
    }
  }
  sentenceBank.renderSentenceBankQuestion();
};

sentenceBank.removePlacedToken = sentenceBank.removePlacedToken || function removePlacedToken(index) {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked) return;
  const slotTokenIds = getQuestionSlotTokenIds(question);
  const normalizedIndex = normalizeSentenceSlotIndex(index, slotTokenIds.length);
  if (normalizedIndex === null || !slotTokenIds[normalizedIndex]) return;
  slotTokenIds[normalizedIndex] = "";
  syncQuestionSlotState(question, slotTokenIds);
  if (question.selectedSlotIndex === normalizedIndex) {
    question.selectedSlotIndex = null;
  }
  sentenceBank.renderSentenceBankQuestion();
};

sentenceBank.clearAnswer = sentenceBank.clearAnswer || function clearAnswer() {
  const runtime = getRuntime();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked || !getFilledSlotCount(question)) return;
  question.slotTokenIds = buildEmptySentenceSlots(question.targetTokens.length);
  question.placedBankTokenIds = [];
  clearQuestionSelection(question);
  sentenceBank.renderSentenceBankQuestion();
};

sentenceBank.toggleHint = sentenceBank.toggleHint || function toggleHint() {
  return false;
};

sentenceBank.applySentenceBankAnswer = sentenceBank.applySentenceBankAnswer || function applySentenceBankAnswer() {
  const runtime = getRuntime();
  const h = getHelpers();
  const question = normalizeQuestionState(runtime.state.sentenceBank.currentQuestion);
  if (!question || question.locked || !isAnswerComplete(question)) return;

  const placedTokens = getPlacedAnswerTokens(question);
  const matchedVariant = findMatchingAcceptedAnswerVariant(question, placedTokens);
  const isCorrect = Boolean(matchedVariant);
  const correctAnswer = getCorrectAnswerDisplayText(question, { matchingVariant: matchedVariant, actualTokens: placedTokens });
  const questionKey = getQuestionKey(question);

  app.speech?.cancel?.();
  clearQuestionSelection(question);
  clearSentenceDragPayload();
  question.wasLastAnswerCorrect = isCorrect;
  question.locked = true;
  updateSentenceProgress(question.sentence.id, question.direction, isCorrect);
  runtime.state.sessionStreak = isCorrect ? runtime.state.sessionStreak + 1 : 0;

  if (isCorrect) {
    if (!question.isReview) {
      runtime.state.sessionScore += question.scoreValue;
    }
  } else {
    runtime.state.sentenceBank.wrongAnswers += 1;
    if (!runtime.state.sentenceBank.sessionMistakeKeys.includes(questionKey)) {
      runtime.state.sentenceBank.sessionMistakeKeys.push(questionKey);
    }
  }

  if (!isCorrect && !question.isReview) {
    const alreadyQueued = runtime.state.sentenceBank.reviewQueue.some(
      (entry) => buildSentenceProgressKey(entry.sentenceId, entry.direction) === questionKey
    );
    if (!alreadyQueued) {
      runtime.state.sentenceBank.reviewQueue.push({
        sentenceId: question.sentence.id,
        direction: question.direction,
      });
    }
  }

  h.setFeedback?.(
    question.direction === "listen"
      ? {
          tone: isCorrect ? "success" : "error",
          sentence: translate(
            isCorrect ? "feedback.shemaCorrect" : "feedback.shemaWrong",
            { answer: correctAnswer }
          ),
          detail: [
            translate("feedback.shemaMeaning", { english: question.sentence.english }),
            buildSentenceFeedbackDetail(question, isCorrect),
          ].filter(Boolean).join(" "),
          structured: buildStructuredSentenceFeedback(question, isCorrect, correctAnswer),
        }
      : question.direction === "he2en"
        ? {
            tone: isCorrect ? "success" : "error",
            sentence: translate(
              isCorrect ? "feedback.sentenceBankCorrectToEnglish" : "feedback.sentenceBankWrongToEnglish",
              { answer: correctAnswer }
            ),
            detail: buildSentenceFeedbackDetail(question, isCorrect),
            structured: buildStructuredSentenceFeedback(question, isCorrect, correctAnswer),
          }
        : {
            tone: isCorrect ? "success" : "error",
            sentence: translate(
              isCorrect ? "feedback.sentenceBankCorrectToHebrew" : "feedback.sentenceBankWrongToHebrew",
              { answer: correctAnswer }
            ),
            detail: buildSentenceFeedbackDetail(question, isCorrect),
            structured: buildStructuredSentenceFeedback(question, isCorrect, correctAnswer),
          }
  );
  h.playAnswerFeedbackSound?.(isCorrect);

  app.persistence?.saveSentenceProgress?.();
  sentenceBank.renderSentenceBankQuestion();
  h.renderDomainPerformance?.();
  h.renderMostMissed?.();
};
})(typeof window !== "undefined" ? window : globalThis);

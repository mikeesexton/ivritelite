(function initIvriQuestAppHandwriting(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const handwriting = app.handwriting = app.handwriting || {};

const MIN_POINT_GAP = 0.004;
const MIN_STROKE_LENGTH = 0.02;
const AUTO_CHECK_LENGTH_RATIO = 0.9;
const ADVANCE_DELAY_MS = 700;
const GUIDE_TOPLINE = 0.15;
const GUIDE_BASELINE = 0.75;
const GUIDE_DESCENDER = 0.98;

let stage = null;

function getRuntime() {
  return app.runtime || {};
}

function getHelpers() {
  return getRuntime().helpers || {};
}

function getSession() {
  return app.session || {};
}

function getCore() {
  return app.handwritingCore || {};
}

function translate(key, vars = {}) {
  return getHelpers().t ? getHelpers().t(key, vars) : key;
}

function getLetterforms() {
  return global.IvriQuestHandwritingData?.getLetterforms?.() || [];
}

function getLetterformById(id) {
  return getLetterforms().find((form) => form.id === id) || null;
}

function getLetterformName(form) {
  if (!form) return "";
  return getRuntime().state?.language === "he" ? (form.nameHe || form.nameEn) : (form.nameEn || "");
}

function buildCharToId() {
  const map = {};
  getLetterforms().forEach((form) => {
    map[form.letter] = form.id;
  });
  return map;
}

function getCurrentRound() {
  const ctx = getRuntime().state?.handwriting;
  if (!ctx?.active) return null;
  return ctx.rounds[ctx.roundIndex] || null;
}

function getCurrentCell() {
  const ctx = getRuntime().state?.handwriting;
  const round = getCurrentRound();
  return round ? round.cells[ctx.cellIndex] || null : null;
}

function getCurrentLetterform() {
  const cell = getCurrentCell();
  return cell?.letterformId ? getLetterformById(cell.letterformId) : null;
}

function nextLetterCellIndex(cells, from) {
  for (let i = Math.max(0, from); i < cells.length; i += 1) {
    if (cells[i]?.letterformId) return i;
  }
  return -1;
}

handwriting.loadHandwritingProgress = handwriting.loadHandwritingProgress || function loadHandwritingProgress() {
  const runtime = getRuntime();
  const storageKey = runtime.constants?.STORAGE_KEYS?.handwritingProgress;
  const raw = storageKey && runtime.storageApi?.loadJson
    ? runtime.storageApi.loadJson(storageKey, { version: 1, letters: {} }) || {}
    : {};
  const core = getCore();
  const letters = {};
  const known = new Set(getLetterforms().map((form) => form.id));
  Object.entries(raw.letters || {}).forEach(([id, entry]) => {
    if (!known.has(id)) return;
    letters[id] = core.normalizeProgressEntry ? core.normalizeProgressEntry(entry) : entry;
  });
  return { version: 1, letters };
};

handwriting.getWeakestLetters = handwriting.getWeakestLetters || function getWeakestLetters(limit = 8) {
  const core = getCore();
  if (!core.rankWeakestLetters) return [];
  return core.rankWeakestLetters(handwriting.loadHandwritingProgress().letters, getLetterforms(), { limit });
};

handwriting.getLearnedLetterCount = handwriting.getLearnedLetterCount || function getLearnedLetterCount() {
  const core = getCore();
  if (!core.countLearnedLetters) return 0;
  return core.countLearnedLetters(handwriting.loadHandwritingProgress().letters, 3);
};

handwriting.saveHandwritingProgress = handwriting.saveHandwritingProgress || function saveHandwritingProgress(progress) {
  const runtime = getRuntime();
  const storageKey = runtime.constants?.STORAGE_KEYS?.handwritingProgress;
  if (!storageKey || !runtime.storageApi?.saveJson) return;
  runtime.storageApi.saveJson(storageKey, progress);
};

handwriting.updateHandwritingProgress = handwriting.updateHandwritingProgress || function updateHandwritingProgress(letterformId, result) {
  const core = getCore();
  if (!letterformId || !core.applyAttemptToProgress) return;
  const progress = handwriting.loadHandwritingProgress();
  progress.letters[letterformId] = core.applyAttemptToProgress(progress.letters[letterformId], result);
  handwriting.saveHandwritingProgress(progress);
};

function destroyStage() {
  if (stage?.resizeObserver) {
    stage.resizeObserver.disconnect();
  }
  stage = null;
}

handwriting.resetHandwritingState = handwriting.resetHandwritingState || function resetHandwritingState() {
  const runtime = getRuntime();
  handwriting.stopHandwritingTimer();
  destroyStage();
  runtime.state.handwriting = {
    active: false,
    introActive: false,
    startMs: 0,
    elapsedSeconds: 0,
    timerId: null,
    rounds: [],
    roundIndex: 0,
    totalRounds: 0,
    cellIndex: 0,
    currentStrokes: [],
    attemptsThisCell: 0,
    cellRecorded: false,
    lastTone: "",
    correctCount: 0,
    mismatchCount: 0,
    sessionMistakeIds: [],
    isResolving: false,
  };
};

function resetCompetingSessions() {
  const h = getHelpers();
  const s = getSession();
  app.speech?.cancel?.();
  s.resetAllModeSessions?.();
  s.clearSummaryState?.();
  h.resetSessionScore?.();
}

function buildSentenceRounds() {
  const runtime = getRuntime();
  const core = getCore();
  const charToId = buildCharToId();
  const shuffle = app.utils?.shuffle || ((list) => list);
  const minLetters = runtime.constants?.HANDWRITING_SENTENCE_MIN_LETTERS || 6;
  const maxLetters = runtime.constants?.HANDWRITING_SENTENCE_MAX_LETTERS || 34;
  const target = runtime.constants?.HANDWRITING_SENTENCE_ROUNDS || 3;

  const sentences = global.IvriQuestSentenceBank?.getSentenceBank?.() || [];
  const usable = sentences
    .map((sentence) => {
      const cells = core.buildSentenceCells(sentence.hebrew, charToId);
      return {
        sentenceId: sentence.id,
        hebrew: sentence.hebrew,
        english: sentence.english,
        source: sentence,
        cells,
        letterCount: core.countLetterCells(cells),
      };
    })
    .filter((entry) => entry.letterCount >= minLetters && entry.letterCount <= maxLetters);

  if (!usable.length) return [];

  const count = Math.min(target, usable.length);
  const sorted = usable.slice().sort((a, b) => a.letterCount - b.letterCount);
  const shortlist = sorted.slice(0, Math.max(count, Math.ceil(sorted.length * 0.6)));
  // This picker sorts rather than weights, so an active character biases the
  // draw by preference, and only when enough of its own sentences qualify.
  const owned = shortlist.filter(
    (entry) => (app.character?.getContentWeight?.("sentence", entry.source) || 1) > 1
  );
  const pool = owned.length >= count ? owned : shortlist;
  return shuffle(pool.slice()).slice(0, count).map((entry) => ({
    sentenceId: entry.sentenceId,
    hebrew: entry.hebrew,
    english: entry.english,
    cells: entry.cells,
  }));
}

handwriting.startHandwriting = handwriting.startHandwriting || function startHandwriting() {
  const runtime = getRuntime();
  const h = getHelpers();

  resetCompetingSessions();
  handwriting.resetHandwritingState();
  h.clearFeedback?.();

  runtime.state.mode = "handwriting";
  runtime.state.route = "home";
  runtime.state.lastPlayedMode = "handwriting";
  h.setGamePickerVisibility?.(false);

  const rounds = buildSentenceRounds();
  const ctx = runtime.state.handwriting;
  if (!rounds.length) {
    ctx.active = false;
    handwriting.renderHandwritingIdleState();
    return;
  }

  ctx.active = true;
  ctx.rounds = rounds;
  ctx.totalRounds = rounds.length;
  ctx.roundIndex = 0;
  ctx.cellIndex = Math.max(0, nextLetterCellIndex(rounds[0].cells, 0));
  handwriting.playHandwritingIntro();
  h.renderAll?.();
};

handwriting.playHandwritingIntro = handwriting.playHandwritingIntro || function playHandwritingIntro() {
  const runtime = getRuntime();
  const session = getSession();
  const h = getHelpers();
  if (!runtime.el.handwritingIntro) {
    handwriting.beginHandwritingFromIntro();
    return;
  }

  session.clearHandwritingIntro?.();
  runtime.state.handwriting.introActive = true;
  h.showBlockingOverlay?.(runtime.el.handwritingIntro);
  session.scheduleIntroAutoAdvance?.(() => handwriting.beginHandwritingFromIntro());
};

handwriting.beginHandwritingFromIntro = handwriting.beginHandwritingFromIntro || function beginHandwritingFromIntro() {
  const runtime = getRuntime();
  const session = getSession();
  if (!runtime.state.handwriting.active) return;
  if (runtime.state.handwriting.introActive) {
    session.clearHandwritingIntro?.();
  }
  if (!runtime.state.handwriting.startMs) {
    runtime.state.handwriting.startMs = Date.now();
    runtime.state.handwriting.elapsedSeconds = 0;
    handwriting.startHandwritingTimer();
  }
  getHelpers().renderAll?.();
};

handwriting.startHandwritingTimer = handwriting.startHandwritingTimer || function startHandwritingTimer() {
  const runtime = getRuntime();
  const h = getHelpers();
  handwriting.stopHandwritingTimer();
  runtime.state.handwriting.timerId = runtime.global.setInterval(() => {
    if (!runtime.state.handwriting.active) return;
    runtime.state.handwriting.elapsedSeconds = Math.max(0, Math.floor((Date.now() - runtime.state.handwriting.startMs) / 1000));
    if (runtime.state.mode === "handwriting") {
      h.renderSessionHeader?.();
    }
  }, 1000);
};

handwriting.stopHandwritingTimer = handwriting.stopHandwritingTimer || function stopHandwritingTimer() {
  const runtime = getRuntime();
  if (!runtime.state.handwriting?.timerId) return;
  runtime.global.clearInterval(runtime.state.handwriting.timerId);
  runtime.state.handwriting.timerId = null;
};

function getThemeColor(name, fallback) {
  const doc = getRuntime().global?.document || global.document;
  const value = doc?.body ? doc.defaultView.getComputedStyle(doc.body).getPropertyValue(name) : "";
  return value?.trim() || fallback;
}

function repaintStage() {
  const runtime = getRuntime();
  const ctxState = runtime.state.handwriting;
  const letterform = getCurrentLetterform();
  if (!stage?.canvas || !letterform) return;

  const canvas = stage.canvas;
  const draw = stage.drawCtx;
  const size = canvas.width;
  if (!size) return;

  draw.clearRect(0, 0, size, size);
  const toX = (x) => x * size;
  const toY = (y) => y * size;

  const lineColor = getThemeColor("--line-strong", "rgba(160, 174, 192, 0.4)");
  const inkColor = getThemeColor("--ink", "#F4F7FB");
  const brandColor = getThemeColor("--brand", "#F4C430");
  const okColor = getThemeColor("--ok", "#58b57d");
  const errorColor = getThemeColor("--error", "#E63946");

  draw.save();
  draw.strokeStyle = lineColor;
  draw.lineWidth = Math.max(1, size * 0.004);
  draw.setLineDash([size * 0.02, size * 0.02]);
  [GUIDE_TOPLINE, GUIDE_BASELINE, GUIDE_DESCENDER].forEach((y) => {
    draw.beginPath();
    draw.moveTo(toX(0.04), toY(y));
    draw.lineTo(toX(0.96), toY(y));
    draw.stroke();
  });
  draw.restore();

  draw.save();
  draw.strokeStyle = brandColor;
  draw.globalAlpha = 0.28;
  draw.lineWidth = size * 0.055;
  draw.lineCap = "round";
  draw.lineJoin = "round";
  (letterform.strokes || []).forEach((stroke) => {
    const points = stroke.points || [];
    if (points.length < 2) return;
    draw.beginPath();
    draw.moveTo(toX(points[0][0]), toY(points[0][1]));
    for (let i = 1; i < points.length; i += 1) {
      draw.lineTo(toX(points[i][0]), toY(points[i][1]));
    }
    draw.stroke();
  });
  draw.restore();

  draw.save();
  draw.fillStyle = brandColor;
  draw.globalAlpha = 0.85;
  const dotRadius = size * 0.024;
  (letterform.strokes || []).forEach((stroke, index) => {
    const start = stroke.points?.[0];
    if (!start) return;
    draw.beginPath();
    draw.arc(toX(start[0]), toY(start[1]), dotRadius, 0, Math.PI * 2);
    draw.fill();
    draw.save();
    draw.fillStyle = getThemeColor("--paper", "#0B132B");
    draw.font = `700 ${Math.round(size * 0.032)}px sans-serif`;
    draw.textAlign = "center";
    draw.textBaseline = "middle";
    draw.fillText(String(index + 1), toX(start[0]), toY(start[1]));
    draw.restore();
  });
  draw.restore();

  draw.save();
  draw.strokeStyle = ctxState.lastTone === "success" ? okColor : ctxState.lastTone === "error" ? errorColor : inkColor;
  draw.lineWidth = size * 0.02;
  draw.lineCap = "round";
  draw.lineJoin = "round";
  (ctxState.currentStrokes || []).forEach((stroke) => {
    const points = stroke.points || [];
    if (!points.length) return;
    draw.beginPath();
    draw.moveTo(toX(points[0][0]), toY(points[0][1]));
    for (let i = 1; i < points.length; i += 1) {
      draw.lineTo(toX(points[i][0]), toY(points[i][1]));
    }
    if (points.length === 1) {
      draw.lineTo(toX(points[0][0]) + 0.1, toY(points[0][1]));
    }
    draw.stroke();
  });
  draw.restore();
}

function resizeStageCanvas() {
  if (!stage?.canvas || !stage?.wrap) return;
  const runtime = getRuntime();
  const dpr = runtime.global?.devicePixelRatio || 1;
  const cssSize = stage.wrap.clientWidth;
  if (!cssSize) return;
  const pixelSize = Math.round(cssSize * dpr);
  if (stage.canvas.width !== pixelSize) {
    stage.canvas.width = pixelSize;
    stage.canvas.height = pixelSize;
  }
  stage.cssSize = cssSize;
  repaintStage();
}

function normalizedPointFromEvent(event) {
  if (!stage?.canvas) return null;
  const rect = stage.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  return [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
}

function appendStrokePoint(points, point) {
  const last = points[points.length - 1];
  if (last) {
    const dx = point[0] - last[0];
    const dy = point[1] - last[1];
    if (Math.sqrt(dx * dx + dy * dy) < MIN_POINT_GAP) return;
  }
  points.push(point);
}

function handlePointerDown(event) {
  const ctx = getRuntime().state.handwriting;
  if (!ctx?.active || ctx.isResolving || ctx.introActive) return;
  event.preventDefault();
  try {
    stage.canvas.setPointerCapture?.(event.pointerId);
  } catch (error) {
    // pointer may already be released; capture is best-effort
  }
  const point = normalizedPointFromEvent(event);
  if (!point) return;
  if (ctx.lastTone === "error") {
    ctx.lastTone = "";
  }
  stage.activePointerId = event.pointerId;
  stage.activePoints = [point];
  repaintStage();
}

function handlePointerMove(event) {
  if (stage?.activePointerId !== event.pointerId || !stage.activePoints) return;
  event.preventDefault();
  const events = typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [event];
  (events.length ? events : [event]).forEach((sample) => {
    const point = normalizedPointFromEvent(sample);
    if (point) appendStrokePoint(stage.activePoints, point);
  });
  repaintStageWithActiveStroke();
}

function repaintStageWithActiveStroke() {
  const ctx = getRuntime().state.handwriting;
  if (!stage?.activePoints) {
    repaintStage();
    return;
  }
  const snapshot = ctx.currentStrokes || [];
  ctx.currentStrokes = [...snapshot, { points: stage.activePoints }];
  repaintStage();
  ctx.currentStrokes = snapshot;
}

function handlePointerEnd(event) {
  if (stage?.activePointerId !== event.pointerId) return;
  const ctx = getRuntime().state.handwriting;
  const core = getCore();
  const points = stage.activePoints || [];
  stage.activePointerId = null;
  stage.activePoints = null;

  if (ctx?.active && points.length >= 2 && (core.pathLength?.(points) || 0) >= MIN_STROKE_LENGTH) {
    ctx.currentStrokes = [...(ctx.currentStrokes || []), { points }];
  }
  repaintStage();
  updateToolbarState();
  maybeAutoCheck();
}

function maybeAutoCheck() {
  const ctx = getRuntime().state.handwriting;
  const core = getCore();
  const letterform = getCurrentLetterform();
  if (!ctx?.active || ctx.isResolving || !letterform) return;
  const templateLength = (letterform.strokes || []).reduce((sum, stroke) => sum + (core.pathLength?.(stroke.points) || 0), 0);
  const userLength = (ctx.currentStrokes || []).reduce((sum, stroke) => sum + (core.pathLength?.(stroke.points) || 0), 0);
  if (templateLength > 0 && userLength >= templateLength * AUTO_CHECK_LENGTH_RATIO) {
    handwriting.checkHandwritingAttempt();
  }
}

function recordCellOutcome(pass, score) {
  const ctx = getRuntime().state.handwriting;
  const cell = getCurrentCell();
  if (!ctx || !cell?.letterformId || ctx.cellRecorded) return;
  ctx.cellRecorded = true;
  if (pass) {
    ctx.correctCount += 1;
  } else {
    ctx.mismatchCount += 1;
    if (!ctx.sessionMistakeIds.includes(cell.letterformId)) {
      ctx.sessionMistakeIds.push(cell.letterformId);
    }
  }
  handwriting.updateHandwritingProgress(cell.letterformId, {
    pass,
    score,
    submode: "sentence",
    nowMs: Date.now(),
  });
}

handwriting.checkHandwritingAttempt = handwriting.checkHandwritingAttempt || function checkHandwritingAttempt() {
  const runtime = getRuntime();
  const h = getHelpers();
  const core = getCore();
  const ctx = runtime.state.handwriting;
  const letterform = getCurrentLetterform();
  if (!ctx?.active || ctx.isResolving || !letterform || !(ctx.currentStrokes || []).length) return;

  const result = core.scoreTrace?.(ctx.currentStrokes, letterform.strokes, {
    passScore: runtime.constants?.HANDWRITING_TRACE_PASS_SCORE,
  }) || { score: 0, pass: false };

  if (result.pass) {
    ctx.lastTone = "success";
    ctx.isResolving = true;
    recordCellOutcome(ctx.attemptsThisCell === 0, result.score);
    h.setFeedback?.({
      tone: "success",
      sentence: translate("handwriting.feedbackPass", { score: result.score }),
      detail: "",
    });
    h.playAnswerFeedbackSound?.(true);
    repaintStage();
    updateToolbarState();
    runtime.global.setTimeout(() => handwriting.advanceHandwritingCell(), ADVANCE_DELAY_MS);
    return;
  }

  ctx.lastTone = "error";
  ctx.attemptsThisCell += 1;
  if (ctx.attemptsThisCell === 1) {
    recordCellOutcome(false, result.score);
  }
  h.setFeedback?.({
    tone: "error",
    sentence: translate("handwriting.feedbackRetry", { score: result.score }),
    detail: letterform.tipEn && runtime.state.language !== "he" ? letterform.tipEn : (letterform.tipHe || letterform.tipEn || ""),
  });
  h.playAnswerFeedbackSound?.(false);
  repaintStage();
  updateToolbarState();
};

handwriting.undoHandwritingStroke = handwriting.undoHandwritingStroke || function undoHandwritingStroke() {
  const ctx = getRuntime().state.handwriting;
  if (!ctx?.active || ctx.isResolving || !(ctx.currentStrokes || []).length) return;
  ctx.currentStrokes = ctx.currentStrokes.slice(0, -1);
  ctx.lastTone = "";
  getHelpers().clearFeedback?.();
  repaintStage();
  updateToolbarState();
};

handwriting.clearHandwritingCanvas = handwriting.clearHandwritingCanvas || function clearHandwritingCanvas() {
  const ctx = getRuntime().state.handwriting;
  if (!ctx?.active || ctx.isResolving) return;
  ctx.currentStrokes = [];
  ctx.lastTone = "";
  getHelpers().clearFeedback?.();
  repaintStage();
  updateToolbarState();
};

handwriting.skipHandwritingLetter = handwriting.skipHandwritingLetter || function skipHandwritingLetter() {
  const ctx = getRuntime().state.handwriting;
  if (!ctx?.active || ctx.isResolving) return;
  recordCellOutcome(false, 0);
  handwriting.advanceHandwritingCell();
};

handwriting.advanceHandwritingCell = handwriting.advanceHandwritingCell || function advanceHandwritingCell() {
  const runtime = getRuntime();
  const h = getHelpers();
  const ctx = runtime.state.handwriting;
  if (!ctx?.active) return;

  ctx.currentStrokes = [];
  ctx.attemptsThisCell = 0;
  ctx.cellRecorded = false;
  ctx.lastTone = "";
  ctx.isResolving = false;
  h.clearFeedback?.();

  const round = getCurrentRound();
  const next = round ? nextLetterCellIndex(round.cells, ctx.cellIndex + 1) : -1;
  if (next === -1) {
    handwriting.advanceHandwritingRound();
    return;
  }
  ctx.cellIndex = next;
  handwriting.renderHandwritingRound();
  h.renderSessionHeader?.();
};

handwriting.advanceHandwritingRound = handwriting.advanceHandwritingRound || function advanceHandwritingRound() {
  const runtime = getRuntime();
  const h = getHelpers();
  const ctx = runtime.state.handwriting;
  if (!ctx?.active) return;

  ctx.roundIndex += 1;
  if (ctx.roundIndex >= ctx.totalRounds) {
    handwriting.finishHandwriting();
    return;
  }
  const round = getCurrentRound();
  ctx.cellIndex = Math.max(0, nextLetterCellIndex(round.cells, 0));
  handwriting.renderHandwritingRound();
  h.renderSessionHeader?.();
};

function buildLetterSummaryEntries(ids) {
  return ids
    .map((id) => getLetterformById(id))
    .filter(Boolean)
    .map((form) => ({
      primary: form.letter,
      secondary: getLetterformName(form),
    }));
}

handwriting.finishHandwriting = handwriting.finishHandwriting || function finishHandwriting() {
  const runtime = getRuntime();
  const ctx = runtime.state.handwriting;
  const correct = ctx.correctCount;
  const wrong = ctx.mismatchCount;
  const total = correct + wrong;
  const elapsed = ctx.elapsedSeconds;
  const sentences = ctx.totalRounds;
  const mistakeIds = ctx.sessionMistakeIds.slice();
  const mistakeSet = new Set(mistakeIds);
  const practicedIds = [...new Set(
    ctx.rounds.flatMap((round) => round.cells.filter((cell) => cell.letterformId).map((cell) => cell.letterformId))
  )];
  const correctIds = practicedIds.filter((id) => !mistakeSet.has(id));

  handwriting.stopHandwritingTimer();
  ctx.active = false;
  handwriting.resetHandwritingState();

  getSession().showSessionSummary?.({
    game: "handwriting",
    titleKey: "summary.handwritingTitle",
    scoreKey: "summary.score",
    scoreVars: { score: correct, total },
    noteKey: "summary.handwritingNote",
    noteVars: { sentences },
    correctCount: correct,
    incorrectCount: wrong,
    elapsedSeconds: elapsed,
    mistakes: buildLetterSummaryEntries(mistakeIds),
    corrects: buildLetterSummaryEntries(correctIds),
  });
};

function updateToolbarState() {
  const ctx = getRuntime().state.handwriting;
  if (!stage?.toolbar) return;
  const hasInk = Boolean((ctx?.currentStrokes || []).length);
  const busy = Boolean(ctx?.isResolving);
  if (stage.undoBtn) stage.undoBtn.disabled = !hasInk || busy;
  if (stage.clearBtn) stage.clearBtn.disabled = !hasInk || busy;
  if (stage.checkBtn) stage.checkBtn.disabled = !hasInk || busy;
  if (stage.skipBtn) stage.skipBtn.disabled = busy;
}

function buildStage(container) {
  const runtime = getRuntime();
  const doc = runtime.global?.document || global.document;

  const wrap = doc.createElement("div");
  wrap.className = "handwriting-stage";

  const canvas = doc.createElement("canvas");
  canvas.className = "handwriting-canvas";
  wrap.appendChild(canvas);

  const toolbar = doc.createElement("div");
  toolbar.className = "handwriting-toolbar";

  const undoBtn = doc.createElement("button");
  undoBtn.type = "button";
  undoBtn.className = "quiet handwriting-tool-btn";
  undoBtn.addEventListener("click", () => handwriting.undoHandwritingStroke());

  const clearBtn = doc.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "quiet handwriting-tool-btn";
  clearBtn.addEventListener("click", () => handwriting.clearHandwritingCanvas());

  const skipBtn = doc.createElement("button");
  skipBtn.type = "button";
  skipBtn.className = "quiet handwriting-tool-btn";
  skipBtn.addEventListener("click", () => handwriting.skipHandwritingLetter());

  const checkBtn = doc.createElement("button");
  checkBtn.type = "button";
  checkBtn.className = "accent handwriting-tool-btn";
  checkBtn.addEventListener("click", () => handwriting.checkHandwritingAttempt());

  toolbar.appendChild(undoBtn);
  toolbar.appendChild(clearBtn);
  toolbar.appendChild(skipBtn);
  toolbar.appendChild(checkBtn);
  wrap.appendChild(toolbar);
  container.appendChild(wrap);

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerEnd);
  canvas.addEventListener("pointercancel", handlePointerEnd);

  stage = {
    wrap,
    canvas,
    toolbar,
    undoBtn,
    clearBtn,
    skipBtn,
    checkBtn,
    drawCtx: canvas.getContext("2d"),
    activePointerId: null,
    activePoints: null,
    resizeObserver: null,
  };

  if (typeof runtime.global?.ResizeObserver === "function") {
    stage.resizeObserver = new runtime.global.ResizeObserver(() => resizeStageCanvas());
    stage.resizeObserver.observe(wrap);
  }
  resizeStageCanvas();
}

function applyToolbarLabels() {
  if (!stage) return;
  stage.undoBtn.textContent = translate("handwriting.undo");
  stage.clearBtn.textContent = translate("handwriting.clear");
  stage.skipBtn.textContent = translate("handwriting.skip");
  stage.checkBtn.textContent = translate("handwriting.check");
}

function renderSentencePrompt(round) {
  const runtime = getRuntime();
  const doc = runtime.global?.document || global.document;
  const ctx = runtime.state.handwriting;

  if (runtime.el.promptRootEmoji) {
    runtime.el.promptRootEmoji.textContent = "";
    runtime.el.promptRootEmoji.classList.add("hidden");
  }
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptCard?.classList.remove("prompt-card--audio");

  const promptText = runtime.el.promptText;
  if (!promptText) return;
  promptText.classList.remove("hidden", "english-prompt", "hebrew");
  promptText.classList.add("handwriting-prompt");
  promptText.dir = "ltr";
  promptText.removeAttribute("lang");
  promptText.innerHTML = "";

  const line = doc.createElement("span");
  line.className = "handwriting-line";
  line.dir = "rtl";
  line.setAttribute("lang", "he");
  round.cells.forEach((cell, index) => {
    const span = doc.createElement("span");
    span.textContent = cell.char;
    if (cell.letterformId) {
      span.className = "hw-cell";
      if (index === ctx.cellIndex) {
        span.classList.add("current");
      } else if (index < ctx.cellIndex) {
        span.classList.add("done");
      }
    }
    line.appendChild(span);
  });
  promptText.appendChild(line);

  if (round.english) {
    const en = doc.createElement("span");
    en.className = "handwriting-en";
    en.dir = "ltr";
    en.textContent = round.english;
    promptText.appendChild(en);
  }
}

handwriting.renderHandwritingRound = handwriting.renderHandwritingRound || function renderHandwritingRound() {
  const runtime = getRuntime();
  const h = getHelpers();
  const ctx = runtime.state.handwriting;
  const round = getCurrentRound();
  const letterform = getCurrentLetterform();

  if (!ctx?.active || !round || !letterform) {
    handwriting.renderHandwritingIdleState();
    return;
  }

  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  h.renderSessionHeader?.();

  renderSentencePrompt(round);

  const container = runtime.el.choiceContainer;
  container.classList.remove("summary-grid", "match-grid", "match-bubble-grid", "binyan-board-grid");

  const stageAttached = Boolean(stage?.wrap && container.contains(stage.wrap));
  if (!stageAttached) {
    destroyStage();
    container.innerHTML = "";
    buildStage(container);
  }

  applyToolbarLabels();
  updateToolbarState();
  resizeStageCanvas();
  app.ui?.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

handwriting.renderHandwritingIdleState = handwriting.renderHandwritingIdleState || function renderHandwritingIdleState() {
  const runtime = getRuntime();
  const h = getHelpers();
  destroyStage();
  h.setGamePickerVisibility?.(false);
  h.setPromptCardVisibility?.(true);
  h.renderSessionHeader?.();
  app.ui?.renderPromptLabel?.("", false);
  runtime.el.promptCard?.classList.remove("prompt-card--audio");
  if (runtime.el.promptText) {
    runtime.el.promptText.classList.remove("hebrew", "hidden", "handwriting-prompt");
    runtime.el.promptText.classList.add("english-prompt");
    runtime.el.promptText.textContent = translate("prompt.handwritingStart");
  }
  runtime.el.choiceContainer.innerHTML = "";
  runtime.el.choiceContainer.classList.remove("match-grid", "match-bubble-grid", "binyan-board-grid");
  h.renderNiqqudToggle?.();
  app.ui?.renderPromptSpeechButton?.();
};

})(typeof window !== "undefined" ? window : globalThis);

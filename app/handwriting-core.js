(function initIvriQuestAppHandwritingCore(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const handwritingCore = app.handwritingCore = app.handwritingCore || {};

const DEFAULT_SAMPLE_SPACING = 1 / 64;
const DEFAULT_COVERAGE_RADIUS = 0.06;
const DEFAULT_PRECISION_RADIUS = 0.09;
const DEFAULT_PASS_SCORE = 75;
const DEFAULT_MIN_COVERAGE = 0.85;

function toPoint(entry) {
  return [Number(entry?.[0] || 0), Number(entry?.[1] || 0)];
}

function distance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function pointToSegmentDistance(point, segStart, segEnd) {
  const vx = segEnd[0] - segStart[0];
  const vy = segEnd[1] - segStart[1];
  const wx = point[0] - segStart[0];
  const wy = point[1] - segStart[1];
  const lengthSq = vx * vx + vy * vy;
  if (lengthSq === 0) return distance(point, segStart);
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / lengthSq));
  return distance(point, [segStart[0] + t * vx, segStart[1] + t * vy]);
}

handwritingCore.pathLength = handwritingCore.pathLength || function pathLength(points) {
  const list = Array.isArray(points) ? points.map(toPoint) : [];
  let total = 0;
  for (let i = 1; i < list.length; i += 1) {
    total += distance(list[i - 1], list[i]);
  }
  return total;
};

handwritingCore.shouldAutoCheck = handwritingCore.shouldAutoCheck || function shouldAutoCheck(userStrokes, templateStrokes, lengthRatio) {
  const user = Array.isArray(userStrokes) ? userStrokes : [];
  const template = Array.isArray(templateStrokes) ? templateStrokes : [];
  if (!template.length || user.length < template.length) return false;
  const templateLength = template.reduce((sum, stroke) => sum + handwritingCore.pathLength(stroke?.points), 0);
  const userLength = user.reduce((sum, stroke) => sum + handwritingCore.pathLength(stroke?.points), 0);
  return templateLength > 0 && userLength >= templateLength * lengthRatio;
};

handwritingCore.resamplePoints = handwritingCore.resamplePoints || function resamplePoints(points, count) {
  const list = Array.isArray(points) ? points.map(toPoint) : [];
  const target = Math.max(2, Math.floor(count || 0));
  if (!list.length) return [];
  if (list.length === 1) return Array.from({ length: target }, () => list[0].slice());

  const total = handwritingCore.pathLength(list);
  if (total === 0) return Array.from({ length: target }, () => list[0].slice());

  const step = total / (target - 1);
  const resampled = [list[0].slice()];
  let carried = 0;
  for (let i = 1; i < list.length; i += 1) {
    let prev = list[i - 1];
    const current = list[i];
    let segment = distance(prev, current);
    while (carried + segment >= step && segment > 0) {
      const ratio = (step - carried) / segment;
      const next = [prev[0] + ratio * (current[0] - prev[0]), prev[1] + ratio * (current[1] - prev[1])];
      resampled.push(next);
      prev = next;
      segment = distance(prev, current);
      carried = 0;
    }
    carried += segment;
  }
  while (resampled.length < target) {
    resampled.push(list[list.length - 1].slice());
  }
  return resampled.slice(0, target);
};

function sampleStrokesBySpacing(strokes, spacing) {
  const sampled = [];
  (Array.isArray(strokes) ? strokes : []).forEach((stroke, strokeIndex) => {
    const points = Array.isArray(stroke?.points) ? stroke.points : [];
    if (points.length < 2) return;
    const length = handwritingCore.pathLength(points);
    const count = Math.max(2, Math.ceil(length / spacing) + 1);
    handwritingCore.resamplePoints(points, count).forEach((point) => {
      sampled.push({ point, strokeIndex });
    });
  });
  return sampled;
}

handwritingCore.scoreTrace = handwritingCore.scoreTrace || function scoreTrace(userStrokes, templateStrokes, options = {}) {
  const spacing = options.spacing || DEFAULT_SAMPLE_SPACING;
  const coverageRadius = options.coverageRadius || DEFAULT_COVERAGE_RADIUS;
  const precisionRadius = options.precisionRadius || DEFAULT_PRECISION_RADIUS;
  const passScore = Number.isFinite(options.passScore) ? options.passScore : DEFAULT_PASS_SCORE;
  const minCoverage = Number.isFinite(options.minCoverage) ? options.minCoverage : DEFAULT_MIN_COVERAGE;

  const templateSamples = sampleStrokesBySpacing(templateStrokes, spacing);
  const userSamples = sampleStrokesBySpacing(userStrokes, spacing);
  if (!templateSamples.length || !userSamples.length) {
    return { coverage: 0, precision: 0, score: 0, pass: false };
  }

  let covered = 0;
  templateSamples.forEach((sample) => {
    const hit = userSamples.some((candidate) => distance(sample.point, candidate.point) <= coverageRadius);
    if (hit) covered += 1;
  });
  const coverage = covered / templateSamples.length;

  const templateSegments = [];
  (Array.isArray(templateStrokes) ? templateStrokes : []).forEach((stroke) => {
    const points = (Array.isArray(stroke?.points) ? stroke.points : []).map(toPoint);
    for (let i = 1; i < points.length; i += 1) {
      templateSegments.push([points[i - 1], points[i]]);
    }
  });
  let precise = 0;
  userSamples.forEach((sample) => {
    const near = templateSegments.some((segment) => pointToSegmentDistance(sample.point, segment[0], segment[1]) <= precisionRadius);
    if (near) precise += 1;
  });
  const precision = precise / userSamples.length;

  const score = Math.round(100 * (0.7 * coverage + 0.3 * precision));
  const pass = score >= passScore && coverage >= minCoverage;
  return { coverage, precision, score, pass };
};

handwritingCore.normalizeProgressEntry = handwritingCore.normalizeProgressEntry || function normalizeProgressEntry(entry) {
  const source = entry && typeof entry === "object" ? entry : {};
  const attempts = Math.max(0, Math.floor(Number(source.attempts) || 0));
  return {
    attempts,
    correct: Math.max(0, Math.min(attempts, Math.floor(Number(source.correct) || 0))),
    box: Math.max(0, Math.min(7, Math.floor(Number(source.box) || 0))),
    streak: Math.max(0, Math.floor(Number(source.streak) || 0)),
    lastSeenMs: Math.max(0, Number(source.lastSeenMs) || 0),
    lastScore: Math.max(0, Math.min(100, Math.round(Number(source.lastScore) || 0))),
    testAttempts: Math.max(0, Math.floor(Number(source.testAttempts) || 0)),
    testCorrect: Math.max(0, Math.floor(Number(source.testCorrect) || 0)),
  };
};

handwritingCore.rankWeakestLetters = handwritingCore.rankWeakestLetters || function rankWeakestLetters(progressMap, letterforms, options = {}) {
  const minAttempts = Math.max(1, Math.floor(Number.isFinite(options.minAttempts) ? options.minAttempts : 2));
  const limit = Math.max(0, Math.floor(Number.isFinite(options.limit) ? options.limit : 8));
  const source = progressMap && typeof progressMap === "object" ? progressMap : {};
  const entries = [];
  (Array.isArray(letterforms) ? letterforms : []).forEach((form) => {
    if (!form?.id || !(form.id in source)) return;
    const entry = handwritingCore.normalizeProgressEntry(source[form.id]);
    if (entry.attempts < minAttempts) return;
    entries.push({ form, entry });
  });
  entries.sort((a, b) => {
    if (a.entry.box !== b.entry.box) return a.entry.box - b.entry.box;
    if (a.entry.lastScore !== b.entry.lastScore) return a.entry.lastScore - b.entry.lastScore;
    return (a.form.order || 0) - (b.form.order || 0);
  });
  return entries.slice(0, limit);
};

handwritingCore.countLearnedLetters = handwritingCore.countLearnedLetters || function countLearnedLetters(progressMap, threshold = 3) {
  const source = progressMap && typeof progressMap === "object" ? progressMap : {};
  return Object.values(source).filter((entry) => handwritingCore.normalizeProgressEntry(entry).box >= threshold).length;
};

handwritingCore.applyAttemptToProgress = handwritingCore.applyAttemptToProgress || function applyAttemptToProgress(entry, result = {}) {
  const normalized = handwritingCore.normalizeProgressEntry(entry);
  const pass = Boolean(result.pass);
  const next = {
    ...normalized,
    attempts: normalized.attempts + 1,
    correct: normalized.correct + (pass ? 1 : 0),
    box: pass ? Math.min(7, normalized.box + 1) : Math.max(0, normalized.box - 1),
    streak: pass ? normalized.streak + 1 : 0,
    lastSeenMs: Math.max(0, Number(result.nowMs) || 0),
    lastScore: Math.max(0, Math.min(100, Math.round(Number(result.score) || 0))),
  };
  if (result.submode === "test") {
    next.testAttempts = normalized.testAttempts + 1;
    next.testCorrect = normalized.testCorrect + (pass ? 1 : 0);
  }
  return next;
};

handwritingCore.pickHandwritingSession = handwritingCore.pickHandwritingSession || function pickHandwritingSession(progressMap, letterforms, options = {}) {
  const rounds = Math.max(1, Math.floor(options.rounds || 10));
  const maxNew = Math.max(0, Math.floor(Number.isFinite(options.maxNew) ? options.maxNew : 2));
  const nowMs = Math.max(0, Number(options.nowMs) || 0);
  const intervals = Array.isArray(options.intervals) && options.intervals.length ? options.intervals : [0];
  const forms = (Array.isArray(letterforms) ? letterforms : []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const progress = progressMap && typeof progressMap === "object" ? progressMap : {};

  const attempted = [];
  const fresh = [];
  forms.forEach((form) => {
    const entry = handwritingCore.normalizeProgressEntry(progress[form.id]);
    if (entry.attempts > 0) {
      attempted.push({ form, entry });
    } else {
      fresh.push(form);
    }
  });

  const picked = [];
  const pickedIds = new Set();
  const pick = (form, isNew) => {
    if (!form || pickedIds.has(form.id) || picked.length >= rounds) return;
    pickedIds.add(form.id);
    picked.push({ type: "letter", letterformId: form.id, isNew });
  };

  fresh.slice(0, maxNew).forEach((form) => pick(form, true));

  const due = attempted
    .filter(({ entry }) => {
      const interval = intervals[Math.min(entry.box, intervals.length - 1)];
      return entry.lastSeenMs + interval <= nowMs;
    })
    .sort((a, b) => (a.entry.box - b.entry.box) || (a.entry.lastScore - b.entry.lastScore));
  due.forEach(({ form }) => pick(form, false));

  const fallback = attempted
    .slice()
    .sort((a, b) => (a.entry.box - b.entry.box) || (a.entry.lastSeenMs - b.entry.lastSeenMs));
  fallback.forEach(({ form }) => pick(form, false));

  if (picked.length && picked.length < rounds) {
    let cursor = 0;
    while (picked.length < rounds) {
      const base = picked[cursor % pickedIds.size];
      picked.push({ type: "letter", letterformId: base.letterformId, isNew: false });
      cursor += 1;
    }
  }

  return picked.slice(0, rounds);
};

handwritingCore.letterformIdsForWord = handwritingCore.letterformIdsForWord || function letterformIdsForWord(text, charToId) {
  const map = charToId && typeof charToId === "object" ? charToId : {};
  return Array.from(String(text || ""))
    .map((char) => map[char])
    .filter(Boolean);
};

handwritingCore.buildSentenceCells = handwritingCore.buildSentenceCells || function buildSentenceCells(text, charToId) {
  const map = charToId && typeof charToId === "object" ? charToId : {};
  return Array.from(String(text || "")).map((char) => ({
    char,
    letterformId: map[char] || null,
  }));
};

handwritingCore.countLetterCells = handwritingCore.countLetterCells || function countLetterCells(cells) {
  return (Array.isArray(cells) ? cells : []).reduce((total, cell) => total + (cell && cell.letterformId ? 1 : 0), 0);
};

})(typeof window !== "undefined" ? window : globalThis);

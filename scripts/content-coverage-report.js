// Conservative vocabulary-to-sentence coverage report. A card is counted as
// exact when its normalized Hebrew headword appears in a sentence target with
// only ordinary attached clitics added. Reviewed aliases cover inflection or
// construct-state relationships that cannot be inferred safely.

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const HEBREW_CLITICS = new Set(["ה", "ו", "ב", "כ", "ל", "מ", "ש"]);

// Keyed by vocabulary id. Each value lists sentence ids whose target text was
// manually reviewed as testing an inflected or construct form of the card.
// Exact surface matches belong in the derived tier and must not be added here.
const REVIEWED_SENTENCE_SUPPORT = Object.freeze({});

function loadInSandbox(relativePath) {
  const context = { console };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, relativePath), "utf8"),
    context,
    { filename: relativePath },
  );
  return context;
}

function normalizeHebrew(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0591-\u05c7]/g, "")
    .replace(/[״"'׳’.,!?;:()[\]{}]/g, "")
    .replace(/[־–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function surfaceMatchesHeadword(surface, headword) {
  if (surface === headword) return true;
  let candidate = surface;
  for (let depth = 0; depth < 3 && candidate.length > headword.length; depth += 1) {
    if (!HEBREW_CLITICS.has(candidate[0])) break;
    candidate = candidate.slice(1);
    if (candidate === headword) return true;
  }
  return false;
}

function sentenceTestsHeadword(sentence, headword) {
  const sentenceWords = normalizeHebrew(sentence.hebrew).split(" ").filter(Boolean);
  const headwordWords = normalizeHebrew(headword).split(" ").filter(Boolean);
  if (!headwordWords.length || sentenceWords.length < headwordWords.length) return false;

  for (let start = 0; start <= sentenceWords.length - headwordWords.length; start += 1) {
    if (headwordWords.every((word, offset) => surfaceMatchesHeadword(sentenceWords[start + offset], word))) {
      return true;
    }
  }
  return false;
}

function buildCoverageReport({ vocabulary, sentences, reviewedSupport = REVIEWED_SENTENCE_SUPPORT }) {
  const sentenceById = new Map(sentences.map((sentence) => [sentence.id, sentence]));
  const records = vocabulary.map((word) => {
    const exactSentenceIds = sentences
      .filter((sentence) => sentenceTestsHeadword(sentence, word.he))
      .map((sentence) => sentence.id);
    const reviewedSentenceIds = Array.from(reviewedSupport[word.id] || []);
    reviewedSentenceIds.forEach((sentenceId) => {
      if (!sentenceById.has(sentenceId)) {
        throw new Error(`${word.id} reviews missing sentence ${sentenceId}`);
      }
    });
    const status = exactSentenceIds.length
      ? "exact"
      : reviewedSentenceIds.length
        ? "reviewed"
        : "unsupported";
    return { word, status, exactSentenceIds, reviewedSentenceIds };
  });

  const categories = new Map();
  records.forEach((record) => {
    const row = categories.get(record.word.category) || { total: 0, exact: 0, reviewed: 0, unsupported: 0 };
    row.total += 1;
    row[record.status] += 1;
    categories.set(record.word.category, row);
  });

  return { records, categories };
}

function loadProductionContent() {
  const vocabulary = loadInSandbox("vocab-data.js").IvriQuestVocab.getBaseVocabulary();
  const sentences = loadInSandbox("sentence-bank-data.js").IvriQuestSentenceBank.getSentenceBank();
  return { vocabulary, sentences };
}

function printReport(report) {
  const rows = Array.from(report.categories, ([category, counts]) => ({
    category,
    ...counts,
    coverage: `${(((counts.exact + counts.reviewed) / counts.total) * 100).toFixed(1)}%`,
  })).sort((left, right) => (
    (left.exact + left.reviewed) / left.total - (right.exact + right.reviewed) / right.total
  ));
  console.log("Vocabulary sentence support (conservative)");
  console.table(rows);
  const totals = report.records.reduce((sum, record) => {
    sum[record.status] += 1;
    return sum;
  }, { exact: 0, reviewed: 0, unsupported: 0 });
  console.log(`Total: ${report.records.length}; exact ${totals.exact}; reviewed ${totals.reviewed}; unsupported ${totals.unsupported}`);
}

if (require.main === module) {
  printReport(buildCoverageReport(loadProductionContent()));
}

module.exports = {
  REVIEWED_SENTENCE_SUPPORT,
  normalizeHebrew,
  sentenceTestsHeadword,
  buildCoverageReport,
  loadProductionContent,
};

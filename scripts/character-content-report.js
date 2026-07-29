// Reports how much routed content each character owns, so imbalance between
// characters is visible before it is felt in play. Reads the route tables in
// app/character-data.js, so characters added later are picked up automatically.
//
//   npm run report:characters
//
// This is an instrument, not a gate: it never fails on imbalance. Itamar is
// specified to own no topic area, and a character mid-authoring will read low.

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PROJECT_ROOT = path.resolve(__dirname, "..");

function loadInSandbox(relativePaths) {
  const context = { console };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  relativePaths.forEach((relativePath) => {
    vm.runInContext(
      fs.readFileSync(path.join(PROJECT_ROOT, relativePath), "utf8"),
      context,
      { filename: relativePath },
    );
  });
  return context;
}

function ownsItem(route, kind, item) {
  if (!route || !item) return false;
  if (kind === "vocab") {
    return route.vocabCategories?.includes(item.category) === true ||
      route.vocabWords?.includes(item.he) === true;
  }
  if (kind === "abbreviation") return route.abbrBuckets?.includes(item.bucket) === true;
  if (kind === "verb") {
    const id = String(item.id || "");
    return route.verbIds?.some((verbId) => id === verbId || id.startsWith(`${verbId}--`)) === true;
  }
  if (kind === "sentence") {
    const id = String(item.id || "");
    return route.sentenceIdPrefixes?.some((prefix) => id.startsWith(prefix)) === true ||
      route.sentenceCategories?.includes(item.category) === true ||
      route.sentenceStyles?.includes(item.style) === true;
  }
  return false;
}

function buildReport() {
  const registry = loadInSandbox(["app/character-data.js"]).IvriQuestApp.characterData;
  const vocab = loadInSandbox(["vocab-data.js"]).IvriQuestVocab.getBaseVocabulary();
  const sentences = loadInSandbox(["sentence-bank-data.js"]).IvriQuestSentenceBank.getSentenceBank();
  const abbreviations = loadInSandbox(["abbreviation-data.js"]).IvriQuestAbbreviations.getAbbreviations();
  // The conjugation deck, not the seed entries: a route may name a single sense
  // ("character-verb-liklot--sense-2"), and only deck ids carry the sense
  // suffix. Counting entries would report a per-sense route as unrouted.
  const verbs = loadInSandbox(["hebrew-verbs.js"]).IvriQuestHebrewVerbs
    .buildVerbConjugationDeck({ vocabulary: [] });

  const pools = [
    { kind: "vocab", label: "Vocabulary", items: vocab },
    { kind: "sentence", label: "Sentences", items: sentences },
    { kind: "abbreviation", label: "Abbreviations", items: abbreviations },
    { kind: "verb", label: "Verbs", items: verbs },
  ];

  const characters = Object.values(registry.characters).sort((a, b) => a.order - b.order);
  const rows = characters.map((entry) => ({
    id: entry.id,
    nameEn: entry.nameEn,
    counts: Object.fromEntries(pools.map((pool) => [
      pool.kind,
      pool.items.filter((item) => ownsItem(entry.route, pool.kind, item)).length,
    ])),
  }));

  const unowned = Object.fromEntries(pools.map((pool) => [
    pool.kind,
    pool.items.filter((item) => !characters.some((entry) => ownsItem(entry.route, pool.kind, item))).length,
  ]));
  const multiOwned = Object.fromEntries(pools.map((pool) => [
    pool.kind,
    pool.items.filter((item) => characters.filter((entry) => ownsItem(entry.route, pool.kind, item)).length > 1).length,
  ]));

  return { pools, rows, unowned, multiOwned };
}

function pad(value, width, alignRight = false) {
  const text = String(value);
  return alignRight ? text.padStart(width) : text.padEnd(width);
}

function render({ pools, rows, unowned, multiOwned }) {
  const nameWidth = Math.max(9, ...rows.map((row) => row.nameEn.length));
  const colWidth = Math.max(13, ...pools.map((pool) => pool.label.length + 2));
  const lines = [];

  lines.push("Character content volume");
  lines.push("");
  lines.push([pad("Character", nameWidth), ...pools.map((p) => pad(p.label, colWidth, true)), pad("Total", 8, true)].join("  "));
  lines.push("-".repeat(nameWidth + (colWidth + 2) * pools.length + 10));

  const totals = rows.map((row) => pools.reduce((sum, pool) => sum + row.counts[pool.kind], 0));
  rows.forEach((row, index) => {
    const cells = pools.map((pool) => {
      const count = row.counts[pool.kind];
      const share = pool.items.length ? ((count / pool.items.length) * 100).toFixed(1) : "0.0";
      return pad(count ? `${count} (${share}%)` : "—", colWidth, true);
    });
    lines.push([pad(row.nameEn, nameWidth), ...cells, pad(totals[index], 8, true)].join("  "));
  });

  lines.push("-".repeat(nameWidth + (colWidth + 2) * pools.length + 10));
  lines.push([pad("pool size", nameWidth), ...pools.map((p) => pad(p.items.length, colWidth, true)), pad("", 8)].join("  "));
  lines.push([pad("unrouted", nameWidth), ...pools.map((p) => pad(unowned[p.kind], colWidth, true)), pad("", 8)].join("  "));
  lines.push([pad("multi-owner", nameWidth), ...pools.map((p) => pad(multiOwned[p.kind], colWidth, true)), pad("", 8)].join("  "));

  const active = totals.filter((total) => total > 0);
  if (active.length > 1) {
    const min = Math.min(...active);
    const max = Math.max(...active);
    lines.push("");
    lines.push(`Spread across routed characters: ${min}–${max} items (${(max / min).toFixed(1)}x).`);
    lines.push("Evenness is a goal, not a gate — this report never fails.");
  }

  return lines.join("\n");
}

if (require.main === module) {
  console.log(render(buildReport()));
}

module.exports = { buildReport, ownsItem };

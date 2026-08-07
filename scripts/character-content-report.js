// Reports how much routed content each character owns, so imbalance between
// characters is visible before it is felt in play. Reads the route tables in
// app/character-data.js, so characters added later are picked up automatically.
//
//   npm run report:characters
//
// This is an instrument, not a gate: it never fails on imbalance. A character
// mid-authoring will read low, and `civil_defense_safety` is deliberately routed
// to the whole cast, so it inflates every character's vocabulary count by design.

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

  const { ownsItem, getItemAudience } = registry;
  const characters = Object.values(registry.characters).sort((a, b) => a.order - b.order);
  const rows = characters.map((entry) => ({
    id: entry.id,
    nameEn: entry.nameEn,
    counts: Object.fromEntries(pools.map((pool) => [
      pool.kind,
      pool.items.filter((item) => ownsItem(entry.route, pool.kind, item)).length,
    ])),
    // What the picker may actually draw for this character as new material:
    // the pool minus everything reserved to somebody else.
    available: Object.fromEntries(pools.map((pool) => [
      pool.kind,
      pool.items.filter((item) => {
        const audience = getItemAudience(pool.kind, item);
        return !Array.isArray(audience) || audience.includes(entry.id);
      }).length,
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
  // Items with a restricted audience. `castWide` is the complement: everything a
  // learner can meet whoever they picked today.
  const fenced = Object.fromEntries(pools.map((pool) => [
    pool.kind,
    pool.items.filter((item) => Array.isArray(getItemAudience(pool.kind, item))).length,
  ]));

  return { pools, rows, unowned, multiOwned, fenced };
}

function pad(value, width, alignRight = false) {
  const text = String(value);
  return alignRight ? text.padStart(width) : text.padEnd(width);
}

function render({ pools, rows, unowned, multiOwned, fenced }) {
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
  lines.push([pad("reserved", nameWidth), ...pools.map((p) => pad(fenced[p.kind], colWidth, true)), pad("", 8)].join("  "));

  // The counts above are ownership, which is what the depth-standard floors in
  // docs/character-gameplay-strategy.md are measured on. This second table is the
  // draw pool: what the picker may serve as new material once content reserved to
  // another character is withheld. Watch it for a character being starved.
  lines.push("");
  lines.push("Draw pool after withholding");
  lines.push("");
  lines.push([pad("Character", nameWidth), ...pools.map((p) => pad(p.label, colWidth, true)), pad("", 8)].join("  "));
  lines.push("-".repeat(nameWidth + (colWidth + 2) * pools.length + 10));
  rows.forEach((row) => {
    const cells = pools.map((pool) => {
      const count = row.available[pool.kind];
      const share = pool.items.length ? ((count / pool.items.length) * 100).toFixed(1) : "0.0";
      return pad(`${count} (${share}%)`, colWidth, true);
    });
    lines.push([pad(row.nameEn, nameWidth), ...cells, pad("", 8)].join("  "));
  });

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

module.exports = { buildReport };

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function runScriptInContext(scriptPath, context) {
  const source = fs.readFileSync(scriptPath, "utf8");
  vm.runInContext(source, context, { filename: scriptPath });
}

function loadAbbreviationContext() {
  const root = path.join(__dirname, "..");
  const context = { console, Math };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  runScriptInContext(path.join(root, "abbreviation-data.js"), context);
  runScriptInContext(path.join(root, "app", "abbreviation.js"), context);

  return context;
}

const PHASE_ONE_IDS = [
  "abbr-004",
  "abbr-005",
  "abbr-006",
  "abbr-010",
  "abbr-013",
  "abbr-014",
  "abbr-015",
  "abbr-016",
  "abbr-017",
  "abbr-018",
  "abbr-021",
  "abbr-024",
  "abbr-025",
  "abbr-026",
  "abbr-027",
  "abbr-083",
  "abbr-084",
  "abbr-085",
  "abbr-086",
  "abbr-087",
  "abbr-088",
  "abbr-093",
  "abbr-094",
  "abbr-096",
];

const PHASE_TWO_IDS = [
  "abbr-001",
  "abbr-002",
  "abbr-003",
  "abbr-079",
  "abbr-080",
  "abbr-089",
  "abbr-090",
  "abbr-091",
  "abbr-092",
  "abbr-097",
  "abbr-099",
  "abbr-100",
  "abbr-101",
  "abbr-102",
  "abbr-103",
  "abbr-104",
  "abbr-105",
  "abbr-173",
  "abbr-174",
  "abbr-176",
  "abbr-184",
  "abbr-185",
  "abbr-186",
  "abbr-207",
];

const PHASE_THREE_IDS = [
  "abbr-109",
  "abbr-112",
  "abbr-117",
  "abbr-118",
  "abbr-120",
  "abbr-126",
  "abbr-127",
  "abbr-129",
  "abbr-130",
  "abbr-131",
  "abbr-132",
];

const PHASE_FOUR_IDS = [
  "abbr-110",
  "abbr-111",
  "abbr-113",
  "abbr-172",
];

test("playable abbreviations use geresh or gereshayim and do not overlap exactly", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const playable = rows.filter((entry) => entry?.availability?.abbreviationQuiz !== false);

  assert.equal(playable.some((entry) => /\./.test(String(entry.abbr || ""))), false);

  const counts = new Map();
  playable.forEach((entry) => {
    const key = String(entry.abbr || "");
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1);
  assert.deepEqual(duplicates, []);
});

test("business-friendly collision handling keeps normalized business forms and suppresses overlaps", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const deck = context.IvriQuestApp.abbreviation.prepareAbbreviationDeck(rows);
  const deckIds = new Set(deck.map((entry) => entry.id));
  const byId = new Map(rows.map((entry) => [entry.id, entry]));

  assert.equal(byId.get("abbr-114")?.abbr, "ח״פ");
  assert.equal(byId.get("abbr-115")?.abbr, "ע״מ");
  assert.equal(byId.get("abbr-116")?.abbr, "ע״פ");

  ["abbr-019", "abbr-020", "abbr-022", "abbr-098", "abbr-135"].forEach((entryId) => {
    assert.equal(deckIds.has(entryId), false, `${entryId} should be hidden from the playable deck`);
  });

  ["abbr-114", "abbr-115", "abbr-116"].forEach((entryId) => {
    assert.equal(deckIds.has(entryId), true, `${entryId} should remain playable`);
  });
});

test("phase 1 abbreviation expansions include safe niqqud on the full expansion only", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));

  PHASE_ONE_IDS.forEach((entryId) => {
    const entry = byId.get(entryId);
    assert.ok(entry, `${entryId} should exist`);
    assert.ok(String(entry.expansionHeNiqqud || "").trim(), `${entryId} should have expansionHeNiqqud`);
    assert.equal(/[\u0591-\u05C7]/.test(String(entry.abbr || "")), false, `${entryId} abbreviation should not carry niqqud`);
  });
});

test("phase 2 abbreviation expansions include official-first niqqud on the full expansion only", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));

  PHASE_TWO_IDS.forEach((entryId) => {
    const entry = byId.get(entryId);
    assert.ok(entry, `${entryId} should exist`);
    assert.ok(String(entry.expansionHeNiqqud || "").trim(), `${entryId} should have expansionHeNiqqud`);
    assert.equal(/[\u0591-\u05C7]/.test(String(entry.abbr || "")), false, `${entryId} abbreviation should not carry niqqud`);
  });
});

test("all niqqud-bearing abbreviation expansions include provenance URLs", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const niqqudEntries = rows.filter((entry) => String(entry.expansionHeNiqqud || "").trim());

  assert.ok(niqqudEntries.length > 0);
  niqqudEntries.forEach((entry) => {
    assert.match(
      String(entry.expansionHeNiqqudSource || "").trim(),
      /^https?:\/\//,
      `${entry.id} should have an expansionHeNiqqudSource URL`
    );
  });
});

test("phase 3 abbreviation expansions stay inside the Academy-backed institutional batch", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));

  PHASE_THREE_IDS.forEach((entryId) => {
    const entry = byId.get(entryId);
    assert.ok(entry, `${entryId} should exist`);
    assert.ok(String(entry.expansionHeNiqqud || "").trim(), `${entryId} should have expansionHeNiqqud`);
    assert.match(
      String(entry.expansionHeNiqqudSource || ""),
      /^https:\/\/terms\.hebrew-academy\.org\.il\//,
      `${entryId} should use an Academy terms source`
    );
    assert.equal(/[\u0591-\u05C7]/.test(String(entry.abbr || "")), false, `${entryId} abbreviation should not carry niqqud`);
  });
});

test("phase 4 abbreviation expansions use exact Academy-backed niqqud for the new finance and health tranche", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));

  PHASE_FOUR_IDS.forEach((entryId) => {
    const entry = byId.get(entryId);
    assert.ok(entry, `${entryId} should exist`);
    assert.ok(String(entry.expansionHeNiqqud || "").trim(), `${entryId} should have expansionHeNiqqud`);
    assert.match(
      String(entry.expansionHeNiqqudSource || ""),
      /^https:\/\/terms\.hebrew-academy\.org\.il\//,
      `${entryId} should use an Academy terms source`
    );
    assert.equal(/[\u0591-\u05C7]/.test(String(entry.abbr || "")), false, `${entryId} abbreviation should not carry niqqud`);
  });
});

test("מוצ״ש is available as a playable shorthand for מוצאי שבת", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));
  const deckIds = new Set(context.IvriQuestApp.abbreviation.prepareAbbreviationDeck(rows).map((entry) => entry.id));

  assert.equal(byId.get("abbr-208")?.abbr, "מוצ״ש");
  assert.equal(byId.get("abbr-208")?.expansionHe, "מוצאי שבת");
  assert.equal(byId.get("abbr-208")?.english, "Saturday night");
  assert.equal(deckIds.has("abbr-208"), true);
});

test("דוא״ל is available as a playable shorthand for דואר אלקטרוני", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));
  const deckIds = new Set(context.IvriQuestApp.abbreviation.prepareAbbreviationDeck(rows).map((entry) => entry.id));

  assert.equal(byId.get("abbr-209")?.abbr, "דוא״ל");
  assert.equal(byId.get("abbr-209")?.expansionHe, "דואר אלקטרוני");
  assert.equal(byId.get("abbr-209")?.expansionHeNiqqud, "דּוֹאַר אֶלֶקְטְרוֹנִי");
  assert.match(String(byId.get("abbr-209")?.expansionHeNiqqudSource || ""), /^https?:\/\//);
  assert.equal(byId.get("abbr-209")?.english, "email");
  assert.equal(deckIds.has("abbr-209"), true);
});

test("political and identity expansion adds the high-value modern abbreviation set", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));
  const deckIds = new Set(context.IvriQuestApp.abbreviation.prepareAbbreviationDeck(rows).map((entry) => entry.id));
  const expansion = Array.from({ length: 20 }, (_, index) => byId.get(`abbr-${210 + index}`));

  assert.equal(rows.length, 283);
  assert.equal(expansion.length, 20);
  assert.ok(expansion.every(Boolean));
  assert.ok(expansion.every((entry) => deckIds.has(entry.id)));
  assert.ok(expansion.every((entry) => entry.english.length <= 40), "new abbreviations must remain eligible for Abbreviation Match");
  assert.ok(expansion.every((entry) => entry.bucket === "Civics, Law & Work" || entry.bucket === "People, Health & Culture"));
  assert.ok(expansion.every((entry) => String(entry.notes || "").trim()));

  assert.equal(byId.get("abbr-210")?.abbr, "להט״ב");
  assert.equal(byId.get("abbr-210")?.expansionHe, "לסביות, הומואים, טרנסג'נדרים וביסקסואלים");
  assert.equal(byId.get("abbr-210")?.english, "LGBT");
  assert.match(byId.get("abbr-211")?.notes || "", /\+ includes additional sexual and gender identities/);
  assert.equal(byId.get("abbr-212")?.expansionHe, "הרשות הפלסטינית");
  assert.equal(byId.get("abbr-214")?.expansionHe, "המחלקה לחקירות שוטרים");
  assert.equal(byId.get("abbr-214")?.english, "Police Internal Investigation Department");
  assert.equal(byId.get("abbr-216")?.expansionHe, "מתאם פעולות הממשלה בשטחים");
  assert.match(byId.get("abbr-217")?.notes || "", /stigmatizing/i);
  assert.equal(byId.get("abbr-218")?.expansionHe, "משא ומתן");
  assert.equal(byId.get("abbr-223")?.english, "national-Haredi");
  assert.equal(byId.get("abbr-224")?.expansionHe, "החזית הדמוקרטית לשלום ולשוויון");
  assert.match(byId.get("abbr-224")?.english || "", /Hadash/);
  assert.equal(byId.get("abbr-228")?.expansionHe, "התאחדות הספרדים העולמית שומרי תורה");
  assert.equal(byId.get("abbr-229")?.expansionHe, "רק לא ביבי");
});

test("the everyday and measurement tranche deepens the two thinnest buckets", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));
  const deckIds = new Set(context.IvriQuestApp.abbreviation.prepareAbbreviationDeck(rows).map((entry) => entry.id));
  const tranche = Array.from({ length: 54 }, (_, index) => byId.get(`abbr-${230 + index}`));

  assert.ok(tranche.every(Boolean), "abbr-230 through abbr-283 should all exist");
  assert.ok(tranche.every((entry) => deckIds.has(entry.id)), "every new row should reach the deck");
  // word-match truncates a long gloss, so keep them inside the card envelope
  assert.ok(tranche.every((entry) => entry.english.length <= 40));
  assert.ok(tranche.every((entry) => String(entry.notes || "").trim()), "every new row needs a note");

  // Abbreviation Match serves 20 per session, so the playable pool size is what
  // decides how long the mode runs before it starts repeating.
  const playable = rows.filter((entry) => entry.availability?.abbreviationQuiz !== false);
  assert.ok(playable.length >= 277, `only ${playable.length} playable abbreviations`);

  // The batch deliberately targeted the two thinnest buckets.
  const byBucket = rows.reduce((counts, entry) => {
    counts[entry.bucket] = (counts[entry.bucket] || 0) + 1;
    return counts;
  }, {});
  assert.ok(byBucket["Daily Life & Home"] >= 64);
  assert.ok(byBucket["Ideas, Science & Tech"] >= 52);

  // A vocalized row without provenance is the failure mode this file already
  // guards globally; assert it here too so the tranche cannot regress alone.
  tranche.filter((entry) => entry.expansionHeNiqqud).forEach((entry) => {
    assert.match(String(entry.expansionHeNiqqudSource || ""), /^https?:\/\//, `${entry.id} needs a source`);
  });

  assert.equal(byId.get("abbr-230")?.expansionHe, "בדרך כלל");
  assert.equal(byId.get("abbr-233")?.abbr, "עפ״י");
  assert.equal(byId.get("abbr-242")?.expansionHe, "סך הכול");
  assert.equal(byId.get("abbr-283")?.expansionHe, "תת אלוף");
});

test("דל״פ is a playable shared colloquial abbreviation weighted through Ido's bucket", () => {
  const context = loadAbbreviationContext();
  const rows = context.IvriQuestAbbreviations.getAbbreviations();
  const byId = new Map(rows.map((entry) => [entry.id, entry]));
  const deckIds = new Set(context.IvriQuestApp.abbreviation.prepareAbbreviationDeck(rows).map((entry) => entry.id));
  const entry = byId.get("abbr-284");

  assert.equal(rows.length, 283);
  assert.equal(entry?.abbr, "דל״פ");
  assert.equal(entry?.expansionHe, "דעה לא פופולרית");
  assert.equal(entry?.english, "unpopular opinion");
  assert.equal(entry?.bucket, "Daily Life & Home");
  assert.match(entry?.notes || "", /social-media shorthand/i);
  assert.equal(deckIds.has("abbr-284"), true);
});

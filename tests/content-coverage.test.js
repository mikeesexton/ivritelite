const test = require("node:test");
const assert = require("node:assert/strict");

const coverage = require("../scripts/content-coverage-report.js");

test("coverage matching accepts ordinary Hebrew clitics without using stems", () => {
  const sentence = { id: "example", hebrew: "הסיסמה נשמרה במחשב." };
  assert.equal(coverage.sentenceTestsHeadword(sentence, "סיסמה"), true);
  assert.equal(coverage.sentenceTestsHeadword(sentence, "מחשב"), true);
  assert.equal(coverage.sentenceTestsHeadword(sentence, "שמירה"), false);
});

test("coverage report exposes exact, reviewed, and unsupported states", () => {
  const vocabulary = [
    { id: "exact", category: "test", he: "סיסמה" },
    { id: "reviewed", category: "test", he: "שמירה" },
    { id: "unsupported", category: "test", he: "גיבוי" },
  ];
  const sentences = [{ id: "s1", hebrew: "הסיסמה נשמרה." }];
  const report = coverage.buildCoverageReport({
    vocabulary,
    sentences,
    reviewedSupport: { reviewed: ["s1"] },
  });
  assert.deepEqual(report.records.map((record) => record.status), ["exact", "reviewed", "unsupported"]);
  assert.deepEqual({ ...report.categories.get("test") }, { total: 3, exact: 1, reviewed: 1, unsupported: 1 });
});

test("reviewed coverage ids must resolve to real sentences", () => {
  assert.throws(
    () => coverage.buildCoverageReport({
      vocabulary: [{ id: "word", category: "test", he: "מילה" }],
      sentences: [],
      reviewedSupport: { word: ["missing"] },
    }),
    /missing sentence/,
  );
});

test("production coverage stays measurable and every reviewed id resolves", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.equal(report.records.length, 2192);
  assert.equal(report.records.filter((record) => record.status === "exact").length, 699);
  assert.equal(report.records.filter((record) => record.status === "reviewed").length, 0);
  assert.equal(report.records.filter((record) => record.status === "unsupported").length, 1493);
});

test("urban mobility cards and practical backfill anchors have exact sentence support", () => {
  const urban = new Set([
    "תחבורה ציבורית", "קו אוטובוס", "תחנת אוטובוס", "תחנת רכבת", "רכבת קלה", "מונית שירות",
    "רציף", "רב־קו", "לתקף", "תעריף נסיעה", "מעבר חופשי", "זמן הגעה משוער", "כיוון הנסיעה",
    "החלפה בין קווים", "איחור", "פקק תנועה", "עומס תנועה", "נתיב תחבורה ציבורית", "שביל אופניים",
    "קורקינט חשמלי", "אופניים שיתופיים", "צומת", "מעבר חצייה", "חניון",
  ]);
  const backfill = new Set([
    "חוזה שכירות", "מד שירות", "חשבון מים", "תיקון חירום", "תלונת לקוח", "נציג שירות",
    "תביעת ביטוח", "תור פנוי", "טיפות עיניים", "סוכרייה לגרון", "פלסטר", "התייבשות",
    "כניסת שבת", "קבלת שבת", "ברכת המזון", "תעודת כשרות", "כתובה", "תפילת הדרך",
    "רעידת אדמה", "שידור חירום", "כיבוי אש", "מחסום דרכים", "בדיקת רישיון", "קנס תנועה",
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const assertSupported = (anchors, label) => {
    const selected = report.records.filter((record) => anchors.has(record.word.he));
    assert.ok(selected.length >= anchors.size, `${label} anchors must all resolve to cards`);
    assert.equal(selected.filter((record) => record.status !== "exact").length, 0, `${label} anchors need exact/clitic-normalized support`);
  };

  assertSupported(urban, "urban");
  assertSupported(backfill, "backfill");
});

test("the neutral everyday tranche gives all forty selected shared words exact sentence support", () => {
  const anchors = new Set([
    "מטרפה", "מרית", "מצקת", "קולפן", "פומפייה",
    "משחת שיניים", "שמפו", "נייר טואלט", "טישו", "ג'ל לחיטוי ידיים",
    "ביטוח בריאות", "מרפאה", "תרופה", "מינון", "תסמין",
    "פעילות גופנית", "אימון", "פיזיותרפיה", "תזונה", "נדודי שינה",
    "הזדמנות", "דרישה", "חשש", "ציפייה", "סבלנות",
    "גמישות", "אמינות", "זמינות", "איכות", "כמות",
    "אכזבה", "תסכול", "חמלה", "אמון", "געגוע",
    "שורש", "זמן דקדוקי", "ניב", "סלנג", "מילת יחס",
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const selected = report.records.filter((record) => anchors.has(record.word.he));

  assert.equal(anchors.size, 40);
  assert.equal(selected.length, 40);
  assert.equal(selected.filter((record) => record.status !== "exact").length, 0);
  assert.ok(selected.every((record) => record.exactSentenceIds.some((id) => /^everyday_1(?:5\d|[6-8]\d)$/.test(id))));
});

test("every card in the new cast and smartphone tranches has exact sentence support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const starts = new Map([
    ["media_digital_life_expanded", 27],
    ["literature_arts_cultural_history", 31],
    ["emergency_response", 68],
    ["devices_os_apps", 76],
    ["religious_life_practice", 112],
  ]);
  const added = report.records.filter((record) => {
    const start = starts.get(record.word.category);
    const index = Number(record.word.id.match(/-(\d{3})-/)?.[1]);
    return start && index >= start;
  });

  assert.equal(added.length, 60);
  assert.equal(added.filter((record) => record.status !== "exact").length, 0);
});

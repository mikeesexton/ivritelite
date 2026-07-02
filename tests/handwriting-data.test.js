const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadScript(relativePath) {
  const sourcePath = path.join(__dirname, "..", relativePath);
  const source = fs.readFileSync(sourcePath, "utf8");
  const context = {
    window: {},
    globalThis: {},
  };

  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });
  return context;
}

const letterforms = loadScript("handwriting-data.js").IvriQuestHandwritingData.getLetterforms();

const FINAL_TO_MEDIAL = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };
const TOPLINE = 0.15;
const BASELINE = 0.75;
const DESCENDERS = new Set(["ך", "ן", "ף", "ץ", "ק"]);

test("there are exactly 27 letterforms with unique ids, letters, and orders", () => {
  assert.equal(letterforms.length, 27);
  assert.equal(new Set(letterforms.map((form) => form.id)).size, 27);
  assert.equal(new Set(letterforms.map((form) => form.letter)).size, 27);
  const orders = letterforms.map((form) => form.order).sort((a, b) => a - b);
  assert.deepEqual(JSON.parse(JSON.stringify(orders)), Array.from({ length: 27 }, (_, i) => i + 1));
});

test("the five final forms are flagged with the correct medial mapping", () => {
  const finals = letterforms.filter((form) => form.final);
  assert.equal(finals.length, 5);
  finals.forEach((form) => {
    assert.equal(form.medialOf, FINAL_TO_MEDIAL[form.letter], `expected medialOf for ${form.letter}`);
  });
  letterforms.filter((form) => !form.final).forEach((form) => {
    assert.equal(form.medialOf, null);
  });
});

test("letterforms cover every Hebrew letter used in vocab and sentence data", () => {
  const known = new Set(letterforms.map((form) => form.letter));
  const hebrewLetters = /[א-תךםןףץ]/g;
  ["vocab-data.js", "sentence-bank-data.js"].forEach((file) => {
    const text = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    const used = new Set(text.match(hebrewLetters) || []);
    used.forEach((letter) => {
      assert.ok(known.has(letter), `no letterform for ${letter} used in ${file}`);
    });
  });
});

test("every stroke is a polyline of at least 2 in-bounds points", () => {
  letterforms.forEach((form) => {
    assert.ok(Array.isArray(form.strokes) && form.strokes.length >= 1, `${form.id} has no strokes`);
    form.strokes.forEach((stroke, index) => {
      assert.ok(stroke.points.length >= 2, `${form.id} stroke ${index} too short`);
      stroke.points.forEach(([x, y]) => {
        assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1, `${form.id} stroke ${index} point out of bounds (${x}, ${y})`);
      });
    });
  });
});

test("descender letters descend below the baseline and others stay above it", () => {
  letterforms.forEach((form) => {
    const maxY = Math.max(...form.strokes.flatMap((stroke) => stroke.points.map(([, y]) => y)));
    if (DESCENDERS.has(form.letter)) {
      assert.ok(form.descender, `${form.id} should be flagged as descender`);
      assert.ok(maxY > BASELINE + 0.03, `${form.id} should descend below baseline, maxY=${maxY}`);
    } else {
      assert.ok(!form.descender, `${form.id} should not be flagged as descender`);
      assert.ok(maxY <= BASELINE + 0.06, `${form.id} should stay near or above baseline, maxY=${maxY}`);
    }
  });
});

test("lamed ascends above the topline", () => {
  const lamed = letterforms.find((form) => form.letter === "ל");
  assert.ok(lamed.ascender);
  const minY = Math.min(...lamed.strokes.flatMap((stroke) => stroke.points.map(([, y]) => y)));
  assert.ok(minY < TOPLINE - 0.02, `lamed should start above topline, minY=${minY}`);
});

test("total path length per letterform is within sane bounds", () => {
  const pathLength = (points) => {
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
      total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    }
    return total;
  };
  letterforms.forEach((form) => {
    const total = form.strokes.reduce((sum, stroke) => sum + pathLength(stroke.points), 0);
    assert.ok(total >= 0.1 && total <= 4.0, `${form.id} path length ${total.toFixed(2)} out of bounds`);
  });
});

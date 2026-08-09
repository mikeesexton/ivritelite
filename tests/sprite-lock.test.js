const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const LOCK_PATH = path.join(PROJECT_ROOT, "assets", "sprite-lock.json");

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function assertPngContract(relativePath, record) {
  const filePath = path.join(PROJECT_ROOT, relativePath);
  assert.ok(fs.existsSync(filePath), `${relativePath} must exist`);
  assert.equal(sha256(filePath), record.sha256, `${relativePath} drifted from its approved hash`);
  const png = fs.readFileSync(filePath);
  assert.equal(png.subarray(1, 4).toString(), "PNG", `${relativePath} must be PNG`);
  assert.equal(png.readUInt32BE(16), record.width, `${relativePath} width changed`);
  assert.equal(png.readUInt32BE(20), record.height, `${relativePath} height changed`);
  assert.equal(png[25], 6, `${relativePath} must remain RGBA`);
}

test("all production sprites and approved masters match the frozen sprite lock", () => {
  const lock = JSON.parse(fs.readFileSync(LOCK_PATH, "utf8"));
  assert.equal(lock.version, 2);
  assert.equal(Object.keys(lock.production).length, 30);
  assert.equal(Object.keys(lock.masters).length, 30);
  assert.equal(Object.keys(lock.spatialGate).length, 30);

  Object.entries(lock.production).forEach(([relativePath, record]) => {
    assert.equal(record.width, 512);
    assert.equal(record.height, 512);
    assert.equal(record.mode, "RGBA");
    assert.equal(record.equals128RoundTrip, false);
    assert.equal(record.equals256RoundTrip, false);
    assert.equal(record.visibleMagentaEdgePixels, 0);
    assert.deepEqual(Object.keys(record.spatialSignature), ["32", "64"]);
    assert.deepEqual(
      Object.keys(record.spatialSignature["32"].roundTripSurvival),
      ["96", "128", "192", "256"],
    );
    assert.ok(lock.spatialGate[relativePath], `${relativePath} needs a spatial gate record`);
    assertPngContract(relativePath, record);
  });
  Object.entries(lock.masters).forEach(([relativePath, record]) => {
    assert.equal(record.width, 1254);
    assert.equal(record.height, 1254);
    assert.equal(record.mode, "RGBA");
    assert.equal(record.visibleMagentaEdgePixels, 0);
    assertPngContract(relativePath, record);
  });
});

test("all locked builders retain the direct 1254-to-512 export structure", () => {
  for (const character of ["ido", "inbal", "inat", "ivri", "idan"]) {
    const source = fs.readFileSync(
      path.join(PROJECT_ROOT, "scripts", `build-${character}-sprites.py`),
      "utf8",
    );
    assert.match(source, /"sprite-masters"/);
    assert.match(source, /SOURCE_SIZE = 1254/);
    assert.match(source, /CANVAS_SIZE = 512/);
    assert.match(source, /source\.resize\(/);
    assert.match(source, /Image\.Resampling\.NEAREST/);
    assert.match(source, /--source-dir/);
    assert.doesNotMatch(
      source,
      /LOGICAL_SIZE|PALETTE_COLORS|\.quantize\(|BILINEAR|BICUBIC/,
      `${character} must not regain a logical-canvas, palette, or smoothing pass`,
    );
  }
});

test("Ido's neutral shirt logo stays centered below the collar", () => {
  const source = fs.readFileSync(
    path.join(PROJECT_ROOT, "scripts", "build-ido-sprites.py"),
    "utf8",
  );
  assert.match(source, /"neutral": \(197, 424\),/);
});

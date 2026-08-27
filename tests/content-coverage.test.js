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
  assert.equal(report.records.length, 2206);
  // The four coverage tranches pulled twelve more vocabulary cards from
  // unsupported into exact by giving them a sentence context.
  //
  // The compare/focus tranche's לחסל card did NOT arrive covered, contrary to what
  // this comment claimed when the tranche landed: idan_127 and idan_128 teach the
  // past חיסל and the passive חוסל, and the coverage matcher tolerates clitics but
  // does not stem morphology, so the infinitive headword matched nothing. idan_131
  // was authored afterwards to give it a context. The same trap caught הסמכה in the
  // next tranche — a card whose natural use is inflected needs a row carrying the
  // headword form itself.
  //
  // The decline/authority tranche adds eight cards, all eight covered on arrival,
  // and pulls three more across with them. The providence/travel tranche adds three
  // cards, all three covered, and pulls one more across. The kill-verb tranche adds
  // one card, להרוג, covered on arrival by idan_129, and pulls the retired הורג tile
  // across with idan_130, so exact rises by two while unsupported falls by one.
  // Both rows carry the headword form itself, per the trap above. The shared
  // pragmatics tranche adds no vocabulary but incidentally gives three existing
  // cards an exact sentence context. The shared intermediate-practical tranche
  // then gives seven more existing cards an exact context. The appended מוקד
  // טלפוני card remains unsupported because formal_130 teaches מוקד ארצי instead.
  assert.equal(report.records.filter((record) => record.status === "exact").length, 1073);
  assert.equal(report.records.filter((record) => record.status === "reviewed").length, 0);
  assert.equal(report.records.filter((record) => record.status === "unsupported").length, 1133);
});

test("kitchen-action sentences give every selected cooking verb its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["cooking_verbs-001-to-chop", "everyday_218"],
    ["cooking_verbs-002-to-dice", "everyday_219"],
    ["cooking_verbs-003-to-slice", "everyday_220"],
    ["cooking_verbs-004-to-mince", "everyday_221"],
    ["cooking_verbs-005-to-peel", "everyday_222"],
    ["cooking_verbs-006-to-grate-scrape", "everyday_223"],
    ["cooking_verbs-007-to-whisk", "everyday_224"],
    ["cooking_verbs-008-to-stir-mix", "everyday_225"],
    ["cooking_verbs-009-to-fold", "everyday_226"],
    ["cooking_verbs-010-to-beat-whip", "everyday_227"],
    ["cooking_verbs-011-to-knead", "everyday_228"],
    ["cooking_verbs-012-to-roll-out", "everyday_229"],
    ["cooking_verbs-013-to-sift", "everyday_230"],
    ["cooking_verbs-014-to-measure", "everyday_231"],
    ["cooking_verbs-015-to-pour", "everyday_232"],
    ["cooking_verbs-016-to-drizzle", "everyday_233"],
    ["cooking_verbs-017-to-season", "everyday_234"],
    ["cooking_verbs-018-to-marinate", "everyday_235"],
    ["cooking_verbs-019-to-soak", "everyday_236"],
    ["cooking_verbs-020-to-boil", "everyday_237"],
    ["cooking_verbs-021-to-simmer", "everyday_238"],
    ["cooking_verbs-023-to-steam", "everyday_239"],
    ["cooking_verbs-024-to-fry", "everyday_240"],
    ["cooking_verbs-030-to-bake", "everyday_241"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing cooking card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("kitchen-action sentences also contextualize their selected tools and ingredients", () => {
  const anchors = new Set([
    "סכין שף", "סכין משוננת", "סכין לקילוף", "מגרדת הדרים", "מטרפה", "כף עץ",
    "מיקסר ידני", "מיקסר", "מערוך", "מסננת", "כוס מדידה", "משפך", "קופסת אחסון",
    "קומקום", "קלחת", "סיר אידוי", "מחבת", "תבנית אפייה",
    "פטרוזיליה", "תפוח אדמה", "לחם", "שום", "גזר", "לימון", "ביצה", "שמנת", "קמח",
    "שמן זית", "תבלין", "שעועית",
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const selected = report.records.filter((record) => anchors.has(record.word.he));

  assert.equal(selected.length, anchors.size);
  assert.ok(selected.every((record) => record.exactSentenceIds.some((id) => /^everyday_2(?:1[8-9]|[2-3]\d|4[01])$/.test(id))));
});

test("home-care sentences give every selected household card its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["home_everyday_life-001-shelf", "everyday_242"],
    ["home_everyday_life-005-wardrobe", "everyday_243"],
    ["home_everyday_life-010-storage-compartment", "everyday_244"],
    ["home_everyday_life-014-laundry-room", "everyday_245"],
    ["home_everyday_life-016-entryway", "everyday_246"],
    ["home_everyday_life-018-balcony", "everyday_247"],
    ["home_everyday_life-021-gate", "everyday_248"],
    ["home_everyday_life-023-spare-key", "everyday_249"],
    ["home_everyday_life-025-door-hinge", "everyday_250"],
    ["home_everyday_life-027-window-frame", "everyday_251"],
    ["home_everyday_life-030-curtain-rod", "everyday_252"],
    ["home_everyday_life-032-electrical-outlet", "everyday_253"],
    ["home_everyday_life-033-extension-cord", "everyday_254"],
    ["home_everyday_life-035-circuit-breaker", "everyday_255"],
    ["home_everyday_life-039-toolbox", "everyday_256"],
    ["home_everyday_life-042-hammer", "everyday_257"],
    ["home_everyday_life-043-drill", "everyday_258"],
    ["home_everyday_life-048-measuring-tape", "everyday_259"],
    ["home_everyday_life-055-instruction-manual", "everyday_260"],
    ["home_everyday_life-060-water-damage", "everyday_261"],
    ["home_everyday_life-066-clog", "everyday_262"],
    ["home_everyday_life-079-vacuum-cleaner", "everyday_263"],
    ["home_everyday_life-082-broom", "everyday_264"],
    ["home_everyday_life-089-stain-remover", "everyday_265"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing household card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("home-care sentences contextualize the full selected household cluster", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const selected = report.records.filter((record) => (
    record.word.category === "home_everyday_life"
    && record.exactSentenceIds.some((id) => /^everyday_2(?:4[2-9]|5\d|6[0-5])$/.test(id))
  ));

  assert.equal(selected.length, 61);
  assert.ok(selected.every((record) => record.status === "exact"));
});

test("Inat formal sentences give every planned intellectual anchor its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["literature_arts_cultural_history-001-literary-criticism", "formal_88"],
    ["literature_arts_cultural_history-004-protagonist", "formal_89"],
    ["literature_arts_cultural_history-007-metaphor", "formal_90"],
    ["literature_arts_cultural_history-008-allusion", "formal_91"],
    ["literature_arts_cultural_history-010-manuscript", "formal_92"],
    ["literature_arts_cultural_history-014-dramatic-irony", "formal_93"],
    ["literature_arts_cultural_history-009-literary-canon", "formal_94"],
    ["literature_arts_cultural_history-024-historical-narrative", "formal_95"],
    ["culture_identity_expanded-017-cultural-assimilation", "formal_96"],
    ["philosophy_intellectual_expanded-007-identity-formation", "formal_97"],
    ["culture_identity_expanded-008-pop-culture", "formal_98"],
    ["culture_identity_expanded-012-status-symbol", "formal_99"],
    ["philosophy_intellectual_expanded-001-ethics", "formal_100"],
    ["philosophy_intellectual_expanded-002-morality", "formal_101"],
    ["philosophy_intellectual_expanded-003-free-will", "formal_102"],
    ["philosophy_intellectual_expanded-006-consciousness-studies", "formal_103"],
    ["philosophy_intellectual_expanded-010-logical-fallacy", "formal_104"],
    ["philosophy_intellectual_expanded-012-normative-claim", "formal_105"],
    ["philosophy_intellectual_expanded-014-meaning-of-life", "formal_106"],
    ["abstract_philosophy-011-bias", "formal_107"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing intellectual card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("Inat formal sentences produce the reviewed target-shelf coverage", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const expectedExact = new Map([
    ["philosophy_intellectual_expanded", 12],
    ["culture_identity_expanded", 10],
    ["literature_arts_cultural_history", 28],
    ["abstract_philosophy", 13],
  ]);

  expectedExact.forEach((exact, category) => {
    assert.equal(report.categories.get(category).exact, exact, `${category} exact coverage`);
  });
});

test("relationship sentences give every previously unsupported dating card its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["dating_relationships-001-chemistry", "colloquial_176"],
    ["dating_relationships-002-commitment", "colloquial_177"],
    ["dating_relationships-004-boundaries", "colloquial_183"],
    ["dating_relationships-005-exclusive", "colloquial_178"],
    ["dating_relationships-006-long-distance", "colloquial_180"],
    ["dating_relationships-007-to-ghost", "colloquial_187"],
    ["dating_relationships-008-to-define-the-relationship", "colloquial_178"],
    ["dating_relationships-010-green-flag", "colloquial_189"],
    ["dating_relationships-011-emotional-availability", "colloquial_177"],
    ["dating_relationships-012-shared-future", "colloquial_180"],
    ["dating_relationships-013-dating-fatigue", "colloquial_181"],
    ["dating_relationships-014-to-set-boundaries", "colloquial_183"],
    ["dating_relationships-015-to-open-up-emotionally", "colloquial_184"],
    ["dating_relationships-016-mutual-respect", "colloquial_176"],
    ["dating_relationships-017-situationship", "colloquial_185"],
    ["dating_relationships-018-to-lead-someone-on", "colloquial_184"],
    ["dating_relationships-019-to-catch-feelings", "colloquial_185"],
    ["dating_relationships-020-to-be-hung-up-on-someone", "colloquial_186"],
    ["dating_relationships-021-to-lose-interest", "colloquial_187"],
    ["dating_relationships-022-to-get-attached", "colloquial_183"],
    ["dating_relationships-023-to-pull-away", "colloquial_187"],
    ["dating_relationships-024-to-make-it-official", "colloquial_188"],
    ["relationships_dating_expanded-002-flirtation", "colloquial_192"],
    ["relationships_dating_expanded-004-exclusivity", "colloquial_179"],
    ["relationships_dating_expanded-005-commitment-issue", "colloquial_182"],
    ["relationships_dating_expanded-006-breakup", "colloquial_186"],
    ["relationships_dating_expanded-007-long-distance-relationship", "colloquial_181"],
    ["relationships_dating_expanded-008-trust-issue", "colloquial_190"],
    ["relationships_dating_expanded-009-red-flag-behavior", "colloquial_191"],
    ["relationships_dating_expanded-010-green-flag-behavior", "colloquial_190"],
    ["relationships_dating_expanded-011-shared-values", "colloquial_179"],
    ["relationships_dating_expanded-012-co-parenting", "colloquial_193"],
    ["relationships_dating_expanded-013-in-laws-parents-relationship", "colloquial_194"],
    ["relationships_dating_expanded-014-extended-family", "colloquial_194"],
    ["relationships_dating_expanded-015-reconciliation", "colloquial_188"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  assert.equal(expectedSentenceByCard.size, 35);
  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing relationship card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("relationship sentences bring both dating shelves to full exact support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.deepEqual({ ...report.categories.get("dating_relationships") }, { total: 24, exact: 24, reviewed: 0, unsupported: 0 });
  assert.deepEqual({ ...report.categories.get("relationships_dating_expanded") }, { total: 15, exact: 15, reviewed: 0, unsupported: 0 });
});

test("Ivri AI sentences give every previously unsupported AI card its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["technology_ai-001-algorithm", "professional_153"],
    ["technology_ai-003-training-data", "professional_153"],
    ["technology_ai-005-neural-network", "professional_154"],
    ["technology_ai-006-inference", "professional_155"],
    ["technology_ai-007-deployment", "professional_156"],
    ["technology_ai-008-scalability", "professional_156"],
    ["technology_ai-009-open-source", "professional_157"],
    ["technology_ai-010-autonomous-system", "professional_158"],
    ["technology_ai-011-recursive-improvement", "professional_159"],
    ["technology_ai-012-prompt", "professional_160"],
    ["technology_ai-013-token", "professional_160"],
    ["technology_ai-014-context-window", "professional_160"],
    ["technology_ai-015-agent", "professional_158"],
    ["technology_ai-016-to-fine-tune", "professional_161"],
    ["technology_ai-017-benchmark", "professional_161"],
    ["technology_ai-018-model-collapse", "professional_159"],
    ["technology_ai-019-safety-guardrail", "professional_162"],
    ["technology_ai-020-reasoning", "professional_155"],
    ["technology_ai-021-open-weights", "professional_162"],
    ["technology_ai_expanded-001-machine-learning", "professional_163"],
    ["technology_ai_expanded-002-supervised-learning", "professional_164"],
    ["technology_ai_expanded-003-unsupervised-learning", "professional_165"],
    ["technology_ai_expanded-004-neural-layer", "professional_154"],
    ["technology_ai_expanded-005-fine-tuning", "professional_166"],
    ["technology_ai_expanded-006-prompt-engineering", "professional_167"],
    ["technology_ai_expanded-007-hallucination-ai", "professional_167"],
    ["technology_ai_expanded-008-vector-database", "professional_168"],
    ["technology_ai_expanded-010-cybersecurity-breach", "professional_169"],
    ["technology_ai_expanded-013-open-source-license", "professional_157"],
    ["technology_ai_expanded-014-robotics", "professional_170"],
    ["technology_ai_expanded-015-software-release", "professional_171"],
    ["technology_ai_expanded-016-product-roadmap", "professional_171"],
    ["technology_ai_expanded-017-startup-runway", "professional_172"],
    ["technology_ai_expanded-018-venture-capital", "professional_172"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  assert.equal(expectedSentenceByCard.size, 34);
  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing AI card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("Ivri AI sentences bring both technology shelves to full exact support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.deepEqual({ ...report.categories.get("technology_ai") }, { total: 21, exact: 21, reviewed: 0, unsupported: 0 });
  assert.deepEqual({ ...report.categories.get("technology_ai_expanded") }, { total: 18, exact: 18, reviewed: 0, unsupported: 0 });
});

test("Ivri AI sentences preserve the three projected incidental exact matches", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));
  const expectedSentenceByCard = new Map([
    ["work_business-028-roadmap", "professional_171"],
    ["work_business-070-capital", "professional_172"],
    ["military_operational-076-training-track", "professional_172"],
  ]);

  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing incidental card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs incidental exact support from ${sentenceId}`);
  });
});

test("shared grammar sentences give every unsupported meta-language card its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["meta_language-005-nuance", "everyday_266"],
    ["meta_language-008-literal-meaning", "everyday_266"],
    ["meta_language-009-figurative-meaning", "everyday_267"],
    ["meta_language-010-participle", "everyday_268"],
    ["meta_language-011-infinitive", "everyday_269"],
    ["meta_language-012-imperative", "everyday_269"],
    ["meta_language-013-grammatical-gender", "everyday_270"],
    ["meta_language-014-singular", "everyday_270"],
    ["meta_language-016-construct-state", "everyday_271"],
    ["meta_language-018-possessive-suffix", "everyday_271"],
    ["meta_language-019-direct-object-marker", "everyday_272"],
    ["advanced_grammar_meta_expanded-001-linguistics-terminology", "everyday_273"],
    ["advanced_grammar_meta_expanded-002-word-formation", "everyday_274"],
    ["advanced_grammar_meta_expanded-003-verbal-pattern", "everyday_275"],
    ["advanced_grammar_meta_expanded-004-nominal-pattern", "everyday_276"],
    ["advanced_grammar_meta_expanded-006-formal-register", "everyday_278"],
    ["advanced_grammar_meta_expanded-007-informal-register", "everyday_278"],
    ["advanced_grammar_meta_expanded-010-aramaic-influence", "everyday_279"],
    ["advanced_grammar_meta_expanded-011-root-letter", "everyday_275"],
    ["advanced_grammar_meta_expanded-012-weak-root", "everyday_277"],
    ["advanced_grammar_meta_expanded-013-prefix", "everyday_274"],
    ["advanced_grammar_meta_expanded-014-suffix", "everyday_274"],
    ["advanced_grammar_meta_expanded-015-syntax", "everyday_273"],
    ["advanced_grammar_meta_expanded-016-pragmatics", "everyday_273"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  assert.equal(expectedSentenceByCard.size, 24);
  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing grammar card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("shared grammar sentences bring both meta-language shelves to full exact support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.deepEqual({ ...report.categories.get("meta_language") }, { total: 19, exact: 19, reviewed: 0, unsupported: 0 });
  assert.deepEqual({ ...report.categories.get("advanced_grammar_meta_expanded") }, { total: 16, exact: 16, reviewed: 0, unsupported: 0 });
});

test("shared grammar sentences preserve the projected impact incidental match", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const record = report.records.find((item) => item.word.id === "scientific_analytical-025-impact");

  assert.ok(record, "missing incidental impact card");
  assert.ok(record.exactSentenceIds.includes("everyday_279"));
});

test("Inat legal sentences give every previously unsupported legal card its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["legal_civic-001-constitution", "formal_108"],
    ["legal_civic-002-jurisdiction", "formal_109"],
    ["legal_civic-003-due-process", "formal_110"],
    ["legal_civic-004-liability", "formal_111"],
    ["legal_civic-005-negligence", "formal_111"],
    ["legal_civic-006-precedent", "formal_112"],
    ["legal_civic-007-subpoena", "formal_113"],
    ["legal_civic-008-injunction", "formal_114"],
    ["legal_civic-010-national-security", "formal_115"],
    ["legal_civic-011-lawsuit-claim", "formal_116"],
    ["legal_civic-012-verdict-ruling", "formal_112"],
    ["legal_civic-014-defendant", "formal_117"],
    ["legal_civic-015-state-attorney-s-office", "formal_118"],
    ["legal_civic-016-legislation", "formal_115"],
    ["legal_civic-017-conviction", "formal_117"],
    ["legal_civic-018-acquittal", "formal_117"],
    ["law_legal_systems_expanded-001-constitutional-law", "formal_108"],
    ["law_legal_systems_expanded-004-plea-bargain", "formal_119"],
    ["law_legal_systems_expanded-005-civil-lawsuit", "formal_116"],
    ["law_legal_systems_expanded-006-damages", "formal_116"],
    ["law_legal_systems_expanded-008-liability-clause", "formal_125"],
    ["law_legal_systems_expanded-009-burden-of-proof", "formal_120"],
    ["law_legal_systems_expanded-010-admissible-evidence", "formal_121"],
    ["law_legal_systems_expanded-011-cross-examination", "formal_121"],
    ["law_legal_systems_expanded-012-injunction-order", "formal_114"],
    ["law_legal_systems_expanded-013-immigration-status", "formal_122"],
    ["law_legal_systems_expanded-014-property-deed", "formal_123"],
    ["law_legal_systems_expanded-015-regulatory-compliance", "formal_124"],
    ["law_legal_systems_expanded-016-corporate-bylaw", "formal_124"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  assert.equal(expectedSentenceByCard.size, 29);
  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing legal card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("Inat legal sentences bring both legal shelves to full exact support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.deepEqual({ ...report.categories.get("legal_civic") }, { total: 19, exact: 19, reviewed: 0, unsupported: 0 });
  assert.deepEqual({ ...report.categories.get("law_legal_systems_expanded") }, { total: 16, exact: 16, reviewed: 0, unsupported: 0 });
});

test("Inat legal sentences preserve the six incidental exact matches", () => {
  const expectedSentenceByCard = new Map([
    ["core_advanced-006-evidence", "formal_121"],
    ["health-054-prevention", "formal_114"],
    ["work_business-031-compliance", "formal_124"],
    ["bureaucracy-056-summons", "formal_113"],
    ["bureaucracy-078-immigration", "formal_122"],
    ["emergency_response-006-police-interrogation", "formal_121"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing incidental card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs incidental exact support from ${sentenceId}`);
  });
});

test("Ivri finance sentences give every previously unsupported finance card its intended exact context", () => {
  const expectedSentenceByCard = new Map([
    ["finance_investing-001-portfolio", "professional_173"],
    ["finance_investing-002-asset-allocation", "professional_173"],
    ["finance_investing-003-volatility", "professional_174"],
    ["finance_investing-004-bond", "professional_175"],
    ["finance_investing-005-liquidity", "professional_174"],
    ["finance_investing-006-inflation", "professional_177"],
    ["finance_investing-008-hedge", "professional_178"],
    ["finance_investing-009-capital-gains", "professional_179"],
    ["finance_investing-010-stock-exchange", "professional_181"],
    ["finance_investing-011-share-stock", "professional_181"],
    ["finance_investing-012-dividend", "professional_182"],
    ["finance_investing-013-yield-return", "professional_175"],
    ["finance_investing-015-pension", "professional_183"],
    ["finance_investing-016-loan", "professional_184"],
    ["finance_investing-017-exchange-rate", "professional_177"],
    ["business_finance_expanded-002-balance-sheet", "professional_185"],
    ["business_finance_expanded-003-profit-margin", "professional_186"],
    ["business_finance_expanded-005-valuation", "professional_186"],
    ["business_finance_expanded-006-merger", "professional_187"],
    ["business_finance_expanded-007-acquisition", "professional_187"],
    ["business_finance_expanded-009-shareholder", "professional_182"],
    ["business_finance_expanded-010-board-of-directors", "professional_187"],
    ["business_finance_expanded-011-macroeconomic-trend", "professional_188"],
    ["business_finance_expanded-012-microeconomic-incentive", "professional_188"],
    ["business_finance_expanded-014-insurance-premium", "professional_183"],
    ["business_finance_expanded-015-tax-deduction", "professional_180"],
    ["business_finance_expanded-016-credit-score", "professional_184"],
    ["business_finance_expanded-017-bond-yield", "professional_176"],
    ["business_finance_expanded-018-risk-diversification", "professional_178"],
    ["business_finance_expanded-019-financial-leverage", "professional_185"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  assert.equal(expectedSentenceByCard.size, 30);
  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing finance card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs exact support from ${sentenceId}`);
  });
});

test("Ivri finance sentences bring both finance shelves to full exact support", () => {
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  assert.deepEqual({ ...report.categories.get("finance_investing") }, { total: 17, exact: 17, reviewed: 0, unsupported: 0 });
  assert.deepEqual({ ...report.categories.get("business_finance_expanded") }, { total: 23, exact: 23, reviewed: 0, unsupported: 0 });
});

test("Ivri finance sentences preserve the seven incidental exact matches", () => {
  const expectedSentenceByCard = new Map([
    ["work_business-012-profit", "professional_186"],
    ["work_business-055-merger", "professional_187"],
    ["work_business-056-acquisition", "professional_187"],
    ["work_business-071-valuation", "professional_186"],
    ["work_business-072-board-of-directors", "professional_187"],
    ["work_business-073-shareholder", "professional_182"],
    ["bureaucracy-014-tax", "professional_180"],
  ]);
  const report = coverage.buildCoverageReport(coverage.loadProductionContent());
  const byId = new Map(report.records.map((record) => [record.word.id, record]));

  expectedSentenceByCard.forEach((sentenceId, cardId) => {
    const record = byId.get(cardId);
    assert.ok(record, `missing incidental card ${cardId}`);
    assert.ok(record.exactSentenceIds.includes(sentenceId), `${cardId} needs incidental exact support from ${sentenceId}`);
  });
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

  // 60 authored plus ברירת מחדל at devices_os_apps-116, which arrived with its
  // own sentence context and so keeps the "all exact" guarantee below true.
  assert.equal(added.length, 61);
  assert.equal(added.filter((record) => record.status !== "exact").length, 0);
});

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const PROJECT_ROOT = path.resolve(__dirname, "..");

function loadCharacterModule(options = {}) {
  const saved = options.saved || {};
  const savedBonds = options.savedBonds || {};
  const savedWrites = [];
  const bondWrites = [];
  let clearedSessionCount = 0;
  const context = {
    console,
    Date,
    setTimeout,
    clearTimeout,
    document: options.document,
    IvriQuestApp: {
      runtime: {
        constants: { STORAGE_KEYS: { character: "character", characterBond: "characterBond" } },
        state: {
          language: "en",
          route: "home",
          summary: { active: false, game: "" },
        },
        helpers: { renderAll: () => {} },
        // character.js schedules transient-reaction checks through runtime.global,
        // the way bootstrap-runtime wires it in the real app.
        get global() { return context; },
        storageApi: {
          loadJson: (key) => (key === "characterBond" ? savedBonds : saved),
          saveJson: (key, value) => {
            if (key === "characterBond") bondWrites.push(structuredClone(value));
            else savedWrites.push(structuredClone(value));
          },
        },
      },
      persistence: {
        clearPersistedSession: () => {
          clearedSessionCount += 1;
        },
      },
    },
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  ["app/character-data.js", "app/character.js"].forEach((modulePath) => {
    vm.runInContext(
      fs.readFileSync(path.join(PROJECT_ROOT, modulePath), "utf8"),
      context,
      { filename: modulePath },
    );
  });
  return {
    character: context.IvriQuestApp.character,
    characterData: context.IvriQuestApp.characterData,
    app: context.IvriQuestApp,
    context,
    getClearedSessionCount: () => clearedSessionCount,
    savedWrites,
    bondWrites,
  };
}

test("Ido positive streak reaches celebrating at four and persists until a miss", () => {
  const { character } = loadCharacterModule();
  let state = { correctStreak: 0, wrongStreak: 0 };
  state = character.reduceAnswerState(state, true);
  state = character.reduceAnswerState(state, true);
  state = character.reduceAnswerState(state, true);
  assert.equal(state.sprite, "neutral");

  state = character.reduceAnswerState(state, true);
  assert.equal(state.sprite, "celebrating");
  assert.equal(state.dialogueKey, "fourRight");

  state = character.reduceAnswerState(state, true);
  assert.equal(state.sprite, "celebrating");
  assert.equal(state.correctStreak, 5);

  state = character.reduceAnswerState(state, false);
  assert.equal(state.sprite, "nervous-laugh");
  assert.equal(state.correctStreak, 0);
  assert.equal(state.wrongStreak, 1);
});

test("Ido negative streak persists and the first recovery answer is transient", () => {
  const { character } = loadCharacterModule();
  let state = { correctStreak: 0, wrongStreak: 0 };
  for (let index = 0; index < 4; index += 1) {
    state = character.reduceAnswerState(state, false);
  }
  assert.equal(state.sprite, "struggling");
  assert.equal(state.dialogueKey, "fourWrong");

  state = character.reduceAnswerState(state, false);
  assert.equal(state.sprite, "struggling");
  assert.equal(state.wrongStreak, 5);

  state = character.reduceAnswerState(state, true);
  assert.equal(state.sprite, "celebrating");
  assert.equal(state.dialogueKey, "recovery");
  assert.equal(state.correctStreak, 1);

  // Recovery holds for the rest of the streak instead of fading after one
  // answer, so the reward stays on screen while the run is still going.
  state = character.reduceAnswerState(state, true);
  assert.equal(state.sprite, "celebrating");
  assert.equal(state.dialogueKey, "recovery");
  state = character.reduceAnswerState(state, true);
  assert.equal(state.dialogueKey, "recovery");
  assert.equal(state.correctStreak, 3);

  // The four-in-a-row reaction takes over from it.
  state = character.reduceAnswerState(state, true);
  assert.equal(state.correctStreak, 4);
  assert.equal(state.sprite, "celebrating");
  assert.equal(state.dialogueKey, "fourRight");

  // A miss still clears it.
  state = character.reduceAnswerState(state, false);
  assert.equal(state.sprite, "nervous-laugh");
  assert.equal(state.dialogueKey, "oneWrong");
});

test("Ido uses the recovery line after any wrong-answer streak", () => {
  const { character } = loadCharacterModule();
  let state = character.reduceAnswerState({ correctStreak: 3, wrongStreak: 0 }, false);
  assert.equal(state.sprite, "nervous-laugh");
  assert.equal(state.reactionTransient, true);

  state = character.reduceAnswerState(state, true);
  assert.equal(state.sprite, "celebrating");
  assert.equal(state.dialogueKey, "recovery");
  assert.equal(state.correctStreak, 1);
  assert.equal(state.wrongStreak, 0);
});

test("Ido mission exposes all nine full activities in the intended order", () => {
  const { character } = loadCharacterModule();
  assert.deepEqual(
    Array.from(character.getActivityOrder(), (activity) => activity.id),
    [
      "lessonMatch",
      "sentenceBank",
      "shema",
      "verbMatch",
      "abbrMatch",
      "advConj",
      "prepositions",
      "binyanBoard",
      "handwriting",
    ],
  );
});

test("approved character copy and gender labels come from the registry", () => {
  const { characterData } = loadCharacterModule();
  const markup = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  const ido = characterData.characters.ido.dialogue;
  const inbal = characterData.characters.inbal.dialogue;
  const ivri = characterData.characters.ivri.dialogue;
  const idan = characterData.characters.idan.dialogue;

  assert.equal(ido.description.text, "הוא גיי");
  assert.equal(ido.description.glosses["גיי"], "gay");
  assert.equal(ido.fourRight.text, "אוקיייי, עכשיו אנחנו מדברים.");
  assert.equal(ido.recovery.text, "לא נפלת, סתם עשית ווגינג.");
  assert.equal(ido.prepositions.glosses["מילת"], "preposition");
  assert.equal(inbal.description.text, "מיסטית. רוחנית. דתית. אין הבדל.");
  assert.equal(inbal.recovery.text, "הקללה נשברה.");
  assert.equal(inbal.abbreviations.text, "קפיצת הדרך: מתחילת המילה לסופה, בלי לעבור באמצע.");
  assert.equal(inbal.fourWrong.text, "צריך לשבור את הקללה הזאת. נשימה, ומתחילים מחדש.");
  assert.equal(ivri.description.text, "הייטק. הון סיכון. אקזיט. הכל ביזנס.");
  assert.equal(ivri.fourRight.text, "מצוין. זה מה שאני קורא לו בקרת איכות. ממשיכים לבצע.");
  assert.equal(ivri.mission.text, "סגרנו את הסיבוב בהצלחה. מחר חוזרים לעבוד.");
  assert.equal(ivri.abbreviationsM.text, "זמן זה משאב יקר. קיצורים יביאו אותנו לדדליין. בוא נתחיל.");
  const inat = characterData.characters.inat.dialogue;
  // Ungendered like the other three: dropping תכיר/תכירי leaves no gendered word.
  assert.equal(inat.description.text, "פוליטיקה. היסטוריה. הפרופסורית.");
  assert.equal(inat.descriptionM, undefined);
  assert.equal(inat.descriptionF, undefined);
  assert.equal(inat.first.text, "להימנע מפוליטיקה זה חכם. אבל להבין אותה זה חשוב. שנתחיל?");
  assert.equal(inat.fourWrong.text, "אולי כדאי להתחיל טיוטה חדשה.");
  assert.equal(inat.perfect.text, "עבודה יוצאת מן הכלל. רמת דוקטורט. שקלת לימודי משפטים?");
  assert.equal(inat.abbreviationsM.glosses["מר״ת"], "abbreviations");
  assert.equal(idan.description.text, "בטיחות וביטחון. בלי תירוצים, בלי ניחושים.");
  assert.equal(idan.oneWrongM.text, "עצור. קרא שוב, ואז תענה.");
  assert.equal(idan.oneWrongF.text, "עצרי. קראי שוב, ואז תעני.");
  assert.equal(idan.fourWrong.text, "מפסיקים לנחש. נשימה, ריכוז, וחוזרים לנוהל.");
  assert.equal(idan.mission.text, "המשימה הושלמה. תחקיר קצר, ומחר חוזרים למה שנשאר פתוח.");
  // His signature line: it names the three acronyms his abbreviation route owns.
  assert.equal(idan.abbreviations.glosses["\u05e6\u05d4\u05f4\u05dc"], "IDF");
  assert.equal(idan.abbreviations.glosses["\u05e4\u05e7\u05e2\u05f4\u05e8"], "Home Front Command");
  assert.equal(idan.abbreviations.glosses["\u05de\u05de\u05f4\u05d3"], "safe room");

  // The markup carries the English default (the app's default language);
  // renderSettings swaps in זכר/נקבה when the UI language is Hebrew.
  assert.match(markup, /data-character-gender="m">Male</);
  assert.match(markup, /data-character-gender="f">Female</);
});

test("every character supplies a line for every key the engine can request", () => {
  const { character, characterData } = loadCharacterModule();
  const introKeys = character.getActivityOrder().map((activity) => activity.intro);
  const requiredKeys = ["description", "first", "greeting", "fourRight", "oneWrong",
    "fourWrong", "recovery", "perfect", "mission", ...introKeys];

  Object.values(characterData.characters).forEach((entry) => {
    requiredKeys.forEach((key) => {
      const resolved = entry.dialogue[`${key}M`] || entry.dialogue[key] ||
        entry.dialogue[characterData.DIALOGUE_FALLBACKS[key]];
      assert.ok(resolved?.text, `${entry.id} cannot resolve dialogue key "${key}"`);
    });
  });
});

test("gendered lines resolve per character and ungendered lines are shared", () => {
  const { characterData } = loadCharacterModule();
  const inbal = characterData.characters.inbal.dialogue;
  const ivri = characterData.characters.ivri.dialogue;

  assert.equal(inbal.listeningM.text, "שמע. תקשיב. עצום עיניים.");
  assert.equal(inbal.listeningF.text, "שמעי. תקשיבי. עצמי עיניים.");
  assert.equal(inbal.vocabularyF.text, "כל מילה מסתירה סוד. בואי נגלה.");
  assert.equal(inbal.handwritingF.text, "עכשיו את חורטת. ככה נכתבים לחשים.");
  assert.equal(inbal.oneWrongF.text, "זה לא את—זה מזל רע רגעי.");
  // Lines with no gender agreement stay single-variant rather than duplicated.
  ["greeting", "fourRight", "fourWrong", "recovery", "perfect", "mission", "binyanim"]
    .forEach((key) => {
      assert.ok(inbal[key], `inbal ${key} should exist unsuffixed`);
      assert.equal(inbal[`${key}M`], undefined, `inbal ${key} should not be gendered`);
    });

  assert.equal(ivri.firstM.text, "ברוך הבא לבורד. בוא נהפוך את העברית שלך ליוניקורן הבא.");
  assert.equal(ivri.firstF.text, "ברוכה הבאה לבורד. בואי נהפוך את העברית שלך ליוניקורן הבא.");
  assert.equal(ivri.listeningM.text, "המשקיעים מדברים. תקשיב טוב לפידבק.");
  assert.equal(ivri.listeningF.text, "המשקיעים מדברים. תקשיבי טוב לפידבק.");
  assert.equal(ivri.handwritingF.text, "הפגישה הזאת סודית, בלי מחשבים בחדר. קחי עט ותכתבי מהר.");
  ["fourRight", "fourWrong", "recovery", "perfect", "mission", "vocabulary", "advConj", "binyanim"]
    .forEach((key) => {
      assert.ok(ivri[key], `ivri ${key} should exist unsuffixed`);
      assert.equal(ivri[`${key}M`], undefined, `ivri ${key} should not be gendered`);
    });

  const inat = characterData.characters.inat.dialogue;
  assert.equal(inat.listeningM.text, "תקשיב לראיון הזה בפודקאסט. מה מעניין אותך פה?");
  assert.equal(inat.listeningF.text, "תקשיבי לראיון הזה בפודקאסט. מה מעניין אותך פה?");
  assert.equal(inat.handwritingF.text, "האוניברסיטה מארחת פאנל, אני צריכה שתרשמי הערות.");
  assert.equal(inat.oneWrongF.text, "זהירות. כדאי לקרוא שוב. קטן עלייך.");
  // Her masculine and feminine singulars are spelled alike in these lines
  // (שלך, שקלת, לך), so they stay single-variant.
  ["first", "fourWrong", "recovery", "perfect", "mission", "conjugation"].forEach((key) => {
    assert.ok(inat[key], `inat ${key} should exist unsuffixed`);
    assert.equal(inat[`${key}M`], undefined, `inat ${key} should not be gendered`);
  });

  const idan = characterData.characters.idan.dialogue;
  assert.equal(idan.firstM.text, "אני עידן. נתחיל במה שחייבים לדעת כשיש אזעקה, ונמשיך משם. מוכן?");
  assert.equal(idan.firstF.text, "אני עידן. נתחיל במה שחייבים לדעת כשיש אזעקה, ונמשיך משם. מוכנה?");
  assert.equal(idan.listeningM.text, "בשטח שומעים פעם אחת. תנצל אותה.");
  assert.equal(idan.listeningF.text, "בשטח שומעים פעם אחת. תנצלי אותה.");
  ["description", "greeting", "fourRight", "fourWrong", "recovery", "perfect", "mission"]
    .forEach((key) => {
      assert.ok(idan[key], `idan ${key} should exist unsuffixed`);
      assert.equal(idan[`${key}M`], undefined, `idan ${key} should not be gendered`);
    });
});

test("sprite CSS and assets exist for every character reaction", () => {
  const { characterData } = loadCharacterModule();
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");
  const indexHtml = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  const reactions = ["neutral", "frustrated", "celebrating", "struggling", "mission-complete", "nervous-laugh"];
  const expectedFiles = reactions.map((reaction) => `${reaction}.png`).sort();

  Object.keys(characterData.characters).forEach((id) => {
    const assetDir = path.join(PROJECT_ROOT, "assets", id);
    assert.deepEqual(
      fs.readdirSync(assetDir).filter((name) => name.endsWith(".png")).sort(),
      expectedFiles,
      `${id} must expose exactly the standard six production sprites`,
    );
    reactions.forEach((reaction) => {
      assert.match(css, new RegExp(
        `\\.character-sprite\\[data-character="${id}"\\]\\[data-reaction="${reaction}"\\]\\s*\\{[^}]*assets/${id}/${reaction}\\.png\\?v=20260809e`,
        "s",
      ));
      const sprite = fs.readFileSync(path.join(assetDir, `${reaction}.png`));
      assert.equal(sprite.subarray(1, 4).toString(), "PNG");
      assert.equal(sprite.readUInt32BE(16), 512, `${id}/${reaction}.png width`);
      assert.equal(sprite.readUInt32BE(20), 512, `${id}/${reaction}.png height`);
      assert.equal(sprite[25], 6, `${id}/${reaction}.png must be RGBA`);
      assert.ok(
        sprite.length < 384 * 1024,
        `${id}/${reaction}.png must stay below the approved 384 KiB hard ceiling`,
      );
    });
  });
  assert.doesNotMatch(css, /assets\/[^)"']+\/source\//);
  assert.match(indexHtml, /styles\.css\?v=20260827a/);
  assert.match(css, /\.character-sprite\s*\{[^}]*image-rendering:\s*pixelated/s);
  assert.doesNotMatch(css, /ido-sprite/);
  const idoBuilder = fs.readFileSync(
    path.join(PROJECT_ROOT, "scripts/build-ido-sprites.py"),
    "utf8",
  );
  assert.match(
    idoBuilder,
    /f"\{name\}-transparent\.png"/,
  );
  assert.match(idoBuilder, /LOGO_SCALE = 3/);
  assert.match(idoBuilder, /"sprite-masters" \/ "ido"/);
  assert.match(idoBuilder, /source\.resize/);
  assert.match(idoBuilder, /Image\.Resampling\.NEAREST/);
  assert.doesNotMatch(idoBuilder, /LOGICAL_SIZE|PALETTE_COLORS|\.quantize\(/);
  reactions.forEach((reaction) => {
    assert.match(
      idoBuilder,
      new RegExp(`"${reaction}": \\(\\d+, \\d+\\)`),
      `${reaction} needs its own logo placement`,
    );
  });
  const inatBuilder = fs.readFileSync(
    path.join(PROJECT_ROOT, "scripts/build-inat-sprites.py"),
    "utf8",
  );
  assert.match(inatBuilder, /"sprite-masters" \/ "inat"/);
  assert.match(inatBuilder, /source\.resize/);
  assert.match(inatBuilder, /Image\.Resampling\.NEAREST/);
  assert.doesNotMatch(inatBuilder, /LOGICAL_SIZE|PALETTE_COLORS|\.quantize\(/);
  const idanBuilder = fs.readFileSync(
    path.join(PROJECT_ROOT, "scripts/build-idan-sprites.py"),
    "utf8",
  );
  assert.match(idanBuilder, /"sprite-masters" \/ "idan"/);
  assert.match(idanBuilder, /SOURCE_SIZE = 1254/);
  assert.match(idanBuilder, /CANVAS_SIZE = 512/);
  assert.match(idanBuilder, /source\.resize/);
  assert.match(idanBuilder, /Image\.Resampling\.NEAREST/);
  assert.doesNotMatch(idanBuilder, /LOGICAL_SIZE|PALETTE_COLORS|\.quantize\(/);
});

test("character routing boosts owned content and stays neutral otherwise", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dailyChoice: "inbal",
    mission: { active: true },
  };

  assert.ok(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }) > 1);
  assert.equal(character.getContentWeight("vocab", { category: "cooking_verbs" }), 1);
  assert.ok(character.getContentWeight("sentence", { id: "inbal_04" }) > 1);
  assert.equal(character.getContentWeight("sentence", { id: "colloquial_01", category: "colloquial" }), 1);
  assert.ok(character.getContentWeight("verb", { id: "character-verb-levarech--sense-1" }) > 1);
  assert.ok(character.getContentWeight("abbreviation", { bucket: "People, Health & Culture" }) > 1);
  assert.equal(character.getContentWeight("abbreviation", { bucket: "Daily Life & Home" }), 1);

  // Ido owns colloquial sentences and the slang verbs instead.
  app.runtime.characterState.dailyChoice = "ido";
  assert.ok(character.getContentWeight("sentence", { id: "colloquial_01", category: "colloquial" }) > 1);
  assert.ok(character.getContentWeight("verb", { id: "advanced-verb-laharos--sense-1" }) > 1);
  assert.ok(character.getContentWeight("verb", { id: "character-verb-lirkod--sense-1" }) > 1);
  assert.ok(character.getContentWeight("verb", { id: "common-verb-latzet--sense-2" }) > 1);
  assert.equal(character.getContentWeight("sentence", { id: "inbal_04" }), 1);

  // Ivri owns professional, business, finance, and high-tech content.
  app.runtime.characterState.dailyChoice = "ivri";
  assert.ok(character.getContentWeight("vocab", { category: "technology_ai_expanded" }) > 1);
  assert.ok(character.getContentWeight("sentence", { id: "professional_01", category: "professional" }) > 1);
  assert.ok(character.getContentWeight("verb", { id: "starter-verb-letachnen--sense-1" }) > 1);
  assert.ok(character.getContentWeight("abbreviation", { bucket: "Ideas, Science & Tech" }) > 1);
  assert.equal(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }), 1);

  // Free play and no-mission states must never bias the pools.
  app.runtime.characterState.dailyChoice = "free";
  assert.equal(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }), 1);
  app.runtime.characterState = { dailyChoice: "inbal", mission: null };
  assert.equal(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }), 1);
});

test("the content weigher solves for the target owned share and stays neutral off-mission", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = { dailyChoice: "inbal", mission: { active: true } };

  // 20 owned of 1000 still has to reach the documented share, which a fixed
  // multiplier could not do across differently sized content pools.
  const items = [
    ...Array.from({ length: 20 }, () => ({ category: "religion_magic_spirituality" })),
    ...Array.from({ length: 980 }, () => ({ category: "core_advanced" })),
  ];
  const weigh = character.buildContentWeigher("vocab", items);
  const ownedMass = 20 * weigh(items[0]);
  const restMass = 980 * weigh(items[999]);
  assert.equal(Math.round((ownedMass / (ownedMass + restMass)) * 100), 65);

  // A pool with nothing owned, or entirely owned, must not be reweighted.
  assert.equal(character.buildContentWeigher("vocab", [{ category: "core_advanced" }])({}), 1);
  assert.equal(
    character.buildContentWeigher("vocab", [{ category: "religion_magic_spirituality" }])({}),
    1,
  );

  app.runtime.characterState.dailyChoice = "free";
  assert.equal(character.buildContentWeigher("vocab", items)(items[0]), 1);
  app.runtime.characterState = { dailyChoice: "inbal", mission: null };
  assert.equal(character.buildContentWeigher("vocab", items)(items[0]), 1);
});

// Idan owns security in two tiers: `civil_defense_safety` is shared with the
// whole cast, `military_operational` is his alone. The `adaptive` marker he was
// first built with is gone — he weighs content like every other character, and
// weak/missed ordering survives because the boost is uniform inside the owned set.
test("Idan routes both security tiers and stays neutral elsewhere", () => {
  const { character, characterData, app } = loadCharacterModule();
  const idan = characterData.characters.idan;
  assert.equal(idan.route.adaptive, undefined, "the adaptive short-circuit is retired");
  assert.deepEqual(
    [...idan.route.vocabCategories],
    ["civil_defense_safety", "military_operational", "emergency_response"],
  );
  assert.deepEqual([...idan.route.sentenceIdPrefixes], ["idan_"]);

  app.runtime.characterState = { dailyChoice: "idan", mission: { active: true } };
  const owned = [
    ["vocab", { he: "אזעקה", category: "civil_defense_safety" }],
    ["vocab", { he: "גדוד", category: "military_operational" }],
    ["vocab", { he: "שוטר", category: "emergency_response" }],
    // Reached through vocabWords while staying on its own shelf.
    ["vocab", { he: "פיגוע", category: "politics_society_expanded" }],
    ["sentence", { id: "idan_01", category: "everyday" }],
    ["verb", { id: "advanced-verb-lehazhir" }],
    ["abbreviation", { id: "abbr-144", bucket: "Ideas, Science & Tech" }],
    ["abbreviation", { id: "abbr-184", bucket: "Daily Life & Home" }],
  ];
  owned.forEach(([kind, item]) => {
    assert.equal(character.getContentWeight(kind, item), 2, `${kind} ${item.he || item.id} should be owned`);
  });

  const unowned = [
    ["vocab", { he: "אמונה", category: "religion_magic_spirituality" }],
    ["sentence", { id: "colloquial_01", category: "colloquial", style: "whatsapp" }],
    ["verb", { id: "character-verb-lirkod" }],
    ["abbreviation", { id: "abbr-001", bucket: "Daily Life & Home" }],
  ];
  unowned.forEach(([kind, item]) => {
    assert.equal(character.getContentWeight(kind, item), 1, `${kind} ${item.he || item.id} should stay neutral`);
  });
});

// The everyday tier is course policy rather than one character's shelf, so it
// has to reach a learner who never picks Idan.
test("every character drills the everyday security tier", () => {
  const { character, characterData, app } = loadCharacterModule();
  const ids = characterData.getCharacterIds();
  assert.deepEqual([...ids], ["ido", "inbal", "ivri", "inat", "idan"]);

  ids.forEach((id) => {
    assert.ok(
      characterData.characters[id].route.vocabCategories?.includes("civil_defense_safety"),
      `${id} should drill civil_defense_safety`,
    );
    app.runtime.characterState = { dailyChoice: id, mission: { active: true } };
    assert.equal(
      character.getContentWeight("vocab", { he: "אזעקה", category: "civil_defense_safety" }),
      2,
      `${id} should weigh the civil-defense shelf`,
    );
    // ממ״ד reaches everyone by id, even out of its bucket owner's hands.
    assert.equal(
      character.getContentWeight("abbreviation", { id: "abbr-184", bucket: "Daily Life & Home" }),
      2,
      `${id} should weigh the safe-room acronym`,
    );
  });
});

// An exclusion has to beat a bucket grant, or Ivri and Inat keep the military
// register by accident through "Ideas, Science & Tech" and "Civics, Law & Work".
test("military abbreviations belong to Idan alone", () => {
  const { character, characterData, app } = loadCharacterModule();
  const military = [
    { id: "abbr-144", bucket: "Ideas, Science & Tech" },  // צה״ל
    { id: "abbr-163", bucket: "Ideas, Science & Tech" },  // מג״ד
    { id: "abbr-152", bucket: "Civics, Law & Work" },     // פצ״ר
  ];

  ["ivri", "inat"].forEach((id) => {
    const excluded = [...characterData.characters[id].route.abbrExcludeIds];
    const granted = [...characterData.characters.idan.route.abbrIds];
    assert.ok(excluded.length > 0, `${id} should exclude the military register`);
    assert.deepEqual(
      excluded.filter((abbrId) => !granted.includes(abbrId)),
      [],
      `${id} may only exclude ids Idan is granted`,
    );
    app.runtime.characterState = { dailyChoice: id, mission: { active: true } };
    military.forEach((item) => {
      assert.equal(character.getContentWeight("abbreviation", item), 1, `${id} must not own ${item.id}`);
    });
  });

  app.runtime.characterState = { dailyChoice: "idan", mission: { active: true } };
  military.forEach((item) => {
    assert.equal(character.getContentWeight("abbreviation", item), 2, `idan should own ${item.id}`);
  });

  // Policing is Inat's per the strategy doc, so it is granted without exclusion.
  app.runtime.characterState = { dailyChoice: "inat", mission: { active: true } };
  assert.equal(
    character.getContentWeight("abbreviation", { id: "abbr-150", bucket: "Civics, Law & Work" }),
    2,
    "Border Police stays with Inat",
  );
});

// Routing has two layers: a boost, tested above, and a fence. Content strongly
// coded to one character is withheld from the rest, so a siren
// or a coalition row stops arriving as neutral filler in someone else's mission.
test("strongly coded content is withheld from the rest of the cast", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = { dailyChoice: "ido", mission: { active: true } };

  const siren = { id: "idan_01", category: "everyday" };
  const ritual = { id: "inbal_01", category: "everyday" };
  const protest = { id: "inat_19", category: "formal" };
  assert.equal(character.isContentWithheld("sentence", siren), true);
  assert.equal(character.isContentWithheld("sentence", ritual), true);
  assert.equal(character.isContentWithheld("sentence", protest), true);
  assert.equal(character.isContentWithheld("vocab", { category: "military_operational" }), true);
  assert.equal(character.isContentWithheld("vocab", { category: "emergency_response" }), true);
  assert.equal(character.isContentWithheld("vocab", { category: "politics_society_expanded" }), true);
  assert.equal(character.isContentWithheld("abbreviation", { id: "abbr-144" }), true);
  assert.equal(character.isContentWithheld("verb", { id: "advanced-verb-laharog--sense-1" }), true);

  // An owner is never fenced from their own material.
  app.runtime.characterState.dailyChoice = "idan";
  assert.equal(character.isContentWithheld("sentence", siren), false);
  assert.equal(character.isContentWithheld("vocab", { category: "military_operational" }), false);
  assert.equal(character.isContentWithheld("verb", { id: "advanced-verb-laharog--sense-1" }), false);
});

// The counterpart guarantee, and the one that keeps the pools from collapsing:
// register, style, buckets, verbs and ordinary topic shelves never fence. A
// blanket rule over them would leave each character little more than its own bank.
test("register, style and ordinary topic shelves are never withheld", () => {
  const { character, app } = loadCharacterModule();
  const shared = [
    ["sentence", { id: "colloquial_01", category: "colloquial" }],
    ["sentence", { id: "everyday_15", category: "everyday" }],
    ["sentence", { id: "professional_01", category: "professional" }],
    ["sentence", { id: "formal_03", category: "formal" }],
    ["sentence", { id: "colloquial_120", category: "colloquial", style: "whatsapp" }],
    ["vocab", { category: "groceries_food", he: "מלפפון" }],
    ["vocab", { category: "religion_magic_spirituality", he: "קליפה" }],
    ["vocab", { category: "technology_ai", he: "אלגוריתם" }],
    ["abbreviation", { id: "abbr-001", bucket: "Daily Life & Home" }],
    ["verb", { id: "starter-verb-lishmor--sense-1" }],
    ["verb", { id: "character-verb-lirkod--sense-1" }],
  ];

  ["ido", "inbal", "ivri", "inat", "idan"].forEach((id) => {
    app.runtime.characterState = { dailyChoice: id, mission: { active: true } };
    shared.forEach(([kind, item]) => {
      assert.equal(
        character.isContentWithheld(kind, item),
        false,
        `${id} must still reach ${kind} ${item.id || item.he}`,
      );
    });
  });
});

test("the neutral everyday tranche stays unowned and drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const rows = bankContext.IvriQuestSentenceBank.getSentenceBank()
    .filter((row) => /^everyday_1(?:5\d|[6-8]\d)$/.test(row.id));
  const characters = Object.values(characterData.characters);

  assert.equal(rows.length, 40);
  rows.forEach((row) => {
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        false,
        `${row.id} must not change ${entry.id}'s owned count`,
      );
    });
  });
});

test("the intermediate practical tranche stays unowned and drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 363; index <= 378; index += 1) {
    const row = byId.get(`everyday_${index}`);
    assert.ok(row, `missing everyday_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        false,
        `${row.id} must remain unowned`,
      );
    });
  }
});

test("the kitchen-action tranche stays unowned and drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 218; index <= 241; index += 1) {
    const row = byId.get(`everyday_${index}`);
    assert.ok(row, `missing everyday_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        false,
        `${row.id} must not change ${entry.id}'s owned count`,
      );
    });
  }
});

test("the home-care tranche stays unowned and drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 242; index <= 265; index += 1) {
    const row = byId.get(`everyday_${index}`);
    assert.ok(row, `missing everyday_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        false,
        `${row.id} must not change ${entry.id}'s owned count`,
      );
    });
  }
});

test("the non-partisan formal tranche is Inat-owned but drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 88; index <= 107; index += 1) {
    const row = byId.get(`formal_${index}`);
    assert.ok(row, `missing formal_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        entry.id === "inat",
        `${row.id} ownership must belong to Inat alone`,
      );
    });
  }
});

test("the relationship tranche is Ido-owned but drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 176; index <= 195; index += 1) {
    const row = byId.get(`colloquial_${index}`);
    assert.ok(row, `missing colloquial_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        entry.id === "ido",
        `${row.id} ownership must belong to Ido alone`,
      );
    });
  }
});

test("the AI tranche is Ivri-owned but drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 153; index <= 172; index += 1) {
    const row = byId.get(`professional_${index}`);
    assert.ok(row, `missing professional_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        entry.id === "ivri",
        `${row.id} ownership must belong to Ivri alone`,
      );
    });
  }
});

test("the grammar tranche stays unowned and drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 266; index <= 279; index += 1) {
    const row = byId.get(`everyday_${index}`);
    assert.ok(row, `missing everyday_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        false,
        `${row.id} must remain unowned`,
      );
    });
  }
});

test("the legal tranche is Inat-owned but drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 108; index <= 125; index += 1) {
    const row = byId.get(`formal_${index}`);
    assert.ok(row, `missing formal_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        entry.id === "inat",
        `${row.id} ownership must belong to Inat alone`,
      );
    });
  }
});

test("the finance tranche is Ivri-owned but drawable for every companion", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = Object.values(characterData.characters);

  for (let index = 173; index <= 196; index += 1) {
    const row = byId.get(`professional_${index}`);
    assert.ok(row, `missing professional_${index}`);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} must stay cast-wide`);
    characters.forEach((entry) => {
      assert.equal(
        characterData.ownsItem(entry.route, "sentence", row),
        entry.id === "ivri",
        `${row.id} ownership must belong to Ivri alone`,
      );
    });
  }
});

test("urban and practical additions preserve shared routing while character backfill stays reserved", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"), bankContext);
  const byId = new Map(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => [row.id, row]));
  const characters = characterData.characters;

  for (let index = 190; index <= 217; index += 1) {
    const row = byId.get(`everyday_${index}`);
    assert.ok(row);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} stays cast-wide`);
    Object.values(characters).forEach((entry) => {
      assert.equal(characterData.ownsItem(entry.route, "sentence", row), false, `${row.id} stays unowned`);
    });
  }

  for (let index = 168; index <= 175; index += 1) {
    const row = byId.get(`colloquial_${index}`);
    assert.ok(row);
    assert.equal(characterData.getItemAudience("sentence", row), null, `${row.id} stays shared`);
    assert.equal(characterData.ownsItem(characters.ido.route, "sentence", row), true, `${row.id} boosts Ido`);
  }

  for (let index = 102; index <= 107; index += 1) {
    const row = byId.get(`inbal_${index}`);
    assert.deepEqual(Array.from(characterData.getItemAudience("sentence", row)), ["inbal"]);
  }
  for (let index = 121; index <= 126; index += 1) {
    const row = byId.get(`idan_${index}`);
    assert.deepEqual(Array.from(characterData.getItemAudience("sentence", row)), ["idan"]);
  }

  const practicalCard = { category: "everyday_survival_expanded", he: "תחבורה ציבורית" };
  assert.equal(characterData.getItemAudience("vocab", practicalCard), null);
  assert.equal(characterData.ownsItem(characters.ido.route, "vocab", practicalCard), true);
});

// A mild row inside a fenced tranche is opted back out by id, because Idan's bank
// mixes "the shelter is in the yard" with sirens and casualties.
test("the cast-wide allow-list un-fences the ordinary safety register", () => {
  const { character, characterData, app } = loadCharacterModule();
  app.runtime.characterState = { dailyChoice: "ido", mission: { active: true } };

  assert.equal(character.isContentWithheld("sentence", { id: "idan_11", category: "everyday" }), false);
  assert.equal(character.isContentWithheld("sentence", { id: "idan_60", category: "everyday" }), false);
  assert.equal(character.isContentWithheld("sentence", { id: "idan_45", category: "everyday" }), false);
  // The alarming neighbours of those rows stay fenced.
  assert.equal(character.isContentWithheld("sentence", { id: "idan_29", category: "everyday" }), true);
  assert.equal(character.isContentWithheld("sentence", { id: "idan_33", category: "everyday" }), true);

  // The allow-list and the reserve lists must not disagree about a row.
  const shared = new Set(characterData.SHARED_ITEM_IDS.sentence);
  Object.values(characterData.characters).forEach((entry) => {
    (entry.route.sentenceReserveIds || []).forEach((id) => {
      assert.equal(shared.has(id), false, `${id} is both reserved and cast-wide`);
    });
  });
});

// The political tranche was authored into other characters' register banks, so it
// needs an explicit reserve: a register grant alone cannot fence anything.
test("a reserved row in a shared register bank becomes its reserver's alone", () => {
  const { character, app } = loadCharacterModule();
  const political = [
    { id: "colloquial_140", category: "colloquial" },
    { id: "everyday_129", category: "everyday" },
    { id: "professional_81", category: "professional" },
    { id: "formal_74", category: "formal" },
  ];

  ["ido", "inbal", "ivri", "idan"].forEach((id) => {
    app.runtime.characterState = { dailyChoice: id, mission: { active: true } };
    political.forEach((item) => {
      assert.equal(character.isContentWithheld("sentence", item), true, `${id} must not reach ${item.id}`);
    });
  });

  // Reserving must also grant: a row nobody owns would be fenced from everyone.
  app.runtime.characterState = { dailyChoice: "inat", mission: { active: true } };
  political.forEach((item) => {
    assert.equal(character.isContentWithheld("sentence", item), false);
    assert.equal(character.getContentWeight("sentence", item), 2, `${item.id} should be Inat's`);
  });
});

// The strategy doc deliberately shares Inbal's colloquial rows with Ido: a
// sentence about the evil eye is his register and her subject at once. The fence
// derives its audience from every owner, not just the prefix holder, so that
// case survives without a hand-authored exception.
test("a deliberately multi-owner row stays available to both owners", () => {
  const { character, app } = loadCharacterModule();
  const evilEye = { id: "inbal_35", category: "colloquial" };

  app.runtime.characterState = { dailyChoice: "ido", mission: { active: true } };
  assert.equal(character.isContentWithheld("sentence", evilEye), false);
  app.runtime.characterState.dailyChoice = "inbal";
  assert.equal(character.isContentWithheld("sentence", evilEye), false);
  app.runtime.characterState.dailyChoice = "ivri";
  assert.equal(character.isContentWithheld("sentence", evilEye), true);
  app.runtime.characterState.dailyChoice = "idan";
  assert.equal(character.isContentWithheld("sentence", evilEye), true);
});

test("reviewed content stays fenced across every reservable content type", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = { dailyChoice: "ido", mission: { active: true } };
  const reserved = [
    ["sentence", { id: "colloquial_144", category: "colloquial" }],
    ["vocab", { category: "military_operational", he: "שירות מילואים" }],
    ["abbreviation", { id: "abbr-144" }],
    ["verb", { id: "advanced-verb-laharog--sense-1" }],
  ];

  reserved.forEach(([kind, item]) => {
    assert.deepEqual(
      character.filterWithheldContent(kind, [item], { isSeen: () => true }),
      [],
      `${kind} review progress must not reopen its character fence`,
    );
  });

  const rows = [{ id: "idan_01", category: "everyday" }, { id: "colloquial_01", category: "colloquial" }];
  assert.deepEqual(character.filterWithheldContent("sentence", rows).map((row) => row.id), ["colloquial_01"]);

  // Free play draws the whole course.
  app.runtime.characterState.dailyChoice = "free";
  assert.deepEqual(character.filterWithheldContent("sentence", rows), rows);
  assert.equal(character.isContentWithheld("sentence", rows[0]), false);
  app.runtime.characterState = { dailyChoice: "ido", mission: null, lensCharacter: "" };
  assert.equal(character.isContentWithheld("sentence", rows[0]), false);
});

// Every id in the allow-list and every reserve list must name a real row; a typo
// silently fences nothing, or fences a row that does not exist.
test("every cast-wide and reserved sentence id resolves to a real sentence", () => {
  const { characterData } = loadCharacterModule();
  const bankContext = { console };
  bankContext.window = bankContext;
  bankContext.globalThis = bankContext;
  vm.createContext(bankContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "sentence-bank-data.js"), "utf8"),
    bankContext,
    { filename: "sentence-bank-data.js" },
  );
  const ids = new Set(bankContext.IvriQuestSentenceBank.getSentenceBank().map((row) => row.id));

  characterData.SHARED_ITEM_IDS.sentence.forEach((id) => {
    assert.ok(ids.has(id), `cast-wide list names unknown sentence ${id}`);
  });
  Object.values(characterData.characters).forEach((entry) => {
    (entry.route.sentenceReserveIds || []).forEach((id) => {
      assert.ok(ids.has(id), `${entry.id} reserves unknown sentence ${id}`);
    });
  });
});

// A canary, not a gate: reservation must never fence a mode into the ground. The
// worst current values are far above these floors, so a failure here means a new
// tranche was reserved without the shared pool growing to match.
test("no character's draw pool is fenced below a playable floor", () => {
  const { buildReport } = require("../scripts/character-content-report.js");
  const floors = { vocab: 900, sentence: 400, abbreviation: 150, verb: 200 };
  const { rows } = buildReport();

  rows.forEach((row) => {
    Object.entries(floors).forEach(([kind, floor]) => {
      assert.ok(
        row.available[kind] >= floor,
        `${row.nameEn} can only draw ${row.available[kind]} ${kind} items, below ${floor}`,
      );
    });
  });
});

// The fence has to be wired at every draw site, and the app-progress harness does
// not load the character modules, so this is what pins the integration.
test("every content draw site applies the withholding filter", () => {
  [
    "app/data.js",
    "app/sentence-bank.js",
    "app/abbreviation.js",
    "app/verb-match.js",
    "app/handwriting.js",
  ].forEach((modulePath) => {
    const source = fs.readFileSync(path.join(PROJECT_ROOT, modulePath), "utf8");
    assert.match(source, /filterWithheldContent\?\.\(/, `${modulePath} must filter withheld content`);
    assert.doesNotMatch(source, /\bisSeen\b/, `${modulePath} must not exempt reviewed content`);
  });

  ["app/data.js", "app/sentence-bank.js", "app/abbreviation.js"].forEach((modulePath) => {
    const source = fs.readFileSync(path.join(PROJECT_ROOT, modulePath), "utf8");
    assert.ok(
      source.indexOf("filterWithheldContent?.(") < source.indexOf("const unused ="),
      `${modulePath} must fence the full pool before excluding used items`,
    );
  });
});

// Every routed abbreviation id must name a real row, the same guard the verb
// route already has. A typo here silently routes nothing.
test("every routed abbreviation id resolves to a real abbreviation", () => {
  const { characterData } = loadCharacterModule();
  const abbrContext = { console };
  abbrContext.window = abbrContext;
  abbrContext.globalThis = abbrContext;
  vm.createContext(abbrContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "abbreviation-data.js"), "utf8"),
    abbrContext,
    { filename: "abbreviation-data.js" },
  );
  const ids = new Set(abbrContext.IvriQuestAbbreviations.getAbbreviations().map((row) => row.id));

  Object.values(characterData.characters).forEach((entry) => {
    [...(entry.route.abbrIds || []), ...(entry.route.abbrExcludeIds || [])].forEach((abbrId) => {
      assert.ok(ids.has(abbrId), `${entry.id} routes unknown abbreviation ${abbrId}`);
    });
  });
});

test("every vocabulary category belongs to exactly one performance domain", () => {
  const vocabContext = { window: {}, globalThis: {} };
  vocabContext.window = vocabContext;
  vocabContext.globalThis = vocabContext;
  vm.createContext(vocabContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "vocab-data.js"), "utf8"),
    vocabContext,
    { filename: "vocab-data.js" },
  );
  const bootstrapContext = { window: {}, globalThis: {} };
  bootstrapContext.window = bootstrapContext;
  bootstrapContext.globalThis = bootstrapContext;
  vm.createContext(bootstrapContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "app/bootstrap-data.js"), "utf8"),
    bootstrapContext,
    { filename: "app/bootstrap-data.js" },
  );

  const bootstrapData = bootstrapContext.IvriQuestApp.bootstrapData;
  const domains = bootstrapData.PERFORMANCE_DOMAINS;
  const categories = new Set(
    vocabContext.IvriQuestVocab.getBaseVocabulary().map((word) => word.category),
  );

  // FALLBACK_DOMAIN_ID is derived from the last domain, so appending a domain
  // would silently turn it into the catch-all bucket.
  assert.equal(bootstrapData.FALLBACK_DOMAIN_ID, "formal");
  assert.equal(domains[domains.length - 1].id, "formal");

  categories.forEach((category) => {
    const owners = domains.filter((domain) => domain.categories.has(category)).map((domain) => domain.id);
    assert.equal(owners.length, 1, `${category} maps to ${owners.length} domains: ${owners.join(", ") || "none"}`);
  });

  const i18n = bootstrapData.I18N;
  domains.forEach((domain) => {
    assert.ok(i18n.en.domain[domain.id], `missing English label for domain ${domain.id}`);
    assert.ok(i18n.he.domain[domain.id], `missing Hebrew label for domain ${domain.id}`);
  });
});

test("the welcome prompt takes visual precedence over the daily picker", () => {
  const characterSource = fs.readFileSync(path.join(PROJECT_ROOT, "app/character.js"), "utf8");
  const uiSource = fs.readFileSync(path.join(PROJECT_ROOT, "app/ui.js"), "utf8");
  assert.match(characterSource, /character\.isBlocking\(\) && !runtime\.state\?\.welcomeModalOpen/);
  assert.match(uiSource, /runtime\.state\.welcomeModalOpen = false;\s*runtime\.helpers\?\.renderAll\?\.\(\);/);
  assert.doesNotMatch(uiSource, /renderWelcomeModal[\s\S]*character\?\.isBlocking/);
});

test("mission results use a centered two-button action group", () => {
  const characterSource = fs.readFileSync(path.join(PROJECT_ROOT, "app/character.js"), "utf8");
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");
  assert.match(characterSource, /classList\.add\("mission-results-actions"\)/);
  assert.match(css, /\.results-actions\.mission-results-actions\s*\{[^}]*margin-inline:\s*auto;[^}]*repeat\(2,/s);
});

test("a saved mission from a prior day is discarded before ordinary session restore", () => {
  const { character, app, getClearedSessionCount, savedWrites } = loadCharacterModule({
    saved: {
      dayKey: "2000-01-01",
      gender: "f",
      hasChosen: { ido: true },
      dailyChoice: "ido",
      screen: "none",
      mission: {
        active: true,
        activities: ["lessonMatch"],
        currentActivity: "lessonMatch",
      },
    },
  });

  assert.equal(character.initialize(), false);
  assert.equal(getClearedSessionCount(), 1);
  assert.equal(app.runtime.characterState.screen, "picker");
  assert.equal(app.runtime.characterState.dailyChoice, "");
  assert.equal(app.runtime.characterState.mission, null);
  assert.equal(app.runtime.characterState.gender, "f");
  assert.equal(savedWrites.at(-1).screen, "picker");
});

test("same-day missions migrate legacy sheet coordinates to semantic sprite names", () => {
  const now = new Date();
  const dayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const { character, app } = loadCharacterModule({
    saved: {
      dayKey,
      gender: "m",
      hasChosen: { ido: true },
      dailyChoice: "ido",
      screen: "none",
      mission: {
        active: true,
        activities: ["lessonMatch"],
        currentActivity: "lessonMatch",
        sprite: "bottom-left",
      },
    },
  });

  assert.equal(character.initialize(), true);
  assert.equal(app.runtime.characterState.mission.sprite, "celebrating");
});

test("capturing a completed activity advances the mission without shortening the game", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    reviewOpen: false,
    mission: {
      active: true,
      completed: false,
      activities: ["lessonMatch", "sentenceBank"],
      skippedActivities: [],
      currentIndex: 0,
      currentActivity: "lessonMatch",
      results: [],
      visible: true,
    },
  };

  // false hands the screen back to showSessionSummary, which renders this
  // activity's own results; the hub waits until Continue.
  assert.equal(character.captureActivitySummary({
    correctCount: 20,
    incorrectCount: 2,
    elapsedSeconds: 187,
    mistakes: [{ primary: "test" }],
  }), false);
  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(app.runtime.characterState.mission.onHub, false);
  assert.equal(app.runtime.characterState.mission.currentIndex, 1);
  assert.equal(app.runtime.characterState.mission.currentActivity, "");
  assert.deepEqual(
    JSON.parse(JSON.stringify(app.runtime.characterState.mission.results[0])),
    {
      id: "lessonMatch",
      nameEn: "Vocabulary",
      nameHe: "אוצר מילים",
      correctCount: 20,
      incorrectCount: 2,
      elapsedSeconds: 187,
      mistakes: [{ primary: "test" }],
      skipped: false,
    },
  );
});

function missionStateForCapture(overrides = {}) {
  return {
    dayKey: "2026-08-01",
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    reviewOpen: false,
    mission: {
      active: true,
      completed: false,
      activities: ["lessonMatch", "sentenceBank"],
      skippedActivities: [],
      currentIndex: 0,
      currentActivity: "lessonMatch",
      results: [],
      visible: true,
      onHub: false,
      ...overrides,
    },
  };
}

test("a flawless mid-mission activity no longer opens a blocking Perfect scene", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = missionStateForCapture();

  assert.equal(character.captureActivitySummary({
    correctCount: 12,
    incorrectCount: 0,
    elapsedSeconds: 90,
    mistakes: [],
  }), false);
  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(character.isBlocking(), false);
  assert.equal(app.runtime.characterState.mission.onHub, false);
});

test("continuing from a per-activity recap hands off to the mission hub", () => {
  const { character, app } = loadCharacterModule();
  let summaryCleared = 0;
  app.session = { clearSummaryState: () => { summaryCleared += 1; } };
  app.runtime.characterState = missionStateForCapture();

  character.captureActivitySummary({
    correctCount: 8,
    incorrectCount: 2,
    elapsedSeconds: 120,
    mistakes: [{ primary: "מילה" }],
  });
  // The game's own summary is on screen at this point, not the mission's.
  app.runtime.state.summary = { active: true, game: "lessonMatch" };
  app.runtime.state.route = "results";

  assert.equal(character.handleResultsContinue(), true);
  assert.equal(summaryCleared, 1);
  assert.equal(app.runtime.characterState.mission.onHub, true);
  assert.equal(app.runtime.characterState.mission.currentIndex, 1);
  assert.equal(app.runtime.state.route, "home");
  assert.equal(character.shouldShowMissionHub(), true);
});

test("a save written before the Perfect scene was folded in loads as no screen", () => {
  const now = new Date();
  const dayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const { character, app } = loadCharacterModule({
    saved: {
      dayKey,
      gender: "m",
      hasChosen: { ido: true },
      dailyChoice: "ido",
      screen: "perfect",
      mission: {
        active: true,
        activities: ["lessonMatch"],
        currentActivity: "lessonMatch",
        currentIndex: 0,
        results: [],
      },
    },
  });
  character.initialize();

  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(character.isBlocking(), false);
});

test("an active mission can pause on its home hub without discarding the current game", () => {
  const { character, app } = loadCharacterModule();
  app.session = {
    hasActiveLearnSession: () => true,
    stopVerbMatchTimer: () => {},
    stopLessonTimer: () => {},
    stopSentenceBankTimer: () => {},
    stopAbbreviationTimer: () => {},
    stopWordMatchTimer: () => {},
  };
  app.runtime.state.mode = "sentenceBank";
  app.runtime.characterState = {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    mission: {
      active: true,
      completed: false,
      onHub: false,
      activities: ["sentenceBank"],
      skippedActivities: [],
      currentIndex: 0,
      currentActivity: "sentenceBank",
      results: [],
      visible: true,
    },
  };

  assert.equal(character.showMissionHub(), true);
  assert.equal(character.shouldShowMissionHub(), true);
  assert.equal(app.runtime.characterState.mission.currentActivity, "sentenceBank");
  assert.equal(app.runtime.state.mode, "home");
  assert.equal(app.runtime.state.route, "home");
});

test("a paused mission hub may navigate to Review or Settings while its game remains active", () => {
  const { character, app, context } = loadCharacterModule();
  app.runtime.state.wordMatch = { active: true };
  app.runtime.characterState = {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    mission: {
      active: true,
      completed: false,
      onHub: true,
      activities: ["lessonMatch"],
      skippedActivities: [],
      currentIndex: 0,
      currentActivity: "lessonMatch",
      results: [],
      visible: true,
    },
  };
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "app/session.js"), "utf8"),
    context,
    { filename: "app/session.js" },
  );

  assert.equal(app.session.resolveInitialRoute("review"), "review");
  assert.equal(app.session.resolveInitialRoute("settings"), "settings");
  app.runtime.characterState.mission.onHub = false;
  assert.equal(app.session.resolveInitialRoute("review"), "home");
});

test("companion and result layout lock Ido to the right of his bubble", () => {
  const source = fs.readFileSync(path.join(PROJECT_ROOT, "app/character.js"), "utf8");
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");
  assert.match(source, /toggle\.textContent = visible \? "hide" : "show";/);
  assert.match(css, /\.character-companion\s*\{[^}]*position:\s*fixed;[^}]*direction:\s*ltr;/s);
  assert.match(css, /grid-template-areas:\s*"bubble sprite"/);
  assert.match(css, /\.mission-results-hero\s*\{[^}]*direction:\s*ltr;/s);
  assert.match(css, /\.character-word-gloss\s*\{[^}]*position:\s*absolute;[^}]*bottom:\s*calc\(100% \+ 0\.38rem\);/s);
  assert.match(source, /clampCompanionPosition/);
  assert.match(source, /setPointerCapture/);
});

test("the final activity produces one aggregate mission summary and the final sprite", () => {
  const { character, app } = loadCharacterModule();
  let summaryConfig = null;
  app.session = {
    showSessionSummary: (config) => {
      summaryConfig = config;
      app.runtime.state.summary.game = config.game;
    },
  };
  app.runtime.characterState = {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    reviewOpen: false,
    mission: {
      active: true,
      completed: false,
      activities: ["lessonMatch"],
      skippedActivities: [],
      currentIndex: 0,
      currentActivity: "lessonMatch",
      results: [],
      visible: false,
    },
  };

  assert.equal(character.captureActivitySummary({
    correctCount: 18,
    incorrectCount: 2,
    elapsedSeconds: 205,
    mistakes: [{ primary: "מילה" }],
  }), true);
  assert.deepEqual(
    JSON.parse(JSON.stringify(summaryConfig)),
    {
      game: "characterMission",
      correctCount: 18,
      incorrectCount: 2,
      elapsedSeconds: 205,
      mistakes: [{ primary: "מילה" }],
    },
  );
  assert.equal(app.runtime.characterState.screen, "results");
  assert.equal(app.runtime.characterState.mission.active, false);
  assert.equal(app.runtime.characterState.mission.completed, true);
  assert.equal(app.runtime.characterState.mission.visible, true);
  assert.equal(app.runtime.characterState.mission.sprite, "mission-complete");
  assert.equal(app.runtime.characterState.mission.dialogueKey, "mission");
  assert.equal(app.runtime.state.route, "results");
});

test("continuing to Free Play keeps the completed Ido choice locked for the same day", () => {
  const { character, app, savedWrites } = loadCharacterModule();
  app.session = {
    clearSummaryState: () => {
      app.runtime.state.summary.active = false;
      app.runtime.state.summary.game = "";
    },
  };
  app.runtime.state.summary = { active: true, game: "characterMission" };
  app.runtime.characterState = {
    dayKey: character.getTodayKey(),
    gender: "f",
    dailyChoice: "ido",
    screen: "results",
    reviewOpen: true,
    mission: {
      active: false,
      completed: true,
      activities: ["lessonMatch"],
      skippedActivities: [],
      currentIndex: 1,
      currentActivity: "",
      results: [],
      visible: true,
      sprite: "mission-complete",
      dialogueKey: "mission",
    },
  };

  assert.equal(character.handleResultsContinue(), true);
  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(app.runtime.characterState.dailyChoice, "ido");
  assert.equal(app.runtime.characterState.mission.completed, true);
  assert.equal(savedWrites.at(-1).screen, "none");

  const reloaded = loadCharacterModule({ saved: savedWrites.at(-1) });
  assert.equal(reloaded.character.initialize(), true);
  assert.equal(reloaded.app.runtime.characterState.screen, "none");
  assert.equal(reloaded.app.runtime.characterState.dailyChoice, "ido");
  assert.equal(reloaded.app.runtime.characterState.mission.completed, true);
  assert.equal(reloaded.getClearedSessionCount(), 0);
});

test("the free-play lens routes content and reacts without a mission", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "f", hasChosen: {},
    dailyChoice: "free", pendingChoice: "", lensCharacter: "inbal",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "none", reviewOpen: false, mission: null,
  };

  // Routing follows the lens even though no mission is running.
  assert.ok(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }) > 1);
  assert.ok(character.buildContentWeigher("vocab", [
    { category: "religion_magic_spirituality" }, { category: "core_advanced" },
  ])({ category: "religion_magic_spirituality" }) > 1);

  // Reactions accumulate on the free-play container, not on a mission.
  for (let index = 0; index < 4; index += 1) character.recordAnswer(false);
  assert.equal(app.runtime.characterState.freePlay.sprite, "struggling");
  assert.equal(app.runtime.characterState.mission, null);
  character.recordAnswer(true);
  assert.equal(app.runtime.characterState.freePlay.dialogueKey, "recovery");

  // With no lens at all, nothing routes and nothing reacts.
  app.runtime.characterState.lensCharacter = "";
  app.runtime.characterState.freePlay.sprite = "neutral";
  assert.equal(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }), 1);
  character.recordAnswer(false);
  assert.equal(app.runtime.characterState.freePlay.sprite, "neutral");
});

test("leaving completed results shows the newly selected free-play companion", () => {
  const { character, app } = loadCharacterModule();
  const companionClasses = {};
  const spriteClasses = {};
  const spriteAttributes = {};
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: { inbal: true },
    dailyChoice: "inbal", pendingChoice: "", lensCharacter: "ido",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "results", reviewOpen: true,
    mission: { active: false, completed: true, onHub: false, tier: "short",
      activities: ["lessonMatch"], skippedActivities: [], currentIndex: 1,
      currentActivity: "", results: [], correctStreak: 0, wrongStreak: 0,
      sprite: "mission-complete", dialogueKey: "mission", reactionTransient: false,
      reactionQuestionKey: "", visible: true, companionPosition: null, startedAt: Date.now() },
  };
  app.runtime.el = {
    characterCompanion: {
      classList: { toggle: (name, enabled) => { companionClasses[name] = enabled; } },
      style: { removeProperty: () => {} },
    },
    characterCompanionSprite: {
      dataset: {},
      classList: { toggle: (name, enabled) => { spriteClasses[name] = enabled; } },
      setAttribute: (name, value) => { spriteAttributes[name] = value; },
    },
  };
  app.session = { hasActiveLearnSession: () => true };

  assert.equal(character.handleNavigation("settings"), false);
  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(app.runtime.characterState.reviewOpen, false);

  character.renderCompanion();
  assert.equal(companionClasses.hidden, false);
  assert.equal(app.runtime.el.characterCompanionSprite.dataset.character, "ido");
  assert.equal(app.runtime.el.characterCompanionSprite.dataset.reaction, "neutral");
  assert.equal(spriteClasses.hidden, false);
  assert.equal(spriteAttributes["aria-label"], "Ido");
});

test("reload repairs a stale completed-result screen before rendering free play", () => {
  const { character, app } = loadCharacterModule();
  const companionClasses = {};
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: { inbal: true },
    dailyChoice: "inbal", pendingChoice: "", lensCharacter: "ido",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "results", reviewOpen: true,
    mission: { active: false, completed: true, onHub: false, tier: "short",
      activities: ["lessonMatch"], skippedActivities: [], currentIndex: 1,
      currentActivity: "", results: [], correctStreak: 0, wrongStreak: 0,
      sprite: "mission-complete", dialogueKey: "mission", reactionTransient: false,
      reactionQuestionKey: "", visible: true, companionPosition: null, startedAt: Date.now() },
  };
  app.runtime.el = {
    characterCompanion: {
      classList: { toggle: (name, enabled) => { companionClasses[name] = enabled; } },
      style: { removeProperty: () => {} },
    },
    characterCompanionSprite: {
      dataset: {},
      classList: { toggle: () => {} },
      setAttribute: () => {},
    },
  };
  app.session = { hasActiveLearnSession: () => true };

  character.render();

  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(app.runtime.characterState.reviewOpen, false);
  assert.equal(companionClasses.hidden, false);
  assert.equal(app.runtime.el.characterCompanionSprite.dataset.character, "ido");
});

test("a running mission owns the lens and blocks Settings from changing it", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: { ido: true },
    dailyChoice: "ido", pendingChoice: "", lensCharacter: "ido",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "none", reviewOpen: false,
    mission: { active: true, completed: false, onHub: false, tier: "short",
      activities: ["lessonMatch"], skippedActivities: [], currentIndex: 0,
      currentActivity: "lessonMatch", results: [], correctStreak: 0, wrongStreak: 0,
      sprite: "neutral", dialogueKey: "", reactionTransient: false, reactionQuestionKey: "",
      visible: true, companionPosition: null, startedAt: Date.now() },
  };

  assert.equal(character.canChangeLens(), false);
  assert.equal(character.setLensCharacter("inbal"), false);
  assert.equal(app.runtime.characterState.lensCharacter, "ido");
  // The mission's own content bias must be unaffected by the attempt.
  assert.ok(character.getContentWeight("sentence", { id: "colloquial_01", category: "colloquial" }) > 1);

  // Reactions land on the mission while it runs, leaving free play untouched.
  character.recordAnswer(false);
  assert.equal(app.runtime.characterState.mission.sprite, "nervous-laugh");
  assert.equal(app.runtime.characterState.freePlay.sprite, "neutral");

  app.runtime.characterState.mission.active = false;
  assert.equal(character.canChangeLens(), true);
  assert.equal(character.setLensCharacter("inbal"), true);
  assert.equal(app.runtime.characterState.lensCharacter, "inbal");
});

test("bond XP accrues per correct answer, doubles on owned content, and levels up", () => {
  const { character, app, bondWrites } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "f", hasChosen: {},
    dailyChoice: "free", pendingChoice: "", lensCharacter: "inbal",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "none", reviewOpen: false, mission: null,
  };

  const start = character.getBondProgress("inbal");
  assert.deepEqual(
    { xp: start.xp, level: start.level, days: start.daysInteracted, missions: start.missions },
    { xp: 0, level: 0, days: 0, missions: 0 },
  );

  // No routable item resolvable -> single XP. Wrong answers earn nothing.
  character.recordAnswer(true);
  assert.equal(character.getBondProgress("inbal").xp, 1);
  character.recordAnswer(false);
  assert.equal(character.getBondProgress("inbal").xp, 1);

  // A sentence Inbal owns is worth double.
  app.runtime.state.mode = "sentenceBank";
  app.runtime.state.sentenceBank = { currentQuestion: { sentence: { id: "inbal_04" } } };
  character.recordAnswer(true);
  assert.equal(character.getBondProgress("inbal").xp, 3);

  // Someone else's material still counts, but only once.
  app.runtime.state.sentenceBank = { currentQuestion: { sentence: { id: "colloquial_01", category: "colloquial" } } };
  character.recordAnswer(true);
  assert.equal(character.getBondProgress("inbal").xp, 4);

  // Level 1 needs 60 XP; check the threshold rather than trusting the curve.
  for (let index = 0; index < 56; index += 1) character.recordAnswer(true);
  assert.equal(character.getBondProgress("inbal").xp, 60);
  assert.equal(character.getBondProgress("inbal").level, 1);
  assert.equal(character.getBondProgress("inbal").xpIntoLevel, 0);
  assert.equal(character.getBondProgress("inbal").xpForNextLevel, 120);

  // One day of play counts once, and Ido's bond is untouched throughout.
  assert.equal(character.getBondProgress("inbal").daysInteracted, 1);
  assert.equal(character.getBondProgress("ido").xp, 0);
  assert.ok(bondWrites.length > 0, "bond writes go to their own storage key");
  assert.equal(bondWrites.at(-1).inbal.xp, 60);
});

test("bond progress survives the day rollover that wipes mission state", () => {
  const today = new Date();
  const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const { character, app } = loadCharacterModule({
    saved: { dayKey: "2000-01-01", gender: "f", hasChosen: { inbal: true }, lensCharacter: "inbal" },
    savedBonds: { inbal: { xp: 250, missions: 3, days: ["2026-07-24", "2026-07-25"] } },
  });

  // A prior-day save is discarded, so the mission is gone...
  assert.equal(character.initialize(), false);
  assert.equal(app.runtime.characterState.mission, null);
  assert.equal(app.runtime.characterState.dayKey, key);
  // ...but the relationship and the lens preference both persist.
  assert.equal(app.runtime.characterState.lensCharacter, "inbal");
  const bond = character.getBondProgress("inbal");
  assert.equal(bond.xp, 250);
  assert.equal(bond.missions, 3);
  assert.equal(bond.daysInteracted, 2);
  assert.equal(bond.level, 2);
});

test("completing a mission awards the mission bond bonus once", () => {
  const { character, app } = loadCharacterModule();
  app.session = { showSessionSummary: () => {} };
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: { ido: true },
    dailyChoice: "ido", pendingChoice: "", lensCharacter: "ido",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "none", reviewOpen: false,
    mission: { active: true, completed: false, onHub: false, tier: "short",
      activities: ["lessonMatch"], skippedActivities: [], currentIndex: 1,
      currentActivity: "", results: [{ id: "lessonMatch", nameEn: "Vocabulary", nameHe: "אוצר מילים",
        correctCount: 10, incorrectCount: 0, elapsedSeconds: 60, mistakes: [], skipped: false }],
      correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true,
      companionPosition: null, startedAt: Date.now() },
  };

  character.finishMission();
  const bond = character.getBondProgress("ido");
  assert.equal(bond.missions, 1);
  assert.equal(bond.xp, 40);
  assert.equal(character.getBondProgress("inbal").missions, 0);
});

test("static sprite syncing does not overwrite renderer-owned sprites", () => {
  const source = fs.readFileSync(path.join(PROJECT_ROOT, "app/character.js"), "utf8");
  // A broad `.character-sprite[data-character]` sweep repointed every sprite on
  // the page at the active character, so the Review cards all showed one face.
  assert.match(source, /querySelectorAll\?\.\(["']\.intro-character-sprite["']\)/);
  assert.doesNotMatch(source, /querySelectorAll\?\.\(["']\.character-sprite\[data-character\]["']\)/);

  const markup = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  // Every static sprite in the markup must be reachable by that narrower hook,
  // except the companion, which renderCompanion sets directly.
  const staticSprites = markup.match(/class="character-sprite[^"]*"/g) || [];
  const introSprites = staticSprites.filter((cls) => cls.includes("intro-character-sprite"));
  assert.equal(staticSprites.length - introSprites.length, 1, "only the companion is set by its renderer");
});

test("the Characters review tab is registered everywhere the tab state is read", () => {
  const markup = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  const bootstrapRuntime = fs.readFileSync(path.join(PROJECT_ROOT, "app/bootstrap-runtime.js"), "utf8");
  const uiSource = fs.readFileSync(path.join(PROJECT_ROOT, "app/ui.js"), "utf8");
  const bootstrapData = fs.readFileSync(path.join(PROJECT_ROOT, "app/bootstrap-data.js"), "utf8");

  assert.match(markup, /data-review-tab="characters"/);
  assert.match(markup, /id="reviewCharactersPanel"/);
  // Characters is the default tab: relationship building is the primary
  // gamification surface, so it must lead and be the reload fallback.
  assert.match(bootstrapRuntime, /\["characters", "overview", "trouble"\]/);
  assert.match(bootstrapRuntime, /: "characters",/);
  const tabOrder = [...markup.matchAll(/data-review-tab="([a-z]+)"/g)].map((match) => match[1]);
  assert.deepEqual(tabOrder, ["characters", "overview", "trouble"]);
  assert.match(uiSource, /reviewCharactersPanel\.hidden = tab !== "characters"/);
  assert.match(uiSource, /renderBondPanel/);
  assert.match(bootstrapData, /tabCharacters: "Characters"/);
  assert.match(bootstrapData, /tabCharacters: "דמויות"/);
});

test("vocabWords routes words that live outside the character's own category", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = { dailyChoice: "inbal", mission: { active: true } };

  // Her own category still routes.
  assert.ok(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }) > 1);
  // And so do individually listed words, even from a category Ido owns.
  assert.ok(character.getContentWeight("vocab", { he: "חילוני", category: "social_cultural" }) > 1);
  assert.ok(character.getContentWeight("vocab", { he: "חופש דת", category: "politics_society_expanded" }) > 1);
  assert.ok(character.getContentWeight("vocab", { he: "אמונה", category: "abstract_philosophy" }) > 1);
  // An unlisted word in the same borrowed category must stay neutral.
  assert.equal(character.getContentWeight("vocab", { he: "הפגנה", category: "social_cultural" }), 1);
  // Free play never biases.
  app.runtime.characterState.dailyChoice = "free";
  assert.equal(character.getContentWeight("vocab", { he: "חילוני", category: "social_cultural" }), 1);
});

test("Inat's vocabWords reach cards that sit on someone else's shelf", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = { dailyChoice: "inat", mission: { active: true } };

  // תחרותי lives in work_business, which Ivri owns by category; ספורים lives in
  // the unrouted core_advanced. Neither is re-shelved — both are reached by word.
  assert.ok(character.getContentWeight("vocab", { he: "תחרותי", category: "work_business" }) > 1);
  assert.ok(character.getContentWeight("vocab", { he: "ספורים", category: "core_advanced" }) > 1);
  // An unlisted neighbour in the same borrowed category stays neutral.
  assert.equal(character.getContentWeight("vocab", { he: "פער יישום", category: "work_business" }), 1);

  // Ivri keeps תחרותי through the category route, so it is genuinely shared.
  app.runtime.characterState.dailyChoice = "ivri";
  assert.ok(character.getContentWeight("vocab", { he: "תחרותי", category: "work_business" }) > 1);
  assert.equal(character.getContentWeight("vocab", { he: "ספורים", category: "core_advanced" }), 1);
});

test("every routed verb id resolves to a real conjugation deck entry", () => {
  const { characterData } = loadCharacterModule();
  const verbContext = { console };
  verbContext.window = verbContext;
  verbContext.globalThis = verbContext;
  vm.createContext(verbContext);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "hebrew-verbs.js"), "utf8"),
    verbContext,
    { filename: "hebrew-verbs.js" },
  );
  const deck = verbContext.IvriQuestHebrewVerbs.buildVerbConjugationDeck({ vocabulary: [] });
  const deckIds = new Set(deck.map((item) => item.id));

  Object.values(characterData.characters).forEach((entry) => {
    (entry.route.verbIds || []).forEach((verbId) => {
      // A routed id that never reaches the deck is dead weight: the boost can
      // never fire, and a malformed paradigm drops a verb silently. A route may
      // name a whole entry (matched through its first sense) or one deck id
      // directly, which is how a shared paradigm splits between characters.
      assert.ok(
        deckIds.has(verbId) || deckIds.has(`${verbId}--sense-1`),
        `${entry.id} routes ${verbId} but it is not in the conjugation deck`,
      );
    });
  });

  // Ido's verb route is the one deliberately sized against the others, so a
  // silent trim or an accidental re-route should have to update this number.
  assert.equal(characterData.characters.ido.route.verbIds.length, 30);
  assert.equal(new Set(characterData.characters.ido.route.verbIds).size, 30);
});

test("a per-sense verb route reaches only that sense", () => {
  const { character, characterData, app } = loadCharacterModule();

  // לקלוט is one paradigm whose senses belong to three different companions.
  assert.ok(characterData.characters.ido.route.verbIds.includes("character-verb-liklot--sense-1"));
  assert.ok(characterData.characters.ivri.route.verbIds.includes("character-verb-liklot--sense-2"));
  assert.ok(characterData.characters.inat.route.verbIds.includes("character-verb-liklot--sense-3"));

  app.runtime.characterState = { dailyChoice: "ivri", mission: { active: true } };
  assert.ok(character.getContentWeight("verb", { id: "character-verb-liklot--sense-2" }) > 1);
  // The colloquial and immigration senses must stay neutral for him.
  assert.equal(character.getContentWeight("verb", { id: "character-verb-liklot--sense-1" }), 1);
  assert.equal(character.getContentWeight("verb", { id: "character-verb-liklot--sense-3" }), 1);
  // A whole-entry route still covers every sense of that entry.
  assert.ok(character.getContentWeight("verb", { id: "character-verb-lehaklit--sense-1" }) > 1);

  // לבקר's criticism sense is Inat's; its visit sense stays unowned.
  app.runtime.characterState.dailyChoice = "inat";
  assert.ok(character.getContentWeight("verb", { id: "advanced-verb-levaker--sense-2" }) > 1);
  assert.equal(character.getContentWeight("verb", { id: "advanced-verb-levaker--sense-1" }), 1);
});

function createStubElement(tag) {
  const element = {
    tagName: tag,
    className: "",
    textContent: "",
    dataset: {},
    children: [],
    attributes: {},
    style: {},
    parentNode: null,
    classList: {
      toggle(name, force) {
        const classes = new Set(String(element.className).split(" ").filter(Boolean));
        if (force === undefined ? classes.has(name) : !force) classes.delete(name);
        else classes.add(name);
        element.className = Array.from(classes).join(" ");
      },
    },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    addEventListener() {},
    append(...nodes) { nodes.forEach((node) => { node.parentNode = this; }); this.children.push(...nodes); },
    prepend(...nodes) { nodes.forEach((node) => { node.parentNode = this; }); this.children.unshift(...nodes); },
    remove() {
      if (!this.parentNode) return;
      this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
      this.parentNode = null;
    },
    querySelectorAll(selector) {
      const attribute = selector.match(/^\[data-([a-z-]+)\]$/i);
      if (attribute) {
        const key = attribute[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return this.children.filter((child) => child.dataset[key] !== undefined);
      }
      const wanted = selector.replace(/^\./, "");
      return this.children.filter((child) => String(child.className || "").split(" ").includes(wanted));
    },
  };
  Object.defineProperty(element, "innerHTML", {
    get() { return ""; },
    set() { element.children = []; },
  });
  return element;
}

function freePlayState(character, lensCharacter, overrides = {}) {
  return {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: {},
    dailyChoice: "free", pendingChoice: "", lensCharacter,
    freePlay: {
      correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null,
      ...overrides,
    },
    screen: "none", reviewOpen: false, mission: null,
  };
}

test("a new free-play game clears the persisted four-in-a-row reaction", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = freePlayState(character, "ivri", {
    correctStreak: 4, sprite: "celebrating", dialogueKey: "fourRight",
  });

  // `fourRight` is deliberately non-transient so it holds through a streak;
  // without an explicit reset it would greet the next game mid-celebration.
  assert.equal(character.resetFreePlayReaction(), true);
  const context = app.runtime.characterState.freePlay;
  assert.equal(context.sprite, "neutral");
  assert.equal(context.dialogueKey, "");
  assert.equal(context.correctStreak, 0);
  assert.equal(context.wrongStreak, 0);
  assert.equal(context.reactionTransient, false);

  // A running mission owns its own container and must not be reset here.
  app.runtime.characterState.mission = { active: true, sprite: "celebrating", dialogueKey: "fourRight" };
  app.runtime.characterState.freePlay.sprite = "celebrating";
  assert.equal(character.resetFreePlayReaction(), false);
  assert.equal(app.runtime.characterState.freePlay.sprite, "celebrating");
});

test("free-play results show the lens character reacting to the score", () => {
  const document = { createElement: createStubElement };
  const { character, app } = loadCharacterModule({ document });
  app.runtime.characterState = freePlayState(character, "ivri");

  const head = createStubElement("div");
  assert.equal(character.renderResultsSprite(head, { accuracy: 100, perfect: true }), true);
  assert.equal(head.children.length, 1);
  assert.equal(head.children[0].dataset.character, "ivri");
  assert.equal(head.children[0].dataset.reaction, "celebrating");

  // Re-rendering replaces the sprite instead of stacking a second one.
  character.renderResultsSprite(head, { accuracy: 80 });
  assert.equal(head.children.length, 1);
  assert.equal(head.children[0].dataset.reaction, "neutral");

  character.renderResultsSprite(head, { accuracy: 20 });
  assert.equal(head.children[0].dataset.reaction, "struggling");

  // No lens chosen, and mission summaries, get no free-play sprite.
  app.runtime.characterState.lensCharacter = "";
  assert.equal(character.renderResultsSprite(head, { accuracy: 80 }), false);
  assert.equal(head.children.length, 0);

  app.runtime.characterState.lensCharacter = "ivri";
  app.runtime.state.summary.game = "characterMission";
  assert.equal(character.renderResultsSprite(head, { accuracy: 80 }), false);
  assert.equal(head.children.length, 0);
});

function liveMissionState(character, overrides = {}) {
  return {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: { ido: true },
    dailyChoice: "ido", pendingChoice: "", lensCharacter: "ido",
    freePlay: { correctStreak: 0, wrongStreak: 0, sprite: "neutral", dialogueKey: "",
      reactionTransient: false, reactionQuestionKey: "", visible: true, companionPosition: null },
    screen: "none", reviewOpen: false,
    mission: {
      active: true, completed: false, onHub: false, tier: "short",
      activities: ["sentenceBank"], skippedActivities: [], currentIndex: 0,
      currentActivity: "sentenceBank", results: [], correctStreak: 0, wrongStreak: 0,
      sprite: "neutral", dialogueKey: "", reactionTransient: false, reactionQuestionKey: "",
      visible: true, companionPosition: null, startedAt: Date.now(), ...overrides,
    },
  };
}

test("quitting a mission confirms first, resumes on cancel, and frees the day on confirm", () => {
  const { character, app } = loadCharacterModule();
  const calls = [];
  app.session = {
    hasActiveLearnSession: () => true,
    stopVerbMatchTimer: () => {},
    stopLessonTimer: () => {},
    stopSentenceBankTimer: () => calls.push("pause"),
    stopAbbreviationTimer: () => {},
    stopWordMatchTimer: () => {},
    resumeActiveTimers: () => calls.push("resume"),
    endSessionAndNavigate: (route) => calls.push(`end:${route}`),
  };
  app.runtime.state.sentenceBank = { active: true, elapsedSeconds: 12 };
  app.runtime.characterState = liveMissionState(character);
  const state = app.runtime.characterState;

  assert.equal(character.requestQuitMission(), true);
  assert.equal(state.screen, "quitConfirm");
  // The prompt is a blocking scene, so the running game is paused behind it.
  assert.equal(character.isBlocking(), true);
  assert.ok(calls.includes("pause"));

  // Backing out puts the learner back into the same activity, timer and all.
  assert.equal(character.cancelQuitMission(), true);
  assert.equal(state.screen, "none");
  assert.equal(state.mission.active, true);
  assert.equal(state.mission.currentActivity, "sentenceBank");
  assert.ok(calls.includes("resume"));
  // A second cancel has nothing to close.
  assert.equal(character.cancelQuitMission(), false);

  character.requestQuitMission();
  assert.equal(character.confirmQuitMission(), true);
  assert.equal(state.mission, null);
  assert.equal(state.dailyChoice, "free");
  assert.equal(state.screen, "none");
  assert.equal(character.isBlocking(), false);
  assert.equal(character.isMissionActive(), false);
  // The character stays on as the free-play companion, now swappable.
  assert.equal(state.lensCharacter, "ido");
  assert.equal(character.canChangeLens(), true);
  assert.ok(calls.includes("end:home"));

  // With no mission left there is nothing to quit.
  assert.equal(character.requestQuitMission(), false);
});

test("the quit prompt is unreachable without a mission to leave", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = freePlayState(character, "ido");
  assert.equal(character.requestQuitMission(), false);

  // Mid-scene the companion is not on screen, so the prompt cannot stack.
  app.runtime.characterState = liveMissionState(character);
  app.runtime.characterState.screen = "activityIntro";
  assert.equal(character.requestQuitMission(), false);
});

test("a saved quit prompt without a live mission loads as no screen", () => {
  const now = new Date();
  const dayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const { character, app } = loadCharacterModule({
    saved: { dayKey, gender: "m", dailyChoice: "free", screen: "quitConfirm", mission: null },
  });
  character.initialize();

  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(character.isBlocking(), false);
});

test("the quit scene asks in the character's Hebrew and offers both ways out", () => {
  const document = {
    createElement: createStubElement,
    createTextNode: (text) => ({ textContent: text, children: [] }),
  };
  const { character, characterData, app } = loadCharacterModule({ document });
  app.runtime.characterState = liveMissionState(character);
  app.runtime.characterState.screen = "quitConfirm";
  app.runtime.characterState.gender = "f";
  const scene = createStubElement("div");
  const content = createStubElement("div");
  app.runtime.el = { characterScene: scene, characterSceneContent: content };

  character.renderScene();
  assert.equal(scene.className.includes("hidden"), false);
  const layout = content.children[0];
  assert.equal(layout.children[0].textContent, "Quit the mission?");
  assert.equal(layout.children[1].dataset.reaction, "nervous-laugh");
  assert.equal(layout.children[1].dataset.character, "ido");

  // Nobody owns this line, so it resolves through the shared table, gendered,
  // and its words stay tappable for glosses like any other character line.
  const dialogueWrap = layout.children[2];
  assert.equal(dialogueWrap.className, "character-dialogue-wrap");
  const glossedWords = dialogueWrap.children[0].children
    .map((node) => node.children?.[0]?.children?.[0]?.textContent)
    .filter(Boolean);
  assert.ok(glossedWords.includes("לפרוש"));
  assert.ok(glossedWords.includes("שאת"));
  assert.equal(
    characterData.SHARED_DIALOGUE.quitF.text,
    "בטוחה שאת רוצה לפרוש מהמשימה? אפשר לבחור דמות חדשה בהגדרות או בעמוד הסקירה.",
  );
  assert.equal(
    characterData.SHARED_DIALOGUE.quitM.text,
    "בטוח שאתה רוצה לפרוש מהמשימה? אפשר לבחור דמות חדשה בהגדרות או בעמוד הסקירה.",
  );
  assert.equal(characterData.SHARED_DIALOGUE.quitF.glosses["לפרוש"], "to quit");

  const actions = layout.children[3];
  assert.deepEqual(
    actions.children.map((button) => button.dataset.characterAction),
    ["keepGoing", "quitMission"],
  );
  assert.deepEqual(actions.children.map((button) => button.textContent), ["Keep going", "Quit mission"]);
});

test("the companion carries a quit control beside the hide toggle only on a mission", () => {
  const markup = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");
  assert.match(markup, /class="character-companion-actions">\s*<button id="characterQuitMission"/);
  assert.match(markup, /id="characterQuitMission"[^>]*class="quiet character-quit-button hidden"/);
  assert.match(css, /\.character-companion-actions\s*\{[^}]*grid-area:\s*toggle;/s);
  assert.match(css, /\.character-quit-button\s*\{[^}]*border-radius:\s*999px;/s);

  const { character, app } = loadCharacterModule();
  const quitClasses = {};
  const quitAttributes = {};
  app.session = { hasActiveLearnSession: () => true };
  app.runtime.characterState = liveMissionState(character);
  app.runtime.el = {
    characterCompanion: {
      classList: { toggle: () => {} },
      style: { removeProperty: () => {} },
    },
    characterCompanionSprite: { dataset: {}, classList: { toggle: () => {} }, setAttribute: () => {} },
    characterQuitMission: {
      classList: { toggle: (name, enabled) => { quitClasses[name] = enabled; } },
      setAttribute: (name, value) => { quitAttributes[name] = value; },
    },
  };

  character.renderCompanion();
  assert.equal(quitClasses.hidden, false);
  assert.equal(quitAttributes["aria-label"], "Quit mission");

  // Free play has no mission to leave, so the control goes away with it.
  app.runtime.characterState = freePlayState(character, "ido");
  character.renderCompanion();
  assert.equal(quitClasses.hidden, true);
});

test("the review character panel picks the free-play companion like Settings does", () => {
  const characterSource = fs.readFileSync(path.join(PROJECT_ROOT, "app/character.js"), "utf8");
  const markup = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  assert.match(markup, /id="reviewCharacterLensNote"/);
  assert.match(characterSource, /bindLensPicker\(runtime\.el\?\.reviewCharacterBonds\)/);

  const document = { createElement: createStubElement };
  const { character, app } = loadCharacterModule({ document });
  app.runtime.characterState = freePlayState(character, "inbal");
  const bonds = createStubElement("div");
  const note = createStubElement("p");
  app.runtime.el = { reviewCharacterBonds: bonds, reviewCharacterLensNote: note };

  const readChoices = () => bonds.children.map((card) => card.children[1].children.at(-1));
  character.renderBondPanel();
  assert.deepEqual(
    readChoices().map((button) => button.dataset.characterLens),
    ["ido", "inbal", "ivri", "inat", "idan"],
  );
  assert.deepEqual(
    readChoices().map((button) => button.textContent),
    ["Choose as companion", "Current companion", "Choose as companion", "Choose as companion", "Choose as companion"],
  );
  assert.deepEqual(readChoices().map((button) => button.disabled), [false, true, false, false, false]);
  assert.equal(note.className.includes("hidden"), true);

  // Choosing from Review is the same lens the Settings picker sets.
  assert.equal(character.setLensCharacter("ivri"), true);
  character.renderBondPanel();
  assert.deepEqual(readChoices().map((button) => button.disabled), [false, false, true, false, false]);

  // A running mission owns the lens here exactly as it does in Settings.
  app.runtime.characterState.mission = { active: true };
  character.renderBondPanel();
  assert.deepEqual(readChoices().map((button) => button.disabled), [true, true, true, true, true]);
  assert.equal(note.className.includes("hidden"), false);
  assert.equal(note.textContent, "Finish today’s mission to change your companion.");
});

test("Settings character names and address labels follow the UI language", () => {
  const document = { createElement: createStubElement };
  const { character, app } = loadCharacterModule({ document });
  app.runtime.characterState = freePlayState(character, "inbal");

  const genderToggle = createStubElement("button");
  ["m", "f"].forEach((value) => {
    const option = createStubElement("span");
    option.dataset.characterGender = value;
    genderToggle.append(option);
  });
  const lensOptions = createStubElement("span");
  app.runtime.el = {
    characterGenderToggle: genderToggle,
    characterGenderLabel: createStubElement("span"),
    characterLensLabel: createStubElement("span"),
    characterLensOptions: lensOptions,
    characterLensNote: createStubElement("p"),
  };

  const read = () => ({
    gender: genderToggle.children.map((option) => option.textContent),
    lens: lensOptions.children.map((option) => option.textContent),
    label: app.runtime.el.characterLensLabel.textContent,
  });

  app.runtime.state.language = "en";
  character.renderSettings();
  assert.deepEqual(read(), {
    gender: ["Male", "Female"],
    lens: ["None", "Ido", "Inbal", "Ivri", "Inat", "Idan"],
    label: "Free-play companion",
  });

  app.runtime.state.language = "he";
  character.renderSettings();
  assert.deepEqual(read(), {
    gender: ["זכר", "נקבה"],
    lens: ["ללא", "עידו", "ענבל", "עברי", "עינת", "עידן"],
    label: "דמות למשחק חופשי",
  });
});

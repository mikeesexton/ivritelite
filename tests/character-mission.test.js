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
  assert.match(indexHtml, /styles\.css\?v=20260905s/);
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
  // civil_defense_safety left every route to become the shared Public Safety
  // topic. Course policy is that any resident can drill it, which a shared topic
  // keeps true; as an unnarrowable owned shelf it used to hold its full 70 cards
  // while a narrowed pool shrank around it.
  assert.deepEqual(
    [...idan.route.vocabCategories],
    ["military_operational", "emergency_response"],
  );
  assert.equal(
    characterData.SHARED_FOCUS_TOPICS.some((topic) => topic.id === "safety"),
    true,
    "the safety shelf must still be reachable, as a shared topic",
  );
  assert.deepEqual([...idan.route.sentenceIdPrefixes], ["idan_"]);

  app.runtime.characterState = { dailyChoice: "idan", mission: { active: true } };
  const owned = [
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
    ["abbreviation", { id: "abbr-284", bucket: "Daily Life & Home" }],
  ];
  unowned.forEach(([kind, item]) => {
    assert.equal(character.getContentWeight(kind, item), 1, `${kind} ${item.he || item.id} should stay neutral`);
  });
});

// The everyday tier is course policy rather than one character's shelf, so it
// has to reach a learner who never picks Idan.
test("every character can still drill the everyday security tier", () => {
  const { character, characterData, app } = loadCharacterModule();
  const ids = characterData.getCharacterIds();
  assert.deepEqual([...ids], ["ido", "inbal", "ivri", "inat", "idan"]);

  // The policy is unchanged — any resident drills everyday security — but it is
  // now carried by a shared topic rather than by five identical route entries.
  // That is what makes it narrowable: as an owned shelf no topic named, it kept
  // its full 70 cards while a narrowed pool shrank around it, taking 42-45% of
  // the draw against 20-23% for the topic the learner had chosen.
  ids.forEach((id) => {
    assert.equal(
      characterData.characters[id].route.vocabCategories?.includes("civil_defense_safety"),
      false,
      `${id} should no longer route the safety shelf directly`,
    );
    assert.equal(
      characterData.getTopicsFor(id).some((topic) => topic.id === "safety"),
      true,
      `${id} must be offered Public Safety`,
    );
    // Selecting it reaches the shelf; leaving it out fences it, which is the
    // whole point of moving it.
    app.runtime.characterState = {
      dailyChoice: id,
      mission: { active: true, focus: ["safety"], characterId: id },
    };
    const siren = { he: "אזעקה", category: "civil_defense_safety" };
    assert.equal(character.isOutsideFocus("vocab", siren), false, `${id} selected safety`);
    app.runtime.characterState.mission.focus = ["core"];
    assert.equal(character.isOutsideFocus("vocab", siren), true, `${id} did not select safety`);

    // ממ״ד still reaches everyone by id: abbreviations route on the character,
    // not on the learner's topics.
    app.runtime.characterState = { dailyChoice: id, mission: { active: true } };
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

  // The practical-life shelves left Ido's route for the shared everyday tier. A
  // read of all 225 of their cards found four slang entries and about ten
  // colloquial loanwords, so roughly 2% carried his register; the sentences that
  // teach them were already unowned and drawn by the whole cast. They stay
  // unfenced and now any learner can ask for them by topic.
  const practicalCard = { category: "everyday_survival_expanded", he: "תחבורה ציבורית" };
  assert.equal(characterData.getItemAudience("vocab", practicalCard), null);
  assert.equal(characterData.ownsItem(characters.ido.route, "vocab", practicalCard), false);
  assert.equal(
    characterData.SHARED_FOCUS_TOPICS.some((topic) => topic.categories.includes("everyday_survival_expanded")),
    true,
    "the practical shelves must be reachable as a shared topic",
  );
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

  // true makes showSessionSummary return before it populates state.summary or
  // routes to results, so no per-beat recap is ever shown. The next beat has
  // already been started by the time this returns.
  assert.equal(character.captureActivitySummary({
    correctCount: 20,
    incorrectCount: 2,
    elapsedSeconds: 187,
    mistakes: [{ primary: "test" }],
  }), true);
  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(app.runtime.characterState.mission.onHub, false);
  assert.equal(app.runtime.characterState.mission.currentIndex, 1);
  assert.equal(app.runtime.characterState.mission.currentActivity, "sentenceBank");
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
  }), true);
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

  // Routing follows the lens even though no mission is running — and off-mission
  // the lens now carries the learner's standing topic selection too, which is
  // what makes the Review and Settings editors mean anything for free play.
  assert.ok(character.getContentWeight("vocab", { category: "religion_magic_spirituality" }) > 1);
  // A category the selection does not name is not owned, so it is not boosted.
  // In a real draw it never reaches the weigher at all: the fence removes it
  // first, which is where the learner's choice actually bites.
  assert.ok(character.buildContentWeigher("vocab", [
    { category: "religion_magic_spirituality" }, { category: "military_operational" },
  ])({ category: "religion_magic_spirituality" }) > 1);
  assert.equal(
    character.isOutsideFocus("vocab", { category: "military_operational" }),
    true,
    "an unselected shelf is fenced from free play, not merely unboosted",
  );

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

  // Found rather than indexed: the bond body also carries the topic editor now,
  // and positional indexing broke the moment it was appended.
  const readChoices = () => bonds.children.map(
    (card) => card.children[1].children.find((node) => node.dataset?.characterLens),
  );
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

  // Topics are editable from the same place the companion is chosen, and a
  // running mission holds them for the same reason it holds the lens.
  const readEditors = () => bonds.children.map(
    (card) => card.children[1].children.find((node) => node.className === "character-topic-editor"),
  );
  assert.equal(readEditors().every(Boolean), true, "every bond card carries a topic editor");
  const idoRows = () => readEditors()[0].children
    .find((node) => node.className === "character-focus-options").children;
  assert.equal(idoRows().every((row) => row.disabled), true, "mid-mission the rows are held");
  app.runtime.characterState.mission = null;
  character.renderBondPanel();
  assert.equal(idoRows().some((row) => !row.disabled), true, "off-mission the rows are live");
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

// --- Topic picker ------------------------------------------------------------
// The learner chooses the vocabulary; the character chooses the voice. Two tiers
// of topics — the character's own and a shared everyday set — cover all 42
// vocabulary categories between them, and the selection *is* the pool: anything
// unselected is fenced. Sentences, verbs and abbreviations keep routing on the
// character's register.

function loadVocabData() {
  const context = { window: {}, globalThis: {} };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "vocab-data.js"), "utf8"),
    context,
    { filename: "vocab-data.js" },
  );
  return context.IvriQuestVocab;
}

test("the two topic tiers cover all 42 vocabulary categories exactly once", () => {
  const { characterData } = loadCharacterModule();
  const meta = loadVocabData().CATEGORY_META;

  // This totality is load-bearing: it is what lets "unselected means fenced" be
  // a complete rule, with no shelf left hiding in an unselected remainder. It is
  // also what dissolved the safety-tier problem — an owned shelf no topic named
  // kept its full 70 cards while a narrowed pool shrank around it.
  const named = [];
  characterData.getCharacterIds().forEach((id) => {
    characterData.getFocusGroups(id).forEach((topic) => {
      topic.categories.forEach((category) => named.push(category));
    });
  });
  characterData.SHARED_FOCUS_TOPICS.forEach((topic) => {
    topic.categories.forEach((category) => named.push(category));
  });

  assert.equal(new Set(named).size, named.length, `a category is claimed twice: ${named}`);
  assert.deepEqual(
    [...named].sort(),
    Object.keys(meta).sort(),
    "the tiers must name every shelf in CATEGORY_META and nothing else",
  );
});

test("every topic is labelled in both languages and names only real content", () => {
  const { characterData } = loadCharacterModule();
  const vocab = loadVocabData();
  const meta = vocab.CATEGORY_META;
  const surfaces = new Set(vocab.getBaseVocabulary().map((word) => word.he));
  // A topic may claim a verb card, which lives in the verb deck rather than on a
  // vocabulary shelf but is merged into the runtime pool all the same.
  const verbSource = fs.readFileSync(path.join(PROJECT_ROOT, "hebrew-verbs.js"), "utf8");
  (verbSource.match(/lemma: "([^"]+)"/g) || []).forEach((match) => {
    surfaces.add(match.replace(/^lemma: "/, "").replace(/"$/, ""));
  });

  characterData.getCharacterIds().forEach((id) => {
    const topics = characterData.getTopicsFor(id);
    // Ids must be unique across both tiers, or a flat selection list would need
    // a tier qualifier to say which topic it meant.
    const ids = topics.map((topic) => topic.id);
    assert.equal(new Set(ids).size, ids.length, `${id} has colliding topic ids: ${ids}`);
    assert.ok(topics.length >= 10, `${id} is offered only ${topics.length} topics`);

    topics.forEach((topic) => {
      assert.ok(topic.labelEn, `${id}/${topic.id} needs an English label`);
      assert.ok(topic.labelHe, `${id}/${topic.id} needs a Hebrew label`);
      assert.ok(/[֐-׿]/.test(topic.labelHe), `${id}/${topic.id} Hebrew label is not Hebrew`);
      topic.categories.forEach((category) => {
        assert.ok(meta[category], `${id}/${topic.id} names unknown shelf ${category}`);
      });
      (topic.words || []).forEach((word) => {
        assert.ok(surfaces.has(word), `${id}/${topic.id} names ${word}, which is no card`);
      });
    });
  });
});

test("every route.vocabWords entry survives on a topic", () => {
  const { characterData } = loadCharacterModule();
  // A flat selected pool has no boost to apply, so a card left only on
  // route.vocabWords would go inert. Naming it on a topic makes it join that
  // topic's pool instead, which is what the route always meant.
  characterData.getCharacterIds().forEach((id) => {
    const routed = new Set(characterData.getCharacter(id).route.vocabWords || []);
    const onTopics = new Set();
    characterData.getFocusGroups(id).forEach((topic) => {
      (topic.words || []).forEach((word) => onTopics.add(word));
    });
    [...routed].forEach((word) => {
      assert.ok(onTopics.has(word), `${id} routes ${word} but no topic of theirs carries it`);
    });
  });
});

test("the three-topic minimum keeps every legal selection playable", () => {
  const { character, characterData } = loadCharacterModule();
  const deck = loadVocabData().getBaseVocabulary();
  const minimum = character.getMinimumTopics();
  assert.equal(minimum, 3);

  // With the selection as the whole pool, the floor is what stops a session
  // cycling immediately. The thinnest legal pick in the cast is measured rather
  // than assumed, and must clear a full session's worth of cards.
  const SESSION_SIZE = 20;
  characterData.getCharacterIds().forEach((id) => {
    const sizes = characterData.getTopicsFor(id)
      .map((topic) => deck.filter((word) => topic.categories.includes(word.category)).length)
      .sort((left, right) => left - right);
    const thinnest = sizes.slice(0, minimum).reduce((total, size) => total + size, 0);
    assert.ok(
      thinnest > SESSION_SIZE * 4,
      `${id}'s thinnest legal ${minimum}-topic pick is only ${thinnest} cards`,
    );
  });
});

test("a selected shared topic extends the pool beyond the character's own route", () => {
  const { character, characterData, app } = loadCharacterModule();
  const route = characterData.getCharacter("inat").route;
  // The inverted invariant, asserted on purpose. Tranche 1 held that topics
  // partition ownership and never extend it; the everyday tier exists precisely
  // to extend it, which is how household Hebrew stopped being Ido's property.
  assert.equal(route.vocabCategories.includes("cooking_verbs"), false);
  const extended = characterData.applyTopicsToRoute("inat", route, ["politics", "cooking"]);
  assert.equal(extended.vocabCategories.includes("cooking_verbs"), true);
  assert.equal(extended.vocabCategories.includes("politics_society_expanded"), true);
  // Her own shelves that she did not select drop out.
  assert.equal(extended.vocabCategories.includes("legal_civic"), false);
  // Registers are untouched: the character still owns the voice.
  assert.deepEqual([...extended.sentenceCategories || []], [...route.sentenceCategories || []]);

  app.runtime.characterState = {
    dailyChoice: "inat",
    mission: { active: true, focus: ["politics", "cooking"], characterId: "inat" },
  };
  assert.ok(character.getContentWeight("vocab", { category: "cooking_verbs" }) > 1);
  assert.ok(character.getContentWeight("sentence", { id: "formal_01", category: "formal" }) > 1);
  assert.equal(character.getContentWeight("vocab", { category: "legal_civic" }), 1);
});

test("unselecting Public Safety actually removes the safety shelf", () => {
  const { character, app } = loadCharacterModule();
  const siren = { he: "אזעקה", category: "civil_defense_safety" };

  // The regression this whole design exists for. As an owned shelf that no topic
  // named, civil_defense_safety could not be narrowed away, so it held its full
  // 70 cards while the pool shrank: 42-45% of a narrow selection against 20-23%
  // for the topic the learner had actually chosen.
  app.runtime.characterState = {
    dailyChoice: "ivri",
    mission: { active: true, focus: ["finance", "core", "home"], characterId: "ivri" },
  };
  assert.equal(character.isOutsideFocus("vocab", siren), true);
  assert.deepEqual(character.filterOutsideFocus("vocab", [siren]).length, 1,
    "a filter that emptied the pool would fall back rather than starve");

  app.runtime.characterState.mission.focus = ["finance", "safety", "home"];
  assert.equal(character.isOutsideFocus("vocab", siren), false);
});

test("the selection is the pool, and only for vocabulary", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dailyChoice: "ivri",
    mission: { active: true, focus: ["science_tech", "core", "grammar"], characterId: "ivri" },
  };

  const kept = [
    { he: "אלגוריתם", category: "technology_ai" },
    { he: "מדף", category: "core_advanced" },
    { he: "שם פועל", category: "meta_language" },
    // Claimed by a selected topic's `words` even though its shelf is unselected.
    { he: "להשוות", category: "core_advanced" },
  ];
  const dropped = [
    { he: "חוזה שכירות", category: "home_everyday_life" },
    { he: "טופס", category: "bureaucracy" },
    { he: "עגבנייה", category: "groceries_food" },
    { he: "אזעקה", category: "civil_defense_safety" },
  ];
  kept.forEach((word) => assert.equal(character.isOutsideFocus("vocab", word), false, `${word.he} kept`));
  dropped.forEach((word) => assert.equal(character.isOutsideFocus("vocab", word), true, `${word.he} dropped`));
  assert.deepEqual(
    character.filterOutsideFocus("vocab", [...kept, ...dropped]).map((word) => word.he),
    kept.map((word) => word.he),
  );

  // Every other kind is the character's, not the learner's.
  ["sentence", "verb", "abbreviation"].forEach((kind) => {
    assert.equal(character.isOutsideFocus(kind, { id: "x", category: "bureaucracy" }), false);
  });
  const rows = [{ id: "professional_01", category: "professional" }];
  assert.equal(character.filterOutsideFocus("sentence", rows).length, 1);
});

test("the topic selection persists across the day rollover", () => {
  const { character, app, savedWrites } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: {}, topics: {},
    dailyChoice: "", pendingChoice: "", lensCharacter: "", screen: "picker", mission: null,
  };

  character.chooseCharacter("idan");
  const state = app.runtime.characterState;
  assert.equal(state.screen, "focus");
  // Opens on a real default rather than everything: "everything" is the whole
  // 2,206-card deck, which defeats the point of choosing.
  assert.ok(state.pendingFocus.length >= 3);
  assert.equal(state.pendingFocus.includes("military"), true);

  character.toggleFocusGroup("safety");
  character.confirmFocus();
  assert.equal(state.screen, "duration");
  const chosen = [...state.pendingFocus];
  character.chooseTier("short");
  assert.deepEqual([...state.mission.focus], chosen);
  assert.deepEqual([...state.topics.idan], chosen);

  // A brand-new day wipes the mission but must keep the standing selection, the
  // way it keeps lensCharacter — re-picking topics every morning is tedious.
  const written = savedWrites[savedWrites.length - 1];
  const tomorrow = loadCharacterModule({ saved: { ...written, dayKey: "1999-01-01" } });
  assert.equal(tomorrow.character.initialize(), false);
  assert.equal(tomorrow.app.runtime.characterState.mission, null);
  assert.deepEqual([...tomorrow.app.runtime.characterState.topics.idan], chosen);
});

test("Continue is dead below the minimum and a mission holds its snapshot", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: {}, topics: {},
    dailyChoice: "", pendingChoice: "", lensCharacter: "", screen: "picker", mission: null,
  };
  character.chooseCharacter("inbal");
  const state = app.runtime.characterState;

  // Strip down to two and the gate holds.
  while (state.pendingFocus.length > 2) character.toggleFocusGroup(state.pendingFocus[0]);
  assert.equal(state.pendingFocus.length, 2);
  character.confirmFocus();
  assert.equal(state.screen, "focus", "two topics must not open the tier screen");
  // "food" is not in the default selection, so toggling it adds rather than removes.
  assert.equal(state.pendingFocus.includes("food"), false);
  character.toggleFocusGroup("food");
  assert.equal(state.pendingFocus.length, 3);
  character.confirmFocus();
  assert.equal(state.screen, "duration");

  // The floor holds at the state layer too, not only on the disabled button:
  // a restored save or any other path into chooseTier must not build a mission
  // below it.
  state.pendingFocus = ["mysticism", "practice"];
  character.chooseTier("short");
  assert.equal(state.mission, null, "two topics must not build a mission");
  state.pendingFocus = ["mysticism", "practice", "food"];
  character.chooseTier("short");
  const snapshot = [...state.mission.focus];
  // Editing the standing selection must not move a running mission's deck.
  assert.equal(character.setCharacterTopics("inbal", ["mysticism", "practice", "food"]), false,
    "a running mission holds the topics the way it holds the lens");
  app.runtime.characterState.mission.active = false;
  assert.equal(character.setCharacterTopics("inbal", ["mysticism", "practice", "food"]), true);
  assert.deepEqual([...app.runtime.characterState.mission.focus], snapshot);
  // And the minimum applies to that surface too.
  assert.equal(character.setCharacterTopics("inbal", ["mysticism"]), false);
});

test("a reload mid-flow lands on the focus screen with a live selection", () => {
  const today = new Date().toISOString().slice(0, 10);
  const mid = loadCharacterModule({
    saved: { dayKey: today, gender: "m", pendingChoice: "ido", pendingFocus: ["food"], screen: "focus", mission: null },
  });
  assert.equal(mid.character.initialize(), true);
  assert.equal(mid.app.runtime.characterState.screen, "focus");
  assert.deepEqual([...mid.app.runtime.characterState.pendingFocus], ["food"]);
  assert.equal(mid.character.isBlocking(), true, "the focus screen must block, or the overlay never shows");

  // Without a pending pick there is nothing to narrow, so the flow rewinds.
  const orphan = loadCharacterModule({
    saved: { dayKey: today, gender: "m", pendingChoice: "", screen: "focus", mission: null },
  });
  orphan.character.initialize();
  assert.equal(orphan.app.runtime.characterState.screen, "picker");

  // A save from before this feature reaches the tier screen with no selection;
  // seeding the stored default beats fencing on empty.
  const legacy = loadCharacterModule({
    saved: { dayKey: today, gender: "m", pendingChoice: "inat", screen: "duration", mission: null },
  });
  legacy.character.initialize();
  assert.ok(legacy.app.runtime.characterState.pendingFocus.length >= 3);

  // A legacy mission carrying no focus field must not fence anything.
  const legacyMission = loadCharacterModule({
    saved: {
      dayKey: today, gender: "m", dailyChoice: "inat", screen: "none",
      mission: { active: true, tier: "short", activities: ["lessonMatch"], currentIndex: 0 },
    },
  });
  legacyMission.character.initialize();
  assert.deepEqual([...legacyMission.app.runtime.characterState.mission.focus], []);
  assert.equal(
    legacyMission.character.isOutsideFocus("vocab", { category: "politics_society_expanded" }),
    false,
  );
});

// --- Derived sentence bias ---------------------------------------------------
// A sentence carries no topic field and may not be given one, so the tie between
// a focus group and a sentence is derived from the vocabulary the sentence
// actually contains — the same "exact support" relationship
// scripts/content-coverage-report.js measures, with the same matcher.

// The picker harness above deliberately omits the content decks; the sentence
// bias needs them, plus app/hebrew.js for the matcher.
function loadCharacterModuleWithContent() {
  const saved = {};
  const context = {
    console,
    Date,
    setTimeout,
    clearTimeout,
    IvriQuestApp: {
      runtime: {
        constants: { STORAGE_KEYS: { character: "character", characterBond: "characterBond" } },
        state: { language: "en", route: "home", summary: { active: false, game: "" } },
        helpers: { renderAll: () => {} },
        storageApi: { loadJson: () => saved, saveJson: () => {} },
      },
    },
  };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  [
    "app/utils.js",
    "app/hebrew.js",
    "vocab-data.js",
    "sentence-bank-data.js",
    "app/character-data.js",
    "app/character.js",
  ].forEach((modulePath) => {
    vm.runInContext(
      fs.readFileSync(path.join(PROJECT_ROOT, modulePath), "utf8"),
      context,
      { filename: modulePath },
    );
  });
  const runtime = context.IvriQuestApp.runtime;
  runtime.baseVocabulary = context.IvriQuestVocab.getBaseVocabulary();
  const bankKey = Object.keys(context).find((key) => /Sentence/i.test(key));
  const bank = context[bankKey];
  runtime.sentenceBankDeck = bank.getSentenceBank
    ? bank.getSentenceBank()
    : (bank.SENTENCES || bank.sentences);
  return { ...context.IvriQuestApp, context, runtime };
}

test("the headword matcher allows clitics and refuses inflection", () => {
  const { hebrew } = loadCharacterModuleWithContent();

  assert.equal(hebrew.textContainsHeadword("בדקתי את הדוח לפני האישור", "דוח"), true);
  assert.equal(hebrew.textContainsHeadword("קערת השבעה נמצאה מתחת למפתן", "קערת השבעה"), true);
  assert.equal(hebrew.textContainsHeadword("אין כאן שום דבר", "דוח"), false);
  // Inflection is not inferred: docs/sentence-bank-authoring.md says automation
  // cannot do Hebrew morphology reliably, so the matcher under-reports instead.
  assert.equal(hebrew.headwordSurfaceMatches("דוחות", "דוח"), false);
  assert.equal(hebrew.headwordSurfaceMatches("ולדוח", "דוח"), true);
  assert.deepEqual([...hebrew.headwordIndexKeys("ולדוח")], ["ולדוח", "לדוח", "דוח"]);
  assert.equal(hebrew.normalizeHeadwordText("שָׁלוֹם, עוֹלָם!"), "שלום עולם");
});

test("the coverage report and the runtime share one headword matcher", () => {
  // Two copies of this predicate would drift, which is the reason
  // characterData.ownsItem lives in the data module rather than in app/.
  const script = fs.readFileSync(
    path.join(PROJECT_ROOT, "scripts/content-coverage-report.js"),
    "utf8",
  );
  assert.match(script, /loadInSandbox\("app\/hebrew\.js"\)/);
  assert.match(script, /hebrewApi\.textContainsHeadword/);
  assert.doesNotMatch(
    script,
    /function\s+(normalizeHebrew|surfaceMatchesHeadword)\s*\(/,
    "the report must not reimplement the matcher",
  );
});

test("sentence topics are derived from the vocabulary a sentence contains", () => {
  const { character, runtime } = loadCharacterModuleWithContent();
  runtime.characterState = {
    dailyChoice: "inbal",
    mission: { active: true, focus: ["mysticism"], characterId: "inbal" },
  };
  // Build the index by asking for a weight, then read it off the runtime.
  const pairs = runtime.sentenceBankDeck.map((sentence) => ({ sentence }));
  character.buildContentWeigher("sentence", pairs, (pair) => pair.sentence);
  const index = runtime.characterSentenceTopics;
  assert.equal(typeof index?.get, "function", "the index must be built lazily on first use");
  assert.ok(index.size > 500, `only ${index.size} sentences carry a vocabulary anchor`);

  // The incantation-bowl row uses several cards off Inbal's mysticism shelf.
  const bowl = index.get("inbal_01");
  assert.ok(bowl?.get("religion_magic_spirituality") >= 2, "inbal_01 must anchor to the mystical shelf");
  // A home-care row anchors to the home shelf and to nothing religious.
  const home = index.get("everyday_242");
  assert.ok(home?.get("home_everyday_life") >= 1);
  assert.equal(home?.has("religion_magic_spirituality"), false);
});

test("the sentence bias grades by evidence and never removes a row", () => {
  const { character, characterData, runtime } = loadCharacterModuleWithContent();
  const deck = runtime.sentenceBankDeck;
  runtime.characterState = {
    dailyChoice: "inbal",
    mission: { active: true, focus: ["mysticism"], characterId: "inbal" },
  };

  const pairs = deck.map((sentence) => ({ sentence }));
  const weigh = character.buildContentWeigher("sentence", pairs, (pair) => pair.sentence);
  const weightOf = (id) => weigh(pairs.find((pair) => pair.sentence.id === id));

  // Three mysticism cards outweigh two, which outweigh one, which outweighs a
  // row with no anchor in the checked group. One generic hit is a nudge rather
  // than a verdict, because a single card off a shelf like Ivri's
  // "Scientific & Analytical" may only be its ordinary office sense.
  const strong = weightOf("inbal_01");
  const weak = weightOf("inbal_39");
  const anchorless = weightOf("inbal_98");
  assert.ok(strong > weak, `expected ${strong} > ${weak}`);
  assert.ok(weak > anchorless, `expected ${weak} > ${anchorless}`);
  // The shared tier keeps its neutral weight: focus redistributes inside the
  // character's own bank and takes nothing from the rest of the course.
  assert.equal(weightOf("everyday_242"), 1);

  // Sentences are biased, never filtered. Fencing them would repeat rows inside
  // one session, because getRoundTarget measures the unfiltered deck.
  assert.equal(character.filterOutsideFocus("sentence", deck).length, deck.length);
  assert.equal(character.isOutsideFocus("sentence", deck[0]), false);

  // And the documented owned share still holds, because the focus factor is
  // normalized to average 1 across the owned subset.
  const route = characterData.getCharacter("inbal").route;
  const shareFor = (focus) => {
    runtime.characterState.mission.focus = focus;
    const fresh = deck.map((sentence) => ({ sentence }));
    const w = character.buildContentWeigher("sentence", fresh, (pair) => pair.sentence);
    let owned = 0;
    let rest = 0;
    fresh.forEach((pair) => {
      const value = w(pair);
      if (characterData.ownsItem(route, "sentence", pair.sentence)) owned += value;
      else rest += value;
    });
    return owned / (owned + rest);
  };
  const all = [...characterData.getFocusGroups("inbal")].map((group) => group.id);
  [all, ["mysticism"], ["practice"]].forEach((focus) => {
    const share = shareFor(focus);
    assert.ok(
      Math.abs(share - 0.65) < 0.005,
      `owned share drifted to ${share.toFixed(4)} for focus ${focus.join("+")}`,
    );
  });
});

test("every focus group has derived sentence support for at least some rows", () => {
  const { character, characterData, runtime } = loadCharacterModuleWithContent();
  const deck = runtime.sentenceBankDeck;
  runtime.characterState = { dailyChoice: "inbal", mission: { active: true, focus: ["mysticism"], characterId: "inbal" } };
  character.buildContentWeigher("sentence", deck.map((sentence) => ({ sentence })), (pair) => pair.sentence);
  const index = runtime.characterSentenceTopics;

  // Coverage is partial by construction — an unanchored row simply gets no bias
  // — but a group with zero supported rows would make the sentence half of the
  // feature silently inert for it, which is worth failing on.
  characterData.getCharacterIds().forEach((id) => {
    [...characterData.getFocusGroups(id)].forEach((group) => {
      const supported = deck.filter((sentence) => {
        const counts = index.get(sentence.id);
        if (!counts) return false;
        return [...group.categories].some((category) => counts.has(category));
      }).length;
      assert.ok(supported > 0, `${id}/${group.id} has no sentence anchored to it at all`);
    });
  });
});

// --- T2: beat round parameterization -----------------------------------------

function loadSessionWithMission(mission) {
  const { character, app, context } = loadCharacterModule();
  app.runtime.characterState = mission === null ? {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "free",
    screen: "none",
    mission: null,
  } : {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    mission: {
      active: true,
      completed: false,
      skippedActivities: [],
      results: [],
      visible: true,
      ...mission,
    },
  };
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "app/session.js"), "utf8"),
    context,
    { filename: "app/session.js" },
  );
  return { character, app };
}

test("a running beat sizes the mode it belongs to and no other", () => {
  const { character, app } = loadSessionWithMission({
    beats: [{ mode: "advConj", rounds: 3 }],
    currentIndex: 0,
    currentActivity: "advConj",
  });

  // Field by field: getActiveBeat builds its object inside the VM realm, so a
  // deepStrictEqual against a host-realm literal fails on prototype identity
  // even when every value matches.
  const beat = character.getActiveBeat();
  assert.equal(beat.mode, "advConj");
  assert.equal(beat.rounds, 3);
  assert.equal(beat.index, 0);
  assert.equal(beat.total, 1);
  assert.equal(app.session.getModeRoundTarget("advConj", 10), 3);
  // The beat belongs to advConj, so prepositions keeps its own constant even
  // though a mission is running.
  assert.equal(app.session.getModeRoundTarget("prepositions", 10), 10);
});

test("a beat whose mode is not the running activity does not size anything", () => {
  const { character, app } = loadSessionWithMission({
    beats: [{ mode: "advConj", rounds: 3 }],
    currentIndex: 0,
    // The mission is between beats: currentActivity is cleared while the hub or
    // the next start path runs, and a stale beat must not shorten the next mode.
    currentActivity: "",
  });

  assert.equal(character.getActiveBeat(), null);
  assert.equal(app.session.getModeRoundTarget("advConj", 10), 10);
});

test("a legacy activities mission plays at every mode's default length", () => {
  const { character, app } = loadSessionWithMission({
    activities: ["lessonMatch"],
    currentIndex: 0,
    currentActivity: "lessonMatch",
  });

  // sanitizeBeats migrates the pre-beats save to rounds: 0, which means "use the
  // mode's own constant" — so a save written before T1 plays exactly as it did.
  const beat = character.getActiveBeat();
  assert.equal(beat.mode, "lessonMatch");
  assert.equal(beat.rounds, 0);
  assert.equal(beat.total, 1);
  assert.equal(app.session.getModeRoundTarget("lessonMatch", 20), 20);
});

test("free play keeps every mode at its own default length", () => {
  const { character, app } = loadSessionWithMission(null);

  assert.equal(character.getActiveBeat(), null);
  assert.equal(app.session.getModeRoundTarget("advConj", 10), 10);
  assert.equal(app.session.getModeRoundTarget("lessonMatch", 20), 20);
});

test("an index past the end of the beat list sizes nothing", () => {
  const { character, app } = loadSessionWithMission({
    beats: [{ mode: "advConj", rounds: 3 }],
    currentIndex: 1,
    currentActivity: "advConj",
  });

  assert.equal(character.getActiveBeat(), null);
  assert.equal(app.session.getModeRoundTarget("advConj", 10), 10);
});

// --- T3: the interleaved beat plan and the chaining loop ---------------------

// Mirrors the contract in ACTIVITY_ORDER/TIERS. Kept here deliberately: if a
// cost or budget changes, these tests should fail and be re-read, not silently
// track the source.
const BEAT_COST = {
  lessonMatch: 5, sentenceBank: 4, shema: 3, verbMatch: 18, abbrMatch: 5,
  advConj: 4, prepositions: 4, binyanBoard: 11, handwriting: 14,
};
const TIER_BUDGET = { short: 18, medium: 36, full: 70 };
const ATOMIC_MODES = ["verbMatch", "binyanBoard", "handwriting"];

function buildMission(tierId, characterId = "ido") {
  const { character, app } = loadCharacterModule();
  // Seeded the way the other picker tests do it: the module does not build
  // characterState until initialize(), and these tests drive the scene directly.
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", hasChosen: {}, topics: {},
    dailyChoice: "", pendingChoice: "", lensCharacter: "", screen: "picker", mission: null,
  };
  character.chooseCharacter(characterId);
  character.confirmFocus();
  character.chooseTier(tierId);
  const mission = app.runtime.characterState.mission;
  return {
    character,
    app,
    mission,
    beats: mission.beats.map((beat) => ({ mode: beat.mode, rounds: beat.rounds })),
    modes: mission.beats.map((beat) => beat.mode),
    cost: mission.beats.reduce((sum, beat) => sum + BEAT_COST[beat.mode], 0),
  };
}

test("every tier spends its question budget without exceeding it", () => {
  ["short", "medium", "full"].forEach((tierId) => {
    const { beats, cost } = buildMission(tierId);
    assert.ok(beats.length > 0, `${tierId} produced no beats`);
    assert.ok(cost <= TIER_BUDGET[tierId], `${tierId} spent ${cost} of ${TIER_BUDGET[tierId]}`);
    // An unspent remainder is only a bug if another beat would have fit, so it
    // is judged against the cheapest mode the plan actually drew on.
    const cheapest = Math.min(...beats.map((beat) => BEAT_COST[beat.mode]));
    const unspent = TIER_BUDGET[tierId] - cost;
    assert.ok(unspent < cheapest, `${tierId} left ${unspent} unspent, cheapest beat is ${cheapest}`);
  });
});

test("no mode runs twice in a row, in any tier", () => {
  ["short", "medium", "full"].forEach((tierId) => {
    const { modes } = buildMission(tierId);
    modes.forEach((mode, index) => {
      if (index === 0) return;
      assert.notEqual(mode, modes[index - 1], `${tierId} repeats ${mode} at ${index}`);
    });
  });
});

test("modes that feel the same never sit back to back", () => {
  // Coarser than the mode id: sentenceBank and shema are the same chip-building
  // interaction read versus heard, and lessonMatch and abbrMatch are the same
  // matching board. Adjacent, either pair reads as one long block, which is the
  // blocked practice this whole change exists to break up.
  const FAMILY = {
    lessonMatch: "match", abbrMatch: "match",
    sentenceBank: "sentence", shema: "sentence",
    advConj: "conjugation", prepositions: "prepositions",
    verbMatch: "verbMatch", binyanBoard: "binyan", handwriting: "handwriting",
  };
  ["short", "medium", "full"].forEach((tierId) => {
    const { modes } = buildMission(tierId);
    modes.forEach((mode, index) => {
      if (index === 0) return;
      assert.notEqual(
        FAMILY[mode], FAMILY[modes[index - 1]],
        `${tierId}: ${modes[index - 1]} → ${mode} at ${index} are the same interaction`,
      );
    });
  });
});

test("a mission opens on a cheap familiar win", () => {
  ["short", "medium", "full"].forEach((tierId) => {
    const { modes } = buildMission(tierId);
    assert.ok(["lessonMatch", "sentenceBank"].includes(modes[0]), `${tierId} opened on ${modes[0]}`);
  });
});

test("the long atomic modes are priced out of a short mission", () => {
  const { modes } = buildMission("short");
  ATOMIC_MODES.forEach((mode) => {
    assert.equal(modes.includes(mode), false, `short should not reach ${mode}`);
  });
});

test("a long atomic beat never opens, closes, or doubles up on a mission", () => {
  const { modes } = buildMission("full");
  const atomicAt = modes
    .map((mode, index) => (ATOMIC_MODES.includes(mode) ? index : -1))
    .filter((index) => index >= 0);

  assert.ok(atomicAt.length > 0, "full should afford at least one long beat");
  assert.equal(atomicAt.includes(0), false, "a mission must not open on a long grind");
  assert.equal(atomicAt.includes(modes.length - 1), false, "a mission must not end on a long grind");
  atomicAt.forEach((index, i) => {
    if (i === 0) return;
    assert.ok(index - atomicAt[i - 1] > 1, "two long beats must not sit back to back");
  });
});

test("the same day, character and tier rebuild the identical plan", () => {
  // Flattened to a string on purpose: each mission is built in its own VM
  // context, so deepStrictEqual would fail on prototype identity even when the
  // plans match exactly.
  const flatten = (built) => built.beats.map((b) => `${b.mode}:${b.rounds}`).join(" > ");

  assert.equal(flatten(buildMission("full", "inat")), flatten(buildMission("full", "inat")));
  // A different tier is a different seed, so it must not be the same plan.
  assert.notEqual(flatten(buildMission("full", "inat")), flatten(buildMission("medium", "inat")));
});

test("shema is skipped, not silently dropped, when there is no Hebrew voice", () => {
  // The VM harness has no app.speech, which is the no-voice case.
  const { modes, mission } = buildMission("full");
  assert.equal(modes.includes("shema"), false);
  assert.equal(mission.skippedActivities.some((row) => row.id === "shema" && row.skipped === true), true);
});

test("several beats of one mode fold into a single results row", () => {
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
      beats: [
        { mode: "lessonMatch", rounds: 5 },
        { mode: "sentenceBank", rounds: 4 },
        { mode: "lessonMatch", rounds: 5 },
      ],
      skippedActivities: [],
      currentIndex: 0,
      currentActivity: "lessonMatch",
      results: [],
      visible: true,
    },
  };

  character.captureActivitySummary({ correctCount: 4, incorrectCount: 1, elapsedSeconds: 30, mistakes: [{ primary: "a" }] });
  character.captureActivitySummary({ correctCount: 3, incorrectCount: 1, elapsedSeconds: 40, mistakes: [{ primary: "b" }] });
  character.captureActivitySummary({ correctCount: 5, incorrectCount: 0, elapsedSeconds: 25, mistakes: [] });

  const results = app.runtime.characterState.mission.results;
  assert.equal(results.length, 2, "one row per mode, not one per beat");
  const vocab = results.find((row) => row.id === "lessonMatch");
  assert.equal(vocab.correctCount, 9);
  assert.equal(vocab.incorrectCount, 1);
  assert.equal(vocab.elapsedSeconds, 55);
  assert.equal(vocab.mistakes.length, 1);
});

test("a mission of starved decks falls back to the hub instead of recursing", () => {
  const { character, app } = loadCharacterModule();
  const beats = Array.from({ length: 40 }, (_, index) => (
    index % 2 === 0 ? { mode: "lessonMatch", rounds: 5 } : { mode: "sentenceBank", rounds: 4 }
  ));
  app.runtime.characterState = {
    dayKey: character.getTodayKey(),
    gender: "m",
    dailyChoice: "ido",
    screen: "none",
    reviewOpen: false,
    mission: {
      active: true, completed: false, beats, skippedActivities: [],
      currentIndex: 0, currentActivity: "lessonMatch", results: [], visible: true,
    },
  };
  // A starved deck finishes the instant it starts, which is what makes the
  // chain recurse: start -> finish -> capture -> start.
  const finishInstantly = () => character.captureActivitySummary({
    correctCount: 0, incorrectCount: 0, elapsedSeconds: 0, mistakes: [],
  });
  app.wordMatch = { startLessonMatch: finishInstantly, beginWordMatchFromIntro: () => {} };
  app.sentenceBank = { startSentenceBank: finishInstantly, beginSentenceBankFromIntro: () => {} };

  assert.doesNotThrow(() => finishInstantly());
  assert.equal(app.runtime.characterState.mission.onHub, true);
});

// --- T4: beat identity in the gameplay header --------------------------------

test("the gameplay pill carries the beat position, and only during a mission", () => {
  const source = fs.readFileSync(path.join(PROJECT_ROOT, "app/ui.js"), "utf8");
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");
  const markup = fs.readFileSync(path.join(PROJECT_ROOT, "index.html"), "utf8");
  const bootstrap = fs.readFileSync(path.join(PROJECT_ROOT, "app/bootstrap-runtime.js"), "utf8");

  // It lives in the pill, not beside the mode name: .lesson-title-row is hidden
  // during gameplay, so #modeTitle is never visible there, and the topbar has no
  // spare width at the 360px floor.
  assert.match(markup, /id="shellGameplayBeatStat"[^>]*class="shell-gameplay-stat hidden"/);
  assert.match(bootstrap, /shellGameplayBeat: document\.querySelector\("#shellGameplayBeat"\)/);
  assert.match(source, /const showBeat = shouldShow && Boolean\(beat\) && beat\.total > 1;/);
  // Free play and single-beat missions show nothing.
  assert.match(source, /runtime\.el\.shellGameplayBeatStat\?\.classList\.toggle\("hidden", !showBeat\);/);
  // Announced too, not just drawn.
  assert.match(source, /activity \$\{beat\.index \+ 1\} of \$\{beat\.total\}/);

  // The flash goes on a node no renderer rebuilds, and has a reduced-motion path:
  // this is the first animation on a gameplay surface.
  assert.match(source, /strip\.classList\.add\("is-beat-change"\)/);
  // Coverage, not position: the reduced-motion rules live in one shared block,
  // so assert this selector is in it rather than that it comes first.
  const reducedMotion = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.ok(reducedMotion.includes(".progress-strip.is-beat-change"));

  // .app-shell is a grid, so the topbar needs min-width: 0 or it can never
  // shrink and the whole shell overflows 360px instead of the title truncating.
  assert.match(css, /\.shell-topbar \{[^}]*min-width: 0;/s);
  assert.match(css, /\.shell-brand-title h1 \{[^}]*text-overflow: ellipsis;/s);

  ["--ink-soft", "--selection-glow"].forEach((token) => {
    assert.match(css, new RegExp(`\\n\\s+\\${token}:`), `${token} is not defined`);
  });
});

// --- T5: the mission-wide repair beat ----------------------------------------

function missionWithBeats(beats, currentIndex = 0, extra = {}) {
  return {
    dayKey: null, gender: "m", dailyChoice: "ido", screen: "none", reviewOpen: false,
    mission: {
      active: true, completed: false, beats, skippedActivities: [],
      currentIndex, currentActivity: beats[currentIndex]?.mode || "", results: [], visible: true,
      ...extra,
    },
  };
}

test("misses are held back to the end of the mission instead of re-asked in place", () => {
  const { character, app } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "advConj", rounds: 4 }, { mode: "lessonMatch", rounds: 5 }]);
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  assert.equal(character.deferReviewQueue("advConj", [{ key: "a" }, { key: "b" }]), true);
  assert.equal(app.runtime.characterState.mission.repairQueue.length, 2);
  // Free play keeps its own per-session review: nothing to defer to.
  const free = loadCharacterModule();
  free.app.runtime.characterState = {
    dayKey: free.character.getTodayKey(), gender: "m", dailyChoice: "free", screen: "none", mission: null,
  };
  assert.equal(free.character.deferReviewQueue("advConj", [{ key: "a" }]), false);
});

test("binyanBoard is never deferred, because its queue cannot survive its beat", () => {
  const { character, app } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "binyanBoard", rounds: 2 }]);
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  // Its reviewQueue holds bare formIds that only resolve against the root deck
  // built for that one beat, so it keeps reviewing in place.
  assert.equal(character.deferReviewQueue("binyanBoard", ["paal-1"]), false);
  // Refused early, so the queue is never even created on this hand-built mission.
  assert.ok(!app.runtime.characterState.mission.repairQueue?.length);
});

test("a finished mission appends one repair beat per mode that owes something", () => {
  const { character, app } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "advConj", rounds: 4 }], 0, {
    repairQueue: [
      { mode: "advConj", entry: { key: "a" } },
      { mode: "advConj", entry: { key: "b" } },
      { mode: "sentenceBank", entry: { sentenceId: "s1", direction: "he2en" } },
    ],
  });
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;
  app.session = { showSessionSummary: () => {} };

  // The last ordinary beat ends; repairs are appended rather than finishing.
  assert.equal(character.captureActivitySummary({ correctCount: 2, incorrectCount: 2, elapsedSeconds: 30, mistakes: [] }), true);
  const mission = app.runtime.characterState.mission;
  const appended = mission.beats.slice(1).map((b) => `${b.mode}:${b.rounds}:${b.repair === true}`);
  assert.deepEqual([...appended], ["sentenceBank:1:true", "advConj:2:true"]);
  assert.equal(mission.completed, false, "the mission must not finish before its repairs");
});

test("repairs are spent exactly once, so the mission cannot loop on them", () => {
  const { character, app } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "advConj", rounds: 4 }], 0, {
    repairQueue: [{ mode: "advConj", entry: { key: "a" } }],
  });
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;
  let finished = 0;
  app.session = { showSessionSummary: () => { finished += 1; } };

  character.captureActivitySummary({ correctCount: 3, incorrectCount: 1, elapsedSeconds: 20, mistakes: [] });
  const mission = app.runtime.characterState.mission;
  assert.equal(mission.beats.length, 2, "one repair beat appended");

  // Finishing the repair beat itself must end the mission, not append again.
  mission.currentActivity = "advConj";
  character.captureActivitySummary({ correctCount: 1, incorrectCount: 0, elapsedSeconds: 10, mistakes: [] });
  assert.equal(mission.beats.length, 2, "repairs must not append a second time");
  assert.equal(mission.completed, true);
  assert.equal(finished, 1);
});

test("a repair beat's own misses stay in that beat", () => {
  const { character, app } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "advConj", rounds: 2, repair: true }]);
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  // Otherwise the mission would append a repair beat for the repair beat.
  assert.equal(character.deferReviewQueue("advConj", [{ key: "a" }]), false);
});

test("taking a repair queue hands over only that mode's entries, once", () => {
  const { character, app } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "advConj", rounds: 2, repair: true }], 0, {
    repairQueue: [
      { mode: "advConj", entry: { key: "a" } },
      { mode: "prepositions", entry: { key: "p" } },
      { mode: "advConj", entry: { key: "b" } },
    ],
  });
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  assert.equal(character.takeRepairQueue("advConj").length, 2);
  assert.equal(character.takeRepairQueue("advConj").length, 0, "a queue is handed over once");
  assert.equal(app.runtime.characterState.mission.repairQueue.length, 1, "other modes keep theirs");
});

test("a repair beat asks for no fresh rounds", () => {
  const { character, app, context } = loadCharacterModule();
  const state = missionWithBeats([{ mode: "advConj", rounds: 3, repair: true }]);
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;
  vm.runInContext(
    fs.readFileSync(path.join(PROJECT_ROOT, "app/session.js"), "utf8"),
    context, { filename: "app/session.js" },
  );

  assert.equal(character.getActiveBeat().repair, true);
  assert.equal(app.session.getModeRoundTarget("advConj", 10), 0);
});

// --- T6: the bonfire ---------------------------------------------------------

function missionForDeath(beats = [{ mode: "advConj", rounds: 4 }], extra = {}) {
  return {
    dayKey: null, gender: "m", dailyChoice: "ido", screen: "none", reviewOpen: false,
    mission: {
      active: true, completed: false, beats, skippedActivities: [],
      currentIndex: 0, currentActivity: beats[0].mode, results: [], visible: true,
      correctStreak: 0, wrongStreak: 0, ...extra,
    },
  };
}

function killIt(character, app, times = 4) {
  for (let i = 0; i < times; i += 1) character.recordAnswer(false);
  return app.runtime.characterState;
}

test("four wrong in a row inside a mission opens the death card", () => {
  const { character, app } = loadCharacterModule();
  const state = missionForDeath();
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  killIt(character, app, 3);
  assert.equal(app.runtime.characterState.screen, "none", "three wrong is not death");

  killIt(character, app, 1);
  assert.equal(app.runtime.characterState.screen, "death");
  assert.equal(app.runtime.characterState.mission.deaths, 1);
  assert.equal(character.isBlocking(), true);
});

test("free play never dies", () => {
  const { character, app } = loadCharacterModule();
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", dailyChoice: "free",
    screen: "none", mission: null, freePlay: { correctStreak: 0, wrongStreak: 0 },
  };
  killIt(character, app, 6);
  assert.equal(app.runtime.characterState.screen, "none");
});

test("a repair beat is already the second chance, so it cannot kill", () => {
  const { character, app } = loadCharacterModule();
  const state = missionForDeath([{ mode: "advConj", rounds: 3, repair: true }]);
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  killIt(character, app, 5);
  assert.equal(app.runtime.characterState.screen, "none",
    "dying inside a repair beat would send the learner back through the items they are recovering");
});

test("the bonfire can be switched off", () => {
  const { character, app } = loadCharacterModule();
  const state = missionForDeath();
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;
  app.runtime.state.bonfire = { enabled: false };

  killIt(character, app, 6);
  assert.equal(app.runtime.characterState.screen, "none");
  // The companion still reacts; only the card is suppressed.
  assert.equal(app.runtime.characterState.mission.sprite, "struggling");
});

test("respawn returns to the start of the current beat, never an earlier one", () => {
  const { character, app } = loadCharacterModule();
  const state = missionForDeath(
    [{ mode: "advConj", rounds: 4 }, { mode: "lessonMatch", rounds: 5 }],
    { currentIndex: 1, currentActivity: "lessonMatch", results: [{ id: "advConj", nameEn: "Conjugation+", nameHe: "נטיות+", correctCount: 3, incorrectCount: 1, elapsedSeconds: 20, mistakes: [], skipped: false }] },
  );
  state.dayKey = character.getTodayKey();
  app.runtime.characterState = state;

  killIt(character, app, 4);
  assert.equal(app.runtime.characterState.screen, "death");

  assert.equal(character.respawnAtBeat(), true);
  const mission = app.runtime.characterState.mission;
  assert.equal(mission.currentIndex, 1, "completed beats never replay");
  assert.equal(mission.currentActivity, "lessonMatch", "the same beat starts again");
  assert.equal(mission.wrongStreak, 0);
  assert.equal(mission.sprite, "neutral");
  assert.equal(app.runtime.characterState.screen, "none");
  assert.equal(mission.results.length, 1, "an earlier beat's result survives the death");
});

test("a death screen restored without a live mission does not trap the app", () => {
  const { character, app } = loadCharacterModule({
    saved: { dayKey: new Date().toISOString().slice(0, 10), gender: "m", dailyChoice: "ido", screen: "death", mission: null },
  });
  character.initialize();
  assert.notEqual(app.runtime.characterState.screen, "death");
  assert.equal(character.respawnAtBeat(), false);
});

// --- Feel: motion foundation and the answer pulse ----------------------------

test("one hook pulses every mode, and every animation has a reduced-motion path", () => {
  const audio = fs.readFileSync(path.join(PROJECT_ROOT, "app/audio.js"), "utf8");
  const ui = fs.readFileSync(path.join(PROJECT_ROOT, "app/ui.js"), "utf8");
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");

  // playAnswerFeedbackSound is the single call every mode makes on an answer.
  assert.match(audio, /app\.ui\?\.pulseAnswerFeedback\?\.\(isCorrect === true\);/);
  // On a node no renderer rebuilds, or a renderAll mid-answer cuts the animation.
  assert.match(ui, /const stage = runtime\.el\?\.homeLessonStage;/);
  assert.match(ui, /void stage\.offsetWidth;/, "a replayed animation needs a reflow between remove and add");

  // Motion tokens exist and are load-bearing, not decorative.
  ["--dur-fast", "--dur", "--dur-slow", "--ease-out", "--ease-spring"].forEach((token) => {
    assert.match(css, new RegExp(`\\n\\s+\\${token}:`), `${token} is not defined`);
  });
  assert.ok(css.includes("var(--dur-fast) var(--ease-out)"), "tokens must drive real transitions");
  assert.ok(css.includes("animation: matchCardIn var(--dur)"), "existing animations must read the tokens");

  // Exactly one reduced-motion block, so a new animation has one place to go.
  const blocks = css.match(/@media \(prefers-reduced-motion: reduce\)/g) || [];
  assert.equal(blocks.length, 1, "keep reduced-motion in a single block");
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  ["is-answer-correct", "is-answer-wrong", "is-beat-change", "character-death-title"].forEach((name) => {
    assert.ok(reduced.includes(name), `${name} has no reduced-motion path`);
  });
  assert.match(reduced, /--dur-fast: 0ms;/);
});

// --- Feel: sound on by default, and a visible streak -------------------------

test("sound is on unless the learner turned it off", () => {
  const persistence = fs.readFileSync(path.join(PROJECT_ROOT, "app/persistence.js"), "utf8");
  const block = persistence.slice(persistence.indexOf("function loadSoundPreference"));
  // Opt-out, not opt-in: absent means on, so no existing save needs migrating.
  assert.match(block.slice(0, 260), /enabled: raw\?\.enabled !== false/);
});

test("the four streak tiers are actually perceptible", () => {
  const css = fs.readFileSync(path.join(PROJECT_ROOT, "styles.css"), "utf8");
  const tier = (n) => {
    const start = css.indexOf(`.progress-fill[data-streak-tier="${n}"] {`);
    assert.ok(start > -1, `tier ${n} rule is missing`);
    return css.slice(start, css.indexOf("}", start));
  };

  // The tiers were already computed and written to the DOM; they just ramped
  // brightness/saturate 1.06 -> 1.28, which nobody can see.
  [1, 2, 3, 4].forEach((n) => {
    assert.ok(!/^\s*filter: brightness\(1\.0/m.test(tier(n)), `tier ${n} is still an invisible filter ramp`);
  });
  // A ramp: each tier must do something the one below it does not.
  assert.ok(tier(1).includes("box-shadow"));
  assert.ok(tier(2).includes("box-shadow") && tier(2).includes("saturate"));
  assert.ok(tier(3).includes("streakBreathe"), "tier 3 should breathe");
  assert.ok(tier(4).includes("var(--gold)"), "tier 4 should add the gold edge");
  assert.match(css, /@keyframes streakBreathe \{/);

  // The breathing loop is an infinite animation, so it needs the same path as the rest.
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.ok(reduced.includes('.progress-fill[data-streak-tier="3"]'));
  assert.ok(reduced.includes('.progress-fill[data-streak-tier="4"]'));
});

// --- Feel: the daily streak --------------------------------------------------

function streakHarness(savedDays, savedBonds) {
  const { character, app } = loadCharacterModule({
    saved: {}, savedBonds: savedBonds || {},
  });
  const store = new Map();
  if (savedDays) store.set("ivriquest-learner-days-v1", { days: savedDays });
  app.runtime.constants.STORAGE_KEYS.learnerDays = "ivriquest-learner-days-v1";
  const original = app.runtime.storageApi;
  app.runtime.storageApi = {
    loadJson: (key, fallback) => (store.has(key) ? store.get(key) : original.loadJson(key, fallback)),
    saveJson: (key, value) => store.set(key, value),
  };
  return { character, app, store };
}

function daysBack(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return out;
}

test("the daily streak counts consecutive days up to today", () => {
  const { character } = streakHarness(daysBack(5));
  const streak = character.getDailyStreak();
  assert.equal(streak.current, 5);
  assert.equal(streak.longest, 5);
  assert.equal(streak.practisedToday, true);
});

test("a streak survives today being unopened, and breaks after a full day missed", () => {
  const yesterdayRun = daysBack(4).slice(0, 3);
  const alive = streakHarness(yesterdayRun).character.getDailyStreak();
  // Counted from yesterday, so opening the app tomorrow morning does not read
  // as broken before the day has even been missed.
  assert.equal(alive.current, 3);
  assert.equal(alive.practisedToday, false);

  const stale = streakHarness(daysBack(6).slice(0, 3)).character.getDailyStreak();
  assert.equal(stale.current, 0, "three days ago is a broken streak");
  assert.equal(stale.longest, 3, "but it still counts as the longest run");
});

test("the streak seeds from bond history so nobody loses days they earned", () => {
  // Bond days only record correct answers under an active character, so they
  // cannot be the source of truth going forward — but they are real history.
  const { character } = streakHarness(null, {
    ido: { xp: 10, missions: 1, days: daysBack(3).slice(0, 2) },
    inat: { xp: 5, missions: 0, days: daysBack(3) },
  });
  const streak = character.getDailyStreak();
  assert.equal(streak.totalDays, 3, "the union of every character's days");
  assert.equal(streak.current, 3);
});

test("a day is recorded for a wrong answer too", () => {
  const { character, app, store } = streakHarness([]);
  app.runtime.characterState = {
    dayKey: character.getTodayKey(), gender: "m", dailyChoice: "free",
    screen: "none", mission: null, freePlay: { correctStreak: 0, wrongStreak: 0 },
  };
  // The streak measures showing up, not accuracy — and free play with no lens
  // awards no bond XP at all, so this cannot ride on the bond record.
  character.recordAnswer(false);
  // Joined rather than deepEqual: the array is built inside the VM realm.
  assert.equal([...store.get("ivriquest-learner-days-v1").days].join(","), character.getTodayKey());
});

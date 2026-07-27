(function initIvriQuestCharacter(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const character = app.character = app.character || {};

const ACTIVITY_ORDER = Object.freeze([
  { id: "lessonMatch", nameEn: "Vocabulary", nameHe: "אוצר מילים", intro: "vocabulary" },
  { id: "sentenceBank", nameEn: "Sentences", nameHe: "משפטים", intro: "sentences" },
  { id: "shema", nameEn: "Shema", nameHe: "שמע", intro: "listening" },
  { id: "verbMatch", nameEn: "Conjugation", nameHe: "נטיות", intro: "conjugation" },
  { id: "abbrMatch", nameEn: "Abbreviations", nameHe: "קיצורים", intro: "abbreviations" },
  { id: "advConj", nameEn: "Conjugation+", nameHe: "נטיות+", intro: "advConj" },
  { id: "prepositions", nameEn: "Prepositions", nameHe: "מילות יחס", intro: "prepositions" },
  { id: "binyanBoard", nameEn: "Binyanim", nameHe: "בניינים", intro: "binyanim" },
  { id: "handwriting", nameEn: "Handwriting", nameHe: "כתב יד", intro: "handwriting" },
]);

const TIERS = Object.freeze({
  short: { count: 3, labelEn: "Short", labelHe: "קצר" },
  medium: { count: 5, labelEn: "Medium", labelHe: "בינוני" },
  full: { count: 9, labelEn: "Full", labelHe: "מלא" },
});

const SPRITE_NAMES = new Set([
  "neutral", "frustrated", "celebrating", "struggling", "mission-complete", "nervous-laugh",
]);

const LEGACY_SPRITE_NAMES = Object.freeze({
  "top-left": "neutral",
  "top-right": "frustrated",
  "bottom-left": "celebrating",
  "bottom-center": "struggling",
  "bottom-right": "mission-complete",
});

let activeCompanionDrag = null;

function getCharacterData() {
  return app.characterData || {};
}

function getCharacters() {
  return getCharacterData().characters || {};
}

function getCharacterIds() {
  return getCharacterData().getCharacterIds?.() || Object.keys(getCharacters());
}

function getCharacterById(id) {
  return getCharacters()[String(id || "")] || null;
}

// Which character the UI is presenting right now. A live mission or its result
// screen wins, then a pending pick mid-picker, then the free-play lens chosen
// in Settings.
function getActiveCharacter() {
  const state = getState();
  if (state?.pendingChoice) return getCharacterById(state.pendingChoice);
  if (state?.mission && (state.mission.active || state.screen === "results")) {
    return getCharacterById(state.dailyChoice) || getCharacterById(state.lensCharacter);
  }
  return getCharacterById(state?.lensCharacter) || null;
}

// Whose content the pickers should bias toward. A mission pins this to the
// day's character; otherwise the Settings lens applies during ordinary play.
function getRoutingCharacterId() {
  const state = getState();
  if (state?.mission?.active) return state.dailyChoice;
  return state?.lensCharacter || "";
}

function getRuntime() {
  return app.runtime || {};
}

function getState() {
  return getRuntime().characterState || null;
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isHebrewUi() {
  return getRuntime().state?.language === "he";
}

function characterName(entry) {
  if (!entry) return "";
  return isHebrewUi() ? (entry.nameHe || entry.nameEn) : (entry.nameEn || entry.nameHe);
}

function uiText(english, hebrew) {
  return isHebrewUi() ? hebrew : english;
}

function sanitizeHasChosen(saved) {
  const hasChosen = {};
  // Pre-registry saves recorded a single boolean for Ido.
  if (saved?.hasChosenIdo === true) hasChosen.ido = true;
  if (saved?.hasChosen && typeof saved.hasChosen === "object") {
    getCharacterIds().forEach((id) => {
      if (saved.hasChosen[id] === true) hasChosen[id] = true;
    });
  }
  return hasChosen;
}

function createInitialCharacterState(saved, dayKey) {
  return {
    dayKey,
    gender: saved?.gender === "m" || saved?.gender === "f" ? saved.gender : "",
    hasChosen: sanitizeHasChosen(saved),
    dailyChoice: "",
    pendingChoice: "",
    // The free-play lens outlives the day-keyed mission state deliberately.
    lensCharacter: isCharacterChoice(saved?.lensCharacter) ? saved.lensCharacter : "",
    freePlay: createReactionContainer(saved?.freePlay),
    screen: "picker",
    reviewOpen: false,
    mission: null,
  };
}

function sanitizeResult(result) {
  return {
    id: String(result?.id || ""),
    nameEn: String(result?.nameEn || ""),
    nameHe: String(result?.nameHe || ""),
    correctCount: Math.max(0, Number(result?.correctCount || 0)),
    incorrectCount: Math.max(0, Number(result?.incorrectCount || 0)),
    elapsedSeconds: Math.max(0, Number(result?.elapsedSeconds || 0)),
    mistakes: Array.isArray(result?.mistakes) ? result.mistakes : [],
    skipped: result?.skipped === true,
  };
}

// Reaction and companion state, shared by a mission and by free play so the
// same streak/sprite/drag logic drives both.
function createReactionContainer(saved) {
  const savedPosition = saved?.companionPosition;
  const companionPosition = savedPosition &&
    Number.isFinite(Number(savedPosition.x)) &&
    Number.isFinite(Number(savedPosition.y))
    ? { x: Number(savedPosition.x), y: Number(savedPosition.y) }
    : null;
  return {
    correctStreak: Math.max(0, Number(saved?.correctStreak || 0)),
    wrongStreak: Math.max(0, Number(saved?.wrongStreak || 0)),
    sprite: LEGACY_SPRITE_NAMES[saved?.sprite] ||
      (SPRITE_NAMES.has(String(saved?.sprite || "")) ? String(saved.sprite) : "neutral"),
    dialogueKey: String(saved?.dialogueKey || ""),
    reactionTransient: saved?.reactionTransient === true,
    reactionQuestionKey: String(saved?.reactionQuestionKey || ""),
    visible: saved?.visible !== false,
    companionPosition,
  };
}

function sanitizeMission(mission) {
  if (!mission || typeof mission !== "object") return null;
  return {
    ...createReactionContainer(mission),
    active: mission.active === true,
    completed: mission.completed === true,
    onHub: mission.onHub === true,
    tier: TIERS[mission.tier] ? mission.tier : "short",
    activities: Array.isArray(mission.activities)
      ? mission.activities.map((id) => String(id || "")).filter((id) => ACTIVITY_ORDER.some((activity) => activity.id === id))
      : [],
    skippedActivities: Array.isArray(mission.skippedActivities)
      ? mission.skippedActivities.map(sanitizeResult)
      : [],
    currentIndex: Math.max(0, Number(mission.currentIndex || 0)),
    currentActivity: String(mission.currentActivity || ""),
    results: Array.isArray(mission.results) ? mission.results.map(sanitizeResult) : [],
    startedAt: Math.max(0, Number(mission.startedAt || 0)),
  };
}

function isCharacterChoice(value) {
  return getCharacterIds().includes(String(value || ""));
}

function sanitizeCharacterState(saved, today) {
  const state = createInitialCharacterState(saved, today);
  state.dailyChoice = saved?.dailyChoice === "free" || isCharacterChoice(saved?.dailyChoice)
    ? saved.dailyChoice
    : "";
  state.pendingChoice = isCharacterChoice(saved?.pendingChoice) ? saved.pendingChoice : "";
  state.lensCharacter = isCharacterChoice(saved?.lensCharacter) ? saved.lensCharacter : "";
  state.screen = ["picker", "duration", "greeting", "activityIntro", "perfect", "results", "none"].includes(saved?.screen)
    ? saved.screen
    : (state.dailyChoice ? "none" : "picker");
  state.reviewOpen = saved?.reviewOpen === true;
  state.mission = sanitizeMission(saved?.mission);
  if (isCharacterChoice(state.dailyChoice) && !state.mission) {
    state.dailyChoice = "";
    state.screen = "picker";
  }
  if (state.screen === "duration" && !state.pendingChoice) {
    state.screen = "picker";
  }
  return state;
}

function saveState() {
  const runtime = getRuntime();
  if (!runtime.characterState) return;
  runtime.storageApi?.saveJson?.(runtime.constants?.STORAGE_KEYS?.character, runtime.characterState);
}

character.initialize = character.initialize || function initialize() {
  const runtime = getRuntime();
  const today = getTodayKey();
  const saved = runtime.storageApi?.loadJson?.(runtime.constants?.STORAGE_KEYS?.character, {}) || {};
  const sameDay = saved?.dayKey === today;

  runtime.characterState = sameDay
    ? sanitizeCharacterState(saved, today)
    : createInitialCharacterState(saved, today);

  if (global.__IVRIQUEST_TEST_CONFIG__?.disableDailyCharacterPicker === true) {
    runtime.characterState.dailyChoice = "free";
    runtime.characterState.screen = "none";
  }
  saveState();

  if (!sameDay) {
    app.persistence?.clearPersistedSession?.();
    return false;
  }
  return true;
};

character.bindUi = character.bindUi || function bindUi() {
  const runtime = getRuntime();
  if (runtime.characterUiBound) return;
  runtime.characterUiBound = true;

  runtime.el?.characterSceneContent?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-character-action]");
    if (!button) return;
    const action = button.dataset.characterAction || "";
    if (action === "gender") {
      character.setGender(button.dataset.gender);
    } else if (action === "free") {
      character.chooseFreePlay();
    } else if (action === "character") {
      character.chooseCharacter(button.dataset.characterId);
    } else if (action === "back") {
      character.backToPicker();
    } else if (action === "tier") {
      character.chooseTier(button.dataset.tier);
    } else if (action === "continue") {
      character.continueScene();
    }
  });

  runtime.el?.characterMissionHub?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-mission-activity]");
    if (!button || button.disabled) return;
    character.openMissionActivity(button.dataset.missionActivity);
  });
  runtime.el?.characterVisibilityToggle?.addEventListener("click", () => character.toggleVisibility());
  runtime.el?.characterCompanionSprite?.addEventListener("pointerdown", (event) => character.startCompanionDrag(event));
  runtime.el?.characterGenderToggle?.addEventListener("click", () => {
    const state = getState();
    character.setGender(state?.gender === "m" ? "f" : "m");
  });

  runtime.el?.characterLensOptions?.addEventListener("click", (event) => {
    const option = event.target?.closest?.("[data-character-lens]");
    if (!option || option.disabled) return;
    character.setLensCharacter(option.dataset.characterLens);
  });

  global.addEventListener("focus", () => character.checkDayRollover());
  global.document?.addEventListener("visibilitychange", () => {
    if (global.document.visibilityState === "visible") {
      character.checkDayRollover();
    }
  });
};

character.checkDayRollover = character.checkDayRollover || function checkDayRollover() {
  const state = getState();
  if (!state || state.dayKey === getTodayKey()) return false;
  const runtime = getRuntime();
  runtime.characterState = createInitialCharacterState(state, getTodayKey());
  saveState();
  app.persistence?.clearPersistedSession?.();
  global.location?.reload?.();
  return true;
};

character.isBlocking = character.isBlocking || function isBlocking() {
  return ["picker", "duration", "greeting", "activityIntro", "perfect"].includes(getState()?.screen);
};

character.isMissionActive = character.isMissionActive || function isMissionActive() {
  return getState()?.mission?.active === true;
};

// Share of a mission's draw that should come from the active character's own
// material, per docs/character-gameplay-strategy.md.
const TARGET_OWNED_SHARE = 0.65;

function getActiveRoute() {
  return getCharacterById(getRoutingCharacterId())?.route || null;
}

function ownsItem(route, kind, item) {
  if (!route || !item) return false;
  if (kind === "vocab") {
    // Matched on `he`, not `id`: vocabulary ids embed a positional index
    // (social_cultural-0NN-secular) that shifts when a row is inserted into the
    // same category, so id matching would silently rot.
    return route.vocabCategories?.includes(item.category) === true ||
      route.vocabWords?.includes(item.he) === true;
  }
  if (kind === "abbreviation") {
    return route.abbrBuckets?.includes(item.bucket) === true;
  }
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

character.getContentWeight = character.getContentWeight || function getContentWeight(kind, item) {
  return ownsItem(getActiveRoute(), kind, item) ? 2 : 1;
};

// Returns a per-item multiplier for one draw. The boost is solved from the
// candidate list so the owned share lands near TARGET_OWNED_SHARE regardless of
// how much material a character owns — a fixed constant would drift badly as
// content grows. A uniform multiplier across the owned subset leaves the
// adaptive and spaced-repetition ordering inside each subset untouched.
character.buildContentWeigher = character.buildContentWeigher || function buildContentWeigher(kind, items, getItem) {
  const neutral = () => 1;
  const route = getActiveRoute();
  if (!route || !Array.isArray(items) || !items.length) return neutral;

  const resolve = typeof getItem === "function" ? getItem : (entry) => entry;
  const isOwned = (entry) => ownsItem(route, kind, resolve(entry));
  const ownedCount = items.reduce((total, entry) => total + (isOwned(entry) ? 1 : 0), 0);
  const restCount = items.length - ownedCount;
  if (!ownedCount || !restCount) return neutral;

  const boost = (TARGET_OWNED_SHARE * restCount) / ((1 - TARGET_OWNED_SHARE) * ownedCount);
  return (entry) => (isOwned(entry) ? boost : 1);
};

function getDialogue(key, characterId) {
  const table = (characterId ? getCharacterById(characterId) : getActiveCharacter())?.dialogue;
  if (!table) return null;
  const suffix = getState()?.gender === "f" ? "F" : "M";
  const fallbackKey = getCharacterData().DIALOGUE_FALLBACKS?.[key];
  return table[key + suffix] ||
    table[key] ||
    (fallbackKey ? table[fallbackKey + suffix] || table[fallbackKey] : null) ||
    null;
}

function renderDialogue(target, entry, className = "character-dialogue") {
  if (!target || !entry) return null;
  const wrap = global.document.createElement("div");
  wrap.className = `${className}-wrap`;

  const line = global.document.createElement("p");
  line.className = className;
  line.dir = "rtl";

  const pattern = /[א-ת]+(?:[׳״"'][א-ת]+)*/g;
  let lastIndex = 0;
  for (const match of entry.text.matchAll(pattern)) {
    if (match.index > lastIndex) {
      line.append(global.document.createTextNode(entry.text.slice(lastIndex, match.index)));
    }
    const word = match[0];
    const gloss = entry.glosses[word] || "";
    if (gloss) {
      const button = global.document.createElement("button");
      button.type = "button";
      button.className = "character-word";
      const wordNode = global.document.createElement("span");
      wordNode.textContent = word;
      const glossNode = global.document.createElement("span");
      glossNode.className = "character-word-gloss hidden";
      glossNode.textContent = gloss;
      glossNode.setAttribute("role", "tooltip");
      button.append(wordNode, glossNode);
      button.setAttribute("aria-label", `${word}: ${gloss}`);
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        const willOpen = glossNode.classList.contains("hidden");
        line.querySelectorAll(".character-word-gloss").forEach((node) => node.classList.add("hidden"));
        line.querySelectorAll(".character-word").forEach((node) => node.setAttribute("aria-expanded", "false"));
        glossNode.classList.toggle("hidden", !willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
      });
      line.append(button);
    } else {
      line.append(global.document.createTextNode(word));
    }
    lastIndex = match.index + word.length;
  }
  if (lastIndex < entry.text.length) {
    line.append(global.document.createTextNode(entry.text.slice(lastIndex)));
  }

  wrap.append(line);
  target.append(wrap);
  return wrap;
}

function createSprite(frame, extraClass = "", characterId = "") {
  const entry = characterId ? getCharacterById(characterId) : getActiveCharacter();
  const sprite = global.document.createElement("div");
  sprite.className = `character-sprite ${extraClass}`.trim();
  sprite.dataset.character = entry?.id || getCharacterIds()[0] || "";
  sprite.dataset.reaction = frame;
  sprite.setAttribute("role", "img");
  sprite.setAttribute("aria-label", entry?.nameEn || "");
  return sprite;
}

function createSceneButton(label, action, className = "accent") {
  const button = global.document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.dataset.characterAction = action;
  return button;
}

function renderGenderPicker(target) {
  const state = getState();
  const block = global.document.createElement("div");
  block.className = "character-gender-picker";
  const label = global.document.createElement("p");
  label.className = "character-picker-label";
  label.textContent = uiText("How should the character address you?", "איך הדמות תפנה אליך?");

  const options = global.document.createElement("div");
  options.className = "character-gender-options";
  [["m", uiText("Male", "זכר")], ["f", uiText("Female", "נקבה")]].forEach(([value, text]) => {
    const button = createSceneButton(text, "gender", "quiet");
    button.dataset.gender = value;
    button.classList.toggle("selected", state?.gender === value);
    button.setAttribute("aria-pressed", String(state?.gender === value));
    options.append(button);
  });
  block.append(label, options);
  target.append(block);
}

function renderPicker(target) {
  const state = getState();
  const heading = global.document.createElement("div");
  heading.className = "character-scene-heading";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = uiText("Choose today’s character", "בוחרים דמות להיום");
  heading.append(title);

  const cards = global.document.createElement("div");
  cards.className = "character-choice-grid";

  getCharacterIds().forEach((id) => {
    const entry = getCharacterById(id);
    if (!entry) return;
    const card = global.document.createElement("article");
    card.className = "character-choice-card";
    card.append(createSprite("neutral", "character-picker-sprite", id));
    const name = global.document.createElement("h3");
    name.textContent = characterName(entry);
    card.append(name);
    renderDialogue(card, getDialogue("description", id), "character-card-dialogue");
    const button = createSceneButton(
      uiText(`Choose ${entry.nameEn}`, `לבחור ב${entry.nameHe}`),
      "character"
    );
    button.dataset.characterId = id;
    button.disabled = !state?.gender;
    card.append(button);
    cards.append(card);
  });

  const freeCard = global.document.createElement("article");
  freeCard.className = "character-choice-card character-choice-card--free";
  const freeIcon = global.document.createElement("div");
  freeIcon.className = "free-play-icon";
  freeIcon.textContent = "∞";
  const freeName = global.document.createElement("h3");
  freeName.textContent = "Free Play";
  const freeNote = global.document.createElement("p");
  freeNote.textContent = uiText("Use the regular IvritElite homepage.", "להמשיך לעמוד הבית הרגיל.");
  freeCard.append(freeIcon, freeName, freeNote, createSceneButton(uiText("Choose Free Play", "לבחור במשחק חופשי"), "free", "quiet"));

  cards.append(freeCard);
  target.append(heading);
  renderGenderPicker(target);
  target.append(cards);
}

function renderDuration(target) {
  const state = getState();
  const layout = global.document.createElement("div");
  layout.className = "character-scene-layout";
  const visual = global.document.createElement("div");
  visual.className = "character-scene-visual";
  visual.append(createSprite("neutral", "character-scene-sprite"));
  const alreadyMet = state?.hasChosen?.[getActiveCharacter()?.id] === true;
  renderDialogue(visual, alreadyMet ? getDialogue("description") : getDialogue("first"));

  const choices = global.document.createElement("div");
  choices.className = "character-duration-panel";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = uiText("Choose a mission", "לבחור משימה");
  choices.append(title);
  Object.entries(TIERS).forEach(([id, tier]) => {
    const button = createSceneButton(
      `${isHebrewUi() ? tier.labelHe : tier.labelEn} · ${tier.count} ${uiText("activities", "פעילויות")}`,
      "tier",
      id === "medium" ? "accent" : "quiet"
    );
    button.dataset.tier = id;
    choices.append(button);
  });
  choices.append(createSceneButton(uiText("Back", "חזרה"), "back", "quiet character-back-button"));
  layout.append(choices, visual);
  target.append(layout);
}

function renderGreeting(target) {
  const layout = global.document.createElement("div");
  layout.className = "character-scene-focus";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = characterName(getActiveCharacter());
  layout.append(title, createSprite("neutral", "character-scene-sprite"));
  renderDialogue(layout, getDialogue("greeting"));
  layout.append(createSceneButton(uiText("Start mission", "מתחילים"), "continue"));
  target.append(layout);
}

function getActivity(id) {
  return ACTIVITY_ORDER.find((activity) => activity.id === id) || null;
}

function renderActivityIntro(target) {
  const mission = getState()?.mission;
  const activity = getActivity(mission?.activities?.[mission.currentIndex]);
  if (!activity) return;
  const layout = global.document.createElement("div");
  layout.className = "character-scene-focus";
  const eyebrow = global.document.createElement("p");
  eyebrow.className = "character-scene-eyebrow";
  eyebrow.textContent = `${mission.currentIndex + 1}/${mission.activities.length}`;
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = isHebrewUi() ? activity.nameHe : activity.nameEn;
  layout.append(eyebrow, title, createSprite("neutral", "character-scene-sprite"));
  renderDialogue(layout, getDialogue(activity.intro));
  layout.append(createSceneButton("יאללה", "continue", "accent character-yalla-button"));
  target.append(layout);
}

function renderPerfect(target) {
  const layout = global.document.createElement("div");
  layout.className = "character-scene-focus";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = uiText("Perfect", "מושלם");
  layout.append(title, createSprite("celebrating", "character-scene-sprite"));
  renderDialogue(layout, getDialogue("perfect"));
  layout.append(createSceneButton(uiText("Continue", "להמשיך"), "continue"));
  target.append(layout);
}

character.renderScene = character.renderScene || function renderScene() {
  const runtime = getRuntime();
  const scene = runtime.el?.characterScene;
  const content = runtime.el?.characterSceneContent;
  if (!scene || !content) return;
  const screen = getState()?.screen;
  const blocking = character.isBlocking() && !runtime.state?.welcomeModalOpen;
  scene.classList.toggle("hidden", !blocking);
  scene.setAttribute("aria-hidden", blocking ? "false" : "true");
  if (!blocking) {
    content.innerHTML = "";
    return;
  }
  content.innerHTML = "";
  if (screen === "picker") renderPicker(content);
  else if (screen === "duration") renderDuration(content);
  else if (screen === "greeting") renderGreeting(content);
  else if (screen === "activityIntro") renderActivityIntro(content);
  else if (screen === "perfect") renderPerfect(content);
};

character.renderSettings = character.renderSettings || function renderSettings() {
  const runtime = getRuntime();
  const state = getState();
  const toggle = runtime.el?.characterGenderToggle;
  if (!toggle) return;
  if (runtime.el?.characterGenderLabel) {
    runtime.el.characterGenderLabel.textContent = uiText("Character address", "פניית הדמות");
  }
  toggle.setAttribute("aria-label", uiText("Change character address", "שינוי פניית הדמות"));
  const genderLabels = { m: uiText("Male", "זכר"), f: uiText("Female", "נקבה") };
  toggle.querySelectorAll("[data-character-gender]").forEach((option) => {
    const value = option.dataset.characterGender;
    option.textContent = genderLabels[value] || option.textContent;
    option.setAttribute("dir", isHebrewUi() ? "rtl" : "ltr");
    option.classList.toggle("selected", value === state?.gender);
  });
  renderLensPicker();
};

function renderLensPicker() {
  const runtime = getRuntime();
  const container = runtime.el?.characterLensOptions;
  if (!container) return;
  const state = getState();
  const changeable = character.canChangeLens();

  if (runtime.el?.characterLensLabel) {
    runtime.el.characterLensLabel.textContent = uiText("Free-play companion", "דמות למשחק חופשי");
  }
  container.setAttribute("aria-label", uiText("Choose a free-play companion", "בחירת דמות למשחק חופשי"));
  container.innerHTML = "";

  [{ id: "", label: uiText("None", "ללא") }]
    .concat(getCharacterIds().map((id) => ({ id, label: characterName(getCharacterById(id)) || id })))
    .forEach(({ id, label }) => {
      const option = global.document.createElement("button");
      option.type = "button";
      option.className = "settings-seg-opt";
      option.textContent = label;
      option.dataset.characterLens = id;
      option.disabled = !changeable;
      const selected = (state?.lensCharacter || "") === id;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed", String(selected));
      container.append(option);
    });

  const note = runtime.el?.characterLensNote;
  if (note) {
    note.classList.toggle("hidden", changeable);
    note.textContent = changeable
      ? ""
      : uiText(
        "Finish today’s mission to change your free-play companion.",
        "אפשר לשנות את הדמות למשחק חופשי בסיום המשימה של היום."
      );
  }
}

character.shouldShowMissionHub = character.shouldShowMissionHub || function shouldShowMissionHub() {
  const state = getState();
  return Boolean(state?.mission?.active && state.mission.onHub && state.screen === "none");
};

character.renderMissionHub = character.renderMissionHub || function renderMissionHub() {
  const runtime = getRuntime();
  const target = runtime.el?.characterMissionHub;
  if (!target) return;
  const show = character.shouldShowMissionHub() && runtime.state?.route === "home";
  target.classList.toggle("hidden", !show);
  target.innerHTML = "";
  if (!show) return;

  const mission = getState().mission;
  const completedCount = Math.min(mission.results.length, mission.activities.length);
  const progress = mission.activities.length ? Math.round((completedCount / mission.activities.length) * 100) : 0;

  const card = global.document.createElement("article");
  card.className = "page-card character-mission-card";
  const hero = global.document.createElement("header");
  hero.className = "character-mission-hero";
  const copy = global.document.createElement("div");
  copy.className = "character-mission-copy";
  const eyebrow = global.document.createElement("p");
  eyebrow.className = "character-scene-eyebrow";
  eyebrow.textContent = characterName(getActiveCharacter());
  const title = global.document.createElement("h2");
  title.textContent = uiText("Today’s mission", "המשימה של היום");
  const progressText = global.document.createElement("p");
  progressText.className = "character-mission-progress-text";
  progressText.textContent = uiText(
    `${completedCount} of ${mission.activities.length} activities complete`,
    `${completedCount} מתוך ${mission.activities.length} פעילויות הושלמו`
  );
  const progressTrack = global.document.createElement("div");
  progressTrack.className = "character-mission-progress";
  progressTrack.setAttribute("role", "progressbar");
  progressTrack.setAttribute("aria-valuemin", "0");
  progressTrack.setAttribute("aria-valuemax", "100");
  progressTrack.setAttribute("aria-valuenow", String(progress));
  const progressFill = global.document.createElement("span");
  progressFill.style.width = `${progress}%`;
  progressTrack.append(progressFill);
  copy.append(eyebrow, title, progressText, progressTrack);
  hero.append(copy, createSprite("neutral", "character-mission-sprite"));

  const list = global.document.createElement("div");
  list.className = "character-mission-list";
  mission.activities.forEach((activityId, index) => {
    const activity = getActivity(activityId);
    if (!activity) return;
    const result = mission.results.find((item) => item.id === activityId);
    const isCurrent = index === mission.currentIndex;
    const isUpcoming = index > mission.currentIndex;
    const row = global.document.createElement("button");
    row.type = "button";
    row.className = "character-mission-row";
    row.dataset.missionActivity = activityId;
    row.classList.toggle("is-complete", Boolean(result));
    row.classList.toggle("is-current", isCurrent);
    row.disabled = !isCurrent;

    const number = global.document.createElement("span");
    number.className = "character-mission-number";
    number.textContent = result ? "✓" : String(index + 1);
    const name = global.document.createElement("strong");
    name.textContent = isHebrewUi() ? activity.nameHe : activity.nameEn;
    const status = global.document.createElement("span");
    status.className = "character-mission-status";
    if (result) {
      status.textContent = `${result.correctCount}/${result.correctCount + result.incorrectCount} · ${formatTime(result.elapsedSeconds)}`;
    } else if (isCurrent) {
      status.textContent = mission.currentActivity
        ? uiText("Resume", "להמשיך")
        : uiText("Start", "להתחיל");
    } else if (isUpcoming) {
      status.textContent = uiText("Up next", "בהמשך");
    }
    row.append(number, name, status);
    list.append(row);
  });

  if (mission.skippedActivities.length) {
    mission.skippedActivities.forEach((result) => {
      const row = global.document.createElement("div");
      row.className = "character-mission-row is-skipped";
      const number = global.document.createElement("span");
      number.className = "character-mission-number";
      number.textContent = "—";
      const name = global.document.createElement("strong");
      name.textContent = isHebrewUi() ? result.nameHe : result.nameEn;
      const status = global.document.createElement("span");
      status.className = "character-mission-status";
      status.textContent = uiText("Skipped · Hebrew voice unavailable", "דולג · אין קול עברי");
      row.append(number, name, status);
      list.append(row);
    });
  }

  card.append(hero, list);
  target.append(card);
};

function getQuestionStateKey() {
  const runtime = getRuntime();
  const state = runtime.state || {};
  // In free play there is no mission activity, so the running mode identifies
  // the question instead. Shema shares the sentenceBank mode.
  const activityId = getState()?.mission?.currentActivity ||
    (state.sentenceBank?.shemaMode ? "shema" : state.mode) || "";
  if (activityId === "lessonMatch" || activityId === "abbrMatch") {
    const mode = state.wordMatch || {};
    return `${activityId}:${mode.matchedCount || 0}:${mode.remainingPairs?.length || 0}`;
  }
  if (activityId === "sentenceBank" || activityId === "shema") {
    const mode = state.sentenceBank || {};
    const question = mode.currentQuestion || {};
    return `${activityId}:${mode.currentRound || 0}:${mode.secondChanceCurrent || 0}:${question.sentence?.id || question.sentenceId || ""}:${question.locked ? 1 : 0}`;
  }
  if (activityId === "verbMatch") {
    const mode = state.match || {};
    return `${activityId}:${mode.currentVerb?.id || ""}:${mode.matchedCount || 0}`;
  }
  if (activityId === "advConj") {
    const mode = state.advConj || {};
    return `${activityId}:${mode.currentRound || 0}:${mode.secondChanceCurrent || 0}:${mode.currentQuestion?.id || mode.currentQuestion?.idiomId || ""}:${mode.currentQuestion?.locked ? 1 : 0}`;
  }
  if (activityId === "prepositions") {
    const mode = state.prepositions || {};
    return `${activityId}:${mode.currentRound || 0}:${mode.secondChanceCurrent || 0}:${mode.currentQuestion?.id || mode.currentQuestion?.triggerId || ""}:${mode.currentQuestion?.locked ? 1 : 0}`;
  }
  if (activityId === "binyanBoard") {
    const mode = state.binyanBoard || {};
    return `${activityId}:${mode.activeRootId || ""}:${mode.roundIndex || 0}:${mode.currentQuestion?.id || ""}:${mode.currentQuestion?.locked ? 1 : 0}`;
  }
  if (activityId === "handwriting") {
    const mode = state.handwriting || {};
    return `${activityId}:${mode.roundIndex || 0}:${mode.cellIndex || 0}:${mode.isResolving ? 1 : 0}`;
  }
  const question = state.currentQuestion || {};
  return `${activityId}:${state.lesson?.currentRound || 0}:${state.lesson?.secondChanceCurrent || 0}:${question.id || question.word?.id || ""}:${question.locked ? 1 : 0}`;
}

// The mission owns reactions while it runs; otherwise the free-play container
// does, so a Settings-chosen companion reacts during ordinary play too.
function getReactionContext() {
  const state = getState();
  if (state?.mission?.active) return state.mission;
  if (state?.lensCharacter && state.freePlay) return state.freePlay;
  return null;
}

function resetTransientReaction(context) {
  if (!context?.reactionTransient) return false;
  context.sprite = "neutral";
  context.dialogueKey = "";
  context.reactionTransient = false;
  context.reactionQuestionKey = "";
  saveState();
  return true;
}

character.clearTransientReaction = character.clearTransientReaction || function clearTransientReaction() {
  const changed = resetTransientReaction(getReactionContext());
  if (changed) character.renderCompanion();
  return changed;
};

// Streak reactions such as `fourRight` are deliberately non-transient, so a new
// free-play game has to clear them or the companion opens mid-celebration.
// A mission owns its own container and resets it per activity.
character.resetFreePlayReaction = character.resetFreePlayReaction || function resetFreePlayReaction() {
  const state = getState();
  const context = state?.freePlay;
  if (!context || state?.mission?.active) return false;
  context.correctStreak = 0;
  context.wrongStreak = 0;
  context.sprite = "neutral";
  context.dialogueKey = "";
  context.reactionTransient = false;
  context.reactionQuestionKey = "";
  saveState();
  character.renderCompanion();
  return true;
};

function observeQuestionChange(mission) {
  if (!mission?.reactionTransient) return;
  const currentKey = getQuestionStateKey();
  if (mission.reactionQuestionKey && currentKey && currentKey !== mission.reactionQuestionKey) {
    resetTransientReaction(mission);
  }
}

function scheduleTransientReactionCheck(expectedKey) {
  const runtime = getRuntime();
  runtime.global.setTimeout?.(() => {
    const context = getReactionContext();
    if (!context?.reactionTransient || context.reactionQuestionKey !== expectedKey) return;
    const currentKey = getQuestionStateKey();
    if (!currentKey || currentKey === expectedKey) return;
    resetTransientReaction(context);
    character.renderCompanion();
  }, 360);
}

function getCompanionBounds(companion) {
  const runtime = getRuntime();
  const rect = companion.getBoundingClientRect();
  const margin = 8;
  const topbarBottom = runtime.el?.shellTopbar?.getBoundingClientRect?.().bottom || margin;
  const navTop = runtime.el?.mobileBottomNav?.getBoundingClientRect?.().top || runtime.global.innerHeight;
  const minX = margin;
  const maxX = Math.max(minX, runtime.global.innerWidth - rect.width - margin);
  const minY = Math.max(margin, topbarBottom + margin);
  const maxY = Math.max(minY, navTop - rect.height - margin);
  return { minX, maxX, minY, maxY };
}

function clampCompanionPosition(companion, position) {
  const bounds = getCompanionBounds(companion);
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, Number(position?.x || 0))),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, Number(position?.y || 0))),
  };
}

function applyCompanionPosition(companion, context) {
  if (!companion || !context?.companionPosition) return;
  const clamped = clampCompanionPosition(companion, context.companionPosition);
  context.companionPosition = clamped;
  companion.style.left = `${clamped.x}px`;
  companion.style.top = `${clamped.y}px`;
  companion.style.right = "auto";
  companion.style.bottom = "auto";
}

character.renderCompanion = character.renderCompanion || function renderCompanion() {
  const runtime = getRuntime();
  const state = getState();
  const mission = state?.mission;
  const context = getReactionContext();
  const companion = runtime.el?.characterCompanion;
  if (!companion) return;
  const showDuringGame = Boolean(
    context &&
    state?.screen === "none" &&
    runtime.state?.route === "home" &&
    !(mission?.active && mission.onHub) &&
    app.session?.hasActiveLearnSession?.()
  );
  companion.classList.toggle("hidden", !showDuringGame);
  if (!showDuringGame) return;
  observeQuestionChange(context);

  const sprite = runtime.el?.characterCompanionSprite;
  const bubble = runtime.el?.characterCompanionBubble;
  const toggle = runtime.el?.characterVisibilityToggle;
  const visible = context.visible !== false;
  const frame = context.sprite || "neutral";

  companion.classList.toggle("character-companion--hidden", !visible);
  if (sprite) {
    sprite.dataset.character = getActiveCharacter()?.id || "";
    sprite.dataset.reaction = frame;
    sprite.setAttribute("aria-label", getActiveCharacter()?.nameEn || "");
    sprite.classList.toggle("hidden", !visible);
  }

  if (bubble) {
    bubble.innerHTML = "";
    const entry = context.dialogueKey ? getDialogue(context.dialogueKey) : null;
    bubble.classList.toggle("hidden", !visible || !entry);
    if (visible && entry) renderDialogue(bubble, entry, "character-companion-dialogue");
  }

  if (toggle) {
    const name = getActiveCharacter()?.nameEn || "";
    toggle.textContent = visible ? "hide" : "show";
    toggle.setAttribute("aria-label", `${visible ? "Hide" : "Show"} ${name}`.trim());
    toggle.setAttribute("aria-pressed", String(!visible));
  }
  if (!context.companionPosition) {
    companion.style.removeProperty("left");
    companion.style.removeProperty("top");
    companion.style.removeProperty("right");
    companion.style.removeProperty("bottom");
  } else {
    applyCompanionPosition(companion, context);
  }
};

// The free-play results screen shows the lens character reacting to how the
// game went. Missions render their own hero sprite in renderMissionResults.
character.renderResultsSprite = character.renderResultsSprite || function renderResultsSprite(target, options = {}) {
  if (!target) return false;
  target.querySelectorAll(".character-results-sprite").forEach((node) => node.remove());
  const state = getState();
  const runtime = getRuntime();
  if (!state?.lensCharacter || state.mission?.active) return false;
  if (runtime.state?.summary?.game === "characterMission") return false;
  const accuracy = Math.max(0, Math.min(100, Number(options.accuracy || 0)));
  const frame = options.perfect === true
    ? "celebrating"
    : accuracy < 50 ? "struggling" : "neutral";
  target.prepend(createSprite(frame, "character-results-sprite"));
  return true;
};

function formatTime(seconds) {
  const safe = Math.max(0, Math.round(Number(seconds || 0)));
  const minutes = Math.floor(safe / 60);
  return `${minutes}:${String(safe % 60).padStart(2, "0")}`;
}

function createMissionMetric(label, value) {
  const metric = global.document.createElement("div");
  metric.className = "mission-result-metric";
  const valueNode = global.document.createElement("strong");
  valueNode.textContent = value;
  const labelNode = global.document.createElement("span");
  labelNode.textContent = label;
  metric.append(valueNode, labelNode);
  return metric;
}

character.renderMissionResults = character.renderMissionResults || function renderMissionResults() {
  const runtime = getRuntime();
  const state = getState();
  if (runtime.state?.summary?.game !== "characterMission" || !runtime.el?.resultsSummary || !state?.mission) {
    return false;
  }
  const mission = state.mission;
  const results = [...mission.results, ...mission.skippedActivities];
  const played = mission.results;
  const correct = played.reduce((sum, result) => sum + result.correctCount, 0);
  const mistakes = played.reduce((sum, result) => sum + result.incorrectCount, 0);
  const attempts = correct + mistakes;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 100;
  const seconds = played.reduce((sum, result) => sum + result.elapsedSeconds, 0);

  runtime.el.resultsTitle.textContent = uiText("Mission complete", "המשימה הושלמה");
  runtime.el.resultsNote.textContent = uiText("Mission complete", "המשימה הושלמה");
  runtime.el.resultsSummary.innerHTML = "";
  runtime.el.resultsSummary.classList.add("mission-results-summary");

  const hero = global.document.createElement("section");
  hero.className = "mission-results-hero";
  const stats = global.document.createElement("div");
  stats.className = "mission-results-metrics";
  stats.append(
    createMissionMetric(uiText("Accuracy", "דיוק"), `${accuracy}%`),
    createMissionMetric(uiText("Correct", "נכון"), String(correct)),
    createMissionMetric(uiText("Mistakes", "טעויות"), String(mistakes)),
    createMissionMetric(uiText("Time", "זמן"), formatTime(seconds))
  );
  const portrait = global.document.createElement("div");
  portrait.className = "mission-results-character";
  renderDialogue(portrait, getDialogue("mission"), "mission-results-dialogue");
  portrait.append(createSprite("mission-complete", "mission-results-sprite"));
  hero.append(stats, portrait);

  const rows = global.document.createElement("section");
  rows.className = "mission-activity-results";
  const rowTitle = global.document.createElement("h3");
  rowTitle.textContent = uiText("Activities", "פעילויות");
  rows.append(rowTitle);
  results.forEach((result) => {
    const row = global.document.createElement("article");
    row.className = "mission-activity-row";
    const name = global.document.createElement("strong");
    name.textContent = isHebrewUi() ? result.nameHe : result.nameEn;
    const score = global.document.createElement("span");
    score.textContent = result.skipped
      ? uiText("Skipped · Hebrew voice unavailable", "דולג · אין קול עברי")
      : `${result.correctCount}/${result.correctCount + result.incorrectCount} · ${formatTime(result.elapsedSeconds)}`;
    row.append(name, score);
    rows.append(row);
  });

  const mistakeList = global.document.createElement("section");
  mistakeList.className = "mission-mistake-list";
  mistakeList.classList.toggle("hidden", !state.reviewOpen);
  if (state.reviewOpen) {
    const heading = global.document.createElement("h3");
    heading.textContent = uiText("Mistakes", "טעויות");
    mistakeList.append(heading);
    const allMistakes = played.flatMap((result) =>
      result.mistakes.map((item) => ({ ...item, activity: isHebrewUi() ? result.nameHe : result.nameEn }))
    );
    if (!allMistakes.length) {
      const empty = global.document.createElement("p");
      empty.textContent = uiText("No mistakes in this mission.", "אין טעויות במשימה הזאת.");
      mistakeList.append(empty);
    } else {
      allMistakes.forEach((item) => {
        const row = global.document.createElement("article");
        row.className = "mission-mistake-row";
        const primary = global.document.createElement("strong");
        primary.textContent = String(item.primary || item.activity || "");
        const secondary = global.document.createElement("span");
        secondary.textContent = [item.secondary, item.activity].filter(Boolean).join(" · ");
        row.append(primary, secondary);
        mistakeList.append(row);
      });
    }
  }

  runtime.el.resultsSummary.append(hero, rows, mistakeList);
  runtime.el.resultsContinueBtn.textContent = uiText("Continue to Free Play", "להמשיך למשחק חופשי");
  runtime.el.resultsReviewBtn.textContent = state.reviewOpen
    ? uiText("Hide mistakes", "להסתיר טעויות")
    : uiText("Review mistakes", "לעבור על טעויות");
  runtime.el.resultsReviewBtn.classList.remove("hidden");
  runtime.el.resultsHomeBtn.classList.add("hidden");
  runtime.el.resultsContinueBtn.parentElement?.classList.add("mission-results-actions");
  return true;
};

// The יאללה overlays are static markup in index.html, so they are re-pointed at
// whichever character is active. Scoped to those nodes on purpose: every other
// sprite is built by a renderer that already knows which character it is for,
// and a broader selector would overwrite them.
function syncStaticSprites() {
  const id = getActiveCharacter()?.id;
  if (!id) return;
  global.document?.querySelectorAll?.(".intro-character-sprite").forEach((node) => {
    node.dataset.character = id;
  });
}

character.renderBondPanel = character.renderBondPanel || function renderBondPanel() {
  const runtime = getRuntime();
  const target = runtime.el?.reviewCharacterBonds;
  if (!target) return;
  target.innerHTML = "";
  const lensId = getState()?.lensCharacter || "";

  character.getAllBondProgress().forEach((bond) => {
    const entry = getCharacterById(bond.id);
    if (!entry) return;
    const card = global.document.createElement("article");
    card.className = "character-bond-card";

    card.append(createSprite("neutral", "character-bond-sprite", bond.id));

    const body = global.document.createElement("div");
    body.className = "character-bond-body";

    const heading = global.document.createElement("div");
    heading.className = "character-bond-heading";
    const name = global.document.createElement("strong");
    name.textContent = characterName(entry);
    heading.append(name);
    if (bond.id === lensId) {
      const badge = global.document.createElement("span");
      badge.className = "character-bond-badge";
      badge.textContent = uiText("Companion", "דמות נוכחית");
      heading.append(badge);
    }

    const level = global.document.createElement("p");
    level.className = "character-bond-level";
    level.textContent = uiText(`Level ${bond.level}`, `רמה ${bond.level}`);

    const track = global.document.createElement("div");
    track.className = "character-bond-progress";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(bond.xpForNextLevel));
    track.setAttribute("aria-valuenow", String(bond.xpIntoLevel));
    const fill = global.document.createElement("span");
    const pct = bond.xpForNextLevel
      ? Math.min(100, Math.round((bond.xpIntoLevel / bond.xpForNextLevel) * 100))
      : 0;
    fill.style.width = `${pct}%`;
    track.append(fill);

    const stats = global.document.createElement("p");
    stats.className = "character-bond-stats";
    stats.textContent = uiText(
      `${bond.xpIntoLevel}/${bond.xpForNextLevel} XP · ${bond.daysInteracted} ${bond.daysInteracted === 1 ? "day" : "days"} together · ${bond.missions} ${bond.missions === 1 ? "mission" : "missions"}`,
      `${bond.xpIntoLevel}/${bond.xpForNextLevel} נק׳ · ${bond.daysInteracted} ימים יחד · ${bond.missions} משימות`
    );

    body.append(heading, level, track, stats);
    card.append(body);
    target.append(card);
  });
};

function normalizeCompletedResultsState() {
  const runtime = getRuntime();
  const state = getState();
  if (
    !state?.mission?.completed ||
    state.screen !== "results" ||
    runtime.state?.summary?.active === true ||
    runtime.state?.route === "results"
  ) {
    return false;
  }
  state.screen = "none";
  state.reviewOpen = false;
  saveState();
  return true;
}

character.render = character.render || function render() {
  normalizeCompletedResultsState();
  syncStaticSprites();
  character.renderScene();
  character.renderSettings();
  character.renderMissionHub();
  character.renderCompanion();
  character.renderMissionResults();
};

character.setGender = character.setGender || function setGender(value) {
  const state = getState();
  if (!state || (value !== "m" && value !== "f")) return;
  state.gender = value;
  saveState();
  getRuntime().helpers?.renderAll?.();
};

// Relationship progress. Stored under its own key because characterState is
// day-keyed and rebuilt whenever the local date changes.
const BOND_XP_PER_CORRECT = 1;
const BOND_XP_OWNED_MULTIPLIER = 2;
const BOND_XP_PER_MISSION = 40;
// Each level costs BOND_LEVEL_STEP more XP than the one before it.
const BOND_LEVEL_STEP = 60;

function createBondRecord(saved) {
  const days = Array.isArray(saved?.days)
    ? saved.days.map((day) => String(day || "")).filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day))
    : [];
  return {
    xp: Math.max(0, Math.round(Number(saved?.xp || 0))),
    missions: Math.max(0, Math.round(Number(saved?.missions || 0))),
    days: [...new Set(days)].sort(),
  };
}

function loadBonds() {
  const runtime = getRuntime();
  if (runtime.characterBonds) return runtime.characterBonds;
  const saved = runtime.storageApi?.loadJson?.(runtime.constants?.STORAGE_KEYS?.characterBond, {}) || {};
  const bonds = {};
  getCharacterIds().forEach((id) => {
    bonds[id] = createBondRecord(saved?.[id]);
  });
  runtime.characterBonds = bonds;
  return bonds;
}

function saveBonds() {
  const runtime = getRuntime();
  if (!runtime.characterBonds) return;
  runtime.storageApi?.saveJson?.(runtime.constants?.STORAGE_KEYS?.characterBond, runtime.characterBonds);
}

// Level N requires BOND_LEVEL_STEP * N(N+1)/2 total XP, so each level is a
// little harder to reach than the last.
function xpForLevel(level) {
  return BOND_LEVEL_STEP * ((level * (level + 1)) / 2);
}

character.getBondProgress = character.getBondProgress || function getBondProgress(characterId) {
  const record = loadBonds()[String(characterId || "")];
  if (!record) return null;
  let level = 0;
  while (record.xp >= xpForLevel(level + 1)) level += 1;
  const currentFloor = xpForLevel(level);
  const nextFloor = xpForLevel(level + 1);
  return {
    id: String(characterId),
    xp: record.xp,
    level,
    missions: record.missions,
    daysInteracted: record.days.length,
    xpIntoLevel: record.xp - currentFloor,
    xpForNextLevel: nextFloor - currentFloor,
  };
};

character.getAllBondProgress = character.getAllBondProgress || function getAllBondProgress() {
  return getCharacterIds()
    .map((id) => character.getBondProgress(id))
    .filter(Boolean);
};

function addBondXp(characterId, amount) {
  const id = String(characterId || "");
  if (!isCharacterChoice(id) || !(amount > 0)) return;
  const record = loadBonds()[id];
  if (!record) return;
  record.xp += Math.round(amount);
  const today = getTodayKey();
  if (!record.days.includes(today)) record.days.push(today);
  saveBonds();
}

// The answer hook only receives a boolean, so the item just answered is read
// back out of the running mode's state. Only the four routed kinds are covered;
// anything else reads as unowned, which costs a multiplier rather than the XP.
function getAnsweredRoutableItem() {
  const runtime = getRuntime();
  const state = runtime.state || {};
  const mode = getState()?.mission?.currentActivity ||
    (state.sentenceBank?.shemaMode ? "shema" : state.mode) || "";

  if (mode === "lessonMatch" || mode === "abbrMatch") {
    const matched = state.wordMatch?.matchedPairIds || [];
    const id = matched[matched.length - 1];
    if (!id) return null;
    if (mode === "lessonMatch") {
      return { kind: "vocab", item: app.data?.getWordById?.(id) || null };
    }
    return {
      kind: "abbreviation",
      item: (runtime.abbreviationDeck || []).find((entry) => entry.id === id) || null,
    };
  }
  if (mode === "sentenceBank" || mode === "shema") {
    return { kind: "sentence", item: state.sentenceBank?.currentQuestion?.sentence || null };
  }
  if (mode === "verbMatch") {
    const verb = state.match?.currentVerb;
    const id = verb?.id || verb?.word?.id || "";
    return id ? { kind: "verb", item: { id } } : null;
  }
  return null;
}

function lastAnswerWasOwnedContent() {
  const found = getAnsweredRoutableItem();
  if (!found?.item) return false;
  return ownsItem(getActiveRoute(), found.kind, found.item);
}

// Called for each correct answer while a character is the active lens. Their
// own material counts double so the relationship tracks shared subject matter,
// not just time on task.
function awardAnswerBond() {
  const id = getRoutingCharacterId();
  if (!isCharacterChoice(id)) return;
  const owned = lastAnswerWasOwnedContent();
  addBondXp(id, BOND_XP_PER_CORRECT * (owned ? BOND_XP_OWNED_MULTIPLIER : 1));
}

character.getLensCharacterId = character.getLensCharacterId || function getLensCharacterId() {
  return getState()?.lensCharacter || "";
};

character.canChangeLens = character.canChangeLens || function canChangeLens() {
  return getState()?.mission?.active !== true;
};

character.setLensCharacter = character.setLensCharacter || function setLensCharacter(characterId) {
  const state = getState();
  if (!state) return false;
  // A running mission owns the companion and the content bias; changing the
  // lens mid-mission would silently rewrite what the mission is drilling.
  if (!character.canChangeLens()) return false;
  const next = isCharacterChoice(characterId) ? String(characterId) : "";
  if (next === state.lensCharacter) return false;
  state.lensCharacter = next;
  resetTransientReaction(state.freePlay);
  saveState();
  getRuntime().helpers?.renderAll?.();
  return true;
};

character.chooseFreePlay = character.chooseFreePlay || function chooseFreePlay() {
  const state = getState();
  if (!state) return;
  state.dailyChoice = "free";
  state.screen = "none";
  state.mission = null;
  saveState();
  getRuntime().helpers?.renderAll?.();
};

character.chooseCharacter = character.chooseCharacter || function chooseCharacter(characterId) {
  const state = getState();
  if (!state?.gender || !isCharacterChoice(characterId)) return;
  state.pendingChoice = String(characterId);
  state.screen = "duration";
  saveState();
  getRuntime().helpers?.renderAll?.();
};

character.backToPicker = character.backToPicker || function backToPicker() {
  const state = getState();
  if (!state) return;
  state.pendingChoice = "";
  state.screen = "picker";
  saveState();
  getRuntime().helpers?.renderAll?.();
};

function buildItinerary(targetCount) {
  const speechSupported = app.speech?.isSupported?.() === true;
  const playable = [];
  const skipped = [];
  ACTIVITY_ORDER.forEach((activity) => {
    if (activity.id === "shema" && !speechSupported) {
      skipped.push({
        id: activity.id,
        nameEn: activity.nameEn,
        nameHe: activity.nameHe,
        correctCount: 0,
        incorrectCount: 0,
        elapsedSeconds: 0,
        mistakes: [],
        skipped: true,
      });
      return;
    }
    if (playable.length < targetCount) playable.push(activity.id);
  });
  return { playable, skipped };
}

character.chooseTier = character.chooseTier || function chooseTier(tierId) {
  const state = getState();
  const tier = TIERS[tierId];
  if (!state?.gender || !tier || !isCharacterChoice(state.pendingChoice)) return;
  const itinerary = buildItinerary(tier.count);
  state.dailyChoice = state.pendingChoice;
  state.hasChosen[state.pendingChoice] = true;
  // Today's character also becomes the free-play lens once the mission ends.
  state.lensCharacter = state.pendingChoice;
  state.pendingChoice = "";
  state.screen = "greeting";
  state.reviewOpen = false;
  state.mission = {
    active: true,
    completed: false,
    onHub: false,
    tier: tierId,
    activities: itinerary.playable,
    skippedActivities: itinerary.skipped,
    currentIndex: 0,
    currentActivity: "",
    results: [],
    correctStreak: 0,
    wrongStreak: 0,
    sprite: "neutral",
    dialogueKey: "",
    reactionTransient: false,
    reactionQuestionKey: "",
    visible: true,
    companionPosition: null,
    startedAt: Date.now(),
  };
  saveState();
  getRuntime().helpers?.renderAll?.();
};

character.continueScene = character.continueScene || function continueScene() {
  const state = getState();
  const mission = state?.mission;
  if (!state || !mission) return;
  if (state.screen === "greeting") {
    character.showMissionHub();
    return;
  }
  if (state.screen === "activityIntro") {
    character.startCurrentActivity();
    return;
  }
  if (state.screen === "perfect") {
    if (mission.currentIndex >= mission.activities.length) character.finishMission();
    else character.showMissionHub();
  }
};

function startGame(activityId) {
  const starters = {
    lessonMatch: () => {
      app.wordMatch?.startLessonMatch?.();
      app.wordMatch?.beginWordMatchFromIntro?.();
    },
    sentenceBank: () => {
      app.sentenceBank?.startSentenceBank?.();
      app.sentenceBank?.beginSentenceBankFromIntro?.();
    },
    shema: () => {
      app.sentenceBank?.startShema?.();
      app.sentenceBank?.beginSentenceBankFromIntro?.();
    },
    verbMatch: () => {
      app.verbMatch?.startVerbMatch?.();
      app.verbMatch?.beginVerbMatchFromIntro?.();
    },
    abbrMatch: () => {
      app.wordMatch?.startAbbrMatch?.();
      app.wordMatch?.beginWordMatchFromIntro?.();
    },
    advConj: () => {
      app.advConj?.startAdvConj?.();
      app.advConj?.beginAdvConjFromIntro?.();
    },
    prepositions: () => {
      app.prepositions?.startPrepositions?.();
      app.prepositions?.beginPrepositionsFromIntro?.();
    },
    binyanBoard: () => {
      app.binyanBoard?.startBinyanBoard?.();
      app.binyanBoard?.beginBinyanBoardFromIntro?.();
    },
    handwriting: () => {
      app.handwriting?.startHandwriting?.();
      app.handwriting?.beginHandwritingFromIntro?.();
    },
  };
  starters[activityId]?.();
}

character.startCurrentActivity = character.startCurrentActivity || function startCurrentActivity() {
  const runtime = getRuntime();
  const state = getState();
  const mission = state?.mission;
  const activityId = mission?.activities?.[mission.currentIndex];
  if (!activityId) {
    character.finishMission();
    return;
  }
  state.screen = "none";
  mission.onHub = false;
  mission.currentActivity = activityId;
  mission.correctStreak = 0;
  mission.wrongStreak = 0;
  mission.sprite = "neutral";
  mission.dialogueKey = "";
  mission.reactionTransient = false;
  mission.reactionQuestionKey = "";
  saveState();
  character.render();
  runtime.state.lastPlayedMode = activityId;
  runtime.state.mode = activityId === "shema" ? "sentenceBank" : activityId;
  startGame(activityId);
  runtime.helpers?.renderAll?.();
};

function normalizeActivityResult(config, activity) {
  return {
    id: activity.id,
    nameEn: activity.nameEn,
    nameHe: activity.nameHe,
    correctCount: Math.max(0, Number(config?.correctCount || 0)),
    incorrectCount: Math.max(0, Number(config?.incorrectCount || 0)),
    elapsedSeconds: Math.max(0, Number(config?.elapsedSeconds || 0)),
    mistakes: Array.isArray(config?.mistakes) ? config.mistakes : [],
    skipped: false,
  };
}

character.captureActivitySummary = character.captureActivitySummary || function captureActivitySummary(config) {
  const state = getState();
  const mission = state?.mission;
  if (!mission?.active || state.screen !== "none") return false;
  const activity = getActivity(mission.currentActivity);
  if (!activity) return false;

  const result = normalizeActivityResult(config, activity);
  mission.results.push(result);
  mission.currentIndex += 1;
  mission.currentActivity = "";
  if (result.incorrectCount === 0 && result.correctCount > 0) {
    state.screen = "perfect";
  } else if (mission.currentIndex < mission.activities.length) {
    state.screen = "none";
    mission.onHub = true;
  } else {
    character.finishMission();
    return true;
  }
  saveState();
  getRuntime().helpers?.renderAll?.();
  return true;
};

character.finishMission = character.finishMission || function finishMission() {
  const runtime = getRuntime();
  const state = getState();
  const mission = state?.mission;
  if (!mission) return;
  mission.active = false;
  mission.completed = true;
  mission.onHub = false;
  mission.visible = true;
  mission.sprite = "mission-complete";
  mission.dialogueKey = "mission";
  state.screen = "results";
  state.reviewOpen = false;
  const bonds = loadBonds()[state.dailyChoice];
  if (bonds) {
    bonds.missions += 1;
    addBondXp(state.dailyChoice, BOND_XP_PER_MISSION);
  }
  saveState();

  const correct = mission.results.reduce((sum, result) => sum + result.correctCount, 0);
  const incorrect = mission.results.reduce((sum, result) => sum + result.incorrectCount, 0);
  const elapsed = mission.results.reduce((sum, result) => sum + result.elapsedSeconds, 0);
  const mistakes = mission.results.flatMap((result) => result.mistakes);
  app.session?.showSessionSummary?.({
    game: "characterMission",
    correctCount: correct,
    incorrectCount: incorrect,
    elapsedSeconds: elapsed,
    mistakes,
  });
  runtime.state.route = "results";
};

character.reduceAnswerState = character.reduceAnswerState || function reduceAnswerState(current, isCorrect) {
  const correctStreak = Math.max(0, Number(current?.correctStreak || 0));
  const wrongStreak = Math.max(0, Number(current?.wrongStreak || 0));
  if (isCorrect) {
    if (wrongStreak >= 1) {
      return {
        correctStreak: 1,
        wrongStreak: 0,
        sprite: "celebrating",
        dialogueKey: "recovery",
        reactionTransient: false,
        reactionQuestionKey: "",
      };
    }
    const nextCorrect = correctStreak + 1;
    if (nextCorrect >= 4) {
      return {
        correctStreak: nextCorrect,
        wrongStreak: 0,
        sprite: "celebrating",
        dialogueKey: "fourRight",
        reactionTransient: false,
        reactionQuestionKey: "",
      };
    }
    // A recovery reaction holds through the rest of the streak and is replaced
    // by the four-in-a-row reaction rather than fading after one answer.
    const holdingRecovery = current?.dialogueKey === "recovery";
    return {
      correctStreak: nextCorrect,
      wrongStreak: 0,
      sprite: holdingRecovery ? "celebrating" : "neutral",
      dialogueKey: holdingRecovery ? "recovery" : "",
      reactionTransient: false,
      reactionQuestionKey: "",
    };
  }
  const nextWrong = wrongStreak + 1;
  if (nextWrong >= 4) {
    return {
      correctStreak: 0,
      wrongStreak: nextWrong,
      sprite: "struggling",
      dialogueKey: "fourWrong",
      reactionTransient: true,
      reactionQuestionKey: "",
    };
  }
  return {
    correctStreak: 0,
    wrongStreak: nextWrong,
    sprite: "nervous-laugh",
    dialogueKey: "oneWrong",
    reactionTransient: true,
    reactionQuestionKey: "",
  };
};

character.recordAnswer = character.recordAnswer || function recordAnswer(isCorrect) {
  if (character.checkDayRollover()) return;
  const context = getReactionContext();
  if (!context || getState()?.screen !== "none") return;
  const correct = isCorrect === true;
  Object.assign(context, character.reduceAnswerState(context, correct));
  if (context.reactionTransient) {
    context.reactionQuestionKey = getQuestionStateKey();
    scheduleTransientReactionCheck(context.reactionQuestionKey);
  }
  if (correct) awardAnswerBond();
  saveState();
  character.renderCompanion();
};

character.toggleVisibility = character.toggleVisibility || function toggleVisibility() {
  const context = getReactionContext();
  if (!context) return;
  context.visible = context.visible === false;
  saveState();
  character.renderCompanion();
};

function pauseMissionTimers() {
  const runtime = getRuntime();
  app.session?.stopVerbMatchTimer?.();
  app.session?.stopLessonTimer?.();
  app.session?.stopSentenceBankTimer?.();
  app.session?.stopAbbreviationTimer?.();
  app.session?.stopWordMatchTimer?.();
  app.binyanBoard?.stopBinyanBoardTimer?.();
  app.handwriting?.stopHandwritingTimer?.();
  ["advConj", "prepositions"].forEach((key) => {
    const mode = runtime.state?.[key];
    if (!mode?.timerId) return;
    runtime.global.clearInterval?.(mode.timerId);
    mode.timerId = null;
    if (mode.startMs) {
      mode.elapsedSeconds = Math.max(0, Math.floor((Date.now() - mode.startMs) / 1000));
    }
  });
}

function rebaseMissionTimer(activityId) {
  const runtime = getRuntime();
  const stateKey = {
    lessonMatch: "wordMatch",
    abbrMatch: "wordMatch",
    sentenceBank: "sentenceBank",
    shema: "sentenceBank",
    verbMatch: "match",
    advConj: "advConj",
    prepositions: "prepositions",
    binyanBoard: "binyanBoard",
    handwriting: "handwriting",
  }[activityId];
  const mode = runtime.state?.[stateKey];
  if (mode?.active && Number.isFinite(Number(mode.elapsedSeconds))) {
    mode.startMs = Date.now() - Math.max(0, Number(mode.elapsedSeconds || 0)) * 1000;
  }
}

function setRuntimeModeForActivity(activityId) {
  const runtime = getRuntime();
  runtime.state.lastPlayedMode = activityId;
  runtime.state.mode = activityId === "shema" ? "sentenceBank" : activityId;
  runtime.state.route = "home";
}

character.showMissionHub = character.showMissionHub || function showMissionHub(targetRoute = "home") {
  const runtime = getRuntime();
  const state = getState();
  const mission = state?.mission;
  if (!mission?.active) return false;
  if (app.session?.hasActiveLearnSession?.()) {
    pauseMissionTimers();
  }
  state.screen = "none";
  mission.onHub = true;
  runtime.state.route = ["home", "review", "settings"].includes(targetRoute) ? targetRoute : "home";
  if (runtime.state.route === "home") {
    runtime.state.mode = "home";
  }
  saveState();
  runtime.helpers?.renderAll?.();
  return true;
};

character.openMissionActivity = character.openMissionActivity || function openMissionActivity(activityId) {
  const runtime = getRuntime();
  const state = getState();
  const mission = state?.mission;
  const expectedActivityId = mission?.activities?.[mission.currentIndex];
  if (!mission?.active || activityId !== expectedActivityId) return false;

  mission.onHub = false;
  if (mission.currentActivity === activityId && app.session?.hasActiveLearnSession?.()) {
    state.screen = "none";
    setRuntimeModeForActivity(activityId);
    rebaseMissionTimer(activityId);
    app.session?.resumeActiveTimers?.();
  } else {
    mission.currentActivity = "";
    state.screen = "activityIntro";
    runtime.state.route = "home";
    runtime.state.mode = "home";
  }
  saveState();
  runtime.helpers?.renderAll?.();
  return true;
};

character.handleNavigation = character.handleNavigation || function handleNavigation(route) {
  if (character.isMissionActive()) return character.showMissionHub(route);
  const state = getState();
  if (state?.mission?.completed && state.screen === "results" && route !== "results") {
    state.screen = "none";
    state.reviewOpen = false;
    saveState();
  }
  return false;
};

function moveCompanionDrag(event) {
  if (!activeCompanionDrag || event.pointerId !== activeCompanionDrag.pointerId) return;
  event.preventDefault?.();
  const companion = activeCompanionDrag.companion;
  const position = clampCompanionPosition(companion, {
    x: event.clientX - activeCompanionDrag.offsetX,
    y: event.clientY - activeCompanionDrag.offsetY,
  });
  companion.style.left = `${position.x}px`;
  companion.style.top = `${position.y}px`;
  companion.style.right = "auto";
  companion.style.bottom = "auto";
  const context = getReactionContext();
  if (context) context.companionPosition = position;
}

function finishCompanionDrag(event) {
  if (!activeCompanionDrag || event.pointerId !== activeCompanionDrag.pointerId) return;
  const { companion, sprite, pointerId } = activeCompanionDrag;
  sprite?.releasePointerCapture?.(pointerId);
  companion.classList.remove("is-dragging");
  global.removeEventListener?.("pointermove", moveCompanionDrag);
  global.removeEventListener?.("pointerup", finishCompanionDrag);
  global.removeEventListener?.("pointercancel", finishCompanionDrag);
  activeCompanionDrag = null;
  saveState();
}

character.startCompanionDrag = character.startCompanionDrag || function startCompanionDrag(event) {
  const runtime = getRuntime();
  const context = getReactionContext();
  const companion = runtime.el?.characterCompanion;
  const sprite = runtime.el?.characterCompanionSprite;
  if (!context || context.visible === false || !companion || !sprite || event.button > 0) return;
  event.preventDefault?.();
  const rect = companion.getBoundingClientRect();
  activeCompanionDrag = {
    companion,
    sprite,
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  companion.classList.add("is-dragging");
  sprite.setPointerCapture?.(event.pointerId);
  global.addEventListener?.("pointermove", moveCompanionDrag, { passive: false });
  global.addEventListener?.("pointerup", finishCompanionDrag);
  global.addEventListener?.("pointercancel", finishCompanionDrag);
};

character.handleResultsContinue = character.handleResultsContinue || function handleResultsContinue() {
  const runtime = getRuntime();
  const state = getState();
  if (runtime.state?.summary?.game !== "characterMission" || !state) return false;
  app.session?.clearSummaryState?.();
  state.screen = "none";
  state.reviewOpen = false;
  runtime.state.mode = "home";
  runtime.state.route = "home";
  saveState();
  runtime.helpers?.renderAll?.();
  return true;
};

character.handleResultsReview = character.handleResultsReview || function handleResultsReview() {
  const runtime = getRuntime();
  const state = getState();
  if (runtime.state?.summary?.game !== "characterMission" || !state) return false;
  state.reviewOpen = !state.reviewOpen;
  saveState();
  runtime.helpers?.renderAll?.();
  return true;
};

character.getActivityOrder = character.getActivityOrder || function getActivityOrder() {
  return ACTIVITY_ORDER.map((activity) => ({ ...activity }));
};

character.getTodayKey = character.getTodayKey || getTodayKey;

})(typeof window !== "undefined" ? window : globalThis);

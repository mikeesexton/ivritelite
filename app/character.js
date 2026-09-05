(function initIvriQuestCharacter(global) {
"use strict";

const app = global.IvriQuestApp = global.IvriQuestApp || {};
const character = app.character = app.character || {};

// `beatRounds` is what one beat of this mode asks for in its own unit (pairs,
// rounds, questions, roots, sentences). `beatCost` is roughly how many answers
// that works out to, which is the unit the tier budget is spent in — they differ
// because a "round" is not the same size in every mode.
//
// `atomic` marks the three modes a beat cannot subdivide: verbMatch is one verb
// but a whole paradigm, handwriting is one traced sentence, and binyanBoard has
// to show its root grid to be itself.
//
// `family` is what a beat feels like, which is coarser than its id. sentenceBank
// and shema are the same chip-building interaction read versus heard, and
// lessonMatch and abbrMatch are the same matching board over different decks —
// so back to back they read as one long block even though the ids differ.
// Atomic modes each get their own family, which is what lets them be inserted
// later without checking for a clash.
const ACTIVITY_ORDER = Object.freeze([
  { id: "lessonMatch", family: "match", nameEn: "Vocabulary", nameHe: "אוצר מילים", intro: "vocabulary", beatRounds: 5, beatCost: 5 },
  { id: "sentenceBank", family: "sentence", nameEn: "Sentences", nameHe: "משפטים", intro: "sentences", beatRounds: 4, beatCost: 4 },
  { id: "shema", family: "sentence", nameEn: "Shema", nameHe: "שמע", intro: "listening", beatRounds: 3, beatCost: 3 },
  { id: "verbMatch", family: "verbMatch", nameEn: "Conjugation", nameHe: "נטיות", intro: "conjugation", beatRounds: 1, beatCost: 18, atomic: true },
  { id: "abbrMatch", family: "match", nameEn: "Abbreviations", nameHe: "קיצורים", intro: "abbreviations", beatRounds: 5, beatCost: 5 },
  { id: "advConj", family: "conjugation", nameEn: "Conjugation+", nameHe: "נטיות+", intro: "advConj", beatRounds: 4, beatCost: 4 },
  { id: "prepositions", family: "prepositions", nameEn: "Prepositions", nameHe: "מילות יחס", intro: "prepositions", beatRounds: 4, beatCost: 4 },
  { id: "binyanBoard", family: "binyan", nameEn: "Binyanim", nameHe: "בניינים", intro: "binyanim", beatRounds: 2, beatCost: 11, atomic: true },
  { id: "handwriting", family: "handwriting", nameEn: "Handwriting", nameHe: "כתב יד", intro: "handwriting", beatRounds: 1, beatCost: 14, atomic: true },
]);

// A tier is a question budget now, not a count of distinct modes. `count` is
// kept only so a mission saved before this change still sanitizes.
const TIERS = Object.freeze({
  short: { count: 3, budget: 18, labelEn: "Short", labelHe: "קצר" },
  medium: { count: 5, budget: 36, labelEn: "Medium", labelHe: "בינוני" },
  full: { count: 9, budget: 70, labelEn: "Full", labelHe: "מלא" },
});

// No single beat may take more than this share of a mission. It is what keeps
// the long atomic modes out of a short session by arithmetic instead of a
// hand-maintained eligibility list that would drift from the costs above.
const MAX_BEAT_SHARE = 0.4;
// One long atomic beat earns its place per this much budget.
const ATOMIC_BUDGET_PER_SLOT = 35;
// A mission opens on one of these: a cheap, familiar win rather than whatever
// the shuffle happened to put first.
const OPENING_ACTIVITIES = Object.freeze(["lessonMatch", "sentenceBank"]);
// Modes whose second-chance queue survives leaving its beat. binyanBoard is
// deliberately absent: its queue holds bare formIds that only resolve against
// the root deck built for that one beat, so a deferred entry would silently fail
// to rebuild. It keeps reviewing in-beat, which is fine — it appears at most
// once in a mission.
// The bonfire fires on the same streak that already turns the companion to
// `struggling`, so the two never disagree about when things have gone wrong.
const DEATH_WRONG_STREAK = 4;
const REPAIRABLE_MODES = Object.freeze(["sentenceBank", "shema", "advConj", "prepositions"]);
// Every beat finishing instantly means starved decks, not progress. Past this
// many chained starts the mission falls back to the hub rather than recursing.
const MAX_BEAT_CHAIN_DEPTH = 30;

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
    // The selection being made on the focus screen, before a tier exists to
    // hang a mission off. It is cleared the moment the mission takes a copy.
    pendingFocus: [],
    // The free-play lens outlives the day-keyed mission state deliberately.
    lensCharacter: isCharacterChoice(saved?.lensCharacter) ? saved.lensCharacter : "",
    // So does the topic selection, for the same reason.
    topics: sanitizeTopicMap(saved?.topics),
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

// Group ids the named character actually offers, in the registry's own order so
// a hand-edited save cannot reorder the picker. An unrecognised id is dropped
// rather than rejected: a group renamed in a later release would otherwise strand
// a mid-day save on a screen it cannot leave.
// A mission needs at least this many topics. Measured rather than chosen: the
// thinnest legal pick in the cast is 105 cards, so a learner meets their chosen
// words about once a week, which is the spaced-repetition scheduler working
// rather than a starved pool. The old 250-card depth floor guarded against
// *unwanted* repetition under a lens nobody picked; an explicit selection
// retires that concern.
const MIN_FOCUS_TOPICS = 3;

// Topic ids the named character actually offers, across both tiers, in the
// order the picker shows them so a hand-edited save cannot reorder it. An
// unrecognised id is dropped rather than rejected: a topic renamed in a later
// release would otherwise strand a saved selection.
function sanitizeFocus(characterId, focus) {
  const topics = getCharacterData().getTopicsFor?.(characterId) || [];
  if (!topics.length || !Array.isArray(focus)) return [];
  const wanted = focus.map((id) => String(id || ""));
  return topics.filter((topic) => wanted.includes(topic.id)).map((topic) => topic.id);
}

function allFocusIds(characterId) {
  return (getCharacterData().getTopicsFor?.(characterId) || []).map((topic) => topic.id);
}

// What the picker opens with when the learner has never chosen for this
// character: their own specialist topics, plus the everyday topics that should
// be on by default. Deliberately a real selection rather than everything,
// because "everything" is the whole 2,206-card deck and defeats the point of
// choosing.
//
// `safety` is in here to keep a course policy true: every resident drills the
// everyday security tier. It used to hold by being routed to all five
// characters, which is also what made it unnarrowable and let it swallow
// 42-45% of a narrowed draw. Defaulting it on preserves the policy while
// leaving the learner free to turn it off.
const DEFAULT_SHARED_TOPICS = Object.freeze(["core", "home", "safety"]);

function defaultFocusIds(characterId) {
  const own = (getCharacterData().getFocusGroups?.(characterId) || []).map((topic) => topic.id);
  return sanitizeFocus(characterId, [...own, ...DEFAULT_SHARED_TOPICS]);
}

function sanitizeTopicMap(saved) {
  const map = {};
  if (!saved || typeof saved !== "object") return map;
  getCharacterIds().forEach((id) => {
    const picked = sanitizeFocus(id, saved[id]);
    if (picked.length) map[id] = picked;
  });
  return map;
}

// The learner's standing choice for a character, or the default. Persistent, so
// it survives the day rollover the way `lensCharacter` does — re-picking three
// topics every morning would be tedious, and the Review surface that edits it
// has no day-scoped home to live in.
function getStoredFocus(characterId) {
  const stored = getState()?.topics?.[String(characterId || "")];
  return stored?.length ? stored : defaultFocusIds(characterId);
}

// A beat is one short visit to a mode. `rounds: 0` means "use the mode's own
// default length", which is what a migrated pre-beats save gets so that the
// itinerary it describes still plays at exactly the length it was saved at.
function sanitizeBeats(mission) {
  const known = (mode) => ACTIVITY_ORDER.some((activity) => activity.id === mode);
  if (Array.isArray(mission?.beats)) {
    return mission.beats
      .map((beat) => ({
        mode: String(beat?.mode || ""),
        rounds: Math.max(0, Math.floor(Number(beat?.rounds) || 0)),
        ...(beat?.repair === true ? { repair: true } : {}),
      }))
      .filter((beat) => known(beat.mode));
  }
  return Array.isArray(mission?.activities)
    ? mission.activities
      .map((id) => ({ mode: String(id || ""), rounds: 0 }))
      .filter((beat) => known(beat.mode))
    : [];
}

// Read sites go through this rather than `mission.beats` directly. The mission
// tests assign `runtime.characterState` without passing it through
// `sanitizeMission`, so a mission reaching a renderer may still carry the
// pre-beats shape.
function getBeats(mission) {
  return Array.isArray(mission?.beats) ? mission.beats : sanitizeBeats(mission);
}

function sanitizeMission(mission) {
  if (!mission || typeof mission !== "object") return null;
  const beats = sanitizeBeats(mission);
  return {
    ...createReactionContainer(mission),
    active: mission.active === true,
    completed: mission.completed === true,
    onHub: mission.onHub === true,
    tier: TIERS[mission.tier] ? mission.tier : "short",
    focus: sanitizeFocus(mission.characterId, mission.focus),
    // Which character's groups `focus` was sanitized against. `dailyChoice` says
    // the same thing today, but it lives one level up and is cleared on some
    // paths before the mission is, and a focus list read against the wrong cast
    // would silently sanitize to empty.
    characterId: isCharacterChoice(mission.characterId) ? String(mission.characterId) : "",
    beats,
    skippedActivities: Array.isArray(mission.skippedActivities)
      ? mission.skippedActivities.map(sanitizeResult)
      : [],
    currentIndex: Math.min(Math.max(0, Number(mission.currentIndex || 0)), beats.length),
    currentActivity: String(mission.currentActivity || ""),
    results: Array.isArray(mission.results) ? mission.results.map(sanitizeResult) : [],
    repairQueue: Array.isArray(mission.repairQueue)
      ? mission.repairQueue
        .filter((row) => REPAIRABLE_MODES.includes(String(row?.mode || "")) && row?.entry)
        .map((row) => ({ mode: String(row.mode), entry: row.entry }))
      : [],
    repairAppended: mission.repairAppended === true,
    deaths: Math.max(0, Number(mission.deaths || 0)),
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
  state.topics = sanitizeTopicMap(saved?.topics);
  state.pendingFocus = sanitizeFocus(state.pendingChoice, saved?.pendingFocus);
  state.lensCharacter = isCharacterChoice(saved?.lensCharacter) ? saved.lensCharacter : "";
  // "perfect" was its own blocking scene before flawless rounds folded into the
  // results screen; a save still carrying it falls through to "none".
  state.screen = ["picker", "focus", "duration", "greeting", "activityIntro", "quitConfirm", "death", "results", "none"].includes(saved?.screen)
    ? saved.screen
    : (state.dailyChoice ? "none" : "picker");
  state.reviewOpen = saved?.reviewOpen === true;
  state.mission = sanitizeMission(saved?.mission);
  // The quit prompt only exists on top of a running mission; without one it
  // would block the app on a scene whose buttons have nothing to act on.
  if ((state.screen === "quitConfirm" || state.screen === "death") && !state.mission?.active) {
    state.screen = "none";
  }
  if (isCharacterChoice(state.dailyChoice) && !state.mission) {
    state.dailyChoice = "";
    state.screen = "picker";
  }
  if ((state.screen === "duration" || state.screen === "focus") && !state.pendingChoice) {
    state.screen = "picker";
  }
  // A restore mid-flow with nothing checked would show a dead Continue button,
  // so re-seed from the learner's standing choice the way chooseCharacter does.
  if ((state.screen === "focus" || state.screen === "duration") && !state.pendingFocus.length) {
    state.pendingFocus = getStoredFocus(state.pendingChoice);
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
    } else if (action === "focusGroup") {
      character.toggleFocusGroup(button.dataset.focusGroup);
    } else if (action === "confirmFocus") {
      character.confirmFocus();
    } else if (action === "tier") {
      character.chooseTier(button.dataset.tier);
    } else if (action === "continue") {
      character.continueScene();
    } else if (action === "keepGoing") {
      character.cancelQuitMission();
    } else if (action === "quitMission") {
      character.confirmQuitMission();
    } else if (action === "respawn") {
      character.respawnAtBeat();
    }
  });

  runtime.el?.characterMissionHub?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("[data-mission-beat]");
    if (!button || button.disabled) return;
    character.openMissionBeat(button.dataset.missionBeat);
  });
  runtime.el?.characterVisibilityToggle?.addEventListener("click", () => character.toggleVisibility());
  runtime.el?.characterQuitMission?.addEventListener("click", () => character.requestQuitMission());
  runtime.el?.characterCompanionSprite?.addEventListener("pointerdown", (event) => character.startCompanionDrag(event));
  runtime.el?.characterGenderToggle?.addEventListener("click", () => {
    const state = getState();
    character.setGender(state?.gender === "m" ? "f" : "m");
  });

  const bindLensPicker = (container) => {
    container?.addEventListener("click", (event) => {
      const topicRow = event.target?.closest?.("[data-topic-id]");
      if (topicRow && !topicRow.disabled) {
        character.toggleCharacterTopic(topicRow.dataset.topicCharacter, topicRow.dataset.topicId);
        return;
      }
      const option = event.target?.closest?.("[data-character-lens]");
      if (!option || option.disabled) return;
      character.setLensCharacter(option.dataset.characterLens);
    });
  };
  bindLensPicker(runtime.el?.characterLensOptions);
  bindLensPicker(runtime.el?.reviewCharacterBonds);

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
  return ["picker", "focus", "duration", "greeting", "activityIntro", "quitConfirm", "death"].includes(getState()?.screen);
};

// The beat a mode should size itself to right now, or null when no mission is
// running (free play) or the running beat is not for the mode that is asking.
// `rounds: 0` means the mode keeps its own default length.
character.getActiveBeat = character.getActiveBeat || function getActiveBeat() {
  const mission = getState()?.mission;
  if (!mission?.active) return null;
  const beats = getBeats(mission);
  const beat = beats[mission.currentIndex];
  if (!beat || beat.mode !== mission.currentActivity) return null;
  return {
    mode: beat.mode,
    rounds: beat.rounds,
    repair: beat.repair === true,
    index: mission.currentIndex,
    total: beats.length,
  };
};

character.isMissionActive = character.isMissionActive || function isMissionActive() {
  return getState()?.mission?.active === true;
};

// Share of a mission's draw that should come from the active character's own
// material, per docs/character-gameplay-strategy.md.
const TARGET_OWNED_SHARE = 0.65;

// Which topics are steering the draw right now. A running mission uses the
// snapshot it took at start, so editing the standing selection cannot shift the
// deck under a mission in progress. Off-mission the standing selection applies,
// which is what makes the Review and Settings surfaces mean anything for free
// play. No character lens at all means no selection and the whole course.
function getActiveFocus() {
  const state = getState();
  const mission = state?.mission;
  if (mission?.active) return Array.isArray(mission.focus) ? mission.focus : [];
  const id = getRoutingCharacterId();
  return getCharacterById(id) ? getStoredFocus(id) : [];
}

function getActiveRoute() {
  const id = getRoutingCharacterId();
  const route = getCharacterById(id)?.route || null;
  if (!route) return null;
  // Rewriting the route rather than the predicate keeps topics out of
  // characterData.ownsItem, which scripts/character-content-report.js shares:
  // the report must keep measuring authored ownership.
  return getCharacterData().applyTopicsToRoute?.(id, route, getActiveFocus()) || route;
}

// A vocabulary card the learner did not ask for. The selection *is* the pool:
// the two topic tiers name all 42 categories between them, so anything unselected
// is out, and a card is kept only by its category being selected or by a selected
// topic naming it in `words`. That totality is the point — it is what stopped the
// 70-card cast-wide safety shelf holding its full size while a narrowed pool
// shrank around it and swallowing 42-45% of the draw.
//
// Vocabulary only. Sentences carry no topic field, so steering them is a weight
// and never a filter: getRoundTarget measures the unfiltered deck and
// buildCandidatePairs falls back to the full allowed set, so fencing a register
// bank would serve the same sentence twice in one session.
character.isOutsideFocus = character.isOutsideFocus || function isOutsideFocus(kind, item) {
  if (kind !== "vocab" || !item) return false;
  const id = getRoutingCharacterId();
  if (!getCharacterById(id)) return false;
  const focus = getActiveFocus();
  if (!focus.length) return false;
  const data = getCharacterData();
  if (data.resolveTopicCategories?.(id, focus)?.has(String(item.category || ""))) return false;
  // A selected topic may claim a card that lives on an unselected shelf; those
  // are named by `he`, because vocabulary ids embed a positional index.
  return data.resolveTopicWords?.(id, focus)?.has(String(item.he || "")) !== true;
};

// Same contract as filterWithheldContent: a hard pool filter applied before the
// due/fresh split, never a weight of zero, which app/utils.js would ignore.
character.filterOutsideFocus = character.filterOutsideFocus || function filterOutsideFocus(kind, items, options = {}) {
  if (kind !== "vocab" || !Array.isArray(items) || !items.length) return items;
  const resolve = typeof options.getItem === "function" ? options.getItem : (entry) => entry;
  const kept = items.filter((entry) => !character.isOutsideFocus(kind, resolve(entry)));
  // The unrouted shelves and the cast-wide tier are never fenced, so this cannot
  // empty a real pool. Returning the input if it somehow did keeps the same
  // no-starvation guarantee the withholding layer documents.
  return kept.length ? kept : items;
};

// Delegated to app/character-data.js so this module, the content report, and the
// audience derivation cannot disagree about who owns what.
function ownsItem(route, kind, item) {
  return getCharacterData().ownsItem?.(route, kind, item) === true;
}

// Content strongly coded to one character is withheld from the rest, including
// adaptive review. Free play draws the whole course: an empty routing id means
// no lens, and choosing a lens is deliberate.
character.isContentWithheld = character.isContentWithheld || function isContentWithheld(kind, item) {
  // Must name a real character, not merely be non-empty: `dailyChoice` carries
  // the "free" sentinel on a free-play day, the same reason getActiveRoute
  // resolves through the registry rather than trusting the id.
  const id = getRoutingCharacterId();
  if (!getCharacterById(id)) return false;
  const audience = getCharacterData().getItemAudience?.(kind, item);
  return Array.isArray(audience) && !audience.includes(id);
};

// A hard pool filter rather than a weight of zero. `app/utils.js` treats a
// zero-weight list as unweighted — `weightedRandomWord` falls back to a uniform
// pick over everything when the total weight is zero, and `pickWeightedSubset`
// re-draws until it has its count — so a zero weight is a preference here, not a
// fence. Filtering also keeps withheld rows out of the due/fresh split and out
// of the denominator `buildContentWeigher` solves the boost from.
//
character.filterWithheldContent = character.filterWithheldContent || function filterWithheldContent(kind, items, options = {}) {
  if (!Array.isArray(items) || !items.length || !getCharacterById(getRoutingCharacterId())) return items;
  const resolve = typeof options.getItem === "function" ? options.getItem : (entry) => entry;
  return items.filter((entry) => !character.isContentWithheld(kind, resolve(entry)));
};

character.getContentWeight = character.getContentWeight || function getContentWeight(kind, item) {
  return ownsItem(getActiveRoute(), kind, item) ? 2 : 1;
};

// How strongly a focus-matched sentence outweighs an unmatched one, and how many
// distinct group words are allowed to count. The bias is graded rather than
// binary because the evidence is graded: a row using three mysticism words is
// unmistakably Inbal's mystical half, while a row using one word off the
// "Scientific & Analytical" shelf may only be using it in its ordinary office
// sense — that shelf carries ישיבה ("work meeting"), צוות ("team") and דוח
// ("report") alongside the research register. One hit is a nudge; three is a
// statement.
const FOCUS_SENTENCE_BIAS = 0.6;
const FOCUS_SENTENCE_HIT_CAP = 3;

// sentenceId -> (vocabulary category -> how many distinct cards from it the
// sentence uses). Derived, never authored: a sentence carries no topic field, and
// docs/project-rules.md forbids adding one, so the relationship is read off the
// vocabulary the sentence actually contains. This is the same "exact support"
// relationship docs/character-gameplay-strategy.md already reports tranche by
// tranche, and scripts/content-coverage-report.js measures with the same matcher.
//
// Built once, lazily, from an index keyed on each headword's first word: the
// naive pass is 1,254 sentences x 2,206 cards, and indexed it lands in single-digit
// milliseconds.
function getSentenceTopicIndex() {
  const runtime = getRuntime();
  if (runtime.characterSentenceTopics !== undefined) return runtime.characterSentenceTopics;
  const deck = runtime.sentenceBankDeck;
  const vocabulary = runtime.baseVocabulary;
  const hebrewApi = app.hebrew;
  if (!Array.isArray(deck) || !Array.isArray(vocabulary) || !hebrewApi?.normalizeHeadwordText) {
    // The picker tests load character.js without the content decks. No index
    // means no sentence bias, which is the correct neutral answer.
    runtime.characterSentenceTopics = null;
    return null;
  }

  const byFirstWord = new Map();
  vocabulary.forEach((word) => {
    const parts = hebrewApi.normalizeHeadwordText(word?.he).split(" ").filter(Boolean);
    if (!parts.length) return;
    if (!byFirstWord.has(parts[0])) byFirstWord.set(parts[0], []);
    byFirstWord.get(parts[0]).push({ parts, category: word.category, he: word.he });
  });

  const index = new Map();
  deck.forEach((sentence) => {
    const words = hebrewApi.normalizeHeadwordText(sentence?.hebrew).split(" ").filter(Boolean);
    const seen = new Map();
    words.forEach((surface, position) => {
      hebrewApi.headwordIndexKeys(surface).forEach((key) => {
        (byFirstWord.get(key) || []).forEach((candidate) => {
          if (words.length - position < candidate.parts.length) return;
          const matches = candidate.parts.every(
            (part, offset) => hebrewApi.headwordSurfaceMatches(words[position + offset], part),
          );
          if (!matches) return;
          if (!seen.has(candidate.category)) seen.set(candidate.category, new Set());
          seen.get(candidate.category).add(candidate.he);
        });
      });
    });
    if (!seen.size) return;
    const counts = new Map();
    seen.forEach((cards, category) => counts.set(category, cards.size));
    index.set(String(sentence.id || ""), counts);
  });
  runtime.characterSentenceTopics = index;
  return index;
}

// Distinct cards a sentence uses from the checked groups, capped. Zero means the
// row carries no evidence either way, which is the common case: coverage is
// partial by construction and a row with no vocabulary anchor simply gets no bias.
function getSentenceFocusHits(item) {
  const index = getSentenceTopicIndex();
  if (!index) return 0;
  const counts = index.get(String(item?.id || ""));
  if (!counts) return 0;
  const id = getRoutingCharacterId();
  const focus = getActiveFocus();
  if (!focus.length) return 0;
  const topics = getCharacterData().getTopicsFor?.(id) || [];
  if (!topics.length || focus.length === topics.length) return 0;
  let best = 0;
  topics.forEach((topic) => {
    if (!focus.includes(topic.id)) return;
    let hits = 0;
    topic.categories.forEach((category) => {
      hits += counts.get(category) || 0;
    });
    if (hits > best) best = hits;
  });
  return Math.min(best, FOCUS_SENTENCE_HIT_CAP);
}

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
  if (kind !== "sentence") return (entry) => (isOwned(entry) ? boost : 1);

  // Sentences are biased, never filtered: getRoundTarget measures the unfiltered
  // deck and always asks for LESSON_ROUNDS rounds, and buildCandidatePairs falls
  // back to the full allowed set, so fencing a register bank would serve the same
  // row twice in one session.
  //
  // The factor is normalized to average 1 across the owned subset, so the owned
  // share still lands on TARGET_OWNED_SHARE exactly as the test above it asserts.
  // Focus redistributes weight *inside* the character's own bank rather than
  // taking any from the shared tier.
  // Memoized on the sentence id rather than on the entry object. The pair
  // wrappers are rebuilt per draw, and an identity key would silently fall back
  // to a neutral factor for any caller that did not hand back the very same
  // objects — a bias that quietly does nothing is worse than none.
  const factorById = new Map();
  const factorFor = (entry) => {
    const item = resolve(entry);
    const id = String(item?.id || "");
    if (factorById.has(id)) return factorById.get(id);
    const factor = 1 + FOCUS_SENTENCE_BIAS * getSentenceFocusHits(item);
    factorById.set(id, factor);
    return factor;
  };

  let total = 0;
  let ownedSeen = 0;
  items.forEach((entry) => {
    if (!isOwned(entry)) return;
    total += factorFor(entry);
    ownedSeen += 1;
  });
  const mean = ownedSeen ? total / ownedSeen : 0;
  if (!mean) return (entry) => (isOwned(entry) ? boost : 1);
  return (entry) => (isOwned(entry) ? boost * (factorFor(entry) / mean) : 1);
};

function getDialogue(key, characterId) {
  const table = (characterId ? getCharacterById(characterId) : getActiveCharacter())?.dialogue || {};
  const shared = getCharacterData().SHARED_DIALOGUE || {};
  const suffix = getState()?.gender === "f" ? "F" : "M";
  const fallbackKey = getCharacterData().DIALOGUE_FALLBACKS?.[key];
  return table[key + suffix] ||
    table[key] ||
    (fallbackKey ? table[fallbackKey + suffix] || table[fallbackKey] : null) ||
    shared[key + suffix] ||
    shared[key] ||
    null;
}

function renderDialogue(target, entry, className = "character-dialogue") {
  if (!target || !entry) return null;
  const wrap = global.document.createElement("div");
  wrap.className = `${className}-wrap`;

  const line = global.document.createElement("p");
  line.className = className;
  line.dir = "rtl";

  // The optional trailing geresh keeps loanwords whose affricate sits at the end
  // of the word — פיץ׳, בראנץ׳ — in one token, so their gloss keys still match.
  // A medial geresh or gershayim (הרמ״ט, ג׳ינס) is covered by the inner group.
  const pattern = /[א-ת]+(?:[׳״"'][א-ת]+)*[׳״]?/g;
  let lastIndex = 0;
  // A glossed word is a button, and a line can break between that button and
  // the punctuation right after it, which left a lone "." on its own line.
  // Each button gets a nowrap group that swallows the punctuation next to it.
  let group = null;
  const appendBetweenWords = (text) => {
    if (!text) return;
    const attached = group ? /^\S+/.exec(text) : null;
    if (attached) {
      group.append(global.document.createTextNode(attached[0]));
    }
    const rest = attached ? text.slice(attached[0].length) : text;
    if (rest) {
      line.append(global.document.createTextNode(rest));
    }
    group = null;
  };
  for (const match of entry.text.matchAll(pattern)) {
    if (match.index > lastIndex) {
      appendBetweenWords(entry.text.slice(lastIndex, match.index));
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
      group = global.document.createElement("span");
      group.className = "character-word-group";
      group.append(button);
      line.append(group);
    } else {
      line.append(global.document.createTextNode(word));
      group = null;
    }
    lastIndex = match.index + word.length;
  }
  if (lastIndex < entry.text.length) {
    appendBetweenWords(entry.text.slice(lastIndex));
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
  // The English line is deliberately not a translation of the Hebrew: the
  // Hebrew asks "who do you feel like today?", the English keeps the
  // pick-your-fighter joke.
  title.textContent = uiText("Choose your character", "מי בא לך היום?");
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

// How many vocabulary cards a topic is worth, so a learner can see that Money &
// Finance costs less to drop than Devices & Software. Counted off the live deck
// rather than stored, because the shelves grow — and off `baseVocabulary` rather
// than the raw shelves, because that is the pool the picker actually draws from.
function countFocusGroupCards(group) {
  const deck = getRuntime().baseVocabulary;
  if (!Array.isArray(deck)) return 0;
  const words = new Set(group.words || []);
  return deck.reduce(
    (total, word) => total + (
      group.categories.includes(word.category) || words.has(word.he) ? 1 : 0
    ),
    0,
  );
}

function countSelectedCards(characterId, selected) {
  const deck = getRuntime().baseVocabulary;
  const data = getCharacterData();
  if (!Array.isArray(deck) || !selected.length) return 0;
  const categories = data.resolveTopicCategories?.(characterId, selected) || new Set();
  const words = data.resolveTopicWords?.(characterId, selected) || new Set();
  return deck.reduce(
    (total, word) => total + (
      categories.has(word.category) || words.has(word.he) ? 1 : 0
    ),
    0,
  );
}

function createTopicRow(topic, isOn, action = "focusGroup") {
  const button = createSceneButton("", action, "quiet character-focus-option");
  if (action === "focusGroup") button.dataset.focusGroup = topic.id;
  button.classList.toggle("selected", isOn);
  button.setAttribute("aria-pressed", String(isOn));
  const name = global.document.createElement("strong");
  name.textContent = isHebrewUi() ? topic.labelHe : topic.labelEn;
  const count = global.document.createElement("span");
  count.className = "character-focus-count";
  const cards = countFocusGroupCards(topic);
  count.textContent = uiText(`${cards} words`, `${cards} מילים`);
  button.append(name, count);
  return button;
}

function createTopicSection(labelEn, labelHe, topics, checked) {
  const section = global.document.createElement("div");
  section.className = "character-focus-section";
  const heading = global.document.createElement("p");
  heading.className = "character-focus-section-label";
  heading.textContent = uiText(labelEn, labelHe);
  const list = global.document.createElement("div");
  list.className = "character-focus-options";
  topics.forEach((topic) => list.append(createTopicRow(topic, checked.includes(topic.id))));
  section.append(heading, list);
  return section;
}

function renderFocus(target) {
  const state = getState();
  const characterId = state?.pendingChoice || "";
  const data = getCharacterData();
  const own = data.getFocusGroups?.(characterId) || [];
  const shared = data.SHARED_FOCUS_TOPICS || [];
  const checked = Array.isArray(state?.pendingFocus) ? state.pendingFocus : [];
  const minimum = character.getMinimumTopics();

  const layout = global.document.createElement("div");
  // The marker class exists so the narrow-screen rules can compact this screen's
  // companion art without touching the duration screen, which shares the layout
  // but carries three buttons instead of a two-tier topic list.
  layout.className = "character-scene-layout character-focus-layout";
  const visual = global.document.createElement("div");
  visual.className = "character-scene-visual";
  visual.append(createSprite("neutral", "character-scene-sprite"));
  renderDialogue(visual, getDialogue("description"));

  const choices = global.document.createElement("div");
  choices.className = "character-focus-panel";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = uiText("What are we covering?", "על מה נעבוד?");
  // Said plainly because the screen cannot show it: the tier that comes next
  // still runs every activity, and this list governs the vocabulary only.
  // Sentences, conjugation and abbreviations route on the character's register,
  // which carries no topic to check off.
  const note = global.document.createElement("p");
  note.className = "character-focus-note";
  note.textContent = uiText(
    `Pick at least ${minimum}. This sets the vocabulary; the other activities follow your companion.`,
    `לבחור ${minimum} לפחות. זה קובע את אוצר המילים; שאר הפעילויות נשארות של הדמות.`,
  );
  choices.append(title, note);

  const scroller = global.document.createElement("div");
  scroller.className = "character-focus-scroll";
  if (own.length) {
    scroller.append(createTopicSection(
      `${getActiveCharacter()?.nameEn || "Your companion"}'s topics`,
      `הנושאים של ${getActiveCharacter()?.nameHe || "הדמות"}`,
      own,
      checked,
    ));
  }
  scroller.append(createTopicSection("Everyday topics", "נושאים יומיומיים", shared, checked));
  choices.append(scroller);

  // The live readout carries the consequence the row counts cannot: how much
  // material the current selection actually adds up to.
  const readout = global.document.createElement("p");
  readout.className = "character-focus-readout";
  const words = countSelectedCards(characterId, checked);
  readout.textContent = checked.length < minimum
    ? uiText(
      `${checked.length} of ${minimum} topics chosen`,
      `נבחרו ${checked.length} מתוך ${minimum} נושאים`,
    )
    : uiText(
      `${checked.length} topics · ${words} words`,
      `${checked.length} נושאים · ${words} מילים`,
    );
  choices.append(readout);

  const confirm = createSceneButton(uiText("Continue", "להמשיך"), "confirmFocus");
  // Below the minimum the pool gets thin enough to feel repetitive, so the screen
  // gates on it the way the picker gates on gender.
  confirm.disabled = checked.length < minimum;
  choices.append(confirm);
  choices.append(createSceneButton(uiText("Back", "חזרה"), "back", "quiet character-back-button"));
  layout.append(choices, visual);
  target.append(layout);
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
  const activity = getActivity(getBeats(mission)[mission?.currentIndex]?.mode);
  if (!activity) return;
  const layout = global.document.createElement("div");
  layout.className = "character-scene-focus";
  const eyebrow = global.document.createElement("p");
  eyebrow.className = "character-scene-eyebrow";
  eyebrow.textContent = `${mission.currentIndex + 1}/${getBeats(mission).length}`;
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = isHebrewUi() ? activity.nameHe : activity.nameEn;
  layout.append(eyebrow, title, createSprite("neutral", "character-scene-sprite"));
  renderDialogue(layout, getDialogue(activity.intro));
  layout.append(createSceneButton("יאללה", "continue", "accent character-yalla-button"));
  target.append(layout);
}

function renderDeath(target) {
  const state = getState();
  const layout = global.document.createElement("div");
  layout.className = "character-scene-focus character-death";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.className = "character-death-title";
  // Gendered from the same setting the dialogue uses. Unpointed on purpose: this
  // is a title card, not teaching copy.
  title.textContent = state?.gender === "f" ? "את מתה" : "אתה מת";
  title.lang = "he";
  title.dir = "rtl";
  const note = global.document.createElement("p");
  note.className = "character-death-note";
  const beat = character.getActiveBeat();
  note.textContent = beat
    ? uiText(`Back to the start of activity ${beat.index + 1}.`, `חוזרים לתחילת פעילות ${beat.index + 1}.`)
    : uiText("Back to the start.", "חוזרים להתחלה.");
  layout.append(title, note, createSprite("struggling", "character-scene-sprite"));
  renderDialogue(layout, getDialogue("fourWrong"));
  layout.append(createSceneButton(uiText("Get up", "קמים"), "respawn", "accent character-death-button"));
  target.append(layout);
}

function renderQuitConfirm(target) {
  const layout = global.document.createElement("div");
  layout.className = "character-scene-focus";
  const title = global.document.createElement("h2");
  title.id = "characterSceneTitle";
  title.textContent = uiText("Quit the mission?", "לפרוש מהמשימה?");
  layout.append(title, createSprite("nervous-laugh", "character-scene-sprite"));
  renderDialogue(layout, getDialogue("quit"));
  const actions = global.document.createElement("div");
  actions.className = "character-quit-actions";
  actions.append(
    createSceneButton(uiText("Keep going", "להמשיך במשימה"), "keepGoing"),
    createSceneButton(uiText("Quit mission", "לפרוש"), "quitMission", "quiet character-quit-confirm")
  );
  layout.append(actions);
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
  else if (screen === "focus") renderFocus(content);
  else if (screen === "duration") renderDuration(content);
  else if (screen === "greeting") renderGreeting(content);
  else if (screen === "activityIntro") renderActivityIntro(content);
  else if (screen === "quitConfirm") renderQuitConfirm(content);
  else if (screen === "death") renderDeath(content);
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
  const beats = getBeats(mission);
  // Merged results no longer count beats, and currentIndex is the truer figure
  // anyway: it counts what has actually been played.
  const completedCount = Math.min(Math.max(0, mission.currentIndex), beats.length);
  const progress = beats.length ? Math.round((completedCount / beats.length) * 100) : 0;

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
    `${completedCount} of ${beats.length} activities complete`,
    `${completedCount} מתוך ${beats.length} פעילויות הושלמו`
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
  // A mode can hold several beats, so rows say which part they are rather than
  // repeating one name down the list.
  const partTotals = new Map();
  beats.forEach((beat) => partTotals.set(beat.mode, (partTotals.get(beat.mode) || 0) + 1));
  const partSeen = new Map();
  beats.forEach((beat, index) => {
    const activityId = beat.mode;
    const activity = getActivity(activityId);
    if (!activity) return;
    const part = (partSeen.get(activityId) || 0) + 1;
    partSeen.set(activityId, part);
    const parts = partTotals.get(activityId) || 1;
    // Completion is positional now: a merged result exists as soon as a mode's
    // first beat lands, so it can no longer say whether *this* beat is done.
    const isComplete = index < mission.currentIndex;
    const isCurrent = index === mission.currentIndex;
    const isUpcoming = index > mission.currentIndex;
    const row = global.document.createElement("button");
    row.type = "button";
    row.className = "character-mission-row";
    row.dataset.missionBeat = String(index);
    row.classList.toggle("is-complete", isComplete);
    row.classList.toggle("is-current", isCurrent);
    row.disabled = !isCurrent;

    const number = global.document.createElement("span");
    number.className = "character-mission-number";
    number.textContent = isComplete ? "✓" : String(index + 1);
    const name = global.document.createElement("strong");
    const baseName = isHebrewUi() ? activity.nameHe : activity.nameEn;
    name.textContent = parts > 1 ? `${baseName} · ${part}/${parts}` : baseName;
    const status = global.document.createElement("span");
    status.className = "character-mission-status";
    if (isComplete) {
      status.textContent = uiText("Done", "הושלם");
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
  const minRight = margin;
  const maxRight = Math.max(minRight, runtime.global.innerWidth - rect.width - margin);
  const minY = Math.max(margin, topbarBottom + margin);
  const maxY = Math.max(minY, navTop - rect.height - margin);
  return { minRight, maxRight, minY, maxY };
}

function clampCompanionPosition(companion, position) {
  const runtime = getRuntime();
  const bounds = getCompanionBounds(companion);
  let right = position?.right;
  if (right === undefined && position?.x !== undefined) {
    const rect = companion.getBoundingClientRect();
    right = runtime.global.innerWidth - (Number(position.x) + (rect.width || 200));
  }
  return {
    right: Math.min(bounds.maxRight, Math.max(bounds.minRight, Number(right ?? 12))),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, Number(position?.y || 0))),
  };
}

function applyCompanionPosition(companion, context) {
  if (!companion || !context?.companionPosition) return;
  const clamped = clampCompanionPosition(companion, context.companionPosition);
  context.companionPosition = clamped;
  companion.style.right = `${clamped.right}px`;
  companion.style.top = `${clamped.y}px`;
  companion.style.left = "auto";
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
  const activeName = getActiveCharacter()?.nameEn || "";

  companion.classList.toggle("character-companion--hidden", !visible);
  companion.setAttribute?.("aria-label", activeName);
  if (sprite) {
    sprite.dataset.character = getActiveCharacter()?.id || "";
    sprite.dataset.reaction = frame;
    sprite.setAttribute("aria-label", activeName);
    sprite.classList.toggle("hidden", !visible);
  }

  if (bubble) {
    bubble.innerHTML = "";
    const entry = context.dialogueKey ? getDialogue(context.dialogueKey) : null;
    bubble.classList.toggle("hidden", !visible || !entry);
    if (visible && entry) renderDialogue(bubble, entry, "character-companion-dialogue");
  }

  if (toggle) {
    toggle.textContent = visible ? "hide" : "show";
    toggle.setAttribute("aria-label", `${visible ? "Hide" : "Show"} ${activeName}`.trim());
    toggle.setAttribute("aria-pressed", String(!visible));
  }

  // Quitting only means something while a mission is running; in free play the
  // companion is just a lens and there is nothing to leave.
  const quit = runtime.el?.characterQuitMission;
  if (quit) {
    const quitLabel = uiText("Quit mission", "לפרוש מהמשימה");
    quit.classList.toggle("hidden", mission?.active !== true);
    quit.setAttribute("aria-label", quitLabel);
    quit.setAttribute("title", quitLabel);
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

// The results screen shows the lens character reacting to how the game went,
// both in free play and after each activity of a mission — a flawless round
// celebrates here instead of on a scene of its own. The mission-results screen
// is excluded because renderMissionResults draws its own hero sprite.
character.renderResultsSprite = character.renderResultsSprite || function renderResultsSprite(target, options = {}) {
  if (!target) return false;
  target.querySelectorAll(".character-results-sprite").forEach((node) => node.remove());
  target.querySelectorAll(".character-results-dialogue").forEach((node) => node.remove());
  const state = getState();
  const runtime = getRuntime();
  if (!state?.lensCharacter) return false;
  if (runtime.state?.summary?.game === "characterMission") return false;
  const accuracy = Math.max(0, Math.min(100, Number(options.accuracy || 0)));
  const perfect = options.perfect === true;
  const frame = perfect ? "celebrating" : accuracy < 50 ? "struggling" : "neutral";
  target.prepend(createSprite(frame, "character-results-sprite"));
  if (perfect && state.mission?.active) {
    renderDialogue(target, getDialogue("perfect"), "character-results-dialogue");
  }
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
    const groups = played.filter((result) => result.mistakes.length);
    if (!groups.length) {
      const empty = global.document.createElement("p");
      empty.textContent = uiText("No mistakes in this mission.", "אין טעויות במשימה הזאת.");
      mistakeList.append(empty);
    } else {
      // The activity name is a heading over its own rows, so it is read once
      // instead of being repeated on the end of every line.
      groups.forEach((result) => {
        const groupTitle = global.document.createElement("h4");
        groupTitle.className = "mission-mistake-group-title";
        groupTitle.textContent = isHebrewUi() ? result.nameHe : result.nameEn;
        mistakeList.append(groupTitle);
        result.mistakes.forEach((item) => {
          if (Array.isArray(item.forms)) {
            mistakeList.append(app.ui.createVerbMistakeGroup(item));
            return;
          }
          mistakeList.append(
            app.ui.createCompactRow({
              title: item.primary || item.title || "",
              note: item.secondary || item.note || "",
              fields: item.fields,
              clinic: app.ui.getMistakeClinicText?.(item) || "",
              variant: "wrong",
            })
          );
        });
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

// The standing topic selection, editable where the learner already chooses a
// companion. Collapsed behind a summary line, because the Review page lists all
// five characters and five expanded topic lists would bury the bond cards.
function createTopicEditor(characterId, changeable) {
  const data = getCharacterData();
  const own = data.getFocusGroups?.(characterId) || [];
  const shared = data.SHARED_FOCUS_TOPICS || [];
  const selected = character.getCharacterTopicSelection(characterId);
  const minimum = character.getMinimumTopics();

  const wrap = global.document.createElement("details");
  wrap.className = "character-topic-editor";
  const summary = global.document.createElement("summary");
  const words = countSelectedCards(characterId, selected);
  summary.textContent = uiText(
    `Topics · ${selected.length} chosen · ${words} words`,
    `נושאים · ${selected.length} נבחרו · ${words} מילים`,
  );
  wrap.append(summary);

  const list = global.document.createElement("div");
  list.className = "character-focus-options";
  [...own, ...shared].forEach((topic) => {
    const isOn = selected.includes(topic.id);
    // No scene action: this surface writes the standing selection through its
    // own hook rather than the daily picker's.
    const row = createTopicRow(topic, isOn, "");
    row.dataset.topicCharacter = characterId;
    row.dataset.topicId = topic.id;
    // Unchecking the last legal topic would drop below the minimum, so the row
    // that would break it is held rather than silently refused on click.
    row.disabled = !changeable || (isOn && selected.length <= minimum);
    list.append(row);
  });
  wrap.append(list);

  const hint = global.document.createElement("p");
  hint.className = "character-focus-note";
  hint.textContent = changeable
    ? uiText(`Pick at least ${minimum}.`, `לבחור ${minimum} לפחות.`)
    : uiText(
      "Finish today’s mission to change topics.",
      "אפשר לשנות נושאים בסיום המשימה של היום.",
    );
  wrap.append(hint);
  return wrap;
}

character.renderStreak = character.renderStreak || function renderStreak() {
  const runtime = getRuntime();
  const pill = runtime.el?.streakPill;
  const text = runtime.el?.streakPillText;
  if (!pill || !text) return;
  const streak = character.getDailyStreak();
  // Nothing to boast about on day zero, and an empty pill is worse than none.
  pill.classList.toggle("hidden", streak.current < 1);
  if (streak.current < 1) return;
  const label = isHebrewUi() ? `יום ${streak.current}` : `Day ${streak.current}`;
  text.textContent = label;
  // Today still open reads differently from today already done.
  pill.classList.toggle("is-pending", !streak.practisedToday);
  pill.setAttribute(
    "aria-label",
    streak.practisedToday
      ? uiText(`${streak.current} day streak, practised today`, `רצף של ${streak.current} ימים, תורגל היום`)
      : uiText(`${streak.current} day streak, not practised today yet`, `רצף של ${streak.current} ימים, עוד לא תורגל היום`),
  );
};

character.renderBondPanel = character.renderBondPanel || function renderBondPanel() {
  const runtime = getRuntime();
  const target = runtime.el?.reviewCharacterBonds;
  if (!target) return;
  target.innerHTML = "";
  const lensId = getState()?.lensCharacter || "";
  const changeable = character.canChangeLens();

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

    // The same lens the Settings picker sets, offered where the learner is
    // already reading about the characters.
    const choose = global.document.createElement("button");
    choose.type = "button";
    choose.className = "quiet character-bond-choose";
    choose.dataset.characterLens = bond.id;
    const selected = bond.id === lensId;
    choose.textContent = selected
      ? uiText("Current companion", "הדמות הנוכחית")
      : uiText("Choose as companion", "לבחור כדמות");
    choose.disabled = selected || !changeable;
    choose.setAttribute("aria-pressed", String(selected));

    body.append(heading, level, track, stats, choose, createTopicEditor(bond.id, changeable));
    card.append(body);
    target.append(card);
  });

  const note = getRuntime().el?.reviewCharacterLensNote;
  if (note) {
    note.classList.toggle("hidden", changeable);
    note.textContent = changeable
      ? ""
      : uiText(
        "Finish today’s mission to change your companion.",
        "אפשר לשנות את הדמות בסיום המשימה של היום."
      );
  }
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
  character.renderStreak();
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

// --- Daily streak -----------------------------------------------------------
// A day counts if the learner answered anything at all, right or wrong, in any
// mode, with or without a character. Bond `days` cannot serve this: addBondXp
// runs only from awardAnswerBond, which is called on correct answers only and
// returns early when no character is routing. Seeded once from the union of the
// bond days so existing learners keep the history they earned.

function loadLearnerDays() {
  const runtime = getRuntime();
  const key = runtime.constants?.STORAGE_KEYS?.learnerDays;
  const raw = key ? runtime.storageApi?.loadJson?.(key, null) : null;
  const valid = (list) => (Array.isArray(list) ? list : [])
    .map((day) => String(day || ""))
    .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day));
  if (raw && Array.isArray(raw.days)) return [...new Set(valid(raw.days))].sort();
  const seeded = new Set();
  Object.values(loadBonds()).forEach((record) => valid(record?.days).forEach((day) => seeded.add(day)));
  return [...seeded].sort();
}

function saveLearnerDays(days) {
  const runtime = getRuntime();
  const key = runtime.constants?.STORAGE_KEYS?.learnerDays;
  if (key) runtime.storageApi?.saveJson?.(key, { days });
}

function recordLearnerDay() {
  const days = loadLearnerDays();
  const today = getTodayKey();
  if (days.includes(today)) return;
  days.push(today);
  days.sort();
  saveLearnerDays(days);
}

function shiftDay(key, delta) {
  const [year, month, day] = String(key).split("-").map(Number);
  // Local, matching getTodayKey — a UTC basis would roll the streak at the wrong
  // hour for anyone not on UTC.
  const date = new Date(year, month - 1, day + delta);
  return getTodayKey(date);
}

// Current streak counts back from today, or from yesterday when today has not
// been practised yet — so an unopened app does not read as broken until a full
// day has been missed.
character.getDailyStreak = character.getDailyStreak || function getDailyStreak() {
  const days = loadLearnerDays();
  const set = new Set(days);
  const today = getTodayKey();
  let current = 0;
  let cursor = set.has(today) ? today : shiftDay(today, -1);
  while (set.has(cursor)) {
    current += 1;
    cursor = shiftDay(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  let previous = "";
  days.forEach((day) => {
    run = previous && shiftDay(previous, 1) === day ? run + 1 : 1;
    previous = day;
    if (run > longest) longest = run;
  });

  return { current, longest, totalDays: days.length, practisedToday: set.has(today) };
};

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
  // Opens on whatever the learner last chose for this character, or the default
  // if they never have. The everyday tier means every character always has
  // topics to offer, so the screen is never skipped.
  state.pendingFocus = getStoredFocus(state.pendingChoice);
  state.screen = "focus";
  saveState();
  getRuntime().helpers?.renderAll?.();
};

character.toggleFocusGroup = character.toggleFocusGroup || function toggleFocusGroup(groupId) {
  const state = getState();
  if (!state || state.screen !== "focus" || !isCharacterChoice(state.pendingChoice)) return;
  const id = String(groupId || "");
  if (!allFocusIds(state.pendingChoice).includes(id)) return;
  const next = state.pendingFocus.includes(id)
    ? state.pendingFocus.filter((entry) => entry !== id)
    : [...state.pendingFocus, id];
  // Re-sanitized so the stored order always matches the registry's, which is
  // the order the picker renders in.
  state.pendingFocus = sanitizeFocus(state.pendingChoice, next);
  saveState();
  getRuntime().helpers?.renderAll?.();
};

character.confirmFocus = character.confirmFocus || function confirmFocus() {
  const state = getState();
  if (!state || state.screen !== "focus" || !isCharacterChoice(state.pendingChoice)) return;
  // Below the minimum the pool gets thin enough to feel repetitive. The Continue
  // button is disabled for it and this is the guard behind that.
  if (state.pendingFocus.length < MIN_FOCUS_TOPICS) return;
  // Remember it, so tomorrow opens on the same choice and free play follows it.
  state.topics = { ...state.topics, [state.pendingChoice]: [...state.pendingFocus] };
  state.screen = "duration";
  saveState();
  getRuntime().helpers?.renderAll?.();
};

// Editing the standing selection outside the daily picker — the Review
// Characters tab and Settings. Gated on canChangeLens for the same reason
// changing the lens is: a running mission owns what it is drilling.
character.setCharacterTopics = character.setCharacterTopics || function setCharacterTopics(characterId, topicIds) {
  const state = getState();
  if (!state || !isCharacterChoice(characterId) || !character.canChangeLens()) return false;
  const picked = sanitizeFocus(characterId, topicIds);
  if (picked.length < MIN_FOCUS_TOPICS) return false;
  state.topics = { ...state.topics, [String(characterId)]: picked };
  saveState();
  getRuntime().helpers?.renderAll?.();
  return true;
};

character.toggleCharacterTopic = character.toggleCharacterTopic || function toggleCharacterTopic(characterId, topicId) {
  const current = getStoredFocus(characterId);
  const id = String(topicId || "");
  const next = current.includes(id)
    ? current.filter((entry) => entry !== id)
    : [...current, id];
  return character.setCharacterTopics(characterId, next);
};

character.getCharacterTopicSelection = character.getCharacterTopicSelection || function getCharacterTopicSelection(characterId) {
  return getStoredFocus(characterId);
};

character.getMinimumTopics = character.getMinimumTopics || function getMinimumTopics() {
  return MIN_FOCUS_TOPICS;
};

character.backToPicker = character.backToPicker || function backToPicker() {
  const state = getState();
  if (!state) return;
  state.pendingChoice = "";
  state.pendingFocus = [];
  state.screen = "picker";
  saveState();
  getRuntime().helpers?.renderAll?.();
};

// Builds one mission's beat list. Pure given its options, so it is testable
// without stubbing Math.random, and stable across a reload because the result
// is persisted rather than rebuilt.
function buildBeatPlan(tierId, options = {}) {
  const tier = TIERS[tierId] || TIERS.short;
  const budget = Math.max(0, Number(tier.budget) || 0);
  const speechSupported = options.speechSupported === true;
  const utils = app.utils || {};
  const random = typeof utils.seededRandom === "function"
    ? utils.seededRandom(utils.hashSeed?.(options.seed) ?? 1)
    : Math.random;
  const shuffle = (items) => (typeof utils.seededShuffle === "function"
    ? utils.seededShuffle(items, random)
    : [...items]);

  const skipped = [];
  const eligible = [];
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
    if (activity.beatCost <= budget * MAX_BEAT_SHARE) eligible.push(activity);
  });

  let remaining = budget;

  // Atomic modes cannot be trimmed to fit, so they claim their space before the
  // divisible ones spend the budget down past what they need.
  const atomicSlots = Math.floor(budget / ATOMIC_BUDGET_PER_SLOT);
  const atomicBeats = [];
  shuffle(eligible.filter((activity) => activity.atomic === true)).forEach((activity) => {
    if (atomicBeats.length >= atomicSlots || activity.beatCost > remaining) return;
    atomicBeats.push({ mode: activity.id, rounds: activity.beatRounds });
    remaining -= activity.beatCost;
  });

  // Divisible modes cycle rather than being exhausted one at a time, which is
  // what keeps a mode from ever running twice in a row.
  const divisible = shuffle(eligible.filter((activity) => activity.atomic !== true));
  const opener = divisible.findIndex((activity) => OPENING_ACTIVITIES.includes(activity.id));
  if (opener > 0) divisible.unshift(...divisible.splice(opener, 1));

  // Phase one: how many beats each mode gets. Cycling rather than exhausting one
  // mode at a time is what keeps the mix even.
  const counts = new Map();
  let progressed = divisible.length > 0;
  while (progressed) {
    progressed = false;
    divisible.forEach((activity) => {
      if (activity.beatCost > remaining) return;
      // One divisible mode left means every beat would be that mode, which is the
      // blocked practice this whole change exists to stop.
      if (divisible.length === 1 && counts.size) return;
      counts.set(activity.id, (counts.get(activity.id) || 0) + 1);
      remaining -= activity.beatCost;
      progressed = true;
    });
  }

  // Phase two: order them. Always take from the mode with the most beats left
  // whose family differs from the one just played, so the plan cannot paint
  // itself into a corner and end on a run of whatever was left over.
  const sequence = [];
  let previousFamily = "";
  let guard = 0;
  while (guard < 500) {
    guard += 1;
    const remainingModes = divisible.filter((activity) => (counts.get(activity.id) || 0) > 0);
    if (!remainingModes.length) break;
    const openers = sequence.length
      ? []
      : remainingModes.filter((activity) => OPENING_ACTIVITIES.includes(activity.id));
    const preferredPool = openers.length ? openers : remainingModes;
    const spaced = preferredPool.filter((activity) => activity.family !== previousFamily);
    const pool = spaced.length ? spaced : preferredPool;
    // `divisible` is already in seeded order, so reduce() breaks ties stably.
    const pick = pool.reduce(
      (best, activity) => ((counts.get(activity.id) || 0) > (counts.get(best.id) || 0) ? activity : best),
      pool[0],
    );
    counts.set(pick.id, (counts.get(pick.id) || 0) - 1);
    sequence.push({ mode: pick.id, rounds: pick.beatRounds });
    previousFamily = pick.family;
  }

  // Atomic beats land around the middle, spaced, so a long grind is never the
  // first or last thing in a mission and two never sit back to back. Inserted
  // back to front so the precomputed positions stay valid.
  const playable = [...sequence];
  atomicBeats
    .map((beat, index) => ({ beat, at: Math.min(sequence.length, Math.round(sequence.length / 3) + index * 3) }))
    .sort((a, b) => b.at - a.at)
    .forEach(({ beat, at }) => playable.splice(at, 0, beat));

  return { playable, skipped };
}

character.chooseTier = character.chooseTier || function chooseTier(tierId) {
  const state = getState();
  const tier = TIERS[tierId];
  if (!state?.gender || !tier || !isCharacterChoice(state.pendingChoice)) return;
  // The minimum is enforced here as well as on the focus screen. Continue being
  // disabled stops a click, but a restored save or any other path into this
  // function would otherwise build a mission below the floor.
  if (state.pendingFocus.length && state.pendingFocus.length < MIN_FOCUS_TOPICS) return;
  const itinerary = buildBeatPlan(tierId, {
    speechSupported: app.speech?.isSupported?.() === true,
    seed: `${getTodayKey()}:${state.pendingChoice}:${tierId}`,
  });
  // The mission takes a snapshot, so editing the standing selection from Review
  // or Settings later cannot shift the deck under a mission already running.
  const focus = state.pendingFocus.length
    ? sanitizeFocus(state.pendingChoice, state.pendingFocus)
    : getStoredFocus(state.pendingChoice);
  const focusCharacterId = state.pendingChoice;
  state.topics = { ...state.topics, [focusCharacterId]: [...focus] };
  state.dailyChoice = state.pendingChoice;
  state.hasChosen[state.pendingChoice] = true;
  // Today's character also becomes the free-play lens once the mission ends.
  state.lensCharacter = state.pendingChoice;
  state.pendingChoice = "";
  state.pendingFocus = [];
  state.screen = "greeting";
  state.reviewOpen = false;
  state.mission = {
    active: true,
    completed: false,
    onHub: false,
    tier: tierId,
    focus,
    characterId: focusCharacterId,
    beats: itinerary.playable,
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
    if (mission.currentIndex >= getBeats(mission).length) character.finishMission();
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
  const activityId = getBeats(mission)[mission?.currentIndex]?.mode;
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

  mergeActivityResult(mission, normalizeActivityResult(config, activity));
  mission.currentIndex += 1;
  mission.currentActivity = "";
  if (mission.currentIndex >= getBeats(mission).length) {
    // Everything missed along the way comes back now, as one short beat per mode
    // that owes something. Guarded by repairAppended so repairs are spent once.
    if (appendRepairBeats(mission)) {
      state.screen = "none";
      mission.onHub = false;
      saveState();
      startNextBeat();
      return true;
    }
    // The mission-results screen already lists every activity and every
    // mistake, so the last game goes straight there rather than showing its own
    // recap first.
    character.finishMission();
    return true;
  }
  // Chain straight into the next beat. Returning true makes showSessionSummary
  // return before it populates state.summary or routes to results — but after
  // its own teardown has run — so the learner crosses from one beat to the next
  // without a per-beat recap, the hub, or the activity intro in between.
  state.screen = "none";
  mission.onHub = false;
  saveState();
  startNextBeat();
  return true;
};

// A mode owns several beats now, and the results screen lists one row per mode,
// so a beat folds into the row it belongs to instead of adding a row. Keeping
// the shape per-mode is what lets renderMissionResults and finishMission stay
// exactly as they were.
function mergeActivityResult(mission, result) {
  const existing = mission.results.find((row) => row.id === result.id);
  if (!existing) {
    mission.results.push(result);
    return;
  }
  existing.correctCount += result.correctCount;
  existing.incorrectCount += result.incorrectCount;
  existing.elapsedSeconds += result.elapsedSeconds;
  existing.mistakes = [...existing.mistakes, ...result.mistakes];
}

// A mode calls this instead of opening its own second-chance phase. Misses then
// come back at the end of the mission rather than two questions later, which is
// the same spacing argument the interleaving itself rests on: an immediate
// re-ask is massed practice.
character.deferReviewQueue = character.deferReviewQueue || function deferReviewQueue(modeId, entries) {
  const state = getState();
  const mission = state?.mission;
  const mode = String(modeId || "");
  if (!mission?.active || !REPAIRABLE_MODES.includes(mode)) return false;
  if (!Array.isArray(entries) || !entries.length) return false;
  // A repair beat's own misses stay in that beat, or the mission would append a
  // repair beat for the repair beat and never end.
  if (character.getActiveBeat()?.repair) return false;
  if (!Array.isArray(mission.repairQueue)) mission.repairQueue = [];
  entries.forEach((entry) => mission.repairQueue.push({ mode, entry }));
  saveState();
  return true;
};

character.takeRepairQueue = character.takeRepairQueue || function takeRepairQueue(modeId) {
  const state = getState();
  const mission = state?.mission;
  const mode = String(modeId || "");
  if (!Array.isArray(mission?.repairQueue) || !mission.repairQueue.length) return [];
  const mine = mission.repairQueue.filter((row) => row.mode === mode).map((row) => row.entry);
  if (!mine.length) return [];
  mission.repairQueue = mission.repairQueue.filter((row) => row.mode !== mode);
  saveState();
  return mine;
};

// Repair is one appended beat per mode that owes something — the engines are
// per-mode, so it cannot be a single closing round.
function appendRepairBeats(mission) {
  if (mission.repairAppended === true) return false;
  mission.repairAppended = true;
  if (!Array.isArray(mission.repairQueue) || !mission.repairQueue.length) return false;
  const counts = new Map();
  mission.repairQueue.forEach((row) => counts.set(row.mode, (counts.get(row.mode) || 0) + 1));
  const beats = getBeats(mission);
  let appended = false;
  REPAIRABLE_MODES.forEach((mode) => {
    const count = counts.get(mode) || 0;
    if (!count) return;
    beats.push({ mode, rounds: count, repair: true });
    appended = true;
  });
  if (appended) mission.beats = beats;
  return appended;
}

// A starved deck finishes the moment it starts, which would chain start ->
// finish -> start until the stack gave out. Depth is tracked rather than
// deferred through setTimeout because the mission tests drive this path
// synchronously.
let beatChainDepth = 0;

function startNextBeat() {
  if (beatChainDepth >= MAX_BEAT_CHAIN_DEPTH) {
    character.showMissionHub();
    return;
  }
  beatChainDepth += 1;
  try {
    character.startCurrentActivity();
  } finally {
    beatChainDepth -= 1;
  }
}

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
  if (getState()?.screen !== "none") return;
  // Before the context guard on purpose. getReactionContext returns null in free
  // play with no lens, and those answers are still practice — the streak
  // measures showing up, not who you showed up with.
  recordLearnerDay();
  const context = getReactionContext();
  if (!context) return;
  const correct = isCorrect === true;
  Object.assign(context, character.reduceAnswerState(context, correct));
  if (context.reactionTransient) {
    context.reactionQuestionKey = getQuestionStateKey();
    scheduleTransientReactionCheck(context.reactionQuestionKey);
  }
  if (correct) awardAnswerBond();

  // Four wrong in a row is already the app's "you have lost the thread" signal —
  // it is what turns the companion to `struggling`. The bonfire hangs off the
  // same threshold rather than inventing a second one.
  if (!correct && context.wrongStreak >= DEATH_WRONG_STREAK && shouldDie()) {
    triggerDeath();
    return;
  }

  saveState();
  character.renderCompanion();
};

function bonfireEnabled() {
  const stored = getRuntime().state?.bonfire;
  return stored ? stored.enabled === true : true;
}

function shouldDie() {
  const state = getState();
  const mission = state?.mission;
  if (!mission?.active || state.screen !== "none") return false;
  if (!bonfireEnabled()) return false;
  // A repair beat is already the second chance. Dying inside one would send the
  // learner back through the very items they are there to recover.
  return character.getActiveBeat()?.repair !== true;
}

function triggerDeath() {
  const state = getState();
  const mission = state.mission;
  mission.deaths = Math.max(0, Number(mission.deaths || 0)) + 1;
  mission.sprite = "struggling";
  mission.dialogueKey = "fourWrong";
  mission.reactionTransient = false;
  state.screen = "death";
  saveState();
  // Deliberately no teardown here. This runs from inside the mode's own answer
  // handler, which carries on rendering feedback after it returns — clearing the
  // session out from under it nulls currentQuestion mid-call and throws. The
  // mode simply sits behind the modal, and respawnAtBeat's startCurrentActivity
  // resets it the way every other start path does.
  getRuntime().helpers?.renderAll?.();
}

// Back to the start of the current beat — the bonfire, not the exact tile. The
// beat index does not move, so completed beats never replay, and nothing here
// touches progress: every wrong answer already updated its Leitner record, so
// death costs position and never learning.
character.respawnAtBeat = character.respawnAtBeat || function respawnAtBeat() {
  const state = getState();
  const mission = state?.mission;
  if (!mission?.active || state.screen !== "death") return false;
  mission.correctStreak = 0;
  mission.wrongStreak = 0;
  mission.sprite = "neutral";
  mission.dialogueKey = "";
  mission.reactionTransient = false;
  mission.currentActivity = "";
  state.screen = "none";
  saveState();
  character.startCurrentActivity();
  return true;
};

// Hiding the sprite collapses the companion's box, and the box is anchored by
// its top-left corner, so the toggle used to jump up and to the left — to where
// the sprite had been — instead of staying under the finger that just tapped it.
// Re-anchor the companion on the button's own centre so the button holds still.
function holdVisibilityToggleInPlace(before) {
  const runtime = getRuntime();
  const context = getReactionContext();
  const companion = runtime.el?.characterCompanion;
  const toggle = runtime.el?.characterVisibilityToggle;
  if (!before || !context || !companion || !toggle) return;

  const after = toggle.getBoundingClientRect();
  const dx = before.x - (after.left + after.width / 2);
  const dy = before.y - (after.top + after.height / 2);
  if (!dx && !dy) return;

  const rect = companion.getBoundingClientRect();
  const currentRight = runtime.global.innerWidth - rect.right;
  context.companionPosition = { right: currentRight - dx, y: rect.top + dy };
  applyCompanionPosition(companion, context);
}

character.toggleVisibility = character.toggleVisibility || function toggleVisibility() {
  const context = getReactionContext();
  if (!context) return;
  const toggleRect = getRuntime().el?.characterVisibilityToggle?.getBoundingClientRect?.();
  const before = toggleRect
    ? { x: toggleRect.left + toggleRect.width / 2, y: toggleRect.top + toggleRect.height / 2 }
    : null;
  context.visible = context.visible === false;
  character.renderCompanion();
  holdVisibilityToggleInPlace(before);
  saveState();
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

character.openMissionBeat = character.openMissionBeat || function openMissionBeat(index) {
  const runtime = getRuntime();
  const state = getState();
  const mission = state?.mission;
  const beatIndex = Number(index);
  if (!mission?.active || !Number.isInteger(beatIndex) || beatIndex !== mission.currentIndex) return false;
  const activityId = getBeats(mission)[beatIndex]?.mode;
  if (!activityId) return false;

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

// Quitting is a three-step scene so the confirm can be backed out of: the
// prompt pauses the running activity, cancelling resumes it where it stood, and
// confirming tears the session down and drops the day into free play.
character.requestQuitMission = character.requestQuitMission || function requestQuitMission() {
  const state = getState();
  if (!state?.mission?.active || state.screen !== "none") return false;
  if (app.session?.hasActiveLearnSession?.()) {
    pauseMissionTimers();
  }
  state.screen = "quitConfirm";
  saveState();
  getRuntime().helpers?.renderAll?.();
  return true;
};

character.cancelQuitMission = character.cancelQuitMission || function cancelQuitMission() {
  const state = getState();
  if (state?.screen !== "quitConfirm") return false;
  const mission = state.mission;
  state.screen = "none";
  if (mission?.active && mission.currentActivity && !mission.onHub &&
    app.session?.hasActiveLearnSession?.()) {
    rebaseMissionTimer(mission.currentActivity);
    app.session?.resumeActiveTimers?.();
  }
  saveState();
  getRuntime().helpers?.renderAll?.();
  return true;
};

// The abandoned mission earns no completion bonus, and the day is not offered
// the picker again: the character stays on as the free-play companion until one
// is chosen from Settings or Review.
character.confirmQuitMission = character.confirmQuitMission || function confirmQuitMission() {
  const state = getState();
  if (!state?.mission) return false;
  state.mission = null;
  state.dailyChoice = "free";
  state.pendingChoice = "";
  state.screen = "none";
  state.reviewOpen = false;
  saveState();
  character.resetFreePlayReaction();
  if (app.session?.endSessionAndNavigate) {
    app.session.endSessionAndNavigate("home");
  } else {
    getRuntime().helpers?.renderAll?.();
  }
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
  const runtime = getRuntime();
  const currentPointerRight = runtime.global.innerWidth - event.clientX;
  const desiredRight = currentPointerRight - activeCompanionDrag.offsetRight;
  const position = clampCompanionPosition(companion, {
    right: desiredRight,
    y: event.clientY - activeCompanionDrag.offsetY,
  });
  const context = getReactionContext();
  if (context) context.companionPosition = position;
  applyCompanionPosition(companion, context);
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
    offsetRight: (runtime.global.innerWidth - event.clientX) - (runtime.global.innerWidth - rect.right),
    offsetY: event.clientY - rect.top,
  };
  companion.classList.add("is-dragging");
  sprite.setPointerCapture?.(event.pointerId);
  global.addEventListener?.("pointermove", moveCompanionDrag);
  global.addEventListener?.("pointerup", finishCompanionDrag);
  global.addEventListener?.("pointercancel", finishCompanionDrag);
};

character.handleResultsContinue = character.handleResultsContinue || function handleResultsContinue() {
  const runtime = getRuntime();
  const state = getState();
  if (!state) return false;
  // A per-activity recap during a live mission: hand back to the hub so the
  // next activity can be started, rather than dropping out to free play.
  if (state.mission?.active && runtime.state?.summary?.game !== "characterMission") {
    app.session?.clearSummaryState?.();
    state.screen = "none";
    state.mission.onHub = true;
    runtime.state.mode = "home";
    runtime.state.route = "home";
    saveState();
    runtime.helpers?.renderAll?.();
    return true;
  }
  if (runtime.state?.summary?.game !== "characterMission") return false;
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

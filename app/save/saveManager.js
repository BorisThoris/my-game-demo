/**
 * Save manager: single JSON save (high score, settings) in localStorage.
 * Migrates from legacy skyfall_highscore. Optional cloud sync via onlineService (placeholder).
 */

const SAVE_KEY = "skyfall_save";
const LEGACY_HIGH_SCORE_KEY = "skyfall_highscore";
const SAVE_VERSION = 2;

const DEFAULT_SETTINGS = {
  musicVolume: 1,
  sfxVolume: 1,
  fullscreen: false,
  resolutionOrQuality: "1280x720",
  screenShakeIntensity: 1,
  flashIntensity: 1,
  colorBlindPaletteMode: "off"
};

const DEFAULT_UNLOCK_TREE = {
  unlockedNodes: []
};

const DEFAULT_SAVE = {
  version: SAVE_VERSION,
  highScore: 0,
  highScoresByMode: {
    Classic: 0,
    BossRush: 0,
    Draft: 0
  },
  lastCompletedLevel: 0,
  selectedArchetype: "all-rounder",
  settings: { ...DEFAULT_SETTINGS },
  unlockedAchievements: [],
  metaFragments: 0,
  metaCurrency: 0,
  tutorialCompleted: false,
  tutorialOptOut: false,
  unlockTree: { ...DEFAULT_UNLOCK_TREE }
};

function normalizeMode(mode) {
  return mode || "Classic";
}

function readFromStorage() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(SAVE_KEY) : null;
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (_) {
    // ignore
  }
  return null;
}

function writeToStorage(data) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    }
  } catch (_) {
    // ignore
  }
}

/** Migrate legacy skyfall_highscore into save once. */
function migrateLegacyHighScore(save) {
  if (save.highScore != null && save.highScore > 0) {
    return save;
  }
  try {
    const legacy = typeof localStorage !== "undefined" ? localStorage.getItem(LEGACY_HIGH_SCORE_KEY) : null;
    if (legacy != null && legacy !== "") {
      const n = parseInt(legacy, 10);
      if (!isNaN(n) && n > 0) {
        save.highScore = n;
        localStorage.removeItem(LEGACY_HIGH_SCORE_KEY);
      }
    }
  } catch (_) {
    // ignore
  }
  return save;
}

function normalizeUnlockTree(unlockTree) {
  return {
    unlockedNodes: Array.isArray(unlockTree?.unlockedNodes) ? unlockTree.unlockedNodes : []
  };
}

export function migrateSave(raw) {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_SAVE, settings: { ...DEFAULT_SETTINGS }, unlockTree: { ...DEFAULT_UNLOCK_TREE } };
  }

  const version = Number.isFinite(raw.version) ? raw.version : 1;
  let save = {
    ...DEFAULT_SAVE,
    ...raw,
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings || {}) },
    unlockTree: normalizeUnlockTree(raw.unlockTree)
  };

  if (version < 2) {
    save = {
      ...save,
      metaFragments: Number.isFinite(raw.metaFragments) ? Math.max(0, Math.floor(raw.metaFragments)) : 0,
      metaCurrency: Number.isFinite(raw.metaCurrency) ? Math.max(0, Math.floor(raw.metaCurrency)) : 0,
      unlockTree: normalizeUnlockTree(raw.unlockTree)
    };
  }

  save.version = SAVE_VERSION;
  return migrateHighScoresByMode(save);
}

function migrateHighScoresByMode(save) {
  if (!save.highScoresByMode || typeof save.highScoresByMode !== "object") {
    save.highScoresByMode = { ...DEFAULT_SAVE.highScoresByMode };
  } else {
    save.highScoresByMode = {
      ...DEFAULT_SAVE.highScoresByMode,
      ...save.highScoresByMode
    };
  }

  if ((save.highScore ?? 0) > (save.highScoresByMode.Classic ?? 0)) {
    save.highScoresByMode.Classic = save.highScore;
  }
  return save;
}

/** Full save object from storage (with defaults and migration). */
export function getSave() {
  const raw = readFromStorage();
  let save = migrateSave(raw);
  save = migrateLegacyHighScore(save);
  save = migrateHighScoresByMode(save);
  return save;
}

/** Persist full save and optionally trigger cloud sync (placeholder). */
export function setSave(data) {
  const toWrite = migrateSave(data);
  writeToStorage(toWrite);
  import("../services/onlineService.js").then(({ saveToCloud }) => {
    saveToCloud(toWrite, () => {});
  }).catch(() => {});
}

/** Get settings object. */
export function getSettings() {
  return getSave().settings;
}

/** Update settings (partial) and persist. */
export function setSettings(partial) {
  const save = getSave();
  save.settings = { ...save.settings, ...partial };
  setSave(save);
}

/** Get high score. */
export function getHighScore(mode = "Classic") {
  const save = getSave();
  const normalizedMode = normalizeMode(mode);
  return save.highScoresByMode?.[normalizedMode] ?? 0;
}

/** Update high score and persist. */
export function setHighScore(value, mode = "Classic") {
  const save = getSave();
  const normalizedMode = normalizeMode(mode);
  const currentModeBest = save.highScoresByMode?.[normalizedMode] ?? 0;
  if (value <= currentModeBest) {
    return;
  }
  save.highScoresByMode = {
    ...DEFAULT_SAVE.highScoresByMode,
    ...(save.highScoresByMode || {})
  };
  save.highScoresByMode[normalizedMode] = value;
  if (normalizedMode === "Classic") {
    save.highScore = value;
  }
  setSave(save);
}

/** Get last completed level (run progress). We do not save ongoing level — only N-1 when exiting. */
export function getLastCompletedLevel() {
  const save = getSave();
  return save.lastCompletedLevel != null ? save.lastCompletedLevel : 0;
}

/** Set last completed level only if new value is greater (e.g. on exit we save currentLevel - 1). */
export function setLastCompletedLevel(level) {
  const save = getSave();
  const next = Math.max(0, Math.floor(level));
  if (next <= (save.lastCompletedLevel != null ? save.lastCompletedLevel : 0)) {
    return;
  }
  save.lastCompletedLevel = next;
  setSave(save);
}

/** Get the selected starting archetype for the next run. */
export function getSelectedArchetype() {
  const save = getSave();
  return save.selectedArchetype || "all-rounder";
}

/** Persist selected archetype id. */
export function setSelectedArchetype(archetypeId) {
  const save = getSave();
  save.selectedArchetype = archetypeId || "all-rounder";
  setSave(save);
}

export function getMetaFragments() {
  const save = getSave();
  return save.metaFragments != null ? save.metaFragments : 0;
}

export function addMetaFragments(amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }
  const save = getSave();
  save.metaFragments = (save.metaFragments ?? 0) + Math.floor(amount);
  save.metaCurrency = (save.metaCurrency ?? 0) + Math.floor(amount);
  setSave(save);
}

/** Call on boot to merge cloud save if available (placeholder). */
export function initSaveFromCloud() {
  import("../services/onlineService.js").then(({ loadFromCloud }) => {
    loadFromCloud((remote) => {
      if (remote && typeof remote === "object" && (remote.highScore > getHighScore() || (remote.lastCompletedLevel != null && remote.lastCompletedLevel > getLastCompletedLevel()) || Object.keys(remote.settings || {}).length > 0)) {
        const local = getSave();
        if (remote.highScore > local.highScore) local.highScore = remote.highScore;
        if (remote.lastCompletedLevel != null && remote.lastCompletedLevel > (local.lastCompletedLevel ?? 0)) local.lastCompletedLevel = remote.lastCompletedLevel;
        if (remote.settings) local.settings = { ...local.settings, ...remote.settings };
        setSave(local);
      }
    });
  }).catch(() => {});
}

export function shouldShowTutorial() {
  const save = getSave();
  return !save.tutorialCompleted && !save.tutorialOptOut;
}

export function setTutorialCompleted(completed = true) {
  const save = getSave();
  save.tutorialCompleted = !!completed;
  if (completed) {
    save.tutorialOptOut = false;
  }
  setSave(save);
}

export function setTutorialOptOut(optOut = true) {
  const save = getSave();
  save.tutorialOptOut = !!optOut;
  if (optOut) {
    save.tutorialCompleted = false;
  }
  setSave(save);
}

/**
 * Save manager: single JSON save (high score, settings) in localStorage.
 * Migrates from legacy skyfall_highscore. Optional cloud sync via onlineService (placeholder).
 */

import { createDifficultyProfile, generateDailyContracts, getContractDateKey } from "../game/contractDirector.js";

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
  colorBlindPaletteMode: "off",
  themeId: "skyfall"
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
  unlockTree: { ...DEFAULT_UNLOCK_TREE },
  contracts: {
    seedDate: "",
    expiresAt: "",
    difficultyKey: "",
    active: [],
    claimed: {}
  }
};

function normalizeMode(mode) {
  return mode || "Classic";
}

function getNextDateKey(dateKey) {
  const base = new Date(`${dateKey}T00:00:00.000Z`);
  base.setUTCDate(base.getUTCDate() + 1);
  return getContractDateKey(base);
}

function ensureContracts(save, date = new Date()) {
  const dateKey = getContractDateKey(date);
  const contracts = {
    ...DEFAULT_SAVE.contracts,
    ...(save.contracts || {}),
    claimed: { ...(save.contracts?.claimed || {}) }
  };
  const profile = createDifficultyProfile(save);

  const isExpired = !contracts.expiresAt || contracts.expiresAt <= dateKey;
  const profileChanged = contracts.difficultyKey !== profile.key;
  if (isExpired || profileChanged || !Array.isArray(contracts.active) || contracts.active.length === 0) {
    contracts.seedDate = dateKey;
    contracts.expiresAt = getNextDateKey(dateKey);
    contracts.difficultyKey = profile.key;
    contracts.active = generateDailyContracts({ dateKey, difficultyProfile: profile });
  } else {
    contracts.active = contracts.active.map((entry) => ({
      ...entry,
      claimed: Boolean(entry.claimed || contracts.claimed[entry.id])
    }));
  }

  save.contracts = contracts;
  return save;
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
  save = ensureContracts(save);
  return save;
}

/** Persist full save and optionally trigger cloud sync (placeholder). */
export function setSave(data) {
  const toWrite = ensureContracts(migrateSave(data));
  writeToStorage(toWrite);
  import("../services/onlineService.js").then(({ saveToCloud }) => {
    saveToCloud(toWrite, () => {});
  }).catch(() => {});
}

export function getMetaProgression() {
  const save = getSave();
  return {
    currency: save.metaCurrency ?? 0,
    unlockFragments: save.metaFragments ?? 0
  };
}

export function addMetaRewards({ currency = 0, fragments = 0 }) {
  const save = getSave();
  save.metaCurrency += Math.max(0, Math.floor(currency));
  save.metaFragments += Math.max(0, Math.floor(fragments));
  setSave(save);
  return getMetaProgression();
}

export function getActiveContracts() {
  return getSave().contracts.active;
}

export function updateContracts(updater) {
  const save = getSave();
  const current = save.contracts.active || [];
  const next = typeof updater === "function" ? updater(current) : current;
  save.contracts.active = Array.isArray(next) ? next : current;
  save.contracts.active.forEach((contract) => {
    if (contract.claimed) {
      save.contracts.claimed[contract.id] = true;
    }
  });
  setSave(save);
  return save.contracts.active;
}

export function claimCompletedContract(contractId) {
  const save = getSave();
  const contract = (save.contracts.active || []).find((entry) => entry.id === contractId);
  if (!contract || !contract.completed || contract.claimed || save.contracts.claimed[contractId]) {
    return null;
  }
  contract.claimed = true;
  save.contracts.claimed[contractId] = true;
  save.metaCurrency += contract.reward?.currency || 0;
  save.metaFragments += contract.reward?.fragments || 0;
  setSave(save);
  return contract.reward || null;
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

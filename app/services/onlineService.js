import { ACHIEVEMENTS } from "../config/achievements.js";
import {
  flushTelemetryBatch,
  getTelemetryBatch,
  setTelemetryUploadHook
} from "../game/telemetry.js";

const ONLINE_STATE_KEY = "skyfall_online_state";
const ONLINE_QUEUE_KEY = "skyfall_online_queue";
const MAX_RETRY_ATTEMPTS = 5;
const BASE_RETRY_MS = 1500;

function nowMs() {
  return Date.now();
}

function safeReadJson(key, fallback) {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (_) {
    // ignore
  }
}

function getDefaultState() {
  return {
    unlockedAchievements: {},
    leaderboardSubmissions: {},
    presence: "",
    sync: {
      queueLength: 0,
      lastError: null,
      lastSuccessAt: 0,
      retryScheduledAt: 0
    }
  };
}

function getState() {
  return { ...getDefaultState(), ...safeReadJson(ONLINE_STATE_KEY, {}) };
}

function setState(nextState) {
  safeWriteJson(ONLINE_STATE_KEY, nextState);
}

function getQueue() {
  const queue = safeReadJson(ONLINE_QUEUE_KEY, []);
  return Array.isArray(queue) ? queue : [];
}

function setQueue(queue) {
  safeWriteJson(ONLINE_QUEUE_KEY, queue);
}

function computeDailySeedLeaderboardId(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `daily_seed_${y}${m}${d}`;
}

function makeLocalAdapter() {
  return {
    name: "local",
    async unlockAchievement() {
      return { ok: true };
    },
    async submitLeaderboardScore() {
      return { ok: true };
    },
    async getLeaderboardEntries(_leaderboardId, _count) {
      return [];
    },
    async saveToCloud() {
      return { ok: true };
    },
    async loadFromCloud() {
      return null;
    },
    async setRichPresence() {
      return { ok: true };
    }
  };
}

function makeSteamAdapter(provider = {}) {
  return {
    name: "steam",
    async unlockAchievement(achievementId) {
      if (typeof provider.unlockAchievement !== "function") {
        throw new Error("Steam provider missing unlockAchievement");
      }
      return provider.unlockAchievement(achievementId);
    },
    async submitLeaderboardScore(leaderboardId, score) {
      if (typeof provider.submitLeaderboardScore !== "function") {
        throw new Error("Steam provider missing submitLeaderboardScore");
      }
      return provider.submitLeaderboardScore(leaderboardId, score);
    },
    async getLeaderboardEntries(leaderboardId, count) {
      if (typeof provider.getLeaderboardEntries !== "function") {
        return [];
      }
      return provider.getLeaderboardEntries(leaderboardId, count);
    },
    async saveToCloud(saveDataObject) {
      if (typeof provider.saveToCloud !== "function") {
        return { ok: true };
      }
      return provider.saveToCloud(saveDataObject);
    },
    async loadFromCloud() {
      if (typeof provider.loadFromCloud !== "function") {
        return null;
      }
      return provider.loadFromCloud();
    },
    async setRichPresence(statusString) {
      if (typeof provider.setRichPresence !== "function") {
        return { ok: true };
      }
      return provider.setRichPresence(statusString);
    }
  };
}

let activeAdapter = makeLocalAdapter();
let flushing = false;

function debug(...args) {
  if (!import.meta.env?.DEV) return;
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[online]", ...args);
  }
}

function updateSyncPatch(patch) {
  const state = getState();
  state.sync = { ...state.sync, ...patch };
  setState(state);
}

function queueOp(op) {
  const queue = getQueue();
  queue.push({
    ...op,
    attempt: 0,
    queuedAt: nowMs(),
    nextAttemptAt: nowMs()
  });
  setQueue(queue);
  updateSyncPatch({ queueLength: queue.length });
  scheduleFlush();
}

function scheduleFlush(delayMs = 0) {
  if (typeof setTimeout !== "function") return;
  setTimeout(() => {
    flushQueue().catch(() => {});
  }, delayMs);
}

export async function flushQueue() {
  if (flushing) return;
  flushing = true;
  try {
    let queue = getQueue();
    const stillPending = [];
    let earliestRetryAt = 0;

    for (let i = 0; i < queue.length; i += 1) {
      const item = queue[i];
      if ((item.nextAttemptAt ?? 0) > nowMs()) {
        stillPending.push(item);
        earliestRetryAt = earliestRetryAt ? Math.min(earliestRetryAt, item.nextAttemptAt) : item.nextAttemptAt;
        continue;
      }

      try {
        if (item.type === "achievement") {
          await activeAdapter.unlockAchievement(item.achievementId);
          persistAchievementUnlock(item.achievementId, true);
        } else if (item.type === "leaderboard") {
          await activeAdapter.submitLeaderboardScore(item.leaderboardId, item.score);
          persistLeaderboardSubmission(item.leaderboardId, item.score);
        } else if (item.type === "richPresence") {
          await activeAdapter.setRichPresence(item.statusString);
        }
        updateSyncPatch({ lastSuccessAt: nowMs(), lastError: null });
      } catch (error) {
        const attempt = (item.attempt ?? 0) + 1;
        if (attempt < MAX_RETRY_ATTEMPTS) {
          const delay = BASE_RETRY_MS * (2 ** (attempt - 1));
          const nextAttemptAt = nowMs() + delay;
          stillPending.push({ ...item, attempt, nextAttemptAt });
          earliestRetryAt = earliestRetryAt ? Math.min(earliestRetryAt, nextAttemptAt) : nextAttemptAt;
          updateSyncPatch({ lastError: String(error?.message || error), retryScheduledAt: nextAttemptAt });
        } else {
          updateSyncPatch({ lastError: `Dropped after retries: ${String(error?.message || error)}` });
        }
      }
    }

    setQueue(stillPending);
    updateSyncPatch({ queueLength: stillPending.length });
    if (earliestRetryAt && earliestRetryAt > nowMs()) {
      scheduleFlush(earliestRetryAt - nowMs());
    }
  } finally {
    flushing = false;
  }
}

function persistAchievementUnlock(achievementId, synced = false) {
  const state = getState();
  state.unlockedAchievements[achievementId] = {
    unlocked: true,
    synced,
    unlockedAt: nowMs()
  };
  setState(state);
}

function persistLeaderboardSubmission(leaderboardId, score) {
  const state = getState();
  state.leaderboardSubmissions[leaderboardId] = {
    score,
    submittedAt: nowMs()
  };
  setState(state);
}

function tryAdapter(action) {
  return action().catch(error => {
    debug("adapter call failed", error);
    throw error;
  });
}

export function setOnlineAdapter(adapter) {
  activeAdapter = adapter || makeLocalAdapter();
  scheduleFlush();
}

export function createLocalAdapter() {
  return makeLocalAdapter();
}

export function createSteamAdapter(provider) {
  return makeSteamAdapter(provider);
}

export function unlockAchievement(achievementId) {
  if (!achievementId || !ACHIEVEMENTS[achievementId]) return;
  const state = getState();
  if (state.unlockedAchievements[achievementId]?.unlocked) {
    return;
  }

  persistAchievementUnlock(achievementId, false);
  tryAdapter(() => activeAdapter.unlockAchievement(achievementId))
    .then(() => {
      persistAchievementUnlock(achievementId, true);
      updateSyncPatch({ lastSuccessAt: nowMs(), lastError: null });
    })
    .catch(() => {
      queueOp({ type: "achievement", achievementId });
    });
}

export function submitLeaderboardScore(leaderboardId, score) {
  if (!leaderboardId || typeof score !== "number" || Number.isNaN(score)) return;

  persistLeaderboardSubmission(leaderboardId, score);
  tryAdapter(() => activeAdapter.submitLeaderboardScore(leaderboardId, score))
    .then(() => updateSyncPatch({ lastSuccessAt: nowMs(), lastError: null }))
    .catch(() => queueOp({ type: "leaderboard", leaderboardId, score }));
}

export function submitRunLeaderboards({ runScore = 0, survivalSeconds = 0, dailySeedDate = new Date() } = {}) {
  submitLeaderboardScore("best_score", runScore);
  submitLeaderboardScore("longest_survival_sec", survivalSeconds);
  submitLeaderboardScore(computeDailySeedLeaderboardId(dailySeedDate), runScore);
}

export function getLeaderboardEntries(leaderboardId, count, callback) {
  tryAdapter(() => activeAdapter.getLeaderboardEntries(leaderboardId, count))
    .then(entries => {
      callback?.(Array.isArray(entries) ? entries : []);
    })
    .catch(() => {
      callback?.([]);
    });
}

export function saveToCloud(saveDataObject, callback) {
  tryAdapter(() => activeAdapter.saveToCloud(saveDataObject))
    .then(() => callback?.())
    .catch(() => callback?.());
}

export function loadFromCloud(callback) {
  tryAdapter(() => activeAdapter.loadFromCloud())
    .then(result => callback?.(result || null))
    .catch(() => callback?.(null));
}

export function setRichPresence(statusString) {
  const state = getState();
  if (state.presence === statusString) return;
  state.presence = statusString;
  setState(state);

  tryAdapter(() => activeAdapter.setRichPresence(statusString))
    .then(() => updateSyncPatch({ lastSuccessAt: nowMs(), lastError: null }))
    .catch(() => queueOp({ type: "richPresence", statusString }));
}

export function getOnlineStatus() {
  const state = getState();
  return {
    adapter: activeAdapter?.name || "local",
    queueLength: getQueue().length,
    sync: state.sync,
    achievements: state.unlockedAchievements,
    leaderboards: state.leaderboardSubmissions
  };
}

export function listAchievementStates() {
  const state = getState();
  return Object.values(ACHIEVEMENTS).map(def => ({
    ...def,
    unlocked: Boolean(state.unlockedAchievements[def.id]?.unlocked),
    synced: Boolean(state.unlockedAchievements[def.id]?.synced)
  }));
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushQueue().catch(() => {});
  });
}

export function getTelemetryQueueSize() {
  return getTelemetryBatch().length;
}

export function registerTelemetryUploader(uploadFn) {
  setTelemetryUploadHook(uploadFn);
}

export async function uploadTelemetryBatch(uploadFn) {
  const result = await flushTelemetryBatch(uploadFn);
  if (import.meta.env?.DEV && typeof console !== "undefined" && console.debug) {
    console.debug("[online] uploadTelemetryBatch:", result);
  }
  return result;
}

/**
 * Placeholder online service for achievements, leaderboards, cloud save.
 * Replace with Steamworks/backend implementation later.
 */

import {
  flushTelemetryBatch,
  getTelemetryBatch,
  setTelemetryUploadHook
} from "../game/telemetry.js";

export function unlockAchievement(achievementId) {
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[online] unlockAchievement:", achievementId);
  }
}

export function submitLeaderboardScore(leaderboardId, score) {
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[online] submitLeaderboardScore:", leaderboardId, score);
  }
}

export function getLeaderboardEntries(leaderboardId, count, callback) {
  if (typeof callback === "function") {
    callback([]);
  }
}

export function saveToCloud(saveDataObject, callback) {
  if (typeof callback === "function") {
    callback();
  }
}

export function loadFromCloud(callback) {
  if (typeof callback === "function") {
    callback(null);
  }
}

export function setRichPresence(statusString) {
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[online] setRichPresence:", statusString);
  }
}

export function getTelemetryQueueSize() {
  return getTelemetryBatch().length;
}

export function registerTelemetryUploader(uploadFn) {
  setTelemetryUploadHook(uploadFn);
}

export async function uploadTelemetryBatch(uploadFn) {
  const result = await flushTelemetryBatch(uploadFn);
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[online] uploadTelemetryBatch:", result);
  }
  return result;
}

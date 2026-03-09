/**
 * Placeholder online service for achievements, leaderboards, and cloud save.
 * Replace with Steamworks/backend implementation later.
 */

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

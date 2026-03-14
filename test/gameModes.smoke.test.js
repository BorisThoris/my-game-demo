import assert from "node:assert/strict";
import test from "node:test";
import { GAME_MODES, getModeConfig, normalizeGameMode } from "../app/game/modeConfig.js";
import { getHighScore, getSave, setHighScore, setSave } from "../app/save/saveManager.js";

function createMemoryStorage() {
  const mem = new Map();
  return {
    getItem(key) {
      return mem.has(key) ? mem.get(key) : null;
    },
    setItem(key, value) {
      mem.set(key, String(value));
    },
    removeItem(key) {
      mem.delete(key);
    }
  };
}

test("mode config initializes all supported modes", () => {
  assert.equal(normalizeGameMode("unknown"), GAME_MODES.Classic);
  assert.equal(getModeConfig(GAME_MODES.Classic).challengeScoreInterval, 12);
  assert.equal(getModeConfig(GAME_MODES.BossRush).bossCooldownScale < 1, true);
  assert.equal(getModeConfig(GAME_MODES.Draft).draftPerkIntervalSeconds, 20);
});

test("mode-separated highscore end-run persistence path", () => {
  globalThis.localStorage = createMemoryStorage();
  setSave({
    version: 1,
    highScore: 0,
    highScoresByMode: { Classic: 0, BossRush: 0, Draft: 0 },
    lastCompletedLevel: 0,
    settings: {},
    unlockedAchievements: []
  });

  setHighScore(21, GAME_MODES.Classic);
  setHighScore(15, GAME_MODES.BossRush);
  setHighScore(19, GAME_MODES.Draft);

  assert.equal(getHighScore(GAME_MODES.Classic), 21);
  assert.equal(getHighScore(GAME_MODES.BossRush), 15);
  assert.equal(getHighScore(GAME_MODES.Draft), 19);

  const save = getSave();
  assert.deepEqual(save.highScoresByMode, {
    Classic: 21,
    BossRush: 15,
    Draft: 19
  });
});

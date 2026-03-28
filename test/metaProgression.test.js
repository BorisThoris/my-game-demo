import assert from "node:assert/strict";
import test from "node:test";
import {
  applyUnlocksToModifiers,
  calculateMetaCurrencyReward,
  getNextUnlockHint,
  grantMetaCurrency,
  purchaseUnlock
} from "../app/game/metaProgression.js";
import { createBaseModifiers } from "../app/game/perkSystem.js";

function installStorage(initialSave) {
  let store = {
    skyfall_save: initialSave ? JSON.stringify(initialSave) : null
  };
  global.localStorage = {
    getItem(key) {
      return Object.hasOwn(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    removeItem(key) {
      delete store[key];
    }
  };
  return () => {
    delete global.localStorage;
  };
}

test("calculateMetaCurrencyReward follows reward rule contributions", () => {
  const reward = calculateMetaCurrencyReward({
    survivalTimeSec: 61,
    score: 88,
    bossClears: 2,
    objectivesCompleted: 1,
    challengesCompleted: 3
  });

  assert.equal(reward, 3 + 3 + 8 + 3 + 6);
});

test("purchaseUnlock enforces prerequisites and currency boundaries", () => {
  const cleanup = installStorage({
    version: 2,
    highScore: 0,
    lastCompletedLevel: 0,
    settings: {},
    unlockedAchievements: [],
    metaCurrency: 50,
    unlockTree: { unlockedNodes: [] }
  });

  const locked = purchaseUnlock("score-engine");
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, "missing-prerequisite");

  const bought = purchaseUnlock("quick-steps");
  assert.equal(bought.ok, true);

  const cannotAfford = purchaseUnlock("score-engine");
  assert.equal(cannotAfford.ok, false);
  assert.equal(cannotAfford.reason, "insufficient-currency");

  cleanup();
});

test("applyUnlocksToModifiers applies known unlocks and ignores unknown nodes", () => {
  const base = createBaseModifiers();
  const out = applyUnlocksToModifiers(base, {
    unlockedNodes: ["starter-shield", "quick-steps", "missing-node"]
  });

  assert.equal(out.maxShields, base.maxShields + 1);
  assert.ok(out.moveSpeedMultiplier > base.moveSpeedMultiplier);
  assert.equal(out.scoreMultiplier, base.scoreMultiplier);
});

test("getNextUnlockHint names next purchasable node", () => {
  const cleanup = installStorage({
    version: 2,
    highScore: 0,
    lastCompletedLevel: 0,
    settings: {},
    unlockedAchievements: [],
    metaCurrency: 5,
    lifetimeMetaEarned: 0,
    unlockTree: { unlockedNodes: [] },
    bestTimesByMode: { Classic: 0, BossRush: 0, Draft: 0 },
    highScoresByMode: { Classic: 0, BossRush: 0, Draft: 0 }
  });
  const hint = getNextUnlockHint();
  assert.match(hint.text, /meta to unlock|Unlock .+ now/);
  cleanup();
});

test("grantMetaCurrency increases lifetimeMetaEarned", () => {
  const cleanup = installStorage({
    version: 2,
    highScore: 0,
    lastCompletedLevel: 0,
    settings: {},
    unlockedAchievements: [],
    metaCurrency: 0,
    lifetimeMetaEarned: 0,
    unlockTree: { unlockedNodes: [] },
    bestTimesByMode: { Classic: 0, BossRush: 0, Draft: 0 },
    highScoresByMode: { Classic: 0, BossRush: 0, Draft: 0 }
  });
  const reward = grantMetaCurrency({
    survivalTimeSec: 40,
    score: 50,
    bossClears: 0,
    objectivesCompleted: 0,
    challengesCompleted: 0
  });
  assert.ok(reward > 0);
  const raw = JSON.parse(global.localStorage.getItem("skyfall_save"));
  assert.ok(raw.lifetimeMetaEarned >= reward);
  cleanup();
});

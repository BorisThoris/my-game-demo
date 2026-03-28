import assert from "node:assert/strict";
import test from "node:test";
import {
  getSettings,
  getSave,
  migrateSave,
  setSettings,
  setTutorialCompleted,
  setTutorialOptOut,
  shouldShowTutorial
} from "../app/save/saveManager.js";

test("migrateSave upgrades legacy saves with meta progression defaults", () => {
  const migrated = migrateSave({
    version: 1,
    highScore: 42,
    settings: { musicVolume: 0.3 }
  });

  assert.equal(migrated.version, 2);
  assert.equal(migrated.highScore, 42);
  assert.equal(migrated.metaCurrency, 0);
  assert.deepEqual(migrated.unlockTree, { unlockedNodes: [] });
  assert.equal(migrated.settings.musicVolume, 0.3);
  assert.equal(migrated.settings.sfxVolume, 1);
  assert.equal(migrated.settings.allowAnonymousAnalytics, false);
  assert.equal(migrated.settings.reduceMotionSafeMode, false);
  assert.deepEqual(migrated.bestTimesByMode, { Classic: 0, BossRush: 0, Draft: 0 });
  assert.equal(migrated.lifetimeMetaEarned, 0);
  assert.equal(migrated.tutorialCompleted, false);
  assert.equal(migrated.tutorialOptOut, false);
});

function makeStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    clear() {
      data.clear();
    }
  };
}

test("settings persistence includes accessibility fields", () => {
  global.localStorage = makeStorage();

  setSettings({
    screenShakeIntensity: 0.3,
    flashIntensity: 0.4,
    colorBlindPaletteMode: "deuteranopia"
  });

  const settings = getSettings();
  assert.equal(settings.screenShakeIntensity, 0.3);
  assert.equal(settings.flashIntensity, 0.4);
  assert.equal(settings.colorBlindPaletteMode, "deuteranopia");
});

test("tutorial gating toggles based on completion and opt-out persistence", () => {
  global.localStorage = makeStorage();

  assert.equal(shouldShowTutorial(), true);

  setTutorialCompleted(true);
  assert.equal(shouldShowTutorial(), false);
  assert.equal(getSave().tutorialCompleted, true);

  setTutorialCompleted(false);
  assert.equal(shouldShowTutorial(), true);

  setTutorialOptOut(true);
  assert.equal(shouldShowTutorial(), false);
  assert.equal(getSave().tutorialOptOut, true);

  setTutorialOptOut(false);
  assert.equal(shouldShowTutorial(), true);
});

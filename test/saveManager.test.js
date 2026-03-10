import assert from "node:assert/strict";
import test from "node:test";
import {
  getSettings,
  setSettings,
  shouldShowTutorial,
  setTutorialCompleted,
  setTutorialOptOut,
  getSave
} from "../app/save/saveManager.js";

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

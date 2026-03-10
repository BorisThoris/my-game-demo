import assert from "node:assert/strict";
import test from "node:test";
import { migrateSave } from "../app/save/saveManager.js";

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
});


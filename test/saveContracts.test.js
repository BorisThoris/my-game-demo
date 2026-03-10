import assert from "node:assert/strict";
import test from "node:test";
import {
  getSave,
  setSave,
  claimCompletedContract,
  updateContracts
} from "../app/save/saveManager.js";

function createStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear()
  };
}

test("claimCompletedContract enforces one-time claim", () => {
  global.localStorage = createStorage();
  const save = getSave();
  save.meta.currency = 0;
  save.meta.unlockFragments = 0;
  save.contracts.active = [
    {
      id: "boss-buster",
      title: "Boss Buster",
      metric: "bosses",
      target: 1,
      progress: 1,
      completed: true,
      claimed: false,
      reward: { currency: 55, fragments: 2 }
    }
  ];
  save.contracts.claimed = {};
  setSave(save);

  const first = claimCompletedContract("boss-buster");
  const second = claimCompletedContract("boss-buster");
  assert.deepEqual(first, { currency: 55, fragments: 2 });
  assert.equal(second, null);

  const updated = getSave();
  assert.equal(updated.meta.currency, 55);
  assert.equal(updated.meta.unlockFragments, 2);
});

test("updateContracts persists modified progress", () => {
  global.localStorage = createStorage();
  const save = getSave();
  save.contracts.active = [
    {
      id: "pickup-scout",
      title: "Pickup Scout",
      metric: "pickups",
      target: 3,
      progress: 0,
      completed: false,
      claimed: false,
      reward: { currency: 20, fragments: 1 }
    }
  ];
  setSave(save);

  updateContracts((active) => active.map((entry) => ({ ...entry, progress: 2 })));
  const updated = getSave();
  assert.equal(updated.contracts.active[0].progress, 2);
});

import assert from "node:assert/strict";
import test from "node:test";
import { rollBossReward, buildBossRewardPickup } from "../app/game/bossRewards.js";

function makeSeededRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

test("boss rewards are deterministic for seeded RNG", () => {
  const rng = makeSeededRng(42);
  const rewards = Array.from({ length: 6 }, () => rollBossReward({ rng }).rewardId);
  assert.deepEqual(rewards, [
    "tempo-drive",
    "shield-cache",
    "meta-fragment-small",
    "tempo-drive",
    "tempo-drive",
    "shield-cache"
  ]);
});

test("run relic rewards convert into pickup descriptors", () => {
  const basePickup = { x: 10, y: 20, pickupType: "shield", speed: 50 };
  const reward = { kind: "runRelic", pickupType: "invuln", label: "Aegis", rewardId: "r1" };
  const pickup = buildBossRewardPickup(basePickup, reward);

  assert.equal(pickup.pickupType, "invuln");
  assert.equal(pickup.rewardKind, "runRelic");
  assert.equal(pickup.rewardLabel, "Aegis");
  assert.equal(pickup.rewardId, "r1");
});

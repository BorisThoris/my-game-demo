import assert from "node:assert/strict";
import test from "node:test";
import {
  generateDailyContracts,
  createDifficultyProfile,
  getContractDateKey,
  applyRunEventToContracts
} from "../app/game/contractDirector.js";

test("contract date key rolls over by UTC date", () => {
  const first = getContractDateKey(new Date("2025-06-10T23:59:59.000Z"));
  const second = getContractDateKey(new Date("2025-06-11T00:00:00.000Z"));
  assert.equal(first, "2025-06-10");
  assert.equal(second, "2025-06-11");
});

test("daily contract generation is deterministic by date + profile", () => {
  const profile = createDifficultyProfile({ highScore: 160, lastCompletedLevel: 8 });
  const a = generateDailyContracts({ dateKey: "2025-06-10", difficultyProfile: profile });
  const b = generateDailyContracts({ dateKey: "2025-06-10", difficultyProfile: profile });
  assert.deepEqual(a, b);

  const c = generateDailyContracts({ dateKey: "2025-06-11", difficultyProfile: profile });
  assert.notDeepEqual(a.map(x => x.id), c.map(x => x.id));
});

test("runScore contract tracks peak score in run", () => {
  let contracts = [
    { id: "score-surge", metric: "runScore", target: 50, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "runScore", score: 30 });
  assert.equal(contracts[0].progress, 30);
  contracts = applyRunEventToContracts(contracts, { type: "runScore", score: 55 });
  assert.equal(contracts[0].progress, 50);
  assert.equal(contracts[0].completed, true);
});

test("contract progress updates from run events", () => {
  let contracts = [
    { id: "pickup-scout", metric: "pickups", target: 2, progress: 0, completed: false, claimed: false },
    { id: "iron-survivor", metric: "survivalMs", target: 2000, progress: 0, completed: false, claimed: false },
    { id: "style-master", metric: "archetypes", target: 1, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "pickup" });
  contracts = applyRunEventToContracts(contracts, { type: "pickup" });
  contracts = applyRunEventToContracts(contracts, { type: "survival", deltaMs: 2000 });
  contracts = applyRunEventToContracts(contracts, { type: "archetypeUsed", isNewArchetype: true });
  assert.equal(contracts[0].completed, true);
  assert.equal(contracts[1].completed, true);
  assert.equal(contracts[2].completed, true);
});

test("extended metrics: perks, hazards destroyed, run score, double progress", () => {
  let contracts = [
    { id: "perk-runner", metric: "perks", target: 2, progress: 0, completed: false, claimed: false },
    { id: "demolition-crew", metric: "hazardsDestroyed", target: 5, progress: 0, completed: false, claimed: false },
    { id: "score-surge", metric: "runScore", target: 30, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "perkTaken" });
  contracts = applyRunEventToContracts(contracts, { type: "perkTaken" });
  contracts = applyRunEventToContracts(contracts, { type: "hazardDestroyed", count: 5 });
  contracts = applyRunEventToContracts(contracts, { type: "runScore", score: 35 });
  assert.equal(contracts[0].completed, true);
  assert.equal(contracts[1].completed, true);
  assert.equal(contracts[2].completed, true);

  let doubled = applyRunEventToContracts(
    [{ id: "pickup-scout", metric: "pickups", target: 2, progress: 0, completed: false, claimed: false }],
    { type: "pickup" },
    { progressMultiplier: 2 }
  );
  assert.equal(doubled[0].progress, 2);
});

test("mega chain and gambit pickup metrics advance contracts", () => {
  let contracts = [
    { id: "chain-artist", metric: "megaChains", target: 2, progress: 0, completed: false, claimed: false },
    { id: "spark-hunter", metric: "gambits", target: 2, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "megaChain" });
  contracts = applyRunEventToContracts(contracts, { type: "megaChain" });
  contracts = applyRunEventToContracts(contracts, { type: "gambitPickup" });
  contracts = applyRunEventToContracts(contracts, { type: "gambitPickup" });
  assert.equal(contracts[0].completed, true);
  assert.equal(contracts[1].completed, true);
});

test("contract progress honors progressMultiplier for survival and pickups", () => {
  let contracts = [
    { id: "iron-survivor", metric: "survivalMs", target: 1000, progress: 0, completed: false, claimed: false },
    { id: "pickup-scout", metric: "pickups", target: 2, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "survival", deltaMs: 500 }, { progressMultiplier: 2 });
  assert.equal(contracts[0].progress, 1000);
  assert.equal(contracts[0].completed, true);
  contracts = applyRunEventToContracts(contracts, { type: "pickup" }, { progressMultiplier: 2 });
  assert.equal(contracts[1].progress, 2);
  assert.equal(contracts[1].completed, true);
});

test("perk and challenge metrics advance contracts", () => {
  let contracts = [
    { id: "p", metric: "perks", target: 2, progress: 0, completed: false, claimed: false },
    { id: "c", metric: "challenges", target: 2, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "perkTaken" });
  contracts = applyRunEventToContracts(contracts, { type: "perkTaken" });
  contracts = applyRunEventToContracts(contracts, { type: "challengeSuccess" });
  contracts = applyRunEventToContracts(contracts, { type: "challengeSuccess" });
  assert.equal(contracts[0].completed, true);
  assert.equal(contracts[1].completed, true);
});

test("hazard destroyed and perk events advance matching contracts", () => {
  let contracts = [
    { id: "demo", metric: "hazardsDestroyed", target: 5, progress: 0, completed: false, claimed: false },
    { id: "perk", metric: "perks", target: 2, progress: 0, completed: false, claimed: false }
  ];
  contracts = applyRunEventToContracts(contracts, { type: "hazardDestroyed", count: 3 });
  contracts = applyRunEventToContracts(contracts, { type: "perkTaken" });
  contracts = applyRunEventToContracts(contracts, { type: "perkTaken" });
  assert.equal(contracts[0].progress, 3);
  assert.equal(contracts[0].completed, false);
  contracts = applyRunEventToContracts(contracts, { type: "hazardDestroyed", count: 2 });
  assert.equal(contracts[0].completed, true);
  assert.equal(contracts[1].completed, true);
});

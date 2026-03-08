import assert from "node:assert/strict";
import test from "node:test";
import ObjectiveDirector from "../app/game/objectiveDirector.js";

test("ObjectiveDirector tracks pickup completion and emits one-time rewards", () => {
  const director = new ObjectiveDirector(() => 0);
  // rng=0 selects pickup-hunter and then survivor.
  for (let index = 0; index < 4; index += 1) {
    director.recordPickup();
  }

  const completed = director.consumeCompletedRewards();
  assert.equal(completed.some(entry => entry.id === "pickup-hunter"), true);

  const secondPass = director.consumeCompletedRewards();
  assert.equal(secondPass.length, 0);
});

test("ObjectiveDirector tracks survivor objective by time", () => {
  const director = new ObjectiveDirector(() => 0);
  director.recordSurvival(45000);
  const completed = director.consumeCompletedRewards();
  assert.equal(completed.some(entry => entry.id === "survivor"), true);
});

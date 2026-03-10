import assert from "node:assert/strict";
import test from "node:test";
import ChallengeDirector from "../app/game/challengeDirector.js";
import ObjectiveDirector from "../app/game/objectiveDirector.js";
import {
  clearTelemetryBatch,
  createRunId,
  emitBossOutcome,
  emitChallengePerformance,
  emitDeathSource,
  emitPickupUsage,
  emitRunEnd,
  emitRunStart,
  getTelemetryBatch,
  onTelemetryEvent
} from "../app/game/telemetry.js";

const installStorage = () => {
  const state = new Map();
  global.localStorage = {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, String(value));
    }
  };
};

test.beforeEach(() => {
  installStorage();
  clearTelemetryBatch();
});

test.afterEach(() => {
  delete global.localStorage;
});

test("telemetry emitter stores expected payload shapes for core events", () => {
  const runId = createRunId();
  const received = [];
  const unsub = onTelemetryEvent(event => received.push(event));

  emitRunStart({ runId, phase: "recovery", startingShields: 2 });
  emitPickupUsage({ runId, pickupType: "shield", scoreBefore: 4, shieldCharges: 1 });
  emitDeathSource({ runId, sourceType: "hazard", sourceTexture: "spikeball", shieldCharges: 0 });
  emitBossOutcome({ runId, bossName: "test", outcome: "cleared", durationMs: 5000 });
  emitChallengePerformance({ runId, challengeType: "math-rush", success: true, selectedIndex: 1, remainingMs: 1200 });
  emitRunEnd({ runId, score: 10, runTimeMs: 11000, exited: false });
  unsub();

  const stored = getTelemetryBatch();
  assert.equal(stored.length, 6);
  assert.equal(received.length, 6);
  assert.deepEqual(Object.keys(stored[0]).sort(), ["eventName", "phase", "runId", "startingShields", "timestamp"].sort());
  assert.equal(stored[1].pickupType, "shield");
  assert.equal(stored[2].sourceType, "hazard");
  assert.equal(stored[3].outcome, "cleared");
  assert.equal(stored[4].challengeType, "math-rush");
  assert.equal(stored[5].eventName, "run_end");
});

test("ChallengeDirector telemetry emits challenge evaluation shape", () => {
  const director = new ChallengeDirector(() => 0.2);
  const challenge = director.maybeCreateChallenge(12, 0.4);
  assert.ok(challenge);
  director.evaluate(challenge, challenge.correctIndex, 1000);

  const events = getTelemetryBatch().filter(event => event.eventName === "challenge_evaluated");
  assert.equal(events.length, 1);
  assert.equal(typeof events[0].success, "boolean");
  assert.equal(typeof events[0].selectedIndex, "number");
  assert.equal(typeof events[0].remainingMs, "number");
});

test("ObjectiveDirector telemetry emits completion and claim payloads", () => {
  const director = new ObjectiveDirector(() => 0);
  for (let index = 0; index < 4; index += 1) {
    director.recordPickup();
  }
  const rewards = director.consumeCompletedRewards();
  assert.ok(rewards.length > 0);

  const completed = getTelemetryBatch().find(event => event.eventName === "objective_completed");
  const claimed = getTelemetryBatch().find(event => event.eventName === "objective_reward_claimed");
  assert.ok(completed);
  assert.equal(typeof completed.objectiveId, "string");
  assert.ok(claimed);
  assert.equal(typeof claimed.reward.scoreBonus, "number");
});

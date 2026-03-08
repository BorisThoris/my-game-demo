import assert from "node:assert/strict";
import test from "node:test";
import RunnerSpawnDirector from "../app/game/runnerSpawnDirector.js";
import { RUNNER_PHASES } from "../app/game/runnerContent.js";

test("RunnerSpawnDirector loops through the cardio phases", () => {
  const director = new RunnerSpawnDirector(() => 0.99);

  RUNNER_PHASES.forEach(phase => {
    director.update(phase.durationMs + 1, 0, false);
  });

  assert.equal(director.getPhaseState().key, RUNNER_PHASES[0].key);
  assert.equal(director.cycleCount, 1);
});

test("RunnerSpawnDirector only emits a miniboss from heat windows", () => {
  const director = new RunnerSpawnDirector(() => 0);
  director.phaseIndex = 2;
  director.phaseElapsedMs = 0;
  director.bossCooldownMs = 0;
  director.timeUntilNextPatternMs = 0;

  const heatUpdate = director.update(16, 25, false);
  assert.equal(heatUpdate.events.some(event => event.kind === "boss"), true);

  director.reset();
  director.phaseIndex = 0;
  director.bossCooldownMs = 0;
  director.timeUntilNextPatternMs = 0;

  const recoveryUpdate = director.update(16, 25, false);
  assert.equal(recoveryUpdate.events.some(event => event.kind === "boss"), false);
});

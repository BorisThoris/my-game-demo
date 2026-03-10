import assert from "node:assert/strict";
import test from "node:test";
import { getBossAttackProfile, shouldEnterPhaseTwo } from "../app/game/bossEncounter.js";

const CONFIG = {
  durationMs: 8000,
  phaseShiftAtRatio: 0.5,
  attackCadenceMs: 900,
  projectileCount: 4,
  projectileSpread: 120,
  phaseShiftCadenceFactor: 0.7,
  phaseShiftProjectileBonus: 2,
  phaseShiftSpreadFactor: 1.25,
  attackSignatures: ["fan", "cross"],
  telegraphMs: { fan: 380, cross: 460 }
};

test("boss shifts into phase two at 50% duration", () => {
  assert.equal(shouldEnterPhaseTwo(CONFIG, 3999, false), false);
  assert.equal(shouldEnterPhaseTwo(CONFIG, 4000, false), true);
  assert.equal(shouldEnterPhaseTwo(CONFIG, 5000, true), false);
});

test("phase two attack profile tightens cadence and changes signature", () => {
  const phaseOne = getBossAttackProfile(CONFIG, 1);
  const phaseTwo = getBossAttackProfile(CONFIG, 2);

  assert.equal(phaseOne.signature, "fan");
  assert.equal(phaseTwo.signature, "cross");
  assert.equal(phaseTwo.cadenceMs, 630);
  assert.equal(phaseTwo.projectileCount, 6);
  assert.equal(phaseTwo.projectileSpread, 150);
  assert.equal(phaseTwo.telegraphMs, 460);
});

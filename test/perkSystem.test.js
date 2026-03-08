import assert from "node:assert/strict";
import test from "node:test";
import {
  applyPerk,
  buildPerkChoices,
  createBaseModifiers
} from "../app/game/perkSystem.js";

test("perk choices exclude owned perks", () => {
  const owned = ["kinetic-boots", "overclock"];
  const choices = buildPerkChoices(owned, () => 0, 3);

  assert.equal(choices.some(choice => owned.includes(choice.id)), false);
  assert.ok(choices.length >= 1);
});

test("applyPerk updates modifiers", () => {
  const base = createBaseModifiers();
  const boosted = applyPerk(base, "kinetic-boots");
  const shields = applyPerk(boosted, "magnetic-core");

  assert.ok(shields.moveSpeedMultiplier > 1);
  assert.equal(shields.maxShields, base.maxShields + 1);
});

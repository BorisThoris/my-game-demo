import assert from "node:assert/strict";
import test from "node:test";
import { applyPerk, createBaseModifiers } from "../app/game/perkSystem.js";
import {
  applyArchetypeToModifiers,
  createArchetypeBaseModifiers,
  getArchetypeById
} from "../app/game/archetypeSystem.js";

test("applyArchetypeToModifiers applies archetype deltas", () => {
  const base = createBaseModifiers();
  const striker = applyArchetypeToModifiers(base, "striker");

  assert.equal(striker.maxShields, 2);
  assert.ok(striker.moveSpeedMultiplier > base.moveSpeedMultiplier);
  assert.ok(striker.challengeScoreMultiplier > base.challengeScoreMultiplier);
});

test("archetype modifiers stack with perk modifiers", () => {
  const archetypeBase = createArchetypeBaseModifiers("vanguard");
  const withSpeedPerk = applyPerk(archetypeBase, "kinetic-boots");
  const withShieldPerk = applyPerk(withSpeedPerk, "magnetic-core");

  assert.equal(withShieldPerk.maxShields, 5);
  assert.ok(withShieldPerk.moveSpeedMultiplier > archetypeBase.moveSpeedMultiplier);
});

test("unknown archetype id falls back to all-rounder", () => {
  const fallback = getArchetypeById("unknown-id");
  assert.equal(fallback.id, "all-rounder");
});

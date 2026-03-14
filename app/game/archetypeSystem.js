import { createBaseModifiers } from "./perkSystem.js";

export const ARCHETYPE_LIBRARY = Object.freeze([
  {
    id: "all-rounder",
    name: "All-Rounder",
    description: "Balanced loadout with no modifier changes.",
    deltas: {}
  },
  {
    id: "vanguard",
    name: "Vanguard",
    description: "+1 shield capacity, but slightly slower movement.",
    deltas: {
      maxShieldsFlat: 1,
      moveSpeedMultiplierMult: 0.94
    }
  },
  {
    id: "striker",
    name: "Striker",
    description: "Faster movement and challenge payout at the cost of shield capacity.",
    deltas: {
      moveSpeedMultiplierMult: 1.1,
      challengeScoreMultiplierMult: 1.15,
      maxShieldsFlat: -1
    }
  },
  {
    id: "scavenger",
    name: "Scavenger",
    description: "Extra pickup score and better challenge rewards, but shorter invulnerability.",
    deltas: {
      extraScorePerPickupFlat: 2,
      challengeScoreMultiplierMult: 1.1,
      invulnerabilityMsFlat: -200
    }
  }
]);

export function getArchetypeById(archetypeId) {
  return ARCHETYPE_LIBRARY.find((entry) => entry.id === archetypeId) || ARCHETYPE_LIBRARY[0];
}

export function applyArchetypeToModifiers(baseModifiers, archetypeId) {
  const archetype = getArchetypeById(archetypeId);
  const deltas = archetype.deltas || {};
  return {
    ...baseModifiers,
    moveSpeedMultiplier: (baseModifiers.moveSpeedMultiplier ?? 1) * (deltas.moveSpeedMultiplierMult ?? 1),
    maxShields: Math.max(1, (baseModifiers.maxShields ?? 3) + (deltas.maxShieldsFlat ?? 0)),
    challengeScoreMultiplier: (baseModifiers.challengeScoreMultiplier ?? 1) * (deltas.challengeScoreMultiplierMult ?? 1),
    invulnerabilityMs: Math.max(300, (baseModifiers.invulnerabilityMs ?? 1150) + (deltas.invulnerabilityMsFlat ?? 0)),
    extraScorePerPickup: (baseModifiers.extraScorePerPickup ?? 0) + (deltas.extraScorePerPickupFlat ?? 0)
  };
}

export function createArchetypeBaseModifiers(archetypeId) {
  return applyArchetypeToModifiers(createBaseModifiers(), archetypeId);
}

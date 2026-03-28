import { getContractDateKey, stringHash } from "./contractDirector.js";

/** Daily rules rotate by UTC date. Shipped with rare risk-burst pickup (AGENT-06); modifiers stay readable together. */
const MODIFIERS = [
  {
    id: "swift-day",
    menuLine: "Today: +10% move speed.",
    applyToRun(modifiers) {
      return { ...modifiers, moveSpeedMultiplier: modifiers.moveSpeedMultiplier * 1.1 };
    }
  },
  {
    id: "bulwark-day",
    menuLine: "Today: +1 starting shield.",
    applyToRun(modifiers) {
      return { ...modifiers, maxShields: modifiers.maxShields + 1 };
    }
  },
  {
    id: "gilded-contracts",
    menuLine: "Today: double daily contract progress.",
    contractProgressMultiplier: 2,
    applyToRun(modifiers) {
      return { ...modifiers };
    }
  },
  {
    id: "calm-skies",
    menuLine: "Today: slower hazard fall speed.",
    fallSpeedScale: 0.9,
    applyToRun(modifiers) {
      return { ...modifiers };
    }
  },
  {
    id: "focused-challenges",
    menuLine: "Today: +8% challenge score bonus.",
    applyToRun(modifiers) {
      return {
        ...modifiers,
        challengeScoreMultiplier: modifiers.challengeScoreMultiplier * 1.08
      };
    }
  }
];

/**
 * @param {string} [dateKey] UTC YYYY-MM-DD from getContractDateKey
 */
export function getDailyModifierForDateKey(dateKey = getContractDateKey()) {
  const idx = stringHash(`daily-mod:${dateKey}`) % MODIFIERS.length;
  return MODIFIERS[idx];
}

/**
 * @param {object} baseModifiers run modifiers after meta + archetype (caller merges order)
 * @param {string} [dateKey]
 * @returns {{ modifiers: object, contractProgressMultiplier: number, fallSpeedScale: number, menuLine: string, passiveScorePerSec: number }}
 */
export function applyDailyModifier(baseModifiers, dateKey = getContractDateKey()) {
  const mod = getDailyModifierForDateKey(dateKey);
  return {
    modifiers: mod.applyToRun(baseModifiers),
    contractProgressMultiplier: mod.contractProgressMultiplier ?? 1,
    fallSpeedScale: mod.fallSpeedScale ?? 1,
    menuLine: mod.menuLine,
    passiveScorePerSec: mod.passiveScorePerSec ?? 0
  };
}

/**
 * @deprecated Prefer applyDailyModifier on merged run modifiers; kept for incremental refactors.
 */
export function getDailyModifierProfile(dateKey = getContractDateKey()) {
  const base = {
    moveSpeedMultiplier: 1,
    maxShields: 3,
    challengeScoreMultiplier: 1,
    invulnerabilityMs: 1150,
    extraScorePerPickup: 0
  };
  const applied = applyDailyModifier(base, dateKey);
  const moveMult = applied.modifiers.moveSpeedMultiplier / base.moveSpeedMultiplier;
  const extraShields = applied.modifiers.maxShields - base.maxShields;
  return {
    contractProgressMult: applied.contractProgressMultiplier,
    fallMult: applied.fallSpeedScale,
    passiveScorePerSec: applied.passiveScorePerSec,
    moveMult: Math.abs(moveMult - 1) < 1e-9 ? 1 : moveMult,
    extraShields,
    menuLine: applied.menuLine
  };
}

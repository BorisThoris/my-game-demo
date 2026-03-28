import { getSave, setSave } from "../save/saveManager.js";
import { unlockAchievement } from "../services/onlineService.js";

export const META_UNLOCK_NODES = {
  "starter-shield": {
    id: "starter-shield",
    label: "Extra Shield",
    description: "Start each run with +1 shield.",
    cost: 20,
    prereqs: [],
    effect: { maxShields: 1 }
  },
  "quick-steps": {
    id: "quick-steps",
    label: "Quick Steps",
    description: "Gain +8% movement speed.",
    cost: 30,
    prereqs: [],
    effect: { moveSpeedMultiplier: 0.08 }
  },
  "score-engine": {
    id: "score-engine",
    label: "Score Engine",
    description: "Gain +10% score multiplier.",
    cost: 45,
    prereqs: ["quick-steps"],
    effect: { scoreMultiplier: 0.1 }
  },
  "focus-core": {
    id: "focus-core",
    label: "Focus Core",
    description: "Challenge score multiplier +15%.",
    cost: 40,
    prereqs: ["starter-shield"],
    effect: { challengeScoreMultiplier: 0.15 }
  },
  "iron-lining": {
    id: "iron-lining",
    label: "Iron Lining",
    description: "+220ms invulnerability after a hit.",
    cost: 38,
    prereqs: ["starter-shield"],
    effect: { invulnerabilityMs: 220 }
  },
  "gilded-touch": {
    id: "gilded-touch",
    label: "Gilded Touch",
    description: "+1 score from every pickup.",
    cost: 48,
    prereqs: ["score-engine"],
    effect: { extraScorePerPickup: 1 }
  },
  "tailwind-coil": {
    id: "tailwind-coil",
    label: "Tailwind Coil",
    description: "+6% move speed.",
    cost: 42,
    prereqs: ["focus-core"],
    effect: { moveSpeedMultiplier: 0.06 }
  },
  "arc-stabilizer": {
    id: "arc-stabilizer",
    label: "Arc Stabilizer",
    description: "+120ms invulnerability after a hit.",
    cost: 44,
    prereqs: ["tailwind-coil"],
    effect: { invulnerabilityMs: 120 }
  }
};

const clampInt = value => Math.max(0, Math.floor(Number(value) || 0));

export function getMetaState() {
  const save = getSave();
  return {
    metaCurrency: clampInt(save.metaCurrency),
    unlockTree: {
      unlockedNodes: Array.isArray(save.unlockTree?.unlockedNodes)
        ? save.unlockTree.unlockedNodes.filter(nodeId => META_UNLOCK_NODES[nodeId])
        : []
    }
  };
}

/** One-line hint for meta UI / game over (display-only). */
export function getNextUnlockHint() {
  const state = getMetaState();
  const unlocked = new Set(state.unlockTree.unlockedNodes);
  const remaining = Object.values(META_UNLOCK_NODES).filter(n => !unlocked.has(n.id));
  if (remaining.length === 0) {
    return { text: "All meta unlocks owned." };
  }
  const candidates = remaining.filter(n => n.prereqs.every(reqId => unlocked.has(reqId)));
  if (candidates.length === 0) {
    remaining.sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
    const gate = remaining[0];
    return { text: `Earn meta and meet prerequisites for ${gate.label}.` };
  }
  candidates.sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
  const next = candidates[0];
  const need = next.cost - state.metaCurrency;
  if (need <= 0) {
    return { text: `Unlock ${next.label} now in Meta.` };
  }
  return { text: `+${need} meta to unlock ${next.label}.` };
}

export function calculateMetaCurrencyReward(runSummary = {}) {
  const survivalSeconds = clampInt(runSummary.survivalTimeSec);
  const score = clampInt(runSummary.score);
  const bossClears = clampInt(runSummary.bossClears);
  const objectivesCompleted = clampInt(runSummary.objectivesCompleted);
  const challengesCompleted = clampInt(runSummary.challengesCompleted);

  return (
    Math.floor(survivalSeconds / 20)
    + Math.floor(score / 25)
    + bossClears * 4
    + objectivesCompleted * 3
    + challengesCompleted * 2
  );
}

export function grantMetaCurrency(runSummary = {}) {
  const reward = calculateMetaCurrencyReward(runSummary);
  if (reward <= 0) {
    return 0;
  }

  const save = getSave();
  const prevLife = clampInt(save.lifetimeMetaEarned);
  save.metaCurrency = clampInt(save.metaCurrency) + reward;
  save.lifetimeMetaEarned = prevLife + reward;
  setSave(save);
  if (prevLife < 100 && save.lifetimeMetaEarned >= 100) {
    unlockAchievement("meta_lifetime_100");
  }
  if (prevLife < 500 && save.lifetimeMetaEarned >= 500) {
    unlockAchievement("meta_lifetime_500");
  }
  return reward;
}

export function purchaseUnlock(nodeId) {
  const node = META_UNLOCK_NODES[nodeId];
  if (!node) {
    return { ok: false, reason: "unknown-node" };
  }

  const save = getSave();
  const priorUnlocked = Array.isArray(save.unlockTree?.unlockedNodes) ? save.unlockTree.unlockedNodes.length : 0;
  const unlocked = new Set(Array.isArray(save.unlockTree?.unlockedNodes) ? save.unlockTree.unlockedNodes : []);
  if (unlocked.has(nodeId)) {
    return { ok: false, reason: "already-unlocked" };
  }

  const missingReq = node.prereqs.find(reqId => !unlocked.has(reqId));
  if (missingReq) {
    return { ok: false, reason: "missing-prerequisite", missingReq };
  }

  const metaCurrency = clampInt(save.metaCurrency);
  if (metaCurrency < node.cost) {
    return { ok: false, reason: "insufficient-currency", cost: node.cost, balance: metaCurrency };
  }

  unlocked.add(nodeId);
  save.metaCurrency = metaCurrency - node.cost;
  save.unlockTree = { unlockedNodes: [...unlocked] };
  setSave(save);
  if (priorUnlocked === 0) {
    unlockAchievement("meta_first_purchase");
  }
  return { ok: true, nodeId, remainingCurrency: save.metaCurrency };
}

export function applyUnlocksToModifiers(baseModifiers, unlockTree) {
  const unlocked = Array.isArray(unlockTree?.unlockedNodes)
    ? unlockTree.unlockedNodes
    : [];
  const modifiers = { ...baseModifiers };

  unlocked.forEach(nodeId => {
    const effect = META_UNLOCK_NODES[nodeId]?.effect;
    if (!effect) {
      return;
    }
    if (effect.maxShields) {
      modifiers.maxShields += effect.maxShields;
    }
    if (effect.moveSpeedMultiplier) {
      modifiers.moveSpeedMultiplier *= 1 + effect.moveSpeedMultiplier;
    }
    if (effect.scoreMultiplier) {
      const base = modifiers.scoreMultiplier ?? 1;
      modifiers.scoreMultiplier = base * (1 + effect.scoreMultiplier);
    }
    if (effect.challengeScoreMultiplier) {
      modifiers.challengeScoreMultiplier *= 1 + effect.challengeScoreMultiplier;
    }
    if (effect.invulnerabilityMs) {
      modifiers.invulnerabilityMs += effect.invulnerabilityMs;
    }
    if (effect.extraScorePerPickup) {
      modifiers.extraScorePerPickup = (modifiers.extraScorePerPickup ?? 0) + effect.extraScorePerPickup;
    }
  });

  return modifiers;
}

export function getRunStartModifiers(baseModifiers) {
  const state = getMetaState();
  return applyUnlocksToModifiers(baseModifiers, state.unlockTree);
}

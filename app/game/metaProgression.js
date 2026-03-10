import { getSave, setSave } from "../save/saveManager.js";

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
  save.metaCurrency = clampInt(save.metaCurrency) + reward;
  setSave(save);
  return reward;
}

export function purchaseUnlock(nodeId) {
  const node = META_UNLOCK_NODES[nodeId];
  if (!node) {
    return { ok: false, reason: "unknown-node" };
  }

  const save = getSave();
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
      modifiers.scoreMultiplier *= 1 + effect.scoreMultiplier;
    }
    if (effect.challengeScoreMultiplier) {
      modifiers.challengeScoreMultiplier *= 1 + effect.challengeScoreMultiplier;
    }
  });

  return modifiers;
}

export function getRunStartModifiers(baseModifiers) {
  const state = getMetaState();
  return applyUnlocksToModifiers(baseModifiers, state.unlockTree);
}

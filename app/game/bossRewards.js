const BOSS_REWARD_TABLE = [
  {
    id: "shield-cache",
    weight: 2,
    reward: {
      kind: "runRelic",
      pickupType: "shield",
      label: "Aegis Cache"
    }
  },
  {
    id: "tempo-drive",
    weight: 2,
    reward: {
      kind: "runRelic",
      pickupType: "speed",
      label: "Tempo Drive"
    }
  },
  {
    id: "focus-prism",
    weight: 1,
    reward: {
      kind: "runRelic",
      pickupType: "scoreMult",
      label: "Focus Prism"
    }
  },
  {
    id: "meta-fragment-small",
    weight: 3,
    reward: {
      kind: "metaFragment",
      fragments: 1,
      label: "Core Fragment"
    }
  },
  {
    id: "meta-fragment-large",
    weight: 1,
    reward: {
      kind: "metaFragment",
      fragments: 2,
      label: "Prismatic Fragment"
    }
  }
];

export function rollBossReward({ rng = Math.random } = {}) {
  const totalWeight = BOSS_REWARD_TABLE.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = rng() * totalWeight;

  for (const entry of BOSS_REWARD_TABLE) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      return { ...entry.reward, rewardId: entry.id };
    }
  }

  const fallback = BOSS_REWARD_TABLE[0];
  return { ...fallback.reward, rewardId: fallback.id };
}

export function buildBossRewardPickup(basePickup, reward) {
  if (!reward || reward.kind !== "runRelic") {
    return null;
  }

  return {
    ...basePickup,
    pickupType: reward.pickupType,
    rewardLabel: reward.label,
    rewardKind: reward.kind,
    rewardId: reward.rewardId
  };
}

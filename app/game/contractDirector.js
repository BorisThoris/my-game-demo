const CONTRACT_POOL = [
  {
    id: "pickup-scout",
    title: "Pickup Scout",
    description: "Collect {target} pickups.",
    metric: "pickups",
    baseTarget: 4,
    growthPerDifficulty: 2,
    rewardBase: { currency: 30, fragments: 1 }
  },
  {
    id: "iron-survivor",
    title: "Iron Survivor",
    description: "Survive for {seconds}s.",
    metric: "survivalMs",
    baseTarget: 30000,
    growthPerDifficulty: 8000,
    rewardBase: { currency: 45, fragments: 1 }
  },
  {
    id: "boss-buster",
    title: "Boss Buster",
    description: "Clear {target} boss waves.",
    metric: "bosses",
    baseTarget: 1,
    growthPerDifficulty: 1,
    rewardBase: { currency: 55, fragments: 2 }
  },
  {
    id: "style-master",
    title: "Style Master",
    description: "Use {target} unique archetypes in a run.",
    metric: "archetypes",
    baseTarget: 2,
    growthPerDifficulty: 1,
    rewardBase: { currency: 40, fragments: 2 }
  }
];

function stringHash(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function getContractDateKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createDifficultyProfile({ highScore = 0, lastCompletedLevel = 0 } = {}) {
  const scoreTier = Math.min(4, Math.floor(highScore / 40));
  const levelTier = Math.min(4, Math.floor(lastCompletedLevel / 3));
  const tier = Math.min(4, Math.max(scoreTier, levelTier));
  return {
    tier,
    key: `tier-${tier}`
  };
}

function buildContract(definition, difficultyTier) {
  const target = Math.max(1, Math.round(definition.baseTarget + definition.growthPerDifficulty * difficultyTier));
  const seconds = Math.ceil(target / 1000);
  return {
    id: definition.id,
    title: definition.title,
    description: definition.description
      .replace("{target}", String(target))
      .replace("{seconds}", String(seconds)),
    metric: definition.metric,
    target,
    progress: 0,
    completed: false,
    claimed: false,
    reward: {
      currency: definition.rewardBase.currency + difficultyTier * 10,
      fragments: definition.rewardBase.fragments + Math.floor(difficultyTier / 2)
    }
  };
}

export function generateDailyContracts({ dateKey, difficultyProfile, count = 3 }) {
  const safeDateKey = dateKey || getContractDateKey();
  const safeProfile = difficultyProfile || { tier: 0, key: "tier-0" };
  const seed = stringHash(`${safeDateKey}:${safeProfile.key}`);
  const random = createSeededRandom(seed);
  const pool = [...CONTRACT_POOL];
  const contracts = [];

  while (contracts.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    contracts.push(buildContract(pool[index], safeProfile.tier));
    pool.splice(index, 1);
  }

  return contracts;
}

export function applyRunEventToContracts(contracts, event) {
  if (!Array.isArray(contracts) || !event) {
    return contracts || [];
  }

  return contracts.map((contract) => {
    if (contract.completed) {
      return contract;
    }

    let nextProgress = contract.progress;
    if (event.type === "pickup" && contract.metric === "pickups") {
      nextProgress += 1;
    }
    if (event.type === "survival" && contract.metric === "survivalMs") {
      nextProgress += event.deltaMs || 0;
    }
    if (event.type === "bossClear" && contract.metric === "bosses") {
      nextProgress += 1;
    }
    if (event.type === "archetypeUsed" && contract.metric === "archetypes" && event.isNewArchetype) {
      nextProgress += 1;
    }

    const completed = nextProgress >= contract.target;
    return {
      ...contract,
      progress: completed ? contract.target : nextProgress,
      completed
    };
  });
}

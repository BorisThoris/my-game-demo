export const GAME_MODES = Object.freeze({
  Classic: "Classic",
  BossRush: "BossRush",
  Draft: "Draft"
});

const MODE_CONFIGS = Object.freeze({
  [GAME_MODES.Classic]: {
    label: "Classic",
    description: "Balanced survival loop with standard boss/challenge cadence.",
    bossCooldownScale: 1,
    fillerHazardSpawnChance: 1,
    challengeScoreInterval: 12,
    draftPerkIntervalSeconds: null
  },
  [GAME_MODES.BossRush]: {
    label: "Boss Rush",
    description: "Bosses appear more frequently and filler hazards are thinned out.",
    bossCooldownScale: 0.4,
    fillerHazardSpawnChance: 0.55,
    challengeScoreInterval: 18,
    draftPerkIntervalSeconds: null
  },
  [GAME_MODES.Draft]: {
    label: "Draft",
    description: "Forced perk drafts every 20 seconds with lighter challenge pressure.",
    bossCooldownScale: 0.85,
    fillerHazardSpawnChance: 0.9,
    challengeScoreInterval: 20,
    draftPerkIntervalSeconds: 20
  }
});

export function normalizeGameMode(mode) {
  return MODE_CONFIGS[mode] ? mode : GAME_MODES.Classic;
}

export function getModeConfig(mode) {
  return MODE_CONFIGS[normalizeGameMode(mode)];
}

export function getModeList() {
  return Object.values(GAME_MODES).map(mode => ({ mode, ...MODE_CONFIGS[mode] }));
}

export function isHazardDescriptor(descriptor) {
  return descriptor?.kind === "hazard" || descriptor?.kind === "projectile";
}

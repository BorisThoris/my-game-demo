export const ACHIEVEMENTS = {
  first_run: { id: "first_run", title: "First Record", description: "Set your first best score." },
  score_50: { id: "score_50", title: "50 Up", description: "Reach score 50 in one run." },
  score_100: { id: "score_100", title: "Century", description: "Reach score 100 in one run." },
  score_250: { id: "score_250", title: "Skyline", description: "Reach score 250 in one run." },
  score_400: { id: "score_400", title: "Ascent", description: "Reach score 400 in one run." },
  score_500: { id: "score_500", title: "Zenith", description: "Reach score 500 in one run." },
  survive_three_min: {
    id: "survive_three_min",
    title: "Long Fall",
    description: "Survive three minutes in one run."
  },
  boss_clear_1: { id: "boss_clear_1", title: "Boss Breaker", description: "Clear a boss wave." },
  boss_clear_5: { id: "boss_clear_5", title: "Boss Veteran", description: "Clear 5 boss waves in a run." },
  challenge_streak_3: { id: "challenge_streak_3", title: "In The Zone", description: "Complete 3 challenges in a row." },
  challenge_streak_5: { id: "challenge_streak_5", title: "Perfect Cadence", description: "Complete 5 challenges in a row." },
  no_hit_30s: { id: "no_hit_30s", title: "Untouched", description: "Survive 30 seconds without taking damage." },
  no_hit_60s: { id: "no_hit_60s", title: "Ghost Runner", description: "Survive 60 seconds without taking damage." },
  hazard_demolisher_20: {
    id: "hazard_demolisher_20",
    title: "Demolisher",
    description: "Destroy 20+ hazards in one run."
  },
  risk_gambit: { id: "risk_gambit", title: "Gambit Spark", description: "Collect a surge orb (risk pickup)." },
  meta_first_purchase: {
    id: "meta_first_purchase",
    title: "Invested",
    description: "Buy your first meta tree unlock."
  },
  boss_rush_century: {
    id: "boss_rush_century",
    title: "Rush Century",
    description: "Score 100+ in Boss Rush in one run."
  },
  run_five_perks: {
    id: "run_five_perks",
    title: "Loaded Build",
    description: "End a run with five or more perks."
  },
  challenge_triple_run: {
    id: "challenge_triple_run",
    title: "Triple Break",
    description: "Clear three challenges in one run."
  },
  meta_lifetime_100: {
    id: "meta_lifetime_100",
    title: "Meta Trail",
    description: "Earn 100 lifetime meta currency across runs."
  },
  meta_lifetime_500: {
    id: "meta_lifetime_500",
    title: "Meta Hoarder",
    description: "Earn 500 lifetime meta currency across runs."
  },
  feat_pure_mobility: {
    id: "feat_pure_mobility",
    title: "Pure Stride",
    description: "Take three or more perks, all mobility-tagged."
  },
  feat_triad_build: {
    id: "feat_triad_build",
    title: "Triad Runner",
    description: "Take perks spanning mobility, defense, and score tags in one run."
  }
};

export const SCORE_ACHIEVEMENT_MILESTONES = [
  { score: 50, achievementId: "score_50" },
  { score: 100, achievementId: "score_100" },
  { score: 250, achievementId: "score_250" },
  { score: 400, achievementId: "score_400" },
  { score: 500, achievementId: "score_500" }
];

export const NO_HIT_WINDOWS_MS = [
  { ms: 30_000, achievementId: "no_hit_30s" },
  { ms: 60_000, achievementId: "no_hit_60s" }
];

export const CHALLENGE_STREAK_ACHIEVEMENTS = [
  { streak: 3, achievementId: "challenge_streak_3" },
  { streak: 5, achievementId: "challenge_streak_5" }
];

export const BOSS_CLEAR_ACHIEVEMENTS = [
  { clears: 1, achievementId: "boss_clear_1" },
  { clears: 5, achievementId: "boss_clear_5" }
];

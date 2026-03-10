export const ACHIEVEMENTS = {
  first_run: { id: "first_run", title: "First Record", description: "Set your first best score." },
  score_50: { id: "score_50", title: "50 Up", description: "Reach score 50 in one run." },
  score_100: { id: "score_100", title: "Century", description: "Reach score 100 in one run." },
  score_250: { id: "score_250", title: "Skyline", description: "Reach score 250 in one run." },
  boss_clear_1: { id: "boss_clear_1", title: "Boss Breaker", description: "Clear a boss wave." },
  boss_clear_5: { id: "boss_clear_5", title: "Boss Veteran", description: "Clear 5 boss waves in a run." },
  challenge_streak_3: { id: "challenge_streak_3", title: "In The Zone", description: "Complete 3 challenges in a row." },
  challenge_streak_5: { id: "challenge_streak_5", title: "Perfect Cadence", description: "Complete 5 challenges in a row." },
  no_hit_30s: { id: "no_hit_30s", title: "Untouched", description: "Survive 30 seconds without taking damage." },
  no_hit_60s: { id: "no_hit_60s", title: "Ghost Runner", description: "Survive 60 seconds without taking damage." }
};

export const SCORE_ACHIEVEMENT_MILESTONES = [
  { score: 50, achievementId: "score_50" },
  { score: 100, achievementId: "score_100" },
  { score: 250, achievementId: "score_250" }
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

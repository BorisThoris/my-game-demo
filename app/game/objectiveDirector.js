import { emitTelemetryEvent } from "./telemetry.js";

const OBJECTIVE_DEFS = [
  {
    id: "pickup-hunter",
    title: "Pickup Hunter",
    description: "Collect 4 powerups this run.",
    target: 4,
    reward: { scoreBonus: 7, shieldBonus: 1, perkPoint: 0 }
  },
  {
    id: "survivor",
    title: "Survivor",
    description: "Stay alive for 45 seconds.",
    target: 45000,
    reward: { scoreBonus: 9, shieldBonus: 0, perkPoint: 1 }
  },
  {
    id: "boss-breaker",
    title: "Boss Breaker",
    description: "Outlast one mini-boss wave.",
    target: 1,
    reward: { scoreBonus: 10, shieldBonus: 1, perkPoint: 1 }
  }
];

const cloneObjective = definition => ({
  ...definition,
  progress: 0,
  completed: false,
  claimed: false
});

export default class ObjectiveDirector {
  constructor(random = Math.random) {
    this.random = random;
    this.objectives = [];
    this.reset();
  }

  reset() {
    const pool = [...OBJECTIVE_DEFS];
    this.objectives = [];

    while (this.objectives.length < 2 && pool.length > 0) {
      const index = Math.floor(this.random() * pool.length);
      this.objectives.push(cloneObjective(pool[index]));
      pool.splice(index, 1);
    }

    emitTelemetryEvent("objectives_reset", {
      objectiveIds: this.objectives.map(objective => objective.id)
    });
  }

  getObjectives() {
    return this.objectives;
  }

  recordPickup() {
    this.increment("pickup-hunter", 1);
  }

  recordSurvival(deltaMs) {
    this.increment("survivor", deltaMs);
  }

  recordBossClear() {
    this.increment("boss-breaker", 1);
  }

  increment(id, amount) {
    const objective = this.objectives.find(entry => entry.id === id);
    if (!objective || objective.completed) {
      return;
    }

    objective.progress += amount;
    if (objective.progress >= objective.target) {
      objective.progress = objective.target;
      objective.completed = true;
      emitTelemetryEvent("objective_completed", {
        objectiveId: objective.id,
        progress: objective.progress,
        target: objective.target
      });
    }
  }

  consumeCompletedRewards() {
    const newlyCompleted = this.objectives.filter(
      objective => objective.completed && !objective.claimed
    );
    newlyCompleted.forEach(objective => {
      objective.claimed = true;
      emitTelemetryEvent("objective_reward_claimed", {
        objectiveId: objective.id,
        reward: objective.reward
      });
    });
    return newlyCompleted;
  }
}

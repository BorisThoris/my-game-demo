import {
  BOSS_TRIGGER_SCORE,
  PATTERN_LIBRARY,
  RUNNER_PHASES,
  buildMiniBossWave,
  buildRunnerContext
} from "./runnerContent.js";

const INITIAL_PATTERN_DELAY_MS = 950;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const weightedPick = (entries, rng) => {
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = rng() * totalWeight;

  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor <= 0) {
      return entry.pattern;
    }
  }

  return entries[entries.length - 1]?.pattern ?? null;
};

export default class RunnerSpawnDirector {
  constructor(random = Math.random) {
    this.random = random;
    this.reset();
  }

  reset() {
    this.elapsedMs = 0;
    this.phaseIndex = 0;
    this.phaseElapsedMs = 0;
    this.cycleCount = 0;
    this.pendingSpawns = [];
    this.timeUntilNextPatternMs = INITIAL_PATTERN_DELAY_MS;
    this.bossCooldownMs = 15000;
  }

  getPhaseState() {
    return RUNNER_PHASES[this.phaseIndex];
  }

  getContext(score) {
    return buildRunnerContext({
      score,
      phaseIndex: this.phaseIndex,
      phaseElapsedMs: this.phaseElapsedMs,
      cycleCount: this.cycleCount
    });
  }

  update(deltaMs, score, bossActive = false) {
    this.elapsedMs += deltaMs;
    this.phaseElapsedMs += deltaMs;

    while (this.phaseElapsedMs >= this.getPhaseState().durationMs) {
      this.phaseElapsedMs -= this.getPhaseState().durationMs;
      this.phaseIndex = (this.phaseIndex + 1) % RUNNER_PHASES.length;

      if (this.phaseIndex === 0) {
        this.cycleCount += 1;
      }
    }

    if (!bossActive && this.bossCooldownMs > 0) {
      this.bossCooldownMs -= deltaMs;
    }

    const context = this.getContext(score);
    const events = this.flushPendingSpawns(deltaMs);

    if (!bossActive) {
      this.timeUntilNextPatternMs -= deltaMs;

      if (this.pendingSpawns.length === 0 && this.timeUntilNextPatternMs <= 0) {
        if (this.shouldSpawnBoss(context, score)) {
          events.push(buildMiniBossWave(context, this.random));
          this.bossCooldownMs = 22000 - Math.min(context.intensity, 1) * 5000;
          this.timeUntilNextPatternMs = 1800;
        } else {
          const pattern = this.pickPattern(context);

          if (pattern) {
            const descriptors = pattern.build(context, this.random);
            let furthestDelayMs = 0;

            descriptors.forEach(descriptor => {
              const delayMs = descriptor.delayMs ?? 0;
              furthestDelayMs = Math.max(furthestDelayMs, delayMs);

              if (delayMs <= 0) {
                events.push(descriptor);
                return;
              }

              this.pendingSpawns.push({
                remainingMs: delayMs,
                descriptor
              });
            });

            this.timeUntilNextPatternMs =
              this.nextPatternDelay(context) + furthestDelayMs * 0.35;
          } else {
            this.timeUntilNextPatternMs = this.nextPatternDelay(context);
          }
        }
      }
    }

    return {
      events,
      context
    };
  }

  flushPendingSpawns(deltaMs) {
    const ready = [];
    const waiting = [];

    this.pendingSpawns.forEach(entry => {
      const remainingMs = entry.remainingMs - deltaMs;

      if (remainingMs <= 0) {
        ready.push(entry.descriptor);
        return;
      }

      waiting.push({
        ...entry,
        remainingMs
      });
    });

    this.pendingSpawns = waiting;
    return ready;
  }

  nextPatternDelay(context) {
    const minDelay = 600;
    const maxDelay = 1550;
    const intensity = Math.min(context.intensity, 1);
    const baseline = maxDelay - (maxDelay - minDelay) * intensity;
    const jitter = 120 + this.random() * 240;

    return baseline + jitter;
  }

  shouldSpawnBoss(context, score) {
    if (
      score < BOSS_TRIGGER_SCORE ||
      context.phaseKey !== "heat" ||
      this.bossCooldownMs > 0
    ) {
      return false;
    }

    const chance = clamp(0.28 + this.cycleCount * 0.04, 0.28, 0.44);
    return this.random() <= chance;
  }

  pickPattern(context) {
    const eligiblePatterns = PATTERN_LIBRARY.filter(pattern => {
      if (!pattern.phases.includes(context.phaseKey)) {
        return false;
      }

      if (
        pattern.minIntensity !== undefined &&
        context.intensity < pattern.minIntensity
      ) {
        return false;
      }

      if (
        pattern.maxIntensity !== undefined &&
        context.intensity > pattern.maxIntensity
      ) {
        return false;
      }

      return true;
    }).map(pattern => ({
      pattern,
      weight:
        typeof pattern.weight === "function"
          ? pattern.weight(context)
          : pattern.weight
    }));

    return weightedPick(eligiblePatterns, this.random);
  }
}

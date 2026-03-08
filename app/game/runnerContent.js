import { GAME_WIDTH } from "../config/gameConfig.js";

const SPAWN_Y = -140;
const SAFE_MARGIN = 110;
const LANES = [136, 316, 496, 676, 856, 1036, 1160];

export const EXIT_UNLOCK_SCORE = 35;
export const BOSS_TRIGGER_SCORE = 18;

export const RUNNER_PHASES = [
  {
    key: "recovery",
    label: "Recovery",
    durationMs: 9000,
    pressure: 0.26,
    color: 0x55d6ff
  },
  {
    key: "push",
    label: "Push",
    durationMs: 7000,
    pressure: 0.52,
    color: 0xffd166
  },
  {
    key: "heat",
    label: "Heat",
    durationMs: 9000,
    pressure: 0.9,
    color: 0xff6b6b
  },
  {
    key: "reset",
    label: "Reset",
    durationMs: 6000,
    pressure: 0.38,
    color: 0x8be9b1
  }
];

export const OBSTACLE_LIBRARY = {
  meteor: {
    texture: "runner-orb",
    tint: 0xffa94d,
    scale: [0.7, 1.15],
    speedFactor: 1,
    rotationSpeed: 180,
    hitbox: {
      shape: "circle",
      radius: 34
    }
  },
  shard: {
    texture: "runner-wedge",
    tint: 0xff6b6b,
    scale: [0.65, 1.05],
    speedFactor: 1.08,
    rotationSpeed: 220,
    hitbox: {
      shape: "box",
      width: 96,
      height: 64,
      offsetY: 14
    }
  },
  crusher: {
    texture: "runner-beam",
    tint: 0x7bed9f,
    scaleX: [0.72, 1.08],
    scaleY: [0.86, 1.08],
    speedFactor: 0.92,
    hitbox: {
      shape: "box",
      width: 168,
      height: 26
    }
  },
  zigzag: {
    texture: "runner-diamond",
    tint: 0x74c0fc,
    scale: [0.8, 1.08],
    speedFactor: 1.04,
    rotationSpeed: 150,
    hitbox: {
      shape: "circle",
      radius: 32
    },
    motion: {
      type: "sway",
      amplitude: 84,
      frequency: 3.2
    }
  },
  sentinel: {
    texture: "runner-gate",
    tint: 0xd0bfff,
    scale: [0.78, 1],
    speedFactor: 0.96,
    rotationSpeed: 90,
    hitbox: {
      shape: "circle",
      radius: 42
    },
    motion: {
      type: "sway",
      amplitude: 46,
      frequency: 2.4
    }
  }
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const lerp = (start, end, amount) => start + (end - start) * amount;

const randomBetween = (min, max, rng) => min + (max - min) * rng();

const randomScale = (range, rng) => randomBetween(range[0], range[1], rng);

const shuffle = (items, rng) => {
  const clone = [...items];

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }

  return clone;
};

const pickLanes = (count, rng) => shuffle(LANES, rng).slice(0, count);

const pickRandomX = rng => randomBetween(SAFE_MARGIN, GAME_WIDTH - SAFE_MARGIN, rng);

const createHazard = (type, context, rng, overrides = {}) => {
  const template = OBSTACLE_LIBRARY[type];
  const baseScale = template.scale ? randomScale(template.scale, rng) : 1;
  const scaleX =
    overrides.scaleX ??
    (template.scaleX ? randomScale(template.scaleX, rng) : baseScale);
  const scaleY =
    overrides.scaleY ??
    (template.scaleY ? randomScale(template.scaleY, rng) : baseScale);
  const motion =
    overrides.motion === null
      ? { type: "none" }
      : {
          ...(template.motion ?? { type: "none" }),
          ...(overrides.motion ?? {})
        };

  return {
    kind: "hazard",
    type,
    texture: template.texture,
    tint: overrides.tint ?? template.tint,
    x: overrides.x ?? pickRandomX(rng),
    y: overrides.y ?? SPAWN_Y,
    speed:
      overrides.speed ??
      context.fallSpeed * template.speedFactor +
        randomBetween(-35, 40, rng),
    scaleX,
    scaleY,
    hitbox: overrides.hitbox ?? template.hitbox,
    rotationSpeed: overrides.rotationSpeed ?? template.rotationSpeed ?? 0,
    motion,
    delayMs: overrides.delayMs ?? 0,
    alpha: overrides.alpha ?? 1
  };
};

const createPickup = (context, rng, overrides = {}) => ({
  kind: "pickup",
  texture: "powerUp",
  tint: overrides.tint ?? 0xffffff,
  x: overrides.x ?? pickRandomX(rng),
  y: overrides.y ?? SPAWN_Y,
  speed: overrides.speed ?? context.fallSpeed * 0.72,
  scaleX: overrides.scaleX ?? 0.18,
  scaleY: overrides.scaleY ?? 0.18,
  hitbox: overrides.hitbox ?? {
    shape: "circle",
    radius: 96
  },
  rotationSpeed: overrides.rotationSpeed ?? 180,
  motion: {
    type: "sway",
    amplitude: overrides.amplitude ?? 26,
    frequency: overrides.frequency ?? 2.6,
    phaseOffset: overrides.phaseOffset ?? randomBetween(0, Math.PI * 2, rng)
  },
  delayMs: overrides.delayMs ?? 0
});

export const PATTERN_LIBRARY = [
  {
    key: "soft-single",
    phases: ["recovery", "push", "reset"],
    maxIntensity: 0.56,
    weight: 5,
    build(context, rng) {
      const [lane] = pickLanes(1, rng);
      return [
        createHazard(rng() > 0.45 ? "meteor" : "shard", context, rng, {
          x: lane
        })
      ];
    }
  },
  {
    key: "pickup-pocket",
    phases: ["recovery", "push", "reset"],
    maxIntensity: 0.72,
    weight: 4,
    build(context, rng) {
      const [hazardLane, pickupLane] = pickLanes(2, rng);
      return [
        createHazard("meteor", context, rng, { x: hazardLane }),
        createPickup(context, rng, {
          x: pickupLane,
          delayMs: 200
        })
      ];
    }
  },
  {
    key: "twin-drop",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.34,
    weight: 4,
    build(context, rng) {
      const [leftLane, rightLane] = pickLanes(2, rng);
      return [
        createHazard("meteor", context, rng, { x: leftLane }),
        createHazard("shard", context, rng, {
          x: rightLane,
          delayMs: 80
        })
      ];
    }
  },
  {
    key: "stagger-rain",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.46,
    weight: 4,
    build(context, rng) {
      return pickLanes(3, rng).map((lane, index) =>
        createHazard(index === 1 ? "crusher" : "meteor", context, rng, {
          x: lane,
          delayMs: index * 120
        })
      );
    }
  },
  {
    key: "sway-pair",
    phases: ["push", "heat"],
    minIntensity: 0.54,
    weight: 4,
    build(context, rng) {
      return pickLanes(2, rng).map((lane, index) =>
        createHazard("zigzag", context, rng, {
          x: lane,
          delayMs: index * 110,
          motion: {
            phaseOffset: randomBetween(0, Math.PI * 2, rng)
          }
        })
      );
    }
  },
  {
    key: "crusher-pocket",
    phases: ["push", "heat"],
    minIntensity: 0.6,
    weight: 4,
    build(context, rng) {
      const [mainLane, followLane] = pickLanes(2, rng);
      return [
        createHazard("crusher", context, rng, { x: mainLane }),
        createHazard("meteor", context, rng, {
          x: followLane,
          delayMs: 170
        })
      ];
    }
  },
  {
    key: "heat-spread",
    phases: ["heat"],
    minIntensity: 0.76,
    weight: 5,
    build(context, rng) {
      return pickLanes(4, rng).map((lane, index) =>
        createHazard(index % 2 === 0 ? "shard" : "meteor", context, rng, {
          x: lane,
          delayMs: index * 80,
          scaleX: 0.82,
          scaleY: 0.82
        })
      );
    }
  },
  {
    key: "heat-mixer",
    phases: ["heat"],
    minIntensity: 0.84,
    weight: 4,
    build(context, rng) {
      const [leftLane, centerLane, rightLane] = pickLanes(3, rng);
      return [
        createHazard("sentinel", context, rng, { x: centerLane }),
        createHazard("zigzag", context, rng, {
          x: leftLane,
          delayMs: 120,
          motion: {
            amplitude: 104,
            frequency: 3.7,
            phaseOffset: randomBetween(0, Math.PI * 2, rng)
          }
        }),
        createHazard("shard", context, rng, {
          x: rightLane,
          delayMs: 220
        })
      ];
    }
  }
];

export const buildRunnerContext = ({ score, phaseIndex, phaseElapsedMs, cycleCount }) => {
  const phase = RUNNER_PHASES[phaseIndex];
  const scorePressure = clamp(score / 90, 0, 0.28);
  const cyclePressure = clamp(cycleCount * 0.07, 0, 0.22);
  const intensity = clamp(
    phase.pressure + scorePressure + cyclePressure,
    0.2,
    1.2
  );

  return {
    score,
    cycleCount,
    intensity,
    phaseKey: phase.key,
    phaseLabel: phase.label,
    phaseColor: phase.color,
    phaseDurationMs: phase.durationMs,
    phaseProgress: clamp(phaseElapsedMs / phase.durationMs, 0, 1),
    fallSpeed: lerp(260, 700, Math.min(intensity, 1)),
    backgroundSpeed: lerp(14, 40, Math.min(intensity, 1))
  };
};

export const buildMiniBossWave = (context, rng) => ({
  kind: "boss",
  name: "Storm Core",
  texture: "runner-boss",
  tint: 0xff7c6b,
  x: GAME_WIDTH / 2,
  y: -180,
  scaleX: 1,
  scaleY: 1,
  hitbox: {
    shape: "circle",
    radius: 70
  },
  holdX: GAME_WIDTH / 2,
  holdY: 126,
  entrySpeed: 220 + context.intensity * 45,
  exitSpeed: 300 + context.intensity * 40,
  driftAmplitude: 250,
  driftFrequency: 1.1 + context.intensity * 0.25,
  durationMs: 7000 + context.intensity * 2000,
  attackCadenceMs: 960 - Math.min(context.intensity, 1) * 220,
  projectileCount: context.intensity > 0.85 ? 5 : 4,
  projectileSpeed: context.fallSpeed + 140,
  projectileSpread: 120,
  rewardPickup: createPickup(context, rng, {
    x: pickRandomX(rng),
    y: 80,
    speed: context.fallSpeed * 0.58,
    amplitude: 30,
    frequency: 2.2
  })
});

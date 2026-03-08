import { GAME_WIDTH, GAME_HEIGHT } from "../config/gameConfig.js";

const SPAWN_Y = -140;
const SAFE_MARGIN = 110;
const LANES = [136, 316, 496, 676, 856, 1036, 1160];

const DIAG = 0.707; // 1/sqrt(2) for 45° diagonals

/** Spawn edges: where things come from. Unlock with intensity for dynamic stages. */
export const SPAWN_EDGES = {
  top: {
    xRange: [SAFE_MARGIN, GAME_WIDTH - SAFE_MARGIN],
    yRange: [SPAWN_Y, SPAWN_Y],
    velocityX: 0,
    velocityY: 1
  },
  bottom: {
    xRange: [SAFE_MARGIN, GAME_WIDTH - SAFE_MARGIN],
    yRange: [GAME_HEIGHT + 80, GAME_HEIGHT + 80],
    velocityX: 0,
    velocityY: -1
  },
  left: {
    xRange: [-80, -80],
    yRange: [120, GAME_HEIGHT - 120],
    velocityX: 1,
    velocityY: 0
  },
  right: {
    xRange: [GAME_WIDTH + 80, GAME_WIDTH + 80],
    yRange: [120, GAME_HEIGHT - 120],
    velocityX: -1,
    velocityY: 0
  },
  topLeft: {
    xRange: [-100, -60],
    yRange: [-100, -60],
    velocityX: DIAG,
    velocityY: DIAG
  },
  topRight: {
    xRange: [GAME_WIDTH + 60, GAME_WIDTH + 100],
    yRange: [-100, -60],
    velocityX: -DIAG,
    velocityY: DIAG
  },
  bottomLeft: {
    xRange: [-100, -60],
    yRange: [GAME_HEIGHT + 60, GAME_HEIGHT + 100],
    velocityX: DIAG,
    velocityY: -DIAG
  },
  bottomRight: {
    xRange: [GAME_WIDTH + 60, GAME_WIDTH + 100],
    yRange: [GAME_HEIGHT + 60, GAME_HEIGHT + 100],
    velocityX: -DIAG,
    velocityY: -DIAG
  }
};

// Scaled for 20+ minute sessions: slower ramp, longer phases, exit/boss later
export const EXIT_UNLOCK_SCORE = 120;
export const BOSS_TRIGGER_SCORE = 28;

export const RUNNER_PHASES = [
  {
    key: "recovery",
    label: "Recovery",
    durationMs: 22000,
    pressure: 0.26,
    color: 0x55d6ff
  },
  {
    key: "push",
    label: "Push",
    durationMs: 18000,
    pressure: 0.52,
    color: 0xffd166
  },
  {
    key: "heat",
    label: "Heat",
    durationMs: 22000,
    pressure: 0.9,
    color: 0xff6b6b
  },
  {
    key: "reset",
    label: "Reset",
    durationMs: 15000,
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
const pickRandomY = rng => randomBetween(120, GAME_HEIGHT - 120, rng);

/** Which edges unlock at which intensity (ramp for dynamic stages). */
function getAllowedSpawnEdges(intensity) {
  const edges = ["top"];
  if (intensity >= 0.32) edges.push("left", "right");
  if (intensity >= 0.48) edges.push("bottom");
  if (intensity >= 0.58) edges.push("topLeft", "topRight");
  if (intensity >= 0.72) edges.push("bottomLeft", "bottomRight");
  return edges;
}

function pickSpawnEdge(context, rng) {
  const allowed = context.allowedSpawnEdges || ["top"];
  return allowed[Math.floor(rng() * allowed.length)];
}

function resolveSpawnPositionAndVelocity(edgeKey, speed, rng) {
  const edge = SPAWN_EDGES[edgeKey] || SPAWN_EDGES.top;
  const [xMin, xMax] = edge.xRange;
  const [yMin, yMax] = edge.yRange;
  const x = xMin === xMax ? xMin : randomBetween(xMin, xMax, rng);
  const y = yMin === yMax ? yMin : randomBetween(yMin, yMax, rng);
  const velocityX = edge.velocityX * speed;
  const velocityY = edge.velocityY * speed;
  return { x, y, velocityX, velocityY };
}

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

  const speed =
    overrides.speed ??
    context.fallSpeed * template.speedFactor +
      randomBetween(-35, 40, rng);

  const spawnEdge = overrides.spawnEdge ?? pickSpawnEdge(context, rng);
  let x; let y; let velocityX; let velocityY;
  if (overrides.x !== undefined && overrides.y !== undefined) {
    x = overrides.x;
    y = overrides.y;
    velocityX = 0;
    velocityY = speed;
  } else if (spawnEdge !== "top") {
    const resolved = resolveSpawnPositionAndVelocity(spawnEdge, Math.abs(speed), rng);
    x = resolved.x;
    y = resolved.y;
    velocityX = resolved.velocityX;
    velocityY = resolved.velocityY;
  } else {
    x = overrides.x ?? pickRandomX(rng);
    y = overrides.y ?? SPAWN_Y;
    velocityX = 0;
    velocityY = speed;
  }

  return {
    kind: "hazard",
    type,
    texture: template.texture,
    tint: overrides.tint ?? template.tint,
    x,
    y,
    speed: Math.abs(speed),
    velocityX: overrides.velocityX ?? velocityX,
    velocityY: overrides.velocityY ?? velocityY,
    scaleX,
    scaleY,
    hitbox: overrides.hitbox ?? template.hitbox,
    rotationSpeed: overrides.rotationSpeed ?? template.rotationSpeed ?? 0,
    motion,
    delayMs: overrides.delayMs ?? 0,
    alpha: overrides.alpha ?? 1
  };
};

const createPickup = (context, rng, overrides = {}) => {
  const speed = overrides.speed ?? context.fallSpeed * 0.72;
  const spawnEdge = overrides.spawnEdge ?? "top";
  const { x, y, velocityX, velocityY } =
    spawnEdge !== "top"
      ? resolveSpawnPositionAndVelocity(spawnEdge, Math.abs(speed), rng)
      : {
          x: overrides.x ?? pickRandomX(rng),
          y: overrides.y ?? SPAWN_Y,
          velocityX: 0,
          velocityY: speed
        };

  return {
    kind: "pickup",
    texture: "powerUp",
    tint: overrides.tint ?? 0xffffff,
    x: overrides.x ?? x,
    y: overrides.y ?? y,
    speed: Math.abs(speed),
    velocityX: overrides.velocityX ?? velocityX,
    velocityY: overrides.velocityY ?? velocityY,
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
  };
};

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
  },
  {
    key: "side-rush",
    phases: ["push", "heat"],
    minIntensity: 0.38,
    weight: 3,
    build(context, rng) {
      const fromLeft = rng() > 0.5;
      return [
        createHazard("meteor", context, rng, { spawnEdge: fromLeft ? "left" : "right" }),
        createHazard("shard", context, rng, {
          spawnEdge: fromLeft ? "right" : "left",
          delayMs: 200
        })
      ];
    }
  },
  {
    key: "bottom-rise",
    phases: ["push", "heat"],
    minIntensity: 0.5,
    weight: 3,
    build(context, rng) {
      return [
        createHazard("crusher", context, rng, { spawnEdge: "bottom" }),
        createHazard("meteor", context, rng, {
          spawnEdge: "bottom",
          delayMs: 180
        })
      ];
    }
  },
  {
    key: "diagonal-cross",
    phases: ["heat"],
    minIntensity: 0.62,
    weight: 4,
    build(context, rng) {
      const corners = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
      const [a, b] = shuffle(corners, rng).slice(0, 2);
      return [
        createHazard("zigzag", context, rng, { spawnEdge: a }),
        createHazard("shard", context, rng, {
          spawnEdge: b,
          delayMs: 120
        })
      ];
    }
  },
  {
    key: "flank-pincer",
    phases: ["heat"],
    minIntensity: 0.7,
    weight: 3,
    build(context, rng) {
      return [
        createHazard("meteor", context, rng, { spawnEdge: "left" }),
        createHazard("meteor", context, rng, { spawnEdge: "right", delayMs: 90 }),
        createHazard("sentinel", context, rng, { spawnEdge: "bottom", delayMs: 200 })
      ];
    }
  }
];

export const buildRunnerContext = ({ score, phaseIndex, phaseElapsedMs, cycleCount }) => {
  const phase = RUNNER_PHASES[phaseIndex];
  const scorePressure = clamp(score / 350, 0, 0.28);
  const cyclePressure = clamp(cycleCount * 0.016, 0, 0.22);
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
    backgroundSpeed: lerp(14, 40, Math.min(intensity, 1)),
    allowedSpawnEdges: getAllowedSpawnEdges(intensity)
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

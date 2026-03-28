import { GAME_WIDTH, GAME_HEIGHT, theme } from "../config/gameConfig.js";
import { getTintModifierFromSeed, getHitboxFromProceduralParams } from "./proceduralSprites.js";

const palette = theme.colors.palette;
const game = theme.colors.semantic.game;

const SPAWN_Y = -140;
const SPAWN_Y_TOP_BAND = 50; // y jitter when spawning from top (SPAWN_Y to SPAWN_Y + SPAWN_Y_TOP_BAND)
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

/** Score per level (level = 1 + floor(score / LEVEL_SCORE_STEP)). Run save stores last completed = current level - 1. */
export const LEVEL_SCORE_STEP = 15;

/** Current level from score (1-based). Used for run save: on exit we save lastCompletedLevel = level - 1. */
export function getCurrentLevelFromScore(score) {
  return Math.max(1, 1 + Math.floor((score || 0) / LEVEL_SCORE_STEP));
}

export const RUNNER_PHASES = [
  { key: "recovery", label: "Recovery", durationMs: 22000, pressure: 0.26, color: palette.runPhaseRecovery },
  { key: "push", label: "Push", durationMs: 18000, pressure: 0.52, color: palette.runPhasePush },
  { key: "heat", label: "Heat (faster rain)", durationMs: 22000, pressure: 0.9, color: palette.runPhaseHeat },
  { key: "reset", label: "Reset", durationMs: 15000, pressure: 0.38, color: palette.runPhaseReset }
];

/**
 * Obstacle shapes and their click-to-destroy behavior (memorable by shape):
 * - Round/orbs (meteor, ring, drone): clean — just disappears.
 * - Pulse (glow orb): lingering — leaves a damage zone for a short time.
 * - Pointy/angular (shard, zigzag, star): splitter — breaks into smaller pieces in a star pattern.
 * - Beams/gates/bolt (crusher, cross, slicer, sentinel, spinner, hex, streak): debris launcher — explodes into debris that can chain and hit the player.
 */
export const OBSTACLE_LIBRARY = {
  meteor: {
    texture: "runner-orb",
    tint: palette.meteorTint,
    tintVariant: palette.meteorVariant,
    tintVariantChance: 0.25,
    scale: [0.7, 1.15],
    speedFactor: 1,
    rotationSpeed: 180,
    destroyArchetype: "clean",
    hitbox: {
      shape: "circle",
      radius: 34
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "orb",
        seed: rng() * 1e9,
        radius: 28 + rng() * 32,
        ringCount: 1 + Math.floor(rng() * 3.5),
        innerRatio: 0.25 + rng() * 0.5
      };
    }
  },
  shard: {
    texture: "runner-wedge",
    tint: palette.shardTint,
    tintVariant: palette.shardVariant,
    tintVariantChance: 0.2,
    scale: [0.65, 1.05],
    speedFactor: 1.08,
    rotationSpeed: 220,
    destroyArchetype: "splitter",
    splitCount: 5,
    hitbox: {
      shape: "box",
      width: 96,
      height: 64,
      offsetY: 14
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "wedge",
        seed: rng() * 1e9,
        points: 3,
        width: 120 + rng() * 24,
        height: 84 + rng() * 20,
        skew: (rng() - 0.5) * 40
      };
    }
  },
  crusher: {
    texture: "runner-beam",
    tint: palette.crusherTint,
    scaleX: [0.72, 1.08],
    scaleY: [0.86, 1.08],
    speedFactor: 0.92,
    destroyArchetype: "debrisLauncher",
    debrisCount: 8,
    hitbox: {
      shape: "box",
      width: 168,
      height: 26
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "beam",
        seed: rng() * 1e9,
        length: 150 + rng() * 62,
        thickness: 22 + rng() * 22,
        notchCount: Math.floor(rng() * 6)
      };
    }
  },
  zigzag: {
    texture: "runner-diamond",
    tint: palette.sentinelTint,
    scale: [0.8, 1.08],
    speedFactor: 1.04,
    rotationSpeed: 150,
    destroyArchetype: "splitter",
    splitCount: 4,
    hitbox: {
      shape: "circle",
      radius: 32
    },
    motion: {
      type: "sway",
      amplitude: 84,
      frequency: 3.2
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "polygon",
        seed: rng() * 1e9,
        pointCount: 3 + Math.floor(rng() * 4),
        radius: 30 + rng() * 16,
        starFactor: rng() * 0.45
      };
    }
  },
  sentinel: {
    texture: "runner-gate",
    tint: palette.polygonTint,
    tintVariant: palette.polygonVariant,
    tintVariantChance: 0.2,
    scale: [0.78, 1],
    speedFactor: 0.96,
    rotationSpeed: 90,
    destroyArchetype: "debrisLauncher",
    debrisCount: 6,
    hitbox: {
      shape: "circle",
      radius: 42
    },
    motion: {
      type: "sway",
      amplitude: 46,
      frequency: 2.4
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "polygon",
        seed: rng() * 1e9,
        pointCount: 6 + Math.floor(rng() * 4),
        radius: 38 + rng() * 12,
        starFactor: rng() * 0.2
      };
    }
  },
  pulse: {
    texture: "runner-orb",
    tint: palette.zigzagTint,
    scale: [0.65, 1],
    speedFactor: 1.02,
    destroyArchetype: "lingering",
    hitbox: {
      shape: "circle",
      radius: 28
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "hazardGlow",
        seed: rng() * 1e9,
        radius: 28 + rng() * 16
      };
    }
  },
  streak: {
    texture: "runner-bolt",
    tint: palette.streakTint,
    scale: [0.75, 1.05],
    speedFactor: 1.12,
    rotationSpeed: 260,
    destroyArchetype: "debrisLauncher",
    debrisCount: 5,
    hitbox: {
      shape: "circle",
      radius: 22
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "bolt",
        seed: rng() * 1e9,
        size: 36 + rng() * 16
      };
    }
  },
  spinner: {
    texture: "runner-gate",
    tint: palette.wedgeTint,
    scale: [0.78, 1.02],
    speedFactor: 0.98,
    rotationSpeed: 200,
    destroyArchetype: "debrisLauncher",
    debrisCount: 6,
    hitbox: {
      shape: "circle",
      radius: 38
    },
    motion: {
      type: "sway",
      amplitude: 52,
      frequency: 2.8
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "polygon",
        seed: rng() * 1e9,
        pointCount: 5 + Math.floor(rng() * 4),
        radius: 38,
        starFactor: 0.15 + rng() * 0.2
      };
    }
  },
  ring: {
    texture: "runner-orb",
    tint: palette.ringTint,
    scale: [0.7, 1.05],
    speedFactor: 1.02,
    rotationSpeed: 140,
    destroyArchetype: "clean",
    hitbox: {
      shape: "circle",
      radius: 32
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "ring",
        seed: rng() * 1e9,
        radius: 32 + rng() * 16,
        innerRatio: 0.35 + rng() * 0.4
      };
    }
  },
  star: {
    texture: "runner-gate",
    tint: palette.starTint,
    scale: [0.72, 1.02],
    speedFactor: 1.06,
    rotationSpeed: 120,
    destroyArchetype: "splitter",
    splitCount: 6,
    hitbox: {
      shape: "circle",
      radius: 36
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "star",
        seed: rng() * 1e9,
        radius: 36,
        arms: 4 + Math.floor(rng() * 5),
        innerRatio: 0.28 + rng() * 0.28
      };
    }
  },
  cross: {
    texture: "runner-beam",
    tint: palette.crossTint,
    scale: [0.68, 1],
    speedFactor: 0.95,
    rotationSpeed: 80,
    destroyArchetype: "debrisLauncher",
    debrisCount: 6,
    hitbox: {
      shape: "box",
      width: 56,
      height: 56
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "cross",
        seed: rng() * 1e9,
        size: 48 + rng() * 24,
        thickness: 10 + Math.floor(rng() * 14)
      };
    }
  },
  drone: {
    texture: "runner-orb",
    tint: palette.droneTint,
    scale: [0.68, 1],
    speedFactor: 1.04,
    rotationSpeed: 100,
    destroyArchetype: "clean",
    hitbox: {
      shape: "circle",
      radius: 30
    },
    motion: {
      type: "sway",
      amplitude: 64,
      frequency: 2.6
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "ring",
        seed: rng() * 1e9,
        radius: 30 + rng() * 14,
        innerRatio: 0.4 + rng() * 0.35
      };
    }
  },
  slicer: {
    texture: "runner-beam",
    tint: palette.slicerTint,
    scale: [0.7, 0.98],
    speedFactor: 1.08,
    rotationSpeed: 200,
    destroyArchetype: "debrisLauncher",
    debrisCount: 6,
    hitbox: {
      shape: "box",
      width: 52,
      height: 52
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "cross",
        seed: rng() * 1e9,
        size: 44 + rng() * 20,
        thickness: 8 + Math.floor(rng() * 12)
      };
    }
  },
  hex: {
    texture: "runner-gate",
    tint: palette.hexTint,
    scale: [0.72, 1.02],
    speedFactor: 1,
    rotationSpeed: 60,
    destroyArchetype: "debrisLauncher",
    debrisCount: 6,
    hitbox: {
      shape: "circle",
      radius: 34
    },
    procedural: true,
    proceduralParams(rng) {
      return {
        family: "hex",
        seed: rng() * 1e9,
        radius: 32 + rng() * 16
      };
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

/** In-run pickup effect types; weighted for random pick when not overridden. */
export const PICKUP_TYPES = {
  shield: { id: "shield", tint: game.pickupShield, weight: 4, pickupFrame: 0 },
  speed: { id: "speed", tint: game.pickupSpeed, weight: 2, pickupFrame: 1 },
  invuln: { id: "invuln", tint: game.pickupInvuln, weight: 1, pickupFrame: 2 },
  scoreMult: { id: "scoreMult", tint: game.pickupScoreMult, weight: 2, pickupFrame: 3 },
  /** Rare risk pickup: burst score + warning flash (Package C tradeoff). */
  gambit: { id: "gambit", tint: 0xffc933, weight: 0.18, pickupFrame: 0 }
};

const PICKUP_TYPE_IDS = Object.keys(PICKUP_TYPES);
const PICKUP_WEIGHTS = PICKUP_TYPE_IDS.map(id => PICKUP_TYPES[id].weight);

function pickPickupType(rng) {
  const total = PICKUP_WEIGHTS.reduce((a, b) => a + b, 0);
  let cursor = rng() * total;
  for (let i = 0; i < PICKUP_TYPE_IDS.length; i += 1) {
    cursor -= PICKUP_WEIGHTS[i];
    if (cursor <= 0) return PICKUP_TYPE_IDS[i];
  }
  return PICKUP_TYPE_IDS[0];
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

  const proceduralParams = template.procedural && template.proceduralParams
    ? template.proceduralParams(rng)
    : undefined;

  const useTintVariant =
    template.tintVariant != null &&
    template.tintVariantChance != null &&
    rng() < template.tintVariantChance;
  let resolvedTint = overrides.tint ?? (useTintVariant ? template.tintVariant : template.tint);

  if (proceduralParams?.seed != null) {
    const mod = getTintModifierFromSeed(proceduralParams.seed);
    const r = Math.min(255, Math.floor(((resolvedTint >> 16) & 0xff) * mod.r));
    const g = Math.min(255, Math.floor(((resolvedTint >> 8) & 0xff) * mod.g));
    const b = Math.min(255, Math.floor((resolvedTint & 0xff) * mod.b));
    resolvedTint = (r << 16) | (g << 8) | b;
  }

  const hitbox = overrides.hitbox ?? (proceduralParams ? getHitboxFromProceduralParams(proceduralParams) : template.hitbox);

  return {
    kind: "hazard",
    type,
    texture: template.texture,
    tint: resolvedTint,
    proceduralParams,
    x,
    y,
    speed: Math.abs(speed),
    velocityX: overrides.velocityX ?? velocityX,
    velocityY: overrides.velocityY ?? velocityY,
    scaleX,
    scaleY,
    hitbox,
    rotationSpeed: overrides.rotationSpeed ?? template.rotationSpeed ?? 0,
    motion,
    delayMs: overrides.delayMs ?? 0,
    alpha: overrides.alpha ?? 1,
    destroyArchetype: overrides.destroyArchetype ?? template.destroyArchetype ?? "clean",
    splitCount: overrides.splitCount ?? template.splitCount,
    debrisCount: overrides.debrisCount ?? template.debrisCount
  };
};

const createPickup = (context, rng, overrides = {}) => {
  const speed = overrides.speed ?? context.fallSpeed * 0.72;
  const spawnEdge = overrides.spawnEdge ?? pickSpawnEdge(context, rng);
  const topY = overrides.y ?? (SPAWN_Y + rng() * SPAWN_Y_TOP_BAND);
  const { x, y, velocityX, velocityY } =
    spawnEdge !== "top"
      ? resolveSpawnPositionAndVelocity(spawnEdge, Math.abs(speed), rng)
      : {
          x: overrides.x ?? pickRandomX(rng),
          y: topY,
          velocityX: 0,
          velocityY: speed
        };

  const pickupType = overrides.pickupType ?? pickPickupType(rng);
  const typeDef = PICKUP_TYPES[pickupType] || PICKUP_TYPES.shield;

  return {
    kind: "pickup",
    pickupType,
    texture: typeDef.pickupFrame !== undefined ? "pickupPowerups" : "powerUp",
    pickupFrame: typeDef.pickupFrame ?? 0,
    tint: overrides.tint ?? typeDef.tint,
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
      const clean = ["meteor", "ring", "pulse", "drone"];
      const splitter = ["shard", "star", "zigzag"];
      const debris = ["crusher", "cross", "sentinel", "streak", "hex"];
      const roll = rng();
      const pool = roll < 1 / 3 ? clean : roll < 2 / 3 ? splitter : debris;
      const type = pool[Math.floor(rng() * pool.length)];
      return [
        createHazard(type, context, rng, { x: lane })
      ];
    }
  },
  {
    key: "recovery-shapes",
    phases: ["recovery", "reset"],
    maxIntensity: 0.5,
    weight: 4,
    build(context, rng) {
      const [lane] = pickLanes(1, rng);
      const types = ["ring", "star", "hex", "cross", "zigzag"];
      const type = types[Math.floor(rng() * types.length)];
      return [createHazard(type, context, rng, { x: lane })];
    }
  },
  {
    key: "recovery-pair",
    phases: ["recovery", "push", "reset"],
    maxIntensity: 0.52,
    weight: 3,
    build(context, rng) {
      const [leftLane, rightLane] = pickLanes(2, rng);
      const leftTypes = ["ring", "star", "cross", "zigzag"];
      const rightTypes = ["meteor", "crusher", "shard", "hex"];
      return [
        createHazard(leftTypes[Math.floor(rng() * leftTypes.length)], context, rng, { x: leftLane }),
        createHazard(rightTypes[Math.floor(rng() * rightTypes.length)], context, rng, { x: rightLane, delayMs: 150 })
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
      const hazardTypes = ["meteor", "shard", "crusher", "star", "cross"];
      const hazardType = hazardTypes[Math.floor(rng() * hazardTypes.length)];
      return [
        createHazard(hazardType, context, rng, { x: hazardLane }),
        createPickup(context, rng, {
          x: pickupLane,
          delayMs: 200
        })
      ];
    }
  },
  {
    key: "pickup-anywhere",
    phases: ["recovery", "push", "heat", "reset"],
    minIntensity: 0.35,
    weight: 3,
    build(context, rng) {
      return [createPickup(context, rng)];
    }
  },
  {
    key: "pickup-flank",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.38,
    weight: 3,
    build(context, rng) {
      const fromLeft = rng() > 0.5;
      return [
        createPickup(context, rng, {
          spawnEdge: fromLeft ? "left" : "right",
          delayMs: 0
        })
      ];
    }
  },
  {
    key: "pickup-rise",
    phases: ["push", "heat"],
    minIntensity: 0.5,
    weight: 2,
    build(context, rng) {
      return [
        createPickup(context, rng, {
          spawnEdge: "bottom",
          delayMs: 0
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
      const types = ["shard", "meteor", "crusher", "cross", "star", "streak"];
      return pickLanes(4, rng).map((lane, index) =>
        createHazard(types[index % types.length], context, rng, {
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
      const second = rng() > 0.6 ? "slicer" : "shard";
      return [
        createHazard("meteor", context, rng, { spawnEdge: fromLeft ? "left" : "right" }),
        createHazard(second, context, rng, {
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
      const types = ["zigzag", "shard", "star", "ring"];
      const t1 = types[Math.floor(rng() * types.length)];
      const t2 = types[Math.floor(rng() * types.length)];
      return [
        createHazard(t1, context, rng, { spawnEdge: a }),
        createHazard(t2, context, rng, {
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
  },
  {
    key: "pulse-streak-mix",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.42,
    maxIntensity: 0.88,
    weight: 4,
    build(context, rng) {
      const lanes = pickLanes(3, rng);
      const types = ["pulse", "streak", "spinner"];
      const shuffled = shuffle(types, rng);
      return lanes.map((lane, index) =>
        createHazard(shuffled[index], context, rng, {
          x: lane,
          delayMs: index * 100
        })
      );
    }
  },
  {
    key: "shape-variety",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.48,
    maxIntensity: 0.9,
    weight: 3,
    build(context, rng) {
      const lanes = pickLanes(3, rng);
      const types = ["ring", "star", "cross"];
      const shuffled = shuffle(types, rng);
      return lanes.map((lane, index) =>
        createHazard(shuffled[index], context, rng, {
          x: lane,
          delayMs: index * 90
        })
      );
    }
  },
  {
    key: "mixed-shapes",
    phases: ["heat"],
    minIntensity: 0.68,
    weight: 3,
    build(context, rng) {
      const [a, b, c] = pickLanes(3, rng);
      return [
        createHazard("ring", context, rng, { x: a }),
        createHazard("star", context, rng, { x: b, delayMs: 100 }),
        createHazard("cross", context, rng, { x: c, delayMs: 180 })
      ];
    }
  },
  {
    key: "chaos-wave",
    phases: ["heat"],
    minIntensity: 0.78,
    weight: 4,
    build(context, rng) {
      const allTypes = ["meteor", "shard", "crusher", "zigzag", "sentinel", "pulse", "streak", "spinner", "ring", "star", "cross", "drone", "slicer", "hex"];
      const count = 4 + Math.floor(rng() * 2);
      const lanes = pickLanes(count, rng);
      return lanes.map((lane, index) => {
        const type = allTypes[Math.floor(rng() * allTypes.length)];
        return createHazard(type, context, rng, {
          x: lane,
          delayMs: index * 70
        });
      });
    }
  },
  {
    key: "drone-hex-mix",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.44,
    maxIntensity: 0.85,
    weight: 3,
    build(context, rng) {
      const lanes = pickLanes(3, rng);
      const types = ["drone", "hex", "spinner"];
      const shuffled = shuffle(types, rng);
      return lanes.map((lane, index) =>
        createHazard(shuffled[index], context, rng, {
          x: lane,
          delayMs: index * 95
        })
      );
    }
  },
  {
    key: "stagger-variety",
    phases: ["push", "heat", "reset"],
    minIntensity: 0.5,
    weight: 4,
    build(context, rng) {
      const types = ["meteor", "shard", "ring", "star", "crusher", "zigzag", "cross", "sentinel"];
      const lanes = pickLanes(3, rng);
      const shuffled = shuffle(types, rng).slice(0, 3);
      return lanes.map((lane, index) =>
        createHazard(shuffled[index], context, rng, {
          x: lane,
          delayMs: index * 110
        })
      );
    }
  }
];

/** Boss archetypes for procedural boss generation. */
const BOSS_ARCHETYPES = [
  {
    name: "Storm Core",
    tint: palette.bossStormCore,
    holdY: 126,
    driftAmplitude: 250,
    driftFrequency: 1.1,
    durationMsBase: 7000,
    durationMsScale: 2000,
    attackCadenceBase: 960,
    attackCadenceScale: -220,
    projectileCountLow: 4,
    projectileCountHigh: 5,
    projectileSpread: 120,
    phaseShiftCadenceFactor: 0.7,
    phaseShiftProjectileBonus: 1,
    phaseShiftSpreadFactor: 1.2,
    attackSignatures: ["fan", "aimedBurst"],
    telegraphMs: { fan: 380, aimedBurst: 520 },
    bossRadius: 70,
    pointCount: [8, 10],
    weight: 1
  },
  {
    name: "Void Spire",
    tint: palette.bossVoidSpire,
    holdY: 140,
    driftAmplitude: 200,
    driftFrequency: 1.4,
    durationMsBase: 7500,
    durationMsScale: 2500,
    attackCadenceBase: 880,
    attackCadenceScale: -180,
    projectileCountLow: 4,
    projectileCountHigh: 6,
    projectileSpread: 140,
    phaseShiftCadenceFactor: 0.72,
    phaseShiftProjectileBonus: 1,
    phaseShiftSpreadFactor: 1.18,
    attackSignatures: ["fan", "cross"],
    telegraphMs: { fan: 360, cross: 460 },
    bossRadius: 72,
    pointCount: [6, 8],
    weight: 1
  },
  {
    name: "Ember Nexus",
    tint: palette.bossEmberNexus,
    holdY: 115,
    driftAmplitude: 280,
    driftFrequency: 0.95,
    durationMsBase: 6500,
    durationMsScale: 1800,
    attackCadenceBase: 1000,
    attackCadenceScale: -260,
    projectileCountLow: 3,
    projectileCountHigh: 5,
    projectileSpread: 100,
    phaseShiftCadenceFactor: 0.66,
    phaseShiftProjectileBonus: 2,
    phaseShiftSpreadFactor: 1.1,
    attackSignatures: ["aimedBurst", "fan"],
    telegraphMs: { aimedBurst: 540, fan: 350 },
    bossRadius: 68,
    pointCount: [7, 9],
    weight: 1
  },
  {
    name: "Frost Shard",
    tint: palette.bossFrostShard,
    holdY: 132,
    driftAmplitude: 220,
    driftFrequency: 1.25,
    durationMsBase: 7200,
    durationMsScale: 2200,
    attackCadenceBase: 920,
    attackCadenceScale: -200,
    projectileCountLow: 4,
    projectileCountHigh: 5,
    projectileSpread: 115,
    phaseShiftCadenceFactor: 0.74,
    phaseShiftProjectileBonus: 1,
    phaseShiftSpreadFactor: 1.15,
    attackSignatures: ["cross", "fan"],
    telegraphMs: { cross: 470, fan: 360 },
    bossRadius: 66,
    pointCount: [8, 12],
    weight: 1
  },
  {
    name: "Chaos Rift",
    tint: palette.bossChaosRift,
    holdY: 138,
    driftAmplitude: 260,
    driftFrequency: 1.15,
    durationMsBase: 6800,
    durationMsScale: 2400,
    attackCadenceBase: 940,
    attackCadenceScale: -240,
    projectileCountLow: 4,
    projectileCountHigh: 6,
    projectileSpread: 130,
    phaseShiftCadenceFactor: 0.68,
    phaseShiftProjectileBonus: 2,
    phaseShiftSpreadFactor: 1.24,
    attackSignatures: ["aimedBurst", "cross"],
    telegraphMs: { aimedBurst: 500, cross: 450 },
    bossRadius: 74,
    pointCount: [6, 10],
    weight: 1
  }
];

function pickBossArchetype(rng) {
  const total = BOSS_ARCHETYPES.reduce((s, a) => s + a.weight, 0);
  let cursor = rng() * total;
  for (const arch of BOSS_ARCHETYPES) {
    cursor -= arch.weight;
    if (cursor <= 0) return arch;
  }
  return BOSS_ARCHETYPES[0];
}

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

export const buildMiniBossWave = (context, rng) => {
  const proceduralParams = {
    family: "boss",
    seed: 0,
    radius: 70,
    pointCount: 8
  };
  return {
    kind: "boss",
    name: "Storm Core",
    texture: "runner-boss",
    proceduralParams,
    tint: palette.bossStormCore,
    x: GAME_WIDTH / 2,
    y: -180,
    scaleX: 1,
    scaleY: 1,
    hitbox: getHitboxFromProceduralParams(proceduralParams),
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
    phaseShiftAtRatio: 0.5,
    phaseShiftCadenceFactor: 0.72,
    phaseShiftProjectileBonus: 1,
    phaseShiftSpreadFactor: 1.2,
    attackSignatures: ["fan", "aimedBurst"],
    telegraphMs: { fan: 360, aimedBurst: 520 },
    rewardPickup: createPickup(context, rng)
  };
};

export const buildProceduralBoss = (context, rng) => {
  const arch = pickBossArchetype(rng);
  const pointCountRange = arch.pointCount;
  const pointCount =
    pointCountRange[0] +
    Math.floor(rng() * (pointCountRange[1] - pointCountRange[0] + 1));
  const proceduralParams = {
    family: "boss",
    seed: rng() * 1e9,
    radius: arch.bossRadius,
    pointCount
  };
  const intensity = Math.min(context.intensity, 1);
  const projectileCount =
    context.intensity > 0.85 ? arch.projectileCountHigh : arch.projectileCountLow;

  return {
    kind: "boss",
    name: arch.name,
    texture: "runner-boss",
    proceduralParams,
    tint: arch.tint,
    x: GAME_WIDTH / 2,
    y: -180,
    scaleX: 1,
    scaleY: 1,
    hitbox: getHitboxFromProceduralParams(proceduralParams),
    holdX: GAME_WIDTH / 2,
    holdY: arch.holdY,
    entrySpeed: 220 + context.intensity * 45,
    exitSpeed: 300 + context.intensity * 40,
    driftAmplitude: arch.driftAmplitude,
    driftFrequency: arch.driftFrequency + context.intensity * 0.25,
    durationMs: arch.durationMsBase + context.intensity * arch.durationMsScale,
    attackCadenceMs:
      arch.attackCadenceBase + intensity * arch.attackCadenceScale,
    projectileCount,
    projectileSpeed: context.fallSpeed + 140,
    projectileSpread: arch.projectileSpread,
    phaseShiftAtRatio: 0.5,
    phaseShiftCadenceFactor: arch.phaseShiftCadenceFactor,
    phaseShiftProjectileBonus: arch.phaseShiftProjectileBonus,
    phaseShiftSpreadFactor: arch.phaseShiftSpreadFactor,
    attackSignatures: [...arch.attackSignatures],
    telegraphMs: { ...arch.telegraphMs },
    rewardPickup: createPickup(context, rng)
  };
};

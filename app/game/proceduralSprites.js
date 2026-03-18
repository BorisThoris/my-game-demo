/**
 * Procedural sprite texture generation.
 * Produces deterministic shapes from params (seed, family, dimensions) for hazards and bosses.
 * Base fill/stroke use theme.colors.semantic.procedural (shapes are tinted at runtime).
 */
import { theme } from "../config/gameConfig.js";

const proc = theme.colors.semantic.procedural;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Deterministic tint multiplier from seed (0.92–1.08 per channel) for slight hazard color variation. */
export function getTintModifierFromSeed(seed) {
  const s = Number(seed);
  const h = (x) => (Math.sin(x * 12.9898) * 43758.5453) % 1;
  return {
    r: 0.92 + h(s) * 0.16,
    g: 0.92 + h(s + 1) * 0.16,
    b: 0.92 + h(s + 2) * 0.16
  };
}

export function getProceduralTextureKey(params) {
  if (!params || !params.family) return null;
  const seed = (params.seed != null ? params.seed : 0).toString().replace(".", "");
  return `proc-${params.family}-${seed}`;
}

export function getProceduralTextureSize(params) {
  if (!params || !params.family) return { width: 96, height: 96 };
  switch (params.family) {
    case "orb": {
      const r = params.radius ?? 48;
      return { width: Math.ceil(r * 2) + 4, height: Math.ceil(r * 2) + 4 };
    }
    case "wedge": {
      const w = params.width ?? 132;
      const h = params.height ?? 96;
      return { width: Math.ceil(w) + 4, height: Math.ceil(h) + 4 };
    }
    case "beam": {
      const len = params.length ?? 188;
      const thick = params.thickness ?? 40;
      return { width: Math.ceil(len) + 4, height: Math.ceil(thick) + 4 };
    }
    case "polygon": {
      const r = params.radius ?? 56;
      return { width: Math.ceil(r * 2) + 4, height: Math.ceil(r * 2) + 4 };
    }
    case "boss": {
      const r = params.radius ?? 90;
      return { width: Math.ceil(r * 2) + 4, height: Math.ceil(r * 2) + 4 };
    }
    case "hazardGlow": {
      const r = params.radius ?? 52;
      return { width: Math.ceil(r * 2) + 8, height: Math.ceil(r * 2) + 8 };
    }
    case "pickupShine": {
      const s = params.size ?? 64;
      return { width: Math.ceil(s) + 4, height: Math.ceil(s) + 4 };
    }
    case "bolt": {
      const s = params.size ?? 40;
      return { width: Math.ceil(s) + 4, height: Math.ceil(s) + 4 };
    }
    case "ring": {
      const r = params.radius ?? 48;
      return { width: Math.ceil(r * 2) + 4, height: Math.ceil(r * 2) + 4 };
    }
    case "star": {
      const r = params.radius ?? 48;
      return { width: Math.ceil(r * 2) + 4, height: Math.ceil(r * 2) + 4 };
    }
    case "cross": {
      const s = params.size ?? 48;
      return { width: Math.ceil(s) + 4, height: Math.ceil(s) + 4 };
    }
    case "hex": {
      const r = params.radius ?? 44;
      return { width: Math.ceil(r * 2) + 4, height: Math.ceil(r * 2) + 4 };
    }
    default:
      return { width: 96, height: 96 };
  }
}

/**
 * Single source for hitbox from the same params used to draw. Use for 1:1 collision with visual.
 * Returns { shape: "circle", radius } or { shape: "box", width, height, offsetX?, offsetY? } in texture-space units.
 */
export function getHitboxFromProceduralParams(params) {
  if (!params || !params.family) return { shape: "circle", radius: 48 };
  const family = params.family;
  switch (family) {
    case "orb":
    case "ring":
    case "star":
    case "polygon":
    case "boss":
    case "hazardGlow":
    case "hex": {
      const radius = params.radius ?? 48;
      return { shape: "circle", radius };
    }
    case "pickupShine":
    case "bolt": {
      const size = params.size ?? 40;
      const radius = size / 2;
      return { shape: "circle", radius };
    }
    case "wedge": {
      const w = params.width ?? 132;
      const h = params.height ?? 96;
      const { width: texW, height: texH } = getProceduralTextureSize(params);
      const offsetX = (texW - w) / 2;
      const offsetY = (texH - h) / 2;
      return { shape: "box", width: w, height: h, offsetX, offsetY };
    }
    case "beam": {
      const len = params.length ?? 188;
      const thick = params.thickness ?? 40;
      const { width: texW, height: texH } = getProceduralTextureSize(params);
      return {
        shape: "box",
        width: len,
        height: thick,
        offsetX: (texW - len) / 2,
        offsetY: (texH - thick) / 2
      };
    }
    case "cross": {
      const size = params.size ?? 48;
      const thickness = Math.min(params.thickness ?? 12, Math.floor(size / 2));
      return {
        shape: "box",
        width: size,
        height: size,
        offsetX: 0,
        offsetY: 0
      };
    }
    default:
      return { shape: "circle", radius: 48 };
  }
}

/** Default params per family for fallback texture generation (no seed variance). */
export const DEFAULT_PROCEDURAL_PARAMS = {
  orb: { family: "orb", seed: 0, radius: 48, ringCount: 2, innerRatio: 0.45 },
  wedge: { family: "wedge", seed: 0, points: 3, width: 132, height: 96, skew: 0 },
  beam: { family: "beam", seed: 0, length: 188, thickness: 40, notchCount: 0 },
  polygon: { family: "polygon", seed: 0, pointCount: 4, radius: 48, starFactor: 0 },
  boss: { family: "boss", seed: 0, radius: 80, pointCount: 8 },
  hazardGlow: { family: "hazardGlow", seed: 0, radius: 52 },
  pickupShine: { family: "pickupShine", seed: 0, size: 64, spikes: 6 },
  bolt: { family: "bolt", seed: 0, size: 40 },
  ring: { family: "ring", seed: 0, radius: 48, innerRatio: 0.5 },
  star: { family: "star", seed: 0, radius: 48, arms: 5, innerRatio: 0.4 },
  cross: { family: "cross", seed: 0, size: 48, thickness: 12 },
  hex: { family: "hex", seed: 0, radius: 44 }
};

function makePoints(count, radius, centerX, centerY, starFactor = 0) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const r = radius * (1 - starFactor * (i % 2 === 0 ? 0.3 : 0));
    points.push({ x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r });
  }
  return points;
}

export function drawProceduralShape(graphics, params) {
  if (!params || !params.family) return;
  const family = params.family;
  const { width, height } = getProceduralTextureSize(params);
  const cx = width / 2;
  const cy = height / 2;

  if (family === "orb") {
    const radius = Math.min((params.radius ?? 48), width / 2 - 2, height / 2 - 2);
    const ringCount = clamp(Math.floor(params.ringCount ?? 2), 1, 4);
    const innerRatio = clamp(params.innerRatio ?? 0.45, 0.2, 0.8);
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillCircle(cx, cy, radius);
    for (let r = 1; r <= ringCount; r += 1) {
      const ringRadius = radius * (1 - (r / (ringCount + 1)) * (1 - innerRatio));
      graphics.fillStyle(proc.uiMuted, 0.75 - r * 0.1);
      graphics.fillCircle(cx, cy, ringRadius);
    }
    graphics.lineStyle(6, proc.uiFill, 0.55);
    graphics.strokeCircle(cx, cy, radius * 0.92);
    return;
  }

  if (family === "wedge") {
    const points = params.points ?? 3;
    const w = params.width ?? 132;
    const h = params.height ?? 96;
    const skew = params.skew ?? 0;
    const halfW = w / 2;
    const topY = 10;
    const bottomY = h - 10;
    const tipX = halfW + skew * 20;
    const leftX = 8;
    const rightX = w - 8;
    if (points === 3) {
      graphics.fillStyle(proc.uiFill, 1);
      graphics.fillTriangle(leftX, bottomY, tipX, topY, rightX, bottomY);
      graphics.fillStyle(proc.uiFill, 0.38);
      graphics.fillTriangle(leftX * 1.2, bottomY - 8, tipX, topY + 20, rightX * 0.8, bottomY - 8);
    } else {
      const pts = makePoints(points, Math.min(halfW, h) * 0.9, halfW, h / 2);
      graphics.fillStyle(proc.uiFill, 1);
      graphics.fillPoints(pts.map(p => ({ x: p.x + halfW, y: p.y + h / 2 })), true);
    }
    return;
  }

  if (family === "beam") {
    const len = params.length ?? 188;
    const thick = params.thickness ?? 40;
    const notchCount = clamp(Math.floor(params.notchCount ?? 0), 0, 6);
    const x0 = (width - len) / 2;
    const y0 = (height - thick) / 2;
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillRoundedRect(x0, y0, len, thick, 14);
    if (notchCount > 0) {
      const gap = len / (notchCount + 1);
      graphics.fillStyle(proc.uiFill, 0.35);
      for (let i = 0; i < notchCount; i += 1) {
        graphics.fillRoundedRect(x0 + gap * (i + 0.5) - 20, y0 + 8, 40, thick - 16, 6);
      }
    }
    return;
  }

  if (family === "polygon") {
    const pointCount = clamp(params.pointCount ?? 4, 3, 8);
    const radius = Math.min(params.radius ?? 48, width / 2 - 2, height / 2 - 2);
    const starFactor = clamp(params.starFactor ?? 0, 0, 0.5);
    const pts = makePoints(pointCount, radius, cx, cy, starFactor);
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillPoints(pts, true);
    graphics.fillStyle(proc.uiFill, 0.4);
    const innerPts = makePoints(pointCount, radius * 0.6, cx, cy, 0);
    graphics.fillPoints(innerPts, true);
    return;
  }

  if (family === "boss") {
    const pointCount = clamp(params.pointCount ?? 8, 6, 12);
    const radius = Math.min(params.radius ?? 80, width / 2 - 2, height / 2 - 2);
    const pts = makePoints(pointCount, radius, cx, cy, 0);
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillPoints(pts, true);
    graphics.fillStyle(proc.bossInner, 0.3);
    graphics.fillCircle(cx, cy, radius * 0.5);
    graphics.fillStyle(proc.bossCore, 1);
    graphics.fillCircle(cx, cy, radius * 0.2);
    return;
  }

  if (family === "hazardGlow") {
    const radius = Math.min(params.radius ?? 52, width / 2 - 4, height / 2 - 4);
    graphics.fillStyle(proc.uiFill, 0.08);
    graphics.fillCircle(cx, cy, radius);
    graphics.fillStyle(proc.uiFill, 0.18);
    graphics.fillCircle(cx, cy, radius * 0.7);
    graphics.fillStyle(proc.uiFill, 0.32);
    graphics.fillCircle(cx, cy, radius * 0.4);
    return;
  }

  if (family === "pickupShine") {
    const size = Math.min(params.size ?? 64, width - 4, height - 4);
    const r = size / 2;
    const spikes = clamp(params.spikes ?? 6, 4, 12);
    const innerR = r * 0.35;
    const pts = [];
    for (let i = 0; i < spikes * 2; i += 1) {
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : innerR;
      pts.push({ x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad });
    }
    graphics.fillStyle(proc.uiFill, 0.95);
    graphics.fillPoints(pts, true);
    graphics.fillStyle(proc.uiFill, 0.5);
    graphics.fillCircle(cx, cy, innerR * 0.8);
    return;
  }

  if (family === "bolt") {
    const s = Math.min(params.size ?? 40, width - 4, height - 4) / 2;
    const pts = [
      { x: cx, y: cy - s },
      { x: cx + s, y: cy },
      { x: cx, y: cy + s },
      { x: cx - s, y: cy }
    ];
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillPoints(pts, true);
    graphics.lineStyle(2, proc.uiFill, 0.6);
    for (let i = 0; i < pts.length; i += 1) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      graphics.lineBetween(a.x, a.y, b.x, b.y);
    }
    return;
  }

  if (family === "ring") {
    const radius = Math.min(params.radius ?? 48, width / 2 - 2, height / 2 - 2);
    const innerRatio = clamp(params.innerRatio ?? 0.5, 0.2, 0.85);
    const innerR = radius * innerRatio;
    const outerPts = makePoints(32, radius, cx, cy, 0);
    const innerPts = makePoints(32, innerR, cx, cy, 0).reverse();
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillPoints([...outerPts, ...innerPts], true);
    graphics.lineStyle(3, proc.uiFill, 0.5);
    graphics.strokeCircle(cx, cy, radius);
    return;
  }

  if (family === "star") {
    const radius = Math.min(params.radius ?? 48, width / 2 - 2, height / 2 - 2);
    const arms = clamp(Math.floor(params.arms ?? 5), 4, 12);
    const innerRatio = clamp(params.innerRatio ?? 0.4, 0.2, 0.6);
    const pts = [];
    for (let i = 0; i < arms * 2; i += 1) {
      const angle = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius * innerRatio;
      pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillPoints(pts, true);
    graphics.fillStyle(proc.uiFill, 0.35);
    graphics.fillCircle(cx, cy, radius * innerRatio * 0.7);
    return;
  }

  if (family === "cross") {
    const size = Math.min(params.size ?? 48, width - 4, height - 4);
    const thickness = clamp(params.thickness ?? 12, 4, Math.floor(size / 2));
    const pad = 2;
    const vx = cx - thickness / 2;
    const vy = pad;
    const vw = thickness;
    const vh = size - pad * 2;
    const hx = pad;
    const hy = cy - thickness / 2;
    const hw = size - pad * 2;
    const hh = thickness;
    const rad = Math.min(4, thickness / 3);
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillRoundedRect(vx, vy, vw, vh, rad);
    graphics.fillRoundedRect(hx, hy, hw, hh, rad);
    return;
  }

  if (family === "hex") {
    const radius = Math.min(params.radius ?? 44, width / 2 - 2, height / 2 - 2);
    const pts = makePoints(6, radius, cx, cy, 0);
    graphics.fillStyle(proc.uiFill, 1);
    graphics.fillPoints(pts, true);
    graphics.fillStyle(proc.uiFill, 0.4);
    const innerPts = makePoints(6, radius * 0.55, cx, cy, 0);
    graphics.fillPoints(innerPts, true);
    graphics.lineStyle(2, proc.uiFill, 0.5);
    for (let i = 0; i < pts.length; i += 1) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      graphics.lineBetween(a.x, a.y, b.x, b.y);
    }
    return;
  }
}

const MAX_PROCEDURAL_CACHE = 100;
const proceduralCacheKeys = [];

export function ensureProceduralTexture(scene, params) {
  const key = getProceduralTextureKey(params);
  if (!key) return null;
  if (scene.textures.exists(key)) return key;
  const size = getProceduralTextureSize(params);
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  drawProceduralShape(graphics, params);
  graphics.generateTexture(key, size.width, size.height);
  graphics.destroy();

  proceduralCacheKeys.push(key);
  while (proceduralCacheKeys.length > MAX_PROCEDURAL_CACHE && scene.textures.exists(proceduralCacheKeys[0])) {
    scene.textures.remove(proceduralCacheKeys.shift());
  }
  return key;
}

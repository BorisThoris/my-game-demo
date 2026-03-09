/**
 * Programmatic UI assets for the dodge game.
 * Generates replay, powerUp, stagePowerup, stageIntensityHeat, pickupPowerups (4-frame),
 * and perkIcons (8-frame) using the Phaser Graphics shape system (circles, rects, polygons, lines).
 * No SVG and no image files.
 */

const PICKUP_FRAME_W = 64;
const PICKUP_FRAME_H = 64;
const PERK_FRAME_W = 48;
const PERK_FRAME_H = 48;

function drawReplay(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(52, w / 2 - 4, h / 2 - 4);
  graphics.fillStyle(0xffffff, 0.95);
  graphics.fillCircle(cx, cy, radius);
  graphics.lineStyle(3, 0xd7f9ff, 0.8);
  graphics.strokeCircle(cx, cy, radius);
  const triSize = 22;
  const triX = cx + 4;
  const tipX = triX + triSize;
  graphics.fillStyle(0x0d1823, 1);
  graphics.fillTriangle(
    triX - triSize * 0.6, cy - triSize,
    triX - triSize * 0.6, cy + triSize,
    tipX, cy
  );
}

function drawPowerUp(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = 28;
  const arms = 5;
  const innerRatio = 0.4;
  const pts = [];
  for (let i = 0; i < arms * 2; i += 1) {
    const angle = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * innerRatio;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  graphics.fillStyle(0xffffff, 1);
  graphics.fillPoints(pts, true);
}

function drawStagePowerup(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  for (let r = 3; r >= 0; r -= 1) {
    const radius = 12 + r * 12;
    const alpha = 0.15 + (3 - r) * 0.2;
    graphics.fillStyle(0x55d6ff, alpha);
    graphics.fillCircle(cx, cy, radius);
  }
  graphics.fillStyle(0xffffff, 0.5);
  graphics.fillCircle(cx, cy, 10);
}

function drawStageIntensityHeat(graphics, w, h) {
  const cx = w / 2;
  const baseY = h - 4;
  const peakY = 8;
  const pts = [
    { x: cx - 28, y: baseY },
    { x: cx - 14, y: baseY - 18 },
    { x: cx, y: peakY },
    { x: cx + 14, y: baseY - 18 },
    { x: cx + 28, y: baseY }
  ];
  graphics.fillStyle(0xff6b6b, 0.95);
  graphics.fillPoints(pts, true);
  graphics.fillStyle(0xffa94d, 0.6);
  graphics.fillTriangle(cx - 12, baseY - 12, cx, peakY + 8, cx + 12, baseY - 12);
}

function drawPickupShield(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = 26;
  graphics.fillStyle(0xffffff, 0.95);
  graphics.fillCircle(cx, cy, r);
  graphics.fillStyle(0x55d6ff, 0.4);
  graphics.fillCircle(cx, cy, r * 0.6);
  graphics.lineStyle(3, 0xffffff, 0.7);
  graphics.strokeCircle(cx, cy, r);
}

function drawPickupSpeed(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const s = 20;
  const pts = [
    { x: cx, y: cy - s },
    { x: cx + s, y: cy },
    { x: cx, y: cy + s },
    { x: cx - s, y: cy }
  ];
  graphics.fillStyle(0xffffff, 1);
  graphics.fillPoints(pts, true);
  graphics.lineStyle(2, 0xffffff, 0.6);
  for (let i = 0; i < pts.length; i += 1) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    graphics.lineBetween(a.x, a.y, b.x, b.y);
  }
}

function drawPickupInvuln(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = 26;
  const arms = 5;
  const innerRatio = 0.35;
  const pts = [];
  for (let i = 0; i < arms * 2; i += 1) {
    const angle = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * innerRatio;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  graphics.fillStyle(0xffffff, 1);
  graphics.fillPoints(pts, true);
}

function drawPickupScoreMult(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const s = 18;
  graphics.fillStyle(0xffffff, 1);
  graphics.fillRect(cx - s, cy - 3, s * 2, 6);
  graphics.fillRect(cx - 3, cy - s, 6, s * 2);
}

function drawPerkBoot(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2 + 2;
  graphics.fillStyle(0xffffff, 1);
  graphics.fillTriangle(cx - 14, cy + 8, cx, cy - 14, cx + 14, cy + 8);
  graphics.fillStyle(0x99a7c2, 0.8);
  graphics.fillRoundedRect(cx - 10, cy + 4, 20, 8, 2);
}

function drawPerkCircle(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(cx, cy, 18);
  graphics.fillStyle(0x55d6ff, 0.5);
  graphics.fillCircle(cx, cy, 10);
}

function drawPerkGear(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = 20;
  const n = 8;
  const innerR = radius * 0.6;
  const pts = [];
  for (let i = 0; i < n * 2; i += 1) {
    const angle = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : innerR;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  graphics.fillStyle(0xffffff, 1);
  graphics.fillPoints(pts, true);
}

function drawPerkHourglass(graphics, w, h) {
  const cx = w / 2;
  graphics.fillStyle(0xffffff, 1);
  graphics.fillTriangle(cx - 12, 4, cx + 12, 4, cx, 22);
  graphics.fillTriangle(cx - 12, 44, cx + 12, 44, cx, 26);
}

function drawPerkShield(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  graphics.fillStyle(0xffffff, 1);
  graphics.fillCircle(cx, cy, 18);
  graphics.fillStyle(0x55d6ff, 0.4);
  graphics.fillCircle(cx, cy, 10);
  graphics.lineStyle(2, 0xffffff, 0.8);
  graphics.strokeCircle(cx, cy, 18);
}

function drawPerkGem(graphics, w, h) {
  const cx = w / 2;
  const pts = [
    { x: cx, y: 6 },
    { x: cx + 16, y: 22 },
    { x: cx, y: 40 },
    { x: cx - 16, y: 22 }
  ];
  graphics.fillStyle(0xffffff, 1);
  graphics.fillPoints(pts, true);
  graphics.fillStyle(0x8be9b1, 0.5);
  graphics.fillTriangle(cx - 8, 18, cx, 28, cx + 8, 18);
}

function drawPerkFortress(graphics, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  graphics.fillStyle(0xffffff, 0.95);
  graphics.fillRoundedRect(cx - 14, cy - 12, 28, 24, 4);
  graphics.fillStyle(0x08131d, 0.9);
  graphics.fillRect(cx - 8, cy - 6, 16, 12);
}

function drawSingle(scene, key, width, height, drawFn) {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  drawFn(g, width, height);
  g.generateTexture(key, width, height);
  g.destroy();
}

function drawSpritesheet(scene, key, frameW, frameH, frameCount, drawFrameAt) {
  if (scene.textures.exists(key)) return;
  const totalW = frameW * frameCount;
  const rt = scene.add.renderTexture(0, 0, totalW, frameH);
  for (let i = 0; i < frameCount; i += 1) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    drawFrameAt(g, frameW, frameH, i);
    rt.draw(g, i * frameW, 0);
    g.destroy();
  }
  rt.saveTexture(key);
  rt.destroy();
  const tex = scene.textures.get(key);
  for (let i = 0; i < frameCount; i += 1) {
    tex.add(i, 0, i * frameW, 0, frameW, frameH);
  }
}

/**
 * Ensures all procedural UI textures used by the dodge game exist.
 * Call once from dodgeGame create() before creating HUD, pickups, or replay button.
 * @param {Phaser.Scene} scene - The scene (dodge game).
 */
export function ensureProceduralUiAssets(scene) {
  drawSingle(scene, "replay", 128, 128, drawReplay);
  drawSingle(scene, "powerUp", 64, 64, drawPowerUp);
  drawSingle(scene, "stagePowerup", 64, 64, drawStagePowerup);
  drawSingle(scene, "stageIntensityHeat", 64, 64, drawStageIntensityHeat);

  const pickupDrawers = [drawPickupShield, drawPickupSpeed, drawPickupInvuln, drawPickupScoreMult];
  drawSpritesheet(scene, "pickupPowerups", PICKUP_FRAME_W, PICKUP_FRAME_H, 4, (g, w, h, i) => pickupDrawers[i](g, w, h));

  const perkDrawers = [
    drawPerkBoot,
    drawPerkCircle,
    drawPerkGear,
    drawPerkHourglass,
    drawPerkShield,
    drawPerkGem,
    drawPerkBoot,
    drawPerkFortress
  ];
  drawSpritesheet(scene, "perkIcons", PERK_FRAME_W, PERK_FRAME_H, 8, (g, w, h, i) => perkDrawers[i](g, w, h));
}

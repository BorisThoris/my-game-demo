/**
 * Programmatic base scene assets: ground, background, arrow.
 * No image files required; all drawn with Phaser Graphics.
 */

import { GAME_WIDTH, GAME_HEIGHT } from "../config/gameConfig.js";

const GROUND_W = 640;
const GROUND_H = 32;
const ARROW_W = 64;
const ARROW_H = 64;

function ensureTexture(scene, key, width, height, drawFn) {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0, add: false });
  drawFn(g, width, height);
  g.generateTexture(key, width, height);
  g.destroy();
}

/**
 * Ensures procedural ground, background, and arrow textures exist.
 * Call from baseScene createSceneShell (or create) before using "ground", "background", "arrow".
 */
export function ensureProceduralBaseAssets(scene) {
  ensureTexture(scene, "ground", GROUND_W, GROUND_H, (g, w, h) => {
    g.fillStyle(0x2d4a3e, 1);
    g.fillRect(0, 0, w, h);
    g.fillStyle(0x3d5a4e, 0.6);
    g.fillRect(0, h * 0.4, w, h * 0.2);
  });

  ensureTexture(scene, "background", GAME_WIDTH, GAME_HEIGHT, (g, w, h) => {
    g.fillGradientStyle(0x0a1628, 0x0a1628, 0x142536, 0x142536, 0.5, 0, 0.5, 1);
    g.fillRect(0, 0, w, h);
  });

  ensureTexture(scene, "arrow", ARROW_W, ARROW_H, (g, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const size = 20;
    g.fillStyle(0xffffff, 0.95);
    g.fillTriangle(
      cx + size,
      cy,
      cx - size * 0.6,
      cy - size,
      cx - size * 0.6,
      cy + size
    );
  });
}

/**
 * Ensures dummy spritesheet textures exist for the procedural stickman player
 * (mummy, mummy2, flex) so Phaser anims work. Frames are blank; the stickman is drawn by StickmanPlayer.
 */

const FRAME_W = 256;
const FRAME_H = 256;

function addDummySheet(scene, key, frameCount) {
  if (scene.textures.exists(key) && scene.textures.get(key).getFrameNames().length >= frameCount) {
    return;
  }
  const w = frameCount * FRAME_W;
  const h = FRAME_H;
  const rt = scene.add.renderTexture(0, 0, w, h);
  rt.saveTexture(key);
  rt.destroy();
  const tex = scene.textures.get(key);
  for (let i = 0; i < frameCount; i += 1) {
    tex.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  }
}

export function ensureProceduralPlayerSheets(scene) {
  addDummySheet(scene, "mummy", 2);
  addDummySheet(scene, "mummy2", 2);
  addDummySheet(scene, "flex", 3);
  addDummySheet(scene, "crouch-flex", 2);
  addDummySheet(scene, "crouch-walk-left", 2);
  addDummySheet(scene, "crouch-walk-right", 2);
  addDummySheet(scene, "jump", 2);
}

/**
 * Procedural stickman player: skeleton-driven draw, proper hitbox from bounds, limb positions for attachments.
 * Size is proportionate to screen (game height). No external stickman framework – built with Phaser Graphics.
 */

import Phaser from "phaser";
import { GAME_HEIGHT, PLAYER_HEIGHT_FRACTION, theme } from "../config/gameConfig";
import { getSkeleton, getSkeletonBounds, drawStickman } from "./stickmanSkeleton";

/** Skeleton logical height (y extent) – used to scale to display size */
const SKELETON_HEIGHT = 150;

/**
 * Get current animation phase 0..1 from sprite's anim state.
 */
function getAnimPhase(sprite) {
  const anim = sprite.anims?.currentAnim;
  if (!anim) return 0;
  const frame = sprite.anims.currentFrame;
  const total = anim.frames.length;
  if (!total) return 0;
  const index = frame ? frame.index : 0;
  return (index + 0.5) / total;
}

export default class StickmanPlayer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey = "flex") {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 0.5);

    this._displaySize = Math.max(48, Math.round(GAME_HEIGHT * PLAYER_HEIGHT_FRACTION));
    this._skeletonScale = this._displaySize / SKELETON_HEIGHT;
    this.setDisplaySize(this._displaySize, this._displaySize);

    this._graphics = scene.add.graphics({ x: 0, y: 0 });
    scene.add.existing(this._graphics);
    this._graphics.setScale(this._skeletonScale);

    this._skeleton = null;
    this._bounds = null;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this._updateSkeletonAndDraw();
    this._updateHitbox();
  }

  _updateSkeletonAndDraw() {
    const animKey = this.anims?.currentAnim?.key ?? "flex";
    const phase = getAnimPhase(this);
    this._skeleton = getSkeleton(animKey, phase);
    this._bounds = getSkeletonBounds(this._skeleton, 6);
    this._graphics.setPosition(this.x, this.y);
    this._graphics.setDepth(this.depth);
    this._graphics.setVisible(this.visible);
    this._graphics.setAlpha(this.alpha);
    const scaleMult = this._displayScaleMultiplier != null ? this._displayScaleMultiplier : 1;
    this._graphics.setScale(this._skeletonScale * scaleMult);
    drawStickman(this._graphics, this._skeleton, theme.colors.semantic.game.playerGlow);
  }

  _updateHitbox() {
    if (!this._bounds || !this.body) return;
    const animKey = this.anims?.currentAnim?.key ?? "";
    const proceduralOnly = ["flex", "walkLeft", "walkRight", "crouch-flex", "crouch-walk-left", "crouch-walk-right", "jump"].includes(animKey);
    if (!proceduralOnly) return;
    const b = this._bounds;
    const w = (b.maxX - b.minX) * this._skeletonScale;
    const h = (b.maxY - b.minY) * this._skeletonScale;
    const width = Math.max(12, w);
    const height = Math.max(24, h);
    const halfW = this._displaySize / 2;
    const halfH = this._displaySize / 2;
    const centerX = (b.minX + b.maxX) / 2;
    const centerY = (b.minY + b.maxY) / 2;
    const offsetX = halfW - centerX * this._skeletonScale - width / 2;
    const offsetY = halfH - centerY * this._skeletonScale - height / 2;
    this.body.setSize(width, height);
    this.body.setOffset(offsetX, offsetY);
    this.body.updateFromGameObject();
  }

  /**
   * Get world position of a limb/joint for attachments.
   * @param {string} limbId - one of: head, neck, torsoTop, torsoBottom, leftShoulder, rightShoulder, leftHand, rightHand, leftHip, rightHip, leftKnee, rightKnee, leftFoot, rightFoot
   * @returns {{ x: number, y: number } | null}
   */
  getLimbPosition(limbId) {
    const s = this._skeleton ?? getSkeleton(this.anims?.currentAnim?.key ?? "flex", 0);
    const p = s[limbId];
    if (!p) return null;
    const scale = this._skeletonScale;
    return {
      x: this.x + p.x * scale,
      y: this.y + p.y * scale
    };
  }

  /**
   * Get the current skeleton in local coordinates (read-only). Use getLimbPosition() for world coords.
   */
  getSkeleton() {
    return this._skeleton;
  }

  /**
   * Get current hitbox bounds in local coordinates.
   */
  getBounds() {
    return this._bounds;
  }

  destroy(fromScene) {
    if (this._graphics) {
      this._graphics.destroy(fromScene);
      this._graphics = null;
    }
    super.destroy(fromScene);
  }
}

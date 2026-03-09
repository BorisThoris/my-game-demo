/**
 * Stickman skeleton: joint positions in local space (origin = center of player, Y down).
 * Inspired by original Piskel stickman: round head, thin limbs, 256×256 frame scale.
 * Phase 0–1 cycles per animation loop.
 */

const HEAD_R = 22;
const NECK_Y = -72;
const TORSO_TOP = -68;
const TORSO_BOTTOM = -8;
const HIP_Y = -4;
const LEG_LEN = 48;
const ARM_LEN = 38;
const LEG_SPREAD = 20;
const ARM_SWING = 18;

/**
 * Get skeleton joint positions for a given anim and phase.
 * @param {string} animKey - 'flex' | 'walkLeft' | 'walkRight' | 'crouch-flex' | 'crouch-walk-left' | 'crouch-walk-right' | 'jump'
 * @param {number} phase - 0..1
 * @returns {Object} Joints in local coords
 */
export function getSkeleton(animKey, phase) {
  const crouch = animKey === "crouch-flex" || animKey === "crouch-walk-left" || animKey === "crouch-walk-right";
  const crouchWalk = animKey === "crouch-walk-left" || animKey === "crouch-walk-right";
  const jump = animKey === "jump";
  const walk = animKey === "walkLeft" || animKey === "walkRight" || crouchWalk;
  const dir = animKey === "walkRight" || animKey === "crouch-walk-right" ? 1 : -1;

  const t = phase * Math.PI * 2;
  const legL = walk ? Math.sin(t) * LEG_SPREAD * dir : 0;
  const legR = walk ? Math.sin(t + Math.PI) * LEG_SPREAD * dir : 0;
  const armSwing = walk ? Math.sin(t) * ARM_SWING : jump ? 0 : Math.sin(t * 0.5) * 4;
  const kneeBend = walk ? Math.abs(Math.sin(t)) * 10 : 0;

  let torsoTopY = TORSO_TOP;
  let torsoBottomY = TORSO_BOTTOM;
  let hipY = HIP_Y;
  let legLen = LEG_LEN;
  let shoulderY = TORSO_TOP + 16;

  if (crouch) {
    torsoTopY = TORSO_TOP + 18;
    torsoBottomY = TORSO_BOTTOM + 20;
    hipY = HIP_Y + 22;
    legLen = LEG_LEN * 0.6;
    shoulderY = torsoTopY + 14;
  }

  if (jump) {
    torsoTopY = TORSO_TOP - 10;
    torsoBottomY = TORSO_BOTTOM - 8;
    hipY = HIP_Y - 5;
    legLen = LEG_LEN * 0.7;
    shoulderY = torsoTopY + 12;
  }

  const leftFootX = jump ? -6 : -10 + legL;
  const leftFootY = jump ? hipY + legLen * 0.8 : hipY + legLen + 6;
  const leftKneeX = jump ? -4 : -8 + legL * 0.35;
  const leftKneeY = jump ? hipY + legLen * 0.4 : hipY + legLen * 0.5 + (legL > 0 ? kneeBend : 0);
  const rightFootX = jump ? 6 : 10 + legR;
  const rightFootY = jump ? hipY + legLen * 0.8 : hipY + legLen + 6;
  const rightKneeX = jump ? 4 : 8 + legR * 0.35;
  const rightKneeY = jump ? hipY + legLen * 0.4 : hipY + legLen * 0.5 + (legR > 0 ? kneeBend : 0);

  const leftHandAngle = jump ? 0.1 : 0.45 + (armSwing * Math.PI) / 180;
  const rightHandAngle = jump ? 0.1 : 0.45 - (armSwing * Math.PI) / 180;
  const leftHandX = -14 - ARM_LEN * Math.cos(leftHandAngle);
  const leftHandY = shoulderY + ARM_LEN * Math.sin(leftHandAngle);
  const rightHandX = 14 + ARM_LEN * Math.cos(rightHandAngle);
  const rightHandY = shoulderY + ARM_LEN * Math.sin(rightHandAngle);

  const neckY = crouch ? torsoTopY - 12 : NECK_Y;
  const headY = neckY - HEAD_R - 2;

  return {
    head: { x: 0, y: headY },
    neck: { x: 0, y: neckY },
    torsoTop: { x: 0, y: torsoTopY },
    torsoBottom: { x: 0, y: torsoBottomY },
    leftShoulder: { x: -14, y: shoulderY },
    rightShoulder: { x: 14, y: shoulderY },
    leftHand: { x: leftHandX, y: leftHandY },
    rightHand: { x: rightHandX, y: rightHandY },
    leftHip: { x: -8, y: hipY },
    rightHip: { x: 8, y: hipY },
    leftKnee: { x: leftKneeX, y: leftKneeY },
    rightKnee: { x: rightKneeX, y: rightKneeY },
    leftFoot: { x: leftFootX, y: leftFootY },
    rightFoot: { x: rightFootX, y: rightFootY }
  };
}

/**
 * Get axis-aligned bounds of the skeleton in local space { minX, maxX, minY, maxY } with optional padding.
 */
export function getSkeletonBounds(skeleton, padding = 4) {
  const pts = Object.values(skeleton);
  let minX = pts[0].x;
  let maxX = pts[0].x;
  let minY = pts[0].y;
  let maxY = pts[0].y;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding
  };
}

export { HEAD_R };

const LINE_THICK = 5;
const JOINT_R = 4;
const FOOT_R = 5;
const WHITE = 0xffffff;
const LIGHT = 0x99b8d4;
const DARK = 0x1a2a3a;

/**
 * Draw stickman to Graphics in local coordinates (origin = center).
 * @param {Phaser.GameObjects.Graphics} graphics
 * @param {Object} skeleton - from getSkeleton()
 * @param {number} [glowColor=0x55d6ff] - optional glow behind figure
 */
export function drawStickman(graphics, skeleton, glowColor = 0x55d6ff) {
  const s = skeleton;
  graphics.clear();

  if (glowColor != null) {
    graphics.fillStyle(glowColor, 0.12);
    graphics.fillEllipse(0, 0, 70, 100);
  }

  const line = (x0, y0, x1, y1) => {
    graphics.lineStyle(LINE_THICK, WHITE, 1);
    graphics.lineBetween(x0, y0, x1, y1);
  };

  line(s.neck.x, s.neck.y, s.torsoTop.x, s.torsoTop.y);
  line(s.torsoTop.x, s.torsoTop.y, s.torsoBottom.x, s.torsoBottom.y);
  line(s.torsoBottom.x, s.torsoBottom.y, s.leftHip.x, s.leftHip.y);
  line(s.torsoBottom.x, s.torsoBottom.y, s.rightHip.x, s.rightHip.y);

  line(s.leftHip.x, s.leftHip.y, s.leftKnee.x, s.leftKnee.y);
  line(s.leftKnee.x, s.leftKnee.y, s.leftFoot.x, s.leftFoot.y);
  line(s.rightHip.x, s.rightHip.y, s.rightKnee.x, s.rightKnee.y);
  line(s.rightKnee.x, s.rightKnee.y, s.rightFoot.x, s.rightFoot.y);

  line(s.leftShoulder.x, s.leftShoulder.y, s.leftHand.x, s.leftHand.y);
  line(s.rightShoulder.x, s.rightShoulder.y, s.rightHand.x, s.rightHand.y);

  graphics.fillStyle(WHITE, 1);
  graphics.fillCircle(s.leftShoulder.x, s.leftShoulder.y, JOINT_R);
  graphics.fillCircle(s.rightShoulder.x, s.rightShoulder.y, JOINT_R);
  graphics.fillCircle(s.leftHip.x, s.leftHip.y, JOINT_R);
  graphics.fillCircle(s.rightHip.x, s.rightHip.y, JOINT_R);
  graphics.fillCircle(s.leftHand.x, s.leftHand.y, JOINT_R * 0.9);
  graphics.fillCircle(s.rightHand.x, s.rightHand.y, JOINT_R * 0.9);
  graphics.fillCircle(s.leftFoot.x, s.leftFoot.y, FOOT_R);
  graphics.fillCircle(s.rightFoot.x, s.rightFoot.y, FOOT_R);

  const headY = s.head.y;
  graphics.fillStyle(WHITE, 1);
  graphics.fillCircle(s.head.x, headY, HEAD_R);
  graphics.fillStyle(LIGHT, 0.5);
  graphics.fillCircle(s.head.x - 4, headY - 4, HEAD_R * 0.35);
  graphics.lineStyle(2, WHITE, 0.5);
  graphics.strokeCircle(s.head.x, headY, HEAD_R * 0.88);
  graphics.fillStyle(DARK, 0.95);
  graphics.fillCircle(s.head.x - 6, headY - 2, 3);
  graphics.fillCircle(s.head.x + 6, headY - 2, 3);
  graphics.fillStyle(WHITE, 0.9);
  graphics.fillCircle(s.head.x - 5, headY - 3, 1);
  graphics.fillCircle(s.head.x + 7, headY - 3, 1);
}

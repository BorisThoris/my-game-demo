/**
 * Shows a short-lived floating text at (x, y): moves upward and fades out, then destroys.
 * @param {Phaser.Scene} scene - The scene (this from dodgeGame).
 * @param {number} x - World x.
 * @param {number} y - World y.
 * @param {string} text - Text to show (e.g. "+1 Shield", "Speed!").
 * @param {string} colorHex - Fill color (e.g. "#55d6ff").
 */
export function showFloatingText(scene, x, y, text, colorHex) {
  const txt = scene.add.text(x, y, text, {
    fontSize: "26px",
    fontStyle: "bold",
    fill: colorHex,
    align: "center"
  });
  txt.setOrigin(0.5, 0.5);
  txt.setDepth(20);

  const duration = 700;
  const moveY = -70;

  scene.tweens.add({
    targets: txt,
    y: y + moveY,
    alpha: 0,
    duration,
    ease: "Power2",
    onComplete: () => txt.destroy()
  });
}

/**
 * Z-index tokens for layering (Phaser depth / DOM stacking).
 * Use theme.zIndex in scenes; avoid magic numbers.
 */
const zIndex = {
  auto: "auto",
  base: 0,
  background: 0,
  gameplay: 4,
  pickups: 3,
  hud: 8,
  overlay: 10,
  pausePanel: 15,
  challengePanel: 15,
  gameOverPanel: 10,
  gameOverContent: 11,
  replayButton: 13,
  getReady: 20,
  banner: 12,
  dropdown: 1000,
  modal: 1400,
  tooltip: 1800
};

export default zIndex;

/**
 * Shared HUD text styles for the dodge game scene.
 * Use with add.text(x, y, content, DODGE_HUD_STYLES.scoreText) etc.
 */
const base = {
  fontFamily: "Arial",
  fontStyle: "bold"
};

export const DODGE_HUD_STYLES = {
  scoreText: {
    ...base,
    fontSize: "44px",
    fill: "#fff2b5"
  },
  highestScore: {
    ...base,
    fontSize: "24px",
    fill: "#d7f9ff"
  },
  phaseText: {
    ...base,
    fontSize: "32px",
    fill: "#55d6ff"
  },
  shieldText: {
    ...base,
    fontSize: "24px",
    fill: "#ffffff"
  },
  statusText: {
    ...base,
    fontSize: "24px",
    fill: "#d7f9ff",
    align: "center"
  },
  objectiveText: {
    ...base,
    fontSize: "20px",
    fill: "#a6d9ff",
    align: "left"
  },
  bossTimerText: {
    ...base,
    fontSize: "20px",
    fill: "#ffaa44",
    align: "left"
  }
};

/** Stroke for key HUD text so they read on the background */
export const HUD_STROKE = {
  color: "#0d1823",
  width: 3
};

/** Audio: music ducking and SFX (ooGnome/gameOver) rate/volume for events */
export const DODGE_AUDIO = {
  musicNormalVolume: 1,
  musicDuckVolume: 0.25,
  musicBossVolume: 0.65,
  sfxPhaseChange: { rate: 1.1, volume: 0.2 },
  sfxExitUnlock: { rate: 1.2, volume: 0.25 },
  sfxObjectiveComplete: { rate: 1.15, volume: 0.22 },
  sfxChallengeComplete: { rate: 1.15, volume: 0.22 }
};

/**
 * Shared HUD text styles for the dodge game scene.
 * All values come from the active theme (Settings → Theme).
 */
import { getTheme } from "./styleTokens/index.js";

function buildHudStyles(theme) {
  const { typography, colors, components } = theme;
  const hudComp = components.hud;
  const strokeWidth = hudComp.stroke?.width ?? 3;
  const base = { fontFamily: typography.fontFamily.primary, fontStyle: typography.fontStyle.bold };
  return {
    scoreText: { ...base, fontSize: hudComp.scoreText.fontSize ?? typography.fontSize["2xl"], fill: colors.semantic.text.score },
    highestScore: { ...base, fontSize: hudComp.highestScore.fontSize ?? typography.fontSize.base, fill: colors.semantic.text.best },
    phaseText: { ...base, fontSize: hudComp.phaseText.fontSize ?? typography.fontSize.xl, fill: colors.semantic.text.phase },
    shieldText: { ...base, fontSize: hudComp.shieldText.fontSize ?? typography.fontSize.base, fill: colors.semantic.text.shield },
    statusText: { ...base, fontSize: hudComp.statusText.fontSize ?? typography.fontSize.base, fill: colors.semantic.text.status, align: "center" },
    objectiveText: { ...base, fontSize: hudComp.objectiveText.fontSize ?? typography.fontSize.sm, fill: colors.semantic.text.objective, align: "left" },
    bossTimerText: { ...base, fontSize: hudComp.bossTimerText.fontSize ?? typography.fontSize.sm, fill: colors.semantic.text.bossTimer, align: "left" }
  };
}

/** Resolves to current theme so changing theme in Settings updates HUD. */
export const DODGE_HUD_STYLES = new Proxy({}, { get(_, prop) { return buildHudStyles(getTheme())[prop]; } });

/** Stroke for key HUD text. Resolves to current theme. */
export const HUD_STROKE = new Proxy(
  {},
  {
    get(_, prop) {
      const theme = getTheme();
      const w = theme.components.hud.stroke?.width ?? 3;
      return prop === "color" ? theme.colors.semantic.stroke.hud : prop === "width" ? w : undefined;
    }
  }
);

/** Audio: music ducking and SFX (ooGnome/gameOver) rate/volume for events */
export const DODGE_AUDIO = {
  musicNormalVolume: 1,
  musicDuckVolume: 0.25,
  musicBossVolume: 0.65,
  sfxPhaseChange: { rate: 1.1, volume: 0.2 },
  sfxExitUnlock: { rate: 1.2, volume: 0.25 },
  sfxObjectiveComplete: { rate: 1.15, volume: 0.22 },
  sfxChallengeComplete: { rate: 1.15, volume: 0.22 },
  sfxDestroy: { rate: 1.0, volume: 0.18 },
  sfxChainDestroy: { rate: 1.25, volume: 0.22 }
};

export { getTheme as theme };

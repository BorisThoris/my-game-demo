# Accessibility notes (Skyfall)

## Safe mode (Options)

**Setting:** `reduceMotionSafeMode` in save / Options → “Safe mode (photosensitivity)”.

**Behavior:** When enabled, the run scene clamps **screen shake** and **full-screen flash** intensity before they reach Phaser / juice helpers (`dodgeGame.refreshAccessibilitySettings`). Default gameplay is unchanged when the toggle is off.

**Limits:** Perk challenge panels, Phaser tweens, and some juice pulses are not individually gated; a full audit would be follow-up work.

## Color-blind palette (Options)

**Setting:** `colorBlindPaletteMode` — cycles protanopia / deuteranopia / tritanopia presets.

**Behavior:** Hazard tints are biased toward **warm vs cool** contrast using `mapHazardTint` in `dodgeGame.js`. This aids readability; it does **not** recolor all UI or art.

## Playtest checklist

1. Toggle **Safe mode** on, die to a boss or collect a **Gambit** pickup — flashes should feel milder than with the toggle off at equal flash/shake sliders.
2. Set **Color blind palette** to each mode on a dense hazard screen — hazards should remain distinguishable by hue family.

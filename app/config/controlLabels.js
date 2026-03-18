/**
 * Display labels for in-game controls (Options → Controls).
 * Single source of truth for key binding text; rebinding not implemented yet.
 */
export const CONTROL_LABELS = [
  { action: "Move", keys: "Arrow keys / WASD" },
  { action: "Pause", keys: "Escape (or Pause button)" },
  { action: "Start game", keys: "Space / Enter / Click" },
  { action: "Challenge / Perk", keys: "1, 2, 3 (number keys for choices)" }
];

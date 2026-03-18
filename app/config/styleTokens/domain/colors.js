/**
 * Color tokens - base palette and semantic usage.
 * Use theme.colors in styles; do not hardcode hex in component code.
 */
const base = {
  white: "#ffffff",
  black: "#000000",
  whiteHex: 0xffffff,
  blackHex: 0x000000,
  transparent: "transparent"
};

/** Aligned with Skyfall theme for consistent fallback when theme is not applied */
const semantic = {
  /** HUD and UI text */
  text: {
    score: "#ffec8b",
    best: "#c8f0fa",
    phase: "#67d9f9",
    shield: "#ffffff",
    status: "#e0f7fa",
    objective: "#b3e5fc",
    bossTimer: "#ffc857",
    warning: "#ffc857",
    danger: "#ff8a80",
    success: "#80e27e",
    accent: "#84ffff",
    muted: "#b0bec5",
    warm: "#ffcc80"
  },
  /** Strokes and borders */
  stroke: {
    hud: "#1a237e",
    panel: "#67d9f9",
    gameOver: "#ff8a80",
    replay: "#ff8a80"
  },
  /** Backgrounds (hex for canvas) */
  background: {
    panel: "#0d1b2a",
    panelAlpha: 0.92,
    overlay: "#0a1628",
    flash: "#67d9f9"
  },
  /** Game-specific (Phaser tint hex) */
  game: {
    playerGlow: 0x67d9f9,
    phaseCyan: 0x67d9f9,
    phaseAmber: 0xffd54f,
    phaseRed: 0xff8a80,
    phaseGreen: 0x80e27e,
    hazardDefault: 0xffffff,
    pickupShield: 0xc8f0fa,
    pickupSpeed: 0x64ffda,
    pickupInvuln: 0xffeb3b,
    pickupScoreMult: 0xa7ffeb,
    cardStroke: 0x78909c,
    cardStrokeSuccess: 0x80e27e,
    cardStrokeCanBuy: 0xffd54f,
    menuPanel: 0x0d1b2a,
    menuAccent: 0xffd54f,
    loadingTrack: 0x0d1b2a,
    loadingFill: 0x67d9f9,
    decorOrb: 0xffab40,
    decorPolygon: 0xb39ddb,
    bossTelegraphCross: 0xb39ddb
  },
  /** Stickman figure drawing (Phaser tint) */
  figure: {
    limb: 0xffffff,
    highlight: 0xc8f0fa,
    shadow: 0x37474f
  },
  /** Procedural assets: ground, sky, UI shapes (Phaser tint) */
  procedural: {
    groundDark: 0x00695c,
    groundMid: 0x26a69a,
    skyTop: 0x1a237e,
    skyBottom: 0x283593,
    arrow: 0xffffff,
    uiFill: 0xffffff,
    uiStroke: 0xc8f0fa,
    uiPanel: 0x0d1b2a,
    uiMuted: 0xb0bec5,
    overlayDark: 0x0a1628,
    heatFill: 0xff8a80,
    heatAccent: 0xffab40,
    successFill: 0x80e27e,
    bossInner: 0xfff8e1,
    bossCore: 0x0d1b2a
  },
  /** Colorblind-friendly palettes (Phaser tint): warm, cool, mid */
  accessibility: {
    default: { warm: 0xf59e0b, cool: 0x06b6d4, mid: 0x10b981 },
    protanopia: { warm: 0xd97706, cool: 0x0891b2, mid: 0x059669 },
    deuteranopia: { warm: 0xb45309, cool: 0x0e7490, mid: 0x047857 },
    tritanopia: { warm: 0xea580c, cool: 0x2563eb, mid: 0x7c3aed }
  }
};

/** Hazard/archetype/boss tints (aligned with Skyfall theme). */
const palette = {
  runPhaseRecovery: 0x67d9f9,
  runPhasePush: 0xffd54f,
  runPhaseHeat: 0xff8a80,
  runPhaseReset: 0x80e27e,
  meteorTint: 0xffab40,
  meteorVariant: 0xffcc80,
  shardTint: 0xff8a80,
  shardVariant: 0xffccbc,
  crusherTint: 0x69f0ae,
  sentinelTint: 0x82b1ff,
  polygonTint: 0xd1c4e9,
  polygonVariant: 0xe1bee7,
  zigzagTint: 0xffd54f,
  streakTint: 0x84ffff,
  wedgeTint: 0xea80fc,
  spinnerTint: 0xe040fb,
  ringTint: 0xffeb3b,
  droneTint: 0xffb74d,
  crossTint: 0x64ffda,
  slicerTint: 0x1de9b6,
  starTint: 0xe040fb,
  hexTint: 0xc5b3e6,
  pulseTint: 0xc8f0fa,
  bossStormCore: 0xff8a80,
  bossVoidSpire: 0xb39ddb,
  bossEmberNexus: 0xffab40,
  bossFrostShard: 0x84ffff,
  bossChaosRift: 0x69f0ae
};

const colors = {
  base,
  semantic,
  palette
};

export default colors;

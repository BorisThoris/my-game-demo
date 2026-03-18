/**
 * Predefined color themes. Each theme has the same structure: base, semantic, palette.
 * Read themeId from settings (localStorage); getTheme() in index.js returns the active theme.
 */

const SAVE_KEY = "skyfall_save";

export const THEME_IDS = ["skyfall", "ocean", "sunset", "highcontrast"];
export const THEME_NAMES = {
  skyfall: "Skyfall",
  ocean: "Ocean",
  sunset: "Sunset",
  highcontrast: "High contrast"
};

function buildColors(semantic, palette) {
  return {
    base: {
      white: "#ffffff",
      black: "#000000",
      whiteHex: 0xffffff,
      blackHex: 0x000000,
      transparent: "transparent"
    },
    semantic: { ...semantic },
    palette: { ...palette }
  };
}

/** Skyfall (default): balanced, colorful, strong contrast – light-on-dark text, bright objects on mid-dark sky */
const skyfallSemantic = {
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
  stroke: {
    hud: "#1a237e",
    panel: "#67d9f9",
    gameOver: "#ff8a80",
    replay: "#ff8a80"
  },
  background: {
    panel: "#0d1b2a",
    panelAlpha: 0.92,
    overlay: "#0a1628",
    flash: "#67d9f9"
  },
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
  figure: { limb: 0xffffff, highlight: 0xc8f0fa, shadow: 0x37474f },
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
  accessibility: {
    default: { warm: 0xf59e0b, cool: 0x06b6d4, mid: 0x10b981 },
    protanopia: { warm: 0xd97706, cool: 0x0891b2, mid: 0x059669 },
    deuteranopia: { warm: 0xb45309, cool: 0x0e7490, mid: 0x047857 },
    tritanopia: { warm: 0xea580c, cool: 0x2563eb, mid: 0x7c3aed }
  }
};
const skyfallPalette = {
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

/** Ocean: cool blues, teals – mid-tone sky so objects pop, high-contrast text */
const oceanSemantic = {
  text: {
    score: "#fffde7",
    best: "#e1f5fe",
    phase: "#4fc3f7",
    shield: "#ffffff",
    status: "#e1f5fe",
    objective: "#81d4fa",
    bossTimer: "#ffca28",
    warning: "#ffca28",
    danger: "#ff8a80",
    success: "#1de9b6",
    accent: "#4fc3f7",
    muted: "#9eacb8",
    warm: "#ffcc80"
  },
  stroke: { hud: "#01579b", panel: "#4fc3f7", gameOver: "#ff80ab", replay: "#ff80ab" },
  background: { panel: "#0d47a1", panelAlpha: 0.92, overlay: "#0a3d91", flash: "#4fc3f7" },
  game: {
    playerGlow: 0x4fc3f7,
    phaseCyan: 0x4fc3f7,
    phaseAmber: 0xffca28,
    phaseRed: 0xff80ab,
    phaseGreen: 0x1de9b6,
    hazardDefault: 0xffffff,
    pickupShield: 0xe1f5fe,
    pickupSpeed: 0x1de9b6,
    pickupInvuln: 0xffeb3b,
    pickupScoreMult: 0xa7ffeb,
    cardStroke: 0x29b6f6,
    cardStrokeSuccess: 0x1de9b6,
    cardStrokeCanBuy: 0xffca28,
    menuPanel: 0x0d47a1,
    menuAccent: 0x4fc3f7,
    loadingTrack: 0x0d47a1,
    loadingFill: 0x4fc3f7,
    decorOrb: 0x29b6f6,
    decorPolygon: 0x8c9eff,
    bossTelegraphCross: 0x8c9eff
  },
  figure: { limb: 0xffffff, highlight: 0xb3e5fc, shadow: 0x37474f },
  procedural: {
    groundDark: 0x006064,
    groundMid: 0x00acc1,
    skyTop: 0x0d47a1,
    skyBottom: 0x1565c0,
    arrow: 0xffffff,
    uiFill: 0xffffff,
    uiStroke: 0xe1f5fe,
    uiPanel: 0x0d47a1,
    uiMuted: 0x9eacb8,
    overlayDark: 0x0a3d91,
    heatFill: 0xff80ab,
    heatAccent: 0xffab40,
    successFill: 0x1de9b6,
    bossInner: 0xe3f2fd,
    bossCore: 0x0d47a1
  },
  accessibility: {
    default: { warm: 0xf59e0b, cool: 0x06b6d4, mid: 0x10b981 },
    protanopia: { warm: 0xd97706, cool: 0x0891b2, mid: 0x059669 },
    deuteranopia: { warm: 0xb45309, cool: 0x0e7490, mid: 0x047857 },
    tritanopia: { warm: 0xea580c, cool: 0x2563eb, mid: 0x7c3aed }
  }
};
const oceanPalette = {
  runPhaseRecovery: 0x4fc3f7,
  runPhasePush: 0xffca28,
  runPhaseHeat: 0xff80ab,
  runPhaseReset: 0x1de9b6,
  meteorTint: 0x29b6f6,
  meteorVariant: 0x81d4fa,
  shardTint: 0xff80ab,
  shardVariant: 0xffab91,
  crusherTint: 0x64ffda,
  sentinelTint: 0x82b1ff,
  polygonTint: 0x8c9eff,
  polygonVariant: 0xb3bfff,
  zigzagTint: 0xffca28,
  streakTint: 0x4dd0e1,
  wedgeTint: 0xb388ff,
  spinnerTint: 0x8c9eff,
  ringTint: 0xffeb3b,
  droneTint: 0x29b6f6,
  crossTint: 0x1de9b6,
  slicerTint: 0x00e5ff,
  starTint: 0xb388ff,
  hexTint: 0x7c4dff,
  pulseTint: 0xe1f5fe,
  bossStormCore: 0xff80ab,
  bossVoidSpire: 0x8c9eff,
  bossEmberNexus: 0xffab40,
  bossFrostShard: 0x4dd0e1,
  bossChaosRift: 0x1de9b6
};

/** Sunset: warm oranges, corals, purples – mid-dark sky, bright objects and text */
const sunsetSemantic = {
  text: {
    score: "#fff8e1",
    best: "#fce4ec",
    phase: "#ff9800",
    shield: "#ffffff",
    status: "#fff3e0",
    objective: "#ffab91",
    bossTimer: "#ffca28",
    warning: "#ffca28",
    danger: "#ff5252",
    success: "#69f0ae",
    accent: "#ffab40",
    muted: "#a1887f",
    warm: "#ffcc80"
  },
  stroke: { hud: "#bf360c", panel: "#ff9800", gameOver: "#ff5252", replay: "#ff5252" },
  background: { panel: "#e65100", panelAlpha: 0.92, overlay: "#bf360c", flash: "#ff9800" },
  game: {
    playerGlow: 0xffab40,
    phaseCyan: 0xff9800,
    phaseAmber: 0xffca28,
    phaseRed: 0xff5252,
    phaseGreen: 0x69f0ae,
    hazardDefault: 0xffffff,
    pickupShield: 0xfff3e0,
    pickupSpeed: 0x1de9b6,
    pickupInvuln: 0xffeb3b,
    pickupScoreMult: 0xa7ffeb,
    cardStroke: 0xffab91,
    cardStrokeSuccess: 0x69f0ae,
    cardStrokeCanBuy: 0xffca28,
    menuPanel: 0xbf360c,
    menuAccent: 0xffab40,
    loadingTrack: 0xbf360c,
    loadingFill: 0xff9800,
    decorOrb: 0xff9800,
    decorPolygon: 0xce93d8,
    bossTelegraphCross: 0xce93d8
  },
  figure: { limb: 0xffffff, highlight: 0xffe0b2, shadow: 0x3e2723 },
  procedural: {
    groundDark: 0x4e342e,
    groundMid: 0x6d4c41,
    skyTop: 0xbf360c,
    skyBottom: 0x6a1b9a,
    arrow: 0xffffff,
    uiFill: 0xffffff,
    uiStroke: 0xffe0b2,
    uiPanel: 0xbf360c,
    uiMuted: 0xa1887f,
    overlayDark: 0xbf360c,
    heatFill: 0xff5252,
    heatAccent: 0xffab40,
    successFill: 0x69f0ae,
    bossInner: 0xfff3e0,
    bossCore: 0x3e2723
  },
  accessibility: {
    default: { warm: 0xf59e0b, cool: 0x06b6d4, mid: 0x10b981 },
    protanopia: { warm: 0xd97706, cool: 0x0891b2, mid: 0x059669 },
    deuteranopia: { warm: 0xb45309, cool: 0x0e7490, mid: 0x047857 },
    tritanopia: { warm: 0xea580c, cool: 0x2563eb, mid: 0x7c3aed }
  }
};
const sunsetPalette = {
  runPhaseRecovery: 0xff9800,
  runPhasePush: 0xffca28,
  runPhaseHeat: 0xff5252,
  runPhaseReset: 0x69f0ae,
  meteorTint: 0xffab40,
  meteorVariant: 0xffcc80,
  shardTint: 0xff5252,
  shardVariant: 0xff8a80,
  crusherTint: 0x76ff03,
  sentinelTint: 0xffab40,
  polygonTint: 0xce93d8,
  polygonVariant: 0xe1bee7,
  zigzagTint: 0xffca28,
  streakTint: 0xff9800,
  wedgeTint: 0xea80fc,
  spinnerTint: 0xce93d8,
  ringTint: 0xffeb3b,
  droneTint: 0xff9800,
  crossTint: 0x00e676,
  slicerTint: 0x1de9b6,
  starTint: 0xea80fc,
  hexTint: 0xb39ddb,
  pulseTint: 0xfff3e0,
  bossStormCore: 0xff5252,
  bossVoidSpire: 0xce93d8,
  bossEmberNexus: 0xffab40,
  bossFrostShard: 0x40c4ff,
  bossChaosRift: 0x69f0ae
};

/** High contrast: maximum readability – bright text/objects on dark, distinct ground */
const highContrastSemantic = {
  text: {
    score: "#ffff00",
    best: "#00ffff",
    phase: "#00bfff",
    shield: "#ffffff",
    status: "#e0ffff",
    objective: "#87ceeb",
    bossTimer: "#ffa500",
    warning: "#ffa500",
    danger: "#ff4500",
    success: "#00ff7f",
    accent: "#00ffff",
    muted: "#c0c0c0",
    warm: "#ff8c00"
  },
  stroke: { hud: "#000000", panel: "#00ffff", gameOver: "#ff4500", replay: "#ff4500" },
  background: { panel: "#000000", panelAlpha: 0.95, overlay: "#000000", flash: "#00bfff" },
  game: {
    playerGlow: 0x00bfff,
    phaseCyan: 0x00bfff,
    phaseAmber: 0xffa500,
    phaseRed: 0xff4500,
    phaseGreen: 0x00ff7f,
    hazardDefault: 0xffffff,
    pickupShield: 0x00ffff,
    pickupSpeed: 0x00e5ff,
    pickupInvuln: 0xffff00,
    pickupScoreMult: 0x00ffcc,
    cardStroke: 0x606060,
    cardStrokeSuccess: 0x00ff7f,
    cardStrokeCanBuy: 0xffa500,
    menuPanel: 0x000000,
    menuAccent: 0x00ffff,
    loadingTrack: 0x000000,
    loadingFill: 0x00bfff,
    decorOrb: 0xff6347,
    decorPolygon: 0xba55d3,
    bossTelegraphCross: 0xba55d3
  },
  figure: { limb: 0xffffff, highlight: 0xe0ffff, shadow: 0x000000 },
  procedural: {
    groundDark: 0x1b5e20,
    groundMid: 0x43a047,
    skyTop: 0x0d0d1a,
    skyBottom: 0x1a1a3e,
    arrow: 0xffffff,
    uiFill: 0xffffff,
    uiStroke: 0x00ffff,
    uiPanel: 0x000000,
    uiMuted: 0xc0c0c0,
    overlayDark: 0x000000,
    heatFill: 0xff4500,
    heatAccent: 0xffa500,
    successFill: 0x00ff7f,
    bossInner: 0xffffff,
    bossCore: 0x000000
  },
  accessibility: {
    default: { warm: 0xffa500, cool: 0x00bfff, mid: 0x00ff7f },
    protanopia: { warm: 0xff8c00, cool: 0x1e90ff, mid: 0x3cb371 },
    deuteranopia: { warm: 0xff6347, cool: 0x4169e1, mid: 0x2e8b57 },
    tritanopia: { warm: 0xff4500, cool: 0x0000cd, mid: 0x8a2be2 }
  }
};
const highContrastPalette = {
  runPhaseRecovery: 0x00bfff,
  runPhasePush: 0xffa500,
  runPhaseHeat: 0xff4500,
  runPhaseReset: 0x00ff7f,
  meteorTint: 0xff6347,
  meteorVariant: 0xffab91,
  shardTint: 0xff4500,
  shardVariant: 0xff8a80,
  crusherTint: 0x00ffcc,
  sentinelTint: 0x40c4ff,
  polygonTint: 0xba55d3,
  polygonVariant: 0xe1bee7,
  zigzagTint: 0xffa500,
  streakTint: 0x00e5ff,
  wedgeTint: 0xce93d8,
  spinnerTint: 0xba55d3,
  ringTint: 0xffff00,
  droneTint: 0xff7043,
  crossTint: 0x00ffcc,
  slicerTint: 0x00e5ff,
  starTint: 0xce93d8,
  hexTint: 0x7c4dff,
  pulseTint: 0xb2ebf2,
  bossStormCore: 0xff4500,
  bossVoidSpire: 0xba55d3,
  bossEmberNexus: 0xff7043,
  bossFrostShard: 0x00e5ff,
  bossChaosRift: 0x00ff7f
};

const THEME_COLORS = {
  skyfall: buildColors(skyfallSemantic, skyfallPalette),
  ocean: buildColors(oceanSemantic, oceanPalette),
  sunset: buildColors(sunsetSemantic, sunsetPalette),
  highcontrast: buildColors(highContrastSemantic, highContrastPalette)
};

/** Read current theme id from localStorage (avoids circular dependency on saveManager). */
export function getThemeId() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(SAVE_KEY) : null;
    if (raw) {
      const save = JSON.parse(raw);
      const id = save?.settings?.themeId;
      if (id && THEME_IDS.includes(id)) return id;
    }
  } catch (_) {}
  return "skyfall";
}

export function getThemeColors(themeId) {
  return THEME_COLORS[themeId] || THEME_COLORS.skyfall;
}

export function getThemeList() {
  return THEME_IDS.map((id) => ({ id, name: THEME_NAMES[id] }));
}

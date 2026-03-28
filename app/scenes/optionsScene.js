import { CONTROL_LABELS } from "../config/controlLabels";
import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { BODY_STYLE, PANEL_TITLE_STYLE } from "../config/sceneStyles";
import { getSettings, setSettings } from "../save/saveManager";
import { getThemeList } from "../config/styleTokens/themes";
import { GAME_VERSION } from "../config/version";
import { EXTERNAL_LINKS } from "../config/externalLinks";
import { openExternalLink } from "../shared/browser";
import BaseScene from "./baseScene";

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export default class OptionsScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.options);
  }

  create(data) {
    super.createSceneShell(GAME_WIDTH - 120, "flex", false);
    this.input.keyboard.resetKeys();
    this.returnTo = (data && data.returnTo) || SCENE_KEYS.mainMenu;
    this.returnData = (data && data.returnData) || null;

    const settings = getSettings();
    const colors = theme.colors;

    let y = 80;
    this.createText(GAME_CENTER_X, y, "Options", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 70;

    // Music volume
    this.createText(200, y, "Music volume", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const musicVal = this.createText(520, y, `${Math.round((getSettings().musicVolume || 1) * 100)}%`, {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.status,
      align: "left"
    });
    const musicDown = this.createText(340, y, " − ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    const musicUp = this.createText(420, y, " + ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    musicDown.on("pointerdown", () => {
      const s = getSettings();
      const v = clamp01((s.musicVolume || 1) - 0.1);
      setSettings({ musicVolume: v });
      musicVal.setText(`${Math.round(v * 100)}%`);
    });
    musicUp.on("pointerdown", () => {
      const s = getSettings();
      const v = clamp01((s.musicVolume || 1) + 0.1);
      setSettings({ musicVolume: v });
      musicVal.setText(`${Math.round(v * 100)}%`);
    });
    y += 50;

    // SFX volume
    this.createText(200, y, "SFX volume", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const sfxVal = this.createText(520, y, `${Math.round((getSettings().sfxVolume || 1) * 100)}%`, {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.status,
      align: "left"
    });
    const sfxDown = this.createText(340, y, " − ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    const sfxUp = this.createText(420, y, " + ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    sfxDown.on("pointerdown", () => {
      const s = getSettings();
      const v = clamp01((s.sfxVolume || 1) - 0.1);
      setSettings({ sfxVolume: v });
      sfxVal.setText(`${Math.round(v * 100)}%`);
    });
    sfxUp.on("pointerdown", () => {
      const s = getSettings();
      const v = clamp01((s.sfxVolume || 1) + 0.1);
      setSettings({ sfxVolume: v });
      sfxVal.setText(`${Math.round(v * 100)}%`);
    });
    y += 55;

    // Screen shake intensity
    this.createText(200, y, "Screen shake", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const shakeVal = this.createText(520, y, `${Math.round((getSettings().screenShakeIntensity ?? 1) * 100)}%`, {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.status,
      align: "left"
    });
    const shakeDown = this.createText(340, y, " − ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    const shakeUp = this.createText(420, y, " + ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    shakeDown.on("pointerdown", () => {
      const v = clamp01((getSettings().screenShakeIntensity ?? 1) - 0.1);
      setSettings({ screenShakeIntensity: v });
      shakeVal.setText(`${Math.round(v * 100)}%`);
    });
    shakeUp.on("pointerdown", () => {
      const v = clamp01((getSettings().screenShakeIntensity ?? 1) + 0.1);
      setSettings({ screenShakeIntensity: v });
      shakeVal.setText(`${Math.round(v * 100)}%`);
    });
    y += 50;

    // Flash effect intensity
    this.createText(200, y, "Flash/hit effects", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const flashVal = this.createText(520, y, `${Math.round((getSettings().flashIntensity ?? 1) * 100)}%`, {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.status,
      align: "left"
    });
    const flashDown = this.createText(340, y, " − ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    const flashUp = this.createText(420, y, " + ", { ...BODY_STYLE, font: "700 24px Arial", fill: colors.semantic.text.accent }).setInteractive({ useHandCursor: true });
    flashDown.on("pointerdown", () => {
      const v = clamp01((getSettings().flashIntensity ?? 1) - 0.1);
      setSettings({ flashIntensity: v });
      flashVal.setText(`${Math.round(v * 100)}%`);
    });
    flashUp.on("pointerdown", () => {
      const v = clamp01((getSettings().flashIntensity ?? 1) + 0.1);
      setSettings({ flashIntensity: v });
      flashVal.setText(`${Math.round(v * 100)}%`);
    });
    y += 50;

    this.createText(200, y, "Safe mode (photosensitivity)", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const safeVal = this.createText(520, y, getSettings().reduceMotionSafeMode ? "On" : "Off", {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    const safeToggle = this.createText(340, y, "Toggle", {
      ...BODY_STYLE,
      font: "700 20px Arial",
      fill: colors.semantic.text.warm,
      align: "left"
    });
    safeToggle.setInteractive({ useHandCursor: true });
    safeToggle.on("pointerdown", () => {
      const next = !getSettings().reduceMotionSafeMode;
      setSettings({ reduceMotionSafeMode: next });
      safeVal.setText(next ? "On" : "Off");
    });
    y += 36;
    this.createText(
      200,
      y,
      "Caps brightest flashes and screen shake. See docs/ACCESSIBILITY.md.",
      {
        ...BODY_STYLE,
        font: "700 14px Arial",
        fill: colors.semantic.text.muted,
        align: "left",
        wordWrap: { width: GAME_WIDTH - 240 }
      }
    );
    y += 44;

    // Fullscreen toggle (text button)
    const fsLabel = this.createText(200, y, settings.fullscreen ? "Fullscreen: On" : "Fullscreen: Off", {
      ...BODY_STYLE,
      font: "700 24px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    fsLabel.setInteractive({ useHandCursor: true });
    fsLabel.on("pointerdown", () => {
      const next = !getSettings().fullscreen;
      setSettings({ fullscreen: next });
      fsLabel.setText(next ? "Fullscreen: On" : "Fullscreen: Off");
      if (this.scale && this.scale.startFullscreen && this.scale.stopFullscreen) {
        if (next) {
          this.scale.startFullscreen();
        } else {
          this.scale.stopFullscreen();
        }
      }
    });
    y += 55;

    // Controls (display only; labels from config)
    this.createText(GAME_CENTER_X, y, "Controls", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 40;
    CONTROL_LABELS.forEach(({ action, keys }) => {
      this.createText(200, y, `${action}: ${keys}`, {
        ...BODY_STYLE,
        font: "700 20px Arial",
        align: "left",
        fill: colors.semantic.text.status
      });
      y += 32;
    });
    y += 20;

    // Theme
    const themeList = getThemeList();
    const currentThemeId = getSettings().themeId || "skyfall";
    const currentThemeName = themeList.find((t) => t.id === currentThemeId)?.name ?? "Skyfall";
    this.createText(200, y, "Theme", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const themeVal = this.createText(430, y, currentThemeName, {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    themeVal.setInteractive({ useHandCursor: true });
    themeVal.on("pointerdown", () => {
      const idx = themeList.findIndex((t) => t.id === (getSettings().themeId || "skyfall"));
      const next = themeList[(idx + 1) % themeList.length];
      setSettings({ themeId: next.id });
      this.scene.restart({ returnTo: this.returnTo, returnData: this.returnData });
    });
    y += 55;

    // Color blind palette
    this.createText(200, y, "Color blind palette", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const paletteModes = ["off", "protanopia", "deuteranopia", "tritanopia"];
    const paletteVal = this.createText(430, y, (getSettings().colorBlindPaletteMode || "off"), {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    paletteVal.setInteractive({ useHandCursor: true });
    paletteVal.on("pointerdown", () => {
      const current = getSettings().colorBlindPaletteMode || "off";
      const idx = paletteModes.indexOf(current);
      const next = paletteModes[(idx + 1) % paletteModes.length];
      setSettings({ colorBlindPaletteMode: next });
      paletteVal.setText(next);
    });
    y += 28;
    this.createText(200, y, "Warm/cool hazard tint remap — helps distinguish threats, not a full palette swap.", {
      ...BODY_STYLE,
      font: "700 13px Arial",
      fill: colors.semantic.text.muted,
      align: "left",
      wordWrap: { width: GAME_WIDTH - 240 }
    });
    y += 40;

    // Canvas size follows layout tokens; resolution setting is stored for a future display pass.
    this.createText(200, y, "Display size", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    this.createText(
      200,
      y + 30,
      `Fixed layout in this build. Saved target ${settings.resolutionOrQuality || "1280x720"} (not applied yet).`,
      {
        ...BODY_STYLE,
        font: "700 15px Arial",
        fill: colors.semantic.text.muted,
        align: "left",
        wordWrap: { width: GAME_WIDTH - 240 }
      }
    );
    y += 72;

    // Achievements (link to achievements scene)
    const achievementsLabel = this.createText(200, y, "Achievements", {
      ...BODY_STYLE,
      font: "700 24px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    achievementsLabel.setInteractive({ useHandCursor: true });
    achievementsLabel.on("pointerdown", () => {
      this.scene.start(SCENE_KEYS.achievements, {
        returnTo: SCENE_KEYS.options,
        returnData: { returnTo: this.returnTo, returnData: this.returnData }
      });
    });
    y += 46;

    const aboutLabel = this.createText(200, y, "About", {
      ...BODY_STYLE,
      font: "700 24px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    aboutLabel.setInteractive({ useHandCursor: true });
    aboutLabel.on("pointerdown", () => {
      this.scene.start(SCENE_KEYS.about, {
        returnTo: SCENE_KEYS.options,
        returnData: { returnTo: this.returnTo, returnData: this.returnData }
      });
    });
    y += 48;

    this.createText(200, y, "Anonymous analytics upload", {
      ...BODY_STYLE,
      font: "700 22px Arial",
      align: "left"
    });
    const analyticsVal = this.createText(520, y, getSettings().allowAnonymousAnalytics ? "On" : "Off", {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.accent,
      align: "left"
    });
    const analyticsToggle = this.createText(340, y, "Toggle", {
      ...BODY_STYLE,
      font: "700 20px Arial",
      fill: colors.semantic.text.warm,
      align: "left"
    });
    analyticsToggle.setInteractive({ useHandCursor: true });
    analyticsToggle.on("pointerdown", () => {
      const next = !getSettings().allowAnonymousAnalytics;
      setSettings({ allowAnonymousAnalytics: next });
      analyticsVal.setText(next ? "On" : "Off");
    });
    y += 44;

    const privacyUrl = EXTERNAL_LINKS.privacy;
    const privacyLine = privacyUrl?.startsWith("http")
      ? "Privacy policy: tap to open (browser)"
      : "Privacy policy: configure app/config/externalLinks.js before ship. Full text in About.";
    const privacyText = this.createText(GAME_CENTER_X, y, privacyLine, {
      ...BODY_STYLE,
      font: "700 15px Arial",
      fill: colors.semantic.text.muted,
      align: "center",
      wordWrap: { width: GAME_WIDTH - 200 }
    });
    privacyText.setOrigin(0.5, 0);
    if (privacyUrl?.startsWith("http")) {
      privacyText.setInteractive({ useHandCursor: true });
      privacyText.on("pointerdown", () => openExternalLink(privacyUrl));
    }
    y += privacyText.height + 28;

    // Version
    this.createText(GAME_CENTER_X, y, `Skyfall v${GAME_VERSION}`, {
      font: "700 18px Arial",
      fill: colors.semantic.text.muted,
      align: "center"
    }).setOrigin(0.5, 0.5);
    y += 50;

    // Back
    const back = this.createText(GAME_CENTER_X, Math.min(y, GAME_HEIGHT - 80), "Back", {
      ...BODY_STYLE,
      font: "700 28px Arial",
      fill: colors.semantic.text.warm
    });
    back.setOrigin(0.5, 0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setScale(1.08));
    back.on("pointerout", () => back.setScale(1));
    back.on("pointerdown", () => {
      if (this.returnTo === SCENE_KEYS.game && this.returnData) {
        this.scene.start(SCENE_KEYS.game, this.returnData);
      } else {
        this.scene.start(this.returnTo);
      }
    });
  }
}

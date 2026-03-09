import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { BODY_STYLE, PANEL_TITLE_STYLE } from "../config/sceneStyles";
import { getSettings, setSettings } from "../save/saveManager";
import { GAME_VERSION } from "../config/version";
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

    let y = 80;
    this.createText(GAME_CENTER_X, y, "Options", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 70;

    // Music volume
    this.createText(200, y, "Music volume", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const musicVal = this.createText(520, y, `${Math.round((getSettings().musicVolume || 1) * 100)}%`, {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: "#d7f9ff",
      align: "left"
    });
    const musicDown = this.createText(340, y, " − ", { ...BODY_STYLE, font: "700 24px Arial", fill: "#9ae6ff" }).setInteractive({ useHandCursor: true });
    const musicUp = this.createText(420, y, " + ", { ...BODY_STYLE, font: "700 24px Arial", fill: "#9ae6ff" }).setInteractive({ useHandCursor: true });
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
      fill: "#d7f9ff",
      align: "left"
    });
    const sfxDown = this.createText(340, y, " − ", { ...BODY_STYLE, font: "700 24px Arial", fill: "#9ae6ff" }).setInteractive({ useHandCursor: true });
    const sfxUp = this.createText(420, y, " + ", { ...BODY_STYLE, font: "700 24px Arial", fill: "#9ae6ff" }).setInteractive({ useHandCursor: true });
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

    // Fullscreen toggle (text button)
    const fsLabel = this.createText(200, y, settings.fullscreen ? "Fullscreen: On" : "Fullscreen: Off", {
      ...BODY_STYLE,
      font: "700 24px Arial",
      fill: "#9ae6ff",
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

    // Resolution / quality (dropdown as text buttons)
    this.createText(200, y, "Resolution", { ...BODY_STYLE, font: "700 24px Arial", align: "left" });
    const resOptions = ["1280x720", "1920x1080"];
    const resLabel = this.createText(340, y, settings.resolutionOrQuality || "1280x720", {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: "#9ae6ff",
      align: "left"
    });
    resLabel.setInteractive({ useHandCursor: true });
    resLabel.on("pointerdown", () => {
      const idx = resOptions.indexOf(settings.resolutionOrQuality);
      const next = resOptions[(idx + 1) % resOptions.length];
      setSettings({ resolutionOrQuality: next });
      resLabel.setText(next);
    });
    y += 60;

    // Keybinds list
    this.createText(GAME_CENTER_X, y, "Controls", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 40;
    const keybinds = [
      "WASD / Arrows – Move",
      "1 / 2 / 3 – Challenge options",
      "Escape – Pause"
    ];
    keybinds.forEach((line) => {
      this.createText(200, y, line, { ...BODY_STYLE, font: "700 20px Arial", align: "left", fill: "#d7f9ff" });
      y += 32;
    });
    y += 20;

    // Version
    this.createText(GAME_CENTER_X, y, `Skyfall v${GAME_VERSION}`, {
      font: "700 18px Arial",
      fill: "#6a8a9a",
      align: "center"
    }).setOrigin(0.5, 0.5);
    y += 50;

    // Back
    const back = this.createText(GAME_CENTER_X, Math.min(y, GAME_HEIGHT - 80), "Back", {
      ...BODY_STYLE,
      font: "700 28px Arial",
      fill: "#ffb380"
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

import { GAME_CENTER_X, GAME_HEIGHT, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { BODY_STYLE, PANEL_TITLE_STYLE } from "../config/sceneStyles";
const { colors } = theme;
import { GAME_VERSION } from "../config/version";
import BaseScene from "./baseScene";

export default class CreditsScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.credits);
  }

  create() {
    super.createSceneShell(120, "flex", false);
    this.input.keyboard.resetKeys();

    let y = 60;
    this.createText(GAME_CENTER_X, y, "Skyfall", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 50;
    this.createText(GAME_CENTER_X, y, `Version ${GAME_VERSION}`, {
      font: "700 22px Arial",
      fill: colors.semantic.text.accent,
      align: "center"
    }).setOrigin(0.5, 0.5);
    y += 50;

    this.createText(GAME_CENTER_X, y, "Credits", PANEL_TITLE_STYLE, 0.5, 0.5);
    y += 45;
    const lines = [
      "Game design & development",
      "Powered by Phaser 3",
      "Built with Vite"
    ];
    lines.forEach((line) => {
      this.createText(GAME_CENTER_X, y, line, { ...BODY_STYLE, font: "700 24px Arial" });
      y += 36;
    });
    y += 20;

    this.createText(GAME_CENTER_X, y, "Third-party software", {
      ...PANEL_TITLE_STYLE,
      font: "700 20px Arial"
    }).setOrigin(0.5, 0.5);
    y += 32;

    const legalWidth = 1000;
    const legalStyle = {
      ...BODY_STYLE,
      font: "700 15px Arial",
      fill: colors.semantic.text.muted,
      align: "center",
      wordWrap: { width: legalWidth }
    };
    const thirdParty =
      "Phaser 3 (MIT) — phaser.io / Phaser Studio Inc. · " +
      "phaser3-juice-plugin (MIT, Conor Irwin; GitHub RetroVX, pin in package.json) · " +
      "Vite (MIT) — vitejs.dev · UI: system Arial/sans stack (no bundled webfonts). " +
      "Privacy: link from About/Options when live (tasks/AGENT-37).";
    const legal = this.createText(GAME_CENTER_X, y, thirdParty, legalStyle, 0.5, 0);
    y += legal.height + 20;

    this.createText(GAME_CENTER_X, y, "Thank you for playing.", {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: colors.semantic.text.status
    });
    y += 80;

    const back = this.createText(GAME_CENTER_X, Math.min(y, GAME_HEIGHT - 80), "Back to menu", {
      ...BODY_STYLE,
      font: "700 28px Arial",
      fill: colors.semantic.text.warm
    });
    back.setOrigin(0.5, 0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setScale(1.08));
    back.on("pointerout", () => back.setScale(1));
    back.on("pointerdown", () => this.scene.start(SCENE_KEYS.mainMenu));
  }
}

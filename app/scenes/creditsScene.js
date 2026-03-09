import { GAME_CENTER_X, GAME_HEIGHT } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { BODY_STYLE, PANEL_TITLE_STYLE } from "../config/sceneStyles";
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
      fill: "#9ae6ff",
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
    y += 30;

    this.createText(GAME_CENTER_X, y, "Thank you for playing.", {
      ...BODY_STYLE,
      font: "700 22px Arial",
      fill: "#d7f9ff"
    });
    y += 80;

    const back = this.createText(GAME_CENTER_X, Math.min(y, GAME_HEIGHT - 80), "Back to menu", {
      ...BODY_STYLE,
      font: "700 28px Arial",
      fill: "#ffb380"
    });
    back.setOrigin(0.5, 0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerover", () => back.setScale(1.08));
    back.on("pointerout", () => back.setScale(1));
    back.on("pointerdown", () => this.scene.start(SCENE_KEYS.mainMenu));
  }
}

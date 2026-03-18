import Phaser from "phaser";
import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";

/**
 * Editor view at #/editor. Minimal placeholder so the route works;
 * extend with editor UI as needed.
 */
export default class EditorScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.editor);
  }

  create() {
    this.add
      .text(GAME_CENTER_X, GAME_HEIGHT / 2 - 40, "Editor", {
        font: "700 48px Arial",
        fill: theme.colors.semantic.text.phase,
        align: "center"
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(GAME_CENTER_X, GAME_HEIGHT / 2 + 20, "Skyfall editor", {
        font: "700 22px Arial",
        fill: theme.colors.semantic.text.muted,
        align: "center"
      })
      .setOrigin(0.5, 0.5);

    const back = this.add
      .text(GAME_WIDTH - 24, 24, "Back", {
        font: "700 20px Arial",
        fill: theme.colors.semantic.text.accent
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => {
      window.location.hash = "";
      this.scene.start(SCENE_KEYS.mainMenu);
    });
  }
}

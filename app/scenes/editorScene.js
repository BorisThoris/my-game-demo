import Phaser from "phaser";
import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";

/**
 * Dev-only editor stub at #/editor (see docs/EDITOR.md — Path B deferred).
 */
export default class EditorScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.editor);
  }

  create() {
    this.add
      .text(GAME_CENTER_X, GAME_HEIGHT / 2 - 80, "Editor (deferred)", {
        font: "700 40px Arial",
        fill: theme.colors.semantic.text.phase,
        align: "center"
      })
      .setOrigin(0.5, 0.5);

    const blurb =
      "No production editor MVP yet.\nSee docs/EDITOR.md and tasks/AGENT-39-editor-mvp-or-defer.md";
    this.add
      .text(GAME_CENTER_X, GAME_HEIGHT / 2 - 10, blurb, {
        font: "700 18px Arial",
        fill: theme.colors.semantic.text.muted,
        align: "center",
        wordWrap: { width: GAME_WIDTH - 120 }
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

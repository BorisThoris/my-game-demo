import Phaser from "phaser";
import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH, theme } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";

const { colors, zIndex } = theme;

const BAR_WIDTH = 400;
const BAR_HEIGHT = 24;
const LOAD_DURATION_MS = 1400;

/**
 * First scene: shows loading state then starts main menu.
 * Progress bar and loaderror handling are in preload/create.
 */
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.loading);
    this.loadError = false;
    this.progress = 0;
  }

  preload() {
    this.load.on("progress", (p) => {
      this.progress = p;
    });
    this.load.on("loaderror", () => {
      this.loadError = true;
    });
    // No assets loaded here; DodgeGame loads its own. We show a bar that fills then go to menu.
  }

  create() {
    if (this.loadError) {
      const msg = this.add.text(GAME_CENTER_X, GAME_HEIGHT / 2 - 40, "Something went wrong loading the game.", {
        font: "700 28px Arial",
        fill: colors.semantic.stroke.gameOver,
        align: "center"
      });
      msg.setOrigin(0.5, 0.5);
      const retry = this.add.text(GAME_CENTER_X, GAME_HEIGHT / 2 + 20, "Retry", {
        font: "700 24px Arial",
        fill: colors.semantic.text.accent
      });
      retry.setOrigin(0.5, 0.5);
      retry.setPadding(28, 14);
      retry.setInteractive({ useHandCursor: true });
      retry.on("pointerdown", () => this.scene.restart());
      return;
    }

    this.add.text(GAME_CENTER_X, GAME_HEIGHT / 2 - 80, "Skyfall", {
      font: "700 56px Arial",
      fill: colors.semantic.text.score,
      align: "center"
    }).setOrigin(0.5, 0.5);

    const barX = GAME_CENTER_X - BAR_WIDTH / 2;
    const barY = GAME_HEIGHT / 2 + 20;
    this.add.text(GAME_CENTER_X, barY - 28, "Loading...", {
      font: "700 22px Arial",
      fill: colors.semantic.text.score,
      align: "center"
    }).setOrigin(0.5, 0.5);

    const track = this.add.graphics();
    track.fillStyle(colors.semantic.game.loadingTrack, 0.9);
    track.fillRoundedRect(barX, barY, BAR_WIDTH, BAR_HEIGHT, 6);
    track.setDepth(zIndex.background + 1);
    const fill = this.add.graphics();
    fill.fillStyle(colors.semantic.game.loadingFill, 1);
    fill.fillRoundedRect(barX + 2, barY + 2, 0, BAR_HEIGHT - 4, 4);
    fill.setDepth(zIndex.background + 2);

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: LOAD_DURATION_MS,
      ease: "Power2.InOut",
      onUpdate: (tween) => {
        const v = tween.getValue();
        fill.clear();
        fill.fillStyle(colors.semantic.game.loadingFill, 1);
        fill.fillRoundedRect(barX + 2, barY + 2, (BAR_WIDTH - 4) * v, BAR_HEIGHT - 4, 4);
      },
      onComplete: () => {
        const goToEditor = typeof window !== "undefined" && window.location.hash === "#/editor";
        this.scene.start(goToEditor ? SCENE_KEYS.editor : SCENE_KEYS.mainMenu);
      }
    });
  }
}

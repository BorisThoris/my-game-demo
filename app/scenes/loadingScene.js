import Phaser from "phaser";
import { GAME_CENTER_X, GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";

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
        fill: "#ff8072",
        align: "center"
      });
      msg.setOrigin(0.5, 0.5);
      const retry = this.add.text(GAME_CENTER_X, GAME_HEIGHT / 2 + 20, "Retry", {
        font: "700 24px Arial",
        fill: "#9ae6ff"
      });
      retry.setOrigin(0.5, 0.5);
      retry.setInteractive({ useHandCursor: true });
      retry.on("pointerdown", () => this.scene.restart());
      return;
    }

    this.add.text(GAME_CENTER_X, GAME_HEIGHT / 2 - 80, "Skyfall", {
      font: "700 56px Arial",
      fill: "#fff3b0",
      align: "center"
    }).setOrigin(0.5, 0.5);

    const barX = GAME_CENTER_X - BAR_WIDTH / 2;
    const barY = GAME_HEIGHT / 2 + 20;
    const track = this.add.graphics();
    track.fillStyle(0x0d1823, 0.9);
    track.fillRoundedRect(barX, barY, BAR_WIDTH, BAR_HEIGHT, 6);
    track.setDepth(1);
    const fill = this.add.graphics();
    fill.fillStyle(0x55d6ff, 1);
    fill.fillRoundedRect(barX + 2, barY + 2, 0, BAR_HEIGHT - 4, 4);
    fill.setDepth(2);

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: LOAD_DURATION_MS,
      ease: "Power2.InOut",
      onUpdate: (tween) => {
        const v = tween.getValue();
        fill.clear();
        fill.fillStyle(0x55d6ff, 1);
        fill.fillRoundedRect(barX + 2, barY + 2, (BAR_WIDTH - 4) * v, BAR_HEIGHT - 4, 4);
      },
      onComplete: () => {
        this.scene.start(SCENE_KEYS.mainMenu);
      }
    });
  }
}

import { GAME_CENTER_X, GAME_HEIGHT } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { EXIT_UNLOCK_SCORE } from "../game/runnerContent";
import {
  BODY_STYLE,
  HINT_STYLE,
  TITLE_STYLE
} from "../config/sceneStyles";
import BaseScene from "./baseScene";

export default class BeginningScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.beginning);
    this.hasStarted = false;
  }

  create() {
    super.createSceneShell(220, "flex", false);
    this.input.keyboard.resetKeys();
    this.hasStarted = false;

    const layout = {
      titleY: 100,
      subtitleY: 200,
      bodyY: 300,
      hintY: GAME_HEIGHT - 120
    };

    this.createText(GAME_CENTER_X, layout.titleY, "Skyfall", TITLE_STYLE, 0.5, 0.5);
    this.createText(
      GAME_CENTER_X,
      layout.subtitleY,
      "A procedural endless dodger with easy phases, heat phases, and falling miniboss patterns.",
      {
        ...BODY_STYLE,
        font: "700 28px Arial",
        wordWrap: { width: 960 }
      },
      0.5,
      0.5
    );
    this.createText(
      GAME_CENTER_X,
      layout.bodyY,
      `Arrows or WASD: Move freely\nDodge the falling shapes from above\nReach score ${EXIT_UNLOCK_SCORE} and touch the right edge to continue`,
      {
        ...BODY_STYLE,
        font: "700 26px Arial"
      },
      0.5,
      0.5
    );

    const startPrompt = this.createText(
      GAME_CENTER_X,
      layout.hintY,
      "Press to start",
      { ...HINT_STYLE, fontSize: "32px" },
      0.5,
      0.5
    );
    startPrompt.setInteractive({ useHandCursor: true });
    startPrompt.on("pointerover", () => {
      startPrompt.setScale(1.08);
      startPrompt.setAlpha(1);
    });
    startPrompt.on("pointerout", () => {
      startPrompt.setScale(1);
    });

    this.tweens.add({
      targets: startPrompt,
      alpha: 0.4,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    const startGame = () => {
      if (this.hasStarted) {
        return;
      }

      this.hasStarted = true;
      this.scene.start(SCENE_KEYS.game);
    };

    this.input.keyboard.once("keydown-SPACE", startGame);
    this.input.keyboard.once("keydown-ENTER", startGame);
    this.input.keyboard.once("keydown-UP", startGame);
    this.input.once("pointerdown", startGame);
    startPrompt.on("pointerdown", startGame);
  }
}

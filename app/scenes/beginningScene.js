import { GAME_CENTER_X } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
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
    super.createSceneShell(220, "flex");
    this.input.keyboard.resetKeys();
    this.hasStarted = false;

    this.createText(GAME_CENTER_X, 130, "Interval Dodger", TITLE_STYLE, 0.5, 0.5);
    this.createText(
      GAME_CENTER_X,
      230,
      "A procedural endless dodger with easy phases, heat phases, and falling miniboss patterns.",
      {
        ...BODY_STYLE,
        font: "700 30px Arial",
        wordWrap: { width: 960 }
      },
      0.5,
      0.5
    );
    this.createText(
      GAME_CENTER_X,
      330,
      "Arrows or WASD: Move freely\nDodge the falling shapes from above\nSurvive to 35 score, then touch the right edge to continue",
      {
        ...BODY_STYLE,
        font: "700 30px Arial"
      },
      0.5,
      0.5
    );

    const startPrompt = this.createText(
      GAME_CENTER_X,
      560,
      "Press SPACE, ENTER, UP or click to start",
      HINT_STYLE,
      0.5,
      0.5
    );

    this.tweens.add({
      targets: startPrompt,
      alpha: 0.25,
      duration: 850,
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
  }
}

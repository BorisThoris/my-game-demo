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
    this.hasStarted = false;

    this.createText(GAME_CENTER_X, 130, "Dodge Game", TITLE_STYLE, 0.5, 0.5);
    this.createText(
      GAME_CENTER_X,
      230,
      "Survive the falling spikes and push for a higher score.",
      BODY_STYLE,
      0.5,
      0.5
    );
    this.createText(
      GAME_CENTER_X,
      330,
      "Left / Right: Move\nUp: Jump\nDown: Crouch\nReach the right edge to continue",
      BODY_STYLE,
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

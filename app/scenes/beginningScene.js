import BaseScene from "./baseScene";

export default class BeginningScene extends BaseScene {
  constructor() {
    super("beginningScene");
    this.hasStarted = false;
  }

  preload() {
    super.preload();
  }

  create() {
    super.createSceneShell(220, "flex");

    const titleStyle = {
      font: "700 72px Arial",
      fill: "#fff3b0",
      align: "center"
    };
    const bodyStyle = {
      font: "700 34px Arial",
      fill: "#ffffff",
      align: "center"
    };
    const hintStyle = {
      font: "700 28px Arial",
      fill: "#9ae6ff",
      align: "center"
    };

    this.createText(640, 130, "Dodge Game", titleStyle, 0.5, 0.5);
    this.createText(
      640,
      230,
      "Survive the falling spikes and push for a higher score.",
      bodyStyle,
      0.5,
      0.5
    );
    this.createText(
      640,
      330,
      "Left / Right: Move\nUp: Jump\nDown: Crouch\nReach the right edge to continue",
      bodyStyle,
      0.5,
      0.5
    );

    const startPrompt = this.createText(
      640,
      560,
      "Press SPACE, ENTER, UP or click to start",
      hintStyle,
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
      this.scene.start("gameScene");
    };

    this.input.keyboard.once("keydown-SPACE", startGame);
    this.input.keyboard.once("keydown-ENTER", startGame);
    this.input.keyboard.once("keydown-UP", startGame);
    this.input.once("pointerdown", startGame);
  }
}

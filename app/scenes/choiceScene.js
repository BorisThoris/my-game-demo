import BaseScene from "./baseScene";

export default class ChoiceScene extends BaseScene {
  constructor() {
    super("choiceScene");
    this.controlsEnabled = false;
  }

  preload() {
    super.preload();
  }

  create() {
    super.createSceneShell(600, "flex");

    const titleStyle = {
      font: "700 40px Arial",
      fill: "#fff",
      align: "center"
    };

    this.arrowLeft = this.add.sprite(100, 380, "arrow").setScale(0.25);
    this.arrowLeft.scaleX = -0.25;
    this.arrowRight = this.add.sprite(1160, 380, "arrow").setScale(0.25);
    this.arrowDown = this.add.sprite(640, 580, "arrow").setScale(0.25);
    this.arrowDown.angle -= 270;

    this.createText(380, 60, "Welcome To The Midpoint", titleStyle);
    this.createText(0, 250, "Go Back To Info", titleStyle);
    this.createText(980, 250, "View Websites", titleStyle);
    this.createText(500, 450, "Play My Game", titleStyle);

    [
      this.arrowLeft,
      this.arrowRight,
      this.arrowDown
    ].forEach(element => {
      element.alpha = 0;
    });

    this.tweens.timeline({
      ease: "Power2",
      tweens: [
        {
          targets: this.children.list,
          duration: 1500,
          alpha: 1,
          onComplete: () => {
            this.controlsEnabled = true;
          }
        },
        {
          targets: [this.arrowLeft, this.arrowRight, this.arrowDown],
          duration: 3000,
          alpha: 0.2,
          repeat: -1,
          yoyo: true
        }
      ]
    });
  }

  update() {
    if (this.player.body.blocked.left) {
      this.scene.start("introScene");
    }

    if (this.controlsEnabled && this.cursors.down.isDown) {
      this.scene.start("gameScene");
    }

    if (this.controlsEnabled && this.player.body.blocked.right) {
      this.scene.start("websitesScene");
    }

    this.playerMovement.update(this.cursors);
  }
}

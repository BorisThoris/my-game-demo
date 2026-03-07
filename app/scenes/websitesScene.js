import BaseScene from "./baseScene";

export default class WebsitesScene extends BaseScene {
  constructor() {
    super("websitesScene");
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

    this.createText(440, 60, "Choose a Website", titleStyle);
    this.createText(20, 250, "Go Back", titleStyle);
    this.createText(980, 250, "View Cat World", titleStyle);
    this.createText(460, 450, "View Gorilla Gainz", titleStyle);

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
          alpha: 1
        },
        {
          targets: [this.arrowLeft, this.arrowRight, this.arrowDown],
          duration: 3000,
          alpha: 0.2,
          repeat: -1,
          yoyo: true,
          onStart: () => {
            this.controlsEnabled = true;
          }
        }
      ]
    });
  }

  openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    this.playerMovement.stopPlayer();
  }

  update() {
    if (this.player.body.blocked.left) {
      this.scene.start("choiceScene");
    }

    if (this.controlsEnabled && this.player.body.blocked.right) {
      this.openExternal(
        "https://boristhoris.github.io/My-website-demo-Angular/viewAll"
      );
      this.player.x = 500;
    }

    if (this.controlsEnabled && this.cursors.down.isDown && this.player.body.touching.down) {
      this.openExternal("https://boristhoris.github.io/My-website-demo-React/");
    }

    this.playerMovement.update(this.cursors);
  }
}

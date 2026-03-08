import BaseScene from "./baseScene";

export default class NavigationScene extends BaseScene {
  constructor(key) {
    super(key);
    this.controlsEnabled = false;
    this.navigationIndicators = [];
  }

  resetNavigationState() {
    this.controlsEnabled = false;
    this.navigationIndicators = [];
  }

  createArrow(x, y, angle = 0, flipX = false) {
    const arrow = this.add.sprite(x, y, "arrow").setScale(0.25);
    arrow.angle = angle;

    if (flipX) {
      arrow.scaleX = -0.25;
    }

    arrow.alpha = 0;
    this.navigationIndicators.push(arrow);
    return arrow;
  }

  fadeInScene(onReady) {
    this.tweens.timeline({
      ease: "Power2",
      tweens: [
        {
          targets: this.children.list,
          duration: 1500,
          alpha: 1,
          onComplete: () => {
            this.controlsEnabled = true;

            if (onReady) {
              onReady();
            }
          }
        },
        {
          targets: this.navigationIndicators,
          duration: 3000,
          alpha: 0.2,
          repeat: -1,
          yoyo: true
        }
      ]
    });
  }

  updatePlayerMovement() {
    this.playerMovement.update(this.cursors);
  }
}

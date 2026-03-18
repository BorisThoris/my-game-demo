import { INTRO_PLAYER_X } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import {
  INFO_BODY_STYLE,
  INFO_HEADING_STYLE
} from "../config/sceneStyles";
import { theme } from "../config/gameConfig";
import BaseScene from "./baseScene";

export default class IntroductionScene extends BaseScene {
  constructor() {
    super(SCENE_KEYS.intro);
    this.isStarted = false;
  }

  create() {
    super.createSceneShell(INTRO_PLAYER_X, "flex", false);
    this.isStarted = false;

    this.helloText = this.createText(60, 100, "My name is Boris.", INFO_HEADING_STYLE);
    this.andText = this.createText(
      60,
      140,
      "I'm a 21 y.o. Junior Software Engineer",
      INFO_HEADING_STYLE
    );
    this.scoreText = this.createText(
      60,
      180,
      "who grew up in the center of the capital of Bulgaria,",
      INFO_HEADING_STYLE
    );
    this.myCv = this.createText(
      60,
      220,
      'and was part of a "natural-mathematical class"\nin Sofia\'s 127th School, " Ivan N. Denkoglu" ',
      INFO_HEADING_STYLE
    );
    this.info = this.createText(
      100,
      40,
      "While in school, I took extensive lessons in Advanced Mathematics,\nScored 109/120 on the TOEFL, which correlates to a C2 level in English,\nand 1280/1600 on the American RSAT,\nwhich put me in the top 10% of students in America,\nand got me a scholarship proposal in Minnesota.\nI also got accepted in TU Sofia, and Sofia University\nbut ultimately I decided that I want to study in SoftUni.....",
      INFO_BODY_STYLE
    );
    this.info2 = this.createText(
      100,
      40,
      "I am currently working as a Full-Stack Junior Web Developer\nfor A1 Bulgaria.\nI am skilled at JavaScript and have experience working\nwith Angular 2, React.js, C# Asp.net, and MySql.\nI am also good at writing HTML and CSS,\nand I have knowledge of Hibernate, GSAP, PIXI,\nNode.js and Phaser 3.",
      INFO_BODY_STYLE
    );
    this.arrow = this.add.image(1100, 380, "arrow").setScale(0.25);

    this.continueBtn = this.add.text(1100, 380, "Continue", {
      fontSize: "24px",
      fill: theme.colors.semantic.text.accent,
      fontStyle: "bold"
    });
    this.continueBtn.setOrigin(0.5, 0.5);
    this.continueBtn.setVisible(false);
    this.continueBtn.setPadding(28, 14);
    this.continueBtn.setInteractive({ useHandCursor: true });
    this.continueBtn.on("pointerdown", () => {
      if (this.isStarted) {
        this.scene.start(SCENE_KEYS.choice);
      }
    });

    [
      this.helloText,
      this.andText,
      this.scoreText,
      this.myCv,
      this.info,
      this.info2,
      this.arrow
    ].forEach(element => {
      element.alpha = 0;
    });

    this.tweens.timeline({
      ease: "Power2",
      tweens: [
        { targets: this.helloText, duration: 1500, alpha: 1 },
        { targets: this.andText, duration: 1500, alpha: 1 },
        { targets: this.scoreText, duration: 3000, alpha: 1 },
        { targets: this.myCv, duration: 3000, alpha: 1 },
        {
          targets: [this.helloText, this.andText, this.scoreText, this.myCv],
          delay: 4000,
          duration: 3000,
          alpha: 0
        },
        { targets: this.info, duration: 13000, alpha: 1, yoyo: true },
        {
          targets: this.info2,
          duration: 8000,
          alpha: 1,
          onComplete: () => {
            this.isStarted = true;
            this.continueBtn.setVisible(true);
            this.continueBtn.alpha = 0;
            this.tweens.add({ targets: this.continueBtn, duration: 400, alpha: 1 });
            this.arrow.setInteractive(
              new Phaser.Geom.Rectangle(-40, -40, 80, 80),
              Phaser.Geom.Rectangle.Contains
            );
            this.arrow.input.cursor = "pointer";
            this.arrow.on("pointerdown", () => this.scene.start(SCENE_KEYS.choice));
            this.tweens.add({
              targets: this.arrow,
              duration: 1650,
              alpha: 1,
              yoyo: true,
              repeat: -1
            });
          }
        }
      ]
    });
  }

  update() {
    if (this.player.body.blocked.right && this.isStarted) {
      this.scene.start(SCENE_KEYS.choice);
      return;
    }

    this.updatePlayerMovement();
  }
}

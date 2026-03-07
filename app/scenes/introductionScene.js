import BaseScene from "./baseScene";

export default class IntroductionScene extends BaseScene {
  constructor() {
    super("introScene");
    this.isStarted = false;
    this.timer = 0;
  }

  preload() {
    super.preload();
  }

  create() {
    super.createSceneShell(100, "flex");

    const headingStyle = {
      font: "700 40px Arial",
      fill: "#fff",
      align: "left"
    };
    const bodyStyle = {
      font: "700 36px Arial",
      fill: "#fff",
      align: "left"
    };

    this.helloText = this.createText(60, 100, "My name is Boris.", headingStyle);
    this.andText = this.createText(
      60,
      140,
      "I'm a 21 y.o. Junior Software Engineer",
      headingStyle
    );
    this.scoreText = this.createText(
      60,
      180,
      "who grew up in the center of the capital of Bulgaria,",
      headingStyle
    );
    this.myCv = this.createText(
      60,
      220,
      'and was part of a "natural-mathematical class"\nin Sofia\'s 127th School, " Ivan N. Denkoglu" ',
      headingStyle
    );
    this.info = this.createText(
      100,
      40,
      "While in school, I took extensive lessons in Advanced Mathematics,\nScored 109/120 on the TOEFL, which correlates to a C2 level in English,\nand 1280/1600 on the American RSAT,\nwhich put me in the top 10% of students in America,\nand got me a scholarship proposal in Minnesota.\nI also got accepted in TU Sofia, and Sofia University\nbut ultimately I decided that I want to study in SoftUni.....",
      bodyStyle
    );
    this.info2 = this.createText(
      100,
      40,
      "I am currently working as a Full-Stack Junior Web Developer\nfor A1 Bulgaria.\nI am skilled at JavaScript and have experience working\nwith Angular 2, React.js, C# Asp.net, and MySql.\nI am also good at writing HTML and CSS,\nand I have knowledge of Hibernate, GSAP, PIXI,\nNode.js and Phaser 3.",
      bodyStyle
    );
    this.arrow = this.add.image(1100, 380, "arrow").setScale(0.25);

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
      this.scene.start("choiceScene");
    }

    this.timer += 1;
    this.playerMovement.update(this.cursors);
  }
}

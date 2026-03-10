import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/gameConfig";
import { SCENE_KEYS } from "../config/sceneKeys";
import { getMetaState, META_UNLOCK_NODES, purchaseUnlock } from "../game/metaProgression";

export default class MetaScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.meta);
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x08131d, 1);
    this.add.text(40, 24, "Meta Progression", { font: "700 42px Arial", fill: "#ffffff" });

    this.currencyText = this.add.text(40, 82, "", { font: "700 24px Arial", fill: "#fff2b5" });
    this.messageText = this.add.text(40, 116, "Spend currency on permanent run-start bonuses.", {
      font: "700 18px Arial",
      fill: "#9bb5c9"
    });

    const entries = Object.values(META_UNLOCK_NODES);
    entries.forEach((node, idx) => {
      const y = 180 + idx * 105;
      const card = this.add.rectangle(60 + 520 / 2, y, 520, 88, 0x0d1823, 0.95).setOrigin(0.5);
      card.setStrokeStyle(2, 0x35506b, 1);

      const title = this.add.text(80, y - 30, `${node.label} (${node.cost})`, {
        font: "700 24px Arial",
        fill: "#d7f9ff"
      });
      const desc = this.add.text(80, y - 2, node.description, {
        font: "16px Arial",
        fill: "#7ea0bc"
      });
      const prereq = this.add.text(80, y + 18, node.prereqs.length ? `Requires: ${node.prereqs.join(", ")}` : "No prerequisite", {
        font: "15px Arial",
        fill: "#6f90a8"
      });

      const buy = this.add.text(500, y - 6, "Unlock", {
        font: "700 22px Arial",
        fill: "#c8d0d8"
      }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

      buy.on("pointerdown", () => {
        const result = purchaseUnlock(node.id);
        if (result.ok) {
          this.messageText.setText(`Unlocked ${node.label}.`);
        } else {
          this.messageText.setText(`Could not unlock ${node.label}: ${result.reason}.`);
        }
        this.renderState();
      });

      this._nodes = this._nodes || [];
      this._nodes.push({ node, card, title, desc, prereq, buy });
    });

    const back = this.add.text(40, GAME_HEIGHT - 42, "< Back", {
      font: "700 26px Arial",
      fill: "#c8d0d8"
    }).setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.scene.start(SCENE_KEYS.mainMenu));

    this.renderState();
  }

  renderState() {
    const state = getMetaState();
    this.currencyText.setText(`Meta currency: ${state.metaCurrency}`);
    const unlocked = new Set(state.unlockTree.unlockedNodes);

    this._nodes.forEach(({ node, card, title, prereq, buy }) => {
      const has = unlocked.has(node.id);
      const prereqMet = node.prereqs.every(reqId => unlocked.has(reqId));
      const canBuy = !has && prereqMet && state.metaCurrency >= node.cost;

      card.setStrokeStyle(2, has ? 0x8be9b1 : canBuy ? 0xffd166 : 0x35506b, 1);
      title.setFill(has ? "#8be9b1" : "#d7f9ff");
      prereq.setFill(prereqMet ? "#6f90a8" : "#ff9f9f");
      buy.setText(has ? "Unlocked" : "Unlock");
      buy.setFill(has ? "#8be9b1" : canBuy ? "#fff2b5" : "#8a9bab");
      if (has) {
        buy.disableInteractive();
      } else {
        buy.setInteractive({ useHandCursor: true });
      }
    });
  }
}

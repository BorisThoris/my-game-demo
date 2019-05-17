export default class playerMover {
  constructor(player) {
    this.crouched = false;
    this.player = player;
    //this.player vars
    this.playerHeight = 225;
    //Change walking speed
    this.walkSpeed = 500;
    this.croutchSpeed = this.walkSpeed - 100;
    this.cursors = null;
  }

  reset() {
    this.walkSpeed = 500;
    this.croutchSpeed = this.walkSpeed - 200;
  }

  updateSpeed(speed) {
    this.walkSpeed = speed;

    if (this.walkSpeed > 0) {
      this.croutchSpeed = this.walkSpeed - 200;
    } else {
      this.croutchSpeed = this.walkSpeed + 200;
    }
  }

  stopPlayer() {
    this.cursors.up.isDown = false;
    this.cursors.up.isUp = true;

    this.cursors.right.isDown = false;
    this.cursors.right.isUp = true;

    this.cursors.left.isDown = false;
    this.cursors.left.isUp = true;

    this.cursors.down.isDown = false;
    this.cursors.down.isUp = true;
  }

  playerMovment(cursors) {
    this.cursors = cursors;
    let touchingDown = this.player.body.touching.down;
    let cursorRight = this.cursors.right.isDown;
    let cursorLeft = this.cursors.left.isDown;
    let cursorDown = this.cursors.down.isDown;

    let noKeys =
      this.cursors.down.isUp &&
      this.cursors.up.isUp &&
      this.cursors.right.isUp &&
      this.cursors.left.isUp;

    let cursorUp = this.cursors.up.isDown;

    //Moving Left
    if (cursorLeft && !cursorDown) {
      this.movingLeftRightCrouch("left");
    }

    //Moving Right
    else if (cursorRight && !cursorDown) {
      this.movingLeftRightCrouch("right");
    }

    //Croutching
    else if (cursorDown && cursorRight) {
      this.movingLeftRightCrouch("crouchRight");
    } else if (cursorDown && cursorLeft) {
      this.movingLeftRightCrouch("crouchLeft");
    } else if (cursorDown) {
      if (touchingDown) {
        this.movingLeftRightCrouch("crouch");
      }
    }

    //Idle animation
    if (noKeys && touchingDown) {
      this.player.setVelocityX(0);

      if (this.player.body.touching.down && this.crouched === false) {
        this.player.anims.play("flex", true);
        this.player.setSize(100, this.playerHeight, true);
      }

      this.crouched = false;
    }

    //jumping
    if (cursorUp && touchingDown) {
      this.player.setVelocityY(-330);
      this.crouched = false;
    } else if (!touchingDown && this.crouched === false) {
      this.player.setSize(100, this.playerHeight, true);
      this.player.anims.play("jump", true);
    }
  }

  adjustCrouchingHitBox() {
    this.player.setSize(50, 140);
    this.player.setOffset(100, 100);
  }

  movingLeftRightCrouch(direction) {
    let touchingDown = this.player.body.touching.down;
    let player = this.player;

    switch (direction) {
      case "left":
        //Moving left
        player.setVelocityX(-this.walkSpeed);
        player.setSize(50, this.playerHeight, true);

        if (touchingDown) {
          player.anims.play("walkLeft", true);
        }

        break;

      case "right":
        player.setVelocityX(this.walkSpeed);
        player.setSize(50, this.playerHeight, true);

        if (touchingDown) {
          player.anims.play("walkRight", true);
        }

        break;

      case "crouchRight":
        this.crouched = true;
        player.setVelocityX(+this.croutchSpeed);

        if (touchingDown) {
          //changing this.player hitbox
          this.adjustCrouchingHitBox();

          if (touchingDown) {
            player.anims.play("crouch-walk-right", true);
          }
        }
        break;

      case "crouchLeft":
        this.crouched = true;
        if (this.croutchSpeed < 0) {
          player.setVelocityX(+Math.abs(this.croutchSpeed));
        } else {
          player.setVelocityX(-Math.abs(this.croutchSpeed));
        }

        if (touchingDown) {
          //changing this.player hitbox
          this.adjustCrouchingHitBox();

          if (touchingDown) {
            player.anims.play("crouch-walk-left", true);
          }
        }
        break;

      case "crouch":
        this.crouched = true;
        let y = player.y;

        player.setVelocityX(0);

        //playing animation
        player.anims.play("crouch-flex", true);

        //changing this.player hitbox
        this.adjustCrouchingHitBox();
        break;
    }
  }
}

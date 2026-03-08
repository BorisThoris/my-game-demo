const DEFAULT_WALK_SPEED = 500;
const STANDING_HITBOX = {
  width: 100,
  height: 225,
  offsetX: 78,
  offsetY: 31
};
const CROUCHING_HITBOX = {
  width: 50,
  height: 140,
  offsetX: 100,
  offsetY: 100
};

export default class PlayerMovement {
  constructor(player) {
    this.player = player;
    this.crouched = false;
    this.walkSpeed = DEFAULT_WALK_SPEED;
    this.crouchSpeed = this.walkSpeed - 200;
    this.applyStandingHitBox();
  }

  reset() {
    this.walkSpeed = DEFAULT_WALK_SPEED;
    this.crouchSpeed = this.walkSpeed - 200;
    this.crouched = false;
    this.player.setVelocity(0, 0);
    this.applyStandingHitBox();
  }

  updateSpeed(speed) {
    this.walkSpeed = speed;
    this.crouchSpeed =
      this.walkSpeed > 0 ? this.walkSpeed - 200 : this.walkSpeed + 200;
  }

  update(cursors) {
    const touchingDown = this.player.body.touching.down;
    const movingRight = cursors.right.isDown;
    const movingLeft = cursors.left.isDown;
    const crouching = cursors.down.isDown;
    const jumping = cursors.up.isDown;
    const isIdle =
      cursors.down.isUp &&
      cursors.up.isUp &&
      cursors.right.isUp &&
      cursors.left.isUp;

    if (movingLeft && !crouching) {
      this.move("left", touchingDown);
    } else if (movingRight && !crouching) {
      this.move("right", touchingDown);
    } else if (crouching && movingRight) {
      this.move("crouchRight", touchingDown);
    } else if (crouching && movingLeft) {
      this.move("crouchLeft", touchingDown);
    } else if (crouching && touchingDown) {
      this.move("crouch", touchingDown);
    }

    if (isIdle && touchingDown) {
      this.player.setVelocityX(0);

      if (!this.crouched) {
        this.applyStandingHitBox();
        this.player.anims.play("flex", true);
      }
    }

    if (jumping && touchingDown) {
      this.player.setVelocityY(-330);
      this.crouched = false;
    } else if (!touchingDown && !this.crouched) {
      this.applyStandingHitBox();
      this.player.anims.play("jump", true);
    }

    if (!crouching) {
      this.crouched = false;
    }
  }

  stopPlayer() {
    this.player.setVelocity(0, this.player.body.velocity.y);
  }

  applyStandingHitBox() {
    this.player.setSize(STANDING_HITBOX.width, STANDING_HITBOX.height);
    this.player.setOffset(STANDING_HITBOX.offsetX, STANDING_HITBOX.offsetY);
  }

  adjustCrouchingHitBox() {
    this.player.setSize(CROUCHING_HITBOX.width, CROUCHING_HITBOX.height);
    this.player.setOffset(CROUCHING_HITBOX.offsetX, CROUCHING_HITBOX.offsetY);
  }

  move(direction, touchingDown) {
    switch (direction) {
      case "left":
        this.player.setVelocityX(-this.walkSpeed);
        this.applyStandingHitBox();
        if (touchingDown) {
          this.player.anims.play("walkLeft", true);
        }
        break;
      case "right":
        this.player.setVelocityX(this.walkSpeed);
        this.applyStandingHitBox();
        if (touchingDown) {
          this.player.anims.play("walkRight", true);
        }
        break;
      case "crouchRight":
        this.crouched = true;
        this.player.setVelocityX(this.crouchSpeed);
        if (touchingDown) {
          this.adjustCrouchingHitBox();
          this.player.anims.play("crouch-walk-right", true);
        }
        break;
      case "crouchLeft":
        this.crouched = true;
        this.player.setVelocityX(-Math.abs(this.crouchSpeed));
        if (touchingDown) {
          this.adjustCrouchingHitBox();
          this.player.anims.play("crouch-walk-left", true);
        }
        break;
      case "crouch":
        this.crouched = true;
        this.player.setVelocityX(0);
        this.adjustCrouchingHitBox();
        this.player.anims.play("crouch-flex", true);
        break;
      default:
        break;
    }
  }
}

/**
 *
 *
 * @export
 * @class Player
 * @extends {Phaser.GameObjects.Sprite}
 */
export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y - 16, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.acceleration = 600;

    this.jumping = false;
    this.jumpTimer = 0;

  }

  update (keys, time, delta) {
    let input = {
      left: keys.left.isDown,
      right: keys.right.isDown,
      down: keys.down.isDown,
      jump: keys.jump.isDown,
    }

    this.jumpTimer -= delta;

    if (input.left) {
      if (this.body.velocity.y === 0) {
        this.run(-100);
      }
      this.flipX = true;
    } else if (input.right) {
      if (this.body.velocity.y === 0) {
        this.run(100);
      }
      this.flipX = false;
    } else {
      this.run(0);
    }

    if (input.jump && (!this.jumping || this.jumpTimer > 0)) {
      this.jump();
    } else if (!input.jump) {
        this.jumpTimer = -1; // Don't resume jump if button is released, prevents mini double-jumps
        if (this.body.blocked.down) {
            this.jumping = false;
        }
    }
  }

  run(vel) {
    this.body.setVelocityX(vel);
  }

  jump() {

    if (!this.body.blocked.down && !this.jumping) {
        return;
    }

    if (this.body.velocity.y < 0 || this.body.blocked.down) {
        this.body.setVelocityY(-200);
    }
    if (!this.jumping) {
        this.jumpTimer = 300;
    }
    this.jumping = true;

}

}

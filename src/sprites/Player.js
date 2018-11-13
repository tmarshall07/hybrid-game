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

    this.acceleration = 800;
    this.body.maxVelocity.x = 200;
    this.body.maxVelocity.y = 500;

    // this.body.width = 16;
    // this.body.height = 16;

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
        this.run(-this.acceleration);
      } else {
        // If in the air, "bend" in direction of input
        this.run(-this.acceleration / 3);
      }
      // Reverse animation
      this.flipX = true;
    } else if (input.right) {
      if (this.body.velocity.y === 0) {
        this.run(this.acceleration);
      } else {
        // If in the air, "bend" in direction of input
        this.run(this.acceleration / 3);
      }
      this.flipX = false;
      
      // Else if no inputs found
    } else if (this.body.blocked.down) {

      // Stop if less than 10
      if (Math.abs(this.body.velocity.x) < 10) {
        this.body.setVelocityX(0);
        this.run(0);
      } else {
        // Otherwise decelerate
        this.run(((this.body.velocity.x > 0) ? -1 : 1) * this.acceleration);
      }
    } else if (!this.body.blocked.down) {
      this.run(0);
    } 

    // Jump inputs
    if (input.jump && (!this.jumping || this.jumpTimer > 0)) {
      this.jump();
    } else if (!input.jump) {
        this.jumpTimer = -1; // Don't resume jump if button is released, prevents mini double-jumps
        
        // Not jumping if on the ground
        if (this.body.blocked.down) {
            this.jumping = false;
        }
    }

    if (this.y > 800) {
      // Die if you fall off map
      this.die();
    }
  }

  // Set as running, use acceleration with maxVelocity to
  // include a little slippage
  run(acceleration) {
    this.body.setAccelerationX(acceleration);
  }

  // Control jump behavior  
  jump() {
    // If not blocked our jumping
    if (!this.body.blocked.down && !this.jumping) {
        return;
    }

    if (this.body.velocity.y < 0 || this.body.blocked.down) {
        this.body.setVelocityY(-200);
    }
    if (!this.jumping) {
      // Jump timer is how long to apply the vertical velocity (i.e. without acceleration of gravity having an effect)
      this.jumpTimer = 50;
    }
    this.jumping = true;
  }

  die() {
    this.scene.scene.start('TitleScene');
  }

}

import Rope from '../sprites/Rope';

/**
 *
 *
 * @export
 * @class Player
 */
export default class Player {
  constructor(config) {
    this.scene = config.scene;
    console.log(config);

    this.sprite = this.scene.matter.add.sprite(config.x, config.y, config.key, 0);
    
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {
      chamfer: {
        radius: 10,
      },
    });

    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
    }

    const compoundBody = Body.create({
      parts: [ mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right ],
      frictionStatic: 0,
      // frictionAir: 0.2,
      friction: 0.1,
    });
    
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(config.x, config.y);
    // this.acceleration = 800;
    // this.body.maxVelocity.x = 200;
    // this.body.maxVelocity.y = 500;

    // this.body.width = 16;
    // this.body.height = 16;

    // this.jumping = false;
    // this.jumpTimer = 0;
    console.log(this);

    // this.rope = new Rope({
    //   scene: this.scene,
    //   x: this.x,
    //   y: this.y,
    //   key: 'rope',
    // });
  }

  // update (keys, time, delta) {
  //   let input = {
  //     left: keys.left.isDown,
  //     right: keys.right.isDown,
  //     down: keys.down.isDown,
  //     jump: keys.jump.isDown,
  //     rope: keys.rope.isDown,
  //   }

  //   this.jumpTimer -= delta;

  //   if (input.left) {
  //     if (this.body.velocity.y === 0) {
  //       this.run(-this.acceleration);
  //     } else {
  //       // If in the air, "bend" in direction of input
  //       this.run(-this.acceleration / 3);
  //     }
  //     // Reverse animation
  //     this.flipX = true;
  //   } else if (input.right) {
  //     if (this.body.velocity.y === 0) {
  //       this.run(this.acceleration);
  //     } else {
  //       // If in the air, "bend" in direction of input
  //       this.run(this.acceleration / 3);
  //     }
  //     this.flipX = false;
      
  //     // Else if no inputs found
  //   } else if (this.body.blocked.down) {

  //     // Stop if less than 10
  //     if (Math.abs(this.body.velocity.x) < 10) {
  //       this.body.setVelocityX(0);
  //       this.run(0);
  //     } else {
  //       // Otherwise decelerate
  //       this.run(((this.body.velocity.x > 0) ? -1 : 1) * this.acceleration);
  //     }
  //   } else if (!this.body.blocked.down) {
  //     this.run(0);
  //   } 

  //   // Jump inputs
  //   if (input.jump && (!this.jumping || this.jumpTimer > 0)) {
  //     this.jump();
  //   } else if (!input.jump) {
  //       this.jumpTimer = -1; // Don't resume jump if button is released, prevents mini double-jumps
        
  //       // Not jumping if on the ground
  //       if (this.body.blocked.down) {
  //           this.jumping = false;
  //       }
  //   }

  //   if (input.rope) {
  //     this.fireRope();
  //   }

  //   if (this.y > 800) {
  //     // Die if you fall off map
  //     this.die();
  //   }
  // }

  // // Set as running, use acceleration with maxVelocity to
  // // include a little slippage
  // run(acceleration) {
  //   this.body.setAccelerationX(acceleration);
  // }

  // // Control jump behavior  
  // jump() {
  //   // If not blocked our jumping
  //   if (!this.body.blocked.down && !this.jumping) {
  //       return;
  //   }

  //   if (this.body.velocity.y < 0 || this.body.blocked.down) {
  //       this.body.setVelocityY(-200);
  //   }
  //   if (!this.jumping) {
  //     // Jump timer is how long to apply the vertical velocity (i.e. without acceleration of gravity having an effect)
  //     this.jumpTimer = 50;
  //   }
  //   this.jumping = true;
  // }

  // die() {
  //   this.scene.scene.start('TitleScene');
  // }

  // fireRope() {
  //   console.log(this);

  //   this.rope.fire(this.body.x, this.body.y, this.flipX);
    
  //   console.log(this.rope)
  // }

}

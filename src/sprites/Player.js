import Rope from '../sprites/Rope';
import MultiKey from '../helpers/multiKey.js';

/**
 *
 *
 * @export
 * @class Player
 */
export default class Player {
  constructor(config) {
    this.scene = config.scene;
    const { scene, x, y, key } = config;

    // Create the sprite
    this.sprite = this.scene.matter.add.sprite(x, y, key, 0);
    
    // Add matter bodies, sensors, and sprite options
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {
      // chamfer: {
      //   radius: 10,
      // },
    });

    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
      right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
    }

    const compoundBody = Body.create({
      parts: [ mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right ],
      frictionStatic: 0,
      frictionAir: 0.001,
      friction: 0.05,
    });
    
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(config.x, config.y);

    // Set keys
    const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);

    // Track sensors that are touching something
    this.isTouching = { left: false, right: false, ground: false };

    // Jump cooldown
    this.canJump = true;
    this.jumpCooldownTimer = null;

    // Before matter's update, reset our record of what surfaces the player is touching.
    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    // If a sensor just started colliding with something, or it continues to collide with something,
    // call onSensorCollide
    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });

    // Destroy player on scene events
    this.scene.events.on("update", this.update, this);
    
    // Destroy player on shutdown or destroy
    this.destroyed = false;
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);

    console.log(this);
  }

  update () {
    if (this.destroyed) return;

    const sprite = this.sprite;
    const velocity = this.sprite.body.velocity;
    const rightKeyDown = this.rightInput.isDown();
    const leftKeyDown = this.leftInput.isDown();
    const jumpKeyDown = this.jumpInput.isDown();

    const isOnGround = this.isTouching.ground;
    const isInAir = !isOnGround;

    const moveForce = isOnGround ? 4 / 1000 : 5 / 10000;

    if (leftKeyDown) {
      sprite.setFlipX(true);

      if (!(isInAir && this.isTouching.left)) {
        sprite.applyForce({ x: -moveForce, y: 0});
      }
    } else if (rightKeyDown) {
      sprite.setFlipX(false);

      if (!(isInAir && this.isTouching.right)) {
        sprite.applyForce({ x: moveForce, y: 0 });
      }
    }

    // // Limit horizontal speed
    if (velocity.x > 7) sprite.setVelocityX(7);
    else if (velocity.x < -7) sprite.setVelocityX(-7);

    if (jumpKeyDown && this.canJump && isOnGround) {
      sprite.setVelocityY(-5);

      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => {
          this.canJump = true;
        },
      });
    }

    if (this.y > 800) {
      // Die if you fall off map
      this.die();
    }
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return; // We only care about collisions with physical objects
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }

  die() {
    this.scene.scene.start('TitleScene');
  }

  destroy() {
    this.destroyed = true;

    // Event listeners
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.events.off("destroy", this.destroy, this);
    if (this.scene.matter.world) {
      this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
    }

    // Matter collision plugin
    const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
    this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
    this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

    // Don't want any timers triggering post-mortem
    if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

    this.sprite.destroy();
  }

}

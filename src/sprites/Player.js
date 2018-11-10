/*
  Player class
*/

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y - 16, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
  }

  update () {

  }
}

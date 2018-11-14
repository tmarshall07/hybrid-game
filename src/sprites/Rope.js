export default class Rope extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);

    this.body.setSize(20, 20);
    // this.body.offset.set(12, 12);
  }

  fire(x, y, left) {
    this.setActive(true);
    this.setVisible(true);

    this.body.allowGravity = true;

    this.setPosition(x,y);
    this.body.velocity.y = -400;
    this.body.velocity.x = 400 * (left ? -1 : 1);
  }

  update (time, delta) {
    if(!this.active){
        return;
    }
    this.scene.physics.world.collide(this, this.scene.groundLayer, ()=> this.collided());   
  }

  collided() {
    if(this.body.velocity.y === 0){
      this.body.velocity.y=-150;
    }
    if(this.body.velocity.x === 0){
      this.explode();
    }
  }

  explode(){
    this.body.allowGravity = false;
    this.body.velocity.y = 0;
  }
}
export default class Rope {
  constructor (config) {
    const { player, key, scene } = config;
    
    this.scene = scene;

    let x = player.x;
    let y = player.y;

    // Increment category so the rope gets assigned a new category number
    this.collisionCategory = this.scene.matter.world.nextCategory();

    this.hook = scene.matter.add.sprite(x, y, 'glove', null, {
      shape: 'circle',
      mass: .1,
      ignoreGravity: false,
    })     
    // Set collision category for each element
    .setCollisionCategory(this.collisionCategory)
    // Make sure it only collides with the ground layer
    .setCollidesWith(scene.groundCollisionCategory);

    let previousLink;
    const jointLength = 2;
    const jointElasticity = .1;
    
    for (let i = 0; i < 5; i += 1) {
      const link = scene.matter.add.sprite(x, y, 'chain', null, {
        shape: 'circle',
        mass: 0,
        ignoreGravity: true,
      })
      // Set collision category for each element
      .setCollisionCategory(this.collisionCategory)
      // Make sure it only collides with the ground layer
      .setCollidesWith(scene.groundCollisionCategory);

      // If there's no previous link, attach first link to hook
      if (!previousLink) {
        scene.matter.add.joint(this.hook, link, jointLength, jointElasticity);
      }
      
      // If there was a previous link, join this link with the previous
      if (previousLink) {
        scene.matter.add.joint(previousLink, link, jointLength, jointElasticity);
      } 

      previousLink = link;
    }

    // Attach rope to player
    scene.matter.add.joint(previousLink, player);

    // Propel hook outward
    this.hook.applyForce({ x: .0075, y: -.0075 });

    scene.matterCollision.addOnCollideStart({
      objectA: this.hook,
      callback: this.onHookCollide,
      context: this
    });

    this.hooked = false;
    this.hookedPosition = {
      x: null,
      y: null,
    }

    // Hook into Phaser update
    this.scene.events.on("update", this.update, this);
  }

  fire() {
    
  }

  update () {
    if (this.hooked) {
      // If we're hooked, hold hook in this position
      this.hook.x = this.hookedPosition.x;
      this.hook.y = this.hookedPosition.y;
    }
  }

  onHookCollide() {
    this.hooked = true;
    this.hookedPosition.x = this.hook.x;
    this.hookedPosition.y = this.hook.y;
    console.log(this.hook);
  }

  reset() {

  }

}
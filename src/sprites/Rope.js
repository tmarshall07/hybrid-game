export default class Rope {
  constructor (config) {
    const { player, key, scene } = config;
    
    this.scene = scene;
  
    let previousLink;
    let x = player.x;
    let y = player.y;

    // Increment category
    this.collisionCategory = this.scene.matter.world.nextCategory();
    this.nextCat = this.scene.matter.world.nextCategory();

    for (let i = 0; i < 10; i += 1) {
      const link = scene.matter.add.sprite(x, y, 'chain', null, {
        shape: 'circle',
        mass: 0,
        ignoreGravity: true,
      }).setCollisionCategory(this.collisionCategory).setCollidesWith(1);

      if (!previousLink) link.applyForce({ x: .01, y: -.01 });
      
      if (previousLink) {
        this.joint = scene.matter.add.joint(previousLink, link, 20, 0.4);
      } 

      previousLink = link;
    }

    scene.matter.add.joint(previousLink, player);

    console.log(this);
  }

  fire() {
    
  }

  update () {
    
  }

}
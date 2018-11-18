export default class Rope {
  constructor (config) {
    const { player, key, scene } = config;
    
    this.scene = scene;

    // this.block = scene.matter.add.sprite(player.x, player.y, key, null, {
    //   ignoreGravity: true,
    // })
    // .setFixedRotation()
    // .setMass(5);
  
    let previousLink;
    let x = player.x;
    let y = player.y;

    for (let i = 0; i < 12; i += 1) {
      const link = scene.matter.add.sprite(x, y, 'chain', null, {
        shape: 'circle',
        mass: 0.1,
      });

      if (!previousLink) link.applyForce({ x: .01, y: -.01});
      
      if (previousLink) scene.matter.add.joint(previousLink, link, 5, 0.4);

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
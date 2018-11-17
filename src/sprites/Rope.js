export default class Rope {
  constructor (config) {
    const { x, y, key, scene } = config;
    
    this.scene = scene;

    this.block = scene.matter.add.image(x, y, key, null, {
      ignoreGravity: true,
    })
    .setFixedRotation()
    .setMass(5);
  
    let previousLink = this.block;
    y += 5;

    for (let i = 0; i < 12; i += 1) {
      const link = scene.matter.add.image(x, y, 'chain', null, {
        shape: 'circle',
        mass: 0.1,
      });

      scene.matter.add.joint(prev, previousLink, 5, 0.4);

      previousLink = link;
      
      y += 4;
    }
  }

  fire(x, y, left) {
    
  }

  update () {

  }

}
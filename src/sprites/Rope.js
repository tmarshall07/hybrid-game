// Add matter bodies, sensors, and sprite options
const { Body, Bodies } = Phaser.Physics.Matter.Matter;
export default class Rope {
  constructor (config) {
    const { player, key, scene } = config;
    
    this.scene = scene;
    this.player = player;

    this.x = player.x;
    this.y = player.y;

    console.log(this.scene.matter);

    // Increment category so the rope gets assigned a new category number
    this.collisionCategory = this.scene.matter.world.nextCategory();

    // Create the hook that grabs on to things
    this.hook = this.scene.matter.add.sprite(this.x, this.y, 'chain', null, {
      shape: 'circle',
      mass: .1,
      ignoreGravity: false,
      label: 'hook body',
    })
    // Set collision category for each element
    .setCollisionCategory(this.collisionCategory)
    // Make sure it only collides with the ground layer
    .setCollidesWith(this.scene.groundCollisionCategory);

    // Add collider plugin listener
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.hook,
      callback: this.onHookCollide,
      context: this
    });

    // Plug into Phaser update
    this.scene.events.on("update", this.update, this);

    console.log(this.player);
  }

  fire() {
    // Reset hook position
    console.log(Body);
    
    this.hook.x = this.player.x;
    this.hook.y = this.player.y;

    console.log(this.hook);

    this.links = [];

    let previousLink;
    const jointLength = 2;
    const jointStiffness = .2;
    
    for (let i = 0; i < 5; i += 1) {
      const link = this.scene.matter.add.sprite(this.x, this.y, 'chain', null, {
        shape: 'circle',
        mass: 0,
        ignoreGravity: true,
        label: 'link body',
      })
      // Set collision category for each element
      .setCollisionCategory(this.collisionCategory)
      // Make sure it only collides with the ground layer
      .setCollidesWith(this.scene.groundCollisionCategory);

      let constraint;

      // If there's no previous link, attach first link to hook
      if (!previousLink) {
        constraint = this.scene.matter.add.constraint(this.hook, link, jointLength, jointStiffness);
      } else {
        constraint = this.scene.matter.add.constraint(link, previousLink, jointLength, jointStiffness);
      }

      // Add label to know which constraint this is
      constraint.label = "rope constraint";

      this.links.push({
        link,
        constraint,
      });

      previousLink = link;
    }

    // Attach rope to player
    const playerRopeConstraint = this.scene.matter.add.constraint(previousLink, this.player, jointLength, jointStiffness);
    playerRopeConstraint.label = 'rope constraint';

    // Set hooked state
    this.hooked = false;

    // Propel hook outward
    let hookDirection = this.player.flipX ? -1 : 1;
    this.hook.applyForce({ x: .0075 * hookDirection, y: -.0075 });

    console.log(this.links);
    console.log(this.scene.matter.world.localWorld.constraints);

  }

  release () {
    // Set to not currently hooked
    this.hooked = false;

    // Reset hook static properties
    this.hook.body.density = this.hook.cache.density;
    this.hook.body.inertia = this.hook.cache.inertia;
    this.hook.body.mass = this.hook.cache.mass;
    this.hook.setStatic(false);

    // Destroy link references
    for (let i = 0; i < this.links.length; i += 1) {
      this.links[i].link.destroy();
    }

    // Clear links array
    this.links = [];

    // Remove rope constraints
    this.scene.matter.world.localWorld.constraints = this.scene.matter.world.localWorld.constraints.filter(constraint => constraint.label !== 'rope constraint');
  }

  update () {
    
  }

  onHookCollide() {
    this.hook.cache = {
      density: this.hook.body.density,
      inertia: this.hook.body.inertia,
      mass: this.hook.body.mass,
    }
    // Toggle hook state
    this.hooked = true;
    // Set static to cling to whatever we collided with
    this.hook.setStatic(true);
  }
}
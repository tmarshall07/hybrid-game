export default class Rope {
  constructor (config) {
    const { player, key, scene } = config;
    
    this.scene = scene;
    this.player = player;

    this.x = player.x;
    this.y = player.y;

    // Increment category so the rope gets assigned a new category number
    this.collisionCategory = this.scene.matter.world.nextCategory();

    // Create the hook that grabs on to things
    this.hook = this.scene.matter.add.sprite(this.x, this.y, 'chain', null, {
      shape: 'circle',
      mass: .1,
      ignoreGravity: false,
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

    // Hook into Phaser update
    this.scene.events.on("update", this.update, this);

    console.log(this.player);
  }

  fire() {
    this.links = [];

    let previousLink;
    const jointLength = 2;
    const jointStiffness = .1;
    
    for (let i = 0; i < 5; i += 1) {
      const link = this.scene.matter.add.sprite(this.x, this.y, 'chain', null, {
        shape: 'circle',
        mass: 0,
        ignoreGravity: true,
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
      constraint.label = "rope_constraint";

      this.links.push({
        link,
        constraint,
      });

      previousLink = link;
    }

    // Attach rope to player
    this.scene.matter.add.constraint(previousLink, this.player);

    // Set hooked state
    this.hooked = false;
    this.hookedPosition = {
      x: null,
      y: null,
    }

    // Propel hook outward
    let hookDirection = this.player.flipX ? -1 : 1;
    this.hook.applyForce({ x: .0075 * hookDirection, y: -.0075 });

    console.log(this.scene.matter.world);
  }

  release () {
    this.hooked = false;
    for (let i = 0; i < this.links.length; i += 1) {
      this.links[i].link.destroy();
    }

    const constraints = this.scene.matter.world.localWorld.constraints;
    for (let i = 0; i < constraints.length; i += 1) {
      if (constraints[i].label === 'rope_constraint') constraints.splice(i, 1);
    }

    console.log(this.scene.matter.world);
  }

  update () {
    if (this.hooked) {
      // If we're hooked, hold hook in this position
      this.hook.x = this.hookedPosition.x;
      this.hook.y = this.hookedPosition.y;
    }
  }

  onHookCollide() {
    // Toggle hook state
    this.hooked = true;

    // Add hooked position as this current position
    this.hookedPosition.x = this.hook.x;
    this.hookedPosition.y = this.hook.y;
  }
}
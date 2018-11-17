// import Mario from '../sprites/Mario';
// import Goomba from '../sprites/Goomba';
// import Turtle from '../sprites/Turtle';

import Player from '../sprites/Player';
class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {

    }

    create() {
    
        // Add the map and bind the tileset
        this.map = this.make.tilemap({
            key: 'map'
        });
        this.tileset = this.map.addTilesetImage('industrial', 'tiles');
        console.log(this.tileset);

        this.backgroundLayer = this.map.createStaticLayer('background', this.tileset, 0, 0);
        this.behindLayer = this.map.createStaticLayer('behind', this.tileset, 0, 0);
        // Dynamic layer because we want breakable and animated tiles
        this.groundLayer = this.map.createDynamicLayer('world', this.tileset, 0, 0);

        // Set collision by property
        // TILED 1.2.1 DOES NOT EXPORT PROPERTIES CORRECTLY
        // WAITING FOR NEXT PHASER UPDATE
        this.groundLayer.setCollisionByProperty({
            collides: true,
        });

        // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
        // haven't mapped our collision shapes in Tiled so each colliding tile will get a default
        // rectangle body (similar to AP).
        this.matter.world.convertTilemapLayer(this.groundLayer);

        // Set camera and matter bounds
        this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // The spawn point is set using a point object inside of Tiled (within the "Spawn" object layer)
        const { x, y } = this.map.findObject("Objects", obj => obj.name === "Spawn Point");
        if (!x || !y) {
            x = 10;
            y = 10;
            console.log('No spawn point found');
        }
        // Create player
        this.player = new Player({
            scene: this,
            key: 'player',
            x,
            y,
        });

        console.log(this.player);

        this.matter.world.on("collisionstart", event => {
            event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            });
        });
        
        this.matter.world.on("collisionend", event => {
            event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            });
        });

        this.keys = {
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            rope: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
        };

        // The camera should follow Mario
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
        this.cameras.main.roundPixels = true;

        // Turn on all physics debugging
        this.matter.world.createDebugGraphic();

    }

    update(time, delta) {
        
    }
}

export default GameScene;

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
        this.tileset = this.map.addTilesetImage('jungle-tileset', 'tiles');

        // Dynamic layer because we want breakable and animated tiles
        this.groundLayer = this.map.createDynamicLayer('world', this.tileset, 0, 0);

        // Set collision by property
        // this.groundLayer.setCollisionByProperty({
        //     collidable: true,
        // });

        // FIGURE OUT WHY THE ABOVE DOESN'T WORK 
        this.groundLayer.setCollisionByExclusion([-1]);
        
        // Add background
        this.add.tileSprite(0, 0, this.groundLayer.width, 500, 'background-clouds');

        // Create player
        this.player = new Player({
            scene: this,
            key: 'player',
            x: 16 * 6,
            y: this.sys.game.config.height - 48 - 48
        });

        const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.groundLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });

        this.physics.add.collider(this.player, this.groundLayer);
    }

    update(time, delta) {
        // Run player update method
        this.player.update(this.keys, time, delta);
    }
    
    record(delta) {
        let update = false;
        let keys = {
            jump: this.keys.jump.isDown || this.keys.jump2.isDown,
            left: this.keys.left.isDown,
            right: this.keys.right.isDown,
            down: this.keys.down.isDown,
            fire: this.keys.fire.isDown,
        }
        if (typeof (recording) === 'undefined') {
            console.log('DEFINE')
            window.recording = [];
            window.time = 0;
            this.recordedKeys = {};
            update = true;
        }  else {
            update = (time - recording[recording.length - 1].time) > 200; // update at least 5 times per second
        }
        time += delta;
        if (!update) {
            // update if keys changed
            ['jump', 'left', 'right', 'down', 'fire'].forEach((dir) => {
                if (keys[dir] != this.recordedKeys[dir]) {
                    update = true;
                }
            });
        }
        if (update) {
            recording.push({
                time,
                keys,
                x: this.mario.x,
                y: this.mario.y,
                vx: this.mario.body.velocity.x,
                vy: this.mario.body.velocity.y
            });
        }
        this.recordedKeys = keys;
    }
}

export default GameScene;

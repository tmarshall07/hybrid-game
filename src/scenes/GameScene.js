// import Mario from '../sprites/Mario';
// import Goomba from '../sprites/Goomba';
// import Turtle from '../sprites/Turtle';
// import PowerUp from '../sprites/PowerUp';
// import SMBTileSprite from '../sprites/SMBTileSprite';
// import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
// import Fire from '../sprites/Fire';
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

        // Create player
        this.player = new Player({
            scene: this,
            key: 'player',
            x: 16 * 6,
            y: this.sys.game.config.height - 48 - 48
        });
    }

    update(time, delta) {

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

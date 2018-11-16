import 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import TitleScene from './scenes/TitleScene';

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 400,
    height: 240,
    // physics: {
    //     default: 'arcade',
    //     arcade: {
    //         gravity: { y: 500 },
    //         debug: false
    //     }
    // },
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 500 },
            debug: true,
        },
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [
        BootScene,
        TitleScene,
        GameScene
    ]
};

const game = new Phaser.Game(config);
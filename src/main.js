import 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import TitleScene from './scenes/TitleScene';

import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: 'content',
    width: 400,
    height: 240,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: .5 },
            debug: true,
        },
    },
    scene: [
        BootScene,
        TitleScene,
        GameScene
    ],
    plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
          }
        ]
    }
};

const game = new Phaser.Game(config);
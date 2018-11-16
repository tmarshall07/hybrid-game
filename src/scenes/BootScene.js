import makeAnimations from '../helpers/animations';

class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
    }
    preload() {
        const progress = this.add.graphics();
       
        // Register a load progress event to show a load bar
        this.load.on('progress', (value) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
        });

        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // Prepare all animations, defined in a separate file
            makeAnimations(this);
            // Stop progress
            progress.destroy();

            // Start title screen
            this.scene.start('TitleScene');
        });

        this.load.image('background-clouds', 'assets/images/clouds.png'); // 16-bit later
        this.load.image('rope', 'assets/images/items/glove.png');

        // Tilemap with a lot of objects and tile-properties tricks
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/jungle/jungle.json');

        // Load spritesheets
        this.load.spritesheet('tiles', 'assets/images/jungle-tileset.png', {
            frameWidth: 16,
            frameHeight: 16,
            spacing: 2
        });

        this.load.image('player', 'assets/images/adventurer/adventurer-idle-00.png');

        // Beginning of an atlas to replace the spritesheets above. Always use spriteatlases. I use TexturePacker to prepare them.
        // Check rawAssets folder for the TexturePacker project I use to prepare these files.
        // this.load.atlas('mario-sprites', 'assets/mario-sprites.png', 'assets/mario-sprites.json');

        // Add audio
        // this.load.audio('overworld', [
        //     'assets/music/overworld.ogg',
        //     'assets/music/overworld.mp3'
        // ]);

        // Sound effects in a audioSprite.
        // this.load.audioSprite('sfx', 'assets/audio/sfx.json', [
        //     'assets/audio/sfx.ogg',
        //     'assets/audio/sfx.mp3'
        // ], {
        //     instances: 4
        // });

        // Load font
        this.load.bitmapFont('font', 'assets/fonts/font.png', 'assets/fonts/font.fnt');

        // This json contain recorded gameplay to show during the title screen
        // this.load.json('attractMode', 'assets/json/attractMode.json');
    }
}

export default BootScene;

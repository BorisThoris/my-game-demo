    
var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 1280,
    height: 720,
    backgroundColor: '#7d7d7d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

function preload() {
    this.load.spritesheet('mummy', './runningMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('mummy2', './runningMan2.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('flex', './flexingMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('ground', '/floor.png');
}

function create() {
    //  Frame debug view
    frameView = this.add.graphics();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //floor
    platforms.create(1280, 768, 'ground').setScale(2).refreshBody();

    //creating player
    player = this.physics.add.sprite(100, 200, 'mummy');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.0);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
   
    this.anims.create({
        key: 'walkRight',
        frames: this.anims.generateFrameNumbers('mummy'),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walkLeft',
        frames: this.anims.generateFrameNumbers('mummy2'),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'flex',
        frames: this.anims.generateFrameNumbers('flex'),
        frameRate: 3,
        repeat: -1
    });


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

   

}

function updateFrameView() {
    
}

function update() {

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('walkLeft', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('walkRight', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('flex', true)
        
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        console.log("xd")
    }

    if (!player.body.touching.down) {
        
        console.log("xd")
    }
}









var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 1280,
    height: 720,
    backgroundColor: '#7d7d7d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
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
var jumped = false;

function preload() {
    this.load.spritesheet('mummy', './runningMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('mummy2', './runningMan2.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('flex', './flexingMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('jump', './jumpingMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('ground', '/floor.png');
    this.load.image('background', '/background.png');
    this.load.image('spike', '/spikeball.png');
}

function create() {
    //background
    let backgroundImg = this.add.tileSprite(1280 / 2, 720/2, 1280, 720, 'background')

    let spikes = this.physics.add.group({})
    for(let i=0; i< 7; i++){
       spikes.create(Math.random()*1280, Math.random()*720, 'spike').setScale(1);
    }

    spikes.children.iterate(function (child) {
        child.setMass(1);
    });

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
    this.physics.add.collider(spikes, platforms);
    this.physics.add.collider(spikes, player);
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
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('jump'),
        frameRate: 6,
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

        if (player.body.touching.down){
        player.anims.play('walkLeft', true);
        }
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        if (player.body.touching.down) {
        player.anims.play('walkRight', true);
        }
    }
    else {
        player.setVelocityX(0);

        if(!player.body.touching.down){
            player.anims.play('jump', true);
        }

        if (player.body.touching.down) {
            player.anims.play('flex', true)
        }
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        player.anims.play('flex', true)
    }

    else if (!player.body.touching.down) {
        player.anims.play('jump', true);
    }
}









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
            debug: true
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
var timer = 0;
var spikes
var gameOver = false;
var scoreText;
var gameOverText

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
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FF0000' });

    spikes = this.physics.add.group({})

    spikes.children.iterate(function (child) {
        child.body.friction.x = 5;
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
    this.physics.add.collider(spikes, player);
    this.physics.add.collider(player, platforms);
    player.setSize(100,245, true);

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
    if(gameOver===false){
		timer++;
		scoreText.setText('Score: ' + Math.floor(timer/50));
    if(timer%20===0 || timer === 1){
        spikes.create(Math.random() * 1280, -100, 'spike').setScale((Math.random() * (1 - 0.4)) + 0.4);    
    }

    if (timer > 200 && spikes.children.entries[spikes.children.entries.length - 1].y === -100){
        
        spikes.children.entries.shift();
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.setSize(50, 245, true);
        if (player.body.touching.down){
        player.anims.play('walkLeft', true);
        }
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.setSize(50, 245, true);
        if (player.body.touching.down) {
        player.anims.play('walkRight', true);
        }
    }
    else {
        player.setVelocityX(0);
        player.setSize(100, 245, true);
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
        player.setSize(100, 245, true);
        player.anims.play('jump', true);
    }

    if (player.body.touching.up){
        gameOver = true;
	}
	
	}
	else if(gameOver!=="Ended"){
		player.setVelocityX(0);
		player.anims.play('flex', true)
		console.log("hehe")
		scoreText.destroy();
		gameOver = this.add.text(260, 360/4, `\n Game Over \n You scored: \n ${Math.floor(timer/50)}`, { fontSize: '100px', fill: '#FF0000' });
		gameOver = "Ended"
	}
}







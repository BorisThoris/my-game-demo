

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

//Creating game
var game = new Phaser.Game(config);

//Variables
var player, platforms, cursors, scoreText, spikes, powerUps, scoreText, highestScore, gameOverText, replayButton, music, gameOverMusic, ooGnome;

//Variables with default values
var highestScoreValue = 0;
var score = 0;
var timer = 0;
var gameOver = false;
var jumped = false;
var gameOver = false;
var crouched = false;
var spikeMax = 0.4;

//Player vars
var playerHeight = 225;

//Change walking speed
var walkSpeed = 500;
var croutchSpeed = walkSpeed - 100;

function preload() {
    this.load.spritesheet('mummy', './runningMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('mummy2', './runningMan2.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('flex', './flexingMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('crouch-flex', './croutching-flex.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('crouch-walk-left', './croutching-walk-left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('crouch-walk-right', './croutching-walk-right.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('jump', './jumpingMan.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('ground', '/floor.png');
    this.load.image('background', '/background.png');
    this.load.image('spike', '/spikeball.png');
    this.load.image('replay', '/replay.png');
    this.load.image('powerUp', '/powerUp.png');
    this.load.image('replay', '/replay.png')
    //Audio
    this.load.audio('musicBack', '/backgroundMusic.mp3');
    this.load.audio('gameOver', '/gameOver.mp3');
    this.load.audio('ooGnome', '/ooGnome.mp3');
    
}

function spikeCollision() {
    //On Collision with enemy
    if (player.body.touching.up) {
        gameOver = true;
        //Stop BG music and play game over music
        music.pause();
        gameOverMusic.play();

        let score = Math.floor(timer / 50);
        if (highestScoreValue < score) {
            highestScoreValue = score;
            highestScore.setText(`highest score: ${highestScoreValue}`)
        }
    }
}

// Power up collision
function powerUpsCollision(e){
    let powerUp = Math.floor(Math.random()*6)
    ooGnome.play();

    if(powerUp === 1){
        walkSpeed = -500
    }
    else if(powerUp === 2){
        walkSpeed = 500
    }
    else if(powerUp === 3){
        walkSpeed = 700
    }
    else if (powerUp === 4) {
        walkSpeed = -700
    }
    else if(powerUp === 5){
        spikeMax += 0.1;
    }
    else if(powerUp === 6){
        spikeMax -= 0.1;
    }

    croutchSpeed = walkSpeed - 100;
}

function create() {
    music = this.sound.add('musicBack');
    gameOverMusic = this.sound.add('gameOver')
    ooGnome = this.sound.add('ooGnome')
    music.play();

    //background
    let backgroundImg = this.add.tileSprite(1280 / 2, 720 / 2, 1280, 720, 'background')
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FF0000' });
    highestScore = this.add.text(900, 16, `highest score: ${highestScoreValue}`, { fontSize: '32px', fill: '#FF0000' });

    spikes = this.physics.add.group({})

    powerUps = this.physics.add.group({})

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
    player = this.physics.add.sprite(100, playerHeight, 'mummy');

    //  Player physics properties
    player.setBounce(0.0);
    player.setCollideWorldBounds(true);

    //Collisions
    this.physics.add.collider(spikes, player, () => spikeCollision());
    this.physics.add.collider(spikes, powerUps);
    this.physics.add.collider(powerUps, player, (powerUps) => powerUpsCollision(powerUps))
    this.physics.add.collider(player, platforms);

    player.setSize(100, playerHeight, true);

    //Creating Animations
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

    this.anims.create({
        key: 'crouch-flex',
        frames: this.anims.generateFrameNumbers('crouch-flex'),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'crouch-walk-left',
        frames: this.anims.generateFrameNumbers('crouch-walk-left'),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'crouch-walk-right',
        frames: this.anims.generateFrameNumbers('crouch-walk-right'),
        frameRate: 6,
        repeat: -1
    });


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('gameobjectup', function (pointer, gameObject) {
        gameObject.emit('clicked', gameObject);
    }, this);



}

function updateFrameView() {

}

//Movement
function update() {

    //Checking if game is over
    if (gameOver === false) {
        timer++;
        crouched = false;
        scoreText.setText('Score: ' + Math.floor(timer / 50));

        //Checking phase
        if (Math.floor(timer / 50) < 10) {
            if ((timer % 20 === 0 || timer === 1)) {
                let huh = Math.floor(Math.random()*5)
                if(huh >= 1 && huh <= 4){
                spikes.create(Math.random() * 1280, -100, 'spike').setScale((Math.random() * (1 - 0.4)) + spikeMax);
                }
                else {
                    powerUps.create(Math.random() * 1280, -100, 'powerUp').setScale(0.15)
                }
            }
        }
        //Checking phase
        if (Math.floor(timer / 50) >= 10) {
            if (timer % 10 === 0 || timer === 1) {
                let huh = Math.floor(Math.random() * 10)
                if (huh >= 1 && huh <= 6) {
                    spikes.create(Math.random() * 1280, -100, 'spike').setScale((Math.random() * (1 - 0.4)) + spikeeMax);
                }
                else {
                    powerUps.create(Math.random() * 1280, -100, 'powerUp').setScale(0.15)
                }
            }
        }

        //Preventing memory leaks
        if (timer > 200 && spikes.children.entries[spikes.children.entries.length - 1].y === -500) {

            spikes.children.entries.shift();
        }

        if (timer > 200 && powerUps.children.entries[powerUps.children.entries.length - 1] !== undefined && powerUps.children.entries[powerUps.children.entries.length - 1].y === -500) {

            powerUps.children.entries.shift();
        }

        //Moving left
        if (cursors.left.isDown && !cursors.down.isDown) {
            player.setVelocityX(-walkSpeed);
            player.setSize(50, playerHeight, true);

            if (player.body.touching.down) {
                player.anims.play('walkLeft', true);
            }
        }
        //Moving right
        else if (cursors.right.isDown && !cursors.down.isDown) {
            player.setVelocityX(walkSpeed);
            player.setSize(50, playerHeight, true);
            if (player.body.touching.down) {
                player.anims.play('walkRight', true);
            }
        }
        //Croutching
        else if (cursors.down.isDown && cursors.right.isDown) {
            crouched = true;
            player.setVelocityX(+croutchSpeed);
            if (player.body.touching.down) {
                //changing player hitbox
                player.setSize(50, 140);
                player.setOffset(100, 100)
                if (player.body.touching.down) {
                    player.anims.play('crouch-walk-right', true)
                }
            }
        }

        else if (cursors.down.isDown && cursors.left.isDown) {
            crouched = true;
            player.setVelocityX(-croutchSpeed);
            if (player.body.touching.down) {
                //changing player hitbox
                player.setSize(50, 140);
                player.setOffset(100, 100)
                if (player.body.touching.down) {
                    player.anims.play('crouch-walk-left', true)
                }
            }
        }

        else if (cursors.down.isDown) {
            crouched = true;
            if (player.body.touching.down) {
                let y = player.y;
                //changing player hitbox
                player.setSize(50, 140);
                player.setOffset(100, 100)
                player.setVelocityX(0);
                //playing animation
                player.anims.play('crouch-flex', true)
            }
        }


        //Idle animation
        else {
            player.setVelocityX(0);
            player.setSize(100, playerHeight, true);
            if (!player.body.touching.down) {
                player.anims.play('jump', true);
            }
            if (player.body.touching.down) {
                player.anims.play('flex', true)
            }
        }

        //jumping
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }

        else if (!player.body.touching.down && crouched === false) {

            player.setSize(100, playerHeight, true);
            player.anims.play('jump', true);
        }

    }
    else if (gameOver !== "Ended") {
        player.setVelocityX(0);
        player.anims.play('flex', true)

        gameOverText = this.add.text(260, 360 / 4, `\n Game Over \n You scored: \n ${Math.floor(timer / 50)} points`, { fontSize: '100px', fill: '#FF0000' });
        gameOver = "Ended"
        replayButton = this.add.sprite(1280 / 2, 540, 'replay')
        this.add.tween({
            targets: replayButton,
            ease: 'Sine.easeInOut',
            duration: 2000,
            delay: 0,
            alpha: 0,
            repeat: -1

        })

        replayButton.opacity = 0;
        replayButton.setScale(0.2)
        replayButton.setInteractive();
        spikes.children.entries = []
        replayButton.on("clicked", () => { gameOverText.destroy(), timer = 0, walkSpeed = 500, croutchSpeed = walkSpeed - 100, spikeMax = 0.4, gameOver = false, replayButton.destroy(), music.play() })
    }
}







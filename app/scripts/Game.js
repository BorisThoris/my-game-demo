    
var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 1280,
    height: 720,
    backgroundColor: '#7d7d7d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player;
var anim;
var sprite;
var progress;
var frameView;

function preload() {
    this.load.spritesheet('mummy', './runningMan.png', { frameWidth: 256, frameHeight: 256 });
}

function create() {
    //  Frame debug view
    frameView = this.add.graphics();

    var config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mummy'),
        frameRate: 10,
        repeat: -1
    };

    anim = this.anims.create(config);
    sprite = this.add.sprite(400, 300, 'mummy');
    sprite.anims.load('walk');

    progress = this.add.text(100, 500, 'Progress: 0%', { color: '#00ff00' });
    this.input.keyboard.on('keydown_SPACE', function (event) {
        sprite.anims.play('walk');
    });

    this.input.keyboard.on('keydown_P', function (event) {
        if (sprite.anims.isPaused) {
            sprite.anims.resume();
        }
        else {
            sprite.anims.pause();
        }

    });

    this.input.keyboard.on('keydown_R', function (event) {
        sprite.anims.restart();
    });

}

function updateFrameView() {
    frameView.clear();
    frameView.fillRect(sprite.frame.cutX, 0, 37, 45);
}

function update() {
    updateFrameView();

    var debug = [
        'SPACE to start animation, P to pause/resume',
        'Progress: ' + sprite.anims.getProgress() + '%',
        'Accumulator: ' + sprite.anims.accumulator,
        'NextTick: ' + sprite.anims.nextTick
    ];

    progress.setText(debug);
}







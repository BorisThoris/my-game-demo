class Scene1 extends Phaser.Scene {
    constructor()  {
        super({key:"Scene1"})
    }

    preload(){
        console.log("scene 1 test")
        this.load.spritesheet('runningMan', './runningMan.png', { frameWidth: 256, frameHeight: 256 } , 3);
    }

    create(){
        console.log("lol")

        let sprite = this.add.sprite(300, 200, 'runningMan');

    

        let walk = sprite.animations.add('walk');

        sprite.animations.play('walk', 30, true);
        
    }   
}
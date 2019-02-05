class Scene1 extends Phaser.Scene {
    constructor()  {
        super({key:"Scene1"})
    }

    preload(){
        console.log("scene 1 test")
        this.load.spritesheet('runningMan', './runningMan.png', { frameWidth: 256, frameHeight: 256 } , 3);
    }

    create(){
       
    }
    
    
    
}
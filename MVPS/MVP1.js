import Phaser from 'phaser';


class Game extends Phaser.Scene {

    constructor () {
        super();
    }

    preload() {

        this.movementTimer = 0
        this.movingLeft = false;
        this.movingRight = false;
        this.slowdownTimerDefault = 20;
        this.slowdownTimer = 0;
        this.topSpeed = 90
        this.acceleration = 500
        this.platforms
        this.wasRight = true
        this.wasLeft = false
        this.wasInAir = false

        this.load.image('map1-art', './assets/map1.png')
        this.load.image('map1-background', './assets/map1-background.png')
        this.load.image('collision-box', './assets/collision-box.png')
        this.load.spritesheet('idle', './assets/player-idle.png', {frameWidth:48, frameHeight:48})
        this.load.spritesheet('run', './assets/player-run.png', {frameWidth:48, frameHeight:48})
        this.load.spritesheet('brake', './assets/player-brake.png', {frameWidth:48, frameHeight:48})
        this.load.spritesheet('turn', './assets/player-turn.png', {frameWidth:48, frameHeight:48})
        this.load.spritesheet('jump', './assets/player-jump.png', {frameWidth:48, frameHeight:48})
        this.load.spritesheet('fall', './assets/player-fall.png', {frameWidth:48, frameHeight:48})
        


    }

    create(){

        this.add.image(320,120, 'map1-background')

        this.cameras.main.setBounds(0,0,640,240)

        this.cursors = this.input.keyboard.createCursorKeys()
        this.physics.world.bounds.width = 640
        this.physics.world.bounds.height = 240

        //this.physics.add.staticImage(320, 120, 'map1-col')

        this.platforms = this.physics.add.staticGroup()
        //this.platforms
        this.platforms.create(8, 200, 'collision-box').setScale(80,1).refreshBody()
        this.platforms.create(464, 184, 'collision-box').setScale(2,1).refreshBody()
        this.platforms.create(504, 168, 'collision-box').setScale(3,3).refreshBody()

        this.add.image(320,120, 'map1-art')

        this.player = this.physics.add.sprite(100,160, 'idle')//.setCrop(12,8,36,48)

        this.player.setMaxVelocity(this.topSpeed,this.topSpeed*10)
        this.player.setGravityY(550)


        this.player.setSize(12,25).setBodySize(12,37,false)

        //this.bounds.setBoundsRectangle(new Phaser.Geom.Rectangle(12,8,36,48))

        //this.player.setBoundsRectangle(new Phaser.Geom.Rectangle(12,8,36,48))
        //this.player.setInteractive(new Phaser.Geom.Rectangle(12,8,36,48), Phaser.Geom.Rectangle.Contains)
        this.player.setCollideWorldBounds(true)


          //animations

        //left
        this.anims.create({
            key: 'startRun',
            frameRate:10,
            repeat:0,
            frames:this.anims.generateFrameNumbers('run', {start: 0, end: 10})
        })

        //right
        this.anims.create({
            key: 'run',
            frameRate:10,
            repeat:-1,
            frames:this.anims.generateFrameNumbers('run', {start: 2, end: 10})
        })

        //movement transition

        this.anims.create({
            key: 'brake',
            frameRate:7,
            repeat: 0,
            frames:this.anims.generateFrameNumbers('brake', {start: 1, end: 7})
        })

        //idle
        this.anims.create({
            key: 'idle',
            frameRate:5,
            repeat:-1,
            frames:this.anims.generateFrameNumbers('idle', {start: 1, end: 6})
        })

        //turn
        this.anims.create({
            key: 'turn',
            frameRate:10,
            repeat:0,
            frames:this.anims.generateFrameNumbers('turn', {start:1, end:3})
        })

        //jump
        this.anims.create({
            key: 'jump',
            frameRate:8,
            repeat:0,
            frames:this.anims.generateFrameNumbers('jump', {start:0, end:3})
        })

        //fall
        this.anims.create({
            key: 'fall',
            frameRate:10,
            repeat:0,
            frames:this.anims.generateFrameNumbers('fall', {start:0, end:3})
        })

        this.cameras.main.startFollow(this.player)


    }

    loadMap1(){
        
    }

    update(){

        this.physics.add.collider(this.player,this.platforms)

        if(this.cursors.left.isDown) { this.movingLeft = true } else { this.movingLeft = false }
        if(this.cursors.right.isDown) { this.movingRight = true } else { this.movingRight = false }

        if(this.movingLeft == this.movingRight && this.movementTimer > 10) {
            if (this.slowdownTimer != 0) {
                this.player.play('brake',true)
                this.player.setAccelerationX(0)
                this.player.setDragX(300)
                this.slowdownTimer -= 1
            } else {
                this.player.setAccelerationX(0)
                this.movementTimer = 0
            }
            //this.player.setVelocity(0)
            this.player.playAfterRepeat('idle')
            //console.log('statement 1')
        } else if (this.movingLeft == this.movingRight) {
            this.player.play('idle',true)
            this.player.setAccelerationX(0)
            this.movementTimer = 0
            //console.log('statement 2')
        } else {
            this.movementTimer += 1
        }


        //console.log(this.player.body.newVelocity.x)

        if(this.movingRight & !this.movingLeft) {
            this.player.setAccelerationX(this.acceleration)
            this.player.direction = 1

            if (this.player.body.touching.down) {
                if (this.player.body.newVelocity.x < 0) {
                    this.player.play('turn',true)
                }
                if (this.player.body.newVelocity.x == 0 || this.wasInAir) {
                    if (this.player.body.touching.right) {
                        this.player.play('run',true)
                    } else {
                        this.player.play('startRun',true)
                    }
                    
                }
                
                this.player.playAfterRepeat('run')

            }
            
            this.player.flipX = false;
            this.wasInAir = false;
            this.slowdownTimer = this.slowdownTimerDefault;
        }

        if(this.movingLeft & !this.movingRight) {
            this.player.setAccelerationX(-this.acceleration)
            this.player.direction = -1


            //animations
            if (this.player.body.touching.down) {
                if (this.player.body.newVelocity.x > 0) {
                    this.player.play('turn',true)
                }
                if (this.player.body.newVelocity.x == 0 || this.wasInAir) {
                    if (this.player.body.touching.left) {
                        this.player.play('run',true)
                    } else {
                        this.player.play('startRun',true)
                    }
                }
                this.player.playAfterRepeat('run')
            }

            this.player.flipX = true;
            this.wasInAir = false;
            this.slowdownTimer = this.slowdownTimerDefault;
        }


        //jump
        if(this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-250)
        }

        //console.log(this.player.body.newVelocity.y)


        //jump animation
        if(!this.player.body.touching.down) {
            if(this.player.body.newVelocity.y < 0) {
                this.player.play('jump', true)
            }

            if(this.player.body.velocity.y > 0) {
                this.player.play('fall', true)
            }
            this.wasInAir = true
        }

        console.log()


    }
}

export default Game
var nave
var flare
class Example extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('bg', 'assets/stars.jpeg');
        this.load.image('ship', 'assets/nave.png');
        this.load.image('mira', 'assets/mira.png');
        this.load.image('arma', 'assets/arma.png');
        this.load.image('flare', 'assets/red.png');
        this.load.spritesheet('plasma', 'assets/plasmaball.png', { frameWidth: 128, frameHeight: 128 });

    }

    create() {
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 1500 * 2, 1000 * 2);
        this.physics.world.setBounds(0, 0, 1500 * 2, 1000 * 2);

        //  Mash 4 images together to create our background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(1500, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 1000, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(1500, 1000, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        nave = this.physics.add.image(200, 100, 'ship');
        this.player = this.physics.add.image(400, 300, 'mira');
        this.arma = this.physics.add.image(400, 700, 'arma');

        this.player.setCollideWorldBounds(true);
        nave.setCollideWorldBounds(true);
        this.arma.setCollideWorldBounds(true);

		flare = this.add.particles('flare').createEmitter({
            x: nave.body.x,
            y: nave.body.y,
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            blendMode: 'SCREEN',
            active: false,
            lifespan: 1000,
            gravityY: 800,
        });

        this.particles = this.add.particles('plasma');
        this.particles.createEmitter({
            frame: 0,
            lifespan: 1000,
			speedX: { min: -20, max: 20 },
			speedY: { start: -400, end: -600, steps: 12 },
			scale: { start: 0.3, end: 0.3 },
			blendMode: 'ADD',
            deathZone: {
                type: 'onEnter', source: {
                    contains:
                        function (x, y) {
                            var hit = nave.body.hitTest(x, y);
                            if (hit) {
                                nave.visible = false;

                                flare.setPosition(nave.body.x, nave.body.y);
                                flare.active = true;
                                setTimeout(() => {
                                    flare.stop();
                                }, 800);
                            }
                            return hit;
                        }
                }},
			on: false
        });

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        this.player.setVelocity(0);

        let velocidade = Math.floor(Math.random() * 1000) - 500;
        let v = Math.random() * 100;
        if(nave != null) {
            if (v < 5) {
                nave.setVelocityY(velocidade);
            } else if (v > 95) {
                nave.setVelocityX(velocidade);
            }
		}

        if (this.cursors.space.isDown) {
            this.particles.emitParticleAt(this.player.x, this.player.y + 350);
        }

        this.arma.x = this.player.x;
        this.arma.y = this.player.y + 400;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-500);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(500);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
    },
    scene: [Example]
};

const game = new Phaser.Game(config);
export default class Ui extends Phaser.Scene {
    constructor() {
        super({ key: 'Ui' });
        this.axisL = null;
        this.myPlayer = null;
    }

    preload() {

    }

    create() {
        this.game.events.on('ready', (scene) => {
            this.myPlayer = scene.myPlayer;

            // Initialize joystick
            this.axisL = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 100,
                y: window.innerHeight - 80,
                radius: 40,
                forceMin: 0,
                base: this.add.circle(0, 0, 60, 0x888888).setDepth(100).setAlpha(0).setScrollFactor(0),
                thumb: this.add.image(0, 0, 'analogue').setDisplaySize(80, 80).setDepth(100).setAlpha(0).setScrollFactor(0),
            });

            this.setupJoystickControls();
        });

        this.scene.bringToTop();
    }

    setupJoystickControls() {
        // Move joysticks dynamically based on pointer-down
        this.input.on('pointerdown', (pointer) => {
            if (this.axisL && pointer.x <= window.innerWidth * 0.4) {
                this.axisL.base.setPosition(pointer.x, pointer.y).setAlpha(0.2);
                this.axisL.thumb.setPosition(pointer.x, pointer.y).setAlpha(1);
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (this.axisL && !this.axisL.force) {
                this.axisL.base.setAlpha(0);
                this.axisL.thumb.setAlpha(0);
            }
        });
    }

    update() {
        if (!this.axisL || !this.myPlayer) return;

        if (this.axisL.force) {
            // Calculate speed based on joystick force
            let speedMultiplier = (this.axisL.force < this.axisL.radius) ? this.axisL.force / this.axisL.radius : 1;
            let speed = 200 * speedMultiplier;

            // Calculate velocities based on joystick angle
            let angleRad = Math.PI * this.axisL.angle / 180;
            let velocityX = speed * Math.cos(angleRad);
            let velocityY = speed * Math.sin(angleRad);

            // Apply velocities with limits
            this.myPlayer.setVelocityX(Math.min(Math.max(velocityX, -100), 100));
            this.myPlayer.setVelocityY(Math.min(Math.max(velocityY, -100), 100));

            // Handle animations and flip
            this.myPlayer.play('run', true);
            if (velocityX < 0) {
                this.myPlayer.flipX = true;
            } else if (velocityX > 0) {
                this.myPlayer.flipX = false;
            }

            // Broadcast position if the function exists
            if (typeof broadcastPosition === 'function') {
                broadcastPosition(this.myPlayer);
            }
        } else {
            // Stop movement and play idle animation
            this.myPlayer.setVelocity(0, 0);
            this.myPlayer.play('idle', true);
        }
    }
}
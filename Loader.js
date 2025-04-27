export default class Loader extends Phaser.Scene {
    constructor() {
        super({ key: 'Loader' });
    }
    create() {
        // Start the main game scene after loading
        this.scene.start('GameScene');
        this.scene.start('Ui');
    }

}
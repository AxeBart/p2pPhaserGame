
import Game from "./game.js";
import Ui from "./ui.js";
import Loader from "./Loader.js"


window.onload = function () {
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {

        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },

    pixelArt: true,
    backgroundColor: '#333333',
    scene: [Loader, Game, Ui]
}

new Phaser.Game(config);
}



// let peer, conn;
// let myPlayer;
// let players = new Map();
// let cursors;
// let connections = new Set(); // Pour gérer plusieurs connexions

// function preload() {
//     this.load.spritesheet('player', './Cat_Idle.png', { frameWidth: 32, frameHeight: 32 });
//     this.load.spritesheet('playerRun', './Cat_Run.png', { frameWidth: 32, frameHeight: 32 });


//     // chargement des touches pour ecran tactile
//     this.load.spritesheet("analogue", "./touch/analogue.png", { frameWidth: 128, frameHeight: 128 });
//     this.load.spritesheet("tiret", "./touch/touche_-.png", { frameWidth: 128, frameHeight: 128 });
//     this.load.spritesheet("rond", "./touch/touche_O.png", { frameWidth: 128, frameHeight: 128 });

//     this.load.plugin('rexvirtualjoystickplugin', rexvirtualjoystickplugin, true);
//     // Vous pouvez ajouter ici le chargement des assets si nécessaire
// }

// function create() {
//     this.anims.create({
//         key: "idle",
//         frames: this.anims.generateFrameNumbers("player", { start: 0, end: 7 }),
//         frameRate: 12,
//         repeat: -1
//     })
//     this.anims.create({
//         key: "run",
//         frames: this.anims.generateFrameNumbers("playerRun", { start: 0, end: 9 }),
//         frameRate: 12,
//         repeat: -1
//     })

//     myPlayer = this.physics.add.sprite(100, 100, 'player').setOrigin(0.5, 0.5).play('run');
//     cursors = this.input.keyboard.createCursorKeys();
//     setupP2P.call(this);

//     // Configuration des caméras
//     // Caméra principale qui suit le joueur
//     this.gameCamera = this.cameras.main;
//     this.gameCamera.startFollow(myPlayer);
//     this.gameCamera.setZoom(2); // Ajustez le zoom selon vos besoins
//     this.gameCamera.setLerp(0.1); // Ajoute un effet de suivi plus doux
//     this.gameCamera.setDeadzone(100, 100); // Crée une zone morte pour éviter les mouvements de caméra trop brusques

//     // Caméra UI pour les contrôles (reste fixe)
    
//     // Configuration du joystick pour qu'il soit visible uniquement sur la caméra UI
//     this.axisL = this.plugins.get('rexvirtualjoystickplugin').add(this.scene, {
//         x: 100,
//         y: window.innerHeight - 80,
//         radius: 40,
//         forceMin: 0,
//         base: this.add.circle(0, 0, 60, 0x888888).setDepth(100).setAlpha(0).setScrollFactor(0),
//         thumb: this.add.image(0, 0, 'analogue').setDisplaySize(80, 80).setDepth(100).setAlpha(0).setScrollFactor(0),
//     }).on('update', () => { }, this);

//     // Move joysticks dynamically based on pointer-down
//     this.input.on('pointerdown', (pointer) => {
//         if (pointer.x <= window.innerWidth * 0.4) {
//             this.axisL.base.setPosition(pointer.x, pointer.y).setAlpha(0.2);
//             this.axisL.thumb.setPosition(pointer.x, pointer.y).setAlpha(1);
//         }
//     });

//     this.input.on('pointerup', (pointer) => {
//         if (!this.axisL.force) {
//             this.axisL.base.setAlpha(0)
//             this.axisL.thumb.setAlpha(0)
//         }
//     })
// }

// function update() {
//     if (this.axisL.force) {
//         // Calculate speed based on joystick force
//         let speedMultiplier = (this.axisL.force < this.axisL.radius) ? this.axisL.force / this.axisL.radius : 1;
//         let speed = 200 * speedMultiplier;
        
//         // Calculate velocities based on joystick angle
//         let angleRad = Math.PI * this.axisL.angle / 180;
//         let velocityX = speed * Math.cos(angleRad);
//         let velocityY = speed * Math.sin(angleRad);

//         // Apply velocities with limits
//         myPlayer.setVelocityX(Math.min(Math.max(velocityX, -100), 100));
//         myPlayer.setVelocityY(Math.min(Math.max(velocityY, -100), 100));

//         // Handle animations and flip
//         if (Math.abs(velocityX) > 0 || Math.abs(velocityY) > 0) {
//             myPlayer.play('run', true);
//             // Flip sprite based on horizontal movement
//             if (velocityX < 0) {
//                 myPlayer.flipX = true;
//             } else if (velocityX > 0) {
//                 myPlayer.flipX = false;
//             }
//         }

//         // Broadcast position to other players
//         broadcastPosition();
//     } else {
//         // Stop movement and play idle animation
//         myPlayer.setVelocity(0, 0);
//         myPlayer.play('idle', true);
//     }
// }

// function setupP2P() {
//     peer = new Peer();

//     peer.on('open', id => {
//         document.getElementById('myId').innerText = `Votre ID : ${id}`;
//         myPlayer.playerId = id;
//     });

//     peer.on('connection', connection => {
//         handleNewConnection(connection, this);
//     });

//     document.getElementById('joinBtn').onclick = () => {
//         const id = document.getElementById('joinInput').value;
//         if (id && id.trim()) {
//             const conn = peer.connect(id);
//             handleNewConnection(conn, this);
//         }
//     };
// }

// function handleNewConnection(connection, scene) {
//     connections.add(connection);

//     connection.on('open', () => {
//         console.log('Nouvelle connexion établie avec:', connection.peer);

//         // Créer un nouveau joueur avec une couleur aléatoire
//         const newPlayer = scene.add.rectangle(
//             Phaser.Math.Between(100, 700),
//             Phaser.Math.Between(100, 500),
//             50, 50,
//             Phaser.Math.Between(0x000000, 0xffffff)
//         );
//         scene.physics.add.existing(newPlayer);
//         players.set(connection.peer, newPlayer);

//         // Envoyer notre position initiale
//         connection.send({
//             type: 'position',
//             x: myPlayer.x,
//             y: myPlayer.y
//         });
//     });

//     connection.on('data', data => {
//         if (data.type === 'position') {
//             const player = players.get(connection.peer);
//             if (player) {
//                 player.x = data.x;
//                 player.y = data.y;
//             }
//         }
//     });

//     connection.on('close', () => {
//         console.log('Connexion fermée avec:', connection.peer);
//         const player = players.get(connection.peer);
//         if (player) {
//             player.destroy();
//             players.delete(connection.peer);
//         }
//         connections.delete(connection);
//     });
// }

// function broadcastPosition() {
//     const data = {
//         type: 'position',
//         x: myPlayer.x,
//         y: myPlayer.y
//     };

//     connections.forEach(connection => {
//         if (connection.open) {
//             connection.send(data);
//         }
//     });
// }

import { Peer } from "https://esm.sh/peerjs@1.5.4?bundle-deps"


export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.spritesheet('player', './Cat_Idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerRun', './Cat_Run.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("analogue", "./touch/analogue.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("tiret", "./touch/touche_-.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("rond", "./touch/touche_O.png", { frameWidth: 128, frameHeight: 128 });
        this.load.plugin('rexvirtualjoystickplugin', rexvirtualjoystickplugin, true);
    }
    create() {
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("playerRun", { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        })

        this.myPlayer = this.physics.add.sprite(100, 100, 'player').setOrigin(0.5, 0.5).play('run');
        // this.myPlayer.setCollideWorldBounds(true); // Empêche le joueur de sortir des limites du monde
        // this.myPlayer.setBounce(0.2); // Ajoute un rebond léger pour le joueur
        setupP2P(this.myPlayer, this)

        // Configuration des caméras
        // Caméra principale qui suit le joueur
        this.gameCamera = this.cameras.main;
        this.gameCamera.startFollow(this.myPlayer);
        this.gameCamera.setZoom(1); // Ajustez le zoom selon vos besoins
        this.gameCamera.setLerp(0.2); // Ajoute un effet de suivi plus doux
        this.gameCamera.setDeadzone(100, 100); // Crée une zone morte pour éviter les mouvements de caméra trop brusques

        // Caméra UI pour les contrôles (reste fixe)

        // this.scene.start("GameScene")

        this.game.events.emit('ready', this);
    }

    update() {
        broadcastPosition(this.myPlayer)
    }

}






// Gestion des connexions P2P
let connections = new Set();
let players = new Map();
function setupP2P(myPlayer, scene) {

    let randomId = Math.floor(10000 + Math.random() * 90000).toString();
    let peer = new Peer(randomId);

    peer.on('open', id => {
        document.getElementById('myId').innerText = `ID : ${id}`;
        myPlayer.playerId = id;
    });

    peer.on('connection', connection => {
        handleNewConnection(connection, scene, myPlayer);
    });

    document.getElementById('joinBtn').onclick = () => {
        const id = document.getElementById('joinInput').value;
        if (id && id.trim()) {
            const conn = peer.connect(id);
            handleNewConnection(conn, scene, myPlayer);
        }
    };
}

function handleNewConnection(connection, scene, myPlayer) {
    connections.add(connection);

    connection.on('open', () => {
        console.log('Nouvelle connexion établie avec:', connection.peer);

        // Créer un nouveau joueur avec une couleur aléatoire
        const newPlayer = scene.physics.add.sprite(100, 100, 'player').setOrigin(0.5, 0.5).play('idle');

        scene.physics.add.existing(newPlayer);
        players.set(connection.peer, newPlayer);

        // Envoyer notre position initiale
        connection.send({
            type: 'position',
            x: myPlayer.x,
            y: myPlayer.y
        });
    });

    connection.on('data', data => {
        if (data.type === 'position') {
            const player = players.get(connection.peer);
            if (player) {
                player.body.velocity.x = data.x;
                player.body.velocity.y = data.y;
                if(data.x !== 0 || data.y !== 0) {
                    player.play('run', true);
                    if(data.x < 0) {
                        player.flipX = true;
                    }
                    else if(data.x > 0) {
                        player.flipX = false;
                    }
                }
                else {
                    player.play('idle', true);
                }
            }
        }
    });

    connection.on('close', () => {
        console.log('Connexion fermée avec:', connection.peer);
        const player = players.get(connection.peer);
        if (player) {
            player.destroy();
            players.delete(connection.peer);
        }
        connections.delete(connection);
    });
}

function broadcastPosition(myPlayer) {
    const data = {
        type: 'position',
        x: myPlayer.body.velocity.x,
        y: myPlayer.body.velocity.y
    };

    connections.forEach(connection => {
        if (connection.open) {
            connection.send(data);
        }
    });
}

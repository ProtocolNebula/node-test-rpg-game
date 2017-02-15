const io = require('socket.io-client')
const kbd = require('@dasilvacontin/keyboard')
const deepEqual = require('deep-equal')
const capitalize = require('capitalize')
const Game = require('../assets/Game')
const Player = require('../assets/Player')
const { PLAYER_EDGE } = require('../common/constants.js')

// Eventos que nos envia el servidor (se creara solo un hook a cada uno)
const serverEventsNames = [
  'connect', 'gameInit', 'serverPong',
  'playerMoved', 'playerDisconnected',
  'coinSpawned', 'coinCollected'
]

/**
 * Gestiona el cliente
 */
class GameClient extends Game {
    /**
     * Crea un socket vinculado a una sala
     */
    constructor (room) {
        super(room)
        this.socket = io()

        // Creamos el esquema de un jugador
        const schemePlayer = new Player()

        this.myPlayerId = null
        this.myInputs = schemePlayer.inputs

        this.ping = Infinity
        this.clockDiff = 0

        // Recorremos los eventos que puedan haber y los enlazamos
        // al propio objeto
        serverEventsNames.forEach((serverEventsNames) => {
            this.socket.on(
                serverEventsName,
                this[`on${capitalize(serverEventsName)}`].bind(this)
            )
        })
    }
}
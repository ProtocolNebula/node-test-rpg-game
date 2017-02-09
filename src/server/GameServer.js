const Game = require('./../Game.js')
console.log("preparing game")

/**
 * Clase que gestiona lo que pasa en el juego
 */
class GameServer extends Game {

    /**
     * Preparamos la sala a un socket
     */
    constructor (io, room) {
        super(room)
        this.io = io // socket
        this.lastLogic = Date.now() // Controles para deltatime

        this.createMap()
    }

    /**
     * Gestiona una conexion de un jugador
     */
    onPlayerConnected (socket) {
        console.log(`${socket.id} connected to game ${this.room}`)

        // Añadimos al jugador a la sala (socket io y servidor)
        socket.join(this.room)
        this.players[socket.id] = player

        let map = this.map
        let players = this.players
        let items = this.items

        // Enviamos al nuevo jugador los datos de la partida
        socket.emit('world:refresh', { 
            map, players, items
        })
    }

    /**
     * Crea un mapa (especifica elementos como paredes, suelo, items, mobs...)
     */
    createMap() {
        
    }
}

module.exports = GameServer
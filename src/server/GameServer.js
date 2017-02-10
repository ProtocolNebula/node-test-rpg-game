const Game = require('./../Game.js')
const Player = require('./../assets/Player.js')

/**
 * Clase que gestiona lo que pasa en el juego
 */
class GameServer extends Game {

    /**
     * Preparamos una sala para un socket
     */
  constructor (io, room) {
    super(room) // Cargamos las cosas genericas
    this.io = io // socket

    this.createMap()
  }

    /**
     * Gestiona una conexion de un jugador
     */
  onPlayerConnected (socket) {
    console.log(`${socket.id} connected to game ${this.room}`)

        // Añadimos al jugador a la sala (socket io y servidor)
    socket.join(this.room)
    let player = new Player(socket)
    this.players[socket.id] = player

    let map = this.map
    let players = this.players
    let items = this.items

        // Enviamos al nuevo jugador los datos de la partida al jugador
    socket.emit('world:refresh', {
      map, players, items
    })

        // Forzamos el movimiento para que se refresque en todos los clientes
    this.onPlayerAction(socket, player)
  }

    /**
     * El usuario ha pulsado algo, guardaremos los inputs y el momento actual,
     * ademas de avisar a los clientes
     */
  onPlayerAction (socket, inputs) {
    const player = this.players[socket.id]
    player.timestamp = Date.now()
    player.inputs = inputs
    this.io.to(this.room).emit('playerMoved', player)
  }

    /**
     * El usuario se ha desconectado
     */
  onPlayerDisconnected (socket) {
    console.log(`${socket.id} disconnected from game ${this.room}`)
    delete this.players[socket.id]
    socket.to(this.roomId).broadcast.emit('playerDisconnected', socket.id)
  }

    /**
     * Crea un mapa (especifica elementos como paredes, suelo, items, mobs...)
     */
  createMap () {

  }

  logic () {
    // Para optimizar recursos solo lo ejecutaremos si hay jugadores ?
    //if (this.players > 0) 
    super.logic()
  }
}

module.exports = GameServer

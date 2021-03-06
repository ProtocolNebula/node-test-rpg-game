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
    let player = new Player(socket.id, socket.id)
    this.players[socket.id] = player

    let map = this.map
    let players = this.players
    let items = this.items

        // Enviamos al nuevo jugador los datos de la partida
    socket.emit('gRefresh', socket.id, {
      map, players, items
    })

        // Forzamos el movimiento para que se refresque en todos los clientes
    // this.onPlayerAction(socket, player)
    this.emitPlayer(player)
  }

    /**
     * El usuario ha pulsado algo, guardaremos los inputs y el momento actual,
     * ademas de avisar a los clientes
     */
  onPlayerMove (socket, inputs) {
    const player = this.players[socket.id]
    const now = Date.now()
    player.logic(player.timestamp - now)
    player.timestamp = now
    player.inputs = inputs
    this.emitPlayer(player)
  }

  emitPlayer (player) {
    this.io.to(this.room).emit('pMove', player)
  }

    /**
     * El usuario se ha desconectado
     */
  onPlayerDisconnected (socket) {
    console.log(`${socket.id} disconnected from game ${this.room}`)
    delete this.players[socket.id]
    socket.to(this.roomId).broadcast.emit('pDiscon', socket.id)
  }

    /**
     * Crea un mapa (especifica elementos como paredes, suelo, items, mobs...)
     */
  createMap () {

  }

  logic () {
    // Para optimizar recursos solo lo ejecutaremos si hay jugadores ?
    // if (this.players > 0)
    super.logic()
  }
}

module.exports = GameServer

const io = require('socket.io-client')
const kbd = require('@dasilvacontin/keyboard')
const deepEqual = require('deep-equal')
const capitalize = require('capitalize')
const Game = require('../Game.js')
const Player = require('../assets/Player.js')
const { PLAYER_EDGE } = require('../config.js')

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

    // Eventos que nos envia el servidor (se creara solo un hook a cada uno)
    // p: player | g: game
    const serverEventsNames = [
      'connect', 'gRefresh', 'gPong',
      'pMove', 'pDiscon'
    ]

    // Recorremos los eventos que puedan haber y los enlazamos
    // al propio objeto
    serverEventsNames.forEach((serverEventsName) => {
      this.socket.on(
        serverEventsName,
        this[`on${capitalize(serverEventsName)}`].bind(this)
      )
    })
  }

  /**
   * Envia un ping al servidor
   */
  pingServer () {
    this.pingMessageTimestamp = Date.now()
    this.socket.emit('gPing')
  }

  /**
   * Respuesta PONG del servidor
   */
  onGPong (serverNow) {
    const now = Date.now()
    this.ping = (now - this.pingMessageTimestamp) / 2
    this.clockDiff = (serverNow + this.ping) - now
    setTimeout(() => {
      this.pingServer()
    }, Math.max(200, this.ping))
  }

  /**
   * El socket establece la conexion
   */
  onConnect () {
    this.socket.emit('joinRoom', this.roomId)
    this.pingServer()
  }

  /**
   * instancia del juego / refresco del juego
   */
  onGRefresh (myPlayerId, gameState) {
    this.myPlayerId = myPlayerId
    const { players } = gameState

    for (let player in players) {
      player = players[player]
      this.players[player.id] = new Player(player.id, player.name)
      this.players[player.id].updatePlayer(player)
    }
  }

  onPMove (player) {
    let p = this.players[player.id]
    console.log(p)
    if (!p) {
      p = new Player(player.id, player.name)
      this.players[p.id] = p
    }

    p.updatePlayer(player)
  }

  onPDiscon (playerId) {
    delete this.players[playerId]
  }

  updateInputs () {
    const { myInputs } = this
    const oldInputs = Object.assign({}, myInputs)

    for (let key in myInputs) {
      myInputs[key] = kbd.isKeyDown(kbd[key])
    }

    if (!deepEqual(myInputs, oldInputs)) {
      this.socket.emit('pMove', myInputs)

      // update our local player' inputs aproximately when
      // the server takes them into account
      const frozenInputs = Object.assign({}, myInputs)
      setTimeout(() => {
        const myPlayer = this.players[this.myPlayerId]
        const now = Date.now()
        const serverNow = now + this.clockDiff
        myPlayer.updatePlayer(myPlayer, serverNow - myPlayer.timestamp)
        myPlayer.inputs = frozenInputs
        // calculatePlayerAcceleration(myPlayer)
      }, this.ping)
    }
  }

  logic () {
    const now = Date.now()
    const serverNow = now + this.clockDiff
    this.updateInputs()

    for (let playerId in this.players) {
      const player = this.players[playerId]
      player.logic(serverNow - player.timestamp)
    }
  }

  render (canvas, ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // render players
    for (let playerId in this.players) {
      const { color, x, y, score } = this.players[playerId]
      ctx.save()
      ctx.translate(x, y)
      ctx.fillStyle = color
      const HALF_EDGE = PLAYER_EDGE / 2
      ctx.fillRect(-HALF_EDGE, -HALF_EDGE, PLAYER_EDGE, PLAYER_EDGE)
      if (playerId === this.myPlayerId) {
        ctx.strokeRect(-HALF_EDGE, -HALF_EDGE, PLAYER_EDGE, PLAYER_EDGE)
      }

      // render score inside players
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.font = '20px Arial'
      ctx.fillText(score, 0, 7)
      ctx.restore()
    }

    // render `ping` and `clockDiff`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'left'
    ctx.font = '20px Arial'
    ctx.fillText(`ping: ${this.ping}`, 15, 30)
    ctx.fillText(`clockDiff: ${this.clockDiff}`, 15, 60)
  }
}

module.exports = GameClient

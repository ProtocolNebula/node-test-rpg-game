const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const GameServer = require('./GameServer.js')
const serverConf = require('./serverConfig.js')

// Servimos archivos solcitados que se encuentren en public
app.use(express.static('public'))

app.get('/:gameId', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Lista con las salas de juegos
const games = {}

// Sala asignada a cada jugador
const gameForPlayer = {} // socket.id => game

/*
 * HOOKS DEL SOCKET
 */
// Hook de asignacion de sala
function onJoinRoom (room) {
  if (room === null) room = 'default'

  const socket = this
  let game = games[room]

  if (game == null) {
    // Creamos una sala nueva
    game = new GameServer(io, room)
    games[room] = game
  }

  // Vinculamos la sala al jugador
  gameForPlayer[socket.id] = game
  game.onPlayerConnected(socket)
}

/**
 * Recibimos una peticion ping del cliente y devolvemos un pong
 */
function onGamePing () {
  const socket = this
  socket.emit('gPong', Date.now())
}

/**
 * Movimiento del jugador
 */
function onPlayerMove (inputs) {
  const socket = this
  const game = gameForPlayer[socket.id]
  if (game != null) game.onPlayerMove(socket, inputs)
}

/**
 * Desconexion del jugador
 */
function onDisconnect () {
  const socket = this
  const game = gameForPlayer[socket.id]
  if (game != null) game.onPlayerDisconnected(socket)
}

// Escuchas del socket
io.on('connection', function (socket) {
  // El jugador solicita entrar a una sala
  socket.on('joinRoom', onJoinRoom)
  socket.on('gPing', onGamePing)
  /* socket.on('game:pung', () => {
        // Recibimos el "pong" del cliente
  }) */
  socket.on('pMove', onPlayerMove)
  socket.on('disconnect', onDisconnect)
})

// Ejecutamos la logica del juego x veces por segundo
setInterval(function () {
  for (let gameId in games) {
    const game = games[gameId]
    game.logic()
  }
}, serverConf.LOGIC_FREQ)

// Ponemos a la escucha el servidor
const PORT_IN_USE = process.env.PORT || serverConf.PORT
http.listen(PORT_IN_USE, function () {
  console.log('listening on *:' + PORT_IN_USE)
})

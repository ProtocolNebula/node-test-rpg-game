const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const GameServer = require('./GameServer.js')
const conf = require('./../config.js')

// Servimos archivos solcitados que se encuentren en public
app.use(express.static('public'))

// Lista con las salas de juegos
const games = {}

// Sala asignada a cada jugador
const gameForPlayer = {} // socket.id => game

io.on('connection', function() {
    // El jugador solicita entrar a una sala
    socket.on('joinRoom', (room) => {
        let game = games[room]
        
        if (game == null) {
            // Creamos una sala nueva
            game = new GameServer(io, room)
            games[room] = game
        }

        // Vinculamos la sala al jugador
        gameForPlayer[socket.id] = game
        game.onPlayerConnected(socket)
    })

    // Controles de ping
    socket.on("game:ping", () => {
        // Enviamos un ping al cliente
        socket.emit('game:pong', Date.now())
    })
    socket.on('game:pung', () => {
        // Recibimos el "pong" del cliente
    })
})

// Ponemos a la escucha el servidor
http.listen(process.env.PORT || conf.PORT, function () {
  console.log('listening on *:' + conf.PORT)
})

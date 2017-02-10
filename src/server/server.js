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

// Preparamos la gestion de los sockets
// TODO: Extraer a otro archivo
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

    // Recibimos alguna accion del jugador 
    socket.on('action', (inputs) => {
        const game = gameForPlayer[socket.id]
        if (game != null) game.onPlayerAction(socket, inputs)
    })

    // Desconectamos un jugador
    socket.on('disconnect', () => {
        const game = gameForPlayer[socket.id]
        if (game != null) game.onPlayerDisconnected(socket)
    })
})

// Preparamos el refresco de la logica para que se ejecute unas 20 veces por segundo (cada 50 ms)
setInterval(function () {
    for (let gameId in games) {
        const game = games[gameId]
        game.logic()
    }
}, 50)

// Ponemos a la escucha el servidor (http y sockets)
http.listen(process.env.PORT || conf.PORT, function () {
  console.log('listening on *:' + conf.PORT)
})

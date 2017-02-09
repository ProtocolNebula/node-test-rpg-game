const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
//const GameServer = require('./GameServer.js')
const conf = require('./../config.js')

// Servimos archivos solcitados que se encuentren en public
app.use(express.static('public'))

// Lista con las salas de juegos
const games = {}

// Sala asignada a cada jugador
const gameForPlayer = {} // socket.id => game


// Ponemos a la escucha el servidor
http.listen(process.env.PORT || conf.PORT, function () {
  console.log('listening on *:' + conf.PORT)
})

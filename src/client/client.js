/* globals requestAnimationFrame */
// Cargamos el cliente
const GameClient = require('./GameClient.js')

// Preparamos el canvas del juego y lo mostramos
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

// Cargamos el ID de la partida
const gameId = window.location.pathname
const game = new GameClient(gameid)

// Loop principal del juego
function mainLoop() {
    // Solicitamos al proximo frame la carga de esta funcioin
    requestAnimationFrame(mainLoop)
    game.logic()
    game.render(canvas, ctx)
}

// Iniciamos el loop
requestAnimationFrame(mainLoop)
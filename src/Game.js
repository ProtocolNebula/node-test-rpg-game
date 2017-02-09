/**
 * Clase principal del juego
 * Es extendida por el cliente y el servidor
 */
class Game {
    constructor(room) {
        this.room = room // Nombre de la sala

        // [POSX] => [POSY] => TIPO
        this.map = {} // Elementos estaticos del mapa (paredes, suelo...)
        this.players = {}
        this.items = {}
        this.bullets = {}
        this.mobs = {}
    }
}

module.exports = Game
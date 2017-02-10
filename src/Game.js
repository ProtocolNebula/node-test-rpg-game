/**
 * Clase principal del juego
 * Es extendida por el cliente y el servidor
 */
class Game {
    constructor(room) {
        this.room = room // Nombre de la sala
        this.lastLogic = Date.now() // Controles para deltatime

        // [POSX] => [POSY] => TIPO
        this.map = {} // Elementos estaticos del mapa (paredes, suelo...)
        this.players = {}
        this.items = {}
        this.bullets = {}
        this.mobs = {}
    }

    /**
     * Ejecuta la logica del juego (reutilizable en servidor y cliente para simulaciones)
     * El servidor o el cliente pueden requerir algunas acciones adicionales
     */
    logic() {
        console.log("parent logic")

        // Calculamos el timepo delta (el que ha pasado entre ahora y el ultimo refresco)
        const now = Date.now()
        const delta = now - this.lastLogic
        this.lastLogic = now

        // Calculamos el incremento de la velocidad segun delta
        const vInc = Conf.ACCEL * delta

        // Ejecutamos la logica de los jugadores
        this.logicFor(this.players)

        // Ejecutamos la logica de los mobs
        this.logicFor(this.mobs)
    }

    /**
     * Ejecuta la logica de assets genericos (jugadores, mobs...)
     * @param Asset[] listItems Listado de assets a ejecutar su logica
     */
    logicFor(listItems) {
        if (listItems.lenght > 0) {
            for (let id in listItems) {
                const asset = listItems[id]
                asset.logic()
            }
        }
    }


    /**
     * Funcion que spawnea mobs
     * No spawnea mas de X mobs por Chunk
     */
    spawnMobs() {
        
    }
}

module.exports = Game
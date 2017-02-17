/**
 * Clase principal del juego
 * Es extendida por el cliente y el servidor
 */
class Game {
  constructor (room) {
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
  logic () {
        // Calculamos el tiempo delta (el que ha pasado entre ahora y el ultimo refresco)
    const now = Date.now()
    const delta = now - this.lastLogic
    this.lastLogic = now
        // this.lastLogic = now

        // Ejecutamos la logica de los jugadores
        // this.logicFor(this.players, ACCEL * delta)
    this.logicFor(this.players, delta)

        // Ejecutamos la logica de los mobs
        // this.logicFor(this.mobs, ACCEL * delta)
    this.logicFor(this.mobs, delta)
  }

    /**
     * Ejecuta la logica de assets genericos (jugadores, mobs...)
     * @param Asset[] listItems Listado de assets a ejecutar su logica
     * @param numeric delta Delta time
     */
  logicFor (listItems, delta) {
    if (listItems) {
      for (let id in listItems) {
        const asset = listItems[id]
        asset.logic(delta)
      }
    }
  }

    /**
     * Funcion que spawnea mobs
     * No spawnea mas de X mobs por Chunk
     */
  spawnMobs () {

  }
}

module.exports = Game

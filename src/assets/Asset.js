/**
 * Clase que debe ser extendida por todos los objetos interactuables (jugadores, items, mobs...)
 * Debe usarse como interface más que una clase padre. Puede contener codigo de funcionalidades genericas o por defecto
 */
class Asset {

  constructor () {
        // Coords
    this.x = 0
    this.y = 0
    this.vx = 0
    this.vy = 0
  }

    /**
     *  Ejecuta la logica del elemento (moverse...)
     * @param numeric delta
     * @param numeric vInc incremento del asset en este movimiento (ACCEL * DELTA)
     */
  logic (delta, vInc) {

  }

    /**
     * Asigna x propiedades recibidas externamente al objeto
     */
  updateWithProps (obj) {
    for (let prop in obj) {
      this[prop] = obj[prop]
    }
  }
}

module.exports = Asset

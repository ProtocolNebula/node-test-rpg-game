const Asset = require('./Asset.js')
const randomColor = require('randomcolor')

class Entity extends Asset {
  constructor (name) {
    super()

    // Server and actions
    // Display on map
    this.color = randomColor()
    this.name = name

    // Default status entity
    this.hp = 0
    this.atk = 0
    this.def = 0
    this.lvl = 1
  }

  /**
   * Calculamos las nuevas posiciones de los elementos
   * @param numeric delta
   */
  logic (delta) {
    // super.logic(delta, vInc)
  }

  /**
   * Ejecuta la parte logica del movimiento de una entidad
   * @param numeric delta
   * @param numeric vInc incremento del asset en este movimiento (ACCEL * DELTA)
   */
  moveEntity (delta, vInc) {
    this.x += this.vx * delta
    this.y += this.vy * delta
  }

  /**
   * Recibe daño de otra Entity
   * @param fromObj Entity que ejecuta el golpe
   * @return Daño recibido
   */
  getDamage (fromObj) {
    let dmg = fromObj.atk - this.def // Como minimo haremos 1 de daño
    if (dmg < 1) dmg = 1

    this.hp -= dmg

    return dmg
  }

  /**
   * Comprueba si la entidad sigue viva
   * Debe llamarse desde la logica / getDamage de donde se extiende
   */
  stillAlive () {
    return (this.hp > 0)
  }
}

module.exports = Entity

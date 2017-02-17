const Entity = require('./Entity.js')
const { ACCEL, MAX_SPEED } = require('../config.js')

class Player extends Entity {
  constructor (id, name) {
    super(name) // Asignamos el nombre
    // Server and actions
    this.id = id
    this.inputs = {
      LEFT_ARROW: false,
      RIGHT_ARROW: false,
      UP_ARROW: false,
      DOWN_ARROW: false
    }

    // Coords
    this.direction = 1
    this.x = 200
    this.y = 200

    // Status player
    this.hp = 30
    this.atk = 5
    this.def = 5
    this.lvl = 1
    this.exp = 0
  }

  /**
   * Actualiza los inputs recibidos por el jugador
   */
  updateInputs (inputs) {
    this.updateMoves() // Actualizamos la posicion/accion del personaje
    this.inputs = inputs // Seteamos los inputs
    this.calculateAcceleration() // Calculamos la nueva aceleracion del personaje
  }

  updatePlayer (player) {
    for (let k in player) {
      this[k] = player[k]
    }
  }

  /**
   * Calcula la aceleracion que deberia tener
   * el personaje en funcion de los inputs activos
   */
  /* caclulateAcceleration () {
    const inputs = this.inputs

    let ax = 0
    let ay = 0

    // Cantidad de desplazamiento Izquierda / Derecha (con friccion)
    if (inputs.LEFT_ARROW) this.ax = -ACCEL
    else if (inputs.RIGHT_ARROW) this.ax = ACCEL
    else if (this.vx > 0) this.vx -= Math.max(0, vInc)
    else if (this.vx < 0) this.vx += Math.min(0, vInc)

    // Cantidad de desplazamiento Arriba / Abajo (con friccion)
    if (inputs.UP_ARROW) this.vy -= vInc
    else if (inputs.DOWN_ARROW) this.vy += vInc

    this.ax = ax
    this.ay = ay
  } */

  /**
   * TODO: Optimizar funcion
   * Ejecutamos la logica del jugador, entre otros las acciones de los inputs recibidos
   * Despues ejecutamos "moveEntity" para que se aplique la logica
   * @param numeric delta
   */
  logic (delta) {
    const vInc = ACCEL * delta
    console.log(delta)
    super.logic(delta, vInc)
    const inputs = this.inputs

    // Aplicamos los cambios de los input:

    // Cantidad de desplazamiento Izquierda / Derecha (con friccion)
    if (inputs.LEFT_ARROW) this.vx -= vInc
    else if (inputs.RIGHT_ARROW) this.vx += vInc
    else if (this.vx > 0) this.vx = Math.max(0, this.vx - vInc)
    else if (this.vx < 0) this.vx = Math.min(0, this.vx + vInc)

    // Cantidad de desplazamiento Arriba / Abajo (con friccion)
    if (inputs.UP_ARROW) this.vy -= vInc
    else if (inputs.DOWN_ARROW) this.vy += vInc
    else if (this.vy > 0) this.vy = Math.max(0, this.vy - vInc)
    else if (this.vy < 0) this.vy = Math.min(0, this.vy + vInc)

    if (this.vx < -MAX_SPEED) this.vx = -MAX_SPEED
    else if (this.vx > MAX_SPEED) this.vx = MAX_SPEED

    if (this.vy < -MAX_SPEED) this.vy = -MAX_SPEED
    else if (this.vy > MAX_SPEED) this.vy = MAX_SPEED

    // Ejecutamos el movimiento del player
    this.moveEntity(delta)
  }

  getDamage (fromObj) {
    let dmg = super.getDamage(fromObj)
    console.log('El jugador ' + this.name + ' recibe un golpe de ' + dmg + ' de daño de ' + fromObj.name)
    if (!super.stillAlive()) {
      console.log('El jugador ' + this.name + ' ha muerto')
    }
  }
}

module.exports = Player

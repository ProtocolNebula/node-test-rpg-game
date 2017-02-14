const Entity = require('./Entity.js')
const { ACCEL } = require('../config.js')

class Player extends Entity {
  constructor (socket) {
    super(socket.id) // Asignamos el nombre

    // Server and actions
    this.id = socket.id
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

  /**
   * Calcula la aceleracion del jugador en funcion
   * de los inputs activos
   */
  caclulateAcceleration () {
    const inputs = this.inputs
    let ax = 0
    let ay = 0
    if (inputs.LEFT_ARROW) ax -= ACCEL
    if (inputs.RIGHT_ARROW) ax += ACCEL
    if (inputs.UP_ARROW) ay -= ACCEL
    if (inputs.DOWN_ARROW) ay += ACCEL

    this.ax = ax
    this.ay = ay
  }

  updateMoves() {

  }
  
  /**
   * Ejecutamos la logica del jugador, entre otros los inputs recibidos
   * Despues ejecutamos "moveEntity" para que se aplique la logica
   * @param numeric delta
   * @param numeric vInc incremento del asset en este movimiento (ACCEL * DELTA)
   */
  logic (delta, vInc) {
    super.logic(delta, vInc)
    const inputs = this.inputs

    // Aplicamos los cambios de los input:

    // Cantidad de desplazamiento Izquierda / Derecha (con friccion)
    if (inputs.LEFT_ARROW) this.vx -= vInc
    else if (inputs.RIGHT_ARROW) this.vx += vInc
    else if (this.vx > 0) this.vx -= Math.max(0, vInc)
    else if (this.vx < 0) this.vx += Math.min(0, vInc)

    // Cantidad de desplazamiento Arriba / Abajo (con friccion)
    if (inputs.UP_ARROW) this.vy -= vInc
    if (inputs.DOWN_ARROW) this.vy += vInc
    else if (this.vy > 0) this.vy -= Math.max(0, vInc)
    else if (this.vy < 0) this.vy += Math.min(0, vInc)

    // Ejecutamos el movimiento del player
    super.moveEntity(delta, vInc)
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

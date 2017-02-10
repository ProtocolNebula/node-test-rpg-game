const Asset = require('./Asset.js')

class Player extends Asset {
    constructor(socket) {
        // Server and actions
        this.id = socket.id
        this.inputs = {
            LEFT_ARROW: false,
            RIGHT_ARROW: false,
            UP_ARROW: false,
            DOWN_ARROW: false
        }

        // Display on map
        this.color = randomColor()
        this.name = socket.id

        // Coords
        this.direction = 1
        this.x = 200
        this.y = 200
        this.vx = 0
        this.vy = 0
        
        // Status player
        this.hp = 30
        this.atk = 5
        this.def = 5
        this.lvl = 1
        this.exp = 0
    }

    logic() {
        const inputs = this.inputs

        if (inputs.LEFT_ARROW) this.vx -= vInc
        if (inputs.RIGHT_ARROW) this.vx += vInc
        if (inputs.UP_ARROW) this.vy -= vInc
        if (inputs.DOWN_ARROW) this.vy += vInc

        this.x += this.vx * delta
        this.y += this.vy * delta
    }
}

module.exports = Player
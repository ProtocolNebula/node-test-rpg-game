class Player {
    constructor(socket) {
        // Server and actions
        this.socket = socket
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
}

module.exports = Player
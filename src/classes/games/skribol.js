const log = require('../../services/logging')
class Skribol {
    constructor(gameServer) {
        this.gameServer = gameServer
        this.rounds = 3
        this.timePerRound = 30
        this.currentRound = 1
        this.currentPlayer = this.gameServer.players[0],
        this.currentPlayerStatus = "choosing-word"
        log.info('Skribol.js', 'Skribol game started !')
        this.start()
        
    }
    start() {
        let gameState = { ...this.info(), ...this.gameServer.info()}
        this.gameServer.players.forEach(player => {
            player.socket.emit('startGame', gameState)
        })
        this.startTurn(this.currentPlayer)
    }
    startTurn(player) {
        this.listen(player)
        this.currentPlayer.socket.emit('choose-word', ["parachute", "clavier", "soleil"])
    }
    info() {
        return {
            rounds: this.rounds,
            timePerRound: this.timePerRound,
            currentRound: this.currentRound,
            currentPlayer: this.currentPlayer.sid
        }
    }
    listen(currentPlayer) {
        currentPlayer.socket.on('skribol-startPath', (data) => {
            this.gameServer.emitToAllExcept(currentPlayer.sid, 'skribol-startPath', data)
        })
        currentPlayer.socket.on('skribol-continuePath', (data) => {
            this.gameServer.emitToAllExcept(currentPlayer.sid, 'skribol-continuePath', data)
        })
        currentPlayer.socket.on('skribol-endPath', (data) => {
            this.gameServer.emitToAllExcept(currentPlayer.sid, 'skribol-endPath', data)
        })
    }
}
module.exports = Skribol
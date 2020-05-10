const log = require('../../services/logging')
const moment = require('moment')
class Skribol {
    constructor(gameServer) {
        this.gameServer = gameServer
        this.rounds = 3
        this.timePerRound = 30
        this.currentRound = 1
        this.currentPlayer = this.gameServer.players[0],
        this.currentPlayerStatus = "choosing-word"
        this.currentPlayerWord = ""
        this.timeouts = []
        log.info('Skribol.js', 'Skribol game started !')
        this.start()
        
    }
    start() {
        let gameState = { ...this.info(), ...this.gameServer.info()}
        this.gameServer.players.forEach(player => {
            player.socket.emit('startGame', gameState)
        })
        this.waitForPlayers()
    }
    waitForPlayers() {
        let force = setTimeout(() => {
            console.log("Not all players are ready, force")
            this.startTurn(this.currentPlayer)
        }, 10000)
        this.gameServer.players.forEach(player => {
            player.socket.on('skribol-ready', () => {
                player.gameReady = true
                console.log("ONE READY")
                if(this.gameServer.players.filter(item => item.gameReady === false).length === 0){
                    clearTimeout(force)
                    this.startTurn(this.currentPlayer)
                }
            })
        })
    }
    startTurn(player) {
        this.listen(player)
        let wordList = ["parachute", "clavier", "soleil"]
        console.log(this.currentPlayer.id)
        this.currentPlayer.socket.emit('skribol-chooseWord', wordList)
        let force = setTimeout(() => {
            console.log("Player didn't choose a word, selecting word " + wordList[0])
            this.currentPlayerWord = wordList[0]
            this.startDrawing()
        }, 15000)
        this.currentPlayer.socket.on('skribol-chooseWord', (data) => {
            clearTimeout(force)
            if(wordList.includes(data)){
                this.currentPlayerWord = data
            }
            else {
                this.currentPlayerWord = wordList[0]
            }
            this.startDrawing()
        })
        
    }
    startDrawing() {
        this.startTime = moment()
        this.timeouts.push(setTimeout(this.endDrawing.bind(this), this.timePerRound * 100));
        this.currentPlayer.socket.emit('skribol-word', this.currentPlayerWord)
        let hint = this.currentPlayerWord.replace(/[a-zA-Z]/g, '_')
        this.revealLetter(hint)
    }
    endDrawing() {
        this.startTime = null;
        //Attribution des points ?
        this.gameServer.emitToAll('skribol-endDrawing', this.currentPlayerWord)

    }
    revealLetter(hint) {
        this.gameServer.emitToAllExcept(this.currentPlayer.sid, 'skribol-hint', hint)
        let letters = this.currentPlayerWord.split('')
        let newHint = hint.split('')
        let found = false
        let iteration = 0;
        while(!found){
            let rand = Math.floor(Math.random() * letters.length);
            if(newHint[rand] === "_"){
                newHint[rand] = letters[rand]
                console.log(newHint.join(""))
                found = true
            }
            iteration++;
            if(iteration === 20) break
        }
        this.timeouts.push(setTimeout(this.revealLetter.bind(this, newHint.join('')), 15000))
        if(newHint.findIndex(item => item === "_") === -1){
            this.destroy()
        }
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
    destroy() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        })
    }
}
module.exports = Skribol
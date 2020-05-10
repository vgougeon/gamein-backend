const io = require('../../io');
const pool = require('../database/db');
const exp = require('../config/experience.json')
const moment = require('moment')
const crypto = require('crypto')
const Skribol = require('./games/skribol')

class GameServer {
    constructor(game, maxPlayers, owner = null) {
        this.id = crypto.randomBytes(2).toString('hex');
        this.gameInstance = null
        this.game = game
        this.owner = owner
        this.playing = false
        this.players = []
        this.maxPlayers = maxPlayers
    }
    serverListInfo() {
        return { 
            id: this.id,
            game: this.game,
            playing: this.playing,
            owner: this.owner, 
            players: this.players.map(player => player.info()), 
            maxPlayers: this.maxPlayers 
        }
    }
    info() {
        return { 
            id: this.id,
            game: this.game,
            owner: this.owner, 
            players: this.players.map(player => player.info()), 
            maxPlayers: this.maxPlayers 
        }
    }
    addPlayer(socket) {
        const socketServer = require('./socketServer')
        let player = socketServer.getClientBySid(socket.id)
        if(!player) return socket.emit('joinServer', { error: "not-logged-in"})
        if(this.players.find(item => ((item.sid === player.sid) || (item.id === player.id)))) {
            return socket.emit('joinServer', { error: "already-playing"})
        }
        if(this.players.length >= this.maxPlayers) {
            return socket.emit('joinServer', { error: "server-full"})
        }
        this.players.forEach(item => {
            item.socket.emit('newPlayer', player.info())
        })
        this.players.push(player)
        if(this.players.length === 1){
            this.owner = player.sid
        }
        this.events(player)
        socket.emit('joinServer', this.info())
        socketServer.updateServers()
    }
    removePlayer(player) {
        const socketServer = require('./socketServer')
        console.log("Left the game")
        
        this.players = this.players.filter(item => item.sid !== player.sid)
        if(player.sid === this.owner) {
            if(this.players.length >= 1) {
                this.owner = this.players[0].sid
            }
            else {
                this.owner = null
            }
        }
        this.players.forEach(item => {
            item.socket.emit('playerLeft', player.id)
        })

        if(this.players.length === 0){
            this.gameInstance.destroy()
            this.gameInstance = null;
            this.playing = false
        }
        socketServer.updateServers()
    }
    startGame(player) {
        const socketServer = require('./socketServer')
        if(player.sid !== this.owner) return false
        switch(this.game){
            case "Skribol":
                this.playing = true
                this.gameInstance = new Skribol(this)
                socketServer.updateServers()
                break
        }
    }
    emitToAllExcept(sid, event, data) {
        this.players.forEach(player => {
            if(player.sid !== sid) player.socket.emit(event, data)
        })
    }
    emitToAll(event, data) {
        this.players.forEach(player => {
            player.socket.emit(event, data)
        })
    }
    events(player) {
        player.socket.on('disconnect', this.removePlayer.bind(this, player))
        player.socket.on('leaveServer', this.removePlayer.bind(this, player))
        player.socket.on('startGame', this.startGame.bind(this, player))
    }
}
module.exports = GameServer;
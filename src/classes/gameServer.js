const io = require('../../io');
const pool = require('../database/db');
const exp = require('../config/experience.json')
const moment = require('moment')
const crypto = require('crypto')

class GameServer {
    constructor(game, maxPlayers, owner = "Gamein") {
        this.id = crypto.randomBytes(2).toString('hex');
        this.game = game
        this.owner = owner
        this.players = []
        this.maxPlayers = maxPlayers
    }
    serverListInfo() {
        return { 
            id: this.id,
            game: this.game,
            owner: this.owner, 
            players: this.players, 
            maxPlayers: this.maxPlayers 
        }
    }
}
module.exports = GameServer;
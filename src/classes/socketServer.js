const io = require('../../io');
const pool = require('../database/db');
const log = require('../services/logging');
const Client = require('./socketClient');

class SocketServer {
    constructor() {
        this.clients = []
        this.run()
    }

    run() {
        log.info("INIT", "Socket server online")
    }

    async newClient(socket, user) {
        let info = await this.refreshInformation(user.id)
        this.clients.push(new Client(socket.id, info))
        log.info("SOCKET", "New logged in client !", info.username)
    }
    async refreshInformation(id) {
        const [{0: user}] = await pool.execute(`
        SELECT id, display_name, avatar, username, experience, grade, money FROM accounts
        WHERE id = ${id}
        `)
        return user
    }
    getClients(userId) {
        console.log(this.clients)
        return this.clients.filter(item => item.id === userId)
    }
}
const socketServer = new SocketServer();
module.exports = socketServer;
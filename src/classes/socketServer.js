const io = require('../socket/socket');
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
        log.info("INIT", "New client !")
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
 
socketServer = new SocketServer();
module.exports = socketServer;
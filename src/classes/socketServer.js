const io = require('../../io');
const pool = require('../database/db');
const log = require('../services/logging');
const Client = require('./socketClient');

class SocketServer {
    constructor() {
        this.clients = []
        log.info("INIT", "Socket server online")
        setInterval(() => this.run(), 30000);
        
    }

    run() {
        const unique = [...new Set(this.clients.map(item => item.data.username))];
        let list = []
        unique.forEach(client => list.push(client))
        log.info("SOCKET", list.join(' - '), "Client list")
        
    }
    async newClient(socket, user) {
        let info = await this.refreshInformation(user.id)
        this.clients.push(new Client(socket.id, info))
        log.info("SOCKET", "One more client, " + this.clients.length + " online now", info.username)
    }
    async removeClient(socket) {
        let client = await this.getClientBySid(socket.id)
        if(!client) return false;
        log.info("SOCKET", "One client left, " + (this.clients.length - 1) + " online now", client.username)
        let sclient = this.clients.find(item => item.sid === socket.id)
        sclient.destroy()
        this.clients = this.clients.filter(item => item.sid !== socket.id);
    }
    async refreshInformation(id) {
        const [{0: user}] = await pool.execute(`
        SELECT id, display_name, avatar, username, experience, grade, money, last_seen FROM accounts
        WHERE id = ${id}
        `)
        return user
    }
    getClients(userId) {
        return this.clients.filter(item => item.id === userId)
    }
    getClientBySid(sid){
        return this.clients.find(item => item.sid === sid)
    }
}
const socketServer = new SocketServer();
module.exports = socketServer;
const io = require('../../io');
const pool = require('../database/db');
const exp = require('../config/experience.json')
const moment = require('moment')
class SocketClient {
    constructor(sid, data, socket) {
        this.sid = sid
        this.socket = socket
        this.id = data.id
        this.data = data
        this.cooldowns = []
        this.timeout = setTimeout(this.check.bind(this), 1500)
        this.gameReady = false
        this.events()
    }
    events(){
        console.log("Hello")
        const socketServer = require('./socketServer')
        this.socket.on('joinServer', socketServer.joinServer.bind(socketServer, this.socket))
    }
    info() {
        return {
            ...this.data, sid: this.sid
        }
    }
    destroy() {
        clearTimeout(this.timeout)
    }
    check() {
        this.updateLastSeen()
        this.timeout = setTimeout(this.check.bind(this), 61000)
    }
    updateLastSeen() {
        
        let xp = 0
        let reason = ""
        if(moment().date() !== moment(this.data.last_seen).date()){
            xp = 15
            reason = "last-seen-1d"
        }
        else if(!moment(this.data.last_seen).isAfter(moment().subtract(10, 'minutes'))){
            xp = 1
            reason = "last-seen-10m"
        }
        if(xp) {
            this.data.last_seen = moment();
            this.addXp(xp, reason)
            pool.execute(`
            UPDATE accounts
            SET last_seen = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [this.id])
        }
        
    }
    checkCooldown(reason, id){
        let row = this.cooldowns.find(item => item.reason === reason)
        if(row) {
            if(row.ids.includes(id)){
                //Anti spam
                return false
            }
            else {
                if(id !== null) row.ids.push(id)
            }
            if(row.amount < (exp[reason] && exp[reason].amount || 1)) {
                //Xp disponible pour cette action
                row.amount += 1
                row.date = moment()
                return true
            }
            if(!moment(row.date).isAfter(moment().subtract(exp[reason] && exp[reason].cooldown || 0, 'seconds'))) {
                //Plus d'xp dispo mais assez attendu, accepter et reset
                if(row.ids.findIndex(item => item === id) !== -1) return false
                row.amount = 1
                row.date = moment()
                return true
            }
            else {
                //Plus d'xp disponible pour cette action, refuser
                return false
            }
        }
        if(!row) {
            let n = { reason: reason, date: moment(), amount: 1, ids: []}
            if(id !== null) n.ids.push(id)
            this.cooldowns.push(n)
            //L'entrée n'existe pas, créer et accepter
        }
        return true
    }
    addXp(amount, reason, id = null) {
        if(!this.checkCooldown(reason, id)) return false
        io.to(this.sid).emit('addXp', {amount: amount, reason: reason});
        pool.execute(`
            UPDATE accounts
            SET experience = experience + ?
            WHERE id = ?`,
            [amount, this.id])
    }
}
 
module.exports = SocketClient;
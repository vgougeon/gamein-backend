const io = require('../../io');
const pool = require('../database/db');
const moment = require('moment')
class SocketClient {
    constructor(sid, data) {
        this.sid = sid
        this.id = data.id
        this.data = data
        this.timeout = setTimeout(this.check.bind(this), 1500)
        
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

    addXp(amount, reason) {
        io.to(this.sid).emit('addXp', {amount: amount, reason: reason});
        pool.execute(`
            UPDATE accounts
            SET experience = experience + ?
            WHERE id = ?`,
            [amount, this.id])
    }
}
 
module.exports = SocketClient;
const io = require('../socket/socket');
class SocketClient {
    constructor(sid, data) {
        this.sid = sid
        this.id = data.id
        this.data = data
    }

    addXp(amount) {
        // io.to(this.sid).emit('addXp', amount);
    }
}
 
module.exports = SocketClient;
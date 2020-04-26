const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const redis = require('../database/redis');
const log = require('../services/logging');
require('../services/validationsocket')();
const root = (server) => {
    const io = require('socket.io')(server);

    io.on('connection', async function (socket) {
        let user = await socketValidation(socket.handshake.query['auth'])
        if(!user){ return false }
        const [{0: userInformation}] = await pool.execute(`
        SELECT id, display_name, avatar, username FROM accounts
        WHERE id = ${user.id}
        `)
        redis.set(user.id, socket.id, 'EX', 12000, redis.print);
        redis.set(socket.id, user.id, 'EX', 12000, redis.print);
        log.info("SOCKET root.js", "new socketId : " + socket.id , userInformation.username)
        userInformation.socketId = socket.id
        require('./chat')(socket, io)
    })
    
}
module.exports = root
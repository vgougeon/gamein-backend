const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const log = require('../services/logging');
require('../services/validationsocket')();
const root = (server) => {
    const io = require('socket.io')(server);

    let users = []
    io.on('connection', async function (socket) {
        let user = await socketValidation(socket.handshake.query['auth'])
        if(!user){ return false }
        const [{0: userInformation}] = await pool.execute(`
        SELECT id, display_name, avatar, username FROM accounts
        WHERE id = ${user.id}
        `)
        log.info("SOCKET root.js", "new socketId : " + socket.id , userInformation.username)
        userInformation.socketId = socket.id
        users.push(userInformation)
        require('./chat')(socket, io, users)
    })
    
}
module.exports = root
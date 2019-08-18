const jwt = require('jsonwebtoken');
const pool = require('../database/db')
require('../services/validationsocket')();
const root = (server) => {
    const io = require('socket.io')(server);

    let users = []
    io.on('connection', async function (socket) {
        console.log('User trying to connect via socket...')
        let user = await socketValidation(socket.handshake.query['auth'])
        console.log('Check TOKEN:')
        console.log(user)
        if(!user){ return false }
        const [{0: userInformation}] = await pool.execute(`
        SELECT id, display_name, avatar FROM accounts
        WHERE id = ${user.id}
        `)
        userInformation.socketId = socket.id
        users.push(userInformation)
        require('./chat')(socket, io, users)
        
    })
    
}
module.exports = root
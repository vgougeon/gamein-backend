const io = require('../../io')
const log = require('../services/logging')
const socketServer = require('../classes/socketServer');
require('../services/validationsocket')();

io.on('connection', async function (socket) {
    let user = await socketValidation(socket.handshake.query['auth'])
    if(user){
        socketServer.newClient(socket, user)
    }
    const signIn = async (socket, data) => {
        let user = await socketValidation(data.auth)
        if(user) socketServer.newClient(socket, user)
    }
    socket.on('signIn', signIn.bind(null, socket))
    socket.on('signOut', socketServer.removeClient.bind(socketServer, socket))
    socket.on('disconnect', socketServer.removeClient.bind(socketServer, socket))
    
    // require('./chat')(socket, io)
})
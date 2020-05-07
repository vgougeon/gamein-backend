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
    socket.emit('ready', socket.id)
    socket.on('signIn', signIn.bind(null, socket))
    socket.on('signOut', socketServer.removeClient.bind(socketServer, socket))
    socket.on('disconnect', socketServer.removeClient.bind(socketServer, socket))
    socket.on('getServers', socketServer.getServers.bind(socketServer, socket))
    socket.on('joinPartyPage', () => { socket.join('party'); console.log('join partypage')})
    socket.on('leavePartyPage', () => { socket.leave('party'); console.log('leave partypage')})
    // require('./chat')(socket, io)
})
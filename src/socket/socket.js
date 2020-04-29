const io = require('../../io')
const log = require('../services/logging')
const socketServer = require('../classes/socketServer');
require('../services/validationsocket')();

io.on('connection', async function (socket) {
    let user = await socketValidation(socket.handshake.query['auth'])
    if(!user){ return false }
    
    socketServer.newClient(socket, user)
    log.info("SOCKET", "Just connected : " + socket.id)
    // require('./chat')(socket, io)
})
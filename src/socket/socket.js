const app = require('../../index');
const io = module.exports = require('socket.io')(app);
const socketServer = require('../classes/socketServer');
require('../services/validationsocket')();
io.on('connection', async function (socket) {
    let user = await socketValidation(socket.handshake.query['auth'])
    if(!user){ return false }
    socketServer.newClient(socket, user)
    // log.info("SOCKET root.js", "new socketId : " + socket.id , userInformation.username)
    // require('./chat')(socket, io)
})
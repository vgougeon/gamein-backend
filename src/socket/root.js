const root = (server) => {

    const io = require('socket.io')(server);

    io.on('connection', function (socket) {
        require('./chat')(socket, io)
    })
    
}
module.exports = root
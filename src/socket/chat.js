const chat = (socket, io) => {

    socket.on('new-message', function (data) {
        io.emit('new', data);
    });

}

module.exports = chat
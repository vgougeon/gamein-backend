const log = require('../services/logging');
const chat = (socket, io) => {

    socket.on('new-message', function (data) {
        // Check if user is referenced in redis

        // let msg = {
        //     userId: user.id,
        //     target: data.to,
        //     username: user.display_name,
        //     message:data.message,
        //     avatar: user.avatar
        // }
        // log.info("SOCKET chat.js", "Sent a message : " + data.message, user.display_name)
        // io.emit('new', msg);
    });

}

module.exports = chat
const log = require('../services/logging');
const pool = require('../database/db');
const chat = (socket, io) => {

    socket.on('new-message', async function (data) {
        // Check if user is referenced in redis
        // await pool.execute(`
        // INSERT INTO like_post (account_id, post_id)
        // VALUES (?, ?)`,
        // [user.id, req.body.id])
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
const chat = (socket, io, users) => {

    socket.on('new-message', function (data) {
        let user;
        for(let u of users){
            if(u.socketId === socket.id){
                user = u
            }
        }
        let msg = {
            userId: user.id,
            target: data.to,
            username: user.display_name,
            message:data.message,
            avatar: user.avatar
        }
        console.log("[SOCKET/Chat.js]" + user.display_name + " : " + data.message)
        io.emit('new', msg);
    });

}

module.exports = chat
const chat = (socket, io, users) => {

    socket.on('new-message', function (data) {
        let user;
        for(let u of users){
            if(u.socketId === socket.id){
                user = u
            }
        }
        let msg = {
            username: user.display_name,
            message:data.message,
            avatar: user.avatar
        }
        io.emit('new', msg);
    });

}

module.exports = chat
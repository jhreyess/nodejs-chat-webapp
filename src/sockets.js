module.exports = function(io){

    let nicknames = [];

    io.on('connection', socket =>{

        socket.on('new user', (nick, callback)=>{
            if(nicknames.indexOf(nick) != -1){
                callback(false);
            }else{
                callback(true);
                console.log(`[server] New user connected: ${nick}`);
                socket.nickname = nick;
                io.sockets.emit('conected', socket.nickname);
                nicknames.push(socket.nickname);
                io.sockets.emit('usernames', nicknames);
            }
        }); 

        socket.on('send message', data =>{
            io.sockets.emit('new message', {
                msg: data,
                user: socket.nickname
            });
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            console.log(`[server] ${socket.nickname} has disconnected`);
            io.sockets.emit('disconected', socket.nickname);
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            io.sockets.emit('usernames', nicknames);
        });
    });
}


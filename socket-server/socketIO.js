const mongoose = require("../express-server/database");
const { Users } = require("../express-server/config")
const http = require('http');
const socketIO = require('socket.io');

const PORT = 3000;
const Server = http.createServer();
const io = socketIO(Server, {
    cors: {
        origin: 'http://localhost:8000',
        method: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('login', async (username) => {
        const onlineQuery = Users.find({online: true});
        const onlineUsers = await onlineQuery.countDocuments();
        const user = await Users.findOneAndUpdate({ username }, { online: true }, { new: true });
        if (user.online) {
            io.emit('userStatus', { username, online: true });
            io.emit('updateUserCount', onlineUsers);
        }
    });

    socket.on('chat', (data) => {
        io.emit('chat', { message: data.message, username: data.username });
    });

    socket.on('logout', async (username) => {
        const onlineQuery = Users.find({online: true});
        const onlineUsers = await onlineQuery.countDocuments();
        const user = await Users.findOneAndUpdate({ username }, { online: false }, { new: true });
        if (user.online) {
            io.emit('userStatus', { username, online: false });
            io.emit('updateUserCount', onlineUsers);
        }
    });
});

Server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});
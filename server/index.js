const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 5000

const router = require('./router')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors());


//arg socket is client insatnce 
io.on('connection',(socket)=>{

    socket.on('join', ({ name, room}, callback) => {
        const {error, user} = addUser({ id : socket.id, name, room});

        //to trigger response (error handling)
        if(error) return callback(error);

        //to tell current user
        //emit event from backend to front end
        socket.emit('message',{ user:'admin', text:`${user.name}, welcome to room ${user.room}`})

        //to everyone else in room
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text:`${user.name}, has joined!`});

        socket.join(user.room);

        io.to(user.room).emit('roomData',{ room: user.room, users: getUsersInRoom(user.room)})

        callback();
    });

    //waiting for frontend to send event
    socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        //to-do something after message is send on frontend
        callback();
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',{ user:'admin', text:`${user.name} has left.`});
        }
    });
});


server.listen(PORT, () => console.log(`server has started on port ${PORT}`));
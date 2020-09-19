const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//arg socket is client insatnce 
io.on('connection',(socket)=>{

    console.log('We have a new connection!!!');

    socket.on('join', ({ name, room}, callback) => {
        console.log(name, room);

        //to trigger response (error handling)
        callback();
    });

    socket.on('disconnect',()=>{
        console.log('user had left!!!');
    });
});

app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`));
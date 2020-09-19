import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'

let socket;

//location come from react-router give prop called location
const Chat = ({ location }) =>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const ENDPOINT = 'localhost:5000';


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, ()=>{});
        
        //for component unmount
        return () => {
            socket.emit('disconnect');

            //to turn of one chat instance 
            socket.off();
        }

    },[ENDPOINT, location.search])

    return(
        <h1>Chat</h1>
    )
}
export default Chat;
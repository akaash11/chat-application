import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InforBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import UserContainer from '../UserContainer/UserContainer';

let socket;

//location come from react-router give prop called location
const Chat = ({ location }) =>{
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    const ENDPOINT = 'https://at-chat-application.herokuapp.com/';


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

    useEffect(()=>{
        socket.on('message',(message)=> { 
            setMessages([...messages, message]);
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    },[messages])

    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault();        

        if(message){
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)
    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />      
            </div>    
            {/* <UserContainer users={users} /> */}
        </div>   
    )
}
export default Chat;
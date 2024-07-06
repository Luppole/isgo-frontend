import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import { sendDirectMessage, fetchDirectMessages } from './api';
import './Chat.css';

const Chat = ({ username, otherUsername, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    fetchMessages();

    socketRef.current = io('https://isgoserver.ddns.net');
    socketRef.current.emit('join', { username, otherUsername });

    socketRef.current.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username, otherUsername]);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await fetchDirectMessages(username, otherUsername);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: username,
      receiver: otherUsername,
      message,
      created_at: new Date().toISOString()
    };

    try {
      await sendDirectMessage(newMessage.sender, newMessage.receiver, newMessage.message);
      socketRef.current.emit('sendMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Draggable handle=".chat-header">
      <div className="chat-container">
        <div className="chat-header">
          <h3>Chat with {otherUsername}</h3>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
              <span className="sender">{msg.sender}</span>
              <p>{msg.message}</p>
              <span className="timestamp">{formatTime(msg.created_at)}</span>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </Draggable>
  );
};

export default Chat;

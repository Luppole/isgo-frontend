import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('https://isgoserver.ddns.net');

const Chat = ({ otherUsername, onClose }) => {
  const { username } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://isgoserver.ddns.net/direct-messages/${username}/${otherUsername}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [username, otherUsername]);

  useEffect(() => {
    socket.emit('join', { username, otherUsername });

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [username, otherUsername]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = { sender: username, receiver: otherUsername, message };
      try {
        console.log('Sending message:', newMessage); // Added logging
        await axios.post('https://isgoserver.ddns.net/direct-messages/send', newMessage);
        setMessage('');
        socket.emit('sendMessage', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data); // Log the server response data
        }
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat with {otherUsername}</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

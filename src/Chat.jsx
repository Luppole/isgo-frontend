import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Draggable from 'react-draggable';
import { fetchDirectMessages, sendDirectMessage } from './api';
import './Chat.css';

const socket = io('https://isgoserver.ddns.net');

const Chat = ({ username, otherUsername, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetchDirectMessages(username, otherUsername);
        setMessages(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [username, otherUsername]);

  const handleSendMessage = async () => {
    const message = { sender: username, receiver: otherUsername, message: newMessage, created_at: new Date().toISOString() };
    try {
      await sendDirectMessage(username, otherUsername, newMessage);
      socket.emit('send_message', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.toLocaleDateString()}`;
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
              <span className="timestamp">{formatDate(msg.created_at)}</span>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </Draggable>
  );
};

export default Chat;

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('https://isgoserver.ddns.net');

const Chat = ({ username, otherUsername, closeChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://isgoserver.ddns.net/direct-messages/${username}/${otherUsername}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Join the user to a room for real-time messaging
    socket.emit('join', { username });

    // Listen for new messages
    socket.on('newMessage', (message) => {
      if (message.sender === otherUsername || message.sender === username) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [username, otherUsername]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      sender: username,
      receiver: otherUsername,
      message: newMessage.trim()
    };

    try {
      await fetch('https://isgoserver.ddns.net/direct-messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Chat with {otherUsername}</span>
        <button className="close-button" onClick={closeChat}>X</button>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === username ? 'sent' : 'received'}`}
          >
            <span className="sender">{msg.sender}</span>
            {msg.message}
            <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ username, otherUsername }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, [otherUsername]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://isgoserver.ddns.net/direct-messages/${username}/${otherUsername}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://isgoserver.ddns.net/direct-messages/send', {
        sender: username,
        receiver: otherUsername,
        message,
      });
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
            <span>{msg.sender}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="send-message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;

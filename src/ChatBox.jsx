import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatBox.css';

const socket = io('https://isgoserver.ddns.net');

const ChatBox = ({ classId, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join', classId);

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://isgoserver.ddns.net/messages/${classId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      socket.off('receiveMessage');
    };
  }, [classId]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { classId, username, message };
      socket.emit('sendMessage', newMessage);

      axios.post('https://isgoserver.ddns.net/updateStats', {
        username,
        classesOpened: 0,
        minutesOnWebsite: 0,
        totalMessagesSent: 1,
      }).catch(error => {
        console.error('Error updating stats:', error);
      });

      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}: </strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatBox.css';

const socket = io('https://isgoserver.ddns.net');

const ChatBox = ({ classId, username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', classId);

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://isgoserver.ddns.net/messages/${classId}`);
        setMessages(response.data);
        scrollToBottom();
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
      const newMessage = { classId, username, message, created_at: new Date().toISOString() };
      socket.emit('sendMessage', newMessage);

      axios.post('https://isgoserver.ddns.net/updateStats', {
        username,
        classesOpened: 0,
        minutesOnWebsite: 0,
        totalMessagesSent: 1,
      }).catch(error => {
        console.error('Error updating stats:', error);
      });

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.username === username ? 'sent' : 'received'}`}>
            <strong>{msg.username}: </strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
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

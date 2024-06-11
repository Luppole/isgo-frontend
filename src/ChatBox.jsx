import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Classroom.css';

const ChatBox = ({ classId, username, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://isgoserver.ddns.net/chat/${classId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, [classId, socket]);

  const handleSendMessage = async () => {
    const messageData = {
      classId,
      username,
      message: newMessage,
    };

    socket.emit('message', messageData);

    try {
      await axios.post('https://isgoserver.ddns.net/chat', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="send-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

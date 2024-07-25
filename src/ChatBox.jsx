import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './ChatBox.css';

const socket = io('https://isgoserver.ddns.net'); // Update with your server URL

const ChatBox = ({ classId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${classId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [classId]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async () => {
    if (isSending || !newMessage.trim()) return;

    setIsSending(true);
    const message = { classId, sender: username, content: newMessage, timestamp: new Date().toISOString() };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      const savedMessage = await response.json();
      socket.emit('send_message', savedMessage);
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.toLocaleDateString()}`;
  };

  return (
    <div className="chatbox-container">
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === username ? 'sent' : 'received'}`}>
            <span className="sender">{msg.sender}</span>
            <p>{msg.content}</p>
            <span className="timestamp">{formatDate(msg.timestamp)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage} disabled={isSending}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

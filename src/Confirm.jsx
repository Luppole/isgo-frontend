import React, { useState } from 'react';
import { confirmEmail } from './api';
import './Confirm.css';

const Confirm = () => {
  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmEmail(username, confirmationCode);
      setMessage('Email confirmed successfully');
    } catch (error) {
      setMessage('Confirmation failed');
      console.error('Error during confirmation:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h2>Confirm Email</h2>
      <form onSubmit={handleConfirm}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Confirmation Code"
        />
        <button type="submit">Confirm</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Confirm;

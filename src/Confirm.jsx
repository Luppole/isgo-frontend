import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmEmail } from './api';
import './Confirm.css';

const Confirm = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmEmail(username, confirmationCode);
      setMessage('Email confirmed successfully');
      navigate('/login'); // Redirect to login page upon successful confirmation
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Confirmation failed';
      setMessage(errorMessage);
      console.error('Error during confirmation:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h2>Confirm Email</h2>
      <form onSubmit={handleConfirm}>
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

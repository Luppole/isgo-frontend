import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmEmail } from './api';
import './Confirm.css';

const Confirm = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Retrieve the username from localStorage

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmEmail(username, confirmationCode);
      setMessage('Email confirmed successfully');
      navigate('/userinfo'); // Redirect to user info page
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


const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const result = await register(username, password, email);
    setMessage('Registration successful. Please check your email to confirm your account.');
    localStorage.setItem('username', username); // Store the username in localStorage
    navigate('/confirm'); // Redirect to confirmation page
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : 'Registration failed';
    setMessage(errorMessage);
    console.error('Error during registration:', error.response ? error.response.data : error.message);
  }
};

export default Confirm;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from './api';
import { AuthContext } from './AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await apiLogin(username, password);
      setMessage('Login successful');
      login(result.token, username);
      navigate('/'); // Redirect to the root page
    } catch (error) {
      setMessage('Login failed');
      console.error('Error during login:', error.response ? error.response.data : error.message);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <button className="secondary" onClick={goToRegister}>Go to Register</button>
    </div>
  );
};

export default Login;

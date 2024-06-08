import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Classroom from './Classroom';
import Login from './Login';
import Register from './Register';
import './App.css'; // Import the CSS for styling

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <div className="username-display">Logged in as: {username}</div>}
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/classroom/:classId" element={isAuthenticated ? <Classroom /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Classroom from './Classroom';
import Login from './Login';
import Register from './Register';
import Confirm from './Confirm';
import UserInfo from './UserInfo';
import Profile from './Profile';
import CreateClass from './CreateClass';
import Classes from './Classes';
import Chat from './Chat';
import { AuthContext, AuthProvider } from './AuthContext';
import axios from 'axios';
import './App.css';

function AppContent() {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let startTime = Date.now();

    const updateStats = () => {
      const endTime = Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 60000); // Convert milliseconds to minutes

      axios.post('https://isgoserver.ddns.net/updateStats', {
        username,
        classesOpened: 0,
        minutesOnWebsite: timeSpent,
        totalMessagesSent: 0,
      }).catch(error => {
        console.error('Error updating stats:', error);
      });
    };

    window.addEventListener('beforeunload', updateStats);

    return () => {
      window.removeEventListener('beforeunload', updateStats);
      updateStats();
    };
  }, [username]);

  return (
    <div className="app-container">
      {isAuthenticated && (
        <div className="header">
          <div className="header-left">
            <button className="username-display" onClick={() => navigate('/profile')}>Logged in as: {username}</button>
            <button className="nav-button home-button" onClick={() => navigate('/')}>Home</button>
            <button className="nav-button classes-button" onClick={() => navigate('/classes')}>Classes</button>
            <button className="nav-button create-class-button" onClick={() => navigate('/createclass')}>Create Class</button>
          </div>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/classroom/:classId" element={isAuthenticated ? <Classroom /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createclass" element={isAuthenticated ? <CreateClass /> : <Navigate to="/login" />} />
          <Route path="/classes" element={isAuthenticated ? <Classes /> : <Navigate to="/login" />} />
          <Route path="/chat/:receiver" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

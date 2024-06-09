import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home';
import Classroom from './Classroom';
import Login from './Login';
import Register from './Register';
import Confirm from './Confirm';
import UserInfo from './UserInfo';
import Profile from './Profile'; // Import the Profile component
import { AuthContext, AuthProvider } from './AuthContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {isAuthenticated && (
        <div className="header">
          <div className="header-left">
            <button className="profile-button" onClick={() => navigate('/profile')}>
              Logged in as: <strong>{username}</strong>
            </button>
            <button className="home-button" onClick={() => navigate('/')}>Home</button>
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
          <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
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

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Classroom from './Classroom';
import Login from './Login';
import Register from './Register';
import Confirm from './Confirm';
import { AuthContext, AuthProvider } from './AuthContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, username, logout } = useContext(AuthContext);

  return (
    <div className="app-container">
      {isAuthenticated && (
        <div className="header">
          <div className="username-display">Logged in as: {username}</div>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      )}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/classroom/:classId" element={isAuthenticated ? <Classroom /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm" element={<Confirm />} />
      </Routes>
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

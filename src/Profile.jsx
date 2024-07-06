import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const username = localStorage.getItem('username');
  const [userInfo, setUserInfo] = useState({});
  const [userStats, setUserStats] = useState({});
  const [visibility, setVisibility] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      axios.get(`https://isgoserver.ddns.net/userinfo?username=${username}`)
        .then(response => {
          setUserInfo(response.data);
          initializeVisibility(response.data, true); // Initialize visibility state for user info
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });

      axios.get(`https://isgoserver.ddns.net/userStats?username=${username}`)
        .then(response => {
          setUserStats(response.data);
          initializeVisibility(response.data, true); // Initialize visibility state for user stats
        })
        .catch(error => {
          console.error('Error fetching user stats:', error);
        });

      const storedVisibility = JSON.parse(localStorage.getItem('visibility')) || {};
      setVisibility(storedVisibility);
    }
  }, [username]);

  const initializeVisibility = (data, defaultValue) => {
    const initialVisibility = {};
    Object.keys(data).forEach((key) => {
      initialVisibility[key] = defaultValue;
    });
    setVisibility((prevVisibility) => ({ ...prevVisibility, ...initialVisibility }));
  };

  const handleUpdateClick = () => {
    navigate('/userinfo');
  };

  const handleCheckboxChange = (field) => {
    const newVisibility = { ...visibility, [field]: !visibility[field] };
    setVisibility(newVisibility);
    localStorage.setItem('visibility', JSON.stringify(newVisibility));
  };

  const fieldEmojis = {
    username: '👤',
    email: '📧',
    age: '🎂',
    school: '🏫',
    address: '🏠',
    phone: '📞',
    interests: '🎨',
    professions: '💼',
    skills: '🛠️',
    first_name: '🧑‍🤝‍🧑',
    last_name: '🧑‍🤝‍🧑',
    institute: '🏛️',
    nationality: '🌍',
    city: '🏙️',
    about_me: '📖',
    classes_opened: '📚',
    minutes_on_website: '⏳',
    total_messages_sent: '💬'
  };

  return (
    <div className="profile-page">
      <div className="header-section"></div>
      <div className="profile-content">
        <div className="flex-container">
          <div className="container profile-details">
            <h2>Profile</h2>
            {Object.entries(userInfo).map(([key, value]) => (
              <p key={key} className="profile-field">
                <strong>{fieldEmojis[key] || ''} {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong> <span className="profile-value"> {value}</span>
                <input
                  type="checkbox"
                  checked={visibility[key] !== false} // Default to checked
                  onChange={() => handleCheckboxChange(key)}
                  className="profile-checkbox"
                />
              </p>
            ))}
          </div>
          <div className="container profile-stats" style={{ marginLeft: '20px' }}>
            <h2>Statistics</h2>
            {Object.entries(userStats).map(([key, value]) => (
              <p key={key} className="profile-field">
                <strong>{fieldEmojis[key] || ''} {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong> <span className="profile-value"> {value}</span>
                <input
                  type="checkbox"
                  checked={visibility[key] !== false} // Default to checked
                  onChange={() => handleCheckboxChange(key)}
                  className="profile-checkbox"
                />
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="update-container">
        <button className="update-button" onClick={handleUpdateClick}>Update User Data</button>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const username = localStorage.getItem('username');
  const [userInfo, setUserInfo] = useState({});
  const [userStats, setUserStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      axios.get(`https://isgoserver.ddns.net/userinfo?username=${username}`)
        .then(response => {
          setUserInfo(response.data);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });

      axios.get(`https://isgoserver.ddns.net/userStats?username=${username}`)
        .then(response => {
          setUserStats(response.data);
        })
        .catch(error => {
          console.error('Error fetching user stats:', error);
        });
    }
  }, [username]);

  const handleUpdateClick = () => {
    navigate('/userinfo');
  };

  return (
    <div className="profile-page">
      <div className="update-section">
        <h2>Update User Data</h2>
        <button className="update-button" onClick={handleUpdateClick}>Update User Data</button>
      </div>
      <div className="container profile-details">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Age:</strong> {userInfo.age}</p>
        <p><strong>School:</strong> {userInfo.school}</p>
        <p><strong>Address:</strong> {userInfo.address}</p>
        <p><strong>Phone:</strong> {userInfo.phone}</p>
        <p><strong>Interests:</strong> {userInfo.interests}</p>
        <p><strong>Professions:</strong> {userInfo.professions}</p>
        <p><strong>Skills:</strong> {userInfo.skills}</p>
        <h3>Statistics</h3>
        <p><strong>Classes Opened:</strong> {userStats.classes_opened}</p>
        <p><strong>Minutes on Website:</strong> {userStats.minutes_on_website}</p>
        <p><strong>Total Messages Sent:</strong> {userStats.total_messages_sent}</p>
      </div>
    </div>
  );
};

export default Profile;

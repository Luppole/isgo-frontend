import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const username = localStorage.getItem('username');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (username) {
      axios.get(`https://isgoserver.ddns.net/userinfo?username=${username}`)
        .then(response => {
          setUserInfo(response.data);
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [username]);

  return (
    <div className="container">
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
      {/* Add more profile details as needed */}
    </div>
  );
};

export default Profile;

import React from 'react';
import './Profile.css';

const Profile = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="container">
      <h2>Profile</h2>
      <p>Username: {username}</p>
      {/* Add more profile details as needed */}
    </div>
  );
};

export default Profile;

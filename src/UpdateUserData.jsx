import React, { useState } from 'react';
import axios from 'axios';
import './UpdateUserData.css';

const UpdateUserData = () => {
  const username = localStorage.getItem('username');
  const [userData, setUserData] = useState({
    email: '',
    age: '',
    school: '',
    address: '',
    phone: '',
    interests: '',
    professions: '',
    skills: ''
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://isgoserver.ddns.net/updateuserinfo', { username, ...userData })
      .then(response => {
        console.log('User data updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  return (
    <div className="update-container">
      <h2>Update User Data</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email" value={userData.email} onChange={handleChange} />
        <input type="text" name="age" placeholder="Age" value={userData.age} onChange={handleChange} />
        <input type="text" name="school" placeholder="School" value={userData.school} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={userData.address} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={userData.phone} onChange={handleChange} />
        <input type="text" name="interests" placeholder="Interests" value={userData.interests} onChange={handleChange} />
        <input type="text" name="professions" placeholder="Professions" value={userData.professions} onChange={handleChange} />
        <input type="text" name="skills" placeholder="Skills" value={userData.skills} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UpdateUserData;

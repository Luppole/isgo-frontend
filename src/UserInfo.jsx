import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserInfo } from './api';
import './UserInfo.css';

const UserInfo = () => {
  const [age, setAge] = useState('');
  const [school, setSchool] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState('');
  const [professions, setProfessions] = useState('');
  const [skills, setSkills] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username'); // Assume username is stored in localStorage
    try {
      const result = await saveUserInfo(username, age, school, address, phone, interests, professions, skills);
      setMessage('Information saved successfully');
      navigate('/'); // Redirect to home or another page
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Failed to save information';
      setMessage(errorMessage);
      console.error('Error saving user info:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container">
      <h2>User Information</h2>
      <form onSubmit={handleSave}>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="School/University"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
        />
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Interests"
        />
        <input
          type="text"
          value={professions}
          onChange={(e) => setProfessions(e.target.value)}
          placeholder="Professions (comma-separated)"
        />
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Skills (comma-separated)"
        />
        <button type="submit">Save Information</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserInfo;

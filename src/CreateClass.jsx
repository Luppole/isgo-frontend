import React, { useState, useContext } from 'react';
import { addClass } from './api';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import './CreateClass.css';

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { username } = useContext(AuthContext);

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const result = await addClass(className, description, subject, username);
      setMessage('Class added successfully');
      setClassName('');
      setDescription('');
      setSubject('');

      // Update user stats
      await axios.post('https://isgoserver.ddns.net/updateStats', {
        username,
        classesOpened: 1,
        minutesOnWebsite: 0,
        totalMessagesSent: 0,
      });
    } catch (error) {
      setMessage('Failed to add class');
      console.error('Error adding class:', error);
    }
  };

  return (
    <div className="container">
      <h2>Create Class</h2>
      <form onSubmit={handleAddClass} className="form-container">
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">Select Subject</option>
          <option value="Math">Math</option>
          <option value="English">English</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
        </select>
        <button type="submit" className="add-class-button">Add Class</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateClass;

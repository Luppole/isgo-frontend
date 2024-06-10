import React, { useState } from 'react';
import { addClass } from './api';
import './CreateClass.css';

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [professor, setProfessor] = useState('');
  const [message, setMessage] = useState('');

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const result = await addClass(className, description, professor);
      setMessage('Class added successfully');
      setClassName('');
      setDescription('');
      setProfessor('');
    } catch (error) {
      setMessage('Failed to add class');
      console.error('Error adding class:', error);
    }
  };

  return (
    <div className="container">
      <h2>Create Class</h2>
      <form onSubmit={handleAddClass}>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          placeholder="Professor"
        />
        <button type="submit">Add Class</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateClass;

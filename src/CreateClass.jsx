import React, { useState } from 'react';
import { addClass } from './api';  // Import the addClass function
import './CreateClass.css';

function CreateClass() {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [professor, setProfessor] = useState('');

  const handleAddClass = async () => {
    try {
      await addClass(className, description, professor);
      setClassName('');
      setDescription('');
      setProfessor('');
      // Optionally, you can add a success message or redirect the user
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
        />
        <button className="add-class-button" onClick={handleAddClass}>Add Class</button>
      </div>
    </div>
  );
}

export default CreateClass;

import React, { useState, useEffect } from 'react';
import ClassBox from './ClassBox';
import './Home.css';
import { fetchClasses, addClass } from './api';  // Import the functions to fetch and add classes

function Home() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassProfessor, setNewClassProfessor] = useState('');

  // Function to fetch all classes
  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  // Fetch classes when the component mounts
  useEffect(() => {
    loadClasses();
  }, []);

  // Function to handle adding a new class
  const handleAddClass = async () => {
    try {
      await addClass(newClassName, newClassDescription, newClassProfessor);
      setNewClassName('');
      setNewClassDescription('');
      setNewClassProfessor('');
      loadClasses();  // Fetch the updated class list
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
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={newClassDescription}
          onChange={(e) => setNewClassDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Professor"
          value={newClassProfessor}
          onChange={(e) => setNewClassProfessor(e.target.value)}
        />
        <button onClick={handleAddClass}>Add Class</button>
      </div>
      <div className="classes-container">
        {classes.map(cls => (
          <ClassBox key={cls.id} classData={cls} />
        ))}
      </div>
    </div>
  );
}

export default Home;

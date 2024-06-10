import React, { useState, useEffect } from 'react';
import ClassBox from './ClassBox';
import './Classes.css';
import { fetchClasses } from './api';

function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchClasses();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    loadClasses();
  }, []);

  return (
    <div className="classes-container">
      {classes.map(cls => (
        <ClassBox key={cls.id} classData={cls} />
      ))}
    </div>
  );
}

export default Classes;

import React, { useEffect, useState } from 'react';
import ClassBox from './ClassBox';
import { getClasses } from './api';
import './Classes.css';

function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClasses();
        setClasses(response);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="container">
      <h2>All Classes</h2>
      <div className="classes-container">
        {classes.map(cls => (
          <ClassBox key={cls.id} classData={cls} />
        ))}
      </div>
    </div>
  );
}

export default Classes;

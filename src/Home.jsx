import React, { useEffect, useState } from 'react';
import ClassBox from './ClassBox';
import { getClasses } from './api';
import './Home.css';

function Home() {
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

  // Get the last three classes after reversing
  const topClasses = [...classes].slice(0, 3);

  return (
    <div className="container">
      <h2 className="top-classes-heading">Recently Opened Classes</h2>
      <div className="classes-container">
        {topClasses.map(cls => (
          <ClassBox key={cls.id} classData={cls} />
        ))}
      </div>
    </div>
  );
}

export default Home;

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
        setClasses(response.slice(0, 3)); // Get the first 3 most recent classes
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="home-container">
      <h2>Recently Opened Classes</h2>
      <div className="classes-container">
        {classes.map(cls => (
          <ClassBox key={cls.id} classData={cls} />
        ))}
      </div>
    </div>
  );
}

export default Home;

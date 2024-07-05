import React, { useEffect, useState } from 'react';
import ClassBox from './ClassBox';
import { getClasses } from './api';
import './Classes.css';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const filteredClasses = classes.filter((cls) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (searchCategory === 'name') {
      return cls.name.toLowerCase().includes(lowercasedTerm);
    }
    if (searchCategory === 'description') {
      return cls.description.toLowerCase().includes(lowercasedTerm);
    }
    if (searchCategory === 'subject') {
      return cls.subject.toLowerCase().includes(lowercasedTerm);
    }
    if (searchCategory === 'professor') {
      return cls.professor.toLowerCase().includes(lowercasedTerm);
    }
    return false;
  });

  return (
    <div className="container">
      <h2>All Classes</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder={`Search by ${searchCategory}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <select
          value={searchCategory}
          onChange={handleCategoryChange}
          className="search-category"
        >
          <option value="name">Name</option>
          <option value="description">Description</option>
          <option value="subject">Subject</option>
          <option value="professor">Professor</option>
        </select>
      </div>
      <div className="classes-container">
        {filteredClasses.map((cls) => (
          <ClassBox key={cls.id} classData={cls} />
        ))}
      </div>
    </div>
  );
}

export default Classes;

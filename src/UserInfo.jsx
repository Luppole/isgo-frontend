import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import universities from './data/universities.json';
import countries from './data/countries.json';
import './UserInfo.css';

const UserInfo = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [institute, setInstitute] = useState('');
  const [nationality, setNationality] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [aboutMe, setAboutMe] = useState('');
  const [message, setMessage] = useState('');
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (nationality) {
      const filtered = universities
        .filter(university => university.country === nationality)
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort universities alphabetically
      setFilteredInstitutes(filtered);
    } else {
      setFilteredInstitutes([]);
    }
  }, [nationality]);

  const handleSave = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username'); // Assume username is stored in localStorage
    try {
      const result = await axios.post('https://isgoserver.ddns.net/saveuserinfo', {
        username,
        firstName,
        lastName,
        email,
        institute,
        nationality,
        city,
        phone,
        subjects,
        aboutMe,
      });
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

  const handleSubjectChange = (subject) => {
    setSubjects(prevSubjects => {
      if (prevSubjects.includes(subject)) {
        return prevSubjects.filter(s => s !== subject);
      } else {
        return [...prevSubjects, subject];
      }
    });
  };

  // Sort countries alphabetically by common name
  const sortedCountries = countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

  return (
    <div className="container">
      <h2>User Information</h2>
      <form onSubmit={handleSave}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        >
          <option value="">Select Nationality</option>
          {sortedCountries.map((country, index) => (
            <option key={index} value={country.name.common}>{country.name.common}</option>
          ))}
        </select>
        <select
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
        >
          <option value="">Select Institute</option>
          {filteredInstitutes.map((university, index) => (
            <option key={index} value={university.name}>{university.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
        />
        <div className="subjects-container">
          {["Math", "English", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science", "Art", "Music", "Physical Education", "Economics", "Political Science", "Philosophy", "Sociology", "Psychology", "Engineering", "Medicine", "Law"].map((subject, index) => (
            <label key={index} className="subject-label">
              <input
                type="checkbox"
                checked={subjects.includes(subject)}
                onChange={() => handleSubjectChange(subject)}
              />
              {subject}
            </label>
          ))}
        </div>
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="About Me"
        />
        <button type="submit">Save Information</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserInfo;

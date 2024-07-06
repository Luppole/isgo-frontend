import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserInfo } from './api';
import './UserInfo.css';
import universities from './data/universities.json';
import countries from './data/countries.json';
import axios from 'axios';

const UserInfo = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [institute, setInstitute] = useState('');
  const [nationality, setNationality] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [aboutMe, setAboutMe] = useState('');
  const [message, setMessage] = useState('');
  const [filteredInstitutes, setFilteredInstitutes] = useState([]);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');
  const storedEmail = localStorage.getItem('email'); // Get email from localStorage

  useEffect(() => {
    if (username) {
      axios.get(`https://isgoserver.ddns.net/userinfo?username=${username}`)
        .then(response => {
          const data = response.data;
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setEmail(data.email || storedEmail || '');
          setInstitute(data.institute || '');
          setNationality(data.nationality || '');
          setCity(data.city || '');
          setPhone(data.phone || '');
          setSubjects(data.subjects || []);
          setAboutMe(data.about_me || '');
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [username, storedEmail]);

  useEffect(() => {
    if (nationality) {
      const filtered = universities.filter((uni) => uni.country === nationality);
      setFilteredInstitutes(filtered.sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setFilteredInstitutes([]);
    }
  }, [nationality]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const result = await saveUserInfo(username, firstName, lastName, email, institute, nationality, city, phone, subjects, aboutMe);
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

  const handleSubjectsChange = (subject) => {
    setSubjects((prevSubjects) =>
      prevSubjects.includes(subject)
        ? prevSubjects.filter((s) => s !== subject)
        : [...prevSubjects, subject]
    );
  };

  return (
    <div className="container">
      <h2>User Information</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name *"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name *"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          required
        >
          <option value="">Select Nationality</option>
          {countries.sort((a, b) => a.name.common.localeCompare(b.name.common)).map((country) => (
            <option key={country.name.common} value={country.name.common}>
              {country.name.common}
            </option>
          ))}
        </select>
        <select
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
          required
        >
          <option value="">Select Institute</option>
          {filteredInstitutes.map((uni) => (
            <option key={uni.name} value={uni.name}>
              {uni.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <div className="subjects-container">
          <label>Subjects:</label>
          <div className="subjects-list">
            {['Math', 'Science', 'History', 'Literature', 'Physics', 'Chemistry', 'Biology', 'Geography', 'English', 'Computer Science', 'Art', 'Music', 'Physical Education', 'Economics', 'Psychology', 'Sociology', 'Political Science', 'Philosophy', 'Business', 'Engineering', 'Law', 'Medicine', 'Nursing', 'Dentistry', 'Pharmacy', 'Veterinary Medicine'].map((subject) => (
              <label key={subject} className="subject-item">
                <input
                  type="checkbox"
                  checked={subjects.includes(subject)}
                  onChange={() => handleSubjectsChange(subject)}
                />
                {subject}
              </label>
            ))}
          </div>
        </div>
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="About Me"
          required
        />
        <button type="submit">Save Information</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserInfo;

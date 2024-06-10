import axios from 'axios';

const API_URL = 'https://isgoserver.ddns.net';

export const register = async (username, password, email) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password, email });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const confirmEmail = async (username, confirmationCode) => {
  try {
    const response = await axios.post(`${API_URL}/confirm`, { username, confirmationCode });
    return response.data;
  } catch (error) {
    console.error('Error during confirmation:', error);
    throw error;
  }
};

export const saveUserInfo = async (username, age, school, address, phone, interests, professions, skills) => {
  try {
    const response = await axios.post(`${API_URL}/saveuserinfo`, { username, age, school, address, phone, interests, professions, skills });
    return response.data;
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
};

export const getClasses = async () => {
  try {
    const response = await axios.get(`${API_URL}/classes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

export const fetchClassById = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}/classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class by ID:', error);
    throw error;
  }
};

export const addClass = async (className, description, professor) => {
  try {
    const response = await axios.post(`${API_URL}/classes`, { name: className, description, professor });
    return response.data;
  } catch (error) {
    console.error('Error adding class:', error);
    throw error;
  }
};

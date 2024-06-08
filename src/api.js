import axios from 'axios';

const API_URL = 'http://34.89.179.204:3000';

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

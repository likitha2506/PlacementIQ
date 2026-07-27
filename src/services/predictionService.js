import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080';

export const predictPlacement = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};

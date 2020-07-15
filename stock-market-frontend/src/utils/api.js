import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const getError = (response) => {
  return response && response.response && response.response.data ? response.response.data.message : 'Server Error';
};

export default api;

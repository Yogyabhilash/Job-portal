import axios from 'axios';

let apiUrl = import.meta.env.VITE_API_URL || 'https://job-portal-l1ke.onrender.com/api';
if (apiUrl.includes('job-portal-1ike')) {
  apiUrl = apiUrl.replace('job-portal-1ike', 'job-portal-l1ke');
}

let serverUrl = import.meta.env.VITE_SERVER_URL || 'https://job-portal-l1ke.onrender.com';
if (serverUrl.includes('job-portal-1ike')) {
  serverUrl = serverUrl.replace('job-portal-1ike', 'job-portal-l1ke');
}

export const API_BASE_URL = apiUrl;
export const SERVER_BASE_URL = serverUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically inject JWT token into the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

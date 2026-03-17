import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('deshbondhu_auth_data');
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to unwrap the ApiResponse structure from the backend
api.interceptors.response.use(
  (response) => {
    // Return only the data part of our ApiResponse structure
    return response.data;
  },
  (error) => {
    // Handle global errors here
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

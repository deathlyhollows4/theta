import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error?.response?.data;
    const firstValidationError = payload?.errors?.[0]?.message;
    const message = payload?.message || firstValidationError || 'Unexpected API error';

    const normalizedError = new Error(message);
    normalizedError.status = error?.response?.status || 500;
    normalizedError.details = payload?.errors || [];

    return Promise.reject(normalizedError);
  }
);

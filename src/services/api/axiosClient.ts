import axios from 'axios';
import { env } from '../../utils/env';
import { getStoredToken, clearStoredToken } from '../../features/auth/utils/auth-storage';

export const axiosClient = axios.create({
  baseURL: env.apiUrl
});

axiosClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(error);
  }
);

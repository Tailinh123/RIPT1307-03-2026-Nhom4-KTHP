import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach token ──────────────────────────────────────
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle errors ─────────────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token but do NOT redirect — the app has no /login page
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  },
);

export default axiosClient;

import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (
      token &&
      token !== 'null' &&
      token !== 'undefined'
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 
// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.error('API ERROR:', error?.response || error);

    // Token hết hạn
    if (error?.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Lấy từ file .env.local ra
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động gắn Token vào Header nếu người dùng đã đăng nhập
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
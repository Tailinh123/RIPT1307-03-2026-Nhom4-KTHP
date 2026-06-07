import axiosClient from './axiosClient';
import { getBackendMessage } from '@/utils/backendMessage';
interface LoginResponse {
  access_token: string;
  message?: string;
  user: {
    id: number;
    email: string;
    name: string;
    avatarUrl?: string;
    role?: {
      id: number;
      name: string;
      active?: boolean;
    };
    company?: {
      id: number;
      name: string;
    };
  };
}
export const authApi = {
  login: async (username: string, password: string) => {
    const res = await axiosClient.post<{ data: LoginResponse }>(
      '/api/v1/auth/login',
      {
        username,
        password,
      }
    );
    return {
      ...res.data.data,
      message: getBackendMessage(res.data, 'Đăng nhập thành công!'),
    };
  },
  register: async (name: string, email: string, password: string, companyId?: number) => {
    const payload = companyId ? { name, email, password, companyId } : { name, email, password };
    const res = await axiosClient.post('/api/v1/auth/register', payload);
    return res.data;
  },
  getRoleById: async (id: number | string) => {
    const res = await axiosClient.get(`/api/v1/roles/${id}`);
    return res.data.data;
  },
  getAccount: async () => {
    const res = await axiosClient.get('/api/v1/auth/account');
    return res.data.data;
  },
  getProfile: async () => {
    const res = await axiosClient.get('/api/v1/auth/profile');
    return res.data.data;
  },
  logout: async () => {
    await axiosClient.post('/api/v1/auth/logout');
  },
};

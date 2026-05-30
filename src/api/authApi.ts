import axiosClient from './axiosClient';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role?: {
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

    return res.data.data;
  },

  register: async (name: string, email: string, password: string) => {
    const res = await axiosClient.post('/api/v1/auth/register', { name, email, password });
    return res.data.data;
  },

  getAccount: async () => {
    const res = await axiosClient.get('/api/v1/auth/account');
    return res.data.data;
  },

  logout: async () => {
    await axiosClient.post('/api/v1/auth/logout');
  },
};
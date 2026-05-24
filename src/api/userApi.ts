import axiosClient from './axiosClient';
import type { UserProfile, UpdateProfilePayload } from '@/types/user';

export const userApi = {
  /** GET /api/v1/users/me */
  getProfile: () =>
    axiosClient.get<{ data: UserProfile }>('/users/me'),

  /** PUT /api/v1/users/{id} */
  updateProfile: (id: number, payload: UpdateProfilePayload) =>
    axiosClient.put<{ data: UserProfile }>(`/users/${id}`, payload),
};

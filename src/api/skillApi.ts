import axiosClient from './axiosClient';
import type { Skill } from '@/types/skill';
import type { ApiResponse } from '@/types/api';

export const skillApi = {
  getSkills: () => axiosClient.get<ApiResponse<Skill[]>>('/api/v1/skills'),
};

import axiosClient from './axiosClient';
import type { Skill } from '@/types/skill';
import type { ResultPaginationResponse } from '@/types/api';

// Backend response wrapper
interface BackendResponse<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}

export const skillApi = {
  getSkills: async () => {
    const response = await axiosClient.get<BackendResponse<ResultPaginationResponse<Skill>>>('/api/v1/skills');
    return {
      data: {
        data: response.data.data.result,
      },
    } as any;
  },
};

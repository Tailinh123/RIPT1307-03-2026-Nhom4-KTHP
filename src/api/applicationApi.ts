import axiosClient from './axiosClient';
import type { Application } from '@/types/application';

export const applicationApi = {
  /** GET /api/v1/applications */
  getMyApplications: () => axiosClient.get<{ data: Application[] }>('/applications'),

  /** POST /api/v1/applications */
  apply: (jobId: number, formData: FormData) =>
    axiosClient.post('/applications', formData, {
      params: { jobId },
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

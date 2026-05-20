import axiosClient from './axiosClient';
import type { Job, JobFilterParams } from '@/types/job';
import type { PaginatedResponse, ApiResponse } from '@/types/api';

export const jobApi = {
  getJobs: (params: JobFilterParams = {}) =>
    axiosClient.get<PaginatedResponse<Job>>('/api/v1/jobs', { params }),

  getJobById: (id: number) =>
    axiosClient.get<ApiResponse<Job>>(`/api/v1/jobs/${id}`),
};

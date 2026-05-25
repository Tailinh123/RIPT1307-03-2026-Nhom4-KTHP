import axiosClient from './axiosClient';
import type { Job, JobFilterParams } from '@/types/job';
import type { ResultPaginationResponse, PaginatedData } from '@/types/api';
import { convertResultToPaginatedData } from '@/types/api';

// Backend response wrapper
interface BackendResponse<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}

interface ApiJobResponse<T> {
  data: T;
}

// Backend Job DTO
interface BackendJob {
  id: number;
  name: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  workMode: string;
  level: string;
  company: { id: number; name: string };
  jobCategory: { id: number; name: string };
  skills: Array<{ id: number; name: string }>;
  startDate: string;
  endDate: string;
  active: boolean;
}

// Map Backend Job to Frontend Job
function mapBackendJobToFrontend(backendJob: BackendJob): Job {
  return {
    id: backendJob.id,
    title: backendJob.name,
    companyName: backendJob.company?.name || '',
    description: backendJob.description,
    requirements: '', // Backend doesn't provide this
    location: backendJob.location,
    salaryMin: backendJob.salary,
    salaryMax: backendJob.salary,
    level: backendJob.level as any,
    workMode: backendJob.workMode as any,
    category: backendJob.jobCategory?.name as any,
    skills: backendJob.skills || [],
    deadline: backendJob.endDate,
    createdAt: backendJob.startDate,
    isActive: backendJob.active,
  };
}

export const jobApi = {
  getJobs: async (params: JobFilterParams = {}): Promise<ApiJobResponse<PaginatedData<Job>>> => {
    const response = await axiosClient.get<BackendResponse<ResultPaginationResponse<BackendJob>>>('/api/v1/jobs', { params });
    const mappedJobs = response.data.data.result.map(mapBackendJobToFrontend);
    const paginatedData: PaginatedData<Job> = {
      content: mappedJobs,
      totalElements: response.data.data.meta.total,
      totalPages: response.data.data.meta.pages,
      page: response.data.data.meta.page - 1,
      size: response.data.data.meta.pageSize,
    };
    return { data: paginatedData };
  },

  getJobById: async (id: number): Promise<ApiJobResponse<Job>> => {
    const response = await axiosClient.get<BackendResponse<BackendJob>>(`/api/v1/jobs/${id}`);
    return { data: mapBackendJobToFrontend(response.data.data) };
  },
};

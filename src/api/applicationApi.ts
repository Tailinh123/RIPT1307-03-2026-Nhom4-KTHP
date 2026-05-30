import axiosClient from './axiosClient';
import type { ResultPaginationResponse } from '@/types/api';

interface BackendWrapper<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}

interface UploadFileResponse {
  fileName: string;
  uploadedAt: string;
}

interface ResumeResponse {
  id: number;
  title: string;
  url: string;
}

export interface BackendApplication {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  job: {
    id: number;
    name?: string;
    location?: string;
    level?: string;
    workMode?: string;
    company?: {
      id: number;
      name: string;
    } | null;
  } | null;
  resume: {
    id: number;
    title?: string | null;
    url?: string | null;
  } | null;
}

export const applicationApi = {

  uploadCV: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosClient.post<BackendWrapper<UploadFileResponse>>(
      '/api/v1/files',
      formData, 
      {
        params: { folder: 'resume' },
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data.data;
  },
  createResume: async (title: string, url: string): Promise<ResumeResponse> => {
    const res = await axiosClient.post<BackendWrapper<ResumeResponse>>(
      '/api/v1/resumes', 
      {
        title: title || 'CV_Ung_Tuyen.pdf',
        url: url
      }
    );
    return res.data.data;
  },
  createApplication: async (jobId: number, resumeId: number): Promise<void> => {
    await axiosClient.post('/api/v1/applications', { 
      status: 'PENDING',
      job: { id: jobId },
      resume: { id: resumeId },
    });
  },
  applyToJob: async (jobId: number, file: File): Promise<void> => {
    const uploaded = await applicationApi.uploadCV(file);
    const resume = await applicationApi.createResume(file.name, uploaded.fileName);
    await applicationApi.createApplication(jobId, resume.id);
  },
  getMyApplications: async (page = 1, size = 100): Promise<BackendApplication[]> => {
    const res = await axiosClient.get<BackendWrapper<ResultPaginationResponse<BackendApplication>>>(
      '/api/v1/applications/by-user',
      { params: { page, size } }
    );
    return res.data?.data?.result ?? [];
  },
};
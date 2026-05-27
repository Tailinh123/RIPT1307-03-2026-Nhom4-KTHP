import axiosClient from './axiosClient';
import type { ResultPaginationResponse } from '@/types/api';

// 
// Backend wrapper

interface BackendWrapper<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}


// Upload response

interface UploadFileResponse {
  fileName: string;
  uploadedAt: string;
}


// Resume response

interface ResumeResponse {
  id: number;
  title: string;
  url: string;
}


// Backend Application

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
  // 
  // Upload CV
  // POST /api/v1/files?folder=resume
  // 
  uploadCV: async (
    file: File,
  ): Promise<UploadFileResponse> => {
    const formData = new FormData();

    formData.append('file', file);

    const res =
      await axiosClient.post<
        BackendWrapper<UploadFileResponse>
      >('/api/v1/files', formData, {
        params: {
          folder: 'resume',
        },

        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    return res.data.data;
  },

  // 
  // Create resume
  // POST /api/v1/resumes
  // 
  createResume: async (
    title: string,
    url: string,
  ): Promise<ResumeResponse> => {
    const res =
      await axiosClient.post<
        BackendWrapper<ResumeResponse>
      >('/api/v1/resumes', {
        title,
        url,
      });

    return res.data.data;
  },

  //
  // Create application
  // POST /api/v1/applications
  // 
  createApplication: async (
    jobId: number,
    resumeId: number,
  ): Promise<void> => {
    await axiosClient.post('/api/v1/applications', {
      job: {
        id: jobId,
      },

      resume: {
        id: resumeId,
      },
    });
  },

  // ───────────────────────────────────────────────────────────
  // Full apply flow
  // upload file -> create resume -> create application
  // ───────────────────────────────────────────────────────────
  applyToJob: async (
    jobId: number,
    file: File,
  ): Promise<void> => {
    console.log('STEP 1: Upload CV');

    const uploaded =
      await applicationApi.uploadCV(file);

    console.log('UPLOAD RESULT:', uploaded);

    console.log('STEP 2: Create Resume');

    const resume =
      await applicationApi.createResume(
        file.name,
        uploaded.fileName,
      );

    console.log('RESUME RESULT:', resume);

    console.log('STEP 3: Create Application');

    await applicationApi.createApplication(
      jobId,
      resume.id,
    );

    console.log('APPLICATION CREATED');
  },

  // 
  // Get current user's application
  // POST /api/v1/applications/by-user
  //
  getMyApplications: async (
    page = 1,
    size = 100,
  ): Promise<BackendApplication[]> => {
    const res =
      await axiosClient.post<
        BackendWrapper<
          ResultPaginationResponse<BackendApplication>
        >
      >(
        '/api/v1/applications/by-user',
        {},
        {
          params: {
            page: page - 1,
            size,
          },
        },
      );

    console.log(
      'APPLICATION LIST RESPONSE:',
      res.data,
    );

    return res.data?.data?.result ?? [];
  },
};
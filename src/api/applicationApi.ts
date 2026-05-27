import axiosClient from './axiosClient';
import type { ResultPaginationResponse } from '@/types/api';

// ── Backend response wrapper ──────────────────────────────────────────────────
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

// ── Raw Application entity returned by fetchByUser ────────────────────────────
// Backend returns the entity directly via FormatResultPagination.createPaginationResponse()
export interface BackendApplication {
  id: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  // Full Job entity (lazy-loaded but serialized by Hibernate/Jackson)
  job: {
    id: number;
    name?: string;
    location?: string;
    level?: string;
    workMode?: string;
    company?: { id: number; name: string } | null;
  } | null;
  // Resume entity
  resume: {
    id: number;
    title?: string | null;
    url?: string | null;
  } | null;
}

export const applicationApi = {
  /**
   * Step 1: Upload CV file
   * POST /api/v1/files?folder=resume
   * Content-Type: multipart/form-data
   */
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

  /**
   * Step 2: Create Resume record (linked to current user via SecurityContext)
   * POST /api/v1/resumes
   * Body: { title, url }   ← Resume entity has no "job" field
   */
  createResume: async (title: string, url: string): Promise<ResumeResponse> => {
    const res = await axiosClient.post<BackendWrapper<ResumeResponse>>('/api/v1/resumes', {
      title,
      url,
    });
    return res.data.data;
  },

  /**
   * Step 3: Create Application
   * POST /api/v1/applications
   * Body: { job: { id }, resume: { id } }
   */
  createApplication: async (jobId: number, resumeId: number): Promise<void> => {
    await axiosClient.post('/api/v1/applications', {
      job: { id: jobId },
      resume: { id: resumeId },
    });
  },

  /**
   * Full apply flow: upload CV → create resume record → create application
   */
  applyToJob: async (jobId: number, file: File): Promise<void> => {
    // 1. Upload file to storage
    const uploaded = await applicationApi.uploadCV(file);
    // 2. Create resume record (title = original filename, url = stored filename)
    const resume = await applicationApi.createResume(file.name, uploaded.fileName);
    // 3. Link resume + job as an application
    await applicationApi.createApplication(jobId, resume.id);
  },

  /**
   * Get applications by userId
   * POST /api/v1/applications/by-user?userId=<id>
   * Auth disabled on backend — userId passed as query param
   */
  getMyApplications: async (userId: number = 2, page = 1, size = 100): Promise<BackendApplication[]> => {
    const res = await axiosClient.post<BackendWrapper<ResultPaginationResponse<BackendApplication>>>(
      '/api/v1/applications/by-user',
      null,
      { params: { userId, page, size } }
    );
    return res.data?.data?.result ?? [];
  },
};

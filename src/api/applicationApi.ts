import axiosClient from './axiosClient';
import type { ResultPaginationResponse } from '@/types/api';

// --- Interfaces ---
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
  // 1. TẢI FILE LÊN (Đã chuẩn 100%)
  uploadCV: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosClient.post<BackendWrapper<UploadFileResponse>>(
      '/api/v1/files',
      formData,
      {
        params: { folder: 'resume' },
        headers: { 'Content-Type': undefined as any },
      }
    );
    return res.data.data;
  },

  // 2. TẠO HỒ SƠ (Kèm email và active để lách luật BE)
createResume: async (title: string, url: string): Promise<ResumeResponse> => {
    // Chỉ gửi title và url. Phần User để Backend tự bóc từ Token ra!
    const res = await axiosClient.post<BackendWrapper<ResumeResponse>>('/api/v1/resumes', {
      title: title || 'CV_Ung_Tuyen.pdf',
      url: url
    });
    return res.data.data;
  },

  // (Hàm createApplication giữ nguyên)
  createApplication: async (jobId: number, resumeId: number): Promise<void> => {
    const userStr = localStorage.getItem('user');
    const userData = userStr ? JSON.parse(userStr) : null;

    await axiosClient.post('/api/v1/applications', {
      status: 'PENDING',
      job: { id: jobId },
      resume: { id: resumeId },
      user: { id: userData?.id }, // Đơn ứng tuyển vẫn cần gửi User
    });
  },

  // 
  // Full apply flow
  // 
  applyToJob: async (jobId: number, file: File): Promise<void> => {
    let validJobId = jobId;
    if (!validJobId) {
      const parts = window.location.pathname.split('/');
      validJobId = Number(parts[parts.length - 1]);
    }

    const uploaded = await applicationApi.uploadCV(file);
    const resume = await applicationApi.createResume(file.name, uploaded.fileName);
    await applicationApi.createApplication(validJobId, resume.id);
  },

  // 5. LẤY DANH SÁCH
  getMyApplications: async (page = 1, size = 100): Promise<BackendApplication[]> => {
    const res = await axiosClient.post<BackendWrapper<ResultPaginationResponse<BackendApplication>>>(
      '/api/v1/applications/by-user',
      {},
      { params: { page: page - 1, size } }
    );
    return res.data?.data?.result ?? [];
  },
};
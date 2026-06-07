import axiosClient from './axiosClient';
import type { ResultPaginationResponse } from '@/types/api';
import { getBackendMessage } from '@/utils/backendMessage';
interface BackendWrapper<T> {  statusCode: number;  error: string | null;  message: string;  data: T;}interface UploadFileResponse {  fileName: string;  uploadedAt: string;}interface ResumeResponse {
  id: number;
  title: string;
  url: string;
}
interface BackendMutationResult<T> {
  data: T;
  message: string;
}
interface ApplyToJobResult {
  uploadMessage: string;
  resumeMessage: string;
  applicationMessage: string;
}
export interface BackendApplication {  id: number;  status: string;  note: string | null;  createdAt: string;  updatedAt: string;  createdBy: string;  updatedBy: string;  job: {    id: number;    name?: string;    location?: string;    level?: string;    workMode?: string;    company?: {      id: number;      name: string;    } | null;  } | null;  resume: {    id: number;    title?: string | null;    url?: string | null;  } | null;}export const applicationApi = {  uploadCV: async (file: File): Promise<BackendMutationResult<UploadFileResponse>> => {
    const formData = new FormData();    formData.append('file', file);    const res = await axiosClient.post<BackendWrapper<UploadFileResponse>>(      '/api/v1/files',      formData,       {        params: { folder: 'resume' },        headers: { 'Content-Type': 'multipart/form-data' },      }    );    return {
      data: res.data.data,
      message: getBackendMessage(res.data, 'Tải CV thành công.'),
    };
  },
  createResume: async (title: string, url: string): Promise<BackendMutationResult<ResumeResponse>> => {
    const res = await axiosClient.post<BackendWrapper<ResumeResponse>>(
      '/api/v1/resumes',       {        title: title || 'CV_Ung_Tuyen.pdf',        url: url      }    );    return {
      data: res.data.data,
      message: getBackendMessage(res.data, 'Tạo hồ sơ CV thành công.'),
    };
  },
  createApplication: async (jobId: number, resumeId: number): Promise<BackendMutationResult<unknown>> => {
    const res = await axiosClient.post<BackendWrapper<unknown>>('/api/v1/applications', {
      status: 'PENDING',
      job: { id: jobId },
      resume: { id: resumeId },
    });
    return {
      data: res.data.data,
      message: getBackendMessage(res.data, 'Nộp đơn ứng tuyển thành công.'),
    };
  },
  applyToJob: async (jobId: number, file: File): Promise<ApplyToJobResult> => {
    const existingApplications = await applicationApi.getMyApplications(1, 500);
    const alreadyApplied = existingApplications.some((application) => application.job?.id === jobId);
    if (alreadyApplied) {
      throw new Error('You have already applied to this job');
    }
    const uploaded = await applicationApi.uploadCV(file);
    const resume = await applicationApi.createResume(file.name, uploaded.data.fileName);
    const application = await applicationApi.createApplication(jobId, resume.data.id);
    return {
      uploadMessage: uploaded.message,
      resumeMessage: resume.message,
      applicationMessage: application.message,
    };
  },
  getMyApplications: async (page = 1, size = 100): Promise<BackendApplication[]> => {
    const res = await axiosClient.get<BackendWrapper<ResultPaginationResponse<BackendApplication>>>(
      '/api/v1/applications/by-user',
      { params: { page, size } }
    );
    return res.data?.data?.result ?? [];
  },
};

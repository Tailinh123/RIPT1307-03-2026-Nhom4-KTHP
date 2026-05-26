import axiosClient from './axiosClient';
import type { Job, JobFilterParams } from '@/types/job';
import type { ResultPaginationResponse, PaginatedData } from '@/types/api';
import type { JobDetail } from '@/hooks/useJobDetail';

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
  requirement?: string;
  benefits?: string;
  location: string;
  salary: number;
  quantity?: number;
  jobType: string;
  workMode: string;
  level: string;
  company: { id: number; name: string; description?: string; website?: string; size?: string; industry?: string };
  jobCategory: { id: number; name: string };
  skills: Array<{ id: number; name: string }>;
  startDate: string;
  endDate: string;
  active: boolean;
}

// Map location from Frontend code to Backend string value
function mapLocationToBackend(location?: string): string | undefined {
  if (!location) return undefined;
  const locationMap: Record<string, string> = {
    'HANOI': 'Ha Noi',
    'HCMC': 'Ho Chi Minh',
    'DANANG': 'Da Nang',
  };
  return locationMap[location];
}

/**
 * Build Spring Filter (turkraft) RSQL query string.
 * Syntax examples:
 *   name ~ 'react'                  → contains (case-insensitive)
 *   location : 'Ha Noi'             → equals
 *   level : 'INTERN'                → equals
 *   workMode : 'REMOTE'             → equals
 *   jobCategory.name : 'IT'         → equals on related entity field
 *   active : true                   → boolean
 */
function buildFilterString(params: JobFilterParams): string | undefined {
  const parts: string[] = [];

  // Always filter only active jobs
  parts.push("active : true");

  if (params.keyword?.trim()) {
    // Search by job title OR company name using Spring Filter OR syntax
    const kw = params.keyword.trim().replace(/'/g, "\\'");
    parts.push(`(name ~ '${kw}' or company.name ~ '${kw}')`);
  }

  if (params.location && params.location !== 'OTHER') {
    const loc = mapLocationToBackend(params.location);
    if (loc) {
      parts.push(`location : '${loc}'`);
    }
  }

  if (params.level) {
    parts.push(`level : '${params.level}'`);
  }

  if (params.workMode) {
    parts.push(`workMode : '${params.workMode}'`);
  }

  return parts.length > 0 ? parts.join(' and ') : undefined;
}

// Convert Frontend filter params to Backend API params
function convertFilterParamsToBackend(params: JobFilterParams): Record<string, unknown> {
  const backendParams: Record<string, unknown> = {};

  // Build Spring Filter RSQL string
  const filterStr = buildFilterString(params);
  if (filterStr) {
    backendParams.filter = filterStr;
  }

  // Map pagination (backend is 1-based)
  if (params.page !== undefined) {
    backendParams.page = params.page + 1;
  }
  if (params.size !== undefined) {
    backendParams.size = params.size;
  }

  return backendParams;
}

// Map Backend Job to Frontend JobDetail
function mapBackendJobToJobDetail(backendJob: BackendJob): JobDetail {
  return {
    id: backendJob.id,
    title: backendJob.name,
    companyName: backendJob.company?.name || '',
    description: backendJob.description,
    requirements: backendJob.requirement || '',
    location: backendJob.location,
    salaryMin: backendJob.salary,
    salaryMax: backendJob.salary,
    level: (backendJob.level || 'INTERN') as Job['level'],
    workMode: (backendJob.workMode || 'ONSITE') as Job['workMode'],
    category: (backendJob.jobCategory?.name || 'OTHER') as Job['category'],
    skills: backendJob.skills || [],
    deadline: backendJob.endDate,
    createdAt: backendJob.startDate,
    isActive: backendJob.active,
    benefits: backendJob.benefits || '',
    headcount: backendJob.quantity || 0,
    companyDescription: backendJob.company?.description || '',
    companyWebsite: backendJob.company?.website,
    companySize: backendJob.company?.size,
    companyIndustry: backendJob.company?.industry,
  };
}

// Map Backend Job to Frontend Job (for list view)
function mapBackendJobToFrontend(backendJob: BackendJob): Job {
  return {
    id: backendJob.id,
    title: backendJob.name,
    companyName: backendJob.company?.name || '',
    description: backendJob.description,
    requirements: backendJob.requirement || '',
    location: backendJob.location,
    salaryMin: backendJob.salary,
    salaryMax: backendJob.salary,
    level: (backendJob.level || 'INTERN') as Job['level'],
    workMode: (backendJob.workMode || 'ONSITE') as Job['workMode'],
    category: (backendJob.jobCategory?.name || 'OTHER') as Job['category'],
    skills: backendJob.skills || [],
    deadline: backendJob.endDate,
    createdAt: backendJob.startDate,
    isActive: backendJob.active,
  };
}

export const jobApi = {
  getJobs: async (params: JobFilterParams = {}): Promise<ApiJobResponse<PaginatedData<Job>>> => {
    const backendParams = convertFilterParamsToBackend(params);
    const response = await axiosClient.get<BackendResponse<ResultPaginationResponse<BackendJob>>>('/api/v1/jobs', { params: backendParams });
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

  getJobById: async (id: number): Promise<ApiJobResponse<JobDetail>> => {
    const response = await axiosClient.get<BackendResponse<BackendJob>>(`/api/v1/jobs/${id}`);
    return { data: mapBackendJobToJobDetail(response.data.data) };
  },
};

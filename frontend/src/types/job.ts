import type { Skill } from './skill';
export type JobLevel = 'INTERN' | 'FRESHER' | 'JUNIOR' | 'MIDDLE' | 'SENIOR';
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type JobCategory =
  | 'IT_SOFTWARE'
  | 'MARKETING'
  | 'FINANCE'
  | 'DESIGN'
  | 'SALES'
  | 'HUMAN_RESOURCES'
  | 'EDUCATION'
  | 'OTHER';
export type JobType = 'INTERNSHIP' | 'INTERN' | 'FULL_TIME' | 'PART_TIME';
export type JobStatus = 'ACTIVE' | 'PENDING' | 'CLOSED' | 'DRAFT';
export interface Job {
  id: number | string;
  title: string;
  name?: string;
  companyName: string;
  company?: {
    id?: number;
    name?: string;
    logoUrl?: string;
  };
  companyLogo?: string;
  description: string;
  requirements?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salary?: number;
  level: JobLevel;
  jobType?: JobType;
  workMode: WorkMode;
  category?: JobCategory | string;
  jobCategory?: JobCategory | string | { id?: number; name?: string };
  skills?: Skill[];
  deadline?: string;
  startDate?: string;
  endDate?: string;
  quantity?: number;
  isActive?: boolean;
  isHot?: boolean;
  createdAt: string;
  updatedAt?: string;
  status?: JobStatus;
  serviceFee?: number;
}
export interface JobDetail extends Job {
  benefits: string;
  headcount: number;
  companyDescription: string;
  companyWebsite?: string;
  companySize?: string;
  companyIndustry?: string;
}
export interface JobFilterParams {
  keyword?: string;
  category?: JobCategory;
  categoryId?: number;
  skills?: number[];
  level?: JobLevel;
  workMode?: WorkMode;
  location?: string;
  companyId?: number;
  page?: number;
  size?: number;
}
export interface JobFormData {
  name: string;
  description: string;
  salary: number;
  level: JobLevel;
  jobType: JobType;
  workMode: WorkMode;
  skills: number[];
  jobCategory: JobCategory | number;
  location?: string;
  quantity?: number;
  companyName?: string;
  startDate?: any;
  endDate?: any;
  isActive?: boolean;
  isHot?: boolean;
  companyId?: number;
}
export const levelLabels: Record<JobLevel, string> = {
  INTERN: 'Intern',
  FRESHER: 'Fresher',
  JUNIOR: 'Junior',
  MIDDLE: 'Mid-level',
  SENIOR: 'Senior',
};
export const jobTypeLabels: Record<string, string> = {
  INTERNSHIP: 'Internship',
  INTERN: 'Internship',
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
};
export const workModeLabels: Record<WorkMode, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
};
export const statusLabels: Record<JobStatus, string> = {
  ACTIVE: 'Đang tuyển',
  PENDING: 'Chờ duyệt',
  CLOSED: 'Đã đóng',
  DRAFT: 'Bản nháp',
};
export const statusColors: Record<JobStatus, string> = {
  ACTIVE: 'green',
  PENDING: 'orange',
  CLOSED: 'red',
  DRAFT: 'default',
};

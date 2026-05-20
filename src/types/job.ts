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

export interface Job {
  id: number;
  title: string;
  companyName: string;
  companyLogo?: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  level: JobLevel;
  workMode: WorkMode;
  category: JobCategory;
  skills: Skill[];
  deadline: string;
  createdAt: string;
  isActive: boolean;
}

export interface JobFilterParams {
  keyword?: string;
  category?: JobCategory;
  skills?: number[];
  level?: JobLevel;
  workMode?: WorkMode;
  page?: number;
  size?: number;
}

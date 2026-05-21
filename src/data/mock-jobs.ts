import type { Job } from '@/types/job';

export const mockJobs: Job[] = [
  {
    id: '101',
    title: 'Frontend Intern',
    companyName: 'ABC Corp',
    description: 'Thực tập phát triển frontend cho dự án nội bộ',
    salary: 5000000,
    serviceFee: 500000,
    level: 'INTERN',
    jobType: 'INTERNSHIP',
    workMode: 'REMOTE',
    status: 'ACTIVE',
    jobCategory: 'IT_SOFTWARE',
    skills: [{ id: 1, name: 'React' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '102',
    title: 'Backend Intern',
    companyName: 'XYZ Ltd',
    description: 'Thực tập phát triển backend cho hệ thống mới',
    salary: 6000000,
    serviceFee: 600000,
    level: 'INTERN',
    jobType: 'INTERNSHIP',
    workMode: 'ONSITE',
    status: 'PENDING',
    jobCategory: 'IT_SOFTWARE',
    skills: [{ id: 2, name: 'Node.js' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const generateJobId = () => `job_${Date.now()}`;

export default mockJobs;

import type { Application } from '@/types/application';

export const mockApplications: Application[] = [
  {
    id: 1,
    applicantName: 'Nguyen Van A',
    applicantEmail: 'a.nguyen@example.com',
    jobId: 101,
    jobName: 'Frontend Intern',
    companyName: 'ABC Corp',
    resumeId: 1,
    resumeName: 'CV_Nguyen_Van_A.pdf',
    cvUrl: 'https://example.com/cv/1.pdf',
    status: 'PENDING',
    note: undefined,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    applicantName: 'Tran Thi B',
    applicantEmail: 'b.tran@example.com',
    jobId: 102,
    jobName: 'Backend Intern',
    companyName: 'XYZ Ltd',
    resumeId: 2,
    resumeName: 'CV_Tran_Thi_B.pdf',
    cvUrl: 'https://example.com/cv/2.pdf',
    status: 'REVIEWING',
    note: 'Chờ xác minh',
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default mockApplications;

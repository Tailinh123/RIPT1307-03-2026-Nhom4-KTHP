export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED';

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  resumeId: number;
  resumeName: string;
  status: ApplicationStatus;
  rejectNote?: string;
  appliedAt: string;
  updatedAt: string;
}

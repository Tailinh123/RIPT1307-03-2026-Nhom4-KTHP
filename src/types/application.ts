export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'REJECTED';

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  resumeId: number;
  resumeName: string;
  status: ApplicationStatus;
  rejectNote?: string;
  appliedAt: string;
  updatedAt: string;
}

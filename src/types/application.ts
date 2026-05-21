export const ApplicationStatus = {
  PENDING: 'PENDING' as const,
  REVIEWING: 'REVIEWING' as const,
  APPROVED: 'APPROVED' as const,
  REJECTED: 'REJECTED' as const,
};

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export interface Application {
  id: number;
  jobId: number;
  jobTitle?: string;
  jobName: string;
  companyName: string;
  resumeId: number;
  resumeName: string;
  applicantName: string;
  applicantEmail: string;
  cvUrl: string;
  status: ApplicationStatus;
  note?: string;
  rejectNote?: string;
  appliedAt: string;
  reviewedAt?: string;
  updatedAt: string;
}

export interface ApplicationFilter {
  status?: ApplicationStatus;
  jobName?: string;
}

export interface UpdateApplicationStatusRequest {
  id: number;
  status: ApplicationStatus;
  note?: string;
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'Chờ duyệt',
  [ApplicationStatus.REVIEWING]: 'Đang xem',
  [ApplicationStatus.APPROVED]: 'Đã duyệt',
  [ApplicationStatus.REJECTED]: 'Đã từ chối',
};

export const applicationStatusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: 'orange',
  [ApplicationStatus.REVIEWING]: 'blue',
  [ApplicationStatus.APPROVED]: 'green',
  [ApplicationStatus.REJECTED]: 'red',
};

export const applicationStatusOptions = Object.values(ApplicationStatus).map((status) => ({
  value: status,
  label: applicationStatusLabels[status],
}));
export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWING = "REVIEWING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  applicantName: string;
  applicantEmail: string;
  jobName: string;
  companyName: string;
  appliedAt: string;
  note?: string;
  cvUrl: string;
  reviewedAt?: string;
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
  [ApplicationStatus.PENDING]: "Chờ duyệt",
  [ApplicationStatus.REVIEWING]: "Đang xem xét",
  [ApplicationStatus.APPROVED]: "Đã duyệt",
  [ApplicationStatus.REJECTED]: "Từ chối",
};

export const applicationStatusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "orange",
  [ApplicationStatus.REVIEWING]: "blue",
  [ApplicationStatus.APPROVED]: "green",
  [ApplicationStatus.REJECTED]: "red",
};

export const applicationStatusOptions = Object.values(ApplicationStatus).map((status) => ({
  value: status,
  label: applicationStatusLabels[status],
}));
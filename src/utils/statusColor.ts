import type { ApplicationStatus } from '@/types/application';

export const statusColorMap: Record<ApplicationStatus, string> = {
  PENDING: 'default',
  REVIEWING: 'processing',
  INTERVIEW: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'error',
};

export const statusLabelMap: Record<ApplicationStatus, string> = {
  PENDING: 'Chờ xét duyệt',
  REVIEWING: 'Đang xem xét',
  INTERVIEW: 'Phỏng vấn',
  ACCEPTED: 'Đã chấp nhận',
  REJECTED: 'Bị từ chối',
};

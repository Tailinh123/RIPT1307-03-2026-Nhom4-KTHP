import type { ApplicationStatus } from '@/types/application';

export const statusColorMap: Record<ApplicationStatus, string> = {
  PENDING: 'orange',
  REVIEWING: 'blue',
  APPROVED: 'green',
  REJECTED: 'red',
};

export const statusLabelMap: Record<ApplicationStatus, string> = {
  PENDING: 'Chờ xét duyệt',
  REVIEWING: 'Đang xem xét',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Bị từ chối',
};

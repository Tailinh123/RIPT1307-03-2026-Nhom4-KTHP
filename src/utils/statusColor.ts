import type { ApplicationStatus } from '@/types/application';

/** Ant Design Tag / Badge preset colors */
export const statusColorMap: Record<ApplicationStatus, string> = {
  PENDING: 'warning',
  REVIEWING: 'processing',
  APPROVED: 'success',
  REJECTED: 'error',
};

/** Vietnamese display labels */
export const statusLabelMap: Record<ApplicationStatus, string> = {
  PENDING: 'Chờ xét duyệt',
  REVIEWING: 'Đang xem xét',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Bị từ chối',
};

/** Hex colors for custom usage */
export const statusHexMap: Record<ApplicationStatus, string> = {
  PENDING: '#faad14',
  REVIEWING: '#1677ff',
  APPROVED: '#52c41a',
  REJECTED: '#ff4d4f',
};

/** Background tint for status badges */
export const statusBgMap: Record<ApplicationStatus, string> = {
  PENDING: '#fffbe6',
  REVIEWING: '#e6f4ff',
  APPROVED: '#f6ffed',
  REJECTED: '#fff1f0',
};

/** Emoji indicators */
export const statusEmojiMap: Record<ApplicationStatus, string> = {
  PENDING: '🟡',
  REVIEWING: '🔵',
  APPROVED: '🟢',
  REJECTED: '🔴',
};

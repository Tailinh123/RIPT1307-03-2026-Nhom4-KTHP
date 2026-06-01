import type { JobCategory, JobLevel, WorkMode } from '@/types/job';
import type { SelectOption } from '@/types/common';

export const JOB_CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Công nghệ thông tin', value: 'IT_SOFTWARE' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Tài chính', value: 'FINANCE' },
  { label: 'Thiết kế', value: 'DESIGN' },
  { label: 'Kinh doanh', value: 'SALES' },
  { label: 'Nhân sự', value: 'HUMAN_RESOURCES' },
  { label: 'Giáo dục', value: 'EDUCATION' },
  { label: 'Khác', value: 'OTHER' },
];

export const JOB_LEVEL_OPTIONS: SelectOption[] = [
  { label: 'Thực tập sinh', value: 'INTERN' },
  { label: 'Fresher', value: 'FRESHER' },
  { label: 'Junior', value: 'JUNIOR' },
  { label: 'Middle', value: 'MIDDLE' },
  { label: 'Senior', value: 'SENIOR' },
];

export const WORK_MODE_OPTIONS: SelectOption[] = [
  { label: 'Tại văn phòng', value: 'ONSITE' },
  { label: 'Làm từ xa', value: 'REMOTE' },
  { label: 'Kết hợp', value: 'HYBRID' },
];

export const JOB_LEVEL_LABEL: Record<JobLevel, string> = {
  INTERN: 'Thực tập sinh',
  FRESHER: 'Fresher',
  JUNIOR: 'Junior',
  MIDDLE: 'Middle',
  SENIOR: 'Senior',
};

export const WORK_MODE_LABEL: Record<WorkMode, string> = {
  ONSITE: 'Tại văn phòng',
  REMOTE: 'Làm từ xa',
  HYBRID: 'Kết hợp',
};

export const CATEGORY_LABEL: Record<JobCategory, string> = {
  IT_SOFTWARE: 'Công nghệ thông tin',
  MARKETING: 'Marketing',
  FINANCE: 'Tài chính',
  DESIGN: 'Thiết kế',
  SALES: 'Kinh doanh',
  HUMAN_RESOURCES: 'Nhân sự',
  EDUCATION: 'Giáo dục',
  OTHER: 'Khác',
};

export const PAGE_SIZE = 12;
export const BASE_URL = '';

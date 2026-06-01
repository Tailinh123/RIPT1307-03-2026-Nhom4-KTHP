export interface AdminCompany {
  id: number;
  name: string;
  description?: string;
  address?: string;
  logoUrl?: string;
}
export interface AdminSkill {
  id: number;
  name: string;
}
export interface AdminPermission {
  id: number;
  name: string;
  apiPath: string;
  method: string;
  module: string;
}
export interface AdminRole {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  permissions?: AdminPermission[];
}
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  phone?: string;
  avatarUrl?: string;
  isSubscribed?: boolean;
  active?: boolean;
  company?: Pick<AdminCompany, 'id' | 'name'>;
  role?: Pick<AdminRole, 'id' | 'name'>;
  skills?: AdminSkill[];
}
export interface AdminJobCategory {
  id: number;
  name: string;
}
export interface AdminJob {
  id: number;
  name: string;
  description?: string;
  location?: string;
  quantity?: number;
  salary?: number;
  jobType?: string;
  workMode?: string;
  level?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  company?: Pick<AdminCompany, 'id' | 'name' | 'logoUrl'>;
  jobCategory?: AdminJobCategory;
  skills?: AdminSkill[];
}
export interface AdminResume {
  id: number;
  title: string;
  url?: string;
  user?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
export interface AdminApplication {
  id: number;
  name?: string;
  status?: 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  job?: {
    id: number;
    name?: string;
    location?: string;
    level?: string;
    workMode?: string;
    company?: Pick<AdminCompany, 'id' | 'name'> | null;
  };
  resume?: {
    id: number;
    title?: string;
    url?: string;
    user?: {
      id: number;
      name?: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      gender?: 'MALE' | 'FEMALE' | 'OTHER';
      address?: string;
      avatarUrl?: string;
      skills?: AdminSkill[];
    };
  };
}

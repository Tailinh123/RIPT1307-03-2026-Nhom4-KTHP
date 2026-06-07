export interface User {
  id: number;
  email: string;
  name: string;
  fullName?: string;
  avatarUrl?: string;
  avatar?: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  address?: string;
  isSubscribed?: boolean;
  skills?: { id: number; name: string }[];
  role?: any;
  company?: any;
}
export type UserProfile = User;
export interface UpdateProfilePayload {
  id?: number;
  name: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  address: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  skills?: any[];
  company?: { id: number } | null;
}

export interface UserProfile {
  id: number;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dob?: string;
  dateOfBirth?: string;
  avatar?: string;
  address?: string;
  skills: { id: number; name: string }[];
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
}
export interface UpdateProfilePayload {
  id?: number;
  name: string;
  phone?: string;
  dateOfBirth?: string;
  dob?: string;
  address: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  skills?: number[];
}
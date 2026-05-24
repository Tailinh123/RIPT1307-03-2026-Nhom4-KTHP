export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dob?: string;          // ISO date string "YYYY-MM-DD"
  address?: string;
  skills: { id: number; name: string }[];
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  dob: string;
  address: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  skills: number[];
}

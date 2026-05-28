export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dob?: string;      
  address?: string;
  skills: { id: number; name: string }[];
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
}
export interface UpdateProfilePayload {
  id?: number;       
  name: string;     
  dateOfBirth: string;  
  address: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';

}
export interface User {
  id: number;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  bio?: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
}

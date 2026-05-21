export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id?: number;
  email: string;
  name?: string;
  roleName: string;
  rawProfile: Record<string, unknown>;
}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<AuthUser>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

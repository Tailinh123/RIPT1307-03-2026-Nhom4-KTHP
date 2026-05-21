import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getProfileRequest, loginRequest, registerRequest } from '../api/auth.api';
import type { AuthContextValue, AuthUser, LoginFormValues, RegisterFormValues } from '../types/auth.types';
import { extractAccessToken, extractUserFromAuthPayload, mapProfileToAuthUser } from '../utils/auth-mappers';
import { clearStoredToken, getStoredToken, saveStoredToken } from '../utils/auth-storage';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function normalizeErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    clearStoredToken();
    setAccessToken(null);
    setCurrentUser(null);
  };

  const loadProfile = async () => {
    const profile = await getProfileRequest();
    const mappedUser = mapProfileToAuthUser(profile);
    setCurrentUser(mappedUser);
    return mappedUser;
  };

  const login = async (values: LoginFormValues) => {
    try {
      const loginData = await loginRequest(values);
      const token = extractAccessToken(loginData);

      if (!token) {
        throw new Error('Backend dang nhap chua tra ve access token de frontend luu lai.');
      }

      saveStoredToken(token, values.rememberMe ? 'local' : 'session');
      setAccessToken(token);

      const loginUser = extractUserFromAuthPayload(loginData);
      if (loginUser) {
        const mappedUser = mapProfileToAuthUser(loginUser);
        setCurrentUser(mappedUser);
        return mappedUser;
      }

      return await loadProfile();
    } catch (error) {
      throw new Error(normalizeErrorMessage(error, 'Dang nhap that bai.'));
    }
  };

  const register = async (values: RegisterFormValues) => {
    try {
      await registerRequest(values);
    } catch (error) {
      throw new Error(normalizeErrorMessage(error, 'Dang ky that bai.'));
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setAccessToken(storedToken);
        await loadProfile();
      } catch {
        clearStoredToken();
        setAccessToken(null);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

  useEffect(() => {
    const handleExternalLogout = () => {
      setAccessToken(null);
      setCurrentUser(null);
    };

    window.addEventListener('auth:logout', handleExternalLogout);
    return () => window.removeEventListener('auth:logout', handleExternalLogout);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      accessToken,
      isAuthenticated: Boolean(accessToken && currentUser),
      isLoading,
      login,
      register,
      logout
    }),
    [accessToken, currentUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };

import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { authApi } from '@/api/authApi';
import {
  clearAuthSession,
  ensureRoleActive,
  INACTIVE_ROLE_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
  setAuthNotice,
} from '@/utils/authStatus';
interface ProtectedRouteProps {
  allowedRoles?: string[];
}
interface StoredUser {
  id?: number;
  email?: string;
  name?: string;
  role?: {
    id?: number;
    name?: string;
    active?: boolean;
  };
  company?: {
    id?: number;
    name?: string;
  };
}
const getDefaultRedirect = (role?: string) => {
  if (role === 'SUPER_ADMIN') return '/admin/dashboard';
  if (role === 'HR_MANAGER') return '/profile/company-dashboard';
  if (role === 'CANDIDATE') return '/jobs';
  return '/login';
};
const readStoredUser = (): StoredUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as StoredUser;
  } catch {
    return null;
  }
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const [checking, setChecking] = useState(Boolean(token));
  const [user, setUser] = useState<StoredUser | null>(() => readStoredUser());
  const [authFailed, setAuthFailed] = useState(false);
  useEffect(() => {
    if (!token) {
      setChecking(false);
      setAuthFailed(true);
      return;
    }
    let cancelled = false;
    const validateSession = async () => {
      try {
        const account = await authApi.getAccount();
        if (cancelled) return;
        const mergedUser = { ...readStoredUser(), ...account };
        const roleIsActive = await ensureRoleActive(mergedUser.role);
        if (cancelled) return;
        if (!roleIsActive) {
          clearAuthSession();
          setAuthNotice(INACTIVE_ROLE_MESSAGE);
          setUser(null);
          setAuthFailed(true);
          return;
        }
        localStorage.setItem('user', JSON.stringify(mergedUser));
        setUser(mergedUser);
        setAuthFailed(false);
      } catch {
        if (cancelled) return;
        clearAuthSession();
        setAuthNotice(SESSION_EXPIRED_MESSAGE);
        setUser(null);
        setAuthFailed(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    validateSession();
    return () => {
      cancelled = true;
    };
  }, [token]);
  const role = user?.role?.name;
  const redirectTo = useMemo(() => getDefaultRedirect(role), [role]);
  if (checking) {
    return (
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin />
      </div>
    );
  }
  if (authFailed || !token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};
export default ProtectedRoute;

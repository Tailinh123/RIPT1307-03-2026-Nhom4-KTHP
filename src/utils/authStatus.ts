import { authApi } from '@/api/authApi';
export const INACTIVE_ROLE_MESSAGE =
  'Vai trò của tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.';
export const INACTIVE_ACCOUNT_MESSAGE =
  'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.';
export const SESSION_EXPIRED_MESSAGE = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
const AUTH_NOTICE_KEY = 'internmatching.auth.notice';
export const clearAuthSession = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_cache_phone');
};
export const setAuthNotice = (message: string) => {
  sessionStorage.setItem(AUTH_NOTICE_KEY, message);
};
export const consumeAuthNotice = () => {
  const message = sessionStorage.getItem(AUTH_NOTICE_KEY);
  if (message) sessionStorage.removeItem(AUTH_NOTICE_KEY);
  return message;
};
export const ensureRoleActive = async (role?: { id?: number | string; active?: boolean } | null) => {
  if (!role?.id) return true;
  if (role.active === false) return false;
  try {
    const currentRole = await authApi.getRoleById(role.id);
    return currentRole?.active !== false;
  } catch (error) {
    return true;
  }
};

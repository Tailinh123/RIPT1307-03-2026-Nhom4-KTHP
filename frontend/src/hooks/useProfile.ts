import { useState, useCallback } from 'react';
import { userApi } from '@/api/userApi';
import type { UserProfile, UpdateProfilePayload } from '@/types/user';
import { getBackendMessage } from '@/utils/backendMessage';
function mapBackendToProfile(data: any): UserProfile {
  return {
    id: data.id,
    fullName: data.name || data.fullName || '',
    name: data.name,
    email: data.email || '',
    phone: data.phone || undefined,
    gender: data.gender || undefined,
    dateOfBirth: data.dateOfBirth || undefined,
    avatar: data.avatarUrl || data.avatar || undefined,
    address: data.address || undefined,
    skills: data.skills || [],
    role: data.role?.name || 'STUDENT',
    avatarUrl: data.avatarUrl,
  } as UserProfile;
}
interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  connectionError: string | null;
  fetchProfile: () => Promise<UserProfile | null>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<string>;
}
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setConnectionError(null);
    try {
      const res = await userApi.getProfile();
      const rawData = res.data?.data || res.data;
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      if (currentUser?.id) {
        const cachedStr = localStorage.getItem('user_cache_phone') || '{}';
        const cached = JSON.parse(cachedStr);
        if (cached[currentUser.id] && !rawData.phone) {
          rawData.phone = cached[currentUser.id];
        }
      }
      const nextProfile = mapBackendToProfile(rawData);
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      console.error(error);
      setConnectionError('Không lấy được dữ liệu hồ sơ. Vui lòng thử lại sau.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    if (!profile) return 'Không tìm thấy hồ sơ người dùng.';
    setSaving(true);
    try {
      const res = await userApi.updateProfile(payload);
      const cachedStr = localStorage.getItem('user_cache_phone') || '{}';
      const cached = JSON.parse(cachedStr);
      cached[profile.id] = payload.phone || '';
      localStorage.setItem('user_cache_phone', JSON.stringify(cached));
      const rawData = res.data?.data || res.data;
      if (!rawData.phone) rawData.phone = payload.phone || cached[profile.id];
      if (!rawData.email) rawData.email = profile.email;
      if (!rawData.skills) rawData.skills = profile.skills;
      setProfile(mapBackendToProfile(rawData));
      setConnectionError(null);
      return getBackendMessage(res.data, 'Cập nhật hồ sơ thành công.');
    } catch (error: any) {
      throw error;
    } finally {
      setSaving(false);
    }
  }, [profile]);
  return { profile, loading, saving, connectionError, fetchProfile, updateProfile };
}

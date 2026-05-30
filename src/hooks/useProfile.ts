import { useState, useCallback } from 'react';
import { userApi } from '@/api/userApi';
import type { UserProfile, UpdateProfilePayload } from '@/types/user';

const MOCK_PROFILE: UserProfile = {
  id: 1,
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@student.edu.vn',
  phone: '0912 345 678',
  gender: 'MALE',
  dob: '2002-05-15',
  address: 'Hà Nội',
  skills: [
    { id: 1, name: 'React' },
    { id: 2, name: 'TypeScript' },
    { id: 6, name: 'SQL' },
  ],
  role: 'STUDENT',
};

function mapBackendToProfile(data: any): UserProfile {
  return {
    id: data.id,
    fullName: data.name || data.fullName || '',
    name: data.name,
    email: data.email || '',
    phone: data.phone || undefined,
    gender: data.gender || undefined,
    dob: data.dateOfBirth || data.dob || undefined,
    dateOfBirth: data.dateOfBirth || data.dob || undefined,
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
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
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

      // Bổ sung phone từ cache nếu backend không trả về
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;
      if (currentUser?.id) {
        const cachedStr = localStorage.getItem('user_cache_phone') || '{}';
        const cached = JSON.parse(cachedStr);
        if (cached[currentUser.id] && !rawData.phone) {
          rawData.phone = cached[currentUser.id];
        }
      }

      setProfile(mapBackendToProfile(rawData));
    } catch (error) {
      console.error(error);
      setConnectionError(
        'Không lấy được dữ liệu từ DB. Đang hiển thị dữ liệu mẫu.'
      );
      setProfile(MOCK_PROFILE);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await userApi.updateProfile(payload);
      
      // Luôn lưu phone vào cache (backend mapper không trả về phone)
      const cachedStr = localStorage.getItem('user_cache_phone') || '{}';
      const cached = JSON.parse(cachedStr);
      cached[profile.id] = payload.phone || '';
      localStorage.setItem('user_cache_phone', JSON.stringify(cached));

      const rawData = res.data?.data || res.data;
      // Backend UpdatedUserResponse không có phone → bổ sung từ payload
      if (!rawData.phone) rawData.phone = payload.phone || cached[profile.id];

      setProfile(mapBackendToProfile(rawData));
      setConnectionError(null);

    } catch {
      setProfile((prev: any) =>
        prev
          ? {
              ...prev,
              fullName: payload.name,
              name: payload.name,
              phone: payload.phone,
              dob: payload.dob || payload.dateOfBirth,
              dateOfBirth: payload.dateOfBirth || payload.dob,
              address: payload.address,
              gender: payload.gender,
              skills: payload.skills
                ? payload.skills.map((id) => ({
                    id,
                    name: prev.skills?.find((s: any) => s.id === id)?.name ?? `Skill #${id}`,
                  }))
                : prev.skills,
            }
          : prev
      );
      throw new Error('API unavailable');
    } finally {
      setSaving(false);
    }
  }, [profile]);

  return { profile, loading, saving, connectionError, fetchProfile, updateProfile };
}
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

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  /** null = not yet fetched, string = error, false = ok */
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
      setProfile(res.data.data);
    } catch {
      setConnectionError(
        'Không kết nối được Backend. Đang hiển thị dữ liệu mẫu.'
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
      const res = await userApi.updateProfile(profile.id, payload);
      setProfile(res.data.data);
      setConnectionError(null);
    } catch {
      // Optimistic update with mock
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              fullName: payload.name,
              phone: payload.phone,
              dob: payload.dob,
              address: payload.address,
              gender: payload.gender,
              skills: payload.skills.map((id) => ({
                id,
                name: prev.skills.find((s) => s.id === id)?.name ?? `Skill #${id}`,
              })),
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

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

/**
 * Map backend ResUserDTO → frontend UserProfile
 * Backend fields: id, name, email, dateOfBirth, gender, address, phone, avatarUrl, isSubscribed, company, role, skills
 */
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
    // Keep raw backend fields accessible
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
      // 1. Lấy thông tin user đăng nhập từ bộ nhớ trình duyệt
      const userStr = localStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!currentUser || !currentUser.id) {
        throw new Error("Không tìm thấy ID người dùng!");
      }

      // 2. Gọi API kèm ID để lấy full thông tin
      const res = await userApi.getProfile(currentUser.id);
      const rawData = res.data?.data || res.data;
      
      // Workaround: Backend không trả về phone khi GET profile
      // Nên ta dùng lại phone đã lưu cục bộ nếu có
      const cachedStr = localStorage.getItem('user_cache_phone') || '{}';
      const cached = JSON.parse(cachedStr);
      if (cached[currentUser.id] && !rawData.phone) {
        rawData.phone = cached[currentUser.id];
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
      const res = await userApi.updateProfile(profile.id, payload);
      
      // Workaround: Lưu phone vào cache cục bộ vì backend không trả về
      if (payload.phone) {
        const cachedStr = localStorage.getItem('user_cache_phone') || '{}';
        const cached = JSON.parse(cachedStr);
        cached[profile.id] = payload.phone;
        localStorage.setItem('user_cache_phone', JSON.stringify(cached));
      }

      const rawData = res.data?.data || res.data;
      // Trả lại phone từ payload để set state hiện tại
      if (!rawData.phone && payload.phone) {
        rawData.phone = payload.phone;
      }
      
      setProfile(mapBackendToProfile(rawData));
      setConnectionError(null);
    } catch {
      // Giữ nguyên giao diện mượt mà (Optimistic update) nếu API sập
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
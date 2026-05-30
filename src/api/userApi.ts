import axiosClient from "./axiosClient";
import type { UpdateProfilePayload } from "@/types/user";

interface BackendWrapper<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}

export const userApi = {
  getProfile: () =>
    axiosClient.get<BackendWrapper<any>>(`/api/v1/auth/profile`),

  updateProfile: (payload: UpdateProfilePayload) =>
    axiosClient.put<BackendWrapper<any>>(`/api/v1/auth/profile`, payload),
};
import axiosClient from "./axiosClient";
import type { UpdateProfilePayload } from "@/types/user";

interface BackendWrapper<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}

export const userApi = {
  getProfile: (id: string | number) =>
    axiosClient.get<BackendWrapper<any>>(`/api/v1/users/${id}`),

  updateProfile: (id: string | number, payload: UpdateProfilePayload) =>
    axiosClient.put<BackendWrapper<any>>(`/api/v1/users/${id}`, payload),
};
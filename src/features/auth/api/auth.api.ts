import { axiosClient } from '../../../services/api/axiosClient';
import type { LoginFormValues, RegisterFormValues, ApiEnvelope } from '../types/auth.types';

type UnknownRecord = Record<string, unknown>;

export async function loginRequest(values: LoginFormValues) {
  const response = await axiosClient.post<ApiEnvelope<unknown>>('/api/v1/auth/login', {
    username: values.email,
    password: values.password
  });

  return response.data.data;
}

export async function registerRequest(values: RegisterFormValues) {
  const response = await axiosClient.post<ApiEnvelope<unknown>>('/api/v1/auth/register', {
    name: values.name,
    email: values.email,
    password: values.password,
    age: values.age ? Number(values.age) : null,
    gender: values.gender,
    address: values.address
  });

  return response.data.data;
}

export async function getProfileRequest() {
  const response = await axiosClient.get<ApiEnvelope<UnknownRecord>>('/api/v1/auth/account');
  return response.data.data;
}

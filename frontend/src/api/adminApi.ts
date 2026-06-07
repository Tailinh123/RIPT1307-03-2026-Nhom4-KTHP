import axiosClient from './axiosClient';
export interface BackendWrapper<T> {
  statusCode: number;
  error?: string | null;
  message?: string;
  data: T;
}
export interface BackendMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}
export interface BackendPage<T> {
  meta: BackendMeta;
  result: T[];
}
export interface AdminListParams {
  page?: number;
  size?: number;
  filter?: string;
  sort?: string | string[];
}
const unwrapPage = <T>(response: BackendWrapper<BackendPage<T>>): BackendPage<T> => {
  return response.data || { meta: { page: 1, pageSize: 10, pages: 0, total: 0 }, result: [] };
};
const list = async <T>(endpoint: string, params: AdminListParams = {}) => {
  const res = await axiosClient.get<BackendWrapper<BackendPage<T>>>(endpoint, {
    params: {
      page: params.page ?? 1,
      size: params.size ?? 10,
      filter: params.filter,
      sort: params.sort,
    },
  });
  return unwrapPage<T>(res.data);
};
const create = async <T>(endpoint: string, payload: unknown) => {
  const res = await axiosClient.post<BackendWrapper<T>>(endpoint, payload);
  return res.data;
};
const update = async <T>(endpoint: string, payload: unknown) => {
  const res = await axiosClient.put<BackendWrapper<T>>(endpoint, payload);
  return res.data;
};
const remove = async (endpoint: string, id: number | string) => {
  const res = await axiosClient.delete<BackendWrapper<unknown>>(`${endpoint}/${id}`);
  return res.data;
};
export const adminApi = {
  users: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/users', params),
    create: <T>(payload: unknown) => create<T>('/api/v1/users', payload),
    update: <T>(id: number | string, payload: unknown) => update<T>(`/api/v1/users/${id}`, payload),
    remove: (id: number | string) => remove('/api/v1/users', id),
  },
  companies: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/companies', params),
    create: <T>(payload: unknown) => create<T>('/api/v1/companies', payload),
    update: <T>(payload: unknown) => update<T>('/api/v1/companies', payload),
    remove: (id: number | string) => remove('/api/v1/companies', id),
  },
  jobs: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/jobs', params),
    create: <T>(payload: unknown) => create<T>('/api/v1/jobs', payload),
    update: <T>(payload: unknown) => update<T>('/api/v1/jobs', payload),
    remove: (id: number | string) => remove('/api/v1/jobs', id),
  },
  skills: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/skills', params),
    create: <T>(payload: unknown) => create<T>('/api/v1/skills', payload),
    update: <T>(payload: unknown) => update<T>('/api/v1/skills', payload),
    remove: (id: number | string) => remove('/api/v1/skills', id),
  },
  resumes: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/resumes', params),
    remove: (id: number | string) => remove('/api/v1/resumes', id),
  },
  applications: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/applications', params),
    update: <T>(payload: unknown) => update<T>('/api/v1/applications', payload),
    remove: (id: number | string) => remove('/api/v1/applications', id),
  },
  roles: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/roles', params),
    create: <T>(payload: unknown) => create<T>('/api/v1/roles', payload),
    update: <T>(payload: unknown) => update<T>('/api/v1/roles', payload),
    remove: (id: number | string) => remove('/api/v1/roles', id),
  },
  permissions: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/permissions', params),
    create: <T>(payload: unknown) => create<T>('/api/v1/permissions', payload),
    update: <T>(payload: unknown) => update<T>('/api/v1/permissions', payload),
    remove: (id: number | string) => remove('/api/v1/permissions', id),
  },
  categories: {
    list: <T>(params?: AdminListParams) => list<T>('/api/v1/job-categories', params),
  },
};

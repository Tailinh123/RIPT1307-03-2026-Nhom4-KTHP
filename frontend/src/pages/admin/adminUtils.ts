import type { BackendPage } from '@/api/adminApi';
export const loadAll = async <T>(pageOrLoader: Promise<BackendPage<T>> | (() => Promise<BackendPage<T>>)) => {
  const page = typeof pageOrLoader === 'function' ? await pageOrLoader() : await pageOrLoader;
  return page.result || [];
};
export const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
};
export const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};
export const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};
export const toIdObject = (id?: number | string | null) => {
  if (!id) return null;
  return { id };
};
export const toIdObjects = (ids?: Array<number | string>) => {
  return (ids || []).map((id) => ({ id }));
};

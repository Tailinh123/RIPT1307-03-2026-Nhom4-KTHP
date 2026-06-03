export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface PaginatedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
export interface MetaResponse {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}
export interface ResultPaginationResponse<T = any> {
  meta: MetaResponse;
  result: T[];
}
export function convertResultToPaginatedData<T>(
  response: ResultPaginationResponse<T>
): PaginatedData<T> {
  return {
    content: response.result,
    totalElements: response.meta.total,
    totalPages: response.meta.pages,
    page: response.meta.page, 
    size: response.meta.pageSize,
  };
}
export interface PaginationParams {
  page?: number;
  size?: number;
}

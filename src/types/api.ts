// ─── Common API response wrapper ────────────────────────────────────────────
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

// ─── Backend response format (from Spring Boot) ────────────────────────────
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

// ─── Converter to map backend response to frontend format ──────────────────
export function convertResultToPaginatedData<T>(
  response: ResultPaginationResponse<T>
): PaginatedData<T> {
  return {
    content: response.result,
    totalElements: response.meta.total,
    totalPages: response.meta.pages,
    page: response.meta.page - 1, // Backend uses 1-based, frontend uses 0-based
    size: response.meta.pageSize,
  };
}

// ─── Query params ────────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  size?: number;
}

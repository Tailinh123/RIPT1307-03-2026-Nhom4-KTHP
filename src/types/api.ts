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

// ─── Query params ────────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  size?: number;
}

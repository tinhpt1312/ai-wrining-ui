export interface ApiError {
  statusCode: number;
  errorCode?: string;
  message: string;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  pagination?: PaginationMeta;
}

export interface BackendListResponse<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
  pagination?: PaginationMeta;
}

export interface BackendDataResponse<T> {
  data: T;
}

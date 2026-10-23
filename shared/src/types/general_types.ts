export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  succes: boolean;
  message?: string;
  data: T
}
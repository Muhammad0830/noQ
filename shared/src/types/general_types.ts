export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
}
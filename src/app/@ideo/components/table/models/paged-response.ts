export interface PagedResponse<T> {
  total: number;
  data: T[];
}

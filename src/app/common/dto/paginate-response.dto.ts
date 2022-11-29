export interface PaginateRes<T> {
  rows: T[];
  info: {
    page: number;
    pageSize: number;
    nextPage: number | null;
    totalCount: number;
    totalPages: number;
  };
}

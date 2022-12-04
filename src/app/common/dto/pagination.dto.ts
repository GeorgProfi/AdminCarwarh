export interface Pagination {
  page: number;
  pageSize: number;
  search: string;
  sorter: string;
  direction: -1 | 1;
}

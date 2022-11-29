import { Pagination } from '../../../common/interfaces/pagination.interface';

export interface GetServicesListDto extends Pagination {
  filialId?: string;
  search?: string;
}

import { Pagination } from '../../../common/dto/pagination.dto';

export interface GetServicesListDto extends Pagination {
  filialId?: string;
  search?: string;
}

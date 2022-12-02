import { Pagination } from '../../../common/dto/pagination.dto';

export interface GetFilialListDto extends Pagination {
  search?: string;
}

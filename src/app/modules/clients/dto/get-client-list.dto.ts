import { Pagination } from '../../../common/dto/pagination.dto';

export interface GetClientListDto extends Pagination {
  search?: string;
}

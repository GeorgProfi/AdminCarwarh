import { Pagination } from '../../../common/dto/pagination.dto';

export interface GetStationListDto extends Pagination {
  search?: string;
}

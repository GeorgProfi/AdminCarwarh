import { Pagination } from '../../../common/dto/pagination.dto';

export interface GetServicesListDto extends Pagination {
  stationId?: string;
  search?: string;
}

import { Pagination } from '../pagination.dto';

export interface GetServicesListDto extends Pagination {
  stationId?: string;
}

export class SearchFreeTimesDto {
  stationId!: string;
  servicesIds!: string[];
  day!: Date;
  postId?: string;
}

export class CreateReservationDto {
  clientId!: string;
  stationId!: string;
  servicesIds!: string[];
  date!: Date;
  postId?: string;
}

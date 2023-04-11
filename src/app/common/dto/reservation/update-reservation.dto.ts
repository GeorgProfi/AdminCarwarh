export class UpdateReservationDto {
  orderId!: string;
  clientId?: string;
  servicesIds?: string[];
  status?: number;
}

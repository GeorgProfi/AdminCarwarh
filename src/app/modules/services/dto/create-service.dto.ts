export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  duration?: Date;
  discount?: number;
  stationIds: string[];
}

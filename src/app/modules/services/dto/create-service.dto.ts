export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  duration?: number;
  discount?: number;
}

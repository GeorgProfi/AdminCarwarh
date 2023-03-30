import { Order } from './order.entity';
import { Service } from './service.entity';
import { Station } from './station.entity';

export class Post {
  id!: string;

  station!: Station;
  stationId!: string;

  services!: Service[];

  orders!: Order[];

  name!: string;
}

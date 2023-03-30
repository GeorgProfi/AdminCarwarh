import { EStatusOrder } from '../enums/status-order.enum';
import { Service } from './service.entity';
import { Post } from './post.entity';
import { Station } from './station.entity';

export class Order {
  id!: string;

  station!: Station;
  stationId!: string;

  post!: Post;
  postId!: string;

  services!: Service[];

  clientId!: string;

  createdAt!: Date;

  startWork!: Date;

  endWork!: Date;

  priceTotal!: number;

  discount!: number;

  bonusesReceived!: number;

  bonusesUsed!: number;

  status!: EStatusOrder;

  ownerCreator!: boolean;
}

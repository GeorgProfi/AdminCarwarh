import { Card } from './card.entity';

export class Client {
  id!: string;
  carWashId!: string;
  name!: string;
  sex!: boolean; // male = true
  phone!: string;
  dateOfRegistration!: Date;
  email!: string;
  card!: Card;
  cardId!: string;
  enablePush!: boolean;
  enableSms!: boolean;
}

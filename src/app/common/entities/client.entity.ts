export class Client {
  constructor(props?: Partial<Client>) {
    Object.assign(this, props);
  }
  toString() {
    return `${this.name?.length ? this.name : 'Не указано'} (${this.phone})`;
  }

  id!: string;
  carWashId!: string;
  name!: string;
  sex!: boolean; // male = true
  phone!: string;
  dateOfRegistration!: Date;
  email!: string;
  cardId!: string;
  enablePush!: boolean;
  enableSms!: boolean;

  stringify = (item: { name: string }): string => `${item.name}`;
}

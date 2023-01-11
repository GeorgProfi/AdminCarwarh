export class Service {
  constructor(props?: Partial<Service>) {
    Object.assign(this, props);
  }

  id!: string;
  stationId!: string;
  name!: string;
  type!: string;
  price!: number;
  discount!: number;
  bonuses!: number;

  toString(): string {
    return `${this.name}`;
  }
}

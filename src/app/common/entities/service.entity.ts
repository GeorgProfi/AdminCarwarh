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
  bonusPercentage!: number;
  duration!: number;
  visible!: boolean;
}

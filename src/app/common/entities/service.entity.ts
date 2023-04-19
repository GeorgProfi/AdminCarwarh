import { ClassService } from './class-service.entity';

export class Service {
  id!: string;
  stationId!: string;
  name!: string;
  type!: string;
  price!: number;
  discount!: number;
  bonusPercentage!: number;
  duration!: number;
  visible!: boolean;
  classServices!: ClassService;
}

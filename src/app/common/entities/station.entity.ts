import { Service } from './service.entity';

export interface Station {
  readonly id: string;
  readonly address: string;
  readonly name: string;
  readonly postCount: number;
  readonly startWork: Date;
  readonly endWork: Date;
  readonly description: string;
  readonly services: Service[];
}

import { Service } from './service.entity';

export interface Station {
  readonly id: string;
  readonly address: string;
  readonly name: string;
  readonly postCount: number;
  readonly startWork: number;
  readonly endWork: number;
  readonly description: string;
  readonly services: Service[];
}

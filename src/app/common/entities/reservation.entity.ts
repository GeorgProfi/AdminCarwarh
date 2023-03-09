import { Client } from './client.entity';
import { Service } from './service.entity';
import { Station } from './station.entity';

export interface Reservation {
  id: string;

  station: Station;

  service: Service;

  client: Client;

  startWork: Date;

  endWork: Date;
  post: {
    name: string;
    id: string;
  };

  time: number;
  duration: number;
}

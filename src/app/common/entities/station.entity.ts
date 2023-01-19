import { Service } from './service.entity';

export interface Station {
  id: string;
  address: string;
  name: string;
  postCount: number;
  startWork: Date;
  endWork: Date;
  description: string;

  // на беке цифрой статус прилетает, на фронте надо строчкой вывести
  status: number | string;
  services: Service[];
}

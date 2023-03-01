export interface CreateStationDto {
  address: string;
  name: string;
  postCount: number;
  startWork: Date;
  endWork: Date;
  aroundClock: boolean;
  description?: string;
}

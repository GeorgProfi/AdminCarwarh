export interface CreateStationDto {
  address: string;
  name: string;
  startWork?: Date;
  endWork: Date;
  aroundClock?: boolean;
  description?: string;
}

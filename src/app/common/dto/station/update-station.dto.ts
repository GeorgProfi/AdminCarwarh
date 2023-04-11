export class UpdateStationDto {
  id!: string;
  name?: string;
  address?: string;
  startWork?: Date;
  endWork?: Date;
  aroundClock?: boolean;
  description?: string;
}

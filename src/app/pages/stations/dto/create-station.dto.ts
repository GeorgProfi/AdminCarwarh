export interface CreateStationDto {
  name: string;
  postCount: number;
  startWork: Date;
  endWork: Date;
  description?: string;
}

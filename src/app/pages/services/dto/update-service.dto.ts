import { CreateServiceDto } from './create-service.dto';

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

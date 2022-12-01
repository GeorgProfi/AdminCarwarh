import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GetServicesListDto } from './dto/get-services-list.dto';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { Service } from '../../common/entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Observable } from 'rxjs';

@Injectable()
export class ServicesService {
  constructor(private http: HttpClient) {}

  getServicesList(data: GetServicesListDto): Observable<PaginateRes<Service>> {
    return this.http.get<PaginateRes<Service>>(
      `${environment.apiUrl}/services`,
      {
        params: { ...data },
      }
    );
  }

  createService(data: CreateServiceDto) {
    return this.http.post<Service>(`${environment.apiUrl}/services`, data);
  }

  getServiceById(id: string) {
    return this.http.get<Service>(`${environment.apiUrl}/services/get/${id}`);
  }

  updateService(id: string, data: UpdateServiceDto) {
    return this.http.put<Service>(`${environment.apiUrl}/services/${id}`, data);
  }

  deleteService(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/services/get/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from './service.interface';
import { environment } from '../../../environments/environment';
import { GetServicesListDto } from './dto/get-services-list.dto';
import { PaginateRes } from '../../common/interfaces/paginate-response.interface';

@Injectable()
export class ServicesService {
  constructor(private http: HttpClient) {}

  getServicesList(data: GetServicesListDto) {
    return this.http.get<PaginateRes<Service>>(
      `${environment.apiUrl}/services`,
      {
        params: { ...data },
      }
    );
  }

  createService(data: Service) {
    return this.http.post<Service>(`${environment.apiUrl}/services`, data);
  }

  getServiceById(id: string) {
    return this.http.get<Service>(`${environment.apiUrl}/services/get/${id}`);
  }

  updateService(id: string, data: Service) {
    return this.http.put<Service>(`${environment.apiUrl}/services/${id}`, data);
  }

  deleteService(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/services/get/${id}`);
  }
}

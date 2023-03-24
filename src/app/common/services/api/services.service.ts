import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GetServicesListDto } from '../../dto/services/get-services-list.dto';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { Service } from '../../entities/service.entity';
import { CreateServiceDto } from '../../dto/services/create-service.dto';
import { UpdateServiceDto } from '../../dto/services/update-service.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  constructor(private http: HttpClient) {}

  getAllClassServices(stationId?: string): Observable<Service[]> {
    if (stationId) {
      return this.http.get<Service[]>(`${environment.apiUrl}/services/all`, {
        params: {
          stationId,
        },
      });
    }
    return this.http.get<Service[]>(`${environment.apiUrl}/services/all`);
  }

  getServicesList(data: GetServicesListDto): Observable<PaginateRes<Service>> {
    console.log(data);
    return this.http.get<PaginateRes<Service>>(`${environment.apiUrl}/services`, { params: { ...data } });
  }

  createService(data: CreateServiceDto) {
    return this.http.post<Service>(`${environment.apiUrl}/services`, data);
  }

  getServiceById(id: string) {
    return this.http.get<Service>(`${environment.apiUrl}/services/get/${id}`);
  }

  getServicesForClass(id: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/services/get-services-for-class/${id}`);
  }

  updateService(id: string, data: UpdateServiceDto) {
    return this.http.put<Service>(`${environment.apiUrl}/services/${id}`, data);
  }

  removeServiceClass(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/services/delete/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GetServicesListDto } from '../../dto/services/get-services-list.dto';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { Service } from '../../entities/service.entity';
import { CreateServiceDto } from '../../dto/services/create-service.dto';
import { UpdateServiceDto } from '../../dto/services/update-service.dto';
import { Observable } from 'rxjs';
import { ClassService } from '../../entities/class-service.entity';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  constructor(private http: HttpClient) {}

  getAllClassServices(): Observable<ClassService[]> {
    return this.http.get<ClassService[]>(`${environment.apiOwnerUrl}/services/owner/all`);
  }

  getAllStationServices(stationId: string) {
    return this.http.get<Service[]>(`${environment.apiOwnerUrl}/services/on-station/all/${stationId}`);
  }

  getServicesList(data: GetServicesListDto): Observable<PaginateRes<Service>> {
    console.log(data);
    return this.http.get<PaginateRes<Service>>(`${environment.apiOwnerUrl}/services`, { params: { ...data } });
  }

  createService(data: CreateServiceDto) {
    return this.http.post<Service>(`${environment.apiOwnerUrl}/services`, data);
  }

  getServiceById(id: string) {
    return this.http.get<Service>(`${environment.apiOwnerUrl}/services/get/${id}`);
  }

  getServicesForClass(id: string) {
    return this.http.get<any[]>(`${environment.apiOwnerUrl}/services/get-services-for-class/${id}`);
  }

  updateService(id: string, data: UpdateServiceDto) {
    return this.http.put<Service>(`${environment.apiOwnerUrl}/services/${id}`, data);
  }

  removeServiceClass(id: string) {
    return this.http.delete<void>(`${environment.apiOwnerUrl}/services/delete/${id}`);
  }
}

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

  getAllClasses(visible?: boolean): Observable<ClassService[]> {
    // отсутствие visible - означает, что не важно состояние visible,
    // а false означает, что важно чтобы visible был false
    // При указании visible вернуться только те услуги, которые привязаны хотя бы к одной станции!
    const data: any = {};
    if (visible !== undefined) {
      data.visible = visible;
    }
    return this.http.get<ClassService[]>(`${environment.apiOwnerUrl}/services/all`, {
      params: data,
    });
  }

  getServicesList(data: GetServicesListDto): Observable<PaginateRes<Service>> {
    return this.http.get<PaginateRes<Service>>(`${environment.apiOwnerUrl}/services`, { params: { ...data } });
  }

  createService(data: CreateServiceDto) {
    return this.http.post<Service>(`${environment.apiOwnerUrl}/services`, data);
  }

  getServiceById(id: string) {
    return this.http.get<Service>(`${environment.apiOwnerUrl}/services/get/${id}`);
  }

  getServicesForClass(id: string, visible?: boolean) {
    // отсутствие visible - означает, что не важно состояние visible,
    // а false означает, что важно чтобы visible был false
    // При указании visible вернуться только те услуги, которые привязаны хотя бы к одной станции!
    const data: any = {};
    if (visible !== undefined) {
      data.visible = visible;
    }
    return this.http.get<any[]>(`${environment.apiOwnerUrl}/services/get-services-for-class/${id}`, {
      params: data,
    });
  }

  updateService(id: string, data: UpdateServiceDto) {
    return this.http.put<Service>(`${environment.apiOwnerUrl}/services/${id}`, data);
  }

  removeServiceClass(id: string) {
    return this.http.delete<void>(`${environment.apiOwnerUrl}/services/delete/${id}`);
  }
}

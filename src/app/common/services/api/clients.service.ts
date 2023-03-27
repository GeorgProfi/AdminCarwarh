import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { Client } from '../../entities/client.entity';
import { environment } from '../../../../environments/environment';
import { Pagination } from '../../dto/pagination.dto';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  constructor(private http: HttpClient) {}

  searchClient(search: string) {
    //console.log(search);
    return this.http.get<Client[]>(`${environment.apiUrl}/client/search`, {
      params: { search },
    });
  }

  getClientsList(data: Pagination) {
    return this.http.get<PaginateRes<Client>>(`${environment.apiUrl}/client/list`, { params: { ...data } });
  }

  createClient(data: { phone: string; name?: string }) {
    return this.http.post<Client>(`${environment.apiUrl}/client/create`, {
      phone: data.phone,
      name: data.name,
    });
  }

  requestRegistrationClient(data: { phone: string; name?: string }) {
    const deviceId = localStorage.getItem('device_id');
    return this.http.post<Client>(`${environment.apiUrl}/auth/client/request/with-company`, {
      phone: data.phone,
      name: data.name,
      deviceId,
    });
  }

  codeRegistrationClient(code: string) {
    const deviceId = localStorage.getItem('device_id');
    return this.http.post<Client>(`${environment.apiUrl}/auth/client/otp`, {
      code,
      deviceId,
    });
  }

  getClientAndCard(idClient: string) {
    return this.http.get<Client>(`${environment.apiUrl}/client/get-full/${idClient}`);
  }

  saveDataClient(data: { clientId: string; name?: string; phone?: string; email?: string; bonuses?: number }) {
    return this.http.put(`${environment.apiUrl}/client/update`, data);
  }
}

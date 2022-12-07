import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { Client } from '../../common/entities/client.entity';
import { environment } from '../../../environments/environment';
import { UpdateClientDto } from './dto/update-client.dto';
import { Pagination } from '../../common/dto/pagination.dto';

@Injectable()
export class ClientsService {
  constructor(private http: HttpClient) {}

  getClientsList(data: Pagination) {
    return this.http.get<PaginateRes<Client>>(
      `${environment.apiUrl}/client/list`,
      { params: { ...data } }
    );
  }

  requestRegistrationClient(phone: string) {
    const deviceId = localStorage.getItem('device_id');
    return this.http.post<Client>(
      `${environment.apiUrl}/auth/client/request/with-company`,
      {
        phone,
        deviceId,
      }
    );
  }

  codeRegistrationClient(code: string) {
    const deviceId = localStorage.getItem('device_id');
    return this.http.post<Client>(`${environment.apiUrl}/auth/client/otp`, {
      code,
      deviceId,
    });
  }

  getClientById(id: string) {
    return this.http.get<Client>(`${environment.apiUrl}/client/get/${id}`);
  }

  updateClient(id: string, data: UpdateClientDto) {
    return this.http.put<Client>(`${environment.apiUrl}/client/${id}`, data);
  }

  deleteClient(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/client/${id}`);
  }
}

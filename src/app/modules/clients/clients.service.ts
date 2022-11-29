import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetClientListDto } from './dto/get-client-list.dto';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { Client } from '../../common/entities/client.entity';
import { environment } from '../../../environments/environment';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private http: HttpClient) {}

  getClientsList(pagination: GetClientListDto) {
    return this.http.get<PaginateRes<Client>>(
      `${environment.apiUrl}/client/list`,
      {
        params: {
          ...pagination,
        },
      }
    );
  }

  createClient(data: CreateClientDto) {
    return this.http.post(`${environment.apiUrl}/client`, data);
  }

  updateClient(id: string, data: UpdateClientDto) {
    return this.http.put(`${environment.apiUrl}/client/${id}`, data);
  }

  deleteClient(id: string) {
    return this.http.delete(`${environment.apiUrl}/client/${id}`);
  }

  getClient(id: string) {
    return this.http.get(`${environment.apiUrl}/client/get/${id}`);
  }
}

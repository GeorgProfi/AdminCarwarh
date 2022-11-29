import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Filial } from './interfaces/filial.interface';
import { PaginateRes } from '../../common/interfaces/paginate-response.interface';
import { Pagination } from '../../common/interfaces/pagination.interface';

@Injectable()
export class FilialsService {
  constructor(private http: HttpClient) {}

  getFilialList(pagination: Pagination): Observable<PaginateRes<Filial>> {
    return this.http.get<PaginateRes<Filial>>(
      `${environment.apiUrl}/filial/list`,
      {
        params: {
          ...pagination,
        },
      }
    );
  }

  createFilial(name: string): Observable<Filial> {
    return this.http.post<Filial>(`${environment.apiUrl}/filial`, {
      name,
    });
  }

  updateFilial(id: string, name: string): Observable<Filial> {
    return this.http.put<Filial>(`${environment.apiUrl}/filial/${id}`, {
      name,
    });
  }
}

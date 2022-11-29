import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Filial } from './interfaces/filial.interface';
import { Paginate } from '../../common/interfaces/paginate.interface';

@Injectable()
export class FilialsService {
  constructor(private http: HttpClient) {}

  getFilialList(page: number, pageSize: number): Observable<Paginate<Filial>> {
    return this.http.get<Paginate<Filial>>(
      `${environment.apiUrl}/carWash/filial/list`,
      {
        params: {
          page,
          pageSize,
        },
      }
    );
  }

  createFilial(name: string): Observable<Filial> {
    return this.http.post<Filial>(`${environment.apiUrl}/carWash/filial`, {
      name,
    });
  }

  updateFilial(id: string, name: string): Observable<Filial> {
    return this.http.put<Filial>(`${environment.apiUrl}/carWash/filial/${id}`, {
      name,
    });
  }
}

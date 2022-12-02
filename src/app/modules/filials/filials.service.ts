import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { Filial } from '../../common/entities/filial.entity';
import { CreateFilialDto } from './dto/create-filial.dto';
import { UpdateFilialDto } from './dto/update-filial.dto';
import { GetFilialListDto } from './dto/get-filial-list.dto';

@Injectable()
export class FilialsService {
  constructor(private http: HttpClient) {}

  getFilialList(data: GetFilialListDto): Observable<PaginateRes<Filial>> {
    return this.http.get<PaginateRes<Filial>>(
      `${environment.apiUrl}/filial/list`,
      { params: { ...data } }
    );
  }

  getALLFilials(): Observable<Filial[]> {
    return this.http.get<Filial[]>(`${environment.apiUrl}/filial/all`);
  }

  createFilial(data: CreateFilialDto): Observable<Filial> {
    return this.http.post<Filial>(`${environment.apiUrl}/filial`, data);
  }

  getFilialById(id: string): Observable<Filial> {
    return this.http.get<Filial>(`${environment.apiUrl}/filial/${id}`);
  }

  deleteFilialById(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/filial/${id}`);
  }

  updateFilial(id: string, data: UpdateFilialDto): Observable<Filial> {
    return this.http.put<Filial>(`${environment.apiUrl}/filial/${id}`, data);
  }
}

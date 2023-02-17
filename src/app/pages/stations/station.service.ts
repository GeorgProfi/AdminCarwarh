import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { Station } from '../../common/entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Pagination } from '../../common/dto/pagination.dto';

@Injectable({ providedIn: 'root' })
export class StationService {
  constructor(public http: HttpClient) {}

  getStationList(data: Pagination): Observable<PaginateRes<Station>> {
    return this.http
      .get<PaginateRes<Station>>(`${environment.apiUrl}/station/list`, {
        params: { ...data },
      })
      .pipe(
        map(data => {
          console.log(data);
          return data;
        })
      );
  }

  getALLStation(): Observable<Station[]> {
    return this.http.get<Station[]>(`${environment.apiUrl}/station/all`);
  }

  createStation(data: CreateStationDto): Observable<Station> {
    return this.http.post<Station>(`${environment.apiUrl}/station`, data);
  }

  getStationById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/station/get/${id}`);
  }

  deleteStationById(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/station/${id}`);
  }

  updateStation(id: string, data: UpdateStationDto): Observable<Station> {
    return this.http.put<Station>(`${environment.apiUrl}/station/${id}`, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { Station } from '../../entities/station.entity';
import { CreateStationDto } from '../../../pages/stations/dto/create-station.dto';
import { UpdateStationDto } from '../../../pages/stations/dto/update-station.dto';
import { Pagination } from '../../dto/pagination.dto';

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

  getALLStation(serviceIds?: string[]): Observable<Station[]> {
    return this.http.put<Station[]>(`${environment.apiUrl}/station/all`, {
      serviceIds,
    });
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

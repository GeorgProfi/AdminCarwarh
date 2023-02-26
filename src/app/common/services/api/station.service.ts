import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { Station } from '../../entities/station.entity';
import { CreateStationDto } from '../../../pages/stations/dto/create-station.dto';
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

  addPost(data: { stationId: string; name: string }) {
    return this.http.post<any>(`${environment.apiUrl}/station/post`, data);
  }

  addServiceOnStation(data: {
    idClassService: string;
    stationId: string;
    price: number;
    duration: number;
    discount: number;
    bonusPercentage: number;
  }) {
    return this.http.post<any>(`${environment.apiUrl}/station/service`, data);
  }

  updateServices(
    data: {
      idClassService: string;
      stationId: string;
      price: number;
      duration: number;
      discount: number;
      bonusPercentage: number;
    }[]
  ) {
    return this.http.put(`${environment.apiUrl}/station/service`, data);
  }

  removeService(data: { stationId: string; serviceId: string }) {
    return this.http.delete<any>(`${environment.apiUrl}/station/service`, {
      params: data,
    });
  }

  addServicePost(data: { postId: string; serviceId: string }) {
    return this.http.post<any>(
      `${environment.apiUrl}/station/service-on-post`,
      data
    );
  }

  removeServicePost(data: { postId: string; serviceId: string }) {
    return this.http.delete<any>(
      `${environment.apiUrl}/station/service-on-post`,
      {
        params: data,
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { Station } from '../../entities/station.entity';
import { Pagination } from '../../dto/pagination.dto';
import { Service } from '../../entities/service.entity';
import { CreateStationDto } from '../../dto/station/create-station.dto';
import { UpdateStationDto } from '../../dto/station/update-station.dto';
import { SetVisibleStationDto } from '../../dto/station/set-visible-station.dto';
import { AddPostDto } from '../../dto/station/add-post.dto';
import { RenamePostDto } from '../../dto/station/rename-post.dto';
import { AddServiceOnStationDto } from '../../dto/station/add-service-on-station.dto';
import { SetVisibleServiceDto } from '../../dto/station/set-visible-service.dto';
import { AddServicePostDto } from '../../dto/station/add-service-post.dto';
import { GetAllPostDto } from '../../dto/station/get-all-post.dto';

@Injectable({ providedIn: 'root' })
export class StationService {
  constructor(public http: HttpClient) {}

  getStationList(data: Pagination): Observable<PaginateRes<Station>> {
    return this.http.get<PaginateRes<Station>>(`${environment.apiOwnerUrl}/station/list`, {
      params: { ...data },
    });
  }

  getALLStation(serviceIds?: string[]): Observable<Station[]> {
    return this.http.put<Station[]>(`${environment.apiOwnerUrl}/station/all`, {
      serviceIds,
    });
  }

  getServices(stationId: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${environment.apiOwnerUrl}/station/service`, {
      params: { stationId },
    });
  }

  getPosts(stationId: string) {
    return this.http.get<any[]>(`${environment.apiOwnerUrl}/station/post`, {
      params: { stationId },
    });
  }

  createStation(data: CreateStationDto): Observable<Station> {
    return this.http.post<Station>(`${environment.apiOwnerUrl}/station`, data);
  }

  updateStation(data: UpdateStationDto) {
    return this.http.put<any>(`${environment.apiOwnerUrl}/station/update`, data);
  }

  setVisibleStation(data: SetVisibleStationDto) {
    return this.http.put(`${environment.apiOwnerUrl}/station/visible`, data);
  }

  getStationById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiOwnerUrl}/station/get/${id}`);
  }

  addPost(data: AddPostDto) {
    return this.http.post<any>(`${environment.apiOwnerUrl}/station/post`, data);
  }

  renamePost(data: RenamePostDto) {
    return this.http.put<any>(`${environment.apiOwnerUrl}/station/post/rename`, data);
  }

  removePost(id: string) {
    return this.http.delete(`${environment.apiOwnerUrl}/station/post/${id}`);
  }

  addServiceOnStation(data: AddServiceOnStationDto) {
    return this.http.post<any>(`${environment.apiOwnerUrl}/station/service`, data);
  }

  updateServices(data: Service[]) {
    return this.http.put(`${environment.apiOwnerUrl}/station/service`, data);
  }

  setVisibleService(data: SetVisibleServiceDto) {
    return this.http.put(`${environment.apiOwnerUrl}/station/service/visible`, data);
  }

  removeService(data: { stationId: string; serviceId: string }) {
    return this.http.delete<any>(`${environment.apiOwnerUrl}/station/service`, {
      params: data,
    });
  }

  addServicePost(data: AddServicePostDto) {
    return this.http.post<any>(`${environment.apiOwnerUrl}/station/service-on-post`, data);
  }

  removeServicePost(data: { postId: string; serviceId: string }) {
    return this.http.delete<any>(`${environment.apiOwnerUrl}/station/service-on-post`, {
      params: data,
    });
  }

  removeStation(id: string) {
    return this.http.delete<any>(`${environment.apiOwnerUrl}/station/delete/${id}`);
  }

  getFullStation(id: string) {
    return this.http.get<any>(`${environment.apiOwnerUrl}/station/full/${id}`);
  }

  getAllPost(data: GetAllPostDto) {
    return this.http.post<any>(`${environment.apiOwnerUrl}/station/all-post`, data);
  }
}

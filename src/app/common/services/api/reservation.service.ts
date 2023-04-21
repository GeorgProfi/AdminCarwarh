import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../../entities/order.entity';
import { GetReservationStationDto } from '../../dto/reservation/get-reservation-station.dto';
import { SearchFreeTimesDto } from '../../dto/reservation/search-free-times.dto';
import { CreateReservationDto } from '../../dto/reservation/create-reservation.dto';
import { UpdateReservationDto } from '../../dto/reservation/update-reservation.dto';
import { ReReservationDto } from '../../dto/reservation/re-reservation.dto';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private http: HttpClient) {}

  getReservationStation(data: GetReservationStationDto): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiOwnerUrl}/reservation/station`, {
      params: {
        stationId: data.stationId,
        day: data.day.toISOString(),
      },
    });
  }

  searchFreeTimes(data: SearchFreeTimesDto): Observable<string[]> {
    return this.http.post<string[]>(`${environment.apiOwnerUrl}/reservation/search`, data);
  }

  createReservation(data: CreateReservationDto) {
    return this.http.post<string[]>(`${environment.apiOwnerUrl}/reservation/reservation-for-owner`, data);
  }

  reReservation(data: ReReservationDto) {
    return this.http.put<Order>(`${environment.apiOwnerUrl}/reservation/re-reservation`, data);
  }

  getOrder(id: string) {
    return this.http.get<Order>(`${environment.apiOwnerUrl}/reservation/get/${id}`);
  }

  updateReservation(data: UpdateReservationDto) {
    return this.http.put(`${environment.apiOwnerUrl}/reservation/update`, data);
  }

  removeOrder(id: string) {
    return this.http.delete(`${environment.apiOwnerUrl}/reservation/remove/${id}`);
  }
}

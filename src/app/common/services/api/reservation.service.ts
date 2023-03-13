import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reservation } from '../../entities/reservation.entity';
import { GetReservationCompany } from '../../../pages/reservation/dto/get-reservation-company.dto';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private http: HttpClient) {}

  getReservationStation(
    data: GetReservationCompany
  ): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${environment.apiUrl}/reservation/station`,
      {
        params: {
          stationId: data.stationId,
          day: data.day.toISOString(),
        },
      }
    );
  }

  searchFreeTimes(data: {
    stationId: string;
    servicesIds: string[];
    day: Date;
  }): Observable<string[]> {
    return this.http.post<string[]>(
      `${environment.apiUrl}/reservation/search`,
      data
    );
  }

  createReservation(data: {
    clientId: string;
    stationId: string;
    servicesIds: string[];
    date: Date;
  }) {
    console.log(data);
    return this.http.post<string[]>(
      `${environment.apiUrl}/reservation/reservation-for-owner`,
      data
    );
  }
}

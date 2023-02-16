import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservation } from '../../common/entities/reservation.entity';
import { GetReservationCompany } from './dto/get-reservation-company.dto';

@Injectable()
export class ReservationService {
  constructor(private http: HttpClient) {}

  getReservationStation(
    data: GetReservationCompany
  ): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${environment.apiUrl}/reservation/company`,
      {
        params: {
          idStation: data.idStation,
          day: data.day.toISOString(),
        },
      }
    );
  }
}

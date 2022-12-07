import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../../common/dto/pagination.dto';
import { Observable } from 'rxjs';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { environment } from '../../../environments/environment';
import { Reservation } from '../../common/entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(private http: HttpClient) {}

  getReservationList(data: Pagination): Observable<PaginateRes<Reservation>> {
    return this.http.get<PaginateRes<Reservation>>(
      `${environment.apiUrl}/reservation/list`,
      { params: { ...data } }
    );
  }
}

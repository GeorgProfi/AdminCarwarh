import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../../common/dto/pagination.dto';
import { Observable } from 'rxjs';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { environment } from '../../../environments/environment';
import { Notification } from '../../common/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotificationList(data: Pagination): Observable<PaginateRes<Notification>> {
    return this.http.get<PaginateRes<Notification>>(
      `${environment.apiUrl}/notification/list`,
      { params: { ...data } }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../../common/dto/pagination.dto';
import { Observable } from 'rxjs';
import { PaginateRes } from '../../common/dto/paginate-response.dto';
import { environment } from '../../../environments/environment';
import { Notification } from '../../common/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotificationList(data: Pagination): Observable<PaginateRes<Notification>> {
    return this.http.get<PaginateRes<Notification>>(
      `${environment.apiUrl}/notification/list`,
      { params: { ...data } }
    );
  }

  getNotification(id: string) {
    return this.http.get<Notification>(
      `${environment.apiUrl}/notification/get/${id}`
    );
  }

  createNotification(data: CreateNotificationDto) {
    return this.http.post<Notification>(
      `${environment.apiUrl}/notification`,
      data
    );
  }

  updateNotification(data: UpdateNotificationDto) {
    return this.http.put<Notification>(
      `${environment.apiUrl}/notification`,
      data
    );
  }

  deleteNotification(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/notification/${id}`);
  }
}

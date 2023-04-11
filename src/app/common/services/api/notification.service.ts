import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pagination } from '../../dto/pagination.dto';
import { Observable } from 'rxjs';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { environment } from '../../../../environments/environment';
import { NotificationTemplate } from '../../entities/notification-template.entity';
import { CreateNotificationDto } from '../../dto/notification/create-notification.dto';
import { UpdateNotificationDto } from '../../dto/notification/update-notification.dto';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getNotificationList(data: Pagination): Observable<PaginateRes<NotificationTemplate>> {
    return this.http.get<PaginateRes<NotificationTemplate>>(`${environment.apiUrl}/notification/list`, {
      params: { ...data },
    });
  }

  getNotification(id: string) {
    return this.http.get<NotificationTemplate>(`${environment.apiUrl}/notification/get/${id}`);
  }

  createNotification(data: CreateNotificationDto) {
    return this.http.post<NotificationTemplate>(`${environment.apiUrl}/notification/save`, data);
  }

  pushNotification(idNotification: string) {
    return this.http.post<NotificationTemplate>(`${environment.apiUrl}/notification/push`, {
      idNotification,
    });
  }

  removeNotification(idNotification: string) {
    return this.http.delete<NotificationTemplate>(`${environment.apiUrl}/notification/${idNotification}`);
  }

  updateNotification(id: string, data: UpdateNotificationDto) {
    return this.http.put<NotificationTemplate>(`${environment.apiUrl}/notification/${id}`, data);
  }
}

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
    return this.http.get<PaginateRes<NotificationTemplate>>(`${environment.apiOwnerUrl}/notification/list`, {
      params: { ...data },
    });
  }

  getNotification(id: string) {
    return this.http.get<NotificationTemplate>(`${environment.apiOwnerUrl}/notification/get/${id}`);
  }

  createNotification(data: CreateNotificationDto) {
    return this.http.post<NotificationTemplate>(`${environment.apiOwnerUrl}/notification/save`, data);
  }

  pushNotification(idNotification: string) {
    return this.http.post<NotificationTemplate>(`${environment.apiOwnerUrl}/notification/push`, {
      idNotification,
    });
  }

  removeNotification(idNotification: string) {
    return this.http.delete<NotificationTemplate>(`${environment.apiOwnerUrl}/notification/${idNotification}`);
  }

  updateNotification(id: string, data: UpdateNotificationDto) {
    return this.http.put<NotificationTemplate>(`${environment.apiOwnerUrl}/notification/${id}`, data);
  }
}

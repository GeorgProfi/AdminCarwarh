import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  changePassword(data: { oldPassword: string; newPassword: string }) {
    return this.http.put(`${environment.apiUrl}/company/account/change-password`, data);
  }

  changeEmail(data: { newEmail: string }) {
    return this.http.put(`${environment.apiUrl}/company/account/change-email`, data);
  }

  refreshPassword(data: { email: string }) {
    return this.http.post(`${environment.apiUrl}/company/account/refresh-password`, data);
  }
}

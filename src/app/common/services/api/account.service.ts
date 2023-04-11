import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ChangePasswordDto } from '../../dto/account/change-password.dto';
import { ChangeEmailDto } from '../../dto/account/change-email.dto';
import { RefreshPasswordDto } from '../../dto/account/refresh-password.dto';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  changePassword(data: ChangePasswordDto) {
    return this.http.put(`${environment.apiUrl}/company/account/change-password`, data);
  }

  changeEmail(data: ChangeEmailDto) {
    return this.http.put(`${environment.apiUrl}/company/account/change-email`, data);
  }

  refreshPassword(data: RefreshPasswordDto) {
    return this.http.post(`${environment.apiUrl}/company/account/refresh-password`, data);
  }
}

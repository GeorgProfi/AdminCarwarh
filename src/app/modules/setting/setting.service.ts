import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class SettingService {
  constructor(private http: HttpClient) {}

  updateSetting(data: any) {
    return this.http.post(`${environment.apiUrl}/setting`, data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DebugService {
  constructor(private http: HttpClient) {}

  createStation20() {
    return this.http.get(`${environment.apiUrl}/debug/station`);
  }

  createService10() {
    return this.http.get(`${environment.apiUrl}/debug/service`);
  }

  createClient100() {
    return this.http.get(`${environment.apiUrl}/debug/client`);
  }

  createNotification20() {
    return this.http.get(`${environment.apiUrl}/debug/notification`);
  }

  createOrder20() {
    return this.http.get(`${environment.apiUrl}/debug/order`);
  }

  clearData() {
    return this.http.get(`${environment.apiUrl}/debug/clear`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
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

  createReservation10() {
    return this.http.get(`${environment.apiUrl}/debug/reservation`);
  }

  clearData() {
    return this.http.get(`${environment.apiUrl}/debug/clear`);
  }
}

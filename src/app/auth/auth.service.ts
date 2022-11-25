import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 } from 'uuid';
import { map, Observable } from 'rxjs';
import { AuthResponse } from './auth-response.interface';
import { environment } from '../../environments/environment';

// Сервис авторизации, может выставлять значения в localStorage, router он НЕ ТРОГАЕТ!
@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = v4();
      localStorage.setItem('device_id', deviceId);
    }
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/admin/signIn`, {
        username,
        password,
        deviceId,
      })
      .pipe(
        map(data => {
          localStorage.setItem('access', data.accessToken);
          localStorage.setItem('refresh', data.refreshToken);
          return data;
        })
      );
  }

  get authorization() {
    return `Bearer ${localStorage.getItem('access')}`;
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  get isLoggedIn(): boolean {
    // проверка наличия токена доступа
    const token = localStorage.getItem('access');
    if (!token) return false;

    // проверка времени доступа
    const exp = JSON.parse(atob(token.split('.')[1])).exp;
    const expiry = Math.floor(new Date().getTime() / 1000) >= exp;
    return !expiry;
  }

  refresh(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    const deviceId = localStorage.getItem('device_id');
    console.log(refresh);
    console.log(deviceId);
    if (!deviceId || !refresh)
      throw new Error('Отсутствует refresh или deviceId');

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {
        token: refresh,
        deviceId,
      })
      .pipe(
        map(data => {
          localStorage.setItem('access', data.accessToken);
          localStorage.setItem('refresh', data.refreshToken);
          return data;
        })
      );
  }
}

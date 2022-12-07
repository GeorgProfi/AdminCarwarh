import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 } from 'uuid';
import { map, Observable, throwError } from 'rxjs';
import { AuthResponse } from './interfaces/auth-response.interface';
import { environment } from '../../environments/environment';
import { IRegister } from './interfaces/register.interface';

// Сервис авторизации, может выставлять значения в localStorage, router он НЕ ТРОГАЕТ!
@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: IRegister) {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = v4();
      localStorage.setItem('device_id', deviceId);
    }
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/carWash/application/registration`,
        {
          ...data,
          deviceId,
        }
      )
      .pipe(
        map(data => {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          return data;
        })
      );
  }

  login(email: string, password: string) {
    const deviceId = this.deviceId;
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/owner/signIn`, {
        email,
        password,
        deviceId,
      })
      .pipe(
        map(data => {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          return data;
        })
      );
  }

  get authorization() {
    return `Bearer ${localStorage.getItem('access')}`;
  }

  get deviceId(): string {
    let deviceId: string | null = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = v4();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  get isLoggedIn(): boolean {
    // проверка наличия токена доступа
    const token = localStorage.getItem('access');
    return !!token;
    // проверка времени доступа
    // const exp = JSON.parse(atob(token.split('.')[1])).exp;
    // const expiry = Math.floor(new Date().getTime() / 1000) >= exp;
    // return !expiry;
  }

  refresh(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    const deviceId = localStorage.getItem('device_id');
    if (!deviceId || !refresh) {
      return throwError('Отсутствует refresh или deviceId');
    }

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {
        token: refresh,
        deviceId,
      })
      .pipe(
        map(data => {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          return data;
        })
      );
  }
}

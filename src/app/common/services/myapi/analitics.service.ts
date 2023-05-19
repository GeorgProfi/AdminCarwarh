import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(private http: HttpClient) {}

  getAnalitics() {
    console.log(`${environment.apiUrl}/company/account/refresh-password`)
    return this.http.get(`${environment.apiUrl}/company/account/refresh-password`);
    
  }
}

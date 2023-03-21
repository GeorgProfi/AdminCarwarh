import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private http: HttpClient) {}

  updateDataCompany(data: { description?: string; logoImageId?: string }) {
    return this.http.put(`${environment.apiUrl}/company/update`, data);
  }

  getDataCompany() {
    return this.http.get(`${environment.apiUrl}/company/my`);
  }
}

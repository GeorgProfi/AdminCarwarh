import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UpdateDataCompanyDto } from '../../dto/company/update-data-company.dto';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private http: HttpClient) {}

  updateDataCompany(data: UpdateDataCompanyDto) {
    return this.http.put(`${environment.apiUrl}/company/update`, data);
  }

  getDataCompany() {
    return this.http.get(`${environment.apiUrl}/company/my`);
  }
}

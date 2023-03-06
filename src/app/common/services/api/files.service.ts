import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FilesService {
  constructor(private http: HttpClient) {}

  oneImageUpload(formData: any) {
    console.log(formData);
    return this.http.post(`${environment.apiUrl}/files/one-image`, formData);
  }
}

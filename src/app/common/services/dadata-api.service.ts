import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DadataApiService {
  constructor(private http: HttpClient) {}

  cleanAddress(address: string) {}

  suggestAddress(address: string) {
    return this.http
      .post<any[]>(
        `https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address`,
        {
          query: address,
        },
        {
          headers: {
            Authorization: `Token ${environment.dadataApiToken}`,
          },
        }
      )
      .pipe(map((res: any) => res.suggestions));
  }

  iplocateAddress() {}
}

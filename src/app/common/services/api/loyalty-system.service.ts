import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeBonusesDto } from '../../../pages/loyalty-system/dto/change-bonuses.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientAndBonusesDto } from '../../../pages/loyalty-system/dto/client-and-bonuses.dto';

@Injectable({ providedIn: 'root' })
export class LoyaltySystemService {
  constructor(private http: HttpClient) {}

  changeBonuses(data: ChangeBonusesDto, phone: string): Observable<number> {
    phone = encodeURIComponent(phone);
    return this.http.put<number>(
      `${environment.apiUrl}/loyalty-system/change-bonuses/${phone}`,
      data
    );
  }

  getClientAndBonuses(phone: string): Observable<ClientAndBonusesDto> {
    phone = encodeURIComponent(phone);
    return this.http.get<ClientAndBonusesDto>(
      `${environment.apiUrl}/loyalty-system/client/${phone}`
    );
  }
}

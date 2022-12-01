import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeBonusesDto } from './dto/change-bonuses.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientAndBonusesDto } from './dto/client-and-bonuses.dto';

@Injectable()
export class LoyaltySystemService {
  constructor(private http: HttpClient) {}

  changeBonuses(data: ChangeBonusesDto, phone: string): Observable<number> {
    phone = encodeURIComponent(phone);
    return this.http.put<number>(
      `${environment.apiUrl}/card/change-bonuses/${phone}`,
      data
    );
  }

  getClientAndBonuses(phone: string): Observable<ClientAndBonusesDto> {
    phone = encodeURIComponent(phone);
    return this.http.get<ClientAndBonusesDto>(
      `${environment.apiUrl}/card/card-owner/${phone}`
    );
  }
}

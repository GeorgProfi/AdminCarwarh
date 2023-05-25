import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { options } from "@fullcalendar/core/preact";
import { Observable } from "rxjs";
import { ICard } from "../models/card";
import { ITopClients } from "../models/TopClients";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private http: HttpClient) {

  }
  GetAllCard(datafrom:string,datato:string): Observable<ICard> {
    
    const body = JSON.stringify({
      access: localStorage.getItem("access"),
      datastart: datafrom,
      dataend:datato
    })
    
    return this.http.post<ICard>('http://127.0.0.1:8000/analitics', body)
    }

}

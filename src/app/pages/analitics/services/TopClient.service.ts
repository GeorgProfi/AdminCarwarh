import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { options } from "@fullcalendar/core/preact";
import { Observable } from "rxjs";
import { ICard } from "../models/card";
import { ITopClients } from "../models/TopClients";

@Injectable({
  providedIn: 'root'
})
export class TopClientService {
  constructor(private http: HttpClient) {

  }

  GetTopClient(datafrom: string, datato: string): Observable<ITopClients> {

    const body = JSON.stringify({
      access: localStorage.getItem("access"),
      datastart: datafrom,
      dataend: datato
})

    return this.http.post<ITopClients>('http://127.0.0.1:8000/topclients', body)
  }

}

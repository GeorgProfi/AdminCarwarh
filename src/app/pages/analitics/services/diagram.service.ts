import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { options } from "@fullcalendar/core/preact";
import { Observable } from "rxjs";
import { IDiagram } from '../models/diagram'
import { ITopClients } from "../models/TopClients";

@Injectable({
  providedIn: 'root'
})
export class DiagramService {
  constructor(private http: HttpClient) {

  }
  GetAllDays(datafrom: string, datato: string): Observable<IDiagram> {

    const body = JSON.stringify({
      access: localStorage.getItem("access"),
      datastart: datafrom,
      dataend: datato
    })

    return this.http.post<IDiagram>('http://127.0.0.1:8000/diagram', body)
  }

}

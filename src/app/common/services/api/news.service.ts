import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { environment } from '../../../../environments/environment';
import { Pagination } from '../../dto/pagination.dto';

@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor(private http: HttpClient) {}

  getNewsList(data: Pagination) {
    return this.http.get<PaginateRes<any>>(`${environment.apiUrl}/news/list`, {
      params: { ...data },
    });
  }

  getNews(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/news/get/${id}`);
  }

  createNews(data: { title: string; text: string; imageId?: string }) {
    return this.http.post(`${environment.apiUrl}/news/create`, data);
  }

  updateNews(data: { id: string; title?: string; text?: string; imageId?: string }) {
    return this.http.put(`${environment.apiUrl}/news/update`, data);
  }

  removeNews(id: string) {
    return this.http.delete(`${environment.apiUrl}/news/remove/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginateRes } from '../../dto/paginate-response.dto';
import { environment } from '../../../../environments/environment';
import { Pagination } from '../../dto/pagination.dto';
import { CreateNewsDto } from '../../dto/news/create-news.dto';
import { UpdateNewsDto } from '../../dto/news/update-news.dto';

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

  createNews(data: CreateNewsDto) {
    return this.http.post(`${environment.apiUrl}/news/create`, data);
  }

  updateNews(data: UpdateNewsDto) {
    return this.http.put(`${environment.apiUrl}/news/update`, data);
  }

  removeNews(id: string) {
    return this.http.delete(`${environment.apiUrl}/news/remove/${id}`);
  }
}

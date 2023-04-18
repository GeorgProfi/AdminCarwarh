import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<object>> {
    const token = localStorage.getItem('refresh');
    if (!token) {
      this.authService.logout();
      this.router.navigateByUrl('auth');
      return throwError('no refresh');
    }

    return this.authService.refresh().pipe(
      switchMap(data => {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        return next.handle(
          req.clone({
            // FIXME: кринж так то, но так проще пока что
            headers: req.headers.set('Authorization', `Bearer ${data.access}`),
          })
        );
      }),
      catchError(err => {
        this.router.navigateByUrl('auth');
        return throwError(err);
      })
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<object>> {
    if (!req.url.includes(environment.apiUrl)) {
      return next.handle(req);
    }
    const token = this.authService.authorization;

    const authReq = req.clone({
      headers: req.headers.set('Authorization', token),
    });

    // TODO: заранее бы ловить просроченный токен по хорошему
    // if (!this.authService.isLoggedIn) {
    //   this.authService.refresh().subscribe({
    //     next: () => {},
    //     error: err => {
    //       if (
    //         err instanceof HttpErrorResponse &&
    //         !authReq.url.includes('auth') &&
    //         err.status === 401
    //       ) {
    //         return this.router.parseUrl('/auth');
    //       }
    //       return throwError(err);
    //     },
    //   });
    // }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (
          err instanceof HttpErrorResponse &&
          authReq.url.includes(environment.apiOwnerUrl) &&
          !authReq.url.includes('auth') &&
          err.status === 401
        ) {
          return this.handle401Error(req, next);
        }
        return throwError(err);
      })
    );
  }
}

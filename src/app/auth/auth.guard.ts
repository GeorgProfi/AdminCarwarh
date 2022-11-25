import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | Observable<true | UrlTree> {
    if (this.authService.isLoggedIn) return true;

    // попытка сделать refresh токенов
    return this.authService.refresh().pipe(
      map(data => {
        if (data) {
          return true;
        }
        return this.router.parseUrl('/auth');
      }),
      catchError(error => {
        console.log('FUCK');
        return of(this.router.parseUrl('/auth'));
      })
    );
  }
}

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subject, distinctUntilChanged, filter, takeUntil } from 'rxjs';

interface Breadcrumbs {
  title: string;
  url: string;
}

@Component({
  selector: `app-breadcrumbs`,
  templateUrl: `./breadcrumbs.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs$ = new BehaviorSubject<Breadcrumbs[] | null>(null);
  private _sbs$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._setBreadcrumbs();
    this._sbsRouteChange();
  }

  ngOnDestroy(): void {
    this._unsubscribe();
  }

  private _getChild(route: ActivatedRoute): ActivatedRoute {
    return route.firstChild ? this._getChild(route.firstChild) : route;
  }

  private _setBreadcrumbs(): void {
    this.breadcrumbs$.next(this._getChild(this.route).snapshot.data['breadcrumbs'] || null)
  }

  private _sbsRouteChange(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      takeUntil(this._sbs$),
    ).subscribe(() => this._setBreadcrumbs());
  }

  private _unsubscribe(): void {
    this._sbs$.next();
    this._sbs$.complete();
  }
}

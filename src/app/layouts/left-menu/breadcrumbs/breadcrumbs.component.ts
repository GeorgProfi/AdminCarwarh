import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';

//import { filter } from 'rxjs/operators';

interface Breadcrumbs {
  title: string;
  url: string;
}

@Component({
  selector: `app-breadcrumbs`,
  templateUrl: `./breadcrumbs.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  $breadcrumbs = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    distinctUntilChanged(),
    map(() => this.activatedRoute.firstChild?.snapshot.data['breadcrumbs'])
  );
}

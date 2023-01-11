import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: `app-breadcrumbs`,
  templateUrl: `./breadcrumbs.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  constructor(private router: ActivatedRoute) {}
  items = [
    {
      caption: `breadcrumbs`,
      routerLink: `/components/select`,
    },
    {
      caption: `not`,
      routerLink: `/components/multi-select`,
    },
    {
      caption: `work`,
      routerLink: `/components/multi-select`,
    },
  ];
}

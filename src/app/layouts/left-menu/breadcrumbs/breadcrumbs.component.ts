import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: `app-breadcrumbs`,
  templateUrl: `./breadcrumbs.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  items = [
    {
      caption: `Selects`,
      routerLink: `/components/select`,
    },
    {
      caption: `Multi`,
      routerLink: `/components/multi-select`,
    },
    {
      caption: `With tags`,
      routerLink: `/components/multi-select`,
    },
    {
      caption: `Current`,
      routerLink: `/navigation/breadcrumbs`,
      routerLinkActiveOptions: { exact: true },
    },
  ];
}

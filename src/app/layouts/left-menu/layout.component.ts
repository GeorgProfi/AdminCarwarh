import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, distinctUntilChanged, map } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-layout-left-menu',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly title: Title
  ) {}

  $title = this.router.events.pipe(
    startWith(this.title.getTitle()),
    //filter(event => event instanceof RouterEvent),
    distinctUntilChanged(),
    delay(0),
    map(() => {
      return this.title.getTitle();
    })
  );
}

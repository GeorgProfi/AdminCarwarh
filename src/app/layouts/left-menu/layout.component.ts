import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, delay, distinctUntilChanged } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  title$ = new BehaviorSubject<string>('');
  constructor(
    private router: Router,
    private readonly titleService: Title
  ) {}

  ngOnInit(): void {
    this._sbsNavigationEnd();
    this._setInitialTitle();
  }

  public setTitle(title: string): void {
    this.title$.next(title);
  }

  private _setInitialTitle(): void {
    this._setTitle(this.titleService.getTitle());
  }

  private _setTitle(title: string): void {
    this.title$.next(title);
  }

  private _sbsNavigationEnd(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      delay(0),
    ).subscribe(() => this._setTitle(this.titleService.getTitle()))
  }
}

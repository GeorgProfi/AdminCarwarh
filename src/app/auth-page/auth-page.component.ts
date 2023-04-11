import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent implements OnInit {
  activeItemIndex = 0;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setCurrentTab();
  }

  private setCurrentTab(): void {
    if (this.router.url === '/auth/login') this.activeItemIndex = 0;
    if (this.router.url === '/auth/register') this.activeItemIndex = 1;
  }
}

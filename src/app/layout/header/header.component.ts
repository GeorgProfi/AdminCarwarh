import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  activeItemIndex = 0;

  menu = [
    {
      name: 'Система лояльности',
      icon: 'tuiIconCard',
      link: 'loyalty-system',
    },
    { name: 'Клиенты', icon: 'tuiIconUsers', link: 'clients' },
    { name: 'Станции', icon: 'tuiIconFlag', link: 'stations' },
    // { name: 'Услуги', icon: 'tuiIconFile', link: 'services' },
    { name: 'Запись на время', icon: 'tuiIconTime', link: 'reservation' },
    { name: 'Уведомления', icon: 'tuiIconBell', link: 'notification' },
    { name: 'Настройки', icon: 'tuiIconDrag', link: 'setting' },

    { name: 'DEBUG', icon: 'tuiIconCancel', link: 'debug' },
  ];

  async logout() {
    this.authService.logout();
    await this.router.navigateByUrl('/auth');
  }
}

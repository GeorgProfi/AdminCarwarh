import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent {
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
    { name: 'Услуги', icon: 'tuiIconFile', link: 'services' },
    { name: 'Запись на время', icon: 'tuiIconTime', link: 'reservation' },
    {
      name: 'Рассылки уведомлений',
      icon: 'tuiIconBell',
      child: [
        { name: 'push рассылки', icon: 'tuiIconBell', link: 'notification' },
      ],
    },
    {
      name: 'Настройки',
      icon: 'tuiIconDrag',
      child: [
        {
          name: 'Настройки личного кабинета',
          icon: 'tuiIconDrag',
          link: 'setting-profile',
        },
        {
          name: 'Настройки компании',
          icon: 'tuiIconDrag',
          link: 'setting-company',
        },
      ],
    },

    { name: 'DEBUG', icon: 'tuiIconCancel', link: 'debug' },
  ];

  async logout() {
    this.authService.logout();
    await this.router.navigateByUrl('/auth');
  }
}

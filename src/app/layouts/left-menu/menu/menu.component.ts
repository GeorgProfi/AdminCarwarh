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
    // {
    //   name: 'Система лояльности',
    //   icon: 'tuiIconCard',
    //   link: 'loyalty-system',
    // },
    { name: 'Клиенты', icon: 'tuiIconUsers', link: 'clients' },
    { name: 'Станции', icon: 'tuiIconFlag', link: 'stations' },
    { name: 'Услуги', icon: 'tuiIconFile', link: 'services' },
    { name: 'Запись на время', icon: 'tuiIconTime', link: 'reservation' },
    {
      name: 'Маркетинг',
      icon: 'tuiIconBriefcase',
      link: 'marketing',
    },
    {
      name: 'Настройки',
      icon: 'tuiIconSettings',
      link: 'setting-company',
    },
    {
      name: 'Личный кабинет',
      icon: 'tuiIconUser',
      link: 'setting-profile',
    },

    { name: 'DEBUG', icon: 'tuiIconCancel', link: 'debug' },
  ];

  async logout() {
    this.authService.logout();
    await this.router.navigateByUrl('/auth');
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../../common/services/api/company.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private companyService: CompanyService) {}
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
    { name: 'Запись на время', icon: 'tuiIconClock', link: 'reservation' },
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

    // { name: 'DEBUG', icon: 'tuiIconCancel', link: 'debug' },
  ];

  nameCompany!: string;
  balance!: number;
  // { color: 'green', label: 'Активирован' },
  // { color: 'red', label: 'Не активирован' },
  statuses: any = {
    Active: { color: 'green', label: 'Активирован' },
    Disable: { color: 'green', label: 'Активирован' },
  };
  status: any = { color: 'white', label: '' };

  async logout() {
    this.authService.logout();
    await this.router.navigateByUrl('/auth');
  }

  ngOnInit(): void {
    this.companyService.getDataCompany().subscribe((data: any) => {
      this.status = this.statuses[data.status] ?? { color: 'black', label: 'Неизвестно' };
      this.balance = data.balance;
      this.nameCompany = data.name;
    });
  }
}

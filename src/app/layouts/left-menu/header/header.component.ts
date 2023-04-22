import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { CompanyService } from '../../../common/services/api/company.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  activeItemIndex = 0;
  showMobileNav = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private companyService: CompanyService
  ) {}

  menu = [
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
  ];

  nameCompany!: string;
  balance!: number;
  statuses: any = {
    Active: { color: 'green', label: 'Активирован' },
    Disable: { color: 'green', label: 'Активирован' },
  };
  status: any = { color: 'white', label: '' };


  ngOnInit(): void {
    this.companyService.getDataCompany().subscribe((data: any) => {
      this.status = this.statuses[data.status] ?? { color: 'black', label: 'Неизвестно' };
      this.balance = data.balance;
      this.nameCompany = data.name;
    });
  }

  onLogout() {
    this._logout();
  }

  onToggleMobileNav(value: boolean): void {
    this._toggleMobileNav(value);
  }

  private _toggleMobileNav(value: boolean): void {
    this.showMobileNav = value;
  }

  private _logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}

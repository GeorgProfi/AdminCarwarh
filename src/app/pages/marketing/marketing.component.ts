import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingComponent {
  activeItemIndex = 0;

  menu = [
    { name: 'Уведомления', icon: 'tuiIconBell', link: 'notification' },
    { name: 'Новости', icon: 'tuiIconFlag', link: 'news' },
  ];
}

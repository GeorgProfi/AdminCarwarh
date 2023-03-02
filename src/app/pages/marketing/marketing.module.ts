import { NgModule } from '@angular/core';
import { MarketingComponent } from './marketing.component';
import { TuiTabsModule } from '@taiga-ui/kit';
import { NgForOf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TuiSvgModule } from '@taiga-ui/core';
import { NotificationModule } from './notification/notification.module';
import { NewsModule } from './news/news.module';

@NgModule({
  imports: [
    TuiTabsModule,
    NgForOf,
    RouterLink,
    TuiSvgModule,
    RouterOutlet,
    NotificationModule,
    NewsModule,
  ],
  declarations: [MarketingComponent],
  exports: [MarketingComponent],
})
export class MarketingModule {}

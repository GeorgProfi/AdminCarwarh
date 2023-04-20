import { NgModule } from '@angular/core';
import { MarketingComponent } from './marketing.component';
import { TuiTabsModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiSvgModule } from '@taiga-ui/core';
import { NotificationModule } from './notification/notification.module';
import { NewsModule } from './news/news.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    TuiTabsModule,
    TuiSvgModule,

    NotificationModule,
    NewsModule,
  ],
  declarations: [MarketingComponent],
  exports: [MarketingComponent],
})
export class MarketingModule {}

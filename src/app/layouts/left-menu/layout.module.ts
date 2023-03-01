import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import {
  TuiAccordionModule,
  TuiBreadcrumbsModule,
  TuiIslandModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { AppRoutingModule } from '../../app-routing.module';
import { LayoutComponent } from './layout.component';
import { MenuComponent } from './menu/menu.component';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { TuiLetModule } from '@taiga-ui/cdk';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiTabsModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiIslandModule,
    TuiScrollbarModule,
    TuiAccordionModule,
    TuiLinkModule,
    TuiMoneyModule,
    TuiBreadcrumbsModule,
    TuiLetModule,
  ],
  declarations: [
    MenuComponent,
    FooterComponent,
    BreadcrumbsComponent,
    LayoutComponent,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}

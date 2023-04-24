import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TuiAccordionModule, TuiBreadcrumbsModule, TuiIslandModule, TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import { AppRoutingModule } from '../../app-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { TuiCurrencyPipeModule, TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';

@NgModule({
  imports: [
    CommonModule,
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
    TuiCurrencyPipeModule,
    TuiSidebarModule,
    TuiActiveZoneModule,
  ],
  declarations: [HeaderComponent, BreadcrumbsComponent, LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutModule {}

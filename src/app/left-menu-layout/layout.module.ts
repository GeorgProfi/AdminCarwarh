import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from './footer/footer.component';
import {
  TuiAccordionModule,
  TuiIslandModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { AppRoutingModule } from '../app-routing.module';
import { LayoutComponent } from './layout.component';
import { MenuComponent } from './menu/menu.component';

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
  ],
  declarations: [MenuComponent, FooterComponent, LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutModule {}

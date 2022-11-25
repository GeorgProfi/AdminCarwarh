import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { AppRoutingModule } from '../app-routing.module';
import { LayoutComponent } from './layout.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiTabsModule,
    TuiButtonModule,
    TuiSvgModule,
  ],
  declarations: [HeaderComponent, FooterComponent, LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutModule {}

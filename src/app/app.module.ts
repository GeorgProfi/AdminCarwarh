import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login-page/login.module';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './modules/home/home.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Base
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // Taiga
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    // My app
    LoginModule,
    LayoutModule,
    HomeModule,
  ],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  bootstrap: [AppComponent],
})
export class AppModule {}

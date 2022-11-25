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
import { AuthModule } from './auth-page/auth.module';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './modules/home/home.module';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ClientsModule } from './modules/clients/clients.module';
import { FilialsModule } from './modules/filials/filials.module';
import { LoyaltySystemModule } from './modules/loyalty-system/loyalty-system.module';
import { ServicesModule } from './modules/services/services.module';
import { SettingModule } from './modules/setting/setting.module';
import { NotificationModule } from './modules/notification/notification.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Base
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,
    // Taiga
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    // My app
    AuthModule,
    LayoutModule,
    HomeModule,
    ClientsModule,
    FilialsModule,
    LoyaltySystemModule,
    ServicesModule,
    SettingModule,
    NotificationModule,
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

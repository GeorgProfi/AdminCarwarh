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
import { StationModule } from './modules/stations/station.module';
import { LoyaltySystemModule } from './modules/loyalty-system/loyalty-system.module';
import { ServicesModule } from './modules/services/services.module';
import { SettingModule } from './modules/setting/setting.module';
import { NotificationModule } from './modules/notification/notification.module';
import { of } from 'rxjs';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';
import { DebugModule } from './modules/debug/debug.module';
import { ReservationModule } from './modules/reservation/reservation.module';

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
    StationModule,
    LoyaltySystemModule,
    ServicesModule,
    SettingModule,
    NotificationModule,
    ReservationModule,

    DebugModule,
  ],
  providers: [
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
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

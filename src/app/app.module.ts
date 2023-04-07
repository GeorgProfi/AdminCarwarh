import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth-page/auth.module';
import { AuthService } from './auth/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ClientsModule } from './pages/clients/clients.module';
import { StationModule } from './pages/stations/station.module';
import { LoyaltySystemModule } from './pages/loyalty-system/loyalty-system.module';
import { SettingModule } from './pages/setting/setting.module';
import { of } from 'rxjs';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';
import { ReservationModule } from './pages/reservation/reservation.module';
import { Error404Module } from './pages/error-404/error-404.module';
import { LayoutModule } from './layouts/left-menu/layout.module';
import { ServicesModule } from './pages/services/services.module';
import { MarketingModule } from './pages/marketing/marketing.module';
import { AngularYandexMapsModule } from 'angular8-yandex-maps';
import { TuiInputModule } from '@taiga-ui/kit';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Base
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    AngularYandexMapsModule,

    HttpClientModule,
    // Taiga
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    // My app
    Error404Module,
    AuthModule,
    LayoutModule,
    ClientsModule,
    StationModule,
    LoyaltySystemModule,
    ServicesModule,
    SettingModule,
    ReservationModule,
    MarketingModule,
    TuiInputModule,
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

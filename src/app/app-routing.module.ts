import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { StationComponent } from './modules/stations/station.component';
import { NotificationComponent } from './modules/notification/notification.component';
import { DebugComponent } from './modules/debug/debug.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { ReservationComponent } from './modules/reservation/reservation.component';
import { Error404Component } from './modules/error-404/error-404.component';
import { EditStationComponent } from './modules/stations/edit-station/edit-station.component';
import { LayoutComponent } from './layouts/left-menu/layout.component';
import { SettingProfileComponent } from './modules/setting/setting-profile/setting-profile.component';
import { SettingCompanyComponent } from './modules/setting/setting-company/setting-company.component';
import { ServicesComponent } from './modules/services/services.component';
import { EditServiceComponent } from './modules/services/edit-service/edit-service.component';
import { EditNotificationComponent } from './modules/notification/edit-notification/edit-notification.component';
import { EditClientComponent } from './modules/clients/edit-client/edit-client.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'loyalty-system', pathMatch: 'prefix' },
      // { path: 'loyalty-system', component: LoyaltySystemComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/edit/:id', component: EditClientComponent },
      { path: 'stations', component: StationComponent },
      {
        path: 'stations/edit/:id',
        component: EditStationComponent,
      },
      { path: 'services', component: ServicesComponent },
      { path: 'services/edit/:id', component: EditServiceComponent },
      { path: 'reservation', component: ReservationComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'notification/edit/:id', component: EditNotificationComponent },
      { path: 'setting-company', component: SettingCompanyComponent },
      { path: 'setting-profile', component: SettingProfileComponent },

      { path: 'debug', component: DebugComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'prefix' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

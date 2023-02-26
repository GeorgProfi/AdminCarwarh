import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { StationComponent } from './pages/stations/station.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { DebugComponent } from './pages/debug/debug.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { EditStationComponent } from './pages/stations/edit-station/edit-station.component';
import { LayoutComponent } from './layouts/left-menu/layout.component';
import { SettingProfileComponent } from './pages/setting/setting-profile/setting-profile.component';
import { SettingCompanyComponent } from './pages/setting/setting-company/setting-company.component';
import { ServicesComponent } from './pages/services/services.component';
import { EditServiceComponent } from './pages/services/edit-service/edit-service.component';
import { EditNotificationComponent } from './pages/notification/edit-notification/edit-notification.component';
import { EditClientComponent } from './pages/clients/edit-client/edit-client.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'loyalty-system', pathMatch: 'prefix' },
      // { path: 'loyalty-system', component: LoyaltySystemComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/edit', component: EditClientComponent },
      { path: 'stations', component: StationComponent },
      {
        path: 'stations/edit',
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

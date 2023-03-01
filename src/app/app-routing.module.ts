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
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'prefix',
      },
      {
        path: 'clients',
        component: ClientsComponent,
        title: 'Клиенты',
        data: {
          breadcrumbs: [{ title: 'Клиенты' }],
        },
      },
      {
        path: 'clients/edit',
        component: EditClientComponent,
        title: 'Редактор клиента',
        data: {
          breadcrumbs: [
            { title: 'Клиенты', url: 'clients' },
            { title: 'Редактор' },
          ],
        },
      },
      {
        path: 'stations',
        component: StationComponent,
        title: 'Станции',
        data: {
          breadcrumbs: [{ title: 'Станции' }],
        },
      },
      {
        path: 'stations/edit',
        component: EditStationComponent,
        title: 'Редактор станции',
        data: {
          breadcrumbs: [
            { title: 'Станции', url: 'stations' },
            { title: 'Редактор' },
          ],
        },
      },
      {
        path: 'services',
        component: ServicesComponent,
        title: 'Услуги',
        data: {
          breadcrumbs: [{ title: 'Услуги' }],
        },
      },
      {
        path: 'services/edit/:id',
        component: EditServiceComponent,
        title: 'Редактор услуги',
        data: {
          breadcrumbs: [
            { title: 'Услуги', url: 'services' },
            { title: 'Редактор' },
          ],
        },
      },
      {
        path: 'reservation',
        component: ReservationComponent,
        title: 'Запись на время',
      },
      {
        path: 'notification',
        component: NotificationComponent,
        title: 'Уведомления',
        data: {
          breadcrumbs: [{ title: 'Уведомления' }],
        },
      },
      {
        path: 'notification/edit/:id',
        component: EditNotificationComponent,
        title: 'Редактор уведомления',
        data: {
          breadcrumbs: [
            { title: 'Уведомления', url: 'notification' },
            { title: 'Редактор' },
          ],
        },
      },
      {
        path: 'setting-company',
        component: SettingCompanyComponent,
        title: 'Настрки компании',
        data: {
          breadcrumbs: [{ title: 'Настройки компании' }],
        },
      },
      {
        path: 'setting-profile',
        component: SettingProfileComponent,
        title: 'Настрки профиля',
        data: {
          breadcrumbs: [{ title: 'Настройки профиля' }],
        },
      },

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

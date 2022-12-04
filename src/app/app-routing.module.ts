import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { ClientsComponent } from './modules/clients/clients.component';
import { StationComponent } from './modules/stations/station.component';
import { LoyaltySystemComponent } from './modules/loyalty-system/loyalty-system.component';
import { ServicesComponent } from './modules/services/services.component';
import { SettingComponent } from './modules/setting/setting.component';
import { NotificationComponent } from './modules/notification/notification.component';
import { DebugComponent } from './modules/debug/debug.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'stations', component: StationComponent },
      { path: 'loyalty-system', component: LoyaltySystemComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'notification', component: NotificationComponent },

      { path: 'debug', component: DebugComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

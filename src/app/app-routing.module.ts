import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NotificationComponent } from './pages/marketing/notification/notification.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { LayoutComponent } from './layouts/left-menu/layout.component';
import { ServicesComponent } from './pages/services/services.component';
import { EditServiceComponent } from './pages/services/edit-service/edit-service.component';
import { EditNotificationComponent } from './pages/marketing/notification/edit-notification/edit-notification.component';
import { MarketingComponent } from './pages/marketing/marketing.component';
import { NewsComponent } from './pages/marketing/news/news.component';
import { EditNewsComponent } from './pages/marketing/news/edit-news/edit-news.component';

import { AnaliticComponent } from './pages/analitics/analitic.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'aboba', component: AnaliticComponent,
        title: 'Аналитика Станций'
      },
      {
        path: 'clients',
        loadChildren: () => import('./pages/clients/clients.module').then(m => m.ClientsModule),
      },
      {
        path: 'stations',
        loadChildren: () => import('./pages/stations/stations.module').then(m => m.StationsModule),
      },
      {
        path: 'services',
        component: ServicesComponent,
        title: 'Услуги',
      },
      {
        path: 'services/edit/:id',
        component: EditServiceComponent,
        title: 'Редактор услуги',
        data: {
          breadcrumbs: [{ title: 'Услуги', url: 'services' }, { title: 'Редактор' }],
        },
      },
      {
        path: 'reservation',
        component: ReservationComponent,
        title: 'Запись на время',
      },

      {
        path: 'marketing',
        component: MarketingComponent,
        title: 'Маркетинг',
        children: [
          {
            path: '',
            redirectTo: 'notification',
            pathMatch: 'prefix',
          },
          {
            path: 'notification',
            component: NotificationComponent,
          },
          {
            path: 'news',
            component: NewsComponent,
          },

        ],
      },
      {
        path: 'news/edit/:id',
        component: EditNewsComponent,
        title: 'Редактор новостей',
        data: {
          breadcrumbs: [
            { title: 'Маркетинг', url: 'marketing' },
            { title: 'Новости', url: 'marketing/news' },
            { title: 'Редактор' },
          ],
        },
      },
      {
        path: 'notification/edit/:id',
        component: EditNotificationComponent,
        title: 'Редактор уведомления',
        data: {
          breadcrumbs: [
            { title: 'Маркетинг', url: 'marketing' },
            { title: 'Уведомления', url: 'marketing/notification' },
            { title: 'Редактор' },
          ],
        },
      },
      {
        path: 'setting-company',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
      },
      {
        path: 'setting-profile',
        loadChildren: () => import('./pages/profile-settings/profile-settings.module')
          .then(m => m.ProfileSettingsModule),
      },
      {path: '', redirectTo: 'clients', pathMatch: 'full'},
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth-page/auth-page.module').then(m => m.AuthPageModule),
  },
  {
    path: 'aboba', component: AnaliticComponent
  },

  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

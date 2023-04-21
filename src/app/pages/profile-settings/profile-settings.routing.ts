import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileSettingsComponent } from "./profile-settings.component";

const routes: Routes = [
  {
    path: '',
    component: ProfileSettingsComponent,
    title: 'Настройки профиля',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileSettingsModuleRouting {}

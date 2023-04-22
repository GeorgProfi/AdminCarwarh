import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    title: 'Настройки компании',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsModuleRouting {}

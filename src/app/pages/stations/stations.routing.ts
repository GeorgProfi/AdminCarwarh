import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {StationsListComponent} from "./stations-list/stations-list.component";
import {EditStationComponent} from "./edit-station/edit-station.component";

const routes: Routes = [
  {
    path: '',
    component: StationsListComponent,
    title: 'Станции',
  },
  {
    path: 'edit',
    component: EditStationComponent,
    title: 'Редактор станции',
    data: {
      breadcrumbs: [{ title: 'Станции', url: 'stations' }, { title: 'Редактор' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationsModuleRouting {}

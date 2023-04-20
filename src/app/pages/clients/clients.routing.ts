import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EditClientComponent } from "./edit-client/edit-client.component";
import { ClientsListComponent } from "./clients-list/clients-list.component";

const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent,
    title: 'Клиенты',
  },
  {
    path: 'edit',
    component: EditClientComponent,
    title: 'Редактор клиента',
    data: {
      breadcrumbs: [{ title: 'Клиенты', url: 'clients' }, { title: 'Редактор' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsModuleRouting {}

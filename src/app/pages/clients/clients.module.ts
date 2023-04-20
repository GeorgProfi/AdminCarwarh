import { NgModule } from '@angular/core';
import { ClientsComponent } from './clients.component';
import { CreateClientComponent } from './clients-list/create-client/create-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiFormatDatePipeModule,
  TuiGroupModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiCheckboxBlockModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';
import { ClientsModuleRouting } from './clients.routing';
import { ClientsListComponent } from './clients-list/clients-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiLoaderModule,
    TuiTableModule,
    TuiLetModule,
    TuiButtonModule,
    TuiTablePaginationModule,
    TuiExpandModule,
    TuiIslandModule,
    TuiAutoFocusModule,
    TuiAccordionModule,
    TuiGroupModule,
    TuiPaginationModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiFormatDatePipeModule,
    TuiInputNumberModule,
    TuiInputPhoneModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLinkModule,
    TuiScrollbarModule,
    TuiCurrencyPipeModule,
    TuiCheckboxBlockModule,
    ScrollingModule,
    ClientsModuleRouting,
  ],
  declarations: [
    ClientsComponent,
    ClientsListComponent,
    CreateClientComponent,
    EditClientComponent
  ],
  exports: [ClientsComponent],
})
export class ClientsModule {}

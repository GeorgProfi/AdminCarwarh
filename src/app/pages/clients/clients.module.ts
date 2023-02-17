import { NgModule } from '@angular/core';
import { ClientsComponent } from './clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
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
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    TuiTextfieldControllerModule,
    TuiInputModule,
    FormsModule,
    TuiLoaderModule,
    AsyncPipe,
    NgIf,
    TuiTableModule,
    TuiLetModule,
    NgForOf,
    TuiButtonModule,
    TuiTablePaginationModule,
    TuiExpandModule,
    TuiIslandModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiAccordionModule,
    TuiGroupModule,
    TuiPaginationModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    DatePipe,
    TuiFormatDatePipeModule,
    TuiInputNumberModule,
    TuiInputPhoneModule,
    RouterModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLinkModule,
    TuiScrollbarModule,
    ScrollingModule,
  ],
  declarations: [ClientsComponent, CreateClientComponent, EditClientComponent],
  exports: [ClientsComponent],
})
export class ClientsModule {}

import { NgModule } from '@angular/core';
import { ServicesComponent } from './services.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiCheckboxBlockModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiFilterByInputPipeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputTimeModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiSelectOptionModule,
  TuiStringifyContentPipeModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAutoFocusModule, TuiFilterPipeModule, TuiLetModule } from '@taiga-ui/cdk';
import { CreateServiceComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { RouterLink, RouterModule } from '@angular/router';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';

@NgModule({
  imports: [
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiLoaderModule,
    AsyncPipe,
    NgIf,
    TuiTableModule,
    FormsModule,
    TuiLetModule,
    TuiButtonModule,
    TuiTablePaginationModule,
    NgForOf,
    TuiExpandModule,
    TuiIslandModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiSelectOptionModule,
    TuiDataListModule,
    TuiAccordionModule,
    TuiPaginationModule,
    TuiGroupModule,
    TuiTextAreaModule,
    TuiInputTimeModule,
    TuiCheckboxBlockModule,
    RouterLink,
    RouterModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLinkModule,
    TuiInputNumberModule,
    TuiComboBoxModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
    TuiCurrencyPipeModule,
    TuiFilterPipeModule,
  ],
  declarations: [ServicesComponent, CreateServiceComponent, EditServiceComponent],
  exports: [ServicesComponent],
})
export class ServicesModule {}

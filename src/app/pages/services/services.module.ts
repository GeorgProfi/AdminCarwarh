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
  TuiScrollbarModule,
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
import { CommonModule } from '@angular/common';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAutoFocusModule, TuiFilterPipeModule, TuiLetModule } from '@taiga-ui/cdk';
import { CreateServiceComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { RouterModule } from '@angular/router';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';

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
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLinkModule,
    TuiInputNumberModule,
    TuiComboBoxModule,
    TuiStringifyContentPipeModule,
    TuiFilterByInputPipeModule,
    TuiCurrencyPipeModule,
    TuiFilterPipeModule,
    TuiScrollbarModule,
  ],
  declarations: [ServicesComponent, CreateServiceComponent, EditServiceComponent],
  exports: [ServicesComponent],
})
export class ServicesModule {}

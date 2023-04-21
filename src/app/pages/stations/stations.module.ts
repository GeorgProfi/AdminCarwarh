import { NgModule } from '@angular/core';
import { StationsComponent } from './stations.component';
import { TuiReorderModule, TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiFilterPipeModule, TuiIsPresentPipeModule, TuiLetModule } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiArrowModule,
  TuiCheckboxBlockModule,
  TuiComboBoxModule,
  TuiDataListDropdownManagerModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiFilterByInputPipeModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputTimeModule,
  TuiIslandModule,
  TuiMultiSelectModule,
  TuiMultiSelectOptionModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiSliderModule,
  TuiStringifyContentPipeModule,
  TuiTabsModule,
  TuiTagModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateStationComponent } from './create-station/create-station.component';
import { EditStationComponent } from './edit-station/edit-station.component';
import { TuiCurrencyPipeModule, TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { RouterModule } from '@angular/router';
import { StationsListComponent } from './stations-list/stations-list.component';
import { StationsModuleRouting } from './stations.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StationsModuleRouting,
    SharedModule,

    TuiTableModule,
    TuiLetModule,
    TuiLinkModule,
    TuiTagModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiInputCountModule,
    TuiHostedDropdownModule,
    TuiReorderModule,
    TuiLoaderModule,
    TuiTablePaginationModule,
    TuiExpandModule,
    TuiIslandModule,
    TuiMoneyModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiSliderModule,
    TuiAutoFocusModule,
    TuiAccordionModule,
    TuiHintModule,
    TuiPaginationModule,
    TuiGroupModule,
    TuiInputTimeModule,
    TuiTextAreaModule,
    TuiDataListModule,
    TuiMultiSelectModule,
    TuiCheckboxBlockModule,
    TuiArrowModule,
    TuiDataListDropdownManagerModule,
    TuiMultiSelectOptionModule,
    TuiLabelModule,
    TuiNotificationModule,
    TuiInputNumberModule,
    TuiTabsModule,
    TuiFilterByInputPipeModule,
    TuiComboBoxModule,
    TuiStringifyContentPipeModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiCurrencyPipeModule,
    TuiFilterPipeModule,
    TuiIsPresentPipeModule,
  ],
  declarations: [
    StationsComponent,
    StationsListComponent,
    CreateStationComponent,
    EditStationComponent,
  ],
  exports: [StationsComponent],
})
export class StationsModule {}

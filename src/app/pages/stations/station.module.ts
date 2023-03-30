import { NgModule } from '@angular/core';
import { StationComponent } from './station.component';
import { TuiReorderModule, TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { AsyncPipe, DatePipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
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
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { RouterLink, RouterModule } from '@angular/router';
import { TimePipe } from '../../common/pipes/time.pipe';

@NgModule({
  imports: [
    TuiTableModule,
    TuiLetModule,
    NgForOf,
    NgIf,
    TuiLinkModule,
    TuiTagModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiInputCountModule,
    ReactiveFormsModule,
    FormsModule,
    TuiHostedDropdownModule,
    TuiReorderModule,
    TuiLoaderModule,
    AsyncPipe,
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
    DatePipe,
    TuiInputTimeModule,
    TuiTextAreaModule,
    RouterLink,
    TuiDataListModule,
    TuiMultiSelectModule,
    TuiCheckboxBlockModule,
    KeyValuePipe,

    TuiArrowModule,
    TuiDataListDropdownManagerModule,
    TuiMultiSelectOptionModule,
    TuiLabelModule,
    TuiNotificationModule,
    TuiInputNumberModule,
    RouterModule,
    TuiTabsModule,
    TuiFilterByInputPipeModule,
    TuiComboBoxModule,
    TuiStringifyContentPipeModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
  ],
  declarations: [StationComponent, CreateStationComponent, EditStationComponent, TimePipe],
  exports: [StationComponent, TimePipe],
})
export class StationModule {}

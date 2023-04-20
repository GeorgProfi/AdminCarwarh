import { NgModule } from '@angular/core';
import { ReservationComponent } from './reservation.component';
import {
  TuiButtonModule,
  TuiCalendarModule,
  TuiDataListModule,
  TuiDialogModule,
  TuiFormatNumberPipeModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFilterByInputPipeModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputTimeModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiFilterPipeModule, TuiLetModule } from '@taiga-ui/cdk';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { TableReservationComponent } from './table-reservation/table-reservation.component';
import { EditReservationComponent } from './edit-reservation/edit-reservation.component';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';
import { TableOrderComponent } from './table-order/table-order.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    TuiGroupModule,
    TuiInputModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    TuiTableModule,
    TuiPaginationModule,
    TuiLetModule,
    TuiAccordionModule,
    TuiCalendarModule,
    TuiDataListModule,
    TuiInputDateModule,
    TuiInputTimeModule,
    TuiHostedDropdownModule,
    TuiFormatNumberPipeModule,
    TuiIslandModule,
    TuiStringifyContentPipeModule,
    TuiComboBoxModule,
    TuiFilterByInputPipeModule,
    TuiDialogModule,
    TuiMoneyModule,
    TuiTagModule,
    TuiFilterPipeModule,
    FullCalendarModule,
  ],
  declarations: [
    ReservationComponent,
    CreateReservationComponent,
    TableReservationComponent,
    EditReservationComponent,
    TableOrderComponent,
  ],
  exports: [ReservationComponent],
})
export class ReservationModule {}

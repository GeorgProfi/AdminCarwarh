import { NgModule } from '@angular/core';
import { ReservationComponent } from './reservation.component';
import {
  TuiButtonModule,
  TuiCalendarModule,
  TuiDataListModule,
  TuiFormatNumberPipeModule,
  TuiGroupModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputTimeModule,
  TuiPaginationModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { ReservationService } from './reservation.service';
import { TuiLetModule } from '@taiga-ui/cdk';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';
import { ServicesService } from '../services/services.service';
import { TableReservationComponent } from './table-reservation/table-reservation.component';

@NgModule({
  imports: [
    TuiGroupModule,
    TuiInputModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    AsyncPipe,
    NgIf,
    TuiTableModule,
    TuiPaginationModule,
    TuiLetModule,
    NgForOf,
    DatePipe,
    TuiAccordionModule,
    ReactiveFormsModule,
    TuiCalendarModule,
    TuiDataListModule,
    TuiInputDateModule,
    TuiInputTimeModule,
    TuiHostedDropdownModule,
    TuiFormatNumberPipeModule,
  ],
  providers: [ReservationService, ServicesService],
  declarations: [
    ReservationComponent,
    CreateReservationComponent,
    TableReservationComponent,
  ],
  exports: [ReservationComponent],
})
export class ReservationModule {}

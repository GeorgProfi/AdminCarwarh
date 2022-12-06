import { NgModule } from '@angular/core';
import { StationComponent } from './station.component';
import {
  TuiReorderModule,
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  TuiButtonModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiInputCountModule,
  TuiInputModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiSliderModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateStationComponent } from './create-station/create-station.component';
import { StationService } from './station.service';
import { EditStationComponent } from './edit-station/edit-station.component';
import { TuiMoneyModule } from '@taiga-ui/addon-commerce';

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
  ],
  providers: [StationService],
  declarations: [
    StationComponent,
    CreateStationComponent,
    EditStationComponent,
  ],
  exports: [StationComponent],
})
export class StationModule {}

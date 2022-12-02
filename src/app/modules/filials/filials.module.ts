import { NgModule } from '@angular/core';
import { FilialsComponent } from './filials.component';
import {
  TuiReorderModule,
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  TuiButtonModule,
  TuiExpandModule,
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
  TuiSelectModule,
  TuiSliderModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateFilialComponent } from './create-filial/create-filial.component';
import { FilialsService } from './filials.service';
import { EditFilialComponent } from './edit-filial/edit-filial.component';
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
  ],
  providers: [FilialsService],
  declarations: [FilialsComponent, CreateFilialComponent, EditFilialComponent],
  exports: [FilialsComponent],
})
export class FilialsModule {}

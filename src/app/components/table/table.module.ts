import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import {
  TuiButtonModule,
  TuiGroupModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiPaginationModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    TuiGroupModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    NgIf,
    AsyncPipe,
    TuiTableModule,
    TuiButtonModule,
    TuiHintModule,
    TuiPaginationModule,
    NgForOf,
    TuiLetModule,
    HttpClientModule,
  ],
  declarations: [TableComponent],
  exports: [TableComponent],
})
export class TableModule {}

import { NgModule } from '@angular/core';
import { ServicesComponent } from './services.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiIslandModule,
  TuiSelectModule,
  TuiSelectOptionModule,
} from '@taiga-ui/kit';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { ServicesService } from './services.service';
import { CreateFilialComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';

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
  ],
  providers: [ServicesService],
  declarations: [
    ServicesComponent,
    CreateFilialComponent,
    EditServiceComponent,
  ],
  exports: [ServicesComponent],
})
export class ServicesModule {}

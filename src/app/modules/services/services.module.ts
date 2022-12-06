import { NgModule } from '@angular/core';
import { ServicesComponent } from './services.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiInputTimeModule,
  TuiIslandModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiSelectOptionModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';
import { ServicesService } from './services.service';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { CreateServiceComponent } from './create-service/create-service.component';

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
  ],
  providers: [ServicesService],
  declarations: [
    ServicesComponent,
    CreateServiceComponent,
    EditServiceComponent,
  ],
  exports: [ServicesComponent],
})
export class ServicesModule {}

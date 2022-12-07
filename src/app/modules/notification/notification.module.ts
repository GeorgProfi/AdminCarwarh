import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import {
  TuiButtonModule,
  TuiGroupModule,
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
import { NotificationService } from './notification.service';
import { TuiLetModule } from '@taiga-ui/cdk';

@NgModule({
  imports: [
    TuiGroupModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiButtonModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiLoaderModule,
    AsyncPipe,
    NgIf,
    TuiTableModule,
    TuiPaginationModule,
    TuiLetModule,
    NgForOf,
  ],
  providers: [NotificationService],
  declarations: [NotificationComponent],
  exports: [NotificationComponent],
})
export class NotificationModule {}

import { NgModule } from '@angular/core';
import { NotificationComponent } from './notification.component';
import {
  TuiButtonModule,
  TuiErrorModule,
  TuiGroupModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiPaginationModule,
  TuiSelectModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { NotificationService } from './notification.service';
import { TuiLetModule } from '@taiga-ui/cdk';
import { CreateNotificationComponent } from './create-notification/create-notification.component';
import { RouterModule } from '@angular/router';
import { EditNotificationComponent } from './edit-notification/edit-notification.component';

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
    TuiTextAreaModule,
    TuiAccordionModule,
    ReactiveFormsModule,
    TuiInputFilesModule,
    TuiLabelModule,
    RouterModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiLinkModule,
  ],
  providers: [NotificationService],
  declarations: [
    NotificationComponent,
    CreateNotificationComponent,
    EditNotificationComponent,
  ],
  exports: [NotificationComponent],
})
export class NotificationModule {}

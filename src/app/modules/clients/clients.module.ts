import { NgModule } from '@angular/core';
import { ClientsComponent } from './clients.component';
import { ClientsService } from './clients.service';
import { CreateClientComponent } from './create-client/create-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import {
  TuiButtonModule,
  TuiExpandModule,
  TuiGroupModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiInputModule,
  TuiIslandModule,
  TuiPaginationModule,
} from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import { TuiAutoFocusModule, TuiLetModule } from '@taiga-ui/cdk';

@NgModule({
  imports: [
    TuiTextfieldControllerModule,
    TuiInputModule,
    FormsModule,
    TuiLoaderModule,
    AsyncPipe,
    NgIf,
    TuiTableModule,
    TuiLetModule,
    NgForOf,
    TuiButtonModule,
    TuiTablePaginationModule,
    TuiExpandModule,
    TuiIslandModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiAccordionModule,
    TuiGroupModule,
    TuiPaginationModule,
  ],
  providers: [ClientsService],
  declarations: [ClientsComponent, CreateClientComponent, EditClientComponent],
  exports: [ClientsComponent],
})
export class ClientsModule {}

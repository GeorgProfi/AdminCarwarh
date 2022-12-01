import { NgModule } from '@angular/core';
import { SettingComponent } from './setting.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiInputFilesModule,
  TuiInputPasswordModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { AsyncPipe, NgIf } from '@angular/common';

@NgModule({
  imports: [
    ReactiveFormsModule,
    TuiTextAreaModule,
    TuiInputFilesModule,
    NgIf,
    AsyncPipe,
    TuiInputPasswordModule,
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent],
})
export class SettingModule {}

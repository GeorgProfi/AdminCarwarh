import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiFieldErrorPipeModule,
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule, TuiLabelModule } from '@taiga-ui/core';
import { SettingsComponent } from './settings.component';
import { CommonModule } from '@angular/common';
import { SettingsModuleRouting } from './settings.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TuiTextAreaModule,
    TuiInputFilesModule,
    TuiInputPasswordModule,
    TuiLabelModule,
    TuiButtonModule,
    TuiInputNumberModule,
    TuiInputModule,
    TuiInputPhoneModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,

    SettingsModuleRouting,
  ],
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
})
export class SettingsModule {}

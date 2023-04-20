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
import { SettingProfileComponent } from './setting-profile/setting-profile.component';
import { SettingCompanyComponent } from './setting-company/setting-company.component';
import { CommonModule } from '@angular/common';

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
  ],
  declarations: [SettingProfileComponent, SettingCompanyComponent],
  exports: [],
})
export class SettingModule {}

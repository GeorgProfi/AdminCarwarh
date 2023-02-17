import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiInputFilesModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { AsyncPipe, NgIf } from '@angular/common';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { SettingProfileComponent } from './setting-profile/setting-profile.component';
import { SettingCompanyComponent } from './setting-company/setting-company.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    TuiTextAreaModule,
    TuiInputFilesModule,
    NgIf,
    AsyncPipe,
    TuiInputPasswordModule,
    TuiLabelModule,
    TuiButtonModule,
    TuiInputNumberModule,
    TuiInputModule,
    FormsModule,
    TuiInputPhoneModule,
  ],
  declarations: [SettingProfileComponent, SettingCompanyComponent],
  exports: [],
})
export class SettingModule {}

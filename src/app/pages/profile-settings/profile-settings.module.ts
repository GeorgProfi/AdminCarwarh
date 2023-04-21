import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule, TuiLabelModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsComponent } from './profile-settings.component';
import { ProfileSettingsModuleRouting } from './profile-settings.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TuiTextAreaModule,
    TuiInputPasswordModule,
    TuiLabelModule,
    TuiButtonModule,
    TuiInputModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    ProfileSettingsModuleRouting,
  ],
  declarations: [ProfileSettingsComponent],
  exports: [ProfileSettingsComponent],
})
export class ProfileSettingsModule {}

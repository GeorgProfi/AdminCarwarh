import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiErrorModule,
    TuiButtonModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}

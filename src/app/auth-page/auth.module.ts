import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule, TuiGroupModule } from '@taiga-ui/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthPageComponent } from './auth-page.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputPasswordModule,
    TuiErrorModule,
    TuiButtonModule,
    RouterLink,
    TuiTabsModule,
    RouterOutlet,
    TuiGroupModule,
    TuiFieldErrorPipeModule,
  ],
  declarations: [AuthPageComponent, LoginComponent, RegisterComponent],
  exports: [AuthPageComponent, LoginComponent, RegisterComponent],
})
export class AuthModule {}

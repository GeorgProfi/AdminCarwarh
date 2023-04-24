import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiTabsModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule, TuiGroupModule } from '@taiga-ui/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { AuthPageComponent } from './auth-page.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthPageModuleRouting } from './auth-page.routing';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    TuiInputModule,
    TuiInputPasswordModule,
    TuiErrorModule,
    TuiButtonModule,
    TuiTabsModule,
    TuiGroupModule,
    TuiFieldErrorPipeModule,

    AuthPageModuleRouting,
  ],
  declarations: [
    AuthPageComponent,
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent,
  ],
  exports: [AuthPageComponent],
})
export class AuthPageModule {}

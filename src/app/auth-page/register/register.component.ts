import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent {
  constructor(private route: Router, private authService: AuthService) {}

  authForm = new FormGroup({
    nameCarWash: new FormControl('TEST', Validators.required),
    email: new FormControl('TEST@email.com', Validators.required),
    phone: new FormControl('+71231231212', Validators.required),
    password: new FormControl('1234', Validators.required),
    passwordRepeat: new FormControl('1234', Validators.required),
  });

  enabledError = false;
  error = new TuiValidationError(`Неверно логин или пароль`);

  get computedError(): TuiValidationError | null {
    return this.enabledError ? this.error : null;
  }

  async onSubmit(): Promise<void> {
    const data = this.authForm.value;
    if (!(data.phone && data.email && data.nameCarWash && data.password)) {
      return;
    }

    this.authService
      .register({
        phone: data.phone,
        password: data.password,
        email: data.email,
        nameCarWash: data.nameCarWash,
      })
      .subscribe({
        next: data => {
          this.route.navigateByUrl('');
        },
        error: error => {
          this.enabledError = true;
        },
      });
  }
}

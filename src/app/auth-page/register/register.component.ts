import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';

@Component({
  selector: 'app-auth',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent {
  constructor(private route: Router, private authService: AuthService) {}

  authForm = new FormGroup({
    nameCarWash: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  enabledError = false;
  error = new TuiValidationError(`Неверно логин или пароль`);

  get computedError(): TuiValidationError | null {
    return this.enabledError ? this.error : null;
  }

  async onSubmit(): Promise<void> {
    const data = this.authForm.value;
    console.log(666);
    if (!(data.phone && data.email && data.nameCarWash && data.password)) {
      return;
    }
    console.log(777);

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

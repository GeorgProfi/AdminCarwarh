import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import { RegistrationService } from '../../common/services/api/registration.service';
import { TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent {
  constructor(
    private route: Router,
    private registrationService: RegistrationService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  authForm = new FormGroup({
    nameCarWash: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordRepeat: new FormControl('', Validators.required),
  });

  enabledError = false;
  error = new TuiValidationError(`Неверно логин или пароль`);

  get computedError(): TuiValidationError | null {
    return this.enabledError ? this.error : null;
  }

  async onSubmit(): Promise<void> {
    const data = this.authForm.value;
    if (!(data.email && data.nameCarWash && data.password)) {
      return;
    }

    this.registrationService
      .register({
        password: data.password,
        email: data.email,
        name: data.nameCarWash,
      })
      .subscribe({
        next: () => {
          this.dialogService.open(`Письмо с подтверждением отправлено на почту ${data.email}`).subscribe();
          this.authForm.reset();
        },
        error: error => {
          console.log(error);
          this.enabledError = true;
        },
      });
  }
}

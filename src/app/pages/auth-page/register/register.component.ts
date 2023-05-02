import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../../common/services/api/registration.service';
import { TuiDialogService } from '@taiga-ui/core';
import { emailValidator, matchValidator } from 'src/app/shared/validators';
import { TUI_VALIDATION_ERRORS } from '@taiga-ui/kit/tokens';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Поле не может быть пустым',
        email: 'E-mail указан неверно',
        matching: 'Пароли не совпадают',
        minlength: 'Минимум 4 символа',
      },
    }
  ] ,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, emailValidator],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), matchValidator('passwordRepeat')],
    }),
    passwordRepeat: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), matchValidator('password', true)],
    }),
  });

  constructor(
    private registrationService: RegistrationService,
    private readonly dialogService: TuiDialogService,
  ) {}

  onSubmit(): void {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity())

    if (this.form.valid) {
      const data = this.form.value;
      data.name && data.email && data.password && this._submit(data.name, data.email, data.password);
    }
  }

  private _submit(name: string, email: string, password: string): void {
    this.registrationService
      .register({ name, email, password })
      .subscribe({
        next: () => this._registerSuccess(email),
        error: () => this._registerError(),
      });
  }

  private _registerSuccess(email: string): void {
    this.dialogService.open(`Письмо с подтверждением отправлено на почту ${email}`).subscribe();
    this.form.reset();
  }

  private _registerError(): void {
    this.dialogService.open(`Что-то пошло не так`).subscribe();
  }
}

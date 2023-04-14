import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AccountService } from '../../../common/services/api/account.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';
import { matchValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingProfileComponent {
  repeatPassErr = new TuiValidationError('Пароли не совпадают!');
  emailErr = new TuiValidationError('Некорректный email');

  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  emailForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  })

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, matchValidator('repeatPassword', true)]
    }),
    repeatPassword: new FormControl('', [Validators.required, matchValidator('newPassword')]),
  })

  constructor(
    private accountService: AccountService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}

  get newEmail(): string {
    return this.emailForm.get('email')?.value as string;
  };

  get oldPassword(): string {
    return this.passwordForm.get('oldPassword')?.value as string;
  };

  get newPassword(): string {
    return this.passwordForm.get('newPassword')?.value as string;
  };

  get repeatPassword(): string {
    return this.passwordForm.get('repeatPassword')?.value as string;
  };

  get isPasswordFormInvalid(): boolean {
    return this.passwordForm.invalid;
  }

  get isEmailFormInvalid(): boolean {
    return this.emailForm.invalid;
  }

  get passwordError(): TuiValidationError | null {
    return this.newPassword !== this.repeatPassword ? this.repeatPassErr : null
  }

  get emailError(): TuiValidationError | null {
    return this.emailForm.touched && this.isEmailFormInvalid ? this.emailErr : null;
  }

  onChangeEmail() {
    this.prompt.subscribe({ next: value => value && this._changeEmail(this.newEmail) });
  }

  onChangePassword() {
    this.prompt.subscribe({ next: value => value && this._changePassword() });
  }

  private _changeEmail(email: string): void {
    this.accountService
      .changeEmail({
        newEmail: email,
      })
      .subscribe({
        next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }

  private _changePassword(): void {
    this.accountService
      .changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }
}

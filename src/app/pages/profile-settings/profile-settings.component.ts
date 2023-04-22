import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AccountService } from '../../common/services/api/account.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator, matchValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent {
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  emailForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, emailValidator] }),
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

  onChangeEmail() {
    this.emailForm.markAllAsTouched();
    Object.values(this.emailForm.controls).map(control => control.updateValueAndValidity())

    this.emailForm.valid && this.prompt.subscribe({
      next: value => value && this._changeEmail(this.emailForm.controls.email.value)
    });
  }

  onChangePassword() {
    this.passwordForm.markAllAsTouched();
    Object.values(this.passwordForm.controls).map(control => control.updateValueAndValidity())

    this.passwordForm.valid && this.prompt.subscribe({
      next: value => value && this._changePassword(
        this.passwordForm.controls.oldPassword.value,
        this.passwordForm.controls.newPassword.value,
      ),
    });
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

  private _changePassword(oldPassword: string, newPassword: string): void {
    this.accountService
      .changePassword({
        oldPassword,
        newPassword,
      })
      .subscribe({
        next: () => this.alertService.open('успех', { status: TuiNotification.Success }).subscribe(),
        error: () => this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe(),
      });
  }
}

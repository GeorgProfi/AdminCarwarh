import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AccountService } from '../../../common/services/api/account.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingProfileComponent {
  constructor(
    private accountService: AccountService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });
  email = '';
  oldPassword = '';
  newPassword = '';
  repeatPassword = '';

  async changeEmail() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    if (!this.email.length) {
      console.log('fuck');
      return;
    }
    this.accountService
      .changeEmail({
        newEmail: this.email,
      })
      .subscribe(
        () => {
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
  }

  async changePassword() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    if (this.newPassword !== this.repeatPassword) {
      console.log('fuck');
      return;
    }
    this.accountService
      .changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
      .subscribe(
        () => {
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        }
      );
  }
}

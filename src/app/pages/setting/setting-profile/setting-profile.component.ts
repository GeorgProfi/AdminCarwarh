import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountService } from '../../../common/services/api/account.service';

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingProfileComponent {
  constructor(private accountService: AccountService) {}
  email = '';
  oldPassword = '';
  newPassword = '';
  repeatPassword = '';

  changeEmail() {
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
          console.log('ok');
        },
        error => {
          console.error(error);
        }
      );
  }

  changePassword() {
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
          console.log('ok');
        },
        error => {
          console.error(error);
        }
      );
  }
}

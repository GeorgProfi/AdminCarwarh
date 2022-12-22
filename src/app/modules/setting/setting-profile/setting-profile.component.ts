import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-setting-profile',
  templateUrl: './setting-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingProfileComponent {
  password = '';
  repeatPassword = '';
}

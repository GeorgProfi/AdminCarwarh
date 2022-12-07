import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  activeItemIndex = 0;
}

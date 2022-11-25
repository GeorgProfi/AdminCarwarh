import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TUI_PASSWORD_TEXTS,
  tuiInputPasswordOptionsProvider,
} from '@taiga-ui/kit';
import { of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiValidationError } from '@taiga-ui/cdk';

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiInputPasswordOptionsProvider({
      icons: {
        hide: `tuiIconLockLarge`,
        show: `tuiIconLockOpenLarge`,
      },
    }),
    {
      provide: TUI_PASSWORD_TEXTS,
      useValue: of([``]),
    },
  ],
})
export class LoginComponent {
  constructor(private route: Router) {}

  authForm = new FormGroup({
    nickname: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  enabledError = false;
  error = new TuiValidationError(`Неверно логин или пароль`);

  get computedError(): TuiValidationError | null {
    return this.enabledError ? this.error : null;
  }

  async onSubmit(): Promise<void> {
    console.log('Submit!');
    await this.route.navigateByUrl('');
  }
}

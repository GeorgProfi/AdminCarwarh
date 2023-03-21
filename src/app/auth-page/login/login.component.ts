import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TUI_PASSWORD_TEXTS, tuiInputPasswordOptionsProvider } from '@taiga-ui/kit';
import { of } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiValidationError } from '@taiga-ui/cdk';
import { AuthService } from '../../auth/auth.service';
import { TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: 'app-login',
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
export class LoginComponent implements OnInit {
  constructor(
    private route: Router,
    private authService: AuthService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  ngOnInit() {
    const query = this.route.parseUrl(this.route.url).queryParams;
    let email: string = '';
    if (query['reg_email']) {
      this.dialogService.open(`Почта успешно подтверждена!`).subscribe();
      email = query['reg_email'];
    } else if (query['refresh_pass_email']) {
      this.dialogService.open(`Пароль успешно обновлен!`).subscribe();
      email = query['refresh_pass_email'];
    } else if (query['change_email_email']) {
      this.dialogService.open(`Почта успешно обновлена!`).subscribe();
      email = query['change_email_email'];
    }
    this.authForm.patchValue({ email });
  }

  authForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  enabledError = false;
  error = new TuiValidationError(`Неверно логин или пароль`);

  get computedError(): TuiValidationError | null {
    return this.enabledError ? this.error : null;
  }

  async onSubmit(): Promise<void> {
    const nickname = this.authForm.value.email;
    const password = this.authForm.value.password;
    if (!nickname || !password) {
      this.enabledError = true;
      return;
    }

    this.authService.login(nickname, password).subscribe({
      next: data => {
        this.route.navigateByUrl('');
      },
      error: error => {
        this.enabledError = true;
      },
    });
  }
}

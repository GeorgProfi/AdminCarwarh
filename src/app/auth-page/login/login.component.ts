import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TUI_PASSWORD_TEXTS, TUI_PROMPT, tuiInputPasswordOptionsProvider } from '@taiga-ui/kit';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TuiValidationError } from '@taiga-ui/cdk';
import { AuthService } from '../../auth/auth.service';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { AccountService } from '../../common/services/api/account.service';

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
    private accountService: AccountService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService
  ) {}

  ngOnInit() {
    const query = this.route.parseUrl(this.route.url).queryParams;
    if (query['reg_email']) {
      this.dialogService.open(`Почта успешно подтверждена!`).subscribe();
      this.email = query['reg_email'];
    } else if (query['refresh_pass_email']) {
      this.dialogService.open(`Пароль успешно обновлен!`).subscribe();
      this.email = query['refresh_pass_email'];
    } else if (query['change_email_email']) {
      this.dialogService.open(`Почта успешно обновлена!`).subscribe();
      this.email = query['change_email_email'];
    }
  }

  email = '';
  password = '';

  enabledError = false;
  error = new TuiValidationError(`Неверно введен логин или пароль`);

  get computedError(): TuiValidationError | null {
    return this.enabledError ? this.error : null;
  }

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      this.enabledError = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: data => {
        this.route.navigateByUrl('');
      },
      error: error => {
        this.enabledError = true;
      },
    });
  }

  refreshPassword() {
    if (!this.email || !this.password) {
      this.enabledError = true;
      return;
    }

    this.dialogService
      .open<boolean>(TUI_PROMPT, {
        label: 'Вы уверены?',
        data: {
          content: `На почту ${this.email} будет отправлено письмо с временным паролем`,
        },
        size: 's',
        closeable: false,
        dismissible: false,
      })
      .subscribe();
    this.accountService
      .refreshPassword({
        email: this.email,
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

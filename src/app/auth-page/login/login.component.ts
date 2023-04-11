import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuiValidationError } from '@taiga-ui/cdk';
import { AuthService } from '../../auth/auth.service';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { AccountService } from '../../common/services/api/account.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private error: TuiValidationError | null = null;
  private refreshPasswordDialogSbs?: Subscription | null = null;
  isLoading = false;

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private route: Router,
    private authService: AuthService,
    private accountService: AccountService,
    private changeDetectionRef: ChangeDetectorRef,
    private readonly dialogService: TuiDialogService,
  ) {}

  get isInvalid(): boolean {
    return this.form.invalid;
  }

  get email(): string | null | undefined {
    return this.form.value.email;
  }

  get password(): string | null | undefined {
    return this.form.value.password;
  }

  ngOnInit() {
    const query = this.route.parseUrl(this.route.url).queryParams;
    if (query['reg_email']) {
      this.dialogService.open(`Почта успешно подтверждена!`).subscribe();
      this.form.get('email')?.setValue(query['reg_email']);
    } else if (query['refresh_pass_email']) {
      this.dialogService.open(`Пароль успешно обновлен!`).subscribe();
      this.form.get('email')?.setValue(query['refresh_pass_email']);
    } else if (query['change_email_email']) {
      this.dialogService.open(`Почта успешно обновлена!`).subscribe();
      this.form.get('email')?.setValue(query['change_email_email']);
    }
  }

  get computedError(): TuiValidationError | null {
    return this.error || null;
  }

  private showError(error: string): void {
    this.error = new TuiValidationError(error);
    this.changeDetectionRef.detectChanges();
  }

  async login(): Promise<void> {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => this.route.navigateByUrl(''),
        error: res => this.showError(res.error.message),
      });
    }
  }

  onShowRefreshPasswordDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.refreshPasswordDialogSbs = this.dialogService.open(content, {label: 'Вы уверены?'}).subscribe();
  }

  onPasswordRefresh(): void {
    this.email && this.refreshPassword(this.email);
  }

  private refreshPasswordSuccess(): void {
    this.refreshPasswordDialogSbs?.unsubscribe();
    this.refreshPasswordDialogSbs = null;

    this.dialogService.open('', {
      label: 'Письмо успешно отправлено!',
      size: 's',
      closeable: false,
      dismissible: false,
    })
    .subscribe();
  }

  private refreshPasswordError(): void {
    this.dialogService.open('', {
      label: 'Произошла ошибка, попробуйте позже!',
      size: 's',
      closeable: false,
      dismissible: false,
    })
    .subscribe();
  }

  private refreshPassword(email: string) {
    this.isLoading = true;
    this.accountService
      .refreshPassword({email})
      .subscribe({
        next: () => this.refreshPasswordSuccess(),
        error: () => this.refreshPasswordError(),
        complete: () => this.isLoading = false,
      })
  }
}

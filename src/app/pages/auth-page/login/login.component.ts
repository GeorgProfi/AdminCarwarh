import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { TuiDialogService } from '@taiga-ui/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private route: Router,
    private authService: AuthService,
    private readonly dialogService: TuiDialogService,
  ) {}

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

  onLogin(): void {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity())
    this.form.valid && this.email && this.password && this._login(this.email, this.password);
  }

  private _login(email: string, password: string): void {
    this.authService.login(email, password).subscribe({
      next: () => this.route.navigateByUrl('clients'),
      error: res => this._showError(res?.error?.message),
    });
  }

  private _showError(error: unknown): void {
    typeof error === 'string'
      ? this.dialogService.open(error).subscribe()
      : this.dialogService.open('Произошла ошибка, попробуйте позже!').subscribe()
  }
}

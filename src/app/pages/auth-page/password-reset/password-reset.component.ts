import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TuiDialogContext, TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { AccountService } from "src/app/common/services/api/account.service";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  isLoading = false;

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  constructor(
    private accountService: AccountService,
    private readonly dialogService: TuiDialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  get email(): string {
    return this.form.controls.email.value;
  }

  onSubmit(content: PolymorpheusContent<TuiDialogContext>): void {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity())

    if (this.form.valid) {
      this.dialogService.open(content, {
        label: 'Вы уверены?',
        size: 'm',
        closeable: false,
        dismissible: false,
      }).subscribe();
    }
  }

  onPasswordReset(): void {
    this.email && this._resetPassword(this.email);
  }

  private _resetPassword(email: string) {
    this.isLoading = true;
    this.accountService
      .refreshPassword({email})
      .subscribe({
        next: () => this._resetPasswordSuccess(),
        error: () => this._resetPasswordError(),
      })
  }

  private _resetPasswordSuccess(): void {
    this.dialogService.open('', {
      label: 'Письмо успешно отправлено!',
      size: 's',
      closeable: false,
      dismissible: false,
    }).subscribe();

    this.form.reset();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  private _resetPasswordError(): void {
    this.dialogService.open('', {
      label: 'Произошла ошибка, попробуйте позже!',
      size: 's',
      closeable: false,
      dismissible: false,
    }).subscribe();

    this.isLoading = false;
    this.cdr.detectChanges();
  }
}

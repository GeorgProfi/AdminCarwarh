import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { ClientsService } from '../../../../common/services/api/clients.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogService, TuiNotification, tuiNumberFormatProvider } from '@taiga-ui/core';
import { TUI_PROMPT, TUI_VALIDATION_ERRORS } from '@taiga-ui/kit';
import { CreateClientDto } from 'src/app/common/dto/client/create-client.dto';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.less'],
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'Поле не может быть пустым',
        minlength: 'Минимум 4 символа',
      },
    },
    tuiNumberFormatProvider({
      thousandSeparator: '',
    })
  ],
})
export class CreateClientComponent {
  @Output() eCreate = new EventEmitter();
  expanded = false;
  isLoading: boolean = false;
  expandedCode = false;
  checkControl = new FormControl(false);

  codeForm = new FormGroup({
    code: new FormControl<number | null>(null, [Validators.required, Validators.minLength(4)])
  })

  form = new FormGroup({
    phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
    name: new FormControl(''),
  });

  constructor(
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  get code(): string {
    return this.codeForm.controls.code.value
      ? this.codeForm.controls.code.value.toString()
      : ''
  }

  onToggle(): void {
    this.expanded = !this.expanded;
  }

  onAcceptCode() {
    this.code.length < 4 && this.codeForm.controls.code.setErrors({minlength: true});
    this.codeForm.markAllAsTouched();
    this.codeForm.valid && this._submitRegistration();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    Object.values(this.form.controls).map(control => control.updateValueAndValidity());

    if (this.form.valid) {
      this.dialogService.open<boolean>(TUI_PROMPT, {
        label: 'Вы уверены?',
        size: 's',
        closeable: false,
        dismissible: false,
      }).subscribe({
        next: value => value && this._submit(),
      });
    }
  }

  private _submit() {
    const data = this.form.value as CreateClientDto;
    if (!data.name) data.name = data.phone;
    this.checkControl.value ? this._requestRegistration(data) : this._createClient(data)
  }

  private _requestRegistration(data: CreateClientDto): void {
    this.expandedCode = true
    this.clientsService.requestRegistrationClient(data).subscribe({
      next: () => this.expandedCode = true,
      error: res => this._submitError(res.error?.message || 'Ошибка'),
      complete: () => this.changeDetectorRef.detectChanges(),
    });
  }

  private _createClient(data: CreateClientDto): void {
    this.clientsService.createClient(data).subscribe({
      next: () => this._submitSuccess(),
      error: res => this._submitError(res.error?.message || 'Ошибка'),
    });
  }

  private _submitRegistration(): void {
    this.isLoading = true;

    this.clientsService.codeRegistrationClient(this.code).subscribe({
      next: () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.isLoading = false;
        this.expandedCode = false;
        this.checkControl.reset();
        this.codeForm.reset();
        this.form.reset();
        this.eCreate.emit();
      },
      error: (res) => {
        this.alertService.open(`${res.error?.message || 'Ошибка'}`, { status: TuiNotification.Error }).subscribe();
        this.isLoading = false;
        this.codeForm.reset();
      },
    });
  }

  private _submitSuccess(): void {
    this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
    this.form.reset();
    this.eCreate.emit();
  }

  private _submitError(error: string): void {
    this.alertService.open(error, { status: TuiNotification.Error }).subscribe();
  }
}

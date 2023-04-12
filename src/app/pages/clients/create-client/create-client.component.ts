import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { ClientsService } from '../../../common/services/api/clients.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogService, TuiNotification, tuiNumberFormatProvider } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { CreateClientDto } from 'src/app/common/dto/client/create-client.dto';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.less'],
  providers: [tuiNumberFormatProvider({
    thousandSeparator: '',
  })],
})
export class CreateClientComponent {
  expanded = false;
  isLoading: boolean = false;
  expandedCode = false;
  checkControl = new FormControl(false);

  codeForm = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)]
    })
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
    return this.codeForm.get('code')?.value.toString() || '';
  }

  get isInvalid(): boolean {
    return this.form.invalid;
  }

  get isInvalidCode(): boolean {
    console.log(this.code);

    return this.codeForm.invalid || this.code.length !== 4;
  }

  @Output() createEvent = new EventEmitter();

  onToggle(): void {
    this.expanded = !this.expanded;
  }

  onAcceptCode() {
    this.isInvalidCode
      ? this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe()
      : this.submitRegistration();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.isInvalid) {
      this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }
    this.dialogService.open<boolean>(TUI_PROMPT, {
      label: 'Вы уверены?',
      size: 's',
      closeable: false,
      dismissible: false,
    }).subscribe({
      next: value => value && this.submit(),
    });
  }

  private submit() {
    const data = this.form.value as CreateClientDto;
    if (!data.name) data.name = data.phone;
    this.checkControl.value ? this.requestRegistration(data) : this.createClient(data)
  }

  private requestRegistration(data: CreateClientDto): void {
    this.clientsService.requestRegistrationClient(data).subscribe({
      next: () => this.expandedCode = true,
      error: error => this.submitError(error),
      complete: () => this.changeDetectorRef.detectChanges(),
    });
  }

  private createClient(data: CreateClientDto): void {
    this.clientsService.createClient(data).subscribe({
      next: () => this.submitSuccess(),
      error: error => this.submitError(error),
    });
  }

  private submitRegistration(): void {
    this.isLoading = true;

    this.clientsService.codeRegistrationClient(this.code).subscribe({
      next: () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.isLoading = false;
        this.expandedCode = false;
        this.createEvent.emit();
        this.checkControl.reset();
        this.codeForm.reset();
        this.form.reset();
      },
      error: () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        this.isLoading = false;
        this.codeForm.reset();
      },
    });
  }

  private submitSuccess(): void {
    this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
    this.form.reset();
    this.createEvent.emit();
  }

  private submitError(error: string): void {
    this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
    console.error(error);
  }
}

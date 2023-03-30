import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ClientsService } from '../../../common/services/api/clients.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.less'],
})
export class CreateClientComponent {
  constructor(
    private clientsService: ClientsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}
  readonly prompt = this.dialogService.open<boolean>(TUI_PROMPT, {
    label: 'Вы уверены?',
    size: 's',
    closeable: false,
    dismissible: false,
  });

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  form = new FormGroup({
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    check: new FormControl(false, { nonNullable: true }),
  });

  async onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }

    const data: any = this.form.value;
    if (data.check) {
      this.clientsService.requestRegistrationClient(data).subscribe({
        next: () => {
          this.expandedCode = true;
        },
        error: error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
          console.error(error);
        },
      });
    } else {
      this.clientsService.createClient(data).subscribe(
        () => {
          this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
          this.form.reset();
          this.createEvent.emit();
        },
        error => {
          this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
          console.error(error);
        }
      );
    }
  }

  loader: boolean = false;
  expandedCode = false;
  code = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]);
  onAcceptCode() {
    if (!this.code.valid) {
      this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }

    this.loader = true;
    const code: string = this.code.value as string;
    this.clientsService.codeRegistrationClient(code).subscribe(
      () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.loader = false;
        this.expandedCode = false;
        this.code.reset();
        this.createEvent.emit();
      },
      () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
        this.loader = false;
        this.code.reset();
      }
    );
  }
}

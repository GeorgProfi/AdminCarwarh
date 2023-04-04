import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { ServicesService } from '../../../common/services/api/services.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateServiceComponent {
  constructor(
    private servicesService: ServicesService,
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

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(``, { nonNullable: true }),
  });

  async onSubmit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    const data: any = this.form.value;
    this.servicesService.createService(data).subscribe(
      () => {
        this.createEvent.emit();
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      error => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }
}

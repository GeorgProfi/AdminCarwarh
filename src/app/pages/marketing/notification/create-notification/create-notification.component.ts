import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateNotificationDto } from '../../../../common/dto/notification/create-notification.dto';
import { NotificationService } from '../../../../common/services/api/notification.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNotificationComponent {
  constructor(
    private notificationService: NotificationService,
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
  formCreateNotification = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    text: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    send: new FormControl(false, { nonNullable: true }),
  });

  async onSubmit() {
    if (this.formCreateNotification.valid) {
      this.alertService.open('форма не валидна', { status: TuiNotification.Warning }).subscribe();
      return;
    }
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }

    const data: CreateNotificationDto = this.formCreateNotification.value as CreateNotificationDto;
    this.notificationService.createNotification(data).subscribe(
      data => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
        this.formCreateNotification.reset();
      },
      () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }
}

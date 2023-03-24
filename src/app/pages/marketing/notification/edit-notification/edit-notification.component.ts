import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../common/services/api/notification.service';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNotificationComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
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
  notificationForm = new FormGroup({
    title: new FormControl(``, Validators.required),
    content: new FormControl(''),
  });

  id: string = this.router.snapshot.params['id'];

  async removeNotification() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.notificationService.removeNotification(this.id).subscribe(
      () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }

  async pushNotification() {
    const p = await this.prompt.toPromise();
    if (!p) {
      return;
    }
    this.notificationService.pushNotification(this.id).subscribe(
      () => {
        this.alertService.open('успех', { status: TuiNotification.Success }).subscribe();
      },
      () => {
        this.alertService.open('ошибка', { status: TuiNotification.Error }).subscribe();
      }
    );
  }

  ngOnInit(): void {
    this.notificationService.getNotification(this.id).subscribe(data => {
      this.notificationForm.patchValue({
        title: data.title,
        content: data.content,
      });
    });
  }
}

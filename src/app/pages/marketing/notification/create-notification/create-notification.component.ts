import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CreateNotificationDto } from '../../../../common/dto/notification/create-notification.dto';
import { NotificationService } from '../../../../common/services/api/notification.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNotificationComponent {
  constructor(private notificationService: NotificationService) {}
  formCreateNotification = new FormGroup({
    title: new FormControl('', { nonNullable: true }),
    text: new FormControl('', { nonNullable: true }),
    send: new FormControl(false, { nonNullable: true }),
  });

  onSubmit() {
    const data: CreateNotificationDto = this.formCreateNotification.value as CreateNotificationDto;
    this.notificationService.createNotification(data).subscribe(data => {
      this.formCreateNotification.reset();
    });
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../common/services/api/notification.service';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNotificationComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  notificationForm = new FormGroup({
    title: new FormControl(``, Validators.required),
  });

  id: string = this.router.snapshot.params['id'];

  ngOnInit(): void {
    this.notificationService.getNotification(this.id).subscribe(data => {
      this.notificationForm.patchValue({
        title: data.title,
      });
    });
  }
}

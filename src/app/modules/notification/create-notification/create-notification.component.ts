import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, map, Observable, of, Subject, switchMap, timer } from 'rxjs';
import { TuiFileLike } from '@taiga-ui/kit';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNotificationComponent {
  constructor(private notificationService: NotificationService) {}
  formCreateNotification = new FormGroup({
    title: new FormControl(),
    content: new FormControl(),
  });

  readonly control = new FormControl();

  readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
  readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap(file => (file ? this.makeRequest(file) : of(null)))
  );

  onReject(file: TuiFileLike | readonly TuiFileLike[]): void {
    this.rejectedFiles$.next(file as TuiFileLike);
  }

  removeFile(): void {
    this.control.setValue(null);
  }

  clearRejected(): void {
    this.removeFile();
    this.rejectedFiles$.next(null);
  }

  makeRequest(file: TuiFileLike): Observable<TuiFileLike | null> {
    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.rejectedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  onSubmit() {
    const data: CreateNotificationDto = this.formCreateNotification
      .value as unknown as CreateNotificationDto;
    this.notificationService.createNotification(data).subscribe(data => {
      this.formCreateNotification.reset();
    });
  }
}

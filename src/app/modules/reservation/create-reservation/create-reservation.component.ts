import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ReservationService } from '../reservation.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationComponent {
  constructor(private reservationService: ReservationService) {}

  @Output() createEvent = new EventEmitter();

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  day: TuiDay | null = null;

  formCreateReservation = new FormGroup({
    serviceId: new FormControl(``, Validators.required),
    stationId: new FormControl(``, Validators.required),
    day: new FormControl(``, Validators.required),
    time: new FormControl(``, Validators.required),
  });

  onSubmit(): void {}
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { TuiDay } from '@taiga-ui/cdk';
import { Service } from '../../../common/entities/service.entity';

@Component({
  selector: 'app-create-reservation',
  templateUrl: './create-reservation.component.html',
  styleUrls: ['./create-reservation.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationComponent {
  constructor(private reservationService: ReservationService) {}

  readonly columns = [`name`, 'type', `actions`];
  services: Service[] = [];

  expanded = false;
  toggle(): void {
    this.expanded = !this.expanded;
  }

  day: TuiDay | null = null;

  onSubmit(): void {}
}
